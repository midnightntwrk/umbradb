import { startPglite } from "./pglite-database.js";
import { startPostgres, type TestServer } from "./postgres-database.js";

/** A backend the determinism suites run on, through the database API's read handles (A54, A55, A58 on both). */
export interface DeterminismBackend {
  readonly name: string;
  /** True when every read is a job of one queue (PGlite, DB-4): nothing commits while a read runs. */
  readonly singleQueue: boolean;
  start(): Promise<TestServer>;
}

/** PostgreSQL 17 (task 2.1's backend) and PGlite 0.5.10 (task 2.2's): every suite that iterates them runs on both. */
export const DETERMINISM_BACKENDS: readonly DeterminismBackend[] = [
  { name: "PostgreSQL 17", singleQueue: false, start: startPostgres },
  { name: "PGlite 0.5.10", singleQueue: true, start: startPglite },
];
