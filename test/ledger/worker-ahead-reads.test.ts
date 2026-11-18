import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CommittedHeight, Database } from "../../src/db/api.js";
import { spareRead } from "../../src/db/spare-read.js";
import type { StoredNode } from "../../src/ledger/types.js";
import type { AppliedState } from "../../src/ledger/worker/engine.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import type { NodeReader } from "../../src/ledger/worker/node-bridge.js";
import { settlesWithin } from "../db/backends.js";
import { type PgliteTestServer, startPgliteServer } from "../db/pglite-server.js";
import { type PostgresTestServer, startPostgresServer } from "../db/postgres-server.js";
import { hex } from "./adapter-fixtures.js";
import { applyBlock, at, atBlockTwo, type Chain, chain, closeHosts, LONG, mapReader, serialThree, started } from "./ahead-reads.js";
// The reads that answer the node requests of a block applied ahead (`src/ledger/worker/host.ts`), over the real worker
// thread and the real v9 package. The chain: block 0 (a blank genesis), block 1 (a contract's deploy and a zswap
// output), block 2 (empty) and block 3 (a call of that contract and a zswap output). A worker thread that loaded the
// state after block 1 from the node store and applied block 2 applies block 3 marked ahead, with no read of its own:
// the nodes it needs of the state after block 1 are stored, and it reads them through the main thread.
// - It is answered through a read lent while it runs, a read of the database opened for it, or the read of another
//   request in flight that sees block 1 (the block before its parent) or a later one; never through an older read of
//   another request in flight, in which a node written since is missing.
// - Taking a lent read back waits for the statement in flight through it.
// - On PGlite and on PostgreSQL with one pooled reader, a read that holds the queue or the reader while its own request
//   waits in the worker behind the apply ahead does not stop it: a read that sees block 1 answers the node requests
//   itself; an older one is passed over, and the database's read does not wait for the pooled reader it holds.

afterAll(() => closeHosts());

describe("the reads that answer the node requests of a block applied ahead", () => {
  it("answers them through the database's read, never through the older read of another request in flight, in which a node written since is missing", { timeout: LONG }, async () => {
    const made = await chain();
    const serial = await serialThree(made);
    const all = [...made.zero.nodes, ...made.one.nodes];
    const host = started();
    await atBlockTwo(host, made, mapReader(all, 1n));
    const database = mapReader(all, 1n);
    host.useDatabase({ read: (body) => body(database) });
    // A read opened at block 0, held open since: it holds none of the nodes block 1 wrote. Its request, a retained
    // state's load, is sent right behind the apply ahead and waits in the worker for it.
    const old = mapReader(made.zero.nodes, 0n);
    const applying = host.apply({ ...applyBlock(3n, 2), ahead: true });
    const retaining = host.retained({ ledger: "v9", ...at(0n), stateKey: made.zero.stateKey }, old);
    const three = await applying;
    // The whole result of an apply at the block's turn through a read that sees block 1.
    expect(three).toEqual(serial);
    // It read stored nodes, each through the database's read; the older read was asked for the retained state only.
    expect(database.queries.length).toBeGreaterThan(0);
    await retaining;
    expect(database.queries.flat().some((key) => made.written.has(key))).toBe(true);
    expect(old.queries.length).toBeGreaterThan(0);
    expect(old.queries.flat().filter((key) => made.written.has(key))).toEqual([]);
    expect(host.restarts).toBe(0);
    expect(host.failure).toBeNull();
  });

  it("answers them through the read of another request in flight that sees the block before the parent, or a later one, and through no read that reports no height", { timeout: LONG }, async () => {
    const made = await chain();
    const serial = await serialThree(made);
    const all = [...made.zero.nodes, ...made.one.nodes];
    for (const height of [1n, 2n]) {
      const host = started();
      await atBlockTwo(host, made, mapReader(all, 1n));
      // No database read begins: only the other request's read can answer.
      host.useDatabase({ read: () => new Promise(() => undefined) });
      const theirs = mapReader(all, height);
      const applying = host.apply({ ...applyBlock(3n, 2), ahead: true });
      const retaining = host.retained({ ledger: "v9", ...at(0n), stateKey: made.zero.stateKey }, theirs);
      expect(await applying, `a read at ${height}`).toEqual(serial);
      await retaining;
      expect(theirs.queries.length).toBeGreaterThan(1);
    }
    // A read that reports no height (null before any block committed; a handle that has none) is passed over: the
    // apply ahead waits for the database's read, here one that begins once the test lets it.
    for (const height of [null, undefined]) {
      const host = started();
      await atBlockTwo(host, made, mapReader(all, 1n));
      const database = mapReader(all, 1n);
      let begin = (): void => undefined;
      const begun = new Promise<void>((resolve) => (begin = resolve));
      host.useDatabase({ read: async (body) => (await begun, body(database)) });
      const theirs: Omit<ReturnType<typeof mapReader>, "height"> & { height?: bigint | null } = mapReader(all, null);
      if (height === undefined) delete theirs.height;
      const applying = host.apply({ ...applyBlock(3n, 2), ahead: true });
      const retaining = host.retained({ ledger: "v9", ...at(0n), stateKey: made.zero.stateKey }, theirs);
      expect(await settlesWithin(applying, 500)).toBe(false);
      expect(theirs.queries).toEqual([]);
      begin();
      expect(await applying).toEqual(serial);
      await retaining;
    }
  });

  it("takes a read that is lent, or that a request brings, while it waits for the database's read, when that read sees the block before the parent; an older read a request brings is passed over", { timeout: LONG }, async () => {
    const made = await chain();
    const serial = await serialThree(made);
    const all = [...made.zero.nodes, ...made.one.nodes];
    const waitingHost = async (): Promise<{ host: LedgerHost; applying: Promise<AppliedState> }> => {
      const host = started();
      await atBlockTwo(host, made, mapReader(all, 1n));
      host.useDatabase({ read: () => new Promise(() => undefined) });
      const applying = host.apply({ ...applyBlock(3n, 2), ahead: true });
      // In the worker, waiting for a stored node, which no read answers yet.
      expect(await settlesWithin(applying, 500)).toBe(false);
      return { host, applying };
    };
    // A read lent (the block transaction's handle, which reports no height): taken.
    const first = await waitingHost();
    const lent = mapReader(all, null);
    const takeBack = first.host.lend(lent);
    expect(await first.applying).toEqual(serial);
    expect(lent.queries.length).toBeGreaterThan(0);
    await takeBack();
    // An older read a request brings: passed over; then one that sees block 1: taken.
    const second = await waitingHost();
    const old = mapReader(made.zero.nodes, 0n);
    const retaining = second.host.retained({ ledger: "v9", ...at(0n), stateKey: made.zero.stateKey }, old);
    expect(await settlesWithin(second.applying, 500)).toBe(false);
    expect(old.queries).toEqual([]);
    const current = mapReader(all, 1n);
    const again = second.host.retained({ ledger: "v9", ...at(1n), stateKey: made.one.stateKey }, current);
    expect(await second.applying).toEqual(serial);
    await Promise.all([retaining, again]);
    expect(current.queries.length).toBeGreaterThan(0);
  });

  it("takes a lent read back only once the statement in flight through it has answered", { timeout: LONG }, async () => {
    const made = await chain();
    const serial = await serialThree(made);
    const all = [...made.zero.nodes, ...made.one.nodes];
    const host = started();
    await atBlockTwo(host, made, mapReader(all, 1n));
    host.useDatabase({ read: () => new Promise(() => undefined) });
    // A lent read whose first statement answers only when the test lets it.
    const inner = mapReader(all, null);
    let asked = 0;
    let closed = false;
    const afterClose: string[] = [];
    let release = (): void => undefined;
    const held = new Promise<void>((resolve) => (release = resolve));
    const lent: NodeReader = {
      async query(sql, params) {
        asked += 1;
        if (asked === 1) await held;
        if (closed) afterClose.push(sql);
        return inner.query(sql, params);
      },
    };
    const takeBack = host.lend(lent);
    const applying = host.apply({ ...applyBlock(3n, 2), ahead: true });
    await expect.poll(() => asked, { timeout: 30_000, interval: 5 }).toBe(1);
    // The statement is in flight: the read is not given back while it is.
    const taking = takeBack();
    expect(await settlesWithin(taking, 500)).toBe(false);
    release();
    await taking;
    // The caller's read ends here. The node request in flight was answered through it before; none runs on it after.
    closed = true;
    const later = mapReader(all, 1n);
    const lendAgain = host.lend(later);
    expect(await applying).toEqual(serial);
    await lendAgain();
    expect(afterClose).toEqual([]);
  });
});

/** The statements that make the node table and a cursor table, and the cursor's read. */
const SCHEMA = `
  CREATE SCHEMA core_ledger_state;
  CREATE TABLE core_ledger_state.nodes (node_key bytea PRIMARY KEY, data bytea NOT NULL, children bytea NOT NULL);
  CREATE SCHEMA t;
  CREATE TABLE t.blocks (height bigint PRIMARY KEY);
`;
const CURSOR: CommittedHeight = async (read) => {
  const [row] = await read.query("SELECT max(height) AS height FROM t.blocks");
  return (row?.height ?? null) as bigint | null;
};
/** The statements that store `nodes` and commit block `height`. */
const blockSql = (height: bigint, nodes: readonly StoredNode[]): string =>
  `INSERT INTO core_ledger_state.nodes VALUES ${nodes.map((node) => `('\\x${hex(node.key)}', '\\x${hex(node.data)}', '\\x${hex(node.children)}')`).join(",\n")} ON CONFLICT DO NOTHING;
   INSERT INTO t.blocks VALUES (${height});`;

/**
 * On `db`, which holds blocks 0 and 1: a read that sees block 1 is held open while its own request, a retained state's
 * load, waits in the worker behind block 3's apply ahead, which needs stored nodes. The read answers them.
 */
async function heldByACurrentRead(db: Database, made: Chain, serial: AppliedState): Promise<void> {
  const host = started();
  host.useDatabase({ read: spareRead(db) });
  await db.read((read) => atBlockTwo(host, made, read));
  const answered = db.read(async (read) => {
    expect(read.height).toBe(1n);
    const applying = host.apply({ ...applyBlock(3n, 2), ahead: true });
    const retained = await host.retained({ ledger: "v9", ...at(1n), stateKey: made.one.stateKey }, read);
    expect(hex(retained.stateRoot)).toBe(hex(made.one.stateRoot));
    return applying;
  });
  expect(await settlesWithin(answered, 60_000)).toBe(true);
  expect(await answered).toEqual(serial);
  expect(host.restarts).toBe(0);
}

describe("a read held open while its request waits behind a block applied ahead, on PGlite 0.5.10 (one queue)", () => {
  let server: PgliteTestServer;
  beforeAll(async () => {
    server = await startPgliteServer();
  }, 180_000);
  afterAll(() => server?.stop(), 60_000);

  it("answers the apply ahead's node requests itself, since it sees the block before the parent: nothing waits for the queue it holds", { timeout: LONG }, async () => {
    const made = await chain();
    const serial = await serialThree(made);
    const database = await server.createDatabase();
    await database.exec(SCHEMA);
    await database.exec(blockSql(0n, made.zero.nodes));
    await database.exec(blockSql(1n, made.one.nodes));
    const db = await database.open({ committedHeight: CURSOR });
    try {
      await heldByACurrentRead(db, made, serial);
    } finally {
      await db.close();
    }
  });
});

describe("a read held open while its request waits behind a block applied ahead, on PostgreSQL 18 with one pooled reader", () => {
  let server: PostgresTestServer;
  beforeAll(async () => {
    server = await startPostgresServer();
  }, 180_000);
  afterAll(() => server?.stop(), 60_000);

  it("answers the apply ahead's node requests itself when it sees the block before the parent", { timeout: LONG }, async () => {
    const made = await chain();
    const serial = await serialThree(made);
    const database = await server.createDatabase();
    await database.exec(SCHEMA);
    await database.exec(blockSql(0n, made.zero.nodes));
    await database.exec(blockSql(1n, made.one.nodes));
    const db = database.open({ committedHeight: CURSOR, readConnections: 1 });
    try {
      await heldByACurrentRead(db, made, serial);
    } finally {
      await db.close();
    }
  });

  it("is passed over when it is older, opened before the parent's parent was written: the apply ahead reads through the database's read, which does not wait for the pooled reader that read holds", { timeout: LONG }, async () => {
    const made = await chain();
    const serial = await serialThree(made);
    const all = [...made.zero.nodes, ...made.one.nodes];
    const database = await server.createDatabase();
    await database.exec(SCHEMA);
    await database.exec(blockSql(0n, made.zero.nodes));
    const db = database.open({ committedHeight: CURSOR, readConnections: 1 });
    try {
      const host = started();
      host.useDatabase({ read: spareRead(db) });
      const answered = db.read(async (old) => {
        // The one pooled reader, at block 0. Block 1 is written and committed while it stays open.
        expect(old.height).toBe(0n);
        const stored = async (): Promise<number> => Number((await old.query("SELECT count(*) AS n FROM core_ledger_state.nodes"))[0]?.n);
        expect(await stored()).toBe(made.zero.nodes.length);
        await database.exec(blockSql(1n, made.one.nodes));
        expect(await stored()).toBe(made.zero.nodes.length);
        await atBlockTwo(host, made, mapReader(all, 1n));
        const applying = host.apply({ ...applyBlock(3n, 2), ahead: true });
        const retaining = host.retained({ ledger: "v9", ...at(0n), stateKey: made.zero.stateKey }, old);
        // Not stopped by the reader this read holds, and not answered through it.
        expect(await settlesWithin(applying, 60_000)).toBe(true);
        await retaining;
        return applying;
      });
      expect(await answered).toEqual(serial);
      expect(host.restarts).toBe(0);
      expect(host.failure).toBeNull();
    } finally {
      await db.close();
    }
  });
});
