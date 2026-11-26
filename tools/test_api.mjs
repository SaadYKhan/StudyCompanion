// Local end-to-end test of the API Worker with a throwaway signing key.
// Usage: WRANGLER=/path/to/wrangler node tools/test_api.mjs
// It writes .dev.vars (git-ignored) with a test key set, builds a local D1 copy,
// starts `wrangler dev`, and checks sign-in, permissions and the import.
import { spawn, execFileSync } from "node:child_process";
import http from "node:http";
import { writeFileSync, rmSync, readFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const W = process.env.WRANGLER || "wrangler";
const PORT = 8799;
const AUD = "cff13761920802e28e77690a050dedd7664f94bc7d267cd10f3fd27642d55a9a";
const ISS = "https://royalgroupofcompanies.cloudflareaccess.com";
const b64u = (b) => Buffer.from(b).toString("base64url");

const { publicKey, privateKey } = await crypto.subtle.generateKey(
  { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
const other = await crypto.subtle.generateKey(
  { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
const jwk = await crypto.subtle.exportKey("jwk", publicKey);
writeFileSync(new URL("../.dev.vars", import.meta.url), `TEST_JWKS='${JSON.stringify({ keys: [{ ...jwk, kid: "test1", alg: "RS256", use: "sig" }] })}'\n` +
  `ANTHROPIC_API_KEY=test-key\nANTHROPIC_BASE_URL=http://127.0.0.1:8798\n`);

// A stand-in for Claude's API: the screen and the check answer by keyword; the tutor gives a hint.
const claudeCalls = [];
const fakeClaude = http.createServer((req, res) => {
  let raw = ""; req.on("data", (d) => (raw += d)); req.on("end", () => {
    const b = JSON.parse(raw || "{}"), sys = JSON.stringify(b.system || ""), last = JSON.stringify(b.messages[b.messages.length - 1].content);
    const kind = sys.includes("You screen messages") ? "screen" : sys.includes("You check an AI tutor") ? "check" : "tutor";
    claudeCalls.push({ kind, body: b, key: req.headers["x-api-key"], version: req.headers["anthropic-version"] });
    const send = (o, code = 200) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(o)); };
    if (kind === "screen") {
      const c = /hurt myself/i.test(last) ? "safety" : /football|ignore your rules/i.test(last) ? "off_topic" : "study";
      return send({ content: [{ type: "tool_use", id: "t1", name: "verdict", input: { category: c } }], usage: { input_tokens: 300, output_tokens: 12 } });
    }
    if (kind === "check") return send({ content: [{ type: "tool_use", id: "t2", name: "verdict", input: { verdict: /BADWORD/.test(last) ? "block" : "ok" } }], usage: { input_tokens: 250, output_tokens: 8 } });
    if (/boom/.test(last)) return send({ error: { type: "overloaded_error" } }, 529);
    send({ content: [{ type: "text", text: /makebad/.test(last) ? "BADWORD reply" : "Hint " + b.messages.length + ": which mark-scheme point did you miss?" }], usage: { input_tokens: 1500, output_tokens: 120, cache_read_input_tokens: 0 } });
  });
});
await new Promise((r) => fakeClaude.listen(8798, "127.0.0.1", r));

async function token(claims, { key = privateKey, kid = "test1" } = {}) {
  const now = Math.floor(Date.now() / 1000);
  const h = b64u(JSON.stringify({ alg: "RS256", kid, typ: "JWT" }));
  const p = b64u(JSON.stringify({ aud: [AUD], iss: ISS, iat: now, exp: now + 3600, ...claims }));
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(h + "." + p));
  return h + "." + p + "." + b64u(sig);
}

// Fresh local database with the real schema and a test family.
rmSync(new URL("../.wrangler/state", import.meta.url), { recursive: true, force: true });
const d1 = (args) => execFileSync(W, ["d1", "execute", "studycompanion-db", "--local", ...args], { stdio: "pipe" });
d1(["--file=db/schema.sql"]);
d1(["--command", [
  "INSERT INTO families VALUES ('f1','Test family',datetime('now'))",
  "INSERT INTO users (id,email,display_name) VALUES ('u1','parent@test.local','Parent'),('u2','kid@test.local','Kid')",
  "INSERT INTO students (id,family_id,display_name,legacy_code) VALUES ('s1','f1','MK','a'),('s2','f1','ZK','b')",
  "INSERT INTO memberships (id,family_id,user_id,role) VALUES ('m1','f1','u1','parent')",
  "INSERT INTO memberships (id,family_id,user_id,role,student_id) VALUES ('m2','f1','u2','student','s2')",
  "INSERT INTO families VALUES ('f2','Other family',datetime('now'))",
  "INSERT INTO students (id,family_id,display_name,legacy_code) VALUES ('s9','f2','XX','a')",
  "INSERT INTO users (id,email) VALUES ('u3','other@test.local')",
  "INSERT INTO memberships (id,family_id,user_id,role,student_id) VALUES ('m3','f2','u3','student','s9')",
].join("; ")]);

const dev = spawn(W, ["dev", "--port", String(PORT), "--ip", "127.0.0.1", "--log-level", "warn", "--test-scheduled"], { stdio: ["ignore", "pipe", "pipe"] });
let log = ""; dev.stdout.on("data", (d) => (log += d)); dev.stderr.on("data", (d) => (log += d));
const base = `http://127.0.0.1:${PORT}`;
for (let i = 0; i < 60; i++) { try { await fetch(base + "/"); break; } catch { await new Promise((r) => setTimeout(r, 500)); } }

let failed = 0;
const check = (name, cond, extra = "") => { console.log((cond ? "ok   " : "FAIL ") + name + (cond ? "" : "  " + extra)); if (!cond) failed++; };
const call = async (path, tok, init = {}) => {
  const headers = { ...(init.headers || {}) };
  if (tok) headers["cf-access-jwt-assertion"] = tok;
  const r = await fetch(base + path, { ...init, headers });
  let body = null; try { body = await r.json(); } catch {}
  return { status: r.status, body };
};

try {
  const page = await fetch(base + "/");
  check("site still served", page.status === 200 && (await page.text()).includes("Study Companion"));
  check("no token -> 401", (await call("/api/me")).status === 401);
  check("garbage token -> 401", (await call("/api/me", "a.b.c")).status === 401);
  check("token signed by another key -> 401", (await call("/api/me", await token({ email: "parent@test.local" }, { key: other.privateKey }))).status === 401);
  check("wrong audience -> 401", (await call("/api/me", await token({ email: "parent@test.local", aud: ["someone-else"] }))).status === 401);
  check("wrong issuer -> 401", (await call("/api/me", await token({ email: "parent@test.local", iss: "https://evil.cloudflareaccess.com" }))).status === 401);
  check("expired -> 401", (await call("/api/me", await token({ email: "parent@test.local", exp: Math.floor(Date.now() / 1000) - 600 }))).status === 401);

  const parent = await token({ email: "Parent@Test.Local" });
  let me = await call("/api/me", parent);
  check("parent signed in and linked", me.status === 200 && me.body.linked === true, JSON.stringify(me.body));
  check("parent sees MK and ZK only (not the other family)", JSON.stringify((me.body.students || []).map((s) => s.name)) === '["MK","ZK"]', JSON.stringify(me.body.students));
  check("import offered to parent", me.body.legacy && me.body.legacy.needed === true && me.body.legacy.questions === 246);

  check("import from another site blocked", (await call("/api/import-legacy", parent, { method: "POST", headers: { origin: "https://evil.example" } })).status === 403);
  const imp = await call("/api/import-legacy", parent, { method: "POST", headers: { origin: base } });
  check("import works", imp.status === 200 && imp.body.papers === 10 && imp.body.questions === 246, JSON.stringify(imp.body));
  me = await call("/api/me", parent);
  const mk = (me.body.students || []).find((s) => s.name === "MK"), zk = (me.body.students || []).find((s) => s.name === "ZK");
  check("MK has 9 papers / 207 questions", mk && mk.papers === 9 && mk.questions === 207, JSON.stringify(mk));
  check("ZK has 1 paper / 39 questions", zk && zk.papers === 1 && zk.questions === 39, JSON.stringify(zk));
  check("import no longer offered", me.body.legacy && me.body.legacy.needed === false);
  await call("/api/import-legacy", parent, { method: "POST" });
  const again = await call("/api/me", parent);
  check("running import twice adds nothing", (again.body.students || []).reduce((n, s) => n + s.questions, 0) === 246);

  const kid = await token({ email: "kid@test.local" });
  const kme = await call("/api/me", kid);
  check("student sees only their own record (ZK)", JSON.stringify((kme.body.students || []).map((s) => s.name)) === '["ZK"]', JSON.stringify(kme.body.students));
  check("student cannot run the import", (await call("/api/import-legacy", kid, { method: "POST" })).status === 403);

  const stranger = await call("/api/me", await token({ email: "stranger@test.local" }));
  check("unknown email is signed in but not linked", stranger.status === 200 && stranger.body.linked === false);
  check("unknown API path -> 404", (await call("/api/nope", parent)).status === 404);

  // ---- question data ----
  const put = (path, tok, value, extra = {}) => call(path, tok, { method: "PUT", headers: { "content-type": "application/json", ...(extra.headers || {}) }, body: extra.raw ?? JSON.stringify({ value }) });
  const post = (path, tok, body) => call(path, tok, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const legacy = JSON.parse(readFileSync(new URL("../worker/legacy.json", import.meta.url), "utf8"));
  const pd = await call("/api/data", parent);
  check("parent data: 10 papers in the original order", JSON.stringify(Object.keys(pd.body.papers)) === JSON.stringify(Object.keys(legacy.papers)), Object.keys(pd.body.papers || {}).join());
  check("parent data: 246 questions in the original order", pd.body.q.length === 246 && pd.body.q.map((q) => q.p + q.q).join() === legacy.q.map((q) => q.p + q.q).join());
  const sample = legacy.q.find((q) => q.also && q.w), got = pd.body.q.find((q) => q.p === sample.p && q.q === sample.q);
  check("parent data: a question round-trips intact", JSON.stringify(got) === JSON.stringify(Object.fromEntries(Object.entries(sample).sort())) || JSON.stringify(Object.fromEntries(Object.entries(got).sort())) === JSON.stringify(Object.fromEntries(Object.entries(sample).sort())), JSON.stringify(got));
  check("unchanged data is not sent again", (await call("/api/data?since=" + encodeURIComponent(pd.body.sig), parent)).body.unchanged === true);
  const kd = await call("/api/data", kid);
  check("student data: only their own paper and 39 questions", JSON.stringify(Object.keys(kd.body.papers)) === '["zk1"]' && kd.body.q.length === 39 && kd.body.q.every((q) => q.p === "zk1"));

  // ---- saved progress ----
  check("parent saves MK's cards", (await put("/api/progress/s1/cards", parent, { p01: { b: 1, n: 1 } })).status === 200);
  check("student saves own practice paper", (await put("/api/progress/s2/bprac", kid, [{ id: "x", score: 1, outof: 2 }])).status === 200);
  check("student cannot save to a sibling", (await put("/api/progress/s1/cards", kid, {})).status === 403);
  check("parent cannot save to another family's child", (await put("/api/progress/s9/cards", parent, {})).status === 403);
  check("unknown progress kind refused", (await put("/api/progress/s1/whatever", parent, {})).status === 400);
  check("oversized progress refused", (await put("/api/progress/s1/cards", parent, null, { raw: JSON.stringify({ value: "x".repeat(310000) }) })).status === 413);
  check("progress save from another site blocked", (await put("/api/progress/s1/cards", parent, {}, { headers: { origin: "https://evil.example" } })).status === 403);
  const kp = await call("/api/progress", kid), pp = await call("/api/progress", parent);
  check("student reads only their own progress", JSON.stringify(Object.keys(kp.body.students)) === '["s2"]' && kp.body.students.s2.values.bprac.length === 1);
  check("parent reads both children's progress", pp.body.students.s1.values.cards.p01.b === 1 && pp.body.students.s2.values.bprac[0].id === "x");

  // ---- family: linking a child's own sign-in ----
  check("student cannot open the family page", (await call("/api/family", kid)).status === 403);
  let fam = await call("/api/family", parent);
  check("family page lists MK and ZK with ZK's sign-in", fam.status === 200 && fam.body.students.map((s) => s.name).join() === "MK,ZK" && fam.body.students[1].logins[0].email === "kid@test.local");
  fam = await post("/api/family/link", parent, { studentId: "s1", email: " New.Kid@Test.Local " });
  check("parent links an email to MK", fam.status === 200 && fam.body.students[0].logins.length === 1 && fam.body.students[0].logins[0].email === "new.kid@test.local");
  fam = await post("/api/family/link", parent, { studentId: "s1", email: "new.kid@test.local" });
  check("linking twice does not duplicate", fam.body.students[0].logins.length === 1);
  check("a parent's email cannot become a child's", (await post("/api/family/link", parent, { studentId: "s1", email: "parent@test.local" })).status === 409);
  check("an email from another family is refused", (await post("/api/family/link", parent, { studentId: "s1", email: "other@test.local" })).status === 409);
  check("a bad email is refused", (await post("/api/family/link", parent, { studentId: "s1", email: "not-an-email" })).status === 400);
  check("cannot link to another family's child", (await post("/api/family/link", parent, { studentId: "s9", email: "z@test.local" })).status === 403);
  check("a student cannot link sign-ins", (await post("/api/family/link", kid, { studentId: "s2", email: "y@test.local" })).status === 403);
  const nk = await call("/api/me", await token({ email: "new.kid@test.local" }));
  check("the newly linked child sees only MK", JSON.stringify((nk.body.students || []).map((s) => s.name + ":" + s.role)) === '["MK:student"]');
  const mid = fam.body.students[0].logins[0].id;
  check("a student cannot remove sign-ins", [403, 404].includes((await post("/api/family/unlink", kid, { membershipId: mid })).status));
  fam = await post("/api/family/unlink", parent, { membershipId: mid });
  check("parent removes the sign-in", fam.status === 200 && fam.body.students[0].logins.length === 0);
  check("a removed child no longer sees anything", ((await call("/api/me", await token({ email: "new.kid@test.local" }))).body.students || []).length === 0);
  check("cannot remove another family's sign-in", (await post("/api/family/unlink", parent, { membershipId: "m3" })).status === 404);
  check("changes are in the recent-changes log", fam.body.recent.some((r) => r.action === "link") && fam.body.recent.some((r) => r.action === "unlink"));

  // ---- tutor chat ----
  const zq = legacy.q.find((q) => q.p === "zk1"), mq = legacy.q.find((q) => q.p === "c24");
  const ask = (tok, body) => post("/api/chat", tok, body);
  const setChat = (tok, body) => call("/api/chat/settings", tok, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const tutorCalls = () => claudeCalls.filter((c) => c.kind === "tutor").length;
  const meNow = await call("/api/me", parent);
  check("tutor is configured, and off for both children by default", meNow.body.chatConfigured === true && meNow.body.students.every((s) => s.chat === false));
  check("a child cannot chat until a parent turns it on", (await ask(kid, { studentId: "s2", paper: "zk1", q: zq.q, message: "Why did I lose marks?" })).body.error === "chat_off");
  check("a child cannot change tutor settings", (await setChat(kid, { studentId: "s2", enabled: true })).status === 403);
  check("bad settings are refused", (await setChat(parent, { studentId: "s2", quiet_from: "25:00" })).status === 400 && (await setChat(parent, { studentId: "s2", daily_limit: 500 })).status === 400);
  const d = new Date(Date.now() + 4 * 3600_000), hm = (m) => new Date(d.getTime() + m * 60_000).toISOString().slice(11, 16);
  check("parent turns the tutor on for ZK", (await setChat(parent, { studentId: "s2", enabled: true, daily_limit: 4, quiet_from: hm(-1), quiet_to: hm(5) })).status === 200);
  check("quiet hours block the child", (await ask(kid, { studentId: "s2", paper: "zk1", q: zq.q, message: "help" })).body.error === "quiet_hours");
  await setChat(parent, { studentId: "s2", quiet_from: "00:00", quiet_to: "00:00" });
  let r = await ask(kid, { studentId: "s2", paper: "zk1", q: zq.q, message: "Why did I lose marks?", topic: "Percentages" });
  const tc = claudeCalls.filter((c) => c.kind === "tutor").pop();
  check("child gets a tutor reply", r.status === 200 && r.body.messages[1].role === "tutor" && r.body.messages[1].content.startsWith("Hint"), JSON.stringify(r.body));
  check("tutor sees the marked question, her answer and the coaching rules", tc && tc.key === "test-key" && tc.version === "2023-06-01" &&
    JSON.stringify(tc.body.system).includes(zq.pr.slice(0, 40).replace(/"/g, '\\"')) && JSON.stringify(tc.body.system).includes("Guide; don't hand over") && JSON.stringify(tc.body.system).includes("ZK") && !tc.body.tools);
  const thr = r.body.threadId;
  r = await ask(kid, { threadId: thr, message: "Is it 12%?" });
  check("follow-up keeps the conversation", r.status === 200 && claudeCalls.filter((c) => c.kind === "tutor").pop().body.messages.length === 3);
  const before = tutorCalls();
  r = await ask(kid, { threadId: thr, message: "who won the football last night" });
  check("off-topic gets a fixed reply and never reaches the tutor", r.body.messages[1].role === "notice" && r.body.messages[1].flag === "off_topic" && tutorCalls() === before);
  r = await ask(kid, { threadId: thr, message: "ok and this one" });
  check("fourth message of the day allowed", r.status === 200);
  check("daily limit stops the fifth", (await ask(kid, { threadId: thr, message: "and now?" })).body.error === "daily_limit");
  await setChat(parent, { studentId: "s2", daily_limit: 30 });
  r = await ask(kid, { threadId: thr, message: "I want to hurt myself" });
  check("a safety concern gets helplines, not tutoring", r.body.messages[1].flag === "safety" && r.body.messages[1].content.includes("999") && r.body.messages[1].content.includes("800 4673") && tutorCalls() === before + 1);
  const kthreads = await call("/api/chat/threads?studentId=s2", kid);
  check("the chat is flagged for the parent", kthreads.body.threads[0].flagged === 1);
  r = await ask(kid, { threadId: thr, message: "makebad please" });
  check("a reply that fails the check is replaced", r.body.messages[1].flag === "reply_blocked" && !r.body.messages[1].content.includes("BADWORD"));
  const pv = await call("/api/chat/thread/" + thr, parent), kv = await call("/api/chat/thread/" + thr, kid);
  check("parent can read the whole chat, including the held-back reply", pv.body.messages.some((m) => m.withheld === "BADWORD reply") && pv.body.messages.length === 12, String(pv.body.messages && pv.body.messages.length));
  check("the child does not see the held-back reply", kv.status === 200 && !JSON.stringify(kv.body).includes("BADWORD"));
  const n0 = pv.body.messages.length;
  check("if Claude is down, nothing is saved and the child is told", (await ask(kid, { threadId: thr, message: "boom" })).body.error === "tutor_unavailable" && (await call("/api/chat/thread/" + thr, parent)).body.messages.length === n0);
  check("a child cannot chat about a sibling's question", (await ask(kid, { studentId: "s1", paper: "c24", q: mq.q, message: "hi" })).status === 404);
  r = await ask(parent, { studentId: "s1", paper: "c24", q: mq.q, message: "Explain the idea" });
  check("a parent can try the tutor even while it is off for that child", r.status === 200);
  check("a child cannot read a sibling's chat", (await call("/api/chat/thread/" + r.body.threadId, kid)).status === 404 && (await call("/api/chat/threads?studentId=s1", kid)).status === 404);
  check("empty and over-long messages refused", (await ask(kid, { threadId: thr, message: " " })).status === 400 && (await ask(kid, { threadId: thr, message: "x".repeat(1300) })).status === 400);
  check("unknown question refused", (await ask(kid, { studentId: "s2", paper: "zk1", q: "Q999", message: "hi" })).body.error === "question_not_found");
  const st = await call("/api/chat/settings?studentId=s2", parent);
  check("usage is counted (blocked and failed attempts do not count)", st.body.usage.today === 6 && st.body.usage.monthCents >= 0, JSON.stringify(st.body.usage));
  await setChat(parent, { studentId: "s2", monthly_cap_cents: 0 });
  check("the monthly spending cap stops the chat", (await ask(kid, { threadId: thr, message: "more" })).body.error === "monthly_cap");
  check("tutor settings changes are logged", (await call("/api/family", parent)).body.recent.some((x) => x.action === "chat_settings"));
  d1(["--command", "INSERT INTO chat_threads (id, student_id, title, updated_at) VALUES ('thr_old','s2','old', datetime('now','-120 days')); INSERT INTO chat_messages (thread_id, role, content, created_at) VALUES ('thr_old','student','old message', datetime('now','-120 days'))"]);
  const sch = await fetch(base + "/cdn-cgi/handler/scheduled?cron=17+2+*+*+*");
  if (!sch.ok) await fetch(base + "/__scheduled?cron=17+2+*+*+*");
  await new Promise((r) => setTimeout(r, 500));
  const left = JSON.parse(execFileSync(W, ["d1", "execute", "studycompanion-db", "--local", "--json", "--command", "SELECT (SELECT COUNT(*) FROM chat_messages WHERE thread_id='thr_old') m, (SELECT COUNT(*) FROM chat_threads WHERE id='thr_old') t, (SELECT COUNT(*) FROM chat_messages WHERE thread_id='" + thr + "') keep"], { stdio: "pipe" }).toString());
  const row = left[0].results[0];
  check("the daily clean-up deletes chats older than 90 days and keeps recent ones", row.m === 0 && row.t === 0 && row.keep > 0, JSON.stringify(row));
} finally {
  dev.kill();
  fakeClaude.close();
  rmSync(new URL("../.dev.vars", import.meta.url), { force: true });
}
if (failed) { console.log(log.slice(-3000)); process.exit(1); }
console.log("all API checks passed");
