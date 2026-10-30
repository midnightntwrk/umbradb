import { expect } from "vitest";
import { readManifest, tapeTest } from "./real-tapes.js";

/**
 * Run only by `real-tapes.negative-control.test.ts`, through `vitest.fixture.config.mjs`: one real-tape test per tape
 * of the manifest named by `UMBRADB_PROBE_MANIFEST`, each registered by `tapeTest` exactly as the real-tape tests are,
 * so the report shows what Vitest makes of a tape that is absent (a skip naming it), present (a pass) or changed (a
 * failure).
 */

const manifest = readManifest(process.env.UMBRADB_PROBE_MANIFEST as string);

for (const tape of manifest.tapes) {
  tapeTest(tape.name, `reads ${tape.name}`, (found) => {
    expect(found.bytes.length).toBe(tape.bytes);
  }, { manifest });
}
