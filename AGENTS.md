# Repository agent policy

This is the workflow for every nontrivial code, specification, proof, CI, or status-document change
in this repository, for Claude and Codex agents alike. `docs/v1-implementation-guideline.md` adds
the 1.0.0-specific engineering rules and release gate on top of it; `openspec/config.yaml` holds the
drafting rules; each change's own `acceptance.md` is authoritative on what that change requires.

## Model floors

Claude agents run on the **latest Opus model or better**; Codex agents run on the **latest Sol model
or better**. Each run records the exact model id it used, in the PR or `AUTONOMOUS_RUN_LOG.md`.

## The five stages

1. **Spec.** Write the OpenSpec change: a proposal that states its non-goals, an EARS `spec.md`, and
   an `acceptance.md` whose every criterion is numbered, individually checkable, and tagged with how
   it is verified (CI test, property, crash/fault, differential, static check, doc artifact, or
   manual evidence; a change may use its own tag names, each mapping to one of these). Verify every
   external API, library, or SQL claim against the installed version or a version-pinned upstream
   source and cite `file:line`; anything unverified is marked "unconfirmed" and not built on.
   **Gate:** the cold adversarial lane reviews the spec (bounded review, below) and the owner
   approves it. No implementation code before this gate.
2. **Build.** One `tasks.md` task at a time, test first: write the test for each acceptance criterion,
   watch it fail for the intended reason, then implement until it passes. For a reported bug, the first
   test reproduces the bug and is seen failing before any fix is written. Never weaken or edit an
   acceptance test to force green. One task is one atomic change set, with no unrelated edits. No
   placeholders, stubs, or `TODO`s. Run `npm run typecheck` and `npm test`, and keep their output and a
   mapping from each acceptance criterion to the test that proves it for the PR.
3. **Automated checks.** Every required CI job is green before stage-4 review starts: conformance
   (tests, coverage floors, and the required-test skip check), mutation, the Lean trust gate, the
   supply-chain gate, the pack-install smoke test, the knowledge-graph check (`graph.yml`), and the
   organization's code scan (`scan.yaml`). A change adds the checks its own acceptance criteria need.
   Criteria that can only be verified against a release candidate are recorded as pending at merge
   and closed by the release checklist.
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
