/**
 * The "chain sync (core modules)" row of spec §8: the database's size, and the sync's speed in heights per second
 * from the process's status samples (`status.jsonl`, which `run/sync.mjs record` appends from the admin `/status`
 * route: `{ at, state, cursor, head }` whenever it changed).
 *
 * Speed: over consecutive samples, the heights the cursor advanced divided by the time between them. Pairs further
 * apart than `maxGapMs` (a stop and a restart) are left out and counted as gaps; when any pair is in state `syncing`
 * at both ends, only those count (following the head adds a height per block, which is the chain's pace, not the
 * sync's).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ChainSync } from "./bench-results.ts";

export interface StatusSample {
  readonly at: number;
  readonly cursor: number;
  readonly state: string | null;
}

/** Reads `status.jsonl` lines; samples without a cursor are skipped. */
export function parseStatusSamples(text: string): StatusSample[] {
  const out: StatusSample[] = [];
  for (const line of text.split("\n")) {
    if (line.trim() === "") continue;
    let record: Record<string, unknown>;
    try {
      record = JSON.parse(line) as Record<string, unknown>;
    } catch {
      continue;
    }
    const cursor = record.cursor === null || record.cursor === undefined ? Number.NaN : Number(record.cursor);
    const at = Number(record.at);
    if (!Number.isFinite(cursor) || !Number.isFinite(at)) continue;
    out.push({ at, cursor, state: typeof record.state === "string" ? record.state : null });
  }
  return out.sort((a, b) => a.at - b.at);
}

/** The status samples and the number of runs (`runs.jsonl` lines) in a `run/sync.mjs` output folder. */
export function readSyncRecords(dir: string): { samples: StatusSample[]; runs: number | null } {
  const status = join(dir, "status.jsonl");
  if (!existsSync(status)) throw new Error(`no status.jsonl in ${dir}`);
  const runsFile = join(dir, "runs.jsonl");
  const runs = existsSync(runsFile) ? readFileSync(runsFile, "utf8").split("\n").filter((l) => l.trim() !== "").length : null;
  return { samples: parseStatusSamples(readFileSync(status, "utf8")), runs };
}

/** Heights per second over the samples, overall and in `windows` equal height ranges (see the module comment). */
export function syncRate(samples: readonly StatusSample[], options: { maxGapMs?: number; windows?: number } = {}): ChainSync["rate"] {
  const maxGap = options.maxGapMs ?? 60_000;
  const windowCount = options.windows ?? 10;
  const pairs: { from: StatusSample; to: StatusSample }[] = [];
  let gaps = 0;
  for (let i = 1; i < samples.length; i++) {
    const from = samples[i - 1]!;
    const to = samples[i]!;
    if (to.at - from.at > maxGap || to.cursor < from.cursor) {
      gaps++;
      continue;
    }
    pairs.push({ from, to });
  }
  const syncing = pairs.filter((p) => p.from.state === "syncing" && p.to.state === "syncing");
  const counted = syncing.length > 0 ? syncing : pairs;
  const heights = counted.reduce((n, p) => n + (p.to.cursor - p.from.cursor), 0);
  const ms = counted.reduce((n, p) => n + (p.to.at - p.from.at), 0);
  if (counted.length === 0 || ms <= 0) return null;
  const fromHeight = Math.min(...counted.map((p) => p.from.cursor));
  const toHeight = Math.max(...counted.map((p) => p.to.cursor));
  const span = Math.max(1, toHeight - fromHeight);
  const size = Math.ceil(span / windowCount);
  const buckets = new Map<number, { heights: number; ms: number }>();
  for (const p of counted) {
    const w = Math.min(windowCount - 1, Math.floor((p.from.cursor - fromHeight) / size));
    const b = buckets.get(w) ?? { heights: 0, ms: 0 };
    b.heights += p.to.cursor - p.from.cursor;
    b.ms += p.to.at - p.from.at;
    buckets.set(w, b);
  }
  const windows = [...buckets.entries()]
    .sort(([a], [b]) => a - b)
    .filter(([, b]) => b.ms > 0)
    .map(([w, b]) => ({
      fromHeight: fromHeight + w * size,
      toHeight: Math.min(toHeight, fromHeight + (w + 1) * size),
      heightsPerSecond: (b.heights * 1000) / b.ms,
      seconds: b.ms / 1000,
    }));
  return { heightsPerSecond: (heights * 1000) / ms, heights, seconds: ms / 1000, fromHeight, toHeight, samples: samples.length, gaps, windows };
}

type Query = (sql: string, params?: unknown[]) => Promise<readonly Record<string, unknown>[]>;

/** The database's size and each schema's (tables with their indexes and TOAST). */
export async function databaseSize(query: Query): Promise<NonNullable<ChainSync["database"]>> {
  const [total] = await query("SELECT pg_database_size(current_database()) AS bytes");
  const schemas = await query(
    `SELECT n.nspname AS schema, sum(pg_total_relation_size(c.oid)) AS bytes
       FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind IN ('r', 'm') AND n.nspname NOT IN ('pg_catalog', 'information_schema') AND n.nspname NOT LIKE 'pg_toast%'
      GROUP BY n.nspname ORDER BY 2 DESC`,
  );
  return {
    bytes: Number(total?.bytes ?? 0),
    schemas: schemas.map((row) => ({ schema: String(row.schema), bytes: Number(row.bytes) })).filter((s) => s.bytes > 0),
  };
}

/** The committed height (`core_block_commit.blocks`), or null. */
export async function cursorOf(query: Query): Promise<number | null> {
  const [row] = await query("SELECT max(height) AS height FROM core_block_commit.blocks");
  return row?.height === null || row?.height === undefined ? null : Number(row.height);
}
