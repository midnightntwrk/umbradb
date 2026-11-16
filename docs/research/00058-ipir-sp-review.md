# IPIR+SP: review of the code against the papers and its specification, and security status of the parameters

Review for spec 00058 (second PIR scheme of the private shielded sync example), 2026-11-16.

**Sources.** The code was compared with (a) upstream's own specification files, (b) the mathematics derived from
first principles and confirmed by an independent numerical recomputation, and (c) the two papers: InsPIRe (ePrint
2025/1352, PDF of 2026-08-10, 40 pages) and ReinsPIRe (ePrint 2026/1934, PDF of 2026-09-08, 34 pages). Parts A to C
were written before the papers were available; Part D is the comparison with the papers. Marks used in Part A:

- **[spec]** checked against upstream's specification;
- **[derived]** derived independently and checked (numerically where stated);
- **[paper]** checked against the paper in Part D.

## Result in short

- Every step the code shares with the papers is implemented as printed (Part D.1). The profile used differs from the
  papers in five ways, all upstream's own choices (Part D.2): it sends one key and decodes with two masks, its query
  masks have ring structure, it rounds query, answer and masks, its plaintext modulus is not the papers', and it has
  neither the papers' second-dimension folding nor the verifiable variant.
- Neither paper analyses the one-key, two-mask output or the rounding. The server's view is a function of a subset of
  the view the papers prove private, so their security theorem covers it; the rounding terms are the largest error
  terms and are covered by upstream's certificate, not by the papers' noise theorem.
- No deviation was found between the code and upstream's specification or the derived equations. An independent
  program reproduced, bit for bit, the library's request, published masks and answer at d = 8, 16 and 2,048, and the
  decode equation held for every coefficient.
- The error budget explains the measured phase error (2^34.2–2^34.4): the rms error is 2^32.2; the limit 2^37 is 27.9
  times that.
- Lattice estimator, computed here: 2^136.8 classical (MATZOV model), 2^109.5 classical and 2^96.4–2^99.4 quantum
  (core-SVP). Upstream calls the profile experimental and still requires an independent review.
- Upstream's correctness certificate, run here on random 16-bit tables: one answer fails with probability at most
  2^-300 (2,048 × 2,048) and 2^-222 (32,768 × 12,288). It drops below 2^-128 from 131,072 rows; the project caps
  tables at 32,768 rows for that reason (finding F4). On the project's own tables the bound is 2^-268 or better.
- The project's layer draws a fresh secret per request from the platform's cryptographic source and never returns it
  to JavaScript. Findings are in Part C; none blocks a proof of concept.

## Scope and method

- Paths of vendored files are relative to `examples/private-shielded-sync/ipir/vendor/ipir-sp/`; paths of project
  files (`core/`, `node/`, `wasm/`, `*.ts`) to `examples/private-shielded-sync/ipir/`.
- The vendored copy was compared with a clone of upstream at `791b528` by `diff -r`: identical, except the folders
  `vendor/ORIGIN.md` lists as left out.
- Project files were read as on disk on 2026-11-16. An uncommitted change adds table handles (`detach`,
  `adoptIpirTable`, `tableInfo`) to `native.ts` and `node/src/lib.rs`; read as a diff, it touches no secret.
- Not read: the scheme layer above `ipir/` (`pir/ipir/`, outside the permitted paths) and the dependency
  `valar-spiral-rs`, which holds the sampler's scan loop (its behaviour was established by replay, A.3).
- Scratch files (`review/` below): `/Users/edwardalvarado/todo/Umbra/resources/00058-poc-ipir/review/`.

## Part A — algorithm walk

Profile: d = 2,048, q = 2^54, p = 2^16, Δ = q/p = 2^38, digits base 2^19 × 2 with r = 54 − 38 = 16 dropped bits,
masks at 29 bits, query at 49 bits, answer at 22 bits. s is the secret, τ_g the automorphism X → X^g.

### A.1 Conventions

| Item | Location | Code | Finding |
|---|---|---|---|
| Ring Z_q[X]/(X^d+1), coefficients constant term first, canonical `u64 < q` | `reinspiring/SPEC.md:11`; `reinspiring/src/native.rs:1284` | every input polynomial is validated | OK [spec] |
| Ciphertext `b + a·s = Δ·m + e` | `SPEC.md:12`; `native.rs:426-437` | phase = body + mask products | OK [spec], [derived, numerical] |
| LWE mask h embedded as ĥ = Σ h[i]·X^(−i), so the constant term of ĥ·s is ⟨h, s⟩ | `SPEC.md:12`; `native.rs:1173-1177`, `:396` | coefficient k of ĥ is h[0] or −h[d−k] | OK [derived] |
| τ_g as a signed permutation; generators 5 and 2d−1 | `reinspiring/src/compile.rs:28-43`; `inspiring/src/automorph.rs:23-30` | exponent i·g mod 2d, sign flips past d | OK [derived] |
| Exact products mod 2^54 | `reinspiring/src/lift_ntt.rs:32`, `:335-350`, `:382-417` | centred lifts, three 42-bit NTT primes, signed CRT; capacity > d·q² checked | OK [spec]; products equal schoolbook ones in A.8 |

### A.2 Public setup

| Step | Location | Code | Finding |
|---|---|---|---|
| Setup id | `ipir-native-client/src/lib.rs:326-353` | SHA-256 over: `"ipir-sp/native/v1/setup"`, the profile encoding, `"/two-mask-one-key-v1/"`, `"/rounded-public-masks-v1/"` and the mask width (29), then rows, cols, query bits (49), answer bits (22) as `u64`, the 32-byte seed, the 32-byte snapshot digest | OK [derived]: recomputed, equal |
| Profile encoding | `reinspiring/src/native.rs:128-142` | tag `reinspiring-native-experimental-v1`, then d, q, p, digit bits, digit count, dropped bits, sampler id | OK |
| Query masks | `lib.rs:354-361` | ChaCha20 keyed with the id; rows/d polynomials, each coefficient `next_u64 & (q−1)` (no modulo bias) | OK: recomputed, equal |
| Key masks | `native.rs:180-199` | second id = SHA-256(encoding, `"/packing-masks/"`, setup id); ChaCha20 gives w (2 polynomials, for K_g) then v (for K_h, unused in this mode) | OK: confirmed through the K_g equation |

Not hashed: the table's cells (only the caller's snapshot digest) and the sampler's CDF table (only its id). The
id binds a profile and a snapshot name; it authenticates neither.

### A.3 Client query

| Step | Location | Code | Finding |
|---|---|---|---|
| Entropy | `lib.rs:395-401` | 32 bytes from the OS source seed one ChaCha20 stream per request; drawn in order: secret (d), K_g errors limb 0 then 1 (2d), one error per row | OK |
| Sampler | `reinspiring/src/native_gaussian.rs:21-35`; `native_gaussian_cdf.txt` | frozen table of 131 thresholds for −65…65 (SHA-256 pinned at `:52-55`); one `u64` per sample, first threshold ≥ draw; a draw above the last threshold gives 0 | OK [spec]; see below |
| Selection | `native.rs:381-404` | per row block b: coefficient i = Δ·[b·d+i = target] + e − (τ₋₁(poly_b)·s)[i]; the comparison is a mask, not a branch (`:399`) | OK: `b_r + ⟨a_r, s⟩ = Δ·u_r + e_r`, a_r the r-th negacyclic rotation of poly_b |
| Rounding to 49 bits | `ipir-native-client/src/wire.rs:32-44`, `:60-63` | `((x + 16) >> 5) mod 2^49`, lifted back by `<< 5` | OK; error ρ ∈ [−15, 16], mean +½ (finding F5) |
| Dithered variant | `wire.rs:48-58` | round up with probability (dropped bits)/2^k, coins from the request stream; zero-mean error | not used: `core/src/lib.rs:130` refuses it |
| K_g | `native.rs:512-544`, weights `:160-167` | limb j: body = 2^(16+19j)·τ₅(s) + e_j − w_j·s; sent at 54 bits | OK: `body + w_j·s = 2^(16+19j)·τ₅(s) + e_j` |
| Request bytes (RNQ3) | `lib.rs:420-443` | `"RNQ3"`, id (32), K_g 2·2,048 × 54 bits = 27,648 bytes, rows × 49 bits; each segment zero-padded | OK; the server rejects a wrong length, magic, id or padding (`ipir-sp/src/native.rs:382-410`, `wire.rs:19-30`) |

The exact distribution, computed from the table: mean −4·10⁻¹⁵, variance 40.96 (σ = 6.400), support {−65} ∪ [−59, 53];
4,095 of 2^64 draws fall through to 0; no probability differs from exp(−x²/2σ²), σ = 6.4, normalised, by more than
3·10⁻¹⁶. Secret and errors use the same table (`native.rs:338`, `:400`, `:534`). A re-implementation of the scan, fed
the same ChaCha20 stream, reproduced every K_g coefficient and every 49-bit selection word: the draw order, the
table semantics and the equations above are confirmed bit for bit. Constant time of the scan was not verified.

### A.4 Server first pass

| Step | Location | Code | Finding |
|---|---|---|---|
| Dot product | `ipir-sp/src/native.rs:414-432`; `reinspiring/src/native_kernel.rs:114`, `:255-270` | ans_c = Σ_r cell[r,c]·query[r] with wrapping `u64`, masked to 54 bits (exact, since q divides 2^64) | OK. Only the scalar path runs on this host (aarch64); the x86 SIMD kernels were not exercised |
| Hints | `ipir-sp/src/native.rs:226-245`; `lift_ntt.rs:584-664` | h_c = Σ_b poly_b·D_{b,c}, D_{b,c} the cells of column c in row block b as a polynomial | OK [derived, numerical] |

Why the hint is that product: ⟨a_r, s⟩ is coefficient i of τ₋₁(poly_b)·s, so Σ_i D[i]·⟨a_{bd+i}, s⟩ is the constant
term of τ₋₁(D·poly_b)·s, which is ⟨coefficients of D·poly_b, s⟩. Hence
`ans_c + ⟨h_c, s⟩ = Δ·cell[target, c] + Σ_r cell[r, c]·(e_r + ρ_r)`.

### A.5 Packing preparation (per block of d columns)

| Step | Location | Code | Finding |
|---|---|---|---|
| Aggregation over the Galois group | `native.rs:1166-1235` | B_g = Σ_j X^j·τ_g(ĥ_j) for every odd g, over the integers, by a ring FFT whose twiddles are rotations by X² ; `i64` while `len·(q−1)` fits (`:1185`), then `i128` | OK: equals the direct triple sum (upstream test `:1319`; own recomputation in A.8) |
| Floor division | `native.rs:1217`, `:1231` | A_g = ⌊B_g / d⌋ by arithmetic shift of the signed integer, then mod q | OK [spec: D.1], [derived] |
| Order | `native.rs:904-916` | slots 5⁰, 5¹, … then −5⁰, −5¹, … | OK |
| Digits | `native.rs:1144-1161` | x = (a + 2^15) >> 16; two centred digits in [−2^18, 2^18); weights 2^16 and 2^35 | OK: reconstruction error δ, \|δ\| ≤ 2^15 |
| Collapse | `native.rs:925-954`; exponents `compile.rs:14-24` | from the last slot down: digits of the slot's mask, times τ_e(w_j), are added to the next slot (e = that slot's exponent); the two halves run independently | OK [derived, numerical] |
| Matrix H | `native.rs:982-993`; `compile.rs:219-248`, `:274-296` | per limb, H_j·vec(y) = Σ_steps digits_j·τ_e(y); stored as `i32` | OK: answer bodies equal the direct sum |
| Published masks | `native.rs:970-979`, `:1022-1026`; rounding `lib.rs:637-652` | a = slot 5⁰, a_other = slot −5⁰; rounded to 29 bits for the client only, the server keeps exact ones | OK |

Derivation. Σ over odd g of τ_g(x) is d times the constant term of x. Therefore, over the integers,
Σ_g B_g·τ_g(s) = d·Σ_c X^c·⟨h_c, s⟩. Writing B_g = d·A_g + R_g with 0 ≤ R_g < d:

`b + Σ_g A_g·τ_g(s) = Δ·m + e_first − e_div`, with `e_div = (1/d)·Σ_g R_g·τ_g(s)`, `|e_div| ≤ 65·d(d−1) < 2^28.1`.

Reducing B_g mod q before dividing would be wrong: B_g reaches d·q, and removing a multiple k·q changes the
quotient by k·q/d = k·2^43, which is not 0 mod q and is multiplied by the secret. One collapse step removes the slot
of exponent 5e. With digits D_j of its mask A (Σ_j D_j·2^(16+19j) = A + δ) and the K_g equation under τ_e:

`A·τ_{5e}(s) = Σ_j D_j·τ_e(K_g,j) + (Σ_j D_j·τ_e(w_j))·τ_e(s) − Σ_j D_j·τ_e(e_j) − δ·τ_{5e}(s)`.

The first sum goes to the body (through H), the second to the mask of slot e. Both halves end at exponents 1 and −1:

`body + a·s + a_other·τ₋₁(s) = Δ·m + e_first − e_div + Σ_steps [Σ_j D_j·τ_e(e_j) + δ·τ_{5e}(s)]`.

Upstream's noise exporter builds the same two operators (`reinspiring/src/noise.rs:258-296`). This is InsPIRe's
Algorithm 1 and ReinsPIRe's Algorithms 1–2 with Appendices D.1 and D.2 as printed, stopped before the last key
switch **[paper]** (Part D).

### A.6 Online packing

| Step | Location | Code | Finding |
|---|---|---|---|
| `prepare_keys` | `native.rs:729-749` | checks setup id, two K_g limbs, no K_h; concatenates the limbs | OK |
| `prepare_pack` | `native.rs:752-767`; `reinspiring/src/native_matrix.rs:273` | body = H·K_g, wrapping arithmetic | OK |
| `finish_two_mask` | `native.rs:706-725` | adds the block's first-pass values | OK |
| Answer (RNR2) | `ipir-sp/src/native.rs:453-463` | `"RNR2"`, id, SHA-256 of the request, cols × 22 bits (nearest; error within 2^31) | OK: equal bit for bit to the recomputed body |

### A.7 Decode and error budget

| Variant | Location | Code | Finding |
|---|---|---|---|
| Direct | `native.rs:415-437` | phase = body + a·s + a_other·τ₋₁(s); m = ⌊(phase + Δ/2)/Δ⌋ mod p | OK [derived, numerical] |
| Cached | `native.rs:220-279`, `:305-318`; `lift_ntt.rs:98-152`, `:271-308` | masks transformed once per table under two NTT primes; the secret once per request, τ₋₁ as a reversal of its evaluations; products stored before the answer arrives | OK [spec]; the project's build check compares both on every checked row (`core/src/server.rs:210-212`) |
| Bindings | `lib.rs:488-505` | length, `"RNR2"`, setup id, SHA-256 of the request, digest of the masks | OK; consistency checks only |

Error terms for one cell, d = 2,048. "Measured" is the numerical check on a random 2,048 × 2,048 table (6,144 cells).

| Term | Size | Derived rms | Measured rms / max | Hard bound |
|---|---|---|---|---|
| Query error × cells | Σ_r cell·e_r | 2^23.4 (2,048 rows), 2^25.4 (32,768) | 2^23.1 / 2^24.8 | — |
| Query rounding × cells | Σ_r cell·ρ_r | offset ½·Σ cell (2^25 at 2,048 random rows) plus 2^23.9 | 2^25.5 / 2^26.4 | 16·Σ cell: 2^31 (2,048 rows of 0xFFFF), 2^35 (32,768), 2^37 (131,072) |
| Key error × digits | 2·d·(d−2) products | 2^31.4 | 2^31.4 / 2^33.3 | — |
| Dropped digit bits × secret | d·(d−2) products, \|δ\| ≤ 2^15 | 2^27.9 | 2^27.9 / 2^29.8 | 2^43 |
| Floor division | e_div | 2^12.9 | 2^12.7 / 2^14.2 | 2^28.1 |
| Mask rounding to 29 bits | (ε₀·s + ε₁·τ₋₁(s)), \|ε\| ≤ 2^24 | 2^31.9 | 2^31.9 / 2^33.9 | 2^42 |
| Answer rounding | ≤ 2^31 | 2^30.2 | 2^30.2 / 2^31.0 | 2^31 |
| **Total** | | **2^32.2** | **2^32.2 / 2^34.1** | limit 2^37 |

- The measured error equals the sum of these seven terms exactly, for every coefficient (A.8).
- The largest of n roughly Gaussian values is about σ·√(2·ln 2n): 2^34.2 for 2,048 cells, 2^34.4 for 12,288. The
  budget therefore explains the project's 2^34.2–2^34.4. The limit is 27.9 σ away.
- Mask rounding and key-switch error dominate; neither depends on the cells. A table of 0xFFFF cells measured the
  same total (rms 2^32.25, max 2^34.24 at 2,048 rows).
- Worst case in the cells: only the two query terms grow. At 32,768 rows of 0xFFFF the rounding term is at most 2^35
  (expected: an offset of 2^30), which leaves about 20 σ for the random terms. At 131,072 such rows the hard bound
  alone is 2^37, while the expected offset is 2^32.
- The hard bounds of the random terms exceed 2^37 (`reinspiring/SECURITY.md:46-54`), so correctness is a probability
  statement (B.4), not a worst-case one.

### A.8 Independent numerical check

Program: `review/numcheck/src/main.rs` (path dependencies on the vendored crates). The library builds a table,
makes requests from a seeded ChaCha20 (`generate_with_rng`) and answers them. The program recomputes each step
with its own code: schoolbook negacyclic products in wrapping `u64`, explicit automorphisms, aggregation by its
definition in `i128`, its own digits, bit unpacking and rounding. The library keeps the secret private, so it was
re-derived by replaying the request's stream through a re-implemented sampler.

| Checked | d = 8 (16 × 16, exact masks) | d = 8 (16 × 24) | d = 16 (32 × 48) | d = 2,048 (2,048², random and 0xFFFF) |
|---|---|---|---|---|
| Setup id, query masks, packing id | equal | equal | equal | equal |
| K_g and 49-bit selection from the replayed secret | equal | equal | equal | equal |
| Published masks from the table alone | equal (54-bit) | equal (29-bit) | equal | equal |
| Answer body, 22 bits | equal | equal | equal | equal |
| `body + a·s + a_other·τ₋₁(s) − Δ·m` below 2^37, all cells | yes, max 2^30.9 | 2^31.3 | 2^31.3 | 2^34.1; 2^34.2 |
| Largest error equals the library's `decode_with_error` | yes | yes | yes | yes |
| Error identity of A.5 plus rounding terms, exact | yes | yes | yes | yes |

Three or four rows per table. Not confirmed numerically: the cached decode (covered by the project's build check
and upstream's test at `native.rs:1357`), the x86 SIMD kernels, the dithered variant, the one-mask mode, and tables
larger than 2,048 × 2,048.

### A.9 The project's layer

| Question | Location | Finding |
|---|---|---|
| Fresh secret per request | `core/src/lib.rs:211-214` → `ipir-native-client/src/lib.rs:395-401` | every `Client::request` draws a new 32-byte seed. Test `core/tests/roundtrip.rs:155` checks that two requests for one row differ. OK |
| Entropy path in WebAssembly | `wasm/src/lib.rs:25-46`; `wallet.ts:66-87` | `OsRng` (rand 0.9) → getrandom 0.3 custom backend → import `env.fill_random` → `crypto.getRandomValues`, in chunks of 65,536 bytes. The getrandom 0.2 path (NTT table set-up in the dependency) uses the same import. The wrapper refuses a module with any other import and a platform without `getRandomValues`. OK; see F8 |
| Secret not exposed to JavaScript | `wasm/src/lib.rs:144-163`; `wallet.ts:223-246` | exports return request bytes and an opaque pointer; no export reads a secret; the instance and its memory are private fields of the wrapper. OK |
| Erasure | `reinspiring/src/native.rs:297-302`, `:326-331`; `wasm/src/lib.rs:168-172` | secret coefficients and cached products are zeroized when the state is freed. The seed, the ChaCha20 state and temporaries of key generation are not (F6); a state is freed only if the caller calls `free()` (F7) |
| Lengths validated | `core/src/lib.rs:192-199`, `:224-231`; `core/src/server.rs:165-194`; `wasm/src/lib.rs:146`, `:191`; `wallet.ts:201-208`, `:254`; `node/src/lib.rs:253` | masks, request, answer, output buffers, seed and digest lengths are checked before use, in TypeScript and again in Rust. OK |
| Build-time decoding check | `core/src/server.rs:102-123`, `:200-252` | first row, last row and rows drawn from the setup id (3 by default) go through request, answer, cached and direct decode; the build fails on a wrong cell or an error ≥ 2^37. A smoke test: it cannot bound a failure probability (F3) |
| Secret or key reuse | `core/src/lib.rs:218-221`; `core/src/server.rs:245-252` | no state is reused between requests. `request_with_rng` (deterministic) is public in the core crate but not exported by the WebAssembly. The build check's secrets derive from the public setup id; those requests are answered in-process and never sent. OK |
| Size or count depends on the row | `core/src/lib.rs:62-64`; `native.rs:394-402` | the request length is a function of the row count only; generation loops over all rows identically. How many requests a wallet sends, and when, is decided in `pir/ipir/`: not reviewed (F9) |
| Decode errors | `ipir-native-client/src/lib.rs:482-510` | every failure depends on public values only (lengths, ids, digests); a tampered body decodes to wrong cells without an error (F10) |

## Part B — security status of the parameters

### B.1 What upstream claims and disclaims

One direct quotation; the other statements are paraphrased with their locations.

- "Native ReinspiRING remains an experimental cryptographic profile." (`reinspiring/SECURITY.md:3`; also
  `reinspiring/README.md:17`).
- Claimed model: passive server, fixed public setup, secure OS entropy, fresh secret and key randomness per query
  (`SECURITY.md:10-14`).
- Disclaimed: authenticated answers, security against a malicious table, guarantees under secret reuse
  (`SECURITY.md:16-20`); a constant-time audit (`:25-27`); an unconditional 128-bit claim (`:104-105`).
- Still required before production: an independent review of the power-of-two modulus and key-dependent-message
  composition, a correctness certificate per served snapshot, a timing audit if local attackers are in scope
  (`SECURITY.md:118-130`).
- The two-mask output and the rounded masks are marked experimental (`reinspiring/README.md:30-36`,
  `SPEC.md:202`); the certificate is stated not to be an independent review (`tools/security/NATIVE_CERTIFICATE.md:3-8`).
- Upstream gives the paper's configuration as p = 2^14 (`SPEC.md:41`) with a ternary secret (`native.rs:27`); this
  profile uses p = 2^16 and a Gaussian secret. ReinsPIRe states no plaintext modulus for its profile, and InsPIRe
  draws the secret from the error distribution, as this profile does (Part D.2, P4 and D.3).

### B.2 Assumptions used

- **Ring-LWE** in Z_q[X]/(X^2048+1), q = 2^54, secret and error from the σ = 6.4 table. One request gives the
  server rows/2,048 selection polynomials and 2 key polynomials under one secret: 18 ring samples (36,864 scalar
  equations) at 32,768 rows. Samples do not accumulate: each request has a new secret.
- **Key-dependent messages (circular security).** K_g encrypts 2^16·τ₅(s) and 2^35·τ₅(s) under s. This is the usual
  assumption of key-switching keys; it is not implied by Ring-LWE, and upstream lists its review as open.
- **Why K_g alone suffices.** The automorphisms are the odd exponents mod 2d, generated by 5 and −1. Each coset
  {5^t} and {−5^t} collapses with the τ₅ key only. Joining the cosets would need a key for τ₋₁ (K_h); instead both
  end masks are published and the client, who knows s, multiplies the second by τ₋₁(s). The server's view is the
  one-mask view with K_h removed (`SECURITY.md:203-208`).
- **Public masks from a seed** are treated as random (`ipir-sp/SECURITY_ANALYSIS.md:25-34`).

### B.3 Concrete security estimate (computed)

Lattice estimator at commit `53da598` (the commit upstream pins), SageMath 10.10, in the Docker image
`sagemath/sagemath:latest` (amd64, emulated; pulled for this run and removed afterwards). Scalar LWE with n = 2,048,
q = 2^54, secret and error `DiscreteGaussian(6.4)`, m = 36,864 (32,768 rows) and m = 6,144 (2,048 rows); both give
the same results. In the command, `review/` stands for the scratch folder's absolute path.

```sh
docker run --rm --platform linux/amd64 -v review/lattice-estimator:/est:ro -v review/estimate:/work:ro \
  -e PYTHONPATH=/est sagemath/sagemath:latest "sage -python /work/estimate_pss.py"
```

| Attack | MATZOV, classical | Core-SVP classical (0.292 β) | Core-SVP quantum (0.265 β) | Quantum, ChaLoy21 (0.257 β) | β |
|---|---|---|---|---|---|
| Primal uSVP | 2^137.8 | 2^109.5 | 2^99.4 | 2^96.4 | 375 |
| Primal BDD | 2^136.8 | 2^109.9 | 2^99.9 | 2^96.9 | 370–375 |
| Dual | 2^140.0 | 2^110.7 | 2^100.4 | 2^97.4 | 379 |
| Dual hybrid | 2^139.9 | 2^111.0 | 2^100.7 | 2^97.7 | 379–380 |

- The classical figures reproduce upstream's (136.829 and 109.500, `SECURITY.md:98-102`).
- Reading: about 137 bits under the estimator's default model, 109 bits under the conservative core-SVP count, 96–100
  bits against a quantum sieve. The profile sits at the boundary the HomomorphicEncryption.org standard gives for
  128-bit classical security (n = 2,048, log q = 54; recalled from the standard, not re-read here).
- Limits: the estimate treats the structured, key-dependent ring problem as generic LWE; algebraic, BKW and other
  hybrid attacks were not run.
- **Query rounded to 49 bits.** The sent body is a public function of the full-precision ciphertext, so anything
  the server learns from it, it could learn from the unrounded one. The estimate grants the server full precision.
  No security is claimed from the extra rounding noise: the key samples are sent at full precision.
- **Answer rounded to 22 bits, masks to 29 bits.** Both are computed by the server from its own view and carry no
  information about the request beyond it. They affect correctness only.

### B.4 Correctness-failure probability

Upstream's tooling ran unchanged: the `native_noise` example exports, per block, the exact weights of every original
sampler draw in the error (key-error matrix, secret matrix including digit residues and mask rounding, cell column
norms), and `certify_native.py` bounds the probability that any coefficient of one answer leaves the 2^37 interval.
It uses exact rational arithmetic, the frozen sampler's true distribution (no Gaussian approximation), a fixed
reserve for floor division, 49-bit nearest rounding (16 × largest column sum) and answer rounding (2^31), a Chernoff
bound, and a union bound over all cells. Tables are upstream's deterministic random 16-bit tables, not project data.

| Table | Certified failure of one answer | Same, query term replaced by all cells 0xFFFF | Same table with dithered 49-bit queries |
|---|---|---|---|
| 2,048 × 2,048 | ≤ 2^-300 | ≤ 2^-295 | ≤ 2^-305 |
| 32,768 × 2,048 | ≤ 2^-225 | ≤ 2^-169 | ≤ 2^-300 |
| 32,768 × 12,288 | ≤ 2^-222 | ≤ 2^-161 | ≤ 2^-298 |
| 65,536 × 2,048 | ≤ 2^-168 | ≤ 2^-85 | ≤ 2^-306 |
| 131,072 × 2,048 | ≤ 2^-83 (checker rejects) | no bound: the fixed reserve exceeds 2^37 | ≤ 2^-303 |

- The exported random-term weight (L2² = 2^59.08, times σ) is 2^32.2, the same figure as A.7.
- The drop with the row count comes from the reserve for nearest rounding, which assumes every rounding error at
  its extreme. The expected error barely moves (A.7), so these are loose bounds, not observed failure rates.
- The bound covers one answer for one table and does not accumulate over requests
  (`NATIVE_CERTIFICATE.md:16-18`). The second and third columns are upstream's counterfactual screens on the same
  masks, not certificates. The project's own snapshots were not certified.

### B.5 What the scheme does not provide in this project

| Property | Status | Where upstream says so |
|---|---|---|
| Answer authentication | none; the setup id and request hash only prevent mix-ups | `SPEC.md:155-158`; `ipir-native-client/src/lib.rs:4` |
| Malicious server | not covered; a server answering from a changed table can learn from behaviour that depends on the decoded row | `SECURITY.md:16-20`; `ipir-sp/SECURITY_PROFILES.md:36-38` |
| Constant-time code | no audit of the CRT and conversion paths; local timing and cache attackers excluded | `SECURITY.md:25-27`, `:129-130` |
| Secret reuse | no guarantee; one secret used twice against the same masks reveals the difference of the two selections | `SECURITY.md:17`; `ipir-sp/KEY_REUSE_EXPERIMENT.md:17-19` |
| Request count and timing | sizes depend on the table shape only; how many requests are sent, and when, is the caller's | not addressed upstream; its model is one passive server and one query (`SECURITY.md:10-14`) |
| Erasure | heap buffers of the decode path only; not registers, stack or OS copies | `SECURITY.md:183-184` |

## Part C — findings

| Id | Severity | Finding | Location | Status |
|---|---|---|---|---|
| F1 | note | The papers were read after Parts A to C were written. Result in Part D: the shared steps are as printed; the two-mask output, the ring-structured query masks, the rounding and p = 2^16 are not in the papers (P1 to P4). | Part D | closed |
| F2 | note (blocker for production use) | Upstream's profile is experimental; its release gates (independent review of the key-dependent-message composition, per-snapshot certificate, timing audit) are open. | `reinspiring/SECURITY.md:3`, `:118-130` | open; to be stated wherever the scheme is described |
| F3 | should fix | The build check decodes 3 rows; it is a smoke test. Upstream's certificate (`NativeServer::build_analyzed` plus `certify_native.py`) is not run on the project's snapshots. | `core/src/server.rs:102-123`; `ipir-sp/src/native.rs:164` | done: certificates on the project's tables at the real size and at 1,000,000 outputs, 2^-268 or better (`bench/results/2026-11-16-preprod-schemes/REPORT.md` §7) |
| F4 | should fix | `check_shape` admits up to 524,288 rows. With 49-bit nearest rounding the certificate drops below 2^-128 at 131,072 rows of random cells (2^-83) and at 65,536 rows of 0xFFFF cells (2^-85). At 32,768 rows the screen with every cell at 0xFFFF in the query term still gives ≤ 2^-161. | `core/src/lib.rs:102-114` | fixed: tables are capped at 32,768 rows (`core/src/lib.rs:66`, `:126`; `pir/ipir/shape.ts`) |
| F5 | note | Nearest rounding with ties upward has mean +½, which shifts every cell's phase by half its column sum (2^30 at 32,768 rows of 0xFFFF). Inside upstream's reserve. | `ipir-native-client/src/wire.rs:32-44` | no action below the F4 cap |
| F6 | note | Not erased after a request: the 32-byte seed and ChaCha20 state, τ₅(s), w·s and the selection products. The secret can be re-derived from the seed while it remains in memory. | `ipir-native-client/src/lib.rs:396-400`; `reinspiring/src/native.rs:397`, `:525-529` | open; upstream code, upstream claims heap hygiene only |
| F7 | note | A request state is erased only when the caller calls `free()`; there is no finalizer. A state never freed keeps its secret in the module's memory. | `wallet.ts:236-245` | the scheme layer frees every request's state after decoding (`pir/ipir-sp-wallet.ts:65`, `:136`); still no finalizer |
| F8 | note | The import `fill_random` cannot report failure and the Rust side always returns success. A host that returned without writing would give every request the same all-zero seed, hence the same secret. The only host is `wallet.ts`, which uses `crypto.getRandomValues`. | `wasm/src/lib.rs:34-45`; `wallet.ts:78-84` | fixed: the buffer is zeroed first and a draw equal to the previous one, or all zero, is refused (`wasm/src/lib.rs`, `entropy::draw`) |
| F9 | note | Whether the number and timing of requests are independent of the wanted rows is decided above this layer and was not reviewed. | `pir/ipir/` (outside scope) | not verified |
| F10 | note | A wrong or tampered answer decodes to wrong cells without an error. The application must verify decoded data and must not let the server observe behaviour that depends on it. | `ipir-native-client/src/lib.rs:482-510` | by design; not verified above this layer |
| F11 | note | Concrete security is 2^109.5 under core-SVP and 2^96–2^99 quantum; only the MATZOV model gives more than 128 bits. | B.3 | open; a statement to carry into the documentation |
| F12 | note | Constant time of the sampler scan and the x86 SIMD kernels were not examined (dependency not read; host is aarch64). | A.3, A.4 | not verified |
| F13 | note | The profile is not the scheme the papers analyse: one key with two masks (P1) and the rounding of query, answer and masks (P3) have no published analysis. Privacy follows from the papers' theorem by discarding part of the view; correctness rests on upstream's certificate. | Part D.2, D.3 | open; to be stated wherever the scheme is described |

No deviation between the code and upstream's specification, or between the code and the derived equations, was
found.

## Part D — the code against the two papers

"InsPIRe" is ePrint 2025/1352 and "ReinsPIRe" is ePrint 2026/1934; page numbers are the PDFs' own. The papers write
the table as D with n1 rows and n0 columns and query a column: their n0 is this project's row count (the query
length) and their n1 its column count (the answer length). τ_g is X → X^5, τ_h is X → X^(−1).

### D.1 Steps taken from the papers

| Paper | What it prescribes | Code | Finding |
|---|---|---|---|
| InsPIRe §2, p. 6 | `b = −⟨a, s⟩ + e + Δ·m`; the secret is drawn from the error distribution | `reinspiring/src/native.rs:381-404`; `native_gaussian.rs:21-35` | same signs; secret and errors from one σ = 6.4 table |
| InsPIRe §2, p. 6 (key switching) | key `y = −s′·w + s·g_z + e`; switch `(0, b) + g⁻¹(a)·K`; digits in [−z/2, z/2) | `native.rs:512-544`, `:1144-1161` | OK |
| InsPIRe Lemma 1, p. 9 | trace over the powers of g = 5 and h = 2d − 1 equals d times the constant term | `compile.rs:14-43` | OK |
| InsPIRe Algorithm 1, p. 11, TRANSFORM | `ã = Σ a[i]·X^(−i)`; slots τ_g^j, then τ_h∘τ_g^j | `native.rs:1166-1177`, `:904-916` | OK |
| InsPIRe Algorithm 1, PACK line 4 | aggregate the d transformed masks with X^k | `native.rs:1166-1235` | OK |
| InsPIRe Algorithm 1, COLLAPSEHALF and COLLAPSEONE; Appendix C, p. 29 | from slot d/2 − 1 down, switch slot k into slot k − 1 with τ_g^(k−1)(K_g); the second half the same under τ_h; d − 2 key switches | `native.rs:925-963` | OK: same order, same key images, d − 2 steps |
| InsPIRe Algorithm 1, COLLAPSE line 6 | a last switch with K_h joins the two halves into one mask | `native.rs:965-978` | present in upstream's one-mask mode; the profile used stops before it (P1) |
| InsPIRe Appendix G.1, p. 34; ReinsPIRe Appendix E.1, p. 31 | approximate, signed gadget digits | `native.rs:1144-1161` | OK; the code rounds the 16 dropped bits to nearest where the paper truncates |
| ReinsPIRe Lemmas 1–2, Algorithm 1, Corollary 1, pp. 9–10 | the d − 2 products with automorphic images of one key become one matrix H′ per limb, entries at most d·z/2 | `compile.rs:219-296`; `native.rs:982-993` | OK; (d − 2)·2^18 < 2^31, so the `i32` storage is safe by the lemma |
| ReinsPIRe Appendix C, pp. 27–28 | H′ by a ring FFT at powers of X² | `compile.rs:219`, `:254` | result equal to the direct sum (A.8); the routine was not compared line by line |
| ReinsPIRe Algorithm 2, p. 11, Pack | answer body = first-pass values + H′·y + Σ t″_j·y′_j | `native.rs:706-767` | OK; the last sum belongs to K_h and is absent (P1) |
| ReinsPIRe §3.4, p. 10 | products mod 2^k through NTT primes with product above d·q² | `lift_ntt.rs:32`, `:335-350` | OK |
| ReinsPIRe Appendix D.1, Lemma 10, pp. 28–29 | no inverse of d mod 2^k: aggregate over d·q, then floor-divide by d; error at most d² for a ternary secret | `native.rs:1217`, `:1231` | OK: exact integers, arithmetic shift. A.5's bound 65·d(d − 1) is the lemma with the sampler's bound 65 in place of 1 |
| ReinsPIRe Appendix D.2, p. 29 | aggregation as `ã′_k = Σ_j c_(j,k)·X^(j+k)` evaluated at X^(2i) by a ring FFT | `native.rs:1166-1235` | OK, including the placement of each coefficient |
| ReinsPIRe Algorithm 3, p. 13, Query | `b = −A·s + e + Δ·p`; `y_j = −w_j·s + e_j + z^j·s(X^5)` | `native.rs:381-404`, `:512-544` | OK up to P2 and P3; weights 2^(16+19j), the approximate gadget's |
| ReinsPIRe Algorithm 3, Eval | `[D, H′]·u` | `ipir-sp/src/native.rs:414-432`; `native_matrix.rs:273` | OK, as two products |
| ReinsPIRe §5.1, p. 17 | d = 2,048, q = 2^54, σ = 6.4, ℓ = 2, z = 2^19 | `NativeParams::new(2048, 54, 16, 19, 2, Gaussian)` | same five values; p is not stated (P4) |

### D.2 Where the profile used differs from the papers

| Id | Difference | Paper | Code | Effect |
|---|---|---|---|---|
| P1 | One key, two masks | Two keys (K_g, K_h) and one answer mask (InsPIRe Algorithm 1; ReinsPIRe Algorithm 2). A single key appears only for at most d/2 packed values (InsPIRe §3.3, p. 12) and for prime cyclotomic rings (ReinsPIRe Appendix G, pp. 32–34) | only K_g is sent; both end masks are published and the wallet adds `a_other·τ_h(s)` itself (`native.rs:965-978`, `:426-437`) | upload of keys halves (27,648 against 55,296 bytes); one key switch fewer; two masks per block; a second ring product in decoding. Not analysed in either paper |
| P2 | Query masks with ring structure | A uniform in Z_q^(n0×d): one independent mask per query entry (ReinsPIRe Algorithm 3; InsPIRe's setup, `A ← U`, p. 17) | rows/d ring polynomials; entry r uses a negacyclic rotation of its block's polynomial (`ipir-native-client/src/lib.rs:354-361`; `native.rs:381-404`) | hints by ring products instead of n1·n0·d multiplications. The query is rows/d Ring-LWE samples, fewer than the n0 samples the papers' assumption grants (D.3) |
| P3 | Rounding | Full 54-bit words: upload (n0 + 2ℓd)·log q bits, download 2·n1·log q bits (ReinsPIRe Theorem 3, p. 14); modulus switching only as a footnote (p. 15) and as InsPIRe Lemma 9 (p. 37), with one modulus for mask and body | query to 49 bits, answer body to 22 bits, masks to 29 bits and sent once per snapshot | sizes below. The mask and answer rounding are the largest error terms (A.7) and are outside the papers' noise theorem |
| P4 | Plaintext modulus 2^16 | ReinsPIRe gives no p for q = 2^54. InsPIRe uses 65,536 at q = 2^53 and 65,535 at q = 2^56 (Table 1, p. 19). Upstream's "p = 2^14" (`SPEC.md:41`) is not in the paper | p = 2^16 | correctness at this p rests on D.3 and on the certificate (B.4), not on a paper's parameter set |
| P5 | Folding and verification | ReinsPIRe+ folds the answer with one more ciphertext (Appendix D.3, p. 30); vReinsPIRe protects against a malicious server (§4) | neither | the answer is cols × 22 bits, not the paper's 12 KB; no protection against a server that answers wrongly (B.5) |

Also noted:

- **The meaning of σ = 6.4.** InsPIRe defines its parameter as a Gaussian width (p. 5), under which 6.4 is a standard
  deviation of 2.55; neither paper says which is meant. The code's table has standard deviation 6.400 (A.3), the
  larger reading: at least the papers' noise for security, and the certificate is computed with it.
- **The public random string.** The papers assume a uniform string from a trusted party (InsPIRe §2.1, p. 7). The code
  expands a seed with SHA-256 and ChaCha20 (A.2), and the project derives the seed from the table. Equivalent for a
  server that follows the protocol; a hash-as-random-oracle assumption otherwise.

Sizes for one request at 2,048 × 2,048, the papers' formula against the code:

| | ReinsPIRe Theorem 3 | Code |
|---|---|---|
| Upload | 13,824 + 55,296 = 69,120 bytes | 36 + 27,648 + 12,544 = 40,228 bytes |
| Download | 27,648 bytes (mask and body) | 5,700 bytes, plus 14,884 bytes of masks once per snapshot |

### D.3 What the papers' theorems give for this profile

- **Noise (ReinsPIRe Theorem 2, p. 14; InsPIRe Theorem 2, p. 12).** The error is subgaussian with
  `σ² ≤ n0·p²·σ_lwe² + ℓ·d²·z²·σ_ks²/4`, under the heuristic that the terms are independent. With n0 = 32,768,
  p = 2^16, ℓ = 2, d = 2,048, z = 2^19 and 6.4 this is 2^32.2, against the decoding limit 2^37. The query term is
  2^52.4 of a 2^64.4 total: the row count barely moves it. The profile has one key switch fewer than the theorem
  counts. Not in the theorem: the 16 dropped digit bits (2^27.9), the mask rounding (2^31.9), the answer rounding
  (2^30.2) and the offset of the query rounding (A.7).
- **Privacy (ReinsPIRe Theorems 4 and 10, pp. 14 and 26; InsPIRe Theorem 13, p. 33).** Assumption: Ring-LWE with
  key-dependent messages, n0 plain samples and 2ℓ encryptions of scaled automorphic images of the secret; server
  that follows the protocol. The profile shows the server rows/d plain samples (P2) and ℓ such encryptions (P1), then
  rounds (P3), which the server could do itself. An attacker on the profile is therefore an attacker on the papers'
  scheme that discards part of what it is given. The weights 2^16 and 2^35 are in InsPIRe's function family (any
  constant times τ_g).
- **Many queries (InsPIRe Appendix F.1, p. 34).** Privacy holds for many queries under one public string when every
  query has a new secret, with a loss proportional to the number of queries. The project does this (A.9), also inside
  a call of 32 requests.
- **Correctness for every table.** Theorem 10 asks that decoding fail with negligible probability for every table
  with cells below p. InsPIRe's own target is 2^-40 (p. 19). At the 32,768-row cap, upstream's screen with every cell
  at 0xFFFF gives at most 2^-161 (B.4).
- **"Over 128-bit security" (ReinsPIRe §5.1, p. 17).** Stated for these five parameters from the lattice estimator,
  without the cost model. B.3 reproduces it under the estimator's default model only (2^136.8); core-SVP gives
  2^109.5.

## What was not done

- Certifying tables above the benchmark's sizes; reviewing `pir/ipir/` (F9, F10).
- Reading the papers' reference implementations, which may hold the plaintext modulus the papers leave out (P4).
- The parts of the papers the code does not use: InsPIRe §4–§6 (its own PIR constructions), ReinsPIRe §4 and
  Appendix B.2 (verification), and the proofs of the noise theorems, which were applied, not re-derived.
- Attacks outside the four of B.3, and any analysis of the key-dependent-message assumption itself.
- The x86 SIMD paths, the dithered variant and the one-mask mode.

## Reproduction

In `/Users/edwardalvarado/todo/Umbra/resources/00058-poc-ipir/review/`:

- `numcheck/`: `cargo build --release`, then `./target/release/numcheck <d> <rows> <cols> <mask bits>
  <random|ffff|zero> <rows to check>`; logs `run-small.log`, `run-2048-random.log`, `run-2048-ffff.log`.
- `estimate/`: `estimate_pss.py` and its output `estimate.jsonl`; `lattice-estimator/` is the clone at `53da598`.
- `cert/`: `./run-cert.sh <rows> <cols>` runs upstream's `native_noise <rows> <cols> 54 29 --two-mask` (built with
  `--locked` into `target-upstream/`) and `certify_native.py --screens`; outputs `noise-*.json`, `cert-*.json`.
