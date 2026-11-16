/**
 * SimplePIR's wallet side behind the scheme seam (`./scheme.ts`), over this folder's functions, unchanged: queries
 * `A·s + e + Δ·unit(j)` (`buildQueries`), decoding with the setup data (`decodeAnswers`) and the records of a decoded
 * column (`columnRecords`), on the multiplication the caller gives (the command line's worker pool, the page's inline
 * one). It runs in the page's worker too: its Node.js imports (`node:crypto`, `node:os`, `node:worker_threads`, through
 * the files it uses) are the ones the page's build replaces (`../web/build.ts`).
 */

import { inlineMultiplier } from "./multiply.ts";
import { PIR_PARAMS } from "./params.ts";
import { buildQueries, columnRecords, decodeAnswers, type TableInfo } from "./query.ts";
import { SchemeUnavailable, type WalletCall, type WalletScheme, type WalletSchemeEntry, type WalletTable } from "./scheme.ts";
import { setupMatrix } from "./setup.ts";
import { fromHex, type PirTableRef, type SchemeParams } from "../shared/manifest.ts";

/** Throws unless the snapshot's SimplePIR parameters are this build's: decoding assumes every one of them. */
function checkParams(pir: SchemeParams): void {
  const keys = ["logQ", "n", "sigma", "cellBits", "plainModulus"] as const;
  if (keys.some((k) => pir[k] !== PIR_PARAMS[k])) {
    throw new SchemeUnavailable("simplepir", `the snapshot's parameters ${JSON.stringify(pir)} are not this build's ${JSON.stringify(PIR_PARAMS)}`);
  }
}

/** SimplePIR as the wallet registers it (`./wallet-schemes.ts`). */
export const SIMPLEPIR_WALLET: WalletSchemeEntry = {
  name: "simplepir",
  async open(manifest, options): Promise<WalletScheme> {
    checkParams(manifest.pir);
    const multiplier = options.multiplier ?? inlineMultiplier;
    return {
      name: "simplepir",
      async openTable(ref: PirTableRef, publicArtifact: Uint8Array): Promise<WalletTable> {
        const l = ref.layout;
        const info: TableInfo = {
          rows: l.rows,
          cols: l.cols,
          perColumn: ref.perGroup,
          cellsPerRecord: l.cellsPerRecord,
          recordBytes: ref.recordBytes,
          records: ref.records,
          seed: fromHex(l.seed, 32),
        };
        const setup = setupMatrix(publicArtifact, l.rows);
        return {
          groups: ref.groups,
          perGroup: ref.perGroup,
          requestBytes: l.cols * 4,
          responseBytes: l.rows * 4,
          async prepareCall(groups: readonly number[]): Promise<WalletCall> {
            const batch = await buildQueries(info, groups, multiplier);
            return {
              requests: new Uint8Array(batch.queries.buffer, batch.queries.byteOffset, batch.queries.byteLength),
              async decode(responses: Uint8Array, wanted: number): Promise<Uint8Array[][]> {
                // Copied into an aligned buffer (an answer body's offset may not be a multiple of 4).
                const answers = new Uint32Array(responses.length / 4);
                new Uint8Array(answers.buffer).set(responses);
                const values = await decodeAnswers(setup, batch, answers, multiplier);
                return values.slice(0, wanted).map((v) => columnRecords(info, v));
              },
            };
          },
          dispose() {},
        };
      },
      dispose() {},
    };
  },
};
