/**
 * Reads the wallet's IPIR+SP WebAssembly (`pss-ipir.wasm`) in Node and compiles it only if its SHA-256 equals the
 * committed one (`pss-ipir.wasm.sha256`; spec FR-031). The compiled module goes to `IpirWallet` (`wallet.ts`) and can
 * be sent to worker threads. A browser page checks the digest itself and never imports this file.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const IPIR_WASM_PATH = fileURLToPath(new URL("./pss-ipir.wasm", import.meta.url));
export const IPIR_WASM_DIGEST_PATH = fileURLToPath(new URL("./pss-ipir.wasm.sha256", import.meta.url));

/** The digest recorded beside the WebAssembly, as lower-case hex. */
export function committedIpirWasmDigest(path: string = IPIR_WASM_DIGEST_PATH): string {
  const line = readFileSync(path, "utf8").trim();
  const digest = line.split(/\s+/)[0] ?? "";
  if (!/^[0-9a-f]{64}$/.test(digest)) throw new Error(`no SHA-256 in ${path}`);
  return digest;
}

/** Reads and compiles the WebAssembly after checking its SHA-256 against `expectedDigest` (by default the committed one). */
export function compileIpirWasm(options: { path?: string; expectedDigest?: string } = {}): WebAssembly.Module {
  const path = options.path ?? IPIR_WASM_PATH;
  const bytes = readFileSync(path);
  const digest = createHash("sha256").update(bytes).digest("hex");
  const expected = options.expectedDigest ?? committedIpirWasmDigest();
  if (digest !== expected) {
    throw new Error(`the IPIR+SP WebAssembly ${path} has digest ${digest}, not the expected ${expected}`);
  }
  return new WebAssembly.Module(bytes);
}
