/**
 * Admin's handlers mounted in a library host's own server (`startUmbraDB`'s `admin.http`) and the browser demo's
 * fetch-style one (`admin.fetch`): they answer the four endpoints on the host's thread, as the admin listener answers
 * them, from the snapshot the process builds in memory at the request (`ProcessAdmin.answer`, `./process-admin.ts`),
 * with no database read. [AE-1, AE-5, LM-4, LM-5, LM-11; design §5.3, §8]
 *
 * An answer is written as the admin listener writes it (`./serve.ts`): JSON with `Content-Type: application/json;
 * charset=utf-8`, `Content-Length` and `Cache-Control: no-store`, and no `X-Umbra-*` header; a `HEAD` gets the headers
 * only (Node.js sends no body). The request's body is not read. A response the host answered already, or one that can no
 * longer be written, gets nothing. An answer that cannot be built is the admin route table's fixed 500
 * (`FAILED`, AE-6). The module imports nothing of Node.js at run time, so the engine — which the browser build bundles —
 * can hold it. [AE-1, AE-6; design §5.2 N8]
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import { FAILED } from "./routes.js";
import type { AdminAnswer } from "./types.js";

/** The content type of every answer (the admin listener's). */
const CONTENT_TYPE = "application/json; charset=utf-8";

/** How a mounted request is answered: its method and URL (its path and query) as the host's server read them. */
export type MountedAdminAnswer = (method: string, url: string) => AdminAnswer;

/** The headers of an answer whose JSON text is `text` (the admin listener's). */
const headersOf = (text: string): Record<string, string> => ({
  "Content-Type": CONTENT_TYPE,
  "Content-Length": String(new TextEncoder().encode(text).byteLength),
  "Cache-Control": "no-store",
});

/** The handler of a host's server's `request` event that answers through `answer` (see the module comment). [LM-4] */
export function mountedAdminHandler(answer: MountedAdminAnswer): (request: IncomingMessage, response: ServerResponse) => void {
  return (request, response) => {
    let answered: AdminAnswer;
    try {
      // A server's request always has its method and URL.
      answered = answer(request.method as string, request.url as string);
    } catch {
      answered = FAILED;
    }
    try {
      if (response.headersSent) return;
      const text = JSON.stringify(answered.body);
      response.writeHead(answered.status, headersOf(text));
      response.end(text);
    } catch {
      // The host's response could not be written (its connection ended): there is nothing to answer.
    }
  };
}

/**
 * The fetch-style handler that answers through `answer` (see the module comment): a `Request` in, its `Response` out,
 * with the same status, body and headers as the Node.js handler's; a `HEAD` gets the headers only. Never rejects.
 * [LM-11, AE-1]
 */
export function mountedAdminFetch(answer: MountedAdminAnswer): (request: Request) => Promise<Response> {
  return async (request) => {
    let answered: AdminAnswer;
    try {
      const url = new URL(request.url);
      answered = answer(request.method, `${url.pathname}${url.search}`);
    } catch {
      answered = FAILED;
    }
    const text = JSON.stringify(answered.body);
    return new Response(request.method === "HEAD" ? null : text, { status: answered.status, headers: headersOf(text) });
  };
}
