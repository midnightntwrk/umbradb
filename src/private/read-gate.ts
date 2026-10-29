/**
 * The core's gate on the statements of a transport `read`. A private process sends SQL text that the core runs on the
 * public database in one read (`Database.read`): a `REPEATABLE READ READ ONLY` transaction, in which the database
 * itself refuses every write. [PP-4, A172; design §8]
 *
 * What the read-only transaction cannot stop:
 * - a statement that leaves it (`COMMIT`, `ROLLBACK`), after which the next statement runs with the core's own login,
 *   which may write;
 * - a statement that changes the session (`SET`, `RESET`, `SET ROLE`, `LISTEN`, `PREPARE`), which on PostgreSQL
 *   outlives the read on a pooled connection, and on PGlite reaches the writer's one session;
 * - a function that acts outside the transaction: `pg_advisory_lock` holds its lock past the read's end,
 *   `pg_terminate_backend` ends another session, `set_config` changes a setting or the role, and `query_to_xml` runs
 *   SQL given as text, around this gate.
 *
 * So, before the core runs any statement of a `read`, each must be **one read**:
 * - **Its command is a read**: its first word, after any opening parentheses, is `SELECT`, `WITH`, `VALUES` or `TABLE`.
 *   No such statement can end a transaction or change the session: PostgreSQL runs transaction and session control only
 *   as statements of their own, and a function a `SELECT` calls cannot commit (a procedure, which can, needs `CALL`,
 *   and commits only outside a transaction block). A `WITH` that writes (`WITH d AS (DELETE …) SELECT …`), `SELECT …
 *   FOR UPDATE` and `SELECT … INTO` are reads by their first word, and the database refuses them in the read-only
 *   transaction.
 * - **One statement**: nothing but `;`, spaces and comments after a `;` (PostgreSQL's extended protocol, on which both
 *   backends run a read's statements, refuses a second statement too).
 * - **It names no function or catalog the core refuses** ({@link isRefusedName}): any name starting with `pg_` — the
 *   server's own functions (`pg_advisory_lock`, `pg_terminate_backend`, `pg_read_file`, …) and catalogs (`pg_authid`)
 *   —, `dblink`'s, `binary_upgrade_`'s, and {@link REFUSED_FUNCTIONS}: the functions that change a setting, a sequence,
 *   a large object or an index, or run SQL given as text. A name is refused wherever it stands — called, quoted
 *   (`"pg_advisory_lock"`), qualified (`pg_catalog.set_config`) or as a column —, matched without regard to ASCII case.
 * - **It can be read**: no unterminated literal, comment or quoted name, no Unicode escape (`U&'…'`, `U&"…"`, whose
 *   decoded name the gate would have to decode as the server does) and no NUL character.
 *
 * **Reading the text.** The gate splits the text into tokens as PostgreSQL 18's lexer does (`scan.l`): spaces; `--`
 * and nested `/* … *\/` comments; strings — `'…'` with `''`, `E'…'` with backslash escapes, `B'…'` and `X'…'` ended
 * by their first quote, `N'…'`, dollar-quoted `$tag$…$tag$` —; quoted names `"…"` with `""`; parameters `$1`; numbers;
 * unquoted words, folded to lower case as PostgreSQL folds them (ASCII only); and single characters. A plain `'…'`
 * string reads differently when the session's `standard_conforming_strings` is off (a backslash then escapes the next
 * character), which the core does not pin: so the text is read both ways, and a statement must pass both. Where the
 * gate could read a text otherwise than the server it errs toward refusing: a text it cannot end is unreadable, and a
 * number followed by a letter is read as two tokens, so a name after it is still seen (PostgreSQL 15 and later refuse
 * such a text as trailing junk). The gate parses nothing beyond tokens.
 *
 * **Why a gate and not only the database.** On PGlite the read runs on the engine's one session (the writer's), under
 * its superuser, so apart from the read-only transaction there is no role or login by which the database could refuse a
 * write. On PostgreSQL the read pool logs in as the writer's login (OUTDATED), and a role entered with `SET ROLE` is left with
 * `RESET ROLE` or `set_config('role', …)`: a login that may only read needs a setting of its own
 * (`core.transportReader`, `./transport-reader.ts`). Either way the database refuses the write; the gate keeps every
 * statement inside the read-only transaction in which the database refuses it. [PP-4; design §8]
 */

/** Why the core refuses a statement of a `read` (`read-result.refused.reason`), in the order the gate checks them. */
export const READ_REFUSAL_REASONS = ["unreadable", "command", "statements", "function"] as const;

/** One of {@link READ_REFUSAL_REASONS}. */
export type ReadRefusalReason = (typeof READ_REFUSAL_REASONS)[number];

/** A refused statement: why, and what it names (see {@link readRefusal}). */
export interface ReadRefusal {
  readonly reason: ReadRefusalReason;
  /**
   * `command`: the statement's first word, in upper case (`COMMIT`), or null when it has none (empty, or a literal or
   * symbol first); `function`: the name the core refuses (`pg_advisory_lock`), folded as PostgreSQL folds it; null for
   * `statements` and `unreadable`. At most {@link NAME_MAX} characters, printable ASCII (any other character `?`).
   */
  readonly name: string | null;
}

/** A refused statement of a `read`: its index in `statements` and why. */
export interface RefusedStatement extends ReadRefusal {
  readonly statement: number;
}

/** The longest name a refusal carries (PostgreSQL's names are at most 63 bytes). */
export const NAME_MAX = 64;

/** The first words a read may start with. */
export const READ_COMMANDS: readonly string[] = ["select", "with", "values", "table"];

/** The prefixes of the names the core refuses: PostgreSQL's functions and catalogs, `dblink`'s, the upgrade's. */
export const REFUSED_PREFIXES: readonly string[] = ["pg_", "dblink", "binary_upgrade_"];

/**
 * The functions the core refuses by name, besides {@link REFUSED_PREFIXES}: a setting or the role (`set_config`), the
 * random seed (`setseed`), a sequence (`nextval`, `setval`), SQL given as text (`query_to_xml` and its kin, `ts_stat`,
 * `ts_rewrite`) or relations and schemas given by name (`table_to_xml`, `schema_to_xml`, `database_to_xml` and their
 * kin), an index (`brin_summarize_new_values`, `brin_summarize_range`, `brin_desummarize_range`,
 * `gin_clean_pending_list`), and large objects (`lo_*`, `loread`, `lowrite`).
 */
export const REFUSED_FUNCTIONS: ReadonlySet<string> = new Set([
  "set_config",
  "setseed",
  "nextval",
  "setval",
  "query_to_xml",
  "query_to_xmlschema",
  "query_to_xml_and_xmlschema",
  "cursor_to_xml",
  "cursor_to_xmlschema",
  "table_to_xml",
  "table_to_xmlschema",
  "table_to_xml_and_xmlschema",
  "schema_to_xml",
  "schema_to_xmlschema",
  "schema_to_xml_and_xmlschema",
  "database_to_xml",
  "database_to_xmlschema",
  "database_to_xml_and_xmlschema",
  "ts_stat",
  "ts_rewrite",
  "brin_summarize_new_values",
  "brin_summarize_range",
  "brin_desummarize_range",
  "gin_clean_pending_list",
  "lo_close",
  "lo_creat",
  "lo_create",
  "lo_export",
  "lo_from_bytea",
  "lo_get",
  "lo_import",
  "lo_lseek",
  "lo_lseek64",
  "lo_open",
  "lo_put",
  "lo_tell",
  "lo_tell64",
  "lo_truncate",
  "lo_truncate64",
  "lo_unlink",
  "loread",
  "lowrite",
]);

/** Whether the core refuses a statement that holds `name` (folded to ASCII lower case first). */
export function isRefusedName(name: string): boolean {
  const folded = foldAscii(name);
  return REFUSED_FUNCTIONS.has(folded) || REFUSED_PREFIXES.some((prefix) => folded.startsWith(prefix));
}

/** One token of a statement's text (see the module comment). */
type Token =
  /** An unquoted word, folded to lower case. */
  | { readonly kind: "word"; readonly text: string }
  /** A quoted name, its quotes undone. */
  | { readonly kind: "quoted"; readonly text: string }
  /** A string, a number or a parameter. */
  | { readonly kind: "literal" }
  /** Any other character. */
  | { readonly kind: "symbol"; readonly text: string };

/** ASCII upper case to lower case, as PostgreSQL folds an unquoted name in a multibyte encoding. */
function foldAscii(text: string): string {
  return text.replace(/[A-Z]+/g, (upper) => upper.toLowerCase());
}

const isSpace = (c: string): boolean => c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f" || c === "\v";
const isDigit = (c: string): boolean => c >= "0" && c <= "9";
/** PostgreSQL's `ident_start`: a letter, `_` or any character beyond ASCII. */
const isWordStart = (c: string): boolean =>
  (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_" || c >= "\u0080";
/** PostgreSQL's `ident_cont`: also digits and `$`. */
const isWordPart = (c: string): boolean => isWordStart(c) || isDigit(c) || c === "$";
/** A dollar quote's tag: `dolq_start` then `dolq_cont` (no `$`). */
const DOLLAR_TAG = /^\$(?:[A-Za-z_\u0080-￿][A-Za-z_0-9\u0080-￿]*)?\$/;

/** Thrown inside {@link tokens} for a text the gate cannot read. */
class Unreadable extends Error {}

/**
 * The index just past the string whose opening quote is at `open`: `''` stands for a quote; with `backslashes`, a
 * backslash escapes the next character. Throws {@link Unreadable} when the text ends first.
 */
function stringEnd(sql: string, open: number, backslashes: boolean): number {
  let i = open + 1;
  for (;;) {
    if (i >= sql.length) throw new Unreadable();
    const c = sql[i] as string;
    if (backslashes && c === "\\") {
      i += 2;
    } else if (c === "'") {
      if (sql[i + 1] === "'") i += 2;
      else return i + 1;
    } else {
      i += 1;
    }
  }
}

/** The tokens of `sql`, its plain strings read with `standardStrings` (`standard_conforming_strings`) on or off. */
function tokens(sql: string, standardStrings: boolean): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < sql.length) {
    const c = sql[i] as string;
    const next = sql[i + 1];
    if (isSpace(c)) {
      i += 1;
    } else if (c === "-" && next === "-") {
      while (i < sql.length && sql[i] !== "\n" && sql[i] !== "\r") i += 1;
    } else if (c === "/" && next === "*") {
      let depth = 1;
      i += 2;
      while (depth > 0) {
        if (i >= sql.length) throw new Unreadable();
        if (sql[i] === "/" && sql[i + 1] === "*") {
          depth += 1;
          i += 2;
        } else if (sql[i] === "*" && sql[i + 1] === "/") {
          depth -= 1;
          i += 2;
        } else {
          i += 1;
        }
      }
    } else if (c === "'") {
      i = stringEnd(sql, i, !standardStrings);
      out.push({ kind: "literal" });
    } else if (c === '"') {
      let text = "";
      i += 1;
      for (;;) {
        if (i >= sql.length) throw new Unreadable();
        if (sql[i] === '"') {
          if (sql[i + 1] !== '"') break;
          text += '"';
          i += 2;
        } else {
          text += sql[i];
          i += 1;
        }
      }
      i += 1;
      out.push({ kind: "quoted", text });
    } else if (c === "$" && next !== undefined && isDigit(next)) {
      i += 1;
      while (i < sql.length && isDigit(sql[i] as string)) i += 1;
      out.push({ kind: "literal" });
    } else if (c === "$" && DOLLAR_TAG.test(sql.slice(i))) {
      const tag = (DOLLAR_TAG.exec(sql.slice(i)) as RegExpExecArray)[0];
      const close = sql.indexOf(tag, i + tag.length);
      if (close < 0) throw new Unreadable();
      i = close + tag.length;
      out.push({ kind: "literal" });
    } else if (isDigit(c) || (c === "." && next !== undefined && isDigit(next))) {
      // Digits, `_`, `.` and an exponent; a letter after them starts a word of its own (the server's trailing junk).
      while (i < sql.length && (isDigit(sql[i] as string) || sql[i] === "_" || sql[i] === ".")) i += 1;
      if ((sql[i] === "e" || sql[i] === "E") && /^[eE][+-]?[0-9]/.test(sql.slice(i))) {
        i += sql[i + 1] === "+" || sql[i + 1] === "-" ? 2 : 1;
        while (i < sql.length && isDigit(sql[i] as string)) i += 1;
      }
      out.push({ kind: "literal" });
    } else if (isWordStart(c)) {
      const start = i;
      while (i < sql.length && isWordPart(sql[i] as string)) i += 1;
      const word = sql.slice(start, i);
      const quote = sql[i];
      if ((word === "u" || word === "U") && quote === "&" && (sql[i + 1] === "'" || sql[i + 1] === '"')) {
        throw new Unreadable();
      }
      if (word.length === 1 && quote === "'" && "eEbBxXnN".includes(word)) {
        // E'…' (backslash escapes), B'…' and X'…' (ended by the first quote), N'…' (a plain string).
        if (word === "e" || word === "E") i = stringEnd(sql, i, true);
        else if (word === "n" || word === "N") i = stringEnd(sql, i, !standardStrings);
        else {
          const close = sql.indexOf("'", i + 1);
          if (close < 0) throw new Unreadable();
          i = close + 1;
        }
        out.push({ kind: "literal" });
      } else {
        out.push({ kind: "word", text: foldAscii(word) });
      }
    } else {
      out.push({ kind: "symbol", text: c });
      i += 1;
    }
  }
  return out;
}

/**
 * A name as a refusal carries it — the core logs it, and a private process's error message holds it —: at most
 * {@link NAME_MAX} characters, each outside printable ASCII (a line break in a quoted name, say) as `?`.
 */
const reported = (name: string): string => name.slice(0, NAME_MAX).replace(/[^\x21-\x7e]/g, "?");
const isSemicolon = (token: Token): boolean => token.kind === "symbol" && token.text === ";";

/** The refusal of a statement read one way ({@link tokens}), or null. */
function refusalOf(list: readonly Token[]): ReadRefusal | null {
  const first = list.find((token) => !(token.kind === "symbol" && token.text === "("));
  if (first === undefined || first.kind !== "word" || !READ_COMMANDS.includes(first.text)) {
    return { reason: "command", name: first?.kind === "word" ? reported(first.text.toUpperCase()) : null };
  }
  const semicolon = list.findIndex(isSemicolon);
  if (semicolon >= 0 && list.slice(semicolon).some((token) => !isSemicolon(token))) {
    return { reason: "statements", name: null };
  }
  for (const token of list) {
    if ((token.kind === "word" || token.kind === "quoted") && isRefusedName(token.text)) {
      return { reason: "function", name: reported(foldAscii(token.text)) };
    }
  }
  return null;
}

/**
 * Why the core refuses `sql` as a statement of a transport `read` (see the module comment), or null when it is one read
 * the core runs. Read with `standard_conforming_strings` on and off, the first refusal found.
 */
export function readRefusal(sql: string): ReadRefusal | null {
  if (sql.includes("\u0000")) return { reason: "unreadable", name: null };
  try {
    return refusalOf(tokens(sql, true)) ?? refusalOf(tokens(sql, false));
  } catch (error) {
    if (error instanceof Unreadable) return { reason: "unreadable", name: null };
    throw error;
  }
}

/** The first statement of `statements` the core refuses, with its index, or null when it runs them all. */
export function refusedStatement(statements: readonly { readonly sql: string }[]): RefusedStatement | null {
  for (const [statement, { sql }] of statements.entries()) {
    const refusal = readRefusal(sql);
    if (refusal !== null) return { statement, ...refusal };
  }
  return null;
}
