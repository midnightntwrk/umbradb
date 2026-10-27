import { existsSync, readdirSync } from "node:fs";
import { UNVALIDATED_CONFIG } from "../../../src/admin/configuration.js";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { DIGESTS_SQL, moduleFacts, ProcessAdmin } from "../../../src/admin/process-admin.js";
import { ADMIN_PARTS, ADMIN_ROUTES, answerAdmin } from "../../../src/admin/routes.js";
import type { AdminServer, AdminStartOptions } from "../../../src/admin/server.js";
import { snapshotOf, type SnapshotFacts, tableKey, utcText } from "../../../src/admin/snapshot.js";
import type { AdminSnapshot } from "../../../src/admin/types.js";
import { CORE_BLOCK_COMMIT } from "../../../src/backbone/core-block-commit/core-block-commit.js";
import { CORE_CHAIN } from "../../../src/backbone/core-chain/index.js";
import { CORE_DIGEST } from "../../../src/backbone/core-digest/index.js";
import { CORE_HEALTH } from "../../../src/backbone/core-health/index.js";
import { CORE_STATUS, CORE_STATUS_ENDPOINTS } from "../../../src/backbone/core-status/index.js";
import { buildCoreVersion, UMBRADB_VERSION } from "../../../src/config/build.js";
import { coreEntry } from "../../../src/config/entries.js";
import { validateConfig } from "../../../src/config/validate.js";
import type { Revision } from "../../../src/modules/declaration.js";
import { BACKBONE_ORDER, resolveGraph } from "../../../src/modules/graph.js";
import { validateDeclarations } from "../../../src/modules/validation.js";
import { buildDeclarations } from "../../../src/cli/build-modules.js";
import { type StatusFacts, statusOf } from "../../../src/runner/process.js";
import { adminCoreSettings, adminSnapshot, ask, startWithAdmin, statusSnapshot, statusWhen } from "../../admin/admin-harness.js";
import { LOOP_BACKBONE } from "../../runner/loop-harness.js";
import { loggingModule } from "../../runner/process-build.js";

/**
 * The backbone part `core-status` (task 8.3; AE-1, AE-5, AE-6; CORE-ARCH §4.11, §4.18; Q68, Q70): its declaration — a
 * backbone part with no points and no items, after `core-health` in RN-3's order and in the command's build —, its
 * endpoint (the published status and the uptime at the request), what the runner's side publishes for it (the
 * instance, the node, every part of the database with its digest rows, the last commit's time as RFC 3339 UTC text),
 * and A140 for it: `core-status`'s, from its own folder, its tests beside it here, mounted as the part gives it, and
 * answered by a refused process. A66 (its JSON schema) is `./status-schema.test.ts`, A67 `./secrets.test.ts`.
 */

/** `status()` of a process running at 3 with the finalized head 9. */
function status(facts: Partial<StatusFacts> = {}) {
  return statusOf({
    phase: "running",
    start: 1n,
    cursor: 3n,
    head: 9n,
    followingThreshold: 3,
    readinessLag: null,
    conditions: [],
    ended: null,
    reason: null,
    ...facts,
  });
}

/** What `ProcessAdmin.opened` takes besides the parts and the database (`/config`'s, task 8.4). */
const OPENED = { check: { entries: [], writes: [] }, history: [], genesisHash: new Uint8Array(32) };

/** The facts of a core process before startup resolved its parts. */
const FACTS: SnapshotFacts = {
  livenessTimeoutMs: 30_000,
  readinessLag: null,
  redactor: null,
  config: UNVALIDATED_CONFIG,
  startedNs: 5_000_000n,
  side: "public",
  instanceId: null,
  tipCap: 600,
  lastCommitMs: null,
  modules: null,
  digests: new Map(),
};

const DIGEST = new Uint8Array(32).map((_, index) => index);
const DIGEST_HEX = `0x${Array.from(DIGEST, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;

describe("core-status's declaration (CORE-ARCH §4.11)", () => {
  it("is a backbone part with no points, no items and no migrations, after core-health in RN-3's order and the build", () => {
    expect(CORE_STATUS).toMatchObject({
      id: "core-status",
      version: UMBRADB_VERSION,
      side: "public",
      requires: [],
      provides: [],
      startsMidChain: true,
      migrations: [],
      points: {},
    });
    // `toMatchObject` takes `points: {}` as a subset: no callback at all is checked here.
    expect(Object.keys(CORE_STATUS.points)).toEqual([]);
    expect(Object.isFrozen(CORE_STATUS)).toBe(true);
    expect(BACKBONE_ORDER).toContain(CORE_STATUS.id);
    const declarations = validateDeclarations({ backbone: [CORE_STATUS, CORE_HEALTH, ...[...LOOP_BACKBONE].reverse()], core: [], user: [] });
    const ids = resolveGraph({ declarations, start: 1n, entries: [], developmentOptIn: false, cursor: null }).modules.map((part) => part.id);
    expect(ids.indexOf("core-status")).toBe(ids.indexOf("core-health") + 1);
    const build = buildDeclarations().backbone;
    expect(build.find((part) => part.id === "core-status")).toBe(CORE_STATUS);
    expect(build.map((part) => part.id).indexOf("core-status")).toBe(build.map((part) => part.id).indexOf("core-health") + 1);
  });
});

describe("/status: the published status and the uptime at the request", () => {
  it("answers 200 with the status and the milliseconds since the process started, by the monotonic clock", () => {
    const given = adminSnapshot({ startedNs: "1000000000", status: statusSnapshot({ cursor: "7" }) });
    const answer = answerAdmin(ADMIN_ROUTES, "GET", "/status", { snapshot: given, beatAgeMs: 0, nowNs: 3_500_999_999n });
    expect(answer).toEqual({ status: 200, body: { ...given.status, uptimeMs: 2_500 } });
    // A clock read before the start was published: 0, never negative.
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/status", { snapshot: given, beatAgeMs: 0, nowNs: 999_000_000n }).body).toMatchObject({
      uptimeMs: 0,
    });
  });
});

describe("what /status shows besides status() (AE-5)", () => {
  it("on the core: the instance, the node as the loop reads it, null where nothing reports yet", () => {
    const retry = { code: "node-retrying" as const, attempts: 3, height: 4n };
    const shown = snapshotOf(status({ conditions: [retry] }), { ...FACTS, tipCap: 25 });
    expect(shown.startedNs).toBe("5000000");
    expect(shown.status).toMatchObject({
      instance: { role: "core", id: null },
      lastCommitAt: null,
      node: { finalizedHead: "9", bestHead: null, connection: null, retries: 3, queueDepth: null, tipCap: 25, finalityStall: false },
      modules: null,
      ledger: null,
      privateInstances: null,
      public: null,
    });
    const stalled = snapshotOf(status({ conditions: [{ code: "finality-stall", tipCap: 25, height: 40n } as never] }), FACTS);
    expect(stalled.status.node).toMatchObject({ retries: 0, finalityStall: true });
    expect(snapshotOf(status({ head: null }), FACTS).status.node?.finalizedHead).toBeNull();
  });

  it("on a private process: its instance id and the public cursor; no node", () => {
    const shown = snapshotOf(status({ head: 12n }), { ...FACTS, side: "private", instanceId: "wallet-a" });
    expect(shown.status).toMatchObject({ instance: { role: "private", id: "wallet-a" }, node: null, public: { cursor: "12", lockstep: null } });
  });

  it("the last commit's wall-clock time as RFC 3339 UTC text, the fraction only when it has one (Q68)", () => {
    expect(utcText(Date.UTC(2025, 4, 21, 14, 30, 0, 0))).toBe("2025-05-21T14:30:00Z");
    expect(utcText(Date.UTC(2025, 4, 21, 14, 30, 0, 120))).toBe("2025-05-21T14:30:00.12Z");
    expect(utcText(Date.UTC(2025, 4, 21, 14, 30, 0, 100))).toBe("2025-05-21T14:30:00.1Z");
    expect(utcText(Date.UTC(2025, 4, 21, 14, 30, 0, 5))).toBe("2025-05-21T14:30:00.005Z");
    expect(utcText(Date.UTC(2025, 4, 21, 14, 30, 7, 999))).toBe("2025-05-21T14:30:07.999Z");
    const at = Date.UTC(2026, 9, 26, 12, 0, 1, 250);
    expect(snapshotOf(status(), { ...FACTS, lastCommitMs: at }).status.lastCommitAt).toBe("2026-10-26T12:00:01.25Z");
  });

  it("every part with its revisions' start and stop, whether the cursor reached the stop, and its digest rows", () => {
    const modules = [
      { id: "core-chain", version: "0.9.5", side: "public" as const, origin: "backbone" as const, start: 1n, stop: null, tables: [{ schema: "core_chain", table: "identity" }] },
      { id: "m", version: "1.0.0", side: "public" as const, origin: "user" as const, start: 1n, stop: 3n, tables: [{ schema: "m", table: "rows" }, { schema: "m", table: "more" }] },
      { id: "n", version: "2.0.0", side: "public" as const, origin: "core" as const, start: 2n, stop: 4n, tables: [{ schema: "n", table: "rows" }] },
    ];
    const digests = new Map([[tableKey({ schema: "m", table: "rows" }), { schema: "m", table: "rows", height: 3n, digest: DIGEST }]]);
    const shown = snapshotOf(status(), { ...FACTS, modules, digests });
    expect(shown.status.modules).toEqual([
      { id: "core-chain", version: "0.9.5", side: "public", origin: "backbone", start: "1", stop: null, stopped: false, tables: [{ schema: "core_chain", table: "identity", height: null, digest: null }] },
      {
        id: "m",
        version: "1.0.0",
        side: "public",
        origin: "user",
        start: "1",
        stop: "3",
        stopped: true,
        tables: [
          { schema: "m", table: "rows", height: "3", digest: DIGEST_HEX },
          { schema: "m", table: "more", height: null, digest: null },
        ],
      },
      // A table of the same name in another schema is another table: no digest row of its own yet.
      { id: "n", version: "2.0.0", side: "public", origin: "core", start: "2", stop: "4", stopped: false, tables: [{ schema: "n", table: "rows", height: null, digest: null }] },
    ]);
    // Nothing committed yet: no part is stopped.
    expect(snapshotOf(status({ cursor: null }), { ...FACTS, modules }).status.modules?.map((part) => part.stopped)).toEqual([false, false, false]);
    expect(Object.isFrozen(shown.status.modules) && Object.isFrozen(shown.status.modules?.[1]?.tables)).toBe(true);
  });

  it("moduleFacts: each part's origin, its first revision's start, its last's stop and its table items' tables", () => {
    const m = loggingModule("m", [], ["on-db-write"]);
    const core = { ...loggingModule("c", [], []), provides: [] };
    const declarations = validateDeclarations({ backbone: [CORE_CHAIN, CORE_BLOCK_COMMIT, CORE_DIGEST], core: [core], user: [m] });
    const revision = (start: bigint, stop: bigint | null): Revision => ({ start, stop, version: "1.0.0", settings: {} });
    const revisions: Record<string, Revision[]> = { m: [revision(2n, 4n), revision(5n, 9n)], c: [], "core-chain": [revision(1n, null)] };
    const facts = moduleFacts({
      declarations,
      modules: [CORE_CHAIN, CORE_DIGEST, core, m],
      revisionsOf: (id) => revisions[id] ?? [revision(1n, null)],
    });
    expect(facts).toEqual([
      { id: "core-chain", version: CORE_CHAIN.version, side: "public", origin: "backbone", start: 1n, stop: null, tables: [{ schema: "core_chain", table: "identity" }] },
      {
        id: "core-digest",
        version: CORE_DIGEST.version,
        side: "public",
        origin: "backbone",
        start: 1n,
        stop: null,
        tables: [
          { schema: "core_digest", table: "tables" },
          { schema: "core_digest", table: "checkpoints" },
        ],
      },
      { id: "c", version: "1.0.0", side: "public", origin: "core", start: null, stop: null, tables: [] },
      { id: "m", version: "1.0.0", side: "public", origin: "user", start: 2n, stop: 9n, tables: [{ schema: "m", table: "rows" }] },
    ]);
  });
});

describe("ProcessAdmin's /status facts: the digests read, the last commit, the side", () => {
  /** A fake admin server that records what it is published. */
  function recording() {
    const published: AdminSnapshot[] = [];
    const start = async (options: AdminStartOptions): Promise<AdminServer> => {
      published.push(options.snapshot);
      return { host: "127.0.0.1", port: 10_002, threadId: null, publish: (snapshot) => published.push(snapshot), close: async () => undefined };
    };
    return { published, start };
  }

  const checked = (side: "public" | "private" = "public") =>
    validateConfig({
      config: {
        data: {
          entries: [
            coreEntry({
              start: 1,
              config: (side === "public"
                ? { ...adminCoreSettings("pglite:memory"), tipCap: 40, listen: { admin: "127.0.0.1:0" } }
                : {
                    network: "custom",
                    genesisHash: adminCoreSettings("x").genesisHash,
                    ledgerTable: adminCoreSettings("x").ledgerTable,
                    database: "pglite:memory",
                    instanceId: "wallet-a",
                    developmentOptIn: true,
                    listen: { admin: "127.0.0.1:0" },
                  }) as never,
            }) as never,
          ],
        },
      },
      declarations: { backbone: [], core: [], user: [] },
      side,
    });

  it("reads core_digest.tables after startup resolved the parts and after each commit, one read at a time, and publishes them", async () => {
    const fake = recording();
    let cursor: bigint | null = null;
    const admin = new ProcessAdmin({ status: () => status({ cursor }), log: () => undefined, start: fake.start });
    const config = checked();
    await admin.serve(config, config.entries[0] as never);
    expect(fake.published.at(-1)?.status).toMatchObject({ instance: { role: "core", id: null }, node: { tipCap: 40 }, modules: null });
    const queries: string[] = [];
    let release!: () => void;
    let rows: Record<string, unknown>[] = [];
    const db = {
      read: async <T>(body: (read: { query(sql: string): Promise<Record<string, unknown>[]> }) => Promise<T>): Promise<T> =>
        body({
          query: async (sql: string) => {
            // The server's version (task 8.4's) is answered at once; the digest reads wait for the test.
            if (sql !== DIGESTS_SQL) return [{ version: "18.6" }];
            queries.push(sql);
            await new Promise<void>((resolve) => {
              release = resolve;
            });
            return rows;
          },
        }),
    };
    const m = loggingModule("m", [], ["on-db-write"]);
    const declarations = validateDeclarations({ backbone: [CORE_CHAIN, CORE_BLOCK_COMMIT, CORE_DIGEST], core: [], user: [m] });
    admin.opened({ declarations, modules: [CORE_CHAIN, CORE_BLOCK_COMMIT, CORE_DIGEST, m], revisionsOf: () => [], db: db as never, ...OPENED });
    await sleep(10);
    expect(queries).toEqual([DIGESTS_SQL]);
    expect(fake.published.at(-1)?.status.modules?.map((part) => part.id)).toEqual(["core-chain", "core-block-commit", "core-digest", "m"]);
    // While the read runs, a commit and a publication start no other.
    cursor = 1n;
    const before = Date.now();
    admin.committed();
    admin.publish();
    expect(queries).toHaveLength(1);
    rows = [{ schema: "m", table: "rows", height: 1n, digest: DIGEST }];
    release();
    await sleep(10);
    // The read that was running saw no rows; the commit made the digests stale, so the publication after it reads again.
    expect(queries).toHaveLength(2);
    release();
    await sleep(10);
    const last = fake.published.at(-1);
    expect(last?.status.modules?.find((part) => part.id === "m")?.tables).toEqual([{ schema: "m", table: "rows", height: "1", digest: DIGEST_HEX }]);
    const at = Date.parse(last?.status.lastCommitAt as string);
    expect(at).toBeGreaterThanOrEqual(before - 1);
    expect(at).toBeLessThanOrEqual(Date.now());
    // Nothing committed since: a publication reads nothing.
    admin.publish();
    expect(queries).toHaveLength(2);
    await admin.close();
    admin.committed();
    admin.publish();
    expect(queries).toHaveLength(2);
  });

  it("a read that fails keeps the rows as last read, and reads again only after the next commit", async () => {
    const fake = recording();
    const admin = new ProcessAdmin({ status: () => status(), log: () => undefined, start: fake.start });
    const config = checked();
    await admin.serve(config, config.entries[0] as never);
    let reads = 0;
    let fail = false;
    const db = {
      read: async <T>(body: (read: { query(sql: string): Promise<Record<string, unknown>[]> }) => Promise<T>): Promise<T> =>
        body({
          query: async (sql) => {
            if (sql !== DIGESTS_SQL) return [{ version: "18.6" }];
            reads += 1;
            if (fail) throw new Error("handle-closed");
            return [{ schema: "core_digest", table: "tables", height: 2n, digest: DIGEST }];
          },
        }),
    };
    admin.opened({ declarations: validateDeclarations({ backbone: [CORE_DIGEST], core: [], user: [] }), modules: [CORE_DIGEST], revisionsOf: () => [], db: db as never, ...OPENED });
    await sleep(10);
    const tables = () => fake.published.at(-1)?.status.modules?.[0]?.tables;
    expect(tables()?.[0]).toMatchObject({ height: "2", digest: DIGEST_HEX });
    fail = true;
    admin.committed();
    admin.publish();
    await sleep(10);
    expect(reads).toBe(2);
    expect(tables()?.[0]).toMatchObject({ height: "2", digest: DIGEST_HEX });
    admin.publish();
    await sleep(10);
    expect(reads).toBe(2);
    await admin.close();
  });

  it("reads no digests when the parts have no core-digest; on a private process shows its instance and the public side", async () => {
    const fake = recording();
    const admin = new ProcessAdmin({ status: () => status(), log: () => undefined, start: fake.start, side: "private" });
    const config = checked("private");
    await admin.serve(config, config.entries[0] as never);
    const queries: string[] = [];
    const db = {
      read: async <T>(body: (read: { query(sql: string): Promise<Record<string, unknown>[]> }) => Promise<T>): Promise<T> =>
        body({ query: async (sql: string) => (queries.push(sql), []) }),
    };
    admin.opened({ declarations: validateDeclarations({ backbone: [CORE_CHAIN], core: [], user: [] }), modules: [CORE_CHAIN], revisionsOf: () => [], db: db as never, ...OPENED });
    admin.committed();
    admin.publish();
    await sleep(10);
    expect(queries).not.toContain(DIGESTS_SQL);
    expect(fake.published.at(-1)?.status).toMatchObject({ instance: { role: "private", id: "wallet-a" }, node: null, public: { cursor: "9", lockstep: null } });
    await admin.close();
  });
});

describe("A140 for /status: core-status's, from its own folder, its tests beside it", () => {
  it("the admin route table mounts core-status's endpoint as the part gives it", () => {
    expect(ADMIN_PARTS.find((part) => part.id === "core-status")).toBe(CORE_STATUS_ENDPOINTS);
    expect(CORE_STATUS_ENDPOINTS.endpoints.map((endpoint) => endpoint.path)).toEqual(["/status"]);
    expect(ADMIN_ROUTES.get("/status")).toBe(CORE_STATUS_ENDPOINTS.endpoints[0]);
    expect(Object.isFrozen(CORE_STATUS_ENDPOINTS) && Object.isFrozen(CORE_STATUS_ENDPOINTS.endpoints)).toBe(true);
  });

  it("a refused process answers /status: refused, its reason, the instance; its parts not yet known", async () => {
    // Refused once the configuration is validated — PGlite without the development opt-in (CF-9) —, before the
    // database opens; a refusal of the configuration itself would end the process instead, serving nothing (task 8.1b).
    const run = startWithAdmin({ database: "pglite:memory", extra: { developmentOptIn: false } });
    await expect(run.handle.started).rejects.toMatchObject({ code: "development-opt-in-required" });
    const body = await statusWhen(await run.origin(), (each) => each.state === "refused");
    expect(body).toMatchObject({
      state: "refused",
      ready: false,
      reason: { code: "development-opt-in-required", point: null },
      instance: { role: "core", id: null },
      modules: null,
      lastCommitAt: null,
      cursor: null,
    });
    expect((await ask(await run.origin(), "/status")).json).toMatchObject({ uptimeMs: expect.any(Number) });
    await run.handle.stop();
  });

  it("a refused private process shows its role and instance, no node and the public side", async () => {
    // A private `core` entry (CF-4: `instanceId`, no `node`) refused once validated — PGlite without the development
    // opt-in —, before the database opens: a refusal of the configuration itself ends the process (task 8.1b).
    const { node: _node, ...settings } = adminCoreSettings("pglite:memory", {
      developmentOptIn: false,
      instanceId: "instance-1",
      listen: { admin: "127.0.0.1:0" },
    });
    const run = startWithAdmin({ database: "pglite:memory", side: "private", entries: [coreEntry({ start: 1, config: settings as never })] });
    await expect(run.handle.started).rejects.toMatchObject({ code: "development-opt-in-required" });
    const body = await statusWhen(await run.origin(), (each) => each.state === "refused");
    expect(body).toMatchObject({ instance: { role: "private", id: "instance-1" }, node: null, public: { cursor: null, lockstep: null } });
    await run.handle.stop();
  });

  it("lives in src/backbone/core-status/, with its tests and its JSON schema in test/backbone/core-status/", () => {
    const source = fileURLToPath(new URL("../../../src/backbone/core-status/", import.meta.url));
    for (const file of ["core-status.ts", "endpoints.ts", "index.ts"]) expect(existsSync(`${source}${file}`), file).toBe(true);
    const here = readdirSync(fileURLToPath(new URL(".", import.meta.url)));
    expect(here.filter((file) => file.endsWith(".test.ts")).sort()).toEqual(["core-status.test.ts", "secrets.test.ts", "status-schema.test.ts"]);
    expect(here).toContain("status.schema.json");
    expect(buildCoreVersion().umbradb).toBe(UMBRADB_VERSION);
  });
});
