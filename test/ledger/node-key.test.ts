import { readFileSync } from "node:fs";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { nodeKey, nodeKeys } from "../../src/ledger/node-key.js";
import { type Ledger, RAW } from "./adapter-fixtures.js";
import { runInFreshInstance, type StoredNode } from "./fresh-instance.js";
import { V8_PACKAGE_PATH, V9_PACKAGE_PATH, V9_RC3_PACKAGE_PATH } from "./ledger-states.js";
import {
  type Child,
  childKey,
  decodeChildren,
  encodeChildren,
  free,
  hex,
  LENGTH_BOUNDARIES,
  nodeKey as formatNodeKey,
  scaleIn,
  spellingsOf,
} from "./node-format.js";
import { byReference, oneWrongKey, walkInFreshInstance } from "./package-keys.js";

// A ledger node's key computed on the main thread, without the ledger package, from its payload and its serialized
// child list: the key of each node a child list embeds, and the node's own. The oracles are the independent node format
// (`./node-format.ts`, written from the upstream sources), a key written out by hand, and the vendored packages' own
// keys: the keys they flush nodes under, and the keys they accept embedded nodes under when reading them from a store
// (`./package-keys.ts`). The recorded tapes' nodes are checked in `./node-key-tapes.ts`. [R29, LG-11]

/** The fast-check seed of the properties below. */
const SEED = 20261103;

const key = fc.uint8Array({ minLength: 32, maxLength: 32 });
const child: fc.Arbitrary<Child> = fc.letrec<{ child: Child }>((tie) => ({
  child: fc.oneof(
    { depthSize: "small" },
    key.map((ref): Child => ({ ref })),
    fc
      .record({ data: fc.uint8Array({ maxLength: 80 }), children: fc.array(tie("child"), { maxLength: 3 }) })
      .map((direct): Child => ({ direct })),
  ),
})).child;
const node = fc.record({ data: fc.uint8Array({ maxLength: 120 }), children: fc.array(child, { maxLength: 6 }) });

/** The keys of the nodes `children` embeds, at any depth, each after the nodes it embeds: the independent format's. */
const embeddedOf = (children: readonly Child[]): string[] =>
  children.flatMap((c) => ("ref" in c ? [] : [...embeddedOf(c.direct.children), hex(childKey(c))]));

/** `children` with every embedded child replaced by a reference to its key. */
const referenced = (children: readonly Child[]): Child[] => children.map((c) => ("ref" in c ? c : { ref: childKey(c) }));

describe("nodeKey and nodeKeys: a ledger node's key and its embedded nodes' keys, read on the main thread (R29)", () => {
  it(`give the independent format's key and embedded keys for any node (seed ${SEED})`, () => {
    fc.assert(
      fc.property(node, ({ data, children }) => {
        const bytes = encodeChildren(children);
        const expected = hex(formatNodeKey(data, children.map(childKey)));
        expect(hex(nodeKey(data, bytes))).toBe(expected);
        const keys = nodeKeys(data, bytes);
        expect(hex(keys.key)).toBe(expected);
        expect(keys.embedded.map(hex)).toEqual(embeddedOf(children));
      }),
      { seed: SEED, numRuns: 300 },
    );
  });

  it(`give a node the same key whether its children are embedded or referenced (seed ${SEED})`, () => {
    fc.assert(
      fc.property(node, ({ data, children }) => {
        const asReferences = encodeChildren(referenced(children));
        expect(hex(nodeKey(data, asReferences))).toBe(hex(nodeKey(data, encodeChildren(children))));
        expect(nodeKeys(data, asReferences).embedded).toEqual([]);
      }),
      { seed: SEED, numRuns: 200 },
    );
  });

  it("hash the payload's length as 4 little-endian bytes, the payload, then each child's key, with SHA-256", () => {
    // Written out by hand: SHA-256 of the 4 bytes 00 00 00 00, a node with no payload and no child.
    expect(hex(nodeKey(Uint8Array.of(), Uint8Array.of(0)))).toBe("df3f619804a92fdb4057192dc43dd748ea778adc52bc498ce80524c014b81119");
    // SHA-256 of 02 00 00 00 | ab cd | 32 × 07: a payload of 2 bytes and one child by reference.
    const ref = new Uint8Array(32).fill(7);
    expect(hex(nodeKey(Uint8Array.of(0xab, 0xcd), encodeChildren([{ ref }])))).toBe(
      hex(formatNodeKey(Uint8Array.of(0xab, 0xcd), [ref])),
    );
    // The embedded child's key enters its parent's hash, not its bytes.
    const inner: Child = { direct: { data: Uint8Array.of(1, 2, 3), children: [{ ref }] } };
    const keys = nodeKeys(Uint8Array.of(9), encodeChildren([inner, { ref }]));
    expect(keys.embedded.map(hex)).toEqual([hex(formatNodeKey(Uint8Array.of(1, 2, 3), [ref]))]);
    expect(hex(keys.key)).toBe(hex(formatNodeKey(Uint8Array.of(9), [keys.embedded[0]!, ref])));
  });

  it("read every SCALE length form: one, two and four bytes", () => {
    const refs: Child[] = Array.from({ length: 70 }, (_, i) => ({ ref: new Uint8Array(32).fill(i) }));
    expect(hex(nodeKey(Uint8Array.of(1), encodeChildren(refs)))).toBe(hex(formatNodeKey(Uint8Array.of(1), refs.map(childKey))));
    const big: Child = { direct: { data: new Uint8Array(20_000).fill(3), children: [{ ref: new Uint8Array(32).fill(9) }] } };
    const keys = nodeKeys(new Uint8Array(70_000).fill(5), encodeChildren([big]));
    expect(keys.embedded.map(hex)).toEqual([hex(childKey(big))]);
    expect(hex(keys.key)).toBe(hex(formatNodeKey(new Uint8Array(70_000).fill(5), [childKey(big)])));
  });

  it("refuse bytes that are no child list, naming what was read", () => {
    const data = Uint8Array.of(1);
    for (const bytes of [
      Uint8Array.of(),
      // A child of kind 4.
      Uint8Array.of(4, 4),
      // A reference cut short.
      Uint8Array.of(4, 0, 1, 2),
      // One child, then a byte too many.
      Uint8Array.from([4, 0, ...new Array<number>(32).fill(7), 9]),
      // An embedded child whose payload is cut short.
      Uint8Array.of(4, 1, 8, 1),
      // An embedded child whose own child list is missing.
      Uint8Array.of(4, 1, 4, 1),
      // A length in the big-integer mode.
      Uint8Array.of(0b11, 0xff, 0xff, 0xff, 0xff),
      // An empty list's length in 2 bytes and in 4, which the ledger refuses (a non-canonical SCALE encoding).
      Uint8Array.of(0b01, 0),
      Uint8Array.of(0b10, 0, 0, 0),
      // An embedded child whose empty payload's length is in 2 bytes, and in 4.
      Uint8Array.of(4, 1, 0b01, 0, 0),
      Uint8Array.of(4, 1, 0b10, 0, 0, 0, 0),
    ]) {
      expect(() => nodeKey(data, bytes)).toThrow(/^not a ledger node's child list: /);
      expect(() => nodeKeys(data, bytes)).toThrow(/^not a ledger node's child list: /);
    }
    expect(() => nodeKey(data, Uint8Array.of(0xfd, 0x03))).toThrow(/a length of 255 at byte 2 of 2/);
  });

  it("read a length in the fewest bytes that spell it and refuse it in more, as the ledger does, for the number of children and an embedded payload's length: 0, 1, 63/64, 16383/16384 in each width (LG-11, R29)", () => {
    const data = Uint8Array.of(1);
    for (const value of LENGTH_BOUNDARIES) {
      const refs = Array.from({ length: value }, (_, i) => new Uint8Array(32).fill(i & 0xff));
      const listed = Buffer.concat(refs.flatMap((ref) => [Uint8Array.of(0), ref]));
      const payload = new Uint8Array(value).fill(5);
      for (const { width, canonical } of spellingsOf(value)) {
        const what = `${value} in ${width} bytes`;
        const count = Uint8Array.from(Buffer.concat([scaleIn(value, width), listed]));
        // One embedded child of `value` payload bytes and no child of its own.
        const embedded = Uint8Array.from(Buffer.concat([Uint8Array.of(4, 1), scaleIn(value, width), payload, Uint8Array.of(0)]));
        if (canonical) {
          expect(hex(nodeKey(data, count)), what).toBe(hex(formatNodeKey(data, refs)));
          const inner = formatNodeKey(payload, []);
          expect(nodeKeys(data, embedded).embedded.map(hex), what).toEqual([hex(inner)]);
          expect(hex(nodeKey(data, embedded)), what).toBe(hex(formatNodeKey(data, [inner])));
        } else {
          const refused = new RegExp(`^not a ledger node's child list: a length of ${value} in ${width} bytes, more than it needs `);
          expect(() => nodeKey(data, count), what).toThrow(refused);
          expect(() => nodeKeys(data, embedded), what).toThrow(refused);
        }
      }
    }
  });
});

/** A real genesis state of each vendored package, the file its tests read. */
const GENESIS: readonly { readonly ledger: Ledger; readonly file: string; readonly packagePath: string }[] = [
  { ledger: "v8", file: "genesis_state_preview.mn", packagePath: V8_PACKAGE_PATH },
  { ledger: "v9", file: "genesis_state_undeployed.mn", packagePath: V9_PACKAGE_PATH },
  { ledger: "v9-rc3", file: "genesis_state_stagenet.mn", packagePath: V9_RC3_PACKAGE_PATH },
];

interface GenesisNodes {
  readonly stateKey: Uint8Array;
  readonly serialized: Uint8Array;
  readonly inserts: readonly StoredNode[];
}

const flushed = new Map<Ledger, GenesisNodes>();

/**
 * The nodes `ledger`'s package flushes for the genesis state in `file`, with the state's key and serialization.
 * Flushed once per package: a package that holds a node already does not flush it again.
 */
function genesisNodes(ledger: Ledger, file: string): GenesisNodes {
  const known = flushed.get(ledger);
  if (known !== undefined) return known;
  const raw = RAW[ledger];
  const state = raw.LedgerState.deserialize(readFileSync(new URL(`./fixtures/genesis/${file}`, import.meta.url)));
  const stateKey = raw.stateKey(state);
  raw.persistKey(stateKey);
  const { inserts } = raw.flushNodes();
  const nodes = { stateKey, serialized: state.serialize(), inserts };
  raw.releaseKey(stateKey);
  raw.flushNodes();
  free(state);
  flushed.set(ledger, nodes);
  return nodes;
}

describe("nodeKey against the vendored packages, on the nodes of real genesis states (R29)", () => {
  for (const { ledger, file, packagePath } of GENESIS) {
    it(`${ledger}: every flushed node's key is the key the package flushed it under`, () => {
      const { inserts } = genesisNodes(ledger, file);
      expect(inserts.length).toBeGreaterThan(3);
      for (const inserted of inserts) expect(hex(nodeKey(inserted.data, inserted.children))).toBe(hex(inserted.key));
      // The check reaches embedded nodes: some flushed child lists embed one.
      expect(inserts.some((inserted) => nodeKeys(inserted.data, inserted.children).embedded.length > 0)).toBe(true);
    });

    it(`${ledger}: a fresh instance of the package reads every embedded node under the key nodeKey gives it`, async () => {
      const { stateKey, serialized, inserts } = genesisNodes(ledger, file);
      const moved = byReference(inserts);
      expect(moved.embedded.size).toBeGreaterThan(0);
      for (const inserted of inserts) {
        for (const embedded of nodeKeys(inserted.data, inserted.children).embedded) expect(moved.embedded.has(hex(embedded))).toBe(true);
      }
      const loaded = await runInFreshInstance({ packagePath, op: "load", key: stateKey, nodes: moved.nodes });
      expect(loaded.error).toBeUndefined();
      // The same state: its key and its serialization. Its root (the root's typed key) is not compared: it embeds the
      // root node when that node is small, and with its children by reference the root node is smaller.
      expect(hex(loaded.stateKey as Uint8Array)).toBe(hex(stateKey));
      expect(hex(loaded.serialized as Uint8Array)).toBe(hex(serialized));
      // Each embedded node was read from the store by the key nodeKey gives it, and accepted.
      const requested = new Set(loaded.requested);
      expect([...moved.embedded].filter((k) => !requested.has(k))).toEqual([]);
    });

    it(`${ledger}'s controls: the package refuses an embedded node changed under its key, and a parent whose embedded child's key is wrong`, async () => {
      const { stateKey, inserts } = genesisNodes(ledger, file);
      const moved = byReference(inserts);
      const target = moved.nodes.find((n) => moved.embedded.has(hex(n.key)) && n.data.length > 0);
      expect(target).toBeDefined();
      const id = hex(target!.key);
      const tampered = await runInFreshInstance({ packagePath, op: "load", key: stateKey, nodes: moved.nodes, tamper: id });
      expect(tampered.error).toBeDefined();
      expect(tampered.serialized).toBeUndefined();
      expect(tampered.requested.at(-1)).toBe(id);
      // nodeKey giving that embedded node a wrong key: the package refuses the first node it reads that embedded it.
      const wrong = byReference(inserts, oneWrongKey(id));
      const parents = parentsOf(wrong.nodes, id);
      expect(parents.length).toBeGreaterThan(0);
      const refused = await runInFreshInstance({ packagePath, op: "load", key: stateKey, nodes: wrong.nodes });
      expect(refused.error).toBeDefined();
      expect(refused.serialized).toBeUndefined();
      expect(parents).toContain(refused.requested.at(-1));
    });

    it(`${ledger}'s control: the package refuses a stored node whose child list's length is in more bytes than it needs, under the node's key, as nodeKey refuses it (LG-11, R29)`, async () => {
      const { stateKey, inserts } = genesisNodes(ledger, file);
      const moved = byReference(inserts);
      // A leaf the load reads from the store (an embedded node, now a row of its own), its empty list respelled.
      const leaf = moved.nodes.find((n) => moved.embedded.has(hex(n.key)) && hex(n.children) === "00");
      expect(leaf).toBeDefined();
      const id = hex(leaf!.key);
      for (const children of [Uint8Array.of(0b01, 0), Uint8Array.of(0b10, 0, 0, 0)]) {
        const what = `the list 00 as ${hex(children)}`;
        expect(() => nodeKey(leaf!.data, children), what).toThrow(/more than it needs/);
        const nodes = moved.nodes.map((n) => (hex(n.key) === id ? { ...n, children } : n));
        const refused = await runInFreshInstance({ packagePath, op: "load", key: stateKey, nodes });
        expect(refused.error, what).toBeDefined();
        expect(refused.serialized, what).toBeUndefined();
        expect(refused.requested.at(-1), what).toBe(id);
      }
    });

    it(`${ledger}: a walk of a fresh instance through the state, twice, reads every embedded node under nodeKey's key; one wrong key stops it`, async () => {
      const { stateKey, inserts } = genesisNodes(ledger, file);
      const moved = byReference(inserts);
      const walk = await walkInFreshInstance({ packagePath, keys: [stateKey, stateKey], nodes: moved.nodes });
      expect(walk.error).toBeUndefined();
      expect(walk.walked).toBe(2);
      const requested = new Set(walk.requested);
      expect([...moved.embedded].filter((k) => !requested.has(k))).toEqual([]);
      const id = [...moved.embedded][0] as string;
      const wrong = byReference(inserts, oneWrongKey(id));
      const refused = await walkInFreshInstance({ packagePath, keys: [stateKey], nodes: wrong.nodes });
      expect(refused.error).toBeDefined();
      expect(refused.walked).toBe(0);
      expect(parentsOf(wrong.nodes, id)).toContain(refused.last);
    });
  }
});

/** The keys, as hex, of the nodes of `nodes` that reference the key `id` with its first byte flipped ({@link oneWrongKey}). */
function parentsOf(nodes: readonly StoredNode[], id: string): string[] {
  const flipped = `${(Number.parseInt(id.slice(0, 2), 16) ^ 0xff).toString(16).padStart(2, "0")}${id.slice(2)}`;
  return nodes.filter((n) => decodeChildren(n.children).some((c) => "ref" in c && hex(c.ref) === flipped)).map((n) => hex(n.key));
}
