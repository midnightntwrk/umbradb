import { existsSync, mkdirSync, readdirSync } from "node:fs";
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
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { coreEntry } from "../../src/config/entries.js";
import { type CliProject, cliProject, configText, coreSettings, inProcess } from "./cli-fixtures.js";
import { type CheckTarget, CLI_BACKENDS } from "./database-fixtures.js";

/**
 * `umbradb config check` with `--database` `[CI]`, through `runCommand` and `configCheck` in this process, on
 * PostgreSQL 18 and PGlite 0.5.10 (`./umbradb.test.ts` runs the command itself in a child process). [A35 CI, CF-10, Q167 A]
 *
 * `umbradb config check <file> --database` takes no value. It reads the database that the file's `core` revision
 * configures: the cursor and `core_chain.config`, read-only, with no migration and no write. It then runs the history
 * checks too (for `versionEntry` revisions as well). A file that changes a recorded entry's data field reports
 * `changes-past` and exits non-zero, and the database is unchanged (every table's row count, and the rows of
 * `core_chain.migrations` and `core_chain.config` with their `xmin`, before and after). [CF-3, CF-5, CF-6, CF-8]
 *
 * PGlite opens only under the development opt-in, which comes from the file. Its directory's lock is taken (a PGlite
 * database another process holds cannot be read). A PostgreSQL database is read beside a running writer. The same
 * tests show that the history is read from the configured database. [Q102, A170]
 */

// Each test runs the TypeScript compiler on a file (about a second alone) and many open a database or start a process;
// in the full parallel run some exceeded Vitest's 5 s default (the conformance run of 2026-10-25), so they get 60 s.
vi.setConfig({ testTimeout: 60_000 });

let project: CliProject;
/** The database the files configure unless a test gives another: the backend's checked database. */
let filesDatabase: DatabaseParts = { kind: "pglite", memory: true };

beforeAll(async () => {
  project = await cliProject();
}, 120_000);

afterAll(() => {
  project?.remove();
});

/** The settings the history was recorded with: retainStates 0 (the default). */
const RECORDED = { network: "preprod", node: "ws://127.0.0.1:9944", database: { kind: "pglite", memory: true }, retainStates: 0 } as const;

/** The history's entries: core from 0, and a core revision from 100 (above the cursor 20), both of the build's version. */
const HISTORY = [coreEntry({ start: 0, config: RECORDED }), coreEntry({ start: 100, config: { ...RECORDED, retainStates: 2 } })];

const CURSOR = 20n;

let files = 0;

/** The directory of a PGlite target. */
const pathOf = (target: CheckTarget): string => (target.database as { path: string }).path;

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

/** A core entry from `start` on `database`, with `extra` settings and the opt-in when `optIn`. */
function core(start: number, extra: Readonly<Record<string, unknown>>, optIn: boolean, database = filesDatabase): string {
  return `coreEntry({ start: ${start}, config: ${coreSettings(database, { ...extra, ...(optIn ? { developmentOptIn: true } : {}) })} })`;
}

describe.each(CLI_BACKENDS.map((make) => make()))("A35 with --database on $name", (backend) => {
  const pglite = backend.password === null;
  const outputs: string[] = [];
  /** Runs `umbradb config check <file> --database` in this process, keeping its output for the password check. */
  const check = async (file: string, cwd = project.dir) => {
    const result = await inProcess(["config", "check", file, "--database"], cwd);
    outputs.push(result.stdout, result.stderr);
    return result;
  };

  let target: CheckTarget;

  beforeAll(async () => {
    await backend.start();
    target = await backend.target();
    await target.setup(HISTORY, CURSOR);
    filesDatabase = target.database;
  }, 180_000);

  afterAll(async () => {
    await backend.stop();
    if (backend.password !== null) {
      for (const output of outputs) expect(output).not.toContain(backend.password);
    }
  }, 60_000);

  it("reports changes-past for a changed recorded entry, exits non-zero, and leaves the database unchanged", async () => {
    const before = await target.snapshot();
    expect(before.config).toHaveLength(2);
    expect(before.tables["core_block_commit.blocks"]).toBe("21");
    const file = fileOf("changed.config.ts", [core(0, { retainStates: 5 }, pglite), core(100, { retainStates: 2 }, pglite)]);
    const result = await check(file);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toMatch(/^type check \(TypeScript 5\.9\.\d+, noEmit\): passed$/m);
    expect(result.stdout).toMatch(/^configuration \(evaluation, validation\): passed$/m);
    expect(result.stdout).toMatch(
      /^history \(versionEntry revisions, revisions by \(id, start\), changes only to the future, one version per build\): 1 finding — read-only, from the configuration's database at the cursor 20, 2 recorded revisions$/m,
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
    const result = await check(file);
    expect(result.stdout).toMatch(
      /^history \(versionEntry revisions, revisions by \(id, start\), changes only to the future, one version per build\): passed — read-only, from the configuration's database at the cursor 20, 2 recorded revisions$/m,
    );
    expect(result.stdout).toMatch(/^passed: every check that ran passed$/m);
    expect(result.code).toBe(EXIT.ok);
    expect(await target.snapshot()).toEqual(before);
  });

  it("prints every finding of every history check at once: missing-entry, changes-past, upgrade-required", async () => {
    const before = await target.snapshot();
    // core from 0 (at or below the cursor) and from 100 (above it, where it may be omitted) are both left out. [Q103]
    const file = fileOf("everything.config.ts", [
      core(5, { retainStates: 5 }, pglite),
      'versionEntry({ id: "core", start: 21, version: { umbradb: "0.9.6", ledgers: [] } })',
    ]);
    const report = await configCheck({ file, cwd: project.dir, database: true });
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
    const report = await configCheck({ file, cwd: project.dir, database: true });
    const history = report.steps.find((step) => step.name === "history");
    expect(history?.findings.map((f) => `${f.code} ${f.path}`)).toEqual([
      "invalid-configuration scheduled-config entries[2].config",
    ]);
    expect(history?.note).toContain("so the other history checks were not run");
  });

  it("a configuration whose S is above the cursor is a finding, not a crash", async () => {
    const file = fileOf("late-start.config.ts", [core(50, {}, pglite), core(100, { retainStates: 2 }, pglite)]);
    const report = await configCheck({ file, cwd: project.dir, database: true });
    const history = report.steps.find((step) => step.name === "history");
    expect(history?.status).toBe("failed");
    expect(history?.findings.map((f) => f.code)).toEqual(["error"]);
    expect(report.text).toContain("the cursor 20 is below S (50)");
  });

  it("the history checks are not run on a configuration that fails its own checks", async () => {
    const file = fileOf("invalid.config.ts", [core(0, { apiReadTimeoutMs: 0 }, pglite)]);
    const report = await configCheck({ file, cwd: project.dir, database: true });
    expect(report.steps.map((step) => [step.name, step.status])).toEqual([
      ["type check", "passed"],
      ["configuration", "failed"],
      ["history", "not run"],
    ]);
    expect(report.text).toContain(
      "history (versionEntry revisions, revisions by (id, start), changes only to the future, one version per build): not run — the configuration did not pass its own " +
        "checks, which the history checks need",
    );
  });

  it("a new database: nothing committed, no history, checked as startup would, and nothing created", async () => {
    const fresh = await backend.target();
    const before = await fresh.snapshot();
    expect(before.tables).toEqual({});
    const file = fileOf("fresh.config.ts", [core(0, {}, pglite, fresh.database)]);
    const result = await check(file);
    expect(result.stdout).toMatch(
      pglite
        ? /^history \(versionEntry revisions, revisions by \(id, start\), changes only to the future, one version per build\): passed — no PGlite database at that directory yet: checked as a new database, which startup creates; nothing was opened or created$/m
        : /^history \(versionEntry revisions, revisions by \(id, start\), changes only to the future, one version per build\): passed — read-only, from the configuration's database, a new database \(nothing committed, no history\)$/m,
    );
    expect(result.code).toBe(EXIT.ok);
    expect(await fresh.snapshot()).toEqual(before);
    if (pglite) expect(existsSync(`${pathOf(fresh)}.lock.sqlite`)).toBe(false);
  });

  it("a database with a history and nothing committed, and one with a single recorded revision", async () => {
    const started = await backend.target();
    await started.setup(HISTORY, null);
    const file = fileOf("nothing-committed.config.ts", [
      core(0, {}, pglite, started.database),
      core(100, { retainStates: 2 }, pglite, started.database),
    ]);
    const result = await check(file);
    expect(result.stdout).toMatch(/: passed — read-only, from the configuration's database with nothing committed, 2 recorded revisions$/m);
    expect(result.code).toBe(EXIT.ok);
    const single = await backend.target();
    await single.setup([HISTORY[0]], 5n);
    const one = await check(fileOf("single.config.ts", [core(0, {}, pglite, single.database)]));
    expect(one.stdout).toMatch(/: passed — read-only, from the configuration's database at the cursor 5, 1 recorded revision$/m);
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
      const result = await check(file);
      expect(result.code).toBe(EXIT.failed);
      expect(result.stdout).toMatch(
        /^ {2}--database: the PGlite backend runs only under the development opt-in: .* \[development-opt-in-required\]$/m,
      );
      expect(await target.snapshot()).toEqual(before);
    });

    it("a PGlite database another holder has open is not read: writer-lock-held", async () => {
      const held = await backend.target();
      await held.setup(HISTORY, CURSOR);
      const dataDir = pathOf(held);
      const lock = await acquirePgliteLock(dataDir);
      try {
        const file = fileOf("held.config.ts", [core(0, {}, true, held.database), core(100, { retainStates: 2 }, true, held.database)]);
        const result = await check(file);
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
      const dataDir = pathOf(empty);
      mkdirSync(dataDir, { recursive: true });
      const file = fileOf("empty-dir.config.ts", [core(0, {}, true, empty.database)]);
      const result = await check(file);
      expect(result.stdout).toContain("passed — no PGlite database at that directory yet: checked as a new database");
      expect(result.code).toBe(EXIT.ok);
      expect(readdirSync(dataDir)).toEqual([]);
      expect(existsSync(`${dataDir}.lock.sqlite`)).toBe(false);
    });

    it("a missing PGlite directory without the opt-in is refused, as startup refuses it, before anything else", async () => {
      const missing = await backend.target();
      const file = fileOf("missing-no-opt-in.config.ts", [core(0, {}, false, missing.database)]);
      const result = await check(file);
      expect(result.code).toBe(EXIT.failed);
      expect(result.stdout).toMatch(/\[development-opt-in-required\]$/m);
    });

    it("a relative PGlite directory is read from the working directory", async () => {
      const dataDir = pathOf(target);
      const relative: DatabaseParts = { kind: "pglite", path: `./${basename(dataDir)}` };
      const file = fileOf("relative-dir.config.ts", [core(0, {}, true, relative), core(100, { retainStates: 2 }, true, relative)]);
      const result = await check(file, dirname(dataDir));
      expect(result.stdout).toContain("at the cursor 20, 2 recorded revisions");
      expect(result.code).toBe(EXIT.ok);
    });
  } else {
    it("a PostgreSQL database is read beside a running writer, which holds the writer lock", async () => {
      await target.withDatabase(async (db) => {
        await startWriter(db);
        const file = fileOf("beside-writer.config.ts", [core(0, {}, false), core(100, { retainStates: 2 }, false)]);
        const result = await check(file);
        expect(result.code).toBe(EXIT.ok);
      });
    });

    it("a database that cannot be read is a finding naming --database, without the password", async () => {
      const wrong = { ...target.database, password: `${backend.password}-wrong` } as DatabaseParts;
      const file = fileOf("unreadable.config.ts", [core(0, {}, false, wrong)]);
      const result = await check(file);
      expect(result.code).toBe(EXIT.failed);
      expect(result.stdout).toMatch(/^ {2}--database: the configuration's database could not be read: .* \[database-error\]$/m);
      expect(result.stdout).not.toContain(`${backend.password}-wrong`);
    });
  }
});
