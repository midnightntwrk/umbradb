import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { statusWhen } from "../admin/admin-harness.js";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { launchPublicCore } from "./builds.js";
import { originOf, privacyProblems, privacyRun } from "./privacy-checks.js";

/**
 * A120 `[CI]` (task 14.4; PP-9, PP-10; required test id `private.no-key-bytes-public`), on PostgreSQL 18.6 and PGlite
 * 0.5.10: with a registered test key and 100 processed blocks, the key's bytes — and its id — appear in no table of
 * the public database, no log line of the core or of either private instance, no field of any process's `/status`,
 * `/config` or health answers, no answer of the core's or the instance's module API and no message of the process
 * transport, in any of the forms `./privacy-checks.ts` searches, while the scan finds them in the instance's own
 * `core_key_registry.keys`; and the core's `/status` shows each instance with only its id, connection, lockstep flag
 * and synced height — the lockstep instance at 100 —, each instance its public cursor and its lockstep flag. The
 * committed negative controls — a private process that logs the key's bytes, and a `/config` that shows them — are
 * `./privacy.negative-control.test.ts`'s.
 */

describe.each(PRIVATE_BACKENDS)("A120: no key byte on the public side on $name (PP-9, PP-10)", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "[[private.no-key-bytes-public]] A120: with a registered test key and 100 processed blocks, its bytes appear in no " +
      "public table, log line, status field or API response; the core's /status shows only each instance's id, " +
      "connection, lockstep flag and synced height",
    async () => {
      const run = await privacyRun(backend, { head: 100n, lockstep: true });
      expect(privacyProblems(run)).toEqual([]);
      // What the scan read: every surface, not a sample.
      expect(run.publicRows.some((row) => row.startsWith("core_block_commit.blocks: "))).toBe(true);
      expect(run.answers.map((answer) => answer.where)).toEqual(
        expect.arrayContaining(["the core /status", "keeper /config", "other /status", "the core API /blocks/100", "keeper API /keys"]),
      );
      expect(run.answers.find((answer) => answer.where === "keeper API /keys")?.text).toBe('{"admitted":1,"height":"100"}');
      expect(run.messages.some((message) => message.includes('"type":"report"'))).toBe(true);
      expect(run.lines.keeper.length).toBeGreaterThan(0);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "the core's /status shows a listed instance it never saw: not connected, lockstep, no height (PP-9, Q24)",
    async () => {
      const publicDb = await backend.database("public");
      const core = launchPublicCore({
        database: publicDb.setting,
        head: 3n,
        extra: { listen: { admin: "127.0.0.1:0" }, lockstepInstances: ["absent"] },
        admin: true,
      });
      try {
        await core.handle.started;
        const origin = await originOf(core.lines, "the core");
        const shown = (body: unknown) => (body as { privateInstances: unknown }).privateInstances;
        const body = await statusWhen(origin, (each) => Array.isArray(shown(each)) && (shown(each) as unknown[]).length > 0, 120_000);
        expect(shown(body)).toEqual([{ id: "absent", connected: false, lockstep: true, height: null }]);
      } finally {
        await core.stop();
      }
    },
    TEST_TIMEOUT_MS,
  );
});
