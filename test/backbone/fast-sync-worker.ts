import type { ReadHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { LedgerName } from "../../src/ledger/types.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightRun, type LoopInput, type ReadOpener } from "../../src/runner/loop.js";
import type { ScheduleOptions } from "../../src/runner/dispatch.js";
import { z } from "zod";

/**
 * What the tests of the ledger worker across chunks share (`fast-sync-worker*.test.ts`), through the real process on
 * the DAG fixture (`./refcount-process.ts`). Imports nothing of Vitest.
 */

/** The chunk setting of `blocks`, distance 0, with the copy of the counts verifying every key it answers. */
export const chunked = (blocks: number): Readonly<Record<string, unknown>> => ({
  fastSync: { blocks, distance: 0 },
  reclamationCache: { verify: true },
  backoffCeilingMs: 20,
});

/** The settings of the mode off, with the same copy verification and back-off. */
export const PLAIN: Readonly<Record<string, unknown>> = { reclamationCache: { verify: true }, backoffCeilingMs: 20 };

/** `host` with each call of the loop's facts and of the ledger's requests also logged: `apply 3`, `committed 3`, … */
export function loggingHost(host: LedgerHost, log: string[]): LedgerHost {
  const logged = new Set(["apply", "load", "genesis", "committed", "rolledBack", "restart", "parse"]);
  return new Proxy(host, {
    get(target, name, receiver) {
      const value = Reflect.get(target, name, receiver) as unknown;
      if (typeof name !== "string" || !logged.has(name) || typeof value !== "function") return value;
      return (...args: unknown[]) => {
        const first = args[0] as { readonly height?: bigint; readonly input?: { readonly height: bigint } } | string | undefined;
        const height = typeof first === "object" && first !== null && "height" in first ? first.height : name === "parse" ? (args[1] as { height: bigint }).height : undefined;
        log.push(height === undefined ? name : `${name} ${height}`);
        return (value as (...a: unknown[]) => unknown).apply(target, args);
      };
    },
  });
}

/**
 * The groups of `committed` facts in `log`, each a list of heights told one after another with no request between;
 * with the problems found: a height told twice, or told before its own apply or genesis.
 */
export function commitGroups(log: readonly string[]): { readonly groups: bigint[][]; readonly problems: string[] } {
  const groups: bigint[][] = [];
  const problems: string[] = [];
  const told = new Set<bigint>();
  const applied = new Set<bigint>();
  let current: bigint[] | null = null;
  for (const entry of log) {
    const [name, text] = entry.split(" ");
    if (text === undefined) continue;
    const height = BigInt(text);
    if (name === "apply" || name === "genesis") applied.add(height);
    if (name !== "committed") {
      if (name !== "rolledBack") current = null;
      continue;
    }
    if (told.has(height)) problems.push(`committed ${height} told twice`);
    if (!applied.has(height)) problems.push(`committed ${height} told before its apply`);
    told.add(height);
    if (current === null) {
      current = [];
      groups.push(current);
    }
    current.push(height);
  }
  return { groups, problems };
}

/** Module `fault`: at `on-db-write` of `at`, a lost connection once (retryable). */
export function faultAt(at: bigint): ModuleDeclaration {
  let fired = false;
  return {
    id: "fault",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "fault-rows", lifetimes: ["table"], table: { schema: "fault", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE fault.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-db-write"(_p, b: BlockContext, w) {
        await w.execute("INSERT INTO fault.rows (height) VALUES ($1)", [b.height]);
        if (b.height !== at || fired) return;
        fired = true;
        throw new UmbraError("connection-lost", `the connection was lost at height ${b.height} (the test's module)`);
      },
    },
  };
}

/** `host` that restarts its thread once, before the load of the state at `before`: a run's worker restarted there. */
export function restartingBefore(host: LedgerHost, before: bigint): LedgerHost {
  let done = false;
  return new Proxy(host, {
    get(target, name, receiver) {
      if (name !== "load") return Reflect.get(target, name, receiver) as unknown;
      return async (input: Parameters<LedgerHost["load"]>[0], read: Parameters<LedgerHost["load"]>[1]) => {
        if (!done && input.height === before) {
          done = true;
          await target.restart();
        }
        return target.load(input, read);
      };
    },
  });
}

/** `host` whose `rolledBack` is not forwarded: the restart rule off (a negative control). */
export function notTellingRollbacks(host: LedgerHost): LedgerHost {
  return new Proxy(host, {
    get(target, name, receiver) {
      if (name === "rolledBack") return () => undefined;
      return Reflect.get(target, name, receiver) as unknown;
    },
  });
}

/** What the parse case observes: the ledger a block was applied with, and the parse's outcome. */
export interface ParseProbe {
  ledger: LedgerName | undefined;
  host: LedgerHost | undefined;
  outcome: string | undefined;
}

/** `host` noting itself and the ledger of the first apply in `probe`. */
export function probing(host: LedgerHost, probe: ParseProbe): LedgerHost {
  probe.host = host;
  return new Proxy(host, {
    get(target, name, receiver) {
      if (name !== "apply") return Reflect.get(target, name, receiver) as unknown;
      return (input: Parameters<LedgerHost["apply"]>[0], read: Parameters<LedgerHost["apply"]>[1]) => {
        probe.ledger ??= input.ledger;
        return target.apply(input, read);
      };
    },
  });
}

/**
 * A loop that, inside a chunk, before `on-compute` of block `at` (a block after the chunk's first), sends the worker a
 * parse given no read, as the source's queue does for a block above the chunk, and awaits its outcome for at most
 * `limitMs` (`timeout` in `probe.outcome` past it; the worker's thread is then restarted, so the apply waiting behind
 * the parse fails and the run halts rather than waits). The test package's parse reads the node `parseReads` names,
 * then fails, saying whether it found it stored. `Base` is the loop it extends (a control's).
 */
export function parsingLoop(
  probe: ParseProbe,
  at: bigint,
  limitMs: number,
  Base: typeof FinalizedLoop = FinalizedLoop,
): new (input: LoopInput) => FinalizedLoop {
  return class ParsingLoop extends Base {
    protected override async compute(run: HeightRun, open: ReadOpener, options: ScheduleOptions = {}): Promise<void> {
      if (run.height === at && options.inSeries === true && probe.outcome === undefined && probe.host !== undefined && probe.ledger !== undefined) {
        const parsing = probe.host.parse(probe.ledger, { height: at + 100n, hash: new Uint8Array(32).fill(0xee) }, [Uint8Array.of(1)]).then(
          () => "parsed",
          (error: unknown) => (error as Error).message,
        );
        let timer: ReturnType<typeof setTimeout> | undefined;
        const limit = new Promise<string>((resolve) => {
          timer = setTimeout(() => resolve("timeout"), limitMs);
        });
        probe.outcome = await Promise.race([parsing, limit]);
        clearTimeout(timer);
        // A parse still waiting holds the worker, and the block's apply behind it: a new thread ends the wait.
        if (probe.outcome === "timeout") void probe.host.restart().catch(() => undefined);
      }
      await super.compute(run, open, options);
    }
  };
}

/** The loop reading stored nodes through its own read always, never a view of the open transaction (a control's). */
export class ReadsOnItsOwn extends FinalizedLoop {
  override read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T> {
    return this.input.db.read(body);
  }
}
