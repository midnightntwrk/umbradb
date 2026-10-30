import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { BACKUP_BACKENDS, type BackupBackend } from "../backup/backup-fixtures.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { logLines } from "./contract-data-checks.js";
import { handoff, handoffProblems, handoffScenario } from "./contract-logs-handoff.js";
import { PATIENCE_MS } from "./ingest-harness.js";

/**
 * `[CI]`, on PostgreSQL 18 and PGlite 0.5.10: `core-contract-logs-full` stops at h, a backup is taken at h, and the
 * restored database continues with `core-contract-logs-fast` from h + 1. The restore and startup accept it, and
 * `contract_logs.logs` continues without a gap or a repeat. [A111 CI, CC-4, BK-1, BK-3, MD-6]
 *
 * The run, the backup, the restore and the continuation are in `./contract-logs-handoff.ts`. Its negative controls (a
 * switch that skips h + 1, one that repeats it) are in `contract-data.negative-control.test.ts`.
 */

describe.each(BACKUP_BACKENDS)("the contract-logs handoff from -full to -fast through a backup on $name (CC-4)", (backend: BackupBackend) => {
  beforeAll(async () => {
    await backend.start();
    // The process's backup finds pg_dump as the command does: the pinned image's (`../backup/backup-fixtures.ts`).
    if (backend.kind === "postgres") process.env.UMBRADB_PG_DUMP = backend.env().UMBRADB_PG_DUMP;
  }, 300_000);
  afterAll(async () => {
    delete process.env.UMBRADB_PG_DUMP;
    await backend.stop();
  }, 120_000);

  it(
    "A111: -full stopping at h, a backup at h, and the restored database continuing with -fast from h + 1 give a continuous contract_logs.logs",
    async () => {
      const expected = await handoffScenario();
      const result = await handoff(backend, expected, { h: 3n, fastFrom: 4n });
      expect(result.manifest.height).toBe("3");
      expect(await handoffProblems(result, expected)).toEqual([]);
      // Logs at h (by -full, restored) and at h + 1 (by -fast), each height's once.
      const lines = await logLines(result.target as unknown as ProcessDatabase);
      expect(new Set(lines.map((line) => line.split(" ")[0]))).toEqual(new Set(["2", "3", "4", "5"]));
      // The history records both providers: -full from 0 to h, -fast from h + 1.
      const history = await (result.target as unknown as ProcessDatabase).query(
        "SELECT entry_id AS id, start::text AS start, stop::text AS stop FROM core_chain.config WHERE entry_id LIKE 'core-contract-logs-%' ORDER BY entry_id",
      );
      expect(history).toEqual([
        { id: "core-contract-logs-fast", start: "4", stop: null },
        { id: "core-contract-logs-full", start: "0", stop: "3" },
      ]);
    },
    PATIENCE_MS * 4,
  );
});
