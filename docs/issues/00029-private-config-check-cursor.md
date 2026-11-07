# 00029 — `umbradb config check --database` reads a private database's cursor from the public cursor table

- **Status:** OPEN
- **Area:** bug
- **Severity:** med
- **Effort:** medium — the database check must learn whether the configuration is public or private and read that side's
  cursor.
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

`umbradb config check <file> --database <url>` (CF-10, task 4.4) reads the database's cursor with `core-block-commit`'s
`cursorHeight` — the last row of `core_block_commit.blocks` — whatever the file's side. A private database has no such
table: its cursor is `core_private_source.cursor` (task 14.1). So for a private configuration the history checks run as
if nothing had committed: CF-5's omissions and CF-6's changes to past entries are all allowed (Q103 lets anything start
above a null cursor), and a private file that changes a recorded entry's data field passes `config check --database`
although its startup refuses it with `changes-past`.

Found while wiring `umbradb run` for private configurations (task 4.4a), which run with the private backbone; it is
outside 4.4a's change (the history step is 4.4's).

## Evidence

- `src/cli/database.ts:59` and `:64`: `openPostgres({ …, committedHeight: cursorHeight, … })` and `openPglite({ …,
  committedHeight: cursorHeight, … })`, `cursorHeight` from `src/backbone/core-block-commit/core-block-commit.ts`.
- `src/cli/database.ts` (`readDatabaseState`): the cursor read is the same function.
- `src/backbone/core-private-source/core-private-source.ts` (`privateCursorHeight`, `readPrivateCursor`): a private
  database's committed height and cursor, which the runner uses for a private process (`ProcessInput.source`'s
  `committedHeight`, `src/runner/process.ts`).
- `src/cli/config-check.ts` (`inferSide`): the check already knows the file's side.

## Suggested fix

Give `readDatabaseState` the side `configCheck` infers (or the source's cursor function): read the cursor with
`readPrivateCursor` / `privateCursorHeight` for a private file, `core-block-commit`'s for a public one, and add a test in
`test/cli/config-check-database.test.ts` with a private database that committed heights (A35's `changes-past` case on
the private side).
