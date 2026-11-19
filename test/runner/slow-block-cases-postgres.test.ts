import { processBackend } from "./process-backends.js";
import { slowBlockCaseTests } from "./slow-block-cases.js";

// `./slow-block-cases.ts` on PostgreSQL; `slow-block-cases-pglite.test.ts` runs it on the other, so CI can shard them apart.
slowBlockCaseTests(processBackend("postgres"));
