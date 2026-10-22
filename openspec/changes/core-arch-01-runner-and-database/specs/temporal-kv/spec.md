# Spec delta — `temporal-kv` capability (removed)

TemporalKV, the wall-clock versioned key-value store, is refactored into the height-versioned-table helper (CORE-ARCH
§3.4, owner decisions Q27, Q30). The main spec `openspec/specs/temporal-kv/spec.md` is removed in full; where a
requirement's intent survives, the migration names the requirement that now carries it.

## REMOVED Requirements

### Requirement: Migrations are idempotent and ordered
**Reason**: TemporalKV's migration runner is replaced by per-module, checksummed migrations.
**Migration**: `database-api` DB-9.

### Requirement: Schema isolation is the default, not opt-in
**Reason**: the single `umbradb` schema is replaced by one schema per module.
**Migration**: `database-api` DB-6 and DB-8.

### Requirement: Postgres errors surface as the shared StorageError hierarchy
**Reason**: the storage error hierarchy is replaced by the database API's errors.
**Migration**: `database-api` DB-12 and `runner` RN-8.

### Requirement: Unconditional writes are gapless and monotonic (Law T1)
**Reason**: height-versioned tables have no version counter; versions are keyed by block height.
**Migration**: none; `storage-helpers` SH-2 defines the replacement semantics.

### Requirement: A caller-supplied transaction handle is honored or rejected, never silently ignored
**Reason**: callers no longer pass transaction handles; writes happen only through the block write handle.
**Migration**: `database-api` DB-3.

### Requirement: put's CAS guard distinguishes conflict from absence
**Reason**: there is one writer and writes are ordered by the runner, so there is no compare-and-set.
**Migration**: none.

### Requirement: A second write to the same key within one transaction is rejected at the trigger level, not silently absorbed
**Reason**: the rule survives per block in the height-versioned table.
**Migration**: `storage-helpers` SH-3.

### Requirement: listKeys streams without materializing the full result set first, and orders results correctly
**Reason**: modules read their tables with SQL through read handles.
**Migration**: `database-api` DB-2.

### Requirement: getAt satisfies temporal-projection equivalence (Law T3), within the store's retention window
**Reason**: reads are by block height, with no wall-clock time and no retention pruning.
**Migration**: `storage-helpers` SH-2.

### Requirement: Dual addressing agrees at recorded write timestamps (Law T4)
**Reason**: there are no write timestamps and no version numbers.
**Migration**: none.

### Requirement: History intervals never overlap for a single key (Law T5)
**Reason**: the half-open interval rule survives with heights instead of times.
**Migration**: `storage-helpers` SH-2.
