import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { a162Problems, a162Run } from "./config-hash-checks.js";

/**
 * A changed public configuration halts a private process, on PostgreSQL 18.6 and PGlite 0.5.10:
 * - a private process running against a core that restarts with a data field of its configuration changed halts with
 *   `public-config-changed` at its next message from the core, before it processes another height;
 * - a core restarted with the same configuration, or with only its secrets changed, changes nothing;
 * - every module API answer carries `X-Umbra-Config-Hash`, which holds no secret (a password in `database` on
 *   PostgreSQL, the node URL's on both) and does not change with one;
 * - on PostgreSQL a private process without a transport, reading the public configuration history again at a
 *   reconnection to its public database, halts alike (a PGlite public database is read only through the core's
 *   transport, so there is no such process on PGlite).
 *
 * The run and the oracle are `./config-hash-checks.ts`'s; the committed negative controls are
 * `./config-hash.negative-control.test.ts`'s. [A162 CI, PP-14, RN-16, PP-4, Q147]
 */

describe.each(PRIVATE_BACKENDS)("A162: a changed public configuration halts a private process on $name (PP-14, RN-16)", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "A162: with a transport, a core restarted with a data field changed halts the private process with public-config-changed " +
      "before another height; the same configuration, or only secrets changed, changes nothing; X-Umbra-Config-Hash holds no secret",
    async () => {
      const run = await a162Run(backend, { transport: true });
      expect(a162Problems(run)).toEqual([]);
      expect([run.state, run.code, run.cursor]).toEqual(["halted", "public-config-changed", 11n]);
    },
    TEST_TIMEOUT_MS,
  );

  it.runIf(backend.kind === "postgres")(
    "A162: without a transport, the public configuration history read again at a reconnection to the public database " +
      "halts it alike with public-config-changed",
    async () => {
      const run = await a162Run(backend, { transport: false });
      expect(a162Problems(run)).toEqual([]);
      expect([run.state, run.code, run.cursor]).toEqual(["halted", "public-config-changed", 11n]);
    },
    TEST_TIMEOUT_MS,
  );
});
