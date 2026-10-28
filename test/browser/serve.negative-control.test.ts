import { createServer } from "node:http";
import { describe, expect, it } from "vitest";
import { isolationProblems } from "./serve-checks.js";

/**
 * Negative control of `./serve.test.ts` (task 17.3a): the header check fails on a plain static server, which sends
 * neither COOP nor COEP — the server `docs/browser.md` warns against (the page then cannot start its
 * ledger worker: `SharedArrayBuffer is not defined`).
 */

describe("the isolation check on a server without COOP and COEP (task 17.3a)", () => {
  it("names both headers", async () => {
    const server = createServer((_request, response) => {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end("<!doctype html>");
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
      const { port } = server.address() as { port: number };
      const response = await fetch(`http://127.0.0.1:${port}/`);
      expect(isolationProblems(response.headers)).toEqual([
        "cross-origin-opener-policy: (none), not same-origin",
        "cross-origin-embedder-policy: (none), not require-corp",
      ]);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});
