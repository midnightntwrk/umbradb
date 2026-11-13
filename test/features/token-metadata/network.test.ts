import net from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { commonRecords, metadataRecord } from "../../../src/features/token-metadata/codec/index.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, post, serve, TOKENS_PATH } from "./harness.js";

/**
 * No network request. While the module runs and serves, every outbound connection of this process —
 * `net` sockets (`net.Socket.prototype.connect`, which TLS and HTTP use too) and `fetch` — is refused unless it goes to
 * the loopback interface, where the tests' node, database and listener are. An identity with an `image` URI (and an
 * `image_sha256`) is described, listed and served (`image` pending, no `imageUrl`) with nothing refused. **Negative
 * control:** a `fetch` of the image's URI under the same guard is refused and recorded.
 */

const LOOPBACK = /^(127\.\d+\.\d+\.\d+|::1|localhost|\[::1\])$/;
const IMAGE = "https://images.example.com/acme.png";

interface Guard {
  readonly refused: string[];
  /** The loopback connections let through: the guard was in the path. */
  readonly allowed: string[];
  remove(): void;
}

/** Refuses and records every outbound connection to a host other than loopback (see the module comment). */
function guardNetwork(): Guard {
  const refused: string[] = [];
  const allowed: string[] = [];
  const connect = net.Socket.prototype.connect;
  const realFetch = globalThis.fetch;
  net.Socket.prototype.connect = function (this: net.Socket, ...args: unknown[]) {
    // `net.connect` and the HTTP clients pass their normalized arguments as one array: [options, callback].
    const given = Array.isArray(args[0]) ? (args[0] as unknown[]) : args;
    const first = given[0] as { host?: string; path?: string } | number | string;
    const host = typeof first === "object" && first !== null ? (first.path !== undefined ? "unix" : (first.host ?? "localhost")) : typeof first === "number" ? String(given[1] ?? "localhost") : "unix";
    if (host !== "unix" && !LOOPBACK.test(host)) {
      refused.push(`socket ${host}`);
      throw new Error(`an outbound connection to ${host} was refused`);
    }
    allowed.push(`socket ${host}`);
    return (connect as (...a: unknown[]) => net.Socket).apply(this, args);
  } as typeof connect;
  globalThis.fetch = (async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    if (!LOOPBACK.test(url.hostname)) {
      refused.push(`fetch ${url.hostname}`);
      throw new Error(`a fetch of ${url.hostname} was refused`);
    }
    allowed.push(`fetch ${url.hostname}`);
    return realFetch(input, init);
  }) as typeof fetch;
  return {
    refused,
    allowed,
    remove() {
      net.Socket.prototype.connect = connect;
      globalThis.fetch = realFetch;
    },
  };
}

const S = 4_000;
const A = contract(0x1a);
const D = domain(3);

describe.each(PROCESS_BACKENDS)("no network request, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("an identity with an image URI is stored and served while every outbound connection is refused", async () => {
    const db = await backend.database();
    const guard = guardNetwork();
    try {
      const logs = new Map([
        [
          BigInt(S + 1),
          blockLogs([
            0,
            A,
            eventData(D, 1, [
              ...commonRecords({ name: "Pictured", symbol: "PIC", decimals: 0 }),
              metadataRecord.uri("image", IMAGE),
              metadataRecord.bytes("image_sha256", new Uint8Array(32).fill(7)),
            ]),
          ]),
        ],
      ]);
      const answers = await serve(db, { start: S, head: S + 2, logs }, async (origin) => ({
        identity: (await post(origin, TOKENS_PATH, { contract: Buffer.from(A).toString("hex"), domainSep: Buffer.from(D).toString("hex"), kind: 1 })).json.items[0],
        list: (await post(origin, TOKENS_PATH, { contract: Buffer.from(A).toString("hex") })).json,
      }));
      expect(answers.identity.image).toEqual({ url: IMAGE, status: "pending", imageUrl: null });
      expect(answers.list.items.at(-1).image).toEqual({ url: IMAGE, status: "pending", imageUrl: null });
      expect(guard.refused).toEqual([]);
      expect(guard.allowed.filter((a) => a.startsWith("fetch ")).length).toBeGreaterThanOrEqual(2);
      expect(guard.allowed.filter((a) => a.startsWith("socket ")).length).toBeGreaterThanOrEqual(2);
      // [NEG] The guard refuses and records what the module never does: fetching the image.
      await expect(fetch(IMAGE)).rejects.toThrow(/refused/);
      expect(guard.refused).toEqual(["fetch images.example.com"]);
      expect(() => net.connect({ host: "images.example.com", port: 443 })).toThrow(/refused/);
      expect(guard.refused).toEqual(["fetch images.example.com", "socket images.example.com"]);
    } finally {
      guard.remove();
    }
  }, 240_000);
});
