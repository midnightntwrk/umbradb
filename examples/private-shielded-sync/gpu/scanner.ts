/**
 * The scan interface shared by the CPU kernel's worker pool (`kernel/scan-pool.ts`, `ScanPool`, which satisfies it as
 * it is) and the GPU scanner (`gpu/scan.ts`, `GpuScanner`). Same inputs, same outputs, same refusals.
 */
export interface Scanner {
  /** The positions (indices into `entries`, 36 bytes each) that pass the ownership test, ascending. */
  scan(entries: Uint8Array, secret: Uint8Array): Promise<number[]>;
  /** For each entry, the 32-byte value the ownership test compares (zero for an all-zero entry or a bad point). */
  scanValues(entries: Uint8Array, secret: Uint8Array): Promise<Uint8Array>;
  /** Releases threads or GPU buffers. */
  close(): Promise<void>;
}
