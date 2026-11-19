import { describe, expect, it } from "vitest";
import { z } from "zod";
import { bigintText } from "../../src/helpers/bigint-text.js";
import { MAX_CURSOR_LENGTH, pageCursor } from "../../src/helpers/page-cursor.js";
import { RouteError } from "../../src/modules/route.js";

/**
 * Page cursors (`src/helpers/page-cursor.ts`): the round trip, the text `decode` refuses, the length `encode` keeps
 * to, and what a cursor is not (a schema-valid value a client wrote is taken).
 */

const Key = z.strictObject({ c: z.string().regex(/^[0-9a-f]{4}$/), k: z.tuple([z.string(), z.int()]) });
const cursors = pageCursor(Key);
const b64 = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");

describe("page cursors", () => {
  it("give back the value they were made of, as base64url text without padding", () => {
    const value = { c: "abcd", k: ["é漢😀", 3] as [string, number] };
    const text = cursors.encode(value);
    expect(text).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(text).toBe(b64(value));
    expect(cursors.decode(text)).toEqual(value);
  });

  it("refuse text that is not a value of the schema with an invalid-request RouteError", () => {
    const good = cursors.encode({ c: "abcd", k: ["x", 1] });
    for (const text of [
      "",
      "not a cursor!",
      good.slice(0, -3),
      "A".repeat(MAX_CURSOR_LENGTH + 1),
      Buffer.from("not json").toString("base64url"),
      Buffer.from([0xff, 0xfe]).toString("base64url"),
      b64({ c: "abcd", k: ["x", 1], extra: 1 }),
      b64({ c: "ABCD", k: ["x", 1] }),
      b64({ c: "abcd", k: ["x", 1.5] }),
    ]) {
      let thrown: unknown;
      try {
        cursors.decode(text);
      } catch (error) {
        thrown = error;
      }
      expect(thrown, text).toBeInstanceOf(RouteError);
      const refused = thrown as RouteError;
      expect([refused.kind, refused.code, refused.message], text).toEqual(["invalid-argument", "invalid-request", "cursor: not a cursor of this route"]);
    }
  });

  it("are a position, not a permission: a value of the schema a client wrote itself is taken", () => {
    expect(cursors.decode(b64({ c: "ffff", k: ["anything", 99] }))).toEqual({ c: "ffff", k: ["anything", 99] });
  });

  it("never give text decode would refuse: a value whose text is too long throws at encode", () => {
    const wide = pageCursor(z.object({ k: z.string() }));
    const longest = wide.encode({ k: "x".repeat(1528) });
    expect(longest).toHaveLength(MAX_CURSOR_LENGTH);
    expect(wide.decode(longest)).toEqual({ k: "x".repeat(1528) });
    expect(() => wide.encode({ k: "x".repeat(1529) })).toThrow(RangeError);
    expect(() => wide.encode({ k: "x".repeat(300_000) })).toThrow(/^a page cursor is at most 2048 characters/);
  });

  it("refuse a value JSON does not write, at encode", () => {
    expect(() => pageCursor(z.string().optional()).encode(undefined)).toThrow(TypeError);
  });

  it("write and read the value with the schema: a bigint key is digits in the cursor", () => {
    const keys = pageCursor(z.strictObject({ below: bigintText() }));
    const text = keys.encode({ below: 18446744073709551616n });
    expect(text).toBe(b64({ below: "18446744073709551616" }));
    expect(keys.decode(text)).toEqual({ below: 18446744073709551616n });
    expect(() => keys.encode({ below: "1" } as never)).toThrow();
  });
});
