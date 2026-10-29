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
import { validateConfig } from "../../src/config/validate.js";
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
  shownDatabase,
  startWithAdmin,
  statusWhen,
  within,
} from "./admin-harness.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";

/**
 * The admin endpoints' life with the process:
 * - `startProcess({ admin: true })` serves them on the configuration's `listen.admin` from the moment its `core`
 *   revision is known until `stop()` has closed the database. That is before the database opens, so every later
 *   refusal answers there. It then ends its worker thread and its heartbeat, so nothing of it keeps Node.js alive.
 *   [AE-1, AE-3, IN-12, RN-13]
 * - A listener that cannot listen refuses startup (`listen-failed`), before the database opens.
 * - A startup refused by its configuration itself opens no admin listener and ends the process. Here that is a real
 *   process that ends by itself; `./refused-configuration.test.ts` tests the rest. [Q137 B, A157]
 * - `ProcessAdmin` itself: what it publishes and when, its log lines, and closing at every step.
 */

const WORKER = fileURLToPath(new URL("./exit.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

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
      core: {
        start: 1,
        settings: { network: "custom", genesisHash: ADMIN_GENESIS, database: shownDatabase(db.setting), node: "[redacted]" },
      },
    });
    // The parts are shown, the password never. [CF-4, Q167 A]
    const { password } = db.setting as { password?: string };
    if (password !== undefined) expect(config.text).not.toContain(`"${password}"`);
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
      config: { data: { entries: [adminCore({ kind: "pglite", memory: true }, 1, { extra: { listen: { admin: "127.0.0.1:0" } } }), entryOf(failing, 1)] } },
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
        config: { data: { entries: [adminCore({ kind: "pglite", path: database }, 1, { extra: { listen: { admin: "127.0.0.1:0" } } })] } },
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

describe("a stop before the configuration was read", () => {
  it("a stop before the configuration was read starts no admin listener", async () => {
    const controller = new AbortController();
    controller.abort();
    const build = testBuild([]);
    let asked = 0;
    const handle = startProcess({
      declarations: build.declarations,
      config: { data: { entries: [adminCore({ kind: "pglite", memory: true }, 1)] } },
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

function startChild(database: DatabaseParts, mode: "run" | "refuse" | "taken", address?: string): Child {
  const args = ["--import", "tsx", WORKER, JSON.stringify(database), mode, ...(address === undefined ? [] : [address])];
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
  it("a real process (run): up and live until SIGTERM, then it closes and exits by itself, its admin port released", async () => {
    const directory = mkdtempSync(join(tmpdir(), "umbradb-admin-exit-"));
    const child = startChild({ kind: "pglite", path: join(directory, "db") }, "run");
    try {
      const { port } = (await lineOf(child, "port")) as { port: number };
      const origin = `http://127.0.0.1:${port}`;
      await statusWhen(origin, (body) => body.state === "following", 60_000);
      expect((await ask(origin, "/health/live")).status).toBe(200);
      // Up: the heartbeat keeps Node.js alive while the loop waits.
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

  it("a real process whose configuration is refused (refuse) ends by itself, unsignalled: no admin listener, nothing left keeping Node.js alive (Q137 B)", async () => {
    const directory = mkdtempSync(join(tmpdir(), "umbradb-admin-exit-"));
    const child = startChild({ kind: "pglite", path: join(directory, "db") }, "refuse");
    try {
      // No signal is sent: the refusal ends the process, and nothing of the admin endpoints keeps Node.js alive.
      expect(await Promise.race([child.exited, sleep(60_000).then(() => "still running")])).toBe(0);
      expect(await lineOf(child, "ended")).toEqual({ ended: "refused" });
      expect(await lineOf(child, "closed")).toEqual({ closed: "refused" });
      expect(child.lines.some((line) => "port" in (JSON.parse(line) as object))).toBe(false);
      expect(existsSync(join(directory, "db"))).toBe(false);
    } finally {
      if (child.child.exitCode === null) child.child.kill("SIGKILL");
      rmSync(directory, { recursive: true, force: true });
    }
  }, 180_000);

  it("a real process whose admin listener cannot listen: refused, up until SIGTERM, then it exits by itself (its thread ended)", async () => {
    const held = await heldPort();
    const directory = mkdtempSync(join(tmpdir(), "umbradb-admin-exit-"));
    const child = startChild({ kind: "pglite", path: join(directory, "db") }, "taken", `127.0.0.1:${held.port}`);
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
      config: { data: { entries: [coreEntry({ start: 1, config: { ...adminCoreSettings({ kind: "pglite", memory: true }), livenessTimeoutMs: 7_000, listen: { admin: "127.0.0.1:0" } } as never }) as never] } },
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
    expect(fake.published[0]).toMatchObject({ livenessTimeoutMs: 7_000, readinessLag: null, status: { state: "following", cursor: "1" } });
    expect(fake.published[0]?.config.core?.settings).toMatchObject({ database: { kind: "pglite", memory: true }, node: "[redacted]" });
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

  it("an admin closed before it listened starts no listener: serve() is a no-op", async () => {
    const fake = recording();
    const admin = new ProcessAdmin({ status: () => running(), log: () => undefined, start: fake.start });
    await admin.close();
    const config = checked();
    await admin.serve(config, config.entries[0] as never);
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
                ...adminCoreSettings({ kind: "postgres", host: "127.0.0.1", port: 9, user: "indexer", password, name: "umbra", ssl: "disable" }),
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
    expect(fake.published[0]?.config.core?.settings).toMatchObject({
      database: { kind: "postgres", host: "127.0.0.1", port: 9, user: "indexer", password: "[redacted]", name: "umbra", ssl: "disable" },
      backupAtStop: "/backups/[redacted]",
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
