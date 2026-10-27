import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { firstLine } from "../../src/backup/backup.js";
import { dumpLines } from "../../src/backup/restore.js";
import { blobText, firstLineOf, linesAfterFirst } from "../../src/backup/text.js";

/**
 * A backup's text as the browser page's restore reads it (task 16.1's A131 half; BK-5; `src/backup/text.ts`): a picked
 * file's `Blob` gives the same first line and the same lines after it as the file on disk does through `node:fs`
 * (`firstLine`, `dumpLines`), and the line splitting both share keeps a carriage return, gives a last line without a
 * feed, and joins lines and multi-byte characters split across reads.
 */

const dir = mkdtempSync(join(tmpdir(), "umbradb-backup-text-"));

afterAll(() => rmSync(dir, { recursive: true, force: true }));

/** Every item of `items`. */
async function all<T>(items: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const item of items) out.push(item);
  return out;
}

/** `text` in chunks of `size` characters. */
async function* chunks(text: string, size: number): AsyncGenerator<string> {
  for (let at = 0; at < text.length; at += size) yield text.slice(at, at + size);
}

describe("a backup's text in the browser (BK-5)", () => {
  it("gives a Blob's first line and its lines after it as the same file on disk gives them", async () => {
    // About 300 KiB: several of the stream's reads, lines and the 2-byte and 4-byte characters split across them.
    const lines = Array.from({ length: 4_000 }, (_, i) => `INSERT INTO t VALUES (${i}, '${"é".repeat(i % 9)}${"x".repeat(40 + (i % 7))}🙂');`);
    const cases = [
      ["-- umbradb-backup {}", "", "SELECT 'a\rb';", ...lines, "-- last"].join("\n"),
      "#manifest only",
      "#manifest\nSELECT 1;\n",
      `${"m".repeat(200_000)}\nSELECT 1;`,
      "",
    ];
    for (const [index, content] of cases.entries()) {
      const file = join(dir, `case-${index}`);
      writeFileSync(file, content);
      const text = blobText(new Blob([content]));
      expect(await text.firstLine()).toBe(await firstLine(file));
      expect(await all(text.lines())).toEqual(await all(dumpLines(file)));
      // Read again: each read starts from the beginning.
      expect(await all(text.lines())).toEqual(await all(dumpLines(file)));
    }
  });

  it("splits lines at line feeds only, across chunks of every size", async () => {
    const content = "first\nsecond\r\n\nthird line\rwith a return\nlast";
    for (let size = 1; size <= content.length; size++) {
      expect(await firstLineOf(chunks(content, size))).toBe("first");
      expect(await all(linesAfterFirst(chunks(content, size)))).toEqual(["second\r", "", "third line\rwith a return", "last"]);
    }
    expect(await firstLineOf(chunks("", 1))).toBe("");
    expect(await all(linesAfterFirst(chunks("only\n", 2)))).toEqual([]);
  });

  it("stops reading a Blob once its first line is read", async () => {
    let pulled = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 1;
        controller.enqueue(new TextEncoder().encode(pulled === 1 ? "manifest\nSELECT 1;\n" : "SELECT 2;\n"));
      },
    });
    // A Blob whose stream never ends: only its first line can be read.
    const endless = { stream: () => stream } as unknown as Blob;
    expect(await blobText(endless).firstLine()).toBe("manifest");
    expect(pulled).toBeLessThan(10);
  });
});
