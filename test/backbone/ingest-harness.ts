import { setTimeout as sleep } from "node:timers/promises";
import { z } from "zod";
import { type BodyExtrinsic, NodeBlockSource, nodeSourceOf } from "../../src/backbone/core-block-fetch/index.js";
import type { RuntimeMetadataEntry } from "../../src/ledger/metadata.js";
import type { BlockHeader, ModuleDeclaration } from "../../src/modules/declaration.js";
import type { NodeClient } from "../../src/node/client.js";
import { type ProcessHandle, type SourceShared, startProcess } from "../../src/runner/process.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { core, entryOf } from "../runner/process-build.js";
import { chainDeclarations } from "./chain-build.js";
import { hex } from "./fetch-fixtures.js";

/**
 * Runs the real process over the node source against a tape node (task 10.3): `startProcess` with UmbraDB's backbone —
 * `core-chain`, the real `core-block-fetch` and its node source (what `umbradb run` passes: `nodeSourceOf`),
 * `core-block-commit`, `core-digest` — and a watching module, its `core` entry's `node` the tape node's URL. Imports
 * nothing of Vitest, so that a worker process (`ingest-crash.worker.ts`) runs the same build.
 */

/** What the watching module saw, in order. */
export interface Watched {
  /** `on-best-block` and `on-rollback`, as `best 101 <hash>`, `rollback 101 <hash>,102 <hash>`. */
  readonly queue: string[];
  /** Each `on-rollback`'s blocks. */
  readonly rollbacks: (readonly BlockHeader[])[];
  /** `on-parse` at each height: the body's calls, the metadata's spec version, and the block's hash. */
  readonly parsed: { readonly height: bigint; readonly hash: string; readonly specVersion: number; readonly calls: string[] }[];
  /** `on-db-write` heights, in order. */
  readonly written: bigint[];
  /** `on-finalized` heads, in order. */
  readonly finalized: bigint[];
}

export function watched(): Watched {
  return { queue: [], rollbacks: [], parsed: [], written: [], finalized: [] };
}

const short = (hash: Uint8Array): string => hex(hash).slice(0, 10);

/** The watching module `watch` (see the module comment): requires `block-body` and `runtime-metadata` (CD-2). */
export function watcher(seen: Watched): ModuleDeclaration {
  return {
    id: "watch",
    version: "1.0.0",
    side: "public",
    requires: ["block-header", "block-body", "runtime-metadata"],
    provides: [{ name: "watch-rows", lifetimes: ["table"], table: { schema: "watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE watch.rows (height bigint PRIMARY KEY, hash bytea NOT NULL)" }],
    points: {
      async "on-best-block"(_p, header) {
        seen.queue.push(`best ${header.height} ${short(header.hash)}`);
      },
      async "on-rollback"(_p, dropped) {
        seen.rollbacks.push(dropped);
        seen.queue.push(`rollback ${dropped.map((block) => `${block.height} ${short(block.hash)}`).join(",")}`);
      },
      async "on-finalized"(_p, head) {
        seen.finalized.push(head.height);
      },
      async "on-parse"(_p, b) {
        const body = b.items.get("block-body") as { readonly extrinsics: readonly BodyExtrinsic[] };
        const metadata = b.items.get("runtime-metadata") as RuntimeMetadataEntry;
        seen.parsed.push({
          height: b.height,
          hash: hex(b.hash),
          specVersion: metadata.specVersion,
          calls: body.extrinsics.map((e) => (e.call === null ? "signed" : `${e.call.pallet}.${e.call.call}`)),
        });
      },
      async "on-db-write"(_p, b, w) {
        seen.written.push(b.height);
        await w.execute("INSERT INTO watch.rows (height, hash) VALUES ($1, $2)", [b.height, b.hash]);
      },
    },
  };
}

/** A call record a test module makes after a commit (`fenceAt`): the notifications after it wait for it (TT-3). */
export const FENCE: TapeRecord = { method: "chain_getBlockHash", params: [999_999], result: hex(new Uint8Array(32).fill(9)) };

/** A module whose `on-after-db-write` at `height` makes the {@link FENCE} call through the `node-client` item. */
export function fenceAt(height: bigint): ModuleDeclaration {
  return {
    id: "fence",
    version: "1.0.0",
    side: "public",
    requires: ["node-client", "block-header"],
    provides: [{ name: "fence-rows", lifetimes: ["table"], table: { schema: "fence", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE fence.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-after-db-write"(p, b) {
        if (b.height === height) await (p.items.get("node-client") as NodeClient).blockHash(999_999n);
      },
    },
  };
}

/**
 * A module whose `on-compute` waits `ms` at every height (no database work), so that the loop is slower than the
 * prefetch and a window is reached on every backend (on PGlite the engine's work otherwise holds the event loop the tape
 * node shares, and the prefetch does not get far ahead).
 */
export function slow(ms: number): ModuleDeclaration {
  return {
    id: "slow",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "slow-rows", lifetimes: ["table"], table: { schema: "slow", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE slow.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"() {
        await sleep(ms);
      },
    },
  };
}

/** A node source class: the real one, or a negative control's. */
export type SourceClass = typeof NodeBlockSource;

/** What {@link ingest} takes. */
export interface IngestOptions {
  /** S. */
  readonly start: bigint;
  /** More `core` settings (`prefetchWindow`, `tipCap`, …). */
  readonly settings?: Readonly<Record<string, unknown>>;
  /** The node source's class (a negative control's), or a factory wrapping the process's client (an instrument). */
  readonly Source?: SourceClass;
  readonly client?: (client: NodeClient) => NodeClient;
  /** More user modules. */
  readonly user?: readonly ModuleDeclaration[];
  /** Core modules of the build, each enabled from S (task 11.1's). */
  readonly core?: readonly ModuleDeclaration[];
}

/** A process over a tape node. */
export interface Ingest {
  readonly handle: ProcessHandle;
  readonly node: TapeNode;
  readonly seen: Watched;
  readonly lines: string[];
  /** Stops the process, then the tape node. */
  close(): Promise<void>;
}

/** Starts the process on `db` from S over a tape node serving `records` (see the module comment). */
export async function ingest(db: ProcessDatabase, records: readonly TapeRecord[], options: IngestOptions): Promise<Ingest> {
  const node = await TapeNode.start({ records });
  const seen = watched();
  const user = [watcher(seen), ...(options.user ?? [])];
  const entries = [
    core(db.setting, Number(options.start), { extra: { node: node.url, ...options.settings } }),
    ...[...(options.core ?? []), ...user].map((module) => entryOf(module, Number(options.start))),
  ];
  const lines: string[] = [];
  const Source = options.Source ?? NodeBlockSource;
  const handle = startProcess({
    declarations: chainDeclarations(user, { core: options.core ?? [] }),
    config: { data: { entries } },
    source: (entry, shared: SourceShared) => {
      if (Source === NodeBlockSource && options.client === undefined) return nodeSourceOf(entry, shared);
      const settings = entry.settings as { readonly prefetchWindow: number; readonly tipCap: number };
      const client = options.client === undefined ? (shared.nodeClient as NodeClient) : options.client(shared.nodeClient as NodeClient);
      return new Source({ client, prefetchWindow: settings.prefetchWindow, tipCap: settings.tipCap });
    },
    log: (line) => lines.push(line),
  });
  return {
    handle,
    node,
    seen,
    lines,
    async close() {
      try {
        await handle.stop();
      } finally {
        await node.close();
      }
    },
  };
}

/** How long a process may take to reach a state on a loaded machine. */
export const PATIENCE_MS = 240_000;

/** Waits until `check` holds — failing early with the process's end when it ended — or fails after `patience`. */
export async function until(
  run: Ingest,
  check: () => boolean,
  what: string,
  patience: number = PATIENCE_MS,
): Promise<void> {
  const deadline = Date.now() + patience;
  while (!check()) {
    const status = run.handle.status();
    if (status.ended !== null && !check()) {
      throw new Error(`the process ended before ${what}: ${JSON.stringify(status, bigintText)}; log ${run.lines.join(" | ")}`);
    }
    if (Date.now() > deadline) {
      throw new Error(`timed out waiting for ${what}: ${JSON.stringify(status, bigintText)}; log ${run.lines.join(" | ")}`);
    }
    await sleep(10);
  }
}

/** Waits until the process's cursor is `height`. */
export function committed(run: Ingest, height: bigint, patience?: number): Promise<void> {
  return until(run, () => run.handle.status().cursor === height, `the cursor at ${height}`, patience);
}

/** Waits until the process halted (or ended otherwise). */
export function halted(run: Ingest): Promise<void> {
  return until(run, () => run.handle.status().state === "halted", "a halt");
}

/** A JSON replacer writing bigints as text. */
export const bigintText = (_key: string, value: unknown): unknown => (typeof value === "bigint" ? `${value}` : value);
