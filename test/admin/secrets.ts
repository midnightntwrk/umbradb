import type { ProcessDatabase } from "../runner/process-backends.js";

/**
 * A secret for the admin endpoints' redaction tests (tasks 8.3, 8.4; AE-6, A29, A67): a password with every character
 * URL encodings treat differently, and every form a text may hold it in, written out by hand — not computed by the code
 * under test — as `test/config/redact.test.ts` writes its own: decoded, as a URL writes it (`encodeURIComponent`), in
 * lower-case hex, form-encoded (`+` for a space), WHATWG's userinfo encoding (which leaves `%` alone) and JSON-escaped.
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

/** A node URL whose password is {@link SECRET} (the `core` entry's `node`, a secret field, CF-4). */
export const SECRET_NODE = `ws://node-user:${SECRET_WRITTEN}@127.0.0.1:9/node`;

/** Where each form of {@link SECRET} appears in `texts` (by name): none when nothing leaked. */
export function secretProblems(texts: Readonly<Record<string, string>>): string[] {
  return Object.entries(texts).flatMap(([name, text]) =>
    SECRET_FORMS.flatMap((form, index) => (text.includes(form) ? [`${name} holds form ${index} of the secret`] : [])),
  );
}

let roles = 0;

/**
 * `db`'s `database` setting with {@link SECRET} as its password (CF-4: the setting is a secret; its password is
 * redacted wherever it appears): on PostgreSQL a login role of its own, a superuser as the tests' own user is, whose
 * password is the secret; PGlite's setting is a directory and has no password, so it is returned as it is.
 */
export async function secretDatabase(db: ProcessDatabase): Promise<string> {
  if (db.admin === undefined) return db.setting;
  const role = `secret_role_${process.pid}_${roles++}`;
  await db.admin.unsafe(`CREATE ROLE ${role} LOGIN SUPERUSER PASSWORD '${SECRET.replaceAll("'", "''")}'`);
  const url = new URL(db.setting);
  url.username = role;
  url.password = "";
  return url.toString().replace(`//${role}@`, `//${role}:${SECRET_WRITTEN}@`);
}
