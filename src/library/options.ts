/**
 * The options of `startUmbraDB` (`./start-umbradb.ts`) held to their shapes. A refusal of them is one of startup's
 * configuration step (class A): `startUmbraDB` never throws for it, the engine refuses with it before anything opens,
 * and `started` rejects with it. [LM-1, LM-3, LM-10; design §4, §5.1, §7.2]
 *
 * **The options read once** ({@link readOptions}): every option, and inside `config`, `network` and `modules` every
 * member the checks and the engine use, is read once into plain data (frozen copies of the objects, a file URL as a URL
 * of its own, the signal checked as one), each read guarded: a getter or a proxy's trap that throws, a revoked proxy,
 * is a finding at its path (`network.api.port: reading it threw`), never a throw out of `startUmbraDB`. What is checked
 * is what the engine is given; nothing of the host's objects is read again. [LM-1, L62]
 *
 * **The options' shapes** ({@link optionFindings}): an option of a type it cannot have, an unknown option, and a
 * malformed network request are each a finding at the option's path (`config`, `network.api.port`), and together the
 * refusal `invalid-configuration` with the reason `invalid-option` ({@link optionsRefusal}). A URL is one when URL's own
 * accessor reads it, an `AbortSignal` when AbortSignal's does and it is no proxy: an object made from their prototypes,
 * or a proxy of one, is not. [L62, LM-1]
 *
 * **User modules given twice** ({@link modulesGivenTwice}): `modules` with a `{ file }` configuration, whose own
 * `modules` export they are, `modules` and `modulesFrom`, or `modulesFrom` with `{ file }` (`modules-given-twice`).
 * [LM-7, L44]
 *
 * **The in-memory chain** ({@link sourceRefusal}, {@link privateSourceRefusal}): `source` is read only when it is exactly
 * an `InMemoryBlockSource` — its prototype that class's own, no proxy — carrying none of the members the engine takes
 * as hooks of a block source ({@link SOURCE_HOOKS}), so that a host cannot reach the engine's checks, its commit height
 * or its prefetch through it; and only on a public process, a private one reading its public side
 * (`source-refused`). [LM-8, L48]
 *
 * **The settings of the process's `core` revision a library process refuses** ({@link librarySettingsRefusal}):
 * `backupAtStop` and `backupOnSignal`, which write backups at the command's stop and on its SIGUSR2; a host writes its
 * backups with `UmbraDBHandle.backup` instead (`library-setting-refused`, naming the setting). [LM-2, BK-1, G3, L47]
 */

import { types } from "node:util";
import type { ProcessSide } from "../config/core-settings.js";
import type { PlainObject } from "../config/plain-data.js";
import type { CheckedEntry, Finding } from "../config/validate.js";
import { UmbraError } from "../db/errors.js";
import { isSignal } from "../runner/host-signal.js";
import { InMemoryBlockSource } from "../runner/in-memory-source.js";

/** The options `startUmbraDB` knows (design §4). */
export const OPTION_NAMES: readonly string[] = Object.freeze([
  "config",
  "cwd",
  "modules",
  "modulesFrom",
  "source",
  "signal",
  "log",
  "acceptPublicConfigHash",
  "network",
]);

/** A public configuration hash, as a start that stopped with `public-config-changed` names it. [PP-14, Q159] */
const CONFIG_HASH = /^0x[0-9a-f]{64}$/;

const isObject = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * The value of `object[key]`, or `{ thrown }` when reading it threw (a getter, a proxy): read once, so that what is
 * checked is what is used. [LM-1]
 */
export function readOption(
  object: Readonly<Record<string, unknown>>,
  key: string,
): { readonly value: unknown } | { readonly thrown: true } {
  try {
    return { value: object[key] };
  } catch {
    return { thrown: true };
  }
}

/** What {@link guarded} answers for a read that threw. */
const THREW: unique symbol = Symbol("threw");

/** What `read` gives, or {@link THREW} when it throws (a getter, a proxy's trap, a revoked proxy). [LM-1] */
function guarded<T>(read: () => T): T | typeof THREW {
  try {
    return read();
  } catch {
    return THREW;
  }
}

/** The keys of `object`, or null when listing them threw. */
function keysOf(object: object): readonly string[] | null {
  const keys = guarded(() => Object.keys(object));
  return keys === THREW ? null : keys;
}

/** A finding of the options at `path`: its message names the path. [L62] */
const finding = (path: string, message: string): Finding =>
  Object.freeze({ rule: "invalid-option", path, entry: null, field: null, message: `${path}: ${message}` });

/** The finding of a read at `path` that threw. [LM-1] */
const threw = (path: string): Finding => finding(path, "reading it threw");

/**
 * `value` read once as plain data at `path`, `depth` levels down (see the module comment): an array becomes a frozen
 * copy of its elements, another object (a proxy's too) a frozen object of its own enumerable keys and their values,
 * anything else is itself. Each read that throws adds its finding to `found`, and what could not be read is
 * undefined: nothing of the host's object is kept. [LM-1, L62]
 */
function snapshot(value: unknown, path: string, depth: number, found: Finding[]): unknown {
  if (depth === 0 || typeof value !== "object" || value === null) return value;
  const array = guarded(() => Array.isArray(value));
  if (array === THREW) {
    found.push(threw(path));
    return undefined;
  }
  if (array) {
    const elements = guarded(() => Array.prototype.slice.call(value) as unknown[]);
    if (elements === THREW) {
      found.push(threw(path));
      return undefined;
    }
    return Object.freeze(elements.map((element, index) => snapshot(element, `${path}[${index}]`, depth - 1, found)));
  }
  const keys = keysOf(value);
  if (keys === null) {
    found.push(threw(path));
    return undefined;
  }
  const entries: [string, unknown][] = [];
  for (const key of keys) {
    const inner = guarded(() => (value as Readonly<Record<string, unknown>>)[key]);
    if (inner === THREW) found.push(threw(`${path}.${key}`));
    else entries.push([key, snapshot(inner, `${path}.${key}`, depth - 1, found)]);
  }
  // `Object.fromEntries` keeps a key named `__proto__` as an own key, as the checks read it.
  return Object.freeze(Object.fromEntries(entries));
}

/** URL's own accessor of a URL's text, as a function of its receiver: it throws for anything that is no URL. */
const HREF = (Object.getOwnPropertyDescriptor(URL.prototype, "href") as PropertyDescriptor).get as (this: URL) => string;

/** `value` as a URL of its own when it is a URL (URL's own accessor reads it), else null. [LM-1, CF-1] */
function urlOf(value: unknown): URL | null {
  if (typeof value !== "object" || value === null || types.isProxy(value)) return null;
  const href = guarded(() => HREF.call(value as URL));
  return href === THREW ? null : new URL(href);
}

/** Whether `value` is an `AbortSignal` (AbortSignal's own accessor reads it), and no proxy of one. [LM-1, LM-9] */
const isAbortSignal = (value: unknown): value is AbortSignal => isSignal(value) && !types.isProxy(value);

/** How deep each option holding objects is read (see {@link snapshot}): `network` to its surfaces' members. */
const DEPTHS: Readonly<Record<string, number>> = Object.freeze({ config: 1, modules: 1, network: 3 });

/**
 * The option `key`'s value as read once (see the module comment): its objects copied, a URL as one of its own; a
 * value that is no URL where one is taken stays as given, for its check to refuse. [LM-1]
 */
function readValue(key: string, value: unknown, found: Finding[]): unknown {
  const read = snapshot(value, key, DEPTHS[key] ?? 0, found);
  if (key === "modulesFrom") return urlOf(read) ?? read;
  if (key === "config" && isObject(read) && typeof read.file === "object") {
    const file = urlOf(read.file);
    return file === null ? read : Object.freeze({ ...read, file });
  }
  return read;
}

/** The options read once: each value, or a finding when reading it threw. */
export interface ReadOptions {
  readonly values: Readonly<Record<string, unknown>>;
  readonly findings: readonly Finding[];
  /** False when the options themselves could not be read (no object, or keys that cannot be listed). */
  readonly readable: boolean;
  /** The options a read of which threw: their findings say so, and their shapes are not checked. */
  readonly unread: readonly string[];
}

/** Reads every option of `options` once (see the module comment); none of an `options` that is no object. */
export function readOptions(options: unknown): ReadOptions {
  const object = guarded(() => isObject(options));
  if (object !== true) {
    const message = object === THREW ? "reading it threw" : "startUmbraDB takes one object of options";
    return { values: {}, findings: [finding("options", message)], readable: false, unread: [] };
  }
  const keys = keysOf(options as object);
  if (keys === null) return { values: {}, findings: [finding("options", "its keys cannot be read")], readable: false, unread: [] };
  const values: Record<string, unknown> = {};
  const findings: Finding[] = [];
  const unread: string[] = [];
  for (const key of keys) {
    const read = readOption(options as Readonly<Record<string, unknown>>, key);
    if ("thrown" in read) {
      findings.push(threw(key));
      unread.push(key);
      continue;
    }
    if (read.value === undefined) continue;
    const before = findings.length;
    const value = readValue(key, read.value, findings);
    if (findings.length === before) values[key] = value;
    else unread.push(key);
  }
  return { values: Object.freeze(values), findings, readable: true, unread: Object.freeze(unread) };
}

/**
 * A host as an address names it, the rule of the configuration's addresses (`host:port`): a host name or an IPv4
 * address without spaces, `:`, `/`, brackets or `@`, or an IPv6 address (hex digits, `:` and `.`, unbracketed).
 * [LM-3, CF-4]
 */
const isHost = (host: string): boolean => /^[^\s:/[\]@]+$/.test(host) || (host.includes(":") && /^[0-9A-Fa-f:.]+$/.test(host));

/** The findings of a `{ host?, port }` address request at `path`. [LM-3, L62] */
function addressFindings(value: Readonly<Record<string, unknown>>, path: string): Finding[] {
  const found: Finding[] = [];
  for (const key of Object.keys(value)) {
    if (key !== "host" && key !== "port") {
      found.push(finding(`${path}.${key}`, "is no key of an address: host and port"));
    }
  }
  const { host, port } = value;
  if (host !== undefined && (typeof host !== "string" || !isHost(host))) {
    found.push(
      finding(`${path}.host`, "a host is a string: a host name or an IPv4 address without spaces, or an IPv6 address"),
    );
  }
  if (!Number.isInteger(port) || (port as number) < 0 || (port as number) > 65_535) {
    found.push(finding(`${path}.port`, "a port is an integer from 0 to 65535 (0: a free port)"));
  }
  return found;
}

/**
 * The findings of a surface's request at `path`: absent, a boolean, an address, or — for one side of the private link
 * — `{ channels: true }` (`channels`) or `{ connect }` (`connect`). [LM-3, L62; design §5.1]
 */
function surfaceFindings(value: unknown, path: string, alternative?: "channels" | "connect"): Finding[] {
  if (value === undefined || typeof value === "boolean") return [];
  const forms =
    alternative === "channels"
      ? "true, false, { host, port } or { channels: true }"
      : alternative === "connect"
        ? "true, false, { host, port } or { connect }"
        : "true, false or { host, port }";
  if (!isObject(value)) return [finding(path, `is ${forms}`)];
  if (alternative === "channels" && "channels" in value) {
    const extra = Object.keys(value).filter((key) => key !== "channels");
    return [
      ...(value.channels === true
        ? []
        : [finding(`${path}.channels`, "is true: the host gives each channel to privateLink.accept")]),
      ...extra.map((key) => finding(`${path}.${key}`, "is no key of { channels: true }")),
    ];
  }
  if (alternative === "connect" && "connect" in value) {
    const extra = Object.keys(value).filter((key) => key !== "connect");
    return [
      ...(typeof value.connect === "function"
        ? []
        : [finding(`${path}.connect`, "is a function of an AbortSignal resolving with a channel")]),
      ...extra.map((key) => finding(`${path}.${key}`, "is no key of { connect }")),
    ];
  }
  return addressFindings(value, path);
}

/** The findings of the `network` option (design §5.1): its keys and each surface's form. [LM-3, L62] */
export function networkFindings(network: unknown): Finding[] {
  if (network === undefined) return [];
  if (!isObject(network)) return [finding("network", "is an object of api, admin and privateLink")];
  const found: Finding[] = [];
  for (const key of Object.keys(network)) {
    if (key !== "api" && key !== "admin" && key !== "privateLink") {
      found.push(finding(`network.${key}`, "is no key of the network request: api, admin and privateLink"));
    }
  }
  found.push(...surfaceFindings(network.api, "network.api"), ...surfaceFindings(network.admin, "network.admin"));
  const link = network.privateLink;
  if (link === undefined) return found;
  if (!isObject(link)) return [...found, finding("network.privateLink", "is an object of publicSide and privateSide")];
  for (const key of Object.keys(link)) {
    if (key !== "publicSide" && key !== "privateSide") {
      const message = "is no key of the private link's request: publicSide and privateSide";
      found.push(finding(`network.privateLink.${key}`, message));
    }
  }
  found.push(
    ...surfaceFindings(link.publicSide, "network.privateLink.publicSide", "channels"),
    ...surfaceFindings(link.privateSide, "network.privateLink.privateSide", "connect"),
  );
  return found;
}

/** The findings of the `config` option: `{ file }` (a path or a URL) or `{ data }`, exactly one. [CF-1, L62] */
function configFindings(config: unknown): Finding[] {
  if (config === undefined) return [finding("config", "is required: { file } or { data }")];
  if (!isObject(config)) return [finding("config", "is { file } or { data }")];
  const keys = Object.keys(config);
  const found = keys
    .filter((key) => key !== "file" && key !== "data")
    .map((key) => finding(`config.${key}`, "is no key of config: file or data"));
  const hasFile = keys.includes("file");
  const hasData = keys.includes("data");
  if (hasFile === hasData) {
    found.push(finding("config", hasFile ? "gives file and data both: one of them" : "has neither file nor data"));
  } else if (hasFile && typeof config.file !== "string" && urlOf(config.file) === null) {
    found.push(finding("config.file", "is a path (a string) or a file URL"));
  }
  return found;
}

/** Every finding of the options as read (see the module comment). [L62] */
export function optionFindings(read: ReadOptions): Finding[] {
  const { values } = read;
  const found: Finding[] = [...read.findings];
  if (!read.readable) return found;
  for (const key of Object.keys(values)) {
    if (!OPTION_NAMES.includes(key)) {
      found.push(finding(key, `is no option of startUmbraDB (${OPTION_NAMES.join(", ")})`));
    }
  }
  // An option whose read threw has its finding already: its shape is not judged from what could be read of it.
  const unread = new Set(read.unread);
  if (!unread.has("config")) found.push(...configFindings(values.config));
  const { cwd, modules, signal, log, acceptPublicConfigHash } = values;
  if (cwd !== undefined && typeof cwd !== "string") found.push(finding("cwd", "is a path, a string"));
  if (modules !== undefined && !Array.isArray(modules)) {
    found.push(finding("modules", "is an array of module declarations"));
  }
  if (values.modulesFrom !== undefined && urlOf(values.modulesFrom) === null) {
    found.push(finding("modulesFrom", "is the URL of an ES module whose modules export lists the user modules"));
  }
  if (signal !== undefined && !isAbortSignal(signal)) found.push(finding("signal", "is an AbortSignal"));
  if (log !== undefined && typeof log !== "function") found.push(finding("log", "is a function of one line"));
  const hash = acceptPublicConfigHash;
  if (hash !== undefined && (typeof hash !== "string" || !CONFIG_HASH.test(hash))) {
    found.push(
      finding(
        "acceptPublicConfigHash",
        "is the public configuration hash to accept, 0x and 64 lowercase hex digits, as a start that stopped with " +
          "public-config-changed names it",
      ),
    );
  }
  if (!unread.has("network")) found.push(...networkFindings(values.network));
  return found;
}

/**
 * The refusal of the options' `findings` (none: null): `invalid-configuration`, reason `invalid-option`, the first
 * finding's path as `option`, every finding in `findings`. [L62, LM-10]
 */
export function optionsRefusal(findings: readonly Finding[]): UmbraError | null {
  const [first] = findings;
  if (first === undefined) return null;
  const count = `${findings.length} finding${findings.length === 1 ? "" : "s"}`;
  return new UmbraError(
    "invalid-configuration",
    `the options of startUmbraDB were refused (${count}): ${findings.map((found) => found.message).join("; ")}`,
    { reason: "invalid-option", option: first.path, findings: Object.freeze([...findings]) },
  );
}

/**
 * The refusal of options that give the user modules twice (see the module comment), naming both sources (`given`);
 * null when they give them once or not at all. [LM-7, L44]
 */
export function modulesGivenTwice(values: Readonly<Record<string, unknown>>): UmbraError | null {
  const config = values.config as Readonly<Record<string, unknown>> | undefined;
  const sources = [
    ...(values.modules === undefined ? [] : ["modules"]),
    ...(values.modulesFrom === undefined ? [] : ["modulesFrom"]),
    ...(config !== undefined && "file" in config ? ["config.file"] : []),
  ];
  if (sources.length < 2) return null;
  const by = `${sources.slice(0, -1).join(", ")} and ${sources.at(-1) as string}`;
  return new UmbraError(
    "modules-given-twice",
    `the user modules are given more than once, by ${by}: a { file } configuration gives them by its modules export, ` +
      "{ data } by modules (objects) or modulesFrom (a module file), one of them",
    { given: Object.freeze(sources) },
  );
}

/**
 * The members of a block source the engine takes as its hooks (`../runner/block-source.ts`): a private process's own
 * chain and module checks, the committed height of its reads, the node source's prefetch and its prepared blocks, and
 * its reads at a height. An in-memory chain carries none of them. [LM-8]
 */
export const SOURCE_HOOKS: readonly string[] = Object.freeze([
  "checkChain",
  "committedHeight",
  "checkModules",
  "attach",
  "prepared",
  "fetchRead",
]);

/** A `source-refused` refusal for `reason`, with its message and `extra` details. [LM-8] */
function sourceRefused(reason: string, message: string, extra: Readonly<Record<string, unknown>> = {}): UmbraError {
  return new UmbraError("source-refused", message, { reason, ...extra });
}

/**
 * The refusal of a `source` that is not exactly an `InMemoryBlockSource` carrying no hook (see the module comment);
 * null for none given or for one the process may read. [LM-8, L48]
 */
export function sourceRefusal(source: unknown): UmbraError | null {
  if (source === undefined) return null;
  const exact =
    typeof source === "object" &&
    source !== null &&
    !types.isProxy(source) &&
    Object.getPrototypeOf(source) === InMemoryBlockSource.prototype;
  if (!exact) {
    return sourceRefused(
      "not-in-memory-source",
      "source is read only when it is an InMemoryBlockSource itself, made with new InMemoryBlockSource({ head }): " +
        "not a subclass, a proxy or another object",
    );
  }
  const members = SOURCE_HOOKS.filter((member) => member in source);
  if (members.length === 0) return null;
  return sourceRefused(
    "hook-members",
    `source carries ${members.join(", ")}, which the engine takes as hooks of its block source: give the ` +
      "InMemoryBlockSource without them",
    { members: Object.freeze(members) },
  );
}

/**
 * The refusal of a `source` given to a private process, which reads the blocks of its public side, never an in-memory
 * chain; null on a public process or without one. [LM-8, L48]
 */
export function privateSourceRefusal(side: ProcessSide, source: unknown): UmbraError | null {
  if (source === undefined || side === "public") return null;
  return sourceRefused(
    "private-process",
    "source is a public process's in-memory chain: a private process reads the blocks of its public side; remove it",
  );
}

/** The settings of a `core` revision a library process refuses (see the module comment). [LM-2, BK-1, L47] */
export const LIBRARY_REFUSED_SETTINGS: readonly string[] = Object.freeze(["backupAtStop", "backupOnSignal"]);

/**
 * The refusal of a library process whose `core` revision sets one of {@link LIBRARY_REFUSED_SETTINGS}, naming the first
 * (`setting`) and every one set (`settings`); null when it sets none. [LM-2, BK-1, G3, L47]
 */
export function librarySettingsRefusal(core: CheckedEntry): UmbraError | null {
  const settings = (core.settings ?? {}) as PlainObject;
  const set = LIBRARY_REFUSED_SETTINGS.filter((name) => settings[name] !== undefined);
  const [setting] = set;
  if (setting === undefined) return null;
  return new UmbraError(
    "library-setting-refused",
    `the core revision from ${core.start} sets ${set.join(" and ")}, which only umbradb run writes (at the core's stop, ` +
      "on SIGUSR2): a host program writes its backups with UmbraDBHandle.backup(target); remove the setting",
    { setting, settings: Object.freeze([...set]), entry: core.index },
  );
}
