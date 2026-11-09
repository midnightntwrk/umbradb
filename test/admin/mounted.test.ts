import { once } from "node:events";
import { createServer, request } from "node:http";
import { describe, expect, it } from "vitest";
import { mountedAdminHandler } from "../../src/admin/mounted.js";
import type { AdminAnswer } from "../../src/admin/types.js";

/**
 * Admin's handler mounted in a host's own server (`src/admin/mounted.ts`), without a process: it writes an answer as the
 * admin listener writes it — JSON, `Content-Length`, `Cache-Control: no-store`, no `X-Umbra-*` header, a `HEAD` without
 * its body —, the admin route table's fixed 500 when the answer cannot be built, and nothing on a response the host
 * answered already.
 */

/** `method path` against a host server mounting `answer`: its status, headers and body. */
async function exchange(answer: (method: string, url: string) => AdminAnswer, method: string, path: string) {
  const server = createServer(mountedAdminHandler(answer));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address() as { port: number };
  try {
    return await new Promise<{ status: number; headers: Record<string, unknown>; text: string }>((resolve, reject) => {
      const outgoing = request({ hostname: "127.0.0.1", port, path, method, agent: false }, (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => resolve({ status: response.statusCode ?? 0, headers: response.headers, text: Buffer.concat(chunks).toString() }));
      });
      outgoing.on("error", reject);
      outgoing.end();
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

describe("the mounted admin handler", () => {
  it("writes the answer as JSON with the admin listener's headers, and gets the request's method and URL", async () => {
    const asked: string[] = [];
    const answered = await exchange((method, url) => {
      asked.push(`${method} ${url}`);
      return { status: 200, body: { é: "x" } };
    }, "GET", "/status?x=1");
    expect(asked).toEqual(["GET /status?x=1"]);
    expect(answered).toMatchObject({ status: 200, text: '{"é":"x"}' });
    expect(answered.headers).toMatchObject({
      "content-type": "application/json; charset=utf-8",
      "content-length": String(Buffer.byteLength('{"é":"x"}')),
      "cache-control": "no-store",
    });
    expect(Object.keys(answered.headers).filter((name) => name.startsWith("x-umbra-"))).toEqual([]);
  });

  it("answers a HEAD with the headers only", async () => {
    const answered = await exchange(() => ({ status: 200, body: { live: true } }), "HEAD", "/health/live");
    expect([answered.status, answered.text]).toEqual([200, ""]);
  });

  it("answers the route table's fixed 500 when the answer cannot be built, nothing of the error", async () => {
    const answered = await exchange(() => {
      throw new Error("a secret of the failure");
    }, "GET", "/status");
    expect(answered.status).toBe(500);
    expect(JSON.parse(answered.text)).toEqual({ error: { code: "internal-error", message: "the admin endpoint failed" } });
  });

  it("writes nothing on a response the host answered already, or one that cannot be written", () => {
    const written: unknown[] = [];
    const handler = mountedAdminHandler(() => ({ status: 200, body: null }));
    handler({ method: "GET", url: "/" } as never, { headersSent: true, writeHead: (...args: unknown[]) => written.push(args) } as never);
    expect(written).toEqual([]);
    expect(() =>
      handler({ method: "GET", url: "/" } as never, {
        headersSent: false,
        writeHead: () => {
          throw new Error("the connection ended");
        },
      } as never),
    ).not.toThrow();
  });
});
