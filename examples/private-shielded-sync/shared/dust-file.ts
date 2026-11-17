/**
 * The Dust file (spec 00062 FR-001 to FR-006): every Dust spend of the current ledger era as a small entry, in chain
 * order, cut into chunks a wallet can decode one at a time. Platform-neutral: no `node:` import, so the server module,
 * the command-line wallet and a browser use the same code.
 *
 * An entry is what a wallet needs to follow a chain of Dust coins: enough of the spent coin's nullifier to find its own
 * spend, and the three public values the next coin is derived from (`successorDustUtxo`): the time the spend declared,
 * the fee it paid and the position of the new coin's commitment in the Dust commitment tree.
 *
 * A chunk, integers as unsigned LEB128 unless said otherwise:
 *
 * | Part | Content |
 * |---|---|
 * | Magic | `PSSDUST1`, 8 bytes |
 * | Header | number of the first entry, entry count, prefix bytes (one byte), block height of the first entry, declared time of the first entry (seconds), commitment position of the first entry |
 * | Prefixes | count × prefix bytes: the first bytes of each nullifier's 32-byte little-endian encoding |
 * | Fee list | count, then the fees that occur more than once in the chunk, most frequent first |
 * | Times | byte length, then per entry the difference from the previous entry's time, zigzag (0 for the first) |
 * | Fees | byte length, then per entry the fee's place in the fee list plus one, or 0 followed by the fee in full |
 * | Positions | byte length, then per entry the difference from the previous entry's position minus one (0 for the first) |
 *
 * The prefixes come first and have a fixed width, so a wallet searches them without decoding the rest. A full chunk is
 * a function of its own entries only, so it never changes once the file has grown past it.
 */

/** Entries per chunk. */
export const DUST_CHUNK_ENTRIES = 4096;
/** Bytes of each nullifier kept in an entry. */
export const DUST_PREFIX_BYTES = 4;
/** The largest fee: the ledger's `v_fee` is 128 bits. */
export const DUST_MAX_FEE = (1n << 128n) - 1n;

const MAGIC = new TextEncoder().encode("PSSDUST1");

/** One Dust spend, as the file lists it. */
export interface DustEntry {
  /** The first bytes of the spent coin's nullifier (its 32-byte little-endian encoding). */
  readonly prefix: Uint8Array;
  /** The time the spend declared, in seconds since the Unix epoch. */
  readonly time: number;
  /** The fee the spend paid, in Specks. */
  readonly fee: bigint;
  /** The position of the new coin's commitment in the Dust commitment tree. */
  readonly position: number;
}

/** A decoded chunk, one array per field. */
export interface DustChunk {
  /** The number of the chunk's first entry in the file (0 for the file's first entry). */
  readonly first: number;
  /** The block height of the first entry. */
  readonly firstHeight: number;
  readonly prefixBytes: number;
  readonly count: number;
  /** `count × prefixBytes` bytes. */
  readonly prefixes: Uint8Array;
  /** Declared times, in seconds. */
  readonly times: Float64Array;
  readonly fees: readonly bigint[];
  /** Commitment positions. */
  readonly positions: Float64Array;
}

/** How many bytes each part of an encoded chunk takes, and how many fees are stored by their place in the fee list. */
export interface DustChunkLayout {
  readonly header: number;
  readonly prefixes: number;
  readonly feeList: number;
  readonly times: number;
  readonly fees: number;
  readonly positions: number;
  readonly total: number;
  readonly feeListValues: number;
  readonly feesByIndex: number;
}

/** One chunk of the file, as the manifest lists it. */
export interface DustChunkRef {
  readonly first: number;
  readonly count: number;
  readonly firstHeight: number;
  readonly lastHeight: number;
  readonly bytes: number;
  /** SHA-256 of the chunk's bytes, hexadecimal. */
  readonly sha256: string;
}

/** What a wallet reads first: where the file starts, how far it reaches and its chunks. */
export interface DustManifest {
  readonly version: 1;
  /** The first block height of the ledger era the file covers. */
  readonly eraHeight: number;
  /** The last block height whose spends are listed. */
  readonly height: number;
  readonly entries: number;
  readonly chunkEntries: number;
  readonly prefixBytes: number;
  readonly chunks: readonly DustChunkRef[];
}

/** A ledger event as the Dust routes answer it: its block height and its bytes in hexadecimal. */
export interface DustEventJson {
  readonly height: number;
  readonly bytes: string;
}

/** `GET /dust/coins?owner=…`: one owner's `dust-initial-utxo` and `dust-generation-dtime-update` events, in chain order. */
export interface DustCoinsAnswer {
  /** The owner asked for, decimal. */
  readonly owner: string;
  readonly eraHeight: number;
  /** The last block height the answer covers. */
  readonly height: number;
  readonly firstCoins: readonly DustEventJson[];
  readonly updates: readonly DustEventJson[];
}

/** `GET /dust/parameters`: the Dust parameters in force, each decimal. */
export interface DustParametersAnswer {
  readonly nightDustRatio: string;
  readonly generationDecayRate: string;
  readonly dustGracePeriodSeconds: string;
  /** The ledger's initial values, or a `param-change` event's at `changedAt`. */
  readonly source: "initial" | "param-change";
  readonly changedAt: number | null;
  readonly height: number;
  /**
   * The ledger parameters after the latest committed block the module saw, in the ledger's tagged serialization,
   * hexadecimal (a wallet's fee is computed with them); null until the module has seen a block (phase 9).
   */
  readonly ledgerParameters: string | null;
  readonly ledgerParametersHeight: number | null;
}

/** The prefix of a nullifier given as its 32-byte little-endian encoding. */
export function dustPrefix(nullifier: Uint8Array, prefixBytes: number = DUST_PREFIX_BYTES): Uint8Array {
  if (nullifier.length !== 32) throw new Error(`a nullifier is 32 bytes, got ${nullifier.length}`);
  checkPrefixBytes(prefixBytes);
  return nullifier.slice(0, prefixBytes);
}

/** The prefix of a nullifier given as its field element. */
export function dustPrefixOfField(nullifier: bigint, prefixBytes: number = DUST_PREFIX_BYTES): Uint8Array {
  checkPrefixBytes(prefixBytes);
  if (nullifier < 0n) throw new Error("a nullifier is not negative");
  const out = new Uint8Array(prefixBytes);
  let rest = nullifier;
  for (let i = 0; i < prefixBytes; i++) {
    out[i] = Number(rest & 0xffn);
    rest >>= 8n;
  }
  return out;
}

/** The entries `[first, first + count)` of each chunk of a file of `entries` entries. */
export function dustChunkRanges(entries: number, chunkEntries: number = DUST_CHUNK_ENTRIES): { first: number; count: number }[] {
  checkCount(entries, "entry count");
  if (!Number.isSafeInteger(chunkEntries) || chunkEntries < 1) throw new Error(`entries per chunk must be ≥ 1: ${chunkEntries}`);
  const out: { first: number; count: number }[] = [];
  for (let first = 0; first < entries; first += chunkEntries) out.push({ first, count: Math.min(chunkEntries, entries - first) });
  return out;
}

/** The chunk of `entries`, the first of which is entry number `first` of the file, in a block at `firstHeight`. */
export function dustChunkOf(first: number, firstHeight: number, entries: readonly DustEntry[], prefixBytes: number = DUST_PREFIX_BYTES): DustChunk {
  checkPrefixBytes(prefixBytes);
  const count = entries.length;
  const prefixes = new Uint8Array(count * prefixBytes);
  const times = new Float64Array(count);
  const positions = new Float64Array(count);
  const fees: bigint[] = [];
  entries.forEach((e, i) => {
    if (e.prefix.length !== prefixBytes) throw new Error(`entry ${first + i}: its prefix is ${e.prefix.length} bytes, the chunk's are ${prefixBytes}`);
    prefixes.set(e.prefix, i * prefixBytes);
    times[i] = e.time;
    positions[i] = e.position;
    fees.push(e.fee);
  });
  return { first, firstHeight, prefixBytes, count, prefixes, times, fees, positions };
}

/** Entry `i` of a chunk (0 is its first). */
export function dustEntryAt(chunk: DustChunk, i: number): DustEntry {
  if (!Number.isInteger(i) || i < 0 || i >= chunk.count) throw new Error(`a chunk of ${chunk.count} entries has no entry ${i}`);
  return {
    prefix: chunk.prefixes.slice(i * chunk.prefixBytes, (i + 1) * chunk.prefixBytes),
    time: chunk.times[i]!,
    fee: chunk.fees[i]!,
    position: chunk.positions[i]!,
  };
}

/**
 * The index in the chunk of the first entry at or after `from` whose prefix is `prefix`, or −1. Compares the fixed-width
 * prefixes only.
 */
export function findDustPrefix(chunk: DustChunk, prefix: Uint8Array, from = 0): number {
  const w = chunk.prefixBytes;
  if (prefix.length !== w) throw new Error(`the chunk's prefixes are ${w} bytes, the searched one is ${prefix.length}`);
  const all = chunk.prefixes;
  for (let i = Math.max(0, from); i < chunk.count; i++) {
    let k = 0;
    const at = i * w;
    while (k < w && all[at + k] === prefix[k]) k++;
    if (k === w) return i;
  }
  return -1;
}

/** Encodes a chunk. Throws on a chunk the format cannot hold (no entry, a position that does not rise, a fee out of range). */
export function encodeDustChunk(chunk: DustChunk): Uint8Array {
  const { first, firstHeight, prefixBytes, count, prefixes, times, fees, positions } = chunk;
  checkPrefixBytes(prefixBytes);
  checkCount(first, "first entry number");
  checkCount(firstHeight, "first height");
  if (!Number.isSafeInteger(count) || count < 1) throw new Error("a chunk holds at least one entry");
  if (prefixes.length !== count * prefixBytes || times.length !== count || fees.length !== count || positions.length !== count) {
    throw new Error("a chunk's fields do not all hold its entry count");
  }

  // The fees that occur more than once, most frequent first, then smallest first: a function of the entries alone.
  const seen = new Map<bigint, number>();
  for (const fee of fees) {
    if (fee < 0n || fee > DUST_MAX_FEE) throw new Error(`a fee is outside 128 bits: ${fee}`);
    seen.set(fee, (seen.get(fee) ?? 0) + 1);
  }
  const list = [...seen].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const place = new Map<bigint, number>(list.map(([fee], i) => [fee, i]));

  const head = new Writer();
  head.bytes(MAGIC);
  head.uint(first);
  head.uint(count);
  head.byte(prefixBytes);
  head.uint(firstHeight);
  head.uint(checkCount(times[0]!, "declared time"));
  head.uint(checkCount(positions[0]!, "commitment position"));

  const feeList = new Writer();
  feeList.uint(list.length);
  for (const [fee] of list) feeList.big(fee);

  const timeColumn = new Writer();
  const feeColumn = new Writer();
  const positionColumn = new Writer();
  for (let i = 0; i < count; i++) {
    const time = checkCount(times[i]!, "declared time");
    const position = checkCount(positions[i]!, "commitment position");
    if (i === 0) {
      timeColumn.uint(0);
      positionColumn.uint(0);
    } else {
      const gap = position - positions[i - 1]! - 1;
      if (gap < 0) throw new Error(`entry ${first + i}: its commitment position ${position} does not follow ${positions[i - 1]}`);
      timeColumn.signed(time - times[i - 1]!);
      positionColumn.uint(gap);
    }
    const at = place.get(fees[i]!);
    if (at === undefined) {
      feeColumn.uint(0);
      feeColumn.big(fees[i]!);
    } else {
      feeColumn.uint(at + 1);
    }
  }

  const out = new Writer();
  out.bytes(head.done());
  out.bytes(prefixes);
  out.bytes(feeList.done());
  for (const column of [timeColumn, feeColumn, positionColumn]) {
    const bytes = column.done();
    out.uint(bytes.length);
    out.bytes(bytes);
  }
  return out.done();
}

/** Decodes a chunk. Throws on bytes that are not exactly one chunk. */
export function decodeDustChunk(bytes: Uint8Array): DustChunk {
  return read(bytes).chunk;
}

/** The byte count of each part of an encoded chunk. */
export function dustChunkLayout(bytes: Uint8Array): DustChunkLayout {
  return read(bytes).layout;
}

function read(bytes: Uint8Array): { chunk: DustChunk; layout: DustChunkLayout } {
  const r = new Reader(bytes);
  const magic = r.take(MAGIC.length);
  if (magic.some((b, i) => b !== MAGIC[i])) throw new Error("not a Dust chunk: its first bytes are not PSSDUST1");
  const first = r.uint();
  const count = r.uint();
  const prefixBytes = r.byte();
  checkPrefixBytes(prefixBytes);
  const firstHeight = r.uint();
  const baseTime = r.uint();
  const basePosition = r.uint();
  if (count < 1) throw new Error("a Dust chunk holds at least one entry");
  const header = r.at;

  const prefixes = r.take(count * prefixBytes).slice();
  const afterPrefixes = r.at;

  const listed = r.uint();
  if (listed > count / 2) throw new Error(`a Dust chunk of ${count} entries lists ${listed} repeated fees`);
  const list: bigint[] = [];
  for (let i = 0; i < listed; i++) list.push(r.big());
  const afterList = r.at;

  // A field with its length in front; `bytes` counts both.
  const column = (): { reader: Reader; bytes: number } => {
    const start = r.at;
    const length = r.uint();
    return { reader: new Reader(r.take(length)), bytes: r.at - start };
  };

  const timeColumn = column();
  const feeColumn = column();
  const positionColumn = column();
  if (r.at !== bytes.length) throw new Error(`a Dust chunk has ${bytes.length - r.at} bytes after its last field`);

  const times = new Float64Array(count);
  const positions = new Float64Array(count);
  const fees: bigint[] = [];
  let feesByIndex = 0;
  for (let i = 0; i < count; i++) {
    const timeStep = timeColumn.reader.signed();
    const gap = positionColumn.reader.uint();
    if (i === 0) {
      if (timeStep !== 0 || gap !== 0) throw new Error("a Dust chunk's first entry carries a difference");
      times[0] = baseTime;
      positions[0] = basePosition;
    } else {
      times[i] = checkCount(times[i - 1]! + timeStep, "declared time");
      positions[i] = checkCount(positions[i - 1]! + gap + 1, "commitment position");
    }
    const code = feeColumn.reader.uint();
    if (code === 0) {
      fees.push(feeColumn.reader.big());
    } else {
      const fee = list[code - 1];
      if (fee === undefined) throw new Error(`a Dust chunk names fee ${code} of a list of ${list.length}`);
      fees.push(fee);
      feesByIndex++;
    }
  }
  for (const [name, c] of [["time", timeColumn], ["fee", feeColumn], ["position", positionColumn]] as const) {
    if (c.reader.at !== c.reader.length) throw new Error(`a Dust chunk's ${name} field has bytes after its last entry`);
  }

  return {
    chunk: { first, firstHeight, prefixBytes, count, prefixes, times, fees, positions },
    layout: {
      header,
      prefixes: afterPrefixes - header,
      feeList: afterList - afterPrefixes,
      times: timeColumn.bytes,
      fees: feeColumn.bytes,
      positions: positionColumn.bytes,
      total: bytes.length,
      feeListValues: list.length,
      feesByIndex,
    },
  };
}

function checkPrefixBytes(prefixBytes: number): void {
  if (!Number.isInteger(prefixBytes) || prefixBytes < 1 || prefixBytes > 32) throw new Error(`a prefix is 1 to 32 bytes: ${prefixBytes}`);
}

function checkCount(value: number, what: string): number {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${what} must be a whole number ≥ 0: ${value}`);
  return value;
}

class Writer {
  #parts: Uint8Array[] = [];
  #length = 0;
  byte(value: number): void {
    this.bytes(Uint8Array.of(value));
  }
  bytes(value: Uint8Array): void {
    this.#parts.push(value);
    this.#length += value.length;
  }
  uint(value: number): void {
    this.big(BigInt(checkCount(value, "an integer")));
  }
  /** Zigzag: 0, −1, 1, −2, 2 become 0, 1, 2, 3, 4. */
  signed(value: number): void {
    if (!Number.isSafeInteger(value)) throw new Error(`not a whole number: ${value}`);
    this.big(value >= 0 ? 2n * BigInt(value) : -2n * BigInt(value) - 1n);
  }
  big(value: bigint): void {
    if (value < 0n) throw new Error("an unsigned integer is not negative");
    const out: number[] = [];
    let rest = value;
    do {
      const low = Number(rest & 0x7fn);
      rest >>= 7n;
      out.push(rest > 0n ? low | 0x80 : low);
    } while (rest > 0n);
    this.bytes(Uint8Array.from(out));
  }
  done(): Uint8Array {
    const out = new Uint8Array(this.#length);
    let at = 0;
    for (const part of this.#parts) {
      out.set(part, at);
      at += part.length;
    }
    return out;
  }
}

class Reader {
  readonly #bytes: Uint8Array;
  at = 0;
  constructor(bytes: Uint8Array) {
    this.#bytes = bytes;
  }
  get length(): number {
    return this.#bytes.length;
  }
  take(length: number): Uint8Array {
    if (!Number.isSafeInteger(length) || length < 0 || this.at + length > this.#bytes.length) throw new Error("a Dust chunk ends before its last field");
    const out = this.#bytes.subarray(this.at, this.at + length);
    this.at += length;
    return out;
  }
  byte(): number {
    return this.take(1)[0]!;
  }
  /** An unsigned LEB128 integer of at most 128 bits, in its shortest form. */
  big(): bigint {
    let value = 0n;
    for (let shift = 0n; ; shift += 7n) {
      if (shift > 126n) throw new Error("a Dust chunk holds an integer wider than 128 bits");
      const b = this.byte();
      value |= BigInt(b & 0x7f) << shift;
      if ((b & 0x80) === 0) {
        if (b === 0 && shift > 0n) throw new Error("a Dust chunk holds an integer with a padding byte");
        if (value > DUST_MAX_FEE) throw new Error("a Dust chunk holds an integer wider than 128 bits");
        return value;
      }
    }
  }
  uint(): number {
    const value = this.big();
    if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("a Dust chunk holds a count beyond 2^53");
    return Number(value);
  }
  signed(): number {
    const value = this.big();
    const out = (value & 1n) === 0n ? value / 2n : -(value + 1n) / 2n;
    if (out > BigInt(Number.MAX_SAFE_INTEGER) || out < -BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("a Dust chunk holds a difference beyond 2^53");
    return Number(out);
  }
}
