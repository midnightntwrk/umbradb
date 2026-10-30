import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { isolationProblems, REPOSITORY, type Served, serveCommand } from "./serve-checks.js";

/**
 * `npm run web`'s server: `node browser/serve.ts` serves a browser build on 127.0.0.1 with the two headers that make
 * the page cross-origin isolated (COOP `same-origin`, COEP `require-corp`), which the ledger worker's
 * `SharedArrayBuffer` needs; nothing outside the directory. `./serve.negative-control.test.ts` shows the header check
 * failing on a server without them.
 */

describe("node browser/serve.ts (npm run web, task 17.3a)", () => {
  let dir: string;
  let served: Served;

  beforeAll(async () => {
    dir = mkdtempSync(join(tmpdir(), "umbradb-web-"));
    writeFileSync(join(dir, "index.html"), "<!doctype html><title>page</title>");
    mkdirSync(join(dir, "ledger"));
    writeFileSync(join(dir, "ledger", "a.wasm"), new Uint8Array([0, 97, 115, 109]));
    served = await serveCommand(["--dir", dir, "--port", "0"]);
  }, 60_000);

  afterAll(async () => {
    await served?.stop();
    rmSync(dir, { recursive: true, force: true });
  });

  it("serves the page with COOP and COEP, and prints the address to open", async () => {
    const response = await fetch(`${served.origin}/`);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("<title>page</title>");
    expect(isolationProblems(response.headers)).toEqual([]);
    expect(served.output).toContain(`${served.origin}/?node=wss://rpc.preview.midnight.network`);
  });

  it("serves WebAssembly as application/wasm, with the same headers", async () => {
    const response = await fetch(`${served.origin}/ledger/a.wasm`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/wasm");
    expect(isolationProblems(response.headers)).toEqual([]);
  });

  it("answers 404 for a missing file and for a path outside the directory", async () => {
    expect((await fetch(`${served.origin}/missing.js`)).status).toBe(404);
    expect((await fetch(`${served.origin}/..%2F..%2Fpackage.json`)).status).toBe(404);
  });

  it("stops on SIGTERM with exit status 0", async () => {
    expect(await served.stop()).toBe(0);
  });
});

describe("package.json's web script (task 17.3a)", () => {
  it("builds the page, then serves it", async () => {
    const { readFileSync } = await import("node:fs");
    const scripts = (JSON.parse(readFileSync(join(REPOSITORY, "package.json"), "utf8")) as { scripts: Record<string, string> })
      .scripts;
    expect(scripts.web).toBe("node browser/build.ts && node browser/serve.ts");
  });
});
