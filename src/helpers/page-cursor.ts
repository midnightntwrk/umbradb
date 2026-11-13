/**
 * Page cursors for typed routes (`./typed-routes.ts`): the opaque text a route gives as `nextCursor` and takes back to
 * answer the next page of a keyset read. A cursor is its value as JSON, in base64url without padding, so it travels in
 * a query parameter or a body unescaped.
 *
 * {@link pageCursor} takes a TypeBox schema of the value (the last key a page gave, and whatever binds the cursor to
 * its request, such as the contract it pages). `decode` refuses, with 400 `invalid-request`, text that is not a cursor
 * of that schema: forged or truncated text, another route's cursor, a value outside the schema. A route that binds a
 * cursor to its request still compares that part itself (`decode` cannot know the request).
 *
 * Pure: base64url is written with `btoa`/`atob`, so it runs in the browser build too.
 */

import type { Static, TSchema } from "typebox";
import Value from "typebox/value";
import { invalidRequest } from "./typed-routes.js";

/** The longest cursor text `decode` reads. */
export const MAX_CURSOR_LENGTH = 2048;

const BASE64URL = /^[A-Za-z0-9_-]*$/;

const encode = (text: string): string =>
  btoa(String.fromCharCode(...new TextEncoder().encode(text)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const decode = (raw: string): string =>
  new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(raw.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)));

/** A page cursor of values of `schema`. */
export interface PageCursor<S extends TSchema = TSchema> {
  /** The cursor text of `value`. */
  encode(value: Static<S>): string;
  /** The value of a cursor `encode` gave; anything else throws a 400 `invalid-request` `RouteError`. */
  decode(text: string): Static<S>;
}

/** Page cursors of values of `schema` (see the module comment). */
export function pageCursor<S extends TSchema>(schema: S): PageCursor<S> {
  return Object.freeze({
    encode: (value: Static<S>) => encode(JSON.stringify(value)),
    decode(text: string): Static<S> {
      let value: unknown;
      try {
        if (text.length === 0 || text.length > MAX_CURSOR_LENGTH || !BASE64URL.test(text)) throw new Error("not base64url");
        value = JSON.parse(decode(text));
      } catch {
        throw invalidRequest("cursor: not a cursor this route issued");
      }
      if (!Value.Check(schema, value)) throw invalidRequest("cursor: not a cursor this route issued");
      return value;
    },
  });
}
