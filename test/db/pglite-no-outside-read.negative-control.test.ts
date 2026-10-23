import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type * as BuildFlags from "../../src/db/pglite-build-flags.js";
import { READS_BYPASS_QUEUE } from "../../src/db/pglite-build-flags.js";
import { expectNoOutsideReads, outsideReads, runUnderReadLoad } from "./pglite-outside-reads.js";
import { type PgliteTestServer, startPgliteServer } from "./pglite-server.js";

/**
 * A11's negative control (DB-4): a build of the PGlite backend whose reads bypass the queue must make A11's test fail.
 *
 * The build flag is `READS_BYPASS_QUEUE`, a constant of `src/db/pglite-build-flags.ts`, `false` in the source and so
 * in every build made from it. Nothing at run time can turn it on: it is a `const` export of an ES module (an importer
 * cannot assign it), no option, setting or environment variable reads it, and the module is not part of the package's
 * exported surface (`package.json` exports `"."` only; `design.md` §12 names no such export). Only a different build of
 * that module turns it on — which this file makes for itself: `vi.mock` replaces the module, in this test file's module
 * graph only, with one whose flag is `true`, so `src/db/pglite.ts` (imported through `./pglite-server.ts`) is built
 * with reads that run at once instead of waiting for their turn. Then the same instrumented run and the same
 * assertions as A11 (`pglite-no-outside-read.test.ts`) must fail, for the intended reason: reads inside block windows.
 */

vi.mock("../../src/db/pglite-build-flags.js", () => ({ READS_BYPASS_QUEUE: true }));

let server: PgliteTestServer;

beforeAll(async () => {
  server = await startPgliteServer();
}, 120_000);

afterAll(async () => {
  await server?.stop();
}, 60_000);

describe("A11 negative control — reads that bypass the queue", () => {
  it("is off in the source and in every build made from it, and nothing at run time can turn it on", async () => {
    const actual = await vi.importActual<typeof BuildFlags>("../../src/db/pglite-build-flags.js");
    expect(actual.READS_BYPASS_QUEUE).toBe(false);
    const source = readFileSync(new URL("../../src/db/pglite-build-flags.ts", import.meta.url), "utf8");
    const code = source
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .trim();
    expect(code).toBe("export const READS_BYPASS_QUEUE = false;");
    const entry = readFileSync(new URL("../../src/index.ts", import.meta.url), "utf8");
    expect(entry).not.toMatch(/pglite-build-flags|READS_BYPASS_QUEUE/);
    const manifest = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8")) as {
      exports: Record<string, unknown>;
    };
    expect(Object.keys(manifest.exports)).toEqual(["."]);
  });

  it("[[db.pglite.no-outside-read.negative-control-fires]] makes A11's test fail: reads run inside block transactions", async () => {
    // This file's build: the flag is on.
    expect(READS_BYPASS_QUEUE).toBe(true);
    const outcome = await runUnderReadLoad(await server.createDatabase());
    // A11's own assertions fail on this build …
    expect(() => expectNoOutsideReads(outcome)).toThrow();
    // … for the intended reason: reads' statements inside blocks' windows.
    const found = outsideReads(outcome.trace);
    expect(found.length).toBeGreaterThan(0);
    expect(new Set(found.map((read) => read.block)).size).toBeGreaterThan(1);
  }, 120_000);
});
