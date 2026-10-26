import { afterAll, beforeAll, describe, expect, it, type MockInstance, vi } from "vitest";
import { readRuntimeMetadata } from "../../src/backbone/core-block-fetch/metadata.js";
import { CORE_BLOCK_PARSED, coreBlockParsedOnParse } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { inThreadParser, type TransactionParser } from "../../src/backbone/core-block-parsed/parser.js";
import { type ChainTransaction, placeTransactions } from "../../src/backbone/core-block-parsed/placement.js";
import { boundEventSource, CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { decodeChainEvents } from "../../src/backbone/core-chain-events/events.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { NodeClient } from "../../src/node/client.js";
import { RAW } from "../ledger/adapter-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { a91Problems, a92Problems, a93Problems, itemsSeen, itemsWatcher } from "./chain-data-checks.js";
import { a91UpgradeScenario, a92Scenario, a93Scenario, type Scenario, U } from "./chain-data-tapes.js";
import { committed, halted, ingest, PATIENCE_MS } from "./ingest-harness.js";

/**
 * The negative controls of task 11.1's criteria (A91–A93), each run through its criterion's own oracle
 * (`./chain-data-checks.ts`) on the scenario the criterion's test passes (`./chain-data.test.ts`), on PostgreSQL 18 and
 * PGlite 0.5.10, each a core module of the real build with one step done wrong:
 *
 * - A91: `core-chain-events` decoding a block's events with the metadata of the block's own state — at U the new
 *   runtime's, whose `CodeUpdated` has a hash the old one's has not — halts at U, where the real one stores them.
 * - A92: `core-block-parsed` parsing each transaction twice (a second parse of a copy, which the adapter cannot know
 *   for the same) is caught by the counted parses; one placing the regular transactions before the system ones (the
 *   body's order) by the stored order.
 * - A93: outcomes matched to the block's Midnight transactions by their place among the events rather than by their
 *   phase: a failed remark's `ExtrinsicFailed` becomes B's, and B's `TxPartialSuccess` C's.
 */

/** Decodes with the block's own state's metadata (`state_getMetadata` at its hash) instead of `runtime-metadata`. */
const OWN_STATE_EVENTS: ModuleDeclaration = {
  ...CORE_CHAIN_EVENTS,
  requires: [...CORE_CHAIN_EVENTS.requires, "node-client"],
  points: {
    ...CORE_CHAIN_EVENTS.points,
    async "on-fetch"(p, b, out) {
      const bytes = await boundEventSource(p).blockEvents(b);
      const own = await (p.items.get("node-client") as NodeClient).metadata(b.hash);
      out.put("chain-events", decodeChainEvents(readRuntimeMetadata(own), bytes, b.height));
    },
  },
};

/** `core-block-parsed` with its own placement or parser. */
function blockParsedWith(options: { readonly place?: typeof placeTransactions; readonly parser?: TransactionParser }): ModuleDeclaration {
  return {
    ...CORE_BLOCK_PARSED,
    points: {
      ...CORE_BLOCK_PARSED.points,
      async "on-parse"(_p, b, out) {
        await coreBlockParsedOnParse(b, out, options);
      },
    },
  };
}

/** Parses every transaction twice: a copy first (a new array, so the adapter parses it again), then the bytes. */
const ONCE = inThreadParser();
const TWICE: TransactionParser = {
  async parse(ledger, transactions) {
    await ONCE.parse(ledger, transactions.map((bytes) => bytes.slice()));
    return ONCE.parse(ledger, transactions);
  },
};

/** The regular transactions first, in body order, then the system ones. */
const bodyOrder: typeof placeTransactions = (height, body, events, metadata) => {
  const real = placeTransactions(height, body, events, metadata);
  return [...real.filter((t) => t.kind === "regular"), ...real.filter((t) => t.kind === "system")].map((t, index) => ({ ...t, index }));
};

/** Each regular transaction given the next outcome event in the block's event order, whatever its phase. */
const eventOrder: typeof placeTransactions = (height, body, events, metadata) => {
  const outcomes = events.filter(
    (e) => (e.pallet === "Midnight" && (e.name === "TxApplied" || e.name === "TxPartialSuccess")) || (e.pallet === "System" && e.name === "ExtrinsicFailed"),
  );
  let next = 0;
  return placeTransactions(height, body, events, metadata).map(
    (t): ChainTransaction => (t.kind === "regular" ? { ...t, eventIndex: (outcomes[next++] as { index: number }).index } : t),
  );
};

/** Counts the v9 package's native deserializations, with the bytes each was given. */
function countParses(): { deserialized: Uint8Array[]; restore(): void } {
  const deserialized: Uint8Array[] = [];
  const spies: MockInstance[] = [];
  for (const kind of ["Transaction", "SystemTransaction"] as const) {
    const target = RAW.v9[kind] as unknown as { deserialize(...args: unknown[]): unknown };
    const original = target.deserialize.bind(target);
    spies.push(
      vi.spyOn(target, "deserialize").mockImplementation((...args: unknown[]) => {
        deserialized.push(args.at(-1) as Uint8Array);
        return original(...args);
      }),
    );
  }
  return { deserialized, restore: () => spies.forEach((spy) => spy.mockRestore()) };
}

describe.each(PROCESS_BACKENDS)("chain data's negative controls on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  async function run(scenario: Scenario, core: readonly ModuleDeclaration[], until: "head" | "halt" = "head") {
    const db = await backend.database();
    const seen = itemsSeen();
    const items = core.some((part) => part.id === "core-tx-results") ? (["tx-results"] as const) : (["chain-events"] as const);
    const process = await ingest(db, scenario.records, { start: scenario.start, core, user: [itemsWatcher(seen, [...items])] });
    let status: ReturnType<typeof process.handle.status>;
    try {
      if (until === "halt") await halted(process);
      else await committed(process, scenario.head);
      status = process.handle.status();
    } finally {
      await process.close();
    }
    return { db, seen, process, status };
  }

  it("A91's control: events decoded with the block's own state's metadata fail at U, where A91 stores them", async () => {
    const scenario = a91UpgradeScenario();
    const { db, status } = await run(scenario, [OWN_STATE_EVENTS], "halt");
    expect(status).toMatchObject({
      state: "halted",
      cursor: U - 1n,
      reason: { code: "callback-error", height: U, module: "core-chain-events", point: "on-fetch" },
    });
    const problems = await a91Problems(db, scenario);
    expect(problems).toContain(`height ${U}: 0 events stored, 3 on the chain`);
    // Below U the block's own state holds the runtime that wrote its events, so those heights are right.
    expect(problems.filter((problem) => /^height [12][: ]/.test(problem))).toEqual([]);
  }, PATIENCE_MS * 2);

  it("A92's control: a parse counted twice fails A92", async () => {
    const scenario = a92Scenario();
    const counter = countParses();
    let deserialized: Uint8Array[];
    let db: Awaited<ReturnType<typeof run>>["db"];
    try {
      ({ db } = await run(scenario, [CORE_CHAIN_EVENTS, blockParsedWith({ parser: TWICE })]));
      deserialized = [...counter.deserialized];
    } finally {
      counter.restore();
    }
    expect(await a92Problems(db, scenario, deserialized)).toEqual(
      scenario.transactions.map((t) => `transaction ${t.index} of height ${t.height} was parsed 2 times, not once`),
    );
  }, PATIENCE_MS * 2);

  it("A92's control: regular transactions placed before the system one (body order) fail A92's order", async () => {
    const scenario = a92Scenario();
    const counter = countParses();
    let deserialized: Uint8Array[];
    let db: Awaited<ReturnType<typeof run>>["db"];
    try {
      ({ db } = await run(scenario, [CORE_CHAIN_EVENTS, blockParsedWith({ place: bodyOrder })]));
      deserialized = [...counter.deserialized];
    } finally {
      counter.restore();
    }
    const problems = await a92Problems(db, scenario, deserialized);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^core_block_parsed\.transactions holds .*"kind":"regular".*"tx_index":"1n".*, expected/);
  }, PATIENCE_MS * 2);

  it("A93's control: outcomes matched by event order instead of phase fail A93", async () => {
    const scenario = a93Scenario();
    const { db, seen } = await run(scenario, [CORE_CHAIN_EVENTS, blockParsedWith({ place: eventOrder }), CORE_TX_RESULTS]);
    expect(seen.results.get(1n)).toEqual(["success", "failure", "partial", "success"]);
    const problems = await a93Problems(db, scenario);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/"outcome":"failure","tx_index":"1n".*"outcome":"partial","tx_index":"2n".*, expected/);
  }, PATIENCE_MS * 2);
});
