import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { hex } from "../backbone/fetch-fixtures.js";
import { BACKUP_BACKENDS, type BackupBackend, killedRestore, tickerModule } from "./backup-fixtures.js";
import { backupAt, chain, codeIn, emptied, restoreRun, restoreTarget } from "./restore-fixtures.js";
import { disagreeingNode, ledgerBackup, ledgerChain, restoreLedger } from "./restore-ledger.js";

/**
 * The committed negative controls of the restore, on PostgreSQL 18.6 and PGlite 0.5.10. Each is the restore with one of
 * its guarantees taken away (`RestoreSeams`), which is what the refusal and killed-restore tests would see without it:
 * - without the state root's check, a backup whose stored root is not the node's commits;
 * - with the file's statements each committed on their own, a restore killed while loading leaves a partial database,
 *   into which a new restore is refused (`restore-target-not-empty`).
 */

const TEST_TIMEOUT_MS = 900_000;
const H = 12n;
const HEAD = 40n;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-restore-controls-"));
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.start()));
  process.env.UMBRADB_PG_DUMP = (BACKUP_BACKENDS[0] as BackupBackend).env().UMBRADB_PG_DUMP;
}, 300_000);

afterAll(async () => {
  delete process.env.UMBRADB_PG_DUMP;
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.stop()));
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

describe.each(BACKUP_BACKENDS)("the restore's negative controls on $name", (backend) => {
  it("a restore that skips the state root's check commits a backup whose root is not the node's", async () => {
    const scenario = await ledgerChain();
    const backup = await ledgerBackup(await backend.database(), scenario);
    const target = await backend.database();
    const restored = await restoreLedger(backend, target, backup, disagreeingNode(scenario), { skip: { stateRoot: true } });
    const root = scenario.heights[Number(scenario.head)]?.root as Uint8Array;
    expect(restored.manifest.stateRoot).toBe(hex(root));
    const [stored] = await target.query(`SELECT encode(state_root, 'hex') AS root FROM core_ledger_state.states WHERE height = ${scenario.head}`);
    expect(`0x${stored?.root as string}`).toBe(hex(root));
  }, TEST_TIMEOUT_MS);

  it("a restore whose statements commit one by one, killed while loading, leaves a partial database", async () => {
    const { file } = await backupAt(project, backend, H, join(dir, `${backend.kind}-kill.backup`));
    const { db, config } = await restoreTarget(project, backend);
    const job = { file, config, cwd: project.dir, head: Number(HEAD), killAt: 20, statementByStatement: true };
    const killed = await killedRestore(job);
    expect(killed.signal).toBe("SIGKILL");
    expect(await emptied(backend, db)).toBe(false);
    const again = await restoreRun(project, file, config, chain(HEAD));
    expect(codeIn(again.stderr)).toBe("restore-target-not-empty");
  }, TEST_TIMEOUT_MS);
});
