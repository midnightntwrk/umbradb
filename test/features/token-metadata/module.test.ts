import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { tokenColor } from "../../../src/features/token-metadata/color.js";
import { earlierNamedLogs, STATEMENTS } from "../../../src/features/token-metadata/sql.js";
import { firstUncovered, TOKEN_METADATA } from "../../../src/features/token-metadata/token-metadata.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import { commonRecords, EVENT_NAME } from "../../../src/features/token-metadata/codec/index.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import type { ContractLog } from "../../../src/backbone/contract-logs/contract-logs.js";
import { cursorReaches } from "../../library/library-fixtures.js";
import type { ProcessDatabase } from "../../runner/process-backends.js";
import { statementText, type Statement } from "../../../src/db/repeated-statements.js";
import { blockLogs, contract, domain, eventData, miscData, runTo, startRun, TEST_LOGS_ID } from "./harness.js";

/**
 * `token-metadata` through the real process on PostgreSQL 18 and PGlite: it starts with a database at any S, and
 * stores a block's candidates with their effect on the fields. Added to a database that already ran, it starts when
 * the stored contract logs show nothing below its start that it would have applied, and is refused otherwise.
 */

const hex = (value: unknown): string => Buffer.from(value as Uint8Array).toString("hex");

describe.each(PROCESS_BACKENDS)("token-metadata's start on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a new database at S > 0 with the module from S starts and stores an event's fields", async () => {
    const db = await backend.database();
    const logs = new Map([[1_000_002n, blockLogs([0, contract(1), eventData(domain(7), 1, commonRecords({ name: "Acme Gold", symbol: "AG", decimals: 6 }))])]]);
    await runTo(db, { start: 1_000_000, head: 1_000_003, logs });
    // An accepted event leaves no event row: its effect is the token's row and fields.
    expect(await db.query("SELECT encode(id, 'hex') AS id, kind, encode(symbol, 'hex') AS symbol FROM token_metadata.tokens")).toEqual([
      { id: hex(tokenColor(domain(7), contract(1))), kind: 1, symbol: hex(new TextEncoder().encode("AG")) },
    ]);
    const fields = await db.query(
      "SELECT convert_from(key, 'UTF8') AS key, val_type, encode(value, 'hex') AS value, uint_value::text AS uint, usable, set_height::text AS at FROM token_metadata.fields ORDER BY key",
    );
    expect(fields).toEqual([
      { key: "decimals", val_type: 2, value: "06", uint: "6", usable: true, at: "1000002" },
      { key: "name", val_type: 1, value: hex(new TextEncoder().encode("Acme Gold")), uint: null, usable: true, at: "1000002" },
      { key: "symbol", val_type: 1, value: hex(new TextEncoder().encode("AG")), uint: null, usable: true, at: "1000002" },
    ]);
  }, 240_000);

  it("a new database at S = 1,000,000 with core-contract-logs-fast and the module from S starts (a new database at the tip)", async () => {
    const db = await backend.database();
    await runTo(db, { start: 1_000_000, head: 1_000_002, fast: true });
    expect(await db.query("SELECT count(*)::int AS n FROM token_metadata.tokens")).toEqual([{ n: 0 }]);
    expect(await db.query("SELECT max(height)::int AS h FROM core_block_commit.blocks")).toEqual([{ h: 1_000_002 }]);
  }, 240_000);

  /** Runs a database from 0 to 5 without the module (the provider storing `earlier`), then adds the module from 6. */
  const addedLater = async (earlier: Parameters<typeof runTo>[1], later: ReadonlyMap<bigint, readonly ContractLog[]> = new Map()) => {
    const db = await backend.database();
    await runTo(db, { ...earlier, start: 0, head: 5, modules: [] });
    const logs = new Map([...(earlier.logs ?? new Map()), ...later]);
    const handle = startRun(db, {
      ...earlier,
      logs,
      start: 0,
      head: 8,
      modules: [TOKEN_METADATA as ModuleDeclaration],
      moduleStart: (id) => (id === TOKEN_METADATA.id ? 6 : (earlier.moduleStart?.(id) ?? 0)),
    });
    const refusal = await handle.started.then(
      () => null,
      (error: unknown) => error,
    );
    if (refusal === null) await cursorReaches(handle, 8n);
    const status = handle.status();
    await handle.stop();
    return { db, refusal, status };
  };
  const refused = (run: Awaited<ReturnType<typeof addedLater>>, why: RegExp) => {
    expect(run.status).toMatchObject({ state: "refused", reason: { code: "callback-error", module: "token-metadata", point: "on-start-db" } });
    expect(run.refusal).toMatchObject({ code: "callback-error", details: { module: "token-metadata", point: "on-start-db" } });
    expect((run.refusal as Error).cause).toMatchObject({ code: "token-metadata-start-after-database", entryStart: 6n, databaseStart: 0n, why: expect.stringMatching(why) });
  };
  const event = (name: string) => eventData(domain(7), 1, commonRecords({ name, symbol: "AG", decimals: 6 }));
  const names = async (db: ProcessDatabase) =>
    (await db.query("SELECT convert_from(value, 'UTF8') AS name FROM token_metadata.fields WHERE key = convert_to('name', 'UTF8') ORDER BY 1")).map((r) => r.name);

  it("added from 6 to a database that ran to 5 (S = 0): it starts when no stored log below 6 is a MIP-0018 event, and applies what comes after", async () => {
    // Below its start: a Misc log of another name and a log of another type. At 7: an event.
    const other = miscData(new TextEncoder().encode("another:name"), Uint8Array.of(1, 2, 3));
    const run = await addedLater(
      { start: 0, head: 5, logs: new Map([[3n, blockLogs([0, contract(1), other], [0, contract(1), event("Unused"), "Paused"])]]) },
      new Map([[7n, blockLogs([0, contract(1), event("Acme Gold")])]]),
    );
    expect(run.refusal).toBeNull();
    expect(await names(run.db)).toEqual(["Acme Gold"]);
    expect(await run.db.query("SELECT max(height)::int AS h FROM core_block_commit.blocks")).toEqual([{ h: 8 }]);
  }, 240_000);

  it("a rejected MIP-0018 event below its start changes nothing, so the module starts", async () => {
    const malformed = miscData(EVENT_NAME, Uint8Array.of(1, 2, 3));
    const run = await addedLater({ start: 0, head: 5, logs: new Map([[3n, blockLogs([0, contract(1), malformed])]]) });
    expect(run.refusal).toBeNull();
    expect(await names(run.db)).toEqual([]);
  }, 240_000);

  it("refuses it when a stored log below its start is a MIP-0018 event it would have applied, naming the log", async () => {
    const run = await addedLater({ start: 0, head: 5, logs: new Map([[3n, blockLogs([0, contract(1), event("Missed")])]]) });
    refused(run, /^the stored log 0 of transaction 0 at height 3 is a MIP-0018 event the module did not apply$/);
    expect(await run.db.query("SELECT max(height)::int AS h FROM core_block_commit.blocks")).toEqual([{ h: 5 }]);
  }, 240_000);

  it("refuses it when a log site below its start is unresolved, since that site may be an event", async () => {
    const site = { transaction: 0, index: 0, address: contract(1), entryPoint: new Uint8Array(), reason: "not-a-literal" as const, segment: 0, fallible: false, call: 0, op: 0 };
    const run = await addedLater({ start: 0, head: 5, unresolved: new Map([[2n, [site]]]) });
    refused(run, /^height 2 has a log site core-contract-logs-fast could not read/);
  }, 240_000);

  it("refuses it when contract logs were not stored from S: the provider started at 4", async () => {
    const run = await addedLater({ start: 0, head: 5, moduleStart: (id) => (id === TEST_LOGS_ID ? 4 : 0) });
    refused(run, /^the database stored no contract logs at height 0 /);
  }, 240_000);
});

describe("token-metadata's on-start-db", () => {
  const startDb = TOKEN_METADATA.points["on-start-db"];
  /** What the database holds, as the start reads it: S, the cursor, the log providers' revisions, and the stored logs. */
  interface Stored {
    readonly cursor?: bigint;
    readonly providers?: readonly { start: bigint; stop: bigint | null }[];
    readonly unresolved?: readonly bigint[];
    readonly logs?: readonly { height: bigint; tx_index: number; log_index: number; data: Uint8Array }[];
  }
  const handle = (s: bigint | null, stored: Stored = {}) => {
    const asked: string[] = [];
    return {
      asked,
      height: null,
      query: async (statement: Statement, params: readonly unknown[] = []) => {
        const sql = statementText(statement);
        asked.push(sql);
        if (sql === STATEMENTS.databaseStart) return s === null ? [] : [{ start_height: s }];
        if (sql === STATEMENTS.providerRevisions) return [...(stored.providers ?? [{ start: s ?? 0n, stop: null }])];
        if (sql === STATEMENTS.earlierUnresolvedSite) return (stored.unresolved ?? []).filter((h) => h < (params[0] as bigint)).map((height) => ({ height }));
        if (sql === STATEMENTS.earlierNamedLogs) {
          const [below, , h, t, l, limit] = params as [bigint, Uint8Array, bigint, number, number, number];
          return (stored.logs ?? [])
            .filter((r) => r.height < below && (r.height > h || (r.height === h && (r.tx_index > t || (r.tx_index === t && r.log_index > l)))))
            .slice(0, limit);
        }
        if (sql.includes("to_regclass")) return [{ present: stored.cursor !== undefined, exists: stored.cursor !== undefined, regclass: stored.cursor === undefined ? null : "core_block_commit.blocks" }];
        if (sql.includes("core_block_commit")) return stored.cursor === undefined ? [] : [{ height: stored.cursor, hash: new Uint8Array(32) }];
        throw new Error(`unexpected statement: ${sql}`);
      },
      execute: async () => 0,
    };
  };
  const revision = (start: bigint, version = "0.1.0") => ({ start, stop: null as bigint | null, version, settings: {} });
  const context = (...revisions: ReturnType<typeof revision>[]) => ({ items: new Map(), revisions, publish: () => undefined });
  const log = (height: bigint, data: Uint8Array, tx_index = 0, log_index = 0) => ({ height, tx_index, log_index, data });
  const accepted = eventData(domain(7), 1, commonRecords({ name: "Acme", symbol: "AG", decimals: 6 }));
  const refusal = (why: RegExp) => ({ code: "token-metadata-start-after-database", entryStart: 11n, databaseStart: 10n, why: expect.stringMatching(why) });

  it("a first revision at or below S starts without reading the stored logs, whatever later revisions start at", async () => {
    for (const revisions of [[revision(10n)], [revision(4n)], [revision(10n), revision(50n, "0.1.1")]]) {
      const w = handle(10n, { logs: [log(10n, accepted)] });
      await expect(startDb(context(...revisions), w)).resolves.toBeUndefined();
      expect(w.asked).toEqual([STATEMENTS.databaseStart]);
    }
  });

  it("a first revision above S starts when the stored logs below it hold no event it would apply", async () => {
    const other = miscData(new TextEncoder().encode("another:name"), Uint8Array.of(1));
    const rejected = miscData(EVENT_NAME, Uint8Array.of(1, 2, 3));
    await expect(startDb(context(revision(11n)), handle(10n))).resolves.toBeUndefined();
    await expect(startDb(context(revision(11n)), handle(10n, { logs: [log(10n, other), log(10n, rejected, 0, 1)] }))).resolves.toBeUndefined();
    // An event at its own start or above is one it applies itself.
    await expect(startDb(context(revision(11n)), handle(10n, { logs: [log(11n, accepted)], unresolved: [11n] }))).resolves.toBeUndefined();
  });

  it("refuses a first revision above S over an earlier event, an unresolved site, or heights with no stored logs", async () => {
    await expect(startDb(context(revision(11n)), handle(10n, { logs: [log(10n, accepted, 2, 1)] }))).rejects.toMatchObject(
      refusal(/^the stored log 1 of transaction 2 at height 10 is a MIP-0018 event the module did not apply$/),
    );
    await expect(startDb(context(revision(11n)), handle(10n, { unresolved: [10n] }))).rejects.toMatchObject(refusal(/^height 10 has a log site/));
    await expect(startDb(context(revision(11n)), handle(10n, { providers: [] }))).rejects.toMatchObject(refusal(/^the database stored no contract logs at height 10 /));
    await expect(startDb(context(revision(11n)), handle(10n, { providers: [{ start: 11n, stop: null }] }))).rejects.toMatchObject(
      refusal(/^the database stored no contract logs at height 10 /),
    );
    // The same log under a tag this build does not know: `[v2]` written as `[v9]`.
    const retagged = Uint8Array.from(accepted);
    retagged[Buffer.from(accepted).indexOf("[v2]") + 2] = 0x39;
    const unreadable = log(10n, retagged);
    await expect(startDb(context(revision(11n)), handle(10n, { logs: [unreadable] }))).rejects.toMatchObject(refusal(/is in a serialization this build cannot read$/));
  });

  it("reads the stored logs a page at a time, in chain order, and no further than the first event it would have applied", async () => {
    const rejected = miscData(EVENT_NAME, Uint8Array.of(1, 2, 3));
    const logs = [log(3n, rejected), log(3n, rejected, 0, 1), log(4n, accepted), log(5n, accepted), log(6n, accepted)];
    const w = handle(0n, { logs });
    const seen: bigint[] = [];
    for await (const stored of earlierNamedLogs(w, 6n, EVENT_NAME, 2)) seen.push(stored.height);
    expect(seen).toEqual([3n, 3n, 4n, 5n]);
    expect(w.asked.length).toBe(3);
    // The refusal names the first one, and the read stops there: one page asked.
    const again = handle(0n, { logs });
    await expect(startDb(context(revision(6n)), again)).rejects.toMatchObject({ why: expect.stringMatching(/at height 4 is a MIP-0018 event/) });
    expect(again.asked.filter((sql) => sql === STATEMENTS.earlierNamedLogs).length).toBe(1);
  });

  it("once its first block has committed, a later start reads no stored log again", async () => {
    const w = handle(10n, { cursor: 11n, logs: [log(10n, accepted)] });
    await expect(startDb(context(revision(11n)), w)).resolves.toBeUndefined();
    expect(w.asked).not.toContain(STATEMENTS.providerRevisions);
    await expect(startDb(context(revision(11n)), handle(10n, { cursor: 10n, logs: [log(10n, accepted)] }))).rejects.toMatchObject(refusal(/did not apply$/));
  });

  it("refuses revisions with a gap between them, and accepts ones that follow each other or overlap", async () => {
    const stopped = (start: bigint, stop: bigint) => ({ start, stop, version: "0.1.0", settings: {} });
    await expect(startDb(context(stopped(10n, 19n), revision(20n)), handle(10n))).resolves.toBeUndefined();
    await expect(startDb(context(stopped(10n, 30n), revision(20n)), handle(10n))).resolves.toBeUndefined();
    await expect(startDb(context(revision(10n), revision(20n)), handle(10n))).resolves.toBeUndefined();
    await expect(startDb(context(stopped(10n, 18n), revision(20n)), handle(10n))).rejects.toMatchObject({
      code: "token-metadata-revision-gap",
      stop: 18n,
      nextStart: 20n,
    });
    await expect(startDb(context(revision(10n), stopped(20n, 25n), revision(40n)), handle(null))).rejects.toMatchObject({
      code: "token-metadata-revision-gap",
      stop: 25n,
      nextStart: 40n,
    });
  });

  it("accepts before the database has an identity, and with no revision", async () => {
    await expect(startDb(context(revision(11n)), handle(null))).resolves.toBeUndefined();
    await expect(startDb(context(), handle(10n))).resolves.toBeUndefined();
  });
});

describe("firstUncovered", () => {
  const r = (start: bigint, stop: bigint | null = null) => ({ start, stop });
  it("gives the first height of a range no revision covers, or undefined when all are", () => {
    expect(firstUncovered([r(0n)], 0n, 99n)).toBeUndefined();
    expect(firstUncovered([r(0n, 49n), r(50n)], 0n, 99n)).toBeUndefined();
    expect(firstUncovered([r(0n, 60n), r(50n)], 0n, 99n)).toBeUndefined();
    expect(firstUncovered([], 5n, 9n)).toBe(5n);
    expect(firstUncovered([r(7n)], 5n, 9n)).toBe(5n);
    expect(firstUncovered([r(0n, 6n)], 5n, 9n)).toBe(7n);
    expect(firstUncovered([r(0n, 6n), r(8n)], 5n, 9n)).toBe(7n);
    expect(firstUncovered([r(0n, 3n), r(5n, 9n)], 5n, 9n)).toBeUndefined();
    expect(firstUncovered([r(0n)], 5n, 4n)).toBeUndefined();
  });
});
