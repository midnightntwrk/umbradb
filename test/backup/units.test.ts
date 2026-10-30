import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { backupAtStop, firstLine, writeBackup } from "../../src/backup/backup.js";
import { readBackupFacts } from "../../src/backup/facts.js";
import { pgliteBackupText } from "../../src/backup/pglite-backup.js";
import { dumpLines, isEmptyDatabase } from "../../src/backup/restore.js";
import { runRestore } from "../../src/cli/restore.js";
import { BACKUP_FORMAT, type Manifest, MANIFEST_PREFIX, manifestLine, readManifestLine } from "../../src/backup/manifest.js";
import { findPgDump, loadPgliteDump, pgDumpVersion } from "../../src/backup/tools.js";
import { backupArguments, runBackup } from "../../src/cli/backup.js";
import { openPglite } from "../../src/db/pglite.js";
import { openPostgres } from "../../src/db/postgres.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { coreSettings } from "../runner/process-build.js";
import { writeScript } from "./backup-fixtures.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";

/**
 * The parts of the backup that need no running process (`src/backup/`, `src/cli/backup.ts`): the manifest's line and
 * its reading, `pg_dump`'s version, the command's arguments and its refusals before a database is read, a backup of a
 * database with nothing committed, and the backup at stop's refusal to overwrite a file that is no backup. [BK-1, BK-2]
 */

const HASH = `0x${"ab".repeat(32)}`;

/** A manifest every check accepts. */
const MANIFEST: Manifest = {
  format: BACKUP_FORMAT,
  genesisHash: HASH,
  start: "1",
  height: "12",
  blockHash: HASH,
  stateRoot: null,
  history: [
    {
      id: "ticker",
      start: "1",
      stop: null,
      version: "1.0.0",
      data: { big: 9_007_199_254_740_993n, small: 3 } as never,
      dataHash: HASH,
      provides: ["ticker-rows"],
    },
  ],
  migrations: [{ module: "ticker", migration: "001", checksum: "cd".repeat(32), position: 1 }],
  contentsHash: HASH,
  umbradb: "0.9.5",
  postgres: "18.6",
  tool: { name: "pg_dump", version: "18.6" },
};

let dir: string;
let project: CliProject;

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), "umbradb-backup-units-"));
  project = await cliProject();
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
  project?.remove();
});

describe("the manifest's line (BK-2)", () => {
  it("is one SQL comment line of JSON, read back as written, an integer beyond 2^53 exactly", () => {
    const line = manifestLine(MANIFEST);
    expect(line.startsWith(MANIFEST_PREFIX)).toBe(true);
    expect(line.endsWith("\n")).toBe(true);
    expect(line.indexOf("\n")).toBe(line.length - 1);
    expect(line).toContain('"big":9007199254740993');
    const read = readManifestLine(line.slice(0, -1));
    expect(read).toEqual(MANIFEST);
    expect((read.history[0]?.data as Record<string, unknown>).big).toBe(9_007_199_254_740_993n);
  });

  it.each([
    ["no manifest line", "SET statement_timeout = 0;", "first line is not"],
    ["no JSON", `${MANIFEST_PREFIX}{`, "not JSON"],
    ["no object", `${MANIFEST_PREFIX}[1]`, "not a JSON object"],
    ["another format", `${MANIFEST_PREFIX}${JSON.stringify({ ...MANIFEST, format: 2, history: [] })}`, "format is 2"],
    ["no format", `${MANIFEST_PREFIX}{}`, "format is null"],
  ])("refuses a file with %s: backup-format-unknown", (_name, line, why) => {
    expect(() => readManifestLine(line)).toThrow(expect.objectContaining({ code: "backup-format-unknown" }));
    expect(() => readManifestLine(line)).toThrow(why);
  });

  it("refuses a manifest whose fields are missing or malformed, naming each", () => {
    const fields = {
      ...MANIFEST,
      history: [{ id: "x" }],
      genesisHash: "0x12",
      start: "01",
      height: -1,
      blockHash: null,
      stateRoot: "ab",
      migrations: [{ module: "m", migration: "1", checksum: "zz", position: 0 }],
      contentsHash: 1,
      umbradb: null,
      postgres: 18,
      tool: { name: "psql", version: "18" },
    };
    let error: unknown;
    try {
      readManifestLine(`${MANIFEST_PREFIX}${JSON.stringify(fields)}`);
    } catch (caught) {
      error = caught;
    }
    expect(error).toMatchObject({ code: "backup-format-unknown" });
    expect((error as { details: { fields: string[] } }).details.fields).toEqual([
      "genesisHash",
      "start",
      "height",
      "blockHash",
      "stateRoot",
      "contentsHash",
      "umbradb",
      "postgres",
      "tool",
      "history",
      "migrations",
    ]);
  });

  it("reads a file's first line however long it is, and a file without a line end whole", async () => {
    const long = `${MANIFEST_PREFIX}${"x".repeat(200_000)}`;
    writeFileSync(join(dir, "long"), `${long}\nSELECT 1;\n`);
    expect(await firstLine(join(dir, "long"))).toBe(long);
    writeFileSync(join(dir, "one"), "no line end");
    expect(await firstLine(join(dir, "one"))).toBe("no line end");
  });
});

describe("the tools (BK-1, Q85)", () => {
  it("reads pg_dump's version from what --version prints", () => {
    expect(pgDumpVersion("pg_dump (PostgreSQL) 18.6\n")).toEqual({ major: 18, version: "18.6" });
    expect(pgDumpVersion("pg_dump (PostgreSQL) 18.6 (Debian 18.6-1.pgdg120+1)")).toEqual({ major: 18, version: "18.6" });
    expect(pgDumpVersion("pg_dump (PostgreSQL) 19devel")).toEqual({ major: 19, version: "19" });
    expect(pgDumpVersion("something else")).toBeNull();
  });

  it("refuses a pg_dump that prints no version, and one found on PATH of another major version", async () => {
    const tools = mkdtempSync(join(dir, "tools-"));
    const silent = writeScript(tools, "silent", "#!/bin/sh\necho hello\n");
    await expect(findPgDump({ UMBRADB_PG_DUMP: silent })).rejects.toThrow("printed no PostgreSQL version");
    writeScript(tools, "pg_dump", "#!/bin/sh\necho 'pg_dump (PostgreSQL) 19.0'\n");
    await expect(findPgDump({ PATH: `${join(dir, "none")}:${tools}` })).rejects.toMatchObject({
      code: "backup-tools-missing",
      details: { tool: "pg_dump", found: "PATH", version: "19.0" },
    });
    writeScript(tools, "pg_dump", "#!/bin/sh\necho 'pg_dump (PostgreSQL) 18.2'\n");
    // An empty PATH entry and a directory named pg_dump are passed over.
    const shadow = mkdtempSync(join(dir, "shadow-"));
    mkdirSync(join(shadow, "pg_dump"));
    await expect(findPgDump({ PATH: `:${shadow}:${tools}` })).resolves.toEqual({ path: join(tools, "pg_dump"), version: "18.2" });
    await expect(findPgDump({})).rejects.toThrow("no pg_dump is on PATH");
  });

  it("refuses a pglite-tools module without pgDump", async () => {
    await expect(loadPgliteDump("node:path")).rejects.toMatchObject({ code: "backup-tools-missing" });
    await expect(loadPgliteDump()).resolves.toBeTypeOf("function");
  });
});

describe("umbradb backup's arguments and its refusals before a database is read (BK-1)", () => {
  it.each([
    [["x"], "backup takes no file of its own"],
    [["--out"], "--out takes a value: the backup file to write"],
    [["--out", ""], "--out takes a value: the backup file to write"],
    [[], "backup takes --out once"],
    [["--out", "a", "--out", "b"], "backup takes --out once"],
    [["--out", "a", "--config", "c", "--config", "d"], "backup takes --config once"],
    [["--out", "a", "--config", ""], "--config takes a value: the configuration file"],
    [["--out", "a", "--confg", "c"], "unknown option --confg of backup"],
  ])("refuses %j: %s", (args, problem) => {
    expect(backupArguments(args)).toBe(
      problem.startsWith("backup takes no") || problem === "backup takes --out once"
        ? `${problem}: umbradb backup --out <file> [--config <file>]`
        : problem,
    );
  });

  it("takes one --out and at most one --config", () => {
    expect(backupArguments(["--out", "a"])).toEqual({ out: "a" });
    expect(backupArguments(["--config", "c", "--out", "a"])).toEqual({ out: "a", config: "c" });
  });

  /** A configuration file for the command with `database`. */
  const config = (name: string, database: DatabaseParts): string =>
    project.write(
      name,
      [
        `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
        `export default defineConfig({ entries: [coreEntry({ start: 1, config: ${JSON.stringify(coreSettings(database))} })] });`,
        "",
      ].join("\n"),
    );

  it("refuses PGlite in memory and a PGlite directory with no database in it, which it does not create", async () => {
    const out = join(dir, "never.backup");
    const memory = await runBackup({ out, config: config("memory.config.ts", { kind: "pglite", memory: true }), cwd: project.dir });
    expect(memory).toMatchObject({ written: false, error: { code: "invalid-configuration" } });
    expect(memory.line).toContain("a database that exists only inside the process holding it");
    const empty = join(dir, "empty-db");
    const absent = await runBackup({ out, config: config("absent.config.ts", { kind: "pglite", path: empty }), cwd: project.dir });
    expect(absent).toMatchObject({ written: false, error: { code: "no-committed-height" } });
    expect(existsSync(empty)).toBe(false);
    expect(existsSync(out)).toBe(false);
  });

  it("refuses a configuration that is refused, naming its findings, and hides its secrets", async () => {
    const password = "s3cret-pa55";
    const file = project.write(
      "refused.config.ts",
      [
        `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
        "export default defineConfig({ entries: [coreEntry({ start: 1, config: " +
          `${JSON.stringify({
            ...coreSettings({ kind: "postgres", host: "127.0.0.1", port: 1, user: "u", password, name: "x", ssl: "disable" }),
            tipCap: "many",
          })} })] });`,
        "",
      ].join("\n"),
    );
    const refused = await runBackup({ out: join(dir, "never.backup"), config: file, cwd: project.dir });
    expect(refused).toMatchObject({ written: false, error: { code: "invalid-configuration" } });
    expect(refused.line).toContain("tipCap");
    expect(refused.line).not.toContain(password);
    const missing = await runBackup({ out: join(dir, "never.backup"), config: "no-such.config.ts", cwd: project.dir });
    expect(missing.line).toContain("file-not-found");
  });
});

describe("a backup with nothing to back up, and the backup at stop's file", () => {
  it("refuses a database with no committed height (no-committed-height), writing no file", async () => {
    const db = await openPglite({ dataDir: "memory://", committedHeight: async () => null, developmentOptIn: true });
    const out = join(dir, "nothing.backup");
    try {
      await expect(
        writeBackup({ db, target: { backend: "pglite" }, out, optedOut: [], developmentOptIn: true }),
      ).rejects.toMatchObject({ code: "no-committed-height" });
    } finally {
      await db.close();
    }
    expect(existsSync(out)).toBe(false);
    expect(readdirSync(dir).filter((name) => name.endsWith(".partial"))).toEqual([]);
  });

  it("refuses a PGlite target whose database the PGlite backend did not open, and a path it cannot read", async () => {
    const connection = { host: "127.0.0.1", port: 1, user: "u", password: "p", name: "x", ssl: "disable" } as const;
    const postgres = openPostgres({ connection, committedHeight: async () => null });
    try {
      const input = { db: postgres, target: { backend: "pglite" as const }, out: join(dir, "x.backup"), optedOut: [], developmentOptIn: true };
      await expect(writeBackup(input)).rejects.toThrow("is not one the PGlite backend opened");
      const folder = mkdtempSync(join(dir, "a-folder-"));
      await expect(backupAtStop({ ...input, out: folder }, 1n)).rejects.toMatchObject({ code: "EISDIR" });
    } finally {
      await postgres.close();
    }
  });

  it("leaves a file at backupAtStop that is no backup as it is, refusing with backup-format-unknown", async () => {
    const out = join(dir, "not-a-backup.sql");
    writeFileSync(out, "operator's own file\n");
    const db = await openPglite({ dataDir: "memory://", committedHeight: async () => null, developmentOptIn: true });
    try {
      const input = { db, target: { backend: "pglite" as const }, out, optedOut: [], developmentOptIn: true };
      await expect(backupAtStop(input, 12n)).rejects.toMatchObject({ code: "backup-format-unknown", details: { file: out } });
    } finally {
      await db.close();
    }
    expect(readFileSync(out, "utf8")).toBe("operator's own file\n");
  });
});

describe("the manifest's facts of a database (BK-2)", () => {
  it("reads the cursor, the identity, the history with its stops and empty data, and the stored state root", async () => {
    const db = await openPglite({ dataDir: "memory://", committedHeight: async () => null, developmentOptIn: true });
    const hash = (byte: number) => `'\\x${byte.toString(16).padStart(2, "0").repeat(32)}'::bytea`;
    try {
      await db.transaction(async (tx) => {
        for (const sql of [
          "CREATE SCHEMA core_block_commit",
          "CREATE TABLE core_block_commit.blocks (height bigint PRIMARY KEY, hash bytea NOT NULL, parent_hash bytea NOT NULL)",
          `INSERT INTO core_block_commit.blocks VALUES (7, ${hash(7)}, ${hash(6)})`,
          "CREATE SCHEMA core_chain",
          "CREATE TABLE core_chain.identity (id smallint PRIMARY KEY, genesis_hash bytea NOT NULL, start_height bigint NOT NULL, anchor_hash bytea)",
          `INSERT INTO core_chain.identity VALUES (1, ${hash(0)}, 5, NULL)`,
          "CREATE TABLE core_chain.config (entry_id text NOT NULL, start bigint NOT NULL, stop bigint, version text NOT NULL, " +
            "data jsonb, data_hash bytea, provides text[], PRIMARY KEY (entry_id, start))",
          `INSERT INTO core_chain.config VALUES ('m', 5, 9, '1.0.0', NULL, NULL, NULL), ('m', 10, NULL, '1.1.0', '{"a": 1}', ${hash(1)}, '{x}')`,
          "CREATE SCHEMA core_ledger_state",
          "CREATE TABLE core_ledger_state.states (height bigint PRIMARY KEY, state_root bytea NOT NULL)",
          `INSERT INTO core_ledger_state.states VALUES (7, '\\x0102'::bytea)`,
        ]) {
          await tx.execute(sql);
        }
      });
      const facts = await db.read((read) => readBackupFacts(read, { optedOut: [] }));
      expect(facts.private).toBe(false);
      expect(facts.manifest).toMatchObject({
        genesisHash: `0x${"00".repeat(32)}`,
        start: "5",
        height: "7",
        blockHash: `0x${"07".repeat(32)}`,
        stateRoot: "0x0102",
        migrations: [],
        postgres: "18.6",
      });
      expect(facts.manifest.history).toEqual([
        { id: "m", start: "5", stop: "9", version: "1.0.0", data: null, dataHash: null, provides: [] },
        { id: "m", start: "10", stop: null, version: "1.1.0", data: { a: 1 }, dataHash: `0x${"01".repeat(32)}`, provides: ["x"] },
      ]);
      await db.transaction((tx) => tx.execute("DELETE FROM core_ledger_state.states"));
      expect((await db.read((read) => readBackupFacts(read, { optedOut: [] }))).manifest.stateRoot).toBeNull();
      await db.transaction((tx) => tx.execute("DROP TABLE core_chain.config"));
      expect((await db.read((read) => readBackupFacts(read, { optedOut: [] }))).manifest.history).toEqual([]);
    } finally {
      await db.close();
    }
  });
});

describe("pglite-tools' pg_dump of another major version", () => {
  it("refuses a dump its pg_dump says is not of PostgreSQL 18, writing no file", async () => {
    const tools = mkdtempSync(join(dir, "fake-pglite-tools-"));
    const fake = join(tools, "pg_dump.mjs");
    writeFileSync(fake, 'export async function pgDump() { return new Blob(["--\\n-- Dumped by pg_dump version 17.2\\n"]); }\n');
    const db = await openPglite({ dataDir: "memory://", committedHeight: async () => null, developmentOptIn: true });
    const out = join(dir, "seventeen.backup");
    try {
      await db.transaction(async (tx) => {
        await tx.execute("CREATE SCHEMA core_block_commit");
        await tx.execute("CREATE TABLE core_block_commit.blocks (height bigint PRIMARY KEY, hash bytea NOT NULL, parent_hash bytea NOT NULL)");
        await tx.execute(`INSERT INTO core_block_commit.blocks VALUES (1, '\\x${"01".repeat(32)}', '\\x${"00".repeat(32)}')`);
        await tx.execute("CREATE SCHEMA core_chain");
        await tx.execute("CREATE TABLE core_chain.identity (id smallint PRIMARY KEY, genesis_hash bytea NOT NULL, start_height bigint NOT NULL, anchor_hash bytea)");
        await tx.execute(`INSERT INTO core_chain.identity VALUES (1, '\\x${"00".repeat(32)}', 1, NULL)`);
      });
      const input = { db, target: { backend: "pglite" as const }, out, optedOut: [], developmentOptIn: true };
      await expect(writeBackup(input, { pgliteTools: fake })).rejects.toMatchObject({
        code: "backup-tools-missing",
        message:
          "pg_dump of @electric-sql/pglite-tools is of PostgreSQL 17.2, not 18: install the version made for this " +
          "build's PGlite; no file was written",
        details: { tool: "pglite-tools", version: "17.2" },
      });
      // A version it cannot read is no version of 18 either.
      const unread = join(tools, "pg_dump-unread.mjs");
      writeFileSync(unread, 'export async function pgDump() { return new Blob(["--\\n-- Dumped by pg_dump version beta\\n"]); }\n');
      await expect(writeBackup(input, { pgliteTools: unread })).rejects.toMatchObject({
        code: "backup-tools-missing",
        details: { version: "beta" },
      });
      // pgliteBackupText itself refuses a private database without the opt-in, before it reads anything (the browser's
      // worker calls it without writeBackup).
      await expect(
        pgliteBackupText({ db, optedOut: [], side: "private", developmentOptIn: false }, async () => {
          throw new Error("no dump expected");
        }),
      ).rejects.toMatchObject({ code: "private-backup-refused" });
      writeFileSync(fake, 'export async function pgDump() { return new Blob(["-- no header\\n"]); }\n');
      const other = join(tools, "pg_dump-2.mjs");
      writeFileSync(other, 'export async function pgDump() { return new Blob(["-- no header\\n"]); }\n');
      await expect(writeBackup(input, { pgliteTools: other })).rejects.toThrow("an unknown version");
    } finally {
      await db.close();
    }
    expect(existsSync(out)).toBe(false);
  });
});

describe("a restore's empty target and its refusals before reading the file (BK-3)", () => {
  it("counts a database as empty only with no schema of its own, and nothing in public", async () => {
    const db = await openPglite({ dataDir: "memory://", committedHeight: async () => null, developmentOptIn: true });
    try {
      const empty = () => db.read((read) => isEmptyDatabase(read));
      expect(await empty()).toBe(true);
      for (const [make, drop] of [
        ["CREATE SCHEMA s", "DROP SCHEMA s"],
        ["CREATE TABLE public.t (a int)", "DROP TABLE public.t"],
        ["CREATE FUNCTION public.f() RETURNS int LANGUAGE sql AS 'SELECT 1'", "DROP FUNCTION public.f()"],
        ["CREATE TYPE public.e AS ENUM ('a')", "DROP TYPE public.e"],
      ] as const) {
        await db.transaction((tx) => tx.execute(make));
        expect(await empty(), make).toBe(false);
        await db.transaction((tx) => tx.execute(drop));
        expect(await empty(), drop).toBe(true);
      }
    } finally {
      await db.close();
    }
  });

  it("takes a private process's chain from its public database: with no way to read it, refuses before anything is opened", async () => {
    const file = project.write(
      "private-restore.config.ts",
      [
        `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
        "export default defineConfig({ entries: [coreEntry({ start: 1, config: " +
          `${JSON.stringify({ network: "custom", genesisHash: HASH, ledgerTable: { rows: [{ specVersionMin: 0, specVersionMax: 4_294_967_295, ledger: "v9" }] }, database: { kind: "postgres", host: "127.0.0.1", port: 1, user: "u", password: "p", name: "x" }, instanceId: "i-1" })} })] });`,
        "",
      ].join("\n"),
    );
    const outcome = await runRestore({ file: join(dir, "none.backup"), config: file, cwd: project.dir });
    // Neither a PostgreSQL publicDatabase nor coreTransport (the earlier interim refusal is gone). [Q153]
    expect(outcome).toMatchObject({
      restored: false,
      error: { code: "invalid-configuration", details: { reason: "public-database-transport" } },
    });
  });
});

describe("a restore's lines of the dump (BK-3; task 13.1)", () => {
  it("are the text between line feeds after the manifest's line — a carriage return kept, a last line without a feed given, lines across reads joined — read to the end by a slow reader", async () => {
    const dir = mkdtempSync(join(tmpdir(), "umbradb-dump-lines-"));
    try {
      const file = join(dir, "dump");
      // Lines of 70 bytes, about 4,000 of them: several reads of the stream's 64 KiB, lines split across reads.
      const lines = Array.from({ length: 4_000 }, (_, i) => `INSERT INTO t VALUES (${i}, '${"x".repeat(40 + (i % 7))}');`);
      writeFileSync(file, ["#manifest", "", "SELECT 'a\rb';", ...lines, "-- last"].join("\n"));
      const seen: string[] = [];
      for await (const line of dumpLines(file)) {
        seen.push(line);
        if (seen.length % 100 === 0) await new Promise((resolve) => setTimeout(resolve, 1));
      }
      expect(seen).toEqual(["", "SELECT 'a\rb';", ...lines, "-- last"]);
      const all = async (): Promise<string[]> => {
        const out: string[] = [];
        for await (const line of dumpLines(file)) out.push(line);
        return out;
      };
      writeFileSync(file, "#manifest only");
      expect(await all()).toEqual([]);
      writeFileSync(file, "#manifest\nSELECT 1;\n");
      expect(await all()).toEqual(["SELECT 1;"]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
