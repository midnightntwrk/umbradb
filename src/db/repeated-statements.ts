/**
 * The statements without parameters that UmbraDB's own code sends at every block, which a PostgreSQL session prepares
 * (`./postgres.ts`, `Session.send`). Any other text without parameters, a module's among them, runs unnamed: parsed and
 * planned at each execution, under the session's settings then.
 *
 * A text is marked only where preparing it cannot change what it returns:
 * - every table, view and schema it names is schema-qualified, so the session's `search_path` does not choose them, and
 *   PostgreSQL resolves a prepared statement again when that setting changes;
 * - it holds no literal whose value depends on a setting or on the time it is parsed (a date or time literal, `'now'`,
 *   a cast of text to `regclass`): a prepared statement keeps the value its first parse gave;
 * - its result columns are listed, or fixed by its tables, which change only by a migration: the schema-change count
 *   then retires it on every session (`./postgres.ts`, `SchemaChanges`), and the engine never sends one of them while
 *   a statement that changes its tables is unsettled on the session (`Session.send` names it only when it is alone).
 *
 * Marking is by text, so a module that sends the very same text gets it prepared too: a text that satisfies the rules
 * above. PGlite prepares nothing, so marking changes nothing there.
 */

/** The most texts marked in a process's life: above the engine's own (a few, and one per captured table), a bound. */
const MARKED_TEXTS = 1024;

const marked = new Set<string>();

/** Marks `text` as one of the engine's own repeated statements without parameters (see the module comment); returns it. */
export function repeatedStatement(text: string): string {
  if (marked.size < MARKED_TEXTS) marked.add(text);
  return text;
}

/** Whether `text` was marked by {@link repeatedStatement}. */
export function isRepeatedStatement(text: string): boolean {
  return marked.has(text);
}
