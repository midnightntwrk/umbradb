import type { ChildProcess } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { createInterface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawnChild } from "../child-processes.js";
import { PRIVATE_BACKENDS, PRIVATE_LOGIN, type PrivateBackend, REACH_TIMEOUT_MS, START_TIMEOUT_MS, type TestDatabase, TEST_TIMEOUT_MS } from "./backends.js";
import { startPublicCore } from "./builds.js";
import type { KeyCrashEvent, KeyCrashJob } from "./key-crash.worker.js";
import {
  a119Admission,
  a119Refusals,
  a123Restarts,
  type Admission,
  admissionProblems,
  type KeyCall,
  type KeyRow,
  launchWithKeys,
  refusalProblems,
  registryOf,
  restartProblems,
  viewingKey,
} from "./key-checks.js";

/**
 * Test keys through the key registry (task 14.4; PP-8, CF-11; the key API is not core and left this change, Q70), on
 * PostgreSQL 18.6 and PGlite 0.5.10, each test a public core and private processes on databases of their own:
 *
 * - **A119** `[CI]`: a test key of a kind no configured module declares, or whose bytes its module's `validateKey`
 *   rejects, refuses startup with `invalid-configuration` (a finding at the key's kind or bytes, before the private
 *   database opens: a refusal of the configuration itself, which ends the process, Q137 B); a test key with start h fires
 *   `on-key` once before h's `on-compute` and is stored with `arrived_height` h when h commits; after a crash before
 *   that commit — the process killed with SIGKILL inside h's block transaction (`key-crash.worker.ts`) — it is not
 *   stored, and after the restart it is admitted at h.
 * - **A123** `[CI]`: a private process restarting with a test key it already admitted at its start keeps its
 *   `arrived_height` (and fires no `on-key` for it again); the same key with another start refuses with
 *   `test-key-conflict`; so does a new key whose start is at or below the private cursor (CF-11), and removing a key
 *   from the list leaves it admitted.
 *
 * The oracles are `./key-checks.ts`'s; the committed negative controls (a validation that skips `validateKey`, a
 * registry that admits a known key again at a new height) are `test/config/validate.test.ts`'s and
 * `./keys.negative-control.test.ts`'s. A120 (no key byte on the public side) is `./privacy.test.ts`.
 */

const WORKER = fileURLToPath(new URL("./key-crash.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

/** Whether a refused start touched the private database: a session of the private login, or a PGlite directory. */
function touchedOf(backend: PrivateBackend): (db: TestDatabase) => Promise<boolean> {
  return async (db) => {
    if (backend.kind === "postgres") return ((await db.sessions?.()) ?? []).some((session) => session.login === PRIVATE_LOGIN);
    return existsSync(db.setting.slice("pglite:".length));
  };
}

/** What A119's crash saw: the killed process's events, the registry after the crash, and the restart's admission. */
interface Crash {
  readonly events: readonly KeyCrashEvent[];
  readonly exit: NodeJS.Signals | null;
  readonly afterCrash: { readonly rows: readonly KeyRow[]; readonly cursor: bigint | null };
  readonly restart: Admission;
}

/** The key of A119's crash: `0x5a` × 32 from 4. */
const CRASH_KEY = viewingKey(0x5a, 4);

/** Runs A119's crash on `backend`: the worker killed inside block 4's transaction, then a restart to 6 in this process. */
async function a119Crash(backend: PrivateBackend): Promise<Crash> {
  const head = 6n;
  const publicDb = await backend.database("public");
  const core = await startPublicCore({ database: publicDb.setting, head, extra: { listen: { transport: "127.0.0.1:0" } } });
  let child: ChildProcess | undefined;
  try {
    const privateDb = await backend.database("private");
    const job: KeyCrashJob = {
      database: privateDb.setting,
      ...(backend.kind === "postgres" ? { publicDatabase: publicDb.readerSetting as string } : { coreTransport: core.transport() }),
      key: CRASH_KEY,
      crashAt: String(CRASH_KEY.start),
    };
    child = spawnChild(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], { cwd: REPOSITORY, stdio: ["ignore", "pipe", "pipe"] });
    const events: KeyCrashEvent[] = [];
    let stderr = "";
    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    createInterface({ input: child.stdout as NodeJS.ReadableStream }).on("line", (line) => {
      if (line.startsWith("{")) events.push(JSON.parse(line) as KeyCrashEvent);
    });
    const exited = once(child, "close");
    const deadline = Date.now() + REACH_TIMEOUT_MS;
    while (!events.some((event) => event.event === "in-transaction")) {
      if (child.exitCode !== null || Date.now() > deadline || events.some((event) => event.event === "ended")) {
        throw new Error(`the worker never reached block ${job.crashAt}'s transaction: ${JSON.stringify(events)}; ${stderr.slice(-2000)}`);
      }
      await sleep(20);
    }
    child.kill("SIGKILL");
    await Promise.race([exited, sleep(START_TIMEOUT_MS)]);
    const exit = child.signalCode;
    // PostgreSQL: the server ends the killed process's sessions (rolling back block 4's transaction) once it sees them gone.
    if (backend.kind === "postgres") expect(await privateDb.connected?.(PRIVATE_LOGIN)).toBe(0);
    const afterCrash = await registryOf(privateDb);
    const calls: KeyCall[] = [];
    const restarted = launchWithKeys(backend, publicDb, core, privateDb, calls, [CRASH_KEY]);
    try {
      await restarted.handle.started;
      await restarted.reach(head);
    } finally {
      await restarted.stop();
    }
    const restart: Admission = { key: CRASH_KEY, head, calls, ...(await registryOf(privateDb)) };
    return { events, exit, afterCrash, restart };
  } finally {
    if (child !== undefined && child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    await core.stop();
  }
}

describe.each(PRIVATE_BACKENDS)("test keys through the key registry on $name (PP-8, CF-11)", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "A119: a test key of an undeclared kind, or with bytes its module's validateKey rejects, refuses startup with " +
      "invalid-configuration before the private database opens",
    async () => {
      const found = await a119Refusals(backend, touchedOf(backend));
      expect(refusalProblems(found)).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A119: a test key with start h fires on-key once before h's on-compute and is stored with arrived_height h when h commits",
    async () => {
      const observed = await a119Admission(backend);
      expect(admissionProblems(observed)).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A119: after a crash before h commits the key is not stored, and after the restart it is admitted at h",
    async () => {
      const crash = await a119Crash(backend);
      expect(crash.exit).toBe("SIGKILL");
      // The killed process fired on-key once, with a read at the cursor 3, and was inside 4's transaction.
      expect(crash.events.filter((event) => event.event !== "ended")).toEqual([
        { event: "on-key", read: "3" },
        { event: "in-transaction", height: "4" },
      ]);
      expect(crash.afterCrash).toEqual({ rows: [], cursor: 3n });
      // The restart: pending again at 4, on-key fired once more before 4's on-compute, admitted at 4.
      expect(admissionProblems(crash.restart, 4n)).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A123: a restart with a test key admitted at its start keeps its arrived_height; the same key with another start " +
      "refuses with test-key-conflict",
    async () => {
      const observed = await a123Restarts(backend);
      expect(restartProblems(observed)).toEqual([]);
      expect([observed.moved.code, observed.passed.code]).toEqual(["test-key-conflict", "test-key-conflict"]);
    },
    TEST_TIMEOUT_MS,
  );
});
