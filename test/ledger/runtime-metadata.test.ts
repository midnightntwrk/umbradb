import { describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { contentStateOf, RuntimeMetadata, type RuntimeMetadataEntry } from "../../src/ledger/metadata.js";
import { type LedgerTable, selectLedgerVersion } from "../../src/ledger/version-table.js";
import { toHex } from "../../src/node/decode.js";
import { type ConnectSocket, connectWebSocket, NodeClient } from "../../src/node/index.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import {
  CountingNode,
  expectUpgradeDecoding,
  hashOf,
  METADATA,
  mnsvOf,
  SYNTHETIC_TABLE,
  UPGRADE,
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
 * and the node client of `src/node/` reads it, unchanged, as `core-block-fetch` will (task 10.3); task 0.3's devnet
 * upgrade tape replaces the synthetic one (the walk below is what it must answer).
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
function walkOver(client: NodeClient, table: LedgerTable = SYNTHETIC_TABLE): Walk {
  return async (from, metadata) => {
    const decoded = new Map<number, RuntimeMetadataEntry>();
    for (let h = from; h <= UPGRADE.last; h++) {
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
