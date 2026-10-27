import { describe, expect, it } from "vitest";
import { type ErrorCode, UmbraError } from "../../src/db/errors.js";
import { schemaPlan } from "../../src/modules/adapters.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import {
  BACKBONE_ORDER,
  GRAPH_RULES,
  type GraphInput,
  type ResolvedGraph,
  resolveGraph,
  resolveWith,
  utf8Order,
} from "../../src/modules/graph.js";
import { declaration } from "./declarations.js";
import {
  BACKBONE,
  backboneWithout,
  blockItem,
  consumer,
  CORE_BLOCK_COMMIT,
  CORE_CHAIN,
  CORE_DIGEST,
  entry,
  graphInput,
  provider,
  range,
  S,
} from "./graph-fixtures.js";

/**
 * The requirement graph per height range (tasks 3.2 and 3.2a; MD-3, MD-4, MD-5, MD-6, RN-3; decision record Q95–Q98),
 * without a database: `resolveGraph` takes the validated declarations, S, every module entry's height ranges, the
 * development opt-in and the cursor (null on a new database), and either refuses — naming the range, the module and the
 * item — or returns the order and providers of each range from the one holding the cursor on, and the database's
 * modules in startup order. Startup checks what this build will run (Q97): every range holding a height above the
 * cursor, the range ending at the cursor for a cycle only, the starts above the cursor, the development-only modules
 * active at the cursor or later; a start above 0 (genesis) is a mid-chain start, at an S above 0 too (Q96), and a
 * provider active at the height before a module's start need not promise it (Q98). The outputs fed to `planSchemas` and
 * `startDatabase` on both backends, and A25's continuous table, are `graph-database.test.ts`. "Startup refuses" through
 * the runner's refusal state is task 5.x's.
 */

/** The error `run` throws; fails the test if it returns or throws anything but an `UmbraError`. */
function refusal(run: () => unknown): UmbraError {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(UmbraError);
    return error as UmbraError;
  }
  return expect.unreachable("expected a refusal");
}

const ids = (declarations: readonly ModuleDeclaration[]): string[] => declarations.map((d) => d.id);

/** A module that requires `requires` and provides the `block` items `provides`. */
function module(id: string, requires: readonly string[], provides: readonly string[], rest: Partial<ModuleDeclaration> = {}) {
  return declaration(id, { requires: [...requires], provides: provides.map(blockItem), migrations: [], ...rest });
}

/** A provider of the shared `table` item `contract-logs` (CORE-ARCH §4.11's two contract-logs modules). */
function logsProvider(id: string): ModuleDeclaration {
  return declaration(id, {
    provides: [
      {
        name: "contract-logs",
        lifetimes: ["block", "table"],
        table: { schema: "contract_logs", tables: ["logs"], kind: "append-only" },
      },
    ],
    migrations: [{ id: "001", sql: "CREATE TABLE contract_logs.logs (height bigint PRIMARY KEY)" }],
  });
}

/** One refusal of MD-3–MD-6: its input, and the code, details and words it must give. */
interface RefusalCase {
  readonly name: string;
  readonly input: () => GraphInput;
  readonly code: ErrorCode;
  readonly details: Record<string, unknown>;
  readonly words: readonly string[];
}

const PRICES = provider("p", ["prices"]);

/** A22's table (MD-3), with MD-4's, MD-5's and MD-6's refusals beside it (A23, A24, A25). */
const CASES: readonly RefusalCase[] = [
  {
    name: "A22 missing provider: nothing enabled provides a required item",
    input: () => graphInput([consumer("c", ["prices"])], [entry("c", 1)]),
    code: "item-no-provider",
    details: { module: "c", item: "prices", range: range(1, null), notEnabled: [] },
    words: ["module c", "prices", "from 1 on"],
  },
  {
    name: "A22 missing provider: the module that provides it is in the build but has no entry",
    input: () => graphInput([PRICES, consumer("c", ["prices"])], [entry("c", 1)]),
    code: "item-no-provider",
    details: { module: "c", item: "prices", range: range(1, null), notEnabled: ["p"] },
    words: ["module c", "prices", "module p", "no entry"],
  },
  {
    name: "A22 overlapping providers: two modules provide one item at heights 40–50",
    input: () =>
      graphInput(
        [provider("p1", ["prices"]), provider("p2", ["prices"]), consumer("c", ["prices"])],
        [entry("p1", 1, 50), entry("p2", 40), entry("c", 1)],
      ),
    code: "providers-overlap",
    details: { item: "prices", modules: ["p1", "p2"], range: range(40, 50) },
    words: ["p1 and p2", "prices", "40–50"],
  },
  {
    name: "A22 overlapping providers: a module provides an item a backbone part provides",
    input: () => graphInput([provider("x", ["block-header"])], [entry("x", 1)]),
    code: "providers-overlap",
    details: { item: "block-header", modules: ["core-block-fetch", "x"], range: range(1, null) },
    words: ["core-block-fetch and x", "block-header", "from 1 on"],
  },
  {
    name: "A22 cycle: a requires b's item and b requires a's",
    input: () =>
      graphInput([module("a", ["b-out"], ["a-out"]), module("b", ["a-out"], ["b-out"])], [entry("a", 1), entry("b", 1)]),
    code: "graph-cycle",
    details: { modules: ["a", "b"], items: ["b-out", "a-out"], range: range(1, null) },
    words: ["a requires b-out from b", "b requires a-out from a", "from 1 on"],
  },
  {
    name: "A22 cycle: a module requires an item it provides itself",
    input: () => graphInput([module("m", ["m-out"], ["m-out"])], [entry("m", 1)]),
    code: "graph-cycle",
    details: { modules: ["m"], items: ["m-out"], range: range(1, null) },
    words: ["m requires m-out from m"],
  },
  {
    name: "A22 cycle: in one range only, where the provider of x requires a's item",
    input: () =>
      graphInput(
        [module("a", ["x"], ["a-out"]), module("b", ["a-out"], ["x"]), provider("c", ["x"])],
        [entry("a", 1), entry("b", 1, 49), entry("c", 50)],
      ),
    code: "graph-cycle",
    details: { modules: ["a", "b"], items: ["x", "a-out"], range: range(1, 49) },
    words: ["a requires x from b", "b requires a-out from a", "1–49"],
  },
  {
    name: "A22 cycle: only across ranges, three items handed over in turn (Q95)",
    // m1 needs x (m2, then s), m2 needs y (q, then m3), m3 needs z (r, then m1): each range is acyclic, their union
    // m1 → m2 → m3 → m1 is not, so no one startup order runs every provider's migrations before its consumers'.
    input: () =>
      graphInput(
        [
          module("m1", ["x"], ["z"]),
          module("m2", ["y"], ["x"]),
          module("m3", ["z"], ["y"]),
          provider("q", ["y"]),
          provider("r", ["z"]),
          provider("s", ["x"]),
        ],
        [
          entry("m1", 1, 9),
          entry("m1", 20),
          entry("m2", 1, 19),
          entry("m3", 10),
          entry("q", 1, 9),
          entry("r", 10, 19),
          entry("s", 20),
        ],
      ),
    code: "graph-cycle",
    details: {
      modules: ["m1", "m2", "m3"],
      items: ["x", "y", "z"],
      range: range(1, null),
      ranges: [range(1, 9), range(10, 19), range(20, null)],
    },
    words: [
      "m1 requires x from m2 at heights 1–9",
      "m2 requires y from m3 at heights 10–19",
      "m3 requires z from m1 at heights from 20 on",
      "startup",
    ],
  },
  {
    name: "A22 uncovered range: consumer starts at 10, its provider at 20 (MD-3's scenario)",
    input: () => graphInput([PRICES, consumer("c", ["prices"])], [entry("c", 10), entry("p", 20)]),
    code: "item-not-available",
    details: { module: "c", item: "prices", range: range(10, 19), providers: ["p"] },
    words: ["module c", "prices", "10–19", "provided by p"],
  },
  {
    name: "A22 uncovered range: the provider stops before its consumer",
    input: () => graphInput([PRICES, consumer("c", ["prices"])], [entry("c", 1), entry("p", 1, 50)]),
    code: "item-not-available",
    details: { module: "c", item: "prices", range: range(51, null), providers: ["p"] },
    words: ["module c", "prices", "from 51 on"],
  },
  {
    name: "A22 uncovered range: a gap between two revisions of the provider",
    input: () =>
      graphInput([PRICES, consumer("c", ["prices"])], [entry("c", 1), entry("p", 1, 30), entry("p", 41)]),
    code: "item-not-available",
    details: { module: "c", item: "prices", range: range(31, 40), providers: ["p"] },
    words: ["module c", "prices", "31–40"],
  },
  {
    name: "A22 uncovered range: named once over a boundary inside it",
    input: () =>
      graphInput(
        [PRICES, consumer("c", ["prices"]), consumer("o", ["block-header"])],
        [entry("c", 10), entry("o", 15), entry("p", 20)],
      ),
    code: "item-not-available",
    details: { module: "c", item: "prices", range: range(10, 19), providers: ["p"] },
    words: ["10–19"],
  },
  {
    name: "A22 missing provider: in the range holding the cursor, named over the whole range (Q97)",
    input: () => graphInput([consumer("c", ["prices"])], [entry("c", 1, 100)], { cursor: 50n }),
    code: "item-no-provider",
    details: { module: "c", item: "prices", range: range(1, 100), notEnabled: [] },
    words: ["module c", "prices", "1–100"],
  },
  {
    name: "A22 uncovered range: named from the first range that holds a height above the cursor (Q97)",
    // c lacks prices at 1–39 and 40–59 (o splits them); the cursor is 45, so 1–39 was judged by the builds that ran it.
    input: () =>
      graphInput(
        [PRICES, consumer("c", ["prices"]), consumer("o", ["block-header"])],
        [entry("c", 1), entry("o", 40), entry("p", 60)],
        { cursor: 45n },
      ),
    code: "item-not-available",
    details: { module: "c", item: "prices", range: range(40, 59), providers: ["p"] },
    words: ["module c", "prices", "40–59"],
  },
  {
    name: "A22 cycle: in the range that ends at the cursor, where RN-11 re-delivers in RN-3's order (Q97)",
    input: () =>
      graphInput(
        [module("a", ["b-out"], ["a-out"]), module("b", ["a-out"], ["b-out"])],
        [entry("a", 1, 50), entry("b", 1, 50)],
        { cursor: 50n },
      ),
    code: "graph-cycle",
    details: { modules: ["a", "b"], items: ["b-out", "a-out"], range: range(1, 50) },
    words: ["a requires b-out from b", "b requires a-out from a", "1–50"],
  },
  {
    name: "A23 a module with startsMidChain false starting above S",
    input: () => graphInput([consumer("m", ["block-header"], { startsMidChain: false })], [entry("m", 20)]),
    code: "cannot-start-mid-chain",
    details: { module: "m", start: 20n, range: range(20, null) },
    words: ["module m", "starts at 20", "above genesis", "startsMidChain"],
  },
  {
    name: "A23 a module with startsMidChain false at an S above genesis (Q96, MD-4's scenario)",
    input: () =>
      graphInput([consumer("m", ["block-header"], { startsMidChain: false })], [entry("m", 2_000_000)], {
        start: 2_000_000n,
      }),
    code: "cannot-start-mid-chain",
    details: { module: "m", start: 2_000_000n, range: range(2_000_000, null) },
    words: ["module m", "starts at 2000000", "S", "above genesis", "startsMidChain"],
  },
  {
    name: "A23 a module with startsMidChain false whose entry starts below S, so at S above genesis (Q96)",
    input: () =>
      graphInput([consumer("m", ["block-header"], { startsMidChain: false })], [entry("m", 0)], { start: 10n }),
    code: "cannot-start-mid-chain",
    details: { module: "m", start: 10n, range: range(10, null) },
    words: ["module m", "starts at 10"],
  },
  {
    name: "A23 a backbone part with startsMidChain false at S above genesis, like any declaration (Q96)",
    // core-digest requires blocks from core-block-commit, which starts with it at S: named with it (Q98).
    input: () => graphInput([], [], { backbone: backboneWithout("core-block-commit") }),
    code: "cannot-start-mid-chain",
    details: { module: "core-digest", start: 1n, range: range(1, null), item: "blocks", provider: "core-block-commit" },
    words: ["module core-digest", "starts at 1", "blocks from core-block-commit"],
  },
  {
    name: "A23 a backbone part with startsMidChain false at S above genesis, that no part requires (Q96)",
    input: () => graphInput([], [], { backbone: backboneWithout("core-digest") }),
    code: "cannot-start-mid-chain",
    details: { module: "core-digest", start: 1n, range: range(1, null) },
    words: ["module core-digest", "starts at 1"],
  },
  {
    name: "A23 a start one height above the cursor (Q97)",
    input: () =>
      graphInput([consumer("m", ["block-header"], { startsMidChain: false })], [entry("m", 21)], { cursor: 20n }),
    code: "cannot-start-mid-chain",
    details: { module: "m", start: 21n, range: range(21, null) },
    words: ["module m", "starts at 21"],
  },
  {
    name: "A23 a module whose provider cannot start mid-chain and starts with it, not active before (Q98)",
    // Q98: the provider is asked because it is not active at 19; its own start at 20 is refused too, named after m's.
    input: () =>
      graphInput(
        [provider("p", ["prices"], { startsMidChain: false }), consumer("m", ["prices"])],
        [entry("p", 20), entry("m", 20)],
      ),
    code: "cannot-start-mid-chain",
    details: { module: "m", start: 20n, range: range(20, null), item: "prices", provider: "p" },
    words: ["module m", "starts at 20", "prices from p", "not active at 19", "startsMidChain"],
  },
  {
    name: "A23 a module at S above genesis whose provider cannot start mid-chain: nothing runs before S (Q96, Q98)",
    input: () =>
      graphInput(
        [provider("p", ["prices"], { startsMidChain: false }), consumer("m", ["prices"])],
        [entry("p", 10), entry("m", 10)],
        { start: 10n },
      ),
    code: "cannot-start-mid-chain",
    details: { module: "m", start: 10n, range: range(10, null), item: "prices", provider: "p" },
    words: ["module m", "starts at 10", "prices from p", "no height before S"],
  },
  {
    name: "A23 a module with startsMidChain false starting again after a gap between its revisions",
    // Q96: from genesis (S = 0), so that only the start after the gap is mid-chain.
    input: () =>
      graphInput([consumer("m", ["block-header"], { startsMidChain: false })], [entry("m", 0, 30), entry("m", 50)], {
        start: 0n,
      }),
    code: "cannot-start-mid-chain",
    details: { module: "m", start: 50n, range: range(50, null) },
    words: ["module m", "starts at 50"],
  },
  {
    name: "A24 a development-only user module without the development opt-in",
    input: () => graphInput([consumer("d", ["block-header"], { developmentOnly: true })], [entry("d", 1)]),
    code: "development-opt-in-required",
    details: { feature: "development-only-module", module: "d" },
    words: ["module d", "developmentOptIn"],
  },
  {
    name: "A24 a development-only module whose last entry ends at the cursor, where RN-11 re-delivers it (Q97)",
    input: () =>
      graphInput([consumer("d", ["block-header"], { developmentOnly: true })], [entry("d", 1, 50)], { cursor: 50n }),
    code: "development-opt-in-required",
    details: { feature: "development-only-module", module: "d" },
    words: ["module d", "developmentOptIn"],
  },
  {
    name: "A24 a development-only core module without the development opt-in",
    input: () =>
      graphInput([], [entry("core-logs-fast", 1)], {
        core: [consumer("core-logs-fast", ["block-header"], { developmentOnly: true })],
      }),
    code: "development-opt-in-required",
    details: { feature: "development-only-module", module: "core-logs-fast" },
    words: ["core-logs-fast", "developmentOptIn"],
  },
  {
    name: "A25 two providers of one shared item overlapping at one height",
    input: () =>
      graphInput(
        [logsProvider("logs-full"), logsProvider("logs-fast"), consumer("reader", ["contract-logs"])],
        [entry("logs-full", 1, 100), entry("logs-fast", 100), entry("reader", 1)],
      ),
    code: "providers-overlap",
    details: { item: "contract-logs", modules: ["logs-fast", "logs-full"], range: range(100, 100) },
    words: ["logs-fast and logs-full", "contract-logs", "100–100"],
  },
];

describe("A22–A25: each refusal of MD-3–MD-6 names its code, range, module and item", () => {
  it.each(CASES)("$name", ({ input, code, details, words }) => {
    const error = refusal(() => resolveGraph(input()));
    expect(error.code).toBe(code);
    expect(error.details).toEqual(details);
    expect(error.retryable).toBe(false);
    for (const word of words) expect(error.message).toContain(word);
  });

  it("covers every rule of GRAPH_RULES, and every code MD-3–MD-6 and design.md §11 give them", () => {
    expect(GRAPH_RULES.map((rule) => rule.code)).toEqual([
      "development-opt-in-required",
      "providers-overlap",
      "item-no-provider",
      "item-not-available",
      "graph-cycle",
      "cannot-start-mid-chain",
    ]);
    for (const rule of GRAPH_RULES) expect(CASES.some((c) => c.code === rule.code), rule.code).toBe(true);
  });

  it("negative control: the resolution built without one rule fails exactly that rule's cases", () => {
    for (const removed of GRAPH_RULES) {
      const rules = GRAPH_RULES.filter((rule) => rule !== removed);
      const failing = CASES.filter((c) => outcome(c.input(), rules) !== c.code).map((c) => c.name);
      expect(failing, removed.code).toEqual(CASES.filter((c) => c.code === removed.code).map((c) => c.name));
    }
    // With every rule, every case gives its own code.
    expect(CASES.filter((c) => outcome(c.input(), GRAPH_RULES) !== c.code)).toEqual([]);
  });

  it("refuses the first fault of the first rule when a configuration has several", () => {
    const error = refusal(() =>
      resolveGraph(
        graphInput(
          [
            consumer("d", ["block-header"], { developmentOnly: true }),
            consumer("c", ["prices"]),
            provider("p1", ["prices"]),
            provider("p2", ["prices"]),
          ],
          [entry("d", 1), entry("c", 1), entry("p1", 1), entry("p2", 5)],
        ),
      ),
    );
    expect(error.code).toBe("development-opt-in-required");
    const next = refusal(() =>
      resolveGraph(
        graphInput(
          [consumer("c", ["prices", "volumes"]), provider("p1", ["prices"]), provider("p2", ["prices"])],
          [entry("c", 1), entry("p1", 1), entry("p2", 5)],
        ),
      ),
    );
    expect(next.code).toBe("providers-overlap");
    expect(next.details).toEqual({ item: "prices", modules: ["p1", "p2"], range: range(5, null) });
  });

  it("names the earliest range first, then the smallest module id, then the item in its declaration's order", () => {
    const error = refusal(() =>
      resolveGraph(
        graphInput(
          [consumer("b", ["volumes", "prices"]), consumer("a", ["prices"]), consumer("z", ["volumes"])],
          [entry("b", 5), entry("a", 5), entry("z", 1)],
        ),
      ),
    );
    expect(error.details).toEqual({ module: "z", item: "volumes", range: range(1, null), notEnabled: [] });
    const later = refusal(() =>
      resolveGraph(graphInput([consumer("b", ["volumes", "prices"]), consumer("a", ["prices"])], [entry("b", 5), entry("a", 5)])),
    );
    expect(later.details).toEqual({ module: "a", item: "prices", range: range(5, null), notEnabled: [] });
    const own = refusal(() => resolveGraph(graphInput([consumer("b", ["volumes", "prices"])], [entry("b", 5)])));
    expect(own.details).toEqual({ module: "b", item: "volumes", range: range(5, null), notEnabled: [] });
  });
});

/** The outcome of resolving `input` with `rules`: "accepted", the refusal's code, or what else was thrown. */
function outcome(input: GraphInput, rules: typeof GRAPH_RULES = GRAPH_RULES): string {
  try {
    resolveWith(input, rules);
    return "accepted";
  } catch (error) {
    return error instanceof UmbraError ? error.code : `thrown: ${(error as Error).message.slice(0, 40)}`;
  }
}

/** A database whose only fault lies at or below its cursor, and the refusal the same input gives without the cursor. */
interface PastFaultCase {
  readonly name: string;
  readonly input: () => GraphInput;
  readonly ignored: ErrorCode;
}

const TX_RESULTS = provider("core-tx-results", ["tx-results"]);

/** A module providing the backbone's `block-header`, requiring only `node-client` (not its own item: no cycle). */
const BLOCK_HEADER_TOO = provider("x", ["block-header"], { requires: ["node-client"] });

/**
 * MD-3's scenario "An upgrade adds a requirement": `m` ran from 500 without requiring `tx-results`; the build's `m`
 * requires it, provided by `core-tx-results` from 10,000, where `m`'s new revision starts; the cursor is 9,999.
 */
function upgradeAddsRequirement(cursor: bigint | null): GraphInput {
  return graphInput(
    [consumer("m", ["block-header", "tx-results"])],
    [entry("m", 500, 9_999), entry("m", 10_000), entry("core-tx-results", 10_000)],
    { core: [TX_RESULTS], cursor },
  );
}

/** A22's, A23's and A24's "not refused": faults that only heights at or below the cursor have (Q97). */
const PAST_FAULTS: readonly PastFaultCase[] = [
  {
    name: "A22 missing provider only in the range that ends at the cursor",
    input: () => graphInput([consumer("c", ["prices"])], [entry("c", 1, 50)], { cursor: 50n }),
    ignored: "item-no-provider",
  },
  {
    name: "A22 missing provider only in a range that ends below the cursor",
    input: () => graphInput([consumer("c", ["prices"])], [entry("c", 1, 50)], { cursor: 80n }),
    ignored: "item-no-provider",
  },
  {
    name: "A22 overlapping providers only in the range that ends at the cursor",
    input: () =>
      graphInput(
        [provider("p1", ["prices"]), provider("p2", ["prices"]), consumer("c", ["prices"])],
        [entry("p1", 1, 50), entry("p2", 40), entry("c", 1)],
        { cursor: 50n },
      ),
    ignored: "providers-overlap",
  },
  {
    name: "A22 overlapping providers only in the range that ends at the cursor, one of them a backbone part",
    input: () =>
      graphInput([BLOCK_HEADER_TOO, consumer("c", ["block-header"])], [entry("x", 1, 50), entry("c", 1)], {
        cursor: 50n,
      }),
    ignored: "providers-overlap",
  },
  {
    name: "A22 uncovered range only in the range that ends at the cursor (MD-3's first scenario, at cursor 19)",
    input: () => graphInput([PRICES, consumer("c", ["prices"])], [entry("c", 10), entry("p", 20)], { cursor: 19n }),
    ignored: "item-not-available",
  },
  {
    name: "A22 MD-3's scenario: an upgrade adds a requirement, provided from the cursor + 1",
    input: () => upgradeAddsRequirement(9_999n),
    ignored: "item-not-available",
  },
  {
    name: "A23 a start at the cursor is not checked",
    input: () =>
      graphInput([consumer("m", ["block-header"], { startsMidChain: false })], [entry("m", 20)], { cursor: 20n }),
    ignored: "cannot-start-mid-chain",
  },
  {
    name: "A23 a start below the cursor is not checked, nor the provider that started with it",
    input: () =>
      graphInput(
        [provider("p", ["prices"], { startsMidChain: false }), consumer("m", ["prices"])],
        [entry("p", 20), entry("m", 20)],
        { cursor: 30n },
      ),
    ignored: "cannot-start-mid-chain",
  },
  {
    name: "A23 a module that cannot start mid-chain at an S above genesis, restored with a cursor above it (Q96, BK-3)",
    input: () =>
      graphInput([consumer("m", ["block-header"], { startsMidChain: false })], [entry("m", 2_000_000)], {
        start: 2_000_000n,
        cursor: 2_500_000n,
      }),
    ignored: "cannot-start-mid-chain",
  },
  {
    name: "A23 a backbone part that cannot start mid-chain, at S above genesis below the cursor",
    input: () => graphInput([], [], { backbone: backboneWithout("core-block-commit"), cursor: 1n }),
    ignored: "cannot-start-mid-chain",
  },
  {
    name: "A24 a development-only module whose entries all end below the cursor",
    input: () =>
      graphInput([consumer("d", ["block-header"], { developmentOnly: true })], [entry("d", 1, 50)], { cursor: 51n }),
    ignored: "development-opt-in-required",
  },
];

describe("Q97: a fault only at or below the cursor was judged by the builds that ran it (A22, A23, A24)", () => {
  it.each(PAST_FAULTS)("$name", ({ input }) => {
    expect(outcome(input())).toBe("accepted");
  });

  it("negative control: ignoring the cursor (a new database) refuses each of them with its fault", () => {
    expect(PAST_FAULTS.map((c) => outcome({ ...c.input(), cursor: null }))).toEqual(PAST_FAULTS.map((c) => c.ignored));
  });

  it("negative control: checking the range that ends at the cursor whole refuses MD-3's upgrade scenario", () => {
    // One height earlier, the range 500–9,999 holds a height above the cursor and is checked whole.
    expect(outcome(upgradeAddsRequirement(9_999n))).toBe("accepted");
    const error = refusal(() => resolveGraph(upgradeAddsRequirement(9_998n)));
    expect(error.code).toBe("item-not-available");
    expect(error.details).toEqual({
      module: "m",
      item: "tx-results",
      range: range(500, 9_999),
      providers: ["core-tx-results"],
    });
  });

  it("runs MD-3's upgrade scenario: the cursor's range for RN-11's re-delivery, then the new requirement", () => {
    const graph = resolveGraph(upgradeAddsRequirement(9_999n));
    expect(graph.ranges.map((r) => r.range)).toEqual([range(500, 9_999), range(10_000, null)]);
    expect(ids(graph.rangeAt(9_999n)?.order ?? []).slice(4)).toEqual(["m"]);
    expect(graph.rangeAt(9_999n)?.providerOf.has("tx-results")).toBe(false);
    expect(ids(graph.rangeAt(10_000n)?.order ?? []).slice(4)).toEqual(["core-tx-results", "m"]);
    expect(graph.rangeAt(10_000n)?.providerOf.get("tx-results")).toBe("core-tx-results");
    expect(graph.segments.get("m")).toEqual([range(500, null)]);
  });

  it("refuses a cycle only in ranges ending below the cursor through the union's check (Q95; Q99)", () => {
    // RN-3's startup order runs every part of the database, past ones included, over the union of every range's
    // requirements: a cycle there leaves it no order, wherever the cycle lies.
    const error = refusal(() =>
      resolveGraph(
        graphInput(
          [module("a", ["b-out"], ["a-out"]), module("b", ["a-out"], ["b-out"]), consumer("c", ["block-header"])],
          [entry("a", 1, 30), entry("b", 1, 30), entry("c", 1)],
          { cursor: 50n },
        ),
      ),
    );
    expect(error.code).toBe("graph-cycle");
    expect(error.details).toEqual({
      modules: ["a", "b"],
      items: ["b-out", "a-out"],
      range: range(1, 30),
      ranges: [range(1, 30), range(1, 30)],
    });
  });
});

describe("Q97: the result from the range holding the cursor on", () => {
  const modules = [consumer("a", ["block-header"]), consumer("b", ["block-header"]), consumer("c", ["block-header"])];
  const entries = [entry("a", 1, 39), entry("b", 40, 50), entry("c", 51)];

  it("leaves out the ranges that end below the cursor and keeps the one holding it", () => {
    const at = (cursor: bigint | null) => resolveGraph(graphInput(modules, entries, { cursor }));
    expect(at(null).ranges.map((r) => r.range)).toEqual([range(1, 39), range(40, 50), range(51, null)]);
    expect(at(1n).ranges.map((r) => r.range)).toEqual([range(1, 39), range(40, 50), range(51, null)]);
    expect(at(39n).ranges.map((r) => r.range)).toEqual([range(1, 39), range(40, 50), range(51, null)]);
    expect(at(40n).ranges.map((r) => r.range)).toEqual([range(40, 50), range(51, null)]);
    expect(at(50n).ranges.map((r) => r.range)).toEqual([range(40, 50), range(51, null)]);
    expect(at(51n).ranges.map((r) => r.range)).toEqual([range(51, null)]);
    const graph = at(45n);
    expect(graph.rangeAt(39n)).toBeUndefined();
    expect(graph.rangeAt(45n)?.range).toEqual(range(40, 50));
    expect(ids(graph.rangeAt(45n)?.order ?? []).slice(4)).toEqual(["b"]);
    // Every part of the database stays in the startup order and in the segments, its past ranges included.
    expect(ids(graph.modules).slice(4)).toEqual(["a", "b", "c"]);
    expect(graph.segments.get("a")).toEqual([range(1, 39)]);
  });

  it("gives the range ending at the cursor its orders, and providerOf only for items one part provides there", () => {
    const graph = resolveGraph(
      graphInput(
        [provider("p1", ["prices"]), provider("p2", ["prices"]), consumer("c", ["prices"])],
        [entry("p1", 1, 50), entry("p2", 40), entry("c", 1)],
        { cursor: 50n },
      ),
    );
    const atCursor = graph.rangeAt(50n);
    expect(atCursor?.range).toEqual(range(40, 50));
    expect(ids(atCursor?.order ?? [])).toEqual([...ids(BACKBONE), "p1", "p2", "c"]);
    const backbone = ids(BACKBONE).filter((id) => id !== "core-digest");
    expect(ids(atCursor?.writeOrder ?? [])).toEqual([...backbone, "p1", "p2", "c", "core-digest"]);
    expect(atCursor?.providerOf.has("prices")).toBe(false);
    expect(atCursor?.providerOf.get("blocks")).toBe("core-block-commit");
    expect(graph.rangeAt(51n)?.providerOf.get("prices")).toBe("p2");
  });

  it("orders, in the range ending at the cursor, a module providing a backbone part's item, with no provider for it", () => {
    // Providers are not checked there (Q97), so the backbone's own check does not run there either: x overlaps
    // core-block-fetch at 1–50, which core-block-commit requires; the backbone still runs first.
    const graph = resolveGraph(
      graphInput([BLOCK_HEADER_TOO, consumer("c", ["block-header"])], [entry("x", 1, 50), entry("c", 1)], {
        cursor: 50n,
      }),
    );
    expect(ids(graph.rangeAt(50n)?.order ?? [])).toEqual([...ids(BACKBONE), "x", "c"]);
    expect(graph.rangeAt(50n)?.providerOf.has("block-header")).toBe(false);
    expect(graph.rangeAt(51n)?.providerOf.get("block-header")).toBe("core-block-fetch");
  });

  it("orders startup over the union of every range's requirements, past ranges included (Q95)", () => {
    // z-src provided x to a-use at 1–10 only; a-use's id sorts first, its provider still migrates before it.
    const graph = resolveGraph(
      graphInput(
        [provider("z-src", ["x"]), consumer("a-use", ["x"]), consumer("live", ["block-header"])],
        [entry("z-src", 1, 10), entry("a-use", 1, 10), entry("live", 1)],
        { cursor: 50n },
      ),
    );
    expect(ids(graph.modules).slice(4)).toEqual(["live", "z-src", "a-use"]);
    expect(graph.ranges.map((r) => r.range)).toEqual([range(11, null)]);
  });
});

describe("the refusals' other shapes", () => {
  it("names every provider when three overlap", () => {
    const error = refusal(() =>
      resolveGraph(
        graphInput(
          [provider("p1", ["prices"]), provider("p3", ["prices"]), provider("p2", ["prices"])],
          [entry("p1", 1), entry("p2", 1), entry("p3", 1)],
        ),
      ),
    );
    expect(error.details).toEqual({ item: "prices", modules: ["p1", "p2", "p3"], range: range(1, null) });
    expect(error.message).toContain("the modules p1, p2 and p3 all provide the item prices");
  });

  it("names every module of the build that would provide a missing item", () => {
    const error = refusal(() =>
      resolveGraph(graphInput([provider("p2", ["prices"]), provider("p1", ["prices"]), consumer("c", ["prices"])], [entry("c", 1)])),
    );
    expect(error.details).toEqual({ module: "c", item: "prices", range: range(1, null), notEnabled: ["p1", "p2"] });
    expect(error.message).toContain("modules p1 and p2 of the build provide it but have no entry");
  });

  it("names a cycle across ranges from its smallest id, each requirement with its range, and the whole span", () => {
    // As A22's cross-range case with other names, all of it ending at 29: c1 needs x, a2 needs y, b3 needs z.
    const error = refusal(() =>
      resolveGraph(
        graphInput(
          [
            module("c1", ["x"], ["z"]),
            module("a2", ["y"], ["x"]),
            module("b3", ["z"], ["y"]),
            provider("q", ["y"]),
            provider("r", ["z"]),
            provider("s", ["x"]),
            consumer("later", ["block-header"]),
          ],
          [
            entry("c1", 1, 9),
            entry("c1", 20, 29),
            entry("a2", 1, 19),
            entry("b3", 10, 29),
            entry("q", 1, 9),
            entry("r", 10, 19),
            entry("s", 20, 29),
            entry("later", 30),
          ],
        ),
      ),
    );
    expect(error.code).toBe("graph-cycle");
    expect(error.details).toEqual({
      modules: ["a2", "b3", "c1"],
      items: ["y", "z", "x"],
      range: range(1, 29),
      ranges: [range(10, 19), range(20, 29), range(1, 9)],
    });
  });

  it("names each requirement of a cycle across ranges by the first span where it holds", () => {
    // As above, and a2 and b3 meet again at 40–49, where a2 requires y from b3 a second time.
    const error = refusal(() =>
      resolveGraph(
        graphInput(
          [
            module("c1", ["x"], ["z"]),
            module("a2", ["y"], ["x"]),
            module("b3", ["z"], ["y"]),
            provider("q", ["y"]),
            provider("r", ["z"]),
            provider("s", ["x"]),
          ],
          [
            entry("c1", 1, 9),
            entry("c1", 20, 29),
            entry("a2", 1, 19),
            entry("a2", 40, 49),
            entry("b3", 10, 29),
            entry("b3", 40, 49),
            entry("q", 1, 9),
            entry("r", 10, 19),
            entry("r", 40, 49),
            entry("s", 20, 29),
          ],
        ),
      ),
    );
    expect(error.details).toEqual({
      modules: ["a2", "b3", "c1"],
      items: ["y", "z", "x"],
      range: range(1, 29),
      ranges: [range(10, 19), range(20, 29), range(1, 9)],
    });
  });

  it("walks a cycle to the smallest provider when a module waits for several", () => {
    const error = refusal(() =>
      resolveGraph(
        graphInput(
          [module("a", ["c-out", "b-out"], ["a-out"]), module("c", ["a-out"], ["c-out"]), module("b", ["a-out"], ["b-out"])],
          [entry("a", 1), entry("b", 1), entry("c", 1)],
        ),
      ),
    );
    expect(error.details).toEqual({ modules: ["a", "b"], items: ["b-out", "a-out"], range: range(1, null) });
  });

  it("names a cycle from its smallest module when the walk enters it at another", () => {
    // a (smallest, outside the cycle) waits for d; d and c wait for each other.
    const error = refusal(() =>
      resolveGraph(
        graphInput(
          [module("a", ["x"], ["a-out"]), module("d", ["c-out"], ["x", "d-out"]), module("c", ["d-out"], ["c-out"])],
          [entry("a", 1), entry("c", 1), entry("d", 1)],
        ),
      ),
    );
    expect(error.details).toEqual({ modules: ["c", "d"], items: ["d-out", "c-out"], range: range(1, null) });
  });

  it("names the first span of a fault that holds at heights apart", () => {
    // The provider runs 10–50 only: c lacks prices at 1–9 and again from 51 on.
    const error = refusal(() =>
      resolveGraph(graphInput([PRICES, consumer("c", ["prices"])], [entry("c", 1), entry("p", 10, 50)])),
    );
    expect(error.details).toEqual({ module: "c", item: "prices", range: range(1, 9), providers: ["p"] });
  });

  it("finds a missing item that is not a module's first requirement", () => {
    const error = refusal(() => resolveGraph(graphInput([consumer("c", ["block-header", "prices"])], [entry("c", 1)])));
    expect(error.details).toEqual({ module: "c", item: "prices", range: range(1, null), notEnabled: [] });
  });

  it("refuses the earliest mid-chain start first, then the smallest id", () => {
    const late = (id: string) => consumer(id, ["block-header"], { startsMidChain: false });
    const error = refusal(() =>
      resolveGraph(graphInput([late("m-b"), late("m-c"), late("m-a")], [entry("m-b", 20), entry("m-c", 10), entry("m-a", 20)])),
    );
    expect(error.details).toEqual({ module: "m-c", start: 10n, range: range(10, null) });
    const tie = refusal(() => resolveGraph(graphInput([late("m-b"), late("m-a")], [entry("m-b", 20), entry("m-a", 20)])));
    expect(tie.details).toEqual({ module: "m-a", start: 20n, range: range(20, null) });
  });

  it("never drops a module from an order: without the cycle rule, a cycle is thrown, not left out", () => {
    const input = graphInput([module("a", ["b-out"], ["a-out"]), module("b", ["a-out"], ["b-out"])], [entry("a", 1), entry("b", 1)]);
    const withoutCycles = GRAPH_RULES.filter((rule) => rule.code !== "graph-cycle");
    expect(() => resolveWith(input, withoutCycles)).toThrowError(/the modules a and b wait for one another/);
  });

  it("orders without checking: with no rule, a backbone missing core-chain still gets its order", () => {
    const graph = resolveWith(graphInput([], [], { backbone: BACKBONE.slice(1) }), []);
    expect(ids(graph.modules)).toEqual(["core-block-fetch", "core-block-commit", "core-digest"]);
    expect(refusal(() => resolveGraph(graphInput([], [], { backbone: BACKBONE.slice(1) }))).code).toBe("item-no-provider");
  });
});

describe("A23: modules start mid-chain only when they and their providers promise it (MD-4)", () => {
  it("accepts a module starting above S that declares startsMidChain: true with mid-chain providers", () => {
    const graph = resolveGraph(
      graphInput([provider("p", ["prices"]), consumer("m", ["prices"])], [entry("p", 20), entry("m", 20)]),
    );
    expect(ids(graph.modules)).toContain("m");
    expect(graph.segments.get("m")).toEqual([range(20, null)]);
  });

  it("accepts a module with startsMidChain: false, and its provider, from 0: genesis is never mid-chain (Q96)", () => {
    // Q96 changed this test: under 3.2's shipped A it started at S = 1, which is now a mid-chain start (refused above).
    const graph = resolveGraph(
      graphInput(
        [provider("p", ["prices"], { startsMidChain: false }), consumer("m", ["prices"], { startsMidChain: false })],
        [entry("p", 0), entry("m", 0)],
        { start: 0n, backbone: backboneWithout("core-block-commit") },
      ),
    );
    expect(graph.segments.get("m")).toEqual([range(0, null)]);
    expect(graph.segments.get("core-block-commit")).toEqual([range(0, null)]);
  });

  it("accepts a later revision of a module that cannot start mid-chain: it continues, it does not start (CF-5)", () => {
    // Q96: from genesis (S = 0); under 3.2's shipped A this ran at S = 1.
    const graph = resolveGraph(
      graphInput(
        [consumer("m", ["block-header"], { startsMidChain: false })],
        [entry("m", 0, 49), entry("m", 50, 79), entry("m", 80)],
        { start: 0n },
      ),
    );
    expect(graph.segments.get("m")).toEqual([range(0, null)]);
  });

  it("counts a start below S from S, where nothing below S runs", () => {
    // Q96: a start at S = 10 is a mid-chain start, so the module here can start mid-chain (the refusal is A23's table).
    const graph = resolveGraph(graphInput([consumer("m", ["block-header"])], [entry("m", 0)], { start: 10n }));
    expect(graph.segments.get("m")).toEqual([range(10, null)]);
    expect(graph.ranges.map((r) => r.range)).toEqual([range(10, null)]);
  });

  it("accepts a late module on a provider that has run all along (Q98, MD-4's scenario)", () => {
    // A database synced from 0 runs p, which cannot start mid-chain; m, which can, starts at 3,000,000.
    const late = (cursor: bigint | null, start: bigint, from: number) =>
      graphInput(
        [provider("p", ["prices"], { startsMidChain: false }), consumer("m", ["prices"])],
        [entry("p", from), entry("m", 3_000_000)],
        { start, cursor },
      );
    expect(outcome(late(2_999_999n, 0n, 0))).toBe("accepted");
    expect(outcome(late(null, 0n, 0))).toBe("accepted");
    // p since S = 1, its own start at or below the cursor; active at 2,999,999 all the same.
    expect(outcome(late(1n, 1n, 1))).toBe("accepted");
    expect(resolveGraph(late(2_999_999n, 0n, 0)).rangeAt(3_000_000n)?.providerOf.get("prices")).toBe("p");
  });

  it("asks the provider active at the module's start, not one that provided the item before it", () => {
    // slow (not mid-chain) provides prices from 0 to 19; p takes over at 20, where m starts. Q96: from genesis (S = 0),
    // where 3.2's shipped A had S = 1.
    const handoff = (startsMidChain: boolean) =>
      graphInput(
        [
          provider("p", ["prices"], { startsMidChain }),
          provider("slow", ["prices"], { startsMidChain: false }),
          consumer("m", ["prices"]),
        ],
        [entry("slow", 0, 19), entry("p", 20), entry("m", 20)],
        { start: 0n },
      );
    const graph = resolveGraph(handoff(true));
    expect(graph.rangeAt(19n)?.providerOf.get("prices")).toBe("slow");
    expect(graph.rangeAt(20n)?.providerOf.get("prices")).toBe("p");
    // p is not active at 19, so it must promise a mid-chain start (Q98).
    expect(refusal(() => resolveGraph(handoff(false))).details).toEqual({
      module: "m",
      start: 20n,
      range: range(20, null),
      item: "prices",
      provider: "p",
    });
  });

  it("asks a provider that ran before but not at the height before the start: after a gap it starts anew (Q98)", () => {
    const graph = (gap: boolean) =>
      graphInput(
        [provider("p", ["prices"], { startsMidChain: false }), consumer("m", ["prices"])],
        gap ? [entry("p", 0, 10), entry("p", 20), entry("m", 20)] : [entry("p", 0, 10), entry("p", 11), entry("m", 20)],
        { start: 0n },
      );
    expect(outcome(graph(false))).toBe("accepted");
    expect(refusal(() => resolveGraph(graph(true))).details).toEqual({
      module: "m",
      start: 20n,
      range: range(20, null),
      item: "prices",
      provider: "p",
    });
  });

  it("asks about the height just before the start, h − 1: neither an earlier height nor the start itself (Q98)", () => {
    const p = provider("p", ["prices"], { startsMidChain: false });
    // p started at the cursor, 19, judged by the build that ran it: active at 19, so m may start at 20.
    expect(outcome(graphInput([p, consumer("m", ["prices"])], [entry("p", 19), entry("m", 20)], { cursor: 19n }))).toBe(
      "accepted",
    );
    // p ran up to 18 and starts again at 20 with m: not active at 19, whatever it held at 18.
    const error = refusal(() =>
      resolveGraph(
        graphInput([p, consumer("m", ["prices"])], [entry("p", 0, 18), entry("p", 20), entry("m", 20)], { start: 0n }),
      ),
    );
    expect(error.details).toEqual({ module: "m", start: 20n, range: range(20, null), item: "prices", provider: "p" });
  });

  it("names a module and the provider starting with it together, whatever their ids (MD-4)", () => {
    // a-p's own start at 20 is refused too; the refusal naming both, the module and its provider, comes first.
    const error = refusal(() =>
      resolveGraph(
        graphInput(
          [provider("a-p", ["prices"], { startsMidChain: false }), consumer("m", ["prices"])],
          [entry("a-p", 20), entry("m", 20)],
        ),
      ),
    );
    expect(error.details).toEqual({ module: "m", start: 20n, range: range(20, null), item: "prices", provider: "a-p" });
    // Without m, a-p's own start is refused, naming it alone.
    expect(
      refusal(() => resolveGraph(graphInput([provider("a-p", ["prices"], { startsMidChain: false })], [entry("a-p", 20)])))
        .details,
    ).toEqual({ module: "a-p", start: 20n, range: range(20, null) });
  });
});

describe("A24: development-only modules need the development opt-in (MD-5)", () => {
  const dev = consumer("d", ["block-header"], { developmentOnly: true });

  it("accepts a development-only module with the opt-in", () => {
    const graph = resolveGraph(graphInput([dev], [entry("d", 1)], { developmentOptIn: true }));
    expect(ids(graph.modules)).toContain("d");
  });

  it("accepts a build that ships a development-only module it does not enable, without the opt-in", () => {
    const graph = resolveGraph(graphInput([dev, consumer("c", ["block-header"])], [entry("c", 1)]));
    expect(ids(graph.modules)).not.toContain("d");
  });

  it("accepts on a new database a development-only module whose entries all end below S: it never runs (Q97)", () => {
    const graph = resolveGraph(graphInput([dev], [entry("d", 1, 5)], { start: 10n }));
    expect(graph.segments.get("d")).toEqual([]);
    expect(outcome(graphInput([dev], [entry("d", 1, 10)], { start: 10n }))).toBe("development-opt-in-required");
  });
});

describe("A25: shared items have at most one active provider per height (MD-6)", () => {
  const input = () =>
    graphInput(
      [logsProvider("logs-full"), logsProvider("logs-fast"), consumer("reader", ["contract-logs"])],
      [entry("logs-full", 1, 99), entry("logs-fast", 100), entry("reader", 1)],
    );

  it("accepts two providers with adjacent ranges, the first stopping at 99 and the second starting at 100", () => {
    const graph = resolveGraph(input());
    expect(graph.ranges.map((r) => r.range)).toEqual([range(1, 99), range(100, null)]);
    expect(graph.rangeAt(99n)?.providerOf.get("contract-logs")).toBe("logs-full");
    expect(graph.rangeAt(100n)?.providerOf.get("contract-logs")).toBe("logs-fast");
    expect(ids(graph.rangeAt(99n)?.writeOrder ?? [])).toEqual([
      "core-chain",
      "core-block-fetch",
      "core-block-commit",
      "logs-full",
      "reader",
      "core-digest",
    ]);
    expect(ids(graph.rangeAt(100n)?.writeOrder ?? [])).toEqual([
      "core-chain",
      "core-block-fetch",
      "core-block-commit",
      "logs-fast",
      "reader",
      "core-digest",
    ]);
    // Both providers are modules of the database: their migrations are the item's, recorded once (DB-8).
    expect(ids(graph.modules)).toEqual([...BACKBONE_ORDER.slice(0, 3), "core-digest", "logs-fast", "logs-full", "reader"]);
  });

  it("accepts a handoff with a gap between the providers only when nothing requires the item in the gap", () => {
    expect(() =>
      resolveGraph(
        graphInput(
          [logsProvider("logs-full"), logsProvider("logs-fast"), consumer("reader", ["contract-logs"])],
          [entry("logs-full", 1, 99), entry("logs-fast", 110), entry("reader", 1, 99), entry("reader", 110)],
        ),
      ),
    ).not.toThrow();
  });
});

describe("RN-3: backbone first, then Kahn's algorithm by UTF-8 id, core-digest last at on-db-write", () => {
  // No requirement path among these six; their ids sort differently by UTF-8 bytes, by Czech collation ("ch" after
  // "h"), by numeric collation (m9 before m10) and by the order given.
  const UNRELATED = ["d-mod", "ch-mod", "m9", "m10", "b-mod", "a-mod"].map((id) => consumer(id, ["block-header"]));
  const USER = [consumer("a-consumer", ["z-out"]), consumer("zz-late", ["block-header"]), ...UNRELATED, provider("z-provider", ["z-out"])];
  const ENTRIES = USER.map((d) => entry(d.id, 1));
  const EXPECTED = [
    "core-chain",
    "core-block-fetch",
    "core-block-commit",
    "core-digest",
    "a-mod",
    "b-mod",
    "ch-mod",
    "d-mod",
    "m10",
    "m9",
    "z-provider",
    "a-consumer",
    "zz-late",
  ];

  /** The order each range gives at every point but on-db-write, and at on-db-write. */
  function orders(graph: ResolvedGraph): { order: string[]; writeOrder: string[] } {
    const [only] = graph.ranges;
    return { order: ids(only?.order ?? []), writeOrder: ids(only?.writeOrder ?? []) };
  }

  it("orders the backbone, then each ready module by the UTF-8 bytes of its id, providers before consumers", () => {
    const graph = resolveGraph(graphInput(USER, ENTRIES));
    expect(orders(graph).order).toEqual(EXPECTED);
    expect(orders(graph).writeOrder).toEqual([...EXPECTED.filter((id) => id !== "core-digest"), "core-digest"]);
    // The startup order is the same here: one range, every module active in it (Q95).
    expect(ids(graph.modules)).toEqual(EXPECTED);
  });

  it("keeps the backbone's fixed order whatever order the backbone parts are given in", () => {
    const graph = resolveGraph(graphInput(USER, ENTRIES, { backbone: [...BACKBONE].reverse() }));
    expect(orders(graph).order).toEqual(EXPECTED);
  });

  it("negative control: a tie-break by the order given, by Czech or by numeric collation gives another order", () => {
    const czech = (a: string, b: string) => a.localeCompare(b, "cs");
    const numeric = (a: string, b: string) => a.localeCompare(b, "en", { numeric: true });
    const given = () => 0;
    for (const compare of [czech, numeric, given]) {
      const graph = resolveWith(graphInput(USER, ENTRIES), GRAPH_RULES, compare);
      expect(orders(graph).order).not.toEqual(EXPECTED);
    }
    expect(czech("ch-mod", "d-mod")).toBeGreaterThan(0);
    expect(numeric("m9", "m10")).toBeLessThan(0);
  });

  it("compares ids by their UTF-8 bytes", () => {
    expect(utf8Order("ch-mod", "d-mod")).toBeLessThan(0);
    expect(utf8Order("m10", "m9")).toBeLessThan(0);
    expect(utf8Order("a-c", "ab")).toBeLessThan(0);
    expect(utf8Order("ab", "a-c")).toBeGreaterThan(0);
    expect(utf8Order("a", "a")).toBe(0);
    expect(utf8Order("a", "ab")).toBeLessThan(0);
    expect(utf8Order("é", "z")).toBeGreaterThan(0);
  });

  it("lists the backbone parts' fixed order, core-digest after the core and private processes' own (Q95)", () => {
    expect(BACKBONE_ORDER).toEqual([
      "core-chain",
      "core-block-fetch",
      "core-block-commit",
      "core-private-source",
      "core-digest",
      "core-health",
      "core-status",
      "core-config",
    ]);
  });
});

describe("the ranges: split at every start and stop + 1, closed, from S", () => {
  it("has one range from S with no end when no module has an entry", () => {
    const graph = resolveGraph(graphInput([], []));
    expect(graph.start).toBe(S);
    expect(graph.ranges.map((r) => r.range)).toEqual([range(1, null)]);
    expect(ids(graph.ranges[0]?.order ?? [])).toEqual(["core-chain", "core-block-fetch", "core-block-commit", "core-digest"]);
    expect(graph.ranges[0]?.providerOf.get("blocks")).toBe("core-block-commit");
    expect(graph.segments.get("core-chain")).toEqual([range(1, null)]);
  });

  it("splits at each start and after each stop, and finds the range holding a height", () => {
    const graph = resolveGraph(
      graphInput(
        [consumer("a", ["block-header"]), consumer("b", ["block-header"])],
        [entry("a", 10, 19), entry("b", 20, 29), entry("b", 30)],
      ),
    );
    expect(graph.ranges.map((r) => r.range)).toEqual([range(1, 9), range(10, 19), range(20, 29), range(30, null)]);
    expect(graph.rangeAt(0n)).toBeUndefined();
    expect(graph.rangeAt(1n)?.range).toEqual(range(1, 9));
    expect(graph.rangeAt(19n)?.range).toEqual(range(10, 19));
    expect(graph.rangeAt(20n)?.range).toEqual(range(20, 29));
    expect(graph.rangeAt(10_000_000n)?.range).toEqual(range(30, null));
    expect(ids(graph.rangeAt(15n)?.order ?? [])).toContain("a");
    expect(ids(graph.rangeAt(25n)?.order ?? [])).not.toContain("a");
    expect(graph.segments.get("b")).toEqual([range(20, null)]);
  });

  it("leaves out heights below S: a revision ending below S is active nowhere, one crossing S counts from S", () => {
    // Q96: m starts at S = 10, a mid-chain start, so it declares startsMidChain: true (under 3.2's A it did not).
    const graph = resolveGraph(
      graphInput(
        [consumer("gone", ["block-header"]), consumer("m", ["block-header"])],
        [entry("gone", 0, 5), entry("m", 0, 5), entry("m", 6, 11), entry("m", 12)],
        { start: 10n },
      ),
    );
    expect(graph.ranges.map((r) => r.range)).toEqual([range(10, 11), range(12, null)]);
    expect(graph.segments.get("gone")).toEqual([]);
    expect(graph.segments.get("m")).toEqual([range(10, null)]);
    expect(ids(graph.modules)).toContain("gone");
    expect(graph.ranges.every((r) => !ids(r.order).includes("gone"))).toBe(true);
  });

  it("gives the same ranges whatever order the entries are given in", () => {
    const modules = [consumer("a", ["block-header"]), consumer("b", ["block-header"])];
    const entries = [entry("a", 10, 19), entry("b", 20, 29), entry("b", 30), entry("a", 40)];
    const forward = resolveGraph(graphInput(modules, entries));
    const backward = resolveGraph(graphInput(modules, [...entries].reverse()));
    expect(backward.ranges.map((r) => r.range)).toEqual(forward.ranges.map((r) => r.range));
    expect(forward.ranges.map((r) => r.range)).toEqual([
      range(1, 9),
      range(10, 19),
      range(20, 29),
      range(30, 39),
      range(40, null),
    ]);
  });

  it("keeps a module whose every revision ended among the database's modules, active in no later range", () => {
    const graph = resolveGraph(graphInput([consumer("old", ["block-header"])], [entry("old", 1, 10)]));
    expect(ids(graph.modules)).toContain("old");
    expect(ids(graph.rangeAt(11n)?.order ?? [])).not.toContain("old");
  });

  it("freezes what it returns", () => {
    const graph = resolveGraph(graphInput([consumer("a", ["block-header"])], [entry("a", 1)]));
    expect(Object.isFrozen(graph)).toBe(true);
    expect(Object.isFrozen(graph.modules)).toBe(true);
    expect(Object.isFrozen(graph.ranges)).toBe(true);
    expect(Object.isFrozen(graph.ranges[0])).toBe(true);
    expect(Object.isFrozen(graph.ranges[0]?.order)).toBe(true);
    expect(Object.isFrozen(graph.ranges[0]?.range)).toBe(true);
  });
});

describe("the startup order: the backbone, then Kahn over every range's requirements (DB-9, Q95)", () => {
  it("puts each provider before its consumers whatever the range, keeps past modules, leaves out modules with no entry", () => {
    const graph = resolveGraph(
      graphInput(
        [
          consumer("a", ["x"]),
          provider("p2", ["x"]),
          provider("p1", ["x"]),
          consumer("old", ["block-header"]),
          consumer("unused", ["block-header"]),
        ],
        [entry("a", 1), entry("p1", 1, 49), entry("p2", 50), entry("old", 1, 10)],
      ),
    );
    expect(ids(graph.modules)).toEqual([
      "core-chain",
      "core-block-fetch",
      "core-block-commit",
      "core-digest",
      "old",
      "p1",
      "p2",
      "a",
    ]);
  });

  it("orders core modules and user modules together, by the graph and then by id", () => {
    const graph = resolveGraph(
      graphInput([consumer("b-user", ["chain-events"])], [entry("b-user", 1), entry("core-chain-events", 1)], {
        core: [provider("core-chain-events", ["chain-events"])],
      }),
    );
    expect(ids(graph.modules).slice(4)).toEqual(["core-chain-events", "b-user"]);
  });

  it("gives the same declaration objects it was given", () => {
    const user = consumer("a", ["block-header"]);
    const input = graphInput([user], [entry("a", 1)]);
    const graph = resolveGraph(input);
    expect(graph.modules.at(-1)).toBe(input.declarations.user[0]);
    expect(graph.modules[0]).toBe(input.declarations.backbone[0]);
  });
});

describe("the db and config name gap: own parts' items share the schema plan's namespace (DB-8)", () => {
  for (const [id, own] of [
    ["db", "core-chain"],
    ["config", "core-chain"],
    ["node-client", "core-chain"],
    ["chain-identity", "core-chain"],
    ["digest-tables", "core-digest"],
  ] as const) {
    it(`refuses a user module named ${id}, the name of an item ${own} provides, with schema-collision`, () => {
      const graph = resolveGraph(graphInput([consumer(id, ["block-header"])], [entry(id, 1)]));
      const error = refusal(() => schemaPlan(graph.modules));
      expect(error.code).toBe("schema-collision");
      const schema = id.replace(/-/g, "_");
      expect(error.details).toEqual({ schema, first: `module ${id}`, second: `item ${id} (provided by ${own})` });
      expect(error.message).toContain(`module ${id}`);
      expect(error.message).toContain(`item ${id} (provided by ${own})`);
    });
  }

  it("names each provider of a module's item once when the item's name collides", () => {
    const graph = resolveGraph(
      graphInput(
        [consumer("token-index", ["block-header"]), provider("indexer", ["token-index"])],
        [entry("token-index", 1), entry("indexer", 1)],
      ),
    );
    const error = refusal(() => schemaPlan(graph.modules));
    expect(error.details).toEqual({
      schema: "token_index",
      first: "module token-index",
      second: "item token-index (provided by indexer)",
    });
  });

  it("plans every module of the database but UmbraDB's own parts, and only those", () => {
    const graph = resolveGraph(
      graphInput(
        [consumer("old", ["block-header"]), consumer("live", ["block-header"]), consumer("unused", ["block-header"])],
        [entry("old", 1, 10), entry("live", 1)],
      ),
    );
    expect(schemaPlan(graph.modules).schemas.map((schema) => schema.name)).toEqual([
      "core_block_fetch",
      "core_block_commit",
      "live",
      "old",
    ]);
  });
});

describe("what the resolution takes as given: the caller's errors are thrown, not refused", () => {
  const thrown = (input: GraphInput): Error => {
    try {
      resolveGraph(input);
    } catch (error) {
      expect(error).not.toBeInstanceOf(UmbraError);
      return error as Error;
    }
    return expect.unreachable("expected an error");
  };

  it("throws for an entry of a module the build does not have, of a backbone part, or of the core", () => {
    expect(thrown(graphInput([], [entry("ghost", 1)])).message).toMatch(/an entry for ghost\b/);
    expect(thrown(graphInput([], [entry("core-block-commit", 1)])).message).toMatch(/an entry for core-block-commit\b/);
    expect(thrown(graphInput([], [entry("core", 1)])).message).toMatch(/an entry for core\b/);
  });

  it("throws for revisions of one module that overlap, or a stop below its start", () => {
    const m = consumer("m", ["block-header"]);
    expect(thrown(graphInput([m], [entry("m", 1, 50), entry("m", 50)])).message).toMatch(/revisions of m overlap/);
    expect(thrown(graphInput([m], [entry("m", 20), entry("m", 1, 30)])).message).toMatch(/revisions of m overlap/);
    expect(thrown(graphInput([m], [entry("m", 10, 9)])).message).toMatch(/revision of m stops at 9, before its start 10/);
    // Two revisions with one start: an entry is identified by (id, start) (CF-5).
    expect(thrown(graphInput([m], [entry("m", 5, 9), entry("m", 5)])).message).toMatch(/revisions of m overlap/);
    // Given out of order, revisions that do not overlap are accepted: they are sorted by start.
    expect(() => resolveGraph(graphInput([m], [entry("m", 20), entry("m", 1, 19)]))).not.toThrow();
  });

  it("throws for a cursor below S, or one that is neither a height nor null", () => {
    // The first commit is at S, so the cursor (the last committed height) is null or at least S.
    expect(thrown(graphInput([], [], { start: 10n, cursor: 9n })).message).toMatch(/the cursor 9 is below S \(10\)/);
    const unset = { ...graphInput([], []), cursor: undefined as unknown as null };
    expect(thrown(unset).message).toMatch(/the cursor undefined is neither null .* nor a height/);
    expect(outcome(graphInput([], [], { start: 10n, cursor: 10n }))).toBe("accepted");
  });

  it("throws for a backbone part it has no place for, and for one requiring a module's item", () => {
    const stranger = declaration("core-stranger", { requires: [], provides: [], migrations: [] });
    expect(thrown(graphInput([], [], { backbone: [...BACKBONE, stranger] })).message).toMatch(/core-stranger/);
    const needy = declaration("core-block-commit", { ...CORE_BLOCK_COMMIT, requires: ["block-header", "prices"] });
    expect(
      thrown(graphInput([PRICES], [entry("p", 1)], { backbone: [CORE_CHAIN, ...BACKBONE.slice(1, 2), needy, CORE_DIGEST] }))
        .message,
    ).toMatch(/backbone part core-block-commit requires the item prices, which p provides/);
    // A backbone part requiring the item of a backbone part after it in the fixed order (no cycle: core-health
    // requires nothing).
    const health = declaration("core-health", { requires: [], provides: [blockItem("health-check")], migrations: [] });
    const early = declaration("core-block-commit", { ...CORE_BLOCK_COMMIT, requires: ["block-header", "health-check"] });
    expect(
      thrown(graphInput([], [], { backbone: [CORE_CHAIN, BACKBONE[1] as ModuleDeclaration, early, CORE_DIGEST, health] }))
        .message,
    ).toMatch(/backbone part core-block-commit requires the item health-check, which core-health provides/);
  });
});
