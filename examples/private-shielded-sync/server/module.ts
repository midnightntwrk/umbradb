/// <reference types="node" />
/**
 * The private shielded sync module, as a configuration file imports it:
 *
 *     import { pssModule } from "/abs/path/examples/private-shielded-sync/server/module.ts";
 *     export const modules = [pssModule];
 *     … pssModule.entry({ start: <cursor + 1>, config: { dataDir: "pss-data", adminSecret: "…" } })
 *
 * `umbradb` resolves through the repository's own package name (its `exports`), so a built checkout serves it. The
 * reference to Node.js's types puts them in scope for `umbradb config check`, which type-checks this file from the
 * configuration file's directory (where no `@types/node` may be installed).
 */

import { defineModule } from "umbradb";
import { pssDeclaration } from "./declaration.ts";

export const pssModule = defineModule(pssDeclaration());
