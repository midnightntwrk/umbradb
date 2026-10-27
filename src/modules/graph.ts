/**
 * The requirement graph per height range (`openspec/changes/core-arch/specs/modules/spec.md` MD-3, MD-4, MD-5, MD-6;
 * `specs/runner/spec.md` RN-3; `design.md` §6, §11; decision record Q95–Q97): at startup, after declaration validation
 * (`./validation.ts`), the runner resolves which part provides each required item at each height, refuses a graph MD-3
 * to MD-6 do not allow, and orders the parts for each point.
 *
 * **The input** ({@link GraphInput}) is what the configuration says of the build's validated declarations: S, the
 * height range of every revision of every module entry, and the development opt-in; and the database's cursor, its last
 * committed height (null on a new database). Backbone parts run with the core: from S, with no stop — the core's `stop`
 * is operational (CF-4) and ends processing for every part, so it bounds no item's availability. A module is *enabled*
 * when it has an entry; the build's other modules take no part.
 *
 * **Ranges.** Heights are split at S, at every revision's start and after every revision's stop; each
 * {@link HeightRange} is closed, `from` to `to` (`to` null: no end), as entries are (`start ≤ h ≤ stop`, RN-7), so
 * within a range the active parts do not change. Two providers are *adjacent* when one's last height + 1 is the other's
 * first, and *overlap* when they share a height (MD-6). A module's revisions continue each other when one's stop + 1 is
 * the next's start (CF-5: no mid-chain start); after a gap, the next revision starts the module again.
 *
 * **Refusals** ({@link GRAPH_RULES}, in order; each names its range, module and item, the range merged over
 * consecutive ranges with the same fault): a development-only module without the opt-in (MD-5,
 * `development-opt-in-required`); two providers of one item at a common height (MD-3, MD-6, `providers-overlap`); a
 * required item no enabled module provides (`item-no-provider`), or none at heights where its module runs
 * (`item-not-available`: "a module's [start, stop] is not covered by the availability of every item it requires");
 * a cycle in a range's graph, or one only the union of the ranges has, which leaves startup no order (`graph-cycle`,
 * Q95); a module that starts above 0 (genesis) — at an S above 0 too (Q96) — without promising it can, or whose
 * provider there, not active at the height before, does not (`cannot-start-mid-chain`, MD-4, Q98).
 *
 * **What is checked (Q97)** is what this build will run, as a build carries one version of each module (Q43): every
 * range that holds a height above the cursor, whole; the range that ends at the cursor only for a cycle, since RN-11
 * re-delivers the cursor's `on-after-db-write` and `on-stop-height` there in RN-3's order; the starts above the cursor;
 * the development-only modules active at the cursor or later. On a new database that is everything from S. A fault only
 * heights at or below the cursor have was judged by the builds that processed them — but Q95's union of every range's
 * requirements, past ranges included, orders startup, so a cycle in it is refused wherever it lies.
 *
 * **Order (RN-3).** In each range: the backbone parts present in the fixed order {@link BACKBONE_ORDER}, then the other
 * active modules by Kahn's algorithm, the ready module whose id is smallest in UTF-8 bytes ({@link utf8Order}) first;
 * at `on-db-write` `core-digest` runs last. Startup — each part's migrations and `on-start-db` (DB-9) — runs every part
 * of the database in one order: the backbone, then Kahn over the union of every range's requirements (Q95).
 *
 * **A private process's public items** (PP-13, owner decision Q126 B, task 14.1a; `design.md` §8): its input may carry
 * the public core's `table` items with their heights ({@link PublicItem}, read from the public database's
 * configuration history). In each range a public item active at the range's first height counts as provided for MD-3's
 * coverage (`item-no-provider` when neither a part of this build nor a public module provides it at any height,
 * `item-not-available` when they do only at other heights), and the ranges are split at the public items' starts and
 * after their stops as at entries'. A public item named like an item of this build's backbone is the backbone's — the
 * private backbone's `core-chain` and `core-digest` provide `chain-identity` and the digests over its own database — and
 * is not counted; a module providing an item a public module provides at a common height is `providers-overlap`
 * (MD-6). Public providers are not parts: they take no part in the order, the segments, `providerOf`, the cycles or
 * MD-4 (the public core judged its own starts). Without public items (a public process) nothing of this applies.
 *
 * Pure: no database, no runner. The caller's own errors — an entry for a module the build does not have, revisions of
 * one module that overlap, a backbone part this order has no place for, a public item that stops before it starts —
 * are thrown as `Error`s, not refused.
 */

import { type ErrorCode, UmbraError } from "../db/errors.js";
import type { ModuleDeclaration } from "./declaration.js";
import type { DeclarationOrigin, DeclarationSet } from "./validation.js";

/**
 * The backbone parts' fixed order (RN-3; CORE-ARCH §4.2, §4.11): the core process's, then the private process's, then
 * `core-digest` — before every module at startup, so its tables exist while modules migrate (Q95), and last at
 * `on-db-write` — then the admin endpoints' parts, which have no points (Q70).
 */
export const BACKBONE_ORDER: readonly string[] = Object.freeze([
  "core-chain",
  "core-block-fetch",
  "core-block-commit",
  "core-private-source",
  "core-key-registry",
  "core-digest",
  "core-health",
  "core-status",
  "core-config",
]);

/** The backbone part that runs last at `on-db-write` (RN-3). */
const LAST_AT_DB_WRITE = "core-digest";

/** Heights `from` to `to`, both included; `to` null for no end. */
export interface HeightRange {
  readonly from: bigint;
  readonly to: bigint | null;
}

/** One revision of a module entry: its id, start and effective last height (null for none) (CF-5, RN-7). */
export interface EntryRange {
  readonly id: string;
  readonly start: bigint;
  readonly stop: bigint | null;
}

/**
 * A `table` item of the public core at a private process (PP-13): its name, the public entry providing it — a public
 * module's id, or `core` for the public backbone's —, and its heights, `start` to its last height `stop` (CF-5's
 * effective stop; null for none), as the public database's configuration history records them (task 14.1a).
 */
export interface PublicItem {
  readonly item: string;
  readonly provider: string;
  readonly start: bigint;
  readonly stop: bigint | null;
}

/** What the resolution takes (see the module comment). */
export interface GraphInput {
  /** The build's declarations, validated (`validateDeclarations`): the same objects, ids unique across the lists. */
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  /** S: the database's start height, the first `core` entry's start. */
  readonly start: bigint;
  /** Every revision of every module entry — never the `core` entry's — with its effective stop (task 4.3). */
  readonly entries: readonly EntryRange[];
  /** The `core` entry's `developmentOptIn` (CF-4, CF-9). */
  readonly developmentOptIn: boolean;
  /**
   * The database's cursor — the last committed height, read from the `blocks` table after the database is opened — or
   * null on a new database, which has committed nothing (Q97). The first commit is at S, so a cursor is at least S.
   */
  readonly cursor: bigint | null;
  /**
   * A private process's public `table` items (PP-13; see the module comment), counted as provided where they run; none
   * for a public process (absent).
   */
  readonly publicItems?: readonly PublicItem[];
}

/** What runs in one range. */
export interface ResolvedRange {
  readonly range: HeightRange;
  /** The parts active in the range, in RN-3's order at every point but `on-db-write`. */
  readonly order: readonly ModuleDeclaration[];
  /** The same parts in `on-db-write`'s order: `core-digest` last. */
  readonly writeOrder: readonly ModuleDeclaration[];
  /**
   * Each item exactly one active part provides, and that part's id. In a range that ends at the cursor, whose
   * providers are not checked (Q97), an item several parts provide is left out: nothing there reads a provider's
   * `block` items, as RN-11's re-delivery has none; in every later range `providers-overlap` refuses such an item.
   */
  readonly providerOf: ReadonlyMap<string, string>;
  /**
   * A private process's public items in the range (PP-13, task 14.1a): the items a public module provides at the range's
   * heights and no part does. A part requiring one waits for no part: the public core committed it before the private
   * process reads its height. Absent on a public process.
   */
  readonly publicItems?: ReadonlySet<string>;
}

/** The resolved graph of one database. */
export interface ResolvedGraph {
  /** S. */
  readonly start: bigint;
  /**
   * Every part of the database — the backbone and every enabled module, whose revisions may all have ended (DB-9 keeps
   * every module whose migrations ran) — in startup order (Q95): `startDatabase`'s parts and the schema plan's modules.
   */
  readonly modules: readonly ModuleDeclaration[];
  /** Where each part of `modules` is active: its revisions merged where they continue each other, from S. */
  readonly segments: ReadonlyMap<string, readonly HeightRange[]>;
  /**
   * The ranges this process may run, in height order: the one holding the cursor — RN-11 re-delivers there — and every
   * later one (on a new database, every range from S); the last has no end. The ranges that end below the cursor are
   * left out: nothing runs there again, and startup does not check them (Q97).
   */
  readonly ranges: readonly ResolvedRange[];
  /** The range of `ranges` holding `height`; undefined below the first of them (below S, or below the cursor's). */
  rangeAt(height: bigint): ResolvedRange | undefined;
}

/** An enabled part: its declaration, where it comes from, and where it is active. */
export interface GraphPart {
  readonly declaration: ModuleDeclaration;
  readonly origin: DeclarationOrigin;
  readonly segments: readonly HeightRange[];
}

/**
 * What startup checks in a range (Q97): `whole` — it holds a height above the cursor (on a new database, every range),
 * so every rule applies; `cycle` — it ends at the cursor, where RN-11 re-delivers the cursor's `on-after-db-write` and
 * `on-stop-height` in RN-3's order, so only that its graph has no cycle; `none` — it ends below the cursor.
 */
export type RangeCheck = "whole" | "cycle" | "none";

/** One range and what is active in it. */
export interface RangeFacts {
  readonly range: HeightRange;
  /** What startup checks in it. */
  readonly check: RangeCheck;
  /** The active parts, in the order of {@link GraphFacts.parts}. */
  readonly active: readonly GraphPart[];
  /** Each item, and the active parts that provide it. */
  readonly providers: ReadonlyMap<string, readonly GraphPart[]>;
  /** Each public item active at the range's first height, and its public providers there, by UTF-8 id (PP-13). */
  readonly publicProviders: ReadonlyMap<string, readonly string[]>;
}

/** What the rules check. */
export interface GraphFacts {
  readonly start: bigint;
  readonly developmentOptIn: boolean;
  /** The last committed height, or null on a new database. */
  readonly cursor: bigint | null;
  /** The enabled parts: the backbone in its fixed order, then core and user modules with an entry, as given. */
  readonly parts: readonly GraphPart[];
  /** Every declaration of the build, enabled or not. */
  readonly built: readonly ModuleDeclaration[];
  /** The ranges from S on, every one: those ending below the cursor too, for Q95's union. */
  readonly ranges: readonly RangeFacts[];
  /** Whether the input carried public items (a private process, PP-13). */
  readonly hasPublic: boolean;
  /** The public items counted (those named like a backbone item left out), at every height, below S too. */
  readonly publicItems: readonly PublicItem[];
}

/** One refusal cause of MD-3 to MD-6, checked over the whole graph. */
export interface GraphRule {
  readonly code: ErrorCode;
  /** The first refusal of this cause, or undefined. */
  check(facts: GraphFacts): UmbraError | undefined;
}

// ── names and words ─────────────────────────────────────────────────────────────────────────────────────────────────

const encoder = new TextEncoder();

/** Compares two ids by their UTF-8 bytes (RN-3): neither the locale nor the order they were given in decides. */
export function utf8Order(a: string, b: string): number {
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  const length = Math.min(x.length, y.length);
  for (let index = 0; index < length; index++) {
    const difference = (x[index] as number) - (y[index] as number);
    if (difference !== 0) return difference;
  }
  return x.length - y.length;
}

const sorted = (names: Iterable<string>): string[] => [...names].sort(utf8Order);

/** `a`, `a and b`, `a, b and c`. */
function listed(names: readonly string[]): string {
  return names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

/** A range in words: `10–19`, or `from 20 on`. */
function span(range: HeightRange): string {
  return range.to === null ? `from ${range.from} on` : `${range.from}–${range.to}`;
}

const frozenRange = (from: bigint, to: bigint | null): HeightRange => Object.freeze({ from, to });

/** Heights in ascending order. */
const byHeight = (a: bigint, b: bigint): number => (a < b ? -1 : a > b ? 1 : 0);

const contains = (range: HeightRange, height: bigint): boolean =>
  range.from <= height && (range.to === null || height <= range.to);

/** What startup checks in `range` given the cursor (see {@link RangeCheck}). */
function checkOf(range: HeightRange, cursor: bigint | null): RangeCheck {
  if (cursor === null || range.to === null || range.to > cursor) return "whole";
  return range.to === cursor ? "cycle" : "none";
}

/** Whether every rule applies to `range`. */
const whole = (range: RangeFacts): boolean => range.check === "whole";

// ── facts ───────────────────────────────────────────────────────────────────────────────────────────────────────────

/** A module's revisions, checked, cut at S and merged where they continue each other. */
function segmentsOf(id: string, revisions: readonly EntryRange[], start: bigint): HeightRange[] {
  for (const revision of revisions) {
    if (revision.stop !== null && revision.stop < revision.start) {
      throw new Error(
        `resolveGraph: the revision of ${id} stops at ${revision.stop}, before its start ${revision.start}; the ` +
          "configuration refuses such an entry before the graph is resolved (CF-3)",
      );
    }
  }
  const ordered = [...revisions].sort((a, b) => byHeight(a.start, b.start));
  const segments: { from: bigint; to: bigint | null }[] = [];
  let previous: EntryRange | undefined;
  for (const revision of ordered) {
    if (previous !== undefined && (previous.stop === null || previous.stop >= revision.start)) {
      throw new Error(
        `resolveGraph: the revisions of ${id} overlap (from ${previous.start} and from ${revision.start}); an earlier ` +
          "revision stops at the next one's start − 1, which the configuration gives as its stop (CF-5)",
      );
    }
    previous = revision;
    if (revision.stop !== null && revision.stop < start) continue;
    const from = revision.start > start ? revision.start : start;
    const last = segments.at(-1);
    if (last !== undefined && last.to !== null && last.to + 1n === from) last.to = revision.stop;
    else segments.push({ from, to: revision.stop });
  }
  return segments.map((segment) => frozenRange(segment.from, segment.to));
}

/** The enabled parts, the ranges and what is active in each; throws for the caller's errors. */
function factsOf(input: GraphInput): GraphFacts {
  const { declarations, start, cursor } = input;
  if (cursor !== null && typeof cursor !== "bigint") {
    throw new Error(
      `resolveGraph: the cursor ${String(cursor)} is neither null (a new database) nor a height (a bigint): the ` +
        "runner passes the blocks table's last committed height, read after opening the database (Q97)",
    );
  }
  if (cursor !== null && cursor < start) {
    throw new Error(
      `resolveGraph: the cursor ${cursor} is below S (${start}): the first commit is at S, so the last committed ` +
        "height is at least S, and a database that has committed nothing has the cursor null (Q97)",
    );
  }
  const backbone = declarations.backbone.map((declaration) => {
    const place = BACKBONE_ORDER.indexOf(declaration.id);
    if (place < 0) {
      throw new Error(
        `resolveGraph: the backbone part ${declaration.id} has no place in RN-3's fixed order of the backbone ` +
          `(${BACKBONE_ORDER.join(", ")})`,
      );
    }
    return { declaration, place };
  });
  backbone.sort((a, b) => a.place - b.place);

  const modules = new Map<string, { declaration: ModuleDeclaration; origin: DeclarationOrigin }>();
  for (const declaration of declarations.core) modules.set(declaration.id, { declaration, origin: "core" });
  for (const declaration of declarations.user) modules.set(declaration.id, { declaration, origin: "user" });
  const revisions = new Map<string, EntryRange[]>();
  for (const entry of input.entries) {
    if (!modules.has(entry.id)) {
      const what = BACKBONE_ORDER.includes(entry.id)
        ? "a backbone part, which runs with the core entry"
        : "a module this build does not have";
      throw new Error(
        `resolveGraph: the configuration has an entry for ${entry.id}, ${what}; the configuration refuses it before ` +
          "the graph is resolved (CF-3)",
      );
    }
    revisions.set(entry.id, [...(revisions.get(entry.id) ?? []), entry]);
  }

  const always = Object.freeze([frozenRange(start, null)]);
  const parts: GraphPart[] = [
    ...backbone.map(({ declaration }) => ({ declaration, origin: "backbone" as const, segments: always })),
    ...[...modules.values()]
      .filter(({ declaration }) => revisions.has(declaration.id))
      .map(({ declaration, origin }) => ({
        declaration,
        origin,
        segments: Object.freeze(segmentsOf(declaration.id, revisions.get(declaration.id) as EntryRange[], start)),
      })),
  ];

  const publicItems = publicItemsOf(input);
  const boundaries = new Set<bigint>([start]);
  const bounded: readonly { readonly start: bigint; readonly stop: bigint | null }[] = [
    ...[...revisions.values()].flat(),
    ...publicItems,
  ];
  for (const entry of bounded) {
    if (entry.start > start) boundaries.add(entry.start);
    if (entry.stop !== null && entry.stop + 1n > start) boundaries.add(entry.stop + 1n);
  }
  const heights = [...boundaries].sort(byHeight);
  const ranges = heights.map((from, index): RangeFacts => {
    const next = heights[index + 1];
    const range = frozenRange(from, next === undefined ? null : next - 1n);
    const active = parts.filter((part) => part.segments.some((segment) => contains(segment, from)));
    const providers = new Map<string, GraphPart[]>();
    for (const part of active) {
      for (const item of part.declaration.provides) providers.set(item.name, [...(providers.get(item.name) ?? []), part]);
    }
    const publicProviders = new Map<string, string[]>();
    for (const found of publicItems) {
      if (!contains(frozenRange(found.start, found.stop), from)) continue;
      const known = publicProviders.get(found.item) ?? [];
      if (!known.includes(found.provider)) publicProviders.set(found.item, sorted([...known, found.provider]));
    }
    return { range, check: checkOf(range, cursor), active, providers, publicProviders };
  });

  return {
    start,
    developmentOptIn: input.developmentOptIn,
    cursor,
    parts,
    built: [...declarations.backbone, ...declarations.core, ...declarations.user],
    ranges,
    hasPublic: input.publicItems !== undefined,
    publicItems,
  };
}

/**
 * The public items `input` carries that count (PP-13): every one but those named like an item of the build's backbone,
 * which is the backbone's own (see the module comment); throws for one that stops before it starts (the caller's).
 */
function publicItemsOf(input: GraphInput): readonly PublicItem[] {
  const own = new Set(input.declarations.backbone.flatMap((part) => part.provides.map((item) => item.name)));
  for (const found of input.publicItems ?? []) {
    if (found.stop !== null && found.stop < found.start) {
      throw new Error(
        `resolveGraph: the public item ${found.item} of ${found.provider} stops at ${found.stop}, before its start ` +
          `${found.start}; a public database's configuration history refuses such a revision (CF-3)`,
      );
    }
  }
  return (input.publicItems ?? []).filter((found) => !own.has(found.item));
}

/** The public modules that provide `item` at any height (PP-13), by UTF-8 id. */
const publicProvidersOf = (facts: GraphFacts, item: string): string[] =>
  sorted(new Set(facts.publicItems.filter((found) => found.item === item).map((found) => found.provider)));

/** Public modules in words: `p of the public core`, `p and q of the public core`. */
const ofPublic = (modules: readonly string[]): string => `${listed(modules)} of the public core`;

// ── faults merged over consecutive ranges ───────────────────────────────────────────────────────────────────────────

interface Spanned<T> {
  readonly range: HeightRange;
  readonly fault: T;
}

/**
 * The faults `faultsIn` finds in each range, each merged over the consecutive ranges where the same fault (by `key`)
 * holds, in the order they first appear: the earliest range first, then the order `faultsIn` gives within a range.
 */
function spans<T>(facts: GraphFacts, faultsIn: (range: RangeFacts) => readonly T[], key: (fault: T) => string): Spanned<T>[] {
  const open = new Map<string, { from: bigint; to: bigint | null; fault: T; last: number }>();
  const found: { from: bigint; to: bigint | null; fault: T; last: number }[] = [];
  facts.ranges.forEach((range, index) => {
    for (const fault of faultsIn(range)) {
      const name = key(fault);
      const current = open.get(name);
      if (current !== undefined && current.last === index - 1) {
        current.to = range.range.to;
        current.last = index;
      } else {
        const started = { from: range.range.from, to: range.range.to, fault, last: index };
        open.set(name, started);
        found.push(started);
      }
    }
  });
  return found.map(({ from, to, fault }) => ({ range: frozenRange(from, to), fault }));
}

/** The active parts of a range, by the UTF-8 bytes of their ids. */
const byId = (parts: readonly GraphPart[]): GraphPart[] =>
  [...parts].sort((a, b) => utf8Order(a.declaration.id, b.declaration.id));

// ── MD-5 ────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Whether `segment` holds the cursor or a later height (on a new database, any): MD-5's "at the cursor or above". */
const atCursorOrLater = (segment: HeightRange, cursor: bigint | null): boolean =>
  cursor === null || segment.to === null || segment.to >= cursor;

/**
 * MD-5: a development-only module active at the cursor or later (on a new database, at any height from S), without the
 * development opt-in. The cursor itself counts: RN-11 re-delivers its callbacks there (Q97).
 */
const developmentOnly: GraphRule = {
  code: "development-opt-in-required",
  check: ({ developmentOptIn, parts, cursor }) => {
    if (developmentOptIn) return undefined;
    const part = parts.find(
      ({ declaration, segments }) =>
        declaration.developmentOnly === true && segments.some((segment) => atCursorOrLater(segment, cursor)),
    );
    if (part === undefined) return undefined;
    const { id } = part.declaration;
    return new UmbraError(
      "development-opt-in-required",
      `module ${id} is development-only (developmentOnly: true) and the core entry does not set developmentOptIn: ` +
        "true: development-only modules run only under the development opt-in (MD-5, CF-9); set developmentOptIn: " +
        "true in the core entry for development, or enable the module at no height this process runs (Q97)",
      { feature: "development-only-module", module: id },
    );
  },
};

// ── MD-3, MD-6: providers ───────────────────────────────────────────────────────────────────────────────────────────

/**
 * MD-3, MD-6: two parts that provide one item at a common height — on a private process, a part and a public module
 * too (PP-13).
 */
const providersOverlap: GraphRule = {
  code: "providers-overlap",
  check: (facts) => {
    const [first] = spans(
      facts,
      (range) =>
        sorted(whole(range) ? new Set([...range.providers.keys(), ...range.publicProviders.keys()]) : [])
          .map((item) => ({
            item,
            modules: sorted((range.providers.get(item) ?? []).map((part) => part.declaration.id)),
            publicModules: [...(range.publicProviders.get(item) ?? [])],
          }))
          .filter(({ modules, publicModules }) => modules.length + publicModules.length > 1),
      ({ item, modules, publicModules }) => JSON.stringify([item, modules, publicModules]),
    );
    if (first === undefined) return undefined;
    const { item, modules, publicModules } = first.fault;
    const count = modules.length + publicModules.length;
    const own = modules.length === 1 ? [`module ${modules[0]}`] : modules.length > 1 ? [`the modules ${listed(modules)}`] : [];
    const lead = publicModules.length === 0 ? `the modules ${listed(modules)}` : [...own, ofPublic(publicModules)].join(" and ");
    return new UmbraError(
      "providers-overlap",
      `${lead} ${count === 2 ? "both" : "all"} provide the item ${item} at heights ${span(first.range)}: at each height ` +
        "an item has at most one active provider (MD-3, MD-6); end one's entry before the other's starts — for a " +
        "handoff, stop one at h − 1 and start the other at h" +
        (publicModules.length === 0 ? "" : "; a private module's item may not take the name of a public one (PP-13)"),
      { item, modules, ...(facts.hasPublic ? { publicModules } : {}), range: first.range },
    );
  },
};

/** A required item that no part provides in a range: the module and the item. */
interface Missing {
  readonly module: string;
  readonly item: string;
}

/** The enabled parts that provide `item` anywhere. */
const enabledProviders = (facts: GraphFacts, item: string): string[] =>
  sorted(
    facts.parts
      .filter(({ declaration }) => declaration.provides.some((provided) => provided.name === item))
      .map(({ declaration }) => declaration.id),
  );

/** MD-3's two coverage causes: no enabled provider at all (`none`), or none where the module runs. */
function missing(facts: GraphFacts, none: boolean): Spanned<Missing> | undefined {
  const [first] = spans(
    facts,
    (range) =>
      byId(whole(range) ? range.active : []).flatMap(({ declaration }) =>
        declaration.requires
          .filter((item) => (range.providers.get(item) ?? []).length === 0)
          .filter((item) => (range.publicProviders.get(item) ?? []).length === 0)
          .filter((item) => (enabledProviders(facts, item).length + publicProvidersOf(facts, item).length === 0) === none)
          .map((item) => ({ module: declaration.id, item })),
      ),
    ({ module, item }) => JSON.stringify([module, item]),
  );
  return first;
}

/** MD-3: a required item no enabled module provides. */
const itemNoProvider: GraphRule = {
  code: "item-no-provider",
  check: (facts) => {
    const found = missing(facts, true);
    if (found === undefined) return undefined;
    const { module, item } = found.fault;
    // No enabled part provides the item, so every module of the build that does has no entry.
    const notEnabled = sorted(
      facts.built.filter(({ provides }) => provides.some((provided) => provided.name === item)).map(({ id }) => id),
    );
    const fix =
      notEnabled.length === 0
        ? "no module of the build provides it; add one that does to the build and to the configuration, or remove the " +
          "requirement"
        : notEnabled.length === 1
          ? `module ${notEnabled[0]} of the build provides it but has no entry in the configuration; add an entry for it`
          : `modules ${listed(notEnabled)} of the build provide it but have no entry in the configuration; add an ` +
            "entry for one of them";
    const publicCore = facts.hasPublic
      ? ", nor does any module of the public core (PP-13: a private module may require the public core's table items, " +
        "as its configuration history records them, and no block or process item of it)"
      : "";
    const publicFix = facts.hasPublic ? "; or enable a module that provides it in the public core" : "";
    return new UmbraError(
      "item-no-provider",
      `module ${module} requires the item ${item} at heights ${span(found.range)}, and no enabled module provides it` +
        `${publicCore} (MD-3): ${fix}${publicFix}`,
      { module, item, range: found.range, notEnabled },
    );
  },
};

/** MD-3: a required item that its enabled providers do not provide where the module runs. */
const itemNotAvailable: GraphRule = {
  code: "item-not-available",
  check: (facts) => {
    const found = missing(facts, false);
    if (found === undefined) return undefined;
    const { module, item } = found.fault;
    const providers = enabledProviders(facts, item);
    const publicProviders = publicProvidersOf(facts, item);
    const by = [
      ...(providers.length === 0 ? [] : [listed(providers)]),
      ...(publicProviders.length === 0 ? [] : [ofPublic(publicProviders)]),
    ];
    return new UmbraError(
      "item-not-available",
      `module ${module} requires the item ${item} at heights ${span(found.range)}, where no module provides it ` +
        `(provided by ${by.join(" and ")} at other heights): an item is available only from its provider's start to ` +
        `its provider's stop, so a module's heights must lie within its providers' (MD-3); start ${module} later, ` +
        "stop it earlier, or give a provider an entry that covers those heights",
      { module, item, range: found.range, providers, ...(facts.hasPublic ? { publicProviders } : {}) },
    );
  },
};

// ── MD-3: cycles ────────────────────────────────────────────────────────────────────────────────────────────────────

/** A requirement: `module` requires `item` from `provider`. */
interface Edge {
  readonly module: string;
  readonly item: string;
  readonly provider: string;
}

/** The requirements of a range's active parts: one edge per required item and active provider. */
function edgesOf(range: RangeFacts): Edge[] {
  return range.active.flatMap(({ declaration }) =>
    declaration.requires.flatMap((item) =>
      (range.providers.get(item) ?? []).map((part) => ({ module: declaration.id, item, provider: part.declaration.id })),
    ),
  );
}

/**
 * Kahn's algorithm over `nodes` with `edges` (a module after each provider it requires): the order, and the nodes left
 * in a cycle. Among the ready nodes `compare` picks the smallest; on a tie, the first in `nodes`.
 */
function kahn(
  nodes: readonly string[],
  edges: readonly Edge[],
  compare: (a: string, b: string) => number,
): { order: string[]; left: string[] } {
  const known = new Set(nodes);
  const waits = new Map<string, Set<string>>(nodes.map((node) => [node, new Set<string>()]));
  for (const { module, provider } of edges) {
    if (known.has(module) && known.has(provider)) waits.get(module)?.add(provider);
  }
  const order: string[] = [];
  const left = [...nodes];
  for (;;) {
    let pick: string | undefined;
    for (const node of left) {
      if ((waits.get(node) as Set<string>).size > 0) continue;
      if (pick === undefined || compare(node, pick) < 0) pick = node;
    }
    if (pick === undefined) break;
    order.push(pick);
    left.splice(left.indexOf(pick), 1);
    for (const node of left) waits.get(node)?.delete(pick);
  }
  return { order, left };
}

/**
 * One cycle among `left` (each waits for another of them): walk from the smallest id to its smallest provider until a
 * module repeats; the cycle starts at its smallest id. Returns its edges, in cycle order, each named by the first item
 * of the module's `requires` that the provider gives it (the sort is stable, and edges follow `requires`).
 */
function cycleOf(left: readonly string[], edges: readonly Edge[]): Edge[] {
  const remaining = new Set(left);
  const next = (module: string): Edge =>
    edges
      .filter((edge) => edge.module === module && remaining.has(edge.provider))
      .sort((a, b) => utf8Order(a.provider, b.provider))[0] as Edge;
  const path: Edge[] = [];
  const seen = new Map<string, number>();
  let current = sorted(left)[0] as string;
  while (!seen.has(current)) {
    seen.set(current, path.length);
    const edge = next(current);
    path.push(edge);
    current = edge.provider;
  }
  const cycle = path.slice(seen.get(current));
  const smallest = sorted(cycle.map((edge) => edge.module))[0];
  const at = cycle.findIndex((edge) => edge.module === smallest);
  return [...cycle.slice(at), ...cycle.slice(0, at)];
}

const requirementWords = (edges: readonly Edge[]): string[] =>
  edges.map(({ module, item, provider }) => `${module} requires ${item} from ${provider}`);

/**
 * MD-3, Q95: a cycle in the graph of a range that holds the cursor or a later height (Q97), or one that only the union
 * of every range's requirements has — past ranges included, as startup orders every part of the database by it.
 */
const graphCycle: GraphRule = {
  code: "graph-cycle",
  check: (facts) => {
    const [first] = spans(
      facts,
      (range) => {
        if (range.check === "none") return [];
        const edges = edgesOf(range);
        const { left } = kahn(
          range.active.map(({ declaration }) => declaration.id),
          edges,
          utf8Order,
        );
        return left.length === 0 ? [] : [cycleOf(left, edges)];
      },
      (cycle) => JSON.stringify(cycle),
    );
    if (first !== undefined) {
      const cycle = first.fault;
      const modules = cycle.map((edge) => edge.module);
      const items = cycle.map((edge) => edge.item);
      const lead =
        modules.length === 1
          ? `module ${modules[0]} requires an item it provides itself at heights ${span(first.range)}`
          : `the modules ${listed(modules)} require one another's items in a cycle at heights ${span(first.range)}`;
      return new UmbraError(
        "graph-cycle",
        `${lead} — ${requirementWords(cycle).join(", ")} — and a module runs only after the providers of the items it ` +
          "requires, so no order exists (MD-3, RN-3); move one of the items to a module outside the cycle, or drop " +
          "one requirement",
        { modules, items, range: first.range },
      );
    }
    return unionCycle(facts);
  },
};

/** Q95: a cycle of the union of the ranges' requirements among the modules (the backbone runs first), if any. */
function unionCycle(facts: GraphFacts): UmbraError | undefined {
  const edges = unionEdges(facts);
  const modules = facts.parts.filter((part) => part.origin !== "backbone").map((part) => part.declaration.id);
  const { left } = kahn(modules, edges, utf8Order);
  if (left.length === 0) return undefined;
  const cycle = cycleOf(left, edges);
  const ranges = cycle.map((edge) => edgeSpan(facts, edge));
  const from = ranges.reduce((low, range) => (range.from < low ? range.from : low), (ranges[0] as HeightRange).from);
  const to = ranges.some((range) => range.to === null)
    ? null
    : ranges.reduce<bigint>((high, range) => ((range.to as bigint) > high ? (range.to as bigint) : high), 0n);
  const words = cycle.map(
    (edge, index) => `${requirementWords([edge])[0]} at heights ${span(ranges[index] as HeightRange)}`,
  );
  return new UmbraError(
    "graph-cycle",
    `the modules ${listed(cycle.map((edge) => edge.module))} require one another's items in a cycle across height ` +
      `ranges — ${words.join(", ")} — and while each range has an order, startup runs every module's migrations and ` +
      "on-start-db once, in one order that puts each provider before the modules requiring it, and none exists " +
      "(MD-3, DB-9, RN-3, Q95); move one of the items to a module outside the cycle, or drop one requirement",
    {
      modules: cycle.map((edge) => edge.module),
      items: cycle.map((edge) => edge.item),
      range: frozenRange(from, to),
      ranges,
    },
  );
}

/**
 * Every range's requirements, each once: the union graph of Q95. Its users run Kahn's algorithm over the modules only,
 * which ignores a requirement of or on a backbone part (the backbone runs first).
 */
function unionEdges(facts: GraphFacts): Edge[] {
  const seen = new Set<string>();
  const edges: Edge[] = [];
  for (const range of facts.ranges) {
    for (const edge of edgesOf(range)) {
      const key = JSON.stringify([edge.module, edge.item, edge.provider]);
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push(edge);
    }
  }
  return edges;
}

/** The first span of consecutive ranges where `edge` holds. */
function edgeSpan(facts: GraphFacts, edge: Edge): HeightRange {
  const key = JSON.stringify([edge.module, edge.item, edge.provider]);
  const [first] = spans(
    facts,
    (range) => edgesOf(range).filter((other) => JSON.stringify([other.module, other.item, other.provider]) === key),
    () => key,
  );
  return (first as Spanned<Edge>).range;
}

// ── MD-4 ────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** A mid-chain start that MD-4 does not allow. */
interface MidChain {
  readonly module: string;
  readonly start: bigint;
  readonly range: HeightRange;
  readonly item?: string;
  readonly provider?: string;
}

/**
 * MD-4: each start above 0 (genesis) — a start at an S above 0 included (Q96) — and above the cursor (Q97) of a module
 * that does not declare `startsMidChain: true`, or that requires an item from a provider not active at the height
 * before (Q98) that does not. Starts are segment starts: a revision continuing the one before does not start the
 * module.
 */
const cannotStartMidChain: GraphRule = {
  code: "cannot-start-mid-chain",
  check: (facts) => {
    const found: MidChain[] = [];
    for (const { declaration, segments } of facts.parts) {
      for (const segment of segments) {
        if (segment.from === 0n || (facts.cursor !== null && segment.from <= facts.cursor)) continue;
        const base = { module: declaration.id, start: segment.from, range: segment };
        if (!declaration.startsMidChain) {
          found.push(base);
          continue;
        }
        const at = facts.ranges.find((range) => contains(range.range, segment.from)) as RangeFacts;
        const before = segment.from - 1n;
        for (const item of declaration.requires) {
          // A provider active at h − 1 has run without a gap and holds its data from h on (Q98). Segments start at S,
          // so at a start at S none is: the database holds no height before S.
          const slow = byId(at.providers.get(item) ?? []).find(
            (part) => !part.declaration.startsMidChain && !part.segments.some((other) => contains(other, before)),
          );
          if (slow !== undefined) {
            found.push({ ...base, item, provider: slow.declaration.id });
            break;
          }
        }
      }
    }
    // The earliest start first; at one start, a refusal naming a provider before a module's own, so that a module and
    // the provider starting with it are named together (MD-4: "the module and, for a provider, the provider and the
    // item") whatever their ids — the provider's own start is refused at the same height; then the smallest id.
    const named = (fault: MidChain): number => (fault.provider === undefined ? 1 : 0);
    found.sort((a, b) => byHeight(a.start, b.start) || named(a) - named(b) || utf8Order(a.module, b.module));
    const [first] = found;
    if (first === undefined) return undefined;
    const atS = first.start === facts.start ? " (S, the database's first height)" : "";
    const lead = `module ${first.module} starts at ${first.start}${atS}, above genesis (height 0),`;
    const message =
      first.provider === undefined
        ? `${lead} but does not declare startsMidChain: true: a start above 0 is a mid-chain start, at S too, and a ` +
          "module that needs the chain's history from genesis cannot start there (MD-4, Q96); start it at 0 on a " +
          "database synced from genesis, restore a backup holding its data, or use a module that can start mid-chain"
        : `${lead} and requires the item ${first.item} from ${first.provider}, which ` +
          (atS === ""
            ? `is not active at ${first.start - 1n}`
            : "starts with it — the database holds no height before S —") +
          " and does not declare startsMidChain: true: a provider that has not run up to the height before a " +
          "module's start starts with it, and must promise a mid-chain start too (MD-4, Q98); run the provider from " +
          "0 on a database synced from genesis or from a backup holding its data, or use a provider that can start " +
          "mid-chain";
    return new UmbraError("cannot-start-mid-chain", message, { ...first });
  },
};

/** MD-3 to MD-6's causes, in the order they are checked. */
export const GRAPH_RULES: readonly GraphRule[] = Object.freeze([
  developmentOnly,
  providersOverlap,
  itemNoProvider,
  itemNotAvailable,
  graphCycle,
  cannotStartMidChain,
]);

// ── order ───────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Throws when a backbone part requires an item that a later part, or a module, provides: RN-3 has no order for it. */
function checkBackbone(range: RangeFacts): void {
  const backbone = range.active.filter((part) => part.origin === "backbone").map((part) => part.declaration.id);
  backbone.forEach((id, place) => {
    const part = range.active.find((candidate) => candidate.declaration.id === id) as GraphPart;
    for (const item of part.declaration.requires) {
      for (const provider of range.providers.get(item) ?? []) {
        if (backbone.indexOf(provider.declaration.id) >= 0 && backbone.indexOf(provider.declaration.id) < place) continue;
        throw new Error(
          `resolveGraph: the backbone part ${id} requires the item ${item}, which ${provider.declaration.id} provides ` +
            `at heights ${span(range.range)}; a backbone part may require only the items of the backbone parts before ` +
            `it in RN-3's fixed order (${BACKBONE_ORDER.join(", ")})`,
        );
      }
    }
  });
}

/** Throws for a cycle Kahn's algorithm left: only when the graph-cycle rule was not checked. */
function noCycleLeft(left: readonly string[], where: string): void {
  if (left.length > 0) {
    throw new Error(`resolveGraph: the modules ${listed(left)} wait for one another ${where}, and no rule refused it`);
  }
}

/** The parts in order: the backbone as given (fixed order), then the modules by Kahn's algorithm. */
function ordered(
  parts: readonly GraphPart[],
  edges: readonly Edge[],
  compare: (a: string, b: string) => number,
  where: string,
): ModuleDeclaration[] {
  const backbone = parts.filter((part) => part.origin === "backbone").map((part) => part.declaration);
  const modules = parts.filter((part) => part.origin !== "backbone");
  const { order, left } = kahn(
    modules.map((part) => part.declaration.id),
    edges,
    compare,
  );
  noCycleLeft(left, where);
  const byName = new Map(modules.map((part) => [part.declaration.id, part.declaration]));
  return [...backbone, ...order.map((id) => byName.get(id) as ModuleDeclaration)];
}

/** One range's orders and providers, and — on a private process (`hasPublic`) — its public items. */
function resolvedRange(range: RangeFacts, compare: (a: string, b: string) => number, hasPublic: boolean): ResolvedRange {
  // In a range that ends at the cursor a module may provide a backbone part's item (providers are not checked there,
  // Q97); the backbone's own requirements are the same in every range, and the last range is always checked whole.
  if (whole(range)) checkBackbone(range);
  const order = ordered(range.active, edgesOf(range), compare, `at heights ${span(range.range)}`);
  const last = order.filter((declaration) => declaration.id === LAST_AT_DB_WRITE);
  const writeOrder = [...order.filter((declaration) => declaration.id !== LAST_AT_DB_WRITE), ...last];
  const providerOf = new Map<string, string>();
  for (const [item, providers] of range.providers) {
    if (providers.length === 1) providerOf.set(item, (providers[0] as GraphPart).declaration.id);
  }
  const publicItems = new Set([...range.publicProviders.keys()].filter((item) => !range.providers.has(item)));
  return Object.freeze({
    range: range.range,
    order: Object.freeze(order),
    writeOrder: Object.freeze(writeOrder),
    providerOf,
    ...(hasPublic ? { publicItems } : {}),
  });
}

/**
 * Resolves the graph of `input` with `rules`, ordering ready modules by `compare` (see the module comment). Throws the
 * first rule's first refusal; returns the resolved graph, frozen.
 */
export function resolveWith(
  input: GraphInput,
  rules: readonly GraphRule[] = GRAPH_RULES,
  compare: (a: string, b: string) => number = utf8Order,
): ResolvedGraph {
  const facts = factsOf(input);
  for (const rule of rules) {
    const refusal = rule.check(facts);
    if (refusal !== undefined) throw refusal;
  }
  const ranges = Object.freeze(
    facts.ranges.filter((range) => range.check !== "none").map((range) => resolvedRange(range, compare, facts.hasPublic)),
  );
  const modules = Object.freeze(ordered(facts.parts, unionEdges(facts), compare, "across the height ranges"));
  const segments = new Map(facts.parts.map((part) => [part.declaration.id, part.segments]));
  return Object.freeze({
    start: input.start,
    modules,
    segments,
    ranges,
    rangeAt: (height: bigint) => ranges.find((range) => contains(range.range, height)),
  });
}

/**
 * Resolves the requirement graph of one database at startup (MD-3 to MD-6, RN-3): see the module comment. Throws an
 * `UmbraError` (not retryable) naming the range, the module and the item; returns the order and providers of each range
 * from the one holding the cursor on, and the database's modules in startup order.
 */
export function resolveGraph(input: GraphInput): ResolvedGraph {
  return resolveWith(input);
}
