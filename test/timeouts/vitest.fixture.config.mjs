import { mergeConfig } from "vitest/config";
import repository from "../../vitest.config.ts";

/**
 * The repository's Vitest configuration with `hang.fixture.ts` as its only test file and no coverage, for
 * `timeouts.test.ts`: whatever `testTimeout` the repository sets is the one the fixture runs under. JavaScript, so
 * that the type check does not take in `vitest.config.ts` (which it does not check, `docs/issues/00017`).
 */
export default mergeConfig(repository, {
  test: {
    include: ["test/timeouts/hang.fixture.ts"],
    coverage: { enabled: false },
  },
});
