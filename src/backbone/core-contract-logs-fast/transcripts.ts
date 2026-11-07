/**
 * What `core-contract-logs-fast` reads in a transaction's transcripts: each `log` operation of each contract call, in
 * the order the ledger would run them, with the value it logs when the transcript itself fixes it, or else the reason
 * it does not. The native transaction and the package go in; plain data comes out.
 * [CC-3, Q19 D, Q21, Q49; CORE-ARCH §4.11]
 *
 * **The order** is the ledger's (`midnight-ledger` 9.1.0.0-rc.5 `ledger/src/semantics.rs`: `apply_section` and
 * `apply_fallible`):
 * - first the guaranteed section: every intent in segment order, each intent's actions in order, and for a call its
 *   guaranteed transcript;
 * - then each fallible segment in order: that segment's intent, its actions in order, and for a call its fallible
 *   transcript;
 * - within a transcript, its program's ops in order.
 *
 * A site carries its intent's segment (the event's physical segment), whether it is in the fallible section, the call's
 * place among the intent's actions and the `log` op's place in the program.
 *
 * **The literal rule** ({@link literalAt}): the value a `log` at op i takes is a literal when op i − 1 is a `push` (its
 * `value`, `storage` either way: the VM logs the value it pushed, `onchain-vm/src/vm.rs`'s `Push` and `Log`) and no
 * `branch` or `jmp` before them can skip either — a jump at op j skips ops j + 1 to j + `skip` (`vm.rs`: the program
 * advances 1 + `skip`), so it can skip op i − 1 or op i exactly when j + `skip` ≥ i − 1; any other `log` is unsure: one
 * whose op before is not a `push` takes a value the transcript did not push there (`not-a-literal`: read from the
 * contract's state, computed, or the state itself), and one a jump may skip, or reach without its `push`, depends on a
 * value at run time (`conditional`). Execution only moves forward, so nothing after op i matters. A literal is decoded as
 * the VM decodes it, with the package's own `decodeLogItem` over its tagged serialization (`serializeStateValue`): a
 * malformed wrapper is a version-0 `Misc` log of the whole value, and data over the emitted-log bound is no log (null).
 *
 * The function takes what a ledger task takes: the native parsed object and `rawPackages()`. The module's ledger task
 * (`./task.ts`) runs it in the ledger worker on the block's one parse. It reads with the v9 package of the block's
 * ledger, the one `rawPackages()` holds: rc.5's, or rc.3's on runtime 2.0 blocks (`v9-rc3`, with the same API in a
 * module of its own). [LG-17; design §5.5]
 */

import type { LogItem } from "../../ledger/types.js";

/** Why the value a `log` takes is not read from the transcript (see the module comment). */
export type UnsureReason = "not-a-literal" | "conditional";

/** A `log` operation of a call's transcript, in the ledger's order (see the module comment): plain data. */
export interface LogSite {
  /** The segment of the call's intent: the log's physical segment. */
  readonly segment: number;
  /** True for the call's fallible transcript. */
  readonly fallible: boolean;
  /** The call's place among its intent's actions. */
  readonly call: number;
  /** The `log` op's place in the transcript's program. */
  readonly op: number;
  /** The called contract (32 bytes). */
  readonly address: Uint8Array;
  /** The call's entry point, as bytes. */
  readonly entryPoint: Uint8Array;
  /** The log the literal gives (null: none, its data over the bound), or why the value is unsure. */
  readonly read: { readonly literal: LogItem | null } | { readonly unsure: UnsureReason };
}

/** The vendored v9 package's name in `rawPackages()` (`src/ledger/releases.ts`). */
export const V9_PACKAGE = "@umbradb/vendored-ledger-v9";

/** The vendored v9 packages' names in `rawPackages()`: rc.5's, and rc.3's for runtime 2.0 blocks. */
export const V9_PACKAGES: readonly string[] = Object.freeze([V9_PACKAGE, "@umbradb/vendored-ledger-v9-rc3"]);

/** What of the v9 package the reading uses. */
interface V9Raw {
  readonly ContractCall: abstract new (...args: never[]) => object;
  readonly StateValue: { decode(value: unknown): { free(): void } };
  serializeStateValue(value: unknown): Uint8Array;
  decodeLogItem(value: Uint8Array): LogItem | null;
}

/** A transcript's program as the package gives it. */
type Program = readonly unknown[];

/** An op's name and argument, as the package's `Op` gives it: a bare string, or an object of one key. */
function opOf(op: unknown): { readonly name: string; readonly args: Readonly<Record<string, unknown>> } {
  if (typeof op === "string") return { name: op, args: {} };
  const [name, args] = Object.entries(op as Record<string, Readonly<Record<string, unknown>>>)[0] ?? [];
  if (name === undefined) throw new TypeError(`a transcript op the package does not give: ${JSON.stringify(op)}`);
  return { name, args: args ?? {} };
}

/**
 * The `log` at op `at` of `program` (see the module comment): its literal value, or why it is unsure. Throws when op
 * `at` is not a `log`.
 */
export function literalAt(program: Program, at: number): { readonly value: unknown } | UnsureReason {
  if (opOf(program[at]).name !== "log") throw new RangeError(`op ${at} of the program is not a log`);
  const before = at > 0 ? opOf(program[at - 1]) : undefined;
  if (before?.name !== "push") return "not-a-literal";
  for (let j = 0; j < at - 1; j++) {
    const { name, args } = opOf(program[j]);
    if ((name === "branch" || name === "jmp") && j + Number(args.skip) >= at - 1) return "conditional";
  }
  return { value: before.args.value };
}

/** Frees an object a getter of the package gave (a plain value has no `free`), as `src/ledger/adapter.ts` does. */
function freeGot(object: unknown): void {
  (object as { free?: () => void } | null)?.free?.();
}

const bytesOfHex = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "hex"));
const nameBytes = (name: Uint8Array | string): Uint8Array =>
  typeof name === "string" ? Uint8Array.from(Buffer.from(name, "utf8")) : Uint8Array.from(name);

/** The log a literal `value` gives, decoded as the VM decodes it (see the module comment). */
function decoded(raw: V9Raw, value: unknown): LogItem | null {
  const state = raw.StateValue.decode(value);
  try {
    return raw.decodeLogItem(raw.serializeStateValue(state));
  } finally {
    state.free();
  }
}

/**
 * The `log` sites of `transaction` — a native transaction of a v9 package (a system transaction has none) — in the
 * ledger's order (see the module comment), read with the v9 package of `packages` (`rawPackages()`: rc.5's or rc.3's).
 */
export function logSitesOf(transaction: unknown, packages: Readonly<Record<string, unknown>>): LogSite[] {
  const name = V9_PACKAGES.find((candidate) => packages[candidate] !== undefined);
  if (name === undefined) {
    throw new TypeError(`the packages hold no ${V9_PACKAGES.join(" or ")}: only ledger v9 has MIP-0002 logs`);
  }
  const raw = packages[name] as V9Raw;
  const intents = (transaction as { readonly intents?: ReadonlyMap<number, unknown> }).intents;
  const ordered = [...(intents ?? new Map<number, unknown>())].sort(([a], [b]) => a - b);
  // Each intent's calls with their transcripts, as plain data, the package's objects freed at once.
  const calls = ordered.map(([segment, intent]) => {
    const actions = (intent as { readonly actions: readonly unknown[] }).actions;
    const read = actions.flatMap((action, call) => {
      if (!(action instanceof raw.ContractCall)) return [];
      const c = action as unknown as {
        readonly address: string;
        readonly entryPoint: Uint8Array | string;
        readonly guaranteedTranscript?: { readonly program: Program };
        readonly fallibleTranscript?: { readonly program: Program };
      };
      return [
        {
          segment,
          call,
          address: bytesOfHex(c.address),
          entryPoint: nameBytes(c.entryPoint),
          guaranteed: c.guaranteedTranscript?.program,
          fallible: c.fallibleTranscript?.program,
        },
      ];
    });
    for (const action of actions) freeGot(action);
    freeGot(intent);
    return read;
  });
  const sites: LogSite[] = [];
  for (const fallible of [false, true]) {
    // No intent is at segment 0, the guaranteed one: a transaction with one is malformed (`ledger/src/verify.rs`,
    // `IntentAtGuaranteedSegmentId`), so the ledger never runs it.
    for (const call of calls.flat()) {
      const program = fallible ? call.fallible : call.guaranteed;
      (program ?? []).forEach((op, at) => {
        if (opOf(op).name !== "log") return;
        const literal = literalAt(program as Program, at);
        sites.push({
          segment: call.segment,
          fallible,
          call: call.call,
          op: at,
          address: call.address,
          entryPoint: call.entryPoint,
          read: typeof literal === "string" ? { unsure: literal } : { literal: decoded(raw, literal.value) },
        });
      });
    }
  }
  return sites;
}
