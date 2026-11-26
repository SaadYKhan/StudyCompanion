// Local end-to-end test of the API Worker with a throwaway signing key.
// Usage: WRANGLER=/path/to/wrangler node tools/test_api.mjs
// It writes .dev.vars (git-ignored) with a test key set, builds a local D1 copy,
// starts `wrangler dev`, and checks sign-in, permissions and the import.
import { spawn, execFileSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";
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
writeFileSync(new URL("../.dev.vars", import.meta.url), `TEST_JWKS='${JSON.stringify({ keys: [{ ...jwk, kid: "test1", alg: "RS256", use: "sig" }] })}'\n`);

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
].join("; ")]);

const dev = spawn(W, ["dev", "--port", String(PORT), "--ip", "127.0.0.1", "--log-level", "warn"], { stdio: ["ignore", "pipe", "pipe"] });
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
} finally {
  dev.kill();
  rmSync(new URL("../.dev.vars", import.meta.url), { force: true });
}
if (failed) { console.log(log.slice(-3000)); process.exit(1); }
console.log("all API checks passed");
