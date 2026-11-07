# Repository agent policy

This is the workflow for every nontrivial code, specification, proof, CI, or status-document change
in this repository, for Claude and Codex agents alike, and the engineering rules every change is
checked against. `openspec/config.yaml` holds the drafting rules; each change's own `acceptance.md`
is authoritative on what that change requires.

## Model floors

Claude agents run on the **latest Opus model or better**; Codex agents run on the **latest Sol model
or better**. Each run records the exact model id it used, in the PR or `AUTONOMOUS_RUN_LOG.md`.

## The five stages

1. **Spec.** Write the OpenSpec change: a proposal that states its non-goals, an EARS `spec.md`, and
   an `acceptance.md` whose every criterion is numbered, individually checkable, and tagged with how
   it is verified (CI test, property, crash/fault, differential, static check, doc artifact, or
   manual evidence; a change may use its own tag names, each mapping to one of these).
   **Verify external claims.** Every external API, library, or SQL claim is checked against the
   installed version (the one `package-lock.json` pins) or a version-pinned upstream source and cites
   `file:line`; no PostgreSQL or PGlite behaviour is asserted without a run that shows it. Anything
   unverified is marked "unconfirmed" and not built on.
   **Gate:** the cold adversarial lane reviews the spec (bounded review, below) and the owner
   approves it. No implementation code before this gate.
2. **Build.** One `tasks.md` task per change set.
   **Acceptance criteria are the contract.** A task's criteria, taken verbatim from `acceptance.md`,
   are its definition of done; an ambiguous or untestable criterion is escalated (**Stop and
   escalate**, below), never read weaker.
   **Test first, on real databases.** Write the test for each acceptance criterion, watch it fail for
   the intended reason, then implement until it passes. For a reported bug, the first test reproduces
   the bug and is seen failing before any fix is written. Database tests run on PostgreSQL in Docker
   (started through `startContainer`, `test/containers.ts`) and on PGlite, never on mocks; a child
   process starts through `spawnChild` (`test/child-processes.ts`). Property tests (`fast-check`)
   complement example tests, never replace them, each with an explicit `numRuns`. Never weaken or edit
   an acceptance test to force green. One task is one atomic change set, with no unrelated edits.
   Independent tasks may be built at the same time, each in its own worktree and branch; each is still
   verified on its own and integrated onto the change's branch one at a time, so history stays linear.
   **No placeholders.** No `TODO`, stub body, `throw new Error("not implemented")`, elided code or
   SQL, or `any` escape hatch, in code or in a shipped document; split long output at file or function
   boundaries, never abbreviate.
   **Traceability.** Each new code unit cites the requirement or acceptance criterion it satisfies
   (`DB-4`, `A11`); citing an id the spec does not have is a fabricated requirement. A comment's text
   must explain the code on its own, using only terms from the codebase: no spec, plan, question or
   task references inside the sentence. Citations go in square brackets at the end of the paragraph
   or list item they support (`[MD-1, A20]`), so each paragraph carries its own and none are pooled
   at the end of a multi-paragraph comment. A decided question keeps its chosen option and an
   acceptance criterion its verification tag: `[Q137 B, A157 CI]`.
   Runtime strings (error messages, type-level messages) carry no citations. A comment claim the
   code no longer matches is marked `(OUTDATED)` right after it, for its owner to correct.
   Run `npm run typecheck` and `npm test`, and keep their output and a mapping from each acceptance
   criterion to the test that proves it for the PR.
3. **Automated checks.** Every required CI job is green before stage-4 review starts: conformance
   (tests, coverage floors, and the required-test skip check), mutation, the Lean trust gate, the
   supply-chain gate, the pack-install smoke test, the knowledge-graph check (`graph.yml`), and the
   organization's code scan (`scan.yaml`). A change adds the checks its own acceptance criteria need.
   Criteria that can only be verified against a release candidate are recorded as pending at merge
   and closed by the release checklist.
   **Floors only go up.** Coverage floors are per file (`vitest.config.ts`): 85 % of lines and 78 %
   of branches for a file no glob names; 90 / 85 for the directories of `src/` and for `tools/tape/`;
   95 / 90 for `src/determinism/`, `src/helpers/` and `src/deterministic-postgresql/`; and the
   floors set there for single files. The mutation gate (`stryker.conf.json`, run by
   `npm run test:mutation:ci` in the `mutation` job of `conformance.yml`) breaks below 65 % on the
   aggregate of its targets. A floor is raised, never lowered to pass, except with the owner's
   approval, recorded with the file, its old figure and its new one. Coverage is a floor, not a
   target; mutation is the check that assertions bite.
4. **Review.** The three lanes below, after the branch is integrated with current `main`, under the
   bounded-review rule.
5. **Merge.** Through a pull request that records the review (below); never commit directly to
   `main`, and never force-push or rewrite its history. At close-out, check off `tasks.md`, set the
   proposal's status line, update `ROADMAP.md`, and refresh the knowledge graph as `CLAUDE.md`
   describes, committing `graphify-out/` with the change.

## The three review lanes

All lanes are independent of the implementer and read-only. Each reports findings with `file:line`,
a severity, and an overall `PASS` or `BLOCK`; a `BLOCK` names the violated requirement or rule, or a
concrete counterexample. Instruct every Codex run not to run graphify (a known ~25-minute stall).

**Review evidence and negative controls.** A finding cites `file:line` in the reviewed tree (a
knowledge-graph node alone is not evidence); a claim about a library, PostgreSQL, PGlite, Node.js or
the Midnight ledger cites the installed source or a version-pinned one. A vacuous check is a
finding: a crash test whose kill point is never reached, a bound with no threshold, a differential
whose two sides are trivially equal. A resilience, crash or differential test without a negative
control that shows it can fail is blocking. A claimed invariant is pinned by a test in the required
gate, not by a reviewer's reasoning. The implementer writes the acceptance tests and the in-repo
oracles; the release lane checks that each oracle is computed without exercising the behaviour under
test and sees its negative control fire. A state the implementer asserts as known-good is never an
oracle.

1. **Spec compliance** (Claude): does the diff do what the change's spec and acceptance criteria
   require, no more and no less? It may receive the spec, the diff, and the CI results.
2. **Cold adversarial** (a vendor other than the implementer's; Codex when Claude built the change):
   counterexamples, unsound assumptions, security failures, and vacuous claims. It receives only the
   repository, the diff, the spec and acceptance criteria, and its instructions: never earlier
   findings, verdicts, summaries, review manifests, or PR framing.
3. **Release** (Codex): tests are real (negative controls fire, no required test skipped, in-repo
   oracles are independent of the behavior under test), required checks are green, documentation and
   changelog are updated, the result is reproducible, and, when the public surface changes, the packed
   package is checked as a consumer would see it.

## Bounded review

1. Run one full round: all three lanes, or the cold adversarial lane alone at the spec gate.
2. Fix the blocking findings, then run one targeted fix check by a reviewer other than the fixer,
   given the findings and the fix diff.
3. The owner decides every finding still open: fix it, change the spec, accept it with a written
   reason, or withdraw the change. No further automated rounds unless the owner asks for them.

Review covers the final tree. Each lane and the fix check record what they reviewed: a commit, or for
uncommitted work the base commit plus a hash of the diff, untracked files included. Every edit made
after review starts — the review fixes included — re-runs the required CI before merge. An edit made
after the fix check also gets its own targeted fix check, unless the owner reopens the full review.

Record in the pull request, following `docs/PULL_REQUEST_CHECKLIST.md`: the reviewed commit, each
lane's verdict and model id, the fix check's reviewer, model id and result, the owner's decisions,
and links to the CI runs.

## Run log

Append to `AUTONOMOUS_RUN_LOG.md` when a gate misses, a defect escapes a check that should have
caught it, rework happens, or the workflow causes friction — when it happens, not afterwards. Each
entry says what made the outcome make sense at the time, names an owner (a person, or an agent as
`role / model id / round`), and gives a specific, dated follow-up when one is needed. The log is
append-only.

## Lean

For every Lean 4 edit, use the `lean4` skill (`$lean4`) and keep its no-`sorry`,
incremental-compilation, axiom-boundary, and final-project-gate workflow.

**The Lean gate.** `lean.yml` is green: its source scan finds no `sorry`, `admit`, `axiom` or
`unsafe` under `Formal/Lean`; `lake build --wfail` and the independent declaration check pass; and
`#audit_umbradb_trust` (`Formal/Lean/UmbraDBFormalTest/Trust.lean`) admits no axiom outside
`propext`, `Quot.sound` and `Classical.choice`. No change widens `permittedProjectAxioms` or
`dependencyAxiomDeclarations` to pass a proof. The Lean code proves W1 over its model and the
half-open interval fact behind T5 (`Formal/STORAGE_ALGEBRA.md`); a law that is not proved is never
presented as proved, and an abstract theorem is never claimed as proof of how PostgreSQL behaves.

## Engineering rules

The rules every change is checked against, besides those of the stages above.

- **Deterministic tests.** No wall clock, no unseeded randomness, no network beyond the test's own
  containers and processes, no port races; every `fast-check` seed is pinned and named in its
  test's title.
- **SQL discipline.** A value reaches SQL only as a bound parameter (`$1`, …), never spliced into the
  text. An identifier spliced into SQL is a fixed name of the core, or a schema, role or function
  name quoted with `quoteIdentifier` (`src/deterministic-postgresql/column-rules.ts`). No ORM and no
  query builder.
- **Typed errors.** What UmbraDB throws is an `UmbraError` whose `code` is one of `ERROR_CODES`
  (`src/deterministic-postgresql/errors.ts`), its `retryable` following from the code; a new failure
  mode gets its own code there. Tests assert the code, never a driver's raw error.
- **Stop and escalate.** To the owner, never pushed through: an untestable or self-contradictory
  criterion, or one contradicting the change's spec or design; a green that needs a spec change, a
  change of the exported surface or of an error code's meaning; an external claim that cannot be
  verified; three failed red-to-green attempts on one test. A resolution that changes a requirement
  goes back through stage 1.
- **Test honesty.** A crash or fault test stops the process at a named program point (a test module
  that reports it holds at a point and height, `test/runner/crash-module.ts`, or the crash worker's
  `UMBRADB_CRASH_HOOK`), never on a timer, and has a negative control that fires when the fault is
  removed. What lets a test or a negative control in stays out of what a user runs: a test entry, an
  option only a test passes, or a build flag off in every build (`src/db/pglite-build-flags.ts`). A
  concurrency test forces the interleaving it claims (a lock, a hold or a handshake the test waits
  on), never a race. The required-test manifest (`test/integration/required-tests.manifest.json`,
  checked by `test/integration/check-required-tests.ts` in `npm run test:conformance`) fails the gate
  naming any required id missing, skipped or failed; the only sanctioned skip is a `deferred` entry
  for an optional feature not yet shipped.
- **Flaky tests.** A new or changed crash, soak, property or differential test runs at least five
  times before its change merges. A flaky test is quarantined only with an owner, a root-cause note
  and a fix-or-retire date (an issue in `docs/issues/`), and quarantined tests stay under 5 % of the
  suite; the required tests of the manifest, the crash tests and the differential tests are never
  quarantined. A retry until green is never evidence.
- **Supply-chain gates.** The `deps` job of `supply-chain.yml`, on every pull request and push to
  `main`: `npm ci` from the lockfile; the committed `.npmrc` keeps `ignore-scripts=true`, asserted as
  npm's effective setting; `npm audit --audit-level=high --omit=dev` blocks; `gitleaks detect` over
  the full history with `.gitleaks.toml` blocks; a `flake.lock` change without the
  `flake-lock-update` label fails. Its `image-scan` job (weekly and on demand) checks that the two
  image digests pinned in `nix/midnight-env/flake.nix` equal its expected ones and reports Trivy's
  findings on them without failing. `vendored-ledger.yml` rebuilds every vendored ledger package
  from its pinned commit and fails when a built file differs from its `SHA256SUMS`. Workflow actions
  are pinned by commit SHA, and the scanners install from version-pinned, checksum-verified releases.
- **Release artifacts.** A version bump (`package.json`'s `version`, with its `CHANGELOG.md` entry)
  SHOULD produce the package and publish it on that version's GitHub Release (tag `v<version>`), so
  a user installs it with one `npm install <release asset URL>`, with no clone and no build. The
  package is `npm pack`'s tarball from a clean `npm ci` and `npm run build` at the tagged commit,
  after the pack smoke passes on it; the release carries the tarball, its SHA-256, and a build
  attestation where the build platform provides one. No release workflow exists yet: the owner
  decides where release automation lives (owner decision, 2026-10-28) before one is written, and
  until then the owner runs these steps by hand. A release is the owner's: agents prepare the
  tarball and its checksum and never push a tag or create a release.
- **Secrets.** The commit policy is `SECURITY.md`'s: no secret of any value in git, files holding one
  generated locally with mode 0600 and ignored, the one historical finding suppressed by its exact
  fingerprints in `.gitleaksignore`. `.gitleaks.toml` keeps no global path allowlist, and git history
  is not rewritten.
- **Per-change security checks.** Each change keeps values out of SQL text and quotes the
  identifiers it splices (**SQL discipline**); gives new input from outside the process validation
  bounds; lets no secret, key or credential into the tree, a log line or an error message; logs no
  raw error message that carries a value on a path that writes values (CWE-532); and maps each
  security finding to its CWE or OWASP class with the trust assumption it depends on. A value
  spliced into SQL, a loosened input check, a more permissive TLS default, or an error message
  echoing secret bytes is blocking.
- **No AI attribution.** No `Co-Authored-By` trailer naming an AI model, or anything like it, in
  commits, pull request bodies, tag messages, `CHANGELOG.md` or release notes.
