import { describe } from "vitest";
import { refcountTapeTests } from "./refcount-tapes.js";

// R3's check on the recorded preprod-0-10000 tape, on PostgreSQL 18 (`./refcount-tapes.ts`: one file per tape
// and backend, so that the replays run side by side). [R3, LG-11, LG-14]
describe("R3 on preprod-0-10000, PostgreSQL 18 (UMBRADB_TAPES)", () => {
  refcountTapeTests("preprod-0-10000", ["postgres"]);
});
