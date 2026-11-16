/**
 * WGSL of IPIR+SP's server arithmetic (`ipir.ts`): numbers modulo 2^54 carried in 32-bit words, since WGSL has no
 * 64-bit integers. Every result is exact; `ipir-wire.ts` states the arithmetic it reproduces.
 *
 * **Limb layout.** A 54-bit word w (a query word `x << 5` or a key word) is four 16-bit limbs `(l0, l1, l2, l3)`, l3
 * of 6 bits, one `vec4<u32>`. A product with a 16-bit cell, `cell · l_i`, fits 32 bits. A running sum keeps four
 * 32-bit accumulators `T = (T0, T1, T2, T3)` of weights 2^0, 2^16, 2^32, 2^48:
 *
 *     P = cell · (l0, l1, l2, l3)
 *     T += (P0 mod 2^16,  ⌊P0 / 2^16⌋ + P1 mod 2^16,  ⌊P1 / 2^16⌋ + P2,  P3)
 *
 * T0 and T1 only ever receive 16-bit pieces, so they stay exact over at most 16,384 rows (T1 < 2 · 2^16 · 2^14 =
 * 2^31); T2 and T3 wrap modulo 2^32, which is harmless since the sum is needed modulo 2^54 and their weights are 2^32
 * and 2^48. `combine` turns T into the sum modulo 2^54 as `vec2<u32>(low 32 bits, high 22 bits)`, whose bytes are the
 * value's 64-bit little-endian bytes.
 *
 * The packing multiplies a signed 32-bit matrix entry h by a 54-bit key word. h = hs · 2^16 + h0, h0 = h mod 2^16
 * (unsigned) and hs = h >> 16 (arithmetic, in [−2^15, 2^15)): `h0 · l_i` fits 32 bits unsigned and `hs · l_i` fits
 * 32 bits signed, so both are exact `u32` products. The signed piece of weight 2^16, `hs · l0`, is split as
 * `(hs · l0) mod 2^16` (into T1) and its arithmetic shift by 16 (into T2); everything else lands as above. Over the
 * 4,096 key words T1 stays below 3 · 2^16 · 2^12 < 2^30.
 *
 * **Kernels** (64 invocations per workgroup; ids over two grid dimensions when one is not enough):
 *
 * - `upload_cells`: a slab of column-major cells (two 16-bit cells per word) → the table on the GPU, row-major, one
 *   word per pair of adjacent columns (`word[r · cols/2 + c/2] = cell(r, c) | cell(r, c + 1) << 16`), so that adjacent
 *   invocations of the scan read adjacent words.
 * - `upload_matrix`: one block's compiled matrix, row-major (2,048 × 4,096) → column-major, so that adjacent
 *   invocations of the packing (adjacent rows of the matrix) read adjacent words.
 * - `unpack_query`, `unpack_key`: a call's requests, as words → the selection words' limbs `[row][request]` and the key
 *   words' limbs `[key word][request]`.
 * - `scan` (the first pass): one invocation per (column pair, group of G requests, segment of rows); it reads its
 *   segment's rows of two columns once and keeps 2 · G accumulators; the segment's sums go to a partial buffer
 *   `[segment][request][column]`.
 * - `hint`: the same over the 2,048 public "queries" of the hint columns: query k of row r is
 *   `M[r, k] = poly_b[k − j]` when j ≤ k, else `−poly_b[k − j + d]` (b = ⌊r / d⌋, j = r mod d), read from a buffer of
 *   each polynomial followed by its negation.
 * - `pack`: one invocation per (block, row of the block's matrix, group of G requests, segment of key words); partial
 *   sums into the same partial buffer, after the scan's segments.
 * - `finish_answer`: one invocation per (request, 16 columns): the partial sums added modulo 2^54, rounded to 22 bits
 *   (`((v + 2^31) >> 32) mod 2^22`) and packed: 16 coefficients are 352 bits, 11 words. `finish_words` writes the
 *   unrounded sums instead (for checking the first pass and the packing on their own).
 */

export const IPIR_WORKGROUP = 64;
/** Bytes of every kernel's parameters (one uniform struct of 16 words). */
export const IPIR_PARAMS_BYTES = 64;

const PARAMS = /* wgsl */ `
struct Params {
  a0: u32, a1: u32, a2: u32, a3: u32, a4: u32, a5: u32, a6: u32, a7: u32,
  a8: u32, a9: u32, a10: u32, a11: u32, a12: u32, a13: u32, a14: u32, a15: u32,
}`;

const ID = /* wgsl */ `@builtin(global_invocation_id) gid: vec3<u32>, @builtin(num_workgroups) nwg: vec3<u32>`;
const ID_LET = `let id = gid.y * nwg.x * ${IPIR_WORKGROUP}u + gid.x;`;

const MOD54 = /* wgsl */ `
const LOW16 = 0xFFFFu;
const HIGH22 = 0x3FFFFFu;
// (T0 + T1·2^16 + T2·2^32 + T3·2^48) mod 2^54 as (low 32 bits, high 22 bits).
fn combine(t: vec4<u32>) -> vec2<u32> {
  let lo = t.x + (t.y << 16u);
  let carry = select(0u, 1u, lo < t.x);
  let hi = (t.y >> 16u) + carry + t.z + (t.w << 16u);
  return vec2<u32>(lo, hi & HIGH22);
}
fn add54(a: vec2<u32>, b: vec2<u32>) -> vec2<u32> {
  let lo = a.x + b.x;
  let hi = a.y + b.y + select(0u, 1u, lo < a.x);
  return vec2<u32>(lo, hi & HIGH22);
}`;

/** Parameters: a0 rows (of the table), a1 first column of the slab (even), a2 columns in the slab (even), a3 first row
 * of the chunk, a4 rows in the chunk, a5 words per row (cols / 2). One invocation per output word (pair, row). */
export function uploadCellsWgsl(): string {
  return /* wgsl */ `
${PARAMS}
@group(0) @binding(0) var<storage, read> slab: array<u32>;
@group(0) @binding(1) var<storage, read_write> chunk: array<u32>;
@group(0) @binding(2) var<uniform> p: Params;

fn cell(index: u32) -> u32 {
  return (slab[index >> 1u] >> ((index & 1u) * 16u)) & 0xFFFFu;
}

@compute @workgroup_size(${IPIR_WORKGROUP})
fn upload_cells(${ID}) {
  ${ID_LET}
  let pairs = p.a2 / 2u;
  if (id >= pairs * p.a4) { return; }
  let r = id % p.a4;
  let pair = id / p.a4;
  let row = p.a3 + r;
  let c = 2u * pair;
  let lo = cell(c * p.a0 + row);
  let hi = cell((c + 1u) * p.a0 + row);
  chunk[r * p.a5 + (p.a1 + c) / 2u] = lo | (hi << 16u);
}
`;
}

/** Parameters: a0 rows of the block's matrix (2,048), a1 columns (4,096), a2 word offset of the block in the
 * destination. One invocation per entry; reads row-major, writes column-major. */
export function uploadMatrixWgsl(): string {
  return /* wgsl */ `
${PARAMS}
@group(0) @binding(0) var<storage, read> source: array<u32>;
@group(0) @binding(1) var<storage, read_write> dest: array<u32>;
@group(0) @binding(2) var<uniform> p: Params;

@compute @workgroup_size(${IPIR_WORKGROUP})
fn upload_matrix(${ID}) {
  ${ID_LET}
  if (id >= p.a0 * p.a1) { return; }
  let i = id % p.a0;
  let c = id / p.a0;
  dest[p.a2 + c * p.a0 + i] = source[i * p.a1 + c];
}
`;
}

/**
 * Parameters: a0 requests, a1 requests padded (columns of the limb buffers), a2 words per request, a3 table rows,
 * a4 bit offset of the selection in a request, a5 bit offset of the key. `raw` holds the requests' words plus two
 * words of zeros (a 64-bit read near the end stays in bounds).
 */
export function unpackWgsl(queryBits: number, keyBits: number, queryShift: number): string {
  const qMaskHi = (1 << (queryBits - 32)) - 1;
  const kMaskHi = (1 << (keyBits - 32)) - 1;
  return /* wgsl */ `
${PARAMS}
@group(0) @binding(0) var<storage, read> raw: array<u32>;
@group(0) @binding(1) var<storage, read_write> limbs: array<vec4<u32>>;
@group(0) @binding(2) var<uniform> p: Params;

// 64 bits of the call from bit \`bit\` of the request starting at word \`base\`, little-endian.
fn bits64(base: u32, bit: u32) -> vec2<u32> {
  let w = base + (bit >> 5u);
  let s = bit & 31u;
  let w0 = raw[w];
  let w1 = raw[w + 1u];
  if (s == 0u) { return vec2<u32>(w0, w1); }
  let w2 = raw[w + 2u];
  return vec2<u32>((w0 >> s) | (w1 << (32u - s)), (w1 >> s) | (w2 << (32u - s)));
}

fn limbs54(lo: u32, hi: u32) -> vec4<u32> {
  return vec4<u32>(lo & 0xFFFFu, lo >> 16u, hi & 0xFFFFu, hi >> 16u);
}

@compute @workgroup_size(${IPIR_WORKGROUP})
fn unpack_query(${ID}) {
  ${ID_LET}
  if (id >= p.a0 * p.a3) { return; }
  let b = id % p.a0;
  let r = id / p.a0;
  let x = bits64(b * p.a2, p.a4 + r * ${queryBits}u);
  let hi = x.y & ${qMaskHi}u;
  // The ring lift: x << ${queryShift}.
  let lo = x.x << ${queryShift}u;
  let top = (hi << ${queryShift}u) | (x.x >> ${32 - queryShift}u);
  limbs[r * p.a1 + b] = limbs54(lo, top);
}

@compute @workgroup_size(${IPIR_WORKGROUP})
fn unpack_key(${ID}) {
  ${ID_LET}
  if (id >= p.a0 * p.a3) { return; }
  let b = id % p.a0;
  let i = id / p.a0;
  let x = bits64(b * p.a2, p.a5 + i * ${keyBits}u);
  limbs[i * p.a1 + b] = limbs54(x.x, x.y & ${kMaskHi}u);
}
`;
}

/**
 * The first pass (`kind` "scan") or the hint columns (`kind` "hint"), G requests (or hint coefficients) and
 * `2 · words` adjacent columns per invocation (the table read as `u32`, `vec2<u32>` or `vec4<u32>`). Parameters: a0
 * invocations per table row (cols / (2 · words)), a1 rows per segment, a2 segments in this chunk, a3 first
 * row of the chunk, a4 first segment of the chunk (in the partial buffer), a5 requests padded (or coefficients in
 * this batch), a6 groups (a5 / G), a7 table columns, a8 ring size d, a9 first coefficient of the batch (hint only).
 * The hint kernel's `q` is the buffer of each query-mask polynomial followed by its negation (2d limbs each).
 */
export function scanWgsl(g: number, kind: "scan" | "hint", words = 1, order: "pair" | "group" = "pair"): string {
  if (!Number.isInteger(g) || g < 1 || g > 16) throw new Error(`requests per invocation must be 1 to 16: ${g}`);
  if (![1, 2, 4].includes(words)) throw new Error(`table words per invocation must be 1, 2 or 4: ${words}`);
  const js = Array.from({ length: g }, (_, j) => j);
  const ms = Array.from({ length: 2 * words }, (_, m) => m);
  const cols = 2 * words;
  const lanes = ["x", "y", "z", "w"];
  const word = (m: number) => (words === 1 ? "w" : `w.${lanes[m >> 1]}`);
  const cells = ms.map((m) => `let c${m} = ${m % 2 === 0 ? `${word(m)} & LOW16` : `${word(m)} >> 16u`};`).join("\n    ");
  const decl = js.flatMap((j) => ms.map((m) => `var a${m}_${j} = vec4<u32>(0u);`)).join("\n  ");
  const load =
    kind === "scan"
      ? `let base = row * p.a5 + group * ${g}u;`
      : `let j = row % p.a8;
    let base = (row / p.a8) * 2u * p.a8 + p.a9 + group * ${g}u + p.a8 - j;`;
  const body = js
    .map(
      (j) => `{
      let l = q[base + ${j}u];
      ${ms
        .map(
          (m) => `let x${m} = vec4<u32>(c${m}) * l;
      a${m}_${j} += vec4<u32>(x${m}.x & LOW16, (x${m}.x >> 16u) + (x${m}.y & LOW16), (x${m}.y >> 16u) + x${m}.z, x${m}.w);`,
        )
        .join("\n      ")}
    }`,
    )
    .join("\n    ");
  // The first pass writes [segment][request][column]; the hints write [segment][column][coefficient], the layout of
  // the add-on's hint columns.
  const stores = js
    .map((j) =>
      kind === "scan"
        ? `{
    let at = ((p.a4 + s) * p.a5 + group * ${g}u + ${j}u) * p.a7 + ${cols}u * pair;
    ${ms.map((m) => `partial[at + ${m}u] = combine(a${m}_${j});`).join("\n    ")}
  }`
        : `{
    let k = p.a9 + group * ${g}u + ${j}u;
    let at = ((p.a4 + s) * p.a7 + ${cols}u * pair) * p.a8 + k;
    ${ms.map((m) => `partial[at + ${m}u * p.a8] = combine(a${m}_${j});`).join("\n    ")}
  }`,
    )
    .join("\n  ");
  return /* wgsl */ `
${PARAMS}
${MOD54}
@group(0) @binding(0) var<storage, read> table: array<${words === 1 ? "u32" : `vec${words}<u32>`}>;
@group(0) @binding(1) var<storage, read> q: array<vec4<u32>>;
@group(0) @binding(2) var<storage, read_write> partial: array<vec2<u32>>;
@group(0) @binding(3) var<uniform> p: Params;

@compute @workgroup_size(${IPIR_WORKGROUP})
fn ${kind}(${ID}) {
  ${ID_LET}
  ${
    order === "pair"
      ? `let pair = id % p.a0;
  let rest = id / p.a0;
  let group = rest % p.a6;
  let s = rest / p.a6;`
      : `let group = id % p.a6;
  let rest = id / p.a6;
  let pair = rest % p.a0;
  let s = rest / p.a0;`
  }
  if (s >= p.a2) { return; }
  ${decl}
  let first = s * p.a1;
  for (var r = 0u; r < p.a1; r++) {
    let local = first + r;
    let w = table[local * p.a0 + pair];
    ${cells}
    let row = p.a3 + local;
    ${load}
    ${body}
  }
  ${stores}
}
`;
}

/**
 * The packing product, G requests and `rowsPer` adjacent matrix rows per invocation (the column-major matrix read
 * as `u32`, `vec2<u32>` or `vec4<u32>`). Parameters: a0 blocks in this matrix buffer, a1 first block of the
 * buffer, a2 key-word segments, a3 key words per segment, a4 requests padded, a5 groups, a6 table columns, a7 first
 * segment of the packing in the partial buffer, a8 ring size d (rows of a block's matrix), a9 key words (4,096).
 */
export function packWgsl(g: number, rowsPer = 1, order: "row" | "group" = "row"): string {
  if (!Number.isInteger(g) || g < 1 || g > 16) throw new Error(`requests per invocation must be 1 to 16: ${g}`);
  if (![1, 2, 4].includes(rowsPer)) throw new Error(`matrix rows per invocation must be 1, 2 or 4: ${rowsPer}`);
  const js = Array.from({ length: g }, (_, j) => j);
  const ns = Array.from({ length: rowsPer }, (_, n) => n);
  const lanes = ["x", "y", "z", "w"];
  const entry = (n: number) => (rowsPer === 1 ? "e" : `e.${lanes[n]}`);
  const split = ns
    .map((n) => `let h0_${n} = ${entry(n)} & LOW16;\n    let hs_${n} = bitcast<u32>(bitcast<i32>(${entry(n)}) >> 16u);`)
    .join("\n    ");
  const decl = js.flatMap((j) => ns.map((n) => `var a${n}_${j} = vec4<u32>(0u);`)).join("\n  ");
  const body = js
    .map(
      (j) => `{
      let l = y[base + ${j}u];
      ${ns
        .map(
          (n) => `{
        let u = vec4<u32>(h0_${n}) * l;
        let v = vec4<u32>(hs_${n}) * l;
        a${n}_${j} += vec4<u32>(
          u.x & LOW16,
          (u.x >> 16u) + (u.y & LOW16) + (v.x & LOW16),
          (u.y >> 16u) + bitcast<u32>(bitcast<i32>(v.x) >> 16u) + u.z + v.y,
          u.w + v.z);
      }`,
        )
        .join("\n      ")}
    }`,
    )
    .join("\n    ");
  const stores = js
    .flatMap((j) => ns.map((n) => `partial[((p.a7 + kseg) * p.a4 + group * ${g}u + ${j}u) * p.a6 + col + ${n}u] = combine(a${n}_${j});`))
    .join("\n  ");
  return /* wgsl */ `
${PARAMS}
${MOD54}
@group(0) @binding(0) var<storage, read> matrix: array<${rowsPer === 1 ? "u32" : `vec${rowsPer}<u32>`}>;
@group(0) @binding(1) var<storage, read> y: array<vec4<u32>>;
@group(0) @binding(2) var<storage, read_write> partial: array<vec2<u32>>;
@group(0) @binding(3) var<uniform> p: Params;

@compute @workgroup_size(${IPIR_WORKGROUP})
fn pack(${ID}) {
  ${ID_LET}
  let per = p.a8 / ${rowsPer}u;
  ${
    order === "row"
      ? `let i = id % per;
  let rest = id / per;
  let group = rest % p.a5;
  let rest2 = rest / p.a5;`
      : `let group = id % p.a5;
  let rest = id / p.a5;
  let i = rest % per;
  let rest2 = rest / per;`
  }
  let kseg = rest2 % p.a2;
  let kb = rest2 / p.a2;
  if (kb >= p.a0) { return; }
  ${decl}
  let first = kseg * p.a3;
  for (var c = first; c < first + p.a3; c++) {
    let e = matrix[(kb * p.a9 + c) * per + i];
    ${split}
    let base = c * p.a4 + group * ${g}u;
    ${body}
  }
  let col = (p.a1 + kb) * p.a8 + ${rowsPer}u * i;
  ${stores}
}
`;
}

const FINISH_COMMON = /* wgsl */ `
${PARAMS}
${MOD54}
@group(0) @binding(0) var<storage, read> partial: array<vec2<u32>>;
@group(0) @binding(1) var<storage, read_write> out: array<u32>;
@group(0) @binding(2) var<uniform> p: Params;

// The sum over the segments of the partial buffer of one (request, column), modulo 2^54.
fn sum(index: u32) -> vec2<u32> {
  var v = vec2<u32>(0u);
  let stride = p.a1 * p.a2;
  for (var s = 0u; s < p.a3; s++) { v = add54(v, partial[s * stride + index]); }
  return v;
}`;

/**
 * The answers: the partial sums added modulo 2^54, rounded to `responseBits` and packed. Parameters: a0 requests, a1
 * requests padded, a2 table columns, a3 segments. One invocation per (request, 16 columns), 11 output words each.
 */
export function finishAnswerWgsl(responseBits: number, qBits: number): string {
  if (responseBits !== 22 || qBits !== 54) throw new Error("the answer packing is written for 22-bit answers modulo 2^54");
  const words = 11;
  const sums = Array.from({ length: 16 }, (_, i) => `let x${i} = round22(sum(base + ${i}u));`).join("\n  ");
  const decl = Array.from({ length: words }, (_, w) => `var o${w} = 0u;`).join(" ");
  const pack: string[] = [];
  for (let i = 0; i < 16; i++) {
    const bit = responseBits * i;
    const w = bit >>> 5;
    const s = bit & 31;
    pack.push(s === 0 ? `o${w} |= x${i};` : `o${w} |= x${i} << ${s}u;`);
    if (s + responseBits > 32) pack.push(`o${w + 1} |= x${i} >> ${32 - s}u;`);
  }
  const stores = Array.from({ length: words }, (_, w) => `out[at + ${w}u] = o${w};`).join("\n  ");
  return /* wgsl */ `
${FINISH_COMMON}

// ((v + 2^31) >> 32) mod 2^22
fn round22(v: vec2<u32>) -> u32 {
  return (v.y + (v.x >> 31u)) & HIGH22;
}

@compute @workgroup_size(${IPIR_WORKGROUP})
fn finish_answer(${ID}) {
  ${ID_LET}
  let groups = p.a2 / 16u;
  if (id >= p.a0 * groups) { return; }
  let b = id / groups;
  let k = id % groups;
  let base = b * p.a2 + k * 16u;
  ${sums}
  ${decl}
  ${pack.join("\n  ")}
  let at = (b * groups + k) * ${words}u;
  ${stores}
}
`;
}

/** The unrounded sums (`vec2<u32>` per request and column, request-major). Parameters as `finishAnswerWgsl`. */
export function finishWordsWgsl(): string {
  return /* wgsl */ `
${FINISH_COMMON}

@compute @workgroup_size(${IPIR_WORKGROUP})
fn finish_words(${ID}) {
  ${ID_LET}
  if (id >= p.a0 * p.a2) { return; }
  let v = sum(id);
  out[2u * id] = v.x;
  out[2u * id + 1u] = v.y;
}
`;
}
