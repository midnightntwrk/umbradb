/**
 * The read option of DB-15 (`ReadOptions`, `./api.ts`; owner decision Q71), checked alike on both backends (DB-1):
 * `timeoutMs` bounds one read — a read for a module API request, by `apiReadTimeoutMs` (CF-4). The PostgreSQL backend
 * applies it (`./postgres.ts`); the PGlite backend checks it and sets nothing, as PGlite enforces neither timeout.
 */

import type { ReadOptions } from "./api.js";
import { UmbraError } from "./errors.js";

/** The largest timeout PostgreSQL takes, in milliseconds (`statement_timeout` is an `int4` of milliseconds). */
export const MAX_READ_TIMEOUT_MS = 2_147_483_647;

/**
 * The read's timeout in milliseconds, or undefined for a read without one (no options, or no `timeoutMs`). Anything
 * but a whole number from 1 to {@link MAX_READ_TIMEOUT_MS} is refused with `invalid-configuration` before anything runs:
 * 0 would turn the bound off, which a read without the option already is.
 */
export function readTimeoutMs(options: ReadOptions | undefined): number | undefined {
  const timeoutMs: unknown = options?.timeoutMs;
  if (timeoutMs === undefined) return undefined;
  if (typeof timeoutMs !== "number" || !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > MAX_READ_TIMEOUT_MS) {
    throw new UmbraError(
      "invalid-configuration",
      `a read's timeoutMs must be a whole number of milliseconds from 1 to ${MAX_READ_TIMEOUT_MS}, not ` +
        (typeof timeoutMs === "number" ? String(timeoutMs) : timeoutMs === null ? "null" : `a ${typeof timeoutMs}`),
      { parameter: "timeoutMs" },
    );
  }
  return timeoutMs;
}
