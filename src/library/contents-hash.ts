/**
 * The contents hash the package exports: the contents hash of `src/determinism/contents-hash.ts` with the
 * content-defined tables of UmbraDB's own declarations, so a database's node tables are hashed by what they hold, as
 * its backups and restores hash them. The tables declared `deterministic: false` are the caller's to give
 * (`optedOut`), since they are its modules'.
 */

import { CORE_MODULES, PUBLIC_BACKBONE } from "../cli/build-modules.js";
import {
  contentsHash as hashOf,
  type ContentDefinedTables,
} from "../determinism/contents-hash.js";
import type { ConsistentRead, ModuleTableOptions, PageOptions } from "../determinism/module-tables.js";
import { declaredContentDefined } from "../modules/adapters.js";
import type { ModuleDeclaration } from "../modules/declaration.js";

/** A contents hash function: the contents hash (32 bytes) of the database `read` sees. */
export type ContentsHash = (read: ConsistentRead, options?: PageOptions & ModuleTableOptions) => Promise<Uint8Array>;

/**
 * The contents hash of a build whose declarations are `declarations`: the tables they declare content-defined are
 * taken by their content, every other table as `src/determinism/contents-hash.ts` takes it.
 */
export function contentsHashOf(declarations: readonly ModuleDeclaration[]): ContentsHash {
  const contentDefined: readonly ContentDefinedTables[] = declaredContentDefined(declarations);
  return (read, options = {}) => hashOf(read, { ...options, contentDefined });
}

/**
 * The contents hash (32 bytes) of the database `read` sees, as UmbraDB computes it: with the content-defined tables of
 * its own backbone parts and core modules. The tables `options.optedOut` names (declared `deterministic: false`) are
 * recorded by name only.
 */
export const contentsHash: ContentsHash = contentsHashOf([...PUBLIC_BACKBONE, ...CORE_MODULES]);
