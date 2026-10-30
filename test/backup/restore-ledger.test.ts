import { existsSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { isEmptyDatabase } from "../../src/backup/restore.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { hex } from "../backbone/fetch-fixtures.js";
import { BACKUP_BACKENDS, type BackupBackend, pathOf } from "./backup-fixtures.js";
import { disagreeingNode, ledgerBackup, ledgerChain, restoreLedger } from "./restore-ledger.js";

/**
 * The restore's `backup-root-mismatch` refusal, on PostgreSQL 18.6 and PGlite 0.5.10: a backup with `core-ledger-state`
 * in its history restores against a node whose ledger state root at the backup's height is the one it stores, and is
 * refused — after loading, its transaction rolled back, the target empty — against a node whose root there is another.
 * The chain and the restore: `./restore-ledger.ts`. [A126, BK-3, LG-15]
 */

const TEST_TIMEOUT_MS = 900_000;

describe.each(BACKUP_BACKENDS)("the ledger state root's check on $name (BK-3)", (backend: BackupBackend) => {
  beforeAll(async () => {
    await backend.start();
    // The process's backup finds pg_dump as the command does: the pinned image's (`./backup-fixtures.ts`).
    if (backend.kind === "postgres") process.env.UMBRADB_PG_DUMP = backend.env().UMBRADB_PG_DUMP;
  }, 300_000);
  afterAll(async () => {
    delete process.env.UMBRADB_PG_DUMP;
    await backend.stop();
  }, 120_000);

  it(
    "A126: with core-ledger-state in the history, a stored state root at the backup's height that is not the node's " +
      "refuses with backup-root-mismatch after loading, the target empty; the node's own restores",
    async () => {
      const scenario = await ledgerChain();
      const backup = await ledgerBackup(await backend.database(), scenario);
      const root = scenario.heights[Number(scenario.head)]?.root as Uint8Array;
      expect(backup.manifest).toMatchObject({ height: String(scenario.head), stateRoot: hex(root) });
      expect(backup.manifest.history.some((row) => row.id === "core-ledger-state")).toBe(true);

      const refusedTarget = await backend.database();
      const error = await restoreLedger(backend, refusedTarget, backup, disagreeingNode(scenario)).then(
        () => null,
        (caught: unknown) => caught,
      );
      expect(error).toMatchObject({ code: "backup-root-mismatch", details: { height: String(scenario.head), stored: hex(root) } });
      if (backend.kind === "postgres" || existsSync(join(pathOf(refusedTarget.setting), "PG_VERSION"))) {
        expect(await refusedTarget.read((read) => isEmptyDatabase(read), async () => null)).toBe(true);
      }

      const target = await backend.database();
      const restored = await restoreLedger(backend, target, backup, scenario.records);
      expect(restored.manifest.stateRoot).toBe(hex(root));
      const [stored] = await target.query(
        `SELECT encode(state_root, 'hex') AS root FROM core_ledger_state.states WHERE height = ${scenario.head}`,
      );
      expect(`0x${stored?.root as string}`).toBe(hex(root));

      // A chain that gives no ledger state root (the in-memory source, here with the tape's blocks) cannot check it: the
      // restore fails before loading instead of leaving the check out.
      const blocks = scenario.chain.map((block) => ({ height: block.height, hash: block.hash, parentHash: block.parentHash }));
      const rootless = new InMemoryBlockSource({ head: scenario.head, blocks });
      const unchecked = await restoreLedger(backend, await backend.database(), backup, scenario.records, {}, rootless).then(
        () => null,
        (caught: unknown) => caught,
      );
      expect((unchecked as Error).message).toContain("the block source gives no root");
    },
    TEST_TIMEOUT_MS,
  );
});
