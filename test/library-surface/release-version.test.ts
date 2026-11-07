import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { commandBuild } from "../../src/cli/build-modules.js";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import {
  BUILD_FILE, changelogProblems, declarationProblems, NOTICE_HEADING, RELEASE_VERSION, runtimeVersionProblems,
  scanDeclarations, type SourceText, stringConstants, versionLiteralProblems,
} from "./release-version.js";
import { RETIRED_EXPORTS } from "./retirement.js";

/**
 * Version `0.10.0`, the one breaking-change line in `CHANGELOG.md`, and every backbone part and core module naming the
 * build's version (`UMBRADB_VERSION`), never a literal (`core-digest` once wrote `"0.10.0"` by hand). [A4 DOC, LS-4, Q169]
 *
 * The checks are `./release-version.ts`'s, on the tree as it is: the files of `src/` read and parsed (no program, no
 * type checker), the command's build imported for the versions it carries at run time, `package.json`, its lock and
 * `CHANGELOG.md` read as text. Each check has committed negative controls below, the first of them `core-digest`'s
 * declaration as it once was.
 */

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const read = (file: string): string => readFileSync(path.join(ROOT, file), "utf8");

/** Every TypeScript source of `src/`, by its path from the root. */
function sources(): SourceText[] {
  return (readdirSync(path.join(ROOT, "src"), { recursive: true }) as string[])
    .map((file) => `src/${file.split(path.sep).join("/")}`)
    .filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"))
    .sort()
    .map((file) => ({ file, text: read(file) }));
}

/** The command's build on both sides: its backbone parts and core modules (`src/cli/build-modules.ts`). */
function buildDeclarations(): { readonly id: string; readonly version: string }[] {
  const publicSide = commandBuild();
  const privateSide = commandBuild([], { side: "private" });
  return [...publicSide.backbone, ...publicSide.core, ...privateSide.backbone, ...privateSide.core].map((d) => {
    const { id, version } = d as { id: string; version: string };
    return { id, version };
  });
}

const BUILD_IDS = [
  "core-chain", "core-block-fetch", "core-block-commit", "core-private-source", "core-digest", "core-health",
  "core-status", "core-config", "core-chain-events", "core-block-parsed", "core-tx-results", "core-ledger-state",
  "core-contract-states", "core-contract-logs-full", "core-contract-logs-fast",
];

const pkg = JSON.parse(read("package.json")) as { version: string };

describe("A4 (LS-4, amended by Q169): version 0.10.0, and one breaking line", () => {
  it("package.json's version is 0.10.0, and the lock's own entry and UMBRADB_VERSION are the same", () => {
    expect(pkg.version).toBe(RELEASE_VERSION);
    type Lock = { version: string; packages: Record<string, { version: string }> };
    const lock = JSON.parse(read("package-lock.json")) as Lock;
    expect([lock.version, lock.packages[""]?.version]).toEqual([RELEASE_VERSION, RELEASE_VERSION]);
    expect(UMBRADB_VERSION).toBe(RELEASE_VERSION);
  });

  it("CHANGELOG.md's 0.10.0 section opens with one breaking line, and names no 0.9.5 export", () => {
    expect(RETIRED_EXPORTS).toHaveLength(73);
    expect(changelogProblems(read("CHANGELOG.md"), RELEASE_VERSION, RETIRED_EXPORTS)).toEqual([]);
  });

  describe("negative controls", () => {
    const names = ["PgTemporalKV", "MergeEntriesFn"];
    const LINE = "UmbraDB 0.10.0 is a new architecture: nothing of 0.9.5's API or databases is carried over.";
    const notice = [NOTICE_HEADING, "", LINE];
    const changelog = (section: readonly string[]) =>
      ["# Changelog", "", "## [Unreleased]", "", "## [0.10.0] - 2026-10-27", "", ...section, "", "### Added", "",
        "- The runner.", "", "## [0.9.5] - 2026-07-25", "", "### Added", "", "- `PgTemporalKV`"].join("\n");

    it("one line passes, whatever an older release names", () => {
      expect(changelogProblems(changelog(notice), RELEASE_VERSION, names)).toEqual([]);
    });

    it("fails without a 0.10.0 section, or with one that does not open with the notice", () => {
      expect(changelogProblems("# Changelog\n\n## [0.9.5] - 2026-07-25\n", RELEASE_VERSION, names)).toEqual([
        "CHANGELOG.md has no 0.10.0 section (## [0.10.0] …; A4)",
      ]);
      const opening = [`CHANGELOG.md's 0.10.0 section does not open with "${NOTICE_HEADING}" (A4, LS-4)`];
      expect(changelogProblems(changelog(["### Added", "", "- the runner", "", ...notice]), RELEASE_VERSION, names))
        .toEqual(opening);
      expect(changelogProblems(changelog(["Released.", "", ...notice]), RELEASE_VERSION, names)).toEqual(opening);
      expect(changelogProblems(changelog([]), RELEASE_VERSION, names)).toEqual(opening);
    });

    it("fails on a notice of two lines, a list, or a line too long", () => {
      const wrapped = [NOTICE_HEADING, "", "UmbraDB 0.10.0 is a new architecture:", "nothing of 0.9.5's API or " +
        "databases is carried over."];
      expect(changelogProblems(changelog(wrapped), RELEASE_VERSION, names)).toEqual([
        "the 0.10.0 notice is 2 lines, not one (A4)",
      ]);
      expect(changelogProblems(changelog([NOTICE_HEADING, "", `- ${LINE}`]), RELEASE_VERSION, names)).toEqual([
        "the 0.10.0 notice is a list, not one line (A4)",
      ]);
      const long = `${LINE} Run it on a new database: nothing reads or converts 0.9.5's tables.`;
      expect(changelogProblems(changelog([NOTICE_HEADING, "", long]), RELEASE_VERSION, names)).toEqual([
        "the 0.10.0 notice is longer than 120 characters (A4)",
      ]);
      expect(changelogProblems(changelog([NOTICE_HEADING]), RELEASE_VERSION, names)).toEqual([
        "the 0.10.0 notice is 0 lines, not one (A4)",
        'the 0.10.0 notice does not say "new architecture" (A4)',
        'the 0.10.0 notice does not say "nothing of 0.9.5" (A4)',
        'the 0.10.0 notice does not say "api" (A4)',
        'the 0.10.0 notice does not say "database" (A4)',
      ]);
    });

    it("fails on a line that does not say it is a new architecture, or that leaves out the API or databases", () => {
      const said = (line: string) => changelogProblems(changelog([NOTICE_HEADING, "", line]), RELEASE_VERSION, names);
      expect(said("UmbraDB 0.10.0: nothing of 0.9.5's API or databases is carried over.")).toEqual([
        'the 0.10.0 notice does not say "new architecture" (A4)',
      ]);
      expect(said("UmbraDB 0.10.0 is a new architecture; 0.9.5's API and databases are kept.")).toEqual([
        'the 0.10.0 notice does not say "nothing of 0.9.5" (A4)',
      ]);
      expect(said("UmbraDB 0.10.0 is a new architecture: nothing of 0.9.5's databases is carried over.")).toEqual([
        'the 0.10.0 notice does not say "api" (A4)',
      ]);
      expect(said("UmbraDB 0.10.0 is a new architecture: nothing of 0.9.5's API is carried over.")).toEqual([
        'the 0.10.0 notice does not say "database" (A4)',
      ]);
    });

    it("fails on a 0.9.5 export named anywhere in the section: no per-export list", () => {
      const listed = [...notice, "", "### Removed", "", "- `PgTemporalKV`, `MergeEntriesFn`."];
      expect(changelogProblems(changelog(listed), RELEASE_VERSION, names)).toEqual([
        "the 0.10.0 section names 0.9.5's export `PgTemporalKV`: no per-export list (A4)",
        "the 0.10.0 section names 0.9.5's export `MergeEntriesFn`: no per-export list (A4)",
      ]);
    });

    it("the real changelog fails with 17.4's notice put back: its statement and a per-export line", () => {
      const real = read("CHANGELOG.md");
      const lines = real.split("\n");
      const at = lines.indexOf(NOTICE_HEADING);
      expect(at).toBeGreaterThan(0);
      const notice174 = [
        ...lines.slice(0, at + 2),
        "UmbraDB 0.10.0 replaces the 0.9.5 PostgreSQL storage library with a standalone Midnight indexer. " +
          "**Every 0.9.5 export",
        "is removed or replaced, and 0.9.5 databases are not migrated:** run 0.10.0 on a new database.",
        "",
        "- **TemporalKV** — `PgTemporalKV`, `TemporalKV`, `VersionedEntry`.",
        ...lines.slice(at + 3),
      ].join("\n");
      expect(changelogProblems(notice174, RELEASE_VERSION, RETIRED_EXPORTS)).toEqual([
        "the 0.10.0 notice is 3 lines, not one (A4)",
        "the 0.10.0 notice is a list, not one line (A4)",
        'the 0.10.0 notice does not say "new architecture" (A4)',
        'the 0.10.0 notice does not say "nothing of 0.9.5" (A4)',
        'the 0.10.0 notice does not say "api" (A4)',
        "the 0.10.0 section names 0.9.5's export `PgTemporalKV`: no per-export list (A4)",
        "the 0.10.0 section names 0.9.5's export `TemporalKV`: no per-export list (A4)",
        "the 0.10.0 section names 0.9.5's export `VersionedEntry`: no per-export list (A4)",
      ]);
    });
  });
});

describe("Task 17.4: every backbone part and core module declares the build's version, UMBRADB_VERSION", () => {
  it("the command's build has the 15 parts and modules this test expects", () => {
    expect([...new Set(buildDeclarations().map((d) => d.id))].sort()).toEqual([...BUILD_IDS].sort());
  });

  it("in src/, each declaration's version is UMBRADB_VERSION imported from src/config/build.ts; all are found", () => {
    expect(declarationProblems(sources(), BUILD_IDS)).toEqual([]);
  });

  it("in src/, only src/config/build.ts writes the version, once, as package.json's", () => {
    expect(versionLiteralProblems(sources(), pkg.version)).toEqual([]);
  });

  it("at run time, every declaration of the command's build on either side carries UMBRADB_VERSION", () => {
    expect(runtimeVersionProblems(buildDeclarations(), UMBRADB_VERSION)).toEqual([]);
  });

  describe("negative controls", () => {
    const FILE = "src/backbone/core-digest/core-digest.ts";
    const IMPORT = 'import { UMBRADB_VERSION } from "../../config/build.js";';
    const DEFINE = 'import { defineModule } from "../../modules/declaration.js";';
    const at = (text: string, file = FILE): SourceText => ({ file, text });
    const scan = (text: string, file = FILE) =>
      scanDeclarations(at(text, file), stringConstants([at(text, file)])).problems;
    const rule = "not the build's UMBRADB_VERSION imported from src/config/build.ts (task 17.4)";

    it("core-digest's declaration as task 17.4 found it (\"0.10.0\" by hand) fails, with its line and id", () => {
      // The head of CORE_DIGEST's declaration at 121a5bb (src/backbone/core-digest/core-digest.ts:90-98), with the
      // imports it needs; its other fields shortened.
      const found = [
        'import { z } from "zod";',
        DEFINE,
        "",
        "/**",
        " * `core-digest`, the backbone part (CORE-ARCH §4.11): it requires `blocks` (`core-block-commit`'s) and " +
          "provides",
        " * `digest-tables` and `digest-checkpoints`, its two tables. Its version is UmbraDB's (task 17.4 sets the " +
          "release's).",
        " */",
        "export const CORE_DIGEST = defineModule({",
        '  id: "core-digest",',
        '  version: "0.10.0",',
        '  side: "public",',
        '  requires: ["blocks"],',
        "  provides: [],",
        "  startsMidChain: true,",
        "  configSchema: z.object({}),",
        "  migrations: [],",
        "  points: {},",
        "});",
      ].join("\n");
      expect(scan(found)).toEqual([`${FILE}:8: core-digest declares version "0.10.0", ${rule}`]);
      expect(versionLiteralProblems([at(found)], "0.10.0")).toEqual([
        `${FILE}:10: writes the build's version "0.10.0" (task 17.4)`,
        `src/config/build.ts's UMBRADB_VERSION is [], not package.json's "0.10.0" once (task 17.4)`,
      ]);
      // As this task leaves it, it passes.
      const fixed = [IMPORT, found.replace('version: "0.10.0"', "version: UMBRADB_VERSION")].join("\n");
      expect(scan(fixed)).toEqual([]);
    });

    it("fails on a template literal, another name, a shorthand, a string key, and no version at all", () => {
      const declared = (version: string, head = "") =>
        `${IMPORT}\n${DEFINE}\n${head}export const X = defineModule({ id: "core-x", ${version} side: "private" });`;
      expect(scan(declared("version: `0.10.0`,"))).toEqual([`${FILE}:3: core-x declares version \`0.10.0\`, ${rule}`]);
      expect(scan(declared("version: VERSION,", "const VERSION = UMBRADB_VERSION;\n"))).toEqual([
        `${FILE}:4: core-x declares version VERSION, ${rule}`,
      ]);
      expect(scan(declared("version,", 'const version = "0.10.0";\n'))).toEqual([
        `${FILE}:4: core-x declares version version, ${rule}`,
      ]);
      expect(scan(declared('"version": "1.0.0",'))).toEqual([`${FILE}:3: core-x declares version "1.0.0", ${rule}`]);
      expect(scan(declared("version: String(UMBRADB_VERSION),"))).toEqual([
        `${FILE}:3: core-x declares version String(UMBRADB_VERSION), ${rule}`,
      ]);
      expect(scan(declared(""))).toEqual([`${FILE}:3: core-x declares no version, ${rule}`]);
    });

    it("fails on an UMBRADB_VERSION not build.ts's: local, imported from elsewhere, as a type, hidden", () => {
      const body = 'export const X = defineModule({ id: "core-x", version: UMBRADB_VERSION, side: "public" });';
      expect(scan(`${DEFINE}\nconst UMBRADB_VERSION = "0.10.0";\n${body}`)).toEqual([
        `${FILE}:3: core-x declares version UMBRADB_VERSION, ${rule}`,
      ]);
      expect(scan(`import { UMBRADB_VERSION } from "../../config/other.js";\n${DEFINE}\n${body}`)).toEqual([
        `${FILE}:3: core-x declares version UMBRADB_VERSION, ${rule}`,
      ]);
      expect(scan(`import { UMBRADB_VERSION } from "../config/build.js";\n${DEFINE}\n${body}`)).toEqual([
        `${FILE}:3: core-x declares version UMBRADB_VERSION, ${rule}`,
      ]);
      expect(scan(`import type { UMBRADB_VERSION } from "../../config/build.js";\n${DEFINE}\n${body}`)).toEqual([
        `${FILE}:3: core-x declares version UMBRADB_VERSION, ${rule}`,
      ]);
      const hidden = `${IMPORT}\n${DEFINE}\nexport function x() {\n  const UMBRADB_VERSION = "0.10.0";\n  return ${
        body.replace("export const X = ", "")
      }\n}`;
      expect(scan(hidden)).toEqual([`${FILE}:4: declares its own UMBRADB_VERSION, hiding the build's version`]);
    });

    it("fails on a spread declaration setting its own version; passes one keeping the spread's, and an alias", () => {
      const spread = (own: string) =>
        `${IMPORT}\nimport { CORE_DIGEST } from "./core-digest.js";\n` +
        `export const P = Object.freeze({ ...CORE_DIGEST, ${own}side: "private", requires: ["private-cursor"] });`;
      expect(scan(spread(""), "src/backbone/private.ts")).toEqual([]);
      expect(scan(spread('version: "0.10.0", '), "src/backbone/private.ts")).toEqual([
        `src/backbone/private.ts:3: a module declaration declares version "0.10.0", ${rule}`,
      ]);
      const alias = `import { UMBRADB_VERSION as BUILD } from "../../config/build.js";\n${DEFINE}\n` +
        'export const X = defineModule({ id: "core-x", version: BUILD, side: "public" });';
      expect(scan(alias)).toEqual([]);
      // An object that copies a part's side is no declaration (the admin snapshots), nor a process's options.
      expect(scan('export const s = (part) => ({ id: part.id, version: part.version, side: part.side });')).toEqual([]);
      expect(scan('export const o = { config: {}, version: "0.10.0", side: "private" };')).toEqual([]);
    });

    it("fails when the scan finds no declaration of a part of the build, whatever its form", () => {
      const all = sources();
      const without = all.filter((given) => given.file !== FILE);
      expect(without).toHaveLength(all.length - 1);
      expect(declarationProblems(without, BUILD_IDS)).toEqual([
        "no declaration of core-digest found in src/: the scan cannot check its version (task 17.4)",
      ]);
      // An id the scan cannot read (computed) is not found either.
      const computed = all.map((given) =>
        given.file === FILE
          ? { file: FILE, text: given.text.replace('id: "core-digest"', 'id: ["core", "digest"].join("-")') }
          : given,
      );
      expect(computed.find((given) => given.file === FILE)?.text).toContain('["core", "digest"].join("-")');
      expect(declarationProblems(computed, BUILD_IDS)).toEqual([
        "no declaration of core-digest found in src/: the scan cannot check its version (task 17.4)",
      ]);
    });

    it("fails on the version written in another file of src/, or a build.ts constant not package.json's", () => {
      const build = { file: BUILD_FILE, text: 'export const UMBRADB_VERSION = "0.10.0";' };
      expect(versionLiteralProblems([build], "0.10.0")).toEqual([]);
      expect(versionLiteralProblems([build, at('export const V = "0.10.0";', "src/admin/x.ts")], "0.10.0")).toEqual([
        `src/admin/x.ts:1: writes the build's version "0.10.0" (task 17.4)`,
      ]);
      expect(versionLiteralProblems([build], "0.10.1")).toEqual([
        `src/config/build.ts's UMBRADB_VERSION is ["0.10.0"], not package.json's "0.10.1" once (task 17.4)`,
      ]);
      const twice = { file: BUILD_FILE, text: `${build.text}\nexport const V = "0.10.0";` };
      expect(versionLiteralProblems([twice], "0.10.0")).toEqual([
        `${BUILD_FILE}:2: writes the build's version "0.10.0" (task 17.4)`,
      ]);
    });

    it("fails on a declaration of the build whose run-time version is another", () => {
      const declarations = buildDeclarations();
      expect(declarations.length).toBeGreaterThanOrEqual(BUILD_IDS.length);
      const changed = declarations.map((d) => (d.id === "core-digest" ? { ...d, version: "0.10.0-rc.1" } : d));
      expect(runtimeVersionProblems(changed, UMBRADB_VERSION)).toEqual(
        changed
          .filter((d) => d.id === "core-digest")
          .map(() => `core-digest carries version "0.10.0-rc.1", not the build's "${UMBRADB_VERSION}"`),
      );
    });
  });
});
