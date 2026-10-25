/**
 * Schema validation of the configuration (`openspec/changes/core-arch/specs/configuration/spec.md` CF-3, CF-4, CF-5;
 * `design.md` §7; CORE-ARCH §4.12): every entry of the loaded configuration (`./load.ts`, the plain data CF-1 allows)
 * is validated at startup, because types are gone at run time — its shape, and the settings of every revision whose
 * version is this build's against the schema in this build, with the declared defaults applied and each field
 * classified by its kind (`data`, `operational`, `secret`). Any violation refuses with `invalid-configuration`, naming
 * the entry and the field.
 *
 * **Two steps, because the database is opened in between.** {@link validateConfig} needs only the loaded data, the
 * build's validated declarations (`validateDeclarations`, `../modules/validation.ts`) and the process's side; it gives
 * the `core` entry's settings that open the database (`database`, `developmentOptIn`, `fullPageWritesOffAllowed`).
 * {@link entriesAtCursor} then takes the database's cursor (null on a new database) and completes CF-3's checks of the
 * revisions whose version is not the build's (`versionEntry`): one starting above the cursor is scheduled and carries
 * no `config`; one starting at or below it carries the `config` recorded for it. Comparing those with the recorded
 * history, recording and re-recording are `core-chain`'s (task 4.3); `umbradb config check` without a database runs the
 * first step only (CF-10, task 4.4).
 *
 * **The checks** are rules ({@link CONFIG_RULES}, {@link CURSOR_RULES}), each finding its own violations independently,
 * so that every violation of a configuration is reported at once, top-level ones first, then by entry, each entry's in
 * the rules' order. A path is written as the plain-data check writes it (`entries[1].config.pollMs`), and an entry is
 * named by its position, id and start (CF-5's identity). The shape (CF-3): the default export is `{ entries }` and
 * nothing else; each entry is `{ id, start, stop?, version, config }` with no other property — the builders pass a
 * property they do not know through (`./entries.ts`) to be refused here —, its id `core` or a module of the build
 * (never a backbone part's, which runs with the core), its start and stop heights with `stop ≥ start`, its version a
 * semver string for a module and a core version for `core` (`CORE_VERSION_SCHEMA`), its `config` an object, required
 * for a revision of the build's version; `(id, start)` once; at least one `core` entry, whose earliest start is S; and
 * no string or key holding a lone UTF-16 surrogate (which has no UTF-8 form, so the history could not record or hash it,
 * CF-7: refused here with its path rather than later by the canonical encoding).
 *
 * **The settings** of a revision of the build's version (CF-3, CF-4): no field the schema does not declare — zod 4's
 * `z.object` strips an unknown key, so a misspelled setting would be silently dropped (CF-2's "startup refuses it as
 * well"); the key check against `schema.shape` covers every schema, strict or not, and a field of the other side's
 * `core` entry is named as such —, then the schema's own `safeParse` on the declared fields (duck-typed, never
 * `instanceof`, so a module bundling its own zod 4 copy works), each issue a finding at its path, its message passed
 * through the redaction (a module's custom message may repeat the value it refuses); and the parsed settings must
 * still be plain data (a schema that coerces into a bigint or a `Date` cannot be recorded, CF-7). The `core` entry's
 * schema is CF-4's for the process's side (`./core-settings.ts`); a module's is its declaration's `configSchema`, whose
 * every field carries a kind (MD-2, `field-no-kind`).
 *
 * No message holds a setting's value: findings name paths, fields and types, and every message built from a schema's
 * issue or error is redacted with the secrets of the configuration (`./redact.ts`).
 */

import { UmbraError } from "../db/errors.js";
import { FIELD_KINDS, type FieldKind, type ModuleDeclaration } from "../modules/declaration.js";
import { type DeclarationSet, SEMVER } from "../modules/validation.js";
import { buildCoreVersion, type CoreVersion } from "./build.js";
import { CORE_VERSION_SCHEMA, coreSettingsSchema, type ProcessSide } from "./core-settings.js";
import { CORE_ENTRY_ID } from "./entries.js";
import { pathOf, type PlainData, type PlainObject, plainData, samePlainData } from "./plain-data.js";
import { credentialsIn, redactor, secretStrings } from "./redact.js";

/** What the validation takes. */
export interface ConfigInput {
  /** The loaded configuration (`loadConfig`'s `{ file, data }`), or the browser's bundled data, without a file. */
  readonly config: { readonly file?: string | undefined; readonly data: PlainData };
  /** The build's declarations, validated (`validateDeclarations`): entries name its core and user modules. */
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  /** Whether this is the public (core) process or a private one: which `core` schema applies (CF-4). */
  readonly side: ProcessSide;
}

/** An entry, as a finding names it: its position in `entries`, and its id and start when they are valid. */
export interface EntryRef {
  readonly index: number;
  readonly id: string | null;
  readonly start: number | null;
}

/** One violation. */
export interface Finding {
  /** The rule that found it. */
  readonly rule: string;
  /** Where, from the default export: `entries[1].config.pollMs`; `""` for the default export itself. */
  readonly path: string;
  /** The entry it is in, or null at the top level. */
  readonly entry: EntryRef | null;
  /** The entry's property, or for one in its settings the setting, or null. */
  readonly field: string | null;
  /** The path, the entry and what is wrong; never a setting's value. */
  readonly message: string;
}

/** Each settings field's kind (CF-4). */
export type FieldKinds = Readonly<Record<string, FieldKind>>;

/** A zod 4 issue, as the validation reads it. */
interface Issue {
  readonly code?: string;
  readonly path: readonly PropertyKey[];
  readonly message: string;
  /** For `unrecognized_keys`: the keys. */
  readonly keys?: readonly string[];
}

/** A settings schema, duck-typed (zod 4's object schema, of any copy of zod 4). */
interface SettingsSchema {
  readonly shape: Readonly<Record<string, unknown>>;
  safeParse(
    value: unknown,
  ):
    | { readonly success: true; readonly data: Readonly<Record<string, unknown>> }
    | { readonly success: false; readonly error: { readonly issues: readonly Issue[] } };
}

/** One entry, as the rules see it. */
export interface EntryView {
  readonly index: number;
  /** `entries[i]`. */
  readonly path: string;
  readonly value: PlainData;
  /** The entry, when it is an object. */
  readonly object: PlainObject | null;
  readonly ref: EntryRef;
  /** Its id is `core`. */
  readonly core: boolean;
  /** Its version is this build's: the core version for `core`, the declaration's for a module. */
  readonly buildVersion: boolean;
  /** For a revision of the build's version: the schema its settings are validated against. */
  readonly schema: SettingsSchema | null;
  /** How a message names that schema's owner: "the core entry of a public process", "module stats 1.2.0". */
  readonly owner: string;
}

/** What the rules check. */
export interface ConfigContext {
  readonly data: PlainData;
  readonly side: ProcessSide;
  /** The build's core and user modules, by id. */
  readonly modules: ReadonlyMap<string, ModuleDeclaration>;
  /** The ids of its backbone parts. */
  readonly backbone: ReadonlySet<string>;
  /** Every entry, or null when the configuration has no list of entries. */
  readonly entries: readonly EntryView[] | null;
  /** Redacts the configuration's secrets from a message built from a schema's issue or error. */
  readonly redact: (text: string) => string;
}

/** One check of the configuration: its findings, in order. */
export interface ConfigRule {
  readonly name: string;
  check(context: ConfigContext): readonly Finding[];
}

/** A revision as the validation gives it. */
export interface CheckedEntry {
  /** Its position in `entries`. */
  readonly index: number;
  readonly id: string;
  readonly start: number;
  /** As written; null when absent (the effective stop, CF-5, is task 4.3's). */
  readonly stop: number | null;
  /** A module's semver version, or for `core` the core version. */
  readonly version: string | CoreVersion;
  /** True when the version is this build's: its settings were validated against this build's schema (CF-3). */
  readonly buildVersion: boolean;
  /**
   * The build's version: the parsed settings, every default applied (CF-3). Otherwise the `config` as written — never
   * validated against this build's schema — or null when it has none (a scheduled `versionEntry`).
   */
  readonly settings: PlainObject | null;
  /**
   * The build's version: every field of its schema with its kind (CF-4). Otherwise null: the data recorded for the
   * revision is the only source of its fields' kinds (CF-3).
   */
  readonly kinds: FieldKinds | null;
  /** The build's version: the settings of kind `data` only — what the history records (CF-4, CF-7). Otherwise null. */
  readonly data: PlainObject | null;
}

/** A validated configuration. */
export interface CheckedConfig {
  /** The file it was loaded from, or null. */
  readonly file: string | null;
  readonly side: ProcessSide;
  /** S: the database's start height, the earliest start of a `core` entry (CF-2). */
  readonly start: number;
  /** Every revision, in the file's order. */
  readonly entries: readonly CheckedEntry[];
}

/** A revision placed against the database's cursor. */
export interface PlacedEntry extends CheckedEntry {
  /** It starts at or below the cursor: compared with its recorded row (CF-6, task 4.3). */
  readonly started: boolean;
  /** It starts above the cursor and its version is not the build's: only id, start, stop and version are recorded. */
  readonly scheduled: boolean;
}

/** One check of the revisions against the cursor. */
export interface CursorRule {
  readonly name: string;
  check(config: CheckedConfig, cursor: bigint | null): readonly Finding[];
}

/** An entry's properties (CF-3). */
const ENTRY_PROPERTIES = ["id", "start", "stop", "version", "config"];

/** A lone UTF-16 surrogate: in a `u` expression a well-formed pair is one code point (as `src/determinism/cbor.ts`). */
const LONE_SURROGATE = /\p{Cs}/u;

type Plain = Record<string, PlainData>;

const isObject = (value: unknown): value is Plain =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isHeight = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

/** What a value that is there is, for a message: never the value itself, which may be a secret. */
function described(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "a list";
  if (typeof value === "object") return "an object";
  if (typeof value === "boolean") return "a boolean";
  return `a ${typeof value}`;
}

/** The kind `schema` declares for `field`, or undefined (read leniently: for the redaction of messages). */
function declaredKind(schema: SettingsSchema, field: string): FieldKind | undefined {
  if (!Object.hasOwn(schema.shape, field)) return undefined;
  const meta = (schema.shape[field] as { meta?: () => { kind?: unknown } | undefined }).meta;
  const kind = typeof meta === "function" ? meta.call(schema.shape[field])?.kind : undefined;
  return (FIELD_KINDS as readonly unknown[]).includes(kind) ? (kind as FieldKind) : undefined;
}

/**
 * Every field of `schema` with its kind (CF-4), read as `schema.shape[field].meta().kind` (design §7). Throws an `Error`
 * for a field without one: the declarations the validation takes are validated, which refuses such a schema
 * (`field-no-kind`, MD-2).
 */
export function fieldKinds(schema: { readonly shape: Readonly<Record<string, unknown>> }): FieldKinds {
  const kinds: Record<string, FieldKind> = {};
  for (const field of Object.keys(schema.shape)) {
    const kind = declaredKind(schema as SettingsSchema, field);
    if (kind === undefined) {
      throw new Error(
        `fieldKinds: the setting ${field} has no kind; validateDeclarations refuses a module whose setting has none ` +
          "(field-no-kind, MD-2), and the validation takes validated declarations only",
      );
    }
    kinds[field] = kind;
  }
  return Object.freeze(kinds);
}

/** How a finding names an entry: `stats from 50`, `stats`, or nothing. */
function named(ref: EntryRef): string {
  if (ref.id === null) return "";
  return ref.start === null ? ` (${ref.id})` : ` (${ref.id} from ${ref.start})`;
}

/** A finding at `path` in `view`'s entry (or at the top level), its message prefixed with the path and the entry. */
function finding(rule: string, path: string, view: EntryView | null, field: string | null, detail: string): Finding {
  const where = view === null ? "" : named(view.ref);
  const message = path === "" ? detail : `${path}${where}: ${detail}`;
  return Object.freeze({ rule, path, entry: view?.ref ?? null, field, message });
}

/** A revision's version, for a message: `stats 1.3.0`, or `core with UmbraDB 0.9.4`. */
const revisionText = (entry: CheckedEntry): string =>
  entry.id === CORE_ENTRY_ID
    ? `core with UmbraDB ${(entry.version as CoreVersion).umbradb}`
    : `${entry.id} ${String(entry.version)}`;

/** One entry, read as the rules need it (nothing refused here: the rules do it). */
function viewOf(
  value: PlainData,
  index: number,
  modules: ReadonlyMap<string, ModuleDeclaration>,
  side: ProcessSide,
): EntryView {
  const object = isObject(value) ? value : null;
  const id = typeof object?.id === "string" ? object.id : null;
  const start = isHeight(object?.start) ? object.start : null;
  const core = id === CORE_ENTRY_ID;
  const declaration = id === null || core ? null : (modules.get(id) ?? null);
  const version = object?.version;
  const buildVersion = core
    ? version !== undefined && samePlainData(version, buildCoreVersion())
    : declaration !== null && version === declaration.version;
  const schema: SettingsSchema | null = !buildVersion
    ? null
    : core
      ? (coreSettingsSchema(side) as unknown as SettingsSchema)
      : (declaration?.configSchema as unknown as SettingsSchema);
  const owner = core ? `the core entry of a ${side} process` : `module ${id} ${String(version)}`;
  const ref = Object.freeze({ index, id, start });
  return { index, path: `entries[${index}]`, value, object, ref, core, buildVersion, schema, owner };
}

/** The secret strings of every entry's `config`, to redact from messages built from a schema's issue or error. */
function inputSecrets(entries: readonly EntryView[]): string[] {
  return entries.flatMap(({ object, schema }) => {
    const config = object?.config;
    if (!isObject(config)) return [];
    if (schema === null) return secretStrings(config, Object.fromEntries(Object.keys(config).map((key) => [key, "data"])));
    const kinds: Record<string, FieldKind> = {};
    for (const field of Object.keys(config)) {
      const kind = declaredKind(schema, field);
      if (kind !== undefined) kinds[field] = kind;
    }
    return secretStrings(config, kinds);
  });
}

/** What the rules check, from the validation's input. */
function contextOf(input: ConfigInput): ConfigContext {
  const { data } = input.config;
  const modules = new Map<string, ModuleDeclaration>();
  for (const declaration of [...input.declarations.core, ...input.declarations.user]) modules.set(declaration.id, declaration);
  const list = isObject(data) && Array.isArray(data.entries) ? (data.entries as readonly PlainData[]) : null;
  const entries = list === null ? null : list.map((value, index) => viewOf(value, index, modules, input.side));
  const { text } = redactor(entries === null ? [] : inputSecrets(entries));
  return {
    data,
    side: input.side,
    modules,
    backbone: new Set(input.declarations.backbone.map((declaration) => declaration.id)),
    entries,
    redact: text,
  };
}

/** The entries that are objects. */
const objects = (context: ConfigContext): (EntryView & { readonly object: Plain })[] =>
  (context.entries ?? []).filter((view): view is EntryView & { readonly object: Plain } => view.object !== null);

/** The entries whose settings are validated: their version is the build's and their `config` an object. */
const validated = (context: ConfigContext) =>
  objects(context).flatMap((view) =>
    view.schema !== null && isObject(view.object.config) ? [{ view, schema: view.schema, config: view.object.config }] : [],
  );

/** The entry's settings that its schema declares (the others are `settings-unknown`'s). */
const declared = (schema: SettingsSchema, config: Plain): Plain =>
  Object.fromEntries(Object.entries(config).filter(([key]) => Object.hasOwn(schema.shape, key)));

/** The findings of a schema's issues, each at its path inside the entry's `config`. */
function issueFindings(
  rule: string,
  view: EntryView,
  base: string,
  issues: readonly Issue[],
  redact: (text: string) => string,
  field: (path: readonly PropertyKey[]) => string | null,
): Finding[] {
  return issues.flatMap((issue) => {
    const at = issue.path.reduce<string>((path, key) => pathOf(path, key as string | number | symbol), base);
    const detail = `${redact(issue.message)} (CF-3)`;
    if (issue.code === "unrecognized_keys" && issue.keys !== undefined) {
      return issue.keys.map((key) => finding(rule, pathOf(at, key), view, field([...issue.path, key]), detail));
    }
    return [finding(rule, at, view, field(issue.path), detail)];
  });
}

/** The closest of `known` to `key`, within two edits, ignoring case: a likely misspelling. */
function closest(key: string, known: readonly string[]): string | undefined {
  let best: string | undefined;
  let distance = 3;
  for (const candidate of known) {
    const d = editDistance(key.toLowerCase(), candidate.toLowerCase());
    if (d < distance) {
      best = candidate;
      distance = d;
    }
  }
  return best;
}

/** Levenshtein's distance between `a` and `b`. */
function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const same = a[i - 1] === b[j - 1] ? 0 : 1;
      current.push(Math.min((previous[j] as number) + 1, (current[j - 1] as number) + 1, (previous[j - 1] as number) + same));
    }
    previous = current;
  }
  return previous[b.length] as number;
}

/** The fields of a `core` entry of the other side's process, which this side's has not (CF-4). */
function otherSideOnly(side: ProcessSide): readonly string[] {
  const own = coreSettingsSchema(side).shape;
  const other = coreSettingsSchema(side === "public" ? "private" : "public").shape;
  return Object.keys(other).filter((key) => !Object.hasOwn(own, key));
}

/** How a message names a revision's settings schema. */
const schemaOf = (view: EntryView): string =>
  view.core ? "the core entry's settings schema" : `the settings schema of ${view.ref.id} ${String(view.object?.version)}`;

/** The configuration's checks, in the order their findings are reported within one entry (CF-3, CF-5, CF-7). */
export const CONFIG_RULES: readonly ConfigRule[] = Object.freeze([
  {
    name: "top-level",
    check: (context) => {
      const { data } = context;
      const export_ = "export default defineConfig({ entries: [ … ] })";
      if (!isObject(data)) {
        return [
          finding(
            "top-level",
            "",
            null,
            null,
            `the default export is ${described(data)}, where a configuration is { entries: [ … ] }: ${export_} (CF-1)`,
          ),
        ];
      }
      const findings = Object.keys(data)
        .filter((key) => key !== "entries")
        .map((key) =>
          finding(
            "top-level",
            pathOf("", key),
            null,
            null,
            `the configuration has the property ${key}, where a configuration is { entries: [ … ] } and nothing else ` +
              "(CF-1, CF-3); remove it",
          ),
        );
      if (!Array.isArray(data.entries)) {
        findings.push(
          finding(
            "top-level",
            "entries",
            null,
            null,
            data.entries === undefined
              ? `the configuration has no list of entries: ${export_} (CF-1)`
              : `the configuration's entries is ${described(data.entries)}, where it is a list of entries: ${export_} (CF-1)`,
          ),
        );
      }
      return findings;
    },
  },
  {
    name: "entry-object",
    check: (context) =>
      (context.entries ?? [])
        .filter((view) => view.object === null)
        .map((view) =>
          finding(
            "entry-object",
            view.path,
            view,
            null,
            `the entry is ${described(view.value)}, where an entry is an object { id, start, stop?, version, config }, ` +
              "as coreEntry, a module's entry or versionEntry builds it (CF-3)",
          ),
        ),
  },
  {
    name: "entry-property",
    check: (context) =>
      objects(context).flatMap((view) =>
        Object.keys(view.object)
          .filter((key) => !ENTRY_PROPERTIES.includes(key))
          .map((key) =>
            finding(
              "entry-property",
              pathOf(view.path, key),
              view,
              key,
              `the entry has the property ${key}, which an entry does not have: its properties are id, start, stop, ` +
                "version and config (CF-3); remove it, or correct its name",
            ),
          ),
      ),
  },
  {
    name: "entry-id",
    check: (context) =>
      objects(context).flatMap((view) => {
        const { id } = view.object;
        const at = (detail: string) => [finding("entry-id", `${view.path}.id`, view, "id", detail)];
        if (id === undefined) return at("the entry has no id: an entry's id is core or the id of a module (CF-3)");
        if (typeof id !== "string") return at(`the entry's id is ${described(id)}, where it is core or a module's id (CF-3)`);
        if (id === CORE_ENTRY_ID || context.modules.has(id)) return [];
        if (context.backbone.has(id)) {
          return at(
            `${id} is a backbone part, which runs with the core entry and has no entry of its own (CF-3, design §6); ` +
              "remove this entry",
          );
        }
        const ids = [...context.modules.keys()];
        return at(
          `this build has no module ${id}: an entry's id is core or the id of one of the build's modules ` +
            `(${ids.length === 0 ? "it has none" : ids.join(", ")}) (CF-3)`,
        );
      }),
  },
  {
    name: "entry-start",
    check: (context) =>
      objects(context).flatMap((view) => {
        const { start } = view.object;
        if (isHeight(start)) return [];
        const detail =
          start === undefined
            ? "the entry has no start: the first height its revision covers (CF-3)"
            : `the entry's start is ${described(start)}, where it is a height, an integer from 0 (CF-3)`;
        return [finding("entry-start", `${view.path}.start`, view, "start", detail)];
      }),
  },
  {
    name: "entry-stop",
    check: (context) =>
      objects(context).flatMap((view) => {
        const { start, stop } = view.object;
        if (stop === undefined) return [];
        const at = (detail: string) => [finding("entry-stop", `${view.path}.stop`, view, "stop", detail)];
        if (!isHeight(stop)) return at(`the entry's stop is ${described(stop)}, where it is a height, an integer from 0 (CF-3)`);
        if (!isHeight(start) || stop >= start) return [];
        return at(
          `the entry stops at ${stop}, before its start ${start}: its stop is the last height it covers, at or after ` +
            "its start (CF-3)",
        );
      }),
  },
  {
    name: "entry-version",
    check: (context) =>
      objects(context).flatMap((view) => {
        const { version } = view.object;
        const base = `${view.path}.version`;
        if (version === undefined) {
          return [finding("entry-version", base, view, "version", "the entry has no version (CF-3): its builder fills it")];
        }
        if (view.core) {
          if (!isObject(version)) {
            return [
              finding(
                "entry-version",
                base,
                view,
                "version",
                `the core's version is ${described(version)}, where it is a core version { umbradb, ledgers }, as ` +
                  "coreEntry fills it from the build (CF-2, CF-3)",
              ),
            ];
          }
          const issues = CORE_VERSION_SCHEMA.safeParse(version).error?.issues ?? [];
          return issueFindings("entry-version", view, base, issues as readonly Issue[], context.redact, () => "version");
        }
        if (typeof version === "string" && SEMVER.test(version)) return [];
        const shown = typeof version === "string" ? JSON.stringify(version) : described(version);
        return [
          finding(
            "entry-version",
            base,
            view,
            "version",
            `the entry's version is ${shown}, where a module's version is a semver version such as "1.0.0" (CF-3)`,
          ),
        ];
      }),
  },
  {
    name: "entry-config",
    check: (context) =>
      objects(context).flatMap((view) => {
        const { config } = view.object;
        const at = (detail: string) => [finding("entry-config", `${view.path}.config`, view, "config", detail)];
        if (config === undefined) {
          if (!view.buildVersion) return [];
          const version = view.core
            ? "the core version this build carries"
            : `${view.ref.id} ${String(view.object.version)}, the version this build carries`;
          return at(
            `the entry has no config: a revision of ${version} is validated against this build's schema, so it needs ` +
              "its config (CF-3); only a versionEntry scheduled above the cursor has none",
          );
        }
        if (isObject(config)) return [];
        return at(`the entry's config is ${described(config)}, where it is an object of settings (CF-3)`);
      }),
  },
  {
    name: "duplicate-entry",
    check: (context) => {
      const first = new Map<string, number>();
      return objects(context).flatMap((view) => {
        const { id, start } = view.ref;
        if (id === null || start === null) return [];
        const key = JSON.stringify([id, start]);
        const earlier = first.get(key);
        if (earlier === undefined) {
          first.set(key, view.index);
          return [];
        }
        return [
          finding(
            "duplicate-entry",
            view.path,
            view,
            null,
            `${id} from ${start} is also entries[${earlier}]: the configuration identifies an entry by its id and start, ` +
              "so each appears once (CF-5); remove one, or give it another start",
          ),
        ];
      });
    },
  },
  {
    name: "core-entry",
    check: (context) =>
      context.entries === null || context.entries.some((view) => view.core)
        ? []
        : [
            finding(
              "core-entry",
              "entries",
              null,
              null,
              "the configuration has no core entry: it needs coreEntry({ start, config }), whose start is the " +
                "database's start height S (CF-2, CF-4)",
            ),
          ],
  },
  {
    name: "lone-surrogate",
    check: (context) => {
      const findings: Finding[] = [];
      /** The entry and the field at the place `keys` leads to (the setting, inside an entry's config). */
      const placeOf = (keys: readonly (string | number)[]) => {
        const view = keys[0] === "entries" && typeof keys[1] === "number" ? (context.entries?.[keys[1]] ?? null) : null;
        if (view === null || keys.length < 3) return { view, field: null };
        return { view, field: String(keys[2] === "config" && keys.length > 3 ? keys[3] : keys[2]) };
      };
      const refuse = (path: string, keys: readonly (string | number)[], what: string) => {
        const { view, field } = placeOf(keys);
        findings.push(
          finding(
            "lone-surrogate",
            path,
            view,
            field,
            `the ${what} holds a lone UTF-16 surrogate, which has no UTF-8 form: the history records and hashes the ` +
              "configuration as UTF-8 (CF-7); write it without one",
          ),
        );
      };
      const walk = (value: PlainData, path: string, keys: readonly (string | number)[]) => {
        if (typeof value === "string") {
          if (LONE_SURROGATE.test(value)) refuse(path, keys, "string here");
        } else if (Array.isArray(value)) {
          value.forEach((element, index) => walk(element, pathOf(path, index), [...keys, index]));
        } else if (isObject(value)) {
          for (const [key, inner] of Object.entries(value)) {
            if (LONE_SURROGATE.test(key)) refuse(pathOf(path, key), [...keys, key], "key here");
            walk(inner, pathOf(path, key), [...keys, key]);
          }
        }
      };
      walk(context.data, "", []);
      return findings;
    },
  },
  {
    name: "settings-unknown",
    check: (context) =>
      validated(context).flatMap(({ view, schema, config }) => {
        const known = Object.keys(schema.shape);
        const other = view.core ? otherSideOnly(context.side) : [];
        return Object.keys(config)
          .filter((key) => !Object.hasOwn(schema.shape, key))
          .map((key) => {
            if (other.includes(key)) {
              const theirs = context.side === "public" ? "private" : "public";
              return finding(
                "settings-unknown",
                pathOf(`${view.path}.config`, key),
                view,
                key,
                `${view.owner} has no setting ${key}: ${key} is a ${theirs} process's setting, and this process is ` +
                  `${context.side} (CF-4); remove it`,
              );
            }
            const guess = closest(key, known);
            return finding(
              "settings-unknown",
              pathOf(`${view.path}.config`, key),
              view,
              key,
              `${view.owner} has no setting ${key}${guess === undefined ? "" : ` (did you mean ${guess}?)`}: its ` +
                `settings are ${known.join(", ")} (CF-2, CF-3); remove it, or correct its name`,
            );
          });
      }),
  },
  {
    name: "settings-schema",
    check: (context) =>
      validated(context).flatMap(({ view, schema, config }) => {
        const base = `${view.path}.config`;
        let result: ReturnType<SettingsSchema["safeParse"]>;
        try {
          result = schema.safeParse(declared(schema, config));
        } catch (error) {
          const text = error instanceof Error ? error.message : String(error);
          return [
            finding(
              "settings-schema",
              base,
              view,
              null,
              `${schemaOf(view)} threw: ${context.redact(text)} (CF-3); a settings schema refuses a value with an ` +
                "issue, and parses synchronously",
            ),
          ];
        }
        const issues = result.success ? [] : result.error.issues;
        return issueFindings("settings-schema", view, base, issues, context.redact, (path) =>
          path.length === 0 ? null : String(path[0]),
        );
      }),
  },
  {
    name: "settings-plain",
    check: (context) =>
      validated(context).flatMap(({ view, schema, config }) => {
        let result: ReturnType<SettingsSchema["safeParse"]>;
        try {
          result = schema.safeParse(declared(schema, config));
        } catch {
          return [];
        }
        if (!result.success) return [];
        const base = `${view.path}.config`;
        const detail =
          `${schemaOf(view)} gives a value here that is not plain data: settings are recorded, compared and shown as ` +
          "plain data (CF-1, CF-7), so a schema must not turn a setting into another type, such as a bigint or a Date " +
          "(CF-3)";
        // A zod object schema's output is an object (the declarations are validated: `configSchema` is one).
        return Object.entries(result.data).flatMap(([field, value]) => {
          try {
            plainData(value);
            return [];
          } catch {
            return [finding("settings-plain", pathOf(base, field), view, field, detail)];
          }
        });
      }),
  },
]);

/** The refusal of `findings` in the configuration loaded from `file`. */
function refusal(file: string | null, findings: readonly Finding[]): UmbraError {
  const where = file === null ? "the configuration" : `the configuration ${file}`;
  return new UmbraError(
    "invalid-configuration",
    `${where} is refused (CF-3): ${findings.map((found) => found.message).join("; ")}`,
    { file, reason: "invalid-entries", findings: Object.freeze([...findings]) },
  );
}

/** `findings` of each rule in order, sorted by entry (the top level first), each entry's in the rules' order. */
function ordered(groups: readonly (readonly Finding[])[]): Finding[] {
  const rank = (found: Finding): number => (found.entry === null ? -1 : found.entry.index);
  return groups.flat().sort((a, b) => rank(a) - rank(b));
}

/** The findings of `rules` in `input`'s configuration (the validation's checks, for its negative controls). */
export function configFindings(input: ConfigInput, rules: readonly ConfigRule[] = CONFIG_RULES): Finding[] {
  const context = contextOf(input);
  return ordered(rules.map((rule) => rule.check(context)));
}

/** A revision of a configuration every rule accepted. */
function checkedEntry(view: EntryView): CheckedEntry {
  const object = view.object as Plain;
  const { schema } = view;
  const base = {
    index: view.index,
    id: view.ref.id as string,
    start: view.ref.start as number,
    stop: isHeight(object.stop) ? object.stop : null,
    version: plainData(object.version) as string | CoreVersion,
    buildVersion: view.buildVersion,
  };
  if (schema === null) {
    const settings = object.config === undefined ? null : (plainData(object.config) as PlainObject);
    return Object.freeze({ ...base, settings, kinds: null, data: null });
  }
  // Every rule accepted the configuration, so its schema parses it.
  const parsed = schema.safeParse(declared(schema, object.config as Plain)) as { readonly data: unknown };
  const settings = plainData(parsed.data) as PlainObject;
  const kinds = fieldKinds(schema);
  const data = Object.freeze(Object.fromEntries(Object.entries(settings).filter(([field]) => kinds[field] === "data")));
  return Object.freeze({ ...base, settings, kinds, data });
}

/**
 * Validates the configuration (CF-3, CF-4): see the module comment. Throws `invalid-configuration` (not retryable)
 * with `details { file, reason: "invalid-entries", findings }` when any rule finds a violation; returns every revision,
 * frozen, with its settings, kinds and data fields when its version is the build's.
 */
export function validateConfig(input: ConfigInput): CheckedConfig {
  const context = contextOf(input);
  const file = input.config.file ?? null;
  const findings = ordered(CONFIG_RULES.map((rule) => rule.check(context)));
  if (findings.length > 0) throw refusal(file, findings);
  const entries = (context.entries as readonly EntryView[]).map(checkedEntry);
  const start = Math.min(...entries.filter((entry) => entry.id === CORE_ENTRY_ID).map((entry) => entry.start));
  return Object.freeze({ file, side: input.side, start, entries: Object.freeze(entries) });
}

/** The entry `entry` is, as a finding names it. */
const viewOfChecked = (entry: CheckedEntry): EntryView => ({
  index: entry.index,
  path: `entries[${entry.index}]`,
  value: null,
  object: null,
  ref: Object.freeze({ index: entry.index, id: entry.id, start: entry.start }),
  core: entry.id === CORE_ENTRY_ID,
  buildVersion: entry.buildVersion,
  schema: null,
  owner: "",
});

/** True when `entry` starts at or below `cursor`. */
const startedAt = (entry: CheckedEntry, cursor: bigint | null): boolean => cursor !== null && BigInt(entry.start) <= cursor;

/** How a message names the cursor. */
const cursorText = (cursor: bigint | null): string =>
  cursor === null ? "the cursor (a new database, which has committed nothing)" : `the cursor ${cursor}`;

/** CF-3's checks of the revisions whose version is not the build's, once the cursor is known. */
export const CURSOR_RULES: readonly CursorRule[] = Object.freeze([
  {
    name: "scheduled-config",
    check: (config, cursor) =>
      config.entries
        .filter((entry) => !entry.buildVersion && !startedAt(entry, cursor) && entry.settings !== null)
        .map((entry) =>
          finding(
            "scheduled-config",
            `entries[${entry.index}].config`,
            viewOfChecked(entry),
            "config",
            `${revisionText(entry)} is a version this build does not carry, and the revision starts ` +
              `above ${cursorText(cursor)}: it is scheduled, so only its id, start, stop and version are recorded, and ` +
              "the build that carries its version writes its config (CF-3); remove config from this versionEntry",
          ),
        ),
  },
  {
    name: "earlier-config",
    check: (config, cursor) =>
      config.entries
        .filter((entry) => !entry.buildVersion && startedAt(entry, cursor) && entry.settings === null)
        .map((entry) =>
          finding(
            "earlier-config",
            `entries[${entry.index}].config`,
            viewOfChecked(entry),
            "config",
            `${revisionText(entry)} is a version this build does not carry, and the revision starts ` +
              `at or below ${cursorText(cursor)}: its config must be the data recorded for it, which the history ` +
              "compares it with (CF-3, CF-6); write it as versionEntry({ id, start, version, config }) with that data",
          ),
        ),
  },
]);

/** The findings of `rules` for `config`'s revisions at `cursor` (for the negative controls). */
export function cursorFindings(
  config: CheckedConfig,
  cursor: bigint | null,
  rules: readonly CursorRule[] = CURSOR_RULES,
): Finding[] {
  return ordered(rules.map((rule) => rule.check(config, cursor)));
}

/**
 * CF-3's checks of the `versionEntry` revisions against the database's `cursor` — the last committed height, or null
 * on a new database: throws `invalid-configuration` (as {@link validateConfig}) for a scheduled one carrying a
 * `config` or an earlier one without its recorded `config`; returns every revision placed against the cursor —
 * `started` (to compare with its recorded row, task 4.3) or not, `scheduled` when it is not the build's version and
 * starts above the cursor (recorded with id, start, stop and version only).
 */
export function entriesAtCursor(config: CheckedConfig, cursor: bigint | null): readonly PlacedEntry[] {
  const findings = cursorFindings(config, cursor);
  if (findings.length > 0) throw refusal(config.file, findings);
  return Object.freeze(
    config.entries.map((entry) => {
      const started = startedAt(entry, cursor);
      return Object.freeze({ ...entry, started, scheduled: !started && !entry.buildVersion });
    }),
  );
}
