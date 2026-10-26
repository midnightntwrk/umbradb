import type { ChildProcess } from "node:child_process";
import { once } from "node:events";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { createServer, type Server } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it, onTestFinished, vi } from "vitest";
import { ProcessAdmin } from "../../src/admin/process-admin.js";
import type { AdminServer, AdminStartOptions } from "../../src/admin/server.js";
import { startAdminServer } from "../../src/admin/server.js";
import type { AdminSnapshot } from "../../src/admin/types.js";
import { buildCoreVersion } from "../../src/config/build.js";
import { DEFAULT_ADMIN_ADDRESS } from "../../src/config/core-settings.js";
import { validateConfig } from "../../src/config/validate.js";
import { UmbraError } from "../../src/db/errors.js";
import { reasonOf } from "../../src/runner/failures.js";
import { coreEntry } from "../../src/config/entries.js";
import { type ProcessStatus, startProcess, statusOf } from "../../src/runner/process.js";
import { spawnChild } from "../child-processes.js";
import { freePort } from "../runner/process-harness.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { entryOf, loggingModule, testBuild } from "../runner/process-build.js";
import {
  ADMIN_GENESIS,
  adminCore,
  adminCoreSettings,
  adminSource,
  ask,
  observe,
  startWithAdmin,
  stateProblems,
  statusWhen,
  within,
} from "./admin-harness.js";

/**
 * The admin endpoints' life with the process (task 8.1; AE-1, AE-3, IN-12, RN-13): `startProcess({ admin: true })`
 * serves them on the configuration's `listen.admin` from the moment its `core` revision is known — before the database
 * opens, so every later refusal answers there — until `stop()` has closed the database, then ends its worker thread and
 * its heartbeat, so nothing of it keeps Node.js alive; a listener that cannot listen refuses startup (`listen-failed`,
 * before the database opens); a startup refused before its configuration was validated answers on the configuration's
 * `listen.admin` when it is an address, else on CF-4's default (Q127, shipped A). `ProcessAdmin` itself: what it
 * publishes and when, its log lines, and closing at every step.
 */

const WORKER = fileURLToPath(new URL("./exit.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));
const PASSWORD = "pw-8-1-EARLY";

/** A port held by another listener, and its release. */
async function heldPort(): Promise<{ readonly port: number; release(): Promise<void> }> {
  const server: Server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address() as { port: number };
  return { port, release: () => new Promise<void>((resolve) => server.close(() => resolve())) };
}

describe.each(PROCESS_BACKENDS)("the admin endpoints' life with the process on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("admin: true serves the real worker on listen.admin, logged; until stop() closed the database", async () => {
    const port = await freePort();
    const db = await backend.database();
    const build = testBuild([]);
    const lines: string[] = [];
    const handle = startProcess({
      declarations: build.declarations,
      config: { data: { entries: [adminCore(db.setting, 1, { extra: { listen: { admin: `127.0.0.1:${port}` } } })] } },
      source: adminSource(3n),
      log: (line) => lines.push(line),
      admin: true,
    });
    const origin = `http://127.0.0.1:${port}`;
    await handle.started;
    const following = await statusWhen(origin, (body) => body.state === "following" && body.cursor === "3");
    expect(following).toMatchObject({ ready: true, head: "3", lag: "0" });
    expect(lines).toContain(`admin endpoints listening on 127.0.0.1:${port}`);
    const config = await ask(origin, "/config");
    expect(config.json).toMatchObject({
      core: { start: 1, settings: { network: "custom", genesisHash: ADMIN_GENESIS, database: "[redacted]", node: "[redacted]" } },
    });
    expect(config.text).not.toContain(db.setting);
    await handle.stop();
    expect(await ask(origin, "/health/live")).toMatchObject({ status: null, error: "ECONNREFUSED" });
  }, 120_000);

  it.runIf(backend.kind === "postgres")(
    "the admin listener closes only once the database has closed: no session of the process is left then",
    async () => {
      const db = await backend.database();
      const sessions = async () =>
        Number(
          (
            await db.query(
              "SELECT count(*)::int AS n FROM pg_stat_activity WHERE datname = current_database() " +
                "AND backend_type = 'client backend' AND pid <> pg_backend_pid()",
            )
          )[0]?.n,
        );
      const seen: number[] = [];
      const run = startWithAdmin({
        database: db.setting,
        starter: async (options) => {
          const server = await startAdminServer(options);
          return {
            host: server.host,
            port: server.port,
            threadId: server.threadId,
            publish: (snapshot) => server.publish(snapshot),
            close: async () => {
              // Waits up to 3 s for the process's sessions to end, as they do once its database has closed.
              let left = await sessions();
              for (let waited = 0; left > 0 && waited < 3_000; waited += 50) {
                await sleep(50);
                left = await sessions();
              }
              seen.push(left);
              return server.close();
            },
          };
        },
      });
      await statusWhen(await run.origin(), (body) => body.state === "following");
      expect(await sessions()).toBeGreaterThan(0);
      await run.handle.stop();
      expect(seen).toEqual([0]);
    },
    120_000,
  );

  it("a listen.admin it cannot listen on refuses startup with listen-failed before the database opens", async () => {
    const held = await heldPort();
    try {
      const db = await backend.database();
      const run = startWithAdmin({ database: db.setting, extra: { listen: { admin: `127.0.0.1:${held.port}` } } });
      await expect(run.handle.started).rejects.toMatchObject({ code: "EADDRINUSE", syscall: "listen" });
      await run.handle.ended;
      expect(run.handle.status()).toMatchObject({
        state: "refused",
        ready: false,
        reason: { code: "listen-failed", height: null, module: null, point: null },
      });
      expect(run.lines).toEqual([`startup refused: listen-failed: admin listener: listen EADDRINUSE on 127.0.0.1:${held.port}`]);
      // The database was never opened: no PGlite directory, no schema on PostgreSQL.
      if (db.directory !== undefined) expect(existsSync(db.directory)).toBe(false);
      else expect(await db.query("SELECT 1 FROM pg_namespace WHERE nspname = 'core_chain'")).toEqual([]);
      expect(await within(run.handle.closed, 300)).toBe(false);
      await run.handle.stop();
    } finally {
      await held.release();
    }
  }, 120_000);
});

describe("the process publishes at once when startup ends, processing ends and the stop begins", () => {
  it("each of those steps reaches the admin listener without waiting for a heartbeat tick", async () => {
    // No heartbeat tick publishes here: the main thread's interval is faked and never advanced, so whatever reaches
    // the listener was published by the step itself.
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const published: AdminSnapshot[] = [];
    const failing = loggingModule("f", [], ["on-db-write"], {
      points: {
        ...loggingModule("f", [], ["on-db-write"]).points,
        async "on-compute"(_p, b) {
          if (b.height === 2n) throw new Error("f fails at 2");
        },
      },
    });
    const build = testBuild([failing]);
    const handle = startProcess({
      declarations: build.declarations,
      config: { data: { entries: [adminCore("pglite:memory", 1, { extra: { listen: { admin: "127.0.0.1:0" } } }), entryOf(failing, 1)] } },
      source: adminSource(3n),
      log: () => undefined,
      admin: async (options) => {
        const server = await startAdminServer(options);
        return {
          host: server.host,
          port: server.port,
          threadId: server.threadId,
          publish: (snapshot) => {
            published.push(snapshot);
            server.publish(snapshot);
          },
          close: () => server.close(),
        };
      },
    });
    const last = () => published.at(-1)?.status.state;
    await handle.started;
    await sleep(20);
    expect(last()).not.toBe("starting");
    await handle.ended;
    await sleep(20);
    expect(last()).toBe("halted");
    const stopping = handle.stop();
    await sleep(20);
    expect(last()).toBe("stopping");
    await stopping;
  }, 60_000);

  it("a stop while the admin listener starts opens no database", async () => {
    const directory = mkdtempSync(join(tmpdir(), "umbradb-admin-stop-"));
    try {
      const database = join(directory, "db");
      const build = testBuild([]);
      let asked!: () => void;
      const starting = new Promise<void>((resolve) => {
        asked = resolve;
      });
      let release!: () => void;
      const handle = startProcess({
        declarations: build.declarations,
        config: { data: { entries: [adminCore(`pglite:${database}`, 1, { extra: { listen: { admin: "127.0.0.1:0" } } })] } },
        source: adminSource(1n),
          log: () => undefined,
        admin: async (options) => {
          asked();
          await new Promise<void>((resolve) => {
            release = resolve;
          });
          return startAdminServer(options);
        },
      });
      expect(await within(starting, 30_000)).toBe(true);
      const stopped = handle.stop();
      release();
      await stopped;
      expect(await handle.ended).toEqual({ kind: "signal" });
      expect(existsSync(database)).toBe(false);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }, 60_000);
});

describe("a startup refused before its configuration was validated (Q127, shipped A)", () => {
  it("answers on the configuration's listen.admin: refused, its findings, live 200, ready 503, no secret", async () => {
    const database = `postgres://indexer:${PASSWORD}@127.0.0.1:9/umbra`;
    const run = startWithAdmin({ database, extra: { livenessTimeoutMs: "thirty seconds" } });
    expect(await run.requested).toBe("127.0.0.1:0");
    await expect(run.handle.started).rejects.toMatchObject({ code: "invalid-configuration" });
    const origin = await run.origin();
    await statusWhen(origin, (body) => body.state === "refused");
    const seen = await observe(origin);
    expect(stateProblems(seen, { state: "refused", ready: false, reason: { code: "invalid-configuration", module: null } })).toEqual([]);
    expect((seen.status.json as { reason: unknown }).reason).toMatchObject({
      details: {
        reason: "invalid-entries",
        findings: [{ path: "entries[0].config.livenessTimeoutMs", message: expect.stringContaining("livenessTimeoutMs") }],
      },
    });
    expect(seen.config.json).toEqual({ core: null });
    for (const answer of Object.values(seen)) expect(answer.text).not.toContain(PASSWORD);
    expect(run.lines[0]).toMatch(/^startup refused: invalid-configuration$/);
    expect(run.lines[1]).toMatch(/^admin endpoints listening on 127\.0\.0\.1:\d+$/);
    await run.handle.stop();
    expect(await ask(origin, "/status")).toMatchObject({ status: null, error: "ECONNREFUSED" });
  }, 60_000);

  it("asks for CF-4's default 0.0.0.0:8081 when the configuration names no usable listen.admin, or could not be loaded", async () => {
    // The starter is told the address; it listens on a free port here instead of 8081 (a shared machine).
    const asked: string[] = [];
    const starter = (options: AdminStartOptions) => {
      asked.push(options.address);
      return startAdminServer({ ...options, address: "127.0.0.1:0" });
    };
    for (const [what, config] of [
      ["an invalid address", { data: { entries: [{ ...adminCore("pglite:memory", 1, { extra: { listen: { admin: "8081" } } }) }] } }],
      ["no listen setting", { data: { entries: [{ ...adminCore("pglite:memory", 1, { extra: { retainStates: "many" } }) }] } }],
      ["no file", { file: join(tmpdir(), "umbradb-8-1-no-such-config.ts") }],
    ] as const) {
      const build = testBuild([]);
      let server: AdminServer | undefined;
      const handle = startProcess({
        declarations: build.declarations,
        config: config as never,
        source: adminSource(1n),
          log: () => undefined,
        admin: async (options) => {
          server = await starter(options);
          return server;
        },
      });
      await handle.ended;
      expect(asked.at(-1), what).toBe(DEFAULT_ADMIN_ADDRESS);
      const origin = `http://127.0.0.1:${(server as AdminServer).port}`;
      const status = await statusWhen(origin, (body) => body.state === "refused");
      expect(status.reason, what).toMatchObject({ code: "invalid-configuration" });
      await handle.stop();
    }
  }, 60_000);

  it("a stop before the configuration was read starts no admin listener", async () => {
    const controller = new AbortController();
    controller.abort();
    const build = testBuild([]);
    let asked = 0;
    const handle = startProcess({
      declarations: build.declarations,
      config: { data: { entries: [adminCore("pglite:memory", 1)] } },
      source: adminSource(1n),
      signal: controller.signal,
      log: () => undefined,
      admin: async (options) => {
        asked += 1;
        return startAdminServer(options);
      },
    });
    await handle.closed;
    expect(await handle.ended).toEqual({ kind: "signal" });
    expect(asked).toBe(0);
  });
});

/** A child process of `exit.worker.ts` and its stdout lines. */
interface Child {
  readonly child: ChildProcess;
  readonly lines: string[];
  readonly exited: Promise<number | null>;
}

function startChild(database: string, mode: "run" | "refuse" | "taken", address?: string): Child {
  const args = ["--import", "tsx", WORKER, database, mode, ...(address === undefined ? [] : [address])];
  const child = spawnChild(process.execPath, args, { cwd: REPOSITORY, stdio: ["ignore", "pipe", "inherit"] });
  const lines: string[] = [];
  createInterface({ input: child.stdout as NodeJS.ReadableStream }).on("line", (line) => lines.push(line));
  const exited = once(child, "exit").then(([code]) => code as number | null);
  return { child, lines, exited };
}

async function lineOf(child: Child, key: string, patienceMs = 120_000): Promise<Record<string, unknown>> {
  const until = Date.now() + patienceMs;
  for (;;) {
    const found = child.lines.map((line) => JSON.parse(line) as Record<string, unknown>).find((event) => key in event);
    if (found !== undefined) return found;
    if (Date.now() > until) throw new Error(`no ${key} line from the child; lines: ${child.lines.join(" | ")}`);
    await sleep(25);
  }
}

describe("the worker thread ends with the process (no orphan, nothing left keeping Node.js alive)", () => {
  for (const mode of ["run", "refuse"] as const) {
    it(`a real process (${mode}): up and live until SIGTERM, then it closes and exits by itself, its admin port released`, async () => {
      const directory = mkdtempSync(join(tmpdir(), "umbradb-admin-exit-"));
      const child = startChild(`pglite:${join(directory, "db")}`, mode);
      try {
        const { port } = (await lineOf(child, "port")) as { port: number };
        const origin = `http://127.0.0.1:${port}`;
        const state = mode === "run" ? "following" : "refused";
        await statusWhen(origin, (body) => body.state === state, 60_000);
        expect((await ask(origin, "/health/live")).status).toBe(200);
        // Up: the heartbeat keeps Node.js alive while the loop waits, or while the process stays refused.
        expect(await within(child.exited, 1_500)).toBe(false);
        child.child.kill("SIGTERM");
        expect(await Promise.race([child.exited, sleep(60_000).then(() => "still running")])).toBe(0);
        expect(await lineOf(child, "closed")).toEqual({ closed: "stopping" });
        expect(await ask(origin, "/health/live")).toMatchObject({ status: null, error: "ECONNREFUSED" });
      } finally {
        if (child.child.exitCode === null) child.child.kill("SIGKILL");
        rmSync(directory, { recursive: true, force: true });
      }
    }, 180_000);
  }

  it("a real process whose admin listener cannot listen: refused, up until SIGTERM, then it exits by itself (its thread ended)", async () => {
    const held = await heldPort();
    const directory = mkdtempSync(join(tmpdir(), "umbradb-admin-exit-"));
    const child = startChild(`pglite:${join(directory, "db")}`, "taken", `127.0.0.1:${held.port}`);
    try {
      expect(await lineOf(child, "ended")).toEqual({ ended: "refused" });
      expect(await within(child.exited, 1_500)).toBe(false);
      child.child.kill("SIGTERM");
      expect(await Promise.race([child.exited, sleep(60_000).then(() => "still running")])).toBe(0);
      expect(await lineOf(child, "closed")).toEqual({ closed: "stopping" });
      expect(child.lines.some((line) => "port" in (JSON.parse(line) as object))).toBe(false);
    } finally {
      if (child.child.exitCode === null) child.child.kill("SIGKILL");
      rmSync(directory, { recursive: true, force: true });
      await held.release();
    }
  }, 180_000);
});

describe("ProcessAdmin: the runner's side of the admin endpoints", () => {
  /** A fake admin server that records what it is published. */
  function recording() {
    const published: AdminSnapshot[] = [];
    const started: AdminStartOptions[] = [];
    let closed = 0;
    const start = async (options: AdminStartOptions): Promise<AdminServer> => {
      started.push(options);
      published.push(options.snapshot);
      return {
        host: "127.0.0.1",
        port: 10_001,
        threadId: null,
        publish: (snapshot) => published.push(snapshot),
        close: async () => {
          closed += 1;
        },
      };
    };
    return { published, started, start, closed: () => closed };
  }

  const running = (facts: Partial<Parameters<typeof statusOf>[0]> = {}): ProcessStatus =>
    statusOf({ phase: "running", start: 1n, cursor: 1n, head: 1n, followingThreshold: 3, readinessLag: null, conditions: [], ended: null, reason: null, ...facts });

  const checked = () =>
    validateConfig({
      config: { data: { entries: [coreEntry({ start: 1, config: { ...adminCoreSettings("pglite:memory"), livenessTimeoutMs: 7_000, listen: { admin: "127.0.0.1:0" } } as never }) as never] } },
      declarations: { backbone: [], core: [], user: [] },
      side: "public",
    });

  it("publishes a snapshot only when it changed: at its heartbeat's ticks and when asked", async () => {
    let status = running();
    const lines: string[] = [];
    const fake = recording();
    const admin = new ProcessAdmin({ status: () => status, log: (line) => lines.push(line), start: fake.start });
    const config = checked();
    await admin.serve(config, config.entries[0] as never);
    expect(fake.started).toEqual([expect.objectContaining({ address: "127.0.0.1:0", beat: expect.any(SharedArrayBuffer) })]);
    expect(fake.published).toHaveLength(1);
    expect(fake.published[0]).toMatchObject({ livenessTimeoutMs: 7_000, status: { state: "following", cursor: "1" } });
    expect(fake.published[0]?.config.core?.settings).toMatchObject({ database: "[redacted]", node: "[redacted]" });
    expect(lines).toEqual(["admin endpoints listening on 127.0.0.1:10001"]);
    admin.publish();
    admin.publish();
    expect(fake.published).toHaveLength(1);
    status = running({ cursor: 2n, head: 5n });
    admin.publish();
    expect(fake.published).toHaveLength(2);
    expect(fake.published[1]?.status).toMatchObject({ cursor: "2", head: "5", lag: "3" });
    status = running({ cursor: 3n, head: 5n });
    // The next heartbeat tick publishes it.
    await sleep(1_300);
    expect(fake.published.at(-1)?.status).toMatchObject({ cursor: "3" });
    await admin.close();
    await admin.close();
    expect(fake.closed()).toBe(1);
    status = running({ cursor: 4n, head: 5n });
    admin.publish();
    await sleep(1_100);
    expect(fake.published.at(-1)?.status).toMatchObject({ cursor: "3" });
    // Closed: it starts nothing more.
    await admin.serve(config, config.entries[0] as never);
    await admin.refused();
    expect(fake.started).toHaveLength(1);
  });

  it("follow() publishes once each promise settles", async () => {
    let status = running();
    const fake = recording();
    const admin = new ProcessAdmin({ status: () => status, log: () => undefined, start: fake.start });
    const config = checked();
    await admin.serve(config, config.entries[0] as never);
    let settle!: () => void;
    let fail!: (error: unknown) => void;
    const ok = new Promise<void>((resolve) => {
      settle = resolve;
    });
    const bad = new Promise<void>((_resolve, reject) => {
      fail = reject;
    });
    admin.follow(ok, bad);
    status = running({ cursor: 7n, head: 7n });
    settle();
    await sleep(0);
    expect(fake.published.at(-1)?.status).toMatchObject({ cursor: "7" });
    status = running({ cursor: 8n, head: 8n });
    fail(new Error("refused"));
    await sleep(0);
    expect(fake.published.at(-1)?.status).toMatchObject({ cursor: "8" });
    await admin.close();
  });

  it("refused() listens once on the early address and logs a listener that cannot listen; serve() after it is a no-op", async () => {
    const lines: string[] = [];
    const tried: string[] = [];
    const admin = new ProcessAdmin({
      status: () => running({ phase: "refused" }),
      log: (line) => lines.push(line),
      start: async (options) => {
        tried.push(options.address);
        throw Object.assign(new Error(`admin listener: listen EACCES on ${options.address}`), { code: "EACCES", syscall: "listen" });
      },
    });
    admin.loaded({ config: { data: { entries: [] } }, declarations: { backbone: [], core: [], user: [] }, side: "public" });
    await admin.refused();
    await admin.refused();
    const config = checked();
    await admin.serve(config, config.entries[0] as never);
    expect(tried).toEqual([DEFAULT_ADMIN_ADDRESS]);
    expect(lines).toEqual([
      `admin endpoints cannot listen on ${DEFAULT_ADMIN_ADDRESS}: admin listener: listen EACCES on ${DEFAULT_ADMIN_ADDRESS}`,
    ]);
    await admin.close();
  });

  it("close() while the listener is starting waits for it, then closes it", async () => {
    let release!: () => void;
    const fake = recording();
    const admin = new ProcessAdmin({
      status: () => running(),
      log: () => undefined,
      start: async (options) => {
        await new Promise<void>((resolve) => {
          release = resolve;
        });
        return fake.start(options);
      },
    });
    const config = checked();
    const serving = admin.serve(config, config.entries[0] as never);
    await sleep(10);
    const closing = admin.close();
    release();
    await serving;
    await closing;
    expect(fake.closed()).toBe(1);
  });

  it("logs a listener's thread that fails after it listened", async () => {
    const lines: string[] = [];
    const fake = recording();
    const admin = new ProcessAdmin({
      status: () => running(),
      log: (line) => lines.push(line),
      start: async (options) => {
        const server = await fake.start(options);
        options.onFailure?.(new Error("the admin worker broke"));
        return server;
      },
    });
    const config = checked();
    await admin.serve(config, config.entries[0] as never);
    expect(lines).toEqual(["admin endpoints failed: the admin worker broke", "admin endpoints listening on 127.0.0.1:10001"]);
    await admin.close();
  });

  it("what changed while the listener started is published as soon as it listens", async () => {
    let status = running();
    let release!: () => void;
    const fake = recording();
    const admin = new ProcessAdmin({
      status: () => status,
      log: () => undefined,
      start: async (options) => {
        await new Promise<void>((resolve) => {
          release = resolve;
        });
        return fake.start(options);
      },
    });
    const config = checked();
    const serving = admin.serve(config, config.entries[0] as never);
    await sleep(10);
    status = running({ cursor: 9n, head: 9n });
    release();
    await serving;
    expect(fake.published.map((snapshot) => snapshot.status.cursor)).toEqual(["1", "9"]);
    await admin.close();
  });

  it("an admin closed before it listened starts no listener: neither serve() nor refused()", async () => {
    const fake = recording();
    const admin = new ProcessAdmin({ status: () => running(), log: () => undefined, start: fake.start });
    await admin.close();
    const config = checked();
    await admin.serve(config, config.entries[0] as never);
    await admin.refused();
    expect(fake.started).toEqual([]);
  });

  it("serve() shows the core settings through the configuration's redaction: a secret is hidden in every field's text", async () => {
    const password = "pw-8-1-SERVE";
    const config = validateConfig({
      config: {
        data: {
          entries: [
            coreEntry({
              start: 1,
              config: {
                ...adminCoreSettings(`postgres://indexer:${password}@127.0.0.1:9/umbra`),
                backupAtStop: `/backups/${password}`,
                listen: { admin: "127.0.0.1:0" },
              } as never,
            }) as never,
          ],
        },
      },
      declarations: { backbone: [], core: [], user: [] },
      side: "public",
    });
    const fake = recording();
    const admin = new ProcessAdmin({ status: () => running(), log: () => undefined, start: fake.start });
    await admin.serve(config, config.entries[0] as never);
    expect(fake.published[0]?.config.core?.settings).toMatchObject({ database: "[redacted]", backupAtStop: "/backups/[redacted]" });
    expect(JSON.stringify(fake.published)).not.toContain(password);
    await admin.close();
  });

  it("refused() shows the reason's details through the redaction of the configuration as loaded", async () => {
    const password = "pw-8-1-LOADED";
    const error = new UmbraError("invalid-configuration", `holds ${password}`, {
      reason: "invalid-entries",
      findings: [{ path: "entries[0].config.x", message: `a message holding ${password}` }],
    });
    const status = running({ phase: "refused", reason: reasonOf(error), ended: { kind: "refused", error } });
    const fake = recording();
    const admin = new ProcessAdmin({ status: () => status, log: () => undefined, start: fake.start });
    admin.loaded({
      config: {
        data: {
          entries: [{ id: "core", start: 1, version: buildCoreVersion() as never, config: { database: `postgres://u:${password}@h:9/x` } }],
        },
      },
      declarations: { backbone: [], core: [], user: [] },
      side: "public",
    });
    await admin.refused();
    expect(fake.published[0]?.status.reason?.details).toEqual({
      reason: "invalid-entries",
      findings: [{ path: "entries[0].config.x", message: "a message holding [redacted]" }],
    });
    expect(JSON.stringify(fake.published)).not.toContain(password);
    await admin.close();
  });

  it("close() after a listener that failed is harmless", async () => {
    const admin = new ProcessAdmin({
      status: () => running(),
      log: () => undefined,
      start: async () => {
        throw new Error("no listener");
      },
    });
    const config = checked();
    await expect(admin.serve(config, config.entries[0] as never)).rejects.toThrow("no listener");
    await admin.close();
  });
});
