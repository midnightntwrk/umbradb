/**
 * `node:fs` in the browser build: a browser reads no file. The bundled sources name two of its functions, and neither
 * is called there: [design §9.2]
 * - `existsSync`, which only the default entries of the ledger worker and the admin worker call (`ledgerWorkerEntry`,
 *   `workerEntry`). The browser gives the ledger worker its entry (`browser/src/core-worker.ts`) and serves the admin
 *   endpoints itself. It answers false.
 * - `createReadStream`, with which a restore reads a backup file by its path (`src/backup/restore.ts`). The page gives
 *   the restore the picked file's text instead (`src/backup/text.ts`'s `blobText`). It fails. [BK-5]
 */

export function existsSync(_path: unknown): boolean {
  return false;
}

export function createReadStream(path: unknown): never {
  throw new Error(`createReadStream(${String(path)}) of node:fs is not available in the browser build: it reads no file`);
}
