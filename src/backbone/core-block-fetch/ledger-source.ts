/**
 * What `core-ledger-state` asks the node, through the block source the runner binds it to
 * (`openspec/changes/core-arch/specs/ingest/spec.md` IN-7, IN-8; `specs/ledger/spec.md` LG-15; task 12.3): the ledger
 * state root after a finalized block (`midnight_ledgerStateRoot` at its hash), which every state root it computes is
 * compared with, and the genesis state (`system_properties.genesis_state`), block 0's ledger state. Both are IN-8's
 * methods. The node source gives them (`./node-source.ts`); the in-memory source, which has no node, does not, and
 * `core-ledger-state` is not bound to it. Pure: no Node.js import.
 */

import type { BlockRef } from "../../runner/block-source.js";

/** What `core-ledger-state` reads of the chain's ledger (see the module comment). */
export interface BlockLedgerSource {
  /** The node's ledger state root after `block`, a finalized block: the ledger's serialization of its root key. */
  ledgerStateRoot(block: BlockRef): Promise<Uint8Array>;
  /** The chain's genesis ledger state, as the ledger serializes it (`system_properties.genesis_state`). */
  genesisState(): Promise<Uint8Array>;
}

/** Whether `source` gives `core-ledger-state` the node's roots and genesis state (the node source). */
export function isBlockLedgerSource(source: unknown): source is BlockLedgerSource {
  const candidate = source as Partial<BlockLedgerSource> | null;
  return typeof candidate?.ledgerStateRoot === "function" && typeof candidate.genesisState === "function";
}

/**
 * The genesis state of a `system_properties` answer: its `genesis_state`, hex with or without `0x` as the node writes
 * it (`midnight-node` `node/src/chain_spec/mod.rs`, `hex::encode`); throws for an answer without one.
 */
export function genesisStateOf(properties: Readonly<Record<string, unknown>>): Uint8Array {
  const value = properties.genesis_state;
  const digits = typeof value === "string" ? (value.startsWith("0x") ? value.slice(2) : value) : null;
  if (digits === null || digits.length === 0 || digits.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(digits)) {
    throw new Error(
      `the node's system_properties has no genesis_state as hex (IN-7): ${value === undefined ? "none" : JSON.stringify(value).slice(0, 80)}`,
    );
  }
  const bytes = new Uint8Array(digits.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = Number.parseInt(digits.slice(2 * i, 2 * i + 2), 16);
  return bytes;
}
