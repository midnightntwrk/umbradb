import { existsSync } from "node:fs";
import { join } from "node:path";
import { isEmptyDatabase } from "../../src/backup/restore.js";
import { restoreCommand } from "../../src/cli/command.js";
import type { RestoreCommandSeams } from "../../src/cli/restore.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { CliProject } from "../cli/cli-fixtures.js";
import { type BackupBackend, type BackupDatabase, startTicker, writeTickerConfig } from "./backup-fixtures.js";

/**
 * What the restores' tests share (task 15.2; BK-3, BK-4): a backup of a ticker database written by its stop
 * (`backupAtStop`), `umbradb restore` run in this process with the chain an in-memory one standing in for the node
 * (`RestoreCommandSeams.source`), a new target with its configuration file, and BK-3's "empty".
 */

/** The chain the restores check against: the in-memory chain up to `head`, with `blocks` in place of its own. */
export function chain(head: bigint, blocks: readonly BlockRef[] = []): RestoreCommandSeams {
  return { source: () => new InMemoryBlockSource({ head, blocks }) };
}

/** A backup of a ticker database on `backend` at `height`, written by its stop into `file`; its source database. */
export async function backupAt(
  project: CliProject,
  backend: BackupBackend,
  height: bigint,
  file: string,
): Promise<{ readonly file: string; readonly source: BackupDatabase }> {
  const source = await backend.database();
  const config = writeTickerConfig(project, { database: source.setting, stop: Number(height), extra: { backupAtStop: file } });
  const ticker = await startTicker(config, height + 5n);
  try {
    const end = await ticker.handle.ended;
    if (end.kind !== "stopped" || end.height !== height) throw new Error(`the backup's process ended ${JSON.stringify(end, (_k, v) => (typeof v === "bigint" ? `${v}` : v))}`);
  } finally {
    await ticker.handle.stop();
  }
  return { file, source };
}

/** `umbradb restore <file> --config <config>` in this process (in `project`), with `seams`. */
export async function restoreRun(project: CliProject, file: string, config: string, seams: RestoreCommandSeams) {
  let stdout = "";
  let stderr = "";
  const code = await restoreCommand(seams)([file, "--config", config], {
    cwd: project.dir,
    stdout: (text) => {
      stdout += text;
    },
    stderr: (text) => {
      stderr += text;
    },
  });
  return { code, stdout, stderr };
}

/** The code of the command's refusal line (`umbradb restore: <code>: <message>`). */
export const codeIn = (stderr: string): string => stderr.slice("umbradb restore: ".length).split(":")[0] as string;

/** A new database on `backend` with nothing in it, and its configuration file (the ticker's, as the backups'). */
export async function restoreTarget(
  project: CliProject,
  backend: BackupBackend,
  options: Partial<Parameters<typeof writeTickerConfig>[1]> = {},
): Promise<{ readonly db: BackupDatabase; readonly config: string }> {
  const db = await backend.database();
  return { db, config: writeTickerConfig(project, { database: db.setting, ...options }) };
}

/** Whether `db` holds nothing (BK-3's empty target); a PGlite directory not created yet is empty too. */
export async function emptied(backend: BackupBackend, db: BackupDatabase): Promise<boolean> {
  if (backend.kind === "pglite" && !existsSync(join(db.setting.slice("pglite:".length), "PG_VERSION"))) return true;
  return db.read((read) => isEmptyDatabase(read), async () => null);
}
