#!/usr/bin/env bash
# The undeployed devnet: a local Midnight chain that starts on a ledger-8 runtime, carries our own transactions, enacts
# the governance upgrade to the ledger-9 runtime, carries our own transactions again, and is then recorded as a tape
# (tools/tape/main.ts range) with its genesis and its upgrade boundary (tools/tape/main.ts boundaries). [Q130]
#
# No public network runs ledger v9 from a ledger-8 history, so this is where the v8 -> v9 upgrade and every event and
# outcome kind the core stores are recorded. [A96, A100, LG-9]
#
# It follows the official indexer's rehearsal (midnight-indexer docs/hardfork-devnet-rehearsal-8to9.md,
# qa/scripts/test-hardfork-8to9.sh) and its test-data scripts (generate_node_data.sh): a ledger-8 dev chain-spec from
# midnight-node 1.0.0's build-spec, the 2.1.0 node binary booted on it, ledger-8 traffic with midnight-node-toolkit
# 1.0.0, the federated-governance runtime upgrade to the 2.1.0 runtime WASM (spec_version 1_000_000 -> 2_001_000;
# U is the block whose state first has the new runtime, F = U + 1 the first block it builds), then ledger-9 traffic with
# the 2.1.0 toolkit. Every image is named by its digest; every seed and address is fixed below; the chain-spec's and the
# runtime WASM's SHA-256 are checked. Block hashes still differ from run to run (they hold the blocks' timestamps).
#
# What it sends (each step logged; `attempt` steps may fail without stopping the run, and the record says which did):
#   ledger 8 and again ledger 9 -
#     a shielded and unshielded transfer (Midnight.UnshieldedTokens, TxApplied);
#     the toolkit's simple contract: deploy, call (store), maintenance (ContractDeploy, ContractCall, ContractMaintain);
#     a partial success: two transfers spending one unshielded UTXO, generated from one state and sent together, the
#       first with its unshielded offer guaranteed, the second with three outputs, which the toolkit puts in the
#       fallible segment (more than 3 inputs and outputs), each paying its fee from another wallet's DUST: the first
#       applies, the second's guaranteed part applies and its fallible offer fails (Midnight.TxPartialSuccess);
#     a failed extrinsic: a federated-governance proposal sent by keys that are not council members
#       (System.ExtrinsicFailed, Council::NotMember);
#     a governance system transaction: update-ledger-parameters with the node's own parameters
#       (MidnightSystem.SystemTransactionApplied);
#   ledger 9 only - first, register-dust-address for the three wallets that pay fees: the v8 -> v9 state conversion
#     resets DUST [LG-9], so they have none until registered; the node's own system transactions after the upgrade
#     (the DUST reapply, MidnightSystem.SystemTransactionApplied at F and F + 1) come without any send.
#   with ATTEMPT_BLOCK_LIMIT=1 (default) - a failed Midnight transaction: the ledger's block_usage limit lowered by
#     governance to 6,000 bytes, then two ~3.8 kB transfers sent together; validation dry-runs one transaction alone,
#     so both enter the pool, and the block's fullness is checked when the second applies; then the limit is restored.
#
# Usage: WORK=<dir> [TAPES=<dir>] [PORT=<port>] [KEEP=1] [RECORD=0] [ATTEMPT_BLOCK_LIMIT=0] tools/devnet/devnet.sh
#   from the repository's root (the recording runs tools/tape/main.ts with npx tsx). WORK receives the chain-spec, the
#   runtime WASM, the toolkit's files, the log (devnet.log), the boundaries record (devnet-boundaries.json) and the
#   manual record-and-replay check's tape (a71-devnet.tape.jsonl). TAPES, when set, receives the tape
#   devnet-v8-v9-0-<to>.tape.jsonl. Containers and the network are named umbradb-0.3-devnet-* and removed at the end
#   unless KEEP=1; the node's RPC listens on 127.0.0.1:PORT (a random free port from 20000 when unset). Needs docker,
#   python3, node. [A71]
set -euo pipefail

WORK=${WORK:?WORK must name a directory for the files of the devnet}
TAPES=${TAPES:-}
PREFIX=${PREFIX:-umbradb-0.3-devnet}
KEEP=${KEEP:-0}
RECORD=${RECORD:-1}
ATTEMPT_BLOCK_LIMIT=${ATTEMPT_BLOCK_LIMIT:-1}
REPOSITORY=$(cd "$(dirname "$0")/../.." && pwd)

# The images, by digest (pulled 2026-10-26).
NODE_V8=midnightntwrk/midnight-node@sha256:ede01da35e982b6a4b85461ad8492ae2753ef14246fba33c8039b782aa8e39fb       # 1.0.0
NODE_V9=midnightntwrk/midnight-node@sha256:9040c346c27f569b72dfbbad9420cf38fc7cc6a13b38adf814a925bbe9311678       # 2.1.0-rc.4
TOOLKIT_V8=midnightntwrk/midnight-node-toolkit@sha256:41f55d35c9acc4f527f4afd168ad4d071f745dca65b60cdfdc9d886645e78442 # 1.0.0
TOOLKIT_V9=midnightntwrk/midnight-node-toolkit@sha256:b17370121f4e438eaf7d0b466cbe5f7df391b8b39418d5d5892b6a6a0b4737b6 # 2.1.0-rc.4
# What they give, checked (2026-10-26, arm64): the dev chain-spec of 1.0.0's build-spec with its bootNodes emptied
# (build-spec names a boot node by a node key it draws at random; nothing else in it differs between runs), and
# 2.1.0-rc.4's runtime.
CHAINSPEC_SHA256=67facd3abc5844fbbd76173e66ada195af444a270401d70320ce50346badb7cb
WASM_SHA256_ARM64=f3447cdf9027b73fe3ccb119da7b01b6f0d600bef9f09f7458c061ecaf8498d4
TO_SPEC_VERSION=2001000

# The dev chain's funded wallets (seeds 01-03), the destinations of the indexer's own test data, its rng seed, and the
# dev federated-governance keys (council Ferdie, Dave, Eve; technical committee Bob, Charlie, Alice).
SEED_1=0000000000000000000000000000000000000000000000000000000000000001
SEED_2=0000000000000000000000000000000000000000000000000000000000000002
SEED_3=0000000000000000000000000000000000000000000000000000000000000003
RNG_8=0000000000000000000000000000000000000000000000000000000000000037
RNG_9=0000000000000000000000000000000000000000000000000000000000000038
NEW_AUTHORITY=1000000000000000000000000000000000000000000000000000000000000001
SHIELDED_1=mn_shield-addr_undeployed1tth9g6jf8he6cmhgtme6arty0jde7wnypsg53qc3x5navl9za355jqqvfftm8asg986dx9puzwkmedeune9nfkuqvtmccmxtjwvlrvccwypcs
ADDRESS_1=mn_addr_undeployed1gkasr3z3vwyscy2jpp53nzr37v7n4r3lsfgj6v5g584dakjzt0xqun4d4r
ADDRESS_2=mn_addr_undeployed1g9nr3mvjcey7ca8shcs5d4yjndcnmczf90rhv4nju7qqqlfg4ygs0t4ngm
ADDRESS_3=mn_addr_undeployed1792ny9snf3hkzglcfs07agsela6v9dkkqs2m9xyvk4ryl3k99d2s8ea4ga
BENEFICIARY=04bcf7ad3be7a5c790460be82a713af570f22e0f801f6659ab8e84a52be6969e
COUNCIL=(42438b7883391c05512a938e36c2df0131e088b3756d6aa7a755fbff19d2f842
  868020ae0687dda7d57565093a69090211449845a7e11453612800b663307246
  786ad0e2df456fe43dd1f91ebca22e235bc162e0bb8d53c633e8c85b2af68b7a)
COMMITTEE=(398f0c28f98885e046333d4a41c19cee4c37368a9832c6502f6cfd182e2aef89
  bc1ede780f784bb6991a585e4f6e61522c14e1cae6ad0895fb57b9a205a8f938
  e5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a)
GOVERNANCE=(-c "${COUNCIL[0]}" -c "${COUNCIL[1]}" -c "${COUNCIL[2]}" -t "${COMMITTEE[0]}" -t "${COMMITTEE[1]}" -t "${COMMITTEE[2]}")

mkdir -p "$WORK/out"
LOG=$WORK/devnet.log
log() { echo "== $(date -u +%FT%TZ) $*" | tee -a "$LOG"; }
NETWORK=$PREFIX-net
NODE=$PREFIX-node
RPC=ws://node:9944
if [ -z "${PORT:-}" ]; then
  PORT=$(python3 -I -c 'import random, socket
for _ in range(100):
    port = random.randint(20000, 59999); s = socket.socket()
    try:
        s.bind(("127.0.0.1", port)); s.close(); print(port); break
    except OSError: pass')
fi
HOST_RPC=ws://127.0.0.1:$PORT
STEP=0

teardown() {
  if [ "$KEEP" != "1" ]; then
    docker ps -aq --filter "name=^$PREFIX-" | xargs -r docker rm -f >/dev/null 2>&1 || true
    docker network rm "$NETWORK" >/dev/null 2>&1 || true
  fi
}
trap teardown EXIT

# A toolkit run on the devnet's network, its output appended to the log.
toolkit() {
  local image=$1; shift
  STEP=$((STEP + 1))
  docker run --rm --name "$PREFIX-tk-$STEP" --network "$NETWORK" -v "$WORK/out:/out" "$image" "$@" >>"$LOG" 2>&1
}
# A step that may fail: its failure is logged, and the run goes on.
attempt() {
  local what=$1; shift
  if "$@"; then log "ok: $what"; else log "FAILED (attempt): $what"; fi
}
rpc() { # rpc <method> <params-json>: the result, as JSON
  python3 -I -c 'import json, sys, urllib.request
req = urllib.request.Request(sys.argv[1], json.dumps({"jsonrpc": "2.0", "id": 1, "method": sys.argv[2], "params": json.loads(sys.argv[3])}).encode(), {"Content-Type": "application/json"})
print(json.dumps(json.load(urllib.request.urlopen(req, timeout=30))["result"]))' "http://127.0.0.1:$PORT" "$1" "$2"
}
finalized() { rpc chain_getHeader "[$(rpc chain_getFinalizedHead '[]')]" | python3 -I -c 'import json, sys; print(int(json.load(sys.stdin)["number"], 16))'; }
spec_version() { rpc state_getRuntimeVersion '[]' | python3 -I -c 'import json, sys; print(json.load(sys.stdin)["specVersion"])'; }
wait_finalized() { # wait_finalized <height>
  for _ in $(seq 1 200); do
    if [ "$(finalized 2>/dev/null || echo 0)" -ge "$1" ]; then return 0; fi
    sleep 3
  done
  log "the node did not finalize $1 in time"; return 1
}
sha() { shasum -a 256 "$1" | cut -d' ' -f1; }

log "devnet: work $WORK, port $PORT, images $NODE_V8 $NODE_V9 $TOOLKIT_V8 $TOOLKIT_V9"

# 1. The ledger-8 dev chain-spec, from midnight-node 1.0.0.
docker run --rm --name "$PREFIX-buildspec" -e CFG_PRESET=dev "$NODE_V8" build-spec >"$WORK/chainspec.built.json" 2>>"$LOG"
python3 -I -c 'import json, sys
spec = json.load(open(sys.argv[1])); spec["bootNodes"] = []
open(sys.argv[2], "w").write(json.dumps(spec, indent=2) + "\n")' "$WORK/chainspec.built.json" "$WORK/chainspec.json"
[ "$(sha "$WORK/chainspec.json")" = "$CHAINSPEC_SHA256" ] || { log "the chain-spec's SHA-256 is $(sha "$WORK/chainspec.json"), not $CHAINSPEC_SHA256"; exit 1; }
log "chain-spec $CHAINSPEC_SHA256"

# 2. The 2.1.0-rc.4 runtime WASM, from that node image (its own build, not a binary swapped into a 1.0.x base).
ARCH=$(uname -m); case "$ARCH" in arm64 | aarch64) ARTIFACTS=artifacts-arm64 ;; *) ARTIFACTS=artifacts-amd64 ;; esac
docker run --rm --name "$PREFIX-wasm" --entrypoint cat "$NODE_V9" "/$ARTIFACTS/midnight_node_runtime.compact.compressed.wasm" >"$WORK/runtime.wasm"
WASM_SHA256=$(sha "$WORK/runtime.wasm")
if [ "$ARTIFACTS" = artifacts-arm64 ] && [ "$WASM_SHA256" != "$WASM_SHA256_ARM64" ]; then
  log "the runtime WASM's SHA-256 is $WASM_SHA256, not $WASM_SHA256_ARM64"; exit 1
fi
log "runtime WASM ($ARTIFACTS) $WASM_SHA256"

# 3. The 2.1.0 node binary on the ledger-8 chain-spec (dev preset: --state-pruning archive, --blocks-pruning archive).
docker network create "$NETWORK" >/dev/null
docker run -d --name "$NODE" --network "$NETWORK" --network-alias node -p "127.0.0.1:$PORT:9944" \
  -e CFG_PRESET=dev -e SHOW_CONFIG=false -e SIDECHAIN_BLOCK_BENEFICIARY="$BENEFICIARY" -e THRESHOLD=0 \
  -e CHAIN=/chainspec/chainspec.json -v "$WORK/chainspec.json:/chainspec/chainspec.json:ro" "$NODE_V9" >/dev/null
wait_finalized 2
log "node up: spec_version $(spec_version), node $(rpc system_version '[]')"

# The traffic of one ledger version: <toolkit> <rng seed> <tag>.
traffic() {
  local tk=$1 rng=$2 tag=$3
  attempt "$tag shielded and unshielded transfer" toolkit "$tk" generate-txs -s $RPC -d $RPC single-tx \
    --shielded-amount 10 --unshielded-amount 10 --source-seed $SEED_1 \
    --destination-address $SHIELDED_1 --destination-address $ADDRESS_1
  attempt "$tag contract deploy" toolkit "$tk" generate-txs -s $RPC --dest-file "/out/deploy-$tag.mn" \
    contract-simple deploy --rng-seed "$rng"
  { docker run --rm --name "$PREFIX-addr-$tag" -v "$WORK/out:/out" "$tk" contract-address \
    --src-file "/out/deploy-$tag.mn" 2>>"$LOG" || true; } | tail -1 >"$WORK/out/contract-$tag.addr"
  attempt "$tag contract deploy sent" toolkit "$tk" generate-txs --src-file "/out/deploy-$tag.mn" -d $RPC send
  local address; address=$(cat "$WORK/out/contract-$tag.addr")
  log "$tag contract $address"
  attempt "$tag contract call (store)" toolkit "$tk" generate-txs -s $RPC -d $RPC contract-simple call \
    --call-key store --rng-seed "$rng" --contract-address "$address"
  sleep 12
  attempt "$tag contract maintenance" toolkit "$tk" generate-txs -s $RPC -d $RPC contract-simple maintenance \
    --rng-seed "$rng" --contract-address "$address" --new-authority-seed $NEW_AUTHORITY
  rm -f "$WORK/out/guaranteed-$tag.mn" "$WORK/out/fallible-$tag.mn"
  attempt "$tag partial success: the guaranteed spend generated" toolkit "$tk" generate-txs -s $RPC \
    --dest-file "/out/guaranteed-$tag.mn" single-tx --unshielded-amount 5 --source-seed $SEED_1 --funding-seed $SEED_2 \
    --destination-address $ADDRESS_1
  attempt "$tag partial success: the fallible spend generated" toolkit "$tk" generate-txs -s $RPC \
    --dest-file "/out/fallible-$tag.mn" single-tx --unshielded-amount 5 --source-seed $SEED_1 --funding-seed $SEED_3 \
    --destination-address $ADDRESS_1 --destination-address $ADDRESS_2 --destination-address $ADDRESS_3
  attempt "$tag partial success: both sent together" toolkit "$tk" generate-txs --src-file "/out/guaranteed-$tag.mn" \
    --src-file "/out/fallible-$tag.mn" -d $RPC send
  printf '0x000740%s' "$(printf 'umbradb task 0.3' | xxd -p)" >"$WORK/out/remark.call"
  attempt "$tag failed extrinsic: a proposal by keys not on the council (expected to fail: Council::NotMember)" \
    toolkit "$tk" root-call --rpc-url $RPC --council-keys "${COMMITTEE[2]}" --council-keys "${COMMITTEE[0]}" \
    --tc-keys "${COMMITTEE[0]}" --tc-keys "${COMMITTEE[1]}" --encoded-call-file /out/remark.call
  attempt "$tag governance system transaction (update-ledger-parameters)" toolkit "$tk" update-ledger-parameters \
    -r $RPC "${GOVERNANCE[@]}"
  if [ "$ATTEMPT_BLOCK_LIMIT" = "1" ]; then
    attempt "$tag block limit lowered (block_usage 6000)" toolkit "$tk" update-ledger-parameters -r $RPC \
      "${GOVERNANCE[@]}" --block-limit-block-usage 6000
    rm -f "$WORK/out/limit-a-$tag.mn" "$WORK/out/limit-b-$tag.mn"
    attempt "$tag block limit: first transfer generated" toolkit "$tk" generate-txs -s $RPC \
      --dest-file "/out/limit-a-$tag.mn" single-tx --unshielded-amount 3 --source-seed $SEED_2 --destination-address $ADDRESS_1
    attempt "$tag block limit: second transfer generated" toolkit "$tk" generate-txs -s $RPC \
      --dest-file "/out/limit-b-$tag.mn" single-tx --unshielded-amount 4 --source-seed $SEED_3 --destination-address $ADDRESS_2
    attempt "$tag block limit: both sent together (the second expected to fail when applied)" toolkit "$tk" \
      generate-txs --src-file "/out/limit-a-$tag.mn" --src-file "/out/limit-b-$tag.mn" -d $RPC send
    attempt "$tag block limit restored (block_usage 1000000)" toolkit "$tk" update-ledger-parameters -r $RPC \
      "${GOVERNANCE[@]}" --block-limit-block-usage 1000000
  fi
}

# 4. Ledger-8 traffic.
log "ledger-8 traffic (toolkit 1.0.0)"
traffic "$TOOLKIT_V8" $RNG_8 v8

# 5. The governance runtime upgrade to the 2.1.0 runtime.
FROM_SPEC=$(spec_version)
log "runtime upgrade from spec_version $FROM_SPEC"
docker run --rm --name "$PREFIX-upgrade" --network "$NETWORK" -v "$WORK/runtime.wasm:/wasm/runtime.wasm:ro" "$TOOLKIT_V9" \
  runtime-upgrade --wasm-file /wasm/runtime.wasm --rpc-url $RPC -c //Eve -c //Ferdie -c //Dave \
  -t //Alice -t //Bob -t //Charlie --signer-key //Alice >>"$LOG" 2>&1
for _ in $(seq 1 60); do [ "$(spec_version)" = "$TO_SPEC_VERSION" ] && break; sleep 6; done
[ "$(spec_version)" = "$TO_SPEC_VERSION" ] || { log "the runtime did not become $TO_SPEC_VERSION"; exit 1; }
log "runtime upgraded: $FROM_SPEC -> $(spec_version)"

# 6. Ledger-9 traffic: the conversion reset DUST, so the paying wallets register their NIGHT for DUST first.
log "ledger-9 traffic (toolkit 2.1.0-rc.4)"
for seed in $SEED_1 $SEED_2 $SEED_3; do
  attempt "v9 register-dust-address ${seed: -2}" toolkit "$TOOLKIT_V9" generate-txs -s $RPC -d $RPC \
    register-dust-address --wallet-seed "$seed"
done
traffic "$TOOLKIT_V9" $RNG_9 v9

# 7. A few more blocks, then the records: the boundaries, the manual record-and-replay check [A71], and the tape of
#    every height.
HEAD=$(( $(finalized) + 5 ))
wait_finalized "$HEAD"
log "recording heights 0-$HEAD"
if [ "$RECORD" = "1" ]; then
  cd "$REPOSITORY"
  rm -f "$WORK/devnet-boundaries.json" "$WORK/a71-devnet.tape.jsonl"
  npx tsx tools/tape/main.ts boundaries --node "$HOST_RPC" --out "$WORK/devnet-boundaries.json" --step 50 | tee -a "$LOG"
  attempt "record-and-replay check" bash -c "npx tsx tools/tape/main.ts check --node '$HOST_RPC' --out '$WORK/a71-devnet.tape.jsonl' | tee -a '$LOG'"
  if [ -n "$TAPES" ]; then
    npx tsx tools/tape/main.ts range --node "$HOST_RPC" --from 0 --to "$HEAD" \
      --out "$TAPES/devnet-v8-v9-0-$HEAD.tape.jsonl" --live-seconds 60 | tee -a "$LOG"
  fi
fi
log "done"
