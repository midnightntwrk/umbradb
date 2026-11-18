/**
 * The copy of the counts and child lists that `core-ledger-state` keeps for one process context
 * (`./core-ledger-state.ts`), and when it is emptied. Core.
 *
 * **What it holds** ({@link CountsCopy}), for the keys the reclamation's computation (`./run-reclaim.ts`) read or wrote:
 * - per key, what the computation's `counts` read gives of it: whether it is a row of `nodes`, its reference count and
 *   its root count, as the tables are after the last settle;
 * - per stored node a run wrote (new, or with another child list), the references of its child list in the list's
 *   order, as the keys' texts (`./run-reclaim.ts`'s `keyText`), which the strings own: never the list's bytes, most of
 *   which are embedded payload.
 *
 * {@link withCountsCopy} gives the computation tables whose `counts` and `children` reads are answered from the copy
 * where it holds the key, and the other keys read from the database in one read; the counts read are held, while the
 * copy is below its bound. A held child list is answered as a list of those references alone: the computation takes
 * nothing else from it. No other read is answered from the copy. A list the `children` read gives is not held: the
 * computation reads the lists of the keys its run deletes only.
 *
 * **Exact, not refreshed.** After a run's net write, {@link CountsCopy.apply} changes the copy as the net write changed
 * the tables: each held key's count takes its change, and its root count the run's root-count change; each node the
 * run wrote new enters, a row, with its count change as its count and its root-count change as its root count (on
 * undamaged tables, once a settle committed, a key that is no row has no reference and no root count: a run that left
 * one would have failed its `missing-reference` check), and with its list; a node written with another child list has its list replaced; every
 * key the run deleted leaves. While a run computes, `root_counts` already holds the run's own changes (each block's
 * `on-db-write` writes them, and nothing else writes the table), so a held root count is answered as held plus the
 * run's change (`RunReclaim.rootChanges`), and one read from the database is held less it.
 *
 * The copy equals the tables for the keys it holds given tables that were undamaged when the process started and that
 * only this process writes. On tables already damaged it can differ from the database: a positive reference count for a
 * key that is no row, for instance, which a run then writes new without reading its counts (the database adds the run's
 * change to the stale count, the copy takes the change alone). The height and the reason of a halt can then change,
 * with no hand edit while the process runs; `verify` finds the difference at the first read of that key.
 *
 * **Its values decide what a run deletes and what its checks pass**, unlike the keys found stored (`./stored-keys.ts`),
 * which only skip a check. Unless it verifies, what finds a copy that differs from the tables is only the net
 * write's check of the rows each statement affects, and only for a count the run changes, held wrong by enough that the
 * held and the stored count lie on two sides of 0 after the run (`row-count-mismatch`). A count wrong on the same side
 * of 0, a root count held wrong (which can keep a node stored, or delete one a root holds) or a row flag held wrong
 * changes no row count. So the computation is right only while the copy is exact, which the update above and the
 * emptying below keep:
 * - at a block's `on-compute`, before it is handed over, when its context says the block before does not continue into
 *   it (`BlockContext.continues` false: a process's first block, every block made again after a failure, the block
 *   after a `COMMIT` whose answer was lost, a block on another writer's session than the one that committed the block
 *   before): a settle may have updated it for a transaction that did not commit, or another writer may have changed
 *   the tables ({@link CountsCopy.begin});
 * - when a settle throws, before its error goes on: nothing a failed settle read or applied is kept
 *   ({@link CountsCopy.failed});
 * - by its bound, before a key or a list that would pass it ({@link CountsCopy.max}).
 *
 * A worker restart after a refused eviction empties nothing (it changes no table), nor does `sweep` turning off or on
 * (the counts and child lists change only through net writes, which the copy follows), nor a conversion or upgrade
 * block (its nodes go through the run as any block's). A count or node row changed by hand while the process runs is
 * read at once if the copy does not hold its key; if it does, the change goes unseen, but by a verifying copy at its
 * first read of that key, until a block that does not continue the one before, or the bound, empties the copy.
 *
 * **Verifying** (`reclamationCache.verify`): every key the copy answers is also read from the database, and a
 * held value that differs, or a list held for a key the database holds no row of, halts the run with
 * `ledger-refcount-invalid` (`copy-mismatch`), naming the key, which read, the held value and the stored one. It costs
 * the reads the copy saves. The tests' processes run in it when `UMBRADB_TEST_VERIFY_RECLAMATION=1` is set
 * (`test/runner/process-build.ts`); no workflow of the repository sets it.
 *
 * **The block trace** ({@link CopyCounted}): `copyHits` and `copyMisses`, the keys of a settle's `counts` and
 * `references` reads the copy held and did not; the database is asked the missed ones, and, verifying, the held ones
 * too, so the trace's `reads` give what the database was asked. `copyEmptied`: 1 on a height whose settle did not start
 * from what earlier heights left in the copy ({@link CountsCopy.settled}).
 */

import { latestBuildCoreEntry } from "../../config/process.js";
import type { CheckedConfig } from "../../config/validate.js";
import { UmbraError } from "../../db/errors.js";
import { childRefOffsets } from "../../ledger/node-refs.js";
import { keyText, type RunOutcome, type RunTables } from "./run-reclaim.js";

/** The `core` entry's `reclamationCache`, an operational setting (`src/config/core-settings.ts`). */
export interface ReclamationCache {
  /** The most keys of counts, and the most child lists, the copy holds; 0 for no copy. */
  readonly keys: number;
  /** Whether every key the copy answers is also read from the database and compared (see the module comment). */
  readonly verify: boolean;
}

/** The setting's defaults. */
export const RECLAMATION_CACHE_DEFAULT: ReclamationCache = Object.freeze({ keys: 100_000, verify: false });

/**
 * The `reclamationCache` a process runs with: an operational setting, so the one of the latest `core` revision of the
 * build's version (`src/config/process.ts`), each field its default when that revision does not give it.
 */
export function reclamationCacheOf(config: Pick<CheckedConfig, "entries">): ReclamationCache {
  const settings = latestBuildCoreEntry(config)?.settings as { readonly reclamationCache?: Partial<ReclamationCache> } | null | undefined;
  const given = settings?.reclamationCache;
  return Object.freeze({
    keys: typeof given?.keys === "number" ? given.keys : RECLAMATION_CACHE_DEFAULT.keys,
    verify: typeof given?.verify === "boolean" ? given.verify : RECLAMATION_CACHE_DEFAULT.verify,
  });
}

/** A key's counts, as the `counts` read gives them. */
export interface HeldCounts {
  readonly row: boolean;
  readonly refs: number;
  readonly roots: number;
}

/**
 * A fault a negative control puts into `core-ledger-state`'s use of the copy; a build's carries none:
 * - `net-not-applied`: the copy is not updated from a run's net write;
 * - `roots-not-added`: a held root count is answered without the run's change;
 * - `kept-after-failure`: the copy is not emptied for a block that does not continue the one before.
 */
export type CopyFault = "net-not-applied" | "roots-not-added" | "kept-after-failure";

/** What a settle's reads asked of the copy: the block trace's `copyHits` and `copyMisses`. */
export interface CopyCounted {
  hits: number;
  misses: number;
}

/** A node key's length, in bytes and in characters of its text. */
const KEY_LENGTH = 32;

/** The counts of a key that has none: what the `counts` read gives for a key it leaves out. */
const NONE: HeldCounts = Object.freeze({ row: false, refs: 0, roots: 0 });

/** A key as an error names it. */
const shown = (text: string): string => `0x${Buffer.from(text, "latin1").toString("hex")}`;

/** The references of a serialized child list, in its order, as one text: each key's text after the one before. */
function referencesOf(children: Uint8Array): string {
  const offsets = childRefOffsets(children);
  const list = Buffer.from(children.buffer, children.byteOffset, children.byteLength);
  const keys = Buffer.alloc(offsets.length * KEY_LENGTH);
  offsets.forEach((at, index) => list.copy(keys, index * KEY_LENGTH, at, at + KEY_LENGTH));
  return keys.toString("latin1");
}

/** The keys of a references text, each as an error names it. */
function shownKeys(references: string): string[] {
  const keys: string[] = [];
  for (let at = 0; at < references.length; at += KEY_LENGTH) keys.push(shown(references.slice(at, at + KEY_LENGTH)));
  return keys;
}

/** A SCALE compact integer in the fewest bytes that spell it, as a child list's length (`../../ledger/node-refs.ts`). */
function compactLength(count: number): Uint8Array {
  if (count < 1 << 6) return Uint8Array.of(count << 2);
  if (count < 1 << 14) {
    const value = (count << 2) | 0b01;
    return Uint8Array.of(value & 0xff, value >>> 8);
  }
  const value = ((count << 2) | 0b10) >>> 0;
  return Uint8Array.of(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, value >>> 24);
}

/** A serialized child list of `references`, each a child by reference, in their order: a list of a new array. */
function listOf(references: string): Uint8Array {
  const count = references.length / KEY_LENGTH;
  const length = compactLength(count);
  const list = Buffer.alloc(length.length + count * (1 + KEY_LENGTH));
  list.set(length, 0);
  for (let index = 0, at = length.length; index < count; index++, at += 1 + KEY_LENGTH) {
    // The byte 0, a child by reference, then its key.
    list.write(references.slice(index * KEY_LENGTH, (index + 1) * KEY_LENGTH), at + 1, KEY_LENGTH, "latin1");
  }
  return new Uint8Array(list.buffer, list.byteOffset, list.byteLength);
}

/** The copy of one process context (see the module comment). */
export class CountsCopy {
  /** The most keys of counts it holds, and the most child lists: an update that would pass either empties it first. */
  readonly max: number;
  /** Whether it verifies: every key it answers is also read and compared. */
  readonly verify: boolean;
  readonly #counts = new Map<string, { row: boolean; refs: number; roots: number }>();
  readonly #lists = new Map<string, string>();
  #emptied = 0;
  /** Whether the block whose settle comes next did not continue the block before. */
  #afresh = false;

  /** A copy of `cache.keys` keys at most, a whole number from 1, verifying when `cache.verify`. */
  constructor(cache: ReclamationCache) {
    if (!Number.isSafeInteger(cache.keys) || cache.keys < 1) {
      throw new RangeError(`a copy of the counts and child lists holds at least one key, not ${cache.keys}`);
    }
    this.max = cache.keys;
    this.verify = cache.verify;
  }

  /** How many keys' counts, and how many child lists, it holds. */
  get size(): { readonly counts: number; readonly lists: number } {
    return { counts: this.#counts.size, lists: this.#lists.size };
  }

  /** How many times it was emptied while it held something: by {@link clear}, {@link begin}, {@link failed} or its bound. */
  get emptied(): number {
    return this.#emptied;
  }

  /** The counts it holds of the key whose text is `text`, as after the last settle; undefined when it holds none. */
  counts(text: string): HeldCounts | undefined {
    const held = this.#counts.get(text);
    return held === undefined ? undefined : { row: held.row, refs: held.refs, roots: held.roots };
  }

  /** The references of the child list it holds for `text`, as one text of 32 characters a key; undefined for none. */
  list(text: string): string | undefined {
    return this.#lists.get(text);
  }

  /** The references of the child list it holds for `text`, each key's text, in the list's order; undefined for none. */
  references(text: string): string[] | undefined {
    const list = this.#lists.get(text);
    if (list === undefined) return undefined;
    const keys: string[] = [];
    for (let at = 0; at < list.length; at += KEY_LENGTH) keys.push(list.slice(at, at + KEY_LENGTH));
    return keys;
  }

  /**
   * A read gave `counts` for `text`, as after the last settle: held when the copy holds the key already or holds fewer
   * than {@link max} keys' counts; otherwise only answered.
   */
  learnCounts(text: string, counts: HeldCounts): void {
    const held = this.#counts.get(text);
    if (held !== undefined) {
      held.row = counts.row;
      held.refs = counts.refs;
      held.roots = counts.roots;
    } else if (this.#counts.size < this.max) this.#counts.set(text, { row: counts.row, refs: counts.refs, roots: counts.roots });
  }

  /**
   * A run's net write was made (`outcome`'s), its root-count changes `rootChanges` by key text: the copy changes as the
   * tables did (see the module comment). The work is the run's keys', not the copy's size.
   */
  apply(outcome: Pick<RunOutcome, "net" | "evict" | "newKeys">, rootChanges: ReadonlyMap<string, number>): void {
    const deltas = new Map<string, number>();
    for (const { key, delta } of outcome.net.deltas) {
      const text = keyText(key);
      deltas.set(text, delta);
      const held = this.#counts.get(text);
      if (held !== undefined) held.refs += delta;
    }
    for (const [text, change] of rootChanges) {
      const held = this.#counts.get(text);
      if (held !== undefined) held.roots += change;
    }
    for (const key of outcome.evict) {
      const text = keyText(key);
      this.#counts.delete(text);
      this.#lists.delete(text);
    }
    const fresh = new Set(outcome.newKeys.map(keyText));
    for (const node of outcome.net.inserts) {
      const text = keyText(node.key);
      if (fresh.has(text)) {
        const held = this.#counts.get(text);
        if (held !== undefined) held.row = true;
        else {
          if (this.#counts.size >= this.max) this.clear();
          this.#counts.set(text, { row: true, refs: deltas.get(text) ?? 0, roots: rootChanges.get(text) ?? 0 });
        }
      }
      if (!this.#lists.has(text) && this.#lists.size >= this.max) this.clear();
      this.#lists.set(text, referencesOf(node.children));
    }
  }

  /** Empties it. */
  clear(): void {
    if (this.#counts.size === 0 && this.#lists.size === 0) return;
    this.#counts.clear();
    this.#lists.clear();
    this.#emptied += 1;
  }

  /**
   * A block's `on-compute`, before it is handed over: `continues`, its context's. When the block before does not
   * continue into it, the copy is emptied, and the settle that follows starts afresh.
   */
  begin(continues: boolean): void {
    if (continues) return;
    this.clear();
    this.#afresh = true;
  }

  /** A settle threw: the copy is emptied before its error goes on. */
  failed(): void {
    this.clear();
  }

  /**
   * A settle ended, its net write made and applied, `emptiedBefore` the copy's {@link emptied} when it began: whether it
   * did not start from what earlier heights left (the block before did not continue into its block, or the bound
   * emptied the copy while it ran). Each settle asks once, for the trace's `copyEmptied`.
   */
  settled(emptiedBefore: number): boolean {
    const afresh = this.#afresh || this.#emptied !== emptiedBefore;
    this.#afresh = false;
    return afresh;
  }
}

/** `ledger-refcount-invalid` (`copy-mismatch`) at block `height`: the copy holds `held` of a key the database holds as `stored`. */
function mismatch(height: bigint, text: string, what: "counts" | "references", held: unknown, stored: unknown): UmbraError {
  const value = what === "counts" ? "the counts" : "the child list's references";
  return new UmbraError(
    "ledger-refcount-invalid",
    `block ${height}: the copy core-ledger-state keeps in memory holds ${value} of ${shown(text)} as ${JSON.stringify(held)}, ` +
      `and the database as ${JSON.stringify(stored)} (copy-mismatch)`,
    { reason: "copy-mismatch", height, key: shown(text), what, held, stored },
  );
}

/**
 * `tables` with their `counts` and `children` reads answered from `copy` where it holds the key, the others read from
 * `tables` in one read and their counts held (see the module comment). `height` is the run's last, for the error;
 * `rootChanges` the run's root-count changes by key text; `counted` takes the keys asked that the copy held and did
 * not. Verifying, every key is read, and a held value that differs throws `copy-mismatch`. A read for no
 * key the copy lacks reads nothing.
 */
export function withCountsCopy(
  tables: RunTables,
  copy: CountsCopy,
  options: {
    readonly height: bigint;
    readonly rootChanges: ReadonlyMap<string, number>;
    readonly counted?: CopyCounted;
    readonly fault?: CopyFault;
  },
): RunTables {
  const { height, rootChanges, counted, fault } = options;
  const change = (text: string): number => rootChanges.get(text) ?? 0;
  const count = (hits: number, misses: number): void => {
    if (counted === undefined) return;
    counted.hits += hits;
    counted.misses += misses;
  };
  return {
    ...tables,
    async counts(keys) {
      const answers: { readonly key: Uint8Array; readonly row: boolean; readonly refs: number; readonly roots: number }[] = [];
      const asked: Uint8Array[] = [];
      /** What the copy answered of each key it held, when verifying. */
      const answered = new Map<string, HeldCounts>();
      for (const key of keys) {
        const text = keyText(key);
        const held = copy.counts(text);
        if (held === undefined) {
          asked.push(key);
          continue;
        }
        const answer = { row: held.row, refs: held.refs, roots: held.roots + (fault === "roots-not-added" ? 0 : change(text)) };
        answers.push({ key, ...answer });
        if (copy.verify) {
          answered.set(text, answer);
          asked.push(key);
        }
      }
      count(answers.length, keys.length - answers.length);
      if (asked.length === 0) return answers;
      const stored = new Map((await tables.counts(asked)).map((row) => [keyText(row.key), row] as const));
      for (const key of asked) {
        const text = keyText(key);
        const found = stored.get(text);
        const value: HeldCounts = found === undefined ? NONE : { row: found.row, refs: found.refs, roots: found.roots };
        const held = answered.get(text);
        if (held !== undefined) {
          if (held.row !== value.row || held.refs !== value.refs || held.roots !== value.roots) throw mismatch(height, text, "counts", held, value);
          continue;
        }
        copy.learnCounts(text, { row: value.row, refs: value.refs, roots: value.roots - change(text) });
        if (found !== undefined) answers.push({ key, row: value.row, refs: value.refs, roots: value.roots });
      }
      return answers;
    },
    async children(keys) {
      const answers: { readonly key: Uint8Array; readonly children: Uint8Array }[] = [];
      const asked: Uint8Array[] = [];
      /** The list the copy held of each key, when verifying. */
      const held = new Map<string, string>();
      let hits = 0;
      for (const key of keys) {
        const text = keyText(key);
        const list = copy.list(text);
        if (list === undefined) {
          asked.push(key);
          continue;
        }
        hits += 1;
        if (copy.verify) {
          held.set(text, list);
          asked.push(key);
        } else answers.push({ key, children: listOf(list) });
      }
      count(hits, keys.length - hits);
      if (asked.length === 0) return answers;
      const stored = new Map((await tables.children(asked)).map((row) => [keyText(row.key), row] as const));
      for (const key of asked) {
        const text = keyText(key);
        const found = stored.get(text);
        const list = held.get(text);
        if (list !== undefined) {
          const references = found === undefined ? null : referencesOf(found.children);
          if (references !== list) throw mismatch(height, text, "references", shownKeys(list), references === null ? null : shownKeys(references));
        }
        if (found !== undefined) answers.push(found);
      }
      return answers;
    },
  };
}
