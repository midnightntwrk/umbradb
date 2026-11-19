/**
 * Every statement `token-metadata-api` sends to `token-metadata`'s tables (`../token-metadata/sql.ts`: `tokens` and
 * `fields`), by name ({@link STATEMENTS}): the catalog
 * `test/features/token-metadata/sql-plans.test.ts` plans on both backends (no scan of a `token_metadata` table, every
 * index used). Each is static: a variant is its own statement. The functions below only bind and map, and each answer
 * reads in a fixed number of statements, except the group of a served 12-character symbol (see {@link symbolGroup}).
 */

import type { ReadHandle } from "../../db/api.js";
import { TOKEN_METADATA_SCHEMA } from "../token-metadata/schema.js";
import { COMMON_KEY_HEX, type Field, firstCharacters, IMAGE_KEY_HEX, lengthLimited, symbolGroups } from "../token-metadata/rules.js";
import { decodeUtf8, fromHex, toHex } from "../token-metadata/codec/index.js";

/** A token: its id (the hash of domain separator and contract), kind, contract and domain separator (hex, lowercase). */
export interface TokenKey {
  readonly id: string;
  readonly kind: number;
  readonly contractAddress: string;
  readonly domainSep: string;
}

/** What names a token's row: its id and kind. */
type TokenId = Pick<TokenKey, "id" | "kind">;

/** The key of a token in the maps these reads return: its id and kind. */
export function tokenMapKey(k: TokenId): string {
  return [k.id, k.kind].join("/");
}
const bytes = (hex: string): Uint8Array => fromHex(hex);
const num = (v: unknown): number => Number(v);
const tokenKeyOf = (r: Record<string, unknown>): TokenKey => ({
  id: toHex(r.id as Uint8Array),
  kind: num(r.kind),
  contractAddress: toHex(r.contract_address as Uint8Array),
  domainSep: toHex(r.domain_sep as Uint8Array),
});
const idsParams = (keys: readonly TokenKey[]): unknown[] => [keys.map((k) => bytes(k.id)), keys.map((k) => k.kind)];

const TOKEN_COLUMNS = "t.id, t.kind::int AS kind, t.contract_address, t.domain_sep";
const FIELD_COLUMNS = `f.token_id AS id, f.kind::int AS kind, f.key, f.val_type::int AS val_type, f.value,
  f.uint_value::text AS uint_value, f.usable, f.set_height::text AS set_height, f.set_tx::int AS set_tx,
  f.set_event::int AS set_event, f.set_record::int AS set_record`;
const BY_IDS = "unnest($1::bytea[], $2::int[]) AS i(id, k)";

/** Every statement the API sends, by name; each is static (`$n` parameters only). */
export const STATEMENTS = Object.freeze({
  /** The kind 1 and 2 tokens of colors `$1`: a token's id is its color (`tokens`' primary key). */
  tokensOfColors: `SELECT ${TOKEN_COLUMNS} FROM ${TOKEN_METADATA_SCHEMA}.tokens t WHERE t.id = ANY($1::bytea[]) AND t.kind IN (1, 2)
     ORDER BY t.contract_address, t.domain_sep, t.kind`,
  /** The first `$1` tokens of contract `$2`, by (domainSep, kind) (`tokens_contract_idx`). */
  tokensOfContract: `SELECT ${TOKEN_COLUMNS} FROM ${TOKEN_METADATA_SCHEMA}.tokens t WHERE t.contract_address = $2
     ORDER BY t.domain_sep, t.kind LIMIT $1`,
  /** The same after (domainSep `$3`, kind `$4`). */
  tokensOfContractAfter: `SELECT ${TOKEN_COLUMNS} FROM ${TOKEN_METADATA_SCHEMA}.tokens t
     WHERE t.contract_address = $2 AND (t.domain_sep, t.kind) > ($3::bytea, $4::smallint)
     ORDER BY t.domain_sep, t.kind LIMIT $1`,
  /** The tokens of (contract `$1`, domainSep `$2`) of kinds `$3`. */
  tokensOfDomain: `SELECT ${TOKEN_COLUMNS} FROM ${TOKEN_METADATA_SCHEMA}.tokens t
     WHERE t.contract_address = $1 AND t.domain_sep = $2 AND t.kind = ANY($3::smallint[]) ORDER BY t.kind`,
  /** The first `$3` fields of each token, in key byte order. */
  tokenFields: `SELECT ${FIELD_COLUMNS} FROM ${BY_IDS} CROSS JOIN LATERAL (
       SELECT * FROM ${TOKEN_METADATA_SCHEMA}.fields WHERE token_id = i.id AND kind = i.k ORDER BY key LIMIT $3) f
     ORDER BY f.token_id, f.kind, f.key`,
  /** How many fields each token has. */
  tokenFieldCounts: `SELECT i.id, i.k AS kind,
       (SELECT count(*) FROM ${TOKEN_METADATA_SCHEMA}.fields WHERE token_id = i.id AND kind = i.k)::int AS n
     FROM ${BY_IDS}`,
  /** The common fields (keys `$3`) of each token, in the order they were last set. */
  commonFields: `SELECT ${FIELD_COLUMNS} FROM ${BY_IDS}
     JOIN ${TOKEN_METADATA_SCHEMA}.fields f ON f.token_id = i.id AND f.kind = i.k AND f.key = ANY($3::bytea[])
     ORDER BY f.token_id, f.kind, f.set_height, f.set_tx, f.set_event, f.set_record`,
  /** How many tokens of contract `$1` have the whole usable symbol `$2` (`tokens_symbol_idx`). */
  groupCount: `SELECT count(*)::int AS n FROM ${TOKEN_METADATA_SCHEMA}.tokens WHERE contract_address = $1 AND symbol = $2`,
  /** The first `$3` of them, by (domainSep, kind). */
  groupMembers: `SELECT domain_sep, kind::int AS kind FROM ${TOKEN_METADATA_SCHEMA}.tokens WHERE contract_address = $1 AND symbol = $2
     ORDER BY domain_sep, kind LIMIT $3`,
  /** The tokens of contract `$1` whose usable symbol starts with `$2` (below `$3`), unordered: `symbolGroups` orders them. */
  groupPrefix: `SELECT domain_sep, kind::int AS kind, symbol FROM ${TOKEN_METADATA_SCHEMA}.tokens
     WHERE contract_address = $1 AND symbol >= $2 AND symbol < $3`,
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

/** The row key of a field row: its token's id and kind. */
const fieldKeyOf = (r: Record<string, unknown>): string => tokenMapKey({ id: toHex(r.id as Uint8Array), kind: num(r.kind) });

// ── Selecting tokens ─────────────────────────────────────────────────────────────────────────────────────────────

/** The kind 1 and 2 tokens whose color is one of `colors`, by (contract, domainSep, kind). */
export async function tokensOfColors(read: ReadHandle, colors: readonly string[]): Promise<TokenKey[]> {
  return (await read.query(STATEMENTS.tokensOfColors, [[...new Set(colors)].map(bytes)])).map(tokenKeyOf);
}

/** Up to `limit` tokens of `contract` after `after` (domainSep, kind). */
export async function tokensOfContract(read: ReadHandle, contract: string, limit: number, after?: readonly [string, number]): Promise<TokenKey[]> {
  const rows =
    after === undefined
      ? await read.query(STATEMENTS.tokensOfContract, [limit, bytes(contract)])
      : await read.query(STATEMENTS.tokensOfContractAfter, [limit, bytes(contract), bytes(after[0]), after[1]]);
  return rows.map(tokenKeyOf);
}

/** The tokens of one (contract, domainSep), optionally only of `kind`. */
export async function tokensOfDomain(read: ReadHandle, contract: string, domainSep: string, kind?: number): Promise<TokenKey[]> {
  const rows = await read.query(STATEMENTS.tokensOfDomain, [bytes(contract), bytes(domainSep), kind === undefined ? [1, 2, 3] : [kind]]);
  return rows.map(tokenKeyOf);
}

// ── A token's fields ─────────────────────────────────────────────────────────────────────────────────────────────

/** The fields of each token, the first `limit` in key byte order, and how many it has: two statements. */
export async function tokenFields(read: ReadHandle, keys: readonly TokenKey[], limit: number): Promise<Map<string, { fields: Field[]; count: number }>> {
  const out = new Map(keys.map((k) => [tokenMapKey(k), { fields: [] as Field[], count: 0 }]));
  if (keys.length === 0) return out;
  for (const r of await read.query(STATEMENTS.tokenFields, [...idsParams(keys), limit])) out.get(fieldKeyOf(r))!.fields.push(fieldOf(r));
  for (const r of await read.query(STATEMENTS.tokenFieldCounts, idsParams(keys))) out.get(fieldKeyOf(r))!.count = num(r.n);
  return out;
}

/** The common fields of each token, in the order they were last set: one statement. */
export async function commonFields(read: ReadHandle, keys: readonly TokenKey[]): Promise<Map<string, Map<string, Field>>> {
  const out = new Map(keys.map((k) => [tokenMapKey(k), new Map<string, Field>()]));
  if (keys.length === 0) return out;
  const common = [...Object.values(COMMON_KEY_HEX), ...Object.values(IMAGE_KEY_HEX)].map(bytes);
  for (const r of await read.query(STATEMENTS.commonFields, [...idsParams(keys), common])) out.get(fieldKeyOf(r))!.set(toHex(r.key as Uint8Array), fieldOf(r));
  return out;
}

// ── Symbol groups ────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * The smallest byte string above every string starting with `prefix`: `prefix` with its last byte plus one. `prefix` is
 * a usable symbol, so non-empty UTF-8, whose bytes are all below 0xff; anything else throws a `RangeError`.
 */
export function prefixEnd(prefix: Uint8Array): Uint8Array {
  const last = prefix.at(-1);
  if (last === undefined || last === 0xff) throw new RangeError("a symbol prefix is non-empty UTF-8, which has no 0xff byte");
  const end = prefix.slice();
  end[end.length - 1] = last + 1;
  return end;
}

/** The served length of a symbol, in characters. */
const SYMBOL_CHARACTERS = 12;

/**
 * The group of the tokens of `contract` whose served `symbol` is `symbol` (cut): its member count and first `limit`
 * members by (domainSep, kind), or `undefined` with fewer than two. `tokens.symbol` holds each token's whole usable
 * symbol. A served symbol under 12 characters is whole, so the group is the tokens with exactly that symbol: an
 * index-only count and the first `limit` members (`tokens_symbol_idx`). One of 12 characters may be the cut of longer
 * ones, so the tokens read are those whose symbol starts with it (a range of the same index), kept when their own cut
 * equals it: that read grows with the contract's symbols sharing the prefix (accepted; `apiReadTimeoutMs` bounds it).
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
  const rows = await read.query(STATEMENTS.groupPrefix, [address, symbol, prefixEnd(symbol)]);
  const [group] = symbolGroups(
    rows
      .map((r) => ({ domainSep: toHex(r.domain_sep as Uint8Array), kind: num(r.kind), value: lengthLimited(COMMON_KEY_HEX.symbol, 1, r.symbol as Uint8Array) }))
      .filter((r) => toHex(r.value) === toHex(symbol))
      .map((r) => ({
        contractAddress: contract,
        domainSep: r.domainSep,
        kind: r.kind,
        fields: new Map([[COMMON_KEY_HEX.symbol, { value: r.value, usable: true }]]),
      })),
  );
  if (group === undefined) return undefined;
  return { memberCount: group.members.length, members: group.members.slice(0, limit).map((m) => ({ domainSep: m.domainSep, kind: m.kind })) };
}
