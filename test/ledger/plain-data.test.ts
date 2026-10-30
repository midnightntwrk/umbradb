import { describe, expect, it } from "vitest";
import { plainDataProblem } from "../../src/ledger/plain-data.js";
import { NETWORK_ID, RAW } from "./adapter-fixtures.js";

// What may leave the ledger worker: plain data that a structured clone carries unchanged. And what may not: above all
// a ledger package's object, which a structured clone copies as a plain object holding a pointer into the package's
// memory. [LG-7, LG-17, Q49; design §5.5]

describe("plain data (task 12.6; LG-17)", () => {
  it("accepts the protocol's plain data, nested, shared, frozen", () => {
    const shared = { a: 1 };
    const values: unknown[] = [
      undefined,
      null,
      true,
      0,
      -0,
      Number.NaN,
      2n ** 70n,
      "text",
      [],
      {},
      Object.create(null),
      Uint8Array.of(1, 2, 3),
      Object.freeze({ hash: new Uint8Array(32), segments: Object.freeze([{ calls: [], deploys: [{ address: Uint8Array.of(9) }] }]) }),
      [shared, shared, [[["deep"]]]],
      { "not an identifier": [1n, "x", null] },
    ];
    values.forEach((value, i) => expect(plainDataProblem(value), `value ${i}`).toBeNull());
  });

  it("refuses a ledger package's object, by its class and where it is", () => {
    const state = RAW.v9.LedgerState.blank(NETWORK_ID);
    try {
      // What a structured clone alone would let through: a plain object holding the pointer.
      expect(Object.getPrototypeOf(structuredClone(state))).toBe(Object.prototype);
      expect(plainDataProblem(state)).toBe("an object of the class LedgerState at $");
      expect(plainDataProblem({ results: [{ state }] })).toBe("an object of the class LedgerState at $.results[0].state");
      expect(plainDataProblem({ "a b": state })).toBe('an object of the class LedgerState at $["a b"]');
    } finally {
      (state as unknown as { free(): void }).free();
    }
  });

  it("refuses functions, symbols, other classes, typed arrays other than Uint8Array, symbol keys and cycles", () => {
    class Point {
      x = 1;
    }
    const cycle: Record<string, unknown> = {};
    cycle.self = cycle;
    const cases: [unknown, string][] = [
      [() => 1, "a function at $"],
      [Symbol("s"), "a symbol at $"],
      [{ f: () => 1 }, "a function at $.f"],
      [new Point(), "an object of the class Point at $"],
      [new Map(), "an object of the class Map at $"],
      [new Set([1]), "an object of the class Set at $"],
      [new Date(0), "an object of the class Date at $"],
      [new Uint16Array(2), "an object of the class Uint16Array at $"],
      [Buffer.from("ab"), "an object of the class Buffer at $"],
      [[1, new Point()], "an object of the class Point at $[1]"],
      [{ [Symbol("k")]: 1 }, "an object with symbol keys at $"],
      [cycle, "a cycle at $.self"],
      [Object.setPrototypeOf([1], null), "an object that is not plain at $"],
    ];
    for (const [value, problem] of cases) expect(plainDataProblem(value), problem).toBe(problem);
  });

  it("refuses a value whose structured clone is not the same value", () => {
    const sneaky = {};
    Object.defineProperty(sneaky, "hidden", { value: 1, enumerable: false });
    // An own accessor whose value changes between reads: the clone keeps the one it read.
    let reads = 0;
    const changing = {};
    Object.defineProperty(changing, "n", { get: () => (reads += 1), enumerable: true });
    expect(plainDataProblem(sneaky)).toBeNull();
    expect(plainDataProblem(changing)).toBe("a value its structured clone does not keep, at $.n");
  });
});
