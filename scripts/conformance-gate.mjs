#!/usr/bin/env node
/**
 * The required conformance gate. [v1.0.0-recovery-testing design §0, §1.1]
 *
 * One command, two guarantees:
 *   1. `vitest run` with the coverage gate (thresholds in `vitest.config.ts`) — the crash, soak
 *      and differential suites run with `UMBRADB_LIVE_PREPROD` UNSET, so they execute against
 *      Testcontainers and do NOT self-skip; a Jest-compatible JSON report is emitted.
 *   2. the `check-required-tests.ts` reconciliation over that report — fails the gate by id if any
 *      manifest `"required"` test did not execute-and-pass (a re-introduced `describe.skipIf`
 *      turns the gate red by id, not by luck); `"deferred"` optional-feature ids reconcile as
 *      `skipped-pending-feature` and never fail the gate.
 *
 * The gate exits non-zero if EITHER vitest (tests OR coverage threshold) OR the reconciliation
 * fails. vitest runs first and always to completion; the reconciliation runs even when vitest
 * failed so a skipped required id is still NAMED. Extra CLI args are forwarded to vitest
 * (e.g. a file filter for a scoped local run).
 *
 * vitest runs under a deadline, `UMBRADB_CONFORMANCE_DEADLINE_MS` (default 60 minutes; a loaded full run takes about
 * 13). A test worker can hang where no test timeout reaches it — V8 stuck in its fatal path while freeing WebAssembly, a
 * busy loop inside PGlite — and the run would then never end. Past the deadline the gate sends SIGTERM to vitest's whole
 * process tree, then SIGKILL after `UMBRADB_CONFORMANCE_KILL_GRACE_MS` (default 10 s), and fails with exit code 124
 * without reconciling, since the run wrote no report. vitest runs in a process group of its own so that the kill
 * reaches its forked workers too; a kill of vitest alone would leave a hung fork orphaned, still running. A SIGINT,
 * SIGTERM or SIGHUP to the gate is passed on to that group, since a Ctrl-C reaches only the terminal's foreground group.
 * [docs/issues/00027, docs/issues/00054]
 */
import { spawn, spawnSync } from "node:child_process";
import { constants } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { existsSync } from "node:fs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = resolve(repoRoot, ".conformance-report.json");
const checker = resolve(repoRoot, "test/integration/check-required-tests.ts");
const forwarded = process.argv.slice(2);

const env = { ...process.env };
// Belt-and-suspenders: the crash/soak/differential suites run on Testcontainers, not the live
// tier — make sure the live gate is unset so nothing self-skips behind it.
delete env.UMBRADB_LIVE_PREPROD;

// Both children run on this Node binary directly, never through a shell: `npx` is a `.cmd` shim on
// Windows, which only a shell can launch, so vitest's own CLI entry is invoked instead.
const vitestCli = resolve(repoRoot, "node_modules/vitest/vitest.mjs");

/**
 * The milliseconds `name` sets, or `fallback` when it is unset: a positive integer that `setTimeout` keeps as given
 * (larger values it fires at once). Anything else ends the gate with exit code 2 before vitest starts.
 * [docs/issues/00027, docs/issues/00054]
 */
function millisecondsFromEnv(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  const value = /^[1-9][0-9]*$/.test(raw) ? Number(raw) : Number.NaN;
  if (!(value <= MAX_TIMER_MS)) {
    console.error(
      `conformance-gate: ${name} must be a positive integer of milliseconds, at most ${MAX_TIMER_MS}; got ${JSON.stringify(raw)}.`,
    );
    process.exit(2);
  }
  return value;
}

/** The largest delay `setTimeout` honours. */
const MAX_TIMER_MS = 2_147_483_647;
const deadlineMs = millisecondsFromEnv("UMBRADB_CONFORMANCE_DEADLINE_MS", 60 * 60 * 1000);
const killGraceMs = millisecondsFromEnv("UMBRADB_CONFORMANCE_KILL_GRACE_MS", 10_000);

/** Exit code of a run the deadline ended, as coreutils' `timeout` uses. */
const TIMED_OUT_EXIT = 124;

// On Windows a detached child gets a console of its own and process groups do not exist; there the tree is ended with
// `taskkill /T` instead. [docs/issues/00027, docs/issues/00054]
const windows = process.platform === "win32";

const vitest = spawn(
  process.execPath,
  [
    vitestCli,
    "run",
    "--coverage",
    "--reporter=default",
    "--reporter=json",
    `--outputFile=${reportPath}`,
    ...forwarded,
  ],
  { cwd: repoRoot, env, stdio: "inherit", detached: !windows },
);

/**
 * Sends `signal` to vitest's whole process tree: its process group, which its forked workers share, or on Windows the
 * tree `taskkill` walks (forcibly, whatever the signal). A group already gone is not an error; any other failure is
 * reported and the gate carries on, since it runs from signal handlers too. [docs/issues/00027, docs/issues/00054]
 */
function signalTree(signal) {
  if (vitest.pid === undefined) return;
  if (windows) {
    spawnSync("taskkill", ["/PID", String(vitest.pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }
  try {
    process.kill(-vitest.pid, signal);
  } catch (error) {
    if (error.code !== "ESRCH") {
      console.error(`conformance-gate: could not send ${signal} to vitest's process group ${vitest.pid}: ${error.message}`);
    }
  }
}

let vitestEnded = false;
const vitestExited = new Promise((resolveExit) => {
  vitest.once("error", (error) => {
    vitestEnded = true;
    console.error(`conformance-gate: could not start vitest: ${error.message}`);
    resolveExit({ code: 1, signal: null });
  });
  vitest.once("exit", (code, signal) => {
    vitestEnded = true;
    resolveExit({ code, signal });
  });
});

/** Waits for vitest to exit, at most `ms`; true if it did. */
async function exitedWithin(ms) {
  let timer;
  const bound = new Promise((resolveBound) => {
    timer = setTimeout(() => resolveBound(false), ms);
  });
  const ended = await Promise.race([vitestExited.then(() => true), bound]);
  clearTimeout(timer);
  return ended;
}

// A signal to the gate is passed on to vitest's group; a second one of any kind kills the group outright.
let interruptedBy;
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => {
    if (interruptedBy === undefined) {
      interruptedBy = signal;
      signalTree(signal);
    } else {
      signalTree("SIGKILL");
    }
  });
}

let deadlineTimer;
const timedOut = await Promise.race([
  vitestExited.then(() => false),
  new Promise((resolveDeadline) => {
    deadlineTimer = setTimeout(() => resolveDeadline(true), deadlineMs);
  }),
]);
clearTimeout(deadlineTimer);

if (timedOut && !vitestEnded) {
  console.error(
    [
      "",
      `conformance-gate: FAILED — vitest ran past its deadline of ${deadlineMs} ms (UMBRADB_CONFORMANCE_DEADLINE_MS) and is being killed with all of its workers.`,
      "A test worker has most likely hung where no test timeout can end it: one fork at ~100 % CPU that prints nothing, with every other file reported.",
      "Known causes: V8 stuck in its fatal-error path while freeing WebAssembly (docs/issues/00027-v8-fatal-wasm-free-hangs-test-worker.md)",
      "and a busy loop inside PGlite (docs/issues/00054-slow-block-case-hung-in-pglite.md). Re-run the unreported file alone; if it hangs again,",
      "take a native `sample` (macOS) or a `--cpu-prof` profile of the worker before killing it.",
    ].join("\n"),
  );
  signalTree("SIGTERM");
  if (!(await exitedWithin(killGraceMs))) {
    signalTree("SIGKILL");
    if (!(await exitedWithin(killGraceMs))) {
      console.error(`conformance-gate: vitest (pid ${vitest.pid}) did not exit after SIGKILL; leaving it.`);
    }
  }
  // Workers that outlived vitest itself, still in its group.
  signalTree("SIGKILL");
  process.exit(TIMED_OUT_EXIT);
}

const vitestResult = await vitestExited;
if (interruptedBy !== undefined) {
  console.error(`conformance-gate: interrupted by ${interruptedBy}; vitest stopped, nothing reconciled.`);
  process.exit(128 + constants.signals[interruptedBy]);
}
const vitestExit = vitestResult.code ?? 1;

if (!existsSync(reportPath)) {
  console.error(
    `\nconformance-gate: FATAL — vitest produced no JSON report at ${reportPath}; cannot reconcile required tests.`,
  );
  process.exit(vitestExit || 1);
}

console.log("\nconformance-gate: reconciling the required-tests manifest against the run…");
const check = spawnSync(
  process.execPath,
  ["--import", "tsx", checker, reportPath],
  { cwd: repoRoot, env, stdio: "inherit" },
);
const checkExit = check.status ?? 1;

if (vitestExit !== 0) console.error(`conformance-gate: vitest exited ${vitestExit} (tests or coverage threshold failed).`);
if (checkExit !== 0) console.error(`conformance-gate: check-required-tests exited ${checkExit} (a required test did not execute-and-pass).`);

process.exit(vitestExit || checkExit);
