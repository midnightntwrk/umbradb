#!/usr/bin/env bash
# Builds one vendored ledger package inside the build image (vendor/ledger/Dockerfile).
#
#   /in   the version directory, read-only: upstream.json and patches/*.patch
#   /out  an empty directory that receives the built package
#
# Steps: fetch the pinned upstream commit, apply the patches in file-name order, build the WASM
# crate with the `wasm` profile for wasm32-unknown-unknown (`cargo --locked`), then produce the
# package the way upstream's own release recipe does (midnight-ledger bagel.nix): wasm-bindgen
# `--target bundler`, `wasm-opt -Os`, the hand-written TypeScript declarations assembled from the
# template, a Node.js entry that instantiates the module from the file next to it, and a
# package.json. Every path inside the container is fixed, so paths embedded in the WASM are the
# same on every host.
set -euo pipefail

config=/in/upstream.json
field() { jq -er "$1" "$config"; }

repository=$(field .repository)
commit=$(field .commit)
crate=$(field .build.crate)
wasm_bindgen_version=$(field .build.wasmBindgen)
dts_template=$(field .build.dtsTemplate)
dts_name=$(field .build.dtsName)
package_name=$(field .package.name)
package_version=$(field .package.version)

if [ -n "$(ls -A /out)" ]; then
  echo "build: /out must be empty" >&2
  exit 1
fi

src=/build/src
git init -q "$src"
git -C "$src" fetch -q --depth 1 "$repository" "$commit"
git -C "$src" -c advice.detachedHead=false checkout -q FETCH_HEAD
if [ "$(git -C "$src" rev-parse HEAD)" != "$commit" ]; then
  echo "build: fetched $(git -C "$src" rev-parse HEAD), expected $commit" >&2
  exit 1
fi

shopt -s nullglob
for patch in /in/patches/*.patch; do
  echo "build: applying $(basename "$patch")"
  git -C "$src" apply --whitespace=nowarn "$patch"
done
shopt -u nullglob

# Cargo derives each crate's `-C metadata`, which rustc folds into every symbol name, from `rustc -vV` among other
# things, and its `host:` line names the build machine: the same sources gave other symbol names, and other bytes, on
# amd64 than on arm64 (PR #16's first CI run). This wrapper gives each crate a metadata hashed from its own package
# and arguments instead, Cargo's 16-digit hashes masked, so every host builds the same. Two crates given the same
# value would make rustc refuse the build, never build something else.
wrapper=/build/rustc-wrapper.sh
cat > "$wrapper" <<'WRAPPER'
#!/usr/bin/env bash
set -euo pipefail
rustc=$1
shift
args=("$@")
at=""
for i in "${!args[@]}"; do
  case "${args[$i]}" in
    -Cmetadata=*) at=$i ;;
    metadata=*) if [ "$i" -gt 0 ] && [ "${args[$((i - 1))]}" = "-C" ]; then at=$i; fi ;;
  esac
done
if [ -z "$at" ]; then
  exec "$rustc" "${args[@]}"
fi
key=$(printf '%s\n' "${CARGO_PKG_NAME:-}" "${CARGO_PKG_VERSION:-}" "${CARGO_MANIFEST_DIR:-}" "${args[@]}" \
  | grep -vE '^(-C)?metadata=' | sed -E 's/-[0-9a-f]{16}([^0-9a-f]|$)/-H\1/g' | sha256sum | cut -c1-16)
case "${args[$at]}" in
  -C*) args[$at]="-Cmetadata=$key" ;;
  *) args[$at]="metadata=$key" ;;
esac
exec "$rustc" "${args[@]}"
WRAPPER
chmod +x "$wrapper"

cd "$src"
RUSTC_WRAPPER="$wrapper" cargo build --locked --profile wasm --target wasm32-unknown-unknown -p "$crate"

lib=${crate//-/_}
raw="$CARGO_TARGET_DIR/wasm32-unknown-unknown/wasm/$lib.wasm"
pkg=/build/pkg
"/opt/wasm-bindgen-$wasm_bindgen_version/bin/wasm-bindgen" "$raw" --out-dir "$pkg" --target bundler \
  --omit-default-module-path --weak-refs --reference-types --no-typescript
wasm-opt "$pkg/${lib}_bg.wasm" -Os --enable-reference-types -o "$pkg/${lib}_bg.wasm"

# TypeScript declarations: the template's only directive is its first line, which inlines the
# onchain-runtime declarations (`<% print(fs.readFileSync('<path>', 'utf8')); %>`).
template="$src/$dts_template"
include=$(sed -n "1s/^<% print(fs.readFileSync('\(.*\)', 'utf8')); %>\$/\1/p" "$template")
if [ -z "$include" ] || [ "$(grep -c '<%' "$template")" != 1 ]; then
  echo "build: unexpected template directives in $dts_template" >&2
  exit 1
fi
{
  cat "$(dirname "$template")/$include"
  printf '\n'
  tail -n +2 "$template"
} > "$pkg/$dts_name"
dts_module=${dts_name%.d.ts}
printf 'export * from "./%s.js";\n' "$dts_module" > "$pkg/${lib}.d.ts"
printf 'export * from "./%s.js";\n' "$dts_module" > "$pkg/${lib}_fs.d.ts"

# The Node.js entry: instantiate the module synchronously from the file next to it. The snippets
# wasm-bindgen emits import the package's own entry as `#self` (package.json `imports`).
snippet_imports=""
if [ -d "$pkg/snippets" ]; then
  while IFS= read -r snippet; do
    name=$(printf '%s' "$snippet" | sed -e 's/[-\/.]/_/g')
    snippet_imports+="import * as $name from './$snippet';"$'\n'
    snippet_imports+="imports['./$snippet'] = $name;"$'\n'
  done < <(cd "$pkg" && find snippets -type f -name '*.js' | LC_ALL=C sort)
fi
{
  cat <<EOF
export * from "./${lib}_bg.js";
import * as exports from "./${lib}_bg.js";
import { __wbg_set_wasm } from "./${lib}_bg.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const imports = {};
imports["./${lib}_bg.js"] = exports;
EOF
  printf '%s' "$snippet_imports"
  cat <<EOF

const wasmPath = join(dirname(fileURLToPath(import.meta.url)), "${lib}_bg.wasm");
const wasmModule = new WebAssembly.Module(readFileSync(wasmPath));
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
const wasm = wasmInstance.exports;
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
EOF
} > "$pkg/${lib}_fs.js"

jq -n \
  --arg name "$package_name" \
  --arg version "$package_version" \
  --arg lib "$lib" \
  --arg dts "$dts_name" \
  --argjson upstream "$(jq -c '{repository, commit, versionName}' "$config")" \
  '{
    name: $name,
    version: $version,
    private: true,
    type: "module",
    description: "Vendored midnight-ledger WASM build for UmbraDB (vendor/ledger, design.md §5.2)",
    upstream: $upstream,
    imports: {
      "#self": { browser: ("./" + $lib + ".js"), node: ("./" + $lib + "_fs.js") }
    },
    types: ("./" + $dts),
    exports: {
      types: ("./" + $dts),
      browser: ("./" + $lib + ".js"),
      node: ("./" + $lib + "_fs.js")
    },
    sideEffects: [("./" + $lib + ".js"), ("./" + $lib + "_fs.js"), "./snippets/*"],
    license: "Apache-2.0"
  }' > "$pkg/package.json"

cp -R "$pkg/." /out/
if [ -n "${HOST_UID:-}" ]; then
  chown -R "$HOST_UID:$HOST_GID" /out
fi
echo "build: $(cd /out && find . -type f | LC_ALL=C sort | tr '\n' ' ')"
