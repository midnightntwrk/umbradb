# Real MIP-0018 events

Contract logs of two public Midnight networks, and what the MIP's reference tool concludes from the same events.
`test/features/token-metadata/real-events.test.ts` replays them through `token-metadata`.

| File | Network | Heights | Contracts |
|---|---|---|---|
| `preview.json` | preview | 41,547 to 42,153 | the 10 contracts of the reference implementation's recorded cases ([`deployments/preview/cases`](https://github.com/midnight-experiments/mip-0018/tree/3252703/deployments/preview/cases): C01 to C06, C08, C10, C12, U1) |
| `preprod.json` | preprod | 3,477,265 to 3,483,858 | a token a third party published (`676c1526…c759`), and four of the reference's example contracts deployed on 2026-11-19 for this data, one renamed |

Each file holds:

- `logs`: every contract log of the blocks where a listed contract emitted a `Misc` event, as
  `core-contract-logs-full` stored it: `height`, `tx` (the transaction's index in its block), `index` (the log's
  number in its block), `contract`, `type` and `data` (the ledger's tagged serialization, hex). They were read from
  the table `contract_logs.logs` of a database synced with this repository's build.
- `contracts`: for each listed contract, the output of the reference tool (`mip0018 list --json`,
  [midnight-experiments/mip-0018@3252703](https://github.com/midnight-experiments/mip-0018/tree/3252703)) reduced to
  what the test compares: how many events it accepts, rejects and ignores, each token with its color, common fields
  and fields (type, bytes as served, usable, block and record), and the symbol groups of two or more members.

Everything here is public chain data. The reference tool read the networks through their public indexers, not through
UmbraDB, so the two sides of the comparison are independent.
