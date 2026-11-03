import { describe } from "vitest";
import { refcountTapeTests } from "./refcount-tapes.js";

// R3's check on the recorded devnet-v8-v9-0-235 tape, on both backends (`./refcount-tapes.ts`). [R3, LG-11, LG-14]
describe("R3 on devnet-v8-v9-0-235 (UMBRADB_TAPES)", () => {
  refcountTapeTests("devnet-v8-v9-0-235");
});
