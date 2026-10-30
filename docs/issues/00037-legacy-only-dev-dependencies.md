# 00037 — Two development dependencies are used only by the frozen `legacy/transaction-history/`

- **Status:** OPEN
- **Area:** deps
- **Severity:** low
- **Effort:** medium — removing the two packages changes the lockfile, and one test relies on their lockfile entry.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-27, during task 17.2 of `openspec/changes/core-arch` (the retirement of the 0.9.5 parts).

## Problem

`package.json` keeps `effect` (3.22.0) and `@midnightntwrk/wallet-sdk-abstractions` (3.0.0-canary) as development
dependencies, and `package-lock.json` installs them and what they pull in, but since task 17.2 nothing that is built,
type-checked or run imports them: their only importers are in `legacy/transaction-history/` (the wallet-SDK adapter
`test/integration/pg-tx-history-adapter{,.test}.ts` and the two live preprod tests), whose TypeScript program and
tests no longer run (owner decision Q112 B; the folder is frozen at `e31fcf8`). Every install still downloads them,
the supply-chain gate still scans them, and `docs/supply-chain/inventory.md` still lists them.

`design.md` §13 does not list them, so task 17.2 left them (its edits of `package.json` stay within §13's list).

## Evidence

- `git grep -n -E "from ['\"](effect|@midnightntwrk/wallet-sdk-abstractions)['\"/]" -- ':!legacy'` finds only a string
  in a negative control's fixture (`test/node/no-indexer-or-wallet-sdk.test.ts:169`).
- `test/node/no-indexer-or-wallet-sdk.test.ts:157` asserts that the lockfile holds the wallet SDK as a development
  dependency, to show that its run-time check is not vacuous; removing the dependency needs another witness there.
- `docs/supply-chain/inventory.md:55`, `:57` (the two rows, per task 17.1's note (a)).

## Suggested fix

Remove both from `devDependencies` and the lockfile (`npm uninstall effect @midnightntwrk/wallet-sdk-abstractions`),
drop their inventory rows, and give `no-indexer-or-wallet-sdk.test.ts` a planted lockfile entry as its non-vacuity
witness. Checking out `e31fcf8` (the README's commit) still gives F9 the dependencies with the code that needs them.
