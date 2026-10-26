import { setTimeout as sleep } from "node:timers/promises";
import { it } from "vitest";

/**
 * Run only by `test/timeouts.test.ts`, through `vitest.fixture.config.ts` (the repository's configuration with this
 * file as its only test file): one test longer than Vitest's default 5 s, which must pass, and one that never ends,
 * which must fail at the repository's `testTimeout`.
 */

it("takes 6 s, longer than Vitest's default timeout", async () => {
  await sleep(6_000);
});

it("never ends", async () => {
  await new Promise(() => undefined);
});
