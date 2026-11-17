/**
 * The private check of a wallet's Dust chains (spec 00062 story 3, FR-012, FR-023, SC-004), in both PIR schemes: a
 * Dust check table built with the module's own builder (`../server/dust-check.ts`) and answered by the scheme's server
 * table, called through the wallet's own code (`../client/dust-check.ts`, `../client/dust.ts`) over a stand-in for
 * HTTP that runs the module's wire format. The chains are derived with the vendored ledger's own functions; the file
 * holds another wallet's spend whose prefix is the first coin's, placed before the real spend.
 *
 * Phase 9, in both schemes too: the coin's Merkle path read privately (one padded call to the path table, the upper
 * siblings from the block roots) gives the snapshot's root; the local state built from it and the generation records
 * has the snapshot's two roots, and spends the coin; the fee of a transaction paid with it is covered by the spend.
 *
 * The world (chains, file, snapshot, routes) is `./server-dust-world.ts`. IPIR+SP needs its native add-on
 * (`ipir/build.sh native`).
 */

import { afterAll, describe, expect, it } from "vitest";
import * as ledger from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { DustChecker } from "../client/dust-check.ts";
import { fieldBytes, walkDustChains } from "../client/dust.ts";
import { chooseDustChain, dustLocalState, dustSpendable, payFeeWithDust } from "../client/dust-spend.ts";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import { PssHttp } from "../client/http.ts";
import { compileIpirWasm } from "../ipir/wallet-node.ts";
import { inlineMultiplier, type SchemeName } from "../pir/index.ts";
import { fromHex, ROUTES } from "../shared/index.ts";
import { dustWorld, SNAPSHOT_TIME } from "./server-dust-world.ts";

const world = await dustWorld();
afterAll(() => world.dispose());
const { A, B, C, A1, A2, B2, FALSE_AT, FILE_POSITIONS, file, functions } = world;
const kernel = new Kernel(compileKernel());
/** The world's check routes, as a `fetch` for the wallet's `PssHttp`. */
async function served(scheme: SchemeName): Promise<{ http: PssHttp; queries: () => number }> {
  const routes = await world.serve(scheme);
  return { http: new PssHttp("http://dust.test", { fetch: routes.fetch }), queries: routes.queries };
}

for (const scheme of ["simplepir", "ipir-sp"] as const) {
  describe(`the wallet's check of its Dust chains (${scheme})`, () => {
    it("story 3 + story 2, scenario 2: the false match before the real spend is taken by the walk, refused by the check and dropped; the search resumes after it and the real chain's end is checked; a chain whose end the table does not reach is not checkable; a chain with no spend needs no check", { timeout: 300_000 }, async () => {
      const { http, queries } = await served(scheme);
      const checker = await DustChecker.open(http, scheme === "simplepir" ? { multiplier: inlineMultiplier } : { ipirWasm: () => compileIpirWasm() });
      try {
        // Without the check, the walk follows the false match and loses chain A.
        const unchecked = await walkDustChains(file, [A], [], functions);
        expect(unchecked[0]!.steps.map((s) => s.position)).toEqual([FALSE_AT]);
        expect(unchecked[0]!.status).toBe("unchecked");

        const ends: { position: number }[][] = [];
        const chains = await walkDustChains(file, [A, B, C], [], functions, async (batch) => {
          ends.push(batch.map((e) => ({ position: Number(e.coin.mtIndex) })));
          return checker.check(batch.map((e) => ({ position: Number(e.coin.mtIndex), commitment: fieldBytes(ledger.dustCommitment(e.coin)) })));
        });
        const [a, b, c] = chains;
        expect(a!.dropped).toEqual([FILE_POSITIONS.indexOf(FALSE_AT)]);
        expect(a!.steps.map((s) => s.position)).toEqual([20, 30]);
        expect(a!.coin).toEqual(A2);
        expect(a!.status).toBe("checked");
        expect(b!.steps.map((s) => s.position)).toEqual([25, 64]);
        expect(b!.coin).toEqual(B2);
        expect(b!.status).toBe("not-checkable");
        expect([c!.steps, c!.status, c!.coin]).toEqual([[], "no-spend", C.coin]);
        // Two batches: A's false end and B's end together; then A's new end. B's position is beyond the table, so only
        // A's is read: one padded call each, exactly queriesPerCall requests.
        expect(ends).toEqual([[{ position: FALSE_AT }, { position: 64 }], [{ position: 30 }]]);
        expect([checker.stats.calls, queries()]).toEqual([2, 2]);
        const calls = http.records.filter((r) => r.path === ROUTES.dustCheckQuery);
        expect(new Set(calls.map((r) => r.bodyBytes)).size).toBe(1);
        expect(checker.stats.bytesUp).toBe(calls.reduce((t, r) => t + r.bodyBytes, 0));
        expect(checker.stats.bytesDown).toBe(calls.reduce((t, r) => t + r.answerBytes, 0));
      } finally {
        checker.dispose();
      }
    });
  });

  describe(`spending a Dust coin from its private path (${scheme}, phase 9)`, () => {
    it("acceptance 2 and 4: the coin's path, read in one padded call, gives the snapshot's root; the local state from it and the generation records has the snapshot's two roots and spends the coin; a transaction's fee paid with it is covered", { timeout: 300_000 }, async () => {
      const routes = await world.serve(scheme);
      const http = new PssHttp("http://dust.test", { fetch: routes.fetch });
      const checker = await DustChecker.open(http, scheme === "simplepir" ? { multiplier: inlineMultiplier } : { ipirWasm: () => compileIpirWasm() });
      try {
        const m = checker.manifest;
        expect(m).toMatchObject({ version: 2, blockTime: SNAPSHOT_TIME, tree: { pathSplit: 2 }, generation: { records: 8 } });
        const commitment = fieldBytes(ledger.dustCommitment(A2));
        const path = await checker.readPath(Number(A2.mtIndex), commitment, kernel);
        expect([path.siblings.length, path.lower, Buffer.from(path.root).toString("hex")]).toEqual([32, 2, m.tree.root]);
        expect(routes.pathQueries()).toBe(1);
        const calls = http.records.filter((r) => r.path === ROUTES.dustPathQuery);
        expect(calls).toHaveLength(1);
        expect(checker.pathStats).toMatchObject({ calls: 1, bytesUp: calls[0]!.bodyBytes, bytesDown: calls[0]!.answerBytes });
        expect(checker.pathStats.pathPublicBytes).toBe(m.tree.pathPublic!.size);
        // Another commitment at that position gives another root: refused.
        await expect(checker.readPath(Number(A2.mtIndex), new Uint8Array(32), kernel)).rejects.toThrow(/not the Dust snapshot's/);
        // A second path read downloads nothing more than its call.
        expect(checker.pathStats.pathPublicBytes).toBe(m.tree.pathPublic!.size);

        const records = await checker.generationRecords();
        expect(records).toHaveLength(8);
        const { state } = dustLocalState(ledger as never, {
          params: world.params,
          secretKey: world.secretKey,
          owner: world.owner,
          coin: A2,
          siblings: path.siblings,
          records,
          commitmentRoot: fromHex(m.tree.root, 32),
          generationRoot: fromHex(m.generation.root, 32),
        });
        expect(state.commitmentTreeRoot()).toBe(BigInt(`0x${Buffer.from(fromHex(m.tree.root, 32)).reverse().toString("hex")}`));
        const ctime = new Date(m.blockTime * 1000);
        const [, spend] = state.spend(world.secretKey, A2, 1_000n, ctime);
        expect(spend.oldNullifier).toBe(ledger.dustNullifier(A2, world.secretKey));
        // The wrong roots are refused.
        expect(() => dustLocalState(ledger as never, { params: world.params, secretKey: world.secretKey, owner: world.owner, coin: A2, siblings: path.siblings, records, commitmentRoot: new Uint8Array(32), generationRoot: fromHex(m.generation.root, 32) })).toThrow(/commitment tree's root/);
        expect(() => dustLocalState(ledger as never, { params: world.params, secretKey: world.secretKey, owner: world.owner, coin: A2, siblings: path.siblings, records: records.map((r, i) => (i === 0 ? { ...r, value: r.value + 1n } : r)), commitmentRoot: fromHex(m.tree.root, 32), generationRoot: fromHex(m.generation.root, 32) })).toThrow(/generation tree's root/);

        // The fee of an (empty) transaction paid with the coin: the spend covers the merged transaction's fee.
        const parameters = ledger.LedgerParameters.initialParameters();
        const paid = payFeeWithDust(ledger as never, { network: "undeployed", base: ledger.Transaction.fromParts("undeployed") as never, local: state, secretKey: world.secretKey, coin: A2, ctime, ttl: new Date(ctime.getTime() + 600_000), parameters, margin: 5 });
        expect(paid.fee).toBeGreaterThan(0n);
        expect(paid.spend.vFee).toBeGreaterThanOrEqual(paid.fee);
        expect(paid.transaction.eraseProofs().feesWithMargin(parameters, 5)).toBeLessThanOrEqual(paid.spend.vFee);
        const intent = paid.transaction.intents?.get(1);
        expect(intent?.dustActions?.spends).toHaveLength(1);
        expect(intent?.dustActions?.ctime.getTime()).toBe(ctime.getTime());
      } finally {
        checker.dispose();
      }
    });

    it("the paying coin: a checked end or a public first coin the snapshot holds, worth the most at its block time; B's end, beyond the snapshot, cannot pay", { timeout: 300_000 }, async () => {
      const routes = await world.serve(scheme);
      const http = new PssHttp("http://dust.test", { fetch: routes.fetch });
      const checker = await DustChecker.open(http, scheme === "simplepir" ? { multiplier: inlineMultiplier } : { ipirWasm: () => compileIpirWasm() });
      try {
        const chains = await walkDustChains(file, [A, B, C], [], functions, async (batch) => checker.check(batch.map((e) => ({ position: Number(e.coin.mtIndex), commitment: fieldBytes(ledger.dustCommitment(e.coin)) }))));
        expect(chains.map((c) => c.status)).toEqual(["checked", "not-checkable", "no-spend"]);
        const m = checker.manifest;
        const ctime = new Date(m.blockTime * 1000);
        const value = (i: number) => ledger.updatedValue(chains[i]!.coin.ctime, chains[i]!.coin.initialValue, chains[i]!.generation, ctime, world.params);
        const best = value(0) >= value(2) ? 0 : 2;
        expect(chooseDustChain(ledger as never, chains, world.params, m.commitments, ctime)).toEqual({ chain: best, value: value(best) });
        const ready = await dustSpendable(ledger as never, { checker, chains, params: world.params, secretKey: world.secretKey, owner: world.owner, kernel });
        expect([ready.chain, ready.value, ready.roots]).toEqual([best, value(best), { commitment: m.tree.root, generation: m.generation.root }]);
        expect(ready.ctime.getTime()).toBe(SNAPSHOT_TIME * 1000);
        const c = await dustSpendable(ledger as never, { checker, chains, params: world.params, secretKey: world.secretKey, owner: world.owner, kernel, chain: 2 });
        expect([c.chain, Number(c.coin.mtIndex)]).toEqual([2, 7]);
        await expect(dustSpendable(ledger as never, { checker, chains, params: world.params, secretKey: world.secretKey, owner: world.owner, kernel, chain: 1 })).rejects.toThrow(/no Dust coin of this wallet is in the Dust snapshot/);
        expect(chooseDustChain(ledger as never, [chains[1]!], world.params, m.commitments, ctime)).toBeNull();
      } finally {
        checker.dispose();
      }
    });
  });
}
