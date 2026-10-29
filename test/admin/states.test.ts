import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { versionEntry } from "../../src/config/entries.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { BlockItemSource } from "../../src/backbone/core-block-fetch/index.js";
import type { BlockRef, BlockSource } from "../../src/runner/block-source.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../runner/process-backends.js";
import { entryOf, loggingModule, settle } from "../runner/process-build.js";
import {
  adminCore,
  adminSource,
  type AdminRun,
  ask,
  gate,
  observe,
  type Observation,
  startWithAdmin,
  stateProblems,
  statusWhen,
  within,
} from "./admin-harness.js";

/**
 * The process states through the admin endpoints, on both backends. Each state the runner has (`starting`, `refused`,
 * `syncing`, `following`, `stopped`, `halted`, `stopping`) is reached in a test and read on the admin listener:
 * - `/health/live` is 200 in every one: a refused or halted process stays up and live;
 * - `/health/ready` is 200 or 503, as `status()` decides; [AE-4]
 * - `/status` gives the state with its reason.
 *
 * A refused start, for example on a migration checksum that changed, keeps the process up with live 200 and ready 503.
 * [A64, AE-3, IN-12, RN-8]
 *
 * The conditions the runner raises are reached too:
 * - `waiting-for-node`, with the start height S above the node's head; [IN-2]
 * - `upgrade-required`; [RN-12]
 * - `node-retrying` and `database-retrying`. [IN-10]
 *
 * The other conditions (`finality-stall`, `waiting-for-lockstep`, `slow-block`) are tested with the parts that raise
 * them. [AE-3]
 *
 * The runner publishes the snapshot at each heartbeat tick (every second) and at once when startup ends, processing
 * ends or the process starts stopping, so each test asks `/status` until the state it reached shows.
 *
 * Committed negative control: a refused start that stops the process fails the live-200 check. [A64]
 */

/** A module whose migration `001` is `sql`. */
const migrating = (sql: string): ModuleDeclaration =>
  loggingModule("m", [], ["on-db-write"], { migrations: [{ id: "001", sql }] });

/** A module whose `point` awaits `wait` at `height`. */
function waiting(id: string, point: "on-db-write" | "on-start-db", wait: () => Promise<void>, height = 2n): ModuleDeclaration {
  const base = loggingModule(id, [], ["on-db-write"]);
  if (point === "on-start-db") {
    return { ...base, points: { ...base.points, async "on-start-db"() {
      await wait();
    } } };
  }
  return {
    ...base,
    points: {
      ...base.points,
      async "on-db-write"(p, b, w) {
        await (base.points["on-db-write"] as NonNullable<ModuleDeclaration["points"]["on-db-write"]>)(p, b, w);
        if (b.height === height) await wait();
      },
    },
  };
}

/** The four endpoints once `/status` shows `state`. */
async function seenIn(run: AdminRun, state: string, more: (body: Record<string, unknown>) => boolean = () => true) {
  const origin = await run.origin();
  await statusWhen(origin, (body) => body.state === state && more(body as never));
  return observe(origin);
}

/** A source whose `block` fails with `code` (retryable) at `height` until `healed`, and whose `cursor` does as `cursor`. */
function failingSource(
  source: InMemoryBlockSource,
  fails: { readonly block?: bigint; readonly cursor?: boolean; readonly code: "node-unreachable" | "connection-lost" },
  healed: () => boolean,
): BlockSource & BlockItemSource {
  const failure = () => new UmbraError(fails.code, `the test's ${fails.code}`);
  return {
    cursor: async (read) => {
      if (fails.cursor === true && !healed()) throw failure();
      return source.cursor(read);
    },
    finalizedHead: () => source.finalizedHead(),
    waitForHead: (above, signal) => source.waitForHead(above, signal),
    // core-block-fetch's items, as the source gives them.
    blockItems: (block: BlockRef) => source.blockItems(block),
    block: async (height) => {
      if (height === fails.block && !healed()) throw failure();
      return source.block(height);
    },
  };
}

/** Whether `run` stays up: not closed after a while. */
const staysUp = async (run: AdminRun) => !(await within(run.handle.closed, 1_500));

describe.each(PROCESS_BACKENDS)("A64: AE-3's states on the admin listener on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A64: starting — live 200, ready 503, no cursor — while a module's on-start-db runs", async () => {
    const setup = gate();
    const run = startWithAdmin({ database: (await backend.database()).setting, user: [waiting("m", "on-start-db", setup.wait)] });
    await setup.reached;
    const seen = await seenIn(run, "starting");
    expect(stateProblems(seen, { state: "starting", ready: false, reason: null })).toEqual([]);
    expect(seen.status.json).toMatchObject({ cursor: null, head: null, lag: null, conditions: [] });
    setup.open();
    expect(stateProblems(await seenIn(run, "following"), { state: "following", ready: true, reason: null })).toEqual([]);
    await run.handle.stop();
  }, 120_000);

  it("A64: starting with waiting-for-node while S is above the node's head — live 200, ready 503 —, then following", async () => {
    const db = await backend.database();
    const run = startWithAdmin({
      database: db.setting,
      entries: [adminCore(db.setting, 5, { extra: { listen: { admin: "127.0.0.1:0" } } })],
    });
    const seen = await seenIn(run, "starting", (body) =>
      (body.conditions as { code: string }[]).some((condition) => condition.code === "waiting-for-node"),
    );
    expect(stateProblems(seen, { state: "starting", ready: false, reason: null })).toEqual([]);
    expect(seen.status.json).toMatchObject({ cursor: null, conditions: [{ code: "waiting-for-node", height: "5", head: "3" }] });
    run.memory?.finalize(7n);
    const following = await seenIn(run, "following", (body) => body.cursor === "7");
    expect(stateProblems(following, { state: "following", ready: true, reason: null })).toEqual([]);
    expect(following.status.json).toMatchObject({ conditions: [], head: "7", lag: "0" });
    await run.handle.stop();
  }, 120_000);

  it("A64: syncing while far behind, then following at the head — both ready without a readiness lag (AE-4)", async () => {
    const held = gate();
    const run = startWithAdmin({
      database: (await backend.database()).setting,
      user: [waiting("m", "on-db-write", held.wait, 3n)],
      head: 10n,
      extra: { followingThreshold: 2 },
    });
    await held.reached;
    const syncing = await seenIn(run, "syncing", (body) => body.cursor === "2");
    expect(stateProblems(syncing, { state: "syncing", ready: true, reason: null })).toEqual([]);
    expect(syncing.status.json).toMatchObject({ cursor: "2", head: "10", lag: "8" });
    held.open();
    const following = await seenIn(run, "following", (body) => body.cursor === "10");
    expect(stateProblems(following, { state: "following", ready: true, reason: null })).toEqual([]);
    expect(following.status.json).toMatchObject({ cursor: "10", head: "10", lag: "0" });
    await run.handle.stop();
  }, 120_000);

  it("A64: stopped at the core's stop — ready whatever the lag (AE-4); and at an upgrade boundary with upgrade-required", async () => {
    const atStop = startWithAdmin({ database: (await backend.database()).setting, head: 6n, stop: 3 });
    const stopped = await seenIn(atStop, "stopped");
    expect(stateProblems(stopped, { state: "stopped", ready: true, reason: null })).toEqual([]);
    expect(stopped.status.json).toMatchObject({ cursor: "3", head: "6", lag: "3", conditions: [] });
    await atStop.handle.stop();

    const m = loggingModule("m", [], ["on-db-write"]);
    const db = await backend.database();
    const atBoundary = startWithAdmin({
      database: db.setting,
      user: [m],
      head: 8n,
      entries: [
        adminCore(db.setting, 1, { extra: { listen: { admin: "127.0.0.1:0" } } }),
        entryOf(m, 1),
        versionEntry({ id: "m", start: 5, version: "1.1.0" }),
      ],
    });
    const upgrade = await seenIn(atBoundary, "stopped");
    expect(stateProblems(upgrade, { state: "stopped", ready: true, reason: null })).toEqual([]);
    expect(upgrade.status.json).toMatchObject({
      cursor: "4",
      conditions: [{ code: "upgrade-required", height: "5", entries: [{ id: "m", start: 5, needed: "1.1.0", build: "1.0.0" }] }],
    });
    await atBoundary.handle.stop();
  }, 120_000);

  it("A64: halted — live 200, ready 503, the reason's code, height, module and point; the thrown message shown nowhere", async () => {
    const message = "on-compute failed with hunter2-A64-SECRET in its message";
    const failing = loggingModule("f", [], ["on-db-write"], {
      points: {
        ...loggingModule("f", [], ["on-db-write"]).points,
        async "on-compute"(_p, b) {
          if (b.height === 2n) throw new Error(message);
        },
      },
    });
    const run = startWithAdmin({ database: (await backend.database()).setting, user: [failing] });
    const seen = await seenIn(run, "halted");
    const reason = { code: "callback-error", height: "2", module: "f", point: "on-compute" };
    expect(stateProblems(seen, { state: "halted", ready: false, reason })).toEqual([]);
    expect(seen.status.json).toMatchObject({ cursor: "1" });
    for (const answer of Object.values(seen)) expect(answer.text).not.toContain("hunter2-A64-SECRET");
    expect(await staysUp(run)).toBe(true);
    expect((await ask(await run.origin(), "/health/live")).status).toBe(200);
    await run.handle.stop();
  }, 120_000);

  it("A64: refused (AE-3's scenario, a migration checksum that changed) — up, live 200, ready 503, the reason", async () => {
    const db = await backend.database();
    const first = startWithAdmin({ database: db.setting, user: [migrating("CREATE TABLE m.rows (height bigint PRIMARY KEY)")] });
    await seenIn(first, "following", (body) => body.cursor === "3");
    await first.handle.stop();

    const run = startWithAdmin({ database: db.setting, user: [migrating("CREATE TABLE m.rows (height bigint PRIMARY KEY, x int)")] });
    await expect(run.handle.started).rejects.toMatchObject({ code: "migration-checksum-changed" });
    const seen = await seenIn(run, "refused");
    const reason = { code: "migration-checksum-changed", height: null, module: "m", point: null };
    expect(stateProblems(seen, { state: "refused", ready: false, reason })).toEqual([]);
    expect((seen.status.json as { reason: { details: unknown } }).reason.details).toEqual({ migration: "001" });
    expect(await staysUp(run)).toBe(true);
    expect(stateProblems(await observe(await run.origin()), { state: "refused", ready: false, reason })).toEqual([]);
    await run.handle.stop();
  }, 180_000);

  it("A64: stopping — live 200, ready 503 — while the height in progress finishes; then the admin listener closes", async () => {
    const held = gate();
    const run = startWithAdmin({ database: (await backend.database()).setting, user: [waiting("m", "on-db-write", held.wait)] });
    await held.reached;
    const origin = await run.origin();
    const stopping = run.handle.stop();
    const seen = await seenIn(run, "stopping");
    expect(stateProblems(seen, { state: "stopping", ready: false, reason: null })).toEqual([]);
    held.open();
    await stopping;
    await run.handle.closed;
    expect(await ask(origin, "/health/live")).toMatchObject({ status: null, error: "ECONNREFUSED" });
    expect((await run.server).threadId).toBe(-1);
  }, 120_000);

  it("A64's conditions: node-retrying and database-retrying while the failure is retried, cleared once it works", async () => {
    for (const [code, condition, fails] of [
      ["node-unreachable", "node-retrying", { block: 2n }],
      ["connection-lost", "database-retrying", { cursor: true }],
    ] as const) {
      let healed = false;
      const memory = adminSource(3n);
      const run = startWithAdmin({
        database: (await backend.database()).setting,
        source: failingSource(memory, { ...fails, code }, () => healed),
        extra: { backoffCeilingMs: 200 },
      });
      const origin = await run.origin();
      const body = await statusWhen(origin, (status) => status.conditions.some((each) => each.code === condition));
      expect(body.conditions, code).toEqual([
        expect.objectContaining({ code: condition, height: "block" in fails ? "2" : null, attempts: expect.any(Number) }),
      ]);
      expect(stateProblems(await observe(origin), { state: body.state, ready: body.ready, reason: null }), code).toEqual([]);
      healed = true;
      await statusWhen(origin, (status) => status.state === "following" && status.conditions.length === 0);
      await run.handle.stop();
    }
  }, 120_000);

  it("negative control: a refused start that stops the process fails A64's live-200 check", async () => {
    const db: ProcessDatabase = await backend.database();
    const first = startWithAdmin({ database: db.setting, user: [migrating("CREATE TABLE m.rows (height bigint PRIMARY KEY)")] });
    expect(await settle(first.handle, first.memory as InMemoryBlockSource, 3n)).toBe("waiting");
    await first.handle.stop();
    const run = startWithAdmin({ database: db.setting, user: [migrating("CREATE TABLE m.rows (height bigint PRIMARY KEY, y int)")] });
    const origin = await run.origin();
    // The control: the process stops itself once its startup refused.
    await run.handle.ended;
    await run.handle.stop();
    await sleep(100);
    const seen: Observation = await observe(origin);
    expect(stateProblems(seen, { state: "refused", ready: false, reason: { code: "migration-checksum-changed" } })).toContain(
      "live answered ECONNREFUSED, not 200",
    );
  }, 120_000);
});
