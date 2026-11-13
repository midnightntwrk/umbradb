/**
 * WGSL of the PIR multiply (spec FR-054, FR-056): `out[v][r] = Σ_c matrix[r][c] · vectors[v][c] mod 2^32`.
 *
 * - `transpose`: the call's vectors arrive vector-major (`count × cols`, the wire layout) and are rewritten
 *   column-major (`colsPadded × countPadded`), zero-padded, so one invocation reads a column's values for its vectors
 *   as consecutive `vec4<u32>`s.
 * - `multiply16`: a grid of 16-bit cells, two per 32-bit word (the `Int16Array`'s own little-endian bytes), each row
 *   padded to an even column count. One invocation computes one row for `G` vectors, reading the row once; products
 *   and sums are `u32` arithmetic, which wraps modulo 2^32 (the cell is sign-extended first, as `Math.imul` sees it).
 * - `multiply32`: the same over a matrix of 32-bit values (the client's A and H).
 *
 * The answers are written at `(rowOffset + r)·rowStride + v·vecStride`: vector-major (`count × rows`, the answer's
 * wire layout) or row-major (`rows × count`, the setup data H).
 */

/** Bytes of the multiply's parameters (uniform). */
export const MULTIPLY_PARAMS_BYTES = 48;
/** Bytes of the transpose's parameters (uniform). */
export const TRANSPOSE_PARAMS_BYTES = 16;
export const WORKGROUP = 64;

const PARAMS = /* wgsl */ `
struct Params {
  rows: u32, words: u32, count_padded: u32, count: u32,
  groups: u32, row_offset: u32, row_stride: u32, vec_stride: u32,
  pad0: u32, pad1: u32, pad2: u32, pad3: u32,
}`;

/** The column-major rewrite of a call's vectors. */
export function transposeWgsl(): string {
  return /* wgsl */ `
struct TParams { cols: u32, count: u32, cols_padded: u32, count_padded: u32 }
@group(0) @binding(0) var<storage, read> raw: array<u32>;
@group(0) @binding(1) var<storage, read_write> vt: array<u32>;
@group(0) @binding(2) var<uniform> t: TParams;

@compute @workgroup_size(${WORKGROUP})
fn transpose(@builtin(global_invocation_id) gid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>) {
  let id = gid.y * nwg.x * ${WORKGROUP}u + gid.x;
  if (id >= t.cols_padded * t.count_padded) { return; }
  let c = id / t.count_padded;
  let v = id % t.count_padded;
  var x = 0u;
  if (c < t.cols && v < t.count) { x = raw[v * t.cols + c]; }
  vt[id] = x;
}
`;
}

/**
 * The multiply over 16-bit (`cell16` true) or 32-bit cells, `g` vectors per invocation (a multiple of 4). The
 * accumulators are separate `vec4<u32>` variables, so they stay in registers.
 */
export function multiplyWgsl(cell16: boolean, g: number): string {
  if (!Number.isInteger(g) || g < 4 || g % 4 !== 0) throw new Error(`vectors per invocation must be a multiple of 4: ${g}`);
  const n = g / 4;
  const acc = Array.from({ length: n }, (_, j) => `acc${j}`);
  const decl = acc.map((a) => `var ${a} = vec4<u32>(0u);`).join("\n  ");
  const body16 = acc
    .map((a, j) => `${a} = ${a} + vec4<u32>(lo) * vt[i0 + ${j}u] + vec4<u32>(hi) * vt[i1 + ${j}u];`)
    .join("\n    ");
  const body32 = acc.map((a, j) => `${a} = ${a} + vec4<u32>(x) * vt[i0 + ${j}u];`).join("\n    ");
  const stores = acc
    .map(
      (a, j) => `for (var e = 0u; e < 4u; e++) {
    let v = (v4 + ${j}u) * 4u + e;
    if (v < p.count) { outb[o + v * p.vec_stride] = ${a}[e]; }
  }`,
    )
    .join("\n  ");
  const loop = cell16
    ? `for (var k = 0u; k < p.words; k++) {
    let w = cells[base + k];
    let lo = bitcast<u32>(bitcast<i32>(w << 16u) >> 16u);
    let hi = bitcast<u32>(bitcast<i32>(w) >> 16u);
    let i0 = 2u * k * q4 + v4;
    let i1 = i0 + q4;
    ${body16}
  }`
    : `for (var k = 0u; k < p.words; k++) {
    let x = cells[base + k];
    let i0 = k * q4 + v4;
    ${body32}
  }`;
  return /* wgsl */ `
${PARAMS}
@group(0) @binding(0) var<storage, read> cells: array<u32>;
@group(0) @binding(1) var<storage, read> vt: array<vec4<u32>>;
@group(0) @binding(2) var<storage, read_write> outb: array<u32>;
@group(0) @binding(3) var<uniform> p: Params;

@compute @workgroup_size(${WORKGROUP})
fn multiply(@builtin(global_invocation_id) gid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>) {
  let id = gid.y * nwg.x * ${WORKGROUP}u + gid.x;
  let r = id / p.groups;
  let g = id % p.groups;
  if (r >= p.rows) { return; }
  let q4 = p.count_padded / 4u;
  let v4 = g * ${n}u;
  let base = r * p.words;
  ${decl}
  ${loop}
  let o = (p.row_offset + r) * p.row_stride;
  ${stores}
}
`;
}
