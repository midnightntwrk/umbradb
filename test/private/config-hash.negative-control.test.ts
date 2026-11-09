import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readConfigHash } from "../../src/backbone/core-chain/index.js";
import type { PlainObject } from "../../src/config/plain-data.js";
import type { EngineInput } from "../../src/runner/process.js";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { a162Problems, a162Run } from "./config-hash-checks.js";

/**
 * The configuration-hash scenario's committed negative controls, each through the scenario's own run and oracle:
 * - **a private process that ignores `configHash`** (`PrivateIntakeOptions.configHash: "ignore"`) keeps processing after
 *   the core's configuration changed — with a transport on both backends, without one on PostgreSQL —, so the oracle
 *   finds it at 16, not halted;
 * - **a configuration hash over the secrets that shows them**: a core whose hash is its node URL's password as hex (in
 *   the hash's form, `0x` and 64 digits): the header changes when only that password changes, and holds it.
 */

/** A configuration hash of the core's secrets (a negative control's `EngineInput.configHash`): the node's password as hex. */
const showingSecrets: NonNullable<EngineInput["configHash"]> = async (read, core) => {
  await readConfigHash(read);
  const password = new URL(String((core.settings as PlainObject).node)).password;
  return `0x${Buffer.from(password, "utf8").toString("hex").padEnd(64, "0").slice(0, 64)}`;
};

describe.each(PRIVATE_BACKENDS)("negative controls on $name", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "a private process that ignores configHash keeps processing after the core's configuration changed: fails",
    async () => {
      const problems = a162Problems(await a162Run(backend, { transport: true, ignore: true }));
      expect(problems).toContain("the private process kept processing after the core's configuration changed: at 16");
      expect(problems.some((problem) => problem.startsWith("after a data field changed the private process is "))).toBe(true);
    },
    TEST_TIMEOUT_MS,
  );

  it.runIf(backend.kind === "postgres")(
    "without a transport, a private process that ignores configHash keeps processing after a reconnection: fails",
    async () => {
      const problems = a162Problems(await a162Run(backend, { transport: false, ignore: true }));
      expect(problems).toContain("the private process kept processing after the core's configuration changed: at 16");
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "a configuration hash over the secrets changes when only a secret changes and shows it: fails",
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
