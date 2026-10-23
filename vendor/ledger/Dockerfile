# Build image for the vendored ledger packages (openspec/changes/core-arch/design.md §5.2).
#
# Everything that goes into a vendored build is pinned here, so that two builds from the same
# upstream commit and patches give the same bytes:
#   - the Rust toolchain: rust:1.98.1-slim-bookworm, pinned by its multi-architecture index
#     digest (each host runs that index's native variant of the same release; 1.98.1 is the
#     channel of midnight-node 2.1.0-rc.4's rust-toolchain.toml);
#   - the C toolchain the `blst` crate needs for wasm32 (clang 14 and llvm-ar 14), plus git, jq and
#     curl, at exact versions from the Debian snapshot the base image was built from (the
#     snapshot date is the one named in the base image's own apt sources);
#   - wasm-bindgen-cli 0.2.108, the version ledger-9.1.0.0-rc.5's Cargo.lock pins and the v8 patches move
#     ledger-8.1.2 to (0.2.104, which ledger-8.1.2 pins, numbers its generated adapters differently from run
#     to run on the same input), built with `cargo install --locked`;
#   - binaryen (wasm-opt) version_133, the release tarball checked against its SHA-256.
# The image is built from this file alone (no build context). See vendor/ledger/README.md.
FROM rust@sha256:ff521445a372125ed4f76e1453a1f8098f2d05332d1601d30db1c1f62757e730

RUN set -eux; \
    sed -i \
      -e 's|^URIs: http://deb.debian.org/debian$|URIs: http://snapshot.debian.org/archive/debian/20260918T000000Z|' \
      -e 's|^URIs: http://deb.debian.org/debian-security$|URIs: http://snapshot.debian.org/archive/debian-security/20260918T000000Z|' \
      /etc/apt/sources.list.d/debian.sources; \
    grep -q 'snapshot.debian.org/archive/debian/20260918T000000Z' /etc/apt/sources.list.d/debian.sources; \
    apt-get -o Acquire::Check-Valid-Until=false update; \
    apt-get install -y --no-install-recommends \
      clang-14=1:14.0.6-12 \
      llvm-14=1:14.0.6-12 \
      git=1:2.39.5-0+deb12u3 \
      jq=1.6-2.1+deb12u2 \
      curl=7.88.1-10+deb12u15; \
    rm -rf /var/lib/apt/lists/*

RUN rustup target add wasm32-unknown-unknown

RUN set -eux; \
    cargo install --locked --root /opt/wasm-bindgen-0.2.108 wasm-bindgen-cli --version 0.2.108; \
    rm -rf /usr/local/cargo/registry /usr/local/cargo/git

RUN set -eux; \
    case "$(uname -m)" in \
      x86_64) arch=x86_64; sha256=2dc9c7813f5375db93d96ead4b78222fcc3e2677bbb832297af4797782a37489 ;; \
      aarch64) arch=aarch64; sha256=89c07ea56faf38d0fbecf36ca8ec0721756716185f265b568e133d427f299bf8 ;; \
      *) echo "unsupported build host architecture: $(uname -m)" >&2; exit 1 ;; \
    esac; \
    curl -fsSL -o /tmp/binaryen.tar.gz \
      "https://github.com/WebAssembly/binaryen/releases/download/version_133/binaryen-version_133-$arch-linux.tar.gz"; \
    echo "$sha256  /tmp/binaryen.tar.gz" | sha256sum -c -; \
    mkdir -p /opt/binaryen; \
    tar -xzf /tmp/binaryen.tar.gz -C /opt/binaryen --strip-components=1; \
    rm /tmp/binaryen.tar.gz; \
    /opt/binaryen/bin/wasm-opt --version

ENV CC_wasm32_unknown_unknown=clang-14 \
    AR_wasm32_unknown_unknown=llvm-ar-14 \
    CARGO_HOME=/build/cargo \
    CARGO_TARGET_DIR=/build/target \
    CARGO_INCREMENTAL=0 \
    PATH=/opt/binaryen/bin:/usr/local/cargo/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
