/**
 * IPIR+SP's wallet side behind the scheme seam (`./scheme.ts`, spec 00058 FR-020, FR-021, FR-030 to FR-032), over the
 * wallet's WebAssembly (`../ipir/wallet.ts`). No Node.js import: the page's worker loads it too.
 *
 * - The WebAssembly comes from `WalletSchemeOptions.ipirWasm`, compiled by the caller after it checked the file's
 *   digest (FR-031): the command line's `compileIpirWasm`, the page's own check. Without it the wallet stops with
 *   {@link SchemeUnavailable} naming the file.
 * - A table is opened from its manifest entry (shape, seed; the setup's snapshot input is the table file's digest) and
 *   its masks, the public artifact the wallet downloaded once for the snapshot (FR-014).
 * - A call (FR-020): one request per group asked for, each with its own fresh secret and key, drawn inside the
 *   WebAssembly from the platform's cryptographic source (FR-032, Q5); the caller puts the wanted groups first and pads
 *   with random ones. Its answer decodes, for each wanted request, the row's cells into its `perGroup` records
 *   (`./ipir/encode.ts`); the padding requests' answers are not decoded.
 * - Threads: with `WalletSchemeOptions.ipirWorkers` a call's requests are made on worker threads, each with its own
 *   instance of the WebAssembly (`../ipir/pool.ts`); without, one after the other on the calling thread
 *   (`../ipir/engine.ts`). The bytes sent are of the same form either way.
 * - Secrets (review F7: a request's state is erased only by freeing it): a call's states are freed once its answer is
 *   decoded, when the decode fails, when making the call fails part-way, and, for a call whose answer never came (a
 *   network error, a replaced snapshot), when its table is disposed; disposing the scheme disposes every table it
 *   opened. `sync` and `lowerPathsByPir` dispose both in `finally` blocks.
 */

import { inlineIpirEngine, type IpirEngineTable } from "../ipir/engine.ts";
import { IPIR_DIGIT_BITS, IPIR_DIGITS, IPIR_MASK_BITS, IPIR_P_BITS, IPIR_Q_BITS, IPIR_QUERY_BITS, IPIR_RESPONSE_BITS, IPIR_RING } from "../ipir/sizes.ts";
import { ipirRowRecords } from "./ipir/encode.ts";
import { SchemeUnavailable, type WalletCall, type WalletScheme, type WalletSchemeEntry, type WalletTable } from "./scheme.ts";
import { fromHex, type IpirSpParams, type PirTableRef, type SchemeParams } from "../shared/manifest.ts";

/** This build's profile, which a snapshot's parameters must equal. */
const PROFILE: IpirSpParams = {
  ring: IPIR_RING,
  qBits: IPIR_Q_BITS,
  pBits: IPIR_P_BITS,
  digitBits: IPIR_DIGIT_BITS,
  digits: IPIR_DIGITS,
  maskBits: IPIR_MASK_BITS,
  queryBits: IPIR_QUERY_BITS,
  responseBits: IPIR_RESPONSE_BITS,
};

/** Throws unless the snapshot's IPIR+SP parameters are this build's: the WebAssembly is built for exactly these. */
function checkParams(pir: SchemeParams): void {
  const given = pir as Partial<IpirSpParams>;
  if ((Object.keys(PROFILE) as (keyof IpirSpParams)[]).some((k) => given[k] !== PROFILE[k])) {
    throw new SchemeUnavailable("ipir-sp", `the snapshot's parameters ${JSON.stringify(pir)} are not this build's ${JSON.stringify(PROFILE)}`);
  }
}

/** The wallet's WebAssembly from the caller, or the reason it cannot be had. */
async function moduleOf(load: (() => WebAssembly.Module | Promise<WebAssembly.Module>) | undefined): Promise<WebAssembly.Module> {
  if (load === undefined) throw new SchemeUnavailable("ipir-sp", "this wallet was not given its WebAssembly (ipir/pss-ipir.wasm)");
  try {
    return await load();
  } catch (cause) {
    throw new SchemeUnavailable("ipir-sp", `the wallet's WebAssembly (ipir/pss-ipir.wasm) cannot be loaded: ${cause instanceof Error ? cause.message : String(cause)}`);
  }
}

/** One table, as a wallet calls it; `release` tells the scheme it was disposed. */
function tableOf(engine: IpirEngineTable, ref: PirTableRef, release: () => void): WalletTable {
  const { requestBytes, responseBytes } = engine.sizes;
  const e = ref.layout.cellsPerRecord;
  let disposed = false;
  return {
    groups: ref.groups,
    perGroup: ref.perGroup,
    requestBytes,
    responseBytes,
    async prepareCall(groups: readonly number[]): Promise<WalletCall> {
      if (disposed) throw new Error("this IPIR+SP table was disposed");
      const call = await engine.call(groups);
      let decoded = false;
      return {
        requests: call.requests,
        async decode(responses: Uint8Array, wanted: number): Promise<Uint8Array[][]> {
          if (decoded) throw new Error("an IPIR+SP call's answer is decoded once");
          decoded = true;
          try {
            if (responses.length !== groups.length * responseBytes) {
              throw new Error(`an answer to ${groups.length} requests is ${groups.length * responseBytes} bytes, got ${responses.length}`);
            }
            if (!Number.isSafeInteger(wanted) || wanted < 0 || wanted > groups.length) throw new Error(`wanted ${wanted} of ${groups.length} requests`);
            const rows = await call.decode(responses, wanted);
            return rows.map((row) => ipirRowRecords(row, ref.perGroup, e, ref.recordBytes));
          } finally {
            call.free();
          }
        },
      };
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      // Frees the table and the states of its calls not decoded yet.
      engine.free();
      release();
    },
  };
}

/** IPIR+SP as the wallet registers it (`./wallet-schemes.ts`). */
export const IPIR_SP_WALLET: WalletSchemeEntry = {
  name: "ipir-sp",
  async open(manifest, options): Promise<WalletScheme> {
    checkParams(manifest.pir);
    const module = await moduleOf(options.ipirWasm);
    const engine = options.ipirWorkers === undefined ? inlineIpirEngine(module) : await options.ipirWorkers.engine(module);
    const open = new Set<WalletTable>();
    return {
      name: "ipir-sp",
      async openTable(ref: PirTableRef, publicArtifact: Uint8Array): Promise<WalletTable> {
        const l = ref.layout;
        // The setup's snapshot input is the table file's digest; its seed is the manifest's (FR-012).
        const opened = await engine.openTable({ rows: l.rows, cols: l.cols, seed: fromHex(l.seed, 32), snapshot: fromHex(ref.digest, 32), masks: publicArtifact });
        const table = tableOf(opened, ref, () => open.delete(table));
        open.add(table);
        return table;
      },
      dispose() {
        for (const table of [...open]) table.dispose();
      },
    };
  },
};
