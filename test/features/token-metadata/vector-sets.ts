/**
 * The two sets of MIP-0018 vectors the module is checked against: the MIP's reference vectors
 * (`test/fixtures/mip0018/vectors`), except the ids UmbraDB keeps its own versions of, and UmbraDB's own versions of
 * those ids (`test/fixtures/mip0018/vectors-umbradb`: vectors whose expectation differs under the pinned MIP-0018 text;
 * see its README), so each id runs exactly once, from UmbraDB's version when one exists.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const REFERENCE_VECTORS_DIR = join(HERE, "..", "..", "fixtures", "mip0018", "vectors");
export const UMBRADB_VECTORS_DIR = join(HERE, "..", "..", "fixtures", "mip0018", "vectors-umbradb");

interface ManifestEntry {
  id: string;
  normative: boolean;
}

function manifestIds(dir: string): ManifestEntry[] {
  const m = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8")) as { vectors: ManifestEntry[] };
  return m.vectors.map((v) => ({ id: v.id, normative: v.normative }));
}

/** The two selections: the reference ids minus UmbraDB's own ids, and UmbraDB's own ids. */
export function vectorSets(): { reference: ManifestEntry[]; overridden: string[]; umbradb: ManifestEntry[] } {
  const umbradb = manifestIds(UMBRADB_VECTORS_DIR);
  const own = new Set(umbradb.map((v) => v.id));
  const reference = manifestIds(REFERENCE_VECTORS_DIR);
  const missing = [...own].filter((id) => !reference.some((v) => v.id === id));
  if (missing.length > 0) throw new Error(`UmbraDB vectors without a reference counterpart: ${missing.join(", ")}`);
  return { reference: reference.filter((v) => !own.has(v.id)), overridden: [...own], umbradb };
}
