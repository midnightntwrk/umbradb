/**
 * UmbraDB — the package's one entry point (`package.json` `exports` names only `"."`; `dist/index.js` and
 * `dist/index.d.ts` are built from this file): exactly the surface of `openspec/changes/core-arch/design.md` §12 (LS-1),
 * which `test/library-surface/surface.test.ts` pins. 0.9.5's parts are retired (LS-2) and TransactionHistory is kept in
 * `legacy/transaction-history/`, outside the build and the package (LS-3).
 *
 * - **A configuration** (CF-1, CF-2): {@link defineConfig}, {@link coreEntry}, {@link versionEntry}, and the core
 *   modules' declarations, whose `entry` writes their entries (`CORE_BLOCK_PARSED.entry({ start, config: {} })`).
 * - **A module** (MD-1): {@link defineModule} and its types, the points ({@link POINTS}), the handles, the helpers of
 *   cursor and height-versioned tables (SH-1 to SH-3), the canonical encodings and the contents hash (DT-1 to DT-3),
 *   the module API's envelope helpers (RN-16), `hexBytes` for a settings schema and `retainedStatesOf` (LG-12).
 * - **A host program**: {@link startProcess} and its handle, the block-source interface and
 *   {@link InMemoryBlockSource} (RN-14), {@link runLedgerWorker} for its ledger worker's entry (MD-1, §5.5), the
 *   ledger package's types (LG-6) and {@link UmbraError} with its codes (§11).
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
export { contentsHash } from "./determinism/contents-hash.js";
export { encodeCanonical, encodeRow } from "./determinism/cbor.js";
export { cursorTable } from "./helpers/cursor-table.js";
export { heightVersionedTable } from "./helpers/height-versioned.js";
export type { LedgerPackage, LedgerTask, ParsedTransaction } from "./ledger/types.js";
export { runLedgerWorker } from "./ledger/worker/run.js";
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
export type { BlockRef, BlockSource } from "./runner/block-source.js";
export { answerChainData, chainDataHeaders, readChainDataView, withViewExtensions } from "./runner/envelope.js";
export { InMemoryBlockSource } from "./runner/in-memory-source.js";
export { type ProcessHandle, type ProcessState, startProcess } from "./runner/process.js";
