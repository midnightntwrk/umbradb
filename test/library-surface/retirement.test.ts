import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import { describe, expect, it, vi } from "vitest";
import {
  EXPECTED_DEFERRED_COUNT, EXPECTED_REQUIRED_COUNT, type RequiredTestsManifest,
} from "../integration/check-required-tests.js";
import {
  acceptanceIds, exportProblems, floorProblems, KEPT_REQUIRED_IDS, LEAN_FILES, LEAN_ROOT, leanProblems,
  manifestProblems, MUTATION_TARGETS, mutationProblems, PENDING_FLOORS, QUINT_PROPOSAL, quintProblems, RETIRED_DEFERRED_IDS,
  RETIRED_EXPORTS, RETIRED_MUTATION_TARGETS, RETIRED_PATHS, RETIRED_REQUIRED_IDS, retiredFileProblems, retiredPath,
  scriptProblems, section13, SECTION_13_TERMS, sectionProblems, TRUST_IMPORTS,
} from "./retirement.js";

/**
 * A5 `[STATIC]` (LS-5, task 17.2): "A test compares the required-test manifest, `stryker.conf.json` `mutate`, the
 * coverage floors of `vitest.config.ts` and the file list of `Formal/Lean` with the lists in `design.md` §13 and fails on
 * any difference." Each list is read from the tree as the gates read it — the manifest's JSON, Stryker's JSON, the
 * Vitest configurations as Vitest loads them, the files below `Formal/Lean` — and compared with §13's lists, transcribed
 * in `./retirement.ts` and checked against §13's own words. The other rows of §13 are checked the same way: no retired
 * file is left in the tree (git's list), `package.json`'s scripts, the names `src/index.ts` exports (the TypeScript
 * checker's list, types included), the Quint change's status.
 *
 * The negative controls below run each check on a list holding one retired item, or lacking one kept item, and see it
 * fail with the item named; the one on the barrel compiles a module that still exports a retired name.
 */

// The barrel check starts the TypeScript compiler, and `git ls-files` lists the tree: a second or two alone, more under
// the full parallel run.
vi.setConfig({ testTimeout: 120_000 });

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const read = (file: string): string => readFileSync(path.join(ROOT, file), "utf8");

/** Every file below `dir` (a path from the root), as paths from the root; `.lake/` and dot files left out. */
function filesBelow(dir: string): string[] {
  return (readdirSync(path.join(ROOT, dir), { recursive: true }) as string[])
    .map((entry) => `${dir}/${entry.split(path.sep).join("/")}`)
    .filter((file) => !file.split("/").some((segment) => segment.startsWith(".")))
    .filter((file) => statSync(path.join(ROOT, file)).isFile());
}

/** The repository's files as git sees them in the working tree: tracked ones that still exist, and untracked ones. */
function treeFiles(): string[] {
  const listed = spawnSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (listed.status !== 0) throw new Error(`git ls-files failed: ${listed.stderr}`);
  return listed.stdout.split("\0").filter((file) => {
    if (file === "") return false;
    try {
      return statSync(path.join(ROOT, file)).isFile();
    } catch {
      return false; // tracked, but deleted in the working tree
    }
  });
}

/** The names (values and types) a TypeScript module exports, as the compiler resolves them. */
function exportedNames(file: string): string[] {
  const options: ts.CompilerOptions = {
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    target: ts.ScriptTarget.ES2023,
    noEmit: true,
    skipLibCheck: true,
    strict: true,
  };
  const program = ts.createProgram({ rootNames: [file], options });
  const source = program.getSourceFile(file);
  if (source === undefined) throw new Error(`${file}: not in its own program`);
  const checker = program.getTypeChecker();
  const symbol = checker.getSymbolAtLocation(source);
  return symbol === undefined ? [] : checker.getExportsOfModule(symbol).map((exported) => exported.getName());
}

interface VitestConfig {
  test?: {
    include?: string[];
    coverage?: { exclude?: string[]; thresholds?: Record<string, unknown> };
  };
}

/** A Vitest configuration's export, imported by a computed specifier as Vitest loads it (issue 00017). */
async function vitestConfig(file: string): Promise<VitestConfig> {
  return ((await import(pathToFileURL(path.join(ROOT, file)).href)) as { default: VitestConfig }).default;
}

const manifest = JSON.parse(read("test/integration/required-tests.manifest.json")) as RequiredTestsManifest;
const added = acceptanceIds(read("openspec/changes/core-arch/acceptance.md"));
/**
 * `acceptance.md` §17's ids, which task 18.4 adds to the manifest (with the pinned count 4 + 22 = 26, A120's key-half id
 * withdrawn by Q154). Until then they may be absent; task 18.4 empties this list, and the comparison is exact from then
 * on.
 */
const PENDING_UNTIL_18_4: readonly string[] = added;

describe("A5: the gates match design.md §13's retirement list (LS-5)", () => {
  it("design.md §13 still says every item retirement.ts transcribes from it", () => {
    const section = section13(read("openspec/changes/core-arch/design.md"));
    expect(section.length).toBeGreaterThan(1000);
    expect(sectionProblems(section)).toEqual([]);
  });

  it("the required-test manifest: ids 1–4 kept, ids 5–25 and the deferred id retired, the count pinned to the list", () => {
    expect(added).toHaveLength(22); // acceptance.md §17's table, read (Q154 withdrew one)
    expect(manifestProblems(manifest, added, PENDING_UNTIL_18_4, EXPECTED_REQUIRED_COUNT, EXPECTED_DEFERRED_COUNT))
      .toEqual([]);
    for (const entry of manifest.required) expect(read(entry.file!)).toContain(`[[${entry.id}]]`);
  });

  it("stryker.conf.json mutates exactly §13's targets, at break 65, and the mutation run runs their tests", async () => {
    const stryker = JSON.parse(read("stryker.conf.json")) as { mutate: string[]; thresholds: { break: number } };
    const include = (await vitestConfig("vitest.mutation.config.ts")).test?.include ?? [];
    expect(mutationProblems(stryker.mutate, include, stryker.thresholds.break)).toEqual([]);
    for (const file of [...stryker.mutate, ...include]) expect(statSync(path.join(ROOT, file)).isFile(), file).toBe(true);
  });

  it("vitest.config.ts: the retired floors gone, the moved and added ones held, every src/ directory at 90/85", async () => {
    const coverage = (await vitestConfig("vitest.config.ts")).test?.coverage;
    expect(coverage?.thresholds).toBeDefined();
    const srcEntries = readdirSync(path.join(ROOT, "src"), { withFileTypes: true })
      .filter((entry) => !entry.name.startsWith("."))
      .map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name));
    expect(srcEntries).toContain("db/");
    expect(floorProblems(coverage!.thresholds!, coverage!.exclude ?? [], srcEntries, PENDING_FLOORS)).toEqual([]);
  });

  it("Formal/Lean holds exactly §13's files: TemporalKV and Checkpoint gone, the aggregators and APISmoke trimmed", () => {
    const files = filesBelow(LEAN_ROOT);
    expect(files).toContain("Formal/Lean/UmbraDBFormalTest/Trust.lean");
    expect(leanProblems(files, read)).toEqual([]);
    expect(files.sort()).toEqual([...LEAN_FILES].sort());
  });

  it("no file §13 retires is left in the tree", () => {
    const files = treeFiles();
    expect(files.length).toBeGreaterThan(500);
    expect(files).toContain("test/library-surface/retirement.test.ts");
    expect(retiredFileProblems(files)).toEqual([]);
  });

  it("package.json: no archive:sync, no test:live, and legacy's program out of the typecheck (Q112 B)", () => {
    const { scripts } = JSON.parse(read("package.json")) as { scripts: Record<string, string> };
    expect(scripts.typecheck).toBeDefined();
    expect(scriptProblems(scripts)).toEqual([]);
  });

  it("src/index.ts exports none of 0.9.5's retired names, values or types", () => {
    expect(exportProblems("src/index.ts", exportedNames(path.join(ROOT, "src/index.ts")))).toEqual([]);
  });

  it("openspec/changes/v1.1.0-quint-model-checking is Archived, with §13's reason", () => {
    expect(quintProblems(read(QUINT_PROPOSAL))).toEqual([]);
  });
});

describe("A5's negative controls: a list that differs from design.md §13 fails, naming the difference", () => {
  const manifestOf = (required: readonly string[], deferred: readonly string[] = []) => ({
    required: required.map((id) => ({ id, file: "test/x.test.ts" })),
    deferred: deferred.map((id) => ({ id })),
  });

  it("a manifest with a retired id, without a kept id, with a stranger, or with a wrong pinned count fails", () => {
    const kept = [...KEPT_REQUIRED_IDS];
    expect(manifestProblems(manifestOf(kept), added, added, 4, 0)).toEqual([]);
    expect(manifestProblems(manifestOf([...kept, "property.p3.replay-fold-equivalence"]), added, added, 5, 0)).toEqual([
      "the manifest still holds property.p3.replay-fold-equivalence, retired by design.md §13",
    ]);
    expect(manifestProblems(manifestOf(kept, RETIRED_DEFERRED_IDS), added, added, 4, 1)).toEqual([
      "the manifest still holds crash.pg-kill-save.no-duplicate-with-idempotency-key, retired by design.md §13",
    ]);
    expect(manifestProblems(manifestOf(kept.slice(1)), added, added, 3, 0)).toEqual([
      `the manifest lacks ${kept[0]}, kept by design.md §13 (ids 1–4)`,
    ]);
    expect(manifestProblems(manifestOf([...kept, "invented.id"]), added, added, 5, 0)).toEqual([
      "the manifest requires invented.id, which is neither a kept id (1–4) nor an id of acceptance.md §17",
    ]);
    expect(manifestProblems(manifestOf(kept), added, added, 25, 1)).toEqual([
      "EXPECTED_REQUIRED_COUNT is 25 but the manifest requires 4 ids",
      "EXPECTED_DEFERRED_COUNT is 1 but the manifest defers 0 ids",
    ]);
    // Once task 18.4 passes no pending id, every §17 id is required; with them all, the list is exact.
    expect(manifestProblems(manifestOf(kept), added, [], 4, 0)).toHaveLength(added.length);
    expect(manifestProblems(manifestOf([...kept, ...added]), added, [], 26, 0)).toEqual([]);
    // The 0.9.5 manifest (ids 1–25, the deferred id) fails on every retired id.
    const old = manifestOf([...kept, ...RETIRED_REQUIRED_IDS], RETIRED_DEFERRED_IDS);
    expect(manifestProblems(old, added, added, 25, 1)).toHaveLength(RETIRED_REQUIRED_IDS.length + 1);
  });

  it("a mutate list with a 0.9.5 adapter, without a target, another break, or a stray test fails", () => {
    const targets = Object.keys(MUTATION_TARGETS);
    const tests = Object.values(MUTATION_TARGETS).flat();
    expect(mutationProblems(targets, tests, 65)).toEqual([]);
    expect(mutationProblems([...targets, "src/postgres/temporal-kv.ts"], tests, 65)).toEqual([
      "stryker.conf.json still mutates src/postgres/temporal-kv.ts, retired",
    ]);
    expect(mutationProblems(targets.slice(1), tests, 65)).toEqual([
      `stryker.conf.json does not mutate ${targets[0]}, a target of design.md §13`,
    ]);
    expect(mutationProblems(targets, [...tests, "test/postgres/watermarks.test.ts"], 60)).toEqual([
      "the mutation run includes test/postgres/watermarks.test.ts, not a test of a target of design.md §13",
      "stryker.conf.json breaks at 60, design.md §13 keeps 65",
    ]);
    expect(mutationProblems(RETIRED_MUTATION_TARGETS, tests, 65)).toHaveLength(5 + targets.length);
  });

  it("floors: a retired key, a missing or weakened §13 floor, a src/ directory without one, the exclusion, fail", async () => {
    const real = (await vitestConfig("vitest.config.ts")).test!.coverage!;
    const thresholds = real.thresholds!;
    const dirs = ["db/", "helpers/", "index.ts"];
    expect(floorProblems(thresholds, [], dirs, PENDING_FLOORS)).toEqual([]);
    const retired = { ...thresholds, "**/postgres/watermarks.ts": { lines: 97, branches: 95 } };
    expect(floorProblems(retired, [], dirs, PENDING_FLOORS)).toEqual([
      "vitest.config.ts still holds the floor **/postgres/watermarks.ts, retired by design.md §13",
    ]);
    const { ["**/src/db/durability-probe.ts"]: _probe, ...withoutProbe } = thresholds;
    expect(floorProblems(withoutProbe, [], dirs, PENDING_FLOORS)).toEqual([
      "vitest.config.ts has no floor **/src/db/durability-probe.ts (design.md §13)",
    ]);
    const weakened = { ...thresholds, "**/src/helpers/**": { lines: 95, branches: 85 } };
    expect(floorProblems(weakened, [], dirs, PENDING_FLOORS)).toEqual([
      "vitest.config.ts holds **/src/helpers/** at 95/85, below 95/90 (design.md §13)",
    ]);
    expect(floorProblems(thresholds, [], [...dirs, "newdir/", "loose.ts"], PENDING_FLOORS)).toEqual([
      "vitest.config.ts has no floor **/src/newdir/** (design.md §13's default for src/**)",
      "src/loose.ts lies under no floor of design.md §13 (only directories have one)",
    ]);
    // A pending floor (Q158) may be absent, but not weaker; once nothing is pending, its absence fails.
    const sweep = "**/src/backbone/core-ledger-state/sweep.ts";
    const { [sweep]: _sweep, ...withoutSweep } = thresholds;
    expect(floorProblems(withoutSweep, [], dirs, [sweep])).toEqual([]);
    expect(floorProblems(withoutSweep, [], dirs)).toEqual([`vitest.config.ts has no floor ${sweep} (design.md §13)`]);
    expect(floorProblems({ ...withoutSweep, [sweep]: { lines: 95, branches: 89 } }, [], dirs, [sweep])).toEqual([
      `vitest.config.ts holds ${sweep} at 95/89, below 95/90 (design.md §13)`,
    ]);
    expect(floorProblems(thresholds, ["src/postgres/chain-archive-store.ts"], dirs, PENDING_FLOORS)).toEqual([
      "vitest.config.ts still excludes src/postgres/chain-archive-store.ts from coverage (chain archive)",
    ]);
  });

  it("a Lean tree with a retired module, an aggregator still importing one, a retired lemma, or a missing file fails", () => {
    const kept = [...LEAN_FILES];
    const texts: Record<string, string> = {
      "Formal/Lean/UmbraDBFormal.lean": "import UmbraDBFormal.APISmoke\nimport UmbraDBFormal.Watermarks\n",
      "Formal/Lean/UmbraDBFormalTest/Trust.lean": TRUST_IMPORTS.map((module) => `import ${module}\n`).join(""),
      "Formal/Lean/UmbraDBFormal/APISmoke.lean":
        "theorem watermark_overwrite : True := trivial\ntheorem adjacent_Ico_disjoint : True := trivial\n",
    };
    const reader = (file: string): string => texts[file] ?? "";
    expect(leanProblems(kept, reader)).toEqual([]);
    expect(leanProblems([...kept, "Formal/Lean/UmbraDBFormal/Checkpoint.lean"], reader)).toEqual([
      "Formal/Lean/UmbraDBFormal/Checkpoint.lean is retired by design.md §13 (Lean) but still in Formal/Lean",
    ]);
    expect(leanProblems([...kept, "Formal/Lean/UmbraDBFormalTest/TemporalKV/Laws.lean"], reader)).toEqual([
      "Formal/Lean/UmbraDBFormalTest/TemporalKV/Laws.lean is retired by design.md §13 (Lean) but still in Formal/Lean",
    ]);
    expect(leanProblems(kept.filter((file) => !file.endsWith("Watermarks/Laws.lean")), reader)).toEqual([
      "Formal/Lean/UmbraDBFormal/Watermarks/Laws.lean is kept by design.md §13 (Lean) but missing",
      "Formal/Lean/UmbraDBFormalTest/Watermarks/Laws.lean is kept by design.md §13 (Lean) but missing",
    ]);
    texts["Formal/Lean/UmbraDBFormal.lean"] += "import UmbraDBFormal.TemporalKV.Laws\n";
    texts["Formal/Lean/UmbraDBFormal/APISmoke.lean"] += "theorem checkpoint_union_idem : True := trivial\n";
    expect(leanProblems(kept, reader)).toEqual([
      "Formal/Lean/UmbraDBFormal.lean imports [UmbraDBFormal.APISmoke, UmbraDBFormal.Watermarks, "
        + "UmbraDBFormal.TemporalKV.Laws], design.md §13 keeps exactly [UmbraDBFormal.APISmoke, UmbraDBFormal.Watermarks]",
      "APISmoke.checkpoint_union_idem is retired by design.md §13 but still declared",
    ]);
  });

  it("a retired module left in place fails, and so does each kind of retired file", () => {
    expect(retiredPath("src/postgres/watermarks.ts")).toBe(true);
    expect(retiredFileProblems(["src/helpers/cursor-table.ts", "src/postgres/watermarks.ts"])).toEqual([
      "src/postgres/watermarks.ts is retired by design.md §13 but still in the tree",
    ]);
    const planted = [
      "src/interfaces/temporal-kv.ts", "chain-archive-sync/bootstrap.ts", "test/postgres/temporal-kv.test.ts",
      "test/integration/soak/full-sync-soak.integration.test.ts", "test/api-surface/barrel-resolves.test.ts",
      "bench/workloads/watermarks.ts", "bench/baseline.1.0.0-perf-baseline.1.json",
      "legacy/transaction-history/bench/workloads/transaction-history.ts",
    ];
    expect(retiredFileProblems(planted)).toHaveLength(planted.length);
    // Kept, and so never reported: the crash harness of ids 1–4, the SDK guard, legacy's source and tests.
    const kept = [
      "test/postgres/setup.ts", "test/postgres/no-sdk-import-guard.test.ts",
      "test/integration/crash/crash-harness.smoke.test.ts", "test/integration/crash/crash-worker.ts",
      "legacy/transaction-history/src/postgres/transaction-history-storage.ts", "src/postgresql.ts",
    ];
    expect(retiredFileProblems(kept)).toEqual([]);
    expect(RETIRED_PATHS.length).toBeGreaterThan(40);
  });

  it("scripts with archive:sync, test:live or legacy's program fail", () => {
    expect(scriptProblems({ typecheck: "tsc --noEmit" })).toEqual([]);
    expect(scriptProblems({
      typecheck: "tsc --noEmit && tsc --noEmit -p legacy/transaction-history/tsconfig.json",
      "archive:sync": "tsx chain-archive-sync/sync-cli.ts",
      "test:live": "UMBRADB_LIVE_PREPROD=1 vitest run --config legacy/transaction-history/vitest.config.ts",
    })).toEqual([
      "package.json still has the script archive:sync, retired by design.md §13",
      "package.json still has the script test:live (Q112 B: legacy's run is dropped)",
      "package.json's script typecheck still runs legacy/ (Q112 B)",
      "package.json's script test:live still runs legacy/ (Q112 B)",
    ]);
  });

  it("a barrel that still exports a retired name, a value or a type, fails; §12's Migration does not", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "umbradb-a5-"));
    try {
      const barrel = path.join(dir, "index.ts");
      writeFileSync(barrel, [
        "export class PgWatermarks {}",
        "export type TemporalKV = { readonly k: string };",
        "export type Migration = { readonly id: string };",
        "export const defineModule = (): void => {};",
      ].join("\n"));
      expect(exportProblems("the barrel", exportedNames(barrel)).sort()).toEqual([
        "the barrel still exports PgWatermarks, a 0.9.5 name retired with its part (design.md §13, LS-2)",
        "the barrel still exports TemporalKV, a 0.9.5 name retired with its part (design.md §13, LS-2)",
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
    expect(RETIRED_EXPORTS).not.toContain("Migration");
  });

  it("a Quint change still Proposed, or Archived without §13's reason, fails", () => {
    expect(quintProblems("> **Status:** Proposed. Change id `v1.1.0-quint-model-checking`")).toEqual([
      `${QUINT_PROPOSAL}'s status is "Proposed. Change id \`v1.1.0-quint-model-checking\`", not Archived (design.md §13)`,
    ]);
    expect(quintProblems("> **Status:** Archived.")).toEqual([
      `${QUINT_PROPOSAL}'s Archived status does not give §13's reason (C2a retired)`,
    ]);
  });

  it("a §13 that no longer says a transcribed item fails", () => {
    const section = section13(read("openspec/changes/core-arch/design.md"));
    const dropped = SECTION_13_TERMS[0]!;
    expect(sectionProblems(section.replace(dropped, "something else"))).toEqual([
      `design.md §13 no longer says ${dropped}: the transcription in retirement.ts is out of date`,
    ]);
  });
});
