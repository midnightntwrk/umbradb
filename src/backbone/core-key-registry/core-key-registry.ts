/**
 * The private backbone part `core-key-registry` (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-8,
 * PP-10; `specs/configuration/spec.md` CF-11; `design.md` §2, §8, §10, §11; CORE-ARCH §4.11, §4.12, §4.14; decision
 * record Q70): the keys a private process has admitted, and the `admitted-keys` item — the keys admitted at a block's
 * height — that its private modules require.
 *
 * **Its table** (`design.md` §10), created by its migration under its own role: `core_key_registry.keys`, one row per
 * admitted key — `key_id` (SHA-256 of the UTF-8 kind followed by the bytes, PP-8; {@link keyIdOf}), `kind`,
 * `key_bytes` and `arrived_height`. It is a module table of the private plan like any other (DT-6, its digest, the
 * contents hash; Q75), and stays in the private database: its bytes never reach the public side (PP-10).
 *
 * **Where keys come from** (Q70). In this change keys enter only as the private `core` entry's configured test keys
 * (CF-11: `testKeys`, `{ kind, bytes, start }`, a secret field, so every revision of this backbone part has the
 * process revision's list, Q102); a key API is not core, and a later module offers one by feeding the registry. Each
 * key's kind must be one a configured private module declares in `keyKinds` and its bytes must pass that module's
 * `validateKey` — the configuration's own check (`../../config/validate.ts`'s rule `test-keys`, `invalid-configuration`,
 * before the database opens).
 *
 * **At startup** (its `on-start-db`, after its migration and before any private module migrates, RN-3's startup order):
 * it reads, for each test key, the row of its id, and refuses startup with `test-key-conflict` ({@link
 * testKeyConflict}) when a key was admitted with another start, or a key not yet admitted starts at or below the
 * private cursor (its handle's height; S − 1 before the first block), whose height has passed; a key admitted with its
 * start is left as it is, at every restart, and a key removed from the list stays admitted. The keys not yet admitted
 * are kept for the run, by their start: a key whose start is h **becomes pending** at h.
 *
 * **Admission** (PP-8). The finalized loop fires `on-key` for each key that becomes pending at h, before h's
 * `on-compute` begins ({@link pendingKeysOf}, the loop's `LoopInput.keys`). When h's `on-compute` begins, this part —
 * the backbone's, run before every module's — takes the keys pending at h, gives each `arrived_height` h and puts them
 * as the `block` item `admitted-keys` (none at a height without one); its `on-db-write` writes them, an id already
 * admitted left unchanged (`ON CONFLICT DO NOTHING`). A height that does not commit and is processed again takes them
 * again (the loop's retry resumes at `on-compute`, so `on-key` does not fire again, the keys being still pending); when
 * processing halts or the process stops or crashes first, the keys pending are dropped with the run, and the next run's
 * startup finds them not admitted and makes them pending again at h.
 *
 * **Privacy** (PP-10): no message of this part holds a key's bytes or its id; a refusal names a key by its place in
 * `testKeys` and its heights.
 */

import { createHash } from "node:crypto";
import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { SchemaWriteHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import {
  defineModule,
  type ModuleDeclaration,
  type PendingKey,
  type ProcessContext,
  type Revision,
} from "../../modules/declaration.js";
import type { PendingKeys } from "../../runner/loop.js";

/** The part's id. */
export const CORE_KEY_REGISTRY_ID = "core-key-registry";

/** `core-key-registry`'s migrations (DB-9): applied once, in order; never changed. */
export const CORE_KEY_REGISTRY_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE core_key_registry.keys (
  key_id bytea PRIMARY KEY CHECK (octet_length(key_id) = 32),
  kind text NOT NULL,
  key_bytes bytea NOT NULL,
  arrived_height bigint NOT NULL
)`,
  },
]);

/** An admitted key (PP-8): its id, kind, bytes and the height it arrived at. */
export interface AdmittedKey {
  readonly keyId: Uint8Array;
  readonly kind: string;
  readonly bytes: Uint8Array;
  readonly arrivedHeight: bigint;
}

/** A configured test key (CF-11), as the `core` entry's validated settings hold it: `bytes` as `0x` hex. */
export interface TestKey {
  readonly kind: string;
  readonly bytes: string;
  readonly start: number;
}

const ARRIVED_SQL = "SELECT arrived_height FROM core_key_registry.keys WHERE key_id = $1";
const ADMIT_SQL = "INSERT INTO core_key_registry.keys (key_id, kind, key_bytes, arrived_height) VALUES ($1, $2, $3, $4)";

/** A key's id (PP-8): SHA-256 of the UTF-8 `kind` followed by `bytes`. */
export function keyIdOf(kind: string, bytes: Uint8Array): Uint8Array {
  return new Uint8Array(createHash("sha256").update(new TextEncoder().encode(kind)).update(bytes).digest());
}

/** Bytes from `0x` hex (a test key's `bytes`, which the configuration's schema holds to lowercase hex pairs). */
const bytesOfHex = (text: string): Uint8Array => new Uint8Array(Buffer.from(text.slice(2), "hex"));

/** A key id as `0x` hex, for a map's key: never shown. */
const idText = (keyId: Uint8Array): string => `0x${Buffer.from(keyId).toString("hex")}`;

/** CF-11's rule, for the refusals' messages. */
const RULE =
  "a test key is admitted once, at its start, and keeps that height at every restart; one not yet admitted must start " +
  "above the private cursor (CF-11)";

/**
 * CF-11's startup check of the configured test keys `keys` against the private database: `admitted` the arrived
 * height of each key admitted (by its id as `0x` hex), `cursor` the private cursor (null before the first block) and
 * `start` S. The refusal (`test-key-conflict`, not retried) of the first key in the list's order that
 * was admitted with another start (`details.reason` `start-changed`) or is not yet admitted and starts at or below the
 * private cursor — S − 1 before the first block — (`start-passed`); null when every key may start. Its message and
 * details name a key by its place in `testKeys` and its heights, never its bytes or its id.
 */
export function testKeyConflict(
  keys: readonly TestKey[],
  admitted: ReadonlyMap<string, bigint>,
  cursor: bigint | null,
  start: bigint,
): UmbraError | null {
  const passed = cursor ?? start - 1n;
  for (const [index, key] of keys.entries()) {
    const at = BigInt(key.start);
    const arrived = admitted.get(idText(keyIdOf(key.kind, bytesOfHex(key.bytes))));
    if (arrived !== undefined && arrived !== at) {
      return new UmbraError(
        "test-key-conflict",
        `the test key testKeys[${index}] was admitted with arrived_height ${arrived}, and the configuration now gives it ` +
          `start ${at}: ${RULE}; give it start ${arrived} again, or remove it from testKeys (it stays admitted)`,
        { reason: "start-changed", index, admitted: arrived.toString(), start: at.toString() },
      );
    }
    if (arrived === undefined && at <= passed) {
      const where =
        cursor === null ? `the start height S − 1 (${passed}) of a new private database` : `the private cursor ${cursor}`;
      return new UmbraError(
        "test-key-conflict",
        `the test key testKeys[${index}] is not admitted, and its start ${at} is at or below ${where}: ${RULE}; ` +
          "give it a start above the private cursor, or give the private process a new database",
        { reason: "start-passed", index, cursor: passed.toString(), start: at.toString() },
      );
    }
  }
  return null;
}

/** A key of a run, not yet admitted. */
interface RunKey {
  readonly keyId: Uint8Array;
  readonly kind: string;
  readonly bytes: Uint8Array;
}

/** One run's keys (see the module comment): those not admitted at startup, by the height they become pending at. */
interface Run {
  readonly byHeight: ReadonlyMap<bigint, readonly RunKey[]>;
}

/** Each run's keys, by the registry's process context (one per process start: a retried startup makes new ones). */
const runs = new WeakMap<ProcessContext, Run>();

/** A frozen pending key with byte arrays of its own. */
const pendingOf = (key: RunKey): PendingKey =>
  Object.freeze({ keyId: new Uint8Array(key.keyId), kind: key.kind, bytes: new Uint8Array(key.bytes) });

/** The run of `context`; throws when its `on-start-db` did not complete (it refused, or startup has not reached it). */
function runOf(context: ProcessContext): Run {
  const run = runs.get(context);
  if (run === undefined) {
    throw new Error(
      "core-key-registry has no keys for this process context: its on-start-db has not completed, which the runner " +
        "runs at startup, before the loop asks for pending keys",
    );
  }
  return run;
}

/**
 * The keys that become pending at each height of the run of the registry's process context `context` (the runner's
 * `contexts.of(CORE_KEY_REGISTRY_ID)`), for the loop's `on-key` (`LoopInput.keys`): each call gives frozen keys with
 * byte arrays of their own.
 */
export function pendingKeysOf(context: ProcessContext): PendingKeys {
  return Object.freeze({
    at: (height: bigint) => Object.freeze((runOf(context).byHeight.get(height) ?? []).map(pendingOf)),
  });
}

/** Options of {@link coreKeyRegistry}: the negative controls'. */
export interface KeyRegistryOptions {
  /**
   * `once` (the registry): a key admitted is never pending again. `again` (A123's negative control): every configured
   * key is pending at its start or, when that has passed, at the first height after the private cursor — no startup
   * check —, and its write replaces the row's `arrived_height`.
   */
  readonly admission?: "once" | "again";
}

/** The configured test keys of the part's revisions (every revision has the process revision's secret fields, Q102). */
const testKeysOf = (p: ProcessContext): readonly TestKey[] =>
  ((p.revisions[0] as Revision | undefined)?.settings.testKeys as readonly TestKey[] | undefined) ?? [];

/** The arrived height of each of `keys` the private database admitted, by its id (see {@link testKeyConflict}). */
async function admittedOf(w: SchemaWriteHandle, keys: readonly TestKey[]): Promise<Map<string, bigint>> {
  const admitted = new Map<string, bigint>();
  for (const key of keys) {
    const keyId = keyIdOf(key.kind, bytesOfHex(key.bytes));
    const [row] = await w.query(ARRIVED_SQL, [keyId]);
    if (row !== undefined) admitted.set(idText(keyId), row.arrived_height as bigint);
  }
  return admitted;
}

/**
 * `core-key-registry` (see the module comment), with the negative controls' `options`: a backbone part of a private
 * process, after `core-private-source` in RN-3's fixed order, providing `admitted-keys` — a `block` item, and the
 * `table` item of `core_key_registry.keys`.
 */
export function coreKeyRegistry(options: KeyRegistryOptions = {}): ModuleDeclaration {
  const again = options.admission === "again";
  const write = again
    ? `${ADMIT_SQL} ON CONFLICT (key_id) DO UPDATE SET arrived_height = EXCLUDED.arrived_height`
    : `${ADMIT_SQL} ON CONFLICT (key_id) DO NOTHING`;
  return defineModule({
    id: CORE_KEY_REGISTRY_ID,
    version: UMBRADB_VERSION,
    side: "private",
    requires: [],
    provides: [
      {
        name: "admitted-keys",
        lifetimes: ["block", "table"],
        table: { schema: "core_key_registry", tables: ["keys"], kind: "append-only" },
      },
    ],
    // Every backbone part starts at S, which is a mid-chain start when S is above genesis (Q96).
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: CORE_KEY_REGISTRY_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
    points: {
      async "on-start-db"(p, w) {
        const keys = testKeysOf(p);
        // A backbone part's revisions are the `core` entry's, in start order: the first one's start is S.
        const start = (p.revisions[0] as Revision).start;
        const admitted = await admittedOf(w, keys);
        if (!again) {
          const refusal = testKeyConflict(keys, admitted, w.height, start);
          if (refusal !== null) throw refusal;
        }
        const next = w.height === null ? start : w.height + 1n;
        const byHeight = new Map<bigint, RunKey[]>();
        for (const key of keys) {
          const keyId = keyIdOf(key.kind, bytesOfHex(key.bytes));
          if (!again && admitted.has(idText(keyId))) continue;
          const height = again && BigInt(key.start) < next ? next : BigInt(key.start);
          const pending: RunKey = Object.freeze({ keyId, kind: key.kind, bytes: bytesOfHex(key.bytes) });
          byHeight.set(height, [...(byHeight.get(height) ?? []), pending]);
        }
        runs.set(p, Object.freeze({ byHeight }));
      },
      async "on-compute"(p, b, _read, out) {
        const keys = runOf(p).byHeight.get(b.height) ?? [];
        out.put(
          "admitted-keys",
          Object.freeze(keys.map((key) => Object.freeze({ ...pendingOf(key), arrivedHeight: b.height }))),
        );
      },
      async "on-db-write"(_p, b, w) {
        for (const key of b.items.get("admitted-keys") as readonly AdmittedKey[]) {
          await w.execute(write, [key.keyId, key.kind, key.bytes, key.arrivedHeight]);
        }
      },
    },
  });
}

/** `core-key-registry` (see the module comment). */
export const CORE_KEY_REGISTRY: ModuleDeclaration = coreKeyRegistry();
