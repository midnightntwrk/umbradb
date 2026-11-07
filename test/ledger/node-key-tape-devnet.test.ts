import { describe } from "vitest";
import { nodeKeyTapeTest } from "./node-key-tapes.js";

// R29's node-key clause on the recorded devnet-v8-v9-0-235 tape (`./node-key-tapes.ts`). [R29, LG-11]
describe("node-key.ts against the package on devnet-v8-v9-0-235 (UMBRADB_TAPES)", () => {
  nodeKeyTapeTest("devnet-v8-v9-0-235");
});
