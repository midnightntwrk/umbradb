/**
 * The content of `core-ledger-state`'s node tables, which take part in the contents hash by what they hold rather than
 * by their bytes: the ledger can store one node in two forms (a small child embedded in its parent, or referenced and
 * stored as its own row), so two indexers holding the same nodes can differ in these tables' bytes, and in the counts
 * and the queue the rows give.
 *
 * {@link nodeTablesContent} reads, through the contents hash's one snapshot:
 * - `nodes`, every row in key order, a page at a time. Each row is authenticated: its key must be the hash of its
 *   payload and its children's keys (`../../ledger/node-key.ts`), else the computation fails (`node-key`), so a
 *   changed payload or child list cannot leave the node set as it was. The table appears as its **node set**,
 *   `[schema, "nodes", ["node_key"], [[k] for every k of the set, in byte order]]`: the keys of its rows and of every
 *   node their child lists embed, each once. Both forms of a node hold the same keys, so the node set does not depend
 *   on the forms.
 * - `ref_counts` and `unreferenced`, recorded by name only, `[schema, table, null, null]`, after checking, in order,
 *   that every reference a row's child list holds (through embedded children) is a row (`closure`); that every key
 *   with a root count is a row (`roots`); that `ref_counts` holds exactly each referenced key with its number of
 *   references (`counts`); and that `unreferenced` holds exactly the rows with neither a reference nor a root count
 *   (`queue`). They are derived from the rows' forms, so they are checked, not compared.
 *
 * A check that fails, or a row whose key is not its content's, fails the computation with `ledger-refcount-invalid`,
 * reason `tables-inconsistent`, naming the check and the first such key in byte order: a backup is not written, a
 * restore rolls back, the exported `contentsHash` rejects.
 *
 * {@link LEDGER_NODE_TABLES} is the declaration a `ledger-state` table item carries for them. {@link NodeSetFault} is
 * the seam through which a negative control puts a fault into the content.
 */

import { UmbraError } from "../../db/errors.js";
import type { ContentFunction, TableContent } from "../../determinism/contents-hash.js";
import type { ConsistentRead } from "../../determinism/module-tables.js";
import { nodeKeys } from "../../ledger/node-key.js";
import { childRefKeys } from "../../ledger/node-refs.js";
import type { ContentDefinition } from "../../modules/declaration.js";
import { NODES_TABLE, REF_COUNTS_TABLE, ROOT_COUNTS_TABLE, UNREFERENCED_TABLE } from "./sql.js";

/** A check of the node tables, as `details.check` names it. */
export type NodeTableCheck = "node-key" | "closure" | "roots" | "counts" | "queue";

/**
 * A fault a negative control puts into the content; the build's content carries none:
 * - `constant-node-set`: `nodes` contributes no key, whatever it holds;
 * - `no-key-check`: a row's key is not compared with its content's.
 */
export type NodeSetFault = "constant-node-set" | "no-key-check";

/** What the content of the node tables is computed with. */
export interface NodeSetOptions {
  /** The fault a negative control puts into the content; none in a build. */
  readonly fault?: NodeSetFault;
}

/** The rows read per statement unless the contents hash gives its page size. */
const DEFAULT_PAGE_SIZE = 1_000;

const hexOf = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** `ledger-refcount-invalid` (`tables-inconsistent`) for `check` and the key `key` (hex). */
function inconsistent(check: NodeTableCheck, key: string, message: string): UmbraError {
  return new UmbraError(
    "ledger-refcount-invalid",
    `the ledger's node tables are inconsistent: ${message} (tables-inconsistent, ${check})`,
    { reason: "tables-inconsistent", check, key: `0x${key}` },
  );
}

/** The first of `keys` in byte order (hex in lowercase sorts as the bytes do), or undefined. */
function first(keys: Iterable<string>): string | undefined {
  let found: string | undefined;
  for (const key of keys) if (found === undefined || key < found) found = key;
  return found;
}

/**
 * Every row of `table` in key order, `columns` first among them its key `node_key`, a page at a time. The page size,
 * as the last key read, is a bound parameter: no value is spliced into the statement.
 */
async function* keyOrdered(
  read: ConsistentRead,
  table: string,
  columns: string,
  pageSize: number,
): AsyncGenerator<Record<string, unknown>> {
  let after: Uint8Array | undefined;
  for (;;) {
    const rows =
      after === undefined
        ? await read.query(`SELECT ${columns} FROM ${table} ORDER BY node_key LIMIT $1`, [pageSize])
        : await read.query(`SELECT ${columns} FROM ${table} WHERE node_key > $1 ORDER BY node_key LIMIT $2`, [after, pageSize]);
    yield* rows;
    if (rows.length < pageSize) return;
    after = (rows[rows.length - 1] as Record<string, unknown>).node_key as Uint8Array;
  }
}

/**
 * The content function of `nodes`, `ref_counts` and `unreferenced` (see the module comment), with `options`' fault.
 */
export function nodeTablesContent(options: NodeSetOptions = {}): ContentFunction {
  return async (read, page) => {
    const pageSize = page.pageSize ?? DEFAULT_PAGE_SIZE;
    if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
      throw new RangeError(`pageSize must be a positive integer, got ${pageSize}`);
    }
    const rows = new Set<string>();
    const nodeSet = new Set<string>();
    const refs = new Map<string, number>();
    for await (const row of keyOrdered(read, NODES_TABLE, "node_key, data, children", pageSize)) {
      const key = hexOf(row.node_key as Uint8Array);
      const data = row.data as Uint8Array;
      const children = row.children as Uint8Array;
      let computed: ReturnType<typeof nodeKeys>;
      try {
        computed = nodeKeys(data, children);
      } catch (cause) {
        const why = cause instanceof Error ? cause.message : String(cause);
        throw inconsistent("node-key", key, `the stored node 0x${key} cannot be hashed: ${why}`);
      }
      const own = hexOf(computed.key);
      if (own !== key && options.fault !== "no-key-check") {
        throw inconsistent("node-key", key, `the stored node 0x${key} has the content of the node 0x${own}`);
      }
      rows.add(key);
      nodeSet.add(key);
      for (const embedded of computed.embedded) nodeSet.add(hexOf(embedded));
      for (const ref of childRefKeys(children)) {
        const referenced = hexOf(ref);
        refs.set(referenced, (refs.get(referenced) ?? 0) + 1);
      }
    }

    const dangling = first([...refs.keys()].filter((key) => !rows.has(key)));
    if (dangling !== undefined) {
      throw inconsistent("closure", dangling, `0x${dangling} is referenced by a stored node's child list and is no stored node`);
    }
    const roots = new Set<string>();
    for await (const row of keyOrdered(read, ROOT_COUNTS_TABLE, "node_key", pageSize)) roots.add(hexOf(row.node_key as Uint8Array));
    const rootless = first([...roots].filter((key) => !rows.has(key)));
    if (rootless !== undefined) {
      throw inconsistent("roots", rootless, `0x${rootless} has a root count and is no stored node`);
    }

    const counted = new Map<string, number>();
    for await (const row of keyOrdered(read, REF_COUNTS_TABLE, "node_key, count", pageSize)) {
      counted.set(hexOf(row.node_key as Uint8Array), Number(row.count));
    }
    const miscounted = first(
      [...new Set([...refs.keys(), ...counted.keys()])].filter((key) => (refs.get(key) ?? 0) !== (counted.get(key) ?? 0)),
    );
    if (miscounted !== undefined) {
      const holds = counted.get(miscounted) ?? 0;
      const given = refs.get(miscounted) ?? 0;
      throw inconsistent(
        "counts",
        miscounted,
        `${REF_COUNTS_TABLE} holds ${holds} for 0x${miscounted}, where the stored child lists reference it ${given} times`,
      );
    }

    const queued = new Set<string>();
    for await (const row of keyOrdered(read, UNREFERENCED_TABLE, "node_key", pageSize)) {
      queued.add(hexOf(row.node_key as Uint8Array));
    }
    const owed = (key: string): boolean => rows.has(key) && !refs.has(key) && !roots.has(key);
    const misqueued = first([...new Set([...rows, ...queued])].filter((key) => queued.has(key) !== owed(key)));
    if (misqueued !== undefined) {
      const why = queued.has(misqueued)
        ? `${UNREFERENCED_TABLE} holds 0x${misqueued}, which is ${rows.has(misqueued) ? "referenced or persisted" : "no stored node"}`
        : `${UNREFERENCED_TABLE} lacks 0x${misqueued}, a stored node with neither a reference nor a root count`;
      throw inconsistent("queue", misqueued, why);
    }

    const keys = options.fault === "constant-node-set" ? [] : [...nodeSet].sort();
    const nodes: TableContent = {
      columns: [{ name: "node_key", type: "bytea" }],
      rows: keys.map((key) => [Uint8Array.from(Buffer.from(key, "hex"))]),
    };
    return new Map<string, TableContent | null>([
      ["nodes", nodes],
      ["ref_counts", null],
      ["unreferenced", null],
    ]);
  };
}

/**
 * `core-ledger-state`'s content-defined tables, `nodes`, `ref_counts` and `unreferenced`, with their content function:
 * what its `ledger-state` table item declares.
 */
export const LEDGER_NODE_TABLES: ContentDefinition = Object.freeze({
  tables: ["nodes", "ref_counts", "unreferenced"],
  content: nodeTablesContent(),
});
