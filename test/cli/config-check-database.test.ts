import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { createServer, type Server } from "node:net";
import { basename, dirname } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { recordHistory } from "../../src/backbone/core-chain/index.js";
import { EXIT } from "../../src/cli/command.js";
import { configCheck } from "../../src/cli/config-check.js";
import { buildDeclarations } from "../../src/cli/build-modules.js";
import { acquirePgliteLock } from "../../src/db/pglite-lock.js";
import { startWriter } from "../../src/db/writer-lock.js";
import { plainData } from "../../src/config/plain-data.js";
import { validateConfig } from "../../src/config/validate.js";
import { coreEntry } from "../../src/config/entries.js";
import { type CliProject, cliProject, configText, coreSettings, inProcess } from "./cli-fixtures.js";
import { type CheckTarget, CLI_BACKENDS } from "./database-fixtures.js";

/**
 * A35 `[CI]` with `--database` (CF-10), through `runCommand` and `configCheck` in this process, on PostgreSQL 18 and
 * PGlite 0.5.10 (`./umbradb.test.ts` runs the command itself in a child process): `umbradb config check <file>
 * --database <url>` reads the cursor and `core_chain.config` read-only — no migration, no write — and runs the history
 * checks too (CF-3 for `versionEntry` revisions, CF-5, CF-6, CF-8): a file that changes a recorded entry's data field
 * reports `changes-past` and exits non-zero, and the database is unchanged (every table's row count, and the rows of
 * `core_chain.migrations` and `core_chain.config` with their `xmin`, before and after). PGlite opens only under the
 * development opt-in, which comes from the file (decision record Q102); its directory's lock is taken (a PGlite
 * database another process holds cannot be read); a PostgreSQL database is read beside a running writer.
 */

// Each test runs the TypeScript compiler on a file (about a second alone) and many open a database or start a process;
// in the full parallel run some exceeded Vitest's 5 s default (the conformance run of 2026-10-25), so they get 60 s.
vi.setConfig({ testTimeout: 60_000 });

let project: CliProject;
let listener: Server;
let connections = 0;
/** The file's own database: a PostgreSQL URL no server answers (a listener counting connections). */
let filesDatabase = "";

beforeAll(async () => {
  project = await cliProject();
  listener = createServer((socket) => {
    connections++;
    socket.destroy();
  });
  await new Promise<void>((resolve) => listener.listen(0, "127.0.0.1", resolve));
  filesDatabase = `postgres://checker:pw-4-4-FILE@127.0.0.1:${(listener.address() as { port: number }).port}/indexer`;
}, 120_000);

afterAll(async () => {
  await new Promise<void>((resolve) => listener?.close(() => resolve()));
  project?.remove();
});

/** The settings the history was recorded with: retainStates 0 (the default). */
const RECORDED = { network: "preprod", node: "ws://127.0.0.1:9944", database: "pglite:memory", retainStates: 0 } as const;

/** The history's entries: core from 0, and a core revision from 100 (above the cursor 20), both of the build's version. */
const HISTORY = [coreEntry({ start: 0, config: RECORDED }), coreEntry({ start: 100, config: { ...RECORDED, retainStates: 2 } })];

const CURSOR = 20n;

let files = 0;

/**
 * A configuration file whose entries are `entries` (TypeScript expressions), under a name of its own: a process imports
 * a file once and keeps the module (Node.js's and Vitest's module caches), so a file written again under a name already
 * loaded would be read as it was.
 */
function fileOf(name: string, entries: readonly string[]): string {
  return project.write(
    `${files++}-${name}`,
    configText(project.builders, ["export default defineConfig({", "  entries: [", ...entries.map((e) => `    ${e},`), "  ],", "});"]),
  );
}

/** A core entry from `start` with the file's database, `extra` settings and the opt-in when `optIn`. */
function core(start: number, extra: Readonly<Record<string, unknown>>, optIn: boolean): string {
  return `coreEntry({ start: ${start}, config: ${coreSettings(filesDatabase, { ...extra, ...(optIn ? { developmentOptIn: true } : {}) })} })`;
}

describe.each(CLI_BACKENDS.map((make) => make()))("A35 with --database on $name", (backend) => {
  const pglite = backend.password === null;
  const outputs: string[] = [];
  /** Runs `umbradb config check <file> --database <url>` in this process, keeping its output for the password check. */
  const check = async (file: string, url: string) => {
    const result = await inProcess(["config", "check", file, "--database", url], project.dir);
    outputs.push(result.stdout, result.stderr);
    return result;
  };

  let target: CheckTarget;

  beforeAll(async () => {
    await backend.start();
    target = await backend.target();
    await target.setup(HISTORY, CURSOR);
  }, 180_000);

  afterAll(async () => {
    await backend.stop();
    if (backend.password !== null) {
      for (const output of outputs) expect(output).not.toContain(backend.password);
    }
    expect(connections, "the file's own database is never contacted: --database names the one checked").toBe(0);
  }, 60_000);

  it("reports changes-past for a changed recorded entry, exits non-zero, and leaves the database unchanged", async () => {
    const before = await target.snapshot();
    expect(before.config).toHaveLength(2);
    expect(before.tables["core_block_commit.blocks"]).toBe("21");
    const file = fileOf("changed.config.ts", [core(0, { retainStates: 5 }, pglite), core(100, { retainStates: 2 }, pglite)]);
    const result = await check(file, target.url);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toMatch(/^type check \(TypeScript 5\.9\.\d+, noEmit\): passed$/m);
    expect(result.stdout).toMatch(/^configuration \(CF-1, CF-3\): passed$/m);
    expect(result.stdout).toMatch(
      /^history \(CF-3 for versionEntry revisions, CF-5, CF-6, CF-8\): 1 finding — read-only, from the database given with --database at the cursor 20, 2 recorded revisions$/m,
    );
    expect(result.stdout).toMatch(
      /^ {2}entries\[0\]\.config\.retainStates \(core from 0\): the revision starts at or below the cursor 20, and this data field differs from the history's: .* \[changes-past data\]$/m,
    );
    expect(result.stdout).toMatch(/^failed: 1 finding$/m);
    expect(await target.snapshot()).toEqual(before);
  });

  it("passes the configuration as recorded, with an operational change, and leaves the database unchanged", async () => {
    const before = await target.snapshot();
    const file = fileOf("same.config.ts", [core(0, { livenessTimeoutMs: 5_000 }, pglite), core(100, { retainStates: 2 }, pglite)]);
    const result = await check(file, target.url);
    expect(result.stdout).toMatch(
      /^history \(CF-3 for versionEntry revisions, CF-5, CF-6, CF-8\): passed — read-only, from the database given with --database at the cursor 20, 2 recorded revisions$/m,
    );
    expect(result.stdout).toMatch(/^passed: every check that ran passed$/m);
    expect(result.code).toBe(EXIT.ok);
    expect(await target.snapshot()).toEqual(before);
  });

  it("prints every finding of every history check at once: missing-entry, changes-past, upgrade-required", async () => {
    const before = await target.snapshot();
    // core from 0 (at or below the cursor) and from 100 (above it, Q103: may be omitted) are both left out.
    const file = fileOf("everything.config.ts", [
      core(5, { retainStates: 5 }, pglite),
      'versionEntry({ id: "core", start: 21, version: { umbradb: "0.9.6", ledgers: [] } })',
    ]);
    const report = await configCheck({ file, cwd: project.dir, database: target.url });
    const history = report.steps.find((step) => step.name === "history");
    expect(history?.findings.map((f) => `${f.code} ${f.path}`)).toEqual([
      "missing-entry listed entries",
      "changes-past recorded entries[0]",
      "upgrade-required build-version entries[1].version",
    ]);
    expect(report.text).toContain("the history records core from 0");
    expect(report.text).not.toContain("core from 100");
    expect(report.text).toMatch(/^failed: 3 findings$/m);
    expect(await target.snapshot()).toEqual(before);
  });

  it("CF-3 for versionEntry revisions: a scheduled one carrying a config is refused, the other history checks not run", async () => {
    const file = fileOf("scheduled-config.config.ts", [
      core(0, {}, pglite),
      core(100, { retainStates: 2 }, pglite),
      `versionEntry({ id: "core", start: 200, version: { umbradb: "0.9.6", ledgers: [] }, config: ${coreSettings(filesDatabase)} })`,
    ]);
    const report = await configCheck({ file, cwd: project.dir, database: target.url });
    const history = report.steps.find((step) => step.name === "history");
    expect(history?.findings.map((f) => `${f.code} ${f.path}`)).toEqual([
      "invalid-configuration scheduled-config entries[2].config",
    ]);
    expect(history?.note).toContain("CF-5, CF-6 and CF-8 were not run");
  });

  it("a configuration whose S is above the cursor is a finding, not a crash", async () => {
    const file = fileOf("late-start.config.ts", [core(50, {}, pglite), core(100, { retainStates: 2 }, pglite)]);
    const report = await configCheck({ file, cwd: project.dir, database: target.url });
    const history = report.steps.find((step) => step.name === "history");
    expect(history?.status).toBe("failed");
    expect(history?.findings.map((f) => f.code)).toEqual(["error"]);
    expect(report.text).toContain("the cursor 20 is below S (50)");
  });

  it("the history checks are not run on a configuration that fails its own checks", async () => {
    const file = fileOf("invalid.config.ts", [core(0, { apiReadTimeoutMs: 0 }, pglite)]);
    const report = await configCheck({ file, cwd: project.dir, database: target.url });
    expect(report.steps.map((step) => [step.name, step.status])).toEqual([
      ["type check", "passed"],
      ["configuration", "failed"],
      ["history", "not run"],
    ]);
    expect(report.text).toContain(
      "history (CF-3 for versionEntry revisions, CF-5, CF-6, CF-8): not run — the configuration did not pass its own " +
        "checks, which the history checks need",
    );
  });

  it("a new database: nothing committed, no history, checked as startup would, and nothing created", async () => {
    const fresh = await backend.target();
    const before = await fresh.snapshot();
    expect(before.tables).toEqual({});
    const file = fileOf("fresh.config.ts", [core(0, {}, pglite)]);
    const result = await check(file, fresh.url);
    expect(result.stdout).toMatch(
      pglite
        ? /^history \(CF-3 for versionEntry revisions, CF-5, CF-6, CF-8\): passed — no PGlite database at that directory yet: checked as a new database, which startup creates; nothing was opened or created$/m
        : /^history \(CF-3 for versionEntry revisions, CF-5, CF-6, CF-8\): passed — read-only, from the database given with --database, a new database \(nothing committed, no history\)$/m,
    );
    expect(result.code).toBe(EXIT.ok);
    expect(await fresh.snapshot()).toEqual(before);
    if (pglite) expect(existsSync(`${fresh.url.slice("pglite:".length)}.lock.sqlite`)).toBe(false);
  });

  it("a database with a history and nothing committed, and one with a single recorded revision", async () => {
    const started = await backend.target();
    await started.setup(HISTORY, null);
    const file = fileOf("nothing-committed.config.ts", [core(0, {}, pglite), core(100, { retainStates: 2 }, pglite)]);
    const result = await check(file, started.url);
    expect(result.stdout).toMatch(/: passed — read-only, from the database given with --database with nothing committed, 2 recorded revisions$/m);
    expect(result.code).toBe(EXIT.ok);
    const single = await backend.target();
    await single.setup([HISTORY[0]], 5n);
    const one = await check(fileOf("single.config.ts", [core(0, {}, pglite)]), single.url);
    expect(one.stdout).toMatch(/: passed — read-only, from the database given with --database at the cursor 5, 1 recorded revision$/m);
  });

  it("the negative control: a check that recorded the history, or ran the migrations, changes the snapshot", async () => {
    // Recording, as core-chain's on-start-db does, with a revision above the cursor that the history lacks.
    const declarations = buildDeclarations();
    const entries = [...HISTORY, coreEntry({ start: 300, config: RECORDED })];
    const config = validateConfig({ config: { data: plainData({ entries }) }, declarations, side: "public" });
    const recorded = await backend.target();
    await recorded.setup(HISTORY, CURSOR);
    const before = await recorded.snapshot();
    await recorded.withDatabase((db) =>
      db.transaction((tx) => recordHistory(tx, { config, cursor: CURSOR, declarations })),
    );
    const after = await recorded.snapshot();
    expect(after).not.toEqual(before);
    expect(after.config).toHaveLength(3);
    // Migrations, on a new database.
    const fresh = await backend.target();
    const empty = await fresh.snapshot();
    await fresh.setup(HISTORY, 0n);
    expect(await fresh.snapshot()).not.toEqual(empty);
  });

  if (pglite) {
    it("PGlite opens only under the development opt-in of the file's core revision (Q102, CF-9)", async () => {
      const before = await target.snapshot();
      const file = fileOf("no-opt-in.config.ts", [core(0, {}, false), core(100, { retainStates: 2 }, false)]);
      const result = await check(file, target.url);
      expect(result.code).toBe(EXIT.failed);
      expect(result.stdout).toMatch(
        /^ {2}--database: the PGlite backend runs only under the development opt-in: .* \[development-opt-in-required\]$/m,
      );
      expect(await target.snapshot()).toEqual(before);
    });

    it("a PGlite database another holder has open is not read: writer-lock-held", async () => {
      const held = await backend.target();
      await held.setup(HISTORY, CURSOR);
      const dataDir = held.url.slice("pglite:".length);
      const lock = await acquirePgliteLock(dataDir);
      try {
        const file = fileOf("held.config.ts", [core(0, {}, true), core(100, { retainStates: 2 }, true)]);
        const result = await check(file, held.url);
        expect(result.code).toBe(EXIT.failed);
        expect(result.stdout).toMatch(
          /^ {2}--database: this process already has the PGlite data directory open: .* \[writer-lock-held\]$/m,
        );
      } finally {
        lock?.endUse();
      }
    });

    it("an empty directory holds no database yet: checked as a new one, nothing written into it", async () => {
      const empty = await backend.target();
      const dataDir = empty.url.slice("pglite:".length);
      mkdirSync(dataDir, { recursive: true });
      const file = fileOf("empty-dir.config.ts", [core(0, {}, true)]);
      const result = await check(file, empty.url);
      expect(result.stdout).toContain("passed — no PGlite database at that directory yet: checked as a new database");
      expect(result.code).toBe(EXIT.ok);
      expect(readdirSync(dataDir)).toEqual([]);
      expect(existsSync(`${dataDir}.lock.sqlite`)).toBe(false);
    });

    it("a missing PGlite directory without the opt-in is refused, as startup refuses it, before anything else", async () => {
      const missing = await backend.target();
      const file = fileOf("missing-no-opt-in.config.ts", [core(0, {}, false)]);
      const result = await check(file, missing.url);
      expect(result.code).toBe(EXIT.failed);
      expect(result.stdout).toMatch(/\[development-opt-in-required\]$/m);
    });

    it("a relative PGlite directory is read from the working directory", async () => {
      const dataDir = target.url.slice("pglite:".length);
      const file = fileOf("relative-dir.config.ts", [core(0, {}, true), core(100, { retainStates: 2 }, true)]);
      const relative = `pglite:./${basename(dataDir)}`;
      const result = await inProcess(["config", "check", file, "--database", relative], dirname(dataDir));
      expect(result.stdout).toContain("at the cursor 20, 2 recorded revisions");
      expect(result.code).toBe(EXIT.ok);
    });
  } else {
    it("a PostgreSQL database is read beside a running writer, which holds the writer lock", async () => {
      await target.withDatabase(async (db) => {
        await startWriter(db);
        const file = fileOf("beside-writer.config.ts", [core(0, {}, false), core(100, { retainStates: 2 }, false)]);
        const result = await check(file, target.url);
        expect(result.code).toBe(EXIT.ok);
      });
    });

    it("a database that cannot be read is a finding naming --database, without the password", async () => {
      const wrong = new URL(target.url);
      wrong.password = `${backend.password}-wrong`;
      const file = fileOf("unreadable.config.ts", [core(0, {}, false)]);
      const result = await check(file, wrong.toString());
      expect(result.code).toBe(EXIT.failed);
      expect(result.stdout).toMatch(/^ {2}--database: the database given with --database could not be read: .* \[database-error\]$/m);
      expect(result.stdout).not.toContain(wrong.password);
    });
  }
});
