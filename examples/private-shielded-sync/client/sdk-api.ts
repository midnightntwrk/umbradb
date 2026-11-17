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

/** A transfer proven, bound and validated (`send --dust-fee private`), not yet submitted. */
export interface SdkProven {
  readonly txHash: string;
  readonly identifiers: readonly string[];
  readonly bytes: Uint8Array;
  readonly validation: "ok";
  readonly timings: { readonly proveMs: number; readonly validateMs: number };
}

export interface SdkSent {
  readonly finalized: { readonly blockHash: string; readonly blockHeight: number };
  readonly inBlock: { readonly blockHash: string; readonly blockHeight: number } | null;
  readonly toInBlockMs: number;
  readonly toFinalizedMs: number;
}

export interface SdkModule {
  seedsFromMnemonic(mnemonic: string): SdkSeeds;
  openFeeWallet(seeds: SdkSeeds, services: SdkServices, options?: { log?: (line: string) => void; timeoutMs?: number }): Promise<SdkFeeWallet>;
  payProveSubmit(wallet: SdkFeeWallet, unproven: Uint8Array, nodeWs: string, options?: { log?: (line: string) => void; ttlMs?: number; submit?: boolean }): Promise<SdkSubmitted>;
  /** Proves an unproven transaction whose fee is paid at the local proof server, binds it, validates it as the SDK does. */
  proveAndValidate(unproven: Uint8Array, options: { readonly network: string; readonly proofServer: string; readonly ledgerParameters: Uint8Array; readonly now?: Date; readonly log?: (line: string) => void }): Promise<SdkProven>;
  /** Submits a finalized transaction and waits for finality. */
  submitFinalized(bytes: Uint8Array, nodeWs: string, options?: { log?: (line: string) => void }): Promise<SdkSent>;
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
