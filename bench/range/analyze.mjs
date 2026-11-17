// Reads one bench run's folder (trace.jsonl, trace.jsonl.stmts.json, pg_stat_statements.csv) and prints where a
// block's time goes: stages, the reclamation step's reads, and each statement's client time against the server's.
//   node analyze.mjs <run folder>
import { existsSync, readFileSync } from "node:fs";
import { jsonFile, jsonLines, oneLine } from "./lines.mjs";
oneLine("analyze.mjs");
const out = process.argv[2];
const rows = jsonLines(`${out}/trace.jsonl`).filter((r) => r.st);
if (rows.length < 2) throw new Error(`${out}: its trace has ${rows.length === 0 ? "no height" : "one height"}, and a run's first is left out: nothing to read`);
const skeleton = (t) => t.replace(/\$\d+/g, "?").replace(/'[^']*'/g, "?").replace(/\b\d+\b/g, "?").replace(/\s+/g, "").slice(0, 200);
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(p * (s.length - 1))] : 0; };
const f = (n, w = 7, d = 2) => n.toFixed(d).padStart(w);
for (let i = 1; i < rows.length; i++) { rows[i].total = rows[i].t - rows[i - 1].t; rows[i].afterTx = rows[i - 1].tx > 0; }
const body = rows.slice(1);
// A stage is printed only where the trace has its key; `total` is the time between two heights' ends.
const stages = ["total", "beginMs", "prepareMs", "applyMs", "rootWaitMs", "stepMs", "evictMs", "txMs", "writeBlockMs", "writeRefcountMs", "commitMs", "sqlMs", "encMs", "decMs"].filter((s) => s === "total" || rows.some((r) => s in r));
const report = (name, rs) => {
  if (!rs.length) return;
  console.log(`\n== ${name}: ${rs.length} blocks, ${f(1000 / mean(rs.map((r) => r.total)), 0, 1)} heights/s, deltas ${f(mean(rs.map((r) => r.st[3])), 0, 0)}, new ${f(mean(rs.map((r) => r.st[0])), 0, 1)}, deleted ${f(mean(rs.map((r) => r.st[4])), 0, 1)}, rounds ${f(mean(rs.map((r) => r.st[5])), 0, 2)}, statements ${f(mean(rs.map((r) => r.sqlN ?? 0)), 0, 1)}`);
  const tot = mean(rs.map((r) => r.total));
  for (const s of stages) {
    const a = rs.map((r) => r[s] ?? 0);
    console.log(`  ${s.padEnd(16)} mean ${f(mean(a))}  p50 ${f(q(a, 0.5))}  p90 ${f(q(a, 0.9))}  share ${f((100 * mean(a)) / tot, 5, 1)}%`);
  }
};
report("all", body);
report("empty", body.filter((r) => r.tx === 0));
report("empty, after an empty block", body.filter((r) => r.tx === 0 && !r.afterTx));
report("empty, after a block with transactions", body.filter((r) => r.tx === 0 && r.afterTx));
report("with transactions", body.filter((r) => r.tx > 0));
console.log(`\ntransaction share ${(body.filter((r) => r.tx > 0).length / body.length).toFixed(3)}`);

console.log("\n== the step's reads, per block");
const kinds = new Map();
for (const r of body) for (const [kind, keys, ms, found] of r.reads ?? []) {
  const e = kinds.get(kind) ?? { n: 0, ms: 0, keys: 0, found: 0, all: [] };
  e.n += 1; e.ms += ms; e.keys += keys; e.found += found; e.all.push(ms); kinds.set(kind, e);
}
for (const [kind, e] of kinds) console.log(`  ${kind.padEnd(11)} ${f(e.n / body.length, 5, 2)} calls/block  ${f(e.ms / e.n)} ms/call (p50 ${f(q(e.all, 0.5))})  ${f(e.keys / e.n, 7, 1)} keys/call  ${f(e.found / e.n, 7, 1)} found/call  ${f(e.ms / body.length)} ms/block`);
const small = [];
for (const r of body) for (const [kind, keys, ms] of r.reads ?? []) if (keys > 0 && keys <= 30) small.push(ms);
console.log(`  reads of 1–30 keys: n=${small.length} p50 ${f(q(small, 0.5))} ms, p10 ${f(q(small, 0.1))} ms, mean ${f(mean(small))} ms`);
const sizes = [[1, 30], [31, 100], [101, 300], [301, 700], [701, 1000]];
for (const [lo, hi] of sizes) {
  const a = [];
  for (const r of body) for (const [kind, keys, ms] of r.reads ?? []) if (kind === "counts" && keys >= lo && keys <= hi) a.push(ms);
  if (a.length) console.log(`  counts read of ${lo}–${hi} keys: n=${a.length} p50 ${f(q(a, 0.5))} ms`);
}
console.log("\n== writeRefcount by count changes");
for (const [lo, hi] of [[0, 60], [60, 120], [120, 400], [400, 900], [900, 1500], [1500, 99999]]) {
  const x = body.filter((r) => r.st[3] >= lo && r.st[3] < hi);
  if (x.length) console.log(`  ${lo}–${hi}: n=${x.length}  writeRefcount p50 ${f(q(x.map((r) => r.writeRefcountMs ?? 0), 0.5))}  step p50 ${f(q(x.map((r) => r.stepMs ?? 0), 0.5))}  tx p50 ${f(q(x.map((r) => r.txMs ?? 0), 0.5))}  commit p50 ${f(q(x.map((r) => r.commitMs ?? 0), 0.5))}`);
}

if (existsSync(`${out}/trace.jsonl.stmts.json`)) {
  const csv = existsSync(`${out}/pg_stat_statements.csv`) ? readFileSync(`${out}/pg_stat_statements.csv`, "utf8").split("\n").slice(1).filter(Boolean) : [];
  const server = csv.map((line) => {
    const m = line.match(/^(\d+),([\d.]+),([\d.]+),(\d+),(\d+),(\d+),([\d.]+),(.*)$/s);
    if (!m) return null;
    let text = m[8]; if (text.startsWith('"')) text = text.slice(1, -1).replace(/""/g, '"');
    return { calls: +m[1], exec: +m[2], plan: +m[3], wal: +m[7], text };
  }).filter(Boolean);
  const stmts = jsonFile(`${out}/trace.jsonl.stmts.json`).sort((a, b) => b.ms - a.ms);
  const n = rows.length;
  let clientAll = 0, serverAll = 0, callsAll = 0;
  console.log("\n== statements: per block count, client ms per call, server exec ms per call, client ms per block");
  for (const s of stmts) {
    const cut = Math.max(20, Math.min(skeleton(s.q).length - 8, 200));
    const sv = server.find((x) => skeleton(x.text).slice(0, cut) === skeleton(s.q).slice(0, cut));
    const serverMs = sv ? (sv.exec + sv.plan) / sv.calls : NaN;
    clientAll += s.ms; callsAll += s.n; if (sv) serverAll += serverMs * s.n;
    if (s.ms / n < 0.05) continue;
    console.log(`  ${f(s.n / n, 6, 2)}/blk  client ${f(s.ms / s.n, 6, 3)}  server ${Number.isNaN(serverMs) ? "     ?" : f(serverMs, 6, 3)}  ${f(s.ms / n, 6, 2)} ms/blk  ${s.q.slice(0, 60)}${s.q.length > 150 ? " … " + s.q.slice(110, 150) : ""}`);
  }
  console.log(`  total: ${f(callsAll / n, 0, 1)} statements/block, client ${f(clientAll / n, 0, 2)} ms/block, server ${f(serverAll / n, 0, 2)} ms/block, so ${f((clientAll - serverAll) / callsAll, 0, 3)} ms per statement outside the server`);
}
