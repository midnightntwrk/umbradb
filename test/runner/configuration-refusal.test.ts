import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { earlyRedactor } from "../../src/admin/redaction.js";
import { buildCoreVersion } from "../../src/config/build.js";
import { coreEntry, versionEntry } from "../../src/config/entries.js";
import { loadConfig } from "../../src/config/load.js";
import { plainData } from "../../src/config/plain-data.js";
import { processCoreEntry } from "../../src/config/process.js";
import { REDACTED, redactor } from "../../src/config/redact.js";
import { type ConfigInput, validateConfig } from "../../src/config/validate.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { configurationRefusalLines } from "../../src/runner/configuration-refusal.js";
import { coreSettings } from "./process-build.js";

/**
 * How a process logs a refusal of its configuration itself: one line with the refusal's code, how many findings it has
 * and that the process ends, then one line per finding (its path and message with its code, as `umbradb config check`
 * prints it), every line through the redaction it is given. Also the cases the command's own lines covered (its earlier
 * `refusalLines`, which these replace). [AE-3, CF-1–CF-3, Q137 B]
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
    const error = await loadConfig({ file }).catch((caught: unknown) => caught);
    expect(configurationRefusalLines(error, redactor([]).text)).toEqual([
      "startup refused: invalid-configuration (1 finding); the process ends",
      expect.stringMatching(
        new RegExp(`^startup refused: ${file.replaceAll(/[.*+?^${}()|[\]\\/]/g, "\\$&")}: no configuration file at .* \\[invalid-configuration file-not-found\\]$`),
      ),
    ]);
  });

  it("a loader's refusal quoting the file's own error shows no URL's credentials (AE-6)", async () => {
    const file = join(directory, "throws.config.ts");
    writeFileSync(file, `throw new Error("cannot reach postgres://indexer:${PASSWORD}@db.example/x");\nexport default {};\n`);
    const error = await loadConfig({ file }).catch((caught: unknown) => caught);
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

  it("passes every line through the redaction given", () => {
    const error = thrown(() => plainData({ onError: () => 0 }));
    const lines = configurationRefusalLines(error, (text) => `<${text}>`);
    expect(lines.length).toBe(2);
    for (const line of lines) expect(line).toMatch(/^<startup refused: .*>$/);
  });
});
