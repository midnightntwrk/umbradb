import { spawnSync } from "node:child_process";
import {
  existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";
import {
  ADDED, buildProblems, coverageProblems, holdsProblems, inventoryProblems, LEGACY_ROOT, legacyPath, legacyProblems,
  MOVED, MOVED_SOURCE, MOVED_TESTS, runProblems, transactionHistoryProblems,
} from "./legacy.js";

/**
 * A3 `[STATIC]` (LS-3, task 17.1): "The packed tarball contains no file under `legacy/`; the TypeScript build and the
 * conformance run include no file from `legacy/`; `legacy/transaction-history/` holds the source and its tests."
 *
 * Each list is the real one: the tarball's from `npm pack --dry-run --json` (npm's own rules over `package.json`
 * `files`), the build's from the TypeScript program of `tsconfig.build.json` (every file the compiler reads, the
 * imported ones included), the conformance run's from `vitest list` with the repository's configuration (what
 * `npm run test:conformance` runs), and the coverage and mutation configurations as they are written.
 *
 * Legacy's own TypeScript program and Vitest configuration are kept but no longer run (task 17.2, owner decision
 * Q112 B); the controls below still read them, as lists of what a build or a run of the folder would include.
 *
 * The tarball check here is about `legacy/`; whether a TransactionHistory file is in a tarball built from the tree is
 * the build program's check here (a clean build emits nothing of a source it does not read) and the pack smoke test's
 * on the real tarball (`test/smoke/pack-install.mjs`, after a clean build): this run builds nothing, and a `dist/`
 * left over from an earlier build is not the tree's.
 */

// Each test starts the TypeScript compiler on a whole program, npm or Vitest (a second or two alone); under the full
// parallel run they get the time a loaded machine needs.
vi.setConfig({ testTimeout: 120_000 });

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const VITEST_CLI = path.join(ROOT, "node_modules", "vitest", "vitest.mjs");

/** A repository-relative POSIX path. */
function repoPath(absolute: string): string {
  return path.relative(ROOT, absolute).split(path.sep).join("/");
}

/**
 * The repository's files of the TypeScript program a configuration describes (a path from the root, or absolute): its
 * root files and every file they import, packages' files and files outside the repository left out.
 */
function programFiles(configFile: string): string[] {
  const parsed = ts.getParsedCommandLineOfConfigFile(path.resolve(ROOT, configFile), undefined, {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
      throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    },
  });
  if (parsed === undefined || parsed.errors.length > 0) {
    const errors = parsed?.errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, "\n"));
    throw new Error(`${configFile}: ${errors?.join("\n")}`);
  }
  const program = ts.createProgram({ rootNames: parsed.fileNames, options: parsed.options });
  return program
    .getSourceFiles()
    .map((file) => repoPath(file.fileName))
    .filter((file) => !file.startsWith("../") && !file.split("/").includes("node_modules"));
}

/** The paths `npm pack` would put in the tarball of the package at `dir`. */
function packedPaths(dir: string): string[] {
  const pack = spawnSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd: dir,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (pack.status !== 0) throw new Error(`npm pack --dry-run failed (${pack.status}):\n${pack.stderr}`);
  const [entry] = JSON.parse(pack.stdout.slice(pack.stdout.indexOf("["))) as { files: { path: string }[] }[];
  return entry!.files.map((file) => file.path);
}

/** The test files `vitest run` would run, with the repository's configuration or the one given. */
function runFiles(args: readonly string[] = []): string[] {
  const list = spawnSync(process.execPath, [VITEST_CLI, "list", "--filesOnly", "--json", ...args], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (list.status !== 0) throw new Error(`vitest list failed (${list.status}):\n${list.stdout}\n${list.stderr}`);
  return (JSON.parse(list.stdout) as { file: string }[]).map((entry) => repoPath(entry.file));
}

const exists = (file: string): boolean => existsSync(path.join(ROOT, file));

/** Every file below `dir` (a path from the root), as paths from the root; dot files (`.DS_Store`) left out. */
function filesBelow(dir: string): string[] {
  return (readdirSync(path.join(ROOT, dir), { recursive: true }) as string[])
    .map((entry) => `${dir}/${entry.split(path.sep).join("/")}`)
    .filter((file) => !file.split("/").some((segment) => segment.startsWith(".")))
    .filter((file) => statSync(path.join(ROOT, file)).isFile());
}

interface VitestConfig {
  test?: { include?: string[]; coverage?: { include?: string[]; exclude?: string[] } };
}

/**
 * A Vitest configuration file's export, as Vitest reads it. Imported by a computed specifier, so that the configuration
 * files stay outside the repository's TypeScript program, which has never included them (`vitest.config.ts` does not
 * type-check as it is: `docs/issues/00017-vitest-config-not-type-checked.md`).
 */
async function vitestConfig(file: string): Promise<VitestConfig> {
  return ((await import(pathToFileURL(path.join(ROOT, file)).href)) as { default: VitestConfig }).default;
}

describe("A3: TransactionHistory is kept outside the build, the package and the run (LS-3)", () => {
  it("legacy/transaction-history/ holds the source and its tests, and nothing is left at the 0.9.5 paths", () => {
    expect(holdsProblems(exists)).toEqual([]);
    const found = filesBelow(LEGACY_ROOT);
    expect(inventoryProblems(found)).toEqual([]); // and nothing else, so the inventory is exact
    expect(found).toHaveLength(MOVED.length + ADDED.length);
    // The inventory is the source and its tests (task 17.2 retired the benchmark workload), not an empty list.
    expect(MOVED_SOURCE.length).toBeGreaterThan(0);
    expect(MOVED_TESTS.filter((file) => file.endsWith(".test.ts")).length).toBeGreaterThan(0);
  });

  it("the TypeScript build (tsconfig.build.json's program) reads no file of legacy/ or of TransactionHistory", () => {
    const files = programFiles("tsconfig.build.json");
    expect(files).toContain("src/index.ts"); // the list is the build's
    expect(buildProblems("the TypeScript build", files)).toEqual([]);
  });

  it("the repository's program (tsconfig.json, the typecheck's) reads no file of legacy/: nothing imports it", () => {
    const files = programFiles("tsconfig.json");
    expect(files).toContain("test/library-surface/legacy-excluded.test.ts");
    expect(runProblems("the repository's TypeScript program", files)).toEqual([]);
  });

  it("the packed tarball (npm pack --dry-run) holds no file under legacy/", () => {
    const paths = packedPaths(ROOT);
    expect(paths).toContain("package.json");
    expect(legacyProblems("the tarball", paths)).toEqual([]);
  });

  it("the conformance run (vitest list with the repository's configuration) runs no legacy/ file or moved test", () => {
    const files = runFiles();
    expect(files).toContain("test/library-surface/legacy-excluded.test.ts");
    expect(runProblems("the conformance run", files)).toEqual([]);
  });

  it("the run's coverage measures no file of legacy/, and the mutation run neither mutates nor runs one", async () => {
    const coverage = (await vitestConfig("vitest.config.ts")).test?.coverage;
    expect(coverage?.include).toBeDefined();
    expect(coverageProblems(coverage!.include!, coverage!.exclude ?? [])).toEqual([]);
    const stryker = JSON.parse(readFileSync(path.join(ROOT, "stryker.conf.json"), "utf8")) as { mutate: string[] };
    const mutationRun = [...stryker.mutate, ...((await vitestConfig("vitest.mutation.config.ts")).test?.include ?? [])];
    expect(mutationRun.length).toBeGreaterThan(0);
    expect(runProblems("the mutation run", mutationRun)).toEqual([]);
  });
});

describe("A3's negative controls: each list that holds legacy/ or TransactionHistory fails", () => {
  it("a tarball listing with a file under legacy/, or with a TransactionHistory source's build output, fails", () => {
    const source = legacyPath("src/postgres/transaction-history-storage.ts");
    expect(legacyProblems("the tarball", ["package.json", "dist/index.js", source])).toEqual([
      `the tarball includes ${source}, a file under legacy/ (A3, LS-3)`,
    ]);
    const stale = [
      "package.json", "dist/postgres/transaction-history-storage.js", "dist/interfaces/storage-errors.js",
      "dist/postgres/migrations/004_transaction_history.js", "dist/interfaces/TransactionHistoryStorage.d.ts",
      "dist/private/txHistory.js", "dist/config/history.js",
    ];
    expect(transactionHistoryProblems("the tarball", stale)).toEqual([
      "the tarball includes dist/postgres/transaction-history-storage.js, a TransactionHistory file (LS-3)",
      "the tarball includes dist/postgres/migrations/004_transaction_history.js, a TransactionHistory file (LS-3)",
      "the tarball includes dist/interfaces/TransactionHistoryStorage.d.ts, a TransactionHistory file (LS-3)",
      "the tarball includes dist/private/txHistory.js, a TransactionHistory file (LS-3)",
    ]);
  });

  it("npm packs legacy/ once `files` names it, which fails A3; with the repository's `files` it packs none", () => {
    const { files } = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8")) as { files: string[] };
    const dir = mkdtempSync(path.join(tmpdir(), "umbradb-a3-"));
    try {
      const legacyFile = legacyPath("src/postgres/transaction-history-storage.ts");
      for (const file of ["dist/index.js", "README.md", legacyFile]) {
        mkdirSync(path.join(dir, path.dirname(file)), { recursive: true });
        writeFileSync(path.join(dir, file), "// A3 control\n");
      }
      const pack = (packageFiles: readonly string[]): string[] => {
        const manifest = { name: "a3-control", version: "0.0.0", files: packageFiles };
        writeFileSync(path.join(dir, "package.json"), JSON.stringify(manifest));
        return packedPaths(dir);
      };
      const withRepositoryFiles = pack(files);
      expect(withRepositoryFiles).toContain("dist/index.js");
      expect(legacyProblems("the tarball", withRepositoryFiles)).toEqual([]);
      expect(legacyProblems("the tarball", pack([...files, "legacy"]))).toEqual([
        `the tarball includes ${legacyFile}, a file under legacy/ (A3, LS-3)`,
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("a run's file list with a legacy/ test fails, and so does the list legacy's own Vitest configuration runs", () => {
    const test = legacyPath("test/postgres/transaction-history-storage.test.ts");
    expect(runProblems("the conformance run", ["test/db/migrate.test.ts", test])).toEqual([
      `the conformance run includes ${test}, a file under legacy/ (A3, LS-3)`,
    ]);
    const old = "test/postgres/transaction-history-storage.test.ts";
    expect(runProblems("the conformance run", [old])).toEqual([
      `the conformance run includes ${old}, TransactionHistory's, whose place is ${test} (LS-3)`,
    ]);
    const legacyRun = runFiles(["--config", `${LEGACY_ROOT}/vitest.config.ts`]);
    expect(legacyRun).toContain(test);
    expect(runProblems("legacy's own run", legacyRun)).toContain(
      `legacy's own run includes ${test}, a file under legacy/ (A3, LS-3)`,
    );
  });

  it("a build reading legacy/ fails (legacy's own TypeScript program), and so does a TransactionHistory source", () => {
    const legacyProgram = programFiles(`${LEGACY_ROOT}/tsconfig.json`);
    const source = legacyPath("src/postgres/transaction-history-storage.ts");
    expect(legacyProgram).toContain(source);
    expect(buildProblems("legacy's program", legacyProgram)).toContain(
      `legacy's program includes ${source}, a file under legacy/ (A3, LS-3)`,
    );
    // Reported once, as legacy's, and the wallet SDK's own `TransactionHistoryStorage.d.ts` it reads is a package's.
    expect(buildProblems("the build", [source])).toEqual([
      `the build includes ${source}, a file under legacy/ (A3, LS-3)`,
    ]);
    expect(transactionHistoryProblems("legacy's program", legacyProgram)).toEqual([]);
    const old = "src/postgres/transaction-history-storage.ts";
    expect(buildProblems("the TypeScript build", ["src/index.ts", old])).toEqual([
      `the TypeScript build includes ${old}, TransactionHistory's, whose place is ${source} (LS-3)`,
    ]);
    expect(buildProblems("the TypeScript build", ["src/index.ts", "src/private/tx-history.ts"])).toEqual([
      "the TypeScript build includes src/private/tx-history.ts, a TransactionHistory file (LS-3)",
    ]);
  });

  it("a program whose file imports one of legacy/ reads it, which fails A3: the programs follow imports", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "umbradb-a3-"));
    try {
      const target = path.join(ROOT, legacyPath("src/postgres/transaction-history-storage.js"));
      const importer = `export type { PgTransactionHistoryStorage } from ${JSON.stringify(target)};\n`;
      writeFileSync(path.join(dir, "importer.ts"), importer);
      const options = { module: "nodenext", moduleResolution: "nodenext", target: "es2023", noEmit: true };
      const config = { compilerOptions: { ...options, skipLibCheck: true }, files: ["importer.ts"] };
      writeFileSync(path.join(dir, "tsconfig.json"), JSON.stringify(config));
      const source = legacyPath("src/postgres/transaction-history-storage.ts");
      expect(legacyProblems("the importer's program", programFiles(path.join(dir, "tsconfig.json")))).toContain(
        `the importer's program includes ${source}, a file under legacy/ (A3, LS-3)`,
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("coverage globs that reach legacy/, or a mutation target or test in it, fail", () => {
    expect(coverageProblems(["**/*.ts"], [])).toContain(
      `the run's coverage includes ${legacyPath("src/postgres/transaction-history-storage.ts")}, a file under legacy/ `
        + "(A3, LS-3)",
    );
    expect(coverageProblems(["**/*.ts"], ["legacy/**"])).toEqual([]);
    // Vitest matches the globs anywhere in a file's path, so the run's own `include` reaches legacy's `src/`; only the
    // `legacy/**` exclusion keeps it out.
    expect(coverageProblems(["src/**/*.ts", "tools/**/*.ts"], [])).toEqual(
      MOVED_SOURCE.map((file) => `the run's coverage includes ${legacyPath(file)}, a file under legacy/ (A3, LS-3)`),
    );
    expect(coverageProblems(["src/**/*.ts", "tools/**/*.ts"], ["legacy/**"])).toEqual([]);
    expect(coverageProblems(["tools/**/*.ts", "legacy/transaction-history/*.ts"], [])).toEqual([
      `the run's coverage includes ${legacyPath("vitest.config.ts")}, a file under legacy/ (A3, LS-3)`,
    ]);
    const target = legacyPath("src/postgres/transaction-history-storage.ts");
    expect(runProblems("the mutation run", ["src/postgres/temporal-kv.ts", target])).toEqual([
      `the mutation run includes ${target}, a file under legacy/ (A3, LS-3)`,
    ]);
  });

  it("a moved file missing from legacy/, or one left at its 0.9.5 path, fails", () => {
    const moved = new Set([...MOVED.map(legacyPath), ...ADDED]);
    const missing = legacyPath("test/postgres/reference-merge.ts");
    expect(holdsProblems((file) => moved.has(file) && file !== missing)).toEqual([
      `${missing} is missing: A3 wants it in ${LEGACY_ROOT}/`,
    ]);
    expect(holdsProblems((file) => moved.has(file) || file === "src/postgres/transaction-history-storage.ts")).toEqual([
      `src/postgres/transaction-history-storage.ts is still at its 0.9.5 path (LS-3: ${legacyPath(MOVED[1]!)})`,
    ]);
    expect(holdsProblems((file) => moved.has(file) && file !== ADDED[2])).toEqual([`${ADDED[2]} is missing`]);
    expect(holdsProblems((file) => moved.has(file))).toEqual([]);
    const stray = legacyPath("test/postgres/notes.ts");
    expect(inventoryProblems([...moved, stray])).toEqual([
      `${stray} is in ${LEGACY_ROOT}/ but not in A3's inventory (legacy.ts)`,
    ]);
    expect(inventoryProblems(moved)).toEqual([]);
  });

  it("only legacy/ itself and the files below it are legacy/'s; a name starting with or holding it is not", () => {
    const paths = ["legacy", "legacy/other/notes.md", "legacy.md", "legacyx/a.ts", "src/legacy/a.ts", "docs/legacy/b"];
    expect(legacyProblems("the list", paths)).toEqual([
      "the list includes legacy, a file under legacy/ (A3, LS-3)",
      "the list includes legacy/other/notes.md, a file under legacy/ (A3, LS-3)",
    ]);
  });
});
