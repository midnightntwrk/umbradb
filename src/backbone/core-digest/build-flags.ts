/**
 * Build flags of `core-digest` (`./core-digest.ts`): constants fixed when the package is built, which nothing at run time
 * can change — an ES module's `const` export cannot be assigned by an importer, no option, setting or environment
 * variable reads them, and this module is not part of the package's exported surface (`package.json` exports `"."`
 * only; `openspec/changes/core-arch/design.md` §12 names no such export).
 *
 * `CHECKPOINT_INTERVAL` is DT-5's: `core-digest` checkpoints every table's digest at each height h with
 * h mod `CHECKPOINT_INTERVAL` = 0 — 14,400, about 24 hours at one block per 6 s, so that every instance checkpoints at
 * the same heights whatever its S (owner decision Q86). It is a constant of the build, not a setting. Only a test may
 * shorten it, and only in a build of its own: `test/backbone/core-digest/checkpoints.build-flag.test.ts` replaces this
 * module in its own module graph (`vi.mock`), as A11's negative control does with the PGlite backend's flag.
 */
export const CHECKPOINT_INTERVAL = 14_400n;
