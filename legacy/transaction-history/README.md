# TransactionHistory (kept, not built)

UmbraDB 0.9.5's per-wallet transaction history — `PgTransactionHistoryStorage`, its contract and value types, its
table's migration, its tests and its benchmark workload — kept here by the owner's decision (decision record Q27: kept
for the private side) until the private wallet-data feature (FEATURES F9) refactors it into private per-key history.

It is outside the TypeScript build, the package, the conformance run and the exports (core-arch `LS-3`, acceptance
`A3`; moved by task 17.1): `tsconfig.build.json` builds `src/` only, `package.json` `files` does not name `legacy/`,
`vitest.config.ts` excludes `legacy/**`, and `src/index.ts` exports none of it.
`test/library-surface/legacy-excluded.test.ts` checks all four, and that nothing outside this folder imports a file in
it; the pack smoke test checks the tarball of a clean build.

## Layout

Each file is at the path it had in the repository, below this folder (`src/`, `test/`, `bench/`), so the files here
import each other as before; their imports of 0.9.5 files that stayed (the storage errors, the JSON validators, the
transaction handle, the client, the test database) point two levels further up. Added by the move:

- `test/postgres/setup.ts`: the moved tests' database, the repository's `test/postgres/setup.ts` plus migration
  `004_transaction_history`, which left 0.9.5's `tier1_wallet` lineage with the source (a database that lineage
  creates no longer has `transaction_history`);
- `tsconfig.json`: this folder's own TypeScript program, which `npm run typecheck` runs after the repository's;
- `vitest.config.ts`: this folder's own test run, by hand, never the conformance run's.

## Checking it by hand

```sh
npx tsc --noEmit -p legacy/transaction-history/tsconfig.json
npx vitest run --config legacy/transaction-history/vitest.config.ts
npm run test:live   # the two live preprod tests (UMBRADB_LIVE_PREPROD=1, a funded seed, a midnight-wallet checkout)
```

The moved code still imports 0.9.5 modules: `src/interfaces/storage-errors.ts`, `temporal-kv.ts` (its JSON
validators) and `transaction-lease.ts`, `src/postgres/{abort,client,errors,transaction-lease}.ts`, and for the tests
`test/postgres/setup.ts`, `wallet-state-envelope.ts` and `checkpoint-store.ts`. What happens to this folder's program
and run when core-arch task 17.2 retires those is that task's decision.
