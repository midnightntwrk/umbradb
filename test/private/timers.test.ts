import { describe, expect, it } from "vitest";
import { unrefTimer } from "../../src/private/timers.js";

/**
 * The process transport's timers: `unrefTimer` lets a Node.js timer not keep the process alive, and does
 * nothing to a browser worker's timer, which is a number (`src/private/timers.ts`).
 */
describe("unrefTimer", () => {
  it("unrefs a Node.js timer, and leaves a browser's number and an absent timer alone", () => {
    const timer = setTimeout(() => undefined, 60_000);
    expect(timer.hasRef()).toBe(true);
    unrefTimer(timer);
    expect(timer.hasRef()).toBe(false);
    clearTimeout(timer);
    expect(() => unrefTimer(17)).not.toThrow();
    expect(() => unrefTimer(undefined)).not.toThrow();
    expect(() => unrefTimer(null)).not.toThrow();
  });
});
