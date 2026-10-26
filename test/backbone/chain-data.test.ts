import { afterAll, afterEach, beforeAll, describe, expect, it, type MockInstance, vi } from "vitest";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { canonicalJson } from "../../src/backbone/core-chain-events/scale-value.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { RAW } from "../ledger/adapter-fixtures.js";
import { outsideIn8 } from "../node/in8.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { a91Problems, a92Problems, a93Problems, itemsSeen, itemsWatcher } from "./chain-data-checks.js";
import {
  a91RangeScenario,
  a91UpgradeScenario,
  a92GenesisScenario,
  a92Scenario,
  a93Scenario,
  E,
  ledgerTransactions,
  type Scenario,
  transactionSpec,
  U,
} from "./chain-data-tapes.js";
import { eventsRead, eventsValue, finalizedWithEvents, RUNTIME_2_0 } from "./events-fixtures.js";
import { type ChainBlock, chainOf, content, finalizedHead, hex, ledgerTransaction, newHead, opening } from "./fetch-fixtures.js";
import { committed, ingest, PATIENCE_MS } from "./ingest-harness.js";

/**
 * Chain data through the real process (task 11.1; `openspec/changes/core-arch/acceptance.md` A91, A92, A93; CD-4 to
 * CD-6), on PostgreSQL 18 and PGlite 0.5.10: `startProcess` with UmbraDB's backbone over the node source — what
 * `umbradb run` passes — and the core modules `core-chain-events`, `core-block-parsed` and `core-tx-results` enabled from
 * S, against a tape node serving synthetic tapes in the node's answer shapes (`./chain-data-tapes.ts`; task 0.3's real
 * tapes replace them).
 *
 * - A91 (CD-4): every event of blocks 1–6 stored, byte for byte, with its phase, extrinsic index, pallet, name and
 *   fields; at a synthetic upgrade, U's events — the old runtime's, whose `CodeUpdated` the new runtime's metadata
 *   reads otherwise — decoded with the metadata of U's parent's state, F's with the new.
 * - A92 (CD-5): a system transaction between two regular ones stored 0, 1, 2 in that order; block 0's transactions in
 *   body order; each parsed once — the vendored v9 package's `Transaction.deserialize` and
 *   `SystemTransaction.deserialize` counted while the process runs (it runs in this test's process, with the same
 *   module instance).
 * - A93 (CD-6): `TxApplied`, `TxPartialSuccess` and `ExtrinsicFailed` (and `SystemTransactionApplied`) give
 *   `success`, `partial`, `failure` (and `success`), matched to their extrinsics by phase; the `tx-results` item is the
 *   form `ApplyInput.outcomes` takes (task 12.3).
 * Every call the tape node received is one of IN-8's (A83's check).
 */

const CORE = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS];

/** Counts the v9 package's native deserializations, with the bytes each was given (the last argument). */
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
  return {
    deserialized,
    restore: () => {
      for (const spy of spies) spy.mockRestore();
    },
  };
}

/** Every call the tape node received is one of IN-8's, and none went unanswered (A83). */
function in8Problems(calls: readonly { readonly method: unknown; readonly outcome?: unknown }[]): string[] {
  const outside = outsideIn8(calls.map((call) => call.method as string));
  const unanswered = calls.filter((call) => call.outcome === "not-on-tape" || call.outcome === "invalid-request");
  return [...outside.map((method) => `called ${method}`), ...unanswered.map((call) => `${String(call.method)}: ${String(call.outcome)}`)];
}

describe.each(PROCESS_BACKENDS)("chain data through the process on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  let counter: ReturnType<typeof countParses> | undefined;
  afterEach(() => counter?.restore());

  /** Runs `scenario` to its head with the core modules and the items watcher, and returns what it saw. */
  async function run(scenario: Scenario, items: Parameters<typeof itemsWatcher>[1] = ["chain-events", "block-parsed", "tx-results"]) {
    const db = await backend.database();
    const seen = itemsSeen();
    const process = await ingest(db, scenario.records, { start: scenario.start, core: CORE, user: [itemsWatcher(seen, items)] });
    try {
      await committed(process, scenario.head);
    } finally {
      await process.close();
    }
    expect(in8Problems(process.node.calls)).toEqual([]);
    return { db, seen, process };
  }

  it("A91: core-chain-events stores every event of a range, byte for byte, with its decoded fields", async () => {
    const scenario = a91RangeScenario();
    const { db, seen } = await run(scenario, ["chain-events"]);
    expect(await a91Problems(db, scenario)).toEqual([]);
    // The item is the events in their order, as the rows hold them.
    expect([...seen.events.keys()]).toEqual([1n, 2n, 3n, 4n, 5n, 6n]);
    expect(seen.events.get(5n)).toHaveLength(42);
    expect(seen.events.get(4n)).toEqual([]);
    expect(seen.events.get(1n)?.map((e) => `${e.phase} ${e.pallet}.${e.name}`)).toEqual([
      "initialization Session.NewSession",
      "apply-extrinsic System.ExtrinsicSuccess",
      "apply-extrinsic System.Remarked",
      "apply-extrinsic System.ExtrinsicSuccess",
      "finalization Grandpa.NewAuthorities",
    ]);
    // A u128 and a u64 above the signed 64-bit range are decimal text in the jsonb, so the determinism CHECK holds.
    const [payout] = await db.query(
      "SELECT fields ->> 'amount' AS amount, jsonb_typeof(fields -> 'amount') AS type FROM core_chain_events.events " +
        "WHERE height = 6 AND event_index = 0",
    );
    expect(payout?.type).toBe("string");
    expect(payout?.amount).toBe("1267650600228229401496703205376");
  }, PATIENCE_MS * 2);

  it("A91: at a runtime upgrade, U's events are decoded with the old runtime's metadata, F's with the new", async () => {
    const scenario = a91UpgradeScenario();
    const { db, seen } = await run(scenario, ["chain-events"]);
    expect(await a91Problems(db, scenario)).toEqual([]);
    expect(seen.events.get(U)?.map((e) => `${e.pallet}.${e.name} ${canonicalJson(e.fields)}`)).toEqual([
      expect.stringMatching(/^System\.ExtrinsicSuccess /),
      "System.CodeUpdated []",
      expect.stringMatching(/^System\.ExtrinsicSuccess /),
    ]);
    const [f] = await db.query("SELECT fields::text AS fields FROM core_chain_events.events WHERE height = 4 AND event_index = 0");
    expect(JSON.parse(f?.fields as string)).toEqual({ hash: hex(new Uint8Array(32).fill(0x77)) });
  }, PATIENCE_MS * 2);

  it("A91: the events' metadata is the runtime-metadata item's, read at each runtime's first block's parent only", async () => {
    const scenario = a91UpgradeScenario();
    const { process } = await run(scenario, ["chain-events"]);
    const reads = scenario.chain.map((block) => process.node.count("state_getMetadata", [block.hex]));
    // Block 0's state (the old runtime, for 1–3) and U's (the new one, for 4–5); no block's own state otherwise.
    expect(reads).toEqual([1, 0, 0, 1, 0, 0]);
  }, PATIENCE_MS * 2);

  it("A92: a system transaction between two regular ones is stored 0, 1, 2 in that order, each parsed once", async () => {
    const scenario = a92Scenario();
    counter = countParses();
    const { db, seen } = await run(scenario);
    const deserialized = [...counter.deserialized];
    counter.restore();
    expect(await a92Problems(db, scenario, deserialized)).toEqual([]);
    expect(deserialized).toHaveLength(3);
    const parsed = seen.parsed.get(1n);
    expect(parsed?.ledger).toBe("v9");
    expect(parsed?.transactions.map((t) => [t.index, t.kind, t.phase, t.extrinsicIndex, t.eventIndex])).toEqual([
      [0, "regular", "apply-extrinsic", 1, 1],
      [1, "system", "apply-extrinsic", 2, 3],
      [2, "regular", "apply-extrinsic", 3, 5],
    ]);
    // The very bytes the ledger parsed are the item's: nothing parses them again.
    expect(parsed?.transactions.map((t) => hex(t.bytes))).toEqual(scenario.transactions.map((t) => hex(t.bytes)));
    expect(seen.parsed.get(2n)?.transactions).toEqual([]);
    expect(await a93Problems(db, scenario)).toEqual([]);
  }, PATIENCE_MS * 2);

  it("A92: a best block queued with its transactions, then finalized with its hash, is not parsed again", async () => {
    const { regular: [r], system: [s] } = ledgerTransactions(1, 1) as { regular: [Uint8Array]; system: [Uint8Array] };
    const chain = chainOf(2n, (h) => ({ extrinsics: h === 2n ? [ledgerTransaction([...r])] : [] }));
    const block = (h: number) => chain[h] as ChainBlock;
    const events = eventsValue([E.success(0), E.txApplied(1, r), E.success(1), E.systemApplied("finalization", s)].map((e) => e.record));
    const records: TapeRecord[] = [
      ...opening(block(0), block(1)),
      ...finalizedWithEvents(block(1), RUNTIME_2_0, eventsValue([E.success(0).record]), true),
      // Following at the head 1: block 2 is announced, fetched, its metadata read (the best-block calls' own cache, no
      // retries), its events read and its transactions parsed — then finalized with that hash and taken as queued.
      newHead(block(2)),
      ...content(block(2), RUNTIME_2_0, true),
      eventsRead(block(2), events),
      finalizedHead(block(2)),
      { method: "chain_getBlockHash", params: [2], result: block(2).hex },
    ];
    const scenario = { start: 1n, head: 2n, records, transactions: [] } as unknown as Scenario;
    counter = countParses();
    const { db, seen, process } = await run(scenario);
    const deserialized = [...counter.deserialized];
    counter.restore();
    const expected = { transactions: [transactionSpec(2n, 0, "regular", r), transactionSpec(2n, 1, "system", s)] } as unknown as Scenario;
    expect(await a92Problems(db, expected, deserialized)).toEqual([]);
    expect(process.seen.queue).toEqual([`best 2 ${block(2).hex.slice(0, 10)}`]);
    expect(process.node.count("chain_getBlock", [block(2).hex])).toBe(1);
    expect(seen.results.get(2n)).toEqual(["success", "success"]);
  }, PATIENCE_MS * 2);

  it("A92: block 0's transactions are stored in body order, each parsed once", async () => {
    const scenario = a92GenesisScenario();
    counter = countParses();
    const { db, seen } = await run(scenario);
    const deserialized = [...counter.deserialized];
    counter.restore();
    expect(await a92Problems(db, scenario, deserialized)).toEqual([]);
    expect(seen.parsed.get(0n)?.transactions.map((t) => [t.index, t.kind, t.extrinsicIndex, t.eventIndex])).toEqual([
      [0, "system", 0, null],
      [1, "regular", 1, null],
      [2, "regular", 3, null],
    ]);
    // Block 0 has no events: every transaction applied, as the official indexer takes the genesis transactions.
    expect(seen.results.get(0n)).toEqual(["success", "success", "success"]);
    expect(await a93Problems(db, scenario)).toEqual([]);
    const [events] = await db.query("SELECT count(*)::text AS n FROM core_chain_events.events WHERE height = 0");
    expect(events?.n).toBe("0");
  }, PATIENCE_MS * 2);

  it("A93: TxApplied, TxPartialSuccess and ExtrinsicFailed give success, partial and failure, matched by phase", async () => {
    const scenario = a93Scenario();
    counter = countParses();
    const { db, seen } = await run(scenario);
    const deserialized = [...counter.deserialized];
    counter.restore();
    expect(await a93Problems(db, scenario)).toEqual([]);
    // A failed transaction is parsed too (block-parsed lists it; the ledger's apply skips it, task 12.1a).
    expect(await a92Problems(db, scenario, deserialized)).toEqual([]);
    // tx-results is ApplyInput.outcomes' form: one ChainOutcome per transaction, in block-parsed's order (task 12.3).
    expect(seen.results.get(1n)).toEqual(["success", "partial", "failure", "success"]);
    expect(Object.isFrozen(seen.results.get(1n))).toBe(true);
    expect(seen.parsed.get(1n)?.transactions.map((t) => t.kind)).toEqual(["regular", "regular", "regular", "system"]);
    expect(seen.results.get(2n)).toEqual([]);
  }, PATIENCE_MS * 2);
});
