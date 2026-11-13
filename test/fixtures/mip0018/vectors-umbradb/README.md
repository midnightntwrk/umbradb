# UmbraDB's own MIP-0018 vector versions

The MIP's reference vectors (`../vectors/`) are written against MIP-0018 at `274a84f`. UmbraDB
implements [MIP-0018](https://github.com/midnightntwrk/midnight-improvement-proposals/blob/eb94bc182221cd937a84ed66a5f903b060f165ab/mips/mip-0018-on-chain-token-metadata.md) as merged from [PR #372](https://github.com/midnightntwrk/midnight-improvement-proposals/pull/372), whose
rule "Keys MUST be valid UTF-8" (Testing R5: invalid UTF-8 in a key rejects the event) the earlier text does not have.
This folder holds UmbraDB's own version of each reference vector whose expected result differs under that rule;
`test/features/token-metadata/vectors.test.ts` runs it instead of the reference file with the same id
(`vector-sets.ts`), so every id runs exactly once.

| Id | Event | Reference expectation | UmbraDB's expectation |
|---|---|---|---|
| `A3c` | one record, key `ff 6b 65 79` (not UTF-8), value `"ok"` | `accept` | `reject`, reason `invalid-utf8`, offset 33 (the record) |

The event bytes (`event`, `payload/A3c.bin`) are the reference vector's, byte for byte; only `mip`, `description`,
`basis` and `expect` differ — `vectors.test.ts` checks that, and `SHA256SUMS` covers every file (checked before a
run).
