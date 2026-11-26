/**
 * A topic: a named stream a module publishes to from `on-db-write`. Declared up front in the module's `topics`, it is
 * served to subscribers as `<module-id>.<name>`, one frame per committed height (`../runner/topic-bus.ts`).
 */

import type { z } from "zod";

/** A topic (see the module comment). Its schema follows a route output's rules: the wire side is JSON. */
export interface Topic<S extends z.ZodType = z.ZodType> {
  /** lowerCamelCase, unique within the module. */
  readonly name: string;
  readonly schema: S;
  /** One sentence a description of the API may show. */
  readonly description?: string;
}

/** {@link Topic}, typed by its schema: `defineTopic("blocks", Block, { description: "…" })`. */
export const defineTopic = <S extends z.ZodType>(name: string, schema: S, options: { readonly description?: string } = {}): Topic<S> =>
  Object.freeze({ name, schema, ...(options.description === undefined ? {} : { description: options.description }) });

/** Where `on-db-write` publishes to its module's topics. */
export interface TopicSink {
  /** Encodes `value` with the topic's schema now, and throws if it refuses it; sent once the height commits. */
  emit<S extends z.ZodType>(topic: Topic<S>, value: z.output<S>): void;
}
