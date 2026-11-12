/**
 * `POST /token-metadata-api/v1/tokens`: the tokens a request selects (`./schemas.ts`, {@link TokensRequest}), each with
 * every defined field up to {@link MAX_TOKEN_FIELDS}, its common fields, symbol group, mark and image.
 *
 * A token is a described identity: one with at least one defined field (MIP "Applying records"); a withdrawn one is
 * referenced nowhere. Reads are bounded whatever the request selects: the selection is one statement, then a token's
 * fields, common fields and marks take two, one and up to three statements for all the selected tokens together; a
 * group takes one or two per distinct (contract, symbol). Nothing here fetches anything.
 */

import type { ReadHandle } from "../../db/api.js";
import { COMMON_KEY_HEX, type Field as StateField, fieldUsable, IMAGE_KEY_HEX, parseStandards, tokenMark } from "../token-metadata/state.js";
import { decodeUtf8, fromHex, toHex } from "../token-metadata/codec/index.js";
import { hasColor, tokenColor } from "./color.js";
import { commonFields, keyOf, markInputs, type MarkInputs, symbolGroup, type TokenKey, tokenFields, tokensOfColors, tokensOfContract, tokensOfDomain } from "./queries.js";
import { badRequest } from "./router.js";
import {
  type Common,
  DEFAULT_LIMIT,
  type Field,
  type Group,
  type Image,
  type KindName,
  type Mark,
  MAX_GROUP_MEMBERS,
  MAX_MARK_REASONS,
  MAX_MARK_UNRESOLVED,
  MAX_TOKEN_FIELDS,
  type Token,
  type TokensRequest,
  type TokensResponse,
} from "./schemas.js";

const VAL_TYPE_NAMES = ["bytes", "utf8", "uint", "json", "uri"] as const;
const KIND_NAMES: Record<number, KindName> = { 1: "shielded-utxo", 2: "unshielded-utxo", 3: "contract-token" };

const utf8OrNull = (b: Uint8Array): string | null => decodeUtf8(b) ?? null;

/** One served field: hex always; a text view for the text types, an integer view for type 2 — never another type. */
export function fieldJson(f: StateField): Field {
  const value: Field["value"] = { hex: toHex(f.value) };
  if (f.valType === 1 || f.valType === 3 || f.valType === 4) {
    const text = utf8OrNull(f.value);
    if (text !== null) value.text = text;
  } else if (f.valType === 2 && f.integer !== undefined) {
    value.integer = f.integer.toString();
  }
  return {
    key: { hex: toHex(f.key), utf8: utf8OrNull(f.key) },
    valType: f.valType,
    valTypeName: VAL_TYPE_NAMES[f.valType] ?? "reserved",
    value,
    usable: f.usable ?? null,
    updatedAt: { height: f.position.block, txIndex: f.position.tx, eventIndex: f.position.event, record: f.position.record },
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
    decimals: decimals?.integer === undefined ? null : decimals.integer.toString(),
    standards: standards === undefined ? null : (parseStandards(standards.value) ?? null),
  };
}

/** The token's `image` from a usable `image` field (no fetcher yet, so always `pending`); else `null`. */
function imageJson(fields: ReadonlyMap<string, StateField>): Image | null {
  const image = fields.get(IMAGE_KEY_HEX.image);
  if (image === undefined || fieldUsable(IMAGE_KEY_HEX.image, image.valType, image.value) !== true) return null;
  return { url: String.fromCharCode(...image.value), status: "pending", imageUrl: null };
}

/** The mark of a described token from its common fields and its contract's mark inputs (`state.ts` `tokenMark`). */
export function markJson(common: ReadonlyMap<string, StateField>, inputs: MarkInputs): Mark {
  const m = tokenMark({ fields: common, described: true, contractRejections: inputs.reasons, contractUnresolvedLogs: inputs.unresolved.count });
  return {
    mark: m.mark,
    reasons: [...m.reasons],
    reasonCount: inputs.count,
    unresolved: { count: inputs.unresolved.count, positions: inputs.unresolved.positions.map((p) => ({ ...p })) },
    missing: [...m.missing],
    tags: [...m.tags],
  };
}

const NO_MARK_INPUTS: MarkInputs = { count: 0, reasons: [], unresolved: { count: 0, positions: [] } };

/** The full answer object of each token in `keys`, in that order. */
async function tokensOf(read: ReadHandle, keys: readonly TokenKey[]): Promise<Token[]> {
  const fields = await tokenFields(read, keys, MAX_TOKEN_FIELDS);
  const commons = await commonFields(read, keys);
  const marks = await markInputs(read, keys.map((k) => k.contractAddress), MAX_MARK_REASONS, MAX_MARK_UNRESOLVED);
  const groups = new Map<string, Group | null>();
  const out: Token[] = [];
  for (const k of keys) {
    const common = commons.get(keyOf(k))!;
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
            : { symbol: { hex: toHex(symbol.value), utf8: utf8OrNull(symbol.value) }, memberCount: found.memberCount, members: found.members.map((m) => ({ domainSep: m.domainSep, kind: m.kind as 1 | 2 | 3 })) },
        );
      }
      group = groups.get(at) ?? null;
    }
    const own = fields.get(keyOf(k))!;
    out.push({
      contractAddress: k.contractAddress,
      domainSep: k.domainSep,
      kind: k.kind as 1 | 2 | 3,
      kindName: KIND_NAMES[k.kind]!,
      color: hasColor(k.kind) ? toHex(tokenColor(fromHex(k.domainSep), fromHex(k.contractAddress))) : null,
      common: commonJson(common),
      fields: own.fields.map(fieldJson),
      fieldCount: own.count,
      fieldsTruncated: own.count > own.fields.length,
      group,
      mark: markJson(common, marks.get(k.contractAddress) ?? NO_MARK_INPUTS),
      image: imageJson(common),
    });
  }
  return out;
}

// ── Cursors of a contract's pages ────────────────────────────────────────────────────────────────────────────────

const base64url = {
  encode: (text: string): string => btoa(String.fromCharCode(...new TextEncoder().encode(text))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  decode: (raw: string): string => new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(raw.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))),
};

/** A contract page's cursor: the contract it pages and the last (domainSep, kind) it gave. */
interface ContractCursor {
  c: string;
  k: [string, number];
}

export const encodeCursor = (cursor: ContractCursor): string => base64url.encode(JSON.stringify(cursor));

/** The cursor `raw`, if this API issued it for `contract`; else a 400 (a cursor binds its contract). */
export function decodeCursor(raw: string, contract: string): ContractCursor {
  let value: unknown;
  try {
    value = JSON.parse(base64url.decode(raw));
  } catch {
    throw badRequest("cursor: not a cursor this API issued");
  }
  const c = value as Partial<ContractCursor>;
  const ok =
    typeof value === "object" &&
    value !== null &&
    Object.keys(value).length === 2 &&
    c.c === contract &&
    Array.isArray(c.k) &&
    c.k.length === 2 &&
    typeof c.k[0] === "string" &&
    /^[0-9a-f]{64}$/.test(c.k[0]) &&
    (c.k[1] === 1 || c.k[1] === 2 || c.k[1] === 3);
  if (!ok) throw badRequest("cursor: not a cursor this API issued for this contract");
  return c as ContractCursor;
}

/** The handler of `POST /token-metadata-api/v1/tokens`. */
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
    nextCursor: keys.length > limit && last !== undefined ? encodeCursor({ c: body.contract, k: [last.domainSep, last.kind] }) : null,
  };
}
