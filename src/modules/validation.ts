/**
 * Declaration validation at startup (`openspec/changes/core-arch/specs/modules/spec.md` MD-1, MD-2; `design.md` §6,
 * §11; decision record Q94): the runner validates every declaration the host gives it before anything else runs, and
 * refuses the first fault, naming the module and the cause.
 *
 * **One validation, typed or not.** A declaration may come from TypeScript, where `defineModule`'s type checked it
 * (`./declaration.ts`), or from JavaScript or a value built at run time, where nothing did. Validation takes `unknown` and refuses
 * everything `ModuleDeclaration`'s type forbids — a missing or misspelled property, a value of the wrong type, a version
 * that is not semver, `deterministic: true` — with `invalid-declaration`, naming the field; so a module built without
 * types is held to the same declaration (A20).
 *
 * **MD-2's causes**, each a rule of {@link DECLARATION_RULES} with its own code, checked in that order over every
 * declaration once their shapes are valid: an id or item name DB-8's pattern does not allow (`bad-id`, the same check
 * as the schema plan's, `src/db/roles.ts`); a user module's id that is `core` — the id of the core's own configuration
 * entries (CF-2) — or starts with `core-` or `on-` (`reserved-prefix`); an id another declaration has (`duplicate-id`
 * — refused here as itself, before the schema plan would call it a schema collision); a module, or a core module, that
 * requires nothing (`no-requirement`; backbone parts may); an item without a lifetime (`item-no-lifetime`); a `table`
 * item without a kind (`table-item-no-kind`); a settings field without a kind (`field-no-kind`, read as
 * `schema.shape[field].meta().kind`, design §7); and a callback under a name that is not a point (`unknown-point`,
 * MD-1). MD-2's last cause, a schema name that collides, is the schema plan's (`planSchemas`, with
 * `shared-item-migrations-differ`), which takes the declarations of one database through `./adapters.ts`; the
 * requirement graph is task 3.2's.
 *
 * **Who declares what.** The set has three lists: UmbraDB's own backbone parts, the core modules it ships, and the
 * host's user modules. Only user modules are refused a reserved prefix, and only backbone parts may require nothing
 * (CORE-ARCH §4.11: `core-chain` and the admin endpoints' parts require no item).
 */

import { CORE_ENTRY_ID } from "../config/entries.js";
import { checkNames } from "../db/roles.js";
import { type ErrorCode, UmbraError } from "../db/errors.js";
import {
  FIELD_KINDS,
  LIFETIMES,
  type ModuleDeclaration,
  POINTS,
  TABLE_KINDS,
} from "./declaration.js";

/** Where a declaration comes from: UmbraDB's backbone, the core modules it ships, or the host program. */
export type DeclarationOrigin = "backbone" | "core" | "user";

/** The declarations of one build, by origin, each list in the order the host gives it. */
export interface DeclarationSet<T = unknown> {
  readonly backbone: readonly T[];
  readonly core: readonly T[];
  readonly user: readonly T[];
}

/** A declaration whose shape is valid, and where it is in its set. */
export interface PlacedDeclaration {
  readonly origin: DeclarationOrigin;
  /** Its index in its origin's list, from 0. */
  readonly index: number;
  readonly declaration: ModuleDeclaration;
}

/** One cause MD-2 or MD-1 names, checked over every declaration of a set. */
export interface DeclarationRule {
  readonly code: ErrorCode;
  /** The first refusal of this cause, in the set's order, or undefined. */
  check(declarations: readonly PlacedDeclaration[]): UmbraError | undefined;
}

const ORIGINS: readonly DeclarationOrigin[] = ["backbone", "core", "user"];

const LABEL: Readonly<Record<DeclarationOrigin, string>> = {
  backbone: "backbone part",
  core: "core module",
  user: "user module",
};

/** The properties of a declaration (`ModuleDeclaration`), of an item, of its table and of a migration. */
const DECLARATION_PROPERTIES = [
  "id",
  "version",
  "side",
  "requires",
  "provides",
  "keyKinds",
  "validateKey",
  "startsMidChain",
  "needsLockstep",
  "developmentOnly",
  "configSchema",
  "migrations",
  "requiresResync",
  "points",
];
const ITEM_PROPERTIES = ["name", "lifetimes", "table"];
const TABLE_PROPERTIES = ["schema", "tables", "kind", "deterministic"];
const MIGRATION_PROPERTIES = ["id", "sql"];

/** semver 2.0.0's grammar (semver.org, "Is there a suggested regular expression"). */
const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/** Two or more names, quoted: `"a", "b" or "c"`. */
const quoted = (names: readonly string[]): string => {
  const words = names.map((name) => JSON.stringify(name));
  return `${words.slice(0, -1).join(", ")} or ${words.at(-1)}`;
};

// ── shapes: what the type forbids ───────────────────────────────────────────────────────────────────────────────────

type Plain = Record<string, unknown>;

const isObject = (value: unknown): value is Plain =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** How a found value reads in a message. */
function shown(value: unknown): string {
  if (value === undefined) return "missing";
  if (value === null) return "null";
  if (Array.isArray(value)) return "a list";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "function") return "a function";
  if (typeof value === "object") return "an object";
  return String(value);
}

/** One declaration's shape check, which knows how to name it in a refusal. */
class Shape {
  readonly module: string | null;

  constructor(
    readonly origin: DeclarationOrigin,
    readonly index: number,
    id: unknown,
  ) {
    this.module = typeof id === "string" ? id : null;
  }

  /** The declaration, as a refusal names it: by its id, or without one by its place. */
  get who(): string {
    return this.module === null
      ? `the ${LABEL[this.origin]} at position ${this.index + 1}`
      : `the ${LABEL[this.origin]} ${this.module}`;
  }

  refuse(field: string, expected: string, message: string): never {
    throw new UmbraError("invalid-declaration", message, {
      module: this.module,
      origin: this.origin,
      index: this.index,
      field,
      expected,
    });
  }

  /** Refuses `field` holding `found` where the declaration has `expected`, with an optional fix. */
  wrong(field: string, found: unknown, expected: string, fix?: string): never {
    const then = fix === undefined ? "" : `; ${fix}`;
    return this.refuse(
      field,
      expected,
      `${this.who}: ${field} is ${shown(found)}, where a module declaration has ${expected} (MD-1)${then}`,
    );
  }

  /** Refuses the first property of `value` (at `path`) that `known` does not name. */
  onlyKnown(value: Plain, path: string, known: readonly string[]): void {
    const unknown = Object.keys(value).find((key) => !known.includes(key));
    if (unknown === undefined) return;
    const field = path === "" ? unknown : `${path}.${unknown}`;
    const where = path === "" ? "a module declaration" : `${path} of a module declaration`;
    this.refuse(
      field,
      `one of ${known.join(", ")}`,
      `${this.who} has the property ${field}, which ${where} does not have (MD-1): its properties are ` +
        `${known.join(", ")}; remove it, or correct its name`,
    );
  }

  string(value: Plain, key: string, path: string): string {
    const found = value[key];
    if (typeof found !== "string") this.wrong(path, found, "a string");
    return found;
  }

  /** A list of strings; `required` false accepts undefined. */
  strings(value: unknown, path: string, required: boolean): string[] | undefined {
    if (value === undefined && !required) return undefined;
    if (!Array.isArray(value)) return this.wrong(path, value, "a list of strings");
    value.forEach((element, index) => {
      if (typeof element !== "string") this.wrong(`${path}[${index}]`, element, "a string");
    });
    return value as string[];
  }

  /** A boolean; `required` false accepts undefined. */
  boolean(value: Plain, key: string, required: boolean): void {
    const found = value[key];
    if (found === undefined && !required) return;
    if (typeof found !== "boolean") this.wrong(key, found, required ? "true or false" : "true, false or nothing");
  }

  /** One of `allowed`. */
  oneOf(found: unknown, path: string, allowed: readonly string[]): void {
    if (!allowed.includes(found as string)) this.wrong(path, found, quoted(allowed));
  }
}

/** True for a zod 4 object schema of the `zod` package (`z.object`, `z.strictObject`, `z.looseObject`). */
function isZodObject(value: unknown): value is { readonly shape: Record<string, unknown> } {
  if (!isObject(value)) return false;
  const internals = value._zod as { readonly def?: { readonly type?: unknown } } | undefined;
  return (
    internals?.def?.type === "object" &&
    typeof value.meta === "function" &&
    typeof value.safeParse === "function" &&
    isObject(value.shape)
  );
}

/** One item's shape; MD-2's own causes (no lifetime, no kind) are left to the rules. */
function checkItem(shape: Shape, item: unknown, at: string, tables: Map<string, string>): string {
  if (!isObject(item)) shape.wrong(at, item, "an item, { name, lifetimes, table? }");
  shape.onlyKnown(item, at, ITEM_PROPERTIES);
  const name = shape.string(item, "name", `${at}.name`);
  const lifetimes = item.lifetimes;
  if (lifetimes !== undefined) {
    if (!Array.isArray(lifetimes)) shape.wrong(`${at}.lifetimes`, lifetimes, `a list of ${quoted(LIFETIMES)}`);
    lifetimes.forEach((lifetime, index) => shape.oneOf(lifetime, `${at}.lifetimes[${index}]`, LIFETIMES));
  }
  const table = item.table;
  if (table === undefined) return name;
  if (!isObject(table)) return shape.wrong(`${at}.table`, table, "a table, { schema, tables, kind, deterministic? }");
  shape.onlyKnown(table, `${at}.table`, TABLE_PROPERTIES);
  const schema = shape.string(table, "schema", `${at}.table.schema`);
  const names = shape.strings(table.tables, `${at}.table.tables`, true) as string[];
  if (table.kind !== undefined) shape.oneOf(table.kind, `${at}.table.kind`, TABLE_KINDS);
  if (table.deterministic !== undefined && table.deterministic !== false) {
    shape.wrong(
      `${at}.table.deterministic`,
      table.deterministic,
      "false, or nothing",
      "tables are deterministic unless declared deterministic: false, so omit it for a deterministic table (Q76)",
    );
  }
  if (Array.isArray(lifetimes) && lifetimes.length > 0 && !lifetimes.includes("table")) {
    shape.refuse(
      `${at}.table`,
      "no table on an item without the lifetime table",
      `${shape.who} declares a table for the item ${name}, which does not have the lifetime table: only a table ` +
        "item has tables (MD-1); add \"table\" to its lifetimes, or remove its table",
    );
  }
  names.forEach((listed, index) => {
    const qualified = `${schema}.${listed}`;
    const other = tables.get(qualified);
    if (other !== undefined && other !== name) {
      shape.refuse(
        `${at}.table.tables[${index}]`,
        "a table no other item of the module lists",
        `${shape.who} lists the table ${qualified} in the items ${other} and ${name}: a table belongs to one item, ` +
          "whose kind and deterministic flag decide how it is kept (MD-1); list it in one item only",
      );
    }
    tables.set(qualified, name);
  });
  return name;
}

/** Checks everything `ModuleDeclaration`'s type says of `value`, except MD-2's own causes (the rules'). */
function checkShape(value: unknown, origin: DeclarationOrigin, index: number): ModuleDeclaration {
  const shape: Shape = new Shape(origin, index, isObject(value) ? value.id : undefined);
  if (!isObject(value)) {
    return shape.refuse(
      "",
      "a module declaration object",
      `${shape.who} is not an object (it is ${shown(value)}): a module is a declaration object, the one its package ` +
        "exports, made with defineModule (MD-1)",
    );
  }
  shape.onlyKnown(value, "", DECLARATION_PROPERTIES);
  shape.string(value, "id", "id");
  const version = value.version;
  if (typeof version !== "string" || !SEMVER.test(version)) {
    shape.wrong("version", version, 'a semver version such as "1.0.0"');
  }
  shape.oneOf(value.side, "side", ["public", "private"]);
  shape.strings(value.requires, "requires", true);

  const provides = value.provides;
  if (!Array.isArray(provides)) shape.wrong("provides", provides, "a list of items");
  const names = new Map<string, number>();
  const tables = new Map<string, string>();
  provides.forEach((item, position) => {
    const at = `provides[${position}]`;
    const name = checkItem(shape, item, at, tables);
    const first = names.get(name);
    if (first !== undefined) {
      shape.refuse(
        `${at}.name`,
        "an item provided once",
        `${shape.who} provides the item ${name} twice (provides[${first}] and ${at}): a module declares each item ` +
          "once, with all its lifetimes (MD-1); merge the two",
      );
    }
    names.set(name, position);
  });

  const keyKinds = shape.strings(value.keyKinds, "keyKinds", false);
  const validateKey = value.validateKey;
  if (validateKey !== undefined && typeof validateKey !== "function") {
    shape.wrong("validateKey", validateKey, "a function, (kind, bytes) => boolean");
  }
  if (keyKinds !== undefined && validateKey === undefined) {
    shape.wrong(
      "validateKey",
      validateKey,
      "a function, (kind, bytes) => boolean",
      "it is required when keyKinds is set: the key registry admits a key of those kinds only if validateKey " +
        "accepts its bytes (PP-8)",
    );
  }
  shape.boolean(value, "startsMidChain", true);
  shape.boolean(value, "needsLockstep", false);
  shape.boolean(value, "developmentOnly", false);
  if (!isZodObject(value.configSchema)) {
    shape.wrong(
      "configSchema",
      value.configSchema,
      "a zod 4 object schema, z.object({ … }), from the zod package",
      "declare the module's settings with z.object, each field with .meta({ kind }) (CF-4)",
    );
  }

  const migrations = value.migrations;
  if (!Array.isArray(migrations)) shape.wrong("migrations", migrations, "a list of migrations, { id, sql }");
  migrations.forEach((migration, position) => {
    const at = `migrations[${position}]`;
    if (!isObject(migration)) shape.wrong(at, migration, "a migration, { id, sql }");
    shape.onlyKnown(migration, at, MIGRATION_PROPERTIES);
    shape.string(migration, "id", `${at}.id`);
    shape.string(migration, "sql", `${at}.sql`);
  });
  shape.boolean(value, "requiresResync", false);

  const points = value.points;
  if (!isObject(points)) return shape.wrong("points", points, "an object of callbacks by point name");
  for (const point of POINTS) {
    const callback = points[point];
    if (callback !== undefined && typeof callback !== "function") {
      shape.wrong(`points[${JSON.stringify(point)}]`, callback, "a function: the point's callback");
    }
  }
  return value as unknown as ModuleDeclaration;
}

// ── MD-2's causes ───────────────────────────────────────────────────────────────────────────────────────────────────

/** The first refusal `check` gives for a declaration of `declarations`, in order. */
function first(
  declarations: readonly PlacedDeclaration[],
  check: (placed: PlacedDeclaration) => UmbraError | undefined,
): UmbraError | undefined {
  for (const placed of declarations) {
    const found = check(placed);
    if (found !== undefined) return found;
  }
  return undefined;
}

/**
 * DB-8's pattern, for every id and item name: the schema plan's own check (`checkNames`), whose refusal this rule
 * returns (anything else it might throw, `validateWith` throws as it is).
 */
const badId: DeclarationRule = {
  code: "bad-id",
  check: (declarations) =>
    first(declarations, ({ declaration }) => {
      try {
        checkNames(declaration);
        return undefined;
      } catch (error) {
        return error as UmbraError;
      }
    }),
};

const PREFIXES = ["core-", "on-"];

/**
 * MD-2: a user module's id that is `core` or starts with `core-` or `on-`. `core` is the id of the core's own entries in
 * the configuration (CF-2), which identifies an entry by its id and start (CF-5): a module with that id could not be
 * told from the core there (docs/issues/00012).
 */
const reservedPrefix: DeclarationRule = {
  code: "reserved-prefix",
  check: (declarations) =>
    first(declarations, ({ origin, declaration: { id } }) => {
      if (origin !== "user") return undefined;
      if (id === CORE_ENTRY_ID) {
        return new UmbraError(
          "reserved-prefix",
          `the user module core has the id "core", which is the id of the core's own configuration entries: the ` +
            "configuration identifies each entry by its id and start, so it could not tell this module's revisions " +
            "from the core's (MD-2, CF-2, CF-5); choose another id",
          { module: id },
        );
      }
      const prefix = PREFIXES.find((candidate) => id.startsWith(candidate));
      if (prefix === undefined) return undefined;
      return new UmbraError(
        "reserved-prefix",
        `the user module ${id} has an id starting with ${JSON.stringify(prefix)}: ids starting with "core-" are ` +
          'UmbraDB\'s own (its backbone parts and core modules), and those starting with "on-" read as point names ' +
          "(MD-2); choose an id without either prefix",
        { module: id, prefix },
      );
    }),
};

/** MD-2: an id another declaration of the set has. */
const duplicateId: DeclarationRule = {
  code: "duplicate-id",
  check: (declarations) => {
    const seen = new Map<string, PlacedDeclaration>();
    return first(declarations, (placed) => {
      const { id } = placed.declaration;
      const earlier = seen.get(id);
      seen.set(id, earlier ?? placed);
      if (earlier === undefined) return undefined;
      return new UmbraError(
        "duplicate-id",
        `the ${LABEL[placed.origin]} ${id} (position ${placed.index + 1}) has the id of the ` +
          `${LABEL[earlier.origin]} at position ${earlier.index + 1}: every module needs an id of its own, since its ` +
          "schema, its database role, its configuration entries and its migrations' records are named after it " +
          "(MD-2, DB-8); rename one of them, or ship the module once",
        {
          module: id,
          first: { origin: earlier.origin, index: earlier.index },
          second: { origin: placed.origin, index: placed.index },
        },
      );
    });
  },
};

/** MD-2: a module, user or core, that requires no item; backbone parts may. */
const noRequirement: DeclarationRule = {
  code: "no-requirement",
  check: (declarations) =>
    first(declarations, ({ origin, declaration: { id, requires } }) => {
      if (origin === "backbone" || requires.length > 0) return undefined;
      return new UmbraError(
        "no-requirement",
        `the ${LABEL[origin]} ${id} requires no item: every module requires at least one item another part provides — ` +
          "the data its own is derived from, which also places it in each point's order (MD-2, MD-3, RN-3); list in " +
          'requires the items it reads, for example "block-header"',
        { module: id },
      );
    }),
};

/** MD-2: an item provided without a lifetime. */
const itemNoLifetime: DeclarationRule = {
  code: "item-no-lifetime",
  check: (declarations) =>
    first(declarations, ({ declaration: { id, provides } }) => {
      const item = provides.find((candidate) => {
        const lifetimes = candidate.lifetimes as readonly unknown[] | undefined;
        return lifetimes === undefined || lifetimes.length === 0;
      });
      if (item === undefined) return undefined;
      return new UmbraError(
        "item-no-lifetime",
        `module ${id} provides the item ${item.name} without a lifetime: every item has one or more — "process" (set ` +
          'once per process), "block" (passed in each block\'s context) or "table" (stored in tables) — which say ' +
          'when and how its consumers get it (MD-1, MD-2); declare them, for example lifetimes: ["block", "table"]',
        { module: id, item: item.name },
      );
    }),
};

/** MD-2: an item with the lifetime `table` whose table has no kind, or that has no table. */
const tableItemNoKind: DeclarationRule = {
  code: "table-item-no-kind",
  check: (declarations) =>
    first(declarations, ({ declaration: { id, provides } }) => {
      const item = provides.find(
        (candidate) =>
          (candidate.lifetimes as unknown[] | undefined)?.includes("table") === true &&
          (candidate.table as { kind?: unknown } | undefined)?.kind === undefined,
      );
      if (item === undefined) return undefined;
      const lead = `module ${id} declares the table item ${item.name} without a kind:`;
      const message =
        item.table === undefined
          ? `${lead} it has the lifetime "table" but no table — no schema, tables or kind (MD-1, MD-2); add table: ` +
            '{ schema, tables, kind: "append-only" or "mutable" }'
          : `${lead} a table item's tables are either only appended to ("append-only") or also changed ` +
            '("mutable") (MD-1, MD-2); add kind: "append-only" or kind: "mutable" to its table';
      return new UmbraError("table-item-no-kind", message, { module: id, item: item.name });
    }),
};

/** MD-2: a settings field whose outermost schema carries no `kind` of CF-4 (design §7). */
const fieldNoKind: DeclarationRule = {
  code: "field-no-kind",
  check: (declarations) =>
    first(declarations, ({ declaration: { id, configSchema } }) => {
      for (const [field, schema] of Object.entries(configSchema.shape)) {
        const meta = schema as { meta?: () => unknown };
        const kind = typeof meta.meta === "function" ? (meta.meta() as { kind?: unknown } | undefined)?.kind : undefined;
        if ((FIELD_KINDS as readonly unknown[]).includes(kind)) continue;
        const has = kind === undefined ? "has no kind" : `has the kind ${JSON.stringify(kind)}, which is none of them`;
        return new UmbraError(
          "field-no-kind",
          `the setting ${JSON.stringify(field)} of module ${id} ${has}: every setting is "data" (recorded in the ` +
            'configuration history), "operational" (not recorded) or "secret" (never shown or logged) (CF-4, MD-2); ' +
            'declare it with .meta({ kind: "data" }) on the field\'s outermost schema — after .default() or ' +
            ".optional(), which hide metadata set before them",
          { module: id, field, kind: kind ?? null },
        );
      }
      return undefined;
    }),
};

/** MD-1: a callback under a name that is not a point. */
const unknownPoint: DeclarationRule = {
  code: "unknown-point",
  check: (declarations) =>
    first(declarations, ({ declaration: { id, points } }) => {
      const point = Object.keys(points).find((name) => !(POINTS as readonly string[]).includes(name));
      if (point === undefined) return undefined;
      return new UmbraError(
        "unknown-point",
        `module ${id} declares a callback under ${JSON.stringify(point)}, which is not a point: the points are ` +
          `${POINTS.join(", ")} (MD-1); move the callback to the point it is meant for`,
        { module: id, point },
      );
    }),
};

/** MD-2's causes (and MD-1's unknown point), in the order they are checked. */
export const DECLARATION_RULES: readonly DeclarationRule[] = Object.freeze([
  badId,
  reservedPrefix,
  duplicateId,
  noRequirement,
  itemNoLifetime,
  tableItemNoKind,
  fieldNoKind,
  unknownPoint,
]);

/**
 * Validates `set` with `rules`: every declaration's shape first, in the set's order (`invalid-declaration`), then each
 * rule over all of them. Throws the first refusal; returns the same declarations, typed, in the same lists.
 */
export function validateWith(
  set: DeclarationSet,
  rules: readonly DeclarationRule[],
): DeclarationSet<ModuleDeclaration> {
  const placed: PlacedDeclaration[] = [];
  for (const origin of ORIGINS) {
    set[origin].forEach((value, index) => placed.push({ origin, index, declaration: checkShape(value, origin, index) }));
  }
  for (const rule of rules) {
    const refusal = rule.check(placed);
    if (refusal !== undefined) throw refusal;
  }
  const of = (origin: DeclarationOrigin) =>
    Object.freeze(placed.filter((entry) => entry.origin === origin).map((entry) => entry.declaration));
  return Object.freeze({ backbone: of("backbone"), core: of("core"), user: of("user") });
}

/**
 * Validates the declarations of a build at startup (MD-1, MD-2): see the module comment. Throws an `UmbraError` (not
 * retryable) naming the module and the cause; returns the same declarations, typed.
 */
export function validateDeclarations(set: DeclarationSet): DeclarationSet<ModuleDeclaration> {
  return validateWith(set, DECLARATION_RULES);
}
