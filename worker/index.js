// Study Companion Worker.
// Serves the static site from ./site and a small API under /api/*.
// Cloudflare Access sits in front of everything; this Worker re-checks the Access
// token on every API call and only shows a person the children they are linked to.

import legacy from "./legacy.json";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

    try {
      const ident = await verifyAccess(accessToken(request), env);
      if (!ident) return json({ error: "not_signed_in" }, 401);

      if (url.pathname === "/api/me" && request.method === "GET") return json(await me(env, ident));

      if (url.pathname === "/api/import-legacy" && request.method === "POST") {
        if (!sameOrigin(request, url)) return json({ error: "bad_origin" }, 403);
        return importLegacy(env, ident);
      }

      return json({ error: "not_found" }, 404);
    } catch (err) {
      console.error("api error", err && err.stack ? err.stack : err);
      return json({ error: "server_error" }, 500);
    }
  },
};

/* ---------- Cloudflare Access token check ---------- */

function accessToken(request) {
  const h = request.headers.get("cf-access-jwt-assertion");
  if (h) return h;
  const m = (request.headers.get("cookie") || "").match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  return m ? m[1] : null;
}

function b64urlBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(s + "===".slice((s.length + 3) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const b64urlJson = (s) => JSON.parse(new TextDecoder().decode(b64urlBytes(s)));

let certCache = { at: 0, keys: null };
async function accessKeys(env, refresh) {
  if (env.TEST_JWKS) return JSON.parse(env.TEST_JWKS).keys; // local tests only; never set in production
  if (!refresh && certCache.keys && Date.now() - certCache.at < 3600_000) return certCache.keys;
  const res = await fetch(`https://${env.ACCESS_TEAM}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error("Access certs fetch failed: " + res.status);
  const body = await res.json();
  certCache = { at: Date.now(), keys: body.keys || [] };
  return certCache.keys;
}

// Returns { email } for a valid token issued by this account's Access for this app, else null.
export async function verifyAccess(token, env) {
  if (!token || !env.ACCESS_AUD || !env.ACCESS_TEAM) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  let header, payload;
  try { header = b64urlJson(parts[0]); payload = b64urlJson(parts[1]); } catch { return null; }
  if (header.alg !== "RS256" || !header.kid) return null;

  let jwk = (await accessKeys(env)).find((k) => k.kid === header.kid);
  if (!jwk && !env.TEST_JWKS) jwk = (await accessKeys(env, true)).find((k) => k.kid === header.kid); // key rotation
  if (!jwk) return null;

  const key = await crypto.subtle.importKey("jwk", { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlBytes(parts[2]),
    new TextEncoder().encode(parts[0] + "." + parts[1]));
  if (!ok) return null;

  const now = Math.floor(Date.now() / 1000);
  const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!auds.includes(env.ACCESS_AUD)) return null;
  if (payload.iss !== `https://${env.ACCESS_TEAM}`) return null;
  if (typeof payload.exp !== "number" || payload.exp < now - 30) return null;
  if (typeof payload.nbf === "number" && payload.nbf > now + 30) return null;
  if (!payload.email) return null;
  return { email: String(payload.email).toLowerCase() };
}

function sameOrigin(request, url) {
  const origin = request.headers.get("origin");
  return !origin || origin === url.origin;
}

/* ---------- who am I, and which children can I see ---------- */

async function userByEmail(env, email) {
  return env.DB.prepare("SELECT id, email, display_name FROM users WHERE email = ? COLLATE NOCASE").bind(email).first();
}

// Every child this user may see, with the role that grants it. Parents see all children in their families.
async function visibleStudents(env, userId) {
  const { results } = await env.DB.prepare(
    `SELECT s.id, s.family_id, s.display_name, s.legacy_code, s.year_group, s.curriculum, m.role
       FROM memberships m
       JOIN students s ON s.family_id = m.family_id AND (m.role = 'parent' OR s.id = m.student_id)
      WHERE m.user_id = ?
      ORDER BY s.display_name`).bind(userId).all();
  const seen = new Map();
  for (const r of results) if (!seen.has(r.id) || r.role === "parent") seen.set(r.id, r);
  return [...seen.values()];
}

async function me(env, ident) {
  const user = await userByEmail(env, ident.email);
  if (!user) return { signedIn: true, linked: false, email: ident.email };
  await env.DB.prepare("UPDATE users SET last_seen_at = datetime('now') WHERE id = ?").bind(user.id).run();

  const students = await visibleStudents(env, user.id);
  const ids = students.map((s) => s.id);
  let counts = [];
  if (ids.length) {
    const marks = ids.map(() => "?").join(",");
    counts = (await env.DB.prepare(
      `SELECT p.student_id, COUNT(DISTINCT p.id) AS papers, COUNT(q.id) AS questions, MAX(p.updated_at) AS updated
         FROM papers p LEFT JOIN question_results q ON q.paper_id = p.id
        WHERE p.student_id IN (${marks}) GROUP BY p.student_id`).bind(...ids).all()).results;
  }
  const byStudent = Object.fromEntries(counts.map((c) => [c.student_id, c]));
  const isParent = students.some((s) => s.role === "parent");
  const online = students.reduce((n, s) => n + ((byStudent[s.id] || {}).questions || 0), 0);

  return {
    signedIn: true,
    linked: true,
    user: { name: user.display_name, email: user.email },
    students: students.map((s) => ({
      id: s.id, name: s.display_name, year: s.year_group, role: s.role, code: s.legacy_code,
      papers: (byStudent[s.id] || {}).papers || 0,
      questions: (byStudent[s.id] || {}).questions || 0,
      updated: (byStudent[s.id] || {}).updated || null,
    })),
    legacy: { questions: legacy.q.length, updated: legacy.updated, needed: isParent && online < legacy.q.length },
  };
}

/* ---------- one-time load of the existing question log ---------- */

function parseScore(text) {
  const m = /^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/.exec(text || "");
  return m ? [Number(m[1]), Number(m[2])] : [null, null];
}

async function importLegacy(env, ident) {
  const user = await userByEmail(env, ident.email);
  if (!user) return json({ error: "not_linked" }, 403);
  const parentOf = (await visibleStudents(env, user.id)).filter((s) => s.role === "parent" && s.legacy_code);
  if (!parentOf.length) return json({ error: "parents_only" }, 403);

  const studentFor = Object.fromEntries(parentOf.map((s) => [s.legacy_code, s]));
  const stmts = [];
  const paperIds = {};
  let papers = 0, questions = 0;

  for (const [code, p] of Object.entries(legacy.papers)) {
    const s = studentFor[p.who];
    if (!s) continue;
    const id = `${s.id}:${code}`;
    paperIds[code] = id;
    const [scored, total] = parseScore(p.score);
    stmts.push(env.DB.prepare(
      `INSERT OR IGNORE INTO papers (id, student_id, code, subject, unit, label, paper_ref, sat_note, score_text, marks_scored, marks_total, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'legacy-import')`)
      .bind(id, s.id, code, p.subj ?? null, p.unit ?? null, p.label ?? null, p.code ?? null, p.sat ?? null, p.score ?? null, scored, total));
    papers++;
  }

  const seq = {};
  for (const e of legacy.q) {
    const pid = paperIds[e.p];
    if (!pid) continue;
    seq[pid] = (seq[pid] || 0) + 1;
    const extra = {};
    for (const k of Object.keys(e)) if (!["p", "q", "s", "t", "also", "m", "x", "w", "pr", "a", "c", "e", "f"].includes(k)) extra[k] = e[k];
    stmts.push(env.DB.prepare(
      `INSERT OR IGNORE INTO question_results (id, paper_id, seq, question, section, topic, also_topics, marks_scored, marks_max, why, prompt, answer, correct, mistake, fix, extra)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(`${pid}#${e.q}`, pid, seq[pid], e.q, e.s ?? null, e.t ?? null, e.also ? JSON.stringify(e.also) : null,
        e.m ?? null, e.x ?? null, e.w ? JSON.stringify(e.w) : null, e.pr ?? null, e.a ?? null, e.c ?? null, e.e ?? null, e.f ?? null,
        Object.keys(extra).length ? JSON.stringify(extra) : null));
    questions++;
  }

  for (let i = 0; i < stmts.length; i += 50) await env.DB.batch(stmts.slice(i, i + 50));

  const families = [...new Set(parentOf.map((s) => s.family_id))];
  for (const f of families) {
    await env.DB.prepare(`INSERT INTO audit_log (family_id, actor_user_id, actor_kind, action, entity, detail) VALUES (?, ?, 'user', 'import', 'question_log', ?)`)
      .bind(f, user.id, JSON.stringify({ papers, questions, source: "site/data/questions.js", updated: legacy.updated })).run();
  }
  return json({ ok: true, papers, questions });
}
