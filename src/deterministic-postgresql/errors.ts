/**
 * `UmbraError`, the error the database API, the determinism code and this component throw. It has a stable `code`,
 * says whether retrying can succeed (`retryable`), and carries structured `details`. [design §4, §12]
 *
 * It keeps 0.9.5's split between retryable and not-retryable errors: thrown errors are told apart by `code`, and each
 * says whether a retry can clear it. Only two codes are retryable: [design-interfaces §1.1]
 *
 * - for the database, a lost connection (`connection-lost`), so the caller can reconnect and retry [DB-13];
 * - for the node, a node that could not be reached or did not answer in time (`node-unreachable`) [IN-10].
 *
 * Every other error is not retryable. Retryability follows from the code alone, so two errors with the same code never
 * disagree.
 *
 * It is defined here, in the `deterministic_postgresql` component, because the component's result mapping and
 * parameter texts throw it and the component imports nothing else from `src/`. `src/db/errors.ts` re-exports it, so the
 * database API's `UmbraError` and `ErrorCode` are unchanged. [A138, Q79 A; design §12]
 */

/** Every code an `UmbraError` can carry. */
export const ERROR_CODES = [
  /** The database connection was lost or could not be made. The only retryable database code. [DB-13] */
  "connection-lost",
  /** Any other error the database reported: a constraint violation, a syntax error, a refused login, … [DB-13] */
  "database-error",
  /** A read handle, a transaction, the database itself or the node client was used after it ended. [A10] */
  "handle-closed",
  /**
   * A read for a module API request, bounded by `apiReadTimeoutMs`, ran past it: a statement ran, or the read stayed
   * idle in its transaction, for that long (`src/db/postgres.ts`). [DB-15]
   */
  "query-timeout",
  /**
   * A private process's read through the core's process transport held a statement that is not a single read:
   * transaction or session control (`COMMIT`, `SET`), a second statement, or a function or catalog the core refuses
   * (`pg_advisory_lock`). The core runs none of the read's statements and answers with the one it refused
   * (`src/private/read-gate.ts`). [PP-4]
   */
  "read-refused",
  /**
   * A chain-data read before block S commits, so there is no committed height to answer from. The read's view
   * (`readChainDataView`) fails with it, and the module API answers 503 when the handler does not catch it
   * (`src/runner/envelope.ts`). [RN-16]
   */
  "no-committed-height",
  /**
   * A query parameter the API cannot send: `undefined`, a function, a `Map`, a non-finite number in JSON, …; or a node
   * call's parameter the node client cannot send (a hash that is not 32 bytes, a negative height; `src/node/`).
   */
  "invalid-parameter",
  /**
   * A setting refused before anything runs:
   *
   * - a `database` URL that overrides a pinned session setting;
   * - a database login that cannot create or use the module roles and schemas (`reason: writer-privileges`) [Q90];
   * - a configuration file that cannot be loaded (`reason`: `file-not-found`, `load-failed`, `no-default-export`)
   *   [CF-1];
   * - a configuration whose entries the validation refuses (`reason: invalid-entries`, `details.findings`;
   *   `src/config/`) [CF-3];
   * - a configuration with no `core` revision of the build's version to run with (`reason: no-build-core-revision`;
   *   `src/config/process.ts`) [Q102];
   * - a configuration whose `ledgerSources` names a source this build carries no package from
   *   (`reason: ledger-source-unavailable`, `src/ledger/identity.ts`).
   */
  "invalid-configuration",
  /** The configuration file's default export holds a value that is not plain data, at `details.path`. [CF-1] */
  "not-plain-data",
  // Startup refusals of the configuration history (`src/config/history.ts`): a recorded entry the configuration omits,
  // a change to an entry starting at or below the cursor, and a build whose version is not the one the revision
  // covering cursor + 1 names. [CF-5, CF-6, CF-8]
  "missing-entry",
  "changes-past",
  "upgrade-required",
  /** A `TRUNCATE` outside a migration, refused by this component's trigger (`./block-transactions.ts`). [DB-14] */
  "truncate-not-allowed",
  // Startup refusals of module ids, item names and schema names (`src/db/roles.ts`). [DB-8, MD-2]
  "bad-id",
  "schema-collision",
  "shared-item-migrations-differ",
  // Startup refusals of module declarations (`src/modules/validation.ts`). The design named no code for four of these
  // causes; those codes and `invalid-declaration` were chosen later. [MD-1, MD-2, Q94; design §11]
  "unknown-point",
  "reserved-prefix",
  "duplicate-id",
  "no-requirement",
  "item-no-lifetime",
  "table-item-no-kind",
  "field-no-kind",
  "invalid-declaration",
  // Startup refusals of the requirement graph per height range (`src/modules/graph.ts`). A development module's refusal
  // is `development-opt-in-required`, below. [MD-3, MD-4, MD-5, MD-6]
  "item-no-provider",
  "providers-overlap",
  "graph-cycle",
  "item-not-available",
  "cannot-start-mid-chain",
  /**
   * A `process` item a module of the process requires was not published once every `on-start-db` had run
   * (`src/runner/process-context.ts`). Startup refuses, naming the item, the modules requiring it and its providers.
   * [MD-7]
   */
  "process-item-missing",
  /**
   * Two modules, or one module twice, registered the same method and path, or the same subscription name, in
   * `on-start-api` (`src/runner/module-api.ts`). Startup refuses before anything listens, naming the route and both
   * modules. [RN-15]
   */
  "duplicate-api-route",
  // Startup refusals of migrations (`src/db/migrate.ts`). [DB-9, DB-10, Q91]
  "migration-checksum-changed",
  "migration-missing",
  "migration-failed",
  "requires-resync",
  /**
   * Another process holds the database's writer lock: startup refuses (`src/db/writer-lock.ts`, `pglite-lock.ts`).
   * [DB-11]
   */
  "writer-lock-held",
  /** The writer reconnected and found its lock taken by another process: processing halts, for good. [DB-11] */
  "writer-lock-lost",
  // Startup refusals of the durability probe (`src/db/durability-probe.ts`), and of a development-only feature (PGlite
  // included) without the development opt-in. [DB-12, CF-9]
  "durability-fsync-off",
  "durability-full-page-writes-off",
  "durability-pooler",
  "development-opt-in-required",
  // The canonical encoder's failures (`src/determinism/cbor.ts`). [DT-1]
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
  // The module contents' failures (`src/determinism/module-tables.ts`). The first five are also startup refusals,
  // decided by this component's rules (`./column-rules.ts`). [DT-2, DT-3, DT-6; design §11]
  "no-primary-key",
  "unsupported-key-type",
  "unsupported-column-type",
  "non-deterministic-column",
  "non-deterministic-table",
  "unencodable-row",
  "row-count-changed",
  // The node client's failures (`src/node/`); `node-requirement` is also a processing halt. [IN-9, IN-10; design §11]
  /**
   * The node could not be reached or did not answer in time: a connection that could not be made, was lost, or whose
   * handshake was refused with HTTP 429 or a 5xx status; a call with no answer within its timeout; the node's own rate
   * limit. Retryable: the node client retries it with back-off. [IN-10]
   */
  "node-unreachable",
  /**
   * The node answered that a block, or the state at a block, is unavailable (pruned): processing halts. Not
   * retryable. [IN-9]
   */
  "node-requirement",
  /**
   * Any other failure of a node call: a JSON-RPC error answer, a handshake refused with another status, an answer or a
   * frame of the wrong shape, a method outside the node client's set. Not retryable. [IN-8]
   */
  "node-error",
  // The halts of each block's ledger version and metadata (`src/ledger/version-table.ts`, `metadata.ts`): a
  // spec_version that no row (or more than one) maps; no MNSV digest, several, or a malformed one; a block
  // contradicting a pin of the ledger table; a parent runtime other than the block's MNSV.
  // [LG-1, LG-2, LG-4; design §11]
  "unknown-runtime",
  "bad-version-digest",
  "pin-mismatch",
  "metadata-mismatch",
  /**
   * A ledger package's files are not the ones the core version records: its manifest's SHA-256, or a file's against
   * its manifest (`src/ledger/identity.ts`). Startup refuses. [LG-5]
   */
  "package-hash-mismatch",
  // The chain's identity and its blocks (`src/backbone/core-chain/`, `src/backbone/core-block-commit/`). Two startup
  // refusals: the node's genesis hash, or its finalized hash at the cursor's height, is not the database's. Two halts:
  // a block whose hash an earlier block already has, and one whose parent is not the block stored below it.
  // [IN-3, IN-4, CD-3]
  "genesis-mismatch",
  "cursor-hash-mismatch",
  "duplicate-block-hash",
  "parent-mismatch",
  /**
   * A private process's startup refusal (`src/backbone/core-private-source/`), with `details.reason`: its private
   * database is bound to another public database (another genesis hash or S than the one it recorded at its first
   * start), its S is below the public S, or the public database's core has never started. Not retryable. [PP-2]
   */
  "private-binding-mismatch",
  /**
   * A finalized-head notification names another block at a height whose finalized block the indexer already knows
   * (the database's, or a finalized hash it read) (`src/backbone/core-block-fetch/`). Processing halts. [IN-4]
   */
  "finality-conflict",
  /**
   * The ledger state root after a block is not the node's `midnight_ledgerStateRoot` at that block
   * (`src/backbone/core-ledger-state/`). Processing halts at that height, with nothing of the block stored. [LG-15]
   */
  "root-mismatch",
  /**
   * A module asked `core-ledger-state` for the ledger state after a height outside the retained window of recent
   * states at its read's cursor (`src/backbone/core-ledger-state/`). The call fails; uncaught, the module's callback
   * fails. [LG-12]
   */
  "state-not-retained",
  /**
   * `core-contract-logs-fast` cannot read a block's MIP-0002 log exactly from the transcripts: a value that is not a
   * literal (read from the contract's state, or computed), one behind a `branch`, or any log of a partially successful
   * transaction (`src/backbone/core-contract-logs-fast/`). Processing halts at that height, with nothing of the block
   * stored. [CC-3, Q21]
   */
  "fast-log-unsupported",
  // Lockstep (`src/backbone/core-private-source/`, `src/private/`). A private process's startup refusal of a module
  // declaring `needsLockstep` on an instance the core does not list; and a private instance's two halts: the public
  // cursor is past the height it processes (the core listed it late, or does not wait for it), and the core refused a
  // report whose hash is not the public block's. [PP-6, PP-7]
  "needs-lockstep-not-listed",
  "lockstep-behind",
  "report-hash-mismatch",
  /**
   * A private process's halt when the core's configuration hash is no longer the one it recorded at startup: a
   * `hello-ack`, `committed` or `read-result` carried another, or (without a transport) the public configuration
   * history read again at a reconnection hashes to another. Not retryable. [PP-14, Q147]
   */
  "public-config-changed",
  /**
   * A public process's startup refusal of a `core.transportReader` login that could write
   * (`src/private/transport-reader.ts`): a superuser, `CREATEROLE`, `CREATEDB`, `BYPASSRLS`, a member of `database`'s
   * login, or a privilege beyond reading on a public schema or table; `details { user, found }`. [CF-4, PP-4, Q175 A]
   */
  "transport-reader-can-write",
  // The backup's refusals (`src/backup/`): the command exits 1 and writes no file. [BK-1, PP-12]
  /**
   * The tool a backup needs is missing or of another major version than 18: the PostgreSQL 18 client's `pg_dump` for a
   * PostgreSQL database (on `PATH`, or `UMBRADB_PG_DUMP`), `@electric-sql/pglite-tools` for a PGlite one. The message
   * says what to install. [Q85]
   */
  "backup-tools-missing",
  /** A backup of a private database without the development opt-in. [PP-12] */
  "private-backup-refused",
  /**
   * A file that is not a backup of the format this build reads: no manifest line, a manifest of another format, or a
   * dump a restore does not run (a `psql` meta-command other than `\restrict`/`\unrestrict`, a `COPY … FROM stdin`, a
   * file ending inside a statement).
   */
  "backup-format-unknown",
  // The restore's refusals (`src/backup/restore.ts`), in its order: before loading, then after. [BK-3]
  /** The target database of a restore is not empty: nothing was changed. */
  "restore-target-not-empty",
  /** The configuration's S or history differs from the backup manifest's, up to its height. [CF-5, CF-6] */
  "backup-history-mismatch",
  /**
   * The build cannot continue the backup: the versions of the revisions covering its height + 1, a version that
   * requires a resync, or a recorded migration the build lacks or changed. [CF-8, DB-10, DB-9]
   */
  "backup-build-mismatch",
  /** The node's genesis hash is not the backup's chain's. */
  "backup-genesis-mismatch",
  /** The node has not finalized the backup's block: its head is below the backup's height, or another block is there. */
  "backup-block-not-finalized",
  /** The restored database's contents hash is not the manifest's: the restore rolled back. [DT-3] */
  "contents-hash-mismatch",
  /** The ledger state root the backup stores at its height is not the node's: the restore rolled back. [LG-15] */
  "backup-root-mismatch",
] as const;

/**
 * A code of `ERROR_CODES`. The determinism errors pass their `reason` as their code, so the compiler checks there
 * that every `CanonicalEncodingFailure` and `ModuleContentsFailure` is one.
 */
export type ErrorCode = (typeof ERROR_CODES)[number];

/** The structured part of an error: names and values a caller or a status page may show. */
export type ErrorDetails = Readonly<Record<string, unknown>>;

/** The codes a retry can clear: a lost database connection and an unreachable node. [DB-13, IN-10] */
const RETRYABLE: ReadonlySet<ErrorCode> = new Set<ErrorCode>(["connection-lost", "node-unreachable"]);

/** An error of UmbraDB: `code` says what failed, `retryable` whether retrying can succeed, `details` where and why. */
export class UmbraError extends Error {
  override readonly name: string = "UmbraError";
  readonly code: ErrorCode;
  /** True for `connection-lost` and `node-unreachable` only. [DB-13, IN-10] */
  readonly retryable: boolean;
  readonly details: ErrorDetails;

  constructor(code: ErrorCode, message: string, details: Record<string, unknown> = {}, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
    this.retryable = RETRYABLE.has(code);
    this.details = Object.freeze({ ...details });
  }
}
