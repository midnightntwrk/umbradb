// What one statement costs from the run container to the database, by kind: run inside a node container on the bench
// network (see roundtrip.sh, which sets BENCH_PG_HOST and PGPASSWORD). Each case runs N times one after another on one connection; prints p50 / mean in ms.
//   node roundtrip.mjs <build> <database>
import { createRequire } from "node:module";
const [build, database] = process.argv.slice(2);
const require = createRequire(`${build}/package.json`);
const postgres = require("postgres");
const { parameterText } = await import(`${build}/dist/deterministic-postgresql/index.js`);
const sql = postgres({ host: process.env.BENCH_PG_HOST, port: 5432, user: "postgres", password: process.env.PGPASSWORD, database, max: 1, prepare: true, fetch_types: false });
const N = 3000;
const q = (a, p) => [...a].sort((x, y) => x - y)[Math.floor(p * (a.length - 1))];
const keys = (await sql.unsafe("SELECT node_key FROM core_ledger_state.nodes ORDER BY node_key LIMIT 2000").raw()).map((r) => r[0]);
const counted = (await sql.unsafe("SELECT node_key FROM core_ledger_state.ref_counts ORDER BY node_key LIMIT 2000").raw()).map((r) => r[0]);
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
for (const [name, run] of cases) {
  for (let i = 0; i < 200; i++) await run(i);
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
  for (let i = 0; i < 100; i++) await run(i);
  const times = [];
  for (let i = 0; i < 1000; i++) { const t = performance.now(); await run(i); times.push(performance.now() - t); }
  console.log(`${name.padEnd(34)} p50 ${q(times, 0.5).toFixed(3)}  mean ${(times.reduce((a, b) => a + b, 0) / 1000).toFixed(3)}`);
}
await sql.unsafe("ROLLBACK", [], { simple: true });
await sql.end();
