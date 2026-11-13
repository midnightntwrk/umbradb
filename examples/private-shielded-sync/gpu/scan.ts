/**
 * The ownership test on the GPU (spec story 7), behind the scan interface of the CPU kernel's worker pool
 * (`kernel/scan-pool.ts`, `ScanPool`): `scan(entries, secret)` gives the positions that are the key's, ascending, and
 * `scanValues(entries, secret)` the 32-byte value each entry's test compares. Inputs, outputs and refusals are the
 * CPU kernel's (`kernel/src/lib.rs`):
 *
 * - entries are 36 bytes each (compressed point, then element 0's first 4 bytes); the secret is the encryption secret
 *   key's scalar, 32 bytes little-endian, below the Jubjub subgroup order (otherwise refused, as the kernel's -1);
 * - an all-zero entry, or a point that does not decode, has the value zero and never matches;
 * - a match needs the 4 bytes to equal the value's and the point to pass the ledger's check (prime-order subgroup, not
 *   the identity; FR-103), which runs on the GPU over the 4-byte matches only.
 *
 * Imports no Node module, so it runs in a browser and in Deno. The secret sits in uniform buffers of the local GPU
 * while a call runs; they are overwritten with zeros when it ends.
 */

import { compileShader, TimestampSpan, writeView } from "./device.ts";
import { constantTable, JUBJUB_R, type PoseidonConstants, words } from "./field.ts";
import { ENTRY_WORDS, OUT_WORDS, PARAMS_BYTES, scanWgsl, STATE_WORDS } from "./scan-wgsl.ts";
import type { Scanner } from "./scanner.ts";

/** Bytes of one scan entry. */
export const ENTRY_BYTES = 36;
/** Bits of a scalar below 2^252 (the secret, and the subgroup order r). */
const SCALAR_BITS = 252;
const WORKGROUP = 64;
/** The largest dispatch along one dimension (WebGPU's default `maxComputeWorkgroupsPerDimension`). */
const MAX_GROUPS = 65535;

export interface GpuScanOptions {
  /** Entries per GPU batch (working state is 564 bytes per entry): by default 65,536 (37 MB of state). */
  readonly batch?: number;
  /** Ladder steps per dispatch: by default 36 (seven dispatches for 252 bits). */
  readonly bitsPerPass?: number;
  /** Measure the GPU's execution time of each call (`lastGpuMs`), if the device has `timestamp-query`. */
  readonly timestamps?: boolean;
}

interface PassSet {
  readonly uniforms: GPUBuffer[];
  readonly groups: GPUBindGroup[];
}

interface Pipelines {
  readonly decompress: GPUComputePipeline;
  readonly ladder: GPUComputePipeline;
  readonly finish: GPUComputePipeline;
  readonly torsion: GPUComputePipeline;
}

interface Buffers {
  readonly capacity: number;
  readonly entries: GPUBuffer;
  readonly state: GPUBuffer;
  readonly out: GPUBuffer;
  readonly staging: GPUBuffer;
}

function scalarOf(secret: Uint8Array): bigint {
  let v = 0n;
  for (let i = secret.length - 1; i >= 0; i--) v = (v << 8n) | BigInt(secret[i]!);
  return v;
}

function checkEntries(entries: Uint8Array): number {
  const count = entries.length / ENTRY_BYTES;
  if (!Number.isInteger(count)) throw new Error("scan entries must be a whole number of 36-byte entries");
  return count;
}

/** The secret's scalar as eight words; throws as the kernel does for a wrong length or a non-canonical scalar. */
function secretWords(secret: Uint8Array, what: string): number[] {
  if (secret.length !== 32) throw new Error(`secret must be 32 bytes, got ${secret.length}`);
  const s = scalarOf(secret);
  if (s >= JUBJUB_R) throw new Error(`${what}: the secret is not a canonical scalar`);
  return words(s);
}

export class GpuScanner implements Scanner {
  readonly #device: GPUDevice;
  readonly #layout: GPUBindGroupLayout;
  readonly #pipe: Pipelines;
  readonly #consts: GPUBuffer;
  readonly #passes: readonly { top: number; nbits: number }[];
  readonly #batch: number;
  readonly #timestamps: boolean;
  #main: { buffers: Buffers; secret: PassSet } | undefined;
  #closed = false;
  /** The current call's summed execution time; null once a span could not be measured. */
  #gpuMs: number | null = 0;
  /**
   * The GPU's execution time of the last call's dispatches (summed over its batches and the subgroup check), from
   * timestamp queries; null without the `timestamps` option or the device feature.
   */
  lastGpuMs: number | null = null;
  /** Calls run one after another: they share the buffers. */
  #queue: Promise<unknown> = Promise.resolve();

  private constructor(
    device: GPUDevice,
    layout: GPUBindGroupLayout,
    pipe: Pipelines,
    consts: GPUBuffer,
    batch: number,
    bitsPerPass: number,
    timestamps: boolean,
  ) {
    this.#device = device;
    this.#timestamps = timestamps;
    this.#layout = layout;
    this.#pipe = pipe;
    this.#consts = consts;
    this.#batch = batch;
    const passes: { top: number; nbits: number }[] = [];
    for (let top = SCALAR_BITS - 1; top >= 0; top -= bitsPerPass) passes.push({ top, nbits: Math.min(bitsPerPass, top + 1) });
    this.#passes = passes;
  }

  /** Compiles the shader and uploads the constants (Poseidon's, from `test/fixtures/poseidon-constants.json`). */
  static async create(device: GPUDevice, poseidon: PoseidonConstants, options: GpuScanOptions = {}): Promise<GpuScanner> {
    const batch = options.batch ?? 65536;
    const bitsPerPass = options.bitsPerPass ?? 36;
    if (!Number.isInteger(batch) || batch < 1 || Math.ceil(batch / WORKGROUP) > MAX_GROUPS) {
      throw new Error(`batch must be 1 … ${MAX_GROUPS * WORKGROUP}: ${batch}`);
    }
    if (!Number.isInteger(bitsPerPass) || bitsPerPass < 1 || bitsPerPass > SCALAR_BITS) {
      throw new Error(`bitsPerPass must be 1 … ${SCALAR_BITS}: ${bitsPerPass}`);
    }
    const module = await compileShader(device, scanWgsl(), "ownership test");
    const C = GPUShaderStage.COMPUTE;
    const layout = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: C, buffer: { type: "read-only-storage" } },
        { binding: 1, visibility: C, buffer: { type: "storage" } },
        { binding: 2, visibility: C, buffer: { type: "storage" } },
        { binding: 3, visibility: C, buffer: { type: "read-only-storage" } },
        { binding: 4, visibility: C, buffer: { type: "uniform" } },
      ],
    });
    const pl = device.createPipelineLayout({ bindGroupLayouts: [layout] });
    const make = (entryPoint: string) => device.createComputePipelineAsync({ layout: pl, compute: { module, entryPoint } });
    const [decompress, ladder, finish, torsion] = await Promise.all([
      make("decompress"),
      make("ladder"),
      make("finish"),
      make("torsion"),
    ]);
    const table = constantTable(poseidon);
    const consts = device.createBuffer({ size: table.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    writeView(device, consts, 0, table);
    const timestamps = (options.timestamps ?? false) && TimestampSpan.available(device);
    const pipe = { decompress: decompress!, ladder: ladder!, finish: finish!, torsion: torsion! };
    return new GpuScanner(device, layout, pipe, consts, batch, bitsPerPass, timestamps);
  }

  #buffers(capacity: number): Buffers {
    const U = GPUBufferUsage;
    const d = this.#device;
    return {
      capacity,
      entries: d.createBuffer({ size: capacity * ENTRY_WORDS * 4, usage: U.STORAGE | U.COPY_DST }),
      state: d.createBuffer({ size: capacity * STATE_WORDS * 4, usage: U.STORAGE }),
      out: d.createBuffer({ size: capacity * OUT_WORDS * 4, usage: U.STORAGE | U.COPY_SRC }),
      staging: d.createBuffer({ size: capacity * OUT_WORDS * 4, usage: U.MAP_READ | U.COPY_DST }),
    };
  }

  #passSet(buffers: Buffers): PassSet {
    const uniforms = this.#passes.map(() =>
      this.#device.createBuffer({ size: PARAMS_BYTES, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }),
    );
    const groups = uniforms.map((u) =>
      this.#device.createBindGroup({
        layout: this.#layout,
        entries: [buffers.entries, buffers.state, buffers.out, this.#consts, u].map((buffer, binding) => ({
          binding,
          resource: { buffer },
        })),
      }),
    );
    return { uniforms, groups };
  }

  static #destroy(b: Buffers, p: PassSet): void {
    for (const x of [b.entries, b.state, b.out, b.staging, ...p.uniforms]) x.destroy();
  }

  /** Writes the scalar, the pass's bit range and the entry count into each pass's uniform. */
  #params(set: PassSet, scalar: readonly number[], n: number): void {
    this.#passes.forEach(({ top, nbits }, i) => {
      this.#device.queue.writeBuffer(set.uniforms[i]!, 0, new Uint32Array([...scalar, top, nbits, n, 0]));
    });
  }

  #wipe(set: PassSet): void {
    for (const u of set.uniforms) this.#device.queue.writeBuffer(u, 0, new Uint32Array(PARAMS_BYTES / 4));
  }

  #dispatch(
    enc: GPUCommandEncoder,
    pipeline: GPUComputePipeline,
    group: GPUBindGroup,
    n: number,
    timestampWrites?: GPUComputePassTimestampWrites,
  ): void {
    const pass = enc.beginComputePass(timestampWrites ? { timestampWrites } : {});
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, group);
    pass.dispatchWorkgroups(Math.ceil(n / WORKGROUP));
    pass.end();
  }

  /**
   * Runs decompress, the ladder and `last` over `n` entries already in `b.entries`, then reads the outputs back. Each
   * stage is its own submission, so no single submission runs long.
   */
  async #run(b: Buffers, set: PassSet, n: number, last: GPUComputePipeline): Promise<Uint32Array> {
    const d = this.#device;
    const span = this.#timestamps ? new TimestampSpan(d) : null;
    const submit = (pipeline: GPUComputePipeline, group: GPUBindGroup, writes?: GPUComputePassTimestampWrites) => {
      const enc = d.createCommandEncoder();
      this.#dispatch(enc, pipeline, group, n, writes);
      d.queue.submit([enc.finish()]);
    };
    submit(this.#pipe.decompress, set.groups[0]!, span?.begin);
    for (const g of set.groups) submit(this.#pipe.ladder, g);
    submit(last, set.groups[0]!, span?.end);
    const enc = d.createCommandEncoder();
    const bytes = n * OUT_WORDS * 4;
    enc.copyBufferToBuffer(b.out, 0, b.staging, 0, bytes);
    span?.resolve(enc);
    d.queue.submit([enc.finish()]);
    await Promise.all([b.staging.mapAsync(GPUMapMode.READ, 0, bytes), span?.map()]);
    const out = new Uint32Array(b.staging.getMappedRange(0, bytes).slice(0));
    b.staging.unmap();
    if (span) {
      const ms = span.ms();
      this.#gpuMs = ms === null || this.#gpuMs === null ? null : this.#gpuMs + ms;
    }
    return out;
  }

  #serial<T>(work: () => Promise<T>): Promise<T> {
    const next = this.#queue.then(work, work);
    this.#queue = next.catch(() => undefined);
    return next;
  }

  /**
   * Values and candidate flags of every entry, batch by batch. `onBatch` gets each batch's first entry index and its
   * outputs (OUT_WORDS words per entry).
   */
  async #values(entries: Uint8Array, scalar: readonly number[], onBatch: (first: number, out: Uint32Array) => void): Promise<void> {
    const count = entries.length / ENTRY_BYTES;
    const batches = Math.ceil(count / this.#batch);
    const size = Math.ceil(count / batches);
    this.#main ??= (() => {
      const buffers = this.#buffers(this.#batch);
      return { buffers, secret: this.#passSet(buffers) };
    })();
    const { buffers, secret } = this.#main;
    try {
      for (let first = 0; first < count; first += size) {
        const n = Math.min(size, count - first);
        writeView(this.#device, buffers.entries, 0, entries.subarray(first * ENTRY_BYTES, (first + n) * ENTRY_BYTES));
        this.#params(secret, scalar, n);
        onBatch(first, await this.#run(buffers, secret, n, this.#pipe.finish));
      }
    } finally {
      this.#wipe(secret);
    }
  }

  /** The ledger's point check (prime-order subgroup, not the identity) of the given entries, on the GPU. */
  async #inSubgroup(entries: Uint8Array, indices: readonly number[]): Promise<boolean[]> {
    const n = indices.length;
    const buffers = this.#buffers(n);
    const set = this.#passSet(buffers);
    try {
      const picked = new Uint8Array(n * ENTRY_BYTES);
      indices.forEach((i, k) => picked.set(entries.subarray(i * ENTRY_BYTES, (i + 1) * ENTRY_BYTES), k * ENTRY_BYTES));
      writeView(this.#device, buffers.entries, 0, picked);
      this.#params(set, words(JUBJUB_R), n);
      const out = await this.#run(buffers, set, n, this.#pipe.torsion);
      return indices.map((_, k) => out[k * OUT_WORDS + 8] === 1);
    } finally {
      GpuScanner.#destroy(buffers, set);
    }
  }

  /** The positions (indices into `entries`) that pass the ownership test, ascending. */
  scan(entries: Uint8Array, secret: Uint8Array): Promise<number[]> {
    return this.#serial(async () => {
      this.#open();
      this.#gpuMs = 0;
      this.lastGpuMs = null;
      const count = checkEntries(entries);
      const scalar = secretWords(secret, "scan");
      if (count === 0) return [];
      const candidates: number[] = [];
      await this.#values(entries, scalar, (first, out) => {
        const n = out.length / OUT_WORDS;
        for (let k = 0; k < n; k++) if (out[k * OUT_WORDS + 8] === 1) candidates.push(first + k);
      });
      const ok = candidates.length === 0 ? [] : await this.#inSubgroup(entries, candidates);
      if (this.#timestamps) this.lastGpuMs = this.#gpuMs;
      return candidates.filter((_, k) => ok[k]);
    });
  }

  /** For each entry, the 32-byte value the ownership test compares (zero for an all-zero entry or a bad point). */
  scanValues(entries: Uint8Array, secret: Uint8Array): Promise<Uint8Array> {
    return this.#serial(async () => {
      this.#open();
      this.#gpuMs = 0;
      this.lastGpuMs = null;
      const count = checkEntries(entries);
      const scalar = secretWords(secret, "scan_values");
      const result = new Uint8Array(count * 32);
      if (count === 0) return result;
      const view = new Uint32Array(result.buffer);
      await this.#values(entries, scalar, (first, out) => {
        const n = out.length / OUT_WORDS;
        for (let k = 0; k < n; k++) view.set(out.subarray(k * OUT_WORDS, k * OUT_WORDS + 8), (first + k) * 8);
      });
      if (this.#timestamps) this.lastGpuMs = this.#gpuMs;
      return result;
    });
  }

  #open(): void {
    if (this.#closed) throw new Error("the GPU scanner is closed");
  }

  /** Releases the GPU buffers. The device stays open (it belongs to the caller). */
  close(): Promise<void> {
    return this.#serial(async () => {
      if (this.#closed) return;
      this.#closed = true;
      if (this.#main) GpuScanner.#destroy(this.#main.buffers, this.#main.secret);
      this.#main = undefined;
      this.#consts.destroy();
    });
  }
}
