import { describe } from "vitest";
import { sweepTapeCase } from "./ledger-refcount-sweep-tapes.js";

/** R4 on the recorded stagenet 0–10,000, on PGlite: see `./ledger-refcount-sweep-tapes.ts`. [R4 DIFF, LG-14] */
describe("R4 (LG-14) on the recorded stagenet 0–10,000, on PGlite; skipped by name without its tape", () => {
  sweepTapeCase("stagenet-0-10000", ["pglite"]);
});
