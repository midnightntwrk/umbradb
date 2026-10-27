import { describe, expect, it } from "vitest";
import { findingText, refusalFindings } from "../../src/config/findings.js";
import { UmbraError } from "../../src/db/errors.js";

/**
 * A configuration refusal's findings (task 8.1b, moved from `umbradb config check`'s; CF-1, CF-3, CF-10): what
 * `config check` reports and what a process logs when its configuration is refused, alike — each finding's code, where
 * it is and what is wrong, and its text.
 */

describe("refusalFindings", () => {
  it("gives every finding of the validation with its rule, one at the value not plain data, one at the file otherwise", () => {
    const validation = new UmbraError("invalid-configuration", "refused", {
      file: null,
      reason: "invalid-entries",
      findings: [
        { rule: "settings-schema", path: "entries[0].config.pollMs", entry: null, field: "pollMs", message: "entries[0].config.pollMs: too small" },
        { rule: "entry-id", path: "entries[1].id", entry: null, field: "id", message: "no module m" },
      ],
    });
    expect(refusalFindings(validation, "/x/umbradb.config.ts")).toEqual([
      { code: "invalid-configuration settings-schema", path: "entries[0].config.pollMs", message: "entries[0].config.pollMs: too small" },
      { code: "invalid-configuration entry-id", path: "entries[1].id", message: "no module m" },
    ]);
    const plain = new UmbraError("not-plain-data", "a function", { path: "entries[0].config.onError", found: "a function" });
    expect(refusalFindings(plain, "/x/umbradb.config.ts")).toEqual([
      { code: "not-plain-data", path: "entries[0].config.onError", message: "a function" },
    ]);
    const loader = new UmbraError("invalid-configuration", "no configuration file", { file: "/x/a.ts", reason: "file-not-found" });
    expect(refusalFindings(loader, "/x/a.ts")).toEqual([
      { code: "invalid-configuration file-not-found", path: "/x/a.ts", message: "no configuration file" },
    ]);
  });

  it("throws what was thrown when it is no UmbraError", () => {
    const thrown = new TypeError("not a refusal");
    expect(() => refusalFindings(thrown, "/x/a.ts")).toThrow(thrown);
  });
});

describe("findingText", () => {
  it("gives the message, prefixed with the path unless it starts with it, and the code; the empty path is the default export", () => {
    expect(findingText({ code: "c", path: "entries[0].id", message: "entries[0].id: wrong" })).toBe("entries[0].id: wrong [c]");
    expect(findingText({ code: "c", path: "/x/a.ts", message: "no file" })).toBe("/x/a.ts: no file [c]");
    expect(findingText({ code: "c", path: "", message: "not an object" })).toBe("(the default export): not an object [c]");
  });
});
