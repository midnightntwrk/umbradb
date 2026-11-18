import type { NodeBatch } from "../../src/ledger/types.js";
import type { RefcountTables } from "./refcount-model.js";
import { refcountStep } from "./refcount-step.js";
import { stepTables } from "./run-reclaim.js";

/**
 * The per-block step as the reference of what the build stores: given the tables after h − 1 and the flush the worker
 * recorded for h, the step's tables after h, and where the build's tables after h differ from them. The step is the
 * parent's code, so tables equal to its result are the parent's tables on the same inputs. Imports nothing of Vitest.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const short = (line: string): string => line.slice(0, 12);

/**
 * `nodes` (each row's child list), `ref_counts`, `root_counts` and `unreferenced` after block `height` by the step,
 * given the tables `before` it and its flush `flushed`.
 */
export async function referenceAfter(height: bigint, before: RefcountTables, flushed: NodeBatch, on = true): Promise<RefcountTables> {
  const step = await refcountStep(stepTables(before, before.roots), flushed, { height, on });
  const rows = new Map(before.rows);
  // The node write: every flushed node with its flushed child list (one written again unchanged changes nothing).
  for (const node of flushed.inserts) rows.set(hex(node.key), node.children);
  const refs = new Map(before.refs);
  for (const { key, delta } of step.deltas) {
    const next = (refs.get(hex(key)) ?? 0) + delta;
    if (next > 0) refs.set(hex(key), next);
    else refs.delete(hex(key));
  }
  const queue = new Set(before.queue);
  for (const key of step.unqueued) queue.delete(hex(key));
  for (const key of step.queued) queue.add(hex(key));
  for (const key of step.deleted) rows.delete(hex(key));
  const roots = new Map(before.roots);
  for (const { key, delta } of flushed.rootCounts) {
    const next = (roots.get(hex(key)) ?? 0) + delta;
    if (next !== 0) roots.set(hex(key), next);
    else roots.delete(hex(key));
  }
  return { rows, refs, roots, queue };
}

/** Where two sets of tables differ, by table, each with up to three keys on each side; none when equal row for row. */
export function referenceDifferences(height: bigint, got: RefcountTables, want: RefcountTables): string[] {
  const lines = {
    nodes: (tables: RefcountTables): string[] => [...tables.rows].map(([key, children]) => `${key}:${hex(children)}`),
    ref_counts: (tables: RefcountTables): string[] => [...tables.refs].map(([key, count]) => `${key}:${count}`),
    root_counts: (tables: RefcountTables): string[] => [...tables.roots].map(([key, count]) => `${key}:${count}`),
    unreferenced: (tables: RefcountTables): string[] => [...tables.queue],
  };
  const problems: string[] = [];
  for (const [table, of] of Object.entries(lines)) {
    const a = new Set(of(got));
    const b = new Set(of(want));
    const extra = [...a].filter((line) => !b.has(line)).sort();
    const absent = [...b].filter((line) => !a.has(line)).sort();
    if (extra.length === 0 && absent.length === 0) continue;
    problems.push(
      `after ${height}: ${table} differs from the reference step's: ${extra.length} rows more (${extra.slice(0, 3).map(short).join(", ")}), ` +
        `${absent.length} fewer (${absent.slice(0, 3).map(short).join(", ")})`,
    );
  }
  return problems;
}

/**
 * Where the tables `after` block `height` differ from the reference step's over `before` (the tables after h − 1) and
 * `flushed` (the flush recorded for h), `on` the block's sweep; none when they are equal row for row.
 */
export async function referenceProblems(
  height: bigint,
  before: RefcountTables,
  after: RefcountTables,
  flushed: NodeBatch,
  on = true,
): Promise<string[]> {
  try {
    return referenceDifferences(height, after, await referenceAfter(height, before, flushed, on));
  } catch (error) {
    return [`after ${height}: the reference step halted: ${error instanceof Error ? error.message : String(error)}`];
  }
}
