# Tasks — CORE-ARCH: the standalone indexer's core architecture

No implementation code before the stage-1 gate (the cold adversarial review of this spec, its fix check, and the owner's
approval). Then one task at a time, test first: write the tests for the task's criteria, watch them fail for the
intended reason, implement until they pass. One task is one atomic change set; no placeholders, stubs or `TODO`s. After
each task: `npm run typecheck` and `npm test` green, and the task checked here with the criteria it demonstrated.

Order: sections 0–9 build the platform; 10–16 build the chain, ledger, contract, private, snapshot and browser parts on
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
      the runtime 1.0.300 upgrade, mainnet ranges around 1,774,492 and 1,788,980 (from snapshots), and a local devnet
      that starts on a v8 runtime and enacts the v9 upgrade; read each network's genesis hash, runtime at genesis and
      upgrade boundaries (U and F hashes and `MNSV`) for the built-in tables; publish the tapes as pinned release assets
      with their SHA-256.
      **Acceptance:** each tape replays against the tape node and its SHA-256 matches; the boundary data is recorded
      with its source. (Runs after task 9.2.)

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
      **Open questions (none blocking):** Q65 (the pinned session settings), Q66 (types the mapping does not name, and
      DB-2's text for arrays), Q67 (0.9.5's timeouts not carried over). **For task 2.2:** add PGlite to
      `test/db/backends.ts`; hand over text and map with `src/db/mapping.ts`; pin the same five settings; send the same
      parameter texts. The CI run is pending until the branch is pushed (Phase 3).
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
- [ ] 2.3 Roles and `SET LOCAL ROLE`, provider functions (fixed `search_path`, `PUBLIC` revoked), the id pattern and
      schema-name collisions, shared-item schemas, and the `TRUNCATE` refusal.
      **Acceptance:** A13 including its negative control, A14, A15, A73.
- [ ] 2.4 Migrations with checksums (refactored from `src/postgres/migrate.ts`), `core_chain.migrations`, setup after
      migrations, and `requiresResync`.
      **Acceptance:** A16, A72; the refactored `migrate` and `migration-lock-timeout` tests pass or are retired per
      `design.md` §13.
- [ ] 2.5 Writer lock (refactored from `src/postgres/transaction-lease.ts`) and the PGlite operating-system lock
      (`node:sqlite` exclusive transaction); the durability probe moved to `src/db/`.
      **Acceptance:** A17, A18; `durability-probe.test.ts` passes at its new path.
- [ ] 2.6 Write handles and their closing.
      **Acceptance:** A10.

## 3. Modules

- [ ] 3.1 Declaration types, `defineModule`, declaration validation.
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
      WebSocket subscriptions, duplicate routes refused).
      **Acceptance:** A74, A75.
- [ ] 5.3 Revisions and settings; start and stop heights; the upgrade-boundary stop; SIGTERM.
      **Acceptance:** A42, A45, A47, A48.
- [ ] 5.4 Failure handling and the delivery guarantees after restart.
      **Acceptance:** A43, A44, A46.

## 6. Storage helpers

- [ ] 6.1 Cursor table (refactored from `src/postgres/watermarks.ts`); P9 retargeted.
      **Acceptance:** A59.
- [ ] 6.2 Height-versioned table (refactored from `src/postgres/temporal-kv.ts`).
      **Acceptance:** A60, A61.

## 7. Digests

- [ ] 7.1 Change capture (shadow tables and triggers) and `core-digest`; the migration-time check of DT-6 through
      `column-rules.ts` (no primary key, key and column types, identity and `serial` columns, floats, defaults that are
      not immutable, sequences and unlogged tables; Q58, Q61; the detection is task 1.4's), and the `jsonb` and
      `numeric` `CHECK`s, arrays included (a `jsonb` number: an integer in the signed 64-bit range whose `jsonpath`
      `.string()` is `-?[0-9]+`, Q57; a `numeric`: `scale(c) = 0 AND c <> 'NaN'`).
      **Acceptance:** A56 including its negative control, A57, A58.

## 8. Admin endpoints

- [ ] 8.1 The admin server in its own worker thread reading the runner's published state, the main-thread heartbeat,
      states and conditions, readiness with its precedence, `/status` and `/config` with their JSON schemas, redaction
      and sanitized errors.
      **Acceptance:** A62, A63, A64, A65, A66, A67, A29.

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
      `chain_archive` store, keeping range partitioning).
      **Acceptance:** A77, A78, A88, A90.
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

- [ ] 14.1 The private backbone (`core-private-source`, `core-key-registry`), binding, block intake.
      **Acceptance:** A112, A113, A114, A116.
- [ ] 14.2 The process transport and its messages; opt-in mutual TLS.
      **Acceptance:** A115, A121.
- [ ] 14.3 Lockstep and the behind-instance refusal.
      **Acceptance:** A117, A118.
- [ ] 14.4 The key API, test keys, privacy checks, the private-snapshot refusal.
      **Acceptance:** A119, A120, A122, A123.

## 15. Snapshots

- [ ] 15.1 Export (command and at stop) and the file format.
      **Acceptance:** A124, A125.
- [ ] 15.2 Import in place with its checks, the import marker and the final identity transaction.
      **Acceptance:** A126, A127, A128.

## 16. Browser

- [ ] 16.1 The browser build (page, core, ledger and private workers, PGlite, Web Locks, snapshot picker) and its
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
