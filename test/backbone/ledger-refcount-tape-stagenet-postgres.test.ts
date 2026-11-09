import { describe } from "vitest";
import { refcountTapeTests } from "./refcount-tapes.js";

// The check on the recorded stagenet-0-10000 tape, on PostgreSQL 18 (`./refcount-tapes.ts`: one file per tape
// and backend, so that the replays run side by side).
describe("on stagenet-0-10000, PostgreSQL 18 (UMBRADB_TAPES)", () => {
  refcountTapeTests("stagenet-0-10000", ["postgres"]);
});
