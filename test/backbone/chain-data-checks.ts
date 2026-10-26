import { z } from "zod";
import type { BlockParsed } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import type { ChainEvent } from "../../src/backbone/core-chain-events/events.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import type { Json, Scenario } from "./chain-data-tapes.js";
import { compact, hex } from "./fetch-fixtures.js";

/**
 * The oracles of task 11.1's criteria (A91–A93), shared by `chain-data.test.ts` and its negative controls: each reads the
 * database after a process ran a scenario (`./chain-data-tapes.ts`) and lists what differs from what the scenario's
 * chain holds — empty when the criterion holds. Imports nothing of Vitest.
 */

/** `value` as JSON with every object's keys sorted (jsonb reads keys back in its own order) and bigints marked. */
const text = (value: unknown): string =>
  JSON.stringify(value, (_key, v: unknown) => {
    if (typeof v === "bigint") return `${v}n`;
    if (v === null || typeof v !== "object" || Array.isArray(v)) return v;
    return Object.fromEntries(Object.entries(v as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  });

/** What the items watcher saw at each height's `on-compute`: the core modules' `block` items. */
export interface ItemsSeen {
  readonly events: Map<bigint, readonly ChainEvent[]>;
  readonly parsed: Map<bigint, BlockParsed>;
  readonly results: Map<bigint, readonly string[]>;
}

export function itemsSeen(): ItemsSeen {
  return { events: new Map(), parsed: new Map(), results: new Map() };
}

/** A user module requiring `items` of the core modules and recording them at `on-compute`. */
export function itemsWatcher(seen: ItemsSeen, items: readonly ("chain-events" | "block-parsed" | "tx-results")[]): ModuleDeclaration {
  return {
    id: "items-watch",
    version: "1.0.0",
    side: "public",
    requires: [...items],
    provides: [{ name: "items-rows", lifetimes: ["table"], table: { schema: "items_watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE items_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b) {
        if (items.includes("chain-events")) seen.events.set(b.height, b.items.get("chain-events") as readonly ChainEvent[]);
        if (items.includes("block-parsed")) seen.parsed.set(b.height, b.items.get("block-parsed") as BlockParsed);
        if (items.includes("tx-results")) seen.results.set(b.height, b.items.get("tx-results") as readonly string[]);
      },
    },
  };
}

/**
 * A91 (CD-4): `core_chain_events.events` holds exactly one row per event of every processed height, in order, with its
 * phase, extrinsic index, pallet, name, bytes and fields as the scenario's chain holds them, and the rows of each height
 * give its `System::Events` value back byte for byte (a height without a value: no row).
 */
export async function a91Problems(db: ProcessDatabase, scenario: Scenario, through: bigint = scenario.head): Promise<string[]> {
  const problems: string[] = [];
  // Every value as text, so that both backends' drivers read them alike (`ProcessDatabase.query` is a plain driver's).
  const rows = (
    await db.query(
      "SELECT height::text AS height, event_index::text AS event_index, phase, extrinsic_index::text AS extrinsic_index, " +
        "pallet, name, encode(bytes, 'hex') AS bytes, fields::text AS fields " +
        "FROM core_chain_events.events AS e ORDER BY e.height, e.event_index",
    )
  ).map((row) => ({
    height: BigInt(row.height as string),
    event_index: BigInt(row.event_index as string),
    phase: row.phase,
    extrinsic_index: row.extrinsic_index === null ? null : Number(row.extrinsic_index),
    pallet: row.pallet,
    name: row.name,
    bytes: `0x${row.bytes as string}`,
    fields: JSON.parse(row.fields as string) as unknown,
  }));
  for (let h = scenario.start; h <= through; h++) {
    const expected = scenario.events.get(h) ?? [];
    const got = rows.filter((row) => row.height === h);
    if (got.length !== expected.length) problems.push(`height ${h}: ${got.length} events stored, ${expected.length} on the chain`);
    expected.forEach((event, index) => {
      const row = got[index];
      if (row === undefined) return;
      const want = {
        event_index: BigInt(index),
        phase: event.phase,
        extrinsic_index: event.extrinsicIndex,
        pallet: event.pallet,
        name: event.name,
        bytes: hex(event.record),
        fields: event.fields,
      };
      const have = { ...row } as Record<string, unknown>;
      delete have.height;
      if (text(have) !== text(want)) problems.push(`height ${h} event ${index}: stored ${text(have)}, expected ${text(want)}`);
    });
    const value = scenario.values.get(h) ?? null;
    if (value !== null) {
      const rebuilt = Uint8Array.from([...compact(got.length), ...got.flatMap((row) => [...Buffer.from(row.bytes.slice(2), "hex")])]);
      if (hex(rebuilt) !== hex(value)) problems.push(`height ${h}: the rows do not give System::Events back byte for byte`);
    }
  }
  const beyond = rows.filter((row) => row.height < scenario.start || row.height > through);
  if (beyond.length > 0) problems.push(`${beyond.length} events stored outside ${scenario.start}–${through}`);
  return problems;
}

/** `core_block_parsed.transactions`' rows, by height and index, read as text by either backend's driver. */
async function parsedRows(db: ProcessDatabase): Promise<Record<string, unknown>[]> {
  const parsed = await db.query(
    "SELECT height::text AS height, tx_index::text AS tx_index, encode(tx_hash, 'hex') AS tx_hash, kind, size::text AS size " +
      "FROM core_block_parsed.transactions AS t ORDER BY t.height, t.tx_index",
  );
  return parsed.map((row) => ({
    height: BigInt(row.height as string),
    tx_index: BigInt(row.tx_index as string),
    tx_hash: `0x${row.tx_hash as string}`,
    kind: row.kind,
    size: Number(row.size),
  }));
}

/** `core_tx_results.results`' rows, by height and index. */
async function resultRows(db: ProcessDatabase): Promise<Record<string, unknown>[]> {
  const results = await db.query(
    "SELECT height::text AS height, tx_index::text AS tx_index, outcome FROM core_tx_results.results AS r " +
      "ORDER BY r.height, r.tx_index",
  );
  return results.map((row) => ({ height: BigInt(row.height as string), tx_index: BigInt(row.tx_index as string), outcome: row.outcome }));
}

/**
 * A92 (CD-5): `core_block_parsed.transactions` holds the scenario's transactions — in their order, from 0 per block,
 * with the ledger's hash, kind and size — and each was parsed exactly once: `deserialized` lists the bytes of every
 * native deserialization the ledger package made while the process ran (`Transaction.deserialize`,
 * `SystemTransaction.deserialize`), counted calls.
 */
export async function a92Problems(db: ProcessDatabase, scenario: Scenario, deserialized: readonly Uint8Array[]): Promise<string[]> {
  const problems: string[] = [];
  const want = scenario.transactions.map((t) => ({ height: t.height, tx_index: BigInt(t.index), tx_hash: hex(t.hash), kind: t.kind, size: t.bytes.length }));
  const have = await parsedRows(db);
  if (text(have) !== text(want)) problems.push(`core_block_parsed.transactions holds ${text(have)}, expected ${text(want)}`);
  for (const t of scenario.transactions) {
    const times = deserialized.filter((bytes) => hex(bytes) === hex(t.bytes)).length;
    if (times !== 1) problems.push(`transaction ${t.index} of height ${t.height} was parsed ${times} times, not once`);
  }
  const others = deserialized.filter((bytes) => !scenario.transactions.some((t) => hex(t.bytes) === hex(bytes)));
  if (others.length > 0) problems.push(`${others.length} parses of bytes that are none of the block's transactions`);
  return problems;
}

/** A93 (CD-6): `core_tx_results.results` holds each transaction's outcome, as its chain event gives it. */
export async function a93Problems(db: ProcessDatabase, scenario: Scenario): Promise<string[]> {
  const results = await resultRows(db);
  const want = scenario.transactions.map((t) => ({ height: t.height, tx_index: BigInt(t.index), outcome: t.outcome }));
  return text(results) === text(want) ? [] : [`core_tx_results.results holds ${text(results)}, expected ${text(want)}`];
}

/** The JSON value's text, for messages. */
export const jsonText = (value: Json): string => JSON.stringify(value);
