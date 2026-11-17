/**
 * The private check of a wallet's Dust chains (spec 00062 story 3, FR-012, FR-023, SC-004), in both PIR schemes: a
 * Dust check table built with the module's own builder (`../server/dust-check.ts`) and answered by the scheme's server
 * table, called through the wallet's own code (`../client/dust-check.ts`, `../client/dust.ts`) over a stand-in for
 * HTTP that runs the module's wire format. The chains are derived with the vendored ledger's own functions; the file
 * holds another wallet's spend whose prefix is the first coin's, placed before the real spend.
 *
 * The world (chains, file, check table, routes) is `./server-dust-world.ts`. IPIR+SP needs its native add-on
 * (`ipir/build.sh native`).
 */

import { afterAll, describe, expect, it } from "vitest";
import * as ledger from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { DustChecker } from "../client/dust-check.ts";
import { fieldBytes, walkDustChains } from "../client/dust.ts";
import { PssHttp } from "../client/http.ts";
import { compileIpirWasm } from "../ipir/wallet-node.ts";
import { inlineMultiplier, type SchemeName } from "../pir/index.ts";
import { ROUTES } from "../shared/index.ts";
import { dustWorld } from "./server-dust-world.ts";

const world = await dustWorld();
afterAll(() => world.dispose());
const { A, B, C, A1, A2, B2, FALSE_AT, FILE_POSITIONS, file, functions } = world;
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
}
