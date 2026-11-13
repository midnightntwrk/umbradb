/**
 * The PIR multiply on the GPU (spec story 7), behind the CPU's interface (`pir/multiply.ts`, `Multiplier`, FR-066):
 * `multiply(matrix, vectors, count, layout)` gives `answers[v][r] = Σ_c matrix[r][c] · vectors[v][c] mod 2^32`, for
 * a grid of 16-bit cells or a 32-bit matrix, with the answers vector-major (`count × rows`, a query call's answer) or
 * row-major (`rows × count`, the setup data H). Same inputs, outputs and refusals as `inlineMultiplier` and
 * `WorkerMultiplier`.
 *
 * A matrix is copied to the GPU on every call unless it is pinned (`pin`): the server's tables are built once per
 * snapshot and multiplied on every query call, so it pins them and each call then moves only its vectors (C values
 * each) and answers (R values each). A pinned matrix must not change while pinned; `unpin` releases its GPU copy.
 * Large matrices are split into row chunks of at most `chunkBytes` (each its own buffer and dispatch).
 *
 * Imports no Node module at run time (the `pir/` import is types only), so it runs in a browser and in Deno.
 */

import type { Layout, Matrix, Multiplier } from "../pir/multiply.ts";
import { compileShader, TimestampSpan, writeView } from "./device.ts";
import { MULTIPLY_PARAMS_BYTES, multiplyWgsl, TRANSPOSE_PARAMS_BYTES, transposeWgsl, WORKGROUP } from "./multiply-wgsl.ts";

const MAX_GROUPS = 65535;

export interface GpuMultiplyOptions {
  /** Vectors per invocation for 16-bit grids and for 32-bit matrices (multiples of 4); by default 8 and 8. */
  readonly vectorsPerInvocation16?: number;
  readonly vectorsPerInvocation32?: number;
  /** Largest row chunk in bytes; by default the device's binding limit, at most 1 GiB. */
  readonly chunkBytes?: number;
  /** Measure the GPU's execution time of each call (`lastGpuMs`), if the device has `timestamp-query`. */
  readonly timestamps?: boolean;
}

interface TransposeStage {
  readonly pipeline: GPUComputePipeline;
  readonly layout: GPUBindGroupLayout;
}

interface MultiplyStage {
  readonly m16: GPUComputePipeline;
  readonly m32: GPUComputePipeline;
  readonly layout: GPUBindGroupLayout;
}

interface Chunk {
  readonly buffer: GPUBuffer;
  readonly rowStart: number;
  readonly rows: number;
}

/** A matrix on the GPU: row chunks, each row `words` 32-bit words (16-bit grids padded to an even column count). */
interface Resident {
  readonly rows: number;
  readonly cols: number;
  readonly cell16: boolean;
  readonly words: number;
  readonly chunks: readonly Chunk[];
}

function check(matrix: Matrix, vectors: Uint32Array, count: number): void {
  if (matrix.cells.length !== matrix.rows * matrix.cols) throw new Error("matrix cells do not match its shape");
  if (!Number.isInteger(count) || count < 1) throw new Error(`vector count must be ≥ 1: ${count}`);
  if (vectors.length !== count * matrix.cols) {
    throw new Error(`expected ${count} vectors of ${matrix.cols} values (${count * matrix.cols}), got ${vectors.length}`);
  }
}

/** Workgroups for `invocations`, split over two dimensions when one is not enough. */
function grid(invocations: number): [number, number] {
  const groups = Math.ceil(invocations / WORKGROUP);
  if (groups <= MAX_GROUPS) return [groups, 1];
  return [MAX_GROUPS, Math.ceil(groups / MAX_GROUPS)];
}

export class GpuMultiplier implements Multiplier {
  readonly #device: GPUDevice;
  readonly #transpose: TransposeStage;
  readonly #multiply: MultiplyStage;
  readonly #g16: number;
  readonly #g32: number;
  readonly #chunkBytes: number;
  readonly #pinned = new Map<Int16Array | Int32Array, Resident>();
  readonly #timestamps: boolean;
  #closed = false;
  /**
   * The GPU's execution time of the last call's dispatches (transpose and multiply, not the copies of the matrix,
   * vectors and answers), from timestamp queries; null without the `timestamps` option or the device feature. With
   * calls in flight together it belongs to whichever finished last.
   */
  lastGpuMs: number | null = null;

  private constructor(
    device: GPUDevice,
    transpose: TransposeStage,
    multiply: MultiplyStage,
    g16: number,
    g32: number,
    chunkBytes: number,
    timestamps: boolean,
  ) {
    this.#device = device;
    this.#timestamps = timestamps;
    this.#transpose = transpose;
    this.#multiply = multiply;
    this.#g16 = g16;
    this.#g32 = g32;
    this.#chunkBytes = chunkBytes;
  }

  static async create(device: GPUDevice, options: GpuMultiplyOptions = {}): Promise<GpuMultiplier> {
    const g16 = options.vectorsPerInvocation16 ?? 8;
    const g32 = options.vectorsPerInvocation32 ?? 8;
    const limit = Math.min(device.limits.maxStorageBufferBindingSize, device.limits.maxBufferSize, 1 << 30);
    const chunkBytes = Math.floor(Math.min(options.chunkBytes ?? limit, limit) / 4) * 4;
    if (chunkBytes < 4) throw new Error(`chunkBytes must be at least 4: ${options.chunkBytes}`);
    const C = GPUShaderStage.COMPUTE;
    const tLayout = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: C, buffer: { type: "read-only-storage" } },
        { binding: 1, visibility: C, buffer: { type: "storage" } },
        { binding: 2, visibility: C, buffer: { type: "uniform" } },
      ],
    });
    const mLayout = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: C, buffer: { type: "read-only-storage" } },
        { binding: 1, visibility: C, buffer: { type: "read-only-storage" } },
        { binding: 2, visibility: C, buffer: { type: "storage" } },
        { binding: 3, visibility: C, buffer: { type: "uniform" } },
      ],
    });
    const [tModule, m16Module, m32Module] = await Promise.all([
      compileShader(device, transposeWgsl(), "PIR transpose"),
      compileShader(device, multiplyWgsl(true, g16), "PIR multiply (16-bit cells)"),
      compileShader(device, multiplyWgsl(false, g32), "PIR multiply (32-bit cells)"),
    ]);
    const pipeline = (module: GPUShaderModule, layout: GPUBindGroupLayout, entryPoint: string) =>
      device.createComputePipelineAsync({
        layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }),
        compute: { module, entryPoint },
      });
    const [t, m16, m32] = await Promise.all([
      pipeline(tModule, tLayout, "transpose"),
      pipeline(m16Module, mLayout, "multiply"),
      pipeline(m32Module, mLayout, "multiply"),
    ]);
    const timestamps = (options.timestamps ?? false) && TimestampSpan.available(device);
    return new GpuMultiplier(device, { pipeline: t, layout: tLayout }, { m16, m32, layout: mLayout }, g16, g32, chunkBytes, timestamps);
  }

  #open(): void {
    if (this.#closed) throw new Error("the multiplier is closed");
  }

  /** Copies a matrix to the GPU in row chunks. */
  #upload(matrix: Matrix): Resident {
    const cell16 = matrix.cells instanceof Int16Array;
    const words = cell16 ? Math.ceil(matrix.cols / 2) : matrix.cols;
    const rowBytes = words * 4;
    const perChunk = Math.max(1, Math.floor(this.#chunkBytes / rowBytes));
    if (rowBytes > this.#chunkBytes) throw new Error(`one matrix row (${rowBytes} bytes) exceeds the chunk size`);
    const chunks: Chunk[] = [];
    const cells = matrix.cells;
    for (let rowStart = 0; rowStart < matrix.rows; rowStart += perChunk) {
      const rows = Math.min(perChunk, matrix.rows - rowStart);
      const buffer = this.#device.createBuffer({
        size: rows * rowBytes,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
      if (!cell16 || matrix.cols % 2 === 0) {
        // The cells' own bytes are the rows' words.
        const first = cells.byteOffset + rowStart * matrix.cols * cells.BYTES_PER_ELEMENT;
        writeView(this.#device, buffer, 0, new Uint8Array(cells.buffer, first, rows * rowBytes));
      } else {
        // An odd column count: each row gets a zero cell at its end.
        const step = Math.max(1, Math.floor((16 << 20) / rowBytes));
        for (let r0 = 0; r0 < rows; r0 += step) {
          const n = Math.min(step, rows - r0);
          const padded = new Int16Array(n * words * 2);
          for (let r = 0; r < n; r++) {
            const src = (rowStart + r0 + r) * matrix.cols;
            padded.set(cells.subarray(src, src + matrix.cols), r * words * 2);
          }
          writeView(this.#device, buffer, r0 * rowBytes, padded);
        }
      }
      chunks.push({ buffer, rowStart, rows });
    }
    return { rows: matrix.rows, cols: matrix.cols, cell16, words, chunks };
  }

  static #release(r: Resident): void {
    for (const c of r.chunks) c.buffer.destroy();
  }

  /**
   * Keeps a copy of `matrix` on the GPU for later calls with the same `cells` array. The caller must not change the
   * cells while the matrix is pinned. Pinning an already pinned matrix copies it again.
   */
  pin(matrix: Matrix): void {
    this.#open();
    if (matrix.cells.length !== matrix.rows * matrix.cols) throw new Error("matrix cells do not match its shape");
    this.unpin(matrix);
    this.#pinned.set(matrix.cells, this.#upload(matrix));
  }

  /** Releases a pinned matrix's GPU copy (no effect if it is not pinned). */
  unpin(matrix: Matrix): void {
    const r = this.#pinned.get(matrix.cells);
    if (!r) return;
    this.#pinned.delete(matrix.cells);
    GpuMultiplier.#release(r);
  }

  #resident(matrix: Matrix): { resident: Resident; temporary: boolean } {
    const r = this.#pinned.get(matrix.cells);
    if (r && r.rows === matrix.rows && r.cols === matrix.cols) return { resident: r, temporary: false };
    return { resident: this.#upload(matrix), temporary: true };
  }

  async multiply(matrix: Matrix, vectors: Uint32Array, count: number, layout: Layout = "vector-major"): Promise<Uint32Array> {
    this.#open();
    check(matrix, vectors, count);
    const out = new Uint32Array(matrix.rows * count);
    if (matrix.rows === 0 || matrix.cols === 0) return out;
    const d = this.#device;
    const U = GPUBufferUsage;
    const { resident, temporary } = this.#resident(matrix);
    const g = resident.cell16 ? this.#g16 : this.#g32;
    const countPadded = Math.ceil(count / g) * g;
    const colsPadded = resident.cell16 ? resident.words * 2 : resident.cols;
    const groups = countPadded / g;
    const rowStride = layout === "vector-major" ? 1 : count;
    const vecStride = layout === "vector-major" ? matrix.rows : 1;
    const made: GPUBuffer[] = [];
    let span: TimestampSpan | null = null;
    const buffer = (size: number, usage: number) => {
      const b = d.createBuffer({ size, usage });
      made.push(b);
      return b;
    };
    try {
      const raw = buffer(vectors.byteLength, U.STORAGE | U.COPY_DST);
      writeView(d, raw, 0, vectors);
      const vt = buffer(colsPadded * countPadded * 4, U.STORAGE);
      const answers = buffer(out.byteLength, U.STORAGE | U.COPY_SRC);
      const staging = buffer(out.byteLength, U.MAP_READ | U.COPY_DST);
      const tParams = buffer(TRANSPOSE_PARAMS_BYTES, U.UNIFORM | U.COPY_DST);
      d.queue.writeBuffer(tParams, 0, new Uint32Array([matrix.cols, count, colsPadded, countPadded]));

      span = this.#timestamps ? new TimestampSpan(d) : null;
      const enc = d.createCommandEncoder();
      {
        const pass = enc.beginComputePass(span ? { timestampWrites: span.begin } : {});
        pass.setPipeline(this.#transpose.pipeline);
        pass.setBindGroup(
          0,
          d.createBindGroup({
            layout: this.#transpose.layout,
            entries: [raw, vt, tParams].map((b, binding) => ({ binding, resource: { buffer: b } })),
          }),
        );
        pass.dispatchWorkgroups(...grid(colsPadded * countPadded));
        pass.end();
      }
      resident.chunks.forEach((chunk, i) => {
        const params = buffer(MULTIPLY_PARAMS_BYTES, U.UNIFORM | U.COPY_DST);
        d.queue.writeBuffer(
          params,
          0,
          new Uint32Array([chunk.rows, resident.words, countPadded, count, groups, chunk.rowStart, rowStride, vecStride, 0, 0, 0, 0]),
        );
        const last = i === resident.chunks.length - 1;
        const pass = enc.beginComputePass(span && last ? { timestampWrites: span.end } : {});
        pass.setPipeline(resident.cell16 ? this.#multiply.m16 : this.#multiply.m32);
        pass.setBindGroup(
          0,
          d.createBindGroup({
            layout: this.#multiply.layout,
            entries: [chunk.buffer, vt, answers, params].map((b, binding) => ({ binding, resource: { buffer: b } })),
          }),
        );
        pass.dispatchWorkgroups(...grid(chunk.rows * groups));
        pass.end();
      });
      enc.copyBufferToBuffer(answers, 0, staging, 0, out.byteLength);
      span?.resolve(enc);
      d.queue.submit([enc.finish()]);
      await Promise.all([staging.mapAsync(GPUMapMode.READ), span?.map()]);
      out.set(new Uint32Array(staging.getMappedRange()));
      staging.unmap();
      this.lastGpuMs = span ? span.ms() : null;
      return out;
    } finally {
      span?.destroy();
      for (const b of made) b.destroy();
      if (temporary) GpuMultiplier.#release(resident);
    }
  }

  /** Releases every pinned matrix. The device stays open (it belongs to the caller). */
  async close(): Promise<void> {
    if (this.#closed) return;
    this.#closed = true;
    for (const r of this.#pinned.values()) GpuMultiplier.#release(r);
    this.#pinned.clear();
  }
}
