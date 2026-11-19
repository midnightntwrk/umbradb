import { processBackend } from "../runner/process-backends.js";
import { mountedAdminTests } from "./mounted-admin.js";

// `./mounted-admin.ts` on PGlite; `mounted-admin-postgres.test.ts` runs it on the other, so CI can shard them apart.
mountedAdminTests(processBackend("pglite"));
