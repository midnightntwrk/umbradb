/**
 * PGlite's Node.js file system (`@electric-sql/pglite`'s `fs/nodefs.js`, which imports `fs` and `path`) in the
 * browser build (task 16.1): PGlite picks it only for a data directory that is a path, which the browser build never
 * gives (`browser/src/db/web-lock.ts` refuses one before PGlite opens anything). It refuses.
 */

export class NodeFS {
  constructor() {
    throw new Error("PGlite's Node.js file system is not available in the browser: use memory:// or opfs-ahp://");
  }
}
