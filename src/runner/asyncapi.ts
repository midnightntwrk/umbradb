/**
 * The module API's topics as an AsyncAPI 3.0 document, served at `GET /asyncapi.json` (`./api-docs.ts`): the
 * subscription protocol of `./api-session.ts` and each declared topic's message schema. Built from the declarations
 * alone, so a module documents its topics by declaring them.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../config/build.js";
import { writtenSide } from "../helpers/bigint-text.js";
import type { Topic } from "../modules/topic.js";
import { embed, type Json } from "./openapi.js";
import { topicId } from "./topic-bus.js";

/** A declared topic, as the topic bus holds it. */
export interface DeclaredTopic {
  readonly module: string;
  readonly topic: Topic;
}

const ref = (path: string) => ({ $ref: path });
const message = (name: string) => ref(`#/channels/subscriptions/messages/${name}`);
const DIGITS = { type: "string", pattern: "^(0|[1-9][0-9]*)$" };

/** The AsyncAPI 3.0 document of `topics` (see the module comment). */
export function asyncApiDocument(topics: readonly DeclaredTopic[], description?: string): Json {
  const schemas: Json = {};
  const ids: string[] = [];
  for (const { module, topic } of topics) {
    const id = topicId(module, topic.name);
    ids.push(id);
    // An emit is written with the schema, so the value is described as written.
    const written = z.toJSONSchema(topic.schema, { io: "input", override: writtenSide });
    schemas[id] = {
      type: "object",
      ...(topic.description === undefined ? {} : { description: topic.description }),
      required: ["topic", "value"],
      properties: { topic: { const: id }, value: embed(written, `${id}.value`, schemas) },
    };
  }
  const topicList = { type: "array", items: ids.length > 0 ? { type: "string", enum: ids } : { type: "string" }, ...(ids.length > 0 ? {} : { maxItems: 0 }) };
  const typed = (type: string, properties: Json, required: string[]): Json => ({
    type: "object",
    required: ["type", ...required],
    properties: { type: { const: type }, ...properties },
  });

  const messages: Json = {
    subscribe: {
      title: "subscribe",
      summary: "Adds topics, all or none. topics: [] follows the heights alone.",
      payload: typed("subscribe", { topics: topicList }, ["topics"]),
    },
    unsubscribe: {
      title: "unsubscribe",
      summary: "Removes topics. Frames stop once none is left.",
      payload: typed("unsubscribe", { topics: topicList }, ["topics"]),
    },
    subscribed: {
      title: "subscribed",
      summary: "The topics held, and the committed height the next frame follows (null before any).",
      payload: typed("subscribed", { topics: topicList, height: { anyOf: [DIGITS, { type: "null" }] } }, ["topics", "height"]),
    },
    unsubscribed: {
      title: "unsubscribed",
      summary: "The topics still held.",
      payload: typed("unsubscribed", { topics: topicList }, ["topics"]),
    },
    error: {
      title: "error",
      summary: "A message the server could not act on.",
      payload: typed("error", { error: { type: "object", required: ["code", "message"], properties: { code: { type: "string" }, message: { type: "string" } } } }, ["error"]),
    },
    height: {
      title: "height",
      summary: "One frame per committed height, in order, with the messages of the subscribed topics at that height (often none).",
      payload: typed(
        "height",
        {
          height: DIGITS,
          hash: { type: "string", pattern: "^0x[0-9a-f]*$" },
          messages: { type: "array", ...(ids.length > 0 ? { items: { oneOf: ids.map((id) => ref(`#/components/schemas/${id}`)) } } : { maxItems: 0 }) },
        },
        ["height", "hash", "messages"],
      ),
    },
  };

  return {
    asyncapi: "3.0.0",
    info: { title: "UmbraDB module API: topics", version: UMBRADB_VERSION, ...(description === undefined ? {} : { description }) },
    defaultContentType: "application/json",
    channels: {
      subscriptions: {
        address: "/",
        title: "Subscriptions",
        description:
          "A WebSocket to the module API's address, at any path. Each message is one JSON text frame. A subscriber " +
          "that falls behind is disconnected and catches up through the routes.",
        messages: Object.fromEntries(Object.keys(messages).map((name) => [name, ref(`#/components/messages/${name}`)])),
      },
    },
    operations: {
      subscribe: {
        action: "send",
        channel: ref("#/channels/subscriptions"),
        messages: [message("subscribe")],
        reply: { channel: ref("#/channels/subscriptions"), messages: [message("subscribed"), message("error")] },
      },
      unsubscribe: {
        action: "send",
        channel: ref("#/channels/subscriptions"),
        messages: [message("unsubscribe")],
        reply: { channel: ref("#/channels/subscriptions"), messages: [message("unsubscribed"), message("error")] },
      },
      receiveHeights: { action: "receive", channel: ref("#/channels/subscriptions"), messages: [message("height")] },
    },
    components: { messages, schemas },
  };
}
