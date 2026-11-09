import { describe } from "vitest";
import { refcountTapeTests } from "./refcount-tapes.js";

// The check on the recorded devnet-v8-v9-0-235 tape, on both backends (`./refcount-tapes.ts`).
describe("on devnet-v8-v9-0-235 (UMBRADB_TAPES)", () => {
  refcountTapeTests("devnet-v8-v9-0-235");
});
