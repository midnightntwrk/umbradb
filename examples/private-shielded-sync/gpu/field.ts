/**
 * Arithmetic in the BLS12-381 scalar field (Jubjub's base field and Poseidon's field) for WGSL, and the constant table
 * the scan shader reads.
 *
 * A field element is 20 limbs of 13 bits (260 bits), held in Montgomery form with R = 2^260, so a limb product plus
 * carries fits a 32-bit word. Every operation returns a fully reduced value (below p), so equal elements have equal
 * limbs. Adapted from the experiments' `webgpu/shader.mjs`.
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
 * | 221 | p − 2 as eight 32-bit words (the inversion exponent) |
 * | 222 | (t − 1) / 2 as eight 32-bit words, p − 1 = 2^32·t (the square-root exponent) |
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
/** Words of the constant table: 223 slots of 20 words. */
export const CONSTANT_SLOTS = 223;

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
  const extra = [
    limbs(P),
    limbs(mod(R * R)),
    limbs(R),
    limbs(toMont(2n)),
    limbs(toMont(D)),
    limbs(toMont(2n * D)),
    limbs(toMont(ROOT)),
    limbs(1n),
    words(P - 2n),
    words((T - 1n) / 2n),
  ];
  extra.forEach((v, k) => out.set(v, (213 + k) * LIMBS));
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
  EXP_INV: 221,
  EXP_SQRT: 222,
} as const;

const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

/**
 * `csub`, `fadd`, `fsub`, `fneg` and `mmul` as straight-line WGSL, with p's limbs as literals: no loops and no indexed
 * temporaries, so the GPU compiler keeps every limb in a register. (The same functions written with loops ran about
 * six times slower under Deno's WebGPU on Apple silicon: 42 against 7 µs per scan entry.)
 */
function unrolledArithmetic(): string {
  const p = limbs(P);
  const out: string[] = [];
  // a − p when a ≥ p (the final borrow is 0), else a; for a below 2p.
  out.push("fn csub(a: Fe) -> Fe {", "  var x = a;", "  var r: Fe;", "  var c: i32 = 0i;", "  var v: i32 = 0i;");
  for (const j of range(LIMBS)) out.push(`  v = i32(x[${j}]) - ${p[j]}i + c; r[${j}] = u32(v) & M; c = v >> 13u;`);
  out.push("  if (c < 0i) { return a; }", "  return r;", "}");
  out.push("fn fadd(a: Fe, b: Fe) -> Fe {", "  var x = a;", "  var y = b;", "  var r: Fe;", "  var c = 0u;", "  var v = 0u;");
  for (const j of range(LIMBS)) out.push(`  v = x[${j}] + y[${j}] + c; r[${j}] = v & M; c = v >> 13u;`);
  out.push("  return csub(r);", "}");
  out.push("fn fsub(a: Fe, b: Fe) -> Fe {", "  var x = a;", "  var y = b;", "  var r: Fe;", "  var c: i32 = 0i;", "  var v: i32 = 0i;");
  for (const j of range(LIMBS)) out.push(`  v = i32(x[${j}]) + ${p[j]}i - i32(y[${j}]) + c; r[${j}] = u32(v) & M; c = v >> 13u;`);
  out.push("  return csub(r);", "}");
  out.push("fn fneg(a: Fe) -> Fe { var z: Fe; return fsub(z, a); }");
  // Montgomery product a·b·R⁻¹ (CIOS): one reduction step per limb of a.
  out.push("fn mmul(a: Fe, b: Fe) -> Fe {", "  var x = a;", "  var y = b;");
  for (const j of range(LIMBS)) out.push(`  let b${j} = y[${j}];`);
  for (const j of range(LIMBS + 1)) out.push(`  var t${j} = 0u;`);
  out.push("  var ai = 0u;", "  var x0 = 0u;", "  var m = 0u;", "  var c = 0u;", "  var v = 0u;");
  for (const i of range(LIMBS)) {
    out.push(`  ai = x[${i}]; x0 = t0 + ai * b0; m = (x0 * N0) & M; c = (x0 + m * ${p[0]}u) >> 13u;`);
    for (const j of range(LIMBS).slice(1)) out.push(`  v = t${j} + ai * b${j} + m * ${p[j]}u + c; t${j - 1} = v & M; c = v >> 13u;`);
    out.push("  v = t20 + c; t19 = v & M; t20 = v >> 13u;");
  }
  out.push(`  return csub(Fe(${range(LIMBS).map((j) => `t${j}`).join(", ")}));`, "}");
  return out.join("\n");
}

/**
 * WGSL: the field type `Fe`, the constant buffer `consts` (binding given by the caller), and `fadd`, `fsub`, `fneg`,
 * `mmul` (Montgomery product), `fpow` (inversion or the square-root exponent), `fsqrt` (Tonelli–Shanks; the caller
 * checks the result by squaring), `feq`, `is_zero`, `cld` (a constant slot), `to_mont`, `from_mont`, and the
 * conversions between limbs and eight 32-bit words.
 */
export function fieldWgsl(constsBinding: number): string {
  return /* wgsl */ `
alias Fe = array<u32, 20>;
const M: u32 = 8191u;
const N0: u32 = ${N0}u;
const C_P: u32 = ${SLOT.P * LIMBS}u;
const C_ONE: u32 = ${SLOT.ONE * LIMBS}u;
const C_EINV: u32 = ${SLOT.EXP_INV * LIMBS}u;
const C_ETS: u32 = ${SLOT.EXP_SQRT * LIMBS}u;
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
// which: 0 = p − 2 (inversion), 1 = (t − 1) / 2 (square root).
fn fpow(a: Fe, which: u32) -> Fe {
  var r = cld(${SLOT.ONE}u);
  var started = false;
  for (var i = 254i; i >= 0i; i--) {
    let wi = u32(i) >> 5u;
    var w = consts[C_EINV + wi];
    if (which == 1u) { w = consts[C_ETS + wi]; }
    if (started) { r = mmul(r, r); }
    if (((w >> (u32(i) & 31u)) & 1u) == 1u) {
      if (started) { r = mmul(r, a); } else { r = a; started = true; }
    }
  }
  return r;
}
// Tonelli–Shanks. For a non-residue the result is some value whose square differs from a.
fn fsqrt(a: Fe) -> Fe {
  let w = fpow(a, 1u);
  var x = mmul(a, w);
  var b = mmul(x, w);
  var z = cld(${SLOT.ROOT}u);
  var m = 32u;
  for (var it = 0u; it < 33u; it++) {
    if (is_one(b)) { break; }
    var i = 0u;
    var t = b;
    for (var q = 0u; q < 32u; q++) { if (is_one(t)) { break; } t = mmul(t, t); i++; }
    if (i >= m) { break; }
    var c = z;
    let cnt = m - i - 1u;
    for (var j = 0u; j < cnt; j++) { c = mmul(c, c); }
    x = mmul(x, c);
    z = mmul(c, c);
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
