import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { writeBackup } from "../../src/backup/backup.js";
import { BACKUP_FORMAT } from "../../src/backup/manifest.js";
import { PGLITE_TOOLS_VERSION } from "../../src/backup/tools.js";
import { backupCommand, EXIT } from "../../src/cli/command.js";
import { commandCommittedHeight } from "../../src/cli/configured.js";
import { buildCoreVersion, UMBRADB_VERSION } from "../../src/config/build.js";
import { versionText } from "../../src/config/history.js";
import { openPostgres } from "../../src/db/postgres.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { TEST_GENESIS } from "../runner/process-build.js";
import { genesisHex, startPrivate, startPublicCore, TEST_LEDGER_TABLE } from "../private/builds.js";
import {
  BACKUP_BACKENDS,
  type BackupBackend,
  hashOf,
  TICKER_OPTED_OUT,
  heightsAt,
  manifestOf,
  startTicker,
  tableHeights,
  tickerModule,
  writeScript,
  writeTickerConfig,
} from "./backup-fixtures.js";

import type { DatabaseParts, PostgresParts } from "../../src/config/database-parts.js";

/**
 * A124 `[CI]` and A122 `[CI]` (task 15.1; BK-1, BK-2, PP-12; `design.md` §9.1; owner decisions Q83, Q85), on PostgreSQL
 * 18.6 and PGlite 0.5.10: a backup written while blocks commit — by the running process (`ProcessHandle.backup`) on both,
 * and by `umbradb backup` from beside it on PostgreSQL — holds every table at its manifest's height, and loaded into a
 * new database its contents hash equals the manifest's and that of an instance stopped at that height; `backupAtStop`
 * writes one backup for the core's stop, and none at a restart at the stop while one of that height is there; without
 * the tool the command fails with `backup-tools-missing`, naming what to install, and writes no file; a private
 * database is refused with `private-backup-refused` without the development opt-in, and backed up with it. The chain,
 * the build, the tools and the loading: `./backup-fixtures.ts`. The committed negative control (a dump outside the
 * manifest's snapshot) is `./backup.negative-control.test.ts`.
 */

/**
 * Each test waits on purpose for processes to reach heights and for databases to load (task 0.5's notes): its own
 * budget, for a loaded machine.
 */
const TEST_TIMEOUT_MS = 900_000;

/** The in-memory chain's head: far above the heights the tests back up, so blocks keep committing meanwhile. */
const HEAD = 600n;

const [POSTGRES, PGLITE] = BACKUP_BACKENDS as [BackupBackend, BackupBackend];

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-backups-"));
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.start()));
  // The process's own backups find pg_dump as the command does: here, the pinned image's (`./backup-fixtures.ts`).
  process.env.UMBRADB_PG_DUMP = POSTGRES.env().UMBRADB_PG_DUMP;
}, 300_000);

afterAll(async () => {
  delete process.env.UMBRADB_PG_DUMP;
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.stop()));
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

let outputs = 0;
/** A new backup file's path in the test's directory. */
const output = (name: string): string => join(dir, `${name}-${++outputs}.backup`);

/** `umbradb backup …` (`argv`, from `backup` on) in this process with `env`. */
async function backupRun(argv: readonly string[], env: Record<string, string>, seams = {}) {
  let stdout = "";
  let stderr = "";
  const code = await backupCommand(seams)(argv.slice(1), {
    cwd: project.dir,
    env,
    stdout: (text) => {
      stdout += text;
    },
    stderr: (text) => {
      stderr += text;
    },
  });
  return { code, stdout, stderr };
}

/** The code of the command's refusal line (`umbradb backup: <code>: <message>`). */
const codeIn = (stderr: string): string => stderr.slice("umbradb backup: ".length).split(":")[0] as string;

/** No file of the directory is a backup's temporary file: a refused or failed backup left nothing behind. */
function noPartialFiles(): void {
  expect(readdirSync(dir).filter((name) => name.endsWith(".partial"))).toEqual([]);
}

/** The `0x` hex of the in-memory chain's block at `height`. */
const blockHex = (height: bigint) => `0x${Buffer.from(inMemoryBlock(height).hash).toString("hex")}`;

/** The contents hash of a new instance of the ticker stopped at `height` on `backend`: the source at that height. */
async function hashStoppedAt(backend: BackupBackend, height: bigint): Promise<string> {
  const db = await backend.database();
  const ticker = await startTicker(writeTickerConfig(project, { database: db.setting, stop: Number(height) }), HEAD);
  try {
    expect(await ticker.handle.ended).toMatchObject({ kind: "stopped", height, core: true });
  } finally {
    await ticker.handle.stop();
  }
  return hashOf(db);
}

describe.each(BACKUP_BACKENDS)("backups on $name (BK-1, BK-2)", (backend) => {
  it(
    "A124: a backup written while blocks commit holds every table at its manifest's height: loaded, its contents " +
      "hash equals the manifest's and the source's at that height",
    async () => {
      const db = await backend.database();
      const ticker = await startTicker(writeTickerConfig(project, { database: db.setting }), 1n);
      const out = output(`${backend.kind}-while`);
      let before: bigint | null;
      let after: bigint | null;
      let manifest;
      try {
        await ticker.handle.started;
        ticker.feed(HEAD);
        await ticker.reach(40n);
        before = ticker.handle.status().cursor;
        ({ manifest } = await ticker.handle.backup(out));
        after = ticker.handle.status().cursor;
        // Blocks went on committing after the backup's snapshot.
        await ticker.reach(BigInt(manifest.height) + 5n);
      } finally {
        await ticker.handle.stop();
      }
      const height = BigInt(manifest.height);
      expect(height).toBeGreaterThanOrEqual(before as bigint);
      expect(after as bigint).toBeGreaterThanOrEqual(height);
      expect(manifestOf(out)).toEqual(manifest);
      expect(manifest).toMatchObject({
        format: BACKUP_FORMAT,
        genesisHash: TEST_GENESIS,
        start: "1",
        blockHash: blockHex(height),
        stateRoot: null,
        umbradb: UMBRADB_VERSION,
        postgres: "18.6",
        tool: { name: backend.kind === "postgres" ? "pg_dump" : "pglite-tools", version: "18.6" },
      });
      expect(manifest.history.map((row) => [row.id, row.start, row.version])).toEqual([
        ["core", "1", versionText(buildCoreVersion())],
        ["ticker", "1", "1.0.0"],
      ]);
      expect(manifest.migrations.some((row) => row.module === "ticker" && row.migration === "001")).toBe(true);
      const loaded = await backend.load(out);
      expect(await tableHeights(loaded)).toEqual(heightsAt(manifest.height));
      expect(await hashOf(loaded)).toBe(manifest.contentsHash);
      // The table declared deterministic: false travels with its rows and its sequence's position (BK-2). A sequence
      // is not transactional: PostgreSQL's pg_dump reads its position as it is when it reads it, not as of the
      // snapshot, so beside commits it can be ahead of the rows — never behind them, so a value is never given twice.
      // On PGlite nothing commits during the job.
      const [log] = await loaded.query(
        "SELECT (SELECT count(*) FROM ticker.log)::int AS n, last_value::int AS last, is_called FROM ticker.log_id_seq",
      );
      expect(log).toMatchObject({ n: Number(height), is_called: true });
      if (backend.kind === "pglite") expect(log?.last).toBe(Number(height));
      else expect(log?.last as number).toBeGreaterThanOrEqual(Number(height));
      expect(await hashStoppedAt(backend, height)).toBe(manifest.contentsHash);
      noPartialFiles();
    },
    TEST_TIMEOUT_MS,
  );

  it("A124: with backupAtStop set, the core's stop writes one backup for that height, and a restart at it none", async () => {
    const db = await backend.database();
    const out = output(`${backend.kind}-at-stop`);
    const config = writeTickerConfig(project, { database: db.setting, stop: 12, extra: { backupAtStop: out } });
    const first = await startTicker(config, 30n);
    try {
      expect(await first.handle.ended).toMatchObject({ kind: "stopped", height: 12n, core: true });
    } finally {
      await first.handle.stop();
    }
    const manifest = manifestOf(out);
    expect(manifest.height).toBe("12");
    expect(first.lines.some((line) => line.startsWith(`backup at stop written to ${out}: height 12`))).toBe(true);
    const bytes = readFileSync(out);
    const written = statSync(out).mtimeMs;

    // A restart with the cursor at the stop processes nothing, and a backup of that height is there: none is written.
    const second = await startTicker(config, 30n);
    try {
      expect(await second.handle.ended).toMatchObject({ kind: "stopped", height: 12n, core: true });
    } finally {
      await second.handle.stop();
    }
    expect(readFileSync(out).equals(bytes)).toBe(true);
    expect(statSync(out).mtimeMs).toBe(written);
    expect(second.lines).toContain(`backup at stop: ${out} holds a backup of height 12 already, so none was written`);

    // Without it, the restart at the stop writes it (CORE-ARCH §4.15).
    rmSync(out);
    const third = await startTicker(config, 30n);
    try {
      expect(await third.handle.ended).toMatchObject({ kind: "stopped", height: 12n, core: true });
    } finally {
      await third.handle.stop();
    }
    expect(manifestOf(out)).toMatchObject({ height: "12", contentsHash: manifest.contentsHash });
    const loaded = await backend.load(out);
    expect(await tableHeights(loaded)).toEqual(heightsAt("12"));
    expect(await hashOf(loaded)).toBe(manifest.contentsHash);

    // A backup of another height there is replaced once the new one is complete: the stop raised to 14.
    const raised = writeTickerConfig(project, { database: db.setting, stop: 14, extra: { backupAtStop: out } });
    const fifth = await startTicker(raised, 30n);
    try {
      expect(await fifth.handle.ended).toMatchObject({ kind: "stopped", height: 14n, core: true });
    } finally {
      await fifth.handle.stop();
    }
    expect(manifestOf(out).height).toBe("14");
    expect(await tableHeights(await backend.load(out))).toEqual(heightsAt("14"));

    // A file there that is no backup is left as it is; the failure is logged and the process stays stopped.
    writeFileSync(out, "the operator's own file\n");
    const fourth = await startTicker(raised, 30n);
    try {
      expect(await fourth.handle.ended).toMatchObject({ kind: "stopped", height: 14n, core: true });
      expect(fourth.handle.status().state).toBe("stopped");
    } finally {
      await fourth.handle.stop();
    }
    expect(readFileSync(out, "utf8")).toBe("the operator's own file\n");
    expect(fourth.lines.some((line) => line.startsWith("backup at stop failed (backup-format-unknown): "))).toBe(true);
    // A stopped process's handle backs up no more.
    await expect(fourth.handle.backup(output("after-stop"))).rejects.toMatchObject({ code: "handle-closed" });
    noPartialFiles();
  }, TEST_TIMEOUT_MS);

  it(
    "A124: without the tool (pg_dump 18, or pglite-tools), umbradb backup fails with backup-tools-missing, naming " +
      "what to install, and writes no file",
    async () => {
      const db = await backend.database();
      const config = writeTickerConfig(project, { database: db.setting, stop: 3 });
      const ticker = await startTicker(config, 5n);
      try {
        expect(await ticker.handle.ended).toMatchObject({ kind: "stopped", height: 3n });
      } finally {
        await ticker.handle.stop();
      }
      const out = output(`${backend.kind}-no-tool`);
      const refused = (result: { code: number; stdout: string; stderr: string }, ...names: string[]) => {
        expect(result.code).toBe(EXIT.failed);
        expect(result.stdout).toBe("");
        expect(result.stderr).toMatch(/^umbradb backup: /);
        expect(codeIn(result.stderr)).toBe("backup-tools-missing");
        for (const name of names) expect(result.stderr).toContain(name);
        expect(existsSync(out)).toBe(false);
        noPartialFiles();
      };
      if (backend.kind === "postgres") {
        const empty = mkdtempSync(join(dir, "no-tools-"));
        const old = writeScript(empty, "pg_dump-17", "#!/bin/sh\necho 'pg_dump (PostgreSQL) 17.9'\n");
        const args = ["backup", "--out", out, "--config", config];
        refused(await backupRun(args, { PATH: empty }), "no pg_dump is on PATH", "PostgreSQL 18 client");
        refused(
          await backupRun(args, { PATH: empty, UMBRADB_PG_DUMP: join(empty, "missing") }),
          "UMBRADB_PG_DUMP names could not be run",
          "postgresql-client-18",
        );
        refused(await backupRun(args, { PATH: empty, UMBRADB_PG_DUMP: old }), "is of PostgreSQL 17.9", "PostgreSQL 18");
        // The control: with the pinned image's pg_dump the same command writes the backup.
        const written = await backupRun(args, POSTGRES.env());
        expect(written.code).toBe(EXIT.ok);
        expect(manifestOf(out).height).toBe("3");
      } else {
        const missing = { pgliteTools: "@electric-sql/pglite-tools-not-installed/pg_dump" };
        refused(
          await backupRun(["backup", "--out", out, "--config", config], PGLITE.env(), missing),
          "@electric-sql/pglite-tools",
          `npm install @electric-sql/pglite-tools@${PGLITE_TOOLS_VERSION}`,
        );
        const written = await backupRun(["backup", "--out", out, "--config", config], PGLITE.env());
        expect(written.code).toBe(EXIT.ok);
        expect(written.stdout).toContain(`umbradb backup: wrote ${out}: height 3`);
        expect(manifestOf(out).tool).toEqual({ name: "pglite-tools", version: "18.6" });
      }
    },
    TEST_TIMEOUT_MS,
  );
});

describe("umbradb backup beside a running process", () => {
  it("A124: on PostgreSQL the command backs up while blocks commit, every table at its manifest's height", async () => {
    const db = await POSTGRES.database();
    const config = writeTickerConfig(project, { database: db.setting });
    const ticker = await startTicker(config, 1n);
    const out = output("postgres-command");
    let result;
    let after: bigint | null;
    try {
      ticker.feed(HEAD);
      await ticker.reach(40n);
      result = await backupRun(["backup", "--out", out, "--config", config], POSTGRES.env());
      after = ticker.handle.status().cursor;
      await ticker.reach(BigInt(manifestOf(out).height) + 5n);
    } finally {
      await ticker.handle.stop();
    }
    expect(result.stderr).toBe("");
    expect(result.code).toBe(EXIT.ok);
    const manifest = manifestOf(out);
    expect(result.stdout).toBe(
      `umbradb backup: wrote ${out}: height ${manifest.height}, contents hash ${manifest.contentsHash}, pg_dump 18.6\n`,
    );
    expect(result.stdout).not.toContain((db.setting as PostgresParts).password);
    expect(after as bigint).toBeGreaterThanOrEqual(BigInt(manifest.height));
    const loaded = await POSTGRES.load(out);
    expect(await tableHeights(loaded)).toEqual(heightsAt(manifest.height));
    expect(await hashOf(loaded)).toBe(manifest.contentsHash);
    expect(await hashStoppedAt(POSTGRES, BigInt(manifest.height))).toBe(manifest.contentsHash);
  }, TEST_TIMEOUT_MS);

  it("on PGlite the command is refused with writer-lock-held while the process holds the directory, and runs after", async () => {
    const db = await PGLITE.database();
    const config = writeTickerConfig(project, { database: db.setting });
    const ticker = await startTicker(config, 30n);
    const out = output("pglite-command");
    try {
      await ticker.reach(30n);
      const held = await backupRun(["backup", "--out", out, "--config", config], PGLITE.env());
      expect(held.code).toBe(EXIT.failed);
      expect(held.stderr).toMatch(/^umbradb backup: writer-lock-held: /);
      expect(existsSync(out)).toBe(false);
    } finally {
      await ticker.handle.stop();
    }
    const result = await backupRun(["backup", "--out", out, "--config", config], PGLITE.env());
    expect(result.code).toBe(EXIT.ok);
    const manifest = manifestOf(out);
    expect(manifest.height).toBe("30");
    expect(await hashOf(await PGLITE.load(out))).toBe(manifest.contentsHash);
  }, TEST_TIMEOUT_MS);
});

describe("pg_dump's command line and failures (BK-1)", () => {
  it("passes the database's parts to pg_dump in libpq's environment, the password in PGPASSWORD, never on its command line; a pg_dump that fails leaves no file", async () => {
    const db = await POSTGRES.database();
    const config = writeTickerConfig(project, { database: db.setting, stop: 3 });
    const ticker = await startTicker(config, 5n);
    try {
      expect(await ticker.handle.ended).toMatchObject({ kind: "stopped", height: 3n });
    } finally {
      await ticker.handle.stop();
    }
    const tools = mkdtempSync(join(dir, "fake-pg-dump-"));
    const log = join(tools, "log");
    const fake = writeScript(
      tools,
      "pg_dump",
      [
        "#!/bin/sh",
        'if [ "$1" = "--version" ]; then echo "pg_dump (PostgreSQL) 18.6"; exit 0; fi',
        `printf '%s\n' "$@" > ${log}.args`,
        `printf '%s' "$PGPASSWORD" > ${log}.password`,
        `printf '%s\n' "$PGHOST" "$PGPORT" "$PGUSER" "$PGDATABASE" "$PGSSLMODE" > ${log}.env`,
        'if [ -n "$FAKE_SILENT" ]; then exit 4; fi',
        'if [ -n "$FAKE_LOUD" ]; then head -c 100000 /dev/zero | tr "\\0" x >&2; exit 5; fi',
        'if [ -n "$FAKE_FAILS" ]; then echo "pg_dump: error: the dump failed" >&2; exit 3; fi',
        "echo '-- the dump'",
        "",
      ].join("\n"),
    );
    const out = output("fake");
    const parts = db.setting as PostgresParts;
    const password = parts.password ?? "";
    expect(password).not.toBe("");
    const written = await backupRun(["backup", "--out", out, "--config", config], { PATH: String(process.env.PATH), UMBRADB_PG_DUMP: fake });
    expect(written.code).toBe(EXIT.ok);
    const args = readFileSync(`${log}.args`, "utf8");
    // No connection on the command line (the tests' login is `test`, its password `test`): libpq's environment has it.
    expect(args).not.toContain(password);
    expect(args).toMatch(/^--format=plain\n--inserts\n--no-owner\n--no-privileges\n--snapshot=\S+\n$/);
    expect(readFileSync(`${log}.password`, "utf8")).toBe(password);
    expect(readFileSync(`${log}.env`, "utf8")).toBe(
      `${parts.host}\n${parts.port}\n${parts.user}\n${parts.name}\n${parts.ssl}\n`,
    );
    expect(readFileSync(out, "utf8").split("\n").slice(1, 2)).toEqual(["-- the dump"]);

    // A failed backup over an earlier one leaves the earlier file as it was.
    const earlier = readFileSync(out);
    const over = await backupRun(["backup", "--out", out, "--config", config], {
      PATH: String(process.env.PATH),
      UMBRADB_PG_DUMP: fake,
      FAKE_FAILS: "1",
    });
    expect(over.code).toBe(EXIT.failed);
    expect(readFileSync(out).equals(earlier)).toBe(true);

    const failed = output("fake-failed");
    const env = { PATH: String(process.env.PATH), UMBRADB_PG_DUMP: fake, FAKE_FAILS: "1" };
    const refused = await backupRun(["backup", "--out", failed, "--config", config], env);
    expect(refused.code).toBe(EXIT.failed);
    expect(refused.stderr).toContain("database-error: pg_dump 18.6 failed (exit status 3): pg_dump: error: the dump failed");
    const silent = await backupRun(["backup", "--out", failed, "--config", config], { ...env, FAKE_SILENT: "1" });
    expect(silent.stderr).toContain("pg_dump 18.6 failed (exit status 4): no message");
    const loud = await backupRun(["backup", "--out", failed, "--config", config], { ...env, FAKE_LOUD: "1" });
    expect(loud.stderr).toContain("pg_dump 18.6 failed (exit status 5): xxx");
    expect(loud.stderr.length).toBeLessThan(140_000);
    expect(existsSync(failed)).toBe(false);
    noPartialFiles();

    // Parts without a password: nothing in PGPASSWORD, also when the environment has one; an unset variable of the
    // environment is not passed on, and libpq's connection variables of the environment give way to the parts.
    const { kind: _kind, password: _password, ...plain } = parts;
    const opened = openPostgres({ connection: { ...plain, password }, committedHeight: commandCommittedHeight, readConnections: 1 });
    try {
      await writeBackup({
        db: opened,
        target: { backend: "postgres", connection: plain },
        out: output("no-password"),
        optedOut: TICKER_OPTED_OUT,
        developmentOptIn: true,
        env: {
          PATH: String(process.env.PATH),
          UMBRADB_PG_DUMP: fake,
          UNSET: undefined,
          PGPASSWORD: "from-the-environment",
          PGHOST: "elsewhere.example",
          PGSSLMODE: "verify-ca",
        },
      });
    } finally {
      await opened.close();
    }
    expect(readFileSync(`${log}.password`, "utf8")).toBe("");
    expect(readFileSync(`${log}.env`, "utf8")).toBe(`${parts.host}\n${parts.port}\n${parts.user}\n${parts.name}\ndisable\n`);
  }, TEST_TIMEOUT_MS);
});

/** A private process's configuration file for the command: its `core` entry only, with or without the opt-in. */
function privateConfig(database: DatabaseParts, developmentOptIn: boolean): string {
  const core = JSON.stringify({
    network: "custom",
    genesisHash: genesisHex(0xa1),
    ledgerTable: TEST_LEDGER_TABLE,
    database,
    instanceId: "instance-1",
    developmentOptIn,
  });
  outputs += 1;
  return project.write(
    `private-${outputs}.config.ts`,
    [
      `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
      `export default defineConfig({ entries: [coreEntry({ start: 1, config: ${core} })] });`,
      "",
    ].join("\n"),
  );
}

describe("PP-12: a private database is not backed up by UmbraDB without the development opt-in", () => {
  it(
    "A122: umbradb backup of a private database refuses with private-backup-refused without the development " +
      "opt-in, and writes no file",
    async () => {
      const publicDb = await POSTGRES.database();
      const privateDb = await POSTGRES.database();
      const core = await startPublicCore({ database: publicDb.setting, head: 5n });
      let privateProcess;
      const out = output("private");
      try {
        privateProcess = await startPrivate({ database: privateDb.setting, direct: () => core.db() });
        await privateProcess.reach(5n);
        const env = POSTGRES.env();

        // The file is a private process's, without the opt-in: refused before anything is opened.
        const bySide = await backupRun(["backup", "--out", out, "--config", privateConfig(privateDb.setting, false)], env);
        expect(bySide.code).toBe(EXIT.failed);
        expect(bySide.stderr).toMatch(/^umbradb backup: private-backup-refused: /);
        expect(bySide.stderr).toContain("nothing was opened");
        expect(existsSync(out)).toBe(false);

        // A public process's file on that database: the database's own private cursor tells, and it is refused.
        const publicFile = writeTickerConfig(project, { database: privateDb.setting, extra: { developmentOptIn: false } });
        const byDatabase = await backupRun(["backup", "--out", out, "--config", publicFile], env);
        expect(byDatabase.code).toBe(EXIT.failed);
        expect(byDatabase.stderr).toMatch(/^umbradb backup: private-backup-refused: /);
        expect(existsSync(out)).toBe(false);

        // A host program's backup of it, without the opt-in, alike.
        const { kind: _private, ...privateConnection } = privateDb.setting as PostgresParts;
        const db = openPostgres({ connection: privateConnection, committedHeight: commandCommittedHeight, readConnections: 1 });
        try {
          const target = { backend: "postgres" as const, connection: privateConnection };
          for (const side of ["private", "public"] as const) {
            const error = await writeBackup({ db, target, out, optedOut: [], side, developmentOptIn: false, env }).then(
              () => null,
              (caught: unknown) => caught,
            );
            expect(error).toMatchObject({ code: "private-backup-refused" });
          }
        } finally {
          await db.close();
        }
        // A private process's own side refuses on any database, before it is read: here the public one.
        const { kind: _public, ...publicConnection } = publicDb.setting as PostgresParts;
        const publicTarget = { backend: "postgres" as const, connection: publicConnection };
        const publicOpened = openPostgres({ connection: publicConnection, committedHeight: commandCommittedHeight });
        try {
          await expect(
            writeBackup({ db: publicOpened, target: publicTarget, out, optedOut: [], side: "private", developmentOptIn: false, env }),
          ).rejects.toMatchObject({ code: "private-backup-refused" });
        } finally {
          await publicOpened.close();
        }
        expect(existsSync(out)).toBe(false);
        noPartialFiles();

        // With the opt-in it is backed up: by the command, and by the private process itself (its revision has it).
        const allowed = await backupRun(["backup", "--out", out, "--config", privateConfig(privateDb.setting, true)], env);
        expect(allowed.code).toBe(EXIT.ok);
        expect(manifestOf(out)).toMatchObject({ height: "5", start: "1" });
        const own = output("private-own");
        const { manifest } = await privateProcess.handle.backup(own);
        expect(manifest.height).toBe("5");
        expect(manifest.contentsHash).toBe(manifestOf(out).contentsHash);
      } finally {
        await privateProcess?.stop();
        await core.stop();
      }
    },
    TEST_TIMEOUT_MS,
  );
});
