import { processBackend } from "../runner/process-backends.js";
import { reclamationTests } from "./ledger-refcount-blocks.js";

// `./ledger-refcount-blocks.ts` on PostgreSQL; `ledger-refcount-blocks-pglite.test.ts` runs it on the other, so CI can shard them apart.
reclamationTests(processBackend("postgres"));
