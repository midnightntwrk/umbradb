import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import ts from "typescript";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  type BrowserBuild,
  browserLedgerEntry,
  buildBrowser,
  REPOSITORY,
  SUBSTITUTES,
  UNAVAILABLE,
  unavailableModule,
} from "../../browser/build.js";
import { TEST_CONFIGURATION } from "./browser-harness.js";

/**
 * The browser build itself, statically (task 16.1; `design.md` §9.2): what `npm run build:browser` writes, that the
 * workers bundle UmbraDB's own modules and only the replacements `browser/build.ts` names, that every replacement
 * gives what `src/` imports from the module it replaces, that a built-in module of Node.js no replacement covers fails
 * the build by name, and the rewrite of the vendored ledger packages' Node.js entries.
 */

const directories: string[] = [];
const temporary = (prefix: string): string => {
  const directory = mkdtempSync(join(tmpdir(), prefix));
  directories.push(directory);
  return directory;
};

let defaultBuild: BrowserBuild;
let testBuild: BrowserBuild;

beforeAll(async () => {
  defaultBuild = await buildBrowser({ outdir: temporary("umbradb-build-") });
  testBuild = await buildBrowser({ outdir: temporary("umbradb-build-"), configuration: TEST_CONFIGURATION });
}, 300_000);

afterAll(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

/** The value names a TypeScript file exports (functions, classes, variables, `export { … }`), types left out. */
function valueExports(file: string): Set<string> {
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.ES2023, true);
  const names = new Set<string>();
  const exported = (node: ts.Node): boolean =>
    ts.canHaveModifiers(node) && (ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
  for (const statement of source.statements) {
    if ((ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) && exported(statement) && statement.name) {
      names.add(statement.name.text);
    } else if (ts.isVariableStatement(statement) && exported(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
      }
    } else if (ts.isExportDeclaration(statement) && !statement.isTypeOnly && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) if (!element.isTypeOnly) names.add(element.name.text);
    }
  }
  return names;
}

/** Every `.ts` file under `directory`. */
function sources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? sources(join(directory, entry.name)) : entry.name.endsWith(".ts") ? [join(directory, entry.name)] : [],
  );
}

/**
 * The value names the bundled files of `src/` (those of `bundled`) import from `target` (a path in the repository),
 * with the importing files.
 */
function importedFrom(target: string, bundled: readonly string[]): Map<string, string[]> {
  const found = new Map<string, string[]>();
  for (const file of sources(join(REPOSITORY, "src")).filter((path) => bundled.includes(relative(REPOSITORY, path)))) {
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.ES2023, true);
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const specifier = statement.moduleSpecifier.text;
      if (!specifier.startsWith(".")) continue;
      const path = relative(REPOSITORY, resolve(dirname(file), specifier.replace(/\.js$/, ".ts"))).split("\\").join("/");
      const clause = statement.importClause;
      if (path !== target || clause === undefined || clause.isTypeOnly) continue;
      const bindings = clause.namedBindings;
      if (bindings !== undefined && ts.isNamedImports(bindings)) {
        for (const element of bindings.elements) {
          if (element.isTypeOnly) continue;
          const name = (element.propertyName ?? element.name).text;
          found.set(name, [...(found.get(name) ?? []), relative(REPOSITORY, file)]);
        }
      }
    }
  }
  return found;
}

describe("the browser build (task 16.1)", () => {
  it("writes the page, the core, private and ledger workers, PGlite's and pglite-tools' files and the ledger packages' WebAssembly", () => {
    for (const build of [defaultBuild, testBuild]) {
      for (const file of [
        "index.html",
        "page.js",
        "core-worker.js",
        "private-worker.js",
        "ledger-worker.js",
        "pglite.wasm",
        "pglite.data",
        "initdb.wasm",
        "pg_dump.wasm",
        "ledger/v8/midnight_ledger_wasm_bg.wasm",
        "ledger/v9/midnight_ledger_wasm_v9_bg.wasm",
      ]) {
        expect(build.files, file).toContain(file);
      }
      // Each bundle imports nothing: everything it runs is in it (PGlite's Node.js paths stay dynamic, never reached).
      expect(build.staticImports).toEqual({ "page.js": [], "core-worker.js": [], "private-worker.js": [], "ledger-worker.js": [] });
    }
  });

  it("bundles UmbraDB's own runner, database API, ledger worker and process transport, and none of the replaced modules", () => {
    for (const shared of [
      "src/runner/process.ts",
      "src/runner/loop.ts",
      "src/db/pglite.ts",
      "src/db/migrate.ts",
      "src/determinism/contents-hash.ts",
      "src/node/client.ts",
      "src/backbone/core-block-fetch/node-source.ts",
      "src/ledger/worker/host.ts",
      "src/ledger/worker/entry.ts",
      "src/ledger/load.ts",
      "src/private/core-transport.ts",
      "src/private/private-transport.ts",
      "src/admin/process-admin.ts",
      "src/cli/build-modules.ts",
      // The page's backup and restore (BK-5): the same backup text and restore as the commands', and pglite-tools.
      "src/backup/pglite-backup.ts",
      "src/backup/restore.ts",
      "src/backup/text.ts",
      "node_modules/@electric-sql/pglite-tools/dist/pg_dump.js",
    ]) {
      expect(testBuild.inputs, shared).toContain(shared);
    }
    // `umbradb backup`'s file writer is the stub, never the module (it runs pg_dump and writes files).
    expect(testBuild.inputs).not.toContain("src/backup/backup.ts");
    for (const [replaced, replacement] of Object.entries(SUBSTITUTES)) {
      expect(testBuild.inputs, replaced).not.toContain(replaced);
      expect(testBuild.inputs).toContain(replacement);
    }
    for (const left of ["src/runner/api-server.ts", "src/admin/serve.ts", "src/admin/worker.ts", "src/config/load.ts"]) {
      expect(testBuild.inputs, left).not.toContain(left);
    }
    expect(testBuild.inputs.some((input) => input.includes("node_modules/postgres/"))).toBe(false);
    expect(testBuild.inputs.some((input) => /node_modules\/ws\//.test(input))).toBe(false);
  });

  it("gives, in each replacement, every value the bundled files of src/ import from the module it replaces", () => {
    for (const [replaced, replacement] of Object.entries(SUBSTITUTES)) {
      const exported = valueExports(join(REPOSITORY, replacement));
      const missing = [...importedFrom(replaced, testBuild.inputs)].filter(([name]) => !exported.has(name)).map(([name, files]) => `${name} (${files.join(", ")})`);
      expect(missing, `${replacement} lacks what src/ imports from ${replaced}`).toEqual([]);
    }
  });

  it("fails, naming it, on a built-in module of Node.js that no replacement covers", async () => {
    const directory = temporary("umbradb-build-");
    const configuration = join(directory, "configuration.ts");
    writeFileSync(configuration, `import { platform } from "node:os";\nexport default { core: () => ({ data: platform(), modules: [] }) };\n`);
    await expect(buildBrowser({ outdir: join(directory, "out"), configuration })).rejects.toThrow(/node:os, imported by .*configuration\.ts, has no browser replacement/);
  });

  it("bundles a module the browser does not carry as one whose exports fail when used, so its importers still build", async () => {
    expect(UNAVAILABLE).toEqual(["src/backup/backup.ts"]);
    const stub = unavailableModule(
      [
        'import { x } from "./x.js";',
        "export interface Shape { a: number }",
        "export type Kind = string;",
        "export async function writeIt(a: number): Promise<void> { return x(a); }",
        "export function plain() { return 1; }",
        "function hidden() {}",
        "export class Thing { constructor(readonly n: number) {} }",
        "export const LIMIT = 3, OTHER = 4;",
      ].join("\n"),
      "src/fake.ts",
    );
    const module = (await import(`data:text/javascript,${encodeURIComponent(stub)}`)) as Record<string, unknown>;
    expect(Object.keys(module).sort()).toEqual(["LIMIT", "OTHER", "Thing", "plain", "writeIt"]);
    expect(() => (module.writeIt as () => unknown)()).toThrow("writeIt of src/fake.ts is not available in the browser build");
    expect(() => (module.plain as () => unknown)()).toThrow("plain of src/fake.ts is not available in the browser build");
    expect(() => new (module.Thing as new () => unknown)()).toThrow("Thing of src/fake.ts is not available in the browser build");
    expect(module.LIMIT).toBeUndefined();

    // In a build: a configuration importing an unavailable module still bundles; the stub stands in its place.
    const directory = temporary("umbradb-build-");
    const fake = join(directory, "fake.ts");
    writeFileSync(fake, 'import { platform } from "node:os";\nexport function readIt(path: string) { return `${platform()} ${path}`; }\n');
    writeFileSync(
      join(directory, "configuration.ts"),
      'import { readIt } from "./fake.js";\nexport default { core: () => ({ data: readIt("x"), modules: [] }) };\n',
    );
    const configuration = join(directory, "configuration.ts");
    const build = await buildBrowser({ outdir: join(directory, "out"), configuration, unavailable: [...UNAVAILABLE, fake] });
    // The stub, not the file, is bundled (esbuild names it by its namespace).
    expect(build.inputs.filter((input) => input.endsWith("fake.ts"))).toEqual([`umbradb-unavailable:${fake}`]);
    expect(readFileSync(join(build.outdir, "core-worker.js"), "utf8")).toContain("is not available in the browser build");
    // Without it listed, the same module's node:fs fails the build.
    await expect(buildBrowser({ outdir: join(directory, "out2"), configuration, unavailable: UNAVAILABLE })).rejects.toThrow(
      /node:os, imported by .*fake\.ts, has no browser replacement/,
    );
  });

  it("rewrites each vendored ledger package's Node.js entry to read its WebAssembly beside the worker, checked against SHA256SUMS", () => {
    for (const [version, lib] of [
      ["v8", "midnight_ledger_wasm"],
      ["v9-rc3", "midnight_ledger_wasm_v9"],
      ["v9", "midnight_ledger_wasm_v9"],
    ] as const) {
      const pkg = join(REPOSITORY, "vendor/ledger", version);
      const entry = readFileSync(join(pkg, "pkg", `${lib}_fs.js`), "utf8");
      const sums = readFileSync(join(pkg, "SHA256SUMS"), "utf8");
      const sum = new RegExp(`^([0-9a-f]{64})  pkg/${lib}_bg\\.wasm$`, "m").exec(sums)?.[1] as string;
      const rewritten = browserLedgerEntry(entry, version, sums);
      expect(rewritten).not.toMatch(/node:|readFileSync|fileURLToPath/);
      expect(rewritten).toContain(
        `const wasmInstance = __instantiateLedger(new URL("./ledger/${version}/${lib}_bg.wasm", globalThis.location.href), "${sum}", "${version} ${lib}_bg.wasm", imports);`,
      );
      expect(rewritten).toContain("__wbg_set_wasm(wasm);");
      expect(() => browserLedgerEntry(entry.replace('import { readFileSync } from "node:fs";\n', ""), version, sums)).toThrow(/update browser\/build\.ts/);
      expect(() => browserLedgerEntry(entry.replace("new WebAssembly.Module", "WebAssembly.Module"), version, sums)).toThrow(/update browser\/build\.ts/);
      expect(() => browserLedgerEntry(entry, version, sums.replace(`pkg/${lib}_bg.wasm`, "pkg/other.wasm"))).toThrow(/lists no pkg\//);
    }
  });
});
