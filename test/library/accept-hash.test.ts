import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startUmbraDB, type UmbraDBHandle } from "../../src/library/start-umbradb.js";
import { PRIVATE_BACKENDS, type PrivateBackend, type TestDatabase } from "../private/backends.js";
import { launchPublicCore, type PublicCore, privateCoreEntry } from "../private/builds.js";
import { pub } from "../private/config-hash-checks.js";
import { cursorReaches } from "./library-fixtures.js";

/**
 * L50: `acceptPublicConfigHash` is the library's form of `umbradb run --update-hash` (PP-14). A library private
 * process's first start records the public configuration hash A; once the core runs with a data field changed (hash
 * B), a start without the option stops with `public-config-changed`, naming B; one with `acceptPublicConfigHash: B`
 * runs its full checks, records B and continues; a start after it, without the option, continues. On PostgreSQL 18 it
 * reads its public database directly (its `publicDatabase`); on PGlite 0.5.10 through the core's link, which its
 * network request connects to (`privateSide: true`, the core's address written as its `privateLink`).
 * [LM-9, LM-3, PP-14, Q159]
 */

/** `pub`'s entries: `level` 0 from 1 and `level` from 30, a data field above the cursor. */
const pubEntries = (level: number) => [
  { id: "pub", start: 1, version: "1.0.0", config: { level: 0 } },
  { id: "pub", start: 30, version: "1.0.0", config: { level } },
];

describe.each(PRIVATE_BACKENDS)("L50: acceptPublicConfigHash lets a private database that recorded A continue on B, on $name (PP-14)", (backend: PrivateBackend) => {
  let publicDb: TestDatabase;
  let privateDb: TestDatabase;
  let core: PublicCore | undefined;
  beforeAll(async () => {
    await backend.start();
    publicDb = await backend.database("public");
    privateDb = await backend.database("private");
  }, 300_000);
  afterAll(async () => {
    await core?.stop();
    await backend.stop();
  }, 120_000);

  /** On PGlite the core listens for its link (a free port each time it starts), through which the private one reads. */
  const linked = backend.kind === "pglite";

  /** The core on the public database with `pub` at `level`, taken to `head`. */
  const runCore = async (head: bigint, level: number): Promise<void> => {
    await core?.stop();
    core = launchPublicCore({
      database: publicDb.setting,
      head,
      modules: [pub()],
      entries: pubEntries(level),
      ...(linked ? { extra: { listen: { privateLink: "127.0.0.1:0" } } } : {}),
    });
    await core.handle.started;
    await core.advance(head);
  };

  /**
   * A library private process on the private database: on PostgreSQL reading the public one directly, on PGlite
   * through the core's link at the address it listens on now.
   */
  const privateProcess = (acceptPublicConfigHash?: string): UmbraDBHandle =>
    startUmbraDB({
      config: {
        data: {
          entries: [
            privateCoreEntry({
              database: privateDb.setting,
              instanceId: "library-acceptor",
              ...(linked
                ? { privateLink: (core as PublicCore).transport() }
                : { publicDatabase: publicDb.readerSetting as NonNullable<TestDatabase["readerSetting"]> }),
            }),
          ],
        },
      },
      ...(linked ? { network: { privateLink: { privateSide: true } } } : {}),
      ...(acceptPublicConfigHash === undefined ? {} : { acceptPublicConfigHash }),
    });

  it("records A at its first start, stops on B without the option, continues with it, then without it", async () => {
    await runCore(5n, 1);
    const first = privateProcess();
    await first.started;
    await cursorReaches(first, 5n);
    await first.stop();

    await runCore(8n, 2);
    const changed = privateProcess();
    const refusal = await changed.started.then(
      () => null,
      (error: { code: string; details: { found: string; recorded: string | null } }) => error,
    );
    await changed.stop();
    expect(refusal?.code).toBe("public-config-changed");
    const found = refusal?.details.found as string;
    expect(found).toMatch(/^0x[0-9a-f]{64}$/);
    expect(refusal?.details.recorded).not.toBe(found);

    const accepted = privateProcess(found);
    await accepted.started;
    await cursorReaches(accepted, 8n);
    await accepted.stop();

    const again = privateProcess();
    await again.started;
    await cursorReaches(again, 8n);
    await again.stop();
    expect(again.status().reason).toBeNull();
  }, 300_000);
});
