// LG-16's tree values of fixed ledger states at the pinned ledger revisions: the expected values of
// `test/ledger/state-trees.test.ts` (UmbraDB task 12.1b, owner decision Q138 A, A158).
//
// Built natively against an unpatched checkout of `midnight-ledger` at the commit
// `vendor/ledger/<version>/upstream.json` pins (`run.sh`), with the storage layout the node uses
// (`layout-v2`, `gc-v1`). Nothing here comes from UmbraDB or from the vendored packages: each value
// is read from the ledger's Rust state as the official indexer reads it (`midnight-indexer`
// `indexer-common/src/domain/ledger/ledger_state.rs`: `zswap_first_free`,
// `zswap_merkle_tree_root`, `dust_commitments_first_free`, `dust_commitment_merkle_tree_root`,
// `dust_generations_first_free`, `dust_generation_merkle_tree_root`), each root after `rehash()`
// in the ledger's untagged serialization, as that indexer stores it.
//
// Takes `<name>=<path>` pairs, each a state's tagged serialization (`LedgerState.serialize()`);
// prints one JSON object, the states in the order given.

use mn_ledger::structure::LedgerState;
use serialize::{Serializable, tagged_deserialize};
use storage::db::InMemoryDB;

fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|byte| format!("{byte:02x}")).collect()
}

/// A tree's root after `rehash()`, in the ledger's untagged serialization.
fn root<T: Serializable>(root: Option<T>, tree: &str) -> String {
    let root = root.unwrap_or_else(|| panic!("the {tree} tree has no root"));
    let mut bytes = Vec::new();
    root.serialize(&mut bytes).expect("a root serializes");
    hex(&bytes)
}

fn main() {
    let mut states = Vec::new();
    for argument in std::env::args().skip(1) {
        let (name, path) = argument.split_once('=').expect("<name>=<path>");
        let bytes = std::fs::read(path).expect("a state file");
        let state: LedgerState<InMemoryDB> =
            tagged_deserialize(&mut &bytes[..]).expect("a ledger state's tagged serialization");
        states.push(format!(
            concat!(
                "{{\"name\":\"{}\",\"zswapFirstFree\":\"{}\",\"zswapRoot\":\"{}\",",
                "\"dustCommitmentFirstFree\":\"{}\",\"dustCommitmentRoot\":\"{}\",",
                "\"dustGenerationFirstFree\":\"{}\",\"dustGenerationRoot\":\"{}\"}}"
            ),
            name,
            state.zswap.first_free,
            root(state.zswap.coin_coms.rehash().root(), "zswap commitment"),
            state.dust.utxo.commitments_first_free,
            root(state.dust.utxo.commitments.rehash().root(), "DUST commitment"),
            state.dust.generation.generating_tree_first_free,
            root(state.dust.generation.generating_tree.rehash().root(), "DUST generation"),
        ));
    }
    println!("{{\"states\":[{}]}}", states.join(","));
}
