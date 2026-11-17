/**
 * The module's settings (spec P3.1): a zod 4 object, each field with its kind (module guide §8).
 *
 * Every field is `operational` or `secret`: the module owns no tables, so no setting changes what the database stores;
 * a setting changes only the files the module writes and serves, and an operator may change it at any restart (a new
 * `pathSplit` or `scheme` takes effect at the next snapshot; a snapshot built before keeps its own, which its manifest
 * states).
 */

import { z } from "zod";
import { DEFAULT_SCHEME, SCHEME_NAMES } from "../pir/scheme.ts";
import { DEFAULT_PATH_SPLIT, DEFAULT_QUERIES_PER_CALL } from "../shared/constants.ts";
import { MAX_PATH_SPLIT } from "./tree.ts";

/** The shortest admin secret accepted. */
export const MIN_ADMIN_SECRET = 16;

export const SETTINGS_SCHEMA = z.object({
  /** Where snapshots are written and loaded from; a relative path is taken from the process's working directory. */
  dataDir: z.string().min(1).meta({ kind: "operational" }),
  /** k: the tree is cut k levels above the leaves (FR-040). */
  pathSplit: z.number().int().min(0).max(MAX_PATH_SPLIT).default(DEFAULT_PATH_SPLIT).meta({ kind: "operational" }),
  /**
   * The PIR scheme of the next snapshot (00058 FR-001): `simplepir`, or `ipir-sp` where this build has it. A snapshot
   * built before keeps its own, which its manifest names; the admin route may name another for one build (FR-002).
   */
  scheme: z.enum(SCHEME_NAMES).default(DEFAULT_SCHEME).meta({ kind: "operational" }),
  /** Vectors in every query call (FR-065). */
  queriesPerCall: z.number().int().min(1).max(1024).default(DEFAULT_QUERIES_PER_CALL).meta({ kind: "operational" }),
  /** Build a snapshot at every height that is a multiple of this while following the node; 0: only on request. */
  snapshotEvery: z.number().int().min(0).default(0).meta({ kind: "operational" }),
  /** The secret the admin routes require (`Authorization: Bearer <secret>`); without one they answer 403. */
  adminSecret: z.string().min(MIN_ADMIN_SECRET).optional().meta({ kind: "secret" }),
  /**
   * Worker threads for the PIR scheme (SimplePIR: the multiplication of answers and setup data); 0: one fewer than the
   * CPUs, at most 8.
   */
  threads: z.number().int().min(0).max(256).default(0).meta({ kind: "operational" }),
});

export type Settings = z.infer<typeof SETTINGS_SCHEMA>;

/** The settings of the latest revision, parsed again (so defaults apply even to a hand-made revision). */
export function settingsOf(revisions: readonly { readonly settings: Readonly<Record<string, unknown>> }[]): Settings {
  const latest = revisions.at(-1);
  if (latest === undefined) throw new Error("the private-shielded-sync module has no configuration entry");
  return SETTINGS_SCHEMA.parse(latest.settings);
}
