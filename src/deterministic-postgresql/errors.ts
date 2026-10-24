/**
 * `UmbraError`, the error the database API, the determinism code and this component throw
 * (`openspec/changes/core-arch/design.md` §4, §12): a stable `code`, whether retrying can succeed (`retryable`), and
 * structured `details`.
 *
 * It keeps 0.9.5's split between retryable and not-retryable errors (`design/design-interfaces.md` §1.1: thrown errors
 * discriminated by `code`, each saying whether a retry can clear it), with DB-13 deciding the split: a lost database
 * connection is the one retryable error (`connection-lost`), so that the caller can reconnect and retry; every other
 * error is not retryable. Retryability follows from the code alone, so two errors with one code never disagree.
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
  /** A read handle, a transaction or the database itself was used after it ended (A10's code). */
  "handle-closed",
  /** A query parameter the API cannot send: `undefined`, a function, a `Map`, a non-finite number in JSON, … */
  "invalid-parameter",
  /**
   * A setting refused before anything runs: a `database` URL that overrides a pinned session setting, or a database
   * login that cannot create or use the module roles and schemas (`reason: writer-privileges`, decision record Q90).
   */
  "invalid-configuration",
  /** A `TRUNCATE` outside a migration, refused by this component's trigger (DB-14, `./block-transactions.ts`). */
  "truncate-not-allowed",
  // Startup refusals of module ids, item names and schema names (DB-8, MD-2, `src/db/roles.ts`).
  "bad-id",
  "schema-collision",
  "shared-item-migrations-differ",
  // Startup refusals of migrations (DB-9, DB-10, decision record Q91; `src/db/migrate.ts`).
  "migration-checksum-changed",
  "migration-missing",
  "migration-failed",
  "requires-resync",
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
] as const;

/**
 * A code of {@link ERROR_CODES}. The determinism errors pass their `reason` as their code, so the compiler checks there
 * that every `CanonicalEncodingFailure` and `ModuleContentsFailure` is one.
 */
export type ErrorCode = (typeof ERROR_CODES)[number];

/** The structured part of an error: names and values a caller or a status page may show. */
export type ErrorDetails = Readonly<Record<string, unknown>>;

/** An error of UmbraDB: `code` says what failed, `retryable` whether retrying can succeed, `details` where and why. */
export class UmbraError extends Error {
  override readonly name: string = "UmbraError";
  readonly code: ErrorCode;
  /** True for `connection-lost` only (DB-13). */
  readonly retryable: boolean;
  readonly details: ErrorDetails;

  constructor(code: ErrorCode, message: string, details: Record<string, unknown> = {}, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
    this.retryable = code === "connection-lost";
    this.details = Object.freeze({ ...details });
  }
}
