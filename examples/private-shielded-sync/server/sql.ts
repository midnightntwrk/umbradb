/**
 * The module's reads of the core's tables (spec FR-002, FR-010–013; 00062 FR-010): `core_ledger_state.events` (item
 * `ledger-events`), `core_ledger_state.states` (item `ledger-state`), `core_block_commit.blocks` (item `blocks`) and the
 * chain's identity. The module owns no tables and writes nothing.
 */

import type { ReadHandle, ZswapEvidence } from "umbradb";
import { type DustEvent, isDustEventKind } from "./dust-index.ts";
import type { NullifierEvent, OutputEvent } from "./zswap-index.ts";

type Reader = Pick<ReadHandle, "query">;

/** Zswap outputs and inputs of the heights `($1, $2]`, in application order. DUST spends are another kind. */
const ZSWAP_EVENTS_SQL = `SELECT height, tx_index, kind, tree_index, commitment, evidence, ciphertext, nullifier
  FROM core_ledger_state.events
  WHERE kind IN ('zswap-output', 'zswap-input') AND height > $1::bigint AND height <= $2::bigint
  ORDER BY height, tx_index, event_index`;
/** Dust events and parameter changes of the heights `($1, $2]` at or above the era's first height `$3`, in chain order. */
const DUST_EVENTS_SQL = `SELECT height, tx_index, kind, bytes, nullifier, commitment, tree_index
  FROM core_ledger_state.events
  WHERE kind IN ('dust-spend-processed', 'dust-initial-utxo', 'dust-generation-dtime-update', 'param-change')
    AND height > $1::bigint AND height <= $2::bigint AND height >= $3::bigint
  ORDER BY height, tx_index, event_index`;
const CURSOR_SQL = "SELECT max(height) AS height FROM core_block_commit.blocks";
const STATE_AT_SQL = `SELECT s.zswap_first_free, s.zswap_root, b.hash
  FROM core_ledger_state.states s JOIN core_block_commit.blocks b ON b.height = s.height
  WHERE s.height = $1::bigint`;
const BLOCK_HASH_SQL = "SELECT hash FROM core_block_commit.blocks WHERE height = $1::bigint";
const DUST_FIRST_FREE_SQL = "SELECT dust_commitment_first_free FROM core_ledger_state.states WHERE height = $1::bigint";
const GENESIS_SQL = "SELECT genesis_hash FROM core_chain.identity WHERE id = 1";

const bytes = (value: unknown, what: string): Uint8Array => {
  if (!(value instanceof Uint8Array)) throw new TypeError(`${what} is not bytes`);
  return value;
};

const int = (value: unknown, what: string): number => {
  const n = typeof value === "bigint" ? Number(value) : typeof value === "number" ? value : Number.NaN;
  if (!Number.isSafeInteger(n) || n < 0) throw new TypeError(`${what} is not a non-negative integer: ${String(value)}`);
  return n;
};

/** One height's Zswap events, grouped. */
export interface HeightEvents {
  readonly height: number;
  readonly outputs: OutputEvent[];
  readonly nullifiers: NullifierEvent[];
}

/** The Zswap events of the heights `(from, to]`, grouped by height in increasing order (heights without any omitted). */
export async function zswapEvents(read: Reader, from: number, to: number): Promise<HeightEvents[]> {
  const rows = await read.query(ZSWAP_EVENTS_SQL, [from, to]);
  const out: HeightEvents[] = [];
  let current: HeightEvents | undefined;
  for (const row of rows) {
    const height = int(row.height, "events.height");
    if (current === undefined || current.height !== height) {
      current = { height, outputs: [], nullifiers: [] };
      out.push(current);
    }
    const txIndex = int(row.tx_index, "events.tx_index");
    if (row.kind === "zswap-output") {
      current.outputs.push({
        height,
        txIndex,
        position: int(row.tree_index, "events.tree_index"),
        commitment: bytes(row.commitment, "events.commitment"),
        evidence: row.evidence as ZswapEvidence,
        ciphertext: row.ciphertext === null ? null : bytes(row.ciphertext, "events.ciphertext"),
      });
    } else {
      current.nullifiers.push({ height, txIndex, nullifier: bytes(row.nullifier, "events.nullifier") });
    }
  }
  return out;
}

/** The Dust events of the heights `(from, to]` at or above `eraHeight`, grouped by height in increasing order. */
export async function dustEvents(read: Reader, from: number, to: number, eraHeight: number): Promise<{ readonly height: number; readonly events: DustEvent[] }[]> {
  const rows = await read.query(DUST_EVENTS_SQL, [from, to, eraHeight]);
  const out: { height: number; events: DustEvent[] }[] = [];
  for (const row of rows) {
    const height = int(row.height, "events.height");
    const kind = String(row.kind);
    if (!isDustEventKind(kind)) throw new TypeError(`events.kind ${kind} is not a Dust kind`);
    if (out.at(-1)?.height !== height) out.push({ height, events: [] });
    out.at(-1)!.events.push({
      height,
      txIndex: int(row.tx_index, "events.tx_index"),
      kind,
      bytes: bytes(row.bytes, "events.bytes"),
      nullifier: row.nullifier === null ? null : bytes(row.nullifier, "events.nullifier"),
      commitment: row.commitment === null ? null : bytes(row.commitment, "events.commitment"),
      treeIndex: row.tree_index === null ? null : int(row.tree_index, "events.tree_index"),
    });
  }
  return out;
}

/** The committed height (the cursor), or −1 before any. */
export async function cursorOf(read: Reader): Promise<number> {
  const [row] = await read.query(CURSOR_SQL);
  return row?.height === null || row?.height === undefined ? -1 : int(row.height, "blocks.height");
}

/** The tree's first free index and stored root after block `height`, and the block's hash; null when none is stored. */
export async function stateAt(
  read: Reader,
  height: number,
): Promise<{ readonly firstFree: number; readonly root: Uint8Array; readonly hash: Uint8Array } | null> {
  const [row] = await read.query(STATE_AT_SQL, [height]);
  if (row === undefined) return null;
  return {
    firstFree: int(row.zswap_first_free, "states.zswap_first_free"),
    root: bytes(row.zswap_root, "states.zswap_root"),
    hash: bytes(row.hash, "blocks.hash"),
  };
}

/** The Dust commitment tree's first free position after block `height` (00062), or null when no state is stored. */
export async function dustFirstFreeAt(read: Reader, height: number): Promise<number | null> {
  const [row] = await read.query(DUST_FIRST_FREE_SQL, [height]);
  return row === undefined ? null : int(row.dust_commitment_first_free, "states.dust_commitment_first_free");
}

/** The hash of block `height`, or null when none is stored. */
export async function blockHashAt(read: Reader, height: number): Promise<Uint8Array | null> {
  const [row] = await read.query(BLOCK_HASH_SQL, [height]);
  return row === undefined ? null : bytes(row.hash, "blocks.hash");
}

/** The chain's genesis hash, or null on a database that has none recorded. */
export async function genesisHashOf(read: Reader): Promise<Uint8Array | null> {
  const [row] = await read.query(GENESIS_SQL);
  return row === undefined ? null : bytes(row.genesis_hash, "identity.genesis_hash");
}
