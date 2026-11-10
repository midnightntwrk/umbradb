import { readdirSync, readFileSync } from "node:fs";
import { sep } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { writeBlock } from "../../../src/features/token-metadata/apply.js";
import { servedIdentities } from "./served-state.js";
import { commonRecords, toHex } from "../../../src/features/token-metadata/codec/index.js";
import { blockLogs, contract, domain, eventData } from "./harness.js";

/**
 * `Intl` is used only in the module's serving code, so what the module stores does not depend on the
 * Node.js build's ICU data. Two checks:
 * - the write path's files never name `Intl`, a locale-dependent method, or the cutting functions of `state.ts`, and
 *   take from `state.ts` only the rules that read bytes;
 * - the write path, given 70-character names and symbols, never runs the grapheme segmenter, while the serving read
 *   does (the control that the spy sees the segmenter).
 */

/**
 * The write path: every file of the indexer (`src/features/token-metadata/`, its codec included) but `state.ts`, which
 * holds the rules of both sides and is checked by what the write path imports from it.
 */
const INDEXER = "src/features/token-metadata";
const WRITE_PATH = readdirSync(INDEXER, { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".ts") && file !== "state.ts")
  .map((file) => `${INDEXER}/${file.split(sep).join("/")}`)
  .sort();

/** `text` without its comments (block and line comments; the files hold no `//` inside strings). */
const code = (text: string): string => text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

describe("Intl only where the module serves", () => {
  afterEach(() => vi.restoreAllMocks());

  it("the write path's files name no Intl, no locale method and no cutting function", () => {
    for (const file of WRITE_PATH) {
      const text = code(readFileSync(file, "utf8"));
      expect(text, file).not.toMatch(/\bIntl\b|toLocale|localeCompare|\.normalize\(|lengthLimited|firstCharacters|recordEffects/);
    }
  });

  it("the write path is the indexer's files, and none of them imports the API module", () => {
    expect(WRITE_PATH).toEqual(expect.arrayContaining([`${INDEXER}/apply.ts`, `${INDEXER}/token-metadata.ts`, `${INDEXER}/codec/decode.ts`]));
    expect(WRITE_PATH).not.toContain(`${INDEXER}/state.ts`);
    for (const file of WRITE_PATH) expect(code(readFileSync(file, "utf8")), file).not.toMatch(/token-metadata-api/);
  });

  it("the write path takes from state.ts only rules that read bytes", () => {
    const imports = WRITE_PATH.flatMap((file) =>
      [...code(readFileSync(file, "utf8")).matchAll(/import\s*{([^}]*)}\s*from\s*"\.\/state\.js"/g)].flatMap((m) => m[1]!.split(",").map((n) => n.trim()).filter(Boolean)),
    );
    expect(imports.sort()).toEqual(["STANDARD_KEYS", "fieldUsable", "isDefinedKey"]);
  });

  it("writing 70-character names and symbols never runs the segmenter; serving them does", async () => {
    const segment = vi.spyOn(Intl.Segmenter.prototype, "segment");
    const statements: { sql: string; params: unknown[] }[] = [];
    const fields = new Map<string, Record<string, unknown>>();
    // A stand-in handle: it records the statements and keeps the rows `setField` writes, which the serving read reads.
    const w = {
      height: null,
      async execute(sql: string, params: unknown[] = []) {
        statements.push({ sql, params });
        if (sql.includes("INSERT INTO token_metadata.fields")) {
          const [contract_address, domain_sep, kind, key, val_type, value, uint_value, usable, defined, set_height, set_tx, set_event, set_record] = params;
          fields.set(toHex(key as Uint8Array), { contract_address, domain_sep, kind, key, val_type, value, uint_value, usable, defined, set_height, set_tx, set_event, set_record });
        }
        return 1;
      },
      async query(sql: string) {
        return sql.includes("FROM token_metadata.fields WHERE defined ORDER BY") ? [...fields.values()] : [];
      },
    };
    const long = "x".repeat(70);
    await writeBlock(w, 5n, blockLogs([0, contract(1), eventData(domain(1), 1, commonRecords({ name: long, symbol: long }))]), () => new Uint8Array(32));
    expect(statements.some((s) => s.sql.includes("INSERT INTO token_metadata.fields"))).toBe(true);
    expect(segment).not.toHaveBeenCalled();
    const [identity] = await servedIdentities(w, "n");
    expect(segment).toHaveBeenCalled();
    expect(new TextDecoder().decode(identity!.fields.get(toHex(new TextEncoder().encode("name")))!.value)).toBe("x".repeat(64));
    expect([...fields.values()].map((row) => (row.value as Uint8Array).length)).toEqual([70, 70]);
  });
});
