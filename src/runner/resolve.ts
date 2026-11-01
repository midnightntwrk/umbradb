/**
 * The resolver: the one place where a build's declarations and its configuration are assembled, for every caller — the
 * engine (`./process.ts`, which `umbradb run` and the browser demo start through), `umbradb config check`, `umbradb
 * backup` and `umbradb restore` — so that what they accept cannot drift apart. Pure: it reads no file, opens nothing
 * and reads no global `process`, so the browser bundle imports it as it is. Importing a configuration file, or a
 * module list, is the caller's, before it resolves. [LM-1, L56]
 *
 * **The stages**, each usable on its own:
 * - {@link resolveSide}: the process's side, given or taken from the data ({@link inferSide}). [CF-4]
 * - {@link resolveDeclarations}: the command's build for that side (`commandBuild`: UmbraDB's backbone parts and core
 *   modules, then the user modules in their order; a private process's backbone with its private intake), validated
 *   (`validateDeclarations`). A fault names the user module by its position. [MD-1, MD-2, Q106 B]
 * - {@link resolveConfig}: the data held to the plain-data rules (`plainData`), validated with that build
 *   (`validateConfig`), and the process's `core` revision taken (`processCoreEntry`), with the addresses that revision
 *   writes ({@link Surfaces}). [CF-1, CF-2, CF-3, Q102]
 * - {@link resolve}: the declarations, then the configuration, and how the engine reads the chain: the node, or a
 *   private process's public side through its intake.
 *
 * **The failure contract.** Each stage throws the refusal of the step that failed unchanged: the same `UmbraError`,
 * with its code, message and findings. {@link resolve} stops at the first stage that throws. A refusal of
 * {@link resolveConfig} carries the secrets of the configuration as the validation reads them (`configSecrets`), which
 * {@link refusalSecrets} gives, so that the caller redacts what it shows of the refusal: none for data that is not
 * plain data, and none for a refusal of the declarations, which comes before the configuration is read. [AE-6, CF-4]
 */

import { type PrivateIntake, privateIntake } from "../backbone/core-private-source/index.js";
import { commandBuild } from "../cli/build-modules.js";
import type { ProcessSide } from "../config/core-settings.js";
import { CORE_ENTRY_ID } from "../config/entries.js";
import { plainData } from "../config/plain-data.js";
import { processCoreEntry } from "../config/process.js";
import {
  type CheckedConfig,
  type CheckedEntry,
  type ConfigInput,
  configSecrets,
  validateConfig,
} from "../config/validate.js";
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
 * other value. [AE-6, CF-4]
 */
export function refusalSecrets(error: unknown): readonly string[] {
  return (typeof error === "object" && error !== null ? SECRETS.get(error) : undefined) ?? [];
}

const isObject = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * The process's side, from the configuration's data: private when a `core` entry's `config` has `instanceId` and none
 * has `node` (a public process's `core` entry requires `node`, a private one's `instanceId`), and public otherwise. The
 * validation then names a private process's field in a public one's entry as such. [CF-4]
 */
export function inferSide(data: unknown): ProcessSide {
  const entries = isObject(data) && Array.isArray(data.entries) ? (data.entries as readonly unknown[]) : [];
  const configs = entries.flatMap((entry) =>
    isObject(entry) && entry.id === CORE_ENTRY_ID && isObject(entry.config) ? [entry.config] : [],
  );
  const has = (field: string) => configs.some((config) => Object.hasOwn(config, field));
  return has("instanceId") && !has("node") ? "private" : "public";
}

/** The process's side: `side` when given, else the one `data` describes ({@link inferSide}). [CF-4] */
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
 * fault, an `UmbraError` naming the module. [MD-1, MD-2, Q106 B]
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
 * is written. [LM-3, CF-4]
 */
export interface Surfaces {
  /** `listen.api`: the module API. */
  readonly api: string | null;
  /** `listen.admin`: the admin endpoints. */
  readonly admin: string | null;
  /**
   * The private link's side of the process: on the core, the address it listens at (`listen.transport`); on a private
   * process, the core's address it connects to (`coreTransport`). A `listen.transport` written on a private process is
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
  /** The negative controls' choice of the process's `core` revision; `processCoreEntry` unless given. [Q102] */
  readonly processCore?: (config: CheckedConfig) => CheckedEntry;
}

/** What {@link resolveConfig} gives. */
export interface ResolvedConfig {
  /** The validated configuration. [CF-3] */
  readonly checked: CheckedConfig;
  readonly side: ProcessSide;
  /** The process's `core` revision, whose operational and secret fields it runs with (`index`: its place). [Q102] */
  readonly core: CheckedEntry;
  /** The addresses that revision writes, before defaults. */
  readonly surfaces: Surfaces;
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
    privateLink: addressOf(side === "public" ? listen.transport : config.coreTransport),
  });
}

/**
 * The configuration resolved with `input.declarations` (see the module comment). Throws `plainData`'s `not-plain-data`
 * (carrying no secrets: the data is not read as a configuration), `validateConfig`'s `invalid-configuration` with its
 * findings, and the `core` revision's choice's refusal (`no-build-core-revision`), each unchanged and carrying the
 * configuration's secrets ({@link refusalSecrets}). [CF-1, CF-3, Q102, AE-6]
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
 * data describes (or the side given), then {@link resolveConfig}; throws the first stage's refusal unchanged. [LM-1]
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
