import { beforeEach, describe, expect, it, vi } from "vitest";
import type * as Records from "../../tools/tape/records.js";
import type * as Rules from "../../tools/tape/rules.js";
import {
  expectAnswersByOccurrence,
  expectDelayHonoured,
  expectGoldenRoundTrip,
  expectNotificationsAfterCalls,
} from "./checks.js";

/**
 * The committed negative controls of A68, A69 and A70 (task 9.1): wrong tape tools, each of which must make the checks
 * `format.test.ts` and `node.test.ts` run (`checks.ts`) fail.
 *
 * - **A writer that orders a record's fields otherwise** (alphabetically): the committed tape is not what it writes,
 *   so A68's byte-for-byte round trip fails.
 * - **A tape node that answers by first match** instead of by occurrence: four calls get A, A, A, A, not A, B, C, C.
 * - **A tape node that ignores `delayMs`**, and **one that delays the next record too** (a delay carried on to the
 *   answers after it, as a node answering from one queue would): A69's delay check fails either way.
 * - **A tape node that delivers a notification before the calls recorded ahead of it** have been answered (it lets
 *   its walk through the session pass call records not yet answered): A70's check fails.
 *
 * `vi.mock` replaces the rule functions of `tools/tape/rules.ts` and the line writer of `tools/tape/records.ts`
 * (`recordLine`, which the reader and writer of `tools/tape/tape.ts` call) in this file's module graph only; with
 * `variant.current = "real"` each calls the real one, and every check passes in this build too.
 */

type Variant = "real" | "reordering-writer" | "first-match" | "no-delay" | "delay-carried" | "notify-early";

const variant = vi.hoisted(() => ({ current: "real" as Variant, carried: 0 }));

vi.mock("../../tools/tape/records.js", async (importOriginal) => {
  const actual = await importOriginal<typeof Records>();
  const { jsonText } = await import("../../tools/tape/json.js");
  const recordLine: typeof actual.recordLine = (value, line) => {
    if (variant.current !== "reordering-writer") return actual.recordLine(value, line);
    actual.checkRecord(value, line);
    const values = value as Record<string, unknown>;
    const fields = Object.keys(values).sort();
    return `{${fields.map((field) => `${JSON.stringify(field)}:${jsonText(values[field])}`).join(",")}}`;
  };
  return { ...actual, recordLine };
});

vi.mock("../../tools/tape/rules.js", async (importOriginal) => {
  const actual = await importOriginal<typeof Rules>();
  const entryFor: typeof actual.entryFor = (entries, occurrence) =>
    actual.entryFor(entries, variant.current === "first-match" ? 1 : occurrence);
  const answerDelay: typeof actual.answerDelay = (record) => {
    const delay = actual.answerDelay(record);
    if (variant.current === "no-delay") return 0;
    if (variant.current !== "delay-carried") return delay;
    variant.carried = Math.max(variant.carried, delay);
    return variant.carried;
  };
  const mayPass: typeof actual.mayPass = (entry, consumed) =>
    (variant.current === "notify-early" && entry.kind === "call") || actual.mayPass(entry, consumed);
  return { ...actual, entryFor, answerDelay, mayPass };
});

beforeEach(() => {
  variant.current = "real";
  variant.carried = 0;
});

describe("the tape checks pass in this file's build with the real tools", { timeout: 60_000 }, () => {
  it("A68's round trip", () => {
    expectGoldenRoundTrip();
  });

  it("A69's occurrence and delay checks", async () => {
    await expectAnswersByOccurrence();
    await expectDelayHonoured();
  });

  it("A70's notification check", async () => {
    await expectNotificationsAfterCalls();
  });
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
    if (error instanceof Error && error.name === "AssertionError") {
      return error as unknown as Failure;
    }
    throw error;
  }
  throw new Error("the check passed with a wrong tool");
}

describe("negative controls: each wrong tool fails its check", { timeout: 60_000 }, () => {
  it("a writer that orders the fields otherwise breaks A68's byte round trip", async () => {
    variant.current = "reordering-writer";
    const failure = await assertionFailure(expectGoldenRoundTrip);
    expect(String(failure.actual)).toContain('{"delayMs":2000,"method":"chain_getFinalizedHead","params":[],"result"');
    expect(String(failure.expected)).toContain('{"method":"chain_getFinalizedHead","params":[],"result"');
  });

  it("a tape node answering by first match fails A69's occurrence check", async () => {
    variant.current = "first-match";
    const failure = await assertionFailure(expectAnswersByOccurrence);
    expect([failure.actual, failure.expected]).toEqual([
      ["A", "A", "A", "A"],
      ["A", "B", "C", "C"],
    ]);
  });

  it("a tape node ignoring delayMs fails A69's delay check: the delayed answer came at once", async () => {
    variant.current = "no-delay";
    const failure = await assertionFailure(expectDelayHonoured);
    expect([failure.actual, failure.expected]).toEqual([true, false]);
  });

  it("a tape node delaying the next record too fails A69's delay check: the next answer was late", async () => {
    variant.current = "delay-carried";
    const failure = await assertionFailure(expectDelayHonoured);
    expect([failure.actual, failure.expected]).toEqual([false, true]);
  });

  it("a tape node delivering a notification before the calls ahead of it fails A70's check", async () => {
    variant.current = "notify-early";
    const failure = await assertionFailure(expectNotificationsAfterCalls);
    expect(failure.expected).toEqual([]);
    expect((failure.actual as { params: { result: unknown } }[]).map((frame) => frame.params.result)).toEqual([1, 2]);
  });
});
