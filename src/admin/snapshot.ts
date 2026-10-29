/**
 * The snapshot the runner publishes to the admin worker. On the main thread, {@link snapshotOf} encodes for JSON the
 * runner's `status()` (its states, readiness, conditions and reason, of which it is the one source) and what else the
 * runner knows for `/status`:
 * - heights as decimal text, since JSON has no `bigint`;
 * - the conditions as the runner raised them;
 * - the reason as a sanitized error (`./errors.ts`), never `ended`, which holds the raw error [AE-6];
 * - the wall-clock time of the last commit as RFC 3339 UTC text ({@link utcText}) [Q68];
 * - the node as the core sees it: its best head, connection state and queue depth, as the process reports them
 *   ({@link NodeFacts});
 * - every part of the database, with its tables' digest rows [DT-5];
 * - on the core, its private instances, each with its id, connection, lockstep flag and synced height only; on a
 *   private process, whether it runs in lockstep [PP-9].
 *
 * A field that nothing reports a value for yet is null. The configuration's part is already redacted
 * (`./redaction.ts`). [AE-3, AE-5]
 *
 * The result is plain, frozen, structured-clone data: it crosses to the worker as one message, and the worker answers
 * each request from one snapshot. The uptime is not in it: `/status` computes it at each request from
 * {@link AdminSnapshot.startedNs}. [AE-1; CORE-ARCH §4.18; design §1]
 */

import type { PlainData, PlainObject } from "../config/plain-data.js";
import { type ProcessSide, PUBLIC_CORE_SCHEMA } from "../config/core-settings.js";
import type { Redactor } from "../config/redact.js";
import type { NodeConnection } from "../node/client.js";
import type { ProcessStatus } from "../runner/process.js";
import { sanitizedError } from "./errors.js";
import type { AdminSnapshot, ConfigSnapshot, ModuleStatus, NodeStatus, PrivateInstanceStatus, StatusSnapshot } from "./types.js";

/**
 * The default liveness timeout (30 s), read from the `core` schema: the snapshot's before the configuration's. [CF-4]
 */
export const DEFAULT_LIVENESS_TIMEOUT_MS: number = PUBLIC_CORE_SCHEMA.shape.livenessTimeoutMs.parse(undefined);

/** The default `tipCap` (600), read from the `core` schema: the snapshot's before the configuration's. [CF-4] */
export const DEFAULT_TIP_CAP: number = PUBLIC_CORE_SCHEMA.shape.tipCap.parse(undefined);

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

/**
 * A wall-clock time (milliseconds since the epoch) as RFC 3339 UTC text, the form UmbraDB writes every time it
 * represents: `2025-05-21T14:30:00Z`, with the fraction only when it has one and without its trailing zeros
 * (`…:00.12Z`), as a `timestamptz` reads back. [Q68, DB-2]
 */
export function utcText(ms: number): string {
  return new Date(ms).toISOString().replace(/\.?0*Z$/, "Z");
}

/** A height as decimal text, or null. */
const height = (value: bigint | null): string | null => (value === null ? null : value.toString());

/** Bytes as `0x`-prefixed lowercase hex. */
const hex = (bytes: Uint8Array): string => `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;

/**
 * One table of a part, by schema and name. It is named apart from the `deterministic_postgresql` component's
 * `TableName`, since no name of the component is declared elsewhere in `src/`. [A138]
 */
export interface PartTable {
  readonly schema: string;
  readonly table: string;
}

/** What the snapshot shows of one part of the database besides its digests (see {@link ModuleStatus}). */
export interface ModuleFacts {
  readonly id: string;
  readonly version: string;
  readonly side: ProcessSide;
  readonly origin: ModuleStatus["origin"];
  readonly start: bigint | null;
  readonly stop: bigint | null;
  readonly tables: readonly PartTable[];
}

/** One row of `core_digest.tables`. [DT-5] */
export interface DigestRow extends PartTable {
  readonly height: bigint;
  readonly digest: Uint8Array;
}

/** The key of a table in a digest map. */
export const tableKey = ({ schema, table }: PartTable): string => JSON.stringify([schema, table]);

/** One private instance as the core knows it (`src/private/instances.ts`): the four fields `/status` shows. [PP-9] */
export interface PrivateInstanceFacts {
  readonly id: string;
  readonly connected: boolean;
  readonly lockstep: boolean;
  readonly height: bigint | null;
}

/**
 * What the process knows of its node besides `status()`: the best head the node announced last and the best-block
 * queue's length, as its block source reports them (`BlockSource.nodeView`), and its node client's connection state.
 * Each is null when the process cannot tell (no node source, no client yet). [AE-5]
 */
export interface NodeFacts {
  readonly bestHead: bigint | null;
  readonly connection: NodeConnection | null;
  readonly queueDepth: number | null;
}

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
  /** When the process started: `process.hrtime.bigint()`. */
  readonly startedNs: bigint;
  /** The process's side: the core (`public`) or a private process. */
  readonly side: ProcessSide;
  /** A private process's `instanceId`; null on the core, or before the configuration gives it. */
  readonly instanceId: string | null;
  /** The process revision's `tipCap`. */
  readonly tipCap: number;
  /** When the last height committed, wall-clock milliseconds; null before any commit. */
  readonly lastCommitMs: number | null;
  /** Every part of the database, in startup order; null until startup resolved them. */
  readonly modules: readonly ModuleFacts[] | null;
  /** `core_digest.tables` as last read, by {@link tableKey}. */
  readonly digests: ReadonlyMap<string, DigestRow>;
  /** On the core, its private instances now; none unless given. [PP-9] */
  readonly privateInstances?: readonly PrivateInstanceFacts[];
  /** On a private process, whether it runs in lockstep, null while unknown; null unless given. */
  readonly publicLockstep?: boolean | null;
  /** On the core, its node besides `status()`; the three null unless given. A private process has none. */
  readonly node?: NodeFacts;
}

/** The private instances as `/status` shows them: the four fields of each, its height as text, nothing else. [PP-9] */
function instancesOf(instances: readonly PrivateInstanceFacts[]): readonly PrivateInstanceStatus[] {
  return Object.freeze(
    instances.map((instance) =>
      Object.freeze({
        id: instance.id,
        connected: instance.connected,
        lockstep: instance.lockstep,
        height: height(instance.height),
      }),
    ),
  );
}

/** The node as the core sees it (see {@link NodeStatus}): `status()`'s, and `node`'s three facts. */
function nodeOf(status: ProcessStatus, tipCap: number, node: NodeFacts | undefined): NodeStatus {
  const retrying = status.conditions.find((condition) => condition.code === "node-retrying") as
    | { readonly attempts: number }
    | undefined;
  return Object.freeze({
    finalizedHead: height(status.head),
    bestHead: height(node?.bestHead ?? null),
    connection: node?.connection ?? null,
    retries: retrying?.attempts ?? 0,
    queueDepth: node?.queueDepth ?? null,
    tipCap,
    finalityStall: status.conditions.some((condition) => (condition.code as string) === "finality-stall"),
  });
}

/** The parts of the database with their digests and whether the cursor reached their stop. */
function modulesOf(modules: readonly ModuleFacts[], digests: ReadonlyMap<string, DigestRow>, cursor: bigint | null): ModuleStatus[] {
  return modules.map((part) =>
    Object.freeze({
      id: part.id,
      version: part.version,
      side: part.side,
      origin: part.origin,
      start: height(part.start),
      stop: height(part.stop),
      stopped: part.stop !== null && cursor !== null && cursor >= part.stop,
      tables: Object.freeze(
        part.tables.map((table) => {
          const row = digests.get(tableKey(table));
          return Object.freeze({
            schema: table.schema,
            table: table.table,
            height: row === undefined ? null : row.height.toString(),
            digest: row === undefined ? null : hex(row.digest),
          });
        }),
      ),
    }),
  );
}

/** The snapshot of `status` (see the module comment). */
export function snapshotOf(status: ProcessStatus, facts: SnapshotFacts): AdminSnapshot {
  const { ended, reason } = status;
  const error = ended !== null && (ended.kind === "refused" || ended.kind === "failed") ? ended.error : undefined;
  const core = facts.side === "public";
  const shown: StatusSnapshot = {
    state: status.state,
    ready: status.ready,
    conditions: Object.freeze(status.conditions.map((condition) => jsonReady(condition) as PlainObject)),
    cursor: height(status.cursor),
    head: height(status.head),
    lag: height(status.lag),
    reason: reason === null ? null : sanitizedError(reason, error, facts.redactor),
    // The public `core` schema has no `instanceId`: on the core it is null.
    instance: Object.freeze({ role: core ? "core" : "private", id: facts.instanceId }),
    lastCommitAt: facts.lastCommitMs === null ? null : utcText(facts.lastCommitMs),
    node: core ? nodeOf(status, facts.tipCap, facts.node) : null,
    modules: facts.modules === null ? null : Object.freeze(modulesOf(facts.modules, facts.digests, status.cursor)),
    ledger: null,
    // The core's instances once startup opened the database (its parts known); a private process has none.
    privateInstances: !core || facts.modules === null ? null : instancesOf(facts.privateInstances ?? []),
    public: core ? null : Object.freeze({ cursor: height(status.head), lockstep: facts.publicLockstep ?? null }),
  };
  return Object.freeze({
    livenessTimeoutMs: facts.livenessTimeoutMs,
    readinessLag: facts.readinessLag,
    startedNs: facts.startedNs.toString(),
    status: Object.freeze(shown),
    config: facts.config,
  });
}
