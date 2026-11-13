import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it, vi } from "vitest";
import * as umbra from "../../src/index.js";
import {
  CORE_MODULE_EXPORTS, coreModuleProblems, EXPORTED_SURFACE, runtimeValues, surfaceOf, surfaceProblems,
} from "./surface.js";

/**
 * The sorted value exports and the type exports of `"."` (`src/index.ts`) are pinned to {@link EXPORTED_SURFACE}, as
 * the compiler resolves them and at run time. Adding or removing an export fails with the name: the negative controls
 * below compile barrels that add, drop or change the kind of one export, and each fails naming it. The core modules'
 * declarations the surface exports are what a configuration writes entries of: each has its module's id and an entry
 * builder.
 */

// The checks start the TypeScript compiler on the barrel and every file it reaches: a few seconds alone, more under the
// full parallel run.
vi.setConfig({ testTimeout: 120_000 });

const INDEX = path.join(fileURLToPath(new URL("../../", import.meta.url)), "src/index.ts");
const expected = EXPORTED_SURFACE;

describe("src/index.ts exports exactly the pinned surface", () => {
  it("the pinned surface is 39 values and 42 types, sorted, the core modules' declarations among the values", () => {
    expect(expected.values).toHaveLength(39);
    expect(expected.types).toHaveLength(42);
    expect([...expected.values].sort()).toEqual(expected.values);
    expect([...expected.types].sort()).toEqual(expected.types);
    for (const name of Object.keys(CORE_MODULE_EXPORTS)) expect(expected.values).toContain(name);
    expect(surfaceProblems("the pin", expected, expected)).toEqual([]);
  });

  it("the barrel's value and type exports, as the compiler resolves them, are the pinned surface", () => {
    const found = surfaceOf(INDEX);
    expect(surfaceProblems("src/index.ts", found, expected)).toEqual([]);
    expect(found).toEqual(expected);
  });

  it("at run time the barrel holds exactly the pinned values", () => {
    expect(runtimeValues(umbra)).toEqual(expected.values);
  });

  it("exports the token-metadata module's declaration, with its id and entry builder, and its start-after-database error", () => {
    expect(umbra.TOKEN_METADATA.id).toBe("token-metadata");
    expect(umbra.TOKEN_METADATA.entry({ start: 0, config: {} }).id).toBe("token-metadata");
    expect(typeof umbra.TokenMetadataStartAfterDatabase).toBe("function");
  });

  it("exports the token-metadata-api module's declaration, with its id and entry builder, requiring the indexer's tables", () => {
    expect(umbra.TOKEN_METADATA_API.id).toBe("token-metadata-api");
    expect(umbra.TOKEN_METADATA_API.entry({ start: 0, config: {} }).id).toBe("token-metadata-api");
    expect(umbra.TOKEN_METADATA_API.requires).toEqual(["token-metadata-events", "token-metadata-state"]);
  });

  it("each core module's declaration has its module's id and an entry builder a configuration writes", () => {
    expect(coreModuleProblems(umbra as unknown as Record<string, unknown>)).toEqual([]);
  });
});

describe("negative controls: a barrel that differs from the pinned surface fails, naming the export", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "umbradb-surface-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const index = JSON.stringify(INDEX.replace(/\.ts$/, ".js"));
  let n = 0;
  /** A barrel in a scratch directory made of the lines given. */
  const barrel = (lines: readonly string[]): string => {
    const file = path.join(dir, `barrel-${n++}.ts`);
    writeFileSync(file, `${lines.join("\n")}\n`);
    return file;
  };
  /** `src/index.ts` re-exported, less `name`. */
  const without = (name: string): string[] => {
    const keep = (names: readonly string[]) => names.filter((other) => other !== name);
    return [`export { ${keep(expected.values).join(", ")} } from ${index};`, `export type { ${keep(expected.types).join(", ")} } from ${index};`];
  };

  it("an added value or type fails naming it", () => {
    const file = barrel([`export * from ${index};`, "export const extraValue = 1;", "export type ExtraType = string;"]);
    expect(surfaceProblems("barrel", surfaceOf(file), expected)).toEqual([
      "barrel exports the value extraValue, which the pinned surface does not list",
      "barrel exports the type ExtraType, which the pinned surface does not list",
    ]);
  });

  it("a 0.9.5 name exported again fails naming it", () => {
    const file = barrel([`export * from ${index};`, "export class PgTemporalKV {}"]);
    expect(surfaceProblems("barrel", surfaceOf(file), expected)).toEqual([
      "barrel exports the value PgTemporalKV, which the pinned surface does not list",
    ]);
  });

  it("a removed value or type fails naming it", () => {
    expect(surfaceProblems("barrel", surfaceOf(barrel(without("CORE_BLOCK_PARSED"))), expected)).toEqual([
      "barrel does not export the value CORE_BLOCK_PARSED, which the pinned surface lists",
    ]);
    expect(surfaceProblems("barrel", surfaceOf(barrel(without("LedgerTask"))), expected)).toEqual([
      "barrel does not export the type LedgerTask, which the pinned surface lists",
    ]);
  });

  it("a value exported as a type only fails naming it", () => {
    const lines = without("InMemoryBlockSource");
    const file = barrel([...lines, `export type { InMemoryBlockSource } from ${index};`]);
    expect(surfaceProblems("barrel", surfaceOf(file), expected)).toEqual([
      "barrel exports InMemoryBlockSource as a type; the pinned surface lists it as a value",
    ]);
  });

  it("a pin that lists a name the barrel does not export, or one name twice by kind, fails", () => {
    const more = { values: [...expected.values, "configCheck"].sort(), types: expected.types };
    expect(surfaceProblems("src/index.ts", surfaceOf(INDEX), more)).toEqual([
      "src/index.ts does not export the value configCheck, which the pinned surface lists",
    ]);
    expect(surfaceProblems("x", { values: [], types: [] }, { values: ["Entry"], types: ["Entry"] })).toContain(
      "the pinned surface lists Entry both as a value and as a type",
    );
  });

  it("a runtime namespace with an extra or a missing value differs from the pin", () => {
    expect(runtimeValues({ ...umbra, extraValue: 1 })).not.toEqual(expected.values);
    const { POINTS: _dropped, ...rest } = umbra;
    expect(runtimeValues(rest)).not.toEqual(expected.values);
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
