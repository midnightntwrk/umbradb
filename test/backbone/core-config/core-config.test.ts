import { createHash } from "node:crypto";
import { existsSync, readdirSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { configOf, declarationView, UNVALIDATED_CONFIG } from "../../../src/admin/configuration.js";
import { ProcessAdmin, recordedHistory } from "../../../src/admin/process-admin.js";
import { ADMIN_PARTS, ADMIN_ROUTES, answerAdmin } from "../../../src/admin/routes.js";
import type { AdminServer, AdminStartOptions } from "../../../src/admin/server.js";
import type { AdminSnapshot } from "../../../src/admin/types.js";
import { CORE_BLOCK_COMMIT } from "../../../src/backbone/core-block-commit/core-block-commit.js";
import { CORE_CHAIN } from "../../../src/backbone/core-chain/index.js";
import { CORE_CONFIG, CORE_CONFIG_ENDPOINTS } from "../../../src/backbone/core-config/index.js";
import { CORE_DIGEST } from "../../../src/backbone/core-digest/index.js";
import { CORE_HEALTH } from "../../../src/backbone/core-health/index.js";
import { CORE_STATUS } from "../../../src/backbone/core-status/index.js";
import { buildDeclarations } from "../../../src/cli/build-modules.js";
import { buildCoreVersion, UMBRADB_VERSION } from "../../../src/config/build.js";
import { coreEntry, versionEntry } from "../../../src/config/entries.js";
import { checkHistory } from "../../../src/config/history.js";
import { configRedactor } from "../../../src/config/redact.js";
import { validateConfig } from "../../../src/config/validate.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import { BACKBONE_ORDER, resolveGraph } from "../../../src/modules/graph.js";
import { type DeclarationSet, validateDeclarations } from "../../../src/modules/validation.js";
import { statusOf, type StatusFacts } from "../../../src/runner/process.js";
import { ADMIN_GENESIS, adminCoreSettings, adminSnapshot, ask, startWithAdmin, statusWhen, within } from "../../admin/admin-harness.js";
import { LOOP_BACKBONE } from "../../runner/loop-harness.js";
import { entryOf, loggingModule } from "../../runner/process-build.js";
import { TEST_LEDGER_TABLE } from "../../private/builds.js";

/**
 * The backbone part `core-config` (task 8.4; AE-1, AE-5, AE-6; CORE-ARCH §4.11, §4.18; Q70, Q102): its declaration — a
 * backbone part with no points and no items, after `core-status` in RN-3's order and in the command's build —, its
 * endpoint (the published configuration), what the runner's side builds for it (`configOf`: the process's `core`
 * revision, the entries in effect, the configuration history as recorded, the parts with their declarations without
 * callbacks, the chain identity, the ledger table with the build's package identities, the database, the build), and
 * A140 for it. A66 (its JSON schema) is `./config-schema.test.ts`, A29 `./secrets.test.ts`.
 */

/** A password in the `database` URL and in a module's URL setting: neither may be shown. */
const PASSWORD = "pw-8-4-SECRET";
const DATABASE = `postgres://indexer:${PASSWORD}@db.example:5432/umbra`;

/** Module `m`: a `data` setting `mode`, a `secret` one `apiKey`, a `data` URL `feed`, one table; `version` given. */
function module(version = "1.0.0"): ModuleDeclaration {
  return loggingModule("m", [], ["on-db-write"], {
    version,
    configSchema: z.object({
      mode: z.string().default("a").meta({ kind: "data" }),
      feed: z.string().default("https://feed.example").meta({ kind: "data" }),
      apiKey: z.string().default("none").meta({ kind: "secret" }),
    }),
  });
}

/** The validated configuration of `entries` for a build of `user`, on the test network. */
function checked(entries: readonly unknown[], user: readonly ModuleDeclaration[]) {
  const declarations = validateDeclarations({ backbone: [], core: [], user: [...user] });
  return { declarations, checked: validateConfig({ config: { data: { entries: entries as never } }, declarations, side: "public" }) };
}

const core = (start = 1) => coreEntry({ start, config: { ...adminCoreSettings(DATABASE), listen: { admin: "127.0.0.1:0" } } as never });
const hex = (bytes: Uint8Array) => `0x${Buffer.from(bytes).toString("hex")}`;

describe("core-config's declaration (CORE-ARCH §4.11)", () => {
  it("is a backbone part with no points, no items and no migrations, after core-status in RN-3's order and the build", () => {
    expect(CORE_CONFIG).toMatchObject({
      id: "core-config",
      version: UMBRADB_VERSION,
      side: "public",
      requires: [],
      provides: [],
      startsMidChain: true,
      migrations: [],
      points: {},
    });
    // `toMatchObject` takes `points: {}` as a subset: no callback at all is checked here.
    expect(Object.keys(CORE_CONFIG.points)).toEqual([]);
    expect(Object.isFrozen(CORE_CONFIG)).toBe(true);
    expect(BACKBONE_ORDER.at(-1)).toBe(CORE_CONFIG.id);
    const declarations = validateDeclarations({ backbone: [CORE_CONFIG, CORE_STATUS, CORE_HEALTH, ...[...LOOP_BACKBONE].reverse()], core: [], user: [] });
    const ids = resolveGraph({ declarations, start: 1n, entries: [], developmentOptIn: false, cursor: null }).modules.map((part) => part.id);
    expect(ids.slice(-3)).toEqual(["core-health", "core-status", "core-config"]);
    const build = buildDeclarations().backbone;
    expect(build.at(-1)).toBe(CORE_CONFIG);
  });
});

describe("/config: the published configuration", () => {
  it("answers 200 with the configuration as published", () => {
    const given = adminSnapshot({ config: { ...UNVALIDATED_CONFIG } });
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/config", { snapshot: given, beatAgeMs: 0, nowNs: 0n })).toEqual({ status: 200, body: given.config });
  });

  it("before the configuration is validated: nothing but the build", () => {
    expect(UNVALIDATED_CONFIG).toEqual({
      core: null,
      entries: null,
      history: null,
      modules: null,
      chain: null,
      ledger: null,
      database: null,
      build: { umbradb: UMBRADB_VERSION, commit: null },
    });
  });
});

describe("configOf: what /config shows (AE-5), every secret redacted (AE-6)", () => {
  it("once validated: the process's revision, the entries as validated, the chain as configured, the ledger table, the database", () => {
    const m = module();
    const { checked: config } = checked([core(), entryOf(m, 1, { mode: "b", feed: `https://u:${PASSWORD}@feed.example/x`, apiKey: PASSWORD })], [m]);
    const shown = configOf({ redactor: configRedactor(config), checked: config, core: config.entries[0] as never, opened: null }, false);
    expect(shown.core).toMatchObject({ start: 1, settings: { network: "custom", database: "[redacted]", node: "[redacted]" } });
    expect(shown.entries).toEqual([
      { id: "core", start: 1, stop: null, version: buildCoreVersion(), buildVersion: true, started: null, scheduled: null, settings: shown.core?.settings },
      {
        id: "m",
        start: 1,
        stop: null,
        version: "1.0.0",
        buildVersion: true,
        started: null,
        scheduled: null,
        settings: { mode: "b", feed: "https://[redacted]@feed.example/x", apiKey: "[redacted]" },
      },
    ]);
    expect(shown.history).toBeNull();
    expect(shown.modules).toBeNull();
    expect(shown.chain).toEqual({ network: "custom", genesisHash: ADMIN_GENESIS, start: "1", anchorHash: null });
    expect(shown.ledger).toEqual({ table: { rows: TEST_LEDGER_TABLE.rows, pins: [] }, packages: buildCoreVersion().ledgers });
    expect(shown.database).toEqual({ backend: "postgres", version: null, writerLock: false });
    expect(shown.build).toEqual({ umbradb: UMBRADB_VERSION, commit: null });
    expect(JSON.stringify(shown)).not.toContain(PASSWORD);
    expect(configOf({ redactor: configRedactor(config), checked: config, core: config.entries[0] as never, opened: null }, true).database?.writerLock).toBe(true);
  });

  it("before startup placed it against the cursor, a versionEntry's fields are all redacted, whatever they hold", () => {
    const m = module();
    const old = versionEntry({ id: "m", start: 1, version: "0.9.0", config: { mode: "x", feed: "https://old.example" } });
    const { checked: config } = checked([core(), old, entryOf(m, 4, { mode: "y" })], [m]);
    const shown = configOf({ redactor: configRedactor(config), checked: config, core: config.entries[0] as never, opened: null }, false);
    expect(shown.entries?.[1]).toEqual({
      id: "m",
      start: 1,
      stop: null,
      version: "0.9.0",
      buildVersion: false,
      started: null,
      scheduled: null,
      settings: { mode: "[redacted]", feed: "[redacted]" },
    });
  });

  it("once the database is open: the entries placed, the history as recorded, the parts' declarations, the chain's identity", () => {
    // A database written by m 0.9.0 up to 3, now run by m 1.0.0 from 4: m 0.9.0's revision is a recorded versionEntry.
    const old = module("0.9.0");
    const first = checked([core(), { id: "m", start: 1, version: "0.9.0", config: { mode: "x", feed: `https://u:${PASSWORD}@old.example` } }], [old]);
    const rows = checkHistory({ config: first.checked, cursor: null, declarations: first.declarations, history: [] }).writes;
    const m = module();
    const entries = [
      core(),
      versionEntry({ id: "m", start: 1, version: "0.9.0", config: { mode: "x", feed: `https://u:${PASSWORD}@old.example` } }),
      entryOf(m, 4, { mode: "y" }),
    ];
    const now = checked(entries, [m]);
    const check = checkHistory({ config: now.checked, cursor: 3n, declarations: now.declarations, history: rows });
    const declarations: DeclarationSet<ModuleDeclaration> = validateDeclarations({ backbone: [CORE_CHAIN, CORE_BLOCK_COMMIT, CORE_DIGEST, CORE_CONFIG], core: [], user: [m] });
    // The chain's genesis hash, as startup's check found it, over the configured one.
    const genesis = new Uint8Array(32).fill(0x82);
    const anchor = new Uint8Array(32).fill(0x0a);
    const shown = configOf(
      {
        redactor: configRedactor(now.checked),
        checked: now.checked,
        core: now.checked.entries[0] as never,
        opened: {
          entries: check.entries,
          history: rows,
          declarations,
          modules: [CORE_CHAIN, CORE_DIGEST, CORE_CONFIG, m],
          genesisHash: genesis,
          identity: { genesisHash: genesis, start: 1n, anchorHash: anchor },
          databaseVersion: "18.6",
        },
      },
      true,
    );
    expect(shown.entries?.map((entry) => [entry.id, entry.start, entry.version, entry.started, entry.scheduled])).toEqual([
      ["core", 1, buildCoreVersion(), true, false],
      ["m", 1, "0.9.0", true, false],
      ["m", 4, "1.0.0", false, false],
    ]);
    // The recorded versionEntry's settings are data once the history found them equal to its row; credentials hidden.
    expect(shown.entries?.[1]?.settings).toEqual({ mode: "x", feed: "https://[redacted]@old.example" });
    expect(shown.history).toEqual(
      rows.map((row) => ({
        id: row.id,
        start: String(row.start),
        stop: row.stop === null ? null : String(row.stop),
        version: row.version,
        data: row.id === "m" ? { mode: "x", feed: "https://[redacted]@old.example" } : expect.any(Object),
        dataHash: row.dataHash === null ? null : hex(row.dataHash),
      })),
    );
    expect(shown.chain).toEqual({ network: "custom", genesisHash: hex(genesis), start: "1", anchorHash: hex(anchor) });
    expect(shown.chain?.genesisHash).not.toBe(ADMIN_GENESIS);
    expect(shown.database).toEqual({ backend: "postgres", version: "18.6", writerLock: true });
    expect(shown.modules?.map((part) => `${part.origin} ${part.id}`)).toEqual(["backbone core-chain", "backbone core-digest", "backbone core-config", "user m"]);
    expect(JSON.stringify(shown)).not.toContain(PASSWORD);
  });

  it("declarationView: a declaration without its callbacks — items, migrations by checksum, settings' kinds, points", () => {
    const m = module();
    expect(declarationView(m, "user")).toEqual({
      id: "m",
      version: "1.0.0",
      side: "public",
      origin: "user",
      requires: ["block-header"],
      provides: [{ name: "m-rows", lifetimes: ["table"], table: { schema: "m", tables: ["rows"], kind: "append-only", deterministic: true } }],
      startsMidChain: true,
      developmentOnly: false,
      requiresResync: false,
      needsLockstep: false,
      settings: { mode: "data", feed: "data", apiKey: "secret" },
      migrations: [{ id: "001", checksum: createHash("sha256").update("CREATE TABLE m.rows (height bigint PRIMARY KEY)").digest("hex") }],
      points: ["on-db-write"],
    });
    expect(declarationView(CORE_CHAIN, "backbone")).toMatchObject({
      requires: [],
      provides: expect.arrayContaining([{ name: "db", lifetimes: ["process"], table: null }]),
      points: Object.keys(CORE_CHAIN.points),
    });
    const lockstep = { ...m, side: "private" as const, needsLockstep: true };
    expect(declarationView(lockstep, "user")).toMatchObject({ side: "private", needsLockstep: true });
    const opted = { ...m, provides: [{ name: "m-rows", lifetimes: ["table" as const], table: { schema: "m", tables: ["rows"], kind: "mutable" as const, deterministic: false as const } }], developmentOnly: true, requiresResync: true };
    expect(declarationView(opted, "core")).toMatchObject({
      origin: "core",
      provides: [{ table: { kind: "mutable", deterministic: false } }],
      developmentOnly: true,
      requiresResync: true,
    });
    expect(JSON.stringify(declarationView(m, "user"))).not.toContain("function");
  });
});

describe("recordedHistory: core_chain.config once core-chain recorded the history check's rows", () => {
  it("replaces each row a write gives by (id, start), keeps the others, and adds the new ones after them", () => {
    const row = (id: string, start: bigint, version: string) => ({ id, start, stop: null, version, data: {}, dataHash: null });
    const read = [row("core", 1n, "c1"), row("m", 1n, "1.0.0"), row("m", 5n, "1.1.0")];
    const writes = [row("m", 5n, "1.2.0"), row("n", 1n, "2.0.0"), row("m", 9n, "1.3.0")];
    expect(recordedHistory(read, writes)).toEqual([read[0], read[1], writes[0], writes[1], writes[2]]);
    expect(recordedHistory([], writes)).toEqual(writes);
    expect(recordedHistory(read, [])).toEqual(read);
    // The key is the pair: the same start of another entry is another row.
    expect(recordedHistory([row("m", 1n, "1.0.0")], [row("n", 1n, "2.0.0")])).toHaveLength(2);
  });
});

describe("ProcessAdmin's /config facts: the database's version, the anchor once recorded, the writer lock", () => {
  /** A fake admin server that records what it is published. */
  function recording() {
    const published: AdminSnapshot[] = [];
    const start = async (options: AdminStartOptions): Promise<AdminServer> => {
      published.push(options.snapshot);
      return { host: "127.0.0.1", port: 10_003, threadId: null, publish: (snapshot) => published.push(snapshot), close: async () => undefined };
    };
    return { published, start };
  }

  const running = (facts: Partial<StatusFacts> = {}) =>
    statusOf({ phase: "running", start: 1n, cursor: 1n, head: 1n, followingThreshold: 3, readinessLag: null, conditions: [], ended: null, reason: null, ...facts });

  it("reads the server's version once and the identity until its anchor is recorded; the writer lock as the process knows it", async () => {
    const fake = recording();
    let status = running();
    const admin = new ProcessAdmin({ status: () => status, log: () => undefined, start: fake.start });
    const { checked: config, declarations: built } = checked([core()], []);
    await admin.serve(config, config.entries[0] as never);
    expect(fake.published.at(-1)?.config).toMatchObject({ database: { backend: "postgres", version: null, writerLock: false } });
    const queries: string[] = [];
    let anchor: Uint8Array | null = null;
    const genesis = new Uint8Array(32).fill(0x81);
    const db = {
      read: async <T>(body: (read: { query(sql: string): Promise<Record<string, unknown>[]> }) => Promise<T>): Promise<T> =>
        body({
          query: async (sql: string) => {
            queries.push(sql);
            if (sql.includes("server_version")) return [{ version: "18.6" }];
            if (sql.includes("to_regclass")) return [{ present: true }];
            if (sql.includes("core_chain.identity")) return [{ genesis_hash: genesis, start_height: 1n, anchor_hash: anchor }];
            return [];
          },
        }),
    };
    const check = checkHistory({ config, cursor: null, declarations: built, history: [] });
    admin.opened({
      declarations: built,
      modules: [CORE_CHAIN],
      revisionsOf: () => [],
      db: db as never,
      check,
      // A row the check does not write again: it stays in the history shown, beside the check's rows.
      history: [{ id: "gone", start: 1n, stop: null, version: "0.1.0", data: {}, dataHash: null }],
      genesisHash: genesis,
    });
    await sleep(10);
    const config1 = fake.published.at(-1)?.config;
    expect(config1?.database).toEqual({ backend: "postgres", version: "18.6", writerLock: true });
    expect(config1?.history?.map((row) => row.id)).toEqual(["gone", ...check.writes.map((row) => row.id)]);
    expect(config1?.chain).toMatchObject({ anchorHash: null });
    expect(queries.filter((sql) => sql.includes("server_version"))).toHaveLength(1);
    // Block S commits: the anchor is read at the next publication, and no more once it is known.
    anchor = new Uint8Array(32).fill(0x0b);
    admin.committed();
    admin.publish();
    await sleep(10);
    expect(fake.published.at(-1)?.config.chain).toMatchObject({ anchorHash: hex(anchor) });
    const identityReads = queries.filter((sql) => sql.includes("core_chain.identity")).length;
    admin.committed();
    admin.publish();
    await sleep(10);
    expect(queries.filter((sql) => sql.includes("core_chain.identity"))).toHaveLength(identityReads);
    expect(queries.filter((sql) => sql.includes("server_version"))).toHaveLength(1);
    // The writer lock: not while a lost connection is retried, never after writer-lock-lost.
    status = running({ conditions: [{ code: "database-retrying", attempts: 1, height: 2n }] });
    admin.publish();
    expect(fake.published.at(-1)?.config.database?.writerLock).toBe(false);
    status = running({ phase: "halted", reason: { code: "writer-lock-lost", height: 2n, module: null, point: null } });
    admin.publish();
    expect(fake.published.at(-1)?.config.database?.writerLock).toBe(false);
    status = running({ phase: "halted", reason: { code: "callback-error", height: 2n, module: "m", point: "on-compute" } });
    admin.publish();
    expect(fake.published.at(-1)?.config.database?.writerLock).toBe(true);
    await admin.close();
  });
});

describe("A140 for /config: core-config's, from its own folder, its tests beside it", () => {
  it("the admin route table mounts core-config's endpoint as the part gives it", () => {
    expect(ADMIN_PARTS.find((part) => part.id === "core-config")).toBe(CORE_CONFIG_ENDPOINTS);
    expect(CORE_CONFIG_ENDPOINTS.endpoints.map((endpoint) => endpoint.path)).toEqual(["/config"]);
    expect(ADMIN_ROUTES.get("/config")).toBe(CORE_CONFIG_ENDPOINTS.endpoints[0]);
    expect(Object.isFrozen(CORE_CONFIG_ENDPOINTS) && Object.isFrozen(CORE_CONFIG_ENDPOINTS.endpoints)).toBe(true);
  });

  it("a configuration refused by its validation serves no /config (the process ends); one past the validation answers with its configuration redacted", async () => {
    // A refusal of the configuration itself ends the process before any admin listener opens (task 8.1b, Q137 B):
    // nothing is asked of the admin starter, and the process closes by itself.
    const early = startWithAdmin({ database: `postgres://indexer:${PASSWORD}@127.0.0.1:9/umbradb`, extra: { tipCap: "many" } });
    await expect(early.handle.started).rejects.toMatchObject({ code: "invalid-configuration" });
    await early.handle.closed;
    expect(await within(early.requested, 100)).toBe(false);
    expect(early.lines.join("\n")).not.toContain(PASSWORD);

    // Past the validation, still starting: the database cannot be reached (port 9), its connection retried.
    const late = startWithAdmin({ database: `postgres://indexer:${PASSWORD}@127.0.0.1:9/umbradb`, extra: { backoffCeilingMs: 100 } });
    const origin = await late.origin();
    const shown = await ask(origin, "/config");
    expect(shown).toMatchObject({ status: 200, json: { core: { settings: { database: "[redacted]" } }, database: { backend: "postgres", writerLock: false } } });
    expect(shown.text).not.toContain(PASSWORD);
    await late.handle.stop();
  });

  it("lives in src/backbone/core-config/, with its tests and its JSON schema in test/backbone/core-config/", () => {
    const source = fileURLToPath(new URL("../../../src/backbone/core-config/", import.meta.url));
    for (const file of ["core-config.ts", "endpoints.ts", "index.ts"]) expect(existsSync(`${source}${file}`), file).toBe(true);
    const here = readdirSync(fileURLToPath(new URL(".", import.meta.url)));
    expect(here.filter((file) => file.endsWith(".test.ts")).sort()).toEqual(["config-schema.test.ts", "core-config.test.ts", "secrets.test.ts"]);
    expect(here).toContain("config.schema.json");
  });
});
