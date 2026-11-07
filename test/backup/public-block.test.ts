import { describe, expect, it } from "vitest";
import { hex } from "../../src/backup/facts.js";
import type { Manifest } from "../../src/backup/manifest.js";
import { checkPublicBlock, type PublicSide } from "../../src/backup/restore.js";
import { UmbraError } from "../../src/db/errors.js";

/**
 * The restore's block check against a private process's public database (`checkPublicBlock`): the public head must be
 * at or above the backup's height and its block there the backup's — refused `backup-block-not-finalized` with no head,
 * a head below, no block there or another one, each message and its details. [BK-3, PP-12]
 */

const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const block = (height: bigint, byte: number) => ({ height, hash: hash(byte), parentHash: hash(byte - 1) });
const manifest = { height: "10", blockHash: hex(hash(10)) } as unknown as Manifest;
const side = (head: PublicSide["head"], at: PublicSide["block"]): PublicSide =>
  ({ identity: {} as PublicSide["identity"], items: [], head, block: at }) as PublicSide;

function refusal(run: () => void): UmbraError {
  try {
    run();
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  throw new Error("not refused");
}

describe("checkPublicBlock (task 17.5b)", () => {
  it("passes with the head at or above the backup's height and the backup's block there", () => {
    expect(() => checkPublicBlock(side(block(10n, 10), block(10n, 10)), manifest)).not.toThrow();
    expect(() => checkPublicBlock(side(block(12n, 12), block(10n, 10)), manifest)).not.toThrow();
  });

  it("refuses no head and a head below the height, naming both", () => {
    const none = refusal(() => checkPublicBlock(side(null, null), manifest));
    expect(none.code).toBe("backup-block-not-finalized");
    expect(none.message).toBe(
      "the public database's committed head is none, below the backup's height 10: its core has not committed the " +
        "backup's block there yet; restore once it has",
    );
    expect(none.details).toEqual({ height: "10", head: null });
    const below = refusal(() => checkPublicBlock(side(block(9n, 9), null), manifest));
    expect(below.message).toContain("committed head is 9, below the backup's height 10");
    expect(below.details).toEqual({ height: "10", head: "9" });
  });

  it("refuses no block at the height, or another block there, naming both hashes", () => {
    const none = refusal(() => checkPublicBlock(side(block(11n, 11), null), manifest));
    expect(none.code).toBe("backup-block-not-finalized");
    expect(none.message).toBe(
      `the public database's committed block at 10 has the hash none, and the backup's ${hex(hash(10))}: its core ` +
        "committed another block there",
    );
    expect(none.details).toEqual({ height: "10", public: null, backup: hex(hash(10)) });
    const other = refusal(() => checkPublicBlock(side(block(11n, 11), block(10n, 7)), manifest));
    expect(other.message).toContain(`has the hash ${hex(hash(7))}, and the backup's ${hex(hash(10))}`);
    expect(other.details).toEqual({ height: "10", public: hex(hash(7)), backup: hex(hash(10)) });
  });
});
