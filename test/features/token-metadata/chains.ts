import fc from "fast-check";
import type { ContractLog } from "../../../src/backbone/contract-logs/contract-logs.js";
import type { ObservedEvent } from "../../../src/features/token-metadata/state.ts";
import {
  encodePayload,
  EVENT_NAME,
  type MetadataRecord,
  record,
  recordsSize,
  splitMiscData,
  toHex,
} from "../../../src/features/token-metadata/vendor/mip0018/codec/src/index.ts";
import { cellData, log } from "./harness.js";

/**
 * Generated chains of MIP-0018 candidates for `token-metadata`'s property and differential tests: blocks of
 * transactions of logs, each a valid event (identities from a small pool, so fields are set and deleted again), an
 * invalid one (a reserved value type), or one under another name.
 */

/** S of a generated chain's database: its blocks are at S + 1 … */
export const S = 20;
/** The network name the reference model is given. */
export const NETWORK = "n";

/** One generated log: a valid event, an invalid one (a reserved value type), or one under another name. */
export type Generated =
  | { readonly kind: "event"; readonly contract: number; readonly domain: number; readonly tokenKind: 1 | 2 | 3; readonly records: readonly MetadataRecord[] }
  | { readonly kind: "invalid"; readonly contract: number; readonly domain: number }
  | { readonly kind: "foreign"; readonly contract: number };

const KEYS = ["name", "symbol", "decimals", "standards", "image", "extra"] as const;

const recordArb: fc.Arbitrary<MetadataRecord> = fc.oneof(
  fc.constantFrom(...KEYS).map((key) => record.tombstone(key)),
  fc.tuple(fc.constantFrom("name", "symbol", "extra"), fc.constantFrom("Acme", "ACME", "acme", "Zeta Ω", "x".repeat(70))).map(([k, v]) => record.utf8(k, v)),
  fc.tuple(fc.constantFrom("decimals", "extra"), fc.integer({ min: 0, max: 300 })).map(([k, v]) => record.uint(k, v)),
  fc.constantFrom(record.utf8("standards", "mip-0004"), record.uri("image", "https://example.com/a.png"), record.bytes("name", Uint8Array.of(1))),
);

const generatedArb: fc.Arbitrary<Generated> = fc.oneof(
  { weight: 6, arbitrary: fc.record({ kind: fc.constant("event" as const), contract: fc.integer({ min: 1, max: 2 }), domain: fc.integer({ min: 1, max: 2 }), tokenKind: fc.constantFrom(1 as const, 2 as const, 3 as const), records: fc.array(recordArb, { minLength: 1, maxLength: 4 }).filter((records) => recordsSize(records) <= 256 - 33) }) },
  { weight: 1, arbitrary: fc.record({ kind: fc.constant("invalid" as const), contract: fc.integer({ min: 1, max: 2 }), domain: fc.integer({ min: 1, max: 2 }) }) },
  { weight: 1, arbitrary: fc.record({ kind: fc.constant("foreign" as const), contract: fc.integer({ min: 1, max: 2 }) }) },
);

/** Blocks of transactions of logs. */
export const chainArb = fc.array(fc.array(fc.array(generatedArb, { minLength: 1, maxLength: 3 }), { minLength: 0, maxLength: 3 }), { minLength: 1, maxLength: 5 });

const bytes32 = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);

/** The chain's logs per height (block i at S + 1 + i) and its events as the model takes them, block by block. */
export function build(chain: readonly (readonly (readonly Generated[])[])[]) {
  const logs = new Map<bigint, ContractLog[]>();
  const events: ObservedEvent[][] = [];
  chain.forEach((block, i) => {
    const height = S + 1 + i;
    const out: ContractLog[] = [];
    const observed: ObservedEvent[] = [];
    block.forEach((transaction, tx) => {
      transaction.forEach((g, event) => {
        const data = cellData(rawOf(g));
        out.push(log(tx, out.length, bytes32(g.contract), data));
        // The model is given the event as the module reads it: the atom's bytes, zero-extended, split 32 + 256.
        const atom = (() => {
          const full = new Uint8Array(288);
          const raw = rawOf(g);
          full.set(raw.subarray(0, 288));
          return full;
        })();
        const split = splitMiscData(atom)!;
        observed.push({ network: NETWORK, position: { block: height, tx, event }, contractAddress: toHex(bytes32(g.contract)), type: "Misc", name: split.name, payload: split.payload });
      });
    });
    logs.set(BigInt(height), out);
    events.push(observed);
  });
  return { logs, events, head: S + chain.length + 1 };
}

/** The name ‖ payload bytes a generated log carries. */
function rawOf(g: Generated): Uint8Array {
  const name = new Uint8Array(32);
  let payload: Uint8Array;
  if (g.kind === "foreign") {
    name.set(new TextEncoder().encode("mip-0018:token-metadata[v2]"));
    payload = encodePayload({ domainSep: bytes32(1), kind: 1 }, [record.utf8("name", "Foreign")]);
  } else if (g.kind === "invalid") {
    name.set(EVENT_NAME);
    payload = encodePayload({ domainSep: bytes32(g.domain), kind: 1 }, [record.utf8("name", "Bad")]);
    payload[33 + 1 + 4] = 6;
  } else {
    name.set(EVENT_NAME);
    payload = encodePayload({ domainSep: bytes32(g.domain), kind: g.tokenKind }, g.records);
  }
  const out = new Uint8Array(32 + payload.length);
  out.set(name);
  out.set(payload, 32);
  return out;
}
