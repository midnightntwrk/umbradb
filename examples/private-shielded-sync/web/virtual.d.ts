declare module "virtual:ledger-v9" {
  /** Fetches, instantiates and starts the ledger's WebAssembly; the package's exports and the `.wasm`'s size. */
  export function initLedger(url: string): Promise<{ ledger: Record<string, unknown>; bytes: number }>;
}

declare module "*.json" {
  const value: unknown;
  export default value;
}
