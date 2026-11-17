// Link flags for a Node add-on (on macOS, `-undefined dynamic_lookup` for the N-API symbols Node provides).
fn main() {
    napi_build::setup();
}
