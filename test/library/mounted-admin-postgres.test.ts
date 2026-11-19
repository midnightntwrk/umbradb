import { processBackend } from "../runner/process-backends.js";
import { mountedAdminTests, heartbeatTests } from "./mounted-admin.js";

// `./mounted-admin.ts` on PostgreSQL; `mounted-admin-pglite.test.ts` runs it on the other, so CI can shard them apart.
mountedAdminTests(processBackend("postgres"));
heartbeatTests();
