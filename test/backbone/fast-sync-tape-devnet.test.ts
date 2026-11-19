import { describe, expect } from "vitest";
import { coreBlockCommit } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_CONTRACT_STATES } from "../../src/backbone/core-contract-states/core-contract-states.js";
import { coreLedgerState } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { type FoundTape, tapeTest } from "../tape/real/real-tapes.js";
import { equalityWatcher, hashDifferences, hashed, type Hashed } from "./fast-sync-equality.js";
import { committed, ingest } from "./ingest-harness.js";
import { cappedAt, devnetSettings } from "./ledger-restart.js";

/**
 * Fast-sync mode on the recorded devnet tape (`devnet-v8-v9-0-235`, `UMBRADB_TAPES`; skipped by name without it), on
 * PostgreSQL 18 and PGlite 0.5.10: the whole tape replayed from genesis through the process, with the ledger's core
 * modules and `core-contract-states`, in chunks of 100 and with the mode off. `core-ledger-state` checks every state
 * root against the node's (a difference halts with `root-mismatch`), and with `core-block-commit` checks what it keeps
 * against the database; every table of every schema is hashed at every height inside the transaction and at every
 * committed height (`./fast-sync-equality.ts`), and the two runs agree throughout. The v8 → v9 conversion (F = 103)
 * falls inside the chunk 100..199, which ends before it.
 */

/** Replays `found` on `backend` with the mode off or chunks of `blocks`; the cursor reached and the hashes. */
async function replay(found: FoundTape, backend: ProcessBackend, blocks: number | null): Promise<{ readonly cursor: bigint | null; readonly seen: Hashed }> {
  const last = BigInt(found.tape.to);
  const seen = hashed();
  const db = await backend.database();
  const process = await ingest(db, cappedAt(found.read().records, last), {
    start: 0n,
    stop: last,
    core: [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, coreLedgerState({ checkKept: true }), CORE_CONTRACT_STATES],
    commit: coreBlockCommit({ checkKept: true }),
    user: [equalityWatcher(seen)],
    settings: { ...devnetSettings(found), ...(blocks === null ? {} : { fastSync: { blocks, distance: 0 } }) },
    ledgerWorker: () => startLedgerWorker(),
  });
  try {
    await committed(process, last, 1_800_000);
    return { cursor: process.handle.status().cursor, seen };
  } finally {
    await process.close();
  }
}

describe("fast-sync mode on devnet-v8-v9-0-235 (UMBRADB_TAPES)", () => {
  for (const backend of PROCESS_BACKENDS as readonly ProcessBackend[]) {
    tapeTest(
      "devnet-v8-v9-0-235",
      `on ${backend.name}: chunks of 100 store what the mode off stores at every height, every state root the node's`,
      async (found) => {
        await backend.start();
        try {
          const off = await replay(found, backend, null);
          const on = await replay(found, backend, 100);
          const last = BigInt(found.tape.to);
          expect(off.cursor).toBe(last);
          expect(on.cursor).toBe(last);
          expect(on.seen.inside.size).toBe(Number(last));
          expect(hashDifferences(on.seen.inside, off.seen.inside)).toEqual([]);
          expect(hashDifferences(on.seen.committed, off.seen.committed)).toEqual([]);
        } finally {
          await backend.stop();
        }
      },
      { timeoutMs: 3_600_000 },
    );
  }
});
