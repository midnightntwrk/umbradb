import { describe, expect, it } from "vitest";
import {
  agentsProblems, changelogDocumentProblems, descriptionProblems, ENGINEERING_RULES, linkedPath, linkProblems,
  markdownLinks, RETIRED_DOCUMENTS_17_4A, RETIRED_DOCUMENTS_17_4B, storageAlgebraProblems,
} from "./documents.js";

/**
 * `./documents.ts` on small texts — the fence and code span rules of `markdownLinks`, reference definitions, angle
 * brackets, `linkedPath`'s URL and anchor tests and the root, `changelogDocumentProblems`' preamble bounds and names,
 * `descriptionProblems`' sentence rule, `agentsProblems`' rule names and common file names, `storageAlgebraProblems`'
 * headings.
 */

const targets = (text: string) => markdownLinks(text).map(({ line, target }) => `${line} ${target}`);

describe("markdownLinks and linkedPath (task 17.5b)", () => {
  it("opens a fence only at a line's start, and closes it only with the same character, as long, alone on its line", () => {
    expect(targets("text ```\n[a](a.md)")).toEqual(["2 a.md"]);
    expect(targets("```\n[a](a.md)\n```   \n[b](b.md)")).toEqual(["4 b.md"]);
    expect(targets("````\n```\n[a](a.md)\n````\n[b](b.md)")).toEqual(["5 b.md"]);
    expect(targets("~~~\n```\n[a](a.md)\n~~~\n[b](b.md)")).toEqual(["5 b.md"]);
    expect(targets("```\n``` js\n[a](a.md)\n```\n[b](b.md)")).toEqual(["5 b.md"]);
    expect(targets("```\n`````\n[b](b.md)")).toEqual(["3 b.md"]);
  });

  it("blanks a code span with as many spaces, so a definition after it is not at the line's start", () => {
    expect(targets("`a`[x]: c.md")).toEqual(["1 c.md"]);
    expect(targets("`ab`[x]: c.md")).toEqual([]);
    expect(targets("`[x](in.md)` [y](out.md)")).toEqual(["1 out.md"]);
  });

  it("reads a definition only at a line's start, its target with or without a space after the colon", () => {
    expect(targets("[x]:d.md")).toEqual(["1 d.md"]);
    expect(targets("see [x]: d.md")).toEqual([]);
    expect(targets("   [x]: <d e.md>")).toEqual(["1 d e.md"]);
  });

  it("removes the angle brackets only around the whole target", () => {
    expect(targets("[a](<b c.md>)")).toEqual(["1 b c.md"]);
    expect(targets("[a](x<b>)")).toEqual(["1 x<b>"]);
    expect(targets("[a](<b)")).toEqual(["1 <b"]);
  });

  it("takes a scheme only at the target's start, and an anchor only as its first character", () => {
    expect(linkedPath("docs/x.md", "a/b:c.md")).toBe("docs/a/b:c.md");
    expect(linkedPath("docs/x.md", "https://example.com/a")).toBeNull();
    expect(linkedPath("docs/x.md", "a.md#")).toBe("docs/a.md");
    expect(linkedPath("docs/x.md", "#a")).toBeNull();
  });

  it("finds the root in the tree: a link to it is no problem", () => {
    expect(linkProblems([{ file: "docs/x.md", text: "[root](/) [up](../)" }], ["docs/x.md"])).toEqual([]);
    expect(linkProblems([{ file: "x.md", text: "[a](./)" }], ["x.md"])).toEqual([]);
  });
});

describe("changelogDocumentProblems (task 17.5b)", () => {
  const [a, b] = [RETIRED_DOCUMENTS_17_4A[0] as string, RETIRED_DOCUMENTS_17_4B[0] as string];
  const name = a.split("/").at(-1) as string;

  it("takes the whole text as the preamble when it has no entry, and none when it opens with one", () => {
    expect(changelogDocumentProblems(`# Changelog\n\nSee ${a}.`)).toEqual([
      `CHANGELOG.md:3: the preamble names ${a}, which is 0.9.5's (A171)`,
    ]);
    expect(changelogDocumentProblems(`See ${a}.\n## [0.10.0]`)).toEqual([
      `CHANGELOG.md:1: the preamble names ${a}, which is 0.9.5's (A171)`,
    ]);
    expect(changelogDocumentProblems(`## [0.10.0]\nSee ${a}.`)).toEqual([]);
  });

  it("names a 17.4a document by its file name too, a 17.4b one only by its path", () => {
    expect(changelogDocumentProblems(`See ${name}.\n## [0.10.0]`)).toEqual([
      `CHANGELOG.md:1: the preamble names ${a}, which is 0.9.5's (A171)`,
    ]);
    expect(changelogDocumentProblems(`See ${b.split("/").at(-1)}.\n## [0.10.0]`)).toEqual([]);
  });

  it("reads a 1.0.0 heading and a 1.0.0 link reference only at a line's start", () => {
    expect(changelogDocumentProblems("## [0.10.0]\nnot ## [1.0.0]\nnot [1.0.0]: https://x/v1.0.0")).toEqual([]);
    expect(changelogDocumentProblems("## [0.10.0]\n[1.0.0]:https://x/compare/a...b")).toEqual([
      "CHANGELOG.md:2: a link reference for the planned 1.0.0 (A171)",
    ]);
    expect(changelogDocumentProblems("## [0.10.0]\n[next]: https://x/tree/v1.0.0")).toEqual([
      "CHANGELOG.md:2: a link reference for the planned 1.0.0 (A171)",
    ]);
    expect(changelogDocumentProblems("## [0.10.0]\n[]: https://x")).toEqual([]);
  });
});

describe("descriptionProblems, agentsProblems and storageAlgebraProblems (task 17.5b)", () => {
  it("takes a blank description as none, and two sentences however many spaces part them", () => {
    expect(descriptionProblems("   ")).toEqual(["package.json has no description (A171)"]);
    expect(descriptionProblems("An indexer.  It runs.")).toEqual(["package.json's description is not one sentence (A171)"]);
    expect(descriptionProblems("An indexer for Midnight.")).toEqual([]);
  });

  it("names each of the 18 rules by the owner's name", () => {
    expect(ENGINEERING_RULES.map(({ rule }) => rule)).toEqual([
      "acceptance criteria are the contract", "verify external claims", "test first on real databases", "traceability",
      "deterministic tests", "no placeholders", "SQL discipline", "typed errors", "stop and escalate",
      "review evidence and negative controls", "test honesty", "floors only go up, except with the owner's approval",
      "the flaky-test policy", "the Lean gate", "the supply-chain gates", "secrets", "per-change security checks",
      "no AI attribution",
    ]);
    expect(agentsProblems("")[0]).toBe(
      'AGENTS.md lacks the rule "acceptance criteria are the contract" (its lead **Acceptance criteria are the contract.**) (A171)',
    );
  });

  it("does not take a common file name for a retired document, and does take a rare one", () => {
    const leads = ENGINEERING_RULES.map(({ lead }) => lead).join("\n");
    expect(agentsProblems(`${leads}\nSee README.md, CHANGELOG.md, DESIGN.md, design.md, proposal.md and tasks.md.`))
      .toEqual([]);
    expect(agentsProblems(`${leads}\nSee v1-lessons-learned.md.`)).toEqual([
      `AGENTS.md:${ENGINEERING_RULES.length + 1}: names docs/v1-lessons-learned.md, deleted by task 17.4b (A171)`,
    ]);
  });

  it("reads a heading only at a line's start, and C2 as a retired law on its own", () => {
    expect(storageAlgebraProblems("text ## W1\n## T5")).toEqual([
      "Formal/STORAGE_ALGEBRA.md has no heading stating W1 (A171)",
    ]);
    expect(storageAlgebraProblems("## W1\n## T5\nC2 holds.")).toEqual([
      "Formal/STORAGE_ALGEBRA.md:3: names C2, a retired law or property test (A171)",
    ]);
  });
});
