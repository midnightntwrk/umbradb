/**
 * `node:path` in the browser build (`browser/build.ts`): POSIX `resolve`, `join`, `normalize`, `dirname` and
 * `basename` (without a suffix), as Node.js's `node:path/posix` computes them, with `/` as the working directory — a
 * browser has no file system, so a path there only names something (a backup's file name, which the page then saves).
 * `test/browser/shims.test.ts` holds them equal to Node.js's on random paths.
 */

export const sep = "/";
export const delimiter = ":";

/** `path` with `.` and `..` resolved and repeated `/` collapsed, keeping whether it is absolute and a trailing `/`. */
export function normalize(path: string): string {
  if (path === "") return ".";
  const absolute = path.startsWith("/");
  const trailing = path.endsWith("/");
  const parts: string[] = [];
  for (const part of path.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (parts.length > 0 && parts.at(-1) !== "..") parts.pop();
      else if (!absolute) parts.push("..");
    } else {
      parts.push(part);
    }
  }
  const body = parts.join("/");
  if (absolute) return `/${body}${trailing && body !== "" ? "/" : ""}`;
  if (body === "") return trailing ? "./" : ".";
  return `${body}${trailing ? "/" : ""}`;
}

export function join(...paths: string[]): string {
  const joined = paths.filter((path) => path !== "").join("/");
  return joined === "" ? "." : normalize(joined);
}

/** The absolute path of `paths`, the last absolute one first, from `/` (the browser's working directory). */
export function resolve(...paths: string[]): string {
  let resolved = "";
  for (let i = paths.length - 1; i >= 0 && !resolved.startsWith("/"); i--) {
    const path = paths[i] as string;
    if (path !== "") resolved = resolved === "" ? path : `${path}/${resolved}`;
  }
  const normalized = normalize(`/${resolved}`);
  return normalized.length > 1 && normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

export function dirname(path: string): string {
  if (path === "") return ".";
  const trimmed = path.replace(/\/+$/, "");
  if (trimmed === "") return "/";
  const at = trimmed.lastIndexOf("/");
  if (at < 0) return ".";
  const head = trimmed.slice(0, at).replace(/\/+$/, "");
  return head === "" ? "/" : head;
}

/** The last part of `path` (no suffix is taken off: Node.js's own rules for one differ between edge cases). */
export function basename(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed.slice(trimmed.lastIndexOf("/") + 1);
}
