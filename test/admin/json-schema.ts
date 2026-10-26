import { readFileSync } from "node:fs";
import { Ajv2020, type ErrorObject } from "ajv/dist/2020.js";

/**
 * The admin endpoints' JSON schemas (tasks 8.3, 8.4; A66): each body's schema is a JSON Schema draft 2020-12 file
 * committed with its part's tests (`test/backbone/core-status/status.schema.json`, `…/core-config/config.schema.json`),
 * checked by Ajv 8.18.0 (`ajv`, a pinned development dependency: the reference validator of the draft, in the tree
 * already as Stryker's) in strict mode — an unknown keyword, an ambiguous type or a misspelled one refuses the schema
 * itself, so a typo cannot quietly weaken it — with every error reported. Each schema is first checked against the
 * draft's meta-schema.
 */

/** A schema file, parsed. */
export function schemaFile(url: URL): Record<string, unknown> {
  return JSON.parse(readFileSync(url, "utf8")) as Record<string, unknown>;
}

/** A compiled schema: the problems of a value, as `<path>: <message>` lines, none when it validates. */
export interface Validator {
  problems(value: unknown): string[];
}

const text = (error: ErrorObject): string =>
  `${error.instancePath || "/"}: ${error.message ?? error.keyword}${error.params === undefined ? "" : ` ${JSON.stringify(error.params)}`}`;

/** `schema` compiled strictly (see the module comment); throws when it is no valid draft 2020-12 schema. */
export function validatorOf(schema: Record<string, unknown>): Validator {
  const ajv = new Ajv2020({ strict: true, allErrors: true });
  if (!ajv.validateSchema(schema)) {
    throw new Error(`not a draft 2020-12 schema: ${(ajv.errors ?? []).map(text).join("; ")}`);
  }
  const validate = ajv.compile(schema);
  return {
    problems(value) {
      return validate(value) ? [] : (validate.errors ?? []).map(text);
    },
  };
}
