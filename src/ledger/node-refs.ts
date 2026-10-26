/**
 * A stored ledger node's referenced keys, read without the ledger package (`openspec/changes/core-arch/design.md` §5.3;
 * `specs/ledger/spec.md` LG-11; task 12.3): the node-store bridge prefetches them on the main thread, which never loads
 * a ledger package (decision record Q36, Q49), so it reads the child list itself.
 *
 * A node's `children` is the ledger's serialization of its child list (`midnight-ledger` `storage-core/src/arena.rs`
 * `ArenaKey`, under the node's `layout-v2`): a `Vec` — its length as a SCALE compact integer — of children, each
 * `ArenaKey::Ref(key)` (the byte 0, then the 32-byte key) or `ArenaKey::Direct(node)` (the byte 1, then the embedded
 * node's payload as a `Vec<u8>` and its own child list). {@link childRefKeys} gives the by-reference keys, through
 * embedded children, in the list's order — the keys the package's `childRefs` gives, which lists them in an order of its
 * own walk (`test/ledger/node-refs.test.ts` holds them equal as sets). Pure: no Node.js import.
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
    if (this.#offset + length > this.bytes.length) throw this.#refuse(`${length} bytes are announced`);
    const taken = this.bytes.slice(this.#offset, this.#offset + length);
    this.#offset += length;
    return taken;
  }

  /** A SCALE compact integer used as a length: at most the bytes left, so no length can make the reader loop. */
  length(): number {
    const first = this.byte();
    let value: number;
    switch (first & 0b11) {
      case 0b00:
        value = first >>> 2;
        break;
      case 0b01:
        value = (first | (this.byte() << 8)) >>> 2;
        break;
      case 0b10:
        value = (first | (this.byte() << 8) | (this.byte() << 16) | (this.byte() << 24)) >>> 2;
        break;
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

/** The children of one list, their by-reference keys pushed to `keys`. */
function readChildren(reader: ChildReader, keys: Uint8Array[]): void {
  const count = reader.length();
  for (let i = 0; i < count; i++) {
    const discriminant = reader.byte();
    if (discriminant === 0) keys.push(reader.skip(32));
    else if (discriminant === 1) {
      reader.skip(reader.length());
      readChildren(reader, keys);
    } else throw reader.refuseHere(`a child of kind ${discriminant}`);
  }
}

/** The by-reference keys of a serialized child list, through embedded children (see the module comment). */
export function childRefKeys(children: Uint8Array): Uint8Array[] {
  const reader = new ChildReader(children);
  const keys: Uint8Array[] = [];
  readChildren(reader, keys);
  if (!reader.done) throw reader.refuseHere("bytes are left after it");
  return keys;
}
