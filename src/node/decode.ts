/**
 * The node's answers, read into typed values, and the parameters the client sends.
 *
 * Substrate's JSON-RPC writes bytes as `0x`-prefixed hex, a block number in a header as a hex quantity (`"0x306fbc"`),
 * and `midnight_ledgerStateRoot` as a JSON array of byte values (a `Vec<u8>`, `midnight-node`
 * `pallets/midnight/rpc/src/lib.rs:60-61`; 33 bytes on mainnet, 2026-10-25). Each reader checks the shape it reads and
 * throws a `node-error` `bad-answer` naming the JSON path, what it found and a short value otherwise
 * (`./errors.ts`), so a malformed answer is never read as `NaN`, an empty array or a short hash. The values returned
 * are frozen.
 *
 * Parameters are written as the node reads them and always in one form, so that a recorded tape matches the calls a
 * later run makes: hashes and keys as lowercase `0x` hex, heights as JSON numbers. [TT-2]
 */

import { badAnswer, invalidParameter } from "./errors.js";
import type { NodeMethod } from "./methods.js";

/** A block header as the node reports it (`chain_getHeader`, `chain_getBlock`, and every head notification). */
export interface NodeHeader {
  readonly parentHash: Uint8Array;
  readonly number: bigint;
  readonly stateRoot: Uint8Array;
  readonly extrinsicsRoot: Uint8Array;
  /** The digest items, each as the node sent it (SCALE-encoded); the runtime's `MNSV` item is among them. */
  readonly digest: readonly Uint8Array[];
}

/** A block (`chain_getBlock`): its header and its extrinsics, each as the node sent it (SCALE-encoded). */
export interface NodeBlock {
  readonly header: NodeHeader;
  readonly extrinsics: readonly Uint8Array[];
}

/** A runtime version (`state_getRuntimeVersion`): the fields the indexer reads, and the whole answer as `raw`. */
export interface NodeRuntimeVersion {
  readonly specName: string;
  readonly specVersion: number;
  readonly implVersion: number;
  readonly transactionVersion: number;
  readonly raw: Readonly<Record<string, unknown>>;
}

const HEX_BYTES = /^0x(?:[0-9a-fA-F]{2})*$/;
const HEX_QUANTITY = /^0x[0-9a-fA-F]+$/;
const HEX_DIGITS = "0123456789abcdef";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** `bytes` as lowercase `0x` hex. */
export function toHex(bytes: Uint8Array): string {
  let text = "0x";
  for (const byte of bytes) text += (HEX_DIGITS[byte >> 4] as string) + (HEX_DIGITS[byte & 15] as string);
  return text;
}

/** `0x` hex bytes from the node. */
export function bytesAnswer(method: NodeMethod, path: string, value: unknown): Uint8Array {
  if (typeof value !== "string" || !HEX_BYTES.test(value)) {
    throw badAnswer(method, path, value, "0x-prefixed hex bytes");
  }
  const bytes = new Uint8Array((value.length - 2) / 2);
  for (let index = 0; index < bytes.length; index++) {
    bytes[index] = Number.parseInt(value.slice(2 + 2 * index, 4 + 2 * index), 16);
  }
  return bytes;
}

/** A 32-byte block hash from the node. */
export function hashAnswer(method: NodeMethod, path: string, value: unknown): Uint8Array {
  const bytes = typeof value === "string" && value.length === 66 ? bytesAnswer(method, path, value) : undefined;
  if (bytes === undefined) throw badAnswer(method, path, value, "a 32-byte hash in 0x hex");
  return bytes;
}

function quantityAnswer(method: NodeMethod, path: string, value: unknown): bigint {
  if (typeof value !== "string" || !HEX_QUANTITY.test(value)) throw badAnswer(method, path, value, "a 0x hex number");
  return BigInt(value);
}

function bytesListAnswer(method: NodeMethod, path: string, value: unknown): readonly Uint8Array[] {
  if (!Array.isArray(value)) throw badAnswer(method, path, value, "an array of 0x hex bytes");
  return Object.freeze(value.map((item, index) => bytesAnswer(method, `${path}[${index}]`, item)));
}

/** A header, at `path` of the answer. */
export function headerAnswer(method: NodeMethod, path: string, value: unknown): NodeHeader {
  if (!isRecord(value)) throw badAnswer(method, path, value, "a header");
  const parentHash = hashAnswer(method, `${path}.parentHash`, value.parentHash);
  const number = quantityAnswer(method, `${path}.number`, value.number);
  const stateRoot = hashAnswer(method, `${path}.stateRoot`, value.stateRoot);
  const extrinsicsRoot = hashAnswer(method, `${path}.extrinsicsRoot`, value.extrinsicsRoot);
  const logs = isRecord(value.digest) ? value.digest.logs : undefined;
  const digest = bytesListAnswer(method, `${path}.digest.logs`, logs);
  return Object.freeze({ parentHash, number, stateRoot, extrinsicsRoot, digest });
}

/** A block (`chain_getBlock`'s `{ block: { header, extrinsics }, justifications }`). */
export function blockAnswer(method: NodeMethod, value: unknown): NodeBlock {
  const block = isRecord(value) ? value.block : undefined;
  if (!isRecord(block)) throw badAnswer(method, "result.block", block, "a block");
  const header = headerAnswer(method, "result.block.header", block.header);
  const extrinsics = bytesListAnswer(method, "result.block.extrinsics", block.extrinsics);
  return Object.freeze({ header, extrinsics });
}

function versionNumber(method: NodeMethod, value: Record<string, unknown>, field: string): number {
  const number = value[field];
  if (!Number.isSafeInteger(number) || (number as number) < 0) {
    throw badAnswer(method, `result.${field}`, number, "a non-negative integer");
  }
  return number as number;
}

/** A JSON value, copied and deeply frozen. */
function frozenCopy(value: unknown): unknown {
  if (Array.isArray(value)) return Object.freeze(value.map(frozenCopy));
  if (isRecord(value)) {
    return Object.freeze(Object.fromEntries(Object.entries(value).map(([key, item]) => [key, frozenCopy(item)])));
  }
  return value;
}

/** A runtime version. */
export function runtimeVersionAnswer(method: NodeMethod, value: unknown): NodeRuntimeVersion {
  if (!isRecord(value)) throw badAnswer(method, "result", value, "a runtime version");
  if (typeof value.specName !== "string") throw badAnswer(method, "result.specName", value.specName, "a string");
  return Object.freeze({
    specName: value.specName,
    specVersion: versionNumber(method, value, "specVersion"),
    implVersion: versionNumber(method, value, "implVersion"),
    transactionVersion: versionNumber(method, value, "transactionVersion"),
    raw: frozenCopy(value) as Readonly<Record<string, unknown>>,
  });
}

/** `midnight_ledgerStateRoot`'s answer: a JSON array of byte values. */
export function byteArrayAnswer(method: NodeMethod, value: unknown): Uint8Array {
  if (!Array.isArray(value)) throw badAnswer(method, "result", value, "an array of byte values");
  value.forEach((item: unknown, index) => {
    if (!Number.isInteger(item) || (item as number) < 0 || (item as number) > 255) {
      throw badAnswer(method, `result[${index}]`, item, "a byte value (0 to 255)");
    }
  });
  return Uint8Array.from(value as number[]);
}

/** A list of `0x` hex byte strings (`state_getKeysPaged`). */
export function keysAnswer(method: NodeMethod, value: unknown): readonly Uint8Array[] {
  return bytesListAnswer(method, "result", value);
}

/** A JSON object (`system_properties`), copied and frozen. */
export function objectAnswer(method: NodeMethod, value: unknown): Readonly<Record<string, unknown>> {
  if (!isRecord(value)) throw badAnswer(method, "result", value, "an object");
  return frozenCopy(value) as Readonly<Record<string, unknown>>;
}

/** A 32-byte hash parameter, as `0x` hex. */
export function hashParameter(method: NodeMethod, parameter: string, value: unknown): string {
  if (!(value instanceof Uint8Array) || value.length !== 32) {
    throw invalidParameter(method, parameter, "a 32-byte Uint8Array");
  }
  return toHex(value);
}

/** A byte-string parameter (a storage key or prefix), as `0x` hex. */
export function bytesParameter(method: NodeMethod, parameter: string, value: unknown): string {
  if (!(value instanceof Uint8Array)) throw invalidParameter(method, parameter, "a Uint8Array");
  return toHex(value);
}

/** A height parameter, as a JSON number (0 to 2^53 − 1). */
export function heightParameter(method: NodeMethod, value: unknown): number {
  if (typeof value !== "bigint" || value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw invalidParameter(method, "height", "a bigint from 0 to 2^53 - 1");
  }
  return Number(value);
}

/** A positive integer parameter (a page size). */
export function countParameter(method: NodeMethod, parameter: string, value: unknown): number {
  if (!Number.isSafeInteger(value) || (value as number) < 1) {
    throw invalidParameter(method, parameter, "a positive integer");
  }
  return value as number;
}
