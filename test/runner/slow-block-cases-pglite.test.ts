import { processBackend } from "./process-backends.js";
import { slowBlockCaseTests } from "./slow-block-cases.js";

// `./slow-block-cases.ts` on PGlite; `slow-block-cases-postgres.test.ts` runs it on the other, so CI can shard them apart.
slowBlockCaseTests(processBackend("pglite"));
