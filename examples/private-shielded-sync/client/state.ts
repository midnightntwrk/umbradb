/**
 * The wallet's local state (spec FR-114, FR-128): a JSON file in a private directory (mode 700, file 600). Per coin:
 * the tree position, the coin (token type, value, nonce), its commitment and nullifier, the lower Merkle path when the
 * PIR record carried one, and whether and where it was spent; plus the snapshot and tail height it reflects, and what a
 * transfer of this client left pending (the spent coin, the change output's commitment) until a sync confirms it.
 *
 * It holds no key. Values and nonces are private to the wallet, so the file is readable by its owner only.
 */

import { chmodSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const STATE_FORMAT = 1;

/** Where a spent coin's nullifier was found. */
export interface SpentAt {
  readonly height: number;
  readonly txIndex: number;
  /** `snapshot`: the nullifier table (PIR); `tail`: the tail's list. */
  readonly source: "snapshot" | "tail";
}

export interface CoinRecord {
  readonly position: number;
  /** Hex, 32 bytes. */
  readonly tokenType: string;
  /** Decimal. */
  readonly value: string;
  /** Hex, 32 bytes. */
  readonly nonce: string;
  readonly commitment: string;
  readonly nullifier: string;
  /** The k lower siblings, leaf upward (hex), from the PIR record; null when its block was not full at the snapshot. */
  readonly lowerPath: readonly string[] | null;
  /** `snapshot`: found by the scan and read by PIR; `tail`: found in the tail. */
  readonly source: "snapshot" | "tail";
  readonly spent: SpentAt | null;
}

/** A scan match that the PIR read did not confirm (FR-111): dropped and reported. */
export interface RejectedMatch {
  readonly position: number;
  readonly reason: string;
}

/** What a transfer left pending (FR-128). */
export interface PendingTransfer {
  readonly txHash: string;
  readonly block: { readonly hash: string; readonly height: number } | null;
  /** The coin it spent. */
  readonly spent: { readonly position: number; readonly nullifier: string };
  /** The outputs it made: the change to this wallet (its commitment, to be found by the next sync) and the payment. */
  readonly change: { readonly commitment: string; readonly value: string; readonly tokenType: string; readonly nonce: string } | null;
  readonly payment: { readonly commitment: string; readonly value: string; readonly tokenType: string };
  readonly at: string;
}

export interface WalletState {
  readonly format: typeof STATE_FORMAT;
  readonly network: string;
  readonly snapshot: { readonly id: string; readonly height: number; readonly firstFree: number; readonly pathSplit: number };
  readonly tail: { readonly height: number; readonly blockHash: string; readonly firstFree: number; readonly root: string };
  readonly coins: readonly CoinRecord[];
  readonly rejected: readonly RejectedMatch[];
  readonly pending: readonly PendingTransfer[];
  readonly syncedAt: string;
}

export function readState(path: string): WalletState | null {
  if (!existsSync(path)) return null;
  const state = JSON.parse(readFileSync(path, "utf8")) as WalletState;
  if (state.format !== STATE_FORMAT) throw new Error(`${path}: state format ${String(state.format)}, expected ${STATE_FORMAT}`);
  return state;
}

/** Writes the state atomically into a private directory. */
export function writeState(path: string, state: WalletState): number {
  const dir = dirname(path);
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  chmodSync(dir, 0o700);
  const text = `${JSON.stringify(state, null, 2)}\n`;
  const partial = `${path}.partial-${process.pid}`;
  writeFileSync(partial, text, { mode: 0o600 });
  renameSync(partial, path);
  return Buffer.byteLength(text);
}

/** The unspent coins, without those a pending transfer spent. */
export function unspentCoins(state: WalletState): CoinRecord[] {
  const pendingSpent = new Set(state.pending.map((p) => p.spent.nullifier));
  return state.coins.filter((c) => c.spent === null && !pendingSpent.has(c.nullifier));
}

/** Balance per token type of the unspent coins (FR-115). */
export function balances(state: WalletState): Map<string, bigint> {
  const out = new Map<string, bigint>();
  for (const c of unspentCoins(state)) out.set(c.tokenType, (out.get(c.tokenType) ?? 0n) + BigInt(c.value));
  return out;
}

/** The balance and the unspent coins as text (FR-115). */
export function formatBalance(state: WalletState): string {
  const lines: string[] = [];
  lines.push(`network ${state.network}, snapshot ${state.snapshot.id.slice(0, 16)}… at ${state.snapshot.height}, tail at ${state.tail.height} (first_free ${state.tail.firstFree})`);
  const bal = balances(state);
  lines.push("balance per token type:");
  if (bal.size === 0) lines.push("  (none)");
  for (const [type, value] of [...bal.entries()].sort(([a], [b]) => (a < b ? -1 : 1))) lines.push(`  ${type}  ${value}`);
  const unspent = unspentCoins(state);
  lines.push(`unspent coins (${unspent.length}):`);
  for (const c of unspent) lines.push(`  position ${c.position}  ${c.tokenType.slice(0, 16)}…  ${c.value}  (${c.source})`);
  const spent = state.coins.filter((c) => c.spent !== null);
  if (spent.length > 0) {
    lines.push(`spent coins (${spent.length}):`);
    for (const c of spent) lines.push(`  position ${c.position}  ${c.tokenType.slice(0, 16)}…  ${c.value}  spent at ${c.spent!.height}`);
  }
  for (const p of state.pending) {
    lines.push(`pending transfer ${p.txHash.slice(0, 16)}…: spent position ${p.spent.position}${p.change ? `, change ${p.change.value} awaiting the next sync` : ""}`);
  }
  if (state.rejected.length > 0) {
    lines.push(`rejected scan matches (${state.rejected.length}):`);
    for (const r of state.rejected) lines.push(`  position ${r.position}: ${r.reason}`);
  }
  return lines.join("\n");
}
