import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Message } from "../../src/private/messages.js";
import { UmbraError } from "../../src/db/errors.js";
import { PRIVATE_BACKENDS, READER_LOGIN, START_TIMEOUT_MS, TEST_TIMEOUT_MS, type TestDatabase } from "./backends.js";
import { launchPublicCore, type PublicCore, type PublicCoreOptions, startPublicCore } from "./builds.js";
import { hello, rawClient } from "./raw-client.js";
import { PUB, PUB_ENTRY, publicState, stateProblems } from "./read-confinement-checks.js";

/**
 * A177 `[CI]` (task 4.5; CF-4, PP-4; owner decision Q175 A) on PostgreSQL 18.6: a core with `listen.transport` runs the
 * transport's reads on a pool of its own, logged in as `core.transportReader`. A login that holds only `SELECT` on the
 * public schemas (`pg_read_all_data`) serves a private process's reads: `current_user` in a read is it. A login that
 * could write — a superuser, one holding `CREATEROLE`, `CREATEDB` or `BYPASSRLS`, a member of the writer's login, one
 * holding `INSERT` on a public table — refuses startup with `transport-reader-can-write`, naming the login and what it
 * found. Without `transportReader` the start is refused with its path. With task 14.2b's gate turned off (the test
 * seam `transportReads: "unconfined"`), a `read` that writes is refused by the database itself (SQLSTATE 42501) and
 * the public database is unchanged. The committed negative control is `transport-reader.negative-control.test.ts`.
 */

const POSTGRES = PRIVATE_BACKENDS.find((backend) => backend.kind === "postgres");
if (POSTGRES === undefined) throw new Error("no PostgreSQL backend");

/** The logins of the refusals (cluster-wide), each with what makes it able to write, as the refusal names it. */
const WRITERS = [
  { login: "a177_super", grant: "SUPERUSER", found: "is a superuser" },
  { login: "a177_createrole", grant: "CREATEROLE", found: "holds CREATEROLE" },
  { login: "a177_createdb", grant: "CREATEDB", found: "holds CREATEDB" },
  { login: "a177_bypassrls", grant: "BYPASSRLS", found: "holds BYPASSRLS" },
  { login: "a177_member", grant: "", found: 'is a member of the database login "test"' },
] as const;

/** The login that holds INSERT on one public table besides SELECT on all. */
const INSERTER = "a177_insert";

/** The core's settings with `listen.transport` and, unless given otherwise, the reader's login. */
const transportWith = (reader: Readonly<Record<string, unknown>> | undefined) => ({
  listen: { transport: "127.0.0.1:0" },
  transportReader: reader,
});

const loginOf = (login: string) => ({ user: login, password: login });

/** The core on `db` with `extra`, as A177's tests start it. */
function coreOptions(db: TestDatabase, extra: Readonly<Record<string, unknown>>, rest: Partial<PublicCoreOptions> = {}) {
  return { database: db.setting, head: 3n, modules: [PUB], entries: [PUB_ENTRY], extra, ...rest };
}

/** How a core's startup ended: its refusal's code, message and details, or null once it started. */
async function startupOf(core: PublicCore): Promise<{ code: string; message: string; details: unknown } | null> {
  try {
    await core.handle.started;
    return null;
  } catch (error) {
    if (!(error instanceof UmbraError)) throw error;
    return { code: error.code, message: error.message, details: error.details };
  } finally {
    await core.stop();
  }
}

/**
 * How long a `read-result` may take: past the core's own bound on a read (`apiReadTimeoutMs`, 30 s), so that a read the
 * core ends is seen as its answer, not as the client giving up first on a loaded machine.
 */
const ANSWER_MS = 120_000;

/** Sends one `read` of `statements` to the transport at `address` and returns its `read-result`. */
async function readThrough(address: string, statements: readonly string[]) {
  const client = rawClient(`ws://${address}/`);
  try {
    await client.opened;
    client.send(hello("a177-reader"));
    await client.next("hello-ack", ANSWER_MS);
    const message: Message = { v: 1, type: "read", id: "1", statements: statements.map((sql) => ({ sql, params: [] })) };
    client.send(message);
    return await client.next("read-result", ANSWER_MS);
  } finally {
    client.close();
  }
}

describe("A177: the transport's reads on PostgreSQL run as core.transportReader (CF-4, PP-4, Q175 A)", () => {
  const backend = POSTGRES;
  beforeAll(async () => {
    await backend.start();
    const db = await backend.database("public");
    for (const { login, grant } of WRITERS) {
      await db.exec?.(`CREATE ROLE ${login} LOGIN ${grant} PASSWORD '${login}'; GRANT pg_read_all_data TO ${login};`);
    }
    await db.exec?.('GRANT "test" TO a177_member;');
    await db.exec?.(`CREATE ROLE ${INSERTER} LOGIN PASSWORD '${INSERTER}'; GRANT pg_read_all_data TO ${INSERTER};`);
  }, START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("a login with only SELECT serves a private process's reads: current_user in a read is it", async () => {
    const db = await backend.database("public");
    const core = await startPublicCore(coreOptions(db, transportWith(loginOf(READER_LOGIN))));
    try {
      const answer = await readThrough(core.transport(), ["SELECT current_user AS who, count(*)::text AS n FROM pub.rows"]);
      expect(answer.error).toBeUndefined();
      expect(answer.results?.[0]?.rows).toEqual([[READER_LOGIN, "3"]]);
      // The reader's sessions are the database API's own (application_name umbradb), apart from the writer's.
      const sessions = (await db.sessions?.()) ?? [];
      expect(sessions).toContainEqual({ login: READER_LOGIN, application: "umbradb" });
      // The login's name is its password here, which the log redacts wherever it appears.
      expect(core.lines).toContain("transport reads as [redacted], a login that may only read");
    } finally {
      await core.stop();
    }
  }, TEST_TIMEOUT_MS);

  for (const writer of WRITERS) {
    it(`a login that ${writer.found} refuses startup with transport-reader-can-write`, async () => {
      const db = await backend.database("public");
      const refusal = await startupOf(launchPublicCore(coreOptions(db, transportWith(loginOf(writer.login)))));
      expect(refusal?.code).toBe("transport-reader-can-write");
      expect(refusal?.message).toContain(`transportReader login "${writer.login}" ${writer.found}`);
      expect(refusal?.details).toMatchObject({ user: writer.login });
    }, TEST_TIMEOUT_MS);
  }

  it("a login holding INSERT on a public table refuses startup, naming the table", async () => {
    const db = await backend.database("public");
    // A first start makes the tables; the grant then gives the login a write on one of them.
    const first = await startPublicCore(coreOptions(db, transportWith(loginOf(READER_LOGIN))));
    await first.stop();
    await db.exec?.(`GRANT INSERT ON pub.rows TO ${INSERTER};`);
    const refusal = await startupOf(launchPublicCore(coreOptions(db, transportWith(loginOf(INSERTER)))));
    expect(refusal?.code).toBe("transport-reader-can-write");
    expect(refusal?.message).toContain(`transportReader login "${INSERTER}" holds INSERT on table pub.rows`);
  }, TEST_TIMEOUT_MS);

  it("without transportReader the start is refused with its path", async () => {
    const db = await backend.database("public");
    const refusal = await startupOf(launchPublicCore(coreOptions(db, transportWith(undefined))));
    expect(refusal?.code).toBe("invalid-configuration");
    const findings = (refusal?.details as { findings: { path: string }[] }).findings;
    expect(findings.map((found) => found.path)).toEqual(["entries[0].config.transportReader"]);
  }, TEST_TIMEOUT_MS);

  it("with the gate turned off, a read that writes is refused by the database, and nothing changes", async () => {
    const db = await backend.database("public");
    const core = await startPublicCore(
      coreOptions(db, transportWith(loginOf(READER_LOGIN)), { transportReads: "unconfined" }),
    );
    try {
      const before = await publicState(core.db());
      const deleted = await readThrough(core.transport(), ["COMMIT", "DELETE FROM pub.rows"]);
      expect(deleted.error).toBe("database-error");
      const created = await readThrough(core.transport(), ["COMMIT", "CREATE TABLE pub.evil (x int)"]);
      expect(created.error).toBe("database-error");
      const ended = await readThrough(core.transport(), [
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE usename = 'test' AND application_name = 'umbradb'",
      ]);
      expect(ended.error).toBe("database-error");
      expect(stateProblems(before, await publicState(core.db()))).toEqual([]);
      // The writer is still there: the core commits the next height.
      await core.advance(4n);
    } finally {
      await core.stop();
    }
  }, TEST_TIMEOUT_MS);
});
