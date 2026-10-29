import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startCoreTransport } from "../../src/private/core-transport.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { type PublicCore, startPublicCore } from "./builds.js";
import { confinementProblems, PUB, PUB_ENTRY } from "./read-confinement-checks.js";

/**
 * The committed negative control for confined reads: the unconfined read path fails the confinement oracle. Its core
 * transport runs every statement of a `read` as sent (`reads: "unconfined"`), in the read-only transaction of
 * `Database.read` and nothing more, over a running core's public database, on PostgreSQL 18.6 and PGlite 0.5.10.
 * [A172, PP-4]
 * - A `COMMIT` ends the read and the `INSERT` after it writes `pub.rows`.
 * - A `nextval` after a `COMMIT` moves `pub.log`'s sequence.
 * - `pg_advisory_lock` leaves its lock held.
 * - The escapes are answered as reads, not refused.
 *
 * The core is stopped afterwards: its public database is the control's own.
 */

describe.each(PRIVATE_BACKENDS)("A172's negative control on $name: the read path before task 14.2b", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  let core: PublicCore;
  beforeAll(async () => {
    const db = await backend.database("public");
    core = await startPublicCore({ database: db.setting, head: 3n, modules: [PUB], entries: [PUB_ENTRY] });
  }, START_TIMEOUT_MS);
  afterAll(() => core?.stop(), START_TIMEOUT_MS);

  it("negative control (committed): a transport running every statement as sent writes the public database and fails A172", async () => {
    const control = await startCoreTransport({
      address: "127.0.0.1:0",
      db: core.db(),
      genesis: new Uint8Array(32),
      start: 1n,
      cursor: () => 3n,
      lockstepInstances: [],
      readTimeoutMs: 30_000,
      configHash: `0x${"11".repeat(32)}`,
      log: () => undefined,
      reads: "unconfined",
    });
    try {
      const problems = await confinementProblems(`127.0.0.1:${control.port}`, core.db());
      expect(problems).toContain("the public database's contents hash changed");
      expect(problems).toContainEqual(expect.stringMatching(/^row counts changed: (.*, )?pub\.rows 3 → \d+/));
      expect(problems).toContainEqual(expect.stringMatching(/^sequences changed: (.*, )?pub\.log_id_seq 3 → \d+/));
      expect(problems).toContainEqual(expect.stringMatching(/^advisory locks left held: /));
      expect(problems).toContain('COMMIT, then an INSERT: answered results, not read-refused {"statement":0,"reason":"command","name":"COMMIT"}');
      expect(problems).toContain(
        'pg_advisory_lock: answered results, not read-refused {"statement":0,"reason":"function","name":"pg_advisory_lock"}',
      );
    } finally {
      await control.close();
    }
  }, TEST_TIMEOUT_MS);
});
