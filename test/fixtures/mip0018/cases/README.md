# MIP-0018 Stagenet case expectations

Expected consumer state per case contract (identities with their usable common fields, `fields` and `counts` where
given, symbol groups), used by `test/features/token-metadata/stagenet.test.ts`, which replays the stagenet tapes
`stagenet-714485-715183` and `stagenet-715402-715433` and compares each case. They are written against MIP-0018 at
`274a84f`; `../cases-umbradb/` holds UmbraDB's amendments under the MIP text as merged from PR #372.

- `<case>/*.json`: each case's expected state. C06's files describe each step of its lifecycle under per-key
  tombstones: the withdraw (one Null record at `name`) keeps `symbol`, `decimals` and `standards`; the revive sets
  `name` and `symbol` next to them. C09's expected state is C01's, so the test compares C01's file.
- `IDX/expected.json`: the matrix colors with each identity's metadata (C05 bronze not minted).
- `IDX/index-summary.json` and `U1/index-summary.json`: a mint scanner's output over 714485–715183 and
  715402–715433: colors with first and last mint, deploys, the `mip-0018:token-metadata[v1]` events with position,
  bytes and classification, and statistics.

Which transactions belong to which case step, and at which heights, comes from the case index (`../case-index.json`).
Case C11 (blocks 724875–724957) is outside the recorded Stagenet ranges and is not replayed.

Single-member groups are listed as they were recorded; comparisons ignore groups of one member (a symbol group has two
or more members).
