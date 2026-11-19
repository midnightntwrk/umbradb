import { describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import { type ApplyBlock, type BlockId, LedgerEngine } from "../../src/ledger/worker/engine.js";
import { hex, NETWORK_ID, RAW, T0 } from "./adapter-fixtures.js";

/**
 * The committed negative controls of `worker-engine.test.ts`'s two rules on a block the engine is asked to apply again
 * or after a failure, over the real v9 adapter, each with one rule of the engine turned off:
 * - `checkSameInput: false` (a pending block's result is given back only for the input it was applied from): block 2,
 *   applied ahead with one contract named, is asked for at its turn with another contract; the engine answers with the
 *   pending result, which names the first contract.
 * - `refuseAfterFailedApply: false` (no block is applied after an apply failed once its state was made): block 1's
 *   apply fails on a malformed contract address, after the engine persisted the new state's key; the same block with
 *   the right input is then applied in the same package, and its batch raises the state key's root count by 2, where
 *   one apply raises it by 1.
 */

const LONG = 240_000;
const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const at = (height: bigint): BlockId => ({ height, hash: hash(Number(height) + 1) });

function applyBlock(height: bigint, rest: Partial<ApplyBlock> = {}): ApplyBlock {
  return {
    ledger: "v9",
    ...at(height),
    parentHash: at(height - 1n).hash,
    timestampMs: BigInt(T0) + height * 6_000n,
    parentTimestampMs: BigInt(T0) + (height - 1n) * 6_000n,
    firstRegularAtParentTime: false,
    transactions: 0,
    ...rest,
  };
}

/** `engine` past block 0 (a blank genesis, no transaction), committed. */
async function atGenesis(engine: LedgerEngine): Promise<LedgerEngine> {
  await engine.genesis({
    ledger: "v9",
    ...at(0n),
    parentHash: new Uint8Array(32),
    timestampMs: BigInt(T0),
    transactions: 0,
    genesisState: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: true,
  });
  expect(engine.commit(at(0n))).toBe(true);
  return engine;
}

describe("negative control: the ledger worker's engine with a rule off", () => {
  it("control: without the comparison of inputs, a pending block asked for with another input gets the result of the input it was applied from", { timeout: LONG }, async () => {
    const engine = await atGenesis(new LedgerEngine({ load: loadLedgerPackage, checkSameInput: false }));
    await engine.apply(applyBlock(1n));
    const ahead = await engine.apply(applyBlock(2n, { ahead: true, contracts: [hash(0xa1)] }));
    const atItsTurn = await engine.apply(applyBlock(2n, { contracts: [hash(0xb2)] }));
    expect(atItsTurn).toBe(ahead);
    // The contract of the other input, where an apply of this input names 0xb2….
    expect(atItsTurn.contracts.map((contract) => hex(contract.address))).toEqual([hex(hash(0xa1))]);
  });

  it("control: applied again in the package a failed apply left a persisted key in, a block raises its state key's root count by 2", { timeout: LONG }, async () => {
    const engine = await atGenesis(new LedgerEngine({ load: loadLedgerPackage, refuseAfterFailedApply: false }));
    await expect(engine.apply(applyBlock(1n, { contracts: [Uint8Array.of(1, 2, 3)] }))).rejects.toThrow();
    const applied = await engine.apply(applyBlock(1n));
    const delta = applied.batch.rootCounts.find((count) => hex(count.key) === hex(applied.stateKey))?.delta;
    expect(delta).toBe(2);
  });
});
