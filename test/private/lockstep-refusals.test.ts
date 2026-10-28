import { setTimeout as sleep } from "node:timers/promises";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { privateCursorHeight } from "../../src/backbone/core-private-source/index.js";
import { UmbraError } from "../../src/db/errors.js";
import type { LockstepCondition, LockstepInstance } from "../../src/private/lockstep.js";
import { hexOf } from "../../src/private/messages.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import type { ProcessStatus } from "../../src/runner/process.js";
import { PRIVATE_BACKENDS, type PrivateBackend, REACH_TIMEOUT_MS, START_TIMEOUT_MS, type TestDatabase, TEST_TIMEOUT_MS } from "./backends.js";
import {
  launchPrivate,
  launchPublicCore,
  type PrivateOptions,
  type PrivateProcess,
  privateModule,
  type PrivateSeen,
  type PublicCore,
  refusalOf,
} from "./builds.js";
import { ReportRelay } from "./relays.js";

/**
 * Lockstep's refusals and halts (task 14.3; PP-6, PP-7, Q24; `design.md` §11), through a core and private processes on
 * PostgreSQL 18.6 and PGlite 0.5.10:
 * - A118 `[CI]`: an instance that ran independently to 3 while the core went on to 10, then listed in
 *   `lockstepInstances`, says `hello` at 3 and is refused `lockstep-behind` (below the public cursor − 1); it halts with
 *   `lockstep-behind` at its first height, 4, by its own check (the public cursor 10 is past it), and the core keeps
 *   waiting before 11, `waiting-for-lockstep` naming it — connected, then not once it stops.
 * - A117 `[FAULT]`, its last two sentences: a `report` whose hash is not the public block's (a relay rewrites it) closes
 *   the instance's connection with `report-hash-mismatch`, the instance halts with that code and the core keeps waiting
 *   for it; a module declaring `needsLockstep` refuses to start with `needs-lockstep-not-listed` on an instance the
 *   core's `hello-ack` says is not lockstep, and on one with no `coreTransport`, before any migration — and runs on a
 *   listed one.
 * The report check's negative control is `./transport-faults.test.ts`'s (a core comparing nothing).
 */

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

/** A core on `db` with its transport on a free port, listing `listed`: launched, startup running. */
const coreOn = (db: TestDatabase, head: bigint, listed: readonly string[]): PublicCore =>
  launchPublicCore({ database: db.setting, head, extra: { listen: { transport: "127.0.0.1:0" }, lockstepInstances: listed } });

/** A private process's public side on `backend`: PostgreSQL read directly, PGlite through the core. */
const publicSide = (backend: PrivateBackend, db: TestDatabase): Partial<PrivateOptions> =>
  backend.kind === "postgres" ? { publicDatabase: db.readerSetting as DatabaseParts } : {};

/** Waits until `process` has halted or ended, and gives its status. */
async function haltOf(process: PrivateProcess): Promise<ProcessStatus> {
  await until(() => process.handle.status().state === "halted" || process.handle.status().ended !== null, "the instance halts");
  return process.handle.status();
}

/** The heights of the private module `pm`'s rows. */
async function rowHeights(db: TestDatabase, schema = "pm"): Promise<number[]> {
  const rows = await db.read((read) => read.query(`SELECT height::int AS h FROM ${schema}.rows ORDER BY height`), privateCursorHeight);
  return rows.map((row) => Number(row.h));
}

const json = (value: unknown): string => JSON.stringify(value, (_k, v: unknown) => (typeof v === "bigint" ? `${v}` : v));

/** Whether `instance` is named in `condition` at `height` as `wanted`. */
function names(condition: LockstepCondition | null, height: bigint, wanted: LockstepInstance): boolean {
  return condition?.height === height && condition.instances.some((one) => json(one) === json(wanted));
}

// ── A118 ────────────────────────────────────────────────────────────────────────────────────────────────────────

const LATE = "late-1";

/** What one A118 run saw. */
interface A118Observation {
  readonly coreLines: readonly string[];
  readonly lines: readonly string[];
  readonly halted: ProcessStatus;
  readonly rows: readonly number[];
  /** The core's cursor and condition while the instance was halted, connected. */
  readonly whileConnected: readonly { readonly cursor: bigint | null; readonly condition: LockstepCondition | null }[];
  /** The condition once the instance stopped. */
  readonly afterStop: LockstepCondition | null;
}

/** A118's oracle: every problem with what was observed, none when A118 holds. */
function a118Problems(observed: A118Observation): string[] {
  const problems: string[] = [];
  if (!observed.coreLines.includes(`transport: instance ${LATE} connected at 3; refused lockstep-behind: below the public cursor 10 − 1 (PP-7)`)) {
    problems.push(`the core did not refuse ${LATE}'s hello at 3 with lockstep-behind: ${observed.coreLines.filter((l) => l.includes(LATE)).join(" | ")}`);
  }
  if (!observed.lines.some((line) => line.endsWith("; refused lockstep-behind: this instance is behind the public cursor (PP-7)"))) {
    problems.push("the instance was not told lockstep-behind");
  }
  const { halted } = observed;
  if (halted.state !== "halted" || halted.reason?.code !== "lockstep-behind" || halted.reason.height !== 4n || halted.cursor !== 3n) {
    problems.push(`the instance did not halt with lockstep-behind at 4, its cursor 3: ${json({ state: halted.state, reason: halted.reason, cursor: halted.cursor })}`);
  }
  if (observed.rows.join(",") !== "1,2,3") problems.push(`the instance's rows are ${observed.rows.join(",")}, not 1–3`);
  const connected: LockstepInstance = { instance: LATE, connected: true, height: 3n, refused: "lockstep-behind" };
  for (const look of observed.whileConnected) {
    if (look.cursor !== 10n) problems.push(`the core moved to ${look.cursor} while ${LATE} was behind`);
    if (!names(look.condition, 11n, connected)) problems.push(`the core did not wait at 11 naming ${LATE} refused lockstep-behind: ${json(look.condition)}`);
  }
  if (!names(observed.afterStop, 11n, { ...connected, connected: false })) {
    problems.push(`once ${LATE} stopped the core did not name it, not connected, refused lockstep-behind: ${json(observed.afterStop)}`);
  }
  return problems;
}

/** Runs A118 on `backend` (see the module comment). */
async function a118Run(backend: PrivateBackend): Promise<A118Observation> {
  const publicDb = await backend.database("public");
  const privateDb = await backend.database("private");
  const lines: string[] = [];
  const instanceOn = (address: string): PrivateProcess =>
    launchPrivate({
      database: privateDb.setting,
      instanceId: LATE,
      coreTransport: address,
      ...publicSide(backend, publicDb),
      extra: { backoffCeilingMs: 1_000 },
      lines,
    });
  // Independent first: the core lists no instance, and goes on to 10 once the instance stopped at 3.
  let core = coreOn(publicDb, 3n, []);
  try {
    await core.handle.started;
    const independent = instanceOn(await core.transportWithin(START_TIMEOUT_MS));
    try {
      await independent.reach(3n);
    } finally {
      await independent.stop();
    }
    core.source.finalize(10n);
    await until(() => core.handle.status().cursor === 10n, "the core at 10");
  } finally {
    await core.stop();
  }
  // Then listed, with the public cursor at 10 and the instance at 3.
  core = coreOn(publicDb, 12n, [LATE]);
  try {
    await core.handle.started;
    const address = await core.transportWithin(START_TIMEOUT_MS);
    await until(() => waitingOf(core) !== null, "the core waits for the listed instance", START_TIMEOUT_MS);
    lines.splice(0);
    const late = instanceOn(address);
    let halted: ProcessStatus;
    const whileConnected: A118Observation["whileConnected"][number][] = [];
    try {
      halted = await haltOf(late);
      await until(() => waitingOf(core)?.instances.some((one) => one.refused === "lockstep-behind") === true, "the core names it behind").catch(
        () => undefined,
      );
      for (let index = 0; index < 5; index++) {
        whileConnected.push({ cursor: core.handle.status().cursor, condition: waitingOf(core) });
        await sleep(200);
      }
    } finally {
      await late.stop();
    }
    await until(() => waitingOf(core)?.instances.every((one) => !one.connected) === true, "the core sees it go").catch(() => undefined);
    return { coreLines: [...core.lines], lines: [...lines], halted, rows: await rowHeights(privateDb), whileConnected, afterStop: waitingOf(core) };
  } finally {
    await core.stop();
  }
}

// ── report-hash-mismatch ────────────────────────────────────────────────────────────────────────────────────────

const MISMATCHED = "mismatched-1";

/** A hash with its last byte changed. */
const otherHash = (hash: string): string => `${hash.slice(0, -2)}${hash.endsWith("00") ? "01" : "00"}`;

/** What one report-hash-mismatch run saw. */
interface MismatchObservation {
  readonly halted: ProcessStatus;
  readonly reported: readonly { readonly height: string; readonly hash: string }[];
  readonly coreLines: readonly string[];
  readonly lines: readonly string[];
  readonly cursor: bigint | null;
  readonly condition: LockstepCondition | null;
  readonly rows: readonly number[];
}

/** The oracle of A117's report hash check through the process: every problem, none when it holds. */
function mismatchProblems(observed: MismatchObservation): string[] {
  const problems: string[] = [];
  const { halted } = observed;
  if (halted.state !== "halted" || halted.reason?.code !== "report-hash-mismatch" || halted.cursor !== 1n) {
    problems.push(`the instance did not halt with report-hash-mismatch at its cursor 1: ${json({ state: halted.state, reason: halted.reason, cursor: halted.cursor })}`);
  }
  const truth = hexOf(inMemoryBlock(1n).hash);
  if (json(observed.reported[0]) !== json({ v: 1, type: "report", height: "1", hash: truth })) {
    problems.push(`the instance did not report its block 1 truly: ${json(observed.reported)}`);
  }
  const line = `transport: instance ${MISMATCHED} reported height 1 with hash ${otherHash(truth)}, and the public block there has hash ${truth}: report-hash-mismatch (PP-6)`;
  if (!observed.coreLines.includes(line)) problems.push(`the core did not log the mismatch: ${observed.coreLines.filter((l) => l.includes(MISMATCHED)).join(" | ")}`);
  if (!observed.lines.some((l) => l.startsWith(`transport: the core refused instance ${MISMATCHED} for good: report-hash-mismatch`))) {
    problems.push("the instance's transport did not stop for good");
  }
  if (observed.cursor !== 1n) problems.push(`the core moved to ${observed.cursor} past the mismatched report`);
  if (!names(observed.condition, 2n, { instance: MISMATCHED, connected: false, height: 0n, refused: "report-hash-mismatch" })) {
    problems.push(`the core did not keep waiting at 2 naming ${MISMATCHED} refused report-hash-mismatch: ${json(observed.condition)}`);
  }
  if (observed.rows.join(",") !== "1") problems.push(`the instance's rows are ${observed.rows.join(",")}, not 1`);
  return problems;
}

/** Runs the report hash check through the process on `backend`: a relay rewrites the instance's reports' hashes. */
async function mismatchRun(backend: PrivateBackend): Promise<MismatchObservation> {
  const publicDb = await backend.database("public");
  const privateDb = await backend.database("private");
  const core = coreOn(publicDb, 3n, [MISMATCHED]);
  try {
    await core.handle.started;
    const relay = await ReportRelay.start(await core.transportWithin(START_TIMEOUT_MS), (report) => ({ ...report, hash: otherHash(report.hash) }));
    const lines: string[] = [];
    try {
      const instance = launchPrivate({
        database: privateDb.setting,
        instanceId: MISMATCHED,
        coreTransport: relay.address,
        ...publicSide(backend, publicDb),
        extra: { backoffCeilingMs: 1_000 },
        lines,
      });
      try {
        const halted = await haltOf(instance);
        await until(() => waitingOf(core)?.instances.some((one) => one.refused === "report-hash-mismatch" && !one.connected) === true, "the core holds it").catch(
          () => undefined,
        );
        await sleep(500);
        return {
          halted,
          reported: relay.reports,
          coreLines: [...core.lines],
          lines: [...lines],
          cursor: core.handle.status().cursor,
          condition: waitingOf(core),
          rows: await (async () => {
            await instance.stop();
            return rowHeights(privateDb);
          })(),
        };
      } finally {
        await instance.stop();
      }
    } finally {
      await relay.close();
    }
  } finally {
    await core.stop();
  }
}

// ── needsLockstep ───────────────────────────────────────────────────────────────────────────────────────────────

const NEEDS_LISTED = "needs-listed";

/** A private module `needs` (the test module of `./builds.ts`) declaring `needsLockstep`. */
const needsModule = (seen: PrivateSeen[]) => privateModule("needs", seen, { needsLockstep: true });
const NEEDS_ENTRY = Object.freeze({ id: "needs", start: 1, version: "1.0.0", config: {} });

/** Whether `db` holds the schema `schema`. */
async function hasSchema(db: TestDatabase, schema: string): Promise<boolean> {
  const [row] = await db.read((read) => read.query("SELECT to_regnamespace($1) IS NOT NULL AS present", [schema]), privateCursorHeight);
  return row?.present === true;
}

describe.each(PRIVATE_BACKENDS)("lockstep's refusals and halts on $name (PP-6, PP-7)", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "A118: an instance listed after the public cursor passed it is refused with lockstep-behind, halts, and the core waits and names it",
    async () => {
      expect(a118Problems(await a118Run(backend))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A117: a report hash mismatch halts that instance with report-hash-mismatch, and the core keeps waiting for it",
    async () => {
      expect(mismatchProblems(await mismatchRun(backend))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A117: a needsLockstep module refuses to run when hello-ack says lockstep: false (needs-lockstep-not-listed), or with no " +
      "coreTransport, before any migration; on a listed instance it runs",
    async () => {
      const publicDb = await backend.database("public");
      const core = coreOn(publicDb, 3n, [NEEDS_LISTED]);
      try {
        await core.handle.started;
        const address = await core.transportWithin(START_TIMEOUT_MS);
        const seen: PrivateSeen[] = [];
        const options = (db: TestDatabase, rest: Partial<PrivateOptions>): PrivateOptions => ({
          database: db.setting,
          modules: [needsModule(seen)],
          entries: [NEEDS_ENTRY],
          extra: { backoffCeilingMs: 1_000 },
          ...rest,
        });
        // Not listed: the core's hello-ack says lockstep false.
        const unlistedDb = await backend.database("private");
        const unlisted = await refusalOf(options(unlistedDb, { instanceId: "needs-unlisted", coreTransport: address, ...publicSide(backend, publicDb) }));
        expect([unlisted.state, unlisted.code]).toEqual(["refused", "needs-lockstep-not-listed"]);
        expect((unlisted.error as UmbraError).details).toEqual({ modules: ["needs"], transport: true });
        expect(await hasSchema(unlistedDb, "needs")).toBe(false);
        // No coreTransport: no core can hold it in lockstep.
        const loneDb = await backend.database("private");
        const lone = await refusalOf(
          options(loneDb, {
            instanceId: "needs-lone",
            ...(backend.kind === "postgres" ? { publicDatabase: publicDb.readerSetting as DatabaseParts } : { direct: () => core.db() }),
          }),
        );
        expect([lone.state, lone.code]).toEqual(["refused", "needs-lockstep-not-listed"]);
        expect((lone.error as UmbraError).details).toEqual({ modules: ["needs"], transport: false });
        expect(await hasSchema(loneDb, "needs")).toBe(false);
        // Listed: it runs, in lockstep with the core.
        const listedDb = await backend.database("private");
        const listed = launchPrivate(options(listedDb, { instanceId: NEEDS_LISTED, coreTransport: address, ...publicSide(backend, publicDb) }));
        try {
          await listed.reach(3n);
        } finally {
          await listed.stop();
        }
        expect(await rowHeights(listedDb, "needs")).toEqual([1, 2, 3]);
        expect(seen.filter((call) => call.point === "on-fetch").every((call) => call.readHeight === call.height)).toBe(true);
      } finally {
        await core.stop();
      }
    },
    TEST_TIMEOUT_MS,
  );
});
