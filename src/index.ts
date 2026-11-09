/**
 * UmbraDB: the package's one entry point. `package.json` `exports` names only `"."`, and `dist/index.js` and
 * `dist/index.d.ts` are built from this file. It exports exactly the library's public surface. The parts of 0.9.5
 * are retired, and TransactionHistory is kept in `legacy/transaction-history/`, outside the build and the
 * package.
 *
 * - **A configuration**: {@link defineConfig}, {@link coreEntry}, {@link versionEntry}, and the core modules'
 *   declarations, whose `entry` writes their entries (`CORE_BLOCK_PARSED.entry({ start, config: {} })`).
 * - **A module**: {@link defineModule} and its types, the points ({@link POINTS}), the handles, the cursor-table and
 *   height-versioned-table helpers, the canonical encodings and the contents hash (with the content-defined tables of
 *   UmbraDB's own declarations), the module API's envelope helpers, `hexBytes` for a settings schema, and
 *   `retainedStatesOf`.
 * - **A host program**: {@link startUmbraDB}, UmbraDB run in the host's own process, with its options, its handle and
 *   their types (the network request, the mounted handlers, the private link's channel); {@link finalizedHeight}, a
 *   node's finalized height for a new database's start; {@link InMemoryBlockSource} and `BlockRef`, an in-memory chain;
 *   the ledger package's types; and {@link UmbraError} with its error codes. The engine they start through
 *   (`startProcess`), its handle and the block-source interface are internal.
 *
 * @packageDocumentation
 */

export { CORE_BLOCK_PARSED } from "./backbone/core-block-parsed/core-block-parsed.js";
export { CORE_CHAIN_EVENTS } from "./backbone/core-chain-events/core-chain-events.js";
export { CORE_CONTRACT_LOGS_FAST } from "./backbone/core-contract-logs-fast/core-contract-logs-fast.js";
export { CORE_CONTRACT_LOGS_FULL } from "./backbone/core-contract-logs-full/core-contract-logs-full.js";
export { CORE_CONTRACT_STATES } from "./backbone/core-contract-states/core-contract-states.js";
export { CORE_LEDGER_STATE, retainedStatesOf } from "./backbone/core-ledger-state/core-ledger-state.js";
export { CORE_TX_RESULTS } from "./backbone/core-tx-results/core-tx-results.js";
export type { CoreVersion } from "./config/build.js";
export { hexBytes } from "./config/core-settings.js";
export { coreEntry, defineConfig, type Entry, type UmbraConfig, versionEntry } from "./config/entries.js";
export type { BlockWriteHandle, ReadHandle, SchemaWriteHandle } from "./db/api.js";
export { type ErrorCode, UmbraError } from "./db/errors.js";
export { contentsHash } from "./library/contents-hash.js";
export { encodeCanonical, encodeRow } from "./determinism/cbor.js";
export { cursorTable } from "./helpers/cursor-table.js";
export { heightVersionedTable } from "./helpers/height-versioned.js";
export type { LedgerPackage, LedgerTask, ParsedTransaction } from "./ledger/types.js";
export { type MessagePortLike, messagePortChannel, type PrivateLinkChannel } from "./library/channels.js";
export { finalizedHeight } from "./library/finalized-height.js";
export {
  type Address,
  type NodeHttpHandler,
  type NodeUpgradeHandler,
  startUmbraDB,
  type UmbraDBBackup,
  type UmbraDBCondition,
  type UmbraDBEnd,
  type UmbraDBHandle,
  type UmbraDBNetwork,
  type UmbraDBOptions,
  type UmbraDBReason,
  type UmbraDBStarted,
  type UmbraDBStatus,
} from "./library/start-umbradb.js";
export {
  type ApiRegistry,
  type BlockContext,
  defineModule,
  type FieldKind,
  type FieldSchema,
  type ItemDeclaration,
  type ItemSink,
  type Lifetime,
  type Migration,
  type ModuleDeclaration,
  type PointCallbacks,
  type PointName,
  POINTS,
  type ProcessContext,
  type Revision,
} from "./modules/declaration.js";
export type { BlockRef } from "./runner/block-source.js";
export { answerChainData, chainDataHeaders, readChainDataView, withViewExtensions } from "./runner/envelope.js";
export { InMemoryBlockSource } from "./runner/in-memory-source.js";
