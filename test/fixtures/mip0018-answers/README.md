# The MIP-0018 proof of concept's recorded API answers

The proof of concept's own answers to a fixed list of requests, recorded for `token-metadata`'s M14 (task 1.1). They are
not copies of files of the proof of concept: they are what its API answered when run at
[acedward/umbradb PR #26](https://github.com/acedward/umbradb/pull/26) `760d3e9c8a060577257ca3b2c42dd09a680e70f8` on its
own recorded stagenet fixtures. `test/features/token-metadata/answers.test.ts` recomputes every SHA-256 below and fails
on a modified, missing or unlisted file.

## How they were recorded

`record-answers.test.ts.txt` is the recorder (kept as `.txt`: it imports the proof of concept's code and runs only in
its tree). In a checkout of PR #26 at `760d3e9`, with Docker running:

```sh
cp record-answers.test.ts.txt <checkout>/token-indexer/test/record-answers.test.ts
cd <checkout>
npm ci --ignore-scripts
RECORD_OUT=<directory> npx vitest run token-indexer/test/record-answers.test.ts
```

For each of the proof of concept's two stagenet ranges it does what the proof of concept's `mip0018-api.test.ts` does:
its chain-archive sync over the range's tape (served by its fake chain), its scanner to the range's end, and its API on
127.0.0.1. It then requests, in this order:

1. `/v1/status`;
2. `/v1/tokens?limit=500`, then the list in pages of 2 (`?limit=2`, following `nextCursor`);
3. for each listed identity, `/v1/identities/{contract}/{domainSep}/{kind}`; for each listed color, `/v1/tokens/{color}`
   and `/v1/lookup/{color}?held=shielded` and `?held=unshielded`;
4. for each contract of the list and of the case index's cases in the range (sorted), `/v1/contracts/{address}/tokens`
   and `/v1/events?contract={address}&limit=500`;
5. for each transaction those events name (sorted), `/v1/events?tx={hash}`.

Each answer is `{ path, status, headers, body }`: the body as the text the server sent, and the five response headers
the API contract names. Recorded on 2026-11-06 with Docker's `postgres:17-alpine`; a second run wrote the same bytes.

| File | Range | Requests | SHA-256 |
|---|---|---|---|
| `idx.json` | `idx`, 714,485–715,183 (cases C01–C10) | 97 | `ad9f8f0729bacf3e29b1b00ae7dd71bfa4063be9113e2fd9aeba70c1dbb66e2a` |
| `u1.json` | `u1`, 715,402–715,433 (case U1) | 14 | `710eaaee3c93171dac5ed468690dc5288e774ec70758a0b0b78274cb528fa41c` |
| `record-answers.test.ts.txt` | — | — | `436f064bb3728664dc1af705e3b3b577f4e8372f4e4f2267efb1941c819556f5` |

## What M14 compares

M14 sends the same paths to `token-metadata` after replaying the same blocks from UmbraDB's stagenet tapes
(`stagenet-714485-715183`, `stagenet-715402-715433` in `test/tape/real/manifest.json`), and compares bodies byte for byte
with TM-13's fields masked (`minted`, `firstSeen`, `evidence`, the `seen` rows, `color`, `image`, `segment`, `phase`, the
status's `scanner`).
