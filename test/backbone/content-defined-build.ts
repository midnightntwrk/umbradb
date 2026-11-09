import { CORE_LEDGER_STATE, LEDGER_STATE_ITEM } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { LEDGER_NODE_TABLES } from "../../src/backbone/core-ledger-state/node-set.js";
import { NODES_TABLE, REF_COUNTS_TABLE, ROOT_COUNTS_TABLE, UNREFERENCED_TABLE } from "../../src/backbone/core-ledger-state/sql.js";
import type { BlockWriteHandle } from "../../src/db/api.js";
import type { ContentDefinition, ModuleDeclaration, PointCallbacks } from "../../src/modules/declaration.js";
import { decodeChildren, hex, refsOf } from "../ledger/node-format.js";

/**
 * A test build of `core-ledger-state` whose `ledger-state` item declares `nodes`, `ref_counts` and `unreferenced`
 * content-defined (`LEDGER_NODE_TABLES`), the declaration the build itself carries once its blocks write the counts and
 * the queue. Until then the mark-and-sweep runs and leaves `ref_counts` and `unreferenced` empty, which the content's
 * checks refuse; so a database a process builds with this test build gets them written by the test after each block's
 * writes, computed here from the stored rows and `root_counts` with the independent node format of
 * `../ledger/node-format.ts` ({@link countsAndQueue}).
 *
 * When `CORE_LEDGER_STATE` declares the tables itself, the build here declares them the same way, so a test written on
 * it runs unchanged on the build's own declaration.
 */

/** What the test build changes in `core-ledger-state`. */
export interface ContentDefinedBuildOptions {
  /** The declaration changed: `CORE_LEDGER_STATE` unless given. */
  readonly base?: ModuleDeclaration;
  /** What the `ledger-state` item declares content-defined: `LEDGER_NODE_TABLES` unless given (a control's). */
  readonly contentDefined?: ContentDefinition;
  /** After each block's own writes, `ref_counts` and `unreferenced` written as the stored rows give them. */
  readonly writesCounts?: boolean;
}

/** `core-ledger-state` as the test build declares it (see the module comment). */
export function contentDefinedLedgerState(options: ContentDefinedBuildOptions = {}): ModuleDeclaration {
  const base = options.base ?? CORE_LEDGER_STATE;
  const contentDefined = options.contentDefined ?? LEDGER_NODE_TABLES;
  const provides = base.provides.map((item) =>
    item.name !== LEDGER_STATE_ITEM || item.table === undefined ? item : { ...item, table: { ...item.table, contentDefined } },
  );
  const write = base.points["on-db-write"];
  if (options.writesCounts !== true || write === undefined) return { ...base, provides };
  const points: Partial<PointCallbacks> = {
    ...base.points,
    async "on-db-write"(p, b, w) {
      await write.call(base.points, p, b, w);
      await writeCountsAndQueue(w);
    },
  };
  return { ...base, provides, points };
}

/** A stored node as the test reads it back: its key, payload and child list. */
export interface StoredRow {
  readonly key: Uint8Array;
  readonly data: Uint8Array;
  readonly children: Uint8Array;
}

/**
 * The reference counts and the queue `rows` and the persisted keys `roots` give: each key referenced through the rows'
 * child lists (embedded children included) with its number of references, and the rows with neither a reference nor a
 * root count, each in byte order.
 */
export function countsAndQueue(
  rows: readonly Pick<StoredRow, "key" | "children">[],
  roots: ReadonlySet<string>,
): { readonly counts: readonly (readonly [string, number])[]; readonly queue: readonly string[] } {
  const refs = new Map<string, number>();
  for (const row of rows) {
    for (const key of refsOf(decodeChildren(row.children))) refs.set(hex(key), (refs.get(hex(key)) ?? 0) + 1);
  }
  const queue = rows.map((row) => hex(row.key)).filter((key) => !refs.has(key) && !roots.has(key));
  return { counts: [...refs].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)), queue: queue.sort() };
}

/** Rewrites `ref_counts` and `unreferenced` from the rows and root counts the block's handle sees. */
async function writeCountsAndQueue(w: BlockWriteHandle): Promise<void> {
  const rows = (await w.query(`SELECT node_key, children FROM ${NODES_TABLE}`)).map((row) => ({
    key: row.node_key as Uint8Array,
    children: row.children as Uint8Array,
  }));
  const roots = new Set((await w.query(`SELECT node_key FROM ${ROOT_COUNTS_TABLE}`)).map((row) => hex(row.node_key as Uint8Array)));
  const { counts, queue } = countsAndQueue(rows, roots);
  const bytes = (key: string): Uint8Array => Uint8Array.from(Buffer.from(key, "hex"));
  await w.execute(`DELETE FROM ${REF_COUNTS_TABLE}`);
  await w.execute(`INSERT INTO ${REF_COUNTS_TABLE} (node_key, count) SELECT * FROM unnest($1::bytea[], $2::integer[])`, [
    counts.map(([key]) => bytes(key)),
    counts.map(([, count]) => count),
  ]);
  await w.execute(`DELETE FROM ${UNREFERENCED_TABLE}`);
  await w.execute(`INSERT INTO ${UNREFERENCED_TABLE} (node_key) SELECT * FROM unnest($1::bytea[])`, [queue.map(bytes)]);
}
