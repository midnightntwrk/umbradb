import { describe } from "vitest";
import { sweepTapeCase } from "./ledger-refcount-sweep-tapes.js";

/** R4 on the recorded preprod 0–10,000, on PGlite: see `./ledger-refcount-sweep-tapes.ts`. */
describe("on the recorded preprod 0–10,000, on PGlite; skipped by name without its tape", () => {
  sweepTapeCase("preprod-0-10000", ["pglite"]);
});
