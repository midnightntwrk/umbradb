/**
 * Real Dust events for the module's tests (spec 00062): `fixtures/dust-events.json` holds every Dust event of Preprod's
 * current era from its first height, 3,348,434, to 3,349,867, as the core stores them: 144 spends, 110 first coins and
 * 5 generation updates, whose commitments fill the Dust commitment tree's positions 0 to 253 (the core's
 * `dust_commitment_first_free` there is 254), and the core's stored Dust tree values (first free positions and roots) at
 * three of those heights, the oracle for both trees. No test chain can make such events without a Night registration. The
 * expected file entries and commitments are taken from the events with the vendored ledger build, independently of the
 * module's own decoding.
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

/** The core's stored Dust tree values at one Preprod height (roots in the ledger's untagged serialization, hexadecimal). */
export interface FixtureState {
  readonly height: number;
  readonly commitmentFirstFree: number;
  readonly commitmentRoot: string;
  readonly generationFirstFree: number;
  readonly generationRoot: string;
}

const parsed = JSON.parse(readFileSync(new URL("./fixtures/dust-events.json", import.meta.url), "utf8")) as { events: FixtureRow[]; states: FixtureState[] };
export const FIXTURE: readonly FixtureRow[] = parsed.events;
/** The core's stored Dust tree values at 3,348,434, 3,349,459 and 3,349,867: the oracle for both trees. */
export const FIXTURE_STATES: readonly FixtureState[] = parsed.states;

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

/** A first coin row's position and commitment (32 bytes, little-endian), computed with the ledger package. */
export function firstCoinOf(row: FixtureRow): { position: number; commitment: Uint8Array } {
  const output = (ledger.Event.deserialize(fromHex(row.bytes)).content as unknown as { output: ledger.QualifiedDustOutput }).output;
  let value = ledger.dustCommitment(output);
  const commitment = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    commitment[i] = Number(value & 0xffn);
    value >>= 8n;
  }
  return { position: Number(output.mtIndex), commitment };
}

/** Every commitment of the fixture up to `height`, by position (spends' from their rows, first coins' computed). */
export function commitmentsUpTo(height: number): Map<number, Uint8Array> {
  const out = new Map<number, Uint8Array>();
  for (const row of FIXTURE.filter((r) => r.height <= height)) {
    if (row.kind === "dust-spend-processed") out.set(row.treeIndex!, fromHex(row.commitment!));
    else if (row.kind === "dust-initial-utxo") {
      const c = firstCoinOf(row);
      out.set(c.position, c.commitment);
    }
  }
  return out;
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
