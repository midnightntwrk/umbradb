import { beforeEach, describe, expect, it, vi } from "vitest";
import type * as Select from "../../tools/tape/select.js";
import { TapeError } from "../../tools/tape/index.js";
import {
  expectNotificationsAfterInsertedDisconnect,
  expectResubscriptionOnTape,
  expectVariantOutput,
} from "./transform-checks.js";

/**
 * The committed negative controls of the transform checks: wrong transforms, each of which must make the checks
 * `transforms.test.ts` runs (`transform-checks.ts`) fail. [A71]
 *
 * - **A delay transform that sets `delayMs` on an unselected call** (every call of a selected call's method and
 *   params, as a transform selecting by pair instead of by line would): the committed `delay` output differs at line 8.
 * - **An "insert a disconnect" that does not subscribe again** in the next session: with notifications after the cut,
 *   its output is no tape (`unknown-subscription`); with none, the node client's new subscription is `not-on-tape`
 *   and its subscriber hears an error instead of `restarted`; and the committed `disconnect` output is no tape.
 *
 * `vi.mock` replaces the selection helpers of `tools/tape/select.ts`, which `tools/tape/transforms.ts` calls, in this
 * file's module graph only; with `variant.current = "real"` each calls the real one, and every check passes in this
 * build too.
 */

type Variant = "real" | "delay-by-pair" | "no-resubscribe";

const variant = vi.hoisted(() => ({ current: "real" as Variant }));

vi.mock("../../tools/tape/select.js", async (importOriginal) => {
  const actual = await importOriginal<typeof Select>();
  // Not through `index.js`, which imports this very module (the factory would wait for itself).
  const { recordKind } = await import("../../tools/tape/records.js");
  const { requestKey } = await import("../../tools/tape/session.js");
  const selectedCalls: typeof actual.selectedCalls = (records, select) => {
    const lines = actual.selectedCalls(records, select);
    if (variant.current !== "delay-by-pair") return lines;
    const keyOf = (line: number) => {
      const record = records[line - 1] as unknown as { method: string; params: never };
      return requestKey(record.method, record.params);
    };
    const keys = new Set([...lines].map(keyOf));
    const widened = new Set(lines);
    records.forEach((record, index) => {
      if (recordKind(record) === "call" && keys.has(keyOf(index + 1))) widened.add(index + 1);
    });
    return widened;
  };
  const liveSubscriptions: typeof actual.liveSubscriptions = (records, after) =>
    variant.current === "no-resubscribe" ? [] : actual.liveSubscriptions(records, after);
  return { ...actual, selectedCalls, liveSubscriptions };
});

beforeEach(() => {
  variant.current = "real";
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
  throw new Error("the check passed with a wrong transform");
}

describe("the transform checks pass in this file's build with the real transforms", { timeout: 60_000 }, () => {
  it("the delay and disconnect outputs, and the disconnect's replays", async () => {
    expectVariantOutput("delay");
    expectVariantOutput("disconnect");
    await expectNotificationsAfterInsertedDisconnect();
    await expectResubscriptionOnTape();
  });
});

describe("negative controls: each wrong transform fails its check", { timeout: 60_000 }, () => {
  it("a delay transform setting delayMs on an unselected call fails the committed delay output", async () => {
    variant.current = "delay-by-pair";
    const failure = await assertionFailure(() => expectVariantOutput("delay"));
    const line8 = (text: unknown) => String(text).split("\n")[7];
    const delayed = '{"method":"chain_getFinalizedHead","params":[],"result":"0xf2","delayMs":2000}';
    expect(line8(failure.actual)).toBe(delayed);
    expect(line8(failure.expected)).toBe('{"method":"chain_getFinalizedHead","params":[],"result":"0xf2"}');
  });

  it("an insert-a-disconnect that does not subscribe again fails its replay and its committed output", async () => {
    variant.current = "no-resubscribe";
    const error = await expectNotificationsAfterInsertedDisconnect().catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(TapeError);
    expect(error).toMatchObject({ reason: "unknown-subscription", line: 5 });
    const failure = await assertionFailure(expectResubscriptionOnTape);
    expect([failure.actual, failure.expected]).toEqual([
      ["header 1", "error node-error"],
      ["header 1", "restarted"],
    ]);
    // The committed output's cut has notifications after it too: the wrong output is no tape at all.
    expect(() => expectVariantOutput("disconnect")).toThrow(
      "bad-tape-record at line 15: no subscribe record of this session has the id 7",
    );
  });
});
