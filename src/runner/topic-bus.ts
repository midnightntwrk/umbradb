/**
 * The topic bus: holds what modules emit in `on-db-write` per height, and sends each subscriber one frame per committed
 * height (empty ones too), in height order. Live only: a subscriber that misses heights catches up through routes.
 */

import { z } from "zod";
import type { ModuleDeclaration } from "../modules/declaration.js";
import type { Topic, TopicSink } from "../modules/topic.js";
import { encodeAsciiJson } from "./api-json.js";
import type { FollowedBlock, TransactionFollower } from "./transaction-follower.js";

/** One connection's end of the bus: it writes each frame as its carrier sends a message. Never throws. */
export interface TopicSubscriber {
  deliver(text: string): void;
}

/** Told of an emit from a sink kept past its callback: the refusal and the module. */
export type LateEmit = (error: Error, module: string) => void;

/** One emitted message: its topic's id and the message's JSON. */
interface Message {
  readonly topic: string;
  readonly text: string;
}

/** A topic's id on the wire. */
export const topicId = (module: string, topic: string): string => `${module}.${topic}`;

/** The topic bus (see the module comment). */
export class TopicBus implements TransactionFollower {
  readonly #topics: ReadonlySet<string>;
  readonly #pending = new Map<bigint, Message[]>();
  readonly #subscribers = new Map<TopicSubscriber, Set<string>>();
  #height: bigint | null;

  /** Over the topics of `parts` (those this process runs), with `committed` the cursor's height. */
  constructor(parts: readonly ModuleDeclaration[] = [], committed: bigint | null = null) {
    this.#topics = new Set(parts.flatMap((part) => (part.topics ?? []).map((topic) => topicId(part.id, topic.name))));
    this.#height = committed;
  }

  /** The last committed height the bus knows of: the next frame is the one after it. Null before any. */
  get height(): bigint | null {
    return this.#height;
  }

  /** How many connections receive frames: subscribed and not yet stopped or ended. */
  get subscriberCount(): number {
    return this.#subscribers.size;
  }

  /** Whether `id` names a topic of a part this process runs. */
  has(id: string): boolean {
    return this.#topics.has(id);
  }

  /**
   * Runs `part`'s `on-db-write` at `height` with its own sink; its emits are held only if it resolves. Encoding at the
   * emit means a bad value fails the height whether or not anyone is subscribed.
   */
  async collect<T>(part: ModuleDeclaration, height: bigint, body: (sink: TopicSink) => Promise<T>, late: LateEmit): Promise<T> {
    const buffer: Message[] = [];
    let running = true;
    let refused: Error | undefined;
    const sink: TopicSink = Object.freeze({
      emit: (topic: Topic, value: unknown): void => {
        let message: Message;
        try {
          message = this.#encode(part, height, topic, value, running);
        } catch (error) {
          const refusal = error as Error;
          if (running) refused ??= refusal;
          else late(refusal, part.id);
          throw refusal;
        }
        buffer.push(message);
      },
    });
    let result: T;
    try {
      result = await body(sink);
    } finally {
      running = false;
    }
    if (refused !== undefined) throw refused;
    if (buffer.length > 0) {
      const held = this.#pending.get(height);
      if (held === undefined) this.#pending.set(height, buffer);
      else held.push(...buffer);
    }
    return result;
  }

  /** `value` emitted to `topic` as a message, or throws why `part` may not emit it. */
  #encode(part: ModuleDeclaration, height: bigint, topic: Topic, value: unknown, running: boolean): Message {
    const at = `at height ${height}`;
    const name = typeof topic === "object" && topic !== null ? String(topic.name) : String(topic);
    if (!running) {
      throw new Error(`${part.id} emitted to the topic ${name} after its on-db-write callback ${at} ended: a sink is valid only while its callback runs`);
    }
    if (!(part.topics ?? []).includes(topic)) {
      throw new Error(`${part.id} emitted to the topic ${name}, which it does not declare in topics, ${at}`);
    }
    const id = topicId(part.id, topic.name);
    let written: ReturnType<typeof z.safeEncode>;
    try {
      written = z.safeEncode(topic.schema, value as never);
    } catch (error) {
      const why = error instanceof Error ? error.message : String(error);
      throw new Error(`the topic ${id}'s schema cannot write a message (${why}): a topic takes a codec, never a transform`);
    }
    if (!written.success) {
      const issues = written.error.issues.slice(0, 5).map((issue) => `${issue.path.join("/") || "value"}: ${issue.message}`);
      throw new Error(`${part.id} emitted a message its topic ${id}'s schema refuses ${at}: ${issues.join("; ")}`);
    }
    let text: string;
    try {
      text = encodeAsciiJson({ topic: id, value: written.data });
    } catch (error) {
      const why = error instanceof Error ? error.message : String(error);
      throw new Error(`${part.id} emitted a message JSON cannot carry to the topic ${id} ${at} (${why})`);
    }
    return { topic: id, text };
  }

  /** Adds `topics` (none: heights only) to `subscriber`'s, which must all be {@link has}; returns all it holds. */
  subscribe(subscriber: TopicSubscriber, topics: readonly string[]): readonly string[] {
    let held = this.#subscribers.get(subscriber);
    if (held === undefined) this.#subscribers.set(subscriber, (held = new Set()));
    for (const topic of topics) held.add(topic);
    return [...held];
  }

  /** Removes `topics` from `subscriber`'s, stopping its frames when none is left; returns those it still holds. */
  unsubscribe(subscriber: TopicSubscriber, topics: readonly string[]): readonly string[] {
    const held = this.#subscribers.get(subscriber);
    if (held === undefined) return [];
    // With no topic left, the subscription stops: `[]` is how a heights-only one ends.
    for (const topic of topics) held.delete(topic);
    if (held.size === 0) this.#subscribers.delete(subscriber);
    return [...held];
  }

  /** Forgets `subscriber`: its connection ended. */
  detach(subscriber: TopicSubscriber): void {
    this.#subscribers.delete(subscriber);
  }

  written(): void {}

  committed(block: FollowedBlock): void {
    const messages = this.#pending.get(block.height) ?? [];
    this.#pending.delete(block.height);
    // The cursor's re-delivery after a restart: already sent, or sent by an earlier process.
    if (this.#height !== null && block.height <= this.#height) return;
    this.#height = block.height;
    if (this.#subscribers.size === 0) return;
    const head = `{"type":"height","height":"${block.height}","hash":${encodeAsciiJson(block.hash)},"messages":[`;
    for (const [subscriber, held] of [...this.#subscribers]) {
      const frame = `${head}${messages.flatMap((message) => (held.has(message.topic) ? [message.text] : [])).join(",")}]}`;
      try {
        subscriber.deliver(frame);
      } catch {
        // A follower never throws; a carrier that does has ended, and its connection detaches itself.
      }
    }
  }

  rolledBack(block: FollowedBlock): void {
    this.#pending.delete(block.height);
  }
}
