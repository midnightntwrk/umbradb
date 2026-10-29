import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The allowed node methods, read from the ingest spec itself (`specs/ingest/spec.md`, the requirement under
 * {@link HEADING}). This binds the node client's list and the tests' checks to the written requirement rather than to
 * a copy of it. The spec is found by its heading anywhere under `openspec/`, so the read survives the change being
 * synced or archived; every copy found must give the same list. [IN-8]
 */

export const REPOSITORY = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const HEADING = "### Requirement: IN-8 Only these node calls";

/** The methods named in the allowed-node-calls requirement's text, in the order it names them. [IN-8] */
export function in8Methods(): string[] {
  const openspec = join(REPOSITORY, "openspec");
  const specs = (readdirSync(openspec, { recursive: true, encoding: "utf8" }) as string[])
    .filter((path) => basename(path) === "spec.md")
    .map((path) => readFileSync(join(openspec, path), "utf8"))
    .filter((text) => text.includes(HEADING));
  if (specs.length === 0) throw new Error(`no spec.md under openspec/ holds ${JSON.stringify(HEADING)}`);
  const lists = specs.map((text) => {
    const start = text.indexOf(HEADING) + HEADING.length;
    const end = text.indexOf("\n#### ", start);
    return [...text.slice(start, end).matchAll(/`([a-z]+_[A-Za-z]+)`/g)].map((match) => match[1] as string);
  });
  const [first, ...others] = lists as [string[], ...string[][]];
  for (const other of others) {
    if (JSON.stringify(other) !== JSON.stringify(first)) throw new Error("the copies of IN-8 name different methods");
  }
  return first;
}

/** The methods of `methods` that are not allowed node calls, each once, in first-seen order. [IN-8] */
export function outsideIn8(methods: readonly string[]): string[] {
  const allowed = new Set(in8Methods());
  return [...new Set(methods.filter((method) => !allowed.has(method)))];
}
