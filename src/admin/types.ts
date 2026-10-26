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

/** Which process this is (AE-5's instance role): the core, or a private process with its `instanceId` (CF-4). */
export interface InstanceStatus {
  readonly role: "core" | "private";
  /** A private process's `instanceId`; null on the core. */
  readonly id: string | null;
}

/**
 * The node as the core sees it (AE-5): what the runner knows of it, `null` where nothing reports a value yet (the
 * block source's best head, connection and queue are task 10.3's).
 */
export interface NodeStatus {
  /** The node's finalized head the loop last read (decimal text), null before it read one. */
  readonly finalizedHead: string | null;
  /** The node's best head (decimal text); null until the block source reports it. */
  readonly bestHead: string | null;
  /** The node connection's state; null until the block source reports it. */
  readonly connection: null;
  /** The failures of the node being retried now (`node-retrying`'s attempts, IN-10); 0 when none is. */
  readonly retries: number;
  /** The best-block queue's depth (IN-6); null until the block source reports it. */
  readonly queueDepth: number | null;
  /** The best-block queue's cap: the process revision's `tipCap` (CF-4, IN-6). */
  readonly tipCap: number;
  /** Whether the condition `finality-stall` is raised (IN-6, AE-3). */
  readonly finalityStall: boolean;
}

/** One table of a module, with its row of `core_digest.tables` (DT-5): its last-changed height and digest. */
export interface ModuleTableStatus {
  readonly schema: string;
  readonly table: string;
  /** The height its digest last changed at (decimal text); null while it has no row (never changed). */
  readonly height: string | null;
  /** Its digest, `0x`-prefixed lowercase hex; null while it has no row. */
  readonly digest: string | null;
}

/** One part of the database as `/status` shows it (AE-5's "per module"). */
export interface ModuleStatus {
  readonly id: string;
  /** The version the build carries. */
  readonly version: string;
  readonly side: "public" | "private";
  /** Whether it is a backbone part, a core module or a user module. */
  readonly origin: "backbone" | "core" | "user";
  /** Its first revision's start (decimal text); null for a part without a revision. */
  readonly start: string | null;
  /** Its last revision's stop (decimal text); null when it has none. */
  readonly stop: string | null;
  /** Whether the cursor has reached its stop: it processes no more heights. */
  readonly stopped: boolean;
  /** Its table items' tables, each with its digest row. */
  readonly tables: readonly ModuleTableStatus[];
}

/** A private process's view of the public side (AE-5). */
export interface PublicStatus {
  /** The public cursor: the public database's last committed height, as the private source last read it. */
  readonly cursor: string | null;
  /** Whether the private process runs in lockstep; null until task 14.3 reports it. */
  readonly lockstep: null;
}

/** `status()` as the admin endpoints show it (see the module comment): `/status` without its uptime. */
export interface StatusSnapshot {
  readonly state: ProcessState;
  /** Whether it is ready: `status()`'s, by AE-4's order (`core-health`'s `readinessOf`, as `/health/ready` decides). */
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
  readonly instance: InstanceStatus;
  /** When the last height committed, by the wall clock, as RFC 3339 UTC text (Q68); null before any commit. */
  readonly lastCommitAt: string | null;
  /** The node, on the core; null on a private process (it never talks to the node). */
  readonly node: NodeStatus | null;
  /** Every part of the database, in startup order; null until startup resolved them. */
  readonly modules: readonly ModuleStatus[] | null;
  /** The ledger version in effect, its package and its last root check; null until the ledger tasks (12.x) report it. */
  readonly ledger: null;
  /** On the core, its private instances; null until the private-process tasks (14.x) report them. */
  readonly privateInstances: null;
  /** On a private process, the public side; null on the core. */
  readonly public: PublicStatus | null;
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
  /**
   * The readiness lag of the process's `core` revision (`readinessLag`, AE-4), null when none is set or before the
   * revision is known; `/health/ready` decides from it with the state and the lag (`core-health`, task 8.2).
   */
  readonly readinessLag: number | null;
  /** When the process started, `process.hrtime.bigint()` as decimal text: `/status` computes its uptime from it. */
  readonly startedNs: string;
  readonly status: StatusSnapshot;
  readonly config: ConfigSnapshot;
}

/** What an endpoint sees at a request: the latest snapshot, the heartbeat's age and the clock, read at the request. */
export interface AdminView {
  readonly snapshot: AdminSnapshot;
  /** Milliseconds since the runner's last heartbeat tick, as the worker read it at this request. */
  readonly beatAgeMs: number;
  /** `process.hrtime.bigint()` at this request: the monotonic clock every thread of the process reads alike. */
  readonly nowNs: bigint;
}

/** An endpoint's answer: its status and its body, written as JSON. */
export interface AdminAnswer {
  readonly status: number;
  readonly body: PlainData | StatusBody | ConfigSnapshot;
}

/** `/status`'s body: the published status and the uptime at the request. */
export interface StatusBody extends StatusSnapshot {
  /** Milliseconds since the process started, by the monotonic clock. */
  readonly uptimeMs: number;
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
