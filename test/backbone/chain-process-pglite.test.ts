import { processBackend } from "../runner/process-backends.js";
import { chainProcessTests } from "./chain-process.js";

// `./chain-process.ts` on PGlite; `chain-process-postgres.test.ts` runs it on the other, so CI can shard them apart.
chainProcessTests(processBackend("pglite"));
