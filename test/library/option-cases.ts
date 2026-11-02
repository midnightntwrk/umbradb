import type { UmbraDBHandle } from "../../src/library/start-umbradb.js";

/**
 * L62's cases and its oracle, shared by `./start-umbradb.test.ts` (the criterion, and LM-1's options that cannot be
 * read) and `./start-umbradb.negative-control.test.ts` (the facade without its option check, or reading the options as
 * given, fails the same oracle). [L62, LM-1, LM-10]
 */

/** L62's malformed options, each with the path its refusal names. */
export const MALFORMED: readonly (readonly [string, unknown, string])[] = [
  ["config with neither file nor data", { config: {} }, "config"],
  ["config with both", { config: { file: "a.ts", data: {} } }, "config"],
  ["no config", {}, "config"],
  ["modules not an array", { config: { data: {} }, modules: "m" }, "modules"],
  ["modulesFrom not a URL", { config: { data: {} }, modulesFrom: "./modules.ts" }, "modulesFrom"],
  ['network: "configured"', { config: { data: {} }, network: "configured" }, "network"],
  ["api: { port: 1.5 }", { config: { data: {} }, network: { api: { port: 1.5 } } }, "network.api.port"],
  [
    "publicSide: { channels: false }",
    { config: { data: {} }, network: { privateLink: { publicSide: { channels: false } } } },
    "network.privateLink.publicSide.channels",
  ],
  ["an unknown network key", { config: { data: {} }, network: { apis: true } }, "network.apis"],
  ["a host that is no string", { config: { data: {} }, network: { admin: { host: 1, port: 0 } } }, "network.admin.host"],
  ["cwd not a string", { config: { data: {} }, cwd: 7 }, "cwd"],
  ["a log that is no function", { config: { data: {} }, log: "stderr" }, "log"],
  ["signal not an AbortSignal", { config: { data: {} }, signal: {} }, "signal"],
  ["acceptPublicConfigHash of another form", { config: { data: {} }, acceptPublicConfigHash: "0xAB" }, "acceptPublicConfigHash"],
  ["options that are no object", null, "options"],
];

/** A getter that throws. */
export const throwing = (): never => {
  throw new Error("a getter that throws");
};

/** A revoked proxy: every operation on it throws, `Array.isArray` included. */
const revoked = (): object => {
  const { proxy, revoke } = Proxy.revocable({}, {});
  revoke();
  return proxy;
};

/** A proxy whose traps all throw. */
const hostile = (target: object = {}): object =>
  new Proxy(target, {
    ownKeys: throwing,
    get: throwing,
    has: throwing,
    getOwnPropertyDescriptor: throwing,
    getPrototypeOf: throwing,
  });

/** Options that cannot be read as given, each with the path its refusal names. [LM-1, L62] */
export const UNREADABLE: readonly (readonly [string, () => unknown, string])[] = [
  ["config.file's getter", () => ({ config: { get file() { return throwing(); } } }), "config.file"],
  ["config.data's getter", () => ({ config: { get data() { return throwing(); } } }), "config.data"],
  ["config as a hostile proxy", () => ({ config: hostile({ data: {} }) }), "config"],
  ["config as a revoked proxy", () => ({ config: revoked() }), "config"],
  ["config.file a fake URL", () => ({ config: { file: Object.create(URL.prototype) } }), "config.file"],
  ["config.file a proxy of a URL", () => ({ config: { file: new Proxy(new URL("file:///srv/umbradb.config.ts"), {}) } }), "config.file"],
  ["network.api's getter", () => ({ config: { data: {} }, network: { get api() { return throwing(); } } }), "network.api"],
  ["network as a hostile proxy", () => ({ config: { data: {} }, network: hostile() }), "network"],
  ["network.api.port's getter", () => ({ config: { data: {} }, network: { api: { get port() { return throwing(); } } } }), "network.api.port"],
  [
    "privateLink.publicSide's getter",
    () => ({ config: { data: {} }, network: { privateLink: { get publicSide() { return throwing(); } } } }),
    "network.privateLink.publicSide",
  ],
  [
    "publicSide.channels's getter",
    () => ({ config: { data: {} }, network: { privateLink: { publicSide: { get channels() { return throwing(); } } } } }),
    "network.privateLink.publicSide.channels",
  ],
  ["privateLink as a revoked proxy", () => ({ config: { data: {} }, network: { privateLink: revoked() } }), "network.privateLink"],
  ["signal made from AbortSignal's prototype", () => ({ config: { data: {} }, signal: Object.create(AbortSignal.prototype) }), "signal"],
  ["signal a proxy of a real one", () => ({ config: { data: {} }, signal: new Proxy(new AbortController().signal, {}) }), "signal"],
  ["signal a hostile proxy", () => ({ config: { data: {} }, signal: hostile() }), "signal"],
  ["modules a hostile proxy of an array", () => ({ config: { data: {} }, modules: hostile([]) }), "modules"],
  ["modules a revoked proxy", () => ({ config: { data: {} }, modules: revoked() }), "modules"],
  [
    "modules an array whose element's getter throws",
    () => ({ config: { data: {} }, modules: Object.defineProperty([{}], 0, { enumerable: true, get: throwing }) }),
    "modules[0]",
  ],
  [
    "modules a proxy of an array whose element's read throws",
    () => ({ config: { data: {} }, modules: new Proxy([{}, {}], { get: (target, key) => (key === "1" ? throwing() : Reflect.get(target, key)) }) }),
    "modules[1]",
  ],
  [
    "modules a proxy of an array whose length reads as no array's",
    () => ({ config: { data: {} }, modules: new Proxy([], { get: (target, key) => (key === "length" ? -1 : Reflect.get(target, key)) }) }),
    "modules",
  ],
  ["modulesFrom a fake URL", () => ({ config: { data: {} }, modulesFrom: Object.create(URL.prototype) }), "modulesFrom"],
  ["the options a revoked proxy", () => revoked(), "options"],
  ["the options a hostile proxy", () => hostile(), "options"],
];

/** How long a refused process may take to end by itself. */
const ENDS_BY_ITSELF_MS = 30_000;

/** Waits for `handle` to have closed, the process ending by itself (a configuration refusal), or fails after 30 s. */
export async function closedByItself(handle: UmbraDBHandle): Promise<void> {
  let timer: NodeJS.Timeout | undefined;
  const late = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("the process did not end by itself within 30 s")), ENDS_BY_ITSELF_MS);
  });
  try {
    await Promise.race([handle.closed, late]);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * L62's oracle over one start (`start`, the facade's call): the problems, none when the call did not throw, `started`
 * rejected with `invalid-configuration`, reason `invalid-option`, naming `path`, and the process ended `refused` by
 * itself. A process that did not end so is stopped. [L62, LM-1, LM-10]
 */
export async function optionProblems(start: () => UmbraDBHandle, path: string): Promise<string[]> {
  let handle: UmbraDBHandle;
  try {
    handle = start();
  } catch (error) {
    return [`startUmbraDB threw: ${String(error)}`];
  }
  const problems: string[] = [];
  const rejection = await handle.started.then(
    () => null,
    (error: unknown) => error as { readonly code?: unknown; readonly details?: { readonly reason?: unknown; readonly option?: unknown } },
  );
  if (rejection === null) problems.push("started resolved");
  else {
    const { code, details } = rejection;
    if (code !== "invalid-configuration" || details?.reason !== "invalid-option" || details.option !== path) {
      problems.push(`started rejected ${String(code)} ${String(details?.reason)} at ${String(details?.option)}, not invalid-option at ${path}`);
    }
  }
  try {
    await closedByItself(handle);
  } catch (error) {
    problems.push(String(error));
    await handle.stop();
  }
  const status = handle.status();
  const ended = await handle.ended;
  if (status.state !== "refused" || status.reason?.code !== "invalid-configuration" || ended.kind !== "refused") {
    problems.push(`ended ${ended.kind}, ${status.state} (${String(status.reason?.code)}), not refused invalid-configuration`);
  }
  return problems;
}
