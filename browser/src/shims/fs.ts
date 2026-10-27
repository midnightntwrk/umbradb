/**
 * `node:fs` in the browser build (`openspec/changes/core-arch/design.md` §9.2; task 16.1): a browser reads no file.
 * The bundled sources name two of its functions, and neither is called there: `existsSync`, which only the default
 * entries of the ledger worker and the admin worker call (`ledgerWorkerEntry`, `workerEntry`) — the browser gives the
 * ledger worker its entry (`browser/src/core-worker.ts`) and serves the admin endpoints itself; it answers false —, and
 * `createReadStream`, with which a restore reads a backup file by its path (`src/backup/restore.ts`) — the page gives
 * the restore the picked file's text instead (`src/backup/text.ts`'s `blobText`, BK-5); it fails.
 */

export function existsSync(_path: unknown): boolean {
  return false;
}

export function createReadStream(path: unknown): never {
  throw new Error(`createReadStream(${String(path)}) of node:fs is not available in the browser build: it reads no file`);
}
