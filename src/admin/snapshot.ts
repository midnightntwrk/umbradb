/**
 * The snapshot the runner publishes to the admin worker (`openspec/changes/core-arch/specs/admin-endpoints/spec.md`
 * AE-1, AE-3, AE-5, AE-6; `design.md` §1; CORE-ARCH §4.18): {@link snapshotOf} encodes the runner's `status()` — tasks
 * 5.3 and 5.4's states, readiness, conditions and reason, the one source of them — and what else the runner knows for
 * `/status` (AE-5) for JSON, on the main thread: heights as decimal text (JSON has no `bigint`, 3.2's note (d)), the
 * conditions as the runner raised them, the reason as a sanitized error (`./errors.ts`), never `ended`, which holds the
 * raw error; the wall-clock time of the last commit as RFC 3339 UTC text ({@link utcText}, Q68); the node as the core
 * sees it; every part of the database with its tables' digest rows (DT-5). A field nothing reports a value for yet is
 * null (AE-5). The configuration's part is already redacted (`./redaction.ts`). The result is plain, frozen,
 * structured-clone data: it crosses to the worker as one message, and the worker answers each request from one
 * snapshot. The uptime is not in it: `/status` computes it at each request from {@link AdminSnapshot.startedNs}.
 */

import type { PlainData, PlainObject } from "../config/plain-data.js";
import { type ProcessSide, PUBLIC_CORE_SCHEMA } from "../config/core-settings.js";
import type { Redactor } from "../config/redact.js";
import type { ProcessStatus } from "../runner/process.js";
import { sanitizedError } from "./errors.js";
import type { AdminSnapshot, ConfigSnapshot, ModuleStatus, NodeStatus, StatusSnapshot } from "./types.js";

/** CF-4's default liveness timeout (30 s), read from the `core` schema: the snapshot's before the configuration's. */
export const DEFAULT_LIVENESS_TIMEOUT_MS: number = PUBLIC_CORE_SCHEMA.shape.livenessTimeoutMs.parse(undefined);

/** CF-4's default `tipCap` (600), read from the `core` schema: the snapshot's before the configuration's. */
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
 * represents (Q68): `2025-05-21T14:30:00Z`, with the fraction only when it has one and without its trailing zeros
 * (`…:00.12Z`), as a `timestamptz` reads back (DB-2).
 */
export function utcText(ms: number): string {
  return new Date(ms).toISOString().replace(/\.?0*Z$/, "Z");
}

/** A height as decimal text, or null. */
const height = (value: bigint | null): string | null => (value === null ? null : value.toString());

/** Bytes as `0x`-prefixed lowercase hex. */
const hex = (bytes: Uint8Array): string => `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;

/**
 * One table of a part, by schema and name (named apart from the `deterministic_postgresql` component's `TableName`,
 * A138: no name of the component is declared elsewhere in `src/`).
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

/** One row of `core_digest.tables` (DT-5). */
export interface DigestRow extends PartTable {
  readonly height: bigint;
  readonly digest: Uint8Array;
}

/** The key of a table in a digest map. */
export const tableKey = ({ schema, table }: PartTable): string => JSON.stringify([schema, table]);

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
}

/** The node as the core sees it (see {@link NodeStatus}). */
function nodeOf(status: ProcessStatus, tipCap: number): NodeStatus {
  const retrying = status.conditions.find((condition) => condition.code === "node-retrying") as
    | { readonly attempts: number }
    | undefined;
  return Object.freeze({
    finalizedHead: height(status.head),
    bestHead: null,
    connection: null,
    retries: retrying?.attempts ?? 0,
    queueDepth: null,
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
    node: core ? nodeOf(status, facts.tipCap) : null,
    modules: facts.modules === null ? null : Object.freeze(modulesOf(facts.modules, facts.digests, status.cursor)),
    ledger: null,
    privateInstances: null,
    public: core ? null : Object.freeze({ cursor: height(status.head), lockstep: null }),
  };
  return Object.freeze({
    livenessTimeoutMs: facts.livenessTimeoutMs,
    readinessLag: facts.readinessLag,
    startedNs: facts.startedNs.toString(),
    status: Object.freeze(shown),
    config: facts.config,
  });
}
