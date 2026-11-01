import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { once } from "node:events";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ADMIN_ROUTES, answerAdmin } from "../../src/admin/routes.js";
import type { AdminSeams } from "../../src/admin/process-admin.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { engineInputOf, handleOf, startUmbraDB, type UmbraDBHandle, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { apiErrorResponse, type ApiRequest, type ApiResponse, ModuleApi } from "../../src/runner/module-api.js";
import type { EngineOptions } from "../../src/runner/process.js";
import { ANSWER_MS, ask, gate } from "../admin/admin-harness.js";
import { SECRET_NODE, SECRET_TEXT, secretDatabase, secretProblems } from "../admin/secrets.js";
import { spawnChild } from "../child-processes.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { startProcess } from "../runner/process-build.js";
import { cursorReaches, libraryData, rowsModule } from "./library-fixtures.js";
import { exchange, type MapiHooks, mapiModule, mountHandlers } from "./mounted-fixtures.js";

/**
 * Mounted admin (`startUmbraDB`'s `admin.http`) on PostgreSQL 18 and a PGlite directory. [LM-5, LM-4, AE-1, AE-5, AE-6]
 *
 * - **L61** `[NEG]`: with no admin listener, mounted `/status` and `/config` reach the expected `core_digest.tables`
 *   rows, server version and identity anchor — the oracle reads them itself from the database (`db.query`, a plain
 *   connection on PostgreSQL, a plain engine on the directory once the process closed it), at the committed height
 *   the loop stays at — after startup's open with no commit yet (a restart on a database with a cursor), after
 *   commits, and after a forced interleaving in which a commit lands during a fact read (the read held after its
 *   queries until the commit landed); a listening admin on the same database reaches the same values. The negative
 *   control forgets a commit that landed during a read, and fails the freshness assertion. No database read runs per
 *   request: the four endpoints answer within 1 s while PGlite's one session is held by an open block transaction, and
 *   on PostgreSQL while the tables they show are locked. The heartbeat's timer does not keep the host's event loop
 *   alive: a host that returns without stopping ends by itself (its control, a heartbeat kept referenced, does not).
 * - **L65** `[NEG]`: secrets through the mounted handlers — on PostgreSQL a password in `database` and in
 *   `transportReader`, a TLS key and a node URL with credentials; on PGlite a TLS key and a node URL with credentials —:
 *   `/config` shows each as `[redacted]`; a callback that throws an error whose message holds them all halts the
 *   process, and `/status` shows the code, height, module and point and no secret; mounted `api.http`'s error answer
 *   holds none either. The controls serve the raw settings on mounted `/config`, and a module API whose error answer
 *   carries the failure's text: the same search finds the secrets.
 */

const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

/** What the database holds, read by the oracle itself: the digest rows, the server's version, the anchor. */
interface Expected {
  readonly digests: readonly string[];
  readonly version: string;
  readonly anchor: string | null;
}

/** The expected facts of `db`, read through a plain connection (PostgreSQL) or engine (PGlite, the process closed). */
async function expectedOf(db: ProcessDatabase): Promise<Expected> {
  const digests = await db.query(
    `SELECT "schema" || '.' || "table" || '@' || height::text || '=0x' || encode(digest, 'hex') AS row FROM core_digest.tables ORDER BY 1`,
  );
  const [version] = await db.query("SELECT current_setting('server_version') AS version");
  const [identity] = await db.query("SELECT '0x' || encode(anchor_hash, 'hex') AS anchor FROM core_chain.identity WHERE id = 1");
  return { digests: digests.map((row) => String(row.row)), version: String(version?.version), anchor: (identity?.anchor as string | null | undefined) ?? null };
}

/** The same facts as an admin origin (mounted, or the listener) shows them in `/status` and `/config`. */
async function shownBy(origin: string): Promise<Expected & { readonly cursor: string | null }> {
  const status = (await ask(origin, "/status")).json as {
    cursor: string | null;
    modules: readonly { tables: readonly { schema: string; table: string; height: string | null; digest: string | null }[] }[] | null;
  };
  const config = (await ask(origin, "/config")).json as { database: { version: string | null } | null; chain: { anchorHash: string | null } | null };
  const digests = (status.modules ?? [])
    .flatMap((part) => part.tables)
    .filter((table) => table.height !== null)
    .map((table) => `${table.schema}.${table.table}@${table.height}=${table.digest}`)
    .sort();
  return { cursor: status.cursor, digests, version: String(config.database?.version), anchor: config.chain?.anchorHash ?? null };
}

/** Waits until `origin` shows facts at `cursor` with every digest row, a version and an anchor; null when it never did. */
async function shownAt(origin: string, cursor: bigint, rows: number, ms = 8_000): Promise<(Expected & { readonly cursor: string | null }) | null> {
  const deadline = Date.now() + ms;
  for (;;) {
    const shown = await shownBy(origin);
    const fresh = shown.digests.filter((row) => row.includes(`@${cursor}=`)).length > 0;
    if (shown.cursor === String(cursor) && fresh && shown.digests.length >= rows && shown.version !== "null" && shown.anchor !== null) return shown;
    if (Date.now() > deadline) return null;
    await sleep(50);
  }
}

/** A hold of the next fact read once armed (`AdminSeams.factsRead`): it waits after its queries until released. */
function factsHold() {
  let armed: { readonly reached: () => void; readonly released: Promise<void> } | undefined;
  return {
    read: async (): Promise<void> => {
      const hold = armed;
      if (hold === undefined) return;
      armed = undefined;
      hold.reached();
      await hold.released;
    },
    arm(): { readonly reached: Promise<void>; release(): void } {
      let reached!: () => void;
      let release!: () => void;
      const reachedPromise = new Promise<void>((resolve) => {
        reached = resolve;
      });
      const released = new Promise<void>((resolve) => {
        release = resolve;
      });
      armed = { reached, released };
      return { reached: reachedPromise, release };
    },
  };
}

/** The handle a host gets over the engine started with `options`' exact input plus `seams`. */
function startWithSeams(options: UmbraDBOptions, seams: Partial<EngineOptions>): UmbraDBHandle {
  const { input, log } = engineInputOf(options);
  return handleOf(startProcess({ ...input, ...seams }), log);
}

/** `handle`'s listening admin as an origin. */
function adminOf(handle: UmbraDBHandle): string {
  const admin = handle.status().listening.admin;
  if (admin === null) throw new Error("admin does not listen");
  return `http://${admin.host}:${admin.port}`;
}

describe.each(PROCESS_BACKENDS)("mounted admin on $name (LM-5)", (backend: ProcessBackend) => {
  const postgres = backend.kind === "postgres";
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /**
   * One L61 run on `db`, its in-memory head first `heads[0]`: the facts mounted admin shows at each of `heads` (each
   * finalized once the one before was shown) must be the listening admin's and the database's own, the oracle reading
   * them itself (on PGlite once the process closed). With `interleave` `[a, b]` after them, the fact read of `a`'s
   * commit is held after its queries until `b` committed, and the facts at `b` must be shown then. The problems, none
   * when so.
   */
  async function factsRun(
    db: ProcessDatabase,
    heads: readonly bigint[],
    seams: AdminSeams = {},
    interleave?: readonly [bigint, bigint],
  ): Promise<string[]> {
    const problems: string[] = [];
    const m = rowsModule("m");
    const source = new InMemoryBlockSource({ head: heads[0] as bigint });
    const hold = factsHold();
    const handle = startWithSeams(
      { config: { data: libraryData(db.setting, [m]) }, modules: [m], source, network: { admin: { port: 0 } } },
      { adminSeams: { ...seams, factsRead: hold.read } },
    );
    const host = await mountHandlers(handle);
    let last: (Expected & { readonly cursor: string | null }) | null = null;
    /** The facts at `head`, mounted and listening alike; a problem when they never were. */
    const show = async (head: bigint): Promise<void> => {
      await cursorReaches(handle, head);
      last = await shownAt(host.admin, head, 1);
      if (last === null) {
        problems.push(`mounted admin never showed the facts at ${head}: ${JSON.stringify(await shownBy(host.admin))}`);
        return;
      }
      const listening = await shownAt(adminOf(handle), head, 1);
      if (JSON.stringify(listening) !== JSON.stringify(last)) {
        problems.push(`the listening admin showed ${JSON.stringify(listening)}, the mounted ${JSON.stringify(last)}`);
      }
    };
    /** The oracle's own read against what was shown last. */
    const compare = async (): Promise<void> => {
      const shown = last as (Expected & { readonly cursor: string | null }) | null;
      if (shown === null) return;
      const expected = await expectedOf(db);
      if (JSON.stringify({ digests: shown.digests, version: shown.version, anchor: shown.anchor }) !== JSON.stringify(expected)) {
        problems.push(`mounted admin showed ${JSON.stringify(shown)}, the database holds ${JSON.stringify(expected)}`);
      }
    };
    try {
      await handle.started;
      for (const [index, head] of heads.entries()) {
        if (index > 0) source.finalize(head);
        await show(head);
      }
      if (interleave !== undefined) {
        const [during, landing] = interleave;
        const held = hold.arm();
        source.finalize(during);
        await cursorReaches(handle, during);
        // The read of `during`'s commit has read it and is held; `landing` commits meanwhile, then the read ends.
        await held.reached;
        source.finalize(landing);
        await cursorReaches(handle, landing);
        held.release();
        await show(landing);
      }
      // PostgreSQL is read while the process runs, at the height it stays at (no head above it).
      if (postgres) await compare();
    } finally {
      await handle.stop();
      await host.close();
    }
    if (!postgres) await compare();
    return problems;
  }

  it("L61: mounted /status and /config reach the database's facts after the open, after commits and after a commit during a fact read", async () => {
    const db = await backend.database();
    // A database with a cursor, then a restart: the first facts are the open's, before any commit.
    expect(await factsRun(db, [3n])).toEqual([]);
    expect(await factsRun(db, [3n])).toEqual([]);
    expect(await factsRun(db, [3n, 6n])).toEqual([]);
    expect(await factsRun(db, [6n], {}, [7n, 8n])).toEqual([]);
  }, 300_000);

  it("L61's negative control: fact reads that forget a commit landing during them leave mounted admin stale", async () => {
    const db = await backend.database();
    expect(await factsRun(db, [3n])).toEqual([]);
    const problems = await factsRun(db, [3n], { forgetCommitsDuringRead: true }, [4n, 5n]);
    expect(problems.some((problem) => problem.startsWith("mounted admin never showed the facts at 5"))).toBe(true);
  }, 300_000);

  it("L61: no database read per request — the four endpoints answer within 1 s while the database is held", async () => {
    const db = await backend.database();
    const held = gate();
    const hooks: MapiHooks = { emits: new Set(), writes: new Map([[4n, held]]) };
    const m = mapiModule(hooks);
    const source = new InMemoryBlockSource({ head: 3n });
    const handle = startUmbraDB({ config: { data: libraryData(db.setting, [m]) }, modules: [m], source });
    const host = await mountHandlers(handle);
    let unlock: (() => void) | undefined;
    let locked: Promise<unknown> | undefined;
    try {
      await handle.started;
      await cursorReaches(handle, 3n);
      if (postgres) {
        // The tables /status and /config show are locked by another session: a read of them would wait.
        await handle.pause();
        let ready!: () => void;
        const isLocked = new Promise<void>((resolve) => {
          ready = resolve;
        });
        const release = new Promise<void>((resolve) => {
          unlock = resolve;
        });
        locked = (db.admin as NonNullable<ProcessDatabase["admin"]>).begin(async (tx) => {
          await tx.unsafe("LOCK TABLE core_digest.tables, core_chain.identity, core_chain.config IN ACCESS EXCLUSIVE MODE");
          ready();
          await release;
        });
        await isLocked;
      } else {
        // Height 4's block transaction holds PGlite's one session: any read waits for it.
        source.finalize(4n);
        await held.reached;
      }
      const slow: string[] = [];
      for (let round = 0; round < 5; round++) {
        for (const path of ["/health/live", "/health/ready", "/status", "/config"]) {
          const at = performance.now();
          const answer = await ask(host.admin, path, "GET", 5_000);
          const ms = performance.now() - at;
          // The endpoints' own answers: readiness may be either; the others 200 with the snapshot's JSON.
          const answered = path === "/health/ready" ? answer.status === 200 || answer.status === 503 : answer.status === 200;
          if (!answered || typeof answer.json !== "object" || ms > ANSWER_MS) {
            slow.push(`${path}: ${answer.status ?? answer.error} after ${Math.round(ms)} ms`);
          }
        }
      }
      expect(slow).toEqual([]);
    } finally {
      unlock?.();
      await locked;
      held.open();
      handle.resume();
      await handle.stop();
      await host.close();
    }
  }, 120_000);

  /** The secrets of L65 on this backend, and the `core` settings that carry them. */
  async function secretSettings(db: ProcessDatabase): Promise<{ readonly database: DatabaseParts; readonly extra: Record<string, unknown>; readonly others: readonly string[] }> {
    const tls = { certificate: "-----BEGIN CERTIFICATE-----\nnot-checked\n-----END CERTIFICATE-----", key: "L65-tls-key-secret", trustedRoots: [] };
    if (postgres) {
      return {
        database: await secretDatabase(db),
        extra: { tls, node: SECRET_NODE, transportReader: { user: "l65_reader", password: "L65-reader-secret" } },
        others: ["L65-tls-key-secret", "L65-reader-secret"],
      };
    }
    return { database: db.setting, extra: { tls, node: SECRET_NODE }, others: ["L65-tls-key-secret"] };
  }

  /**
   * The L65 run: a process whose `mapi` halts at 2 with an error holding every secret, mounted; the texts of the four
   * mounted endpoints, of mounted `api.http`'s error answer (`/fails`, which throws the same) and of the module API's
   * lifecycle answer after the stop, with the problems the search finds (none when no secret leaked).
   */
  async function secretsRun(seams: Partial<EngineOptions>): Promise<{ readonly problems: readonly string[]; readonly config: unknown; readonly status: unknown }> {
    const db = await backend.database();
    const { database, extra, others } = await secretSettings(db);
    const failure = `${SECRET_TEXT}; database ${JSON.stringify(database)}; ${others.join(", ")}; ${SECRET_NODE}`;
    const hooks: MapiHooks = { emits: new Set(), haltAt: 2n, failure };
    const m = mapiModule(hooks);
    const handle = startWithSeams(
      { config: { data: libraryData(database, [m], extra) }, modules: [m], source: new InMemoryBlockSource({ head: 4n }) },
      seams,
    );
    const host = await mountHandlers(handle);
    try {
      await handle.started;
      const deadline = Date.now() + 60_000;
      while (handle.status().state !== "halted" && Date.now() < deadline) await sleep(20);
      const texts: Record<string, string> = {};
      let config: unknown;
      let status: unknown;
      for (const path of ["/health/live", "/health/ready", "/status", "/config"]) {
        const answer = await ask(host.admin, path);
        texts[`mounted ${path}`] = answer.text;
        if (path === "/config") config = answer.json;
        if (path === "/status") status = answer.json;
      }
      const fails = await exchange(host.origin, "GET", "/fails");
      texts["mounted api.http /fails"] = `${fails.status} ${fails.headers.map(([name, value]) => `${name}: ${value}`).join("\n")}\n${fails.text}`;
      await handle.stop();
      texts["mounted api.http after the stop"] = (await exchange(host.origin, "GET", "/rows")).text;
      const problems = [...secretProblems(texts)];
      for (const [name, text] of Object.entries(texts)) {
        for (const other of others) if (text.includes(other)) problems.push(`${name} holds ${other}`);
      }
      return { problems, config, status };
    } finally {
      await handle.stop();
      await host.close();
    }
  }

  it("L65: no secret through the mounted handlers: /config redacts each, /status and api.http's error answers show none", async () => {
    const { problems, config, status } = await secretsRun({});
    expect(problems).toEqual([]);
    const settings = (config as { core: { settings: Record<string, unknown> } }).core.settings;
    expect((settings.database as { password?: string }).password ?? "[no password]").toBe(postgres ? "[redacted]" : "[no password]");
    expect(settings.tls).toBe("[redacted]");
    expect(settings.node).toBe("[redacted]");
    if (postgres) expect(settings.transportReader).toEqual({ user: "l65_reader", password: "[redacted]" });
    expect((status as { reason: unknown }).reason).toMatchObject({ code: "callback-error", height: "2", module: "mapi", point: "on-db-write" });
  }, 120_000);

  it("L65's negative controls: raw settings on mounted /config, and an error answer carrying the failure's text, are found", async () => {
    const rawConfig: AdminSeams["mountedAnswer"] = (method, url, view) => {
      if (method !== "GET" || url !== "/config") return answerAdmin(ADMIN_ROUTES, method, url, view);
      return { status: 200, body: { ...view.snapshot.config, core: { start: 1, settings: rawSettings } } as never };
    };
    let rawSettings: unknown = null;
    const { problems: configProblems } = await (async () => {
      const db = await backend.database();
      const { database, extra } = await secretSettings(db);
      rawSettings = { database, ...extra };
      const m = mapiModule({ emits: new Set() });
      const handle = startWithSeams(
        { config: { data: libraryData(database, [m], extra) }, modules: [m], source: new InMemoryBlockSource({ head: 1n }) },
        { adminSeams: { mountedAnswer: rawConfig } },
      );
      const host = await mountHandlers(handle);
      try {
        await handle.started;
        return { problems: secretProblems({ "mounted /config": (await ask(host.admin, "/config")).text }) };
      } finally {
        await handle.stop();
        await host.close();
      }
    })();
    // The node URL's credentials, as the URL writes them, are in the raw settings on both backends.
    expect(configProblems).toContain("mounted /config holds form 1 of the secret");
    // A module API whose 500 carries the handler's error text, on the mounted path only.
    const caught = { last: "" };
    class Leaking extends ModuleApi {
      override async answer(request: ApiRequest): Promise<ApiResponse> {
        const answered = await super.answer(request);
        return answered.status === 500 ? apiErrorResponse("internal-error", caught.last) : answered;
      }
    }
    const leaking: NonNullable<NonNullable<EngineOptions["mountedApi"]>["moduleApi"]> = (routes, options) =>
      new Leaking(routes, {
        ...options,
        onError: (error, where) => {
          caught.last = error instanceof Error ? error.message : String(error);
          options.onError?.(error, where);
        },
      });
    const { problems } = await secretsRun({ mountedApi: { moduleApi: leaking } });
    expect(problems.some((problem) => problem.startsWith("mounted api.http /fails holds form"))).toBe(true);
    expect(problems.some((problem) => problem.startsWith("mounted /"))).toBe(false);
  }, 180_000);
});

/** Runs the heartbeat host (`./heartbeat-host.child.ts`) in `mode`: whether it ended by itself within `ms` of reaching its head. */
async function hostEndsByItself(mode: "library" | "control", ms: number): Promise<{ readonly reached: boolean; readonly ended: boolean; readonly code: number | null }> {
  const dir = mkdtempSync(join(tmpdir(), "umbradb-heartbeat-host-"));
  const resultFile = join(dir, "result.json");
  const child = spawnChild(
    process.execPath,
    ["--import", "tsx", fileURLToPath(new URL("./heartbeat-host.child.ts", import.meta.url)), JSON.stringify({ mode, resultFile })],
    { cwd: REPOSITORY, stdio: ["ignore", "ignore", "ignore"] },
  );
  const exited = once(child, "exit").then(() => true);
  try {
    const deadline = Date.now() + 120_000;
    while (!existsSync(resultFile) && Date.now() < deadline && child.exitCode === null) await sleep(50);
    const reached = existsSync(resultFile) && (JSON.parse(readFileSync(resultFile, "utf8")) as { reached: string }).reached === "2";
    const ended = await Promise.race([exited, sleep(ms, false)]);
    return { reached, ended, code: child.exitCode };
  } finally {
    if (child.exitCode === null) {
      child.kill("SIGKILL");
      await exited;
    }
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("L61: the heartbeat's timer does not keep a library host's event loop alive", () => {
  it("a host that returns without stopping UmbraDB ends by itself; the control's referenced heartbeat keeps it running", async () => {
    // PGlite's own timer of 10 s may hold the process that long after its last query; nothing of UmbraDB's may.
    expect(await hostEndsByItself("library", 30_000)).toEqual({ reached: true, ended: true, code: 0 });
    expect(await hostEndsByItself("control", 30_000)).toMatchObject({ reached: true, ended: false });
  }, 240_000);
});
