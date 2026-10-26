/**
 * What the v8 and v9 adapters share (`openspec/changes/core-arch/design.md` §5.1; `specs/ledger/spec.md` LG-6–LG-8,
 * LG-15, LG-16; task 12.1): one implementation of {@link LedgerPackage} over a vendored ledger package's published API
 * and the node-store exports its patches add (`vendor/ledger/README.md`), refactored from 0.9.5's replay decoder
 * (`chain-archive-sync/tx-replay-decoder.ts`: a transaction's kind from its self-tag, the deserialization with its
 * markers, the walk over its intents by segment). `./v8.ts` and `./v9.ts` give it their package and what differs:
 * contract logs (owner decision Q54) and the v8 → v9 conversion (LG-9).
 *
 * **Parsing (LG-7).** A transaction is parsed at most once per `Uint8Array`: the native object is kept in a `WeakMap`
 * under the very array it came from, and `parseTransaction`, `nativeTransaction` and `apply` all take it from there.
 * The markers `Transaction.deserialize` needs are read from the transaction's own tag
 * (`midnight:transaction[vN](S,P,B):`), so a proven chain transaction and a proof-erased test transaction parse alike;
 * the package checks the tag's version. A transaction's hash is SHA-256 over the package's own serialization of it,
 * the ledger's definition for both kinds (`midnight-ledger` `ledger/src/structure.rs` `Transaction::transaction_hash`,
 * `SystemTransaction::transaction_hash`); the package's `transactionHash()` exists only for proven, bound transactions
 * and agrees (`test/ledger/adapter-suite.ts`).
 *
 * **Applying a block (LG-8), as the official indexer does** (`midnight-indexer`
 * `chain-indexer/src/domain/ledger_state.rs` `apply_transactions`; `indexer-common/src/domain/ledger/ledger_state.rs`
 * `apply_regular_transaction`,
 * `apply_system_transaction`, `finalize_apply_transactions`) and the node (`midnight-node`
 * `ledger/src/ledger_8/api/ledger.rs` `apply_verified_transaction`, `post_block_update`):
 * - a system transaction is applied at the block time; one that fails cannot be replayed, so `apply` throws;
 * - a regular transaction must be well formed at the block time, or, while no regular transaction of the block has
 *   applied and `firstRegularAtParentTime` is set, at the parent block's timestamp + 12,000 ms; well-formedness checks
 *   no proof (LG-15) and does not enforce balancing (as the official indexer), but checks signatures and limits;
 * - a malformed transaction, one whose cost cannot be computed, and one the ledger fails are a `failure` whose
 *   segments all failed: the node's extrinsic fails and the state stays as it was, so nothing of it is kept and its
 *   cost is not counted;
 * - every other one is applied at the block time with the block's context (`tblock_err` 30 s, the parent's hash and
 *   time) and adds its stateless cost to the block's fullness;
 * - after the last, the post-block update runs with that fullness normalized to the block limits and its largest
 *   dimension — explicitly zero for a block that applied nothing, never the package's default of one half.
 * The published API takes the normalized fullness as JavaScript numbers and has no system-transaction cost, so a
 * block with transactions may not reach the node's state root this way (question Q113, for task 12.3's A99).
 *
 * **Results and events (LG-16).** A success lists segment 0 and every fallible segment (the intents' and fallible
 * offers' segments, `ledger/src/structure.rs` `fallible_segments`) as successful; a partial success gives the
 * ledger's per-segment outcome — the package's `successfulSegments` maps a segment to `true` when it **failed**
 * (`ledger-wasm/src/tx.rs`: `v.is_err()`), which this adapter inverts; a system transaction has no segments. Each
 * ledger event other than a contract log becomes a {@link LedgerEvent}; contract logs become {@link VmLog}s, numbered
 * in emission order, where the version decodes them (v9), and are dropped where it does not (v8, Q54).
 */

import { createHash } from "node:crypto";
import type { LedgerRelease } from "./releases.js";
import type {
  AppliedBlock,
  ApplyInput,
  LedgerEvent,
  LedgerEventKind,
  LedgerName,
  LedgerPackage,
  LogEventType,
  LogItem,
  NodeBatch,
  NodeStore,
  ParsedTransaction,
  StateHandle,
  TransactionResult,
  VmLog,
} from "./types.js";

/** A resource cost in the ledger's dimensions (`SyntheticCost`). */
export interface SyntheticCost {
  readTime: bigint;
  computeTime: bigint;
  blockUsage: bigint;
  bytesWritten: bigint;
  bytesChurned: bigint;
}

/** A cost as a fraction of the block limits (`NormalizedCost`). */
export interface NormalizedCost {
  readTime: number;
  computeTime: number;
  blockUsage: number;
  bytesWritten: number;
  bytesChurned: number;
}

export interface RawParameters {
  normalizeFullness(fullness: SyntheticCost): NormalizedCost;
  serialize(): Uint8Array;
}

export interface RawEvent {
  readonly source: { readonly logicalSegment: number; readonly physicalSegment: number };
  readonly content: { readonly tag: string };
  serialize(): Uint8Array;
  toString(compact?: boolean): string;
}

export interface RawTransactionResult {
  readonly type: "success" | "partialSuccess" | "failure";
  readonly successfulSegments?: Map<number, boolean>;
  readonly events: RawEvent[];
}

export interface RawState {
  apply(transaction: object, context: object): [RawState, RawTransactionResult];
  applySystemTx(transaction: object, tblock: Date): [RawState, RawEvent[]];
  postBlockUpdate(tblock: Date, detailedBlockFullness?: NormalizedCost, overallBlockFullness?: number): RawState;
  readonly parameters: RawParameters;
}

export interface RawIntent {
  readonly actions: object[];
}

export interface RawTransaction {
  wellFormed(state: RawState, strictness: object, tblock: Date): object;
  cost(params: RawParameters, enforceTimeToDismiss?: boolean): SyntheticCost;
  serialize(): Uint8Array;
  readonly intents: Map<number, RawIntent> | undefined;
  readonly fallibleOffer: Map<number, unknown> | undefined;
}

export interface RawSystemTransaction {
  serialize(): Uint8Array;
}

export interface RawStrictness {
  enforceBalancing: boolean;
  verifyNativeProofs: boolean;
  verifyContractProofs: boolean;
}

export interface RawBlockContext {
  secondsSinceEpoch: bigint;
  secondsSinceEpochErr: number;
  parentBlockHash: string;
  lastBlockTime: bigint;
}

/** What the adapters use of a vendored ledger package: the members both versions have, structurally. */
export interface RawLedgerPackage {
  readonly LedgerState: { blank(networkId: string): RawState; deserialize(bytes: Uint8Array): RawState };
  readonly Transaction: {
    deserialize(markerS: Signature, markerP: Proof, markerB: Binding, bytes: Uint8Array): RawTransaction;
  };
  readonly SystemTransaction: { deserialize(bytes: Uint8Array): RawSystemTransaction };
  /** Its state parameter is the package's own class, which a construct signature cannot take structurally. */
  readonly TransactionContext: new (state: never, block: RawBlockContext) => object;
  readonly WellFormedStrictness: new () => RawStrictness;
  readonly ContractCall: Function;
  readonly ContractDeploy: Function;
  loadState(stateKey: Uint8Array, store: NodeStore): RawState;
  stateRoot(state: RawState): Uint8Array;
  stateKey(state: RawState): Uint8Array;
  flushNodes(): NodeBatch;
  persistKey(key: Uint8Array): void;
  releaseKey(key: Uint8Array): void;
  childRefs(children: Uint8Array): Uint8Array[];
  evictKeys(keys: Uint8Array[]): void;
  contractStateKey(state: RawState, address: Uint8Array): Uint8Array | null;
  contractZswapStateKey(state: RawState, address: Uint8Array): Uint8Array | null;
}

/** A contract log event's logged item as the package gives it (`loggedItem`), ledger v9. */
export interface RawLoggedItem {
  readonly version: number;
  readonly eventType: string;
  readonly data: unknown;
}

/** What a ledger version adds to the shared implementation. */
export interface AdapterSpec {
  readonly ledger: LedgerName;
  readonly release: LedgerRelease;
  readonly raw: RawLedgerPackage;
  readonly networkId: string;
  readonly decodeLogItem: (value: Uint8Array) => LogItem | null;
  /** The tagged serialization of a logged item's value; null where contract logs are not reported (v8, Q54). */
  readonly loggedValue: ((data: unknown) => Uint8Array) | null;
  readonly convertFromV8?: (v8StateKey: Uint8Array, store: NodeStore) => RawState;
}

type Signature = "signature" | "signature-erased";
type Proof = "proof" | "pre-proof" | "no-proof";
type Binding = "binding" | "pre-binding" | "no-binding";

type Native =
  | { readonly kind: "regular"; readonly transaction: RawTransaction }
  | { readonly kind: "system"; readonly transaction: RawSystemTransaction };

/** The parent block's timestamp + this: the second time a skewed first regular transaction is checked at (LG-8). */
export const PARENT_TIME_BUMP_MS = 12_000n;

/** `tblock_err`, the error on the block time a transaction context allows, in seconds (the official indexer's). */
export const BLOCK_TIME_ERROR_SECONDS = 30;

const NO_COST: SyntheticCost = { readTime: 0n, computeTime: 0n, blockUsage: 0n, bytesWritten: 0n, bytesChurned: 0n };

const LOG_EVENT_TYPES: Readonly<Record<string, LogEventType>> = {
  "shielded-spend": "ShieldedSpend",
  "shielded-receive": "ShieldedReceive",
  "shielded-mint": "ShieldedMint",
  "shielded-burn": "ShieldedBurn",
  "unshielded-spend": "UnshieldedSpend",
  "unshielded-receive": "UnshieldedReceive",
  "unshielded-mint": "UnshieldedMint",
  "unshielded-burn": "UnshieldedBurn",
  paused: "Paused",
  unpaused: "Unpaused",
  misc: "Misc",
};

export type EventKind = LedgerEventKind | "contract-log";

/** The kinds of the events the package's JavaScript API describes, by the tag of their `content`. */
const KIND_BY_TAG: Readonly<Record<string, EventKind>> = {
  zswapInput: "zswap-input",
  zswapOutput: "zswap-output",
  contractLog: "contract-log",
  dustInitialUtxo: "dust-initial-utxo",
  dustGenerationDtimeUpdate: "dust-generation-dtime-update",
  dustSpendProcessed: "dust-spend-processed",
};

/**
 * The kinds of the others (`notYetSupportedEventType`), by the variant of `EventDetails` the event's own `Debug`
 * rendering names (`ledger/src/events.rs`).
 */
const KIND_BY_VARIANT: Readonly<Record<string, EventKind>> = {
  ZswapInput: "zswap-input",
  ZswapOutput: "zswap-output",
  ContractDeploy: "contract-deploy",
  ContractLog: "contract-log",
  ParamChange: "param-change",
  DustInitialUtxo: "dust-initial-utxo",
  DustGenerationDtimeUpdate: "dust-generation-dtime-update",
  DustSpendProcessed: "dust-spend-processed",
};

const hexText = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const bytesOf = (hex: string): Uint8Array => Uint8Array.from(Buffer.from(hex, "hex"));
const sha256 = (bytes: Uint8Array): Uint8Array => Uint8Array.from(createHash("sha256").update(bytes).digest());

/** A name, or bytes the package gives as a string when they are UTF-8 (`maybe_string`), as bytes. */
function nameBytes(name: Uint8Array | string): Uint8Array {
  return typeof name === "string" ? Uint8Array.from(Buffer.from(name, "utf8")) : Uint8Array.from(name);
}

/** A field element as the ledger serializes it: 32 bytes, little-endian. */
export function fieldBytes(value: bigint): Uint8Array {
  const bytes = new Uint8Array(32);
  let rest = value;
  for (let i = 0; i < 32; i++) {
    bytes[i] = Number(rest & 0xffn);
    rest >>= 8n;
  }
  // A negative value never shifts down to 0, so this refuses it too.
  if (rest !== 0n) throw new RangeError(`not a field element: ${value}`);
  return bytes;
}

/** Frees a package object's WebAssembly memory now (wasm-bindgen's `free`, which the packages' declarations omit). */
function free(object: unknown): void {
  (object as { free(): void }).free();
}

/**
 * The tag a ledger serialization starts with (`midnight:<tag>:`), or null. Refactored from 0.9.5's
 * `isSystemTransaction` / `isStandardTransaction`, which compared the same prefix.
 */
function tagOf(bytes: Uint8Array): string | null {
  const head = Buffer.from(bytes.subarray(0, 192)).toString("latin1");
  if (!head.startsWith("midnight:")) return null;
  const end = head.indexOf(":", "midnight:".length);
  return end < 0 ? null : head.slice("midnight:".length, end);
}

/**
 * The deserialization markers a transaction's tag names, e.g.
 * `transaction[v9](signature[v1],proof,pedersen-schnorr[v1])` for a proven, bound transaction, `(…,(),pedersen[v1])`
 * for a proof-erased one.
 */
function markersOf(tag: string): [Signature, Proof, Binding] | null {
  const match = /^transaction\[v[0-9]+\]\(([^,]*),([^,]*),([^,]*)\)$/.exec(tag);
  if (match === null) return null;
  const [, s, p, b] = match as unknown as [string, string, string, string];
  const signature: Signature | null = s.startsWith("signature[") ? "signature" : s === "()" ? "signature-erased" : null;
  const proof: Proof | null =
    p === "proof" ? "proof" : p === "proof-preimage" ? "pre-proof" : p === "()" ? "no-proof" : null;
  const binding: Binding | null = b.startsWith("pedersen-schnorr[")
    ? "binding"
    : b.startsWith("embedded-fr[")
      ? "pre-binding"
      : b.startsWith("pedersen[")
        ? "no-binding"
        : null;
  return signature === null || proof === null || binding === null ? null : [signature, proof, binding];
}

/** The fallible segments of a regular transaction, ascending: its intents' and fallible offers' segments but 0. */
function fallibleSegments(transaction: RawTransaction): number[] {
  const segments = new Set<number>([
    ...(transaction.intents?.keys() ?? []),
    ...(transaction.fallibleOffer?.keys() ?? []),
  ]);
  segments.delete(0);
  return [...segments].sort((a, b) => a - b);
}

/** An event's kind: by its content's tag where the package describes it, else by its `Debug` variant. */
export function eventKindOf(event: RawEvent): EventKind {
  const byTag = KIND_BY_TAG[event.content.tag];
  if (byTag !== undefined) return byTag;
  const variant = /content: ([A-Za-z]+)/.exec(event.toString(true))?.[1];
  const byVariant = variant === undefined ? undefined : KIND_BY_VARIANT[variant];
  if (byVariant === undefined) {
    throw new Error(`a ledger event of a kind this adapter does not know: ${variant ?? event.content.tag}`);
  }
  return byVariant;
}

/** A ledger event other than a contract log, with LG-16's extracted fields. */
export function ledgerEventOf(event: RawEvent, kind: LedgerEventKind, transaction: number): LedgerEvent {
  const content = event.content as Record<string, unknown>;
  const optionalAddress = (value: unknown): Uint8Array | null => (typeof value === "string" ? bytesOf(value) : null);
  const extracted: Pick<LedgerEvent, "nullifier" | "commitment" | "treeIndex" | "contractAddress"> = {
    nullifier: null,
    commitment: null,
    treeIndex: null,
    contractAddress: null,
  };
  switch (kind) {
    case "zswap-input":
      extracted.nullifier = bytesOf(content.nullifier as string);
      extracted.contractAddress = optionalAddress(content.contract);
      break;
    case "zswap-output":
      extracted.commitment = bytesOf(content.commitment as string);
      extracted.treeIndex = BigInt(content.mtIndex as bigint);
      extracted.contractAddress = optionalAddress(content.contract);
      break;
    case "dust-initial-utxo":
      extracted.treeIndex = BigInt(content.generationIndex as bigint);
      break;
    case "dust-spend-processed":
      extracted.nullifier = fieldBytes(BigInt(content.nullifier as bigint));
      extracted.commitment = fieldBytes(BigInt(content.commitment as bigint));
      extracted.treeIndex = BigInt(content.commitmentIndex as bigint);
      break;
    case "contract-deploy": {
      const rendered = event.toString(true);
      const address = /content: ContractDeploy \{ address: ContractAddress\(([0-9a-f]{64})\)/.exec(rendered)?.[1];
      if (address === undefined) throw new Error("a contract deploy event without its address");
      extracted.contractAddress = bytesOf(address);
      break;
    }
    case "param-change":
    case "dust-generation-dtime-update":
      break;
  }
  return {
    transaction,
    kind,
    logicalSegment: event.source.logicalSegment,
    physicalSegment: event.source.physicalSegment,
    bytes: event.serialize(),
    ...extracted,
  };
}

/** A contract log event as a {@link VmLog}; `loggedValue` serializes its value. */
export function vmLogOf(
  event: RawEvent,
  transaction: number,
  index: number,
  loggedValue: (data: unknown) => Uint8Array,
): VmLog {
  const content = event.content as unknown as {
    address: string;
    entryPoint: Uint8Array | string;
    loggedItem: RawLoggedItem;
  };
  const eventType = LOG_EVENT_TYPES[content.loggedItem.eventType];
  if (eventType === undefined) {
    throw new Error(`a contract log of an event type this adapter does not know: ${content.loggedItem.eventType}`);
  }
  return {
    version: content.loggedItem.version,
    eventType,
    data: loggedValue(content.loggedItem.data),
    transaction,
    index,
    address: bytesOf(content.address),
    entryPoint: nameBytes(content.entryPoint),
    logicalSegment: event.source.logicalSegment,
    physicalSegment: event.source.physicalSegment,
  };
}

function add(a: SyntheticCost, b: SyntheticCost): SyntheticCost {
  return {
    readTime: a.readTime + b.readTime,
    computeTime: a.computeTime + b.computeTime,
    blockUsage: a.blockUsage + b.blockUsage,
    bytesWritten: a.bytesWritten + b.bytesWritten,
    bytesChurned: a.bytesChurned + b.bytesChurned,
  };
}

const asRaw = (state: StateHandle): RawState => state as unknown as RawState;
const asHandle = (state: RawState): StateHandle => state as unknown as StateHandle;

/** The adapter of one ledger version (see the header). */
export function createLedgerAdapter(spec: AdapterSpec): LedgerPackage {
  const { raw } = spec;
  const natives = new WeakMap<Uint8Array, Native>();
  const packages = Object.freeze({ [spec.release.packages[0]!.name]: raw as unknown });

  function nativeOf(bytes: Uint8Array): Native {
    const known = natives.get(bytes);
    if (known !== undefined) return known;
    const tag = tagOf(bytes);
    let native: Native;
    if (tag !== null && /^system-transaction\[v[0-9]+\]$/.test(tag)) {
      native = { kind: "system", transaction: raw.SystemTransaction.deserialize(bytes) };
    } else {
      const markers = tag === null ? null : markersOf(tag);
      if (markers === null) {
        throw new Error(`ledger ${spec.ledger}: not a transaction this adapter reads (tag ${JSON.stringify(tag)})`);
      }
      native = { kind: "regular", transaction: raw.Transaction.deserialize(...markers, bytes) };
    }
    natives.set(bytes, native);
    return native;
  }

  function segmentsOf(transaction: RawTransaction): ParsedTransaction["segments"] {
    const intents = [...(transaction.intents ?? new Map<number, RawIntent>())].sort(([a], [b]) => a - b);
    return intents.map(([segment, intent]) => ({
      segment,
      calls: intent.actions
        .filter((action) => action instanceof raw.ContractCall)
        .map((action) => {
          const call = action as { address: string; entryPoint: Uint8Array | string };
          return { address: bytesOf(call.address), entryPoint: nameBytes(call.entryPoint) };
        }),
      deploys: intent.actions
        .filter((action) => action instanceof raw.ContractDeploy)
        .map((action) => ({ address: bytesOf((action as { address: string }).address) })),
    }));
  }

  function apply(handle: StateHandle, input: ApplyInput): AppliedBlock {
    const strictness = new raw.WellFormedStrictness();
    strictness.enforceBalancing = false;
    strictness.verifyNativeProofs = false;
    strictness.verifyContractProofs = false;
    const blockTime = new Date(Number(input.timestampMs));
    const parentTime = new Date(Number(input.parentTimestampMs + PARENT_TIME_BUMP_MS));
    const context: RawBlockContext = {
      secondsSinceEpoch: input.timestampMs / 1000n,
      secondsSinceEpochErr: BLOCK_TIME_ERROR_SECONDS,
      parentBlockHash: hexText(input.parentHash),
      lastBlockTime: input.parentTimestampMs / 1000n,
    };
    const results: TransactionResult[] = [];
    const events: LedgerEvent[] = [];
    const logs: VmLog[] = [];
    // The states this call makes; all but the one it returns are freed.
    const made: RawState[] = [];
    let state = asRaw(handle);
    let fullness = NO_COST;
    let regularApplied = false;

    const collect = (emitted: RawEvent[], transaction: number): void => {
      for (const event of emitted) {
        const kind = eventKindOf(event);
        if (kind !== "contract-log") events.push(ledgerEventOf(event, kind, transaction));
        else if (spec.loggedValue !== null) logs.push(vmLogOf(event, transaction, logs.length, spec.loggedValue));
        free(event);
      }
    };
    const wellFormedAt = (transaction: RawTransaction, time: Date): object | null => {
      try {
        return transaction.wellFormed(state, strictness, time);
      } catch {
        return null;
      }
    };

    try {
      input.transactions.forEach((bytes, index) => {
        const native = nativeOf(bytes);
        if (native.kind === "system") {
          let applied: [RawState, RawEvent[]];
          try {
            applied = state.applySystemTx(native.transaction, blockTime);
          } catch (error) {
            throw new Error(`ledger ${spec.ledger}: system transaction ${index} of block ${input.height} failed`, {
              cause: error,
            });
          }
          made.push(applied[0]);
          state = applied[0];
          results.push({ outcome: "success", segments: [] });
          collect(applied[1], index);
          return;
        }
        const transaction = native.transaction;
        const segments = [0, ...fallibleSegments(transaction)];
        const failure: TransactionResult = {
          outcome: "failure",
          segments: segments.map((segment) => ({ segment, success: false })),
        };
        const verified =
          wellFormedAt(transaction, blockTime) ??
          (input.firstRegularAtParentTime && !regularApplied ? wellFormedAt(transaction, parentTime) : null);
        if (verified === null) {
          results.push(failure);
          return;
        }
        const parameters = state.parameters;
        let cost: SyntheticCost;
        try {
          cost = transaction.cost(parameters, true);
        } catch {
          free(parameters);
          free(verified);
          results.push(failure);
          return;
        }
        free(parameters);
        const transactionContext = new raw.TransactionContext(state as never, context);
        const [next, result] = state.apply(verified, transactionContext);
        free(verified);
        free(transactionContext);
        if (result.type === "failure") {
          free(next);
          free(result);
          results.push(failure);
          return;
        }
        made.push(next);
        state = next;
        regularApplied = true;
        fullness = add(fullness, cost);
        if (result.type === "success") {
          results.push({ outcome: "success", segments: segments.map((segment) => ({ segment, success: true })) });
        } else {
          // `successfulSegments` is true for the segments that failed (`ledger-wasm/src/tx.rs`: `v.is_err()`; issue
          // 00018-wasm-successful-segments-are-failed-segments).
          const failed = [...result.successfulSegments!].sort(([a], [b]) => a - b);
          results.push({
            outcome: "partial",
            segments: failed.map(([segment, isFailed]) => ({ segment, success: !isFailed })),
          });
        }
        collect(result.events, index);
        free(result);
      });

      const parameters = state.parameters;
      let normalized: NormalizedCost;
      try {
        normalized = parameters.normalizeFullness(fullness);
      } catch (error) {
        throw new Error(`ledger ${spec.ledger}: block ${input.height}'s fullness exceeds the block limits`, {
          cause: error,
        });
      } finally {
        free(parameters);
      }
      const overall = Math.max(
        normalized.readTime,
        normalized.computeTime,
        normalized.blockUsage,
        normalized.bytesWritten,
        normalized.bytesChurned,
      );
      const after = state.postBlockUpdate(blockTime, normalized, overall);
      const afterParameters = after.parameters;
      const serialized = afterParameters.serialize();
      free(afterParameters);
      return { state: asHandle(after), output: { results, events, logs, parameters: serialized } };
    } finally {
      for (const intermediate of made) free(intermediate);
      free(strictness);
    }
  }

  const adapter: LedgerPackage = {
    ledger: spec.ledger,
    versionName: spec.release.versionName,
    rawPackages: () => packages,
    parseTransaction(bytes, index) {
      if (!Number.isSafeInteger(index) || index < 0) throw new RangeError(`not a transaction index: ${index}`);
      const native = nativeOf(bytes);
      return {
        index,
        hash: sha256(native.transaction.serialize()),
        kind: native.kind,
        size: bytes.length,
        bytes,
        segments: native.kind === "system" ? [] : segmentsOf(native.transaction),
      };
    },
    nativeTransaction: (bytes) => nativeOf(bytes).transaction,
    emptyState: () => asHandle(raw.LedgerState.blank(spec.networkId)),
    genesisState: (bytes) => asHandle(raw.LedgerState.deserialize(bytes)),
    load: (stateKey, store) => asHandle(raw.loadState(stateKey, store)),
    apply,
    stateRoot: (state) => raw.stateRoot(asRaw(state)),
    stateKey: (state) => raw.stateKey(asRaw(state)),
    flush: () => raw.flushNodes(),
    persist: (key) => raw.persistKey(key),
    release: (key) => raw.releaseKey(key),
    childRefs: (children) => raw.childRefs(children),
    evict: (keys) => raw.evictKeys(keys),
    contractStateKey: (state, address) => raw.contractStateKey(asRaw(state), address),
    contractZswapStateKey: (state, address) => raw.contractZswapStateKey(asRaw(state), address),
    decodeLogItem: spec.decodeLogItem,
  };
  const convert = spec.convertFromV8;
  if (convert !== undefined) adapter.convertFromV8 = (v8StateKey, store) => asHandle(convert(v8StateKey, store));
  return Object.freeze(adapter);
}
