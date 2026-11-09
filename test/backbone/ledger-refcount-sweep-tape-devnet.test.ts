import { describe } from "vitest";
import { sweepTapeCase } from "./ledger-refcount-sweep-tapes.js";

/** R4 on the recorded devnet v8 → v9 (0–235): see `./ledger-refcount-sweep-tapes.ts`. */
describe("on the recorded devnet v8 → v9 (0–235); skipped by name without its tape", () => {
  sweepTapeCase("devnet-v8-v9-0-235", ["postgres", "pglite"]);
});
