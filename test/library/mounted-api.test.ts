import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import { engineInputOf, handleOf, startUmbraDB, type UmbraDBHandle, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import type { ModuleApi } from "../../src/runner/module-api.js";
import { ModuleApi as RealModuleApi } from "../../src/runner/module-api.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { EngineOptions } from "../../src/runner/process.js";
import { gate } from "../admin/admin-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { startProcess } from "../runner/process-build.js";
import { HASH, hashesOfSecrets, hashProblems } from "./config-hash-cases.js";
import { cursorReaches, libraryData } from "./library-fixtures.js";
import {
  Client,
  eventually,
  exchange,
  type Exchanged,
  headerValues,
  type MapiHooks,
  mapiModule,
  type Mounted,
  mountHandlers,
  rawHeaderValues,
  upgradeHead,
} from "./mounted-fixtures.js";

/**
 * The module API's handlers mounted in a host's own server (`startUmbraDB`'s `api.http` and `api.upgrade`), against
 * UmbraDB's own listener on the same process (`network.api: { port: 0 }`), on PostgreSQL 18 and PGlite. [LM-4, RN-15,
 * RN-16, DB-15]
 *
 * - **L23**: every module-API answer, mounted and on the listener, carries `X-Umbra-Version` once; before the
 *   configuration hash exists (a module's `on-start-db` held) the mounted answers — the lifecycle's 503 and the
 *   upgrade's — carry no `X-Umbra-Config-Hash`; once it exists (the bootstrap's wait, serving, after the stop's drain)
 *   every answer carries the same one, the listener's: a route's answers, a 404, a 405, the module API's own 400, 413
 *   and 500, and on PostgreSQL its 504.
 * - **L24** `[NEG]`: mounted `api.http`, a body over the module API's limit gets 413 `request-too-large`, as on the
 *   listener; on PostgreSQL a read past `apiReadTimeoutMs` fails `query-timeout` (504), as on the listener; on PGlite a
 *   read past it completes, as on the listener (DB-15). Controls: the mounted path without the body limit, and over a
 *   module API whose read is not bounded, each fail the oracle.
 * - **L68** `[NEG]`: through mounted `api.upgrade`, as on the listener: a message that is not a JSON object with a
 *   type (text that is no JSON, a list, a string, a number, null, an object without a type), a `subscribe` without a
 *   valid id or name, an unknown type, an `unsubscribe` whose id is an object whose conversion to text throws are
 *   answered `invalid-request` (the connection goes on), an unknown subscription
 *   name `not-found`; a message over the module API's 64 KiB closes the connection (1009); a subscriber holding more
 *   than 1 MiB unsent is disconnected; the upgrade's 101 carries `X-Umbra-Version` and `X-Umbra-Config-Hash`, which
 *   holds no secret and does not change with one (a password in `database` on PostgreSQL; a TLS key and a node URL's
 *   credentials on PGlite; the run and oracle are `./config-hash-cases.ts`'s). Controls, each on the mounted path only:
 *   no error answers, no message limit, no slow-subscriber check, no core headers; and, in
 *   `./mounted-api.negative-control.test.ts`, a configuration hash over the secrets on the mounted handlers only.
 */


/** A JSON body one byte over the module API's default limit (1 MiB): a handler without the limit would echo it. */
const OVERSIZE = JSON.stringify("x".repeat(1_048_575));

/** `handle`'s module API listener as an origin. */
function listenerOf(handle: UmbraDBHandle): { readonly origin: string; readonly ws: string } {
  const api = handle.status().listening.api;
  if (api === null) throw new Error("the module API does not listen");
  return { origin: `http://${api.host}:${api.port}`, ws: `ws://${api.host}:${api.port}` };
}

/** The handle a host gets over the engine started with `options`' exact input plus `seams` (the controls'). */
function startWithSeams(options: UmbraDBOptions, seams: Partial<EngineOptions>): UmbraDBHandle {
  const { input } = engineInputOf(options);
  return handleOf(startProcess({ ...input, ...seams }));
}

/** Problems with `answer`'s core headers: the version once, and the hash once as `hash` (or absent for null). */
function coreHeaderProblems(where: string, answer: Exchanged, hash: string | null): string[] {
  const problems: string[] = [];
  const versions = headerValues(answer, "x-umbra-version");
  if (versions.length !== 1 || versions[0] !== UMBRADB_VERSION) problems.push(`${where}: X-Umbra-Version ${JSON.stringify(versions)}`);
  const hashes = headerValues(answer, "x-umbra-config-hash");
  const wanted = hash === null ? [] : [hash];
  if (JSON.stringify(hashes) !== JSON.stringify(wanted)) problems.push(`${where}: X-Umbra-Config-Hash ${JSON.stringify(hashes)}`);
  return problems;
}

/** The same for an upgrade's raw head. */
function upgradeHeaderProblems(where: string, head: string, hash: string | null): string[] {
  const problems: string[] = [];
  const versions = rawHeaderValues(head, "x-umbra-version");
  if (versions.length !== 1 || versions[0] !== UMBRADB_VERSION) problems.push(`${where}: X-Umbra-Version ${JSON.stringify(versions)}`);
  const hashes = rawHeaderValues(head, "x-umbra-config-hash");
  const wanted = hash === null ? [] : [hash];
  if (JSON.stringify(hashes) !== JSON.stringify(wanted)) problems.push(`${where}: X-Umbra-Config-Hash ${JSON.stringify(hashes)}`);
  return problems;
}

/** The parsed body of `answer`. */
const json = (answer: Exchanged): Record<string, unknown> => JSON.parse(answer.text) as Record<string, unknown>;

/**
 * The L24 oracle on `target` (the mounted origin or the listener's): the oversized body refused 413 `request-too-large`
 * (a small one echoed); on PostgreSQL `/sleep` and `/idle` 504 `query-timeout` within 2.5 s; on PGlite `/idle` answered
 * 200 (not bounded). None when so.
 */
async function limitProblems(where: string, origin: string, postgres: boolean): Promise<string[]> {
  const problems: string[] = [];
  const large = await fetch(`${origin}/echo`, { method: "POST", body: OVERSIZE, headers: { "Content-Type": "application/json" } });
  const largeBody = (await large.json()) as { error?: { code?: string } };
  if (large.status !== 413 || largeBody.error?.code !== "request-too-large") {
    problems.push(`${where}: an oversized body answered ${large.status} ${JSON.stringify(largeBody).slice(0, 80)}, not 413 request-too-large`);
  }
  const small = await exchange(origin, "POST", "/echo", JSON.stringify({ a: 1 }));
  if (small.status !== 200 || JSON.stringify(json(small)) !== JSON.stringify({ echoed: { a: 1 } })) {
    problems.push(`${where}: a small body answered ${small.status} ${small.text}`);
  }
  const paths = postgres ? ["/sleep", "/idle"] : [];
  for (const path of paths) {
    const at = performance.now();
    const answer = await exchange(origin, "GET", path);
    const ms = performance.now() - at;
    const code = answer.status === 504 ? (json(answer).error as { code?: string } | undefined)?.code : undefined;
    if (answer.status !== 504 || code !== "query-timeout" || ms > 2_500) {
      problems.push(`${where}: ${path} answered ${answer.status} after ${Math.round(ms)} ms, not 504 query-timeout within 2.5 s`);
    }
  }
  if (!postgres) {
    const idle = await exchange(origin, "GET", "/idle");
    if (idle.status !== 200) problems.push(`${where}: /idle answered ${idle.status}, not 200 (a PGlite read is not bounded)`);
  }
  return problems;
}

/** What one subscription check saw: the protocol's error answers, the oversized message's close, the slow subscriber's end. */
interface SubscriptionSeen {
  readonly errors: readonly unknown[];
  readonly oversizeClose: number | "open";
  readonly slowDisconnected: boolean;
}

/**
 * The protocol's malformed messages, in order: text that is no JSON, JSON that is no object (a list, a string, a
 * number, null), an object without a type, an unknown type, `subscribe`s without a valid id or name (an id that is
 * no string or is empty, a name missing or no string), an unknown subscription name. [L68]
 */
const PROTOCOL_MESSAGES: readonly unknown[] = [
  "{not json",
  "[1,2]",
  '"text"',
  "42",
  "null",
  {},
  { type: "dance" },
  { type: "subscribe", id: 7, name: "feed" },
  { type: "subscribe", id: "", name: "feed" },
  { type: "subscribe", id: "y" },
  { type: "subscribe", id: "y", name: 7 },
  { type: "subscribe", id: "x", name: "nothing" },
];

/** The answer to a message that is no JSON object with a type. */
const NOT_AN_OBJECT = { type: "error", error: { code: "invalid-request", message: "a message is a JSON object with a type" } };

/** The answer to a `subscribe` without a valid id and name. */
const NO_ID_AND_NAME = {
  type: "error",
  error: { code: "invalid-request", message: "a subscribe message has an id, a string of 1 to 128 characters, and a name, a string" },
};

/** The answers the protocol's checks give (as the listener gives them), one for each of {@link PROTOCOL_MESSAGES}, then the poisoned unsubscribe's. */
const PROTOCOL_ERRORS = [
  ...Array.from({ length: 6 }, () => NOT_AN_OBJECT),
  { type: "error", error: { code: "invalid-request", message: "a message's type is subscribe or unsubscribe" } },
  ...Array.from({ length: 4 }, () => NO_ID_AND_NAME),
  { type: "error", id: "x", error: { code: "not-found", message: "no subscription is named nothing" } },
  // An id whose conversion to text throws: answered, never thrown out of the socket's callback. [LM-4, LM-10]
  { type: "error", error: { code: "invalid-request", message: "an unsubscribe message's id is a string, not an object" } },
];

/** An `unsubscribe` whose id is an object whose conversion to text throws. */
const POISONED_UNSUBSCRIBE = '{"type":"unsubscribe","id":{"toString":null}}';

/**
 * The L68 subscription checks at `ws` (see the module comment), `hooks` the module's emits. Each client is closed
 * before the next check, so the slow subscriber is `feed`'s only one.
 */
async function subscriptionSeen(ws: string, hooks: MapiHooks): Promise<SubscriptionSeen> {
  const protocol = await Client.connect(ws);
  for (const message of [...PROTOCOL_MESSAGES, POISONED_UNSUBSCRIBE]) protocol.send(message);
  // Every answer comes within 3 s, or the check counts what came.
  await protocol.until(PROTOCOL_ERRORS.length, 3_000).catch(() => undefined);
  const errors = [...protocol.messages];
  await protocol.close();

  const big = await Client.connect(ws);
  big.send({ type: "subscribe", id: "1", name: "feed" });
  await big.until(1);
  big.send({ type: "subscribe", id: "2", name: "feed", args: "x".repeat(65_536) });
  const oversizeClose = await Promise.race([big.closed, new Promise<"open">((resolve) => setTimeout(() => resolve("open"), 3_000))]);
  await big.close();
  await eventually(() => hooks.emits.size === 0, "the oversized message's connection unsubscribed");

  const slow = await Client.connect(ws);
  slow.send({ type: "subscribe", id: "1", name: "feed" });
  await slow.until(1);
  // The client stops reading: what the server sends piles up in its buffer.
  slow.raw.pause();
  const value = "x".repeat(256 * 1024);
  // 64 values of 256 KiB, 16 MiB: far more than the 1 MiB limit and what the system's socket buffers hold.
  for (let index = 0; index < 64 && hooks.emits.size > 0; index++) {
    for (const emit of [...hooks.emits]) emit(value);
    await new Promise((resolve) => setImmediate(resolve));
  }
  const slowDisconnected = hooks.emits.size === 0;
  slow.raw.resume();
  slow.socket.terminate();
  await eventually(() => hooks.emits.size === 0, "the slow subscriber unsubscribed").catch(() => undefined);
  return { errors, oversizeClose, slowDisconnected };
}

/** The L68 oracle over what the mounted path saw, against the expected answers (the listener's own). */
function subscriptionProblems(where: string, seen: SubscriptionSeen): string[] {
  const problems: string[] = [];
  if (JSON.stringify(seen.errors) !== JSON.stringify(PROTOCOL_ERRORS)) {
    problems.push(`${where}: the protocol's checks answered ${JSON.stringify(seen.errors)}`);
  }
  if (seen.oversizeClose !== 1009) problems.push(`${where}: a message over 64 KiB left the connection ${String(seen.oversizeClose)}, not closed 1009`);
  if (!seen.slowDisconnected) problems.push(`${where}: a subscriber holding more than 1 MiB unsent stayed connected`);
  return problems;
}

describe.each(PROCESS_BACKENDS)("the module API's mounted handlers on $name (LM-4)", (backend: ProcessBackend) => {
  const postgres = backend.kind === "postgres";
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("L23: X-Umbra-Version on every answer; X-Umbra-Config-Hash absent before the hash exists, the listener's after", async () => {
    const db = await backend.database();
    const hooks: MapiHooks = { emits: new Set(), startDb: gate() };
    const m = mapiModule(hooks);
    // S = 1 above the head: once on-start-db ran (and the hash was read), startup waits for the node.
    const source = new InMemoryBlockSource({ head: 0n });
    // A read bound to 1 s, so that on PostgreSQL a read past it answers 504. [DB-15]
    const handle = startUmbraDB({
      config: { data: libraryData(db.setting, [m], { apiReadTimeoutMs: 1_000 }) },
      modules: [m],
      source,
      network: { api: { port: 0 } },
    });
    const host = await mountHandlers(handle);
    const problems: string[] = [];
    try {
      await (hooks.startDb as NonNullable<MapiHooks["startDb"]>).reached;
      // Before the hash exists: the lifecycle's 503, the version only; no listener yet.
      const before = await exchange(host.origin, "GET", "/rows");
      expect([before.status, json(before).state, json(before).reason]).toEqual([503, "starting", null]);
      problems.push(...coreHeaderProblems("mounted, before the hash", before, null));
      const beforeUpgrade = await upgradeHead(host.origin);
      expect(beforeUpgrade.head.split("\r\n")[0]).toBe("HTTP/1.1 503 Service Unavailable");
      problems.push(...upgradeHeaderProblems("mounted upgrade, before the hash", beforeUpgrade.head, null));
      expect(handle.status().listening.api).toBeNull();

      hooks.startDb?.open();
      await eventually(() => handle.status().conditions.some((condition) => condition.code === "waiting-for-node"), "the bootstrap's wait");
      // The hash exists now: the lifecycle's 503 carries it.
      const waiting = await exchange(host.origin, "GET", "/rows");
      expect([waiting.status, json(waiting).state]).toEqual([503, "starting"]);
      const hash = headerValues(waiting, "x-umbra-config-hash")[0] ?? null;
      expect(hash).toMatch(HASH);
      problems.push(...coreHeaderProblems("mounted, waiting", waiting, hash));
      problems.push(...upgradeHeaderProblems("mounted upgrade, waiting", (await upgradeHead(host.origin)).head, hash));

      source.finalize(3n);
      await handle.started;
      await cursorReaches(handle, 3n);
      const listener = listenerOf(handle);
      for (const [where, origin] of [["mounted", host.origin], ["listener", listener.origin]] as const) {
        for (const path of ["/rows", "/view", "/own-503", "/nothing"]) {
          problems.push(...coreHeaderProblems(`${where} ${path}`, await exchange(origin, "GET", path), hash));
        }
        problems.push(...coreHeaderProblems(`${where} POST /rows`, await exchange(origin, "POST", "/rows", "{}"), hash));
        // The module API's own error answers: a body that is no JSON (400), one over the limit (413), a handler that
        // throws (500), and on PostgreSQL a read past apiReadTimeoutMs (504).
        const errors: (readonly [string, number, Exchanged])[] = [
          ["POST /echo, no JSON", 400, await exchange(origin, "POST", "/echo", "{not json")],
          ["POST /echo, over the limit", 413, await exchange(origin, "POST", "/echo", OVERSIZE)],
          ["GET /fails", 500, await exchange(origin, "GET", "/fails")],
          ...(postgres ? [["GET /sleep", 504, await exchange(origin, "GET", "/sleep")] as const] : []),
        ];
        for (const [what, status, answer] of errors) {
          if (answer.status !== status) problems.push(`${where} ${what}: answered ${answer.status}, not ${status}`);
          problems.push(...coreHeaderProblems(`${where} ${what}`, answer, hash));
        }
        const upgraded = await upgradeHead(origin);
        expect(upgraded.upgraded, where).toBe(true);
        problems.push(...upgradeHeaderProblems(`${where} upgrade`, upgraded.head, hash));
      }
      await handle.stop();
      // After the drain: the lifecycle's 503 again, the hash still on it.
      const after = await exchange(host.origin, "GET", "/rows");
      expect([after.status, json(after).state]).toEqual([503, "stopping"]);
      problems.push(...coreHeaderProblems("mounted, after the stop", after, hash));
      expect(problems).toEqual([]);
    } finally {
      hooks.startDb?.open();
      await handle.stop();
      await host.close();
    }
  }, 120_000);

  it("L24: mounted api.http refuses a body over the limit with 413 and bounds reads as the listener does (DB-15)", async () => {
    const db = await backend.database();
    const hooks: MapiHooks = { emits: new Set() };
    const m = mapiModule(hooks);
    const handle = startUmbraDB({
      config: { data: libraryData(db.setting, [m], { apiReadTimeoutMs: 1_000 }) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 2n }),
      network: { api: { port: 0 } },
    });
    const host = await mountHandlers(handle);
    try {
      await handle.started;
      await cursorReaches(handle, 2n);
      expect(await limitProblems("mounted", host.origin, postgres)).toEqual([]);
      expect(await limitProblems("listener", listenerOf(handle).origin, postgres)).toEqual([]);
    } finally {
      await handle.stop();
      await host.close();
    }
  }, 120_000);

  it("L24's negative controls: the mounted path without the body limit, and over a read that is not bounded, fail the oracle", async () => {
    const db = await backend.database();
    const hooks: MapiHooks = { emits: new Set() };
    const m = mapiModule(hooks);
    const unbounded = (routes: ConstructorParameters<typeof RealModuleApi>[0], options: ConstructorParameters<typeof RealModuleApi>[1]): ModuleApi =>
      new RealModuleApi(routes, { ...options, timeoutMs: 600_000 });
    const handle = startWithSeams(
      {
        config: { data: libraryData(db.setting, [m], { apiReadTimeoutMs: 1_000 }) },
        modules: [m],
        source: new InMemoryBlockSource({ head: 2n }),
        network: { api: { port: 0 } },
      },
      { mountedApi: { maxBodyBytes: Number.MAX_SAFE_INTEGER, ...(postgres ? { moduleApi: unbounded } : {}) } },
    );
    const host = await mountHandlers(handle);
    try {
      await handle.started;
      await cursorReaches(handle, 2n);
      const problems = await limitProblems("mounted", host.origin, postgres);
      expect(problems.some((problem) => problem.startsWith("mounted: an oversized body answered 200"))).toBe(true);
      if (postgres) {
        expect(problems.some((problem) => problem.startsWith("mounted: /sleep answered 200"))).toBe(true);
        expect(problems.some((problem) => problem.startsWith("mounted: /idle answered 200"))).toBe(true);
      }
      // The listener keeps its rules: the controls change the mounted path only.
      expect(await limitProblems("listener", listenerOf(handle).origin, postgres)).toEqual([]);
    } finally {
      await handle.stop();
      await host.close();
    }
  }, 120_000);

  it("L68: mounted api.upgrade answers, limits and disconnects as the listener does; its 101 names the build and the configuration", async () => {
    const db = await backend.database();
    const hooks: MapiHooks = { emits: new Set() };
    const m = mapiModule(hooks);
    const handle = startUmbraDB({
      config: { data: libraryData(db.setting, [m]) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 2n }),
      network: { api: { port: 0 } },
    });
    const host = await mountHandlers(handle);
    try {
      await handle.started;
      await cursorReaches(handle, 2n);
      const listener = listenerOf(handle);
      const onListener = await subscriptionSeen(listener.ws, hooks);
      const mounted = await subscriptionSeen(host.ws, hooks);
      // The listener's answers are the expected ones, and the mounted path's are the same.
      expect(subscriptionProblems("listener", onListener)).toEqual([]);
      expect(subscriptionProblems("mounted", mounted)).toEqual([]);
      expect(mounted).toEqual(onListener);
      const hash = rawHeaderValues((await upgradeHead(listener.origin)).head, "x-umbra-config-hash")[0] ?? null;
      expect(hash).toMatch(HASH);
      expect(upgradeHeaderProblems("mounted upgrade", (await upgradeHead(host.origin)).head, hash)).toEqual([]);
    } finally {
      await handle.stop();
      await host.close();
    }
  }, 180_000);

  it("L68's negative controls: each check removed on the mounted path only fails the oracle there, the listener unchanged", async () => {
    const controls: readonly { readonly what: string; readonly seams: NonNullable<EngineOptions["mountedApi"]>; readonly fails: string }[] = [
      { what: "no error answers", seams: { answersErrors: false }, fails: "mounted: the protocol's checks answered []" },
      { what: "no message limit", seams: { maxMessageBytes: 0 }, fails: "mounted: a message over 64 KiB left the connection open, not closed 1009" },
      { what: "no slow-subscriber check", seams: { maxBufferedBytes: Number.POSITIVE_INFINITY }, fails: "mounted: a subscriber holding more than 1 MiB unsent stayed connected" },
    ];
    for (const control of controls) {
      const db = await backend.database();
      const hooks: MapiHooks = { emits: new Set() };
      const m = mapiModule(hooks);
      const handle = startWithSeams(
        { config: { data: libraryData(db.setting, [m]) }, modules: [m], source: new InMemoryBlockSource({ head: 2n }), network: { api: { port: 0 } } },
        { mountedApi: control.seams },
      );
      const host = await mountHandlers(handle);
      try {
        await handle.started;
        await cursorReaches(handle, 2n);
        expect(subscriptionProblems("mounted", await subscriptionSeen(host.ws, hooks)), control.what).toContain(control.fails);
        expect(subscriptionProblems("listener", await subscriptionSeen(listenerOf(handle).ws, hooks)), control.what).toEqual([]);
      } finally {
        await handle.stop();
        await host.close();
      }
    }
    // The core's headers left out of the mounted path: its 101 names neither the build nor the configuration.
    const db = await backend.database();
    const m = mapiModule({ emits: new Set() });
    const handle = startWithSeams(
      { config: { data: libraryData(db.setting, [m]) }, modules: [m], source: new InMemoryBlockSource({ head: 1n }), network: { api: { port: 0 } } },
      { mountedApi: { coreHeaders: "none" } },
    );
    const host = await mountHandlers(handle);
    try {
      await handle.started;
      await cursorReaches(handle, 1n);
      const hash = rawHeaderValues((await upgradeHead(listenerOf(handle).origin)).head, "x-umbra-config-hash")[0] ?? null;
      expect(upgradeHeaderProblems("mounted upgrade", (await upgradeHead(host.origin)).head, hash)).toEqual([
        "mounted upgrade: X-Umbra-Version []",
        `mounted upgrade: X-Umbra-Config-Hash []`,
      ]);
    } finally {
      await handle.stop();
      await host.close();
    }
  }, 300_000);

  it("L68: the upgrade's X-Umbra-Config-Hash neither holds nor changes with a secret of the configuration", async () => {
    // The run and its oracle (`./config-hash-cases.ts`): the mounted upgrade's hash, and the listener's the same.
    const seen = await hashesOfSecrets(backend);
    expect(hashProblems("mounted", seen.hashes, seen.secrets)).toEqual([]);
    expect(seen.listener).toEqual(seen.hashes);
  }, 180_000);
});
