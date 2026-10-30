/**
 * Build flags of `core-digest` (`./core-digest.ts`). They are constants fixed when the package is built, and nothing at
 * run time can change them:
 * - an importer cannot assign an ES module's `const` export;
 * - no option, setting or environment variable reads them;
 * - this module is not part of the package's exported surface (`package.json` exports `"."` only). [design §12]
 *
 * `core-digest` checkpoints every table's digest at each height h with h mod `CHECKPOINT_INTERVAL` = 0. The interval is
 * 14,400, about 24 hours at one block per 6 s, so every instance checkpoints at the same heights whatever its start
 * height S. It is a constant of the build, not a setting. [DT-5, Q86]
 *
 * Only a test may shorten it, and only in a build of its own:
 * `test/backbone/core-digest/checkpoints.build-flag.test.ts` replaces this module in its own module graph (`vi.mock`),
 * as the negative control for the PGlite backend's flag does. [A11]
 */
export const CHECKPOINT_INTERVAL = 14_400n;
