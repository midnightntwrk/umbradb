/**
 * `npm run web`'s server: serves the browser build (`dist-browser/`, written by `npm run build:browser`)
 * on 127.0.0.1 with the headers the page needs. The page must be cross-origin isolated — `Cross-Origin-Opener-Policy:
 * same-origin` and `Cross-Origin-Embedder-Policy: require-corp` — for the ledger worker's `SharedArrayBuffer`; without
 * them its log shows `SharedArrayBuffer is not defined`. Every answer also carries `Cross-Origin-Resource-Policy:
 * same-origin` and `Cache-Control: no-store` (a rebuilt page is never served from the cache). A path outside the
 * directory, or no file, is 404. No dependency: Node.js runs this file itself, through its type stripping.
 *
 *   node browser/serve.ts [--dir <dir>] [--port <port>]     # dist-browser/ and 8090 unless given (or WEB_PORT)
 *
 * It prints the address to open, with the public preview node as the page's `node` parameter; Ctrl-C (SIGINT) or
 * SIGTERM stops it.
 */

import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { extname, join, normalize, resolve, sep } from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";

/** The headers of every answer (see the module comment). */
export const PAGE_HEADERS: Readonly<Record<string, string>> = Object.freeze({
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cache-Control": "no-store",
});

/** The content type of each file kind the build writes; any other is served as bytes. */
export const CONTENT_TYPES: Readonly<Record<string, string>> = Object.freeze({
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
  ".data": "application/octet-stream",
});

/** The node the printed address names: the public preview node. */
export const PREVIEW_NODE = "wss://rpc.preview.midnight.network";

/** A request handler serving the files under `directory` (see the module comment). */
export function pageHandler(directory: string): (request: IncomingMessage, response: ServerResponse) => void {
  const root = normalize(resolve(directory));
  return (request, response) => {
    const answer = (status: number, body: Uint8Array | string, type: string): void => {
      response.writeHead(status, { "Content-Type": type, ...PAGE_HEADERS });
      response.end(body);
    };
    let path: string;
    try {
      path = decodeURIComponent(new URL(request.url ?? "/", "http://page").pathname);
    } catch {
      answer(404, "not found", "text/plain");
      return;
    }
    const file = normalize(join(root, path === "/" ? "index.html" : path));
    if (!file.startsWith(root + sep)) {
      answer(404, "not found", "text/plain");
      return;
    }
    readFile(file).then(
      (body) => answer(200, body, CONTENT_TYPES[extname(file)] ?? "application/octet-stream"),
      () => answer(404, "not found", "text/plain"),
    );
  };
}

/** `node browser/serve.ts [--dir <dir>] [--port <port>]` (see the module comment). */
function main(args: string[]): void {
  const { values } = parseArgs({ args, options: { dir: { type: "string" }, port: { type: "string" } } });
  const directory = values.dir ?? fileURLToPath(new URL("../dist-browser", import.meta.url));
  const port = Number(values.port ?? process.env.WEB_PORT ?? 8090);
  const server = createServer(pageHandler(directory));
  server.listen(port, "127.0.0.1", () => {
    const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    process.stdout.write(`serving ${resolve(directory)} on ${origin} (cross-origin isolated)\n`);
    process.stdout.write(`open ${origin}/?node=${PREVIEW_NODE} in Chrome; Ctrl-C stops the server\n`);
  });
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => {
      server.close(() => process.exit(0));
      server.closeAllConnections();
    });
  }
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
