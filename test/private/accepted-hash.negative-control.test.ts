import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type StartHashes, startHashDecision } from "../../src/backbone/core-private-source/index.js";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { a165Problems, a165Run } from "./accepted-hash-checks.js";

/**
 * A165's committed negative controls (task 14.1c; PP-14, owner decision Q159): two wrong start decisions given to the
 * private process's intake (`PrivateIntakeOptions.acceptance`), each failing A165's oracle on PostgreSQL 18.6 and PGlite
 * 0.5.10 — a start that never compares the hash it recorded (every start a first one: it records what it finds and
 * runs on after the core's configuration changed), and an `--update-hash` that accepts any hash (a start given the hash
 * it had accepted, not the new one, runs on). Each run ends after A165's third start (`short`).
 */

/** A start that never compares the recorded hash: every start records what it finds, as a first start does. */
const neverCompares = (hashes: StartHashes) => startHashDecision({ ...hashes, recorded: null });

/** An `--update-hash` that accepts any hash: any hash given counts as the one found. */
const acceptsAny = (hashes: StartHashes) =>
  startHashDecision(hashes.given === null ? hashes : { ...hashes, given: hashes.core ?? hashes.history });

describe.each(PRIVATE_BACKENDS)("A165's negative controls on $name (PP-14, Q159)", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "negative control: a start that never compares the hash it recorded runs on after a changed configuration and fails A165",
    async () => {
      const run = await a165Run(backend, { transport: true, acceptance: neverCompares, short: true });
      const problems = a165Problems(run);
      expect(run.changed.started).toBe(true);
      expect(problems.some((problem) => problem.startsWith("a start after the core's configuration changed: the private process started"))).toBe(true);
      expect(problems.some((problem) => problem.startsWith("a start after the core's configuration changed: the private database holds"))).toBe(true);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "negative control: an --update-hash that accepts any hash runs on with another hash given and fails A165",
    async () => {
      const run = await a165Run(backend, { transport: true, acceptance: acceptsAny, short: true });
      const problems = a165Problems(run);
      expect(run.changed.started).toBe(false);
      expect(run.other.started).toBe(true);
      expect(problems.some((problem) => problem.startsWith("a start with --update-hash set to another hash: the private process started"))).toBe(true);
      expect(problems.filter((problem) => problem.startsWith("a start after the core's configuration changed"))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it.runIf(backend.kind === "postgres")(
    "negative control: without a transport, a start that never compares the hash it recorded fails A165 alike",
    async () => {
      const run = await a165Run(backend, { transport: false, acceptance: neverCompares, short: true });
      expect(run.changed.started).toBe(true);
      const problems = a165Problems(run);
      expect(problems.some((problem) => problem.startsWith("a start after the core's configuration changed: the private process started"))).toBe(true);
    },
    TEST_TIMEOUT_MS,
  );
});
