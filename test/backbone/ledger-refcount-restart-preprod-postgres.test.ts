import { preprodRestartTest } from "./refcount-restart-preprod.js";

/**
 * R13 on the recorded preprod 0–10,000 tape, on PostgreSQL 18 (`./refcount-restart-preprod.ts`; skipped by name without
 * the tape). The other backend's is `ledger-refcount-restart-preprod-pglite.test.ts`.
 */

preprodRestartTest("postgres");
