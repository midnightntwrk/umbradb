/**
 * The node client's call counts, per method, since the client was made (FR-015 of the node call budget): what the
 * process asked of its node, for measuring a daily request budget in production. `/status` shows them under
 * `node.calls`, and the block trace adds each height's to its line (`node`, `src/trace/trace.ts`).
 *
 * Per method:
 * - `calls`: the calls made — a plain call, a subscription, and a subscription made again after a reconnect — each
 *   counted once however often it is tried. A call refused before it is sent (a method outside the allowed calls, a
 *   parameter it cannot send, a closed client) is none. Notifications are not calls.
 * - `attempts`: the tries sent to the node, retries included. A try that finds no connection sends nothing and is none.
 * - `frames`: the request frames those tries went in. A try sent alone is one frame, so without batches `frames` is
 *   `attempts`. A JSON-RPC batch frame carries several tries (`./client.ts`, `batchSize`): it counts one attempt for each
 *   call in it, and one frame for each method it carries, so a method's `frames` is the frames that carried any of its
 *   tries. A batch that mixes methods is then counted under each of them: the sum over methods is more than the frames
 *   sent, which {@link NodeCallCounter.frames} counts once each.
 * - `failures`: the calls that ended without an answer, after any retries, by the code they ended with — `aborted`
 *   for a call whose signal was aborted (a run that ended stops its prefetched roots this way), else the `UmbraError`'s
 *   code (`node-unreachable`, `node-error`, `node-requirement`, `handle-closed`), `other` for anything else. A call whose answer came and could not be read into its typed value
 *   is not one: the node answered it.
 *
 * Each count is a few integer additions on a small map (one entry per method the client used, one per failure code),
 * so counting costs O(1) per call whatever the run's length.
 */

import { UmbraError } from "../db/errors.js";
import { traceNode } from "../trace/trace.js";
import type { NodeMethod } from "./methods.js";

/** One method's counts (see the module comment). */
export interface NodeMethodCounts {
  readonly calls: number;
  readonly attempts: number;
  readonly frames: number;
  /** The calls that ended without an answer, by code; a code with none is absent. */
  readonly failures: Readonly<Record<string, number>>;
}

/** The counts of each method the client used, by method name in name order; a method it never used is absent. */
export type NodeCallCounts = Readonly<Partial<Record<NodeMethod, NodeMethodCounts>>>;

interface Counts {
  calls: number;
  attempts: number;
  frames: number;
  readonly failures: Map<string, number>;
}

/** The code a call's failure is counted under (see the module comment). */
export function failureCode(error: unknown, aborted: boolean): string {
  if (aborted) return "aborted";
  return error instanceof UmbraError ? error.code : "other";
}

/** A node client's counts (see the module comment). */
export class NodeCallCounter {
  readonly #methods = new Map<NodeMethod, Counts>();
  #frames = 0;

  #of(method: NodeMethod): Counts {
    let counts = this.#methods.get(method);
    if (counts === undefined) {
      counts = { calls: 0, attempts: 0, frames: 0, failures: new Map() };
      this.#methods.set(method, counts);
    }
    return counts;
  }

  /** A call made. */
  call(method: NodeMethod): void {
    this.#of(method).calls += 1;
    traceNode(method, "calls");
  }

  /** A try of a call sent to the node in a frame of its own. */
  sent(method: NodeMethod): void {
    this.sentBatch([method]);
  }

  /** The tries of `methods`' calls sent to the node in one frame: an attempt each, a frame for each method among them. */
  sentBatch(methods: readonly NodeMethod[]): void {
    this.#frames += 1;
    for (const method of methods) {
      this.#of(method).attempts += 1;
      traceNode(method, "attempts");
    }
    for (const method of new Set(methods)) {
      this.#of(method).frames += 1;
      traceNode(method, "frames");
    }
  }

  /** The request frames sent, each once whatever it carried. */
  get frames(): number {
    return this.#frames;
  }

  /** A call ended without an answer, with `code`. */
  failed(method: NodeMethod, code: string): void {
    const failures = this.#of(method).failures;
    failures.set(code, (failures.get(code) ?? 0) + 1);
    traceNode(method, "failures");
  }

  /** The counts so far, as plain frozen data. */
  snapshot(): NodeCallCounts {
    const methods = [...this.#methods.keys()].sort();
    return Object.freeze(
      Object.fromEntries(
        methods.map((method) => {
          const counts = this.#methods.get(method) as Counts;
          const codes = [...counts.failures.keys()].sort();
          const failures = Object.freeze(Object.fromEntries(codes.map((code) => [code, counts.failures.get(code) as number])));
          return [method, Object.freeze({ calls: counts.calls, attempts: counts.attempts, frames: counts.frames, failures })];
        }),
      ),
    );
  }
}
