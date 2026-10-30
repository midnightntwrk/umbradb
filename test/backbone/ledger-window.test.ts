import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { loaded, retentionSeen } from "./ledger-storage-checks.js";
import type { LedgerScenario } from "./ledger-tapes.js";
import { BACKUP_AT, continueToHead, HEAD, restoreOnPostgres, syncAndBackUp, type WindowBackup, windowScenario } from "./ledger-window.js";

/**
 * With `retainStates` 1,000 at cursor 5,000, loading the state at 4,000 succeeds and 3,999 fails with
 * `state-not-retained`. Checked on PGlite 0.5.10 and PostgreSQL 18, through the real process, sized to fit a loaded
 * machine. [A103 CI, LG-12, Q122]
 *
 * The 5,000 blocks run once, on PGlite, to 4,990, where the process backs up. PGlite then continues to 5,001.
 * PostgreSQL continues from that backup, restored: a backup restores on the other backend, and the restored database
 * continues like one that never stopped. [BK-2, BK-4]
 *
 * So PostgreSQL processes only the window's last 11 blocks and the loads. It runs several statements per block through
 * Docker's port proxy: about 4 blocks a second at load averages near 40, against PGlite's 30, and 1.3 in a loaded
 * conformance run, which took the 5,000-block run past an hour.
 *
 * The window does not depend on the backend: each block's releases are computed from the configuration
 * (`src/backbone/core-ledger-state/retention.ts`). What does depend on it is checked here on both: the released states'
 * root counts, and a retained state's load through the node-store bridge. The window's revisions test
 * (`ledger-storage.test.ts`) checks the same on both from genesis. The committed negative control (a window one state
 * short) is in `ledger-storage.negative-control.test.ts`. [A103 CI]
 */

const backends = new Map(PROCESS_BACKENDS.map((backend) => [backend.kind, backend])) as Map<"postgres" | "pglite", ProcessBackend>;

/**
 * The window checks on `db` after the run reached 5,001 (the loads its watcher made at 5,001's `on-compute`).
 * [A103 CI]
 */
async function a103(db: ProcessDatabase, scenario: LedgerScenario, status: { cursor: bigint | null; reason: unknown }, loads: readonly string[] | undefined): Promise<void> {
  expect(status).toMatchObject({ cursor: HEAD, reason: null });
  expect(loads).toEqual([loaded(scenario, 4_000n), "3999 state-not-retained", loaded(scenario, 5_000n), "5001 state-not-retained", "0 state-not-retained"]);
  // After 5,001: the states of 4,001 to 5,001 held, each once.
  const counts = await db.query(
    "SELECT min(s.height)::text AS lo, max(s.height)::text AS hi, count(*)::text AS n, max(r.count)::text AS c FROM core_ledger_state.states s JOIN core_ledger_state.root_counts r ON r.node_key = s.state_key",
  );
  expect(counts[0]).toEqual({ lo: "4001", hi: "5001", n: "1001", c: "1" });
  expect((await db.query("SELECT count(*)::text AS n FROM core_ledger_state.root_counts"))[0]?.n).toBe("1001");
  expect((await db.query("SELECT count(*)::text AS n FROM core_ledger_state.states"))[0]?.n).toBe(`${HEAD + 1n}`);
}

describe("A103 (LG-12): retainStates 1,000 at cursor 5,000, on PGlite and on PostgreSQL", () => {
  let scenario: LedgerScenario;
  let backup: WindowBackup | undefined;
  let pglite: ProcessDatabase;

  beforeAll(async () => {
    await Promise.all(PROCESS_BACKENDS.map((backend) => backend.start()));
    scenario = await windowScenario();
  }, 180_000);
  afterAll(async () => {
    backup?.remove();
    await Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop()));
  }, 60_000);

  it("A103 on PGlite: synced from genesis (backed up at 4,990 and continued), the state at 4,000 loads at cursor 5,000 and 3,999 fails with state-not-retained", async () => {
    pglite = await (backends.get("pglite") as ProcessBackend).database();
    const before = retentionSeen();
    backup = await syncAndBackUp(pglite, scenario, before);
    expect(backup.manifest.height).toBe(`${BACKUP_AT}`);
    expect(before.loads.size).toBe(0);
    const seen = retentionSeen();
    const { status } = await continueToHead(pglite, scenario, seen);
    await a103(pglite, scenario, status, seen.loads.get(HEAD));
  }, PATIENCE_MS * 6);

  it("A103 on PostgreSQL: from the PGlite backup at 4,990 restored (BK-2, BK-4), the state at 4,000 loads at cursor 5,000 and 3,999 fails with state-not-retained", async () => {
    expect(backup, "the PGlite run's backup (the test before)").toBeDefined();
    const postgres = await (backends.get("postgres") as ProcessBackend).database();
    const seen = retentionSeen();
    const restored = await restoreOnPostgres(postgres, backup as WindowBackup, scenario, seen);
    expect(restored.manifest.height).toBe(`${BACKUP_AT}`);
    // The restored database is the backup's: the states of 0 to 4,990 stored, those of 3,990 to 4,990 held.
    const held = await postgres.query(
      "SELECT min(s.height)::text AS lo, max(s.height)::text AS hi, count(*)::text AS n FROM core_ledger_state.states s JOIN core_ledger_state.root_counts r ON r.node_key = s.state_key",
    );
    expect(held[0]).toEqual({ lo: "3990", hi: "4990", n: "1001" });
    const { status } = await continueToHead(postgres, scenario, seen);
    await a103(postgres, scenario, status, seen.loads.get(HEAD));
  }, PATIENCE_MS * 6);
});
