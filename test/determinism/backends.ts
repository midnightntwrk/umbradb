import { startPglite } from "./pglite-database.js";
import { startPostgres, type TestServer } from "./postgres-database.js";

/** A backend the determinism suites run on, read through the database API's read handles. [A54, A55, A58] */
export interface DeterminismBackend {
  readonly name: string;
  /** True when every read is a job of one queue, as on PGlite: nothing commits while a read runs. [DB-4] */
  readonly singleQueue: boolean;
  start(): Promise<TestServer>;
}

/** PostgreSQL 18 and PGlite 0.5.10: every suite that iterates over them runs on both. */
export const DETERMINISM_BACKENDS: readonly DeterminismBackend[] = [
  { name: "PostgreSQL 18", singleQueue: false, start: startPostgres },
  { name: "PGlite 0.5.10", singleQueue: true, start: startPglite },
];
