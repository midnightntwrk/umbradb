import { describe, expect, it } from "vitest";
import { systemEventsKey } from "../../src/backbone/core-block-fetch/events.js";
import { metadataView } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { decodeChainEvents } from "../../src/backbone/core-chain-events/events.js";
import { UmbraError } from "../../src/db/errors.js";
import { contentStateOf, RuntimeMetadata, type RuntimeMetadataEntry } from "../../src/ledger/metadata.js";
import { type LedgerTable, selectLedgerVersion } from "../../src/ledger/version-table.js";
import { toHex } from "../../src/node/decode.js";
import { type ConnectSocket, connectWebSocket, NodeClient } from "../../src/node/index.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { restartAt } from "../backbone/ledger-restart.js";
import { type FoundTape, tapeTest } from "../tape/real/real-tapes.js";
import {
  CountingNode,
  devnetUpgradeOf,
  expectUpgradeDecoding,
  hashOf,
  METADATA,
  mnsvItem,
  mnsvOf,
  SYNTHETIC_TABLE,
  TapeAnswers,
  UPGRADE,
  type UpgradeCase,
  upgradeTape,
  type Walk,
} from "./version-checks.js";

/**
 * A96 `[CI]` (`openspec/changes/core-arch/acceptance.md` §12; LG-4; task 12.2), on a synthetic devnet upgrade tape:
 * runtime 1.0 (spec_version 1_000_000) until block U = 3 enacts 2.0 (2_000_000); F = 4. Each block's content is
 * decoded with the metadata of the runtime in its parent's state — `state_getMetadata` at the parent hash (block 0: at
 * block 0) — whose `spec_version` (`state_getRuntimeVersion` there) must be the block's `MNSV` version, or processing
 * halts with `metadata-mismatch`; metadata is cached by that `spec_version`. So U is decoded with the old metadata and F
 * with the new, and the cache never holds the new metadata under the old `spec_version`. The tape node serves the tape
 * and the node client of `src/node/` reads it, unchanged, as `core-block-fetch` does (task 10.3). The same checks run
 * on task 0.3's recorded devnet upgrade tape (`devnet-v8-v9-0-235`: runtime 1_000_000 until U = 102 enacts 2_001_000;
 * F = 103), skipped by name when the tape is absent: there U's and F's events are decoded besides, and U's do not
 * decode with the new runtime's metadata.
 */

const TIMEOUT_MS = 60_000;
const quietConnect: ConnectSocket = (url, events, timers) => connectWebSocket(url, events, timers, { heartbeatMs: 3_600_000 });

/** Runs `body` with a tape node serving `records` and a node client of it, both closed after. */
async function withNode<T>(records: readonly TapeRecord[], body: (client: NodeClient, node: TapeNode) => Promise<T>): Promise<T> {
  const node = await TapeNode.start({ records });
  const client = new NodeClient({ url: node.url, connect: quietConnect });
  try {
    return await body(client, node);
  } finally {
    await client.close();
    await node.close();
  }
}

/**
 * The walk `core-block-fetch` makes per height (task 10.3): the block's hash and header, its ledger version from the
 * table (LG-1), then the metadata its content is decoded with (LG-4).
 */
function walkOver(client: NodeClient, table: LedgerTable = SYNTHETIC_TABLE, last: number = UPGRADE.last): Walk {
  return async (from, metadata) => {
    const decoded = new Map<number, RuntimeMetadataEntry>();
    for (let h = from; h <= last; h++) {
      const hash = await client.blockHash(BigInt(h));
      const header = await client.header(hash);
      const { specVersion } = selectLedgerVersion(table, { height: header.number, hash, digest: header.digest });
      decoded.set(h, await metadata.forBlock({ height: header.number, hash, parentHash: header.parentHash, specVersion }));
    }
    return decoded;
  };
}

describe("A96 on the synthetic devnet upgrade tape (LG-4)", { timeout: TIMEOUT_MS }, () => {
  it("decodes U with the old metadata and F with the new, from genesis and from a cold cache at U", async () => {
    await withNode(upgradeTape(), async (client, node) => {
      await expectUpgradeDecoding(walkOver(client), () => new RuntimeMetadata(client));
      // Each walk read the runtime at every block's parent (block 0: at block 0), and the metadata once per runtime:
      // from genesis at block 0 and at U; from U at U − 1 and at U.
      const metadataReads = node.calls.filter((call) => call.method === "state_getMetadata").map((call) => call.params);
      expect(metadataReads).toEqual([[toHex(hashOf(0))], [toHex(hashOf(UPGRADE.u))], [toHex(hashOf(UPGRADE.u - 1))], [toHex(hashOf(UPGRADE.u))]]);
      const runtimeReads = node.calls.filter((call) => call.method === "state_getRuntimeVersion").map((call) => call.params);
      expect(runtimeReads).toEqual([
        ...[0, 0, 1, 2, 3, 4].map((h) => [toHex(hashOf(h))]),
        ...[2, 3, 4].map((h) => [toHex(hashOf(h))]),
      ]);
    });
  });

  it("reads a block's own state with the runtime in that state: U's is the new one", async () => {
    await withNode(upgradeTape(), async (client) => {
      const metadata = new RuntimeMetadata(client);
      expect(await metadata.forState(hashOf(UPGRADE.u))).toEqual({ specVersion: UPGRADE.new, metadata: METADATA.new });
      expect(await metadata.forState(hashOf(UPGRADE.u - 1))).toEqual({ specVersion: UPGRADE.old, metadata: METADATA.old });
      expect(metadata.cached(UPGRADE.old)).toEqual(METADATA.old);
      expect(metadata.cached(UPGRADE.new)).toEqual(METADATA.new);
      expect(metadata.specVersions()).toEqual([UPGRADE.old, UPGRADE.new]);
    });
  });

  it("halts with metadata-mismatch where the parent's runtime is not the block's MNSV version", async () => {
    // A chain whose U already says it was built by the new runtime: its parent's state still runs the old one.
    const forged = upgradeTape((h) => (h < UPGRADE.u ? UPGRADE.old : UPGRADE.new));
    await withNode(forged, async (client) => {
      const metadata = new RuntimeMetadata(client);
      let halt: unknown;
      try {
        await walkOver(client)(0, metadata);
      } catch (error) {
        halt = error;
      }
      expect(halt).toBeInstanceOf(UmbraError);
      expect((halt as UmbraError).code).toBe("metadata-mismatch");
      expect((halt as UmbraError).retryable).toBe(false);
      expect((halt as UmbraError).details).toEqual({
        height: BigInt(UPGRADE.u),
        hash: toHex(hashOf(UPGRADE.u)),
        at: toHex(hashOf(UPGRADE.u - 1)),
        specVersion: UPGRADE.new,
        runtimeSpecVersion: UPGRADE.old,
      });
      expect((halt as UmbraError).message).toContain("2000000");
      // Nothing was cached for the block that halted: the new runtime's metadata was never read.
      expect(metadata.cached(UPGRADE.new)).toBeUndefined();
      expect(metadata.specVersions()).toEqual([UPGRADE.old]);
    });
  });
});

describe("A96 on task 0.3's devnet upgrade tape (LG-4; skipped by name without the tape)", () => {
  const TAPE = "devnet-v8-v9-0-235";
  /** A whole walk of the tape's 236 blocks through the tape node, on a loaded machine. */
  const WALK_MS = 300_000;

  interface Boundary {
    readonly u: { readonly height: number; readonly hash: string; readonly specVersion: number };
    readonly f: { readonly height: number; readonly hash: string; readonly specVersion: number };
  }

  /** The devnet's upgrade as task 0.3's manifest records it, checked against the tape's answers. */
  function devnetOf(found: FoundTape): { readonly boundary: Boundary; readonly answers: TapeAnswers; readonly upgrade: UpgradeCase } {
    const boundary = (found.tape.notes as { readonly boundaries: readonly Boundary[] }).boundaries[0] as Boundary;
    expect(boundary).toMatchObject({ u: { height: 102, specVersion: 1_000_000 }, f: { height: 103, specVersion: 2_001_000 } });
    const answers = new TapeAnswers(found.read().records);
    expect([answers.hashAt(102), answers.hashAt(103)]).toEqual([boundary.u.hash, boundary.f.hash]);
    return { boundary, answers, upgrade: devnetUpgradeOf(answers, boundary, found.tape.to) };
  }

  /** The devnet's own table, a custom network's (task 0.3's note (c)): runtime 1.0 → v8, 2.x → v9; F pinned. */
  const devnetTable = (boundary: Boundary): LedgerTable => ({
    rows: [
      { specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" },
      { specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" },
    ],
    pins: [{ height: boundary.f.height, hash: boundary.f.hash, specVersion: boundary.f.specVersion }],
  });

  tapeTest(
    TAPE,
    "decodes U (102) with the old metadata and F (103) with the new, from genesis and from a cold cache at U, through the tape node and the node client",
    async (found) => {
      const { boundary, answers, upgrade } = devnetOf(found);
      expect(upgrade.last).toBe(235);
      // A walk from U is a process restarted at cursor U − 1: the tape gains that cursor's header and the metadata at
      // its hash, copied from its runtime's record (decision record Q135 A; test/backbone/ledger-restart.ts).
      const records = restartAt(found.read().records, BigInt(upgrade.u - 1));
      await withNode(records, async (client, node) => {
        await expectUpgradeDecoding(walkOver(client, devnetTable(boundary), upgrade.last), () => new RuntimeMetadata(client), upgrade);
        // The metadata read once per runtime: from genesis at block 0 and at U; from U at U − 1 and at U.
        const metadataReads = node.calls.filter((call) => call.method === "state_getMetadata").map((call) => call.params);
        const at = (h: number) => [answers.hashAt(h)];
        expect(metadataReads).toEqual([at(0), at(upgrade.u), at(upgrade.u - 1), at(upgrade.u)]);
        // The runtime read at every block's parent (block 0: at its own).
        const runtimeReads = node.calls.filter((call) => call.method === "state_getRuntimeVersion").map((call) => call.params);
        const parents = (from: number) => Array.from({ length: upgrade.last - from + 1 }, (_, i) => at(Math.max(0, from + i - 1)));
        expect(runtimeReads).toEqual([...parents(0), ...parents(upgrade.u)]);
      });
    },
    { timeoutMs: WALK_MS },
  );

  tapeTest(
    TAPE,
    "decodes every block's events with its parent's runtime's metadata; U's events do not decode with the new runtime's",
    async (found) => {
      const { boundary, upgrade } = devnetOf(found);
      await withNode(found.read().records, async (client) => {
        const metadata = new RuntimeMetadata(client);
        const table = devnetTable(boundary);
        const names = new Map<number, readonly string[]>();
        let eventsOfU: Uint8Array | null = null;
        for (let h = 0; h <= upgrade.last; h++) {
          const hash = await client.blockHash(BigInt(h));
          const header = await client.header(hash);
          const { specVersion } = selectLedgerVersion(table, { height: header.number, hash, digest: header.digest });
          const entry = await metadata.forBlock({ height: header.number, hash, parentHash: header.parentHash, specVersion });
          const events = await client.storage(systemEventsKey(), hash);
          if (h === upgrade.u) eventsOfU = events;
          const decoded = decodeChainEvents(metadataView(entry.metadata, header.number), events, header.number);
          names.set(h, decoded.map((event) => `${event.pallet}.${event.name}`));
        }
        // Block 0 has no events (no block executed the genesis state); every other block has some.
        expect(names.get(0)).toEqual([]);
        for (let h = 1; h <= upgrade.last; h++) expect(names.get(h)?.length, `block ${h}'s events`).toBeGreaterThan(0);
        // U enacts the runtime (`set_code`); F carries the node's three DUST reapply system transactions (task 0.3).
        expect(names.get(upgrade.u)).toContain("System.CodeUpdated");
        expect(names.get(upgrade.u + 1)?.filter((name) => name === "MidnightSystem.SystemTransactionApplied")).toHaveLength(3);
        // U's events, written by the old runtime, do not decode with the new runtime's metadata (U's own state's).
        expect(eventsOfU).not.toBeNull();
        expect(() => decodeChainEvents(metadataView(upgrade.metadata.new, BigInt(upgrade.u)), eventsOfU, BigInt(upgrade.u))).toThrow();
      });
    },
    { timeoutMs: WALK_MS },
  );

  tapeTest(
    TAPE,
    "halts with metadata-mismatch at U when U's header names the new runtime, whose parent's state runs the old one",
    async (found) => {
      const { boundary, answers, upgrade } = devnetOf(found);
      const hashOfU = answers.hashAt(upgrade.u);
      let forged = 0;
      const records = found.read().records.map((record): TapeRecord => {
        if (!("method" in record) || record.method !== "chain_getHeader" || (record.params as unknown[])[0] !== hashOfU) return record;
        const header = (record as unknown as { readonly result: { readonly digest: { readonly logs: readonly string[] } } }).result;
        const logs = header.digest.logs.map((item) => (item === toHex(mnsvItem(upgrade.old)) ? toHex(mnsvItem(upgrade.new)) : item));
        forged += logs.filter((item, index) => item !== header.digest.logs[index]).length;
        return { ...record, result: { ...header, digest: { ...header.digest, logs } } } as TapeRecord;
      });
      expect(forged).toBe(1);
      await withNode(records, async (client) => {
        const metadata = new RuntimeMetadata(client);
        let halt: unknown;
        try {
          await walkOver(client, devnetTable(boundary), upgrade.last)(0, metadata);
        } catch (error) {
          halt = error;
        }
        expect(halt).toBeInstanceOf(UmbraError);
        expect((halt as UmbraError).code).toBe("metadata-mismatch");
        expect((halt as UmbraError).details).toEqual({
          height: BigInt(upgrade.u),
          hash: hashOfU,
          at: answers.hashAt(upgrade.u - 1),
          specVersion: upgrade.new,
          runtimeSpecVersion: upgrade.old,
        });
        expect(metadata.cached(upgrade.new)).toBeUndefined();
        expect(metadata.specVersions()).toEqual([upgrade.old]);
      });
    },
    { timeoutMs: WALK_MS },
  );
});

describe("the metadata cache (LG-4)", () => {
  const blockAt = (h: number) => ({ height: BigInt(h), hash: hashOf(h), parentHash: h === 0 ? new Uint8Array(32) : hashOf(h - 1), specVersion: mnsvOf(h) });
  const node = () =>
    new CountingNode(
      (hash) => (hash === toHex(hashOf(0)) || hash === toHex(hashOf(1)) || hash === toHex(hashOf(2)) ? UPGRADE.old : UPGRADE.new),
      (hash) => (hash === toHex(hashOf(0)) || hash === toHex(hashOf(1)) || hash === toHex(hashOf(2)) ? METADATA.old : METADATA.new),
    );

  it("reads the content's runtime at the parent's state, and block 0's at its own", () => {
    expect(contentStateOf(blockAt(0))).toEqual(hashOf(0));
    expect(contentStateOf(blockAt(1))).toEqual(hashOf(0));
    expect(contentStateOf(blockAt(UPGRADE.f))).toEqual(hashOf(UPGRADE.u));
  });

  it("reads each spec_version's metadata once, also for blocks asked for at the same time", async () => {
    const counting = node();
    const metadata = new RuntimeMetadata(counting);
    const entries = await Promise.all([1, 2, 3, 1, 2].map((h) => metadata.forBlock(blockAt(h))));
    expect(entries.map((entry) => entry.specVersion)).toEqual([UPGRADE.old, UPGRADE.old, UPGRADE.old, UPGRADE.old, UPGRADE.old]);
    expect(counting.calls.filter((call) => call.startsWith("metadata"))).toHaveLength(1);
    expect(counting.calls.filter((call) => call.startsWith("runtimeVersion"))).toHaveLength(5);
    // The same bytes for every block of a runtime.
    expect(entries[0]?.metadata).toBe(entries[4]?.metadata);
  });

  it("reads a metadata again after a failed read, and keeps nothing of it", async () => {
    let failures = 1;
    const flaky = new CountingNode(
      () => UPGRADE.old,
      () => {
        if (failures-- > 0) throw new Error("the node did not answer");
        return METADATA.old;
      },
    );
    const metadata = new RuntimeMetadata(flaky);
    await expect(metadata.forBlock(blockAt(1))).rejects.toThrow("the node did not answer");
    expect(metadata.cached(UPGRADE.old)).toBeUndefined();
    expect(metadata.specVersions()).toEqual([]);
    expect(await metadata.forBlock(blockAt(1))).toEqual({ specVersion: UPGRADE.old, metadata: METADATA.old });
    expect(flaky.calls.filter((call) => call.startsWith("metadata"))).toHaveLength(2);
  });

  it("checks the version before reading metadata, so a mismatching block reads none", async () => {
    const counting = node();
    const metadata = new RuntimeMetadata(counting);
    await expect(metadata.forBlock({ ...blockAt(1), specVersion: UPGRADE.new })).rejects.toMatchObject({ code: "metadata-mismatch" });
    expect(counting.calls).toEqual([`runtimeVersion ${toHex(hashOf(0))}`]);
  });

  it("gives frozen entries", async () => {
    const entry = await new RuntimeMetadata(node()).forBlock(blockAt(1));
    expect(Object.isFrozen(entry)).toBe(true);
  });
});
