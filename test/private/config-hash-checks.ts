import { z } from "zod";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { ProcessInput } from "../../src/runner/process.js";
import { type PrivateBackend, READER_LOGIN, type TestDatabase } from "./backends.js";
import { launchPrivate, launchPublicCore, type PrivateProcess, type PublicCore } from "./builds.js";
import { RetargetProxy } from "./relays.js";
import type { DatabaseParts, PostgresParts } from "../../src/config/database-parts.js";

/**
 * A162 (task 14.1b; PP-14, RN-16, PP-4, owner decision Q147): a private process halts when the public core restarts
 * with a data field of its configuration changed, and only then; the configuration hash is on every module API answer
 * and holds no secret. Shared by `config-hash.test.ts` and its negative controls' file; imports nothing of Vitest.
 *
 * **The run** ({@link a162Run}): a public core with the public module `pub` (a data setting `level`, a route `GET
 * /level`), its module API on a free port and, for a private process with a transport, its `listen.transport` behind a
 * proxy whose target follows the core's restarts (`RetargetProxy`); and a private process `watcher` — with
 * `coreTransport` (the proxy), or without one (PostgreSQL only: its public database read directly, woken by a poll).
 * The core starts at head 5, and is restarted three times, each with a higher head that the private process must then
 * reach: (1) with the same configuration, head 8; (2) with only secrets changed — the node URL's password, and on
 * PostgreSQL the password of the core's own login (`ALTER ROLE`) in `database` —, head 11; (3) with a data field
 * changed — `level` of `pub`'s revision from 30 —, at head 11 at first. Without a transport, after each
 * restart every session of the private process's public login is ended (`pg_terminate_backend`), so that it connects to
 * its public database again — when it reads the public configuration history again (PP-14). After (3) the core is taken
 * to 16 and the run waits until the private process has ended or reached 16. Each restart's answers of the core's module
 * API (`GET /level` and a 404) and one of the private process's are read for `X-Umbra-Config-Hash`.
 */

/** The public module `pub` (see the module comment). */
export function pub(): ModuleDeclaration {
  return {
    id: "pub",
    version: "1.0.0",
    side: "public",
    requires: ["blocks"],
    provides: [],
    startsMidChain: true,
    configSchema: z.object({ level: z.number().int().default(0).meta({ kind: "data" }) }),
    migrations: [],
    points: {
      async "on-start-api"(_p, api) {
        api.http("GET", "/level", async (_request, read) => ({ status: 200, body: { height: read.height } }));
      },
    },
  };
}

/**
 * `pub`'s entries: `level` 0 from 1, and `level` 1 from 30 — or, with a changed configuration, `level` 2 from 30: the
 * same revisions, one data field changed above the cursor (CF-6 allows no other change there).
 */
const pubEntries = (changed: boolean) => [
  { id: "pub", start: 1, version: "1.0.0", config: { level: 0 } },
  { id: "pub", start: 30, version: "1.0.0", config: { level: changed ? 2 : 1 } },
];

/** How many runs made a core login on this test process's PostgreSQL servers (a login is the server's, not a database's). */
let logins = 0;

/** The secrets of the core's first start and of its restart with only secrets changed. */
export const SECRETS = Object.freeze({
  first: Object.freeze({ node: "first-node-secret", database: "first-db-secret" }),
  second: Object.freeze({ node: "second-node-secret", database: "second-db-secret" }),
});

/** The PostgreSQL parts `setting` with the login `login` and `password`. */
function asLogin(setting: DatabaseParts, login: string, password: string): DatabaseParts {
  return { ...(setting as PostgresParts), user: login, password };
}

/** The `X-Umbra-Config-Hash` of one module API answer, and where it was read. */
export interface HeaderSeen {
  readonly where: string;
  readonly status: number;
  readonly value: string | null;
  readonly version: string | null;
}

/** What one run saw. */
export interface A162Run {
  readonly transport: boolean;
  /** Whether the run had a private process (the secrets' negative control has none). */
  readonly private: boolean;
  /** The core's answers by its start: `first`, `same`, `secrets`, `changed`. */
  readonly core: Readonly<Record<"first" | "same" | "secrets" | "changed", readonly HeaderSeen[]>>;
  /** The private process's own module API answer (its own configuration hash). */
  readonly own: readonly HeaderSeen[];
  /** Every secret the core was given. */
  readonly secrets: readonly string[];
  /** The private process's cursor after the same-configuration restart (8) and the secrets' (11). */
  readonly afterSame: bigint | null;
  readonly afterSecrets: bigint | null;
  /** The core's cursor at the end (16). */
  readonly coreAt: bigint | null;
  /** The private process at the end. */
  readonly cursor: bigint | null;
  readonly state: string;
  readonly code: string | null;
  readonly height: bigint | null;
}

/** Options of {@link a162Run}. */
export interface A162Options {
  /** Whether the private process has `coreTransport`; without, PostgreSQL only. */
  readonly transport: boolean;
  /** Whether a private process runs; true unless given. */
  readonly private?: boolean;
  /** A negative control's private process that ignores `configHash` (`PrivateIntakeOptions.configHash`). */
  readonly ignore?: boolean;
  /** A negative control's configuration hash of the core (`ProcessInput.configHash`). */
  readonly configHash?: ProcessInput["configHash"];
}

/** Waits until `check` holds, or fails after `ms` naming `what`. */
async function until(check: () => boolean, what: string, ms = 300_000): Promise<void> {
  const deadline = Date.now() + ms;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out: ${what}`);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

/** The module API answers of `origin` at `paths`, with their configuration hash and version. */
async function headersOf(where: string, origin: string, paths: readonly string[]): Promise<HeaderSeen[]> {
  const seen: HeaderSeen[] = [];
  for (const path of paths) {
    const response = await fetch(`${origin}${path}`);
    await response.arrayBuffer();
    seen.push({
      where: `${where} ${path}`,
      status: response.status,
      value: response.headers.get("x-umbra-config-hash"),
      version: response.headers.get("x-umbra-version"),
    });
  }
  return seen;
}

/** `http://host:port` of a started process's module API. */
const originOf = (api: { readonly host: string; readonly port: number } | null): string => {
  if (api === null) throw new Error("the process has no module API listener");
  return `http://${api.host}:${api.port}`;
};

/** Runs A162's scenario (see the module comment) on `backend`. */
export async function a162Run(backend: PrivateBackend, options: A162Options): Promise<A162Run> {
  const withPrivate = options.private ?? true;
  const postgres = backend.kind === "postgres";
  if (withPrivate && !options.transport && !postgres) {
    throw new Error("a private process without a transport reads a PostgreSQL public database");
  }
  const publicDb: TestDatabase = await backend.database("public");
  // The core's own login on PostgreSQL, whose password the run changes: one per run.
  logins += 1;
  const login = `umbradb_core_${process.pid}_${logins}`;
  if (postgres) await publicDb.exec?.(`CREATE ROLE ${login} LOGIN SUPERUSER PASSWORD '${SECRETS.first.database}'`);
  const proxy = await RetargetProxy.start();
  const secrets: string[] = [];
  const launch = (head: bigint, changed: boolean, secret: { readonly node: string; readonly database: string }): PublicCore => {
    secrets.push(secret.node, ...(postgres ? [secret.database] : []));
    return launchPublicCore({
      database: postgres ? asLogin(publicDb.setting, login, secret.database) : publicDb.setting,
      head,
      modules: [pub()],
      entries: pubEntries(changed),
      extra: {
        node: `ws://watch:${secret.node}@127.0.0.1:9/node`,
        listen: { api: "127.0.0.1:0", ...(options.transport ? { transport: "127.0.0.1:0" } : {}) },
      },
      ...(options.configHash === undefined ? {} : { configHash: options.configHash }),
    });
  };
  let core = launch(5n, false, SECRETS.first);
  let watcher: PrivateProcess | undefined;
  /** The core restarted with `changed` and `secret`, at `head`, its transport behind the proxy. */
  const restart = async (head: bigint, changed: boolean, secret: { readonly node: string; readonly database: string }) => {
    await core.stop();
    proxy.retarget(null);
    if (postgres && secret !== SECRETS.first) await publicDb.exec?.(`ALTER ROLE ${login} PASSWORD '${secret.database}'`);
    core = launch(head, changed, secret);
    if (options.transport) proxy.retarget(await core.transportWithin(300_000));
    const started = await core.handle.started;
    await core.advance(head);
    return started;
  };
  /** Without a transport: the private process's sessions of its public database ended, so it connects again. */
  const reconnect = async (): Promise<void> => {
    if (!options.transport) await publicDb.terminate?.(READER_LOGIN);
  };
  const reads = (where: string, api: { readonly host: string; readonly port: number } | null) =>
    headersOf(where, originOf(api), ["/level", "/nothing"]);
  try {
    if (options.transport) proxy.retarget(await core.transportWithin(300_000));
    const first = await core.handle.started;
    await core.advance(5n);
    const seenFirst = await reads("the core's first start", first.api);
    let own: HeaderSeen[] = [];
    if (withPrivate) {
      const privateDb = await backend.database("private");
      watcher = launchPrivate({
        database: privateDb.setting,
        instanceId: "watcher",
        ...(options.transport ? { coreTransport: proxy.address } : {}),
        ...(postgres ? { publicDatabase: publicDb.readerSetting as DatabaseParts } : {}),
        extra: { backoffCeilingMs: 1_000, listen: { api: "127.0.0.1:0" } },
        ...(options.ignore === true ? { intake: { configHash: "ignore" as const } } : {}),
      });
      const started = await watcher.handle.started;
      await watcher.reach(5n);
      own = await headersOf("the private process", originOf(started.api), ["/nothing"]);
    }
    // (1) The same configuration.
    const same = await restart(8n, false, SECRETS.first);
    const seenSame = await reads("the core restarted with the same configuration", same.api);
    await reconnect();
    if (watcher !== undefined) await watcher.reach(8n);
    const afterSame = watcher?.handle.status().cursor ?? null;
    // (2) Only secrets changed.
    const secretsChanged = await restart(11n, false, SECRETS.second);
    const seenSecrets = await reads("the core restarted with only secrets changed", secretsChanged.api);
    await reconnect();
    if (watcher !== undefined) await watcher.reach(11n);
    const afterSecrets = watcher?.handle.status().cursor ?? null;
    // (3) A data field changed, at the same head first; then the core goes on to 16.
    const changed = await restart(11n, true, SECRETS.second);
    const seenChanged = await reads("the core restarted with a data field changed", changed.api);
    await reconnect();
    if (watcher !== undefined) {
      const running = watcher;
      // The private process learns of it at its next message (a transport) or read after reconnecting (none).
      await until(() => running.handle.status().ended !== null, "the private process to halt", 15_000).catch(() => undefined);
      await core.advance(16n);
      await until(() => running.handle.status().ended !== null || (running.handle.status().cursor ?? 0n) >= 16n, "the private process to end or reach 16");
    } else {
      await core.advance(16n);
    }
    const status = watcher?.handle.status();
    return {
      transport: options.transport,
      private: withPrivate,
      core: { first: seenFirst, same: seenSame, secrets: seenSecrets, changed: seenChanged },
      own,
      secrets,
      afterSame,
      afterSecrets,
      coreAt: core.handle.status().cursor,
      cursor: status?.cursor ?? null,
      state: status?.state ?? "none",
      code: status?.reason?.code ?? null,
      height: status?.reason?.height ?? null,
    };
  } finally {
    await watcher?.stop();
    await core.stop();
    await proxy.close();
  }
}

/** A configuration hash's form: `0x` and 64 lowercase hex digits. */
const HASH = /^0x[0-9a-f]{64}$/;

/** `text`'s forms a header could show it in: as written, and its UTF-8 bytes as hex. */
const formsOf = (text: string): readonly string[] => [text, Buffer.from(text, "utf8").toString("hex")];

/**
 * A162's oracle: every problem with `run`, none when A162 holds — every module API answer read carries one
 * `X-Umbra-Config-Hash` of the hash's form beside `X-Umbra-Version`, the same on every answer of one start, holding no
 * secret in any form searched; the same after a restart with the same configuration and after one with only secrets
 * changed, another after a data field changed; the private process went on to 8 and 11 and then halted with
 * `public-config-changed`, still at 11 — no other height processed — while the core reached 16.
 */
export function a162Problems(run: A162Run): string[] {
  const problems: string[] = [];
  const all = [...run.core.first, ...run.core.same, ...run.core.secrets, ...run.core.changed, ...run.own];
  for (const answer of all) {
    if (answer.value === null || !HASH.test(answer.value)) {
      problems.push(`${answer.where} (${answer.status}): X-Umbra-Config-Hash ${String(answer.value)}`);
    }
    if (answer.version === null) problems.push(`${answer.where} (${answer.status}): no X-Umbra-Version`);
    for (const secret of run.secrets) {
      if (answer.value !== null && formsOf(secret).some((form) => (answer.value as string).includes(form))) {
        problems.push(`${answer.where}: X-Umbra-Config-Hash holds the secret ${secret}`);
      }
    }
  }
  const hashOf = (start: keyof A162Run["core"]): string | null => {
    const values = [...new Set(run.core[start].map((answer) => answer.value))];
    if (values.length !== 1) problems.push(`the core's ${start} start answered with the hashes ${JSON.stringify(values)}`);
    return values[0] ?? null;
  };
  const first = hashOf("first");
  if (hashOf("same") !== first) problems.push("X-Umbra-Config-Hash changed with the core restarted with the same configuration");
  if (hashOf("secrets") !== first) problems.push("X-Umbra-Config-Hash changed with only secrets changed");
  if (hashOf("changed") === first) problems.push("X-Umbra-Config-Hash did not change with a data field changed");
  if (run.coreAt !== 16n) problems.push(`the core stopped at ${run.coreAt}, not 16`);
  if (!run.private) return problems;
  if (run.afterSame !== 8n) problems.push(`after the core restarted with the same configuration the private process was at ${run.afterSame}`);
  if (run.afterSecrets !== 11n) problems.push(`after the core restarted with only secrets changed the private process was at ${run.afterSecrets}`);
  if (run.state !== "halted" || run.code !== "public-config-changed") {
    problems.push(`after a data field changed the private process is ${run.state} (${String(run.code)}), not halted with public-config-changed`);
  }
  if (run.cursor !== 11n) problems.push(`the private process kept processing after the core's configuration changed: at ${run.cursor}`);
  return problems;
}
