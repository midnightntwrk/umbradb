/**
 * The module API's documentation, as the `apiDocs` setting chooses: nothing; the routes' OpenAPI document at
 * `/openapi.json` (`./openapi.ts`) and the topics' AsyncAPI document at `/asyncapi.json` (`./asyncapi.ts`); or those
 * and their UIs, Swagger UI at `/docs` and AsyncAPI's renderer at `/docs/events`. The UIs are vendored in `vendor/`
 * and read on first request; a build without them (the browser's) answers their files 404.
 */

import { readFileSync } from "node:fs";
import { asyncApiDocument, type DeclaredTopic } from "./asyncapi.js";
import { encodeAsciiJson } from "./api-json.js";
import { openApiDocument } from "./openapi.js";
import { JSON_HEADERS, type RouteEntry } from "./route-http.js";

/** The `apiDocs` setting. */
export type ApiDocs = "off" | "spec" | "ui";

export const OPENAPI_PATH = "/openapi.json";
export const ASYNCAPI_PATH = "/asyncapi.json";
export const DOCS_PATH = "/docs";
export const EVENTS_PATH = "/docs/events";

/** An answer of the documentation's, as the module API sends it. */
export interface DocsAnswer {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string | Uint8Array;
}

// Relative URLs throughout, so a host that mounts the module API under a prefix still serves working pages.
const page = (title: string, css: string, scripts: readonly string[], root: string) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="stylesheet" href="${css}">
</head>
<body>
<div id="${root}"></div>
${scripts.map((src) => `<script src="${src}"></script>`).join("\n")}
</body>
</html>
`;

// `/docs` resolves against `/`, `/docs/events` against `/docs/`.
const SWAGGER_PAGE = page("UmbraDB module API", "docs/swagger-ui.css", ["docs/swagger-ui-bundle.js", "docs/init.js"], "swagger-ui");
const EVENTS_PAGE = page("UmbraDB module API: topics", "asyncapi.css", ["asyncapi-standalone.js", "events.js"], "asyncapi");
const SWAGGER_INIT = `window.ui = SwaggerUIBundle({ url: new URL("openapi.json", document.baseURI).href, dom_id: "#swagger-ui", deepLinking: true });\n`;
const EVENTS_INIT =
  `AsyncApiStandalone.render({ schema: { url: new URL("../asyncapi.json", document.baseURI).href }, ` +
  `config: { show: { sidebar: true } } }, document.getElementById("asyncapi"));\n`;

/** A page's CSP: scripts from here only, inline styles (both UIs set them), and `data:` images. */
const csp = (script: string) =>
  `default-src 'none'; script-src ${script}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; ` +
  "connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
const SWAGGER_CSP = csp("'self'");
// AsyncAPI's parser validates the document with Ajv, which compiles its validators with `new Function`.
const EVENTS_CSP = csp("'self' 'unsafe-eval'");

const UI_HEADERS = { "cache-control": "no-cache", "x-content-type-options": "nosniff", "referrer-policy": "no-referrer" };
const JS = "text/javascript; charset=utf-8";
const HTML = "text/html; charset=utf-8";

/** The vendored files the UIs load, by path: the vendor directory, the file and its type. */
const VENDORED: Readonly<Record<string, readonly [string, string, string]>> = {
  [`${DOCS_PATH}/swagger-ui-bundle.js`]: ["swagger-ui", "swagger-ui-bundle.js", JS],
  [`${DOCS_PATH}/swagger-ui.css`]: ["swagger-ui", "swagger-ui.css", "text/css; charset=utf-8"],
  [`${DOCS_PATH}/asyncapi-standalone.js`]: ["asyncapi-react", "asyncapi-standalone.js", JS],
  [`${DOCS_PATH}/asyncapi.css`]: ["asyncapi-react", "asyncapi.css", "text/css; charset=utf-8"],
};

/** The pages and scripts of the UIs, by path. */
const UI: Readonly<Record<string, DocsAnswer>> = {
  [DOCS_PATH]: { status: 200, headers: { ...UI_HEADERS, "content-type": HTML, "content-security-policy": SWAGGER_CSP }, body: SWAGGER_PAGE },
  [`${DOCS_PATH}/init.js`]: { status: 200, headers: { ...UI_HEADERS, "content-type": JS }, body: SWAGGER_INIT },
  [EVENTS_PATH]: { status: 200, headers: { ...UI_HEADERS, "content-type": HTML, "content-security-policy": EVENTS_CSP }, body: EVENTS_PAGE },
  [`${DOCS_PATH}/events.js`]: { status: 200, headers: { ...UI_HEADERS, "content-type": JS }, body: EVENTS_INIT },
};

/** The paths `docs` serves, which no module may register. */
export function docsPaths(docs: ApiDocs): readonly string[] {
  if (docs === "off") return [];
  const specs = [OPENAPI_PATH, ASYNCAPI_PATH];
  return docs === "spec" ? specs : [...specs, ...Object.keys(UI), ...Object.keys(VENDORED)];
}

/** The documentation's answers to `GET`s (see the module comment). */
export class DocsAnswers {
  readonly #docs: ApiDocs;
  readonly #paths: ReadonlySet<string>;
  readonly #routes: readonly RouteEntry[];
  readonly #topics: readonly DeclaredTopic[];
  readonly #cache = new Map<string, DocsAnswer | null>();

  constructor(docs: ApiDocs, routes: readonly RouteEntry[], topics: readonly DeclaredTopic[]) {
    this.#docs = docs;
    this.#paths = new Set(docsPaths(docs));
    this.#routes = routes;
    this.#topics = topics;
  }

  /** Whether `path` (decoded) is one of the documentation's. */
  serves(path: string): boolean {
    return this.#paths.has(path);
  }

  /** The answer to `GET path`, for a path it {@link serves}; null where the build has no such UI file. */
  answer(path: string): DocsAnswer | null {
    let answered = this.#cache.get(path);
    if (answered === undefined) {
      answered = this.#build(path);
      this.#cache.set(path, answered);
    }
    return answered;
  }

  #build(path: string): DocsAnswer | null {
    // Each page links the other; the documents alone have no page to link.
    const ui = this.#docs === "ui";
    if (path === OPENAPI_PATH) {
      const document = openApiDocument(this.#routes, ui ? "The topics a WebSocket subscribes to are described [here](docs/events)." : undefined);
      return { status: 200, headers: JSON_HEADERS, body: encodeAsciiJson(document) };
    }
    if (path === ASYNCAPI_PATH) {
      const document = asyncApiDocument(this.#topics, ui ? "The HTTP routes are described [here](../docs)." : undefined);
      return { status: 200, headers: JSON_HEADERS, body: encodeAsciiJson(document) };
    }
    const fixed = UI[path];
    if (fixed !== undefined) return fixed;
    const vendored = VENDORED[path];
    if (vendored === undefined) return null;
    const [dir, file, type] = vendored;
    try {
      const body = readFileSync(new URL(`../../vendor/${dir}/${file}`, import.meta.url));
      return { status: 200, headers: { ...UI_HEADERS, "content-type": type }, body: new Uint8Array(body) };
    } catch {
      return null;
    }
  }
}
