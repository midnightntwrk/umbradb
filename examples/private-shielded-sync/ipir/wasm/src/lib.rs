//! The wallet's IPIR+SP as WebAssembly (`../pss-ipir.wasm`, built by `../build.sh wasm`; wrapper `../wallet.ts`).
//!
//! No wasm-bindgen: C-ABI exports over linear memory, and one import, `env.fill_random(ptr, len)`, which the host
//! must answer from its cryptographic source (`crypto.getRandomValues`). Every request draws its secret through it
//! (FR-032). The upstream crates also draw from it when they build NTT tables (spiral-rs's primitive-root search), so
//! it must work even for calls that make no request.
//!
//! Exports (lengths in bytes; a 0 handle or a -1 status means failure, and `error_ptr`/`error_len` give the message):
//!
//! | export | does |
//! |---|---|
//! | `alloc(len) → ptr`, `dealloc(ptr, len)` | memory for inputs and outputs |
//! | `request_bytes(rows)`, `response_bytes(cols)`, `masks_bytes(cols)` | the profile's lengths |
//! | `client_new(rows, cols, seed, snapshot, masks, masks_len) → client` | expand the setup, load and cache the masks |
//! | `request_new(client, row, out, out_len) → state` | a request for `row` with a fresh secret, written to `out` |
//! | `decode(client, state, answer, answer_len, out, out_len) → status` | the row's cells, `u16` little-endian, to `out` |
//! | `request_free(state)`, `client_free(client)` | release |
//! | `error_ptr()`, `error_len()` | the last failure's message (UTF-8) |
//!
//! A panic aborts (the build's `wasm` profile): the call traps, and the instance must not be used again.

use pss_ipir_core::{Client, RequestState, TableSetup, profile};
use std::sync::Mutex;

#[cfg(all(target_arch = "wasm32", target_os = "unknown"))]
mod entropy {
    #[link(wasm_import_module = "env")]
    unsafe extern "C" {
        /// Fills `len` bytes at `dest` from the host's cryptographic source.
        fn fill_random(dest: *mut u8, len: usize);
    }

    // getrandom 0.2 (rand 0.8 and the crates on it, spiral-rs's primitive-root search included).
    fn host(dest: &mut [u8]) -> Result<(), getrandom02::Error> {
        unsafe { fill_random(dest.as_mut_ptr(), dest.len()) };
        Ok(())
    }
    getrandom02::register_custom_getrandom!(host);

    // getrandom 0.3 (rand 0.9's OsRng: the secret of each request), selected by `--cfg getrandom_backend="custom"`.
    #[unsafe(no_mangle)]
    unsafe extern "Rust" fn __getrandom_v03_custom(dest: *mut u8, len: usize) -> Result<(), getrandom03::Error> {
        unsafe { fill_random(dest, len) };
        Ok(())
    }
}

static LAST_ERROR: Mutex<String> = Mutex::new(String::new());

fn fail(message: impl ToString) {
    *LAST_ERROR.lock().unwrap_or_else(|e| e.into_inner()) = message.to_string();
}

/// # Safety
/// `ptr` must address `len` readable bytes (or `len` must be 0).
unsafe fn input<'a>(ptr: *const u8, len: u32) -> &'a [u8] {
    if len == 0 {
        &[]
    } else {
        unsafe { std::slice::from_raw_parts(ptr, len as usize) }
    }
}

/// # Safety
/// `ptr` must address 32 readable bytes.
unsafe fn bytes32(ptr: *const u8) -> [u8; 32] {
    unsafe { input(ptr, 32) }.try_into().unwrap()
}

/// Reserves `len` bytes and returns their address (8-byte aligned). Freed only by `dealloc`.
#[unsafe(no_mangle)]
pub extern "C" fn alloc(len: u32) -> *mut u8 {
    let words = (len as usize).div_ceil(8).max(1);
    let mut v = Vec::<u64>::with_capacity(words);
    let p = v.as_mut_ptr() as *mut u8;
    std::mem::forget(v);
    p
}

/// Releases `len` bytes at `ptr`, as returned by `alloc(len)`.
///
/// # Safety
/// `ptr` and `len` must come from one `alloc` call, and the bytes must not be used afterwards.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn dealloc(ptr: *mut u8, len: u32) {
    let words = (len as usize).div_ceil(8).max(1);
    unsafe { drop(Vec::<u64>::from_raw_parts(ptr as *mut u64, 0, words)) };
}

#[unsafe(no_mangle)]
pub extern "C" fn request_bytes(rows: u32) -> u32 {
    profile::request_bytes(rows as usize) as u32
}

#[unsafe(no_mangle)]
pub extern "C" fn response_bytes(cols: u32) -> u32 {
    profile::response_bytes(cols as usize) as u32
}

#[unsafe(no_mangle)]
pub extern "C" fn masks_bytes(cols: u32) -> u32 {
    profile::masks_bytes(cols as usize) as u32
}

/// Expands a table's setup from its shape, seed and snapshot digest, and loads its published masks. Returns the
/// client, or 0.
///
/// # Safety
/// `seed` and `snapshot` address 32 bytes each; `masks` addresses `masks_len` bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn client_new(
    rows: u32,
    cols: u32,
    seed: *const u8,
    snapshot: *const u8,
    masks: *const u8,
    masks_len: u32,
) -> *mut Client {
    let (seed, snapshot, masks) = unsafe { (bytes32(seed), bytes32(snapshot), input(masks, masks_len)) };
    match TableSetup::new(rows as usize, cols as usize, seed, snapshot).and_then(|setup| Client::new(setup, masks)) {
        Ok(client) => Box::into_raw(Box::new(client)),
        Err(e) => {
            fail(e);
            std::ptr::null_mut()
        }
    }
}

/// # Safety
/// `client` comes from `client_new` and is not used afterwards.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn client_free(client: *mut Client) {
    if !client.is_null() {
        drop(unsafe { Box::from_raw(client) });
    }
}

/// Makes a request for `row` with a fresh secret and writes its bytes to `out`, which must hold exactly
/// `request_bytes(rows)`. Returns the request's state, or 0.
///
/// # Safety
/// `client` comes from `client_new`; `out` addresses `out_len` writable bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn request_new(client: *const Client, row: u32, out: *mut u8, out_len: u32) -> *mut RequestState {
    let client = unsafe { &*client };
    if out_len as usize != client.setup().request_bytes() {
        fail(format!(
            "a request to this table is {} bytes, the buffer is {out_len}",
            client.setup().request_bytes()
        ));
        return std::ptr::null_mut();
    }
    match client.request(row as usize) {
        Ok(state) => {
            unsafe { std::slice::from_raw_parts_mut(out, out_len as usize) }.copy_from_slice(state.bytes());
            Box::into_raw(Box::new(state))
        }
        Err(e) => {
            fail(e);
            std::ptr::null_mut()
        }
    }
}

/// # Safety
/// `state` comes from `request_new` and is not used afterwards.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn request_free(state: *mut RequestState) {
    if !state.is_null() {
        drop(unsafe { Box::from_raw(state) });
    }
}

/// Decodes the answer to `state`'s request and writes the row's cells to `out` (`2 × cols` bytes, `u16`
/// little-endian). Returns 0, or -1.
///
/// # Safety
/// `client` and `state` come from `client_new` and `request_new` (with this client); `answer` addresses `answer_len`
/// bytes; `out` addresses `out_len` writable bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn decode(
    client: *const Client,
    state: *const RequestState,
    answer: *const u8,
    answer_len: u32,
    out: *mut u8,
    out_len: u32,
) -> i32 {
    let (client, state) = unsafe { (&*client, &*state) };
    let cols = client.setup().cols();
    if out_len as usize != 2 * cols {
        fail(format!(
            "a row of this table is {} bytes, the buffer is {out_len}",
            2 * cols
        ));
        return -1;
    }
    match client.decode(state, unsafe { input(answer, answer_len) }) {
        Ok(row) => {
            let out = unsafe { std::slice::from_raw_parts_mut(out, out_len as usize) };
            for (dst, cell) in out.chunks_exact_mut(2).zip(row) {
                dst.copy_from_slice(&cell.to_le_bytes());
            }
            0
        }
        Err(e) => {
            fail(e);
            -1
        }
    }
}

/// Address of the last failure's message.
#[unsafe(no_mangle)]
pub extern "C" fn error_ptr() -> *const u8 {
    LAST_ERROR.lock().unwrap_or_else(|e| e.into_inner()).as_ptr()
}

/// Length of the last failure's message.
#[unsafe(no_mangle)]
pub extern "C" fn error_len() -> u32 {
    LAST_ERROR.lock().unwrap_or_else(|e| e.into_inner()).len() as u32
}
