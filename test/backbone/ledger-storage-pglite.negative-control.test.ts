import { processBackend } from "../runner/process-backends.js";
import { negativeControlTests, windowControlTests } from "./ledger-storage.negative-control.js";

// `./ledger-storage.negative-control.ts` on PGlite; `ledger-storage-postgres.negative-control.test.ts` runs it on the other, so CI can shard them apart.
negativeControlTests(processBackend("pglite"));
windowControlTests();
