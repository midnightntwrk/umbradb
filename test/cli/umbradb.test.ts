import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { EXIT, USAGE } from "../../src/cli/command.js";
import { HISTORY_NOT_RUN } from "../../src/cli/config-check.js";
import { coreEntry } from "../../src/config/entries.js";
import { acquirePgliteLock } from "../../src/db/pglite-lock.js";
import { type CliProject, cliProject, configText, coreSettings, inChild, lineOf } from "./cli-fixtures.js";
import { CLI_BACKENDS } from "./database-fixtures.js";

/**
 * A6 and A35 `[CI]` through the command itself (task 4.4; LS-6, CF-10): `src/cli/main.ts` bundled with esbuild and run
 * by Node.js in a child process, so the exit codes, the streams and the loading of the configuration are the real ones
 * — Node.js's own type stripping evaluates the file (its refusal of an `enum` included, which Vitest's transform
 * accepts), and the database is opened by another process than the tests' (a PGlite directory's operating-system lock
 * then belongs to the command). The breadth of both criteria is in `./command.test.ts`, `./config-check.test.ts` and
 * `./config-check-database.test.ts`, in this process.
 */

// Each test runs the TypeScript compiler on a file (about a second alone) and many open a database or start a process;
// in the full parallel run some exceeded Vitest's 5 s default (the conformance run of 2026-10-25), so they get 60 s.
vi.setConfig({ testTimeout: 60_000 });

let project: CliProject;

beforeAll(async () => {
  project = await cliProject({ cli: true });
}, 120_000);

afterAll(() => project?.remove());

/** A public process's file with one core entry from 0, `before` written above the default export. */
function coreOnly(database: string, extra: Readonly<Record<string, unknown>> = {}, before: readonly string[] = []): string {
  return configText(project.builders, [
    ...before,
    "export default defineConfig({",
    `  entries: [coreEntry({ start: 0, config: ${coreSettings(database, extra)} })],`,
    "});",
  ]);
}

describe("A6: the command's usage and its commands (LS-6)", () => {
  it("umbradb with no argument prints the usage and exits 2", async () => {
    expect(await inChild(project, [])).toEqual({
      code: EXIT.usage,
      stdout: "",
      stderr: `umbradb: no command given\n\n${USAGE}`,
    });
  });

  it("umbradb sync prints the usage and exits 2", async () => {
    expect(await inChild(project, ["sync"])).toEqual({
      code: EXIT.usage,
      stdout: "",
      stderr: `umbradb: unknown command sync\n\n${USAGE}`,
    });
  });

  it("umbradb --help prints the usage on stdout and exits 0", async () => {
    expect(await inChild(project, ["--help"])).toEqual({ code: EXIT.ok, stdout: USAGE, stderr: "" });
  });

  // umbradb run starts the process (task 4.4a): ./run.test.ts runs it in a child process; umbradb backup and restore
  // (tasks 15.1, 15.2): test/backup/.
  it("umbradb backup is recognized: without --out it prints the usage and exits 2", async () => {
    const result = await inChild(project, ["backup"]);
    expect(result).toEqual({
      code: EXIT.usage,
      stdout: "",
      stderr: `umbradb: backup takes --out once: umbradb backup --out <file> [--config <file>]\n\n${USAGE}`,
    });
  });

  it("umbradb restore is recognized: without its file it prints the usage and exits 2", async () => {
    const result = await inChild(project, ["restore"]);
    expect(result).toEqual({
      code: EXIT.usage,
      stdout: "",
      stderr: `umbradb: restore takes one backup file: umbradb restore <file> [--config <file>]\n\n${USAGE}`,
    });
  });
});

describe("A35: umbradb config check without --database", () => {
  it("exits 0 on a valid file and says the history checks were not run", async () => {
    const file = project.write("valid.config.ts", coreOnly("postgres://indexer@127.0.0.1:1/indexer"));
    const result = await inChild(project, ["config", "check", file]);
    expect(result.stderr).toBe("");
    expect(result.code).toBe(EXIT.ok);
    expect(result.stdout).toContain(HISTORY_NOT_RUN);
  });

  it("prints a type error and a schema error with their paths, exits 1, and says the history checks were not run", async () => {
    const text = coreOnly("postgres://indexer@127.0.0.1:1/indexer", { apiReadTimeoutMs: 0 }, [
      'const label: number = "core";',
      "void label;",
    ]);
    const file = project.write("two-errors.config.ts", text);
    const result = await inChild(project, ["config", "check", file]);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toContain(`  ${file}:${lineOf(text, "const label")}:7: Type 'string' is not assignable`);
    expect(result.stdout).toContain("  entries[0].config.apiReadTimeoutMs (core from 0): Too small");
    expect(result.stdout).toContain(HISTORY_NOT_RUN);
    expect(result.stdout).toMatch(/^failed: 2 findings$/m);
  });

  it("an enum: the compiler refuses it, and so does Node.js's type stripping when it evaluates the file", async () => {
    const text = coreOnly("postgres://indexer@127.0.0.1:1/indexer", {}, ['enum Network { Preprod = "preprod" }', "void Network;"]);
    const file = project.write("enum.config.ts", text);
    const result = await inChild(project, ["config", "check", file]);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toContain(`${file}:${lineOf(text, "enum Network")}:6: This syntax is not allowed`);
    expect(result.stdout).toContain("erasable TypeScript only");
    expect(result.stdout).toMatch(/\[invalid-configuration load-failed\]$/m);
  });

  it("a .ts file whose package.json has no type field loads as an ES module, and the compiler agrees", async () => {
    project.write("plain-package/package.json", "{}\n");
    const file = project.write("plain-package/umbradb.config.ts", coreOnly("postgres://indexer@127.0.0.1:1/indexer"));
    const result = await inChild(project, ["config", "check", file]);
    expect(result.stdout).toMatch(/^type check \(TypeScript 5\.9\.\d+, noEmit\): passed$/m);
    expect(result.stdout).toMatch(/^configuration \(CF-1, CF-3\): passed$/m);
    expect(result.code).toBe(EXIT.ok);
  });

  it('a .ts file under "type": "commonjs": the compiler and Node.js both refuse its import and export', async () => {
    project.write("cjs-package/package.json", '{ "type": "commonjs" }\n');
    const file = project.write("cjs-package/umbradb.config.ts", coreOnly("postgres://indexer@127.0.0.1:1/indexer"));
    const result = await inChild(project, ["config", "check", file]);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toMatch(/\[TS1295\]$/m);
    expect(result.stdout).toMatch(/\[invalid-configuration load-failed\]$/m);
  });
});

describe.each(CLI_BACKENDS.map((make) => make()))("A35: umbradb config check --database on $name", (backend) => {
  const pglite = backend.password === null;
  const history = [coreEntry({ start: 0, config: { network: "preprod", node: "ws://n", database: "pglite:memory" } })];

  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** The file: core from 0 with `retainStates`, the opt-in on PGlite. */
  const fileWith = (name: string, retainStates: number) =>
    project.write(
      name,
      coreOnly("postgres://indexer@127.0.0.1:1/indexer", { retainStates, ...(pglite ? { developmentOptIn: true } : {}) }),
    );

  it("reports changes-past for a changed recorded entry, exits non-zero, and leaves the database unchanged", async () => {
    const target = await backend.target();
    await target.setup(history, 20n);
    const before = await target.snapshot();
    const result = await inChild(project, ["config", "check", fileWith("changed.config.ts", 3), "--database", target.url]);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toMatch(/^ {2}entries\[0\]\.config\.retainStates \(core from 0\): .* \[changes-past data\]$/m);
    expect(result.stdout).toMatch(/^failed: 1 finding$/m);
    expect(await target.snapshot()).toEqual(before);
    if (backend.password !== null) expect(`${result.stdout}${result.stderr}`).not.toContain(backend.password);
    const same = await inChild(project, ["config", "check", fileWith("same.config.ts", 0), "--database", target.url]);
    expect(same.code).toBe(EXIT.ok);
    expect(await target.snapshot()).toEqual(before);
  });

  if (pglite) {
    it("a PGlite database another process holds is not read: writer-lock-held, exit 1", async () => {
      const target = await backend.target();
      await target.setup(history, 20n);
      const lock = await acquirePgliteLock(target.url.slice("pglite:".length));
      try {
        const result = await inChild(project, ["config", "check", fileWith("held.config.ts", 0), "--database", target.url]);
        expect(result.code).toBe(EXIT.failed);
        expect(result.stdout).toMatch(
          /^ {2}--database: another process holds the PGlite data directory's lock .* \[writer-lock-held\]$/m,
        );
      } finally {
        lock?.endUse();
      }
    });
  }
});
