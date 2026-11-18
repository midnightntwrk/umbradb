/**
 * The check every handle a module's statements reach runs before it sends a statement: a read handle
 * (`Database.read` on both backends, and the reads of PGlite's exclusive job), a block or schema write handle
 * (`./write-handles.ts`), and the read view (`./read-view.ts`). Core. The engine's own `Transaction` is not checked: no
 * module receives one.
 *
 * Refused, by its first words:
 * - a statement that ends or nests the transaction the handle runs in: `BEGIN`, `START`, `COMMIT`, `END`,
 *   `ROLLBACK`, `ABORT`, `SAVEPOINT`, `RELEASE`, and `PREPARE TRANSACTION` (so also `COMMIT AND CHAIN`,
 *   `COMMIT PREPARED`, `ROLLBACK TO SAVEPOINT`, `ROLLBACK PREPARED`);
 * - a statement that sets the session authorization: `SET [LOCAL | SESSION] SESSION AUTHORIZATION …` and
 *   `SET [LOCAL | SESSION] session_authorization …`, the name unquoted or double-quoted. On PGlite nothing undoes a
 *   session authorization for the engine's life.
 *
 * A refused statement is never sent, so the transaction is neither ended nor aborted: the handle's next statement
 * runs. The caller throws `controlRefused` (`./errors.ts`): `database-error`, `reason: control-refused`, not retryable.
 *
 * Accepted: everything else, among it `RESET SESSION AUTHORIZATION`, `SET ROLE`, `PREPARE name AS …`, `DO` and `CALL`
 * (which the server refuses when they would end the transaction, `2D000`), and a text of two statements, which the
 * extended protocol refuses (`42601`). `set_config('session_authorization', …)` inside a `SELECT` is not caught.
 *
 * How the first words are read: spaces, `--` comments and nested `/* *\/` comments before and between them are
 * skipped, as PostgreSQL's scanner does, and ASCII letters are folded. A text the check cannot read (a comment or a
 * quoted name that never ends) passes: the server refuses it as a syntax error.
 */

/** First words that end or nest the transaction. */
const TRANSACTION_CONTROL: ReadonlySet<string> = new Set([
  "begin",
  "start",
  "commit",
  "end",
  "rollback",
  "abort",
  "savepoint",
  "release",
]);

/** One word of a statement: its text, ASCII folded unless it was double-quoted. */
interface Word {
  readonly text: string;
  readonly quoted: boolean;
}

/** PostgreSQL's whitespace (`scan.l`: space, tab, newline, carriage return, form feed, vertical tab). */
const SPACE = /[ \t\n\r\f\v]/;

/** An unquoted identifier or keyword: a letter, `_` or a non-ASCII character, then also digits and `$`. */
const BARE_WORD = /[A-Za-z_\u0080-￿][A-Za-z0-9_$\u0080-￿]*/y;

const foldAscii = (text: string): string => text.replace(/[A-Z]/g, (letter) => letter.toLowerCase());

/** The index after the spaces and comments at `from`, or null when a comment never ends. */
function skipSpaceAndComments(sql: string, from: number): number | null {
  let at = from;
  for (;;) {
    while (at < sql.length && SPACE.test(sql[at] as string)) at += 1;
    if (sql.startsWith("--", at)) {
      while (at < sql.length && sql[at] !== "\n" && sql[at] !== "\r") at += 1;
      continue;
    }
    if (!sql.startsWith("/*", at)) return at;
    let depth = 0;
    do {
      if (at >= sql.length) return null;
      if (sql.startsWith("/*", at)) {
        depth += 1;
        at += 2;
      } else if (sql.startsWith("*/", at)) {
        depth -= 1;
        at += 2;
      } else {
        at += 1;
      }
    } while (depth > 0);
  }
}

/** Up to `count` words at the start of `sql`, stopping at anything else; null when the text cannot be read. */
function leadingWords(sql: string, count: number): Word[] | null {
  const words: Word[] = [];
  let at = 0;
  while (words.length < count) {
    const next = skipSpaceAndComments(sql, at);
    if (next === null) return null;
    at = next;
    if (sql[at] === '"') {
      let text = "";
      for (at += 1; ; at += 1) {
        if (at >= sql.length) return null;
        if (sql[at] === '"') {
          if (sql[at + 1] !== '"') break;
          at += 1;
        }
        text += sql[at];
      }
      at += 1;
      words.push({ text, quoted: true });
      continue;
    }
    BARE_WORD.lastIndex = at;
    const bare = BARE_WORD.exec(sql);
    if (bare === null) break;
    at += bare[0].length;
    words.push({ text: foldAscii(bare[0]), quoted: false });
  }
  return words;
}

const isKeyword = (word: Word | undefined, keyword: string): boolean => word?.quoted === false && word.text === keyword;

/**
 * The command `sql` would run that a module's handle refuses (see the module comment) — `COMMIT`,
 * `PREPARE TRANSACTION`, `SET SESSION AUTHORIZATION`, … — or null when it is accepted.
 */
export function controlStatement(sql: string): string | null {
  const words = leadingWords(sql, 4);
  if (words === null) return null;
  const [first, second] = words;
  if (first === undefined || first.quoted) return null;
  if (TRANSACTION_CONTROL.has(first.text)) return first.text.toUpperCase();
  if (first.text === "prepare" && isKeyword(second, "transaction")) return "PREPARE TRANSACTION";
  if (first.text !== "set") return null;
  let rest = words.slice(1);
  const authorization = (at: readonly Word[]): boolean =>
    (isKeyword(at[0], "session") && isKeyword(at[1], "authorization")) ||
    (at[0] !== undefined && foldAscii(at[0].text) === "session_authorization");
  if (!authorization(rest) && (isKeyword(rest[0], "local") || isKeyword(rest[0], "session"))) rest = rest.slice(1);
  return authorization(rest) ? "SET SESSION AUTHORIZATION" : null;
}
