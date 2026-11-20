/**
 * The MIP-0018 vectors the module is checked against: the reference implementation's
 * (`test/fixtures/mip0018/vectors`, a copy of `vectors/` of midnight-experiments/mip-0018 at 3252703), and the few of
 * them whose expectation UmbraDB does not meet, each with its reason.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const REFERENCE_VECTORS_DIR = join(HERE, "..", "..", "fixtures", "mip0018", "vectors");

/**
 * Vectors about displaying an image's content (MIP "Common fields", S12): UmbraDB serves the URI and the hash a
 * contract published and fetches nothing, so it displays no image and the check does not apply to it.
 */
export const IMAGE_VECTORS: readonly string[] = Object.freeze(["INF-IMG-1", "INF-IMG-2", "S12a"]);

/**
 * The informative vector UmbraDB answers differently on purpose. `INF-LEN-3` groups by the symbol as stored, so two
 * symbols over 12 characters that share their first 12 are two groups. UmbraDB reads "consumers SHOULD discard any
 * extra characters" as: only the first 12 characters are the symbol, so both are one group.
 */
export const GROUPED_BY_SERVED_SYMBOL = "INF-LEN-3";

/**
 * The normative vectors about a key a standard defines (MIP "Keys", Testing S10). Each loads a test standard,
 * `test-s10`, that defines a key `k`, and expects `k` served while the token declares the standard, also when `k` was
 * sent before the declaration. No MIP defines such a key, and `token-metadata` keeps only the keys MIP-0018 defines,
 * so a record for `k` is not stored and cannot be served later. S10a, S10b and S10d, where `k` is not served, pass.
 */
export const STANDARD_KEY_VECTORS: readonly string[] = Object.freeze(["S10c", "S10e"]);
