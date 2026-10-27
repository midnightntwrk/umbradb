import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readConfigHash } from "../../src/backbone/core-chain/index.js";
import type { PlainObject } from "../../src/config/plain-data.js";
import type { ProcessInput } from "../../src/runner/process.js";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { a162Problems, a162Run } from "./config-hash-checks.js";

/**
 * A162's committed negative controls (task 14.1b; PP-14, RN-16), each through A162's own run and oracle:
 * - **a private process that ignores `configHash`** (`PrivateIntakeOptions.configHash: "ignore"`) keeps processing after
 *   the core's configuration changed — with a transport on both backends, without one on PostgreSQL —, so the oracle
 *   finds it at 16, not halted;
 * - **a configuration hash over the secrets that shows them**: a core whose hash is its node URL's password as hex (in
 *   the hash's form, `0x` and 64 digits): the header changes when only that password changes, and holds it.
 */

/** A configuration hash of the core's secrets (a negative control's `ProcessInput.configHash`): the node's password as hex. */
const showingSecrets: NonNullable<ProcessInput["configHash"]> = async (read, core) => {
  await readConfigHash(read);
  const password = new URL(String((core.settings as PlainObject).node)).password;
  return `0x${Buffer.from(password, "utf8").toString("hex").padEnd(64, "0").slice(0, 64)}`;
};

describe.each(PRIVATE_BACKENDS)("A162's negative controls on $name", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "a private process that ignores configHash keeps processing after the core's configuration changed: fails A162",
    async () => {
      const problems = a162Problems(await a162Run(backend, { transport: true, ignore: true }));
      expect(problems).toContain("the private process kept processing after the core's configuration changed: at 16");
      expect(problems.some((problem) => problem.startsWith("after a data field changed the private process is "))).toBe(true);
    },
    TEST_TIMEOUT_MS,
  );

  it.runIf(backend.kind === "postgres")(
    "without a transport, a private process that ignores configHash keeps processing after a reconnection: fails A162",
    async () => {
      const problems = a162Problems(await a162Run(backend, { transport: false, ignore: true }));
      expect(problems).toContain("the private process kept processing after the core's configuration changed: at 16");
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "a configuration hash over the secrets changes when only a secret changes and shows it: fails A162",
    async () => {
      const problems = a162Problems(await a162Run(backend, { transport: false, private: false, configHash: showingSecrets }));
      expect(problems).toContain("X-Umbra-Config-Hash changed with only secrets changed");
      expect(problems.some((problem) => problem.endsWith("X-Umbra-Config-Hash holds the secret first-node-secret"))).toBe(true);
      // The real hash, by the same run: none of these.
      expect(a162Problems(await a162Run(backend, { transport: false, private: false }))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );
});
