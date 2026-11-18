// The contents hash of a bench database, as the build's exported `contentsHash` computes it (node tables by their
// content). Run inside a node container on the bench network (see contents-hash.sh), which sets BENCH_PG_HOST and
// PGPASSWORD.
//   node contents-hash.mjs <build> <database> [<database> ...]
const [build, ...databases] = process.argv.slice(2);
const { openPostgres } = await import(`${build}/dist/db/postgres.js`);
const { contentsHash } = await import(`${build}/dist/index.js`);
const { cursorHeight } = await import(`${build}/dist/backbone/core-block-commit/sql.js`);
for (const name of databases) {
  const db = openPostgres({ connection: { host: process.env.BENCH_PG_HOST, port: 5432, user: "postgres", password: process.env.PGPASSWORD, name, ssl: "disable" }, committedHeight: cursorHeight, readConnections: 1 });
  try {
    const t = performance.now();
    const hash = await db.read((read) => contentsHash(read));
    console.log(`${name.padEnd(26)} ${Buffer.from(hash).toString("hex")}  (${((performance.now() - t) / 1000).toFixed(1)} s)`);
  } finally {
    await db.close?.();
  }
}
process.exit(0);
