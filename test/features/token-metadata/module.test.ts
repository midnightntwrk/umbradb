import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TOKEN_METADATA } from "../../../src/features/token-metadata/token-metadata.ts";
import { commonRecords } from "../../../src/features/token-metadata/vendor/mip0018/codec/src/index.ts";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, runTo, startRun } from "./harness.js";

/**
 * `token-metadata` through the real process on PostgreSQL 18 and PGlite: it starts with a database at any S, refuses
 * an entry above S, and stores a block's candidates with their effect on the fields.
 */

const hex = (value: unknown): string => Buffer.from(value as Uint8Array).toString("hex");

describe.each(PROCESS_BACKENDS)("token-metadata's start on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a new database at S > 0 with the module from S starts and stores an event's fields", async () => {
    const db = await backend.database();
    const logs = new Map([[1_000_002n, blockLogs([0, contract(1), eventData(domain(7), 1, commonRecords({ name: "Acme Gold", symbol: "AG", decimals: 6 }))])]]);
    await runTo(db, { start: 1_000_000, head: 1_000_003, logs });
    const events = await db.query("SELECT height::text AS height, tx_index, event_index, classification, reason, kind FROM token_metadata.events");
    expect(events).toEqual([{ height: "1000002", tx_index: 0, event_index: 0, classification: "accept", reason: null, kind: 1 }]);
    const fields = await db.query(
      "SELECT convert_from(key, 'UTF8') AS key, val_type, encode(value, 'hex') AS value, uint_value::text AS uint, usable, defined, set_height::text AS at FROM token_metadata.fields ORDER BY key",
    );
    expect(fields).toEqual([
      { key: "decimals", val_type: 2, value: "06", uint: "6", usable: true, defined: true, at: "1000002" },
      { key: "name", val_type: 1, value: hex(new TextEncoder().encode("Acme Gold")), uint: null, usable: true, defined: true, at: "1000002" },
      { key: "symbol", val_type: 1, value: hex(new TextEncoder().encode("AG")), uint: null, usable: true, defined: true, at: "1000002" },
    ]);
  }, 240_000);

  it("a new database at S = 1,000,000 with core-contract-logs-fast and the module from S starts (a new database at the tip)", async () => {
    const db = await backend.database();
    await runTo(db, { start: 1_000_000, head: 1_000_002, fast: true });
    expect(await db.query("SELECT count(*)::int AS n FROM token_metadata.events")).toEqual([{ n: 0 }]);
    expect(await db.query("SELECT max(height)::int AS h FROM core_block_commit.blocks")).toEqual([{ h: 1_000_002 }]);
  }, 240_000);

  it("refuses an entry above the database's S with token-metadata-start-after-database (S = 0, cursor 5, added from 6)", async () => {
    const db = await backend.database();
    await runTo(db, { start: 0, head: 5, modules: [] });
    const handle = startRun(db, { start: 0, head: 8, moduleStart: (id) => (id === TOKEN_METADATA.id ? 6 : 0) });
    const refusal = await handle.started.then(
      () => null,
      (error: unknown) => error,
    );
    const status = handle.status();
    await handle.stop();
    expect(status).toMatchObject({ state: "refused", reason: { code: "callback-error", module: "token-metadata", point: "on-start-db" } });
    expect(refusal).toMatchObject({ code: "callback-error", details: { module: "token-metadata", point: "on-start-db" } });
    expect((refusal as Error).cause).toMatchObject({ code: "token-metadata-start-after-database", entryStart: 6n, databaseStart: 0n });
    expect(await db.query("SELECT max(height)::int AS h FROM core_block_commit.blocks")).toEqual([{ h: 5 }]);
  }, 240_000);
});

describe("token-metadata's on-start-db", () => {
  const startDb = TOKEN_METADATA.points["on-start-db"];
  const handle = (s: bigint | null) => ({
    height: null,
    query: async () => (s === null ? [] : [{ start_height: s }]),
    execute: async () => 0,
  });
  const revision = (start: bigint, version = "0.1.0") => ({ start, stop: null, version, settings: {} });
  const context = (...revisions: ReturnType<typeof revision>[]) => ({ items: new Map(), revisions, publish: () => undefined });

  it("accepts a first revision at or below S, whatever later revisions start at; refuses one above S", async () => {
    await expect(startDb(context(revision(10n)), handle(10n))).resolves.toBeUndefined();
    await expect(startDb(context(revision(4n)), handle(10n))).resolves.toBeUndefined();
    await expect(startDb(context(revision(10n), revision(50n, "0.1.1")), handle(10n))).resolves.toBeUndefined();
    await expect(startDb(context(revision(11n)), handle(10n))).rejects.toMatchObject({
      code: "token-metadata-start-after-database",
      entryStart: 11n,
      databaseStart: 10n,
    });
  });

  it("accepts before the database has an identity, and with no revision", async () => {
    await expect(startDb(context(revision(11n)), handle(null))).resolves.toBeUndefined();
    await expect(startDb(context(), handle(10n))).resolves.toBeUndefined();
  });
});
