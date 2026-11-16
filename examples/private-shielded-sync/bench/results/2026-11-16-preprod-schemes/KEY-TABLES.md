### Real size (69,329 outputs)

Runs: simplepir: `runs/simplepir-real-r1/results.json`, `runs/simplepir-real-r2/results.json`, `runs/simplepir-real-r3/results.json`; ipir-sp: `runs/ipir-sp-real-r1/results.json`, `runs/ipir-sp-real-r2/results.json`, `runs/ipir-sp-real-r3/results.json`. Load average (1 min) at the runs' starts: 7.31–21.96. Each figure is the median over its samples, then the smallest and largest and the number of samples (n). M: measured, the field of `results.json` named; C: calculated by the formula given.

| Group | Figure | SimplePIR | IPIR+SP | IPIR+SP ÷ SimplePIR | How |
|---|---|---|---|---|---|
| Memory | Server: peak during the build (its own statistics) | 1.59 GiB (1.31 GiB–1.67 GiB, n 3) | 1.14 GiB (1.13 GiB–1.19 GiB, n 3) | 0.715× | M: largest `serverBuild.steps[*].peakRssBytes` (`build-stats.json`, every 10 ms) |
| Memory | Server: resident once served | 1.31 GiB (1.27 GiB–1.62 GiB, n 3) | 1.13 GiB (1010.1 MiB–1.15 GiB, n 3) | 0.868× | M: `build.rssAfterBytes` (median of the 250 ms peaks 1 to 3 s after) |
| Memory | Server: held by the three tables | 78.4 MiB (n 3) | 280.2 MiB (n 3) | 3.57× | C: read + path + nullifier held |
| Memory | Wallet: peak during its sync (A, B) | 899.9 MiB (672.4 MiB–1.06 GiB, n 6) | 728.6 MiB (570.5 MiB–903.9 MiB, n 6) | 0.810× | M: `wallets[].peakRssBytes` (the benchmark's process) |
| Space | Read table file | 11.6 MiB (n 3) | 8.00 MiB (n 3) | 0.687× | M: `snapshot.onDisk.readTable` (file size in the data directory) |
| Space | Path table file | 60.3 MiB (n 3) | 40.0 MiB (n 3) | 0.663× | M: `snapshot.onDisk.pathTable` (file size in the data directory) |
| Space | Nullifier table file | 6.47 MiB (n 3) | 8.00 MiB (n 3) | 1.24× | M: `snapshot.onDisk.nullifierTable` (file size in the data directory) |
| Space | Read public artifact (setup data / masks) | 9.63 MiB (n 3) | 14,884 B (n 3) | 1.47e-3× | M: `snapshot.onDisk.readPublic` (file size in the data directory) |
| Space | Path public artifact | 1.78 MiB (n 3) | 74,276 B (n 3) | 0.0398× | M: `snapshot.onDisk.pathPublic` (file size in the data directory) |
| Space | Nullifier public artifact | 6.47 MiB (n 3) | 14,884 B (n 3) | 2.19e-3× | M: `snapshot.onDisk.nullifierPublic` (file size in the data directory) |
| Space | Scan file | 2.38 MiB (n 3) | 2.38 MiB (n 3) | 1.00× | M: `snapshot.onDisk.scan` (file size in the data directory) |
| Space | Snapshot on disk, all artifacts | 98.7 MiB (n 3) | 58.5 MiB (n 3) | 0.593× | C: sum of `snapshot.onDisk` |
| Network | Wallet: once per snapshot, read and nullifier public artifacts | 16,875,520 B (n 6) | 29,768 B (n 6) | 1.76e-3× | M: `downloads.readPublic.bytes + downloads.nullifierPublic.bytes` (first sync) |
| Network | Wallet: once per snapshot, path public artifact (first spend) | 1,867,776 B (n 6) | 74,276 B (n 6) | 0.0398× | M: `wallets[].path.public.bytes` |
| Network | read call: up | 317,096 B (n 6) | 1,287,336 B (n 6) | 4.06× | M: `wallets[].read.bytesUp` (per call) |
| Network | read call: down | 315,432 B (n 6) | 182,440 B (n 6) | 0.578× | M: `wallets[].read.bytesDown` (per call) |
| Network | read: one query up | 9,908 B (n 6) | 40,228 B (n 6) | 4.06× | C: (call up − 40) / 32 |
| Network | read: one query down | 9,856 B (n 6) | 5,700 B (n 6) | 0.578× | C: (call down − 40) / 32 |
| Network | nullifier call: up | 262,184 B (n 6) | 1,287,336 B (n 6) | 4.91× | M: `wallets[].nullifier.bytesUp` (per call) |
| Network | nullifier call: down | 212,008 B (n 6) | 182,440 B (n 6) | 0.861× | M: `wallets[].nullifier.bytesDown` (per call) |
| Network | nullifier: one query up | 8,192 B (n 6) | 40,228 B (n 6) | 4.91× | C: (call up − 40) / 32 |
| Network | nullifier: one query down | 6,624 B (n 6) | 5,700 B (n 6) | 0.861× | C: (call down − 40) / 32 |
| Network | path call: up | 8,874,152 B (n 6) | 1,287,336 B (n 6) | 0.145× | M: `wallets[].path.bytesUp` (per call) |
| Network | path call: down | 58,408 B (n 6) | 903,336 B (n 6) | 15.5× | M: `wallets[].path.bytesDown` (per call) |
| Network | path: one query up | 277,316 B (n 6) | 40,228 B (n 6) | 0.145× | C: (call up − 40) / 32 |
| Network | path: one query down | 1,824 B (n 6) | 28,228 B (n 6) | 15.5× | C: (call down − 40) / 32 |
| Network | Wallet A: whole first sync, up | 579,280 B (n 3) | 2,574,672 B (n 3) | 4.44× | M: `wallets[A].bytesUp` |
| Network | Wallet A: whole first sync, down | 20,022,317 B (n 3) | 3,014,042 B (n 3) | 0.151× | M: `wallets[A].bytesDown` |
| Network | Wallet A: a later sync, down (artifacts cached) | 650,889 B (n 3) | 488,366 B (n 3) | 0.750× | C: first sync down − the four artifacts' bytes |
| Network | Wallet B: whole first sync, up | 579,280 B (n 3) | 2,574,672 B (n 3) | 4.44× | M: `wallets[B].bytesUp` |
| Network | Wallet B: whole first sync, down | 20,022,317 B (n 3) | 3,014,042 B (n 3) | 0.151× | M: `wallets[B].bytesDown` |
| Network | Naive baseline: every output slot in full and every nullifier entry | 19,598,208 B (n 3) | 19,598,208 B (n 3) | 1.00× | C: outputs × 256 + nullifier entries × 32 (`naive.totalBytes`) |
| Network | Wallet A: first sync down ÷ naive baseline | 1.022 (n 3) | 0.154 (n 3) | 0.151× | C: `wallets[A].bytesDown / naive.totalBytes` |
| Time | Build: whole (its own statistics) | 7.57 s (7.37 s–8.50 s, n 3) | 7.79 s (7.48 s–8.10 s, n 3) | 1.03× | M: `serverBuild.totalMs` |
| Time | Build step readSetup | 353 ms (306 ms–386 ms, n 3) | 394 ms (390 ms–431 ms, n 3) | 1.12× | M: `serverBuild.steps.readSetup.ms` |
| Time | Build step pathSetup | 1.78 s (1.74 s–1.84 s, n 3) | 1.87 s (1.81 s–2.05 s, n 3) | 1.05× | M: `serverBuild.steps.pathSetup.ms` |
| Time | Build step nullifierSetup | 216 ms (206 ms–229 ms, n 3) | 397 ms (373 ms–463 ms, n 3) | 1.84× | M: `serverBuild.steps.nullifierSetup.ms` |
| Time | read call: server | 9.9 ms (8.6 ms–28 ms, n 6) | 35 ms (27 ms–130 ms, n 6) | 3.56× | M: `wallets[].read.serverMs` (the module's request log) |
| Time | read: server per query | 0.31 ms (0.27 ms–0.88 ms, n 6) | 1.1 ms (0.83 ms–4.1 ms, n 6) | 3.56× | C: call's server time / 32 |
| Time | read call: wallet builds it | 29 ms (28 ms–55 ms, n 6) | 257 ms (249 ms–379 ms, n 6) | 8.84× | M: `wallets[].read.clientBuildMs` |
| Time | read: wallet builds one query | 0.91 ms (0.88 ms–1.7 ms, n 6) | 8.0 ms (7.8 ms–12 ms, n 6) | 8.84× | C: call's build time / 32 |
| Time | read call: wallet decodes its answer | 8.4 ms (5.7 ms–11 ms, n 6) | 1.4 ms (0.69 ms–2.0 ms, n 6) | 0.162× | M: `wallets[].read.clientDecodeMs` |
| Time | nullifier call: server | 5.0 ms (4.8 ms–6.4 ms, n 6) | 31 ms (22 ms–246 ms, n 6) | 6.17× | M: `wallets[].nullifier.serverMs` (the module's request log) |
| Time | nullifier: server per query | 0.16 ms (0.15 ms–0.20 ms, n 6) | 0.96 ms (0.68 ms–7.7 ms, n 6) | 6.17× | C: call's server time / 32 |
| Time | nullifier call: wallet builds it | 11 ms (8.9 ms–12 ms, n 6) | 249 ms (246 ms–401 ms, n 6) | 23.1× | M: `wallets[].nullifier.clientBuildMs` |
| Time | nullifier: wallet builds one query | 0.34 ms (0.28 ms–0.39 ms, n 6) | 7.8 ms (7.7 ms–13 ms, n 6) | 23.1× | C: call's build time / 32 |
| Time | nullifier call: wallet decodes its answer | 3.2 ms (2.2 ms–8.3 ms, n 6) | 0.64 ms (0.33 ms–1.1 ms, n 6) | 0.201× | M: `wallets[].nullifier.clientDecodeMs` |
| Time | path call: server | 51 ms (47 ms–70 ms, n 6) | 103 ms (56 ms–370 ms, n 6) | 2.00× | M: `wallets[].path.serverMs` (the module's request log) |
| Time | path: server per query | 1.6 ms (1.5 ms–2.2 ms, n 6) | 3.2 ms (1.8 ms–12 ms, n 6) | 2.00× | C: call's server time / 32 |
| Time | path call: wallet builds it | 288 ms (252 ms–303 ms, n 6) | 303 ms (295 ms–361 ms, n 6) | 1.05× | M: `wallets[].path.clientBuildMs` |
| Time | path: wallet builds one query | 9.0 ms (7.9 ms–9.5 ms, n 6) | 9.5 ms (9.2 ms–11 ms, n 6) | 1.05× | C: call's build time / 32 |
| Time | path call: wallet decodes its answer | 1.1 ms (0.96 ms–3.7 ms, n 6) | 1.1 ms (0.56 ms–1.8 ms, n 6) | 0.995× | M: `wallets[].path.clientDecodeMs` |
| Time | Wallet A: whole first sync | 5.51 s (4.81 s–5.89 s, n 3) | 5.78 s (5.58 s–7.72 s, n 3) | 1.05× | M: `wallets[A].totalMs` |
| Time | Wallet A: whole first sync without the scan | 263 ms (256 ms–289 ms, n 3) | 782 ms (717 ms–1.25 s, n 3) | 2.98× | C: `totalMs − scan.ms` |
| Time | Wallet B: whole first sync | 4.95 s (4.89 s–5.21 s, n 3) | 6.22 s (5.67 s–7.59 s, n 3) | 1.26× | M: `wallets[B].totalMs` |

### Padded to 100,000 entries (69,329 real outputs)

Runs: simplepir: `runs/simplepir-100k-r1/results.json`, `runs/simplepir-100k-r2/results.json`, `runs/simplepir-100k-r3/results.json`; ipir-sp: `runs/ipir-sp-100k-r1/results.json`, `runs/ipir-sp-100k-r2/results.json`, `runs/ipir-sp-100k-r3/results.json`. Load average (1 min) at the runs' starts: 16.19–19.64. Each figure is the median over its samples, then the smallest and largest and the number of samples (n). M: measured, the field of `results.json` named; C: calculated by the formula given.

| Group | Figure | SimplePIR | IPIR+SP | IPIR+SP ÷ SimplePIR | How |
|---|---|---|---|---|---|
| Memory | Server: peak during the build (its own statistics) | 2.00 GiB (1.52 GiB–2.02 GiB, n 3) | 1.44 GiB (1.34 GiB–2.22 GiB, n 3) | 0.720× | M: largest `serverBuild.steps[*].peakRssBytes` (`build-stats.json`, every 10 ms) |
| Memory | Server: resident once served | 1.85 GiB (1.50 GiB–1.99 GiB, n 3) | 1.32 GiB (1.31 GiB–1.37 GiB, n 3) | 0.714× | M: `build.rssAfterBytes` (median of the 250 ms peaks 1 to 3 s after) |
| Memory | Server: held by the three tables | 114.2 MiB (n 3) | 312.2 MiB (n 3) | 2.73× | C: read + path + nullifier held |
| Memory | Wallet: peak during its sync (A, B) | 936.6 MiB (705.2 MiB–1.14 GiB, n 6) | 805.9 MiB (635.7 MiB–909.1 MiB, n 6) | 0.860× | M: `wallets[].peakRssBytes` (the benchmark's process) |
| Space | Read table file | 16.8 MiB (n 3) | 16.0 MiB (n 3) | 0.953× | M: `snapshot.onDisk.readTable` (file size in the data directory) |
| Space | Path table file | 87.0 MiB (n 3) | 64.0 MiB (n 3) | 0.736× | M: `snapshot.onDisk.pathTable` (file size in the data directory) |
| Space | Nullifier table file | 10.4 MiB (n 3) | 8.00 MiB (n 3) | 0.769× | M: `snapshot.onDisk.nullifierTable` (file size in the data directory) |
| Space | Read public artifact (setup data / masks) | 11.7 MiB (n 3) | 29,732 B (n 3) | 2.43e-3× | M: `snapshot.onDisk.readPublic` (file size in the data directory) |
| Space | Path public artifact | 1.78 MiB (n 3) | 59,428 B (n 3) | 0.0318× | M: `snapshot.onDisk.pathPublic` (file size in the data directory) |
| Space | Nullifier public artifact | 10.4 MiB (n 3) | 14,884 B (n 3) | 1.36e-3× | M: `snapshot.onDisk.nullifierPublic` (file size in the data directory) |
| Space | Scan file | 3.43 MiB (n 3) | 3.43 MiB (n 3) | 1.00× | M: `snapshot.onDisk.scan` (file size in the data directory) |
| Space | Snapshot on disk, all artifacts | 141.5 MiB (n 3) | 91.5 MiB (n 3) | 0.647× | C: sum of `snapshot.onDisk` |
| Network | Wallet: once per snapshot, read and nullifier public artifacts | 23,166,976 B (n 6) | 44,616 B (n 6) | 1.93e-3× | M: `downloads.readPublic.bytes + downloads.nullifierPublic.bytes` (first sync) |
| Network | Wallet: once per snapshot, path public artifact (first spend) | 1,867,776 B (n 6) | 59,428 B (n 6) | 0.0318× | M: `wallets[].path.public.bytes` |
| Network | read call: up | 376,616 B (n 6) | 1,287,336 B (n 6) | 3.42× | M: `wallets[].read.bytesUp` (per call) |
| Network | read call: down | 383,016 B (n 6) | 362,664 B (n 6) | 0.947× | M: `wallets[].read.bytesDown` (per call) |
| Network | read: one query up | 11,768 B (n 6) | 40,228 B (n 6) | 3.42× | C: (call up − 40) / 32 |
| Network | read: one query down | 11,968 B (n 6) | 11,332 B (n 6) | 0.947× | C: (call down − 40) / 32 |
| Network | nullifier call: up | 262,184 B (n 6) | 1,287,336 B (n 6) | 4.91× | M: `wallets[].nullifier.bytesUp` (per call) |
| Network | nullifier call: down | 341,032 B (n 6) | 182,440 B (n 6) | 0.535× | M: `wallets[].nullifier.bytesDown` (per call) |
| Network | nullifier: one query up | 8,192 B (n 6) | 40,228 B (n 6) | 4.91× | C: (call up − 40) / 32 |
| Network | nullifier: one query down | 10,656 B (n 6) | 5,700 B (n 6) | 0.535× | C: (call down − 40) / 32 |
| Network | path call: up | 12,800,040 B (n 6) | 1,688,744 B (n 6) | 0.132× | M: `wallets[].path.bytesUp` (per call) |
| Network | path call: down | 58,408 B (n 6) | 723,112 B (n 6) | 12.4× | M: `wallets[].path.bytesDown` (per call) |
| Network | path: one query up | 400,000 B (n 6) | 52,772 B (n 6) | 0.132× | C: (call up − 40) / 32 |
| Network | path: one query down | 1,824 B (n 6) | 22,596 B (n 6) | 12.4× | C: (call down − 40) / 32 |
| Network | Wallet A: whole first sync, up | 638,800 B (n 3) | 2,574,672 B (n 3) | 4.03× | M: `wallets[A].bytesUp` |
| Network | Wallet A: whole first sync, down | 27,614,570 B (n 3) | 4,313,299 B (n 3) | 0.156× | M: `wallets[A].bytesDown` |
| Network | Wallet A: a later sync, down (artifacts cached) | 847,530 B (n 3) | 668,619 B (n 3) | 0.789× | C: first sync down − the four artifacts' bytes |
| Network | Wallet B: whole first sync, up | 638,800 B (n 3) | 2,574,672 B (n 3) | 4.03× | M: `wallets[B].bytesUp` |
| Network | Wallet B: whole first sync, down | 27,614,570 B (n 3) | 4,313,299 B (n 3) | 0.156× | M: `wallets[B].bytesDown` |
| Network | Naive baseline: every output slot in full and every nullifier entry | 28,800,000 B (n 3) | 28,800,000 B (n 3) | 1.00× | C: outputs × 256 + nullifier entries × 32 (`naive.totalBytes`) |
| Network | Wallet A: first sync down ÷ naive baseline | 0.959 (n 3) | 0.150 (n 3) | 0.156× | C: `wallets[A].bytesDown / naive.totalBytes` |
| Time | Build: whole (its own statistics) | 8.81 s (8.48 s–9.93 s, n 3) | 7.70 s (7.64 s–7.85 s, n 3) | 0.873× | M: `serverBuild.totalMs` |
| Time | Build step readSetup | 531 ms (469 ms–573 ms, n 3) | 750 ms (744 ms–754 ms, n 3) | 1.41× | M: `serverBuild.steps.readSetup.ms` |
| Time | Build step pathSetup | 2.47 s (2.39 s–2.47 s, n 3) | 1.55 s (1.53 s–1.62 s, n 3) | 0.629× | M: `serverBuild.steps.pathSetup.ms` |
| Time | Build step nullifierSetup | 272 ms (264 ms–282 ms, n 3) | 373 ms (369 ms–377 ms, n 3) | 1.37× | M: `serverBuild.steps.nullifierSetup.ms` |
| Time | read call: server | 13 ms (12 ms–63 ms, n 6) | 50 ms (43 ms–69 ms, n 6) | 3.97× | M: `wallets[].read.serverMs` (the module's request log) |
| Time | read: server per query | 0.40 ms (0.37 ms–2.0 ms, n 6) | 1.6 ms (1.3 ms–2.1 ms, n 6) | 3.97× | C: call's server time / 32 |
| Time | read call: wallet builds it | 37 ms (29 ms–42 ms, n 6) | 266 ms (263 ms–378 ms, n 6) | 7.14× | M: `wallets[].read.clientBuildMs` |
| Time | read: wallet builds one query | 1.2 ms (0.90 ms–1.3 ms, n 6) | 8.3 ms (8.2 ms–12 ms, n 6) | 7.14× | C: call's build time / 32 |
| Time | read call: wallet decodes its answer | 8.9 ms (5.9 ms–11 ms, n 6) | 2.0 ms (1.1 ms–2.1 ms, n 6) | 0.221× | M: `wallets[].read.clientDecodeMs` |
| Time | nullifier call: server | 7.6 ms (7.4 ms–8.5 ms, n 6) | 32 ms (27 ms–65 ms, n 6) | 4.28× | M: `wallets[].nullifier.serverMs` (the module's request log) |
| Time | nullifier: server per query | 0.24 ms (0.23 ms–0.27 ms, n 6) | 1.0 ms (0.85 ms–2.0 ms, n 6) | 4.28× | C: call's server time / 32 |
| Time | nullifier call: wallet builds it | 11 ms (9.0 ms–13 ms, n 6) | 252 ms (248 ms–324 ms, n 6) | 22.1× | M: `wallets[].nullifier.clientBuildMs` |
| Time | nullifier: wallet builds one query | 0.36 ms (0.28 ms–0.40 ms, n 6) | 7.9 ms (7.7 ms–10 ms, n 6) | 22.1× | C: call's build time / 32 |
| Time | nullifier call: wallet decodes its answer | 4.2 ms (3.4 ms–14 ms, n 6) | 0.62 ms (0.31 ms–1.1 ms, n 6) | 0.148× | M: `wallets[].nullifier.clientDecodeMs` |
| Time | path call: server | 66 ms (65 ms–69 ms, n 6) | 74 ms (71 ms–107 ms, n 6) | 1.12× | M: `wallets[].path.serverMs` (the module's request log) |
| Time | path: server per query | 2.1 ms (2.0 ms–2.2 ms, n 6) | 2.3 ms (2.2 ms–3.3 ms, n 6) | 1.12× | C: call's server time / 32 |
| Time | path call: wallet builds it | 395 ms (370 ms–468 ms, n 6) | 337 ms (334 ms–373 ms, n 6) | 0.853× | M: `wallets[].path.clientBuildMs` |
| Time | path: wallet builds one query | 12 ms (12 ms–15 ms, n 6) | 11 ms (10 ms–12 ms, n 6) | 0.853× | C: call's build time / 32 |
| Time | path call: wallet decodes its answer | 0.96 ms (0.91 ms–4.3 ms, n 6) | 0.82 ms (0.44 ms–1.2 ms, n 6) | 0.848× | M: `wallets[].path.clientDecodeMs` |
| Time | Wallet A: whole first sync | 7.10 s (6.89 s–11.00 s, n 3) | 7.37 s (7.32 s–7.41 s, n 3) | 1.04× | M: `wallets[A].totalMs` |
| Time | Wallet A: whole first sync without the scan | 349 ms (299 ms–350 ms, n 3) | 771 ms (746 ms–852 ms, n 3) | 2.21× | C: `totalMs − scan.ms` |
| Time | Wallet B: whole first sync | 7.23 s (7.12 s–7.86 s, n 3) | 7.43 s (7.22 s–8.69 s, n 3) | 1.03× | M: `wallets[B].totalMs` |

### Padded to 1,000,000 entries (69,329 real outputs)

Runs: simplepir: `runs/simplepir-1m-r1/results.json`, `runs/simplepir-1m-r2/results.json`, `runs/simplepir-1m-r3/results.json`; ipir-sp: `runs/ipir-sp-1m-r1/results.json`, `runs/ipir-sp-1m-r2/results.json`, `runs/ipir-sp-1m-r3/results.json`. Load average (1 min) at the runs' starts: 14.33–24.74. Each figure is the median over its samples, then the smallest and largest and the number of samples (n). M: measured, the field of `results.json` named; C: calculated by the formula given.

| Group | Figure | SimplePIR | IPIR+SP | IPIR+SP ÷ SimplePIR | How |
|---|---|---|---|---|---|
| Memory | Server: peak during the build (its own statistics) | 2.60 GiB (2.49 GiB–3.93 GiB, n 3) | 3.01 GiB (2.76 GiB–3.07 GiB, n 3) | 1.16× | M: largest `serverBuild.steps[*].peakRssBytes` (`build-stats.json`, every 10 ms) |
| Memory | Server: resident once served | 2.17 GiB (937.3 MiB–2.42 GiB, n 3) | 1.85 GiB (1.64 GiB–2.02 GiB, n 3) | 0.850× | M: `build.rssAfterBytes` (median of the 250 ms peaks 1 to 3 s after) |
| Memory | Server: held by the three tables | 1.10 GiB (n 3) | 1.43 GiB (n 3) | 1.30× | C: read + path + nullifier held |
| Memory | Wallet: peak during its sync (A, B) | 978.6 MiB (699.2 MiB–1.26 GiB, n 6) | 662.8 MiB (650.0 MiB–707.3 MiB, n 6) | 0.677× | M: `wallets[].peakRssBytes` (the benchmark's process) |
| Space | Read table file | 167.9 MiB (n 3) | 96.0 MiB (n 3) | 0.572× | M: `snapshot.onDisk.readTable` (file size in the data directory) |
| Space | Path table file | 869.8 MiB (n 3) | 520.0 MiB (n 3) | 0.598× | M: `snapshot.onDisk.pathTable` (file size in the data directory) |
| Space | Nullifier table file | 93.4 MiB (n 3) | 48.0 MiB (n 3) | 0.514× | M: `snapshot.onDisk.nullifierTable` (file size in the data directory) |
| Space | Read public artifact (setup data / masks) | 36.8 MiB (n 3) | 89,124 B (n 3) | 2.31e-3× | M: `snapshot.onDisk.readPublic` (file size in the data directory) |
| Space | Path public artifact | 17.8 MiB (n 3) | 193,060 B (n 3) | 0.0103× | M: `snapshot.onDisk.pathPublic` (file size in the data directory) |
| Space | Nullifier public artifact | 23.3 MiB (n 3) | 89,124 B (n 3) | 3.64e-3× | M: `snapshot.onDisk.nullifierPublic` (file size in the data directory) |
| Space | Scan file | 34.3 MiB (n 3) | 34.3 MiB (n 3) | 1.00× | M: `snapshot.onDisk.scan` (file size in the data directory) |
| Space | Snapshot on disk, all artifacts | 1.21 GiB (n 3) | 698.7 MiB (n 3) | 0.562× | C: sum of `snapshot.onDisk` |
| Network | Wallet: once per snapshot, read and nullifier public artifacts | 63,045,632 B (n 6) | 178,248 B (n 6) | 2.83e-3× | M: `downloads.readPublic.bytes + downloads.nullifierPublic.bytes` (first sync) |
| Network | Wallet: once per snapshot, path public artifact (first spend) | 18,677,760 B (n 6) | 193,060 B (n 6) | 0.0103× | M: `wallets[].path.public.bytes` |
| Network | read call: up | 1,196,328 B (n 6) | 1,688,744 B (n 6) | 1.41× | M: `wallets[].read.bytesUp` (per call) |
| Network | read call: down | 1,205,288 B (n 6) | 1,083,560 B (n 6) | 0.899× | M: `wallets[].read.bytesDown` (per call) |
| Network | read: one query up | 37,384 B (n 6) | 52,772 B (n 6) | 1.41× | C: (call up − 40) / 32 |
| Network | read: one query down | 37,664 B (n 6) | 33,860 B (n 6) | 0.899× | C: (call down − 40) / 32 |
| Network | nullifier call: up | 1,048,616 B (n 6) | 1,287,336 B (n 6) | 1.23× | M: `wallets[].nullifier.bytesUp` (per call) |
| Network | nullifier call: down | 764,968 B (n 6) | 1,083,560 B (n 6) | 1.42× | M: `wallets[].nullifier.bytesDown` (per call) |
| Network | nullifier: one query up | 32,768 B (n 6) | 40,228 B (n 6) | 1.23× | C: (call up − 40) / 32 |
| Network | nullifier: one query down | 23,904 B (n 6) | 33,860 B (n 6) | 1.42× | C: (call down − 40) / 32 |
| Network | path call: up | 12,800,040 B (n 6) | 2,892,968 B (n 6) | 0.226× | M: `wallets[].path.bytesUp` (per call) |
| Network | path call: down | 583,720 B (n 6) | 2,345,128 B (n 6) | 4.02× | M: `wallets[].path.bytesDown` (per call) |
| Network | path: one query up | 400,000 B (n 6) | 90,404 B (n 6) | 0.226× | C: (call up − 40) / 32 |
| Network | path: one query down | 18,240 B (n 6) | 73,284 B (n 6) | 4.02× | C: (call down − 40) / 32 |
| Network | Wallet A: whole first sync, up | 2,244,944 B (n 3) | 2,976,080 B (n 3) | 1.33× | M: `wallets[A].bytesUp` |
| Network | Wallet A: whole first sync, down | 101,139,447 B (n 3) | 38,468,963 B (n 3) | 0.380× | M: `wallets[A].bytesDown` |
| Network | Wallet A: a later sync, down (artifacts cached) | 2,093,751 B (n 3) | 2,290,651 B (n 3) | 1.09× | C: first sync down − the four artifacts' bytes |
| Network | Wallet B: whole first sync, up | 2,244,944 B (n 3) | 2,976,080 B (n 3) | 1.33× | M: `wallets[B].bytesUp` |
| Network | Wallet B: whole first sync, down | 101,139,447 B (n 3) | 38,468,963 B (n 3) | 0.380× | M: `wallets[B].bytesDown` |
| Network | Naive baseline: every output slot in full and every nullifier entry | 288,000,000 B (n 3) | 288,000,000 B (n 3) | 1.00× | C: outputs × 256 + nullifier entries × 32 (`naive.totalBytes`) |
| Network | Wallet A: first sync down ÷ naive baseline | 0.351 (n 3) | 0.134 (n 3) | 0.380× | C: `wallets[A].bytesDown / naive.totalBytes` |
| Time | Build: whole (its own statistics) | 35.63 s (34.86 s–36.13 s, n 3) | 17.56 s (17.37 s–18.54 s, n 3) | 0.493× | M: `serverBuild.totalMs` |
| Time | Build step readSetup | 4.06 s (3.89 s–4.41 s, n 3) | 2.88 s (2.34 s–2.97 s, n 3) | 0.708× | M: `serverBuild.steps.readSetup.ms` |
| Time | Build step pathSetup | 20.49 s (20.44 s–21.85 s, n 3) | 6.27 s (6.14 s–6.70 s, n 3) | 0.306× | M: `serverBuild.steps.pathSetup.ms` |
| Time | Build step nullifierSetup | 2.33 s (2.24 s–2.42 s, n 3) | 2.51 s (2.24 s–2.55 s, n 3) | 1.07× | M: `serverBuild.steps.nullifierSetup.ms` |
| Time | read call: server | 137 ms (129 ms–164 ms, n 6) | 147 ms (125 ms–272 ms, n 6) | 1.08× | M: `wallets[].read.serverMs` (the module's request log) |
| Time | read: server per query | 4.3 ms (4.0 ms–5.1 ms, n 6) | 4.6 ms (3.9 ms–8.5 ms, n 6) | 1.08× | C: call's server time / 32 |
| Time | read call: wallet builds it | 64 ms (61 ms–72 ms, n 6) | 365 ms (359 ms–375 ms, n 6) | 5.71× | M: `wallets[].read.clientBuildMs` |
| Time | read: wallet builds one query | 2.0 ms (1.9 ms–2.2 ms, n 6) | 11 ms (11 ms–12 ms, n 6) | 5.71× | C: call's build time / 32 |
| Time | read call: wallet decodes its answer | 19 ms (18 ms–48 ms, n 6) | 2.7 ms (2.1 ms–3.6 ms, n 6) | 0.143× | M: `wallets[].read.clientDecodeMs` |
| Time | nullifier call: server | 72 ms (68 ms–100 ms, n 6) | 111 ms (83 ms–274 ms, n 6) | 1.54× | M: `wallets[].nullifier.serverMs` (the module's request log) |
| Time | nullifier: server per query | 2.2 ms (2.1 ms–3.1 ms, n 6) | 3.5 ms (2.6 ms–8.6 ms, n 6) | 1.54× | C: call's server time / 32 |
| Time | nullifier call: wallet builds it | 37 ms (33 ms–48 ms, n 6) | 308 ms (303 ms–388 ms, n 6) | 8.27× | M: `wallets[].nullifier.clientBuildMs` |
| Time | nullifier: wallet builds one query | 1.2 ms (1.0 ms–1.5 ms, n 6) | 9.6 ms (9.5 ms–12 ms, n 6) | 8.27× | C: call's build time / 32 |
| Time | nullifier call: wallet decodes its answer | 8.1 ms (7.2 ms–11 ms, n 6) | 2.4 ms (1.2 ms–4.3 ms, n 6) | 0.289× | M: `wallets[].nullifier.clientDecodeMs` |
| Time | path call: server | 684 ms (654 ms–758 ms, n 6) | 429 ms (292 ms–522 ms, n 6) | 0.628× | M: `wallets[].path.serverMs` (the module's request log) |
| Time | path: server per query | 21 ms (20 ms–24 ms, n 6) | 13 ms (9.1 ms–16 ms, n 6) | 0.628× | C: call's server time / 32 |
| Time | path call: wallet builds it | 403 ms (380 ms–521 ms, n 6) | 598 ms (589 ms–622 ms, n 6) | 1.48× | M: `wallets[].path.clientBuildMs` |
| Time | path: wallet builds one query | 13 ms (12 ms–16 ms, n 6) | 19 ms (18 ms–19 ms, n 6) | 1.48× | C: call's build time / 32 |
| Time | path call: wallet decodes its answer | 6.1 ms (5.8 ms–8.2 ms, n 6) | 2.9 ms (1.7 ms–4.4 ms, n 6) | 0.472× | M: `wallets[].path.clientDecodeMs` |
| Time | Wallet A: whole first sync | 1 min 11 s (1 min 5 s–1 min 12 s, n 3) | 1 min 11 s (1 min 4 s–1 min 21 s, n 3) | 1.00× | M: `wallets[A].totalMs` |
| Time | Wallet A: whole first sync without the scan | 873 ms (796 ms–883 ms, n 3) | 1.38 s (1.19 s–1.87 s, n 3) | 1.58× | C: `totalMs − scan.ms` |
| Time | Wallet B: whole first sync | 1 min 7 s (1 min 6 s–1 min 8 s, n 3) | 1 min 11 s (1 min 4 s–1 min 16 s, n 3) | 1.06× | M: `wallets[B].totalMs` |

### Padded to 2,000,000 entries (69,329 real outputs)

Runs: simplepir: `runs/simplepir-2m-r1/results.json`, `runs/simplepir-2m-r2/results.json`, `runs/simplepir-2m-r3/results.json`; ipir-sp: `runs/ipir-sp-2m-r1/results.json`, `runs/ipir-sp-2m-r2/results.json`, `runs/ipir-sp-2m-r3/results.json`. Load average (1 min) at the runs' starts: 10.52–21.77. Each figure is the median over its samples, then the smallest and largest and the number of samples (n). M: measured, the field of `results.json` named; C: calculated by the formula given.

| Group | Figure | SimplePIR | IPIR+SP | IPIR+SP ÷ SimplePIR | How |
|---|---|---|---|---|---|
| Memory | Server: peak during the build (its own statistics) | 4.51 GiB (3.22 GiB–6.29 GiB, n 3) | 5.26 GiB (3.02 GiB–5.32 GiB, n 3) | 1.17× | M: largest `serverBuild.steps[*].peakRssBytes` (`build-stats.json`, every 10 ms) |
| Memory | Server: resident once served | 1.14 GiB (920.4 MiB–5.23 GiB, n 3) | 4.70 GiB (1.94 GiB–5.32 GiB, n 3) | 4.13× | M: `build.rssAfterBytes` (median of the 250 ms peaks 1 to 3 s after) |
| Memory | Server: held by the three tables | 2.19 GiB (n 3) | 2.27 GiB (n 3) | 1.03× | C: read + path + nullifier held |
| Memory | Wallet: peak during its sync (A, B) | 1.15 GiB (811.8 MiB–1.49 GiB, n 6) | 828.8 MiB (778.3 MiB–860.3 MiB, n 6) | 0.705× | M: `wallets[].peakRssBytes` (the benchmark's process) |
| Space | Read table file | 335.7 MiB (n 3) | 192.0 MiB (n 3) | 0.572× | M: `snapshot.onDisk.readTable` (file size in the data directory) |
| Space | Path table file | 1.70 GiB (n 3) | 1008.0 MiB (n 3) | 0.579× | M: `snapshot.onDisk.pathTable` (file size in the data directory) |
| Space | Nullifier table file | 172.1 MiB (n 3) | 96.0 MiB (n 3) | 0.558× | M: `snapshot.onDisk.nullifierTable` (file size in the data directory) |
| Space | Read public artifact (setup data / masks) | 51.9 MiB (n 3) | 118,820 B (n 3) | 2.18e-3× | M: `snapshot.onDisk.readPublic` (file size in the data directory) |
| Space | Path public artifact | 35.6 MiB (n 3) | 267,300 B (n 3) | 7.16e-3× | M: `snapshot.onDisk.pathPublic` (file size in the data directory) |
| Space | Nullifier public artifact | 43.0 MiB (n 3) | 89,124 B (n 3) | 1.98e-3× | M: `snapshot.onDisk.nullifierPublic` (file size in the data directory) |
| Space | Scan file | 68.7 MiB (n 3) | 68.7 MiB (n 3) | 1.00× | M: `snapshot.onDisk.scan` (file size in the data directory) |
| Space | Snapshot on disk, all artifacts | 2.39 GiB (n 3) | 1.33 GiB (n 3) | 0.558× | C: sum of `snapshot.onDisk` |
| Network | Wallet: once per snapshot, read and nullifier public artifacts | 99,549,184 B (n 6) | 207,944 B (n 6) | 2.09e-3× | M: `downloads.readPublic.bytes + downloads.nullifierPublic.bytes` (first sync) |
| Network | Wallet: once per snapshot, path public artifact (first spend) | 37,355,520 B (n 6) | 267,300 B (n 6) | 7.16e-3× | M: `wallets[].path.public.bytes` |
| Network | read call: up | 1,695,528 B (n 6) | 2,090,152 B (n 6) | 1.23× | M: `wallets[].read.bytesUp` (per call) |
| Network | read call: down | 1,700,904 B (n 6) | 1,444,008 B (n 6) | 0.849× | M: `wallets[].read.bytesDown` (per call) |
| Network | read: one query up | 52,984 B (n 6) | 65,316 B (n 6) | 1.23× | C: (call up − 40) / 32 |
| Network | read: one query down | 53,152 B (n 6) | 45,124 B (n 6) | 0.849× | C: (call down − 40) / 32 |
| Network | nullifier call: up | 1,048,616 B (n 6) | 1,688,744 B (n 6) | 1.61× | M: `wallets[].nullifier.bytesUp` (per call) |
| Network | nullifier call: down | 1,410,088 B (n 6) | 1,083,560 B (n 6) | 0.768× | M: `wallets[].nullifier.bytesDown` (per call) |
| Network | nullifier: one query up | 32,768 B (n 6) | 52,772 B (n 6) | 1.61× | C: (call up − 40) / 32 |
| Network | nullifier: one query down | 44,064 B (n 6) | 33,860 B (n 6) | 0.768× | C: (call down − 40) / 32 |
| Network | path call: up | 12,800,040 B (n 6) | 3,695,784 B (n 6) | 0.289× | M: `wallets[].path.bytesUp` (per call) |
| Network | path call: down | 1,167,400 B (n 6) | 3,246,248 B (n 6) | 2.78× | M: `wallets[].path.bytesDown` (per call) |
| Network | path: one query up | 400,000 B (n 6) | 115,492 B (n 6) | 0.289× | C: (call up − 40) / 32 |
| Network | path: one query down | 36,480 B (n 6) | 101,444 B (n 6) | 2.78× | C: (call down − 40) / 32 |
| Network | Wallet A: whole first sync, up | 2,744,144 B (n 3) | 3,778,896 B (n 3) | 1.38× | M: `wallets[A].bytesUp` |
| Network | Wallet A: whole first sync, down | 174,783,741 B (n 3) | 74,859,110 B (n 3) | 0.428× | M: `wallets[A].bytesDown` |
| Network | Wallet A: a later sync, down (artifacts cached) | 3,234,493 B (n 3) | 2,651,102 B (n 3) | 0.820× | C: first sync down − the four artifacts' bytes |
| Network | Wallet B: whole first sync, up | 2,744,144 B (n 3) | 3,778,896 B (n 3) | 1.38× | M: `wallets[B].bytesUp` |
| Network | Wallet B: whole first sync, down | 174,783,741 B (n 3) | 74,859,110 B (n 3) | 0.428× | M: `wallets[B].bytesDown` |
| Network | Naive baseline: every output slot in full and every nullifier entry | 576,000,000 B (n 3) | 576,000,000 B (n 3) | 1.00× | C: outputs × 256 + nullifier entries × 32 (`naive.totalBytes`) |
| Network | Wallet A: first sync down ÷ naive baseline | 0.303 (n 3) | 0.130 (n 3) | 0.428× | C: `wallets[A].bytesDown / naive.totalBytes` |
| Time | Build: whole (its own statistics) | 1 min 3 s (1 min 0 s–1 min 4 s, n 3) | 20.43 s (20.30 s–23.79 s, n 3) | 0.324× | M: `serverBuild.totalMs` |
| Time | Build step readSetup | 7.97 s (7.52 s–8.01 s, n 3) | 2.99 s (2.98 s–3.54 s, n 3) | 0.375× | M: `serverBuild.steps.readSetup.ms` |
| Time | Build step pathSetup | 40.26 s (38.36 s–40.80 s, n 3) | 7.90 s (7.73 s–9.27 s, n 3) | 0.196× | M: `serverBuild.steps.pathSetup.ms` |
| Time | Build step nullifierSetup | 3.96 s (3.91 s–4.04 s, n 3) | 2.23 s (2.16 s–2.45 s, n 3) | 0.564× | M: `serverBuild.steps.nullifierSetup.ms` |
| Time | read call: server | 250 ms (234 ms–306 ms, n 6) | 176 ms (157 ms–404 ms, n 6) | 0.705× | M: `wallets[].read.serverMs` (the module's request log) |
| Time | read: server per query | 7.8 ms (7.3 ms–9.6 ms, n 6) | 5.5 ms (4.9 ms–13 ms, n 6) | 0.705× | C: call's server time / 32 |
| Time | read call: wallet builds it | 76 ms (65 ms–125 ms, n 6) | 434 ms (421 ms–465 ms, n 6) | 5.67× | M: `wallets[].read.clientBuildMs` |
| Time | read: wallet builds one query | 2.4 ms (2.0 ms–3.9 ms, n 6) | 14 ms (13 ms–15 ms, n 6) | 5.67× | C: call's build time / 32 |
| Time | read call: wallet decodes its answer | 20 ms (16 ms–56 ms, n 6) | 5.2 ms (2.4 ms–8.6 ms, n 6) | 0.264× | M: `wallets[].read.clientDecodeMs` |
| Time | nullifier call: server | 132 ms (115 ms–182 ms, n 6) | 114 ms (81 ms–285 ms, n 6) | 0.861× | M: `wallets[].nullifier.serverMs` (the module's request log) |
| Time | nullifier: server per query | 4.1 ms (3.6 ms–5.7 ms, n 6) | 3.6 ms (2.5 ms–8.9 ms, n 6) | 0.861× | C: call's server time / 32 |
| Time | nullifier call: wallet builds it | 37 ms (32 ms–62 ms, n 6) | 354 ms (348 ms–383 ms, n 6) | 9.64× | M: `wallets[].nullifier.clientBuildMs` |
| Time | nullifier: wallet builds one query | 1.1 ms (0.99 ms–1.9 ms, n 6) | 11 ms (11 ms–12 ms, n 6) | 9.64× | C: call's build time / 32 |
| Time | nullifier call: wallet decodes its answer | 17 ms (13 ms–24 ms, n 6) | 2.1 ms (1.2 ms–4.5 ms, n 6) | 0.123× | M: `wallets[].nullifier.clientDecodeMs` |
| Time | path call: server | 1.27 s (1.19 s–1.44 s, n 6) | 530 ms (397 ms–974 ms, n 6) | 0.418× | M: `wallets[].path.serverMs` (the module's request log) |
| Time | path: server per query | 40 ms (37 ms–45 ms, n 6) | 17 ms (12 ms–30 ms, n 6) | 0.418× | C: call's server time / 32 |
| Time | path call: wallet builds it | 370 ms (349 ms–480 ms, n 6) | 758 ms (741 ms–780 ms, n 6) | 2.05× | M: `wallets[].path.clientBuildMs` |
| Time | path: wallet builds one query | 12 ms (11 ms–15 ms, n 6) | 24 ms (23 ms–24 ms, n 6) | 2.05× | C: call's build time / 32 |
| Time | path call: wallet decodes its answer | 12 ms (11 ms–15 ms, n 6) | 3.7 ms (1.9 ms–6.2 ms, n 6) | 0.319× | M: `wallets[].path.clientDecodeMs` |
| Time | Wallet A: whole first sync | 2 min 5 s (2 min 0 s–2 min 11 s, n 3) | 2 min 7 s (2 min 0 s–2 min 9 s, n 3) | 1.01× | M: `wallets[A].totalMs` |
| Time | Wallet A: whole first sync without the scan | 1.06 s (900 ms–1.08 s, n 3) | 1.52 s (1.28 s–1.84 s, n 3) | 1.43× | C: `totalMs − scan.ms` |
| Time | Wallet B: whole first sync | 2 min 3 s (2 min 0 s–2 min 14 s, n 3) | 2 min 4 s (2 min 0 s–2 min 9 s, n 3) | 1.01× | M: `wallets[B].totalMs` |

**SC-002** (at 1,000,000 entries, IPIR+SP's per-snapshot download for the read and nullifier tables under 1% of SimplePIR's): 178,248 B against 63,045,632 B, 0.283%: **met**.

**SC-003** (a measured value in every memory, space and network cell at the real size, 100,000 and 1,000,000): **met**.
