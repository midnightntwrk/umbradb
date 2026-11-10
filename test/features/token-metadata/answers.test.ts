import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The recorded API answers on the stagenet ranges (`test/fixtures/mip0018-answers/`): every file is listed in
 * its README with the SHA-256 it has, and each answers file is the shape `stagenet.test.ts` reads.
 */

const DIR = new URL("../../fixtures/mip0018-answers/", import.meta.url);
const sha256 = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");

/** The README's table: file → SHA-256. */
function listed(readme: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const [, file, hash] of readme.matchAll(/^\| `([^`]+)` \|.*\| `([0-9a-f]{64})` \|$/gm)) out.set(file!, hash!);
  return out;
}

/** The files whose bytes differ from their listing, and the unlisted or missing ones. */
function problems(files: ReadonlyMap<string, Uint8Array>, table: ReadonlyMap<string, string>): string[] {
  const out: string[] = [];
  for (const [file, bytes] of files) {
    const hash = table.get(file);
    if (hash === undefined) out.push(`${file}: not listed`);
    else if (sha256(bytes) !== hash) out.push(`${file}: SHA-256 ${sha256(bytes)}, listed ${hash}`);
  }
  for (const file of table.keys()) if (!files.has(file)) out.push(`${file}: missing`);
  return out;
}

const files = new Map(
  readdirSync(DIR)
    .filter((f) => f !== "README.md")
    .map((f) => [f, new Uint8Array(readFileSync(new URL(f, DIR)))]),
);
const table = listed(readFileSync(new URL("README.md", DIR), "utf8"));

describe("the recorded answers", () => {
  it("every file is listed in the README with its SHA-256", () => {
    expect(table.size).toBe(2);
    expect(problems(files, table)).toEqual([]);
  });

  it("[NEG] a changed byte, an unlisted file and a missing file are each found", () => {
    const changed = new Map(files);
    const idx = new Uint8Array(changed.get("idx.json")!);
    idx[100]! ^= 1;
    changed.set("idx.json", idx);
    expect(problems(changed, table)).toEqual([expect.stringMatching(/^idx\.json: SHA-256/)]);
    expect(problems(new Map([...files, ["extra.json", new Uint8Array()]]), table)).toEqual(["extra.json: not listed"]);
    const missing = new Map(files);
    missing.delete("u1.json");
    expect(problems(missing, table)).toEqual(["u1.json: missing"]);
  });

  it("each answers file holds its range and its answers, each path once, every route of the API", () => {
    const routes = new Set<string>();
    for (const [name, from, to, count] of [["idx", 714485, 715183, 97], ["u1", 715402, 715433, 14]] as const) {
      const data = JSON.parse(new TextDecoder().decode(files.get(`${name}.json`)));
      expect(data.range).toEqual({ name, from, to });
      const paths = data.answers.map((a: { path: string }) => a.path);
      expect(paths).toHaveLength(count);
      expect(new Set(paths).size).toBe(count);
      for (const a of data.answers) {
        expect(Object.keys(a)).toEqual(["path", "status", "headers", "body"]);
        routes.add(a.path.split("?")[0].replace(/[0-9a-f]{64}/g, "{}").replace(/\/[123]$/, "/{kind}"));
      }
    }
    expect([...routes].sort()).toEqual([
      "/v1/contracts/{}/tokens",
      "/v1/events",
      "/v1/identities/{}/{}/{kind}",
      "/v1/lookup/{}",
      "/v1/status",
      "/v1/tokens",
      "/v1/tokens/{}",
    ]);
  });
});
