/**
 * The PIR multiply's inner loops: `out[v][r] = Σ_c matrix[r][c] · vectors[v][c] mod 2^32` for a range of rows.
 *
 * The matrix is row-major (`rows × cols`); the vectors are vector-major (`count × cols`, the wire layout of a query
 * call). Loop order, outermost first: a tile of `TILE` columns; a block of up to `VECTOR_BLOCK` vectors; every 4-row
 * block of the range; pairs of vectors. Within a tile, the block's slice of the vectors (64 × 2048 × 4 bytes = 512 KiB)
 * stays in the second-level cache while every row of the range passes over it, and each 4 × TILE patch of the matrix
 * stays in the first-level cache while the block's vectors pass over it. Eight accumulators (4 rows × 2 vectors) live
 * in registers. A call with at most `VECTOR_BLOCK` vectors (a query call: 32) reads each cell from memory once and uses
 * it for every vector; the setup data's 1,024 vectors read the matrix once per block of 64. Products and sums wrap at
 * 32 bits (`Math.imul`, `| 0`), which is arithmetic modulo q = 2^32.
 *
 * Two copies, one per matrix type (`Int16Array` grid cells, `Int32Array` for the client's A and H), keep each loop
 * monomorphic for the JIT. They must stay identical apart from the type.
 */

/** Columns per tile: 4 rows × 2048 columns of 16-bit cells is 16 KiB. */
const TILE = 2048;
/** Vectors per block: their slice of a tile is 512 KiB. */
const VECTOR_BLOCK = 64;

/** Where `out[v][r]` goes: `out[r·rowStride + v·vecStride]`. */
export interface OutLayout {
  readonly rowStride: number;
  readonly vecStride: number;
}

export function multiplyRows16(
  m: Int16Array,
  cols: number,
  rowStart: number,
  rowEnd: number,
  vec: Int32Array,
  count: number,
  out: Int32Array,
  layout: OutLayout,
): void {
  const { rowStride, vecStride } = layout;
  for (let r = rowStart; r < rowEnd; r++) {
    for (let v = 0; v < count; v++) out[r * rowStride + v * vecStride] = 0;
  }
  const blockEnd = rowStart + ((rowEnd - rowStart) & ~3);
  for (let c0 = 0; c0 < cols; c0 += TILE) {
    const c1 = Math.min(cols, c0 + TILE);
    for (let v0 = 0; v0 < count; v0 += VECTOR_BLOCK) {
      const v1 = Math.min(count, v0 + VECTOR_BLOCK);
      const evenEnd = v0 + ((v1 - v0) & ~1);
      for (let r0 = rowStart; r0 < blockEnd; r0 += 4) {
        const m0 = r0 * cols;
        const m1 = m0 + cols;
        const m2 = m1 + cols;
        const m3 = m2 + cols;
        for (let v = v0; v < evenEnd; v += 2) {
          const q0 = v * cols;
          const q1 = q0 + cols;
          let a00 = 0, a01 = 0, a10 = 0, a11 = 0, a20 = 0, a21 = 0, a30 = 0, a31 = 0;
          for (let c = c0; c < c1; c++) {
            const x0 = vec[q0 + c]!;
            const x1 = vec[q1 + c]!;
            const y0 = m[m0 + c]!;
            const y1 = m[m1 + c]!;
            const y2 = m[m2 + c]!;
            const y3 = m[m3 + c]!;
            a00 = (a00 + Math.imul(y0, x0)) | 0;
            a01 = (a01 + Math.imul(y0, x1)) | 0;
            a10 = (a10 + Math.imul(y1, x0)) | 0;
            a11 = (a11 + Math.imul(y1, x1)) | 0;
            a20 = (a20 + Math.imul(y2, x0)) | 0;
            a21 = (a21 + Math.imul(y2, x1)) | 0;
            a30 = (a30 + Math.imul(y3, x0)) | 0;
            a31 = (a31 + Math.imul(y3, x1)) | 0;
          }
          const o0 = r0 * rowStride + v * vecStride;
          const o1 = o0 + vecStride;
          out[o0] = (out[o0]! + a00) | 0;
          out[o1] = (out[o1]! + a01) | 0;
          out[o0 + rowStride] = (out[o0 + rowStride]! + a10) | 0;
          out[o1 + rowStride] = (out[o1 + rowStride]! + a11) | 0;
          out[o0 + 2 * rowStride] = (out[o0 + 2 * rowStride]! + a20) | 0;
          out[o1 + 2 * rowStride] = (out[o1 + 2 * rowStride]! + a21) | 0;
          out[o0 + 3 * rowStride] = (out[o0 + 3 * rowStride]! + a30) | 0;
          out[o1 + 3 * rowStride] = (out[o1 + 3 * rowStride]! + a31) | 0;
        }
        if (evenEnd < v1) {
          const q0 = evenEnd * cols;
          let a0 = 0, a1 = 0, a2 = 0, a3 = 0;
          for (let c = c0; c < c1; c++) {
            const x0 = vec[q0 + c]!;
            a0 = (a0 + Math.imul(m[m0 + c]!, x0)) | 0;
            a1 = (a1 + Math.imul(m[m1 + c]!, x0)) | 0;
            a2 = (a2 + Math.imul(m[m2 + c]!, x0)) | 0;
            a3 = (a3 + Math.imul(m[m3 + c]!, x0)) | 0;
          }
          const o = r0 * rowStride + evenEnd * vecStride;
          out[o] = (out[o]! + a0) | 0;
          out[o + rowStride] = (out[o + rowStride]! + a1) | 0;
          out[o + 2 * rowStride] = (out[o + 2 * rowStride]! + a2) | 0;
          out[o + 3 * rowStride] = (out[o + 3 * rowStride]! + a3) | 0;
        }
      }
    }
  }
  for (let r0 = blockEnd; r0 < rowEnd; r0++) {
    const mr = r0 * cols;
    for (let v = 0; v < count; v++) {
      const q = v * cols;
      let a = 0;
      for (let c = 0; c < cols; c++) a = (a + Math.imul(m[mr + c]!, vec[q + c]!)) | 0;
      out[r0 * rowStride + v * vecStride] = a;
    }
  }
}

export function multiplyRows32(
  m: Int32Array,
  cols: number,
  rowStart: number,
  rowEnd: number,
  vec: Int32Array,
  count: number,
  out: Int32Array,
  layout: OutLayout,
): void {
  const { rowStride, vecStride } = layout;
  for (let r = rowStart; r < rowEnd; r++) {
    for (let v = 0; v < count; v++) out[r * rowStride + v * vecStride] = 0;
  }
  const blockEnd = rowStart + ((rowEnd - rowStart) & ~3);
  for (let c0 = 0; c0 < cols; c0 += TILE) {
    const c1 = Math.min(cols, c0 + TILE);
    for (let v0 = 0; v0 < count; v0 += VECTOR_BLOCK) {
      const v1 = Math.min(count, v0 + VECTOR_BLOCK);
      const evenEnd = v0 + ((v1 - v0) & ~1);
      for (let r0 = rowStart; r0 < blockEnd; r0 += 4) {
        const m0 = r0 * cols;
        const m1 = m0 + cols;
        const m2 = m1 + cols;
        const m3 = m2 + cols;
        for (let v = v0; v < evenEnd; v += 2) {
          const q0 = v * cols;
          const q1 = q0 + cols;
          let a00 = 0, a01 = 0, a10 = 0, a11 = 0, a20 = 0, a21 = 0, a30 = 0, a31 = 0;
          for (let c = c0; c < c1; c++) {
            const x0 = vec[q0 + c]!;
            const x1 = vec[q1 + c]!;
            const y0 = m[m0 + c]!;
            const y1 = m[m1 + c]!;
            const y2 = m[m2 + c]!;
            const y3 = m[m3 + c]!;
            a00 = (a00 + Math.imul(y0, x0)) | 0;
            a01 = (a01 + Math.imul(y0, x1)) | 0;
            a10 = (a10 + Math.imul(y1, x0)) | 0;
            a11 = (a11 + Math.imul(y1, x1)) | 0;
            a20 = (a20 + Math.imul(y2, x0)) | 0;
            a21 = (a21 + Math.imul(y2, x1)) | 0;
            a30 = (a30 + Math.imul(y3, x0)) | 0;
            a31 = (a31 + Math.imul(y3, x1)) | 0;
          }
          const o0 = r0 * rowStride + v * vecStride;
          const o1 = o0 + vecStride;
          out[o0] = (out[o0]! + a00) | 0;
          out[o1] = (out[o1]! + a01) | 0;
          out[o0 + rowStride] = (out[o0 + rowStride]! + a10) | 0;
          out[o1 + rowStride] = (out[o1 + rowStride]! + a11) | 0;
          out[o0 + 2 * rowStride] = (out[o0 + 2 * rowStride]! + a20) | 0;
          out[o1 + 2 * rowStride] = (out[o1 + 2 * rowStride]! + a21) | 0;
          out[o0 + 3 * rowStride] = (out[o0 + 3 * rowStride]! + a30) | 0;
          out[o1 + 3 * rowStride] = (out[o1 + 3 * rowStride]! + a31) | 0;
        }
        if (evenEnd < v1) {
          const q0 = evenEnd * cols;
          let a0 = 0, a1 = 0, a2 = 0, a3 = 0;
          for (let c = c0; c < c1; c++) {
            const x0 = vec[q0 + c]!;
            a0 = (a0 + Math.imul(m[m0 + c]!, x0)) | 0;
            a1 = (a1 + Math.imul(m[m1 + c]!, x0)) | 0;
            a2 = (a2 + Math.imul(m[m2 + c]!, x0)) | 0;
            a3 = (a3 + Math.imul(m[m3 + c]!, x0)) | 0;
          }
          const o = r0 * rowStride + evenEnd * vecStride;
          out[o] = (out[o]! + a0) | 0;
          out[o + rowStride] = (out[o + rowStride]! + a1) | 0;
          out[o + 2 * rowStride] = (out[o + 2 * rowStride]! + a2) | 0;
          out[o + 3 * rowStride] = (out[o + 3 * rowStride]! + a3) | 0;
        }
      }
    }
  }
  for (let r0 = blockEnd; r0 < rowEnd; r0++) {
    const mr = r0 * cols;
    for (let v = 0; v < count; v++) {
      const q = v * cols;
      let a = 0;
      for (let c = 0; c < cols; c++) a = (a + Math.imul(m[mr + c]!, vec[q + c]!)) | 0;
      out[r0 * rowStride + v * vecStride] = a;
    }
  }
}
