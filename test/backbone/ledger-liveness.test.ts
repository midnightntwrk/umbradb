import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type AdminServer, startAdminServer } from "../../src/admin/server.js";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_LEDGER_STATE } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import { inThreadLedger, type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { ENDPOINTS, type Hold, type ProbeRecord, startProber, timingProblems } from "../admin/admin-harness.js";
import { NETWORK_ID, RAW, zswapOutputTransaction } from "../ledger/adapter-fixtures.js";
import { loadLedger, probe, type TestLoaderData } from "../ledger/fixtures/ledger-test-loader.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { committed, ingest } from "./ingest-harness.js";
import { ledgerScenario } from "./ledger-tapes.js";

/**
 * While the ledger worker runs a 60 s ledger step, a prober thread times the process's admin endpoints. The step is a
 * test package whose apply of block 2 spends 60 s in a synchronous loop, in the worker thread
 * (`test/ledger/fixtures/ledger-test-loader.ts`). The endpoints are started with `admin` and a port of their own
 * (`127.0.0.1:0`). `/health/live` answers 200 throughout and every endpoint answers within 1 s. `livenessTimeoutMs` is
 * 5,000, so a main thread held for more than 5 s would show. [A101, LG-10, AE-2]
 *
 * Committed negative control: the same package on the main thread (`inThreadLedger`, ledger work moved off the worker)
 * holds the heartbeat for 60 s, and `/health/live` answers 503 within the step, so the check fails. Runs on PGlite: the
 * check is about the threads, not the stored data. [A101]
 */

const STEP_MS = 60_000;
const SLOW: TestLoaderData = { slowAt: { height: "2", ms: STEP_MS } };
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;

/** The expectation of each endpoint during the step: live, and the others answering as they may. [A101] */
const EXPECTED: Readonly<Record<string, readonly number[]>> = {
  "/health/live": [200],
  "/health/ready": [200, 503],
  "/status": [200],
  "/config": [200],
};

/** Runs a range of three blocks with `ledger` and the prober on the admin endpoints; resolves with what it timed. */
async function timed(ledger: () => LedgerHost, holdOf: () => Promise<Hold>): Promise<{ records: ProbeRecord[]; hold: Hold }> {
  const scenario = await ledgerScenario({
    ledger: "v9",
    genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: false,
    blocks: [[], [{ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" }], [{ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" }], []],
  });
  const db = await backend.database();
  let listening!: (server: AdminServer) => void;
  const server = new Promise<AdminServer>((resolve) => {
    listening = resolve;
  });
  const process = await ingest(db, scenario.records, {
    start: 0n,
    core: [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, CORE_LEDGER_STATE],
    settings: { listen: { admin: "127.0.0.1:0" }, livenessTimeoutMs: 5_000 },
    admin: async (start) => {
      const started = await startAdminServer(start);
      if (started.port < 10_000) throw new Error(`the admin listener listens on port ${started.port}, below 10000`);
      listening(started);
      return started;
    },
    ledgerWorker: ledger,
  });
  try {
    const { host, port } = await server;
    const prober = await startProber(`http://${host}:${port}`, ENDPOINTS);
    let records: ProbeRecord[];
    try {
      await committed(process, scenario.head, STEP_MS * 3);
    } finally {
      records = await prober.stop();
    }
    return { records, hold: await holdOf() };
  } finally {
    await process.close();
  }
}

const holdOfText = (hold: { start: string; end: string }): Hold => ({ start: BigInt(hold.start), end: BigInt(hold.end) });

describe("A101: a long ledger step runs in the worker, and the admin endpoints stay live (LG-10)", () => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A101: during a 60 s ledger step in the worker, /health/live answers 200 and every endpoint answers within 1 s", async () => {
    let worker: LedgerHost | undefined;
    const { records, hold } = await timed(
      () => (worker = startLedgerWorker({ loader: new URL("../ledger/fixtures/ledger-test-loader.ts", import.meta.url), loaderData: SLOW })),
      async () => holdOfText(((await worker?.probe()) as { hold: { start: string; end: string } }).hold),
    );
    expect(hold.end - hold.start).toBeGreaterThanOrEqual(BigInt(STEP_MS) * 1_000_000n);
    expect(timingProblems(records, hold, EXPECTED)).toEqual([]);
  }, STEP_MS * 4);

  it("negative control: the same step on the main thread fails A101 (/health/live answers 503 within it)", async () => {
    const { records, hold } = await timed(
      () => inThreadLedger({ load: (ledger, options) => loadLedger(ledger, options, SLOW) }),
      async () => holdOfText(probe().hold),
    );
    expect(hold.end - hold.start).toBeGreaterThanOrEqual(BigInt(STEP_MS) * 1_000_000n);
    const problems = timingProblems(records, hold, EXPECTED);
    expect(problems.some((problem) => /^\/health\/live: answered 503, not 200$/.test(problem))).toBe(true);
  }, STEP_MS * 4);
});
