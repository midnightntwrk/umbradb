/**
 * WGSL of the ownership test (spec §2.1, FR-100, FR-103), entry by entry, as the CPU kernel computes it
 * (`kernel/src/lib.rs`, `entry_value` and `entry_matches`):
 *
 * 1. `decompress`: an entry of 36 zero bytes is skipped (no ciphertext). Otherwise the point's 32 bytes are decoded as
 *    `JubjubAffine::from_bytes` decodes them: v (255 bits, little-endian) must be below p; u² = (v² − 1)/(1 + d·v²)
 *    must be a square; u takes the sign bit's parity; u = 0 with the sign bit set is refused (ZIP 216). No subgroup
 *    check. A refused point gives the value zero and never matches, as on the CPU. The square root is taken of the
 *    quotient without dividing (`fsqrt_ratio`, `field.ts`), and checked as u²·(1 + d·v²) = v² − 1.
 *    It also stores the point's table for the ladder: P, 3P, 5P and 7P, each as (Y − X, Y + X, 2d·T, 2Z).
 * 2. `ladder` (several dispatches): k* = point × scalar with the complete twisted Edwards formulas (a = −1). The
 *    scalar is the same for every entry, so the host recodes it once into signed digits (width-4 non-adjacent form:
 *    0 or ±1, ±3, ±5, ±7, at most one digit in five not zero, `scan.ts`) and every entry runs the same steps: a
 *    doubling per digit, and for a digit that is not zero an addition of the table's point (its negative for a
 *    negative digit). A doubling computes T only when an addition follows, and an addition never does.
 * 3. `finish`: k* to affine, k = Poseidon(k*.u, k*.v), value = Poseidon(k, 0); writes the value's eight words and a
 *    candidate flag (the value's low 4 bytes equal the entry's 4 bytes).
 * 4. `torsion` (only over the candidates, after `decompress` and `ladder` with the scalar r): the ledger's own point
 *    check, which the CPU applies before a match counts (FR-103): the point is not the identity and r·point is the
 *    identity (`JubjubSubgroup::from_bytes`).
 *
 * Adapted from the experiments' `webgpu/shader.mjs`, with the decoding checks added.
 */

import { fieldWgsl, SLOT } from "./field.ts";

/** 32-bit words of one scan entry (36 bytes). */
export const ENTRY_WORDS = 9;
/** Digits of a recoded scalar (a scalar below 2^252 gives at most 253). */
export const DIGITS = 253;
/** Words of one entry's working state: the table (four points of four field elements), X, Y, Z, and the flags. */
export const STATE_WORDS = 381;
const TABLE_POINT = 80;
const X_AT = 320;
const Y_AT = 340;
const Z_AT = 360;
const FLAGS_AT = 380;
/** Words of one entry's output: the value's eight words, then the flag. */
export const OUT_WORDS = 9;
/** Bytes of the shader's parameters (uniform): 256 digits, then the pass's first digit, its count, and the entry count. */
export const PARAMS_BYTES = 1040;

export function scanWgsl(): string {
  return /* wgsl */ `
struct Params { digits: array<vec4<i32>, 64>, top: u32, count: u32, n: u32, pad: u32 }
@group(0) @binding(0) var<storage, read> entries: array<u32>;
@group(0) @binding(1) var<storage, read_write> state: array<u32>;
@group(0) @binding(2) var<storage, read_write> outb: array<u32>;
@group(0) @binding(4) var<uniform> params: Params;
${fieldWgsl(3)}
const FLAG_VALID: u32 = 1u;
const FLAG_IDENTITY: u32 = 2u;

fn ld(base: u32) -> Fe { var r: Fe; for (var i = 0u; i < 20u; i++) { r[i] = state[base + i]; } return r; }
fn st(base: u32, v: Fe) { var x = v; for (var i = 0u; i < 20u; i++) { state[base + i] = x[i]; } }
fn pow5(x: Fe) -> Fe { let x2 = msqr(x); let x4 = msqr(x2); return mmul(x4, x); }
// Poseidon of two elements: width 3, 8 full and 60 partial rounds, x^5, state [a, b, 2], first element out. Partial
// rounds 4–62 are in the constant table's sparse form (field.ts, partialRounds): five products a round. The other
// rounds multiply by a whole matrix: the MDS matrix, or round 63's own. One loop for all rounds, so the shader holds
// each product once (its size sets the time the GPU compiler takes).
fn poseidon(a: Fe, b: Fe) -> Fe {
  var s0 = fadd(a, cld(0u));
  var s1 = fadd(b, cld(1u));
  var s2 = fadd(cld(${SLOT.TWO}u), cld(2u));
  for (var r = 0u; r < 68u; r++) {
    if (r < 4u || r >= 64u) { s0 = pow5(s0); s1 = pow5(s1); }
    let x = pow5(s2);
    if (r >= 4u && r < 63u) {
      let q = ${SLOT.SPARSE}u + (r - 4u) * 5u;
      s2 = fadd(fadd(fadd(mmul(cld(q), s0), mmul(cld(q + 1u), s1)), mmul(cld(q + 2u), x)), cld(${SLOT.PARTIAL_CONSTANT}u + r - 4u));
      s0 = fadd(s0, mmul(cld(q + 3u), x));
      s1 = fadd(s1, mmul(cld(q + 4u), x));
    } else {
      var m = ${SLOT.MDS}u;
      var k = (r + 1u) * 3u;
      if (r == 63u) { m = ${SLOT.LAST_PARTIAL}u; k = ${SLOT.AFTER_PARTIAL}u; }
      var n0 = fadd(fadd(mmul(cld(m), s0), mmul(cld(m + 1u), s1)), mmul(cld(m + 2u), x));
      var n1 = fadd(fadd(mmul(cld(m + 3u), s0), mmul(cld(m + 4u), s1)), mmul(cld(m + 5u), x));
      var n2 = fadd(fadd(mmul(cld(m + 6u), s0), mmul(cld(m + 7u), s1)), mmul(cld(m + 8u), x));
      if (r < 67u) { n0 = fadd(n0, cld(k)); n1 = fadd(n1, cld(k + 1u)); n2 = fadd(n2, cld(k + 2u)); }
      s0 = n0; s1 = n1; s2 = n2;
    }
  }
  return s0;
}

@compute @workgroup_size(64)
fn decompress(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= params.n) { return; }
  let e = idx * ${ENTRY_WORDS}u;
  let s = idx * ${STATE_WORDS}u;
  var nz = 0u;
  for (var k = 0u; k < ${ENTRY_WORDS}u; k++) { nz = nz | entries[e + k]; }
  if (nz == 0u) { state[s + ${FLAGS_AT}u] = 0u; return; }
  var w: array<u32, 8>;
  for (var k = 0u; k < 8u; k++) { w[k] = entries[e + k]; }
  let sign = w[7] >> 31u;
  w[7] = w[7] & 0x7fffffffu;
  let raw = limbs_of(w);
  if (geq_p(raw)) { state[s + ${FLAGS_AT}u] = 0u; return; }
  let v = to_mont(raw);
  let v2 = msqr(v);
  let one = cld(${SLOT.ONE}u);
  let num = fsub(v2, one);
  let den = fadd(one, mmul(cld(${SLOT.D}u), v2));
  var u = fsqrt_ratio(num, den);
  if (!feq(mmul(msqr(u), den), num)) { state[s + ${FLAGS_AT}u] = 0u; return; }
  let ucan = from_mont(u);
  let u_zero = is_zero(ucan);
  if (u_zero && sign == 1u) { state[s + ${FLAGS_AT}u] = 0u; return; }
  var ub = ucan;
  if ((ub[0] & 1u) != sign) { u = fneg(u); }
  var flags = FLAG_VALID;
  if (u_zero && feq(v, one)) { flags = flags | FLAG_IDENTITY; }
  // The table: P, then 3P, 5P and 7P. The loop's first turn adds P to itself; 2P then becomes the addend and the
  // sum starts again from P, so the next three turns give 3P, 5P and 7P.
  let two_d = cld(${SLOT.D2}u);
  let t1 = mmul(u, v);
  var qa = fsub(v, u);
  var qb = fadd(v, u);
  var qc = mmul(two_d, t1);
  var qd = fadd(one, one);
  st(s, qa); st(s + 20u, qb); st(s + 40u, qc); st(s + 60u, qd);
  var X = u; var Y = v; var Z = one; var T = t1;
  for (var k = 0u; k < 4u; k++) {
    let a2 = mmul(fsub(Y, X), qa);
    let b2 = mmul(fadd(Y, X), qb);
    let c2 = mmul(T, qc);
    let d2 = mmul(Z, qd);
    let e2 = fsub(b2, a2);
    let f2 = fsub(d2, c2);
    let g2 = fadd(d2, c2);
    let h2 = fadd(b2, a2);
    X = mmul(e2, f2); Y = mmul(g2, h2); T = mmul(e2, h2); Z = mmul(f2, g2);
    let ca = fsub(Y, X);
    let cb = fadd(Y, X);
    let cc = mmul(two_d, T);
    let cd = fadd(Z, Z);
    if (k == 0u) {
      qa = ca; qb = cb; qc = cc; qd = cd;
      X = u; Y = v; Z = one; T = t1;
    } else {
      let tb = s + k * ${TABLE_POINT}u;
      st(tb, ca); st(tb + 20u, cb); st(tb + 40u, cc); st(tb + 60u, cd);
    }
  }
  // The ladder starts from the identity.
  var zero: Fe;
  st(s + ${X_AT}u, zero);
  st(s + ${Y_AT}u, one);
  st(s + ${Z_AT}u, one);
  state[s + ${FLAGS_AT}u] = flags;
}

// params.count digits, from digit params.top downward.
@compute @workgroup_size(64)
fn ladder(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= params.n) { return; }
  let s = idx * ${STATE_WORDS}u;
  if ((state[s + ${FLAGS_AT}u] & FLAG_VALID) == 0u) { return; }
  var X = ld(s + ${X_AT}u);
  var Y = ld(s + ${Y_AT}u);
  var Z = ld(s + ${Z_AT}u);
  for (var k = 0u; k < params.count; k++) {
    let pos = params.top - k;
    let digit = params.digits[pos >> 2u][pos & 3u];
    let A = msqr(X);
    let B = msqr(Y);
    let zz = msqr(Z);
    let C = fadd(zz, zz);
    let xy = fadd(X, Y);
    let E = fsub(fsub(msqr(xy), A), B);
    let G = fsub(B, A);
    let F = fsub(G, C);
    let H = fneg(fadd(A, B));
    X = mmul(E, F); Y = mmul(G, H); Z = mmul(F, G);
    if (digit != 0i) {
      let T = mmul(E, H);
      let negative = digit < 0i;
      let tb = s + (u32(abs(digit)) >> 1u) * ${TABLE_POINT}u;
      var pa = ld(tb);
      var pb = ld(tb + 20u);
      if (negative) { let swap = pa; pa = pb; pb = swap; }
      let a2 = mmul(fsub(Y, X), pa);
      let b2 = mmul(fadd(Y, X), pb);
      let c2 = mmul(T, ld(tb + 40u));
      let d2 = mmul(Z, ld(tb + 60u));
      let e2 = fsub(b2, a2);
      var f2 = fsub(d2, c2);
      var g2 = fadd(d2, c2);
      let h2 = fadd(b2, a2);
      if (negative) { let swap = f2; f2 = g2; g2 = swap; }
      X = mmul(e2, f2); Y = mmul(g2, h2); Z = mmul(f2, g2);
    }
  }
  st(s + ${X_AT}u, X); st(s + ${Y_AT}u, Y); st(s + ${Z_AT}u, Z);
}

@compute @workgroup_size(64)
fn finish(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= params.n) { return; }
  let s = idx * ${STATE_WORDS}u;
  let o = idx * ${OUT_WORDS}u;
  if ((state[s + ${FLAGS_AT}u] & FLAG_VALID) == 0u) {
    for (var k = 0u; k < ${OUT_WORDS}u; k++) { outb[o + k] = 0u; }
    return;
  }
  let zi = fpow(ld(s + ${Z_AT}u), 0u);
  let x = mmul(ld(s + ${X_AT}u), zi);
  let y = mmul(ld(s + ${Y_AT}u), zi);
  var zero: Fe;
  // k = Poseidon(k*.u, k*.v), then the value Poseidon(k, 0).
  var pad = x;
  var second = y;
  for (var i = 0u; i < 2u; i++) { pad = poseidon(pad, second); second = zero; }
  let w = words_of(from_mont(pad));
  for (var k = 0u; k < 8u; k++) { outb[o + k] = w[k]; }
  outb[o + 8u] = u32(w[0] == entries[idx * ${ENTRY_WORDS}u + 8u]);
}

// After decompress and the ladder with the scalar r: 1 if the point is in the prime-order subgroup and not the identity.
@compute @workgroup_size(64)
fn torsion(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= params.n) { return; }
  let s = idx * ${STATE_WORDS}u;
  let flags = state[s + ${FLAGS_AT}u];
  var ok = (flags & FLAG_VALID) != 0u && (flags & FLAG_IDENTITY) == 0u;
  if (ok) { ok = is_zero(ld(s + ${X_AT}u)) && feq(ld(s + ${Y_AT}u), ld(s + ${Z_AT}u)); }
  outb[idx * ${OUT_WORDS}u + 8u] = u32(ok);
}
`;
}
