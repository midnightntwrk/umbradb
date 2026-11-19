import { processBackend } from "../runner/process-backends.js";
import { negativeControlTests } from "./ledger-storage.negative-control.js";

// `./ledger-storage.negative-control.ts` on PostgreSQL; `ledger-storage-pglite.negative-control.test.ts` runs it on the other, so CI can shard them apart.
negativeControlTests(processBackend("postgres"));
