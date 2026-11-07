import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { RENAMED_CORE_SETTINGS } from "../../src/config/core-settings.js";
import {
  changelogEntryProblems, type Document, ENTRY_HEADING, type EntryInput, entryTerms, newRefusalCodes, sweepProblems,
} from "./library-documents.js";
import { section4Amendment } from "./surface.js";

/**
 * The library entry's documents: `CHANGELOG.md`'s entry for it (L59's changelog half; the module guide's recipe is
 * `test/examples/try-module.test.ts`'s), and the documents a user reads free of the removed exports and of the renamed
 * settings' old keys: they describe the current version, and only the changelog records what changed. The checks are
 * `./library-documents.ts`'s; each has its negative controls below. [L59 DOC, LS-1, CF-4]
 */

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const read = (file: string): string => readFileSync(path.join(ROOT, file), "utf8");

const DESIGN = read("openspec/changes/start-umbradb/design.md");
const AMENDMENT = section4Amendment(DESIGN);
const RENAMED = RENAMED_CORE_SETTINGS.map(({ from, to }) => ({ from: from.join("."), to: to.join(".") }));
const INPUT: EntryInput = {
  renamed: RENAMED,
  codes: newRefusalCodes(DESIGN),
  removed: AMENDMENT.removed,
  added: AMENDMENT.addedValues,
};

/**
 * The documents a user reads: the README, the roadmap, the contributing and security notes, `docs/*.md` and
 * `docs/supply-chain/`, and the examples' text files. Left out: `CHANGELOG.md` (it names what was removed), and the
 * records of their own time — `docs/issues/`, `docs/releases/`, `docs/recovery/`, `docs/research/` — and the specs.
 */
function userDocuments(): Document[] {
  const files = ["README.md", "ROADMAP.md", "CONTRIBUTING.md", "SECURITY.md"];
  for (const dir of ["docs", "docs/supply-chain"]) {
    files.push(...readdirSync(path.join(ROOT, dir)).filter((name) => name.endsWith(".md")).map((name) => `${dir}/${name}`));
  }
  const examples = readdirSync(path.join(ROOT, "examples"), { recursive: true }) as string[];
  files.push(
    ...examples
      .map((name) => `examples/${name.split(path.sep).join("/")}`)
      .filter((file) => /\.(?:md|ts|sh|json)$/.test(file) && !/\/(?:data|node_modules)\//.test(file)),
  );
  return files.sort().map((file) => ({ file, text: read(file) }));
}

describe("L59: CHANGELOG.md's entry for the library entry", () => {
  it("reads its terms from the change: the renamed settings, six codes, five removed exports, three added values", () => {
    expect(RENAMED).toEqual([
      { from: "listen.transport", to: "listen.privateLink" },
      { from: "coreTransport", to: "privateLink" },
    ]);
    expect(INPUT.codes).toHaveLength(6);
    expect(AMENDMENT.removed).toEqual(["startProcess", "ProcessHandle", "ProcessState", "runLedgerWorker", "BlockSource"]);
    expect(AMENDMENT.addedValues).toEqual(["startUmbraDB", "finalizedHeight", "messagePortChannel"]);
  });

  it("the 0.10.0 section's subsection opens with the breaking-change warning and names every term", () => {
    expect(changelogEntryProblems(read("CHANGELOG.md"), INPUT)).toEqual([]);
  });

  describe("negative controls", () => {
    const entry = (body: readonly string[]) =>
      ["# Changelog", "", "## [Unreleased]", "", "## [0.10.0] - 2026-10-27", "", "### Breaking changes", "", "One line.",
        "", `${ENTRY_HEADING}: UmbraDB as a library`, "", ...body, "", "### Added", "", "- More.", "",
        "## [0.9.5] - 2026-07-25", "", ...entryTerms(INPUT).map((term) => `- \`${term}\``)].join("\n");
    const every = entryTerms(INPUT).map((term) => `- \`${term}\``);

    it("an entry with the warning and every term passes", () => {
      expect(changelogEntryProblems(entry(["**Breaking for users of `v0.10.0-rc.1`.**", "", ...every]), INPUT)).toEqual([]);
    });

    it("fails without the subsection, naming the heading; the terms in another release's section do not count", () => {
      const without = entry([]).replace(`${ENTRY_HEADING}: UmbraDB as a library`, "### Changed");
      expect(changelogEntryProblems(without, INPUT)).toEqual([
        `CHANGELOG.md's 0.10.0 section has no subsection "${ENTRY_HEADING}…" (L59)`,
      ]);
    });

    it("fails on a subsection that does not open with the bold warning", () => {
      expect(changelogEntryProblems(entry(["Some changes.", "", "**Breaking.**", ...every]), INPUT)).toEqual([
        `the subsection "${ENTRY_HEADING}…" does not open with a bold breaking-change warning (L59)`,
      ]);
    });

    it("fails on each term left out, naming it; a term after the subsection's end does not count", () => {
      for (const term of entryTerms(INPUT)) {
        const body = ["**Breaking.**", "", ...every.filter((line) => line !== `- \`${term}\``)];
        expect(changelogEntryProblems(entry(body), INPUT)).toEqual([
          `the subsection "${ENTRY_HEADING}…" does not name \`${term}\` (L59)`,
        ]);
      }
    });

    it("takes a function's name as a call too, but not a longer name", () => {
      const call = every.map((line) => (line === "- `finalizedHeight`" ? "- `finalizedHeight(node)`" : line));
      expect(changelogEntryProblems(entry(["**Breaking.**", "", ...call]), INPUT)).toEqual([]);
      const longer = every.map((line) => (line === "- `finalizedHeight`" ? "- `finalizedHeights`" : line));
      expect(changelogEntryProblems(entry(["**Breaking.**", "", ...longer]), INPUT)).toEqual([
        `the subsection "${ENTRY_HEADING}…" does not name \`finalizedHeight\` (L59)`,
      ]);
    });

    it("fails on a term written without backticks", () => {
      const body = ["**Breaking.**", "", ...every.map((line) => (line === "- `startProcess`" ? "- startProcess" : line))];
      expect(changelogEntryProblems(entry(body), INPUT)).toEqual([
        `the subsection "${ENTRY_HEADING}…" does not name \`startProcess\` (L59)`,
      ]);
    });

    it("the real changelog fails without its entry", () => {
      const real = read("CHANGELOG.md");
      const start = real.indexOf(ENTRY_HEADING);
      expect(start).toBeGreaterThan(0);
      const end = real.indexOf("\n## ", start);
      const cut = `${real.slice(0, start)}${real.slice(end + 1)}`;
      expect(changelogEntryProblems(cut, INPUT)).toEqual([
        `CHANGELOG.md's 0.10.0 section has no subsection "${ENTRY_HEADING}…" (L59)`,
      ]);
    });
  });
});

describe("the documents a user reads name no removed export, and no renamed setting's old key (LS-1, CF-4)", () => {
  it("covers the README, the guides and the examples", () => {
    const files = userDocuments().map(({ file }) => file);
    expect(files).toEqual(expect.arrayContaining([
      "README.md", "docs/module-guide.md", "docs/operator-guide.md", "docs/browser.md", "docs/THREAT_MODEL.md",
      "examples/stats-module/stats-module.ts", "examples/try-module/try-module.ts",
    ]));
    expect(files.some((file) => file.startsWith("docs/issues/") || file === "CHANGELOG.md")).toBe(false);
  });

  it("no document names startProcess, ProcessHandle, ProcessState, runLedgerWorker or BlockSource, or an old key", () => {
    expect(sweepProblems(userDocuments(), AMENDMENT.removed, RENAMED)).toEqual([]);
  });

  describe("negative controls", () => {
    const check = (text: string) => sweepProblems([{ file: "x.md", text }], AMENDMENT.removed, RENAMED);

    it("fails on each removed export named as a word, with its line; InMemoryBlockSource and a longer name pass", () => {
      expect(check("Start it.\nCall `startProcess(input)` here.")).toEqual([
        "x.md:2: names startProcess, which the package no longer exports (LS-1)",
      ]);
      for (const name of AMENDMENT.removed) expect(check(`a ${name}.`)).toHaveLength(1);
      expect(check("An `InMemoryBlockSource`, a `BlockSourceKind`, `startProcesses`.")).toEqual([]);
    });

    it("fails on an old key, with its line, also beside its new key; the new keys alone pass", () => {
      expect(check("Set `listen.transport` to the address.")).toEqual([
        "x.md:1: names listen.transport, the old key of listen.privateLink; only the changelog records renames (CF-4)",
      ]);
      expect(check("The link (`privateLink`; it was\n`coreTransport`, now refused).")).toEqual([
        "x.md:2: names coreTransport, the old key of privateLink; only the changelog records renames (CF-4)",
      ]);
      expect(check("The link (`privateLink`, the public `listen.privateLink`).")).toEqual([]);
    });

    it("reads each table row as a paragraph of its own", () => {
      const table = ["| Key | |", "|---|---|", "| `listen.privateLink` | the link |", "| `listen.transport` | old |"];
      expect(check(table.join("\n"))).toEqual([
        "x.md:4: names listen.transport, the old key of listen.privateLink; only the changelog records renames (CF-4)",
      ]);
    });

    it("the real README fails with a rename note put back in its settings table", () => {
      const row = "| `listen.privateLink` | none | The private processes' link |";
      const readme = read("README.md");
      expect(readme).toContain(row);
      const noted = readme.replace(row, "| `listen.privateLink` | none | The private processes' link (was `listen.transport`) |");
      expect(sweepProblems([{ file: "README.md", text: noted }], AMENDMENT.removed, RENAMED)).toEqual([
        expect.stringMatching(/^README\.md:\d+: names listen\.transport, the old key of listen\.privateLink/),
      ]);
    });
  });
});
