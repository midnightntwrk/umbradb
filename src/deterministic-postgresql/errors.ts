/**
 * `UmbraError`, the error the database API, the determinism code and this component throw. It has a stable `code`,
 * says whether retrying can succeed (`retryable`), and carries structured `details`.
 *
 * It keeps 0.9.5's split between retryable and not-retryable errors: thrown errors are told apart by `code`, and each
 * says whether a retry can clear it. Only two codes are retryable:
 *
 * - for the database, a lost connection (`connection-lost`), so the caller can reconnect and retry;
 * - for the node, a node that could not be reached or did not answer in time (`node-unreachable`).
 *
 * Every other error is not retryable. Retryability follows from the code alone, so two errors with the same code never
 * disagree.
 *
 * It is defined here, in the `deterministic_postgresql` component, because the component's result mapping and
 * parameter texts throw it and the component imports nothing else from `src/`. `src/db/errors.ts` re-exports it, so the
 * database API's `UmbraError` and `ErrorCode` are unchanged.
 */

/** Every code an `UmbraError` can carry. */
export const ERROR_CODES = [
  /** The database connection was lost or could not be made. The only retryable database code. */
  "connection-lost",
  /** Any other error the database reported: a constraint violation, a syntax error, a refused login, … */
  "database-error",
  /** A read handle, a transaction, the database itself or the node client was used after it ended. */
  "handle-closed",
  /**
   * A read for a module API request, bounded by `apiReadTimeoutMs`, ran past it: a statement ran, or the read stayed
   * idle in its transaction, for that long (`src/db/postgres.ts`).
   */
  "query-timeout",
  /**
   * A private process's read through the core's process transport held a statement that is not a single read:
   * transaction or session control (`COMMIT`, `SET`), a second statement, or a function or catalog the core refuses
   * (`pg_advisory_lock`). The core runs none of the read's statements and answers with the one it refused
   * (`src/private/read-gate.ts`).
   */
  "read-refused",
  /**
   * A chain-data read before block S commits, so there is no committed height to answer from. The read's view
   * (`readChainDataView`) fails with it, and the module API answers 503 when the handler does not catch it
   * (`src/runner/envelope.ts`).
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
   * - a database login that cannot create or use the module roles and schemas (`reason: writer-privileges`);
   * - a configuration file that cannot be loaded (`reason`: `file-not-found`, `load-failed`, `no-default-export`)
   *;
   * - a configuration whose entries the validation refuses (`reason: invalid-entries`, `details.findings`;
   *   `src/config/`);
   * - a configuration with no `core` revision of the build's version to run with (`reason: no-build-core-revision`;
   *   `src/config/process.ts`);
   * - a configuration whose `ledgerSources` names a source this build carries no package from
   *   (`reason: ledger-source-unavailable`, `src/ledger/identity.ts`).
   */
  "invalid-configuration",
  /** The configuration file's default export holds a value that is not plain data, at `details.path`. */
  "not-plain-data",
  // Startup refusals of the configuration history (`src/config/history.ts`): a recorded entry the configuration omits,
  // a change to an entry starting at or below the cursor, and a build whose version is not the one the revision
  // covering cursor + 1 names.
  "missing-entry",
  "changes-past",
  "upgrade-required",
  /** A `TRUNCATE` outside a migration, refused by this component's trigger (`./block-transactions.ts`). */
  "truncate-not-allowed",
  // Startup refusals of module ids, item names and schema names (`src/db/roles.ts`).
  "bad-id",
  "schema-collision",
  "shared-item-migrations-differ",
  // Startup refusals of module declarations (`src/modules/validation.ts`). The design named no code for four of these
  // causes; those codes and `invalid-declaration` were chosen later.
  "unknown-point",
  "reserved-prefix",
  "duplicate-id",
  "no-requirement",
  "item-no-lifetime",
  "table-item-no-kind",
  "field-no-kind",
  "invalid-declaration",
  // Startup refusals of the requirement graph per height range (`src/modules/graph.ts`). A development module's refusal
  // is `development-opt-in-required`, below.
  "item-no-provider",
  "providers-overlap",
  "graph-cycle",
  "item-not-available",
  "cannot-start-mid-chain",
  /**
   * A `process` item a module of the process requires was not published once every `on-start-db` had run
   * (`src/runner/process-context.ts`). Startup refuses, naming the item, the modules requiring it and its providers.
   */
  "process-item-missing",
  /**
   * Two modules, or one module twice, registered the same method and path, or the same subscription name, in
   * `on-start-api` (`src/runner/module-api.ts`). Startup refuses before anything listens, naming the route and both
   * modules.
   */
  "duplicate-api-route",
  /**
   * A module's callback failed: it threw, or misused a handle (`handle-closed` of a handle kept past its callback). At
   * startup (`on-start-db`, `on-start-api`) startup refuses; while processing, the process halts. Its reason names the
   * module and the point; a startup's rejection of this code has the callback's error as its `cause`.
   */
  "callback-error",
  /**
   * A listener could not bind its address — the module API's, admin's or the private link's (Node.js's error of `listen`,
   * such as `EADDRINUSE`): startup refuses. A startup's rejection of this code has Node.js's error as its `cause`.
   */
  "listen-failed",
  // Startup refusals of migrations (`src/db/migrate.ts`).
  "migration-checksum-changed",
  "migration-missing",
  "migration-failed",
  "requires-resync",
  /**
   * Another process holds the database's writer lock: startup refuses (`src/db/writer-lock.ts`, `pglite-lock.ts`).
   */
  "writer-lock-held",
  /** The writer reconnected and found its lock taken by another process: processing halts, for good. */
  "writer-lock-lost",
  // Startup refusals of the durability probe (`src/db/durability-probe.ts`), and of a development-only feature (PGlite
  // included) without the development opt-in.
  "durability-fsync-off",
  "durability-full-page-writes-off",
  "durability-pooler",
  "development-opt-in-required",
  // The canonical encoder's failures (`src/determinism/cbor.ts`).
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
  // decided by this component's rules (`./column-rules.ts`).
  "no-primary-key",
  "unsupported-key-type",
  "unsupported-column-type",
  "non-deterministic-column",
  "non-deterministic-table",
  "unencodable-row",
  "row-count-changed",
  // The node client's failures (`src/node/`); `node-requirement` is also a processing halt.
  /**
   * The node could not be reached or did not answer in time: a connection that could not be made, was lost, or whose
   * handshake was refused with HTTP 429 or a 5xx status; a call with no answer within its timeout; the node's own rate
   * limit. Retryable: the node client retries it with back-off.
   */
  "node-unreachable",
  /**
   * The node answered that a block, or the state at a block, is unavailable (pruned): processing halts. Not
   * retryable.
   */
  "node-requirement",
  /**
   * Any other failure of a node call: a JSON-RPC error answer, a handshake refused with another status, an answer or a
   * frame of the wrong shape, a method outside the node client's set. Not retryable.
   */
  "node-error",
  // The halts of each block's ledger version and metadata (`src/ledger/version-table.ts`, `metadata.ts`): a
  // spec_version that no row (or more than one) maps; no MNSV digest, several, or a malformed one; a block
  // contradicting a pin of the ledger table; a parent runtime other than the block's MNSV.
  "unknown-runtime",
  "bad-version-digest",
  "pin-mismatch",
  "metadata-mismatch",
  /**
   * A ledger package's files are not the ones the core version records: its manifest's SHA-256, or a file's against
   * its manifest (`src/ledger/identity.ts`). Startup refuses.
   */
  "package-hash-mismatch",
  // The chain's identity and its blocks (`src/backbone/core-chain/`, `src/backbone/core-block-commit/`). Two startup
  // refusals: the node's genesis hash, or its finalized hash at the cursor's height, is not the database's. Two halts:
  // a block whose hash an earlier block already has, and one whose parent is not the block stored below it.
  "genesis-mismatch",
  "cursor-hash-mismatch",
  "duplicate-block-hash",
  "parent-mismatch",
  /**
   * A private process's startup refusal (`src/backbone/core-private-source/`), with `details.reason`: its private
   * database is bound to another public database (another genesis hash or S than the one it recorded at its first
   * start), its S is below the public S, or the public database's core has never started. Not retryable.
   */
  "private-binding-mismatch",
  /**
   * A finalized-head notification names another block at a height whose finalized block the indexer already knows
   * (the database's, or a finalized hash it read) (`src/backbone/core-block-fetch/`). Processing halts.
   */
  "finality-conflict",
  /**
   * The ledger state root after a block is not the node's `midnight_ledgerStateRoot` at that block
   * (`src/backbone/core-ledger-state/`). Processing halts at that height, with nothing of the block stored.
   */
  "root-mismatch",
  /**
   * A module asked `core-ledger-state` for the ledger state after a height outside the retained window of recent
   * states at its read's cursor (`src/backbone/core-ledger-state/`). The call fails; uncaught, the module's callback
   * fails.
   */
  "state-not-retained",
  /**
   * `core-ledger-state`'s reclamation found its node tables inconsistent (`src/backbone/core-ledger-state/`); nothing is
   * repaired. Its `details.reason`:
   * - `negative-count`: a reference count would fall below 0 at the block;
   * - `missing-reference`: a reference in the child list of a node the block writes new or rewritten, or a key whose
   *   root count rises, is not a stored node after the block;
   * - `row-count-mismatch`: a write of the block affected another number of rows than computed, and its transaction
   *   rolled back;
   * - `tables-inconsistent`: the contents hash, reading the node tables, found a row whose key is not its content's, or
   *   counts, a queue or roots its rows do not give (`details.check`, and the key).
   *
   * The first three halt processing at the block's height with nothing of the block stored, with `details.height` and
   * either the key as `0x` hex (`details.key`: `negative-count`, `missing-reference`) or the statement's name and the
   * expected and actual row counts (`details.statement`, `expected`, `actual`: `row-count-mismatch`). No reason carries
   * a configuration value. Not retryable.
   */
  "ledger-refcount-invalid",
  // Lockstep (`src/backbone/core-private-source/`, `src/private/`). A private process's startup refusal of a module
  // declaring `needsLockstep` on an instance the core does not list; and a private instance's two halts: the public
  // cursor is past the height it processes (the core listed it late, or does not wait for it), and the core refused a
  // report whose hash is not the public block's.
  "needs-lockstep-not-listed",
  "lockstep-behind",
  "report-hash-mismatch",
  /**
   * A private process's halt when the core's configuration hash is no longer the one it recorded at startup: a
   * `hello-ack`, `committed` or `read-result` carried another, or (without a transport) the public configuration
   * history read again at a reconnection hashes to another. Not retryable.
   */
  "public-config-changed",
  /**
   * A public process's startup refusal of a `core.transportReader` login that could write
   * (`src/private/transport-reader.ts`): a superuser, `CREATEROLE`, `CREATEDB`, `BYPASSRLS`, a member of `database`'s
   * login, or a privilege beyond reading on a public schema or table; `details { user, found }`.
   */
  "transport-reader-can-write",
  // A library process's refusals at startup's configuration step (`src/library/`): the process ends `refused`.
  /**
   * A library process's `core` revision sets a setting only `umbradb run` acts on: `backupAtStop` or `backupOnSignal`,
   * whose backups a host writes with `UmbraDBHandle.backup` instead; `details { setting, settings, entry }`.
   */
  "library-setting-refused",
  /**
   * A library process given its user modules twice: `modules` with a `{ file }` configuration (whose `modules` export
   * they are), `modules` and `modulesFrom`, or `modulesFrom` with `{ file }`; `details { given }`.
   */
  "modules-given-twice",
  /**
   * User modules given as objects (`startUmbraDB`'s `modules`, the browser demo's) that declare ledger tasks: the
   * ledger worker cannot import objects, so such a module comes through `modulesFrom`, which both threads import;
   * `details { modules }`.
   */
  "ledger-tasks-need-modules-from",
  /**
   * A library process's `source` it may not read: not exactly an `InMemoryBlockSource` (a subclass, another object, a
   * proxy, a value of another kind; `reason: not-in-memory-source`), one carrying a member the engine treats as a hook
   * of its block source (`reason: hook-members`, `details.members`), or one given to a private process, which reads
   * its public side (`reason: private-process`).
   */
  "source-refused",
  /**
   * A library process's network request at odds with the addresses its `core` revision writes
   * (`src/runner/resolve.ts`, `planNetwork`): an address both written and given in code (`reason: both`), `true` with
   * none written (`no-address`), or an address written for a surface the request does not use as an address
   * (`unused`); `details { reason, surface, request, setting, problems }`.
   */
  "network-address-conflict",
  /**
   * A library process's request of its private link that cannot run: the other side's request (`reason: wrong-side`),
   * or, on PostgreSQL, the public side given in the request with no `transportReader` (`reader-missing`);
   * `details { reason, surface, request, setting, problems }`.
   */
  "private-link-misconfigured",
  // The backup's refusals (`src/backup/`): the command exits 1 and writes no file.
  /**
   * The tool a backup needs is missing or of another major version than 18: the PostgreSQL 18 client's `pg_dump` for a
   * PostgreSQL database (on `PATH`, or `UMBRADB_PG_DUMP`), `@electric-sql/pglite-tools` for a PGlite one. The message
   * says what to install.
   */
  "backup-tools-missing",
  /** A backup of a private database without the development opt-in. */
  "private-backup-refused",
  /**
   * A file that is not a backup of the format this build reads: no manifest line, a manifest of another format, or a
   * dump a restore does not run (a `psql` meta-command other than `\restrict`/`\unrestrict`, a `COPY … FROM stdin`, a
   * file ending inside a statement).
   */
  "backup-format-unknown",
  // The restore's refusals (`src/backup/restore.ts`), in its order: before loading, then after.
  /** The target database of a restore is not empty: nothing was changed. */
  "restore-target-not-empty",
  /** The configuration's S or history differs from the backup manifest's, up to its height. */
  "backup-history-mismatch",
  /**
   * The build cannot continue the backup: the versions of the revisions covering its height + 1, a version that
   * requires a resync, or a recorded migration the build lacks or changed.
   */
  "backup-build-mismatch",
  /** The node's genesis hash is not the backup's chain's. */
  "backup-genesis-mismatch",
  /** The node has not finalized the backup's block: its head is below the backup's height, or another block is there. */
  "backup-block-not-finalized",
  /** The restored database's contents hash is not the manifest's: the restore rolled back. */
  "contents-hash-mismatch",
  /** The ledger state root the backup stores at its height is not the node's: the restore rolled back. */
  "backup-root-mismatch",
] as const;

/**
 * A code of `ERROR_CODES`. The determinism errors pass their `reason` as their code, so the compiler checks there
 * that every `CanonicalEncodingFailure` and `ModuleContentsFailure` is one.
 */
export type ErrorCode = (typeof ERROR_CODES)[number];

/** The structured part of an error: names and values a caller or a status page may show. */
export type ErrorDetails = Readonly<Record<string, unknown>>;

/** The codes a retry can clear: a lost database connection and an unreachable node. */
const RETRYABLE: ReadonlySet<ErrorCode> = new Set<ErrorCode>(["connection-lost", "node-unreachable"]);

/** An error of UmbraDB: `code` says what failed, `retryable` whether retrying can succeed, `details` where and why. */
export class UmbraError extends Error {
  override readonly name: string = "UmbraError";
  readonly code: ErrorCode;
  /** True for `connection-lost` and `node-unreachable` only. */
  readonly retryable: boolean;
  readonly details: ErrorDetails;

  constructor(code: ErrorCode, message: string, details: Record<string, unknown> = {}, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
    this.retryable = RETRYABLE.has(code);
    this.details = Object.freeze({ ...details });
  }
}
