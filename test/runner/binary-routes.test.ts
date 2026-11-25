import { describe, expect, it } from "vitest";
import { z } from "zod";
import type { ReadHandle } from "../../src/db/api.js";
import type { ApiRegistry } from "../../src/modules/declaration.js";
import { type BinaryFile, type BinaryRoute, binaryData, defineBinaryRoute, RouteError } from "../../src/modules/route.js";
import { type ApiRequest, type ApiResponse, ApiRoutes, ModuleApi } from "../../src/runner/module-api.js";

/** Binary routes (`src/runner/route-binary.ts`) served by the module API without a listener, over a stand-in database. */

const HASH = new Uint8Array(32).fill(0xab);
const BYTES = Uint8Array.from({ length: 100 }, (_, index) => index);

function apiOf(register: (api: ApiRegistry) => void, height: bigint | null = 7n) {
  const routes = new ApiRoutes();
  const registration = routes.open("m");
  register(registration.registry);
  registration.close();
  routes.check();
  const read: ReadHandle = Object.freeze({ height, query: async () => [{ hash: HASH }] });
  const errors: unknown[] = [];
  const api = new ModuleApi(routes, { db: { read: (body) => body(read) }, timeoutMs: 1_000, onError: (error) => void errors.push(error) });
  return { routes, api, errors };
}

/** A route `GET /m/blob` answering `file`, recording each `read`. */
function blob(file: Partial<BinaryFile> = {}, maxAnswerBytes?: number) {
  const reads: [number, number][] = [];
  const whole = binaryData(BYTES, "application/octet-stream", "v1");
  const route = defineBinaryRoute({
    name: "blob",
    input: z.object({}),
    ...(maxAnswerBytes === undefined ? {} : { maxAnswerBytes }),
    handle: async (): Promise<BinaryFile> => ({
      ...whole,
      read: async (start: number, end: number) => {
        reads.push([start, end]);
        return whole.read(start, end);
      },
      ...file,
    }) as BinaryFile,
  });
  return { reads, ...apiOf((registry) => registry.binaryRoute(route)) };
}

const get = (path: string, query: Record<string, string> = {}, headers: ApiRequest["headers"] = {}): ApiRequest => ({
  method: "GET",
  path,
  query: Object.entries(query),
  headers,
});
const bytes = (response: ApiResponse) => [...(response.body as Uint8Array)];
const errorOf = (response: ApiResponse) => {
  const { error } = JSON.parse(response.body as string);
  return [response.status, error.code];
};

describe("api.binaryRoute: registration", () => {
  it("serves a binary route at GET /<module-id>/<name> and keeps it in the catalog with its range parameter", () => {
    const { routes } = blob();
    expect(routes.http.map(({ method, path }) => [method, path])).toEqual([["GET", "/m/blob"]]);
    expect(routes.routes[0]).toMatchObject({
      id: "m.blob",
      kind: "binary",
      http: { method: "GET", path: "/m/blob" },
      input: { type: "object", properties: { range: { type: "string" }, ifMatch: { type: "string" } } },
      output: { type: "string", contentEncoding: "binary" },
    });
  });

  it("refuses a POST, an input that declares range or ifMatch and a maxAnswerBytes that is no positive integer", () => {
    const refused = (route: BinaryRoute) => () => apiOf((registry) => registry.binaryRoute(route));
    const ok = { name: "blob", input: z.object({}), handle: async () => binaryData(BYTES, "a/b") };
    expect(refused({ ...ok, http: { method: "POST", path: "/blob" } } as never)).toThrow(/m registered the route blob, whose http method is POST/);
    expect(refused({ ...ok, input: z.object({ range: z.string() }) })).toThrow(/m registered the route blob, whose input declares range/);
    expect(refused({ ...ok, input: z.object({ ifMatch: z.string() }) })).toThrow(/m registered the route blob, whose input declares ifMatch/);
    for (const maxAnswerBytes of [0, 1.5, -1, Number.POSITIVE_INFINITY]) {
      expect(refused({ ...ok, maxAnswerBytes })).toThrow(/m registered the route blob, whose maxAnswerBytes is not a positive safe integer/);
    }
  });
});

describe("api.binaryRoute: answers", () => {
  it("answers the whole file with its type, ETag, Accept-Ranges and the chain-data headers", async () => {
    const { api, reads } = blob();
    const response = await api.answer(get("/m/blob"));
    expect(response.status).toBe(200);
    expect(bytes(response)).toEqual([...BYTES]);
    expect(response.headers).toMatchObject({
      "content-type": "application/octet-stream",
      etag: '"v1"',
      "accept-ranges": "bytes",
      "cache-control": "no-store",
      "X-Umbra-Height": "7",
    });
    expect(reads).toEqual([[0, 100]]);
  });

  it("answers one range, from the header or the parameter, reading only its bytes", async () => {
    const { api, reads } = blob();
    const header = await api.answer(get("/m/blob", {}, { range: "bytes=10-19" }));
    expect([header.status, header.headers["content-range"], bytes(header)]).toEqual([206, "bytes 10-19/100", [...BYTES.subarray(10, 20)]]);
    const suffix = await api.answer(get("/m/blob", { range: "-5" }));
    expect([suffix.status, suffix.headers["content-range"], bytes(suffix)]).toEqual([206, "bytes 95-99/100", [95, 96, 97, 98, 99]]);
    expect(reads).toEqual([
      [10, 20],
      [95, 100],
    ]);
  });

  it("answers several ranges whole, and a range past the end 416 with the size", async () => {
    const { api } = blob();
    expect((await api.answer(get("/m/blob", { range: "0-1,5-6" }))).status).toBe(200);
    const past = await api.answer(get("/m/blob", {}, { range: "bytes=100-" }));
    expect([...errorOf(past), past.headers["content-range"]]).toEqual([416, "range-not-satisfiable", "bytes */100"]);
  });

  it("ignores an unreadable Range header, and refuses an unreadable parameter or both at once", async () => {
    const { api } = blob();
    expect((await api.answer(get("/m/blob", {}, { range: "items=0-1" }))).status).toBe(200);
    expect(errorOf(await api.answer(get("/m/blob", { range: "x" })))).toEqual([400, "invalid-request"]);
    expect(errorOf(await api.answer(get("/m/blob", { range: "0-1" }, { range: "bytes=0-1" })))).toEqual([400, "invalid-request"]);
  });

  it("answers only when If-Match names the file's ETag, and 412 with the ETag otherwise, reading nothing", async () => {
    const { api, reads } = blob();
    expect((await api.answer(get("/m/blob", {}, { range: "bytes=0-9", ifMatch: '"v1"' }))).status).toBe(206);
    expect((await api.answer(get("/m/blob", {}, { ifMatch: "*" }))).status).toBe(200);
    for (const ifMatch of ['"v0"', 'W/"v1"', "not a list"]) {
      const failed = await api.answer(get("/m/blob", {}, { range: "bytes=0-9", ifMatch }));
      expect([...errorOf(failed), failed.headers.etag]).toEqual([412, "precondition-failed", '"v1"']);
    }
    expect(reads).toEqual([
      [0, 10],
      [0, 100],
    ]);
  });

  it("reads the ifMatch parameter as the header, a bare tag too, and refuses an unreadable one or both at once", async () => {
    const { api } = blob();
    expect((await api.answer(get("/m/blob", { range: "0-9", ifMatch: "v1" }))).status).toBe(206);
    expect((await api.answer(get("/m/blob", { ifMatch: '"v0", "v1"' }))).status).toBe(200);
    expect(errorOf(await api.answer(get("/m/blob", { ifMatch: "v0" })))).toEqual([412, "precondition-failed"]);
    expect(errorOf(await api.answer(get("/m/blob", { ifMatch: '"v1' })))).toEqual([400, "invalid-request"]);
    expect(errorOf(await api.answer(get("/m/blob", { ifMatch: "v1" }, { ifMatch: '"v1"' })))).toEqual([400, "invalid-request"]);
  });

  it("refuses an answer over maxAnswerBytes, whole or a range, without reading it", async () => {
    const { api, reads } = blob({}, 10);
    expect(errorOf(await api.answer(get("/m/blob")))).toEqual([429, "answer-too-large"]);
    expect(errorOf(await api.answer(get("/m/blob", { range: "0-10" })))).toEqual([429, "answer-too-large"]);
    expect(errorOf(await api.answer(get("/m/blob", { range: "0-1,4-5" })))).toEqual([429, "answer-too-large"]);
    expect((await api.answer(get("/m/blob", { range: "0-9" }))).status).toBe(206);
    expect(reads).toEqual([[0, 10]]);
  });

  it("answers an empty file without reading it", async () => {
    const { api, reads } = blob({ size: 0 });
    const response = await api.answer(get("/m/blob"));
    expect([response.status, bytes(response)]).toEqual([200, []]);
    expect(reads).toEqual([]);
  });

  it("answers a RouteError in the envelope and 503 before block S", async () => {
    const refusing = defineBinaryRoute({
      name: "blob",
      input: z.object({}),
      handle: async () => {
        throw new RouteError("not-found", "no-blob", "no blob");
      },
    });
    expect(errorOf(await apiOf((registry) => registry.binaryRoute(refusing)).api.answer(get("/m/blob")))).toEqual([404, "no-blob"]);
    expect(errorOf(await apiOf((registry) => registry.binaryRoute(refusing), null).api.answer(get("/m/blob")))).toEqual([503, "no-committed-height"]);
  });

  it("answers 500 for a file that is no BinaryFile or a read of the wrong length", async () => {
    for (const file of [{ size: -1 }, { etag: 'a"b' }, { contentType: "" }, { read: async () => new Uint8Array(1) }]) {
      const { api, errors } = blob(file);
      expect(errorOf(await api.answer(get("/m/blob")))).toEqual([500, "internal-error"]);
      expect(errors).toHaveLength(1);
    }
  });
});
