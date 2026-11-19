import { processBackend } from "../runner/process-backends.js";
import { storedStateTests } from "./ledger-storage.js";

// `./ledger-storage.ts` on PostgreSQL; `ledger-storage-pglite.test.ts` runs it on the other, so CI can shard them apart.
storedStateTests(processBackend("postgres"));
