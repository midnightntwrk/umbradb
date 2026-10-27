/**
 * `UmbraError`, the error the database API, the determinism code and this component throw
 * (`openspec/changes/core-arch/design.md` §4, §12): a stable `code`, whether retrying can succeed (`retryable`), and
 * structured `details`.
 *
 * It keeps 0.9.5's split between retryable and not-retryable errors (`design/design-interfaces.md` §1.1: thrown errors
 * discriminated by `code`, each saying whether a retry can clear it), with DB-13 deciding the split for the database —
 * a lost connection is its one retryable error (`connection-lost`), so that the caller can reconnect and retry — and
 * IN-10 for the node: a node that could not be reached or did not answer in time is its one (`node-unreachable`,
 * task 10.1). Every other error is not retryable. Retryability follows from the code alone, so two errors with one code
 * never disagree.
 *
 * It is defined here, in the `deterministic_postgresql` component, because the component's result mapping and
 * parameter texts throw it and the component imports nothing else of `src/` (A138); `src/db/errors.ts` re-exports it,
 * so `design.md` §12's `UmbraError` and `ErrorCode` are the same as before (decision record Q79, option A).
 */

/** Every code an `UmbraError` can carry. */
export const ERROR_CODES = [
  /** The database connection was lost or could not be made (DB-13). The only retryable code. */
  "connection-lost",
  /** Any other error the database reported: a constraint violation, a syntax error, a refused login, … (DB-13). */
  "database-error",
  /** A read handle, a transaction, the database itself or the node client was used after it ended (A10's code). */
  "handle-closed",
  /**
   * A read bounded by the read option — a read for a module API request, `apiReadTimeoutMs` — was ended by it: a
   * statement ran, or the read stayed idle in its transaction, for that long (DB-15, `src/db/postgres.ts`).
   */
  "query-timeout",
  /**
   * A chain-data read before block S commits, which has no committed height to answer from: the read's view
   * (`readChainDataView`) fails with it, which the module API answers 503 when the handler does not catch it (RN-16,
   * `src/runner/envelope.ts`).
   */
  "no-committed-height",
  /**
   * A query parameter the API cannot send: `undefined`, a function, a `Map`, a non-finite number in JSON, …; or a node
   * call's parameter the node client cannot send (a hash that is not 32 bytes, a negative height; `src/node/`).
   */
  "invalid-parameter",
  /**
   * A setting refused before anything runs: a `database` URL that overrides a pinned session setting, or a database
   * login that cannot create or use the module roles and schemas (`reason: writer-privileges`, decision record Q90); or
   * a configuration file that cannot be loaded (`reason`: `file-not-found`, `load-failed`, `no-default-export`; CF-1),
   * or whose entries the validation refuses (`reason: invalid-entries`, `details.findings`; CF-3, `src/config/`), or
   * that has no `core` revision of the build's version to run with (`reason: no-build-core-revision`; decision record
   * Q102, `src/config/process.ts`); or whose `ledgerSources` names a source this build carries no package from
   * (`reason: ledger-source-unavailable`, `src/ledger/identity.ts`).
   */
  "invalid-configuration",
  /** The configuration file's default export holds a value that is not plain data, at `details.path` (CF-1). */
  "not-plain-data",
  // Startup refusals of the configuration history (CF-5, CF-6, CF-8; `src/config/history.ts`): a recorded entry the
  // configuration omits, a change to an entry starting at or below the cursor, and a build whose version is not the
  // one the revision covering cursor + 1 names.
  "missing-entry",
  "changes-past",
  "upgrade-required",
  /** A `TRUNCATE` outside a migration, refused by this component's trigger (DB-14, `./block-transactions.ts`). */
  "truncate-not-allowed",
  // Startup refusals of module ids, item names and schema names (DB-8, MD-2, `src/db/roles.ts`).
  "bad-id",
  "schema-collision",
  "shared-item-migrations-differ",
  // Startup refusals of module declarations (MD-1, MD-2, `src/modules/validation.ts`; the four MD-2 causes `design.md`
  // §11 names no code for, and `invalid-declaration`, are decision record Q94's).
  "unknown-point",
  "reserved-prefix",
  "duplicate-id",
  "no-requirement",
  "item-no-lifetime",
  "table-item-no-kind",
  "field-no-kind",
  "invalid-declaration",
  // Startup refusals of the requirement graph per height range (MD-3, MD-4, MD-6, `src/modules/graph.ts`; MD-5's is
  // `development-opt-in-required`, below).
  "item-no-provider",
  "providers-overlap",
  "graph-cycle",
  "item-not-available",
  "cannot-start-mid-chain",
  /**
   * A `process` item a module of the process requires was not published when every `on-start-db` had run (MD-7,
   * `src/runner/process-context.ts`): startup refuses, naming the item, the modules requiring it and its providers.
   */
  "process-item-missing",
  /**
   * Two modules — or one module twice — registered one method and path, or one subscription name, in `on-start-api`
   * (RN-15, `src/runner/module-api.ts`): startup refuses before anything listens, naming the route and both modules.
   */
  "duplicate-api-route",
  // Startup refusals of migrations (DB-9, DB-10, decision record Q91; `src/db/migrate.ts`).
  "migration-checksum-changed",
  "migration-missing",
  "migration-failed",
  "requires-resync",
  /** Another process holds the database's writer lock: startup refuses (DB-11, `src/db/writer-lock.ts`, `pglite-lock.ts`). */
  "writer-lock-held",
  /** The writer reconnected and found its lock taken by another process: processing halts, for good (DB-11). */
  "writer-lock-lost",
  // Startup refusals of the durability probe (DB-12, `src/db/durability-probe.ts`) and of a development-only feature
  // without the development opt-in (CF-9; for PGlite, DB-12).
  "durability-fsync-off",
  "durability-full-page-writes-off",
  "durability-pooler",
  "development-opt-in-required",
  // The canonical encoder's failures (DT-1, `src/determinism/cbor.ts`).
  "not-integer",
  "unsafe-integer",
  "integer-out-of-range",
  "numeric-fraction",
  "numeric-invalid",
  "uuid-invalid",
  "timestamptz-infinite",
  "timestamptz-invalid",
  "lone-surrogate",
  "unsupported-value",
  "type-mismatch",
  "row-length",
  "cyclic-value",
  // The module contents' failures (DT-2, DT-3, DT-6, `src/determinism/module-tables.ts`); the first five are also
  // startup refusals (`design.md` §11), decided by this component's rules (`./column-rules.ts`).
  "no-primary-key",
  "unsupported-key-type",
  "unsupported-column-type",
  "non-deterministic-column",
  "non-deterministic-table",
  "unencodable-row",
  "row-count-changed",
  // The node client's failures (IN-9, IN-10, `src/node/`, task 10.1); `node-requirement` is also a halt of §11.
  /**
   * The node could not be reached or did not answer in time: a connection that could not be made, was lost, or whose
   * handshake was refused with HTTP 429 or a 5xx status; a call with no answer within its timeout; the node's own rate
   * limit. Retryable: IN-10 retries it with back-off.
   */
  "node-unreachable",
  /** The node answered that a block, or the state at a block, is unavailable (pruned): IN-9's halt. Not retryable. */
  "node-requirement",
  /**
   * Any other failure of a node call: a JSON-RPC error answer, a handshake refused with another status, an answer or a
   * frame of the wrong shape, a method outside IN-8. Not retryable.
   */
  "node-error",
  // The halts of each block's ledger version and metadata (LG-1, LG-2, LG-4, `design.md` §11; `src/ledger/
  // version-table.ts`, `metadata.ts`, task 12.2): a spec_version no row (or more than one) maps; no MNSV digest, several,
  // or a malformed one; a block contradicting a pin of the ledger table; a parent runtime other than the block's MNSV.
  "unknown-runtime",
  "bad-version-digest",
  "pin-mismatch",
  "metadata-mismatch",
  /**
   * A ledger package's files are not the ones the core version records: its manifest's SHA-256, or a file's against
   * its manifest (LG-5, `src/ledger/identity.ts`, task 12.2). Startup refuses.
   */
  "package-hash-mismatch",
  // The chain's identity and its blocks (IN-3, IN-4, CD-3; task 10.2, `src/backbone/core-chain/`,
  // `src/backbone/core-block-commit/`): two startup refusals — the node's genesis hash, or its finalized hash at the
  // cursor's height, is not the database's — and two halts — a block whose hash an earlier block already has, and one
  // whose parent is not the block stored below it.
  "genesis-mismatch",
  "cursor-hash-mismatch",
  "duplicate-block-hash",
  "parent-mismatch",
  /**
   * A private process's startup refusal (PP-2, `src/backbone/core-private-source/`, task 14.1): its private database is
   * bound to another public database — another genesis hash or S than the one it recorded at its first start —, its S is
   * below the public S, or the public database's core has never started (`details.reason`). Not retryable.
   */
  "private-binding-mismatch",
  /**
   * A finalized-head notification at a height whose finalized block the indexer already knows — the database's, or a
   * finalized hash it read — names another block (IN-4; task 10.3, `src/backbone/core-block-fetch/`): processing halts.
   */
  "finality-conflict",
  /**
   * The ledger state root after a block is not the node's `midnight_ledgerStateRoot` at that block (LG-15; task 12.3,
   * `src/backbone/core-ledger-state/`): processing halts at that height, nothing of the block stored.
   */
  "root-mismatch",
  /**
   * A module asked `core-ledger-state` for the ledger state after a height outside LG-12's retention window at its
   * read's cursor (task 12.4, `src/backbone/core-ledger-state/`): the call fails; uncaught, the module's callback fails.
   */
  "state-not-retained",
  // Lockstep (PP-6, PP-7; task 14.3, `src/backbone/core-private-source/`, `src/private/`): a private process's startup
  // refusal of a module declaring `needsLockstep` on an instance the core does not list; and a private instance's two
  // halts — the public cursor past the height it processes (the core listed it late, or does not wait for it), and the
  // core's refusal of a report whose hash is not the public block's.
  "needs-lockstep-not-listed",
  "lockstep-behind",
  "report-hash-mismatch",
  /**
   * A private process's startup refusal of a configured test key (CF-11; task 14.4, `src/backbone/core-key-registry/`):
   * one its private database admitted with another start, or one not yet admitted whose start is at or below the
   * private cursor (`details.reason`). Not retryable.
   */
  "test-key-conflict",
  // The backup's refusals (BK-1, PP-12; `src/backup/`, task 15.1): the command exits 1 and writes no file.
  /**
   * The tool a backup needs is missing or of another major version than 18: the PostgreSQL 18 client's `pg_dump` for a
   * PostgreSQL database (on `PATH`, or `UMBRADB_PG_DUMP`), `@electric-sql/pglite-tools` for a PGlite one (owner decision
   * Q85); the message says what to install.
   */
  "backup-tools-missing",
  /** A backup of a private database without the development opt-in (PP-12). */
  "private-backup-refused",
  /**
   * A file that is not a backup of the format this build reads: no manifest line, a manifest of another format, or a
   * dump a restore does not run (a `psql` meta-command other than `\restrict`/`\unrestrict`, a `COPY … FROM stdin`, a
   * file ending inside a statement).
   */
  "backup-format-unknown",
  // The restore's refusals (BK-3; `src/backup/restore.ts`, task 15.2), in its order: before loading, then after.
  /** The target database of a restore is not empty: nothing was changed. */
  "restore-target-not-empty",
  /** The configuration's S or history differs from the backup's up to its height (CF-5, CF-6 against the manifest). */
  "backup-history-mismatch",
  /**
   * The build cannot continue the backup: the versions of the revisions covering its height + 1 (CF-8), a version that
   * requires a resync (DB-10), or a recorded migration the build lacks or changed (DB-9).
   */
  "backup-build-mismatch",
  /** The node's genesis hash is not the backup's chain's. */
  "backup-genesis-mismatch",
  /** The node has not finalized the backup's block: its head is below the backup's height, or another block is there. */
  "backup-block-not-finalized",
  /** The restored database's contents hash (DT-3) is not the manifest's: the restore rolled back. */
  "contents-hash-mismatch",
  /** The ledger state root the backup stores at its height is not the node's (LG-15): the restore rolled back. */
  "backup-root-mismatch",
] as const;

/**
 * A code of {@link ERROR_CODES}. The determinism errors pass their `reason` as their code, so the compiler checks there
 * that every `CanonicalEncodingFailure` and `ModuleContentsFailure` is one.
 */
export type ErrorCode = (typeof ERROR_CODES)[number];

/** The structured part of an error: names and values a caller or a status page may show. */
export type ErrorDetails = Readonly<Record<string, unknown>>;

/** The codes a retry can clear: a lost database connection (DB-13) and an unreachable node (IN-10). */
const RETRYABLE: ReadonlySet<ErrorCode> = new Set<ErrorCode>(["connection-lost", "node-unreachable"]);

/** An error of UmbraDB: `code` says what failed, `retryable` whether retrying can succeed, `details` where and why. */
export class UmbraError extends Error {
  override readonly name: string = "UmbraError";
  readonly code: ErrorCode;
  /** True for `connection-lost` (DB-13) and `node-unreachable` (IN-10) only. */
  readonly retryable: boolean;
  readonly details: ErrorDetails;

  constructor(code: ErrorCode, message: string, details: Record<string, unknown> = {}, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
    this.retryable = RETRYABLE.has(code);
    this.details = Object.freeze({ ...details });
  }
}
