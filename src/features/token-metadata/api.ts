/**
 * `token-metadata`'s `/v1` API on UmbraDB's module API (`docs/token-metadata-api.md`).
 *
 * **The contract.** The paths, parameters, JSON shapes, the strict input (32-byte hex path values, kinds 1–3, no
 * unknown or empty query parameter, `limit` 1–500, cursors only as issued and bound to their endpoint and filter), the
 * error envelope `{ "error": { "code", "message" } }` with the module's codes for what the handlers refuse
 * (400 `BAD_REQUEST`, 404 `NOT_FOUND`, 503 `BUSY` beyond {@link DEFAULT_MAX_CONCURRENT_REQUESTS} requests at once), the
 * ASCII-escaped JSON and the response headers. Marks come from `state.ts`'s `tokenMark`, groups from `symbolGroups`,
 * each bounded (the common keys, the first 100 reasons, positions and members, one
 * keyset page of fields).
 *
 * **What the module API adds.** Each answer is one read at one committed height (DB-2), and carries the core's `X-Umbra-View`, `X-Umbra-Height` and `X-Umbra-Hash` (`answerChainData`).
 * The module API answers what no route of the module reaches: an unknown path (404 `not-found`), a method other than
 * GET (405 `method-not-allowed`), HEAD included, and a failure (500 `internal-error`).
 *
 * **Not served yet** (until the activity and image changes). No mint table yet: `minted` and `firstSeen` are null, `evidence` is `[]`, there are no `seen` rows; NIGHT
 * and DUST are fixed rows; a kind 1 or 2 identity's `color` is its computed color (`fields_color_idx`), and
 * `/v1/tokens/{color}` and `/v1/lookup` resolve a color to the described identities with that color; `image` is
 * `{ url, status: "pending", imageUrl: null }`; `/v1/events` has `segment` and `phase` null; `/v1/status` reports the
 * process's S and committed height.
 *
 * Names and symbols are cut to their served length here (`lengthLimited`), never where they are stored.
 * Nothing here fetches anything.
 */

import type { ReadHandle } from "../../db/api.js";
import type { ApiRegistry } from "../../modules/declaration.js";
import { BUILT_IN_NETWORKS } from "../../ledger/networks.js";
import { answerChainData } from "../../runner/envelope.js";
import { hasColor, tokenColor } from "./color.js";
import { COLOR_SQL, SCHEMA } from "./sql.js";
import {
  COMMON_KEY_HEX,
  type Field,
  fieldUsable,
  firstCharacters,
  IMAGE_KEY_HEX,
  lengthLimited,
  parseStandards,
  symbolGroups,
  tokenMark,
} from "./state.js";
import { fromHex, toHex } from "./codec/index.js";

export const MAX_LIMIT = 500;
export const DEFAULT_LIMIT = 100;
/** Requests answered at once; more are refused with 503 `BUSY`. */
export const DEFAULT_MAX_CONCURRENT_REQUESTS = 8;
/** At most this many rejection reasons are listed in a mark (all are counted in `reasonCount`). */
export const MAX_MARK_REASONS = 100;
/** At most this many unresolved positions are listed in a mark (all are counted in `unresolved.count`). */
export const MAX_MARK_UNRESOLVED = 100;
/** At most this many members are listed in a symbol group (all are counted in `memberCount`). */
export const MAX_GROUP_MEMBERS = 100;

/** The MIP-0018 text the module implements. */
export const MIP_PIN = {
  id: "MIP-0018",
  repository: "midnightntwrk/midnight-improvement-proposals",
  commit: "eb94bc182221cd937a84ed66a5f903b060f165ab",
  path: "mips/mip-0018-on-chain-token-metadata.md",
  sha256: "8d4204e7aa24428faa44740ba99612f5556f628347c50e38903e4bea83f17245",
  url: "https://github.com/midnightntwrk/midnight-improvement-proposals/blob/eb94bc182221cd937a84ed66a5f903b060f165ab/mips/mip-0018-on-chain-token-metadata.md",
  pr: "https://github.com/midnightntwrk/midnight-improvement-proposals/pull/372",
} as const;
/** The MIP-0018 reference implementation whose codec rules and test vectors the module matches. */
export const MIP_REFERENCE = { repository: "https://github.com/midnight-experiments/mip-0018", commit: "e8295792d9363be37ff2f7f716c740fcdf3f195e" } as const;
/** The networks known by their genesis hash: UmbraDB's built-in networks (`src/ledger/networks.json`). */
export const KNOWN_GENESIS: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(BUILT_IN_NETWORKS.flatMap((entry) => (entry.genesis === null ? [] : [[entry.network, entry.genesis.hash]]))),
);

// ── Errors and output ────────────────────────────────────────────────────────────────────────────────────────────

/** A request the handlers refuse: its status, code and a message that never echoes the input. */
export class MetadataApiError extends Error {
  override readonly name = "MetadataApiError";
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

const badRequest = (message: string) => new MetadataApiError(400, "BAD_REQUEST", message);
const notFound = (message: string) => new MetadataApiError(404, "NOT_FOUND", message);
const orNotFound = <T>(value: T | undefined, message: string): T => {
  if (value === undefined) throw notFound(message);
  return value;
};

/** JSON with every non-ASCII character and `<`, `>`, `&` escaped: the body is pure ASCII and parses to the same value. */
export function toAsciiJson(value: unknown): string {
  return JSON.stringify(value).replace(/[\u007f-￿<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

/** The response headers of every answer. */
export const JSON_HEADERS = Object.freeze({
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
});

type Answer = { status: number; headers: Record<string, string>; body: string };

const answer = (status: number, body: unknown, extra: Record<string, string> = {}): Answer => ({
  status,
  headers: { ...JSON_HEADERS, ...extra },
  body: toAsciiJson(body),
});

// ── Input ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** A 32-byte value as lowercase hex; an optional `0x` prefix and upper case are accepted. */
export function hex32(value: string, what: string): string {
  const v = value.startsWith("0x") || value.startsWith("0X") ? value.slice(2) : value;
  if (!/^[0-9a-fA-F]{64}$/.test(v)) throw badRequest(`${what} must be 32 bytes as 64 hex digits`);
  return v.toLowerCase();
}

export function kindParam(value: string): number {
  if (value === "1" || value === "2" || value === "3") return Number(value);
  throw badRequest("kind must be 1, 2 or 3");
}

function limitParam(raw: string | undefined): number {
  if (raw === undefined) return DEFAULT_LIMIT;
  if (!/^[1-9][0-9]{0,2}$/.test(raw) || Number(raw) > MAX_LIMIT) throw badRequest(`limit must be an integer from 1 to ${MAX_LIMIT}`);
  return Number(raw);
}

const base64url = {
  encode(text: string): string {
    let binary = "";
    for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  },
  decode(raw: string): string {
    const binary = atob(raw.replace(/-/g, "+").replace(/_/g, "/"));
    return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
  },
};

export const encodeCursor = (value: unknown): string => base64url.encode(JSON.stringify(value));

/** Decodes a cursor this API issued; `undefined` for anything else (answered 400). */
export function decodeCursor(raw: string): unknown {
  if (!/^[A-Za-z0-9_-]{1,2048}$/.test(raw)) return undefined;
  try {
    const value = JSON.parse(base64url.decode(raw)) as unknown;
    return encodeCursor(value) === raw ? value : undefined; // canonical form only
  } catch {
    return undefined;
  }
}

function cursorParam<T>(raw: string | undefined, parse: (v: unknown) => T | undefined): T | undefined {
  if (raw === undefined) return undefined;
  const decoded = decodeCursor(raw);
  const c = decoded === undefined ? undefined : parse(decoded);
  if (c === undefined) throw badRequest("cursor is not a cursor this endpoint issued");
  return c;
}

/**
 * A route's query parameters: only `allowed` names, none empty. The module API gives the first value of each and the
 * path's parameters (`path`) in one object, so a repeated parameter cannot be told from a single one here.
 */
function queryParams(params: Record<string, string>, path: readonly string[], allowed: readonly string[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const [name, value] of Object.entries(params)) {
    if (path.includes(name)) continue;
    if (!allowed.includes(name)) throw badRequest("unknown query parameter");
    if (value === "") throw badRequest(`query parameter ${name} is empty`);
    out.set(name, value);
  }
  return out;
}

const isHex32 = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f]{64}$/.test(v);
const isUint = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v >= 0;
const isKind = (v: unknown): v is number => v === 1 || v === 2 || v === 3;

type TokensCursor = { e: "tokens"; s: 0; k: [string] } | { e: "tokens"; s: 1; k: [string, string, number] };

function parseTokensCursor(v: unknown): TokensCursor | undefined {
  if (typeof v !== "object" || v === null) return undefined;
  const c = v as { e?: unknown; s?: unknown; k?: unknown };
  if (c.e !== "tokens" || !Array.isArray(c.k) || Object.keys(c).length !== 3) return undefined;
  if (c.s === 0 && c.k.length === 1 && (c.k[0] === "NIGHT" || c.k[0] === "DUST")) return c as TokensCursor;
  if (c.s === 1 && c.k.length === 3 && isHex32(c.k[0]) && isHex32(c.k[1]) && isKind(c.k[2])) return c as TokensCursor;
  return undefined;
}

interface ContractTokensCursor { e: "contract-tokens"; c: string; k: [string, number] }

function parseContractTokensCursor(v: unknown, contract: string): ContractTokensCursor | undefined {
  if (typeof v !== "object" || v === null) return undefined;
  const c = v as { e?: unknown; c?: unknown; k?: unknown };
  if (c.e !== "contract-tokens" || c.c !== contract || !Array.isArray(c.k) || c.k.length !== 2 || Object.keys(c).length !== 3) return undefined;
  return isHex32(c.k[0]) && isKind(c.k[1]) ? (c as ContractTokensCursor) : undefined;
}

interface FieldsCursor { e: "fields"; i: [string, string, number]; k: string }

function parseFieldsCursor(v: unknown, ref: IdKey): FieldsCursor | undefined {
  if (typeof v !== "object" || v === null) return undefined;
  const c = v as { e?: unknown; i?: unknown; k?: unknown };
  if (c.e !== "fields" || !Array.isArray(c.i) || c.i.length !== 3 || Object.keys(c).length !== 3) return undefined;
  if (c.i[0] !== ref.contractAddress || c.i[1] !== ref.domainSep || c.i[2] !== ref.kind) return undefined;
  return typeof c.k === "string" && /^(?:[0-9a-f]{2}){1,255}$/.test(c.k) ? (c as FieldsCursor) : undefined;
}

interface EventFilter { contract?: string; tx?: string }
interface EventsCursor { e: "events"; f: [string | null, string | null]; k: [number, number, number] }

function parseEventsCursor(v: unknown, filter: EventFilter): EventsCursor | undefined {
  if (typeof v !== "object" || v === null) return undefined;
  const c = v as { e?: unknown; f?: unknown; k?: unknown };
  if (c.e !== "events" || !Array.isArray(c.f) || !Array.isArray(c.k) || Object.keys(c).length !== 3) return undefined;
  if (c.f.length !== 2 || c.f[0] !== (filter.contract ?? null) || c.f[1] !== (filter.tx ?? null)) return undefined;
  return c.k.length === 3 && c.k.every(isUint) ? (c as EventsCursor) : undefined;
}

// ── JSON shapes ──────────────────────────────────────────────────────────────────────────────────────────────────

export interface PositionJson { height: number; txIndex: number; txHash: string }
export interface EventPositionJson { height: number; txIndex: number; eventIndex: number }
export interface MarkJson {
  mark: "ok" | "partial" | "incorrect" | "unresolved" | "none";
  reasons: string[];
  reasonCount: number;
  unresolved: { count: number; positions: EventPositionJson[] };
  missing: string[];
  tags: string[];
}
export interface CommonJson { name: string | null; symbol: string | null; decimals: string | null; standards: string[] | null }
export interface BytesJson { hex: string; utf8: string | null }
export interface FieldJson {
  key: BytesJson;
  valType: number;
  valTypeName: string;
  value: { hex: string; text?: string; integer?: string };
  usable: boolean | null;
  updatedAt: { height: number; txIndex: number; eventIndex: number; record: number };
}
export interface GroupJson { symbol: BytesJson; memberCount: number; members: Array<{ domainSep: string; kind: number }> }
export type KindName = "shielded-utxo" | "unshielded-utxo" | "contract-token";
export interface ImageJson { url: string; status: "pending"; imageUrl: null }
export interface TokenSummaryJson {
  id: string;
  source: "builtin" | "identity";
  kind: number | null;
  kindName: KindName | null;
  color: string | null;
  contractAddress: string | null;
  domainSep: string | null;
  name: string | null;
  symbol: string | null;
  decimals: string | null;
  described: boolean;
  minted: null;
  firstSeen: null;
  evidence: string[];
  mark: MarkJson | null;
  note: string | null;
  image: ImageJson | null;
}
export interface IdentityDetailJson {
  network: string;
  contractAddress: string;
  domainSep: string;
  kind: number;
  kindName: KindName;
  color: string | null;
  minted: null;
  described: boolean;
  common: CommonJson;
  commonFields: FieldJson[];
  fields: FieldJson[];
  fieldCount: number;
  fieldsNextCursor: string | null;
  group: GroupJson | null;
  mark: MarkJson;
  image: ImageJson | null;
}
export interface BuiltinJson { symbol: string; name: string; decimals: string; color: string | null; note: string }
export interface Page<T> { items: T[]; nextCursor: string | null }

const VAL_TYPE_NAMES = ["bytes", "utf8", "uint", "json", "uri"] as const;
const KIND_NAMES: Record<number, KindName> = { 1: "shielded-utxo", 2: "unshielded-utxo", 3: "contract-token" };
const strictUtf8 = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });

/** Strict UTF-8 text of `bytes`, or `null` when they are not valid UTF-8 (then only the hex is served). */
export function utf8OrNull(bytes: Uint8Array): string | null {
  try {
    return strictUtf8.decode(bytes);
  } catch {
    return null;
  }
}

const bytesJson = (b: Uint8Array): BytesJson => ({ hex: toHex(b), utf8: utf8OrNull(b) });

/** One current field: hex always; a text view for the text types, an integer view for type 2 — never another type. */
export function fieldJson(f: Field): FieldJson {
  const value: FieldJson["value"] = { hex: toHex(f.value) };
  if (f.valType === 1 || f.valType === 3 || f.valType === 4) {
    const text = utf8OrNull(f.value);
    if (text !== null) value.text = text;
  } else if (f.valType === 2 && f.integer !== undefined) {
    value.integer = f.integer.toString();
  }
  return {
    key: bytesJson(f.key),
    valType: f.valType,
    valTypeName: VAL_TYPE_NAMES[f.valType] ?? "reserved",
    value,
    usable: f.usable ?? null,
    updatedAt: { height: f.position.block, txIndex: f.position.tx, eventIndex: f.position.event, record: f.position.record },
  };
}

/** The usable common fields only (MIP "Common fields": no fallback, no default). */
export function commonJson(fields: ReadonlyMap<string, Field> | undefined): CommonJson {
  const usable = (key: keyof typeof COMMON_KEY_HEX): Field | undefined => {
    const f = fields?.get(COMMON_KEY_HEX[key]);
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

/** The identity's `image` (no fetcher yet, so always `pending`), from a usable `image` field; else `null`. */
function imageJson(fields: ReadonlyMap<string, Field>): ImageJson | null {
  const image = fields.get(IMAGE_KEY_HEX.image);
  if (image === undefined || fieldUsable(IMAGE_KEY_HEX.image, image.valType, image.value) !== true) return null;
  return { url: String.fromCharCode(...image.value), status: "pending", imageUrl: null };
}

// ── Reads ────────────────────────────────────────────────────────────────────────────────────────────────────────

interface IdKey { contractAddress: string; domainSep: string; kind: number }
const keyOf = (k: IdKey): string => `${k.contractAddress}/${k.domainSep}/${k.kind}`;
const bytes = (hex: string): Uint8Array => fromHex(hex);
const num = (v: unknown): number => Number(v);

/** What a list row and a mark need of an identity: its common fields only, and whether it exists. */
interface IdentityCommon { described: boolean; fields: Map<string, Field> }

/** What a mark needs of a contract (bounded): its rejected events and its unresolved sites. */
interface MarkSummary {
  count: number;
  reasons: readonly string[];
  unresolved: { count: number; positions: readonly EventPositionJson[] };
}
const NO_MARK_INPUT: MarkSummary = { count: 0, reasons: [], unresolved: { count: 0, positions: [] } };

const FIELD_COLUMNS = `f.contract_address, f.domain_sep, f.kind::int AS kind, f.key, f.val_type::int AS val_type, f.value,
  f.uint_value::text AS uint_value, f.usable, f.set_height::text AS set_height, f.set_tx::int AS set_tx,
  f.set_event::int AS set_event, f.set_record::int AS set_record`;

/** A field row as served: its value cut to its served length. */
function fieldOf(r: Record<string, unknown>): Field {
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

const COMMON_KEYS = [...Object.values(COMMON_KEY_HEX), ...Object.values(IMAGE_KEY_HEX)].map(bytes);
const SYMBOL_KEY = bytes(COMMON_KEY_HEX.symbol);

const keysParams = (keys: readonly IdKey[]): unknown[] => [
  keys.map((k) => bytes(k.contractAddress)),
  keys.map((k) => bytes(k.domainSep)),
  keys.map((k) => k.kind),
];

/** The common fields (in the order they were last set, as `state.ts` keeps them) and the described flag of each identity. */
async function identityCommons(read: ReadHandle, keys: readonly IdKey[]): Promise<Map<string, IdentityCommon>> {
  const out = new Map<string, IdentityCommon>(keys.map((k) => [keyOf(k), { described: false, fields: new Map() }]));
  if (keys.length === 0) return out;
  const described = await read.query(
    `SELECT i.c, i.d, i.k::int AS k FROM unnest($1::bytea[], $2::bytea[], $3::int[]) AS i(c, d, k)
     WHERE EXISTS (SELECT 1 FROM ${SCHEMA}.fields f
                   WHERE f.contract_address = i.c AND f.domain_sep = i.d AND f.kind = i.k AND f.defined)`,
    keysParams(keys),
  );
  for (const r of described) {
    out.get(keyOf({ contractAddress: toHex(r.c as Uint8Array), domainSep: toHex(r.d as Uint8Array), kind: num(r.k) }))!.described = true;
  }
  const rows = await read.query(
    `SELECT ${FIELD_COLUMNS}
     FROM unnest($1::bytea[], $2::bytea[], $3::int[]) AS i(c, d, k)
     JOIN ${SCHEMA}.fields f ON f.contract_address = i.c AND f.domain_sep = i.d AND f.kind = i.k
      AND f.key = ANY($4::bytea[]) AND f.defined
     ORDER BY f.contract_address, f.domain_sep, f.kind, f.set_height, f.set_tx, f.set_event, f.set_record`,
    [...keysParams(keys), COMMON_KEYS],
  );
  for (const r of rows) {
    const k = { contractAddress: toHex(r.contract_address as Uint8Array), domainSep: toHex(r.domain_sep as Uint8Array), kind: num(r.kind) };
    out.get(keyOf(k))!.fields.set(toHex(r.key as Uint8Array), fieldOf(r));
  }
  return out;
}

/** A contract's mark inputs: rejected events (count, first reasons) and unresolved sites (count, first positions). */
async function markSummary(read: ReadHandle, contract: string): Promise<MarkSummary> {
  const address = bytes(contract);
  const [counts] = await read.query(
    `SELECT count(*) FILTER (WHERE classification = 'reject')::int AS rejected,
            count(*) FILTER (WHERE classification = 'unresolved')::int AS unresolved
     FROM ${SCHEMA}.events WHERE contract_address = $1 AND classification IN ('reject', 'unresolved')`,
    [address],
  );
  const rejected = num(counts?.rejected ?? 0);
  const unresolved = num(counts?.unresolved ?? 0);
  const reasons =
    rejected === 0
      ? []
      : await read.query(
          `SELECT reason FROM ${SCHEMA}.events WHERE contract_address = $1 AND classification = 'reject'
           ORDER BY height, tx_index, event_index LIMIT $2`,
          [address, MAX_MARK_REASONS],
        );
  const positions =
    unresolved === 0
      ? []
      : await read.query(
          `SELECT height::text AS height, tx_index::int AS tx_index, event_index::int AS event_index FROM ${SCHEMA}.events
           WHERE contract_address = $1 AND classification = 'unresolved' ORDER BY height, tx_index, event_index LIMIT $2`,
          [address, MAX_MARK_UNRESOLVED],
        );
  return {
    count: rejected,
    reasons: reasons.map((r) => r.reason as string),
    unresolved: { count: unresolved, positions: positions.map((r) => ({ height: num(r.height), txIndex: num(r.tx_index), eventIndex: num(r.event_index) })) },
  };
}

/** The mark of an identity from its common fields and its contract's mark inputs (`state.ts` `tokenMark`). */
export function markJson(common: IdentityCommon | undefined, summary: MarkSummary): MarkJson {
  const m = tokenMark({
    fields: common?.fields,
    described: common?.described ?? false,
    contractRejections: summary.reasons.slice(0, MAX_MARK_REASONS),
    contractUnresolvedLogs: summary.unresolved.count,
  });
  return {
    mark: m.mark,
    reasons: [...m.reasons],
    reasonCount: summary.count,
    unresolved: { count: summary.unresolved.count, positions: summary.unresolved.positions.slice(0, MAX_MARK_UNRESOLVED).map((p) => ({ ...p })) },
    missing: [...m.missing],
    tags: [...m.tags],
  };
}

/** One keyset page of an identity's defined fields in key byte order, after `afterKey`; `count` counts them all. */
async function identityFieldsPage(read: ReadHandle, ref: IdKey, limit: number, afterKey: string | undefined) {
  const at = "f.contract_address = $1 AND f.domain_sep = $2 AND f.kind = $3 AND f.defined";
  const params = [bytes(ref.contractAddress), bytes(ref.domainSep), ref.kind];
  const rows = await read.query(
    `SELECT ${FIELD_COLUMNS} FROM ${SCHEMA}.fields f WHERE ${at} ${afterKey === undefined ? "" : "AND f.key > $5"}
     ORDER BY f.key LIMIT $4`,
    afterKey === undefined ? [...params, limit + 1] : [...params, limit + 1, bytes(afterKey)],
  );
  const [c] = await read.query(`SELECT count(*)::int AS n FROM ${SCHEMA}.fields f WHERE ${at}`, params);
  return { fields: rows.slice(0, limit).map(fieldOf), more: rows.length > limit, count: num(c?.n ?? 0) };
}

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
 * The symbol group of an identity whose served `symbol` is `symbol` (cut): its member count and first `limit`
 * members by (domainSep, kind), or `undefined` with fewer than two members. The module stores the whole symbol and
 * groups by its cut. A served symbol of fewer than 12 characters is whole, and only a
 * whole symbol equal to it serves it, so the group is the rows with exactly that value: an index-only count and the
 * first `limit` members from `fields_symbol_idx`. A served symbol of 12 characters may be the cut of longer ones, so
 * the rows read are those whose whole symbol starts with it (a range of the same index), kept when their own cut equals
 * it: those reads grow with the rows sharing that prefix.
 */
async function boundedGroup(read: ReadHandle, ref: IdKey, symbol: Uint8Array, limit: number): Promise<GroupJson | undefined> {
  const text = utf8OrNull(symbol);
  const contract = bytes(ref.contractAddress);
  if (text !== null && firstCharacters(text, SYMBOL_CHARACTERS - 1) === text) {
    const at = `contract_address = $1 AND key = $2 AND usable AND defined AND value = $3`;
    const [c] = await read.query(`SELECT count(*)::int AS n FROM ${SCHEMA}.fields WHERE ${at}`, [contract, SYMBOL_KEY, symbol]);
    const memberCount = num(c?.n ?? 0);
    if (memberCount < 2) return undefined;
    const rows = await read.query(
      `SELECT domain_sep, kind::int AS kind FROM ${SCHEMA}.fields WHERE ${at} ORDER BY domain_sep, kind LIMIT $4`,
      [contract, SYMBOL_KEY, symbol, limit],
    );
    return { symbol: bytesJson(symbol), memberCount, members: rows.map((r) => ({ domainSep: toHex(r.domain_sep as Uint8Array), kind: num(r.kind) })) };
  }
  const end = prefixEnd(symbol);
  const rows = await read.query(
    `SELECT domain_sep, kind::int AS kind, value, usable FROM ${SCHEMA}.fields
     WHERE contract_address = $1 AND key = $2 AND usable AND defined AND value >= $3 ${end === null ? "" : "AND value < $4"}
     ORDER BY domain_sep, kind`,
    end === null ? [contract, SYMBOL_KEY, symbol] : [contract, SYMBOL_KEY, symbol, end],
  );
  const [group] = symbolGroups(
    rows
      .map((r) => ({ domainSep: r.domain_sep as Uint8Array, kind: num(r.kind), usable: r.usable === true, value: lengthLimited(COMMON_KEY_HEX.symbol, 1, r.value as Uint8Array) }))
      .filter((r) => toHex(r.value) === toHex(symbol))
      .map((r) => ({
        network: "",
        contractAddress: ref.contractAddress,
        domainSep: toHex(r.domainSep),
        kind: r.kind,
        fields: new Map([[COMMON_KEY_HEX.symbol, { value: r.value, usable: r.usable }]]),
      })),
  );
  if (group === undefined) return undefined;
  return { symbol: bytesJson(symbol), memberCount: group.members.length, members: group.members.slice(0, limit).map((m) => ({ ...m })) };
}

/** The group of an identity from its usable served `symbol`. */
async function groupFor(read: ReadHandle, ref: IdKey, common: IdentityCommon): Promise<GroupJson | null> {
  const symbol = common.fields.get(COMMON_KEY_HEX.symbol);
  if (symbol === undefined || symbol.usable !== true) return null;
  return (await boundedGroup(read, ref, symbol.value, MAX_GROUP_MEMBERS)) ?? null;
}

/** The kinds described for one (contract, domainSep). */
async function describedKinds(read: ReadHandle, contract: string, domainSep: string): Promise<number[]> {
  const rows = await read.query(
    `SELECT k::int AS kind FROM unnest(ARRAY[1, 2, 3]) AS k
     WHERE EXISTS (SELECT 1 FROM ${SCHEMA}.fields WHERE contract_address = $1 AND domain_sep = $2 AND kind = k AND defined)
     ORDER BY k`,
    [bytes(contract), bytes(domainSep)],
  );
  return rows.map((r) => num(r.kind));
}

/** Up to `limit` described identities after `after`, optionally of one contract, by an index skip scan. */
async function identityKeys(read: ReadHandle, o: { contract?: string; after?: [string, string, number]; limit: number }): Promise<IdKey[]> {
  const params: unknown[] = [o.limit];
  const scope = o.contract === undefined ? "" : `AND contract_address = $${params.push(bytes(o.contract))}`;
  const start =
    o.after === undefined
      ? ""
      : `AND (contract_address, domain_sep, kind) > ($${params.push(bytes(o.after[0]))}::bytea, $${params.push(bytes(o.after[1]))}::bytea, $${params.push(o.after[2])}::smallint)`;
  const rows = await read.query(
    `WITH RECURSIVE ids AS (
       (SELECT contract_address, domain_sep, kind FROM ${SCHEMA}.fields
        WHERE defined ${scope} ${start} ORDER BY contract_address, domain_sep, kind LIMIT 1)
       UNION ALL
       SELECT n.contract_address, n.domain_sep, n.kind FROM ids CROSS JOIN LATERAL (
         SELECT contract_address, domain_sep, kind FROM ${SCHEMA}.fields
         WHERE defined ${scope} AND (contract_address, domain_sep, kind) > (ids.contract_address, ids.domain_sep, ids.kind)
         ORDER BY contract_address, domain_sep, kind LIMIT 1) n
     )
     SELECT contract_address, domain_sep, kind::int AS kind FROM ids LIMIT $1`,
    params,
  );
  return rows.map((r) => ({ contractAddress: toHex(r.contract_address as Uint8Array), domainSep: toHex(r.domain_sep as Uint8Array), kind: num(r.kind) }));
}

/** The computed color of a described kind 1 or 2 identity, else `null`. */
const colorOf = (k: IdKey, described: boolean): string | null =>
  described && hasColor(k.kind) ? toHex(tokenColor(bytes(k.domainSep), bytes(k.contractAddress))) : null;

/** The network's name by its genesis hash, else the genesis hash itself. */
async function chain(read: ReadHandle): Promise<{ network: string; genesisHash: string | null; start: number | null }> {
  const [row] = await read.query("SELECT genesis_hash, start_height::text AS start_height FROM core_chain.identity WHERE id = 1");
  if (row === undefined) return { network: "unknown", genesisHash: null, start: null };
  const genesisHash = `0x${toHex(row.genesis_hash as Uint8Array)}`;
  const network = Object.entries(KNOWN_GENESIS).find(([, hash]) => hash === genesisHash)?.[0] ?? genesisHash;
  return { network, genesisHash, start: num(row.start_height) };
}

interface Ctx { read: ReadHandle; network: string; start: number | null }

async function identitySummaries(ctx: Ctx, keys: readonly IdKey[]): Promise<TokenSummaryJson[]> {
  const commons = await identityCommons(ctx.read, keys);
  const marks = new Map<string, MarkSummary>();
  for (const c of new Set(keys.map((k) => k.contractAddress))) marks.set(c, await markSummary(ctx.read, c));
  return keys.map((k) => {
    const identity = commons.get(keyOf(k))!;
    const common = commonJson(identity.fields);
    return {
      id: `identity/${k.contractAddress}/${k.domainSep}/${k.kind}`,
      source: "identity",
      kind: k.kind,
      kindName: KIND_NAMES[k.kind] ?? null,
      color: colorOf(k, identity.described),
      contractAddress: k.contractAddress,
      domainSep: k.domainSep,
      name: common.name,
      symbol: common.symbol,
      decimals: common.decimals,
      described: identity.described,
      minted: null,
      firstSeen: null,
      evidence: [],
      mark: markJson(identity, marks.get(k.contractAddress) ?? NO_MARK_INPUT),
      note: null,
      image: imageJson(identity.fields),
    };
  });
}

/**
 * One identity, or `undefined` when it is not described (a withdrawn identity included: not referenced): one
 * keyset page of fields with `fieldCount`, the common fields, a bounded group and a mark.
 */
export async function identityDetail(
  ctx: Ctx,
  ref: IdKey,
  o: { fieldsLimit?: number; fieldsCursor?: FieldsCursor } = {},
): Promise<IdentityDetailJson | undefined> {
  const identity = (await identityCommons(ctx.read, [ref])).get(keyOf(ref))!;
  if (!identity.described) return undefined;
  const page = await identityFieldsPage(ctx.read, ref, o.fieldsLimit ?? DEFAULT_LIMIT, o.fieldsCursor?.k);
  const last = page.fields.at(-1);
  return {
    network: ctx.network,
    contractAddress: ref.contractAddress,
    domainSep: ref.domainSep,
    kind: ref.kind,
    kindName: KIND_NAMES[ref.kind]!,
    color: colorOf(ref, true),
    minted: null,
    described: true,
    common: commonJson(identity.fields),
    commonFields: [...identity.fields.values()].map(fieldJson),
    fields: page.fields.map(fieldJson),
    fieldCount: page.count,
    fieldsNextCursor:
      page.more && last !== undefined
        ? encodeCursor({ e: "fields", i: [ref.contractAddress, ref.domainSep, ref.kind], k: toHex(last.key) } satisfies FieldsCursor)
        : null,
    group: await groupFor(ctx.read, ref, identity),
    mark: markJson(identity, await markSummary(ctx.read, ref.contractAddress)),
    image: imageJson(identity.fields),
  };
}

// ── NIGHT and DUST (fixed rows) ──────────────────────────────────────────────────────────────────────────

const NIGHT_COLOR = "00".repeat(32);
const BUILTINS: readonly BuiltinJson[] = Object.freeze([
  { symbol: "NIGHT", name: "NIGHT", decimals: "6", color: NIGHT_COLOR, note: "Protocol token (outside MIP-0018): the unshielded native token, color 32 zero bytes." },
  { symbol: "DUST", name: "DUST", decimals: "15", color: null, note: "Protocol token (outside MIP-0018): the fee resource; it has no color." },
]);

const builtinSummary = (b: BuiltinJson): TokenSummaryJson => ({
  id: `builtin/${b.symbol}`,
  source: "builtin",
  kind: null,
  kindName: null,
  color: b.color,
  contractAddress: null,
  domainSep: null,
  name: b.name,
  symbol: b.symbol,
  decimals: b.decimals,
  described: false,
  minted: null,
  firstSeen: null,
  evidence: [],
  mark: null,
  note: b.note,
  image: null,
});

// ── Endpoints ────────────────────────────────────────────────────────────────────────────────────────────────────

/** `GET /v1/tokens`: NIGHT, DUST, then the described identities by (contract, domainSep, kind). */
async function tokensPage(ctx: Ctx, limit: number, cursor: TokensCursor | undefined): Promise<Page<TokenSummaryJson>> {
  const want = limit + 1;
  const rows: Array<{ item: TokenSummaryJson; cursor: TokensCursor }> = [];
  if ((cursor?.s ?? 0) === 0) {
    const start = cursor === undefined ? 0 : BUILTINS.findIndex((b) => b.symbol === cursor.k[0]) + 1;
    for (const b of BUILTINS.slice(start)) if (rows.length < want) rows.push({ item: builtinSummary(b), cursor: { e: "tokens", s: 0, k: [b.symbol] } });
  }
  if (rows.length < want) {
    const keys = await identityKeys(ctx.read, { limit: want - rows.length, ...(cursor?.s === 1 ? { after: cursor.k } : {}) });
    const items = await identitySummaries(ctx, keys);
    items.forEach((item, i) => {
      const k = keys[i]!;
      rows.push({ item, cursor: { e: "tokens", s: 1, k: [k.contractAddress, k.domainSep, k.kind] } });
    });
  }
  const page = rows.slice(0, limit);
  return { items: page.map((r) => r.item), nextCursor: rows.length > limit ? encodeCursor(page.at(-1)!.cursor) : null };
}

/** The (contract, domainSep) of the described kind 1 or 2 identities whose computed color is `color`. */
async function colorEntry(read: ReadHandle, color: string): Promise<{ contractAddress: string; domainSep: string } | undefined> {
  const [row] = await read.query(
    `SELECT contract_address, domain_sep FROM ${SCHEMA}.fields WHERE ${COLOR_SQL} = $1 AND defined AND kind IN (1, 2) LIMIT 1`,
    [bytes(color)],
  );
  return row === undefined ? undefined : { contractAddress: toHex(row.contract_address as Uint8Array), domainSep: toHex(row.domain_sep as Uint8Array) };
}

/** `GET /v1/tokens/{color}`; `undefined` = no described token of this color (404). */
async function tokenByColor(ctx: Ctx, color: string) {
  const builtin = BUILTINS.find((b) => b.color === color);
  if (builtin !== undefined) return { color, builtin, contractAddress: null, domainSep: null, firstSeen: null, evidence: [], identities: [], related: [] };
  const entry = await colorEntry(ctx.read, color);
  if (entry === undefined) return undefined;
  const identities: IdentityDetailJson[] = [];
  for (const kind of [1, 2]) {
    const d = await identityDetail(ctx, { ...entry, kind });
    if (d !== undefined) identities.push(d);
  }
  const shown = new Set(identities.map((d) => d.kind));
  const related = (await describedKinds(ctx.read, entry.contractAddress, entry.domainSep))
    .filter((kind) => !shown.has(kind))
    .map((kind) => ({ ...entry, kind }));
  return { color, builtin: null, ...entry, firstSeen: null, evidence: [], identities, related };
}

/** Whether the module saw the contract: a MIP-0018 event (any classification) or a defined field. */
async function contractKnown(read: ReadHandle, contract: string): Promise<boolean> {
  const [row] = await read.query(
    `SELECT EXISTS (SELECT 1 FROM ${SCHEMA}.events WHERE contract_address = $1)
         OR EXISTS (SELECT 1 FROM ${SCHEMA}.fields WHERE contract_address = $1 AND defined) AS known`,
    [bytes(contract)],
  );
  return row?.known === true;
}

/** `GET /v1/contracts/{address}/tokens`; `undefined` = the module never saw the contract (404). */
async function contractTokens(ctx: Ctx, contract: string, limit: number, cursor: ContractTokensCursor | undefined) {
  if (!(await contractKnown(ctx.read, contract))) return undefined;
  const keys = await identityKeys(ctx.read, { contract, limit: limit + 1, ...(cursor === undefined ? {} : { after: [contract, cursor.k[0], cursor.k[1]] as [string, string, number] }) });
  const page = keys.slice(0, limit);
  const last = page.at(-1);
  const commons = await identityCommons(ctx.read, page);
  const groups = new Map<string, GroupJson>();
  for (const k of page) {
    const symbol = commons.get(keyOf(k))!.fields.get(COMMON_KEY_HEX.symbol);
    if (symbol === undefined || symbol.usable !== true || groups.has(toHex(symbol.value))) continue;
    const g = await groupFor(ctx.read, k, commons.get(keyOf(k))!);
    if (g !== null) groups.set(toHex(symbol.value), g);
  }
  return {
    contractAddress: contract,
    groups: [...groups.values()].sort((a, b) => (a.symbol.hex < b.symbol.hex ? -1 : a.symbol.hex > b.symbol.hex ? 1 : 0)),
    items: await identitySummaries(ctx, page),
    nextCursor:
      keys.length > limit && last !== undefined
        ? encodeCursor({ e: "contract-tokens", c: contract, k: [last.domainSep, last.kind] } satisfies ContractTokensCursor)
        : null,
  };
}

/** `GET /v1/lookup/{color}?held=…` (the held kind's described identity of that computed color). */
async function lookup(ctx: Ctx, color: string, held: "shielded" | "unshielded") {
  const height = ctx.read.height;
  const base = {
    color,
    held,
    builtin: null,
    identity: null,
    seen: null,
    indexedRange: ctx.start === null || height === null ? null : { from: ctx.start, to: Number(height) },
  };
  if (held === "shielded" && color === NIGHT_COLOR) return { ...base, found: false, result: "shielded-zero-color" };
  const builtin = BUILTINS.find((b) => b.color === color);
  if (builtin !== undefined && held === "unshielded") return { ...base, found: true, result: "builtin", builtin };
  const entry = await colorEntry(ctx.read, color);
  const identity = entry === undefined ? undefined : await identityDetail(ctx, { ...entry, kind: held === "shielded" ? 1 : 2 });
  if (identity === undefined) return { ...base, found: false, result: "not-minted-in-indexed-range" };
  return { ...base, found: true, result: "identity", identity };
}

export interface EventJson {
  height: number;
  txIndex: number;
  txHash: string;
  eventIndex: number;
  segment: null;
  phase: null;
  contractAddress: string;
  classification: "accept" | "reject" | "unresolved";
  reason: string | null;
}

/**
 * `GET /v1/events`: the module's events of a contract and/or a transaction, in chain order: position, transaction hash,
 * contract, classification and reason (`events_contract_idx`, `events_tx_idx`).
 */
async function eventsPage(ctx: Ctx, filter: EventFilter, limit: number, cursor: EventsCursor | undefined): Promise<Page<EventJson>> {
  const params: unknown[] = [limit + 1];
  const where: string[] = [];
  if (filter.contract !== undefined) where.push(`contract_address = $${params.push(bytes(filter.contract))}`);
  if (filter.tx !== undefined) where.push(`tx_hash = $${params.push(bytes(filter.tx))}`);
  if (cursor !== undefined) {
    where.push(
      `(height, tx_index, event_index) > ($${params.push(String(cursor.k[0]))}::bigint, $${params.push(cursor.k[1])}::int, $${params.push(cursor.k[2])}::int)`,
    );
  }
  const rows = await ctx.read.query(
    `SELECT height::text AS height, tx_index::int AS tx_index, event_index::int AS event_index, tx_hash, contract_address,
       classification, reason
     FROM ${SCHEMA}.events WHERE ${where.join(" AND ")}
     ORDER BY height, tx_index, event_index LIMIT $1`,
    params,
  );
  const items = rows.slice(0, limit).map(
    (r): EventJson => ({
      height: num(r.height),
      txIndex: num(r.tx_index),
      txHash: toHex(r.tx_hash as Uint8Array),
      eventIndex: num(r.event_index),
      segment: null,
      phase: null,
      contractAddress: toHex(r.contract_address as Uint8Array),
      classification: r.classification as EventJson["classification"],
      reason: (r.reason as string | null) ?? null,
    }),
  );
  const last = items.at(-1);
  return {
    items,
    nextCursor:
      rows.length > limit && last !== undefined
        ? encodeCursor({ e: "events", f: [filter.contract ?? null, filter.tx ?? null], k: [last.height, last.txIndex, last.eventIndex] } satisfies EventsCursor)
        : null,
  };
}

/** `GET /v1/status` (from the process's S and committed height). */
async function status(ctx: Ctx, genesisHash: string | null) {
  const height = ctx.read.height === null ? null : Number(ctx.read.height);
  const [u] = await ctx.read.query(`SELECT count(*)::int AS n FROM ${SCHEMA}.events WHERE classification = 'unresolved'`);
  return {
    network: ctx.network,
    genesisHash,
    startHeight: ctx.start,
    indexedHeight: height,
    archiveHeight: height,
    mip: { ...MIP_PIN },
    reference: { ...MIP_REFERENCE },
    scanner: "following",
    unresolvedEvents: num(u?.n ?? 0),
  };
}

// ── Routes ───────────────────────────────────────────────────────────────────────────────────────────────────────

interface Route {
  readonly path: string;
  readonly params: readonly string[];
  run(ctx: Ctx, p: Record<string, string>, q: Map<string, string>, genesisHash: string | null): Promise<unknown>;
}

const ROUTES: readonly Route[] = [
  { path: "/v1/status", params: [], run: (ctx, _p, _q, genesis) => status(ctx, genesis) },
  {
    path: "/v1/tokens",
    params: ["limit", "cursor"],
    run: (ctx, _p, q) => tokensPage(ctx, limitParam(q.get("limit")), cursorParam(q.get("cursor"), parseTokensCursor)),
  },
  {
    path: "/v1/tokens/:color",
    params: [],
    run: async (ctx, p) => orNotFound(await tokenByColor(ctx, hex32(p.color!, "color")), "no token with this color in the indexed range"),
  },
  {
    path: "/v1/identities/:contract/:domainSep/:kind",
    params: ["limit", "cursor"],
    run: async (ctx, p, q) => {
      const ref = { contractAddress: hex32(p.contract!, "contract"), domainSep: hex32(p.domainSep!, "domainSep"), kind: kindParam(p.kind!) };
      const fieldsLimit = limitParam(q.get("limit"));
      const fieldsCursor = cursorParam(q.get("cursor"), (v) => parseFieldsCursor(v, ref));
      return orNotFound(await identityDetail(ctx, ref, { fieldsLimit, ...(fieldsCursor === undefined ? {} : { fieldsCursor }) }), "no such token identity");
    },
  },
  {
    path: "/v1/contracts/:address/tokens",
    params: ["limit", "cursor"],
    run: async (ctx, p, q) => {
      const address = hex32(p.address!, "address");
      const limit = limitParam(q.get("limit"));
      const cursor = cursorParam(q.get("cursor"), (v) => parseContractTokensCursor(v, address));
      return orNotFound(await contractTokens(ctx, address, limit, cursor), "no such contract in the indexed range");
    },
  },
  {
    path: "/v1/lookup/:color",
    params: ["held"],
    run: (ctx, p, q) => {
      const color = hex32(p.color!, "color");
      const held = q.get("held");
      if (held !== "shielded" && held !== "unshielded") throw badRequest("held must be shielded or unshielded");
      return lookup(ctx, color, held);
    },
  },
  {
    path: "/v1/events",
    params: ["contract", "tx", "limit", "cursor"],
    run: (ctx, _p, q) => {
      const filter: EventFilter = {};
      const contract = q.get("contract");
      const tx = q.get("tx");
      if (contract !== undefined) filter.contract = hex32(contract, "contract");
      if (tx !== undefined) filter.tx = hex32(tx, "tx");
      if (filter.contract === undefined && filter.tx === undefined) throw badRequest("give contract, tx or both");
      return eventsPage(ctx, filter, limitParam(q.get("limit")), cursorParam(q.get("cursor"), (v) => parseEventsCursor(v, filter)));
    },
  },
];

const pathParams = (path: string): string[] => path.split("/").filter((s) => s.startsWith(":")).map((s) => s.slice(1));

/** Registers the API's routes; `maxConcurrent` requests are answered at once, more get 503 `BUSY`. */
export function registerMetadataApi(api: ApiRegistry, maxConcurrent = DEFAULT_MAX_CONCURRENT_REQUESTS): void {
  let inFlight = 0;
  for (const route of ROUTES) {
    const names = pathParams(route.path);
    api.http("GET", route.path, async (req, read) => {
      if (inFlight >= maxConcurrent) {
        return answer(503, { error: { code: "BUSY", message: "too many requests in progress; retry shortly" } }, { "retry-after": "1" });
      }
      inFlight++;
      try {
        return await answerChainData(read, async () => {
          try {
            const query = queryParams(req.params, names, route.params);
            const { network, genesisHash, start } = await chain(read);
            return answer(200, await route.run({ read, network, start }, req.params, query, genesisHash));
          } catch (error) {
            if (error instanceof MetadataApiError) return answer(error.status, { error: { code: error.code, message: error.message } });
            throw error;
          }
        });
      } finally {
        inFlight--;
      }
    });
  }
}
