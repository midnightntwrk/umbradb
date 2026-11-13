/**
 * `@midnightntwrk/ledger-v9` 1.0.1 in the page's worker. The package's browser entry imports its `.wasm` as a module,
 * which needs a bundler that loads WebAssembly; `./build.ts` instead supplies the virtual module `virtual:ledger-v9`:
 * the package's bindings (`midnight_ledger_wasm_v9_bg.js`) and its snippets, with `initLedger(url)`, which fetches the
 * `.wasm` (copied beside the bundle), instantiates it with those imports and starts it, as the package's Node.js entry
 * does with `readFileSync`. The snippets' `#self` resolves to the same virtual module.
 */

export { initLedger } from "virtual:ledger-v9";
