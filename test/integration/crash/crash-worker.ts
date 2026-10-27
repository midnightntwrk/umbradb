/**
 * The crash harness's worker (required id `crash-harness.smoke.spawn-sigkill-container-survives`,
 * `crash-harness.smoke.test.ts`): a child process, spawned by `test/postgres/setup.ts`'s `spawnCrashWorker`, that opens
 * a transaction on the shared PostgreSQL container, writes in it, and pauses before its `COMMIT` — at a named point,
 * never on a timer — then reports readiness and waits for the parent's SIGKILL.
 *
 * Core-arch task 17.2 retired the 0.9.5 operations this worker used to run (a checkpoint save, a watermark, a key-value
 * write, a held lease) with the required ids 5–25 that drove them (`openspec/changes/core-arch/design.md` §13); task
 * 18.1 retargets it to drive the runner. It imports nothing of `src/` and does not import `setup.ts` (which loads
 * Vitest and Testcontainers).
 */
import postgres from "postgres";

/** Kept equal to `setup.ts`'s `CRASH_WORKER_*_SENTINEL`. */
const READY_SENTINEL = "@@CRASH_WORKER_READY@@";
const ERROR_SENTINEL = "@@CRASH_WORKER_ERROR@@";

/**
 * If the parent never kills this process (a test bug), it exits non-zero after this long instead of staying behind.
 * The parent kills it within a second or two.
 */
const ORPHAN_GUARD_MS = 120_000;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") throw new Error(`crash-worker: required env ${name} is not set`);
  return value;
}

/** Blocks at the current point until the parent's SIGKILL; the ref'd timer keeps the process alive meanwhile. */
function pauseUntilKilled(): Promise<never> {
  return new Promise<never>(() => {
    setTimeout(() => {
      process.stderr.write(`${ERROR_SENTINEL} orphan-guard: parent never SIGKILLed within ${ORPHAN_GUARD_MS}ms\n`);
      process.exit(75);
    }, ORPHAN_GUARD_MS);
  });
}

async function main(): Promise<void> {
  const connectionUri = requireEnv("UMBRADB_TEST_CONNECTION_URI");
  const hook = process.env.UMBRADB_CRASH_HOOK;
  if (hook !== "before-commit") {
    throw new Error(`crash-worker: UMBRADB_CRASH_HOOK must be "before-commit", got ${JSON.stringify(hook)}`);
  }
  const sql = postgres(connectionUri, { max: 1, connect_timeout: 10, onnotice: () => {} });
  // The point: inside the transaction, after its write, before its COMMIT. The callback never returns, so `begin`
  // never commits; the SIGKILL ends the process with the transaction open, and PostgreSQL rolls it back.
  await sql.begin(async (tx) => {
    await tx`CREATE TEMPORARY TABLE crash_worker_probe (n integer) ON COMMIT DROP`;
    await tx`INSERT INTO crash_worker_probe VALUES (1)`;
    const [row] = await tx<{ pid: number }[]>`SELECT pg_backend_pid()::int AS pid`;
    process.stdout.write(`${READY_SENTINEL} ${JSON.stringify({ hook, pid: process.pid, backendPid: row!.pid })}\n`);
    await pauseUntilKilled();
  });
}

main().catch((err: unknown) => {
  const detail = err instanceof Error ? (err.stack ?? err.message) : String(err);
  const line = `${ERROR_SENTINEL} ${detail}\n`;
  process.stderr.write(line);
  // The parent reads stdout: flush the error line there before exiting non-zero.
  process.stdout.write(line, () => process.exit(1));
});
