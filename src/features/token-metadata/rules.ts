/**
 * The MIP-0018 rules `token-metadata` and `token-metadata-api` share, so the indexer's writes and the API's reads
 * apply each rule in one place. Pure: no database, no I/O.
 *
 * - **Defined keys** (MIP "Keys"): a key is served only when it is a common-field key (`name`, `symbol`, `decimals`,
 *   `standards`, `image`, `image_sha256`) or a key of a standard the token currently declares in a usable `standards`
 *   ({@link STANDARD_KEYS}, empty: no MIP defines such keys). The indexer stores defined keys only.
 * - **Usable common fields** (MIP "Common fields"): `name` and `symbol` when a non-empty UTF-8 string, `decimals` when
 *   an unsigned integer, `standards` when a well-formed list, `image` when a URI, `image_sha256` when exactly 32 bytes.
 *   An unusable field shows no value and never falls back to an earlier one; there are no defaults.
 * - **Lengths**: a `name` keeps its first 64 and a `symbol` its first 12 characters (grapheme clusters, UAX #29). The
 *   indexer stores values whole; the API cuts them where it serves them, and a cut value stays usable.
 * - **Symbol grouping** (MIP "Symbol grouping"): the tokens of one contract with the same usable `symbol` bytes form a
 *   group when there are two or more.
 * - **Marks**: ✓ ok, ⚠ partial, ⚠ incorrect, ⚠ unresolved or none, from the token's current fields and its contract's
 *   rejected events and unresolved log sites ({@link tokenMark}).
 */

import { decodeUtf8, toHex, ValType } from "./codec/index.js";

const enc = new TextEncoder();

// ── Common fields ────────────────────────────────────────────────────────────────────────────────────────────────

/** The common keys a token's summary and mark read (`name`, `symbol`, `decimals`, `standards`), as hex. */
export const COMMON_KEY_HEX = {
  name: toHex(enc.encode("name")),
  symbol: toHex(enc.encode("symbol")),
  decimals: toHex(enc.encode("decimals")),
  standards: toHex(enc.encode("standards")),
} as const;

/** The image keys of the common fields (`image`, `image_sha256`), as hex. Neither affects a mark. */
export const IMAGE_KEY_HEX = {
  image: toHex(enc.encode("image")),
  imageSha256: toHex(enc.encode("image_sha256")),
} as const;

/** Every key of the common fields: `name`, `symbol`, `decimals`, `standards`, `image`, `image_sha256`. */
const COMMON_KEYS: ReadonlySet<string> = new Set([...Object.values(COMMON_KEY_HEX), ...Object.values(IMAGE_KEY_HEX)]);

/** `image_sha256` is usable only as exactly this many bytes. */
const IMAGE_SHA256_BYTES = 32;

/** A field's current value, as the API reads it and the mark and groups take it. */
export interface Field {
  key: Uint8Array;
  valType: number;
  value: Uint8Array;
  /** `UInt` values only: the little-endian unsigned integer. */
  integer?: bigint;
  /** Given for the keys of the common fields only. */
  usable?: boolean;
  /** Where the current value was set: block, transaction, event within the transaction, record within the event. */
  position: { block: number; tx: number; event: number; record: number };
}

// ── Defined keys (MIP "Keys") ────────────────────────────────────────────────────────────────────────────────────

/**
 * The keys standards define: a standard's identifier (as declared in `standards`) → the keys (hex) it defines. A key
 * that is neither a common field nor defined by a standard the token currently declares is never served; an event
 * carrying one is still valid.
 */
export type StandardKeys = ReadonlyMap<string, ReadonlySet<string>>;

/** The keys standards define: empty, as no MIP defines such keys; a MIP that does adds its identifier and keys here. */
export const STANDARD_KEYS: StandardKeys = new Map();

/** Whether a key is defined for a token that declares `declared`: a common-field key, or a key of a declared standard. */
export function isDefinedKey(keyHex: string, declared: readonly string[], standardKeys: StandardKeys = STANDARD_KEYS): boolean {
  if (COMMON_KEYS.has(keyHex)) return true;
  for (const id of declared) if (standardKeys.get(id)?.has(keyHex) === true) return true;
  return false;
}

/**
 * `standards`: identifiers separated by single spaces (0x20); an identifier is non-empty and has no byte in 0x00–0x20
 * or 0x7f. An empty value is the empty list (no standards claimed). Returns `undefined` for a malformed value
 * (unusable, not empty). The value is valid UTF-8 already (a type-1 value of an accepted event).
 */
export function parseStandards(value: Uint8Array): string[] | undefined {
  if (value.length === 0) return [];
  const ids: string[] = [];
  let start = 0;
  for (let i = 0; i <= value.length; i++) {
    const b = i < value.length ? (value[i] as number) : 0x20;
    if (b === 0x20) {
      if (i === start) return undefined; // an empty identifier: leading, trailing or double space
      const id = decodeUtf8(value.subarray(start, i));
      if (id === undefined) return undefined;
      ids.push(id);
      start = i + 1;
    } else if (b < 0x20 || b === 0x7f) {
      return undefined;
    }
  }
  return ids;
}

/**
 * Whether a field's current value is usable; `undefined` for a key that is not a common key (the MIP gives no form to
 * other keys). Never looks at earlier values.
 */
export function fieldUsable(keyHex: string, valType: number, value: Uint8Array): boolean | undefined {
  switch (keyHex) {
    case COMMON_KEY_HEX.name:
    case COMMON_KEY_HEX.symbol:
      return valType === ValType.Utf8 && value.length > 0;
    case COMMON_KEY_HEX.decimals:
      return valType === ValType.UInt;
    case COMMON_KEY_HEX.standards:
      return valType === ValType.Utf8 && parseStandards(value) !== undefined;
    case IMAGE_KEY_HEX.image:
      return valType === ValType.Uri; // an accepted type-4 value is a valid RFC 3986 URI (the codec checked it)
    case IMAGE_KEY_HEX.imageSha256:
      return valType === ValType.Bytes && value.length === IMAGE_SHA256_BYTES;
    default:
      return undefined;
  }
}

// ── Lengths (MIP "Common fields": `name` 1–64 and `symbol` 1–12 characters) ─────────────────────────────────────

/** The most characters a served value keeps, by key hex: `name` 64, `symbol` 12 (a character is a grapheme cluster). */
const MAX_CHARACTERS: Readonly<Record<string, number>> = { [COMMON_KEY_HEX.name]: 64, [COMMON_KEY_HEX.symbol]: 12 };
const graphemes = new Intl.Segmenter("en", { granularity: "grapheme" });

/** The first `max` characters (grapheme clusters, `Intl.Segmenter`) of `text`; never splits a cluster. */
export function firstCharacters(text: string, max: number): string {
  if (text.length <= max) return text; // fewer UTF-16 code units than `max` means fewer clusters too
  let out = "";
  let n = 0;
  for (const { segment } of graphemes.segment(text)) {
    if (n === max) break;
    out += segment;
    n++;
  }
  return out;
}

/**
 * A `name` or `symbol` text value (type 1) cut to its first 64 / 12 characters ("consumers SHOULD discard any extra
 * characters"); every other value unchanged.
 */
export function lengthLimited(keyHex: string, valType: number, value: Uint8Array): Uint8Array {
  const max = MAX_CHARACTERS[keyHex];
  if (max === undefined || valType !== ValType.Utf8) return value;
  const text = decodeUtf8(value);
  if (text === undefined) return value; // not reached for an accepted event: type-1 values are valid UTF-8
  const kept = firstCharacters(text, max);
  return kept.length === text.length ? value : enc.encode(kept);
}

// ── Symbol grouping ──────────────────────────────────────────────────────────────────────────────────────────────

/** What symbol grouping needs from a token: its contract, domain separator and kind, and (at least) its `symbol`. */
export interface GroupableToken {
  /** hex, lowercase */
  contractAddress: string;
  /** hex, lowercase */
  domainSep: string;
  kind: number;
  fields: ReadonlyMap<string, Pick<Field, "value" | "usable">>;
}

/** A symbol group: the tokens of one contract sharing a usable `symbol`. */
export interface SymbolGroup {
  contractAddress: string;
  /** The exact `symbol` bytes, hex. */
  symbol: string;
  /** Sorted by (domainSep, kind); always two or more. */
  members: Array<{ domainSep: string; kind: number }>;
}

/** Code-unit order (locale-independent, deterministic). */
const byString = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/**
 * The symbol-grouping rule: tokens of one contract whose `symbol` is usable and has the same exact bytes form a group;
 * only groups of two or more members are reported. A token without a usable `symbol` is ungrouped. Members are sorted
 * by (domainSep, kind), groups by (contract, symbol); input order does not matter.
 */
export function symbolGroups(tokens: Iterable<GroupableToken>): SymbolGroup[] {
  const byKey = new Map<string, SymbolGroup>();
  for (const token of tokens) {
    const symbol = token.fields.get(COMMON_KEY_HEX.symbol);
    if (symbol === undefined || symbol.usable !== true) continue;
    const g: SymbolGroup = { contractAddress: token.contractAddress, symbol: toHex(symbol.value), members: [] };
    const k = `${g.contractAddress}/${g.symbol}`;
    const group = byKey.get(k) ?? g;
    group.members.push({ domainSep: token.domainSep, kind: token.kind });
    byKey.set(k, group);
  }
  return [...byKey.values()]
    .filter((g) => g.members.length >= 2)
    .map((g) => ({ ...g, members: g.members.sort((a, b) => byString(a.domainSep, b.domainSep) || a.kind - b.kind) }))
    .sort((a, b) => byString(a.contractAddress, b.contractAddress) || byString(a.symbol, b.symbol));
}

// ── Marks ────────────────────────────────────────────────────────────────────────────────────────────────────────

export type MarkKind = "ok" | "partial" | "incorrect" | "unresolved" | "none";

/**
 * The reason a mark carries when the token's contract has unresolved log sites: `log` ops whose logged value the raw
 * transaction does not show, so the contract may have published, renamed or withdrawn metadata this indexer cannot
 * read.
 */
export const UNRESOLVED_LOG_REASON = "unresolved-log";

export interface TokenMark {
  /** ✓ ok, ⚠ partial, ⚠ incorrect, ⚠ unresolved, or no mark. */
  mark: MarkKind;
  /**
   * The reasons of the contract's rejected MIP-0018 events, in chain order (`incorrect`), followed by
   * {@link UNRESOLVED_LOG_REASON} once when the contract has unresolved log sites (`unresolved`, or `incorrect` with
   * both).
   */
  reasons: string[];
  /** `partial`: which of `name`, `symbol`, `decimals` are missing or unusable. */
  missing: Array<"name" | "symbol" | "decimals">;
  /** The usable `standards` identifiers, deduplicated in order (shown as tags; self-declared, never proof). */
  tags: string[];
}

export interface MarkInput {
  /**
   * The token's fields, or `undefined` when it has none (never described, or withdrawn). An empty map means the same
   * as `undefined`.
   */
  fields: ReadonlyMap<string, Pick<Field, "valType" | "value" | "usable">> | undefined;
  /**
   * Whether the token exists (has a defined field), when `fields` holds only some of them (the API reads only the
   * common keys); omitted = decided from `fields`.
   */
  described?: boolean;
  /**
   * Reasons of the rejected MIP-0018 events of the token's contract, in chain order: all of them, or the first ones
   * (the mark only needs to know whether there is one).
   */
  contractRejections: readonly string[];
  /** How many unresolved log sites the token's contract has (default 0). */
  contractUnresolvedLogs?: number;
}

/**
 * The one place that decides a token's mark:
 * - ⚠ incorrect: the token's contract has a rejected MIP-0018 event (the reasons are shown);
 * - ⚠ unresolved: the contract has no rejected event but has an unresolved log site; the reason `unresolved-log` is
 *   shown. Nothing says the contract published anything malformed, only that UmbraDB cannot verify what it published,
 *   so a token of such a contract never keeps a clean ✓;
 * - ✓ ok: the token exists with usable `name`, `symbol` and `decimals` (the keys issuers SHOULD publish) and its
 *   contract has no rejected event and no unresolved log site;
 * - ⚠ partial: the token exists but one of the three is missing or unusable;
 * - no mark: none of these (no MIP-0018 event, or a token withdrawn and never described again).
 *
 * Precedence: incorrect, then unresolved, then the token's own fields; with both rejected events and unresolved log
 * sites, the mark is ⚠ incorrect and its reasons end with `unresolved-log`. The mark depends on current state only: a
 * token never described or withdrawn has no fields, no `missing` list and no tags, and is marked from its contract's
 * rejections and unresolved log sites alone. Usable `standards` identifiers are returned as tags; no standard changes
 * what the marks mean yet.
 */
export function tokenMark(input: MarkInput): TokenMark {
  const described = input.described ?? (input.fields !== undefined && input.fields.size > 0);
  const fields = described ? (input.fields ?? new Map<string, Pick<Field, "valType" | "value" | "usable">>()) : undefined;
  const tags: string[] = [];
  const standards = fields?.get(COMMON_KEY_HEX.standards);
  if (standards !== undefined && standards.usable === true)
    for (const id of parseStandards(standards.value) ?? []) if (!tags.includes(id)) tags.push(id);
  const missing: TokenMark["missing"] = [];
  if (fields !== undefined)
    for (const name of ["name", "symbol", "decimals"] as const) if (fields.get(COMMON_KEY_HEX[name])?.usable !== true) missing.push(name);
  const unresolved = (input.contractUnresolvedLogs ?? 0) > 0 ? [UNRESOLVED_LOG_REASON] : [];
  if (input.contractRejections.length > 0) return { mark: "incorrect", reasons: [...input.contractRejections, ...unresolved], missing, tags };
  if (unresolved.length > 0) return { mark: "unresolved", reasons: unresolved, missing, tags };
  if (fields === undefined) return { mark: "none", reasons: [], missing: [], tags: [] };
  return { mark: missing.length === 0 ? "ok" : "partial", reasons: [], missing, tags };
}
