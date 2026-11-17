// Where the ledger worker's time goes between two applied blocks, and what the main thread waited for meanwhile,
// from a run's trace.jsonl.worker.jsonl and trace.jsonl (src/trace/worker-trace.ts and src/ledger/worker/host.ts say
// what each field is). Mean ms per block, for all blocks, empty blocks and blocks with transactions.
//   node worker-time.mjs <run folder> ...   (SKIP=<n> skips each file's first n lines as warm-up; default 20)
//   FROM=<height> TO=<height> limit the heights
//
// The worker's table adds up to its span, the thread's wall time from one applied block to the next:
//   adapterApply, settle   the apply's two stages, without the time blocked on node reads inside them
//   apply, rest            the apply request outside its two stages (the engine's checks, keeping the result)
//   parse, the phase       the package's parse; "parse, rest": the parse request around it
//   commit … probe         each other request type, start to answer, without its node waits and its answer's post
//   posting answers        the structured clone of the answers, every request type
//   node waits             blocked while the main thread read stored nodes for it, from asking to being woken
//   transit                no request ran and one was already posted by the main thread: the message on its way
//   idle                   no request ran and none was posted: the worker had nothing to do
//   unaccounted            the span less all of the above
// Shown apart, because they overlap the lines above: queued (what requests waited between their post and their
// start, less their transit: the time the requests before them ran) and garbage collection of the worker's heap.
// A run whose worker entries have no spanMs did not record the worker's whole time: nothing is printed for it but
// that, and the script ends with status 1.
import { readFileSync } from "node:fs";
const skip = Number(process.env.SKIP ?? 20);
const from = Number(process.env.FROM ?? 0), to = Number(process.env.TO ?? Infinity);
const lines = (file) => readFileSync(file, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
const v = (r, k) => r[k] ?? 0;
const sum = (r, prefix) => Object.keys(r).reduce((a, k) => (k.startsWith(prefix) ? a + r[k] : a), 0);
const mean = (rows, f) => (rows.length ? rows.reduce((a, r) => a + f(r), 0) / rows.length : NaN);
const cell = (n, w = 9, d = 3) => (Number.isNaN(n) ? "" : n.toFixed(d)).padStart(w);
const within = (r) => r.h >= from && r.h <= to;
const groups = (rows) => [rows, rows.filter((r) => r.tx === 0), rows.filter((r) => r.tx > 0)];
const table = (rows, rowsOf, total) => {
  const [all, empty, tx] = groups(rows);
  const whole = total ? mean(all, total) : NaN;
  for (const [name, f] of rowsOf) {
    const share = total && name !== "blocks" ? `${cell((100 * mean(all, f)) / whole, 7, 1)}%` : "";
    console.log(`  ${name.padEnd(30)}${name === "blocks" ? [all, empty, tx].map((g) => String(g.length).padStart(9)).join("") : cell(mean(all, f)) + cell(mean(empty, f)) + cell(mean(tx, f))}${share}`);
  }
};
const head = (title) => console.log(`  ${title.padEnd(30)}${"all".padStart(9)}${"empty".padStart(9)}${"with tx".padStart(9)}`);

for (const dir of process.argv.slice(2)) {
  const label = dir.split("/").filter(Boolean).at(-1);
  const entries = lines(`${dir}/trace.jsonl.worker.jsonl`);
  if (!entries.some((r) => typeof r.spanMs === "number")) {
    console.log(`\n== ${label}: its worker entries have no spanMs (the worker's whole time was not recorded)`);
    process.exitCode = 1;
    continue;
  }
  // A collection the runtime reported after its span's entry was posted is in a later entry, under its height.
  const lastAt = new Map();
  entries.forEach((r, i) => {
    r.gc = v(r, "gcMs"); r.gcCount = v(r, "gcN");
    lastAt.set(r.h, i);
    for (const k of Object.keys(r)) {
      const late = /^gc(N?)Of\.(\d+)$/.exec(k);
      const owner = late && entries[lastAt.get(Number(late[2])) ?? i];
      if (owner) owner[late[1] ? "gcCount" : "gc"] += r[k];
    }
  });
  const rows = entries.slice(skip).filter(within);
  if (rows.length === 0) {
    console.log(`\n== ${label}: no applied block after the first ${skip} within the heights asked for`);
    process.exitCode = 1;
    continue;
  }
  const types = [...new Set(rows.flatMap((r) => Object.keys(r).filter((k) => k.startsWith("rq.")).map((k) => k.slice(3))))];
  const others = types.filter((t) => !["apply", "genesis", "parse"].includes(t)).sort();
  const stage = (k) => (r) => v(r, k) - v(r, `node.${k}`);
  const applies = (r, prefix) => v(r, `${prefix}apply`) + v(r, `${prefix}genesis`);
  const applyRest = (r) => applies(r, "rq.") - v(r, "adapterApply") - v(r, "settle") - applies(r, "post.") - (applies(r, "node.rq.") - v(r, "node.adapterApply") - v(r, "node.settle"));
  const parseRest = (r) => v(r, "rq.parse") - v(r, "parse") - v(r, "post.parse") - (v(r, "node.rq.parse") - v(r, "node.parse"));
  const unaccounted = (r) => v(r, "spanMs") - sum(r, "rq.") - v(r, "idleMs");
  const span = (r) => v(r, "spanMs");
  console.log(`\n== ${label}: the worker's time, ms per applied block (heights ${rows[0]?.h ?? "-"} to ${rows.at(-1)?.h ?? "-"}; share of the span, all blocks)`);
  head("");
  table(rows, [["blocks", () => 0], ["span", span]], span);
  table(rows, [
    ["  adapterApply", stage("adapterApply")],
    ["  settle", stage("settle")],
    ["  apply, rest", applyRest],
    ["  parse, the phase", stage("parse")],
    ["  parse, rest", parseRest],
    ...others.map((t) => [`  ${t}`, (r) => v(r, `rq.${t}`) - v(r, `post.${t}`) - v(r, `node.rq.${t}`)]),
    ["  posting answers", (r) => sum(r, "post.")],
    ["  node waits", (r) => v(r, "nodeWaitMs")],
    ["  transit", (r) => v(r, "transitMs")],
    ["  idle", (r) => v(r, "idleMs") - v(r, "transitMs")],
    ["  unaccounted", unaccounted],
  ], span);
  console.log("  overlapping the lines above:");
  table(rows, [["  queued", (r) => v(r, "queuedMs")], ["  garbage collection", (r) => r.gc], ["    of it major", (r) => v(r, "gcMajorMs")]], span);
  console.log("  counts per block:");
  table(rows, [
    ...types.sort().map((t) => [`  ${t} requests`, (r) => v(r, `rqN.${t}`)]),
    ["  node waits", (r) => v(r, "nodeWaits")],
    ["  nodes asked of the store", (r) => v(r, "nodeGets")],
    ["  nodes the answers carried", (r) => v(r, "nodeGot")],
    ["  garbage collections", (r) => r.gcCount],
  ]);
  const waits = rows.reduce((a, r) => a + v(r, "nodeWaits"), 0), waited = rows.reduce((a, r) => a + v(r, "nodeWaitMs"), 0);
  const under = (k) => rows.reduce((a, r) => a + v(r, k), 0);
  const inStages = under("node.adapterApply") + under("node.settle");
  console.log(`  node waits: ${waits} of ${(waited / (waits || 1)).toFixed(3)} ms each; by where they fell, ms per block: adapterApply ${cell(under("node.adapterApply") / rows.length, 0)}, settle ${cell(under("node.settle") / rows.length, 0)}, load ${cell(under("node.rq.load") / rows.length, 0)}, other ${cell((waited - inStages - under("node.rq.load")) / rows.length, 0)}`);
  const idleShare = (100 * rows.reduce((a, r) => a + v(r, "idleMs"), 0)) / rows.reduce((a, r) => a + span(r), 0);
  const worst = rows.reduce((a, r) => Math.max(a, Math.abs(unaccounted(r)) / (span(r) || 1)), 0);
  console.log(`  the worker is ${idleShare < 5 ? "saturated" : "waiting for work"}: it had no request to run for ${idleShare.toFixed(1)}% of its span (transit included)`);
  const busy = mean(rows, (r) => span(r) - v(r, "idleMs"));
  console.log(`  unaccounted: ${((100 * mean(rows, unaccounted)) / mean(rows, span)).toFixed(2)}% of the span over all blocks (${((100 * mean(rows, unaccounted)) / busy).toFixed(2)}% of the time it was not idle), at most ${(100 * worst).toFixed(1)}% of one block's`);

  const main = lines(`${dir}/trace.jsonl`);
  for (let i = 1; i < main.length; i++) main[i].total = main[i].t - main[i - 1].t;
  const blocks = main.slice(Math.max(1, skip)).filter(within).map((r) => ({ ...r, tx: r.tx ?? 0 }));
  const trips = [...new Set(blocks.flatMap((r) => Object.keys(r).filter((k) => k.startsWith("rt.")).map((k) => k.slice(3))))].sort();
  console.log(`\n== ${label}: the main thread, ms per committed block (heights ${blocks[0]?.h ?? "-"} to ${blocks.at(-1)?.h ?? "-"}; share of the block, all blocks)`);
  head("");
  const whole = (r) => v(r, "total");
  table(blocks, [["blocks", () => 0], ["the block, by the clock", whole]], whole);
  table(blocks, [
    ["  wait for the block", (r) => v(r, "beginMs")],
    ["  wait for the worker's apply", (r) => v(r, "applyMs") - v(r, "rootWaitMs")],
    ["  wait for the node's root", (r) => v(r, "rootWaitMs")],
    ["  reclamation step", (r) => v(r, "collectMs") + v(r, "stepMs") + v(r, "evictMs")],
    ["  the block's transaction", (r) => v(r, "txMs")],
  ], whole);
  console.log("  also in the block's line (inside the lines above; statements run at once are each counted whole):");
  table(blocks, [
    ["  statements, client time", (r) => v(r, "sqlMs")],
    ["  parameters and rows as text", (r) => v(r, "encMs") + v(r, "decMs")],
    ["  answers' way back", (r) => v(r, "backMs")],
    ["  node requests, to notice", (r) => v(r, "nodeNoticeMs")],
    ["  node requests, to read", (r) => v(r, "nodeReadMs")],
  ], whole);
  console.log("  the worker's requests, post to answer handled (they overlap one another and the lines above):");
  table(blocks, trips.map((t) => [`  ${t}`, (r) => v(r, `rt.${t}`)]), whole);
  console.log("  counts per block:");
  table(blocks, [...trips.map((t) => [`  ${t} answers`, (r) => v(r, `rtN.${t}`)]), ["  node requests", (r) => v(r, "nodeReads")]]);
}
