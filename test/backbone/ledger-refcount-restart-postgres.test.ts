import { processBackend } from "../runner/process-backends.js";
import { restartTests, contentsHashTests } from "./ledger-refcount-restart.js";

// `./ledger-refcount-restart.ts` on PostgreSQL; `ledger-refcount-restart-pglite.test.ts` runs it on the other, so CI can shard them apart.
restartTests(processBackend("postgres"));
contentsHashTests();
