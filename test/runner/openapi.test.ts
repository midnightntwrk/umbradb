import { Ajv2020 } from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import type { ReadHandle } from "../../src/db/api.js";
import type { ApiRegistry } from "../../src/modules/declaration.js";
import { binaryData, defineBinaryRoute, defineRoute } from "../../src/modules/route.js";
import type { ApiDocs } from "../../src/runner/api-docs.js";
import { ApiRoutes, ModuleApi } from "../../src/runner/module-api.js";

/** The documentation (`src/runner/api-docs.ts`, `src/runner/openapi.ts`) as the module API serves it, over a stand-in database. */

const HASH = new Uint8Array(32).fill(0xab);

// biome-ignore lint/suspicious/noExplicitAny: a recursive schema
const Tree: z.ZodType<{ name: string; children: unknown[] }> = z.object({ name: z.string(), get children(): any { return z.array(Tree); } });
const TREE = { name: "a", children: [{ name: "b", children: [] }] };

function apiOf(register: (api: ApiRegistry) => void, { docs = "openapi", read }: { docs?: ApiDocs; read?: () => never } = {}) {
  const routes = new ApiRoutes({ docs });
  const registration = routes.open("m");
  register(registration.registry);
  registration.close();
  routes.check();
  const handle: ReadHandle = Object.freeze({ height: 7n, query: async () => [{ hash: HASH }] });
  const api = new ModuleApi(routes, { db: { read: read ?? ((body) => body(handle)) }, timeoutMs: 1_000 });
  return api;
}

// biome-ignore lint/suspicious/noExplicitAny: the document is read as plain JSON
async function documentOf(api: ModuleApi): Promise<any> {
  const response = await api.answer({ method: "GET", path: "/openapi.json" });
  expect(response.status).toBe(200);
  return JSON.parse(response.body as string);
}

const routesOf = (registry: ApiRegistry) => {
  registry.route(
    defineRoute({
      name: "tree",
      description: "A tree at a depth.",
      input: z.object({ depth: z.int(), label: z.string().describe("a label").optional() }),
      output: Tree,
      http: { method: "GET", path: "/v1/tree/:depth" },
      handle: async () => TREE,
    }),
  );
  registry.route(defineRoute({ name: "echo", input: z.object({ text: z.string() }), output: z.object({ text: z.string() }), handle: async (input) => input }));
  registry.binaryRoute(defineBinaryRoute({ name: "blob", input: z.object({}), handle: async () => binaryData(new Uint8Array(4), "application/octet-stream") }));
  registry.http("GET", "/m/raw", async () => ({ status: 200, body: null }));
};

describe("GET /openapi.json", () => {
  it("describes each route at its path and method, and leaves raw handlers out", async () => {
    const doc = await documentOf(apiOf(routesOf));
    expect(Object.keys(doc.paths).sort()).toEqual(["/m/blob", "/m/echo", "/m/v1/tree/{depth}"]);
    const tree = doc.paths["/m/v1/tree/{depth}"].get;
    expect([tree.operationId, tree.tags, tree.summary]).toEqual(["m.tree", ["m"], "A tree at a depth."]);
    expect(doc.paths["/m/echo"].post.operationId).toBe("m.echo");
  });

  it("gives a GET's input as path and query parameters, and a POST's as its body", async () => {
    const doc = await documentOf(apiOf(routesOf));
    const parameters = doc.paths["/m/v1/tree/{depth}"].get.parameters.map((p: { name: string; in: string; required: boolean; description?: string }) => [p.name, p.in, p.required, p.description]);
    expect(parameters).toEqual([
      ["depth", "path", true, undefined],
      ["label", "query", false, "a label"],
    ]);
    expect(doc.paths["/m/echo"].post.requestBody.content["application/json"].schema.properties.text).toEqual({ type: "string" });
  });

  it("documents an output schema the route's real answer validates against, recursive refs resolved", async () => {
    const api = apiOf(routesOf);
    const doc = await documentOf(api);
    const answered = await api.answer({ method: "GET", path: "/m/v1/tree/3", query: [] });
    const schema = doc.paths["/m/v1/tree/{depth}"].get.responses["200"].content["application/json"].schema;
    const ajv = new Ajv2020({ strict: false });
    const validate = ajv.compile({ ...schema, components: doc.components });
    expect(validate(JSON.parse(answered.body as string))).toBe(true);
    expect(validate({ name: "a", children: [{ name: 1, children: [] }] })).toBe(false);
  });

  it("gives a union of literals as the enum it means, and leaves other unions alone", async () => {
    const doc = await documentOf(
      apiOf((registry) =>
        registry.route(
          defineRoute({
            name: "pick",
            input: z.object({ kind: z.union([z.literal(1), z.literal(2)]).describe("which"), mixed: z.union([z.literal("a"), z.literal(2)]), maybe: z.string().nullable() }),
            output: z.null(),
            http: { method: "GET", path: "/pick" },
            handle: async () => null,
          }),
        ),
      ),
    );
    const schemas = Object.fromEntries(doc.paths["/m/pick"].get.parameters.map((p: { name: string; schema: unknown }) => [p.name, p.schema]));
    expect(schemas.kind).toEqual({ type: "number", enum: [1, 2], description: "which" });
    expect(schemas.mixed).toEqual({ enum: ["a", 2] });
    expect(schemas.maybe.anyOf).toHaveLength(2);
  });

  it("gives a binary route its range and ifMatch parameters, naming their headers, and a partial answer of any type", async () => {
    const blob = (await documentOf(apiOf(routesOf))).paths["/m/blob"].get;
    const parameters = blob.parameters.map((p: { name: string; in: string; description: string }) => [p.name, p.in, p.description.includes("header instead")]);
    expect(parameters).toEqual([
      ["range", "query", true],
      ["ifMatch", "query", true],
    ]);
    expect(Object.keys(blob.responses)).toEqual(expect.arrayContaining(["200", "206"]));
    expect(Object.keys(blob.responses["200"].content)).toEqual(["*/*"]);
  });

  it("gives a binary route's declared contentType as its answers' media type", async () => {
    const api = apiOf((registry) =>
      registry.binaryRoute(defineBinaryRoute({ name: "png", input: z.object({}), contentType: "image/png", handle: async () => binaryData(new Uint8Array(1), "image/png") })),
    );
    const png = (await documentOf(api)).paths["/m/png"].get;
    expect([Object.keys(png.responses["200"].content), Object.keys(png.responses["206"].content)]).toEqual([["image/png"], ["image/png"]]);
  });

  it("answers without reading the database", async () => {
    const doc = await documentOf(apiOf(routesOf, { read: () => { throw new Error("read"); } }));
    expect(Object.keys(doc.paths)).toHaveLength(3);
  });

  it("answers another method 405 with Allow: GET", async () => {
    const response = await apiOf(routesOf).answer({ method: "POST", path: "/openapi.json", body: "{}" });
    expect([response.status, response.headers.Allow]).toEqual([405, "GET"]);
  });

  it("refuses a module that registers its path", () => {
    expect(() => apiOf((registry) => registry.http("POST", "/openapi.json", async () => ({ status: 200, body: null })))).toThrow(
      "m registered POST /openapi.json, where the core serves the API's documentation (apiDocs)",
    );
  });
});

describe("apiDocs", () => {
  const raw = (path: string) => (registry: ApiRegistry) => registry.http("GET", path, async () => ({ status: 200, body: { mine: true } }));

  it("off serves nothing and leaves the paths to modules", async () => {
    const api = apiOf(raw("/openapi.json"), { docs: "off" });
    const response = await api.answer({ method: "GET", path: "/openapi.json" });
    expect(JSON.parse(response.body as string)).toEqual({ mine: true });
  });

  it("openapi serves the document but not the UI", async () => {
    const api = apiOf(routesOf, { docs: "openapi" });
    expect((await api.answer({ method: "GET", path: "/docs" })).status).toBe(404);
    expect(() => apiOf(raw("/docs"), { docs: "openapi" })).not.toThrow();
  });

  it("ui serves a page under a CSP without inline script, its initializer and the vendored Swagger UI", async () => {
    const api = apiOf(routesOf, { docs: "ui" });
    const page = await api.answer({ method: "GET", path: "/docs" });
    expect(page.headers["content-type"]).toMatch(/^text\/html/);
    expect(page.headers["content-security-policy"]).toContain("script-src 'self';");
    expect(page.body as string).not.toMatch(/<script>/);
    for (const asset of ["/docs/init.js", "/docs/swagger-ui-bundle.js", "/docs/swagger-ui.css"]) {
      const response = await api.answer({ method: "GET", path: asset });
      expect([asset, response.status]).toEqual([asset, 200]);
    }
    const bundle = await api.answer({ method: "GET", path: "/docs/swagger-ui-bundle.js" });
    expect(Buffer.from(bundle.body as Uint8Array).toString("utf8")).toContain("SwaggerUIBundle");
  });

  it("ui reserves the UI's paths", () => {
    expect(() => apiOf(raw("/docs"), { docs: "ui" })).toThrow("where the core serves the API's documentation");
  });
});
