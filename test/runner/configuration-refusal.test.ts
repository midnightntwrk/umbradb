import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { earlyRedactor } from "../../src/admin/redaction.js";
import { buildCoreVersion } from "../../src/config/build.js";
import { findingText, refusalFindings } from "../../src/config/findings.js";
import { coreEntry, versionEntry } from "../../src/config/entries.js";
import { loadConfig } from "../../src/config/load.js";
import { plainData } from "../../src/config/plain-data.js";
import { processCoreEntry } from "../../src/config/process.js";
import { REDACTED, redactor } from "../../src/config/redact.js";
import { type ConfigInput, validateConfig } from "../../src/config/validate.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { UmbraError } from "../../src/db/errors.js";
import { configurationFindings, configurationRefusalLines, OWN_WORDS, shownRefusal } from "../../src/runner/configuration-refusal.js";
import { coreSettings } from "./process-build.js";

/**
 * How a process logs a refusal of its configuration itself: one line with the refusal's code, how many findings it has
 * and that the process ends, then one line per finding (its path and message with its code, as `umbradb config check`
 * prints it), every line through the redaction it is given. Also the cases the command's own lines covered (its earlier
 * `refusalLines`, which these replace).
 *
 * And the refusal a host is given (`shownRefusal`): a copy redacted when its message or details hold a secret — code,
 * details and cause kept —, the refusal itself otherwise.
 */

const PASSWORD = "pw-8-1b-LINES";
const NO_MODULES = { backbone: [], core: [], user: [] } as const;

/** What `body` throws. */
function thrown(body: () => unknown): unknown {
  try {
    body();
  } catch (error) {
    return error;
  }
  throw new Error("nothing was thrown");
}

let directory: string;

beforeAll(() => {
  directory = mkdtempSync(join(tmpdir(), "umbradb-8-1b-lines-"));
  writeFileSync(join(directory, "package.json"), '{ "type": "module" }\n');
});

afterAll(() => rmSync(directory, { recursive: true, force: true }));

describe("configurationRefusalLines", () => {
  it("every finding of the validation, each with its path and code, after a line counting them; the configuration's secrets hidden", () => {
    const input: ConfigInput = {
      config: {
        data: plainData({
          entries: [
            coreEntry({
              start: 1,
              config: {
                ...coreSettings({
                  kind: "postgres",
                  host: "127.0.0.1",
                  port: 9,
                  user: "indexer",
                  password: PASSWORD,
                  name: "umbra",
                  ssl: "disable",
                }),
                livenessTimeoutMs: "30s",
                apiReadTimeoutMs: 0,
              } as never,
            }),
          ],
        }),
      },
      declarations: NO_MODULES,
      side: "public",
    };
    const error = thrown(() => validateConfig(input));
    const lines = configurationRefusalLines(error, earlyRedactor(input).text);
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe("startup refused: invalid-configuration (2 findings); the process ends");
    expect(lines.slice(1)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^startup refused: entries\[0\]\.config\.apiReadTimeoutMs \(core from 1\): .* \[invalid-configuration settings-schema\]$/),
        expect.stringMatching(/^startup refused: entries\[0\]\.config\.livenessTimeoutMs \(core from 1\): .* \[invalid-configuration settings-schema\]$/),
      ]),
    );
    expect(lines.join("\n")).not.toContain(PASSWORD);
  });

  it("the loader's refusal at the file, one finding", async () => {
    const file = join(directory, "no-such.config.ts");
    const error = await loadConfig({ file, cwd: process.cwd() }).catch((caught: unknown) => caught);
    expect(configurationRefusalLines(error, redactor([]).text)).toEqual([
      "startup refused: invalid-configuration (1 finding); the process ends",
      expect.stringMatching(
        new RegExp(`^startup refused: ${file.replaceAll(/[.*+?^${}()|[\]\\/]/g, "\\$&")}: no configuration file at .* \\[invalid-configuration file-not-found\\]$`),
      ),
    ]);
  });

  it("a loader's refusal quoting the file's own error shows no URL's credentials", async () => {
    const file = join(directory, "throws.config.ts");
    writeFileSync(file, `throw new Error("cannot reach postgres://indexer:${PASSWORD}@db.example/x");\nexport default {};\n`);
    const error = await loadConfig({ file, cwd: process.cwd() }).catch((caught: unknown) => caught);
    const lines = configurationRefusalLines(error, redactor([]).text);
    expect(lines).toEqual([
      "startup refused: invalid-configuration (1 finding); the process ends",
      expect.stringMatching(/^startup refused: .*throws\.config\.ts: the configuration file .* could not be loaded: .* \[invalid-configuration load-failed\]$/),
    ]);
    expect(lines.join("\n")).toContain(`cannot reach postgres://${REDACTED}@db.example/x`);
    expect(lines.join("\n")).not.toContain(PASSWORD);
  });

  it("not plain data, at its path inside the configuration", () => {
    const error = thrown(() => plainData({ entries: [{ id: "core", config: { onError: () => 0 } }] }, "/x/umbradb.config.ts"));
    expect(configurationRefusalLines(error, redactor([]).text)).toEqual([
      "startup refused: not-plain-data (1 finding); the process ends",
      expect.stringMatching(/^startup refused: entries\[0\]\.config\.onError: \/x\/umbradb\.config\.ts: the configuration's value at entries\[0\]\.config\.onError is a function, .* \[not-plain-data\]$/),
    ]);
  });

  it("a configuration with no core revision of the build's version, at the file given", () => {
    const version = { ...buildCoreVersion(), umbradb: "0.0.1" };
    const checked = validateConfig({
      config: { file: "/x/umbradb.config.ts", data: plainData({ entries: [versionEntry({ id: "core", start: 1, version: version as never })] }) },
      declarations: NO_MODULES,
      side: "public",
    });
    const error = thrown(() => processCoreEntry(checked));
    expect(configurationRefusalLines(error, redactor([]).text)).toEqual([
      "startup refused: invalid-configuration (1 finding); the process ends",
      expect.stringMatching(
        /^startup refused: \/x\/umbradb\.config\.ts: the configuration \/x\/umbradb\.config\.ts has no core revision of this build's version .* \[invalid-configuration no-build-core-revision\]$/,
      ),
    ]);
  });

  it("a configuration given as data, with no file and no core revision of the build's version: at the configuration", () => {
    const version = { ...buildCoreVersion(), umbradb: "0.0.1" };
    const checked = validateConfig({
      config: { data: plainData({ entries: [versionEntry({ id: "core", start: 1, version: version as never })] }) },
      declarations: NO_MODULES,
      side: "public",
    });
    const error = thrown(() => processCoreEntry(checked));
    expect(configurationRefusalLines(error, redactor([]).text)).toEqual([
      "startup refused: invalid-configuration (1 finding); the process ends",
      expect.stringMatching(
        /^startup refused: the configuration has no core revision of this build's version .* \[invalid-configuration no-build-core-revision\]$/,
      ),
    ]);
  });

  it("a fault of the build's declarations: its message, which names the module and its place, and its code", () => {
    const error = thrown(() => validateDeclarations({ backbone: [], core: [], user: [{ id: "Bad" }] } as never));
    expect(configurationRefusalLines(error, redactor([]).text)).toEqual([
      "startup refused: invalid-declaration (1 finding); the process ends",
      expect.stringMatching(/^startup refused: the user module Bad: .* \[invalid-declaration\]$/),
    ]);
  });

  it("a thrown value that is no refusal: its text, with the code the runner gives it", () => {
    expect(configurationRefusalLines(new TypeError("a schema's own bug"), (text) => text)).toEqual([
      "startup refused: database-error (1 finding); the process ends",
      "startup refused: a schema's own bug [database-error]",
    ]);
    expect(configurationRefusalLines("thrown text", (text) => text)).toEqual([
      "startup refused: database-error (1 finding); the process ends",
      "startup refused: thrown text [database-error]",
    ]);
  });

  it("passes what may hold the host's text through the redaction given: each message, a file; the codes, the count and UmbraDB's paths as they are", () => {
    const mark = (text: string) => `<${text}>`;
    // Not plain data: its path inside the configuration kept, its message (which names the file) redacted.
    const plain = thrown(() => plainData({ onError: () => 0 }, "/x/umbradb.config.ts"));
    expect(configurationRefusalLines(plain, mark)).toEqual([
      "startup refused: not-plain-data (1 finding); the process ends",
      expect.stringMatching(/^startup refused: onError: <\/x\/umbradb\.config\.ts: the configuration's value at onError is a function, .*> \[not-plain-data\]$/),
    ]);
    // The loader's refusal at the file: the file and the message redacted, the code kept.
    const loader = new UmbraError("invalid-configuration", "the module file m.ts could not be loaded: boom", { file: "m.ts", reason: "load-failed" });
    expect(configurationRefusalLines(loader, mark)).toEqual([
      "startup refused: invalid-configuration (1 finding); the process ends",
      "startup refused: <m.ts>: <the module file m.ts could not be loaded: boom> [invalid-configuration load-failed]",
    ]);
    // A finding whose message starts with its path: the path kept, the rest of the message redacted.
    const options = new UmbraError("invalid-configuration", "refused", {
      reason: "invalid-option",
      findings: [{ rule: "invalid-option", path: "modules[1]", entry: null, field: null, message: "modules[1]: reading it threw" }],
    });
    expect(configurationRefusalLines(options, mark)).toEqual([
      "startup refused: invalid-configuration (1 finding); the process ends",
      "startup refused: modules[1]<: reading it threw> [invalid-configuration invalid-option]",
    ]);
    // Anything else thrown: its message redacted, its code kept.
    expect(configurationRefusalLines(new TypeError("a bug"), mark)).toEqual([
      "startup refused: database-error (1 finding); the process ends",
      "startup refused: <a bug> [database-error]",
    ]);
  });

  it("a secret whose text is a refusal's code, reason or path leaves them as they are; the message is redacted", () => {
    const loader = new UmbraError("invalid-configuration", "the module file m.ts could not be loaded: the store refused load-failed", {
      file: "m.ts",
      reason: "load-failed",
    });
    expect(configurationRefusalLines(loader, redactor(["load-failed", "invalid-configuration"]).text)).toEqual([
      "startup refused: invalid-configuration (1 finding); the process ends",
      `startup refused: m.ts: the module file m.ts could not be loaded: the store refused ${REDACTED} [invalid-configuration load-failed]`,
    ]);
  });

  it("unredacted, the findings' texts are umbradb config check's (findingText)", () => {
    const errors = [
      thrown(() => plainData({ onError: () => 0 }, "/x/umbradb.config.ts")),
      new UmbraError("invalid-configuration", "no file", { file: "/x/a.ts", reason: "file-not-found" }),
      new UmbraError("invalid-configuration", "refused", {
        reason: "invalid-entries",
        findings: [
          { rule: "settings-schema", path: "entries[0].config.x", entry: 0, field: "x", message: "entries[0].config.x: bad" },
          { rule: "settings-schema", path: "", entry: null, field: null, message: "no entries" },
          { rule: "settings-schema", path: "entries", entry: null, field: null, message: "not a list" },
        ],
      }),
    ];
    for (const error of errors) {
      const { file } = (error as UmbraError).details as { file?: string };
      expect(configurationFindings(error)).toEqual(refusalFindings(error, file ?? "the configuration").map(findingText));
    }
  });
});

describe("shownRefusal: the refusal a host is given", () => {
  const redact = redactor([PASSWORD]).text;

  it("a refusal whose message or details hold a secret is a copy: redacted, its code, its other details and its cause kept", () => {
    const cause = new Error(`the import failed with ${PASSWORD}`);
    const refusal = new UmbraError(
      "invalid-configuration",
      `the module file could not be loaded: ${PASSWORD}`,
      { reason: "load-failed", file: `/srv/${PASSWORD}/m.ts`, height: 5n, values: [PASSWORD, 1], where: { text: PASSWORD }, at: new Date(0) },
      { cause },
    );
    const shown = shownRefusal(refusal, redact) as UmbraError;
    expect(shown).not.toBe(refusal);
    expect(shown).toBeInstanceOf(UmbraError);
    expect([shown.code, shown.message, shown.cause]).toEqual(["invalid-configuration", `the module file could not be loaded: ${REDACTED}`, cause]);
    expect(shown.details).toEqual({
      reason: "load-failed",
      file: `/srv/${REDACTED}/m.ts`,
      height: 5n,
      values: [REDACTED, 1],
      where: { text: REDACTED },
      at: new Date(0),
    });
    expect(shown.stack).not.toContain(PASSWORD);
    // Only its details: a copy too, without a cause when it had none.
    const inDetails = shownRefusal(new UmbraError("invalid-declaration", "a module is refused", { module: PASSWORD }), redact) as UmbraError;
    expect([inDetails.message, inDetails.details.module, inDetails.cause]).toEqual(["a module is refused", REDACTED, undefined]);
  });

  it("its own words are kept whatever a secret's text — the reason, the findings' rules and paths, the names it writes — and every other string redacted", () => {
    const own = redactor(["load-failed", "settings-schema", "entries[0].config.x", "backupAtStop", "wrong-side", "m"]).text;
    const refusal = new UmbraError("invalid-configuration", "the store refused load-failed", {
      reason: "load-failed",
      file: "/srv/m/load-failed.ts",
      module: "m",
      findings: [{ rule: "settings-schema", path: "entries[0].config.x", entry: 0, field: "x", message: "entries[0].config.x: settings-schema" }],
      settings: ["backupAtStop"],
      problems: [{ code: "private-link-misconfigured", reason: "wrong-side", surface: "privateLink", request: "network.privateLink.privateSide", setting: null }],
    });
    const shown = shownRefusal(refusal, own) as UmbraError;
    expect(shown.message).toBe(`the store refused ${REDACTED}`);
    expect(shown.details).toEqual({
      reason: "load-failed",
      file: `/srv/${REDACTED}/${REDACTED}.ts`,
      module: REDACTED,
      findings: [{ rule: "settings-schema", path: "entries[0].config.x", entry: 0, field: "x", message: `${REDACTED}: ${REDACTED}` }],
      settings: ["backupAtStop"],
      problems: [{ code: "private-link-misconfigured", reason: "wrong-side", surface: "privateLink", request: "network.privateLink.privateSide", setting: null }],
    });
    expect([...OWN_WORDS].sort()).toEqual(
      ["code", "expected", "field", "found", "given", "kind", "members", "option", "origin", "path", "point", "reason", "request", "rule", "setting", "settings", "surface"],
    );
  });

  it("a refusal that holds none is given itself, and a value that is no UmbraError as it is", () => {
    const refusal = new UmbraError("modules-given-twice", "the user modules are given twice", { given: ["modules", "modulesFrom"], at: { list: [1] } });
    expect(shownRefusal(refusal, redact)).toBe(refusal);
    const error = new Error(PASSWORD);
    expect(shownRefusal(error, redact)).toBe(error);
    expect(shownRefusal("text", redact)).toBe("text");
  });
});
