import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { PrivateLinkChannel } from "../../src/library/channels.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS } from "../private/backends.js";
import { l39Problems } from "./refused-channels.js";

/**
 * The committed negative control, through the criterion's own run and oracle (`./refused-channels.ts`), with the
 * fault put back on the not-accepting paths themselves — `../../src/private/core-channels.ts` replaced here: a process
 * with no channel request keeps the channel it is given (`refuseChannel`, which the engine calls for it, closes and logs
 * nothing), and a channel core that stopped accepting keeps it too (`CoreChannels.accept` after `stopAccepting`). The
 * oracle sees, in both cases, the channel still open and no line logged; with the real module it passes. On PostgreSQL
 * 18 (Docker) and PGlite.
 */

const control = vi.hoisted(() => ({ keeps: false }));

vi.mock("../../src/private/core-channels.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/private/core-channels.js")>();
  /** A channel link that, once it stopped accepting, keeps every channel it is given. */
  class Keeping extends actual.CoreChannels {
    #stopped = false;
    override stopAccepting(why: string): void {
      this.#stopped = true;
      super.stopAccepting(why);
    }
    override accept(channel: PrivateLinkChannel): void {
      if (control.keeps && this.#stopped) return;
      super.accept(channel);
    }
  }
  return {
    ...actual,
    CoreChannels: Keeping,
    refuseChannel: (channel: PrivateLinkChannel, log: (line: string) => void, why: string) => {
      if (!control.keeps) actual.refuseChannel(channel, log, why);
    },
  };
});

describe.each(PRIVATE_BACKENDS)("negative control on $name", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("not-accepting paths that keep the channel fail the oracle: still open, no line; the real paths pass", async () => {
    control.keeps = true;
    let problems: string[];
    try {
      problems = await l39Problems(backend);
    } finally {
      control.keeps = false;
    }
    for (const where of ["no channel request", "after stop()"]) {
      expect(problems, where).toContain(`${where}: the channel is still open after 2000 ms`);
      expect(problems.some((problem) => problem.startsWith(`${where}: no line `)), where).toBe(true);
    }
    expect(await l39Problems(backend)).toEqual([]);
  }, 180_000);
});
