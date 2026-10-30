# TransactionHistory (kept, not built)

UmbraDB 0.9.5's per-wallet transaction history — `PgTransactionHistoryStorage`, its contract and value types, its
table's migration and its tests — kept here by the owner's decision (decision record Q27: kept for the private side)
until the private wallet-data feature (FEATURES F9) refactors it into private per-key history.

It is outside the TypeScript build, the package, the conformance run and the exports (core-arch `LS-3`, acceptance
`A3`; moved by task 17.1): `tsconfig.build.json` builds `src/` only, `package.json` `files` does not name `legacy/`,
`vitest.config.ts` excludes `legacy/**`, and `src/index.ts` exports none of it.
`test/library-surface/legacy-excluded.test.ts` checks all four, and that nothing outside this folder imports a file in
it; the pack smoke test checks the tarball of a clean build.

## Frozen at `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`

The code here no longer compiles, and its tests no longer run, at the head of the branch: core-arch task 17.2 retired
the 0.9.5 modules it imports (owner decision Q112 B, 2026-10-26) and stopped running this folder's program and tests
(`npm run typecheck` checks the repository's program only; the `test:live` script is gone). The files are kept as
they were.

**The last commit where it compiled and its tests passed is `e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94`** (`e31fcf8`,
core-arch task 13.1, 2026-10-27; the parent of task 17.2's commit as written on its lane), checked by task 17.2 on
2026-10-27 on Node.js v24.9.0 with Docker 29.8.2 (PostgreSQL 18.6 through Testcontainers):

- `npx tsc --noEmit -p legacy/transaction-history/tsconfig.json`: exit 0;
- `npx vitest run --config legacy/transaction-history/vitest.config.ts`: 6 files, 4 passed and 2 skipped; 98 tests
  passed and 4 skipped — the two live preprod tests (`UMBRADB_LIVE_PREPROD` unset) and the parity file's two
  comparisons against the real wallet SDK, as at task 17.1.

To run it, check that commit out:

```sh
git checkout e31fcf85f2f0228d7c21c6e3f320a4f430f3ea94
npx tsc --noEmit -p legacy/transaction-history/tsconfig.json
npx vitest run --config legacy/transaction-history/vitest.config.ts
npm run test:live   # the two live preprod tests (UMBRADB_LIVE_PREPROD=1, a funded seed, a midnight-wallet checkout)
```

## Layout

Each file is at the path it had in the repository, below this folder (`src/`, `test/`), so the files here import each
other as before; their imports of 0.9.5 files outside it (the storage errors, the JSON validators, the transaction
handle, the client, the test database, and for the cold-boot live test WalletStateEnvelope and CheckpointStore) point
two levels further up — to files task 17.2 removed. Added by the move:

- `test/postgres/setup.ts`: the moved tests' database, the repository's `test/postgres/setup.ts` plus migration
  `004_transaction_history`, which left 0.9.5's `tier1_wallet` lineage with the source;
- `tsconfig.json`: this folder's own TypeScript program (not run since task 17.2);
- `vitest.config.ts`: this folder's own test run, never the conformance run's (not run since task 17.2).

The benchmark workload that task 17.1 moved here (`bench/workloads/transaction-history.ts`, `tx-history-merge.ts`) was
retired by task 17.2 with 0.9.5's other workloads and their baseline (`openspec/changes/core-arch/design.md` §13); it
is at the commit above.
