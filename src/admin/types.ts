/**
 * The admin endpoints' types: the snapshot the runner publishes to the admin worker, what an endpoint sees of it at a
 * request, and what a backbone part's endpoint is. They are types only, so the worker, the backbone parts' endpoints
 * and the browser build share them without loading anything.
 *
 * **The snapshot** ({@link AdminSnapshot}) is `status()` encoded for JSON, plus what the endpoints show of the
 * configuration. `status()` is the runner's `ProcessStatus`: its states, readiness, conditions and reason are the one
 * source, never redefined here. The snapshot is built on the main thread (`./snapshot.ts`), so it holds no secret and
 * no raw error: a height is decimal text (JSON has no `bigint`), the reason is a sanitized error (`./errors.ts`), and
 * the settings are redacted (`./redaction.ts`). It crosses to the worker whole, as one message (structured clone). The
 * worker answers each request from one snapshot, so no answer mixes two publications. The heartbeat is not in it: the
 * worker reads the last tick from shared memory at each request (`../runner/heartbeat.ts`).
 */

import type { PlainData, PlainObject } from "../config/plain-data.js";
import type { NodeConnection } from "../node/client.js";
import type { ProcessState } from "../runner/process.js";

/**
 * A refusal's or halt's reason as an endpoint may show it: the reason's code, height, module and point, a message built
 * from those alone, and the allowlisted fields of the failure's own details. Each field is checked and each text goes
 * through the configuration's redaction; a raw exception message is never shown.
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

/**
 * Which process this is (its instance role): the core, or a private process with its `instanceId`; null until the
 * process's side is known (a handler mounted in a library host answers from the process's start on).
 */
export interface InstanceStatus {
  readonly role: "core" | "private" | null;
  /** A private process's `instanceId`; null on the core. */
  readonly id: string | null;
}

/**
 * The node as the core sees it: what the runner knows of it (the loop's finalized head and conditions, the node
 * client's connection, the block source's best head and queue), `null` where nothing reports a value yet.
 */
export interface NodeStatus {
  /**
   * The node's finalized head (decimal text): the latest one the node source holds, from its finalized-heads
   * subscription, at least the one the loop last read; null before the loop read one.
   */
  readonly finalizedHead: string | null;
  /** The best head the node announced last (decimal text); null before it announced one, or without a node source. */
  readonly bestHead: string | null;
  /** The node connection's state (one of the node client's four); null before the process made its client. */
  readonly connection: NodeConnection | null;
  /** The failures of the node being retried now (`node-retrying`'s attempts); 0 when none is. */
  readonly retries: number;
  /** The best-block queue's length; null for a block source that keeps no queue (not the node's). */
  readonly queueDepth: number | null;
  /** The best-block queue's cap: the process revision's `tipCap`. */
  readonly tipCap: number;
  /** Whether the condition `finality-stall` is raised. */
  readonly finalityStall: boolean;
}

/** One table of a module, with its row of `core_digest.tables`: its last-changed height and digest. */
export interface ModuleTableStatus {
  readonly schema: string;
  readonly table: string;
  /** The height its digest last changed at (decimal text); null while it has no row (never changed). */
  readonly height: string | null;
  /** Its digest, `0x`-prefixed lowercase hex; null while it has no row. */
  readonly digest: string | null;
}

/** One part of the database as `/status` shows it, per module. */
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

/** A private process's view of the public side. */
export interface PublicStatus {
  /** The public cursor: the public database's last committed height, as the private source last read it. */
  readonly cursor: string | null;
  /**
   * Whether the private process runs in lockstep: its core's `hello-ack` listed it (a flag kept for the whole run once
   * startup has seen it). False without a transport; null until startup's chain check knows.
   */
  readonly lockstep: boolean | null;
}

/**
 * One private instance as the core shows it, and nothing else of it:
 * - its id;
 * - whether it is connected;
 * - whether the core lists it in `lockstepInstances`;
 * - its committed height as the core last learned it: from its `hello`, then, for a lockstep instance, from its checked
 *   reports. Decimal text; null when not seen since the core started.
 */
export interface PrivateInstanceStatus {
  readonly id: string;
  readonly connected: boolean;
  readonly lockstep: boolean;
  readonly height: string | null;
}

/** `status()` as the admin endpoints show it (see the module comment): `/status` without its uptime. */
export interface StatusSnapshot {
  readonly state: ProcessState;
  /**
   * Whether it is ready: `status()`'s, by the readiness rule (`core-health`'s `readinessOf`, as `/health/ready`
   * decides).
   */
  readonly ready: boolean;
  /** The process's conditions, heights as decimal text. */
  readonly conditions: readonly PlainObject[];
  /** The last committed height, null before any. */
  readonly cursor: string | null;
  /** `status().head`: the latest finalized head the block source holds, null before the loop read one. */
  readonly head: string | null;
  readonly lag: string | null;
  /** Why the process is refused or halted (kept once it is stopping); null before either. */
  readonly reason: SanitizedError | null;
  readonly instance: InstanceStatus;
  /** When the last height committed, by the wall clock, as RFC 3339 UTC text; null before any commit. */
  readonly lastCommitAt: string | null;
  /** The node, on the core; null on a private process (it never talks to the node), and until the side is known. */
  readonly node: NodeStatus | null;
  /** Every part of the database, in startup order; null until startup resolved them. */
  readonly modules: readonly ModuleStatus[] | null;
  /** The ledger version in effect, its package and its last root check: null, since nothing reports it yet. */
  readonly ledger: null;
  /**
   * On the core, its private instances: every listed instance, connected or not, and every other connected one. Null
   * on a private process, and on the core until startup has opened its database.
   */
  readonly privateInstances: readonly PrivateInstanceStatus[] | null;
  /** On a private process, the public side; null on the core, and until the side is known. */
  readonly public: PublicStatus | null;
}

/** One revision of the configuration in effect, as `/config` shows it. */
export interface EntryView {
  readonly id: string;
  /** As written in the configuration: a whole number. */
  readonly start: number;
  readonly stop: number | null;
  /** A module's semver version, or for `core` the core version. */
  readonly version: PlainData;
  /** Whether the version is this build's. */
  readonly buildVersion: boolean;
  /**
   * Whether it started at or below the cursor startup read (and so was compared with its recorded row); null before.
   */
  readonly started: boolean | null;
  /** Whether it is scheduled: above that cursor, of a version this build does not carry; null before. */
  readonly scheduled: boolean | null;
  /** Its settings as they may be shown (secrets and URL credentials redacted, a `versionEntry` until recorded). */
  readonly settings: PlainObject;
}

/** One row of the configuration history, `core_chain.config`, as `/config` shows it. */
export interface RecordedView {
  readonly id: string;
  /** Decimal text. */
  readonly start: string;
  readonly stop: string | null;
  /** A module's semver, or the core version's canonical JSON. */
  readonly version: string;
  /** The data fields recorded, URL credentials redacted; null for a scheduled revision. */
  readonly data: PlainObject | null;
  /** SHA-256 of the data's canonical encoding, `0x` hex; null with `data`. */
  readonly dataHash: string | null;
}

/** An item a part provides, as its declaration states it. */
export interface ItemView {
  readonly name: string;
  readonly lifetimes: readonly string[];
  readonly table: {
    readonly schema: string;
    readonly tables: readonly string[];
    readonly kind: string;
    /** False for an item opted out of the determinism rules. */
    readonly deterministic: boolean;
  } | null;
}

/** A part's declaration without its callbacks. */
export interface DeclarationView {
  readonly id: string;
  readonly version: string;
  readonly side: "public" | "private";
  readonly origin: "backbone" | "core" | "user";
  readonly requires: readonly string[];
  readonly provides: readonly ItemView[];
  readonly startsMidChain: boolean;
  readonly developmentOnly: boolean;
  readonly requiresResync: boolean;
  readonly needsLockstep: boolean;
  /** Each setting with its kind. */
  readonly settings: Readonly<Record<string, string>>;
  /** Each migration by its id and checksum (SHA-256 of its SQL, lowercase hex). */
  readonly migrations: readonly { readonly id: string; readonly checksum: string }[];
  /** The points it has a callback for, in the order of `POINTS`. */
  readonly points: readonly string[];
}

/** The chain's identity. */
export interface ChainView {
  readonly network: string;
  /** The chain's genesis hash, `0x` hex: configured (network `custom`) until startup checked the chain's. */
  readonly genesisHash: string | null;
  /** S, decimal text. */
  readonly start: string;
  /** The hash of block S, `0x` hex; null until block S commits. */
  readonly anchorHash: string | null;
}

/** The configuration as the admin endpoints show it: null where nothing is known yet. */
export interface ConfigSnapshot {
  /**
   * The process's `core` revision, the latest of the build's version, which gives every operational and secret field:
   * its start and its settings as they may be shown (secret fields and URL credentials redacted). Null before the
   * configuration is validated.
   */
  readonly core: { readonly start: number; readonly settings: PlainObject } | null;
  /** Every revision of the configuration, in its order. */
  readonly entries: readonly EntryView[] | null;
  /** The configuration history as startup read it. */
  readonly history: readonly RecordedView[] | null;
  /** Every part of the database, in startup order, with its declaration. */
  readonly modules: readonly DeclarationView[] | null;
  readonly chain: ChainView | null;
  /** The ledger version table in effect (the process revision's `ledgerTable`) and the build's ledger packages. */
  readonly ledger: { readonly table: PlainData; readonly packages: PlainData } | null;
  /** The database: its backend, the server's version, and whether this process holds its writer lock. */
  readonly database: { readonly backend: "postgres" | "pglite"; readonly version: string | null; readonly writerLock: boolean } | null;
  /** The build: UmbraDB's version; no commit. */
  readonly build: { readonly umbradb: string };
  /**
   * How each surface runs, as the process's network plan has it (`listening`, `connecting`, `mounted`, `channels`,
   * `connect` or `none`); null before the configuration is validated.
   */
  readonly network: { readonly api: string; readonly admin: string; readonly privateLink: string } | null;
}

/** What the runner publishes to the admin worker (see the module comment). */
export interface AdminSnapshot {
  /**
   * The liveness timeout of the process's `core` revision (`livenessTimeoutMs`); the default before it.
   */
  readonly livenessTimeoutMs: number;
  /**
   * The readiness lag of the process's `core` revision (`readinessLag`), null when none is set or before the revision
   * is known. `/health/ready` decides from it, the state and the lag (`core-health`).
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

/** The admin endpoints a backbone part provides (only backbone parts provide admin endpoints). */
export interface AdminPart {
  /** The backbone part's id (`BACKBONE_ORDER`). */
  readonly id: string;
  readonly endpoints: readonly AdminEndpoint[];
}
