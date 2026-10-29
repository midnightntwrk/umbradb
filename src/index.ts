/**
 * UmbraDB: the package's one entry point. `package.json` `exports` names only `"."`, and `dist/index.js` and
 * `dist/index.d.ts` are built from this file. It exports exactly the library's public surface, which
 * `test/library-surface/surface.test.ts` pins. The parts of 0.9.5 are retired, and TransactionHistory is kept in
 * `legacy/transaction-history/`, outside the build and the package. [LS-1, LS-2, LS-3; design §12]
 *
 * - **A configuration**: {@link defineConfig}, {@link coreEntry}, {@link versionEntry}, and the core modules'
 *   declarations, whose `entry` writes their entries (`CORE_BLOCK_PARSED.entry({ start, config: {} })`). [CF-1, CF-2]
 * - **A module**: {@link defineModule} and its types, the points ({@link POINTS}), the handles, the cursor-table and
 *   height-versioned-table helpers, the canonical encodings and the contents hash, the module API's envelope helpers,
 *   `hexBytes` for a settings schema, and `retainedStatesOf`. [MD-1, SH-1, SH-2, SH-3, DT-1, DT-2, DT-3, RN-16, LG-12]
 * - **A host program**: {@link startProcess} and its handle, the block-source interface and
 *   {@link InMemoryBlockSource}, {@link runLedgerWorker} as the entry of the host's ledger worker, the ledger
 *   package's types, and {@link UmbraError} with its error codes. [RN-14, MD-1, LG-6; design §5.5, §11]
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
