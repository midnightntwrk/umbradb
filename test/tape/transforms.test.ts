import { describe, expect, it } from "vitest";
import {
  type CallRecord,
  checkTape,
  delayAnswers,
  dropNotifications,
  insertDisconnect,
  MAX_DELAY_MS,
  readTape,
  repeatNotification,
  replaceWithError,
  skipNotifications,
  spliceNotifications,
  stateUnavailable,
  stateUnavailableError,
  TapeError,
  type TapeRecord,
  tapeId,
  tapeText,
  TransformError,
  writeTape,
} from "../../tools/tape/index.js";
import { a71TapeText } from "./builder-checks.js";
import {
  baseRecords,
  expectedText,
  expectNotificationsAfterInsertedDisconnect,
  expectResubscriptionOnTape,
  expectVariantOutput,
  forkRecords,
  VARIANTS,
} from "./transform-checks.js";

/**
 * The transform half of the record-and-replay criterion: each variant transform produces the tape committed as its
 * expected output — the delay transform setting `delayMs` on exactly the selected calls —, each is a pure function from
 * records to records whose output is a tape (`checkTape`), and each refuses what it cannot do with `bad-transform` and
 * a reason. The base of every committed output is the recorded tape (24 lines, four sessions: lines 1–16, 17–22, 23,
 * 24). [A71 CI, TT-4; acceptance §9]
 */

/** What a transform throws, checked to be a `TransformError` with `reason`. */
function refusal(run: () => unknown, reason: string): TransformError {
  let caught: unknown;
  try {
    run();
  } catch (error) {
    caught = error;
  }
  expect(caught).toBeInstanceOf(TransformError);
  expect(caught).toMatchObject({ code: "bad-transform", reason });
  expect((caught as Error).message).toMatch(/^bad-transform: /);
  return caught as TransformError;
}

/** The lines (from 1) where two tapes' texts differ, when they have as many lines. */
function changedLines(before: readonly TapeRecord[], after: readonly TapeRecord[]): number[] {
  const a = tapeText(before).split("\n");
  const b = tapeText(after).split("\n");
  expect(b).toHaveLength(a.length);
  return a.flatMap((line, index) => (line === b[index] ? [] : [index + 1]));
}

const base = baseRecords();

describe("A71: each variant transform produces its committed expected output", () => {
  for (const variant of VARIANTS) {
    it(`${variant.name}: the committed fixtures/transforms/${variant.name}.tape.jsonl, byte for byte`, () => {
      expectVariantOutput(variant.name);
      const bytes = writeTape(variant.apply(base));
      expect(tapeId(bytes)).toBe(variant.id);
      expect(readTape(bytes).id).toBe(variant.id);
    });
  }

  it("their input is A71's recorded tape, which no transform changes", () => {
    expect(tapeText(base)).toBe(a71TapeText());
    for (const variant of VARIANTS) variant.apply(base);
    expect(tapeText(base)).toBe(a71TapeText());
    expect(expectedText("fork")).toBe(tapeText(forkRecords()));
  });

  it("each returns a new frozen list that is a tape, and leaves records it does not change as they were", () => {
    const thawed = base.map((record) => ({ ...record })) as TapeRecord[];
    for (const variant of VARIANTS) {
      const out = variant.apply(thawed);
      expect(out).not.toBe(thawed);
      expect(Object.isFrozen(out)).toBe(true);
      checkTape(out);
      expect(out).toContain(thawed[0]);
    }
    expect(tapeText(thawed)).toBe(a71TapeText());
  });

  it("transforms compose: a delay on a tape with an inserted disconnect", () => {
    const out = delayAnswers(insertDisconnect(base, { after: 12 }), { select: [5], delayMs: 7 });
    expect(out[4]).toEqual({ method: "chain_getFinalizedHead", params: [], result: "0xf1", delayMs: 7 });
    expect(out).toHaveLength(27);
  });

  it("each refuses records that are not a tape, with bad-tape-record at the first bad one", () => {
    const bad: TapeRecord[] = [{ notify: "x", result: 1 }];
    const runs: (() => unknown)[] = [
      () => dropNotifications(bad, { session: 1, subscription: "x", from: 1 }),
      () => skipNotifications(bad, { session: 1, subscription: "x", from: 1, count: 1 }),
      () => repeatNotification(bad, { session: 1, subscription: "x", nth: 1 }),
      () => insertDisconnect(bad, { after: 0 }),
      () => delayAnswers(bad, { select: [1], delayMs: 1 }),
      () => replaceWithError(bad, { select: [1], error: 1 }),
      () => stateUnavailable(bad, { select: [1] }),
      () =>
        spliceNotifications(bad, {
          session: 1,
          subscription: "x",
          from: 1,
          count: 1,
          source: { records: base, session: 1, subscription: 7, from: 1, count: 1 },
        }),
      () =>
        spliceNotifications(base, {
          session: 1,
          subscription: 7,
          from: 1,
          count: 1,
          source: { records: bad, session: 1, subscription: "x", from: 1, count: 1 },
        }),
    ];
    for (const run of runs) {
      expect(run).toThrow(TapeError);
      expect(run).toThrow("bad-tape-record at line 1: no subscribe record of this session has the id");
    }
  });
});

describe("delayAnswers: delayMs on exactly the selected calls", () => {
  it("sets delayMs on the calls at the selected lines and changes no other line", () => {
    const out = delayAnswers(base, { select: [5, 19], delayMs: 2000 });
    expect(changedLines(base, out)).toEqual([5, 19]);
    expect((out[4] as CallRecord).delayMs).toBe(2000);
    expect((out[18] as CallRecord).delayMs).toBe(2000);
    // Line 8 answers the same method and params as line 5: it is not selected, so it keeps no delay.
    expect(out[7]).toBe(base[7]);
  });

  it("selects by a test on each call record instead of lines", () => {
    const out = delayAnswers(base, {
      select: (record, line) => record.method === "chain_getFinalizedHead" && line > 5,
      delayMs: 5,
    });
    expect(changedLines(base, out)).toEqual([8, 24]);
    const seen: number[] = [];
    delayAnswers(base, {
      select: (record, line) => {
        seen.push(line);
        return "result" in record;
      },
      delayMs: 1,
    });
    // Only call records are offered to the test: not the subscriptions, notifications, fault or disconnects.
    expect(seen).toEqual([1, 2, 5, 6, 8, 9, 13, 19, 20, 21, 24]);
  });

  it("takes delays from 0 to 2^31 − 1 and replaces a delay already set", () => {
    expect((delayAnswers(base, { select: [2], delayMs: 0 })[1] as CallRecord).delayMs).toBe(0);
    expect((delayAnswers(base, { select: [2], delayMs: MAX_DELAY_MS })[1] as CallRecord).delayMs).toBe(MAX_DELAY_MS);
    const twice = delayAnswers(delayAnswers(base, { select: [2], delayMs: 3 }), { select: [2], delayMs: 4 });
    expect(twice[1]).toEqual({ method: "chain_getBlockHash", params: [0], result: "0xa0", delayMs: 4 });
  });

  it("refuses a delay outside 0 to 2^31 − 1, a line that is no call, and a selection of nothing", () => {
    for (const delayMs of [-1, MAX_DELAY_MS + 1, 1.5, Number.NaN]) {
      refusal(() => delayAnswers(base, { select: [2], delayMs }), "bad-argument");
    }
    expect(refusal(() => delayAnswers(base, { select: [3], delayMs: 1 }), "not-a-call").message).toContain(
      "line 3 is a subscribe record, not a call",
    );
    refusal(() => delayAnswers(base, { select: [15], delayMs: 1 }), "not-a-call");
    refusal(() => delayAnswers(base, { select: [16], delayMs: 1 }), "not-a-call");
    for (const line of [0, 25, 1.5]) refusal(() => delayAnswers(base, { select: [line], delayMs: 1 }), "no-such-line");
    refusal(() => delayAnswers(base, { select: [], delayMs: 1 }), "selects-nothing");
    refusal(() => delayAnswers(base, { select: () => false, delayMs: 1 }), "selects-nothing");
  });
});

describe("replaceWithError and stateUnavailable: an answer replaced by an error", () => {
  it("stateUnavailable answers as Substrate does for a discarded state, naming the call's block", () => {
    expect(stateUnavailableError("0xab")).toEqual({
      code: 4003,
      message: "Client error: UnknownBlock: State already discarded for 0xab",
    });
    const out = stateUnavailable(base, { select: [20, 9] });
    expect(changedLines(base, out)).toEqual([20]);
    const error = stateUnavailableError("0xf1");
    expect(out[19]).toEqual({ method: "state_getStorage", params: ["0x26aa", "0xf1"], error });
  });

  it("stateUnavailable takes the block when the call names none, and keeps a delay", () => {
    const out = stateUnavailable(delayAnswers(base, { select: [13], delayMs: 9 }), { select: [13, 2], block: "0xbb" });
    expect(out[12]).toEqual({
      method: "state_getMetadata",
      params: { at: "0xf2" },
      error: stateUnavailableError("0xbb"),
      delayMs: 9,
    });
    expect(out[1]).toEqual({ method: "chain_getBlockHash", params: [0], error: stateUnavailableError("0xbb") });
  });

  it("stateUnavailable refuses a call whose last parameter is not its block, without a block given", () => {
    for (const line of [1, 2, 13]) {
      expect(refusal(() => stateUnavailable(base, { select: [line] }), "no-block-hash").message).toContain(
        `line ${line}`,
      );
    }
  });

  it("replaceWithError replaces the result or the error of the selected calls by any JSON error", () => {
    const out = replaceWithError(base, { select: [9, 21], error: { code: -32000, data: [1n << 70n] } });
    expect(changedLines(base, out)).toEqual([9, 21]);
    expect(out[20]).toEqual({ method: "chain_getBlockHash", params: [0], error: { code: -32000, data: [1n << 70n] } });
    const error = { code: -32000, data: [1n << 70n] };
    expect(out[8]).toEqual({ method: "state_getStorage", params: ["0x26aa", "0xf2"], error });
    refusal(() => replaceWithError(base, { select: [2], error: { at: undefined } as never }), "bad-argument");
    refusal(() => replaceWithError(base, { select: [2], error: undefined as never }), "bad-argument");
    refusal(() => replaceWithError(base, { select: [10], error: 1 }), "not-a-call");
  });
});

describe("dropNotifications, skipNotifications, repeatNotification: a subscription's notifications", () => {
  it("drop removes every notification of the subscription from the from-th on, in its session only", () => {
    const out = dropNotifications(base, { session: 1, subscription: "f-1", from: 1 });
    expect(out).toHaveLength(21);
    expect(out.filter((record) => "notify" in record && record.notify === "f-1")).toEqual([]);
    expect(out).toContainEqual({ notify: "f-2", result: { number: "0x4" } });
    expect(dropNotifications(base, { session: 2, subscription: "f-2", from: 1 })).toHaveLength(23);
  });

  it("skip removes count notifications from the from-th, keeping the later ones", () => {
    const out = skipNotifications(base, { session: 1, subscription: "f-1", from: 1, count: 2 });
    expect(out.filter((record) => "notify" in record && record.notify === "f-1")).toEqual([
      { notify: "f-1", result: { number: "0x3" } },
    ]);
    expect(skipNotifications(base, { session: 1, subscription: 7, from: 2, count: 1 })).toHaveLength(23);
  });

  it("repeat sends the nth notification times more, right after it", () => {
    const out = repeatNotification(base, { session: 1, subscription: "f-1", nth: 3, times: 2 });
    expect(out.slice(11, 14)).toEqual([base[11], base[11], base[11]]);
    expect(out).toHaveLength(26);
  });

  it("tells subscription ids apart as JSON values: 7 and \"7\" in one session are two subscriptions", () => {
    const records: TapeRecord[] = [
      { subscribe: 7, method: "chain_subscribeNewHeads", params: [] },
      { subscribe: "7", method: "chain_subscribeFinalizedHeads", params: [] },
      { notify: 7, result: "number" },
      { notify: "7", result: "string" },
    ];
    expect(dropNotifications(records, { session: 1, subscription: 7, from: 1 })).toEqual([
      records[0],
      records[1],
      records[3],
    ]);
  });

  it("refuses a session, subscription or notification the tape lacks, and counts below 1", () => {
    for (const session of [0, 5, 1.5]) {
      refusal(() => dropNotifications(base, { session, subscription: "f-1", from: 1 }), "no-such-session");
    }
    for (const from of [0, 1.5, 4]) {
      refusal(() => dropNotifications(base, { session: 1, subscription: "f-1", from }), "no-such-notification");
    }
    // f-1 is subscribed in session 1 only; ids are compared as JSON values, so "7" is not 7.
    refusal(() => dropNotifications(base, { session: 2, subscription: "f-1", from: 1 }), "no-such-subscription");
    refusal(() => repeatNotification(base, { session: 1, subscription: "7", nth: 1 }), "no-such-subscription");
    expect(
      refusal(() => dropNotifications(base, { session: 1, subscription: "f-1", from: 4 }), "no-such-notification")
        .message,
    ).toContain('subscription "f-1" of session 1 has 3 notifications');
    for (const [from, count] of [
      [2, 3],
      [0, 1],
    ] as const) {
      refusal(() => skipNotifications(base, { session: 1, subscription: "f-1", from, count }), "no-such-notification");
    }
    refusal(() => skipNotifications(base, { session: 1, subscription: "f-1", from: 1, count: 0 }), "bad-argument");
    refusal(() => repeatNotification(base, { session: 1, subscription: 7, nth: 3 }), "no-such-notification");
    refusal(() => repeatNotification(base, { session: 1, subscription: 7, nth: 1, times: 0 }), "bad-argument");
  });
});

describe("insertDisconnect: a disconnect after a record, the live subscriptions made again", () => {
  it("re-subscribes each subscription live at the cut, in the order they were first made", () => {
    const out = insertDisconnect(base, { after: 4 });
    expect(out.slice(3, 7)).toEqual([
      base[3],
      { disconnect: true },
      { subscribe: "f-1", method: "chain_subscribeFinalizedHeads", params: [] },
      base[4],
    ]);
  });

  it("an outage: count disconnects, the subscriptions made again after the last", () => {
    const out = insertDisconnect(base, { after: 12, count: 3 });
    expect(out.slice(12, 17)).toEqual([
      { disconnect: true },
      { disconnect: true },
      { disconnect: true },
      { subscribe: "f-1", method: "chain_subscribeFinalizedHeads", params: [] },
      { subscribe: 7, method: "chain_subscribeNewHeads", params: [] },
    ]);
  });

  it("at the start, after a disconnect and at the end, no subscription is live", () => {
    expect(insertDisconnect(base, { after: 0 })[0]).toEqual({ disconnect: true });
    expect(insertDisconnect(base, { after: 16 }).slice(15, 18)).toEqual([base[15], { disconnect: true }, base[16]]);
    expect(insertDisconnect(base, { after: 24 }).slice(23)).toEqual([base[23], { disconnect: true }]);
    expect(insertDisconnect(base, { after: 18 }).slice(18, 20)).toEqual([
      { disconnect: true },
      { subscribe: "f-2", method: "chain_subscribeFinalizedHeads", params: [] },
    ]);
  });

  it("refuses a place outside the tape and counts below 1", () => {
    for (const after of [-1, 25, 0.5]) refusal(() => insertDisconnect(base, { after }), "no-such-line");
    for (const count of [0, 1.5]) refusal(() => insertDisconnect(base, { after: 1, count }), "bad-argument");
  });

  it("replays through the node client: it reconnects, subscribes again, receives the notifications after", async () => {
    await expectNotificationsAfterInsertedDisconnect();
  });

  it("replays through the node client with no notification after the cut: its new subscription is on it", async () => {
    await expectResubscriptionOnTape();
  });
});

describe("spliceNotifications: another tape's notifications for a range (a best-chain switch)", () => {
  const fork = forkRecords();
  const source = (from: number, count: number) => ({ records: fork, session: 1, subscription: "n-1", from, count });

  it("replaces the range one for one, under the target's id; extra source notifications follow the last", () => {
    const out = spliceNotifications(base, { session: 1, subscription: 7, from: 1, count: 2, source: source(2, 3) });
    expect(out[10]).toEqual({ notify: 7, result: { number: "0x3", fork: "b" } });
    expect(out[13]).toEqual({ notify: 7, result: { number: "0x4", fork: "b" } });
    expect(out[14]).toEqual({ notify: 7, result: { number: "0x5", fork: "b" } });
  });

  it("a shorter source removes the target's surplus; an equal one changes the range's lines only", () => {
    const target = { session: 1, subscription: "f-1" };
    const shorter = spliceNotifications(base, { ...target, from: 1, count: 3, source: source(1, 1) });
    expect(shorter.filter((record) => "notify" in record && record.notify === "f-1")).toEqual([
      { notify: "f-1", result: { number: "0x2", fork: "b" } },
    ]);
    expect(shorter[3]).toEqual({ notify: "f-1", result: { number: "0x2", fork: "b" } });
    expect(shorter).toHaveLength(22);
    const equal = spliceNotifications(base, { ...target, from: 2, count: 2, source: source(3, 2) });
    expect(changedLines(base, equal)).toEqual([7, 12]);
  });

  it("refuses a range either tape lacks", () => {
    refusal(
      () => spliceNotifications(base, { session: 1, subscription: 7, from: 1, count: 3, source: source(1, 1) }),
      "no-such-notification",
    );
    refusal(
      () => spliceNotifications(base, { session: 1, subscription: 7, from: 1, count: 1, source: source(2, 4) }),
      "no-such-notification",
    );
    refusal(
      () =>
        spliceNotifications(base, {
          session: 1,
          subscription: 7,
          from: 1,
          count: 1,
          source: { ...source(1, 1), session: 2 },
        }),
      "no-such-session",
    );
    refusal(
      () =>
        spliceNotifications(base, {
          session: 1,
          subscription: 7,
          from: 1,
          count: 1,
          source: { ...source(1, 1), subscription: 7 },
        }),
      "no-such-subscription",
    );
  });
});
