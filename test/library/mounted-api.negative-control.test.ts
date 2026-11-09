import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { hashesOfSecrets, hashProblems } from "./config-hash-cases.js";

/**
 * The configuration-hash negative control on the mounted path only, through the criterion's own run and oracle
 * (`./config-hash-cases.ts`): the module API's mounted handlers (`moduleApiHandlers` of
 * `../../src/runner/api-socket.ts`, which `startModuleApi` makes them with — the module replaced here) given a hash
 * over the process's first secret, its UTF-8 bytes as hex in the hash's form, in place of the configuration's. The
 * mounted upgrade's hash then changes with only a secret changed and holds it, and the oracle fails; the listener's,
 * made by the same module's own listener, stays the real one. On PostgreSQL 18 (the database's password) and PGlite (a
 * TLS key).
 */

const control = vi.hoisted(() => ({ hash: null as string | null }));

vi.mock("../../src/runner/api-socket.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/runner/api-socket.js")>();
  return {
    ...actual,
    moduleApiHandlers: (...args: Parameters<typeof actual.moduleApiHandlers>) => {
      const [api, options = {}] = args;
      return actual.moduleApiHandlers(api, control.hash === null ? options : { ...options, configHash: control.hash });
    },
  };
});

/** `secret` as a configuration hash: its UTF-8 bytes as hex, in the hash's form. */
const hashOver = (secret: string): string => `0x${Buffer.from(secret, "utf8").toString("hex").padEnd(64, "0").slice(0, 64)}`;

describe.each(PROCESS_BACKENDS)("configuration-hash negative control on the mounted path, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("the mounted handlers given a hash over a secret: it changes with the secret and holds it, the listener's unchanged", async () => {
    let seen: Awaited<ReturnType<typeof hashesOfSecrets>>;
    try {
      seen = await hashesOfSecrets(backend, (variant) => {
        control.hash = hashOver(variant.secrets[0] as string);
      });
    } finally {
      control.hash = null;
    }
    const problems = hashProblems("mounted", seen.hashes, seen.secrets);
    expect(problems.some((problem) => problem.startsWith("mounted: the hash changed with only secrets changed")), problems.join("; ")).toBe(true);
    expect(problems.some((problem) => problem.startsWith("mounted: the hash holds the secret")), problems.join("; ")).toBe(true);
    // The listener's hash is the configuration's: the control changes the mounted path only.
    expect(hashProblems("listener", seen.listener, seen.secrets)).toEqual([]);
    // With the real handlers, the same run passes.
    const real = await hashesOfSecrets(backend);
    expect(hashProblems("mounted", real.hashes, real.secrets)).toEqual([]);
  }, 300_000);
});
