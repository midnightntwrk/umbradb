import { writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { UMBRADB_VERSION } from "../src/config/build.js";
import { BASELINE_PATH } from "./compare.js";
import { commitEmptyBlockPglite, commitEmptyBlockPostgres, workloadName } from "./core.js";
import { POSTGRES_IMAGE } from "./environment.js";
import type { Baseline } from "./types.js";

/**
 * `npm run bench`: measures the core's benchmark (`./core.ts`, `runner.commitEmptyBlock` on PGlite and on
 * PostgreSQL in Docker) and writes the baseline the bench smoke compares with (`bench/baseline.json`). Run it on a
 * quiet machine and commit the file when the core's commit path changes on purpose.
 */

const METHOD = { warmup: 50, iterations: 500 } as const;

const pglite = await commitEmptyBlockPglite(METHOD);
const postgres = await commitEmptyBlockPostgres(METHOD);
const baseline: Baseline = {
  umbradb: UMBRADB_VERSION,
  recordedOn: new Date().toISOString().slice(0, 10),
  environment: {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    cpus: cpus().length,
    postgresImage: POSTGRES_IMAGE,
    postgresServer: postgres.serverVersion,
    postgresImageId: postgres.imageId,
  },
  method: { ...METHOD },
  workloads: { [workloadName("pglite")]: pglite, [workloadName("postgres")]: postgres.stats },
};
writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`);
for (const [name, stats] of Object.entries(baseline.workloads)) {
  console.log(`${name.padEnd(36)} p50=${stats.p50.toFixed(3)}ms p95=${stats.p95.toFixed(3)}ms p99=${stats.p99.toFixed(3)}ms cv=${stats.cv.toFixed(3)}`);
}
console.log(`baseline written to ${BASELINE_PATH}`);
