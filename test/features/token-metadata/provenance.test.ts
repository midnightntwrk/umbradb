import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { portProblems, ports, provenanceProblems, sourceRows } from "./provenance.js";

/**
 * The copies `token-metadata` takes from the MIP-0018 proof of concept are byte for byte what their `SOURCE.md` lists:
 * the vendored reference codec in `src/`, and the vectors and case expectations the tests read. A changed, missing or
 * unlisted file fails.
 */

const COPIED = [
  "src/features/token-metadata/vendor/mip0018",
  "test/fixtures/mip0018",
] as const;

describe("token-metadata copies from the proof of concept", () => {
  for (const dir of COPIED) {
    it(`${dir}: every file is listed in SOURCE.md with its SHA-256`, () => {
      expect(sourceRows(dir).length).toBeGreaterThan(0);
      expect(provenanceProblems(dir)).toEqual([]);
    });
  }

  it("every file PORTED.json lists is the proof of concept's original with only its listed replacements", () => {
    expect(ports().map((port) => port.file).sort()).toEqual([
      "src/features/token-metadata/classify.ts",
      "src/features/token-metadata/state.ts",
      "test/features/token-metadata/mip0018-classify.test.ts",
      "test/features/token-metadata/mip0018-state.test.ts",
      "test/features/token-metadata/run-vectors.ts",
      "test/features/token-metadata/vector-adapter.ts",
      "test/features/token-metadata/vectors.test.ts",
    ]);
    for (const port of ports()) expect(portProblems(port)).toEqual([]);
  });

  it("negative control: an edit to a ported file beyond its replacements fails", () => {
    const port = ports().find((p) => p.file.endsWith("state.ts"))!;
    const edited = readFileSync(port.file, "utf8").replace("export class MetadataState", "export class MetadataStateX");
    expect(portProblems(port, edited)).toEqual([`${port.file}: with its replacements undone, it is not ${port.from} (SHA-256 differs)`]);
  });

  describe("negative controls", () => {
    let scratch: string | undefined;
    afterEach(() => {
      if (scratch) rmSync(scratch, { recursive: true, force: true });
      scratch = undefined;
    });

    const copyOf = (dir: string): string => {
      scratch = mkdtempSync(join(tmpdir(), "mip0018-provenance-"));
      cpSync(dir, scratch, { recursive: true });
      return scratch;
    };

    it("a changed byte fails", () => {
      const dir = copyOf(COPIED[0]);
      const row = sourceRows(dir)[0]!;
      writeFileSync(join(dir, row.path), "changed");
      expect(provenanceProblems(dir)).toEqual([`${row.path}: SHA-256 differs from SOURCE.md`]);
    });

    it("an unlisted file fails", () => {
      const dir = copyOf(COPIED[0]);
      writeFileSync(join(dir, "extra.ts"), "");
      expect(provenanceProblems(dir)).toEqual(["extra.ts: not listed in SOURCE.md"]);
    });

    it("a missing file fails", () => {
      const dir = copyOf(COPIED[0]);
      const row = sourceRows(dir)[0]!;
      rmSync(join(dir, row.path));
      expect(provenanceProblems(dir)).toEqual([`${row.path}: listed, but missing`]);
    });
  });
});
