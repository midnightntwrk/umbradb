/**
 * A vendored ledger package's WebAssembly in the browser build (`openspec/changes/core-arch/specs/ledger/spec.md`
 * LG-5; `design.md` §5.2, §9.2; task 12.1's note (f), task 12.2's note (f); task 16.1): the package's Node.js entry
 * (`vendor/ledger/<version>/pkg/*_fs.js`) reads its `.wasm` beside it with `readFileSync` and instantiates it
 * synchronously; in the browser that entry is bundled with these lines instead (`browser/build.ts`'s
 * `browserLedgerEntry`): the `.wasm`, copied beside the ledger worker as `ledger/<version>/<file>`, is read with a
 * synchronous request — a dedicated worker may make one —, its SHA-256 checked against the line of the package's
 * `SHA256SUMS` the build read (`package-hash-mismatch` otherwise, as 12.2's identity check refuses a changed package,
 * A97), and instantiated synchronously, as in Node.js. Synchronous, so the entry keeps no top-level `await`: the
 * package's snippets import the entry back (`#self`), and a module cycle holding a top-level `await` would wait on
 * itself once bundled. Only the ledger worker loads it, when a block first needs that version.
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
