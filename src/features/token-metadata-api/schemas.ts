/**
 * The shapes of `token-metadata-api`'s one route, `getTokens` (`POST /token-metadata-api/v1/tokens`), as zod schemas:
 * its input (one of four selectors), its output, and the cursor of a contract's pages. The core checks every input
 * against {@link TokensRequest} and writes every output with {@link TokensResponse}, and the TypeScript types come
 * from the same schemas, so the handler cannot return a shape the documentation does not describe.
 *
 * - **Bytes** are text on both sides, `0x` and lowercase hex: a contract address, a domain separator and a color are
 *   32 bytes ({@link hash32}); a key and a value are of any length (`hexBytes()`).
 * - **Integers beyond 2^53** (a `UInt` value of up to 31 bytes, a height) are a `bigint` to the handler and digits in
 *   a string to a client (`uintText`).
 */

import { z } from "zod";
import { hashHex, hexBytes } from "../../config/core-settings.js";
import { uintText } from "../../helpers/bigint-text.js";
import { UINT_MAX_BYTES } from "../token-metadata/codec/index.js";

/** The most colors one request may carry. */
export const MAX_COLORS = 100;
/** A page of a contract's tokens: at most this many, `DEFAULT_LIMIT` unless the request says. */
export const MAX_LIMIT = 500;
export const DEFAULT_LIMIT = 100;
/** The most defined fields served per token, in key byte order; `fieldsTruncated` says when a token has more. */
export const MAX_TOKEN_FIELDS = 256;
/** The most members listed in a symbol group (all are counted in `memberCount`). */
export const MAX_GROUP_MEMBERS = 100;

/** 32 bytes: `0x` and 64 lowercase hex digits. */
export const hash32 = () => hashHex().describe("32 bytes as 0x-prefixed lowercase hex");
/** A token's kind: 1 shielded UTXO, 2 unshielded UTXO, 3 contract token. */
export const Kind = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type Kind = z.output<typeof Kind>;

/** A `UInt` value (MIP-0018 value type 2): up to 31 bytes, so 248 bits. */
const uintValue = () => uintText(8 * UINT_MAX_BYTES);
/** A block height. */
const height = () => uintText(64);

/**
 * A contract page's cursor, as JSON inside the opaque base64url text the output's `nextCursor` gives: the contract it
 * pages (`c`) and the last (domainSep, kind) it gave (`k`).
 */
export const ContractCursor = z.strictObject({ c: hash32(), k: z.tuple([hash32(), Kind]) });
export type ContractCursor = z.output<typeof ContractCursor>;

/**
 * The input: exactly one of four selectors.
 * - `{ colors }`: the described kind 1 and 2 tokens of each color (a color covers both kinds), up to {@link MAX_COLORS}.
 * - `{ contract, limit?, cursor? }`: a contract's described tokens, a page at a time.
 * - `{ contract, domainSep }`: the described kinds of one token.
 * - `{ contract, domainSep, kind }`: one token.
 */
export const TokensRequest = z.union([
  z.strictObject({ colors: z.array(hash32()).min(1).max(MAX_COLORS) }),
  z.strictObject({
    contract: hash32(),
    limit: z.int().min(1).max(MAX_LIMIT).optional(),
    cursor: z
      .string()
      .regex(/^[A-Za-z0-9_-]{1,2048}$/, { error: "expected a cursor this route gave" })
      .optional(),
  }),
  z.strictObject({ contract: hash32(), domainSep: hash32() }),
  z.strictObject({ contract: hash32(), domainSep: hash32(), kind: Kind }),
]);
export type TokensRequest = z.output<typeof TokensRequest>;

const Bytes = z.strictObject({ hex: hexBytes(), utf8: z.string().nullable() });

/** One served field: hex always; a text view for the text types, an integer view for type 2. */
export const Field = z.strictObject({
  key: Bytes,
  valType: z.int().min(0).max(5),
  valTypeName: z.string(),
  value: z.strictObject({ hex: hexBytes(), text: z.string().optional(), integer: uintValue().optional() }),
  usable: z.boolean().nullable(),
  updatedAt: z.strictObject({ height: height(), txIndex: z.int(), eventIndex: z.int(), record: z.int() }),
});
export type Field = z.output<typeof Field>;

export const Common = z.strictObject({
  name: z.string().nullable(),
  symbol: z.string().nullable(),
  decimals: uintValue().nullable(),
  standards: z.array(z.string()).nullable(),
});
export type Common = z.output<typeof Common>;

export const Group = z.strictObject({
  symbol: Bytes,
  memberCount: z.int(),
  members: z.array(z.strictObject({ domainSep: hash32(), kind: Kind })),
});
export type Group = z.output<typeof Group>;

export const Image = z.strictObject({ url: z.string(), status: z.literal("pending"), imageUrl: z.null() });
export type Image = z.output<typeof Image>;

export const KindName = z.enum(["shielded-utxo", "unshielded-utxo", "contract-token"]);
export type KindName = z.output<typeof KindName>;

/** A token with every defined field (up to {@link MAX_TOKEN_FIELDS}), its common fields, group and image. */
export const TokenJson = z.strictObject({
  contractAddress: hash32(),
  domainSep: hash32(),
  kind: Kind,
  kindName: KindName,
  color: hash32().nullable(),
  common: Common,
  fields: z.array(Field),
  fieldCount: z.int().min(1),
  fieldsTruncated: z.boolean(),
  group: Group.nullable(),
  image: Image.nullable(),
});
export type TokenJson = z.output<typeof TokenJson>;

/** The output: the selected tokens, and for a contract's page the cursor of the next one (else `null`). */
export const TokensResponse = z.strictObject({ items: z.array(TokenJson), nextCursor: z.string().nullable() });
export type TokensResponse = z.output<typeof TokensResponse>;
