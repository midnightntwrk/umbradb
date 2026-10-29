/**
 * Build flags of the PGlite backend (`./pglite.ts`). They are constants fixed when the package is built, and nothing at
 * run time can change them:
 * - an importer cannot assign an ES module's `const` export;
 * - no option, setting or environment variable reads them;
 * - this module is not part of the package's exported surface (`package.json` exports `"."` only). [design §12]
 *
 * `READS_BYPASS_QUEUE` exists only for a negative control of the test that reads never run inside a block transaction.
 * When true, a read runs at once instead of waiting for its turn in the queue, so reads can run inside a block
 * transaction. It is false in every build made from this source. The negative-control test
 * (`test/db/pglite-no-outside-read.negative-control.test.ts`) builds its own module graph with it true and checks that
 * the read-isolation test then fails. [A11, DB-4]
 */
export const READS_BYPASS_QUEUE = false;
