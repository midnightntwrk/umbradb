# 00061 — The threat model's `path:line` citations drift as the code moves

- **Status:** OPEN
- **Area:** docs
- **Severity:** low — the threat model's claims still hold; a reader following a citation lands on an unrelated line.
- **Effort:** small to medium — re-point the 247 citations once, then keep them pointing (a check, or citations by
  symbol instead of line).
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, while renaming `listen.transport` in `docs/THREAT_MODEL.md` (`start-umbradb` P2.3): the
  citations of that sentence no longer point at the code they name.

## Problem

`docs/THREAT_MODEL.md` cites code by `path:line` (247 citations). Its last edit before `start-umbradb` is `6147ed9`
(2026-10-28); later commits moved the code, and the check of the document (`test/library-surface/threat-model.test.ts`,
A178) only asks that each cited file exist with at least that many lines, so a stale line passes.

## Evidence

- `docs/THREAT_MODEL.md:177-178` cites `src/config/core-settings.ts:224`, `src/runner/process.ts:1165` and
  `src/runner/process.ts:1283` for the transport reader. At `d46db79` (before `start-umbradb`) `core-settings.ts:224`
  is a blank line, `transportReaderRule` is at `:236`, and `process.ts:1165` and `:1283` are a comment on `/status`
  and a test of the block-fetch source; at `9d6e5a7` the rule is at `:240`, `core-settings.ts:224` is a line of the
  `genesisHash` message, and `process.ts:1283` a comment on the module API's opening.
- `test/library-surface/threat-model.ts` — the citation check counts lines only.

## Suggested fix

Re-point every citation at the tree of the pull request that next touches the threat model, and either cite by
symbol (`src/config/core-settings.ts` `transportReaderRule`) or extend the A178 check so that a cited line must hold
a word the citation names.
