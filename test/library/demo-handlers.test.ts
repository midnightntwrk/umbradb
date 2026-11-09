import { MessageChannel, type MessagePort } from "node:worker_threads";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import { messagePortChannel } from "../../src/library/channels.js";
import { engineInputOf, startUmbraDB, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { EngineOptions, ProcessHandle } from "../../src/runner/process.js";
import { gate } from "../admin/admin-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { startProcess } from "../runner/process-build.js";
import { channelPair, until } from "./channel-fixtures.js";
import { libraryData } from "./library-fixtures.js";
import { eventually, exchange, type Exchanged, headerValues, type MapiHooks, mapiModule, mountHandlers } from "./mounted-fixtures.js";

/**
 * The browser demo's handlers on the engine (`ProcessHandle.api.fetch`, `api.connect`, `admin.fetch`): internal members
 * that `startUmbraDB` does not give a host, built for a page, which has no Node.js server. Each is held to the mounted
 * Node.js handler it stands for, on PostgreSQL 18 and PGlite.
 *
 * - `api.fetch` answers every request as mounted `api.http` does — the same status, body, content type and core headers
 *   for the module's answers and the module API's own errors, 413 past the body limit, 400 for a body that is no UTF-8
 *   or was read already, on PostgreSQL 504 past `apiReadTimeoutMs` — and the lifecycle's 503 while the module
 *   API does not serve, `X-Umbra-Config-Hash` absent before the hash exists.
 * - `admin.fetch` answers the four endpoints as mounted `admin.http` does, in every state and after `closed`.
 * - `api.connect(channel)` runs the module API's subscription protocol on a host's channel — a Node.js `MessageChannel`
 *   through `messagePortChannel`, and a test-owned channel — with the module API's rules and no envelope: its error
 *   answers (an `unsubscribe` whose id is an object whose conversion to text throws among them), its 64 KiB message limit in UTF-8 bytes (the channel closed), its slow-subscriber close through
 *   `bufferedAmount` (after the module's emit returned), the channels closed at the stop; a channel offered while the
 *   module API does not serve gets the lifecycle's body, then is closed.
 * - `[NEG]` Each check removed on the mounted paths (`mountedApi`: the message limit, the slow-subscriber check, the
 *   error answers, the body limit, the core's headers) fails its oracle row.
 */

/** The engine a host's options start, as `startUmbraDB` starts it, plus `seams` (the controls'). */
function engineOf(options: UmbraDBOptions, seams: Partial<EngineOptions> = {}): ProcessHandle {
  const { input } = engineInputOf(options);
  return startProcess({ ...input, ...seams });
}

/** Waits for the engine's cursor at `height`. */
const reaches = (engine: ProcessHandle, height: bigint): Promise<void> =>
  eventually(() => {
    const status = engine.status();
    if (status.ended !== null) throw new Error(`processing ended (${status.ended.kind}) at ${status.cursor}`);
    return status.cursor === height;
  }, `the cursor at ${height}`, 120_000);

/**
 * `mapi`'s hooks, and a wait for the module's own emits to `feed` to be over: its `on-after-db-write` of `height`, the
 * last height, has run — so a subscription opened after it gets only the test's own values.
 */
function quietHooks(): { readonly hooks: MapiHooks; settled(height: bigint): Promise<void> } {
  const written: bigint[] = [];
  return {
    hooks: { emits: new Set(), afterWrite: (height) => written.push(height) },
    settled: (height) => eventually(() => written.includes(height), `on-after-db-write of ${height}`, 120_000),
  };
}

/** A fetch-style request of the module API at `path`. */
const requestOf = (method: string, path: string, body?: string | Uint8Array): Request =>
  new Request(`http://module-api${path}`, { method, ...(body === undefined ? {} : { body: body as BodyInit, headers: { "Content-Type": "application/json" } }) });

/** What two answers are compared on: status, body text, content type and the core's headers. */
interface Compared {
  readonly status: number;
  readonly text: string;
  readonly type: readonly string[];
  readonly version: readonly string[];
  readonly hash: readonly string[];
}

const comparedOfResponse = async (response: Response): Promise<Compared> => ({
  status: response.status,
  text: await response.text(),
  type: response.headers.get("content-type") === null ? [] : [response.headers.get("content-type") as string],
  version: response.headers.get("x-umbra-version") === null ? [] : [response.headers.get("x-umbra-version") as string],
  hash: response.headers.get("x-umbra-config-hash") === null ? [] : [response.headers.get("x-umbra-config-hash") as string],
});

const comparedOfExchange = (answer: Exchanged): Compared => ({
  status: answer.status,
  text: answer.text,
  type: headerValues(answer, "content-type"),
  version: headerValues(answer, "x-umbra-version"),
  hash: headerValues(answer, "x-umbra-config-hash"),
});

/** A body one byte over the module API's default limit (1 MiB). */
const OVERSIZE = JSON.stringify("x".repeat(1_048_575));

/** Bytes that are no UTF-8. */
const NOT_UTF8 = new Uint8Array([0x7b, 0xff, 0xfe, 0x7d]);

/** The answers the protocol's checks give (as the listener gives them, as in `mounted-api.test.ts`). */
const PROTOCOL_ERRORS = [
  { type: "error", error: { code: "invalid-request", message: "a message is a JSON object with a type" } },
  { type: "error", error: { code: "invalid-request", message: "a message's type is subscribe or unsubscribe" } },
  {
    type: "error",
    error: { code: "invalid-request", message: "a subscribe message has an id, a string of 1 to 128 characters, and a name, a string" },
  },
  { type: "error", id: "x", error: { code: "not-found", message: "no subscription is named nothing" } },
  // A message that is no text, as a WebSocket's binary frame.
  { type: "error", error: { code: "invalid-request", message: "a message is a JSON object with a type" } },
  // An id whose conversion to text throws: answered, never thrown out of the channel's callback.
  { type: "error", error: { code: "invalid-request", message: "an unsubscribe message's id is a string, not an object" } },
];

/** An `unsubscribe` whose id is an object whose conversion to text throws. */
const POISONED_UNSUBSCRIBE = '{"type":"unsubscribe","id":{"toString":null}}';

/** The test's end of a Node.js `MessageChannel` the engine's `api.connect` serves: every message kept, and its close. */
class PortPeer {
  readonly received: unknown[] = [];
  readonly raw: unknown[] = [];
  closed = false;
  readonly #port: MessagePort;

  constructor(port: MessagePort) {
    this.#port = port;
    port.on("message", (data: unknown) => {
      this.raw.push(data);
      this.received.push(typeof data === "string" ? JSON.parse(data) : data);
    });
    port.on("close", () => {
      this.closed = true;
    });
  }

  /** A text as it is, anything else as JSON text; `{ raw }` posted as it is (no text). */
  send(message: unknown): void {
    if (typeof message === "object" && message !== null && "raw" in message) this.#port.postMessage((message as { raw: unknown }).raw);
    else this.#port.postMessage(typeof message === "string" ? message : JSON.stringify(message));
  }

  async count(n: number, ms = 10_000): Promise<unknown[]> {
    await until(() => this.received.length >= n, `${n} messages on the channel`, ms).catch(() => undefined);
    return this.received.slice(0, n);
  }

  close(): void {
    this.#port.close();
  }
}

/** A `MessageChannel` whose one end `engine.api.connect` serves, through `messagePortChannel`; the other end the test's. */
function connected(engine: ProcessHandle): PortPeer {
  const channel = new MessageChannel();
  engine.api.connect(messagePortChannel(channel.port1 as unknown as Parameters<typeof messagePortChannel>[0]));
  return new PortPeer(channel.port2);
}

/** What the connect checks saw (see {@link connectSeen}). */
interface ConnectSeen {
  readonly errors: readonly unknown[];
  readonly envelopeFree: boolean;
  readonly values: readonly unknown[];
  readonly oversizeClosed: { readonly ascii: boolean; readonly utf8: boolean };
  readonly slow: { readonly disconnected: boolean; readonly insideEmit: boolean; readonly sentAnyway: boolean };
}

/** The `api.connect` checks on a serving `engine` (see the module comment), `hooks` the module's emits. */
async function connectSeen(engine: ProcessHandle, hooks: MapiHooks): Promise<ConnectSeen> {
  const protocol = connected(engine);
  for (const message of ["{not json", { type: "dance" }, { type: "subscribe", id: 7, name: "feed" }, { type: "subscribe", id: "x", name: "nothing" }, { raw: { not: "text" } }, POISONED_UNSUBSCRIBE]) {
    protocol.send(message);
  }
  const errors = await protocol.count(PROTOCOL_ERRORS.length, 3_000);
  // A subscription's values, then its end, on the same channel; every message the module API's own, no envelope.
  protocol.send({ type: "subscribe", id: "s1", name: "feed" });
  await protocol.count(PROTOCOL_ERRORS.length + 1);
  for (const emit of [...hooks.emits]) emit({ height: 41n });
  for (const emit of [...hooks.emits]) emit({ bytes: new Uint8Array([1, 2]) });
  protocol.send({ type: "unsubscribe", id: "s1" });
  const values = (await protocol.count(PROTOCOL_ERRORS.length + 4)).slice(PROTOCOL_ERRORS.length);
  const envelopeFree = protocol.raw.every((data) => typeof data === "string" && !("link" in (JSON.parse(data) as object)));
  protocol.close();
  await eventually(() => hooks.emits.size === 0, "the protocol channel unsubscribed");

  /** Whether `message`, sent after a subscription opened, closes the channel within 3 s (and unsubscribes it). */
  const closesOn = async (message: string): Promise<boolean> => {
    const big = connected(engine);
    big.send({ type: "subscribe", id: "1", name: "feed" });
    await big.count(1);
    big.send(message);
    const closed = await until(() => big.closed, "the channel closed", 3_000).then(() => true, () => false);
    big.close();
    await eventually(() => hooks.emits.size === 0, "the oversized message's channel unsubscribed");
    return closed;
  };
  const ascii = await closesOn(JSON.stringify({ type: "subscribe", id: "2", name: "feed", args: "x".repeat(65_536) }));
  // Past 64 KiB in UTF-8 bytes, under it in characters.
  const utf8 = await closesOn(JSON.stringify({ type: "subscribe", id: "2", name: "feed", args: "é".repeat(32_768) }));

  // A carrier that tells what it holds: past 1 MiB, the subscriber is disconnected after the module's emit returned.
  let held = 0;
  const [mine, theirs] = channelPair({ bufferedAmount: () => held, terminate: true });
  const seen: string[] = [];
  theirs.onMessage((message) => seen.push(message));
  engine.api.connect(mine);
  theirs.send(JSON.stringify({ type: "subscribe", id: "slow", name: "feed" }));
  await until(() => seen.length >= 1, "the slow subscriber subscribed").catch((error: unknown) => {
    const why = { seen, ended: mine.ended, listeners: mine.listeners, emits: hooks.emits.size, state: engine.status().state };
    throw new Error(`${(error as Error).message}: ${JSON.stringify(why)}`);
  });
  expect(seen.map((message) => JSON.parse(message))).toEqual([{ type: "subscribed", id: "slow" }]);
  held = 2 * 1_048_576;
  let insideEmit = false;
  for (const emit of [...hooks.emits]) emit({ big: true });
  // The unsubscribe has not run inside the emit: the subscription is still there when it returned.
  insideEmit = hooks.emits.size === 0;
  await eventually(() => hooks.emits.size === 0, "the slow subscriber unsubscribed", 3_000).catch(() => undefined);
  await new Promise((resolve) => setImmediate(resolve));
  const slow = { disconnected: hooks.emits.size === 0 && mine.terminations === 1, insideEmit, sentAnyway: seen.length > 1 };
  theirs.close();
  await eventually(() => hooks.emits.size === 0, "the slow channel unsubscribed");
  return { errors, envelopeFree, values, oversizeClosed: { ascii, utf8 }, slow };
}

/** The `api.connect` oracle over what was seen (see the module comment). */
function connectProblems(seen: ConnectSeen): string[] {
  const problems: string[] = [];
  if (JSON.stringify(seen.errors) !== JSON.stringify(PROTOCOL_ERRORS)) problems.push(`the protocol's checks answered ${JSON.stringify(seen.errors)}`);
  if (!seen.envelopeFree) problems.push("a message carried an envelope");
  const values = [
    { type: "subscribed", id: "s1" },
    { type: "next", id: "s1", value: { height: "41" } },
    { type: "next", id: "s1", value: { bytes: "0x0102" } },
    { type: "complete", id: "s1" },
  ];
  if (JSON.stringify(seen.values) !== JSON.stringify(values)) problems.push(`the subscription gave ${JSON.stringify(seen.values)}`);
  if (!seen.oversizeClosed.ascii) problems.push("a message over 64 KiB left the channel open");
  if (!seen.oversizeClosed.utf8) problems.push("a message over 64 KiB in UTF-8 bytes left the channel open");
  if (!seen.slow.disconnected) problems.push("a subscriber holding more than 1 MiB unsent stayed connected");
  if (seen.slow.insideEmit) problems.push("the slow subscriber was unsubscribed inside the module's emit");
  if (seen.slow.sentAnyway) problems.push("the value was sent to a subscriber past its limit");
  return problems;
}

/** The fetch differential's requests: method, path and body. */
const FETCHED: readonly (readonly [string, string, (string | Uint8Array)?])[] = [
  ["GET", "/rows"],
  ["GET", "/rows?x=1&x=2"],
  ["GET", "/view"],
  ["GET", "/own-503"],
  ["GET", "/nothing"],
  ["POST", "/rows", "{}"],
  ["POST", "/echo", JSON.stringify({ a: 1, big: "12345678901234567890" })],
  ["POST", "/echo", "{not json"],
  ["POST", "/echo", OVERSIZE],
  ["POST", "/echo", NOT_UTF8],
  ["GET", "/fails"],
];

/** The differential: each request through `fetch` and through the mounted Node.js handler at `origin`. */
async function fetchProblems(engine: ProcessHandle, origin: string, postgres: boolean): Promise<string[]> {
  const problems: string[] = [];
  const requests = [...FETCHED, ...(postgres ? [["GET", "/sleep"] as const] : [])];
  for (const [method, path, body] of requests) {
    const fetched = await comparedOfResponse(await engine.api.fetch(requestOf(method, path, body)));
    const mounted = comparedOfExchange(await exchange(origin, method, path, body === undefined ? undefined : Buffer.from(body)));
    if (JSON.stringify(fetched) !== JSON.stringify(mounted)) {
      problems.push(`${method} ${path}: fetch ${JSON.stringify(fetched).slice(0, 300)}, mounted ${JSON.stringify(mounted).slice(0, 300)}`);
    }
  }
  return problems;
}

/**
 * The fetch rules on their own, the oracle a control's process fails: an oversized body refused 413
 * `request-too-large`, and the core's headers on an answer once the hash exists.
 */
async function fetchRuleProblems(engine: ProcessHandle): Promise<string[]> {
  const problems: string[] = [];
  const large = await engine.api.fetch(requestOf("POST", "/echo", OVERSIZE));
  const code = ((await large.json()) as { error?: { code?: string } }).error?.code;
  if (large.status !== 413 || code !== "request-too-large") problems.push(`an oversized body answered ${large.status}`);
  const rows = await engine.api.fetch(requestOf("GET", "/rows"));
  if (rows.headers.get("x-umbra-version") !== UMBRADB_VERSION) problems.push(`GET /rows: X-Umbra-Version ${rows.headers.get("x-umbra-version")}`);
  if (!/^0x[0-9a-f]{64}$/.test(rows.headers.get("x-umbra-config-hash") ?? "")) {
    problems.push(`GET /rows: X-Umbra-Config-Hash ${rows.headers.get("x-umbra-config-hash")}`);
  }
  return problems;
}

describe.each(PROCESS_BACKENDS)("the browser demo's handlers on the engine, on $name", (backend: ProcessBackend) => {
  const postgres = backend.kind === "postgres";
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("api.fetch answers as mounted api.http: status, body, type and core headers; 413, 400; 504 on PostgreSQL", async () => {
    const db = await backend.database();
    const hooks: MapiHooks = { emits: new Set() };
    const m = mapiModule(hooks);
    const engine = engineOf({
      config: { data: libraryData(db.setting, [m], { apiReadTimeoutMs: 1_000 }) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 2n }),
    });
    const host = await mountHandlers(engine);
    try {
      await engine.started;
      await reaches(engine, 2n);
      expect(await fetchProblems(engine, host.origin, postgres)).toEqual([]);
      expect(await fetchRuleProblems(engine)).toEqual([]);
      // Each answer names the build and the configuration once.
      const answer = await engine.api.fetch(requestOf("GET", "/rows"));
      expect(answer.headers.get("x-umbra-version")).toBe(UMBRADB_VERSION);
      expect(answer.headers.get("x-umbra-config-hash")).toMatch(/^0x[0-9a-f]{64}$/);
      // A body the host read before it handed the request over.
      const read = requestOf("POST", "/echo", "{}");
      await read.text();
      const refused = await engine.api.fetch(read);
      expect([refused.status, await refused.json()]).toEqual([
        400,
        { error: { code: "invalid-request", message: "the request body was read before the module API got the request" } },
      ]);
      // The handle a host gets has none of the demo's members.
      const facade = startUmbraDB({ config: { data: libraryData((await backend.database()).setting) }, source: new InMemoryBlockSource({ head: 1n }) });
      expect(Object.keys(facade.api).sort()).toEqual(["http", "upgrade"]);
      expect(Object.keys(facade.admin)).toEqual(["http"]);
      expect(Object.keys(engine.api).sort()).toEqual(["connect", "fetch", "http", "upgrade"]);
      await facade.stop();
    } finally {
      await engine.stop();
      await host.close();
    }
  }, 180_000);

  it("the lifecycle: 503 not-serving before and after the module API serves, channels refused then, admin.fetch throughout", async () => {
    const db = await backend.database();
    const hooks: MapiHooks = { emits: new Set(), startDb: gate() };
    const m = mapiModule(hooks);
    const engine = engineOf({ config: { data: libraryData(db.setting, [m]) }, modules: [m], source: new InMemoryBlockSource({ head: 2n }) });
    const host = await mountHandlers(engine);
    try {
      await (hooks.startDb as NonNullable<MapiHooks["startDb"]>).reached;
      // Starting, before the hash exists: the lifecycle's 503 with the version only; a channel told and closed.
      const before = await engine.api.fetch(requestOf("GET", "/rows"));
      expect(before.headers.get("x-umbra-version")).toBe(UMBRADB_VERSION);
      expect(before.headers.get("x-umbra-config-hash")).toBeNull();
      expect([before.status, await before.json()]).toEqual([
        503,
        { error: { code: "not-serving", message: "the module API does not serve while the process is starting" }, state: "starting", reason: null },
      ]);
      const early = connected(engine);
      await until(() => early.closed, "the channel offered while starting closed");
      expect(early.received).toEqual([
        { error: { code: "not-serving", message: "the module API does not serve while the process is starting" }, state: "starting", reason: null },
      ]);
      const live = await engine.admin.fetch(new Request("http://admin/health/live"));
      expect([live.status, (await live.json()).thread]).toEqual([200, "host"]);

      hooks.startDb?.open();
      await engine.started;
      await reaches(engine, 2n);
      const serving = await engine.api.fetch(requestOf("GET", "/rows"));
      const hash = serving.headers.get("x-umbra-config-hash");
      expect([serving.status, hash]).toEqual([200, expect.stringMatching(/^0x[0-9a-f]{64}$/)]);
      // A channel open at the stop: the module API's close closes it and unsubscribes it.
      const open = connected(engine);
      open.send({ type: "subscribe", id: "s", name: "feed" });
      await open.count(1);
      expect(hooks.emits.size).toBe(1);
      await engine.stop();
      await until(() => open.closed, "the channel open at the stop closed");
      expect(hooks.emits.size).toBe(0);
      const after = await engine.api.fetch(requestOf("GET", "/rows"));
      expect(after.headers.get("x-umbra-config-hash")).toBe(hash);
      expect([after.status, ((await after.json()) as { state: string }).state]).toEqual([503, "stopping"]);
      const late = connected(engine);
      await until(() => late.closed, "the channel offered after the stop closed");
      expect((late.received[0] as { state: string }).state).toBe("stopping");
      // Admin answers after closed, from the last snapshot, as admin.http does.
      // `/status`'s uptime is the moment's: not compared.
      const timeless = (text: string) => ({ ...(JSON.parse(text) as Record<string, unknown>), uptimeMs: null });
      for (const path of ["/status", "/config", "/health/ready"]) {
        const fetched = await engine.admin.fetch(new Request(`http://admin${path}`));
        const mounted = await exchange(host.admin, "GET", path);
        expect([fetched.status, timeless(await fetched.text())], path).toEqual([mounted.status, timeless(mounted.text)]);
      }
    } finally {
      hooks.startDb?.open();
      await engine.stop();
      await host.close();
    }
  }, 180_000);

  it("admin.fetch answers the four endpoints as mounted admin.http does: status, body and headers; HEAD without a body", async () => {
    const db = await backend.database();
    const engine = engineOf({ config: { data: libraryData(db.setting) }, source: new InMemoryBlockSource({ head: 2n }) });
    const host = await mountHandlers(engine);
    try {
      await engine.started;
      await reaches(engine, 2n);
      for (const [method, path] of [["GET", "/config"], ["GET", "/health/ready"], ["GET", "/nothing"], ["POST", "/status"], ["GET", "/status?x=1"]] as const) {
        const fetched = await engine.admin.fetch(new Request(`http://admin${path}`, { method }));
        const mounted = await exchange(host.admin, method, path);
        const text = await fetched.text();
        const parse = (body: string) => {
          const value = JSON.parse(body) as Record<string, unknown>;
          // `/status` names the moment it was built: not compared.
          delete value.heartbeatAgeMs;
          delete value.uptimeMs;
          return value;
        };
        expect([fetched.status, parse(text)], `${method} ${path}`).toEqual([mounted.status, parse(mounted.text)]);
        // `/status`'s uptime changes its length between the two answers.
        const compared = path.startsWith("/status") || method === "POST" ? ["content-type", "cache-control"] : ["content-type", "content-length", "cache-control"];
        expect(compared.map((name) => fetched.headers.get(name)), `${method} ${path}`).toEqual(compared.map((name) => headerValues(mounted, name)[0] ?? null));
        expect(fetched.headers.get("content-length")).toBe(String(Buffer.byteLength(text)));
        for (const name of ["x-umbra-version", "x-umbra-config-hash"]) expect(fetched.headers.get(name)).toBeNull();
      }
      const live = await engine.admin.fetch(new Request("http://admin/health/live"));
      expect(live.status).toBe(200);
      expect(Object.keys(await live.json()).sort()).toEqual(["heartbeatAgeMs", "live", "livenessTimeoutMs", "thread"]);
      // A HEAD is no admin endpoint's method (404, as admin.http answers it), its headers without a body.
      const head = await engine.admin.fetch(new Request("http://admin/status", { method: "HEAD" }));
      const mountedHead = await exchange(host.admin, "HEAD", "/status");
      expect([head.status, await head.text(), head.headers.get("content-type")]).toEqual([mountedHead.status, "", "application/json; charset=utf-8"]);
      expect(mountedHead.status).toBe(404);
    } finally {
      await engine.stop();
      await host.close();
    }
  }, 180_000);

  it("api.connect runs the subscription protocol on a host's channel with the module API's rules and no envelope", async () => {
    const db = await backend.database();
    const { hooks, settled } = quietHooks();
    const m = mapiModule(hooks);
    const engine = engineOf({ config: { data: libraryData(db.setting, [m]) }, modules: [m], source: new InMemoryBlockSource({ head: 2n }) });
    try {
      await engine.started;
      await reaches(engine, 2n);
      await settled(2n);
      expect(connectProblems(await connectSeen(engine, hooks))).toEqual([]);
    } finally {
      await engine.stop();
    }
  }, 180_000);

  it("[NEG] each check removed on the mounted paths fails its oracle row", async () => {
    const controls: readonly { readonly what: string; readonly seams: NonNullable<EngineOptions["mountedApi"]>; readonly fails: string }[] = [
      { what: "no message limit", seams: { maxMessageBytes: 0 }, fails: "a message over 64 KiB left the channel open" },
      { what: "no slow-subscriber check", seams: { maxBufferedBytes: Number.POSITIVE_INFINITY }, fails: "a subscriber holding more than 1 MiB unsent stayed connected" },
      { what: "no error answers", seams: { answersErrors: false }, fails: "the protocol's checks answered []" },
    ];
    for (const control of controls) {
      const db = await backend.database();
      const { hooks, settled } = quietHooks();
      const m = mapiModule(hooks);
      const engine = engineOf(
        { config: { data: libraryData(db.setting, [m]) }, modules: [m], source: new InMemoryBlockSource({ head: 1n }) },
        { mountedApi: control.seams },
      );
      try {
        await engine.started;
        await reaches(engine, 1n);
        await settled(1n);
        expect(connectProblems(await connectSeen(engine, hooks)), control.what).toContain(control.fails);
      } finally {
        await engine.stop();
      }
    }
    // The body limit and the core's headers, on fetch: the rule rows the real process passes fail.
    for (const [what, seams, fails] of [
      ["no body limit", { maxBodyBytes: Number.MAX_SAFE_INTEGER }, "an oversized body answered 200"],
      ["no core headers", { coreHeaders: "none" }, "GET /rows: X-Umbra-Version null"],
    ] as const) {
      const db = await backend.database();
      const m = mapiModule({ emits: new Set() });
      const engine = engineOf(
        { config: { data: libraryData(db.setting, [m]) }, modules: [m], source: new InMemoryBlockSource({ head: 1n }) },
        { mountedApi: seams },
      );
      try {
        await engine.started;
        await reaches(engine, 1n);
        expect(await fetchRuleProblems(engine), what).toContain(fails);
      } finally {
        await engine.stop();
      }
    }
  }, 600_000);
});
