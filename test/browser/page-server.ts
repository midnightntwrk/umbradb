import { createServer, type Server } from "node:http";
import { pageHandler } from "../../browser/serve.js";
import { listenOnRandomPort } from "../../tools/tape/port.js";

/**
 * The static server of the browser build's tests: serves a build's directory on `127.0.0.1` at a random free port of at
 * least 10000 with `npm run web`'s handler (`browser/serve.ts`): every answer with the
 * headers that make the page cross-origin isolated (`Cross-Origin-Opener-Policy: same-origin`,
 * `Cross-Origin-Embedder-Policy: require-corp`), which the node-store bridge's `SharedArrayBuffer` needs, and
 * `Cross-Origin-Resource-Policy: same-origin`. A path outside the directory, or no file, is 404. Every request is
 * recorded ({@link PageServer.requests}). [LG-10]
 */

export interface PageServer {
  /** `http://127.0.0.1:<port>`. */
  readonly origin: string;
  /** Every path requested, in order. */
  readonly requests: string[];
  close(): Promise<void>;
}

/** Serves `directory` (see the module comment). */
export async function servePage(directory: string): Promise<PageServer> {
  const requests: string[] = [];
  const handle = pageHandler(directory);
  const server: Server = createServer((request, response) => {
    requests.push(decodeURIComponent(new URL(request.url ?? "/", "http://page").pathname));
    handle(request, response);
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
