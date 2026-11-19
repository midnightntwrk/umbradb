/**
 * The route `getTokens` (`POST /token-metadata-api/v1/tokens`): the tokens an input selects (`./schemas.ts`,
 * {@link TokensRequest}), each with every defined field up to {@link MAX_TOKEN_FIELDS}, its common fields, symbol
 * group and image. Bytes leave as `0x` lowercase hex ({@link hex0x}) and wide integers as `bigint`s, which the
 * output schema writes as digits in a string.
 *
 * A token is a described identity: one with at least one defined field (MIP "Applying records"); a withdrawn one is
 * referenced nowhere. Reads are bounded whatever the request selects: the selection is one statement, then a token's
 * fields and common fields take two and one statements for all the selected tokens together; a group takes one or
 * two per distinct (contract, symbol). Nothing here fetches anything.
 */

import type { ReadHandle } from "../../db/api.js";
import { COMMON_KEY_HEX, type Field as StateField, fieldUsable, IMAGE_KEY_HEX, parseStandards } from "../token-metadata/rules.js";
import { decodeUtf8, toHex } from "../token-metadata/codec/index.js";
import { hasColor } from "../token-metadata/color.js";
import { commonFields, tokenMapKey, symbolGroup, type TokenKey, tokenFields, tokensOfColors, tokensOfContract, tokensOfDomain } from "./sql.js";
import { pageCursor } from "../../helpers/page-cursor.js";
import { invalidRequest } from "../../modules/route.js";
import {
  type Common,
  ContractCursor,
  DEFAULT_LIMIT,
  type Field,
  type Group,
  type Image,
  type Kind,
  type KindName,
  MAX_GROUP_MEMBERS,
  MAX_TOKEN_FIELDS,
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
  const usable = (key: keyof typeof COMMON_KEY_HEX): StateField | undefined => {
    const f = fields.get(COMMON_KEY_HEX[key]);
    return f !== undefined && f.usable === true ? f : undefined;
  };
  const text = (key: "name" | "symbol"): string | null => {
    const f = usable(key);
    return f === undefined ? null : utf8OrNull(f.value);
  };
  const decimals = usable("decimals");
  const standards = usable("standards");
  return {
    name: text("name"),
    symbol: text("symbol"),
    decimals: decimals?.integer ?? null,
    standards: standards === undefined ? null : (parseStandards(standards.value) ?? null),
  };
}

/** The token's `image` from a usable `image` field (no fetcher yet, so always `pending`); else `null`. */
function imageJson(fields: ReadonlyMap<string, StateField>): Image | null {
  const image = fields.get(IMAGE_KEY_HEX.image);
  if (image === undefined || fieldUsable(IMAGE_KEY_HEX.image, image.valType, image.value) !== true) return null;
  return { url: String.fromCharCode(...image.value), status: "pending", imageUrl: null };
}

/** The full answer object of each token in `keys`, in that order. */
async function tokensOf(read: ReadHandle, keys: readonly TokenKey[]): Promise<TokenJson[]> {
  const fields = await tokenFields(read, keys, MAX_TOKEN_FIELDS);
  const commons = await commonFields(read, keys);
  const groups = new Map<string, Group | null>();
  const out: TokenJson[] = [];
  for (const k of keys) {
    const common = commons.get(tokenMapKey(k))!;
    const symbol = common.get(COMMON_KEY_HEX.symbol);
    let group: Group | null = null;
    if (symbol !== undefined && symbol.usable === true) {
      const at = `${k.contractAddress}/${toHex(symbol.value)}`;
      if (!groups.has(at)) {
        const found = await symbolGroup(read, k.contractAddress, symbol.value, MAX_GROUP_MEMBERS);
        groups.set(
          at,
          found === undefined
            ? null
            : { symbol: { hex: hex0x(symbol.value), utf8: utf8OrNull(symbol.value) }, memberCount: found.memberCount, members: found.members.map((m) => ({ domainSep: `0x${m.domainSep}`, kind: m.kind as Kind })) },
        );
      }
      group = groups.get(at) ?? null;
    }
    const own = fields.get(tokenMapKey(k))!;
    out.push({
      contractAddress: `0x${k.contractAddress}`,
      domainSep: `0x${k.domainSep}`,
      kind: k.kind as Kind,
      kindName: KIND_NAMES[k.kind]!,
      color: hasColor(k.kind) ? `0x${k.id}` : null,
      common: commonJson(common),
      fields: own.fields.map(fieldJson),
      fieldCount: own.count,
      fieldsTruncated: own.count > own.fields.length,
      group,
      image: imageJson(common),
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
