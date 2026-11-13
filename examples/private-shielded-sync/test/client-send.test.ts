/**
 * The transfer's offline part (spec FR-120–124, FR-128, story 5) on the synthetic chain, from data the client obtained
 * by `sync` against the module in UmbraDB's real process (PostgreSQL 18; snapshot at 4, tail to 7):
 *
 * - every unspent coin's path gives the tail's root, which is the core's stored `zswap_root` (FR-121);
 * - a spend built from the path through a one-use `ZswapLocalState` is accepted by the chain's `ZswapChainState`
 *   (whose past roots are the chain's), for a coin whose lower path came from PIR, one whose lower path is computed from
 *   the tail's commitments, and one found in the tail; a wrong sibling is refused (as in transfer spike E2);
 * - the collapsed-update bytes equal the ledger's own `MerkleTreeCollapsedUpdate.serialize()` (FR-123);
 * - the payment is found by the recipient, the change by the sender; a pending transfer stays until a sync sees it.
 */

import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { RAW } from "../../../test/ledger/adapter-fixtures.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../../../test/runner/process-backends.js";
import { bech32mDecode, bech32mEncode, formatShieldedAddress, parseShieldedAddress } from "../client/address.ts";
import { BlobCache } from "../client/cache.ts";
import { PssHttp } from "../client/http.ts";
import { walletKeys, type WalletKeys } from "../client/keys.ts";
import type { Ledger } from "../client/ledger.ts";
import { chooseCoin, coinPath, planTransfer } from "../client/send.ts";
import { type CoinRecord, unspentCoins, type WalletState } from "../client/state.ts";
import { sync, type SyncResult } from "../client/sync.ts";
import {
  bigIntToLe32,
  leToBigInt,
  parseCollapsedUpdate,
  serializeCollapsedUpdate,
  spendUpdatesFromPath,
  stepSizes,
  treeLevels,
} from "../client/tree.ts";
import { compileKernel, Kernel, ScanPool } from "../kernel/index.ts";
import { inlineMultiplier } from "../pir/index.ts";
import { toHex } from "../shared/index.ts";
import { rootFromStored } from "../server/tree.ts";
import { ADMIN_SECRET, builtAt, type ModuleRun, startModule, stoppedAt } from "./client-harness.ts";
import { type ScenarioChain, scenarioChain } from "./server-chain.ts";

const LONG = 600_000;
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres")!;
const ledger = RAW.v9 as unknown as Ledger;

let chain: ScenarioChain;
let db: ProcessDatabase;
let r: ModuleRun;
let kernel: Kernel;
let scanPool: ScanPool;
let dir: string;
let A: WalletKeys;
let B: WalletKeys;
let syncA: SyncResult;
let syncB: SyncResult;
let storedRoot7: string;
const hash = (a: Uint8Array, b: Uint8Array): Uint8Array => kernel.hash2(a, b)!;

async function syncOf(keys: WalletKeys, previous: WalletState | null = null): Promise<SyncResult> {
  return sync({
    ledger,
    keys,
    http: new PssHttp(r.origin),
    cache: new BlobCache(mkdtempSync(join(dir, "cache-"))),
    kernel,
    scanPool,
    multiplier: inlineMultiplier,
    previous,
  });
}

const recipientOf = (k: WalletKeys) => ({ coinPublicKey: toHex(k.coinPublicKey), encryptionPublicKey: toHex(k.encryptionPublicKey) });

/** Does the chain accept the offer? `null` when it does, else the ledger's reason. */
function chainRefuses(offer: unknown): string | null {
  try {
    chain.zswap.tryApply(offer as never);
    return null;
  } catch (e) {
    return String(e).split("\n")[0]!;
  }
}

beforeAll(async () => {
  chain = await scenarioChain();
  kernel = new Kernel(compileKernel());
  scanPool = new ScanPool({ threads: 2 });
  A = walletKeys(chain.wallets.A.keys as never, kernel);
  B = walletKeys(chain.wallets.B.keys as never, kernel);
  dir = mkdtempSync(join(tmpdir(), "pss-send-"));
  await backend.start();
  db = await backend.database();
  r = await startModule(chain, db, {
    stop: 7,
    config: { dataDir: join(dir, "server"), pathSplit: 2, queriesPerCall: 8, snapshotEvery: 4, adminSecret: ADMIN_SECRET, threads: 1 },
  });
  await stoppedAt(r, 7);
  await builtAt(r, 4);
  syncA = await syncOf(A);
  syncB = await syncOf(B);
  const [row] = await db.query("SELECT zswap_root FROM core_ledger_state.states WHERE height = 7");
  storedRoot7 = toHex(rootFromStored(new Uint8Array(row!.zswap_root as Buffer)));
}, LONG);

afterAll(async () => {
  await r?.close();
  await scanPool?.close();
  await backend.stop();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
}, LONG);

describe("the path (FR-121)", () => {
  it("every unspent coin of both wallets: its 32 siblings give the tail's root, which is the core's zswap_root at 7", () => {
    expect(syncA.state.tail.root).toBe(storedRoot7);
    const coins = [...unspentCoins(syncA.state), ...unspentCoins(syncB.state)];
    expect(coins.length).toBe(11);
    for (const coin of [...unspentCoins(syncA.state)]) {
      const { siblings, root } = coinPath(syncA.view, coin, kernel);
      expect(siblings).toHaveLength(32);
      expect(toHex(root), `position ${coin.position}`).toBe(storedRoot7);
    }
    for (const coin of unspentCoins(syncB.state)) expect(toHex(coinPath(syncB.view, coin, kernel).root)).toBe(storedRoot7);
    // All three sources of a lower path occur.
    const kinds = new Set(coins.map((c) => (c.lowerPath !== null ? "pir" : c.position < syncA.state.snapshot.firstFree ? "tail-commitments" : "tail-output")));
    expect([...kinds].sort()).toEqual(["pir", "tail-commitments", "tail-output"]);
  });

  it("a wrong lower-path hash, or a coin of another position, does not give the root", () => {
    const coin = unspentCoins(syncA.state).find((c) => c.lowerPath !== null)!;
    const wrong: CoinRecord = { ...coin, lowerPath: [toHex(bigIntToLe32(leToBigInt(Buffer.from(coin.lowerPath![0]!, "hex")) ^ 1n)), coin.lowerPath![1]!] };
    expect(() => coinPath(syncA.view, wrong, kernel)).toThrow(/does not give the tail's root/);
    const other = unspentCoins(syncA.state).find((c) => c.lowerPath === null && c.position >= syncA.state.snapshot.firstFree)!;
    expect(() => coinPath(syncA.view, { ...other, position: other.position + 1 }, kernel)).toThrow();
  });
});

describe("the spend (FR-122, FR-124) against the chain's own Zswap state", () => {
  it("a coin with a PIR lower path, one in the snapshot's partial block, one found in the tail: each spend is accepted by the chain; the payment is the recipient's, the change the sender's", { timeout: LONG }, () => {
    const coins = unspentCoins(syncA.state);
    const picks = [
      coins.find((c) => c.lowerPath !== null)!,
      coins.find((c) => c.lowerPath === null && c.position < syncA.state.snapshot.firstFree),
      coins.find((c) => c.position >= syncA.state.snapshot.firstFree)!,
    ].filter((c): c is CoinRecord => c !== undefined);
    expect(picks.length).toBeGreaterThanOrEqual(2);
    for (const coin of picks) {
      const { siblings, root } = coinPath(syncA.view, coin, kernel);
      const amount = BigInt(coin.value) - 1n;
      const plan = planTransfer({ ledger, keys: A, network: chain.scenario.networkId, coin, siblings, root, recipient: recipientOf(B), amount });
      expect(plan.nullifier).toBe(coin.nullifier);
      expect(chainRefuses(plan.offer), `position ${coin.position}`).toBeNull();
      // The recipient's and the sender's own local states (which applied the whole chain) find their outputs.
      const toB = chain.wallets.B.local.applyWithChanges(chain.wallets.B.keys, plan.offer as never);
      expect(toB.changes.flatMap((c) => c.receivedCoins).map((c) => [c.value, c.type, c.nonce])).toEqual([[amount, coin.tokenType, plan.payment.nonce]]);
      const toA = chain.wallets.A.local.applyWithChanges(chain.wallets.A.keys, plan.offer as never);
      expect(toA.changes.flatMap((c) => c.receivedCoins).map((c) => c.value)).toEqual([1n]);
      expect(toA.changes.flatMap((c) => c.spentCoins).map((c) => Number(c.mt_index))).toEqual([coin.position]);
      expect(plan.change).toMatchObject({ value: "1", tokenType: coin.tokenType });
      // The unproven transaction reads back.
      const tx = RAW.v9.Transaction.deserialize("signature", "pre-proof", "pre-binding", plan.unproven);
      expect(tx.guaranteedOffer?.inputs.map((i) => i.nullifier)).toEqual([coin.nullifier]);
    }
  });

  it("negative control (spike E2): a spend built on a path with one wrong sibling, against the root that path gives, is refused by the chain", () => {
    const coin = unspentCoins(syncA.state).find((c) => c.lowerPath !== null)!;
    const { siblings } = coinPath(syncA.view, coin, kernel);
    const bad = siblings.slice();
    bad[5] = hash(bad[5]!, bigIntToLe32(1n));
    let node = kernel.leaf(Buffer.from(coin.commitment, "hex"));
    bad.forEach((s, h) => (node = Math.floor(coin.position / 2 ** h) % 2 === 0 ? hash(node, s) : hash(s, node)));
    const plan = planTransfer({ ledger, keys: A, network: chain.scenario.networkId, coin, siblings: bad, root: node, recipient: recipientOf(B), amount: 1n });
    expect(chainRefuses(plan.offer)).toMatch(/root/i);
    // And the one-use state refuses a root its updates do not give.
    expect(() => planTransfer({ ledger, keys: A, network: chain.scenario.networkId, coin, siblings: bad, root: Buffer.from(storedRoot7, "hex"), recipient: recipientOf(B), amount: 1n })).toThrow(/root/);
  });

  it("FR-120: one coin per transfer — the whole value makes no change output; more than the coin is refused; the smallest coin that holds the amount is chosen", () => {
    const coins = unspentCoins(syncA.state);
    const coin = coins.find((c) => c.lowerPath !== null)!;
    const { siblings, root } = coinPath(syncA.view, coin, kernel);
    const whole = planTransfer({ ledger, keys: A, network: chain.scenario.networkId, coin, siblings, root, recipient: recipientOf(B), amount: BigInt(coin.value) });
    expect(whole.change).toBeNull();
    expect(chainRefuses(whole.offer)).toBeNull();
    expect(() => planTransfer({ ledger, keys: A, network: chain.scenario.networkId, coin, siblings, root, recipient: recipientOf(B), amount: BigInt(coin.value) + 1n })).toThrow(/exceeds/);
    const token = coin.tokenType;
    expect(chooseCoin(coins, token, 55n).value).toBe("60");
    expect(chooseCoin(coins, token, 8n).value).toBe("8");
    expect(() => chooseCoin(coins, token, 1000n)).toThrow(/one coin per transfer/);
    expect(chooseCoin(coins, token, 1n, coin.position).position).toBe(coin.position);
  });
});

describe("FR-123: the collapsed-update bytes are the ledger's own", () => {
  it("for every range of the chain's 15 outputs (and ranges ending far past them), the client's bytes from hashes it computes equal MerkleTreeCollapsedUpdate.serialize()", async () => {
    const rows = await db.query("SELECT commitment FROM core_ledger_state.events WHERE kind = 'zswap-output' ORDER BY tree_index");
    const leaves = rows.map((row) => kernel.leaf(new Uint8Array(row.commitment as Buffer)));
    const levels = treeLevels(leaves, 32, hash);
    const node = (h: number, j: bigint): bigint => {
      const v = levels[h]![Number(j)];
      return v === undefined ? 0n : leToBigInt(v);
    };
    let compared = 0;
    let refused = 0;
    const ends = (start: number) => [...Array.from({ length: 15 - start }, (_, i) => BigInt(start + i)), 15n, 63n, 2n ** 20n - 1n, 2n ** 32n - 1n];
    for (let start = 0; start < 15; start++) {
      for (const end of ends(start)) {
        let expected: Uint8Array;
        try {
          expected = new RAW.v9.MerkleTreeCollapsedUpdate(chain.zswap, BigInt(start), end).serialize();
        } catch {
          refused++; // the ledger will not build an update inside a larger empty subtree (spike E1)
          continue;
        }
        const hashes: bigint[] = [];
        let at = BigInt(start);
        for (const step of stepSizes(BigInt(start), end + 1n)) {
          hashes.push(node(step, at >> BigInt(step)));
          at += 1n << BigInt(step);
        }
        const ours = serializeCollapsedUpdate({ start: BigInt(start), end, hashes });
        expect(toHex(ours), `[${start}, ${end}]`).toBe(toHex(expected));
        expect(parseCollapsedUpdate(ours)).toEqual({ start: BigInt(start), end, hashes });
        compared++;
      }
    }
    expect(compared).toBeGreaterThan(100);
    expect(refused).toBeLessThan(compared);
  });

  it("the one-use state's updates: one left update, single-hash right updates; the ledger's local state reaches the path's root", () => {
    const coin = unspentCoins(syncA.state)[0]!;
    const { siblings, root } = coinPath(syncA.view, coin, kernel);
    const { left, right } = spendUpdatesFromPath(coin.position, siblings);
    if (coin.position > 0) expect(left!.end).toBe(BigInt(coin.position - 1));
    for (const u of right) expect(u.hashes).toHaveLength(1);
    let local = new RAW.v9.ZswapLocalState();
    if (left) local = local.applyCollapsedUpdate(RAW.v9.MerkleTreeCollapsedUpdate.deserialize(serializeCollapsedUpdate(left)));
    local = local.insertCoin(A.zswap as never, { type: coin.tokenType, nonce: coin.nonce, value: BigInt(coin.value) });
    for (const u of right) local = local.applyCollapsedUpdate(RAW.v9.MerkleTreeCollapsedUpdate.deserialize(serializeCollapsedUpdate(u)));
    expect(local.merkleTreeRoot).toBe(leToBigInt(root));
  });
});

describe("FR-128: a transfer's pending record", () => {
  it("stays (its coin out of the balance) until a sync sees its spend and its change; then it is dropped", { timeout: LONG }, async () => {
    const spentOnChain = syncA.state.coins.find((c) => c.spent !== null)!;
    const unspent = unspentCoins(syncA.state);
    const changeOnChain = unspent[0]!;
    const waiting = unspent[1]!;
    const pending = (spent: CoinRecord, change: string) => ({
      txHash: "00".repeat(32),
      block: null,
      spent: { position: spent.position, nullifier: spent.nullifier },
      change: { commitment: change, value: "1", tokenType: spent.tokenType, nonce: "00".repeat(32) },
      payment: { commitment: "11".repeat(32), value: "1", tokenType: spent.tokenType },
      at: new Date(0).toISOString(),
    });
    const previous: WalletState = { ...syncA.state, pending: [pending(spentOnChain, changeOnChain.commitment), pending(waiting, "22".repeat(32))] };
    const again = await syncOf(A, previous);
    expect(again.state.pending.map((p) => p.spent.position)).toEqual([waiting.position]);
    expect(unspentCoins(again.state).map((c) => c.position)).not.toContain(waiting.position);
    expect(unspentCoins(again.state)).toHaveLength(unspent.length - 1);
  });
});

describe("FR-120: shielded addresses (bech32m, mn_shield-addr_<network>)", () => {
  it("round-trip with the wallet's keys; another network, a changed character or a wrong payload size is refused", () => {
    const address = formatShieldedAddress(recipientOf(B), "preprod");
    expect(address.startsWith("mn_shield-addr_preprod1")).toBe(true);
    expect(parseShieldedAddress(address, "preprod")).toEqual(recipientOf(B));
    expect(() => parseShieldedAddress(address, "preview")).toThrow(/expected/);
    const flipped = `${address.slice(0, -1)}${address.endsWith("q") ? "p" : "q"}`;
    expect(() => parseShieldedAddress(flipped, "preprod")).toThrow(/checksum/);
    expect(() => parseShieldedAddress(bech32mEncode("mn_shield-addr_preprod", new Uint8Array(32)), "preprod")).toThrow(/64 bytes/);
    expect(formatShieldedAddress(recipientOf(B), "mainnet").startsWith("mn_shield-addr1")).toBe(true);
    expect(bech32mDecode(address).data).toHaveLength(64);
  });

  const installed = existsSync(new URL("../client/node_modules/@midnightntwrk/wallet-sdk/package.json", import.meta.url));
  it.skipIf(!installed)("with the client's install: the wallet SDK's ShieldedAddress codec gives the same string, and @midnightntwrk/ledger-v9 1.0.1 the same keys and nullifier as the vendored build", async () => {
    const sdkAddress = (await import(new URL("../client/node_modules/@midnightntwrk/wallet-sdk-address-format/dist/index.js", import.meta.url).href)) as Record<string, any>;
    const npm = (await import(new URL("../client/node_modules/@midnightntwrk/ledger-v9/midnight_ledger_wasm_v9_fs.js", import.meta.url).href)) as unknown as Ledger;
    const seed = new Uint8Array(32).fill(0xb2);
    const keys = npm.ZswapSecretKeys.fromSeed(seed);
    expect([keys.coinPublicKey, keys.encryptionPublicKey]).toEqual([chain.wallets.B.keys.coinPublicKey, chain.wallets.B.keys.encryptionPublicKey]);
    const coin = unspentCoins(syncB.state)[0]!;
    expect(npm.coinNullifier({ type: coin.tokenType, nonce: coin.nonce, value: BigInt(coin.value) }, keys.coinSecretKey)).toBe(coin.nullifier);
    const encoded = sdkAddress.MidnightBech32m.encode("preprod", new sdkAddress.ShieldedAddress(
      sdkAddress.ShieldedCoinPublicKey.fromHexString(keys.coinPublicKey),
      sdkAddress.ShieldedEncryptionPublicKey.fromHexString(keys.encryptionPublicKey),
    )).asString();
    expect(encoded).toBe(formatShieldedAddress(recipientOf(B), "preprod"));
  });
});
