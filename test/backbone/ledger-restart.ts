import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_LEDGER_STATE } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { TapeRecord } from "../../tools/tape/index.js";

/**
 * A ledger process stopped and started again on a tape: the core modules of the ledger, the records a restart at a
 * cursor needs, and a ledger worker that reports its loads. Imports nothing of Vitest, so that a worker process
 * (`ledger-restart.worker.ts`) builds the same. [LG-11, A102]
 *
 * A tape replays to a client what was recorded, answering calls by method and params. [TT-2]
 *
 * A process that syncs from a tape's first block asks what the recording asked. One restarted at cursor c also asks:
 * - the header of c, for startup's cursor-hash check [IN-3];
 * - the runtime metadata at c's hash, the parent of the first block it decodes. A tape holds it once per runtime
 *   only. [LG-4, Q135 A]
 *
 * {@link restartAt} adds both, for the recorded tapes as for the synthetic ones. The metadata record is copied from the
 * one of the runtime that c's state has, since a runtime's metadata is the same bytes at every one of its blocks.
 * [Q135 A]
 */

/** The ledger's core modules as the build enables them (`core-ledger-state` and what it requires). */
export const LEDGER_CORE: readonly ModuleDeclaration[] = Object.freeze([CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, CORE_LEDGER_STATE]);

type Call = Extract<TapeRecord, { readonly method: string; readonly result: unknown }>;

const isCall = (record: TapeRecord): record is Call => "method" in record && "result" in record && !("subscribe" in record);
const firstParam = (record: Call): unknown => (record.params as readonly unknown[] | undefined)?.[0];

/** The hash `records` answer for height `height` (`chain_getBlockHash`), as `0x` hex. */
export function hashAt(records: readonly TapeRecord[], height: bigint): string {
  const record = records.find((r) => isCall(r) && r.method === "chain_getBlockHash" && firstParam(r) === Number(height));
  if (record === undefined) throw new Error(`the tape holds no block hash for ${height}`);
  return (record as Call).result as string;
}

/** The header `records` answer for `hash`: `chain_getHeader`'s, or a block's own header in `chain_getBlock`. */
function headerOf(records: readonly TapeRecord[], hash: string): unknown {
  const header = records.find((r) => isCall(r) && r.method === "chain_getHeader" && firstParam(r) === hash);
  if (header !== undefined) return (header as Call).result;
  const block = records.find((r) => isCall(r) && r.method === "chain_getBlock" && firstParam(r) === hash);
  if (block === undefined) throw new Error(`the tape holds neither the header nor the block ${hash}`);
  return ((block as Call).result as { readonly block: { readonly header: unknown } }).block.header;
}

/**
 * `records` with the finalized head at `height`: `chain_getFinalizedHead` answers its hash and `chain_getHeader` its
 * header, so that a process syncs to `height` and follows there (the first run of a restart test).
 */
export function cappedAt(records: readonly TapeRecord[], height: bigint): TapeRecord[] {
  const hash = hashAt(records, height);
  const capped = records.map((record) =>
    isCall(record) && record.method === "chain_getFinalizedHead" ? { ...record, result: hash } : record,
  );
  return [...capped, { method: "chain_getHeader", params: [hash], result: headerOf(records, hash) as never }];
}

/**
 * The `state_getMetadata` record for `hash`, copied from the tape's record of the runtime the state at `hash` has
 * (see the module comment): the runtime is `state_getRuntimeVersion`'s at `hash`. [Q135 A]
 */
export function metadataRecordAt(records: readonly TapeRecord[], hash: string): TapeRecord {
  const calls = records.filter(isCall);
  const versionAt = (at: unknown): number | undefined =>
    (calls.find((r) => r.method === "state_getRuntimeVersion" && firstParam(r) === at)?.result as { readonly specVersion?: number } | undefined)
      ?.specVersion;
  const wanted = versionAt(hash);
  if (wanted === undefined) throw new Error(`the tape holds no runtime version at ${hash}`);
  const source = calls.find((r) => r.method === "state_getMetadata" && versionAt(firstParam(r)) === wanted);
  if (source === undefined) throw new Error(`the tape holds no metadata of runtime ${wanted}`);
  return { method: "state_getMetadata", params: [hash], result: source.result as never };
}

/** `records` for a process restarted at cursor `cursor` (see the module comment): its header and metadata added. */
export function restartAt(records: readonly TapeRecord[], cursor: bigint): TapeRecord[] {
  const hash = hashAt(records, cursor);
  const has = (method: string): boolean => records.some((r) => isCall(r) && r.method === method && firstParam(r) === hash);
  return [
    ...records,
    ...(has("chain_getHeader") ? [] : [{ method: "chain_getHeader", params: [hash], result: headerOf(records, hash) as never }]),
    ...(has("state_getMetadata") ? [] : [metadataRecordAt(records, hash)]),
  ];
}

/** A load the ledger worker answered (`LedgerHost.load`): what it was asked, the root it gave, whether it read the store. */
export interface SeenLoad {
  readonly height: bigint;
  readonly stateKey: Uint8Array;
  readonly stateRoot: Uint8Array;
  readonly loaded: boolean;
}

/** `host`, its every `load` recorded in `seen` (the other calls passed through as they are). */
export function recordingLoads(host: LedgerHost, seen: SeenLoad[]): LedgerHost {
  return {
    useDatabase: (database) => host.useDatabase(database),
    parse: (ledger, block, transactions) => host.parse(ledger, block, transactions),
    genesisRoot: (ledger, bytes) => host.genesisRoot(ledger, bytes),
    genesis: (input, read) => host.genesis(input, read),
    apply: (input, read) => host.apply(input, read),
    commit: (block) => host.commit(block),
    release: (drop) => host.release(drop),
    async load(input, read) {
      const result = await host.load(input, read);
      seen.push({ height: input.height, stateKey: input.stateKey, stateRoot: result.stateRoot, loaded: result.loaded });
      return result;
    },
    retained: (input, read) => host.retained(input, read),
    evict: (keys) => host.evict(keys),
    tasks: (input, read) => host.tasks(input, read),
    probe: () => host.probe(),
    restart: () => host.restart(),
    get restarts() {
      return host.restarts;
    },
    activity: () => host.activity(),
    bridge: () => host.bridge(),
    get failure() {
      return host.failure;
    },
    close: () => host.close(),
  };
}
