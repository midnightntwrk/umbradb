import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ReadHandle, ReadOnlyDatabase } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ProcessContext } from "../../src/modules/declaration.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { startTrace, stopTrace, type TraceSink } from "../../src/trace/trace.js";
import { declaration } from "../modules/declarations.js";
import {
  attachedSource,
  byPoint,
  chunksOf,
  orderOf,
  recordingStatements,
  runChunks,
  type Seen,
} from "./loop-chunk-harness.js";
import { cursorOf, heightsIn, RUNNER_BACKENDS } from "./loop-harness.js";
import { askedSource, preparingSource } from "./slow-block-harness.js";

/**
 * Chunks of blocks in one transaction in the finalized loop (`src/runner/loop.ts`, fast-sync mode), on PostgreSQL 18
 * and PGlite 0.5.10, through the in-memory source: chunks of 2, 3 and 7 over heights 1 to 20, the head 20 and the
 * distance 0, against the mode off.
 *
 * - The order of the points and of the transactions: every block of a chunk taken (`on-fetch`, `on-parse`) before its
 *   `BEGIN`; `on-start-height` and `on-compute` of its first block before the `BEGIN`; each later block's `on-compute`
 *   after the block before's writes; one `BEGIN` and one `COMMIT` per chunk; each block's `on-after-db-write` after
 *   the `COMMIT`, in height order.
 * - Each point's handle: `on-compute` at h − 1, seeing the rows of the blocks before it (written in the transaction
 *   for a later block); `on-db-write` and `on-settle` at h − 1, the run `{ h, h }`; `on-after-db-write` at the chunk's
 *   last height. `continues` as the mode off says it; `core-block-commit` compares what it keeps (`checkKept`).
 * - A module's read inside a chunk: a write through it refused, a failing query caught leaving the block stored, a read
 *   kept and used later `handle-closed`; on PGlite a `db.read` from inside a later block's `on-compute`, `on-db-write`
 *   or `on-settle` refused with `nested-call`.
 * - The finality check's stored hash of a height taken, written and committed.
 * - A source that prepares ahead: a chunk of 7 taken before its `BEGIN`; on PGlite a `db.read` at `on-parse` resolves
 *   inside the chunk's blocks, and after the `COMMIT` for a block above the open chunk.
 * - A block processed alone sends the statements of the mode off: the same texts with the same parameters in the same
 *   order, through every handle of the database API, and the same count in its trace line (PostgreSQL).
 */

const HEAD = 20n;

/** `seen` without the points whose values a chunk changes by design (`on-after-db-write`'s height and rows). */
const unchanged = (seen: readonly Seen[]): Seen[] => seen.filter((entry) => entry.point !== "on-after-db-write");

describe.each(RUNNER_BACKENDS)("chunks in the finalized loop on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  const pglite = backend.name.startsWith("PGlite");

  for (const blocks of [2, 3, 7]) {
    it(`chunks of ${blocks}: the points, the transactions and each handle, as the mode off but for on-after-db-write`, async () => {
      const off = await runChunks(backend, { head: HEAD });
      const on = await runChunks(backend, { head: HEAD, blocks });
      const chunks = chunksOf(blocks, HEAD);
      expect(off.order).toEqual(orderOf(chunksOf(1, HEAD), HEAD));
      expect(on.order).toEqual(orderOf(chunks, HEAD));
      // One transaction for each chunk, and the one of the read before the first.
      expect(on.order.filter((mark) => mark === "BEGIN")).toHaveLength(chunks.length + 1);
      // Every point and height once, with the same handles, rows seen and continues, but for on-after-db-write.
      const offPoints = byPoint(unchanged(off.seen));
      const onPoints = byPoint(unchanged(on.seen));
      expect([...onPoints.keys()].sort()).toEqual([...offPoints.keys()].sort());
      for (const [key, entries] of offPoints) expect(onPoints.get(key), key).toEqual(entries);
      // on-compute at h - 1, seeing h - 1; continues at every height but the first.
      for (let h = 1n; h <= HEAD; h++) {
        const before = h === 1n ? null : h - 1n;
        expect(onPoints.get(`on-compute@${h}`), `on-compute@${h}`).toEqual([
          { point: "on-compute", height: h, readHeight: before, sees: before, continues: h > 1n },
        ]);
        expect(onPoints.get(`on-db-write@${h}`)).toEqual([
          { point: "on-db-write", height: h, readHeight: before, sees: before, continues: h > 1n },
        ]);
        expect(onPoints.get(`on-settle@${h}`)).toEqual([{ point: "on-settle", height: h, run: `${h}-${h}`, readHeight: before }]);
      }
      // on-after-db-write: each block once, after the COMMIT, its read at the chunk's last height.
      const after = byPoint(on.seen.filter((entry) => entry.point === "on-after-db-write"));
      for (const [first, last] of chunks) {
        for (let h = first; h <= last; h++) {
          expect(after.get(`on-after-db-write@${h}`), `on-after-db-write@${h}`).toEqual([
            { point: "on-after-db-write", height: h, readHeight: last, sees: last, continues: h > 1n },
          ]);
        }
      }
      expect(await heightsIn(on.db, "r.rows")).toEqual(await heightsIn(off.db, "r.rows"));
      expect(await cursorOf(on.db)).toBe(HEAD);
    }, 120_000);
  }

  it("a module's read inside a chunk: a write refused, a failing query caught leaves the block stored, a kept read handle-closed", async () => {
    /** What the module saw at each height: its write's error code, the read after its caught failure, the kept read's error. */
    const outcomes = async (blocks: number | undefined) => {
      const seen: string[] = [];
      let kept: ReadHandle | undefined;
      const w = declaration("w", {
        points: {
          async "on-compute"(_p, b: BlockContext, read: ReadHandle) {
            const write = await read.query("INSERT INTO w.rows (height) VALUES ($1)", [b.height]).then(
              () => "written",
              (error: unknown) => (error instanceof UmbraError ? String(error.details.sqlstate ?? error.code) : "other"),
            );
            const caught = await read.query("SELECT 1 / 0").then(
              () => "answered",
              () => "failed",
            );
            seen.push(`${b.height} ${write} ${caught}`);
            kept = read;
          },
          async "on-db-write"(_p, b: BlockContext) {
            const late = await (kept as ReadHandle).query("SELECT 1").then(
              () => "answered",
              (error: unknown) => (error instanceof UmbraError ? error.code : "other"),
            );
            seen.push(`${b.height} kept ${late}`);
          },
        },
      });
      const run = await runChunks(backend, { head: 6n, modules: [w], ...(blocks === undefined ? {} : { blocks }) });
      expect(await cursorOf(run.db)).toBe(6n);
      expect(await heightsIn(run.db, "w.rows")).toEqual([]);
      return seen;
    };
    const off = await outcomes(undefined);
    expect(off.filter((line) => line.includes("kept"))).toEqual([1n, 2n, 3n, 4n, 5n, 6n].map((h) => `${h} kept handle-closed`));
    expect(off.filter((line) => !line.includes("kept"))).toEqual([1n, 2n, 3n, 4n, 5n, 6n].map((h) => `${h} 25006 failed`));
    expect(await outcomes(3)).toEqual(off);
  }, 120_000);

  it("continues and core-block-commit's kept hash per block, and the stored hash of a height taken, written and committed", async () => {
    const memory = { attached: undefined as ReturnType<typeof attachedSource> | undefined };
    const hex = (bytes: Uint8Array | null): string | null => (bytes === null ? null : Buffer.from(bytes).toString("hex"));
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let reached!: () => void;
    const atGate = new Promise<void>((resolve) => {
      reached = resolve;
    });
    const running = runChunks(backend, {
      head: 14n,
      blocks: 7,
      source: (inner) => {
        memory.attached = attachedSource(inner);
        return memory.attached.source;
      },
      recorder: {
        // Chunk 8..14 is open at block 9's writes: 8 written, 12 taken, 7 committed.
        async at(point, height) {
          if (point !== "on-db-write" || height !== 9n) return;
          reached();
          await gate;
        },
      },
    });
    await atGate;
    const runner = (memory.attached as ReturnType<typeof attachedSource>).runner();
    // 12 taken and not begun, 8 written in the open transaction: answered from the blocks taken, at once.
    const asked = [12n, 8n, 7n].map((height) => runner.storedHash(height).then(hex));
    expect(await Promise.all(asked.slice(0, 2))).toEqual([hex(inMemoryBlock(12n).hash), hex(inMemoryBlock(8n).hash)]);
    // 7, committed, is read from the database: on PGlite once the open chunk's COMMIT answered.
    release();
    const run = await running;
    expect(await Promise.all(asked)).toEqual([12n, 8n, 7n].map((h) => hex(inMemoryBlock(h).hash)));
    const points = byPoint(run.seen);
    for (let h = 1n; h <= 14n; h++) {
      for (const point of ["on-compute", "on-db-write", "on-after-db-write"]) {
        expect(points.get(`${point}@${h}`)?.[0]?.continues, `${point}@${h}`).toBe(h > 1n);
      }
    }
  }, 120_000);

  it.runIf(pglite)("on PGlite a db.read inside on-compute, on-db-write and on-settle of a block after a chunk's first is nested-call", async () => {
    const reasons: string[] = [];
    const tryRead = async (p: ProcessContext, label: string): Promise<void> => {
      const item = p.items.get("db") as ReadOnlyDatabase;
      const outcome = await item.read(async (read) => read.height).then(
        (height) => `read ${height}`,
        (error: unknown) => (error instanceof UmbraError ? String(error.details.reason) : "other"),
      );
      reasons.push(`${label} ${outcome}`);
    };
    const n = declaration("n", {
      points: {
        async "on-compute"(p, b: BlockContext) {
          await tryRead(p, `on-compute@${b.height}`);
        },
        async "on-db-write"(p, b: BlockContext) {
          await tryRead(p, `on-db-write@${b.height}`);
        },
        async "on-settle"(p, run) {
          await tryRead(p, `on-settle@${run.first}`);
        },
      },
    });
    await runChunks(backend, { head: 3n, blocks: 3, modules: [n], dbItem: "n" });
    expect(reasons).toEqual([
      "on-compute@1 nested-call",
      "on-db-write@1 nested-call",
      "on-settle@1 nested-call",
      "on-compute@2 nested-call",
      "on-db-write@2 nested-call",
      "on-settle@2 nested-call",
      "on-compute@3 nested-call",
      "on-db-write@3 nested-call",
      "on-settle@3 nested-call",
    ]);
  }, 120_000);

  it("a source that prepares ahead: a chunk of 7 taken before its BEGIN; a db.read at on-parse resolves within the chunk, and after the COMMIT above it on PGlite", async () => {
    const parsed: string[] = [];
    const order: string[] = [];
    const p = declaration("p", {
      points: {
        async "on-parse"(context: ProcessContext, b: BlockContext) {
          const db = context.items.get("db") as ReadOnlyDatabase;
          // Above the first chunk: read once its transaction is open (the second BEGIN: the first is the read's that
          // says a chunk may form).
          if (b.height > 7n && b.height <= 10n) while (order.filter((mark) => mark === "BEGIN").length < 2) await new Promise((resolve) => setTimeout(resolve, 5));
          const height = await db.read(async (read) => read.height);
          parsed.push(`parse@${b.height} read ${height} after ${order.filter((mark) => mark === "COMMIT").length} commits`);
        },
      },
    });
    const run = await runChunks(backend, {
      head: HEAD,
      blocks: 7,
      modules: [p],
      dbItem: "p",
      order,
      source: (memory) => preparingSource(askedSource(HEAD, memory), 4).source,
    });
    // The first chunk's blocks were all taken before its BEGIN, their reads answered then: nothing was stored yet, and
    // at most the transaction of the read before the chunk had committed.
    const begin = run.order.indexOf("BEGIN", run.order.indexOf("BEGIN") + 1);
    expect(begin).toBeGreaterThan(0);
    for (let h = 1n; h <= 7n; h++) expect(run.order.indexOf(`on-parse@${h}`), `on-parse@${h}`).toBeLessThan(begin);
    for (let h = 1n; h <= 7n; h++) expect(parsed.find((line) => line.startsWith(`parse@${h} `))).toMatch(/ read null after [01] commits$/);
    for (let h = 8n; h <= 10n; h++) {
      const line = parsed.find((entry) => entry.startsWith(`parse@${h} `));
      // On PGlite the read waits for the open chunk's COMMIT; on PostgreSQL it reads what is committed, at once.
      if (pglite) expect(line, `parse@${h}`).toBe(`parse@${h} read 7 after 2 commits`);
      else expect(line, `parse@${h}`).toMatch(/^parse@\d+ read (null|7) after [12] commits$/);
    }
    expect(await cursorOf(run.db)).toBe(HEAD);
  }, 120_000);

  it("a block processed alone sends the statements of the mode off: the same texts with the same parameters, in the same order, at each such height", async () => {
    /** A run's points, transaction marks and statements in the order they happened, and each trace line's statement count by height. */
    const recorded = async (blocks: number | undefined): Promise<{ order: string[]; sqlN: Map<number, number | undefined> }> => {
      const order: string[] = [];
      const lines: string[] = [];
      const sink: TraceSink = { blocks: (text) => void lines.push(text), statements: () => undefined, worker: () => undefined };
      startTrace(sink);
      try {
        await runChunks(backend, {
          head: HEAD,
          order,
          database: (db) => recordingStatements(db, order),
          ...(blocks === undefined ? {} : { blocks, distance: 5 }),
        });
      } finally {
        stopTrace();
      }
      const parsed = lines.flatMap((text) => text.trimEnd().split("\n")).map((line) => JSON.parse(line) as { h: number; sqlN?: number });
      return { order, sqlN: new Map(parsed.map((line) => [line.h, line.sqlN])) };
    };
    const off = await recorded(undefined);
    const on = await recorded(7);
    // Chunks 1..7 and 8..14; 15 to 20 are within 5 of the head, each alone: from 15's first point on, the two runs send
    // the same statements, between the same points and the same BEGINs and COMMITs.
    const alone = (order: readonly string[]): string[] => order.slice(order.indexOf("on-fetch@15"));
    expect(alone(on.order)).toEqual(alone(off.order));
    const statements = alone(on.order).filter((entry) => entry.startsWith("sql "));
    // Each of the six heights: a read at on-compute, its writes and the cursor check in its transaction, a read after.
    expect(statements.filter((entry) => entry.startsWith("sql tx ")).length).toBeGreaterThanOrEqual(6 * 3);
    expect(statements.filter((entry) => entry.startsWith("sql read ")).length).toBeGreaterThanOrEqual(6 * 2);
    expect(statements.some((entry) => entry.includes("INSERT INTO r.rows (height) VALUES ($1) [\"20n\"]"))).toBe(true);
    // Inside the chunks the runs differ: the mode on sends the block's end between two blocks of a chunk.
    expect(on.order.slice(0, on.order.indexOf("on-fetch@15"))).not.toEqual(off.order.slice(0, off.order.indexOf("on-fetch@15")));
    // And, where the backend traces statements, the same number of them in each such height's line, the BEGIN and the
    // COMMIT among them.
    for (let h = 15; h <= 20; h++) expect(on.sqlN.get(h), `height ${h}`).toBe(off.sqlN.get(h));
  }, 120_000);
});
