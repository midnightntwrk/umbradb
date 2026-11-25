import { describe, expect, it } from "vitest";
import { z } from "zod";
import { UmbraError } from "../../src/db/errors.js";
import { bigintText } from "../../src/helpers/bigint-text.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { defineTopic } from "../../src/modules/topic.js";
import { declaration, userModules } from "./declarations.js";

// Validation of a module's `topics`, applied also to a declaration built without types: a list of `{ name, schema }`,
// each name lowerCamelCase and declared once, each schema a zod schema whose wire side JSON can carry. Each refusal is
// `invalid-declaration`, naming the field.

const HEIGHTS = defineTopic("heights", z.object({ height: bigintText() }));

/** The refusal of validating a module with `topics` alone as a user module. */
function refusal(topics: unknown): UmbraError {
  try {
    validateDeclarations(userModules([{ ...declaration("m"), topics }]));
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  return expect.unreachable("expected a refusal");
}

describe("topics in a declaration", () => {
  it("accepts a module's topics, none, and an empty list", () => {
    const modules = [
      declaration("with-topics", { topics: [HEIGHTS, defineTopic("rows2", z.array(z.string()), { description: "Rows." })] }),
      declaration("no-topics"),
      declaration("empty-topics", { topics: [] }),
    ];
    expect(validateDeclarations(userModules(modules)).user).toEqual(modules);
  });

  const cases: { name: string; topics: unknown; field: string; says: string }[] = [
    { name: "not a list", topics: HEIGHTS, field: "topics", says: "a list of topics" },
    { name: "a topic that is not an object", topics: ["heights"], field: "topics[0]", says: "a topic" },
    { name: "a topic with an unknown property", topics: [{ ...HEIGHTS, args: 1 }], field: "topics[0].args", says: "name, schema" },
    { name: "a topic without its name", topics: [{ schema: HEIGHTS.schema }], field: "topics[0].name", says: "a string" },
    { name: "a name that is not lowerCamelCase", topics: [defineTopic("new-blocks", z.string())], field: "topics[0].name", says: "lowerCamelCase" },
    { name: "a topic declared twice", topics: [HEIGHTS, HEIGHTS], field: "topics[1].name", says: "declares the topic heights twice" },
    { name: "a schema that is not zod's", topics: [{ name: "heights", schema: {} }], field: "topics[0].schema", says: "a zod schema" },
    { name: "a description that is not text", topics: [{ ...HEIGHTS, description: 1 }], field: "topics[0].description", says: "a string" },
    { name: "a schema JSON cannot carry", topics: [defineTopic("heights", z.bigint())], field: "topics[0].schema", says: "JSON cannot carry" },
  ];
  for (const c of cases) {
    it(`refuses ${c.name} (invalid-declaration)`, () => {
      const error = refusal(c.topics);
      expect(error.code).toBe("invalid-declaration");
      expect(error.details).toMatchObject({ origin: "user", index: 0, field: c.field });
      expect(error.message).toContain(c.says);
    });
  }
});
