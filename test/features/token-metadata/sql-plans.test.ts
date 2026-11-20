import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ReadHandle } from "../../../src/db/api.js";
import { STATEMENTS as API } from "../../../src/features/token-metadata-api/sql.js";
import { STATEMENTS as INDEXER } from "../../../src/features/token-metadata/sql.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../../runner/process-backends.js";
import { readStopped, runTo } from "./harness.js";

/**
 * The plans of every statement `token-metadata` and `token-metadata-api` send (their `sql.ts` catalogs), on
 * PostgreSQL 18 and PGlite, on a database with the indexer's tables:
 *
 * - **No table scan:** each statement is prepared and its generic plan explained (independent of its parameters,
 *   nothing run), with table scans off, so an index that can serve it is used; a `Seq Scan` of a `token_metadata` table in a plan
 *   means no index can, and fails here.
 * - **Every index used:** each index of the schema but the primary keys is used by at least one catalogued statement
 *   (an index scan, or an `ON CONFLICT` arbiter); an index no statement needs fails here, so indexes stay as few as the
 *   statements need.
 * - A read of a whole index (an index scan with no condition), or one that filters the rows its index gave, counts
 *   as a scan of its table: the index does not serve the statement.
 * - **Negative control:** with `tokens_contract_idx` dropped, `tokensOfContract` scans `token_metadata.tokens`, and the
 *   check sees it.
 */

const SCHEMA = "token_metadata";
const CATALOG: readonly (readonly [string, string])[] = [
  ...Object.entries(INDEXER).map(([name, text]) => [`indexer.${name}`, text] as const),
  ...Object.entries(API).map(([name, text]) => [`api.${name}`, text] as const),
];

interface PlanNode {
  "Node Type"?: string;
  "Relation Name"?: string;
  Schema?: string;
  "Index Name"?: string;
  "Index Cond"?: string;
  Filter?: string;
  "Conflict Arbiter Indexes"?: string[];
  Plans?: PlanNode[];
}

/** The tables a plan scans whole, and the indexes it uses. */
function walk(node: PlanNode, out: { scans: string[]; indexes: string[] }): void {
  const type = node["Node Type"];
  if (type === "Seq Scan") out.scans.push(`${node.Schema}.${node["Relation Name"]}`);
  // An index read with no condition reads the whole index, and one that filters what the index gave throws rows away:
  // either way the index does not serve the statement, a scan of the table all the same.
  const indexed = type === "Index Scan" || type === "Index Only Scan" || type === "Bitmap Heap Scan";
  if (indexed && ((type !== "Bitmap Heap Scan" && node["Index Cond"] === undefined) || node.Filter !== undefined)) {
    out.scans.push(`${node.Schema}.${node["Relation Name"]}`);
  }
  if (node["Index Name"] !== undefined) out.indexes.push(node["Index Name"]);
  out.indexes.push(...(node["Conflict Arbiter Indexes"] ?? []));
  for (const child of node.Plans ?? []) walk(child, out);
}

let prepared = 0;

/**
 * The generic plan of `text` with table scans off: the `token_metadata` tables it scans, and the indexes it uses. The
 * statement is prepared and its plan forced generic (independent of its parameters), then explained with null
 * arguments; nothing is executed.
 */
async function plan(read: ReadHandle, text: string): Promise<{ scans: string[]; indexes: string[] }> {
  const name = `plan_${++prepared}`;
  const parameters = Math.max(0, ...[...text.matchAll(/\$(\d+)/g)].map((m) => Number(m[1])));
  await read.query("SET LOCAL enable_seqscan = off");
  await read.query("SET LOCAL plan_cache_mode = force_generic_plan");
  await read.query(`PREPARE ${name} AS ${text}`);
  try {
    const args = parameters === 0 ? "" : `(${Array.from({ length: parameters }, () => "NULL").join(", ")})`;
    const [row] = await read.query(`EXPLAIN (VERBOSE, FORMAT JSON) EXECUTE ${name}${args}`);
    const json = row!["QUERY PLAN"];
    const [top] = (typeof json === "string" ? JSON.parse(json) : json) as { Plan: PlanNode }[];
    const out = { scans: [] as string[], indexes: [] as string[] };
    walk(top!.Plan, out);
    return { scans: out.scans.filter((t) => t.startsWith(`${SCHEMA}.`)), indexes: out.indexes };
  } finally {
    await read.query(`DEALLOCATE ${name}`);
  }
}

describe.each(PROCESS_BACKENDS)("the plans of the token-metadata statements on $name", (backend: ProcessBackend) => {
  let db: ProcessDatabase;

  beforeAll(async () => {
    await backend.start();
    db = await backend.database();
    await runTo(db, { start: 0, head: 2 });
  }, 240_000);
  afterAll(() => backend.stop(), 60_000);

  it("no catalogued statement scans a token_metadata table, and every index but the primary keys is used", async () => {
    const plans = await readStopped(db, async (read) => {
      const out: { name: string; scans: string[]; indexes: string[] }[] = [];
      for (const [name, text] of CATALOG) out.push({ name, ...(await plan(read, text)) });
      return out;
    });
    expect(plans.filter((p) => p.scans.length > 0).map((p) => [p.name, p.scans])).toEqual([]);
    const indexes = await db.query(
      `SELECT i.indexname AS name FROM pg_indexes i JOIN pg_class c ON c.relname = i.indexname
       JOIN pg_index x ON x.indexrelid = c.oid WHERE i.schemaname = '${SCHEMA}' AND NOT x.indisprimary ORDER BY 1`,
    );
    const used = new Set(plans.flatMap((p) => p.indexes));
    expect(indexes.map((r) => r.name).filter((name) => !used.has(name as string))).toEqual([]);
    expect(indexes.length).toBeGreaterThan(0);
  }, 120_000);

  it("[NEG] without tokens_contract_idx, tokensOfContract scans token_metadata.tokens, and the check sees it", async () => {
    const other = await backend.database();
    await runTo(other, { start: 0, head: 2 });
    await other.query(`DROP INDEX ${SCHEMA}.tokens_contract_idx`);
    const scans = await readStopped(other, async (read) => (await plan(read, API.tokensOfContract)).scans);
    expect(scans).toEqual([`${SCHEMA}.tokens`]);
  }, 120_000);
});
