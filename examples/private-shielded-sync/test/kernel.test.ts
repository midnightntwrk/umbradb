/**
 * The scan kernel against the ledger's own results (spec FR-100–104, FR-091).
 *
 * Fixtures (`fixtures/`): `entries.bin`, `pads.bin`, `mine.bin`, `scalar.bin`, `sample.txt`, made with the ledger's
 * `encrypt` in the experiments; `coins.bin`, `coin-secret.bin`, `coin-public-key.bin`, made by the kernel crate's
 * `coin-vectors` binary with the ledger's `encrypt` (`kernel/build.sh --vectors`).
 */

import { createHash, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import fc from "fast-check";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  CIPHERTEXT_BYTES,
  COIN_BYTES,
  committedKernelDigest,
  compileKernel,
  coinFromBytes,
  ENTRY_BYTES,
  encryptionSecretKeyScalar,
  decodeScaleBigInt,
  Kernel,
  KERNEL_PATH,
  ScanPool,
} from "../kernel/index.ts";
import { add, compress, decompress, fromLe, mul, P, poseidon2, toLe } from "./reference.ts";

const fixture = (name: string): Uint8Array => new Uint8Array(readFileSync(new URL(`./fixtures/${name}`, import.meta.url)));
const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");
const unhex = (h: string): Uint8Array => new Uint8Array(Buffer.from(h, "hex"));

const entries = fixture("entries.bin");
const pads = fixture("pads.bin");
const mine = fixture("mine.bin");
const scalar = fixture("scalar.bin");
const COUNT = entries.length / ENTRY_BYTES;

let kernel: Kernel;
let pool: ScanPool;

beforeAll(() => {
  const module = compileKernel();
  kernel = new Kernel(module);
  pool = new ScanPool({ module, threads: 6 });
});

afterAll(async () => {
  await pool.close();
});

describe("kernel file (FR-101)", () => {
  it("matches its committed SHA-256", () => {
    const digest = createHash("sha256").update(readFileSync(KERNEL_PATH)).digest("hex");
    expect(digest).toBe(committedKernelDigest());
  });

  it("is refused when its digest is not the expected one", () => {
    expect(() => compileKernel({ expectedDigest: "00".repeat(32) })).toThrow(/does not match/);
  });
});

describe("test vectors (FR-102)", () => {
  it("are complete", () => {
    expect(COUNT).toBe(16_384);
    expect(pads.length).toBe(COUNT * 32);
    expect(mine.length).toBe(COUNT);
  });

  it("scan finds exactly the entries made for the test key, across worker threads (FR-104)", async () => {
    const expected = [...mine].flatMap((m, i) => (m ? [i] : []));
    expect(expected.length).toBeGreaterThan(0);
    expect(await pool.scan(entries, scalar)).toEqual(expected);
  });

  it("every entry's value equals the ledger's Poseidon(k, 0)", async () => {
    const values = await pool.scanValues(entries, scalar);
    expect(Buffer.from(values).equals(Buffer.from(pads))).toBe(true);
  });

  it("scan gives the same positions with one thread, many threads and small chunks", async () => {
    const part = entries.subarray(0, 600 * ENTRY_BYTES);
    const direct = kernel.scan(part, scalar);
    expect(await pool.scan(part, scalar, { chunk: 37 })).toEqual(direct);
    const one = new ScanPool({ threads: 1 });
    try {
      expect(await one.scan(part, scalar)).toEqual(direct);
    } finally {
      await one.close();
    }
  });

  const samples = readFileSync(new URL("./fixtures/sample.txt", import.meta.url), "utf8")
    .trim()
    .split(/\n(?=entry )/)
    .map((block) => Object.fromEntries(block.split("\n").map((l) => l.split(" ") as [string, string])));

  it.each(samples.map((s, i) => [i, s] as const))("worked sample %i: point, shared point, key, pads", (_, s) => {
    const entry = unhex(s.entry!);
    const point = entry.subarray(0, 32);
    // The reference decompresses the point and multiplies it as the ledger does.
    const pt = decompress(point)!;
    expect(hex(toLe(pt[0]))).toBe(s.px);
    expect(hex(toLe(pt[1]))).toBe(s.py);
    const shared = mul(pt, fromLe(scalar));
    expect(hex(toLe(shared[0]))).toBe(s.sx);
    expect(hex(toLe(shared[1]))).toBe(s.sy);
    // The kernel's Poseidon reproduces the key and pad 0 from the shared point.
    const key = kernel.hash2(unhex(s.sx!), unhex(s.sy!))!;
    expect(hex(key)).toBe(s.key);
    expect(hex(kernel.hash2(key, new Uint8Array(32))!)).toBe(s.pad);
    // `pads` derives all six from the point the ledger's way; pad i = Poseidon(key, i).
    const six = kernel.pads(point, scalar)!;
    expect(hex(six.subarray(0, 32))).toBe(s.pad);
    for (let i = 0; i < 6; i++) {
      expect(hex(six.subarray(32 * i, 32 * i + 32))).toBe(hex(kernel.hash2(key, toLe(BigInt(i)))!));
    }
    // The samples are the first four entries, none made for the test key: their 4 bytes differ from pad 0's.
    expect(mine[samples.indexOf(s)]).toBe(0);
    expect(hex(entry.subarray(32, 36))).not.toBe(s.pad!.slice(0, 8));
  });
});

describe("hash2", () => {
  it("equals the BigInt reference with midnight-circuits' constants", () => {
    fc.assert(
      fc.property(fc.bigInt({ min: 0n, max: P - 1n }), fc.bigInt({ min: 0n, max: P - 1n }), (a, b) => {
        expect(hex(kernel.hash2(toLe(a), toLe(b))!)).toBe(hex(toLe(poseidon2(a, b))));
      }),
      { numRuns: 40 },
    );
  });

  it("refuses a non-canonical field element", () => {
    expect(kernel.hash2(toLe(P), new Uint8Array(32))).toBeNull();
    expect(kernel.hash2(new Uint8Array(32), new Uint8Array(32).fill(0xff))).toBeNull();
  });
});

describe("scan rejects entries the ledger would reject (FR-103)", () => {
  // An entry made for the test key, and its point.
  const index = mine.indexOf(1);
  const entry = entries.slice(index * ENTRY_BYTES, (index + 1) * ENTRY_BYTES);
  const point = decompress(entry.subarray(0, 32))!;

  it("a point outside the prime-order subgroup is not a match even when its 4 bytes match", () => {
    // P + (0, −1): on the curve, not in the subgroup.
    const off = add(point, [0n, P - 1n]);
    const bad = new Uint8Array(ENTRY_BYTES);
    bad.set(compress(off));
    // Make the 4 bytes match what the scan computes for this point, so only the subgroup check can reject it.
    bad.set(kernel.scanValues(bad, scalar).subarray(0, 4), 32);
    expect(kernel.scan(bad, scalar)).toEqual([]);
    expect(kernel.pads(bad.subarray(0, 32), scalar)).toBeNull();
    // The same construction on the subgroup point itself matches.
    const good = new Uint8Array(ENTRY_BYTES);
    good.set(compress(point));
    good.set(kernel.scanValues(good, scalar).subarray(0, 4), 32);
    expect(kernel.scan(good, scalar)).toEqual([0]);
  });

  it("an all-zero entry (no ciphertext) never matches and has value zero", () => {
    const zero = new Uint8Array(ENTRY_BYTES);
    expect(kernel.scan(zero, scalar)).toEqual([]);
    expect(kernel.scanValues(zero, scalar)).toEqual(new Uint8Array(32));
  });

  it("bytes that are not a curve point never match", () => {
    let bytes: Uint8Array;
    do bytes = new Uint8Array(randomBytes(32));
    while (decompress(bytes) !== null);
    const e = new Uint8Array(ENTRY_BYTES);
    e.set(bytes);
    expect(kernel.scan(e, scalar)).toEqual([]);
    expect(kernel.scanValues(e, scalar)).toEqual(new Uint8Array(32));
  });

  it("refuses a secret that is not a canonical scalar", () => {
    expect(() => kernel.scan(entry, new Uint8Array(32).fill(0xff))).toThrow(/canonical/);
  });
});

describe("decrypt_coin and commitment", () => {
  const records = fixture("coins.bin");
  const secret = fixture("coin-secret.bin");
  const cpk = fixture("coin-public-key.bin");
  const REC = CIPHERTEXT_BYTES + 1 + COIN_BYTES + 32;
  const coins = Array.from({ length: records.length / REC }, (_, i) => {
    const r = records.subarray(i * REC, (i + 1) * REC);
    return {
      ciphertext: r.subarray(0, CIPHERTEXT_BYTES),
      mine: r[CIPHERTEXT_BYTES] === 1,
      coin: coinFromBytes(r.subarray(CIPHERTEXT_BYTES + 1, CIPHERTEXT_BYTES + 1 + COIN_BYTES)),
      commitment: r.subarray(CIPHERTEXT_BYTES + 1 + COIN_BYTES),
    };
  });

  it("the ledger's decryption recovers every coin made for the key, and nothing else", () => {
    expect(coins.length).toBe(48);
    for (const c of coins) {
      const got = kernel.decryptCoin(c.ciphertext, secret);
      if (c.mine) {
        expect(got).not.toBeNull();
        expect(got!.value).toBe(c.coin.value);
        expect(hex(got!.tokenType)).toBe(hex(c.coin.tokenType));
        expect(hex(got!.nonce)).toBe(hex(c.coin.nonce));
      } else {
        expect(got).toBeNull();
      }
    }
  });

  it("decryption fails when element 0 is changed", () => {
    const c = coins.find((x) => x.mine)!;
    const bad = c.ciphertext.slice();
    bad[32]! ^= 1;
    expect(kernel.decryptCoin(bad, secret)).toBeNull();
  });

  it("pads decrypt elements 1–5 consistently with decrypt_coin (element 0 minus pad 0 is zero)", () => {
    for (const c of coins.filter((x) => x.mine).slice(0, 4)) {
      const six = kernel.pads(c.ciphertext.subarray(0, 32), secret)!;
      for (let i = 0; i < 6; i++) {
        const plain = (fromLe(c.ciphertext.subarray(32 + 32 * i, 64 + 32 * i)) - fromLe(six.subarray(32 * i, 32 * i + 32)) + P) % P;
        if (i === 0) expect(plain).toBe(0n);
      }
      // Element 5 is the value (the last field of the coin's field representation).
      const v = (fromLe(c.ciphertext.subarray(192, 224)) - fromLe(six.subarray(160, 192)) + P) % P;
      expect(v).toBe(c.coin.value);
    }
  });

  it("commitment reproduces the vectors' commitments (made with the ledger's Info::commitment)", () => {
    for (const c of coins) expect(hex(kernel.commitment(c.coin, cpk))).toBe(hex(c.commitment));
  });
});

// The repository's vendored ledger package (Node build), for cross-checks only.
const ledger = await import("../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js");

describe("against the ledger's TypeScript package", () => {
  it("the encryption secret key's serialization converts to the kernel's scalar (FR-091)", () => {
    for (let i = 0; i < 12; i++) {
      const keys = ledger.ZswapSecretKeys.fromSeed(new Uint8Array(randomBytes(32)));
      const esk = keys.encryptionSecretKey;
      const s = encryptionSecretKeyScalar(esk.yesIKnowTheSecurityImplicationsOfThis_serialize());
      expect(hex(kernel.publicKey(s))).toBe(keys.encryptionPublicKey);
      expect(hex(encryptionSecretKeyScalar(esk.yesIKnowTheSecurityImplicationsOfThis_taggedSerialize()))).toBe(hex(s));
    }
  });

  it("commitment equals coinCommitment", () => {
    fc.assert(
      fc.property(
        fc.uint8Array({ minLength: 32, maxLength: 32 }),
        fc.uint8Array({ minLength: 32, maxLength: 32 }),
        fc.bigInt({ min: 0n, max: (1n << 128n) - 1n }),
        fc.uint8Array({ minLength: 32, maxLength: 32 }),
        (tokenType, nonce, value, cpk) => {
          const expected = ledger.coinCommitment({ type: hex(tokenType), nonce: hex(nonce), value }, hex(cpk));
          expect(hex(kernel.commitment({ tokenType, nonce, value }, cpk))).toBe(expected);
        },
      ),
      { numRuns: 50 },
    );
  });

  it("leaf equals degradeToTransient", () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 32, maxLength: 32 }), (c) => {
        const [expected] = ledger.degradeToTransient([c]) as Uint8Array[];
        const padded = new Uint8Array(32);
        padded.set(expected!);
        expect(hex(kernel.leaf(c))).toBe(hex(padded));
        // The definition: the commitment's first 31 bytes as a little-endian field element.
        expect(hex(kernel.leaf(c))).toBe(hex(Uint8Array.of(...c.subarray(0, 31), 0)));
      }),
      { numRuns: 50 },
    );
  });
});

describe("SCALE integers", () => {
  it("decode every width the ledger writes and refuse non-canonical forms", () => {
    expect(decodeScaleBigInt(Uint8Array.of(0x04 << 2)).value).toEqual(Uint8Array.of(4));
    expect(decodeScaleBigInt(Uint8Array.of((63 << 2) | 1, 1)).value).toEqual(Uint8Array.of(0x7f, 0));
    expect(() => decodeScaleBigInt(Uint8Array.of(1, 0))).toThrow(/non-canonical/);
    // Four-byte form: 6 bits from the first byte, then 8 from each next (low 2 bits first).
    expect(decodeScaleBigInt(Uint8Array.of(2, 0, 1, 0)).value).toEqual(Uint8Array.of(0, 0x40, 0, 0));
    expect(decodeScaleBigInt(Uint8Array.of((5 << 2) | 2, 3, 0, 1)).value).toEqual(Uint8Array.of(0xc5, 0, 0x40, 0));
    expect(() => decodeScaleBigInt(Uint8Array.of(2, 5, 0, 0))).toThrow(/non-canonical/);
    expect(decodeScaleBigInt(Uint8Array.of(3, 1, 2, 3, 64)).value).toEqual(Uint8Array.of(1, 2, 3, 64));
    expect(() => decodeScaleBigInt(Uint8Array.of(3, 1, 2, 3, 63))).toThrow(/non-canonical/);
    expect(() => decodeScaleBigInt(Uint8Array.of(7, 1, 2, 3, 4, 0))).toThrow(/non-canonical/);
    expect(() => decodeScaleBigInt(Uint8Array.of(0x73, 1, 2))).toThrow(/truncated/);
  });

  it("refuse trailing bytes and out-of-range keys", () => {
    expect(() => encryptionSecretKeyScalar(Uint8Array.of(4, 0))).toThrow(/trailing/);
    expect(() => encryptionSecretKeyScalar(Uint8Array.of(0x73, ...new Uint8Array(32).fill(0xff)))).toThrow(/range/);
    expect(encryptionSecretKeyScalar(Uint8Array.of(8))).toEqual(Uint8Array.of(2, ...new Uint8Array(31)));
  });
});
