import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EXIT } from "../../src/cli/command.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { hex } from "../backbone/fetch-fixtures.js";
import { BACKUP_BACKENDS, type BackupBackend, hashOf, killedRestore, manifestOf, tickerModule } from "./backup-fixtures.js";
import { backupAt, chain, codeIn, emptied, restoreRun, restoreTarget } from "./restore-fixtures.js";
import { disagreeingNode, ledgerBackup, ledgerChain, restoreLedger } from "./restore-ledger.js";

/**
 * The committed negative controls of task 15.2's restore (BK-3; A126, A127), on PostgreSQL 18.6 and PGlite 0.5.10, each
 * the restore with one of its guarantees taken away (`RestoreSeams`) — what A126's and A127's tests would see without it:
 * - without the contents hash's check, a backup with a changed value in a row the hash covers commits, its contents
 *   hash not the manifest's;
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
  it("a restore that skips the contents hash's check commits a tampered backup", async () => {
    const { file } = await backupAt(project, backend, H, join(dir, `${backend.kind}-hash.backup`));
    const total = (H * (H + 1n)) / 2n;
    const text = readFileSync(file, "utf8");
    const tampered = join(dir, `${backend.kind}-tampered.backup`);
    writeFileSync(tampered, text.replace(`(1, ${H}, ${total});`, `(1, ${H}, ${total + 1n});`));
    const guarded = await restoreTarget(project, backend);
    const refused = await restoreRun(project, tampered, guarded.config, chain(HEAD));
    expect(codeIn(refused.stderr)).toBe("contents-hash-mismatch");
    expect(await emptied(backend, guarded.db)).toBe(true);
    const { db, config } = await restoreTarget(project, backend);
    const result = await restoreRun(project, tampered, config, { ...chain(HEAD), restore: { skip: { contentsHash: true } } });
    expect(result.code).toBe(EXIT.ok);
    expect(await hashOf(db)).not.toBe(manifestOf(file).contentsHash);
    const [tally] = await db.query("SELECT total::text AS total FROM ticker.tally");
    expect(tally?.total).toBe(String(total + 1n));
  }, TEST_TIMEOUT_MS);

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
