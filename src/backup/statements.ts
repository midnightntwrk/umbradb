/**
 * The statements of a backup's dump. A restore runs the file's SQL itself, statement by statement, in one transaction,
 * without `psql`. So it splits the plain SQL that `pg_dump` wrote as PostgreSQL's lexer reads it, and handles what the
 * tool writes for `psql` alone as `psql` would. [BK-3; design §9.1]
 *
 * **Statements** end at a `;` outside a string, an identifier, a dollar-quoted body and a comment: `'…'` (a doubled
 * quote inside), `E'…'` (with backslash escapes), `"…"` (a doubled quote inside), `$tag$…$tag$`, `-- …` to the end of
 * the line and `/* … *\/` (nested). A statement's text keeps its comments; one that holds nothing but comments and
 * blank space is none. The file is read line by line (no token of these spans a line end except strings, bodies and
 * block comments, which the state carries), so a dump of any size streams.
 *
 * **`psql`'s meta-commands:** `pg_dump` 18 writes `\restrict <key>` first and `\unrestrict <key>` last (they forbid
 * any other meta-command in between, so a crafted file cannot run one); a line starting with `\` where a statement
 * would start is a meta-command. `\restrict` and `\unrestrict` are taken as `psql` takes them (the key must match);
 * any other meta-command is refused, and so is a `COPY … FROM stdin` (its data lines are no SQL; `--inserts` never
 * writes one) and a file that ends inside a statement, a string or a comment: `backup-format-unknown`, found by the
 * check before loading ({@link checkStatements}), so nothing of such a file runs.
 */

import { formatUnknown } from "./manifest.js";

/** What the splitter is inside of. */
type State =
  | { readonly kind: "code" }
  | { readonly kind: "string"; readonly escapes: boolean }
  | { readonly kind: "identifier" }
  | { readonly kind: "dollar"; readonly tag: string }
  | { readonly kind: "block-comment"; readonly depth: number };

/** One piece of the file: a statement to run, or a `psql` meta-command with its line (1-based). */
export type Piece =
  | { readonly kind: "statement"; readonly sql: string; readonly line: number }
  | { readonly kind: "meta"; readonly command: string; readonly line: number };

const CODE: State = { kind: "code" };
const IDENTIFIER_CHAR = /[A-Za-z0-9_$\u0080-￿]/;
const DOLLAR_TAG = /^\$([A-Za-z_\u0080-￿][A-Za-z0-9_\u0080-￿]*)?\$/;

/** Splits SQL into its pieces (see the module comment): fed lines, it gives each piece once it is complete. */
export class StatementSplitter {
  #state: State = CODE;
  #text = "";
  /** Whether the statement so far holds anything but blank space and comments. */
  #content = false;
  #line = 0;
  #startLine = 1;

  /** The pieces `line` (one line of the file, without its line end) completes. */
  push(line: string): Piece[] {
    this.#line += 1;
    const pieces: Piece[] = [];
    if (this.#state.kind === "code" && !this.#content && line.startsWith("\\")) {
      pieces.push({ kind: "meta", command: line, line: this.#line });
      this.#text = "";
      return pieces;
    }
    if (!this.#content && this.#text.trim() === "") this.#startLine = this.#line;
    const text = `${line}\n`;
    let i = 0;
    while (i < text.length) {
      const state = this.#state;
      const char = text[i] as string;
      if (state.kind === "code") {
        const next = text[i + 1];
        if (char === "-" && next === "-") {
          this.#text += text.slice(i);
          break;
        }
        if (char === "/" && next === "*") {
          this.#state = { kind: "block-comment", depth: 1 };
          this.#text += "/*";
          i += 2;
          continue;
        }
        if (char === ";") {
          this.#text += ";";
          if (this.#content) pieces.push({ kind: "statement", sql: this.#text.trim(), line: this.#startLine });
          this.#text = "";
          this.#content = false;
          this.#startLine = this.#line;
          i += 1;
          continue;
        }
        if (char === "'") {
          const before = this.#text.slice(-1);
          const prior = this.#text.slice(-2, -1);
          const escapes = (before === "E" || before === "e") && !IDENTIFIER_CHAR.test(prior);
          this.#state = { kind: "string", escapes };
        } else if (char === '"') {
          this.#state = { kind: "identifier" };
        } else if (char === "$" && !IDENTIFIER_CHAR.test(this.#text.slice(-1))) {
          const tag = DOLLAR_TAG.exec(text.slice(i));
          if (tag !== null) {
            this.#state = { kind: "dollar", tag: tag[0] };
            this.#text += tag[0];
            this.#content = true;
            i += tag[0].length;
            continue;
          }
        }
        if (!/\s/.test(char)) this.#content = true;
        this.#text += char;
        i += 1;
        continue;
      }
      if (state.kind === "string") {
        if (state.escapes && char === "\\") {
          this.#text += text.slice(i, i + 2);
          i += 2;
          continue;
        }
        if (char === "'") {
          if (text[i + 1] === "'") {
            this.#text += "''";
            i += 2;
            continue;
          }
          this.#state = CODE;
        }
        this.#text += char;
        i += 1;
        continue;
      }
      if (state.kind === "identifier") {
        if (char === '"') {
          if (text[i + 1] === '"') {
            this.#text += '""';
            i += 2;
            continue;
          }
          this.#state = CODE;
        }
        this.#text += char;
        i += 1;
        continue;
      }
      if (state.kind === "dollar") {
        if (char === "$" && text.startsWith(state.tag, i)) {
          this.#text += state.tag;
          this.#state = CODE;
          i += state.tag.length;
          continue;
        }
        this.#text += char;
        i += 1;
        continue;
      }
      // A block comment, which nests.
      if (char === "*" && text[i + 1] === "/") {
        this.#text += "*/";
        this.#state = state.depth === 1 ? CODE : { kind: "block-comment", depth: state.depth - 1 };
        i += 2;
        continue;
      }
      if (char === "/" && text[i + 1] === "*") {
        this.#text += "/*";
        this.#state = { kind: "block-comment", depth: state.depth + 1 };
        i += 2;
        continue;
      }
      this.#text += char;
      i += 1;
    }
    return pieces;
  }

  /** Ends the file: what is left must be blank space and comments, outside any string, body or comment. */
  end(): void {
    if (this.#state.kind !== "code" || this.#content) {
      const inside = {
        code: "a statement",
        string: "a string",
        identifier: "a quoted identifier",
        dollar: "a dollar-quoted body",
        "block-comment": "a comment",
      }[this.#state.kind];
      throw formatUnknown(`the file ends inside ${inside} (from line ${this.#startLine}), so it is not a whole dump`, {
        reason: "truncated",
        line: this.#startLine,
      });
    }
  }
}

/** A `COPY … FROM stdin`, whose data `psql` would read from the lines after it. */
const COPY_FROM_STDIN = /^(?:\s|--[^\n]*\n|\/\*[\s\S]*?\*\/)*COPY\b[\s\S]*\bFROM\s+stdin\b/i;

/** The `psql` meta-commands a restore takes, as `psql` does: `\restrict <key>` and `\unrestrict <key>`. */
export class MetaCommands {
  #key: string | null = null;

  /** Takes `piece`, a meta-command, or refuses it (`backup-format-unknown`). */
  take(piece: Extract<Piece, { kind: "meta" }>): void {
    const [name, key, ...rest] = piece.command.trim().split(/\s+/);
    const fit = key !== undefined && rest.length === 0;
    if (name === "\\restrict" && fit && this.#key === null) {
      this.#key = key;
      return;
    }
    if (name === "\\unrestrict" && fit && this.#key === key) {
      this.#key = null;
      return;
    }
    const why =
      this.#key !== null && name !== "\\unrestrict"
        ? "a psql meta-command inside \\restrict"
        : name === "\\unrestrict"
          ? "a \\unrestrict whose key is not \\restrict's"
          : `the psql meta-command ${JSON.stringify(name)}`;
    throw formatUnknown(`it holds ${why} at line ${piece.line}, which a restore does not run`, {
      reason: "meta-command",
      line: piece.line,
    });
  }
}

/** Refuses a statement a restore cannot run as written (`COPY … FROM stdin`). */
export function checkStatement(piece: Extract<Piece, { kind: "statement" }>): void {
  if (COPY_FROM_STDIN.test(piece.sql)) {
    throw formatUnknown(
      `it holds a COPY … FROM stdin at line ${piece.line}, whose data psql alone reads (a dump written with --inserts ` +
        "has none)",
      { reason: "copy-from-stdin", line: piece.line },
    );
  }
}

/** Splits `lines` (the file's lines after its manifest) into pieces, checking each; yields the statements to run. */
export async function* statementsOf(
  lines: AsyncIterable<string>,
  firstLine = 2,
): AsyncGenerator<Extract<Piece, { kind: "statement" }>> {
  const splitter = new StatementSplitter();
  const meta = new MetaCommands();
  const offset = firstLine - 1;
  for await (const line of lines) {
    for (const piece of splitter.push(line)) {
      if (piece.kind === "meta") meta.take({ ...piece, line: piece.line + offset });
      else {
        const placed = { ...piece, line: piece.line + offset };
        checkStatement(placed);
        yield placed;
      }
    }
  }
  splitter.end();
}

/**
 * Reads every piece of `lines` without running any (the restore's check before loading); resolves with the statement
 * count. [BK-3]
 */
export async function checkStatements(lines: AsyncIterable<string>, firstLine = 2): Promise<number> {
  let count = 0;
  for await (const _statement of statementsOf(lines, firstLine)) count += 1;
  return count;
}
