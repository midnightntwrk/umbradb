// What one statement costs from the run container to the database, by kind: run inside a node container on the bench
// network (see roundtrip.sh, which sets BENCH_PG_HOST and PGPASSWORD). Each case runs REPEAT times (3000 unless given)
// one after another on one connection; prints p50 / mean in ms. BENCH_PG_PORT is the database's port (5432 unless
// given). The keys asked for are sampled from the database's node and count tables, sent as the build sends a
// parameter (its parameterText), and each case's first answer is checked before anything is timed: a case that found
// nothing would time misses.
//   node roundtrip.mjs <build> <database>
import { createRequire } from "node:module";
import { oneLine } from "./lines.mjs";
oneLine("roundtrip.mjs");
const [build, database] = process.argv.slice(2);
const require = createRequire(`${build}/package.json`);
const postgres = require("postgres");
const { parameterText } = await import(`${build}/dist/deterministic-postgresql/index.js`);
const sql = postgres({ host: process.env.BENCH_PG_HOST, port: Number(process.env.BENCH_PG_PORT ?? 5432), user: "postgres", password: process.env.PGPASSWORD, database, max: 1, prepare: true, fetch_types: false });
const N = Number(process.env.REPEAT ?? 3000);
if (!Number.isInteger(N) || N < 1) throw new Error(`REPEAT is a whole number above 0: ${process.env.REPEAT}`);
const q = (a, p) => [...a].sort((x, y) => x - y)[Math.floor(p * (a.length - 1))];
// The samples as decoded values (a bytea is a Buffer of its bytes). A .raw() answer gives each value as the bytes of
// its text form instead (\x and hex digits), which parameterText would send as other keys.
const nodes = await sql.unsafe("SELECT node_key, children FROM core_ledger_state.nodes ORDER BY node_key LIMIT 2000");
const keys = nodes.map((r) => r.node_key);
const childrenOf = new Map(nodes.map((r) => [r.node_key.toString("hex"), r.children.toString("hex")]));
const counted = (await sql.unsafe("SELECT node_key FROM core_ledger_state.ref_counts ORDER BY node_key LIMIT 2000")).map((r) => r.node_key);
if (keys.length === 0 || counted.length === 0) throw new Error(`${database} has no stored node or no count to sample`);
const pick = (from, n, at) => Array.from({ length: n }, (_, i) => from[(at * 7 + i * 13) % from.length]);
const STORED = "SELECT node_key FROM core_ledger_state.nodes WHERE node_key = ANY($1::bytea[])";
const CHILDREN = "SELECT node_key, children FROM core_ledger_state.nodes WHERE node_key = ANY($1::bytea[])";
const COUNTS = `SELECT k.node_key,
    EXISTS (SELECT 1 FROM core_ledger_state.nodes n WHERE n.node_key = k.node_key) AS stored,
    coalesce(r.count, 0) AS refs, coalesce(c.count, 0) AS roots
  FROM unnest($1::bytea[]) AS k (node_key)
  LEFT JOIN core_ledger_state.ref_counts r ON r.node_key = k.node_key
  LEFT JOIN core_ledger_state.root_counts c ON c.node_key = k.node_key`;
const cases = [
  ["SELECT 1, simple protocol", (i) => sql.unsafe("SELECT 1", [], { simple: true }).raw()],
  ["SELECT $1::int, prepared", (i) => sql.unsafe("SELECT $1::int", ["1"], { prepare: true }).raw()],
  ["SELECT $1::int, not prepared", (i) => sql.unsafe("SELECT $1::int AS unprepared", ["1"], { prepare: false }).raw()],
  ["stored keys, 22 keys", (i) => sql.unsafe(STORED, [parameterText(pick(keys, 22, i), 0)], { prepare: true }).raw()],
  ["children, 5 keys", (i) => sql.unsafe(CHILDREN, [parameterText(pick(keys, 5, i), 0)], { prepare: true }).raw()],
  ["children, 22 keys", (i) => sql.unsafe(CHILDREN, [parameterText(pick(keys, 22, i), 0)], { prepare: true }).raw()],
  ["counts, 5 keys", (i) => sql.unsafe(COUNTS, [parameterText(pick(counted, 5, i), 0)], { prepare: true }).raw()],
  ["counts, 50 keys", (i) => sql.unsafe(COUNTS, [parameterText(pick(counted, 50, i), 0)], { prepare: true }).raw()],
  ["counts, 500 keys", (i) => sql.unsafe(COUNTS, [parameterText(pick(counted, 500, i), 0)], { prepare: true }).raw()],
  ["counts, 1000 keys", (i) => sql.unsafe(COUNTS, [parameterText(pick(counted, 1000, i), 0)], { prepare: true }).raw()],
];
await sql.unsafe("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY", [], { simple: true });
// Each case's first answer, from .raw() as timed: every distinct key asked for is found, a node's children are the ones
// sampled with it, and every count asked for is above 0 (the count table holds no row of 0).
const hex = (key) => key.toString("hex");
const text = (value) => value.toString();
const distinct = (asked) => new Set(asked.map(hex)).size;
for (const [name, run] of cases.filter(([name]) => !name.startsWith("SELECT"))) {
  const asked = name.startsWith("counts") ? null : distinct(pick(keys, Number(/(\d+) keys/.exec(name)[1]), 0));
  const rows = await run(0);
  if (asked !== null && rows.length !== asked) throw new Error(`${name}: ${rows.length} of the ${asked} keys asked for were found: the keys are not asked for as stored`);
  for (const [key, second, refs] of rows) {
    if (name.startsWith("children") && text(second) !== `\\x${childrenOf.get(text(key).slice(2))}`) throw new Error(`${name}: key ${text(key)} answered other children than were sampled with it`);
    if (name.startsWith("counts") && !(Number(text(refs)) > 0)) throw new Error(`${name}: key ${text(key)} answered a count of ${text(refs)}: the keys are not asked for as stored`);
  }
}
console.log("each case's first answer checked: the keys asked for found, with their stored children and counts above 0");
for (const [name, run] of cases) {
  for (let i = 0; i < Math.min(200, N); i++) await run(i);
  const times = [];
  let bytes = 0;
  for (let i = 0; i < N; i++) {
    const t = performance.now();
    const r = await run(i);
    times.push(performance.now() - t);
    if (i === 0) for (const row of r) for (const v of row) bytes += v?.length ?? 0;
  }
  console.log(`${name.padEnd(30)} p50 ${q(times, 0.5).toFixed(3)}  p10 ${q(times, 0.1).toFixed(3)}  p90 ${q(times, 0.9).toFixed(3)}  mean ${(times.reduce((a, b) => a + b, 0) / N).toFixed(3)}  answer ${bytes} bytes`);
}
// The same 14 small statements as one block's step, awaited one after another, then sent together (pipelined).
const fourteen = (i) => Array.from({ length: 14 }, (_, j) => () => sql.unsafe(j % 2 ? COUNTS : CHILDREN, [parameterText(pick(j % 2 ? counted : keys, 22, i + j), 0)], { prepare: true }).raw());
for (const [name, run] of [
  ["14 statements, one after another", async (i) => { for (const s of fourteen(i)) await s(); }],
  ["14 statements, pipelined", (i) => Promise.all(fourteen(i).map((s) => s()))],
]) {
  const n = Math.ceil(N / 3);
  for (let i = 0; i < Math.min(100, n); i++) await run(i);
  const times = [];
  for (let i = 0; i < n; i++) { const t = performance.now(); await run(i); times.push(performance.now() - t); }
  console.log(`${name.padEnd(34)} p50 ${q(times, 0.5).toFixed(3)}  mean ${(times.reduce((a, b) => a + b, 0) / n).toFixed(3)}`);
}
await sql.unsafe("ROLLBACK", [], { simple: true });
await sql.end();
