import { describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { type GraphInput, type PublicItem, resolveGraph } from "../../src/modules/graph.js";
import { declaration } from "./declarations.js";
import { CORE_CHAIN, CORE_DIGEST, consumer, entry, graphInput, range } from "./graph-fixtures.js";

/**
 * A private process's requirement graph with the public core's `table` items. The public items, as the public
 * database's configuration history records them, count as provided at the heights their public providers run:
 * - a private module requiring one that no public module provides is refused with `item-no-provider`;
 * - one provided only at other heights is refused with `item-not-available`;
 * - a public item named like an item of the private backbone is the private backbone's;
 * - a private module providing a public item's name at a common height is refused with `providers-overlap` [Q146].
 * [PP-13, Q126 B, MD-3, MD-6]
 *
 * Public providers take no part in the order, the cycle checks or the mid-chain start check. The process-level
 * acceptance test is `test/private/public-items.test.ts`. [MD-4, A155]
 */

/** A `table` item `name` of a part, in a schema named after it. */
const tableItem = (name: string, schema: string, lifetimes: ("block" | "table")[] = ["table"]) => ({
  name,
  lifetimes,
  table: { schema, tables: ["t"], kind: "append-only" as const },
});

/** The private backbone's shape (`src/backbone/private.ts`): core-chain, core-private-source, core-digest. */
const PRIVATE_SOURCE = declaration("core-private-source", {
  requires: [],
  provides: [tableItem("private-cursor", "core_private_source")],
  migrations: [],
});
const PRIVATE_DIGEST: ModuleDeclaration = { ...CORE_DIGEST, requires: ["private-cursor"] };
const PRIVATE_BACKBONE: readonly ModuleDeclaration[] = [CORE_CHAIN, PRIVATE_SOURCE, PRIVATE_DIGEST];

/** A public item: `name`, provided by the public entry `provider` from `start` to `stop`. */
function item(name: string, provider: string, start: number, stop: number | null = null): PublicItem {
  return { item: name, provider, start: BigInt(start), stop: stop === null ? null : BigInt(stop) };
}

/** What a public core's configuration history records of its backbone (`core`) from S = 1. */
const PUBLIC_BACKBONE = ["blocks", "chain-identity", "digest-checkpoints", "digest-tables"].map((name) => item(name, "core", 1));

/** `core-ledger-state`'s `table` items, from `start` (to `stop`). */
const ledger = (start: number, stop: number | null = null): PublicItem[] =>
  ["ledger-events", "ledger-state", "segment-results"].map((name) => item(name, "core-ledger-state", start, stop));

/** A private wallet module requiring `ledger-events` (and `rest`). */
const wallet = (rest: Partial<ModuleDeclaration> = {}): ModuleDeclaration =>
  consumer("wallet", ["ledger-events"], { side: "private", ...rest });

/** `resolveGraph`'s input on a private process: the private backbone, `user`, S = 1, and the public items. */
function privateInput(
  user: readonly ModuleDeclaration[],
  entries: Parameters<typeof graphInput>[1],
  publicItems: readonly PublicItem[] | undefined,
  rest: Parameters<typeof graphInput>[2] = {},
): GraphInput {
  const input = graphInput(user, entries, { backbone: PRIVATE_BACKBONE, ...rest });
  return publicItems === undefined ? input : { ...input, publicItems };
}

/** The refusal resolving `input` throws; fails when it resolves. */
function refusalOf(input: GraphInput): UmbraError {
  try {
    resolveGraph(input);
  } catch (error) {
    expect(error).toBeInstanceOf(UmbraError);
    return error as UmbraError;
  }
  throw new Error("expected a refusal, and the graph resolved");
}

describe("PP-13: a private module may require the public core's table items", () => {
  it("starts a wallet module on ledger-events when the public core enables core-ledger-state from S; without it, item-no-provider", () => {
    expect(() => resolveGraph(privateInput([wallet()], [entry("wallet", 1)], [...PUBLIC_BACKBONE, ...ledger(1)]))).not.toThrow();
    const refused = refusalOf(privateInput([wallet()], [entry("wallet", 1)], PUBLIC_BACKBONE));
    expect(refused.code).toBe("item-no-provider");
    expect(refused.details).toEqual({ module: "wallet", item: "ledger-events", range: range(1, null), notEnabled: [] });
    expect(refused.message).toContain("module wallet requires the item ledger-events at heights from 1 on");
    expect(refused.message).toContain("nor does any module of the public core");
  });

  it("counts a public backbone item (blocks) as provided from S, as the public core records it under core", () => {
    const reader = consumer("reader", ["blocks"], { side: "private" });
    expect(() => resolveGraph(privateInput([reader], [entry("reader", 1)], PUBLIC_BACKBONE))).not.toThrow();
    expect(refusalOf(privateInput([reader], [entry("reader", 1)], [])).details).toMatchObject({ item: "blocks" });
  });

  it("counts a public item only where its public provider runs: item-not-available names the range and the public provider", () => {
    const late = refusalOf(privateInput([wallet()], [entry("wallet", 1)], ledger(5)));
    expect(late.code).toBe("item-not-available");
    expect(late.details).toEqual({
      module: "wallet",
      item: "ledger-events",
      range: range(1, 4),
      providers: [],
      publicProviders: ["core-ledger-state"],
    });
    expect(late.message).toContain("at heights 1–4, where no module provides it");
    expect(late.message).toContain("core-ledger-state of the public core");
    // A public module that stops: its stop (the revision's last height) bounds the item. [CF-5]
    const stopped = refusalOf(privateInput([wallet()], [entry("wallet", 1)], ledger(1, 7)));
    expect(stopped.details).toMatchObject({ item: "ledger-events", range: range(8, null) });
    // Within the public provider's heights, it starts.
    expect(() => resolveGraph(privateInput([wallet()], [entry("wallet", 5)], ledger(5)))).not.toThrow();
    expect(() => resolveGraph(privateInput([wallet()], [entry("wallet", 1, 7)], ledger(1, 7)))).not.toThrow();
    // Provided only below S: at other heights, not none.
    expect(refusalOf(privateInput([wallet()], [entry("wallet", 3)], ledger(0, 1), { start: 2n })).code).toBe(
      "item-not-available",
    );
  });

  it("takes a handoff between two public providers as one item, and names a gap between them (MD-6)", () => {
    const handoff = [item("ledger-events", "p1", 1, 9), item("ledger-events", "p2", 10)];
    expect(() => resolveGraph(privateInput([wallet()], [entry("wallet", 1)], handoff))).not.toThrow();
    const gap = refusalOf(privateInput([wallet()], [entry("wallet", 1)], [item("ledger-events", "p1", 1, 8), item("ledger-events", "p2", 10)]));
    expect(gap.details).toEqual({
      module: "wallet",
      item: "ledger-events",
      range: range(9, 9),
      providers: [],
      publicProviders: ["p1", "p2"],
    });
  });

  it("never counts a public block or process item: only table items are recorded", () => {
    const header = consumer("header", ["block-header"], { side: "private" });
    const refused = refusalOf(privateInput([header], [entry("header", 1)], [...PUBLIC_BACKBONE, ...ledger(1)]));
    expect(refused.details).toMatchObject({ module: "header", item: "block-header" });
    expect(refused.code).toBe("item-no-provider");
  });

  it("leaves the private backbone's own items to it: a public item of the same name is not counted, nor refused", () => {
    const identity = consumer("identity", ["chain-identity", "digest-tables"], { side: "private" });
    // The public core records chain-identity only from 5; the private core-chain provides it from S.
    const publicItems = [item("chain-identity", "core", 5), item("digest-tables", "core", 1)];
    const graph = resolveGraph(privateInput([identity], [entry("identity", 1)], publicItems));
    expect(graph.rangeAt(1n)?.providerOf.get("chain-identity")).toBe("core-chain");
    expect(graph.rangeAt(1n)?.providerOf.get("digest-tables")).toBe("core-digest");
  });

  it("refuses a private module providing an item a public module provides at a common height (MD-6, Q146)", () => {
    const mine = declaration("mine", {
      side: "private",
      requires: ["private-cursor"],
      provides: [tableItem("ledger-events", "mine")],
    });
    const refused = refusalOf(privateInput([mine, wallet()], [entry("mine", 1), entry("wallet", 1)], ledger(5)));
    expect(refused.code).toBe("providers-overlap");
    expect(refused.details).toEqual({
      item: "ledger-events",
      modules: ["mine"],
      publicModules: ["core-ledger-state"],
      range: range(5, null),
    });
    expect(refused.message).toContain("module mine and core-ledger-state of the public core both provide the item ledger-events");
    // A handoff from the private module to the public one is no overlap.
    expect(() =>
      resolveGraph(privateInput([mine, wallet()], [entry("mine", 1, 4), entry("wallet", 1)], ledger(5))),
    ).not.toThrow();
  });

  it("names every provider of an overlap: several private modules with a public one, or two public ones", () => {
    const own = (id: string) =>
      declaration(id, { side: "private", requires: ["private-cursor"], provides: [tableItem("ledger-events", id)] });
    const three = refusalOf(privateInput([own("a"), own("b")], [entry("a", 1), entry("b", 1)], ledger(1)));
    expect(three.message).toContain("the modules a and b and core-ledger-state of the public core all provide the item");
    expect(three.details).toMatchObject({ modules: ["a", "b"], publicModules: ["core-ledger-state"] });
    // Two public providers at one height (which the public core refuses itself): refused too, failing closed.
    const twice = refusalOf(privateInput([wallet()], [entry("wallet", 1)], [item("ledger-events", "p", 1), item("ledger-events", "q", 3)]));
    expect(twice.message).toContain("p and q of the public core both provide the item ledger-events at heights from 3 on");
    expect(twice.details).toEqual({ item: "ledger-events", modules: [], publicModules: ["p", "q"], range: range(3, null) });
  });

  it("resolves the private parts only: public providers take no part in the order, segments, providers, cycles or MD-4", () => {
    const graph = resolveGraph(privateInput([wallet()], [entry("wallet", 1, 10)], [...PUBLIC_BACKBONE, ...ledger(1, 20)]));
    expect(graph.modules.map((part) => part.id)).toEqual([
      "core-chain",
      "core-private-source",
      "core-digest",
      "wallet",
    ]);
    expect([...graph.segments.keys()]).not.toContain("core-ledger-state");
    // The ranges split at the public item's stop + 1, as at an entry's; each holds the private parts only.
    expect(graph.ranges.map((resolved) => resolved.range)).toEqual([range(1, 10), range(11, 20), range(21, null)]);
    for (const resolved of graph.ranges) {
      expect(resolved.order.every((part) => part.id !== "core-ledger-state")).toBe(true);
      expect(resolved.providerOf.has("ledger-events")).toBe(false);
    }
    // Each range says which public items it counts (the dispatch waits for no part on them): blocks from S, the
    // ledger's to 20; never an item a part provides, as chain-identity and the digests are the private backbone's.
    expect(graph.ranges.map((resolved) => [...(resolved.publicItems ?? [])].sort())).toEqual([
      ["blocks", "ledger-events", "ledger-state", "segment-results"],
      ["blocks", "ledger-events", "ledger-state", "segment-results"],
      ["blocks"],
    ]);
    // In the range that ends at the cursor (providers are not checked there) an item a part provides is the part's,
    // never a public item, though the public core provides it too. [Q97]
    const mine = declaration("mine", { side: "private", requires: ["private-cursor"], provides: [tableItem("ledger-events", "mine")] });
    const atCursor = resolveGraph(privateInput([mine, wallet()], [entry("mine", 1, 4), entry("wallet", 1)], ledger(1), { cursor: 4n }));
    expect(atCursor.rangeAt(4n)?.providerOf.get("ledger-events")).toBe("mine");
    expect(atCursor.rangeAt(4n)?.publicItems?.has("ledger-events")).toBe(false);
    expect(atCursor.rangeAt(5n)?.publicItems?.has("ledger-events")).toBe(true);
    // A public process's ranges have none.
    expect(resolveGraph(graphInput([], [])).ranges[0]?.publicItems).toBeUndefined();
    // Mid-chain start: a public provider starting with the module is the public core's to judge; its startsMidChain is
    // not known. [MD-4]
    expect(() => resolveGraph(privateInput([wallet()], [entry("wallet", 5)], ledger(5)))).not.toThrow();
  });

  it("checks only the ranges above the private cursor: a public gap at or below it was judged when those heights ran (Q97)", () => {
    expect(() => resolveGraph(privateInput([wallet()], [entry("wallet", 1)], ledger(5), { cursor: 10n }))).not.toThrow();
    expect(() => resolveGraph(privateInput([wallet()], [entry("wallet", 1)], ledger(5), { cursor: 4n }))).not.toThrow();
    expect(refusalOf(privateInput([wallet()], [entry("wallet", 1)], ledger(5), { cursor: 3n })).details).toMatchObject({
      range: range(1, 4),
    });
  });

  it("changes nothing without public items (a public process), and counts none when the public core records none", () => {
    const without = refusalOf(privateInput([wallet()], [entry("wallet", 1)], undefined));
    expect(without.details).toEqual({ module: "wallet", item: "ledger-events", range: range(1, null), notEnabled: [] });
    expect(without.message).not.toContain("public core");
    const none = refusalOf(privateInput([wallet()], [entry("wallet", 1)], []));
    expect(none.code).toBe("item-no-provider");
    expect(none.message).toContain("nor does any module of the public core");
  });

  it("throws for a public item that stops before it starts: the caller's error, not a refusal", () => {
    expect(() => resolveGraph(privateInput([wallet()], [entry("wallet", 1)], [item("ledger-events", "p", 5, 4)]))).toThrow(
      /the public item ledger-events of p stops at 4, before its start 5/,
    );
  });
});
