import { existsSync } from "node:fs";
import { createServer, type Server } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ChainCheck, ChainCheckInput } from "../../src/backbone/core-chain/index.js";
import type { NodeClient, NodeClientOptions } from "../../src/node/client.js";
import { engineInputOf, startUmbraDB, type UmbraDBHandle } from "../../src/library/start-umbradb.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { ProcessHandle } from "../../src/runner/process.js";
import { privateCoreEntry } from "../private/builds.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { startProcess } from "../runner/process-build.js";
import { cursorReaches, libraryData, PGLITE_MEMORY, rowsModule } from "./library-fixtures.js";

/**
 * A host's in-memory chain, `startUmbraDB`'s `source` (`src/library/options.ts`, `src/runner/process.ts`). [LM-8]
 *
 * - L48 `[NEG]`: a `source` that is not exactly an `InMemoryBlockSource` — a subclass carrying one of the engine's hook
 *   members, a hook-free subclass, a plain object implementing the block source's interface, an instance given a hook
 *   of its own, a proxy of one, a value of another kind —, and a `source` on a private process, are refused
 *   `source-refused`, the process ending `refused` by itself with nothing opened. The negative control gives the same
 *   sources to the engine through its test seam, unchecked: none is refused, and the subclass's hook runs.
 * - L49: with an in-memory `source` the process makes no node client — the engine's node client factory is never
 *   called for the input `startUmbraDB` gives it — and opens no connection to `node` (a TCP server listening at the
 *   `node` address sees none) while the process starts, processes the in-memory chain and stops, on PostgreSQL and
 *   PGlite. The controls: the same input with the in-memory chain given through the engine's test seam makes the node
 *   client; the node source on the same `node` connects to the server.
 */

/** A hook member's stand-in of the subclass below: it notes that it ran, then fails the start. */
const hookRuns: string[] = [];

/** A subclass carrying one of the engine's hooks (`checkChain`, a private process's own chain check). */
class HookedSource extends InMemoryBlockSource {
  async checkChain(_input: ChainCheckInput): Promise<ChainCheck> {
    hookRuns.push("checkChain");
    throw new Error("the subclass's checkChain ran in the engine");
  }
}

/** A subclass with no member of its own. */
class PlainSubclass extends InMemoryBlockSource {}

/** An object implementing the block source's interface over an in-memory chain, without being one. */
function lookalike(head: bigint): object {
  const inner = new InMemoryBlockSource({ head });
  return {
    cursor: (read: Parameters<InMemoryBlockSource["cursor"]>[0]) => inner.cursor(read),
    finalizedHead: (): Promise<BlockRef> => inner.finalizedHead(),
    block: (height: bigint) => inner.block(height),
    waitForHead: (above: bigint, signal: AbortSignal) => inner.waitForHead(above, signal),
    blockItems: (block: BlockRef) => inner.blockItems(block),
  };
}

/** L48's sources that are not exactly an `InMemoryBlockSource`, with the reason each refusal names. */
const NOT_EXACT: readonly (readonly [string, () => unknown, string])[] = [
  ["a subclass carrying a hook (checkChain)", () => new HookedSource({ head: 2n }), "not-in-memory-source"],
  ["a hook-free subclass", () => new PlainSubclass({ head: 2n }), "not-in-memory-source"],
  ["a plain object implementing the interface", () => lookalike(2n), "not-in-memory-source"],
  [
    "an instance given a hook of its own (committedHeight)",
    () => Object.assign(new InMemoryBlockSource({ head: 2n }), { committedHeight: () => Promise.resolve(null) }),
    "hook-members",
  ],
  ["a proxy of an instance", () => new Proxy(new InMemoryBlockSource({ head: 2n }), {}), "not-in-memory-source"],
  ["a value of another kind", () => "in-memory", "not-in-memory-source"],
];

/** Waits for `handle` to have closed by itself (a refusal of the configuration step), or fails after 30 s. */
async function closedByItself(handle: { readonly closed: Promise<void> }): Promise<void> {
  let timer: NodeJS.Timeout | undefined;
  const late = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("the process did not end by itself within 30 s")), 30_000);
  });
  try {
    await Promise.race([handle.closed, late]);
  } finally {
    clearTimeout(timer);
  }
}

describe.each(PROCESS_BACKENDS)("L48: source-refused (LM-8) on $name", (backend: ProcessBackend) => {
  beforeAll(async () => {
    await backend.start();
  }, 180_000);
  afterAll(async () => {
    await backend.stop();
  }, 60_000);

  it.each(NOT_EXACT)("%s is refused source-refused; nothing opened", async (_name, source, reason) => {
    const db = await backend.database();
    const handle = startUmbraDB({ config: { data: libraryData(db.setting) }, source: source() as InMemoryBlockSource });
    await expect(handle.started).rejects.toMatchObject({ code: "source-refused", details: { reason } });
    await closedByItself(handle);
    expect(handle.status()).toMatchObject({ state: "refused", reason: { code: "source-refused" } });
    expect(await handle.ended).toMatchObject({ kind: "refused" });
    if (db.directory !== undefined) expect(existsSync(db.directory)).toBe(false);
    expect(hookRuns).toEqual([]);
  });

  it("an instance given a hook names the hook members it carries", async () => {
    const db = await backend.database();
    const source = Object.assign(new InMemoryBlockSource({ head: 2n }), { attach: () => () => undefined, fetchRead: null });
    const handle = startUmbraDB({ config: { data: libraryData(db.setting) }, source });
    await expect(handle.started).rejects.toMatchObject({
      code: "source-refused",
      details: { reason: "hook-members", members: ["attach", "fetchRead"] },
    });
    await closedByItself(handle);
  });

  it("an in-memory source on a private process is refused source-refused; nothing opened", async () => {
    const db = await backend.database();
    const other = await backend.database();
    const entry = privateCoreEntry({ database: db.setting, instanceId: "library-private", publicDatabase: other.setting });
    const handle = startUmbraDB({ config: { data: { entries: [entry] } }, source: new InMemoryBlockSource({ head: 2n }) });
    await expect(handle.started).rejects.toMatchObject({ code: "source-refused", details: { reason: "private-process" } });
    await closedByItself(handle);
    expect(handle.status()).toMatchObject({ state: "refused", reason: { code: "source-refused" } });
    for (const opened of [db, other]) if (opened.directory !== undefined) expect(existsSync(opened.directory)).toBe(false);
  });

  it("negative control: the engine given the same sources unchecked refuses none of them source-refused; the hook runs", async () => {
    const codes: (string | null)[] = [];
    for (const [, source] of NOT_EXACT.filter(([name]) => name !== "a value of another kind")) {
      const db = await backend.database();
      const handle: ProcessHandle = startProcess({
        config: { data: libraryData(db.setting) },
        userModules: { modules: [] },
        network: {},
        source: source() as InMemoryBlockSource,
      });
      codes.push(await handle.started.then(() => null, () => handle.status().reason?.code ?? null));
      await handle.stop();
    }
    expect(codes).not.toContain("source-refused");
    // The hooked subclass's checkChain replaced core-chain's check in the engine.
    expect(hookRuns).toEqual(["checkChain"]);
    hookRuns.length = 0;
  }, 120_000);
});

/** A TCP server standing for the node: it counts the connections made to it and ends each one. */
async function countingNode(): Promise<{ readonly url: string; readonly connections: () => number; close(): Promise<void> }> {
  let connections = 0;
  const server: Server = createServer((socket) => {
    connections += 1;
    socket.destroy();
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as { readonly port: number };
  return {
    url: `ws://127.0.0.1:${port}/node`,
    connections: () => connections,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

describe.each(PROCESS_BACKENDS)("L49: with an in-memory source, no node client and no connection to node (LM-8), on $name", (backend: ProcessBackend) => {
  beforeAll(async () => {
    await backend.start();
  }, 180_000);
  afterAll(async () => {
    await backend.stop();
  }, 60_000);

  it("start → the in-memory head → stop: the node at `node` sees no connection", async () => {
    const node = await countingNode();
    try {
      const db = await backend.database();
      const m = rowsModule("m");
      const handle: UmbraDBHandle = startUmbraDB({
        config: { data: libraryData(db.setting, [m], { node: node.url }) },
        modules: [m],
        source: new InMemoryBlockSource({ head: 5n }),
      });
      try {
        await handle.started;
        await cursorReaches(handle, 5n);
      } finally {
        await handle.stop();
      }
      await handle.closed;
      expect(node.connections()).toBe(0);
    } finally {
      await node.close();
    }
  }, 120_000);

  it("the engine, given startUmbraDB's input, never calls its node client factory; the controls make one and connect", async () => {
    const node = await countingNode();
    try {
      const made: NodeClientOptions[] = [];
      const counting = (real: (options: NodeClientOptions) => NodeClient) => (options: NodeClientOptions) => {
        made.push(options);
        return real(options);
      };
      const { NodeClient: Client } = await import("../../src/node/client.js");
      const real = (options: NodeClientOptions) => new Client(options);
      const run = async (handle: ProcessHandle, head: bigint | null): Promise<void> => {
        try {
          await handle.started;
          if (head !== null) {
            for (let tries = 0; handle.status().cursor !== head; tries++) {
              if (tries > 6_000) throw new Error(`the cursor is ${handle.status().cursor}, not ${head}`);
              await new Promise((resolve) => setTimeout(resolve, 10));
            }
          }
        } finally {
          await handle.stop();
        }
      };

      const db = await backend.database();
      const options = { config: { data: libraryData(db.setting, [], { node: node.url }) }, source: new InMemoryBlockSource({ head: 3n }) };
      const { input } = engineInputOf(options);
      await run(startProcess({ ...input, nodeClient: counting(real) }), 3n);
      expect(made).toEqual([]);
      expect(node.connections()).toBe(0);

      // Control: the same chain through the engine's test seam, as the facade gave it before: a node client is made.
      const seamDb = await backend.database();
      const seam = engineInputOf({
        config: { data: libraryData(seamDb.setting, [], { node: node.url }) },
        source: new InMemoryBlockSource({ head: 3n }),
      }).input;
      const { inMemorySource, ...rest } = seam;
      await run(startProcess({ ...rest, source: inMemorySource as InMemoryBlockSource, nodeClient: counting(real) }), 3n);
      expect(made).toHaveLength(1);

      // Control: the node's own source on the same `node` connects to it (the server ends each connection).
      const nodeDb = await backend.database();
      const reading = startProcess({
        config: { data: libraryData(nodeDb.setting, [], { node: node.url, backoffCeilingMs: 1_000 }) },
        userModules: { modules: [] },
        network: {},
      });
      for (let tries = 0; node.connections() === 0; tries++) {
        if (tries > 3_000) throw new Error("the node source made no connection to node within 30 s");
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      await reading.stop();
      expect(node.connections()).toBeGreaterThan(0);
    } finally {
      await node.close();
    }
  }, 120_000);
});

describe("L49: the in-memory chain without a node client", () => {
  it("a module requiring the node-client item finds none; the chain is processed", async () => {
    const found: unknown[] = [];
    const m = rowsModule("asks", undefined, {
      requires: ["block-header", "node-client"],
      points: {
        async "on-start-api"(p) {
          found.push(p.items.has("node-client"), p.items.get("node-client"));
        },
        async "on-db-write"(_p, b, w) {
          await w.execute("INSERT INTO asks.rows (height) VALUES ($1)", [b.height]);
        },
      },
    });
    const handle = startUmbraDB({
      config: { data: libraryData(PGLITE_MEMORY, [m]) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 2n }),
    });
    try {
      await handle.started;
      await cursorReaches(handle, 2n);
      expect(found).toEqual([false, undefined]);
    } finally {
      await handle.stop();
    }
  }, 60_000);
});
