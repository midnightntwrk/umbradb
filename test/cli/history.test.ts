import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { BACKUP_FORMAT, type Manifest, manifestLine } from "../../src/backup/manifest.js";
import { EXIT } from "../../src/cli/command.js";
import { historyExportArguments, runHistoryExport, writeHistoryFile } from "../../src/cli/history.js";
import { runRestore } from "../../src/cli/restore.js";
import { historyFileText, parseHistoryFile, type RecordedHistory } from "../../src/config/recorded-history.js";
import type { UmbraError } from "../../src/db/errors.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { startTicker, tickerModule, writeTickerConfig } from "../backup/backup-fixtures.js";
import { type CliProject, cliProject, inProcess } from "./cli-fixtures.js";

/** `umbradb history export`, and a restore's history file. */

let dir: string;
let project: CliProject;
let files = 0;

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), "umbradb-history-"));
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
  project?.remove();
});

/** A new history file name next to the configurations. */
const historyName = () => `history-${++files}.json`;

/** `umbradb history export --config <config>`, in the project's directory. */
const exported = (config: string, extra: readonly string[] = []) =>
  inProcess(["history", "export", "--config", config, ...extra], project.dir);

/** Runs the ticker of `config` until its core stops at `stop`. */
async function runUntilStopped(config: string, stop: bigint): Promise<void> {
  const ticker = await startTicker(config, stop + 5n);
  try {
    expect(await ticker.handle.ended).toMatchObject({ kind: "stopped", height: stop });
  } finally {
    await ticker.handle.stop();
  }
}

describe("umbradb history export", () => {
  it("writes the database's history; the configuration then needs only what it runs now", async () => {
    const database = { kind: "pglite", path: join(dir, "export-db") } as const;
    const history = historyName();
    await runUntilStopped(writeTickerConfig(project, { database, stop: 5, history }), 5n);

    const first = await exported(writeTickerConfig(project, { database, history }));
    expect(first).toMatchObject({ code: EXIT.ok, stderr: "" });
    expect(first.stdout).toMatch(/^umbradb history export: wrote .*: height 5, 2 revisions\n$/);
    const written = parseHistoryFile(readFileSync(join(project.dir, history), "utf8"), history);
    expect(written.height).toBe("5");
    expect(written.revisions.map((r) => [r.id, r.start])).toEqual([["core", "1"], ["ticker", "1"]]);

    // The same configuration starts again from the file.
    await runUntilStopped(writeTickerConfig(project, { database, stop: 8, history }), 8n);

    // Exported again, a configuration without ticker stops it at the exported height.
    expect(await exported(writeTickerConfig(project, { database, history }))).toMatchObject({ code: EXIT.ok });
    const dropped = writeTickerConfig(project, { database, stop: 10, history, entry: null });
    await runUntilStopped(dropped, 10n);

    // --out, relative to the working directory, takes the place of the configuration's file.
    expect(await exported(dropped, ["--out", "dropped.json"])).toMatchObject({ code: EXIT.ok });
    const after = parseHistoryFile(readFileSync(join(project.dir, "dropped.json"), "utf8"), "dropped.json");
    expect(after.height).toBe("10");
    expect(after.revisions.find((r) => r.id === "ticker")).toMatchObject({ start: "1", stop: "8" });

    const failed = await exported(dropped, ["--out", join("missing", "h.json")]);
    expect(failed).toMatchObject({ code: EXIT.failed, stdout: "" });
    expect(failed.stderr).toMatch(/^umbradb history export: failed: .*ENOENT/);
  });

  it("takes --out and --config once each, and nothing else", () => {
    expect(historyExportArguments([])).toEqual({});
    expect(historyExportArguments(["--out", "h.json", "--config", "c.ts"])).toEqual({ out: "h.json", config: "c.ts" });
    expect(historyExportArguments(["h.json"])).toMatch(/takes no file/);
    expect(historyExportArguments(["--out", "a", "--out", "b"])).toMatch(/--out once/);
    expect(historyExportArguments(["--out="])).toMatch(/--out takes a value/);
    expect(historyExportArguments(["--force"])).toMatch(/unknown option --force/);
  });

  it("refuses a configuration that names no history file without --out, and a database with nothing committed", async () => {
    const database = { kind: "pglite", path: join(dir, "absent-db") } as const;
    const unnamed = await runHistoryExport({ config: writeTickerConfig(project, { database }), cwd: project.dir });
    expect(unnamed).toMatchObject({ written: false, error: { code: "invalid-configuration", details: { reason: "no-history-file" } } });
    const absent = await runHistoryExport({ config: writeTickerConfig(project, { database, history: historyName() }), cwd: project.dir });
    expect(absent).toMatchObject({ written: false, error: { code: "no-committed-height" } });
    expect(existsSync(database.path)).toBe(false);
  });

  it("writes a file whole, leaving nothing behind when it cannot", async () => {
    const history: RecordedHistory = { height: "3", revisions: [] };
    const file = join(dir, "whole.json");
    await writeHistoryFile(file, history);
    expect(readFileSync(file, "utf8")).toBe(historyFileText(history));
    await expect(writeHistoryFile(join(dir, "missing", "h.json"), history)).rejects.toThrow();
    expect(readdirSync(dir).filter((name) => name.endsWith(".partial"))).toEqual([]);
  });
});

describe("a restore's history file", () => {
  it("is refused when the file the configuration names holds another history, unless --overwrite-history", async () => {
    const hash = `0x${"ab".repeat(32)}`;
    const manifest: Manifest = {
      format: BACKUP_FORMAT,
      genesisHash: hash,
      start: "1",
      height: "12",
      blockHash: hash,
      stateRoot: null,
      history: [],
      migrations: [],
      contentsHash: hash,
      umbradb: "0.10.0",
      postgres: "18.6",
      tool: { name: "pg_dump", version: "18.6" },
    };
    const backup = join(dir, "other.backup");
    writeFileSync(backup, manifestLine(manifest));
    const history = historyName();
    writeFileSync(join(project.dir, history), historyFileText({ height: "7", revisions: [] }));
    const database = { kind: "pglite", path: join(dir, "restore-db") } as const;
    const outcome = await runRestore({ file: backup, config: writeTickerConfig(project, { database, history }), cwd: project.dir });
    expect(outcome).toMatchObject({
      restored: false,
      error: { code: "backup-history-mismatch", details: { reason: "history-file-differs" } },
    });
    expect(parseHistoryFile(readFileSync(join(project.dir, history), "utf8"), history).height).toBe("7");

    // --overwrite-history lets the restore go on; this one fails a later check, so the file is still left as it was.
    const overwriting = await runRestore(
      { file: backup, config: writeTickerConfig(project, { database, history }), cwd: project.dir, overwriteHistory: true },
      { source: () => new InMemoryBlockSource({ head: 20n }) },
    );
    expect(overwriting).toMatchObject({ restored: false });
    expect((overwriting as { error: UmbraError }).error.details?.reason).not.toBe("history-file-differs");
    expect(parseHistoryFile(readFileSync(join(project.dir, history), "utf8"), history).height).toBe("7");
  });
});
