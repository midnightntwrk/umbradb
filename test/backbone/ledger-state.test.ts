import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_LEDGER_STATE } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import { openConfiguredDatabase } from "../../src/config/database.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { type FoundTape, tapeTest } from "../tape/real/real-tapes.js";
import {
  callTransaction,
  cellValue,
  contractFixture,
  FAILING_PROGRAM,
  logProgram,
  NETWORK_ID,
  RAW,
  GLOBAL_TTL_MS,
  systemTransaction,
  T0,
  wrappedLog,
  zswapOutputTransaction,
} from "../ledger/adapter-fixtures.js";
import { outsideIn8 } from "../node/in8.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { a92Problems, a93Problems } from "./chain-data-checks.js";
import { hex } from "./fetch-fixtures.js";
import { committed, halted, type Ingest, ingest, PATIENCE_MS } from "./ingest-harness.js";
import {
  a99Problems,
  a106Problems,
  a107Problems,
  blockZeroProblems,
  ledgerItemsSeen,
  ledgerItemsWatcher,
  nodeProblems,
} from "./ledger-checks.js";
import {
  distributeReserve,
  type LedgerScenario,
  ledgerScenario,
  type LedgerTx,
  recordedGenesis,
  RUNTIME_1_0,
} from "./ledger-tapes.js";
import { cappedAt, hashAt, recordingLoads, restartAt, type SeenLoad } from "./ledger-restart.js";

/**
 * `core-ledger-state` through the real process, on PostgreSQL 18 and PGlite 0.5.10. The setup:
 * - `startProcess` with UmbraDB's backbone over the node source;
 * - the core modules `core-chain-events`, `core-block-parsed`, `core-tx-results` and `core-ledger-state`, enabled from
 *   genesis, with the ledger in its worker thread;
 * - a tape node serving the synthetic tapes of `./ledger-tapes.ts` (real ledger transactions, and the real recorded
 *   genesis states with their nodes' roots).
 * [A82, A99, A106, A107; IN-7, LG-8, LG-10, LG-11, LG-15, LG-16]
 *
 * What is checked:
 * - Block 0 in both cases. A genesis state whose root is the node's at block 0: its transactions run on an empty state
 *   for their results only, and the genesis state becomes the state. One whose root is not: they apply to it. In both,
 *   the transactions are numbered in body order and the root after block 0 is the node's. The real genesis states of
 *   mainnet, preview and an undeployed devnet are checked against their recorded roots. [A82, IN-7]
 * - Every height's root is checked against the node's on a range from genesis. Here the range is synthetic; the
 *   recorded ranges from genesis are below, skipped by name while their tapes are absent. [A99, LG-8, LG-15, Q133 C]
 * - A package whose root is wrong at one height halts there with `root-mismatch`, and nothing of that block is stored.
 *   [A106, LG-15]
 * - The rows of `states`, `segment_results` and `events`; a start above S without a backup fails with
 *   `cannot-start-mid-chain`. [A107, LG-16]
 */

/** The test packages' loader (`test/ledger/fixtures/ledger-test-loader.ts`), which the worker imports. */
const LOADER = new URL("../ledger/fixtures/ledger-test-loader.ts", import.meta.url);

const LEDGER_CORE: readonly ModuleDeclaration[] = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, CORE_LEDGER_STATE];

/** Every call the tape node received is one the ingest may make, and none went unanswered. [IN-8, A83] */
function in8Problems(run: Ingest): string[] {
  const calls = run.node.calls as readonly { readonly method: unknown; readonly outcome?: unknown }[];
  const outside = outsideIn8(calls.map((call) => call.method as string));
  const unanswered = calls.filter((call) => call.outcome === "not-on-tape" || call.outcome === "invalid-request");
  return [...outside.map((m) => `called ${m}`), ...unanswered.map((c) => `${String(c.method)}: ${String(c.outcome)}`)];
}

/** Runs `scenario` from genesis with the ledger's core modules (and `user`), to its head unless it is to halt. */
async function run(
  db: ProcessDatabase,
  scenario: LedgerScenario,
  options: { user?: readonly ModuleDeclaration[]; ledgerWorker?: () => LedgerHost; beforeClose?: () => Promise<void> } = {},
) {
  const process = await ingest(db, scenario.records, {
    start: 0n,
    core: LEDGER_CORE,
    user: options.user ?? [],
    ...(options.ledgerWorker === undefined ? {} : { ledgerWorker: options.ledgerWorker }),
  });
  let status;
  try {
    await committed(process, scenario.head);
    status = process.handle.status();
    await options.beforeClose?.();
  } finally {
    await process.close();
  }
  expect(in8Problems(process)).toEqual([]);
  return { ...process, status };
}

/** The blocks of the range scenario: block 0's transactions in body order, then deploys, calls, partial successes, … */
async function rangeBlocks(): Promise<LedgerTx[][]> {
  const contract = await contractFixture(RAW.v9);
  const logged = [cellValue(Uint8Array.of(9)), wrappedLog(1, 5, cellValue(Uint8Array.of(4, 5)))];
  return [
    [
      { bytes: systemTransaction("v9"), kind: "system" },
      { bytes: zswapOutputTransaction(RAW.v9), kind: "regular" },
    ],
    [
      { bytes: contract.deploy, kind: "regular" },
      { bytes: zswapOutputTransaction(RAW.v9), kind: "regular" },
    ],
    [
      { bytes: callTransaction(RAW.v9, contract, logProgram(logged)), kind: "regular" },
      { bytes: callTransaction(RAW.v9, contract, logProgram([cellValue(Uint8Array.of(3))]), FAILING_PROGRAM), kind: "regular", outcome: "partial" },
      { bytes: distributeReserve("v9", 500_000_000_000_000n), kind: "system" },
    ],
    [],
    [
      // A transaction the ledger would apply, failed by the chain's outcome: skipped, as the node did.
      { bytes: zswapOutputTransaction(RAW.v9), kind: "regular", outcome: "failure" },
      // One the ledger refuses (its intent's TTL is beyond the block time + global_ttl): a failure, the state unchanged.
      { bytes: (await contractFixture(RAW.v9, T0 + 2 * GLOBAL_TTL_MS)).deploy, kind: "regular" },
      { bytes: zswapOutputTransaction(RAW.v9), kind: "regular" },
    ],
  ];
}

describe.each(PROCESS_BACKENDS)("core-ledger-state through the process on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A82: block 0 whose genesis state includes its transactions: their results from an empty state, the genesis state after it, in body order", async () => {
    const devnet = recordedGenesis("genesis_state_undeployed.mn");
    const scenario = await ledgerScenario({
      ledger: "v9",
      genesis: devnet.state,
      includesBlockZero: true,
      blocks: [
        [
          { bytes: systemTransaction("v9"), kind: "system" },
          { bytes: zswapOutputTransaction(RAW.v9), kind: "regular" },
          { bytes: (await contractFixture(RAW.v9)).deploy, kind: "regular" },
        ],
        [{ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" }],
      ],
    });
    // The node's root at block 0 is the one recorded from the undeployed devnet's node.
    expect(hex(scenario.heights[0]?.root as Uint8Array)).toBe(hex(devnet.root));
    const db = await backend.database();
    const seen = ledgerItemsSeen();
    await run(db, scenario, { user: [ledgerItemsWatcher(seen)] });
    expect(await blockZeroProblems(db, scenario)).toEqual([]);
    expect(await a107Problems(db, scenario)).toEqual([]);
    expect(await nodeProblems(db)).toEqual([]);
    expect(scenario.heights[0]?.output.results.map((r) => r.outcome)).toEqual(["success", "success", "success"]);
    expect(seen.state.get(0n)).toMatchObject({ ledger: "v9", height: 0n, stateRoot: devnet.root, zswapFirstFree: 28n });
    expect(seen.segments.get(0n)).toEqual(scenario.heights[0]?.output.results);
  }, PATIENCE_MS * 2);

  it("A82: the real genesis states of mainnet and preview (v8): the state after block 0 has the node's root", async () => {
    for (const file of ["genesis_state_mainnet.mn", "genesis_state_preview.mn"]) {
      const genesis = recordedGenesis(file);
      const scenario = await ledgerScenario({
        ledger: "v8",
        runtime: RUNTIME_1_0,
        genesis: genesis.state,
        includesBlockZero: true,
        blocks: [[{ bytes: systemTransaction("v8"), kind: "system" }], []],
      });
      expect(hex(scenario.heights[0]?.root as Uint8Array), file).toBe(hex(genesis.root));
      const db = await backend.database();
      await run(db, scenario);
      expect(await blockZeroProblems(db, scenario), file).toEqual([]);
      expect(await a107Problems(db, scenario), file).toEqual([]);
    }
  }, PATIENCE_MS * 3);

  it("A82: block 0 whose genesis state does not include its transactions: they are applied to it", async () => {
    const devnet = recordedGenesis("genesis_state_undeployed.mn");
    const scenario = await ledgerScenario({
      ledger: "v9",
      genesis: devnet.state,
      includesBlockZero: false,
      blocks: [
        [
          { bytes: zswapOutputTransaction(RAW.v9), kind: "regular" },
          { bytes: systemTransaction("v9"), kind: "system" },
        ],
        [],
      ],
    });
    expect(hex(scenario.heights[0]?.root as Uint8Array)).not.toBe(hex(devnet.root));
    const db = await backend.database();
    await run(db, scenario);
    expect(await blockZeroProblems(db, scenario)).toEqual([]);
    expect(await a107Problems(db, scenario)).toEqual([]);
    expect(await nodeProblems(db)).toEqual([]);
  }, PATIENCE_MS * 2);

  it("A99 and A107: a range from genesis, every root the node's; states, segment results and events as LG-16 says", async () => {
    const scenario = await ledgerScenario({
      ledger: "v9",
      genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
      includesBlockZero: false,
      blocks: await rangeBlocks(),
    });
    const db = await backend.database();
    const seen = ledgerItemsSeen();
    // The worker counts its package's native parses: the parse of core-block-parsed and the apply share them. [LG-7]
    let worker: LedgerHost | undefined;
    let deserialized: Uint8Array[] = [];
    const process = await run(db, scenario, {
      user: [ledgerItemsWatcher(seen)],
      ledgerWorker: () => (worker = startLedgerWorker({ loader: LOADER, loaderData: { count: true } })),
      beforeClose: async () => {
        ({ deserialized } = (await worker?.probe()) as { deserialized: Uint8Array[] });
      },
    });
    expect(await a99Problems(db, process.status, scenario)).toEqual([]);
    expect(await a107Problems(db, scenario)).toEqual([]);
    expect(await nodeProblems(db)).toEqual([]);
    expect(await a92Problems(db, scenario as never, deserialized)).toEqual([]);
    expect(await a93Problems(db, scenario as never)).toEqual([]);
    // The block items: the partial success's segments, the logs of applied segments numbered in the block. [LG-16]
    expect(seen.segments.get(2n)?.[1]).toEqual({ outcome: "partial", segments: [{ segment: 0, success: true }, { segment: 1, success: false }] });
    expect(seen.logs.get(2n)?.map((log) => [log.transaction, log.index, log.eventType])).toEqual(
      scenario.heights[2]?.output.logs.map((log) => [log.transaction, log.index, log.eventType]),
    );
    expect(seen.logs.get(2n)?.length).toBeGreaterThan(0);
    expect(seen.events.get(1n)?.map((e) => e.kind)).toEqual(scenario.heights[1]?.output.events.map((e) => e.kind));
    expect(seen.events.get(1n)?.some((e) => e.kind === "contract-deploy")).toBe(true);
    expect(seen.state.get(4n)).toMatchObject({ height: 4n, stateRoot: scenario.heights[4]?.root, stateKey: scenario.heights[4]?.stateKey });
    expect(scenario.heights[4]?.output.results.map((r) => r.outcome)).toEqual(["failure", "failure", "success"]);
    // Block 3 holds no transaction and still has its state, root and row (the post-block update changes it).
    expect(seen.segments.get(3n)).toEqual([]);
  }, PATIENCE_MS * 2);

  it("A107: core-ledger-state enabled above S, with no backup restored, refuses with cannot-start-mid-chain", async () => {
    const scenario = await ledgerScenario({
      ledger: "v9",
      genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
      includesBlockZero: false,
      blocks: [[], [], [], []],
    });
    const db = await backend.database();
    const process = await ingest(db, scenario.records, {
      start: 0n,
      core: LEDGER_CORE,
      startOf: (id) => (id === "core-ledger-state" ? 2 : 0),
    });
    try {
      const refusal = await process.handle.started.catch((error: unknown) => error);
      expect(refusal).toMatchObject({ code: "cannot-start-mid-chain", details: { module: "core-ledger-state", start: 2n } });
      expect(process.handle.status()).toMatchObject({ state: "refused", reason: { code: "cannot-start-mid-chain" } });
    } finally {
      await process.close();
    }
  }, PATIENCE_MS);

  it("LG-11: the state at the cursor loads from the database alone, in a fresh worker, through the node-store bridge", async () => {
    const scenario = await ledgerScenario({
      ledger: "v9",
      genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
      includesBlockZero: false,
      blocks: (await rangeBlocks()).slice(0, 3),
    });
    const db = await backend.database();
    await run(db, scenario);
    const last = scenario.heights.at(-1)!;
    const database = await openConfiguredDatabase(
      { settings: { database: db.setting, developmentOptIn: true } } as never,
      { committedHeight: async () => null },
    );
    const host = startLedgerWorker();
    try {
      const block = scenario.chain[Number(last.height)]!;
      const loaded = await database.read((read) => host.load({ ledger: "v9", height: last.height, hash: block.hash, stateKey: last.stateKey }, read));
      expect(hex(loaded.stateRoot)).toBe(hex(last.root));
      expect(host.bridge().requests).toBeGreaterThan(0);
    } finally {
      await host.close();
      await database.close();
    }
  }, PATIENCE_MS);
});

describe("A106: the root check (LG-15)", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  it("[[ledger.root-check-halts]] A106: a test package returning a wrong root for one block halts with root-mismatch and stores nothing of that block, on PostgreSQL and on PGlite", async () => {
    const scenario = await ledgerScenario({
      ledger: "v9",
      genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
      includesBlockZero: false,
      blocks: (await rangeBlocks()).slice(0, 4),
    });
    for (const backend of PROCESS_BACKENDS) {
      const db = await backend.database();
      const process = await ingest(db, scenario.records, {
        start: 0n,
        core: LEDGER_CORE,
        ledgerWorker: () =>
          startLedgerWorker({ loader: LOADER, loaderData: { wrongRootAt: "2" } }),
      });
      let status;
      try {
        await halted(process);
        status = process.handle.status();
      } finally {
        await process.close();
      }
      expect(await a106Problems(db, status, 2n), backend.name).toEqual([]);
      expect(process.lines.some((line) => /processing halted \(root-mismatch\): .*height 2/.test(line)), backend.name).toBe(true);
      expect(await a107Problems(db, scenario, 1n), backend.name).toEqual([]);
    }
  }, PATIENCE_MS * 3);
});

describe("A99 on task 0.3's recorded ranges from genesis (owner decision Q133 C; each skipped by name without its tape)", () => {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;
  /** Six hours of replay: 10,000 heights on a loaded machine. */
  const REPLAY_MS = 6 * 3_600_000;

  /** The devnet's `core` settings: a custom network, its genesis from the manifest, its table v8 then v9. */
  const devnetSettings = (found: FoundTape): Readonly<Record<string, unknown>> => ({
    network: "custom",
    genesisHash: (found.tape.notes as { genesis: { hash: string } }).genesis.hash,
    ledgerTable: { rows: [{ specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" }, { specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" }] },
  });

  /** `records` with `chain_getFinalizedHead` answering block `to` (the recording day's head is past the range). */
  const capTo = (records: readonly TapeRecord[], to: bigint): TapeRecord[] => cappedAt(records, to);

  /** The tape's `midnight_ledgerStateRoot` answers, by block hash, as hex without `0x`. */
  const rootsOf = (records: readonly TapeRecord[]): Map<string, string> => {
    const roots = new Map<string, string>();
    for (const record of records) {
      if ("method" in record && record.method === "midnight_ledgerStateRoot" && "result" in record) {
        roots.set((record.params as string[])[0] as string, Buffer.from(record.result as number[]).toString("hex"));
      }
    }
    return roots;
  };

  /**
   * Replays `found` from genesis to `to` with the ledger's core modules on PGlite (its network's `core` settings, a
   * custom network's own), and holds every stored root to the node's answer on the tape. The tape's
   * `chain_getFinalizedHead` answers the recording day's head, far past the range (see the tape's notes), so the replay
   * caps the head at the range's end, and the core stops there.
   */
  async function replayRange(
    found: FoundTape,
    to: bigint,
    settings: Readonly<Record<string, unknown>>,
    halt?: { readonly height: bigint; readonly code: string },
    after?: (db: ProcessDatabase, hashAt: ReadonlyMap<string, string>) => Promise<void>,
  ): Promise<void> {
    const { records } = found.read();
    const hashAt = new Map<string, string>();
    const roots = new Map<string, string>();
    for (const record of records) {
      if (!("method" in record) || !("result" in record)) continue;
      if (record.method === "chain_getBlockHash") hashAt.set(String((record.params as unknown[])[0]), record.result as string);
      if (record.method === "midnight_ledgerStateRoot") {
        roots.set((record.params as string[])[0] as string, Buffer.from(record.result as number[]).toString("hex"));
      }
    }
    const end = hashAt.get(`${to}`);
    if (end === undefined) throw new Error(`the tape holds no block ${to}`);
    const capped = records.map((record) =>
      "method" in record && record.method === "chain_getFinalizedHead" && "result" in record ? { ...record, result: end } : record,
    );
    await backend.start();
    try {
      const db = await backend.database();
      const process = await ingest(db, capped, { start: 0n, stop: to, core: LEDGER_CORE, settings });
      let status;
      try {
        if (halt === undefined) await committed(process, to, REPLAY_MS);
        else await halted(process);
        status = process.handle.status();
      } finally {
        await process.close();
      }
      if (halt !== undefined) {
        expect(status).toMatchObject({ state: "halted", cursor: halt.height - 1n, reason: { code: halt.code, height: halt.height } });
        to = halt.height - 1n;
      } else expect(status).toMatchObject({ cursor: to, reason: null });
      const stored = await db.query("SELECT height::text AS h, encode(state_root, 'hex') AS root FROM core_ledger_state.states ORDER BY height");
      expect(stored).toHaveLength(Number(to) + 1);
      const differing = stored.filter((row) => roots.get(hashAt.get(row.h as string) as string) !== row.root);
      expect(differing.map((row) => row.h)).toEqual([]);
      // The six tree values `core-ledger-state` stores, at every stored height, none null. [A158, LG-16]
      const [trees] = await db.query(
        `SELECT count(*)::int AS n FROM core_ledger_state.states WHERE zswap_first_free IS NULL OR zswap_root IS NULL
           OR dust_commitment_first_free IS NULL OR dust_commitment_root IS NULL OR dust_generation_first_free IS NULL
           OR dust_generation_root IS NULL`,
      );
      expect(trees).toEqual({ n: 0 });
      await after?.(db, hashAt);
    } finally {
      await backend.stop();
    }
  }

  /**
   * The state stored at `height` (by the rc.3 package) loads in the rc.5 package with the stored root, the node's. A
   * fresh ledger worker reads it from the database through the node-store bridge, as F of a 2.0 → 2.1 upgrade does.
   * [A159]
   */
  async function expectLoadsInRc5(db: ProcessDatabase, hashAt: ReadonlyMap<string, string>, height: bigint): Promise<void> {
    const [row] = await db.query(
      `SELECT encode(s.state_key, 'hex') AS key, encode(s.state_root, 'hex') AS root, b.ledger_version AS ledger
         FROM core_ledger_state.states s JOIN core_block_commit.blocks b USING (height) WHERE s.height = ${height}`,
    );
    expect(row).toMatchObject({ ledger: "v9-rc3" });
    const database = await openConfiguredDatabase(
      { settings: { database: db.setting, developmentOptIn: true } } as never,
      { committedHeight: async () => null },
    );
    const host = startLedgerWorker();
    try {
      const hash = Uint8Array.from(Buffer.from((hashAt.get(`${height}`) as string).slice(2), "hex"));
      const stateKey = Uint8Array.from(Buffer.from(row!.key as string, "hex"));
      const loaded = await database.read((read) => host.load({ ledger: "v9", height, hash, stateKey }, read));
      expect(hex(loaded.stateRoot).slice(2)).toBe(row!.root);
      expect(loaded.loaded).toBe(true);
    } finally {
      await host.close();
      await database.close();
    }
  }

  for (const name of ["preview-0-10000", "preprod-0-10000"]) {
    tapeTest(
      name,
      `A99: every state root of ${name}, from genesis, is the node's`,
      async (found) => replayRange(found, BigInt(found.tape.to), { network: found.tape.network }),
      { timeoutMs: REPLAY_MS + 600_000 },
    );
  }

  // Stagenet runs runtime 2.0, whose node (2.0.0) builds ledger v9 from `crate-ledger-9.1.0.0-rc.3`. The built-in table
  // maps runtime 2.0 to that ledger's own package, `v9-rc3`, and every root is the node's. The state stored at the
  // range's end loads in the rc.5 package with the node's root, since a 2.0 → 2.1 upgrade carries it. [Q139 A, A159]
  tapeTest(
    "stagenet-0-10000",
    "A99 and A159: every state root of stagenet (runtime 2.0, its rc.3 package), from genesis, is the node's, and the state at its end loads in rc.5 with that root",
    async (found) =>
      replayRange(found, BigInt(found.tape.to), { network: found.tape.network }, undefined, (db, hashAt) =>
        expectLoadsInRc5(db, hashAt, BigInt(found.tape.to)),
      ),
    { timeoutMs: REPLAY_MS + 600_000 },
  );
  // The committed control: the old table, which mapped runtime 2.0 to rc.5, set here as a configured row. It halts at
  // block 1 with root-mismatch, and nothing of block 1 is stored. Block 1's one system transaction is a
  // `CNightGeneratesDustUpdate`, a DUST generation, whose rules changed between rc.3 and rc.5. [A99]
  tapeTest(
    "stagenet-0-10000",
    "A99's control: with the old table (runtime 2.0 → rc.5) stagenet's replay halts at block 1 with root-mismatch",
    async (found) =>
      replayRange(
        found,
        BigInt(found.tape.to),
        { network: found.tape.network, ledgerTable: { rows: [{ specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" }] } },
        { height: 1n, code: "root-mismatch" },
      ),
    { timeoutMs: 600_000 },
  );

  // The undeployed devnet from genesis up to its upgrade's enactment block U = 102 (v8 throughout).
  tapeTest(
    "devnet-v8-v9-0-235",
    "A99: every state root of the undeployed devnet from genesis to its upgrade's U (102), v8, is the node's",
    async (found) => replayRange(found, 102n, devnetSettings(found)),
    { timeoutMs: REPLAY_MS },
  );
  // From genesis to 235 across the upgrade: the v8 state at U (102) is converted to v9 before F (103) is applied. F
  // holds the node's three DUST reapply system transactions and no transaction of ours. [LG-9, A100]
  tapeTest(
    "devnet-v8-v9-0-235",
    "A99 and A100: every state root of the undeployed devnet from genesis to 235, across its v8 → v9 upgrade (F 103 converted), is the node's",
    async (found) => replayRange(found, 235n, devnetSettings(found)),
    { timeoutMs: REPLAY_MS },
  );

  // A restart on the recorded devnet. The process stops at 150, after the conversion, and starts again with the tape's
  // records for the restart (`./ledger-restart.ts`: the header and the metadata at 150). It loads the state at 150
  // from the database once, and every root to 235 is the node's. [A102, LG-11, Q135 A]
  tapeTest(
    "devnet-v8-v9-0-235",
    "A102: the undeployed devnet stopped at 150 and restarted loads the state at 150 from the database, and every root to 235 is the node's",
    async (found) => {
      const records = capTo(found.read().records, 235n);
      await backend.start();
      try {
        const db = await backend.database();
        const first = await ingest(db, cappedAt(records, 150n), { start: 0n, core: LEDGER_CORE, settings: devnetSettings(found) });
        try {
          await committed(first, 150n, REPLAY_MS);
        } finally {
          await first.close();
        }
        const loads: SeenLoad[] = [];
        const second = await ingest(db, restartAt(records, 150n), {
          start: 0n,
          core: LEDGER_CORE,
          settings: devnetSettings(found),
          ledgerWorker: () => recordingLoads(startLedgerWorker(), loads),
        });
        try {
          await committed(second, 235n, REPLAY_MS);
        } finally {
          await second.close();
        }
        expect(loads.filter((load) => load.loaded).map((load) => load.height)).toEqual([150n]);
        expect(hex(loads[0]?.stateRoot as Uint8Array).slice(2)).toBe(rootsOf(records).get(hashAt(records, 150n)));
        const stored = await db.query("SELECT height::text AS h, encode(state_root, 'hex') AS root FROM core_ledger_state.states ORDER BY height");
        expect(stored).toHaveLength(236);
        const roots = rootsOf(records);
        expect(stored.filter((row) => roots.get(hashAt(records, BigInt(row.h as string))) !== row.root).map((row) => row.h)).toEqual([]);
      } finally {
        await backend.stop();
      }
    },
    { timeoutMs: REPLAY_MS },
  );
});
