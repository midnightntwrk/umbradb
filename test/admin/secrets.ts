import type { DatabaseParts, PostgresParts } from "../../src/config/database-parts.js";
import type { ProcessDatabase } from "../runner/process-backends.js";

/**
 * A secret for the admin endpoints' redaction tests: a password with every character URL encodings treat differently.
 * Every form a text may hold it in is written out by hand, not computed by the code under test, as
 * `test/config/redact.test.ts` writes its own: decoded, as a URL writes it (`encodeURIComponent`), in lower-case hex,
 * form-encoded (`+` for a space), WHATWG's userinfo encoding (which leaves `%` alone) and JSON-escaped.
 * [AE-6, A29, A67]
 */

/** The password. */
export const SECRET = 'A67 se/cr@et"%';

/** {@link SECRET} as a URL's userinfo writes it. */
export const SECRET_WRITTEN = "A67%20se%2Fcr%40et%22%25";

/** Every form of {@link SECRET} a text may hold (see the module comment). */
export const SECRET_FORMS: readonly string[] = [
  SECRET,
  SECRET_WRITTEN,
  "A67%20se%2fcr%40et%22%25",
  "A67+se%2Fcr%40et%22%25",
  "A67%20se%2Fcr%40et%22%",
  'A67 se/cr@et\\"%',
];

/** A text holding {@link SECRET} in each of its forms, as a careless error message would. */
export const SECRET_TEXT = `failed: ${SECRET_FORMS.map((form, index) => `form ${index} <${form}>`).join(", ")}`;

/** A node URL whose password is {@link SECRET} (the `core` entry's `node`, a secret field). [CF-4] */
export const SECRET_NODE = `ws://node-user:${SECRET_WRITTEN}@127.0.0.1:9/node`;

/** Where each form of {@link SECRET} appears in `texts` (by name): none when nothing leaked. */
export function secretProblems(texts: Readonly<Record<string, string>>): string[] {
  return Object.entries(texts).flatMap(([name, text]) =>
    SECRET_FORMS.flatMap((form, index) => (text.includes(form) ? [`${name} holds form ${index} of the secret`] : [])),
  );
}

let roles = 0;

/**
 * `db`'s `database` setting with {@link SECRET} as its password. The `password` part is secret and redacted wherever it
 * appears. On PostgreSQL this is a login role of its own, a superuser as the tests' own user is, whose password is the
 * secret. PGlite's setting is a directory and has no password, so it is returned as it is. [CF-4, Q167 A]
 */
export async function secretDatabase(db: ProcessDatabase): Promise<DatabaseParts> {
  if (db.admin === undefined) return db.setting;
  const role = `secret_role_${process.pid}_${roles++}`;
  await db.admin.unsafe(`CREATE ROLE ${role} LOGIN SUPERUSER PASSWORD '${SECRET.replaceAll("'", "''")}'`);
  return { ...(db.setting as PostgresParts), user: role, password: SECRET };
}
