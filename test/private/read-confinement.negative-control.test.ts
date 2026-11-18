import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startCoreTransport } from "../../src/private/core-socket.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { type PublicCore, startPublicCore } from "./builds.js";
import { confinementProblems, PUB, PUB_ENTRY } from "./read-confinement-checks.js";

/**
 * The committed negative control for confined reads: the unconfined read path fails the confinement oracle. Its core
 * transport runs every statement of a `read` as sent (`reads: "unconfined"`), in the read-only transaction of
 * `Database.read` and nothing more, over a running core's public database, on PostgreSQL 18.6 and PGlite 0.5.10.
 * - The escapes are answered without the gate's refusal: a `COMMIT` with the read handle's own refusal
 *   (`database-error`), a `SET`, a `pg_advisory_lock` or a `LISTEN` with results.
 * - `pg_advisory_lock` leaves its lock held.
 *
 * The read handle refuses transaction control before it is sent (`src/db/statement-refusal.ts`), so a `COMMIT` no
 * longer ends the read: the read fails at it and the statements after it do not run, a `nextval` alone fails in the
 * read-only transaction, and the public database's contents, row counts and sequences stay as they were.
 *
 * The core is stopped afterwards: its public database is the control's own.
 */

describe.each(PRIVATE_BACKENDS)("negative control on $name: the read path before reads were confined", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  let core: PublicCore;
  beforeAll(async () => {
    const db = await backend.database("public");
    core = await startPublicCore({ database: db.setting, head: 3n, modules: [PUB], entries: [PUB_ENTRY] });
  }, START_TIMEOUT_MS);
  afterAll(() => core?.stop(), START_TIMEOUT_MS);

  it("negative control (committed): a transport running every statement as sent answers the escapes, leaves advisory locks held, and fails", async () => {
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
      expect(problems).toContain(
        'COMMIT, then an INSERT: answered error database-error, not read-refused {"statement":0,"reason":"command","name":"COMMIT"}',
      );
      expect(problems).toContain('SET of a setting: answered results, not read-refused {"statement":0,"reason":"command","name":"SET"}');
      expect(problems).toContain(
        'pg_advisory_lock: answered results, not read-refused {"statement":0,"reason":"function","name":"pg_advisory_lock"}',
      );
      expect(problems).toContainEqual(expect.stringMatching(/^advisory locks left held: /));
      // The read handle's own refusal of COMMIT: nothing was written.
      expect(problems.filter((problem) => /^(the public database's contents hash|row counts|sequences) changed/.test(problem))).toEqual([]);
    } finally {
      await control.close();
    }
  }, TEST_TIMEOUT_MS);
});
