/**
 * WGSL of the ownership test (spec §2.1, FR-100, FR-103), entry by entry, as the CPU kernel computes it
 * (`kernel/src/lib.rs`, `entry_value` and `entry_matches`):
 *
 * 1. `decompress`: an entry of 36 zero bytes is skipped (no ciphertext). Otherwise the point's 32 bytes are decoded as
 *    `JubjubAffine::from_bytes` decodes them: v (255 bits, little-endian) must be below p; u² = (v² − 1)/(1 + d·v²)
 *    must be a square; u takes the sign bit's parity; u = 0 with the sign bit set is refused (ZIP 216). No subgroup
 *    check. A refused point gives the value zero and never matches, as on the CPU.
 * 2. `ladder` (several dispatches): k* = point × scalar, double-and-add from bit 251 down, with the complete twisted
 *    Edwards formulas in extended coordinates (a = −1).
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
/** Words of one entry's working state: seven field elements (base point in three parts, X, Y, Z, T) and flags. */
export const STATE_WORDS = 141;
/** Words of one entry's output: the value's eight words, then the flag. */
export const OUT_WORDS = 9;
/** Bytes of the shader's parameters (uniform). */
export const PARAMS_BYTES = 48;

export function scanWgsl(): string {
  return /* wgsl */ `
struct Params { s0: vec4<u32>, s1: vec4<u32>, bit_top: u32, nbits: u32, n: u32, pad: u32 }
@group(0) @binding(0) var<storage, read> entries: array<u32>;
@group(0) @binding(1) var<storage, read_write> state: array<u32>;
@group(0) @binding(2) var<storage, read_write> outb: array<u32>;
@group(0) @binding(4) var<uniform> params: Params;
${fieldWgsl(3)}
const FLAG_VALID: u32 = 1u;
const FLAG_IDENTITY: u32 = 2u;

fn ld(base: u32) -> Fe { var r: Fe; for (var i = 0u; i < 20u; i++) { r[i] = state[base + i]; } return r; }
fn st(base: u32, v: Fe) { var x = v; for (var i = 0u; i < 20u; i++) { state[base + i] = x[i]; } }
fn sbit(pos: u32) -> u32 {
  let wi = pos >> 5u;
  var w = 0u;
  if (wi < 4u) { w = params.s0[wi]; } else { w = params.s1[wi - 4u]; }
  return (w >> (pos & 31u)) & 1u;
}
fn pow5(x: Fe) -> Fe { let x2 = mmul(x, x); let x4 = mmul(x2, x2); return mmul(x4, x); }
// Poseidon of two elements: width 3, 8 full and 60 partial rounds, x^5, state [a, b, 2], first element out.
fn poseidon(a: Fe, b: Fe) -> Fe {
  var s0 = fadd(a, cld(0u));
  var s1 = fadd(b, cld(1u));
  var s2 = fadd(cld(${SLOT.TWO}u), cld(2u));
  let m00 = cld(${SLOT.MDS}u); let m01 = cld(${SLOT.MDS + 1}u); let m02 = cld(${SLOT.MDS + 2}u);
  let m10 = cld(${SLOT.MDS + 3}u); let m11 = cld(${SLOT.MDS + 4}u); let m12 = cld(${SLOT.MDS + 5}u);
  let m20 = cld(${SLOT.MDS + 6}u); let m21 = cld(${SLOT.MDS + 7}u); let m22 = cld(${SLOT.MDS + 8}u);
  for (var r = 0u; r < 68u; r++) {
    if (r < 4u || r >= 64u) { s0 = pow5(s0); s1 = pow5(s1); }
    s2 = pow5(s2);
    var n0 = fadd(fadd(mmul(m00, s0), mmul(m01, s1)), mmul(m02, s2));
    var n1 = fadd(fadd(mmul(m10, s0), mmul(m11, s1)), mmul(m12, s2));
    var n2 = fadd(fadd(mmul(m20, s0), mmul(m21, s1)), mmul(m22, s2));
    if (r < 67u) {
      let k = (r + 1u) * 3u;
      n0 = fadd(n0, cld(k)); n1 = fadd(n1, cld(k + 1u)); n2 = fadd(n2, cld(k + 2u));
    }
    s0 = n0; s1 = n1; s2 = n2;
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
  if (nz == 0u) { state[s + 140u] = 0u; return; }
  var w: array<u32, 8>;
  for (var k = 0u; k < 8u; k++) { w[k] = entries[e + k]; }
  let sign = w[7] >> 31u;
  w[7] = w[7] & 0x7fffffffu;
  let raw = limbs_of(w);
  if (geq_p(raw)) { state[s + 140u] = 0u; return; }
  let v = to_mont(raw);
  let v2 = mmul(v, v);
  let one = cld(${SLOT.ONE}u);
  let num = fsub(v2, one);
  let den = fadd(one, mmul(cld(${SLOT.D}u), v2));
  let u2 = mmul(num, fpow(den, 0u));
  var u = fsqrt(u2);
  if (!feq(mmul(u, u), u2)) { state[s + 140u] = 0u; return; }
  let ucan = from_mont(u);
  let u_zero = is_zero(ucan);
  if (u_zero && sign == 1u) { state[s + 140u] = 0u; return; }
  var ub = ucan;
  if ((ub[0] & 1u) != sign) { u = fneg(u); }
  var flags = FLAG_VALID;
  if (u_zero && feq(v, one)) { flags = flags | FLAG_IDENTITY; }
  var zero: Fe;
  st(s, fsub(v, u));
  st(s + 20u, fadd(v, u));
  st(s + 40u, mmul(cld(${SLOT.D2}u), mmul(u, v)));
  st(s + 60u, zero);
  st(s + 80u, one);
  st(s + 100u, one);
  st(s + 120u, zero);
  state[s + 140u] = flags;
}

// params.nbits steps of double-and-add, from bit params.bit_top downward.
@compute @workgroup_size(64)
fn ladder(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= params.n) { return; }
  let s = idx * ${STATE_WORDS}u;
  if ((state[s + 140u] & FLAG_VALID) == 0u) { return; }
  let pa = ld(s);
  let pb = ld(s + 20u);
  let pc = ld(s + 40u);
  var X = ld(s + 60u);
  var Y = ld(s + 80u);
  var Z = ld(s + 100u);
  var T = ld(s + 120u);
  for (var k = 0u; k < params.nbits; k++) {
    let A = mmul(X, X);
    let B = mmul(Y, Y);
    let zz = mmul(Z, Z);
    let C = fadd(zz, zz);
    let xy = fadd(X, Y);
    let E = fsub(fsub(mmul(xy, xy), A), B);
    let G = fsub(B, A);
    let F = fsub(G, C);
    let H = fneg(fadd(A, B));
    X = mmul(E, F); Y = mmul(G, H); T = mmul(E, H); Z = mmul(F, G);
    if (sbit(params.bit_top - k) == 1u) {
      let a2 = mmul(fsub(Y, X), pa);
      let b2 = mmul(fadd(Y, X), pb);
      let c2 = mmul(T, pc);
      let d2 = fadd(Z, Z);
      let e2 = fsub(b2, a2);
      let f2 = fsub(d2, c2);
      let g2 = fadd(d2, c2);
      let h2 = fadd(b2, a2);
      X = mmul(e2, f2); Y = mmul(g2, h2); T = mmul(e2, h2); Z = mmul(f2, g2);
    }
  }
  st(s + 60u, X); st(s + 80u, Y); st(s + 100u, Z); st(s + 120u, T);
}

@compute @workgroup_size(64)
fn finish(@builtin(global_invocation_id) gid: vec3<u32>) {
  let idx = gid.x;
  if (idx >= params.n) { return; }
  let s = idx * ${STATE_WORDS}u;
  let o = idx * ${OUT_WORDS}u;
  if ((state[s + 140u] & FLAG_VALID) == 0u) {
    for (var k = 0u; k < ${OUT_WORDS}u; k++) { outb[o + k] = 0u; }
    return;
  }
  let zi = fpow(ld(s + 100u), 0u);
  let x = mmul(ld(s + 60u), zi);
  let y = mmul(ld(s + 80u), zi);
  var zero: Fe;
  let pad = poseidon(poseidon(x, y), zero);
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
  let flags = state[s + 140u];
  var ok = (flags & FLAG_VALID) != 0u && (flags & FLAG_IDENTITY) == 0u;
  if (ok) { ok = is_zero(ld(s + 60u)) && feq(ld(s + 80u), ld(s + 100u)); }
  outb[idx * ${OUT_WORDS}u + 8u] = u32(ok);
}
`;
}
