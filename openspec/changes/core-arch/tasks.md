# Tasks — CORE-ARCH: the standalone indexer's core architecture

No implementation code before the stage-1 gate (the cold adversarial review of this spec, its fix check, and the owner's
approval). Then one task at a time, test first: write the tests for the task's criteria, watch them fail for the
intended reason, implement until they pass. One task is one atomic change set; no placeholders, stubs or `TODO`s. After
each task: `npm run typecheck` and `npm test` green, and the task checked here with the criteria it demonstrated.

Order: sections 0–9 build the platform; 10–16 build the chain, ledger, contract, private, backup and browser parts on
it; 17 retires the 0.9.5 parts and moves the gates; 18 runs the whole-system checks; 19 closes out.

## 0. Pins and verification

- [x] 0.1 Pin `@electric-sql/pglite` 0.5.10 and `ws` 8.22.0 (runtime) and `esbuild` 0.28.2 (development) — the
      versions verified by the stage-1 probes (`design.md` §14) — through the supply-chain gate; move `typescript` to
      `dependencies`; keep `zod` 4. Commit the probes as tests (PGlite roles, `SET LOCAL ROLE`, provider functions,
      triggers, `TRUNCATE` refusal, `jsonpath` check; zod metadata; `ws` mutual TLS; esbuild worker bundle).
      **Acceptance:** the probe tests pass in CI; `npm run test:conformance` is green on the unchanged code.
      **Done (2026-10-22):** pins exact in `package.json` and `package-lock.json` (`@electric-sql/pglite` 0.5.10, `ws`
      8.22.0, `esbuild` 0.28.2; `typescript` ^5.9.0 → 5.9.3 in `dependencies`; `zod` ^4.0.0 → 4.4.3), plus
      `@types/ws` 8.18.2 (development; Q52). Probes in `test/dependencies/`: `pglite.test.ts` (15), `zod.test.ts` (7),
      `ws-mutual-tls.test.ts` (4), `esbuild-worker-bundle.test.ts` (2), `sqlite-writer-lock.test.ts` (3, the
      operating-system writer lock of `design.md` §4), `pins.test.ts` (4; seen failing on the previous manifest) — 35
      pass. Supply-chain gate steps pass locally (`ignore-scripts` effective, `npm ci`, `npm run typecheck`, blocking
      `npm audit --omit=dev` 0 vulnerabilities, image pins agree, `flake.lock` unchanged, gitleaks). `npm run
      test:conformance` green on the otherwise unchanged code: 553 tests passed, 17 skipped (the environment-gated
      ones), 25/25 required ids. The CI run is pending until the branch is pushed (Phase 3).
- [ ] 0.2 Vendored ledger builds (`vendor/ledger/`, `design.md` §5.2): pin the v8 release; build v9 and the v8→v9
      conversion (`v8-to-v9-state-translation`, `midnight-ledger` `da96e33d78ee9b7d3867b15c1037510d499cd909`) from one
      aligned v9 version; list each function of `LedgerPackage` the published packages lack and write the patches; make
      the build reproducible and record each SHA-256; add the CI job that rebuilds and compares; run the conversion on
      a v8 test state and compare its result with the node's root at a devnet fork's F.
      **Acceptance:** two runs of `npm run vendor:ledger` give the recorded SHA-256; the conversion's root matches the
      node's at F.
      **Partial (2026-10-23):** `vendor/ledger/v8` pins `ledger-8.1.2` (`36d7442`, the v8 ledger `midnight-node`
      2.1.0-rc.4 pins; its build moves wasm-bindgen 0.2.104 → 0.2.108, as 0.2.104's output varies run to run) and
      `vendor/ledger/v9` `ledger-9.1.0.0-rc.5` (`67f9f97`), with the conversion at `da96e33` and ledger v8 8.1.2 built
      against it exactly as the node builds them (aligned on rc.5: the node's `Cargo.lock` links the conversion to the
      rc.5 crates, and rc.3 → rc.5 changes DUST semantics that roots after F depend on; evidence in the plan). Each
      version has `upstream.json`, `patches/` (v8: 3, v9: 5), `build.sh` (Docker, `rust:1.98.1-slim-bookworm` by index
      digest, every tool pinned), `pkg/` and `SHA256SUMS`; `npm run vendor:ledger` rebuilds and compares;
      `.github/workflows/vendored-ledger.yml` does so on amd64 and arm64 runners. Exports added (both): `loadState`,
      `stateRoot`, `stateKey`, `flushNodes`, `persistKey`, `releaseKey`, `childRefs`, `evictKeys`, `contractStateKey`,
      `contractZswapStateKey`; (v9) `decodeLogItem`, `serializeStateValue`, `convertFromV8`. Tests in `test/ledger/`
      (29, seen failing on the unpatched builds first) pass, including `stateRoot` equal to the node's
      `midnight_ledgerStateRoot` at block 0 on mainnet and preview (v8) and a dev chain (v9), and the conversion of a
      v8 state giving the same v9 root in two fresh instances. First acceptance item met locally (arm64): two runs of
      `npm run vendor:ledger` gave the recorded SHA-256; the CI run (amd64 and arm64) is pending until the branch is
      pushed (Phase 3).
      **Pending:** the second acceptance item — the conversion's root against the node's at a devnet fork's F — needs
      the devnet tape of task 0.3, which runs after task 9.2. No v8 `decodeLogItem` patch: the v8 adapter returns
      null (owner decision Q54, task 12.1). Q53 (root counts as signed changes) and Q55 (`stateKey` in
      `LedgerPackage`): owner decisions A. Proposing the patches upstream is the owner's, later (Q56).
- [ ] 0.3 Tapes: record, with the builder of task 9.2, stagenet 0–10,000, preview 0–10,000 and a preview range across
      the runtime 1.0.300 upgrade, mainnet ranges around 1,774,492 and 1,788,980 (from backups), and a local devnet
      that starts on a v8 runtime and enacts the v9 upgrade; read each network's genesis hash, runtime at genesis and
      upgrade boundaries (U and F hashes and `MNSV`) for the built-in tables; publish the tapes as pinned release assets
      with their SHA-256.
      **Acceptance:** each tape replays against the tape node and its SHA-256 matches; the boundary data is recorded
      with its source. (Runs after task 9.2.)
- [x] 0.4 PostgreSQL 18 everywhere (owner decision Q82): every `postgres:17-alpine` pin (test setups, Testcontainers
      helpers, benchmarks, the pack smoke test, design documents that name the image) becomes one pinned
      `postgres:18-alpine`, through the supply-chain gate's image-pin agreement; the facts §14 records as checked on
      PostgreSQL 17.11 are re-checked on 18 by the suites that rely on them; the 0.9.5 durability probe's facts too.
      Runs after 2.2b (owner, 2026-10-24).
      **Acceptance:** A148.
      **Done (2026-10-24):** one pin, `test/postgres-image.ts`'s `POSTGRES_IMAGE` =
      `postgres:18-alpine@sha256:77f585114c32fbca283dc835b0596f4e52b51b4c6662d7810b2f4084f60a1873` (the official image's
      index, PostgreSQL 18.6 on Alpine 3.24.2, the tag's build of 2026-09-21, 33 days old when pinned), taken by every
      `new PostgreSqlContainer(…)`: 15 test files, `bench/environment.ts` (its 17 digest replaced) and
      `test/smoke/pack-install.mjs`. The supply-chain gate's image-pin agreement step holds the same pin
      (`EXP_POSTGRES`) and checks `test/postgres-image.ts` against it. A148's test,
      `test/dependencies/postgres-image.test.ts` (8; seen failing first, naming the 16 `postgres:17-alpine` files and the
      bench's digest), fails on any other PostgreSQL image named in a code or configuration file and on a container
      started from anything but the constant; its negative controls plant a second pin (another digest, `17-alpine`, a
      tag without a digest, a registry path, a digest without a tag, another `EXP_POSTGRES`) and each is caught. The
      §14 facts re-checked on PostgreSQL 18.6 by the suites that rely on them, and the row that had no PostgreSQL
      test by a new `test/dependencies/postgresql.test.ts` (12: `SET LOCAL ROLE`, `SECURITY DEFINER` with the `pg_temp`
      control, triggers, the `TRUNCATE` refusal, the `jsonpath` check and `.string()`, `REPEATABLE READ READ ONLY`,
      advisory locks); the 0.9.5 durability probe (12) and the crash suites pass on 18. Nothing behaved differently from
      17. `npm run test:conformance` green on 18: 1,343 tests passed, 17 skipped (the environment-gated ones), 25/25
      required ids; the pack smoke test passes on 18. §4's detection sentence and §14's rows say what was re-checked;
      the 0.9.5 research documents under `design/` keep naming the image they were run on (history; nothing reads
      them). The CI run is pending until the branch is pushed (Phase 3).

## 1. Determinism primitives

- [x] 1.1 `src/determinism/cbor.ts`: the canonical encoder of DT-1, `encodeCanonical`, `encodeRow`.
      **Acceptance:** A52, A53 pass.
      **Done (2026-10-23):** `encodeCanonical(value)`, `encodeRow(values, types)` (column types named as PostgreSQL's
      `format_type(type, NULL)` names them, scalar or `T[]`), `encodeArrayHead(length)` (an array's head, so the
      contents hash and the digests can stream rows into one array) and `CanonicalEncodingError` (`reason`, `path`);
      no CBOR dependency; an explicit stack (100,000-deep values encode), cycles refused. A `number` must be a safe
      integer (DB-2 gives larger integers as `bigint`); `jsonb` integers lie within the signed 64-bit range of DT-6;
      `numeric` text is `-?[0-9]+`, written canonically, and any fraction fails, `100.00` included — Q57 (owner decision
      C) confirms that a zero fraction counts. Tests in `test/determinism/`: `cbor.test.ts` (159: A52 —
      every RFC 8949 Appendix A example in the subset with the RFC's bytes, and the examples outside it refused — plus
      the spec's key-order scenario, integer and length boundaries at 23/24/255/256/65535/65536/2^32 and ±2^64,
      non-ASCII text, every column mapping and failure); `cbor.property.test.ts` (12, A53, seed 20261023: random
      `jsonb` objects checked by `cbor-decoder.ts`, a decoder written independently of the encoder — keys in §4.2.1
      order, shortest heads, round trip, insertion-order independence; fractional numerics, non-integer, unsafe and
      out-of-range JSON numbers fail; negative controls: the checker flags reordered maps and non-canonical bytes, the
      reorderings are real, JavaScript's sort differs from the canonical order). Seen failing first (no module), then
      passing; 14 deliberately wrong encoders were each caught. Coverage floor `src/determinism/**` 95/90 (§13) added
      in `vitest.config.ts`; `cbor.ts` 99.52 % lines, 100 % branches. Stryker on `cbor.ts` (temporary configuration,
      informative; the mutation targets are task 17.2's): 97.07 %.
- [x] 1.2 Primary-key order and `contentsHash` (DT-2, DT-3), over a database handle.
      **Acceptance:** A54 and A55 pass on both backends (after task 2.2 provides PGlite; until then on PostgreSQL, and
      re-run in 2.2).
      **Partial (2026-10-23):** A54 and A55 pass on PostgreSQL 17; the PGlite half is pending until task 2.2.
      `src/determinism/public-tables.ts`: `ConsistentRead` (exactly the `query` of CORE-ARCH §4.10's `ReadHandle`; a
      `BlockWriteHandle` is one too), `publicTables` (the public tables in DT-3's order), `countRows`,
      `rowsInKeyOrder` (DT-2, keyset pages of `pageSize` rows, default 1,000; text key columns `COLLATE "C"`) and
      `PublicContentsError` (`no-primary-key`, `unsupported-key-type`, `unsupported-column-type`, `unencodable-row`,
      `row-count-changed`); `src/determinism/contents-hash.ts`: `contentsHash(read, { pageSize }?)`, SHA-256 of DT-3's
      array streamed row by row (each table's row count read first, in the same snapshot, and checked). Public schemas:
      every schema but DB-8's reserved `pg_*`, `information_schema` and `public` (the public database holds only
      public-side schemas, PP-1; `core_chain` included); tables: ordinary and partitioned tables that are not
      partitions (a partitioned table is read whole, an ordinary one with `ONLY`); schemas and tables sorted by the
      UTF-8 bytes of their names, columns in column order (dropped ones skipped) with `format_type(atttypid, NULL)`'s
      types, key columns in `pg_index.indkey` order — no OIDs, no creation order. Tests in `test/determinism/`
      (seen failing first: modules missing): `public-tables.test.ts` (14: A54 — text keys `"B" < "a" < "b"` through
      an `und-x-icu` column and the default one, `bytea` keys, `smallint`/`integer`/`bigint` keys with negatives and
      the 64-bit limits, a composite key in declared order, a partitioned table, inheritance; page sizes 1, 2, 3 and
      the default; the table list and its refusals), `contents-hash.test.ts` (27: A55 — a fixed database's hash equal
      to SHA-256 of DT-3's CBOR written out by hand; equal hashes for the same rows built three ways; one byte changed
      and restored; 16 negative controls, each changing one thing a wrong hash could ignore and undoing it; the
      snapshot test with a commit between statements and its control handle; DT-1 failures; the handle's type),
      `postgres-database.ts` (a test-only adapter over `postgres`: one `REPEATABLE READ READ ONLY` transaction per
      read, DB-2's mapping with a lossless `jsonb` parser). 19 deliberately wrong variants of the two source files
      were each caught. Coverage 100 % lines and branches on both files (`src/determinism/**` floor 95/90). Q58 (owner
      decision: D plus `boolean` keys) moves these refusals to startup too; its code is task 1.3.
      **PGlite half (task 2.2, 2026-10-23):** done — `public-tables.test.ts` and `contents-hash.test.ts` run on
      PostgreSQL 17 and PGlite 0.5.10 (the concurrent-commit snapshot test stays PostgreSQL's: on PGlite nothing
      commits while a read runs, which A11 checks); A55's cross-backend comparison,
      `[[determinism.contents-hash.cross-backend]]`, is `test/determinism/cross-backend.test.ts` (equal hashes of
      one fixture on both backends at three page sizes, a one-byte negative control, A54's row lists compared).

- [x] 1.3 Column-type rules (owner decision Q58): `src/determinism/column-rules.ts`, one table deciding for each column
      type whether it is allowed as a value and as a key, with the reason and the alternative of `design.md` §4's
      column-type table and a comment at each rule, used by the contents hash now and by task 7.1's migration-time
      check; `varchar(n)` and `uuid` in the encoder; `varchar`, `uuid` and `boolean` keys in the hash; every refusal of
      the encoder and the hash naming the table, the column and its type, with the reason and what to use instead.
      **Acceptance:** A52; A54 on PostgreSQL (its PGlite half in task 2.2); the contents-hash half of A58 (same codes
      and messages as startup).
      **Done (2026-10-23):** `column-rules.ts` takes a column as the catalog describes it (`format_type(atttypid,
      NULL)`, `format_type(atttypid, atttypmod)`, `atttypmod` — `numeric`'s scale, negative scales included —
      `typtype` of the type and of an array's element, and whether it is in the primary key) and holds 16 rules, one
      per row of the column-type table, each with the row's cells verbatim, a comment, and a reason and alternative
      written for a developer; `TABLE_RULES` holds the paragraph's no-primary-key, sequence and default refusals.
      `tableRefusals` lists a table's refusals (no primary key first, then columns in column order; a type no table may
      store is refused for that, with its own code, even in the key) and `refusalMessage` gives `code: [module "…", ]
      table "s"."t", column "c" (declared type): what. Why. Instead, what to use.` — the hash's message exactly, and
      task 7.1's with the module id. `public-tables.ts` exports `catalogTables` (those facts, for 7.1) and refuses with
      the first refusal; `PublicContentsError` gains `declaredType`; floating-point columns are now
      `non-deterministic-column` (design §11). The encoder takes `character varying` (as `text`) and `uuid` (its 16
      bytes; only PostgreSQL's lowercase 8-4-4-4-12 form, anything else `uuid-invalid`), and refuses any other type
      name with its rule's code and reason. A value the encoder refuses in the hash names the row by its primary key
      and, for a `numeric` fraction or `NaN` or a `jsonb` number, says why and what to store instead. Tests (seen
      failing first): `column-rules.test.ts` (35, no database: every rule, key orders, refusal order and messages, the
      encoder's refusals, and the rules kept in step with `design.md` §4 — the table is found by its heading anywhere
      under `openspec/`, so archiving the change does not break it — with 7 negative controls on that check),
      `column-refusals.test.ts` (41, PostgreSQL 17: the rule of every type the table names, read from a real catalog;
      `numeric`'s scale for 44 declarations; A58's hash half for 29 cases — no primary key, `numeric`/`jsonb`/array
      keys, `numeric(38,2)`, each date and time type, `json`, `char(4)`, `money`, enum, domain, composite, range,
      `real`, `double precision`, `inet`, arrays of refused types — each with its code, location, mechanism and
      alternative, and the same message as `tableRefusals` + `refusalMessage` give over the same catalog facts; the
      messages' mechanisms checked through the driver), A52's `varchar`/`uuid` additions in `cbor.test.ts`, A54's
      `varchar`, `uuid`, `boolean` and composite keys in `public-tables.test.ts`, a hand-written hash oracle for them
      in `contents-hash.test.ts`. 26 deliberately wrong variants of the sources were each caught. `src/determinism/`
      coverage 100 % except `cbor.ts`'s one unreachable line. Two rows of the design table state reasons that are not
      true of every type they cover: the date and time row for `time` and `timetz` (Q59) and the floating-point example
      for `real` (Q60); per-type reasons ship meanwhile. Q61 asks whether the hash should also refuse sequence and
      default columns, as DT-6's last sentence reads literally. `postgres` 3.4.9 reads NULL array elements wrongly
      (docs/issues/00006; for task 2.1).
      **PGlite half (task 2.2, 2026-10-23):** done — the `varchar`, `uuid` and `boolean` key tests and
      `column-refusals.test.ts` pass on PGlite 0.5.10 too.

- [x] 1.4 Non-deterministic tables and columns (owner decision Q61) and per-type reasons (Q59, Q60): in
      `column-rules.ts`, detect identity and `serial` columns, defaults that are not immutable (a function marked stable
      or volatile, or an SQL value function, in `pg_attrdef.adbin`) and public schemas holding a sequence or an unlogged
      table, with `design.md` §4's reasons and alternatives; the contents hash refuses them now, in any public schema,
      and task 7.1's startup check calls the same detection; the date and time and floating-point rules' verbatim copies
      follow §4's amended rows.
      **Acceptance:** the contents-hash half of A58, its Q61 cases included; the design-table sync test.
      **Done (2026-10-23):** `column-rules.ts` reads a column's `attidentity` and its default's expression tree
      (`parseExpressionTree`, tokenized as PostgreSQL's reader does) and lists what in it is not immutable as
      PostgreSQL's own check, `contain_mutable_functions`, finds it (`defaultReferences`, `notImmutableParts`): every
      function id (`:funcid`, `:opfuncid`, `:hashfuncid`, `:negfuncid`; an operator stored without one, through
      `pg_operator`), a conversion through text (`COERCEVIAIO`: the result type's input and the argument type's output
      function), a row comparison's operators, `SQLVALUEFUNCTION` and `NEXTVALUEEXPR`, each function looked up in
      `pg_proc.provolatile`; SQL/JSON nodes are refused outright, with a message that says so (Q63). A generated
      column's expression is no default. `tableRefusals` adds, per column after its type, its identity, a sequence draw
      (`nextval()`: a `serial` column) and the rest of a default that is not immutable (`non-deterministic-column`);
      `relationRefusals` refuses every sequence and every unlogged table or partition of a public schema
      (`non-deterministic-table`); `databaseRefusals` lists the tables' refusals, then the relations' (a `serial` or
      identity column before its own sequence). `public-tables.ts` reads the facts (`catalogTables`,
      `catalogRelations`), and the hash refuses with the first refusal, in every public schema.
      `PublicContentsError` takes a place (`{ schema, table }` or `{ schema, sequence }`). The floating-point and
      date and time rules' verbatim cells follow the amended rows; each date and time reason names its type. Messages
      name what is not immutable (`calls now(), which PostgreSQL marks stable`), not the default's text, which depends
      on the session's `TimeZone`. Tests on PostgreSQL 17: every Q61 case of A58's contents-hash half, the refusal
      order, the catalog facts, the allowed controls, 36 defaults against PostgreSQL's own check (a stored generated
      column), the design sync (the rows, the paragraph's refusals, its allowed and detection sentences); 29 negative
      controls caught. The messages of 11 cases were byte-identical on PostgreSQL 17.11 and PGlite 0.5.10 (a scratch
      check). Q62–Q64 raised, none blocking: §4's detection sentence misses what the code and PostgreSQL also read
      (Q62); SQL/JSON defaults are refused outright (Q63); §4 gives no alternative for a sequence or an unlogged table
      (Q64).
      **PGlite run (task 2.2, 2026-10-23):** done — every A58 case, the refusal order, the catalog facts, the controls
      and the 36-default oracle pass on PGlite 0.5.10; 11 refusals' codes and messages are compared across the two
      backends in `test/determinism/cross-backend.test.ts`.
      **For task 7.1:** read `catalogTables` and `catalogRelations` (or their SQL) for the module's schemas, call
      `databaseRefusals`, and refuse with the first: `refusalMessage(refusal, { module, ...place })`.

## 2. Database API

- [x] 2.1 `src/db/api.ts` and the PostgreSQL backend (refactored from `src/postgres/client.ts`): writer connection, read
      pool, read handles at one height, result mapping, errors with retryability (`connection-lost`).
      **Acceptance:** A9 (including lossless `jsonb`), A12, A19 pass; A8 passes on PostgreSQL.
      **Done (2026-10-23):** `src/db/api.ts` (CORE-ARCH §4.10's `ReadHandle`, `BlockWriteHandle`, `SchemaWriteHandle`;
      `Transaction`; `CommittedHeight`; `Database { read, transaction, close }`), `src/db/errors.ts` (`UmbraError {
      code, retryable, details }`, `ERROR_CODES`; retryable for `connection-lost` only, DB-13), `src/db/mapping.ts` (the
      result mapping by type OID with its own array reader, lossless JSON for `json` and `jsonb`, parameter texts) and
      `src/db/postgres.ts` (`openPostgres`): each connection is a single-connection driver client, marked lost by the
      driver's `onclose` and never reused (the driver otherwise reconnects silently mid-transaction, or crashes on a
      reserved connection used after its loss); the writer runs transactions one at a time; reads use a pool (default
      10) and are `REPEATABLE READ READ ONLY` transactions whose first statement reads the committed height, ended by
      `ROLLBACK`; every connection pins `bytea_output`, `DateStyle`, `IntervalStyle`, `TimeZone` and
      `extra_float_digits`, and a `database` URL setting one is refused; a `COMMIT` that PostgreSQL turns into
      `ROLLBACK` is an error, never a commit; a handle used after it ended fails with `handle-closed`. The driver hands
      over text only, so `docs/issues/00006` (NULL array elements) is fixed and closed. `CanonicalEncodingError` and
      `PublicContentsError` are now `UmbraError`s (code = reason), so §12's `UmbraError` covers them with no new
      export. The determinism suites read through the real backend (`test/determinism/postgres-database.ts` keeps only
      setup SQL and the snapshot control). Tests in `test/db/` (82, seen failing first: modules missing; issue 00006's
      three reproductions in `contents-hash.test.ts` failed through the old adapter): `mapping.test.ts`,
      `errors.test.ts`, `results.test.ts` (A9 — the `jsonb` pair as two `bigint`s and 42 as 42, every mapped type and
      its array with NULL elements, hostile database defaults, a seeded round-trip property), `handles.test.ts` (DB-2,
      DB-5, the handles' types), `read-height.property.test.ts` (A8, seed 20261023, with two negative controls that
      must fail it), `postgres-pool.test.ts` (A12, with the writer seeing its own rows as the control),
      `postgres-faults.test.ts` (A19 `[[db.connection-lost.retryable]]`: `pg_terminate_backend` of the writer
      mid-transaction, during a statement and before `COMMIT`, of a reader, of idle connections, a refused connection;
      constraint violations and other errors not retryable). 27 deliberately wrong variants of the sources were each
      caught but one equivalent. Coverage floors `src/db/**` 90/85 and `src/db/errors.ts` 95/91 (§13) added.
      **Questions, since decided (2026-10-23):** Q65 (the pinned session settings: A), Q66 (types the mapping does not
      name: A, and DB-2 now says arrays map element by element), Q67 (0.9.5's timeouts: a redesign, Q70–Q72; Q68 makes
      date and time values text, task 2.2b). **For task 2.2:** add PGlite to `test/db/backends.ts`; hand over text and
      map with `src/db/mapping.ts`; pin the same five settings; send the same parameter texts. The CI run is pending
      until the branch is pushed (Phase 3).
- [x] 2.2 The PGlite backend with its single queue, behind the same API.
      **Acceptance:** A7, A8 (PGlite), A11 including its negative control.
      **Done (2026-10-23):** `src/db/pglite.ts` (`openPglite({ dataDir, committedHeight })`, `openPgliteOn(engine, …)`,
      `PGLITE_START_PARAMS`, `classifyPgliteError`). Every read and every transaction is one job of one FIFO queue that
      holds PGlite's one session from its first statement to its last, so a block transaction is one exclusive job
      (DB-4); a job runs in its caller's async context. A read is `BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY`,
      `RESET ALL` and `RESET ROLE` (no setting or role a transaction left on the session reaches it), the committed
      height, the body, `ROLLBACK`; a transaction is `BEGIN`, the body, then `COMMIT` — a `COMMIT` answered with
      `ROLLBACK` is an error — or `ROLLBACK`; `handle-closed` and `commit-rolled-back` exactly as on PostgreSQL (both
      now in `src/db/errors.ts`). Values reach `src/db/mapping.ts` as PostgreSQL's text (every PGlite parser replaced
      by the identity, `rowMode: "array"`) and parameters go as `parameterText`'s texts through identity serializers;
      the engine starts with the five `PINNED_SETTINGS` (moved to `mapping.ts`) as `-c` start parameters, which beat
      `postgresql.conf` and `ALTER SYSTEM`, and an engine without them is refused (`invalid-configuration`). Errors
      (DB-13): PGlite has no connection, so nothing is `connection-lost`; a server `ERROR` is `database-error` with its
      SQLSTATE and names; anything else (`FATAL`, a WebAssembly trap, a failed `ROLLBACK`, …) is `database-error`,
      `reason: engine-failed`, for every later call too, until the database is opened again. Closing refuses the
      waiting jobs and every later statement, waits for a statement in flight, then closes the engine. A call from
      inside a running job of the same database (or through another database's job) is refused with `nested-call`
      (Q73, resolved E by the owner with this guard kept). A11's negative-control flag is `READS_BYPASS_QUEUE` in
      `src/db/pglite-build-flags.ts`: a `const false` that no option, setting or environment variable reads and §12 does
      not export, so only a different build turns it on. Tests (seen failing first: module missing):
      `differential.test.ts` (A7, 36: the same statements on both backends — mapped rows, errors with their messages,
      row counts, a `COMMIT` turned `ROLLBACK`, a seeded round trip — compared with each other);
      `read-height.property.test.ts` (A8 on PGlite, a model of the queue, two negative controls; interleavings now up
      to 30 steps evenly);
      `pglite-no-outside-read.test.ts` (A11 `[[db.pglite.no-outside-read-in-transaction]]`: 200 blocks under four
      readers, every engine statement traced with who asked for it — 0 outside reads, 4 reads waiting in the middle of
      every block, no read saw a half-written block) and `pglite-no-outside-read.negative-control.test.ts`
      (`[[db.pglite.no-outside-read.negative-control-fires]]`: the bypass build fails A11's assertions with 1,600 read
      statements inside the blocks' windows); `pglite-queue.test.ts` (25: order, holding, Q73, closing, errors, opening,
      the pinned settings over a hostile `postgresql.conf`/`ALTER SYSTEM`); `results.test.ts` and `handles.test.ts` on
      both backends; the PGlite halves of 1.2–1.4 and `test/determinism/cross-backend.test.ts`. **Found and fixed:**
      Node.js 24.9.0's `JSON.parse` can read a one-escape object key (`"\t"`) as a backslash once another parse read the
      key `"\\"` — A7's round trip failed on both backends — so `parseJsonLossless` is now the mapping's own JSON reader
      (Q78). 46 deliberately wrong variants: 43 caught at once, 2 more after new tests, 1 equivalent. Coverage
      `pglite.ts` 98.44 % lines / 96.61 % branches, `mapping.ts` 100 / 100 (floors `src/db/**` 90/85).
      **Open question (not blocking):** Q78 (`design.md` §4 and §14 still prescribe `JSON.parse`). The CI run is
      pending until the branch is pushed (Phase 3).
- [x] 2.2a The `deterministic_postgresql` component (Q69): move into `src/deterministic-postgresql/` the column-type
      rules with the default detection and the catalog reads they need (`src/determinism/column-rules.ts` and the rule
      parts of `public-tables.ts`), the pinned session settings (`PINNED_SETTINGS`, in `src/db/mapping.ts` since task
      2.2) and the result mapping with the parameter texts and its JSON reader (`src/db/mapping.ts`); `src/db/` and
      `src/determinism/` import every rule from it; their tests move to `test/deterministic-postgresql/` and run on both
      backends; the design-sync test keeps finding §4's table; the coverage floor of §13.
      **Acceptance:** A138; every moved test passes unchanged in what it asserts.
      **Done (2026-10-23):** `src/deterministic-postgresql/` holds `column-rules.ts` (moved from `src/determinism/`: the
      column-type rules and the default detection, with `SCALAR_COLUMN_TYPES` and `ColumnType` from `cbor.ts`, and
      `keyOrderTerm`, the `ORDER BY` term with `COLLATE "C"` that `rowsInKeyOrder` wrote inline), `catalog.ts` (the
      catalog reads moved from `public-tables.ts`: `catalogTables`, `catalogRelations`, their SQL, and the handle
      `ConsistentRead`, declared here so nothing of `src/db/` is imported), `settings.ts` (`PINNED_SETTINGS`),
      `mapping.ts` (moved from `src/db/`: the result mapping, the parameter texts, the JSON reader), `errors.ts`
      (`UmbraError`, `ERROR_CODES`, `ErrorCode`, `ErrorDetails`, which the mapping throws; `src/db/errors.ts` re-exports
      them, so `design.md` §12 is unchanged — Q79) and `index.ts`, the entry `src/db/` and `src/determinism/` import
      every rule from (its comment maps each row of §4's component table to its file, and names where the rows still to
      be built go). The component imports nothing else of `src/`, and `src/determinism/` no longer imports `src/db/`.
      `public-tables.ts` keeps `PublicContentsError`, `publicTables`, `countRows` and `rowsInKeyOrder`, and re-exports
      `ConsistentRead`. Tests moved with `git mv`, only their imports and doc comments changed: `column-rules.test.ts`
      (no database; with the design sync), `column-refusals.test.ts` (both backends), `mapping.test.ts` (no database),
      `results.test.ts` (A9, both backends). New, seen failing first (the component missing; the moved tests not yet in
      the suite): `boundary.test.ts` (the import boundary over every import form, by the TypeScript compiler's parse;
      "defined nowhere else" checked as names, pinned settings written with their values, `COLLATE "C"`, functions and
      values defined again under any name, and texts of 30 or more characters, each with a fixture copy),
      `component-table.test.ts` (§4's component table mirrored row by row: the suite files that run each row, on both
      backends, and the task each part not built yet waits for, which this file must still list as open) and
      `both-backends.test.ts` (one fixture on PostgreSQL 17 and PGlite: equal catalog facts, equal refusal messages for
      every refused row and every refusal of the paragraph, text keys in byte order whatever the collation, the pinned
      settings and the texts they print). 9 deliberate breaks (four forbidden imports, five rules defined again outside)
      each caught by the intended test; 36 wrong variants of the component's code: 32 caught by the suite at once, and
      the other 4 after new tests (`errors.test.ts`: unreadable output's code, never asserted since task 2.1;
      `UmbraError`'s frozen details; and schemas and tables in byte order with a partitioned table listed once, which
      only `test/determinism/` had checked) — 36 of 36 on the final suite. Coverage floor
      `src/deterministic-postgresql/**` 95/90, and the `errors` floor 95/91 at the class's new path, in
      `vitest.config.ts`; `design.md` §1 and §4 and `docs/issues/00007` name the new paths.
      **A138 covers now:** the column-type rules with their refusals, the `COLLATE "C"` key order, identity, `serial`
      and non-immutable defaults, sequences and unlogged tables (rows 1–4), the pinned session settings (row 7) and the
      result mapping and parameter texts (row 8). **Pending:** the `jsonb` and `numeric` `CHECK`s (row 5, task 7.1); the
      `BEFORE TRUNCATE` trigger (row 6, task 2.3, done); the zero timeouts (row 7, task 2.7); date and time as RFC 3339
      text (row 8, task 2.2b, done); the opt-out (row 9: its declaration task 3.1, its skips task 7.1).
      **For tasks 2.2b, 2.3, 2.7, 3.1 and 7.1:** put each rule in the component (`index.ts` says which file), test it in
      `test/deterministic-postgresql/` on both backends, and move its part in `component-table.test.ts` from `pending`
      to `tests`.
      **Question, since decided:** Q79 (where `UmbraError` lives): A, by the owner (2026-10-23). The CI run is pending
      until the branch is pushed (Phase 3).
- [x] 2.2b Date and time (Q68, Q74) and one set of rules (Q75): values as RFC 3339 text in the component's mapping;
      `timestamptz` allowed as a value and a key (the encoder's integer microseconds since 1970, key order by time),
      the other date and time types refused with "use `timestamptz`"; the date-and-time row of `design.md` §4 split
      and reworded, and "public" in its paragraph made "module" (every database), together with their verbatim copies
      in the component; the A7 differential compares date and time values as values; the module guide says
      `timestamptz` is the preferred time type, and every time UmbraDB represents uses it and its `Z` form. Runs next,
      before 0.4 (owner, 2026-10-24); it closes the fix check's TC-01, which the owner accepted until then.
      **Acceptance:** A139, A145 (the column rules and the encoding; the core's `block_time` is task 10.2's).
      **Done (2026-10-24):** the component's mapping (`mapping.ts`) rewrites PostgreSQL's ISO text by moving its
      characters, never through a JavaScript `Date`: `timestamptz` → `2025-05-21T14:30:00.123456Z` (the fraction as
      printed), `timestamp` the same without `Z`, `date` its text, `infinity` and `-infinity` as words, arrays element by
      element; only the pinned form is read (four-digit year, offset `+00`), so a year outside 0001–9999, BC or another
      offset is the existing `unreadable-result` (Q81, no new rule); a `Date` parameter is still sent as its ISO text.
      `timestamptz` is allowed as a value and a key (`column-rules.ts`: rule `timestamptz`, key order `by-time`, which
      `keyOrderTerm` writes without a collation; `src/determinism/cbor.ts`: the integer microseconds since 1970 in
      `bigint`, `infinity`/`-infinity` → `timestamptz-infinite`, other text → `timestamptz-invalid`, both in
      `ERROR_CODES`; `valueFailureBecause` explains an infinite value). `timestamp`, `date`, `time`, `timetz` and
      `interval` are refused with reasons true of each that no longer cite the drivers' `Date`, and "use timestamptz,
      written with Z" (plus `bigint` microseconds for a time of day or a length of time, Q87). `design.md` §4: the
      date-and-time row split into an allowed `timestamptz` row and the five refused types; "module" for "public" in
      the paragraph, the "Column types and stored values" bullet and the component table's row 4; the "Date and time
      values" bullet in the present tense. Q75 in the code, where "public" meant DT-3's schemas:
      `src/determinism/module-tables.ts` (was `public-tables.ts`) with `moduleTables`, `ModuleContentsError`,
      `ModuleContentsFailure`, `ModuleTable`, `ModuleColumn`; the messages "this type cannot be stored in a module
      table" and "a module schema cannot hold …". The A7 differential compares date and time values as values, and
      against values written out by hand. `docs/module-guide.md` created with its "Time values" section. Tests, seen
      failing first: A139 (`time-values.test.ts`, both backends, three child processes with `TZ` UTC, America/New_York
      and Asia/Tokyo, with controls that the zones took effect and that the old `Date` mapping differs between them),
      A145's column rules and encoding (`cbor.test.ts` with 18 hand-computed values, `contents-hash.test.ts` with a
      hand-written oracle beyond 2^53, `module-tables.test.ts`, `cross-backend.test.ts`, `both-backends.test.ts`,
      `column-refusals.test.ts`, `column-rules.test.ts` and its design sync at 17 rows), `results.test.ts` (A9's `Date`
      expectations replaced by DB-2's text) and `mapping.test.ts`; row 8's part of `component-table.test.ts` moved to its
      tests. 36 wrong variants of the mapping, rules and encoder: 34 caught (two by hanging the suite, recorded as
      `docs/issues/00008`), 2 equivalent. Closes the fix check's TC-01. **Pending for A145:** the startup refusal (task
      7.1) and the core's `block_time` (task 10.2). **Question, since decided:** Q87 B (owner, 2026-10-24).
- [x] 2.3 Roles and `SET LOCAL ROLE`, provider functions (fixed `search_path`, `PUBLIC` revoked), the id pattern and
      schema-name collisions, shared-item schemas, and the `TRUNCATE` refusal.
      **Acceptance:** A13 including its negative control, A14, A15, A73.
      **Done (2026-10-24):** roles, grants and names in `src/db/roles.ts` behind a small input of each module's id,
      required items, provided items (a `table` item's schema, tables and `deterministic` flag) and migrations, which
      tasks 3.1 and 3.2 will feed from the real declarations: `planSchemas` checks ids and item names against DB-8's
      pattern within 40 bytes (`bad-id`), one namespace of module schemas, item names and reserved schemas
      (`schema-collision`, naming both), a `table` item's declared schema (its module's own, or the item's, which makes
      a shared item with one schema owned by `umbradb_i_<item>`, written by every provider under that role; Q89) and the
      providers of one item declared alike — schema, `deterministic` flag, migrations by id and SHA-256 checksum
      (`shared-item-migrations-differ`); `prepareSchemas`, before any migration, creates `core_chain`, each `NOLOGIN`
      role and schema and, as each schema's owner, grants `USAGE` and `SELECT` to every other role, revokes `EXECUTE`
      from `PUBLIC` by default privilege and grants it to the modules requiring an item the schema's writer provides;
      `setModuleRole` runs `SET LOCAL ROLE`. The writer's login is a superuser, or holds `CREATEROLE` and `CREATE` on
      the database and grants itself each role `WITH INHERIT TRUE, SET TRUE` (PostgreSQL 16 and later give a role's
      creator `ADMIN` only; probed on 18.6 and checked against its documentation); lacking a privilege, or facing
      another login's role, startup refuses with `invalid-configuration` (`reason: writer-privileges`) naming each and
      its `GRANT` (Q90). The `TRUNCATE` refusal is the component's
      (`src/deterministic-postgresql/block-transactions.ts`: `core_chain.truncate_not_allowed()`, SQLSTATE `UM014`, the
      trigger statements; applied by `src/db/truncate-guard.ts`): a `BEFORE TRUNCATE … FOR EACH STATEMENT` trigger on
      every table and partition of the plan's schemas not declared `deterministic: false`, refusing unless the
      transaction carries the migration mark (`umbradb.migration` = its own `pg_current_xact_id()`, set
      transaction-locally by `markMigration`), so it fails closed and no mark outlives its transaction; both backends
      report it as `truncate-not-allowed`. New codes in `ERROR_CODES`: `truncate-not-allowed`, `bad-id`,
      `schema-collision`, `shared-item-migrations-differ`. Tests, seen failing first: `test/db/schema-names.test.ts`
      (A15's names and refusals), `test/db/roles.test.ts` (A13 with `[[db.roles.cross-schema-write-rejected]]` and its
      committed negative control, A14 with task 0.1's `pg_temp` control, A15's roles and shared schema; both backends),
      `test/db/roles-login.test.ts` (a `CREATEROLE` login on PostgreSQL, Q90),
      `test/deterministic-postgresql/block-transactions.test.ts` (A73 with `[[db.block.truncate-refused]]`, both
      backends; row 6 of the component table moved to its tests), `test/db/errors.test.ts`. 73 wrong variants of the new
      code (a scratch runner outside the clone): 66 caught on the first run; the 5 survivors that were gaps closed by
      new tests (an id's bytes counted as characters; a role the login created itself beforehand, refused or left
      without the self-grant; the privilege checks run for a superuser; the migration mark set session-wide); 71 of 73
      caught on the final sources, 2 equivalent (a schema's owner granted privileges it holds already; the guard
      function without its fixed `search_path`, as it names only built-ins). `design.md` §4 ("Roles", "Provider
      functions", "`TRUNCATE`", the component table's row 6) and §14 updated. **Pending:** A13's and A73's "processing
      halts" (tasks 2.6, 5.x); A15's "startup refuses" (tasks 3.1, 3.2, 5.x); A73's migration half through the migration
      runner (task 2.4). **Questions, since decided:** Q89 (a `table` item's schema and a shared item's writer) and Q90
      (roles per server and the writer's login): A, by the owner (2026-10-24).
- [x] 2.4 Migrations with checksums (refactored from `src/postgres/migrate.ts`), `core_chain.migrations`, setup after
      migrations, and `requiresResync`.
      **Acceptance:** A16, A72; the refactored `migrate` and `migration-lock-timeout` tests pass or are retired per
      `design.md` §13.
      **Done (2026-10-24):** `src/db/migrate.ts` (`startDatabase`) behind a small input — the schema plan of task 2.3,
      the backbone parts and modules in RN-3's order (`id`, `version`, `requiresResync`, `migrations`, `onStartDb`;
      tasks 3.1 and 3.2 feed them from the declarations) and, for DB-10, each part's versions whose revisions cover a
      committed height (task 4.3 reads them from the configuration history and the cursor). One bootstrap transaction
      runs `prepareSchemas`, creates `core_chain.migrations` (module text, migration id text, checksum `bytea` = SHA-256
      of the UTF-8 SQL, position from 1; primary key `(module, migration_id)`, `UNIQUE (module, position)`), grants
      every module role `USAGE` and `SELECT` on `core_chain` (now and by default privilege), attaches the `TRUNCATE`
      guard, and checks every part before any migration runs: `requires-resync`, `migration-checksum-changed`,
      `migration-missing` — also, with `reason: out-of-order`, for a pending migration declared before an applied one
      or a record whose position no longer matches (Q91); a refusal rolls all of it back. Then per part: each pending
      migration in its own transaction — the migration mark, the part's role (a shared item's provider under the
      item's, recorded under the item's name; UmbraDB's own `core-chain` and `core-digest` as the login), the SQL as
      one text of several statements on the simple protocol (`src/db/multi-statement.ts`: registered by both backends
      for each transaction, reached only by the runner; `Transaction`'s methods stay one statement each), a check that
      the SQL did not end the transaction, then its row; a failure rolls back with its row and refuses with
      `migration-failed` (the database's error as its cause), a lost connection stays `connection-lost`; then the
      `TRUNCATE` guard again for the part's new tables; then its `on-start-db` in a transaction of its own under its
      role, unmarked. The component gains `MIGRATION_MARKED_SQL`; `ERROR_CODES` gains `migration-checksum-changed`,
      `migration-missing`, `migration-failed`, `requires-resync`. `docs/module-guide.md` gains "Migrations" and
      "Upgrades" (the additive-only rule, `requiresResync`). Tests, seen failing first (`Cannot find module
      '../../src/db/migrate.js'`; the guide's sections missing): `test/db/migrate.test.ts` (A16's three cases on both
      backends, with its committed negative control — a runner recording each row in a transaction of its own, first
      or last, fails them; refactored from 0.9.5's `migrate.test.ts`: the idempotent second start, nothing left on the
      writer's session, a refused connection and one lost during a migration as `connection-lost`),
      `test/db/requires-resync.test.ts` (A72 on both backends, its control, the `[DOC]` checks),
      `test/deterministic-postgresql/block-transactions.test.ts` (A73's migration half through the runner;
      `TRUNCATE` refused in `on-start-db`; the guard at every startup), `test/db/roles-login.test.ts` (the runner under
      a `CREATEROLE` login). 55 wrong variants of the new and changed code (a scratch runner outside the clone): 45
      caught on the first run, the 8 survivors that were gaps closed by new tests, 53 of 55 caught on the final
      sources, 2 equivalent (checking every provider of a shared item, whose lists are equal; the moved `send` not
      marking a lost session, which the driver's `onclose` marks). `design.md` §4 ("Migrations and setup"), §10
      (`core_chain.migrations`) and §13 updated: 0.9.5's `migration-lock-timeout` test is retired with the migration
      advisory lock (§4) — its concerns are A17's and A141's — and 0.9.5's runner and its tests stay until task 17.2
      removes them with the parts they migrate; the `migrate` floor 90/85 at `**/src/db/migrate.ts`. **Pending:**
      where `committedVersions` comes from (task 4.3, with the cursor of tasks 5.2/10.2), so A72's "committed blocks"
      are given as that history would give them; the declarations and RN-3's order fed in (tasks 3.1, 3.2); the
      refusal state and the writer lock before startup (tasks 5.x, 2.5); the schema write handle around `on-start-db`
      (task 2.6). **Question, since decided:** Q91 (a pending migration declared before an applied one): A, by the
      owner (2026-10-24), refused with `migration-missing`, `reason: out-of-order`.
- [x] 2.5 Writer lock (refactored from `src/postgres/transaction-lease.ts`) and the PGlite operating-system lock
      (`node:sqlite` exclusive transaction); the durability probe moved to `src/db/`.
      **Acceptance:** A17, A18; `durability-probe.test.ts` passes at its new path.
      **Done (2026-10-24):** `src/db/writer-lock.ts` — the PostgreSQL writer lock, `pg_try_advisory_lock(3,
      hashtext('umbradb-writer'))`, taken by the writer whenever it opens a session, before that session's first
      transaction (from 0.9.5's lease: a session advisory lock on a connection of its own, taken without waiting, its
      loss the connection's): the first time another holder is `writer-lock-held` and nothing was written; on a session
      opened after a lost one, `writer-lock-lost`, after which that database never writes again — and `startWriter(db)`,
      startup's first step (lock, then probe, before `startDatabase`), reached through a registry both backends fill.
      `src/db/postgres.ts` wires both into the writer; `PostgresOptions.fullPageWritesOffAllowed` (CF-4).
      `src/db/pglite-lock.ts` — the PGlite operating-system lock: `<data directory>.lock.sqlite` opened with `node:sqlite`
      (loaded only then), `busy_timeout` 100 ms (decision record Q92: with 0, ten processes started together could all
      refuse), `BEGIN EXCLUSIVE`, never committed, held for the process's life; the path resolved and its links followed,
      so every spelling of a directory shares one lock; the same process may reopen a directory it closed, one opening at
      a time; none for `memory://`; `idb://` and `opfs-ahp://` refused in Node.js. `openPglite` refuses without
      `developmentOptIn` (`development-opt-in-required`) before anything is created, then locks, then opens PGlite.
      `src/db/durability-probe.ts` — 0.9.5's probe unchanged in behaviour (`fsync`, `full_page_writes` with the
      override, the pooler check, the `synchronous_commit` warning), now with §11's codes (`durability-fsync-off`,
      `durability-full-page-writes-off`, `durability-pooler`) and run on the writer's session right after the lock; a
      refused writer ends its session and holds no lock. `ERROR_CODES` gains those, `writer-lock-held`,
      `writer-lock-lost` and `development-opt-in-required`; the `durability-probe` floor 97/92 at
      `**/src/db/durability-probe.ts`. Tests, seen failing first (`Cannot find module '../../src/db/writer-lock.js'`,
      `…/durability-probe.js`, `…/pglite-lock.js`): `test/db/writer-lock.test.ts` (`[[db.writer-lock.single-writer]]`,
      PostgreSQL and PGlite in one test; the re-take checked from inside the next transaction; `writer-lock-lost` for
      good; the PGlite lock in this process), `test/db/pglite-writer-processes.test.ts` (child processes: a writer
      stopped with `SIGSTOP` for A17's full 5 minutes — `UMBRADB_A17_SIGSTOP_SECONDS` shortens it for iteration only —,
      `SIGKILL` and a restart from the cursor, ten processes started together), `test/db/durability-probe.test.ts`
      (0.9.5's cases at the new path on six PostgreSQL 18 servers; a pooler simulated by statements alternating between
      two backends; A18's PGlite half). Committed negative controls: a lock released when its statement ends (PostgreSQL
      `pg_try_advisory_xact_lock`; PGlite `BEGIN EXCLUSIVE; COMMIT`) and a writer that skips the re-take each fail A17's
      checks (`writer-lock.negative-control.test.ts`, `pglite-writer-processes.test.ts`); a probe that ignores `fsync`
      fails A18's (`durability-probe.negative-control.test.ts`). 65 wrong variants of the new and changed code (a scratch runner outside the clone): 62 caught on the first run; the three survivors were two gaps (the probe run before the lock; a directory not created yet written as `…/new/.`), closed by tests, and one equivalent check, removed from the source as redundant; on the final sources all 64 are caught — `busy_timeout` 0 by a test that holds a SHARED lock on the lock file for 50 ms, since the ten-process races catch it only some of the time. `design.md` §4 ("Writer lock",
      "Durability probe"), §13 and §14 updated. 0.9.5's `transaction-lease.ts`, `durability-probe.ts` and their tests
      stay until task 17.2. **Pending:** the refused state ("stays up, not ready", "startup refuses") and the halt on
      `writer-lock-lost` (task 5.x); the configuration's `developmentOptIn` and `fullPageWritesOffAllowed` (task 4.x);
      "continues from the cursor" with the runner's cursor (tasks 5.2, 5.4, 10.2, 18.1); the browser's Web Locks (task
      16.1). **Question, since decided:** Q92 (`busy_timeout` 100 ms instead of design §4's 0): A, by the
      owner (2026-10-25).
- [x] 2.6 Write handles and their closing.
      **Acceptance:** A10.
      **Done (2026-10-25):** `src/db/write-handles.ts` — `openBlockWrites(tx, plan, { height, onClosedUse })` runs the
      parts' `on-db-write` callbacks inside the block transaction the runner opens, one `write(part, callback)` at a time
      (one asked for while another runs is refused before anything is sent): each callback first sets its part's role —
      `SET LOCAL ROLE` to its write role (a shared item's provider: the item's, Q89), or `RESET ROLE` for `core-chain`
      and `core-digest`, which write as the login — so no part runs under the role the one before it left, and after a
      callback that returned `RESET ROLE` returns the block to the login, also undoing a role the callback selected
      itself; `runOnStartDb` runs `on-start-db` the same way in a transaction of its own, and `startDatabase` calls it
      (`StartupInput.handles`: the cursor at startup and the report hook; `MigrationPart.onStartDb` takes a
      `SchemaWriteHandle`). A handle offers exactly `height`, `query` and `execute` — not the transaction, not the
      migrations' script path, never the migration mark (A73's block test now goes through it). When its callback
      returns or throws the handle closes: every later `query` or `execute` — a stored reference, a timer, during the
      block or after it — fails at once with `handle-closed` (`details { handle, module, point }`, `writeHandleClosed` in
      `src/db/errors.ts`) before anything is sent, so never under the role of the part that runs now, and on PGlite
      without waiting in the queue; each such use is also passed to `onClosedUse`, so the runner halts even when the
      module's own code caught the error. `OWN_PARTS` moved to `src/db/roles.ts` (re-exported by `migrate.ts`). Tests,
      seen failing first (`Cannot find module '../../src/db/write-handles.js'`): `test/db/write-handles.test.ts` (both
      backends); A13's and A73's helpers in `roles.test.ts` and `block-transactions.test.ts` now run the body as an
      `on-db-write` callback through the real handle, their assertions unchanged. Committed negative controls: a block
      whose handles never close fails A10's in-block check (the kept handle of `a` writes `b`'s table under `b`'s role),
      and a block that keeps the first callback's role fails the role check. 31 wrong variants of the new and changed
      code (a scratch runner outside the clone): 29 caught on the first run; the two survivors were gaps (`SET ROLE` for
      `SET LOCAL ROLE`; `startDatabase` dropping the height), closed by tests; on the final sources all 31 are caught.
      `design.md` §4 ("Write handles") and the module guide's "Writing in callbacks" added. **Pending:** "which halts
      processing" — the runner turns a callback's error and every `onClosedUse` report into the `callback-error` halt
      with the point and the module (task 5.x, with A13's and A73's halts); the runner's loop over the parts in RN-3's
      order and the cursor it passes as `height` (tasks 3.2, 5.x).
- [x] 2.7 Timeouts by connection role (Q71): a read option bounding one read by `statement_timeout` and
      `idle_in_transaction_session_timeout` (`SET LOCAL`), `query-timeout`; the zero timeouts pinned on the writer,
      migrations, setup and callback reads, in the component's session settings; on PGlite, API reads set neither
      timeout (it enforces neither and hangs on the idle one, `design.md` §14).
      **Acceptance:** A141.
      **Done (2026-10-25):** the zero timeouts are the component's `ZERO_TIMEOUTS` (`statement_timeout`, `lock_timeout`,
      `idle_in_transaction_session_timeout`, `transaction_timeout` and — decision record Q93, owner's answer A
      — `idle_session_timeout`, each 0), next to `PINNED_SETTINGS` in `src/deterministic-postgresql/settings.ts`;
      `SESSION_SETTINGS` (both) is what every session starts with: PostgreSQL startup parameters of the writer and every
      pooled read connection (so the reads given to callbacks, and migrations, setup and blocks on the writer, run with
      them), refused in a `database` URL like the five; PGlite `-c` start parameters, checked by `checkPinnedSettings`.
      The read option is `db.read(body, { timeoutMs })` (`ReadOptions`, `src/db/api.ts`; a whole number of milliseconds
      from 1 to 2147483647, else `invalid-configuration`, checked alike on both backends, `src/db/read-options.ts`): on
      PostgreSQL the read's `BEGIN` message also sets the two timeouts with `SET LOCAL`; a `57014` in it, and the read
      having been idle in its transaction for the timeout (told by its own clock: `postgres` 3.4.9 drops the server's
      `25P03`, which arrives while no statement is pending), fail with `query-timeout` (`details { timeoutMs, setting }`,
      not retryable; a new code), the first keeping the connection, the second leaving the session to the pool to drop;
      once ended, every later statement and the read itself fail with it, even when the body caught it; elsewhere a
      `57014` stays `database-error` and a lost session `connection-lost`. On PGlite the option is checked and sets
      nothing. Tests, seen failing first (the 1 s database defaults reaching the API's sessions; `pg_sleep(60)` running
      its 60 s; the option's `SHOW` reading 0; `SESSION_SETTINGS` undefined): `test/deterministic-postgresql/
      zero-timeouts.test.ts` (both backends, under database — PGlite: configuration-file — defaults of 1 s for all five:
      a 5 s migration, setup idle 2 s, a block idle 5 s while a callback awaits, a callback's 5 s read on its block write
      handle and on a read handle outside the block, the writer idle 2 s between blocks, a writer transaction waiting
      2 s for a lock (PostgreSQL), each completing with `SHOW` 0), `test/db/read-timeouts.test.ts` (A141's request half
      in the database API; the option checked on both), `test/db/pglite-timeouts.test.ts` (PGlite in processes of their
      own, killed when a statement hangs). Committed negative controls: a build without the zeros (`vi.mock`) has every
      long-work check cut off on PostgreSQL, and its session and lock lost after 2 s idle; on PGlite the start
      parameters without the zeros read the file's 1 s and hang; a read that sets the two timeouts fails PGlite's check
      (it reads 1 s and hangs); a `57014` reported as anything but `query-timeout` fails A141's check. 42 wrong variants
      of the new and changed code (a scratch runner outside the clone): 37 caught on the first run; of the 5 survivors 2
      are equivalent (`SET` for `SET LOCAL` in a read that always rolls back; `>` for `>=` on a real clock) and 3 were
      gaps (an engine without the zeros not refused; a read idle from its `BEGIN` with no statement; a statement in
      flight counted as idle), closed by tests; on the final sources 40 of 42 are caught, the 2 equivalent ones survive.
      `design.md` §4's "Session settings (Q65) and timeouts (Q71)" bullet and §14's PGlite row updated; §4's component
      table row 7 now runs its zero timeouts in `zero-timeouts.test.ts`. **Pending:** "a read for an API request"
      through a registered handler, with `apiReadTimeoutMs` from the configuration (tasks 5.2a, 4.2). Q93 resolved A
      (owner, 2026-10-25): DB-15, its new scenario and A141 now name `idle_session_timeout`.
- [x] 2.8 The read-only database for the `db` item (Q73): `read` only, nothing that writes, opens a transaction or
      closes; the `nested-call` refusal on PGlite kept from task 2.2; the module guide's database rules (inside a
      callback its handle, `db.read` for work outside the points).
      **Acceptance:** A144.
      **Done (2026-10-25):** `ReadOnlyDatabase` (`src/db/api.ts`: `read<T>(body, options?: ReadOptions)`, typed as
      `Database["read"]`) and `readOnlyDatabase(db)` (`src/db/read-only.ts`), which `core-chain` will publish as the
      `db` item: a frozen object whose one property is `read`, an arrow function holding the database in its closure
      only, so `Object.keys`, `in` and property reads find no `transaction`, `close`, write or anything else of the
      database, and no property, prototype or value leads to it; frozen because one item is shared by every module that
      requires it, so an assignment (a mistake in one module) throws instead of changing it for the others. The body and
      the read option reach the database's `read` unchanged (the same objects; no default timeout), and its result and
      error come back unchanged; a destructured `read` works. On PGlite a `db.read` from inside a running job — a
      callback in the block's transaction, `on-start-db`'s, a read's body — fails at once with `nested-call` (task 2.2's
      guard, unchanged); on PostgreSQL, from inside `on-db-write`, it reports h − 1 and sees none of the block's rows.
      Tests, seen failing first (`Cannot find module '../../src/db/read-only.js'`; `tsc`: no exported member
      `ReadOnlyDatabase`; the `[DOC]` checks against the guide before this task): `test/db/read-only-database.test.ts`
      (the type test with `@ts-expect-error` on `transaction`, `close`, `execute`, `query`; A144's runtime check; one
      committed height per read; A144's `on-db-write` case and the same from `on-start-db` and a read's body, on both
      backends; the read option passed through; the item over `openPglite`'s own object; the guide). Committed negative
      controls: the type predicate is false for `Database` and for the item plus `transaction`, `close` or a `database`
      property; the runtime check finds the database itself, `transaction` or `close` beside `read`, a prototype path,
      `Object.create(db)`, a held database. 18 wrong variants (a scratch runner outside the clone): 16 caught on the
      first run; of the 2 survivors one is equivalent (`read: db.read.bind(db)`) and one was a gap (`read: db.read`,
      which breaks on `openPglite`'s own object, whose `read` uses `this`, while the test server's PGlite wrapper hid
      it), closed by a test over that object; on the final sources 17 of 18 are caught, the equivalent one survives.
      `docs/module-guide.md`'s "Reading through `db`" (A144's `[DOC]`) and `design.md` §6 (`read(body, options?)`, the
      file, the frozen object) added. **Pending:** "a module that requires `db` gets" it through `ProcessContext.items`
      — `core-chain` publishing `readOnlyDatabase(db)` as the item (task 10.2) and the runner handing process items to
      modules (task 5.2a); the `on-db-write` case through the runner's own block loop, where a `nested-call` rejects the
      callback (`callback-error`, tasks 5.2 and 5.x).

## 3. Modules

- [ ] 3.1 Declaration types, `defineModule`, declaration validation; a `table` item's optional `deterministic: false`
      (Q76).
      **Acceptance:** A20, A21.
- [ ] 3.2 Graph resolution per height range, Kahn order, mid-chain rule, development-only rule, shared-item providers.
      **Acceptance:** A22, A23, A24, A25.

## 4. Configuration

- [ ] 4.1 `defineConfig`, `coreEntry`, `versionEntry`, the module `entry` builder; the loader; the plain-data check.
      **Acceptance:** A26, A27.
- [ ] 4.2 Schema validation with kinds, defaults and the `core` fields of CF-4; secret redaction helper.
      **Acceptance:** A28; A29 (completed in 8.1).
- [ ] 4.3 `core-chain`'s configuration history: revisions, future-only comparison, `data_hash`, the version check, the
      development opt-in.
      **Acceptance:** A30, A31, A32, A33, A34.
- [ ] 4.4 `umbradb config check` and the `umbradb` command.
      **Acceptance:** A35, A6.

## 5. Runner

- [ ] 5.1 Point dispatch and order within points; parallel waves.
      **Acceptance:** A38.
- [ ] 5.2 The finalized loop over the block-source interface; `InMemoryBlockSource` with its `core-block-commit`
      cursor table; block context and item sink; per-point handles; the chain-data envelope of module API responses.
      **Acceptance:** A36, A37, A39, A40, A41, A49; RN-16 is covered by A75.
- [ ] 5.2a Process items (`ProcessContext.publish`) and module API registration (`ApiRegistry` mounted on `listen.api`,
      WebSocket subscriptions, duplicate routes refused); each request's read bounded by `apiReadTimeoutMs` (DB-15).
      **Acceptance:** A74, A75; A141's request half through a registered handler.
- [ ] 5.3 Revisions and settings; start and stop heights; the upgrade-boundary stop; SIGTERM.
      **Acceptance:** A42, A45, A47, A48.
- [ ] 5.4 Failure handling and the delivery guarantees after restart.
      **Acceptance:** A43, A44, A46.
- [ ] 5.5 The slow-block watchdog (Q71): the condition `slow-block` with height, point and module, cleared at the
      commit; never a cancel or a retry.
      **Acceptance:** A142.

## 6. Storage helpers

- [ ] 6.1 Cursor table (refactored from `src/postgres/watermarks.ts`); P9 retargeted.
      **Acceptance:** A59.
- [ ] 6.2 Height-versioned table (refactored from `src/postgres/temporal-kv.ts`).
      **Acceptance:** A60, A61.

## 7. Digests

- [ ] 7.1 Change capture (shadow tables and triggers) on every module table not declared `deterministic: false`, and
      `core-digest` with `core_digest.tables` and the checkpoints at h mod 14,400 = 0 (Q84, Q86; a test may shorten the
      interval only through a build flag no exported surface reaches, as A11's); the migration-time check of DT-6
      through `column-rules.ts` (no primary key, key and column types, identity and `serial` columns, floats, defaults
      that are not immutable, sequences and unlogged tables; Q58, Q61; the detection is task 1.4's), and the `jsonb` and
      `numeric` `CHECK`s, arrays included (a `jsonb` number: an integer in the signed 64-bit range whose `jsonpath`
      `.string()` is `-?[0-9]+`, Q57; a `numeric`: `c IS NULL OR coalesce(scale(c) = 0, false)`, which refuses the
      infinities and allows NULL);
      tables declared `deterministic: false` skipped by the check, the `CHECK`s and change capture, and hashed by name
      only (Q76).
      **Acceptance:** A56 including its negative control, A57, A58, A147 (with 14.1 and 15.2 for its private and
      backup parts).

## 8. Admin endpoints

- [ ] 8.1 The admin server in its own worker thread reading the runner's published state, mounting only backbone parts'
      endpoints (Q70), 404 for anything else; the main-thread heartbeat; states and conditions; the shared redaction and
      sanitized-error helpers. No endpoint tests exist in 0.9.5 to migrate; each part's tests live in its folder.
      **Acceptance:** A62 (its 404 and response-time halves), A64.
- [ ] 8.2 `core-health` (`src/backbone/core-health/`): `/health/live` and `/health/ready` with readiness precedence.
      **Acceptance:** A63, A65; A140 for these endpoints.
- [ ] 8.3 `core-status` (`src/backbone/core-status/`): `/status` and its JSON schema, times as RFC 3339 text (Q68).
      **Acceptance:** A66 (`/status`), A67; A140 for this endpoint.
- [ ] 8.4 `core-config` (`src/backbone/core-config/`): `/config` and its JSON schema.
      **Acceptance:** A66 (`/config`), A29; A140 for this endpoint.

## 9. Test tape

- [ ] 9.1 Tape reader and writer (including `delayMs`); the tape node.
      **Acceptance:** A68, A69, A70.
- [ ] 9.2 The recording builder and the variant transforms.
      **Acceptance:** A71 (`[CI]` part); the `[MANUAL]` record-and-replay against a real node is recorded for the PR.

## 10. Node client and ingest

- [ ] 10.1 The node client (refactored from `chain-archive-sync/node-rpc-client.ts`): JSON-RPC over WebSocket,
      subscriptions, reconnect, timeouts, back-off; delete `chain-archive-sync/indexer-client.ts`.
      **Acceptance:** A83 (`[STATIC]` part); the refactored node-client tests pass.
- [ ] 10.2 `core-chain` (identity, bootstrap, startup checks) and `core-block-commit` (the `blocks` table from the
      `chain_archive` store, keeping range partitioning; block time as `block_time timestamptz`, converted exactly from
      the node's milliseconds, never through a floating-point value, Q74).
      **Acceptance:** A77, A78, A88, A90; A145's block-time part.
- [ ] 10.3 `core-block-fetch`: finalized processing, the finalized prefetch, the best-block queue with branch switches,
      block 0's fetch path.
      **Acceptance:** A76, A79, A80, A81, A83, A89.
- [ ] 10.4 Error handling, retries and halts; recovery after an uncertain COMMIT; the refusal and halt registry.
      **Acceptance:** A84, A85, A86, A87.

## 11. Chain data

- [ ] 11.1 `core-chain-events`, `core-block-parsed`, `core-tx-results`.
      **Acceptance:** A91, A92, A93.

## 12. Ledger

- [ ] 12.1 The `LedgerPackage` adapters for v8 (from `chain-archive-sync/tx-replay-decoder.ts`) and v9 (the v8
      adapter's `decodeLogItem` returns null and its `apply` no logs, Q54); the adapter test suite.
      **Acceptance:** A98.
- [ ] 12.2 Version selection, the built-in tables (`networks.json`, from task 0.3), pins, package identity checks,
      metadata selection at upgrades.
      **Acceptance:** A94, A95, A96, A97.
- [ ] 12.3 The ledger worker and the node-store bridge; `core-ledger-state` apply, replay rules, block 0's ledger path,
      root check, outputs.
      **Acceptance:** A82, A99, A101, A106, A107.
- [ ] 12.4 Storage of the ledger state, restart, retention, contract-key persistence, the v8→v9 conversion.
      **Acceptance:** A100, A102, A103, A104.
- [ ] 12.5 The fixed-budget mark-and-sweep.
      **Acceptance:** A105 including its negative control.
- [ ] 12.6 Ledger tasks and the plain-data `block-parsed` (`runLedgerWorker`, the host's worker entry, the
      structured-clone check).
      **Acceptance:** A137.

## 13. Contract data

- [ ] 13.1 `core-contract-states`; `core-contract-logs-full`; `core-contract-logs-fast`; the shared `contract-logs`
      item.
      **Acceptance:** A108, A109, A110, A111.

## 14. Private processes

- [ ] 14.1 The private backbone (`core-private-source`, `core-key-registry`), binding, block intake; the determinism
      rules of DT-6 checked at a private process's startup and its contents hash (Q75).
      **Acceptance:** A112, A113, A114, A116, A146.
- [ ] 14.2 The process transport and its messages; opt-in mutual TLS.
      **Acceptance:** A115, A121.
- [ ] 14.3 Lockstep and the behind-instance refusal.
      **Acceptance:** A117, A118.
- [ ] 14.4 Test keys through the key registry (the key API is not core and leaves this change, Q70) and privacy checks
      (the private-backup refusal is task 15.1's).
      **Acceptance:** A119, A120, A123.

## 15. Backups

- [ ] 15.1 `umbradb backup` (command and at stop): `pg_dump` 18 on PostgreSQL in the read transaction's snapshot,
      `pglite-tools` on PGlite in one queued job, both looked up only when the command runs (`backup-tools-missing`),
      the manifest line; `private-backup-refused` (Q83, Q85).
      **Acceptance:** A124, A122.
- [ ] 15.2 `umbradb restore`: the checks before loading, the file's SQL run in one transaction, owners and grants, the
      contents hash and state root checked before the commit; the operator guide's "restore only trusted backups".
      **Acceptance:** A125, A126, A127, A128.

## 16. Browser

- [ ] 16.1 The browser build (page, core, ledger and private workers, PGlite, Web Locks, backup and restore) and its
      headless-Chrome tests in CI.
      **Acceptance:** A129, A130, A131, A132.

## 17. Library surface and gates

- [ ] 17.1 Move TransactionHistory and its tests to `legacy/transaction-history/`, excluded from build, package and run.
      **Acceptance:** A3.
- [ ] 17.2 Remove the retired parts, the `chain_archive` store, `chain-archive-sync`, their tests, the Lean modules,
      benchmarks, manifest ids, coverage floors and mutation targets exactly as listed in `design.md` §13, and update
      the aggregators it lists; mark the retired laws in `Formal/STORAGE_ALGEBRA.md` and the roadmaps; set
      `openspec/changes/v1.1.0-quint-model-checking`'s status to Archived with the reason; remove the `archive:sync`
      script.
      **Acceptance:** A5; `lake build --wfail` and the trust audit pass; `npm run test:mutation:ci` passes at break 65
      on the new targets.
- [ ] 17.3 `src/index.ts` with exactly the §12 surface; the surface pin; the `umbradb` command; the pack smoke rewritten
      (§12 imports, the retired-name failure, a tape sync on PostgreSQL in Docker, `umbradb config check`); the bench
      smoke retargeted with a fresh baseline; `typedoc.json` entry points.
      **Acceptance:** A1, A2, A6; `npm run test:smoke` passes.
- [ ] 17.4 Version `0.10.0` and the breaking-change notice in `CHANGELOG.md`.
      **Acceptance:** A4.

## 18. Whole-system faults, differentials and measurements

- [ ] 18.1 The crash worker retargeted to the runner (harness ids 1–4 kept); the crash sweep with test modules and its
      negative control; the restart-20 and cross-backend differential.
      **Acceptance:** A50, A51; required ids 1–4 pass.
- [ ] 18.2 The full-core runs: stagenet and preview 0–10,000 from genesis; the full-core crash sweep and its negative
      control; the three-backend comparison.
      **Acceptance:** A133, A134, A135.
- [ ] 18.3 The ingest benchmark against the official indexer (`bench/ingest-vs-official/`), recorded in the PR.
      **Acceptance:** A136.
- [ ] 18.4 Add the 23 ids of `acceptance.md` §17 to the manifest and set the pinned count to 27.
      **Acceptance:** `npm run test:conformance` passes with every required id reported passed in its file.
- [ ] 18.5 The tape-apply baseline (Q72): the measurement of A143 in CI, its committed reference
      (`bench/baselines/tape-apply.json`), and the check of `slowBlockMs`'s default against it.
      **Acceptance:** A143; its figures recorded in the pull request.

## 19. Close-out

- [ ] 19.1 Check off every task above with the criteria it demonstrated; map every acceptance criterion to its test in
      the pull request.
- [ ] 19.2 Set the proposal's status line to Implemented.
- [ ] 19.3 Update `ROADMAP.md`: this change, the new architecture, and the "36 symbols" statements at `ROADMAP.md:455`
      and `docs/v1-implementation-guideline.md:194`.
- [ ] 19.4 Run `npm run graph:refresh` and commit `graphify-out/` with the close-out commit; `npm run graph:check`
      exits 0.
- [ ] 19.5 Record in the pull request, per `docs/PULL_REQUEST_CHECKLIST.md`: the reviewed commit, each lane's verdict
      and model id, the fix check, the owner's decisions (including the approval of `design.md` §13), the
      `[MANUAL]` evidence (A71, A136), and the CI runs.
