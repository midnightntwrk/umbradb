/**
 * The shapes of `token-metadata-api`'s one route, `getTokens` (`GET /token-metadata-api/v1/tokens`), as zod schemas:
 * its input (the parameters of one of five selectors), its output, and the cursors of its pages. The core checks every input
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
/** A page of tokens: `DEFAULT_LIMIT` unless the request's `limit` says, and never more than `MAX_LIMIT`. */
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;
/** The most members listed in a symbol group (all are counted in `memberCount`). */
export const MAX_GROUP_MEMBERS = 100;

/** 32 bytes: `0x` and 64 lowercase hex digits. */
export const hash32 = () => hashHex().describe("32 bytes as 0x-prefixed lowercase hex");
/** A token's kind: 1 shielded UTXO, 2 unshielded UTXO, 3 contract token. */
export const Kind = z.union([z.literal(1), z.literal(2), z.literal(3)]).describe("1 shielded UTXO, 2 unshielded UTXO, 3 contract token");
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

/** The cursor of a page of every token: the last (contract, domainSep, kind) it gave (`a`). Neither cursor is the other's. */
export const AllCursor = z.strictObject({ a: z.tuple([hash32(), hash32(), Kind]) });
export type AllCursor = z.output<typeof AllCursor>;

/** One of the five selectors, as the handler takes it. */
export type TokensSelector =
  | { readonly limit?: number; readonly cursor?: string }
  | { readonly colors: readonly string[] }
  | { readonly contract: string; readonly limit?: number; readonly cursor?: string }
  | { readonly contract: string; readonly domainSep: string }
  | { readonly contract: string; readonly domainSep: string; readonly kind: Kind };

const COLOR_LIST = /^0x[0-9a-f]{64}(,0x[0-9a-f]{64})*$/;

/**
 * The input: the route is a `GET`, so its input is its parameters, each one text or a number. Together they are
 * exactly one of five selectors, which is what the handler takes ({@link TokensSelector}):
 * - no parameter, or `limit` and `cursor` alone: every described token, by (contract, domainSep, kind), a page at a
 *   time. A page holds {@link DEFAULT_LIMIT} tokens unless `limit` says, up to {@link MAX_LIMIT}.
 * - `colors`: the described kind 1 and 2 tokens of each color (a color covers both kinds). One parameter, the colors
 *   separated by commas, up to {@link MAX_COLORS}; given alone.
 * - `contract`, with `limit` and `cursor` or neither: a contract's described tokens, a page at a time.
 * - `contract` and `domainSep`: the described kinds of one token.
 * - `contract`, `domainSep` and `kind`: one token.
 *
 * A combination that is none of them is refused with a message that names the rule and nothing of the request.
 */
export const TokensRequest = z
  .strictObject({
    colors: z
      .string()
      .regex(COLOR_LIST, { error: "expected 32-byte hashes (0x and 64 lowercase hex digits each) separated by commas" })
      .refine((list) => list.length <= MAX_COLORS * 67 - 1, { error: `expected at most ${MAX_COLORS} colors` })
      .optional()
      .describe("colors as 0x-prefixed lowercase hex, separated by commas; given alone"),
    contract: hash32().optional(),
    domainSep: hash32().optional(),
    kind: Kind.optional(),
    limit: z.int().min(1).max(MAX_LIMIT).optional(),
    cursor: z
      .string()
      .regex(/^[A-Za-z0-9_-]{1,2048}$/, { error: "expected a cursor this route gave" })
      .optional(),
  })
  .transform((given, context): TokensSelector => {
    const refuse = (message: string): never => {
      context.addIssue({ code: "custom", message });
      return z.NEVER;
    };
    const { colors, contract, domainSep, kind, limit, cursor } = given;
    if (colors !== undefined) {
      if (Object.keys(given).length > 1) return refuse("colors is given alone");
      return { colors: colors.split(",") };
    }
    if (contract === undefined) {
      if (domainSep !== undefined || kind !== undefined) return refuse("domainSep and kind are given with contract");
      return { ...(limit === undefined ? {} : { limit }), ...(cursor === undefined ? {} : { cursor }) };
    }
    if (domainSep === undefined) {
      if (kind !== undefined) return refuse("kind is given with domainSep");
      return { contract, ...(limit === undefined ? {} : { limit }), ...(cursor === undefined ? {} : { cursor }) };
    }
    if (limit !== undefined || cursor !== undefined) return refuse("limit and cursor page a list of tokens: not given with domainSep");
    return kind === undefined ? { contract, domainSep } : { contract, domainSep, kind };
  });
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

/**
 * The six common fields of MIP-0018, each `null` when it has no usable value. `image` is the URI the contract published
 * and `imageSha256` the hash it published for the file there: nothing is fetched or checked here, so a client that
 * shows the image fetches it and compares its SHA-256 itself.
 */
export const Common = z.strictObject({
  name: z.string().nullable(),
  symbol: z.string().nullable(),
  decimals: uintValue().nullable(),
  standards: z.array(z.string()).nullable(),
  image: z.string().nullable(),
  imageSha256: hash32().nullable(),
});
export type Common = z.output<typeof Common>;

export const Group = z.strictObject({
  symbol: Bytes,
  memberCount: z.int(),
  members: z.array(z.strictObject({ domainSep: hash32(), kind: Kind })),
});
export type Group = z.output<typeof Group>;

export const KindName = z.enum(["shielded-utxo", "unshielded-utxo", "contract-token"]);
export type KindName = z.output<typeof KindName>;

/** A token with its fields (at most the six keys MIP-0018 defines, in key byte order), its common fields and its group. */
export const TokenJson = z.strictObject({
  contractAddress: hash32(),
  domainSep: hash32(),
  kind: Kind,
  kindName: KindName,
  color: hash32().nullable(),
  common: Common,
  fields: z.array(Field).min(1),
  group: Group.nullable(),
});
export type TokenJson = z.output<typeof TokenJson>;

/** The output: the selected tokens, and for a contract's page the cursor of the next one (else `null`). */
export const TokensResponse = z.strictObject({ items: z.array(TokenJson), nextCursor: z.string().nullable() });
export type TokensResponse = z.output<typeof TokensResponse>;
