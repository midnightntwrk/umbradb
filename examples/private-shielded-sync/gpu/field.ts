/**
 * Arithmetic in the BLS12-381 scalar field (Jubjub's base field and Poseidon's field) for WGSL, and the constant table
 * the scan shader reads.
 *
 * A field element is 20 limbs of 13 bits (260 bits), held in Montgomery form with R = 2^260, so a limb product is 26
 * bits and 40 of them sum inside a 32-bit word. Every operation returns a fully reduced value (below p), so equal
 * elements have equal limbs. Adapted from the experiments' `webgpu/shader.mjs`.
 *
 * The constants live in a storage buffer, not in module-level WGSL arrays: Deno's WebGPU raised an internal error on
 * module-level constant arrays in the experiments. Slot k of the table is 20 words at offset 20·k:
 *
 * | Slots | Content |
 * |---|---|
 * | 0–203 | Poseidon round constants, 68 rounds × 3, Montgomery form |
 * | 204–212 | Poseidon MDS matrix, row-major, Montgomery form |
 * | 213 | p, plain limbs |
 * | 214 | R² mod p (converts plain limbs into Montgomery form) |
 * | 215 | R mod p (one, Montgomery form) |
 * | 216 | 2, Montgomery form (Poseidon's capacity element) |
 * | 217 | Jubjub's d, Montgomery form |
 * | 218 | 2·d, Montgomery form |
 * | 219 | a generator of the 2^32-th roots of unity, Montgomery form (square roots) |
 * | 220 | 1, plain limbs (converts a Montgomery value out of Montgomery form) |
 * | 221–224 | the steps of raising to p − 2 (inversion), see `powerSteps` |
 * | 225–228 | the steps of raising to (t − 1) / 2, p − 1 = 2^32·t (square roots) |
 * | 229–523 | Poseidon's partial rounds 4–62 in sparse form, five elements a round, Montgomery form (`partialRounds`) |
 * | 524–582 | the one constant each of those rounds adds |
 * | 583–591 | the matrix of the last partial round (63), row-major |
 * | 592–594 | the three constants added after it |
 */

/** The BLS12-381 scalar field's modulus. */
export const P = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n;
/** Jubjub's d (−u² + v² = 1 + d·u²·v²). */
export const D = 0x2a9318e74bfa2b48f5fd9207e6bd7fd4292d7f6d37579d2601065fd6d6343eb1n;
/** Order of Jubjub's prime-order subgroup (the scalar field of the encryption keys). */
export const JUBJUB_R = 0x0e7db4ea6533afa906673b0101343b00a6682093ccc81082d0970e5ed6f72cb7n;

export const LIMBS = 20;
const LIMB_BITS = 13n;
const LIMB_MASK = (1n << LIMB_BITS) - 1n;
/** Slots of the constant table, 20 words each. */
export const CONSTANT_SLOTS = 595;

const mod = (a: bigint): bigint => ((a % P) + P) % P;

function pow(b: bigint, e: bigint): bigint {
  let r = 1n;
  b = mod(b);
  while (e > 0n) {
    if (e & 1n) r = (r * b) % P;
    b = (b * b) % P;
    e >>= 1n;
  }
  return r;
}

/** p − 1 = 2^32 · T. */
const T = (P - 1n) >> 32n;
/** g^T for the smallest quadratic non-residue g: a generator of the 2^32-th roots of unity. */
const ROOT = (() => {
  for (let g = 2n; ; g++) if (pow(g, (P - 1n) / 2n) === P - 1n) return pow(g, T);
})();
const R = mod(1n << 260n);
const toMont = (x: bigint): bigint => mod(x * R);

/** −p⁻¹ mod 2^13, the Montgomery reduction factor of one limb. */
const N0 = (() => {
  const m = 1n << LIMB_BITS;
  let inv = 1n;
  for (let i = 0; i < 13; i++) inv = (inv * (2n - (P % m) * inv)) % m;
  inv = ((inv % m) + m) % m;
  return Number((m - inv) % m);
})();

/** The 20 limbs of a value below 2^260. */
export function limbs(x: bigint): number[] {
  return Array.from({ length: LIMBS }, (_, i) => Number((x >> (LIMB_BITS * BigInt(i))) & LIMB_MASK));
}

/** The eight little-endian 32-bit words of a value below 2^256. */
export function words(x: bigint): number[] {
  return Array.from({ length: 8 }, (_, i) => Number((x >> (32n * BigInt(i))) & 0xffffffffn));
}

/** Poseidon's constants, as `test/fixtures/poseidon-constants.json` holds them (big-endian hex). */
export interface PoseidonConstants {
  /** 68 rounds × 3. */
  readonly roundConstants: readonly (readonly string[])[];
  /** 3 × 3, row-major. */
  readonly mds: readonly (readonly string[])[];
}

/** The constant table of the scan shader (see the module comment), 223 × 20 words. */
export function constantTable(poseidon: PoseidonConstants): Uint32Array {
  const rc = poseidon.roundConstants.flat();
  const mds = poseidon.mds.flat();
  if (poseidon.roundConstants.length !== 68 || rc.length !== 204) throw new Error("Poseidon needs 68 × 3 round constants");
  if (poseidon.mds.length !== 3 || mds.length !== 9) throw new Error("Poseidon needs a 3 × 3 MDS matrix");
  const values = [...rc, ...mds].map((h) => {
    const v = BigInt(`0x${h}`);
    if (v >= P) throw new Error("a Poseidon constant is not a canonical field element");
    return v;
  });
  const out = new Uint32Array(CONSTANT_SLOTS * LIMBS);
  values.forEach((v, k) => out.set(limbs(toMont(v)), k * LIMBS));
  const rcRows = Array.from({ length: 68 }, (_, r) => values.slice(3 * r, 3 * r + 3));
  const mdsRows = Array.from({ length: 3 }, (_, r) => values.slice(204 + 3 * r, 204 + 3 * r + 3));
  const rounds = partialRounds(rcRows, mdsRows);
  // The sparse form must give the plain permutation's output: checked here on a few inputs, every time.
  for (const [a, b] of [[0n, 0n], [1n, 2n], [P - 1n, P - 2n], [mod(R * 7n + 11n), mod(ROOT + 5n)]] as const) {
    if (poseidonSparse(rcRows, mdsRows, rounds, a, b) !== poseidonPlain(rcRows, mdsRows, a, b)) {
      throw new Error("Poseidon's sparse partial rounds do not match the plain permutation");
    }
  }
  const put = (slot: number, v: bigint): void => out.set(limbs(toMont(v)), slot * LIMBS);
  rounds.sparse.forEach((m, j) => m.forEach((v, k) => put(SLOT.SPARSE + 5 * j + k, v)));
  rounds.constant.forEach((v, j) => put(SLOT.PARTIAL_CONSTANT + j, v));
  rounds.last.flat().forEach((v, k) => put(SLOT.LAST_PARTIAL + k, v));
  rounds.after.forEach((v, k) => put(SLOT.AFTER_PARTIAL + k, v));
  const extra = [
    limbs(P),
    limbs(mod(R * R)),
    limbs(R),
    limbs(toMont(2n)),
    limbs(toMont(D)),
    limbs(toMont(2n * D)),
    limbs(toMont(ROOT)),
    limbs(1n),
  ];
  extra.forEach((v, k) => out.set(v, (213 + k) * LIMBS));
  out.set(powerSteps(P - 2n), SLOT.STEPS_INV * LIMBS);
  out.set(powerSteps((T - 1n) / 2n), SLOT.STEPS_SQRT * LIMBS);
  return out;
}

/** Slot numbers of the constant table, for the shader. */
export const SLOT = {
  MDS: 204,
  P: 213,
  R2: 214,
  ONE: 215,
  TWO: 216,
  D: 217,
  D2: 218,
  ROOT: 219,
  PLAIN_ONE: 220,
  STEPS_INV: 221,
  STEPS_SQRT: 225,
  SPARSE: 229,
  PARTIAL_CONSTANT: 524,
  LAST_PARTIAL: 583,
  AFTER_PARTIAL: 592,
} as const;

type Vec = bigint[];
type Mat = bigint[][];
const matVec = (m: Mat, v: Vec): Vec => m.map((row) => mod(row.reduce((sum, a, i) => sum + a * v[i]!, 0n)));
const matMat = (a: Mat, b: Mat): Mat => a.map((row) => b[0]!.map((_, j) => mod(row.reduce((sum, x, k) => sum + x * b[k]![j]!, 0n))));
const pow5 = (x: bigint): bigint => mod(x * x * x * x * x);

/** Poseidon's permutation as the ledger defines it (state [a, b, 2], element 0 out): the reference for the check below. */
function poseidonPlain(rc: Mat, mds: Mat, a: bigint, b: bigint): bigint {
  let s = [a, b, 2n].map((x, i) => mod(x + rc[0]![i]!));
  for (let r = 0; r < 68; r++) {
    s = r < 4 || r >= 64 ? s.map(pow5) : [s[0]!, s[1]!, pow5(s[2]!)];
    s = matVec(mds, s);
    if (r < 67) s = s.map((x, i) => mod(x + rc[r + 1]![i]!));
  }
  return s[0]!;
}

/**
 * The 60 partial rounds (4–63) in a form that costs five products a round instead of nine. A partial round raises
 * only element 2 to the fifth power, then multiplies the state by the MDS matrix and adds three constants.
 *
 * - Constants. A constant on element 0 or 1 passes through the next round's power unchanged, so it can be carried to
 *   the following round through the matrix. Carried forward from round 4, rounds 4–62 each add one constant, to
 *   element 2 (`constant`), and round 63 adds a full vector (`after`).
 * - Matrices. A matrix L factors as D·S: D mixes elements 0 and 1 only (L's upper-left 2 × 2 block) and S is the
 *   identity except for its last row and last column (`sparse`: row 2 of L, then that block's inverse times L's
 *   last column). D commutes with the next round's power and its constant, so it joins that round's matrix: round
 *   j's matrix is MDS·D of round j − 1, factored again. Round 63 keeps its whole matrix (`last`).
 */
function partialRounds(rc: Mat, mds: Mat): { sparse: Vec[]; constant: Vec; last: Mat; after: Vec } {
  let carried: Vec = [0n, 0n, 0n];
  const constant: Vec = [];
  for (let r = 4; r <= 62; r++) {
    const v = matVec(mds, carried).map((x, i) => mod(x + rc[r + 1]![i]!));
    constant.push(v[2]!);
    carried = [v[0]!, v[1]!, 0n];
  }
  const after = matVec(mds, carried).map((x, i) => mod(x + rc[64]![i]!));
  let d: Mat = [[1n, 0n, 0n], [0n, 1n, 0n], [0n, 0n, 1n]];
  const sparse: Vec[] = [];
  for (let r = 4; r <= 62; r++) {
    const l = matMat(mds, d);
    const [l0, l1, l2] = [l[0]!, l[1]!, l[2]!];
    const det = mod(l0[0]! * l1[1]! - l0[1]! * l1[0]!);
    if (det === 0n) throw new Error("Poseidon's partial rounds do not factor (a singular block)");
    const inv = pow(det, P - 2n);
    const b0 = mod((l1[1]! * l0[2]! - l0[1]! * l1[2]!) * inv);
    const b1 = mod((l0[0]! * l1[2]! - l1[0]! * l0[2]!) * inv);
    sparse.push([l2[0]!, l2[1]!, l2[2]!, b0, b1]);
    d = [[l0[0]!, l0[1]!, 0n], [l1[0]!, l1[1]!, 0n], [0n, 0n, 1n]];
  }
  return { sparse, constant, last: matMat(mds, d), after };
}

/** Poseidon with the partial rounds as `partialRounds` gives them: what the shader computes. */
function poseidonSparse(rc: Mat, mds: Mat, rounds: ReturnType<typeof partialRounds>, a: bigint, b: bigint): bigint {
  let s = [a, b, 2n].map((x, i) => mod(x + rc[0]![i]!));
  for (let r = 0; r < 4; r++) s = matVec(mds, s.map(pow5)).map((x, i) => mod(x + rc[r + 1]![i]!));
  rounds.sparse.forEach((m, j) => {
    const x = pow5(s[2]!);
    s = [mod(s[0]! + m[3]! * x), mod(s[1]! + m[4]! * x), mod(m[0]! * s[0]! + m[1]! * s[1]! + m[2]! * x + rounds.constant[j]!)];
  });
  s = matVec(rounds.last, [s[0]!, s[1]!, pow5(s[2]!)]).map((x, i) => mod(x + rounds.after[i]!));
  for (let r = 64; r < 68; r++) {
    s = matVec(mds, s.map(pow5));
    if (r < 67) s = s.map((x, i) => mod(x + rc[r + 1]![i]!));
  }
  return s[0]!;
}

/**
 * Raising to a fixed exponent with a table of the odd powers a, a^3, …, a^15: the exponent's bits from the top, cut
 * into windows of at most four bits that begin and end with a 1. The first word is the number of steps. A step is
 * (squarings << 8) | table index: square that many times, then multiply by that table entry (index 255: no
 * multiplication, for an exponent's low zero bits). The first step only takes its table entry. For p − 2 that is 254
 * squarings and 53 products after the table's 8, against 162 products bit by bit.
 */
export function powerSteps(e: bigint): number[] {
  const bit = (i: number): boolean => ((e >> BigInt(i)) & 1n) === 1n;
  const steps: number[] = [];
  let squarings = 0;
  let i = e.toString(2).length - 1;
  while (i >= 0) {
    if (!bit(i)) {
      squarings += 1;
      i -= 1;
      continue;
    }
    let j = Math.max(i - 3, 0);
    while (!bit(j)) j += 1;
    const window = Number((e >> BigInt(j)) & ((1n << BigInt(i - j + 1)) - 1n));
    steps.push(steps.length === 0 ? (window - 1) / 2 : ((squarings + i - j + 1) << 8) | ((window - 1) / 2));
    squarings = 0;
    i = j - 1;
  }
  if (squarings > 0) steps.push((squarings << 8) | 255);
  if (steps.length + 1 > 4 * LIMBS) throw new Error("the exponent's steps do not fit their four slots");
  return [steps.length, ...steps];
}

const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

/**
 * `fadd`, `fsub`, `fneg`, `mmul` and `msqr` as straight-line WGSL, with p's limbs as literals: no loops and no
 * indexed temporaries, so the GPU compiler keeps every limb in a register. (The same functions written with loops ran
 * about six times slower under Deno's WebGPU on Apple silicon: 42 against 7 µs per scan entry.)
 *
 * `mmul` and `msqr` carry nothing from limb to limb until the end: a limb is a 32-bit sum of at most 20 rows of two
 * 26-bit products, 2·20·(2^13 − 1)² + carries = 2.69e9, below 2^32. Without the carry after every step the steps of
 * a row do not wait for one another, which is where the time went: 4,000 products of 1,024 elements took 36 ms with
 * the carries and 5 ms without (Apple M4 Max), and a square, which forms each pair of limbs once, a quarter less than
 * a product at 32,768 elements.
 */
function unrolledArithmetic(): string {
  const p = limbs(P);
  // 2^260 − p: adding it to a value below 2p carries out of the top limb exactly when the value is at least p, and
  // the low 260 bits are then the value − p.
  const q = limbs((1n << 260n) - P);
  if (N0 !== 8191 || p[0] !== 1) throw new Error("the reduction rows are written for p = 1 mod 2^13");
  const out: string[] = [];
  // m·p[j] as WGSL, or nothing for a zero limb of p.
  const mp = (j: number): string => (p[j] === 0 ? "" : p[j] === 1 ? " + m" : ` + m * ${p[j]}u`);
  // In `fadd`, `fsub` and the end of a product, the reduced and the unreduced result are carried side by side and one
  // is chosen at the end, so the two carry chains do not follow one another.
  out.push("fn fadd(a: Fe, b: Fe) -> Fe {", "  var x = a;", "  var y = b;", "  var r: Fe;", "  var s: Fe;");
  out.push("  var c = 0u;", "  var e = 0u;", "  var v = 0u;", "  var w = 0u;");
  for (const j of range(LIMBS)) {
    out.push(`  v = x[${j}] + y[${j}]; w = v + ${q[j]}u + e; v = v + c; r[${j}] = v & M; c = v >> 13u; s[${j}] = w & M; e = w >> 13u;`);
  }
  out.push("  if (e != 0u) { return s; }", "  return r;", "}");
  out.push("fn fsub(a: Fe, b: Fe) -> Fe {", "  var x = a;", "  var y = b;", "  var r: Fe;", "  var s: Fe;");
  out.push("  var c: i32 = 0i;", "  var e: i32 = 0i;", "  var v: i32 = 0i;", "  var w: i32 = 0i;");
  for (const j of range(LIMBS)) {
    out.push(`  v = i32(x[${j}]) - i32(y[${j}]); w = v + ${p[j]}i + e; v = v + c; r[${j}] = u32(v) & M; c = v >> 13u; s[${j}] = u32(w) & M; e = w >> 13u;`);
  }
  out.push("  if (c < 0i) { return s; }", "  return r;", "}");
  out.push("fn fneg(a: Fe) -> Fe { var z: Fe; return fsub(z, a); }");
  // The limbs `name(j)` (unnormalized, value below 2p) with their carries propagated and reduced below p.
  const reduced = (name: (j: number) => string): string[] => [
    "  var c = 0u;",
    "  var e = 0u;",
    "  var v = 0u;",
    "  var w = 0u;",
    "  var r: Fe;",
    "  var s: Fe;",
    ...range(LIMBS).map((j) => `  w = ${name(j)} + ${q[j]}u + e; v = ${name(j)} + c; r[${j}] = v & M; c = v >> 13u; s[${j}] = w & M; e = w >> 13u;`),
    "  if (e != 0u) { return s; }",
    "  return r;",
  ];
  // Montgomery product a·b·R⁻¹ (CIOS): row i adds a[i]·b and m·p, m chosen so that limb 0 becomes a multiple of
  // 2^13 (m = −limb 0 mod 2^13, as p = 1 mod 2^13), and shifts one limb down; limb 0's carry goes into limb 1.
  out.push("fn mmul(a: Fe, b: Fe) -> Fe {", "  var x = a;", "  var y = b;");
  for (const j of range(LIMBS)) out.push(`  let b${j} = y[${j}];`);
  for (const j of range(LIMBS)) out.push(`  var t${j} = 0u;`);
  out.push("  var ai = 0u;", "  var u = 0u;", "  var m = 0u;");
  for (const i of range(LIMBS)) {
    out.push(`  ai = x[${i}]; u = t0 + ai * b0; m = (0u - u) & M;`);
    out.push(`  t0 = t1 + ai * b1${mp(1)} + ((u + m) >> 13u);`);
    for (const j of range(LIMBS).slice(2)) out.push(`  t${j - 1} = t${j} + ai * b${j}${mp(j)};`);
    out.push(`  t${LIMBS - 1} = 0u;`);
  }
  out.push(...reduced((j) => `t${j}`), "}");
  // Montgomery square a·a·R⁻¹: the 39 column sums of a·a (each pair of limbs once, doubled), then the 20 reduction
  // rows over them.
  out.push("fn msqr(a: Fe) -> Fe {", "  var x = a;");
  for (const j of range(LIMBS)) out.push(`  let a${j} = x[${j}];`);
  for (const k of range(2 * LIMBS - 1)) {
    const pairs: string[] = [];
    for (let i = Math.max(0, k - LIMBS + 1); 2 * i < k; i++) pairs.push(`a${i} * a${k - i}`);
    const terms = [pairs.length > 0 ? `2u * (${pairs.join(" + ")})` : "", k % 2 === 0 ? `a${k / 2} * a${k / 2}` : ""];
    out.push(`  var t${k} = ${terms.filter((e) => e !== "").join(" + ")};`);
  }
  out.push(`  var t${2 * LIMBS - 1} = 0u;`, "  var m = 0u;");
  for (const i of range(LIMBS)) {
    out.push(`  m = (0u - t${i}) & M;`);
    out.push(`  t${i + 1} += ((t${i} + m) >> 13u)${mp(1)};`);
    for (const j of range(LIMBS).slice(2)) if (mp(j) !== "") out.push(`  t${i + j} +=${mp(j).slice(2)};`);
  }
  out.push(...reduced((j) => `t${LIMBS + j}`), "}");
  return out.join("\n");
}

/**
 * WGSL: the field type `Fe`, the constant buffer `consts` (binding given by the caller), and `fadd`, `fsub`, `fneg`,
 * `mmul` (Montgomery product), `msqr` (Montgomery square), `fpow` (inversion or the square-root exponent), `fsqrt_ratio` (a square root of a quotient by
 * Tonelli–Shanks; the caller checks the result), `feq`, `is_zero`, `cld` (a constant slot), `to_mont`, `from_mont`, and the
 * conversions between limbs and eight 32-bit words.
 */
export function fieldWgsl(constsBinding: number): string {
  return /* wgsl */ `
alias Fe = array<u32, 20>;
const M: u32 = 8191u;
const N0: u32 = ${N0}u;
const C_P: u32 = ${SLOT.P * LIMBS}u;
const C_ONE: u32 = ${SLOT.ONE * LIMBS}u;
const C_STEPS_INV: u32 = ${SLOT.STEPS_INV * LIMBS}u;
const C_STEPS_SQRT: u32 = ${SLOT.STEPS_SQRT * LIMBS}u;
@group(0) @binding(${constsBinding}) var<storage, read> consts: array<u32>;

fn cld(k: u32) -> Fe {
  var r: Fe;
  let b = k * 20u;
  for (var i = 0u; i < 20u; i++) { r[i] = consts[b + i]; }
  return r;
}
// a >= p, for a below 2^260.
fn geq_p(a: Fe) -> bool {
  var x = a;
  for (var i = 19i; i >= 0i; i--) {
    let pv = consts[C_P + u32(i)];
    if (x[i] > pv) { return true; }
    if (x[i] < pv) { return false; }
  }
  return true;
}
${unrolledArithmetic()}
fn feq(a: Fe, b: Fe) -> bool {
  var x = a;
  var y = b;
  for (var i = 0u; i < 20u; i++) { if (x[i] != y[i]) { return false; } }
  return true;
}
fn is_zero(a: Fe) -> bool {
  var x = a;
  for (var i = 0u; i < 20u; i++) { if (x[i] != 0u) { return false; } }
  return true;
}
fn is_one(a: Fe) -> bool {
  var x = a;
  for (var i = 0u; i < 20u; i++) { if (x[i] != consts[C_ONE + i]) { return false; } }
  return true;
}
// which: 0 = p − 2 (inversion), 1 = (t − 1) / 2 (square root). The steps are the constant table's (powerSteps).
fn fpow(a: Fe, which: u32) -> Fe {
  var tbl: array<Fe, 8>;
  let a2 = msqr(a);
  tbl[0] = a;
  for (var i = 1u; i < 8u; i++) { tbl[i] = mmul(tbl[i - 1u], a2); }
  var base = C_STEPS_INV;
  if (which == 1u) { base = C_STEPS_SQRT; }
  let steps = consts[base];
  var r = tbl[consts[base + 1u] & 255u];
  for (var i = 1u; i < steps; i++) {
    let step = consts[base + 1u + i];
    let squarings = step >> 8u;
    for (var k = 0u; k < squarings; k++) { r = msqr(r); }
    let entry = step & 255u;
    if (entry != 255u) { r = mmul(r, tbl[entry]); }
  }
  return r;
}
// A square root of num / den by Tonelli–Shanks, without the division. With y = num · den^(2^32 − 1), y^t is
// (num / den)^t, and y^((t − 1) / 2) · num · den^(2^31 − 1) is (num / den)^((t + 1) / 2) up to its sign, which the
// caller fixes anyway. For a non-residue the result is some value x with x² · den different from num; the caller
// checks.
fn fsqrt_ratio(num: Fe, den: Fe) -> Fe {
  // den^(2^31 − 1), then den^(2^32 − 1) from one more turn.
  var d1 = den;
  var d2 = den;
  for (var k = 0u; k < 31u; k++) { d1 = d2; d2 = mmul(msqr(d2), den); }
  let y = mmul(num, d2);
  let w = fpow(y, 1u);
  var x = mmul(mmul(w, num), d1);
  var b = mmul(y, msqr(w));
  var z = cld(${SLOT.ROOT}u);
  var m = 32u;
  for (var it = 0u; it < 33u; it++) {
    if (is_one(b)) { break; }
    var i = 0u;
    var t = b;
    for (var q = 0u; q < 32u; q++) { if (is_one(t)) { break; } t = msqr(t); i++; }
    if (i >= m) { break; }
    var c = z;
    let cnt = m - i - 1u;
    for (var j = 0u; j < cnt; j++) { c = msqr(c); }
    x = mmul(x, c);
    z = msqr(c);
    b = mmul(b, z);
    m = i;
  }
  return x;
}
fn to_mont(a: Fe) -> Fe { return mmul(a, cld(${SLOT.R2}u)); }
fn from_mont(a: Fe) -> Fe { return mmul(a, cld(${SLOT.PLAIN_ONE}u)); }
// Plain limbs of eight little-endian words (a value below 2^256).
fn limbs_of(w: array<u32, 8>) -> Fe {
  var x = w;
  var r: Fe;
  for (var i = 0u; i < 20u; i++) {
    let pos = i * 13u;
    let wi = pos >> 5u;
    let sh = pos & 31u;
    var v = x[wi] >> sh;
    if (sh > 19u && wi < 7u) { v = v | (x[wi + 1u] << (32u - sh)); }
    r[i] = v & M;
  }
  return r;
}
// Eight little-endian words of plain limbs (a value below 2^256).
fn words_of(a: Fe) -> array<u32, 8> {
  var x = a;
  var w: array<u32, 8>;
  for (var i = 0u; i < 20u; i++) {
    let pos = i * 13u;
    let wi = pos >> 5u;
    let sh = pos & 31u;
    w[wi] = w[wi] | (x[i] << sh);
    if (sh > 19u && wi < 7u) { w[wi + 1u] = w[wi + 1u] | (x[i] >> (32u - sh)); }
  }
  return w;
}
`;
}
