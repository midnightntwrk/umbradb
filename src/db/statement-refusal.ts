/**
 * The check every handle a module's statements reach runs before it sends a statement: a read handle
 * (`Database.read` on both backends, and the reads of PGlite's exclusive job), a block or schema write handle
 * (`./write-handles.ts`), and the read view (`./read-view.ts`). Core. The engine's own `Transaction` is not checked: no
 * module receives one.
 *
 * Refused, by the first words of the text's first statement:
 * - a statement that ends or nests the transaction the handle runs in: `BEGIN`, `START`, `COMMIT`, `END`,
 *   `ROLLBACK`, `ABORT`, `SAVEPOINT`, `RELEASE`, and `PREPARE TRANSACTION` (so also `COMMIT AND CHAIN`,
 *   `COMMIT PREPARED`, `ROLLBACK TO SAVEPOINT`, `ROLLBACK PREPARED`);
 * - a statement that sets the session authorization: `SET [LOCAL | SESSION] SESSION AUTHORIZATION …` and
 *   `SET [LOCAL | SESSION] session_authorization …`, the name unquoted, double-quoted, or a Unicode name (`U&"…"`,
 *   its escapes read, also with `UESCAPE '<character>'`). On PGlite nothing undoes a session authorization for the
 *   engine's life.
 *
 * A refused statement is never sent, so the transaction is neither ended nor aborted: the handle's next statement
 * runs. The caller throws `controlRefused` (`./errors.ts`): `database-error`, `reason: control-refused`, not retryable.
 *
 * **One statement per text.** Every handle method sends its text on the extended protocol (`Session.run` on
 * PostgreSQL, the engine's `query` on PGlite), where the server refuses a text of two statements before running either
 * (`42601`). PostgreSQL drops empty statements, so `; COMMIT` is one statement there: the check skips leading
 * semicolons, with the spaces and comments between them, before it reads the first words. A migration's text is not
 * sent through a handle: it runs on the simple protocol (`./multi-statement.ts`), unchecked here, and the migration
 * runner fails a migration that ended its transaction (`./migrate.ts`).
 *
 * Accepted: everything else, among it `RESET SESSION AUTHORIZATION`, `SET ROLE`, `PREPARE name AS …` (also a
 * statement named `transaction`: `PREPARE transaction AS …`, `PREPARE transaction (…) AS …`), `EXECUTE` (the server
 * prepares no transaction control by name: `PREPARE p AS COMMIT` is a syntax error), and `DO` and `CALL` (which the
 * server refuses when they would end the transaction, `2D000`). `set_config('session_authorization', …)` inside a
 * `SELECT` is not caught.
 *
 * How the words are read: spaces, `--` comments and nested `/* *\/` comments before and between them are skipped, as
 * PostgreSQL's scanner does, and ASCII letters are folded. A text the server refuses as a syntax error passes
 * unrefused: a comment or a quoted name that never ends, a Unicode name with an escape that is none, or an escape
 * character PostgreSQL does not allow. One reading is wider than the server's: a Unicode name whose `UESCAPE` is not
 * followed by a plain string of one character (`E'!'`, `$$!$$`, which the server takes) is not decoded, and as a
 * setting's name after `SET` it is refused as if it named the session authorization.
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

/** One word of a statement: its text, ASCII folded unless it was quoted. */
interface Word {
  readonly text: string;
  /** True for a double-quoted name and a Unicode name: never a keyword. */
  readonly quoted: boolean;
  /** True for a Unicode name the check did not decode (see the module comment): it may spell any name. */
  readonly undecoded?: true;
}

/** A text and the place the check has read it up to. */
interface Reader {
  readonly sql: string;
  at: number;
}

/** PostgreSQL's whitespace (`scan.l`: space, tab, newline, carriage return, form feed, vertical tab). */
const SPACE = /[ \t\n\r\f\v]/;

/** An unquoted identifier or keyword: a letter, `_` or a non-ASCII character, then also digits and `$`. */
const BARE_WORD = /[A-Za-z_\u0080-￿][A-Za-z0-9_$\u0080-￿]*/y;

/** What follows the escape character in a Unicode name: four hexadecimal digits, or `+` and six. */
const ESCAPED = /([0-9A-Fa-f]{4})|\+([0-9A-Fa-f]{6})/y;

/** What PostgreSQL refuses as the character of `UESCAPE`: a hexadecimal digit, `+`, a quote, or whitespace. */
const NO_ESCAPE_CHARACTER = /[0-9A-Fa-f+'" \t\n\r\f\v]/;

const foldAscii = (text: string): string => text.replace(/[A-Z]/g, (letter) => letter.toLowerCase());

/** Moves past the spaces and comments at the reader's place; false when a comment never ends. */
function skipSpaceAndComments(reader: Reader): boolean {
  const { sql } = reader;
  let at = reader.at;
  for (;;) {
    while (at < sql.length && SPACE.test(sql[at] as string)) at += 1;
    if (sql.startsWith("--", at)) {
      while (at < sql.length && sql[at] !== "\n" && sql[at] !== "\r") at += 1;
      continue;
    }
    if (!sql.startsWith("/*", at)) {
      reader.at = at;
      return true;
    }
    let depth = 0;
    do {
      if (at >= sql.length) return false;
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

/**
 * The text between the double quote at `from` and the one that closes it (`""` inside is one quote), with the reader
 * moved past it; null when it never closes.
 */
function quotedText(reader: Reader, from: number): string | null {
  const { sql } = reader;
  let text = "";
  for (let at = from + 1; ; at += 1) {
    if (at >= sql.length) return null;
    if (sql[at] === '"') {
      if (sql[at + 1] !== '"') {
        reader.at = at + 1;
        return text;
      }
      at += 1;
    }
    text += sql[at];
  }
}

/** `raw` with its Unicode escapes replaced (`\XXXX`, `\+XXXXXX`, the escape character doubled); null for an escape that is none. */
function unescaped(raw: string, escape: string): string | null {
  let text = "";
  for (let at = 0; at < raw.length; ) {
    if (raw[at] !== escape) {
      text += raw[at];
      at += 1;
    } else if (raw[at + 1] === escape) {
      text += escape;
      at += 2;
    } else {
      ESCAPED.lastIndex = at + 1;
      const digits = ESCAPED.exec(raw);
      if (digits === null) return null;
      const code = Number.parseInt((digits[1] ?? digits[2]) as string, 16);
      if (code > 0x10ffff) return null;
      text += String.fromCodePoint(code);
      at += 1 + digits[0].length;
    }
  }
  return text;
}

/**
 * The Unicode name (`U&"…"`) at the reader's place, decoded with the character of the `UESCAPE` that follows it, or
 * with `\`; null when the server refuses it (see the module comment).
 */
function unicodeName(reader: Reader): Word | null {
  const { sql } = reader;
  const raw = quotedText(reader, reader.at + 2);
  if (raw === null) return null;
  let escape = "\\";
  const after: Reader = { sql, at: reader.at };
  if (!skipSpaceAndComments(after)) return null;
  BARE_WORD.lastIndex = after.at;
  const next = BARE_WORD.exec(sql);
  if (next !== null && foldAscii(next[0]) === "uescape") {
    after.at += next[0].length;
    if (!skipSpaceAndComments(after)) return null;
    const at = after.at;
    const character = sql[at + 1];
    // A plain string of one character; any other spelling of the string is left undecoded.
    if (sql[at] !== "'" || character === undefined || character === "'" || sql[at + 2] !== "'" || sql[at + 3] === "'") {
      return { text: raw, quoted: true, undecoded: true };
    }
    if (NO_ESCAPE_CHARACTER.test(character)) return null;
    escape = character;
    reader.at = at + 3;
  }
  const text = unescaped(raw, escape);
  return text === null ? null : { text, quoted: true };
}

/** The word at the reader's place, past it; undefined when something else is there, null when it cannot be read. */
function nextWord(reader: Reader): Word | undefined | null {
  if (!skipSpaceAndComments(reader)) return null;
  const { sql } = reader;
  if (sql[reader.at] === '"') {
    const text = quotedText(reader, reader.at);
    return text === null ? null : { text, quoted: true };
  }
  if ((sql[reader.at] === "U" || sql[reader.at] === "u") && sql.startsWith('&"', reader.at + 1)) return unicodeName(reader);
  BARE_WORD.lastIndex = reader.at;
  const bare = BARE_WORD.exec(sql);
  if (bare === null) return undefined;
  reader.at += bare[0].length;
  return { text: foldAscii(bare[0]), quoted: false };
}

const isKeyword = (word: Word | undefined | null, keyword: string): boolean =>
  word != null && !word.quoted && word.text === keyword;

/**
 * After `PREPARE`: true for `PREPARE TRANSACTION <string>`, false for a statement prepared by name, also one named
 * `transaction` (`PREPARE transaction AS …`, `PREPARE transaction (…) AS …`).
 */
function preparesTransaction(reader: Reader): boolean {
  if (!isKeyword(nextWord(reader), "transaction")) return false;
  if (!skipSpaceAndComments(reader) || reader.sql[reader.at] === "(") return false;
  const then = nextWord(reader);
  return then !== null && !isKeyword(then, "as");
}

/** After `SET`: true when the statement sets the session authorization, under any of its spellings. */
function setsAuthorization(reader: Reader): boolean {
  let word = nextWord(reader);
  // `SET SESSION AUTHORIZATION …`, or the scope of `SET LOCAL …` and `SET SESSION …` before the setting.
  if (isKeyword(word, "session")) {
    word = nextWord(reader);
    if (isKeyword(word, "authorization")) return true;
  } else if (isKeyword(word, "local")) {
    word = nextWord(reader);
  }
  if (word == null) return false;
  if (isKeyword(word, "session")) return isKeyword(nextWord(reader), "authorization");
  if (word.undecoded === true) return true;
  // PostgreSQL finds a setting by its name whatever the case of its ASCII letters, quoted or not.
  if (foldAscii(word.text) !== "session_authorization") return false;
  // `session_authorization.x` is another setting, one of a module's own naming.
  return skipSpaceAndComments(reader) && reader.sql[reader.at] !== ".";
}

/**
 * The command `sql` would run that a module's handle refuses (see the module comment) — `COMMIT`,
 * `PREPARE TRANSACTION`, `SET SESSION AUTHORIZATION`, … — or null when it is accepted.
 */
export function controlStatement(sql: string): string | null {
  const reader: Reader = { sql, at: 0 };
  // Leading empty statements: the server drops them, so the first statement with words is the one that runs.
  for (;;) {
    if (!skipSpaceAndComments(reader)) return null;
    if (sql[reader.at] !== ";") break;
    reader.at += 1;
  }
  const first = nextWord(reader);
  if (first == null || first.quoted) return null;
  if (TRANSACTION_CONTROL.has(first.text)) return first.text.toUpperCase();
  if (first.text === "prepare") return preparesTransaction(reader) ? "PREPARE TRANSACTION" : null;
  if (first.text === "set") return setsAuthorization(reader) ? "SET SESSION AUTHORIZATION" : null;
  return null;
}
