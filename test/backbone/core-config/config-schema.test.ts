import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { configOf, UNVALIDATED_CONFIG } from "../../../src/admin/configuration.js";
import { CORE_DIGEST } from "../../../src/backbone/core-digest/index.js";
import { coreEntry, versionEntry } from "../../../src/config/entries.js";
import { checkHistory } from "../../../src/config/history.js";
import { configRedactor } from "../../../src/config/redact.js";
import { FIELD_KINDS, LIFETIMES, type ModuleDeclaration, POINTS, TABLE_KINDS } from "../../../src/modules/declaration.js";
import { validateDeclarations } from "../../../src/modules/validation.js";
import { validateConfig } from "../../../src/config/validate.js";
import { adminCore, adminCoreSettings, type AdminRun, ask, startWithAdmin, statusWhen } from "../../admin/admin-harness.js";
import { schemaFile, validatorOf } from "../../admin/json-schema.js";
import { PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { entryOf, loggingModule } from "../../runner/process-build.js";

/**
 * A66 for `/config` (task 8.4; AE-5): every `/config` body validates against the JSON schema committed here,
 * `./config.schema.json` (draft 2020-12, checked by Ajv 8.18.0 in strict mode: `test/admin/json-schema.ts`), through
 * the process on PostgreSQL 18 and PGlite: refused before the validation (the build only), refused after it (the
 * configuration, no database facts yet), running (everything: the entries placed, the history as `core_chain.config`
 * holds it, the parts with their declarations, the chain's identity with its anchor once block S committed, the
 * database's backend, version and writer lock), and a recorded `versionEntry` shown as data.
 *
 * Committed negative controls: a body without any one of its required fields, with a field the schema does not have, or
 * with a value of the wrong form fails the schema.
 */

const CONFIG_SCHEMA = validatorOf(schemaFile(new URL("./config.schema.json", import.meta.url)));

/** Module `m` with a `data` setting `mode` and the version `version`. */
function moded(version = "1.0.0"): ModuleDeclaration {
  return loggingModule("m", [], ["on-db-write"], {
    version,
    configSchema: z.object({ mode: z.string().default("a").meta({ kind: "data" }) }),
  });
}

/** A full `/config` body as `configOf` builds it, on the test network. */
function body(): Record<string, unknown> {
  const m = moded();
  const declarations = validateDeclarations({ backbone: [], core: [], user: [m] });
  const entries = [coreEntry({ start: 1, config: adminCoreSettings("pglite:memory") as never }), entryOf(m, 1, { mode: "b" })];
  const checked = validateConfig({ config: { data: { entries: entries as never } }, declarations, side: "public" });
  const check = checkHistory({ config: checked, cursor: null, declarations, history: [] });
  const genesis = new Uint8Array(32).fill(0x81);
  const shown = configOf(
    {
      redactor: configRedactor(checked),
      checked,
      core: checked.entries[0] as never,
      opened: {
        entries: check.entries,
        history: check.writes,
        declarations: validateDeclarations({ backbone: [CORE_DIGEST], core: [], user: [m] }),
        modules: [CORE_DIGEST, m],
        genesisHash: genesis,
        identity: { genesisHash: genesis, start: 1n, anchorHash: genesis },
        databaseVersion: "18.6",
      },
    },
    true,
  );
  return JSON.parse(JSON.stringify(shown)) as Record<string, unknown>;
}

describe("A66: /config's JSON schema", () => {
  it("is a draft 2020-12 schema; a full body validates, and so does one before the validation", () => {
    expect(CONFIG_SCHEMA.problems(body())).toEqual([]);
    expect(CONFIG_SCHEMA.problems(JSON.parse(JSON.stringify(UNVALIDATED_CONFIG)))).toEqual([]);
  });

  it("names MD-1's points, lifetimes, table kinds and setting kinds, and every field the endpoint answers, each required", () => {
    const schema = schemaFile(new URL("./config.schema.json", import.meta.url)) as any;
    expect(schema.$defs.point.enum).toEqual([...POINTS]);
    expect(schema.$defs.item.properties.lifetimes.items.enum).toEqual([...LIFETIMES]);
    expect(schema.$defs.item.properties.table.oneOf[1].properties.kind.enum).toEqual([...TABLE_KINDS]);
    expect(schema.$defs.declaration.properties.settings.additionalProperties.enum).toEqual([...FIELD_KINDS]);
    expect([...schema.required].sort()).toEqual(Object.keys(body()).sort());
    expect(Object.keys(schema.properties).sort()).toEqual(Object.keys(body()).sort());
  });

  it("negative controls: a body missing any required field, with an extra one, or with a value of another form fails", () => {
    const valid = body();
    for (const field of Object.keys(valid)) {
      const missing = { ...valid };
      delete missing[field];
      expect(CONFIG_SCHEMA.problems(missing).join("\n"), field).toContain(`must have required property '${field}'`);
    }
    expect(CONFIG_SCHEMA.problems({ ...valid, secrets: {} }).join("\n")).toContain("must NOT have additional properties");
    const wrong: Record<string, (b: Record<string, any>) => void> = {
      "an entry without its settings": (b) => delete b.entries[0].settings,
      "an entry's start as text": (b) => (b.entries[1].start = "1"),
      "a recorded row's start as a number": (b) => (b.history[0].start = 1),
      "a data hash without its prefix": (b) => (b.history[0].dataHash = "ab".repeat(32)),
      "a declaration with a callback's name not a point": (b) => (b.modules[1].points = ["on-commit"]),
      "a declaration's setting of no kind": (b) => (b.modules[1].settings = { mode: "public" }),
      "a migration's checksum in upper case": (b) => (b.modules[1].migrations[0].checksum = "AB".repeat(32)),
      "an item with another table kind": (b) => (b.modules[1].provides[0].table.kind = "temporal"),
      "a network that is none": (b) => (b.chain.network = "testnet"),
      "a genesis hash too short": (b) => (b.chain.genesisHash = "0x81"),
      "a ledger row of another ledger": (b) => (b.ledger.table.rows = [{ specVersionMin: 0, specVersionMax: 1, ledger: "v7" }]),
      "a third backend": (b) => (b.database.backend = "sqlite"),
      "a writer lock as text": (b) => (b.database.writerLock = "held"),
      "a build commit (none since Q134 D)": (b) => (b.build.commit = "a75ed95"),
      "a build commit of null": (b) => (b.build.commit = null),
    };
    for (const [name, change] of Object.entries(wrong)) {
      const changed = JSON.parse(JSON.stringify(valid)) as Record<string, any>;
      change(changed);
      expect(CONFIG_SCHEMA.problems(changed).length, name).toBeGreaterThan(0);
    }
  });
});

/** `/config`'s body once `/status` shows what `wanted` holds of, checked against the schema. */
async function valid(run: AdminRun, wanted: Parameters<typeof statusWhen>[1]): Promise<Record<string, any>> {
  const origin = await run.origin();
  await statusWhen(origin, wanted, 60_000);
  const shown = (await ask(origin, "/config")).json as Record<string, any>;
  expect(CONFIG_SCHEMA.problems(shown), JSON.stringify(shown)).toEqual([]);
  return shown;
}

/** `/config`'s body once `wanted` holds of it. */
async function configWhen(run: AdminRun, wanted: (config: Record<string, any>) => boolean): Promise<Record<string, any>> {
  const origin = await run.origin();
  const until = Date.now() + 60_000;
  for (;;) {
    const shown = (await ask(origin, "/config")).json as Record<string, any>;
    if (wanted(shown)) return shown;
    if (Date.now() > until) throw new Error(`/config never matched; last: ${JSON.stringify(shown)}`);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

describe.each(PROCESS_BACKENDS)("A66: /config through the process validates on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A66: refused before the database opens, refused after it, and running with everything the process knows", async () => {
    // Refused once the configuration is validated, before the database opens (PGlite without the development opt-in,
    // CF-9); a refusal of the configuration itself ends the process and serves no /config (task 8.1b, Q137 B).
    const early = startWithAdmin({ database: "pglite:memory", extra: { developmentOptIn: false } });
    expect(await valid(early, (b) => b.state === "refused")).toMatchObject({
      core: { settings: { database: "[redacted]" } },
      history: null,
      modules: null,
      // Known from the `core` revision; not opened: no server version, no writer lock.
      database: { backend: "pglite", version: null, writerLock: false },
    });
    await early.handle.stop();

    const db = await backend.database();
    const first = startWithAdmin({ database: db.setting, user: [loggingModule("m", [], ["on-db-write"])] });
    await statusWhen(await first.origin(), (b) => b.cursor === "3", 60_000);
    await first.handle.stop();
    const changed = startWithAdmin({
      database: db.setting,
      user: [loggingModule("m", [], ["on-db-write"], { migrations: [{ id: "001", sql: "CREATE TABLE m.rows (height bigint PRIMARY KEY, x int)" }] })],
    });
    const late = await valid(changed, (b) => b.state === "refused");
    expect(late).toMatchObject({ core: { settings: { database: "[redacted]" } }, history: null, modules: null });
    expect(late.entries.map((entry: { id: string }) => entry.id)).toEqual(["core", "m"]);
    await changed.handle.stop();

    const running = startWithAdmin({ database: (await backend.database()).setting, user: [moded()], keepDb: true });
    const shown = await valid(running, (b) => b.cursor === "3");
    expect(shown.database).toEqual({ backend: backend.kind, version: expect.stringMatching(/^18\./), writerLock: true });
    expect(shown.entries.map((entry: { id: string; started: boolean }) => [entry.id, entry.started])).toEqual([
      ["core", false],
      ["m", false],
      ["keeper", false],
    ]);
    expect(shown.modules.map((part: { id: string }) => part.id)).toContain("core-config");
    expect(shown.modules.find((part: { id: string }) => part.id === "m")).toMatchObject({ settings: { mode: "data" }, points: ["on-db-write"] });
    // The history and the identity as the database holds them (recorded at startup; the anchor at block S).
    const opened = await running.db();
    const rows = await opened.read((read) => read.query("SELECT entry_id, start::text AS start, version FROM core_chain.config ORDER BY entry_id, start"));
    expect(shown.history.map((row: { id: string; start: string; version: string }) => [row.id, row.start, row.version]).sort()).toEqual(
      rows.map((row) => [row.entry_id, row.start, row.version]).sort(),
    );
    const [identity] = await opened.read((read) => read.query("SELECT genesis_hash, anchor_hash FROM core_chain.identity"));
    const hex = (bytes: unknown) => `0x${Buffer.from(bytes as Uint8Array).toString("hex")}`;
    const anchored = await configWhen(running, (config) => config.chain?.anchorHash !== null);
    expect(CONFIG_SCHEMA.problems(anchored)).toEqual([]);
    expect(anchored.chain).toEqual({ network: "custom", genesisHash: hex(identity?.genesis_hash), start: "1", anchorHash: hex(identity?.anchor_hash) });
    await running.handle.stop();
  }, 180_000);

  it("A66: a recorded versionEntry, shown as data once the history found it equal to its row", async () => {
    const db = await backend.database();
    const old = moded("0.9.0");
    const before = startWithAdmin({ database: db.setting, user: [old], head: 3n, entries: [adminCore(db.setting, 1, { extra: { listen: { admin: "127.0.0.1:0" } } }), entryOf(old, 1, { mode: "x" })] });
    await statusWhen(await before.origin(), (b) => b.cursor === "3", 60_000);
    await before.handle.stop();
    const m = moded();
    const after = startWithAdmin({
      database: db.setting,
      user: [m],
      head: 5n,
      entries: [
        adminCore(db.setting, 1, { extra: { listen: { admin: "127.0.0.1:0" } } }),
        versionEntry({ id: "m", start: 1, version: "0.9.0", config: { mode: "x" } }),
        entryOf(m, 4, { mode: "y" }),
      ],
    });
    const shown = await valid(after, (b) => b.cursor === "5");
    expect(shown.entries.filter((entry: { id: string }) => entry.id === "m")).toEqual([
      { id: "m", start: 1, stop: null, version: "0.9.0", buildVersion: false, started: true, scheduled: false, settings: { mode: "x" } },
      { id: "m", start: 4, stop: null, version: "1.0.0", buildVersion: true, started: false, scheduled: false, settings: { mode: "y" } },
    ]);
    await after.handle.stop();
  }, 180_000);
});
