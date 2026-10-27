import { privateCursorHeight } from "../../src/backbone/core-private-source/index.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { PrivateBackend, TestDatabase } from "./backends.js";
import {
  privateModule,
  type PrivateOptions,
  type PublicCore,
  refusalOf,
  startPrivate,
  startPublicCore,
} from "./builds.js";

/**
 * A146 (DT-3, DT-6, PP-1, Q75; task 14.1): one set of determinism rules for every module table. Imports nothing of
 * Vitest, so that the negative control's file (`determinism.negative-control.test.ts`, which replaces the schema plan)
 * runs the same checks.
 *
 * - A private module table with a `serial` column, a `now()` default or a `double precision` column refuses the private
 *   process's startup with the same code and message as the same table in a module of the core.
 * - Two private instances with the same configuration — test keys included —, bound to the same public database, have
 *   equal contents hashes at the same height; a third whose module's data setting differs has another.
 */

/** The three tables of A146, by what makes them non-deterministic. */
export const A146_TABLES: readonly { readonly name: string; readonly sql: string }[] = [
  { name: "a serial column", sql: "CREATE TABLE m.t (height bigint PRIMARY KEY, n serial)" },
  { name: "a now() default", sql: "CREATE TABLE m.t (height bigint PRIMARY KEY, at timestamptz NOT NULL DEFAULT now())" },
  { name: "a double precision column", sql: "CREATE TABLE m.t (height bigint PRIMARY KEY, x double precision)" },
];

/** A refusal's code and message, or "started" when startup did not refuse. */
export type Refusal = { readonly code: string | null; readonly message: string; readonly state?: string } | "started";

/** The core's and the private process's refusal of one table. */
export interface TableRefusals {
  readonly table: string;
  readonly core: Refusal;
  readonly private: Refusal;
}

/** A module `m` of the core with one migration: its table `m.t`. */
function publicM(sql: string): ModuleDeclaration {
  return {
    id: "m",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "m-rows", lifetimes: ["table"], table: { schema: "m", tables: ["t"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: privateModule("m", []).configSchema,
    migrations: [{ id: "001", sql }],
    points: {},
  };
}

/** The same module `m` of a private process. */
function privateM(sql: string): ModuleDeclaration {
  return {
    ...publicM(sql),
    side: "private",
    requires: ["admitted-keys"],
  };
}

/** The core's refusal of `m` with `sql` on a new public database. */
async function coreRefusal(backend: PrivateBackend, sql: string): Promise<Refusal> {
  const db = await backend.database("public");
  try {
    const core = await startPublicCore({
      database: db.setting,
      head: 1n,
      modules: [publicM(sql)],
      entries: [{ id: "m", start: 1, version: "1.0.0", config: {} }],
    });
    await core.stop();
    return "started";
  } catch (error) {
    const { code, message } = error as { readonly code?: string; readonly message: string };
    return { code: code ?? null, message };
  }
}

/** A private start's options against `core`'s public database `db`. */
export function against(backend: PrivateBackend, db: TestDatabase, core: PublicCore, rest: PrivateOptions): PrivateOptions {
  return backend.kind === "postgres"
    ? { ...rest, publicDatabase: db.readerSetting as string }
    : { ...rest, direct: () => core.db() };
}

/** Each of {@link A146_TABLES} refused by the core and by a private process bound to a running public core. */
export async function a146Refusals(backend: PrivateBackend): Promise<TableRefusals[]> {
  const publicDb = await backend.database("public");
  const core = await startPublicCore({ database: publicDb.setting, head: 1n });
  const found: TableRefusals[] = [];
  try {
    for (const table of A146_TABLES) {
      const privateDb = await backend.database("private");
      const options = against(backend, publicDb, core, {
        database: privateDb.setting,
        modules: [privateM(table.sql)],
        entries: [{ id: "m", start: 1, version: "1.0.0", config: {} }],
      });
      let refused: Refusal;
      try {
        const refusal = await refusalOf(options);
        refused = { code: refusal.code, message: (refusal.error as Error).message, state: refusal.state };
      } catch {
        refused = "started";
      }
      found.push({ table: table.name, core: await coreRefusal(backend, table.sql), private: refused });
    }
  } finally {
    await core.stop();
  }
  return found;
}

/** A146's refusal half: every problem with what was observed, none when it holds. */
export function a146RefusalProblems(found: readonly TableRefusals[]): string[] {
  const problems: string[] = [];
  for (const { table, core, private: refused } of found) {
    if (core === "started") {
      problems.push(`the core started with ${table}`);
      continue;
    }
    if (refused === "started") {
      problems.push(`the private process started with ${table}`);
      continue;
    }
    if (refused.state !== "refused") problems.push(`with ${table} the private process was ${refused.state}, not refused`);
    if (refused.code !== core.code) problems.push(`${table}: the private process refused with ${refused.code}, the core with ${core.code}`);
    if (refused.message !== core.message) {
      problems.push(`${table}: the private process's message differs from the core's: ${refused.message} | ${core.message}`);
    }
  }
  return problems;
}

/** The test keys both instances are configured with (CF-11): obviously fake bytes, admitted at 5 (task 14.4). */
export const TEST_KEYS = [{ kind: "viewing", bytes: "0x0102030405", start: 5 }];

/** `pm` declaring the test keys' kind (PP-8, CF-11: a configured module declares it, and its `validateKey` takes them). */
const KEYED = { keyKinds: ["viewing"], validateKey: (_kind: string, bytes: Uint8Array) => bytes.length > 0 };

const HEAD = 20n;

/** What the hash half saw: the cursor, the contents hash and the admitted keys of each instance's private database. */
export interface InstanceHashes {
  readonly cursors: readonly (bigint | null)[];
  readonly hashes: readonly string[];
  /** Each instance's `core_key_registry.keys`: `<kind> <bytes> <arrived_height>` per row. */
  readonly keys: readonly (readonly string[])[];
}

/** Runs a public core to {@link HEAD} and three private instances to it, then hashes their databases. */
export async function a146Hashes(backend: PrivateBackend): Promise<InstanceHashes> {
  const publicDb = await backend.database("public");
  const core = await startPublicCore({ database: publicDb.setting, head: HEAD });
  try {
    const cursors: (bigint | null)[] = [];
    const hashes: string[] = [];
    const keys: string[][] = [];
    // Instances 1 and 2 differ only in their instance ids and databases (operational and secret fields); 3 in `salt`.
    for (const [instanceId, salt] of [["instance-1", 0], ["instance-2", 0], ["instance-3", 7]] as const) {
      const privateDb = await backend.database("private");
      const running = await startPrivate(
        against(backend, publicDb, core, {
          database: privateDb.setting,
          instanceId,
          salt,
          testKeys: TEST_KEYS,
          modules: [privateModule("pm", [], KEYED)],
        }),
      );
      try {
        await running.reach(HEAD);
        cursors.push(running.handle.status().cursor);
      } finally {
        await running.stop();
      }
      const hash = await privateDb.read((read) => contentsHash(read), privateCursorHeight);
      hashes.push(Buffer.from(hash).toString("hex"));
      const rows = await privateDb.read(
        (read) => read.query("SELECT kind, key_bytes, arrived_height FROM core_key_registry.keys ORDER BY key_id"),
        privateCursorHeight,
      );
      keys.push(rows.map((row) => `${String(row.kind)} 0x${Buffer.from(row.key_bytes as Uint8Array).toString("hex")} ${String(row.arrived_height)}`));
    }
    return { cursors, hashes, keys };
  } finally {
    await core.stop();
  }
}

/** A146's hash half: every problem with what was observed, none when it holds. */
export function a146HashProblems(observed: InstanceHashes): string[] {
  const problems: string[] = [];
  if (observed.cursors.some((cursor) => cursor !== HEAD)) {
    problems.push(`the instances stopped at ${observed.cursors.join(",")}, not all at ${HEAD}`);
  }
  const [one, two, three] = observed.hashes;
  if (one !== two) problems.push(`two instances with the same configuration hash ${one} and ${two}`);
  if (three === one) problems.push("an instance whose module's data differs hashes the same");
  // The test keys admitted (task 14.4): each instance holds the key with arrived_height 5, its start.
  for (const [index, rows] of observed.keys.entries()) {
    if (rows.join(" | ") !== "viewing 0x0102030405 5") problems.push(`instance ${index + 1} holds the keys ${rows.join(" | ") || "none"}`);
  }
  return problems;
}

// ── A147's private part (MD-1, DT-3, DT-4, DT-6, Q76; task 7.1 left it to 14.1) ───────────────────────────────────

/**
 * A private module `po` whose `table` item `po-log` is declared `deterministic: false` (unless `flag` says otherwise):
 * `po.log` has a `serial` key and a `now()` default, and each block writes the instance's id into it; beside it the
 * deterministic `po.rows`, each height once.
 */
export function optedOutModule(flag: { readonly deterministic?: false } = { deterministic: false }): ModuleDeclaration {
  return {
    id: "po",
    version: "1.0.0",
    side: "private",
    requires: ["admitted-keys", "config"],
    provides: [
      { name: "po-rows", lifetimes: ["table"], table: { schema: "po", tables: ["rows"], kind: "append-only" } },
      { name: "po-log", lifetimes: ["table"], table: { schema: "po", tables: ["log"], kind: "append-only", ...flag } },
    ],
    startsMidChain: true,
    configSchema: privateModule("po", []).configSchema,
    migrations: [
      {
        id: "001",
        sql:
          "CREATE TABLE po.rows (height bigint PRIMARY KEY); " +
          "CREATE TABLE po.log (n serial PRIMARY KEY, at timestamptz NOT NULL DEFAULT now(), note text NOT NULL)",
      },
    ],
    points: {
      async "on-db-write"(p, b, w) {
        await w.execute("INSERT INTO po.rows (height) VALUES ($1)", [b.height]);
        const config = p.items.get("config") as { readonly entries: readonly { readonly id: string; readonly settings: unknown }[] };
        const core = config.entries.find((entry) => entry.id === "core")?.settings as { readonly instanceId: string };
        await w.execute("INSERT INTO po.log (note) VALUES ($1)", [core.instanceId]);
      },
    },
  };
}

/** What A147's private part saw. */
export interface OptedOutObservation {
  readonly hashes: readonly string[];
  /** Each instance's rows of `po.log`'s notes, and whether `core_digest.tables` has a row for `po.log`. */
  readonly notes: readonly (readonly string[])[];
  readonly digested: readonly boolean[];
  readonly refusal: Refusal;
}

/** Two private instances with `po` to height 6, their hashes and digests; then `po` without the flag. */
export async function optedOutRun(backend: PrivateBackend): Promise<OptedOutObservation> {
  const publicDb = await backend.database("public");
  const core = await startPublicCore({ database: publicDb.setting, head: 6n });
  const entries = [{ id: "po", start: 1, version: "1.0.0", config: {} }];
  try {
    const hashes: string[] = [];
    const notes: string[][] = [];
    const digested: boolean[] = [];
    for (const instanceId of ["instance-1", "instance-2"]) {
      const privateDb = await backend.database("private");
      const options = against(backend, publicDb, core, { database: privateDb.setting, instanceId, modules: [optedOutModule()], entries });
      const running = await startPrivate(options);
      try {
        await running.reach(6n);
      } finally {
        await running.stop();
      }
      const optedOut = [{ schema: "po", table: "log" }];
      hashes.push(Buffer.from(await privateDb.read((read) => contentsHash(read, { optedOut }), privateCursorHeight)).toString("hex"));
      const seen = await privateDb.read(
        async (read) => ({
          notes: (await read.query("SELECT note FROM po.log ORDER BY n")).map((row) => String(row.note)),
          digest: (await read.query(`SELECT 1 FROM core_digest.tables WHERE "schema" = 'po' AND "table" = 'log'`)).length > 0,
        }),
        privateCursorHeight,
      );
      notes.push(seen.notes);
      digested.push(seen.digest);
    }
    const strict = await backend.database("private");
    let refusal: Refusal;
    try {
      const refused = await refusalOf(against(backend, publicDb, core, { database: strict.setting, modules: [optedOutModule({})], entries }));
      refusal = { code: refused.code, message: (refused.error as Error).message, state: refused.state };
    } catch {
      refusal = "started";
    }
    return { hashes, notes, digested, refusal };
  } finally {
    await core.stop();
  }
}

/** A147's private part: every problem with what was observed, none when it holds. */
export function optedOutProblems(observed: OptedOutObservation): string[] {
  const problems: string[] = [];
  const [one, two] = observed.notes;
  if (one?.length !== 6 || one.some((note) => note !== "instance-1") || two?.some((note) => note !== "instance-2")) {
    problems.push(`the opted-out table holds ${JSON.stringify(observed.notes)}, not each instance's id at 6 heights`);
  }
  if (observed.hashes[0] !== observed.hashes[1]) {
    problems.push("two private databases differing only in an opted-out table's rows hash differently");
  }
  if (observed.digested.some((digest) => digest)) problems.push("core-digest digested the opted-out table");
  if (observed.refusal === "started" || observed.refusal.code !== "non-deterministic-column") {
    problems.push(`the same table without the flag gave ${JSON.stringify(observed.refusal)}`);
  }
  return problems;
}
