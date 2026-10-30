import { describe, expect, it } from "vitest";
import { startHashDecision } from "../../src/backbone/core-private-source/core-private-source.js";
import { publicConfigChanged } from "../../src/private/private-transport.js";

/**
 * The text of the stops a changed public configuration hash causes, checked word for word:
 * - `startHashDecision`'s two forms: with and without a given hash that is not the one found, and with and without
 *   one recorded;
 * - its reasons;
 * - `publicConfigChanged`'s two ways of learning the new hash, with and without one. [PP-14, Q159]
 */

const h = (byte: string): string => `0x${byte.repeat(32)}`;
const [A, B, C] = [h("aa"), h("bb"), h("cc")];

describe("PP-14's stop messages (task 17.5b)", () => {
  it("names both hashes found that differ, the hash to accept, the one it replaces and a hash given otherwise", () => {
    const moved = startHashDecision({ recorded: A, history: B, core: C, given: B });
    expect(moved.reason).toBe("refused");
    expect(moved.refusal?.message).toBe(
      `the core at coreTransport sends the configuration hash ${C}, and the public configuration history this start ` +
        `read hashes to ${B}: the core's configuration changed during this start, or coreTransport and ` +
        "publicDatabase are not one core's, so the public table items checked are not the " +
        `core's. Start the private process again once both give one hash — with --update-hash=${C}, to accept the ` +
        `core's, in place of ${A}, the one it accepted. The --update-hash given, ${B}, is not that hash, so nothing ` +
        "was accepted.",
    );
    expect(moved.refusal?.details).toEqual({ via: "startup", recorded: A, found: C, history: B, core: C, given: B });
    const first = startHashDecision({ recorded: null, history: B, core: C, given: C });
    expect(first.refusal?.message.endsWith(`with --update-hash=${C}, to accept the core's.`)).toBe(true);
  });

  it("names the hash found, the one accepted, and how to accept the new one", () => {
    const stop = startHashDecision({ recorded: A, history: B, core: null, given: null });
    expect(stop.reason).toBe("refused");
    expect(stop.refusal?.message).toBe(
      `the public core's configuration hash is ${B}, and this private process last ran on ${A}, the one it accepted` +
        ": the public configuration changed since, so the public table items its modules read may no longer " +
        `be what it checked. To accept ${B}, start it with --update-hash=${B} (startProcess's updateHash): the start ` +
        "then runs its full checks of the public side and records the new hash",
    );
    const wrong = startHashDecision({ recorded: A, history: B, core: null, given: C });
    expect(wrong.refusal?.message).toContain(
      `be what it checked. The --update-hash given, ${C}, is not that hash, so nothing was accepted. To accept ${B}`,
    );
    expect(startHashDecision({ recorded: A, history: B, core: B, given: B })).toEqual({ refusal: null, record: B, reason: "accepted" });
    expect(startHashDecision({ recorded: null, history: null, core: null, given: B })).toEqual({ refusal: null, record: null, reason: "none" });
    // The core's hash alone (no history read): a first start records it, nothing compared.
    expect(startHashDecision({ recorded: null, history: null, core: C, given: null })).toEqual({ refusal: null, record: C, reason: "first-start" });
  });

  it("says how the running process learned the new hash, and how to accept it", () => {
    const tail =
      ", and it was " + `${A} when this private process started: the public core restarted with another ` +
      "configuration, so the public table items this process checked at its startup may no longer be what it " +
      "reads, and it halts before it processes another height; ";
    expect(publicConfigChanged(A, B, "transport").message).toBe(
      `a message of the core at coreTransport carries the configuration hash ${B}${tail}to accept ${B}, start it again ` +
        `with --update-hash=${B}: the start checks the public side again and records it (a start without it stops)`,
    );
    expect(publicConfigChanged(A, null, "public-database").message).toBe(
      "the public configuration history, read again at a reconnection to the public database, hashes to null" +
        `${tail}start it again, which checks the public side again`,
    );
    expect(publicConfigChanged(A, B, "public-database").details).toEqual({ recorded: A, found: B, via: "public-database" });
  });
});
