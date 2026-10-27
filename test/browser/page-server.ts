import { readFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { extname, join, normalize, sep } from "node:path";
import { listenOnRandomPort } from "../../tools/tape/port.js";

/**
 * The static server of the browser build's tests (task 16.1): serves a build's directory on `127.0.0.1` at a random
 * free port of at least 10000, every answer with the headers that make the page cross-origin isolated
 * (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`), which the node-store
 * bridge's `SharedArrayBuffer` needs (LG-10), and `Cross-Origin-Resource-Policy: same-origin`. A path outside the
 * directory, or no file, is 404. Every request is recorded ({@link PageServer.requests}).
 */

const TYPES: Readonly<Record<string, string>> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
  ".data": "application/octet-stream",
};

/** The headers of every answer (see the module comment). */
export const ISOLATION_HEADERS: Readonly<Record<string, string>> = Object.freeze({
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cache-Control": "no-store",
});

export interface PageServer {
  /** `http://127.0.0.1:<port>`. */
  readonly origin: string;
  /** Every path requested, in order. */
  readonly requests: string[];
  close(): Promise<void>;
}

/** Serves `directory` (see the module comment). */
export async function servePage(directory: string): Promise<PageServer> {
  const root = normalize(directory);
  const requests: string[] = [];
  const server: Server = createServer((request, response) => {
    const path = decodeURIComponent(new URL(request.url ?? "/", "http://page").pathname);
    requests.push(path);
    const file = normalize(join(root, path === "/" ? "index.html" : path));
    const answer = (status: number, body: Uint8Array | string, type: string): void => {
      response.writeHead(status, { "Content-Type": type, ...ISOLATION_HEADERS });
      response.end(body);
    };
    if (!file.startsWith(root + sep)) {
      answer(404, "not found", "text/plain");
      return;
    }
    readFile(file).then(
      (body) => answer(200, body, TYPES[extname(file)] ?? "application/octet-stream"),
      () => answer(404, "not found", "text/plain"),
    );
  });
  const port = await listenOnRandomPort(server);
  return {
    origin: `http://127.0.0.1:${port}`,
    requests,
    close: () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections();
      }),
  };
}
