import { once } from "node:events";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { mountedAdminFetch } from "../../src/admin/mounted.js";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import type { ReadHandle } from "../../src/db/api.js";
import type { PrivateLinkChannel } from "../../src/library/channels.js";
import type { ApiRegistry } from "../../src/modules/declaration.js";
import { coreHeaders, notServingResponse, refuseChannelNotServing } from "../../src/runner/api-answers.js";
import {
  answerRequest,
  connectChannel,
  connectionRules,
  moduleApiFetch,
  responseOf,
  type SubscriptionCarrier,
  SubscriptionConnection,
} from "../../src/runner/api-session.js";
import { listenModuleApi, moduleApiHandlers } from "../../src/runner/api-socket.js";
import { ApiRoutes, ModuleApi } from "../../src/runner/module-api.js";
import { channelPair, until } from "../library/channel-fixtures.js";
import { Client } from "../library/mounted-fixtures.js";

/**
 * The module API's session logic on its own (`src/runner/api-session.ts`), with the module API over a stand-in
 * database whose reads see height 7: the fetch-style handler's and the channel connection's edges that the processes'
 * tests do not reach — a body whose stream fails, an answer with no body, a carrier that throws in each of its members,
 * a `bufferedAmount` whose getter or call throws ending the connection (a carrier that cannot tell what it holds cannot
 * be held to the limit; issue 00068), one absent being no limit, a carrier without `terminate` — and the lifecycle's
 * and admin's fetch-style answers. [LM-11, RN-15, RN-16, LM-5]
 *
 * A client's malformed message — any JSON value where an id or a field is expected, objects whose conversion to text
 * throws among them — is answered `invalid-request` and the connection goes on, on each carrier of the protocol: a
 * host's channel (the engine's `api.connect`), the handlers mounted in a host's server (`api.upgrade`) and the listener
 * (`listen.api`); and, as a property, on the session itself. [LM-4, LM-10, RN-15]
 */

const read: ReadHandle = Object.freeze({ height: 7n, query: async () => [] }) as unknown as ReadHandle;
const db = { read: <T>(body: (r: ReadHandle) => Promise<T>) => body(read) };

/** A module API with one route per answer a test needs, and the subscription `feed`, whose emits are `emits`. */
function api(emits: Set<(value: unknown) => void>): ModuleApi {
  const routes = new ApiRoutes();
  const registration = routes.open("m");
  const registry: ApiRegistry = registration.registry;
  registry.http("GET", "/none", async () => ({ status: 204, body: "" }));
  registry.http("GET", "/named", async () => ({ status: 200, headers: { "x-umbra-version": "a module's own", "X-Kept": "yes" }, body: { a: 1 } }));
  registry.subscription("feed", (_args, emit) => {
    emits.add(emit);
    return () => emits.delete(emit);
  });
  registration.close();
  routes.check();
  return new ModuleApi(routes, { db, timeoutMs: 1_000 });
}

/** A channel whose members do what `overrides` says, the rest of them as a test-owned channel's. */
function throwing(overrides: Partial<PrivateLinkChannel>): { readonly channel: PrivateLinkChannel; readonly peer: PrivateLinkChannel } {
  const [mine, peer] = channelPair();
  const channel: PrivateLinkChannel = {
    send: (message) => mine.send(message),
    onMessage: (listener) => mine.onMessage(listener),
    onClose: (listener) => mine.onClose(listener),
    close: () => mine.close(),
    ...overrides,
  };
  return { channel, peer };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

/**
 * A host's channel whose `bufferedAmount` cannot be read once `state.fails` is set: its getter (`getter`) or the
 * method itself (`method`) throws; `reads` counts the attempts. Its message listener is kept (`heard`), so a test calls
 * it as the host's carrier does; its close tells its close listeners at once.
 */
function unreadableAmount(kind: "getter" | "method") {
  const state = {
    fails: false,
    reads: 0,
    closes: 0,
    sent: [] as string[],
    heard: undefined as ((message: string) => void) | undefined,
  };
  const closeListeners = new Set<() => void>();
  const channel: PrivateLinkChannel = {
    send: (message) => {
      state.sent.push(message);
    },
    onMessage: (listener) => {
      state.heard = listener;
      return () => {
        state.heard = undefined;
      };
    },
    onClose: (listener) => {
      closeListeners.add(listener);
      return () => {
        closeListeners.delete(listener);
      };
    },
    close: () => {
      state.closes += 1;
      for (const listener of [...closeListeners]) listener();
    },
  };
  const read = (): void => {
    state.reads += 1;
    if (state.fails) throw new Error(`host bufferedAmount ${kind}`);
  };
  Object.defineProperty(
    channel,
    "bufferedAmount",
    kind === "getter"
      ? {
          get: () => {
            read();
            return () => 0;
          },
        }
      : { value: () => (read(), 0) },
  );
  return { channel, state };
}

describe("the module API's session logic (LM-11)", () => {
  it("the fetch-style handler: a body whose stream fails is refused 400; an answer without a body has none; the core's headers replace a module's own", async () => {
    const fetch = moduleApiFetch(api(new Set()), { core: coreHeaders("0xhash") });
    const failing = new Request("http://module-api/named", {
      method: "POST",
      body: new ReadableStream({ pull: (controller) => controller.error(new Error("the stream broke")) }),
      duplex: "half",
    } as RequestInit);
    const refused = await fetch(failing);
    expect([refused.status, await refused.json()]).toEqual([400, { error: { code: "invalid-request", message: "the request could not be read" } }]);
    const none = await fetch(new Request("http://module-api/none"));
    expect([none.status, none.body, none.headers.get("x-umbra-version")]).toEqual([204, null, UMBRADB_VERSION]);
    const named = await fetch(new Request("http://module-api/named"));
    expect([named.headers.get("x-umbra-version"), named.headers.get("x-umbra-config-hash"), named.headers.get("x-kept")]).toEqual([UMBRADB_VERSION, "0xhash", "yes"]);
    expect(await named.json()).toEqual({ a: 1 });
    // Without the core's headers (a negative control's), the module's own stays.
    const bare = responseOf(await api(new Set()).answer({ method: "GET", path: "/named" }), null);
    expect(bare.headers.get("x-umbra-version")).toBe("a module's own");
    // A URL the transport could not read.
    expect((await answerRequest(api(new Set()), "GET", undefined, "")).status).toBe(400);
  });

  it("the lifecycle's answers: a 503 Response with the core's headers; a channel told and closed, also one that throws", async () => {
    const answer = notServingResponse({ state: "refused", reason: { code: "callback-error", height: 3n, module: "m", point: "on-start-db" } }, "0xhash");
    expect([answer.status, answer.headers.get("x-umbra-config-hash"), answer.headers.get("cache-control")]).toEqual([503, "0xhash", "no-store"]);
    expect(await answer.json()).toEqual({
      error: { code: "not-serving", message: "the module API does not serve while the process is refused" },
      state: "refused",
      reason: { code: "callback-error", height: "3", module: "m", point: "on-start-db" },
    });
    const { channel } = throwing({
      send: () => {
        throw new Error("send");
      },
      close: () => {
        throw new Error("close");
      },
    });
    expect(() => refuseChannelNotServing(channel, { state: "starting", reason: null })).not.toThrow();
  });

  it("a channel connection: a send that throws ends it after the emit; an absent or unknown bufferedAmount is no limit; no terminate is a close", async () => {
    const emits = new Set<(value: unknown) => void>();
    const module = api(emits);
    const rules = connectionRules({ maxBufferedBytes: 10 });
    // A send that throws once the subscription is open, on a carrier without bufferedAmount (it bounds its own queue).
    let fails = false;
    let ended = 0;
    const sent: string[] = [];
    const { channel, peer } = throwing({
      send: (message) => {
        if (fails) throw new Error("the carrier broke");
        sent.push(message);
      },
    });
    connectChannel(channel, module, { rules, ended: () => (ended += 1) });
    peer.send(JSON.stringify({ type: "subscribe", id: "s", name: "feed" }));
    await until(() => sent.length === 1, "subscribed");
    fails = true;
    for (const emit of [...emits]) emit("x".repeat(100));
    // Not unsubscribed inside the emit; ended once, after it.
    expect(emits.size).toBe(1);
    await until(() => emits.size === 0 && ended === 1, "the throwing carrier ended");

    // A bufferedAmount that is no number is read as unknown: the value is sent. A carrier without terminate is closed.
    let held: unknown = Number.NaN;
    const out: string[] = [];
    const second = throwing({ send: (message) => out.push(message), bufferedAmount: () => held as number, terminate: undefined });
    let closes = 0;
    const closing = second.channel.close;
    const connection = connectChannel({ ...second.channel, close: () => ((closes += 1), closing()) }, module, { rules });
    second.peer.send(JSON.stringify({ type: "subscribe", id: "t", name: "feed" }));
    await until(() => out.length === 1, "subscribed again");
    for (const emit of [...emits]) emit("y".repeat(100));
    expect(out).toHaveLength(2);
    held = 1_000;
    for (const emit of [...emits]) emit("z");
    await until(() => emits.size === 0, "the slow subscriber unsubscribed");
    expect([out.length, closes]).toEqual([2, 1]);
    // The connection's own close after its end does nothing more.
    await connection.close();
    expect(closes).toBe(1);
  });

  it.each(["getter", "method"] as const)(
    "a channel whose bufferedAmount %s throws has ended: nothing thrown into the carrier's listener or out of a module's emit, nothing sent after, closed once and its subscriptions unsubscribed after the emit (issue 00068)",
    async (kind) => {
      const rules = connectionRules({});
      // The answer to a client's message, inside the carrier's own message listener.
      {
        const { channel, state } = unreadableAmount(kind);
        let ended = 0;
        connectChannel(channel, api(new Set()), { rules, ended: () => (ended += 1) });
        state.fails = true;
        expect(() => state.heard?.("not json")).not.toThrow();
        expect([state.sent, ended, state.closes]).toEqual([[], 0, 0]);
        await settle();
        expect([ended, state.closes, state.heard, state.reads]).toEqual([1, 1, undefined, 1]);
      }
      // A module's emit: nothing unsubscribed or closed inside it, nothing read or sent after; the module API's close
      // after the end does nothing more.
      {
        const emits = new Set<(value: unknown) => void>();
        const { channel, state } = unreadableAmount(kind);
        let ended = 0;
        const connection = connectChannel(channel, api(emits), { rules, ended: () => (ended += 1) });
        state.heard?.(JSON.stringify({ type: "subscribe", id: "s", name: "feed" }));
        expect(state.sent.map((text) => JSON.parse(text))).toEqual([{ type: "subscribed", id: "s" }]);
        state.fails = true;
        state.reads = 0;
        for (const emit of [...emits]) {
          expect(() => emit("x")).not.toThrow();
          expect(() => emit("y")).not.toThrow();
        }
        expect([emits.size, ended, state.closes, state.sent.length]).toEqual([1, 0, 0, 1]);
        await settle();
        expect([emits.size, ended, state.closes, state.sent.length, state.reads]).toEqual([0, 1, 1, 1, 1]);
        await connection.close();
        expect([ended, state.closes]).toEqual([1, 1]);
      }
      // The module API's close in the same turn as the failed read: closed and ended once.
      {
        const emits = new Set<(value: unknown) => void>();
        const { channel, state } = unreadableAmount(kind);
        let ended = 0;
        const connection = connectChannel(channel, api(emits), { rules, ended: () => (ended += 1) });
        state.heard?.(JSON.stringify({ type: "subscribe", id: "s", name: "feed" }));
        state.fails = true;
        for (const emit of [...emits]) emit("x");
        await connection.close();
        await settle();
        expect([emits.size, ended, state.closes]).toEqual([0, 1, 1]);
      }
    },
  );

  it("a channel whose registration throws is closed and ended, and nothing reaches the host", async () => {
    let closes = 0;
    let ended = 0;
    const { channel } = throwing({
      onMessage: () => {
        throw new Error("no listener taken");
      },
      close: () => {
        closes += 1;
        throw new Error("nor a close");
      },
    });
    expect(() => connectChannel(channel, api(new Set()), { rules: connectionRules({}), ended: () => (ended += 1) })).not.toThrow();
    expect([closes, ended]).toEqual([1, 1]);
  });

  it("admin's fetch-style handler answers 500 for an answer that throws, and a URL's query is passed with its path", async () => {
    const seen: string[] = [];
    const fetch = mountedAdminFetch((method, url) => {
      seen.push(`${method} ${url}`);
      if (url.startsWith("/fail")) throw new Error("the snapshot could not be built");
      return { status: 200, body: { ok: true } };
    });
    const failed = await fetch(new Request("http://admin/fail"));
    expect([failed.status, await failed.json()]).toEqual([500, { error: { code: "internal-error", message: "the admin endpoint failed" } }]);
    const ok = await fetch(new Request("http://admin/status?x=1"));
    expect([ok.status, await ok.json(), ok.headers.get("content-length")]).toEqual([200, { ok: true }, "11"]);
    expect(seen).toEqual(["GET /fail", "GET /status?x=1"]);
  });
});

/** Values a client sends where an id or a field is expected whose conversion to text throws (`String(value)`). */
const POISONED: readonly unknown[] = [{ toString: null }, { toString: {}, valueOf: {} }, [{ toString: null }]];

/** The messages of a malformed client, then a valid `subscribe`, and the answers each gets, in order. [LM-4, LM-10] */
const MALFORMED_CLIENT: readonly { readonly sent: unknown; readonly answer: unknown }[] = [
  ...POISONED.map((id) => ({
    sent: { type: "unsubscribe", id },
    answer: {
      type: "error",
      error: { code: "invalid-request", message: `an unsubscribe message's id is a string, not ${Array.isArray(id) ? "a list" : "an object"}` },
    },
  })),
  ...POISONED.map((id) => ({
    sent: { type: "subscribe", id, name: "feed" },
    answer: {
      type: "error",
      error: { code: "invalid-request", message: "a subscribe message has an id, a string of 1 to 128 characters, and a name, a string" },
    },
  })),
  ...POISONED.map((type) => ({
    sent: { type },
    answer: { type: "error", error: { code: "invalid-request", message: "a message is a JSON object with a type" } },
  })),
  { sent: { type: "subscribe", id: "after", name: "feed" }, answer: { type: "subscribed", id: "after" } },
];

describe("a subscription client's malformed message is answered invalid-request, never thrown (LM-4, LM-10)", () => {
  it("over a host's channel (api.connect): each answered, the connection goes on", async () => {
    const [mine, peer] = channelPair();
    const answers: unknown[] = [];
    peer.onMessage((text) => answers.push(JSON.parse(text)));
    connectChannel(mine, api(new Set()), { rules: connectionRules({}) });
    for (const { sent } of MALFORMED_CLIENT) peer.send(JSON.stringify(sent));
    await until(() => answers.length >= MALFORMED_CLIENT.length, "every answer", 5_000);
    expect(answers).toEqual(MALFORMED_CLIENT.map(({ answer }) => answer));
    expect(mine.ended).toBe(false);
  });

  it("through the handlers mounted in a host's server (api.upgrade): each answered, the connection goes on", async () => {
    const handlers = moduleApiHandlers(api(new Set()));
    const server = createServer((_request, response) => response.end());
    server.on("upgrade", handlers.upgrade);
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const client = await Client.connect(`ws://127.0.0.1:${(server.address() as AddressInfo).port}/subscriptions`);
    try {
      for (const { sent } of MALFORMED_CLIENT) client.send(sent);
      expect(await client.until(MALFORMED_CLIENT.length, 5_000)).toEqual(MALFORMED_CLIENT.map(({ answer }) => answer));
    } finally {
      await client.close();
      await handlers.close();
      server.close();
    }
  });

  it("on the listener (listen.api): each answered, the connection goes on", async () => {
    const listener = await listenModuleApi(api(new Set()), "127.0.0.1:0");
    const client = await Client.connect(`ws://127.0.0.1:${listener.port}/`);
    try {
      for (const { sent } of MALFORMED_CLIENT) client.send(sent);
      expect(await client.until(MALFORMED_CLIENT.length, 5_000)).toEqual(MALFORMED_CLIENT.map(({ answer }) => answer));
    } finally {
      await client.close();
      await listener.close();
    }
  });

  it("any JSON value, or a poisoned object, in any field of a message: one answer, never a throw (fast-check, seed 2848, 500 runs)", () => {
    const poisoned = fc.constantFrom(...POISONED);
    const value = fc.oneof(fc.jsonValue(), poisoned, fc.array(poisoned, { maxLength: 2 }), fc.dictionary(fc.string(), poisoned, { maxKeys: 2 }));
    const message = fc.oneof(
      fc.record({ type: value }),
      fc.record({ type: fc.constantFrom("subscribe", "unsubscribe"), id: value, name: value, args: value }),
      fc.record({ type: fc.constantFrom("subscribe", "unsubscribe"), id: value }),
      value,
    );
    const emits = new Set<(value: unknown) => void>();
    const module = api(emits);
    fc.assert(
      fc.property(message, (sent) => {
        const out: string[] = [];
        const carrier: SubscriptionCarrier = { send: (text) => out.push(text), bufferedAmount: () => 0, disconnect: () => undefined };
        const connection = new SubscriptionConnection(carrier, module, connectionRules({}));
        expect(() => connection.received(JSON.stringify(sent))).not.toThrow();
        expect(out).toHaveLength(1);
        expect(["error", "subscribed", "complete"]).toContain((JSON.parse(out[0] as string) as { type: string }).type);
        connection.ended();
      }),
      { seed: 2848, numRuns: 500 },
    );
    expect(emits.size).toBe(0);
  });
});
