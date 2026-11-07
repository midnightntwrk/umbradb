/**
 * A stored ledger node's referenced keys, read without the ledger package. The node-store bridge prefetches them on the
 * main thread, which never loads a ledger package, so it reads the child list itself. [LG-11, Q36, Q49; design §5.3]
 *
 * A node's `children` is the ledger's serialization of its child list (`midnight-ledger` `storage-core/src/arena.rs`
 * `ArenaKey`, under the node's `layout-v2`). It is a `Vec` of children, its length a SCALE compact integer in the
 * fewest bytes that spell it (see `ChildReader.length`). Each child is one of:
 *
 * - `ArenaKey::Ref(key)`: the byte 0, then the 32-byte key;
 * - `ArenaKey::Direct(node)`: the byte 1, then the embedded node's payload as a `Vec<u8>` and its own child list.
 *
 * {@link childRefKeys} gives the by-reference keys, through embedded children, in the list's order. They are the keys
 * the package's `childRefs` gives, though it lists them in the order of its own walk (`test/ledger/node-refs.test.ts`
 * checks they are equal as sets). {@link readChildList} reads a list for other readers, `./node-key.ts` among them.
 * Pure: no Node.js import.
 */

/** A reader over a child list's bytes; every refusal names what was read. */
class ChildReader {
  readonly bytes: Uint8Array;
  #offset = 0;
  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  get done(): boolean {
    return this.#offset === this.bytes.length;
  }

  #refuse(why: string): Error {
    return new Error(`not a ledger node's child list: ${why} at byte ${this.#offset} of ${this.bytes.length}`);
  }

  byte(): number {
    const value = this.bytes[this.#offset];
    if (value === undefined) throw this.#refuse("the bytes end");
    this.#offset += 1;
    return value;
  }

  skip(length: number): Uint8Array {
    return this.view(length).slice();
  }

  /** The next `length` bytes, not copied (an embedded node's payload, which its reader hashes and does not keep). */
  view(length: number): Uint8Array {
    if (this.#offset + length > this.bytes.length) throw this.#refuse(`${length} bytes are announced`);
    const start = this.#offset;
    this.#offset += length;
    return this.bytes.subarray(start, start + length);
  }

  /**
   * A SCALE compact integer used as a length: at most the bytes left, so no length can make the reader loop. It must
   * be in the fewest bytes that spell it, as the ledger reads it (`midnight-ledger` `serialize/src/util.rs`
   * `ScaleBigInt::deserialize` refuses the others as "non-canonical scale encoding"): a list spelled otherwise gives
   * the same children, so the same key, yet the ledger cannot read its row. [LG-11, R29]
   */
  length(): number {
    const first = this.byte();
    let value: number;
    switch (first & 0b11) {
      case 0b00:
        value = first >>> 2;
        break;
      case 0b01: {
        const second = this.byte();
        // A second byte of 0: a number below 2^6, which one byte spells.
        if (second === 0) throw this.#refuse(`a length of ${first >>> 2} in 2 bytes, more than it needs`);
        value = (first | (second << 8)) >>> 2;
        break;
      }
      case 0b10: {
        const second = this.byte();
        const third = this.byte();
        const fourth = this.byte();
        // A third and a fourth byte of 0: a number below 2^14, which two bytes spell.
        if (third === 0 && fourth === 0) {
          throw this.#refuse(`a length of ${(first | (second << 8)) >>> 2} in 4 bytes, more than it needs`);
        }
        value = (first | (second << 8) | (third << 16) | (fourth << 24)) >>> 2;
        break;
      }
      default: {
        // The big-integer mode (4 bytes and more): longer than any child list can be.
        throw this.#refuse(`a length in ${(first >>> 2) + 4} bytes`);
      }
    }
    if (value > this.bytes.length) throw this.#refuse(`a length of ${value}`);
    return value;
  }

  refuseHere(why: string): Error {
    return this.#refuse(why);
  }
}

/**
 * What {@link readChildList} makes of each child, in the list's order: `ref` of a by-reference child's key, `embedded`
 * of an embedded node's payload (not a copy) and of what its own children were made into, read first.
 */
export interface ChildVisitor<T> {
  ref(key: Uint8Array): T;
  embedded(data: Uint8Array, children: T[]): T;
}

/** The children of one list, each made into what `visitor` makes of it. */
function readChildren<T>(reader: ChildReader, visitor: ChildVisitor<T>): T[] {
  const count = reader.length();
  const children: T[] = [];
  for (let i = 0; i < count; i++) {
    const discriminant = reader.byte();
    if (discriminant === 0) children.push(visitor.ref(reader.skip(32)));
    else if (discriminant === 1) {
      const data = reader.view(reader.length());
      children.push(visitor.embedded(data, readChildren(reader, visitor)));
    } else throw reader.refuseHere(`a child of kind ${discriminant}`);
  }
  return children;
}

/**
 * Reads a serialized child list through `visitor` (see {@link ChildVisitor}) and gives what it made of each child;
 * refuses bytes that are not exactly one child list.
 */
export function readChildList<T>(children: Uint8Array, visitor: ChildVisitor<T>): T[] {
  const reader = new ChildReader(children);
  const read = readChildren(reader, visitor);
  if (!reader.done) throw reader.refuseHere("bytes are left after it");
  return read;
}

/** The by-reference keys of a serialized child list, through embedded children (see the module comment). */
export function childRefKeys(children: Uint8Array): Uint8Array[] {
  const keys: Uint8Array[] = [];
  readChildList<void>(children, {
    ref: (key) => {
      keys.push(key);
    },
    embedded: () => undefined,
  });
  return keys;
}
