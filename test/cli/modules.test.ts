import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { buildDeclarations, commandBuild } from "../../src/cli/build-modules.js";
import { EXIT } from "../../src/cli/command.js";
import { configCheck, type ConfigCheckReport } from "../../src/cli/config-check.js";
import { loadConfig } from "../../src/config/load.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { type CliProject, cliProject, inProcess, lineOf } from "./cli-fixtures.js";
import { runCoreSettings, statsConfig, statsModule } from "./run-fixtures.js";

/**
 * A152 `[CI]`, its `umbradb config check` half (task 4.4a; CF-1, CF-10, MD-1, owner decision Q106 B), through
 * `configCheck` and the command in this process: a configuration file that imports the user module `stats`, exports
 * `modules = [stats]` and lists `stats.entry({ … })` is checked against `stats`'s schema — a wrong setting reported with
 * its path —, and a file listing a module that neither it exports nor UmbraDB ships is refused, naming the module. Also
 * how the file's modules join the build (after UmbraDB's own, in the file's order; a module listed twice, one with an
 * id of UmbraDB's own, an element that is no declaration, a `modules` export that is no list) and the committed
 * negative control: a check that ignores the file's modules refuses `stats`'s entry. `./run.test.ts` has `umbradb run`.
 */

// Each test runs the TypeScript compiler on a file (about a second alone, much more under the gate's load).
vi.setConfig({ testTimeout: 60_000 });

let project: CliProject;
/** A database URL no check opens (no test here passes --database). */
const DATABASE = "postgres://checker:pw-4-4a-MODULES@127.0.0.1:9/indexer";
const NODE = "ws://127.0.0.1:9944";

beforeAll(async () => {
  project = await cliProject();
  project.write("stats.ts", statsModule(project.builders));
  project.write("prices.ts", statsModule(project.builders, "prices"));
  project.write("core-tx-results.ts", statsModule(project.builders, "core-tx-results"));
}, 120_000);

afterAll(() => project?.remove());

/** Writes a configuration file under its own name (Node.js caches a file's first evaluation) and returns its path. */
let files = 0;
function write(options: Partial<Parameters<typeof statsConfig>[1]> = {}): string {
  files += 1;
  return project.write(`modules-${files}.config.ts`, statsConfig(project.builders, { core: runCoreSettings(DATABASE, NODE), ...options }));
}

/** The findings of `step` in `report`, as `code path` lines. */
function codesOf(report: ConfigCheckReport, step: string): string[] {
  const found = report.steps.find((one) => one.name === step);
  return (found?.findings ?? []).map((finding) => `${finding.code} ${finding.path}`);
}

const check = (file: string) => inProcess(["config", "check", file], project.dir);

describe("A152: umbradb config check takes the user modules the file exports (CF-1, CF-10, Q106 B)", () => {
  it("a file that exports modules = [stats] and lists stats.entry passes: the entry is checked against stats's schema", async () => {
    const file = write();
    const result = await check(file);
    expect(result.stderr).toBe("");
    expect(result.code).toBe(EXIT.ok);
    expect(result.stdout).toContain("configuration (CF-1, CF-3): passed");
    // The entry was validated with stats's schema: its default applied, its data field classified.
    const report = await configCheck({ file, cwd: project.dir });
    expect(report.passed).toBe(true);
  });

  it("a wrong setting of stats is reported with its path, by the type check and the schema check, and exits 1", async () => {
    const file = write({ statsConfig: '{ label: "s", pollMs: 0 }' });
    const result = await check(file);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toMatch(
      /^ {2}entries\[1\]\.config\.pollMs \(stats from 1\): Too small: expected number to be >=1 \(CF-3\) \[invalid-configuration settings-schema\]$/m,
    );
    const typed = write({ statsConfig: '{ label: "s", pollMs: "fast" }' });
    const both = await check(typed);
    expect(both.code).toBe(EXIT.failed);
    const line = lineOf(statsConfig(project.builders, { core: runCoreSettings(DATABASE, NODE), statsConfig: '{ label: "s", pollMs: "fast" }' }), "stats.entry");
    expect(both.stdout).toMatch(new RegExp(`${typed.replaceAll(".", "\\.")}:${line}:\\d+: Type 'string' is not assignable to type 'number'\\. \\[TS2322\\]`));
    expect(both.stdout).toMatch(/entries\[1\]\.config\.pollMs \(stats from 1\): .*\[invalid-configuration settings-schema\]/);
  });

  it("an unknown setting and a missing required one of stats are reported with their paths", async () => {
    const report = await configCheck({ file: write({ statsConfig: '{ lable: "a-label" } as never' }), cwd: project.dir });
    expect(codesOf(report, "configuration")).toEqual(
      expect.arrayContaining([
        "invalid-configuration settings-unknown entries[1].config.lable",
        "invalid-configuration settings-schema entries[1].config.label",
      ]),
    );
  });

  it("a file listing stats that it does not export is refused, naming stats (UmbraDB ships no such module)", async () => {
    const result = await check(write({ modules: null }));
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toMatch(/^ {2}entries\[1\]\.id \(stats from 1\): this build has no module stats: .*modules list.*\[invalid-configuration entry-id\]$/m);
  });

  it("a file exporting other modules than the one it lists is refused, naming the module it lists", async () => {
    const report = await configCheck({
      file: write({ modules: "[prices]", before: ['import { prices } from "./prices.ts";'] }),
      cwd: project.dir,
    });
    expect(report.passed).toBe(false);
    expect(codesOf(report, "configuration")).toEqual(["invalid-configuration entry-id entries[1].id"]);
    expect(report.steps[1]?.findings[0]?.message).toContain("this build has no module stats");
    expect(report.steps[1]?.findings[0]?.message).toContain("prices");
  });

  it("a module the file exports but lists no entry of is part of the build, off (MD-3: enabled by an entry)", async () => {
    const report = await configCheck({
      file: write({ modules: "[stats, prices]", before: ['import { prices } from "./prices.ts";'] }),
      cwd: project.dir,
    });
    expect(report.passed).toBe(true);
  });

  it("UmbraDB's own core modules are still checked next to the file's (user and system modules)", async () => {
    const report = await configCheck({
      file: write({ entries: ['{ id: "core-tx-results", start: 1, version: "nine", config: {} }'] }),
      cwd: project.dir,
    });
    expect(codesOf(report, "configuration")).toEqual(["invalid-configuration entry-version entries[2].version"]);
  });
});

describe("how the file's modules join the build (Q106 B)", () => {
  it("they are the build's user modules, in the file's order, after UmbraDB's own backbone parts and core modules", async () => {
    const loaded = await loadConfig({
      file: write({ modules: "[prices, stats]", before: ['import { prices } from "./prices.ts";'] }),
    });
    const build = buildDeclarations(loaded.modules);
    expect(build.user.map((module) => module.id)).toEqual(["prices", "stats"]);
    expect(build.backbone).toEqual(buildDeclarations().backbone);
    expect(build.core).toEqual(buildDeclarations().core);
    // The declarations themselves, not copies: the callbacks are the file's; the list a frozen copy of the file's.
    expect(build.user[1]).toBe(loaded.modules[1]);
    expect(Object.isFrozen(loaded.modules)).toBe(true);
  });

  it("a module listed twice is refused (duplicate-id) at its second place", async () => {
    const report = await configCheck({ file: write({ modules: "[stats, stats]" }), cwd: project.dir });
    expect(report.passed).toBe(false);
    expect(codesOf(report, "configuration")).toEqual(["duplicate-id modules[1]"]);
    expect(report.steps[1]?.note).toContain("the entries were not validated");
  });

  it("a user module with the id of one of UmbraDB's own is refused (reserved-prefix), never taken for it", async () => {
    const report = await configCheck({
      file: write({ modules: "[stats, coretxresults]", before: ['import { coretxresults } from "./core-tx-results.ts";'] }),
      cwd: project.dir,
    });
    expect(codesOf(report, "configuration")).toEqual(["reserved-prefix modules[1]"]);
    expect(report.steps[1]?.findings[0]?.message).toContain("core-tx-results");
  });

  it("an element that is no declaration is refused (invalid-declaration) at its place, with its field", async () => {
    const report = await configCheck({ file: write({ modules: '[stats, { id: "x" }] as never' }), cwd: project.dir });
    expect(codesOf(report, "configuration")).toEqual(["invalid-declaration modules[1].version"]);
    const five = await configCheck({ file: write({ modules: "[5] as never" }), cwd: project.dir });
    expect(codesOf(five, "configuration")).toEqual(["invalid-declaration modules[0]"]);
  });

  it("a modules export that is not a list is refused by the loader (modules-not-a-list) at the file", async () => {
    const file = write({ modules: "stats as never" });
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "configuration")).toEqual([`invalid-configuration modules-not-a-list ${file}`]);
    expect(report.steps[1]?.findings[0]?.message).toContain("export const modules = [stats]");
  });

  it("a private process's build: core-chain, the private backbone, the admin parts, no core module, the file's modules", () => {
    const secret = { id: "secret" };
    const build = commandBuild([secret], { side: "private" });
    expect(build.backbone.map((part) => (part as { id: string }).id)).toEqual([
      "core-chain",
      "core-private-source",
      "core-key-registry",
      "core-digest",
      "core-health",
      "core-status",
      "core-config",
    ]);
    expect(build.core).toEqual([]);
    expect(build.user).toEqual([secret]);
    expect(commandBuild([secret]).backbone.map((part) => (part as { id: string }).id)).toEqual(
      buildDeclarations().backbone.map((part) => part.id),
    );
  });

  it("a private file is checked against the private build: an entry of a private backbone part is named as one", async () => {
    files += 1;
    const settings = { network: "preprod", database: DATABASE, instanceId: "instance-1" };
    const file = project.write(
      `modules-${files}-private.config.ts`,
      [
        `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
        "export default defineConfig({ entries: [",
        `  coreEntry({ start: 1, config: ${JSON.stringify(settings)} }),`,
        '  { id: "core-private-source", start: 1, version: "1.0.0", config: {} },',
        "] });",
        "",
      ].join("\n"),
    );
    const report = await configCheck({ file, cwd: project.dir });
    expect(codesOf(report, "configuration")).toEqual(["invalid-configuration entry-id entries[1].id"]);
    expect(report.steps[1]?.findings[0]?.message).toContain("core-private-source is a backbone part");
  });

  it("a file without the export has no user modules; the command's build is UmbraDB's own", async () => {
    const loaded = await loadConfig({ file: write({ modules: null }) });
    expect(loaded.modules).toEqual([]);
    expect(Object.isFrozen(loaded.modules)).toBe(true);
    expect(commandBuild(loaded.modules).user).toEqual([]);
  });

  it("a host program's own declarations are used as given: the file's modules are then not taken", async () => {
    const build = buildDeclarations();
    const declarations = validateDeclarations({ backbone: build.backbone, core: build.core, user: [] });
    const report = await configCheck({ file: write(), cwd: project.dir, declarations });
    expect(codesOf(report, "configuration")).toEqual(["invalid-configuration entry-id entries[1].id"]);
  });
});

describe("negative control (committed): a check that ignores the file's modules", () => {
  it("refuses stats's entry as naming no module of the build, where the check of A152 passes it", async () => {
    const file = write();
    const ignoring = await configCheck({ file, cwd: project.dir }, { userModules: () => [] });
    expect(ignoring.passed).toBe(false);
    expect(codesOf(ignoring, "configuration")).toEqual(["invalid-configuration entry-id entries[1].id"]);
    expect(ignoring.text).toContain("this build has no module stats");
    expect((await configCheck({ file, cwd: project.dir })).passed).toBe(true);
  });
});
