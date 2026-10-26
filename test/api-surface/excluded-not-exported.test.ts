import { describe, expect, it } from "vitest";
import * as umbra from "../../src/index.js";

// LS-3 (core-arch task 17.1): TransactionHistory moved to `legacy/transaction-history/` and is not exported. Its twelve
// types are erased at run time, so the type check holds them: each import below must fail (the module has no such
// member), and an `@ts-expect-error` with no error under it is itself an error (TS2578) in `npm run typecheck`.
// @ts-expect-error not exported (LS-3)
import type { TransactionHistoryStorage } from "../../src/index.js";
// @ts-expect-error not exported (LS-3)
import type { TransactionHistoryReader } from "../../src/index.js";
// @ts-expect-error not exported (LS-3)
import type { TransactionHistoryWriter } from "../../src/index.js";
// @ts-expect-error not exported (LS-3)
import type { TransactionHistoryEntry } from "../../src/index.js";
// @ts-expect-error not exported (LS-3)
import type { TransactionHistoryStatus } from "../../src/index.js";
// @ts-expect-error not exported (LS-3)
import type { EntryContent } from "../../src/index.js";
// @ts-expect-error not exported (LS-3)
import type { EntryLifecycle } from "../../src/index.js";
// @ts-expect-error not exported (LS-3)
import type { EntryLifecycleStatus } from "../../src/index.js";
// @ts-expect-error not exported (LS-3)
import type { PendingLifecycle } from "../../src/index.js";
// @ts-expect-error not exported (LS-3)
import type { FinalizedLifecycle } from "../../src/index.js";
// @ts-expect-error not exported (LS-3)
import type { RejectedLifecycle } from "../../src/index.js";
// @ts-expect-error not exported (LS-3)
import type { MergeEntriesFn } from "../../src/index.js";

/**
 * G1 / acceptance A2 + G3 / acceptance C7: internal symbols and the six chain-archive error
 * classes are NOT re-exported by the barrel (src/index.ts, compiled to dist/index.js). A named import of any of them fails at link
 * time; at runtime the name is simply absent from the package namespace, which is what this
 * asserts.
 */
describe("frozen barrel: excluded symbols are not exported (A2, C7)", () => {
  const barrel = umbra as unknown as Record<string, unknown>;

  it("TransactionHistory is not exported: it is kept in legacy/transaction-history/, outside the package (LS-3)", () => {
    for (const name of ["PgTransactionHistoryStorage", "InMemoryTransactionHistoryStorage", "referenceMergeEntries"]) {
      expect(name in barrel, `${name} must NOT be exported from the barrel (LS-3)`).toBe(false);
    }
  });

  it("none of the six chain-archive error classes is exported (C7)", () => {
    for (const name of [
      "ChainArchiveError", "ChainArchiveInvariantError", "ChainArchiveCheckViolationError",
      "BlobIntegrityError", "BlobMissingError", "BlockNotFoundError",
    ]) {
      expect(name in barrel, `${name} must NOT be exported from the barrel`).toBe(false);
    }
  });

  it("adapter plumbing, translate/abort helpers, and schema validators are not exported (A2)", () => {
    for (const name of [
      "translatePostgresError", "isConnectionFailure", "isStatementTimeout", "isLockTimeout",
      "resolveTransaction", "assertValidSchemaName", "assertValidCheckpointIds",
      "withAbort", "abortError", "encode", "decode", "probeDurability",
      "probeAdvisoryLockVisibility", "classifyFsync", "hasPostgresUnsafeText", "exceedsMaxDepth",
    ]) {
      expect(name in barrel, `${name} must NOT be exported from the barrel`).toBe(false);
    }
  });

  it("the internal Zod schema objects are not exported (A2)", () => {
    for (const name of [
      "JsonValueSchema", "NamespaceSchema", "ScopeSchema", "KeySchema", "StoredVersionSchema",
      "ExpectedVersionSchema", "VersionedEntrySchema", "WatermarkValueSchema",
      "TransactionOptionsSchema", "LeaseAcquireOptionsSchema", "SaveCheckpointOptionsSchema",
      "HistoryOptionsSchema", "CheckpointIdSchema", "EntryContentSchema", "EntryLifecycleSchema",
      "TransactionHistoryEntrySchema", "Hex32Schema",
    ]) {
      expect(name in barrel, `${name} (Zod schema) must NOT be exported from the barrel`).toBe(false);
    }
  });

  it("internal-only constants deferred as additive-later are not part of the frozen surface", () => {
    for (const name of [
      "DEFAULT_STATEMENT_TIMEOUT_MS", "DEFAULT_LOCK_TIMEOUT_MS", "DEFAULT_IDLE_IN_TX_TIMEOUT_MS",
      "DEFAULT_MIGRATION_LOCK_TIMEOUT_MS", "ENVELOPE_VERSION", "MAX_JSON_DEPTH",
      "MAX_CHECKPOINT_ID_LENGTH", "MAX_ENTRY_CONTENT_DEPTH", "THS_RESERVED_KEY_PREFIX",
    ]) {
      expect(name in barrel, `${name} must NOT be exported from the frozen barrel`).toBe(false);
    }
  });
});
