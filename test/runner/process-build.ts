import { z } from "zod";
import { CORE_CHAIN, coreChainStartDb } from "../../src/backbone/core-chain/index.js";
import { coreEntry } from "../../src/config/entries.js";
import type { HistoryOptions } from "../../src/config/history.js";
import type { BlockContext, ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import type { DeclarationSet } from "../../src/modules/validation.js";
import type { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { ProcessHandle, ProcessingEnd } from "../../src/runner/process.js";
import { LOOP_BACKBONE } from "./loop-harness.js";

/**
 * A build for the process's tests (task 5.3; RN-7, RN-9–RN-13, CF-3, CF-4, Q102): the test backbone of
 * `loop-harness.ts` — the real `core-block-commit`, stand-ins for `core-block-fetch` and `core-digest` — with the real
 * `core-chain` (task 10.2), which the runner binds to its process context: its migrations create `core_chain.config`
 * and `core_chain.identity`, its `on-start-db` records the configuration history (CF-6, with `options.history` — a
 * negative control's `recordedData` — when given) and the identity and publishes its four process items, its
 * `on-db-write` records the anchor at S. The build adds to it the recording of its start and stop notifications, and of
 * its settings at each height, which are the `core` entry's (Q102: operational fields from the process's revision, data
 * fields from the revision covering the height).
 *
 * Imports nothing of Vitest, so that a worker process (`sigterm.worker.ts`) builds the same declarations.
 */

/** What the `core-chain` stand-in saw. */
export interface CoreSeen {
  /** Its `on-start-height` and `on-stop-height`: `"on-stop-height@10 core"`. */
  readonly calls: string[];
  /** Its block context's settings at each height's `on-compute`. */
  readonly settings: Map<bigint, Readonly<Record<string, unknown>>>;
}

/** A build: the declarations, and what `core-chain` saw. */
export interface TestBuild {
  readonly declarations: DeclarationSet;
  readonly core: CoreSeen;
}

/** Options of {@link testBuild}. */
export interface TestBuildOptions {
  /** Core modules of the build. */
  readonly core?: readonly ModuleDeclaration[];
  /** `checkHistory`'s options for `core-chain`'s recording (a negative control's `recordedData`). */
  readonly history?: HistoryOptions;
  /** A log every recording part of the build appends to, in order (also `core-chain`'s notifications). */
  readonly log?: string[];
  /** Replaces a backbone part of the build (a test's failing `core-block-commit`); each part unchanged unless given. */
  readonly backbone?: (part: ModuleDeclaration) => ModuleDeclaration;
}

/** A build of the test backbone with `user` modules (see the module comment). */
export function testBuild(user: readonly ModuleDeclaration[], options: TestBuildOptions = {}): TestBuild {
  const core: CoreSeen = { calls: [], settings: new Map() };
  const note = (point: PointName, e: { readonly entryId: string; readonly height: bigint }) => {
    const line = `${point}@${e.height} ${e.entryId}`;
    core.calls.push(line);
    options.log?.push(`core-chain ${line}`);
  };
  const chain: ModuleDeclaration = {
    ...CORE_CHAIN,
    points: {
      ...CORE_CHAIN.points,
      async "on-start-db"(p, w) {
        await coreChainStartDb(p, w, options.history === undefined ? {} : { history: options.history });
      },
      async "on-start-height"(_p, e) {
        note("on-start-height", e);
      },
      async "on-compute"(_p, b) {
        core.settings.set(b.height, b.settings);
      },
      async "on-stop-height"(_p, e) {
        note("on-stop-height", e);
      },
    },
  };
  const replace = options.backbone ?? ((part: ModuleDeclaration) => part);
  const backbone = LOOP_BACKBONE.map((part) => replace(part.id === "core-chain" ? chain : part));
  return { declarations: { backbone, core: options.core ?? [], user }, core };
}

/** The `core` entry's settings for a process on `database`: a public process on preprod, with the development opt-in. */
export function coreSettings(database: string, extra: Readonly<Record<string, unknown>> = {}): Record<string, unknown> {
  return { network: "preprod", database, node: "ws://127.0.0.1:9/node", developmentOptIn: true, ...extra };
}

/** A `core` entry from `start`: `coreEntry` with {@link coreSettings}. */
export function core(database: string, start = 1, rest: { readonly stop?: number; readonly extra?: Readonly<Record<string, unknown>> } = {}) {
  return coreEntry({
    start,
    ...(rest.stop === undefined ? {} : { stop: rest.stop }),
    config: coreSettings(database, rest.extra) as never,
  });
}

/** A module whose callbacks append `<id> <point>@<height>` to `log`, for the points given; `rest` as `defineModule`'s. */
export function loggingModule(
  id: string,
  log: string[],
  points: readonly PointName[],
  rest: Partial<ModuleDeclaration> = {},
): ModuleDeclaration {
  const schema = id.replaceAll("-", "_");
  const callbacks: Record<string, (...args: unknown[]) => Promise<void>> = {};
  for (const point of points) {
    callbacks[point] = async (_p: unknown, ...args: unknown[]) => {
      const first = args[0] as { readonly height: bigint } | undefined;
      log.push(`${id} ${point}@${first?.height}`);
      if (point === "on-db-write") {
        const [b, w] = args as [BlockContext, { execute(sql: string, params: unknown[]): Promise<number> }];
        await w.execute(`INSERT INTO ${schema}.rows (height) VALUES ($1)`, [b.height]);
      }
    };
  }
  return {
    id,
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: `${id}-rows`, lifetimes: ["table"], table: { schema, tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({ pollMs: z.number().int().default(1).meta({ kind: "operational" }) }),
    migrations: [{ id: "001", sql: `CREATE TABLE ${schema}.rows (height bigint PRIMARY KEY)` }],
    points: callbacks as ModuleDeclaration["points"],
    ...rest,
  };
}

/**
 * Waits until `handle` started and its loop waits for a head above `head` (`"waiting"`), or its processing ended (how);
 * rejects with a startup's refusal.
 */
export async function settle(
  handle: ProcessHandle,
  source: InMemoryBlockSource,
  head: bigint,
): Promise<"waiting" | ProcessingEnd> {
  await handle.started;
  return Promise.race([source.waiting(head).then(() => "waiting" as const), handle.ended]);
}

/** A module entry of `declaration` as plain data: its id and version, `start`, `stop` and `config`. */
export function entryOf(
  declaration: Pick<ModuleDeclaration, "id" | "version">,
  start: number,
  config: Readonly<Record<string, unknown>> = {},
  stop?: number,
): Record<string, unknown> {
  return { id: declaration.id, start, ...(stop === undefined ? {} : { stop }), version: declaration.version, config };
}
