/**
 * The fee, the proof and the submission of a transfer (spec FR-125–127), with the wallet SDK 2.0.0, ported from the
 * transfer spike (`experiments/00053-transfer-spike/d/wallet.ts` and `e/e3-transfer.ts`, steps 7–12; finalized on
 * Preprod in block 3,399,948):
 *
 * - the SDK facade for the wallet's three seeds, its indexer through the loopback proxy that adds the Blockfrost
 *   header (decision Q11), the Dust wallet started at Preprod's ledger 9 fork (decision Q13), proving at the local
 *   proof server (FR-126: the spend's proof input holds the coin secret key, so never a remote prover);
 * - `balanceUnprovenTransaction(…, { tokenKindsToBalance: ['dust'] })`: Dust only (FR-125), the shielded input and
 *   outputs are the client's own; `signRecipe` (nothing unshielded to sign); `finalizeRecipe` (prove, bind);
 *   `validateTransaction`;
 * - submission as the unsigned extrinsic `midnight.sendMnTransaction` through the SDK's Polkadot node client, waiting
 *   for finality (FR-127, decision Q24: it reports the block).
 *
 * The facade syncs its shielded wallet too (the facade starts all three wallets and settles on a protocol version only
 * when all three have crossed Preprod's ledger 9 fork), which takes 7–14 minutes through Blockfrost; the transfer uses
 * nothing from it. The shielded wallet reads the indexer's public event stream; no key leaves the process.
 */

import * as ledger from "@midnightntwrk/ledger-v9";
import {
  createKeystore,
  DefaultForkSchedule,
  DustWallet,
  type FacadeState,
  InMemoryTransactionHistoryStorage,
  mergeWalletEntries,
  NodeClient,
  ProtocolVersion,
  PublicKey,
  ShieldedWallet,
  type UnshieldedKeystore,
  UnshieldedWallet,
  WalletEntrySchema,
  WalletFacade,
} from "@midnightntwrk/wallet-sdk";
import { Option } from "effect";
import * as Rx from "rxjs";
import { findDustTimelineStart } from "./dust-timeline.ts";
import { type IndexerProxy, startIndexerProxy } from "./indexer-proxy.ts";
import type { Seeds } from "./seeds.ts";

/** Where the services are (from the environment: `node --env-file=<secrets.env>`). */
export interface Services {
  readonly network: string;
  readonly nodeWs: string;
  readonly proofServer: string;
  readonly indexerHttp: string;
  readonly indexerWs: string;
  /** The Blockfrost key: sent only to the indexer, as its `project_id` header. */
  readonly projectId: string;
  /** Where the Dust timeline answer is cached. */
  readonly dustTimelineCache: string;
}

export interface FeeWallet {
  readonly facade: WalletFacade;
  readonly keystore: UnshieldedKeystore;
  readonly proxy: IndexerProxy;
  state: FacadeState;
  stop(): Promise<void>;
}

const isFullySynced = (s: FacadeState): boolean =>
  s.shielded.progress.isStrictlyComplete() &&
  s.unshielded.progress.isStrictlyComplete() &&
  s.dust.progress.isStrictlyComplete() &&
  s.protocol._tag === "Settled";

function progressLine(s: FacadeState): string {
  const p = (x: { isStrictlyComplete(): boolean }) => {
    const r = x as unknown as Record<string, unknown>;
    const fields = ["appliedIndex", "highestRelevantWalletIndex", "highestIndex", "appliedId", "highestTransactionId"]
      .filter((k) => r[k] !== undefined)
      .map((k) => String(r[k]));
    return `${fields.join("/")}${x.isStrictlyComplete() ? " done" : ""}`;
  };
  return `shielded ${p(s.shielded.progress)} | unshielded ${p(s.unshielded.progress)} | dust ${p(s.dust.progress)} | protocol ${s.protocol._tag}`;
}

/** Starts the facade for the wallet's seeds and waits until it is synced (Dust is what the fee needs). */
export async function openFeeWallet(seeds: Seeds, services: Services, options: { log?: (line: string) => void; timeoutMs?: number } = {}): Promise<FeeWallet> {
  const log = options.log ?? (() => {});
  const proxy = await startIndexerProxy({ upstreamHttp: services.indexerHttp, upstreamWs: services.indexerWs, projectId: services.projectId });
  try {
    const dustStart = await findDustTimelineStart(proxy.wsUrl, services.dustTimelineCache);
    const keystore = createKeystore({ kind: "schnorr", secret: seeds.unshielded }, services.network);
    const configuration = WalletFacade.resolveConfiguration({
      networkId: services.network,
      forks: DefaultForkSchedule,
      costParameters: { feeBlocksMargin: 5 },
      relayURL: new URL(services.nodeWs),
      provingServerUrl: new URL(services.proofServer),
      indexerClientConnection: { indexerHttpUrl: proxy.httpUrl, indexerWsUrl: proxy.wsUrl },
      txHistoryStorage: new InMemoryTransactionHistoryStorage(WalletEntrySchema, mergeWalletEntries),
      dustTimelineStartProbe: async () =>
        Option.some({ cursor: BigInt(dustStart.cursor), version: ProtocolVersion.ProtocolVersion(BigInt(dustStart.version)) }),
    });
    const facade = await WalletFacade.init({
      configuration,
      shielded: (config) => ShieldedWallet(config).startWithSeed(seeds.shielded),
      unshielded: (config) => UnshieldedWallet(config).startWithPublicKey(PublicKey.fromKeyStore(keystore)),
      dust: (config) => DustWallet(config).startWithSeed(seeds.dust),
    });
    await facade.start(seeds);
    let last = 0;
    const state = await Rx.firstValueFrom(
      facade.state().pipe(
        Rx.tap((s) => {
          if (Date.now() - last > 15_000) {
            last = Date.now();
            log(`fee wallet: ${progressLine(s)}`);
          }
        }),
        Rx.filter(isFullySynced),
        Rx.timeout({ first: options.timeoutMs ?? 2 * 60 * 60 * 1000 }),
      ),
    );
    return {
      facade,
      keystore,
      proxy,
      state,
      async stop() {
        await facade.stop();
        await proxy.close();
      },
    };
  } catch (error) {
    await proxy.close();
    throw error;
  }
}

export interface Submitted {
  readonly txHash: string;
  readonly identifiers: readonly string[];
  readonly bytes: number;
  readonly validation: "ok";
  /** Null when submission was not asked for (`submit: false`). */
  readonly finalized: { readonly blockHash: string; readonly blockHeight: number } | null;
  readonly inBlock: { readonly blockHash: string; readonly blockHeight: number } | null;
  readonly timings: { readonly balanceMs: number; readonly signMs: number; readonly proveMs: number; readonly validateMs: number; readonly toInBlockMs: number; readonly toFinalizedMs: number };
}

/** An SDK error as text: its message, or its tag and fields (the SDK's tagged errors may carry no message). */
function describe(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  try {
    return JSON.stringify(error, (_k, v: unknown) => (typeof v === "bigint" ? v.toString() : v instanceof Uint8Array ? `<${v.length} bytes>` : v)) ?? String(error);
  } catch {
    return String(error);
  }
}

/** Balances the unproven transaction for Dust, proves, validates, submits and waits for finality. */
export async function payProveSubmit(
  wallet: FeeWallet,
  unproven: Uint8Array,
  nodeWs: string,
  options: { log?: (line: string) => void; ttlMs?: number; submit?: boolean } = {},
): Promise<Submitted> {
  const log = options.log ?? (() => {});
  const { facade, keystore } = wallet;
  const handle = facade.adoptTransaction(unproven, "Unproven");
  let t = performance.now();
  const recipe = await facade.balanceUnprovenTransaction(handle, { ttl: new Date(Date.now() + (options.ttlMs ?? 30 * 60 * 1000)), tokenKindsToBalance: ["dust"] });
  const balanceMs = performance.now() - t;
  log(`fee: balanced with Dust in ${Math.round(balanceMs)} ms`);
  t = performance.now();
  const signed = await facade.signRecipe(recipe, (payload) => keystore.signDataAsync(payload));
  const signMs = performance.now() - t;
  t = performance.now();
  const finalized = await facade.finalizeRecipe(signed);
  const proveMs = performance.now() - t;
  log(`proof: proved and bound in ${Math.round(proveMs)} ms`);
  const bytes = finalized.serialize();
  const tx = ledger.Transaction.deserialize("signature", "proof", "binding", bytes);
  t = performance.now();
  try {
    await facade.validateTransaction(finalized, { flags: { enforceBalancing: true, verifySignatures: true, enforceLimits: true } });
  } catch (error) {
    throw new Error(`the transaction failed validation: ${describe(error)}`, { cause: error });
  }
  const validateMs = performance.now() - t;
  log(`validated in ${Math.round(validateMs)} ms`);
  if (options.submit === false) {
    return {
      txHash: tx.transactionHash(),
      identifiers: tx.identifiers(),
      bytes: bytes.length,
      validation: "ok",
      finalized: null,
      inBlock: null,
      timings: { balanceMs, signMs, proveMs, validateMs, toInBlockMs: Number.NaN, toFinalizedMs: Number.NaN },
    };
  }

  const client = await NodeClient.PolkadotNodeClient.init(NodeClient.makeConfig({ nodeURL: new URL(nodeWs) }));
  const submitted = performance.now();
  let inBlock: Submitted["inBlock"] = null;
  let toInBlockMs = Number.NaN;
  try {
    const final = await new Promise<{ blockHash: string; blockHeight: number }>((resolve, reject) => {
      const sub = client.sendMidnightTransaction(bytes).subscribe({
        next: (ev) => {
          const e = ev as unknown as { _tag: string; blockHash?: string; blockHeight?: bigint | number };
          log(`submission: ${e._tag}${e.blockHeight !== undefined ? ` at ${e.blockHeight}` : ""}`);
          if (e._tag === "InBlock") {
            toInBlockMs = performance.now() - submitted;
            inBlock = { blockHash: String(e.blockHash), blockHeight: Number(e.blockHeight) };
          }
          if (e._tag === "Finalized") {
            sub.unsubscribe();
            resolve({ blockHash: String(e.blockHash), blockHeight: Number(e.blockHeight) });
          }
        },
        error: (err: unknown) => reject(err instanceof Error ? err : new Error(String(err))),
      });
    });
    return {
      txHash: tx.transactionHash(),
      identifiers: tx.identifiers(),
      bytes: bytes.length,
      validation: "ok",
      finalized: final,
      inBlock,
      timings: { balanceMs, signMs, proveMs, validateMs, toInBlockMs, toFinalizedMs: performance.now() - submitted },
    };
  } finally {
    await client.close();
  }
}
