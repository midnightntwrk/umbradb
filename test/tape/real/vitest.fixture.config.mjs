import { mergeConfig } from "vitest/config";
import repository from "../../../vitest.config.ts";

/**
 * The repository's Vitest configuration with `skip-probe.fixture.ts` as its only test file and no coverage, for
 * `real-tapes.negative-control.test.ts`: the real-tape tests' skip, pass and refusal as Vitest itself reports them.
 * JavaScript, so that the type check does not take in `vitest.config.ts`. [docs/issues/00017]
 */
export default mergeConfig(repository, {
  test: {
    include: ["test/tape/real/skip-probe.fixture.ts"],
    coverage: { enabled: false },
  },
});
