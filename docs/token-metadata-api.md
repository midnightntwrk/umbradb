# `token-metadata`'s `/v1` API

The read-only JSON API of the `token-metadata` module (MIP-0018 token metadata): its paths, parameters, JSON shapes,
errors, pagination and limits. A few fields and routes are not served yet ([Not served yet](#not-served-yet)). The
recorded answers on stagenet (`test/fixtures/mip0018-answers/`) are compared with the module's byte for byte, with those
fields masked (`test/features/token-metadata/stagenet.test.ts`).

Authority: [MIP-0018](https://github.com/midnightntwrk/midnight-improvement-proposals/blob/eb94bc182221cd937a84ed66a5f903b060f165ab/mips/mip-0018-on-chain-token-metadata.md)
at `eb94bc182221cd937a84ed66a5f903b060f165ab`, as merged from [PR #372](https://github.com/midnightntwrk/midnight-improvement-proposals/pull/372).

- Served on the module API (`listen.api`, or the page's worker in the browser build), registered by the module's
  `on-start-api`. Implementation: `src/features/token-metadata/api.ts`.
- Each answer is one read of the database at its latest committed height, so all its parts come from one state; the
  answer carries the core's `X-Umbra-View`, `X-Umbra-Height` and `X-Umbra-Hash`. Before block S commits, every route
  answers 503 `no-committed-height`.
- Everything served is untrusted: names, symbols, URIs and every other value are what a contract published. Show text
  as text, never as markup; never follow a URI without your own checks.

## General rules

| Rule | Meaning |
|---|---|
| Heights only | Positions are block heights and indexes; no wall-clock time is served. |
| Never fetches | The module never fetches a URI or any remote content: a type-4 URI value is served as text only, and an `image` is served with status `pending`. |
| Bytes | Every byte string is lowercase hex without `0x` (`"hex"`). A text view (`"text"` / `"utf8"`) is added only where the bytes are valid UTF-8 and the type says text; an integer view (`"integer"`, a decimal string) only for type-2 values. Values are never re-interpreted as another type (MIP "Value types"). |
| Lengths | `name` and `symbol` are served as their first 64 and 12 characters (grapheme clusters, UAX #29). The module stores them whole and cuts them when it serves them, so its stored rows do not depend on the platform's Unicode data; lists, details, groups and marks all use the cut value, and a cut value is usable. |
| No defaults | A common field that was never set, or whose current value is unusable, is `null` in `common`; no default such as 0 or 18 decimals. |
| Hostile text | Text is data. The JSON body is pure ASCII: every non-ASCII character (bidi controls, zero-width characters, …) and `<`, `>`, `&` are written as `\uXXXX` escapes; control characters are JSON escapes. Parsing the JSON gives the exact text back. |
| Defined keys only | A key is served only when it is defined (MIP "Keys"): a common-field key (`name`, `symbol`, `decimals`, `standards`, `image`, `image_sha256`). Every other key is stored but appears in no answer, and never makes an identity exist. |
| Not referenced after withdrawal | A token identity exists only while one of its defined fields has a value. Once its last field is deleted it is not referenced anywhere — listings, lookups, groups, the contract view — exactly as if it had never been described (404). A deleted field's earlier values are never served. |
| Events carry no values | `/v1/events` serves position, transaction, contract, classification and reason only — never an event's name, payload, header or values. Only MIP-0018-named events (`accept`, `reject`) and `unresolved` logs are stored and served; other `Misc` logs are not stored. |
| Marks | `mark` is decided by one function (`state.ts` `tokenMark`): `ok` usable `name`, `symbol` and `decimals`, no rejected MIP-0018 event and no unresolved log from the token's contract; `partial` one of the three missing or unusable; `incorrect` the contract has a rejected MIP-0018 event (reasons listed in chain order); `unresolved` the contract has no rejected event but has an `unresolved` log (reason `unresolved-log`); `none` no metadata and nothing against its contract. Precedence: `incorrect`, `unresolved`, then the identity's own fields. Usable `standards` identifiers are returned as `tags` (self-declared, never proof). Current state only. |
| Groups | Symbol groups as the MIP defines them: identities of one contract with the same usable (cut) `symbol` bytes; only groups of two or more members. |
| Bounded cost | How many keys an identity has, how many events a contract rejected and how many identities share a symbol are chosen by whoever calls the contract. No answer grows with them: list rows and marks read only the six common-field keys and a rejection count plus the first 100 reasons; an identity's fields come in keyset pages (`fieldCount` counts them); a group lists its first 100 members (`memberCount` counts them); at most 8 requests run at once (503 `BUSY` beyond, `Retry-After: 1`). One exception: a group whose served symbol is 12 characters long reads every symbol of its contract that starts with those characters (its members may have longer symbols). |
| NIGHT / DUST | Protocol tokens, outside MIP-0018; served as built-in rows with no mark. NIGHT's color is 32 zero bytes; DUST has no color. |

### Errors

An error the module gives is

```json
{ "error": { "code": "BAD_REQUEST", "message": "color must be 32 bytes as 64 hex digits" } }
```

| Status | `code` | When |
|---:|---|---|
| 400 | `BAD_REQUEST` | Malformed path value (hex length, kind not 1–3), unknown or empty query parameter, bad `limit`, a cursor this endpoint (and filter) did not issue, a missing required parameter |
| 404 | `NOT_FOUND` | The color, identity or contract is not known |
| 503 | `BUSY` | More requests are in progress than the module answers at once (8; header `Retry-After: 1`); refused before any database work |

The module API answers the rest with its own codes (lower case): a path no route has 404 `not-found`; a method other
than `GET` (`HEAD` included) 405 `method-not-allowed` with `Allow: GET`; a read past `apiReadTimeoutMs` 504
`query-timeout`; before block S 503 `no-committed-height`; anything else 500 `internal-error`, with a fixed message.
Messages name the parameter, never echo the input, and never carry internal details.

Input rules: `color`, `contract`/`address`, `domainSep` and `tx` are exactly 32 bytes = 64 hex digits (an optional `0x`
prefix and upper case are accepted); `kind` is `1`, `2` or `3`. A query parameter given twice reaches the module as its
first value.

### Pagination

Lists are keyset-paginated: `?limit=` (integer 1–500, default 100) and `?cursor=` (opaque; copy `nextCursor` from the
previous page). A page is `{ "items": [ … ], "nextCursor": "eyJlIjoidG9rZW5zIiwi…" }`; `nextCursor` is `null` on the
last page. A cursor is bound to its endpoint (and filter); any other string is a 400.

### Response headers

`content-type: application/json; charset=utf-8`, `cache-control: no-store`, `x-content-type-options: nosniff`,
`content-security-policy: default-src 'none'; frame-ancestors 'none'`, `referrer-policy: no-referrer`, and the core's
`x-umbra-view`, `x-umbra-height`, `x-umbra-hash` (and `x-umbra-version` on UmbraDB's own listener).

## Shared shapes

**Mark** — `{ "mark": "ok" | "partial" | "incorrect" | "unresolved" | "none", "reasons": ["reserved-valtype"], "reasonCount": 1, "unresolved": { "count": 0, "positions": [] }, "missing": ["decimals"], "tags": ["mip-0004"] }`.
`reasons` lists the first 100 rejection reasons of the contract in chain order, then `unresolved-log` when it has
unresolved logs; `reasonCount` counts all its rejected events; `unresolved` counts its unresolved logs and gives the
first 100 positions; `missing` names the unusable or absent common keys.

**Common** — the usable common fields only: `{ "name": "Acme Gold", "symbol": "AGLD", "decimals": "6", "standards": ["mip-0004"] }`
(each `null` when absent or unusable; `decimals` is a decimal string; `standards` the parsed list).

**Field** — one current field of an identity:

```json
{
  "key": { "hex": "6e616d65", "utf8": "name" },
  "valType": 1, "valTypeName": "utf8",
  "value": { "hex": "41636d6520476f6c64", "text": "Acme Gold" },
  "usable": true,
  "updatedAt": { "height": 714501, "txIndex": 0, "eventIndex": 0, "record": 0 }
}
```

`key.utf8` is `null` when the key is not valid UTF-8. `valTypeName`: 0 `bytes`, 1 `utf8`, 2 `uint`, 3 `json`, 4 `uri`
(never fetched). `usable` is `true`/`false` for the six common-field keys and `null` for any other key.
`updatedAt.eventIndex` is the log's position among its transaction's logs.

**Group** — `{ "symbol": { "hex": "414344", "utf8": "ACD" }, "memberCount": 3, "members": [ { "domainSep": "6d69…", "kind": 1 }, … ] }`:
the first 100 members by `(domainSep, kind)`; `memberCount` counts them all.

**TokenSummary** — one row of the token list:

```json
{
  "id": "identity/98a90519…7dcf/6d69702d…0000/3",
  "source": "identity",
  "kind": 3, "kindName": "contract-token",
  "color": null,
  "contractAddress": "98a90519419e2ebb514b7c6ce87ee7f6f4f9753d9ee6f533c5d1c25b9d437dcf",
  "domainSep": "6d69702d303031383a6578616d706c653a66756e6769626c6500000000000000",
  "name": "Acme Gold", "symbol": "AGLD", "decimals": "6",
  "described": true,
  "minted": null,
  "firstSeen": null, "evidence": [],
  "mark": { "mark": "ok", "reasons": [], "reasonCount": 0, "unresolved": { "count": 0, "positions": [] }, "missing": [], "tags": [] },
  "note": null,
  "image": null
}
```

`source` is `builtin` (NIGHT, DUST: `kind`, `contractAddress`, `domainSep` and `mark` `null`, a `note`) or `identity`
(a described identity). `kindName`: 1 `shielded-utxo`, 2 `unshielded-utxo` (with a color), 3 `contract-token` (no color).
`color` is the identity's computed color, `tokenType(domainSep, contractAddress)`, for kinds 1 and 2.

**Image** — the identity's usable `image` (a type-4 URI): `{ "url": "https://example.org/acme.png", "status": "pending", "imageUrl": null }`,
else `null`. `url` is plain text, never a link to follow.

**IdentityDetail** — one token identity:

```json
{
  "network": "stagenet",
  "contractAddress": "86acf80f…570f", "domainSep": "6d69702d…0000",
  "kind": 1, "kindName": "shielded-utxo",
  "color": "04239924…bc16",
  "minted": null,
  "described": true,
  "common": { "name": "Acme Dollar", "symbol": "ACD", "decimals": "2", "standards": null },
  "commonFields": [ Field, … ],
  "fields": [ Field, … ], "fieldCount": 3, "fieldsNextCursor": null,
  "group": { "symbol": { "hex": "414344", "utf8": "ACD" }, "memberCount": 3, "members": [ … ] },
  "mark": { … },
  "image": null
}
```

`fields` is one keyset page of the current defined fields in key byte order (default 100, `limit` up to 500);
`fieldCount` counts them all; `fieldsNextCursor` reads the next page (`null` on the last). `commonFields` are the
current rows of the common-field keys present, in the order they were last set. `network` is the network's name when
UmbraDB knows its genesis hash (`mainnet`, `preprod`, `preview`, `stagenet`), else the genesis hash.

## Endpoints

### `GET /v1/status`

```json
{
  "network": "stagenet",
  "genesisHash": "0x2f76825abc239fecf6107c9df99016de57037b451ae57a4394b76c8cf53a9491",
  "startHeight": 714486, "indexedHeight": 715183, "archiveHeight": 715183,
  "mip": { "id": "MIP-0018", "repository": "midnightntwrk/midnight-improvement-proposals", "commit": "eb94bc18…", "path": "…", "sha256": "…", "url": "…", "pr": "…" },
  "reference": { "repository": "https://github.com/midnight-experiments/mip-0018", "commit": "e8295792d9363be37ff2f7f716c740fcdf3f195e" },
  "scanner": "following",
  "unresolvedEvents": 0
}
```

`startHeight` is the database's S; `indexedHeight` and `archiveHeight` the committed height of the answer.

### `GET /v1/tokens?limit=&cursor=`

Page of TokenSummary: NIGHT, DUST, then the described identities by `(contractAddress, domainSep, kind)`.

### `GET /v1/tokens/{color}`

`{ "color", "builtin", "contractAddress", "domainSep", "firstSeen": null, "evidence": [], "identities": [ IdentityDetail, … ], "related": [ { "contractAddress", "domainSep", "kind": 3 } ] }`.
NIGHT's color answers `builtin`. Another color answers the described identities of kinds 1 and 2 whose computed color
it is, and the pair's other described kinds in `related`; a color no described identity has is 404.

### `GET /v1/identities/{contract}/{domainSep}/{kind}?limit=&cursor=`

IdentityDetail with one page of its fields (a cursor of another identity is a 400). 404 when the identity is not
described, a withdrawn one included.

### `GET /v1/contracts/{address}/tokens?limit=&cursor=`

`{ "contractAddress", "groups": [ Group, … ], "items": [ TokenSummary, … ], "nextCursor" }`: the contract's described
identities by `(domainSep, kind)`, and the groups of the identities on this page. 404 when the module saw neither an
event nor a field of the contract.

### `GET /v1/lookup/{color}?held=shielded|unshielded`

MIP "Lookup": the kind is given by the holding (`shielded` → 1, `unshielded` → 2). `held` is required.

| `result` | When |
|---|---|
| `identity` | the described identity of the held kind whose computed color is `color` (`identity` filled) |
| `builtin` | NIGHT's zero color held unshielded |
| `shielded-zero-color` | the zero color held shielded (`found: false`): the ledger's default shielded token type, never a contract's color |
| `not-minted-in-indexed-range` | no described identity of the held kind has this color (`found: false`) |

`indexedRange` is `{ from: S, to: the committed height }`; `seen` is always `null`.

### `GET /v1/events?contract=&tx=&limit=&cursor=`

The MIP-0018 events (`accept`, `reject`) and `unresolved` logs of one contract and/or one transaction (one filter at
least), in chain order:

```json
{ "items": [ { "height": 715109, "txIndex": 0, "txHash": "75c43430…", "eventIndex": 1, "segment": null, "phase": null,
               "contractAddress": "65553c65…ceb9", "classification": "reject", "reason": "reserved-valtype" } ],
  "nextCursor": null }
```

`reason` is `null` for an accepted event. `txHash` is the transaction's hash (from `block-parsed`).

## Not served yet

Until the changes that add them:

| Field or route | Served now | Served later | Comes with |
|---|---|---|---|
| `minted`, `firstSeen`, `evidence` | `null`, `null`, `[]` | a token's mints and sightings | the activity change |
| `seen` rows, `/v1/tokens/{color}` of a minted, undescribed color | none, 404 | listed, answered | the activity change |
| An identity minted but never described | not listed; its routes 404 | listed with `described: false` | the activity change |
| `/v1/lookup` | the held kind's described identity of that color, else `not-minted-in-indexed-range` | through the mint table | the activity change |
| `image` | `{ url, status: "pending", imageUrl: null }`; no `/v1/images/{id}` | a background fetcher's result | the image change |
| `/v1/tokens/{color}/activity`, `/v1/contracts/{address}/activity` | not served | served | the activity change |
| `/v1/events` `segment`, `phase` | `null` | the log's segment and phase | a core change (a log's segment of origin) |
| `/v1/contracts/{address}/tokens` of a contract | 404 without a MIP-0018 event or field | known from any applied call | the activity change |
