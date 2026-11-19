/**
 * Every statement `token-metadata-api` sends to `token-metadata`'s tables (`../token-metadata/sql.ts`: `tokens` and
 * `fields`), by name ({@link STATEMENTS}): the catalog
 * `test/features/token-metadata/sql-plans.test.ts` plans on both backends (no scan of a `token_metadata` table, every
 * index used). Each is static: a variant is its own statement. The functions below only bind and map. An answer reads
 * in three statements (its tokens, their fields, the counts of their symbols), plus one for each symbol group it shows
 * (its members), and plus one for each served 12-character symbol (see {@link symbolGroup}).
 */

import type { ReadHandle } from "../../db/api.js";
import { TOKEN_METADATA_SCHEMA } from "../token-metadata/schema.js";
import { COMMON_KEY_HEX, type Field, firstCharacters, lengthLimited, symbolGroups } from "../token-metadata/rules.js";
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
  /**
   * The first `$1` tokens after (contract `$2`, domainSep `$3`, kind `$4`), by (contract, domainSep, kind)
   * (`tokens_contract_idx`). A first page starts after the empty contract, which is before every address.
   */
  tokensAfter: `SELECT ${TOKEN_COLUMNS} FROM ${TOKEN_METADATA_SCHEMA}.tokens t
     WHERE (t.contract_address, t.domain_sep, t.kind) > ($2::bytea, $3::bytea, $4::smallint)
     ORDER BY t.contract_address, t.domain_sep, t.kind LIMIT $1`,
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
  /** Every field of each token, in key byte order: at most the six keys MIP-0018 defines (`fields`' primary key). */
  tokenFields: `SELECT ${FIELD_COLUMNS} FROM ${BY_IDS}
     JOIN ${TOKEN_METADATA_SCHEMA}.fields f ON f.token_id = i.id AND f.kind = i.k
     ORDER BY f.token_id, f.kind, f.key`,
  /** How many tokens have each (contract `$1[i]`, whole usable symbol `$2[i]`), for every pair at once (`tokens_symbol_idx`). */
  groupCounts: `SELECT p.address, p.symbol,
       (SELECT count(*) FROM ${TOKEN_METADATA_SCHEMA}.tokens t WHERE t.contract_address = p.address AND t.symbol = p.symbol)::int AS n
     FROM unnest($1::bytea[], $2::bytea[]) AS p(address, symbol)`,
  /** The first `$3` tokens of contract `$1` with the whole usable symbol `$2`, by (domainSep, kind). */
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

/** Up to `limit` tokens of every contract after `after` (contract, domainSep, kind); from the first without it. */
export async function tokensAfter(read: ReadHandle, limit: number, after?: readonly [string, string, number]): Promise<TokenKey[]> {
  const from = after === undefined ? [new Uint8Array(), new Uint8Array(), 0] : [bytes(after[0]), bytes(after[1]), after[2]];
  return (await read.query(STATEMENTS.tokensAfter, [limit, ...from])).map(tokenKeyOf);
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

/**
 * Every field of each token, by its key (hex), in key byte order: one statement for all of them. A token has at most
 * the six keys MIP-0018 defines (the indexer stores no other), so this is the whole token: what is served as its
 * fields, and what its common fields and its symbol are read from.
 */
export async function tokenFields(read: ReadHandle, keys: readonly TokenKey[]): Promise<Map<string, Map<string, Field>>> {
  const out = new Map(keys.map((k) => [tokenMapKey(k), new Map<string, Field>()]));
  if (keys.length === 0) return out;
  for (const r of await read.query(STATEMENTS.tokenFields, idsParams(keys))) out.get(fieldKeyOf(r))!.set(toHex(r.key as Uint8Array), fieldOf(r));
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

/** The key of a contract's symbol in the maps the group reads give and take. */
export const groupKey = (contract: string, symbol: Uint8Array): string => `${contract}/${toHex(symbol)}`;

/** Whether a served symbol is whole: under 12 characters, so no longer symbol is cut to it. */
export function isWholeSymbol(symbol: Uint8Array): boolean {
  const text = decodeUtf8(symbol);
  return text !== undefined && firstCharacters(text, SYMBOL_CHARACTERS - 1) === text;
}

/**
 * How many tokens have each of `pairs`' (contract, whole symbol), by {@link groupKey}: one statement however many
 * pairs, none for none. A page's symbols are counted together, so a page of tokens with different symbols costs one
 * read, not one per symbol.
 */
export async function groupCounts(read: ReadHandle, pairs: readonly { readonly contract: string; readonly symbol: Uint8Array }[]): Promise<Map<string, number>> {
  const unique = new Map(pairs.map((pair) => [groupKey(pair.contract, pair.symbol), pair]));
  const out = new Map<string, number>();
  if (unique.size === 0) return out;
  const asked = [...unique.values()];
  const rows = await read.query(STATEMENTS.groupCounts, [asked.map((pair) => bytes(pair.contract)), asked.map((pair) => pair.symbol)]);
  for (const r of rows) out.set(groupKey(toHex(r.address as Uint8Array), r.symbol as Uint8Array), num(r.n));
  return out;
}

/**
 * The group of the tokens of `contract` whose served `symbol` is `symbol` (cut): its member count and first `limit`
 * members by (domainSep, kind), or `undefined` with fewer than two. `tokens.symbol` holds each token's whole usable
 * symbol. A served symbol under 12 characters is whole, so the group is the tokens with exactly that symbol: its
 * count (`counted`, from {@link groupCounts} for the page; read here when not given) and, for two or more, the first
 * `limit` members (`tokens_symbol_idx`). One of 12 characters may be the cut of longer ones, so the tokens read are
 * those whose symbol starts with it (a range of the same index), kept when their own cut equals it: that read grows
 * with the contract's symbols sharing the prefix (accepted; `apiReadTimeoutMs` bounds it).
 */
export async function symbolGroup(
  read: ReadHandle,
  contract: string,
  symbol: Uint8Array,
  limit: number,
  counted?: number,
): Promise<{ memberCount: number; members: { domainSep: string; kind: number }[] } | undefined> {
  const address = bytes(contract);
  if (isWholeSymbol(symbol)) {
    const memberCount = counted ?? (await groupCounts(read, [{ contract, symbol }])).get(groupKey(contract, symbol)) ?? 0;
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
