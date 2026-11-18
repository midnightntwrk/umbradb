import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { loaded, retentionSeen } from "./ledger-storage-checks.js";
import type { LedgerScenario } from "./ledger-tapes.js";
import { BACKUP_AT, continueToHead, HEAD, restoreOnPostgres, syncAndBackUp, type WindowBackup, windowScenario } from "./ledger-window.js";

/**
 * With `retainStates` 100 at cursor 500, loading the state at 400 succeeds and 399 fails with `state-not-retained`.
 * Checked on PGlite 0.5.10 and PostgreSQL 18, through the real process.
 *
 * The blocks run once, on PGlite, to 490, where the process backs up. PGlite then continues to 501. PostgreSQL
 * continues from that backup, restored, so it processes only the last 11 blocks (it is several times slower per block)
 * and also shows that a backup restores on the other backend and continues like a database that never stopped.
 *
 * The window does not depend on the backend: each block's releases are computed from the configuration
 * (`src/backbone/core-ledger-state/retention.ts`). What does depend on it is checked here on both: the released states'
 * root counts, and a retained state's load through the node-store bridge. The window's revisions test
 * (`ledger-storage.ts`) checks the same on both from genesis. The committed negative control (a window one state
 * short) is in `ledger-storage.negative-control.ts`.
 */

const backends = new Map(PROCESS_BACKENDS.map((backend) => [backend.kind, backend])) as Map<"postgres" | "pglite", ProcessBackend>;

/**
 * The window checks on `db` after the run reached 501 (the loads its watcher made at 501's `on-compute`).
 */
async function a103(db: ProcessDatabase, scenario: LedgerScenario, status: { cursor: bigint | null; reason: unknown }, loads: readonly string[] | undefined): Promise<void> {
  expect(status).toMatchObject({ cursor: HEAD, reason: null });
  expect(loads).toEqual([loaded(scenario, 400n), "399 state-not-retained", loaded(scenario, 500n), "501 state-not-retained", "0 state-not-retained"]);
  // After 501: the states of 401 to 501 held, each once.
  const counts = await db.query(
    "SELECT min(s.height)::text AS lo, max(s.height)::text AS hi, count(*)::text AS n, max(r.count)::text AS c FROM core_ledger_state.states s JOIN core_ledger_state.root_counts r ON r.node_key = s.state_key",
  );
  expect(counts[0]).toEqual({ lo: "401", hi: "501", n: "101", c: "1" });
  expect((await db.query("SELECT count(*)::text AS n FROM core_ledger_state.root_counts"))[0]?.n).toBe("101");
  expect((await db.query("SELECT count(*)::text AS n FROM core_ledger_state.states"))[0]?.n).toBe(`${HEAD + 1n}`);
}

describe("retainStates 100 at cursor 500, on PGlite and on PostgreSQL", () => {
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

  it("on PGlite: synced from genesis (backed up at 490 and continued), the state at 400 loads at cursor 500 and 399 fails with state-not-retained", async () => {
    pglite = await (backends.get("pglite") as ProcessBackend).database();
    const before = retentionSeen();
    backup = await syncAndBackUp(pglite, scenario, before);
    expect(backup.manifest.height).toBe(`${BACKUP_AT}`);
    expect(before.loads.size).toBe(0);
    const seen = retentionSeen();
    const { status } = await continueToHead(pglite, scenario, seen);
    await a103(pglite, scenario, status, seen.loads.get(HEAD));
  }, PATIENCE_MS * 6);

  it("on PostgreSQL: from the PGlite backup at 490 restored, the state at 400 loads at cursor 500 and 399 fails with state-not-retained", async () => {
    expect(backup, "the PGlite run's backup (the test before)").toBeDefined();
    const postgres = await (backends.get("postgres") as ProcessBackend).database();
    const seen = retentionSeen();
    const restored = await restoreOnPostgres(postgres, backup as WindowBackup, scenario, seen);
    expect(restored.manifest.height).toBe(`${BACKUP_AT}`);
    // The restored database is the backup's: the states of 0 to 490 stored, those of 390 to 490 held.
    const held = await postgres.query(
      "SELECT min(s.height)::text AS lo, max(s.height)::text AS hi, count(*)::text AS n FROM core_ledger_state.states s JOIN core_ledger_state.root_counts r ON r.node_key = s.state_key",
    );
    expect(held[0]).toEqual({ lo: "390", hi: "490", n: "101" });
    const { status } = await continueToHead(postgres, scenario, seen);
    await a103(postgres, scenario, status, seen.loads.get(HEAD));
  }, PATIENCE_MS * 6);
});
