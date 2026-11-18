/**
 * The statements without parameters that UmbraDB's own code sends at every block, which a PostgreSQL session prepares
 * (`./postgres.ts`, `Session.send`). Any other text without parameters, a module's among them, runs unnamed: parsed and
 * planned at each execution, under the session's settings then.
 *
 * The mark is an object, not the text's value. {@link repeatedStatement} wraps a text in a {@link RepeatedStatement},
 * and the engine passes that object to a handle's `query` where it would pass the text. The PostgreSQL backend prepares
 * a statement only when it is handed such an object; a string runs as a string always did, also one equal to a marked
 * text. Every handle built on another passes the object on, or takes its text with {@link statementText}: the PGlite
 * backend, which prepares nothing, and a handle that sends the text elsewhere (the private process's transport). A
 * handle that passes on the text alone loses the mark, and the statement runs unnamed. A marked statement given
 * parameters is prepared as any text with parameters is.
 *
 * The class is not part of the package's exports, so only UmbraDB's own code makes one.
 *
 * A text is marked only where preparing it cannot change what it returns:
 * - every table, view and schema it names is schema-qualified, so the session's `search_path` does not choose them, and
 *   PostgreSQL resolves a prepared statement again when that setting changes;
 * - it holds no literal whose value depends on a setting or on the time it is parsed (a date or time literal, `'now'`,
 *   a cast of text to `regclass`): a prepared statement keeps the value its first parse gave;
 * - its result columns are listed, or fixed by its tables, which change only by a migration: the schema-change count
 *   then retires it on every session that holds it prepared (`./postgres.ts`, `SchemaChanges`), and the engine never
 *   sends one of them while a statement that changes its tables is unsettled on the session (`Session.send` names it
 *   only when it is alone).
 */

/** A statement without parameters the engine repeats at every block: its text, marked (see the module comment). */
export class RepeatedStatement {
  readonly #text: string;

  constructor(text: string) {
    this.#text = text;
    Object.freeze(this);
  }

  /** The statement's text. */
  get text(): string {
    return this.#text;
  }
}

/** A statement as a handle's `query` and `execute` take it: its text, or the engine's marked statement. */
export type Statement = string | RepeatedStatement;

/** Marks `text` as one of the engine's own repeated statements without parameters (see the module comment). */
export function repeatedStatement(text: string): RepeatedStatement {
  return new RepeatedStatement(text);
}

/** The text of `statement`. */
export function statementText(statement: Statement): string {
  return typeof statement === "string" ? statement : statement.text;
}
