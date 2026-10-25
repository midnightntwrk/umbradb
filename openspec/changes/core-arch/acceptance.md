# Acceptance — CORE-ARCH: the standalone indexer's core architecture

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
| `[MEASURE]` | A measurement run in CI and reported; it fails only if it cannot run, never on its figures (Q72) |

Database tests run against PostgreSQL 18 in Docker (owner decision Q82; Testcontainers, random free ports ≥ 10000, torn
down afterwards) and against PGlite in Node.js. "Both backends" means the criterion runs once on each. Tapes (TT-1) are
identified by their SHA-256; the large ones (stagenet, preview and mainnet ranges, the devnet fork) are stored outside
git as pinned release assets that CI downloads and verifies.

## Definition of done

1. Every task in `tasks.md` is checked, each with its named criteria demonstrated by a passing test — not asserted.
2. Every criterion below passes; every id of §17 is in the required-test manifest and passes in the conformance gate.
3. **Every negative control has been observed failing** (A11, A13, A50, A56, A105, A134): a control never seen to
   fire is not evidence.
4. The retirement list of `design.md` §13 is applied exactly (A5) and approved by the owner in the pull request.
5. The cold adversarial review of the spec and of the code, the spec-compliance and release lanes, and the fix check
   are recorded in the pull request (`AGENTS.md`).

## 1. Library surface

- **A1** `[STATIC]` A test pins the sorted value exports and the type exports of `"."` to `design.md` §12; adding or
  removing an export fails it with the name. (LS-1)
- **A2** `[STATIC]` The pack smoke installs the packed tarball in a clean consumer and type-checks a file importing
  every §7 export; a second file importing any of `PgTemporalKV`, `PgCheckpointStore`, `PgWatermarks`,
  `PgTransactionLeaseLayer`, `PgWalletStateEnvelopeStore`, `saveAndAdvance` fails to type-check. (LS-2)
- **A3** `[STATIC]` The packed tarball contains no file under `legacy/`; the TypeScript build and the conformance run
  include no file from `legacy/`; `legacy/transaction-history/` holds the source and its tests. (LS-3)
- **A4** `[DOC]` `package.json` version is `0.10.0`; `CHANGELOG.md`'s `0.10.0` section opens with a breaking-change
  notice naming the removed exports and stating that 0.9.5 databases are not migrated. (LS-4)
- **A5** `[STATIC]` A test compares the required-test manifest, `stryker.conf.json` `mutate`, the coverage floors of
  `vitest.config.ts` and the file list of `Formal/Lean` with the lists in `design.md` §13 and fails on any difference.
  (LS-5)
- **A6** `[CI]` `umbradb sync` and `umbradb` with no argument print the usage and exit 2; `umbradb run`, `config check`,
  `backup` and `restore` are recognized. (LS-6)

## 2. Database API

- **A7** `[DIFF]` The database-API conformance suite (A8–A19's single-process tests) passes on both backends with
  identical query results. (DB-1)
- **A8** `[PROP]` For random interleavings of a writer committing heights and readers running multi-statement reads,
  every read handle's statements see one height and report it; on PGlite and PostgreSQL. (DB-2)
- **A9** `[CI]` Query results map `bigint` → `bigint`, `bytea` → `Uint8Array`, `numeric` → decimal string, `jsonb` →
  parsed JSON, on both backends; the `jsonb` values `9007199254740992` and `9007199254740993` read back as two
  different `bigint`s, and `42` as the number 42. (DB-2)
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
- **A14** `[CI]` On both backends: a consumer changes a provider's table through the provider's `SECURITY DEFINER`
  function and is rejected on a direct `UPDATE` of the same table; a module that does not require the provider's item
  is denied `EXECUTE`. (DB-7)
- **A15** `[CI]` Schemas are named after module ids (`-` → `_`); a shared item gets one schema named after it; two
  providers of one shared item with different migrations, or with different `deterministic` flags (Q76), refuse startup
  naming the item; ids `core_chain`, `A-b`,
  `a--b`, `-a` and a 41-byte id fail with `bad-id`; a module and an item with the same name, and a module named `pg-x`
  or `public`, refuse startup naming both; two 40-byte ids differing only in their last character get two distinct
  roles. (DB-8, MD-2)
- **A16** `[CI]` A changed checksum of an applied migration, and a migration recorded as applied but missing from the
  build, each refuse startup with module, migration id and checksums, before any migration runs; with migrations `001`
  and `002` pending and `002` failing halfway, `001` is applied and recorded, nothing of `002` is visible or recorded,
  the module's `on-start-db` callback did not run, and startup refuses. (DB-9)
- **A17** `[FAULT]` A second writer refuses with `writer-lock-held` on PostgreSQL and on PGlite; after the PostgreSQL
  writer connection is terminated, the writer re-acquires the lock before its next write, and if another process took it
  meanwhile, processing halts; a PGlite writer stopped with `SIGSTOP` for 5 minutes keeps its lock — a second process
  refuses — and continues after `SIGCONT`; after a `SIGKILL` the restarted process takes the lock at once and continues
  from the cursor; ten processes started together against one PGlite directory end with exactly one running. (DB-11)
- **A18** `[CI]` On PostgreSQL, startup refuses with `fsync=off`, with a detected transaction pooler, and with
  `full_page_writes=off` unless `fullPageWritesOffAllowed` is set; on PGlite, startup refuses without the development
  opt-in. (DB-12, CF-9)
- **A19** `[FAULT]` Terminating the writer's backend mid-transaction yields `connection-lost` with `retryable: true`; a
  constraint violation yields a not-retryable error. (DB-13)
- **A72** `[CI]` A module version with `requiresResync: true` is refused with `requires-resync` on a database whose
  committed heights are covered by another version of that module, before any migration runs; it is accepted on an
  empty database and still accepted after that database committed blocks and restarted; `[DOC]` the module guide states
  the additive-only rule for upgrade migrations. (DB-10)
- **A73** `[CI]` On both backends, `TRUNCATE` of a module's own table in `on-db-write` fails with
  `truncate-not-allowed` and the block rolls back; the same statement in a migration succeeds. (DB-14)
- **A138** `[CI]` The `deterministic_postgresql` suite (`test/deterministic-postgresql/`) runs every rule of
  `design.md` §4's component table on PostgreSQL 18 and on PGlite and passes on both, with the same refusal messages; a
  test over the sources finds that `src/deterministic-postgresql/` imports nothing else of `src/`, and that the pinned
  settings, the column-type rules and the result mapping are defined nowhere else; its coverage floor is 95/90. (DT-6,
  DB-2, DB-14, DB-15, Q69)
- **A139** `[DIFF]` On both backends, in processes whose time zone is `UTC`, `America/New_York` and `Asia/Tokyo`: a
  `timestamptz` `2025-05-21 14:30:00+00` reads as `2025-05-21T14:30:00Z` and `2025-05-21 14:30:00.123456+00` as
  `2025-05-21T14:30:00.123456Z`; a `timestamp` `2025-05-21 14:30:00` as `2025-05-21T14:30:00`; a `date` as `2025-05-21`;
  `infinity` and `-infinity` as those words; arrays of them element by element, `NULL` as `null` — identical in every
  process. (DB-2, Q68)
- **A141** `[FAULT]` On PostgreSQL: a read for an API request running `pg_sleep(60)` with `apiReadTimeoutMs` 1000 fails
  with `query-timeout`, not retryable, within 2 s, and the next read on that connection succeeds; a read for an API
  request that awaits 2 s between two statements fails with `query-timeout`, and the next read succeeds on a new
  connection. On PGlite an API read sets neither timeout. On both backends, with database (on PGlite: configuration
  file) defaults `statement_timeout`, `lock_timeout`, `idle_in_transaction_session_timeout`, `transaction_timeout` and
  `idle_session_timeout` of 1 s, a 5 s migration, a block transaction left idle 5 s while a callback awaits, a
  callback's read running 5 s, and a writer left idle 2 s between two blocks all complete, the writer keeping its
  session and with it the writer lock, and `SHOW` in each reports 0. (DB-15, Q71, Q93)

- **A144** `[CI]` A module that requires `db` gets an object offering `read` only — a type test and a runtime check find
  no `transaction`, `close` or write; each `db.read` sees one committed height and reports it; on PGlite a `db.read`
  from inside the module's own `on-db-write` fails at once with `nested-call`, and on PostgreSQL it returns the data
  committed before the block; `[DOC]` the module guide states when to use the handle and when `db.read`. (CD-1, RN-4,
  DB-4, Q73)
- **A148** `[STATIC]` Every PostgreSQL image the repository pins is one `postgres:18-alpine` pin (tests, Testcontainers
  helpers, benchmarks, the pack smoke test, the image-pin agreement check), and the conformance suite passes on it; the
  facts `design.md` §14 records as checked on PostgreSQL 17.11 are re-checked on 18 by the tests that rely on them.
  (Q82)
## 3. Modules

- **A20** `[STATIC]` A type test shows a declaration with an unknown point name is a type error; `[CI]` the same
  declaration built without types is refused at startup with `unknown-point`. (MD-1)
- **A21** `[CI]` A table-driven test triggers each refusal of MD-2 (duplicate id, `core-` and `on-` prefixes, no
  requirement, item without lifetime, table item without kind, field without kind) and checks its code and names. (MD-2)
- **A22** `[CI]` A table-driven test triggers each refusal of MD-3 (missing provider, overlapping providers, cycle,
  uncovered range) and checks the code, range, module and item; a fault only in ranges that end at or below the cursor
  is not refused, except a cycle in the range that ends at the cursor. (MD-3, Q97)
- **A23** `[CI]` A module with `startsMidChain: false` starting above S, or at an S above 0, is refused; with `true` it
  is accepted, also when a provider it requires cannot start mid-chain but is active at the height before its start, and
  refused when such a provider starts with it; a start at or below the cursor is not checked. (MD-4, Q96, Q97, Q98)
- **A24** `[CI]` A development-only module without the opt-in is refused, and accepted with it; one whose entries all
  end below the cursor is not refused. (MD-5, Q97)
- **A25** `[CI]` Two providers of one shared item with adjacent ranges are accepted and a consumer reads one continuous
  table; overlapping ranges are refused. (MD-6)

## 4. Configuration

- **A26** `[CI]` A table of non-plain values (function, class instance, `undefined`, bigint, 1.5, −1, 2^53) each refuses
  startup with `not-plain-data` and its path. (CF-1)
- **A27** `[STATIC]` Type tests (`// @ts-expect-error`) show that a misspelled `core` field, a wrong field type and a
  module `entry` with another module's settings are type errors. (CF-2)
- **A28** `[CI]` Entry-shape violations (unknown property, `stop < start`, bad hex) and schema violations each refuse
  startup naming the entry and field; absent fields take declared defaults; an upgrade whose new schema renames a
  setting starts with the old revision written as a `versionEntry` equal to its recorded row; a `versionEntry` at or
  below the cursor that differs from its recorded row refuses startup; a `versionEntry` above the cursor is recorded
  with id, start, stop and version only, and one that carries a `config` is refused; an entry above the cursor may
  change between restarts and is re-recorded. (CF-3, CF-6)
- **A29** `[CI]` With a password in `database`, the password appears in neither `/config`, `/status` nor the captured
  logs. (CF-4, AE-6)
- **A30** `[CI]` A configuration omitting a recorded entry refuses with `missing-entry`; a later revision with the same
  id supersedes the earlier one from its start. (CF-5)
- **A31** `[CI]` With cursor c: changing a data field or the version of an entry starting ≤ c refuses with
  `changes-past`; changing a `stop` that is above c in both values is accepted; a revision starting above c is
  accepted and recorded in the same transaction; changing an operational field leaves `core_chain.config` unchanged;
  after the core stopped at its `stop` 10, restarting with `stop` 20, or without a stop, is accepted with no history
  change and processing continues; `core` rows of `core_chain.config` always have a null `stop`. (CF-4, CF-6, CF-7)
- **A32** `[PROP]` For random data-field objects, `data_hash` is independent of property order and changes when any
  value changes. (CF-7)
- **A33** `[CI]` A build whose version is older, and one whose version is newer, than the revision covering cursor + 1
  each refuse with `upgrade-required` (entry, needed, build), and no `core_chain.migrations` row is added. (CF-8)
- **A34** `[CI]` PGlite and a development-only module each refuse without `developmentOptIn`, naming the feature.
  (CF-9)
- **A35** `[CI]` `umbradb config check` exits 0 on a valid file; on a file with one type error and one schema error it
  prints both with their paths and exits non-zero, opening no database, and says the history checks were not run; with
  `--database` it reports `changes-past` for a changed recorded entry, exits non-zero, and leaves the database unchanged
  (row counts and `core_chain.migrations` compared before and after). (CF-10)

## 5. Runner

- **A36** `[CI]` A recording module observes the point sequence of RN-1 for every height of an in-memory source, and
  never observes `on-best-block` or `on-rollback`. (RN-1)
- **A37** `[CI]` After 50 heights with test modules, every row in the database is in a schema of a module, a backbone
  part, `core_chain` or `core_digest`, written through a handle. (RN-2)
- **A38** `[PROP]` For random acyclic module graphs (up to 12 modules), the `on-db-write` order is backbone, then Kahn
  order with the smallest-id tie-break, then `core-digest`; in parallel points no callback starts before every module it
  requires has completed. (RN-3)
- **A39** `[CI]` Each point receives exactly the handle of `design.md` §2 (`on-finalized` a read handle at the cursor);
  `on-compute` reads report h − 1 and see no row written at h; a write attempted from `on-after-db-write` fails and
  halts. (RN-4)
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
  `on-after-db-write` fire for h after restart, before any callback of h + 1, with h's height, hash and settings and no
  `block` items; `on-after-db-write` never receives `block` items, re-delivered or not. (RN-5, RN-11)
- **A47** `[CI]` A build carrying module `m` 1.0.0 at cursor 20 records `versionEntry({ id: "m", start: 50, version:
  "1.1.0" })` without configuration; the runner then commits 49, completes 49's `on-after-db-write` and
  `on-stop-height`, and enters `stopped` with `upgrade-required` (entry, needed, build), ready, serving reads at 49; a
  build carrying 1.1.0 writes that revision with `m.entry`, which is validated against its schema and recorded, and
  continues from 50; no secret or operational field of that revision was ever stored. (RN-12, CF-3, CF-8)
- **A48** `[FAULT]` SIGTERM during `on-db-write` of h ends with h fully present or fully absent, and a restart resumes
  from the cursor. (RN-13)
- **A49** `[CI]` With the source's head equal to the cursor, no transaction is open (checked in `pg_stat_activity` on
  PostgreSQL) and processing resumes when the head rises. (RN-14)
- **A50** `[FAULT]` **Crash sweep** on PostgreSQL with 300 heights and four test modules (all digested, DT-4):
  kill at each mandatory point — inside `on-compute`; inside `on-db-write` after the first and after the last callback;
  just before COMMIT; just after COMMIT, before `on-after-db-write` — and at 100 random points (seeded; the seed is
  recorded; height uniform over the range, point uniform over the instrumented points); after every restart the run
  completes and its contents hash equals an uninterrupted run's. **Negative control:** a runner variant that commits
  the cursor in a transaction separate from the modules' writes is detected by the sweep. (RN-6, RN-8, RN-11)
- **A51** `[DIFF]` The same in-memory chain and configuration, run once uninterrupted and once restarted 20 times,
  give equal contents hashes and equal digests, on each backend; and PostgreSQL and PGlite give equal contents hashes.
  (RN-6, DT-3, DT-5)
- **A74** `[CI]` A process item published in its provider's `on-start-db` is visible to a requiring module from
  `on-start-api` on; publishing twice, publishing from `on-compute`, or publishing an undeclared item fails the
  callback; a required process item left unpublished refuses startup with `process-item-missing`. (MD-7)
- **A75** `[CI]` Module HTTP handlers answer on `listen.api` with a read handle at the latest committed height; a
  subscription registered by a module is notified from its `on-after-db-write`; two modules registering the same route
  or subscription name refuse startup with `duplicate-api-route`; every chain-data HTTP response carries
  `X-Umbra-View: finalized`, `X-Umbra-Height` and `X-Umbra-Hash` of the height it read, a GraphQL response carries the
  same in `extensions` with its `data` unchanged, and a read before block S commits answers 503
  `no-committed-height`. (RN-15, RN-16)
- **A142** `[CI]` With `slowBlockMs` 1000, a test module whose `on-compute` awaits 3 s: the runner's published state
  (and `/status`, once `core-status` serves it) shows `slow-block` with the height, `on-compute` and the module within
  2 s; the height commits once, with no retry; the condition is gone after the commit; with `slowBlockMs` 5000 it never
  appears. (RN-17, AE-3, Q71)

## 6. Determinism

- **A52** `[CI]` The encoder's output equals RFC 8949 Appendix A for every example in its subset (integers 0, 1, 10,
  23, 24, 100, 1000, 1000000, 1000000000000, 18446744073709551615, −1, −10, −100, −1000; text and byte strings; arrays
  and maps); a `varchar` value encodes as the same text string and a `uuid` as a byte string of its 16 bytes (Q58).
  (DT-1)
- **A53** `[PROP]` For random `jsonb` objects, encoded map keys are in RFC 8949 §4.2.1 order and the encoding is
  independent of insertion order; `numeric` values with a fraction and non-integer JSON numbers fail to encode. (DT-1)
- **A54** `[DIFF]` Tables with `text`, `varchar`, `bytea`, `uuid`, `boolean` and `bigint` primary keys list rows in the
  same order on both backends, matching DT-2 (e.g. `"B" < "a" < "b"`, `false` before `true`). (DT-2)
- **A55** `[DIFF]` The same rows give the same contents hash on both backends; changing one byte of one row changes it.
  (DT-3)
- **A56** `[PROP]` For random sequences of inserts, updates, deletes and same-value rewrites within one block, the
  recorded changes equal the difference between the table's states before and after the block, on both backends;
  `TRUNCATE` is refused (A73), so no change escapes the triggers; **negative control:** disabling the trigger on one
  table makes the test fail. (DT-4)
- **A57** `[CI]` Two chains differing only in one module's value in its table t at height 7 give equal rows of
  `core_digest.tables` for every other table and, for t, the same digest up to height 6 and a different one from 7; a
  table without changes at a height keeps its row; a table's first digest is `SHA-256(32 zero bytes ‖ CBOR(h) ‖ changes
  at h)`; checkpoints exist exactly at the heights h ≥ S with h mod 14,400 = 0 and equal the tables' rows at those
  heights; every module table is digested with no flag set, and a table declared `deterministic: false` is not. (DT-4,
  DT-5)
- **A145** `[DIFF]` On both backends: a `timestamptz` column encodes `2025-05-21 14:30:00.123456+00` as the integer
  1747837800123456, orders as a key by time (a fraction sorts after the whole second it follows), and refuses
  `infinity` when hashed; a `timestamp`, `date`, `time`, `timetz` or `interval` column is refused at startup with "use
  `timestamptz`, written with `Z`"; a `bigint` and a `text` column holding times are accepted; the node's block time
  in milliseconds is stored in `core_block_commit.blocks.block_time` exactly. (DT-1, DT-2, DT-6, Q74)
- **A147** `[CI]` On both backends, in the core and in a private process: a `table` item declared `deterministic: false`
  with a `now()` default and a `serial` column starts; two databases differing only in that table's rows have equal
  contents hashes, and a database without the table hashes differently; the digests skip it; a backup carries its rows
  and its sequence's position, so after a restore the next `serial` value follows the restored ones; the same table
  without the flag refuses startup with `non-deterministic-column`. (MD-1, DT-3, DT-4, DT-6, BK-2, Q76)
- **A58** `[CI]` A migration creating a `serial`, identity or floating-point column, or a column whose default is not
  immutable (`now()`, `CURRENT_TIMESTAMP`, `random()`, `gen_random_uuid()`, `nextval()`), in a module table refuses
  startup with `non-deterministic-column`, while an immutable default (`'abc'`, `1 + 2`, `lower('X')`) and a stored
  generated column are accepted; a sequence or an unlogged table in a module schema with `non-deterministic-table`
  (Q61); a table without a primary key with `no-primary-key`; a `numeric`, `jsonb` or array key with
  `unsupported-key-type`; a `numeric(38,2)`, `timestamp`, `date`, `time`, `interval`, `json`, `char(4)`, `money`, enum
  or domain column with `unsupported-column-type`. Each message names the module, the table or sequence, the column and
  its type where there is one, and gives the reason and the alternative of `design.md` §4; the contents hash refuses the
  same tables, sequences and columns with the same codes and messages, including in a table no module declared (Q58,
  Q61, Q75). A module writing `{"x": 1.5}`, `{"x": 1.0}` or `{"x": 100.00}` (Q57), or a JSON integer
  beyond the signed 64-bit range, to a `jsonb` column, or such a number inside a `jsonb[]`, fails the block, and so does
  `100.00`, `1.5`, `NaN`, `Infinity` or `-Infinity` in a `numeric` or `numeric[]` column; `{"x": 2}`, `{"x": 1e2}`
  (stored as `100`) and `100` succeed, and so does NULL in a nullable `numeric` column; on both backends. (DT-6)

## 7. Storage helpers

- **A59** `[PROP]` (P9 retargeted) For random sequences of writes over heights, reading a cursor-table key returns its
  last write. (SH-1)
- **A60** `[PROP]` For random sequences of writes, same-value writes and deletes over heights, reading the
  height-versioned table at every height equals a reference model; versions of a key never overlap and consecutive
  versions meet at their boundary (`to` of one = `from` of the next, unless deleted between). (SH-2)
- **A61** `[CI]` A second write of one key in one block fails the block. (SH-3)

## 8. Admin endpoints

- **A62** `[CI]` The four endpoints answer on the admin listener and other paths answer 404; while a PGlite job holds
  the queue for 5 s, and while a callback runs a 10 s synchronous loop on the main thread, each answers within 1 s.
  (AE-1)
- **A63** `[CI]` With a 5 s liveness timeout set for the test: during an `on-compute` callback that awaits a 15 s
  operation, `/health/live` answers 200 throughout; during one that runs a 15 s synchronous loop, it answers 503 after
  5 s while every endpoint keeps answering within 1 s; it answers 200 again once the loop ends. (AE-2)
- **A64** `[CI]` Each state of AE-3 is reached in a test; a refused start keeps the process up with live 200 and ready
  503. (AE-3)
- **A65** `[CI]` With readiness lag 10 and lag 500, ready answers 503, then 200 once the lag is ≤ 10; `stopped` answers
  200 even with lag 100 and readiness lag 10; `following` with following threshold 20, readiness lag 10 and lag 15
  answers 503. (AE-4)
- **A66** `[CI]` `/status` and `/config` responses validate against JSON schemas committed with the tests; `cursor` is
  `null` before block S commits. (AE-5)
- **A67** `[CI]` A halt caused by an error whose message contains a secret shows the error code, height, module and
  point, and the secret appears nowhere in the response. (AE-6)
- **A140** `[CI]` `GET /health/live`, `GET /health/ready`, `GET /status` and `GET /config` are provided by the backbone
  parts `core-health`, `core-status` and `core-config`, each in its own folder under `src/backbone/` with its tests
  beside it, and A62–A67 pass through them; the admin server mounts only backbone parts' endpoints; a refused process
  answers all four. (AE-1, Q70)

## 9. Test tape

- **A68** `[CI]` Tapes round-trip through the reader and writer byte for byte; a malformed line fails with
  `bad-tape-record` and its line number; the tape id is the SHA-256 of the file. (TT-1)
- **A69** `[CI]` The tape node answers repeated calls by occurrence and repeats the last answer; an unrecorded call
  gets `not-on-tape`; a call record with `delayMs: 2000` is answered no earlier than 2 s after the call, and the next
  record without delay. (TT-1, TT-2)
- **A70** `[CI]` Subscriptions deliver in file order after the preceding calls; `disconnect` drops the connection and
  the next session continues; `fault` records time out or fail the next matching call. (TT-3)
- **A71** `[CI]` A session against a scripted JSON-RPC server, recorded by the builder and replayed by the tape node,
  gives byte-identical answers and notifications; each variant transform produces the tape committed as its expected
  output (the delay transform sets `delayMs` on exactly the selected calls). `[MANUAL]` The
  same record-and-replay against a real Midnight node (local devnet or Stagenet) is recorded in the pull request with
  the tape's SHA-256. (TT-4)

## 10. Ingest

- **A76** `[FAULT]` Killing the process while 20 best blocks are queued leaves no row of a non-finalized block, on
  PostgreSQL. (IN-1)
- **A77** `[CI]` With S above the node's finalized head, the process stays `starting` with `waiting-for-node` and
  commits S once the head reaches it, with the anchor recorded in S's transaction; a bootstrap killed before S commits
  is repeated on the next start without error. (IN-2)
- **A78** `[CI]` A node with another genesis hash refuses startup with `genesis-mismatch`; a node whose finalized hash
  at the cursor differs refuses with `cursor-hash-mismatch`; a node whose head is below the cursor makes the process
  wait with `waiting-for-node`. (IN-3)
- **A79** `[CI]` With a tape whose finalized notifications report 10, 13, 13, 12, then a disconnect, then 20, heights
  11–20 commit once each in order; a block whose parent hash differs from the cursor halts with `parent-mismatch`; a
  finalized notification at or below the cursor with another hash halts with `finality-conflict`. (IN-4)
- **A80** `[CI]` During a catch-up of 1,000 heights with `prefetchWindow` 64, instrumentation never sees more than 64
  heights above the cursor fetched or held, and commits stay one per height in order. (IN-5)
- **A81** `[CI]` A best-chain-switch tape replacing queued 101–103 by 101′–104′ fires `on-rollback` once naming 101–103,
  and 101′ is not fetched again at finality (tape call counts); with `tipCap` 5 and finality stalled, the sixth best
  block is not queued and `/status` shows `finality-stall`. (IN-6)
- **A82** `[CI]` Block 0 is processed in both cases of IN-7 (genesis state including, and not including, block 0's
  transactions), with transactions numbered in body order and the root after block 0 matching the node's. (IN-7)
- **A83** `[CI]` A 1,000-height sync against the tape node uses only the methods of IN-8 (the tape node's call log);
  `[STATIC]` no source file imports the official indexer's client or a wallet SDK. (IN-8)
- **A84** `[CI]` A "state unavailable" answer for a finalized height halts with `node-requirement` and that height, with
  no retry (tape call count). (IN-9)
- **A85** `[FAULT]` A tape that drops the node connection for 2 minutes makes the process retry with back-off reaching
  `backoffCeilingMs` and report `node-retrying`, then resume with no height skipped or repeated; an error on a queued
  best block drops it without retry; a database connection terminated during `on-db-write` of h is retried with
  `database-retrying`: the items a module published in `on-parse` at h are still visible to its `on-compute` on the
  retry, the block is not parsed again, the ledger state is reloaded at the cursor, and h's root matches the node's.
  (IN-10)
- **A86** `[FAULT]` Terminating the writer's backend during COMMIT: when the server committed h, the cursor is h after
  reconnecting, h is not processed again and `on-after-db-write` fires for h; when it did not, h is processed again from
  `on-compute`; a cursor that is neither halts with `unexpected-cursor`. (IN-11)
- **A87** `[STATIC]` A test enumerates every refusal and halt code of `design.md` §11 and fails if one has no test that
  triggers it and checks its code. (IN-12)

## 11. Chain data

- **A88** `[CI]` After block S commits on an empty database, `core_chain.identity` holds the node's genesis hash, S and
  the anchor hash. (CD-1)
- **A89** `[CI]` A module requiring `block-body` reads at h the extrinsics `core-block-fetch` fetched for h, decoded
  with the metadata of h's parent state. (CD-2)
- **A90** `[CI]` After heights S…h commit, `core_block_commit.blocks` and `core_block_commit.hashes` each hold exactly
  one row per height with the node's hash, and the cursor is the last `blocks` row; a test source delivering, in a
  different height partition, a block whose parent hash correctly links to the cursor but whose own hash repeats an
  earlier block's makes that block fail with `duplicate-block-hash` (not `parent-mismatch`) and processing halt; the
  same block delivered with a fresh hash commits. (CD-3)
- **A91** `[CI]` `core-chain-events` stores every event of a range, and the events of a runtime-upgrade block U are
  decoded with the old runtime's metadata without error (devnet upgrade tape). (CD-4)
- **A92** `[CI]` Each transaction is parsed once (counted calls); a block with a system transaction between two regular
  ones stores them as 0, 1, 2 in that order; block 0's transactions are in body order. (CD-5)
- **A93** `[CI]` `TxApplied`, `TxPartialSuccess` and `ExtrinsicFailed` give `success`, `partial` and `failure`. (CD-6)

## 12. Ledger

- **A94** `[CI]` A block with an unknown `spec_version` halts with `unknown-runtime`; with no `MNSV` digest or two, with
  `bad-version-digest`; a block contradicting a pin, with `pin-mismatch`; the mainnet header fixture of block 1,774,492
  passes the built-in pin. (LG-1, LG-2)
- **A95** `[STATIC]` Every pin in the built-in tables has a height, a hash and a `spec_version` with a recorded source
  (the node it was read from and the U and F hashes); `[CI]` a configuration table "every `spec_version` → v8" parses
  every block of a devnet with v8. (LG-3)
- **A96** `[CI]` With a devnet runtime-upgrade tape, U is decoded with the old metadata and F with the new, and the
  metadata cache never holds the new metadata under the old `spec_version`; a parent runtime whose `spec_version`
  differs from the block's `MNSV` halts with `metadata-mismatch`. (LG-4)
- **A97** `[CI]` CI rebuilds every vendored ledger package from its pinned source and patches and gets the recorded
  SHA-256; a package file changed by one byte refuses startup with `package-hash-mismatch`. (LG-5)
- **A98** `[CI]` One adapter test suite runs against the v8 and the v9 adapters and passes on both; `versionName` and
  `rawPackages()` return the recorded release and packages; a state under the ledger's 1,024-byte embedding limit
  reloads by its `stateKey` (Q55); the v8 adapter's `decodeLogItem` returns null for every input and its `apply`
  returns no `logs` (Q54). (LG-6, LG-7, CC-2)
- **A99** `[CI]` State roots match the node's on: a preview range crossing the runtime 1.0.300 upgrade; a mainnet range
  from a backup taken before block 1,774,492 to 1,780,000; a mainnet range including block 1,788,980. (LG-8)
- **A100** `[CI]` On a devnet that starts on a v8 runtime and enacts the v9 upgrade (tape), the state is converted
  before F is applied, the root at F matches the node's, and the same holds when F has no transactions. (LG-9)
- **A101** `[CI]` During a 60 s ledger step in the worker, `/health/live` answers 200 and every endpoint answers within
  1 s. (LG-10)
- **A102** `[FAULT]` After a restart at cursor h the state loaded from the database has h's root and the next root
  matches; `[STATIC]` no table stores a whole serialized state; `[CI]` a stored node whose bytes no longer match its key
  fails the read. (LG-11)
- **A103** `[CI]` With `retainStates` 1,000 at cursor 5,000, loading 4,000 succeeds and 3,999 fails with
  `state-not-retained`; raising it by a revision fills the window from the revision; lowering it releases the leaving
  states in the revision's first block. (LG-12)
- **A104** `[CI]` With `retainStates` 0: contract C's state and zswap-state keys are stored at height 10; C changes at
  height 20; enough blocks pass for the ledger states holding the height-10 contract state to be released and for two
  sweep cycles to complete; the contract state and zswap state stored at height 10 still load from their keys; a
  control run without persisting them shows those nodes deleted. (LG-13)
- **A105** `[DIFF]` A reference model of LG-14 (an independent in-memory implementation in the tests) computes, for
  each block of a fixture built so that one marking round does not fit in the budget (K = 50, wide trees, interleaved
  new roots), the grey, marked and deleted sets; the implementation matches the model after every block on PostgreSQL
  and on PGlite; a node deleted by the sweep and needed again is reinserted; with `sweep: off` nothing is deleted;
  **negative control:** a sweep that takes grey keys in insertion order instead of byte order differs from the model
  on this fixture. (LG-14)
- **A106** `[CI]` A test package returning a wrong root for one block halts with `root-mismatch` and stores nothing of
  that block. (LG-15)
- **A107** `[CI]` `core_ledger_state.states`, `segment_results` and `events` hold the values of LG-16 for a tape range
  (first-free indexes and roots match the node's runtime calls where the node exposes them); enabling
  `core-ledger-state` above S without a restored backup refuses with `cannot-start-mid-chain`. (LG-16)
- **A137** `[CI]` A test module's ledger task decodes each contract call's arguments with the native parsed objects
  and `rawPackages()`, and its `on-compute` receives them as its `block` item; with that task and three modules reading
  `block-parsed`, the package's parse function runs once per transaction; a task returning a WASM-backed object, or
  throwing, fails the block with `callback-error` naming the module and the task; a task without `needsState` gets no
  state and runs mid-chain, while a module with a `needsState` task refuses to start where `core-ledger-state` is not
  active; no main-thread callback receives a native ledger object (each `block` item passes a `structuredClone` round
  trip). (LG-7, LG-17)

## 13. Contract data

- **A108** `[CI]` Two calls to one contract in one block give one `core_contract_states` row with the state after both;
  at F of the devnet fork, every contract gets a row. (CC-1)
- **A109** `[CI]` `core-contract-logs-full` stores the logs of applied segments and none from a failed fallible
  segment. (CC-2)
- **A110** `[DIFF]` A range with literal logs gives identical `contract_logs.logs` with `-full` and `-fast`; a malformed
  wrapper is stored as a version-0 `Misc` log by both; an oversized log is stored by neither; a log of a value read from
  state makes `-fast` halt with `fast-log-unsupported`. (CC-3)
- **A111** `[CI]` `-full` stopping at h, a backup at h, and the restored database continuing with `-fast` from h + 1
  give a continuous `contract_logs.logs`. (CC-4)

## 14. Private processes

- **A112** `[CI]` With a core and a private process running, the core's database connections reach only the public
  database. (PP-1)
- **A113** `[CI]` A private database bound to another public database refuses with `private-binding-mismatch`. (PP-2)
- **A114** `[FAULT]` Dropping the transport while the public cursor advances 50 heights: after reconnecting, the private
  process processes the 50 heights in order. (PP-3)
- **A115** `[CI]` Every message type round-trips through the zod schemas of `design.md` §8 and fails on a missing or
  mistyped field; a `read-result` carries its request's `id`, the height read (`null` on an empty public database) and,
  per statement, the column names and types with the rows, and a `bigint`, `numeric`, `bytea` and `jsonb` value each
  decode back to the value the core read; an `api-result` carries its request's `id`; an unknown `v` or `type`, or a
  message failing its schema, closes the connection; a second `hello` with a connected id is refused with
  `duplicate-instance`. (PP-4)
- **A116** `[CI]` An independent instance stopped for 100 blocks never pauses the core and catches up from public data.
  (PP-5)
- **A117** `[FAULT]` A stopped lockstep instance makes the core wait before `BEGIN` with no transaction open
  (`pg_stat_activity`) and `waiting-for-lockstep`, and resume when it reports; restarting the core while an instance is
  at the public cursor does not deadlock; a `report` hash mismatch halts that instance; a `needsLockstep` module refuses
  to run when `hello-ack` says `lockstep: false`. (PP-6)
- **A118** `[CI]` An instance listed after the public cursor passed it is refused with `lockstep-behind`, and the core
  waits and names it. (PP-7)
- **A119** `[CI]` A test key of an undeclared kind, or with bytes its module's `validateKey` rejects, refuses startup
  with `invalid-configuration`; a test key with start h fires `on-key` once before h's `on-compute` and is stored with
  `arrived_height` h when h commits; after a crash before that commit it is not stored, and after the restart it is
  admitted at h. (PP-8, CF-11)
- **A120** `[CI]` With a registered test key and 100 processed blocks, its bytes appear in no public table, log line,
  status field or API response; the core's `/status` shows only each instance's id, connection, lockstep flag and
  synced height. (PP-9, PP-10)
- **A146** `[CI]` A private module table with a `serial` column, a `now()` default or a `double precision` column
  refuses the private process's startup with the same code and message as in the core; two private instances with the
  same configuration (test keys included), bound to the same public database, have equal contents hashes at the same
  height. (DT-3, DT-6, PP-1, Q75)
- **A121** `[CI]` With `tls` set, a private process without a certificate is refused by the core and one with a
  trusted certificate is accepted. (PP-11)
- **A122** `[CI]` `umbradb backup` of a private database refuses with `private-backup-refused` without the development
  opt-in, and writes no file. (PP-12)
- **A123** `[CI]` A private process restarting with a test key it already admitted at its start keeps its
  `arrived_height`; the same key with another start refuses with `test-key-conflict`. (CF-11)

## 15. Backups and browser

- **A124** `[CI]` On both backends, a backup written while blocks commit holds every table at its manifest's height:
  restored, its contents hash equals the manifest's and the source's at that height; with `backupAtStop` set, the core's
  stop writes one backup for that height; without the tool (`pg_dump` 18, or `pglite-tools`), `umbradb backup` fails
  with `backup-tools-missing`, naming what to install, and writes no file. (BK-1, BK-2)
- **A125** `[DIFF]` A backup written on PostgreSQL 18 restores on PGlite and one written on PGlite restores on
  PostgreSQL 18, each with every check of BK-3 passing; a restored database's schemas, tables, sequences and functions
  have the owners and grants of a database built by migrations (compared in the catalogs). (BK-2, BK-3)
- **A126** `[CI]` Each restore refusal of BK-3 is triggered and checked before or after loading, as BK-3 orders them,
  including a changed value in an `INSERT` of a row the contents hash covers (DT-3) giving `contents-hash-mismatch`;
  after every refusal the target is as it was before the restore: unchanged after `restore-target-not-empty`, empty
  after every other. (BK-3)
- **A127** `[FAULT]` A restore killed while running the file's SQL leaves the target empty, and a new restore into it
  then succeeds. (BK-3)
- **A128** `[DIFF]` A backup written on PostgreSQL 18 at h, restored on PGlite and on PostgreSQL 18, and continued to
  h + 100, gives the same contents hash and the same per-table digests as an instance that never stopped. (BK-4)
- **A129** `[CI]` In Chrome (headless, in CI), the page runs the core, ledger and a private instance in workers on
  PGlite with the development opt-in, in memory and with OPFS; with OPFS, a reload resumes from the cursor with the same
  contents hash, and a second tab on the same database refuses with `writer-lock-held`. (BR-1)
- **A130** `[CI]` In Chrome, an empty profile records S as the finalized head at creation; enabling `core-ledger-state`
  without a restored backup refuses and names it. (BR-2)
- **A131** `[CI]` In Chrome, the page's network requests go only to the node; backing up the page's database and
  restoring the file in a fresh profile runs every BK-3 check and continues from its height + 1. (BR-3, BK-5)
- **A132** `[DIFF]` The same tape and configuration in Chrome and in Node.js on PGlite give equal contents hashes.
  (BR-4)

## 16. Whole system

- **A133** `[CI]` Stagenet blocks 0–10,000 and preview blocks 0–10,000, from genesis, with every core module except
  `-fast`, sync with every state root matching the node's. (IN-4, LG-15)
- **A134** `[FAULT]` The crash sweep of A50 repeated on the stagenet 0–10,000 tape with every core module except
  `-fast`: every mandatory point (inside `on-compute`; inside `on-db-write` after the first and the last callback; just
  before and just after COMMIT; during a sweep step) and 100 seeded random points leave no partial block, no skipped
  height, and a contents hash equal to an uninterrupted run's; **negative control:** a build that writes the ledger
  nodes in a transaction of their own is detected. (RN-6, IN-1, LG-11, LG-14)
- **A135** `[DIFF]` The same range and configuration on PostgreSQL, on PGlite in Node.js and on PGlite in Chrome give
  equal contents hashes. (DT-3, BR-4)
- **A136** `[MANUAL]` Ingest throughput over stagenet 0–10,000 with every core module except `-fast`, on PostgreSQL 18,
  median of 3 runs — each from an empty database on a freshly started PostgreSQL, against the same local archive node
  in Docker after one warm-up pass, timed from process start to the commit of block 10,000 — is equal to or better than
  the official midnight-indexer's (release/4.4, PostgreSQL backend) on the same machine; the measurements are recorded
  in the pull request. (CORE-ARCH SC-009)
- **A143** `[MEASURE]` The tape-apply baseline: the first 2,000 blocks of A133's stagenet tape, applied from an empty
  database with every core module except `-fast`, 5 times on PostgreSQL 18 and 5 times on PGlite; the run reports, per
  backend, the median total time and the median time per block next to the committed reference
  (`bench/baselines/tape-apply.json`, which names the machine it was measured on), and whether `slowBlockMs`'s default
  is at least 10 times the median time per block; the figures are recorded in the pull request. (Q72)

## 17. Required test ids added to the manifest

Each id is a `[[id]]` token in its test title (`test/integration/required-tests.manifest.json`); the pinned count
becomes 4 (kept harness ids) + 23.

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
| `db.block.truncate-refused` | A73 |
| `ingest.no-unfinalized-rows-after-crash` | A76 |
| `ingest.uncertain-commit-recovery` | A86 |
| `ledger.sweep-cross-backend-identical` | A105 |
| `ledger.root-check-halts` | A106 |
| `contract-logs.fast-equals-full` | A110 |
| `private.lockstep-waits-no-transaction` | A117 |
| `private.no-key-bytes-public` | A120 |
| `backup.restore-equals-uninterrupted` | A128 |
| `core.full-crash-sweep` | A134 |
