/**
 * Real Dust events for the module's tests (spec 00062): `fixtures/dust-events.json` holds Preprod's current-era events
 * as the core stores them (the era's first 10 spends, and every first coin and generation update of two owners up to
 * height 3,349,867), which no test chain can make without a Night registration. The expected file entries are taken
 * from the events with the vendored ledger build, independently of the module's own decoding.
 */

import { readFileSync } from "node:fs";
import * as ledger from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import type { DustEntry } from "../shared/index.ts";
import type { DustEvent, DustEventKind } from "../server/dust-index.ts";

export { ledger };

/** One stored row of the fixture, at its Preprod height. */
export interface FixtureRow {
  readonly height: number;
  readonly txIndex: number;
  readonly eventIndex: number;
  readonly kind: DustEventKind;
  readonly treeIndex: number | null;
  readonly nullifier: string | null;
  readonly commitment: string | null;
  readonly bytes: string;
}

const fromHex = (hex: string): Uint8Array => Uint8Array.from(Buffer.from(hex, "hex"));

export const FIXTURE: readonly FixtureRow[] = (
  JSON.parse(readFileSync(new URL("./fixtures/dust-events.json", import.meta.url), "utf8")) as { events: FixtureRow[] }
).events;

/** A fixture row as the module's index takes it, at `height` (its own unless given). */
export function dustEventOf(row: FixtureRow, height = row.height): DustEvent {
  return {
    height,
    txIndex: row.txIndex,
    kind: row.kind,
    bytes: fromHex(row.bytes),
    nullifier: row.nullifier === null ? null : fromHex(row.nullifier),
    commitment: row.commitment === null ? null : fromHex(row.commitment),
    treeIndex: row.treeIndex,
  };
}

/** The file entry of a spend row, read from the event with the ledger package. */
export function entryOf(row: FixtureRow): DustEntry {
  const c = ledger.Event.deserialize(fromHex(row.bytes)).content as unknown as { vFee: bigint; declaredTime: Date; commitmentIndex: bigint };
  return { prefix: fromHex(row.nullifier!).slice(0, 4), time: c.declaredTime.getTime() / 1000, fee: c.vFee, position: Number(c.commitmentIndex) };
}

/** The owner (Dust public key) of a first coin or a generation update row. */
export function ownerOf(row: FixtureRow): bigint {
  const c = ledger.Event.deserialize(fromHex(row.bytes)).content as unknown as { output?: { owner: bigint }; update?: { annotation: { owner: bigint } } };
  return row.kind === "dust-initial-utxo" ? c.output!.owner : c.update!.annotation.owner;
}

export const spendRows = (): FixtureRow[] => FIXTURE.filter((r) => r.kind === "dust-spend-processed");
export const coinRows = (): FixtureRow[] => FIXTURE.filter((r) => r.kind !== "dust-spend-processed");

/** The fixture's rows grouped by height, in chain order. */
export function byHeight(rows: readonly FixtureRow[]): { height: number; rows: FixtureRow[] }[] {
  const out: { height: number; rows: FixtureRow[] }[] = [];
  for (const row of rows) {
    if (out.at(-1)?.height !== row.height) out.push({ height: row.height, rows: [] });
    out.at(-1)!.rows.push(row);
  }
  return out;
}
