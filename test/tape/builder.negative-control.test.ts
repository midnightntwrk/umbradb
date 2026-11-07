import { beforeEach, describe, expect, it, vi } from "vitest";
import type * as Recording from "../../tools/tape/recording.js";
import { expectRecordReplayIdentical } from "./builder-checks.js";

/**
 * The committed negative controls of the record-and-replay check: wrong recording builders, each of which must make the
 * check `builder.test.ts` runs (`builder-checks.ts`, `expectRecordReplayIdentical`) fail. [A71]
 *
 * - **A builder that drops a notification** (the first one it sees is forwarded to the client but not recorded): the
 *   replayed session misses that frame, so the byte-identical comparison fails.
 * - **A builder that records params other than the client's** (an empty list for every request): the replayed
 *   requests match no record, the tape node answers `not-on-tape`, and the comparison fails at the first answer.
 *
 * `vi.mock` replaces the recorder of `tools/tape/recording.ts` (`SessionRecording`, which `tools/tape/builder.ts`
 * builds one of per connection) in this file's module graph only, by a subclass that misbehaves while
 * `variant.current` names it; with `variant.current = "real"` it is the real recorder, and the check passes in this
 * build too.
 */

type Variant = "real" | "drop-notification" | "other-params";

const variant = vi.hoisted(() => ({ current: "real" as Variant, dropped: false }));

vi.mock("../../tools/tape/recording.js", async (importOriginal) => {
  const actual = await importOriginal<typeof Recording>();
  class WrongRecording extends actual.SessionRecording {
    override request(...[id, method, params, text]: Parameters<Recording.SessionRecording["request"]>): void {
      super.request(id, method, variant.current === "other-params" ? [] : params, text);
    }

    override notification(...args: Parameters<Recording.SessionRecording["notification"]>): void {
      if (variant.current === "drop-notification" && !variant.dropped) {
        variant.dropped = true;
        return;
      }
      super.notification(...args);
    }
  }
  return { ...actual, SessionRecording: WrongRecording };
});

beforeEach(() => {
  variant.current = "real";
  variant.dropped = false;
});

/** What an assertion error compared. */
interface Failure {
  readonly actual: unknown;
  readonly expected: unknown;
}

/** The assertion error a check fails with; fails the test if the check passes or fails otherwise. */
async function assertionFailure(check: () => unknown): Promise<Failure> {
  try {
    await check();
  } catch (error) {
    if (error instanceof Error && error.name === "AssertionError") return error as unknown as Failure;
    throw error;
  }
  throw new Error("the check passed with a wrong builder");
}

describe("A71's check passes in this file's build with the real builder", { timeout: 60_000 }, () => {
  it("record and replay give byte-identical frames", async () => {
    await expectRecordReplayIdentical();
  });
});

describe("negative controls: each wrong builder fails A71's record-and-replay check", { timeout: 60_000 }, () => {
  it("a builder that drops a notification: the replay misses the frame the recording forwarded", async () => {
    variant.current = "drop-notification";
    const failure = await assertionFailure(expectRecordReplayIdentical);
    expect(variant.dropped).toBe(true);
    const notification =
      '{"jsonrpc":"2.0","method":"chain_finalizedHead","params":{"subscription":"f-1","result":{"number":"0x1"}}}';
    expect(failure.expected).toContain(notification);
    expect(failure.actual).not.toContain(notification);
  });

  it("a builder that records params other than the client's: the replay is answered not-on-tape", async () => {
    variant.current = "other-params";
    const failure = await assertionFailure(expectRecordReplayIdentical);
    expect(String((failure.actual as string[]).at(-1))).toContain('"message":"not-on-tape: chain_getBlockHash"');
    expect(failure.expected).toContain('{"jsonrpc":"2.0","id":2,"result":"0xa0"}');
  });
});
