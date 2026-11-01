import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { coreEntry } from "../../src/config/entries.js";
import type { PrivateLinkChannel } from "../../src/library/channels.js";
import { optionFindings, readOptions } from "../../src/library/options.js";
import { lifecycleBody, startUmbraDB, type UmbraDBHandle, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { startProcess } from "../runner/process-build.js";
import { cursorReaches, libraryData, PGLITE_MEMORY, rowsModule } from "./library-fixtures.js";

/**
 * `startUmbraDB`, the library's one entry (`src/library/start-umbradb.ts`): its handle, its options and their refusals.
 * [LM-1, LM-9, LM-10]
 *
 * - LM-1's scenario: a module test needs nothing else — `{ data }`, `modules: [m]`, an in-memory `source` on PGlite in
 *   memory — and the handle comes back before any startup step ran.
 * - L52: the handle has exactly design §4's members, `backup` takes one argument, `UmbraDBStarted` holds no setting, and
 *   no test seam of the engine is an option.
 * - L62 `[NEG]`: each malformed option makes `started` reject with `invalid-configuration`, reason `invalid-option`,
 *   naming the option's path, the process ending `refused` by itself; `startUmbraDB` throws in none. The negative
 *   control gives the engine the same options unchecked: none of them is refused `invalid-option`.
 * - L51's library half: a renamed key is refused `renamed-setting` naming the new key, nothing opened.
 * - The handlers exist from the return on: `privateLink.accept` closes a channel this process does not accept and
 *   throws nothing; the module API's and admin's answer the lifecycle's 503.
 */

/** The members of design §4's handle, sorted. [L52] */
const HANDLE_MEMBERS = ["admin", "api", "backup", "closed", "ended", "pause", "privateLink", "resume", "started", "status", "stop"];

/** Waits for `handle` to have closed, the process ending by itself (a configuration refusal), or fails after 30 s. */
async function closedByItself(handle: UmbraDBHandle): Promise<void> {
  let timer: NodeJS.Timeout | undefined;
  const late = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("the process did not end by itself within 30 s")), 30_000);
  });
  try {
    await Promise.race([handle.closed, late]);
  } finally {
    clearTimeout(timer);
  }
}

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

/** L62's malformed options, each with the path its refusal names. */
const MALFORMED: readonly (readonly [string, unknown, string])[] = [
  ["config with neither file nor data", { config: {} }, "config"],
  ["config with both", { config: { file: "a.ts", data: {} } }, "config"],
  ["no config", {}, "config"],
  ["modules not an array", { config: { data: {} }, modules: "m" }, "modules"],
  ["modulesFrom not a URL", { config: { data: {} }, modulesFrom: "./modules.ts" }, "modulesFrom"],
  ['network: "configured"', { config: { data: {} }, network: "configured" }, "network"],
  ["api: { port: 1.5 }", { config: { data: {} }, network: { api: { port: 1.5 } } }, "network.api.port"],
  [
    "publicSide: { channels: false }",
    { config: { data: {} }, network: { privateLink: { publicSide: { channels: false } } } },
    "network.privateLink.publicSide.channels",
  ],
  ["an unknown network key", { config: { data: {} }, network: { apis: true } }, "network.apis"],
  ["a host that is no string", { config: { data: {} }, network: { admin: { host: 1, port: 0 } } }, "network.admin.host"],
  ["cwd not a string", { config: { data: {} }, cwd: 7 }, "cwd"],
  ["a log that is no function", { config: { data: {} }, log: "stderr" }, "log"],
  ["signal not an AbortSignal", { config: { data: {} }, signal: {} }, "signal"],
  ["acceptPublicConfigHash of another form", { config: { data: {} }, acceptPublicConfigHash: "0xAB" }, "acceptPublicConfigHash"],
  ["options that are no object", null, "options"],
];

describe("L62: a malformed option is refused invalid-option, naming its path; startUmbraDB never throws", () => {
  it.each(MALFORMED)("%s", async (_name, options, path) => {
    let handle: UmbraDBHandle | undefined;
    expect(() => {
      handle = startUmbraDB(options as UmbraDBOptions);
    }).not.toThrow();
    const refused = handle as UmbraDBHandle;
    await expect(refused.started).rejects.toMatchObject({
      code: "invalid-configuration",
      details: { reason: "invalid-option", option: path },
    });
    await closedByItself(refused);
    expect(refused.status()).toMatchObject({ state: "refused", reason: { code: "invalid-configuration" } });
    expect(await refused.ended).toMatchObject({ kind: "refused" });
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

  it("negative control: the same options given to the engine unchecked are refused invalid-option by nothing", async () => {
    // What the facade would hand the engine without its option check: the configuration as given (or none), the
    // modules as given, the network request as given.
    const codes: string[] = [];
    for (const [, options] of MALFORMED.filter(([, given]) => given !== null)) {
      const given = options as Record<string, unknown>;
      const config = given.config as { file?: string; data?: unknown } | undefined;
      let handle;
      try {
        handle = startProcess({
          config: config !== undefined && "file" in config ? { file: String(config.file) } : { data: config?.data ?? null },
          userModules: { modules: Array.isArray(given.modules) ? given.modules : [] },
          network: {},
          source: new InMemoryBlockSource({ head: 1n }),
          log: () => undefined,
        });
      } catch (error) {
        codes.push(`threw ${String(error)}`);
        continue;
      }
      codes.push(
        await handle.started.then(
          () => "started",
          (error: { code?: string; details?: { reason?: string } }) => `${error.code} ${error.details?.reason ?? ""}`.trim(),
        ),
      );
      await handle.stop();
    }
    expect(codes.filter((code) => code.endsWith("invalid-option"))).toEqual([]);
  }, 60_000);
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

  it("mounted in a host's server, api.http, api.upgrade and admin.http answer 503 with the lifecycle's body", async () => {
    const { createServer } = await import("node:http");
    const { connect } = await import("node:net");
    const handle = startUmbraDB({
      config: { data: libraryData(PGLITE_MEMORY) },
      source: new InMemoryBlockSource({ head: 1n }),
      log: () => {
        throw new Error("a host's log that throws loses its line, and nothing else");
      },
    });
    const server = createServer((request, response) =>
      (request.url?.startsWith("/admin/") ? handle.admin.http : handle.api.http)(request, response),
    );
    server.on("upgrade", (request, socket, head) => handle.api.upgrade(request, socket, head));
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as { port: number };
    try {
      await handle.started;
      const api = await fetch(`http://127.0.0.1:${port}/api/rows`);
      expect(api.status).toBe(503);
      expect(api.headers.get("x-umbra-version")).toMatch(/^\d+\.\d+\.\d+/);
      expect(await api.json()).toMatchObject({ error: { code: "not-serving" }, state: handle.status().state, reason: null });
      const admin = await fetch(`http://127.0.0.1:${port}/admin/status`);
      expect(admin.status).toBe(503);
      expect(admin.headers.get("x-umbra-version")).toBeNull();
      expect(await admin.json()).toMatchObject({ error: { code: "not-serving" } });
      const upgraded = await new Promise<string>((resolve, reject) => {
        const socket = connect(port, "127.0.0.1", () =>
          socket.write(
            "GET /subscriptions HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: Upgrade\r\nUpgrade: websocket\r\n" +
              "Sec-WebSocket-Version: 13\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n\r\n",
          ),
        );
        let text = "";
        socket.on("data", (chunk) => {
          text += chunk.toString();
        });
        socket.on("end", () => resolve(text));
        socket.on("error", reject);
      });
      expect(upgraded).toMatch(/^HTTP\/1\.1 503 Service Unavailable\r\n/);
      expect(upgraded).toContain('"code":"not-serving"');
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await handle.stop();
    }
  }, 60_000);

  it("the lifecycle's body names the state and the reason, never a message of a failure", () => {
    expect(JSON.parse(lifecycleBody({ state: "starting", reason: null }))).toEqual({
      error: { code: "not-serving", message: "this handler does not serve while the process is starting" },
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
