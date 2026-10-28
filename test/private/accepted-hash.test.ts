import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { a165Problems, a165Run } from "./accepted-hash-checks.js";

/**
 * A165 `[CI]` (task 14.1c; PP-14, owner decision Q159), on PostgreSQL 18.6 and PGlite 0.5.10, with a transport and —
 * on PostgreSQL, whose public database a private process may read directly — without one: a private process's first
 * start records the public configuration hash it finds; after the core restarts with a changed configuration, the
 * private process's start stops with `public-config-changed`, its message naming the new hash and `--update-hash`;
 * started with `updateHash` (`umbradb run --update-hash`) set to that hash it runs its full checks, records it and
 * continues; set to another value it stops; a core changing its configuration between the private process's read of the
 * public history and its first `hello-ack` (PostgreSQL), or between that `hello-ack` and its first read through the
 * core (PGlite, where the history is read through the core), stops it too. The run and the oracle are
 * `./accepted-hash-checks.ts`'s; the committed negative controls are `./accepted-hash.negative-control.test.ts`'s.
 */

/** The cases: each backend with a transport, and PostgreSQL without one. */
const CASES: readonly { readonly name: string; readonly backend: PrivateBackend; readonly transport: boolean }[] = PRIVATE_BACKENDS.flatMap(
  (backend) => [
    { name: `${backend.name}, with a transport`, backend, transport: true },
    ...(backend.kind === "postgres" ? [{ name: `${backend.name}, without a transport`, backend, transport: false }] : []),
  ],
);

describe.each(CASES)("A165: a private process keeps the public configuration hash it accepted, on $name (PP-14)", ({ backend, transport }) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "A165: a first start records the hash; after a changed configuration a start stops with public-config-changed " +
      "naming the new hash and --update-hash; updateHash set to it runs the full checks, records it and continues; " +
      "another value stops; a core changed during the start stops it",
    async () => {
      const run = await a165Run(backend, { transport });
      expect(a165Problems(run)).toEqual([]);
      expect([run.changed.code, run.other.code, run.race?.code ?? null]).toEqual([
        "public-config-changed",
        "public-config-changed",
        transport ? "public-config-changed" : null,
      ]);
    },
    TEST_TIMEOUT_MS,
  );
});
