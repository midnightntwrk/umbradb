import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { coreEntry } from "../../src/config/entries.js";
import type { PrivateLinkChannel } from "../../src/library/channels.js";
import { optionFindings, readOptions } from "../../src/library/options.js";
import { lifecycleBody } from "../../src/runner/api-answers.js";
import { startUmbraDB, type UmbraDBHandle, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { cursorReaches, libraryData, PGLITE_MEMORY, rowsModule } from "./library-fixtures.js";
import { closedByItself, MALFORMED, optionProblems, throwing, UNREADABLE } from "./option-cases.js";
import { runQuietChild } from "./quiet-child.js";

/**
 * `startUmbraDB`, the library's one entry (`src/library/start-umbradb.ts`): its handle, its options and their refusals.
 * [LM-1, LM-9, LM-10]
 *
 * - LM-1's scenario: a module test needs nothing else — `{ data }`, `modules: [m]`, an in-memory `source` on PGlite in
 *   memory — and the handle comes back before any startup step ran.
 * - L52: the handle has exactly design §4's members, `backup` takes one argument, `UmbraDBStarted` holds no setting, and
 *   no test seam of the engine is an option.
 * - L62 `[NEG]`: each malformed option makes `started` reject with `invalid-configuration`, reason `invalid-option`,
 *   naming the option's path, the process ending `refused` by itself; `startUmbraDB` throws in none (the cases and the
 *   oracle are `./option-cases.ts`'s). The negative controls, `./start-umbradb.negative-control.test.ts`: the facade
 *   without its option check, and the facade reading the options as given, fail the same oracle.
 * - LM-1's "it never throws" for options that cannot be read as given: a getter or a proxy's trap that throws inside
 *   `config` or `network` (at any depth), a proxy as an option or as the options, a revoked proxy, a fake URL or
 *   `AbortSignal` (made with `Object.create` of its prototype, or a proxy of a real one), an array whose elements
 *   cannot be read (refused at the element's path, `modules[1]`) or whose length reads as no array's: each refused
 *   `invalid-option` at its path through `started`; a real `AbortSignal` whose own members were replaced, and a proxy
 *   that only hides `in`, start as given.
 * - LM-1's "it never throws" for a host's list as `modules` whose own code would run if it were copied by its own
 *   methods — an `Array` subclass whose `map` getter throws, one whose `Symbol.species` getter throws, an array whose
 *   own `constructor`, `map`, `slice` and iterator throw, a proxy whose `constructor` is a species building such lists:
 *   on PostgreSQL 18 and PGlite, each is copied by its length and elements alone, its module runs, and none of the
 *   list's own code ran.
 * - L51's library half: a renamed key is refused `renamed-setting` naming the new key, nothing opened.
 * - The handlers exist from the return on: `privateLink.accept` closes a channel this process does not accept and
 *   throws nothing; the module API's answer the lifecycle's 503 until the module API serves, admin's answer throughout
 *   (the lifecycle's criteria are `./lifecycle.test.ts`'s, the mounted rules `./mounted-api.test.ts`'s).
 */

/** The members of design §4's handle, sorted. [L52] */
const HANDLE_MEMBERS = ["admin", "api", "backup", "closed", "ended", "pause", "privateLink", "resume", "started", "status", "stop"];

describe("LM-1: a module test needs nothing else", () => {
  it("startUmbraDB({ config: { data }, modules: [m], source }) on PGlite in memory reaches the in-memory head", async () => {
    const seen: string[] = [];
    const m = rowsModule("m", seen);
    const handle = startUmbraDB({
      config: { data: libraryData(PGLITE_MEMORY, [m]) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 10n }),
    });
    // Synchronous: the handle is back before startup's first step, which runs on a later turn. [L32]
    expect(handle.status()).toMatchObject({ state: "starting", cursor: null, reason: null, ended: null });
    try {
      const started = await handle.started;
      await cursorReaches(handle, 10n);
      expect(started).toEqual({ api: null, side: "public", start: 1n });
      expect(seen).toEqual(Array.from({ length: 10 }, (_, i) => `m ${i + 1}`));
      expect(handle.status().listening).toEqual({ api: null, admin: null, privateLink: null });
    } finally {
      await handle.stop();
    }
    await handle.closed;
  }, 120_000);
});

describe("L52: the handle and what it gives", () => {
  it("has exactly design §4's members; backup takes one argument; the handlers' members", async () => {
    const handle = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, source: new InMemoryBlockSource({ head: 1n }) });
    try {
      expect(Object.keys(handle).sort()).toEqual(HANDLE_MEMBERS);
      expect(Object.isFrozen(handle)).toBe(true);
      expect(handle.backup.length).toBe(1);
      expect(Object.keys(handle.api).sort()).toEqual(["http", "upgrade"]);
      expect(Object.keys(handle.admin)).toEqual(["http"]);
      expect(Object.keys(handle.privateLink)).toEqual(["accept"]);
      const started = await handle.started;
      expect(Object.keys(started).sort()).toEqual(["api", "side", "start"]);
      expect(Object.keys(handle.status()).sort()).toEqual(
        ["conditions", "cursor", "ended", "head", "lag", "listening", "ready", "reason", "state"].sort(),
      );
    } finally {
      await handle.stop();
    }
  }, 60_000);

  it("UmbraDBStarted holds no setting: not the node's credential, not the core revision", async () => {
    // The node is a secret setting, its URL here with a credential; with an in-memory source it is never contacted.
    const node = "ws://reader:s3cr3t-node-pass@127.0.0.1:9/node";
    const handle = startUmbraDB({
      config: { data: libraryData(PGLITE_MEMORY, [], { node }) },
      source: new InMemoryBlockSource({ head: 1n }),
    });
    try {
      const started = await handle.started;
      expect(JSON.stringify(started, (_key, value) => (typeof value === "bigint" ? String(value) : value))).not.toContain("s3cr3t");
      expect(started).not.toHaveProperty("core");
    } finally {
      await handle.stop();
    }
  }, 60_000);

  it("no test seam of the engine is an option: each is refused invalid-option, naming it", async () => {
    for (const seam of ["checkChain", "loop", "nodeClient", "processCore", "declarations", "adminListener", "backupAtStop"]) {
      const handle = startUmbraDB({
        config: { data: libraryData(PGLITE_MEMORY) },
        [seam]: () => undefined,
      } as unknown as UmbraDBOptions);
      await expect(handle.started).rejects.toMatchObject({
        code: "invalid-configuration",
        details: { reason: "invalid-option", option: seam },
      });
      await closedByItself(handle);
    }
  }, 60_000);
});

describe("L62: a malformed option is refused invalid-option, naming its path; startUmbraDB never throws", () => {
  it.each(MALFORMED)("%s", async (_name, options, path) => {
    // The oracle (`./option-cases.ts`): no throw; started rejects invalid-option at the path; refused by itself.
    expect(await optionProblems(() => startUmbraDB(options as UmbraDBOptions), path)).toEqual([]);
  });

  it("an option whose reading throws is refused at its path, and nothing else is read", async () => {
    const handle = startUmbraDB({
      config: { data: {} },
      get log(): never {
        throw new Error("a getter that throws");
      },
    } as unknown as UmbraDBOptions);
    await expect(handle.started).rejects.toMatchObject({ details: { reason: "invalid-option", option: "log" } });
    await closedByItself(handle);
  });

  it("every finding is in the refusal, and on the host's log when the log itself is a function", async () => {
    const lines: string[] = [];
    const handle = startUmbraDB({
      config: {},
      network: { api: { port: -1 } },
      log: (line: string) => lines.push(line),
    } as unknown as UmbraDBOptions);
    const error = await handle.started.then(
      () => null,
      (caught: { details: { findings: readonly { path: string }[] } }) => caught,
    );
    expect(error?.details.findings.map((found) => found.path)).toEqual(["config", "network.api.port"]);
    await closedByItself(handle);
    expect(lines).toEqual([
      "startup refused: invalid-configuration (2 findings); the process ends",
      "startup refused: config: has neither file nor data [invalid-configuration invalid-option]",
      "startup refused: network.api.port: a port is an integer from 0 to 65535 (0: a free port) [invalid-configuration invalid-option]",
    ]);
  });
});

describe("LM-1: options that cannot be read as given are refused through started, never thrown", () => {
  it.each(UNREADABLE)("%s", async (_name, options, path) => {
    expect(await optionProblems(() => startUmbraDB(options() as UmbraDBOptions), path)).toEqual([]);
  });

  it("each option is read once: a getter's second value is never the one used", async () => {
    let reads = 0;
    const handle = startUmbraDB({
      config: {
        get data() {
          reads += 1;
          return reads === 1 ? libraryData(PGLITE_MEMORY) : null;
        },
      },
      network: {
        get api() {
          reads += 1;
          return false;
        },
      },
      source: new InMemoryBlockSource({ head: 1n }),
    } as UmbraDBOptions);
    try {
      await handle.started;
      expect(reads).toBe(2);
    } finally {
      await handle.stop();
    }
  }, 60_000);

  it("a real AbortSignal whose own members were replaced, and a proxy that hides only `in`, start as given; the signal still stops it", async () => {
    const controller = new AbortController();
    const { signal } = controller;
    for (const member of ["aborted", "reason", "addEventListener", "removeEventListener"]) {
      Object.defineProperty(signal, member, { get: throwing });
    }
    const connect = async (): Promise<PrivateLinkChannel> => throwing();
    let handle: UmbraDBHandle | undefined;
    expect(() => {
      handle = startUmbraDB({
        config: { data: libraryData(PGLITE_MEMORY) },
        signal,
        source: new InMemoryBlockSource({ head: 1n }),
        network: { privateLink: { privateSide: new Proxy({ connect }, { has: throwing }) } },
      } as unknown as UmbraDBOptions);
    }).not.toThrow();
    const started = handle as UmbraDBHandle;
    // A public process refuses a private side's request: the request was read, and judged by the network plan.
    await expect(started.started).rejects.toMatchObject({ code: "private-link-misconfigured" });
    await closedByItself(started);
    const served = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, signal, source: new InMemoryBlockSource({ head: 1n }) });
    await served.started;
    controller.abort();
    await served.closed;
    expect(await served.ended).toEqual({ kind: "signal" });
  }, 60_000);
});

/**
 * Host lists given as `modules` whose own code would run, or throw, were they copied by their own methods: each made
 * holding `m`, its code recording in `ran` what of it ran (a member other than `length` and the elements). [LM-1]
 */
const HOST_LISTS: readonly (readonly [string, (m: ModuleDeclaration, ran: string[]) => unknown])[] = [
  [
    "an Array subclass whose map getter throws",
    (m, ran) => {
      class HostArray extends Array<unknown> {}
      Object.defineProperty(HostArray.prototype, "map", {
        get: () => {
          ran.push("map");
          return throwing();
        },
      });
      return HostArray.of(m);
    },
  ],
  [
    "an Array subclass whose Symbol.species getter throws",
    (m, ran) => {
      class SpeciesArray extends Array<unknown> {
        static override get [Symbol.species](): never {
          ran.push("Symbol.species");
          return throwing();
        }
      }
      return SpeciesArray.of(m);
    },
  ],
  [
    "an array whose own constructor, map, slice and iterator are getters that throw",
    (m, ran) => {
      const list: unknown[] = [m];
      for (const member of ["constructor", "map", "slice", Symbol.iterator] as const) {
        Object.defineProperty(list, member, {
          get: () => {
            ran.push(String(member));
            return throwing();
          },
        });
      }
      return list;
    },
  ],
  [
    "a proxy of an array whose constructor is a species building lists whose map throws",
    (m, ran) => {
      class HostArray extends Array<unknown> {}
      Object.defineProperty(HostArray.prototype, "map", { get: throwing });
      return new Proxy([m], {
        get: (target, key, receiver) => {
          if (key !== "length" && !(typeof key === "string" && /^\d+$/.test(key))) ran.push(String(key));
          return key === "constructor" ? HostArray : Reflect.get(target, key, receiver);
        },
      });
    },
  ],
];

describe.each(PROCESS_BACKENDS)("LM-1: a host's list as modules is read element by element, none of its own code run, on $name", (backend: ProcessBackend) => {
  beforeAll(async () => {
    await backend.start();
  }, 180_000);
  afterAll(async () => {
    await backend.stop();
  }, 60_000);

  it.each(HOST_LISTS)("%s: copied, its module runs, nothing of the list's own ran", async (_name, make) => {
    const db = await backend.database();
    const seen: string[] = [];
    const ran: string[] = [];
    const m = rowsModule("m", seen);
    const modules = make(m, ran);
    let handle: UmbraDBHandle | undefined;
    // The call never throws, whatever the host's list does (the copy that called its `map` threw here). [LM-1]
    expect(() => {
      handle = startUmbraDB({
        config: { data: libraryData(db.setting, [m]) },
        modules: modules as readonly ModuleDeclaration[],
        source: new InMemoryBlockSource({ head: 2n }),
      });
    }).not.toThrow();
    const started = handle as UmbraDBHandle;
    try {
      await started.started;
      await cursorReaches(started, 2n);
      expect(seen).toEqual(["m 1", "m 2"]);
      // Only the list's length and its elements were read: no species, constructor, map, slice or iterator. [LM-1]
      expect(ran).toEqual([]);
    } finally {
      await started.stop();
    }
  }, 120_000);
});

describe("L62: the options' shapes, finding by finding", () => {
  const paths = (options: unknown): string[] => optionFindings(readOptions(options)).map((found) => found.path);
  const connect = async () => {
    throw new Error("never called here");
  };

  it("accepts every form of design §4 and §5.1", () => {
    for (const options of [
      { config: { data: {} } },
      { config: { file: "umbradb.config.ts" }, cwd: "/srv", log: () => undefined },
      { config: { file: new URL("file:///srv/umbradb.config.ts") }, signal: new AbortController().signal },
      { config: { data: {} }, modules: [], acceptPublicConfigHash: `0x${"ab".repeat(32)}` },
      { config: { data: {} }, network: { api: true, admin: false, privateLink: { publicSide: { channels: true } } } },
      { config: { data: {} }, network: { api: { port: 0 }, admin: { host: "::1", port: 65_535 } } },
      { config: { data: {} }, network: { privateLink: { privateSide: { connect } } } },
      { config: { data: {} }, network: { privateLink: { publicSide: { host: "127.0.0.1", port: 9 }, privateSide: true } } },
    ]) {
      expect(paths(options)).toEqual([]);
    }
  });

  it("names each malformed part by its path", () => {
    expect(paths({ config: "file.ts" })).toEqual(["config"]);
    expect(paths({ config: { data: {}, other: 1 } })).toEqual(["config.other"]);
    expect(paths({ config: { file: 7 } })).toEqual(["config.file"]);
    expect(paths({ config: { data: {} }, network: { api: "yes" } })).toEqual(["network.api"]);
    expect(paths({ config: { data: {} }, network: { api: { port: 1, tls: true } } })).toEqual(["network.api.tls"]);
    expect(paths({ config: { data: {} }, network: { api: { port: 65_536 } } })).toEqual(["network.api.port"]);
    // A host as the configuration's addresses name one: a name or IPv4 address without spaces, or an IPv6 address.
    for (const host of ["a b", "", "[::1]", "user@host", "host/path", "host:1"]) {
      expect(paths({ config: { data: {} }, network: { admin: { host, port: 0 } } }), host).toEqual(["network.admin.host"]);
    }
    for (const host of ["localhost", "0.0.0.0", "::1", "fe80::1", "indexer.internal"]) {
      expect(paths({ config: { data: {} }, network: { admin: { host, port: 0 } } }), host).toEqual([]);
    }
    expect(paths({ config: { data: {} }, network: { privateLink: true } })).toEqual(["network.privateLink"]);
    expect(paths({ config: { data: {} }, network: { privateLink: { either: true } } })).toEqual(["network.privateLink.either"]);
    expect(paths({ config: { data: {} }, network: { privateLink: { publicSide: { channels: true, port: 1 } } } })).toEqual([
      "network.privateLink.publicSide.port",
    ]);
    expect(paths({ config: { data: {} }, network: { privateLink: { privateSide: { connect: "x", port: 1 } } } })).toEqual([
      "network.privateLink.privateSide.connect",
      "network.privateLink.privateSide.port",
    ]);
    // The private side has no channels form, nor the public side a connect form: each is read as an address.
    expect(paths({ config: { data: {} }, network: { privateLink: { privateSide: { channels: true } } } })).toEqual([
      "network.privateLink.privateSide.channels",
      "network.privateLink.privateSide.port",
    ]);
    expect(paths({ config: { data: {} }, network: { privateLink: { publicSide: 5 } } })).toEqual(["network.privateLink.publicSide"]);
  });

  it("options whose keys cannot be listed are refused at the options, nothing else read", () => {
    const hostile = new Proxy({}, {
      ownKeys() {
        throw new Error("no keys here");
      },
    });
    expect(paths(hostile)).toEqual(["options"]);
  });
});

describe("the other options reach the process", () => {
  it("cwd (relative: against the host's own), signal, acceptPublicConfigHash, pause and resume", async () => {
    const controller = new AbortController();
    const handle = startUmbraDB({
      config: { data: libraryData(PGLITE_MEMORY) },
      cwd: ".",
      signal: controller.signal,
      acceptPublicConfigHash: `0x${"cd".repeat(32)}`,
      source: new InMemoryBlockSource({ head: 3n }),
    });
    await handle.started;
    await cursorReaches(handle, 3n);
    await handle.pause();
    expect(handle.status().conditions.map((condition) => condition.code)).toContain("paused");
    handle.resume();
    controller.abort();
    await handle.closed;
    expect(handle.status().state).toBe("stopping");
    expect(await handle.ended).toEqual({ kind: "signal" });
  }, 60_000);

  it("a handler leaves a response the host already sent as it is", async () => {
    const handle = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, source: new InMemoryBlockSource({ head: 1n }) });
    const written: unknown[] = [];
    const sent = { headersSent: true, writeHead: (...args: unknown[]) => written.push(args), end: () => undefined };
    handle.api.http({} as never, sent as never);
    handle.admin.http({ method: "GET", url: "/status" } as never, sent as never);
    // A socket that cannot be written is destroyed instead.
    let destroyed = false;
    handle.api.upgrade({} as never, { end: () => { throw new Error("closed"); }, destroy: () => { destroyed = true; } } as never, Buffer.alloc(0));
    expect(written).toEqual([]);
    expect(destroyed).toBe(true);
    await handle.stop();
  }, 60_000);
});

describe.each(PROCESS_BACKENDS)("L51, the library's half: a renamed key is refused by startUmbraDB on $name", (backend: ProcessBackend) => {
  let tmp: string;
  beforeAll(async () => {
    await backend.start();
    tmp = mkdtempSync(join(tmpdir(), "umbradb-library-renamed-"));
  }, 180_000);
  afterAll(async () => {
    rmSync(tmp, { recursive: true, force: true });
    await backend.stop();
  }, 60_000);

  it("listen.transport on a public process, naming listen.privateLink; nothing is opened", async () => {
    const db = await backend.database();
    const handle = startUmbraDB({
      config: { data: libraryData(db.setting, [], { listen: { transport: "127.0.0.1:0" } }) },
      source: new InMemoryBlockSource({ head: 1n }),
    });
    const error = await handle.started.then(
      () => null,
      (caught: { code: string; details: { findings: readonly { rule: string; message: string }[] } }) => caught,
    );
    expect(error?.code).toBe("invalid-configuration");
    expect(error?.details.findings.map((found) => found.rule)).toEqual(["renamed-setting"]);
    expect(error?.details.findings[0]?.message).toContain("listen.privateLink");
    await closedByItself(handle);
    if (db.directory !== undefined) expect(existsSync(db.directory)).toBe(false);
  }, 60_000);

  it("coreTransport on a private process, naming privateLink; nothing is opened", async () => {
    const db = await backend.database();
    const config = { network: "preprod", database: db.setting, instanceId: "p1", coreTransport: "127.0.0.1:7000", developmentOptIn: true };
    const handle = startUmbraDB({ config: { data: { entries: [coreEntry({ start: 1, config: config as never })] } } });
    const error = await handle.started.then(
      () => null,
      (caught: { code: string; details: { findings: readonly { rule: string; message: string }[] } }) => caught,
    );
    expect(error?.code).toBe("invalid-configuration");
    expect(error?.details.findings.map((found) => found.rule)).toContain("renamed-setting");
    expect(error?.details.findings.find((found) => found.rule === "renamed-setting")?.message).toContain("privateLink");
    await closedByItself(handle);
    if (db.directory !== undefined) expect(existsSync(db.directory)).toBe(false);
  }, 60_000);
});

describe("the handlers exist from the return on", () => {
  it("privateLink.accept closes a channel this process does not accept, logs a line and throws nothing", async () => {
    const lines: string[] = [];
    const handle = startUmbraDB({
      config: { data: libraryData(PGLITE_MEMORY) },
      source: new InMemoryBlockSource({ head: 1n }),
      log: (line) => lines.push(line),
    });
    let closed = 0;
    const channel: PrivateLinkChannel = {
      send: () => undefined,
      onMessage: () => () => undefined,
      onClose: () => () => undefined,
      close: () => {
        closed += 1;
      },
    };
    const throwing: PrivateLinkChannel = {
      ...channel,
      close: () => {
        throw new Error("a carrier whose close throws");
      },
    };
    try {
      expect(() => handle.privateLink.accept(channel)).not.toThrow();
      expect(() => handle.privateLink.accept(throwing)).not.toThrow();
      expect(closed).toBe(1);
      expect(lines.filter((line) => line.includes("private-link-not-accepting"))).toHaveLength(2);
      await handle.started;
    } finally {
      await handle.stop();
    }
  }, 60_000);

  it("mounted in a host's server from the return on: the module API's 503 until it serves, then its own answers; admin answers throughout", async () => {
    const { createServer } = await import("node:http");
    const { connect } = await import("node:net");
    const handle = startUmbraDB({
      config: { data: libraryData(PGLITE_MEMORY) },
      source: new InMemoryBlockSource({ head: 1n }),
      log: () => {
        throw new Error("a host's log that throws loses its line, and nothing else");
      },
    });
    const server = createServer((request, response) => {
      if (request.url?.startsWith("/admin/") === true) {
        request.url = request.url.slice("/admin".length);
        handle.admin.http(request, response);
      } else {
        handle.api.http(request, response);
      }
    });
    server.on("upgrade", (request, socket, head) => handle.api.upgrade(request, socket, head));
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as { port: number };
    const upgrade = () =>
      new Promise<string>((resolve, reject) => {
        const socket = connect(port, "127.0.0.1", () =>
          socket.write(
            "GET /subscriptions HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: Upgrade\r\nUpgrade: websocket\r\n" +
              "Sec-WebSocket-Version: 13\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n\r\n",
          ),
        );
        let text = "";
        socket.on("data", (chunk) => {
          text += chunk.toString();
          if (text.includes("\r\n\r\n")) {
            socket.destroy();
            resolve(text);
          }
        });
        socket.on("error", reject);
      });
    try {
      // Before startup's first step (it runs on a later turn): the module API does not serve; admin answers.
      const early = await fetch(`http://127.0.0.1:${port}/api/rows`);
      expect(early.status).toBe(503);
      expect(early.headers.get("x-umbra-version")).toMatch(/^\d+\.\d+\.\d+/);
      expect(await early.json()).toMatchObject({ error: { code: "not-serving" }, reason: null });
      expect(await upgrade()).toMatch(/^HTTP\/1\.1 503 Service Unavailable\r\n/);
      await handle.started;
      await cursorReaches(handle, 1n);
      // Serving: the module API's own answers (no module route here: 404), its subscriptions' upgrade.
      const api = await fetch(`http://127.0.0.1:${port}/api/rows`);
      expect(api.status).toBe(404);
      expect(api.headers.get("x-umbra-version")).toMatch(/^\d+\.\d+\.\d+/);
      expect(api.headers.get("x-umbra-config-hash")).toMatch(/^0x[0-9a-f]{64}$/);
      expect(((await api.json()) as { error: { code: string } }).error.code).toBe("not-found");
      expect(await upgrade()).toMatch(/^HTTP\/1\.1 101 Switching Protocols\r\n/);
      const admin = await fetch(`http://127.0.0.1:${port}/admin/status`);
      expect(admin.status).toBe(200);
      expect(admin.headers.get("x-umbra-version")).toBeNull();
      expect(await admin.json()).toMatchObject({ state: "following", cursor: "1" });
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await handle.stop();
    }
  }, 60_000);

  it("the lifecycle's body names the state and the reason, never a message of a failure", () => {
    expect(JSON.parse(lifecycleBody({ state: "starting", reason: null }))).toEqual({
      error: { code: "not-serving", message: "the module API does not serve while the process is starting" },
      state: "starting",
      reason: null,
    });
    const reason = { code: "callback-error" as const, height: 7n, module: "m", point: "on-db-write" as const };
    expect(JSON.parse(lifecycleBody({ state: "halted", reason })).reason).toEqual({
      code: "callback-error",
      height: "7",
      module: "m",
      point: "on-db-write",
    });
  });
});

describe("LM-1: a host whose working directory was removed (issue 00067)", () => {
  /** What `./gone-cwd.child.ts` writes to its result file. */
  interface GoneCwdResult {
    readonly cwdThrows: boolean;
    readonly runs: readonly {
      readonly name: string;
      readonly threw: string | null;
      readonly refused: { readonly code: string; readonly reason: string | null; readonly option: string | null; readonly message: string } | null;
      readonly cursor: string | null;
      readonly state: string | null;
    }[];
  }
  let given: string;
  beforeAll(() => {
    given = mkdtempSync(join(tmpdir(), "umbradb-gone-cwd-given-"));
  });
  afterAll(() => {
    rmSync(given, { recursive: true, force: true });
  });

  it("an absolute cwd is used as it is and starts; without cwd, or a relative one, started rejects at cwd; nothing throws", async () => {
    const run = await runQuietChild<GoneCwdResult>("./gone-cwd.child.ts", { cwd: given });
    expect(run.stderr).toBe("");
    expect(run.code).toBe(0);
    const result = run.result as GoneCwdResult;
    // The fault is real in the child: its process.cwd() throws once its directory is gone.
    expect(result.cwdThrows).toBe(true);
    const [absolute, absent, relative] = result.runs;
    // The absolute cwd is the base of the PGlite path, read without the host's working directory. [G8, D-14]
    expect(absolute).toEqual({ name: "absolute", threw: null, refused: null, cursor: "3", state: "stopping" });
    expect(existsSync(join(given, "data", "db"))).toBe(true);
    // Without cwd, or with a relative one, the working directory is needed and cannot be read: refused at the
    // configuration step, through started, at the option cwd. [LM-1, LM-10]
    for (const [refused, name] of [
      [absent, "absent"],
      [relative, "relative"],
    ] as const) {
      expect(refused, name).toMatchObject({
        name,
        threw: null,
        refused: { code: "invalid-configuration", reason: "invalid-option", option: "cwd" },
        cursor: null,
        state: "refused",
      });
      expect(refused?.refused?.message, name).toContain("give an absolute cwd");
    }
  }, 300_000);
});
