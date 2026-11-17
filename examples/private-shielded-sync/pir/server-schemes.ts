/**
 * The PIR schemes the server module can build and serve (`./scheme.ts`). Node.js only: a scheme's server side may load
 * a native add-on. A scheme named in a manifest, a setting or an admin request but not listed here is refused with
 * {@link SchemeUnavailable}.
 *
 * To add a scheme: write its `ServerSchemeEntry` and list it in `SCHEMES`. Its `open` throws `SchemeUnavailable` when
 * a file it needs is missing, so the module refuses that scheme's builds and keeps serving the others.
 */

import { IPIR_SP_SERVER } from "./ipir-sp-server.ts";
import { type SchemeName, type ServerScheme, type ServerSchemeEntry, type ServerSchemeOptions, SchemeUnavailable, isSchemeName } from "./scheme.ts";
import { SIMPLEPIR_SERVER } from "./simplepir-server.ts";

const SCHEMES: { readonly [S in SchemeName]?: ServerSchemeEntry } = {
  simplepir: SIMPLEPIR_SERVER,
  // Opened only where its native add-on is built (`../ipir/build.sh native`); refused by name elsewhere.
  "ipir-sp": IPIR_SP_SERVER,
};

/** The registered scheme of this name; throws {@link SchemeUnavailable} for any other name. */
export function serverSchemeEntry(name: string): ServerSchemeEntry {
  const entry = isSchemeName(name) ? SCHEMES[name] : undefined;
  if (entry === undefined) throw new SchemeUnavailable(name, "the server module has no implementation of it");
  return entry;
}

/** Every registered scheme. */
export function serverSchemeEntries(): ServerSchemeEntry[] {
  return Object.values(SCHEMES).filter((e): e is ServerSchemeEntry => e !== undefined);
}

/** The largest request any table of any registered scheme can take: the query routes' body limit is fixed from it. */
export function maxRequestBytes(): number {
  return Math.max(...serverSchemeEntries().map((e) => e.maxRequestBytes));
}

/** Opens a registered scheme (its threads, its add-on); rejects with {@link SchemeUnavailable} for any other name. */
export async function openServerScheme(name: string, options: ServerSchemeOptions): Promise<ServerScheme> {
  return serverSchemeEntry(name).open(options);
}
