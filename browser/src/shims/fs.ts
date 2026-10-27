/**
 * `node:fs` in the browser build (`openspec/changes/core-arch/design.md` §9.2; task 16.1): a browser reads no file.
 * The one function the bundled sources reach is `existsSync`, which only the default entries of the ledger worker and
 * the admin worker call (`ledgerWorkerEntry`, `workerEntry`); the browser gives the ledger worker its entry
 * (`browser/src/core-worker.ts`) and serves the admin endpoints itself, so it is never called there. It answers false.
 */

export function existsSync(_path: unknown): boolean {
  return false;
}
