/**
 * The core's view of its private instances for `/status`: each instance's id, connection, lockstep flag and synced
 * height, and nothing else from it. [PP-9, AE-5; design §8]
 *
 * It is built from the two views the core has:
 * - its lockstep bookkeeping (`./lockstep.ts`'s `instances()`): every instance its `core` revision lists in
 *   `lockstepInstances`, connected or not, with the committed height the core last learned (from its `hello`, then from
 *   each report whose hash it checked), or null for one not seen since the core started;
 * - its transport (`./core-transport.ts`'s `instances()`): every instance connected now, with the height of its `hello`
 *   or of its last report.
 *
 * A listed instance is shown from the bookkeeping, a refused one too, with the height it had then. Every other
 * connected instance is shown from the transport, as not lockstep, at its `hello`'s height: only a lockstep instance
 * sends reports, so the core learns no later height of an independent one. Listed instances come first, in the list's
 * order, then the others by id. Plain TypeScript: no Node.js module. [PP-4, PP-9]
 */

import type { InstanceView } from "./core-transport.js";
import type { LockstepInstance } from "./lockstep.js";

/** One private instance as `/status` shows it on the core. [PP-9] */
export interface PrivateInstance {
  readonly id: string;
  /** Whether a connection past its `hello` holds its id now. */
  readonly connected: boolean;
  /** Whether the core lists it in `lockstepInstances`. */
  readonly lockstep: boolean;
  /** Its committed height as the core last learned it; null when not seen since the core started. */
  readonly height: bigint | null;
}

/** The order of `a` and `b` by their ids' UTF-16 code units (ids are ASCII in practice: `instanceId` text). */
const byId = (a: { readonly id: string }, b: { readonly id: string }): number => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

/** The core's private instances (see the module comment): its bookkeeping's `listed`, its transport's `connected`. */
export function privateInstancesOf(
  listed: readonly LockstepInstance[],
  connected: readonly InstanceView[],
): readonly PrivateInstance[] {
  const ids = new Set(listed.map((entry) => entry.instance));
  const lockstep = listed.map((entry) =>
    Object.freeze({ id: entry.instance, connected: entry.connected, lockstep: true, height: entry.height }),
  );
  const independent = connected
    .filter((view) => !ids.has(view.instance))
    .map((view) => Object.freeze({ id: view.instance, connected: true, lockstep: false, height: view.height }))
    .sort(byId);
  return Object.freeze([...lockstep, ...independent]);
}
