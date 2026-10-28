import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildCoreVersion } from "../../src/config/build.js";
import { checkPackageFiles, readManifest, verifyLedgerPackages } from "../../src/ledger/identity.js";
import { type MetadataNode, RuntimeMetadata, type RuntimeMetadataEntry } from "../../src/ledger/metadata.js";
import { ledgerOfSpecVersion, mnsvSpecVersion, selectLedgerVersion } from "../../src/ledger/version-table.js";
import { hashAnswer, headerAnswer, toHex } from "../../src/node/decode.js";
import { tapeTest } from "../tape/real/real-tapes.js";
import {
  copyVendoredLedger,
  CountingNode,
  devnetUpgradeOf,
  expectBadVersionDigestHalts,
  expectEveryPackageFileChecked,
  expectPinsChecked,
  expectUnknownRuntimeHalts,
  expectUpgradeDecoding,
  hashOf,
  METADATA,
  type MetadataSelector,
  mnsvItem,
  runtimeAt,
  type Select,
  SYNTHETIC_TABLE,
  TapeAnswers,
  tapeMetadataNode,
  UPGRADE,
  type Walk,
} from "./version-checks.js";

/**
 * The committed negative controls of A94, A96 and A97 (task 12.2): wrong implementations, each of which must make the
 * check the tests run (`version-checks.ts`) fail; the real ones pass the same checks in this file's build.
 *
 * - **A selector that ignores pins** (the digest and the rows only) passes a block contradicting a pin, and fails A94's
 *   pin clause — while passing its other two, which do not depend on pins.
 * - **A metadata cache keyed by the block's own `spec_version` and read at the block's own state** (instead of the
 *   parent's runtime, read at the parent's state) decodes U with the new metadata and stores it under the old
 *   `spec_version`, and fails A96's synthetic case — and the same check on task 0.3's devnet upgrade tape (skipped by
 *   name without the tape).
 * - **An identity check that skips one package file** (the last line of each manifest) accepts that file changed by one
 *   byte, and fails A97.
 */

/** The assertion error a check fails with; fails the test if the check passes or fails otherwise. */
async function assertionFailure(check: () => unknown): Promise<Error> {
  try {
    await check();
  } catch (error) {
    if (error instanceof Error && error.name === "AssertionError") return error;
    throw error;
  }
  throw new Error("the check passed against a wrong implementation");
}

describe("A94's negative control: a selector that ignores pins", () => {
  const ignoringPins: Select = (table, block) => {
    const specVersion = mnsvSpecVersion(block);
    return Object.freeze({ specVersion, ledger: ledgerOfSpecVersion(table.rows, block, specVersion) });
  };

  it("passes a block contradicting a pin, and fails A94's pin clause", async () => {
    const block = { height: 1_000n, hash: hashOf(5), digest: [mnsvItem(1_000_000)] };
    expect(ignoringPins(SYNTHETIC_TABLE, block)).toEqual({ specVersion: 1_000_000, ledger: "v8" });
    const failure = await assertionFailure(() => expectPinsChecked(ignoringPins));
    expect(failure.message).toMatch(/expected a halt/);
  });

  it("passes A94's other clauses, which the pins do not decide", () => {
    expectUnknownRuntimeHalts(ignoringPins);
    expectBadVersionDigestHalts(ignoringPins);
  });

  it("the real selector passes every clause in this file's build", () => {
    expectUnknownRuntimeHalts(selectLedgerVersion);
    expectBadVersionDigestHalts(selectLedgerVersion);
    expectPinsChecked(selectLedgerVersion);
  });
});

describe("A96's negative control: a cache keyed by the block's own spec_version, read at its own state", () => {
  /** The synthetic devnet's node, at each block's state. */
  const node = (): MetadataNode =>
    new CountingNode(
      (hash) => runtimeAt(heightOf(hash)),
      (hash) => (runtimeAt(heightOf(hash)) === UPGRADE.old ? METADATA.old : METADATA.new),
    );
  const heightOf = (hash: string): number => {
    for (let h = 0; h <= UPGRADE.last; h++) if (toHex(hashOf(h)) === hash) return h;
    throw new Error(`no block ${hash}`);
  };

  /** The wrong cache: the block's own MNSV version as the key, the metadata of the block's own state. */
  class OwnStateMetadata implements MetadataSelector {
    readonly #node: MetadataNode;
    readonly #cache = new Map<number, Uint8Array>();
    constructor(source: MetadataNode) {
      this.#node = source;
    }
    async forBlock(block: { readonly hash: Uint8Array; readonly specVersion: number }): Promise<RuntimeMetadataEntry> {
      const known = this.#cache.get(block.specVersion);
      const metadata = known ?? (await this.#node.metadata(block.hash));
      this.#cache.set(block.specVersion, metadata);
      return Object.freeze({ specVersion: block.specVersion, metadata });
    }
    cached(specVersion: number): Uint8Array | undefined {
      return this.#cache.get(specVersion);
    }
  }

  /** The walk over the synthetic chain, with each block's MNSV version from the devnet's digests. */
  const walk: Walk = async (from, metadata) => {
    const decoded = new Map<number, RuntimeMetadataEntry>();
    for (let h = from; h <= UPGRADE.last; h++) {
      const specVersion = h <= UPGRADE.u ? UPGRADE.old : UPGRADE.new;
      decoded.set(h, await metadata.forBlock({ height: BigInt(h), hash: hashOf(h), parentHash: h === 0 ? new Uint8Array(32) : hashOf(h - 1), specVersion }));
    }
    return decoded;
  };

  it("decodes U with the new metadata from a cold cache, stores it under the old spec_version, and fails A96", async () => {
    const wrong = new OwnStateMetadata(node());
    const decoded = await walk(UPGRADE.u, wrong);
    expect(decoded.get(UPGRADE.u)).toEqual({ specVersion: UPGRADE.old, metadata: METADATA.new });
    expect(wrong.cached(UPGRADE.old)).toEqual(METADATA.new);
    const failure = await assertionFailure(() => expectUpgradeDecoding(walk, () => new OwnStateMetadata(node())));
    expect(failure.message).toMatch(/block 3 from 3/);
  });

  it("the real cache passes A96's check over the same node in this file's build", async () => {
    await expectUpgradeDecoding(walk, () => new RuntimeMetadata(node()));
  });

  tapeTest(
    "devnet-v8-v9-0-235",
    "on task 0.3's devnet upgrade tape, it decodes U (102) with the new metadata from a cold cache and fails A96 there too; the real cache passes",
    async (found) => {
      const answers = new TapeAnswers(found.read().records);
      const boundary = (found.tape.notes as { readonly boundaries: readonly Parameters<typeof devnetUpgradeOf>[1][] }).boundaries[0]!;
      const upgrade = devnetUpgradeOf(answers, boundary, found.tape.to);
      // The walk over the tape's headers: each block's MNSV version, its parent's hash.
      const tapeWalk: Walk = async (from, metadata) => {
        const decoded = new Map<number, RuntimeMetadataEntry>();
        for (let h = from; h <= upgrade.last; h++) {
          const hash = hashAnswer("chain_getBlockHash", "result", answers.hashAt(h));
          const header = headerAnswer("chain_getHeader", "result", answers.answer("chain_getHeader", answers.hashAt(h)));
          const specVersion = mnsvSpecVersion({ height: header.number, hash, digest: header.digest });
          decoded.set(h, await metadata.forBlock({ height: header.number, hash, parentHash: header.parentHash, specVersion }));
        }
        return decoded;
      };
      const wrong = new OwnStateMetadata(tapeMetadataNode(answers, upgrade));
      const decoded = await tapeWalk(upgrade.u, wrong);
      expect(decoded.get(upgrade.u)).toEqual({ specVersion: upgrade.old, metadata: upgrade.metadata.new });
      expect(wrong.cached(upgrade.old)).toEqual(upgrade.metadata.new);
      const failure = await assertionFailure(() =>
        expectUpgradeDecoding(tapeWalk, () => new OwnStateMetadata(tapeMetadataNode(answers, upgrade)), upgrade),
      );
      expect(failure.message).toMatch(/block 102 from 102/);
      await expectUpgradeDecoding(tapeWalk, () => new RuntimeMetadata(tapeMetadataNode(answers, upgrade)), upgrade);
    },
    // Three walks of 236 blocks, each comparing every block's metadata (hundreds of kilobytes) on a loaded machine.
    { timeoutMs: 300_000 },
  );
});

describe("A97's negative control: an identity check that skips one package file", () => {
  let copy: ReturnType<typeof copyVendoredLedger>;
  beforeAll(() => {
    copy = copyVendoredLedger();
  });
  afterAll(() => copy.remove());

  /** The startup check without each manifest's last file. */
  const skippingOne = (root: string): void => {
    for (const item of buildCoreVersion().ledgers) {
      const lines = readManifest(root, item.ledger, item.packages[0]!.sha256);
      checkPackageFiles(root, item.ledger, lines.slice(0, -1));
    }
  };

  it("accepts the skipped file changed by one byte, and fails A97", { timeout: 120_000 }, async () => {
    const failure = await assertionFailure(() => expectEveryPackageFileChecked(copy.root, skippingOne));
    expect(failure.message).toMatch(/v8\/pkg\/snippets\/midnight-ledger-wasm-f9e2692d6bfdfbba\/inline9\.js changed by one byte/);
  });

  it("the real check passes A97 in this file's build", { timeout: 120_000 }, () => {
    expectEveryPackageFileChecked(copy.root, (root) => verifyLedgerPackages({ root }));
  });
});
