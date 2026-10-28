import { z } from "zod";
import { CORE_BLOCK_FETCH } from "../../src/backbone/core-block-fetch/index.js";
import { CORE_CHAIN, coreChainStartDb } from "../../src/backbone/core-chain/index.js";
import { coreEntry } from "../../src/config/entries.js";
import type { HistoryOptions } from "../../src/config/history.js";
import type { BlockContext, ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import type { DeclarationSet } from "../../src/modules/validation.js";
import { builtInLedgerTable } from "../../src/ledger/networks.js";
import type { LedgerTable } from "../../src/ledger/version-table.js";
import { type InMemoryBlockSource, inMemoryBlock } from "../../src/runner/in-memory-source.js";
import {
  type ProcessHandle,
  type ProcessingEnd,
  type ProcessInput,
  startProcess as startRunnerProcess,
} from "../../src/runner/process.js";
import { LOOP_BACKBONE } from "./loop-harness.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";

/**
 * A build for the process's tests (task 5.3; RN-7, RN-9–RN-13, CF-3, CF-4, Q102): the test backbone of
 * `loop-harness.ts` — the real `core-block-commit`, a stand-in for `core-digest` — with the real `core-block-fetch`
 * (task 10.3: the runner binds it to the process's block source, whose items it puts) and the real `core-chain` (task
 * 10.2), which the runner binds to its process context: its migrations create `core_chain.config`
 * and `core_chain.identity`, its `on-start-db` records the configuration history (CF-6, with `options.history` — a
 * negative control's `recordedData` — when given) and the identity and publishes its four process items, its
 * `on-db-write` records the anchor at S. The build adds to it the recording of its start and stop notifications, and of
 * its settings at each height, which are the `core` entry's (Q102: operational fields from the process's revision, data
 * fields from the revision covering the height).
 *
 * Imports nothing of Vitest, so that a worker process (`sigterm.worker.ts`) builds the same declarations.
 */

/**
 * The runner's `startProcess` for the tests that start a process: without the admin endpoints unless the test asks
 * for them with `admin`. The runner serves them by default (AE-1; owner decision Q128 B, task 8.1a) on `listen.admin`,
 * CF-4's `0.0.0.0:8081` unless configured, and test processes run in parallel on a shared machine: each opts out here,
 * or asks for them and listens on a port of its own (`127.0.0.1:0`, as `test/admin/admin-harness.ts` does). A test
 * outside `test/admin/` that takes the runner's own fails `test/admin/test-processes.test.ts`.
 */
export function startProcess(input: ProcessInput): ProcessHandle {
  return startRunnerProcess({ ...input, admin: input.admin ?? false });
}

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
  const real = (part: ModuleDeclaration): ModuleDeclaration =>
    part.id === "core-chain" ? chain : part.id === "core-block-fetch" ? CORE_BLOCK_FETCH : part;
  const backbone = LOOP_BACKBONE.map((part) => replace(real(part)));
  return { declarations: { backbone, core: options.core ?? [], user }, core };
}

/**
 * The tests' network (task 10.2a; IN-3, decision records Q117, Q120): `custom`, its genesis hash the in-memory chain's
 * block 0 ({@link inMemoryBlock}), so the configured genesis and the chain's agree, and its own ledger table:
 * LG-3's rows for runtimes 0.22 and 1.0 (v8), as the built-in tables hold them, so such a block's ledger is what it
 * was on `preprod`, and every runtime 2.x on v9 (rc.5), the release the tests' synthetic v9 transactions are built
 * and checked with. The built-in tables map runtime 2.0 to `v9-rc3` since task 12.2a (owner decision Q139 A), whose
 * package is tested on stagenet's own blocks (`test/ledger/ledger-v9-rc3.test.ts`, and the stagenet tape in
 * `test/backbone/ledger-state.test.ts`).
 */
export const TEST_GENESIS = `0x${Buffer.from(inMemoryBlock(0n).hash).toString("hex")}`;
const TEST_NETWORK = Object.freeze({
  network: "custom",
  genesisHash: TEST_GENESIS,
  ledgerTable: {
    rows: [
      ...(builtInLedgerTable("mainnet") as LedgerTable).rows
        .filter((row) => row.specVersionMax < 2_000_000)
        .map((row) => ({ ...row })),
      { specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" },
    ],
  },
});

/**
 * The `core` entry's settings for a process on `database`: a public process on the tests' network ({@link TEST_GENESIS};
 * `extra` naming another network replaces it), with the development opt-in.
 */
export function coreSettings(database: DatabaseParts, extra: Readonly<Record<string, unknown>> = {}): Record<string, unknown> {
  const network = extra.network === undefined || extra.network === "custom" ? TEST_NETWORK : {};
  return { ...network, database, node: "ws://127.0.0.1:9/node", developmentOptIn: true, ...extra };
}

/** A `core` entry from `start`: `coreEntry` with {@link coreSettings}. */
export function core(database: DatabaseParts, start = 1, rest: { readonly stop?: number; readonly extra?: Readonly<Record<string, unknown>> } = {}) {
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
