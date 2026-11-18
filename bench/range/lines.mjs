// What the readers of a run folder share: its files read so that a run that did not end well (stopped by a signal,
// a full disk, a process that never committed a height) is said in one line on standard error, not a stack.
import { readFileSync } from "node:fs";

/** From here on, an error ends the script with status 1 and one line: `<script>: <message>`. */
export function oneLine(script) {
  process.on("uncaughtException", (error) => {
    console.error(`${script}: ${error.message}`);
    process.exit(1);
  });
}

/**
 * The records of a JSON-lines file. A last line cut mid-write is left out, and said on standard error; any other line
 * that is not JSON, or a file with no line, is an error.
 */
export function jsonLines(file) {
  const lines = readFileSync(file, "utf8").split("\n");
  const last = lines.findLastIndex((line) => line.trim() !== "");
  if (last < 0) throw new Error(`${file} holds no line: the run committed nothing (see its run.log)`);
  const records = [];
  lines.forEach((line, index) => {
    if (line.trim() === "") return;
    try {
      records.push(JSON.parse(line));
    } catch {
      if (index !== last) throw new Error(`${file}: line ${index + 1} is not JSON`);
      console.error(`${file}: its last line (${index + 1}) is cut; it is left out`);
    }
  });
  return records;
}

/** A JSON file's value; a file that is missing, empty or not JSON is an error that names it. */
export function jsonFile(file) {
  const text = readFileSync(file, "utf8");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${file} is ${text.trim() === "" ? "empty" : "not JSON"}: the run did not end well (see its run.log)`);
  }
}
