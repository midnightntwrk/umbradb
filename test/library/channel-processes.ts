import { MessageChannel } from "node:worker_threads";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { coreEntry } from "../../src/config/entries.js";
import { messagePortChannel, type PrivateLinkChannel } from "../../src/library/channels.js";
import { engineInputOf, handleOf, startUmbraDB, type UmbraDBHandle, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { EngineInput } from "../../src/runner/process.js";
import type { TestDatabase } from "../private/backends.js";
import { coreSettings, startProcess } from "../runner/process-build.js";
import { libraryData } from "./library-fixtures.js";

/**
 * The library processes of the channel tests: a public process whose link is over channels
 * (`publicSide: { channels: true }`) on an in-memory chain, and private processes whose link is a host's `connect`
 * (`privateSide: { connect }`), each started as a host starts it (`startUmbraDB`), or — for a test's seams of the
 * channel link (`EngineInput.channelLink`: a controlled clock, a negative control's check removed) — through the
 * engine with the facade's exact input and the seam, under the handle a host gets. Imports nothing of Vitest.
 */

/** A process and the lines it logged. */
export interface Logged {
  readonly handle: UmbraDBHandle;
  readonly lines: string[];
}

/** Starts `options` as a host does, or with the channel link's `seams` (see the module comment). */
export function startWith(options: UmbraDBOptions, seams?: EngineInput["channelLink"]): UmbraDBHandle {
  if (seams === undefined) return startUmbraDB(options);
  const { input } = engineInputOf(options);
  return handleOf(startProcess({ ...input, channelLink: seams }));
}

/** The `core` settings a public process on `db` adds for its link: the reader login on PostgreSQL. */
export const readerOf = (db: TestDatabase): Readonly<Record<string, unknown>> =>
  db.transportReader === undefined ? {} : { transportReader: db.transportReader };

/** What {@link channelCore} takes besides the database. */
export interface ChannelCoreOptions {
  /** The in-memory chain's head. */
  readonly head: bigint;
  /** More settings of the `core` entry (`lockstepInstances`, another `transportReader`). */
  readonly extra?: Readonly<Record<string, unknown>>;
  readonly modules?: readonly ModuleDeclaration[];
  readonly seams?: EngineInput["channelLink"];
}

/** A public library process on `db` whose link is over channels (see the module comment). */
export function channelCore(db: TestDatabase, options: ChannelCoreOptions): Logged {
  const lines: string[] = [];
  const modules = options.modules ?? [];
  const handle = startWith(
    {
      config: { data: libraryData(db.setting, modules, { ...readerOf(db), ...options.extra }) },
      ...(modules.length === 0 ? {} : { modules }),
      source: new InMemoryBlockSource({ head: options.head }),
      network: { privateLink: { publicSide: { channels: true } } },
      log: (line) => lines.push(line),
    },
    options.seams,
  );
  return { handle, lines };
}

/** A private library process's configuration data on `database`: the tests' network, no `node`, `extra` settings. */
export function privateData(database: DatabaseParts, extra: Readonly<Record<string, unknown>>) {
  const { node: _node, ...settings } = coreSettings(database);
  return { entries: [coreEntry({ start: 1, config: { ...settings, ...extra } as never })] };
}

/**
 * The `publicDatabase` a private process on the channel link is given: on PGlite the core's own (which only the core
 * opens, so it is read through the link), on PostgreSQL none (read through the link too).
 */
export const linkReadPublicDatabase = (publicDb: TestDatabase): Readonly<Record<string, unknown>> =>
  publicDb.setting.kind === "pglite" ? { publicDatabase: publicDb.setting } : {};

/** A host's `connect` to `core` over a new `MessageChannel` each call, and how often it was called. */
export interface Link {
  readonly connect: (signal: AbortSignal) => Promise<PrivateLinkChannel>;
  /** How many channels it opened. */
  readonly opened: number;
}

/**
 * A host's `connect` to `core` (see {@link Link}): each call makes a `MessageChannel`, hands one end to the core's
 * `privateLink.accept` and resolves with the other, each through `messagePortChannel`. With `outgoing`, the private
 * process's end is a test-owned channel that rewrites each envelope it sends before the port carries it (a relay, as
 * the socket tests' `ReportRelay`).
 */
export function linkTo(core: UmbraDBHandle, outgoing?: (text: string) => string): Link {
  let opened = 0;
  return {
    connect: async () => {
      opened += 1;
      const { port1, port2 } = new MessageChannel();
      core.privateLink.accept(messagePortChannel(port1));
      const privateEnd = messagePortChannel(port2);
      if (outgoing === undefined) return privateEnd;
      return { ...privateEnd, send: (text: string) => privateEnd.send(outgoing(text)) };
    },
    get opened() {
      return opened;
    },
  };
}

/** What {@link channelPrivate} takes besides the databases. */
export interface ChannelPrivateOptions {
  readonly instanceId: string;
  readonly connect: (signal: AbortSignal) => Promise<PrivateLinkChannel>;
  readonly extra?: Readonly<Record<string, unknown>>;
  readonly modules?: readonly ModuleDeclaration[];
  readonly seams?: EngineInput["channelLink"];
}

/** A private library process on `privateDb`, bound to `publicDb`'s core, its link the host's `connect`. */
export function channelPrivate(privateDb: TestDatabase, publicDb: TestDatabase, options: ChannelPrivateOptions): Logged {
  const lines: string[] = [];
  const handle = startWith(
    {
      config: { data: privateData(privateDb.setting, { instanceId: options.instanceId, ...linkReadPublicDatabase(publicDb), ...options.extra }) },
      ...(options.modules === undefined ? {} : { modules: options.modules }),
      network: { privateLink: { privateSide: { connect: options.connect } } },
      log: (line) => lines.push(line),
    },
    options.seams,
  );
  return { handle, lines };
}
