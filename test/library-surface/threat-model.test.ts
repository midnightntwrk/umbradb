import { spawnSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  BOUNDARIES, citationProblems, citations, GAP_ISSUES, GAP_TASKS, headingProblems, knownGapProblems,
  lineCountOf, lineLengthProblems, LINKING_DOCUMENTS, OWNER_AREAS, retiredPartProblems, THREAT_MODEL,
  threatModelLinkProblems,
} from "./threat-model.js";

/**
 * `docs/THREAT_MODEL.md` describes 0.10.0 — no 0.9.5 part named, the draft's ten boundaries and the owner's three areas
 * each a heading, its known gaps naming the tasks and issues, every `path:line` it cites naming a file of the tree with
 * at least that many lines — and `README.md` and `SECURITY.md` link it. The checks are `./threat-model.ts`'s, on the
 * tree as git lists it (tracked and untracked files that exist, ignored ones left out). Committed negative controls
 * below: a missing area, a cited line past a file's end, a 0.9.5 term and a missing link each fail. [A178 STATIC, Q177–Q181]
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

const tree = new Set(treeFiles());
const lineCount = (file: string): number | null => (tree.has(file) ? lineCountOf(read(file)) : null);
/** The model's text, empty when it is not in the tree (every check below then fails, naming what is missing). */
const model = tree.has(THREAT_MODEL) ? read(THREAT_MODEL) : "";
const linking = (): { file: string; text: string }[] => LINKING_DOCUMENTS.map((file) => ({ file, text: read(file) }));

describe("A178 (Q181 A): docs/THREAT_MODEL.md describes 0.10.0, and README.md and SECURITY.md link it", () => {
  it("is in the tree", () => {
    expect(tree.has(THREAT_MODEL)).toBe(true);
  });

  it("names no 0.9.5 part: the checkpoint store, the chunk pool, the wallet envelope, TemporalKV", () => {
    expect(model).not.toBe("");
    expect(retiredPartProblems(model)).toEqual([]);
  });

  it("covers the draft's ten boundaries and the owner's three areas, each a heading of its own", () => {
    expect(BOUNDARIES).toHaveLength(10);
    expect(OWNER_AREAS).toHaveLength(3);
    expect(headingProblems(model)).toEqual([]);
  });

  it("its known gaps name the tasks that fixed them (14.2b, 4.5, 12.2b, 15.1b, 17.4b) and issues 00045-00048", () => {
    expect(GAP_TASKS).toHaveLength(5);
    expect(GAP_ISSUES).toHaveLength(4);
    expect(knownGapProblems(model)).toEqual([]);
  });

  it("each path:line it cites names a file of the tree with at least that many lines", () => {
    expect(citations(model).length).toBeGreaterThanOrEqual(30);
    expect(citationProblems(model, lineCount)).toEqual([]);
  });

  it("README.md and SECURITY.md link it", () => {
    expect(threatModelLinkProblems(linking())).toEqual([]);
  });

  it("keeps its lines to 120 columns", () => {
    expect(lineLengthProblems(model)).toEqual([]);
  });

  describe("negative controls", () => {
    it("the real model fails without one of the owner's areas, or with a boundary twice", () => {
      const area = OWNER_AREAS[2] ?? "";
      expect(headingProblems(model.replace(`\n## ${area}\n`, `\n## Reads\n`))).toEqual([
        `${THREAT_MODEL} lacks the owner's area "${area}" (heading "## ${area}") (A178)`,
      ]);
      const boundary = `### 4. ${BOUNDARIES[3] ?? ""}`;
      expect(headingProblems(`${model}\n${boundary}\n`)).toEqual([
        `${THREAT_MODEL} has the heading "${boundary}" 2 times (A178)`,
      ]);
      expect(headingProblems("")).toHaveLength(14);
    });

    it("the real model fails with a cited line past a file's end, or a file not in the tree", () => {
      const lines = lineCount("src/backup/backup.ts") ?? 0;
      expect(lines).toBeGreaterThan(100);
      const past = `${model}\nSee \`src/backup/backup.ts:${lines + 1}\` and \`src/backup/gone.ts:1\`.\n`;
      const end = past.split("\n").length - 2; // the line before the added one
      expect(citationProblems(past, lineCount)).toEqual([
        `${THREAT_MODEL}:${end + 1}: cites src/backup/backup.ts:${lines + 1}, and src/backup/backup.ts has ${lines} ` +
          "lines (A178)",
        `${THREAT_MODEL}:${end + 1}: cites src/backup/gone.ts:1, and src/backup/gone.ts is not a file of the tree ` +
          "(A178)",
      ]);
      expect(citationProblems(`\`src/backup/backup.ts:${lines}\``, lineCount)).toEqual([]);
    });

    it("the real model fails with a 0.9.5 term", () => {
      const terms = `${model}\nThe chunk pool and the Checkpoint-Store; \`PgTemporalKV\`; wallet envelopes.\n`;
      const end = terms.split("\n").length - 2; // the line before the added one
      expect(retiredPartProblems(terms)).toEqual([
        `${THREAT_MODEL}:${end + 1}: names the checkpoint store, 0.9.5's (A178)`,
        `${THREAT_MODEL}:${end + 1}: names the chunk pool, 0.9.5's (A178)`,
        `${THREAT_MODEL}:${end + 1}: names the wallet envelope, 0.9.5's (A178)`,
        `${THREAT_MODEL}:${end + 1}: names the TemporalKV, 0.9.5's (A178)`,
      ]);
    });

    it("the real README.md and SECURITY.md fail without their link, or with it in a code span", () => {
      const unlink = (text: string): string => text.replaceAll("](docs/THREAT_MODEL.md", "](SECURITY.md");
      const [readme, security] = linking();
      expect(threatModelLinkProblems([{ file: "README.md", text: unlink(readme?.text ?? "") }])).toEqual([
        `README.md does not link ${THREAT_MODEL} (A178)`,
      ]);
      const renamed = (security?.text ?? "").replaceAll(THREAT_MODEL, "x.md");
      expect(threatModelLinkProblems([{ file: "SECURITY.md", text: renamed }])).toEqual([
        `SECURITY.md does not link ${THREAT_MODEL} (A178)`,
      ]);
      const span = "See `[the model](docs/THREAT_MODEL.md)`.\n";
      expect(threatModelLinkProblems([{ file: "README.md", text: span }])).toEqual([
        `README.md does not link ${THREAT_MODEL} (A178)`,
      ]);
      expect(threatModelLinkProblems([{ file: "docs/x.md", text: "[model](THREAT_MODEL.md#gaps)\n" }])).toEqual([]);
    });

    it("the real model fails with a known gap's task or issue missing", () => {
      const without = model.replaceAll("00047", "0004x");
      expect(knownGapProblems(without)).toEqual([`${THREAT_MODEL}'s known gaps do not name issue 00047 (A178)`]);
      const elsewhere = "## Known gaps\n\nTask 14.5, 4.50, 112.2b.\n## Next\n4.5 14.2b 12.2b 15.1b 17.4b\n";
      expect(knownGapProblems(elsewhere)).toEqual([
        ...GAP_TASKS.map((task) => `${THREAT_MODEL}'s known gaps do not name task ${task} (A178)`),
        ...GAP_ISSUES.map((issue) => `${THREAT_MODEL}'s known gaps do not name issue ${issue} (A178)`),
      ]);
      expect(knownGapProblems("")).toEqual([`${THREAT_MODEL} has no "Known gaps" section (A178)`]);
    });

    it("reads path:line citations, not addresses, URLs or fenced code", () => {
      const text = [
        "`src/a.ts:12`, (`src/b/c.ts:3–9`) and .github/workflows/x.yml:4; `README.md:1-2`.",
        "Admin on `0.0.0.0:8081`, `127.0.0.1:5432`, `localhost:5432`, https://example.org:443/a.md, `a/b:3`.",
        "```",
        "src/fenced.ts:1",
        "```",
      ].join("\n");
      expect(citations(text)).toEqual([
        { at: 1, path: "src/a.ts", line: 12 },
        { at: 1, path: "src/b/c.ts", line: 9 },
        { at: 1, path: ".github/workflows/x.yml", line: 4 },
        { at: 1, path: "README.md", line: 2 },
      ]);
    });

    it("counts lines with and without a final newline, and over-long lines", () => {
      expect([lineCountOf(""), lineCountOf("a"), lineCountOf("a\n"), lineCountOf("a\nb")]).toEqual([0, 1, 1, 2]);
      expect(lineLengthProblems(`${"→".repeat(120)}\n${"x".repeat(121)}`)).toEqual([
        `${THREAT_MODEL}:2: 121 columns, more than 120`,
      ]);
    });
  });
});
