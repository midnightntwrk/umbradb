import { EventEmitter } from "node:events";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createConnection, createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startAdminServer } from "../../src/admin/server.js";
import { runProcess } from "../../src/cli/run.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { coreEntry } from "../../src/config/entries.js";
import { startUmbraDB, type UmbraDBHandle, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { ProcessHandle } from "../../src/runner/process.js";
import { ask } from "../admin/admin-harness.js";
import { schemaFile, validatorOf } from "../admin/json-schema.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, type TestDatabase } from "../private/backends.js";
import { privateCoreEntry, type PublicCore, startPublicCore } from "../private/builds.js";
import { makeCertificates, type TestCertificates } from "../private/certificates.js";
import { freePort } from "../runner/process-harness.js";
import { coreSettings, startProcess, startWithoutAdmin } from "../runner/process-build.js";
import { cursorReaches, libraryData, rowsModule } from "./library-fixtures.js";

/**
 * Where a library process listens and connects, from its network plan `[CI]`, on PostgreSQL 18 (Docker) and PGlite
 * 0.5.10 [LM-3, PP-4, PP-11, AE-5]:
 * - **L19**: a library private process connects over TCP to a library public process listening at
 *   `publicSide: { host: "127.0.0.1", port: 0 }` (the address read from `status().listening`), and over mutual TLS with
 *   `publicSide: true` / `privateSide: true` and the addresses and `tls` written in the configurations; in both the
 *   private process follows, in lockstep (the core waits at S for the instance it lists until it connects).
 * - **L21**: with `port: 0` on the module API, admin and the link, each bound address is in `status().listening` as it
 *   binds: admin's and the link's in the very call that logs their bind, admin's before the database opens (while
 *   `on-start-db` is held), the link's before the module API's (while `on-start-api` is held), the module API's at
 *   `started`'s first reaction; after a class-B refusal admin's stays and answers, the link's (closed) is null, the
 *   module API's (never bound) null; after `closed`, all are null.
 * - **L22**: `/config` of a library process shows its revision's `listen` and `privateLink` as the plan's addresses as
 *   bound, absent where nothing listens or connects, and `network` naming each surface's mode; the command's keeps its
 *   `listen` as written and gains `network`. Each body validates against A66's schema.
 * - **L64**: a private configuration that writes `listen.privateLink` (no surface of a private process): `umbradb run`
 *   starts as today, listens nowhere for it and refuses nothing; `startUmbraDB` on the same configuration likewise.
 */

const CONFIG_SCHEMA = validatorOf(schemaFile(new URL("../backbone/core-config/config.schema.json", import.meta.url)));

/** How long a process may take to follow on a loaded machine. */
const FOLLOWS_MS = 300_000;

/** The listening sockets of this process (each is a `TCPServerWrap`). */
const listeningSockets = (): number =>
  process.getActiveResourcesInfo().filter((resource) => resource === "TCPServerWrap").length;

/** Whether `port` on 127.0.0.1 is free: nothing listens there. */
function portFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.listen(port, "127.0.0.1", () => server.close(() => resolve(true)));
  });
}

/** Whether a TCP connection to `port` on 127.0.0.1 opens. */
function connects(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection({ host: "127.0.0.1", port });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

/** Waits until `holds` is true, or rejects after `ms`. */
async function until(holds: () => boolean, what: string, ms = 60_000): Promise<void> {
  const deadline = Date.now() + ms;
  while (!holds()) {
    if (Date.now() > deadline) throw new Error(`${what} did not happen within ${ms} ms`);
    await sleep(20);
  }
}

/** `/config` at `origin` once `wanted` holds of it, checked against A66's schema. */
async function configWhen(origin: string, wanted: (config: Record<string, any>) => boolean): Promise<Record<string, any>> {
  const deadline = Date.now() + 30_000;
  for (;;) {
    const answer = await ask(origin, "/config");
    const config = answer.json as Record<string, any> | undefined;
    if (answer.status === 200 && config !== undefined && wanted(config)) {
      expect(CONFIG_SCHEMA.problems(config), JSON.stringify(config)).toEqual([]);
      return config;
    }
    if (Date.now() > deadline) throw new Error(`/config never matched: ${answer.status} ${answer.text}`);
    await sleep(100);
  }
}

/** The origin of `handle`'s admin listener. */
function adminOrigin(handle: UmbraDBHandle): string {
  const admin = handle.status().listening.admin;
  if (admin === null) throw new Error("its admin does not listen");
  return `http://127.0.0.1:${admin.port}`;
}

/** The `core` settings a public library process on `db` adds for its link: the reader login on PostgreSQL. [CF-4] */
const readerOf = (db: TestDatabase): Readonly<Record<string, unknown>> =>
  db.transportReader === undefined ? {} : { transportReader: db.transportReader };

/** A private library process's configuration data on `database`: the tests' network, no `node`, `extra` settings. */
function privateData(database: DatabaseParts, extra: Readonly<Record<string, unknown>>) {
  const { node: _node, ...settings } = coreSettings(database);
  return { entries: [coreEntry({ start: 1, config: { ...settings, ...extra } as never })] };
}

/** On PostgreSQL a private process reads its public database directly (`publicDatabase`); on PGlite, over the link. */
const publicDatabaseOf = (publicDb: TestDatabase): Readonly<Record<string, unknown>> =>
  publicDb.readerSetting === undefined ? {} : { publicDatabase: publicDb.readerSetting };

/** A library public process with an in-memory chain of `head` blocks, the core settings `extra`, and `rest`. */
function libraryCore(db: TestDatabase, head: bigint, extra: Readonly<Record<string, unknown>>, rest: Partial<UmbraDBOptions>): UmbraDBHandle {
  const modules = (rest.modules ?? []) as readonly ModuleDeclaration[];
  return startUmbraDB({
    config: { data: libraryData(db.setting, modules, { ...readerOf(db), ...extra }) },
    source: new InMemoryBlockSource({ head }),
    ...rest,
  });
}

/** Waits until the core waits at S for its lockstep instance: its lockstep is real, not a pass-through. [PP-6] */
async function waitsForLockstep(core: UmbraDBHandle): Promise<void> {
  await until(() => core.status().conditions.some((condition) => condition.code === "waiting-for-lockstep"), "waiting-for-lockstep");
  expect(core.status().cursor).toBeNull();
}

describe.each(PRIVATE_BACKENDS)("L19: library private processes over the private link, on $name (LM-3, PP-4)", (backend: PrivateBackend) => {
  let certs: TestCertificates;
  beforeAll(async () => {
    certs = makeCertificates();
    await backend.start();
  }, START_TIMEOUT_MS);
  afterAll(async () => {
    certs?.remove();
    await backend.stop();
  }, START_TIMEOUT_MS);

  it("L19, L22: privateSide: { host, port } connects to publicSide: { host: 127.0.0.1, port: 0 }; it follows in lockstep; /config shows the link connecting", async () => {
    const publicDb = await backend.database("public");
    const privateDb = await backend.database("private");
    const core = libraryCore(publicDb, 4n, { lockstepInstances: ["lib-tcp"] }, {
      network: { privateLink: { publicSide: { host: "127.0.0.1", port: 0 } } },
    });
    try {
      await core.started;
      const link = core.status().listening.privateLink;
      expect(link).toEqual({ host: "127.0.0.1", port: expect.any(Number) });
      expect(link?.port).toBeGreaterThan(0);
      await waitsForLockstep(core);
      const instance = startUmbraDB({
        config: { data: privateData(privateDb.setting, { instanceId: "lib-tcp", ...publicDatabaseOf(publicDb) }) },
        network: { admin: { port: 0 }, privateLink: { privateSide: { host: "127.0.0.1", port: link?.port as number } } },
      });
      try {
        await instance.started;
        await cursorReaches(core, 4n, FOLLOWS_MS);
        await cursorReaches(instance, 4n, FOLLOWS_MS);
        // A private process connects; it listens for nothing of its link.
        expect(instance.status().listening.privateLink).toBeNull();
        // L22: its revision's privateLink is the address it connects to, its listen only admin's, as bound.
        const admin = instance.status().listening.admin;
        const config = await configWhen(adminOrigin(instance), (shown) => shown.network !== null);
        expect(config.network).toEqual({ api: "mounted", admin: "listening", privateLink: "connecting" });
        expect(config.core.settings.privateLink).toBe(`127.0.0.1:${link?.port}`);
        expect(config.core.settings.listen).toEqual({ admin: `127.0.0.1:${admin?.port}` });
      } finally {
        await instance.stop();
      }
    } finally {
      await core.stop();
    }
  }, FOLLOWS_MS * 2);

  it("L19: publicSide: true and privateSide: true with the addresses and mutual tls written connect over TLS; it follows in lockstep", async () => {
    const publicDb = await backend.database("public");
    const privateDb = await backend.database("private");
    const lines: string[] = [];
    const core = libraryCore(
      publicDb,
      4n,
      {
        listen: { privateLink: "127.0.0.1:0" },
        tls: { certificate: certs.server.certificate, key: certs.server.key, trustedRoots: [certs.ca] },
        lockstepInstances: ["lib-tls"],
      },
      { network: { privateLink: { publicSide: true } }, log: (line) => lines.push(line) },
    );
    try {
      await core.started;
      const port = core.status().listening.privateLink?.port as number;
      expect(lines).toContain(`transport listening on 127.0.0.1:${port} (mutual TLS)`);
      await waitsForLockstep(core);
      const instance = startUmbraDB({
        config: {
          data: privateData(privateDb.setting, {
            instanceId: "lib-tls",
            privateLink: `127.0.0.1:${port}`,
            tls: { certificate: certs.client.certificate, key: certs.client.key, trustedRoots: [certs.ca] },
            ...publicDatabaseOf(publicDb),
          }),
        },
        network: { privateLink: { privateSide: true } },
      });
      try {
        await instance.started;
        await cursorReaches(core, 4n, FOLLOWS_MS);
        await cursorReaches(instance, 4n, FOLLOWS_MS);
      } finally {
        await instance.stop();
      }
    } finally {
      await core.stop();
    }
  }, FOLLOWS_MS * 2);
});

describe.each(PRIVATE_BACKENDS)("L21, L22: listeners at port 0 and what /config shows of them, on $name (LM-3, LM-9)", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  const everywhere = { api: { port: 0 }, admin: { port: 0 }, privateLink: { publicSide: { port: 0 } } } as const;

  it("L21, L22: each address in status().listening as it binds, /config's listen as bound; after closed all are null", async () => {
    const db = await backend.database("public");
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let releaseApi!: () => void;
    const apiGate = new Promise<void>((resolve) => {
      releaseApi = resolve;
    });
    let reached = false;
    let reachedApi = false;
    const held = rowsModule("held", undefined, {
      points: {
        async "on-start-db"() {
          reached = true;
          await gate;
        },
        async "on-start-api"() {
          reachedApi = true;
          await apiGate;
        },
        async "on-db-write"(_p, b, w) {
          await w.execute("INSERT INTO held.rows (height) VALUES ($1)", [b.height]);
        },
      },
    });
    // Admin and the link each log their address once bound: status().listening is read in that same line's call.
    const bound: { readonly line: string; readonly listening: unknown }[] = [];
    let handle: UmbraDBHandle | undefined;
    const log = (line: string): void => {
      if (line.startsWith("admin endpoints listening on ") || line.startsWith("transport listening on ")) {
        bound.push({ line, listening: handle?.status().listening ?? null });
      }
    };
    handle = libraryCore(db, 3n, {}, { modules: [held], network: everywhere, log });
    // The module API's address as `started` resolves: its first reaction reads status().listening.
    const atStarted = handle.started.then(() => (handle as UmbraDBHandle).status().listening);
    try {
      await until(() => reached, "the held on-start-db");
      // Admin listens once the configuration and the plan are validated, before the database's migrations end; the
      // link and the module API bind later.
      const during = handle.status().listening;
      expect(during.admin).toEqual({ host: "127.0.0.1", port: expect.any(Number) });
      expect(during.privateLink).toBeNull();
      expect(during.api).toBeNull();
      expect((await ask(adminOrigin(handle), "/health/live")).status).toBe(200);
      release();
      // At on-start-api the link has bound and the module API not yet.
      await until(() => reachedApi, "the held on-start-api");
      const linked = handle.status().listening;
      expect(linked.privateLink).toEqual({ host: "127.0.0.1", port: expect.any(Number) });
      expect(linked.api).toBeNull();
      releaseApi();
      await handle.started;
      const up = handle.status().listening;
      expect(await atStarted).toEqual(up);
      // Each address was there when its bind was logged, the line naming it.
      expect(bound.map((one) => one.line)).toEqual([
        `admin endpoints listening on 127.0.0.1:${up.admin?.port}`,
        `transport listening on 127.0.0.1:${up.privateLink?.port}`,
      ]);
      expect(bound[0]?.listening).toEqual({ api: null, admin: up.admin, privateLink: null });
      expect(bound[1]?.listening).toEqual({ api: null, admin: up.admin, privateLink: up.privateLink });
      for (const [surface, address] of Object.entries(up)) {
        expect(address, surface).toEqual({ host: "127.0.0.1", port: expect.any(Number) });
        expect(address?.port, surface).toBeGreaterThan(0);
        expect(await connects(address?.port as number), surface).toBe(true);
      }
      expect(new Set([up.api?.port, up.admin?.port, up.privateLink?.port]).size).toBe(3);
      const config = await configWhen(adminOrigin(handle), (shown) => shown.core?.settings?.listen?.api !== undefined);
      expect(config.core.settings.listen).toEqual({
        api: `127.0.0.1:${up.api?.port}`,
        admin: `127.0.0.1:${up.admin?.port}`,
        privateLink: `127.0.0.1:${up.privateLink?.port}`,
      });
      expect(config.network).toEqual({ api: "listening", admin: "listening", privateLink: "listening" });
      // The entries in effect show the revision as validated: it writes no listen address.
      expect(config.entries[0].settings.listen).toEqual({ admin: "0.0.0.0:8081" });
      await handle.stop();
      await handle.closed;
      expect(handle.status().listening).toEqual({ api: null, admin: null, privateLink: null });
      for (const address of Object.values(up)) expect(await portFree(address?.port as number)).toBe(true);
    } finally {
      release();
      releaseApi();
      await handle.stop();
    }
  }, 240_000);

  it("L21: after a class-B refusal admin's address stays and answers, the closed link's and the unbound module API's are null", async () => {
    const db = await backend.database("public");
    const lines: string[] = [];
    const failing = rowsModule("failing", undefined, {
      points: {
        async "on-start-api"() {
          throw new Error("x");
        },
        async "on-db-write"(_p, b, w) {
          await w.execute("INSERT INTO failing.rows (height) VALUES ($1)", [b.height]);
        },
      },
    });
    const handle = libraryCore(db, 3n, {}, { modules: [failing], network: everywhere, log: (line) => lines.push(line) });
    try {
      await expect(handle.started).rejects.toMatchObject({ code: "callback-error", details: { module: "failing", point: "on-start-api" } });
      // The link had bound before the module API's on-start-api failed.
      const linked = lines.find((line) => line.startsWith("transport listening on 127.0.0.1:"));
      expect(linked).toBeDefined();
      const linkPort = Number(/:(\d+)$/.exec(linked as string)?.[1]);
      const after = handle.status().listening;
      expect(after.admin).toEqual({ host: "127.0.0.1", port: expect.any(Number) });
      expect(after.privateLink).toBeNull();
      expect(after.api).toBeNull();
      expect(await portFree(linkPort)).toBe(true);
      const origin = adminOrigin(handle);
      expect((await ask(origin, "/health/live")).status).toBe(200);
      const status = await ask(origin, "/status");
      expect(status.status).toBe(200);
      expect(status.json).toMatchObject({ state: "refused", reason: { code: "callback-error", module: "failing" } });
      // /config: no address where nothing listens any more.
      const config = await configWhen(origin, (shown) => shown.network !== null && shown.core.settings.listen.privateLink === undefined);
      expect(config.core.settings.listen).toEqual({ admin: `127.0.0.1:${after.admin?.port}` });
      expect(await Promise.race([handle.closed.then(() => true), sleep(1_500, false)])).toBe(false);
    } finally {
      await handle.stop();
    }
    await handle.closed;
    expect(handle.status().listening).toEqual({ api: null, admin: null, privateLink: null });
  }, 240_000);

  it("L22: mounted module API, listening admin, the link over channels: /config's listen holds admin's only", async () => {
    const db = await backend.database("public");
    const handle = libraryCore(db, 3n, {}, { network: { admin: { port: 0 }, privateLink: { publicSide: { channels: true } } } });
    try {
      await handle.started;
      expect(handle.status().listening).toMatchObject({ api: null, privateLink: null });
      const admin = handle.status().listening.admin;
      const config = await configWhen(adminOrigin(handle), (shown) => shown.network !== null);
      expect(config.network).toEqual({ api: "mounted", admin: "listening", privateLink: "channels" });
      expect(config.core.settings.listen).toEqual({ admin: `127.0.0.1:${admin?.port}` });
      expect(Object.hasOwn(config.core.settings, "privateLink")).toBe(false);
    } finally {
      await handle.stop();
    }
  }, 240_000);

  it("L22: the command's /config keeps its listen as written and gains network", async () => {
    const db = await backend.database("public");
    const listen = { api: "127.0.0.1:0", admin: "127.0.0.1:0" };
    const handle: ProcessHandle = startProcess({
      config: { data: libraryData(db.setting, [], { listen }) },
      userModules: { modules: [] },
      source: new InMemoryBlockSource({ head: 3n }),
      network: "configured",
      adminListener: startAdminServer,
    });
    try {
      await handle.started;
      const admin = handle.listening().admin;
      const config = await configWhen(`http://127.0.0.1:${admin?.port}`, (shown) => shown.network !== null);
      expect(config.core.settings.listen).toEqual(listen);
      expect(config.network).toEqual({ api: "listening", admin: "listening", privateLink: "none" });
    } finally {
      await handle.stop();
    }
  }, 240_000);
});

describe.each(PRIVATE_BACKENDS)("L64: a private configuration that writes listen.privateLink, on $name (LM-3, CF-4)", (backend: PrivateBackend) => {
  let directory: string;
  let core: PublicCore | undefined;
  let publicDb: TestDatabase;
  beforeAll(async () => {
    await backend.start();
    directory = mkdtempSync(join(tmpdir(), "umbradb-l64-"));
    writeFileSync(join(directory, "package.json"), '{ "type": "module" }\n');
    publicDb = await backend.database("public");
    core = await startPublicCore({ database: publicDb.setting, head: 3n, extra: { listen: { privateLink: "127.0.0.1:0" } } });
  }, START_TIMEOUT_MS);
  afterAll(async () => {
    await core?.stop();
    rmSync(directory, { recursive: true, force: true });
    await backend.stop();
  }, START_TIMEOUT_MS);

  /** The private configuration's data: its privateLink the core's, and a listen.privateLink at `ignored`. */
  const privateConfig = async (instanceId: string, ignored: number) => {
    const privateDb = await backend.database("private");
    return {
      entries: [
        privateCoreEntry({
          database: privateDb.setting,
          instanceId,
          privateLink: (core as PublicCore).transport(),
          extra: { listen: { privateLink: `127.0.0.1:${ignored}` } },
        }),
      ],
    };
  };

  it("L64: umbradb run starts as today, opens no listener for it and refuses nothing", async () => {
    const ignored = await freePort();
    writeFileSync(join(directory, "private.config.ts"), `export default ${JSON.stringify(await privateConfig("l64-command", ignored))};\n`);
    const signals = new EventEmitter();
    let handle: ProcessHandle | undefined;
    const sockets = listeningSockets();
    const running = runProcess(
      { file: "private.config.ts", cwd: directory, log: () => undefined },
      { signals, start: startWithoutAdmin, started: (started) => (handle = started) },
    );
    try {
      await until(() => handle !== undefined, "the command's start");
      await (handle as ProcessHandle).started;
      await until(() => (handle as ProcessHandle).status().cursor === 3n, "the private cursor at 3", FOLLOWS_MS);
      expect((handle as ProcessHandle).status().state).not.toBe("refused");
      expect((handle as ProcessHandle).listening()).toEqual({ api: null, admin: null, privateLink: null });
      // No listener was added (an earlier test's may still be closing).
      expect(listeningSockets()).toBeLessThanOrEqual(sockets);
      expect(await portFree(ignored)).toBe(true);
    } finally {
      signals.emit("SIGTERM");
    }
    expect((await running)?.kind).toBe("signal");
  }, FOLLOWS_MS * 2);

  it("L64: startUmbraDB on the same configuration does the same", async () => {
    const ignored = await freePort();
    const sockets = listeningSockets();
    const handle = startUmbraDB({
      config: { data: await privateConfig("l64-library", ignored) },
      network: { privateLink: { privateSide: true } },
    });
    try {
      await handle.started;
      await cursorReaches(handle, 3n, FOLLOWS_MS);
      expect(handle.status().listening).toEqual({ api: null, admin: null, privateLink: null });
      // No listener was added (an earlier test's may still be closing).
      expect(listeningSockets()).toBeLessThanOrEqual(sockets);
      expect(await portFree(ignored)).toBe(true);
    } finally {
      await handle.stop();
    }
  }, FOLLOWS_MS * 2);
});
