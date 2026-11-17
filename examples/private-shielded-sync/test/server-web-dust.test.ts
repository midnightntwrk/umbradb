/**
 * The step page's Dust steps (`web/dust-steps.ts`, spec 00062), without a browser, in both PIR schemes: run against the
 * module's Dust routes over the world of `./server-dust-world.ts` (a wallet's three chains among other wallets' coins,
 * a check table built with the module's own builder), as the page's worker runs them.
 *
 * - Step 9 downloads every chunk the first time and none the second (the page's cache, by SHA-256); step 11 takes the
 *   check table's public artifact from that cache the second time.
 * - Step 10 walks without a check: chain A follows another wallet's spend placed before its own and loses itself.
 * - Step 11 checks the chains' ends together: A's false match dropped and A's real end checked, B's end beyond the
 *   table not checkable, C needs nothing; two padded calls.
 * - Step 12 (phase 9) reads the paying coin's path in one padded call to the path table, builds the Dust local state
 *   (both roots the snapshot's) and spends the coin in memory; nothing else is sent.
 * - A generated wallet (no first coin): nothing to walk, one padded check call, no error.
 * - Every answer is plain JSON (the page shows it with `JSON.stringify`), and the page's view of the chains and bytes
 *   (`web/dust-view.ts`) renders it.
 *
 * The world's first coins are made with the ledger's functions, not taken from events, so the coins answer is decoded
 * by a stand-in that gives them for the world's key; a generated wallet's empty answer goes through the ledger's own
 * decoding. IPIR+SP needs its native add-on (`ipir/build.sh native`). Named `server-…` because it builds the check table
 * with the module's own builder, so it is type-checked with the server (`server/tsconfig.json`).
 */

import { afterAll, describe, expect, it } from "vitest";
import * as ledger from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { PssHttp } from "../client/http.ts";
import { compileIpirWasm } from "../ipir/wallet-node.ts";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import { inlineMultiplier } from "../pir/index.ts";
import { ROUTES } from "../shared/index.ts";
import { DustSteps } from "../web/dust-steps.ts";
import { dustBytes, dustChainRows, dustSpendRows } from "../web/dust-view.ts";
import { DUST_SEED, dustWorld } from "./server-dust-world.ts";

const world = await dustWorld();
afterAll(() => world.dispose());
const { A, B, C, FALSE_AT, FILE_POSITIONS } = world;
const entry = (position: number): number => FILE_POSITIONS.indexOf(position);
const kernel = new Kernel(compileKernel());
type Json = Record<string, any>;

for (const scheme of ["simplepir", "ipir-sp"] as const) {
  const options = scheme === "simplepir" ? { multiplier: inlineMultiplier } : { ipirWasm: () => compileIpirWasm() };

  describe(`the page's Dust steps (${scheme})`, () => {
    it("a wallet with three chains: get the file, walk (A follows the false match), check (A's false match dropped and its end checked, B not checkable, C nothing to check, two padded calls); a second run takes every chunk and the public artifact from the page's cache", { timeout: 300_000 }, async () => {
      const routes = await world.serve(scheme);
      const http = new PssHttp("http://dust.test", { fetch: routes.fetch });
      const cache = new Map<string, Uint8Array>();
      const owners: bigint[] = [];
      const steps = new DustSteps({
        ledger: ledger as never,
        http,
        cache,
        scheme: options,
        kernel: () => kernel,
        network: async () => "undeployed",
        decodeCoins: (answer, owner) => {
          owners.push(owner);
          expect(answer.owner).toBe(owner.toString());
          return { starts: [A, B, C], updates: [] };
        },
      });
      steps.setSeed(DUST_SEED);

      const got = (await steps.getFile()) as Json;
      expect(owners).toEqual([world.owner]);
      expect(got).toMatchObject({ manifest: { entries: 42, chunks: 3, chunkEntries: 16, prefixBytes: 4 }, chunksFromCache: 0, chunksDownloaded: 3, keyEnds: world.owner.toString().slice(-8) });
      expect(got.firstCoins.map((f: Json) => f.position)).toEqual(["3", "5", "7"]);
      expect(got.bytes).toMatchObject({ requests: 6, chunks: got.chunkBytesDownloaded, check: { requests: 0 } });
      // The coins request names the key in its query string only: the request record holds the route.
      expect(http.records.map((r) => r.path)).toContain(ROUTES.dustCoins);
      expect(http.records.some((r) => r.path.includes(world.owner.toString()))).toBe(false);

      const walked = (await steps.walk()) as Json;
      expect(walked.chains.map((c: Json) => [c.spends, c.entries, c.status])).toEqual([
        [1, [entry(FALSE_AT)], "unchecked"],
        [2, [entry(25), entry(64)], "unchecked"],
        [0, [], "no-spend"],
      ]);
      expect(http.records).toHaveLength(6);

      const checked = (await steps.check()) as Json;
      expect(checked.check).toMatchObject({ scheme, commitments: 64, queriesPerCall: 4, publicArtifact: { cached: false } });
      expect(checked.chains.map((c: Json) => [c.spends, c.entries, c.status, c.droppedEntries, c.coin.position, c.coin.seq])).toEqual([
        [2, [entry(20), entry(30)], "checked", [entry(FALSE_AT)], "30", 2],
        [2, [entry(25), entry(64)], "not-checkable", [], "64", 2],
        [0, [], "no-spend", [], "7", 0],
      ]);
      expect(checked.chains[0].coin.commitment).toBe(`0x${ledger.dustCommitment(world.A2).toString(16).padStart(64, "0")}`);
      // Two batches: A's false end with B's (beyond the table, not read), then A's real end; one padded call each.
      expect(checked.batches).toEqual([
        { positions: [FALSE_AT, 64], outcomes: ["mismatch", "beyond"], readable: 1 },
        { positions: [30], outcomes: ["match"], readable: 1 },
      ]);
      expect([checked.calls, routes.queries()]).toEqual([2, 2]);
      const calls = http.records.filter((r) => r.path === ROUTES.dustCheckQuery);
      expect(new Set(calls.map((r) => r.bodyBytes)).size).toBe(1);
      // The whole sync, split as the command line splits it: step 9's requests and this check's.
      expect(checked.bytes).toMatchObject({
        chunks: got.bytes.chunks,
        coins: got.bytes.coins,
        check: { calls: 2, callsUp: calls.reduce((t, r) => t + r.bodyBytes, 0), callsDown: calls.reduce((t, r) => t + r.answerBytes, 0), publicArtifact: routes.built.manifest.public.size },
      });

      const again = (await steps.getFile()) as Json;
      expect(again).toMatchObject({ chunksFromCache: 3, chunksDownloaded: 0, chunkBytesDownloaded: 0, bytes: { chunks: 0 } });
      const recheck = (await steps.check()) as Json;
      expect(recheck.check.publicArtifact.cached).toBe(true);
      expect(recheck.bytes.check.publicArtifact).toBe(0);
      expect(recheck.chains.map((c: Json) => c.status)).toEqual(["checked", "not-checkable", "no-spend"]);
      // Step 12: the paying coin's path read in one padded call, the local state's roots the snapshot's, the spend in memory.
      const before = http.records.length;
      const spent = (await steps.spend()) as Json;
      const m = routes.built.manifest;
      expect([1, 3]).toContain(spent.chain);
      expect(spent.coin.position).toBe(spent.chain === 1 ? "30" : "7");
      expect(spent.snapshot).toMatchObject({ scheme, height: m.height, commitments: 64, pathSplit: 2, blockTime: new Date(m.blockTime * 1000).toISOString() });
      const pathCalls = http.records.slice(before).filter((r) => r.path === ROUTES.dustPathQuery);
      expect(pathCalls).toHaveLength(1);
      expect(routes.pathQueries()).toBe(1);
      expect(spent.path).toMatchObject({ lowerByPir: 2, upperFromBlockRoots: 30, calls: 1, bytesUp: pathCalls[0]!.bodyBytes, bytesDown: pathCalls[0]!.answerBytes, pathPublic: m.tree.pathPublic!.size, blockRoots: m.tree.blockRoots.size, generationRecords: m.generation.file.size });
      expect(spent.roots).toEqual({ commitment: { fromPath: m.tree.root, localState: m.tree.root, snapshot: m.tree.root }, generation: { localState: m.generation.root, snapshot: m.generation.root } });
      expect(spent.generationRecords).toBe(8);
      expect(BigInt(spent.spend.vFee)).toBeGreaterThanOrEqual(BigInt(spent.spend.fee));
      expect(BigInt(spent.spend.fee)).toBeGreaterThan(0n);
      expect(spent.spend).toMatchObject({ network: "undeployed", proven: false, sent: false });
      // Only the path call and the snapshot's public files went out; a second spend reads the path again, nothing else.
      expect(http.records.slice(before).map((r) => r.path.startsWith(ROUTES.dustCheckBlob) ? "blob" : r.path).sort()).toEqual(["blob", "blob", "blob", ROUTES.dustPathQuery].sort());
      const again2 = http.records.length;
      const spentAgain = (await steps.spend()) as Json;
      expect(http.records.slice(again2).map((r) => r.path)).toEqual([ROUTES.dustPathQuery]);
      expect(spentAgain.path).toMatchObject({ calls: 1, pathPublic: 0, blockRoots: 0, generationRecords: 0 });
      const spendView = dustSpendRows(spent).map(([k, v]) => `${k}: ${v}`).join("\n");
      expect(spendView).toContain("path read: 2 lower siblings by PIR in 1 call of 4 requests");
      expect(spendView).toContain("✓ from the path: the snapshot's");
      expect(spendView).not.toContain("✗");
      for (const answer of [got, walked, checked, again, recheck, spent]) expect(() => JSON.stringify(answer)).not.toThrow();
      // The page's view: one row per chain, as the command line words it.
      const rows = dustChainRows(checked.chains, true, checked.check.commitments);
      expect(rows.match(/<tr>/g)).toHaveLength(4);
      expect(rows).toContain("checked: the record at position 30 is the last coin's commitment");
      expect(rows).toContain("not checkable yet: the check table covers positions below 64");
      expect(rows).toContain("nothing to check: the first coin is public");
      expect(rows).toContain(`entries ${entry(FALSE_AT)}`);
      expect(rows).toContain("1,000,000,000 Stars of Night");
      expect(dustChainRows(walked.chains, false, null)).toContain("not checked yet (step 11)");
      expect(dustChainRows([], true, 64)).toContain("no Dust chain");
      expect(dustBytes(checked.bytes)).toMatch(/down in \d+ requests \(manifest .+, chunks .+, coins .+, parameters .+, check .+\); .+ up/);
      steps.dispose();
    });

    it("a generated wallet (no first coin in the era): nothing to walk, one padded check call still sent, no error", { timeout: 300_000 }, async () => {
      const routes = await world.serve(scheme);
      const http = new PssHttp("http://dust.test", { fetch: routes.fetch });
      const steps = new DustSteps({ ledger: ledger as never, http, cache: new Map(), scheme: options });
      steps.setSeed(crypto.getRandomValues(new Uint8Array(32)));
      const got = (await steps.getFile()) as Json;
      expect([got.firstCoins, got.updates]).toEqual([[], []]);
      expect(((await steps.walk()) as Json).chains).toEqual([]);
      const checked = (await steps.check()) as Json;
      expect(checked).toMatchObject({ chains: [], calls: 1, batches: [{ positions: [], outcomes: [], readable: 0 }], checkUnavailable: null });
      expect(routes.queries()).toBe(1);
      // No chain, nothing to pay with: step 12 says so and reads no path.
      const kernelled = new DustSteps({ ledger: ledger as never, http, cache: new Map(), scheme: options, kernel: () => kernel, network: async () => "undeployed" });
      kernelled.setSeed(crypto.getRandomValues(new Uint8Array(32)));
      await kernelled.getFile();
      await kernelled.check();
      await expect(kernelled.spend()).rejects.toThrow(/no Dust chain in the era/);
      expect(routes.pathQueries()).toBe(0);
      kernelled.dispose();
      steps.dispose();
    });
  });
}

describe("the page's Dust steps, refused", () => {
  it("without a mnemonic's Dust seed, and out of order", async () => {
    const routes = await world.serve("simplepir");
    const steps = new DustSteps({ ledger: ledger as never, http: new PssHttp("http://dust.test", { fetch: routes.fetch }), cache: new Map(), scheme: { multiplier: inlineMultiplier } });
    await expect(steps.walk()).rejects.toThrow(/get the Dust file first/);
    await expect(steps.spend()).rejects.toThrow(/get the Dust file first/);
    await expect(steps.getFile()).rejects.toThrow(/derive the keys from a mnemonic first/);
    steps.setSeed(DUST_SEED);
    steps.setSeed(null);
    await expect(steps.getFile()).rejects.toThrow(/derive the keys from a mnemonic first/);
  });
});
