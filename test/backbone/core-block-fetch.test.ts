import { describe, expect, it } from "vitest";
import {
  bindCoreBlockFetch,
  CORE_BLOCK_FETCH,
  CORE_BLOCK_FETCH_ID,
  CORE_BLOCK_ITEMS,
  coreBlockFetchOnFetch,
  isBlockItemSource,
} from "../../src/backbone/core-block-fetch/index.js";
import type { ItemSink, ProcessContext } from "../../src/modules/declaration.js";
import { BACKBONE_ORDER } from "../../src/modules/graph.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { KNOWN_NETWORKS, builtInLedgerTable } from "../../src/ledger/networks.js";
import { type LedgerTable, selectLedgerVersion } from "../../src/ledger/version-table.js";
import {
  IN_MEMORY_LEDGER,
  IN_MEMORY_SPEC_VERSION,
  IN_MEMORY_START_MS,
  InMemoryBlockSource,
  inMemoryBlock,
} from "../../src/runner/in-memory-source.js";
import { blockWith, mnsvItem } from "../ledger/version-checks.js";
import { chainBackbone } from "./chain-build.js";

/**
 * The backbone part `core-block-fetch`: its declaration, its `on-fetch` over the block source the runner binds to its
 * context, and the in-memory source's items (what module authors' builds with UmbraDB's backbone get). Its node source
 * is tested in `node-source.test.ts`, the process in `ingest.test.ts`. [CD-2; CORE-ARCH §4.11; design §3]
 */

const context = (items: ReadonlyMap<string, unknown> = new Map()): ProcessContext =>
  Object.freeze({ items, revisions: [], publish: () => undefined });

/** A sink recording each put, in order. */
function recordingSink(): { readonly sink: ItemSink; readonly puts: [string, unknown][] } {
  const puts: [string, unknown][] = [];
  return { sink: { put: (item, value) => void puts.push([item, value]) }, puts };
}

const blockContext = (height: bigint) => Object.freeze({ ...inMemoryBlock(height), items: new Map(), settings: {}, active: () => true });

describe("core-block-fetch's declaration (CD-2, CORE-ARCH §4.11)", () => {
  it("is the second backbone part: it requires node-client and ledger-table and provides the four block items", () => {
    expect(CORE_BLOCK_FETCH_ID).toBe(BACKBONE_ORDER[1]);
    expect(CORE_BLOCK_FETCH).toMatchObject({ id: "core-block-fetch", side: "public", startsMidChain: true, migrations: [] });
    expect(CORE_BLOCK_FETCH.requires).toEqual(["node-client", "ledger-table"]);
    expect(CORE_BLOCK_FETCH.provides).toEqual(
      ["block-header", "block-body", "runtime-metadata", "ledger-version"].map((name) => ({ name, lifetimes: ["block"] })),
    );
    expect(CORE_BLOCK_ITEMS).toEqual(["block-header", "block-body", "runtime-metadata", "ledger-version"]);
    expect(Object.keys(CORE_BLOCK_FETCH.points)).toEqual(["on-fetch"]);
    // The chain's build validates with it.
    expect(() => validateDeclarations({ backbone: chainBackbone(), core: [], user: [] })).not.toThrow();
  });
});

describe("core-block-fetch's on-fetch", () => {
  it("puts the four items its block source gives, in order, with the ledger-table item it is given", async () => {
    const p = context(new Map([["ledger-table", { rows: [], pins: [] }]]));
    const seen: unknown[] = [];
    bindCoreBlockFetch(p, {
      blockItems: async (block, table) => {
        seen.push([block, table]);
        return new InMemoryBlockSource({ head: 9n }).blockItems(block);
      },
    });
    const { sink, puts } = recordingSink();
    await coreBlockFetchOnFetch(p, blockContext(4n), sink);
    expect(puts.map(([name]) => name)).toEqual([...CORE_BLOCK_ITEMS]);
    expect(seen).toEqual([[inMemoryBlock(4n), { rows: [], pins: [] }]]);
    // As the declaration's callback too.
    const again = recordingSink();
    const onFetch = CORE_BLOCK_FETCH.points["on-fetch"] as NonNullable<(typeof CORE_BLOCK_FETCH.points)["on-fetch"]>;
    await onFetch.call(CORE_BLOCK_FETCH.points, p, blockContext(5n), again.sink);
    expect(again.puts).toHaveLength(4);
  });

  it("fails clearly with a context the runner did not bind, and binds a context once", async () => {
    const p = context();
    const { sink } = recordingSink();
    await expect(coreBlockFetchOnFetch(p, blockContext(1n), sink)).rejects.toThrow(/bindCoreBlockFetch/);
    const source = new InMemoryBlockSource({ head: 1n });
    bindCoreBlockFetch(p, source);
    expect(() => bindCoreBlockFetch(p, source)).toThrow(/once per process context/);
  });

  it("knows a source that gives block items", () => {
    expect(isBlockItemSource(new InMemoryBlockSource({ head: 1n }))).toBe(true);
    expect(isBlockItemSource({ blockItems: 1 })).toBe(false);
    expect(isBlockItemSource(null)).toBe(false);
    expect(isBlockItemSource(undefined)).toBe(false);
  });
});

describe("the in-memory source's block items (design §3, for tests and module authors)", () => {
  it("gives runtime 2.1's v9 blocks, six seconds apart, with no extrinsics and empty metadata, frozen", async () => {
    const items = await new InMemoryBlockSource({ head: 3n }).blockItems(inMemoryBlock(3n));
    expect(items["block-header"]).toEqual({
      ...inMemoryBlock(3n),
      stateRoot: new Uint8Array(32),
      extrinsicsRoot: new Uint8Array(32),
      digest: [],
      specVersion: IN_MEMORY_SPEC_VERSION,
      timestampMs: IN_MEMORY_START_MS + 18_000n,
    });
    expect(items["block-body"]).toEqual({ specVersion: 2_001_000, extrinsics: [] });
    expect(items["runtime-metadata"]).toEqual({ specVersion: 2_001_000, metadata: new Uint8Array(0) });
    expect(items["ledger-version"]).toBe(IN_MEMORY_LEDGER);
    expect(Object.isFrozen(items)).toBe(true);
    expect(Object.isFrozen(items["block-header"])).toBe(true);
    expect(IN_MEMORY_SPEC_VERSION).toBe(2_001_000);
    expect(IN_MEMORY_LEDGER).toBe("v9");
  });

  // The default runtime and the default ledger are the pair every known network's built-in ledger table holds, so a
  // module author who gives an in-memory block transactions on the defaults gets the ledger a real block of that
  // runtime would select. [CD-2, LG-3]
  it("pairs its default runtime with its default ledger as every built-in network's ledger table does", () => {
    for (const network of KNOWN_NETWORKS) {
      const table = builtInLedgerTable(network) as LedgerTable;
      const selected = selectLedgerVersion(table, blockWith(5, [mnsvItem(IN_MEMORY_SPEC_VERSION)]));
      expect(selected, network).toEqual({ specVersion: IN_MEMORY_SPEC_VERSION, ledger: IN_MEMORY_LEDGER });
    }
  });

  it("gives a block's own runtime, time and ledger when the options say", async () => {
    const source = new InMemoryBlockSource({
      head: 3n,
      items: (block) => (block.height === 2n ? { specVersion: 1_000_000, timestampMs: 5n, ledger: "v8" } : {}),
    });
    const two = await source.blockItems(inMemoryBlock(2n));
    expect([two["block-header"].specVersion, two["block-header"].timestampMs, two["ledger-version"]]).toEqual([1_000_000, 5n, "v8"]);
    expect(two["runtime-metadata"].specVersion).toBe(1_000_000);
    const three = await source.blockItems(inMemoryBlock(3n));
    expect(three["ledger-version"]).toBe("v9");
  });
});
