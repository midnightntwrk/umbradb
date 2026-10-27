import { createServer } from "node:http";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { WebSocketServer } from "ws";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import type { ReadHandle } from "../../src/db/api.js";
import { startCoreTransport } from "../../src/private/core-transport.js";
import { decodeValue, hexOf, type JsonValue, type Message, messageText, type ReadResult } from "../../src/private/messages.js";
import { PrivateTransport } from "../../src/private/private-transport.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { genesisHex, launchPublicCore, type PublicCore, startPublicCore } from "./builds.js";
import { endedWithin, hello, rawClient, type RawClient } from "./raw-client.js";

/**
 * A115 `[CI]` through a running core (tasks 14.2, 14.2a; PP-4, `design.md` §8), on PostgreSQL 18.6 and PGlite 0.5.10:
 * the core process listens on its `listen.transport` (`127.0.0.1:0`) and a raw client (`./raw-client.ts`) speaks to it
 * — `hello` is answered with `hello-ack` (the genesis, S, the public cursor, the lockstep flag), every commit is
 * announced with `committed`, a `read-result` carries its request's `id`, the height read (`null` on an empty public
 * database) and, per statement, the columns' names and types with the rows, a `bigint`, `numeric`, `bytea` and `jsonb`
 * value each decoding back to the value the core read; an unknown `v` or `type` — an `api` or `api-result` message among
 * them (owner decision Q140 C: the protocol has neither) —, a message failing its schema, and the other faults close
 * the connection; a second `hello` with a connected id is refused with `duplicate-instance`. With the committed negative
 * controls: a decoder that drops a `bigint`'s precision or a `bytea`'s bytes, a core that accepts a second `hello` of a
 * connected id, and a transport that still answers `api` (task 14.2's) each fail their oracle.
 */

/** The core's `listen.transport`: a free port of the loopback interface. */
const TRANSPORT = { listen: { transport: "127.0.0.1:0" } };

/** A statement whose columns are of the four types A115 names, and two more. */
const TYPED_SQL =
  "SELECT 9223372036854775807::bigint AS b, 12345678901234567890.123456789::numeric AS n, '\\x00ff10'::bytea AS y, " +
  `'{"big": 123456789012345678901, "s": "x", "l": [1, null], "neg": -9007199254740993}'::jsonb AS j, ` +
  "ARRAY[1, 2]::bigint[] AS a, NULL::text AS z, 'x'::text AS t";

/** The rows of a `read-result`'s statement, read back with `decode`. */
function rowsOf(result: NonNullable<ReadResult["results"]>[number], decode: typeof decodeValue): Record<string, unknown>[] {
  return result.rows.map((row) =>
    Object.fromEntries(result.columns.map((column, index) => [column.name, decode(column.type, (row[index] ?? null) as JsonValue)])),
  );
}

/**
 * A115's oracle for a `read-result`'s values: every problem with `answer` (the core's answer to a `read` of
 * {@link TYPED_SQL}) read back with `decode`, against `direct`, what the core reads itself. None when A115 holds.
 */
export function valueProblems(answer: Message, direct: readonly Record<string, unknown>[], decode: typeof decodeValue): string[] {
  if (answer.type !== "read-result" || answer.results === undefined) return [`the answer is no read-result with results: ${answer.type}`];
  const [result] = answer.results;
  if (result === undefined) return ["the read-result has no result"];
  const problems: string[] = [];
  const types = result.columns.map((column) => `${column.name} ${column.type}`);
  const wanted = ["b bigint", "n numeric", "y bytea", "j jsonb", "a bigint[]", "z text", "t text"];
  if (types.join(",") !== wanted.join(",")) problems.push(`its columns are ${types.join(",")}, not ${wanted.join(",")}`);
  const decoded = rowsOf(result, decode);
  for (const name of ["b", "n", "y", "j", "a", "z", "t"]) {
    const got = decoded[0]?.[name];
    const want = direct[0]?.[name];
    if (!deepEqual(got, want)) problems.push(`${name} reads back as ${show(got)}, where the core read ${show(want)}`);
  }
  return problems;
}

/** Deep equality of values the database API gives (bigints, bytes, JSON). */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a instanceof Uint8Array && b instanceof Uint8Array) return Buffer.from(a).equals(Buffer.from(b));
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((item, i) => deepEqual(item, b[i]));
  if (typeof a === "object" && a !== null && b !== null && !Array.isArray(a) && !Array.isArray(b)) {
    const keys = Object.keys(a as object);
    return (
      keys.length === Object.keys(b as object).length &&
      keys.every((key) => deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
    );
  }
  return a === b;
}

const show = (value: unknown): string =>
  value instanceof Uint8Array ? hexOf(value) : JSON.stringify(value, (_k, v) => (typeof v === "bigint" ? `${v}n` : v));

/** A lossy decoder (a negative control's): a `bigint` read as a JavaScript number, a `bytea` as no bytes. */
const lossyDecode: typeof decodeValue = (type, found) => {
  if (type === "bigint" && typeof found === "string") return Number(found);
  if (type === "bytea") return new Uint8Array(0);
  return decodeValue(type, found);
};

/** A client that said `hello` as `instance` and got its `hello-ack`. */
async function greeted(address: string, instance: string): Promise<{ client: RawClient; ack: Extract<Message, { type: "hello-ack" }> }> {
  const client = rawClient(`ws://${address}/`);
  await client.opened;
  client.send(hello(instance));
  return { client, ack: await client.next("hello-ack") };
}

/**
 * The oracle of PP-4's duplicate rule against the transport at `address`: every problem, none when a second `hello` of
 * a connected id is refused with `duplicate-instance`, its connection closed, the first one kept, and the id accepted
 * again once the first closed.
 */
export async function duplicateProblems(address: string): Promise<string[]> {
  const problems: string[] = [];
  const first = await greeted(address, "dup-1");
  if (first.ack.refused !== null) problems.push(`the first hello was refused: ${first.ack.refused}`);
  const second = await greeted(address, "dup-1");
  if (second.ack.refused !== "duplicate-instance") problems.push(`the second hello got refused ${second.ack.refused}`);
  const end = await endedWithin(second.client, 10_000).catch(() => null);
  if (end === null) problems.push("the second connection stayed open");
  // The first is still served.
  first.client.send({ v: 1, type: "read", id: "still", statements: [] });
  const answer = await first.client.next("read-result", 10_000).catch(() => null);
  if (answer?.id !== "still") problems.push("the first connection was no longer answered");
  first.client.close();
  await endedWithin(first.client, 10_000);
  // The core sees the close; then the id is free.
  let again: Awaited<ReturnType<typeof greeted>> | undefined;
  for (let attempt = 0; attempt < 50; attempt++) {
    again = await greeted(address, "dup-1");
    if (again.ack.refused === null) break;
    await sleep(100);
  }
  if (again?.ack.refused !== null) problems.push("the id was not accepted again once its connection closed");
  again?.client.close();
  // A second hello on one connection is refused as well.
  const twice = await greeted(address, "dup-2");
  twice.client.send(hello("dup-2"));
  const repeated = await twice.client.next("hello-ack", 10_000).catch(() => null);
  if (repeated?.refused !== "duplicate-instance") problems.push(`a hello sent twice on one connection got ${repeated?.refused}`);
  twice.client.close();
  return problems;
}

/** An `api` message as task 14.2's protocol had it (owner decision Q140 C removed the type). */
const API_TEXT = '{"v":1,"type":"api","id":"a-1","module":"stats","method":"totals","params":{"from":"1"}}';

/**
 * A115's oracle for an `api` message (Q140 C: an unknown `type`) against the transport at `address`: every problem, none
 * when a greeted connection that sends one is closed (1008, `unknown-type`) without an answer, and the core keeps
 * serving others.
 */
export async function apiProblems(address: string): Promise<string[]> {
  const problems: string[] = [];
  const { client } = await greeted(address, "api-caller");
  client.send(API_TEXT);
  const end = await endedWithin(client, 10_000).catch(() => null);
  if (end === null) problems.push("the connection stayed open after an api message");
  else if (end.code !== 1008 || end.reason !== "unknown-type") problems.push(`it closed with ${end.code} ${end.reason}`);
  // A text this build cannot parse (an `api-result`, say) is kept as it came: its type read from its JSON.
  const typeOf = (message: Message | string): string =>
    typeof message === "string" ? String((JSON.parse(message) as { type?: unknown }).type) : message.type;
  const answered = client.received.map(typeOf).filter((type) => type !== "hello-ack");
  if (answered.length > 0) problems.push(`the api message was answered: ${answered.join(", ")}`);
  if (end === null) client.close();
  const other = await greeted(address, "after-api");
  if (other.ack.refused !== null) problems.push(`the next connection was refused: ${other.ack.refused}`);
  other.client.close();
  return problems;
}

describe.each(PRIVATE_BACKENDS)("A115: the core's process transport on $name", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  let core: PublicCore;
  let address: string;
  beforeAll(async () => {
    const db = await backend.database("public");
    core = await startPublicCore({ database: db.setting, head: 3n, extra: { ...TRANSPORT, lockstepInstances: ["listed"] } });
    address = core.transport();
  }, START_TIMEOUT_MS);
  afterAll(() => core?.stop(), START_TIMEOUT_MS);

  it("hello is answered with hello-ack: the lockstep flag, the genesis, S and the public cursor", async () => {
    const { client, ack } = await greeted(address, "instance-a");
    expect(ack).toEqual({ v: 1, type: "hello-ack", lockstep: false, genesis: genesisHex(0xa1), start: "1", cursor: "3", refused: null });
    const listed = await greeted(address, "listed");
    expect(listed.ack.lockstep).toBe(true);
    client.close();
    listed.client.close();
  }, TEST_TIMEOUT_MS);

  it("every public commit is announced with committed, its height and hash", async () => {
    const { client } = await greeted(address, "instance-c");
    const from = core.handle.status().cursor as bigint;
    await core.advance(from + 3n);
    for (let height = from + 1n; height <= from + 3n; height++) {
      expect(await client.next("committed")).toEqual({ v: 1, type: "committed", height: `${height}`, hash: hexOf(inMemoryBlock(height).hash) });
    }
    client.close();
  }, TEST_TIMEOUT_MS);

  it("a read-result carries its id, the height read and per statement the columns' names and types with the rows", async () => {
    const { client } = await greeted(address, "instance-r");
    client.send({
      v: 1,
      type: "read",
      id: "7",
      statements: [
        { sql: TYPED_SQL, params: [] },
        { sql: "SELECT height, hash FROM core_block_commit.blocks WHERE height <= $1 ORDER BY height", params: ["2"] },
        { sql: "SELECT $1::bytea AS echoed, $2::bigint AS n, $3::jsonb AS j", params: [hexOf(new Uint8Array([1, 2])), "-5", { k: [1] }] },
        // Types the mapping does not name: their names from the catalog, in the same read; their values as text.
        { sql: "SELECT '127.0.0.1'::inet AS i, ARRAY['10.0.0.1'::inet] AS ia", params: [] },
      ],
    });
    const answer = await client.next("read-result");
    const cursor = core.handle.status().cursor as bigint;
    expect(answer.id).toBe("7");
    expect(BigInt(answer.height as string)).toBeGreaterThanOrEqual(3n);
    expect(BigInt(answer.height as string)).toBeLessThanOrEqual(cursor);
    expect(answer.results?.slice(0, 3).map((result) => result.columns)).toEqual([
      [
        { name: "b", type: "bigint" },
        { name: "n", type: "numeric" },
        { name: "y", type: "bytea" },
        { name: "j", type: "jsonb" },
        { name: "a", type: "bigint[]" },
        { name: "z", type: "text" },
        { name: "t", type: "text" },
      ],
      [
        { name: "height", type: "bigint" },
        { name: "hash", type: "bytea" },
      ],
      [
        { name: "echoed", type: "bytea" },
        { name: "n", type: "bigint" },
        { name: "j", type: "jsonb" },
      ],
    ]);
    expect(answer.results?.[1]?.rows).toEqual([
      ["1", hexOf(inMemoryBlock(1n).hash)],
      ["2", hexOf(inMemoryBlock(2n).hash)],
    ]);
    // Parameters: bytes as 0x hex, a bigint as decimal text, JSON as JSON.
    expect(answer.results?.[2]?.rows).toEqual([["0x0102", "-5", { k: [1] }]]);
    expect(answer.results?.[3]).toEqual({
      columns: [
        { name: "i", type: "inet" },
        { name: "ia", type: "inet[]" },
      ],
      rows: [["127.0.0.1", "{10.0.0.1}"]],
    });
    // A bigint, numeric, bytea and jsonb value each read back as the value the core read.
    const direct = await core.db().read((read) => read.query(TYPED_SQL));
    expect(valueProblems(answer, direct, decodeValue)).toEqual([]);
    client.close();
  }, TEST_TIMEOUT_MS);

  it("negative control (committed): a decoder that drops a bigint's precision or a bytea's bytes fails the oracle", async () => {
    const { client } = await greeted(address, "instance-n");
    client.send({ v: 1, type: "read", id: "n", statements: [{ sql: TYPED_SQL, params: [] }] });
    const answer = await client.next("read-result");
    const direct = await core.db().read((read) => read.query(TYPED_SQL));
    const problems = valueProblems(answer, direct, lossyDecode);
    expect(problems).toEqual([
      expect.stringMatching(/^b reads back as 9223372036854776000, where the core read "9223372036854775807n"$/),
      expect.stringMatching(/^y reads back as 0x, where the core read 0x00ff10$/),
    ]);
    client.close();
  }, TEST_TIMEOUT_MS);

  it("a private process's own client reads through the core: each value as the core reads it, the handle at its height", async () => {
    const transport = new PrivateTransport({
      address,
      instance: "instance-p",
      version: UMBRADB_VERSION,
      position: () => ({ height: 0n, hash: null }),
      backoffCeilingMs: 1_000,
      log: () => undefined,
    });
    try {
      const seen = await transport.read(async (read: ReadHandle) => ({ height: read.height, rows: await read.query(TYPED_SQL) }));
      const direct = await core.db().read((read) => read.query(TYPED_SQL));
      expect(seen.rows).toEqual(direct);
      // Parameters as the database API takes them: bytes, a bigint beyond a double's exact range, JSON.
      const params = [new Uint8Array([0, 0xff]), 9223372036854775807n, { k: [1n] }];
      const echo = "SELECT $1::bytea AS b, $2::bigint AS n, $3::jsonb AS j";
      expect(await transport.read((read) => read.query(echo, params))).toEqual(await core.db().read((read) => read.query(echo, params)));
      expect(seen.height).toBeGreaterThanOrEqual(3n);
      // A statement the core cannot run fails with its code, never its message.
      await expect(transport.read((read) => read.query("SELECT * FROM no_such_table"))).rejects.toMatchObject({ code: "database-error" });
    } finally {
      await transport.close();
    }
  }, TEST_TIMEOUT_MS);

  it("an api message is an unknown type: it closes the connection unanswered (owner decision Q140 C)", async () => {
    expect(await apiProblems(address)).toEqual([]);
  }, TEST_TIMEOUT_MS);

  it.each([
    ["an unknown v", '{"v":2,"type":"hello","instance":"x","version":"v","height":"0","hash":null}', "unknown-version", true],
    ["an unknown type", '{"v":1,"type":"goodbye"}', "unknown-type", true],
    ["an api message (no such type: Q140)", API_TEXT, "unknown-type", true],
    ["an api-result message (no such type: Q140)", '{"v":1,"type":"api-result","id":"a-1","error":"not-found"}', "unknown-type", true],
    ["a message failing its schema", '{"v":1,"type":"read","id":"1","statements":[{"sql":"SELECT 1"}]}', "invalid-message", true],
    ["a mistyped field", '{"v":1,"type":"report","height":42,"hash":null}', "invalid-message", true],
    ["a text that is no JSON", "hello?", "not-json", true],
    ["a message before hello", '{"v":1,"type":"read","id":"1","statements":[]}', "hello-first", false],
    ["a message only the core sends", '{"v":1,"type":"committed","height":"1","hash":"0x' + "00".repeat(32) + '"}', "wrong-direction committed", true],
  ])("%s closes the connection (1008), and the core keeps serving others", async (name, text, reason, afterHello) => {
    const client = rawClient(`ws://${address}/`);
    await client.opened;
    // An id of its own per case: several cases close for one reason.
    if (afterHello) {
      client.send(hello(`fault-${name}`));
      await client.next("hello-ack");
    }
    client.send(text);
    const end = await endedWithin(client);
    expect(end).toMatchObject({ opened: true, code: 1008, reason });
    const other = await greeted(address, `after-${name}`);
    expect(other.ack.refused).toBeNull();
    other.client.close();
  }, TEST_TIMEOUT_MS);

  it("a binary frame closes the connection", async () => {
    const { client } = await greeted(address, "instance-bin");
    client.sendBinary(new Uint8Array([1, 2, 3]));
    expect(await endedWithin(client)).toMatchObject({ code: 1008, reason: "binary-frame" });
  }, TEST_TIMEOUT_MS);

  it("a second hello with a connected id is refused with duplicate-instance, the first connection kept", async () => {
    expect(await duplicateProblems(address)).toEqual([]);
  }, TEST_TIMEOUT_MS);

  it("negative control (committed): a core that accepts a second hello of a connected id fails the oracle", async () => {
    const db = core.db();
    const control = await startCoreTransport({
      address: "127.0.0.1:0",
      db,
      genesis: new Uint8Array(32),
      start: 1n,
      cursor: () => null,
      lockstepInstances: [],
      readTimeoutMs: 30_000,
      log: () => undefined,
      duplicates: "accept",
    });
    try {
      const problems = await duplicateProblems(`127.0.0.1:${control.port}`);
      expect(problems).toContain("the second hello got refused null");
      expect(problems).toContain("a hello sent twice on one connection got null");
    } finally {
      await control.close();
    }
  }, TEST_TIMEOUT_MS);
});

describe("A115 negative control (committed): a transport that still answers api fails the oracle", () => {
  it("task 14.2's answer to an api message (api-result not-found, the connection kept) is seen", async () => {
    // A stand-in of task 14.2's core: hello answered, every api answered not-found with its id, the connection kept.
    const server = createServer();
    const wss = new WebSocketServer({ server });
    wss.on("connection", (socket) => {
      socket.on("message", (data) => {
        const message = JSON.parse(data.toString()) as { type: string; id?: string };
        if (message.type === "hello") {
          socket.send(messageText({ v: 1, type: "hello-ack", lockstep: false, genesis: genesisHex(0xa1), start: "1", cursor: null, refused: null }));
        } else if (message.type === "api") {
          socket.send(JSON.stringify({ v: 1, type: "api-result", id: message.id, error: "not-found" }));
        }
      });
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as { port: number };
    try {
      const problems = await apiProblems(`127.0.0.1:${port}`);
      expect(problems).toContain("the connection stayed open after an api message");
      expect(problems).toContain("the api message was answered: api-result");
    } finally {
      for (const client of wss.clients) client.terminate();
      await new Promise<void>((resolve) => wss.close(() => resolve()));
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});

describe.each(PRIVATE_BACKENDS)("A115: a read of an empty public database on $name", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("before the first commit a read-result's height is null, and hello-ack's cursor null", async () => {
    const db = await backend.database("public");
    // S is 5 and the node's head 2: the core waits for the node (IN-2) with nothing committed, its transport listening.
    const core = launchPublicCore({ database: db.setting, head: 2n, start: 5, extra: TRANSPORT });
    try {
      const address = await core.transportWithin(START_TIMEOUT_MS);
      const { client, ack } = await greeted(address, "early");
      expect(ack).toMatchObject({ start: "5", cursor: null, refused: null });
      client.send({ v: 1, type: "read", id: "e", statements: [{ sql: "SELECT 1::bigint AS one", params: [] }] });
      expect(await client.next("read-result")).toEqual({
        v: 1,
        type: "read-result",
        id: "e",
        height: null,
        results: [{ columns: [{ name: "one", type: "bigint" }], rows: [["1"]] }],
      });
      client.close();
    } finally {
      await core.stop();
    }
  }, TEST_TIMEOUT_MS);
});
