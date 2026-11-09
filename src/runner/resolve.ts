/**
 * The resolver: the one place where a build's declarations and its configuration are assembled, for every caller — the
 * engine (`./process.ts`, which `umbradb run` and the browser demo start through), `umbradb config check`, `umbradb
 * backup` and `umbradb restore` — so that what they accept cannot drift apart. Pure: it reads no file, opens nothing
 * and reads no global `process`, so the browser bundle imports it as it is. Importing a configuration file, or a
 * module list, is the caller's, before it resolves.
 *
 * **The stages**, each usable on its own:
 * - {@link resolveSide}: the process's side, given or taken from the data ({@link inferSide}).
 * - {@link resolveDeclarations}: the command's build for that side (`commandBuild`: UmbraDB's backbone parts and core
 *   modules, then the user modules in their order; a private process's backbone with its private intake), validated
 *   (`validateDeclarations`). A fault names the user module by its position.
 * - {@link resolveConfig}: the data held to the plain-data rules (`plainData`), validated with that build
 *   (`validateConfig`), and the process's `core` revision taken (`processCoreEntry`), with the addresses that revision
 *   writes ({@link Surfaces}).
 * - {@link resolve}: the declarations, then the configuration, and how the engine reads the chain: the node, or a
 *   private process's public side through its intake.
 *
 * **The network planner** ({@link planNetwork}), which only the engine calls: the network request and the addresses
 * the process's `core` revision writes, combined into the one plan of what listens, what connects and how the private
 * link runs.
 *
 * **The failure contract.** Each stage throws the refusal of the step that failed unchanged: the same `UmbraError`,
 * with its code, message and findings. {@link resolve} stops at the first stage that throws. A refusal of
 * {@link resolveConfig} carries the secrets of the configuration as the validation reads them (`configSecrets`), which
 * {@link refusalSecrets} gives, so that the caller redacts what it shows of the refusal: none for data that is not
 * plain data, and none for a refusal of the declarations, which comes before the configuration is read.
 *
 * **The secrets known before the validation** ({@link knownSecrets}): for what a caller shows of a refusal that comes
 * before the configuration is validated — a module file that cannot be imported, the user modules' own refusal —
 * the secrets of the data as far as they can be told: each entry's by the kinds its module declares, read as the
 * validation reads them; while the user modules are not known (a module file not imported yet), or cannot be read as
 * declarations, every string of an entry whose module the build does not hold (fail closed). Data that is not plain
 * data tells the secrets of what is plain in it.
 */

import { type PrivateIntake, privateIntake } from "../backbone/core-private-source/index.js";
import { commandBuild } from "../cli/build-modules.js";
import { DEFAULT_ADMIN_ADDRESS, type ProcessSide } from "../config/core-settings.js";
import { CORE_ENTRY_ID } from "../config/entries.js";
import { UmbraError } from "../db/errors.js";
import { type PlainData, plainData } from "../config/plain-data.js";
import { secretStrings } from "../config/redact.js";
import { processCoreEntry } from "../config/process.js";
import {
  type CheckedConfig,
  type CheckedEntry,
  type ConfigInput,
  configSecrets,
  validateConfig,
} from "../config/validate.js";
import type { PrivateLinkChannel } from "../library/channels.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import { type DeclarationSet, validateDeclarations } from "../modules/validation.js";

/** The secrets each refusal of {@link resolveConfig} carries (see the module comment). */
const SECRETS = new WeakMap<object, readonly string[]>();

/** Records `secrets` for the refusal `error`; a value thrown that is not an object carries none. */
function carrying(error: unknown, secrets: readonly string[]): unknown {
  if (typeof error === "object" && error !== null && !SECRETS.has(error)) {
    SECRETS.set(error, Object.freeze([...secrets]));
  }
  return error;
}

/**
 * The secrets a refusal of the resolver carries (see the module comment), to redact what is shown of it; none for any
 * other value.
 */
export function refusalSecrets(error: unknown): readonly string[] {
  return (typeof error === "object" && error !== null ? SECRETS.get(error) : undefined) ?? [];
}

const isObject = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** What {@link plainPart} gives for a value the plain-data rules refuse. */
const REFUSED: unique symbol = Symbol("refused");

/** Whether `key` names an element of an array of `length` elements: `"0"` to `String(length - 1)`. */
const isElement = (key: string, length: number): boolean => String(Number(key)) === key && Number(key) < length;

/**
 * What the plain-data rules keep of `value` (`../config/plain-data.ts`), read as they read it — own properties'
 * descriptors, never a getter — with every value they refuse left out: an object's member dropped, an array's element
 * dropped and the others kept in order; {@link REFUSED} for a value refused itself. So data refused at one place still
 * tells the secrets of the rest. Throws what a proxy's trap throws.
 */
function plainPart(value: unknown, open: Set<object>): PlainData | typeof REFUSED {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isSafeInteger(value) && value >= 0 ? value : REFUSED;
  if (typeof value !== "object" || open.has(value)) return REFUSED;
  const array = Array.isArray(value);
  const prototype = Object.getPrototypeOf(value) as object | null;
  if (array ? prototype !== Array.prototype : prototype !== Object.prototype && prototype !== null) return REFUSED;
  open.add(value);
  try {
    const kept: [string, PlainData][] = [];
    const length = array ? ((Object.getOwnPropertyDescriptor(value, "length") as PropertyDescriptor).value as number) : 0;
    for (const key of Object.keys(value)) {
      if (array && !isElement(key, length)) continue;
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (descriptor === undefined || !("value" in descriptor)) continue;
      const inner = plainPart(descriptor.value, open);
      if (inner !== REFUSED) kept.push([key, inner]);
    }
    return array ? kept.map(([, inner]) => inner) : Object.fromEntries(kept);
  } finally {
    open.delete(value);
  }
}

/**
 * The secrets of the configuration `data` before the resolver validated it (see the module comment), its user modules
 * `userModules` as given, or null while they are not known. Data that is not plain data tells the secrets of what is
 * plain in it ({@link plainPart}): its refusal, which comes later, may follow a refusal that quotes one of them (a
 * module file's import error). Never throws: none for data that cannot be read at all (a proxy's trap that throws).
 */
export function knownSecrets(data: unknown, userModules: readonly unknown[] | null): readonly string[] {
  let plain: PlainData;
  try {
    plain = plainData(data);
  } catch {
    try {
      const part = plainPart(data, new Set());
      if (part === REFUSED) return [];
      plain = part;
    } catch {
      return [];
    }
  }
  const side = inferSide(plain);
  const config = { data: plain };
  if (userModules !== null) {
    try {
      // Not validated yet: the validation's reading of secrets takes declarations leniently, and a throw is caught.
      const declarations = commandBuild(userModules, { side }) as DeclarationSet<ModuleDeclaration>;
      return configSecrets({ config, declarations, side });
    } catch {
      // Modules that cannot be read as declarations (their own refusal follows): their entries fail closed below.
    }
  }
  const build = commandBuild([], { side }) as DeclarationSet<ModuleDeclaration>;
  const held = new Set([...build.backbone, ...build.core].map((declaration) => declaration.id));
  const entries = isObject(plain) && Array.isArray(plain.entries) ? (plain.entries as readonly PlainData[]) : [];
  const unknown = entries.flatMap((entry) =>
    isObject(entry) && entry.id !== CORE_ENTRY_ID && !held.has(entry.id as string) && isObject(entry.config)
      ? secretStrings(entry.config as Parameters<typeof secretStrings>[0], {})
      : [],
  );
  return [...configSecrets({ config, declarations: build, side }), ...unknown];
}

/**
 * The process's side, from the configuration's data: private when a `core` entry's `config` has `instanceId` and none
 * has `node` (a public process's `core` entry requires `node`, a private one's `instanceId`), and public otherwise. The
 * validation then names a private process's field in a public one's entry as such.
 */
export function inferSide(data: unknown): ProcessSide {
  const entries = isObject(data) && Array.isArray(data.entries) ? (data.entries as readonly unknown[]) : [];
  const configs = entries.flatMap((entry) =>
    isObject(entry) && entry.id === CORE_ENTRY_ID && isObject(entry.config) ? [entry.config] : [],
  );
  const has = (field: string) => configs.some((config) => Object.hasOwn(config, field));
  return has("instanceId") && !has("node") ? "private" : "public";
}

/** The process's side: `side` when given, else the one `data` describes ({@link inferSide}). */
export function resolveSide(data: unknown, side?: ProcessSide): ProcessSide {
  return side ?? inferSide(data);
}

/** What {@link resolveDeclarations} takes. */
export interface DeclarationsInput {
  /** The user modules, as given: a configuration file's `modules` export, or a host's list. Validated here. */
  readonly userModules: readonly unknown[];
  readonly side: ProcessSide;
  /** A private process's intake, whose `core-private-source` the private backbone carries; a new one unless given. */
  readonly intake?: PrivateIntake;
  /**
   * The tests' build (their backbone, core modules and user modules), not validated, in place of the command's build;
   * `userModules` and `intake` are then not used.
   */
  readonly build?: DeclarationSet;
}

/**
 * The build's declarations for `input.side`, validated (see the module comment). Throws `validateDeclarations`' first
 * fault, an `UmbraError` naming the module.
 */
export function resolveDeclarations(input: DeclarationsInput): DeclarationSet<ModuleDeclaration> {
  const build =
    input.build ??
    commandBuild(input.userModules, {
      side: input.side,
      ...(input.intake === undefined ? {} : { intake: input.intake }),
    });
  return validateDeclarations(build);
}

/**
 * The addresses the process's `core` revision writes for the surfaces of its side, as written: before the schema's
 * defaults (the settings' `listen.admin` is `0.0.0.0:8081` when none is written; here it is null). Null where nothing
 * is written.
 */
export interface Surfaces {
  /** `listen.api`: the module API. */
  readonly api: string | null;
  /** `listen.admin`: the admin endpoints. */
  readonly admin: string | null;
  /**
   * The private link's side of the process: on the core, the address it listens at (`listen.privateLink`); on a private
   * process, the core's address it connects to (`privateLink`). A `listen.privateLink` written on a private process is
   * no surface of it.
   */
  readonly privateLink: string | null;
}

/** What {@link resolveConfig} takes. */
export interface ConfigStageInput {
  /** The configuration's data: a file's evaluated default export (`loadConfig`), or data given. */
  readonly data: unknown;
  /** The file the data came from, which its findings name; null for data given. */
  readonly file: string | null;
  /** The build's validated declarations ({@link resolveDeclarations}). */
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  /** The process's side; the one the data describes unless given ({@link resolveSide}). */
  readonly side?: ProcessSide;
  /** The negative controls' choice of the process's `core` revision; `processCoreEntry` unless given. */
  readonly processCore?: (config: CheckedConfig) => CheckedEntry;
}

/** What {@link resolveConfig} gives. */
export interface ResolvedConfig {
  /** The validated configuration. */
  readonly checked: CheckedConfig;
  readonly side: ProcessSide;
  /** The process's `core` revision, whose operational and secret fields it runs with (`index`: its place). */
  readonly core: CheckedEntry;
  /** The addresses that revision writes, before defaults. */
  readonly surfaces: Surfaces;
}

/**
 * An address a host gives a surface in code: `host` (`127.0.0.1` unless given) and `port` (0 for a free one; the bound
 * address is then the one the system gave).
 */
export interface AddressRequest {
  readonly host?: string;
  readonly port: number;
}

/**
 * A host's network request: for each surface, absent or `false` (no listener: its handlers on the
 * handle; no link), `true` (the address the process's `core` revision writes), an {@link AddressRequest}, or — for the
 * private link — the public side's `{ channels: true }` (the host hands it each channel) and the private side's
 * `{ connect }` (the host opens each channel).
 */
export interface NetworkRequest {
  readonly api?: boolean | AddressRequest;
  readonly admin?: boolean | AddressRequest;
  readonly privateLink?: {
    readonly publicSide?: boolean | AddressRequest | { readonly channels: true };
    readonly privateSide?:
      | boolean
      | AddressRequest
      | { readonly connect: (signal: AbortSignal) => Promise<PrivateLinkChannel> };
  };
}

/** A written address, or null. */
const addressOf = (value: unknown): string | null => (typeof value === "string" ? value : null);

/** The addresses `entries[core.index].config` writes for the surfaces of `side` (see {@link Surfaces}). */
function surfacesOf(data: unknown, core: CheckedEntry, side: ProcessSide): Surfaces {
  const entries = isObject(data) && Array.isArray(data.entries) ? (data.entries as readonly unknown[]) : [];
  const entry = entries[core.index];
  const config = isObject(entry) && isObject(entry.config) ? entry.config : {};
  const listen = isObject(config.listen) ? config.listen : {};
  return Object.freeze({
    api: addressOf(listen.api),
    admin: addressOf(listen.admin),
    privateLink: addressOf(side === "public" ? listen.privateLink : config.privateLink),
  });
}

/**
 * The configuration resolved with `input.declarations` (see the module comment). Throws `plainData`'s `not-plain-data`
 * (carrying no secrets: the data is not read as a configuration), `validateConfig`'s `invalid-configuration` with its
 * findings, and the `core` revision's choice's refusal (`no-build-core-revision`), each unchanged and carrying the
 * configuration's secrets ({@link refusalSecrets}).
 */
export function resolveConfig(input: ConfigStageInput): ResolvedConfig {
  const side = resolveSide(input.data, input.side);
  const data = plainData(input.data, input.file ?? undefined);
  const validation: ConfigInput = {
    config: { ...(input.file === null ? {} : { file: input.file }), data },
    declarations: input.declarations,
    side,
  };
  const secrets = configSecrets(validation);
  try {
    const checked = validateConfig(validation);
    const core = (input.processCore ?? processCoreEntry)(checked);
    return Object.freeze({ checked, side, core, surfaces: surfacesOf(data, core, side) });
  } catch (error) {
    throw carrying(error, secrets);
  }
}

/** How the engine reads the chain: from the node (`core-block-fetch`'s node source), or a private process's intake. */
export type SourceKind = "node" | "private";

/** What {@link resolve} takes. */
export interface ResolveInput {
  /** The configuration's data, loaded or given. */
  readonly data: unknown;
  /** The file it came from, or null. */
  readonly file: string | null;
  /** The user modules, as given (a configuration file's `modules` export, a host's list). */
  readonly userModules: readonly unknown[];
  /** The process's side; the one the data describes unless given. */
  readonly side?: ProcessSide;
  /** The private intake of a private build; a new one unless given (a test's, with its negative-control options). */
  readonly intake?: PrivateIntake;
  /** The tests' build in place of the command's ({@link DeclarationsInput.build}); then no intake is made. */
  readonly declarations?: DeclarationSet;
  /** {@link ConfigStageInput.processCore}. */
  readonly processCore?: (config: CheckedConfig) => CheckedEntry;
}

/** What {@link resolve} gives. */
export interface Resolved extends ResolvedConfig {
  /** The build's validated declarations. */
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  /** A private build's intake, its `core-private-source` in the backbone; null on the core and for a test's build. */
  readonly privateIntake: PrivateIntake | null;
  readonly sourceKind: SourceKind;
}

/**
 * The build and the configuration of a process (see the module comment): {@link resolveDeclarations} for the side the
 * data describes (or the side given), then {@link resolveConfig}; throws the first stage's refusal unchanged.
 */
export function resolve(input: ResolveInput): Resolved {
  const side = resolveSide(input.data, input.side);
  const intake = side === "private" && input.declarations === undefined ? (input.intake ?? privateIntake()) : null;
  const declarations = resolveDeclarations({
    userModules: input.userModules,
    side,
    ...(intake === null ? {} : { intake }),
    ...(input.declarations === undefined ? {} : { build: input.declarations }),
  });
  const config = resolveConfig({
    data: input.data,
    file: input.file,
    declarations,
    side,
    ...(input.processCore === undefined ? {} : { processCore: input.processCore }),
  });
  return Object.freeze({
    ...config,
    declarations,
    privateIntake: intake,
    sourceKind: side === "private" ? ("private" as const) : ("node" as const),
  });
}

/** A surface of a process: the module API, admin, or the process's side of the private link. */
export type Surface = "api" | "admin" | "privateLink";

/**
 * How a surface runs, as `/config`'s `network` names it: `listening` at an address; `connecting` to one (a private
 * process's side of the link); `mounted`, no listener, its handlers the host's to mount; `channels`, the public side of
 * the link over channels the host hands the process; `connect`, the private side over channels the host opens; `none`,
 * no link (and, for the command, which mounts nothing, no listener).
 */
export type SurfaceMode = "listening" | "connecting" | "mounted" | "channels" | "connect" | "none";

/** An address of the plan: its host (an IPv6 address without its brackets), its port, and `host:port` as text. */
export interface PlannedAddress {
  readonly host: string;
  /** 0 for a free port, which the system gives when the listener binds. */
  readonly port: number;
  /** `host:port`, an IPv6 host in brackets: as the listeners and the link take an address. */
  readonly text: string;
}

/** Where the module API or admin listens, or that it does not. */
export type ServicePlan =
  | { readonly mode: "listening"; readonly address: PlannedAddress }
  | { readonly mode: "mounted" | "none" };

/** How the process's side of the private link runs. */
export type LinkPlan =
  | { readonly mode: "listening" | "connecting"; readonly address: PlannedAddress }
  | { readonly mode: "channels" }
  | { readonly mode: "connect"; readonly connect: (signal: AbortSignal) => Promise<PrivateLinkChannel> }
  | { readonly mode: "none" };

/** The network plan: what listens, what connects, and how the private link runs (see {@link planNetwork}). */
export interface NetworkPlan {
  /**
   * Whether it is the command's, made from the addresses the configuration writes (`/config` then shows them as
   * written), not from a host's request.
   */
  readonly configured: boolean;
  readonly api: ServicePlan;
  readonly admin: ServicePlan;
  /** The process's side of the link: the public side on the core, the private side on a private process. */
  readonly privateLink: LinkPlan;
}

/** A rule of the network plan, by the reason its refusal gives (see {@link NETWORK_RULES}). */
export type NetworkRuleName = "both" | "no-address" | "unused" | "wrong-side" | "reader-missing";

/** What a rule found wrong with the request. */
export interface NetworkProblem {
  readonly code: "network-address-conflict" | "private-link-misconfigured";
  readonly reason: NetworkRuleName;
  readonly surface: Surface;
  /** The request's path: `network.api`, `network.privateLink.publicSide`. */
  readonly request: string;
  /** The setting's path in the `core` entry's `config` the problem is about, or null (`wrong-side`). */
  readonly setting: string | null;
  readonly message: string;
}

/** How a surface's request asks for it (see {@link NetworkRequest}). */
type Asked =
  | { readonly kind: "off" }
  | { readonly kind: "written" }
  | { readonly kind: "address"; readonly host: string; readonly port: number }
  | { readonly kind: "channels" }
  | { readonly kind: "connect"; readonly connect: (signal: AbortSignal) => Promise<PrivateLinkChannel> };

/** The host an address given in code listens at unless it names one. */
export const DEFAULT_REQUEST_HOST = "127.0.0.1";

/**
 * How `value`, a surface's request as the library's option check let it through (`../library/options.ts`), asks for
 * the surface: absent and `false` alike are off.
 */
function askedOf(value: unknown): Asked {
  if (value === undefined || value === false) return { kind: "off" };
  if (value === true) return { kind: "written" };
  const request = value as Readonly<Record<string, unknown>>;
  if (request.channels === true) return { kind: "channels" };
  if (typeof request.connect === "function") {
    return { kind: "connect", connect: request.connect as (signal: AbortSignal) => Promise<PrivateLinkChannel> };
  }
  return { kind: "address", host: (request.host as string | undefined) ?? DEFAULT_REQUEST_HOST, port: request.port as number };
}

/** `host:port`, an IPv6 host in brackets: an address as the configuration writes it. */
export function addressText(host: string, port: number): string {
  return `${host.includes(":") ? `[${host}]` : host}:${port}`;
}

/** `host` and `port` as an address of the plan. */
function plannedAddress(host: string, port: number): PlannedAddress {
  return Object.freeze({ host, port, text: addressText(host, port) });
}

/** A written address (`host:port`, which the schema checked) as an address of the plan; its text as written. */
function writtenAddress(text: string): PlannedAddress {
  const colon = text.lastIndexOf(":");
  const host = text.slice(0, colon);
  return Object.freeze({ host: host.startsWith("[") ? host.slice(1, -1) : host, port: Number(text.slice(colon + 1)), text });
}

/** One surface of the process's side as the rules judge it: its request, as asked, and its address, as written. */
interface SurfaceRequest {
  readonly surface: Surface;
  /** The request's path (`network.api`). */
  readonly request: string;
  /** The setting that writes its address (`listen.api`; on a private process the link's is `privateLink`). */
  readonly setting: string;
  readonly asked: Asked;
  readonly written: string | null;
}

/** What the rules judge: the process's side and its surfaces, the other side's request, its reader login. */
export interface NetworkContext {
  readonly side: ProcessSide;
  /** The process's `core` revision's start, which the messages name. */
  readonly start: number;
  /** The module API, admin and the process's side of the link, in that order. */
  readonly surfaces: readonly SurfaceRequest[];
  /** The other side's request of the link: its path, and whether it asks anything (absent and `false` do not). */
  readonly otherSide: { readonly request: string; readonly asks: boolean };
  /** Whether the process's database is PostgreSQL. */
  readonly postgres: boolean;
  /** Whether its `core` revision gives `transportReader`. */
  readonly reader: boolean;
}

/** A rule of the network plan: the problems it finds in a request. */
export interface NetworkRule {
  readonly name: NetworkRuleName;
  check(context: NetworkContext): readonly NetworkProblem[];
}

/** A rule named `name` checking with `check`. */
const rule = (name: NetworkRuleName, check: (context: NetworkContext) => readonly NetworkProblem[]): NetworkRule =>
  Object.freeze({ name, check });

const ADDRESS_CONFLICT = "network-address-conflict" as const;
const LINK_MISCONFIGURED = "private-link-misconfigured" as const;

/** How a request that does not use a written address asks for its surface, as a message says it. */
const notUsedAs = (asked: Asked): string =>
  asked.kind === "channels"
    ? "asks for it over channels ({ channels: true })"
    : asked.kind === "connect"
      ? "asks for it over channels ({ connect })"
      : "does not ask for it";

/**
 * The rules of the network plan, in the order their problems are listed:
 * - `both`: an address both written in the process's `core` revision and given in code (`network-address-conflict`);
 * - `no-address`: `true`, the written address, with none written;
 * - `unused`: an address written for a surface of the process's side that the request does not use as an address —
 *   not asked for, or asked for over channels;
 * - `wrong-side`: a request of the other side's link (`private-link-misconfigured`);
 * - `reader-missing`: on PostgreSQL, the public side of the link given in the request (`{ channels: true }`, or an
 *   address in code) with no `transportReader`, the login that may only read which the link's reads run as; with a
 *   written `listen.privateLink` the schema requires it.
 *
 * A `listen.privateLink` written on a private process is no surface of it, so no rule judges it.
 */
export const NETWORK_RULES: readonly NetworkRule[] = Object.freeze([
  rule("both", (context) =>
      context.surfaces.flatMap((one): NetworkProblem[] =>
        one.asked.kind === "address" && one.written !== null
          ? [
              {
                code: ADDRESS_CONFLICT,
                reason: "both",
                surface: one.surface,
                request: one.request,
                setting: one.setting,
                message:
                  `${one.request} gives an address in code, and the core revision from ${context.start} writes ` +
                  `${one.setting}: an address has one source, so request ${one.request}: true to use ${one.setting}, ` +
                  `or remove ${one.setting}`,
              },
            ]
          : [],
      ),
  ),
  rule("no-address", (context) =>
      context.surfaces.flatMap((one): NetworkProblem[] =>
        one.asked.kind === "written" && one.written === null
          ? [
              {
                code: ADDRESS_CONFLICT,
                reason: "no-address",
                surface: one.surface,
                request: one.request,
                setting: one.setting,
                message:
                  `${one.request} is true, the address the core revision from ${context.start} writes as ` +
                  `${one.setting}, and it writes none: write ${one.setting}, or give ${one.request} { host, port }`,
              },
            ]
          : [],
      ),
  ),
  rule("unused", (context) =>
      context.surfaces.flatMap((one): NetworkProblem[] =>
        one.written !== null && one.asked.kind !== "written" && one.asked.kind !== "address"
          ? [
              {
                code: ADDRESS_CONFLICT,
                reason: "unused",
                surface: one.surface,
                request: one.request,
                setting: one.setting,
                message:
                  `the core revision from ${context.start} writes ${one.setting}, and ${one.request} ` +
                  `${notUsedAs(one.asked)} at an address: request ${one.request}: true to use it, or remove ` +
                  one.setting,
              },
            ]
          : [],
      ),
  ),
  rule("wrong-side", (context) =>
      context.otherSide.asks
        ? [
            {
              code: LINK_MISCONFIGURED,
              reason: "wrong-side",
              surface: "privateLink",
              request: context.otherSide.request,
              setting: null,
              message:
                `${context.otherSide.request} is the other side's request of the private link, and this process is ` +
                `${context.side}: give it network.privateLink.${context.side === "public" ? "publicSide" : "privateSide"}`,
            },
          ]
        : [],
  ),
  rule("reader-missing", (context) =>
      context.side === "public" && context.postgres && !context.reader
        ? context.surfaces.flatMap((one): NetworkProblem[] =>
            one.surface === "privateLink" && (one.asked.kind === "channels" || one.asked.kind === "address")
              ? [
                  {
                    code: LINK_MISCONFIGURED,
                    reason: "reader-missing",
                    surface: "privateLink",
                    request: one.request,
                    setting: "transportReader",
                    message:
                      `${one.request} gives the private link in the request, and the process's PostgreSQL database ` +
                      "needs transportReader { user, password } for it, a login that may only read, which the " +
                      "link's reads run as",
                  },
                ]
              : [],
          )
        : [],
  ),
]);

/** The plan of the network, or the refusal of the request (see {@link planNetwork}). */
export type PlannedNetwork =
  | { readonly plan: NetworkPlan; readonly refusal: null }
  | { readonly plan: null; readonly refusal: UmbraError };

/** What {@link planNetwork} reads of the resolved configuration: the side, the process's revision, its addresses. */
export type NetworkInput = Pick<ResolvedConfig, "side" | "core" | "surfaces">;

/**
 * The command's plan (`"configured"`): each surface of the side listens or connects at its address when one is written,
 * and admin listens at its default, `0.0.0.0:8081`, when none is. A `listen.privateLink` written on a private process
 * is no surface of it. No rule can refuse it.
 */
function configuredPlan({ side, surfaces }: NetworkInput): NetworkPlan {
  const link = surfaces.privateLink;
  return Object.freeze({
    configured: true,
    api: surfaces.api === null ? { mode: "none" as const } : { mode: "listening" as const, address: writtenAddress(surfaces.api) },
    admin: { mode: "listening" as const, address: writtenAddress(surfaces.admin ?? DEFAULT_ADMIN_ADDRESS) },
    privateLink:
      link === null
        ? { mode: "none" as const }
        : { mode: side === "public" ? ("listening" as const) : ("connecting" as const), address: writtenAddress(link) },
  });
}

/** Where `one` listens or connects as its request asks: the written address, the one given in code, or none. */
function addressAsked(one: SurfaceRequest): PlannedAddress | null {
  if (one.asked.kind === "written") return one.written === null ? null : writtenAddress(one.written);
  if (one.asked.kind === "address") return plannedAddress(one.asked.host, one.asked.port);
  return null;
}

/**
 * The network plan of a process: its network request combined with the addresses its `core` revision
 * writes (`resolve().surfaces`, before the schema's defaults). The engine opens what the plan says, and every decision
 * of the link keys on it: the public side's reader login, the private side's link, lockstep on both sides.
 *
 * - `"configured"`, the command's request, is the written addresses plus admin's default ({@link configuredPlan}).
 * - A host's request: each surface off unless asked — the module API and admin then `mounted`, the link `none`;
 *   `true` at the written address; `{ host?, port }` there, `host` {@link DEFAULT_REQUEST_HOST} unless given; the link
 *   `{ channels: true }` or `{ connect }`. Its {@link NETWORK_RULES} (`rules`: all unless a negative control removes
 *   one) refuse what it gets wrong, with every problem in the refusal's `details.problems` and the first one's code,
 *   reason and paths as its own; the plan of a request a removed rule let through follows the same reading (an address
 *   given in code wins, `true` with none written listens nowhere, another side's request is not read).
 *
 * Settings that cannot take effect are accepted, as the configuration accepts them: a `transportReader` with no link,
 * lockstep with no link, a `tls` with no link.
 */
export function planNetwork(
  input: NetworkInput,
  request: "configured" | NetworkRequest,
  rules: readonly NetworkRule[] = NETWORK_RULES,
): PlannedNetwork {
  if (request === "configured") return Object.freeze({ plan: configuredPlan(input), refusal: null });
  const { side, core, surfaces } = input;
  const settings = (core.settings ?? {}) as Readonly<Record<string, unknown>>;
  const link = request.privateLink ?? {};
  const own = side === "public" ? "publicSide" : "privateSide";
  const other = side === "public" ? "privateSide" : "publicSide";
  const asked: readonly SurfaceRequest[] = [
    { surface: "api", request: "network.api", setting: "listen.api", asked: askedOf(request.api), written: surfaces.api },
    { surface: "admin", request: "network.admin", setting: "listen.admin", asked: askedOf(request.admin), written: surfaces.admin },
    {
      surface: "privateLink",
      request: `network.privateLink.${own}`,
      setting: side === "public" ? "listen.privateLink" : "privateLink",
      asked: askedOf(link[own]),
      written: surfaces.privateLink,
    },
  ];
  const database = settings.database as { readonly kind?: unknown } | undefined;
  const context: NetworkContext = {
    side,
    start: core.start,
    surfaces: asked,
    otherSide: { request: `network.privateLink.${other}`, asks: askedOf(link[other]).kind !== "off" },
    postgres: database?.kind === "postgres",
    reader: settings.transportReader !== undefined,
  };
  const problems = rules.flatMap((rule) => rule.check(context));
  const [first] = problems;
  if (first !== undefined) return Object.freeze({ plan: null, refusal: networkRefusal(first, problems) });
  const [api, admin, linkSide] = asked as [SurfaceRequest, SurfaceRequest, SurfaceRequest];
  const service = (one: SurfaceRequest): ServicePlan => {
    const address = addressAsked(one);
    return address === null ? { mode: "mounted" } : { mode: "listening", address };
  };
  const linkAddress = addressAsked(linkSide);
  const privateLink: LinkPlan =
    linkSide.asked.kind === "channels"
      ? { mode: "channels" }
      : linkSide.asked.kind === "connect"
        ? { mode: "connect", connect: linkSide.asked.connect }
        : linkAddress === null
          ? { mode: "none" }
          : { mode: side === "public" ? "listening" : "connecting", address: linkAddress };
  return Object.freeze({
    plan: Object.freeze({ configured: false, api: service(api), admin: service(admin), privateLink }),
    refusal: null,
  });
}

/** The refusal of a request with `problems` (see {@link planNetwork}): the first one's code, every one listed. */
function networkRefusal(first: NetworkProblem, problems: readonly NetworkProblem[]): UmbraError {
  const count = `${problems.length} problem${problems.length === 1 ? "" : "s"}`;
  return new UmbraError(first.code, `the network request was refused (${count}): ${problems.map((one) => one.message).join("; ")}`, {
    reason: first.reason,
    surface: first.surface,
    request: first.request,
    setting: first.setting,
    problems: Object.freeze(
      problems.map((one) =>
        Object.freeze({ code: one.code, reason: one.reason, surface: one.surface, request: one.request, setting: one.setting }),
      ),
    ),
  });
}
