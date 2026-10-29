# 00052 — `openspec/config.yaml` and code comments still point at 0.9.5's deleted documents

- **Status:** CLOSED — fixed 2026-10-29: `openspec/config.yaml`'s context and design rule describe 0.10.0 and cite
  `openspec/changes/core-arch/design.md`; the code and workflow comments cite current sources or none. Left as they are:
  `legacy/transaction-history/` (frozen) and `AUTONOMOUS_RUN_LOG.md` (append-only).
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

Task 17.4b (owner decisions Q170 C, Q171 A, Q172 A) deleted `design/`, `Formal/*.md` but `Formal/STORAGE_ALGEBRA.md`,
`Performance/`, most of `docs/research/`, `docs/superpowers/`, `docs/THREAT_MODEL.md` and the 1.0.0 guideline and
lessons log, and changed every Markdown link to them. Text that is not a Markdown link still names them, outside the
task's scope (it changes no production code, and `openspec/` and code comments are not its documents):

- `openspec/config.yaml`, the OpenSpec drafting context every new change is written against, describes 0.9.5's four
  modules and says the deleted design and formal documents "MUST be read before writing any new spec"; its `design`
  rule asks every design to cite `design/design.md` and `design/design-interfaces.md` by section.
- Code and workflow comments cite deleted documents as their source: `src/deterministic-postgresql/errors.ts:6` and
  `test/db/errors.test.ts:11` (`design/design-interfaces.md` §1.1), `test/ledger/adapter-fixtures.ts:19`
  (`design/full-chain-storage-design.md` §3.2), `vitest.config.ts:9` (`docs/v1-implementation-guideline.md`),
  `.github/workflows/bench-smoke.yml:9` (`Performance/CEILINGS.md`), the guideline in
  `.github/workflows/conformance.yml:78,84` and `.github/workflows/supply-chain.yml:201`, and
  `legacy/transaction-history/test/integration/live-fixtures/*` (`design/environment/*`).
- `AUTONOMOUS_RUN_LOG.md:3` calls itself "§5.2 of `docs/v1-implementation-guideline.md`" (the log is append-only).

## Evidence

`git grep -n -E "design/|Performance/|v1-implementation-guideline|THREAT_MODEL" -- openspec/config.yaml src test
vitest.config.ts .github legacy AUTONOMOUS_RUN_LOG.md` after task 17.4b.

## Suggested fix

Rewrite `openspec/config.yaml`'s `context` and `design` rule for 0.10.0 (the indexer, its runner and modules; cite the
change's own `design.md` and `Formal/STORAGE_ALGEBRA.md`), and replace each comment's citation with the current source
(`design.md` §11 of `openspec/changes/core-arch` for the errors, `AGENTS.md` for the rules) or drop it. Close-out
(task 19.3) or a small documentation task.
