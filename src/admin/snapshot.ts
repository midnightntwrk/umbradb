/**
 * The snapshot the runner publishes to the admin worker (`openspec/changes/core-arch/specs/admin-endpoints/spec.md`
 * AE-1, AE-3, AE-6; `design.md` §1; CORE-ARCH §4.18): {@link snapshotOf} encodes the runner's `status()` — tasks 5.3
 * and 5.4's states, readiness, conditions and reason, the one source of them — for JSON, on the main thread: heights as
 * decimal text (JSON has no `bigint`, 3.2's note (d)), the conditions as the runner raised them, the reason as a
 * sanitized error (`./errors.ts`), and never `ended`, which holds the raw error. The configuration's part is already
 * redacted (`./redaction.ts`). The result is plain, frozen, structured-clone data: it crosses to the worker as one
 * message, and the worker answers each request from one snapshot.
 */

import type { PlainData, PlainObject } from "../config/plain-data.js";
import { PUBLIC_CORE_SCHEMA } from "../config/core-settings.js";
import type { Redactor } from "../config/redact.js";
import type { ProcessStatus } from "../runner/process.js";
import { sanitizedError } from "./errors.js";
import type { AdminSnapshot, ConfigSnapshot } from "./types.js";

/** CF-4's default liveness timeout (30 s), read from the `core` schema: the snapshot's before the configuration's. */
export const DEFAULT_LIVENESS_TIMEOUT_MS: number = PUBLIC_CORE_SCHEMA.shape.livenessTimeoutMs.parse(undefined);

/** `value` for JSON: every `bigint` as decimal text, at any depth; `undefined` as null; frozen. */
export function jsonReady(value: unknown): PlainData {
  if (typeof value === "bigint") return value.toString();
  if (value === undefined) return null;
  if (Array.isArray(value)) return Object.freeze(value.map(jsonReady));
  if (typeof value === "object" && value !== null) {
    return Object.freeze(Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, jsonReady(inner)])));
  }
  return value as PlainData;
}

/** A height as decimal text, or null. */
const height = (value: bigint | null): string | null => (value === null ? null : value.toString());

/** What a snapshot holds besides `status()`. */
export interface SnapshotFacts {
  /** The process's liveness timeout (`livenessTimeoutMs`). */
  readonly livenessTimeoutMs: number;
  /** The process's readiness lag (`readinessLag`), null when none is set. */
  readonly readinessLag: number | null;
  /** The configuration's redaction, for the reason's details; null shows none. */
  readonly redactor: Redactor | null;
  /** The configuration as it may be shown. */
  readonly config: ConfigSnapshot;
}

/** The snapshot of `status` (see the module comment). */
export function snapshotOf(status: ProcessStatus, facts: SnapshotFacts): AdminSnapshot {
  const { ended, reason } = status;
  const error = ended !== null && (ended.kind === "refused" || ended.kind === "failed") ? ended.error : undefined;
  return Object.freeze({
    livenessTimeoutMs: facts.livenessTimeoutMs,
    readinessLag: facts.readinessLag,
    status: Object.freeze({
      state: status.state,
      ready: status.ready,
      conditions: Object.freeze(status.conditions.map((condition) => jsonReady(condition) as PlainObject)),
      cursor: height(status.cursor),
      head: height(status.head),
      lag: height(status.lag),
      reason: reason === null ? null : sanitizedError(reason, error, facts.redactor),
    }),
    config: facts.config,
  });
}
