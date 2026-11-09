import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import * as umbra from "../../src/index.js";
import { coreModuleProblems, surfaceOf } from "./surface.js";

/**
 * What `"."` (`src/index.ts`) exports: the private link's channel and its types, as the compiler resolves them, and
 * the core modules' declarations, which are what a configuration writes entries of: each has its module's id and an
 * entry builder. The negative control below drops an entry builder, swaps an id and drops an export, and each fails
 * naming it.
 */

// The barrel check starts the TypeScript compiler on the barrel and every file it reaches: a few seconds alone, more
// under the full parallel run.
vi.setConfig({ testTimeout: 120_000 });

const INDEX = path.join(fileURLToPath(new URL("../../", import.meta.url)), "src/index.ts");

describe("what src/index.ts exports", () => {
  it("exports messagePortChannel as a value, and MessagePortLike and PrivateLinkChannel as types", () => {
    const found = surfaceOf(INDEX);
    for (const name of ["messagePortChannel"]) expect(found.values).toContain(name);
    for (const name of ["MessagePortLike", "PrivateLinkChannel"]) expect(found.types).toContain(name);
  });

  it("exports the token-metadata module's declaration, with its id and entry builder, and its start-after-database error", () => {
    expect(umbra.TOKEN_METADATA.id).toBe("token-metadata");
    expect(umbra.TOKEN_METADATA.entry({ start: 0, config: {} }).id).toBe("token-metadata");
    expect(typeof umbra.TokenMetadataStartAfterDatabase).toBe("function");
  });

  it("each core module's declaration has its module's id and an entry builder a configuration writes", () => {
    expect(coreModuleProblems(umbra as unknown as Record<string, unknown>)).toEqual([]);
  });
});

describe("negative controls: a core module declaration that differs fails, naming it", () => {
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
