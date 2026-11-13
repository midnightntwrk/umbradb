/**
 * Why a process is refused or halted, and which failures it retries instead. This is what the process
 * (`./process.ts`) records when startup refuses or processing halts, and what `/status` shows of it.
 *
 * **A reason** ({@link ProcessReason}) is a code from the list of error codes, plus the height, module and point where
 * the failure happened. Nothing is taken from an exception's message or details beyond a module's id, so a reason
 * cannot carry a credential.
 *
 * {@link reasonOf} looks through the runner's own wrappers to the failure itself. The wrappers are a `HeightFailure`
 * (`./loop.ts`: the height, and the point and module of a callback's failure or misuse) and a `CallbackFailure`
 * (`./dispatch.ts`: a callback's point and module, including `on-start-db`'s and `on-start-api`'s at startup). It gives
 * the first code that applies:
 * 1. the failure's own code, when it is an `UmbraError` whose code is a listed refusal or halt ({@link REFUSAL_CODES},
 *    {@link HALT_CODES}): `truncate-not-allowed` from a callback's statement, `writer-lock-lost`, `node-requirement`, a
 *    startup refusal's code;
 * 2. `callback-error` when a callback failed (a point is known): a callback's own error, or a misuse such as
 *    `handle-closed`;
 * 3. `unexpected-cursor` for the loop's cursor check before the `COMMIT` ({@link UnexpectedCursor});
 * 4. `listen-failed` for a module API listener that cannot listen (Node.js's error of `listen`, e.g. `EADDRINUSE`); a
 *    failing `on-start-db` or `on-start-api` gets `callback-error` instead;
 * 5. `database-error`, the general halt: any other failure (a source's, or an `UmbraError` whose code is not listed)
 *.
 *
 * Its module is the wrapper's, or else the one an `UmbraError`'s details name (`details.module`, e.g. a migration's).
 *
 * **A startup's rejection** ({@link startupRejection}) carries the reason's code: the failure when it is an `UmbraError`
 * of that code, else one wrapping it as its `cause`.
 *
 * **Retries** ({@link retryOf}). The two retryable codes (`UmbraError.retryable`) never halt: a lost database
 * connection (`connection-lost`) is retried with the condition `database-retrying`, and an unreachable node
 * (`node-unreachable`) with `node-retrying`. This holds when they are the failure itself, directly or inside the
 * runner's wrappers. One that a module caught and replaced by its own error, or one inside another error (a
 * migration's `migration-failed`), counts as that other error, which halts or refuses.
 */

import { type ErrorCode, UmbraError } from "../db/errors.js";
import type { PointName } from "../modules/declaration.js";
import { CallbackFailure } from "./dispatch.js";
import { HeightFailure, UnexpectedCursor } from "./loop.js";

/** The listed startup refusals that are `UmbraError` codes. */
export const REFUSAL_CODES: readonly ErrorCode[] = Object.freeze([
  "genesis-mismatch",
  "cursor-hash-mismatch",
  "changes-past",
  "missing-entry",
  "not-plain-data",
  "invalid-configuration",
  "upgrade-required",
  "requires-resync",
  "migration-checksum-changed",
  "migration-missing",
  "migration-failed",
  "non-deterministic-column",
  "non-deterministic-table",
  "no-primary-key",
  "unsupported-key-type",
  "unsupported-column-type",
  "shared-item-migrations-differ",
  "unknown-point",
  "reserved-prefix",
  "bad-id",
  "schema-collision",
  "duplicate-id",
  "item-no-lifetime",
  "table-item-no-kind",
  "field-no-kind",
  "invalid-declaration",
  "item-no-provider",
  "providers-overlap",
  "graph-cycle",
  "item-not-available",
  "no-requirement",
  "cannot-start-mid-chain",
  "process-item-missing",
  "duplicate-api-route",
  "development-opt-in-required",
  "writer-lock-held",
  "durability-fsync-off",
  "durability-pooler",
  "durability-full-page-writes-off",
  "package-hash-mismatch",
  "private-binding-mismatch",
  "needs-lockstep-not-listed",
  "public-config-changed",
  "transport-reader-can-write",
  "library-setting-refused",
  "modules-given-twice",
  "ledger-tasks-need-modules-from",
  "source-refused",
  "network-address-conflict",
  "private-link-misconfigured",
  "callback-error",
  "listen-failed",
] as const);

/**
 * The listed processing halts that are `UmbraError` codes. `unexpected-cursor` is the runner's own
 * ({@link ReasonCode}). A private instance's three are the two of lockstep (`lockstep-behind`,
 * `report-hash-mismatch`) and that of a changed public configuration (`public-config-changed`).
 */
export const HALT_CODES: readonly ErrorCode[] = Object.freeze([
  "callback-error",
  "database-error",
  "parent-mismatch",
  "finality-conflict",
  "node-requirement",
  "duplicate-block-hash",
  "unknown-runtime",
  "bad-version-digest",
  "pin-mismatch",
  "metadata-mismatch",
  "writer-lock-lost",
  "truncate-not-allowed",
  "root-mismatch",
  // A reclamation check of `core-ledger-state` that fails halts with its own code, not `callback-error`.
  "ledger-refcount-invalid",
  "lockstep-behind",
  "report-hash-mismatch",
  "public-config-changed",
] as const);

const NAMED: ReadonlySet<ErrorCode> = new Set([...REFUSAL_CODES, ...HALT_CODES]);

/**
 * A reason's code: a listed one, an `UmbraError`'s — `callback-error` and `listen-failed` among them — or the loop's own
 * cursor check, `unexpected-cursor`, which only a halt gives.
 */
export type ReasonCode = ErrorCode | "unexpected-cursor";

/**
 * Why a process is `refused` or `halted`: the code and where it happened, frozen, null where none applies.
 */
export interface ProcessReason {
  readonly code: ReasonCode;
  /** The height processing halted at; null for a refusal. */
  readonly height: bigint | null;
  readonly module: string | null;
  readonly point: PointName | null;
}

/** The failure inside the runner's wrappers, and the height, point and module they name. */
interface Unwrapped {
  readonly failure: unknown;
  readonly height: bigint | null;
  readonly point: PointName | undefined;
  readonly module: string | undefined;
}

/** Looks through a `HeightFailure`, then a `CallbackFailure`, to the failure itself. */
function unwrap(error: unknown): Unwrapped {
  let failure = error;
  let height: bigint | null = null;
  let point: PointName | undefined;
  let module: string | undefined;
  if (failure instanceof HeightFailure) {
    ({ height, point, module } = failure);
    failure = failure.cause;
  }
  if (failure instanceof CallbackFailure) {
    point ??= failure.point;
    module ??= failure.module;
    failure = failure.cause;
  }
  return { failure, height, point, module };
}

/** Whether `failure` is Node.js's error of a server that cannot listen. */
const isListenFailure = (failure: unknown): boolean =>
  failure instanceof Error && (failure as NodeJS.ErrnoException).syscall === "listen";

/** The reason a startup refused or processing halted with `error` (see the module comment). */
export function reasonOf(error: unknown): ProcessReason {
  const { failure, height, point, module } = unwrap(error);
  const umbra = failure instanceof UmbraError ? failure : undefined;
  const code: ReasonCode =
    umbra !== undefined && NAMED.has(umbra.code)
      ? umbra.code
      : point !== undefined
        ? "callback-error"
        : failure instanceof UnexpectedCursor
          ? "unexpected-cursor"
          : isListenFailure(failure)
            ? "listen-failed"
            : "database-error";
  const named = umbra?.details.module;
  return Object.freeze({
    code,
    height,
    module: module ?? (typeof named === "string" ? named : null),
    point: point ?? null,
  });
}

/**
 * What a process's `started` rejects with when startup refused or failed with `error`, whose reason is `reason` (one
 * code for one failure): the failure itself — looked through the runner's wrappers — when it is an `UmbraError` of the
 * reason's code; else a new `UmbraError` of that code, naming the reason's module and point, whose `cause` is the
 * failure (a callback's own error, Node.js's error of `listen`, any value thrown). Its message is made of the reason's
 * fields only, so it holds nothing of the failure's own message. The loop's cursor check, `unexpected-cursor`, is no
 * startup step's: were a startup to meet it, the rejection would carry the general code.
 */
export function startupRejection(error: unknown, reason: ProcessReason = reasonOf(error)): UmbraError {
  const { failure } = unwrap(error);
  if (failure instanceof UmbraError && failure.code === reason.code) return failure;
  const code: ErrorCode = reason.code === "unexpected-cursor" ? "database-error" : reason.code;
  const where = [
    ...(reason.module === null ? [] : [`module ${reason.module}`]),
    ...(reason.point === null ? [] : [`point ${reason.point}`]),
  ];
  const details = {
    ...(reason.module === null ? {} : { module: reason.module }),
    ...(reason.point === null ? {} : { point: reason.point }),
  };
  return new UmbraError(
    code,
    `startup refused with ${code}${where.length === 0 ? "" : ` (${where.join(", ")})`}: the failure is this error's cause`,
    details,
    { cause: failure },
  );
}

/** The condition a retried failure raises. */
export type RetryCode = "database-retrying" | "node-retrying";

const RETRIES: ReadonlyMap<ErrorCode, RetryCode> = new Map([
  ["connection-lost", "database-retrying"],
  ["node-unreachable", "node-retrying"],
]);

/** The condition under which `error` is retried (see the module comment), or null when it halts or refuses. */
export function retryOf(error: unknown): RetryCode | null {
  const { failure } = unwrap(error);
  return failure instanceof UmbraError ? (RETRIES.get(failure.code) ?? null) : null;
}
