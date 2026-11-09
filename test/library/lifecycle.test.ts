import { subscribe, unsubscribe } from "node:diagnostics_channel";
import { once } from "node:events";
import { createServer, type Server } from "node:net";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import { versionEntry } from "../../src/config/entries.js";
import { UmbraError } from "../../src/db/errors.js";
import { engineInputOf, handleOf, startUmbraDB, type UmbraDBHandle, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { EngineInput, ProcessHandle } from "../../src/runner/process.js";
import { type Answered, ask, gate, type Observation, stateProblems, type StatusBody, statusWhen } from "../admin/admin-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { freePort } from "../runner/process-harness.js";
import { startProcess } from "../runner/process-build.js";
import { openHold } from "./fixtures/import-holds.js";
import { cursorReaches, libraryData } from "./library-fixtures.js";
import { Client, eventually, exchange, headerValues, type MapiHooks, mapiModule, type Mounted, mountHandlers } from "./mounted-fixtures.js";
import { portFree } from "./network-refusals.js";

/**
 * The standard service lifecycle of a library process, through its mounted handlers and, where the
 * criterion names it, its listeners.
 *
 * - starting: mounted `/health/live` 200 `{ live: true, heartbeatAgeMs, livenessTimeoutMs, thread: "host" }`,
 *   `/health/ready` 503, `/status` 200 with `instance.role` null until the side is known, `/config` 200 with every
 *   field but `build` null before the configuration is validated; the module API 503 with the lifecycle's body
 *   (`starting`, no reason).
 * - serving: `syncing`, then `following`; with a readiness lag, mounted and listening `/health/ready` 503 while
 *   the lag exceeds it, 200 after; the module API answers, subscriptions work through `api.upgrade`; a module's own 503
 *   and the module API's `no-committed-height` 503 keep their bodies.
 * - `stopped` at an upgrade boundary: ready, reads at the cursor; after `stop()` the mounted module API answers
 *   the lifecycle's 503 (`stopping`) and closes its subscriptions, the listening module API closes; `/status` 200
 *   `stopping`; mounted admin answers after `closed`.
 * - `halted`: live 200, ready 503, `/status` with the reason; reads at the cursor until `stop()`.
 * - a class-A refusal (`library-setting-refused`): mounted live 200, ready 503, `/status` 200 `refused` with the
 *   reason; the module API's 503 carries the same reason; `started` rejects with that code; `closed` resolves; nothing
 *   opened though the module API, admin and the link were each asked to listen at a port of their own — no `listen()`
 *   at any time (the `net.server.listen` tracing channel), no thread, each port still free, no database; no rejection
 *   unhandled though no handler was attached to `started`.
 * - `[NEG]` class-B refusals: a failing `on-start-db` (`callback-error`, the module and point, `cause` the
 *   thrown value), the module API's port and the link's port in use (`listen-failed`); a listening admin answers
 *   (`/health/live` 200, `/status` 200 `refused`) until `stop()`, and `closed` waits for it. The committed control is a
 *   process that ends at every refusal, which fails the oracle.
 */

/** What the mounted admin answered for the four endpoints, as the endpoint-state oracle reads them. */
async function mountedObservation(host: Mounted): Promise<Observation> {
  const at = (path: string) => ask(host.admin, path);
  return { live: await at("/health/live"), ready: await at("/health/ready"), status: await at("/status"), config: await at("/config") };
}

/** A listening admin's four answers. */
async function listeningObservation(origin: string): Promise<Observation> {
  const at = (path: string) => ask(origin, path);
  return { live: await at("/health/live"), ready: await at("/health/ready"), status: await at("/status"), config: await at("/config") };
}

/** `/status`'s body of an observation. */
const statusOf = (seen: Observation): StatusBody & { readonly instance: { readonly role: string | null } } =>
  seen.status.json as StatusBody & { readonly instance: { readonly role: string | null } };

/** `handle`'s listening admin as an origin. */
function adminOf(handle: UmbraDBHandle): string {
  const admin = handle.status().listening.admin;
  if (admin === null) throw new Error("admin does not listen");
  return `http://${admin.host}:${admin.port}`;
}

/** The module API's lifecycle answer of `host` at `path`: its status and its body's state and reason. */
async function apiLifecycle(host: Mounted, path = "/rows") {
  const answer = await exchange(host.origin, "GET", path);
  const body = JSON.parse(answer.text) as { error?: { code?: string }; state?: string; reason?: unknown };
  return { status: answer.status, code: body.error?.code, state: body.state, reason: body.reason, version: headerValues(answer, "x-umbra-version") };
}

/** A port another server holds, and its release. */
async function heldPort(): Promise<{ readonly port: number; release(): Promise<void> }> {
  const server: Server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address() as { port: number };
  return { port, release: () => new Promise<void>((resolve) => server.close(() => resolve())) };
}

describe("starting, before the configuration is loaded (a held { file } import)", () => {
  it("mounted live 200 on the host's thread, ready 503, /status role null, /config the build only; the module API 503 starting", async () => {
    const hold = openHold("held-start");
    const handle = startUmbraDB({
      config: { file: new URL("./fixtures/held-start.config.ts", import.meta.url) },
      source: new InMemoryBlockSource({ head: 1n }),
    });
    const host = await mountHandlers(handle);
    try {
      await hold.entered;
      const seen = await mountedObservation(host);
      expect(seen.live.status).toBe(200);
      const live = seen.live.json as Record<string, unknown>;
      expect(Object.keys(live).sort()).toEqual(["heartbeatAgeMs", "live", "livenessTimeoutMs", "thread"]);
      expect(live).toMatchObject({ live: true, livenessTimeoutMs: 30_000, thread: "host" });
      expect(typeof live.heartbeatAgeMs === "number" && live.heartbeatAgeMs >= 0).toBe(true);
      expect(seen.ready.status).toBe(503);
      expect(seen.status.status).toBe(200);
      expect(statusOf(seen)).toMatchObject({ state: "starting", cursor: null, reason: null, instance: { role: null, id: null } });
      expect(seen.config.status).toBe(200);
      expect(seen.config.json).toEqual({
        core: null,
        entries: null,
        history: null,
        modules: null,
        chain: null,
        ledger: null,
        database: null,
        build: { umbradb: UMBRADB_VERSION },
        network: null,
      });
      expect(await apiLifecycle(host)).toEqual({ status: 503, code: "not-serving", state: "starting", reason: null, version: [UMBRADB_VERSION] });
      // Admin answers carry no X-Umbra-* header, mounted as on the listener.
      const raw = await exchange(host.admin, "GET", "/status");
      expect(raw.headers.filter(([name]) => name.startsWith("x-umbra-"))).toEqual([]);
      hold.release();
      await handle.started;
      await cursorReaches(handle, 1n);
      const after = await mountedObservation(host);
      expect(statusOf(after)).toMatchObject({ state: "following", instance: { role: "core" } });
      expect((after.config.json as { network: unknown }).network).toEqual({ api: "mounted", admin: "mounted", privateLink: "none" });
    } finally {
      hold.release();
      await handle.stop();
      await host.close();
    }
  }, 60_000);
});

describe.each(PROCESS_BACKENDS)("the library's service lifecycle on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("starting, its configuration validated (on-start-db held): /status names the core, /config shows it; ready 503; the module API 503", async () => {
    const db = await backend.database();
    const hooks: MapiHooks = { emits: new Set(), startDb: gate() };
    const m = mapiModule(hooks);
    const handle = startUmbraDB({ config: { data: libraryData(db.setting, [m]) }, modules: [m], source: new InMemoryBlockSource({ head: 2n }) });
    const host = await mountHandlers(handle);
    try {
      await hooks.startDb?.reached;
      const seen = await mountedObservation(host);
      expect(stateProblems(seen, { state: "starting", ready: false, reason: null })).toEqual([]);
      expect((seen.live.json as { thread?: string }).thread).toBe("host");
      expect(statusOf(seen).instance.role).toBe("core");
      const config = seen.config.json as { core: unknown; database: { backend: string } | null; network: unknown };
      expect(config.core).not.toBeNull();
      expect(config.database?.backend).toBe(backend.kind);
      expect(config.network).toEqual({ api: "mounted", admin: "mounted", privateLink: "none" });
      expect(await apiLifecycle(host)).toMatchObject({ status: 503, code: "not-serving", state: "starting", reason: null });
    } finally {
      hooks.startDb?.open();
      await handle.stop();
      await host.close();
    }
  }, 60_000);

  it("syncing, then following; ready 503 while the lag exceeds readinessLag, mounted and listening; the module API serves", async () => {
    const db = await backend.database();
    const first = gate();
    const tenth = gate();
    // Held before each height's reads and transaction, so the module API's reads go on (on PGlite's one session too).
    const hooks: MapiHooks = { emits: new Set(), parses: new Map([[1n, first], [10n, tenth]]) };
    const m = mapiModule(hooks);
    const handle = startUmbraDB({
      config: { data: libraryData(db.setting, [m], { readinessLag: 5 }) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 40n }),
      network: { admin: { port: 0 } },
    });
    const host = await mountHandlers(handle);
    try {
      await first.reached;
      // The module API is open before block S commits: its own no-committed-height 503 and a module's own 503 are theirs.
      const view = await exchange(host.origin, "GET", "/view");
      expect(view.status).toBe(503);
      expect(JSON.parse(view.text)).toEqual({
        error: { code: "no-committed-height", message: "no height has committed yet: chain data is answered once block S commits" },
      });
      const own = await exchange(host.origin, "GET", "/own-503");
      expect([own.status, JSON.parse(own.text)]).toEqual([503, { own: "the module's own 503" }]);
      first.open();
      await tenth.reached;
      expect(handle.status()).toMatchObject({ state: "syncing", ready: false, cursor: 9n });
      expect(stateProblems(await mountedObservation(host), { state: "syncing", ready: false })).toEqual([]);
      expect(stateProblems(await listeningObservation(adminOf(handle)), { state: "syncing", ready: false })).toEqual([]);
      const rows = await exchange(host.origin, "GET", "/rows");
      expect([rows.status, JSON.parse(rows.text)]).toEqual([200, { height: "9", rows: 9 }]);
      // A subscription through the mounted upgrade gets the heights the module emits from on-after-db-write.
      const client = await Client.connect(host.ws);
      client.send({ type: "subscribe", id: "s", name: "feed" });
      expect(await client.until(1)).toEqual([{ type: "subscribed", id: "s" }]);
      tenth.open();
      await cursorReaches(handle, 40n);
      await eventually(() => handle.status().state === "following", "following at the head");
      expect((await client.until(2))[1]).toEqual({ type: "next", id: "s", value: { height: "10" } });
      expect(stateProblems(await mountedObservation(host), { state: "following", ready: true })).toEqual([]);
      // The listening admin answers from the snapshot published to its thread, at the latest at the next heartbeat.
      await statusWhen(adminOf(handle), (body) => body.state === "following");
      expect(stateProblems(await listeningObservation(adminOf(handle)), { state: "following", ready: true })).toEqual([]);
      await client.close();
    } finally {
      first.open();
      tenth.open();
      await handle.stop();
      await host.close();
    }
  }, 120_000);

  it("stopped at an upgrade boundary serves reads; stop() turns the mounted module API to 503 stopping, closes its subscriptions and the listener", async () => {
    const db = await backend.database();
    const hooks: MapiHooks = { emits: new Set() };
    const m = mapiModule(hooks);
    const data = {
      entries: [
        ...libraryData(db.setting).entries,
        { id: "mapi", start: 1, version: "1.0.0", config: {} },
        versionEntry({ id: "mapi", start: 6, version: "1.1.0" }),
      ],
    };
    const handle = startUmbraDB({ config: { data }, modules: [m], source: new InMemoryBlockSource({ head: 10n }), network: { api: { port: 0 } } });
    const host = await mountHandlers(handle);
    try {
      await handle.started;
      await eventually(() => handle.status().state === "stopped", "stopped at the boundary");
      expect(handle.status()).toMatchObject({ state: "stopped", ready: true, cursor: 5n });
      expect(handle.status().conditions.map((condition) => condition.code)).toContain("upgrade-required");
      expect((await ask(host.admin, "/health/ready")).status).toBe(200);
      const api = handle.status().listening.api;
      const listener = `http://${api?.host}:${api?.port}`;
      for (const origin of [host.origin, listener]) {
        const rows = await exchange(origin, "GET", "/rows");
        expect([rows.status, JSON.parse(rows.text)]).toEqual([200, { height: "5", rows: 5 }]);
      }
      const client = await Client.connect(host.ws);
      client.send({ type: "subscribe", id: "s", name: "feed" });
      await client.until(1);
      const stopping = handle.stop();
      // The stop has begun: /status says so, mounted.
      expect(((await ask(host.admin, "/status")).json as StatusBody).state).toBe("stopping");
      await stopping;
      await handle.closed;
      expect(await client.closed).toBe(1001);
      expect(await apiLifecycle(host)).toMatchObject({ status: 503, code: "not-serving", state: "stopping" });
      expect((await ask(listener, "/rows")).error).toBe("ECONNREFUSED");
      expect(handle.status().listening).toEqual({ api: null, admin: null, privateLink: null });
      // Mounted admin answers after closed.
      const seen = await mountedObservation(host);
      expect(stateProblems(seen, { state: "stopping", ready: false })).toEqual([]);
    } finally {
      await handle.stop();
      await host.close();
    }
  }, 120_000);

  it("halted: live 200, ready 503, /status with the reason; reads answer at the cursor until stop()", async () => {
    const db = await backend.database();
    const hooks: MapiHooks = { emits: new Set(), haltAt: 4n, failure: "mapi breaks at 4" };
    const m = mapiModule(hooks);
    const handle = startUmbraDB({ config: { data: libraryData(db.setting, [m]) }, modules: [m], source: new InMemoryBlockSource({ head: 8n }) });
    const host = await mountHandlers(handle);
    try {
      await handle.started;
      await eventually(() => handle.status().state === "halted", "halted at 4");
      const reason = { code: "callback-error", height: "4", module: "mapi", point: "on-db-write" };
      expect(stateProblems(await mountedObservation(host), { state: "halted", ready: false, reason })).toEqual([]);
      const rows = await exchange(host.origin, "GET", "/rows");
      expect([rows.status, JSON.parse(rows.text)]).toEqual([200, { height: "3", rows: 3 }]);
      await handle.stop();
      // The reason is kept once stopping, in the lifecycle's body too.
      expect(await apiLifecycle(host)).toMatchObject({
        status: 503,
        state: "stopping",
        reason: { code: "callback-error", height: "4", module: "mapi", point: "on-db-write" },
      });
    } finally {
      await handle.stop();
      await host.close();
    }
  }, 120_000);

  it("a class-A refusal: mounted admin answers it, the module API's 503 carries its reason, started rejects with it, closed resolves, nothing opened, nothing unhandled", async () => {
    const db = await backend.database();
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => unhandled.push(reason);
    process.on("unhandledRejection", onUnhandled);
    const m = mapiModule({ emits: new Set() });
    // Every surface asked to listen, at ports of its own, so that "nothing opened" can fail: none may bind. On
    // PostgreSQL the link's reader login is written (never contacted), so the plan takes the request.
    const ports = { api: await freePort(), admin: await freePort(), privateLink: await freePort() };
    const reader = backend.kind === "postgres" ? { transportReader: { user: "l29_reader", password: "never-used" } } : {};
    const network = {
      api: { host: "127.0.0.1", port: ports.api },
      admin: { host: "127.0.0.1", port: ports.admin },
      privateLink: { publicSide: { host: "127.0.0.1", port: ports.privateLink } },
    };
    // Every server that begins to listen meanwhile; the host's own two (its mounted handlers') are told apart at the end.
    const servers: { address(): unknown }[] = [];
    const opened = { threads: 0 };
    const listened = (message: unknown): void => {
      servers.push((message as { readonly server: { address(): unknown } }).server);
    };
    const threaded = (): void => {
      opened.threads += 1;
    };
    subscribe("tracing:net.server.listen:asyncStart", listened);
    subscribe("worker_threads", threaded);
    const handle = startUmbraDB({
      config: { data: libraryData(db.setting, [m], { backupAtStop: "at-stop.backup", ...reader }) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 2n }),
      network,
    });
    const host = await mountHandlers(handle);
    try {
      // No handler on `started` until the process has closed.
      await handle.closed;
      await sleep(50);
      unsubscribe("tracing:net.server.listen:asyncStart", listened);
      unsubscribe("worker_threads", threaded);
      // Nothing of UmbraDB's listened at any time, no thread started (admin's would), and every asked port is free.
      const hostPorts = [host.origin, host.admin].map((origin) => Number(new URL(origin).port));
      const others = servers.filter((server) => !hostPorts.includes((server.address() as { port?: number } | null)?.port ?? -1));
      expect({ listens: others.length, threads: opened.threads }).toEqual({ listens: 0, threads: 0 });
      for (const [surface, port] of Object.entries(ports)) expect(await portFree(port), surface).toBe(true);
      const reason = { code: "library-setting-refused", height: null, module: null, point: null };
      expect(stateProblems(await mountedObservation(host), { state: "refused", ready: false, reason })).toEqual([]);
      expect(await apiLifecycle(host)).toEqual({ status: 503, code: "not-serving", state: "refused", reason, version: [UMBRADB_VERSION] });
      const error = await handle.started.then(() => null, (caught: unknown) => caught);
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).code).toBe("library-setting-refused");
      expect(handle.status().reason?.code).toBe("library-setting-refused");
      expect(handle.status().listening).toEqual({ api: null, admin: null, privateLink: null });
      // Nothing opened: no PGlite directory, no schema on PostgreSQL.
      if (db.directory !== undefined) {
        const { existsSync } = await import("node:fs");
        expect(existsSync(db.directory)).toBe(false);
      } else {
        expect(await db.query("SELECT count(*)::int AS n FROM pg_namespace WHERE nspname = 'core_chain'")).toEqual([{ n: 0 }]);
      }
      expect(unhandled).toEqual([]);
    } finally {
      unsubscribe("tracing:net.server.listen:asyncStart", listened);
      unsubscribe("worker_threads", threaded);
      process.off("unhandledRejection", onUnhandled);
      await handle.stop();
      await host.close();
    }
  }, 60_000);

  /**
   * The oracle for one class-B refusal of a process started by `start` with `options` (a listening admin asked):
   * `started` rejects with an `UmbraError` of `code`, which `check` accepts; `status().reason.code` is it; the listening
   * admin answers `/health/live` 200 and `/status` 200 `refused`, also 1.5 s on, while `closed` waits; after `stop()`
   * `closed` resolves. None when so.
   */
  async function classBProblems(
    start: (options: UmbraDBOptions) => UmbraDBHandle,
    options: UmbraDBOptions,
    code: string,
    check: (error: UmbraError) => string[] = () => [],
  ): Promise<string[]> {
    const problems: string[] = [];
    const handle = start(options);
    try {
      const error = await handle.started.then(() => null, (caught: unknown) => caught);
      if (!(error instanceof UmbraError) || error.code !== code) {
        problems.push(`started rejected with ${String((error as { code?: string } | null)?.code ?? error)}, not ${code}`);
      } else {
        problems.push(...check(error));
      }
      if (handle.status().reason?.code !== code) problems.push(`status().reason is ${String(handle.status().reason?.code)}`);
      const admin = handle.status().listening.admin;
      if (admin === null) problems.push("no admin listener is bound");
      const closedEarly = await Promise.race([handle.closed.then(() => true), sleep(1_500, false)]);
      if (closedEarly) problems.push("closed resolved before stop()");
      if (admin !== null) {
        const origin = `http://${admin.host}:${admin.port}`;
        const live: Answered = await ask(origin, "/health/live");
        if (live.status !== 200) problems.push(`/health/live answered ${live.status ?? live.error}, not 200`);
        const status = await ask(origin, "/status");
        const state = (status.json as StatusBody | undefined)?.state;
        if (status.status !== 200 || state !== "refused") problems.push(`/status answered ${status.status ?? status.error} ${String(state)}, not 200 refused`);
      }
      await handle.stop();
      const closed = await Promise.race([handle.closed.then(() => true), sleep(10_000, false)]);
      if (!closed) problems.push("closed did not resolve after stop()");
    } finally {
      await handle.stop();
    }
    return problems;
  }

  /** The cases on this backend: a failing on-start-db, the module API's port in use, the link's port in use. */
  async function classBCases(): Promise<readonly { readonly what: string; readonly options: UmbraDBOptions; readonly code: string; readonly check?: (error: UmbraError) => string[]; release?(): Promise<void> }[]> {
    const thrown = new Error("x");
    const failing = mapiModule({ emits: new Set(), startDbFailure: thrown });
    const plain = mapiModule({ emits: new Set() });
    const apiPort = await heldPort();
    const linkPort = await heldPort();
    const linkDb = await backend.database();
    let reader: Record<string, unknown> = {};
    if (linkDb.admin !== undefined) {
      const login = `l30_reader_${process.pid}_${Math.floor(Math.random() * 1e9)}`;
      await linkDb.admin.unsafe(`CREATE ROLE ${login} LOGIN PASSWORD '${login}'; GRANT pg_read_all_data TO ${login}`);
      reader = { transportReader: { user: login, password: login } };
    }
    const callbackDb = await backend.database();
    const apiDb = await backend.database();
    return [
      {
        what: "a failing on-start-db",
        options: { config: { data: libraryData(callbackDb.setting, [failing]) }, modules: [failing], source: new InMemoryBlockSource({ head: 2n }), network: { admin: { port: 0 } } },
        code: "callback-error",
        check: (error) => {
          const problems: string[] = [];
          if (error.details.module !== "mapi" || error.details.point !== "on-start-db") problems.push(`details ${JSON.stringify(error.details)}`);
          if (error.cause !== thrown) problems.push("the cause is not the thrown value");
          return problems;
        },
      },
      {
        what: "the module API's port in use",
        options: { config: { data: libraryData(apiDb.setting, [plain]) }, modules: [plain], source: new InMemoryBlockSource({ head: 2n }), network: { admin: { port: 0 }, api: { port: apiPort.port } } },
        code: "listen-failed",
        check: (error) => ((error.cause as NodeJS.ErrnoException | undefined)?.code === "EADDRINUSE" ? [] : [`the cause is ${String(error.cause)}`]),
        release: apiPort.release,
      },
      {
        what: "the link's port in use",
        options: {
          config: { data: libraryData(linkDb.setting, [plain], reader) },
          modules: [plain],
          source: new InMemoryBlockSource({ head: 2n }),
          network: { admin: { port: 0 }, privateLink: { publicSide: { host: "127.0.0.1", port: linkPort.port } } },
        },
        code: "listen-failed",
        check: (error) => ((error.cause as NodeJS.ErrnoException | undefined)?.code === "EADDRINUSE" ? [] : [`the cause is ${String(error.cause)}`]),
        release: linkPort.release,
      },
    ];
  }

  it("class-B refusals keep the process up, refused, its listening admin answering, until stop(); started rejects with the reason's code", async () => {
    for (const each of await classBCases()) {
      try {
        expect(await classBProblems(startUmbraDB, each.options, each.code, each.check), each.what).toEqual([]);
      } finally {
        await each.release?.();
      }
    }
  }, 180_000);

  it("negative control: a process that ends at every refusal fails 'closed waits for stop()' and the admin's answers", async () => {
    // The facade's exact engine input, the engine stopping itself once startup refused, as a class-A refusal ends.
    const endsOnEveryRefusal = (options: UmbraDBOptions): UmbraDBHandle => {
      const { input } = engineInputOf(options);
      const engine: ProcessHandle = startProcess(input as EngineInput);
      void engine.ended.then((end) => {
        if (end.kind === "refused") void engine.stop();
      });
      return handleOf(engine);
    };
    const cases = await classBCases();
    try {
      const [callback] = cases;
      const problems = await classBProblems(endsOnEveryRefusal, (callback as { options: UmbraDBOptions }).options, "callback-error");
      expect(problems).toContain("closed resolved before stop()");
      expect(problems.some((problem) => problem.startsWith("/health/live answered"))).toBe(true);
    } finally {
      for (const each of cases) await each.release?.();
    }
  }, 120_000);
});
