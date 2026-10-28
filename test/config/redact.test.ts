import { inspect } from "node:util";
import { describe, expect, it } from "vitest";
import { coreEntry, versionEntry } from "../../src/config/entries.js";
import type { PlainObject } from "../../src/config/plain-data.js";
import {
  configRedactor,
  REDACTED,
  redactor,
  redactorWith,
  SECRET_ENCODINGS,
  SECRET_PARTS,
  secretStrings,
  TEXT_PATTERNS,
} from "../../src/config/redact.js";
import { type FieldKinds, validateConfig } from "../../src/config/validate.js";
import { CORE_SETTINGS } from "./config-fixtures.js";
import { input, leaky } from "./validate-fixtures.js";

/**
 * A29's helper half (CF-4, AE-6; task 4.2): a `secret` field is never shown, logged or reported — it reads
 * `[redacted]` — and neither are credentials inside URLs. `/config`, `/status` and the logs are tasks 8.1–8.4 and 5.x;
 * here the redaction they will call is shown on what they will give it: a validated configuration's settings for
 * `/config`, and texts built from the setting — an error message, a log line, a library's printout — for the logs and
 * `/status`. No form of the password survives: as written in the URL, decoded, URL-encoded in upper or lower case,
 * form-encoded, as WHATWG URL serialization writes it, JSON-escaped.
 *
 * The committed negative control: a redaction without one of its parts, encodings or patterns leaks exactly the texts
 * that need it.
 */

/** The password of the `database` URL: every character that URL encodings treat differently. */
const PASSWORD = 'pa ss/w@rd"%';

/** The password as the URL writes it (`encodeURIComponent`). */
const WRITTEN = "pa%20ss%2Fw%40rd%22%25";

/** The database's parts (Q167 A): only its password is secret. */
const PARTS = { kind: "postgres", host: "db", port: 5432, user: "indexer", password: PASSWORD, name: "umbradb" } as const;

/** The same database as a URL, as a log line or an error may write it. */
const DATABASE = `postgres://indexer:${WRITTEN}@db:5432/umbradb`;

/**
 * Every form of the password a text may hold, written out by hand (not computed by the code under test): decoded, as
 * written, lower-case hex, form-encoded (`+` for a space), WHATWG's userinfo encoding (which leaves `%` alone) and
 * JSON-escaped.
 */
const FORMS = [
  PASSWORD,
  WRITTEN,
  "pa%20ss%2fw%40rd%22%25",
  "pa+ss%2Fw%40rd%22%25",
  "pa%20ss%2Fw%40rd%22%",
  'pa ss/w@rd\\"%',
] as const;

/** The forms of the password `text` holds. */
const leaked = (text: string): string[] => FORMS.filter((form) => text.includes(form));

/** A configuration whose `database` parts hold the password, as a process's validated configuration. */
function checked() {
  return validateConfig(
    input({
      entries: [
        coreEntry({
          start: 0,
          config: {
            ...CORE_SETTINGS,
            database: PARTS,
            node: "wss://node-user:node-pass@node.example:443",
            tls: { certificate: "CERT-4-2", key: "the-tls-key", trustedRoots: ["ROOT-4-2"] },
          },
        }),
        leaky.entry({
          start: 0,
          config: { apiKey: "key-SECRET-API", feedUrl: "https://feed-user:feed-pass@feed.example/prices?token=TOK&n=1" },
        }),
        versionEntry({ id: "stats", start: 0, version: "1.0.0", config: { mirror: "https://old:old-pass@mirror.example" } }),
      ],
    }),
  );
}

/** Texts a process may log or report, each built from the `database` setting as code commonly builds them. */
function texts(url: string): Record<string, string> {
  const whatwg = new URL("postgres://db:5432/umbradb");
  whatwg.username = "indexer";
  whatwg.password = PASSWORD;
  const error = Object.assign(new Error(`could not connect to ${url}: connect ECONNREFUSED`), { url });
  return {
    "an error message holding the URL": error.message,
    "an error printed with its properties (util.inspect)": inspect(error),
    "a JSON log line holding the URL": JSON.stringify({ level: "error", msg: "connect failed", url }),
    "a JSON log line holding the password": JSON.stringify({ level: "debug", password: PASSWORD }),
    "a server's message quoting the password": `password authentication failed for user "indexer" ("${PASSWORD}")`,
    "the URL as a URL object serializes it": `connecting to ${whatwg.href}`,
    "the password in lower-case hex": `auth ${encodeURIComponent(PASSWORD).toLowerCase()}`,
    "the password form-encoded": `body ${new URLSearchParams({ pw: PASSWORD }).toString()}`,
  };
}

describe("A29 (helper): the password of the database URL appears nowhere", () => {
  it("the texts hold the password in every form before redaction (the checks below can fail)", () => {
    const all = Object.values(texts(DATABASE)).join("\n");
    expect(leaked(all)).toEqual([...FORMS]);
  });

  it("the settings /config shows: the database's password, node and tls read [redacted], the rest unchanged", () => {
    const config = checked();
    const redact = configRedactor(config);
    const core = config.entries[0];
    const shown = redact.settings(core?.settings as PlainObject, core?.kinds as FieldKinds);
    expect(shown).toMatchObject({
      network: "preprod",
      database: { ...PARTS, password: REDACTED, ssl: "require" },
      node: REDACTED,
      tls: REDACTED,
      listen: { admin: "0.0.0.0:8081" },
      tipCap: 600,
    });
    expect(leaked(JSON.stringify(shown))).toEqual([]);
    expect(JSON.stringify(shown)).not.toContain("node-pass");
    expect(JSON.stringify(shown)).not.toContain("the-tls-key");
    expect(Object.isFrozen(shown)).toBe(true);
  });

  for (const [name, text] of Object.entries(texts(DATABASE))) {
    it(`a text: ${name}`, () => {
      const redacted = configRedactor(checked()).text(text);
      expect(leaked(redacted)).toEqual([]);
      expect(redacted).toContain(REDACTED);
    });
  }

  it("the database URL keeps its host and name, its userinfo redacted, and the text around it is kept", () => {
    const redact = configRedactor(checked());
    expect(redact.text(`could not connect to ${DATABASE}: connect ECONNREFUSED`)).toBe(
      "could not connect to postgres://[redacted]@db:5432/umbradb: connect ECONNREFUSED",
    );
    // The other parts are no secret (Q167 A): a log line naming the database shows them.
    expect(redact.text("opened postgres indexer@db:5432/umbradb (ssl require)")).toBe(
      "opened postgres indexer@db:5432/umbradb (ssl require)",
    );
  });

  it("the other secrets of the configuration: node, tls, a module's secret, each in any text", () => {
    const redact = configRedactor(checked());
    const text = "node wss://node-user:node-pass@node.example:443 key the-tls-key api key-SECRET-API";
    expect(redact.text(text)).toBe("node [redacted] key [redacted] api [redacted]");
    expect(redact.text("node-pass alone")).toBe("[redacted] alone");
  });
});

describe("AE-6: credentials inside URLs read [redacted], in any field and any text", () => {
  it("a module's operational URL shows its host, path and parameters, its userinfo and token redacted", () => {
    const config = checked();
    const entry = config.entries[1];
    const shown = configRedactor(config).settings(entry?.settings as PlainObject, entry?.kinds as FieldKinds);
    expect(shown).toEqual({ apiKey: REDACTED, feedUrl: "https://[redacted]@feed.example/prices?token=[redacted]&n=1" });
  });

  it("the password of a URL in a field that is not secret is redacted when it appears alone", () => {
    const redact = configRedactor(checked());
    expect(redact.text("feed refused feed-pass")).toBe("feed refused [redacted]");
    expect(redact.text("mirror refused old-pass")).toBe("mirror refused [redacted]");
    // An earlier revision's data is recorded and shown (CF-3): only the credential in it is a secret.
    expect(redact.text("mirror https://old:old-pass@mirror.example")).toBe("mirror https://[redacted]@mirror.example");
  });

  it("an earlier revision's settings, whose kinds the build does not know, read [redacted] (fail closed)", () => {
    const config = checked();
    const entry = config.entries[2];
    expect(entry?.kinds).toBeNull();
    expect(configRedactor(config).settings(entry?.settings as PlainObject, {})).toEqual({ mirror: REDACTED });
    expect(configRedactor(config).settings({ a: "x", b: "y" }, { a: "data" })).toEqual({ a: "x", b: REDACTED });
  });

  it("a URL with credentials the configuration does not hold, in any text", () => {
    const redact = redactor([]);
    expect(redact.text("fetch https://bob:hunter2@other.example/x failed")).toBe(
      "fetch https://[redacted]@other.example/x failed",
    );
    expect(redact.text("postgres://u:p@ss@h1,h2/db")).toBe("postgres://[redacted]@h1,h2/db");
    expect(redact.text("ws://token@node")).toBe("ws://[redacted]@node");
    expect(redact.text("see https://example.org/@me and mailto:a@b")).toBe("see https://example.org/@me and mailto:a@b");
  });

  it("a credential given as a URL's query parameter, in any text", () => {
    const redact = redactor([]);
    expect(redact.text("postgres://h/db?sslmode=require&password=hunter2&x=1")).toBe(
      "postgres://h/db?sslmode=require&password=[redacted]&x=1",
    );
    expect(redact.text("GET /prices?apiKey=abc#top")).toBe("GET /prices?apiKey=[redacted]#top");
    expect(redact.text("?access_token=t1&sslpassword=t2&secret=t3&auth=t4&pwd=t5")).toBe(
      "?access_token=[redacted]&sslpassword=[redacted]&secret=[redacted]&auth=[redacted]&pwd=[redacted]",
    );
    expect(redact.text("?limit=10&sort=asc")).toBe("?limit=10&sort=asc");
    expect(redact.text("&credentials=c1")).toBe("&credentials=[redacted]");
  });
});

describe("CF-4: the redactor of a validated configuration", () => {
  it("takes no secret from a scheduled revision, which has no settings", () => {
    const config = validateConfig(
      input({
        entries: [coreEntry({ start: 0, config: { ...CORE_SETTINGS } }), versionEntry({ id: "stats", start: 50, version: "1.3.0" })],
      }),
    );
    expect(config.entries[1]?.settings).toBeNull();
    expect(configRedactor(config).text("stats 1.3.0 from 50")).toBe("stats 1.3.0 from 50");
  });

  it("shows every element of a list that is not secret, each string redacted", () => {
    const shown = redactor(["hunter2"]).settings(
      { lockstepInstances: ["wallet-1", "wallet-hunter2"], mirrors: [{ url: "https://u:p@m.example" }] },
      { lockstepInstances: "operational", mirrors: "data" },
    );
    expect(shown).toEqual({ lockstepInstances: ["wallet-1", "wallet-[redacted]"], mirrors: [{ url: "https://[redacted]@m.example" }] });
    expect(Object.isFrozen((shown as { lockstepInstances: unknown }).lockstepInstances)).toBe(true);
  });

  it("redacts the password of a URL without a username", () => {
    expect(redactor(["postgres://:hunter2@h/db"]).text("auth hunter2")).toBe("auth [redacted]");
    expect(secretStrings({ url: "postgres://:hunter2@h/db" }, { url: "operational" })).toEqual(["hunter2"]);
  });

  it("redacts a URL's password whose percent-encoding is malformed as written", () => {
    expect(redactor(["postgres://u:p%zz@h/db"]).text("auth p%zz")).toBe("auth [redacted]");
  });

  it("redacts a secret holding a lone surrogate, which no URI encoding takes", () => {
    expect(redactor(["tok\uD800en"]).text("token tok\uD800en")).toBe("token [redacted]");
  });
});

describe("CF-4: which strings are secret", () => {
  it("every string inside a secret field, and the password of every URL with one in the other fields", () => {
    expect(
      secretStrings(
        {
          tls: { certificate: "C", key: "K", trustedRoots: ["R1", "R2"] },
          tokens: [{ name: "feed", token: "0x01", from: 5 }],
          feedUrl: "https://u:pw@feed",
          plain: "https://feed",
          count: 3,
        },
        { tls: "secret", tokens: "secret", feedUrl: "operational", plain: "data", count: "data" },
      ),
    ).toEqual(["C", "K", "R1", "R2", "feed", "0x01", "pw"]);
  });

  it("a password part inside an operational field is secret, at any depth; a data field's is not (Q167 A)", () => {
    const settings = {
      database: { kind: "postgres", host: "db", user: "u", password: "db-pw", name: "n" },
      transportReader: { user: "r", password: "reader-pw" },
      nested: [{ inner: { password: "deep-pw" } }],
      recorded: { password: "data-pw" },
    };
    const kinds = { database: "operational", transportReader: "operational", nested: "operational", recorded: "data" } as const;
    expect(secretStrings(settings, kinds)).toEqual(["db-pw", "reader-pw", "deep-pw"]);
    expect(redactor([]).settings(settings, kinds)).toEqual({
      database: { kind: "postgres", host: "db", user: "u", password: REDACTED, name: "n" },
      transportReader: { user: "r", password: REDACTED },
      nested: [{ inner: { password: REDACTED } }],
      recorded: { password: "data-pw" },
    });
  });

  it("a field without a known kind counts as secret (fail closed); empty strings are no secret", () => {
    expect(secretStrings({ unknown: "u", empty: "" }, {})).toEqual(["u"]);
    // Named like what every object inherits: still not classified.
    expect(secretStrings({ constructor: "c", toString: "t" }, {})).toEqual(["c", "t"]);
    expect(redactor([]).settings({ constructor: "c", toString: "t" }, {})).toEqual({ constructor: REDACTED, toString: REDACTED });
  });

  it("the password of a URL in a field that is not secret, as written and decoded", () => {
    expect(secretStrings({ feedUrl: "https://u:p%7ex@feed.example" }, { feedUrl: "operational" })).toEqual(["p%7ex", "p~x"]);
  });

  it("a short secret is still redacted wherever it appears", () => {
    expect(redactor(["ab"]).text("cabbage ab")).toBe("c[redacted]bage [redacted]");
  });

  it("an empty list of secrets leaves text without URL credentials unchanged", () => {
    expect(redactor([]).text("nothing to hide")).toBe("nothing to hide");
    expect(redactor([""]).text("nothing to hide")).toBe("nothing to hide");
  });

  it("replaces the longest secret first, so a secret that begins another leaves no piece of the longer one", () => {
    expect(redactor(["pw", "pw-long"]).text("pw-long and pw")).toBe("[redacted] and [redacted]");
  });

  it("takes secrets that hold regular-expression characters literally", () => {
    expect(redactor(["a.b*c"]).text("a.b*c axbbc")).toBe("[redacted] axbbc");
  });
});

/**
 * A text and the parts, encodings and patterns of the redaction whose removal alone lets it through: each row is built
 * so that its secret's other forms are not in its text.
 */
interface Needs {
  readonly name: string;
  /** The secret strings the configuration holds. */
  readonly secrets: readonly string[];
  readonly text: string;
  /** What must be hidden. */
  readonly hidden: string;
  /** The parts, encodings and patterns without any one of which the text leaks, by name. */
  readonly needs: readonly string[];
}

const TOKEN = 'a b/c%"';

const NEEDS: readonly Needs[] = [
  // A space and a quote: every encoding but the identity writes this secret differently, so only the identity finds it.
  {
    name: "a secret value",
    secrets: ['tok "1"'],
    text: 'token tok "1"',
    hidden: 'tok "1"',
    needs: ["value", "as-written"],
  },
  // The password written `p%7ex`, lower-case hex for "~": no encoding of the decoded "p~x" writes it so (the form
  // encoding writes `%7E`), so only the part as written finds it — in the identity, or the userinfo encoding, which
  // leaves `%` alone.
  {
    name: "a URL's password as written",
    secrets: ["postgres://u:p%7ex@h/db"],
    text: "auth p%7ex",
    hidden: "p%7ex",
    needs: ["url-password"],
  },
  // Most encodings leave "~" alone, so they all find the decoded password: only its part is needed.
  {
    name: "a URL's password decoded",
    secrets: ["postgres://u:p%7ex@h/db"],
    text: "auth p~x",
    hidden: "p~x",
    needs: ["url-password-decoded"],
  },
  { name: "URI-component encoded", secrets: [TOKEN], text: "t a%20b%2Fc%25%22", hidden: "a%20b%2Fc%25%22", needs: ["value", "uri-component"] },
  { name: "lower-case hex", secrets: [TOKEN], text: "t a%20b%2fc%25%22", hidden: "a%20b%2fc%25%22", needs: ["value", "uri-component-lower"] },
  { name: "form-encoded", secrets: [TOKEN], text: "t a+b%2Fc%25%22", hidden: "a+b%2Fc%25%22", needs: ["value", "form"] },
  { name: "WHATWG userinfo", secrets: [TOKEN], text: "t a%20b%2Fc%%22", hidden: "a%20b%2Fc%%22", needs: ["value", "userinfo"] },
  // Inside a longer JSON string, so that the escaped secret has no quotes of its own around it.
  {
    name: "JSON-escaped",
    secrets: [TOKEN],
    text: '{"msg":"token a b/c%\\" end"}',
    hidden: 'a b/c%\\"',
    needs: ["value", "json"],
  },
  {
    name: "a URL's userinfo the configuration does not hold",
    secrets: [],
    text: "https://bob:hunter2@other.example",
    hidden: "hunter2",
    needs: ["url-userinfo"],
  },
  {
    name: "a credential parameter the configuration does not hold",
    secrets: [],
    text: "https://other.example/?password=hunter2",
    hidden: "hunter2",
    needs: ["credential-parameter"],
  },
];

describe("A29 negative control: a redaction without one form leaks exactly the texts that need it", () => {
  const names = [...SECRET_PARTS, ...SECRET_ENCODINGS, ...TEXT_PATTERNS].map((form) => form.name);

  it("has a text for every part, encoding and pattern, and each is hidden by the full redaction", () => {
    expect(new Set(NEEDS.flatMap((row) => row.needs))).toEqual(new Set(names));
    for (const row of NEEDS) {
      expect(row.text, row.name).toContain(row.hidden);
      expect(redactor(row.secrets).text(row.text), row.name).not.toContain(row.hidden);
    }
  });

  for (const name of names) {
    it(`without ${name}`, () => {
      const without = {
        parts: SECRET_PARTS.filter((form) => form.name !== name),
        encodings: SECRET_ENCODINGS.filter((form) => form.name !== name),
        patterns: TEXT_PATTERNS.filter((form) => form.name !== name),
      };
      for (const row of NEEDS) {
        const shown = redactorWith(row.secrets, without).text(row.text);
        expect(shown.includes(row.hidden), row.name).toBe(row.needs.includes(name));
      }
    });
  }
});
