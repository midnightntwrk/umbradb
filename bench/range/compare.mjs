// Compares bench runs: speed, stage means, statements per block, the step's reads, and whether each run's chain of
// step outputs (a SHA-256 over every block's step, in order; `sh` in the trace) equals the first run's.
//   node compare.mjs <run folder> <run folder> ...
// Columns:
//   h/s, ms/blk   from the /status samples: the run as the clock saw it, waits for the node included
//   own h/s       1000 / own, the speed to compare builds by
//   own           ms per block without the two waits for the node: for the block (beginMs) above its median, and for
//                 the node's state root once the worker had answered (rootWaitMs)
//   wait          those two waits, ms per block; a run with a large one was held up by the node, not by the build
//   apply … reads per-block means from the trace: the apply as the main thread saw it less the root wait, the
//                 reclamation step, the block's transaction, the count write, statements, the step's read calls
//   cnt-keys, row-keys   keys the step's count reads and stored-key reads asked for, per block
//   retries       how often the node client retried during the run
// Printed only where a run's trace has one of their keys, with - for a run whose trace has neither:
//   ahead         the share of blocks whose apply was computed ahead of its turn and used, in percent (aheadUsed)
//   dropped       how many results computed ahead were dropped (aheadDropped, written only by a height that dropped one)
// The first height of a run is left out of the means: it loads the ledger package and the stored state.
// A run's chain is the one on its last line that has one (a build that works in batches writes it at a batch's last
// height only), printed with that line's height. The script ends with status 1 if a run's chain differs from the first
// run's or a run has none, and with one line naming the run if one cannot be read.
import { jsonFile, jsonLines, oneLine } from "./lines.mjs";
oneLine("compare.mjs");
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const median = (a) => [...a].sort((x, y) => x - y)[a.length >> 1] ?? 0;
const runs = process.argv.slice(2).map((dir) => {
  const rows = jsonLines(`${dir}/trace.jsonl`).filter((r) => r.st);
  if (rows.length < 2) throw new Error(`${dir}: its trace has ${rows.length === 0 ? "no height" : "one height"}, and a run's first is left out: nothing to read`);
  const res = jsonFile(`${dir}/result.json`);
  for (let i = 1; i < rows.length; i++) rows[i].total = rows[i].t - rows[i - 1].t;
  const body = rows.slice(1);
  const usualBegin = median(body.map((r) => r.beginMs ?? 0));
  for (const r of body) r.wait = Math.max(0, (r.beginMs ?? 0) - usualBegin) + (r.rootWaitMs ?? 0);
  const chain = rows.findLast((r) => typeof r.sh === "string");
  return { name: dir.split("/").filter(Boolean).at(-1), rows, body, res, chain, own: mean(body.map((r) => r.total - r.wait)) };
});
const m = (run, k) => mean(run.body.map((r) => r[k] ?? 0)).toFixed(2);
const keys = (run, kinds) => mean(run.body.map((r) => (r.reads ?? []).filter(([kind]) => kinds.includes(kind)).reduce((sum, [, asked]) => sum + asked, 0))).toFixed(0);
// A column with `keys` is printed only where a run's trace has one of them.
const AHEAD = ["aheadUsed", "aheadDropped"];
const columns = [
  { name: "h/s", width: 6, of: (run) => String(run.res.heightsPerSecond) },
  { name: "ms/blk", width: 7, of: (run) => String(run.res.msPerHeight) },
  { name: "own h/s", width: 8, of: (run) => (1000 / run.own).toFixed(2) },
  { name: "own", width: 6, of: (run) => run.own.toFixed(2) },
  { name: "wait", width: 6, of: (run) => m(run, "wait") },
  { name: "apply", width: 6, of: (run) => mean(run.body.map((r) => (r.applyMs ?? 0) - (r.rootWaitMs ?? 0))).toFixed(2) },
  { name: "step", width: 6, of: (run) => m(run, "stepMs") },
  { name: "blk-tx", width: 7, of: (run) => m(run, "txMs") },
  { name: "cnt-wr", width: 7, of: (run) => m(run, "writeRefcountMs") },
  { name: "stmts", width: 6, of: (run) => m(run, "sqlN") },
  { name: "reads", width: 6, of: (run) => mean(run.body.map((r) => (r.reads ?? []).length)).toFixed(1) },
  { name: "cnt-keys", width: 9, of: (run) => keys(run, ["counts"]) },
  { name: "row-keys", width: 9, of: (run) => keys(run, ["rows", "missing"]) },
  { name: "retries", width: 8, of: (run) => String(run.res.nodeRetries ?? "") },
  { name: "ahead", width: 6, keys: AHEAD, of: (run) => (100 * mean(run.body.map((r) => r.aheadUsed ?? 0))).toFixed(1) },
  { name: "dropped", width: 8, keys: AHEAD, of: (run) => String(run.body.reduce((sum, r) => sum + (r.aheadDropped ?? 0), 0)) },
];
const has = (run, column) => column.keys === undefined || run.rows.some((r) => column.keys.some((key) => key in r));
const shown = columns.filter((column) => runs.some((run) => has(run, column)));
console.log("run".padEnd(20), ...shown.map((column) => column.name.padStart(column.width)), " step chain");
const first = runs[0]?.chain;
// A run whose chain differs from the first's computed another step somewhere: not the same run.
const verdict = (run) => (!run.chain ? null : !first ? "not compared: the first run has no chain" : run.chain.sh === first.sh ? "same" : "DIFFERENT");
for (const run of runs) {
  const cells = shown.map((column) => (has(run, column) ? column.of(run) : "-").padStart(column.width));
  const chain = run.chain ? ` ${run.chain.sh} ${verdict(run)} (h ${run.chain.h}, ${run.res.endState})` : ` no chain (${run.res.endState})`;
  console.log(run.name.padEnd(20), ...cells, chain);
}
if (runs.some((run) => verdict(run) !== "same")) process.exitCode = 1;
