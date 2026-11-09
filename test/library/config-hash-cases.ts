import type { DatabaseParts, PostgresParts } from "../../src/config/database-parts.js";
import { startUmbraDB, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { SECRET, SECRET_FORMS, SECRET_NODE, secretDatabase } from "../admin/secrets.js";
import type { ProcessBackend } from "../runner/process-backends.js";
import { cursorReaches, libraryData } from "./library-fixtures.js";
import { mapiModule, mountHandlers, rawHeaderValues, upgradeHead } from "./mounted-fixtures.js";

/**
 * The configuration-hash run and oracle, shared by `./mounted-api.test.ts` (the criterion) and
 * `./mounted-api.negative-control.test.ts` (its control, a hash over a secret on the mounted path only): two processes
 * whose configurations differ only in their secrets, and the `X-Umbra-Config-Hash` of the mounted upgrade's 101, beside
 * the module API listener's on the same process. Imports nothing of Vitest.
 */

/** A configuration hash's form. */
export const HASH = /^0x[0-9a-f]{64}$/;

/** One process of the run: its database, its `core` settings beside the tests' own, and every secret they hold. */
export interface SecretVariant {
  readonly database: DatabaseParts;
  readonly extra: Readonly<Record<string, unknown>>;
  readonly secrets: readonly string[];
}

/** What the run saw: each process's mounted upgrade hash and its listener's, and every secret they were given. */
export interface SecretHashes {
  readonly hashes: readonly (string | null)[];
  readonly listener: readonly (string | null)[];
  readonly secrets: readonly string[];
}

/**
 * The run on `backend` (see the module comment): on PostgreSQL the password of `database` (two logins), on PGlite a
 * TLS key and the node URL's credentials. `before` is told each process's variant before it starts (the control sets
 * its hash from it).
 */
export async function hashesOfSecrets(backend: ProcessBackend, before?: (variant: SecretVariant) => void): Promise<SecretHashes> {
  const variants: SecretVariant[] = [];
  if (backend.kind === "postgres") {
    const first = await secretDatabase(await backend.database());
    const plain = (await backend.database()).setting as PostgresParts;
    variants.push({ database: first, extra: {}, secrets: [SECRET] }, { database: plain, extra: {}, secrets: plain.password === undefined ? [] : [plain.password] });
  } else {
    const tls = (key: string) => ({ certificate: "-----BEGIN CERTIFICATE-----\nnot-checked\n-----END CERTIFICATE-----", key, trustedRoots: [] });
    variants.push(
      { database: (await backend.database()).setting, extra: { tls: tls("first-tls-key-secret"), node: SECRET_NODE }, secrets: ["first-tls-key-secret", SECRET] },
      { database: (await backend.database()).setting, extra: { tls: tls("second-tls-key-secret"), node: "ws://other:second-node-secret@127.0.0.1:9/node" }, secrets: ["second-tls-key-secret", "second-node-secret"] },
    );
  }
  const hashes: (string | null)[] = [];
  const listener: (string | null)[] = [];
  for (const variant of variants) {
    before?.(variant);
    const m = mapiModule({ emits: new Set() });
    const options: UmbraDBOptions = {
      config: { data: libraryData(variant.database, [m], variant.extra) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 1n }),
      network: { api: { port: 0 } },
    };
    const handle = startUmbraDB(options);
    const host = await mountHandlers(handle);
    try {
      await handle.started;
      await cursorReaches(handle, 1n);
      hashes.push(rawHeaderValues((await upgradeHead(host.origin)).head, "x-umbra-config-hash")[0] ?? null);
      const api = handle.status().listening.api;
      listener.push(api === null ? null : (rawHeaderValues((await upgradeHead(`http://${api.host}:${api.port}`)).head, "x-umbra-config-hash")[0] ?? null));
    } finally {
      await handle.stop();
      await host.close();
    }
  }
  return { hashes, listener, secrets: variants.flatMap((variant) => variant.secrets) };
}

/** `text`'s forms a header could show it in: as written, and its UTF-8 bytes as hex. */
const formsOf = (text: string): readonly string[] => [text, Buffer.from(text, "utf8").toString("hex")];

/** The hash oracle over `hashes` (`where` names them): one hash for both, of the hash's form, holding no secret. */
export function hashProblems(where: string, hashes: readonly (string | null)[], secrets: readonly string[]): string[] {
  const problems: string[] = [];
  if (new Set(hashes).size !== 1) problems.push(`${where}: the hash changed with only secrets changed: ${JSON.stringify(hashes)}`);
  for (const hash of hashes) {
    if (hash === null || !HASH.test(hash)) problems.push(`${where}: the upgrade's X-Umbra-Config-Hash is ${String(hash)}`);
    for (const secret of [...secrets, ...SECRET_FORMS]) {
      if (hash !== null && formsOf(secret).some((form) => form !== "" && hash.includes(form))) problems.push(`${where}: the hash holds the secret ${secret}`);
    }
  }
  return problems;
}
