import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { genesisHex } from "../private/builds.js";
import { BACKUP_BACKENDS, type BackupBackend } from "./backup-fixtures.js";
import { emptied } from "./restore-fixtures.js";
import {
  BACKUP_HEIGHT,
  CONTINUED_HEAD,
  heightsFrom,
  PRIVATE_START,
  type PrivateBackup,
  privateBackup,
  type PublicSetting,
  privateHashOf,
  privateRows,
  publicDatabaseOf,
  restorePrivate,
  startPrivateFile,
  startPublicSide,
  type PublicSideOptions,
  pmModule,
  writePrivateConfig,
} from "./restore-private.js";

/**
 * On PostgreSQL 18.6 and PGlite 0.5.10, through `umbradb restore`'s own work in this process (`runRestore`) with a
 * private process's configuration file: a private process's backup, written under the development opt-in, restores into
 * an empty private database with the restore's checks made against its public database — read as the private process
 * reads it, on PostgreSQL directly and on PGlite through the core's transport —, and the process continues from its
 * height + 1 as one that never stopped; one taken against another public database is refused with
 * `private-binding-mismatch` and the binding's `details.reason`, the target left empty; and every other check against
 * the public database refuses before anything is loaded. [A164 CI, BK-3, BK-4, PP-2, PP-12, Q153; design §9.1]
 *
 * The setup: `./restore-private.ts`. The committed negative control (the restore without the binding's check) is
 * `./restore-private.negative-control.test.ts`.
 */

/** Each test waits on purpose for processes to reach heights: its own budget, for a loaded machine. */
const TEST_TIMEOUT_MS = 900_000;

/** Waits until `holds()`, read again every 20 ms; fails naming `what` after 60 s. */
async function waitFor(holds: () => boolean, what: string): Promise<void> {
  const deadline = Date.now() + 60_000;
  while (!holds()) {
    if (Date.now() > deadline) throw new Error(`timed out waiting for ${what}`);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("pm.ts", pmModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-private-restores-"));
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.start()));
  // The private processes' own backups find pg_dump as the command does: the pinned image's (`./backup-fixtures.ts`).
  process.env.UMBRADB_PG_DUMP = (BACKUP_BACKENDS[0] as BackupBackend).env().UMBRADB_PG_DUMP;
}, 300_000);

afterAll(async () => {
  delete process.env.UMBRADB_PG_DUMP;
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.stop()));
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

describe.each(BACKUP_BACKENDS)("A164: a private process's backup on $name", (backend) => {
  let backup: PrivateBackup | undefined;

  beforeAll(async () => {
    backup = await privateBackup(project, backend, join(dir, `${backend.kind}-private.backup`));
  }, TEST_TIMEOUT_MS);

  afterAll(async () => {
    await backup?.bound.core.stop();
  }, 120_000);

  /** The backup (made by `beforeAll`). */
  const taken = (): PrivateBackup => {
    if (backup === undefined) throw new Error("no backup");
    return backup;
  };

  /**
   * A new empty private database, and a configuration of the backup's process on it, reading `side`'s public data, as
   * the instance `instanceId` (an operational setting).
   */
  async function target(side: { readonly setting: PublicSetting }, instanceId = "instance-1") {
    const db = await backend.database();
    const options = { database: db.setting, start: PRIVATE_START, public: side.setting, instanceId };
    return { db, config: writePrivateConfig(project, options) };
  }

  it(
    "A164: a private process's backup restores into an empty private database with BK-3's checks made against its " +
      "public database and continues from its height + 1; one taken against another public database is refused with " +
      "private-binding-mismatch and the binding's details.reason, the target left empty",
    async () => {
      const { bound, file, manifest } = taken();
      expect(manifest).toMatchObject({ height: String(BACKUP_HEIGHT), start: String(PRIVATE_START) });

      // Another public database of the same chain — its core from S 2 —: the binding the backup's row records (S 1) is
      // not its, and the restore rolls back after loading.
      const other = await startPublicSide(backend, { head: BACKUP_HEIGHT, start: 2 });
      try {
        const into = await target(other);
        const refused = await restorePrivate(project, file, into.config);
        expect(refused).toMatchObject({
          restored: false,
          error: { code: "private-binding-mismatch", details: { reason: "start", recorded: "1", public: "2" } },
        });
        expect(refused.line).toMatch(/^umbradb restore: private-binding-mismatch: /);
        expect(await emptied(backend, into.db)).toBe(true);
      } finally {
        await other.core.stop();
      }

      // Against its own public database: restored, the cursor and every row at the backup's height.
      const restoredInto = await target(bound, "instance-restored");
      const restored = await restorePrivate(project, file, restoredInto.config);
      expect(restored, restored.line).toMatchObject({ restored: true });
      expect(restored.line).toContain(`height ${BACKUP_HEIGHT}`);
      expect(restored.line).toContain(`the database resumes from ${BACKUP_HEIGHT + 1n}`);
      expect(await privateRows(restoredInto.db)).toEqual({
        heights: heightsFrom(BigInt(PRIVATE_START), BACKUP_HEIGHT),
        cursor: String(BACKUP_HEIGHT),
      });
      expect(await privateHashOf(restoredInto.db)).toBe(manifest.contentsHash);
      const restoredHellos = (): string[] =>
        bound.core.lines.filter((line) => line.startsWith("transport: instance instance-restored "));
      if (backend.kind === "pglite") {
        // Through the core's transport: the restore's hello gave the empty target's position (S − 1), and the command
        // closed its connection when it ended.
        await waitFor(() => restoredHellos().length >= 2, "the restore's connection to close");
        expect(restoredHellos()).toEqual([
          `transport: instance instance-restored connected at ${PRIVATE_START - 1}`,
          "transport: instance instance-restored disconnected",
        ]);
      }

      // The public core goes on; the restored process continues from 13, and equals one that never stopped.
      await bound.core.advance(CONTINUED_HEAD);
      const continued = await startPrivateFile(restoredInto.config);
      try {
        await continued.reach(CONTINUED_HEAD);
      } finally {
        await continued.handle.stop();
      }
      const uninterrupted = await backend.database();
      const whole = await startPrivateFile(
        writePrivateConfig(project, {
          database: uninterrupted.setting,
          start: PRIVATE_START,
          public: bound.setting,
          instanceId: "instance-uninterrupted",
        }),
      );
      try {
        await whole.reach(CONTINUED_HEAD);
      } finally {
        await whole.handle.stop();
      }
      expect(await privateRows(restoredInto.db)).toEqual({
        heights: heightsFrom(BigInt(PRIVATE_START), CONTINUED_HEAD),
        cursor: String(CONTINUED_HEAD),
      });
      expect(await privateHashOf(restoredInto.db)).toBe(await privateHashOf(uninterrupted));
      // The continued process's hello gave the restored cursor.
      if (backend.kind === "pglite") {
        expect(restoredHellos()[2]).toBe(`transport: instance instance-restored connected at ${BACKUP_HEIGHT}`);
      }
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A164: the other checks against the public database refuse before anything is loaded — its core never started, " +
      "another network, its S above the backup's, its head below the backup's height, another block there — the " +
      "target left empty",
    async () => {
      const { file } = taken();
      /** A restore against a public core started with `options`: its refusal; the target checked empty. */
      const refusalAgainst = async (options: PublicSideOptions) => {
        const side = await startPublicSide(backend, options);
        try {
          const into = await target(side);
          const outcome = await restorePrivate(project, file, into.config);
          expect(outcome.restored).toBe(false);
          expect(await emptied(backend, into.db)).toBe(true);
          return outcome;
        } finally {
          await side.core.stop();
        }
      };

      // A public database whose core never started: nothing to bind to. On PGlite, read directly (no core serves it).
      const empty = await backend.database();
      const setting =
        backend.kind === "postgres" ? { publicDatabase: empty.setting } : { coreTransport: "127.0.0.1:9" };
      const unstarted = await target({ setting });
      const notStarted = await restorePrivate(
        project,
        file,
        unstarted.config,
        backend.kind === "postgres" ? {} : { publicDatabase: () => publicDatabaseOf(empty) },
      );
      expect(notStarted).toMatchObject({
        restored: false,
        error: { code: "private-binding-mismatch", details: { reason: "public-not-started" } },
      });
      expect(await emptied(backend, unstarted.db)).toBe(true);

      expect(await refusalAgainst({ head: BACKUP_HEIGHT, genesisHash: genesisHex(0xb2) })).toMatchObject({
        error: {
          code: "private-binding-mismatch",
          details: { reason: "network", configured: genesisHex(0xa1), public: genesisHex(0xb2) },
        },
      });
      expect(await refusalAgainst({ head: BACKUP_HEIGHT, start: 5 })).toMatchObject({
        error: { code: "private-binding-mismatch", details: { reason: "private-start-below", private: "3", public: "5" } },
      });
      expect(await refusalAgainst({ head: BACKUP_HEIGHT - 4n })).toMatchObject({
        error: { code: "backup-block-not-finalized", details: { height: String(BACKUP_HEIGHT), head: String(BACKUP_HEIGHT - 4n) } },
      });
      const otherHash = new Uint8Array(32).fill(0xee);
      const otherBlock = { height: BACKUP_HEIGHT, hash: otherHash, parentHash: inMemoryBlock(BACKUP_HEIGHT - 1n).hash };
      expect(await refusalAgainst({ head: BACKUP_HEIGHT, blocks: [otherBlock] })).toMatchObject({
        error: {
          code: "backup-block-not-finalized",
          details: { height: String(BACKUP_HEIGHT), public: `0x${"ee".repeat(32)}`, backup: taken().manifest.blockHash },
        },
      });
    },
    TEST_TIMEOUT_MS,
  );
});
