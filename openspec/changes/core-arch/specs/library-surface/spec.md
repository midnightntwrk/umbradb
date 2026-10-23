# Spec delta — `library-surface` capability

EARS forms and terms as in `specs/runner/spec.md`. This capability covers what the package exports and how the 0.9.5
code is refactored, kept or retired (CORE-ARCH §3.4; owner decisions Q25, Q27, Q30).

## ADDED Requirements

### Requirement: LS-1 The package exports exactly the new surface

THE package SHALL export from `"."` exactly the values and types listed in `design.md` §12, and nothing else; a test
SHALL pin the sorted list of value exports and the list of type exports, and `package.json` SHALL expose only `"."`
and the `umbradb` command.

#### Scenario: An extra export
- **WHEN** a source file adds an export to `src/index.ts` that is not in the list
- **THEN** the surface test fails and names the export

### Requirement: LS-2 Retired parts are gone

THE package SHALL NOT contain or export TemporalKV, CheckpointStore, Watermarks, Transaction/Lease,
WalletStateEnvelope or `saveAndAdvance` in their 0.9.5 form; their behaviour that the owner kept SHALL live only in the
refactored parts listed in `proposal.md` (the database API, the single-writer lock, the storage helpers and the
runner's per-block transaction).

#### Scenario: The old names do not resolve
- **WHEN** a consumer imports `PgTemporalKV`, `PgCheckpointStore`, `PgWatermarks`, `PgTransactionLeaseLayer`,
  `PgWalletStateEnvelopeStore` or `saveAndAdvance` from the packed package
- **THEN** TypeScript reports that the export does not exist

### Requirement: LS-3 TransactionHistory stays, outside the build

THE repository SHALL keep the TransactionHistory source and its tests, excluded from the TypeScript build, the
package, the conformance run and the exports, until the private wallet-data feature (FEATURES F9) refactors it.

#### Scenario: Not in the package
- **WHEN** the package is packed
- **THEN** no TransactionHistory file is in the tarball, and the repository still holds its source and tests

### Requirement: LS-4 The change is announced as breaking

THE change SHALL set the package version to `0.10.0`, and SHALL state in `CHANGELOG.md` and in the pull request that
every 0.9.5 export is removed or replaced and that 0.9.5 databases are not migrated.

#### Scenario: The changelog says so
- **WHEN** `CHANGELOG.md` is read at the change's head
- **THEN** its `0.10.0` section starts with a breaking-change notice naming the removed exports

### Requirement: LS-5 The quality gates move to the new code

THE conformance, mutation, Lean trust, supply-chain, pack-smoke and knowledge-graph gates SHALL run on the new code at
the change's head; coverage floors and mutation targets SHALL name the new source files; the Lean proofs, required test
ids, property tests and benchmarks that cover retired parts SHALL be retired exactly as listed in `design.md` §13, and
nothing else SHALL be weakened.

#### Scenario: The retirement list matches the tree
- **WHEN** the required-test manifest, `stryker.conf.json`, `vitest.config.ts` floors and `Formal/Lean` at the
  change's head are compared with `design.md` §13
- **THEN** every removal in the tree is in the list, and every item of the list is applied

### Requirement: LS-6 The `umbradb` command

THE package SHALL provide the `umbradb` command with the subcommands `run` (start a core or private process from its
configuration), `config check` (CF-10), `snapshot export` and `snapshot import` (SN-1, SN-3); any other
subcommand
SHALL exit 2 with a usage message.

#### Scenario: An unknown subcommand
- **WHEN** `umbradb sync` is invoked
- **THEN** it prints the usage and exits 2
