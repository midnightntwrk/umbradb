import { z } from "zod";
import type { Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import type { TransactionFollower } from "../../src/runner/transaction-follower.js";

/**
 * What the tests of a block context's `continues` and of what the loop tells the transaction's follower share
 * (`block-continues.test.ts`, its negative control, `transaction-follower.test.ts`, `writer-session.test.ts`,
 * `../backbone/host-follows.ts`):
 * - a database whose block transaction loses its `COMMIT` once armed: after the commit landed, or with the transaction
 *   rolled back ({@link losingCommits}, as `held-height.test.ts`'s), on PostgreSQL 18 and PGlite 0.5.10 alike;
 * - module `c`, which at each of its block points logs `c <point>@<h> <continues>`, and fails or arms a lost `COMMIT`
 *   as a test asks;
 * - a follower that logs `told <fact> <h>`;
 * - the values `c` logged, by `<point>@<h>` ({@link continuesOf}), and what one run of heights 1 to `head` gives
 *   ({@link continuesExpected}).
 */

/** The heights the tests run: 1 to 5, H = 3 the one whose `COMMIT` is lost. */
export const HEAD = 5n;
export const H = 3n;

/** Why a `COMMIT` is lost: after it landed, or with its transaction rolled back. */
export type LostCommit = "landed" | "lost";

/** The error a lost `COMMIT` gives. */
const lostCommit = (): UmbraError => new UmbraError("connection-lost", "the connection was lost during the COMMIT (the test's database)");

/**
 * `db`, whose next block transaction loses its `COMMIT` once armed: after the commit (`landed`), or rolled back
 * (`lost`); and whose next transaction fails before its body once `failNext` is set (a cursor read on a lost
 * connection).
 */
export function losingCommits(db: Database): {
  readonly db: Database;
  readonly state: { armed: LostCommit | undefined; failNext: boolean };
} {
  const state = { armed: undefined as LostCommit | undefined, failNext: false };
  const wrapped: Database = {
    read: (body, options) => db.read(body, options),
    async transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
      if (state.failNext) {
        state.failNext = false;
        throw new UmbraError("connection-lost", "the connection was lost before the transaction began (the test's database)");
      }
      let lost: LostCommit | undefined;
      const result = await db.transaction(async (tx) => {
        const value = await body(tx);
        lost = state.armed;
        state.armed = undefined;
        if (lost === "lost") throw lostCommit();
        return value;
      });
      if (lost === "landed") throw lostCommit();
      return result;
    },
    writerSession: () => db.writerSession(),
    close: () => db.close(),
  };
  return { db: wrapped, state };
}

/** The points of `c`: those given a block context. */
export const C_POINTS = ["on-fetch", "on-parse", "on-compute", "on-db-write", "on-after-db-write"] as const;

/** A point of `c`. */
export type CPoint = (typeof C_POINTS)[number];

/** What `c` does beyond logging. */
export interface COptions {
  /** Faults it throws once, after logging: `<point>@<h>` to the error. */
  readonly faults?: Map<string, Error>;
  /** Runs at its `on-db-write` of each height, before anything else there (a test arms a lost `COMMIT` with it). */
  readonly atWrite?: (height: bigint) => void;
  /** Awaited at its `on-compute` of each height, after logging (a test acts on the database while it runs). */
  readonly atCompute?: (height: bigint) => Promise<void>;
}

/** Module `c` over `log` (see the module comment). */
export function continuesModule(log: string[], options: COptions = {}): ModuleDeclaration {
  const at = (point: CPoint, b: BlockContext): void => {
    log.push(`c ${point}@${b.height} ${String(b.continues)}`);
    const key = `${point}@${b.height}`;
    const fault = options.faults?.get(key);
    if (fault !== undefined) {
      options.faults?.delete(key);
      throw fault;
    }
  };
  return {
    id: "c",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "c-rows", lifetimes: ["table"], table: { schema: "c", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE c.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-fetch"(_p, b) {
        at("on-fetch", b);
      },
      async "on-parse"(_p, b) {
        at("on-parse", b);
      },
      async "on-compute"(_p, b) {
        at("on-compute", b);
        await options.atCompute?.(b.height);
      },
      async "on-db-write"(_p, b, writer) {
        options.atWrite?.(b.height);
        await writer.execute("INSERT INTO c.rows (height) VALUES ($1)", [b.height]);
        at("on-db-write", b);
      },
      async "on-after-db-write"(_p, b) {
        at("on-after-db-write", b);
      },
    },
  };
}

/** A follower that logs each fact it is told: `told written <h>`, `told committed <h>`, `told rolledBack <h>`. */
export function loggingFollower(log: string[]): TransactionFollower {
  return {
    written: (block) => void log.push(`told written ${block.height}`),
    committed: (block) => void log.push(`told committed ${block.height}`),
    rolledBack: (block) => void log.push(`told rolledBack ${block.height}`),
  };
}

/** What `c` logged of `continues`, by `<point>@<h>`: each call's value, in order (undefined: a context had none). */
export function continuesOf(log: readonly string[]): Record<string, (boolean | undefined)[]> {
  const seen: Record<string, (boolean | undefined)[]> = {};
  for (const entry of log) {
    const match = /^c (\S+@\d+) (true|false|undefined)$/.exec(entry);
    if (match === null) continue;
    const key = match[1] as string;
    (seen[key] ??= []).push(match[2] === "undefined" ? undefined : match[2] === "true");
  }
  return seen;
}

/**
 * What one run of heights 1 to `head` gives, each point once (`[false]` at `on-fetch` and `on-parse`, and at height 1;
 * `[true]` at the other points of the others), with `given` replacing what a test changes.
 */
export function continuesExpected(head: bigint, given: Record<string, boolean[]> = {}): Record<string, boolean[]> {
  const expected: Record<string, boolean[]> = {};
  for (let height = 1n; height <= head; height++) {
    for (const point of C_POINTS) {
      const key = `${point}@${height}`;
      expected[key] = given[key] ?? [point !== "on-fetch" && point !== "on-parse" && height > 1n];
    }
  }
  return expected;
}

/** Where `got` and `expected` differ, one line per `<point>@<h>`; empty when they agree. */
export function continuesProblems(got: Record<string, (boolean | undefined)[]>, expected: Record<string, boolean[]>): string[] {
  const text = (values: readonly (boolean | undefined)[] | undefined): string => `[${(values ?? []).map(String).join(",")}]`;
  const keys = [...new Set([...Object.keys(expected), ...Object.keys(got)])];
  return keys.filter((key) => text(got[key]) !== text(expected[key])).map((key) => `${key}: ${text(got[key])}, not ${text(expected[key])}`);
}
