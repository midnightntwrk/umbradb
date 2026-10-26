import { createHash } from "node:crypto";
import { headerHash } from "../../src/backbone/core-block-fetch/header.js";
import type { NodeHeader } from "../../src/node/decode.js";
import type { Json, TapeRecord } from "../../tools/tape/index.js";

/**
 * Synthetic chains and tapes for `core-block-fetch`'s tests (task 10.3): blocks, metadata and node answers in the shapes
 * a Midnight node gives them — the header and block JSON of `chain_getHeader` and `chain_getBlock`
 * (`test/node/fixtures/mainnet-answers.json`), the runtime version of `state_getRuntimeVersion`, metadata V14 as
 * `state_getMetadata` answers it —, and the tape records (TT-1) a tape node serves them with (`tools/tape/`). No real
 * node: task 0.3's real tapes replace these (task 18.2).
 *
 * **The metadata** is real-format V14 (`frame-metadata`'s `RuntimeMetadataPrefixed` over `scale-info`'s portable
 * registry) with only the pallets a test names; {@link MAINNET_PALLETS} gives the indices and calls of the runtime that
 * built mainnet block 3,174,332 (read from the Midnight node's own metadata files, task 10.3's probe: `Timestamp` 1 with
 * `set` 0, `Midnight` 5 with `send_mn_transaction` 0, `CNightObservation` 13, `FederatedAuthorityObservation` 45).
 *
 * **A block** has the real header items of a mainnet header (an Aura pre-runtime item) and the `MNSV` item of its
 * runtime, its body a `Timestamp::set` inherent (version 5, bare) and the ledger transactions given (version 4,
 * unsigned); its hash is the header's BLAKE2b-256, as the node's (`src/backbone/core-block-fetch/header.ts`, checked
 * against the real mainnet header elsewhere).
 */

// ── SCALE, written here independently of the code under test ──────────────────────────────────────────────────────

/** A SCALE compact integer. */
export function compact(value: bigint | number): number[] {
  const n = BigInt(value);
  if (n < 64n) return [Number(n) << 2];
  if (n < 16_384n) {
    const v = (Number(n) << 2) | 1;
    return [v & 0xff, v >> 8];
  }
  if (n < 1_073_741_824n) {
    const v = (Number(n) << 2) | 2;
    return [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];
  }
  const digits: number[] = [];
  for (let rest = n; rest > 0n; rest >>= 8n) digits.push(Number(rest & 0xffn));
  return [((digits.length - 4) << 2) | 3, ...digits];
}

const text = (value: string): number[] => {
  const bytes = [...Buffer.from(value, "utf8")];
  return [...compact(bytes.length), ...bytes];
};
const vec = <T>(items: readonly T[], each: (item: T) => number[]): number[] => [
  ...compact(items.length),
  ...items.flatMap(each),
];
const none = [0];
const some = (inner: number[]): number[] => [1, ...inner];

export const hex = (bytes: Uint8Array | readonly number[]): string => `0x${Buffer.from(bytes).toString("hex")}`;
export const unhex = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text.slice(2), "hex"));

// ── metadata V14 ─────────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * An argument's type in a test runtime's call: `Compact<u64>`, `Vec<u8>`, a plain `u64`, or `Compact<u32>` (whose two
 * types the registry holds only when a call uses it, so every other runtime's bytes stay as they are).
 */
export type ArgType = "compact-u64" | "bytes" | "u64" | "compact-u32";

/** A call of a test runtime's pallet. */
export interface CallSpec {
  readonly name: string;
  readonly index: number;
  readonly args: readonly ArgType[];
}

/** A pallet of a test runtime. */
export interface PalletSpec {
  readonly name: string;
  readonly index: number;
  readonly calls?: readonly CallSpec[];
}

/** The pallets of the runtime that built mainnet block 3,174,332 (see the module comment), with the calls it holds. */
export const MAINNET_PALLETS: readonly PalletSpec[] = Object.freeze([
  { name: "System", index: 0, calls: [{ name: "remark", index: 0, args: ["bytes"] }] },
  { name: "Timestamp", index: 1, calls: [{ name: "set", index: 0, args: ["compact-u64"] }] },
  { name: "Midnight", index: 5, calls: [{ name: "send_mn_transaction", index: 0, args: ["bytes"] }] },
  { name: "CNightObservation", index: 13, calls: [{ name: "process_tokens", index: 0, args: ["bytes"] }] },
  { name: "FederatedAuthorityObservation", index: 45, calls: [{ name: "reset_members", index: 0, args: ["bytes"] }] },
]);

/**
 * `pallets` as metadata of `version` (14 by default; 15 adds the pallets' documentation, and a test tail after them):
 * the magic, the version, a portable registry (`u8`, `u64`, `Compact<u64>`, `Vec<u8>`, a call enum per pallet with
 * calls, the extrinsic and runtime types), the pallets, and V14's extrinsic metadata and runtime type. With `full`, the
 * parts a real runtime has that the reader only steps over: a generic type with a parameter, a composite with named and
 * typed fields, each pallet's event and error enums and a constant, and two signed extensions.
 */
export function metadataOf(pallets: readonly PalletSpec[], version: 14 | 15 = 14, full = false): Uint8Array {
  const U8 = 0;
  const U64 = 1;
  const COMPACT_U64 = 2;
  const BYTES = 3;
  const narrow = pallets.some((pallet) => pallet.calls?.some((call) => call.args.includes("compact-u32")) === true);
  const U32 = 4;
  const COMPACT_U32 = 5;
  const argType = { "compact-u64": COMPACT_U64, bytes: BYTES, u64: U64, "compact-u32": COMPACT_U32 } as const;
  const type = (id: number, path: string[], def: number[]): number[] => [
    ...compact(id),
    ...vec(path, text),
    ...vec([], () => []),
    ...def,
    ...vec([], text),
  ];
  const field = (name: string, ty: number): number[] => [...some(text(name)), ...compact(ty), ...none, ...vec([], text)];
  const types: number[][] = [
    type(U8, [], [5, 3]),
    type(U64, [], [5, 6]),
    type(COMPACT_U64, [], [6, ...compact(U64)]),
    type(BYTES, [], [2, ...compact(U8)]),
  ];
  if (narrow) types.push(type(U32, [], [5, 5]), type(COMPACT_U32, [], [6, ...compact(U32)]));
  let next = narrow ? 6 : 4;
  const callTypes = new Map<string, number>();
  for (const pallet of pallets) {
    if (pallet.calls === undefined) continue;
    const id = next++;
    callTypes.set(pallet.name, id);
    const variants = vec(pallet.calls, (call) => [
      ...text(call.name),
      ...vec(call.args.map((arg, index) => [arg, index] as const), ([arg, index]) => field(`arg${index}`, argType[arg])),
      call.index,
      ...vec(["A call."], text),
    ]);
    types.push(type(id, [`pallet_${pallet.name.toLowerCase()}`, "pallet", "Call"], [1, ...variants]));
  }
  const extrinsic = next++;
  types.push(type(extrinsic, ["sp_runtime", "generic", "UncheckedExtrinsic"], [0, ...vec([], () => [])]));
  const runtime = next++;
  types.push(type(runtime, ["midnight_node_runtime", "Runtime"], [0, ...vec([], () => [])]));
  // The full metadata's extra types: Option<u64> (a generic with a parameter), an event enum, a composite with fields.
  const optional = next++;
  const events = next++;
  const record = next++;
  if (full) {
    types.push([
      ...compact(optional),
      ...vec(["Option"], text),
      ...vec([["T", U64]] as const, ([name, ty]) => [...text(name), ...some(compact(ty))]),
      1,
      ...vec(
        [
          ["None", 0, []],
          ["Some", 1, [U64]],
        ] as const,
        ([name, index, fields]) => [...text(name), ...vec(fields, (ty) => [...none, ...compact(ty), ...some(text("u64")), ...vec([], text)]), index, ...vec([], text)],
      ),
      ...vec(["An option."], text),
    ]);
    types.push(type(events, ["pallet", "Event"], [1, ...vec([["Done", 0]] as const, ([name, index]) => [...text(name), ...vec([], () => []), index, ...vec([], text)])]));
    types.push(
      type(record, ["pallet", "Record"], [
        0,
        ...vec([["amount", COMPACT_U64], ["note", BYTES]] as const, ([name, ty]) => field(name, ty)),
      ]),
    );
  }
  const pallet = (spec: PalletSpec): number[] => {
    const calls = callTypes.get(spec.name);
    return [
      ...text(spec.name),
      ...none,
      ...(calls === undefined ? none : some(compact(calls))),
      ...(full ? some(compact(events)) : none),
      ...(full ? vec([["Limit", U64, [1, 0, 0, 0, 0, 0, 0, 0]]] as const, ([name, ty, value]) => [...text(name), ...compact(ty), ...vec(value, (b) => [b]), ...vec(["A constant."], text)]) : vec([], () => [])),
      ...(full ? some(compact(events)) : none),
      spec.index,
      ...(version === 15 ? vec(["A pallet."], text) : []),
    ];
  };
  const extensions = full ? vec(["CheckNonce", "CheckWeight"], (name) => [...text(name), ...compact(U64), ...compact(record)]) : vec([], () => []);
  const tail = version === 14 ? [...compact(extrinsic), 4, ...extensions, ...compact(runtime)] : [0xee, 0xff];
  return Uint8Array.from([
    0x6d,
    0x65,
    0x74,
    0x61,
    version,
    ...compact(types.length),
    ...types.flat(),
    ...vec(pallets, pallet),
    ...tail,
  ]);
}

// ── extrinsics ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** An unsigned (version 4, `0x04`) or bare (version 5, `0x05`) extrinsic calling `pallet`'s `call` with `args`. */
export function bareExtrinsic(format: 0x04 | 0x05, pallet: number, call: number, args: readonly number[]): Uint8Array {
  const body = [format, pallet, call, ...args];
  return Uint8Array.from([...compact(body.length), ...body]);
}

/** A `Timestamp::set(now)` inherent (version 5, bare), the timestamp pallet at `pallet` (1 on Midnight). */
export function timestampSet(ms: bigint, pallet = 1): Uint8Array {
  return bareExtrinsic(0x05, pallet, 0, compact(ms));
}

/** A ledger transaction (`Midnight::send_mn_transaction`, version 4 unsigned) carrying `bytes`. */
export function ledgerTransaction(bytes: readonly number[]): Uint8Array {
  return bareExtrinsic(0x04, 5, 0, [...compact(bytes.length), ...bytes]);
}

// ── blocks ─────────────────────────────────────────────────────────────────────────────────────────────────────────

/** The node's `MNSV` digest item for `specVersion`: `DigestItem::Consensus(*b"MNSV", spec_version.encode())`. */
export function mnsvItem(specVersion: number): Uint8Array {
  const item = Uint8Array.of(0x04, 0x4d, 0x4e, 0x53, 0x56, 0x10, 0, 0, 0, 0);
  new DataView(item.buffer).setUint32(6, specVersion, true);
  return item;
}

/** A real mainnet header's Aura pre-runtime item (block 3,174,332). */
export const AURA_ITEM = unhex("0x0661757261201ac0cf1100000000");

/** The time of block 0 of the test chains, in milliseconds: 2025-06-15T15:06:40Z. */
export const CHAIN_START_MS = 1_750_000_000_000n;

/** A block of a test chain: the node's answers about it, and what the indexer should read of it. */
export interface ChainBlock {
  readonly height: bigint;
  readonly hash: Uint8Array;
  readonly hex: string;
  readonly parentHash: Uint8Array;
  /** `chain_getHeader`'s answer, also a head notification's `result`. */
  readonly header: Json;
  /** `chain_getBlock`'s answer. */
  readonly block: Json;
  readonly specVersion: number;
  readonly timestampMs: bigint;
  readonly extrinsics: readonly Uint8Array[];
}

/** What a test block is made of. */
export interface BlockOptions {
  /** The branch it is on: blocks of two branches at one height differ (their state roots, so their hashes). */
  readonly branch?: string;
  /** The `spec_version` of its `MNSV` item: 2_000_000 (v9 on preprod) unless given. */
  readonly specVersion?: number;
  /** Its time: {@link CHAIN_START_MS} + height × 6,000 unless given; none for no `Timestamp::set`. */
  readonly timestampMs?: bigint | null;
  /** The timestamp pallet's index the block's runtime has: 1 unless given. */
  readonly timestampPallet?: number;
  /** Its parent hash in place of its parent block's (a block that does not extend the chain). */
  readonly parentHash?: Uint8Array;
  /** More extrinsics after the timestamp. */
  readonly extrinsics?: readonly Uint8Array[];
}

const sha = (value: string): Uint8Array => new Uint8Array(createHash("sha256").update(value, "utf8").digest());

/** The block at `height` over `parent` (null for block 0). */
export function chainBlock(height: bigint, parent: ChainBlock | null, options: BlockOptions = {}): ChainBlock {
  const branch = options.branch ?? "a";
  const specVersion = options.specVersion ?? 2_000_000;
  const timestampMs = options.timestampMs === undefined ? CHAIN_START_MS + height * 6_000n : options.timestampMs;
  const parentHash = options.parentHash ?? parent?.hash ?? new Uint8Array(32);
  const extrinsics = [
    ...(timestampMs === null ? [] : [timestampSet(timestampMs, options.timestampPallet ?? 1)]),
    ...(options.extrinsics ?? []),
  ];
  const node: NodeHeader = {
    parentHash,
    number: height,
    stateRoot: sha(`state ${branch} ${height}`),
    extrinsicsRoot: sha(`extrinsics ${branch} ${height}`),
    digest: [AURA_ITEM, mnsvItem(specVersion)],
  };
  const hash = headerHash(node);
  const header: Json = {
    parentHash: hex(parentHash),
    number: `0x${height.toString(16)}`,
    stateRoot: hex(node.stateRoot),
    extrinsicsRoot: hex(node.extrinsicsRoot),
    digest: { logs: node.digest.map(hex) },
  };
  return Object.freeze({
    height,
    hash,
    hex: hex(hash),
    parentHash,
    header,
    block: { block: { header, extrinsics: extrinsics.map(hex) }, justifications: null },
    specVersion,
    timestampMs: timestampMs ?? 0n,
    extrinsics,
  });
}

/** Blocks 0 to `to` of one branch, each over the one before (`options` per height). */
export function chainOf(to: bigint, options: (height: bigint) => BlockOptions = () => ({})): ChainBlock[] {
  const blocks: ChainBlock[] = [];
  for (let height = 0n; height <= to; height++) blocks.push(chainBlock(height, blocks.at(-1) ?? null, options(height)));
  return blocks;
}

/** Blocks `from` to `to` of `branch` over `parent` (at `from` − 1). */
export function branchOf(parent: ChainBlock, to: bigint, branch: string, options: BlockOptions = {}): ChainBlock[] {
  const blocks: ChainBlock[] = [];
  for (let height = parent.height + 1n; height <= to; height++) {
    blocks.push(chainBlock(height, blocks.at(-1) ?? parent, { ...options, branch }));
  }
  return blocks;
}

// ── node answers and tape records ──────────────────────────────────────────────────────────────────────────────────

/** A runtime of a test chain: its `spec_version` and metadata. */
export interface Runtime {
  readonly specVersion: number;
  readonly metadata: Uint8Array;
}

/** The runtime of the test chains unless given: 2_000_000 (v9 on preprod) with {@link MAINNET_PALLETS}. */
export const RUNTIME: Runtime = Object.freeze({ specVersion: 2_000_000, metadata: metadataOf(MAINNET_PALLETS) });

/** `state_getRuntimeVersion`'s answer for `specVersion`, as a Midnight node gives it. */
export function runtimeVersion(specVersion: number): Json {
  return {
    specName: "midnight",
    implName: "midnight",
    authoringVersion: 1,
    specVersion,
    implVersion: 0,
    apis: [],
    transactionVersion: 2,
    systemVersion: 1,
  };
}

/** The subscription ids of the tapes: the finalized heads' and the new heads'. */
export const FINALIZED = "fin";
export const NEW_HEADS = "new";

/** The two subscriptions the node source makes, in its order: the finalized heads, then the new heads. */
export function subscriptions(): TapeRecord[] {
  return [
    { subscribe: FINALIZED, method: "chain_subscribeFinalizedHeads", params: [] },
    { subscribe: NEW_HEADS, method: "chain_subscribeNewHeads", params: [] },
  ];
}

/** `chain_getBlockHash(h)` and `chain_getHeader` of `block`: the block source's `block(h)` (startup's checks). */
export function blockRef(block: ChainBlock): TapeRecord[] {
  return [
    { method: "chain_getBlockHash", params: [Number(block.height)], result: block.hex },
    { method: "chain_getHeader", params: [block.hex], result: block.header },
  ];
}

/** `chain_getFinalizedHead` answering `block`, and `chain_getHeader` of it: the source reading the head. */
export function headRead(block: ChainBlock): TapeRecord[] {
  return [
    { method: "chain_getFinalizedHead", params: [], result: block.hex },
    { method: "chain_getHeader", params: [block.hex], result: block.header },
  ];
}

/**
 * The calls of `block`'s content: `chain_getBlock`, the runtime version at its parent's state (block 0: its own) and,
 * when `metadata`, that runtime's metadata there.
 */
export function content(block: ChainBlock, runtime: Runtime, metadata: boolean): TapeRecord[] {
  const at = block.height === 0n ? block.hex : hex(block.parentHash);
  return [
    { method: "chain_getBlock", params: [block.hex], result: block.block },
    { method: "state_getRuntimeVersion", params: [at], result: runtimeVersion(runtime.specVersion) },
    ...(metadata ? [{ method: "state_getMetadata", params: [at], result: hex(runtime.metadata) }] : []),
  ];
}

/** The calls of a finalized height: `chain_getBlockHash`, then {@link content}. */
export function finalized(block: ChainBlock, runtime: Runtime = RUNTIME, metadata = false): TapeRecord[] {
  return [{ method: "chain_getBlockHash", params: [Number(block.height)], result: block.hex }, ...content(block, runtime, metadata)];
}

/** A finalized-head notification of `block`. */
export function finalizedHead(block: ChainBlock): TapeRecord {
  return { notify: FINALIZED, result: block.header };
}

/** A new-head notification of `block`. */
export function newHead(block: ChainBlock): TapeRecord {
  return { notify: NEW_HEADS, result: block.header };
}

/**
 * A session's opening for a process starting on a database without a cursor: startup's `block(0)` (the genesis hash),
 * the subscriptions and the head read.
 */
export function opening(genesis: ChainBlock, head: ChainBlock): TapeRecord[] {
  return [...blockRef(genesis), ...subscriptions(), ...headRead(head)];
}
