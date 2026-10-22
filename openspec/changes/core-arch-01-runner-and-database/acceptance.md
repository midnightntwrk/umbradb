# Acceptance — CORE-ARCH project 1: runner and database

Every criterion is numbered, individually checkable, and tagged with how it is verified:

| Tag | Meaning (AGENTS.md stage 1) |
|---|---|
| `[CI]` | CI test |
| `[PROP]` | Property test (fast-check, seed recorded) |
| `[FAULT]` | Crash or fault injection |
| `[DIFF]` | Differential (two backends, or two runs) |
| `[STATIC]` | Static check (type check, lint, a test over repository files) |
| `[DOC]` | Documentation artifact |
| `[MANUAL]` | Manual evidence recorded in the pull request |

Database tests run against PostgreSQL 17 in Docker (Testcontainers, random free ports ≥ 10000, torn down afterwards)
and against PGlite in Node.js. "Both backends" means the criterion runs once on each.

## Definition of done

1. Every task in `tasks.md` is checked, each with its named criteria demonstrated by a passing test — not asserted.
2. Every criterion below passes; every id of §9 is in the required-test manifest and passes in the conformance gate.
3. **Every negative control has been observed failing** (A11, A13, A50, A56): a control never seen to fire is not
   evidence.
4. The retirement list of `design.md` §8 is applied exactly (A5) and approved by the owner in the pull request.
5. The cold adversarial review of the spec and of the code, the spec-compliance and release lanes, and the fix check
   are recorded in the pull request (`AGENTS.md`).

## 1. Library surface

- **A1** `[STATIC]` A test pins the sorted value exports and the type exports of `"."` to `design.md` §7; adding or
  removing an export fails it with the name. (LS-1)
- **A2** `[STATIC]` The pack smoke installs the packed tarball in a clean consumer and type-checks a file importing every
  §7 export; a second file importing any of `PgTemporalKV`, `PgCheckpointStore`, `PgWatermarks`,
  `PgTransactionLeaseLayer`, `PgWalletStateEnvelopeStore`, `saveAndAdvance` fails to type-check. (LS-2)
- **A3** `[STATIC]` The packed tarball contains no file under `legacy/`; the TypeScript build and the conformance run
  include no file from `legacy/`; `legacy/transaction-history/` holds the source and its tests. (LS-3)
- **A4** `[DOC]` `package.json` version is `0.10.0`; `CHANGELOG.md`'s `0.10.0` section opens with a breaking-change
  notice naming the removed exports and stating that 0.9.5 databases are not migrated. (LS-4)
- **A5** `[STATIC]` A test compares the required-test manifest, `stryker.conf.json` `mutate`, the coverage floors of
  `vitest.config.ts` and the file list of `Formal/Lean` with the lists in `design.md` §8 and fails on any difference.
  (LS-5)
- **A6** `[CI]` `umbradb run` prints the usage and exits 2; `umbradb` with no argument does the same. (LS-6)

## 2. Database API

- **A7** `[DIFF]` The database-API conformance suite (A8–A19's single-process tests) passes on both backends with
  identical query results. (DB-1)
- **A8** `[PROP]` For random interleavings of a writer committing heights and readers running multi-statement reads,
  every read handle's statements see one height and report it; on PGlite and PostgreSQL. (DB-2)
- **A9** `[CI]` Query results map `bigint` → `bigint`, `bytea` → `Uint8Array`, `numeric` → decimal string, `jsonb` →
  parsed JSON, on both backends. (DB-2)
- **A10** `[CI]` A block write handle used after its `on-db-write` returns, or a schema write handle used after its
  `on-start-db` returns, fails with `handle-closed`, which halts processing. (DB-3)
- **A11** `[CI]` On PGlite, under a constant read load, an instrumented test records zero outside reads between any
  block's `BEGIN` and `COMMIT` over 200 blocks; **negative control:** a build flag that lets reads bypass the queue
  makes the test fail. (DB-4)
- **A12** `[CI]` On PostgreSQL, a reader polling during an open block transaction never sees a row of that block before
  its COMMIT. (DB-5)
- **A13** `[CI]` On both backends, module `a` writing into module `b`'s table through its write handle is rejected by
  the database with a permission error, the block rolls back and processing halts; writing its own table succeeds;
  **negative control:** granting `a`'s role `INSERT` on `b`'s table makes the test fail. (DB-6)
- **A14** `[CI]` A consumer changes a provider's table through the provider's `SECURITY DEFINER` function and is
  rejected on a direct `UPDATE` of the same table, on both backends. (DB-7)
- **A15** `[CI]` Schemas are named after module ids (`-` → `_`); a shared item gets one schema named after it; two
  providers of one shared item with different migrations refuse startup naming the item. (DB-8)
- **A16** `[CI]` A changed checksum of an applied migration, and a migration recorded as applied but missing from the
  build, each refuse startup with module, migration id and checksums, before any migration runs; a migration that fails
  halfway leaves none of its changes and no `migrations` row. (DB-9)
- **A17** `[FAULT]` A second writer refuses with `writer-lock-held` on PostgreSQL and on PGlite (lock file); after the
  writer connection is terminated, the writer re-acquires the lock before its next write; if another process took the
  lock meanwhile, processing halts; after a SIGKILL of a PGlite process, its stale lock file is taken over at the next
  start. (DB-10)
- **A18** `[CI]` On PostgreSQL, startup refuses with `fsync=off`, with a detected transaction pooler, and with
  `full_page_writes=off` unless `fullPageWritesOffAllowed` is set; on PGlite, startup refuses without the development
  opt-in. (DB-11, CF-9)
- **A19** `[FAULT]` Terminating the writer's backend mid-transaction yields `connection-lost` with `retryable: true`; a
  constraint violation yields a not-retryable error. (DB-12)

## 3. Modules

- **A20** `[STATIC]` A type test shows a declaration with an unknown point name is a type error; `[CI]` the same
  declaration built without types is refused at startup with `unknown-point`. (MD-1)
- **A21** `[CI]` A table-driven test triggers each refusal of MD-2 (duplicate id, `core-` and `on-` prefixes, no
  requirement, item without lifetime, table item without kind, field without kind) and checks its code and names. (MD-2)
- **A22** `[CI]` A table-driven test triggers each refusal of MD-3 (missing provider, overlapping providers, cycle,
  uncovered range) and checks the code, range, module and item. (MD-3)
- **A23** `[CI]` A module with `startsMidChain: false` starting above S is refused; with `true` and mid-chain providers
  it is accepted. (MD-4)
- **A24** `[CI]` A development-only module without the opt-in is refused, and accepted with it. (MD-5)
- **A25** `[CI]` Two providers of one shared item with adjacent ranges are accepted and a consumer reads one continuous
  table; overlapping ranges are refused. (MD-6)

## 4. Configuration

- **A26** `[CI]` A table of non-plain values (function, class instance, `undefined`, bigint, 1.5, −1, 2^53) each refuses
  startup with `not-plain-data` and its path. (CF-1)
- **A27** `[STATIC]` Type tests (`// @ts-expect-error`) show that a misspelled `core` field, a wrong field type and a
  module `entry` with another module's settings are type errors. (CF-2)
- **A28** `[CI]` Entry-shape violations (unknown property, `stop < start`, bad hex) and schema violations each refuse
  startup naming the entry and field; absent fields take declared defaults. (CF-3)
- **A29** `[CI]` With a password in `database`, the password appears in neither `/config`, `/status` nor the captured
  logs. (CF-4, AE-6)
- **A30** `[CI]` A configuration omitting a recorded entry refuses with `missing-entry`; a later revision with the same
  id supersedes the earlier one from its start. (CF-5)
- **A31** `[CI]` With cursor c: changing a data field or the version of an entry starting ≤ c refuses with
  `changes-past`; changing a `stop` that is above c in both values is accepted; a revision starting above c is
  accepted and recorded in the same transaction; changing an operational field leaves `core_chain.config` unchanged.
  (CF-6)
- **A32** `[PROP]` For random data-field objects, `data_hash` is independent of property order and changes when any
  value changes. (CF-7)
- **A33** `[CI]` A build whose version is older, and one whose version is newer, than the revision covering cursor + 1
  each refuse with `upgrade-required` (entry, needed, build), and no `core_chain.migrations` row is added. (CF-8)
- **A34** `[CI]` PGlite and a development-only module each refuse without `developmentOptIn`, naming the feature.
  (CF-9)
- **A35** `[CI]` `umbradb config check` exits 0 on a valid file, and on a file with one type error and one schema error
  prints both with their paths and exits non-zero, opening no database. (CF-10)

## 5. Runner

- **A36** `[CI]` A recording module observes the point sequence of RN-1 for every height of an in-memory source, and
  never observes `on-best-block` or `on-rollback`. (RN-1)
- **A37** `[CI]` After 50 heights with test modules, every row in the database is in a schema of a module, a backbone
  part, `core_chain` or `core_digest`, written through a handle. (RN-2)
- **A38** `[PROP]` For random acyclic module graphs (up to 12 modules), the `on-db-write` order is backbone, then Kahn
  order with the smallest-id tie-break, then `core-digest`; in parallel points no callback starts before every module it
  requires has completed. (RN-3)
- **A39** `[CI]` Each point receives exactly the handle of `design.md` §2; `on-compute` reads report h − 1 and see no
  row written at h; a write attempted from `on-after-db-write` fails and halts. (RN-4)
- **A40** `[CI]` An item put in `on-parse` at h is visible to a requiring module's `on-compute` at h, invisible at
  h + 1; a second put of one item in one block is a callback error. (RN-5)
- **A41** `[CI]` On PostgreSQL, a catch-up of 100 heights produces 100 transactions committing one height each, in
  ascending order (transaction ids recorded per committed height). (RN-6)
- **A42** `[CI]` A module with revisions at 1 (`k = 1`) and 5 (`k = 2`) sees `k = 1` for heights 1–4 and `k = 2` from
  5, without `on-start-height` firing at 5. (RN-7)
- **A43** `[FAULT]` A thrown error in each of `on-fetch`, `on-parse`, `on-start-height`, `on-compute`, the first and the
  last `on-db-write` callback leaves no row of h, cursor h − 1, state `halted` with h, module and point; an error in
  `on-after-db-write` halts with h committed. (RN-8)
- **A44** `[FAULT]` Killing the process after a module's `on-start-height` at its start h and before h commits makes
  `on-start-height` fire again for that module at h after restart. (RN-9)
- **A45** `[CI]` With the core's stop at 10 and head 20, the cursor ends at 10, stopping modules and then the core get
  `on-stop-height`, the state is `stopped` and ready; restarting with cursor 10 processes nothing and fires the core's
  `on-stop-height` again. (RN-10)
- **A46** `[FAULT]` Killing the process after COMMIT of h and before `on-after-db-write` of h completes makes
  `on-after-db-write` fire for h after restart, before any callback of h + 1. (RN-11)
- **A47** `[CI]` A recorded revision with a newer version starting at 50 makes the runner commit 49 and enter
  `stopped` with `upgrade-required` (entry, needed, build), ready, serving reads at 49. (RN-12)
- **A48** `[FAULT]` SIGTERM during `on-db-write` of h ends with h fully present or fully absent, and a restart resumes
  from the cursor. (RN-13)
- **A49** `[CI]` With the source's head equal to the cursor, no transaction is open (checked in `pg_stat_activity` on
  PostgreSQL) and processing resumes when the head rises. (RN-14)
- **A50** `[FAULT]` **Crash sweep** on PostgreSQL with 300 heights and four test modules (one with `digest: true`):
  kill at each mandatory point — inside `on-compute`; inside `on-db-write` after the first and after the last callback;
  just before COMMIT; just after COMMIT, before `on-after-db-write` — and at 100 random points (seeded; the seed is
  recorded; height uniform over the range, point uniform over the instrumented points); after every restart the run
  completes and its contents hash equals an uninterrupted run's. **Negative control:** a runner variant that commits
  the cursor in a transaction separate from the modules' writes is detected by the sweep. (RN-6, RN-8, RN-11)
- **A51** `[DIFF]` The same in-memory chain and configuration, run once uninterrupted and once restarted 20 times,
  give equal contents hashes and equal digests, on each backend; and PostgreSQL and PGlite give equal contents hashes.
  (RN-6, DT-3, DT-5)

## 6. Determinism

- **A52** `[CI]` The encoder's output equals RFC 8949 Appendix A for every example in its subset (integers 0, 1, 10,
  23, 24, 100, 1000, 1000000, 1000000000000, 18446744073709551615, −1, −10, −100, −1000; text and byte strings; arrays
  and maps). (DT-1)
- **A53** `[PROP]` For random `jsonb` objects, encoded map keys are in RFC 8949 §4.2.1 order and the encoding is
  independent of insertion order; `numeric` values with a fraction and non-integer JSON numbers fail to encode. (DT-1)
- **A54** `[DIFF]` Tables with `text`, `bytea` and `bigint` primary keys list rows in the same order on both backends,
  matching DT-2 (e.g. `"B" < "a" < "b"`). (DT-2)
- **A55** `[DIFF]` The same rows give the same contents hash on both backends; changing one byte of one row changes it.
  (DT-3)
- **A56** `[PROP]` For random sequences of inserts, updates, deletes and same-value rewrites within one block, the
  recorded changes equal the difference between the table's states before and after the block, on both backends;
  **negative control:** disabling the trigger on one table makes the test fail. (DT-4)
- **A57** `[CI]` Two chains differing only in one module's value at height 7 give equal digests up to 6 and different
  digests from 7; the digest at a height with no change equals `SHA-256(previous ‖ CBOR([]))`. (DT-5)
- **A58** `[CI]` A migration creating a `serial`, identity, floating-point, or `now()`/`random()`-defaulted column in a
  public module table refuses startup with `non-deterministic-column`. (DT-6)

## 7. Storage helpers

- **A59** `[PROP]` (P9 retargeted) For random sequences of writes over heights, reading a cursor-table key returns its
  last write. (SH-1)
- **A60** `[PROP]` For random sequences of writes, same-value writes and deletes over heights, reading the
  height-versioned table at every height equals a reference model; versions of a key never overlap and consecutive
  versions meet at their boundary (`to` of one = `from` of the next, unless deleted between). (SH-2)
- **A61** `[CI]` A second write of one key in one block fails the block. (SH-3)

## 8. Admin endpoints

- **A62** `[CI]` The four endpoints answer on the admin listener and other paths answer 404; while a PGlite job holds
  the queue for 5 s, each answers within 1 s. (AE-1)
- **A63** `[CI]` During a 60 s `on-compute` callback, `/health/live` answers 200 throughout; when the heartbeat loop is
  stopped by a test hook, it answers 503 after the liveness timeout. (AE-2)
- **A64** `[CI]` Each state of AE-3 is reached in a test; a refused start keeps the process up with live 200 and ready
  503. (AE-3)
- **A65** `[CI]` With readiness lag 10 and lag 500, ready answers 503, then 200 once the lag is ≤ 10; `stopped` answers
  200. (AE-4)
- **A66** `[CI]` `/status` and `/config` responses validate against JSON schemas committed with the tests; `cursor` is
  `null` before block S commits. (AE-5)
- **A67** `[CI]` A halt caused by an error whose message contains a secret shows the error code, height, module and
  point, and the secret appears nowhere in the response. (AE-6)

## 9. Test tape

- **A68** `[CI]` Tapes round-trip through the reader and writer byte for byte; a malformed line fails with
  `bad-tape-record` and its line number; the tape id is the SHA-256 of the file. (TT-1)
- **A69** `[CI]` The tape node answers repeated calls by occurrence and repeats the last answer; an unrecorded call
  gets `not-on-tape`. (TT-2)
- **A70** `[CI]` Subscriptions deliver in file order after the preceding calls; `disconnect` drops the connection and
  the next session continues; `fault` records time out or fail the next matching call. (TT-3)
- **A71** `[CI]` A session against a scripted JSON-RPC server, recorded by the builder and replayed by the tape node,
  gives byte-identical answers and notifications; each variant transform produces its expected tape. `[MANUAL]` The
  same record-and-replay against a real Midnight node (local devnet or Stagenet) is recorded in the pull request with
  the tape's SHA-256. (TT-4)

## 10. Required test ids added to the manifest

Each id is a `[[id]]` token in its test title (`test/integration/required-tests.manifest.json`); the pinned count becomes
4 (kept harness ids) + 13.

| Id | Criterion |
|---|---|
| `runner.crash-sweep.contents-hash-equal` | A50 |
| `runner.crash-sweep.negative-control-fires` | A50 |
| `runner.restart-20.contents-hash-equal` | A51 |
| `runner.fault.pre-commit-failure-leaves-nothing` | A43 |
| `runner.fault.start-height-at-least-once` | A44 |
| `runner.fault.after-write-at-least-once` | A46 |
| `runner.fault.sigterm-in-transaction` | A48 |
| `db.writer-lock.single-writer` | A17 |
| `db.connection-lost.retryable` | A19 |
| `db.pglite.no-outside-read-in-transaction` | A11 |
| `db.pglite.no-outside-read.negative-control-fires` | A11 |
| `db.roles.cross-schema-write-rejected` | A13 |
| `determinism.contents-hash.cross-backend` | A55 |
