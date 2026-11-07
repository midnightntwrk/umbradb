/**
 * A vendored ledger package's WebAssembly in the browser build. The package's Node.js entry
 * (`vendor/ledger/<version>/pkg/*_fs.js`) reads its `.wasm` beside it with `readFileSync` and instantiates it
 * synchronously. In the browser that entry is bundled with these lines instead (`browser/build.ts`'s
 * `browserLedgerEntry`). [LG-5; design §5.2, §9.2]
 *
 * The `.wasm` is copied beside the ledger worker as `ledger/<version>/<file>` and read with a synchronous request,
 * which a dedicated worker may make. Its SHA-256 is checked against the line of the package's `SHA256SUMS` that the
 * build read; otherwise it fails with `package-hash-mismatch`, just as the ledger identity check refuses a changed
 * package. It is then instantiated synchronously, as in Node.js. [A97]
 *
 * It is synchronous so the entry keeps no top-level `await`: the package's snippets import the entry back (`#self`),
 * and a module cycle holding a top-level `await` would wait on itself once bundled. Only the ledger worker loads it,
 * when a block first needs that version.
 */

import { UmbraError } from "../../../src/db/errors.js";
import { sha256 } from "../shims/sha256.js";

const hex = (bytes: Uint8Array): string => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

/** Reads, checks and instantiates a vendored package's WebAssembly (see the module comment). */
export function instantiateLedger(url: URL, expected: string, name: string, imports: WebAssembly.Imports): WebAssembly.Instance {
  const request = new XMLHttpRequest();
  request.open("GET", url.href, false);
  request.responseType = "arraybuffer";
  request.send();
  if (request.status !== 200) {
    throw new Error(`the ledger package's WebAssembly ${name} could not be read: HTTP ${request.status}`);
  }
  const bytes = new Uint8Array(request.response as ArrayBuffer);
  const found = hex(sha256(bytes));
  if (found !== expected) {
    throw new UmbraError(
      "package-hash-mismatch",
      `the ledger package's WebAssembly ${name} has SHA-256 ${found}, not the ${expected} its SHA256SUMS records`,
      { package: name },
    );
  }
  return new WebAssembly.Instance(new WebAssembly.Module(bytes), imports);
}
