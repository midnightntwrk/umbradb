import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { type CoreLedgerStateOptions, coreLedgerState } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { retainedFrom } from "../../src/backbone/core-ledger-state/retention.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { NETWORK_ID, RAW, zswapOutputTransaction } from "../ledger/adapter-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { ingest, PATIENCE_MS, until } from "./ingest-harness.js";
import { cappedAt, LEDGER_CORE, recordingLoads, restartAt, type SeenLoad } from "./ledger-restart.js";
import { a100Problems, a102Problems, loaded, retentionSeen, retentionWatcher } from "./ledger-storage-checks.js";
import { type LedgerScenario, ledgerScenario, type LedgerTx, RUNTIME_2_1 } from "./ledger-tapes.js";

/**
 * The committed negative controls of task 12.4 (`openspec/changes/core-arch/acceptance.md` A100, A102, A103), each the
 * real `core-ledger-state` with one rule replaced (`coreLedgerState`'s options), run through the process on the same
 * scenario as its criterion and held to the same oracle (`./ledger-storage-checks.ts`), which must fail:
 *
 * - A102: a restart that does not have the worker load the stored state at the cursor halts at the next block — the
 *   worker holds no state — so the next root is never the node's;
 * - A100: the conversion skipped — F applied with the state's own ledger, v8 — gives another root at F than the node's:
 *   `root-mismatch` at F;
 * - A103: a window that releases one state too early has the state at 4,000 released at cursor 5,000: its load fails.
 */

/** The ledger's core modules with `core-ledger-state`'s rules `options` replaced. */
const coreWith = (options: CoreLedgerStateOptions): readonly ModuleDeclaration[] => [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, coreLedgerState(options)];

/** The upgrade scenario of `ledger-storage.test.ts`: v8 to U = 3, F = 4 with no transaction, then v9 to 7. */
async function upgradeScenario(): Promise<LedgerScenario> {
  const v8 = (): LedgerTx => ({ bytes: zswapOutputTransaction(RAW.v8), kind: "regular" });
  const v9 = (): LedgerTx => ({ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" });
  return ledgerScenario({
    ledger: "v8",
    genesis: RAW.v8.LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: false,
    blocks: [[], [v8()], [], [v8()], [], [v9()], [], [v9()]],
    upgrade: { at: 4, runtime: RUNTIME_2_1 },
  });
}

/** Runs `records` until the process reaches `head` or halts; its status then, the process stopped. */
async function runUntil(db: ProcessDatabase, records: readonly TapeRecord[], head: bigint, options: Omit<Parameters<typeof ingest>[2], "start"> = {}) {
  const process = await ingest(db, records, { start: 0n, core: LEDGER_CORE, ...options });
  let status;
  try {
    await until(process, () => process.handle.status().cursor === head || process.handle.status().state === "halted", `the cursor at ${head} or a halt`, PATIENCE_MS * 4);
    status = process.handle.status();
  } finally {
    await process.close();
  }
  return { ...process, status };
}

describe.each(PROCESS_BACKENDS)("task 12.4's negative controls on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A102's control: a restart that does not load the state at the cursor never reaches the node's next root", async () => {
    const scenario = await upgradeScenario();
    const db = await backend.database();
    await runUntil(db, cappedAt(scenario.records, 3n), 3n);
    const loads: SeenLoad[] = [];
    const restarted = await runUntil(db, restartAt(scenario.records, 3n), scenario.head, {
      core: coreWith({ loadParent: false }),
      ledgerWorker: () => recordingLoads(startLedgerWorker(), loads),
    });
    expect(restarted.status).toMatchObject({ state: "halted", cursor: 3n, reason: { code: "callback-error", height: 4n, module: "core-ledger-state" } });
    const problems = await a102Problems(db, restarted.status, scenario, 3n, loads);
    expect(problems).toContain("the cursor is 3, not 7");
    expect(problems).toContain("the restarted process loaded no state");
  }, PATIENCE_MS * 4);

  it("A100's control: F applied without the conversion halts at F with root-mismatch", async () => {
    const scenario = await upgradeScenario();
    const db = await backend.database();
    const process = await runUntil(db, scenario.records, scenario.head, { core: coreWith({ ledgerOf: (_b, parent) => parent }) });
    expect(process.status).toMatchObject({ state: "halted", cursor: 3n, reason: { code: "root-mismatch", height: 4n } });
    const problems = await a100Problems(db, process.status, scenario, 4n);
    expect(problems.some((problem) => problem.startsWith("the process halted with") && problem.includes("root-mismatch"))).toBe(true);
    expect(problems).toContain("the cursor is 3, not 7");
  }, PATIENCE_MS * 4);
});

describe("A103's control (PGlite: 5,000 blocks once)", () => {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a window that releases one state too early fails A103's load of 4,000 at cursor 5,000", async () => {
    const scenario = await ledgerScenario({
      ledger: "v9",
      genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
      includesBlockZero: false,
      blocks: Array.from({ length: 5_002 }, () => []),
      rootsOnly: true,
    });
    const db = await backend.database();
    const seen = retentionSeen();
    const process = await runUntil(db, scenario.records, scenario.head, {
      settings: { retainStates: 1_000 },
      core: coreWith({ retainedFrom: (revisions, height) => retainedFrom(revisions, height) + 1n }),
      user: [retentionWatcher(seen, new Map([[5_001n, [4_000n, 4_001n]]]))],
    });
    expect(process.status).toMatchObject({ cursor: 5_001n, reason: null });
    // A103 holds the load of 4,000 to succeed: here it fails, and 4,001 is the oldest retained state.
    expect(seen.loads.get(5_001n)).toEqual(["4000 state-not-retained", loaded(scenario, 4_001n)]);
    expect(seen.loads.get(5_001n)?.[0]).not.toBe(loaded(scenario, 4_000n));
  }, PATIENCE_MS * 12);
});
