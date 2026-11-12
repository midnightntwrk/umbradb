/**
 * Every statement `token-metadata-api` sends to `token-metadata`'s tables (`../token-metadata/schema.ts`), by name
 * ({@link STATEMENTS}): the catalog `test/features/token-metadata/sql-plans.test.ts` plans on both backends (no scan of
 * a `token_metadata` table, every index used). Each is static: a variant is its own statement. The functions below only
 * bind and map, and each answer reads in a fixed number of statements, except the group of a served 12-character symbol
 * (see {@link symbolGroup}).
 */

import type { ReadHandle } from "../../db/api.js";
import { COLOR_SQL, SCHEMA } from "../token-metadata/schema.js";
import { COMMON_KEY_HEX, type Field, firstCharacters, IMAGE_KEY_HEX, lengthLimited, symbolGroups } from "../token-metadata/state.js";
import { decodeUtf8, fromHex, toHex } from "../token-metadata/codec/index.js";

/** A token identity: its contract, domain separator and kind (hex, lowercase). */
export interface TokenKey {
  readonly contractAddress: string;
  readonly domainSep: string;
  readonly kind: number;
}

export const keyOf = (k: TokenKey): string => `${k.contractAddress}/${k.domainSep}/${k.kind}`;
const bytes = (hex: string): Uint8Array => fromHex(hex);
const num = (v: unknown): number => Number(v);
const tokenKeyOf = (r: Record<string, unknown>): TokenKey => ({
  contractAddress: toHex(r.contract_address as Uint8Array),
  domainSep: toHex(r.domain_sep as Uint8Array),
  kind: num(r.kind),
});
const keysParams = (keys: readonly TokenKey[]): unknown[] => [
  keys.map((k) => bytes(k.contractAddress)),
  keys.map((k) => bytes(k.domainSep)),
  keys.map((k) => k.kind),
];

const FIELD_COLUMNS = `f.contract_address, f.domain_sep, f.kind::int AS kind, f.key, f.val_type::int AS val_type, f.value,
  f.uint_value::text AS uint_value, f.usable, f.set_height::text AS set_height, f.set_tx::int AS set_tx,
  f.set_event::int AS set_event, f.set_record::int AS set_record`;

const BY_KEYS = "unnest($1::bytea[], $2::bytea[], $3::int[]) AS i(c, d, k)";
const firstOfContract = (classification: "reject" | "unresolved", columns: string) =>
  `SELECT c.address, ${columns} FROM unnest($1::bytea[]) AS c(address) CROSS JOIN LATERAL (
     SELECT reason, height, tx_index, event_index FROM ${SCHEMA}.events e
     WHERE e.contract_address = c.address AND e.classification = '${classification}'
     ORDER BY height, tx_index, event_index LIMIT $2) e
   ORDER BY c.address, e.height, e.tx_index, e.event_index`;
const contractTokens = (after: string) => `WITH RECURSIVE ids AS (
       (SELECT contract_address, domain_sep, kind FROM ${SCHEMA}.fields
        WHERE defined AND contract_address = $2 ${after} ORDER BY domain_sep, kind LIMIT 1)
       UNION ALL
       SELECT n.contract_address, n.domain_sep, n.kind FROM ids CROSS JOIN LATERAL (
         SELECT contract_address, domain_sep, kind FROM ${SCHEMA}.fields
         WHERE defined AND contract_address = $2 AND (domain_sep, kind) > (ids.domain_sep, ids.kind)
         ORDER BY domain_sep, kind LIMIT 1) n
     )
     SELECT contract_address, domain_sep, kind::int AS kind FROM ids LIMIT $1`;
/** The symbol rows of contract `$1`: the key written out, so `fields_symbol_idx`'s predicate applies (a parameter cannot). */
const SYMBOL_ROWS = `contract_address = $1 AND key = '\\x${COMMON_KEY_HEX.symbol}'::bytea AND usable AND defined`;

/** Every statement the API sends, by name; each is static (`$n` parameters only). */
export const STATEMENTS = Object.freeze({
  /** The described kind 1 and 2 tokens of colors `$1` (`fields_color_idx`). */
  tokensOfColors: `SELECT DISTINCT contract_address, domain_sep, kind::int AS kind FROM ${SCHEMA}.fields
     WHERE ${COLOR_SQL} = ANY($1::bytea[]) AND defined AND kind IN (1, 2)
     ORDER BY contract_address, domain_sep, kind`,
  /** The first `$1` described tokens of contract `$2`, by an index skip scan. */
  tokensOfContract: contractTokens(""),
  /** The same after (domainSep `$3`, kind `$4`). */
  tokensOfContractAfter: contractTokens("AND (domain_sep, kind) > ($3::bytea, $4::smallint)"),
  /** The described kinds among `$3` of (contract `$1`, domainSep `$2`). */
  tokensOfDomain: `SELECT k::int AS kind FROM unnest($3::int[]) AS k
     WHERE EXISTS (SELECT 1 FROM ${SCHEMA}.fields WHERE contract_address = $1 AND domain_sep = $2 AND kind = k AND defined)
     ORDER BY k`,
  /** The first `$4` defined fields of each token, in key byte order. */
  tokenFields: `SELECT ${FIELD_COLUMNS} FROM ${BY_KEYS} CROSS JOIN LATERAL (
       SELECT * FROM ${SCHEMA}.fields WHERE contract_address = i.c AND domain_sep = i.d AND kind = i.k AND defined
       ORDER BY key LIMIT $4) f
     ORDER BY f.contract_address, f.domain_sep, f.kind, f.key`,
  /** How many defined fields each token has. */
  tokenFieldCounts: `SELECT i.c AS contract_address, i.d AS domain_sep, i.k AS kind,
       (SELECT count(*) FROM ${SCHEMA}.fields WHERE contract_address = i.c AND domain_sep = i.d AND kind = i.k AND defined)::int AS n
     FROM ${BY_KEYS}`,
  /** The common fields (keys `$4`) of each token, in the order they were last set. */
  commonFields: `SELECT ${FIELD_COLUMNS} FROM ${BY_KEYS}
     JOIN ${SCHEMA}.fields f ON f.contract_address = i.c AND f.domain_sep = i.d AND f.kind = i.k AND f.key = ANY($4::bytea[]) AND f.defined
     ORDER BY f.contract_address, f.domain_sep, f.kind, f.set_height, f.set_tx, f.set_event, f.set_record`,
  /** Each contract's rejected and unresolved event counts. */
  markCounts: `SELECT c.address,
       (SELECT count(*) FROM ${SCHEMA}.events e WHERE e.contract_address = c.address AND e.classification = 'reject')::int AS rejected,
       (SELECT count(*) FROM ${SCHEMA}.events e WHERE e.contract_address = c.address AND e.classification = 'unresolved')::int AS unresolved
     FROM unnest($1::bytea[]) AS c(address)`,
  /** Each contract's first `$2` rejection reasons. */
  markReasons: firstOfContract("reject", "e.reason"),
  /** Each contract's first `$2` unresolved positions. */
  markPositions: firstOfContract("unresolved", "e.height::text AS height, e.tx_index::int AS tx_index, e.event_index::int AS event_index"),
  /** How many tokens of contract `$1` have the whole symbol `$2`. */
  groupCount: `SELECT count(*)::int AS n FROM ${SCHEMA}.fields WHERE ${SYMBOL_ROWS} AND value = $2`,
  /** The first `$3` of them. */
  groupMembers: `SELECT domain_sep, kind::int AS kind FROM ${SCHEMA}.fields WHERE ${SYMBOL_ROWS} AND value = $2 ORDER BY domain_sep, kind LIMIT $3`,
  /** The tokens of contract `$1` whose symbol starts with `$2` (below `$3`), unordered: `symbolGroups` orders them. */
  groupPrefix: `SELECT domain_sep, kind::int AS kind, value, usable FROM ${SCHEMA}.fields
     WHERE ${SYMBOL_ROWS} AND value >= $2 AND value < $3`,
  /** The same with no upper bound (a prefix of 0xff bytes only). */
  groupPrefixOpen: `SELECT domain_sep, kind::int AS kind, value, usable FROM ${SCHEMA}.fields
     WHERE ${SYMBOL_ROWS} AND value >= $2`,
});

/** A field row as served: its value cut to its served length (`lengthLimited`), never where it is stored. */
export function fieldOf(r: Record<string, unknown>): Field {
  const key = r.key as Uint8Array;
  const valType = num(r.val_type);
  const f: Field = {
    key,
    valType,
    value: lengthLimited(toHex(key), valType, r.value as Uint8Array),
    position: { block: num(r.set_height), tx: num(r.set_tx), event: num(r.set_event), record: num(r.set_record) },
  };
  if (r.uint_value !== null) f.integer = BigInt(r.uint_value as string);
  if (r.usable !== null) f.usable = r.usable === true;
  return f;
}

// ── Selecting tokens ─────────────────────────────────────────────────────────────────────────────────────────────

/** The described kind 1 and 2 tokens whose computed color is one of `colors` (`fields_color_idx`), in key order. */
export async function tokensOfColors(read: ReadHandle, colors: readonly string[]): Promise<TokenKey[]> {
  return (await read.query(STATEMENTS.tokensOfColors, [[...new Set(colors)].map(bytes)])).map(tokenKeyOf);
}

/** Up to `limit` described tokens of `contract` after `after` (domainSep, kind), by an index skip scan. */
export async function tokensOfContract(read: ReadHandle, contract: string, limit: number, after?: readonly [string, number]): Promise<TokenKey[]> {
  const rows =
    after === undefined
      ? await read.query(STATEMENTS.tokensOfContract, [limit, bytes(contract)])
      : await read.query(STATEMENTS.tokensOfContractAfter, [limit, bytes(contract), bytes(after[0]), after[1]]);
  return rows.map(tokenKeyOf);
}

/** The described kinds of one (contract, domainSep), optionally only `kind`. */
export async function tokensOfDomain(read: ReadHandle, contract: string, domainSep: string, kind?: number): Promise<TokenKey[]> {
  const rows = await read.query(STATEMENTS.tokensOfDomain, [bytes(contract), bytes(domainSep), kind === undefined ? [1, 2, 3] : [kind]]);
  return rows.map((r) => ({ contractAddress: contract, domainSep, kind: num(r.kind) }));
}

// ── A token's fields ─────────────────────────────────────────────────────────────────────────────────────────────

/** The defined fields of each token, the first `limit` in key byte order, and how many it has: two statements. */
export async function tokenFields(read: ReadHandle, keys: readonly TokenKey[], limit: number): Promise<Map<string, { fields: Field[]; count: number }>> {
  const out = new Map(keys.map((k) => [keyOf(k), { fields: [] as Field[], count: 0 }]));
  if (keys.length === 0) return out;
  for (const r of await read.query(STATEMENTS.tokenFields, [...keysParams(keys), limit])) out.get(keyOf(tokenKeyOf(r)))!.fields.push(fieldOf(r));
  for (const r of await read.query(STATEMENTS.tokenFieldCounts, keysParams(keys))) out.get(keyOf(tokenKeyOf(r)))!.count = num(r.n);
  return out;
}

/** The common fields of each token (for its mark), in the order they were last set: one statement. */
export async function commonFields(read: ReadHandle, keys: readonly TokenKey[]): Promise<Map<string, Map<string, Field>>> {
  const out = new Map(keys.map((k) => [keyOf(k), new Map<string, Field>()]));
  if (keys.length === 0) return out;
  const common = [...Object.values(COMMON_KEY_HEX), ...Object.values(IMAGE_KEY_HEX)].map(bytes);
  for (const r of await read.query(STATEMENTS.commonFields, [...keysParams(keys), common])) {
    out.get(keyOf(tokenKeyOf(r)))!.set(toHex(r.key as Uint8Array), fieldOf(r));
  }
  return out;
}

// ── Marks ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** What a mark needs of a contract: its rejected events (count, first reasons) and unresolved sites (count, first positions). */
export interface MarkInputs {
  count: number;
  reasons: string[];
  unresolved: { count: number; positions: { height: number; txIndex: number; eventIndex: number }[] };
}

/**
 * The mark inputs of each of `contracts`, in at most three statements however many contracts: the counts, then the
 * first reasons and the first positions of the contracts that have any, each contract's through a `LATERAL` keyset read.
 */
export async function markInputs(read: ReadHandle, contracts: readonly string[], maxReasons: number, maxPositions: number): Promise<Map<string, MarkInputs>> {
  const unique = [...new Set(contracts)];
  const out = new Map<string, MarkInputs>(unique.map((c) => [c, { count: 0, reasons: [], unresolved: { count: 0, positions: [] } }]));
  if (unique.length === 0) return out;
  const counts = await read.query(STATEMENTS.markCounts, [unique.map(bytes)]);
  const rejecting: Uint8Array[] = [];
  const unresolving: Uint8Array[] = [];
  for (const r of counts) {
    const inputs = out.get(toHex(r.address as Uint8Array))!;
    inputs.count = num(r.rejected);
    inputs.unresolved.count = num(r.unresolved);
    if (inputs.count > 0) rejecting.push(r.address as Uint8Array);
    if (inputs.unresolved.count > 0) unresolving.push(r.address as Uint8Array);
  }
  if (rejecting.length > 0) {
    for (const r of await read.query(STATEMENTS.markReasons, [rejecting, maxReasons])) out.get(toHex(r.address as Uint8Array))!.reasons.push(r.reason as string);
  }
  if (unresolving.length > 0) {
    for (const r of await read.query(STATEMENTS.markPositions, [unresolving, maxPositions])) {
      out.get(toHex(r.address as Uint8Array))!.unresolved.positions.push({ height: num(r.height), txIndex: num(r.tx_index), eventIndex: num(r.event_index) });
    }
  }
  return out;
}

// ── Symbol groups ────────────────────────────────────────────────────────────────────────────────────────────────

/** The smallest byte string above every string starting with `prefix`, or null when there is none (all `0xff`). */
function prefixEnd(prefix: Uint8Array): Uint8Array | null {
  const end = prefix.slice();
  for (let i = end.length - 1; i >= 0; i--) {
    if (end[i]! < 0xff) {
      end[i]! += 1;
      return end.slice(0, i + 1);
    }
  }
  return null;
}

/** The served length of a symbol, in characters. */
const SYMBOL_CHARACTERS = 12;

/**
 * The group of the tokens of `contract` whose served `symbol` is `symbol` (cut): its member count and first `limit`
 * members by (domainSep, kind), or `undefined` with fewer than two. The indexer stores whole symbols. A served symbol
 * under 12 characters is whole, so the group is the rows with exactly that value: an index-only count and the first
 * `limit` members (`fields_symbol_idx`). One of 12 characters may be the cut of longer ones, so the rows read are
 * those whose whole symbol starts with it (a range of the same index), kept when their own cut equals it: that read
 * grows with the contract's symbols sharing the prefix (accepted; `apiReadTimeoutMs` bounds it).
 */
export async function symbolGroup(
  read: ReadHandle,
  contract: string,
  symbol: Uint8Array,
  limit: number,
): Promise<{ memberCount: number; members: { domainSep: string; kind: number }[] } | undefined> {
  const text = decodeUtf8(symbol);
  const address = bytes(contract);
  if (text !== undefined && firstCharacters(text, SYMBOL_CHARACTERS - 1) === text) {
    const [c] = await read.query(STATEMENTS.groupCount, [address, symbol]);
    const memberCount = num(c?.n ?? 0);
    if (memberCount < 2) return undefined;
    const rows = await read.query(STATEMENTS.groupMembers, [address, symbol, limit]);
    return { memberCount, members: rows.map((r) => ({ domainSep: toHex(r.domain_sep as Uint8Array), kind: num(r.kind) })) };
  }
  const end = prefixEnd(symbol);
  const rows =
    end === null
      ? await read.query(STATEMENTS.groupPrefixOpen, [address, symbol])
      : await read.query(STATEMENTS.groupPrefix, [address, symbol, end]);
  const [group] = symbolGroups(
    rows
      .map((r) => ({ domainSep: r.domain_sep as Uint8Array, kind: num(r.kind), usable: r.usable === true, value: lengthLimited(COMMON_KEY_HEX.symbol, 1, r.value as Uint8Array) }))
      .filter((r) => toHex(r.value) === toHex(symbol))
      .map((r) => ({
        network: "",
        contractAddress: contract,
        domainSep: toHex(r.domainSep),
        kind: r.kind,
        fields: new Map([[COMMON_KEY_HEX.symbol, { value: r.value, usable: r.usable }]]),
      })),
  );
  if (group === undefined) return undefined;
  return { memberCount: group.members.length, members: group.members.slice(0, limit).map((m) => ({ domainSep: m.domainSep, kind: m.kind })) };
}
