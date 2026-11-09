import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import type { ReadOnlyDatabase } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { Received } from "../../src/private/core-transport.js";
import type { Message } from "../../src/private/messages.js";
import { channelCarrier } from "../../src/private/private-channels.js";
import { PrivateTransport } from "../../src/private/private-transport.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { EngineInput } from "../../src/runner/process.js";
import { PRIVATE_BACKENDS, type PrivateBackend, READER_LOGIN, START_TIMEOUT_MS, type TestDatabase } from "../private/backends.js";
import { DATABASE_REFUSED, ESCAPES, PUB, publicState, stateProblems } from "../private/read-confinement-checks.js";
import { channelPair, peerHello, rawPeer, type RawPeer, until } from "./channel-fixtures.js";
import { channelCore, type Logged } from "./channel-processes.js";
import { cursorReaches } from "./library-fixtures.js";

/**
 * The link's own checks over channels, exactly as over a socket `[CI][NEG]`, on PostgreSQL 18 (Docker) and PGlite
 * 0.5.10:
 * - Over a public process's channel link, a `read` whose statement is not one read is answered `read-refused`
 *   naming it and runs nothing (the escapes; the reads the database refuses `database-error`; a plain read answered
 *   after each; the channel kept; the public database unchanged); a message failing its schema, or with an unknown `v`
 *   or `type`, closes the channel with that fault; a second `hello` with a connected id is refused
 *   `duplicate-instance`, the first kept; an instance id outside the id rule closes the channel. On a private process's
 *   channel (`privateSide: { connect }`'s carrier), a message from the core failing its schema closes the channel too.
 *   Each negative control removes the check on the channel path only (the channel link's seams: `reads: "unconfined"`,
 *   a message read without the link's schemas, `duplicates: "accept"`) and fails the same oracle.
 * - (PostgreSQL): with `publicSide: { channels: true }`, a `transportReader` login that is a superuser, holds
 *   `CREATEROLE`, is a member of the writer's login, or holds `INSERT` on a public table refuses startup
 *   `transport-reader-can-write`, as it does on the socket link. Negative control: the check skipped for channels
 *   (`readerCheck: "skip"`): the process starts, and the oracle fails.
 */

/** A message read as it is, without the link's schemas: the negative control's channel path. */
const UNCHECKED = (value: unknown): Received => ({ ok: true, message: value as Message });

/** The core's `db` item, kept by a user module for the state compared before and after (a direct read). */
function publicReads(keep: (db: ReadOnlyDatabase) => void): ModuleDeclaration {
  return {
    id: "public-reads",
    version: "1.0.0",
    side: "public",
    requires: ["db"],
    provides: [],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {
      async "on-start-api"(p) {
        keep(p.items.get("db") as ReadOnlyDatabase);
      },
    },
  } as ModuleDeclaration;
}

/** A core with `pub` and the kept `db`, its channel link's `seams`. */
async function confinedCore(db: TestDatabase, seams?: EngineInput["channelLink"]) {
  let kept: ReadOnlyDatabase | undefined;
  const core = channelCore(db, { head: 3n, modules: [PUB, publicReads((found) => (kept = found))], ...(seams === undefined ? {} : { seams }) });
  await core.handle.started;
  // The state compared is the head's: nothing commits during the escapes.
  await cursorReaches(core.handle, 3n);
  return { core, db: kept as ReadOnlyDatabase };
}

/** A raw peer on a new test-owned channel of `core`, past its `hello` as `instance`. */
async function greeted(core: Logged, instance: string): Promise<RawPeer> {
  const [coreEnd, peerEnd] = channelPair();
  core.handle.privateLink.accept(coreEnd);
  const peer = rawPeer(peerEnd);
  peer.send(peerHello(instance));
  await peer.next("hello-ack");
  return peer;
}

/** The oracle over a channel: every problem, none when the reads are confined (see the module comment). */
async function confinementProblems(core: Logged, db: ReadOnlyDatabase): Promise<string[]> {
  const problems: string[] = [];
  const before = await publicState(db);
  const peer = await greeted(core, "a172-channel");
  let id = 0;
  const read = async (statements: readonly string[]) => {
    id += 1;
    peer.send({ v: 1, type: "read", id: `${id}`, statements: statements.map((sql) => ({ sql, params: [] })) });
    for (;;) {
      const answer = (await peer.next("read-result", 60_000).catch(() => null)) as Record<string, unknown> | null;
      if (answer === null || answer.id === `${id}`) return answer;
    }
  };
  const described = (answer: Record<string, unknown> | null) =>
    answer === null ? "nothing" : answer.error === undefined ? "results" : `error ${String(answer.error)} ${JSON.stringify(answer.refused)}`;
  const stillUp = async (after: string) => {
    const plain = (await read(["SELECT count(*)::bigint AS n FROM pub.rows"])) as { results?: { rows: unknown[] }[] } | null;
    if (plain?.results?.[0]?.rows.length !== 1) problems.push(`after ${after}: the plain read was answered ${described(plain as never)}`);
  };
  for (const escape of ESCAPES) {
    const answer = await read(escape.statements);
    if (answer?.error !== "read-refused" || JSON.stringify(answer.refused) !== JSON.stringify(escape.refused) || answer.results !== undefined) {
      problems.push(`${escape.name}: answered ${described(answer)}, not read-refused ${JSON.stringify(escape.refused)}`);
    }
    await stillUp(escape.name);
  }
  for (const refusal of DATABASE_REFUSED) {
    const answer = await read([refusal.sql]);
    if (answer?.error !== "database-error") problems.push(`${refusal.name}: answered ${described(answer)}, not database-error`);
    await stillUp(refusal.name);
  }
  if (peer.end !== null) problems.push(`the channel closed (${JSON.stringify(peer.end)})`);
  problems.push(...stateProblems(before, await publicState(db)));
  return problems;
}

/** The faults that close a core's channel, each with the close it must get. */
const CLOSING_FAULTS: readonly { readonly name: string; readonly message: Readonly<Record<string, unknown>>; readonly reason: string }[] = [
  { name: "a read failing its schema (an extra field)", message: { v: 1, type: "read", id: "1", statements: [], extra: 1 }, reason: "invalid-message" },
  { name: "an unknown v", message: { v: 2, type: "read", id: "1", statements: [] }, reason: "unknown-version" },
  { name: "an unknown type (api)", message: { v: 1, type: "api", id: "1" }, reason: "unknown-type" },
];

/** The schema oracle over `core`'s channels: every problem, none when each fault closes its channel with its fault. */
async function schemaProblems(core: Logged): Promise<string[]> {
  const problems: string[] = [];
  for (const fault of CLOSING_FAULTS) {
    const peer = await greeted(core, `fault-${CLOSING_FAULTS.indexOf(fault)}`);
    peer.send(fault.message);
    const ended = await Promise.race([peer.ended, new Promise((done) => setTimeout(() => done(null), 3_000))]);
    if (JSON.stringify(ended) !== JSON.stringify({ code: 1008, reason: fault.reason })) problems.push(`${fault.name}: ended ${JSON.stringify(ended)}`);
  }
  // An instance id outside the rule (a space): its hello fails its schema.
  const [coreEnd, peerEnd] = channelPair();
  core.handle.privateLink.accept(coreEnd);
  const outside = rawPeer(peerEnd);
  outside.send(peerHello("a b"));
  const ended = await Promise.race([outside.ended, new Promise((done) => setTimeout(() => done(null), 3_000))]);
  if (JSON.stringify(ended) !== JSON.stringify({ code: 1008, reason: "invalid-message" })) problems.push(`an instance id outside the rule: ended ${JSON.stringify(ended)}`);
  if (outside.received.some((message) => message.type === "hello-ack")) problems.push("an instance id outside the rule was answered hello-ack");
  return problems;
}

/** The duplicate oracle over `core`'s channels: every problem, none when a second hello of a connected id is refused. */
async function duplicateProblems(core: Logged): Promise<string[]> {
  const problems: string[] = [];
  const first = await greeted(core, "twice");
  const [coreEnd, peerEnd] = channelPair();
  core.handle.privateLink.accept(coreEnd);
  const second = rawPeer(peerEnd);
  second.send(peerHello("twice"));
  const ack = await second.next("hello-ack");
  if (ack.refused !== "duplicate-instance") problems.push(`the second hello was answered refused ${JSON.stringify(ack.refused)}`);
  const ended = await Promise.race([second.ended, new Promise((done) => setTimeout(() => done(null), 3_000))]);
  if (JSON.stringify(ended) !== JSON.stringify({ code: 1008, reason: "duplicate-instance twice" })) problems.push(`the second channel ended ${JSON.stringify(ended)}`);
  if (first.end !== null) problems.push(`the first channel ended ${JSON.stringify(first.end)}`);
  first.send({ v: 1, type: "read", id: "kept", statements: [] });
  if ((await first.next("read-result").catch(() => null)) === null) problems.push("the first channel is no longer answered");
  return problems;
}

describe.each(PRIVATE_BACKENDS)("the link's checks over channels on $name", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("a read that is not one read is refused naming it, runs nothing, and the channel stays (the escapes)", async () => {
    const { core, db } = await confinedCore(await backend.database("public"));
    try {
      expect(await confinementProblems(core, db)).toEqual([]);
    } finally {
      await core.handle.stop();
    }
  }, 300_000);

  it("negative control (committed): the read gate off on the channel path only fails the oracle", async () => {
    const { core, db } = await confinedCore(await backend.database("public"), { reads: "unconfined" });
    try {
      const problems = await confinementProblems(core, db);
      expect(problems.some((problem) => problem.startsWith("COMMIT, then an INSERT: answered"))).toBe(true);
    } finally {
      await core.handle.stop();
    }
  }, 300_000);

  it("a message failing its schema, an unknown v or type, an instance id outside the rule close the channel", async () => {
    const core = channelCore(await backend.database("public"), { head: 2n });
    try {
      await core.handle.started;
      expect(await schemaProblems(core)).toEqual([]);
    } finally {
      await core.handle.stop();
    }
  }, 120_000);

  it("negative control (committed): the link's schemas off on the channel path only fail the oracle", async () => {
    const core = channelCore(await backend.database("public"), { head: 2n, seams: { message: UNCHECKED } });
    try {
      await core.handle.started;
      const problems = await schemaProblems(core);
      for (const fault of CLOSING_FAULTS) expect(problems.some((problem) => problem.startsWith(`${fault.name}:`)), fault.name).toBe(true);
      expect(problems).toContain("an instance id outside the rule was answered hello-ack");
    } finally {
      await core.handle.stop();
    }
  }, 120_000);

  it("a second hello with a connected instance id is refused duplicate-instance, the first channel kept", async () => {
    const core = channelCore(await backend.database("public"), { head: 2n });
    try {
      await core.handle.started;
      expect(await duplicateProblems(core)).toEqual([]);
    } finally {
      await core.handle.stop();
    }
  }, 120_000);

  it("negative control (committed): duplicates accepted on the channel path only fail the oracle", async () => {
    const core = channelCore(await backend.database("public"), { head: 2n, seams: { duplicates: "accept" } });
    try {
      await core.handle.started;
      expect(await duplicateProblems(core)).toContain('the second hello was answered refused null');
    } finally {
      await core.handle.stop();
    }
  }, 120_000);
});

/** The private side's oracle: a core message failing its schema closes the private process's channel; every problem. */
async function privateSideProblems(message?: (value: unknown) => Received): Promise<string[]> {
  const problems: string[] = [];
  const cores: RawPeer[] = [];
  const transport = new PrivateTransport({
    carrier: channelCarrier(
      async () => {
        const [privateEnd, coreEnd] = channelPair();
        cores.push(rawPeer(coreEnd));
        return privateEnd;
      },
      message === undefined ? {} : { message },
    ),
    instance: "private-side",
    version: "0.10.0",
    position: () => ({ height: 0n, hash: null }),
    backoffCeilingMs: 1_000,
    log: () => undefined,
  });
  void transport.connection().catch(() => undefined);
  try {
    await until(() => cores.length === 1, "the first channel");
    const core = cores[0] as RawPeer;
    await core.next("hello");
    // A hello-ack with a field its schema does not have.
    core.send({ v: 1, type: "hello-ack", lockstep: false, genesis: `0x${"00".repeat(32)}`, start: "1", cursor: null, refused: null, configHash: `0x${"c1".repeat(32)}`, extra: 1 });
    const ended = await Promise.race([core.ended, new Promise((done) => setTimeout(() => done(null), 3_000))]);
    if (JSON.stringify(ended) !== JSON.stringify({ code: 1008, reason: "invalid-message" })) problems.push(`the private process's channel ended ${JSON.stringify(ended)}`);
    if (transport.state === "connected") problems.push("the private process took the invalid hello-ack");
  } finally {
    await transport.close();
  }
  return problems;
}

describe("on a private process's channel", () => {
  it("a core message failing its schema closes the channel, and the private process connects again", async () => {
    expect(await privateSideProblems()).toEqual([]);
  }, 30_000);

  it("negative control (committed): the link's schemas off on the private side's channel path fail the oracle", async () => {
    expect(await privateSideProblems(UNCHECKED)).toContain("the private process took the invalid hello-ack");
  }, 30_000);
});

const POSTGRES = PRIVATE_BACKENDS.find((backend) => backend.kind === "postgres");
if (POSTGRES === undefined) throw new Error("no PostgreSQL backend");

/** The logins that could write (cluster-wide), each with what the refusal names. */
const WRITERS = [
  { login: "l67_super", grant: "SUPERUSER", found: "is a superuser" },
  { login: "l67_createrole", grant: "CREATEROLE", found: "holds CREATEROLE" },
  { login: "l67_member", grant: "", found: 'is a member of the database login "test"' },
] as const;

/** The login that holds INSERT on one public table besides SELECT on all. */
const INSERTER = "l67_insert";

const loginOf = (login: string) => ({ user: login, password: login });

/** How a channel core's startup on `db` with the reader `login` ended: its refusal, or null once it started. */
async function startupOf(db: TestDatabase, login: string, seams?: EngineInput["channelLink"]) {
  const core = channelCore(db, { head: 2n, modules: [PUB], extra: { transportReader: loginOf(login) }, ...(seams === undefined ? {} : { seams }) });
  try {
    await core.handle.started;
    return null;
  } catch (error) {
    if (!(error instanceof UmbraError)) throw error;
    return { code: error.code, message: error.message, details: error.details };
  } finally {
    await core.handle.stop();
  }
}

describe("with publicSide { channels: true } on PostgreSQL 18, a transportReader that could write refuses startup", () => {
  const backend = POSTGRES;
  beforeAll(async () => {
    await backend.start();
    const db = await backend.database("public");
    for (const { login, grant } of WRITERS) {
      await db.exec?.(`CREATE ROLE ${login} LOGIN ${grant} PASSWORD '${login}'; GRANT pg_read_all_data TO ${login};`);
    }
    await db.exec?.('GRANT "test" TO l67_member;');
    await db.exec?.(`CREATE ROLE ${INSERTER} LOGIN PASSWORD '${INSERTER}'; GRANT pg_read_all_data TO ${INSERTER};`);
  }, START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  for (const writer of WRITERS) {
    it(`a login that ${writer.found} refuses startup with transport-reader-can-write`, async () => {
      const refusal = await startupOf(await backend.database("public"), writer.login);
      expect(refusal?.code).toBe("transport-reader-can-write");
      expect(refusal?.message).toContain(`transportReader login "${writer.login}" ${writer.found}`);
      expect(refusal?.details).toMatchObject({ user: writer.login });
    }, 120_000);
  }

  it("a login holding INSERT on a public table refuses startup, naming the table", async () => {
    const db = await backend.database("public");
    // A first start makes the tables; the grant then gives the login a write on one of them.
    expect(await startupOf(db, READER_LOGIN)).toBeNull();
    await db.exec?.(`GRANT INSERT ON pub.rows TO ${INSERTER};`);
    const refusal = await startupOf(db, INSERTER);
    expect(refusal?.code).toBe("transport-reader-can-write");
    expect(refusal?.message).toContain(`transportReader login "${INSERTER}" holds INSERT on table pub.rows`);
  }, 120_000);

  it("negative control (committed): the check skipped for channels lets every one of them start, and the oracle fails", async () => {
    for (const writer of WRITERS) {
      expect(await startupOf(await backend.database("public"), writer.login, { readerCheck: "skip" }), writer.login).toBeNull();
    }
  }, 300_000);
});
