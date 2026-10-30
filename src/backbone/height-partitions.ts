/**
 * Range partitioning by height for per-block tables, which are append-only. It is kept from 0.9.5's `chain_archive`
 * store (`src/postgres/migrations/chain_archive/partition-config.ts`, since removed).
 * [CORE-ARCH §4.11; design §1, §10]
 *
 * There are {@link PRECREATED_HEIGHT_PARTITIONS} partitions of {@link HEIGHT_PARTITION_SIZE} heights each, starting at
 * height 0, plus a `DEFAULT` partition for every height above them, so no height is ever without a partition. The
 * sizes are build-time constants, not settings: they become part of a migration's text, and that text never changes
 * once a database has applied it. A later release adds partitions, by a new migration, before the chain passes height
 * 5,000,000; until then the default partition is correct, only unpartitioned. [DB-9, Q119]
 *
 * A partitioned table's primary key must include its partition key, so a key that must be unique across partitions on
 * any other column needs a table of its own (`core-block-commit`'s `hashes`). The determinism rules, the contents hash,
 * the digests' change capture and the `TRUNCATE` guard treat a partitioned table as one table, through its root. [CD-3]
 */

/** Heights per partition: 1,000,000, as 0.9.5's `CHAIN_ARCHIVE_HEIGHT_PARTITION_SIZE`. */
export const HEIGHT_PARTITION_SIZE = 1_000_000;

/** Partitions created from height 0, before the default one: five, as 0.9.5's `CHAIN_ARCHIVE_PRECREATED_PARTITIONS`. */
export const PRECREATED_HEIGHT_PARTITIONS = 5;

/** A table name the partitions' SQL writes as it is: `schema.table`, each a lowercase SQL identifier. */
const QUALIFIED_NAME = /^[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$/;

/**
 * The SQL that creates the partitions of `table` (`schema.table`, created `PARTITION BY RANGE` on its height column):
 * `<table>_p0` to `<table>_p4` for heights [0, 1,000,000) to [4,000,000, 5,000,000), then `<table>_default`, one
 * statement per line. Throws for a name that is not `schema.table` in lowercase identifiers, before any SQL is made.
 */
export function heightPartitionsSql(table: string): string {
  if (!QUALIFIED_NAME.test(table)) {
    throw new Error(`heightPartitionsSql: ${JSON.stringify(table)} is not schema.table in lowercase SQL identifiers`);
  }
  const statements: string[] = [];
  for (let index = 0; index < PRECREATED_HEIGHT_PARTITIONS; index++) {
    const from = index * HEIGHT_PARTITION_SIZE;
    const to = from + HEIGHT_PARTITION_SIZE;
    statements.push(`CREATE TABLE ${table}_p${index} PARTITION OF ${table} FOR VALUES FROM (${from}) TO (${to});`);
  }
  statements.push(`CREATE TABLE ${table}_default PARTITION OF ${table} DEFAULT;`);
  return statements.join("\n");
}
