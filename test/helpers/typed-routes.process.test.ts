import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { inMemoryBlock, InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { startUmbraDB, type UmbraDBHandle } from "../../src/library/start-umbradb.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { cursorReaches, libraryData } from "../library/library-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { TEST_API_ID, testApi } from "./test-api.js";

/**
 * Typed routes through the real process and its HTTP listener (`listen.api`), on PostgreSQL 18 and PGlite: the
 * `test-api` module (`./test-api.ts`) on an in-memory chain of 12 blocks. What a client sees:
 * - each route under `/test-api`, its answer read at the committed height with the chain-data headers and the
 *   listener's `X-Umbra-Version`, as ASCII JSON with the fixed headers;
 * - `GET` parameters (path and query) and a `POST` body checked against their schemas: 400 `invalid-request`;
 * - a handler's `RouteError` in the module API's envelope; an answer its schema refuses as the module API's 500
 *   `internal-error`, whose body holds nothing of the answer, and a line of the process log;
 * - paging with `pageCursor`, a forged cursor refused;
 * - the module API's own answers for what no typed route reaches (404 `not-found`, 405 `method-not-allowed`).
 */

const HEAD = 12;

interface Got {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly text: string;
  readonly json: any;
}

async function ask(origin: string, method: "GET" | "POST" | "DELETE", path: string, body?: unknown): Promise<Got> {
  const response = await fetch(`${origin}${path}`, {
    method,
    ...(body === undefined ? {} : { headers: { "content-type": "application/json" }, body: JSON.stringify(body) }),
  });
  const text = await response.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    json = undefined;
  }
  return { status: response.status, headers: Object.fromEntries(response.headers), text, json };
}

const hashAt = (height: number) => `0x${Buffer.from(inMemoryBlock(BigInt(height)).hash).toString("hex")}`;

describe.each(PROCESS_BACKENDS)("typed routes through the process on $name", (backend: ProcessBackend) => {
  let handle: UmbraDBHandle;
  let origin: string;
  let lines: string[];

  beforeAll(async () => {
    await backend.start();
    const db = await backend.database();
    const module = testApi();
    lines = [];
    const data = { entries: [...libraryData(db.setting).entries, { id: TEST_API_ID, start: 1, version: module.version, config: {} }] };
    handle = startUmbraDB({
      config: { data },
      modules: [module as ModuleDeclaration],
      source: new InMemoryBlockSource({ head: BigInt(HEAD) }),
      network: { api: { port: 0 } },
      log: (line) => void lines.push(line),
    });
    await handle.started;
    await cursorReaches(handle, BigInt(HEAD));
    const api = handle.status().listening.api!;
    origin = `http://${api.host.includes(":") ? `[${api.host}]` : api.host}:${api.port}`;
  }, 240_000);

  afterAll(async () => {
    await handle?.stop();
    await backend.stop();
  }, 60_000);

  it("answers a GET with path parameters under the namespace, at one height, with the chain-data headers", async () => {
    const got = await ask(origin, "GET", "/test-api/v1/blocks/5");
    expect([got.status, got.json]).toEqual([200, { height: "5", hash: hashAt(5) }]);
    expect(got.headers).toMatchObject({
      "content-type": "application/json; charset=utf-8",
      "x-content-type-options": "nosniff",
      "x-umbra-height": String(HEAD),
      "x-umbra-hash": hashAt(HEAD),
    });
    expect(got.headers["x-umbra-version"]).toBeDefined();
    const above = await ask(origin, "GET", `/test-api/v1/blocks/${HEAD + 1}`);
    expect([above.status, above.json]).toEqual([404, { error: { code: "no-block", message: "no committed block at that height" } }]);
  });

  it("refuses parameters and bodies their schemas refuse with 400 invalid-request, never echoing them", async () => {
    for (const path of ["/test-api/v1/blocks/x", "/test-api/v1/blocks/01", "/test-api/v1/blocks?limit=0", "/test-api/v1/blocks?unknown=secret-param"]) {
      const got = await ask(origin, "GET", path);
      expect([path, got.status, got.json?.error?.code]).toEqual([path, 400, "invalid-request"]);
      expect(got.text).not.toContain("secret-param");
    }
    for (const body of [{}, { text: 1 }, { text: "a", other: "secret-body" }, { text: "x".repeat(65) }]) {
      const got = await ask(origin, "POST", "/test-api/v1/echo", body);
      expect([got.status, got.json?.error?.code]).toEqual([400, "invalid-request"]);
      expect(got.text).not.toContain("secret-body");
    }
  });

  it("answers a POST's body, escaping non-ASCII text, and a handler's RouteError in the envelope", async () => {
    const echo = await ask(origin, "POST", "/test-api/v1/echo", { text: "héllo <b>" });
    expect([echo.status, echo.json]).toEqual([200, { text: "héllo <b>" }]);
    expect(echo.text).toBe('{"text":"h\\u00e9llo \\u003cb\\u003e"}');
    const refused = await ask(origin, "POST", "/test-api/v1/echo", { text: "refuse" });
    expect([refused.status, refused.json]).toEqual([409, { error: { code: "refused", message: "this text is refused" } }]);
  });

  it("never sends an answer its schema refuses: the client gets the module API's 500, the process log the error", async () => {
    const failed = () => lines.filter((line) => line.includes("of test-api failed:"));
    const before = failed().length;
    const got = await ask(origin, "POST", "/test-api/v1/echo", { text: "wrong-answer" });
    expect([got.status, got.json?.error?.code]).toEqual([500, "internal-error"]);
    expect(got.text).not.toContain("42");
    expect(failed().length).toBe(before + 1);
    expect(failed().at(-1)).toContain("POST /test-api/v1/echo built an answer its schema refuses: answer/text");
  });

  it("pages the blocks with page cursors, and refuses a forged cursor", async () => {
    const seen: string[] = [];
    let path = "/test-api/v1/blocks?limit=5";
    for (let pages = 0; pages < 10; pages++) {
      const got = await ask(origin, "GET", path);
      expect(got.status).toBe(200);
      seen.push(...got.json.items.map((b: { height: string }) => b.height));
      if (got.json.nextCursor === null) break;
      path = `/test-api/v1/blocks?limit=5&cursor=${got.json.nextCursor}`;
    }
    expect(seen).toEqual(Array.from({ length: HEAD }, (_, i) => String(HEAD - i)));
    const forged = await ask(origin, "GET", `/test-api/v1/blocks?cursor=${Buffer.from('{"below":"x"}').toString("base64url")}`);
    expect([forged.status, forged.json?.error]).toEqual([400, { code: "invalid-request", message: "cursor: not a cursor this route issued" }]);
  });


  it("leaves what no typed route reaches to the module API: 404 not-found, 405 method-not-allowed", async () => {
    expect((await ask(origin, "GET", "/test-api/v1/nothing")).json?.error?.code).toBe("not-found");
    const wrong = await ask(origin, "DELETE", "/test-api/v1/echo");
    expect([wrong.status, wrong.json?.error?.code]).toEqual([405, "method-not-allowed"]);
  });
});
