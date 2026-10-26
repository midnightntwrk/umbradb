/**
 * Sanitized errors (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-5, AE-6; CORE-ARCH §4.18): what the
 * admin endpoints may show of why a process is refused or halted — "error texts from error codes and allowlisted fields
 * only, never from raw exception messages", so no response carries a credential or key bytes an exception's message
 * held. Shared by the backbone parts' endpoints (tasks 8.2–8.4), built on the main thread before the snapshot crosses to
 * the admin worker (`./snapshot.ts`).
 *
 * {@link sanitizedError} gives the runner's reason (`ProcessReason`, `../runner/failures.ts`: §11's code, the height,
 * the module and the point) with {@link errorMessage}, a text made of those fields alone, and the **allowlisted
 * details** ({@link ALLOWED_DETAILS}) of the failure's own `UmbraError` — the one in the error's cause chain whose code
 * is the reason's —: each field shown only in the form its rule accepts (a token, an id, invalid-configuration's
 * findings as path and message), each text through the configuration's redaction, the rest dropped. Without a
 * redaction (nothing yet knows the configuration's secrets) no detail is shown.
 */

import type { PlainData, PlainObject } from "../config/plain-data.js";
import type { Redactor } from "../config/redact.js";
import { UmbraError } from "../db/errors.js";
import type { ProcessReason } from "../runner/failures.js";
import type { SanitizedError } from "./types.js";

/** One detail field `/status` may show, and how: its value as shown, or undefined to drop it. */
export interface AllowedDetail {
  readonly name: string;
  show(value: unknown, redact: (text: string) => string): PlainData | undefined;
}

/** A code-like word: a `reason` such as `invalid-entries` or `out-of-order`. */
const TOKEN = /^[a-z][a-z0-9-]{0,63}$/;
/** An identifier a module declares, such as a migration's `001`. */
const IDENTIFIER = /^[A-Za-z0-9._-]{1,64}$/;

/** At most this many of invalid-configuration's findings are shown. */
export const MAX_FINDINGS = 100;

const matching = (pattern: RegExp) => (value: unknown) =>
  typeof value === "string" && pattern.test(value) ? value : undefined;

/** invalid-configuration's findings (task 4.2): each one's path and message, both built without a setting's value. */
function findings(value: unknown, redact: (text: string) => string): PlainData | undefined {
  if (!Array.isArray(value)) return undefined;
  const shown = value.flatMap((finding: unknown) => {
    const { path, message } = (typeof finding === "object" && finding !== null ? finding : {}) as Record<string, unknown>;
    return typeof path === "string" && typeof message === "string"
      ? [Object.freeze({ path: redact(path), message: redact(message) })]
      : [];
  });
  return Object.freeze(shown.slice(0, MAX_FINDINGS));
}

/**
 * The details `/status` may show (AE-6's "allowlisted fields"): a refusal's or halt's `reason` (a token), a migration's
 * id, and invalid-configuration's findings (4.2's note (d)). Tasks 8.3 and 10.4 add the fields their codes need.
 */
export const ALLOWED_DETAILS: readonly AllowedDetail[] = Object.freeze([
  Object.freeze({ name: "reason", show: matching(TOKEN) }),
  Object.freeze({ name: "migration", show: matching(IDENTIFIER) }),
  Object.freeze({ name: "findings", show: findings }),
]);

/** A reason in words, from its fields alone: `callback-error at height 5, module m, point on-compute`. */
export function errorMessage(reason: ProcessReason): string {
  const where = [
    reason.module === null ? null : `module ${reason.module}`,
    reason.point === null ? null : `point ${reason.point}`,
  ].filter((part) => part !== null);
  const at = reason.height === null ? "" : ` at height ${reason.height}`;
  return [`${reason.code}${at}`, ...where].join(", ");
}

/** The `UmbraError` of `code` in `error`'s cause chain (the runner's wrappers keep the failure as their cause). */
function failureOf(error: unknown, code: string): UmbraError | undefined {
  let current = error;
  for (let depth = 0; depth < 8 && current instanceof Error; depth++) {
    if (current instanceof UmbraError && current.code === code) return current;
    current = current.cause;
  }
  return undefined;
}

/**
 * `reason` as the admin endpoints may show it (see the module comment): `error` is the failure the reason was taken
 * from (`ProcessingEnd`'s `error`), read only for its allowlisted details; `redactor` the configuration's, or null.
 */
export function sanitizedError(
  reason: ProcessReason,
  error: unknown,
  redactor: Pick<Redactor, "text"> | null,
  allowed: readonly AllowedDetail[] = ALLOWED_DETAILS,
): SanitizedError {
  const details: Record<string, PlainData> = {};
  const failure = redactor === null ? undefined : failureOf(error, reason.code);
  if (failure !== undefined && redactor !== null) {
    for (const detail of allowed) {
      if (!Object.hasOwn(failure.details, detail.name)) continue;
      const shown = detail.show(failure.details[detail.name], (text) => redactor.text(text));
      if (shown !== undefined) details[detail.name] = shown;
    }
  }
  return Object.freeze({
    code: reason.code,
    height: reason.height === null ? null : String(reason.height),
    module: reason.module,
    point: reason.point,
    message: errorMessage(reason),
    details: Object.freeze(details) as PlainObject,
  });
}
