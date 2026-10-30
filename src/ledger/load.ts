/**
 * Loads the ledger adapters in Node.js. Each version's vendored package is imported from its Node.js entry
 * (`vendor/ledger/<version>/pkg/*_fs.js`, which reads the `.wasm` beside it and instantiates it synchronously). A
 * package is imported only when its version is asked for, so a thread pays only for the packages it uses: the ledger
 * worker loads them, never the main thread. [design §5.2, §5.3]
 *
 * The specifiers are relative to this file and resolve the same from `src/ledger/` and from a build's `dist/ledger/`.
 * A browser build maps them to the packages' browser entries and calls `createV8Adapter` / `createV9Rc3Adapter` /
 * `createV9Adapter` itself.
 *
 * Before importing a version's package, it checks the package's files against their recorded SHA-256
 * (`checkLedgerPackage`, `./identity.ts`, once per thread), so a thread never imports a changed package: the load
 * rejects with `package-hash-mismatch`, naming the version and the file. `./identity.ts` reads the packages beside this
 * file (`../../vendor/ledger/`), the directory these specifiers import from. [LG-5, A173]
 */

import { checkLedgerPackage } from "./identity.js";
import type { LedgerName, LedgerPackage, LedgerPackageOptions } from "./types.js";
import { createV8Adapter } from "./v8.js";
import { createV9Adapter, createV9Rc3Adapter } from "./v9.js";

/**
 * The adapter of `ledger`, with its package checked and loaded (once per thread: a module is evaluated once). Rejects
 * with `package-hash-mismatch` for a changed package, which is then not imported.
 */
export async function loadLedgerPackage(ledger: LedgerName, options: LedgerPackageOptions): Promise<LedgerPackage> {
  switch (ledger) {
    case "v8":
      checkLedgerPackage("v8");
      return createV8Adapter(await import("../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js"), options);
    case "v9-rc3":
      checkLedgerPackage("v9-rc3");
      return createV9Rc3Adapter(await import("../../vendor/ledger/v9-rc3/pkg/midnight_ledger_wasm_v9_fs.js"), options);
    case "v9":
      checkLedgerPackage("v9");
      return createV9Adapter(await import("../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js"), options);
    default:
      throw new RangeError(`this build carries no ledger ${ledger} adapter`);
  }
}
