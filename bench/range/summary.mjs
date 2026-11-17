// Heights per second of one bench run, from its status.jsonl: first to last sample whose cursor moved. Also how often
// the node client retried (run.log): a run with retries waited for the node, so its speed is not the build's.
//   node summary.mjs <run folder>
// A run whose cursor never moved ends it with status 1 and one line, which points at run.log.
import { existsSync, readFileSync } from "node:fs";
import { jsonLines, oneLine } from "./lines.mjs";
oneLine("summary.mjs");
const out = process.argv[2];
const samples = jsonLines(`${out}/status.jsonl`)
  .filter((s) => s.status?.cursor !== undefined && s.status.cursor !== null)
  .map((s) => ({ at: s.at, cursor: Number(s.status.cursor), state: s.status.state, reason: s.status.reason ?? null }));
const moved = samples.filter((s, i) => i === 0 || s.cursor !== samples[i - 1].cursor);
if (moved.length < 2) throw new Error(`the run committed no height (${samples.length} status samples with a cursor${samples.length ? `, the last ${samples.at(-1).state}` : ""}): see ${out}/run.log`);
const first = moved[0], last = moved[moved.length - 1];
const heights = last.cursor - first.cursor, ms = last.at - first.at;
const log = existsSync(`${out}/run.log`) ? readFileSync(`${out}/run.log`, "utf8") : "";
console.log(JSON.stringify({
  from: first.cursor, to: last.cursor, heights, seconds: +(ms / 1000).toFixed(1),
  heightsPerSecond: +(heights / (ms / 1000)).toFixed(2), msPerHeight: +(ms / heights).toFixed(2),
  endState: samples[samples.length - 1].state, reason: samples[samples.length - 1].reason,
  nodeRetries: log.split("\n").filter((line) => line.startsWith("node retries")).length,
}));
