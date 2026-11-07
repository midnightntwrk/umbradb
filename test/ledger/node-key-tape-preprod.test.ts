import { describe } from "vitest";
import { nodeKeyTapeTest } from "./node-key-tapes.js";

// R29's node-key clause on the recorded preprod-0-10000 tape (`./node-key-tapes.ts`). [R29, LG-11]
describe("node-key.ts against the package on preprod-0-10000 (UMBRADB_TAPES)", () => {
  nodeKeyTapeTest("preprod-0-10000");
});
