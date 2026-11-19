/**
 * The route `getTokens` (`POST /token-metadata-api/v1/tokens`): the tokens an input selects (`./schemas.ts`,
 * {@link TokensRequest}), each with its fields (at most the six keys MIP-0018 defines), its common fields and its
 * symbol group. Bytes leave as `0x` lowercase hex ({@link hex0x}) and wide integers as `bigint`s, which the
 * output schema writes as digits in a string.
 *
 * A token is a described identity: one with at least one defined field (MIP "Applying records"); a withdrawn one is
 * referenced nowhere. Reads are bounded whatever the request selects: the selection is one statement, then a token's
 * fields and the counts of its symbols take one statement each for all the selected tokens together (the common
 * fields are read from the same rows); a group that exists (two or more tokens share the symbol) takes one more for its members. Nothing here fetches anything.
 */

import type { ReadHandle } from "../../db/api.js";
import { COMMON_KEY_HEX, type Field as StateField, IMAGE_KEY_HEX, parseStandards } from "../token-metadata/rules.js";
import { decodeUtf8, toHex } from "../token-metadata/codec/index.js";
import { hasColor } from "../token-metadata/color.js";
import { groupCounts, groupKey, isWholeSymbol, tokenMapKey, symbolGroup, type TokenKey, tokenFields, tokensOfColors, tokensOfContract, tokensOfDomain } from "./sql.js";
import { pageCursor } from "../../helpers/page-cursor.js";
import { invalidRequest } from "../../modules/route.js";
import {
  type Common,
  ContractCursor,
  DEFAULT_LIMIT,
  type Field,
  type Group,
  type Kind,
  type KindName,
  MAX_GROUP_MEMBERS,
  type TokenJson,
  type TokensRequest,
  type TokensResponse,
} from "./schemas.js";

const VAL_TYPE_NAMES = ["bytes", "utf8", "uint", "json", "uri"] as const;
const KIND_NAMES: Record<number, KindName> = { 1: "shielded-utxo", 2: "unshielded-utxo", 3: "contract-token" };

const utf8OrNull = (b: Uint8Array): string | null => decodeUtf8(b) ?? null;

/** Bytes as a route writes them: `0x` and lowercase hex. */
export const hex0x = (b: Uint8Array): string => `0x${toHex(b)}`;

/** One served field: hex always; a text view for the text types, an integer view for type 2 — never another type. */
export function fieldJson(f: StateField): Field {
  const value: Field["value"] = { hex: hex0x(f.value) };
  if (f.valType === 1 || f.valType === 3 || f.valType === 4) {
    const text = utf8OrNull(f.value);
    if (text !== null) value.text = text;
  } else if (f.valType === 2 && f.integer !== undefined) {
    value.integer = f.integer;
  }
  return {
    key: { hex: hex0x(f.key), utf8: utf8OrNull(f.key) },
    valType: f.valType,
    valTypeName: VAL_TYPE_NAMES[f.valType] ?? "reserved",
    value,
    usable: f.usable ?? null,
    updatedAt: { height: BigInt(f.position.block), txIndex: f.position.tx, eventIndex: f.position.event, record: f.position.record },
  };
}

/** The usable common fields only (MIP "Common fields": no fallback, no default). */
export function commonJson(fields: ReadonlyMap<string, StateField>): Common {
  const KEYS = { ...COMMON_KEY_HEX, ...IMAGE_KEY_HEX };
  const usable = (key: keyof typeof KEYS): StateField | undefined => {
    const f = fields.get(KEYS[key]);
    return f !== undefined && f.usable === true ? f : undefined;
  };
  const text = (key: "name" | "symbol" | "image"): string | null => {
    const f = usable(key);
    return f === undefined ? null : utf8OrNull(f.value);
  };
  const decimals = usable("decimals");
  const standards = usable("standards");
  const imageSha256 = usable("imageSha256");
  return {
    name: text("name"),
    symbol: text("symbol"),
    decimals: decimals?.integer ?? null,
    standards: standards === undefined ? null : (parseStandards(standards.value) ?? null),
    // What the contract published, served as it is: nothing is fetched, and the hash is the client's to check.
    image: text("image"),
    imageSha256: imageSha256 === undefined ? null : hex0x(imageSha256.value),
  };
}

/** The full answer object of each token in `keys`, in that order. */
async function tokensOf(read: ReadHandle, keys: readonly TokenKey[]): Promise<TokenJson[]> {
  const fields = await tokenFields(read, keys);
  // One count for every whole symbol of the page: only a symbol that two or more tokens share is read further.
  const symbols = keys.flatMap((k) => {
    const symbol = fields.get(tokenMapKey(k))!.get(COMMON_KEY_HEX.symbol);
    return symbol !== undefined && symbol.usable === true && isWholeSymbol(symbol.value) ? [{ contract: k.contractAddress, symbol: symbol.value }] : [];
  });
  const counts = await groupCounts(read, symbols);
  const groups = new Map<string, Group | null>();
  const out: TokenJson[] = [];
  for (const k of keys) {
    const own = fields.get(tokenMapKey(k))!;
    const symbol = own.get(COMMON_KEY_HEX.symbol);
    let group: Group | null = null;
    if (symbol !== undefined && symbol.usable === true) {
      const at = groupKey(k.contractAddress, symbol.value);
      if (!groups.has(at)) {
        const found = await symbolGroup(read, k.contractAddress, symbol.value, MAX_GROUP_MEMBERS, counts.get(at));
        groups.set(
          at,
          found === undefined
            ? null
            : { symbol: { hex: hex0x(symbol.value), utf8: utf8OrNull(symbol.value) }, memberCount: found.memberCount, members: found.members.map((m) => ({ domainSep: `0x${m.domainSep}`, kind: m.kind as Kind })) },
        );
      }
      group = groups.get(at) ?? null;
    }
    out.push({
      contractAddress: `0x${k.contractAddress}`,
      domainSep: `0x${k.domainSep}`,
      kind: k.kind as Kind,
      kindName: KIND_NAMES[k.kind]!,
      color: hasColor(k.kind) ? `0x${k.id}` : null,
      common: commonJson(own),
      fields: [...own.values()].map(fieldJson),
      group,
    });
  }
  return out;
}

// ── Cursors of a contract's pages ────────────────────────────────────────────────────────────────────────────────

/** A contract page's cursors (the core's page cursors, of {@link ContractCursor}). */
const contractCursors = pageCursor(ContractCursor);

export const encodeCursor = (cursor: ContractCursor): string => contractCursors.encode(cursor);

/** The cursor `raw`, if this API issued it for `contract`; else a 400 `invalid-request` (a cursor binds its contract). */
export function decodeCursor(raw: string, contract: string): ContractCursor {
  const value = contractCursors.decode(raw);
  if (value.c !== contract) throw invalidRequest("cursor: not a cursor this route issued for this contract");
  return value;
}

/**
 * The handler of `getTokens`. The input's bytes are `0x` hex, which `./sql.ts` reads either way; a cursor holds them
 * as the input gave them.
 */
export async function selectTokens(body: TokensRequest, read: ReadHandle): Promise<TokensResponse> {
  if ("colors" in body) return { items: await tokensOf(read, await tokensOfColors(read, body.colors)), nextCursor: null };
  if ("domainSep" in body) {
    const keys = await tokensOfDomain(read, body.contract, body.domainSep, "kind" in body ? body.kind : undefined);
    return { items: await tokensOf(read, keys), nextCursor: null };
  }
  const limit = body.limit ?? DEFAULT_LIMIT;
  const after = body.cursor === undefined ? undefined : decodeCursor(body.cursor, body.contract).k;
  const keys = await tokensOfContract(read, body.contract, limit + 1, after);
  const page = keys.slice(0, limit);
  const last = page.at(-1);
  return {
    items: await tokensOf(read, page),
    nextCursor: keys.length > limit && last !== undefined ? encodeCursor({ c: body.contract, k: [`0x${last.domainSep}`, last.kind as Kind] }) : null,
  };
}
