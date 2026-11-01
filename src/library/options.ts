/**
 * The options of `startUmbraDB` (`./start-umbradb.ts`) held to their shapes. A refusal of them is one of startup's
 * configuration step (class A): `startUmbraDB` never throws for it, the engine refuses with it before anything opens,
 * and `started` rejects with it. [LM-1, LM-3, LM-10; design §4, §5.1, §7.2]
 *
 * **The options' shapes** ({@link optionFindings}): an option of a type it cannot have, an unknown option, and a
 * malformed network request are each a finding at the option's path (`config`, `network.api.port`), and together the
 * refusal `invalid-configuration` with the reason `invalid-option` ({@link optionsRefusal}). [L62]
 *
 * **The settings of the process's `core` revision a library process refuses** ({@link librarySettingsRefusal}):
 * `backupAtStop` and `backupOnSignal`, which write backups at the command's stop and on its SIGUSR2; a host writes its
 * backups with `UmbraDBHandle.backup` instead (`library-setting-refused`, naming the setting). [LM-2, BK-1, G3, L47]
 */

import type { PlainObject } from "../config/plain-data.js";
import type { CheckedEntry, Finding } from "../config/validate.js";
import { UmbraError } from "../db/errors.js";

/** The options `startUmbraDB` knows (design §4). */
export const OPTION_NAMES: readonly string[] = Object.freeze([
  "config",
  "cwd",
  "modules",
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

/** The keys of `object`, or null when listing them threw. */
function keysOf(object: object): readonly string[] | null {
  try {
    return Object.keys(object);
  } catch {
    return null;
  }
}

/** A finding of the options at `path`: its message names the path. [L62] */
const finding = (path: string, message: string): Finding =>
  Object.freeze({ rule: "invalid-option", path, entry: null, field: null, message: `${path}: ${message}` });

/** The options read once: each value, or a finding when reading it threw. */
export interface ReadOptions {
  readonly values: Readonly<Record<string, unknown>>;
  readonly findings: readonly Finding[];
  /** False when the options themselves could not be read (no object, or keys that cannot be listed). */
  readonly readable: boolean;
}

/** Reads every option of `options` once (see {@link readOption}); none of an `options` that is no object. */
export function readOptions(options: unknown): ReadOptions {
  if (!isObject(options)) {
    return { values: {}, findings: [finding("options", "startUmbraDB takes one object of options")], readable: false };
  }
  const keys = keysOf(options);
  if (keys === null) return { values: {}, findings: [finding("options", "its keys cannot be read")], readable: false };
  const values: Record<string, unknown> = {};
  const findings: Finding[] = [];
  for (const key of keys) {
    const read = readOption(options, key);
    if ("thrown" in read) findings.push(finding(key, "reading it threw"));
    else if (read.value !== undefined) values[key] = read.value;
  }
  return { values: Object.freeze(values), findings, readable: true };
}

/** The findings of a `{ host?, port }` address request at `path`. [LM-3, L62] */
function addressFindings(value: Readonly<Record<string, unknown>>, path: string): Finding[] {
  const found: Finding[] = [];
  for (const key of Object.keys(value)) {
    if (key !== "host" && key !== "port") {
      found.push(finding(`${path}.${key}`, "is no key of an address: host and port"));
    }
  }
  const { host, port } = value;
  if (host !== undefined && typeof host !== "string") found.push(finding(`${path}.host`, "a host is a string"));
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
  } else if (hasFile && typeof config.file !== "string" && !(config.file instanceof URL)) {
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
  found.push(...configFindings(values.config));
  const { cwd, modules, signal, log, acceptPublicConfigHash } = values;
  if (cwd !== undefined && typeof cwd !== "string") found.push(finding("cwd", "is a path, a string"));
  if (modules !== undefined && !Array.isArray(modules)) {
    found.push(finding("modules", "is an array of module declarations"));
  }
  if (signal !== undefined && !(signal instanceof AbortSignal)) found.push(finding("signal", "is an AbortSignal"));
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
  found.push(...networkFindings(values.network));
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
