/**
 * MIP-0018 vector conformance through UmbraDB's pure adapter (`vector-adapter.ts`): the vector runner
 * (`vector-tools/`) over the MIP's reference vectors minus the ids UmbraDB keeps its own versions of, then over those
 * own versions (`mip0018/vectors-umbradb/`: the vectors whose expectation differs under the pinned MIP-0018 text).
 */
import { describe, expect, it } from "vitest";
import { verifySums } from "./vector-tools/common.js";
import { loadVectors, runVectors, type Json } from "./vector-tools/runner-core.js";
import { handleRequest } from "./vector-adapter.js";
import { REFERENCE_VECTORS_DIR, UMBRADB_VECTORS_DIR, vectorSets } from "./vector-sets.js";

const OWN_IDS = ["A3c"];
const pure = async (req: Json): Promise<Json> => handleRequest(JSON.parse(JSON.stringify(req)));

function failures(report: Awaited<ReturnType<typeof runVectors>>): string[] {
  return report.results.filter((r) => !r.ok).map((r) => `${r.id}: ${r.failures.join("; ")}`);
}

describe("MIP-0018 vectors through the pure adapter", () => {
  it("66/66 reference normative + 43/43 informative + UmbraDB's own A3c, with groups and display compared", async () => {
    const sets = vectorSets();
    expect(sets.overridden.sort()).toEqual([...OWN_IDS].sort());
    const reference = await runVectors(loadVectors({ dir: REFERENCE_VECTORS_DIR, only: sets.reference.map((v) => v.id) }), pure);
    expect(failures(reference)).toEqual([]);
    expect(reference.normative).toEqual({ passed: 66, total: 66 });
    expect(reference.informative).toEqual({ passed: 43, total: 43 });
    expect(reference.notApplicable).toEqual({}); // every group and display check ran
    const own = await runVectors(loadVectors({ dir: UMBRADB_VECTORS_DIR }), pure);
    expect(failures(own)).toEqual([]);
    expect(own.normative).toEqual({ passed: 1, total: 1 });
    expect(own.results.map((r) => r.id)).toEqual(OWN_IDS);
    // Where kind 1 has no field left (S3c, S4b) or no symbol (S3d) there is no multi-member group: asserted on the
    // adapter's own answer, because these vectors carry no group expectation.
    const byId = new Map(loadVectors({ dir: REFERENCE_VECTORS_DIR }).map((v) => [v.entry.id, v]));
    for (const id of ["S3c", "S3d", "S4b"]) {
      const res = await pure({ id, op: "state", steps: byId.get(id)!.data.steps });
      expect(res.error, id).toBeUndefined();
      expect(((res.groups ?? []) as Json[]).filter((g) => Array.isArray(g.members) && (g.members as Json[]).length >= 2), id).toEqual([]);
    }
  }, 120_000);

  it("negative control: a consumer that reports no groups still passes the runner, but only with S9a–S9d marked not applicable — which the adapter tests refuse", async () => {
    const noGroups = async (req: Json): Promise<Json> => {
      const res = handleRequest(JSON.parse(JSON.stringify(req)));
      delete res.groups;
      return res;
    };
    const report = await runVectors(loadVectors({ dir: REFERENCE_VECTORS_DIR, only: vectorSets().reference.map((v) => v.id) }), noGroups);
    expect(report.normative).toEqual({ passed: 66, total: 66 }); // the runner alone cannot see it …
    expect(Object.keys(report.notApplicable).sort()).toEqual(["S9a", "S9b", "S9c", "S9d"]); // … the not-applicable guard does
  }, 120_000);

  it("the reference A3c (a non-UTF-8 key accepted) fails under the UTF-8 key rule, and only on its result: its event is the own version's byte for byte", async () => {
    const report = await runVectors(loadVectors({ dir: REFERENCE_VECTORS_DIR, only: OWN_IDS }), pure);
    expect(report.results.map((r) => [r.id, r.ok])).toEqual([["A3c", false]]);
    expect(report.results[0]!.failures.join("; ")).toContain("result");
  }, 120_000);

  it("UmbraDB's own vectors match their SHA256SUMS; each keeps the reference vector's event and differs only in its expectation and description", () => {
    expect(verifySums(UMBRADB_VECTORS_DIR)).toEqual([]);
    const reference = new Map(loadVectors({ dir: REFERENCE_VECTORS_DIR, only: OWN_IDS }).map((v) => [v.entry.id, v]));
    for (const v of loadVectors({ dir: UMBRADB_VECTORS_DIR })) {
      const ref = reference.get(v.entry.id)!;
      expect(v.data.event, v.entry.id).toEqual(ref.data.event);
      expect(v.data.expect, v.entry.id).not.toEqual(ref.data.expect);
      const strip = (d: Json): Json => Object.fromEntries(Object.entries(d).filter(([k]) => !["mip", "description", "basis", "expect"].includes(k)));
      expect(strip(v.data), v.entry.id).toEqual(strip(ref.data));
    }
  });

  it("adapter errors are answered per request, never by exiting", () => {
    expect(handleRequest({ id: "x", op: "nope" })).toEqual({ id: "x", error: "unknown op nope" });
    expect(handleRequest({ id: "y", op: "decode", type: "Misc", name_hex: "zz", payload_hex: "" })).toMatchObject({ id: "y", error: expect.any(String) });
    expect(handleRequest([1])).toMatchObject({ id: null, error: "request is not a JSON object" });
  });
});
