# private-shielded-sync

A proof of concept of a Midnight wallet that finds, reads and spends its shielded coins while the server cannot tell
which coins are its own. The server publishes a scan file of 36 bytes per shielded output; the wallet tests every entry
locally with its encryption secret key, then reads its own outputs and checks its nullifiers with single-server private
information retrieval (SimplePIR), so the server answers without learning which records were read.

This folder holds, so far, the parts both sides share:

- `pir/`: SimplePIR (tables, setup data, queries, answers, decoding) and the nullifier buckets;
- `shared/`: the wire formats, record layouts and the snapshot manifest;
- `kernel/`: the scan kernel, a WebAssembly build of the ownership test, decryption and Poseidon on the Midnight
  ledger's own Rust crates, with its Node.js loader and worker pool;
- `test/`, `bench/`.

Neither `pir/`, `shared/` nor `kernel/` imports anything from UmbraDB, so the server module and the client use them
unchanged. The server module and the client come later.

## Running it

From the repository's root:

```sh
npm run typecheck                                   # includes this folder (tsconfig.json here)
npx vitest run examples/private-shielded-sync       # the tests below
node examples/private-shielded-sync/bench/micro.ts  # micro-benchmarks, JSON under bench/results/
examples/private-shielded-sync/kernel/build.sh --check   # rebuilds the kernel in Docker, compares with the committed one
```

The `.ts` files run directly under Node.js 24 (its own type stripping): the multiply and scan worker threads load
`pir/multiply-worker.ts` and `kernel/scan-worker.ts` as they are. So the code here uses only TypeScript that strips to
JavaScript unchanged (`erasableSyntaxOnly`, `verbatimModuleSyntax`).

A server, in outline:

```ts
import { buildPositionalGrid, buildSetup, deriveSeed, gridDigest, answerQueries, WorkerMultiplier } from "./pir/index.ts";
import { decodeQueryBody, encodeAnswerBody } from "./shared/index.ts";

const workers = new WorkerMultiplier();                       // one thread fewer than the CPUs
const grid = buildPositionalGrid(count, recordBytes, records); // read table: record i at column i div perColumn
const seed = deriveSeed("read", gridDigest(grid));            // seeds the public matrix A
const setup = await buildSetup(grid, seed, workers);          // H = grid × A, published for clients
// per call:
const q = decodeQueryBody(body, grid.cols, { queriesPerCall: 32, snapshotId });
const answers = await answerQueries(grid, q.values, q.count, workers);
const reply = encodeAnswerBody({ snapshotId, count: q.count, values: answers }, grid.rows);
```

and a client:

```ts
import { buildQueries, decodeAnswers, columnRecords, positionOf, setupMatrix } from "./pir/index.ts";
import { ScanPool, encryptionSecretKeyScalar } from "./kernel/index.ts";

const secret = encryptionSecretKeyScalar(keys.encryptionSecretKey.yesIKnowTheSecurityImplicationsOfThis_serialize());
const positions = await new ScanPool().scan(scanFile, secret);
const columns = positions.map((i) => positionOf(i, table.perColumn).column); // padded to 32 with random columns
const batch = await buildQueries(table, columns);                             // table: manifest shape + seed
// send batch.queries, receive answers
const values = await decodeAnswers(setupMatrix(setupFile, table.rows), batch, answers);
const records = values.map((v, k) => columnRecords(table, v)[positionOf(positions[k], table.perColumn).slot]);
```

## PIR library (`pir/`)

SimplePIR ("One Server for the Price of Two", ePrint 2022/949) with fixed parameters: modulus q = 2^32 (every sum and
product wraps at 32 bits), LWE dimension n = 1024, discrete Gaussian error with σ = 6.4, uniform secret, 9 bits per
cell (p = 512, Δ = 2^23).

- **Cells** (`encode.ts`): a record's bytes are read least significant bit first and cut into 9-bit groups (the last
  zero-padded); a group's value v is stored as v − 256. A record takes E = ⌈8 × bytes / 9⌉ cells.
- **Grid** (`grid.ts`): R rows × C columns, row-major, one `Int16Array` (2 bytes per cell) in a `SharedArrayBuffer`.
  A column stacks `perColumn` records; record slot s of column j fills rows s·E … s·E + E − 1. Unused cells hold
  value 0. The read table puts record i in column `i div perColumn`, slot `i mod perColumn`, with
  `perColumn = max(1, round(√(N·E) / E))` and C = max(1, ⌈N / perColumn⌉).
- **Noise check** (`params.ts`): `8 σ (p/2) √C < Δ/2`, so at most 102,399 columns; creating a larger grid throws.
- **Table file**: a 32-byte header (magic `PSSG`, format version, reserved, then R, C, perColumn, E, record size,
  record count as 32-bit little-endian) followed by the cells as 16-bit little-endian integers, row by row. The grid
  digest is the file's SHA-256.
- **Public matrix A** (`matrix.ts`): C rows of n 32-bit words, the AES-128-CTR keystream under
  `SHA-256("umbradb-pss/A/v1" ‖ seed)[0..16]` from a zero 128-bit big-endian counter, read as little-endian words. The
  seed is `SHA-256("umbradb-pss/seed/v1" ‖ table name ‖ grid digest)`, with table names `read` and `nullifier`. Row r
  starts at counter block r·256, so a client expands A in chunks and never holds all of it.
- **Setup data** (`setup.ts`): `H = grid × A`, R × n 32-bit words, little-endian, row by row.
- **Queries, answers, decoding** (`query.ts`): for column j, a fresh uniform secret s and fresh Gaussian error e from
  the operating system's random source; `query = A·s + e + Δ·unit(j)`. The server answers `grid × query`. The client
  computes `x = answer − H·s` and each cell `round(x / Δ) + 256 mod 512`, then reassembles the column's records.
- **Multiply** (`multiply.ts`): one interface, `multiply(matrix, vectors, count, layout)`, for the server's answers
  and setup data and for the client's `A·s` and `H·s`. `WorkerMultiplier` splits the rows across `worker_threads`
  (matrix, vectors and output in shared memory); `inlineMultiplier` runs on the calling thread. The loop
  (`multiply-core.ts`) walks the matrix in tiles of 4 rows × 2,048 columns with eight register accumulators (4 rows ×
  2 vectors), so each cell is read from memory once per call and used for every vector in it.
- **Nullifier buckets** (`buckets.ts`): a record is the nullifier (32), height and transaction index (32-bit
  little-endian each), 40 bytes. A nullifier's bucket is its first `bucketBits` bits (byte 0 first, most significant
  bit first); bucket j is column j, holding `capacity` records sorted by nullifier and padded with zero records.
  `capacity` is the largest bucket's load (at least 1). `bucketBits` minimises R + C over [4, 24] among the values
  whose 2^bits columns pass the noise check (ties to the smaller). A lookup decodes the bucket's column and searches it.

## Wire formats (`shared/`)

All integers little-endian; binary bodies are `application/octet-stream`; routes under `/pss/v1`.

- **Query body** (`POST /query/read`, `POST /query/nullifier`): magic `PSSQ` (4), format version (2), snapshot
  identifier (32), vector count (2), then count × C 32-bit values, vector by vector. Decoding is strict: exact length,
  the required vector count, and the current snapshot (a `WireError` with status 400, or 409 for another snapshot).
- **Answer body**: the same 40-byte header with magic `PSSA`, then count × R values.
- **Tail** (`GET /tail`): a 132-byte header (magic `PSST`, version, reserved, snapshot identifier, height, block hash,
  `first_free` as 64 bits, root, and the byte lengths of four sections), then the sections: commitments (32 bytes
  each), outputs (257 bytes: flags, commitment, 224-byte ciphertext), nullifier records (40 bytes), block roots (32).
- **Records** (`records.ts`): scan entry (point and the first 4 bytes of element 0, or 36 zero bytes); read record
  (flags, commitment, elements 1–5, k lower path hashes: 193 + 32k bytes); tail output.
- **Manifest** (`manifest.ts`): JSON in canonical form (keys sorted, no whitespace); the snapshot identifier is its
  SHA-256. It names the network, genesis hash, height, block hash, `first_free`, root, `pathSplit`,
  `queriesPerCall`, the PIR parameters, and the digest, size and parameters of six artifacts: scan file, block roots,
  read table, read setup data, nullifier table (with `bucketBits` and `capacity`), nullifier setup data.

A ciphertext is 224 bytes throughout: the one-time point's 32-byte compressed encoding, then elements 0–5, each its
32-byte little-endian integer.

## Scan kernel (`kernel/`)

`kernel/src/lib.rs` is compiled to `wasm32-unknown-unknown` (`pss-kernel.wasm`, committed with its SHA-256 in
`pss-kernel.wasm.sha256`). It uses the ledger's published crates at the versions the `node-2.1.101` release of
`midnight-node` locks (the `ledger-9.1.0.1` crate set): `midnight-transient-crypto` 3.0.1, `midnight-coin-structure`
3.0.1, `midnight-base-crypto` 1.1.1, `midnight-serialize` 1.2.1, `midnight-curves` 0.3.1, `midnight-circuits` 7.3.0;
`Cargo.lock` holds every crate the node also locks at the node's version.

Exports, over plain linear memory (allocate with `alloc`, free with `dealloc`); every one returns 1 for success, 0 for
a rejected input, −1 for an invalid secret:

| Export | Does |
|---|---|
| `scan(entries, count, secret, out)` | The ownership test on 36-byte entries; writes matching positions. The point is decompressed without the subgroup check; only an entry whose 4 bytes match is decoded again the ledger's way (curve, canonical, prime-order subgroup, not the identity) before it counts. All-zero entries never match. |
| `scan_values(entries, count, secret, out)` | The 32-byte value the test compares, `Poseidon(k, 0)`, per entry (for checks and a future GPU kernel). |
| `pads(point, secret, out)` | The six pads `Poseidon(k, i)`, i = 0 … 5. |
| `hash2_raw(a, b, out)` | Poseidon of two field elements. |
| `decrypt_coin(ciphertext, secret, out)` | The ledger's own `SecretKey::decrypt::<CoinInfo>` (what Zswap's `try_decrypt` calls): ok flag, value (16 bytes LE), token type (32), nonce (32). |
| `leaf(commitment, out)` | `degrade_to_transient(commitment)`, the commitment's tree leaf. |
| `commitment(coin, coinPublicKey, out)` | `coinCommitment`, via the crate's `Info::commitment`. |
| `public_key(secret, out)` | `G × secret`, compressed: the bytes of the ledger package's `encryptionPublicKey`. |

Poseidon runs the crate's own permutation (`midnight_circuits::hash::poseidon::permutation_cpu`) with its partial-round
precomputation built once; the ledger's `transient_hash` builds it on every call (natively 32 µs against 11 µs per
hash). A native test checks the two agree on random inputs.

`kernel.ts` reads the `.wasm`, checks its SHA-256 against the committed one and refuses a mismatch, then instantiates
it. The module lists wasm-bindgen placeholder imports (from `reqwest`, which `midnight-base-crypto` depends on); none of
the exports calls them, and the loader binds each to a function that throws. `ScanPool` runs `scan` across worker
threads (each with its own instance) over the entries in shared memory; the thread count is an option.

### The secret: from the ledger package's key to the kernel's scalar

The kernel takes the encryption secret key's scalar, 32 bytes little-endian (`SecretKey::repr`). The TypeScript ledger
package gives it only through `EncryptionSecretKey.yesIKnowTheSecurityImplicationsOfThis_serialize()`, which writes
the key's `Serializable` form (`transient-crypto/src/encryption.rs`: `SecretKey(EmbeddedFr)`, derived field by field;
`transient-crypto/src/curve.rs`: an `EmbeddedFr` serializes as a `ScaleBigInt` of its little-endian bytes;
`serialize/src/util.rs`: the encoding):

- the low two bits of the first byte select the form: `00` one byte (value = byte >> 2); `01` two bytes (14 bits);
  `10` four bytes (30 bits); `11` `(first >> 2) + 4` little-endian value bytes follow, the last non-zero;
- a key derived by `ZswapSecretKeys.fromSeed` is uniform below the Jubjub subgroup order (about 2^251.9), so it is
  almost always `0x73` followed by the 32 value bytes, and about one key in fifteen (top byte zero) is `0x6f` followed
  by 31 bytes.

`encryptionSecretKeyScalar(bytes)` (`kernel/secret-key.ts`) decodes either form (and the tagged form, which adds the
prefix `midnight:encryption-secret-key[v1]:`), refuses non-canonical encodings and trailing bytes, checks the value is
below the subgroup order and zero-pads it to 32 bytes. A client can confirm the conversion with
`kernel.publicKey(scalar)`, which must equal `keys.encryptionPublicKey`; the tests do this against the repository's
vendored ledger package. The scalar is a secret: it goes only to the local kernel.

### Building the kernel

`kernel/build.sh` builds in Docker with `rust:1.95-slim-bookworm` pinned by digest and the committed `Cargo.lock`
(`--locked`). `blst`, a C dependency of `midnight-curves`, needs clang and an archiver that indexes wasm objects for
this target; the script installs Debian bookworm's `clang-14` and `llvm-14` at exactly `1:14.0.6-12`. Paths are
remapped so the output does not depend on where the source sits. `--check` rebuilds into a temporary folder and
compares with the committed file and digest; `--test` runs the crate's native tests; `--vectors <dir> <count>` writes
the coin decryption fixtures. Set `PSS_KERNEL_CARGO_CACHE` to a Docker volume name to keep crate downloads between
runs. A rebuild on an x86-64 host resolves the same image index to its amd64 variant; the output has been checked only
on arm64.

## Tests

| File | Covers |
|---|---|
| `test/kernel.test.ts` | Kernel digest; all 16,384 test vectors (hit flag and full value of every entry), single- and multi-threaded; the four worked samples (point, shared point, key, pads) against an independent BigInt reference; Poseidon against that reference; an entry outside the prime-order subgroup whose 4 bytes match is rejected; coin decryption and commitments on 48 vectors; the secret conversion, `coinCommitment` and `degradeToTransient` against the vendored ledger package. |
| `test/pir.test.ts` | Cell encoding; grid shape; table file; noise check; A against AES directly; Gaussian error statistics; PIR read equals direct read for random tables and positions, every position of a table, a 705-byte table across threads, an empty table; two queries for one column differ in every value; the multiply interface. |
| `test/buckets.test.ts` | Nullifier records; bucket bits; sorted, padded buckets; the `bucketBits` choice against brute force; PIR lookups of present and absent nullifiers equal direct lookups. |
| `test/wire.test.ts` | Query, answer and tail formats with their strict checks; record layouts; the manifest's canonical form and identifier. |

Fixtures (`test/fixtures/`): `entries.bin`, `pads.bin`, `mine.bin`, `scalar.bin` and `sample.txt` are 16,384 scan
entries made with the ledger's `encrypt` (about one in a thousand to the test key), the ledger's value for each, which
are the test key's, the test key's scalar, and four worked entries. `coins.bin`, `coin-secret.bin` and
`coin-public-key.bin` are 48 coins encrypted with the ledger's `encrypt` (two thirds to the test key) with their
commitments, written by `kernel/build.sh --vectors`. `poseidon-constants.json` holds `midnight-circuits` 7.3.0's
Poseidon constants (Apache-2.0) for the BigInt reference. Every key in the fixtures is a test key from a fixed seed.

## Benchmarks

`bench/micro.ts` measures the scan (per entry, per thread count) and, for 10,000, 100,000 and 1,000,000 records of 704
and 40 bytes, building the grid and its digest, the setup data, the server's answer to 1 and 32 vectors, and the
client's query build and decode (one thread and worker threads). It checks every decoded record and writes JSON to
`bench/results/micro-<date>.json`.
