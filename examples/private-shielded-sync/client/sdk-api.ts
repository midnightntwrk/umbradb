/**
 * What the command line takes from the wallet SDK (`sdk/`), declared here so the rest of the client type-checks and
 * runs without the client's install. `sdk/index.ts` provides it, checked against these declarations by the client's own
 * type check (`npm run typecheck --prefix examples/private-shielded-sync/client`).
 */

export interface SdkSeeds {
  readonly shielded: Uint8Array;
  readonly unshielded: Uint8Array;
  readonly dust: Uint8Array;
}

export interface SdkServices {
  readonly network: string;
  readonly nodeWs: string;
  readonly proofServer: string;
  readonly indexerHttp: string;
  readonly indexerWs: string;
  readonly projectId: string;
  readonly dustTimelineCache: string;
}

export interface SdkFeeWallet {
  stop(): Promise<void>;
}

export interface SdkSubmitted {
  readonly txHash: string;
  readonly identifiers: readonly string[];
  readonly bytes: number;
  readonly validation: "ok";
  readonly finalized: { readonly blockHash: string; readonly blockHeight: number } | null;
  readonly inBlock: { readonly blockHash: string; readonly blockHeight: number } | null;
  readonly timings: Readonly<Record<string, number>>;
}

export interface SdkModule {
  seedsFromMnemonic(mnemonic: string): SdkSeeds;
  openFeeWallet(seeds: SdkSeeds, services: SdkServices, options?: { log?: (line: string) => void; timeoutMs?: number }): Promise<SdkFeeWallet>;
  payProveSubmit(wallet: SdkFeeWallet, unproven: Uint8Array, nodeWs: string, options?: { log?: (line: string) => void; ttlMs?: number; submit?: boolean }): Promise<SdkSubmitted>;
}

/** Loads `sdk/index.ts` (needs `npm ci --ignore-scripts --prefix examples/private-shielded-sync/client`). */
export async function loadSdk(): Promise<SdkModule> {
  try {
    return (await import(new URL("./sdk/index.ts", import.meta.url).href)) as SdkModule;
  } catch (cause) {
    throw new Error(
      "the wallet SDK is not installed for the client: run `npm ci --ignore-scripts --prefix examples/private-shielded-sync/client`",
      { cause },
    );
  }
}
