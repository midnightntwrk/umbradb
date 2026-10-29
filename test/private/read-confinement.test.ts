import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import { PrivateTransport } from "../../src/private/private-transport.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { type PublicCore, startPublicCore } from "./builds.js";
import { confinementProblems, PUB, PUB_ENTRY, publicState, stateProblems } from "./read-confinement-checks.js";

/**
 * Confined reads through a running core, on PostgreSQL 18.6 and PGlite 0.5.10. The core process listens on its
 * `listen.transport`, and a raw client sends `read`s whose statements try to leave the read: `COMMIT` then `INSERT`,
 * `ROLLBACK`, `BEGIN`, `SET TRANSACTION READ WRITE`, `SET` and `RESET` of a setting or the role, `set_config`, `DO`,
 * `nextval`, `pg_advisory_lock`, `COPY`, `LISTEN`, and two statements in one. [A172 FAULT, PP-4; design §8; threat model
 * draft, gap 1]
 * - Each is answered `read-result` `error: read-refused`, with `refused` naming the statement, and nothing of it runs.
 * - The next `read` on the same connection is answered.
 * - The public database's contents hash, row counts and sequences are unchanged, and no advisory lock is left held.
 * - Reads whose write the database itself refuses (the read-only transaction) are answered `database-error`.
 * - A private process's own client gets the refusal as an `UmbraError` `read-refused` naming the statement.
 * [A172 FAULT, PP-4]
 *
 * The committed negative control is `read-confinement.negative-control.test.ts`.
 */

/** The core's `listen.transport`: a free port of the loopback interface. */
const TRANSPORT = { listen: { transport: "127.0.0.1:0" } };

describe.each(PRIVATE_BACKENDS)("A172: a transport read is confined to reads on $name", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  let core: PublicCore;
  beforeAll(async () => {
    const db = await backend.database("public");
    core = await startPublicCore({ database: db.setting, head: 3n, modules: [PUB], entries: [PUB_ENTRY], extra: TRANSPORT });
  }, START_TIMEOUT_MS);
  afterAll(() => core?.stop(), START_TIMEOUT_MS);

  it("every escape is refused naming its statement, the transport stays up, and the public database is unchanged", async () => {
    expect(await confinementProblems(core.transport(), core.db())).toEqual([]);
    // The core logged each refusal, naming the instance and the statement, never the statement's text.
    const refusals = core.lines.filter((line) => line.startsWith("transport: refused a read of a172-escapes"));
    expect(refusals.length).toBeGreaterThanOrEqual(20);
    expect(refusals).toContain("transport: refused a read of a172-escapes: statement 1 is COMMIT, not a read");
    expect(refusals).toContain("transport: refused a read of a172-escapes: statement 1 names pg_advisory_lock");
    expect(refusals.some((line) => line.includes("INSERT INTO"))).toBe(false);
  }, TEST_TIMEOUT_MS);

  it("a private process's own client gets read-refused naming the statement; its next read is served", async () => {
    const before = await publicState(core.db());
    const transport = new PrivateTransport({
      address: core.transport(),
      instance: "a172-client",
      version: UMBRADB_VERSION,
      position: () => ({ height: 0n, hash: null }),
      backoffCeilingMs: 1_000,
      log: () => undefined,
    });
    try {
      const refused = transport.read((read) => read.query("COMMIT"));
      await expect(refused).rejects.toMatchObject({
        code: "read-refused",
        retryable: false,
        details: { statement: 0, reason: "command", name: "COMMIT" },
      });
      await expect(refused).rejects.toThrow(/^the core refused statement 1 of the read: COMMIT is not a read/);
      await expect(transport.read((read) => read.query("SELECT pg_advisory_lock(7)"))).rejects.toMatchObject({
        code: "read-refused",
        details: { reason: "function", name: "pg_advisory_lock" },
      });
      const rows = await transport.read((read) => read.query("SELECT count(*)::bigint AS n FROM pub.rows"));
      expect(rows).toEqual([{ n: 3n }]);
    } finally {
      await transport.close();
    }
    expect(stateProblems(before, await publicState(core.db()))).toEqual([]);
  }, TEST_TIMEOUT_MS);
});
