/**
 * The ledger cross-check (spec FR-140, SC-001): replays the stored Zswap event bytes up to a height through the
 * ledger's own `ZswapLocalState.replayRawEvents` with a wallet's keys, and compares the coins it finds, spends and keeps
 * with the client's local state for the same height.
 *
 * Events are replayed in chain order `(height, tx_index, event_index)`, each with the ledger package of its block:
 * ledger 8 heights (`ledger_version` `v8`) with `@midnightntwrk/ledger-v8`, ledger 9 heights with
 * `@midnightntwrk/ledger-v9`. At the switch the local state crosses by its serialization, which both packages share
 * (`midnight:zswap-local-state[v6]`). Only `zswap-output` and `zswap-input` events are fed: the replay ignores every
 * other kind.
 *
 * A coin whose output carried the public coin instead of a ciphertext (`public` evidence) is found by the ledger's
 * replay but by no scan: such coins are out of the proof of concept's scope (spec §14) and reported apart.
 */

import type { Ledger, LedgerV8 } from "./ledger.ts";
import type { WalletState } from "./state.ts";

/** One stored Zswap event. */
export interface ZswapEventRow {
  readonly height: number;
  readonly txIndex: number;
  readonly eventIndex: number;
  readonly kind: "zswap-output" | "zswap-input";
  /** The block's ledger (`v8`, `v9`, …). */
  readonly ledger: string;
  readonly bytes: Uint8Array;
  /** Outputs: `ciphertext`, `public` or `none`. */
  readonly evidence: string | null;
  readonly treeIndex: number | null;
  /** Inputs: the nullifier, hex. */
  readonly nullifier: string | null;
}

/** The SQL that reads them (PostgreSQL; `$UPTO` replaced by a checked integer). */
export const ZSWAP_EVENTS_SQL = `SELECT e.height, e.tx_index, e.event_index, e.kind, e.bytes, e.evidence, e.tree_index, e.nullifier, b.ledger_version
  FROM core_ledger_state.events e JOIN core_block_commit.blocks b ON b.height = e.height
  WHERE e.kind IN ('zswap-output', 'zswap-input') AND e.height <= $UPTO
  ORDER BY e.height, e.tx_index, e.event_index`;

export type QueryFn = (sql: string) => Promise<readonly Record<string, unknown>[]>;

/** Reads the stored Zswap events at or below `upto`. */
export async function readZswapEvents(query: QueryFn, upto: number): Promise<ZswapEventRow[]> {
  if (!Number.isSafeInteger(upto) || upto < 0) throw new Error(`height out of range: ${upto}`);
  const rows = await query(ZSWAP_EVENTS_SQL.replace("$UPTO", String(upto)));
  const bytesOf = (v: unknown): Uint8Array => new Uint8Array(v as Uint8Array);
  return rows.map((r) => ({
    height: Number(r.height),
    txIndex: Number(r.tx_index),
    eventIndex: Number(r.event_index),
    kind: r.kind as ZswapEventRow["kind"],
    ledger: String(r.ledger_version),
    bytes: bytesOf(r.bytes),
    evidence: (r.evidence as string | null) ?? null,
    treeIndex: r.tree_index === null ? null : Number(r.tree_index),
    nullifier: r.nullifier === null ? null : Buffer.from(bytesOf(r.nullifier)).toString("hex"),
  }));
}

/** A coin as the replay saw it. */
export interface ReplayedCoin {
  readonly position: number;
  readonly tokenType: string;
  readonly value: string;
  readonly nonce: string;
  readonly nullifier: string;
  /** Where its nullifier was spent, or null. */
  readonly spentAt: number | null;
}

export interface ReplayResult {
  readonly upto: number;
  readonly outputs: number;
  readonly inputs: number;
  /** Every coin received, by position. */
  readonly received: Map<number, ReplayedCoin>;
  /** Positions of the coins the final state holds (unspent). */
  readonly unspent: Set<number>;
  readonly ms: number;
}

/** The ledger family of a block's ledger name. */
const familyOf = (ledgerName: string): "v8" | "v9" => (ledgerName === "v8" ? "v8" : "v9");

/** Replays `rows` (in chain order) with the keys of `zswapSeed`. */
export function replayZswapEvents(
  ledgers: { readonly v9: Ledger; readonly v8?: LedgerV8 },
  zswapSeed: Uint8Array,
  rows: readonly ZswapEventRow[],
  upto: number,
  options: { batch?: number } = {},
): ReplayResult {
  const started = performance.now();
  const batch = options.batch ?? 20_000;
  const keys9 = ledgers.v9.ZswapSecretKeys.fromSeed(zswapSeed);
  const keys8 = ledgers.v8?.ZswapSecretKeys.fromSeed(zswapSeed);
  type AnyState = { serialize(): Uint8Array };
  let family: "v8" | "v9" = "v9";
  let state: AnyState = new ledgers.v9.ZswapLocalState();
  const received = new Map<number, ReplayedCoin>();
  const spentPositions = new Map<number, true>();
  const nullifierHeight = new Map<string, number>();
  for (const r of rows) if (r.kind === "zswap-input" && r.nullifier !== null && !nullifierHeight.has(r.nullifier)) nullifierHeight.set(r.nullifier, r.height);

  let i = 0;
  while (i < rows.length) {
    const fam = familyOf(rows[i]!.ledger);
    let j = i;
    while (j < rows.length && j - i < batch && familyOf(rows[j]!.ledger) === fam) j++;
    if (fam !== family) {
      const bytes = state.serialize();
      if (fam === "v8") {
        if (ledgers.v8 === undefined) throw new Error("ledger 8 events need the ledger 8 package");
        state = ledgers.v8.ZswapLocalState.deserialize(bytes);
      } else {
        state = ledgers.v9.ZswapLocalState.deserialize(bytes);
      }
      family = fam;
    }
    const total = rows.slice(i, j).reduce((n, r) => n + r.bytes.length, 0);
    const raw = new Uint8Array(total);
    let off = 0;
    for (let x = i; x < j; x++) {
      raw.set(rows[x]!.bytes, off);
      off += rows[x]!.bytes.length;
    }
    type Q = { type: string; nonce: string; value: bigint; mt_index: bigint };
    let changes: { receivedCoins: Q[]; spentCoins: Q[] }[];
    if (family === "v8") {
      const out = (state as InstanceType<LedgerV8["ZswapLocalState"]>).replayRawEvents(keys8!, raw);
      state = out.state;
      changes = out.changes as never;
    } else {
      const out = (state as InstanceType<Ledger["ZswapLocalState"]>).replayRawEvents(keys9, raw);
      state = out.state;
      changes = out.changes as never;
    }
    for (const change of changes) {
      for (const c of change.receivedCoins) {
        const nullifier = ledgers.v9.coinNullifier({ type: c.type, nonce: c.nonce, value: c.value }, keys9.coinSecretKey);
        received.set(Number(c.mt_index), { position: Number(c.mt_index), tokenType: c.type, value: c.value.toString(), nonce: c.nonce, nullifier, spentAt: null });
      }
      for (const c of change.spentCoins) spentPositions.set(Number(c.mt_index), true);
    }
    i = j;
  }
  for (const [position, coin] of received) {
    if (spentPositions.has(position)) received.set(position, { ...coin, spentAt: nullifierHeight.get(coin.nullifier) ?? -1 });
  }
  const finalState = family === "v9" ? (state as InstanceType<Ledger["ZswapLocalState"]>) : ledgers.v9.ZswapLocalState.deserialize(state.serialize());
  const unspent = new Set([...finalState.coins].map((c) => Number(c.mt_index)));
  return {
    upto,
    outputs: rows.filter((r) => r.kind === "zswap-output").length,
    inputs: rows.filter((r) => r.kind === "zswap-input").length,
    received,
    unspent,
    ms: performance.now() - started,
  };
}

export interface Difference {
  readonly position: number;
  readonly what: "only-ledger" | "only-client" | "coin" | "spent";
  readonly detail: string;
}

export interface CrossCheckReport {
  readonly upto: number;
  readonly events: { readonly outputs: number; readonly inputs: number };
  readonly ledger: { readonly received: number; readonly spent: number; readonly unspent: number };
  readonly client: { readonly coins: number; readonly spent: number; readonly unspent: number };
  readonly balances: { readonly ledger: Record<string, string>; readonly client: Record<string, string> };
  readonly differences: readonly Difference[];
  /** Coins only the ledger finds because their outputs carried the public coin (outside the scope, spec §14). */
  readonly outOfScope: readonly { readonly position: number; readonly reason: string }[];
  readonly equal: boolean;
  readonly replayMs: number;
}

/** Compares the replay with the client's state (both at `state.tail.height`). */
export function compareWithClient(replay: ReplayResult, state: WalletState, rows: readonly ZswapEventRow[]): CrossCheckReport {
  if (replay.upto !== state.tail.height) throw new Error(`the replay reached ${replay.upto}, the client's state ${state.tail.height}`);
  const evidence = new Map(rows.filter((r) => r.kind === "zswap-output").map((r) => [r.treeIndex!, r.evidence]));
  const client = new Map(state.coins.map((c) => [c.position, c]));
  const differences: Difference[] = [];
  const outOfScope: { position: number; reason: string }[] = [];
  for (const [position, l] of replay.received) {
    const c = client.get(position);
    if (c === undefined) {
      if (evidence.get(position) === "public") outOfScope.push({ position, reason: "public evidence: the output carried the coin in the clear" });
      else differences.push({ position, what: "only-ledger", detail: `${l.tokenType} ${l.value}` });
      continue;
    }
    if (c.tokenType !== l.tokenType || c.value !== l.value || c.nonce !== l.nonce || c.nullifier !== l.nullifier) {
      differences.push({ position, what: "coin", detail: `client ${c.tokenType}/${c.value}/${c.nonce}, ledger ${l.tokenType}/${l.value}/${l.nonce}` });
    }
    const clientSpent = c.spent?.height ?? null;
    if (clientSpent !== l.spentAt) differences.push({ position, what: "spent", detail: `client ${String(clientSpent)}, ledger ${String(l.spentAt)}` });
  }
  for (const c of state.coins) if (!replay.received.has(c.position)) differences.push({ position: c.position, what: "only-client", detail: `${c.tokenType} ${c.value}` });
  const clientUnspent = state.coins.filter((c) => c.spent === null);
  for (const c of clientUnspent) if (!replay.unspent.has(c.position)) differences.push({ position: c.position, what: "spent", detail: "unspent for the client, not in the ledger's final state" });
  for (const p of replay.unspent) if (!client.has(p) || client.get(p)!.spent !== null) {
    if (!outOfScope.some((o) => o.position === p) && !differences.some((d) => d.position === p)) differences.push({ position: p, what: "spent", detail: "in the ledger's final state, not unspent for the client" });
  }
  const sum = (coins: Iterable<{ tokenType: string; value: string }>): Record<string, string> => {
    const m = new Map<string, bigint>();
    for (const c of coins) m.set(c.tokenType, (m.get(c.tokenType) ?? 0n) + BigInt(c.value));
    return Object.fromEntries([...m.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => [k, v.toString()]));
  };
  const ledgerUnspent = [...replay.received.values()].filter((c) => replay.unspent.has(c.position) && !outOfScope.some((o) => o.position === c.position));
  return {
    upto: replay.upto,
    events: { outputs: replay.outputs, inputs: replay.inputs },
    ledger: { received: replay.received.size, spent: [...replay.received.values()].filter((c) => c.spentAt !== null).length, unspent: replay.unspent.size },
    client: { coins: state.coins.length, spent: state.coins.length - clientUnspent.length, unspent: clientUnspent.length },
    balances: { ledger: sum(ledgerUnspent), client: sum(clientUnspent) },
    differences,
    outOfScope,
    equal: differences.length === 0,
    replayMs: replay.ms,
  };
}
