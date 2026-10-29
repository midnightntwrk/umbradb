import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import networksFile from "../../src/ledger/networks.json" with { type: "json" };
import {
  BUILT_IN_NETWORKS,
  builtInLedgerTable,
  builtInNetwork,
  KNOWN_NETWORKS,
  NETWORKS_FORMAT,
  networksFileProblems,
  parseNetworksFile,
} from "../../src/ledger/networks.js";
import { type LedgerTable, selectLedgerVersion } from "../../src/ledger/version-table.js";
import { hashAnswer, headerAnswer, toHex } from "../../src/node/decode.js";
import { type FoundTape, tapeTest } from "../tape/real/real-tapes.js";
import { haltOf, TapeAnswers } from "./version-checks.js";

/**
 * The built-in ledger version tables (`src/ledger/networks.json`): one per known network, keyed by its genesis hash,
 * with the runtime-to-ledger rows, and a pin for each runtime upgrade boundary read from the network's node. [LG-3, A95 STATIC]
 *
 * - **Every pin has a recorded source:** every pin of the built-in tables has a height, a hash and a `spec_version`,
 *   with a recorded source (the node it was read from, when, the file in this repository holding the node's answers)
 *   and the U and F hashes; the format makes a pin of nothing else (a pin is a boundary's F). Each source's record exists and holds the
 *   hashes it vouches for. [A95 STATIC]
 * - **Each pin passes its boundary's header:** each built-in pin passes the header its boundary's record holds, through
 *   the node client's decoder. These are the boundaries read from the nodes (`test/ledger/fixtures/networks/*.json`),
 *   the mainnet pin at 1,774,492 among them; block 1,774,492's header as the recorded mainnet tape holds it passes the
 *   pin too. [A94]
 * - **The tables against the recorded tapes** (each skipped by name without its tape): every block of every
 *   public tape selects a ledger through its network's built-in table, built by the runtime in its parent's state;
 *   every pin in a tape's range passes; every runtime change on a tape is a built-in boundary with its U's and F's
 *   hashes and versions; a tape from genesis has the built-in genesis hash and runtime.
 * - **The format:** `networksFileProblems` refuses every way a file can break it, one rule per row below.
 */

/**
 * The built-in rows: runtimes 0.22 and 1.0.x to v8; runtime 2.0 to v9 as it built it (`ledger-9.1.0.0-rc.3`, a package
 * of its own); 2.1 on to v9 (`ledger-9.1.0.0-rc.5`). [LG-3, Q139 A, A159]
 */
const LG3_ROWS = [
  { specVersionMin: 22_000, specVersionMax: 22_999, ledger: "v8" },
  { specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" },
  { specVersionMin: 2_000_000, specVersionMax: 2_000_999, ledger: "v9-rc3" },
  { specVersionMin: 2_001_000, specVersionMax: 2_999_999, ledger: "v9" },
];

const repository = (path: string) => new URL(`../../${path}`, import.meta.url);

describe("the committed file (LG-3)", () => {
  it("passes the format, and gives every known network its table with LG-3's rows", () => {
    expect(networksFileProblems(networksFile)).toEqual([]);
    expect(networksFile.format).toBe(NETWORKS_FORMAT);
    expect(KNOWN_NETWORKS).toEqual(["mainnet", "preprod", "preview", "stagenet"]);
    expect(BUILT_IN_NETWORKS.map((entry) => entry.network)).toEqual(KNOWN_NETWORKS);
    for (const network of KNOWN_NETWORKS) {
      expect(builtInNetwork(network)?.rows, network).toEqual(LG3_ROWS);
      expect(builtInLedgerTable(network), network).toEqual({
        rows: LG3_ROWS,
        pins: builtInNetwork(network)?.boundaries.map((b) => ({ height: b.f.height, hash: b.f.hash, specVersion: b.f.specVersion })),
      });
    }
    expect(builtInNetwork("custom")).toBeNull();
    expect(builtInLedgerTable("custom")).toBeNull();
    expect(builtInLedgerTable("constructor")).toBeNull();
  });

  it("keys each network by the genesis hash and runtime its node reported (task 0.3's records)", () => {
    // Read on 2026-10-26 from each network's node with tools/tape/main.ts boundaries; the record holds the
    // node's answers. Stagenet, a temporary network with no midnight.network node, from the third-party
    // rpc.stagenet.shielded.tools.
    const read = (network: string) =>
      JSON.parse(readFileSync(repository(`test/ledger/fixtures/networks/${network}.json`), "utf8")) as {
        node: string;
        recorded: string;
        genesis: { hash: string; specVersion: number };
      };
    for (const network of ["mainnet", "preprod", "preview", "stagenet"] as const) {
      const record = read(network);
      expect(builtInNetwork(network)?.genesis, network).toEqual({
        hash: record.genesis.hash,
        specVersion: record.genesis.specVersion,
        source: { node: record.node, read: record.recorded, record: `test/ledger/fixtures/networks/${network}.json` },
      });
      expect(record.node, network).toBe(
        network === "stagenet" ? "wss://rpc.stagenet.shielded.tools" : `wss://rpc.${network}.midnight.network`,
      );
    }
    expect(BUILT_IN_NETWORKS.map((entry) => entry.genesis?.specVersion ?? null)).toEqual([22_000, 22_000, 1_000_000, 2_000_000]);
    // The hashes read on 2026-10-23 for mainnet and preview (node-roots.json) are the same blocks.
    const roots = JSON.parse(readFileSync(repository("test/ledger/fixtures/genesis/node-roots.json"), "utf8")) as {
      states: { network: string; node: string; block0: string }[];
    };
    for (const network of ["mainnet", "preview"] as const) {
      expect(builtInNetwork(network)?.genesis?.hash, network).toBe(roots.states.find((state) => state.network === network)?.block0);
    }
  });

  it("pins every boundary each node reported, the mainnet 1.0 pin at F = 1,774,492 among them (LG-2, LG-3)", () => {
    const pins = (network: string) => builtInLedgerTable(network)?.pins.map((pin) => [pin.height, pin.specVersion]);
    expect(pins("mainnet")).toEqual([
      [1_774_492, 1_000_000],
      [2_738_211, 1_000_300],
    ]);
    expect(builtInLedgerTable("mainnet")?.pins[0]?.hash).toBe(
      "0x380266656e11208adbcaa5ab62a6beb9c09ef86de1cb886eac721099177a1a0b",
    );
    expect(pins("preprod")).toEqual([
      [1_568_258, 1_000_000],
      [2_648_469, 1_000_300],
    ]);
    expect(pins("preview")).toEqual([[1_074_621, 1_000_300]]);
    expect(pins("stagenet")).toEqual([]);
  });

  it("is frozen", () => {
    expect(Object.isFrozen(BUILT_IN_NETWORKS)).toBe(true);
    expect(Object.isFrozen(builtInNetwork("mainnet"))).toBe(true);
    expect(Object.isFrozen(builtInLedgerTable("mainnet")?.rows)).toBe(true);
    expect(Object.isFrozen(builtInLedgerTable("mainnet")?.rows[0])).toBe(true);
    expect(Object.isFrozen(builtInNetwork("mainnet")?.genesis?.source)).toBe(true);
  });
});

describe("A95 [STATIC]: every built-in pin has a height, a hash and a spec_version with a recorded source", () => {
  const recordText = (record: string): string => {
    expect(existsSync(repository(record)), record).toBe(true);
    return readFileSync(repository(record), "utf8").toLowerCase();
  };

  it("every pin is a boundary's F, read with its U from the network's node, and its record holds both hashes", () => {
    for (const entry of BUILT_IN_NETWORKS) {
      const table = builtInLedgerTable(entry.network) as LedgerTable;
      expect(table.pins).toHaveLength(entry.boundaries.length);
      entry.boundaries.forEach((boundary, index) => {
        const pin = table.pins[index];
        expect(pin).toEqual({ height: boundary.f.height, hash: boundary.f.hash, specVersion: boundary.f.specVersion });
        expect(boundary.u.height + 1).toBe(boundary.f.height);
        expect(boundary.source.node.length).toBeGreaterThan(0);
        const text = recordText(boundary.source.record);
        expect(text, boundary.source.record).toContain(boundary.u.hash.slice(2));
        expect(text, boundary.source.record).toContain(boundary.f.hash.slice(2));
      });
    }
  });

  it("every genesis's record holds its hash", () => {
    for (const entry of BUILT_IN_NETWORKS) {
      if (entry.genesis === null) continue;
      expect(recordText(entry.genesis.source.record), entry.network).toContain(entry.genesis.hash.slice(2));
    }
  });
});

describe("A94's last clause: every built-in pin passes the header its boundary's record holds", () => {
  type Answers = { calls: { method: string; params: unknown[]; result: unknown }[] };

  it("selects each boundary's U and F with its network's table, the node client decoding the recorded headers", () => {
    for (const entry of BUILT_IN_NETWORKS) {
      for (const boundary of entry.boundaries) {
        const answers = JSON.parse(readFileSync(repository(boundary.source.record), "utf8")) as Answers;
        for (const block of [boundary.u, boundary.f]) {
          const hashCall = answers.calls.find((call) => call.method === "chain_getBlockHash" && call.params[0] === block.height);
          const hash = hashAnswer("chain_getBlockHash", "result", hashCall?.result);
          const headerCall = answers.calls.find((call) => call.method === "chain_getHeader" && call.params[0] === block.hash);
          const header = headerAnswer("chain_getHeader", "result", headerCall?.result);
          expect(header.number).toBe(BigInt(block.height));
          const selection = selectLedgerVersion(builtInLedgerTable(entry.network) as LedgerTable, {
            height: header.number,
            hash,
            digest: header.digest,
          });
          expect(selection.specVersion).toBe(block.specVersion);
        }
      }
    }
  });
});

describe("the built-in tables against task 0.3's recorded tapes (each skipped by name without its tape)", () => {
  /** Reading, checking and walking a 60,000-record tape on a loaded machine. */
  const WALK_MS = 600_000;

  /** A tape's header at `height`, decoded by the node client's decoder, with its hash. */
  const blockAt = (answers: TapeAnswers, height: number) => {
    const text = answers.hashAt(height);
    const header = headerAnswer("chain_getHeader", "result", answers.answer("chain_getHeader", text));
    expect(header.number, `the header of ${height}`).toBe(BigInt(height));
    return { text, header, block: { height: header.number, hash: hashAnswer("chain_getBlockHash", "result", text), digest: header.digest } };
  };

  tapeTest(
    "mainnet-1774000-1780000",
    "A94's last clause: block 1,774,492's header as the mainnet node answered it passes the built-in pin; under U's hash, or with U's MNSV, it does not",
    (found) => {
      const answers = new TapeAnswers(found.read().records);
      const table = builtInLedgerTable("mainnet") as LedgerTable;
      const f = blockAt(answers, 1_774_492);
      expect(f.text).toBe("0x380266656e11208adbcaa5ab62a6beb9c09ef86de1cb886eac721099177a1a0b");
      expect(table.pins).toContainEqual({ height: 1_774_492, hash: f.text, specVersion: 1_000_000 });
      expect(selectLedgerVersion(table, f.block)).toEqual({ specVersion: 1_000_000, ledger: "v8" });
      const u = blockAt(answers, 1_774_491);
      expect(selectLedgerVersion(table, u.block)).toEqual({ specVersion: 22_000, ledger: "v8" });
      const underUsHash = haltOf(() => selectLedgerVersion(table, { ...f.block, hash: u.block.hash }));
      expect([underUsHash.code, (underUsHash.details as { differs: unknown }).differs]).toEqual(["pin-mismatch", ["hash"]]);
      const withUsVersion = haltOf(() => selectLedgerVersion(table, { ...f.block, digest: u.block.digest }));
      expect([withUsVersion.code, (withUsVersion.details as { differs: unknown }).differs]).toEqual(["pin-mismatch", ["specVersion"]]);
    },
    { timeoutMs: WALK_MS },
  );

  /** Each public tape, the pins in its range and the ledgers its blocks select (from the tapes' manifest). */
  const PUBLIC_TAPES = [
    { name: "mainnet-1774000-1780000", pins: [1_774_492], ledgers: ["v8"] },
    { name: "mainnet-1780000-1790000", pins: [], ledgers: ["v8"] },
    { name: "preview-0-10000", pins: [], ledgers: ["v8"] },
    { name: "preview-1073620-1075620", pins: [1_074_621], ledgers: ["v8"] },
    { name: "preprod-0-10000", pins: [], ledgers: ["v8"] },
    { name: "stagenet-0-10000", pins: [], ledgers: ["v9-rc3"] },
  ] as const;

  /** Walks every block of `found` through its network's built-in table (see the describe's title). */
  function expectTableHolds(found: FoundTape, expected: (typeof PUBLIC_TAPES)[number]): void {
    const { network, from, to } = found.tape;
    const entry = builtInNetwork(network);
    const table = builtInLedgerTable(network) as LedgerTable;
    expect(entry, network).not.toBeNull();
    const answers = new TapeAnswers(found.read().records);
    const ledgers = new Set<string>();
    const mnsv = new Map<number, number>();
    const runtimes = new Map<number, number>();
    const notFromParent: string[] = [];
    const changes: number[] = [];
    let parent: string | null = null;
    for (let h = from; h <= to; h++) {
      const { text, header, block } = blockAt(answers, h);
      const selection = selectLedgerVersion(table, block);
      ledgers.add(selection.ledger);
      mnsv.set(h, selection.specVersion);
      runtimes.set(h, answers.runtimeAt(text));
      if (parent !== null) {
        expect(toHex(header.parentHash), `block ${h}'s parent`).toBe(parent);
        // A block is built by the runtime in its parent's state, which its MNSV names. [LG-4]
        if (selection.specVersion !== runtimes.get(h - 1)) notFromParent.push(`${h}: MNSV ${selection.specVersion}, parent's ${runtimes.get(h - 1)}`);
        // The state's runtime changes at U, whose own state holds the runtime it enacts.
        if (runtimes.get(h) !== runtimes.get(h - 1)) changes.push(h);
      }
      parent = text;
    }
    expect(notFromParent).toEqual([]);
    expect([...ledgers]).toEqual(expected.ledgers);
    // Every pin in the range was passed by the walk (a block contradicting it halts it).
    expect(table.pins.filter((pin) => from <= pin.height && pin.height <= to).map((pin) => pin.height)).toEqual(expected.pins);
    // Every runtime change on the tape is a built-in boundary, read with the same hashes and versions.
    const boundaries = entry!.boundaries.filter((boundary) => from <= boundary.u.height && boundary.f.height <= to);
    expect(changes).toEqual(boundaries.map((boundary) => boundary.u.height));
    for (const boundary of boundaries) {
      for (const side of [boundary.u, boundary.f]) {
        expect({ hash: answers.hashAt(side.height), specVersion: mnsv.get(side.height) }, `${network} ${side.height}`).toEqual({
          hash: side.hash,
          specVersion: side.specVersion,
        });
      }
      expect(runtimes.get(boundary.u.height)).toBe(boundary.f.specVersion);
    }
    if (from === 0) {
      expect({ hash: answers.hashAt(0), specVersion: runtimes.get(0) }, `${network}'s genesis`).toEqual({
        hash: entry!.genesis?.hash,
        specVersion: entry!.genesis?.specVersion,
      });
    }
  }

  for (const expected of PUBLIC_TAPES) {
    tapeTest(
      expected.name,
      `its network's built-in table selects every block of ${expected.name}: built by its parent's runtime, every pin in range passed, every runtime change a recorded boundary${expected.name.endsWith("-0-10000") ? ", the genesis hash and runtime the built-in ones" : ""}`,
      (found) => expectTableHolds(found, expected),
      { timeoutMs: WALK_MS },
    );
  }
});

// ---- the format ----------------------------------------------------------------------------------------------------

const H = (n: number) => `0x${n.toString(16).padStart(64, "0")}`;
const SOURCE = { node: "wss://rpc.example.midnight.network", read: "2026-10-26", record: "test/ledger/fixtures/x.json" };

/** A valid synthetic file: mainnet with its genesis and two boundaries; stagenet with nothing read yet. */
function validFile() {
  return {
    format: NETWORKS_FORMAT,
    version: 1,
    about: "a synthetic file",
    networks: [
      {
        network: "mainnet",
        genesis: { hash: H(1), specVersion: 22_000, source: { ...SOURCE } },
        rows: LG3_ROWS.map((row) => ({ ...row })),
        boundaries: [
          {
            u: { height: 10, hash: H(2), specVersion: 22_000 },
            f: { height: 11, hash: H(3), specVersion: 1_000_000 },
            source: { ...SOURCE },
          },
          {
            u: { height: 20, hash: H(4), specVersion: 1_000_000 },
            f: { height: 21, hash: H(5), specVersion: 2_000_000 },
            source: { ...SOURCE },
          },
        ],
      },
      { network: "stagenet", genesis: null, rows: LG3_ROWS.map((row) => ({ ...row })), boundaries: [] },
    ],
  };
}
type File = ReturnType<typeof validFile>;

interface FormatRow {
  readonly name: string;
  readonly change: (file: File) => unknown;
  readonly path: string;
  readonly says: readonly string[];
}

const ROWS: readonly FormatRow[] = [
  { name: "not an object", change: () => [], path: "", says: ["expected object"] },
  { name: "another format", change: (f) => ({ ...f, format: "x" }), path: "format", says: [NETWORKS_FORMAT] },
  { name: "another version", change: (f) => ({ ...f, version: 2 }), path: "version", says: ["1"] },
  { name: "an unknown top-level key", change: (f) => ({ ...f, extra: 1 }), path: "", says: ["extra"] },
  { name: "networks not a list", change: (f) => ({ ...f, networks: {} }), path: "networks", says: ["expected array"] },
  {
    name: "an unknown network",
    change: (f) => ({ ...f, networks: [{ ...f.networks[0], network: "custom" }] }),
    path: "networks[0].network",
    says: ['"mainnet"'],
  },
  {
    name: "a network listed twice",
    change: (f) => ({ ...f, networks: [f.networks[1], { ...f.networks[1] }] }),
    path: "networks[1].network",
    says: ["stagenet", "networks[0]"],
  },
  {
    name: "two networks with one genesis hash",
    change: (f) => ({ ...f, networks: [f.networks[0], { ...f.networks[0], network: "preview", boundaries: [] }] }),
    path: "networks[1].genesis.hash",
    says: ["genesis hash", "networks[0]"],
  },
  {
    name: "an unknown key of a network",
    change: (f) => ({ ...f, networks: [{ ...f.networks[1], pins: [] }] }),
    path: "networks[0]",
    says: ["pins"],
  },
  {
    name: "a genesis hash in upper-case hex",
    change: (f) => ({ ...f, networks: [{ ...f.networks[0], genesis: { ...f.networks[0]!.genesis, hash: `0x${"AB".repeat(32)}` } }] }),
    path: "networks[0].genesis.hash",
    says: ["32-byte hash"],
  },
  {
    name: "a genesis runtime that is no spec_version",
    // On stagenet, which has no boundary to chain from it.
    change: (f) => ({ ...f, networks: [f.networks[0], { ...f.networks[1], genesis: { hash: H(9), specVersion: 2 ** 32, source: SOURCE } }] }),
    path: "networks[1].genesis.specVersion",
    says: ["4294967295"],
  },
  {
    name: "a genesis without a source",
    change: (f) => ({ ...f, networks: [{ ...f.networks[0], genesis: { hash: H(1), specVersion: null } }] }),
    path: "networks[0].genesis.source",
    says: ["expected object"],
  },
  {
    name: "a source without the node",
    change: (f) => ({ ...f, networks: [{ ...f.networks[0], genesis: { ...f.networks[0]!.genesis, source: { ...SOURCE, node: "" } } }] }),
    path: "networks[0].genesis.source.node",
    says: [">=1"],
  },
  {
    name: "a source read on no calendar day",
    change: (f) => ({ ...f, networks: [{ ...f.networks[0], genesis: { ...f.networks[0]!.genesis, source: { ...SOURCE, read: "2026-02-30" } } }] }),
    path: "networks[0].genesis.source.read",
    says: ["YYYY-MM-DD"],
  },
  {
    name: "a source's date in another form",
    change: (f) => ({ ...f, networks: [{ ...f.networks[0], genesis: { ...f.networks[0]!.genesis, source: { ...SOURCE, read: "26 October 2026" } } }] }),
    path: "networks[0].genesis.source.read",
    says: ["YYYY-MM-DD"],
  },
  {
    name: "a source without its record",
    change: (f) => ({ ...f, networks: [{ ...f.networks[1], genesis: { hash: H(9), specVersion: null, source: { node: "n", read: "2026-10-26" } } }] }),
    path: "networks[0].genesis.source.record",
    says: ["expected string"],
  },
  {
    name: "no rows",
    change: (f) => ({ ...f, networks: [{ ...f.networks[1], rows: [] }] }),
    path: "networks[0].rows",
    says: [">=1"],
  },
  {
    name: "a row above the largest spec_version",
    change: (f) => ({ ...f, networks: [{ ...f.networks[1], rows: [{ specVersionMin: 3_000_000, specVersionMax: 2 ** 32, ledger: "v9" }] }] }),
    path: "networks[0].rows[0].specVersionMax",
    says: ["4294967295"],
  },
  {
    name: "a row whose bounds are the wrong way round",
    change: (f) => ({ ...f, networks: [{ ...f.networks[1], rows: [{ specVersionMin: 5, specVersionMax: 4, ledger: "v8" }] }] }),
    path: "networks[0].rows[0]",
    says: ["specVersionMin 5", "above", "specVersionMax 4"],
  },
  {
    name: "a row naming no ledger",
    change: (f) => ({ ...f, networks: [{ ...f.networks[1], rows: [{ specVersionMin: 5, specVersionMax: 6, ledger: "v7" }] }] }),
    path: "networks[0].rows[0].ledger",
    says: ['"v8"'],
  },
  {
    name: "a row naming a ledger this build does not carry",
    change: (f) => ({ ...f, networks: [{ ...f.networks[1], rows: [{ specVersionMin: 3_000_000, specVersionMax: 3_999_999, ledger: "v10" }] }] }),
    path: "networks[0].rows[0].ledger",
    says: ["v10", "v8, v9"],
  },
  {
    name: "rows out of order",
    change: (f) => ({ ...f, networks: [{ ...f.networks[1], rows: [LG3_ROWS[1], LG3_ROWS[0]] }] }),
    path: "networks[0].rows[1]",
    says: ["ascending", "rows[0]"],
  },
  {
    name: "overlapping rows",
    change: (f) => ({
      ...f,
      networks: [{ ...f.networks[1], rows: [LG3_ROWS[0], { specVersionMin: 22_999, specVersionMax: 23_000, ledger: "v8" }] }],
    }),
    path: "networks[0].rows[1]",
    says: ["ascending", "rows[0]"],
  },
  {
    name: "a boundary whose F is not U + 1",
    change: (f) => withBoundary(f, 0, (b) => ({ ...b, f: { ...b.f, height: 12 } })),
    path: "networks[0].boundaries[0].f.height",
    says: ["11", "U + 1"],
  },
  {
    name: "a boundary whose U and F carry one spec_version",
    change: (f) => withBoundary(f, 1, (b) => ({ ...b, f: { ...b.f, specVersion: 1_000_000 } })),
    path: "networks[0].boundaries[1].f.specVersion",
    says: ["1000000", "U's"],
  },
  {
    name: "a boundary whose U and F have one hash",
    change: (f) => withBoundary(f, 0, (b) => ({ ...b, f: { ...b.f, hash: b.u.hash } })),
    path: "networks[0].boundaries[0].f.hash",
    says: ["U's hash"],
  },
  {
    name: "a boundary's spec_version no row covers",
    change: (f) => withBoundary(f, 1, (b) => ({ ...b, f: { ...b.f, specVersion: 3_000_000 } })),
    path: "networks[0].boundaries[1].f.specVersion",
    says: ["3000000", "no row"],
  },
  {
    name: "a boundary's U whose spec_version no row covers",
    // The runtime at genesis unread, so that nothing but the rows speaks for U's version.
    change: (f) => ({
      ...f,
      networks: [
        {
          ...f.networks[0],
          genesis: { ...f.networks[0]!.genesis, specVersion: null },
          boundaries: [
            { u: { height: 10, hash: H(2), specVersion: 3_000_000 }, f: { height: 11, hash: H(3), specVersion: 1_000_000 }, source: SOURCE },
          ],
        },
      ],
    }),
    path: "networks[0].boundaries[0].u.specVersion",
    says: ["3000000", "no row"],
  },
  {
    name: "boundaries out of order",
    // The runtimes chain (22_000, then 1_000_000, then 2_000_000) and the runtime at genesis is unread, so only the
    // heights are wrong.
    change: (f) => ({
      ...f,
      networks: [
        {
          ...f.networks[0],
          genesis: { ...f.networks[0]!.genesis, specVersion: null },
          boundaries: [
            { u: { height: 20, hash: H(4), specVersion: 22_000 }, f: { height: 21, hash: H(5), specVersion: 1_000_000 }, source: SOURCE },
            { u: { height: 10, hash: H(2), specVersion: 1_000_000 }, f: { height: 11, hash: H(3), specVersion: 2_000_000 }, source: SOURCE },
          ],
        },
      ],
    }),
    path: "networks[0].boundaries[1].u.height",
    says: ["ascending", "boundaries[0]"],
  },
  {
    name: "a boundary whose U is the block before's F at another hash",
    change: (f) => withBoundary(f, 1, (b) => ({ ...b, u: { ...b.u, height: 11 }, f: { ...b.f, height: 12 } })),
    path: "networks[0].boundaries[1].u.hash",
    says: ["height 11", "boundaries[0]"],
  },
  {
    name: "a boundary whose U is not the runtime the one before left",
    change: (f) => withBoundary(f, 1, (b) => ({ ...b, u: { ...b.u, specVersion: 1_000_300 } })),
    path: "networks[0].boundaries[1].u.specVersion",
    says: ["1000300", "1000000", "boundaries[0]"],
  },
  {
    name: "a first boundary whose U is not the runtime at genesis",
    change: (f) => withBoundary(f, 0, (b) => ({ ...b, u: { ...b.u, specVersion: 22_001 } })),
    path: "networks[0].boundaries[0].u.specVersion",
    says: ["22001", "22000", "genesis"],
  },
  {
    name: "boundaries of a network whose genesis is not recorded",
    change: (f) => ({ ...f, networks: [{ ...f.networks[0], genesis: null }] }),
    path: "networks[0].genesis",
    says: ["genesis", "boundaries"],
  },
  {
    name: "an unknown key of a boundary",
    change: (f) => withBoundary(f, 0, (b) => ({ ...b, pin: true })),
    path: "networks[0].boundaries[0]",
    says: ["pin"],
  },
];

function withBoundary(file: File, index: number, change: (b: File["networks"][0]["boundaries"][0]) => unknown): unknown {
  const network = file.networks[0]!;
  const boundaries = network.boundaries.map((b, i) => (i === index ? change(b) : b));
  return { ...file, networks: [{ ...network, boundaries }, file.networks[1]] };
}

describe("the networks file's format (LG-3)", () => {
  it("accepts the valid synthetic file, and makes each boundary's F a pin", () => {
    const file = validFile();
    expect(networksFileProblems(file)).toEqual([]);
    const [mainnet, stagenet] = parseNetworksFile(file);
    expect(mainnet?.table).toEqual({
      rows: LG3_ROWS,
      pins: [
        { height: 11, hash: H(3), specVersion: 1_000_000 },
        { height: 21, hash: H(5), specVersion: 2_000_000 },
      ],
    });
    expect(stagenet?.table).toEqual({ rows: LG3_ROWS, pins: [] });
    expect(mainnet?.genesis).toEqual({ hash: H(1), specVersion: 22_000, source: SOURCE });
    // A boundary may follow the one before at its F (F of one is U of the next), and the runtime at genesis may be unread.
    const touching = withBoundary(validFile(), 1, (b) => ({ ...b, u: { ...b.u, height: 11, hash: H(3) }, f: { ...b.f, height: 12 } }));
    expect(networksFileProblems(touching)).toEqual([]);
    const unread = validFile();
    unread.networks[0]!.genesis = { ...unread.networks[0]!.genesis!, specVersion: null as unknown as number };
    expect(networksFileProblems(unread)).toEqual([]);
  });

  for (const row of ROWS) {
    it(`refuses ${row.name}`, () => {
      const problems = networksFileProblems(row.change(validFile()));
      expect(problems.map((problem) => problem.path)).toEqual([row.path]);
      for (const words of row.says) expect(problems[0]?.message).toContain(words);
      expect(() => parseNetworksFile(row.change(validFile()))).toThrow(row.path === "" ? /networks file/ : row.path);
    });
  }

  it("names every problem of a file at once, each with its path", () => {
    const file = validFile();
    const broken = {
      ...file,
      networks: [
        { ...file.networks[1], rows: [{ specVersionMin: 5, specVersionMax: 4, ledger: "v8" }] },
        { ...file.networks[1], network: "preview", rows: [{ specVersionMin: 1, specVersionMax: 2, ledger: "v10" }] },
      ],
    };
    expect(networksFileProblems(broken).map((problem) => problem.path)).toEqual(["networks[0].rows[0]", "networks[1].rows[0].ledger"]);
    expect(() => parseNetworksFile(broken)).toThrow(/networks\[0\]\.rows\[0\].*networks\[1\]\.rows\[0\]\.ledger/s);
  });
});
