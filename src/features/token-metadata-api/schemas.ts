/**
 * The shapes of `token-metadata-api`'s one route, `POST /token-metadata-api/v1/tokens`, as TypeBox schemas: the request
 * body (one of four selectors), the answer, and the error. The router validates every request against
 * {@link TokensRequest} and every answer against {@link TokensResponse}, and the TypeScript types come from the same
 * schemas, so the handler cannot return a shape the documentation does not describe.
 */

import Type from "typebox";

/** The most colors one request may carry. */
export const MAX_COLORS = 100;
/** A page of a contract's tokens: at most this many, `DEFAULT_LIMIT` unless the request says. */
export const MAX_LIMIT = 500;
export const DEFAULT_LIMIT = 100;
/** The most defined fields served per token, in key byte order; `fieldsTruncated` says when a token has more. */
export const MAX_TOKEN_FIELDS = 256;
/** The most rejection reasons and unresolved positions listed in a mark (all are counted). */
export const MAX_MARK_REASONS = 100;
export const MAX_MARK_UNRESOLVED = 100;
/** The most members listed in a symbol group (all are counted in `memberCount`). */
export const MAX_GROUP_MEMBERS = 100;

/** 32 bytes as 64 lowercase hex digits, no `0x`. */
export const Hex32 = Type.String({ pattern: "^[0-9a-f]{64}$", description: "32 bytes as 64 lowercase hex digits" });
/** A token's kind: 1 shielded UTXO, 2 unshielded UTXO, 3 contract token. */
export const Kind = Type.Union([Type.Literal(1), Type.Literal(2), Type.Literal(3)]);

const strict = { additionalProperties: false } as const;

/**
 * A contract page's cursor, as JSON inside the opaque base64url text the answer's `nextCursor` gives: the contract it
 * pages (`c`) and the last (domainSep, kind) it gave (`k`).
 */
export const ContractCursor = Type.Object({ c: Hex32, k: Type.Tuple([Hex32, Kind]) }, strict);
export type ContractCursor = Type.Static<typeof ContractCursor>;

/**
 * The request body: exactly one of four selectors.
 * - `{ colors }`: the described kind 1 and 2 tokens of each color (a color covers both kinds), up to {@link MAX_COLORS}.
 * - `{ contract, limit?, cursor? }`: a contract's described tokens, a page at a time.
 * - `{ contract, domainSep }`: the described kinds of one token.
 * - `{ contract, domainSep, kind }`: one token.
 */
export const TokensRequest = Type.Union([
  Type.Object({ colors: Type.Array(Hex32, { minItems: 1, maxItems: MAX_COLORS }) }, strict),
  Type.Object(
    {
      contract: Hex32,
      limit: Type.Optional(Type.Integer({ minimum: 1, maximum: MAX_LIMIT })),
      cursor: Type.Optional(Type.String({ pattern: "^[A-Za-z0-9_-]{1,2048}$" })),
    },
    strict,
  ),
  Type.Object({ contract: Hex32, domainSep: Hex32 }, strict),
  Type.Object({ contract: Hex32, domainSep: Hex32, kind: Kind }, strict),
]);
export type TokensRequest = Type.Static<typeof TokensRequest>;

const Bytes = Type.Object({ hex: Type.String(), utf8: Type.Union([Type.String(), Type.Null()]) }, strict);

/** One served field: hex always; a text view for the text types, an integer view for type 2. */
export const Field = Type.Object(
  {
    key: Bytes,
    valType: Type.Integer({ minimum: 0, maximum: 5 }),
    valTypeName: Type.String(),
    value: Type.Object({ hex: Type.String(), text: Type.Optional(Type.String()), integer: Type.Optional(Type.String()) }, strict),
    usable: Type.Union([Type.Boolean(), Type.Null()]),
    updatedAt: Type.Object(
      { height: Type.Integer(), txIndex: Type.Integer(), eventIndex: Type.Integer(), record: Type.Integer() },
      strict,
    ),
  },
  strict,
);
export type Field = Type.Static<typeof Field>;

const Position = Type.Object({ height: Type.Integer(), txIndex: Type.Integer(), eventIndex: Type.Integer() }, strict);

export const Mark = Type.Object(
  {
    mark: Type.Union([Type.Literal("ok"), Type.Literal("partial"), Type.Literal("incorrect"), Type.Literal("unresolved"), Type.Literal("none")]),
    reasons: Type.Array(Type.String()),
    reasonCount: Type.Integer(),
    unresolved: Type.Object({ count: Type.Integer(), positions: Type.Array(Position) }, strict),
    missing: Type.Array(Type.String()),
    tags: Type.Array(Type.String()),
  },
  strict,
);
export type Mark = Type.Static<typeof Mark>;

export const Common = Type.Object(
  {
    name: Type.Union([Type.String(), Type.Null()]),
    symbol: Type.Union([Type.String(), Type.Null()]),
    decimals: Type.Union([Type.String(), Type.Null()]),
    standards: Type.Union([Type.Array(Type.String()), Type.Null()]),
  },
  strict,
);
export type Common = Type.Static<typeof Common>;

export const Group = Type.Object(
  { symbol: Bytes, memberCount: Type.Integer(), members: Type.Array(Type.Object({ domainSep: Hex32, kind: Kind }, strict)) },
  strict,
);
export type Group = Type.Static<typeof Group>;

export const Image = Type.Object({ url: Type.String(), status: Type.Literal("pending"), imageUrl: Type.Null() }, strict);
export type Image = Type.Static<typeof Image>;

export const KindName = Type.Union([Type.Literal("shielded-utxo"), Type.Literal("unshielded-utxo"), Type.Literal("contract-token")]);
export type KindName = Type.Static<typeof KindName>;

/** A token with every defined field (up to {@link MAX_TOKEN_FIELDS}), its common fields, group, mark and image. */
export const TokenJson = Type.Object(
  {
    contractAddress: Hex32,
    domainSep: Hex32,
    kind: Kind,
    kindName: KindName,
    color: Type.Union([Hex32, Type.Null()]),
    common: Common,
    fields: Type.Array(Field),
    fieldCount: Type.Integer({ minimum: 1 }),
    fieldsTruncated: Type.Boolean(),
    group: Type.Union([Group, Type.Null()]),
    mark: Mark,
    image: Type.Union([Image, Type.Null()]),
  },
  strict,
);
export type TokenJson = Type.Static<typeof TokenJson>;

/** The answer: the selected tokens, and for a contract's page the cursor of the next one (else `null`). */
export const TokensResponse = Type.Object({ items: Type.Array(TokenJson), nextCursor: Type.Union([Type.String(), Type.Null()]) }, strict);
export type TokensResponse = Type.Static<typeof TokensResponse>;

/** Every error the module answers: a code and a message that never echoes the input. */
export const ErrorBody = Type.Object({ error: Type.Object({ code: Type.String(), message: Type.String() }, strict) }, strict);
export type ErrorBody = Type.Static<typeof ErrorBody>;
