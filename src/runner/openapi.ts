/**
 * The module API's routes as an OpenAPI 3.1 document, served at `GET /openapi.json` (`./api-docs.ts`). It is built
 * from the route catalog alone, so a module documents its API by declaring its routes. Raw `api.http` handlers have no
 * schema and are left out.
 */

import { UMBRADB_VERSION } from "../config/build.js";
import { VERSION_HEADER } from "./api-answers.js";
import { CHAIN_DATA_HEADERS, CHAIN_DATA_VIEW } from "./envelope.js";
import type { JsonSchema, RouteEntry } from "./route-http.js";

export type Json = Record<string, unknown>;

const ERROR_SCHEMA: Json = {
  type: "object",
  required: ["error"],
  properties: {
    error: {
      type: "object",
      required: ["code", "message"],
      properties: { code: { type: "string" }, message: { type: "string" } },
    },
  },
};

const HEADERS: Json = {
  [VERSION_HEADER]: { description: "The UmbraDB build that answered.", schema: { type: "string" } },
  [CHAIN_DATA_HEADERS.view]: { description: "The view the answer was read from.", schema: { type: "string", const: CHAIN_DATA_VIEW } },
  [CHAIN_DATA_HEADERS.height]: { description: "The committed height the answer was read at.", schema: { type: "string", pattern: "^[0-9]+$" } },
  [CHAIN_DATA_HEADERS.hash]: { description: "That block's hash.", schema: { type: "string", pattern: "^0x[0-9a-f]*$" } },
};

const headerRefs = (...names: string[]): Json => Object.fromEntries(names.map((name) => [name, { $ref: `#/components/headers/${name}` }]));
const CHAIN_HEADERS = headerRefs(VERSION_HEADER, CHAIN_DATA_HEADERS.view, CHAIN_DATA_HEADERS.height, CHAIN_DATA_HEADERS.hash);
const ERROR_RESPONSE = { $ref: "#/components/responses/error" };

const componentName = (name: string): string => name.replace(/[^A-Za-z0-9.\-_]/g, "_");

/**
 * A union of literals (`anyOf` of `{ type, const }`) as the `enum` it means: UIs show the values instead of a union of
 * bare types.
 */
function collapseConsts(schema: Json): Json {
  const { anyOf, ...rest } = schema;
  if (!Array.isArray(anyOf) || anyOf.length < 2) return schema;
  const members = anyOf as Json[];
  const pure = members.every((member) => typeof member === "object" && member !== null && "const" in member && Object.keys(member).every((key) => key === "const" || key === "type"));
  if (!pure) return schema;
  const types = new Set(members.map((member) => member.type));
  return { ...(types.size === 1 && members[0]?.type !== undefined ? { type: members[0].type } : {}), enum: members.map((member) => member.const), ...rest };
}

/**
 * `schema` ready to embed: zod's `$defs` and root `#` refs only resolve inside the schema itself, so they move to
 * `components.schemas` under `prefix`.
 */
export function embed(schema: JsonSchema, prefix: string, components: Json): Json {
  const { $schema: _, $defs, ...root } = schema as Json;
  const rootName = componentName(prefix);
  let selfReferenced = false;
  const rewrite = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(rewrite);
    if (typeof value !== "object" || value === null) return value;
    const out: Json = {};
    for (const [key, item] of Object.entries(value)) {
      if (key === "$ref" && typeof item === "string" && item === "#") {
        selfReferenced = true;
        out[key] = `#/components/schemas/${rootName}`;
      } else if (key === "$ref" && typeof item === "string" && item.startsWith("#/$defs/")) {
        out[key] = `#/components/schemas/${componentName(`${prefix}.${item.slice("#/$defs/".length)}`)}`;
      } else {
        out[key] = rewrite(item);
      }
    }
    return collapseConsts(out);
  };
  for (const [name, def] of Object.entries(($defs ?? {}) as Json)) components[componentName(`${prefix}.${name}`)] = rewrite(def);
  const embedded = rewrite(root) as Json;
  if (!selfReferenced) return embedded;
  components[rootName] = embedded;
  return { $ref: `#/components/schemas/${rootName}` };
}

/** `entry` as an OpenAPI operation. */
function operationOf(entry: RouteEntry, schemas: Json): Json {
  const input = embed(entry.input, `${entry.id}.input`, schemas);
  const operation: Json = {
    operationId: entry.id,
    tags: [entry.module],
    ...(entry.description === undefined ? {} : { summary: entry.description }),
  };

  if (entry.http.method === "GET") {
    // bindInput already refused a GET whose input is not an object of scalars.
    const properties = (input.properties ?? {}) as Record<string, Json>;
    const required = new Set(Array.isArray(input.required) ? input.required : []);
    const inPath = new Set([...entry.http.path.matchAll(/:([A-Za-z_][A-Za-z0-9_]*)/g)].map((match) => match[1]));
    operation.parameters = Object.entries(properties).map(([name, schema]) => ({
      name,
      in: inPath.has(name) ? "path" : "query",
      required: inPath.has(name) || required.has(name),
      ...(typeof schema.description === "string" ? { description: schema.description } : {}),
      schema,
    }));
  } else {
    operation.requestBody = { required: true, content: { "application/json": { schema: input } } };
  }

  if (entry.kind === "binary") {
    const content = { [entry.contentType ?? "*/*"]: {} };
    operation.responses = {
      "200": { description: "The whole file.", headers: { ...CHAIN_HEADERS, ETag: { schema: { type: "string" } } }, content },
      "206": {
        description: "The byte range asked for.",
        headers: { ...CHAIN_HEADERS, ETag: { schema: { type: "string" } }, "Content-Range": { schema: { type: "string" } } },
        content,
      },
      default: ERROR_RESPONSE,
    };
  } else {
    const output = embed(entry.output, `${entry.id}.output`, schemas);
    operation.responses = {
      "200": { description: "The answer, read at one committed height.", headers: CHAIN_HEADERS, content: { "application/json": { schema: output } } },
      default: ERROR_RESPONSE,
    };
  }
  return operation;
}

/** The OpenAPI 3.1 document of `routes` (see the module comment). */
export function openApiDocument(routes: readonly RouteEntry[], description?: string): Json {
  // Hoisted names are prefixed with a route id, which holds a dot, so they never take "error".
  const schemas: Json = { error: ERROR_SCHEMA };
  const paths: Record<string, Json> = {};
  for (const entry of routes) {
    const path = entry.http.path.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, "{$1}");
    (paths[path] ??= {})[entry.http.method.toLowerCase()] = operationOf(entry, schemas);
  }
  return {
    openapi: "3.1.0",
    info: { title: "UmbraDB module API", version: UMBRADB_VERSION, ...(description === undefined ? {} : { description }) },
    // Relative to the document, so "try it" works behind a proxy that serves the API under a prefix.
    servers: [{ url: "." }],
    tags: [...new Set(routes.map((entry) => entry.module))].map((name) => ({ name })),
    paths,
    components: {
      schemas,
      headers: HEADERS,
      responses: {
        error: {
          description: "A refused request: the code names why. 503 no-committed-height before the first block commits.",
          content: { "application/json": { schema: { $ref: "#/components/schemas/error" } } },
        },
      },
    },
  };
}
