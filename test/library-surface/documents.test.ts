import { spawnSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  agentsProblems, changelogDocumentProblems, DESCRIPTION_0_9_5, descriptionProblems, ENGINEERING_RULES, linkedPath,
  linkProblems, markdownLinks, RETIRED_DOCUMENTS, RETIRED_DOCUMENTS_17_4A, RETIRED_DOCUMENTS_17_4B,
  retiredDocumentProblems, storageAlgebraProblems, type TextFile,
} from "./documents.js";

/**
 * Tasks 17.4a and 17.4b (`tasks.md` 17.4a, 17.4b; A171 `[STATIC]`, owner decisions Q169, Q170 C, Q171 A): 0.9.5's
 * documents are gone from the tree, `CHANGELOG.md` has no preamble naming them and no planned `1.0.0` entry,
 * `package.json`'s `description` describes the indexer, no Markdown link in the tree points at a missing file,
 * `AGENTS.md` holds the 1.0.0 guideline's rules still in force and names nothing deleted, and
 * `Formal/STORAGE_ALGEBRA.md` states W1 and T5 and no retired law. The checks are `./documents.ts`'s, on the tree as
 * git lists it (tracked and untracked files that exist, ignored ones left out). Each has committed negative controls
 * below; the last ones put back what tasks 17.4a and 17.4b removed.
 */

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const read = (file: string): string => readFileSync(path.join(ROOT, file), "utf8");

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

const tree = treeFiles();
const markdown: TextFile[] = tree.filter((file) => file.endsWith(".md")).map((file) => ({ file, text: read(file) }));

describe("A171 (Q169, Q170 C, Q171 A): 0.9.5's documents removed, and nothing left pointing at them", () => {
  it("the documents tasks 17.4a and 17.4b list as 0.9.5's are not in the tree", () => {
    expect(RETIRED_DOCUMENTS_17_4A).toHaveLength(11);
    expect(RETIRED_DOCUMENTS_17_4B).toHaveLength(31);
    expect(new Set(RETIRED_DOCUMENTS).size).toBe(42);
    expect(retiredDocumentProblems(tree)).toEqual([]);
  });

  it("AGENTS.md holds the 1.0.0 guideline's rules still in force and names no deleted document", () => {
    expect(ENGINEERING_RULES).toHaveLength(18);
    expect(agentsProblems(read("AGENTS.md"))).toEqual([]);
  });

  it("Formal/STORAGE_ALGEBRA.md states W1 and T5 and no retired law", () => {
    expect(storageAlgebraProblems(read("Formal/STORAGE_ALGEBRA.md"))).toEqual([]);
  });

  it("CHANGELOG.md has no preamble naming them, and no planned 1.0.0 entry", () => {
    expect(changelogDocumentProblems(read("CHANGELOG.md"))).toEqual([]);
  });

  it("package.json's description is one sentence about the indexer", () => {
    const pkg = JSON.parse(read("package.json")) as { description?: unknown };
    expect(descriptionProblems(pkg.description)).toEqual([]);
  });

  it("no Markdown link in the tree points at a missing file", () => {
    expect(markdown.length).toBeGreaterThan(100);
    expect(markdown.map(({ file }) => file)).toEqual(expect.arrayContaining(["README.md", "CHANGELOG.md"]));
    expect(linkProblems(markdown, tree)).toEqual([]);
  });

  describe("negative controls", () => {
    it("reads inline links, images and link reference definitions, with their lines; not code", () => {
      const text = [
        "# Title",
        "See [the guide](docs/guide.md#start) and ![logo](<assets/a logo.png> \"Logo\").",
        "`[not a link](in/a/span.md)` and ``[nor](this.md)``, then [a link](after.md).",
        "```ts",
        "const x = \"[fenced](no.md)\";",
        "```",
        "~~~~",
        "[still fenced](no.md)",
        "~~~",
        "~~~~",
        "[ref]: ../up.md",
        "   [indented ref]: <spaced name.md>",
      ].join("\n");
      expect(markdownLinks(text)).toEqual([
        { line: 2, target: "docs/guide.md#start" },
        { line: 2, target: "assets/a logo.png" },
        { line: 3, target: "after.md" },
        { line: 11, target: "../up.md" },
        { line: 12, target: "spaced name.md" },
      ]);
    });

    it("resolves a target from its file's directory, or the root; URLs and anchors are not paths", () => {
      expect(linkedPath("docs/a.md", "b.md")).toBe("docs/b.md");
      expect(linkedPath("docs/a.md", "../README.md#usage")).toBe("README.md");
      expect(linkedPath("docs/a.md", "/src/index.ts")).toBe("src/index.ts");
      expect(linkedPath("docs/a.md", "./sub/")).toBe("docs/sub");
      expect(linkedPath("docs/a.md", "my%20file.md?plain=1")).toBe("docs/my file.md");
      expect(linkedPath("README.md", "..")).toBe("..");
      expect(linkedPath("README.md", "./")).toBe("");
      for (const target of ["https://example.com/x.md", "mailto:a@b.c", "//host/x", "#section", "?q"]) {
        expect(linkedPath("docs/a.md", target)).toBeNull();
      }
    });

    it("fails on a link to a file or directory not in the tree, named with its file and line", () => {
      const tree = ["README.md", "docs/a.md", "docs/sub/c.md", "src/index.ts"];
      const files: TextFile[] = [
        { file: "README.md", text: "[a](docs/a.md) [dir](docs/sub/) [gone](docs/STABILITY.md)\n[up](../outside.md)" },
        { file: "docs/a.md", text: "[c](sub/c.md#x) [root](/src/index.ts) [self](#top) [web](https://x.y/z.md)\n" +
          "\n[missing]: ./b.md" },
      ];
      expect(linkProblems(files, tree)).toEqual([
        "README.md:1: links to docs/STABILITY.md, and docs/STABILITY.md is not in the tree (A171)",
        "README.md:2: links to ../outside.md, and ../outside.md is not in the tree (A171)",
        "docs/a.md:3: links to ./b.md, and docs/b.md is not in the tree (A171)",
      ]);
    });

    it("the real tree fails with a link to a deleted document added, and with that document put back", () => {
      const linked = markdown.map((given) =>
        given.file === "CHANGELOG.md" ? { ...given, text: `${given.text}\nSee [policy](docs/STABILITY.md).\n` } : given,
      );
      const line = linked.find(({ file }) => file === "CHANGELOG.md")?.text.split("\n").length ?? 0;
      expect(linkProblems(linked, tree)).toEqual([
        `CHANGELOG.md:${line - 1}: links to docs/STABILITY.md, and docs/STABILITY.md is not in the tree (A171)`,
      ]);
      const restored = [...tree, "docs/STABILITY.md", "docs/roadmapv1.html"];
      expect(linkProblems(linked, restored)).toEqual([]);
      expect(retiredDocumentProblems(restored)).toEqual([
        "docs/STABILITY.md is 0.9.5's (task 17.4a) and still in the tree (A171)",
        "docs/roadmapv1.html is 0.9.5's (task 17.4a) and still in the tree (A171)",
      ]);
    });

    it("the real changelog fails with 17.4's preamble sentence or a planned 1.0.0 entry put back", () => {
      const changelog = read("CHANGELOG.md");
      const lines = changelog.split("\n");
      const firstEntry = lines.findIndex((line) => line.startsWith("## "));
      const preamble = [
        ...lines.slice(0, firstEntry - 1),
        "entries below are stated in [`docs/STABILITY.md`](docs/STABILITY.md).",
        ...lines.slice(firstEntry - 1),
      ].join("\n");
      expect(changelogDocumentProblems(preamble)).toEqual([
        `CHANGELOG.md:${firstEntry}: the preamble names docs/STABILITY.md, which is 0.9.5's (A171)`,
      ]);
      const at = lines.findIndex((line) => line.startsWith("## [0.9.5]"));
      const planned = [
        ...lines.slice(0, at),
        '## [1.0.0] - unreleased — "Totality"',
        "",
        "[1.0.0]: https://github.com/midnightntwrk/umbradb/releases/tag/v1.0.0",
        "[Unreleased]: https://github.com/midnightntwrk/umbradb/compare/v1.0.0...HEAD",
        ...lines.slice(at),
      ].join("\n");
      expect(changelogDocumentProblems(planned)).toEqual([
        `CHANGELOG.md:${at + 1}: plans a 1.0.0 entry (A171)`,
        `CHANGELOG.md:${at + 3}: a link reference for the planned 1.0.0 (A171)`,
        `CHANGELOG.md:${at + 4}: a link reference for the planned 1.0.0 (A171)`,
      ]);
    });

    it("the real tree fails with task 17.4b's documents put back, each named with its task", () => {
      const restored = [...tree, "design/design.md", "docs/v1-implementation-guideline.md", "docs/STABILITY.md"];
      expect(retiredDocumentProblems(restored)).toEqual([
        "docs/STABILITY.md is 0.9.5's (task 17.4a) and still in the tree (A171)",
        "docs/v1-implementation-guideline.md is 0.9.5's (task 17.4b) and still in the tree (A171)",
        "design/design.md is 0.9.5's (task 17.4b) and still in the tree (A171)",
      ]);
      const linked = [...markdown, { file: "docs/x.md", text: "[law](../Formal/STORAGE_TYPES.md#w1)\n" }];
      expect(linkProblems(linked, [...tree, "docs/x.md"])).toEqual([
        "docs/x.md:1: links to ../Formal/STORAGE_TYPES.md#w1, and Formal/STORAGE_TYPES.md is not in the tree (A171)",
      ]);
    });

    it("the changelog's preamble fails on a 17.4b document's path, not on a common file name", () => {
      const lines = read("CHANGELOG.md").split("\n");
      const firstEntry = lines.findIndex((line) => line.startsWith("## "));
      const preamble = (sentence: string): string =>
        [...lines.slice(0, firstEntry - 1), sentence, ...lines.slice(firstEntry - 1)].join("\n");
      expect(changelogDocumentProblems(preamble("The rules are in `docs/v1-implementation-guideline.md`."))).toEqual([
        `CHANGELOG.md:${firstEntry}: the preamble names docs/v1-implementation-guideline.md, which is 0.9.5's (A171)`,
      ]);
      expect(changelogDocumentProblems(preamble("See the README.md and `design.md` of each change."))).toEqual([]);
    });

    it("the real AGENTS.md fails with 0.9.5's pointer put back, a rule missing or doubled, or 0.9.5's names", () => {
      const agents = read("AGENTS.md");
      const lines = agents.split("\n");
      const pointer = [
        ...lines.slice(0, 3),
        "in this repository. `docs/v1-implementation-guideline.md` adds the 1.0.0-specific rules; see `CEILINGS.md`.",
        ...lines.slice(3),
      ].join("\n");
      expect(agentsProblems(pointer)).toEqual([
        "AGENTS.md:4: names docs/v1-implementation-guideline.md, deleted by task 17.4b (A171)",
        "AGENTS.md:4: names Performance/CEILINGS.md, deleted by task 17.4b (A171)",
        'AGENTS.md:4: names "1.0.0", 0.9.5\'s program (A171)',
      ]);
      const lead = ENGINEERING_RULES[6]?.lead ?? "";
      expect(agentsProblems(agents.replace(lead, "**SQL rules.**"))).toEqual([
        `AGENTS.md lacks the rule "SQL discipline" (its lead ${lead}) (A171)`,
      ]);
      expect(agentsProblems(`${agents}\n${lead} Again.\n`)).toEqual([
        'AGENTS.md states the rule "SQL discipline" 2 times (A171)',
      ]);
      const names = `${agents}\nTests run on Testcontainers Postgres against \`PgTemporalKV\` and \`tasks.md\`.\n`;
      const at = names.split("\n").length - 1;
      expect(agentsProblems(names)).toEqual([
        `AGENTS.md:${at}: names "Testcontainers Postgres", 0.9.5's program (A171)`,
        `AGENTS.md:${at}: names \`PgTemporalKV\`, a retired 0.9.5 export (A171)`,
      ]);
      expect(agentsProblems("")).toHaveLength(18);
    });

    it("the real STORAGE_ALGEBRA.md fails with a retired law put back, or without W1's or T5's heading", () => {
      const algebra = read("Formal/STORAGE_ALGEBRA.md");
      const end = algebra.split("\n").length;
      const retired = `${algebra}\n**Law T1 — gapless.** As C2a and L1 hold.\n- **P10 (L1):** P9, P11.\n`;
      expect(storageAlgebraProblems(retired)).toEqual([
        `Formal/STORAGE_ALGEBRA.md:${end + 1}: names T1, a retired law or property test (A171)`,
        `Formal/STORAGE_ALGEBRA.md:${end + 1}: names C2a, a retired law or property test (A171)`,
        `Formal/STORAGE_ALGEBRA.md:${end + 1}: names L1, a retired law or property test (A171)`,
        `Formal/STORAGE_ALGEBRA.md:${end + 2}: names P10, a retired law or property test (A171)`,
        `Formal/STORAGE_ALGEBRA.md:${end + 2}: names L1, a retired law or property test (A171)`,
        `Formal/STORAGE_ALGEBRA.md:${end + 2}: names P11, a retired law or property test (A171)`,
      ]);
      const unheaded = algebra
        .split("\n")
        .map((line) => (/^#{1,6} /.test(line) ? line.replace(/\b(W1|T5)\b/g, "law") : line))
        .join("\n");
      expect(storageAlgebraProblems(unheaded)).toEqual([
        "Formal/STORAGE_ALGEBRA.md has no heading stating W1 (A171)",
        "Formal/STORAGE_ALGEBRA.md has no heading stating T5 (A171)",
      ]);
      expect(storageAlgebraProblems("## W1\n## T5 heights\nT5 and W1, P9, T50, AT1, C1x.\n")).toEqual([]);
    });

    it("fails on 0.9.5's description, one not naming the indexer, two sentences, or none", () => {
      expect(descriptionProblems(DESCRIPTION_0_9_5)).toEqual([
        "package.json's description is 0.9.5's (A171)",
        "package.json's description does not name the indexer (A171)",
        'package.json\'s description describes 0.9.5\'s store ("temporal") (A171)',
      ]);
      expect(descriptionProblems("A Midnight indexer. It reads blocks.")).toEqual([
        "package.json's description is not one sentence (A171)",
      ]);
      expect(descriptionProblems("A Midnight indexer")).toEqual([
        "package.json's description is not one sentence (A171)",
      ]);
      expect(descriptionProblems("A Midnight block reader.")).toEqual([
        "package.json's description does not name the indexer (A171)",
      ]);
      expect(descriptionProblems(undefined)).toEqual(["package.json has no description (A171)"]);
      expect(descriptionProblems("A standalone Midnight indexer for version 0.10.0.")).toEqual([]);
    });
  });
});
