import type { Database } from "../../src/db/api.js";

/**
 * A144's runtime check of the `db` item (task 2.8; CD-1, Q73), shared by the database API's tests
 * (`read-only-database.test.ts`) and `core-chain`'s, which publishes the item (task 10.2): what a module finds on it by
 * ordinary use, none of which may lead to a write, a transaction, a close or the database itself.
 */

/** Names a database offers besides `read`, or a write path would take; none may be found on the `db` item. */
const NOT_OFFERED = ["transaction", "close", "execute", "query", "write", "exec", "end"] as const;

/** The objects a value's prototype chain holds, Object.prototype (shared by every object) and null left out. */
function prototypesOf(value: object): object[] {
  const chain: object[] = [];
  for (let proto = Object.getPrototypeOf(value) as object | null; proto !== null && proto !== Object.prototype; ) {
    chain.push(proto);
    proto = Object.getPrototypeOf(proto) as object | null;
  }
  return chain;
}

/** Every property name `value` has, own or through its prototypes (Object.prototype's left out). */
function namesOf(value: object): Set<PropertyKey> {
  const names = new Set<PropertyKey>();
  for (const holder of [value, ...prototypesOf(value)]) for (const key of Reflect.ownKeys(holder)) names.add(key);
  return names;
}

/**
 * A144's runtime check: what a module finds on the `db` item by ordinary use — `Object.keys`, `in`, a property read,
 * the values its properties, its prototypes and its `read` function hold. Empty when the item offers `read` only:
 * nothing named `transaction`, `close` or a write, nothing else the `Database` itself offers, and no path to it.
 */
export function readOnlyProblems(candidate: object, db: Database): string[] {
  const problems: string[] = [];
  if (candidate === db) problems.push("it is the database itself");
  const own = Reflect.ownKeys(candidate);
  if (own.length !== 1 || own[0] !== "read") problems.push(`its own properties are [${own.map(String).join(", ")}]`);
  const read = (candidate as { read?: unknown }).read;
  if (typeof read !== "function") problems.push("it has no read function");
  const names = new Set<PropertyKey>([...NOT_OFFERED, ...namesOf(db)]);
  names.delete("read");
  for (const name of names) {
    // A name every object has (`constructor`, `toString`, …) is found on any object; only the database's own count.
    if (name in Object.prototype) continue;
    if (name in candidate) problems.push(`it offers ${String(name)}`);
  }
  const prototypes = prototypesOf(candidate);
  if (candidate !== db && prototypes.includes(db)) problems.push("its prototype is the database");
  const holders = [candidate, ...prototypes, ...(typeof read === "function" ? [read] : [])];
  for (const holder of holders) {
    for (const key of Reflect.ownKeys(holder)) {
      const descriptor = Object.getOwnPropertyDescriptor(holder, key);
      if (descriptor !== undefined && "value" in descriptor && descriptor.value === db) {
        problems.push(`its ${String(key)} holds the database`);
      }
    }
  }
  return problems;
}
