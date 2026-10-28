import { setTimeout as sleep } from "node:timers/promises";
import { UNVALIDATED_CONFIG } from "../../../src/admin/configuration.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ADMIN_ROUTES, answerAdmin } from "../../../src/admin/routes.js";
import { CORE_DIGEST } from "../../../src/backbone/core-digest/index.js";
import { snapshotOf, tableKey } from "../../../src/admin/snapshot.js";
import { versionEntry } from "../../../src/config/entries.js";
import { UmbraError } from "../../../src/db/errors.js";
import { POINTS, type ModuleDeclaration } from "../../../src/modules/declaration.js";
import type { BlockItemSource } from "../../../src/backbone/core-block-fetch/index.js";
import type { BlockRef, BlockSource } from "../../../src/runner/block-source.js";
import { statusOf } from "../../../src/runner/process.js";
import {
  adminCore,
  adminSource,
  type AdminRun,
  ask,
  gate,
  startWithAdmin,
  type StatusBody,
  statusWhen,
} from "../../admin/admin-harness.js";
import { schemaFile, validatorOf } from "../../admin/json-schema.js";
import { PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { entryOf, loggingModule } from "../../runner/process-build.js";

/**
 * A66 for `/status` (task 8.3; AE-5): every `/status` body validates against the JSON schema committed here,
 * `./status.schema.json` (draft 2020-12, checked by Ajv 8.18.0 in strict mode: `test/admin/json-schema.ts`), and its
 * `cursor` is `null` before block S commits. The bodies are read through the process on PostgreSQL 18 and PGlite in
 * every state the runner has and with the conditions it raises; the parts' digest rows shown are the database's own
 * `core_digest.tables` (DT-5), the last commit's time is RFC 3339 UTC text from the wall clock (Q68), the uptime grows.
 *
 * Committed negative controls: a body without any one of its required fields, with a field the schema does not have, or
 * with a value of the wrong form (a height as a number, another state, a time in PostgreSQL's own text, an upper-case
 * digest, a condition no task raises, an unknown detail, a node connection state outside AE-5's four, a negative queue
 * depth) fails the schema.
 */

const STATUS_SCHEMA = validatorOf(schemaFile(new URL("./status.schema.json", import.meta.url)));
const DIGEST_HEX = `0x${"ab".repeat(32)}`;

/** A full `/status` body as the endpoint answers it: a core process running at 3, with one part and its digest row. */
function body(): Record<string, unknown> {
  const status = statusOf({
    phase: "halted",
    start: 1n,
    cursor: 3n,
    head: 9n,
    followingThreshold: 3,
    readinessLag: null,
    conditions: [{ code: "node-retrying", attempts: 2, height: 4n }],
    ended: null,
    reason: { code: "callback-error", height: 4n, module: "m", point: "on-compute" },
  });
  const snapshot = snapshotOf(status, {
    livenessTimeoutMs: 30_000,
    readinessLag: null,
    redactor: null,
    config: UNVALIDATED_CONFIG,
    startedNs: 0n,
    side: "public",
    instanceId: null,
    tipCap: 600,
    lastCommitMs: Date.UTC(2026, 9, 26, 12, 0, 0, 250),
    modules: [{ id: "m", version: "1.0.0", side: "public", origin: "user", start: 1n, stop: null, tables: [{ schema: "m", table: "rows" }] }],
    digests: new Map([[tableKey({ schema: "m", table: "rows" }), { schema: "m", table: "rows", height: 3n, digest: new Uint8Array(32).fill(0xab) }]]),
  });
  const answer = answerAdmin(ADMIN_ROUTES, "GET", "/status", { snapshot, beatAgeMs: 0, nowNs: 1_500_000_000n });
  return JSON.parse(JSON.stringify(answer.body)) as Record<string, unknown>;
}

describe("A66: /status's JSON schema", () => {
  it("is a draft 2020-12 schema, and a full body validates", () => {
    expect(STATUS_SCHEMA.problems(body())).toEqual([]);
    expect(body()).toMatchObject({ lastCommitAt: "2026-10-26T12:00:00.25Z", uptimeMs: 1_500 });
  });

  it("holds the private instances and the lockstep flag (task 14.4; PP-9, AE-5)", () => {
    const instances = [
      { id: "keeper", connected: true, lockstep: true, height: "100" },
      { id: "other", connected: false, lockstep: false, height: null },
    ];
    expect(STATUS_SCHEMA.problems({ ...body(), privateInstances: instances })).toEqual([]);
    expect(STATUS_SCHEMA.problems({ ...body(), privateInstances: [] })).toEqual([]);
    expect(STATUS_SCHEMA.problems({ ...body(), public: { cursor: "3", lockstep: true } })).toEqual([]);
    expect(STATUS_SCHEMA.problems({ ...body(), public: { cursor: null, lockstep: null } })).toEqual([]);
  });

  it("holds the node's best head, connection state and queue depth (task 8.3a; AE-5, A168), or null for each", () => {
    const node = (body() as { node: Record<string, unknown> }).node;
    for (const connection of ["connecting", "connected", "retrying", "closed"]) {
      const shown = { ...body(), node: { ...node, bestHead: "103", connection, queueDepth: 2 } };
      expect(STATUS_SCHEMA.problems(shown), connection).toEqual([]);
    }
    expect(STATUS_SCHEMA.problems({ ...body(), node: { ...node, bestHead: null, connection: null, queueDepth: null } })).toEqual([]);
    expect(STATUS_SCHEMA.problems({ ...body(), node: { ...node, bestHead: "0", connection: "connecting", queueDepth: 0 } })).toEqual([]);
    // A private process has no node (A168: the three are null with it).
    expect(STATUS_SCHEMA.problems({ ...body(), node: null })).toEqual([]);
  });

  it("holds slow-block (task 5.5, RN-17): the height, the point, the module or null while none runs", () => {
    const slow = { code: "slow-block", height: "4", point: "on-compute", module: "m" };
    expect(STATUS_SCHEMA.problems({ ...body(), conditions: [slow] })).toEqual([]);
    expect(STATUS_SCHEMA.problems({ ...body(), conditions: [{ ...slow, point: "on-db-write", module: null }] })).toEqual([]);
  });

  it("names the points of MD-1 and every field the endpoint answers, each one required", () => {
    const schema = schemaFile(new URL("./status.schema.json", import.meta.url)) as {
      required: string[];
      properties: Record<string, unknown>;
      $defs: { point: { enum: string[] } };
    };
    expect(schema.$defs.point.enum).toEqual([...POINTS]);
    expect([...schema.required].sort()).toEqual(Object.keys(body()).sort());
    expect(Object.keys(schema.properties).sort()).toEqual(Object.keys(body()).sort());
  });

  it("negative controls: a body missing any required field, with an extra one, or with a value of another form fails", () => {
    const valid = body();
    for (const field of Object.keys(valid)) {
      const missing = { ...valid };
      delete missing[field];
      expect(STATUS_SCHEMA.problems(missing).join("\n"), field).toContain(`must have required property '${field}'`);
    }
    expect(STATUS_SCHEMA.problems({ ...valid, verbose: true }).join("\n")).toContain("must NOT have additional properties");
    const wrong: Record<string, (b: Record<string, any>) => void> = {
      "a height as a number": (b) => (b.cursor = 3),
      "a height with a sign": (b) => (b.lag = "-1"),
      "another state": (b) => (b.state = "running"),
      "PostgreSQL's own time text": (b) => (b.lastCommitAt = "2026-10-26 12:00:00.25+00"),
      "a fraction with a trailing zero": (b) => (b.lastCommitAt = "2026-10-26T12:00:00.250Z"),
      "an upper-case digest": (b) => (b.modules[0].tables[0].digest = DIGEST_HEX.toUpperCase().replace("0X", "0x")),
      "a part without its tables": (b) => delete b.modules[0].tables,
      "a condition no task raises": (b) => (b.conditions = [{ code: "slow-node", height: "4" }]),
      "a retry condition without its attempts": (b) => (b.conditions = [{ code: "node-retrying", height: "4" }]),
      "a slow block without its point": (b) => (b.conditions = [{ code: "slow-block", height: "4", module: "m" }]),
      "a slow block without its module": (b) => (b.conditions = [{ code: "slow-block", height: "4", point: "on-compute" }]),
      "a slow block in a point that is none": (b) => (b.conditions = [{ code: "slow-block", height: "4", point: "commit", module: null }]),
      "a slow block of an empty module": (b) => (b.conditions = [{ code: "slow-block", height: "4", point: "on-compute", module: "" }]),
      "a slow block with its time": (b) => (b.conditions = [{ code: "slow-block", height: "4", point: "on-compute", module: "m", ms: 1 }]),
      "an unknown detail": (b) => (b.reason.details = { message: "the raw message" }),
      "a point that is none": (b) => (b.reason.point = "on-commit"),
      "a connection state no /status shows (the client's own open)": (b) => (b.node.connection = "open"),
      "a connection state in another case": (b) => (b.node.connection = "Connected"),
      "a connection state as a flag": (b) => (b.node.connection = true),
      "a best head as a number": (b) => (b.node.bestHead = 103),
      "a best head with a sign": (b) => (b.node.bestHead = "-1"),
      "a negative queue depth": (b) => (b.node.queueDepth = -1),
      "a queue depth as text": (b) => (b.node.queueDepth = "2"),
      "a fractional queue depth": (b) => (b.node.queueDepth = 1.5),
      "a ledger before its task": (b) => (b.ledger = { version: "v8" }),
      "private instances that are no list": (b) => (b.privateInstances = { id: "i" }),
      "a private instance with its hash": (b) =>
        (b.privateInstances = [{ id: "i", connected: true, lockstep: false, height: "3", hash: `0x${"ab".repeat(32)}` }]),
      "a private instance without its height": (b) => (b.privateInstances = [{ id: "i", connected: true, lockstep: false }]),
      "a private instance with an empty id": (b) => (b.privateInstances = [{ id: "", connected: true, lockstep: false, height: null }]),
      "a lockstep flag as text": (b) => (b.public = { cursor: "3", lockstep: "yes" }),
      "a negative uptime": (b) => (b.uptimeMs = -1),
    };
    for (const [name, change] of Object.entries(wrong)) {
      const changed = JSON.parse(JSON.stringify(valid)) as Record<string, any>;
      change(changed);
      expect(STATUS_SCHEMA.problems(changed).length, name).toBeGreaterThan(0);
    }
  });
});

/** A module writing a row at each height, whose `on-start-db` or `on-compute` at a height awaits a gate when given. */
function writing(id: string, waits: { readonly startDb?: () => Promise<void>; readonly at?: bigint; readonly compute?: () => Promise<void> } = {}): ModuleDeclaration {
  const base = loggingModule(id, [], ["on-db-write"]);
  return {
    ...base,
    points: {
      ...base.points,
      ...(waits.startDb === undefined ? {} : { "on-start-db": async () => waits.startDb?.() }),
      async "on-compute"(_p, b) {
        if (b.height === waits.at) await waits.compute?.();
      },
    },
  };
}

/** A source whose block at 2 fails with `node-unreachable` (retryable) until `healed`. */
function unreachable(healed: () => boolean): BlockSource & BlockItemSource {
  const source = adminSource(3n);
  return {
    cursor: (read) => source.cursor(read),
    finalizedHead: () => source.finalizedHead(),
    waitForHead: (above, signal) => source.waitForHead(above, signal),
    // core-block-fetch's items, as the source gives them (task 10.3).
    blockItems: (block: BlockRef) => source.blockItems(block),
    block: async (height) => {
      if (height === 2n && !healed()) throw new UmbraError("node-unreachable", "the test's node-unreachable");
      return source.block(height);
    },
  };
}

/** `/status`'s body once it shows what `wanted` holds of, checked against the schema. */
async function valid(run: AdminRun, wanted: (body: StatusBody) => boolean): Promise<Record<string, any>> {
  const origin = await run.origin();
  await statusWhen(origin, wanted, 60_000);
  const answer = await ask(origin, "/status");
  const shown = answer.json as Record<string, any>;
  expect(STATUS_SCHEMA.problems(shown), JSON.stringify(shown)).toEqual([]);
  return shown;
}

describe.each(PROCESS_BACKENDS)("A66: /status through the process validates in every state on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A66: cursor null before block S commits — while migrating, and while S is above the node's head", async () => {
    const setup = gate();
    const migrating = startWithAdmin({ database: (await backend.database()).setting, user: [writing("m", { startDb: setup.wait })] });
    await setup.reached;
    const starting = await valid(migrating, (b) => b.state === "starting");
    expect(starting).toMatchObject({ cursor: null, head: null, lag: null, lastCommitAt: null, modules: null, reason: null });
    setup.open();
    await migrating.handle.stop();

    const db = await backend.database();
    const waiting = startWithAdmin({ database: db.setting, entries: [adminCore(db.setting, 5, { extra: { listen: { admin: "127.0.0.1:0" } } })] });
    const shown = await valid(waiting, (b) => b.conditions.some((condition) => condition.code === "waiting-for-node"));
    expect(shown).toMatchObject({ state: "starting", cursor: null, lastCommitAt: null, conditions: [{ code: "waiting-for-node", height: "5", head: "3" }] });
    // The parts are known once the database is migrated, before the wait: none has a digest row yet.
    expect(shown.modules.map((part: { id: string }) => part.id)).toContain("core-digest");
    for (const part of shown.modules) for (const table of part.tables) expect(table, part.id).toMatchObject({ height: null, digest: null });
    waiting.memory?.finalize(6n);
    const first = await valid(waiting, (b) => b.cursor === "6");
    expect(first.lastCommitAt).not.toBeNull();
    await waiting.handle.stop();
  }, 180_000);

  it("A66: following — the parts with the database's own digest rows, the last commit's time, the uptime growing", async () => {
    const before = Date.now();
    // The build's own core-digest (the test backbone's is a stand-in without DT-5's table).
    const run = startWithAdmin({
      database: (await backend.database()).setting,
      user: [writing("m")],
      head: 4n,
      keepDb: true,
      build: { backbone: (part) => (part.id === "core-digest" ? CORE_DIGEST : part) },
    });
    // The digests are read again after the last commit.
    const shown = await valid(
      run,
      (b) => b.cursor === "4" && (b as any).modules?.find((part: { id: string }) => part.id === "m")?.tables[0]?.height === "4",
    );
    const after = Date.now();
    // A core with no transport and no lockstep list: no private instance (task 14.4).
    expect(shown).toMatchObject({ state: "following", instance: { role: "core", id: null }, public: null, ledger: null, privateInstances: [] });
    // The in-memory source keeps no best-block queue and hears no best head; the process's node client, which it never
    // uses, has not connected (A168's `connecting` before the first connection; task 8.3a).
    expect(shown.node).toEqual({ finalizedHead: "4", bestHead: null, connection: "connecting", retries: 0, queueDepth: null, tipCap: 600, finalityStall: false });
    const committed = Date.parse(shown.lastCommitAt);
    expect(committed).toBeGreaterThanOrEqual(before);
    expect(committed).toBeLessThanOrEqual(after);
    const m = shown.modules.find((part: { id: string }) => part.id === "m");
    expect(m).toMatchObject({ id: "m", version: "1.0.0", side: "public", origin: "user", start: "1", stop: null, stopped: false });
    expect(shown.modules.map((part: { id: string; origin: string }) => `${part.origin} ${part.id}`)).toEqual([
      "backbone core-chain",
      "backbone core-block-fetch",
      "backbone core-block-commit",
      "backbone core-digest",
      "backbone core-health",
      "backbone core-status",
      "backbone core-config",
      "user keeper",
      "user m",
    ]);
    // Every digest row shown is the database's own.
    const rows = await (await run.db()).read((read) => read.query('SELECT "schema", "table", height, digest FROM core_digest.tables'));
    const hex = (bytes: Uint8Array) => `0x${Buffer.from(bytes).toString("hex")}`;
    const stored = new Map(rows.map((row) => [`${row.schema}.${row.table}`, { height: String(row.height), digest: hex(row.digest as Uint8Array) }]));
    expect(stored.get("m.rows")?.height).toBe("4");
    for (const part of shown.modules) {
      for (const table of part.tables) {
        const row = stored.get(`${table.schema}.${table.table}`);
        expect({ height: table.height, digest: table.digest }, `${table.schema}.${table.table}`).toEqual(row ?? { height: null, digest: null });
      }
    }
    const first = ((await ask(await run.origin(), "/status")).json as { uptimeMs: number }).uptimeMs;
    await sleep(300);
    const second = ((await ask(await run.origin(), "/status")).json as { uptimeMs: number }).uptimeMs;
    expect(second - first).toBeGreaterThanOrEqual(250);
    await run.handle.stop();
  }, 120_000);

  it("A66: syncing while a node failure is retried, stopped at an upgrade boundary, stopping", async () => {
    let healed = false;
    const retrying = startWithAdmin({ database: (await backend.database()).setting, source: unreachable(() => healed), extra: { backoffCeilingMs: 200 } });
    const shown = await valid(retrying, (b) => b.conditions.some((condition) => condition.code === "node-retrying"));
    expect(shown.node.retries).toBeGreaterThanOrEqual(1);
    healed = true;
    await statusWhen(await retrying.origin(), (b) => b.cursor === "3", 60_000);
    await retrying.handle.stop();

    const m = loggingModule("m", [], ["on-db-write"]);
    const db = await backend.database();
    const boundary = startWithAdmin({
      database: db.setting,
      user: [m],
      head: 8n,
      entries: [adminCore(db.setting, 1, { extra: { listen: { admin: "127.0.0.1:0" } } }), entryOf(m, 1), versionEntry({ id: "m", start: 5, version: "1.1.0" })],
    });
    const stopped = await valid(boundary, (b) => b.state === "stopped");
    expect(stopped.conditions).toEqual([{ code: "upgrade-required", height: "5", entries: [{ id: "m", start: 5, needed: "1.1.0", build: "1.0.0" }] }]);
    await boundary.handle.stop();

    // A module whose own stop the cursor passed shows stopped; the process goes on.
    const ended = loggingModule("e", [], ["on-db-write"]);
    const db2 = await backend.database();
    const passed = startWithAdmin({
      database: db2.setting,
      user: [ended],
      head: 3n,
      entries: [adminCore(db2.setting, 1, { extra: { listen: { admin: "127.0.0.1:0" } } }), entryOf(ended, 1, {}, 2)],
    });
    const following = await valid(passed, (b) => b.cursor === "3");
    expect(following.modules.find((part: { id: string }) => part.id === "e")).toMatchObject({ start: "1", stop: "2", stopped: true });
    await passed.handle.stop();

    const held = gate();
    const stopping = startWithAdmin({ database: (await backend.database()).setting, user: [writing("m", { at: 2n, compute: held.wait })] });
    await held.reached;
    const closing = stopping.handle.stop();
    await valid(stopping, (b) => b.state === "stopping");
    held.open();
    await closing;
  }, 180_000);

  it("A66: halted with its reason; refused before the database opens and after it, with their details", async () => {
    const failing = loggingModule("f", [], ["on-db-write"], {
      points: {
        ...loggingModule("f", [], ["on-db-write"]).points,
        async "on-compute"(_p, b) {
          if (b.height === 2n) throw new Error("the test's failure");
        },
      },
    });
    const halted = startWithAdmin({ database: (await backend.database()).setting, user: [failing] });
    const shown = await valid(halted, (b) => b.state === "halted");
    expect(shown.reason).toEqual({
      code: "callback-error",
      height: "2",
      module: "f",
      point: "on-compute",
      message: "callback-error at height 2, module f, point on-compute",
      details: {},
    });
    await halted.handle.stop();

    // Refused once the configuration is validated, before the database opens (PGlite without the development opt-in,
    // CF-9); a refusal of the configuration itself ends the process and serves no /status (task 8.1b, Q137 B).
    const unopened = startWithAdmin({ database: "pglite:memory", extra: { developmentOptIn: false } });
    const early = await valid(unopened, (b) => b.state === "refused");
    expect(early.reason).toMatchObject({ code: "development-opt-in-required", height: null, module: null, point: null });
    await unopened.handle.stop();

    const db = await backend.database();
    const first = startWithAdmin({ database: db.setting, user: [loggingModule("m", [], ["on-db-write"])] });
    await statusWhen(await first.origin(), (b) => b.cursor === "3", 60_000);
    await first.handle.stop();
    const changed = startWithAdmin({
      database: db.setting,
      user: [loggingModule("m", [], ["on-db-write"], { migrations: [{ id: "001", sql: "CREATE TABLE m.rows (height bigint PRIMARY KEY, x int)" }] })],
    });
    const late = await valid(changed, (b) => b.state === "refused");
    expect(late.reason).toMatchObject({ code: "migration-checksum-changed", module: "m", details: { migration: "001" } });
    await changed.handle.stop();
  }, 180_000);
});
