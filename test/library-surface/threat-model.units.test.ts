import { describe, expect, it } from "vitest";
import {
  BOUNDARIES, citationProblems, citations, headingProblems, KNOWN_GAPS, LINKING_DOCUMENTS, OWNER_AREAS,
  retiredPartProblems, THREAT_MODEL,
} from "./threat-model.js";

/**
 * `./threat-model.ts` on small texts — the `CITATION` pattern's ranges, a line 0, the fences around prose, the retired
 * parts written without a separator, and `headingProblems`' counting by level and title.
 */

/** A model whose every required heading is there once, and `extra` after it. */
function model(extra = ""): string {
  return [
    ...BOUNDARIES.map((boundary, index) => `### ${index + 1}. ${boundary}`),
    ...OWNER_AREAS.map((area) => `## ${area}`),
    `## ${KNOWN_GAPS}`,
    extra,
  ].join("\n");
}

describe("threat-model.ts's checks", () => {
  it("names the one document that must link the model", () => {
    expect(LINKING_DOCUMENTS).toEqual(["README.md"]);
  });

  it("reads a range's end with spaces around the dash, and an end of several digits", () => {
    expect(citations("see a.ts:3 - 12 and b.ts:4–56.")).toEqual([
      { at: 1, path: "a.ts", line: 12 },
      { at: 1, path: "b.ts", line: 56 },
    ]);
    expect(citations("see a.ts:3x-12")).toEqual([]);
  });

  it("refuses a citation of line 0, and takes the file's last line", () => {
    const count = () => 5;
    expect(citationProblems("a.ts:0", count)).toEqual([`${THREAT_MODEL}:1: cites a.ts:0, and a.ts has 5 lines (A178)`]);
    expect(citationProblems("a.ts:5 a.ts:1", count)).toEqual([]);
  });

  it("skips the lines of a fence only until it is closed by the same character, as long, alone", () => {
    const cited = (text: string) => citations(text).map(({ at }) => at);
    expect(cited("text ```\na.ts:1")).toEqual([2]);
    expect(cited("```\na.ts:1\n```   \na.ts:2")).toEqual([4]);
    expect(cited("````\n```\na.ts:1\n````\na.ts:2")).toEqual([5]);
    expect(cited("~~~\n```\na.ts:1\n~~~\na.ts:2")).toEqual([5]);
    expect(cited("```\n``` ts\na.ts:1\n```\na.ts:2")).toEqual([5]);
    expect(cited("```\n`````\na.ts:2")).toEqual([3]);
    expect(cited("~~~\na.ts:1\n~\na.ts:2")).toEqual([]);
  });

  it("finds 0.9.5's parts written with a separator or none, and not with another character", () => {
    const named = (line: string) => retiredPartProblems(line).length;
    expect(["checkpoint store", "checkpointstore", "chunk pool", "chunkpool", "wallet envelope", "walletenvelope",
      "temporal kv", "temporal_kv", "TemporalKV"].map(named)).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1]);
    expect(["checkpointXstore", "temporalXkv"].map(named)).toEqual([0, 0]);
  });

  it("counts a heading by its level and title, from a line's start, its spaces trimmed", () => {
    expect(headingProblems(model())).toEqual([]);
    expect(headingProblems(model(`#### ${KNOWN_GAPS}`))).toEqual([]);
    expect(headingProblems(model(`##   ${OWNER_AREAS[0]}  `))).toEqual([
      `${THREAT_MODEL} has the heading "## ${OWNER_AREAS[0]}" 2 times (A178)`,
    ]);
    expect(headingProblems(model().replace(`## ${KNOWN_GAPS}`, `text ## ${KNOWN_GAPS}`))).toEqual([
      `${THREAT_MODEL} lacks its known gaps (heading "## ${KNOWN_GAPS}") (A178)`,
    ]);
    expect(headingProblems(model().replace(`### 1. ${BOUNDARIES[0]}`, ""))).toEqual([
      `${THREAT_MODEL} lacks boundary 1 (heading "### 1. ${BOUNDARIES[0]}") (A178)`,
    ]);
  });
});
