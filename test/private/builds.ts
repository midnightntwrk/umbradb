import { z } from "zod";
import { CORE_CHAIN } from "../../src/backbone/core-chain/index.js";
import {
  type PrivateIntake,
  type PrivateIntakeOptions,
  privateIntake,
  type PublicDatabase,
  type PublicWakes,
} from "../../src/backbone/core-private-source/index.js";
import { privateBackbone } from "../../src/backbone/private.js";
import { coreEntry } from "../../src/config/entries.js";
import type { AdminStarter } from "../../src/admin/server.js";
import type { ReadHandle, ReadOnlyDatabase } from "../../src/db/api.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { DeclarationSet } from "../../src/modules/validation.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { FinalizedLoop, LoopInput } from "../../src/runner/loop.js";
import type { ProcessHandle, ProcessInput } from "../../src/runner/process.js";
import { startProcess } from "../runner/process-build.js";
import { chainDeclarations } from "../backbone/chain-build.js";
import { REACH_TIMEOUT_MS } from "./backends.js";

/**
 * Builds and processes for the private processes' tests (task 14.1; PP-1–PP-5, DT-3, DT-6, Q75): a public core — the
 * core process on the public database — and private processes, each on its own private database, bound to it.
 *
 * **The public core** is the process over an in-memory block source with the real backbone of task 10.2's tests
 * (`test/backbone/chain-build.ts`: `core-chain`, the stand-in `core-block-fetch`, `core-block-commit`, `core-digest`).
 * Its network is `custom`, with its own ledger table (task 12.2) and its genesis hash the in-memory chain's block 0
 * (given as {@link genesisBlock}, so the configured and the source's genesis hashes agree): `core-chain` records it
 * with S in `core_chain.identity`, which a private process binds to (PP-2). A user module `public-reads` keeps the
 * core's `db` item (`readOnlyDatabase` of its database): what a direct read of public data reads.
 *
 * **A private process** is the same process with `side: "private"`: the real `core-chain` — its history, its
 * identity (the public genesis hash, the private S, the anchor at S) and the process items `config`, `db` and
 * `ledger-table`; no node client, as its `core` entry has no `node` —, then the private backbone of
 * `src/backbone/private.ts` — `core-private-source` from a {@link privateIntake}, `core-digest` —
 * and its private modules. Its public data comes from the public database: on PostgreSQL through `publicDatabase`, the
 * URL of a login that may only read (the production path, `openPublicDatabase`); on PGlite, whose public database the
 * core alone opens, through direct reads of the core's `db` item — the "direct calls in tests" of PP-4 —, or, given
 * `coreTransport`, through the core's process transport (task 14.2: `read` messages, and its wake-ups in place of the
 * tests' poll), which a core started with `listen.transport` serves.
 *
 * Imports nothing of Vitest.
 */

/** A custom network's genesis hash for the tests: 32 bytes of `byte`, as `0x` hex. */
export function genesisHex(byte: number): string {
  return `0x${byte.toString(16).padStart(2, "0").repeat(32)}`;
}

/** The in-memory chain's block 0 whose hash is `genesis` (`0x` hex): the genesis of a test network. */
export function genesisBlock(genesis: string) {
  return Object.freeze({
    height: 0n,
    hash: new Uint8Array(Buffer.from(genesis.slice(2), "hex")),
    parentHash: new Uint8Array(32),
  });
}

/**
 * A custom network's ledger table (task 12.2, LG-3: a `custom` network sets its own rows): every `spec_version` the
 * stand-in `core-block-fetch` gives is ledger v9's.
 */
export const TEST_LEDGER_TABLE = Object.freeze({
  rows: Object.freeze([Object.freeze({ specVersionMin: 0, specVersionMax: 4_294_967_295, ledger: "v9" as const })]),
});

/** What every test process logs to: nothing, unless a test keeps the lines. */
const quiet = (): void => undefined;

/** A running public core (see the module comment). */
export interface PublicCore {
  readonly handle: ProcessHandle;
  readonly source: InMemoryBlockSource;
  /** The core's `db` item: what a direct read of public data reads. */
  db(): ReadOnlyDatabase;
  /** Raises the head to `head` and waits until the core waits above it. */
  advance(head: bigint): Promise<void>;
  stop(): Promise<void>;
  /** The lines the core logged. */
  readonly lines: readonly string[];
  /** The address its process transport listens on (`transport listening on <address>`); throws before it listens. */
  transport(): string;
  /** {@link transport} once it listens, within `ms`. */
  transportWithin(ms: number): Promise<string>;
}

/** Options of {@link startPublicCore}. */
export interface PublicCoreOptions {
  /** The `database` setting of the public database. */
  readonly database: string;
  /** The finalized head to start with. */
  readonly head: bigint;
  /** S; 1 unless given. */
  readonly start?: number;
  /** The custom network's genesis hash, as `0x` hex; {@link genesisHex}(0xa1) unless given. */
  readonly genesisHash?: string;
  /** Blocks of the in-memory chain in place of its own (another chain from a height; task 15.2a's restores). */
  readonly blocks?: readonly BlockRef[];
  /** User modules of the core. */
  readonly modules?: readonly ModuleDeclaration[];
  /** Entries of those modules. */
  readonly entries?: readonly Readonly<Record<string, unknown>>[];
  /** A negative control's loop. */
  readonly loop?: new (input: LoopInput) => FinalizedLoop;
  /** More settings of the `core` entry (`listen.transport`, `tls`, `lockstepInstances`). */
  readonly extra?: Readonly<Record<string, unknown>>;
  /**
   * The admin endpoints (task 14.4's `/status` of the private instances): served when given, on the `listen.admin` of
   * {@link extra} (`127.0.0.1:0` for a free port), or through a negative control's starter; none unless given.
   */
  readonly admin?: boolean | AdminStarter;
  /** A negative control's configuration hash (RN-16; `ProcessInput.configHash`); the process's own unless given. */
  readonly configHash?: ProcessInput["configHash"];
}

/** The public core's module that keeps the core's `db` item for the tests' direct reads (see the module comment). */
function publicReads(keep: (db: ReadOnlyDatabase) => void): ModuleDeclaration {
  return {
    id: "public-reads",
    version: "1.0.0",
    side: "public",
    requires: ["db"],
    provides: [],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {
      async "on-start-api"(p) {
        keep(p.items.get("db") as ReadOnlyDatabase);
      },
    },
  };
}

/** The public core's `core` entry. */
export function publicCoreEntry(
  database: string,
  start = 1,
  genesisHash = genesisHex(0xa1),
  extra: Readonly<Record<string, unknown>> = {},
) {
  return coreEntry({
    start,
    config: {
      network: "custom",
      genesisHash,
      ledgerTable: TEST_LEDGER_TABLE,
      database,
      node: "ws://127.0.0.1:9/node",
      developmentOptIn: true,
      ...extra,
    } as never,
  });
}

/** The address in a core's `transport listening on <address>` line, or null. */
const transportIn = (lines: readonly string[]): string | null => {
  for (const line of lines) {
    const match = /^transport listening on (\S+)/.exec(line);
    if (match !== null) return match[1] as string;
  }
  return null;
};

/** Starts a public core and waits until it has processed its head. */
export async function startPublicCore(options: PublicCoreOptions): Promise<PublicCore> {
  const core = launchPublicCore(options);
  try {
    await core.handle.started;
    await core.advance(options.head);
  } catch (error) {
    await core.handle.stop();
    throw error;
  }
  return core;
}

/** Starts a public core and returns it at once, startup running (a core that waits for the node at S, say). */
export function launchPublicCore(options: PublicCoreOptions): PublicCore {
  const genesis = options.genesisHash ?? genesisHex(0xa1);
  const start = options.start ?? 1;
  const blocks = [genesisBlock(genesis), ...(options.blocks ?? [])];
  const source = new InMemoryBlockSource({ head: options.head, blocks });
  let kept: ReadOnlyDatabase | undefined;
  const reads = publicReads((db) => {
    kept = db;
  });
  const entries = [
    publicCoreEntry(options.database, start, genesis, options.extra),
    { id: reads.id, start, version: reads.version, config: {} },
    ...(options.entries ?? []),
  ];
  const lines: string[] = [];
  const handle = startProcess({
    declarations: chainDeclarations([reads, ...(options.modules ?? [])]),
    config: { data: { entries } },
    source,
    log: (line) => lines.push(line),
    ...(options.loop === undefined ? {} : { loop: options.loop }),
    ...(options.admin === undefined ? {} : { admin: options.admin }),
    ...(options.configHash === undefined ? {} : { configHash: options.configHash }),
  });
  return {
    handle,
    source,
    db: () => {
      if (kept === undefined) throw new Error("the public core has not started its module API: no db item kept yet");
      return kept;
    },
    async advance(head) {
      source.finalize(head);
      await Promise.race([source.waiting(head), handle.ended.then((end) => Promise.reject(end))]);
    },
    stop: () => handle.stop(),
    lines,
    transport() {
      const address = transportIn(lines);
      if (address === null) throw new Error(`the public core's transport does not listen: ${lines.join(" | ")}`);
      return address;
    },
    async transportWithin(ms) {
      const deadline = Date.now() + ms;
      for (;;) {
        const address = transportIn(lines);
        if (address !== null) return address;
        if (handle.status().ended !== null || Date.now() > deadline) {
          throw new Error(`the public core's transport did not listen: ${lines.join(" | ")}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
    },
  };
}

/** Public data read directly through the core's `db` item: PP-4's direct calls in tests (14.2's `read` messages). */
export function directPublic(db: () => ReadOnlyDatabase): PublicDatabase {
  return Object.freeze({
    read: <T>(body: (read: ReadHandle) => Promise<T>): Promise<T> => db().read(body),
    close: async () => undefined,
  });
}

/** One row a private test module wrote, and how its `on-fetch` read public data at that height. */
export interface PrivateSeen {
  readonly point: "on-fetch" | "on-compute" | "on-db-write" | "on-after-db-write";
  readonly height: bigint;
  /**
   * `on-fetch`: the committed height of its read of public data; `on-compute` and `on-after-db-write`: of its read of
   * the private database.
   */
  readonly readHeight?: bigint | null;
}

/** The SQL of a private test module's table: each height with the public block's hash it read and its setting `salt`. */
export const PRIVATE_ROWS_SQL = (schema: string): string =>
  `CREATE TABLE ${schema}.rows (height bigint PRIMARY KEY, public_hash bytea NOT NULL, salt bigint NOT NULL)`;

/**
 * A private module `id` (PP-1, PP-3, PP-13): it requires the public `table` item `blocks` (the public backbone's
 * `core_block_commit.blocks`, which the public database's configuration history records under `core`; task 14.1a); its
 * `on-fetch` reads the public block's hash at the block's height through its read of public data and puts it as its
 * `block` item; its `on-compute` notes the height of its read of the private database; its `on-db-write` stores the
 * hash with its data setting `salt`; its `on-after-db-write` notes the height of its read. Its calls go to `seen`.
 * `rest` replaces parts of the declaration (a test's migration).
 */
export function privateModule(id: string, seen: PrivateSeen[], rest: Partial<ModuleDeclaration> = {}): ModuleDeclaration {
  const schema = id.replaceAll("-", "_");
  return {
    id,
    version: "1.0.0",
    side: "private",
    requires: ["blocks"],
    provides: [
      { name: `${id}-public`, lifetimes: ["block"] },
      { name: `${id}-rows`, lifetimes: ["table"], table: { schema, tables: ["rows"], kind: "append-only" } },
    ],
    startsMidChain: true,
    configSchema: z.object({ salt: z.number().int().default(0).meta({ kind: "data" }) }),
    migrations: [{ id: "001", sql: PRIVATE_ROWS_SQL(schema) }],
    points: {
      async "on-fetch"(_p, b, out, read) {
        if (read === undefined) throw new Error(`${id}'s on-fetch got no read of public data`);
        const [row] = await read.query("SELECT hash FROM core_block_commit.blocks WHERE height = $1", [b.height]);
        if (row === undefined) throw new Error(`no public block at ${b.height} in a read at ${read.height}`);
        seen.push({ point: "on-fetch", height: b.height, readHeight: read.height });
        out.put(`${id}-public`, row.hash);
      },
      async "on-compute"(_p, b, read) {
        seen.push({ point: "on-compute", height: b.height, readHeight: read.height });
      },
      async "on-db-write"(_p, b, w) {
        seen.push({ point: "on-db-write", height: b.height });
        await w.execute(`INSERT INTO ${schema}.rows (height, public_hash, salt) VALUES ($1, $2, $3)`, [
          b.height,
          b.items.get(`${id}-public`),
          b.settings.salt,
        ]);
      },
      async "on-after-db-write"(_p, b, read) {
        seen.push({ point: "on-after-db-write", height: b.height, readHeight: read.height });
      },
    },
    ...rest,
  };
}

/** A running private process. */
export interface PrivateProcess {
  readonly handle: ProcessHandle;
  readonly intake: PrivateIntake;
  /** Waits until the private cursor is `height` (or processing ends otherwise, which rejects). */
  reach(height: bigint, timeoutMs?: number): Promise<void>;
  stop(): Promise<void>;
}

/** Options of {@link startPrivate}. */
export interface PrivateOptions {
  /** The `database` setting of the private database. */
  readonly database: string;
  /** The `publicDatabase` setting, if any. */
  readonly publicDatabase?: string;
  /** Public data read some other way than `publicDatabase` (PGlite's direct reads). */
  readonly direct?: () => ReadOnlyDatabase;
  /** What wakes the private source; with `coreTransport` the transport's, else a 50 ms poll, unless given. */
  readonly wakes?: PublicWakes;
  /** The core's transport address (`coreTransport`): the private process's wake-ups, and on PGlite its public reads. */
  readonly coreTransport?: string;
  /** The `tls` setting (PP-11). */
  readonly tls?: { readonly certificate: string; readonly key: string; readonly trustedRoots: readonly string[] };
  /** Where the process's log lines go; nowhere unless given. */
  readonly lines?: string[];
  /** S; 1 unless given. */
  readonly start?: number;
  /** The instance id; `instance-1` unless given. */
  readonly instanceId?: string;
  /** The private modules; one {@link privateModule} `pm` unless given. */
  readonly modules?: readonly ModuleDeclaration[];
  /** Their entries; `pm` from S with `salt` unless given. */
  readonly entries?: readonly Readonly<Record<string, unknown>>[];
  /** `pm`'s `salt`; 0 unless given. */
  readonly salt?: number;
  /** The custom network's genesis hash; {@link genesisHex}(0xa1) unless given. */
  readonly genesisHash?: string;
  /**
   * The `core` entry's network: `custom` (with {@link genesisHash} and the tests' ledger table) unless given; a known
   * network has its genesis hash and ledger table built in (CF-4), so neither is given.
   */
  readonly network?: string;
  /** Where `pm` reports its calls. */
  readonly seen?: PrivateSeen[];
  /** The intake's negative-control options. */
  readonly intake?: Omit<PrivateIntakeOptions, "publicDatabase" | "wakes">;
  /** A negative control's loop. */
  readonly loop?: new (input: LoopInput) => FinalizedLoop;
  /** Starts the process in this function's context (A112's attribution). */
  readonly within?: <T>(start: () => T) => T;
  /** More settings of the `core` entry (`backoffCeilingMs`). */
  readonly extra?: Readonly<Record<string, unknown>>;
  /** The admin endpoints, as {@link PublicCoreOptions.admin}: none unless given. */
  readonly admin?: boolean | AdminStarter;
}

/** The private process's `core` entry. */
export function privateCoreEntry(options: PrivateOptions) {
  const network = options.network ?? "custom";
  return coreEntry({
    start: options.start ?? 1,
    config: {
      network,
      ...(network === "custom"
        ? { genesisHash: options.genesisHash ?? genesisHex(0xa1), ledgerTable: TEST_LEDGER_TABLE }
        : {}),
      database: options.database,
      instanceId: options.instanceId ?? "instance-1",
      developmentOptIn: true,
      ...(options.publicDatabase === undefined ? {} : { publicDatabase: options.publicDatabase }),
      ...(options.coreTransport === undefined ? {} : { coreTransport: options.coreTransport }),
      ...(options.tls === undefined ? {} : { tls: options.tls }),
      ...options.extra,
    } as never,
  });
}

/** A 50 ms poll of the public cursor: the default wake-up of these tests' private processes. */
function poll(): PublicWakes {
  return {
    next: (signal) =>
      new Promise<void>((resolve, reject) => {
        if (signal.aborted) {
          reject(signal.reason);
          return;
        }
        const timer = setTimeout(resolve, 50);
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(signal.reason);
        });
      }),
  };
}

/** Starts a private process (see the module comment) and returns it at once, startup running. */
export function launchPrivate(options: PrivateOptions): PrivateProcess {
  const direct = options.direct;
  const wakes = options.wakes ?? (options.coreTransport === undefined ? poll() : undefined);
  const intake = privateIntake({
    ...options.intake,
    ...(direct === undefined ? {} : { publicDatabase: () => directPublic(direct) }),
    ...(wakes === undefined ? {} : { wakes: () => wakes }),
  });
  const modules = options.modules ?? [privateModule("pm", options.seen ?? [])];
  const entries = options.entries ?? [
    { id: "pm", start: options.start ?? 1, version: "1.0.0", config: { salt: options.salt ?? 0 } },
  ];
  const declarations: DeclarationSet = {
    backbone: [CORE_CHAIN, ...privateBackbone(intake)],
    core: [],
    user: modules,
  };
  const start = (): ProcessHandle =>
    startProcess({
      declarations,
      config: { data: { entries: [privateCoreEntry(options), ...entries] } },
      source: (core, shared) => intake.source(core, shared),
      side: "private",
      log: options.lines === undefined ? quiet : (line) => options.lines?.push(line),
      ...(options.loop === undefined ? {} : { loop: options.loop }),
      ...(options.admin === undefined ? {} : { admin: options.admin }),
    });
  const handle = options.within === undefined ? start() : options.within(start);
  return {
    handle,
    intake,
    async reach(height, timeoutMs = REACH_TIMEOUT_MS) {
      const deadline = Date.now() + timeoutMs;
      for (;;) {
        const status = handle.status();
        if (status.cursor !== null && status.cursor >= height) return;
        if (status.ended !== null) {
          throw new Error(`the private process ended (${status.ended.kind}) at ${String(status.cursor)}`);
        }
        if (Date.now() > deadline) {
          throw new Error(`the private process is at ${String(status.cursor)}, not ${height}, after ${timeoutMs} ms`);
        }
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
    },
    stop: () => handle.stop(),
  };
}

/** Starts a private process; resolves once startup completed, rejects with its refusal (after stopping it). */
export async function startPrivate(options: PrivateOptions): Promise<PrivateProcess> {
  const running = launchPrivate(options);
  try {
    await running.handle.started;
  } catch (error) {
    await running.stop();
    throw error;
  }
  return running;
}

/** What a refused private startup left: the refusal, and the state and reason code before it was stopped. */
export interface PrivateRefusal {
  readonly error: unknown;
  readonly state: string;
  readonly code: string | null;
}

/** A private process's start that is expected to be refused (rejects if it started; stops it either way). */
export async function refusalOf(options: PrivateOptions): Promise<PrivateRefusal> {
  const running = launchPrivate(options);
  try {
    await running.handle.started;
  } catch (error) {
    const status = running.handle.status();
    await running.stop();
    return { error, state: status.state, code: status.reason?.code ?? null };
  }
  await running.stop();
  throw new Error("expected the private process's startup to refuse, and it started");
}

/** The origin (`http://host:port`) of the admin endpoints a process logged it listens on, or null before it does. */
export function adminOrigin(lines: readonly string[]): string | null {
  for (const line of lines) {
    const match = /^admin endpoints listening on (\S+)$/.exec(line);
    if (match !== null) return `http://${match[1] as string}`;
  }
  return null;
}

/** The default 32 zero bytes, a hash nothing has. */
export const NO_HASH = new Uint8Array(32);

export { InMemoryBlockSource };
