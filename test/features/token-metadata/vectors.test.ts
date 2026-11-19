/**
 * MIP-0018 vector conformance through UmbraDB's pure adapter (`vector-adapter.ts`): the reference implementation's
 * vector runner (`vector-runner/`) over its vectors (`test/fixtures/mip0018/vectors`), every one of them. The few
 * UmbraDB does not meet as written are named in `vector-sets.ts`, each with its reason, and held here to exactly that
 * difference.
 */
import { describe, expect, it } from "vitest";
import { verifySums } from "./vector-runner/common.js";
import { loadVectors, runVectors, type Json } from "./vector-runner/runner-core.js";
import { handleRequest } from "./vector-adapter.js";
import { GROUPED_BY_SERVED_SYMBOL, IMAGE_VECTORS, REFERENCE_VECTORS_DIR, STANDARD_KEY_VECTORS } from "./vector-sets.js";

const pure = async (req: Json): Promise<Json> => handleRequest(JSON.parse(JSON.stringify(req)));
const all = () => loadVectors({ dir: REFERENCE_VECTORS_DIR, informative: true });

describe("MIP-0018 vectors through the pure adapter", () => {
  it("the copy of the reference vectors matches its SHA256SUMS", () => {
    expect(verifySums(REFERENCE_VECTORS_DIR)).toEqual([]);
  });

  it("76 of 78 normative vectors pass (all but a standard's own key), and 48 of 49 informative ones (all but the grouping of symbols over 12 characters)", async () => {
    const report = await runVectors(all(), pure);
    expect(report.normative).toEqual({ passed: 76, total: 78 });
    expect(report.informative).toEqual({ passed: 48, total: 49 });
    const failed = new Map(report.results.filter((r) => !r.ok).map((r) => [r.id, r.failures]));
    expect([...failed.keys()].sort()).toEqual([GROUPED_BY_SERVED_SYMBOL, ...STANDARD_KEY_VECTORS].sort());
    // A standard's key: the one thing missing is the field `k`, which is not stored.
    for (const id of STANDARD_KEY_VECTORS) expect(failed.get(id), id).toEqual([expect.stringMatching(/: field 6b \(k\) missing$/)]);
    // Only its groups differ: one group under the served symbol where the vector has two under the stored ones.
    expect(failed.get(GROUPED_BY_SERVED_SYMBOL)!.every((f) => f.startsWith("group "))).toBe(true);
    // The only checks that did not run are the image vectors': UmbraDB displays no image.
    expect(Object.keys(report.notApplicable).sort()).toEqual([...IMAGE_VECTORS].sort());
    // Where kind 1 has no field left (S3c, S4b) or no symbol (S3d) there is no multi-member group: asserted on the
    // adapter's own answer, because these vectors carry no group expectation.
    const byId = new Map(all().map((v) => [v.entry.id, v]));
    for (const id of ["S3c", "S3d", "S4b"]) {
      const res = await pure({ id, op: "state", steps: byId.get(id)!.data.steps });
      expect(res.error, id).toBeUndefined();
      expect(((res.groups ?? []) as Json[]).filter((g) => Array.isArray(g.members) && (g.members as Json[]).length >= 2), id).toEqual([]);
    }
  }, 120_000);

  it("negative control: a consumer that reports no groups still passes the runner's normative vectors, but only with the group vectors marked not applicable", async () => {
    const noGroups = async (req: Json): Promise<Json> => {
      const res = handleRequest(JSON.parse(JSON.stringify(req)));
      delete res.groups;
      return res;
    };
    const report = await runVectors(all(), noGroups);
    expect(report.normative).toEqual({ passed: 76, total: 78 }); // the runner alone cannot see it …
    expect(Object.keys(report.notApplicable)).toEqual(expect.arrayContaining(["S9a", "S9b", "S9c", "S9d"])); // … the not-applicable guard does
  }, 120_000);

  it("adapter errors are answered per request, never by exiting", () => {
    expect(handleRequest({ id: "x", op: "nope" })).toEqual({ id: "x", error: "unknown op nope" });
    expect(handleRequest({ id: "y", op: "decode", type: "Misc", name_hex: "zz", payload_hex: "" })).toMatchObject({ id: "y", error: expect.any(String) });
    expect(handleRequest([1])).toMatchObject({ id: null, error: "request is not a JSON object" });
  });
});
