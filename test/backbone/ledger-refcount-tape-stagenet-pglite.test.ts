import { describe } from "vitest";
import { refcountTapeTests } from "./refcount-tapes.js";

// R3's check on the recorded stagenet-0-10000 tape, on PGlite (`./refcount-tapes.ts`: one file per tape
// and backend, so that the replays run side by side). [R3, LG-11, LG-14]
describe("R3 on stagenet-0-10000, PGlite (UMBRADB_TAPES)", () => {
  refcountTapeTests("stagenet-0-10000", ["pglite"]);
});
