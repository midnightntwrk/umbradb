import { processBackend } from "../runner/process-backends.js";
import { storedStateTests, nodeLayoutTests } from "./ledger-storage.js";

// `./ledger-storage.ts` on PGlite; `ledger-storage-postgres.test.ts` runs it on the other, so CI can shard them apart.
storedStateTests(processBackend("pglite"));
nodeLayoutTests();
