import { setTimeout as sleep } from "node:timers/promises";
import type { DatabaseParts, PostgresParts } from "../../src/config/database-parts.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { privateCursorHeight } from "../../src/backbone/core-private-source/index.js";
import type { Transaction } from "../../src/db/api.js";
import type { Lockstep, LockstepCondition, LockstepInstance } from "../../src/private/lockstep.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { FinalizedLoop, type HeightRun, type LockstepWait, type LoopInput } from "../../src/runner/loop.js";
import { settlesWithin } from "../db/backends.js";
import { PRIVATE_BACKENDS, type PrivateBackend, REACH_TIMEOUT_MS, START_TIMEOUT_MS, type TestDatabase, TEST_TIMEOUT_MS } from "./backends.js";
import { launchPrivate, launchPublicCore, type PrivateProcess, type PrivateSeen, type PublicCore } from "./builds.js";
import { RetargetProxy } from "./relays.js";

/**
 * A117 `[FAULT]`, the core's wait (task 14.3; PP-6, Q24; required test id `private.lockstep-waits-no-transaction`), on
 * PostgreSQL 18.6 and PGlite 0.5.10: a core listing a private instance in `lockstepInstances` waits before `BEGIN` of
 * each height h until the instance has committed h − 1 — with no transaction open (PostgreSQL's `pg_stat_activity`;
 * on PGlite, its one queue free: a read of the core's database is answered meanwhile) and the condition
 * `waiting-for-lockstep` naming the instance —, both while the instance was never seen since the core started and once
 * it is stopped; it resumes when the instance is back and reports, each on-fetch read of the instance at its block's
 * height exactly; and a core restarted while the instance is at the public cursor does not deadlock (it learns the
 * instance's height from its `hello`). Committed negative controls: a core that opens its block transaction before it
 * waits, and one that skips an instance not seen since its start, each fail the oracle. The report's hash check, the
 * behind-instance refusal and `needsLockstep` are `./lockstep-refusals.test.ts`'s, Q142's reread
 * `./lockstep-reads.test.ts`'s, the loop's own wait `test/runner/lockstep-wait.test.ts`'s.
 */

const LISTED = "lockstep-1";

/** How long a read of the core's database may take while it waits before the queue counts as held (a loaded machine). */
const QUEUE_MS = 30_000;

/** Waits until `check` holds, or fails after `ms`. */
async function until(check: () => boolean, what: string, ms: number = REACH_TIMEOUT_MS): Promise<void> {
  const deadline = Date.now() + ms;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out after ${ms} ms: ${what}`);
    await sleep(20);
  }
}

/** The condition `waiting-for-lockstep` the core raises now, or null. */
function waitingOf(core: PublicCore): LockstepCondition | null {
  const found = core.handle.status().conditions.find((condition) => condition.code === "waiting-for-lockstep");
  return (found as LockstepCondition | undefined) ?? null;
}

/** A core on `db` listing `listed`, its transport on a free port: launched, startup running. */
function lockstepCore(db: TestDatabase, head: bigint, listed: readonly string[], loop?: new (input: LoopInput) => FinalizedLoop): PublicCore {
  return launchPublicCore({
    database: db.setting,
    head,
    extra: { listen: { transport: "127.0.0.1:0" }, lockstepInstances: listed },
    ...(loop === undefined ? {} : { loop }),
  });
}

/** The login of a database setting (PostgreSQL's parts). */
const loginOf = (setting: DatabaseParts): string => (setting as PostgresParts).user;

/** One look at the core while it should wait for lockstep. */
interface WaitSample {
  readonly cursor: bigint | null;
  readonly condition: LockstepCondition | null;
  /** PostgreSQL: the core's sessions with a transaction open; null on PGlite. */
  readonly open: number | null;
  /** Whether a read of the core's database was answered within {@link QUEUE_MS}. */
  readonly queue: "free" | "held";
}

/**
 * Looks at `core` five times, 200 ms apart, once it waits for lockstep (or its cursor reached `head`, or it ended);
 * stops at a held queue.
 */
async function sampleWait(core: PublicCore, db: TestDatabase, backend: PrivateBackend, head: bigint): Promise<WaitSample[]> {
  await until(
    () => waitingOf(core) !== null || core.handle.status().cursor === head || core.handle.status().ended !== null,
    "the core waits for lockstep, or reaches its head",
    START_TIMEOUT_MS,
  );
  const samples: WaitSample[] = [];
  for (let index = 0; index < 5; index++) {
    const probe = core.db().read((read) => read.query("SELECT 1 AS one"));
    probe.catch(() => undefined);
    const queue = (await settlesWithin(probe, QUEUE_MS)) ? "free" : "held";
    const open = backend.kind === "postgres" ? await (db.openTransactions as (login: string) => Promise<number>)(loginOf(db.setting)) : null;
    samples.push({ cursor: core.handle.status().cursor, condition: waitingOf(core), open, queue });
    if (queue === "held") break;
    await sleep(200);
  }
  return samples;
}

/** What one wait should show: the core's cursor, the height it waits to commit, and how it sees the instance. */
interface ExpectedWait {
  readonly cursor: bigint | null;
  readonly height: bigint;
  readonly instance: string;
  readonly connected: boolean;
  /** The heights the core may have learned last (the last report before a stop may come after the close). */
  readonly heights: readonly (bigint | null)[];
}

const shown = (instances: readonly LockstepInstance[]): string =>
  instances.map((one) => `${one.instance} (connected ${one.connected}, at ${one.height}, refused ${one.refused})`).join(", ") || "none";

/** A117's oracle for one wait (see the module comment): every problem, none when it holds. */
export function waitProblems(samples: readonly WaitSample[], expected: ExpectedWait): string[] {
  const problems: string[] = [];
  if (samples.length === 0) problems.push("no look at the core while it waited");
  for (const sample of samples) {
    if (sample.cursor !== expected.cursor) {
      problems.push(`the core moved to ${sample.cursor} while ${expected.instance} was down (it was to wait at ${expected.height})`);
    }
    const named = sample.condition?.instances.find((one) => one.instance === expected.instance);
    if (sample.condition === null) problems.push(`no waiting-for-lockstep while ${expected.instance} was down`);
    else if (
      sample.condition.height !== expected.height ||
      named === undefined ||
      named.connected !== expected.connected ||
      named.refused !== null ||
      !expected.heights.includes(named.height)
    ) {
      problems.push(`waiting-for-lockstep at ${sample.condition.height} named ${shown(sample.condition.instances)}`);
    }
    if (sample.open !== null && sample.open > 0) problems.push(`the core held ${sample.open} transaction(s) open while it waited (pg_stat_activity)`);
    if (sample.queue === "held") {
      problems.push(`a read of the core's database waited over ${QUEUE_MS / 1_000} s while the core waited: its one queue was held`);
    }
  }
  return [...new Set(problems)];
}

/** A negative control's core: it waits for lockstep inside its block transaction, holding it open (and PGlite's queue). */
class WaitsInTransaction extends FinalizedLoop {
  protected override async lockstepWait(): Promise<boolean> {
    return true;
  }

  protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
    const gate = this.input.lockstep as LockstepWait;
    if (!(await gate.wait(run.height, this.input.signal as AbortSignal))) throw new Error("stopped at the lockstep wait");
    await super.write(tx, run);
  }
}

/** A negative control's core: it waits only for the listed instances it has seen since it started. */
class SkipsUnseen extends FinalizedLoop {
  protected override lockstepWait(run: HeightRun): Promise<boolean> {
    return (this.input.lockstep as Lockstep).wait(run.height, this.input.signal as AbortSignal, (instance) => instance.height !== null);
  }
}

/** The private module's rows, `[height, public hash as hex]`. */
async function rowsIn(db: TestDatabase): Promise<[number, string][]> {
  const rows = await db.read((read) => read.query("SELECT height::int AS h, public_hash FROM pm.rows ORDER BY height"), privateCursorHeight);
  return rows.map((row) => [Number(row.h), Buffer.from(row.public_hash as Uint8Array).toString("hex")]);
}

/** The first wait of a core listing {@link LISTED} at head 3, before any instance was seen; then it stops. */
async function firstWait(backend: PrivateBackend, loop?: new (input: LoopInput) => FinalizedLoop): Promise<WaitSample[]> {
  const publicDb = await backend.database("public");
  const core = lockstepCore(publicDb, 3n, [LISTED], loop);
  try {
    await core.handle.started;
    return await sampleWait(core, publicDb, backend, 3n);
  } finally {
    await core.stop();
  }
}

/** The wait expected of a core at S = 1 listing {@link LISTED}, never seen. */
const UNSEEN: ExpectedWait = { cursor: null, height: 1n, instance: LISTED, connected: false, heights: [null] };

/** A117's run on `backend` (see the module comment): every problem found. */
async function a117Problems(backend: PrivateBackend): Promise<string[]> {
  const publicDb = await backend.database("public");
  const privateDb = await backend.database("private");
  const proxy = await RetargetProxy.start();
  const seen: PrivateSeen[] = [];
  const problems: string[] = [];
  let core = lockstepCore(publicDb, 3n, [LISTED]);
  let instance: PrivateProcess | undefined;
  const launch = (): PrivateProcess =>
    launchPrivate({
      database: privateDb.setting,
      instanceId: LISTED,
      coreTransport: proxy.address,
      ...(backend.kind === "postgres" ? { publicDatabase: publicDb.readerSetting as DatabaseParts } : {}),
      extra: { backoffCeilingMs: 1_000 },
      seen,
    });
  const coreAt = (height: bigint) => until(() => core.handle.status().cursor === height, `the core at ${height}`);
  try {
    proxy.retarget(await core.transportWithin(START_TIMEOUT_MS));
    await core.handle.started;
    // Not seen since the core started: it waits at S (Q24).
    problems.push(...waitProblems(await sampleWait(core, publicDb, backend, 3n), UNSEEN));
    // In lockstep: each height commits once the instance committed the one before (its hello, then its reports).
    instance = launch();
    await instance.reach(3n);
    await coreAt(3n);
    // Stopped: the core waits before BEGIN of 4.
    await instance.stop();
    core.source.finalize(6n);
    const stopped = await sampleWait(core, publicDb, backend, 6n);
    problems.push(...waitProblems(stopped, { cursor: 3n, height: 4n, instance: LISTED, connected: false, heights: [2n, 3n] }));
    // Back: the core resumes as it reports.
    instance = launch();
    await instance.reach(6n);
    await coreAt(6n);
    if (waitingOf(core) !== null) problems.push(`with both at 6 the core still raised ${JSON.stringify(waitingOf(core), (_k, v) => (typeof v === "bigint" ? `${v}` : v))}`);
    // The core restarts while the instance is at the public cursor: the instance's hello gives its height, no deadlock.
    await core.stop();
    proxy.retarget(null);
    core = lockstepCore(publicDb, 8n, [LISTED]);
    proxy.retarget(await core.transportWithin(START_TIMEOUT_MS));
    await core.handle.started;
    await instance.reach(8n).catch((error: Error) => problems.push(`after the core's restart the instance stayed: ${error.message}`));
    await coreAt(8n).catch((error: Error) => problems.push(`after its restart the core stayed: ${error.message}`));
  } finally {
    await instance?.stop();
    await core.stop();
    await proxy.close();
  }
  const rows = await rowsIn(privateDb);
  const wanted = Array.from({ length: 8 }, (_, i) => [i + 1, Buffer.from(inMemoryBlock(BigInt(i + 1)).hash).toString("hex")]);
  if (JSON.stringify(rows) !== JSON.stringify(wanted)) problems.push(`the instance's rows are ${JSON.stringify(rows)}, not 1–8 with the public hashes`);
  // Lockstep: each on-fetch read of public data at its block's height exactly, never above (PP-6).
  for (const call of seen.filter((one) => one.point === "on-fetch")) {
    if (call.readHeight !== call.height) problems.push(`on-fetch at ${call.height} read public data at ${call.readHeight}`);
  }
  return problems;
}

describe.each(PRIVATE_BACKENDS)("A117: the core waits for a lockstep instance on $name (PP-6)", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "[[private.lockstep-waits-no-transaction]] A117: a stopped lockstep instance makes the core wait before BEGIN with no " +
      "transaction open and waiting-for-lockstep, and resume when it reports; restarting the core while the instance " +
      "is at the public cursor does not deadlock",
    async () => {
      expect(await a117Problems(backend)).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A117: a core listing an instance but without listen.transport waits for it all the same (Q24: no instance can connect)",
    async () => {
      const publicDb = await backend.database("public");
      const core = launchPublicCore({ database: publicDb.setting, head: 3n, extra: { lockstepInstances: [LISTED] } });
      try {
        await core.handle.started;
        expect(waitProblems(await sampleWait(core, publicDb, backend, 3n), UNSEEN)).toEqual([]);
        expect(core.lines).toContain(`lockstep: height 1 waits for ${LISTED} (not connected)`);
      } finally {
        await core.stop();
      }
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A117 negative control (committed): a core that opens its block transaction before it waits fails the oracle",
    async () => {
      const problems = waitProblems(await firstWait(backend, WaitsInTransaction), UNSEEN);
      expect(problems).toContain(
        backend.kind === "postgres"
          ? "the core held 1 transaction(s) open while it waited (pg_stat_activity)"
          : `a read of the core's database waited over ${QUEUE_MS / 1_000} s while the core waited: its one queue was held`,
      );
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A117 negative control (committed): a core that skips an instance not seen since its start proceeds without it",
    async () => {
      const problems = waitProblems(await firstWait(backend, SkipsUnseen), UNSEEN);
      expect(problems).toContain(`the core moved to 3 while ${LISTED} was down (it was to wait at 1)`);
      expect(problems).toContain(`no waiting-for-lockstep while ${LISTED} was down`);
    },
    TEST_TIMEOUT_MS,
  );
});
