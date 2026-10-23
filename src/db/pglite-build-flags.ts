/**
 * Build flags of the PGlite backend (`./pglite.ts`): constants fixed when the package is built, which nothing at run
 * time can change — an ES module's `const` export cannot be assigned by an importer, no option, setting or
 * environment variable reads them, and this module is not part of the package's exported surface (`package.json`
 * exports `"."` only; `openspec/changes/core-arch/design.md` §12 names no such export).
 *
 * `READS_BYPASS_QUEUE` exists only for A11's negative control (`acceptance.md` A11; DB-4): when true, a read runs at
 * once instead of waiting for its turn in the queue, so reads can run inside a block transaction. It is false in every
 * build made from this source; the negative-control test (`test/db/pglite-no-outside-read.negative-control.test.ts`)
 * builds its own module graph with it true and checks that A11's test then fails.
 */
export const READS_BYPASS_QUEUE = false;
