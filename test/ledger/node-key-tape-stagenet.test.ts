import { describe } from "vitest";
import { nodeKeyTapeTest } from "./node-key-tapes.js";

// The node-key clause on the recorded stagenet-0-10000 tape (`./node-key-tapes.ts`).
describe("node-key.ts against the package on stagenet-0-10000 (UMBRADB_TAPES)", () => {
  nodeKeyTapeTest("stagenet-0-10000");
});
