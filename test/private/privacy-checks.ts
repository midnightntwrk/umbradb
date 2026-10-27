import { randomBytes } from "node:crypto";
import { z } from "zod";
import type { AdminStarter } from "../../src/admin/server.js";
import { privateCursorHeight } from "../../src/backbone/core-private-source/index.js";
import type { ReadHandle } from "../../src/db/api.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { ask, type Answered, statusWhen } from "../admin/admin-harness.js";
import type { PrivateBackend, TestDatabase } from "./backends.js";
import { adminOrigin, launchPrivate, launchPublicCore, type PrivateProcess, type PublicCore } from "./builds.js";
import { hexOf, type KeyCall, keyEntry, keyIdHex, keyModule, type TestKeyConfig, VIEWING } from "./key-checks.js";
import { ReportRelay } from "./relays.js";

/**
 * A120 (task 14.4; PP-9, PP-10; required test id `private.no-key-bytes-public`): with a registered test key and 100
 * processed blocks, the key's bytes appear in no public table, log line, status field or API response, and the core's
 * `/status` shows only each instance's id, connection, lockstep flag and synced height. Shared by `privacy.test.ts`
 * and its negative controls' file; imports nothing of Vitest.
 *
 * **The run** ({@link privacyRun}): a public core — its transport, admin endpoints and module API on free ports, a
 * public module `public-blocks` serving the public blocks, and the private instance `keeper` in `lockstepInstances`
 * (unless the run is independent) — and two private instances connected to it through a relay that keeps every
 * message ({@link ReportRelay}): `keeper`, with one test key of 32 random bytes generated for the run (no key material
 * is committed), its admin endpoints and its module API (`pk`'s count of admitted keys and its rows); and `other`,
 * independent, with none. On PostgreSQL each reads the public database directly as a reader; on PGlite through the core
 * (`read` messages, which the relay sees). Once all three are at the head, every surface is read: each process's
 * `/status`, `/config`, `/health/live` and `/health/ready`, each module API's answers, every log line of the three,
 * every message of the transport, and — once they stopped — every row of every table of the public database as text
 * (`row::text`: a `bytea` as `\x` hex), and as the positive control the same of `keeper`'s private database, where
 * `core_key_registry.keys` holds the key: what shows that the scan finds the bytes where they are.
 *
 * **The forms searched** ({@link formsOf}): the key's bytes as lowercase and upper-case hex (with or without `0x`, so
 * also PostgreSQL's `\x` text), base64 and base64url, their decimal list (`1,2,3`, as a JSON array or a typed array's
 * text holds it) and their Latin-1 text; and the key's id (SHA-256 of kind and bytes) as hex and base64 — the id is not
 * the key, but nothing of the registry belongs on the public side either.
 */

/** The key's bytes and its id in every form the scan searches (see the module comment). */
export function formsOf(key: TestKeyConfig): readonly { readonly name: string; readonly text: string }[] {
  const bytes = Buffer.from(key.bytes.slice(2), "hex");
  const id = Buffer.from(keyIdHex(key).slice(2), "hex");
  const hex = bytes.toString("hex");
  return [
    { name: "the key's bytes as hex", text: hex },
    { name: "the key's bytes as upper-case hex", text: hex.toUpperCase() },
    { name: "the key's bytes as base64", text: bytes.toString("base64").replace(/=+$/, "") },
    { name: "the key's bytes as base64url", text: bytes.toString("base64url") },
    { name: "the key's bytes as a decimal list", text: Array.from(bytes).join(",") },
    { name: "the key's bytes as Latin-1 text", text: bytes.toString("latin1") },
    { name: "the key's id as hex", text: id.toString("hex") },
    { name: "the key's id as upper-case hex", text: id.toString("hex").toUpperCase() },
    { name: "the key's id as base64", text: id.toString("base64").replace(/=+$/, "") },
  ];
}

/** A test key of 32 random bytes for one run (see the module comment). */
export function randomKey(start: number): TestKeyConfig {
  return { kind: VIEWING, bytes: `0x${randomBytes(32).toString("hex")}`, start };
}

/** The public module `public-blocks`: `GET /blocks/:height` answers the public block's height and hash. */
function publicBlocks(): ModuleDeclaration {
  return {
    id: "public-blocks",
    version: "1.0.0",
    side: "public",
    requires: ["blocks"],
    provides: [],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {
      async "on-start-api"(_p, api) {
        api.http("GET", "/blocks/:height", async (req, read) => {
          const [row] = await read.query("SELECT height, hash FROM core_block_commit.blocks WHERE height = $1", [BigInt(req.params.height as string)]);
          return { status: row === undefined ? 404 : 200, body: row === undefined ? null : { height: String(row.height), hash: hexOf(row.hash as Uint8Array) } };
        });
      },
    },
  };
}

/** `keeper`'s module: {@link keyModule} with `GET /keys` (how many keys are admitted) and `GET /rows/:height`. */
function keeperModule(calls: KeyCall[], replace?: Partial<ModuleDeclaration["points"]>): ModuleDeclaration {
  const base = keyModule(calls);
  return {
    ...base,
    points: {
      ...base.points,
      async "on-start-api"(_p, api) {
        api.http("GET", "/keys", async (_req, read: ReadHandle) => {
          const [row] = await read.query("SELECT count(*)::int AS admitted FROM core_key_registry.keys");
          return { status: 200, body: { admitted: Number(row?.admitted), height: read.height === null ? null : String(read.height) } };
        });
        api.http("GET", "/rows/:height", async (req, read: ReadHandle) => {
          const [row] = await read.query("SELECT height, public_hash FROM pk.rows WHERE height = $1", [BigInt(req.params.height as string)]);
          return { status: 200, body: row === undefined ? null : { height: String(row.height), hash: hexOf(row.public_hash as Uint8Array) } };
        });
      },
      ...replace,
    },
  };
}

/** What the run read of every surface. */
export interface PrivacyRun {
  readonly key: TestKeyConfig;
  readonly head: bigint;
  readonly lockstep: boolean;
  /** Where each process got to: the core's cursor, each instance's. */
  readonly cursors: { readonly core: bigint | null; readonly keeper: bigint | null; readonly other: bigint | null };
  /** Every row of every table of the public database, `schema.table: row`. */
  readonly publicRows: readonly string[];
  /** The same of `keeper`'s private database (the positive control). */
  readonly privateRows: readonly string[];
  /** Every log line, by process. */
  readonly lines: Readonly<Record<"core" | "keeper" | "other", readonly string[]>>;
  /** Every answer read: `<process> <path>` and its text. */
  readonly answers: readonly { readonly where: string; readonly status: number | null; readonly text: string }[];
  /** Every message of the transport, both ways. */
  readonly messages: readonly string[];
  /** The `/status` bodies at the end. */
  readonly status: Readonly<Record<"core" | "keeper" | "other", Record<string, unknown>>>;
}

/** Options of {@link privacyRun}. */
export interface PrivacyOptions {
  /** The heights to process; 100 for A120. */
  readonly head: bigint;
  /** Whether `keeper` is a lockstep instance; true for A120. */
  readonly lockstep: boolean;
  /** A negative control's points of `keeper`'s module. */
  readonly keeperPoints?: Partial<ModuleDeclaration["points"]>;
  /** A negative control's admin starter of `keeper`. */
  readonly keeperAdmin?: AdminStarter;
  /** Told the run's test key before anything starts (a negative control's). */
  readonly onKey?: (key: TestKeyConfig) => void;
}

/** `instance` at the head, or ended (a negative control's halt); throws after the reach timeout otherwise. */
async function settled(instance: PrivateProcess, head: bigint): Promise<void> {
  try {
    await instance.reach(head);
  } catch (error) {
    if (instance.handle.status().ended === null) throw error;
  }
}

/** Every table of a database (its schemas', not PostgreSQL's), each row as text. */
async function rowsOf(db: TestDatabase, committedHeight?: Parameters<TestDatabase["read"]>[1]): Promise<string[]> {
  return db.read(async (read) => {
    const tables = await read.query(
      "SELECT n.nspname AS schema, c.relname AS name FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace " +
        "WHERE c.relkind IN ('r', 'p') AND n.nspname NOT IN ('pg_catalog', 'information_schema') AND n.nspname NOT LIKE 'pg\\_toast%' " +
        "ORDER BY 1, 2",
    );
    const rows: string[] = [];
    for (const table of tables) {
      const name = `"${String(table.schema)}"."${String(table.name)}"`;
      for (const row of await read.query(`SELECT t::text AS row FROM ${name} t`)) rows.push(`${String(table.schema)}.${String(table.name)}: ${String(row.row)}`);
    }
    return rows;
  }, committedHeight);
}

/** The admin endpoints' answers and the module API's of one process. */
async function answersOf(where: string, origin: string, api: string | null, paths: readonly string[]): Promise<PrivacyRun["answers"]> {
  const read: Answered[] = [];
  for (const path of ["/status", "/config", "/health/live", "/health/ready"]) read.push(await ask(origin, path));
  const found = read.map((answer) => ({ where: `${where} ${answer.path}`, status: answer.status, text: answer.text }));
  if (api !== null) {
    for (const path of paths) {
      const answer = await ask(api, path);
      found.push({ where: `${where} API ${path}`, status: answer.status, text: answer.text });
    }
  }
  return found;
}

/** The module API's origin of a started process. */
const apiOrigin = (api: { readonly host: string; readonly port: number } | null): string | null =>
  api === null ? null : `http://${api.host}:${api.port}`;

/** Waits for a process's admin origin (its log line). */
export async function originOf(lines: readonly string[], what: string): Promise<string> {
  const deadline = Date.now() + 120_000;
  for (;;) {
    const origin = adminOrigin(lines);
    if (origin !== null) return origin;
    if (Date.now() > deadline) throw new Error(`${what} never logged its admin endpoints' address: ${lines.join(" | ")}`);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

/** Runs A120's scenario (see the module comment) on `backend` and reads every surface. */
export async function privacyRun(backend: PrivateBackend, options: PrivacyOptions): Promise<PrivacyRun> {
  const { head, lockstep } = options;
  const key = randomKey(3);
  options.onKey?.(key);
  const publicDb = await backend.database("public");
  const listen = { transport: "127.0.0.1:0", admin: "127.0.0.1:0", api: "127.0.0.1:0" };
  const core: PublicCore = launchPublicCore({
    database: publicDb.setting,
    head,
    modules: [publicBlocks()],
    entries: [{ id: "public-blocks", start: 1, version: "1.0.0", config: {} }],
    extra: { listen, ...(lockstep ? { lockstepInstances: ["keeper"] } : {}) },
    admin: true,
  });
  const instances: PrivateProcess[] = [];
  let relay: ReportRelay | undefined;
  try {
    const started = await core.handle.started;
    relay = await ReportRelay.start(await core.transportWithin(120_000), (report) => report);
    const lines = { keeper: [] as string[], other: [] as string[] };
    const keeperDb = await backend.database("private");
    const otherDb = await backend.database("private");
    const reading = (db: TestDatabase) => ({
      database: db.setting,
      coreTransport: relay?.address as string,
      ...(backend.kind === "postgres" ? { publicDatabase: publicDb.readerSetting as string } : {}),
      extra: { listen: { admin: "127.0.0.1:0", api: "127.0.0.1:0" } },
      admin: options.keeperAdmin === undefined ? true : options.keeperAdmin,
    });
    const keeper = launchPrivate({
      ...reading(keeperDb),
      instanceId: "keeper",
      modules: [keeperModule([], options.keeperPoints)],
      entries: [keyEntry()],
      testKeys: [key],
      lines: lines.keeper,
    });
    instances.push(keeper);
    // One start after the other: on PostgreSQL both provision the same cluster-wide module roles at startup, which two
    // starts at one instant race for (issue 00030-concurrent-role-provisioning).
    await keeper.handle.started.catch(() => undefined);
    const other = launchPrivate({ ...reading(otherDb), admin: true, instanceId: "other", lines: lines.other });
    instances.push(other);
    await other.handle.started.catch(() => undefined);
    await core.advance(head);
    await settled(keeper, head);
    await settled(other, head);
    const origins = {
      core: await originOf(core.lines, "the core"),
      keeper: await originOf(lines.keeper, "keeper"),
      other: await originOf(lines.other, "other"),
    };
    // Each `/status` once it shows where the processes are now (the heartbeat publishes within a second): the core's
    // view of both instances — keeper at its last height when lockstep —, each instance's cursor and public cursor.
    const keeperAt = keeper.handle.status().cursor;
    const otherAt = other.handle.status().cursor;
    type Shown = {
      readonly cursor: string | null;
      readonly privateInstances: readonly { readonly id: string; readonly height: string | null }[] | null;
      readonly public: { readonly cursor: string | null } | null;
    };
    await statusWhen(
      origins.core,
      (body) => {
        const known = (body as unknown as Shown).privateInstances ?? [];
        const keeperShown = known.find((instance) => instance.id === "keeper");
        const keeperKnown = keeperShown !== undefined && (!lockstep || keeperShown.height === String(keeperAt));
        return keeperKnown && known.some((instance) => instance.id === "other");
      },
      120_000,
    );
    for (const [origin, at] of [
      [origins.keeper, keeperAt],
      [origins.other, otherAt],
    ] as const) {
      const cursor = at === null ? null : String(at);
      const shows = (body: unknown): boolean => (body as Shown).cursor === cursor && (body as Shown).public?.cursor === String(head);
      await statusWhen(origin, shows, 120_000);
    }
    const keeperApi = apiOrigin((await keeper.handle.started.catch(() => ({ api: null }))).api);
    const answers = [
      ...(await answersOf("the core", origins.core, apiOrigin(started.api), ["/blocks/3", `/blocks/${head}`])),
      ...(await answersOf("keeper", origins.keeper, keeperApi, ["/keys", "/rows/3", `/rows/${head}`])),
      ...(await answersOf("other", origins.other, null, [])),
    ];
    const status = {
      core: JSON.parse((await ask(origins.core, "/status")).text) as Record<string, unknown>,
      keeper: JSON.parse((await ask(origins.keeper, "/status")).text) as Record<string, unknown>,
      other: JSON.parse((await ask(origins.other, "/status")).text) as Record<string, unknown>,
    };
    const cursors = { core: core.handle.status().cursor, keeper: keeper.handle.status().cursor, other: other.handle.status().cursor };
    const messages = [...relay.texts];
    for (const instance of instances.splice(0)) await instance.stop();
    await core.stop();
    await relay.close();
    relay = undefined;
    return {
      key,
      head,
      lockstep,
      cursors,
      publicRows: await rowsOf(publicDb),
      privateRows: await rowsOf(keeperDb, privateCursorHeight),
      lines: { core: [...core.lines], keeper: lines.keeper, other: lines.other },
      answers,
      messages,
      status,
    };
  } finally {
    for (const instance of instances) await instance.stop();
    await core.stop();
    await relay?.close();
  }
}

/** The surfaces a run read, each text with where it was. */
function surfaces(run: PrivacyRun): { readonly where: string; readonly text: string }[] {
  return [
    ...run.publicRows.map((row) => ({ where: `the public table ${row.slice(0, row.indexOf(":"))}`, text: row })),
    ...(["core", "keeper", "other"] as const).flatMap((process) =>
      run.lines[process].map((line) => ({ where: `a log line of ${process === "core" ? "the core" : process}`, text: line })),
    ),
    ...run.answers.map((answer) => ({ where: `the answer of ${answer.where}`, text: answer.text })),
    ...run.messages.map((message) => ({ where: `a transport message (${message.slice(0, 40)}…)`, text: message })),
  ];
}

/** The four fields `/status` shows of an instance on the core (PP-9). */
const INSTANCE_FIELDS = ["connected", "height", "id", "lockstep"];

/**
 * A120's oracle: every problem, none when every process reached the head, no surface holds any form of the key
 * ({@link formsOf}) while the private database does (the positive control), and the core's `/status` shows each
 * instance with exactly its id, connection, lockstep flag and synced height — `keeper` lockstep at the head — and each
 * instance its public cursor and lockstep flag.
 */
export function privacyProblems(run: PrivacyRun): string[] {
  const problems: string[] = [];
  const { head } = run;
  for (const [name, cursor] of Object.entries(run.cursors)) if (cursor !== head) problems.push(`${name} stopped at ${cursor}, not ${head}`);
  const forms = formsOf(run.key);
  for (const surface of surfaces(run)) {
    for (const form of forms) if (surface.text.includes(form.text)) problems.push(`${surface.where} holds ${form.name}`);
  }
  if (!run.privateRows.some((row) => row.startsWith("core_key_registry.keys: ") && row.includes(run.key.bytes.slice(2)))) {
    problems.push("the scan did not find the key in the private database's core_key_registry.keys: it cannot see the bytes");
  }
  const instances = run.status.core.privateInstances as readonly Record<string, unknown>[] | null;
  if (!Array.isArray(instances)) {
    problems.push(`the core's /status shows privateInstances ${JSON.stringify(instances)}, not a list`);
  } else {
    for (const instance of instances) {
      if (JSON.stringify(Object.keys(instance).sort()) !== JSON.stringify(INSTANCE_FIELDS)) {
        problems.push(`the core's /status shows ${JSON.stringify(instance)} of an instance: other fields than id, connected, lockstep, height`);
      }
    }
    const keeper = instances.find((instance) => instance.id === "keeper");
    const other = instances.find((instance) => instance.id === "other");
    const wanted = { id: "keeper", connected: true, lockstep: run.lockstep, height: String(head) };
    if (run.lockstep && JSON.stringify(keeper) !== JSON.stringify(wanted)) problems.push(`the core's /status shows keeper as ${JSON.stringify(keeper)}`);
    if (other?.connected !== true || other.lockstep !== false) problems.push(`the core's /status shows other as ${JSON.stringify(other)}`);
  }
  for (const [name, lockstep] of [
    ["keeper", run.lockstep],
    ["other", false],
  ] as const) {
    const shown = run.status[name];
    const wanted = JSON.stringify({ cursor: String(head), lockstep });
    if (JSON.stringify(shown.public) !== wanted) problems.push(`${name}'s /status shows public ${JSON.stringify(shown.public)}, not ${wanted}`);
    if (shown.privateInstances !== null) problems.push(`${name}'s /status shows privateInstances ${JSON.stringify(shown.privateInstances)}`);
  }
  return problems;
}
