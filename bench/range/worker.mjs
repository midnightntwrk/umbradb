// Mean ms per block of each phase of the ledger worker's apply, for empty blocks and blocks with transactions, from a
// run's trace.jsonl.worker.jsonl. Phases nest: adapterApply holds deserialize, segments, wellFormed, cost, stateApply,
// applySystem, events and postBlockUpdate; settle holds stateKey, stateRoot, summary, persist, contracts, release and
// flush. A block's apply is adapterApply + settle. parse runs ahead of the loop and is counted in the block applied
// next. A phase's time includes the time it was blocked on node reads; worker-time.mjs gives the phases without it,
// and the rest of the worker's time.
//   node worker.mjs <run folder> ...      (SKIP=<n> skips each run's first n blocks as warm-up; default 20)
//   FROM=<height> TO=<height> limit the heights
import { jsonLines, oneLine } from "./lines.mjs";
oneLine("worker.mjs");
const skip = Number(process.env.SKIP ?? 20);
const from = Number(process.env.FROM ?? 0), to = Number(process.env.TO ?? Infinity);
const keys = ["parse", "adapterApply", "deserialize", "segments", "wellFormed", "cost", "stateApply", "applySystem", "events", "postBlockUpdate", "settle", "stateKey", "stateRoot", "summary", "persist", "contracts", "release", "flush"];
// The keys of a worker line that are not phases: its height and transactions, its span, the time outside requests, the
// node waits' totals, the collections, the memory; and every key with a dot (requests, node waits by phase).
const NOT_PHASES = new Set(["h", "tx", "spanMs", "idleMs", "transitMs", "queuedMs", "nodeWaitMs", "nodeWaits", "nodeGets", "nodeGot", "gcMs", "gcN", "gcMajorMs", "ext", "heap", "rss"]);
const mean = (rows, k) => (rows.length ? rows.reduce((a, r) => a + (r[k] ?? 0), 0) / rows.length : NaN);
const med = (rows, k) => { const v = rows.map((r) => r[k] ?? 0).sort((a, b) => a - b); return v.length ? v[v.length >> 1] : NaN; };
const total = (rows, f) => f(rows, "adapterApply") + f(rows, "settle");
const cols = [];
for (const dir of process.argv.slice(2)) {
  const t = jsonLines(`${dir}/trace.jsonl.worker.jsonl`).slice(skip).filter((r) => r.h >= from && r.h <= to);
  const e = t.filter((r) => r.tx === 0), x = t.filter((r) => r.tx > 0);
  cols.push({ dir: dir.split("/").filter(Boolean).at(-1), e, x, txs: x.reduce((a, r) => a + r.tx, 0), present: new Set(t.flatMap((r) => Object.keys(r))) });
}
const f = (n) => (Number.isNaN(n) ? "" : n.toFixed(2)).padStart(8);
// A phase is printed only where a run's trace has its key, and one this script does not know after the others, not
// dropped; a run whose trace has no such key prints n/a, not 0.
const seen = new Set(cols.flatMap((c) => [...c.present]));
const traced = [...keys.filter((k) => seen.has(k)), ...[...seen].filter((k) => !keys.includes(k) && !k.includes(".") && !NOT_PHASES.has(k)).sort()];
console.log("phase".padEnd(18) + cols.map((c) => c.dir.slice(0, 26).padStart(26)).join(" | "));
console.log("".padEnd(18) + cols.map(() => "   empty  tx-mean   tx-med").join(" | "));
for (const k of traced) console.log(k.padEnd(18) + cols.map((c) => (c.present.has(k) ? `${f(mean(c.e, k))} ${f(mean(c.x, k))} ${f(med(c.x, k))}` : "n/a".padStart(26))).join(" | "));
console.log("apply".padEnd(18) + cols.map((c) => `${f(total(c.e, mean))} ${f(total(c.x, mean))} ${f(total(c.x, med))}`).join(" | "));
console.log("blocks e/tx, txs".padEnd(18) + cols.map((c) => `${c.e.length}/${c.x.length}, ${c.txs}`.padStart(26)).join(" | "));
