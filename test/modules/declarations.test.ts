import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";
import type { BlockWriteHandle, ReadHandle, SchemaWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import {
  type ApiRegistry,
  type BlockContext,
  defineModule,
  type ItemSink,
  type ModuleDeclaration,
  type PendingKey,
  type PointCallbacks,
  type PointName,
  POINTS,
  type ProcessContext,
} from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { declaration, userModules } from "./declarations.js";

/**
 * A20 (MD-1; task 3.1): a module is a declaration the host imports, and its callbacks are keyed by point name. A
 * declaration with an unknown point name is a type error, and the same declaration built without types is refused at
 * startup with `unknown-point` — so declaration validation (`src/modules/validation.ts`) refuses what the types forbid,
 * whether the module was written in TypeScript, in JavaScript, or built at run time. "Startup refuses" is the runner's
 * (task 5.x), which validates the declarations it is given before anything else; here the validation is called
 * directly.
 */

const REPOSITORY = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** The declaration written in JavaScript, imported by URL so that the compiler gives it no type at all. */
const UNTYPED = new URL("./fixtures/untyped-module.mjs", import.meta.url).href;

/** The point names of `design.md` §2's table, in its order. */
function designPoints(): string[] {
  const design = readFileSync(join(REPOSITORY, "openspec", "changes", "core-arch", "design.md"), "utf8");
  const start = design.indexOf("\n## 2. Points\n");
  const end = design.indexOf("\n## 3. ", start);
  return design
    .slice(start, end)
    .split("\n")
    .map((line) => /^\| `(on-[a-z-]+)` \|/.exec(line)?.[1])
    .filter((name): name is string => name !== undefined);
}

/** The refusal `run` throws; fails the test if it returns. */
function refusal(run: () => unknown): UmbraError {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(UmbraError);
    return error as UmbraError;
  }
  return expect.unreachable("expected a refusal");
}

/**
 * The type-level form of A20's check: true when the declaration type `D` is accepted by the definer `F` (a function
 * whose parameter type may depend on `D`, as `defineModule`'s does).
 */
type Accepts<F extends (declaration: never) => unknown, D> = [D] extends [Parameters<F>[0]] ? true : false;

/** A declaration type with a callback under a point name that does not exist (the point is `on-fetch`). */
type WithUnknownPoint = Omit<ModuleDeclaration, "points"> & {
  points: { "on-fetch": () => Promise<void>; "on-fetched": () => Promise<void> };
};
/** The same declaration with known point names only. */
type WithKnownPoints = Omit<ModuleDeclaration, "points"> & { points: { "on-fetch": () => Promise<void> } };

describe("A20: the points (MD-1, design.md §2)", () => {
  it("names the thirteen points of design.md §2, in its order", () => {
    expect(POINTS).toEqual(designPoints());
    expect(POINTS).toHaveLength(13);
    expect(Object.isFrozen(POINTS)).toBe(true);
    expectTypeOf<PointName>().toEqualTypeOf<(typeof POINTS)[number]>();
    expectTypeOf<keyof PointCallbacks>().toEqualTypeOf<PointName>();
  });

  it("types each callback's arguments by its point (CORE-ARCH §4.10)", () => {
    const typed = defineModule(
      declaration("typed", {
        points: {
          "on-start-db": async (p, w) => {
            expectTypeOf(p).toEqualTypeOf<ProcessContext>();
            expectTypeOf(w).toEqualTypeOf<SchemaWriteHandle>();
          },
          "on-start-api": async (_p, api) => {
            expectTypeOf(api).toEqualTypeOf<ApiRegistry>();
          },
          "on-fetch": async (_p, b, out) => {
            expectTypeOf(b).toEqualTypeOf<BlockContext>();
            expectTypeOf(out).toEqualTypeOf<ItemSink>();
          },
          "on-compute": async (_p, _b, read) => {
            expectTypeOf(read).toEqualTypeOf<ReadHandle>();
          },
          "on-db-write": async (_p, _b, w) => {
            expectTypeOf(w).toEqualTypeOf<BlockWriteHandle>();
          },
          "on-after-db-write": async (_p, b, read) => {
            expectTypeOf(b).toEqualTypeOf<BlockContext>();
            expectTypeOf(read).toEqualTypeOf<ReadHandle>();
          },
        },
      }),
    );
    // The read handles RN-4 and design.md §2 give these points (decision record Q100, option A): `on-finalized` at
    // the cursor, `on-start-height` at h − 1, `on-stop-height` at h, `on-key` at the cursor.
    type Rest<P extends PointName> = PointCallbacks[P] extends (p: ProcessContext, ...rest: infer R) => Promise<void>
      ? R
      : never;
    expectTypeOf<Rest<"on-finalized">>().toEqualTypeOf<[head: { height: bigint; hash: Uint8Array }, read: ReadHandle]>();
    expectTypeOf<Rest<"on-start-height">>().toEqualTypeOf<[e: { entryId: string; height: bigint }, read: ReadHandle]>();
    expectTypeOf<Rest<"on-stop-height">>().toEqualTypeOf<[e: { entryId: string; height: bigint }, read: ReadHandle]>();
    expectTypeOf<Rest<"on-key">>().toEqualTypeOf<[key: PendingKey, read: ReadHandle]>();
    expectTypeOf(typed).toMatchTypeOf<ModuleDeclaration>();
  });
});

describe("A20: an unknown point name is a type error (MD-1)", () => {
  it("defineModule rejects a callback under an unknown point name, alone, beside a known one, or in a variable", () => {
    const alone = () =>
      defineModule({
        ...declaration("fetch-stats"),
        // @ts-expect-error A20: `on-fetched` is not a point (the point is `on-fetch`).
        points: { "on-fetched": async () => {} },
      });
    const beside = () =>
      defineModule({
        ...declaration("fetch-stats"),
        points: {
          "on-fetch": async () => {},
          // @ts-expect-error A20: `on-fetched` is not a point, even beside one that is.
          "on-fetched": async () => {},
        },
      });
    const built = { ...declaration("fetch-stats"), points: { "on-fetch": async () => {}, "on-fetched": async () => {} } };
    // @ts-expect-error A20: a declaration built first and passed later is checked the same way.
    const later = () => defineModule(built);
    expectTypeOf(alone).toBeFunction();
    expectTypeOf(beside).toBeFunction();
    expectTypeOf(later).toBeFunction();
  });

  it("a ModuleDeclaration written as a literal rejects an unknown point name too", () => {
    const literal = (): ModuleDeclaration => ({
      ...declaration("fetch-stats"),
      // @ts-expect-error A20: `on-fetched` is not a point.
      points: { "on-fetched": async () => {} },
    });
    expectTypeOf(literal).toBeFunction();
  });

  it("accepts the same declaration with its callback under the known name", () => {
    expectTypeOf<Accepts<typeof defineModule<WithKnownPoints>, WithKnownPoints>>().toEqualTypeOf<true>();
    expectTypeOf<Accepts<typeof defineModule<WithUnknownPoint>, WithUnknownPoint>>().toEqualTypeOf<false>();
  });

  it("negative control: a definer whose type accepts any point name fails the check", () => {
    // What `defineModule` would be if its type did not check the point names: `Partial<PointCallbacks>` alone lets a
    // declaration built first carry any extra name.
    const loose = <D extends ModuleDeclaration>(declaration: D): D => declaration;
    expectTypeOf<Accepts<typeof loose<WithUnknownPoint>, WithUnknownPoint>>().toEqualTypeOf<true>();
    expectTypeOf(loose).toBeFunction();
  });

  it("returns the declaration it is given, unchanged", () => {
    const given = declaration("same");
    const before = { ...given, provides: [...given.provides], points: { ...given.points } };
    expect(defineModule(given)).toBe(given);
    expect(given).toEqual(before);
  });
});

describe("A20: the same declaration built without types is refused at startup with unknown-point (MD-1)", () => {
  it("refuses the declaration the type test rejects, built anyway", () => {
    const built = defineModule({
      ...declaration("fetch-stats"),
      // @ts-expect-error A20: built without types — the compiler's verdict is ignored here, as JavaScript would.
      points: { "on-fetched": async () => {} },
    });
    const error = refusal(() => validateDeclarations(userModules([built])));
    expect(error.code).toBe("unknown-point");
    expect(error.retryable).toBe(false);
    expect(error.details).toEqual({ module: "fetch-stats", point: "on-fetched" });
    expect(error.message).toContain('module fetch-stats declares a callback under "on-fetched", which is not a point');
    // The message lists the points, so the fix is in the message.
    for (const point of POINTS) expect(error.message).toContain(point);
  });

  it("refuses the same declaration written in JavaScript (test/modules/fixtures/untyped-module.mjs)", async () => {
    const untyped: unknown = ((await import(UNTYPED)) as { default: unknown }).default;
    const error = refusal(() => validateDeclarations(userModules([untyped])));
    expect(error.code).toBe("unknown-point");
    expect(error.details).toEqual({ module: "fetch-stats", point: "on-fetched" });
  });

  it("control: the same declarations with the known point name are accepted", async () => {
    const typed = defineModule({ ...declaration("fetch-stats"), points: { "on-fetch": async () => {} } });
    const untyped = ((await import(UNTYPED)) as { default: { points: Record<string, unknown> } }).default;
    const renamed = { ...untyped, points: { "on-fetch": untyped.points["on-fetched"] } };
    expect(validateDeclarations(userModules([typed])).user).toEqual([typed]);
    expect(validateDeclarations(userModules([renamed])).user).toEqual([renamed]);
  });

  it("refuses an unknown point on a backbone part and a core module alike", () => {
    for (const origin of ["backbone", "core"] as const) {
      const part = { ...declaration("core-x"), points: { "on-commit": async () => {} } };
      const error = refusal(() => validateDeclarations({ backbone: [], core: [], user: [], [origin]: [part] }));
      expect(error.code, origin).toBe("unknown-point");
      expect(error.details, origin).toEqual({ module: "core-x", point: "on-commit" });
    }
  });
});

describe("[DOC] the module guide's section on tables declared deterministic: false (MD-1, Q76)", () => {
  const guide = readFileSync(join(REPOSITORY, "docs", "module-guide.md"), "utf8");
  const heading = "\n## Data that is not a function of the chain\n";
  const start = guide.indexOf(heading);
  const end = guide.indexOf("\n## ", start + 1);
  const section = start === -1 ? "" : guide.slice(start, end === -1 ? undefined : end);

  it("has the section, after the one on reading through db, which names the opt-out", () => {
    const reading = guide.indexOf("\n## Reading through `db`\n");
    expect(reading).toBeGreaterThan(-1);
    expect(start).toBeGreaterThan(reading);
    expect(guide.slice(reading, start)).toContain("`deterministic: false`");
  });

  it("states how to declare it, what it skips, what it keeps, and that nothing deterministic may come from it", () => {
    for (const text of [
      "`deterministic: false`",
      "not a function of the chain",
      "Nothing deterministic may be computed from such a table",
      "derived from a `db.read`",
      "split it in two",
      "every other table of the module is still checked",
      "the contents hash records its schema and name only",
      "digests skip it",
      "`TRUNCATE`",
      "every provider of a shared item declares the same flag",
      "`shared-item-migrations-differ`",
    ]) {
      expect(section, text).toContain(text);
    }
  });

  it("shows the declaration", () => {
    expect(section).toMatch(/table: \{ schema: "[a-z_]+", tables: \[[^\]]+\], kind: "(append-only|mutable)", deterministic: false \}/);
  });
});

/** Not a test of UmbraDB: the zod behaviour the field-kind rule relies on (task 0.1's probe, design.md §7). */
describe("the zod 4 behaviour a settings field's kind is read through", () => {
  it("reads the kind from the field's outermost schema only", () => {
    expect(z.number().default(1).meta({ kind: "data" }).meta()).toEqual({ kind: "data" });
    expect(z.number().meta({ kind: "data" }).default(1).meta()).toBeUndefined();
  });
});
