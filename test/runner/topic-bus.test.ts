import { describe, expect, it } from "vitest";
import { z } from "zod";
import { bigintText } from "../../src/helpers/bigint-text.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { defineTopic, type TopicSink } from "../../src/modules/topic.js";
import { TopicBus, type TopicSubscriber } from "../../src/runner/topic-bus.js";

// The topic bus on its own: emits held per height until its commit, dropped on its rollback; one frame per committed
// height to each subscriber until it detaches, in order, empty ones too, never a height twice; emits refused at the call.

const ROWS = defineTopic("rows", z.object({ height: bigintText() }));
const NOTES = defineTopic("notes", z.string());
const A = { id: "a", topics: [ROWS, NOTES] } as unknown as ModuleDeclaration;
const B = { id: "b", topics: [defineTopic("rows", z.int())] } as unknown as ModuleDeclaration;
const HASH = Uint8Array.of(0xab);

/** A subscriber that keeps each frame, parsed. */
function subscriber(): TopicSubscriber & { readonly frames: unknown[] } {
  const frames: unknown[] = [];
  return { frames, deliver: (text) => frames.push(JSON.parse(text)) };
}

const frame = (height: number, messages: readonly unknown[]) => ({ type: "height", height: String(height), hash: "0xab", messages });

/** Runs `part`'s on-db-write at `height` as the loop does: `body` with a sink, reporting late emits to `late`. */
const write = (bus: TopicBus, part: ModuleDeclaration, height: bigint, body: (sink: TopicSink) => void, late: unknown[] = []) =>
  bus.collect(part, height, async (sink) => body(sink), (error) => late.push(error));

describe("the topic bus", () => {
  it("sends a height's messages once it commits, in on-db-write's order, each subscriber only its topics", async () => {
    const bus = new TopicBus([A, B], null);
    const all = subscriber();
    const notes = subscriber();
    bus.subscribe(all, ["a.rows", "a.notes", "b.rows"]);
    bus.subscribe(notes, ["a.notes"]);
    await write(bus, A, 1n, (sink) => {
      sink.emit(ROWS, { height: 1n });
      sink.emit(NOTES, "first");
    });
    await write(bus, B, 1n, (sink) => sink.emit(B.topics?.[0] as typeof ROWS, 7 as never));
    expect(all.frames).toEqual([]);
    bus.committed({ height: 1n, hash: HASH });
    expect(all.frames).toEqual([
      frame(1, [
        { topic: "a.rows", value: { height: "1" } },
        { topic: "a.notes", value: "first" },
        { topic: "b.rows", value: 7 },
      ]),
    ]);
    expect(notes.frames).toEqual([frame(1, [{ topic: "a.notes", value: "first" }])]);
    expect(bus.height).toBe(1n);
  });

  it("drops a rolled-back height's messages, and sends what its next attempt emitted", async () => {
    const bus = new TopicBus([A], 0n);
    const s = subscriber();
    bus.subscribe(s, ["a.notes"]);
    await write(bus, A, 1n, (sink) => sink.emit(NOTES, "attempt 1"));
    bus.rolledBack({ height: 1n, hash: HASH });
    await write(bus, A, 1n, (sink) => sink.emit(NOTES, "attempt 2"));
    bus.committed({ height: 1n, hash: HASH });
    expect(s.frames).toEqual([frame(1, [{ topic: "a.notes", value: "attempt 2" }])]);
  });

  it("sends empty frames to a heights-only subscriber; an unsubscribe that leaves no topic stops the frames", async () => {
    const bus = new TopicBus([A], 0n);
    const s = subscriber();
    const heights = subscriber();
    const emptied = subscriber();
    const never = subscriber();
    bus.subscribe(s, ["a.rows"]);
    expect(bus.subscribe(heights, [])).toEqual([]);
    bus.subscribe(emptied, ["a.rows", "a.notes"]);
    expect(bus.unsubscribe(emptied, ["a.notes"])).toEqual(["a.rows"]);
    expect(bus.unsubscribe(s, [])).toEqual(["a.rows"]);
    await write(bus, A, 1n, (sink) => sink.emit(NOTES, "not theirs"));
    bus.committed({ height: 1n, hash: HASH });
    expect(bus.unsubscribe(heights, [])).toEqual([]);
    expect(bus.unsubscribe(emptied, ["a.rows"])).toEqual([]);
    expect(bus.unsubscribe(never, [])).toEqual([]);
    bus.committed({ height: 2n, hash: HASH });
    expect(s.frames).toEqual([frame(1, []), frame(2, [])]);
    for (const one of [heights, emptied]) expect(one.frames).toEqual([frame(1, [])]);
    expect(never.frames).toEqual([]);
    expect(bus.subscriberCount).toBe(1);
  });

  it("sends no height twice: the cursor's re-delivery after a restart sends nothing", async () => {
    const restarted = new TopicBus([A], 5n);
    const s = subscriber();
    restarted.subscribe(s, ["a.rows"]);
    restarted.committed({ height: 5n, hash: HASH });
    restarted.committed({ height: 6n, hash: HASH });
    restarted.committed({ height: 6n, hash: HASH });
    expect(s.frames).toEqual([frame(6, [])]);
  });

  it("refuses an emit to an undeclared topic, or that the schema or JSON refuses, failing the callback even when caught", async () => {
    const bus = new TopicBus([A], 0n);
    const s = subscriber();
    bus.subscribe(s, ["a.rows", "a.notes"]);
    const caught = (emit: (sink: TopicSink) => void) =>
      write(bus, A, 1n, (sink) => {
        sink.emit(NOTES, "kept only if the callback succeeds");
        try {
          emit(sink);
        } catch {
          // The module catches it; the callback fails anyway.
        }
      });
    await expect(caught((sink) => sink.emit(B.topics?.[0] as typeof ROWS, { height: 1n }))).rejects.toThrow(
      "a emitted to the topic rows, which it does not declare in topics, at height 1",
    );
    await expect(caught((sink) => sink.emit(ROWS, { height: "x" } as never))).rejects.toThrow(/schema refuses at height 1: height/);
    await expect(caught((sink) => sink.emit(NOTES, 1 as never))).rejects.toThrow(/schema refuses/);
    bus.committed({ height: 1n, hash: HASH });
    expect(s.frames).toEqual([frame(1, [])]);
  });

  it("reports an emit from a sink kept past its callback, and sends nothing of it", async () => {
    const bus = new TopicBus([A], 0n);
    const s = subscriber();
    bus.subscribe(s, ["a.notes"]);
    const late: unknown[] = [];
    let kept: TopicSink | undefined;
    await write(bus, A, 1n, (sink) => void (kept = sink), late);
    expect(() => kept?.emit(NOTES, "late")).toThrow(/after its on-db-write callback at height 1 ended/);
    expect(late).toHaveLength(1);
    bus.committed({ height: 1n, hash: HASH });
    expect(s.frames).toEqual([frame(1, [])]);
  });

  it("knows only the topics of the parts it was given; a subscriber that throws does not stop the others", async () => {
    const bus = new TopicBus([A], 0n);
    expect([bus.has("a.rows"), bus.has("a.notes"), bus.has("b.rows"), bus.has("rows")]).toEqual([true, true, false, false]);
    const s = subscriber();
    bus.subscribe({ deliver: () => { throw new Error("carrier broke"); } }, ["a.rows"]);
    bus.subscribe(s, ["a.rows"]);
    expect(() => bus.committed({ height: 1n, hash: HASH })).not.toThrow();
    expect(s.frames).toEqual([frame(1, [])]);
  });
});
