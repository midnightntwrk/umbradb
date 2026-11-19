/**
 * Page cursors for routes (`../modules/route.ts`): the opaque text a route gives as `nextCursor` and takes back to
 * answer the next page of a keyset read. A cursor is its value as JSON, in base64url without padding, so it travels in
 * a query parameter or a body unescaped.
 *
 * {@link pageCursor} takes a zod schema of the value (the last key a page gave, and whatever binds the cursor to its
 * request, such as the contract it pages). The value is written with the schema (`z.encode`) and read with it, so a key
 * beyond 2^53 is a `bigintText()` (`./bigint-text.ts`): a `bigint` to the route, digits in the cursor. `decode` refuses, with an `invalid-request` `RouteError`, text that is not
 * a value of that schema: truncated or malformed text, another route's cursor, a value outside the schema. Write the
 * schema with `z.strictObject` to refuse names it does not declare.
 *
 * A cursor is a position, never a permission: it is neither secret nor signed, so a client can write any value of the
 * schema and `decode` takes it. A route that binds a cursor to its request compares that part itself (`decode` cannot
 * know the request), and reads only what the request may read wherever the cursor points.
 *
 * Pure: base64url is written with `btoa`/`atob`, so it runs in the browser build too.
 */

import { z } from "zod";
import { invalidRequest } from "../modules/route.js";

/** The longest cursor text: `encode` gives none longer, and `decode` reads none longer. */
export const MAX_CURSOR_LENGTH = 2048;

const BASE64URL = /^[A-Za-z0-9_-]*$/;

function encode(text: string): string {
  let binary = "";
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const decode = (raw: string): string =>
  new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(raw.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)));

/** A page cursor of values of `schema`. */
export interface PageCursor<S extends z.ZodType = z.ZodType> {
  /**
   * The cursor text of `value`. Throws a `RangeError` for a value whose text is over {@link MAX_CURSOR_LENGTH}, and a
   * `TypeError` for `undefined`, which JSON does not write.
   */
  encode(value: z.output<S>): string;
  /** The value of a cursor `encode` gave, as the schema read it; other text throws an `invalid-request` `RouteError`. */
  decode(text: string): z.output<S>;
}

/** Page cursors of values of `schema` (see the module comment). */
export function pageCursor<S extends z.ZodType>(schema: S): PageCursor<S> {
  return Object.freeze({
    encode(value: z.output<S>): string {
      const json = JSON.stringify(z.encode(schema, value as never));
      if (json === undefined) throw new TypeError("a page cursor's value is JSON, and this one is undefined");
      const text = encode(json);
      if (text.length > MAX_CURSOR_LENGTH) {
        throw new RangeError(`a page cursor is at most ${MAX_CURSOR_LENGTH} characters, and this value's is ${text.length}: keep in a cursor only the last key of the page`);
      }
      return text;
    },
    decode(text: string): z.output<S> {
      let value: unknown;
      try {
        if (text.length === 0 || text.length > MAX_CURSOR_LENGTH || !BASE64URL.test(text)) throw new Error("not base64url");
        value = JSON.parse(decode(text));
      } catch {
        throw invalidRequest("cursor: not a cursor of this route");
      }
      const parsed = schema.safeParse(value);
      if (!parsed.success) throw invalidRequest("cursor: not a cursor of this route");
      return parsed.data;
    },
  });
}
