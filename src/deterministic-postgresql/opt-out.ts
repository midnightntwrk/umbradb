/**
 * The opt-out of the determinism rules (`openspec/changes/core-arch/design.md` §4, the component table's last row; MD-1,
 * DT-3, DT-4, DT-6, DB-14; owner decision Q76): a module declares a `table` item `deterministic: false` for data that
 * is not a function of the chain, such as the time a request arrived. The declaration is the module's
 * (`src/modules/`), and the schema plan lists the tables it names (`optedOut`, `src/db/roles.ts`); which tables and
 * relations such a list covers is decided here, once, for every rule that skips them: DT-6's refusals
 * (`databaseRefusals`, `./column-rules.ts`), the `TRUNCATE` guard (`truncateGuardStatements`,
 * `./block-transactions.ts`), and task 7.1's `CHECK`s, change capture and contents hash.
 *
 * A list covers each table it names by schema and name, and with it whatever belongs to that table: its partitions (a
 * partition holds rows of its partitioned table, so the root's declaration decides), and the sequences its columns own
 * (an identity column's, a `serial` column's, or one declared `OWNED BY` one of its columns) — the catalog gives each
 * relation the table it belongs to (`belongsTo`, `./catalog.ts`). Nothing else is covered: a table of the same name in
 * another schema, a sequence no column owns.
 */

/** A table by schema and name. */
export interface TableName {
  readonly schema: string;
  readonly table: string;
}

/** What a list of tables declared `deterministic: false` covers. */
export interface OptOut {
  /**
   * True when `table` is one of the listed tables. Ask it with the table a relation belongs to — a partition's
   * partitioned table, a sequence's owning table — to know whether the relation is covered; null (a sequence no column
   * owns) is never covered.
   */
  covers(table: TableName | null): boolean;
}

/** The opt-out of the tables `optedOut` names (MD-1, Q76): see the module comment. */
export function optOut(optedOut: readonly TableName[]): OptOut {
  const listed = new Set(optedOut.map(({ schema, table }) => JSON.stringify([schema, table])));
  return {
    covers: (table) => table !== null && listed.has(JSON.stringify([table.schema, table.table])),
  };
}
