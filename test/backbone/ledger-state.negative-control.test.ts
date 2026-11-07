import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_LEDGER_STATE, coreLedgerState } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { NETWORK_ID, RAW, systemTransaction, zswapOutputTransaction } from "../ledger/adapter-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { ingest, PATIENCE_MS, until } from "./ingest-harness.js";
import { a99Problems, a106Problems } from "./ledger-checks.js";
import { type LedgerScenario, ledgerScenario, recordedGenesis } from "./ledger-tapes.js";

/**
 * The committed negative controls of `core-ledger-state`. Each builds a `core-ledger-state` from the module's own parts
 * with one rule broken, and runs it through the process on PostgreSQL 18 and PGlite 0.5.10 on its criterion's
 * scenario. Each fails that criterion's oracle, while the real module passes it on the same scenario.
 * [A82, A99, A106; LG-15, IN-7]
 * - A root check that compares nothing lets the package with a wrong root through, so the root-mismatch oracle fails.
 *   [A106]
 * - A module that ignores the chain's outcomes replays a transaction the chain failed, so a range with one halts with
 *   `root-mismatch` and the every-root-checked oracle fails. [A99]
 * - Block 0 taken in the wrong case gives another root than the node's: applied to a genesis state that already holds
 *   it, or a genesis state taken as it is when it does not. That is a halt at 0, and the block-0 root check fails.
 *   [A82, IN-7]
 */

const LOADER = new URL("../ledger/fixtures/ledger-test-loader.ts", import.meta.url);
const core = (ledger: ModuleDeclaration): ModuleDeclaration[] => [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, ledger];

/** Runs `scenario` with `ledger` as `core-ledger-state`, until the head or a halt; returns the process. */
async function run(db: ProcessDatabase, scenario: LedgerScenario, ledger: ModuleDeclaration, ledgerWorker?: () => LedgerHost) {
  const process = await ingest(db, scenario.records, {
    start: 0n,
    core: core(ledger),
    ...(ledgerWorker === undefined ? {} : { ledgerWorker }),
  });
  let status;
  try {
    await until(process, () => process.handle.status().cursor === scenario.head || process.handle.status().state === "halted", "the head or a halt");
    status = process.handle.status();
  } finally {
    await process.close();
  }
  return { process, status };
}

describe.each(PROCESS_BACKENDS)("task 12.3's negative controls on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const blocks = () => [
    [{ bytes: systemTransaction("v9"), kind: "system" as const }],
    [{ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" as const }],
    [{ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" as const }],
    [{ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" as const }],
  ];

  it("A106's control: a root check that compares nothing lets a wrong root through, and A106's oracle fails", async () => {
    const scenario = await ledgerScenario({ ledger: "v9", genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(), includesBlockZero: false, blocks: blocks() });
    const wrong = () => startLedgerWorker({ loader: LOADER, loaderData: { wrongRootAt: "2" } });
    const realDb = await backend.database();
    const real = await run(realDb, scenario, CORE_LEDGER_STATE, wrong);
    expect(await a106Problems(realDb, real.status, 2n)).toEqual([]);
    const db = await backend.database();
    const control = await run(db, scenario, coreLedgerState({ rootMatches: () => true }), wrong);
    const problems = await a106Problems(db, control.status, 2n);
    expect(problems).toEqual(expect.arrayContaining(["the process is following, not halted", "the cursor is 3, not 1"]));
    expect(problems).toContain("core_ledger_state.states holds 2 rows at or above 2");
  }, PATIENCE_MS * 3);

  it("the outcomes' control: a module that ignores the chain's outcomes replays a failed transaction and halts with root-mismatch", async () => {
    const scenario = await ledgerScenario({
      ledger: "v9",
      genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
      includesBlockZero: false,
      blocks: [
        [],
        [{ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" }],
        // Failed by the chain (the v9 node fails an extrinsic over its block's limits, which only the outcome shows).
        [{ bytes: zswapOutputTransaction(RAW.v9), kind: "regular", outcome: "failure" }],
        [],
      ],
    });
    const realDb = await backend.database();
    const real = await run(realDb, scenario, CORE_LEDGER_STATE);
    expect(await a99Problems(realDb, real.status, scenario)).toEqual([]);
    const db = await backend.database();
    const control = await run(db, scenario, coreLedgerState({ outcomes: () => undefined }));
    const problems = await a99Problems(db, control.status, scenario);
    expect(problems[0]).toMatch(/^the process halted with .*"code":"root-mismatch","height":"2n"/);
    expect(problems).toContain("the cursor is 1, not 3");
  }, PATIENCE_MS * 3);

  it("A82's control: block 0 in the wrong case of IN-7 gives another root than the node's, a halt at 0", async () => {
    const devnet = recordedGenesis("genesis_state_undeployed.mn");
    const transactions = () => [
      [
        { bytes: systemTransaction("v9"), kind: "system" as const },
        { bytes: zswapOutputTransaction(RAW.v9), kind: "regular" as const },
      ],
      [],
    ];
    for (const includesBlockZero of [true, false]) {
      const scenario = await ledgerScenario({ ledger: "v9", genesis: devnet.state, includesBlockZero, blocks: transactions() });
      const realDb = await backend.database();
      const real = await run(realDb, scenario, CORE_LEDGER_STATE);
      expect(await a99Problems(realDb, real.status, scenario), `real, includes ${includesBlockZero}`).toEqual([]);
      const db = await backend.database();
      const control = await run(db, scenario, coreLedgerState({ includesBlockZero: () => !includesBlockZero }));
      const problems = await a99Problems(db, control.status, scenario);
      expect(problems[0], `control, includes ${includesBlockZero}`).toMatch(/^the process halted with .*"code":"root-mismatch","height":"0n"/);
      expect(problems).toContain("the cursor is null, not 1");
    }
  }, PATIENCE_MS * 4);
});
