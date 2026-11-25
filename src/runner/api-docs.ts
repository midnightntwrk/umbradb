/**
 * The module API's documentation, as the `apiDocs` setting chooses: nothing, the OpenAPI document at `/openapi.json`
 * (`./openapi.ts`), or that and Swagger UI at `/docs`. Swagger UI is vendored in `vendor/swagger-ui` and read on first
 * request; a build without it (the browser's) answers its paths 404.
 */

import { readFileSync } from "node:fs";
import { encodeAsciiJson } from "./api-json.js";
import { openApiDocument } from "./openapi.js";
import { JSON_HEADERS, type RouteEntry } from "./route-http.js";

/** The `apiDocs` setting. */
export type ApiDocs = "off" | "openapi" | "ui";

export const OPENAPI_PATH = "/openapi.json";
export const DOCS_PATH = "/docs";

/** An answer of the documentation's, as the module API sends it. */
export interface DocsAnswer {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string | Uint8Array;
}

// Relative URLs, so a host that mounts the module API under a prefix still serves a working page.
const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>UmbraDB module API</title>
<link rel="stylesheet" href="docs/swagger-ui.css">
</head>
<body>
<div id="swagger-ui"></div>
<script src="docs/swagger-ui-bundle.js"></script>
<script src="docs/init.js"></script>
</body>
</html>
`;

const INIT = `window.ui = SwaggerUIBundle({ url: new URL("openapi.json", document.baseURI).href, dom_id: "#swagger-ui", deepLinking: true });\n`;

// Swagger UI sets inline styles and loads data: images; it needs no eval.
const PAGE_CSP =
  "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; " +
  "connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

const UI_HEADERS = { "cache-control": "no-cache", "x-content-type-options": "nosniff", "referrer-policy": "no-referrer" };

/** The vendored files `/docs` serves, by path. */
const VENDORED: Readonly<Record<string, { readonly file: string; readonly type: string }>> = {
  [`${DOCS_PATH}/swagger-ui-bundle.js`]: { file: "swagger-ui-bundle.js", type: "text/javascript; charset=utf-8" },
  [`${DOCS_PATH}/swagger-ui.css`]: { file: "swagger-ui.css", type: "text/css; charset=utf-8" },
};

/** The paths `docs` serves, which no module may register. */
export function docsPaths(docs: ApiDocs): readonly string[] {
  if (docs === "off") return [];
  if (docs === "openapi") return [OPENAPI_PATH];
  return [OPENAPI_PATH, DOCS_PATH, `${DOCS_PATH}/init.js`, ...Object.keys(VENDORED)];
}

/** The documentation's answers to `GET`s (see the module comment). */
export class DocsAnswers {
  readonly #paths: ReadonlySet<string>;
  readonly #catalog: readonly RouteEntry[];
  readonly #cache = new Map<string, DocsAnswer | null>();

  constructor(docs: ApiDocs, catalog: readonly RouteEntry[]) {
    this.#paths = new Set(docsPaths(docs));
    this.#catalog = catalog;
  }

  /** Whether `path` (decoded) is one of the documentation's. */
  serves(path: string): boolean {
    return this.#paths.has(path);
  }

  /** The answer to `GET path`, for a path it {@link serves}; null where the build has no Swagger UI. */
  answer(path: string): DocsAnswer | null {
    let answered = this.#cache.get(path);
    if (answered === undefined) {
      answered = this.#build(path);
      this.#cache.set(path, answered);
    }
    return answered;
  }

  #build(path: string): DocsAnswer | null {
    if (path === OPENAPI_PATH) return { status: 200, headers: JSON_HEADERS, body: encodeAsciiJson(openApiDocument(this.#catalog)) };
    if (path === DOCS_PATH) {
      return { status: 200, headers: { ...UI_HEADERS, "content-type": "text/html; charset=utf-8", "content-security-policy": PAGE_CSP }, body: PAGE };
    }
    if (path === `${DOCS_PATH}/init.js`) return { status: 200, headers: { ...UI_HEADERS, "content-type": "text/javascript; charset=utf-8" }, body: INIT };
    const vendored = VENDORED[path];
    if (vendored === undefined) return null;
    try {
      const body = readFileSync(new URL(`../../vendor/swagger-ui/${vendored.file}`, import.meta.url));
      return { status: 200, headers: { ...UI_HEADERS, "content-type": vendored.type }, body: new Uint8Array(body) };
    } catch {
      return null;
    }
  }
}
