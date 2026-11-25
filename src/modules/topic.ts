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
}

/** {@link Topic}, typed by its schema. */
export const defineTopic = <S extends z.ZodType>(name: string, schema: S): Topic<S> => Object.freeze({ name, schema });

/** Where `on-db-write` publishes to its module's topics. */
export interface TopicSink {
  /** Encodes `value` with the topic's schema now, and throws if it refuses it; sent once the height commits. */
  emit<S extends z.ZodType>(topic: Topic<S>, value: z.output<S>): void;
}
