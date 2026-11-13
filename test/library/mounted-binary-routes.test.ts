import { createHash } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { request as httpRequest, type IncomingMessage, type OutgoingHttpHeaders } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { z } from "zod";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import { startUmbraDB, type UmbraDBHandle } from "../../src/library/start-umbradb.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { type Gate, gate } from "../admin/admin-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { cursorReaches, libraryData } from "./library-fixtures.js";
import { mountHandlers } from "./mounted-fixtures.js";

/**
 * The module API's binary routes (FR-C3) through the handlers a host mounts (`startUmbraDB`'s `api.http`) and on
 * UmbraDB's own listener of the same process, over PostgreSQL 18 and PGlite: the module `bapi` and a running process.
 *
 * - A binary route takes bytes that are no UTF-8, in a buffer of its own; a JSON route refuses them 400.
 * - The binary route's own limit (1.5 MiB, above the 1 MiB default): just under and at it taken, one byte over 413; the
 *   JSON route keeps the default (1 MiB + 1 byte: 413).
 * - The handler sees the request's headers.
 * - File answers: the whole file, `bytes=a-b`, `bytes=a-`, `bytes=-n` (206), a range outside the file (416), and a
 *   32 MiB file whole, its digest the file's.
 * - The read is released before the file is sent: while a client holds a 32 MiB download unread, another request reads
 *   the database and is answered, on PGlite too, whose one connection a held read would keep. Negative control (PGlite):
 *   the same oracle fails while a handler does hold its read.
 */

/** `n` bytes counting up from `from`, modulo 256: bytes that are no UTF-8 among them. */
const bytes = (n: number, from = 0): Uint8Array<ArrayBuffer> => Uint8Array.from({ length: n }, (_, index) => (from + index) % 256);
const sha256 = (data: Uint8Array): string => createHash("sha256").update(data).digest("hex");

/** One HTTP answer, read whole: its status, its headers (names in lower case), its body. */
interface Exchanged {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: Buffer;
}

/** `method path` against `origin` with `body` and `headers`, read whole; rejects when no answer comes within `ms`. */
function exchange(
  origin: string,
  method: string,
  path: string,
  options: { readonly body?: Uint8Array | string; readonly headers?: OutgoingHttpHeaders; readonly ms?: number } = {},
): Promise<Exchanged> {
  const { hostname, port } = new URL(origin);
  const body = options.body === undefined ? undefined : Buffer.from(options.body);
  const headers = { ...(body === undefined ? {} : { "Content-Length": String(body.byteLength) }), ...options.headers };
  return new Promise((resolve, reject) => {
    const outgoing = httpRequest({ hostname, port, method, path, headers, agent: false, timeout: options.ms ?? 30_000 }, (answer) => {
      const chunks: Buffer[] = [];
      answer.on("data", (chunk: Buffer) => chunks.push(chunk));
      answer.on("end", () => {
        const named: Record<string, string> = {};
        for (let index = 0; index < answer.rawHeaders.length; index += 2) {
          named[(answer.rawHeaders[index] as string).toLowerCase()] = answer.rawHeaders[index + 1] as string;
        }
        resolve({ status: answer.statusCode ?? 0, headers: named, body: Buffer.concat(chunks) });
      });
      answer.on("error", reject);
    });
    outgoing.on("timeout", () => outgoing.destroy(new Error(`no answer to ${method} ${path} within ${options.ms ?? 30_000} ms`)));
    outgoing.on("error", reject);
    outgoing.end(body);
  });
}

const json = (answer: Exchanged): unknown => JSON.parse(answer.body.toString("utf8"));

/** The binary route's own limit. */
const LIMIT = 1_572_864;
/** The large file's size: 32 MiB. */
const LARGE_SIZE = 32 * 1_048_576;

/** The user module `bapi`: binary and JSON routes, a headers route, file routes over `files`, and a route holding its read. */
function bapiModule(files: Readonly<Record<string, string>>, hold: { gate?: Gate }): ModuleDeclaration {
  return {
    id: "bapi",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "bapi-rows", lifetimes: ["table"], table: { schema: "bapi", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE bapi.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-db-write"(_p, b, w) {
        await w.execute("INSERT INTO bapi.rows (height) VALUES ($1)", [b.height]);
      },
      async "on-start-api"(_p, api) {
        api.http(
          "POST",
          "/bin",
          async (req, read) => {
            const [row] = await read.query("SELECT count(*)::int AS n FROM bapi.rows");
            const own = req.body.byteOffset === 0 && req.body.buffer.byteLength === req.body.byteLength;
            return { status: 200, body: { length: req.body.byteLength, sha256: sha256(req.body), own, rows: row?.n } };
          },
          { body: "binary", maxBodyBytes: LIMIT },
        );
        api.http("POST", "/json", async (req) => ({ status: 200, body: { got: req.body } }));
        api.http("GET", "/headers", async (req) => ({ status: 200, body: { ...req.headers } }));
        api.http("GET", "/rows", async (_req, read) => {
          const [row] = await read.query("SELECT count(*)::int AS n FROM bapi.rows");
          return { status: 200, body: { rows: row?.n } };
        });
        api.http("GET", "/file/:name", async (req) => {
          const path = files[req.params.name ?? ""];
          if (path === undefined) return { status: 404, body: { missing: req.params.name } };
          return { status: 200, headers: { ETag: `"${req.params.name}"`, "Cache-Control": "immutable" }, file: { path } };
        });
        // Holds its read until the test opens the gate: the negative control's held read.
        api.http("GET", "/hold", async (_req, read) => {
          await read.query("SELECT 1 AS one");
          await hold.gate?.wait();
          return { status: 200, body: "held" };
        });
      },
    },
  } as ModuleDeclaration;
}

/**
 * Starts a download of `path` at `origin` and holds it after its first chunk: `resume` reads the rest and resolves
 * with its length and digest.
 */
async function heldDownload(origin: string, path: string): Promise<{ readonly status: number; resume(): Promise<{ length: number; digest: string }> }> {
  const { hostname, port } = new URL(origin);
  return new Promise((resolve, reject) => {
    const outgoing = httpRequest({ hostname, port, path, agent: false }, (answer: IncomingMessage) => {
      const hash = createHash("sha256");
      let length = 0;
      const ended = new Promise<{ length: number; digest: string }>((done, failed) => {
        answer.on("end", () => done({ length, digest: hash.digest("hex") }));
        answer.on("error", failed);
      });
      answer.once("data", (chunk: Buffer) => {
        hash.update(chunk);
        length += chunk.byteLength;
        answer.pause();
        answer.on("data", (next: Buffer) => {
          hash.update(next);
          length += next.byteLength;
        });
        resolve({
          status: answer.statusCode ?? 0,
          resume: () => {
            answer.resume();
            return ended;
          },
        });
      });
    });
    outgoing.on("error", reject);
    outgoing.end();
  });
}

describe.each(PROCESS_BACKENDS)("binary module routes, mounted and on the listener, on $name", (backend: ProcessBackend) => {
  const pglite = backend.kind === "pglite";
  const dir = mkdtempSync(join(tmpdir(), "umbradb-mounted-files-"));
  const SMALL = bytes(100, 3);
  const files = { small: join(dir, "small.bin"), empty: join(dir, "empty.bin"), large: join(dir, "large.bin") };
  let largeDigest = "";
  const hold: { gate?: Gate } = {};
  let handle: UmbraDBHandle | undefined;
  let close: (() => Promise<void>) | undefined;
  const origins: [string, string][] = [];

  beforeAll(async () => {
    writeFileSync(files.small, SMALL);
    writeFileSync(files.empty, new Uint8Array(0));
    const large = new Uint8Array(LARGE_SIZE);
    for (let index = 0; index < large.length; index++) large[index] = (index * 2_654_435_761) >>> 24;
    writeFileSync(files.large, large);
    largeDigest = sha256(large);
    await backend.start();
    const db = await backend.database();
    const m = bapiModule(files, hold);
    handle = startUmbraDB({
      config: { data: libraryData(db.setting, [m], { apiReadTimeoutMs: 30_000 }) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 3n }),
      network: { api: { port: 0 } },
    });
    const host = await mountHandlers(handle);
    close = () => host.close();
    await handle.started;
    await cursorReaches(handle, 3n);
    const api = handle.status().listening.api;
    if (api === null) throw new Error("the module API does not listen");
    origins.push(["mounted", host.origin], ["listener", `http://${api.host}:${api.port}`]);
  }, 180_000);

  afterAll(async () => {
    hold.gate?.open();
    await handle?.stop();
    await close?.();
    await backend.stop();
    rmSync(dir, { recursive: true, force: true });
  }, 120_000);

  it("takes a binary route's bytes up to its own limit, refuses them on a JSON route, and shows the headers", async () => {
    for (const [where, origin] of origins) {
      const body = bytes(4_096, 0x80);
      const taken = await exchange(origin, "POST", "/bin", { body });
      expect([where, taken.status, json(taken)]).toEqual([where, 200, { length: 4_096, sha256: sha256(body), own: true, rows: 3 }]);
      expect(taken.headers["x-umbra-version"], where).toBe(UMBRADB_VERSION);
      expect(taken.headers["x-umbra-config-hash"], where).toMatch(/^0x[0-9a-f]{64}$/);
      const refused = await exchange(origin, "POST", "/json", { body: Uint8Array.of(0x22, 0xff, 0x22) });
      expect([where, refused.status, json(refused)]).toEqual([
        where,
        400,
        { error: { code: "invalid-request", message: "the request body is not UTF-8" } },
      ]);
      for (const size of [LIMIT - 1, LIMIT]) {
        const answer = await exchange(origin, "POST", "/bin", { body: bytes(size) });
        expect([where, size, answer.status, (json(answer) as { length: number }).length]).toEqual([where, size, 200, size]);
      }
      // Fetch's client reads the answer that comes before its body is sent whole.
      const over = await fetch(`${origin}/bin`, { method: "POST", body: bytes(LIMIT + 1) });
      expect([where, over.status, over.headers.get("connection"), await over.json()]).toEqual([
        where,
        413,
        "close",
        { error: { code: "request-too-large", message: `the request body is larger than ${LIMIT} bytes` } },
      ]);
      // The JSON route keeps the default limit, 1 MiB.
      const oversize = await exchange(origin, "POST", "/json", { body: JSON.stringify("x".repeat(1_048_575)) });
      expect([where, oversize.status]).toEqual([where, 413]);
      const headers = await exchange(origin, "GET", "/headers", { headers: { "X-Custom": "One", "x-rep": ["a", "b"] } });
      expect(json(headers), where).toMatchObject({ "x-custom": "One", "x-rep": "a" });
    }
  }, 120_000);

  it("answers file routes: the whole file, one range 206, a range outside the file 416, an empty file", async () => {
    for (const [where, origin] of origins) {
      const whole = await exchange(origin, "GET", "/file/small");
      expect([where, whole.status, whole.headers["content-length"], whole.headers["accept-ranges"], whole.headers.etag]).toEqual([
        where,
        200,
        "100",
        "bytes",
        '"small"',
      ]);
      expect(Buffer.compare(whole.body, Buffer.from(SMALL)), where).toBe(0);
      expect([whole.headers["content-type"], whole.headers["x-umbra-version"]]).toEqual(["application/octet-stream", UMBRADB_VERSION]);
      for (const [range, start, end] of [["bytes=10-19", 10, 19], ["bytes=95-", 95, 99], ["bytes=-10", 90, 99]] as const) {
        const part = await exchange(origin, "GET", "/file/small", { headers: { Range: range } });
        expect([where, range, part.status, part.headers["content-range"]]).toEqual([where, range, 206, `bytes ${start}-${end}/100`]);
        expect(Buffer.compare(part.body, Buffer.from(SMALL.subarray(start, end + 1))), `${where} ${range}`).toBe(0);
      }
      const outside = await exchange(origin, "GET", "/file/small", { headers: { Range: "bytes=100-" } });
      expect([where, outside.status, outside.headers["content-range"], (json(outside) as { error: { code: string } }).error.code]).toEqual([
        where,
        416,
        "bytes */100",
        "range-not-satisfiable",
      ]);
      const empty = await exchange(origin, "GET", "/file/empty");
      expect([where, empty.status, empty.headers["content-length"], empty.body.byteLength]).toEqual([where, 200, "0", 0]);
    }
  }, 120_000);

  it("sends a 32 MiB file whole, its digest the file's; and a range of it", async () => {
    for (const [where, origin] of origins) {
      const answer = await exchange(origin, "GET", "/file/large");
      expect([where, answer.status, answer.body.byteLength, sha256(answer.body)]).toEqual([where, 200, LARGE_SIZE, largeDigest]);
      const tail = await exchange(origin, "GET", "/file/large", { headers: { Range: `bytes=-${1_048_576}` } });
      expect([where, tail.status, tail.body.byteLength, tail.headers["content-range"]]).toEqual([
        where,
        206,
        1_048_576,
        `bytes ${LARGE_SIZE - 1_048_576}-${LARGE_SIZE - 1}/${LARGE_SIZE}`,
      ]);
    }
  }, 120_000);

  it("releases the read before the file is sent: another request reads while a download is held unread", async () => {
    for (const [where, origin] of origins) {
      const download = await heldDownload(origin, "/file/large");
      expect([where, download.status]).toEqual([where, 200]);
      // The download holds its connection, not a read: a request that reads the database is answered meanwhile.
      const rows = await exchange(origin, "GET", "/rows", { ms: 10_000 });
      expect([where, rows.status, json(rows)]).toEqual([where, 200, { rows: 3 }]);
      expect(await download.resume(), where).toEqual({ length: LARGE_SIZE, digest: largeDigest });
    }
  }, 120_000);

  it.runIf(pglite)("negative control (PGlite): the same oracle fails while a handler holds its read", async () => {
    hold.gate = gate();
    const [, origin] = origins[0] as [string, string];
    const held = exchange(origin, "GET", "/hold");
    await hold.gate.reached;
    // PGlite has one connection: the held read keeps it, so the reading request gets no answer meanwhile.
    const rows = await exchange(origin, "GET", "/rows", { ms: 2_000 }).catch((error: unknown) => error);
    expect(rows).toBeInstanceOf(Error);
    expect((rows as Error).message).toBe("no answer to GET /rows within 2000 ms");
    hold.gate.open();
    expect((await held).status).toBe(200);
    // Once the read is released, the module API answers again.
    await sleep(50);
    expect((await exchange(origin, "GET", "/rows")).status).toBe(200);
  }, 60_000);
});
