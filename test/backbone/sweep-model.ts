import { childRefKeys } from "../../src/ledger/node-refs.js";

/**
 * The reference model of LG-14's fixed-budget mark-and-sweep (task 12.5; `openspec/changes/core-arch/specs/ledger/spec.md`
 * LG-14, acceptance A105): an independent in-memory implementation in the tests, written from the requirement's text
 * and design §5.4 — plain sets of hex keys and sorted arrays, no database, nothing of `src/` but the child-list reader
 * (`childRefKeys`, which task 12.3 checks against task 0.2's independent node format) —, against which the
 * implementation's tables are compared after every block.
 *
 * Each block's batch is applied first (its nodes inserted, an existing key left as it is; its root counts changed by
 * their signed deltas, a count reaching 0 gone); then, unless `sweep` is off at the block, the step, in LG-14's order:
 * (1) when no cycle runs (`idle`), the cycle number rises, every key with a positive root count *before the block's
 * batch* becomes grey and the phase becomes `mark`; (2) every key whose root count rose in the block and is neither
 * marked nor grey becomes grey; (3) while budget remains and the grey set is not empty, the smallest grey keys in byte
 * order, as many as the budget left (fixed at the round's start), are visited one by one — removed from the grey set,
 * marked, one unit spent, and each key its stored node references that is neither marked nor grey made grey (a key
 * with no stored node is marked and adds nothing); (4) only when the grey set is empty and budget remains, the phase is
 * `sweep`: the stored nodes after the sweep position are scanned in key order, as many as the budget left, one unit
 * each, an unmarked one deleted, and the position moved to the last one scanned; (5) when the scan gave fewer nodes than
 * the budget it had, it passed the last node: the marks and the position are cleared and the phase is `idle`. The first
 * block whose `sweep` is off after one with it on clears the grey set, the marks and the position and makes the phase
 * `idle` (the cycle number kept); while it is off nothing else changes and nothing is deleted.
 *
 * Byte order of 32-byte keys is the order of their lowercase hex.
 */

/** One block's input to the sweep: the batch it writes. */
export interface ModelBatch {
  readonly inserts: readonly { readonly key: string; readonly children: Uint8Array }[];
  readonly deltas: readonly { readonly key: string; readonly delta: number }[];
}

/** The sweep's state and the stored nodes after a block, as the model holds them (every list sorted). */
export interface ModelSnapshot {
  readonly cycle: bigint;
  readonly phase: "idle" | "mark" | "sweep";
  readonly sweepAfter: string | null;
  readonly grey: readonly string[];
  readonly marks: readonly string[];
  readonly nodes: readonly string[];
  /** The keys the block deleted. */
  readonly deleted: readonly string[];
}

const sorted = (keys: Iterable<string>): string[] => [...keys].sort();
const hexOf = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The model (see the module comment). */
export class SweepModel {
  readonly #budget: number;
  readonly #nodes = new Map<string, Uint8Array>();
  readonly #counts = new Map<string, number>();
  #grey = new Set<string>();
  #marks = new Set<string>();
  #cycle = 0n;
  #phase: "idle" | "mark" | "sweep" = "idle";
  #after: string | null = null;
  #wasOn = true;

  constructor(budget: number) {
    this.#budget = budget;
  }

  /** Applies one block with `batch`, `sweepOn` the setting at its height; returns the state after it. */
  block(batch: ModelBatch, sweepOn: boolean): ModelSnapshot {
    const before = sorted([...this.#counts].filter(([, count]) => count > 0).map(([key]) => key));
    for (const { key, children } of batch.inserts) if (!this.#nodes.has(key)) this.#nodes.set(key, children);
    for (const { key, delta } of batch.deltas) {
      const count = (this.#counts.get(key) ?? 0) + delta;
      if (count === 0) this.#counts.delete(key);
      else this.#counts.set(key, count);
    }
    const deleted: string[] = [];
    if (!sweepOn) {
      if (this.#wasOn) {
        this.#grey = new Set();
        this.#marks = new Set();
        this.#after = null;
        this.#phase = "idle";
      }
      this.#wasOn = false;
      return this.snapshot(deleted);
    }
    this.#wasOn = true;
    const free = (key: string): boolean => !this.#marks.has(key) && !this.#grey.has(key);
    // (1) A cycle starts.
    if (this.#phase === "idle") {
      this.#cycle += 1n;
      this.#phase = "mark";
      for (const key of before) if (free(key)) this.#grey.add(key);
    }
    // (2) New roots.
    for (const { key, delta } of batch.deltas) if (delta > 0 && free(key)) this.#grey.add(key);
    // (3) Marking rounds.
    let budget = this.#budget;
    while (budget > 0 && this.#grey.size > 0) {
      const round = sorted(this.#grey).slice(0, budget);
      for (const key of round) {
        this.#grey.delete(key);
        this.#marks.add(key);
        budget -= 1;
        const children = this.#nodes.get(key);
        if (children === undefined) continue;
        for (const ref of childRefKeys(children)) {
          const child = hexOf(ref);
          if (free(child)) this.#grey.add(child);
        }
      }
    }
    // (4) The sweep, and (5) the cycle's end.
    if (budget > 0 && this.#grey.size === 0) {
      this.#phase = "sweep";
      const after = this.#after;
      const scan = sorted(this.#nodes.keys()).filter((key) => after === null || key > after).slice(0, budget);
      for (const key of scan) {
        if (!this.#marks.has(key)) {
          this.#nodes.delete(key);
          deleted.push(key);
        }
      }
      if (scan.length > 0) this.#after = scan.at(-1) as string;
      if (scan.length < budget) {
        this.#marks = new Set();
        this.#after = null;
        this.#phase = "idle";
      }
    }
    return this.snapshot(deleted);
  }

  /** The state now. */
  snapshot(deleted: readonly string[] = []): ModelSnapshot {
    return Object.freeze({
      cycle: this.#cycle,
      phase: this.#phase,
      sweepAfter: this.#after,
      grey: sorted(this.#grey),
      marks: sorted(this.#marks),
      nodes: sorted(this.#nodes.keys()),
      deleted: sorted(deleted),
    });
  }

  /** The stored nodes now, by key (for a fixture's next batch: what is not stored yet). */
  has(key: string): boolean {
    return this.#nodes.has(key);
  }
}
