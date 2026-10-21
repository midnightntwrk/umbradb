# UmbraDB V1.0.0 Implementation Guideline

*Status: GOVERNING for the remaining path to the `v1.0.0` tag. Issued 2026-07-23; compacted
2026-10-21 (see the revision history at the end). The workflow every change follows (five stages,
three review lanes, bounded review, model floors, run log) is in `AGENTS.md`. This document keeps only
what is specific to 1.0.0: the engineering rules, the gate-close and tag criteria, the open
obligations, and the record of the July run. Every MUST / MUST NOT is a condition an agent or
reviewer is checked against.*

*Sources not committed to this repo.* The original facet briefs, the consolidated roadmap
(`umbradb-v1-research/ROADMAP-v1.0.0-CONSOLIDATED.md`), the council rulings (council A/B/C and their
S1–S9 findings; Z1–Z6 are restated in `openspec/changes/v1.0.0-infosec-signoff/acceptance.md`), the
2026-07-23 audit files, the owner's agent-memory directives, and the owner's
`~/foreman/bugeventlog.md` were never committed. They are cited for provenance only: wherever a rule
depends on one of them, **the rule text here is the authority**, and an agent MUST NOT block on
obtaining the source.

---

## §0 — Authority and invariants

**§0.1 What this document is.** The 1.0.0-specific rules layered on `AGENTS.md`'s workflow for the
20 roadmap gate items (G1–G20) and the `v1.0.0` tag.

**§0.2 Precedence.**
1. `AGENTS.md` governs the workflow and review; `CLAUDE.md` adds the Claude-specific graph and
   review-orchestration rules; `openspec/config.yaml` governs proposal/design/tasks drafting and the
   verify-against-installed-version rule. This document may add conditions to them but MUST NOT
   weaken them.
2. Each `v1.0.0-*` change's own `spec.md` / `acceptance.md` is authoritative on what its gate items
   require. Where this document states a requirement differently, the difference is listed in §6.1
   and resolved by a spec change, never by silently picking one.
3. Owner directives (recorded in the owner's agent memory, not in this repo; this paragraph is their
   authority here): **no AI attribution** — no Co-Authored-By Claude trailer or similar in commits,
   PR bodies, tag messages, `CHANGELOG.md`, or release bodies; **persistence stays indexer-agnostic**.

**§0.3 The three hard invariants.**
- **Indexer-agnostic boundary.** `src/` MUST NEVER import or depend on the indexer/consumer
  application, and no test, harness, or reference oracle imports it either. Proven by the static
  import guards (`no-sdk-import-guard.test.ts`, `no-chain-sync-import-guard.test.ts`) and the G11/G14
  import audits. A breach is the highest-severity regression.
- **Single trusted writer.** The trust model is one trusted writer against one local Postgres.
  Multi-writer, lease-fencing, and cross-tenant concerns are documentation obligations for 1.0.0
  (G15–G16), not code blockers; raising them as 1.0 code blockers is a severity miscalibration.
- **Not distributed.** UmbraDB is a single-node storage **library**. No distributed-trust, Merkle, or
  replication code enters 1.0.0; the public surface, written contracts, and error catalog are the
  product.

---

## §1 — Workflow

`AGENTS.md` defines the workflow. Three 1.0.0 notes on applying it:

**§1.0 Phase-in (historical).** All five `v1.0.0-*` changes are merged. The coverage and mutation
infrastructure was owned and landed by `v1.0.0-recovery-testing`; since it merged, the §2.3 floors
bind every change.

**§1.1 Lane coverage.** The release lane carries the public-surface checks (§2.4) whenever a change
alters the exported surface, the error catalog, or the written contracts, and it reviews the built,
packed package rather than `src/`. The cold adversarial lane and the release lane together carry the
per-change security checks (§2.5).

**§1.2 RC-bound criteria.** Acceptance criteria that can only run against the release candidate —
`v1.0.0-recovery-testing` acceptance H1–H4 (G12) — are recorded as pending wherever a rule requires
every criterion to have passed (a change's self-check, review, or close-out), and R5 closes them
before the tag.

---

## §2 — Engineering rules

### §2.1 — Building

- **Acceptance criteria are the contract.** Extract each task's criteria verbatim and treat them as
  the definition of done; an ambiguous or untestable criterion is escalated, never reinterpreted
  weaker.
- **Verify external claims.** Every external API, library, or SQL behavior is checked against the
  installed version (`postgres@^3.4.9`, `zod@^4`, Node ≥24) or a version-pinned upstream source and
  cited `file:line`. No Postgres semantic (e.g. advisory locks with `lock_timeout`) is asserted
  without an executed reproduction.
- **Test first.** Each acceptance scenario gets its test first, observed failing for the intended
  reason. Algebra-bearing tasks map to `fast-check` properties P1–P10 (`Formal/STORAGE_ALGEBRA.md`
  §5), each with an explicit `numRuns`; properties complement example tests, never replace them.
  Database tests run on Testcontainers Postgres, never mocks. Never weaken or edit an acceptance test
  to force green; one task is one atomic change set, with no unrelated edits.
- **Traceability.** Each new code unit cites the spec requirement it satisfies; citing an id that is
  not in the spec is a fabricated requirement.
- **C1 Determinism.** No wall clock, no unseeded randomness, no network beyond test containers, no port
  races; every `fast-check` seed is pinned and reported.
- **C2 Full output.** No `TODO`, `// ...`, stub bodies, `throw new Error("not implemented")`, elided SQL,
  or `any` escape hatches; split long output at file or function boundaries, never abbreviate.
- **C3 SQL discipline.** All SQL uses `postgres.js` tagged templates with bound values; no ORM, no
  string-built SQL. The schema name is the only interpolated identifier (`sql(schema)` +
  `assertValidSchemaName`). In the frozen-surface modules — `src/postgres/**` except
  `chain-archive-rollover.ts`, `chain-archive-store.ts`, and `migrations/chain_archive/**` — the only
  `unsafe()` calls are the three `SET … statement_timeout` lines (`transaction-lease.ts:221,285,347`),
  whose safety rests on `z.number().int().positive()` schemas that MUST NOT be loosened. The
  chain-archive files' identifier-quoted DDL `unsafe()` sites (`chain-archive-rollover.ts:297–334`,
  `migrations/chain_archive/001_chain_archive_core.ts:768,773`) are out of the frozen surface. A static
  allowlist test MUST fail CI on any new `unsafe(` anywhere in `src/`. It lists each permitted call
  site by file and call expression (a per-file count alone is not enough: swapping one call for a new
  one keeps the count), and it has a negative control that does exactly that swap. Widening the
  allowlist is a blocking security finding. Off-host inputs (`walletId`, `networkId`, JSON values)
  are validated by a shared `zod` schema before any statement runs (G8).
- **C4 Typed errors.** New failure modes use the frozen error classes and catalog with the
  `retryable` field; tests assert the typed error, never a raw driver error.
- **Scope.** Non-goals stay unimplemented. MUST NOT implement a deferred capability (idempotency key,
  lease fencing, keyed chunking, encryption seam, streaming load, observability API) or change a
  frozen signature or error code to satisfy a criterion.
- **Stop and escalate to the owner** (never push through): an untestable or self-contradictory
  criterion, or one contradicting `design/design.md` / `Formal/STORAGE_ALGEBRA.md`; a green that
  needs a spec, public-signature, or frozen-error-code change; an external claim that cannot be
  verified; three failed red→green attempts on the same test; a criterion that can only be met by
  breaching §0.3. A resolution that changes a requirement goes back through the spec stage.

### §2.2 — Evidence for reviews

- **Evidence.** Every finding cites `file:line` in the reviewed tree; a finding citing only a graph
  node is inadmissible. Claims about `postgres.js`, Postgres, Node, or SDK behavior cite the installed
  source or a version-pinned URL.
- **No vacuous "verified".** A crash test whose kill window is unreachable, a "bounded" watchdog with
  no threshold, or a differential check whose sides are trivially equal is a finding; a resilience or
  differential test without a negative control that proves it can fail is blocking.
- **Executable oracles.**
  - **D1.** A claimed invariant is pinned by a running test in the required gate, not by reviewer
    reasoning (reasoning about ordering bugs is advisory).
  - **D2.** Required crash, soak, and differential tests run in `test:conformance` with
    `UMBRADB_LIVE_PREPROD` unset, proven executed by the skip-enforcement check.
  - **D3.** The differential reference is a fault-free replay through UmbraDB's own adapters;
    importing the consumer/indexer is blocking.
  - **D4.** Property tests derive from `STORAGE_ALGEBRA.md` §5 (P1–P10) and run on real Postgres.
  - **D5.** T5 asserts the watermark is never ahead of the data under `synchronous_commit=on` and
    `=off` with an unclean postmaster kill; a lost tail is acceptable, an inverted order is not.
  - **D6.** (Historical) T5 and fault-schedule G11 stayed pending until G5 merged (`e5fcdaa`).
- **Lean.**
  - **E1.** The Lean trust gate is green: zero `sorry`, no axiom outside
    `{propext, Quot.sound, Classical.choice}`.
  - **E2.** No change widens `permittedProjectAxioms` / `dependencyAxiomDeclarations` to pass a
    proof.
  - **E3.** The 1.0.0 cut-line is frozen at **{T3, T5, W1, C1}** with a written deferral of the rest;
    no aspirational law is presented as guaranteed.
  - **E4.** An abstract theorem is never claimed as proof of runtime Postgres behavior.

### §2.3 — Test evidence, coverage, and mutation

- **Test honesty.** Crash and fault tests kill at a named program point (`UMBRADB_CRASH_HOOK`:
  `before-commit`, `in-critical-section`, `after-data-commit-before-cursor`,
  `after-cursor-before-data`), never on a timer, and each has a negative control that fires when the
  fault is removed. Fault hooks live only in test entry points and never touch `src/`. Concurrency
  tests use a forced, verified interleave (advisory-lock or `pg_sleep` handshake), never a race. The
  `synchronous_commit=off` leg uses an unclean postmaster kill. Replay equivalence uses the
  current-state predicate (`kv_current` values + latest complete checkpoint payload + watermark
  values), excluding `kv_history` rows and `version` columns.
- **Skip enforcement.** `test/integration/required-tests.manifest.json` reconciled by
  `test/integration/check-required-tests.ts` against Vitest's JSON report fails the gate, naming the
  id, if any required test is missing or skipped, and is shown to work: a deliberately skipped
  required test is caught by id. The only sanctioned skip is a `deferred` optional-feature scenario.
  Live-gated (`UMBRADB_LIVE_PREPROD=1`) tests never count toward a per-change criterion; the R5
  Preprod run supplements the gate, it does not replace it. Crash and soak suites end within a named
  `SUITE_WATCHDOG_MS` and fail with a typed timeout.
- **Oracles.** The implementer writes the acceptance tests and in-repo reference oracles; the release
  lane validates them: each oracle is computed from UmbraDB's own adapters without exercising the
  behavior under test, and its negative control is seen to fire. Example: `runReference` in
  `test/postgres/differential-equivalence.test.ts` drives the same batches through the shared
  `driveFullBatch` with no faults, so it checks recovery, not the adapters themselves. A
  "known-good" state asserted by the implementer is never an oracle.
- **Coverage floor (binding).** `perFile: true`; per-file floors of at least 90% lines / 85% branches
  on the durability-critical modules and 80 / 70 repo-wide; MUST NOT be lowered. *As landed*
  (`vitest.config.ts`): eight durability globs (`checkpoint-store.ts`, `transaction-lease.ts`,
  `watermarks.ts`, `temporal-kv.ts`, `migrate.ts`, `errors.ts`, `save-and-advance.ts`,
  `durability-probe.ts`), each at ≥ 90 / 85, and a repo-wide per-file floor of 85 / 78.
- **Mutation floor (binding).** StrykerJS on at least the four durability adapters with a committed
  `break` floor no weaker than `break:60 low:60 high:80`. *As landed* (`stryker.conf.json`): five
  adapters, `break:65 low:70 high:90`, measured baseline 70.68%, run by the gating `mutation` job in
  `conformance.yml`. Coverage is a floor, not a target; mutation is the check that assertions bite.
- **Flaky policy.** New or modified crash, soak, or property tests run at least five times before
  their change merges. A flake may be quarantined only with an owner, a root-cause note, and a
  fix-or-retire date, under 5% of the suite; durability keystones (T1, T2, T3, T5, soak, differential)
  are never quarantined. Retry-until-green is never evidence.
- **Performance.** No perf number gates the tag. The only perf condition is that
  `bench/baseline.<harness-version>.json` exists and structurally reproduces; a CV-aware regression
  gate is the first post-1.0.0 obligation.
- **Deferred behavior never gates the release:** `save` idempotency, T4 lease fence, T7 disk-full, T8
  migration-lock chaos, T9 clock step, T10 serialization storm, streaming save/load, keyed chunking.

### §2.4 — Public surface, contracts, and DX (G1–G4, G20)

- **Surface freeze (G1).** The built barrel exposes exactly: `createClient` and `DEFAULT_SCHEMA`,
  `runMigrations`, their types (the `UmbraDBSql` client handle, `UmbraDBConnectionOptions`,
  `Migration`, `RunMigrationsOptions`), the five adapters, `PgWalletStateEnvelopeStore`,
  `saveAndAdvance` (with `SaveAndAdvanceDeps` / `SaveAndAdvanceCursor`), all `src/interfaces/` types,
  the `Rollback` primitive, and the `StorageError` hierarchy minus the six chain-archive classes. The
  mechanical authority is `test/api-surface/barrel-resolves.test.ts` (exactly 36 runtime value names).
  A deep import fails with `ERR_PACKAGE_PATH_NOT_EXPORTED` (strict root-only `exports`, no `./*`).
  Every frozen symbol carries TSDoc; chain-archive routing classes are `@internal` / `@experimental`.
- **SemVer and contracts (G2, G4).** `docs/STABILITY.md` states checkably that no minor or patch
  breaks the exported surface or the error-`code` set; deprecate in a minor, remove in a major.
  `CHANGELOG.md` is Keep-a-Changelog with a `1.0.0` entry. Migrations are forward-only (`migrate.ts`
  is `up()`-only); `docs/SCHEMA.md` exists and is linked. Docs MUST NOT present a deferred or unmerged
  capability as 1.0 surface.
- **Error catalog (G3).** `docs/ERROR-CATALOG.md` lists exactly the frozen non-chain-archive codes —
  24 today, the count authoritative via `test/api-surface/error-catalog-drift.test.ts`. Exactly four
  are retryable: `CONNECTION_ERROR`, `TRANSACTION_FAULT`, `LEASE_TIMEOUT`, `MIGRATION_LOCK_TIMEOUT`;
  `CLOCK_REGRESSION` is `"conditional"` (retryable for a same-millisecond collision, not for a backward
  wall-clock step). No `CHAIN_ARCHIVE_*`, `BLOB_*`, or `BLOCK_NOT_FOUND` code. Each thrown message
  names the offending input and implies the caller's next action, consistent with `retryable`; raw
  driver text never reaches the public surface.
- **Mechanical surface checks.** `publint` and `@arethetypeswrong/cli --pack` pass on the packed
  tarball as a blocking CI job; a committed public-API snapshot is diff-gated; every runnable example
  in `README.md`, `docs/CONTRACT.md`, and the quickstart compiles against the built barrel in CI.
  (None of these exists yet — §6.1.)
- **Lean cut-line legibility (G20).** The release docs name exactly {T3, T5, W1, C1} as proved, list
  the deferred workstreams, and claim no more than `lean.yml`'s trust gate covers.
- **Surface minimalism.** More exports are not better DX under a SemVer freeze. No public
  observability or tracing API, no keyed chunking or encryption, no idempotency-key migration.

### §2.5 — Security (G15–G19)

- **Threat model (G15).** The threat-model document — `docs/THREAT_MODEL.md` in
  `midnightntwrk/umbradb`, where `SECURITY.md` is the vulnerability-disclosure policy (older history
  keeps the threat model in `SECURITY.md`) — is linked from `README.md` and states, as binding deployer
  prose: one trusted writer in one trust domain on trusted Postgres, disk, backups, and operator;
  `schema` is namespacing, not a tenant boundary (use Postgres roles/RLS); both cross-wallet dedup
  channels (`save` timing and `prune`'s `reclaimedBytes` / `reclaimedChunks`) make mutually
  distrusting principals on one store unsupported; no at-rest encryption, so the deployer encrypts
  disk and backups or passes ciphertext; and the P1 fast-follows it documents but does not implement.
- **Interface caveat (G16).** All three advertised-dedup doc sites in
  `src/interfaces/checkpoint-store.ts` state the single-trust-domain requirement and cross-wallet
  observability and cross-reference the threat-model document; that change is comment-only.
- **TLS (G17).** `nix/midnight-env/README.md` states the `Require` + self-signed caveat (encryption
  only, no server identity, no MITM protection), the co-located-host condition, and the off-host
  VerifyFull + pinned-CA recommendation; `enable-db-sync-tls.sh --ca <container>` works end to end. The
  localhost default is not flipped.
- **Supply chain (G18).** `supply-chain.yml` with `npm ci`, a repo-root `.npmrc` with
  `ignore-scripts=true` asserted in CI, a blocking `npm audit --audit-level=high --omit=dev`, a
  full-history blocking `gitleaks detect` from the committed `.gitleaks.toml`, a scheduled Trivy scan
  of both pinned image digests asserted equal to the `flake.nix` pins, and `flake.lock` change control
  (a PR changing it without the `flake-lock-update` label fails).
- **Secrets (G19).** The Preview test wallet is untracked and `.gitignore`d, with a `.example`
  template and a generator script. `.gitleaks.toml` has no global path allowlist: the template is
  exempted only by a rule-scoped allowlist requiring both its exact path and the all-zero placeholder
  (`condition = "AND"`), and the historical secret only by its exact fingerprints in
  `.gitleaksignore`. History is not rewritten. (Acceptance E3 still describes a two-path allowlist —
  §6.1.)
- **Scope (Z1–Z6).** Nothing that the tag only documents is implemented: no keyed or scoped chunk
  addressing, no encryption seam, no two-role Postgres topology, no restore-integrity code, no
  checkpoint size cap, no `save()` idempotency, no TLS default flip, no history rewrite, no
  consumer/indexer import.
- **Per-change security checks.** If a frozen-surface `src/postgres/**` file changed, the injection
  trace is re-run (schema name the only interpolated identifier, double-protected; every value bound);
  new off-host inputs have validation bounds; no secret, key, or credential enters the tree or logs;
  no raw `err.message` is newly logged on a value-carrying write path (CWE-532); findings are
  CWE/OWASP-mapped with their trust-model precondition. A new `unsafe()`, a loosened timeout schema,
  a "friendlier" TLS default, or an error message echoing secret bytes is blocking.

---

## §3 — Cross-cutting rules

- **§3.1 Evidence before claims.** No "passing", "fixed", or "done" without the command output or the
  cited artifact; a green CI badge is necessary, not sufficient.
- **§3.2 No placeholders** in code or in shipped artifacts (§2.1 C2); a threat-model document with a
  `TODO` section fails sign-off.
- **§3.3 Test first** with an observed failure for the intended reason (§2.1).
- **§3.4 Lean gate.** Any change touching a cut-line law uses the `lean4` skill workflow (`AGENTS.md`);
  `lean.yml` (forbidden-token scan, `lake build --wfail`, the `#audit_umbradb_trust` elaboration in
  `Formal/Lean/UmbraDBFormalTest/Trust.lean`) is green; §2.2 E1–E4 hold.
- **§3.5 Property, differential, and crash testing** per §2.2 D1–D5 and §2.3.
- **§3.6 Coverage and mutation floors** per §2.3; floors only ratchet up.
- **§3.7 Independence.** The cold adversarial lane receives no framing (`AGENTS.md`, `CLAUDE.md`).
- **§3.8 Security** per §2.5.
- **§3.9 The three invariants** (§0.3) are blocking and non-negotiable.

---

## §4 — Gate-item close criteria and the 1.0.0 tag gate

### §4.1 — Closing one gate item (G-N)

A gate item is **CLOSED** iff all hold:
1. Each of its change's `acceptance.md` criteria maps to a run-and-passed (not skipped) test, CI job,
   doc artifact, or manual-evidence item, verified through the skip check (RC-bound criteria pending,
   §1.2).
2. The change completed `AGENTS.md` review: all three lanes ran after `main` integration, the fix
   check ran, and the owner's decision on every finding still open is recorded in the PR.
3. The rules in §2 and §3 that apply to what it touches hold.
4. Its non-goals are not implemented, and no deferred capability or surface widening landed.
5. The knowledge graph was refreshed as `CLAUDE.md` describes and `graphify-out/` committed at
   close-out.
6. The close-out records exactly what the change delivered — no aggregate over-claim.

**Gate items by change:** `durable-checkpoint-cursor` = G5–G8; `perf-baseline` = G13–G14;
`recovery-testing` = G9–G11 plus the coverage/mutation build-out, and it also defines G12, which
closes at R5; `api-surface` = G1–G4 + G20; `infosec-signoff` = G15–G19. One review closes all of a
change's gate items together; each still needs its own criteria evidenced (criterion 1).

**Critical path:** G5 → G6/G7/G8 → G13 → G14 → G9/G10/G11 → G1–G4 + G20 (one change) → G15–G19 →
RC → G12/R5 → tag. G5 changed `save()`'s signature, so it closed before the API freeze.

**Perf checklist item.** `ROADMAP.md`'s "1.0.0 acceptance checklist" perf item is ticked when the
baseline exists and structurally reproduces; no "no regression" evidence is required or produced
(council B; `v1.0.0-perf-baseline` B5).

### §4.2 — The 1.0.0 tag gate

**Entry criterion.** All five `v1.0.0-*` changes are merged with every acceptance criterion green
(RC-bound criteria excepted, §1.2); `ROADMAP.md`'s "1.0.0 acceptance checklist" is ticked except its
live round-trip item (R5); §6.1 items 1–5 are closed (item 6 is the release itself); the owner-added
condition in
`docs/releases/v1.0.0.md` holds — a full local sync of UmbraDB against Midnight (archive node → local
indexer → UmbraDB) demonstrated end to end, with evidence beside `docs/recovery/EVIDENCE.md`; and
`main` is the exact clean tree to be tagged.

- **R1 — Release Record.** `docs/releases/v1.0.0.md` lists each of G1–G20 with its status (`GREEN` or
  `DEFERRED-with-ruling`), an evidence pointer (CI run URL, test path, doc path, or review verdict),
  and the accountable owner. A gate without an evidence pointer is not green.
- **R2 — Every gating CI job green on the exact tagged SHA:** `conformance.yml` jobs `test` and
  `mutation`, `lean.yml`, `pack-smoke.yml`, `supply-chain.yml` job `deps`, `graph.yml`, `scan.yaml`,
  and any gating job added later. Each run URL is cited against the tag SHA. A job its workflow skips
  by design for that event (e.g. `supply-chain.yml`'s `image-scan`, which runs only on `schedule` and
  `workflow_dispatch`, on a push) is not required. Every workflow sets `cancel-in-progress: true`, so
  a later push can cancel a run or a job — as happened to `conformance.yml`'s `mutation` job on
  `v0.9.5`; re-run it on the same SHA with `gh run rerun` (within GitHub's 30-day window, with
  nothing else pushed to `main` meanwhile), not `workflow_dispatch`, which `deps` does not run on.
  The committed coverage and mutation floors (§2.3) are a precondition.
- **R3 — The frozen surface is installable.** The pack-install smoke test passes from the built
  tarball (root import, `runMigrations` + a `PgTemporalKV` put/get on Testcontainers, a deep import
  failing with `ERR_PACKAGE_PATH_NOT_EXPORTED`, `dist/index.d.ts` present); `package.json` has no
  `private:true` and a root-only `exports`; `publint` and `attw` pass.
- **R4 — No unfrozen surface leaks.** The barrel and error catalog carry no chain-archive symbol or
  code (api-surface A2 + the drift test); chain-archive code already on `main` stays out of the
  barrel, the `exports` map, and the catalog, is `@internal` / `@experimental`, and its self-skipping
  suites report SKIPPED, never PASS. Branches of the verifiable-snapshot and BitTorrent tracks, and any
  full-chain branch not yet in `main`, MUST NOT merge before the tag — as of 2026-10-20:
  `fix/verifiable-snapshot-v2` (13 commits ahead), `feature/verifiable-snapshot` (6),
  `feature/network-torrent` (2), `spec/full-chain-storage-acceptance-criteria` (2).
- **R5 — Live evidence against the RC.** The manual Preprod round-trip (funded wallet synced to tip →
  kill → cold start → resume from the durable cursor → identical state, via `UMBRADB_LIVE_PREPROD`)
  runs against the RC commit and its transcript goes into the Release Record. It closes G12
  (recovery-testing H1–H4) and the checklist's live round-trip item.
- **R6 — Independent review of the RC.** The three `AGENTS.md` lanes review the RC after `main`
  integration under the bounded-review rule; the implementing agent never self-attests the release
  gate. Verdicts, the fix check, and the owner's decisions go into the Release Record before the tag.
- **R7 — Clean, annotated, reproducible tag with CI provenance.** An annotated `v1.0.0` tag on a
  clean-tree `main` commit whose `package.json.version` is `1.0.0`; `dist/` reproducible from it; no
  rebased or force-pushed history. `npm publish --provenance` needs cloud CI with OIDC
  (<https://docs.npmjs.com/generating-provenance-statements/>), so `.github/workflows/publish.yml`
  MUST exist — triggered by the tag, `permissions: { id-token: write, contents: read }`, running
  `npm ci` → build → `npm publish --provenance --access public` — and `package.json.repository` MUST
  match the publishing repo. Dropping provenance requires a recorded ruling in the Release Record.
- **R8 — No placeholder, no `sorry`.** The Lean cut-line is exactly {T3, T5, W1, C1} with its deferral
  recorded; the trust gate is green and not skipped.
- **R9 — One recorded Go/No-Go.** Decision, date, owner, and conditions. A Go despite a non-green gate
  is a `Go-with-waivers` that lists, per waived gate, the gate, the existing ruling authorizing it
  (restated in a committed document; an agent never mints one), and its 1.1 tracking item; a waiver
  missing any of the three voids the Go. A No-Go needs no waivers.
- **R10 — SemVer is enforced mechanically** by the surface snapshot and the error-code drift test.
- **R11 — `CHANGELOG.md` has the `1.0.0` entry**, and the migration contract references the
  forward-only lineage and `docs/SCHEMA.md`.
- **R12 — No AI attribution** in the tag message, `CHANGELOG.md`, commit trailers, or release body.
  License Apache-2.0.

**Exit:** R1–R12 met; Release Record complete and committed; Go/No-Go recorded; annotated tag pushed
(no force); package published by `publish.yml` with provenance (or the drop recorded as a ruling); the
1.1 milestone opened with the council A deferrals (full-chain archival as the headline; keyed chunking
and an encryption seam; lease fencing; idempotent `save`; a CV-aware perf regression gate).

---

## §5 — Run log

**§5.2 Rolling capture.** `AUTONOMOUS_RUN_LOG.md` is the single, append-only run log (`AGENTS.md`).
Gate misses, defect escapes, rework, and workflow friction are written when they happen, in
second-story form (why the outcome made sense at the time), with an owner named as a person or as
`role / model id / round` and a specific, dated follow-up when one is needed, and are mirrored to the
owner's `~/foreman/bugeventlog.md` (owner directive; the in-repo log is authoritative). A skipped
required test is a gate miss, logged by id. The release-retro and
iteration-2 intake machinery this section used to define was retired on 2026-10-21;
`docs/v1-lessons-learned.md` is kept as history.

---

## §6 — The July run, and what remains

### §6.0 — What the 2026-07-23 → 07-25 run actually did

All five `v1.0.0-*` changes merged. `docs/releases/v0.9.5.md` records 18 gate items `GREEN`, G11
`GREEN-RESCOPED`, and G12 under R5; its R5 transcript section is still a placeholder, but
`docs/recovery/EVIDENCE.md` records the R5 run passing against RC `8a684fc`. 1.0.0 needs a fresh R5
run against its own RC (`docs/releases/v1.0.0.md`). The program was
re-cut to **0.9.5 ("Penumbra")** and tagged `v0.9.5` on `19e225b`; `v1.0.0` is not tagged and is
blocked on the owner-added condition (§4.2). Where the run departed from the rules then in force:

| Rule then in force | What happened | Evidence | Now |
|---|---|---|---|
| Land through a PR carrying the review record | No PR for any `v1.0.0-*` change; each merged as a local merge commit pushed to `main` (e.g. `e5fcdaa`, `2cb5d00`, `855fb22`, `4e04926`, `726f567`, `7ee8a4b`), alongside direct commits. The repository the run used, before the move to `midnightntwrk/umbradb`, had no branch protection on `main`; its last merged PRs predate the guideline. | `git log --merges 46b6011..`; GitHub PR list | Binding (`AGENTS.md` stage 5). `midnightntwrk/umbradb` `main` is protected but lists no required status checks. |
| Every blocking finding re-audited to `PASS` | Three of five changes merged after the consolidating agent "bounded" the loop: perf-baseline (a `BLOCK` closed as "satisfied in spirit"), recovery-testing, api-surface. | `AUTONOMOUS_RUN_LOG.md` entries for those changes | Replaced by `AGENTS.md` bounded review: one round, one fix check, then the owner decides. |
| Named review models | Codex was unauthenticated (`401`) at first, so grok stood in until Codex ran; a local Titus model ran an extra lane. | `AUTONOMOUS_RUN_LOG.md`, durable-checkpoint-cursor round 1 (F2) | `AGENTS.md` model floors: Claude agents on the latest Opus or better, Codex agents on the latest Sol or better, each run recording its model id. |
| Per-criterion evidence (verify-first, observed red, criterion → test → pass) | Recorded only as prose and aggregate counts; no `acceptance.md` carries per-criterion evidence; cited audit and self-verify files (`audit/G5/…`, `impl/G5-stage4-selfverify.md`) were never committed. | `AUTONOMOUS_RUN_LOG.md`; `docs/v1-lessons-learned.md`; git history | Binding: `AGENTS.md` stage 2 and the PR checklist (`docs/PULL_REQUEST_CHECKLIST.md`) require the test output and the criterion-to-test mapping in the PR. |
| Audit token cost recorded | Never recorded. | — | Dropped by owner decision (2026-10-21). |
| Graph refreshed at every close-out | Skipped at infosec-signoff; the committed graph stayed at `ebaea80`. | `git log -- graphify-out/graph.json` | Binding (`CLAUDE.md`). |
| Tag gate applied to 0.9.5 | `conformance.yml`'s `mutation` job was cancelled on the tagged commit (R2 unmet); the R6 and R9 sections of `docs/releases/v0.9.5.md` are placeholders; the publish workflow failed on the tag and was removed in `00698eb` (R7). | GitHub Actions runs on `19e225b`; `docs/releases/v0.9.5.md` | The full gate (§4.2) applies to 1.0.0. |
| Append-only run log | `2ff074d` replaced the previous 423-line journal; the old content survives in git history. | `git show 2ff074d -- AUTONOMOUS_RUN_LOG.md` | Binding (§5). |
| Retro at every release tag | None written; the iteration-2 intake in `docs/v1-lessons-learned.md` is empty. | Repo | Retired (§5). |

Work since the run — the indexer-throughput roadmap (`docs/research/indexer-parallelism-roadmap.md`),
the open PRs #4 (a SQLite replacement for Postgres) and #5, and the move to `midnightntwrk/umbradb` —
has not gone through these rules. As written, PR #4 conflicts with §0.3 (one local Postgres) and
with §4.2's five-change entry criterion.

### §6.1 — Open 1.0.0 obligations

1. **Public-surface checks (§2.4):** a blocking `publint` + `attw` job, a committed and diff-gated
   API snapshot, docs-as-tests for `README.md` / `docs/CONTRACT.md` / the quickstart, and the
   error-message quality table; reconcile api-surface acceptance A1 with the barrel test (A1 omits
   `DEFAULT_SCHEMA`).
2. **The static `unsafe(` allowlist test (§2.1 C3).**
3. **Pinned, reported `fast-check` seeds (§2.1 C1):** only P11 (`save-and-advance.property.test.ts`)
   pins one today, and `transaction-lease.property.test.ts` contains no `fast-check` property.
4. **Two spec decisions, each through a spec change:** perf-baseline acceptance A1 requires exactly
   one junction-insert statement, but the shipped code sub-batches, and
   `test/postgres/perf-batching.test.ts` expects two at 30,000 positions; infosec-signoff acceptance
   E3 requires a two-path allowlist, but the stricter mechanism in §2.5 G19 shipped.
5. **Before the release starts:** restore `.github/workflows/publish.yml`; meet the owner's local-sync
   condition.
6. **During the release:** complete `docs/releases/v1.0.0.md` — R1, the R5 run against the RC, the R6
   review of the RC, and the R9 Go/No-Go.

---

## Revision history

- **2026-07-23 — issued.** Audited independently by Fable (REVISE: 8 blocking, 7 non-blocking) and Opus
  (REVISE: 2 blocking, 4 non-blocking); every finding was applied. The full resolution table is in
  git history (`46b6011`).
- **2026-10-21 — corrected and compacted.** Facts that had gone stale were corrected against the repo
  (24 error codes with 4 retryable, the frozen-surface list, the gitleaks mechanism, the R4 branches,
  the threat-model location, the G12 and G20 sequencing, the coverage and mutation floors as landed);
  pinned model names gave way to the `AGENTS.md` model floors; the workflow (five stages, three review
  lanes, bounded review) moved to `AGENTS.md`; graph-scoped review manifests were parked
  (`CLAUDE.md`); token tracking was dropped; the retro machinery was retired; and the record of the
  July run (§6) was added. Before compaction the corrections went through three Codex review rounds
  (`gpt-6.1-sol`), whose findings are folded in. Deliberate changes of substance: the implementer now
  writes the in-repo oracles and the release lane validates them (previously QA had to construct the
  oracle independently); and the per-stage records are gone (`N/A-with-reason` stage lines, Stage-5
  required-gate sets, prompt-hygiene attestations), along with the release retro, the iteration-2
  intake, token tracking, and the mitigative/preventative tags on run-log follow-ups. References
  written before this revision — code comments, research notes,
  the run log — cite the pre-compaction section numbers; read them against the text at `3c0c68b`.

*Companion history: `docs/v1-lessons-learned.md`. Run log: `AUTONOMOUS_RUN_LOG.md`.*
