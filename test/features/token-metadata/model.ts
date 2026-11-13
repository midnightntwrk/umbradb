/**
 * The tests' reference model of MIP-0018 metadata state: pure, in memory, over any number of networks, with
 * reorganization. The module's database path (`src/features/token-metadata/apply.ts`) is held to it by the vector,
 * property and start-height tests. It classifies through the module's own `classify.ts` and applies the module's own
 * rules (`rules.ts`), so the two differ only in where the state lives.
 *
 * - Applying records: accepted events in chain order (block, transaction, event, then record). A non-Null record sets
 *   its field's current value (latest wins; the replaced value is dropped, never a fallback). A Null record deletes its
 *   field; a Null for a field without a value has no effect.
 * - Keys: every key is kept, but only defined keys are served and make an identity exist; an identity without one is
 *   absent from every listing, lookup and group. Dropping a standard from `standards` stops its keys counting.
 * - Reorganization: every classified event is retained per network; `rollbackTo` drops the events above a block and
 *   recomputes that network's state from the rest (UmbraDB itself follows finalized blocks only).
 * - Lengths: `name` and `symbol` values are cut when applied, which serves the same values as the module, which stores
 *   them whole and cuts them where it serves them.
 */

import {
  type Classification,
  type DecodedRecord,
  fromHex,
  type Header,
  toHex,
  ValType,
} from "../../../src/features/token-metadata/codec/index.js";
import { classifyMip0018Event } from "../../../src/features/token-metadata/classify.js";
import {
  COMMON_KEY_HEX,
  type Field,
  fieldUsable,
  type GroupableToken,
  isDefinedKey,
  lengthLimited,
  parseStandards,
  STANDARD_KEYS,
  type StandardKeys,
  symbolGroups as contractSymbolGroups,
} from "../../../src/features/token-metadata/rules.js";

export { fromHex, toHex };
export type { Field };

// ── Applying records ─────────────────────────────────────────────────────────────────────────────────────────────

/** What one record of an accepted event does to its field, in record order. */
export type FieldEffect =
  | {
      op: "set";
      record: number;
      keyHex: string;
      key: Uint8Array;
      valType: number;
      value: Uint8Array;
      /** valType 2 only: the little-endian unsigned integer. */
      integer?: bigint;
      usable?: boolean;
    }
  | { op: "delete"; record: number; keyHex: string; key: Uint8Array };

/** The field effects of an accepted event's records, in order; `name`/`symbol` cut to length. */
export function recordEffects(records: readonly DecodedRecord[]): FieldEffect[] {
  return records.map((r, record) => {
    const keyHex = toHex(r.key);
    if (r.valType === ValType.Null) return { op: "delete", record, keyHex, key: r.key };
    const value = lengthLimited(keyHex, r.valType, r.value);
    const effect: FieldEffect = { op: "set", record, keyHex, key: r.key, valType: r.valType, value };
    if (r.valType === ValType.UInt) effect.integer = r.integer;
    const usable = fieldUsable(keyHex, r.valType, value);
    if (usable !== undefined) effect.usable = usable;
    return effect;
  });
}

/** The standards an identity currently declares: the identifiers of its usable `standards` field (none without one). */
function declaredStandards(fields: ReadonlyMap<string, Pick<Field, "value" | "usable">>): string[] {
  const f = fields.get(COMMON_KEY_HEX.standards);
  return f?.usable === true ? (parseStandards(f.value) ?? []) : [];
}

/** The fields an identity serves: its defined keys only, in their order. */
function servedFields<F extends Pick<Field, "value" | "usable">>(fields: ReadonlyMap<string, F>, standardKeys: StandardKeys): Map<string, F> {
  const declared = standardKeys.size === 0 ? [] : declaredStandards(fields);
  return new Map([...fields].filter(([k]) => isDefinedKey(k, declared, standardKeys)));
}

// ── Display ──────────────────────────────────────────────────────────────────────────────────────────────────────

/** Above this many decimals an amount is shown in exact scientific form instead of a fixed-point string. */
const MAX_FIXED_POINT_DECIMALS = 1000n;

/**
 * Displays a raw amount with `decimals` (123456 with 2 decimals is "1234.56"). Exact (bigint); every fraction digit is
 * kept. Above {@link MAX_FIXED_POINT_DECIMALS} the exact form `<raw>e-<decimals>` is returned, so rendering stays
 * bounded.
 */
export function formatAmount(raw: bigint, decimals: bigint): string {
  if (raw < 0n || decimals < 0n) throw new RangeError("amounts and decimals are unsigned");
  if (decimals === 0n) return raw.toString();
  if (decimals > MAX_FIXED_POINT_DECIMALS) return `${raw.toString()}e-${decimals.toString()}`;
  const d = Number(decimals);
  const digits = raw.toString().padStart(d + 1, "0");
  return `${digits.slice(0, digits.length - d)}.${digits.slice(digits.length - d)}`;
}

/** `raw` shown with the identity's usable `decimals`; `undefined` without one (no default such as 0 or 18). */
export function displayAmount(
  fields: ReadonlyMap<string, Pick<Field, "usable" | "integer">> | undefined,
  raw: bigint,
): { decimals: bigint; text: string } | undefined {
  const d = fields?.get(COMMON_KEY_HEX.decimals);
  if (d === undefined || d.usable !== true || d.integer === undefined) return undefined;
  return { decimals: d.integer, text: formatAmount(raw, d.integer) };
}

// ── The model ────────────────────────────────────────────────────────────────────────────────────────────────────

/** Position of an event on its network: block, transaction within the block, event within the transaction. */
export interface ChainPosition {
  block: number;
  tx: number;
  event: number;
}

function comparePosition(a: ChainPosition, b: ChainPosition): number {
  return a.block - b.block || a.tx - b.tx || a.event - b.event;
}

/** An observed `Misc`-or-other event, bound to its contract by the event record (never by the payload). */
export interface ObservedEvent {
  network: string;
  position: ChainPosition;
  /** 32-byte contract address, hex. */
  contractAddress: string;
  type: string;
  name: Uint8Array;
  payload: Uint8Array;
}

export interface IdentityRef {
  network: string;
  /** hex, lowercase */
  contractAddress: string;
  /** hex, lowercase */
  domainSep: string;
  kind: number;
}

export interface IdentityState extends IdentityRef {
  /** Fields by key hex; never empty (an identity without fields does not exist). */
  fields: ReadonlyMap<string, Field>;
}

/** A symbol group on a network. */
export interface SymbolGroup {
  network: string;
  contractAddress: string;
  /** The exact `symbol` bytes, hex. */
  symbol: string;
  /** Sorted by (domainSep, kind); always two or more. */
  members: Array<{ domainSep: string; kind: number }>;
}

export interface Rejection {
  position: ChainPosition;
  reason: string;
}

/** Thrown when an event does not come after the previous one on its network (chain order is the caller's duty). */
export class ChainOrderError extends Error {
  override name = "ChainOrderError";
}

/** The module's symbol groups (`rules.ts`), on each network of `identities`, ordered by network. */
export function symbolGroups(identities: readonly (IdentityRef & GroupableToken)[]): SymbolGroup[] {
  const networks = [...new Set(identities.map((i) => i.network))].sort();
  return networks.flatMap((network) =>
    contractSymbolGroups(identities.filter((i) => i.network === network)).map((g) => ({ network, ...g })),
  );
}

interface Retained {
  event: ObservedEvent;
  classification: Exclude<Classification, { result: "ignore" }>;
}

const identityKey = (r: IdentityRef): string => JSON.stringify([r.network, r.contractAddress, r.domainSep, r.kind]);
/** Code-unit order (locale-independent, deterministic). */
const byString = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/** In-memory MIP-0018 metadata state over any number of networks. Pure: no database, no clock, no I/O. */
export class MetadataState {
  /** Every stored field per identity — defined and undefined keys alike (an identity is kept while it stores any). */
  private readonly identitiesByKey = new Map<string, { ref: IdentityRef; fields: Map<string, Field> }>();
  private readonly retained = new Map<string, Retained[]>();
  private readonly last = new Map<string, ChainPosition>();

  private readonly standardKeys: StandardKeys;

  /** `standardKeys`: the keys standards define (default: the module's, which is empty; tests pass synthetic ones). */
  constructor(standardKeys: StandardKeys = STANDARD_KEYS) {
    this.standardKeys = standardKeys;
  }

  /** Classifies an event and, when accepted, applies its records. */
  apply(event: ObservedEvent): Classification {
    const previous = this.last.get(event.network);
    if (previous !== undefined && comparePosition(event.position, previous) <= 0)
      throw new ChainOrderError(`event at ${JSON.stringify(event.position)} does not follow ${JSON.stringify(previous)} on ${event.network}`);
    this.last.set(event.network, { ...event.position });
    const classification = classifyMip0018Event({ type: event.type, name: event.name, payload: event.payload });
    if (classification.result === "ignore") return classification;
    const list = this.retained.get(event.network) ?? [];
    list.push({ event, classification });
    this.retained.set(event.network, list);
    if (classification.result === "accept") this.applyAccepted(event, classification.header, classification.records);
    return classification;
  }

  /**
   * Removes every block above `toBlock` on `network` and recomputes that network's state from the events that remain.
   * The next event on the network must be above `toBlock`.
   */
  rollbackTo(network: string, toBlock: number): void {
    const kept = (this.retained.get(network) ?? []).filter((r) => r.event.position.block <= toBlock);
    this.retained.set(network, kept);
    for (const [k, v] of this.identitiesByKey) if (v.ref.network === network) this.identitiesByKey.delete(k);
    for (const r of kept)
      if (r.classification.result === "accept") this.applyAccepted(r.event, r.classification.header, r.classification.records);
    this.last.set(network, { block: toBlock, tx: Number.MAX_SAFE_INTEGER, event: Number.MAX_SAFE_INTEGER });
  }

  private applyAccepted(event: ObservedEvent, header: Header, records: readonly DecodedRecord[]): void {
    const ref: IdentityRef = {
      network: event.network,
      contractAddress: event.contractAddress.toLowerCase(),
      domainSep: toHex(header.domainSep),
      kind: header.kind,
    };
    const k = identityKey(ref);
    const fields = this.identitiesByKey.get(k)?.fields ?? new Map<string, Field>();
    for (const e of recordEffects(records)) {
      if (e.op === "delete") {
        fields.delete(e.keyHex); // a Null for a key without a value changes nothing
        continue;
      }
      const f: Field = { key: e.key, valType: e.valType, value: e.value, position: { ...event.position, record: e.record } };
      if (e.integer !== undefined) f.integer = e.integer;
      if (e.usable !== undefined) f.usable = e.usable;
      fields.delete(e.keyHex); // keep insertion order = order of the current values
      fields.set(e.keyHex, f);
    }
    if (fields.size === 0) this.identitiesByKey.delete(k);
    else this.identitiesByKey.set(k, { ref, fields });
  }

  /**
   * Every identity that exists — at least one defined key has a value — sorted by (network, contract, domainSep, kind),
   * with its served (defined) fields only. Each `fields` is a snapshot.
   */
  identities(): IdentityState[] {
    return [...this.identitiesByKey.values()]
      .map(({ ref, fields }) => ({ ...ref, fields: servedFields(fields, this.standardKeys) }))
      .filter((id) => id.fields.size > 0)
      .sort((a, b) => byString(identityKey(a), identityKey(b)));
  }

  /** One identity with its served fields (a snapshot), or `undefined` when no defined key has a value. */
  identity(ref: IdentityRef): IdentityState | undefined {
    const v = this.stored(ref);
    if (v === undefined) return undefined;
    const fields = servedFields(v.fields, this.standardKeys);
    return fields.size === 0 ? undefined : { ...v.ref, fields };
  }

  /** Every field an identity stores, undefined keys included (a snapshot), or `undefined` when it stores none. */
  storedFields(ref: IdentityRef): ReadonlyMap<string, Field> | undefined {
    const v = this.stored(ref);
    return v === undefined ? undefined : new Map(v.fields);
  }

  private stored(ref: IdentityRef): { ref: IdentityRef; fields: Map<string, Field> } | undefined {
    return this.identitiesByKey.get(identityKey({ ...ref, contractAddress: ref.contractAddress.toLowerCase(), domainSep: ref.domainSep.toLowerCase() }));
  }

  /** Symbol groups of two or more members. */
  groups(): SymbolGroup[] {
    return symbolGroups(this.identities());
  }

  /** Rejected MIP-0018 events of a contract on a network, in chain order (for the mark). */
  rejections(network: string, contractAddress: string): Rejection[] {
    const contract = contractAddress.toLowerCase();
    return (this.retained.get(network) ?? [])
      .filter((r) => r.classification.result === "reject" && r.event.contractAddress.toLowerCase() === contract)
      .map((r) => ({ position: r.event.position, reason: (r.classification as { reason: string }).reason }));
  }

  /**
   * Whether the contract has any accepted or rejected MIP-0018 event on the network. Never an input to a mark or a
   * listing: it stays `true` after every identity of the contract was withdrawn.
   */
  hasEvents(network: string, contractAddress: string): boolean {
    const contract = contractAddress.toLowerCase();
    return (this.retained.get(network) ?? []).some((r) => r.event.contractAddress.toLowerCase() === contract);
  }

  /** `raw` displayed with the identity's usable `decimals`; `undefined` when there is none. */
  display(ref: IdentityRef, raw: bigint): { decimals: bigint; text: string } | undefined {
    return displayAmount(this.identity(ref)?.fields, raw);
  }
}
