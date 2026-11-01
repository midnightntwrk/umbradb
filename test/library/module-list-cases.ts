import { startUmbraDB } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { closedByItself } from "./option-cases.js";
import { libraryData, PGLITE_MEMORY } from "./library-fixtures.js";

/**
 * L63's cases and oracle, shared by `./modules.test.ts` (the criterion) and `./modules.negative-control.test.ts` (its
 * controls, each of `loadModuleList`'s rules removed): a `modulesFrom` that cannot give its list is refused, naming the
 * URL. Imports nothing of Vitest. [L63, LM-7]
 */

/** The fixtures' directory. */
export const FIXTURES = new URL("./fixtures/", import.meta.url);

/** The rule of `loadModuleList` (`src/config/load.ts`) each case is refused by. */
export type ModuleListRule = "load-failed" | "required-export" | "not-a-list";

/** L63's cases: a module file, the reason it is refused with, and the rule that refuses it. */
export const L63_CASES: readonly (readonly [string, "load-failed" | "modules-not-a-list", ModuleListRule])[] = [
  ["modules-throws.ts", "load-failed", "load-failed"],
  ["no-such-module.ts", "load-failed", "load-failed"],
  ["modules-missing.ts", "modules-not-a-list", "required-export"],
  ["modules-not-a-list.ts", "modules-not-a-list", "not-a-list"],
];

/**
 * L63's oracle for the module file `name` (in {@link FIXTURES}) as `modulesFrom` of a process on PGlite in memory, on
 * an in-memory chain: the problems, none when `started` rejected `invalid-configuration` with `reason` and the URL as
 * `details.file`, its message naming the URL, and the process ended by itself. A process that started is stopped.
 * [L63]
 */
export async function moduleListProblems(name: string, reason: string): Promise<string[]> {
  const url = new URL(name, FIXTURES);
  // An in-memory chain, so that a start the rules let through starts at once (its node is never contacted).
  const handle = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, modulesFrom: url, source: new InMemoryBlockSource({ head: 1n }) });
  const problems: string[] = [];
  const error = await handle.started.then(
    () => null,
    (caught: { readonly code?: unknown; readonly message?: unknown; readonly details?: { readonly reason?: unknown; readonly file?: unknown } }) => caught,
  );
  if (error === null) {
    problems.push("started resolved");
    await handle.stop();
    return problems;
  }
  if (error.code !== "invalid-configuration" || error.details?.reason !== reason || error.details.file !== url.href) {
    problems.push(`refused ${String(error.code)} ${String(error.details?.reason)} at ${String(error.details?.file)}, not invalid-configuration ${reason}`);
  }
  if (!String(error.message).includes(url.href)) problems.push("the refusal's message does not name the URL");
  try {
    await closedByItself(handle);
  } catch (caught) {
    problems.push(String(caught));
    await handle.stop();
  }
  return problems;
}
