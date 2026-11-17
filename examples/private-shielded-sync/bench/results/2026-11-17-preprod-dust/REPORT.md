# The Dust file on Preprod

Built from the `dust-spend-processed` events of database `poc_ipir`, to height 3,448,835. Prefix 4 bytes, 4,096 entries per chunk. Reading and decoding the events took 13.5 s.

The Dust state restarts where the ledger's event format changes, so each format is its own file. `current` is what the module serves.

## earlier: 908,018 spends, heights 1,207 to 3,348,427

| Part | Bytes | Per entry |
|---|---|---|
| Nullifier prefixes | 3,632,072 | 4.00 |
| Declared times | 981,428 | 1.08 |
| Fees | 1,518,785 | 1.67 |
| Fee lists | 124,395 | 0.14 |
| Commitment positions | 908,462 | 1.00 |
| Chunk headers | 5,594 | 0.01 |
| **Total** | **7,170,736** (7.17 MB) | **7.90** |

- Chunks: 222; built in 448 ms.
- Compressed, chunk by chunk: gzip 5.30 MB (5.83 per entry), brotli 5.10 MB (5.61), zstd 5.29 MB (5.83). The whole file under zstd: 5.15 MB.
- Fees stored by their place in the chunk's list: 819,433 (90.2%).
- Distinct fee values in the file: 79,027; entries whose fee occurs more than once in the file: 840,116 (92.5%). A fee is 10 bits at the median, 60 at most.
- Transactions with a Dust spend: 716,730; spends in transactions that hold several: 263,892 (29.1%).
- Time differences that fit one byte: 92.0%; negative: 22,260; largest step back: 7,086 s.
- Entries whose commitment position is not the previous one plus one: 351,374 (38.7%).

Most frequent fees (Specks, occurrences): 1001 × 296,513; 300000000000001 × 153,204; 1 × 147,825; 0 × 31,430; 4 × 15,594; 1000000000000001 × 4,847; 2819536408497093 × 4,457; 4000000000000000 × 4,210.

## current: 65,035 spends, heights 3,349,439 to 3,448,835

| Part | Bytes | Per entry |
|---|---|---|
| Nullifier prefixes | 260,140 | 4.00 |
| Declared times | 66,293 | 1.02 |
| Fees | 166,912 | 2.57 |
| Fee lists | 35,797 | 0.55 |
| Commitment positions | 65,067 | 1.00 |
| Chunk headers | 406 | 0.01 |
| **Total** | **594,615** (0.59 MB) | **9.14** |

- Chunks: 16; built in 43 ms.
- Compressed, chunk by chunk: gzip 0.47 MB (7.25 per entry), brotli 0.45 MB (6.88), zstd 0.47 MB (7.25). The whole file under zstd: 0.45 MB.
- Fees stored by their place in the chunk's list: 52,342 (80.5%).
- Distinct fee values in the file: 13,745; entries whose fee occurs more than once in the file: 54,871 (84.4%). A fee is 49 bits at the median, 56 at most.
- Transactions with a Dust spend: 60,947; spends in transactions that hold several: 7,203 (11.1%).
- Time differences that fit one byte: 98.1%; negative: 3,334; largest step back: 306 s.
- Entries whose commitment position is not the previous one plus one: 863 (1.3%).

Most frequent fees (Specks, occurrences): 263510908922032 × 5,458; 263503183133506 × 5,439; 742591633696233 × 3,694; 266508801010636 × 3,219; 266516526799162 × 3,199; 994759368219448 × 2,598; 1154033938341749 × 1,345; 0 × 1,117.
