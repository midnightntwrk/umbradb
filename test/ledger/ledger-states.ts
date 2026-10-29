import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import * as v8 from "../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js";
import * as v9 from "../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { free, hex } from "./node-format.js";

// Small ledger states built with the vendored packages' published API, for the tests of their node-store exports.

export const V8_PACKAGE_PATH = fileURLToPath(
  new URL("../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js", import.meta.url),
);
export const V9_PACKAGE_PATH = fileURLToPath(
  new URL("../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js", import.meta.url),
);
/** Ledger v9 as runtime 2.0 built it (`crate-ledger-9.1.0.0-rc.3`). */
export const V9_RC3_PACKAGE_PATH = fileURLToPath(
  new URL("../../vendor/ledger/v9-rc3/pkg/midnight_ledger_wasm_v9_fs.js", import.meta.url),
);

export function contractAddress(seed: string): Uint8Array {
  return Uint8Array.from(createHash("sha256").update(`contract:${seed}`).digest());
}

/** A 32-byte cell derived from `seed`; a bytes atom in normal form has no trailing zero byte. */
export function cell(seed: string, index: number): v9.AlignedValue {
  const bytes = Uint8Array.from(createHash("sha256").update(`cell:${seed}:${index}`).digest());
  bytes[31] = bytes[31]! | 1;
  return { value: [bytes], alignment: [{ tag: "atom", value: { tag: "bytes", length: 32 } }] };
}

/**
 * A cell of `length` bytes derived from `seed`. Above the ledger's 1,024-byte embedding limit it is stored as a node of
 * its own instead of being embedded in its parent.
 */
export function bigCell(seed: string, index: number, length: number): v9.AlignedValue {
  const bytes = new Uint8Array(length);
  for (let offset = 0; offset < length; offset += 32) {
    bytes.set(createHash("sha256").update(`big:${seed}:${index}:${offset}`).digest().subarray(0, length - offset), offset);
  }
  bytes[length - 1] = bytes[length - 1]! | 1;
  return { value: [bytes], alignment: [{ tag: "atom", value: { tag: "bytes", length } }] };
}

/**
 * A blank v8 state with one contract whose state is an array of three small cells and two cells too large to embed,
 * derived from `seed`. Every intermediate object is freed, so that only the returned state holds its nodes.
 */
export function makeV8State(seed: string): v8.LedgerState {
  const cells = [cell(seed, 0), cell(seed, 1), cell(seed, 2), bigCell(seed, 0, 1500), bigCell(seed, 1, 1300)];
  let value = v8.StateValue.newArray();
  for (const aligned of cells) {
    const item = v8.StateValue.newCell(aligned);
    const next = value.arrayPush(item);
    free(item);
    free(value);
    value = next;
  }
  const charged = new v8.ChargedState(value);
  free(value);
  const blank = v8.LedgerState.blank(`umbradb-${seed}`);
  const state = blank.updateIndex(hex(contractAddress(seed)), charged, new Map());
  free(charged);
  free(blank);
  return state;
}

/**
 * A blank v9 state with one contract whose state is an array of three small cells and two cells too large to embed,
 * derived from `seed`. Every intermediate object is freed, so that only the returned state holds its nodes.
 */
export function makeV9State(seed: string): v9.LedgerState {
  const cells = [cell(seed, 0), cell(seed, 1), cell(seed, 2), bigCell(seed, 0, 1500), bigCell(seed, 1, 1300)];
  let value = v9.StateValue.newArray();
  for (const aligned of cells) {
    const item = v9.StateValue.newCell(aligned);
    const next = value.arrayPush(item);
    free(item);
    free(value);
    value = next;
  }
  const charged = new v9.ChargedState(value);
  free(value);
  const blank = v9.LedgerState.blank(`umbradb-${seed}`);
  const state = blank.updateIndex(hex(contractAddress(seed)), charged, new Map());
  free(charged);
  free(blank);
  return state;
}
