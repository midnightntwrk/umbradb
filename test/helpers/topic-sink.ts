import type { TopicSink } from "../../src/modules/topic.js";

/** A topic sink for tests that call `on-db-write` directly: emits are dropped. */
export const NO_TOPICS: TopicSink = Object.freeze({ emit: () => undefined });
