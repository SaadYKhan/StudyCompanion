// Reminders: Web Push notifications to the devices where someone turned reminders on.
//
// The Worker makes its own VAPID key pair the first time it is needed and keeps it in D1 (app_keys),
// so no secret is handled by hand. Messages are encrypted for each device (RFC 8291, aes128gcm).
// The daily run (16:07 in Dubai) sends, per signed-in person:
//   a child:  a nudge if nothing is done yet today, plus that day's deadline reminders;
//   a parent: each child's deadline reminders, and on Sundays a one-line weekly summary.
// Reminder dates are worked out in the browser (progress kind 'remind') from the same dates the site shows.

const enc = new TextEncoder();
const SITE = "https://studycompanion.royalgroup.workers.dev";
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

export function b64u(bytes) {
  let s = ""; const b = new Uint8Array(bytes);
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function unb64u(s) {
  s = String(s).replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
  const r = atob(s), o = new Uint8Array(r.length); for (let i = 0; i < r.length; i++) o[i] = r.charCodeAt(i); return o;
}
const concat = (...a) => { const n = a.reduce((s, x) => s + x.length, 0), o = new Uint8Array(n); let p = 0; for (const x of a) { o.set(x, p); p += x.length; } return o; };

/* ---------- keys ---------- */
export async function vapidKeys(env) {
  let row = await env.DB.prepare("SELECT value FROM app_keys WHERE name = 'vapid'").first();
  if (!row) {
    const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
    const jwk = await crypto.subtle.exportKey("jwk", kp.privateKey), pub = new Uint8Array(await crypto.subtle.exportKey("raw", kp.publicKey));
    await env.DB.prepare("INSERT OR IGNORE INTO app_keys (name, value) VALUES ('vapid', ?)").bind(JSON.stringify({ jwk, pub: b64u(pub) })).run();
    row = await env.DB.prepare("SELECT value FROM app_keys WHERE name = 'vapid'").first();
  }
  const v = JSON.parse(row.value);
  const key = await crypto.subtle.importKey("jwk", v.jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  return { pub: v.pub, key };
}
async function vapidHeader(keys, endpoint) {
  const aud = new URL(endpoint).origin, exp = Math.floor(Date.now() / 1000) + 12 * 3600;
  const head = b64u(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" }))), body = b64u(enc.encode(JSON.stringify({ aud, exp, sub: SITE })));
  const sig = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, keys.key, enc.encode(head + "." + body)));
  return `vapid t=${head}.${body}.${b64u(sig)}, k=${keys.pub}`;
}

/* ---------- RFC 8291 message encryption ---------- */
async function hkdf(salt, ikm, info, len) {
  const k = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, k, len * 8));
}
export async function encrypt(plain, p256dh, authSecret, fixed = {}) {
  const uaPub = unb64u(p256dh), auth = unb64u(authSecret);
  const as = fixed.keyPair || await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPub = new Uint8Array(await crypto.subtle.exportKey("raw", as.publicKey));
  const ua = await crypto.subtle.importKey("raw", uaPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: ua }, as.privateKey, 256));
  const ikm = await hkdf(auth, shared, concat(enc.encode("WebPush: info\0"), uaPub, asPub), 32);
  const salt = fixed.salt || crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(salt, ikm, enc.encode("Content-Encoding: nonce\0"), 12);
  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const data = concat(typeof plain === "string" ? enc.encode(plain) : plain, new Uint8Array([2]));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, data));
  const rs = new Uint8Array([0, 0, 16, 0]);   // record size 4096
  return concat(salt, rs, new Uint8Array([asPub.length]), asPub, ct);
}

/* ---------- sending ---------- */
export async function sendTo(env, keys, sub, msg) {
  const body = await encrypt(JSON.stringify(msg), sub.p256dh, sub.auth);
  let res;
  try {
    res = await fetch(sub.endpoint, { method: "POST", body, headers: {
      "content-encoding": "aes128gcm", "content-type": "application/octet-stream", ttl: "43200", urgency: "normal",
      authorization: await vapidHeader(keys, sub.endpoint) } });
  } catch (e) { res = { status: 0 }; }
  if (res.status === 404 || res.status === 410) { await env.DB.prepare("DELETE FROM push_subs WHERE id = ?").bind(sub.id).run(); return false; }
  if (res.status >= 200 && res.status < 300) { await env.DB.prepare("UPDATE push_subs SET last_ok_at = datetime('now'), fails = 0 WHERE id = ?").bind(sub.id).run(); return true; }
  await env.DB.prepare("UPDATE push_subs SET fails = fails + 1 WHERE id = ?").bind(sub.id).run();
  await env.DB.prepare("DELETE FROM push_subs WHERE id = ? AND fails >= 10").bind(sub.id).run();
  return false;
}

/* ---------- API ---------- */
export async function route(env, who, request, path, method) {
  if (path === "/api/push/key" && method === "GET") return json({ key: (await vapidKeys(env)).pub });
  if (path === "/api/push/subscribe" && method === "POST") {
    let b; try { b = await request.json(); } catch { return json({ error: "bad_json" }, 400); }
    const ep = String(b && b.endpoint || ""), k = (b && b.keys) || {};
    const scheme = /^https:\/\//.test(ep) || (env.PUSH_ALLOW_HTTP === "1" && /^http:\/\/127\.0\.0\.1:\d+\//.test(ep));   // plain http only in local tests
    if (!scheme || ep.length > 1000 || !/^[\w-]{80,100}$/.test(k.p256dh || "") || !/^[\w-]{16,30}$/.test(k.auth || "")) return json({ error: "bad_subscription" }, 400);
    await env.DB.prepare(`INSERT INTO push_subs (id, user_id, endpoint, p256dh, auth) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (endpoint) DO UPDATE SET user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth, fails = 0`)
      .bind("ps_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16), who.user.id, ep, k.p256dh, k.auth).run();
    return json({ ok: true });
  }
  if (path === "/api/push/unsubscribe" && method === "POST") {
    let b; try { b = await request.json(); } catch { return json({ error: "bad_json" }, 400); }
    await env.DB.prepare("DELETE FROM push_subs WHERE endpoint = ? AND user_id = ?").bind(String(b && b.endpoint || ""), who.user.id).run();
    return json({ ok: true });
  }
  if (path === "/api/push/test" && method === "POST") {
    const subs = (await env.DB.prepare("SELECT * FROM push_subs WHERE user_id = ?").bind(who.user.id).all()).results;
    const keys = await vapidKeys(env); let sent = 0;
    for (const s of subs) if (await sendTo(env, keys, s, { title: "Study Companion", body: "Reminders are working on this device.", url: "/#today", tag: "test" })) sent++;
    return json({ ok: true, sent });
  }
  return null;
}

/* ---------- the daily run ---------- */
export function dubaiDate(ms = Date.now()) {
  const d = new Date(ms + 4 * 3600000);
  return { iso: d.toISOString().slice(0, 10), dow: d.getUTCDay() };
}
const addDays = (iso, n) => new Date(Date.parse(iso + "T00:00:00Z") + n * 86400000).toISOString().slice(0, 10);

function activeOn(vals, code, day) {
  const d = (vals.days || {})[code + ":" + day] || {};
  if (d.c || d.r || d.p || d.x || d.q) return true;
  return (vals.log || []).some((r) => r.who === code && r.date === day && r.min > 0) || (vals.reading || []).some((r) => r.who === code && r.date === day && r.min > 0);
}
export async function daily(env, ms = Date.now()) {
  const subs = (await env.DB.prepare("SELECT * FROM push_subs").all()).results;
  if (!subs.length) return { users: 0, sent: 0 };
  const { iso: today, dow } = dubaiDate(ms), monday = addDays(today, -((dow + 6) % 7));
  const keys = await vapidKeys(env), byUser = new Map(), vals = new Map();
  for (const s of subs) { if (!byUser.has(s.user_id)) byUser.set(s.user_id, []); byUser.get(s.user_id).push(s); }
  const progressFor = async (sid) => {
    if (vals.has(sid)) return vals.get(sid);
    const rows = (await env.DB.prepare("SELECT kind, value FROM progress WHERE student_id = ? AND kind IN ('days', 'log', 'reading', 'remind')").bind(sid).all()).results;
    const o = {}; for (const r of rows) { try { o[r.kind] = JSON.parse(r.value); } catch { /* skip */ } }
    vals.set(sid, o); return o;
  };
  let sent = 0;
  for (const [userId, list] of byUser) {
    const kids = (await env.DB.prepare(
      `SELECT s.id, s.display_name, s.legacy_code, m.role FROM memberships m
         JOIN students s ON s.family_id = m.family_id AND (m.role = 'parent' OR s.id = m.student_id)
        WHERE m.user_id = ?`).bind(userId).all()).results;
    const parent = kids.some((k) => k.role === "parent"), lines = [];
    for (const k of kids) {
      const v = await progressFor(k.id), code = k.legacy_code || "";
      const rem = Object.keys(v.remind || {}).filter((key) => key.startsWith(code + ":" + today + ":")).map((key) => v.remind[key].t);
      if (parent) {
        rem.forEach((t) => lines.push(k.display_name + ": " + t));
      } else if (k.role === "student") {
        const day = (v.days || {})[code + ":" + today] || {};
        if (!day.off && !activeOn(v, code, today)) lines.push(activeOn(v, code, addDays(today, -1)) ? "Nothing ticked off yet today. One task keeps your streak going." : "Today's list is waiting: three small things.");
        rem.forEach((t) => lines.push(t));
      }
    }
    if (parent && dow === 0) {
      const parts = [];
      for (const k of kids) {
        const v = await progressFor(k.id), code = k.legacy_code || ""; let days = 0, min = 0;
        for (let d = monday; d <= today; d = addDays(d, 1)) { if (activeOn(v, code, d)) days++; min += (v.log || []).filter((r) => r.who === code && r.date === d).reduce((s, r) => s + (r.min || 0), 0); }
        parts.push(`${k.display_name} ${days} day${days === 1 ? "" : "s"}, ${Math.round(min / 6) / 10} h`);
      }
      if (parts.length) lines.unshift("Weekly report: " + parts.join(" · ") + ".");
    }
    if (!lines.length) continue;
    const msg = { title: "Study Companion", body: lines.slice(0, 4).join("\n"), url: parent && dow === 0 ? "/#report" : "/#today", tag: "daily-" + today };
    for (const s of list) if (await sendTo(env, keys, s, msg)) sent++;
  }
  return { users: byUser.size, sent };
}
