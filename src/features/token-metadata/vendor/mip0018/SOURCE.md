# Copied from the MIP-0018 proof of concept — provenance

Every file in this directory except this `SOURCE.md` is a verbatim copy of a file of the MIP-0018 token indexer proof of
concept, [acedward/umbradb PR #26](https://github.com/acedward/umbradb/pull/26) at
`760d3e9c8a060577257ca3b2c42dd09a680e70f8`. None is edited; a change is a deliberate re-copy with this table updated.
`test/features/token-metadata/provenance.test.ts` recomputes every SHA-256 below and fails on a modified, missing or
unlisted file.

This directory holds the reference codec (`packages/codec`), which `token-metadata` classifies every candidate with.

The files under `token-indexer/vendor/mip0018/` are themselves verbatim copies of the MIP's reference implementation, [`midnight-experiments/mip-0018`](https://github.com/midnight-experiments/mip-0018/tree/e8295792d9363be37ff2f7f716c740fcdf3f195e) at `e8295792d9363be37ff2f7f716c740fcdf3f195e` (Apache-2.0; its `LICENSE` and `NOTICE` are copied beside them), as the proof of concept's own `token-indexer/vendor/mip0018/SOURCE.md` lists.

| This directory | Copied from (PR #26 at `760d3e9`) | SHA-256 |
|---|---|---|
| `LICENSE` | `token-indexer/vendor/mip0018/LICENSE` | `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4` |
| `NOTICE` | `token-indexer/vendor/mip0018/NOTICE` | `7dfa652b7aee31524aa22622276d56cc5f96faf191ee353c5510aafd8af6e0f7` |
| `codec/README.md` | `token-indexer/vendor/mip0018/codec/README.md` | `409b24d286331dfeffb654f72895a281d97fe364e68503870e696157be0f773c` |
| `codec/package.json` | `token-indexer/vendor/mip0018/codec/package.json` | `f5d7eb61889c7c8a330065c2196c7cb65072433258c342bba0412975f675bac5` |
| `codec/src/classify.ts` | `token-indexer/vendor/mip0018/codec/src/classify.ts` | `57821aadf0af8772909408c601107f142ea5a7d19f3b2988fd23393b29049cf6` |
| `codec/src/constants.ts` | `token-indexer/vendor/mip0018/codec/src/constants.ts` | `df001f8ad28c5ff94307f82150a8443b6e1337dc121ccd71a5980ba4f7c143c7` |
| `codec/src/decode.ts` | `token-indexer/vendor/mip0018/codec/src/decode.ts` | `d9cee4a9b551448e3ffb90adedf8869e0749cf4b4350e97093b3d615363ffc41` |
| `codec/src/encode.ts` | `token-indexer/vendor/mip0018/codec/src/encode.ts` | `f8a80f80b28552cad1b2bc7a109b9b9c2a94c653ce839232dc90a8bd849611a7` |
| `codec/src/hex.ts` | `token-indexer/vendor/mip0018/codec/src/hex.ts` | `7ad2914d8bb983dde3ccc00edb05955afa948f9108894b57ae586686d4ab2e01` |
| `codec/src/index.ts` | `token-indexer/vendor/mip0018/codec/src/index.ts` | `0cbc8138f8a644245d2ac6e28b75253e7fc280a7eea13fee4e8b118ff8ad149e` |
| `codec/src/internal.ts` | `token-indexer/vendor/mip0018/codec/src/internal.ts` | `8d8631bf553b7d5f65c768b5fe33d0083cd559b0db7e3cf111ee77b983125272` |
| `codec/src/rules.ts` | `token-indexer/vendor/mip0018/codec/src/rules.ts` | `56b0ccb3224828ae484d19a6e168f67c658e31de9b798dac8bd3f5196c6a8873` |
| `codec/src/uri.ts` | `token-indexer/vendor/mip0018/codec/src/uri.ts` | `294e85c940cf58cd8c275060586e3715e901ae40577f047458365a544f2f4409` |
| `codec/src/values.ts` | `token-indexer/vendor/mip0018/codec/src/values.ts` | `3bcfd1325791913169a39f2416b959e6b388ffc09b7a608f267dee7f9875e83f` |
| `codec/tsconfig.json` | `token-indexer/vendor/mip0018/codec/tsconfig.json` | `1443a43102572e64d3bc659d5f5984a4fce3b087bdfac72a8d6bb4b55b3139ec` |
