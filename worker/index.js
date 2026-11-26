// Study Companion Worker.
// Serves the static site from ./site and a small API under /api/*.
// Cloudflare Access sits in front of everything; this Worker re-checks the Access
// token on every API call and only shows a person the children they are linked to.
//
//   GET  /api/me                      who is signed in, and which children they can see
//   GET  /api/data                    marked papers and questions for those children
//   GET  /api/progress                saved progress for those children
//   PUT  /api/progress/:student/:kind save one kind of progress for one child
//   GET  /api/family                  parents: children, linked sign-ins, recent changes
//   POST /api/family/link             parents: link an email to a child as a student sign-in
//   POST /api/family/unlink           parents: remove a child's linked sign-in
//   POST /api/import-legacy           parents: one-time copy of the original question log

import legacy from "./legacy.json";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });

// Progress the site keeps per child. Anything else is refused.
export const PROGRESS_KINDS = ["route", "papers", "sat", "cards", "topics", "bprac", "road", "log", "myq", "fdone", "redo"];
const MAX_PROGRESS_BYTES = 300_000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

    try {
      const ident = await verifyAccess(accessToken(request), env);
      if (!ident) return json({ error: "not_signed_in" }, 401);
      const path = url.pathname, method = request.method;

      if (method !== "GET" && !sameOrigin(request, url)) return json({ error: "bad_origin" }, 403);

      if (path === "/api/me" && method === "GET") return json(await me(env, ident));

      const who = await whoIs(env, ident);
      if (!who) return json({ error: "not_linked" }, 403);

      if (path === "/api/data" && method === "GET") return json(await data(env, who, url.searchParams.get("since")));
      if (path === "/api/progress" && method === "GET") return json(await progress(env, who));
      const pm = /^\/api\/progress\/([\w-]+)\/([a-z]+)$/.exec(path);
      if (pm && method === "PUT") return saveProgress(env, who, pm[1], pm[2], request);

      if (path === "/api/family" && method === "GET") return familyView(env, who);
      if (path === "/api/family/link" && method === "POST") return linkChild(env, who, request);
      if (path === "/api/family/unlink" && method === "POST") return unlinkChild(env, who, request);
      if (path === "/api/import-legacy" && method === "POST") return importLegacy(env, who);

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

/* ---------- who is signed in, and what may they see ---------- */

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

async function whoIs(env, ident) {
  const user = await userByEmail(env, ident.email);
  if (!user) return null;
  const students = await visibleStudents(env, user.id);
  return { user, students, byId: Object.fromEntries(students.map((s) => [s.id, s])) };
}

const canWrite = (s) => s && (s.role === "parent" || s.role === "student");
const placeholders = (n) => Array(n).fill("?").join(",");

async function me(env, ident) {
  const user = await userByEmail(env, ident.email);
  if (!user) return { signedIn: true, linked: false, email: ident.email };
  await env.DB.prepare("UPDATE users SET last_seen_at = datetime('now') WHERE id = ?").bind(user.id).run();

  const students = await visibleStudents(env, user.id);
  const ids = students.map((s) => s.id);
  let counts = [];
  if (ids.length) {
    counts = (await env.DB.prepare(
      `SELECT p.student_id, COUNT(DISTINCT p.id) AS papers, COUNT(q.id) AS questions, MAX(p.updated_at) AS updated
         FROM papers p LEFT JOIN question_results q ON q.paper_id = p.id
        WHERE p.student_id IN (${placeholders(ids.length)}) GROUP BY p.student_id`).bind(...ids).all()).results;
  }
  const byStudent = Object.fromEntries(counts.map((c) => [c.student_id, c]));
  const isParent = students.some((s) => s.role === "parent");
  const online = students.reduce((n, s) => n + ((byStudent[s.id] || {}).questions || 0), 0);

  return {
    signedIn: true,
    linked: true,
    user: { name: user.display_name, email: user.email },
    isParent,
    students: students.map((s) => ({
      id: s.id, name: s.display_name, year: s.year_group, role: s.role, code: s.legacy_code,
      papers: (byStudent[s.id] || {}).papers || 0,
      questions: (byStudent[s.id] || {}).questions || 0,
      updated: (byStudent[s.id] || {}).updated || null,
    })),
    legacy: { questions: legacy.q.length, updated: legacy.updated, needed: isParent && online < legacy.q.length },
  };
}

/* ---------- marked papers and questions ---------- */

// Same shape the site has always used: papers keyed by short code, and a flat question list.
// `since` is the signature from an earlier call; if nothing changed the reply is just { unchanged: true }.
async function data(env, who, since) {
  const ids = who.students.map((s) => s.id);
  const out = { papers: {}, q: [], updated: null, sig: "" };
  if (!ids.length) return out;
  const papers = (await env.DB.prepare(
    `SELECT p.*, s.legacy_code FROM papers p JOIN students s ON s.id = p.student_id
      WHERE p.student_id IN (${placeholders(ids.length)}) ORDER BY p.position, p.created_at`).bind(...ids).all()).results;
  const qs = (await env.DB.prepare(
    `SELECT r.*, p.code AS paper_code FROM question_results r JOIN papers p ON p.id = r.paper_id
      WHERE p.student_id IN (${placeholders(ids.length)}) ORDER BY r.position, r.seq`).bind(...ids).all()).results;
  for (const p of papers) {
    out.papers[p.code] = { who: p.legacy_code, subj: p.subject, unit: p.unit, label: p.label, code: p.paper_ref, sat: p.sat_note, score: p.score_text };
    if (!out.updated || p.updated_at > out.updated) out.updated = p.updated_at;
  }
  for (const r of qs) {
    const e = { p: r.paper_code, q: r.question, s: r.section, t: r.topic, m: r.marks_scored, x: r.marks_max, pr: r.prompt, a: r.answer, c: r.correct, e: r.mistake, f: r.fix };
    if (r.also_topics) e.also = JSON.parse(r.also_topics);
    if (r.why) e.w = JSON.parse(r.why);
    if (r.extra) Object.assign(e, JSON.parse(r.extra));
    out.q.push(e);
    if (!out.updated || r.updated_at > out.updated) out.updated = r.updated_at;
  }
  out.sig = `${out.updated}|${papers.length}|${qs.length}`;
  if (since && since === out.sig) return { unchanged: true, sig: out.sig };
  return out;
}

/* ---------- saved progress ---------- */

async function progress(env, who) {
  const ids = who.students.map((s) => s.id);
  const out = {};
  for (const s of who.students) out[s.id] = { values: {}, updated: {} };
  if (!ids.length) return { students: out };
  const rows = (await env.DB.prepare(
    `SELECT student_id, kind, value, updated_at FROM progress WHERE student_id IN (${placeholders(ids.length)})`).bind(...ids).all()).results;
  for (const r of rows) {
    out[r.student_id].values[r.kind] = JSON.parse(r.value);
    out[r.student_id].updated[r.kind] = r.updated_at;
  }
  return { students: out };
}

async function saveProgress(env, who, studentId, kind, request) {
  const s = who.byId[studentId];
  if (!s) return json({ error: "not_your_child" }, 403);
  if (!canWrite(s)) return json({ error: "read_only" }, 403);
  if (!PROGRESS_KINDS.includes(kind)) return json({ error: "unknown_kind" }, 400);
  const text = await request.text();
  if (text.length > MAX_PROGRESS_BYTES) return json({ error: "too_large" }, 413);
  let body;
  try { body = JSON.parse(text); } catch { return json({ error: "bad_json" }, 400); }
  if (!body || !("value" in body)) return json({ error: "missing_value" }, 400);
  const value = JSON.stringify(body.value);
  await env.DB.prepare(
    `INSERT INTO progress (student_id, kind, value, updated_at, updated_by) VALUES (?, ?, ?, datetime('now'), ?)
     ON CONFLICT (student_id, kind) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by`)
    .bind(s.id, kind, value, who.user.id).run();
  const row = await env.DB.prepare("SELECT updated_at FROM progress WHERE student_id = ? AND kind = ?").bind(s.id, kind).first();
  return json({ ok: true, updated: row.updated_at });
}

/* ---------- family: link a child's own sign-in ---------- */

const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[a-z]{2,}$/i;

function parentFamilies(who) {
  return [...new Set(who.students.filter((s) => s.role === "parent").map((s) => s.family_id))];
}

async function familyView(env, who) {
  const fams = parentFamilies(who);
  if (!fams.length) return json({ error: "parents_only" }, 403);
  const ph = placeholders(fams.length);
  const students = (await env.DB.prepare(
    `SELECT id, family_id, display_name, year_group FROM students WHERE family_id IN (${ph}) ORDER BY display_name`).bind(...fams).all()).results;
  const members = (await env.DB.prepare(
    `SELECT m.id, m.role, m.student_id, m.family_id, u.email, u.display_name, u.last_seen_at
       FROM memberships m JOIN users u ON u.id = m.user_id WHERE m.family_id IN (${ph}) ORDER BY m.created_at`).bind(...fams).all()).results;
  const recent = (await env.DB.prepare(
    `SELECT a.at, a.actor_kind, a.action, a.entity, a.detail, u.display_name AS actor
       FROM audit_log a LEFT JOIN users u ON u.id = a.actor_user_id
      WHERE a.family_id IN (${ph}) ORDER BY a.id DESC LIMIT 12`).bind(...fams).all()).results;
  return json({
    parents: members.filter((m) => m.role === "parent").map((m) => ({ email: m.email, name: m.display_name, lastSeen: m.last_seen_at })),
    students: students.map((s) => ({
      id: s.id, name: s.display_name, year: s.year_group,
      logins: members.filter((m) => m.student_id === s.id).map((m) => ({ id: m.id, role: m.role, email: m.email, lastSeen: m.last_seen_at })),
    })),
    recent,
  });
}

async function linkChild(env, who, request) {
  let body; try { body = await request.json(); } catch { return json({ error: "bad_json" }, 400); }
  const s = who.byId[body && body.studentId];
  if (!s || s.role !== "parent") return json({ error: "parents_only" }, 403);
  const email = String((body && body.email) || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) return json({ error: "bad_email" }, 400);

  let user = await userByEmail(env, email);
  if (user) {
    const other = await env.DB.prepare(
      "SELECT 1 FROM memberships WHERE user_id = ? AND family_id <> ? LIMIT 1").bind(user.id, s.family_id).first();
    if (other) return json({ error: "email_in_other_family" }, 409);
    const parent = await env.DB.prepare(
      "SELECT 1 FROM memberships WHERE user_id = ? AND role = 'parent' LIMIT 1").bind(user.id).first();
    if (parent) return json({ error: "email_is_a_parent" }, 409);
  } else {
    const id = "usr_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await env.DB.prepare("INSERT INTO users (id, email) VALUES (?, ?)").bind(id, email).run();
    user = { id, email };
  }
  const mid = "mem_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const res = await env.DB.prepare(
    `INSERT OR IGNORE INTO memberships (id, family_id, user_id, role, student_id) VALUES (?, ?, ?, 'student', ?)`)
    .bind(mid, s.family_id, user.id, s.id).run();
  if (res.meta && res.meta.changes) {
    await audit(env, s.family_id, who.user.id, "link", "student_login", mid, { student: s.display_name, email });
  }
  return familyView(env, who);
}

async function unlinkChild(env, who, request) {
  let body; try { body = await request.json(); } catch { return json({ error: "bad_json" }, 400); }
  const m = await env.DB.prepare(
    `SELECT m.id, m.family_id, m.role, s.display_name AS student, u.email FROM memberships m
       JOIN students s ON s.id = m.student_id JOIN users u ON u.id = m.user_id WHERE m.id = ?`).bind(String((body && body.membershipId) || "")).first();
  if (!m || m.role !== "student" || !parentFamilies(who).includes(m.family_id)) return json({ error: "not_found" }, 404);
  await env.DB.prepare("DELETE FROM memberships WHERE id = ?").bind(m.id).run();
  await audit(env, m.family_id, who.user.id, "unlink", "student_login", m.id, { student: m.student, email: m.email });
  return familyView(env, who);
}

async function audit(env, familyId, userId, action, entity, entityId, detail) {
  await env.DB.prepare(
    `INSERT INTO audit_log (family_id, actor_user_id, actor_kind, action, entity, entity_id, detail) VALUES (?, ?, 'user', ?, ?, ?, ?)`)
    .bind(familyId, userId, action, entity, entityId, JSON.stringify(detail)).run();
}

/* ---------- one-time load of the original question log ---------- */

function parseScore(text) {
  const m = /^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/.exec(text || "");
  return m ? [Number(m[1]), Number(m[2])] : [null, null];
}

async function importLegacy(env, who) {
  const parentOf = who.students.filter((s) => s.role === "parent" && s.legacy_code);
  if (!parentOf.length) return json({ error: "parents_only" }, 403);

  const studentFor = Object.fromEntries(parentOf.map((s) => [s.legacy_code, s]));
  const stmts = [];
  const paperIds = {};
  const groupOf = {};
  let papers = 0, questions = 0;

  Object.entries(legacy.papers).forEach(([code, p], pos) => {
    const s = studentFor[p.who];
    if (!s) return;
    const id = `${s.id}:${code}`;
    paperIds[code] = id;
    const [scored, total] = parseScore(p.score);
    stmts.push(env.DB.prepare(
      `INSERT OR IGNORE INTO papers (id, student_id, code, subject, unit, label, paper_ref, sat_note, score_text, marks_scored, marks_total, source, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'legacy-import', ?)`)
      .bind(id, s.id, code, p.subj ?? null, p.unit ?? null, p.label ?? null, p.code ?? null, p.sat ?? null, p.score ?? null, scored, total, pos));
    papers++;
  });

  const seq = {};
  for (const e of legacy.q) {
    const pid = paperIds[e.p];
    if (!pid) continue;
    if (!(e.p in groupOf)) groupOf[e.p] = Object.keys(groupOf).length;
    seq[pid] = (seq[pid] || 0) + 1;
    const extra = {};
    for (const k of Object.keys(e)) if (!["p", "q", "s", "t", "also", "m", "x", "w", "pr", "a", "c", "e", "f"].includes(k)) extra[k] = e[k];
    stmts.push(env.DB.prepare(
      `INSERT OR IGNORE INTO question_results (id, paper_id, seq, question, section, topic, also_topics, marks_scored, marks_max, why, prompt, answer, correct, mistake, fix, extra, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(`${pid}#${e.q}`, pid, seq[pid], e.q, e.s ?? null, e.t ?? null, e.also ? JSON.stringify(e.also) : null,
        e.m ?? null, e.x ?? null, e.w ? JSON.stringify(e.w) : null, e.pr ?? null, e.a ?? null, e.c ?? null, e.e ?? null, e.f ?? null,
        Object.keys(extra).length ? JSON.stringify(extra) : null, groupOf[e.p] * 1000 + seq[pid]));
    questions++;
  }

  for (let i = 0; i < stmts.length; i += 50) await env.DB.batch(stmts.slice(i, i + 50));

  for (const f of new Set(parentOf.map((s) => s.family_id))) {
    await audit(env, f, who.user.id, "import", "question_log", null, { papers, questions, source: "site/data/questions.js", updated: legacy.updated });
  }
  return json({ ok: true, papers, questions });
}
