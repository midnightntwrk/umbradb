#!/usr/bin/env node
// Writes a backup's height and core revisions, from its manifest line, for deploy/umbradb.config.ts to keep.
// Usage: node scripts/core-history-from-backup.mjs <backup file> <output json>
import { createReadStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

const [file, out] = process.argv.slice(2);
if (file === undefined || out === undefined) {
  process.stderr.write("usage: node scripts/core-history-from-backup.mjs <backup file> <output json>\n");
  process.exit(2);
}

// The manifest is the first line; the rest is the dump, so stop reading there.
const lines = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
let line = "";
for await (line of lines) break;
lines.close();

const prefix = "-- umbradb-backup ";
if (!line.startsWith(prefix)) throw new Error(`${file} does not start with an umbradb-backup manifest`);
const { height, history } = JSON.parse(line.slice(prefix.length));
const core = history
  .filter((entry) => entry.id === "core")
  .map(({ start, stop, version, data }) => ({ start, stop, version, data }));
writeFileSync(out, `${JSON.stringify({ height, core }, null, 1)}\n`);
