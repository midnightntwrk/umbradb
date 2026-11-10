import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { z } from "zod";
import type { TapeRecord } from "../../../tools/tape/index.js";
import {
  type ContractLog,
  contractLogsBlock,
  contractLogsItem,
  contractLogsMigrations,
  type UnresolvedLogSite,
  writeLogRows,
} from "../../../src/backbone/contract-logs/contract-logs.js";
import { cursorHeight } from "../../../src/backbone/core-block-commit/sql.js";
import { UMBRADB_VERSION } from "../../../src/config/build.js";
import type { PostgresParts } from "../../../src/config/database-parts.js";
import type { ReadHandle } from "../../../src/db/api.js";
import { openPglite } from "../../../src/db/pglite.js";
import { openPostgres } from "../../../src/db/postgres.js";
import { startUmbraDB, type UmbraDBHandle } from "../../../src/library/start-umbradb.js";
import { defineModule, type ModuleDeclaration } from "../../../src/modules/declaration.js";
import { InMemoryBlockSource, type InMemoryItems } from "../../../src/runner/in-memory-source.js";
import {
  EVENT_NAME,
  encodePayload,
  type MetadataRecord,
} from "../../../src/features/token-metadata/codec/index.js";
import { TOKEN_METADATA_API } from "../../../src/features/token-metadata-api/token-metadata-api.js";
import { TOKEN_METADATA } from "../../../src/features/token-metadata/token-metadata.js";
import * as v9 from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { cursorReaches, libraryData } from "../../library/library-fixtures.js";
import type { ProcessDatabase } from "../../runner/process-backends.js";

/**
 * The module harness of `token-metadata`: the real process through
 * `startUmbraDB`, on blocks from an `InMemoryBlockSource`, with a test-only module `test-contract-logs` that provides
 * `contract-logs` — the item's own declaration and migrations, its `block` item put at `on-parse` from the logs a test
 * gives per height, and its rows written as the real providers write them.
 */

/** The test provider's id. */
export const TEST_LOGS_ID = "test-contract-logs";

/** The hash the test provider gives transaction `transaction` of block `height`: SHA-256 of `tx:height:transaction`. */
export function txHashOf(height: bigint | number, transaction: number): Uint8Array {
  return new Uint8Array(createHash("sha256").update(`tx:${height}:${transaction}`).digest());
}

/** The test provider's `block-parsed` of a block whose logs are `logs`: transactions 0 … the last log's, hashes only. */
function blockParsedOf(height: bigint, logs: readonly ContractLog[], unresolved: readonly UnresolvedLogSite[]) {
  const last = Math.max(-1, ...logs.map((l) => l.transaction), ...unresolved.map((site) => site.transaction));
  const transactions = Array.from({ length: last + 1 }, (_, index) =>
    Object.freeze({ index, hash: txHashOf(height, index), kind: "regular", size: 1, bytes: new Uint8Array(), segments: [] }),
  );
  return Object.freeze({ ledger: "test", transactions: Object.freeze(transactions) });
}

/**
 * A provider of `contract-logs` giving `logs`' logs and `unresolved`'s unresolved log sites at each height (none
 * elsewhere), and of `block-parsed`'s hashes.
 */
export function logsProvider(
  logs: ReadonlyMap<bigint, readonly ContractLog[]>,
  unresolved: ReadonlyMap<bigint, readonly UnresolvedLogSite[]> = new Map(),
): ModuleDeclaration {
  return defineModule({
    id: TEST_LOGS_ID,
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [contractLogsItem(), { name: "block-parsed", lifetimes: ["block"] }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: contractLogsMigrations(),
    points: {
      async "on-parse"(_p, b, out) {
        const sites = unresolved.get(b.height) ?? [];
        out.put("contract-logs", contractLogsBlock(logs.get(b.height) ?? [], sites));
        out.put("block-parsed", blockParsedOf(b.height, logs.get(b.height) ?? [], sites));
      },
      async "on-db-write"(_p, b, w) {
        await writeLogRows(w, b.height, logs.get(b.height) ?? []);
      },
    },
  }) as ModuleDeclaration;
}

/** A contract address: 32 bytes of `byte`. */
export const contract = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);

/** A domain separator: 32 bytes of `byte`. */
export const domain = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);

/** `bytes` without trailing zero bytes (the ledger's normal form of an atom). */
function normal(bytes: Uint8Array): Uint8Array {
  let end = bytes.length;
  while (end > 0 && bytes[end - 1] === 0) end--;
  return bytes.slice(0, end);
}

/** The ledger's tagged serialization of a cell holding `bytes` as one atom declared `Bytes<288>`, as Compact logs it. */
export function cellData(bytes: Uint8Array): Uint8Array {
  const value = v9.StateValue.newCell({ value: [normal(bytes)], alignment: [{ tag: "atom", value: { tag: "bytes", length: 288 } }] });
  return v9.serializeStateValue(value);
}

/** A `Misc` log's data: `name` (zero-extended to 32 bytes) then `payload`. */
export function miscData(name: Uint8Array, payload: Uint8Array): Uint8Array {
  const bytes = new Uint8Array(32 + payload.length);
  bytes.set(name.subarray(0, 32), 0);
  bytes.set(payload, 32);
  return cellData(bytes);
}

/** A MIP-0018 event's data: the v1 name and the encoded payload of `records` for (`domainSep`, `kind`). */
export function eventData(domainSep: Uint8Array, kind: number, records: readonly MetadataRecord[]): Uint8Array {
  return miscData(EVENT_NAME, encodePayload({ domainSep, kind }, records));
}

/** A log of transaction `transaction` at block index `index` (the rest of a contract call's fields fixed). */
export function log(
  transaction: number,
  index: number,
  address: Uint8Array,
  data: Uint8Array,
  eventType: ContractLog["eventType"] = "Misc",
): ContractLog {
  return {
    transaction,
    index,
    address,
    entryPoint: new TextEncoder().encode("setMetadata"),
    logicalSegment: 1,
    version: 1,
    eventType,
    data,
  };
}

/** Numbers `logs` (each `[transaction, address, data, type?]`) by their order in the block, as `contract-logs` does. */
export function blockLogs(
  ...logs: readonly (readonly [number, Uint8Array, Uint8Array, ContractLog["eventType"]?])[]
): ContractLog[] {
  return logs.map(([transaction, address, data, type], index) => log(transaction, index, address, data, type ?? "Misc"));
}

/** The core modules that give `contract-logs` without the ledger's state: `-fast` and what it requires. */
export const FAST_CORE = Object.freeze(["core-chain-events", "core-block-parsed", "core-contract-logs-fast"]);

/** What a run gives: the handle (stopped) and its database. */
export interface Run {
  readonly handle: UmbraDBHandle;
  readonly db: ProcessDatabase;
}

/** How a run is set up. */
export interface RunOptions {
  /** S, and the module's start unless `moduleStart` says otherwise. */
  readonly start: number;
  /** The in-memory chain's finalized head: the run processes up to it, then stops. */
  readonly head: number;
  readonly logs?: ReadonlyMap<bigint, readonly ContractLog[]>;
  /** The test provider's unresolved log sites per height (as `core-contract-logs-fast` gives them). */
  readonly unresolved?: ReadonlyMap<bigint, readonly UnresolvedLogSite[]>;
  /** The modules besides the provider (default: `token-metadata` and `token-metadata-api`). */
  readonly modules?: readonly ModuleDeclaration[];
  /** Each module's entry start (default: `start`). */
  readonly moduleStart?: (id: string) => number;
  /**
   * Gives `contract-logs` with UmbraDB's own development-only provider, `core-contract-logs-fast` (and the core modules
   * it needs, `core-chain-events` and `core-block-parsed`), from S, in place of the test provider.
   */
  readonly fast?: boolean;
  /** Each in-memory block's own items (its ledger, its runtime). */
  readonly items?: (height: bigint) => InMemoryItems;
}

/** The configuration data of a run: the `core` entry from S, the provider and the modules from their starts. */
function runData(db: ProcessDatabase, modules: readonly ModuleDeclaration[], options: RunOptions) {
  const data = libraryData(db.setting, [], {}, options.start);
  const core = options.fast === true ? FAST_CORE.map((id) => ({ id, start: options.start, version: UMBRADB_VERSION, config: {} })) : [];
  return {
    entries: [
      ...data.entries,
      ...core,
      ...modules.map((m) => ({ id: m.id, start: options.moduleStart?.(m.id) ?? options.start, version: m.version, config: {} })),
    ],
  };
}

/** Starts a process on `db` with the provider and `options.modules`; resolves with its handle once `started` settles. */
export function startRun(db: ProcessDatabase, options: RunOptions, serve = false): UmbraDBHandle {
  const modules = [...(options.fast === true ? [] : [logsProvider(options.logs ?? new Map(), options.unresolved)]), ...(options.modules ?? [TOKEN_METADATA as ModuleDeclaration, TOKEN_METADATA_API as ModuleDeclaration])];
  const source = new InMemoryBlockSource({
    head: BigInt(options.head),
    ...(options.items === undefined ? {} : { items: (block) => options.items!(block.height) }),
  });
  return startUmbraDB({
    config: { data: runData(db, modules, options) },
    modules,
    source,
    ...(serve ? { network: { api: { port: 0 } } } : {}),
  });
}

/** Runs the process on `db` up to the head, then stops it. */
export async function runTo(db: ProcessDatabase, options: RunOptions): Promise<Run> {
  const handle = startRun(db, options);
  try {
    await handle.started;
    await cursorReaches(handle, BigInt(options.head));
  } finally {
    await handle.stop();
  }
  return { handle, db };
}

/** A GET's answer: its status, headers (names in lower case) and body as text and as JSON (undefined if none). */
export interface Got {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly text: string;
  readonly json: any;
}

/** GETs `path` (with its query) of a listener at `origin`. */
export async function get(origin: string, path: string, method = "GET"): Promise<Got> {
  const response = await fetch(`${origin}${path}`, { method });
  const text = await response.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    json = undefined;
  }
  return { status: response.status, headers: Object.fromEntries(response.headers), text, json };
}

/**
 * Runs the process on `db` up to the head with the module API listening on a free port, then runs `body` with its
 * origin while it still serves, then stops it.
 */
export async function serve<T>(db: ProcessDatabase, options: RunOptions, body: (origin: string, handle: UmbraDBHandle) => Promise<T>): Promise<T> {
  const handle = startRun(db, options, true);
  try {
    await handle.started;
    await cursorReaches(handle, BigInt(options.head));
    const api = handle.status().listening.api;
    if (api === null) throw new Error("the module API does not listen");
    return await body(`http://${api.host.includes(":") ? `[${api.host}]` : api.host}:${api.port}`, handle);
  } finally {
    await handle.stop();
  }
}

/** What a halted run gives: its status when it halted, and the failure `ended` gave. */
export interface Halt {
  readonly status: ReturnType<UmbraDBHandle["status"]>;
  readonly error: unknown;
}

/** Runs the process on `db` until processing ends (a halt, expected before the head), then stops it. */
export async function runToHalt(db: ProcessDatabase, options: RunOptions): Promise<Halt> {
  const handle = startRun(db, options);
  try {
    await handle.started;
    const ended = await Promise.race([
      handle.ended,
      cursorReaches(handle, BigInt(options.head)).then(() => ({ kind: "reached the head" as const })),
    ]);
    if (ended.kind !== "failed") throw new Error(`expected a halt, but processing ${ended.kind}`);
    return { status: handle.status(), error: ended.error };
  } finally {
    await handle.stop();
  }
}

/** An error and its causes, outermost first. */
export function causes(error: unknown): unknown[] {
  const out: unknown[] = [];
  for (let at = error; at !== undefined && at !== null && out.length < 10; at = (at as { cause?: unknown }).cause) out.push(at);
  return out;
}

/**
 * Runs `body` on a read of a stopped run's database through UmbraDB's own database API, at its cursor (PGlite: only
 * while no process holds the directory).
 */
export async function readStopped<T>(db: ProcessDatabase, body: (read: ReadHandle) => Promise<T>): Promise<T> {
  if (db.setting.kind === "pglite") {
    const opened = await openPglite({ dataDir: db.directory!, committedHeight: cursorHeight, developmentOptIn: true });
    try {
      return await opened.read(body);
    } finally {
      await opened.close();
    }
  }
  const { kind: _kind, ...connection } = db.setting as PostgresParts;
  const opened = openPostgres({ connection, committedHeight: cursorHeight, readConnections: 1 });
  try {
    return await opened.read(body);
  } finally {
    await opened.close();
  }
}

/**
 * The genesis hash's and header's records of `network`, as its node answered them (`test/ledger/fixtures/networks/`):
 * startup asks for them, and a mid-chain tape does not hold them, so they go before its records.
 */
export function genesisRecords(network: "mainnet" | "preprod" | "preview"): TapeRecord[] {
  const fixture = JSON.parse(readFileSync(new URL(`../../ledger/fixtures/networks/${network}.json`, import.meta.url), "utf8")) as {
    genesis: { hash: string };
    calls: TapeRecord[];
  };
  const wanted = (record: TapeRecord) =>
    "method" in record &&
    ((record.method === "chain_getBlockHash" && JSON.stringify(record.params) === "[0]") ||
      (record.method === "chain_getHeader" && JSON.stringify(record.params) === JSON.stringify([fixture.genesis.hash])));
  const records = fixture.calls.filter(wanted);
  if (records.length !== 2) throw new Error(`${network}'s fixture holds ${records.length} genesis records, not 2`);
  return records;
}
