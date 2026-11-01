import { describe, expect, it } from "vitest";
import { mountedAdminFetch } from "../../src/admin/mounted.js";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import type { ReadHandle } from "../../src/db/api.js";
import type { PrivateLinkChannel } from "../../src/library/channels.js";
import type { ApiRegistry } from "../../src/modules/declaration.js";
import { coreHeaders, notServingResponse, refuseChannelNotServing } from "../../src/runner/api-answers.js";
import { answerRequest, connectChannel, connectionRules, moduleApiFetch, responseOf } from "../../src/runner/api-session.js";
import { ApiRoutes, ModuleApi } from "../../src/runner/module-api.js";
import { channelPair, until } from "../library/channel-fixtures.js";

/**
 * The module API's session logic on its own (`src/runner/api-session.ts`), with the module API over a stand-in
 * database whose reads see height 7: the fetch-style handler's and the channel connection's edges that the processes'
 * tests do not reach — a body whose stream fails, an answer with no body, a carrier that throws in each of its members,
 * a carrier without `terminate` — and the lifecycle's and admin's fetch-style answers. [LM-11, RN-15, RN-16, LM-5]
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

  it("a channel connection: a send that throws ends it after the emit; an unknown or throwing bufferedAmount is no limit; no terminate is a close", async () => {
    const emits = new Set<(value: unknown) => void>();
    const module = api(emits);
    const rules = connectionRules({ maxBufferedBytes: 10 });
    // A send that throws once the subscription is open.
    let fails = false;
    let ended = 0;
    const sent: string[] = [];
    const { channel, peer } = throwing({
      send: (message) => {
        if (fails) throw new Error("the carrier broke");
        sent.push(message);
      },
      bufferedAmount: () => {
        throw new Error("unknown");
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
