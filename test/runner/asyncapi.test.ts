import { describe, expect, it } from "vitest";
import { z } from "zod";
import { bigintText } from "../../src/helpers/bigint-text.js";
import { defineTopic } from "../../src/modules/topic.js";
import { asyncApiDocument } from "../../src/runner/asyncapi.js";

/** The topics' AsyncAPI document (`src/runner/asyncapi.ts`). */

const BLOCKS = defineTopic("blocks", z.object({ height: bigintText(), kind: z.union([z.literal(1), z.literal(2)]) }), { description: "Each new block." });
const NAMES = defineTopic("names", z.array(z.string()));

// biome-ignore lint/suspicious/noExplicitAny: the document is read as plain JSON
const documentOf = (...topics: { module: string; topic: typeof BLOCKS | typeof NAMES }[]): any => JSON.parse(JSON.stringify(asyncApiDocument(topics)));

describe("asyncApiDocument", () => {
  it("describes each topic as its messages in a frame: its id, description and value as written", () => {
    const doc = documentOf({ module: "m", topic: BLOCKS }, { module: "n", topic: NAMES });
    const blocks = doc.components.schemas["m.blocks"];
    expect(blocks.description).toBe("Each new block.");
    expect(blocks.properties.topic).toEqual({ const: "m.blocks" });
    // Written as digits, never a number; a union of literals as its enum.
    expect(blocks.properties.value.properties.height).toMatchObject({ type: "string", format: "bigint" });
    expect(blocks.properties.value.properties.kind).toEqual({ type: "number", enum: [1, 2] });
    expect(doc.components.schemas["n.names"].description).toBeUndefined();
    const frame = doc.components.messages.height.payload;
    expect(frame.properties.messages.items.oneOf).toEqual([{ $ref: "#/components/schemas/m.blocks" }, { $ref: "#/components/schemas/n.names" }]);
  });

  it("lets subscribe and unsubscribe name the declared topics only", () => {
    const doc = documentOf({ module: "m", topic: BLOCKS });
    for (const name of ["subscribe", "unsubscribe", "subscribed", "unsubscribed"]) {
      expect([name, doc.components.messages[name].payload.properties.topics.items]).toEqual([name, { type: "string", enum: ["m.blocks"] }]);
    }
  });

  it("describes heights-only frames when no topic is declared", () => {
    const doc = documentOf();
    expect(doc.components.schemas).toEqual({});
    expect(doc.components.messages.height.payload.properties.messages).toEqual({ type: "array", maxItems: 0 });
    expect(doc.components.messages.subscribe.payload.properties.topics.maxItems).toBe(0);
  });

  it("points every operation and reply at messages of the one channel", () => {
    const doc = documentOf({ module: "m", topic: BLOCKS });
    const refs = JSON.stringify(doc.operations).match(/"#\/channels\/subscriptions\/messages\/([a-z]+)"/g) ?? [];
    const names = new Set(refs.map((ref) => ref.slice(ref.lastIndexOf("/") + 1, -1)));
    for (const name of names) expect(doc.channels.subscriptions.messages[name]).toEqual({ $ref: `#/components/messages/${name}` });
    expect([...names].sort()).toEqual(["error", "height", "subscribe", "subscribed", "unsubscribe", "unsubscribed"]);
  });
});
