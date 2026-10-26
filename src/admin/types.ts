/**
 * The admin endpoints' types (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1, AE-3, AE-5, AE-6;
 * `design.md` §1; CORE-ARCH §4.18; decision record Q70): the snapshot the runner publishes to the admin worker, what
 * an endpoint sees of it at a request, and what a backbone part's endpoint is. Types only, so the worker, the backbone
 * parts' endpoints and the browser build (task 16.x) share them without loading anything.
 *
 * **The snapshot** ({@link AdminSnapshot}) is `status()` (the runner's `ProcessStatus`, tasks 5.3 and 5.4: its states,
 * readiness, conditions and reason are the one source, never redefined here) encoded for JSON, and what the endpoints
 * show of the configuration — built on the main thread (`./snapshot.ts`), so it holds no secret and no raw error: a
 * height is decimal text (JSON has no `bigint`), the reason a sanitized error (`./errors.ts`), the settings redacted
 * (`./redaction.ts`). It crosses to the worker whole, as one message (structured clone); the worker answers each request
 * from one snapshot, so no answer mixes two publications. The heartbeat is not in it: the worker reads the last tick
 * from shared memory at each request (`../runner/heartbeat.ts`).
 */

import type { PlainData, PlainObject } from "../config/plain-data.js";
import type { ProcessState } from "../runner/process.js";

/**
 * A refusal's or halt's reason as an endpoint may show it (AE-6): the reason's code, height, module and point, a
 * message built from those alone, and the allowlisted fields of the failure's own details, each checked and each text
 * through the configuration's redaction — never a raw exception message.
 */
export interface SanitizedError {
  readonly code: string;
  /** Decimal text; null for a refusal. */
  readonly height: string | null;
  readonly module: string | null;
  readonly point: string | null;
  /** The code and the fields above, in words: `callback-error at height 5, module m, point on-compute`. */
  readonly message: string;
  /** The allowlisted fields of the failure's details (`ALLOWED_DETAILS`, `./errors.ts`). */
  readonly details: PlainObject;
}

/** `status()` as the admin endpoints show it (see the module comment). */
export interface StatusSnapshot {
  readonly state: ProcessState;
  /** `/health/ready` (AE-4's order is `status()`'s). */
  readonly ready: boolean;
  /** The process's conditions (AE-3), heights as decimal text. */
  readonly conditions: readonly PlainObject[];
  /** The last committed height, null before any. */
  readonly cursor: string | null;
  /** The finalized head the loop last read, null before it read one. */
  readonly head: string | null;
  readonly lag: string | null;
  /** Why the process is refused or halted (kept once it is stopping); null before either. */
  readonly reason: SanitizedError | null;
}

/** The configuration as the admin endpoints show it. */
export interface ConfigSnapshot {
  /**
   * The process's `core` revision (Q102: the latest of the build's version gives every operational and secret field):
   * its start and its settings as they may be shown (secret fields and URL credentials redacted); null before the
   * configuration is validated.
   */
  readonly core: { readonly start: number; readonly settings: PlainObject } | null;
}

/** What the runner publishes to the admin worker (see the module comment). */
export interface AdminSnapshot {
  /** The liveness timeout of the process's `core` revision (`livenessTimeoutMs`, AE-2); CF-4's default before it. */
  readonly livenessTimeoutMs: number;
  readonly status: StatusSnapshot;
  readonly config: ConfigSnapshot;
}

/** What an endpoint sees at a request: the latest snapshot, and the heartbeat's age measured then. */
export interface AdminView {
  readonly snapshot: AdminSnapshot;
  /** Milliseconds since the runner's last heartbeat tick, as the worker read it at this request. */
  readonly beatAgeMs: number;
}

/** An endpoint's answer: its status and its body, written as JSON. */
export interface AdminAnswer {
  readonly status: number;
  readonly body: PlainData | StatusSnapshot | ConfigSnapshot;
}

/** One admin endpoint: `GET` of its path, answered by a function of the snapshot (it reads no database). */
export interface AdminEndpoint {
  /** The exact path, from `/`. */
  readonly path: string;
  answer(view: AdminView): AdminAnswer;
}

/** The admin endpoints a backbone part provides (Q70: only backbone parts provide admin endpoints). */
export interface AdminPart {
  /** The backbone part's id (`BACKBONE_ORDER`). */
  readonly id: string;
  readonly endpoints: readonly AdminEndpoint[];
}
