import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it, vi } from "vitest";
import * as umbra from "../../src/index.js";
import {
  amendedSurface,
  CORE_MODULE_EXPORTS,
  coreModuleProblems,
  PENDING_EXPORTS,
  pinnedSurface,
  runtimeValues,
  section12,
  section12Surface,
  section4Amendment,
  type Surface,
  surfaceOf,
  surfaceProblems,
  withoutPending,
} from "./surface.js";

/**
 * The sorted value exports and the type exports of `"."` (`src/index.ts`) are pinned to the design's exported surface,
 * read from the design's text (`./surface.ts`): `core-arch` design §12 as the start-umbradb change's design §4 amends it
 * (added `startUmbraDB`, `finalizedHeight`, `messagePortChannel` and their types; removed `startProcess`,
 * `ProcessHandle`, `ProcessState`, `runLedgerWorker`, `BlockSource`). Adding or removing an export fails with the name:
 * the negative controls below compile barrels that add, drop or change the kind of one export, and each fails naming
 * it. The core modules' declarations the surface exports are what a configuration writes entries of.
 * [A1 STATIC, LS-1; design §12; start-umbradb design §4]
 *
 * **Pending** (`PENDING_EXPORTS`): the amendment's names whose code a later step of the change writes — the private
 * link's `MessagePort` adapter and its carrier's type, written with the channel link. They are not exported yet; the
 * test checks that each is the amendment's and still unexported, so the list only shrinks and the pin is whole once it
 * is empty.
 */

// The checks start the TypeScript compiler on the barrel and every file it reaches: a few seconds alone, more under the
// full parallel run.
vi.setConfig({ testTimeout: 120_000 });

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const INDEX = path.join(ROOT, "src/index.ts");
const design = readFileSync(path.join(ROOT, "openspec/changes/core-arch/design.md"), "utf8");
const change = readFileSync(path.join(ROOT, "openspec/changes/start-umbradb/design.md"), "utf8");
const base = section12Surface(design);
const amendment = section4Amendment(change);
const amended = amendedSurface(base, amendment);

/** The amendment's names not exported yet (see the module comment and `PENDING_EXPORTS`). */
const PENDING: Surface = PENDING_EXPORTS;

const expected = withoutPending(amended, PENDING);

describe("A1: src/index.ts exports exactly design.md §12's surface, as start-umbradb's design §4 amends it (LS-1)", () => {
  it("§12 lists its values and types, the core modules' declarations among the values", () => {
    expect(section12(design)).toContain("**Values:**");
    expect(base.values).toHaveLength(27);
    expect(base.types).toHaveLength(27);
    for (const name of Object.keys(CORE_MODULE_EXPORTS)) expect(base.values).toContain(name);
    // Not read as exports: a path and the entry call the surface's text holds in code spans. [design §12]
    expect(base.values).not.toContain("src/runner/envelope.ts");
  });

  it("§4 adds three values and fourteen types and removes five names of §12; the pending ones are its, unexported", () => {
    expect(amendment.addedValues).toEqual(["startUmbraDB", "finalizedHeight", "messagePortChannel"]);
    expect(amendment.addedTypes).toHaveLength(14);
    expect(amendment.addedTypes).toEqual(expect.arrayContaining(["UmbraDBOptions", "UmbraDBHandle", "PrivateLinkChannel"]));
    expect([...amendment.removed].sort()).toEqual(["BlockSource", "ProcessHandle", "ProcessState", "runLedgerWorker", "startProcess"]);
    for (const name of amendment.removed) expect([...base.values, ...base.types]).toContain(name);
    expect(amended.values).toHaveLength(28);
    expect(amended.types).toHaveLength(38);
    // What §4 keeps stays: the in-memory chain and its block reference.
    expect(amended.values).toContain("InMemoryBlockSource");
    expect(amended.types).toContain("BlockRef");
    const found = surfaceOf(INDEX);
    for (const name of PENDING.values) {
      expect(amendment.addedValues).toContain(name);
      expect([...found.values, ...found.types]).not.toContain(name);
    }
    for (const name of PENDING.types) {
      expect(amendment.addedTypes).toContain(name);
      expect([...found.values, ...found.types]).not.toContain(name);
    }
  });

  it("the pinned surface is the amended one less the pending names, as the pack smoke's consumer imports it", () => {
    expect(pinnedSurface(design, change)).toEqual(expected);
  });

  it("a reworded §4 Exports bullet fails rather than amending nothing", () => {
    expect(() => section4Amendment(change.replace("- **Exports** (`core-arch` design §12, amended):", "- **Exports:**"))).toThrow(
      /no §4 Exports bullet/,
    );
    expect(() => section4Amendment(change.replace("; removed ", "; dropped "))).toThrow(/no longer has "; removed "/);
  });

  it("the barrel's value and type exports, as the compiler resolves them, are §12's", () => {
    const found = surfaceOf(INDEX);
    expect(surfaceProblems("src/index.ts", found, expected)).toEqual([]);
    expect(found).toEqual(expected);
  });

  it("at run time the barrel holds exactly §12's values", () => {
    expect(runtimeValues(umbra)).toEqual(expected.values);
  });

  it("each core module's declaration has its module's id and an entry builder a configuration writes", () => {
    expect(coreModuleProblems(umbra as unknown as Record<string, unknown>)).toEqual([]);
  });
});

describe("A1's negative controls: a barrel that differs from §12 fails, naming the export", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "umbradb-a1-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const index = JSON.stringify(INDEX.replace(/\.ts$/, ".js"));
  let n = 0;
  /** A barrel in a scratch directory: `src/index.ts` re-exported, less `drop`, plus the lines `add`. */
  const barrel = (lines: readonly string[]): string => {
    const file = path.join(dir, `barrel-${n++}.ts`);
    writeFileSync(file, `${lines.join("\n")}\n`);
    return file;
  };
  const without = (name: string): string[] => {
    const keep = (names: readonly string[]) => names.filter((other) => other !== name);
    return [`export { ${keep(expected.values).join(", ")} } from ${index};`, `export type { ${keep(expected.types).join(", ")} } from ${index};`];
  };

  it("an added value or type fails naming it", () => {
    const file = barrel([`export * from ${index};`, "export const extraValue = 1;", "export type ExtraType = string;"]);
    expect(surfaceProblems("barrel", surfaceOf(file), expected)).toEqual([
      "barrel exports the value extraValue, which design.md §12 does not list (LS-1)",
      "barrel exports the type ExtraType, which design.md §12 does not list (LS-1)",
    ]);
  });

  it("a 0.9.5 name exported again fails naming it", () => {
    const file = barrel([`export * from ${index};`, "export class PgTemporalKV {}"]);
    expect(surfaceProblems("barrel", surfaceOf(file), expected)).toEqual([
      "barrel exports the value PgTemporalKV, which design.md §12 does not list (LS-1)",
    ]);
  });

  it("a removed value or type fails naming it", () => {
    expect(surfaceProblems("barrel", surfaceOf(barrel(without("CORE_BLOCK_PARSED"))), expected)).toEqual([
      "barrel does not export the value CORE_BLOCK_PARSED, which design.md §12 lists (LS-1)",
    ]);
    expect(surfaceProblems("barrel", surfaceOf(barrel(without("LedgerTask"))), expected)).toEqual([
      "barrel does not export the type LedgerTask, which design.md §12 lists (LS-1)",
    ]);
  });

  it("a value exported as a type only fails naming it", () => {
    const lines = without("InMemoryBlockSource");
    const file = barrel([...lines, `export type { InMemoryBlockSource } from ${index};`]);
    expect(surfaceProblems("barrel", surfaceOf(file), expected)).toEqual([
      "barrel exports InMemoryBlockSource as a type; design.md §12 lists it as a value (LS-1)",
    ]);
  });

  it("a §12 that lists a name it does not export, or one name twice by kind, fails", () => {
    const more = { values: [...expected.values, "configCheck"].sort(), types: [...expected.types, "Entry"].sort() };
    const problems = surfaceProblems("src/index.ts", surfaceOf(INDEX), { values: more.values, types: expected.types });
    expect(problems).toEqual(["src/index.ts does not export the value configCheck, which design.md §12 lists (LS-1)"]);
    expect(surfaceProblems("x", { values: [], types: [] }, { values: ["Entry"], types: ["Entry"] })).toContain(
      "design.md §12 lists Entry both as a value and as a type",
    );
  });

  it("a core module declaration without its entry builder or with another id fails", () => {
    const real = umbra as unknown as Record<string, unknown>;
    const plain = { ...(real.CORE_TX_RESULTS as object) }; // a spread drops the non-enumerable entry builder
    expect(coreModuleProblems({ ...real, CORE_TX_RESULTS: plain })).toEqual([
      "CORE_TX_RESULTS has no entry builder: a configuration cannot write CORE_TX_RESULTS.entry({ … })",
    ]);
    expect(coreModuleProblems({ ...real, CORE_BLOCK_PARSED: real.CORE_TX_RESULTS })).toEqual([
      "CORE_BLOCK_PARSED declares the id core-tx-results, not core-block-parsed",
      "CORE_BLOCK_PARSED.entry gives the id core-tx-results, not core-block-parsed",
    ]);
    const { CORE_LEDGER_STATE: _dropped, ...rest } = real;
    expect(coreModuleProblems(rest)).toEqual(["CORE_LEDGER_STATE is not exported"]);
  });
});
