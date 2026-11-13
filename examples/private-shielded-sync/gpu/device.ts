/**
 * Opening a WebGPU device for the GPU kernels. WebGPU exists in browsers and in Deno, not in Node: in a runtime
 * without it `openGpu` answers null and the caller keeps the CPU kernels (`kernel/ScanPool`, `pir/WorkerMultiplier`).
 */

export interface Gpu {
  readonly device: GPUDevice;
  /** The adapter's description (vendor, architecture, device), for results files. */
  readonly description: string;
}

/**
 * Requests a high-performance adapter and a device with the adapter's largest storage-buffer and buffer sizes (the
 * WebGPU defaults are 128 MiB and 256 MiB) and, if the adapter has it, the `timestamp-query` feature. Null when the
 * runtime has no WebGPU or no adapter.
 */
export async function openGpu(): Promise<Gpu | null> {
  const gpu = (globalThis.navigator as Navigator | undefined)?.gpu;
  if (!gpu) return null;
  const adapter = await gpu.requestAdapter({ powerPreference: "high-performance" });
  if (!adapter) return null;
  const device = await adapter.requestDevice({
    // Timestamp queries let the kernels report the GPU's own execution time (`timestamps` option); optional.
    requiredFeatures: adapter.features.has("timestamp-query") ? ["timestamp-query"] : [],
    requiredLimits: {
      maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
      maxBufferSize: adapter.limits.maxBufferSize,
    },
  });
  const info = adapter.info;
  const description = [info.vendor, info.architecture, info.device, info.description]
    .filter((s) => s && s !== "0")
    .join(" ")
    .trim();
  return { device, description: description || "unknown adapter" };
}

/** Compiles WGSL and fails with the compiler's first error message, if any. */
export async function compileShader(device: GPUDevice, code: string, label: string): Promise<GPUShaderModule> {
  const module = device.createShaderModule({ code, label });
  const info = await module.getCompilationInfo();
  const error = info.messages.find((m) => m.type === "error");
  if (error) throw new Error(`${label}: WGSL error at line ${error.lineNum}: ${error.message}`);
  return module;
}

/** Copies `size` bytes of a GPU buffer back to the host. */
export async function readBack(device: GPUDevice, source: GPUBuffer, size: number): Promise<ArrayBuffer> {
  const staging = device.createBuffer({ size, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
  try {
    const enc = device.createCommandEncoder();
    enc.copyBufferToBuffer(source, 0, staging, 0, size);
    device.queue.submit([enc.finish()]);
    await staging.mapAsync(GPUMapMode.READ);
    return staging.getMappedRange().slice(0);
  } finally {
    staging.destroy();
  }
}

/**
 * `queue.writeBuffer` of a view's bytes. WebGPU accepts views of a `SharedArrayBuffer` (`AllowSharedBufferSource`) and
 * Deno does at run time, but Deno's type declarations name `BufferSource`, hence the cast. (Deno refuses a bare
 * `ArrayBuffer` with offsets at run time, so only views are passed.)
 */
export function writeView(device: GPUDevice, buffer: GPUBuffer, offset: number, view: ArrayBufferView): void {
  const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  device.queue.writeBuffer(buffer, offset, bytes as Uint8Array<ArrayBuffer>);
}

/** Query sets made per device at most; Metal has a small system-wide pool of counter sample buffers. */
const QUERY_SETS_PER_DEVICE = 8;
const querySets = new WeakMap<GPUDevice, { free: GPUQuerySet[]; made: number }>();

/**
 * The GPU's execution time of a span of compute passes, by two timestamp queries: the first pass of the span writes
 * the start (`begin`), the last one the end (`end`); `resolve` adds the copy to a mappable buffer to the last command
 * encoder; after submission, `map` (awaited with the span's other read-backs) and `ms` read it. Only on a device with
 * the `timestamp-query` feature. For measurement only: no result depends on it.
 *
 * Query sets are reused, not destroyed: Deno 2.7.5 does not free a destroyed query set's Metal counter sample buffer
 * before the object is collected, and after a few dozen spans `createQuerySet` failed ("Cannot allocate sample
 * buffer"), which invalidated the call's command buffer. `open` answers null when the device's
 * `QUERY_SETS_PER_DEVICE` sets are all in use, and that call goes unmeasured.
 */
export class TimestampSpan {
  readonly #pool: { free: GPUQuerySet[]; made: number };
  readonly #querySet: GPUQuerySet;
  readonly #resolved: GPUBuffer;
  readonly #staging: GPUBuffer;
  #released = false;

  private constructor(device: GPUDevice, pool: { free: GPUQuerySet[]; made: number }, querySet: GPUQuerySet) {
    this.#pool = pool;
    this.#querySet = querySet;
    this.#resolved = device.createBuffer({ size: 16, usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC });
    this.#staging = device.createBuffer({ size: 16, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
  }

  static available(device: GPUDevice): boolean {
    return device.features.has("timestamp-query");
  }

  /** A span on a free query set, or null without the feature or when every query set of the device is in use. */
  static open(device: GPUDevice): TimestampSpan | null {
    if (!TimestampSpan.available(device)) return null;
    let pool = querySets.get(device);
    if (pool === undefined) {
      pool = { free: [], made: 0 };
      querySets.set(device, pool);
    }
    let querySet = pool.free.pop();
    if (querySet === undefined) {
      if (pool.made >= QUERY_SETS_PER_DEVICE) return null;
      querySet = device.createQuerySet({ type: "timestamp", count: 2 });
      pool.made += 1;
    }
    return new TimestampSpan(device, pool, querySet);
  }

  get begin(): GPUComputePassTimestampWrites {
    return { querySet: this.#querySet, beginningOfPassWriteIndex: 0 };
  }

  get end(): GPUComputePassTimestampWrites {
    return { querySet: this.#querySet, endOfPassWriteIndex: 1 };
  }

  /** Both ends in one pass (a span of one pass). */
  get both(): GPUComputePassTimestampWrites {
    return { querySet: this.#querySet, beginningOfPassWriteIndex: 0, endOfPassWriteIndex: 1 };
  }

  resolve(enc: GPUCommandEncoder): void {
    enc.resolveQuerySet(this.#querySet, 0, 2, this.#resolved, 0);
    enc.copyBufferToBuffer(this.#resolved, 0, this.#staging, 0, 16);
  }

  map(): Promise<undefined> {
    return this.#staging.mapAsync(GPUMapMode.READ);
  }

  /**
   * Milliseconds between the two timestamps (after `map` resolved), or null if either was not written; releases the
   * span. Deno 2.7.5's WebGPU on Apple silicon leaves the end timestamp of a short pass (about a millisecond or less)
   * unwritten, so short calls report null.
   */
  ms(): number | null {
    const [start, end] = new BigUint64Array(this.#staging.getMappedRange().slice(0));
    this.destroy();
    if (!start || !end || end <= start) return null;
    return Number(end - start) / 1e6;
  }

  /** Returns the query set to the device's pool and frees the buffers; a second call does nothing. */
  destroy(): void {
    if (this.#released) return;
    this.#released = true;
    this.#pool.free.push(this.#querySet);
    this.#resolved.destroy();
    this.#staging.destroy();
  }
}
