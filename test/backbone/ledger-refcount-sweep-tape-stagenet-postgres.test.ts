import { describe } from "vitest";
import { sweepTapeCase } from "./ledger-refcount-sweep-tapes.js";

/** R4 on the recorded stagenet 0–10,000, on PostgreSQL: see `./ledger-refcount-sweep-tapes.ts`. */
describe("on the recorded stagenet 0–10,000, on PostgreSQL; skipped by name without its tape", () => {
  sweepTapeCase("stagenet-0-10000", ["postgres"]);
});
