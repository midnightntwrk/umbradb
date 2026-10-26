# Tasks — CORE-ARCH: the standalone indexer's core architecture

No implementation code before the stage-1 gate (the cold adversarial review of this spec, its fix check, and the owner's
approval). Then one task per change set, test first: write the tests for the task's criteria, watch them fail for the
intended reason, implement until they pass. One task is one atomic change set; no placeholders, stubs or `TODO`s.
Independent tasks may be built at the same time in separate worktrees, each verified on its own and integrated one at a
time (AGENTS.md stage 2). After each task: `npm run typecheck` and `npm test` green, and the task checked here with the
criteria it demonstrated.

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
      with their SHA-256. Recorded once, when a task first needs real data (12.3's A99, 18.2), with a complete
      per-height recording: every IN-8 call for every height of each range and both head subscriptions, so any client
      that makes any subset of those calls replays against the same tape; checked for completeness and replayed before
      publishing, and never recorded again (owner decision Q123).
      **Acceptance:** each tape replays against the tape node and its SHA-256 matches; the boundary data is recorded
      with its source; every IN-8 call of every height is on the tape. (Runs after task 9.2, when first needed.)
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
- [x] 0.5 Load-sensitive tests (owner decision Q122): explicit timeouts fit for PostgreSQL under load in the database
      suites the plan's Phase 3 "Load-sensitive tests" lists, the writer-lock negative control's lost connection, the
      Testcontainers start-up timeout, and an orphan guard for every test child process (issues 00015, 00021, 00022).
      **Acceptance:** A153.
      **Done (2026-10-26):** the causes, found in full runs at load averages of 20–100 (before the fix, one at 60–85
      failed 27 tests in five of the listed files; the other listed failures are the plan's and task 8.1's runs). (1)
      Vitest's default 5 s in the database suites and the static scans (`test/db/migrate.test.ts`, `roles.test.ts`,
      `roles-login.test.ts`, `requires-resync.test.ts`, `test/config/history-database.test.ts`,
      `development-opt-in.test.ts`, `test/postgres/checkpoint-store.test.ts`,
      `test/node/no-indexer-or-wallet-sdk.test.ts`, `test/deterministic-postgresql/checks.test.ts`,
      `block-transactions.test.ts`): a budget too short for a loaded machine — the tests await database work or parse
      files, none waits on wall time; `vitest.config.ts` sets `testTimeout` 60 s, about three times the slowest such
      test measured (21.0 s at a median load average of 77), and `test/timeouts/timeouts.test.ts` runs a fixture under
      the repository's configuration: a 6 s test passes, one that never ends fails at 60 s. The longest tests' own
      budgets, overrun at a median of 77, were raised the same way: the A59 and A60 property suites 10 → 20 min (the
      timed-out A60 run went on against the shared database and failed the next test), `test/private/` 480 → 900 s per
      test and 180 → 600 s for a private process to reach a height. (2) The writer-lock negative control's
      `CONNECTION_CLOSED` on `BEGIN`: a race in A17's checks, not in the API — `terminate` returns once PostgreSQL no
      longer lists the backend, but the driver learns of the close only when it comes through Docker's port proxy, and a
      transaction begun before then fails on its `BEGIN` with `connection-lost` (DB-13: retryable, its body not run), as
      `postgres-faults.test.ts`'s "at most one connection-lost" says; reproduced by a probe (1 of 40 rounds at load
      about 22). The re-take and lost-lock checks (`writer-lock-checks.ts`) allow one `connection-lost` before the body
      (`nextTransaction`, its cases tested in the negative-control file), and their waits for a backend's end are 30 s
      deadlines instead of 5 s. (3) Testcontainers' "ports to be bound" 10 s is fixed in its code
      (`inspectContainerUntilPortsExposed`, out of `withStartupTimeout`'s reach) and left the container running:
      `test/containers.ts`'s `startContainer` removes what a failed attempt left and tries again (4 attempts) and labels
      every container (repository, pid); `startContainers` stops the started ones when one fails (both durability-probe
      setups, which had left six containers); every container start under `test/` goes through them (static check). (4)
      The pool keeps Vitest's default: capped at 8 workers the tail was shorter but the run 28 % longer at the same
      load, and neither failed. (5) An orphan guard for every test child and container: `spawnChild`
      (`test/child-processes.ts`) lists each child with a watcher of the test process (`test/orphan-watcher.mjs`) that
      kills it with SIGKILL when that process ends — also a stopped child or one with a blocked event loop, which an
      in-process check cannot end — and removes the process's labelled containers; every async child start under `test/`
      (11 files) uses it; `test/child-processes.test.ts` and `test/containers.test.ts` orphan children and a container
      on purpose, with negative controls (plain `spawn`, Testcontainers' own `start`), and fail on any other start. (6)
      `test/db/pglite-queue.test.ts` keeps its data directories in one temporary root. (7)
      `test/db/zero-timeouts.negative-control.test.ts`'s setup, cut by its own 1 s timeouts at load 85, is tried again
      on `connection-lost`. Issues 00015, 00021, 00022 closed. Mutation pass over the new helpers: 46 wrong variants of
      the watcher, `spawnChild`, `guardPid`, `guardContainers`, `startContainer(s)` and `nextTransaction`, run in a
      scratch copy (`RESTORED-OK`): 39 caught, 7 survived, each equivalent (a second check dropping pids 0 and 1 that
      the first already drops, `end` beside `close`, the watcher's own exit, one of the two label filters, unlisting an
      exited pid, the error handler of a watcher that died). A153: six consecutive `npm run test:conformance` runs,
      started 11:33–12:32 at load averages of 40–55 (the other lanes and the mutation pass; medians 42–64, peaks up to
      111; no CPU burner needed), each exit 0, `Test Files 196 passed | 1 skipped (197)`, 3,890 tests passed, all 25
      required ids, 449–690 s, the last on the committed sources (after a fix to the new container test's cleanup);
      after each, no container of this worktree's labels and no test child process left.

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
      result mapping and parameter texts (row 8). **Pending:** the `jsonb` and `numeric` `CHECK`s (row 5, task 7.1,
      done); the `BEFORE TRUNCATE` trigger (row 6, task 2.3, done); the zero timeouts (row 7, task 2.7); date and time
      as RFC 3339 text (row 8, task 2.2b, done); the opt-out (row 9: its declaration task 3.1, its skips task 7.1, done;
      backups carrying its rows, task 15.2).
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

- [x] 3.1 Declaration types, `defineModule`, declaration validation; a `table` item's optional `deterministic: false`
      (Q76).
      **Acceptance:** A20, A21.
      **Done (2026-10-25):** `src/modules/declaration.ts`: CORE-ARCH §4.10's types (`ModuleDeclaration` with
      `requiresResync?`, `ItemDeclaration`, `Lifetime`, `FieldKind`, `FieldSchema`, `Migration`, `Revision`,
      `ProcessContext` with MD-7's `publish`, `BlockContext`, `ItemSink`, `ApiRegistry`, `PointCallbacks`, and
      `BlockHeader` and `PendingKey`, which CORE-ARCH names without defining), `POINTS` (design §2's thirteen, in order)
      and `defineModule`, which returns its argument and whose type refuses a callback under a name that is not a point,
      also in a declaration built first and passed later. `src/modules/validation.ts`: `validateDeclarations({ backbone,
      core, user })` validates declarations given as `unknown`, so a module built without types is held to the same
      declaration: every shape the type forbids is refused with `invalid-declaration` naming the field (plus a `table` on
      an item without the `table` lifetime, an item provided twice, a table listed by two items, `keyKinds` without
      `validateKey`), then MD-2's causes, one rule and one code each (`DECLARATION_RULES`): `bad-id` (the schema plan's
      own check, `checkNames`, now exported by `src/db/roles.ts`), `reserved-prefix` (user modules), `duplicate-id`
      (before the schema plan would call it a schema collision), `no-requirement` (not for backbone parts),
      `item-no-lifetime`, `table-item-no-kind`, `field-no-kind` (the field's outermost schema's `meta().kind`), and MD-1's
      `unknown-point`; every message names the module, the cause and the fix. Five codes are new in `design.md` §11
      (decision record Q94, owner's answer A). `src/modules/adapters.ts`: `schemaModule`/`schemaModules` (`OWN_PARTS`
      left out) for `planSchemas`, and `migrationPart(declaration, context)` for `startDatabase` (`on-start-db` called as a
      method of `points` with the module's process context). `deterministic: false`: carried to the schema plan's
      `optedOut`; the skip is the component's, written once in `src/deterministic-postgresql/opt-out.ts` (`optOut`), which
      `databaseRefusals(tables, relations, { optedOut })` (each relation now knows the table it belongs to:
      `catalogRelations`' `belongsTo`) and the `TRUNCATE` guard use; `docs/module-guide.md`'s "Data that is not a function
      of the chain". Tests, seen failing first (`tsc`: A20's five `@ts-expect-error` lines unused, the modules missing;
      the suites failed to load; `column-refusals.test.ts` without `belongsTo`; the `[DOC]` checks before the section):
      `test/modules/declarations.test.ts` (A20 — the type test with its committed negative control, a loose definer
      that accepts `on-fetched`; the runtime half for the same declaration built anyway and written in JavaScript),
      `test/modules/validation.test.ts` (A21's table, 14 cases with code, names and words, and its committed negative
      control: the validation without one rule fails exactly that rule's cases; `bad-id`; 49 shapes the type forbids),
      `test/modules/adapters.test.ts` and `test/deterministic-postgresql/opt-out.test.ts` (both backends).
      71 wrong variants (a scratch runner outside the clone): 68 caught on the first run; the 3 survivors were gaps — a
      declaration without `requires`, one item listing a table twice, how a shape refusal names a declaration with an id —
      closed by tests; on the final sources 71 of 71 are caught, none equivalent.
      **Pending:** "refused at startup" through the runner's refusal state (task 5.x, which calls the validation first);
      the requirement graph and the plan's module set (3.2); the startup check, `CHECK`s, change capture and contents
      hash that skip opted-out tables (7.1); `ledgerTasks` in the declaration (12.6); CF-2's `entry` builder (4.1).
- [x] 3.2 Graph resolution per height range, Kahn order, mid-chain rule, development-only rule, shared-item providers.
      **Acceptance:** A22, A23, A24, A25.
      **Done (2026-10-25):** `src/modules/graph.ts`: `resolveGraph({ declarations, start, entries, developmentOptIn })`,
      pure, takes 3.1's validated declarations, S, every revision of every module entry with its effective stop (task
      4.3 gives them) and the `core` entry's development opt-in; backbone parts run from S with no stop, and a module is
      enabled when it has an entry. Heights split at S, every revision's start and every stop + 1 into closed ranges
      `[from, to]` — adjacent providers share no height, overlapping ones share one —; a module's revisions continue
      each other where one's stop + 1 is the next's start (CF-5), and after a gap the next one starts it again. The
      refusals, as rules checked in order (`GRAPH_RULES`), each naming its range — merged over consecutive ranges —,
      module and item: `development-opt-in-required` (MD-5, `details.feature` `development-only-module`),
      `providers-overlap` (MD-3, MD-6), `item-no-provider`, `item-not-available` (MD-3's uncovered range),
      `graph-cycle` (in a range, or only in the union of the ranges, which leaves startup no order), and
      `cannot-start-mid-chain` (MD-4: the module, or its provider at that height). The order (RN-3): the backbone in
      `BACKBONE_ORDER`, then Kahn's algorithm with the smallest id by UTF-8 bytes first (`utf8Order`); `core-digest`
      last at `on-db-write`, after the core and private processes' parts everywhere else and at startup. The outputs:
      `modules`, every part of the database in startup order — `startDatabase`'s parts through `migrationPart`, the
      plan through `schemaPlan` (`src/modules/adapters.ts`) —, `segments`, and per range `order`, `writeOrder` and
      `providerOf`, with `rangeAt(h)`. The `db`/`config` name gap is closed in `planSchemas`, whose one namespace now
      holds the items of `core-chain` and `core-digest` (`OwnPart`): a user module named `db` or `config` is refused
      with `schema-collision`. Five codes join `ERROR_CODES` (all in `design.md` §11); §6 and §4 describe the rest.
      Decision record Q95 (`core-digest`'s place at startup and one startup order) resolved A as shipped; Q96 (a start
      at S above genesis), Q97 (which ranges are checked) and Q98 (MD-4's providers) resolved B (owner, 2026-10-25),
      applied by task 3.2a. Tests, seen failing first (`tsc`: `graph.js`,
      `schemaPlan`, the codes and `planSchemas`' second argument missing; the suites failed to load; three of
      `schema-names`' new tests): `test/modules/graph.test.ts` (A22's table with A23's, A24's and A25's refusals — code,
      details with range, module and item, words — and its committed negative control: the resolution without one rule
      fails exactly that rule's cases; the acceptances; RN-3's order with committed negative controls: a tie-break by the
      order given, by Czech or by numeric collation gives another order; the ranges; the startup order; the name gap;
      the caller's errors, thrown), `test/modules/graph-database.test.ts` (both backends: A25's two providers with
      adjacent ranges writing one table under the item's role, which the consumer reads whole at every height; the
      provider's migrations before its consumer's view, with the control in plain id order), `test/db/schema-names.test.ts`
      (the own parts' items). 68 wrong variants (a scratch runner outside the clone): 64 caught on the first run; of the
      4 survivors 3 were gaps — a cross-range cycle's requirement named by its last span, the order dropping a cycle's
      modules without the cycle rule, every module's items passed as own items — closed by tests; on the final sources
      67 of 68 are caught, the survivor equivalent (activity read at a range's last height instead of its first).
      `docs/issues/00012` recorded (a user module may be named `core`).
      **Pending:** "startup refuses" through the runner's refusal state, the dispatch per point and A38's property test
      (5.x, 5.1); the entries with their effective stops from the configuration history, and A34's module half with a
      configuration (4.3); the providers' writes through the real block loop (5.2); Q96–Q98 (task 3.2a).
- [x] 3.2a The owner's answers Q96, Q97 and Q98 in the resolver (`src/modules/graph.ts`): a start above 0 (genesis) is a
      mid-chain start, at an S above 0 too (Q96); startup checks the ranges that hold a height above the cursor, a range
      that ends at the cursor for a cycle only, the starts above the cursor and the development-only modules active at
      the cursor or later, with the cursor as the resolver's input (Q97); a provider active at the height before a
      module's start needs no `startsMidChain: true` (Q98).
      **Acceptance:** A22, A23, A24 (as amended for Q96–Q98).
      **Done (2026-10-25):** `GraphInput.cursor`, `bigint | null`: the last committed height, null on a new database; a
      cursor below S, or one neither a bigint nor null, is the caller's error (thrown). A range is checked `whole` when
      it holds a height above the cursor (every range on a new database), for a `cycle` only when it ends at the cursor,
      and not at all when it ends below it (`RangeCheck`); a refusal names the span of its checked ranges. Q95's union
      of every range's requirements, past ranges included, still orders startup and refuses its cycles. The result's
      `ranges` start at the range holding the cursor (`rangeAt` is undefined below it); `providerOf` holds the items
      exactly one active part provides — in the range ending at the cursor, whose providers are not checked, an item
      several parts provide is left out —; `modules` and `segments` still hold every part from S. MD-4: every segment
      start above 0 and above the cursor, backbone parts' included, needs `startsMidChain: true` (Q96), and so does each
      provider of a required item there that is not active at the start − 1 (at a start at S none is; Q98); at one
      start a refusal naming a provider comes before a module's own, so a module and the provider starting with it are
      named together. MD-5: only a development-only module with a segment holding the cursor or a later height (any
      segment on a new database). `design.md` §6 gains one clause on the result's ranges and `providerOf`. Tests changed
      to the owner's rules, each naming its decision: a start at S = 1 is now mid-chain (Q96; the genesis cases start at
      S = 0), MD-4's provider case (Q98: the provider now starts with the module); added: the new scenarios of MD-3 and
      MD-4, the cursor's boundaries, the result's ranges, the caller's error — `graph.test.ts` from 66 to 101 tests.
      Seen failing first: `tsc` (`cursor` not in `GraphInput`) and, types stripped, 27 of the then 96 tests (every
      range and start checked whatever the cursor, a start at S accepted, 3.2's messages). Committed negative controls:
      A22's table without one rule fails exactly that rule's cases; ignoring the cursor refuses each of the 11 faults
      at or below it; checking the range that ends at the cursor whole refuses MD-3's "An upgrade adds a requirement".
      Wrong variants (a scratch runner outside the clone): 30 of 32 caught on the first run, the 2 survivors gaps (h − 2
      read for h − 1, the backbone check in the cursor's range) closed by tests; on the final sources 34 of 34 caught,
      none equivalent. Question Q99 raised (A22's "not refused" against Q95's union over every range; shipped as
      RN-3 says, not blocking 5.1).
      **Pending:** the cursor passed, and "startup refuses" through the runner's refusal state (5.x); A34's module half
      with a configuration (4.3); every backbone part declaring `startsMidChain: true` (10.x).

## 4. Configuration

- [x] 4.1 `defineConfig`, `coreEntry`, `versionEntry`, the module `entry` builder; the loader; the plain-data check.
      **Acceptance:** A26, A27.
      **Done (2026-10-25):** `src/config/` (design §1, §7). `entries.ts`: `defineConfig` (returns its argument),
      `coreEntry` (the id `core`, `CORE_ENTRY_ID`, and the build's core version), `versionEntry` (a version the build
      does not carry: a `CoreVersion` for `core`, a semver string for a module; its `config` typed as plain data and
      absent for a scheduled revision), `moduleEntryBuilder`, and the types `Entry`, `UmbraConfig` and `CoreSettings`
      (CF-4's table: a public process's fields with `node`, or a private one's with `instanceId`, each excluding the
      other's); every builder returns a new plain entry — its own id and version, every other field given passed
      through for task 4.2 to refuse, a field that is `undefined` left out. `build.ts`: `buildCoreVersion()`
      (`{ umbradb, ledgers }`), with `UMBRADB_VERSION` a constant held equal to `package.json` (the browser cannot
      read the file) and no ledger version until tasks 12.1–12.2. `defineModule` (`src/modules/declaration.ts`) adds
      the module's `entry` builder to the declaration it returns, a non-enumerable, read-only property typed by
      `z.input` of its `configSchema`, so validation and copies see the declaration unchanged; a frozen declaration
      gets a `TypeError`. `plain-data.ts`: `plainData(value, file?)`, CF-1's definition as fourteen rules checked at
      each place, depth first in property order (`PLAIN_DATA_RULES`: an empty array slot, a property of an array
      besides its elements, a symbol key, a non-enumerable property, a getter or setter — never called —,
      `undefined`, a function, a bigint, a symbol, a non-integer, a negative integer, an integer above 2^53 − 1, a
      class instance, a cycle), refusing with `not-plain-data` and `details { path, found, file? }`
      (`entries[1].config.onError`; `["feed-url"]` for a key that is not an identifier; `""` for the default export)
      and returning a deeply frozen copy (−0 as 0, a key `__proto__` kept as data). `load.ts`: `loadConfig({ file?,
      cwd? })` — `umbradb.config.ts` in the working directory by default, imported (on Node.js through its type
      stripping), its default export checked and returned as `{ file, data }`; `invalid-configuration` with
      `details.reason` `file-not-found`, `load-failed` (the cause and its `errorCode`; Node.js's refusal of an `enum`
      adds "erasable TypeScript only") or `no-default-export`. One code joins `ERROR_CODES`, `not-plain-data`
      (already in design §11). `docs/issues/00012` closed: MD-2's validation refuses a user module whose id is `core`
      with `reserved-prefix`, and MD-2's text and A21 name the case. Tests, seen failing first (`tsc` exit 2, 41
      lines: the `src/config/` modules missing, 12 `@ts-expect-error` lines unused, `entry` missing on declarations,
      `not-plain-data` not an `ErrorCode`; three suites failed to load; the compiler test found `Cannot find module`;
      A21's `core` row accepted): `test/config/plain-data.test.ts` (A26's seven values, each in a configuration file
      loaded by `loadConfig`, with code, path, found and words; 19 more values, one rule each; paths; accepted values
      and the frozen copy; a getter never read; its committed negative control: the check without one rule fails
      exactly that rule's rows), `test/config/builders.test.ts` (A27: `@ts-expect-error` on a misspelled core field,
      a wrong field type and a module `entry` given another module's settings — each shown needed, its error the
      intended one on its line — and the committed negative control, a builder typed loosely that accepts all three;
      the builders at run time), `test/config/typed-config.test.ts` (the TypeScript compiler on a configuration file:
      each fault at its line with its words, the corrected file clean), `test/config/load.test.ts` (the loader; and in
      a plain Node.js process, the loader bundled with esbuild: erasable TypeScript loads, an `enum` is refused), and
      `test/modules/validation.test.ts` (A21's `core` row). 97 wrong variants (a scratch runner outside the clone): 90
      caught on the first run; the 7 survivors were gaps — array properties named like elements (`"01"`, `"1.5"`), a
      getter read, and four in the types (`node` and `instanceId` required; the exclusions, which only an object built
      first exercises) — closed by tests; on the final sources 101 of 101 are caught (4 variants added for the other
      exclusions), none equivalent.
      **Pending:** "startup refuses" through the runner's refused state (task 5.x, which calls the loader); the
      entries' shape, the settings schemas, the `core` fields' kinds, defaults and validation, and the redaction
      (4.2); the history, the effective stops for the graph and the version check (4.3); `umbradb config check` and
      `--config` (4.4); the ledger versions of the core version (12.1–12.2).
- [x] 4.2 Schema validation with kinds, defaults and the `core` fields of CF-4; secret redaction helper.
      **Acceptance:** A28; A29 (completed in 8.1).
      **Done (2026-10-25):** `src/config/` (design §7). `core-settings.ts`: `PUBLIC_CORE_SCHEMA` and
      `PRIVATE_CORE_SCHEMA`, CF-4's table as zod 4 objects strict at every depth, each field's kind on its outermost
      schema and its default (`ledgerSources` each `vendored`, `sweep` `on`, `retainStates` 0, `listen.admin`
      `0.0.0.0:8081`, 600, 64, 30000, no lockstep instance, 30000, 30000, 60000, 3, false, false; `testKeys` a secret,
      default none); `genesisHash` required with `custom` and refused with the four known networks; hashes 32 bytes,
      byte values `0x` lowercase hex (`hexBytes`, `hashHex`); addresses `host:port`; `apiReadTimeoutMs` from 1 to
      2,147,483,647; `CORE_VERSION_SCHEMA`; the builders' `CoreSettings` held equal to the schemas' input types by a
      type test. `validate.ts`: `validateConfig({ config, declarations, side })`, fourteen rules (`CONFIG_RULES`) each
      reporting every violation at once as `invalid-configuration`, `details { file, reason: "invalid-entries",
      findings }`, each finding with its path (`entries[1].config.pollMs`), its entry `{ index, id, start }`, its field
      and a message that never holds a setting's value: the top level `{ entries }`; each entry an object with no
      unknown property, an id of `core` or of a core or user module (a backbone part's refused), heights with `stop ≥
      start`, a semver version or a core version, an object `config`, required for the build's version; `(id, start)`
      once; a `core` entry; no lone UTF-16 surrogate (the history could not hash it); for a revision of the build's
      version, no setting its schema lacks (a key check against `schema.shape`, since `z.object` strips unknown keys;
      the other side's `core` fields named as such; a likely misspelling suggested), the schema's own `safeParse` (its
      messages and errors redacted) and settings that stay plain data. It returns every revision with its parsed
      settings (defaults applied), kinds and data fields, and S; a `versionEntry` revision is not validated against this
      build's schema. `entriesAtCursor(checked, cursor)` (`CURSOR_RULES`) refuses a scheduled `versionEntry` carrying a
      `config` and an earlier one without its recorded `config`, and places each revision (`started`, `scheduled`).
      `redact.ts`: `configRedactor(checked)` (`text`, `settings`), `redactor`, `redactorWith`, `secretStrings`,
      `REDACTED`: each string of a `secret` field, and the password of every URL in the other fields, hidden as written,
      decoded and in each encoding (`SECRET_PARTS`, `SECRET_ENCODINGS`), URL userinfo and credential query parameters
      in any text (`TEXT_PATTERNS`); `settings` shows a `secret` field, or one of unknown kind, as `[redacted]`.
      `plain-data.ts`: `samePlainData` and `pathOf` exported. Module guide: "Settings". No code added to
      `ERROR_CODES`. Q102 raised (not blocking: which `core` revision's operational fields a process uses).
      Tests, seen failing first (`tsc` exit 2, 37 lines: the three new modules missing; the three new suites failed to
      load):
      `test/config/validate.test.ts` (A28's table of 61 rows, one rule each, through `validateConfig`, checking code,
      details, path, entry, field and words; the defaults; kinds and data fields; the output; CF-3's `versionEntry`
      scenarios; 4 cursor rows; no secret in a refusal; a file through the loader; the committed negative controls — the
      validation without one rule loses exactly that rule's findings, row by row, and zod's own parse accepts the
      misspelled setting the validation refuses), `core-settings.test.ts` (CF-4's table, written out, against both
      schemas: kinds, defaults, required fields; the formats; the type test), `redact.test.ts` (A29's helper half: the
      password of a `database` URL in none of its six forms in `/config`'s settings or in eight texts built from the
      setting; URL credentials in any field and text; the committed negative control — without one part, encoding
      or pattern, exactly the texts that need it leak), `plain-data.test.ts` (`samePlainData`). 177 wrong variants (a
      scratch runner outside the clone): 168 caught on the first run; of the 9 survivors 8 were gaps — the private
      schema's genesis rule and strictness, heights given without the plain-data check, a surrogate pair taken for a
      lone surrogate, the first rather than the closest suggestion, an inherited key in `samePlainData` and the kinds, a
      URL password not decoded — closed by tests; on the final sources 176 of 177 are caught, the survivor equivalent
      (an unknown setting's value never reaches the schema, so no message to redact can hold it).
      **Pending:** "startup refuses" through the runner's refused state, and which `core` revision's operational
      settings the process uses (task 5.x, Q102); the history — a `versionEntry` equal to or differing from its
      recorded row, a scheduled one recorded with id, start, stop and version, an entry above the cursor re-recorded —,
      effective stops and overlapping revisions, `missing-entry`, the version check and CF-9's development opt-in (task
      4.3); `umbradb config check` (task 4.4); `/config`, `/status` and the logs through the redaction (A29, tasks
      8.1–8.4 and 5.x); `ledgerTable`'s default, the built-in table (task 12.2).
- [x] 4.3 `core-chain`'s configuration history: revisions, future-only comparison, `data_hash`, the version check, the
      development opt-in.
      **Acceptance:** A30, A31, A32, A33, A34.
      **Done (2026-10-25):** `src/config/history.ts` (pure), `src/backbone/core-chain/history.ts` (the table),
      `src/config/process.ts`, `src/config/database.ts` (design §7, §10). `core_chain.config` is created by
      `core-chain`'s migration `001` (`CORE_CHAIN_MIGRATIONS`, as the login; design §10's owner): key `(entry_id,
      start)`, `stop` null when absent and always for `core` (a `CHECK`), `version` text, `data` `jsonb` and `data_hash`
      32 bytes, both null for a scheduled revision (CF-3: id, start, stop and version only) and otherwise both present
      (a `CHECK`); module roles read it, none writes it. A revision's row (`rowOf`): its stop as written, its version (a
      module's semver; the core version's canonical JSON, `canonicalJson`: RFC 8785 on plain data, keys by UTF-16 code
      units), its data fields (the build's version's parsed `data` settings, defaults applied; an earlier
      `versionEntry`'s `config` as written) and `dataHash`, SHA-256 of their canonical encoding (DT-1). Effective stops
      (CF-5): the next revision's start − 1, or the revision's own stop when lower (a gap, then a new start MD-4
      checks); an own stop at or above the next start is superseded; the core's stop bounds nothing. `checkHistory({
      config, cursor, declarations, history })` places the entries (`entriesAtCursor`), takes the process's `core`
      revision (`processCoreEntry`: the latest of the build's version, Q102 resolved A (owner); none →
      `invalid-configuration`, `reason: no-build-core-revision`) and runs `HISTORY_RULES`, refusing with the first code
      that has findings, every finding of it at once (`details.findings`, each with its path, entry, field, message and
      `about`, never a setting's value): `missing-entry` (rule `listed`: a recorded `(id, start)` the file omits,
      `details.missing`; CF-5), `changes-past` (`recorded`, `version`, `data`, `stop`: an entry at or below the cursor
      not recorded, or differing in its version, a data field at any depth, or a module's stop unless both stops are
      above the cursor — no stop counts as above it, `stopChangeAllowed`; CF-6), `upgrade-required` (`build-version`:
      the revision covering cursor + 1, S on a new database, not of the build's version; `details { height, entries: [{
      id, start, needed, build }] }`; CF-8), `development-opt-in-required` (`sweep-off`: a `core` revision with `sweep:
      "off"` running above the cursor without the opt-in, `feature: "sweep-off"`; CF-9). It gives `graphEntries` (every
      module revision with its effective stop; `graphInputOf` adds S, the opt-in and the cursor for `resolveGraph`),
      `committedVersions` (DB-10, from the recorded rows over S..cursor) and the `writes`: every entry above the cursor
      that differs from its row or has none, and a module's stop changed above the cursor. The runner calls it before
      `resolveGraph` and `startDatabase`, so every refusal comes before any migration (A33); `core-chain`'s
      `on-start-db` calls `recordHistory(w, input)`, which reads the rows in its own transaction, checks again and
      records the writes there (CF-6: one transaction). `openConfiguredDatabase` (`databaseOptions`) opens what
      `database` names — `pglite:memory`, `pglite:<directory>`, a PostgreSQL URL — with the revision's
      `developmentOptIn` (PGlite refuses without it, task 2.5's `openPglite`, reused) or `fullPageWritesOffAllowed`.
      `ERROR_CODES` gains `missing-entry`, `changes-past`, `upgrade-required` (design §11 had them). Q103 raised (not
      blocking: CF-5 refuses omitting a recorded entry above the cursor too; shipped A, CF-5 as written). Tests, seen
      failing first (`tsc` exit 2, 28 lines: `src/config/history.js`, `process.js`, `database.js` and
      `src/backbone/core-chain/index.js` missing, and the implicit `any`s that follow; the four suites failed to load,
      `Cannot find module`): `test/config/history.test.ts` (CF-7's row, canonical JSON and `data_hash` against CBOR
      written by hand; CF-5's effective stops, `revisionAt` and a module that cannot start mid-chain continuing at its
      later revision — the gap as the control; A30's `missing-entry`; A31's table of 15 refusals and 13 acceptances with
      what each records; A28's renaming upgrade; A33's newer and older builds of a module and of UmbraDB, S on a new
      database, the boundary restart, the core's operational stop; DB-10's committed versions; Q102 A; CF-9's sweep; the
      caller's errors; the committed negative controls: each rule left out accepts exactly its cases, stops compared
      strictly refuse exactly the stop allowance's cases, operational settings recorded refuse exactly the operational
      ones), `history.property.test.ts` (A32, seed 20261025: `data_hash` independent of property order at every depth
      and changed by any value; the controls: a hash in written order fails the first, a hash of the keys the second),
      `development-opt-in.test.ts` (A34 through configuration files: PGlite with and without the opt-in, nothing
      created; a development-only module through the graph; `sweep: off`; Q102 A's opt-in), `history-database.test.ts`
      (PostgreSQL 18.6 and PGlite 0.5.10, through a startup standing in for the runner's, `history-startup.ts`: the
      table's columns, checks, owner and privileges; the rows recorded in one transaction; A31's refusals changing
      nothing, a stop raised above the cursor, a revision above it recorded, the recording rolled back with its
      transaction and comparing what that transaction sees, operational changes leaving every row and its `xmin`, the
      core's stop raised or removed at cursor 10; A30; A28's history half; A33 adding no `core_chain.migrations` row
      and, as its committed negative control, the version check after the migrations adding `m/002`; `requires-resync`
      from the history). 110 wrong variants (a scratch runner outside the clone): 98 caught on the first run; the 12
      survivors were gaps — a revision superseded before S counted for DB-10, `(id, start)` keys run together, nested
      data fields, a sweep-off revision ending at the cursor, a module's own `sweep` setting, the order of
      `historyFindings`, `upgrade-required` before the opt-in, a cursor at S, an above-cursor revision changing only its
      stop or its version (also in the table), the graph's cursor — closed by tests; on the final sources 110 of 110 are
      caught, none equivalent.
      **Pending:** "startup refuses" through the runner's refused state, "processing continues" past a raised core stop,
      the cursor from the `blocks` table and the operational settings in use (tasks 5.x, 5.3, 10.2: `processCoreEntry`);
      `core-chain`'s declaration calling `recordHistory` (10.2); `umbradb config check --database` (4.4); `/config`
      showing a `versionEntry`'s settings once checked (8.4); the ledger versions in the core version (12.1–12.2);
      private backups under the opt-in (15.x).
- [x] 4.4 `umbradb config check` and the `umbradb` command.
      **Acceptance:** A35, A6.
      **Done (2026-10-25):** `src/cli/` (design §1, §7, §12): `main.ts`, the package's `bin` `umbradb`
      (`dist/cli/main.js`, a node shebang; in `package.json` and the lockfile's root entry), running `runMain`;
      `command.ts` — `runCommand` over `COMMANDS` (`run`, `config`, `backup`, `restore`), arguments by Node.js's
      `util.parseArgs` (no dependency), the usage (design §12's forms, the exit statuses: 0 passed, 1 a check failed or
      could not be completed, 2 the usage, 3 not available in this build). No command, an unknown one (`sync`, 0.9.5's
      archive sync, among them) or a wrong argument of `config check` prints a one-line reason and the usage on stderr
      and exits 2; `--help` or `-h` alone prints it on stdout and exits 0; `run`, `backup` and `restore` are recognized
      and exit 3, "not available in this build", whatever their arguments, until tasks 5.x and 15.x replace their
      entries; a `--database` value (once, a value, the `database` setting's format, not `pglite:memory`) is never
      echoed, and any argument a message repeats has its URL credentials hidden. `config-check.ts` — `configCheck`
      runs three checks (`CHECK_STEPS`) and reports every finding of each with its path: the type check
      (`type-check.ts`: the TypeScript compiler — `typescript`, a runtime dependency since task 0.1, loaded when a file
      is checked — with `noEmit` and fixed options, those of a Node.js ES module under type stripping: `NodeNext`,
      `erasableSyntaxOnly`, `verbatimModuleSyntax`, `allowImportingTsExtensions`, `strict`, `skipLibCheck`; a `.ts` file
      under a `package.json` without `type` read as an ES module, as Node.js detects it; each diagnostic at
      `file:line:column`, a package's left out); the configuration (the loader, which runs the operator's code, Q44;
      the validation, every finding at once; the process's `core` revision, Q102); and, with `--database` only, the
      history (`database.ts`: the cursor and `core_chain.config` in one read-only read — PostgreSQL through a read
      connection, no writer lock, so beside a running process; PGlite under the file's opt-in, its directory's lock
      taken, a directory without `PG_VERSION` checked as a new database and not created —, then `entriesAtCursor` and
      `historyFindings`, every finding of every code). Without `--database` no database is opened and the report says
      the history checks were not run. The side comes from the file (`inferSide`); the modules are the command's
      build's (`build-modules.ts`: `core-block-commit`, `core-digest`; no user module, MD-1), a host program passing
      its own to `configCheck` (question Q106). Every text is redacted (`configSecrets`, new in
      `src/config/validate.ts`; the `--database` value; the URL patterns). Design §7's bullet and §12's command say
      what was built; the `src/cli/**` coverage floor (90/85) is added and `main.ts`, run only as a process, left out
      of coverage; the pack smoke test runs the installed command (oracle 4b). Tests, seen failing first (`tsc` exit 2,
      29 lines: `src/cli/command.js`, `config-check.js`, `build-modules.js` missing and the implicit `any`s that
      follow; the four suites failed to load, `Cannot find module`; oracle 4b failed with no `umbradb` in
      `node_modules/.bin` while `bin` was left out): `test/cli/command.test.ts` (A6 in this process: the usage and exit
      2 for no argument, `sync` and 15 other commands, `--help`, the four commands recognized, `config check`'s 9
      argument errors, no `--database` echoed, `runMain`, the `bin` entry; the committed controls: a command table
      recognizing `sync` fails A6's check, one printing the usage for `run` fails "recognized"),
      `config-check.test.ts` (A35 without `--database`: a valid file, a type error and a schema error printed with
      their paths, CF-10's scenario found by both checks, CF-1's refusals, an `enum`, the module formats, the options,
      local and package files, the side, a host's declarations, no database opened — a TCP listener counting 0
      connections, a PGlite directory not created —, no secret printed; the committed controls: a check stopping at
      its first finding fails "prints both", one without the redaction prints the `--database` password),
      `config-check-database.test.ts` (A35 with `--database` on PostgreSQL 18.6 and PGlite 0.5.10: `changes-past`, exit
      1, the database unchanged — every table's row count and the rows of `core_chain.migrations` and
      `core_chain.config` with their `xmin` —; the same file passing; every finding of every code; CF-3's cursor rules;
      new, empty and uncommitted databases; the opt-in; a held PGlite directory; PostgreSQL beside a running writer;
      the committed control: recording the history, or running the migrations, changes the snapshot),
      `umbradb.test.ts` (the command bundled with esbuild and run by Node.js in a child process: A6; A35 without and
      with `--database` on both backends; Node.js's own `enum` refusal; the module formats; a PGlite directory another
      process holds). Wrong variants (a scratch runner outside the clone): 127 of 144 caught on the first run; of the 17
      survivors one was redundant code (the type finding's message repeating its path; removed) and 16 were gaps — a
      URL typed as a command, `--help` with more arguments, commands named like `Object.prototype` members, `config`
      alone, the backends' own refusals shown as they are, the report's findings redacted, `strict`, `skipLibCheck`,
      the target's library, declaration and `.cts` files' format, a directory below a CommonJS package, a package's
      TypeScript sources, a directory as the file, an empty PGlite directory — closed by tests; on the final sources
      143 of 143 caught, none equivalent. Question Q106 raised (not blocking); issue
      `docs/issues/00014-history-start-above-cursor-throws.md` recorded (OPEN).
      **Pending:** `umbradb run` (tasks 5.x) and `backup`, `restore` (15.1, 15.2); an operator's user modules in the
      command (Q106); `core-chain`'s declaration and the core modules in the command's build (10.2, 11.x–13.x); the
      §12 surface and the pack smoke's rewrite with §12's imports (17.3); a file whose S is above the cursor refused
      with a code (the issue).
- [ ] 4.3a The owner's answer Q103 B: a recorded entry that starts above the cursor may be omitted or moved; its history
      row is deleted in the transaction that records the configuration.
      **Acceptance:** A30 (as amended).
- [ ] 4.4a The owner's answer Q106 B: the configuration file's exported `modules` are the build's user modules for
      `umbradb config check` and `umbradb run`, next to UmbraDB's own.
      **Acceptance:** A152.

## 5. Runner

- [x] 5.1 Point dispatch and order within points; parallel waves.
      **Acceptance:** A38.
      **Done (2026-10-25):** `src/runner/dispatch.ts`: given a resolved range and a point, `scheduleAt` gives the parts
      registered there in RN-3's order as waves — in series one part per wave, `writeOrder` at `on-db-write`
      (`core-digest` last), `order` at the other points in series; at `on-fetch`, `on-parse` and `on-compute`
      (`PARALLEL_POINTS`, checked against `design.md` §2's table) the backbone parts in series in their fixed order,
      then the other modules in Kahn's waves restricted to the modules registered at the point, a module one wave
      after the latest registered module on a requirement path from it, through modules that do not register the
      point too; `startHeightSchedule` (the core's parts first when the core's entry starts, then the starting
      modules in order, RN-9) and `stopHeightSchedule` (the stopping modules in reverse order, then the core's parts
      in their fixed order, RN-10); `seriesOf` for an order given (startup's `on-start-api`); `scheduleAt` refuses
      `on-start-db` (the migration runner's) and the start and stop points. `runSchedule(schedule, { contextOf,
      invoke })` calls each callback as a method of its declaration's `points`, its module's process context first,
      then the arguments `invoke` hands it (task 5.2's handles, block context and sink); a wave's callbacks start in
      order and are all awaited (`Promise.allSettled`); a failure ends the point — nothing later in series, nothing
      of the next wave, the wave's others awaited, never cancelled — and rejects with a `CallbackFailure` (point,
      module, the error unchanged as `cause`) for the first failing part in the point's order. `design.md` §2's wave
      paragraph says what was built; the `src/runner/**` coverage floor (90/85) is added. Tests, seen failing first
      (`tsc`: `src/runner/dispatch.js` missing; both suites failed to load): `test/runner/dispatch.test.ts` (the
      points' modes against design §2's table; `this`, the context and the arguments at every point; RN-3's two
      scenarios; series and waves, transitive waits, the backbone at parallel points, each range's providers, a core
      module; a failing callback in series and in a wave, two failures, a wave that does not settle, a failing
      backbone part, a malformed schedule; the start and stop orders) and `test/runner/order.property.test.ts` (A38:
      random acyclic graphs of up to 12 modules through `resolveGraph`, seed 20261025, 200 runs, against the test's
      own oracle, with committed negative controls: ties by the order given, by Czech and by numeric collation fail
      only the `on-db-write` order; all callbacks at once, and waits on direct providers only, fail only the parallel
      waits; `core-digest` in its backbone place fails only "core-digest last"). Wrong variants (a scratch runner
      outside the clone): 59 of 62 caught on the first run; of the 3 survivors one was equivalent (a filter of empty
      waves, which never occur; removed) and two were gaps — a core module's `core-` id read as a backbone part's, an
      unfrozen wave — closed by tests; on the final sources 61 of 61 caught. Question Q100 raised (the read
      handles RN-4 and design §2 give `on-finalized`, `on-start-height`, `on-stop-height` and `on-key` are not in
      `PointCallbacks`; not blocking 5.1).
      **Pending:** the finalized loop calling the dispatch per height with the handles, block context and item sink
      `invoke` hands each callback, and A38 through it (5.2); the process contexts shared with `migrationPart`, and
      `on-start-api` (5.2a); which entries start and stop at a height, and their arguments (5.3); the halt on a
      `CallbackFailure` (5.4); the slow-block watchdog around `invoke` (5.5).
- [x] 5.2 The finalized loop over the block-source interface; `InMemoryBlockSource` with its `core-block-commit`
      cursor table; block context and item sink; per-point handles; the chain-data envelope of module API responses.
      **Acceptance:** A36, A37, A39, A40, A41, A49; RN-16 is covered by A75.
      **Done (2026-10-25):** `src/runner/loop.ts`: `FinalizedLoop` processes every height from the cursor + 1 (S on a
      new database) up to the block source's finalized head, then waits for it to rise (`waitForHead`) with no read or
      transaction open. Per new head `on-finalized` runs once, before the head's heights, for the modules active at the
      first of them, each callback with its own read at the cursor. Per height, through task 5.1's dispatch in the order
      of the range holding it: `on-fetch` and `on-parse` (the block context and an item sink); `on-compute` (a read at
      h − 1 and a sink, each callback inside its own `Database.read`, so on PGlite a `db.read` from it fails with
      `nested-call`, and a failing statement aborts no other callback's read); one `BEGIN … COMMIT` holding every
      `on-db-write` through `openBlockWrites` (the handles' height the cursor before h) and, before the `COMMIT`, a
      check that the cursor is h with the block's hash; then `on-after-db-write` (a read at h, no `block` items). A
      failure stops the loop with a `HeightFailure` (height, point, module, whether h committed); a use of a closed
      write handle or of a kept item sink is one too, even when no callback rejects with it (kept first, named, checked
      before each point, before the `COMMIT` and after the height's last point). `src/runner/block-context.ts`:
      `BlockItems` — a callback's puts buffered and published when it completes, dropped when it fails, a callback
      seeing the items published before it started; only the module declaring an item with the `block` lifetime may put
      it, once per block; a refused put fails its callback even when caught; a put from a kept sink is reported — and
      `revisionAt` (a block context's settings: the revision covering h). `src/runner/block-source.ts`: `BlockRef` and
      `BlockSource` (design §3). `src/runner/in-memory-source.ts`: `InMemoryBlockSource` (a head that only rises, the
      blocks given or a default linked chain, `waiting(above)`) and `inMemoryBlock`.
      `src/backbone/core-block-commit/core-block-commit.ts`: the cursor table `core_block_commit.blocks` (height, hash,
      parent hash), written first in every block by the part's `on-db-write`; `readCursor`, and `cursorHeight` for the
      database API's committed height. `src/runner/envelope.ts`: `readChainDataView`, `chainDataHeaders`
      (`X-Umbra-View`, `X-Umbra-Height` in decimal, `X-Umbra-Hash` in `0x`-prefixed hex), `withViewExtensions` (a
      GraphQL response's `extensions`, `data` unchanged), `answerChainData` (503 `no-committed-height` before block S
      commits; the code joins `ERROR_CODES`). Q100 resolved A (owner, 2026-10-25): `on-finalized`, `on-start-height`,
      `on-stop-height` and `on-key` take a `read: ReadHandle` (`src/modules/declaration.ts`). `design.md` §3 says what
      was built; the `src/backbone/**` coverage floor (90/85) is added. Tests, seen failing first (`tsc` exit 2, 81
      errors: the six new modules missing, Q100's four signatures in the type test, the dispatch fixtures' arguments;
      six suites failed to load): `test/runner/loop.test.ts` (A36, A37, A39, A40; failures and stopping; A10's and
      A144's halves through the loop; the block context), `test/runner/catch-up.test.ts` (A41, A49),
      `block-context.test.ts`, `in-memory-source.test.ts`, `envelope.test.ts` and
      `test/backbone/core-block-commit.test.ts`, on PostgreSQL 18.6 and PGlite 0.5.10, with committed negative controls:
      two heights in one transaction fail A41, waiting inside a read fails A49, a put published at once or items kept
      for h + 1 fail A40, `on-compute` given a read at h fails A39, a loop writing a row itself fails A37. Wrong
      variants (a scratch runner outside the clone): 150 of 162 caught on the first run; of the 12 survivors, four were
      redundant code (the wait's stop result, which the loop's own stop check made unreachable, and a second height
      check in the source's `block`; removed), two are equivalent (a block context built before or inside `collect`,
      which calls its body at once; the order of the envelope's header spread, after a filter that leaves no name in
      common) and six were gaps (a loop woken by a rising head announcing the old head again, one read shared by a
      wave's `on-compute` callbacks, a failure after the commit that is no callback's, `HeightFailure`'s name, a header
      name in another case, the cursor not frozen), closed by tests; on the final sources 157 of 159 caught, the two
      survivors equivalent.
      **Pending:** `on-start-api` (5.2a); `on-start-height` and `on-stop-height` through the loop, and the settings'
      switch (5.3); the `halted` state, retries and RN-11's re-delivery (5.4); the watchdog (5.5); the node source
      and IN-4's parent check (10.3); the cursor table's other columns and `duplicate-block-hash` (10.2);
      `core-digest` through the loop (7.1, 5.x); the exports (17.x).
- [x] 5.2a Process items (`ProcessContext.publish`) and module API registration (`ApiRegistry` mounted on `listen.api`,
      WebSocket subscriptions, duplicate routes refused); each request's read bounded by `apiReadTimeoutMs` (DB-15).
      **Acceptance:** A74, A75; A141's request half through a registered handler.
      **Done (2026-10-25):** `src/runner/process-context.ts`: `ProcessContexts`, one context per module, the same
      object in its `on-start-db` (`startDbPart`: the migration runner's part, run in the module's publishing window)
      and at every point; `publish` only from the module's own `on-start-db`, only an item it declares with the
      `process` lifetime, once per item for the whole process (another provider's second publish too) — any other call
      throws and fails the callback even when caught: `on-start-db` there, `on-start-api` in `registerModuleApis`, the
      loop's points through `LoopInput.misuses`, which `FinalizedLoop.run` watches, naming the module and the point it
      dispatched (none while it waits); `items` a read-only view of the published items the module requires or
      provides, from `on-start-api` on (empty before); `seal()` once every `on-start-db` ran: a late refusal, then
      `process-item-missing` for an item a module running in this process requires (not one whose revisions all ended
      below the cursor's range), naming the item, the modules and the providers. `src/runner/module-api.ts`:
      `ApiRoutes` (a registry per module, closed when its `on-start-api` ends; `GET`/`POST` routes of `/` and segments
      with `:name` parameters, a literal winning; subscription names; `duplicate-api-route` naming the route and both
      modules), `registerModuleApis` (`on-start-api` once, in series in the startup order, for the parts active in a
      range the process may run: a part whose revisions all ended serves no API), `ModuleApi` (each request one
      `db.read` with `{ timeoutMs: apiReadTimeoutMs }`, the handler inside it; RN-16's envelope on every module route,
      a GraphQL response told by its shape; JSON bodies, `bigint`s as decimal text and bytes as `0x` hex, unless the
      handler typed its text or bytes; errors `{ error: { code, message } }` — 400 `invalid-request`, 404, 405 with
      `Allow`, 413, 500 `internal-error` with a fixed message (the error to `onError`), 503 `no-committed-height`, 504
      `query-timeout`; `subscribe`). `src/runner/api-server.ts`: `listenModuleApi` (`node:http` on `listen.api`, `ws`
      subscriptions on any path: `subscribe`/`subscribed`/`next`/`unsubscribe`/`complete`/`error`; a subscriber more
      than 1 MiB behind disconnected, so `emit` never waits; closing ends every connection) and `startModuleApi`
      (`on-start-api` and its checks, then the listener, so a refused startup listens nowhere; none without
      `listen.api`). `ERROR_CODES` gains `process-item-missing` and `duplicate-api-route`; `design.md` §2 and the module
      guide's "Process items and APIs" say what was built. Questions Q104 (a subscription notification and RN-16's
      envelope; shipped A, the value only) and Q105 (how a GraphQL response is told; shipped A, by its shape), not
      blocking 5.3. Tests, seen failing first (`tsc` exit 2, 40 lines: the three modules missing, the two codes unknown,
      `LoopInput.misuses` unknown; the four suites failed to load): `test/runner/process-context.test.ts` (A74 through
      the runner's startup and loop; the rules without a database), `module-api.test.ts`, `api-server.test.ts` (A75;
      A36/A39 with `on-start-api`; the listener's own behaviour), `api-timeouts.test.ts` (A141's request half on
      PostgreSQL 18.6, PGlite setting neither timeout), with `process-harness.ts`, on PostgreSQL 18.6 and PGlite 0.5.10;
      committed negative controls: contexts allowing a second publish, or one outside `on-start-db`, fail A74; a
      registry accepting a duplicate route fails A75's duplicate checks, responses without the envelope its envelope
      checks; a handler's read ignoring `apiReadTimeoutMs` fails A141's request half. Wrong variants (a scratch runner
      outside the clone): 166 of 174 caught on the first run; of the 8 survivors, 3 were gaps (an address that is not a
      string, the 413's `Connection: close`, closing with a request in flight; closed by tests), 2 unused options (the
      subscriber buffer limit and the start's listener options; removed) and 3 equivalent; on the final sources 170 of
      173 caught, the 3 survivors equivalent (chunks of a refused body still buffered, the request's `error` listener
      without which Node.js swallows the error, a stopped loop that keeps watching).
      **Pending:** the startup assembled with the configuration — `listen.api` and `apiReadTimeoutMs` from the latest
      `core` revision of the build's version (Q102), each module's revisions, the API closed at SIGTERM — (5.3); the
      `refused` state for `process-item-missing`, `duplicate-api-route`, a failing `on-start-db` or `on-start-api` and a
      listener that cannot listen, and the `halted` state for a refused publish (5.4); `core-chain` publishing the real
      process items (10.2); the browser's `postMessage` transport (16.1); the exports (17.x).
- [x] 5.3 Revisions and settings; start and stop heights; the upgrade-boundary stop; SIGTERM; the `core` entry's
      operational fields from its latest revision of the build's version (Q102).
      **Acceptance:** A42, A45, A47, A48, A149.
      **Done (2026-10-25):** `src/runner/process.ts`: `startProcess({ declarations, config, source, signal?, log?,
      onChecked? })` returns a handle at once and starts up — the declarations validated, the configuration loaded (a
      file, CF-1, or its data, held to CF-1's plain data) and validated, the `core` entry's operational and secret
      fields from its latest revision of the build's version for the whole run (`processCoreEntry`, Q102: the database,
      the node — a block source given as a function is made from that revision —, `listen.api`, `apiReadTimeoutMs`, the
      opt-in, `followingThreshold`, `readinessLag`, the core's stop), the database opened and its writer started (the
      durability probe's warnings logged), the cursor and the history read in one read and checked (`checkHistory`:
      CF-5, CF-6, CF-8 before any migration), the facts handed to the backbone (`onChecked`: until task 10.2 builds
      `core-chain`, which records the history and publishes the database read-only with them), the graph, the schema
      plan, the process contexts with each part's revisions (`processRevisions`: a module's from its entries with their
      effective stops and settings; every backbone part's the `core` entry's, each revision's data fields with the
      process revision's operational and secret fields), `startDatabase`, the seal, `startModuleApi`, then the finalized
      loop with the core's stop and the upgrade boundary (`upgradeBoundary`: the lowest start of a scheduled revision,
      with each entry starting there, the version needed and the build's). A refusal closes what startup opened and
      rejects `started` with its typed error; `ended` tells how processing ended (`stopped`, `signal`, `refused`,
      `failed`). The state (`statusOf`, CORE-ARCH §4.18's part of this task): `starting`, `syncing` or `following` by
      the lag against `followingThreshold`, `stopped` (with `upgrade-required` at a boundary), `stopping`; ready when
      `following` or `stopped`, or `syncing` within a set `readinessLag`. `terminationSignal` (SIGTERM aborts it) and
      `stop()`: `stopping`, the loop's signal aborted and the loop awaited — the height in progress, its transaction
      included, finishes —, then the module API and the database closed; during startup it stops before the next step.
      Log lines go through `configRedactor(checked).text`; a refusal before the configuration is validated is logged by
      its code only. `src/runner/loop.ts`: `on-start-height` between `on-parse` and `on-compute` for the core's parts at
      S and the modules a segment of which starts at h (revisions continuing each other are one segment, CF-5), each
      with its entry and a read at h − 1; `on-stop-height` after `on-after-db-write` for the modules a segment of which
      ends at h, in reverse order, then the core's parts at and above its stop, each with a read at h; RN-11's
      re-delivery of the cursor's `on-after-db-write` and `on-stop-height` at every `run()` before c + 1; the loop ends
      after its last height — the core's stop, or the height before the upgrade boundary, the lower — and at a restart
      at or above the core's stop processes nothing; `run()` resolves with a `LoopEnd`; `LoopInput` gains `coreStop`,
      `boundary` and an `observer` (heads read, heights committed). `src/runner/dispatch.ts`: `isBackbonePart` and
      `entryIdOf` exported. `design.md` §2 says what was built; the module guide gains "Start and stop heights".
      Question Q109 raised (the core's stop lowered below the cursor; shipped A, not blocking 5.4); issue
      `docs/issues/00015-pglite-writer-worker-has-no-orphan-guard.md` recorded (OPEN). Tests, seen failing first
      (`tsc` exit 2, 21 errors: `src/runner/process.js` missing, `isBackbonePart` not exported, the loop's new seams and
      `boundary` unknown; the five suites failed to load): `test/runner/revisions.test.ts` (A42), `stop-heights.test.ts`
      (A45; RN-9's and RN-10's orders and handles, a raised and a lowered core stop, failures, the re-delivery),
      `upgrade-boundary.test.ts` (A47; the core's stop beside the boundary; the old build refused at the boundary;
      DB-10), `process.test.ts` (A149; startup, refusals, logs, the state, the signal; `statusOf`, `upgradeBoundary`,
      `processRevisions`, `terminationSignal`), `sigterm.test.ts` with `sigterm.worker.ts` (A48 with a real process and
      a real SIGTERM), with `process-build.ts`, `process-backends.ts` and `sigterm-module.ts`, on PostgreSQL 18.6 and
      PGlite 0.5.10; committed negative controls: a loop that fires `on-start-height` at a continuing revision fails
      A42; one whose core gets `on-stop-height` before the stopping modules, and one that does not re-deliver after a
      restart at the stop, fail A45; one that commits the boundary height, and a recording that stores the revision's
      operational and secret settings, fail A47; a process that exits on SIGTERM without awaiting the block fails A48
      (no stop completed; PostgreSQL counts its sessions abandoned, PGlite's `pg_control` stays in production); a
      process taking the first `core` revision's operational fields fails A149. `loop.test.ts` and `api-server.test.ts`
      updated for RN-9 and RN-11 (the recording module sees `on-start-height` at its start; a loop run again re-delivers
      the cursor's `on-after-db-write`; `run()` resolves `{ kind: "signal" }`). Wrong variants (a scratch runner outside
      the clone): 105 of 123 caught on the first run; of the 18 survivors one was equivalent (closing the module API
      again in a refused startup, which only a stop reaches after the API opens, and the stop closes it; removed), one
      was caught by `process-context.test.ts`, which the runner's file list left out, and 16 were gaps (the core
      revisions out of order, a caller awaiting only `ended`, a lag within `followingThreshold`, the module API and the
      database closed by `stop()` and before `closed`, configuration data held to CF-1, the control's backbone settings,
      DB-10's committed versions, `on-start-db`'s height, `apiReadTimeoutMs`, a refusal releasing the database without
      `stop()`, the logs of a failure and of a stop, `status().ended`, a misuse in a re-delivered `on-stop-height`, a
      frozen entry), closed by tests; on the final sources 122 of 122 caught.
      **Pending:** the `refused` and `halted` states, their codes and the process staying up after a refusal, A43, A44
      and A46's fault tests (5.4); the slow-block watchdog around the loop's points (5.5); `umbradb run` calling
      `startProcess` with `terminationSignal` (4.4); `core-chain` built with the runner instead of `onChecked`
      (10.2); the node block source made from the process's `core` revision (10.3); the admin endpoints over
      `status()` (8.x); the backup at the core's stop (15.x); the exports `startProcess`, `ProcessHandle` and
      `ProcessState` (17.x); the required id in the manifest (18.4).
- [x] 5.4 Failure handling and the delivery guarantees after restart.
      **Acceptance:** A43, A44, A46.
      **Done (2026-10-26):** `src/runner/process.ts`: the states `refused` and `halted` (`ProcessState`'s seven, AE-3),
      not ready (AE-4), each with its reason (`ProcessStatus.reason`: a code of design §11, the height, the module and
      the point, never a message; AE-5, AE-6), kept once the process is `stopping`. A startup refusal leaves the
      process up in `refused`, its database closed and its writer lock released; a failure of the loop leaves it up in
      `halted` (RN-8: before the `COMMIT` the loop rolled the height back, after it the height stays committed), the
      module API answering at the cursor and the database open until `stop()`. A failing `on-start-db` names its point
      and module (a `CallbackFailure`, as a failing `on-start-api`'s). The retries (IN-10, CORE-ARCH §4.6): a lost
      database connection (`connection-lost`) or an unreachable node (`node-unreachable`), wherever startup's database
      steps or the loop meet them, never halts or refuses — the condition `database-retrying` or `node-retrying` with
      the attempts and the height, IN-10's back-off (1 s doubling up to the process revision's `backoffCeilingMs`), then
      startup again from its database steps or the loop again from the cursor, which it re-delivers (so a height whose
      transaction was lost is processed again and one whose `COMMIT` landed continues with its `on-after-db-write`);
      the condition clears once startup completes, a height commits or the loop has nothing to process, and a stop ends
      the wait. A writer that finds its lock taken when it reconnects halts with `writer-lock-lost`, for good. Logs:
      `startup refused: <code>: …`, `processing halted (<code>): …`, `processing retries in <ms> ms (<condition>,
      attempt <n>): …`. `src/runner/failures.ts` (new): `reasonOf` — the failure's own code where §11 lists it
      (`REFUSAL_CODES`, `HALT_CODES`, bound to §11's text by a test), else `callback-error` for a callback's failure or
      misuse, `unexpected-cursor` for the loop's cursor check, `listen-failed` for a listener that cannot listen
      (Q115), `database-error` otherwise — and `retryOf`. `src/runner/loop.ts`: the cursor check throws
      `UnexpectedCursor`; `afterWriteItems` (none, a map per callback; a negative control's seam).
      RN-9's at-least-once and RN-11's re-delivery were built by 5.3; A44 and A46 add their crash tests. `design.md` §2
      gains "Failures"; the module guide gains "When a callback fails". Question Q115 raised (refusal codes for a
      failing `on-start-db` or `on-start-api` and for a listener; shipped A, not blocking 5.5 or 8.1); issues
      `docs/issues/00020-reserved-word-module-ids.md` and `00021-pglite-queue-test-leaves-lock-files.md` recorded
      (OPEN). Tests, seen failing first (`tsc` exit 2, 14 errors: `src/runner/failures.js` missing, `UnexpectedCursor`
      not exported, `reason` and the two states unknown, `afterWriteItems` not in the loop; the suites that loaded
      failed 40 of 44 tests — every state, reason and retry assertion, A43's table ("Cannot read properties of undefined
      (reading 'code')": no reason) and its controls, and the A46 control needing the seam; A44, A46 and two of their
      controls passed against 5.3's code, which built what they check): `test/runner/halts.test.ts` (A43's table in one
      test over both backends — `on-fetch`, `on-parse`, `on-start-height`, `on-compute`, the first `on-db-write`
      callback (`core-block-commit`, after the cursor row) and the last (after every module's row), `on-after-db-write`
      and `on-stop-height` — and the halts' codes through the process: `truncate-not-allowed`, `database-error`,
      `callback-error` for a kept handle, `unexpected-cursor`, a source's failure, `node-requirement`, a halt while
      stopping), `refusals.test.ts` (AE-3's changed migration checksum, `on-start-db`, `on-start-api`, `EADDRINUSE`, a
      refusal without a database, a value thrown that is no `Error`), `retries.test.ts` (an unreachable node, a lost
      connection at the cursor read, a stop during the back-off, the condition clearing; PostgreSQL: the writer
      terminated during `on-db-write` and during `on-start-db`, and `writer-lock-lost`), `failures.test.ts`
      (`reasonOf`, `retryOf`, §11's lists, `statusOf`), `crash.test.ts` with `crash.worker.ts` and `crash-module.ts`
      (A44 and A46 with a real process and SIGKILL, on both backends, the worker with 5.3's orphan guard);
      `process.test.ts` and `stop-heights.test.ts` updated (a failing `on-start-db` names its point and module; the
      halt's log line carries its code). Committed negative controls: a loop that commits h despite a failure in the
      last `on-db-write`, and a process whose state stays `syncing` after a halt, fail A43; a restart that skips the
      re-delivered `on-start-height` fails A44; a re-delivered `on-after-db-write` carrying block items, and one after a
      callback of h + 1, fail A46. Wrong variants (a scratch runner outside the clone): 69, 68 caught (2 by `tsc`, none
      hitting the run's limit), the survivor equivalent (a `HeightFailure`'s point and module preferred over its
      cause's, which the loop always gives the same). Every file of `src/runner/` 100 % statements, branches, functions
      and lines.
      **Pending:** IN-10's refinement — the items published before `on-compute` kept and h redone from `on-compute`
      (A85), the node client's own retries reported as `node-retrying` — and IN-11's cursor check after an uncertain
      `COMMIT` (A86), §11's registry (A87) with Q115's codes (10.4); the `slow-block` condition (5.5); the admin
      endpoints over `status()` (8.1–8.3); `umbradb run` staying up on a refusal (4.4); the required ids in the manifest
      (18.4).
- [ ] 5.2b The owner's answers Q104 A and Q105: the module API never changes a module's answer — no envelope headers or
      GraphQL `extensions` added, no GraphQL response told apart, a subscription's notification exactly the value the
      module emitted; the envelope's headers and extensions stay as helpers a module calls itself; an uncaught
      `no-committed-height` still answers 503.
      **Acceptance:** A75 (as amended).
- [ ] 5.5 The slow-block watchdog (Q71): the condition `slow-block` with height, point and module, cleared at the
      commit; never a cancel or a retry.
      **Acceptance:** A142.

## 6. Storage helpers

- [x] 6.1 Cursor table (refactored from `src/postgres/watermarks.ts`); P9 retargeted.
      **Acceptance:** A59.
      **Done (2026-10-26):** `src/helpers/cursor-table.ts` (design §1, §10, §12; SH-1; Q27, Q30): `cursorTable({ schema,
      table })`, a library function — no module, no point, no connection or transaction of its own; the file imports
      types only, which a test checks — giving a frozen value with the table's `schema` and `table`, `migration(id)` for
      the module's own `migrations` (`CREATE TABLE "<schema>"."<table>" (key text PRIMARY KEY, value jsonb NOT NULL)
      WITH (fillfactor = 90)`, a fixed text whose bytes and SHA-256 a test pins, since it is in each module's migration
      checksum, DB-9), `write(w, key, value)` through the block write handle of `on-db-write` (one upsert: inside the
      block's transaction, under the module's role; the last write wins) and `read(handle, key)` through any handle's
      `query` (`undefined` for a key never written, JSON `null` a value). Schema and table are lowercase identifiers of
      at most 63 bytes, quoted in the SQL, else a `TypeError`. From 0.9.5's Watermarks: last write wins, `fillfactor =
      90` and no index on `value` kept; `kind` (SH-1 has one key) and `updated_at DEFAULT now()` (wall-clock time, a
      non-immutable default) gone; values sent as JSON text by the API's parameter mapping (a `bigint` exact, so 0.9.5's
      decimal-string convention is gone; `invalid-parameter`, nothing sent, for what JSON cannot hold) and held to Q57's
      `CHECK` (a fraction or an integer beyond 64 bits fails the block, `23514`); the key a plain `text`: unique by
      bytes, read in DT-2's byte order by the component, so the table names no collation (A138, Q69: the first
      conformance run failed A138's boundary test while the table wrote `COLLATE "C"`). SH-3 is not the cursor table's
      (SH-3 names the height-versioned table; SH-1 says the last write wins): a second write of a key in one block
      replaces the first. Writing only from `on-db-write` is the module's obligation (Q46; a schema write handle has the
      same shape). 0.9.5's `PgWatermarks`, `src/interfaces/watermarks.ts`, `003_watermarks.ts` and their tests are
      unchanged, for the 0.9.5 code that still uses them (`saveAndAdvance`, the chain archive, the crash and soak tests,
      `src/index.ts`), until 17.2. P9 retargeted as a copy: `test/helpers/cursor-table.property.test.ts` (A59 on
      PostgreSQL 18.6 and PGlite 0.5.10, seed 20261026: 40 sequences of up to 10 blocks through the real block write
      handles, some rolling back; 140 overwrites, 91 rewrites within a block, 69 rolled-back writes, 935 reads checked),
      the old `test/postgres/watermarks.property.test.ts` kept on `PgWatermarks` until 17.2;
      `test/helpers/cursor-table.test.ts` (the helper; on both backends the table as made — owner, columns, collation,
      the key's index only, fill factor, the `CHECK` —, values, both refusals, SH-3 not shared, the role-and-transaction
      check, another module's write refused `42501` while its read works, a kept handle `handle-closed`, digests per
      block (DT-4), DT-2's byte order and the contents hash, SH-1's scenario through the finalized loop; with the cases
      of 0.9.5's `watermarks.test.ts` that still apply); `test/helpers/cursor-harness.ts`. Seen failing first: `tsc`
      exit 2 (the module missing, the implicit `any`s and the type tests), both suites failing to load (`Cannot find
      module '../../src/helpers/cursor-table.js'`). Committed controls: a helper keeping each key's first write fails
      A59 on both backends (at the first run, "expected { ref: null } to deeply equal false"); one writing on a
      connection of its own (PostgreSQL: as the login, in another transaction, kept after its block rolled back) or in a
      transaction of its own (PGlite: refused, `nested-call`) fails the role-and-transaction check. Wrong variants (a
      scratch runner outside the clone): 39 of 41 caught; the 2 survivors are equivalent (the read taking the last row
      of a unique key's one; the write sent through `query` instead of `execute`); the 10 table and migration variants
      are caught again with the SQL pin left out. Design §10 says what was built; the module guide has "Cursor tables";
      the `**/src/helpers/**` floor (95/90) is added. Question Q108 raised (not blocking).
      **Pending:** `cursorTable` in `src/index.ts` (17.3); `PgWatermarks`, its interface, migration and two test files,
      the `**/postgres/watermarks.ts` floor, its mutation target and the re-binding of W1/P9 in
      `Formal/STORAGE_ALGEBRA.md` and `ROADMAP.md` (17.2, with Q108 for `test/postgres/watermarks.test.ts`); the
      mutation target `src/helpers/cursor-table.ts` (17.2); the height-versioned table, A60 and A61 (6.2).
- [x] 6.2 Height-versioned table (refactored from `src/postgres/temporal-kv.ts`).
      **Acceptance:** A60, A61.
      **Done (2026-10-26):** `src/helpers/height-versioned.ts` (design §1, §10, §12; SH-2, SH-3; Q27, Q30), in the
      cursor table's shape: `heightVersionedTable({ schema, table })`, a library function — no module, no point, no
      connection or transaction of its own; the file imports types only, which a test checks — giving a frozen value
      with `schema`, `table`, `historyTable` (`<table>_history`), `migration(id)` (one fixed SQL text whose bytes and
      SHA-256 a test pins: the current table `<table> (key text PRIMARY KEY, value jsonb NOT NULL, from_height bigint
      NOT NULL) WITH (fillfactor = 90)`, the history table `<table>_history (key, from_height, to_height, value)` keyed
      by `(key, from_height)` with `CHECK (from_height < to_height)`, and the trigger `versions`, `BEFORE INSERT OR
      UPDATE OR DELETE … FOR EACH ROW`, whose PL/pgSQL function `<table>_versions()` is the module role's and fills the
      history), `write(w, b, key, value)` and `delete(w, b, key)` through the block write handle of `on-db-write` at
      `b.height` (the block is passed: the handle's own `height` is the cursor before the block, null for the first),
      and `read(handle, key, height?)` through any handle's `query` (as of a height: the version with `from_height ≤ h
      < to_height`; without one, the current value; `undefined` for none). SH-2: a write closes the key's current
      version at h and makes the value current from h; the value the key has adds no version (jsonb equality; the row
      is left untouched, so nothing is captured or digested); a delete closes it at h with no new one, in one `DELETE`
      that first sets the transaction-local `umbradb.delete_height` for the trigger. SH-3: the trigger refuses a write
      or delete of a key that already changed at h (its version starts at h, or its last closed version ends at h) with
      SQLSTATE `23505`, so the write rejects with `database-error` (`details.sqlstate`, `schema`, `table`), a callback
      error that halts the loop at that height (`HeightFailure`, the module, `on-db-write`); a module catching it cannot
      commit the block (its next statement fails with `25P02`); writes that change nothing (the value a key has, a
      delete of a key with none) are neither refused nor counted (Q110, shipped A). The trigger also refuses a height
      below the key's versions (`23P01`) and a `DELETE` or key change the helper did not make (`0A000`). Table names at
      most 54 bytes (so that `<table>_versions` and `<table>_history` fit 63), schemas 63, else a `TypeError`; the name
      rule is the cursor table's but not shared (a shared file would be a value import, which both helpers' types-only
      rule forbids). From 0.9.5's TemporalKV: the trigger-filled history, the half-open ranges (T5, now heights), one
      write per key per block (its per-transaction rule, `UB001`, now SH-3's `23505`), `fillfactor = 90` and no index on
      the current `value` kept; `ns`/`scope`, the version counter and CAS, the wall-clock times, `updated_xact`, the
      `bigserial` id, the `tstzrange` column and its `btree_gist` exclusion constraint gone. 0.9.5's `PgTemporalKV`,
      `src/interfaces/temporal-kv.ts`, migrations `001_temporal_kv.ts` and `005_kv_current_fillfactor.ts` and their
      tests are unchanged, for the 0.9.5 code that still uses them (`src/index.ts`, the benchmarks, the other 0.9.5
      interfaces' shared validators), until 17.2. Tests (PostgreSQL 18.6 and PGlite 0.5.10, through the real block write
      handles and the real `core-digest`): `test/helpers/height-versioned.property.test.ts` (A60, seed 20261026: 40
      sequences of up to 10 blocks, each changing up to 4 of 5 keys once — writes, same-value writes, deletes — some
      rolling back; after each block, every key's stored versions checked for overlaps, empty versions and gaps where
      nothing was deleted, and against the model, and the key read at every height of the sequence; 65 versions closed
      by writes, 23 by deletes, 14 same-value writes, 35 deletes of keys with none, 76 rolled-back changes, 14 gaps,
      4,540 height reads per backend); `test/helpers/height-versioned.test.ts` (the helper alone: the pinned SQL, frozen
      values, name refusals, handle types, types-only imports; on both backends: both tables, the trigger and its
      function as made, SH-2's scenario through the finalized loop (A at 10, B at 20, deleted at 30, read at heights 0
      to 40), reads through the block write handle, same-value writes (members reordered, `1` as `1n`; the row's `xmin`
      unchanged, no digest), JSON null, lossless values, Q57's refusal, `invalid-parameter`, A61 — a new key twice, two
      values, a write then a delete, a delete then a write, after several versions, caught or not, through the
      finalized loop — and its control, what SH-3 does not refuse (Q110), the misuse refusals, `42501` for another
      module, `handle-closed`, digests of both tables per block, DT-2's byte order and the contents hash, a rolled-back
      block); `test/helpers/height-versioned-harness.ts`; `test/helpers/cursor-harness.ts` generalized
      (`helperDatabase`). Seen failing first: `tsc` exit 2 (12 errors: `Cannot find module
      '../../src/helpers/height-versioned.js'` three times and the type tests that follow); both suites failed to load
      (`Cannot find module`). Committed controls: a table closing versions one height late fails A60 ("the versions
      [148, 150) and [149, …) overlap"), one closing them a height early fails it ("a gap between [152, 152) and [153,
      …), where nothing was deleted"), each at its second run on both backends; a table letting a second change through
      (SH-3's refusal left out) fails A61's check; the cursor table still lets it through (6.1's test unchanged).
      Wrong variants (a scratch runner outside the clone, the SQL pin test left out): 83 (the tables 8, the trigger 37,
      reads 13, writes and deletes 9, names and the returned value 16), 78 caught (1 by the type check alone), the 5
      survivors equivalent — the value compared as jsonb text instead of by jsonb equality (equal for every value the
      helper can send), the closed-version read without `LIMIT 1` and the read taking its last row (versions never
      overlap, so at most one row), and the write and the delete sent through `query` instead of `execute`; the first
      run left 2 more, both closed by new tests (the trigger reading a key's first closed version instead of its last; a
      same-value write rewriting the row with its own contents). Design §10 says what was built; the module guide has
      "Height-versioned tables". Question Q110 raised (not blocking).
      **Pending:** `heightVersionedTable` in `src/index.ts` (17.3); `PgTemporalKV`, its interface, its two migrations,
      its two test files, the required id `property.p3.replay-fold-equivalence`, the `**/postgres/temporal-kv.ts` floor,
      its mutation target and benchmark workload, and the restatement of T5 for heights in `Formal/STORAGE_ALGEBRA.md`
      (17.2); the mutation target `src/helpers/height-versioned.ts` (17.2); Q110's answer (SH-3 and A61's wording).

## 7. Digests

- [x] 7.1 Change capture (shadow tables and triggers) on every module table not declared `deterministic: false`, and
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
      **Done (2026-10-25):** `core-digest`, a backbone part (`src/backbone/core-digest/`): `CORE_DIGEST`, declared with
      `defineModule` (its id in `BACKBONE_ORDER`), requires `blocks` and provides `digest-tables` and
      `digest-checkpoints`; its migration creates `core_digest.tables (schema, table) → (height, digest)`,
      `core_digest.checkpoints (height, schema, table) → digest` and the schema `core_digest_shadow`; its `on-db-write`,
      last of the block, sets each changed table's row to `SHA-256(previous ‖ CBOR(h) ‖ changes at h)` (32 zero bytes
      before the first) and at each h with h mod 14,400 = 0 copies every row into the checkpoints, `0` included; no
      `on-start-db` (what startup does for the digests must follow every module's migrations, which come after
      `core-digest`'s, Q95). The interval is a build flag (`build-flags.ts`), which only a test's own build changes
      (`vi.mock`, as A11's). DT-4's changes and DT-5's digest as pure functions: `src/determinism/digest.ts`. Change
      capture in the database API (`src/db/change-capture.ts`): on every table of the plan's schemas not declared
      `deterministic: false` (a partitioned table's trigger cloned onto its partitions), a row trigger with a function
      of the table's own (`SECURITY DEFINER`, the login's) records each key's first touch in the transaction — its old
      row, or none — in `core_digest_shadow.t_<32 hex digits>`, stamped with the transaction; nothing in a migration
      (the migration mark), so a migration's writes are no block's changes and it may change the table's columns; after
      each part's migrations the capture is attached, rewritten (a fingerprint), re-enabled or dropped for the opt-out
      (the parts before `core-digest` once its migration ran); when startup ends the shadow tables are emptied of what
      `on-start-db` wrote and the unused ones dropped; `core_digest` readable by every role. DT-6 at startup
      (`src/db/module-rules.ts`, task 1.4's detection through the component's `databaseRefusals` with `plan.optedOut`
      and `refusalMessage` with the module): in each migration's own transaction before its record — a migration leaving
      a table the rules refuse rolls back unrecorded, and startup refuses with the rule's code (§11's five), module,
      table or sequence, column, type and migration — and after each part's migrations at every startup, over the schema
      the part writes and its own. The `jsonb` and `numeric` `CHECK`s (the component's `checks.ts`:
      `core_chain.jsonb_numbers_ok` and `numeric_ok` with their array forms, created in the bootstrap; one
      `umbradb_integers_<column>` `CHECK` per such column, dropped on opt-out). The contents hash records opted-out
      tables as `[schema, table, null, null]` (`contentsHash(read, { optedOut })`). `design.md` §4 and §14, the module
      guide's "Stored values and digests". Question Q101 (the contents hash reads the scratch schema
      `core_digest_shadow`; shipped A, DT-3 as written; not blocking). Issue `docs/issues/00013` (a nondeterministic
      collation compares differently on PGlite). Tests, seen failing first on the base sources (the new modules missing; startup
      not refusing — 29 tests per backend got `started`; the component's `checks.ts` and `compareUtf8` absent):
      `test/determinism/digest.test.ts` (hand-written CBOR and SHA-256), `test/deterministic-postgresql/checks.test.ts`
      (A58's writes, both backends, with each rule's negative control), `startup-check.test.ts` (A58's startup half,
      A145's), `opt-out.test.ts` (A147's core part; its 3.1 setup now makes the refused tables by hand, since startup
      refuses them), `test/backbone/core-digest/` (`changes.property.test.ts` A56 with its negative control,
      `digests.test.ts` and `checkpoints.build-flag.test.ts` A57, `capture.test.ts` startups), `test/db/roles-login` (a
      `CREATEROLE` login); `component-table.test.ts` rows 5 and 9, `boundary.test.ts` the new names. Committed negative
      controls: A56's (the trigger disabled on one table fails the property), A57's (capture skipping the opt-out
      digests the opted-out table), each `CHECK` rule's (the functions built without it let exactly its cases through),
      the CHECKs dropped (every refused value stored), A147's (the hash without the list refuses the table). 74 wrong
      variants on the final sources (a scratch runner outside the clone): 71 caught, 3 equivalent (a byte comparison
      without its length test, CBOR rows being prefix-free; `lax` for `strict` in the `jsonpath`; DT-6's check after the
      record, in the same transaction); a first run's 4 other survivors were gaps, closed by tests.
      **Pending:** A147's private-process part (14.1) and backup part (15.2); A56/A57 through the real runner (5.2) and
      `core-block-commit` (10.2, `blocks`); "startup refuses" through the runner's refusal state (5.x); the ingest cost
      of the triggers (A136, 18.3).
- [x] 7.1a The owner's answer Q101 B: the contents hash leaves out `core_digest_shadow` (DT-3) — in every place that
      lists the hashed schemas (`MODULE_TABLE_FILTER` in `src/deterministic-postgresql/catalog.ts`,
      `src/determinism/module-tables.ts`), each other user of those lists checked to keep its own scope.
      **Acceptance:** A150.
      **Done (2026-10-25):** one list of the hashed schemas, `MODULE_SCHEMA_FILTER` in the component's `catalog.ts`
      (every schema but `pg_*`, `information_schema`, `public` and `core_digest_shadow`), which both catalog reads take:
      `MODULE_TABLE_FILTER` (the tables and their columns) and the relations' statement, which held its own copy of the
      list before. Per user: the contents hash (`moduleTables`, every module schema) leaves the scratch schema out —
      its tables, rows, and what the rules would refuse there; DT-6 at startup and the `CHECK`s (`module-rules.ts`,
      the part's schemas) are unaffected, since DB-8 keeps reserved names out of a plan, and the filter now leaves the
      scratch schema out even when it is asked for; the `TRUNCATE` guard and change capture keep their own lists
      (`TRUNCATE_GUARD_TABLES_SQL`, the plan's schemas; the shadow schema by name) and their scope; DB-8's
      `RESERVED_SCHEMAS` keeps the name. No split was needed. `core_chain` and `core_digest` stay hashed (Q101 rejected
      C). The comments of `module-tables.ts` and `change-capture.ts` (which said the hash reads the shadow tables)
      corrected. Tests: `test/determinism/shadow-schema.test.ts` (A150, 21 per backend): a database built by hand,
      hashed against CBOR written out by hand — `core_chain`, `core_digest`, an operator's `core_digest_shadow_x` and a
      module schema in, the scratch schema out with a row, a table without a key, a `timestamp` defaulting to `now()`,
      an unlogged table and a sequence; a column, a shadow table, a row, a refused table, a sequence and an unlogged
      table added there leave the hash unchanged, the same in `m`, `core_digest`, `core_chain`,
      `core_digest_shadow_x` and `pgx` change it, and the refused table in `m` refuses the hash; the catalog reads
      given schemas skip the scratch schema; two chains through the real capture, one with a column more in every
      shadow table and an orphan shadow table holding a row, hash and digest equal, and the same change in `m` changes
      the hash. Seen failing first on the old filter, all 40 (`no-primary-key: table
      "core_digest_shadow"."t_nokey"`; the catalog reads listing 5 tables for `m`'s 1; the chains' hashes `97b6…`
      against `6676…`). Committed negative controls: the scratch schema back in the list (a handle rewriting the 3
      catalog statements of a hash) refuses the hand-built database and splits the two chains; `core_digest` left out
      too (option C) gives another hash and misses a changed digest. 20 wrong variants of the changed lines (a scratch
      runner outside the clone): all 20 caught on the final sources; the first run's one survivor (`'pg'` for `'pg_'`)
      was a gap, closed by the `pgx` case. A55 and every neighbouring suite pass.

## 8. Admin endpoints

- [x] 8.1 The admin server in its own worker thread reading the runner's published state, mounting only backbone parts'
      endpoints (Q70), 404 for anything else; the main-thread heartbeat; states and conditions; the shared redaction and
      sanitized-error helpers. No endpoint tests exist in 0.9.5 to migrate; each part's tests live in its folder.
      **Acceptance:** A62 (its 404 and response-time halves), A64.
      **Done (2026-10-26):** `src/admin/` (new): the admin listener in a worker thread of its own (`server.ts` starts
      `worker.ts`, which runs `serve.ts`: `node:http` on `listen.admin`, parsed by the module API's `parseAddress`, the
      one thing the two listeners share), answering the admin route table (`routes.ts`) from the snapshot the runner
      publishes, never the database. The snapshot (`snapshot.ts`, `types.ts`): `status()` — 5.3's and 5.4's states,
      readiness, conditions and reason, the one source, not redefined — encoded on the main thread for JSON (heights as
      decimal text, the conditions as raised, the reason a sanitized error, never `ended`), with the process revision's
      `livenessTimeoutMs` and its redacted `core` settings; it crosses whole as one message, and the worker answers each
      request from the one it holds (no torn read). The heartbeat (`src/runner/heartbeat.ts`, AE-2): the main thread
      ticks every second into one 64-bit slot of a `SharedArrayBuffer` (`process.hrtime.bigint()`, one `Atomics.store`),
      which the worker reads at each request (one `Atomics.load`). The route table mounts only backbone parts' endpoints
      (Q70; any other part is refused): `core-health` (`/health/live` 200 while the last tick is within the liveness
      timeout, else 503; `/health/ready` from the published readiness), `core-status` (`/status`, the published status),
      `core-config` (`/config`, the process's `core` revision redacted), each in `src/backbone/<part>/`, minimal
      functions of the snapshot that 8.2–8.4 complete; `GET` of their paths only (the query aside), anything else 404
      `not-found`; a throwing endpoint 500 with a fixed message. The shared helpers: `redaction.ts` (`shownSettings`
      over 4.2's `configRedactor`, a `versionEntry` redacted until recorded; `earlyRedactor` over 4.4's
      `configSecrets`), `errors.ts` (`sanitizedError`: the reason's code, height, module and point, a message from those
      alone, and the allowlisted details of its own `UmbraError` — `reason`, `migration`, invalid-configuration's
      `findings` — each checked and redacted, AE-6). The runner's side (`process-admin.ts`, `ProcessAdmin`) and
      `src/runner/process.ts`'s wiring: `startProcess({ admin: true })` (Q128) runs the heartbeat from `startProcess`
      on, publishing at each tick when the snapshot changed and at once when startup ends, processing ends and the stop
      begins; the listener starts on `listen.admin` once the process's `core` revision is chosen, before the database
      opens (a listener that cannot listen refuses with `listen-failed`, Q115's code), or at a refusal before that on
      the configuration's `listen.admin` as loaded, else `0.0.0.0:8081` (Q127); at `stop()`, after the database, the
      heartbeat and the thread end. Questions Q127 (where a refusal before the validation listens; shipped A) and Q128
      (whether `startProcess` serves them unless told not to; shipped A, opt-in) raised, neither blocking. Tests, seen
      failing first (`tsc` exit 2, 47 lines: `src/admin/*.js` and `src/runner/heartbeat.js` missing, `admin` not in
      `ProcessInput`, the implicit `any`s that follow; all 7 suites failed to load): `test/admin/admin-server.test.ts`
      (A62 on both backends: the four endpoints and 23 other methods and paths, a module's own route among them, which
      answers on `listen.api` only; a 10 s synchronous loop on the main thread and a 5 s held block transaction —
      PGlite's one queue, checked held by a read that waits; PostgreSQL's writer `idle in transaction` — each endpoint
      timed by `prober.mjs`, a worker thread of the test's own, from the request on the shared monotonic clock, at least
      4 requests of each inside the hold, each answered within 1 s), `states.test.ts` (A64 on both: `starting` — also
      with `waiting-for-node` (task 10.2) while S is above the head —, `refused` — AE-3's changed migration checksum,
      up, live 200, ready 503 —, `syncing`, `following`, `stopped` at the core's stop and at an upgrade boundary with
      `upgrade-required`, `halted` with its reason and no message, `stopping`, then the listener closed; `node-retrying`
      and `database-retrying`), `lifecycle.test.ts` (`admin: true`, the listen failure before the database opens, the
      early refusal's address, findings and redaction, publication at once, a stop while the listener starts,
      `ProcessAdmin`, and real child processes — running, refused, and with its admin port taken, started through task
      0.5's `spawnChild` — that stay up until SIGTERM and then exit by themselves), `serve.test.ts`, `routes.test.ts`,
      `snapshot.test.ts`, `test/runner/heartbeat.test.ts`: 91 tests, 2 of them for one backend only; on task 10.2's real
      `core-chain`, the network `custom` with its own ledger table and the in-memory chain's genesis, the process's
      database read through a user module keeping the `db` item. Committed negative controls: an admin server on the
      main thread fails A62's loop case; one whose `/status` reads the database fails A62's held-queue case (PGlite); a
      route table that serves a module's path fails A62's 404 case; a refused start that stops the process fails A64's
      live-200 check. Wrong variants (a scratch runner outside the clone): 128 on the first run, 120 caught (5 by
      `tsc`); of the 8 survivors 4 were equivalent — 2 of them guarding redundant code, removed (a `HEAD` body Node.js
      never sends, a snapshot not posted to a closing worker) — and 4 gaps, closed by tests (the configuration's
      redaction after `serve`, the early one after `loaded`, an admin closed before it listened, the listener closed
      after the database). On the final sources 126, 124 caught; the 2 survivors equivalent (a plain store of the tick
      for `Atomics.store`, untearable on a 64-bit platform; the listener told before the tick is written, which no
      reader sees). Every new file 100 % statements, branches, functions and lines (`src/admin/worker.ts`, the thread's
      entry, out of coverage like `src/cli/main.ts`; `**/src/admin/**` floor 90/85).
      **Pending:** the endpoints' full bodies, their declarations and A63, A65, A140 (8.2), A66's `/status`, A67, A140
      (8.3), A66's `/config`, A29, A140 (8.4); the conditions `slow-block` (5.5), `finality-stall` (10.3),
      `waiting-for-lockstep` (14.3); the private process's lag (14.x); `umbradb run` passing `admin: true` (Q128; the
      task that wires `run` to `startProcess`); the browser's message channel (16.1).
- [ ] 8.2 `core-health` (`src/backbone/core-health/`): `/health/live` and `/health/ready` with readiness precedence.
      **Acceptance:** A63, A65; A140 for these endpoints.
- [ ] 8.3 `core-status` (`src/backbone/core-status/`): `/status` and its JSON schema, times as RFC 3339 text (Q68).
      **Acceptance:** A66 (`/status`), A67; A140 for this endpoint.
- [ ] 8.4 `core-config` (`src/backbone/core-config/`): `/config` and its JSON schema.
      **Acceptance:** A66 (`/config`), A29; A140 for this endpoint.

## 9. Test tape

- [x] 9.1 Tape reader and writer (including `delayMs`); the tape node.
      **Acceptance:** A68, A69, A70.
      **Done (2026-10-25):** the test tape in `tools/tape/` (design §1: unexported, outside `tsconfig.build.json` and
      the package; tests import `tools/tape/index.js`; `tsconfig.json` and the coverage take `tools/**`, held to §13's
      default as `**/tools/tape/**` 90/85, design §13). **Format and reader/writer** (`records.ts`, `tape.ts`): TT-1's
      five kinds as plain values, each field checked (an unknown or missing field, `result` and `error` both or
      neither, `delayMs` outside 0 to 2^31 − 1, an id that is not a string or a safe integer, a `fault` other than
      `timeout`/`error`, a `code` that is not an integer; a field set to `undefined` is left out), and TT-3's rules
      across lines (a subscription id unique in its session, each notification after its `subscribe` in the same
      session); one form per record — fields in TT-1's order, JSON without spaces as `JSON.stringify` writes it, big
      integers as digits (read without loss by the own JSON reader, Q78) — and a newline after each; the reader
      accepts a line only in that form (`not-canonical`, naming the line the writer would write), so every readable
      tape round-trips byte for byte and has one id (Q107, shipped A); the tape id is the SHA-256 of the bytes.
      `bad-tape-record` is the tools' `TapeError` (line, `reason`), not an `UmbraError` code (design §11 now says
      so). **The tape node** (`node.ts`, `session.ts`, `rules.ts`, `port.ts`): WebSocket JSON-RPC 2.0 on 127.0.0.1 at
      a random free port ≥ 10000; the k-th connection gets the k-th session (the records up to each `disconnect`),
      one beyond the last an empty session; in a session the k-th request of a method and params pair (params
      compared as JSON values) gets the pair's k-th call, subscription or fault record, then the last call record
      again (a subscription is not repeated); none: `not-on-tape` (JSON-RPC −32090, naming the method, with params and
      session in `data`), which the node client reads as `node-error` `rpc-error` and never retries; `delayMs` on the
      node's clock (injectable; a timer that fires early is set again, so no answer leaves early); notifications in
      file order, each once every record before it is done, as Substrate's `chain_newHead`/`chain_finalizedHead`; a
      `disconnect` drops the connection (1006) once the frames before it are written out, answering nothing
      meanwhile, and a session starting with one drops at once (an outage is a run of them); a timeout fault answers
      nothing, an error fault `{ code (−32603 without one), "tape fault: <method>" }`; a call log (session, method,
      params, occurrence, record line, outcome) with `count(method, params?)`. Tests, seen failing first (all four
      files: `Cannot find module '../../tools/tape/index.js'`): `test/tape/format.test.ts` (A68: the committed
      `fixtures/every-kind.tape.jsonl`, written by hand, against the writer both ways, its pinned SHA-256; a seeded
      property; 53 malformed lines at line 12 with their reasons, file-level refusals, 18 writer refusals),
      `node.test.ts` (A69, A70 over a bare WebSocket client: exact frames, `not-on-tape`, `delayMs` on a hand-moved
      clock and its lower bound on the real one, notifications, sessions, disconnects, faults, the call log, malformed
      frames, the port and clock), `node-client.test.ts` (A69, A70 through `src/node/`'s `NodeClient`, unchanged:
      occurrence, `not-on-tape` an unretried `node-error`, delays, headers after their calls, TT-3's reconnect with
      `restarted`, an outage's back-off, both faults; every request inside IN-8). Committed negative controls
      (`tape.negative-control.test.ts`): a writer ordering fields otherwise, a node answering by first match, one
      ignoring `delayMs`, one delaying the next record too, one delivering a notification before the calls ahead of
      it — each fails its check. 176 wrong variants on the final sources (a scratch runner outside the clone, the
      tree checked byte for byte after): 174 caught, 2 equivalent (the tape id taken from the written bytes, which
      equal the bytes read; a fired delay timer left in the set `close` clears); a first run's 4 other survivors were
      redundant code, removed.
      **Pending:** the recording builder and the variant transforms (9.2); the real tapes (0.3); A83's `[CI]` sync
      through the tape node (10.3); A84 and A85 against tapes (10.4); restarted processes against one tape node (18.1,
      18.2).
- [x] 9.2 The recording builder and the variant transforms.
      **Acceptance:** A71 (`[CI]` part); the `[MANUAL]` record-and-replay against a real node is recorded for the PR.
      **Done (2026-10-26):** in `tools/tape/` (unexported, as 9.1). **The builder** (`builder.ts`, its recorder
      `recording.ts`): `TapeBuilder.start({ node })`, a WebSocket proxy on 127.0.0.1 at a random free port ≥ 10000;
      each accepted connection opens its own to the node (`ws://` or `wss://`, never shown in an error) and is one
      session, in accept order; frames pass unchanged both ways (the client's held while the node's connection opens;
      pings answered by `ws`); `stop()` ends what is open and returns the records, checked as a tape, for
      `writeTapeFile`. It records a call with the params the client sent (absent: `[]`), an answer to a head
      subscription as `subscribe`, each notification as it came, a request still waiting when its connection ended as
      a `timeout` fault, and a `disconnect` after each session but the last (and the last too when the node ended it);
      no delays. Records follow the node's frames, except that answers of one method and params are written in request
      order (a later one waits behind an earlier one, TT-2's occurrence rule). Each answer and notification must be the
      very text the tape node writes for its record (`frames.ts`, now shared with `node.ts`: `jsonrpsee`'s field
      order, the tape's JSON form), else the recording is void: `cannot-record` (`RecordingError`: session, side,
      `reason` — `bad-request`, `duplicate-id`, `not-json-rpc`, `unknown-answer`, `unknown-subscription`,
      `notification-method`, `out-of-order`, `bad-record`, `not-replayable`), every connection closed with 1011,
      `failed` resolved, `stop()` rejected; strict on spelling (Q111, shipped A). A node that ends a connection
      (or whose handshake fails: an empty session) has the client's dropped without a close frame once the frames
      before are written out, as the tape node drops it. **The transforms** (`transforms.ts`, helpers `select.ts`),
      pure, input and output checked with `checkTape`, `bad-transform` (`TransformError`) otherwise:
      `dropNotifications` (from the `from`-th on), `skipNotifications` (`count` from the `from`-th),
      `repeatNotification` (`times` copies after the `nth`), `insertDisconnect` (`count` disconnects after a line, a
      `subscribe` record per live subscription in the next session, ids kept), `delayAnswers` (exactly the selected
      calls), `replaceWithError`, `stateUnavailable` (Substrate's 4003 "State already discarded for <block>", the block
      the call's last parameter), `spliceNotifications` (a range replaced one for one by another tape's, under the
      target's id). **A71's `[MANUAL]` check** (`replay-check.ts`): `recordAndReplay` runs a `NodeClient` session
      (default: the IN-8 tour, every IN-8 call once at the finalized head, then one new and two finalized heads)
      through the builder, replays the tape to a new client and compares every frame of every connection.
      **The command** (`command.ts`, entry `main.ts`, left out of coverage like `src/cli/main.ts`):
      `npx tsx tools/tape/main.ts record --node <ws-url> --out <file>` (until Ctrl-C) and
      `… check --node <ws-url> --out <file>`. Tests, seen failing first (6 files, 107 tests:
      `Cannot read properties of undefined (reading 'start')`, `insertDisconnect is not a function`, …):
      `test/tape/builder.test.ts` (A71 against the scripted server `scripted-node.ts`, which writes its frames with
      `JSON.stringify`: record → replay byte-identical per connection, the committed `fixtures/a71-recorded.tape.jsonl`
      written by hand and its SHA-256, frames forwarded unchanged; ordering, ends, concurrency, start and stop; 40
      tests of refusals), `frames.test.ts`, `transforms.test.ts` (each transform against its committed expected output
      in `fixtures/transforms/`, made from the recorded tape by line edits, with its SHA-256; the delay on exactly lines
      5 and 19; refusals), `record-and-replay.test.ts` (through `src/node/`'s `NodeClient`, unchanged: the IN-8 tour on
      the recorded mainnet answers, and a session with a drop, the back-off, the new subscription and the retried
      call), `command.test.ts` (in this process and as a process of its own, Ctrl-C as SIGINT). Committed negative
      controls: a builder that drops a notification, or records params other than the client's, fails the
      byte-identical replay (`builder.negative-control.test.ts`); a delay set on an unselected call fails its expected
      output, and an "insert a disconnect" that does not subscribe again fails its replay — no tape, or the client's
      new subscription `not-on-tape` (`transforms.negative-control.test.ts`). Wrong variants (a scratch runner outside
      the clone, the tree checked byte for byte after): a first full run of 191 left 26 survivors — 15 gaps, closed by
      tests; 5 redundant checks, removed; 6 equivalent —; the final run on the final sources, 189 variants: 183 caught
      (7 by the typecheck, whose type-correct forms the tests catch), 6 equivalent survivors (checks a tape already
      passes by construction: the joined sessions and each transform's output; the `return` after a refusal, whose
      sockets are already ending; a `disconnect` record's own session; a repeat placed before or after its equal).
      Coverage of `tools/tape/` 100 %.
      **`[MANUAL]`, for the owner with 0.3:** against a local devnet or Stagenet node,
      `npx tsx tools/tape/main.ts check --node <ws-url> --out a71-<network>.tape.jsonl`: exit 0 and `identical: …`;
      the PR records the network, the node's version, the command and the printed `<sha256>  <file>` line.
      **Pending:** the `[MANUAL]` run (owner, with 0.3); the real tapes (0.3, best recorded through the builder by the
      client that replays them); Q111; `docs/issues/00016-heartbeat-above-timer-limit.md`.

## 10. Node client and ingest

- [x] 10.1 The node client (refactored from `chain-archive-sync/node-rpc-client.ts`): JSON-RPC over WebSocket,
      subscriptions, reconnect, timeouts, back-off; delete `chain-archive-sync/indexer-client.ts`.
      **Acceptance:** A83 (`[STATIC]` part); the refactored node-client tests pass.
      **Done (2026-10-25):** the node client, `NodeClient` (`src/node/`): JSON-RPC 2.0 over one WebSocket (`ws`,
      behind a small transport interface, `socket.ts`, so the browser build and the tests give their own), one method
      per IN-8 call — `finalizedHead`, `blockHash(height)`, `header(hash)`, `block(hash)`, `runtimeVersion(at)`,
      `metadata(at)`, `storage(key, at)`, `storageKeys(prefix, count, startKey, at)`, `ledgerStateRoot(at)`,
      `systemProperties()` — each naming its block (never the node's best block) and reading the answer into frozen
      typed values (32-byte hashes; a header with `parentHash`, `number` as a `bigint`, `stateRoot`, `extrinsicsRoot`
      and its digest items; a block's extrinsics; a runtime version; the ledger root from its byte array); `call()`
      refuses a method outside IN-8 before sending (`NODE_METHODS`, bound to IN-8's text by a test); and
      `subscribeNewHeads`, `subscribeFinalizedHeads`, cancelled on the client's side only (IN-8 has no unsubscribe
      call) and made again after a reconnect, the subscriber told (`restarted`) before its next header. One connection
      from the first use until `close()`, connected again after IN-10's back-off (1 s doubling up to
      `backoffCeilingMs`, without limit, counted over the connections the node did not answer on); a heartbeat (30 s)
      ends a connection that answers no ping; each try of a call has a timeout (30 s by default), and a call retries a
      retryable failure with its own back-off unless `retry: false` (the best-block queue's calls). Errors are
      `UmbraError`s with three new codes: `node-unreachable`, retryable (`UmbraError.retryable` is now true for it and
      `connection-lost`): a connection failed, lost or refused with HTTP 429 or 5xx, a timeout, the node's rate limit
      (`-32999`, the open connection's form of 429); `node-requirement`, IN-9's halt: a `null` block, or Substrate's
      "State already discarded"; `node-error`: any other error answer, handshake status, malformed answer or frame, or
      a method outside IN-8. None shows the node's URL (CF-4). `chain-archive-sync/indexer-client.ts` deleted, with the
      0.9.5 sync path that needed it (`sync-service.ts`, `sync-cli.ts`, the `archive:sync` script) and the tests that
      drove it (`test/integration/chain-archive-{sync,sync-retry,preprod-cloud-crossval}`, retired by `design.md`
      §13); `node-rpc-client.ts` and its test refactored into `src/node/` and
      `test/node/refactored-node-rpc-client.test.ts` (each assertion that still applies kept; the `fetch` signal and
      "carrying the URL" no longer apply). `design.md` §3 and §14, `docs/features/full-chain-storage.md`. No question
      raised. Tests, seen failing first (the modules missing; A83's scan finding 0.9.5's indexer client and its users
      in `chain-archive-sync/`, 13 findings; `node-unreachable` not a code): `test/node/` — `client.test.ts` (a
      scripted node on a random port ≥ 10000, the client's clock moved by hand: every call against the recorded
      answers of a mainnet node, subscriptions, reconnects, the back-off to the millisecond, timeouts, which failures
      are retried and which halt, the URL kept out of every error, `close()`, abort signals, the heartbeat),
      `classification.test.ts`, `methods.test.ts`, `refactored-node-rpc-client.test.ts`,
      `no-indexer-or-wallet-sdk.test.ts` (A83 `[STATIC]`); `test/db/errors.test.ts` and
      `test/deterministic-postgresql/errors.test.ts` (the retryable codes). Committed negative controls: A83's fixtures
      (every import form of a forbidden package caught, a clean file not, a forbidden run-time dependency caught);
      IN-8's check of every request the fake nodes received, with its control naming `rpc_methods`; halting errors
      sent once with retries on; the back-off's exact delays. 113 wrong variants (a scratch runner outside the clone,
      the tree checked byte for byte after): 112 caught, 1 equivalent (`#try`'s check that the client is open, which the
      connection check already implies); a first run's 6 other survivors were gaps, closed by tests.
      **Pending:** A83's `[CI]` half, a 1,000-height sync against the tape node (9.1, 10.3); the node half of A85
      against a tape (9.x, 10.4); the halts these errors lead to (10.4); the hash of a notified header (10.3).
- [x] 10.2 `core-chain` (identity, bootstrap, startup checks) and `core-block-commit` (the `blocks` table from the
      `chain_archive` store, keeping range partitioning; block time as `block_time timestamptz`, converted exactly from
      the node's milliseconds, never through a floating-point value, Q74).
      **Acceptance:** A77, A78, A88, A90; A145's block-time part.
      **Done (2026-10-26):** `core-block-commit` completed (`src/backbone/core-block-commit/`, its migration `001`
      replaced — no database exists): `core_block_commit.blocks (height) → hash, parent_hash, spec_version,
      ledger_version, block_time`, range-partitioned by height as 0.9.5's `chain_archive` store was — 1,000,000 heights
      per partition, five from 0 and a default (`src/backbone/height-partitions.ts`, new, for every per-block table) —,
      and the unpartitioned `core_block_commit.hashes (hash) → height`; per block the block's row (the cursor, first)
      from the block context and the `block` items it now requires, `block-header` (`specVersion`, `timestampMs`) and
      `ledger-version`, refused before anything is sent when unreadable, the time converted by PostgreSQL's integer
      interval input (`'<ms> milliseconds'`), never through a float — `to_timestamp` and `bigint * interval` round far
      from 1970 —; then the hash's row, whose primary-key violation is `duplicate-block-hash`; then IN-4's parent check
      against the block stored at h − 1 (`parent-mismatch`; none for the anchor), after the duplicate, for every block
      source. `BLOCKS_TABLE` and `HASHES_TABLE`; `CURSOR_TABLE` kept as a deprecated alias for the loop (task 6.1's
      note). `core-chain` (`src/backbone/core-chain/core-chain.ts`, new): a constant declaration `CORE_CHAIN` that the
      runner binds to its process context (`bindCoreChain`) with what startup checked and opened; migrations `001` (task
      4.3's `core_chain.config`, its text unchanged, now `CONFIG_MIGRATION`) and `002` (`core_chain.identity`: genesis
      hash, S, anchor hash); its `on-start-db` records the history (CF-6), the genesis hash and S on a database without
      a cursor — at every start until block S commits, so an interrupted bootstrap is repeated (IN-2) —, and publishes
      `config`, `node-client` (a `NodeClient` from the process's `node`, closed at stop), `db` (`readOnlyDatabase`) and
      `ledger-table` (empty until tasks 12.x); its `on-db-write` records the anchor hash in block S's transaction. Its
      startup checks ask the block source (RN-14) — the node through `core-block-fetch` (task 10.3), or the in-memory
      source —: `checkChain` reads the genesis hash (block 0's) and on a database with a cursor refuses another one
      (`genesis-mismatch`), waits while the head is below the cursor (`waiting-for-node`) and refuses another hash at
      the cursor (`cursor-hash-mismatch`), all before any migration; `waitForNode` is the bootstrap's wait while S is
      above the head. `src/runner/process.ts`: `onChecked` replaced — the identity read with the cursor and the history,
      `checkChain` after the history's check (a negative controls' seam `checkChain`), `core-chain` bound after the
      contexts (again, the earlier binding closed, when task 5.4 retries startup), the bootstrap's wait after the seal
      and before `startModuleApi` (still `starting`; so a retried startup never finds the module API listening), the
      condition `waiting-for-node` (the height waited for, the head) while either wait runs, beside 5.4's
      `node-retrying` or `database-retrying` when a retry is raised; a refused startup closes the node client with the
      database, and `stop()` closes it. Rebased onto task 5.4 (`d0e989a`): the four codes in 5.4's `REFUSAL_CODES`
      (`genesis-mismatch`, `cursor-hash-mismatch`) and `HALT_CODES` (`duplicate-block-hash`, `parent-mismatch`), so a
      refused start is `refused` and a repeated hash `halted` with the code as its reason; the `onChecked` lines of
      5.4's tests removed. `buildDeclarations()` holds `core-chain`. Codes `genesis-mismatch`, `cursor-hash-mismatch`,
      `duplicate-block-hash`, `parent-mismatch` in `ERROR_CODES`. `design.md` §2, §3, §10; the module guide ("Time
      values", "Process items and APIs"). Questions Q118 (CD-3's "first" against RN-3's order once `core-chain`
      writes the anchor at `on-db-write`; shipped A), Q119 (the partitions past 5,000,000; shipped A) and Q120
      (the node's genesis hash not compared with the configured network's; shipped A) raised, none blocking. Tests, seen
      failing first (`tsc` exit 2, 45 errors: the new exports, `height-partitions.js`, the seam and the condition
      missing; Vitest 58 of 58 failed): `test/backbone/core-block-commit.test.ts` (rewritten: the declaration, migration
      `001` pinned, the partitions, the items' refusals; on both backends the tables' shape, A145's five times exact, a
      duplicate in another partition, `parent-mismatch`, the anchor, the precedence, the cursor across partitions),
      `core-chain.test.ts` (the declaration and migrations; `checkChain` and `waitForNode`; on both backends the
      identity's table, its bootstrap and repeat, the anchor in S's transaction, the four items — `db` by 2.8's runtime
      check, moved to `test/db/read-only-checks.ts` —, the node client closed), `chain-process.test.ts` (through the
      process on PostgreSQL 18.6 and PGlite 0.5.10: A77 — with a real SIGKILL while waiting and inside block S's
      transaction, `chain-bootstrap.worker.ts` —, A88 at S = 0 and 12, A78, a failing bootstrap wait, A90 from S =
      999,998 across partitions p0 and p1, A145, A144 through the real part), with `chain-build.ts` and
      `block-fetch-stand-in.ts` (the `core-block-fetch` stand-in putting the items, also in `LOOP_BACKBONE`). The
      5.2–5.3 runner tests follow the new contract without a weaker assertion (`onChecked` lines removed,
      `process-build.ts`'s `core-chain` the real one, A37 counting a partitioned table once and `core-block-commit`'s
      two rows per height). Committed negative controls: an anchor recorded in the next block's transaction fails A77; a
      startup check that skips the genesis or the cursor's hash comparison fails A78; no hash row (the repeat commits,
      the next block halts with `parent-mismatch`) and the parent check first (an earlier block delivered again named
      `parent-mismatch`) fail A90; a block time through `to_timestamp` fails A145 on 99,999,999,999,999 and
      253,402,300,799,999 ms. Wrong variants (a scratch runner outside the clone): 106 on the first run, 103 caught —
      the 3 survivors one gap (the hash row's translation keyed on the constraint alone; closed by a test) and 2
      equivalent (the parent comparison's length check, both hashes being 32 bytes by the blocks table's `CHECK`s; the
      bootstrap's wait also at a start with a cursor, whose head is then already at or above S) —; on the final sources
      104 of 106 caught, the 2 survivors equivalent.
      **Pending:** the node source answering
      `core-chain`'s checks, the real `core-block-fetch` putting the items, one node connection, IN-4's finality check
      (10.3); `node-retrying` during the startup waits and the halt registry (10.4); the ledger table (12.x); the
      exports and codes in the surface pin (17.x); Q118 to Q120 (owner).
- [ ] 10.3 `core-block-fetch`: finalized processing, the finalized prefetch, the best-block queue with branch switches,
      block 0's fetch path.
      **Acceptance:** A76, A79, A80, A81, A83, A89.
- [ ] 10.4 Error handling, retries and halts; recovery after an uncertain COMMIT; the refusal and halt registry.
      **Acceptance:** A84, A85, A86, A87.
- [ ] 10.2a The owner's answers Q117 A and Q120 B: the node's genesis hash compared with the configured network's at
      every start (built in, or `genesisHash` for `custom`); a known network whose built-in table records no genesis
      hash is refused until task 0.3 records it.
      **Acceptance:** A78 (as amended).

## 11. Chain data

- [ ] 11.1 `core-chain-events`, `core-block-parsed`, `core-tx-results`.
      **Acceptance:** A91, A92, A93.

## 12. Ledger

- [x] 12.1 The `LedgerPackage` adapters for v8 (from `chain-archive-sync/tx-replay-decoder.ts`) and v9 (the v8
      adapter's `decodeLogItem` returns null and its `apply` no logs, Q54); the adapter test suite.
      **Acceptance:** A98.
      **Done (2026-10-26):** in `src/ledger/` (internal; task 17.3 exports §12's `LedgerPackage`, `ParsedTransaction`
      and `LedgerTask` from `types.ts`). **The interface** (`types.ts`): §5.1's, with the refinements of Q114
      (shipped A, recorded in `design.md` §5.1): `apply` returns `{ state, output }`; `parseTransaction(bytes, index)`
      parses once per `Uint8Array` (a `WeakMap`), which `apply` and the new `nativeTransaction(bytes)` (for ledger
      tasks) reuse; an adapter is made for one network id; `LedgerEvent`, `LogItem`, `VmLog` and an opaque
      `StateHandle` defined. **The adapters:** `adapter.ts`, shared, refactored from 0.9.5's replay decoder (the
      self-tag, the deserialization markers — now read from the tag —, the walk over the intents by segment); `v8.ts`
      (ledger-8.1.2: `decodeLogItem` null for every input, `apply` with no logs and no contract-log events, Q54; no
      `convertFromV8`); `v9.ts` (ledger-9.1.0.0-rc.5: the VM's `decodeLogItem`, each contract log as a `VmLog` whose
      value is `serializeStateValue`'s, `convertFromV8`); `releases.ts` (`LEDGER_RELEASES`, each version's release and
      package name and version, held equal to `vendor/ledger`'s records); `load.ts` (`loadLedgerPackage(ledger,
      { networkId })`: the version's vendored Node.js entry, imported when first asked for, so a thread pays only for
      the packages it loads; a browser build calls `createV8Adapter`/`createV9Adapter` with its own entry, 16.1).
      `apply` replays as the official indexer and the node do (LG-8: well formed at the block time or — for the
      regular transactions up to the first that applies, where `firstRegularAtParentTime` — at the parent's time
      + 12 s; no proof checks and no balancing, LG-15; a malformed, uncostable or ledger-failed transaction is a
      `failure` that leaves the state as it was; the post-block update gets the summed stateless cost normalized and
      its largest dimension, zero when nothing applied); a transaction's hash is SHA-256 of its serialization, the
      ledger's own definition; every event but contract logs is a `LedgerEvent` with LG-16's fields (its kinds add
      `contract-deploy`, which §10 lacks); the packages' `successfulSegments` is true for the segments that **failed**,
      which the adapter inverts (issue 00018-wasm-successful-segments-are-failed-segments). **What crosses
      threads** (LG-7, Q49): `ParsedTransaction`, `ApplyOutput`, `NodeBatch`, keys and roots, all plain (structured
      clone round trips); states, parsed transactions, the packages and the node store stay in the thread that made
      them. **Q113** (raised; not blocking 12.1, to be answered before 12.3's A99): the published API takes the
      post-block fullness as JavaScript numbers (the node's `FixedPoint` loses its low bits), has no
      system-transaction cost and no block limits, and `ApplyInput` has no dispatch outcomes — shipped C, the
      published API, exact for blocks that apply nothing. `buildCoreVersion()`'s ledgers (4.1's note (e)) are left to
      12.2, which checks the identity they record. Tests (`test/ledger/`, no node and no network; 4 files, 72 tests):
      `adapter-suite.ts`, the one suite, its Q54 clause the parameter `logs`, run by `adapter-v8.test.ts` and
      `adapter-v9.test.ts` (the latter also `convertFromV8` from a v8 state the v8 adapter stored, in a fresh worker and
      here); `adapter-core.test.ts` (the event and log mapping, and `apply` on a package that records what it is
      handed: block context, current state, strictness, times, fullness, largest dimension); fixtures
      `adapter-fixtures.ts` (deploys proven with an empty prover and bound, proof-erased calls and zswap outputs as
      `midnight-ledger`'s own tests apply them, 0.9.5's `DistributeReserve` sample, a reference replay with the
      published API), `adapter-worker-host.ts` (bundles `fixtures/adapter-worker.ts` with esbuild, the vendored entries
      left external, and runs it in a fresh worker), `fixtures/verifier-key/` (`midnight-ledger`'s `spend.verifier`,
      Apache-2.0, its source recorded). Seen failing first: `Cannot find module '../../src/ledger/load.js'` (3 files);
      the first run after the code, 7 of 43 failing, showed two wrong expectations, both fixed in the tests: `evictKeys`
      does not refuse a live state's root (issue 00019-evict-keys-does-not-refuse-a-live-states-root; the test now
      evicts a contract state's child nodes), and the ledger's replay protection fails at the block time a
      transaction whose TTL is too far ahead even when it is well formed at the parent's time + 12 s (the replay-rule
      tests now spy on the times each transaction is checked at). Oracles: the node's block-0 roots of mainnet, preview
      and an undeployed devnet, reached and reloaded by `stateKey`; the vendor records; the reference replay's root and
      parameters. Committed negative controls (`adapter.negative-control.test.ts`): a v8 adapter whose `decodeLogItem`
      returns a value, or whose `apply` reports a log, fails Q54's clause; a `stateKey` taken from `stateRoot` fails
      Q55's reload of a blank state (below the embedding limit); the v9 package, or its release, under the v8 adapter
      fails the `rawPackages()` check. Wrong variants (a scratch runner outside the clone, the covering files only, the
      tree checked byte for byte after): a first run of 130 left 11 survivors — 10 gaps, closed by tests (the state a
      transaction context is given, segment order and segment 0 of a fallible offer, the intents' order, a maintenance
      update among an intent's actions, a UTF-8 entry point, tags that are almost a transaction's), 1 redundant check,
      removed —; the final run on the final sources, 130 variants: 130 caught, none equivalent. Coverage of
      `src/ledger/` 100 %; its floor 90/85 (§13's default) added to `vitest.config.ts`.
      **Pending:** Q113 (before 12.3's A99) and Q114; the two issues; 12.2 (the core version's ledgers and the
      package identity check); 16.1 (the browser entry, `node:crypto` and `Buffer`); 17.2 (0.9.5's decoder, still used
      by `test/integration/chain-archive-replay-decode.integration.test.ts`); 17.3 (the surface and `package.json`'s
      `files`).
- [ ] 12.2 Version selection, the built-in tables (`networks.json`, from task 0.3), pins, package identity checks,
      metadata selection at upgrades.
      **Acceptance:** A94, A95, A96, A97.
      **Partial (2026-10-26):** in `src/ledger/`. **Selection** (`version-table.ts`, LG-1, LG-2):
      `selectLedgerVersion(table, { height, hash, digest })` reads the one `MNSV` digest — the header's
      `DigestItem::Consensus(*b"MNSV", u32)`, as the node's version pallet writes and reads it, ten bytes — then checks
      every pin at the block's height, then takes the one row covering the version; it throws `bad-version-digest`
      (`missing`, `several`, `malformed`), `pin-mismatch` (what differs: the hash, the `spec_version`) and
      `unknown-runtime` (no row, or two and more in a table no validation checked), typed `UmbraError`s the loop turns
      into §11's halts (5.4). **The built-in tables** (`networks.json`, read and checked by `networks.ts` when it loads,
      every problem with its path): per known network its `genesis` (hash and runtime at genesis with their source:
      the node, the day, the file of this repository holding the answers), LG-3's `rows`, and its `boundaries` (U and F,
      each height, hash and `MNSV` version, read from the node, with the source); each boundary's F is a pin and nothing
      else is. The file holds LG-3's rows for mainnet, preprod, preview and stagenet, and the genesis hashes of mainnet
      and preview that task 0.2 read from their nodes; no runtime at genesis, no boundary and so no pin is recorded
      yet (task 0.3). **The table in effect** (LG-3; `ledgerTableOf`): a configured row maps the versions it covers, the
      built-in rows the rest (cut around it); a configured pin replaces the built-in one at its height or adds one; a
      `custom` network sets its own rows. Both `core` schemas check LG-1 and LG-2's rules on the configured table
      (`u32` versions, bounds in order, a ledger the build carries, no version in two configured rows, one pin a height,
      each pin's version covered) and give the table in effect as the parsed `ledgerTable` (`.overwrite`), so the
      history records it (CF-7); `ledgerTable` had no default until now. **Metadata** (`metadata.ts`, LG-4):
      `RuntimeMetadata.forBlock` reads the runtime version at the parent's hash (block 0: its own), halts with
      `metadata-mismatch` unless it is the block's `MNSV` version, and returns that version's metadata read once at that
      hash (concurrent first reads share one call, a failed read is not kept); `forState(hash)` is the runtime of a
      block's own state. **Package identity** (`identity.ts`, `releases.ts`, LG-5): a package's SHA-256 is its
      `SHA256SUMS` manifest's, which lists every file with its own; `buildCoreVersion()` now lists v8 and v9, each with
      its release and its package's name, version and SHA-256 (constants, held equal to the manifests by a test); the
      startup check `verifyLedgerPackages` refuses with `package-hash-mismatch` (the version, the file, `changed`,
      `missing` or `malformed`, expected and found) and refuses a `released` source with `invalid-configuration`
      (`ledger-source-unavailable`, Q116). The CI rebuild is task 0.2's `vendored-ledger.yml`, its own workflow
      outside `npm test`; no job added. `ERROR_CODES` gains the five codes. Tests (`test/ledger/`, no node and no
      network): `version-selection.test.ts` (A94's three halts on synthetic tables and headers; the real mainnet header
      of block 3,174,332, whose digest is the `spec_version` its node reported, through the node client's decoder),
      `networks.test.ts` (the committed file; A95 `[STATIC]`; A94's last clause over every built-in pin and its
      recorded header; 29 format rows), `ledger-table-config.test.ts` (the default, the layering, the rules; A95's
      synthetic `[CI]` half: "every `spec_version` → v8" selecting and parsing with v8),
      `runtime-metadata.test.ts` (A96 on a synthetic devnet upgrade tape through the tape node and the node client),
      `package-identity.test.ts` (A97: every file of both packages, and each manifest, changed by one byte refuses),
      `version-checks.ts`, and the committed negative controls `version.negative-control.test.ts` (a selector ignoring
      pins fails A94's pin clause; a cache keyed by the block's own version and state fails A96; a check skipping a
      package file fails A97). Seen failing first: `Cannot find module` for the new modules, and the core version's
      `ledgers: []`. Wrong variants: 145 on the first run, 129 caught, 16 survivors — 13 gaps closed by tests, 1
      redundant check removed (the date's pattern), 2 equivalent —; the final run on the final sources: 144 variants,
      142 caught, the 2 survivors equivalent. Coverage of the new code 100 %.
      **Pending (task 0.3):** A94's last clause (the mainnet pin at 1,774,492 and its header), A95's real `[CI]` half
      (task 0.3's devnet tape, with 10.3/11.1's extraction of transactions), A96 on the real devnet upgrade tape, the
      built-in tables' remaining data (preprod's and stagenet's genesis, every runtime at genesis, every boundary);
      A97's CI rebuild runs when the branch is pushed (Phase 3). Q116 and Q117 (not blocking).
- [x] 12.1a The owner's answer Q113 A: patches for v8 and v9 exporting the node's exact post-block update (the summed
      `SyntheticCost` normalized and clamped to the block limits in Rust) and a system transaction's cost; the packages
      rebuilt and their `SHA256SUMS` re-recorded; `ApplyInput` gains each transaction's chain outcome, and the adapters
      skip an extrinsic the chain reports failed, as the official indexer does.
      **Acceptance:** A151; A97 with the rebuilt packages.
      **Done (2026-10-26):** **The patches** `vendor/ledger/v8/patches/0004-ledger-wasm-exact-post-block-update.patch`
      and `v9/patches/0006-…` add to `ledger-wasm/src/umbradb.rs` and the declarations, following `midnight-node`
      2.1.0-rc.4 (each function cited in the code): `postBlockUpdateExact(state, tblock, fullness)` — the summed cost
      clamped to the state's block limits and normalized (`ledger/helpers/src/ledger_8/mod.rs` `clamp_and_normalize`),
      its largest dimension (`compute_overall_fullness`), then the ledger's `post_block_update` (v8) or
      `apply_post_block_update` (v9), as `Ledger::apply_post_block_update` runs them in `on_finalize`; no JavaScript
      number in between, and no refusal above the limits —, `blockFullness(params, fullness)` (those `FixedPoint`s,
      each the integer `value × 2^64`) and `systemTransactionCost(tx, params)` (`Ledger::apply_system_tx`'s
      `tx.cost`). **Rebuilt** twice in Docker (`npm run vendor:ledger -- --record`, 8 min 49 s; then
      `npm run vendor:ledger`, 5 min 38 s: both versions match, exit 0); `SHA256SUMS` re-recorded (v8 `0x9c0167…05f5`,
      v9 `0xd70c49…7cc9`, the constants in `src/ledger/releases.ts`). **`ApplyInput.outcomes?: ChainOutcome[]`**
      (`"success" | "partial" | "failure"`, CD-6's words for CD-5's events), one per transaction or refused
      (`RangeError`): a `failure` is skipped as the official indexer skips it (`failed_regular_transaction`: not given
      to the ledger, a failure of every segment, no cost, not the first regular transaction of LG-8's rule; a system
      transaction alike); absent, every transaction is replayed and the ledger decides (12.1's behaviour), exact
      wherever the chain applied them all or the ledger fails each one the chain failed — task 12.3 passes them.
      **The adapter** (`adapter.ts`): system transactions' costs join the fullness, taken with the parameters before
      each applies; costs add up saturating at 2^64 − 1 (`addCosts`, `COST_MAX`); the post-block update is
      `postBlockUpdateExact` (12.1's throw above the limits is gone: the adapter suite's expectation changed to the
      node's clamp). The reference replay (`test/ledger/adapter-fixtures.ts`) follows the same algorithm. **The node's
      values:** `test/ledger/fixtures/post-block-update/` — `oracle/main.rs` and `run.sh`, built natively in the
      vendored build image against unpatched `midnight-ledger` at each pinned commit, with the node's two helpers
      copied; `expected.json` for 12 block costs (among them 2,635 of 200,000: `FixedPoint(243035853171123343)`, the
      round trip `…328`; costs above the limits and the saturated sum; blocks of the fixtures' deploy, a deploy and a
      call, twenty deploys above the bytes-written limit, the system transaction with a deploy and a call) and two
      system transactions. **Tests** (`test/ledger/post-block-update.test.ts`, `post-block-update-checks.ts`,
      `adapter-core.test.ts`): A151 on both versions — the packages' fullness, fee prices and state roots equal the
      node's for every case; the adapter's fee prices after blocks of fixture transactions; each system transaction's
      cost; a chain-failed extrinsic skipped (the ledger not asked, the state as without it, the reference replay
      agreeing, the first-regular rule kept). Seen failing first, on 71e019f's packages and adapter: `raw.blockFullness
      is not a function`; `v8, a block of one deploy: the fee prices after the block: expected … to contain …`; `the
      ledger is asked about the applied transaction only: expected "wellFormed" to be called 1 times, but got 2`; 54 of
      82. **Committed negative controls** (`post-block-update.negative-control.test.ts`): the published round trip
      loses the `FixedPoint` fullness, fee prices and root in 5 cases and refuses 3; an adapter on the published
      update, one without system-transaction costs, and one ignoring the outcomes each fail their check; A97's byte
      change is `package-identity.test.ts`'s, on the rebuilt packages. **Wrong variants:** 30 over the new adapter
      logic, first run 28 caught, 2 survivors (the saturation bound) closed by a test with `u64::MAX` written out;
      final run 30 of 30 caught. Coverage of `src/ledger/` 100 %. No question raised.
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

- [x] 14.1 The private backbone (`core-private-source`, `core-key-registry`), binding, block intake; the determinism
      rules of DT-6 checked at a private process's startup and its contents hash (Q75).
      **Acceptance:** A112, A113, A114, A116, A146.
      **Done (2026-10-26):** a private process is task 5.3's `startProcess` with `side: "private"`: the private `core`
      schema, its own database, and the private backbone — `core-chain` (task 10.2's, unchanged: its history, its
      identity, the items `config`, `db`, `ledger-table`), then `src/backbone/private.ts`'s `core-private-source`,
      `core-key-registry` and `core-digest` (the core's part, requiring `private-cursor` where the core's requires
      `blocks`), in RN-3's order; no `core-block-fetch` or `core-block-commit`; its states, reasons and retries are
      5.4's, and 5.2a's process contexts and module API serve it unchanged (5.2a's note (g)). `core-private-source`
      (`src/backbone/core-private-source/`, new): `privateIntake()` gives one start its part and its block source, which
      share the public database. Its table `core_private_source.cursor` (one row: the private cursor — height, hash and
      `parent_hash`, Q124 — and the binding). Its `on-start-db` binds (PP-2): the public identity
      (`core_chain.identity`'s genesis hash and S, 10.2's table) recorded at the first start, and on every start a
      different genesis hash or S, or a private S below the public S, refused with `private-binding-mismatch` (new
      `ErrorCode`, in `REFUSAL_CODES`), as is a public database whose core never started (Q125) — the latter already at
      startup's chain check, which on a private process is its source's (`PrivateBlockSource.checkChain`, in place of
      `core-chain`'s checks against a node, which a private process never talks to): it reads the public identity and
      gives `core-chain` the public genesis hash, which it records with the private S; the bootstrap's wait waits for
      the public cursor to reach the private S. Its `PrivateBlockSource` runs under the finalized loop unchanged (PP-3,
      PP-5): its cursor and committed height the private cursor's, its head the public cursor (`readCursor` on the
      public database), its block at h the public block at h, its `waitForHead` reading the public cursor at every
      wake-up (`PublicWakes`: a 1 s poll until 14.2's `committed` messages and reconnections), and `fetchRead`, each
      private `on-fetch` callback's read of public data at the public cursor, at least h (Q100;
      `PointCallbacks["on-fetch"]` gains its optional `read`). Every read of public tables is in `public-database.ts`;
      the public database is read directly on PostgreSQL (`publicDatabase`, reads only), and a PGlite or missing one is
      refused until 14.2's transport (`public-database-transport`). `core-key-registry` (new): its table
      `core_key_registry.keys` and the item `admitted-keys`, empty at every `on-compute` until 14.4. The runner
      (`src/runner/`): `BlockSource` gains the optional `fetchRead`, `committedHeight`, `checkChain` and `close`; the
      loop gives on-fetch its read and checks the source's cursor before the `COMMIT`; the process opens its database
      with the source's committed height and closes the source with it. Which side runs what (3.1's note (g)): a public
      declaration with `keyKinds`, `validateKey` or `needsLockstep` is `invalid-declaration`; a configuration entry of
      the other side's module is refused (`entry-side`). DT-6 and the contents hash need nothing new on a private plan
      (7.1's machinery, Q75). `design.md` §2, §3, §6, §7, §8, §10; the module guide's "Private modules". Questions Q124
      (the cursor's parent hash; shipped A), Q125 (a public database never started; shipped A) and Q126 (a private
      module's requirement on a public `table` item; shipped A, nothing changed) raised, none blocking. Tests, seen
      failing first (`tsc` exit 2, 12 errors: the modules `core-private-source` and `private` missing, `on-fetch` with
      no fourth parameter; the five suites failed to load): `test/private/` — `separation.test.ts` (A112: every session
      of each PostgreSQL database logged by a login event trigger, by login; every PGlite engine by the process that
      opened it), `binding.test.ts` (A113, a public database never started), `intake.test.ts` (A114 with `link.ts`, the
      transport's stand-in, dropped while the core commits 50 heights; A116, the instance stopped for 100 blocks),
      `determinism.test.ts` (A146: `serial`, `now()` and `double precision` refused with the core's code and message;
      three instances' contents hashes; A147's private part) — on PostgreSQL 18.6 and PGlite 0.5.10, a core and each
      private process with its own database, on 10.2's real backbone (a custom network with its own ledger table, its
      genesis the in-memory chain's block 0), the PGlite public database read by direct calls through the core's `db`
      item; `test/backbone/core-private-source.test.ts` (the source, the poll, the binding's refusals,
      `openPublicDatabase`); rows in `test/modules/validation.test.ts` and `test/config/validate.test.ts`. Committed
      negative controls: a private process reaching its database through the core's settings fails A112; a binding check
      that compares nothing fails A113; an intake that skips a height after a reconnect fails A114; a core that waits
      for an independent instance fails A116; a private plan without DT-6's check
      (`determinism.negative-control.test.ts`) accepts the `serial` column and fails A146. Wrong variants (a scratch
      runner outside the clone), 62 over two runs on the final sources: run 1, 53, 52 caught (10 by `tsc`, one at the
      run's limit), the survivor a gap — a refused private process kept its public database's connections until it was
      stopped — closed by `binding.test.ts` counting them while it is refused; run 2, eight of run 1's `tsc`-caught
      variants written to type-check and the survivor again, 9 of 9 caught; run 3, after the rebase onto 10.2, 4 on the
      source's chain check and the identity read, 4 caught; no equivalent survivor. Every new file of `src/backbone/`
      100 %, `src/runner/` still 100 %.
      **Pending:** the process transport, `hello`/`hello-ack`/`committed`/`read` and the PGlite public database (14.2,
      which replaces `PublicWakes`' poll and `openPublicDatabase`'s refusal); lockstep and its check in the read of
      public data (14.3); test keys made pending, `on-key`, the admission cutoff and CF-11's checks, and A146 with the
      keys admitted (14.4); the configured network's genesis check (10.2a, Q117, Q120) on a private process; the
      private-backup refusal (15.1); the browser's transport (16.1); Q126's graph (a later task, by its answer).
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

- [x] 17.1 Move TransactionHistory and its tests to `legacy/transaction-history/`, excluded from build, package and run.
      **Acceptance:** A3.
      **Done (2026-10-26):** TransactionHistory moved with `git mv` to `legacy/transaction-history/`, each file at its
      repository path below the folder (design §1, §13; LS-3; Q27, F9): the source
      (`src/interfaces/transaction-history-storage.ts`, `src/postgres/transaction-history-storage.ts`) with its table's
      migration `src/postgres/migrations/004_transaction_history.ts`, which left 0.9.5's `tier1_wallet` lineage
      (`src/postgres/migrate.ts`: a schema `runMigrations` creates no longer has `transaction_history`; one that has it
      keeps it and its `_migrations` row, which the runner never reads); its tests and doubles
      (`test/postgres/transaction-history-storage{,.property}.test.ts`, `in-memory-transaction-history-storage.ts`,
      `reference-merge.ts`, `reference-merge-parity.test.ts`, `test/integration/pg-tx-history-adapter{,.test}.ts`), the
      two live preprod tests (`preprod-db-sync`, `cold-boot-recovery`) and the wallet-SDK loaders only they use
      (`test/integration/live-fixtures/`); and its benchmark workload (`bench/workloads/transaction-history.ts`,
      `tx-history-merge.ts`), which `bench/harness.ts` and `bench/types.ts` no longer run or type (the committed
      baseline keeps its two entries until 17.2). The moved files import each other as before; their 29 imports of files
      that stayed point two levels further up. Added in the folder: `README.md`; `tsconfig.json`, its own program, which
      `npm run typecheck` now runs after the repository's, so the kept code still compiles against the 0.9.5 modules it
      imports (Q112); `vitest.config.ts`, its own run, by hand (`npm run test:live` uses it);
      `test/postgres/setup.ts`, the repository's test database plus migration 004, at the path the moved tests already
      import. Exclusions: `tsconfig.build.json` and `tsconfig.json` unchanged (neither includes `legacy/`; A3's test
      checks their programs, imports followed); `package.json` `files` unchanged; `vitest.config.ts` excludes
      `legacy/**` from the run and from coverage (Vitest matches coverage globs anywhere in a loaded file's path, so
      `src/**/*.ts` would reach `legacy/…/src/`); Stryker's `mutate` and the mutation include name no TransactionHistory
      file (unchanged); the conformance gate runs `vitest run` with that configuration; `npm run build` now empties
      `dist/` first, so a moved source's old output is not packed (the smoke test's first run packed 12 such files left
      by an earlier build). Exports, a breaking change: `src/index.ts` no longer exports `PgTransactionHistoryStorage`
      or its 12 types (`TransactionHistoryStorage`, `…Reader`, `…Writer`, `…Entry`, `…Status`, `EntryContent`,
      `EntryLifecycle`, `EntryLifecycleStatus`, `PendingLifecycle`, `FinalizedLifecycle`, `RejectedLifecycle`,
      `MergeEntriesFn`); 35 of 0.9.5's 36 values remain until 17.3. The surface pins follow the new surface (LS-3), none
      weakened: `barrel-resolves` counts 35 and checks the class is absent; `excluded-not-exported` adds the class's
      absence and 12 `@ts-expect-error` type imports that `npm run typecheck` holds; `frozen-types` drops the removed
      names. 0.9.5's `test/postgres/migrate.test.ts` and `durability-probe.test.ts` pin the lineage without 004 (exact
      names; 6 rows, not 7). Tests: `test/library-surface/legacy.ts` (the inventory and the checks) and
      `legacy-excluded.test.ts` (14: A3 on the real lists — `npm pack --dry-run --json`, the programs of
      `tsconfig.build.json` and `tsconfig.json`, `vitest list --filesOnly --json`, the coverage and mutation
      configurations, the folder's exact inventory — and the negative controls); the pack smoke's oracle 1b (the tarball
      of a clean build holds nothing of `legacy/` or of TransactionHistory) and 4c (importing the class or its type from
      the installed package fails to type-check). Seen failing first, before any move: `tsc` with 12 × TS2578 (an unused
      `@ts-expect-error`); Vitest 15 of 72 tests in 5 files (`expected […] to have a length of 35 but got 36`;
      `PgTransactionHistoryStorage must NOT be exported`; A3's inventory 38 problems, the build 3, the repository's
      program 17, the run 6, the two controls that need legacy's configurations unable to load them; the two lineage
      tests 7, `expected 7 to be 6` and the name lists); the smoke `FAIL -- the packed tarball holds files of legacy/ or
      of TransactionHistory (A3, LS-3)` (12 `dist/` files); the coverage check, once it matched as Vitest does, with
      `legacy/**` left out of `coverage.exclude` (3 files). The moved tests pass from their new place (legacy's
      configuration, PostgreSQL 18.6: 6 files, 98 passed, 4 skipped — the two live tests and the parity file's two
      real-SDK comparisons, as before). Committed controls, each failing A3: a tarball listing with a `legacy/` file or
      a TransactionHistory build output (`-`, `_`, camel case, `tx`); a real `npm pack` of a package whose `files` names
      `legacy`; a run list with a `legacy/` test or a moved test's old path; the list legacy's own Vitest configuration
      runs; legacy's own TypeScript program; a program whose file imports a legacy file; coverage globs reaching
      `legacy/`; a missing or stray legacy file, and a file left at its old path. Wrong variants (a scratch runner
      outside the clone: `tsc`, then `test/library-surface/`): first run 54, 34 caught, 20 survived (the inventory never
      compared with the folder 7, `underLegacy`'s edges 4, the name pattern's `_`, camel case and case 3, a legacy file
      reported twice, coverage of the added files, the programs following imports, the package-file filter, the child
      environment, the file-system oracle replaced), closed by gap tests each seen failing on its variant; the
      child-environment stripping had no effect in a plain or a coverage run and was removed; on the final sources 63
      variants, 63 caught (one of them, a planted type error, by the type check). No required id among the moved tests
      (25 required and 1 deferred, in 10 files, none moved; the manifest unchanged). Question Q112 raised (not
      blocking); issue `docs/issues/00017-vitest-config-not-type-checked.md` recorded (OPEN).
      **Pending:** the 0.9.5 modules the kept code imports, and legacy's program and run when they go (17.2, Q112);
      the TransactionHistory workload in `legacy/transaction-history/bench/` with the baseline's two entries and
      `Performance/CEILINGS.md` SC-5 (17.2, §13); the §12 surface pin, keeping the LS-3 checks, and the pack smoke
      rewritten with oracles 1b and 4c (17.3); the breaking-change notice naming the removed exports and that
      `runMigrations` no longer creates `transaction_history`, and `README.md`'s TransactionHistory sections (17.4); the
      refactor of the kept code (FEATURES F9).
- [ ] 17.2 Remove the retired parts, the `chain_archive` store, `chain-archive-sync`, their tests, the Lean modules,
      benchmarks, manifest ids, coverage floors and mutation targets exactly as listed in `design.md` §13, and update
      the aggregators it lists; mark the retired laws in `Formal/STORAGE_ALGEBRA.md` and the roadmaps; set
      `openspec/changes/v1.1.0-quint-model-checking`'s status to Archived with the reason; remove the `archive:sync`
      script; drop `legacy/transaction-history/`'s TypeScript program from `npm run typecheck` and its Vitest
      configuration and `test:live`, keeping its files, and name in its README the last commit where it compiled and its
      tests passed (owner decision Q112).
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
