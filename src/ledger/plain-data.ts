/**
 * What crosses from the ledger worker to the main thread: plain data, never a ledger package's object. Plain data is
 * what `./worker/protocol.ts` lists, the values that Node.js's and the browser's structured clone carry unchanged:
 * `undefined`, `null`, booleans, numbers, `bigint`s, strings, arrays, plain objects (whose prototype is
 * `Object.prototype` or `null`) and `Uint8Array`s. [LG-7, LG-17, Q49; design §5.1, §5.5]
 *
 * A WebAssembly-backed object (a wasm-bindgen class instance: a pointer into the package's memory, `__wbg_ptr`, behind
 * a class prototype) does not fail a structured clone. The clone is a plain object holding the pointer, which means
 * nothing outside the thread that made it. So {@link plainDataProblem} first walks the value and rejects anything else,
 * saying what it is and where. Then it makes the structured-clone round trip and requires the copy to be the same value.
 */

/** A value's place in a result, as a problem names it: `$`, `$.calls[2].address`, `$[0]`. */
type Path = string;

const PLAIN_PROTOTYPES: readonly (object | null)[] = [Object.prototype, null];

/** What a value is, as a problem names it: its class's name for an object of a class. */
function described(value: unknown): string {
  if (typeof value === "function") return "a function";
  if (typeof value === "symbol") return "a symbol";
  const name = (Object.getPrototypeOf(value) as { constructor?: { name?: unknown } } | null)?.constructor?.name;
  return typeof name === "string" && name !== "" ? `an object of the class ${name}` : "an object that is not plain";
}

const key = (path: Path, name: string): Path => (/^[A-Za-z_$][\w$]*$/.test(name) ? `${path}.${name}` : `${path}[${JSON.stringify(name)}]`);

/** Why `value` at `path` is not plain data, or null; `seen` holds the objects on the way (a cycle is refused). */
function walk(value: unknown, path: Path, seen: Set<object>): string | null {
  switch (typeof value) {
    case "undefined":
    case "boolean":
    case "number":
    case "bigint":
    case "string":
      return null;
    case "function":
    case "symbol":
      return `${described(value)} at ${path}`;
  }
  if (value === null) return null;
  const object = value as object;
  if (seen.has(object)) return `a cycle at ${path}`;
  if (object instanceof Uint8Array) {
    return Object.getPrototypeOf(object) === Uint8Array.prototype ? null : `${described(object)} at ${path}`;
  }
  seen.add(object);
  try {
    if (Array.isArray(object)) {
      if (Object.getPrototypeOf(object) !== Array.prototype) return `${described(object)} at ${path}`;
      for (let i = 0; i < object.length; i++) {
        const found = walk(object[i], `${path}[${i}]`, seen);
        if (found !== null) return found;
      }
      return null;
    }
    if (!PLAIN_PROTOTYPES.includes(Object.getPrototypeOf(object) as object | null)) return `${described(object)} at ${path}`;
    if (Object.getOwnPropertySymbols(object).length > 0) return `an object with symbol keys at ${path}`;
    for (const [name, inner] of Object.entries(object)) {
      const found = walk(inner, key(path, name), seen);
      if (found !== null) return found;
    }
    return null;
  } finally {
    seen.delete(object);
  }
}

/** Where `a` and `b` (a value and its structured clone) differ, or null when they are the same plain data. */
function differs(a: unknown, b: unknown, path: Path): string | null {
  if (typeof a !== typeof b) return path;
  if (a === null || typeof a !== "object") return Object.is(a, b) ? null : path;
  if (b === null || typeof b !== "object") return path;
  if (a instanceof Uint8Array) {
    return b instanceof Uint8Array && a.length === b.length && a.every((byte, i) => byte === b[i]) ? null : path;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return path;
    for (let i = 0; i < a.length; i++) {
      const found = differs(a[i], b[i], `${path}[${i}]`);
      if (found !== null) return found;
    }
    return null;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (Array.isArray(b) || b instanceof Uint8Array || keysA.length !== keysB.length) return path;
  for (const name of keysA) {
    if (!Object.hasOwn(b, name)) return key(path, name);
    const found = differs((a as Record<string, unknown>)[name], (b as Record<string, unknown>)[name], key(path, name));
    if (found !== null) return found;
  }
  return null;
}

/**
 * Why `value` is not plain data that a structured clone carries as it is (see the module comment) — what it holds and
 * where, `$` its root —, or null when it is.
 */
export function plainDataProblem(value: unknown): string | null {
  const found = walk(value, "$", new Set());
  if (found !== null) return found;
  let copy: unknown;
  try {
    copy = structuredClone(value);
  } catch (error) {
    return `a value structured clone refuses (${error instanceof Error ? error.message : String(error)})`;
  }
  const where = differs(value, copy, "$");
  return where === null ? null : `a value its structured clone does not keep, at ${where}`;
}
