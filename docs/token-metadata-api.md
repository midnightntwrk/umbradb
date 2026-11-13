# `token-metadata-api`

The JSON API of the `token-metadata-api` module over `token-metadata`'s tables: MIP-0018 token metadata, one route.

- **Route:** `POST /token-metadata-api/v1/tokens`, under the module's own namespace, on the module API (`listen.api`,
  or the page's worker in the browser build). Implementation: `src/features/token-metadata-api/`.
- **Schemas:** the request body and the answer are TypeBox schemas (`schemas.ts`). Every request is checked against
  the request schema before it is answered, and every answer against the answer schema before it is sent.
- **One state per answer:** each answer is one read at the latest committed height, and carries the core's
  `X-Umbra-View`, `X-Umbra-Height` and `X-Umbra-Hash`. Before block S commits, the route answers 503
  `no-committed-height`.
- **Untrusted:** names, symbols, URIs and every other value are what a contract published. Show text as text, never
  as markup; never follow a URI without your own checks. The module fetches nothing.

## Request

A JSON body with exactly one of four selectors. Every 32-byte value is 64 lowercase hex digits, without `0x`.

| Selector | Body | Answers |
|---|---|---|
| Colors | `{ "colors": [<color>, …] }`, 1 to 100 | the described kind 1 and 2 tokens of each color (one color covers a token's shielded and unshielded kinds) |
| Contract | `{ "contract": <address>, "limit"?: 1–500, "cursor"?: <string> }` | the contract's described tokens by (domainSep, kind), 100 a page unless `limit` says |
| Contract and domain separator | `{ "contract": <address>, "domainSep": <hex> }` | that token's described kinds |
| One token | `{ "contract": <address>, "domainSep": <hex>, "kind": 1 \| 2 \| 3 }` | that token, or none |

Any other property, a missing one, or a value outside its rule is 400 `invalid-request`. A `cursor` is the `nextCursor` of
an earlier answer for the same contract; any other is 400.

## Answer

```json
{ "items": [ Token, … ], "nextCursor": "<string>" | null }
```

`nextCursor` is set only for a contract's page with more tokens after it. A token that is not described (never, or
withdrawn) is in no answer: an empty `items` is a valid answer.

**Token**

```json
{
  "contractAddress": "a1a1…", "domainSep": "0101…", "kind": 1, "kindName": "shielded-utxo",
  "color": "bf1b…",
  "common": { "name": "Acme Gold", "symbol": "AGLD", "decimals": "6", "standards": null },
  "fields": [ Field, … ], "fieldCount": 4, "fieldsTruncated": false,
  "group": { "symbol": { "hex": "41474c44", "utf8": "AGLD" }, "memberCount": 2, "members": [ { "domainSep": "0101…", "kind": 1 }, … ] },
  "mark": { "mark": "ok", "reasons": [], "reasonCount": 0, "unresolved": { "count": 0, "positions": [] }, "missing": [], "tags": [] },
  "image": { "url": "https://example.com/agld.png", "status": "pending", "imageUrl": null }
}
```

- `kindName`: `shielded-utxo` (1), `unshielded-utxo` (2), `contract-token` (3).
- `color`: `tokenType(domainSep, contractAddress)` for kinds 1 and 2; `null` for kind 3.
- `common`: the usable common fields; one never set or unusable is `null`, with no default.
- `fields`: every defined field, in key byte order, up to 256; `fieldCount` counts them all, and `fieldsTruncated`
  is true when there are more than 256.
- `group`: the tokens of the same contract whose served `symbol` is the same, when there are two or more (up to 100
  members listed, `memberCount` counts them all); else `null`.
- `image`: from a usable `image` field, always `pending` (nothing is fetched); else `null`.

**Field**

```json
{ "key": { "hex": "6e616d65", "utf8": "name" }, "valType": 1, "valTypeName": "utf8",
  "value": { "hex": "41636d6520476f6c64", "text": "Acme Gold" }, "usable": true,
  "updatedAt": { "height": 101, "txIndex": 0, "eventIndex": 0, "record": 0 } }
```

`value.text` is given for the text types (1, 3, 4) when the bytes are valid UTF-8, `value.integer` (a decimal string)
for type 2. `usable` answers the common-field rule for a common key, else `null`. `updatedAt` is where the value was
set; `eventIndex` is the event's position among its transaction's log sites.

## Rules

| Rule | Meaning |
|---|---|
| Defined keys only | A key is served only when MIP-0018 defines it: `name`, `symbol`, `decimals`, `standards`, `image`, `image_sha256`. Other keys are stored but never served and never make a token exist. |
| Withdrawal | A token exists only while one of its defined fields has a value; after its last is deleted it is in no answer, exactly as if it had never been described. |
| Lengths | `name` and `symbol` are served as their first 64 and 12 characters (grapheme clusters, UAX #29); they are stored whole. |
| Marks | `incorrect` the token's contract has a rejected MIP-0018 event (first 100 reasons, in chain order); else `unresolved` it has a log `core-contract-logs-fast` could not read (reason `unresolved-log`, first 100 positions); else `partial` `name`, `symbol` or `decimals` missing or unusable; else `ok`. Usable `standards` identifiers are `tags` (self-declared, never proof). |
| Hostile text | The body is pure ASCII: every non-ASCII character and `<`, `>`, `&` are `\uXXXX` escapes; parsing gives the exact text back. |
| Bounded cost | Each answer reads in a fixed number of statements, through the indexer's indexes. One accepted exception: the group of a served 12-character symbol reads every symbol of its contract starting with it (`apiReadTimeoutMs` bounds the request). |

## Errors

Every error is `{ "error": { "code": <string>, "message": <string> } }`, the module API's envelope; a message never
echoes the input. The route is one of the core's typed routes (module guide §7), so its codes are the module API's.

| Status | Code | When |
|---|---|---|
| 400 | `invalid-request` | the body matches no selector (the message names the schema path and rule), or a cursor this API did not issue for that contract |
| 503 | `busy` | more than 8 requests at once (`Retry-After: 1`; on PGlite requests run one at a time instead) |
| 404 | `not-found` | a path the module has no route for (the module API's answer) |
| 405 | `method-not-allowed` | a method other than `POST` (`Allow: POST`) |
| 413 | `request-too-large` | a body over the listener's limit |
| 503 | `no-committed-height` | before block S commits |
| 504 | `query-timeout` | a read past `apiReadTimeoutMs` |
| 500 | `internal-error` | anything else, with a fixed message |

Every answer carries `Content-Type: application/json; charset=utf-8`, `Cache-Control: no-store`,
`X-Content-Type-Options: nosniff`, `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'` and
`Referrer-Policy: no-referrer`.

## Not served yet

| What | Now | Later | Comes with |
|---|---|---|---|
| A color of a minted but undescribed token | not in `colors` answers | answered through the color table filled from native mints | the color table |
| Mints and activity (`minted`, first seen, evidence) | not served | served | the activity change |
| `image` | `pending`, nothing fetched | a fetcher's result | the image change |

MIP-0018 is pinned at commit `eb94bc182221cd937a84ed66a5f903b060f165ab`.
