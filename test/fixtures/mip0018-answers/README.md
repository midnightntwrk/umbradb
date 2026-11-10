# The recorded MIP-0018 API answers on stagenet

The expected answers of `token-metadata`'s `/v1` API to a fixed list of requests on two stagenet ranges, compared with
the module's own answers by `test/features/token-metadata/stagenet.test.ts`. `test/features/token-metadata/answers.test.ts`
recomputes every SHA-256 below and fails on a modified, missing or unlisted file.

## What they hold

For each range, the answers to these requests, in this order:

1. `/v1/status`;
2. `/v1/tokens?limit=500`, then the list in pages of 2 (`?limit=2`, following `nextCursor`);
3. for each listed identity, `/v1/identities/{contract}/{domainSep}/{kind}`; for each listed color, `/v1/tokens/{color}`
   and `/v1/lookup/{color}?held=shielded` and `?held=unshielded`;
4. for each contract of the list and of the case index's cases in the range (sorted), `/v1/contracts/{address}/tokens`
   and `/v1/events?contract={address}&limit=500`;
5. for each transaction those events name (sorted), `/v1/events?tx={hash}`.

Each answer is `{ path, status, headers, body }`: the body as the text the server sent, and the five response headers
the API contract names. Recorded on 2026-11-06.

| File | Range | Requests | SHA-256 |
|---|---|---|---|
| `idx.json` | `idx`, 714,485–715,183 (cases C01–C10) | 97 | `cf9df390b9edaf78cd4f53410bc73f141ef7883ad1ec21fc6d196c44ddd31cf4` |
| `u1.json` | `u1`, 715,402–715,433 (case U1) | 14 | `d328716963ae2bcec970826a28d902c458f1018b3c0480a8e92ca00fab43babf` |

## What the comparison does

`stagenet.test.ts` sends the same paths to `token-metadata` after replaying the same blocks from UmbraDB's stagenet tapes
(`stagenet-714485-715183`, `stagenet-715402-715433` in `test/tape/real/manifest.json`), and compares bodies byte for byte
with the fields the module does not serve yet masked (`docs/token-metadata-api.md`, "Not served yet"): `minted`,
`firstSeen`, `evidence`, the `seen` rows, `color`, `image`, `segment`, `phase`, the status's `scanner`.
