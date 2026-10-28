import { compareToBaseline, loadBaseline, REGRESSION_FACTOR } from "./compare.js";
import { commitEmptyBlockPglite, commitEmptyBlockPostgres, workloadName } from "./core.js";
import type { LatencyStats } from "./types.js";

/**
 * `npm run bench:smoke`, the non-gating `bench-smoke.yml` job (`openspec/changes/core-arch/design.md` §13; task 17.3):
 * a short run of the core's benchmark (`./core.ts`, `runner.commitEmptyBlock` on PGlite and on PostgreSQL in Docker)
 * compared with the committed baseline (`bench/baseline.json`, `npm run bench`). A p99 more than ten times the
 * baseline's is a warning for a person to look at; the guard exits 0 whatever the numbers, and 1 only when it could
 * not run (Docker or the process failing), which is not a performance result.
 */

const METHOD = { warmup: 20, iterations: 100 } as const;

try {
  const measured: Record<string, LatencyStats> = {
    [workloadName("pglite")]: await commitEmptyBlockPglite(METHOD),
    [workloadName("postgres")]: (await commitEmptyBlockPostgres(METHOD)).stats,
  };
  const load = loadBaseline();
  console.log("=== bench smoke (coarse, non-gating) ===");
  if (load.status !== "ok") {
    console.warn(
      load.status === "missing"
        ? `  [WARN] no baseline at ${load.path}: nothing compared, THIS IS NOT A RESULT (run npm run bench)`
        : `  [WARN] the baseline at ${load.path} is unreadable (${String(load.error)}): nothing compared, THIS IS NOT A RESULT`,
    );
  }
  const lines = compareToBaseline(measured, load);
  for (const { line } of lines) console.log(`  ${line}`);
  const flagged = lines.filter((line) => line.flagged).length;
  console.log(
    flagged > 0
      ? `\n${flagged} workload(s) above ${REGRESSION_FACTOR}x the baseline's p99: a warning only, never a failure.`
      : `\nno workload above ${REGRESSION_FACTOR}x the baseline's p99 (non-gating).`,
  );
  process.exit(0);
} catch (error) {
  console.error("[bench smoke] could not run (infrastructure, not a performance result):", error);
  process.exit(1);
}
