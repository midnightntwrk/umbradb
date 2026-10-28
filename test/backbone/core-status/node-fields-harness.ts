import { setTimeout as sleep } from "node:timers/promises";
import { z } from "zod";
import { type AdminServer, type AdminStarter, startAdminServer } from "../../../src/admin/server.js";
import type { AdminSnapshot } from "../../../src/admin/types.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import { type ConnectSocket, connectWebSocket, NodeClient, type NodeSocket } from "../../../src/node/index.js";
import type { TapeRecord } from "../../../tools/tape/index.js";
import { ask } from "../../admin/admin-harness.js";
import { schemaFile, validatorOf } from "../../admin/json-schema.js";
import { launchPrivate, startPublicCore } from "../../private/builds.js";
import { originOf } from "../../private/privacy-checks.js";
import type { ProcessBackend, ProcessDatabase } from "../../runner/process-backends.js";
import { branchOf, type ChainBlock, chainOf, content, finalized, finalizedHead, newHead, opening, RUNTIME } from "../fetch-fixtures.js";
import { FENCE, type Ingest, ingest, until } from "../ingest-harness.js";

/**
 * A168 (task 8.3a; `openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-5): what a core's `/status` shows of
 * its node — the connection's state, the best head the node announced last, the best-block queue's depth — read over
 * HTTP from the process's admin endpoints while a real process runs over the node source against a tape node, and on a
 * private process, which has no node. Shared by `node-fields.test.ts` and its negative control's file; imports nothing
 * of Vitest.
 *
 * **The core's run** ({@link a168Run}): `ingest()` (the process with UmbraDB's backbone and `core-block-fetch`'s node
 * source, as `umbradb run` makes it) from S = 100, the node's finalized head, with `tipCap` 2 and `backoffCeilingMs`
 * 1 s, its admin endpoints on a free port, and a module `hold` whose `on-compute` at 101 waits for the test. The
 * process's node client connects through a connector whose first connection waits until the test lets it open. The
 * tape ({@link a168Tape}): the opening and block 100; best blocks 101 and 102 (queued: the queue is then full), 103
 * (announced, not queued: `finality-stall`) and 102′ of another branch (announced last, not queued); then, after a
 * call the test makes itself ({@link FENCE}), 101 finalized, which the loop takes from the queue. The phases, each
 * entered once the process itself shows its precondition (`status()`, the connector, the gate), then `/status` read
 * until it shows what A168 expects or the patience ran out:
 * 1. before the first connection: `connecting` (the queue empty, no best head, no retry);
 * 2. connected, the queue full: `connected`, best head 102 (the one announced last, not the highest), depth 2;
 * 3. 101 taken from the queue, its `on-compute` held: depth 1;
 * 4. the tape node closed — the node gone —: `retrying`, `retries` at least 1, then counting past what it showed;
 * 5. after `stop()`, `on-compute` still held: `stopping`, `closed`.
 * Every body read is checked against `./status.schema.json` (A66 with the three fields).
 *
 * **The private run** ({@link privateRun}): a public core over the in-memory chain to 3 and a private process reading
 * its public database directly, with its admin endpoints: once it is at 3, `/status` shows `node` null — the three
 * fields with it.
 */

const STATUS_SCHEMA = validatorOf(schemaFile(new URL("./status.schema.json", import.meta.url)));

/** S and the node's finalized head at the start. */
export const START = 100n;
/** The queue's bound: two best blocks fill it. */
export const TIP_CAP = 2;
/** The height whose `on-compute` the test holds. */
const HELD = 101n;

const CHAIN = chainOf(START);
const HEAD = CHAIN[Number(START)] as ChainBlock;
const BRANCH_A = branchOf(HEAD, 103n, "a2");
const BRANCH_B = branchOf(HEAD, 102n, "b");
const a = (height: number): ChainBlock => BRANCH_A[height - 101] as ChainBlock;
const b = (height: number): ChainBlock => BRANCH_B[height - 101] as ChainBlock;

/** A168's tape (see the module comment). */
export function a168Tape(): TapeRecord[] {
  return [
    ...opening(CHAIN[0] as ChainBlock, HEAD),
    ...finalized(HEAD, RUNTIME, true),
    newHead(a(101)),
    ...content(a(101), RUNTIME, true),
    newHead(a(102)),
    ...content(a(102), RUNTIME, false),
    newHead(a(103)),
    newHead(b(102)),
    FENCE,
    finalizedHead(a(101)),
    { method: "chain_getBlockHash", params: [101], result: a(101).hex },
  ];
}

/**
 * A connector whose first connection waits until {@link open}: until then the node client's attempt is pending, so the
 * process has not connected yet. Later connections go straight through (`ws`).
 */
export class GatedConnector {
  /** The connections the client asked for. */
  requested = 0;
  #release!: () => void;
  readonly #released = new Promise<void>((resolve) => {
    this.#release = resolve;
  });

  open(): void {
    this.#release();
  }

  readonly connect: ConnectSocket = (url, events, timers) => {
    this.requested += 1;
    let socket: NodeSocket | undefined;
    let ended = false;
    void this.#released.then(() => {
      if (!ended) socket = connectWebSocket(url, events, timers);
    });
    return {
      send: (text) => socket?.send(text),
      close: () => {
        if (socket !== undefined) {
          socket.close();
          return;
        }
        // Closed before it was let through: it never opened, and ends now.
        if (!ended) {
          ended = true;
          events.closed({ kind: "closed", code: 1000 });
        }
      },
    };
  };
}

/** A module whose `on-compute` at `height` waits until `release` is called. */
function holding(height: bigint): { readonly module: ModuleDeclaration; reached: boolean; release(): void } {
  let open!: () => void;
  const opened = new Promise<void>((resolve) => {
    open = resolve;
  });
  const held = {
    reached: false,
    release: () => open(),
    module: {
      id: "hold",
      version: "1.0.0",
      side: "public",
      // MD-2: every module requires an item; the block's header places it after core-block-fetch.
      requires: ["block-header"],
      provides: [],
      startsMidChain: true,
      configSchema: z.object({}),
      migrations: [],
      points: {
        async "on-compute"(_p, block) {
          if (block.height !== height) return;
          held.reached = true;
          await opened;
        },
      },
    } satisfies ModuleDeclaration,
  };
  return held;
}

/** What a phase expects of a field of `/status`'s body, by its path (`node.connection`). */
type Expected = { readonly equals: unknown } | { readonly atLeast: number };
const is = (value: unknown): Expected => ({ equals: value });
const atLeast = (value: number): Expected => ({ atLeast: value });

/** How `body` differs from `expected`: one line per field. */
function mismatches(body: unknown, expected: Readonly<Record<string, Expected>>): string[] {
  const found: string[] = [];
  for (const [path, want] of Object.entries(expected)) {
    const value = path.split(".").reduce<unknown>((at, key) => (at as Record<string, unknown> | null | undefined)?.[key], body);
    if ("equals" in want) {
      if (value !== want.equals) found.push(`${path} is ${JSON.stringify(value)}, not ${JSON.stringify(want.equals)}`);
    } else if (typeof value !== "number" || value < want.atLeast) {
      found.push(`${path} is ${JSON.stringify(value)}, not at least ${want.atLeast}`);
    }
  }
  return found;
}

/** One phase as `/status` showed it: the fields that differed from what A168 expects (none once it showed them). */
export interface A168Phase {
  readonly name: string;
  readonly mismatches: readonly string[];
}

/** What a run read. */
export interface A168Observation {
  readonly phases: readonly A168Phase[];
  /** Every schema problem of a body read (A66), once each. */
  readonly schema: readonly string[];
  /** How many bodies were read. */
  readonly bodies: number;
}

/** A168's oracle: every problem, none when each phase showed what A168 expects and every body validated. */
export function a168Problems(observed: A168Observation): string[] {
  return [
    ...observed.phases.flatMap((phase) => phase.mismatches.map((mismatch) => `${phase.name}: ${mismatch}`)),
    ...observed.schema.map((problem) => `a /status body fails its schema: ${problem}`),
    ...(observed.bodies === 0 ? ["no /status body was read"] : []),
  ];
}

/** Reads `/status` at `origin` and checks each body against the schema, until a body shows `expected`. */
class StatusReader {
  readonly phases: A168Phase[] = [];
  readonly #schema = new Set<string>();
  #bodies = 0;

  constructor(
    readonly origin: string,
    readonly patienceMs: number,
  ) {}

  /** `/status` read until it shows `expected` or the patience ran out; the phase recorded, the last body returned. */
  async phase(name: string, expected: Readonly<Record<string, Expected>>): Promise<Record<string, unknown> | undefined> {
    const deadline = Date.now() + this.patienceMs;
    let last: Record<string, unknown> | undefined;
    let found = ["no /status body was read"];
    for (;;) {
      const answer = await ask(this.origin, "/status");
      if (answer.status === 200 && typeof answer.json === "object" && answer.json !== null) {
        last = answer.json as Record<string, unknown>;
        this.#bodies += 1;
        for (const problem of STATUS_SCHEMA.problems(last)) this.#schema.add(problem);
        found = mismatches(last, expected);
        if (found.length === 0) break;
      } else {
        found = [`/status answered ${answer.status ?? answer.error}, not 200 with JSON`];
      }
      if (Date.now() > deadline) break;
      await sleep(50);
    }
    this.phases.push({ name, mismatches: found });
    return last;
  }

  observation(): A168Observation {
    return { phases: [...this.phases], schema: [...this.#schema], bodies: this.#bodies };
  }
}

/** The admin listener's origin, once it listens; its port checked to be at least 10000. */
function listening(wrap: (start: AdminStarter) => AdminStarter): { readonly starter: AdminStarter; origin(): string | null } {
  let server: AdminServer | undefined;
  return {
    starter: async (options) => {
      const started = await wrap(startAdminServer)(options);
      if (started.port < 10_000) throw new Error(`the admin listener listens on port ${started.port}, below 10000`);
      server = started;
      return started;
    },
    origin: () => (server === undefined ? null : `http://${server.host}:${server.port}`),
  };
}

/** The attempts of `node-retrying` the process shows itself, 0 without it. */
function attempts(run: Ingest): number {
  const condition = run.handle.status().conditions.find((each) => each.code === "node-retrying") as { attempts?: number } | undefined;
  return condition?.attempts ?? 0;
}

/** Options of {@link a168Run}. */
export interface A168RunOptions {
  /** How long each phase reads `/status` for what A168 expects, once the process shows its precondition. */
  readonly patienceMs: number;
  /** Wraps the admin server's start: a negative control's publication. */
  readonly wrap?: (start: AdminStarter) => AdminStarter;
}

/** A168's run of a core on `db` (see the module comment). */
export async function a168Run(db: ProcessDatabase, options: A168RunOptions): Promise<A168Observation> {
  const connector = new GatedConnector();
  let client: NodeClient | undefined;
  const admin = listening(options.wrap ?? ((start) => start));
  const held = holding(HELD);
  const run = await ingest(db, a168Tape(), {
    start: START,
    settings: { tipCap: TIP_CAP, backoffCeilingMs: 1_000, listen: { admin: "127.0.0.1:0" } },
    user: [held.module],
    // The process's own client and options; its first connection held by the connector, and a call timeout long
    // enough that the held attempt is not given up on a loaded machine.
    nodeClient: (given) => {
      client = new NodeClient({ ...given, connect: connector.connect, callTimeoutMs: 600_000 });
      return client;
    },
    admin: admin.starter,
  });
  let reader: StatusReader | undefined;
  try {
    await until(run, () => connector.requested > 0 && admin.origin() !== null, "the node client's first connection attempt");
    reader = new StatusReader(admin.origin() as string, options.patienceMs);
    await reader.phase("before the first connection", {
      state: is("starting"),
      "node.connection": is("connecting"),
      "node.bestHead": is(null),
      "node.queueDepth": is(0),
      "node.retries": is(0),
    });
    if (run.node.connections !== 0) throw new Error("the node accepted a connection before the test let one through");
    connector.open();

    await until(
      run,
      () => {
        const status = run.handle.status();
        return status.cursor === START && status.conditions.some((each) => each.code === "finality-stall" && each.height === 103n);
      },
      "the queue full at tipCap, the cursor at S",
    );
    await reader.phase("connected, the queue full", {
      cursor: is("100"),
      "node.connection": is("connected"),
      "node.bestHead": is("102"),
      "node.queueDepth": is(2),
      "node.finalityStall": is(true),
      "node.retries": is(0),
    });

    await (client as NodeClient).blockHash(999_999n);
    await until(run, () => held.reached, `on-compute at ${HELD}`);
    await reader.phase(`connected, ${HELD} taken from the queue`, {
      cursor: is("100"),
      head: is("101"),
      "node.connection": is("connected"),
      "node.bestHead": is("102"),
      "node.queueDepth": is(1),
      "node.finalityStall": is(false),
    });

    await run.node.close();
    await until(run, () => attempts(run) >= 1, "the client retrying the node");
    const gone = await reader.phase("the node gone", { "node.connection": is("retrying"), "node.retries": atLeast(1) });
    const shown = (gone?.node as { retries?: unknown } | null | undefined)?.retries;
    const baseline = typeof shown === "number" ? shown : attempts(run);
    await until(run, () => attempts(run) > baseline, "another retry");
    await reader.phase("the node gone, retries counting", {
      "node.connection": is("retrying"),
      "node.retries": atLeast(baseline + 1),
    });

    const stopping = run.handle.stop();
    await until(run, () => run.handle.status().state === "stopping", "stopping");
    await reader.phase("after the stop", { state: is("stopping"), "node.connection": is("closed") });
    held.release();
    await stopping;
  } finally {
    held.release();
    connector.open();
    await run.close();
  }
  // Every phase ran: the reader was made before the first.
  return (reader as StatusReader).observation();
}

/** A168's private half on `backend` (see the module comment). */
export async function privateRun(backend: ProcessBackend, patienceMs: number): Promise<A168Observation> {
  const core = await startPublicCore({ database: (await backend.database()).setting, head: 3n });
  const lines: string[] = [];
  try {
    const running = launchPrivate({
      database: (await backend.database()).setting,
      direct: () => core.db(),
      extra: { listen: { admin: "127.0.0.1:0" } },
      admin: true,
      lines,
    });
    try {
      await running.reach(3n);
      const reader = new StatusReader(await originOf(lines, "the private process"), patienceMs);
      await reader.phase("a private process at 3", { cursor: is("3"), "instance.role": is("private"), node: is(null) });
      return reader.observation();
    } finally {
      await running.stop();
    }
  } finally {
    await core.stop();
  }
}

/**
 * The negative control's publication (A168's): every snapshot the runner publishes with the node's three fields null —
 * what 8.3 showed before this task —, the rest as published.
 */
export function withoutNodeFields(start: AdminStarter): AdminStarter {
  const strip = (snapshot: AdminSnapshot): AdminSnapshot =>
    snapshot.status.node === null
      ? snapshot
      : { ...snapshot, status: { ...snapshot.status, node: { ...snapshot.status.node, bestHead: null, connection: null, queueDepth: null } } };
  return async (options) => {
    const server = await start({ ...options, snapshot: strip(options.snapshot) });
    return {
      host: server.host,
      port: server.port,
      get threadId() {
        return server.threadId;
      },
      publish: (snapshot) => server.publish(strip(snapshot)),
      close: () => server.close(),
    };
  };
}
