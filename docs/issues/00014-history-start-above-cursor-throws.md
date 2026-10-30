# 00014 — The history check throws a plain `Error` when a configuration's S is above the database's cursor

- **Status:** OPEN
- **Area:** logic
- **Severity:** low
- **Effort:** small — throw a clear, named error instead of a generic one, and update the test that expects the generic
  one.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-25, during task 4.4 of `openspec/changes/core-arch` (`umbradb config check --database`), while
  checking configurations against a database with a recorded history.

## Problem

S, the database's start height, is the earliest start of the configuration's `core` entries (CF-2, `validateConfig`).
An operator can raise it by editing the file — the first `core` entry's start changed from 0 to 50 on a database whose
cursor is 20, or the entry from 0 deleted while a later `core` revision remains. `checkHistory` (and
`historyFindings`, which builds the same context) then throws a plain `Error` naming its caller — "checkHistory: the
cursor 20 is below S (50): the first commit is at S, …" — before any rule runs, instead of refusing startup with a
code and the entry: the history records `(core, 0)`, which the configuration omits (`missing-entry`, CF-5), and the
heights 0 to 20 were processed under a configuration the file no longer describes.

So startup (tasks 5.x) would crash with an untyped error rather than enter its refused state with a code (design §11),
and `umbradb config check --database` can only show the message (it reports it as a finding with the code `error`, see
`test/cli/config-check-database.test.ts`, "a configuration whose S is above the cursor is a finding, not a crash").

## Evidence

- `src/config/history.ts:562-567` — the `cursor < start` test in `contextOf`, which throws `Error`; `history.ts:627-631`
  documents it as "the caller's error", which holds for a cursor that is no height but not for one below S, since S
  comes from the operator's file.
- `src/config/validate.ts` — `validateConfig`'s `start` is `Math.min` of the `core` entries' starts.
- `openspec/changes/core-arch/specs/configuration/spec.md` CF-5 (an omitted recorded entry refuses with
  `missing-entry`), CF-6.

## Suggested fix

Keep the `Error` for a cursor that is no `bigint`, and for a cursor below S let the rules run: the `listed` rule then
refuses the recorded `(core, 0)` with `missing-entry`, as CF-5 asks; any rule that needs `next` (cursor + 1 or S) must
then treat a cursor below S as a past that the configuration no longer covers. A test row in
`test/config/history.test.ts`: history `(core, 0)` at cursor 20, configuration `core` from 50 only — `missing-entry`
`(core, 0)`, not an `Error`. Decide with Q103 (removing a recorded entry above the cursor), which touches the same
rule.
