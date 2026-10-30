import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import type { LedgerSelection, LedgerTable, VersionedBlock } from "../../src/ledger/version-table.js";
import type { MetadataBlock, MetadataNode, RuntimeMetadataEntry } from "../../src/ledger/metadata.js";
import { toHex } from "../../src/node/decode.js";
import type { TapeRecord } from "../../tools/tape/index.js";

/**
 * Checks of ledger version selection, runtime metadata and package identity. Both the tests and their committed
 * negative controls (`version.negative-control.test.ts`) run them, so a control shows the very check failing against a
 * wrong selector, a wrong metadata cache or a wrong identity check, while the real ones pass it in the same build.
 * The metadata check runs on the synthetic devnet and on the recorded devnet upgrade tape ({@link devnetUpgradeOf}).
 * [A94, A96, A97]
 */

// ---- headers and digests -----------------------------------------------------------------------------------------

/** A 32-byte hash, distinct for each `n`. */
export const hashOf = (n: number): Uint8Array => {
  const bytes = new Uint8Array(32);
  new DataView(bytes.buffer).setUint32(28, n);
  bytes[0] = 0xb1;
  return bytes;
};

/** The node's `MNSV` digest item for `specVersion`: `DigestItem::Consensus(*b"MNSV", spec_version.encode())`. */
export function mnsvItem(specVersion: number): Uint8Array {
  const item = Uint8Array.of(0x04, 0x4d, 0x4e, 0x53, 0x56, 0x10, 0, 0, 0, 0);
  new DataView(item.buffer).setUint32(6, specVersion, true);
  return item;
}

/** Items a real mainnet header carries besides `MNSV` (block 3,174,332, `test/node/fixtures/mainnet-answers.json`). */
export const OTHER_ITEMS: readonly Uint8Array[] = [
  "0661757261201ac0cf1100000000", // PreRuntime aura
  "04424545468403d08729094de11de7c9d8e649428bf3f367e0e287555c8aadbe762df973c1995d", // Consensus BEEF
].map((text) => Uint8Array.from(Buffer.from(text, "hex")));

/** A block at `height` with `digest` (the other items first, as the node orders them). */
export function blockWith(height: number, digest: readonly Uint8Array[], hash: Uint8Array = hashOf(height)): VersionedBlock {
  return { height: BigInt(height), hash, digest };
}

/** A synthetic table: the built-in tables' rows, and a pin at 1,000 (spec_version 1_000_000). [LG-3] */
export const SYNTHETIC_TABLE: LedgerTable = Object.freeze({
  rows: Object.freeze([
    Object.freeze({ specVersionMin: 22_000, specVersionMax: 22_999, ledger: "v8" as const }),
    Object.freeze({ specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" as const }),
    Object.freeze({ specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" as const }),
  ]),
  pins: Object.freeze([Object.freeze({ height: 1_000, hash: toHex(hashOf(1_000)), specVersion: 1_000_000 })]),
});

/** The `UmbraError` `run` throws; fails the test if it throws nothing or something else. */
export function haltOf(run: () => unknown): UmbraError {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(UmbraError);
    return error as UmbraError;
  }
  return expect.unreachable("expected a halt, and nothing was thrown");
}

/** A selection function: `selectLedgerVersion`, or a wrong one of the controls. */
export type Select = (table: LedgerTable, block: VersionedBlock) => LedgerSelection;

// ---- Ledger version selection [A94] ------------------------------------------------------------------------------

/**
 * A block whose `spec_version` no row covers (the requirement's example: 3_000_000) halts with `unknown-runtime`.
 * [A94, LG-1]
 */
export function expectUnknownRuntimeHalts(select: Select): void {
  const halt = haltOf(() => select(SYNTHETIC_TABLE, blockWith(7, [...OTHER_ITEMS, mnsvItem(3_000_000)])));
  expect(halt.code).toBe("unknown-runtime");
  expect(halt.retryable).toBe(false);
  expect(halt.details).toMatchObject({ height: 7n, hash: toHex(hashOf(7)), specVersion: 3_000_000, rows: 0 });
  expect(halt.message).toContain("3000000");
  // The rows' edges are inclusive.
  for (const [specVersion, ledger] of [
    [22_000, "v8"],
    [22_999, "v8"],
    [1_000_000, "v8"],
    [1_999_999, "v8"],
    [2_000_000, "v9"],
    [2_999_999, "v9"],
  ] as const) {
    expect(select(SYNTHETIC_TABLE, blockWith(7, [mnsvItem(specVersion)]))).toEqual({ specVersion, ledger });
  }
  for (const specVersion of [0, 21_999, 23_000, 999_999, 3_000_000, 4_294_967_295]) {
    expect(haltOf(() => select(SYNTHETIC_TABLE, blockWith(7, [mnsvItem(specVersion)]))).code).toBe("unknown-runtime");
  }
}

/** A block with no `MNSV` digest, or with two, halts with `bad-version-digest`. [A94] */
export function expectBadVersionDigestHalts(select: Select): void {
  const missing = haltOf(() => select(SYNTHETIC_TABLE, blockWith(8, OTHER_ITEMS)));
  expect(missing.code).toBe("bad-version-digest");
  expect(missing.details).toMatchObject({ height: 8n, hash: toHex(hashOf(8)), reason: "missing", items: 0 });
  const two = haltOf(() => select(SYNTHETIC_TABLE, blockWith(8, [mnsvItem(1_000_000), ...OTHER_ITEMS, mnsvItem(1_000_000)])));
  expect(two.code).toBe("bad-version-digest");
  expect(two.details).toMatchObject({ reason: "several", items: 2 });
  const none = haltOf(() => select(SYNTHETIC_TABLE, blockWith(8, [])));
  expect(none.details).toMatchObject({ reason: "missing", items: 0 });
}

/**
 * A block contradicting a pin halts with `pin-mismatch`; one agreeing with it, or at another height, passes. [A94]
 */
export function expectPinsChecked(select: Select): void {
  const pinned = (hash: Uint8Array, specVersion: number) => blockWith(1_000, [mnsvItem(specVersion)], hash);
  expect(select(SYNTHETIC_TABLE, pinned(hashOf(1_000), 1_000_000))).toEqual({ specVersion: 1_000_000, ledger: "v8" });
  const wrongHash = haltOf(() => select(SYNTHETIC_TABLE, pinned(hashOf(5), 1_000_000)));
  expect(wrongHash.code).toBe("pin-mismatch");
  expect(wrongHash.details).toMatchObject({
    height: 1_000n,
    hash: toHex(hashOf(5)),
    specVersion: 1_000_000,
    pin: { height: 1_000, hash: toHex(hashOf(1_000)), specVersion: 1_000_000 },
    differs: ["hash"],
  });
  // A spec version the rows also know, so that only the pin can refuse it.
  const wrongVersion = haltOf(() => select(SYNTHETIC_TABLE, pinned(hashOf(1_000), 1_000_300)));
  expect(wrongVersion.code).toBe("pin-mismatch");
  expect(wrongVersion.details).toMatchObject({ specVersion: 1_000_300, differs: ["specVersion"] });
  const both = haltOf(() => select(SYNTHETIC_TABLE, pinned(hashOf(6), 2_000_000)));
  expect(both.details).toMatchObject({ differs: ["hash", "specVersion"] });
  // Another height is not the pin's: rows alone choose.
  expect(select(SYNTHETIC_TABLE, blockWith(999, [mnsvItem(2_000_000)]))).toEqual({ specVersion: 2_000_000, ledger: "v9" });
  expect(select(SYNTHETIC_TABLE, blockWith(1_001, [mnsvItem(2_000_000)]))).toEqual({ specVersion: 2_000_000, ledger: "v9" });
}

// ---- Runtime metadata [A96] --------------------------------------------------------------------------------------

/** What a metadata cache does for the walk: `RuntimeMetadata`, or a wrong one of the controls. */
export interface MetadataSelector {
  forBlock(block: MetadataBlock): Promise<RuntimeMetadataEntry>;
  cached(specVersion: number): Uint8Array | undefined;
}

/** The synthetic devnet upgrade: runtime A until block U enacts B; F = U + 1 is the first block B builds. */
export const UPGRADE = Object.freeze({ u: 3, f: 4, last: 5, old: 1_000_000, new: 2_000_000 });

const utf8 = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "utf8"));

/** Each runtime's metadata (`state_getMetadata`'s answer, as bytes). */
export const METADATA = Object.freeze({ old: utf8("metadata of runtime 1.0.0"), new: utf8("metadata of runtime 2.0.0") });

/** The `MNSV` version of block `h`: U is still built by the old runtime. */
export const mnsvOf = (h: number): number => (h <= UPGRADE.u ? UPGRADE.old : UPGRADE.new);

/** The runtime in the state after block `h`: U's own state already holds the new one (`set_code` runs in U). */
export const runtimeAt = (h: number): number => (h < UPGRADE.u ? UPGRADE.old : UPGRADE.new);

const parentOf = (h: number): Uint8Array => (h === 0 ? new Uint8Array(32) : hashOf(h - 1));

/**
 * The synthetic devnet's tape: per height, the block hash, the header (its digest the `MNSV` item of {@link mnsvOf},
 * or `digestOf`'s), and the runtime version and metadata at its state (the tape file's call records, answered by the
 * tape node). [TT-1]
 */
export function upgradeTape(digestOf: (h: number) => number = mnsvOf): TapeRecord[] {
  const records: TapeRecord[] = [];
  for (let h = 0; h <= UPGRADE.last; h++) {
    const hash = toHex(hashOf(h));
    const runtime = runtimeAt(h);
    records.push(
      { method: "chain_getBlockHash", params: [h], result: hash },
      {
        method: "chain_getHeader",
        params: [hash],
        result: {
          parentHash: toHex(parentOf(h)),
          number: `0x${h.toString(16)}`,
          stateRoot: toHex(hashOf(100 + h)),
          extrinsicsRoot: toHex(hashOf(200 + h)),
          digest: { logs: [...OTHER_ITEMS.map(toHex), toHex(mnsvItem(digestOf(h)))] },
        },
      },
      {
        method: "state_getRuntimeVersion",
        params: [hash],
        result: { specName: "midnight", implName: "midnight", specVersion: runtime, implVersion: 0, transactionVersion: 2 },
      },
      {
        method: "state_getMetadata",
        params: [hash],
        result: toHex(runtime === UPGRADE.old ? METADATA.old : METADATA.new),
      },
    );
  }
  return records;
}

/** What a walk over the chain reads: per height, its `MNSV` version and the metadata its content is decoded with. */
export type Walk = (from: number, metadata: MetadataSelector) => Promise<Map<number, RuntimeMetadataEntry>>;

/**
 * A runtime upgrade a walk crosses. The old runtime builds every block up to U, which enacts the new one. F = U + 1
 * and every block after it to `last` are built by the new runtime. Each runtime's metadata is as its node answers it.
 * [A96]
 */
export interface UpgradeCase {
  readonly u: number;
  readonly last: number;
  readonly old: number;
  readonly new: number;
  readonly metadata: { readonly old: Uint8Array; readonly new: Uint8Array };
}

/** The synthetic devnet's upgrade ({@link UPGRADE}, {@link METADATA}). */
export const SYNTHETIC_UPGRADE: UpgradeCase = Object.freeze({
  u: UPGRADE.u,
  last: UPGRADE.last,
  old: UPGRADE.old,
  new: UPGRADE.new,
  metadata: METADATA,
});

/**
 * U is decoded with the old metadata (its parent's runtime) and F with the new (U's), and the cache never holds the
 * new metadata under the old `spec_version`. This holds from genesis, and from a cold cache at U (a restart at cursor
 * U − 1, where nothing older is cached to mask a wrong read). Runs on the synthetic devnet unless `upgrade` names
 * another (the recorded devnet tape: {@link devnetUpgradeOf}). [A96]
 */
export async function expectUpgradeDecoding(
  walk: Walk,
  makeSelector: () => MetadataSelector,
  upgrade: UpgradeCase = SYNTHETIC_UPGRADE,
): Promise<void> {
  const mnsv = (h: number): number => (h <= upgrade.u ? upgrade.old : upgrade.new);
  for (const from of [0, upgrade.u]) {
    const metadata = makeSelector();
    const decoded = await walk(from, metadata);
    for (let h = from; h <= upgrade.last; h++) {
      const expected = mnsv(h) === upgrade.old ? upgrade.metadata.old : upgrade.metadata.new;
      expect(decoded.get(h), `block ${h} from ${from}`).toEqual({ specVersion: mnsv(h), metadata: expected });
    }
    expect(metadata.cached(upgrade.old), `the old version's metadata, walking from ${from}`).toEqual(upgrade.metadata.old);
    expect(metadata.cached(upgrade.new), `the new version's metadata, walking from ${from}`).toEqual(upgrade.metadata.new);
  }
}

// ---- The recorded devnet upgrade tape: runtime metadata on real data [A96] ---------------------------------------

type CallRecord = Extract<TapeRecord, { readonly method: string; readonly result: unknown }>;

const isCall = (record: TapeRecord): record is CallRecord => "method" in record && "result" in record && !("subscribe" in record);

/** The answers of a recorded tape by method and first parameter (the tape holds each call of a height once). */
export class TapeAnswers {
  readonly #answers = new Map<string, unknown>();

  constructor(records: readonly TapeRecord[]) {
    for (const record of records) {
      if (!isCall(record)) continue;
      const key = `${record.method} ${JSON.stringify((record.params as readonly unknown[] | undefined)?.[0] ?? null)}`;
      if (!this.#answers.has(key)) this.#answers.set(key, record.result);
    }
  }

  /** The answer to `method` with `param` first, or undefined when the tape holds none. */
  answer(method: string, param: unknown): unknown {
    return this.#answers.get(`${method} ${JSON.stringify(param)}`);
  }

  /** Block `height`'s hash (`chain_getBlockHash`); throws when the tape holds none. */
  hashAt(height: number): string {
    const hash = this.answer("chain_getBlockHash", height);
    if (typeof hash !== "string") throw new Error(`the tape holds no block hash for ${height}`);
    return hash;
  }

  /** The `spec_version` of the runtime in the state at `hash` (`state_getRuntimeVersion`); throws when none. */
  runtimeAt(hash: string): number {
    const version = (this.answer("state_getRuntimeVersion", hash) as { readonly specVersion?: unknown } | undefined)?.specVersion;
    if (typeof version !== "number") throw new Error(`the tape holds no runtime version at ${hash}`);
    return version;
  }
}

const bytesOf = (text: unknown): Uint8Array => {
  if (typeof text !== "string" || !/^0x([0-9a-f]{2})*$/.test(text)) throw new Error("the tape's metadata is not 0x hex");
  return Uint8Array.from(Buffer.from(text.slice(2), "hex"));
};

/**
 * The recorded devnet upgrade as an {@link UpgradeCase}:
 * - U and F as the tape's manifest records them (U 102, MNSV 1_000_000; F 103, MNSV 2_001_000), checked against the
 *   tape's own answers: U's state already runs the new runtime, U − 1's the old;
 * - `last`, the tape's last height;
 * - each runtime's metadata as the node answered it (`state_getMetadata` at block 0 and at U, since the tape holds it
 *   once per runtime). [Q135]
 */
export function devnetUpgradeOf(
  answers: TapeAnswers,
  boundary: { readonly u: { readonly height: number; readonly specVersion: number }; readonly f: { readonly specVersion: number } },
  last: number,
): UpgradeCase {
  const u = boundary.u.height;
  expect(answers.runtimeAt(answers.hashAt(u - 1)), "the runtime in U − 1's state").toBe(boundary.u.specVersion);
  expect(answers.runtimeAt(answers.hashAt(u)), "the runtime in U's state").toBe(boundary.f.specVersion);
  const old = bytesOf(answers.answer("state_getMetadata", answers.hashAt(0)));
  const updated = bytesOf(answers.answer("state_getMetadata", answers.hashAt(u)));
  expect(Buffer.compare(old, updated), "the two runtimes' metadata").not.toBe(0);
  return Object.freeze({ u, last, old: boundary.u.specVersion, new: boundary.f.specVersion, metadata: Object.freeze({ old, new: updated }) });
}

/**
 * A node over a recorded tape's answers for the metadata cache: the runtime version at a hash as recorded, and the
 * metadata at any hash as its runtime's own. The tape holds the metadata once per runtime, and the node answers the
 * same bytes at every block of a runtime, so a cache may read it at a hash the tape has no metadata record for. [Q135]
 */
export function tapeMetadataNode(answers: TapeAnswers, upgrade: UpgradeCase): MetadataNode {
  return new CountingNode(
    (hash) => answers.runtimeAt(hash),
    (hash) => (answers.runtimeAt(hash) === upgrade.old ? upgrade.metadata.old : upgrade.metadata.new),
  );
}

/** A {@link MetadataNode} over plain functions, counting the calls (for the cache's unit tests). */
export class CountingNode implements MetadataNode {
  readonly calls: string[] = [];
  readonly #runtimes: (hash: string) => number;
  readonly #metadata: (hash: string) => Uint8Array;

  constructor(runtimes: (hash: string) => number, metadata: (hash: string) => Uint8Array) {
    this.#runtimes = runtimes;
    this.#metadata = metadata;
  }

  async runtimeVersion(at: Uint8Array): Promise<{ readonly specVersion: number }> {
    this.calls.push(`runtimeVersion ${toHex(at)}`);
    return { specVersion: this.#runtimes(toHex(at)) };
  }

  async metadata(at: Uint8Array): Promise<Uint8Array> {
    this.calls.push(`metadata ${toHex(at)}`);
    return this.#metadata(toHex(at));
  }
}

// ---- Package identity [A97] --------------------------------------------------------------------------------------

/** The repository's vendored ledger builds. */
export const VENDORED_ROOT = fileURLToPath(new URL("../../vendor/ledger/", import.meta.url));

/** Every vendored ledger version, in the core version's order (including v9 as runtime 2.0 built it). */
export const VENDORED_LEDGERS = ["v8", "v9-rc3", "v9"] as const;

/** A copy of the vendored builds (each version's `SHA256SUMS` and `pkg/`) in a new temporary directory. */
export function copyVendoredLedger(): { readonly root: string; readonly remove: () => void } {
  const root = mkdtempSync(join(tmpdir(), "umbradb-12.2-ledger-"));
  for (const ledger of VENDORED_LEDGERS) {
    cpSync(join(VENDORED_ROOT, ledger, "SHA256SUMS"), join(root, ledger, "SHA256SUMS"));
    cpSync(join(VENDORED_ROOT, ledger, "pkg"), join(root, ledger, "pkg"), { recursive: true });
  }
  return { root, remove: () => rmSync(root, { recursive: true, force: true }) };
}

/** The files each version's `SHA256SUMS` lists, as `<version>/<path>`, and the manifests themselves. */
export function packageFiles(root: string): string[] {
  return VENDORED_LEDGERS.flatMap((ledger) => [
    `${ledger}/SHA256SUMS`,
    ...readFileSync(join(root, ledger, "SHA256SUMS"), "utf8")
      .trimEnd()
      .split("\n")
      .map((line) => `${ledger}/${line.slice(66)}`),
  ]);
}

/**
 * Every file of every vendored package, and each version's `SHA256SUMS`, changed by one byte refuses startup with
 * `package-hash-mismatch` naming the version and the file; restored, the packages pass again. `verify` is the startup
 * check over the packages under `root`. [A97]
 */
export function expectEveryPackageFileChecked(root: string, verify: (root: string) => void): void {
  verify(root);
  const files = packageFiles(root);
  expect(files.length).toBeGreaterThan(60);
  for (const file of files) {
    const path = join(root, file);
    const original = readFileSync(path);
    const changed = Buffer.from(original);
    const at = Math.floor(changed.length / 2);
    changed[at] = (changed[at] as number) ^ 0x01;
    writeFileSync(path, changed);
    try {
      let refusal: unknown;
      try {
        verify(root);
      } catch (error) {
        refusal = error;
      }
      expect(refusal, `${file} changed by one byte`).toBeInstanceOf(UmbraError);
      const [ledger, ...rest] = file.split("/");
      expect((refusal as UmbraError).code, file).toBe("package-hash-mismatch");
      expect((refusal as UmbraError).details, file).toMatchObject({ ledger, file: rest.join("/") });
    } finally {
      writeFileSync(path, original);
    }
  }
  verify(root);
}
