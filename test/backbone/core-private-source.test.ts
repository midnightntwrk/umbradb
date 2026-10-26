import { describe, expect, it } from "vitest";
import { CORE_DIGEST } from "../../src/backbone/core-digest/index.js";
import { CORE_KEY_REGISTRY } from "../../src/backbone/core-key-registry/index.js";
import {
  bindingRefusal,
  openPublicDatabase,
  PrivateBlockSource,
  privateCursorHeight,
  privateIntake,
  PUBLIC_POLL_MS,
  type PublicDatabase,
  type PublicWakes,
  pollingWakes,
  publicNotStarted,
  readPrivateCursor,
  readPublicBlock,
  readPublicIdentity,
} from "../../src/backbone/core-private-source/index.js";
import { PRIVATE_CORE_DIGEST, privateBackbone } from "../../src/backbone/private.js";
import type { CheckedEntry } from "../../src/config/validate.js";
import type { ReadHandle, SchemaWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ProcessContext } from "../../src/modules/declaration.js";

/**
 * `core-private-source`'s parts that need no database (task 14.1; PP-2, PP-3): the private block source over a public
 * database and wake-ups that tests give, the poll, the binding's refusals, the public database's opening, and the
 * private backbone's declarations. The parts with databases on both backends are `test/private/`'s.
 */

/** A read whose statements `answer` answers, by their SQL and parameters. */
function fakeRead(answer: (sql: string, params: readonly unknown[]) => Record<string, unknown>[], height: bigint | null = null): ReadHandle {
  return { height, query: async (sql, params = []) => answer(sql, params) };
}

/** A public database over {@link fakeRead}s of `answer`, counting its reads and whether it was closed. */
function fakePublic(answer: (sql: string, params: readonly unknown[]) => Record<string, unknown>[]) {
  const state = { reads: 0, closed: false };
  const db: PublicDatabase = {
    read: async (body) => {
      state.reads += 1;
      return body(fakeRead(answer, 7n));
    },
    close: async () => {
      state.closed = true;
    },
  };
  return { db, state };
}

const bytes = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);

/** Answers of a public database: its identity (S = 3) and blocks up to `head`, or nothing. */
function publicAnswers(options: { readonly identity?: boolean; readonly head?: bigint | null }) {
  const { identity = true, head = null } = options;
  return (sql: string, params: readonly unknown[]): Record<string, unknown>[] => {
    if (sql.includes("to_regclass('core_chain.identity')")) return [{ present: identity }];
    if (sql.includes("FROM core_chain.identity")) return [{ genesis_hash: bytes(0xa1), start_height: 3n }];
    if (sql.includes("to_regclass('core_block_commit.blocks')")) return [{ present: head !== null }];
    if (sql.includes("ORDER BY height DESC")) {
      return head === null || head < 3n ? [] : [{ height: head, hash: bytes(Number(head)), parent_hash: bytes(0) }];
    }
    if (sql.includes("WHERE height = $1")) {
      const height = params[0] as bigint;
      return head !== null && height >= 3n && height <= head ? [{ height, hash: bytes(Number(height)), parent_hash: bytes(1) }] : [];
    }
    throw new Error(`unexpected statement ${sql}`);
  };
}

/** Wake-ups a test triggers: `wake()` resolves every pending `next`; each `next`'s signal is kept. */
function manualWakes() {
  const pending: { readonly resolve: () => void; readonly signal: AbortSignal }[] = [];
  const wakes: PublicWakes = {
    next: (signal) =>
      new Promise<void>((resolve, reject) => {
        pending.push({ resolve, signal });
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      }),
  };
  return {
    wakes,
    pending,
    wake: () => {
      for (const { resolve } of pending.splice(0)) resolve();
    },
  };
}

describe("the private block source (PP-3)", () => {
  it("its head is the public cursor, and before the core's first commit the height before the public S", async () => {
    const before = new PrivateBlockSource(fakePublic(publicAnswers({ head: null })).db, pollingWakes());
    expect(await before.finalizedHead()).toEqual({ height: 2n, hash: new Uint8Array(32), parentHash: new Uint8Array(32) });
    const after = new PrivateBlockSource(fakePublic(publicAnswers({ head: 9n })).db, pollingWakes());
    expect(await after.finalizedHead()).toEqual({ height: 9n, hash: bytes(9), parentHash: bytes(0) });
    const empty = new PrivateBlockSource(fakePublic(publicAnswers({ identity: false })).db, pollingWakes());
    await expect(empty.finalizedHead()).rejects.toThrow(/no chain identity .*its core has never started/);
  });

  it("checks the chain at startup by the public identity, in place of the node's checks (PP-1, PP-2)", async () => {
    const { db, state } = fakePublic(publicAnswers({ head: 9n }));
    const source = new PrivateBlockSource(db, pollingWakes());
    expect(await source.checkChain()).toEqual({ genesisHash: bytes(0xa1) });
    expect(state.reads).toBe(1);
    const empty = new PrivateBlockSource(fakePublic(publicAnswers({ identity: false })).db, pollingWakes());
    await expect(empty.checkChain()).rejects.toMatchObject({
      code: "private-binding-mismatch",
      details: { reason: "public-not-started" },
    });
  });

  it("its block at h is the public block at h, and one the public database lacks is an error", async () => {
    const source = new PrivateBlockSource(fakePublic(publicAnswers({ head: 9n })).db, pollingWakes());
    expect(await source.block(5n)).toEqual({ height: 5n, hash: bytes(5), parentHash: bytes(1) });
    await expect(source.block(10n)).rejects.toThrow("the public database has no block at height 10");
    const none = new PrivateBlockSource(fakePublic(publicAnswers({ head: null })).db, pollingWakes());
    await expect(none.block(3n)).rejects.toThrow("the public database has no block at height 3");
  });

  it("reads public data for on-fetch, and closes the public database", async () => {
    const { db, state } = fakePublic(publicAnswers({ head: 9n }));
    const source = new PrivateBlockSource(db, pollingWakes());
    expect(source.publicDatabase).toBe(db);
    expect(await source.fetchRead(async (read) => read.height)).toBe(7n);
    await source.close();
    expect(state).toEqual({ reads: 1, closed: true });
  });

  it("waits for the public cursor by reading it at every wake-up, each asked for before the read", async () => {
    let head: bigint | null = 4n;
    const { db, state } = fakePublic((sql, params) => publicAnswers({ head })(sql, params));
    const manual = manualWakes();
    const source = new PrivateBlockSource(db, manual.wakes);
    // Above the cursor at once: one read, and the wake-up asked for is given back.
    await source.waitForHead(3n, new AbortController().signal);
    expect(state.reads).toBe(1);
    expect(manual.pending.map(({ signal }) => signal.aborted)).toEqual([true]);
    manual.pending.splice(0);
    let done = false;
    const waiting = source.waitForHead(5n, new AbortController().signal).then(() => {
      done = true;
    });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect([done, state.reads, manual.pending.length]).toEqual([false, 2, 1]);
    manual.wake();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect([done, state.reads, manual.pending.length]).toEqual([false, 3, 1]);
    head = 6n;
    manual.wake();
    await waiting;
    expect(state.reads).toBe(4);
  });

  it("stops waiting with the signal's reason, aborted before or during the wait", async () => {
    const source = new PrivateBlockSource(fakePublic(publicAnswers({ head: 4n })).db, manualWakes().wakes);
    const before = new AbortController();
    before.abort(new Error("stopped before"));
    await expect(source.waitForHead(5n, before.signal)).rejects.toThrow("stopped before");
    const during = new AbortController();
    const waiting = source.waitForHead(5n, during.signal);
    await new Promise((resolve) => setTimeout(resolve, 10));
    during.abort(new Error("stopped during"));
    await expect(waiting).rejects.toThrow("stopped during");
  });
});

describe("the private cursor", () => {
  it("is null before its table exists and before its first block, then the block the row holds", async () => {
    const none = fakeRead(() => [{ present: false }]);
    expect(await readPrivateCursor(none)).toBeNull();
    const bound = fakeRead((sql) => (sql.includes("to_regclass") ? [{ present: true }] : [{ height: null, hash: null, parent_hash: null }]));
    expect(await readPrivateCursor(bound)).toBeNull();
    const empty = fakeRead((sql) => (sql.includes("to_regclass") ? [{ present: true }] : []));
    expect(await readPrivateCursor(empty)).toBeNull();
    const at = fakeRead((sql) =>
      sql.includes("to_regclass") ? [{ present: true }] : [{ height: 8n, hash: bytes(8), parent_hash: bytes(7) }],
    );
    expect(await readPrivateCursor(at)).toEqual({ height: 8n, hash: bytes(8), parentHash: bytes(7) });
    expect(await privateCursorHeight(at)).toBe(8n);
    expect(await privateCursorHeight(none)).toBeNull();
  });
});

describe("the public tables a private process reads", () => {
  it("are none before the public database's core first started", async () => {
    const absent = fakeRead(() => [{ present: false }]);
    expect(await readPublicIdentity(absent)).toBeNull();
    expect(await readPublicBlock(absent, 1n)).toBeNull();
    const noRow = fakeRead((sql) => (sql.includes("to_regclass") ? [{ present: true }] : []));
    expect(await readPublicIdentity(noRow)).toBeNull();
    expect(await readPublicBlock(noRow, 1n)).toBeNull();
    expect(await readPublicIdentity(fakeRead(publicAnswers({})))).toEqual({ genesisHash: bytes(0xa1), start: 3n });
  });
});

describe("PP-2: the binding's refusals (private-binding-mismatch)", () => {
  const identity = { genesisHash: bytes(0xa1), start: 3n };

  it("refuses another genesis hash, another S, a private S below the public one, and a public core never started", () => {
    const codes = [
      bindingRefusal({ ...identity, genesisHash: bytes(0xb2) }, identity, 3n),
      bindingRefusal({ ...identity, start: 1n }, identity, 3n),
      bindingRefusal(null, identity, 2n),
      publicNotStarted(),
    ].map((refusal) => [refusal?.code, refusal?.details.reason, refusal?.retryable]);
    expect(codes).toEqual([
      ["private-binding-mismatch", "genesis", false],
      ["private-binding-mismatch", "start", false],
      ["private-binding-mismatch", "private-start-below", false],
      ["private-binding-mismatch", "public-not-started", false],
    ]);
    expect(bindingRefusal({ ...identity, start: 1n }, identity, 3n)?.message).toContain("whose start height S is 1");
    expect(bindingRefusal(null, identity, 2n)?.message).toContain("starts at 2, below the public database's start height S 3");
  });

  it("accepts the public database it is bound to, and a first start at or above the public S", () => {
    expect(bindingRefusal(identity, identity, 3n)).toBeNull();
    expect(bindingRefusal(identity, identity, 9n)).toBeNull();
    expect(bindingRefusal(null, identity, 3n)).toBeNull();
  });
});

describe("the public database and the wake-ups a private process starts with", () => {
  const core = (settings: Record<string, unknown>): CheckedEntry =>
    ({ id: "core", start: 0, settings }) as unknown as CheckedEntry;

  it("refuses no publicDatabase and a PGlite one, which the core's transport serves (task 14.2)", () => {
    for (const settings of [{}, { publicDatabase: "pglite:/tmp/public" }]) {
      let error: unknown;
      try {
        openPublicDatabase(core(settings));
      } catch (caught) {
        error = caught;
      }
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).code).toBe("invalid-configuration");
      expect((error as UmbraError).details).toEqual({ reason: "public-database-transport" });
      expect((error as UmbraError).message).toContain("task 14.2");
    }
  });

  it("opens a PostgreSQL publicDatabase for reads, connecting only when it reads", async () => {
    const opened = openPublicDatabase(core({ publicDatabase: "postgres://nobody:none@127.0.0.1:9/public" }));
    expect(Object.isFrozen(opened)).toBe(true);
    await opened.close();
    await expect(opened.read(async () => 1)).rejects.toMatchObject({ code: "handle-closed" });
  });

  it("polls: wakes after its interval, and stops with the signal's reason", async () => {
    expect(PUBLIC_POLL_MS).toBe(1_000);
    const started = Date.now();
    await pollingWakes(20).next(new AbortController().signal);
    expect(Date.now() - started).toBeGreaterThanOrEqual(15);
    const before = new AbortController();
    before.abort(new Error("before"));
    await expect(pollingWakes(20).next(before.signal)).rejects.toThrow("before");
    const during = new AbortController();
    const next = pollingWakes(60_000).next(during.signal);
    during.abort(new Error("during"));
    await expect(next).rejects.toThrow("during");
  });

  it("makes the source from the core revision with the wake-ups and public database given, polling by default", async () => {
    const given = fakePublic(publicAnswers({ head: 4n }));
    const manual = manualWakes();
    const intake = privateIntake({ publicDatabase: () => given.db, wakes: () => manual.wakes });
    const source = intake.source(core({}));
    expect(source.publicDatabase).toBe(given.db);
    const waiting = source.waitForHead(4n, new AbortController().signal);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(manual.pending.length).toBe(1);
    const stop = new AbortController();
    const polled = privateIntake({ publicDatabase: () => given.db }).source(core({}));
    const polling = polled.waitForHead(4n, stop.signal);
    stop.abort(new Error("stopped"));
    await expect(polling).rejects.toThrow("stopped");
    expect(() => privateIntake().source(core({}))).toThrow(/no publicDatabase/);
    void waiting.catch(() => undefined);
  });

  it("binds with the private S — its earliest core revision's start — and records the public identity once", async () => {
    const intake = privateIntake({ publicDatabase: () => fakePublic(publicAnswers({})).db, wakes: () => manualWakes().wakes });
    intake.source(core({}));
    const setup = intake.part.points["on-start-db"] as (p: ProcessContext, w: SchemaWriteHandle) => Promise<void>;
    const executed: unknown[][] = [];
    let recorded: Record<string, unknown>[] = [];
    const w = {
      height: null,
      query: async () => recorded,
      execute: async (_sql: string, params: unknown[] = []) => {
        executed.push(params);
        return 1;
      },
    } as SchemaWriteHandle;
    const context = (starts: readonly bigint[]) =>
      ({ revisions: starts.map((start) => ({ start, stop: null, version: "1.0.0", settings: {} })) }) as unknown as ProcessContext;
    // The public S is 3: the private S 2 (revisions from 2 and from 5) is below it.
    await expect(setup.call(intake.part.points, context([2n, 5n]), w)).rejects.toMatchObject({
      code: "private-binding-mismatch",
      details: { reason: "private-start-below" },
    });
    await setup.call(intake.part.points, context([3n, 5n]), w);
    expect(executed).toEqual([[bytes(0xa1), 3n]]);
    recorded = [{ public_genesis_hash: bytes(0xa1), public_start_height: 3n }];
    await setup.call(intake.part.points, context([3n, 5n]), w);
    expect(executed).toHaveLength(1);
  });

  it("refuses to bind to a public database whose core never started, also in its on-start-db", async () => {
    const intake = privateIntake({ publicDatabase: () => fakePublic(publicAnswers({ identity: false })).db });
    intake.source(core({}));
    const setup = intake.part.points["on-start-db"] as (p: ProcessContext, w: SchemaWriteHandle) => Promise<void>;
    await expect(setup.call(intake.part.points, {} as ProcessContext, {} as SchemaWriteHandle)).rejects.toMatchObject({
      code: "private-binding-mismatch",
      details: { reason: "public-not-started" },
    });
  });

  it("refuses to bind before its source is made", async () => {
    const intake = privateIntake();
    const setup = intake.part.points["on-start-db"] as (p: ProcessContext, w: SchemaWriteHandle) => Promise<void>;
    await expect(setup.call(intake.part.points, {} as ProcessContext, {} as SchemaWriteHandle)).rejects.toThrow(
      /on-start-db ran before its block source was made/,
    );
  });
});

describe("the private backbone (PP-1, RN-3)", () => {
  it("is core-private-source, core-key-registry and core-digest requiring the private cursor", () => {
    const intake = privateIntake();
    expect(privateBackbone(intake).map((part) => part.id)).toEqual(["core-private-source", "core-key-registry", "core-digest"]);
    expect(privateBackbone(intake)[0]).toBe(intake.part);
    expect(PRIVATE_CORE_DIGEST).toMatchObject({ side: "private", requires: ["private-cursor"] });
    expect(PRIVATE_CORE_DIGEST.migrations).toEqual(CORE_DIGEST.migrations);
    expect(PRIVATE_CORE_DIGEST.points).toBe(CORE_DIGEST.points);
    expect(intake.part.provides.map((item) => item.name)).toEqual(["private-cursor"]);
    expect(CORE_KEY_REGISTRY).toMatchObject({ side: "private", requires: [] });
    expect(CORE_KEY_REGISTRY.provides.map((item) => [item.name, item.lifetimes])).toEqual([["admitted-keys", ["block", "table"]]]);
  });
});
