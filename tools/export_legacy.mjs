// Copies the question log from site/data/questions.js into worker/legacy.json,
// which the Worker bundles and loads into the database when a parent asks it to.
// Run after changing questions.js:  node tools/export_legacy.mjs
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const src = readFileSync(new URL("../site/data/questions.js", import.meta.url), "utf8");
const ctx = { window: {} };
vm.runInNewContext(src, ctx);
const Q = ctx.window.QLOG;
if (!Q || !Q.papers || !Array.isArray(Q.q)) throw new Error("questions.js did not define window.QLOG");

const out = { updated: Q.updated, papers: Q.papers, q: Q.q };
writeFileSync(new URL("../worker/legacy.json", import.meta.url), JSON.stringify(out));
console.log(`worker/legacy.json: ${Object.keys(Q.papers).length} papers, ${Q.q.length} questions (updated ${Q.updated})`);
