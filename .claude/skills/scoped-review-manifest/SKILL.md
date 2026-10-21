---
name: scoped-review-manifest
description: |
  PARKED — do not use. Graph-scoped review manifests were parked on 2026-10-21 (see
  CLAUDE.md "Review workflow"); no review lane receives a manifest. This skill is kept,
  unused, in case the owner re-enables them. It computed a graphify-based blast-radius
  reading-list manifest for the warm review roles of the former review pipeline.
allowed-tools: Bash(git*), Bash(npm run graph:*), Bash(python*), Bash(wc*), Bash(grep*), Bash(rm*), Bash(cat*), Bash(sort*)
license: MIT
metadata:
  author: umbradb-project
  version: "1.3"
---

# scoped-review-manifest

> **Parked (2026-10-21).** The "Graph-scoped review policy" this skill implemented has been removed
> from `CLAUDE.md`; its last full text is in git history. The steps below are kept for reference
> only. Do not run them unless the owner re-enables graph-scoped review. They also rely on
> `npm run graph:refresh -- --include-untracked` and `graphify-out/.graphify_python`, both removed
> when the refresh became a from-scratch rebuild over tracked files, so re-enabling means restoring
> those too.

Computes a `review-manifest.md` for a single review round and writes it into the
change's own directory (e.g. `openspec/changes/sprint-N-<module>/review-manifest.md`).
This is the concrete mechanism behind CLAUDE.md's Graph-scoped review policy — read that
section first if you haven't; this skill only implements step 2 onward ("The scoping
mechanism") of it.

**Do not use this skill to scope**: the design-panel adversarial-risk or
requirements-completeness/EARS panelists (both **NONE** — no manifest, no graph contact),
the fidelity-to-prior-art panelist (**PULL** instead — point it at `graphify
query`/`explain`/`path` directly, don't hand it a manifest), or the Codex cold audit
(**NONE**, hard rule). Handing any of those a precomputed reading list defeats the
reason they're run independently — see CLAUDE.md's confirmation-bias citation if the
reasoning here isn't clear.

**Precondition this mechanism depends on:** every step below computes diffs against
`<base>` through the **actual current working tree** (staged, unstaged, and untracked
changes all included), never `<base>..HEAD` alone. A review round very often runs against
in-progress, not-yet-committed work — this skill's own drafting round is itself an
example — and `git diff <base>..HEAD` silently sees only committed history, with no error
or warning when it misses real uncommitted changes. Every `git diff` invocation below is
written against `<base>` (no `..HEAD` suffix) for exactly this reason; do not "simplify"
it back to `<base>..HEAD`, that reintroduces the bug.

## Step 0 — Skip check

Before doing anything else, check whether this diff is even worth scoping. `<base>` is
this change's actual merge-base against `main` (`git merge-base main HEAD`), never a
single prior commit — otherwise splitting a large change into several small commits could
dodge this check even though the cumulative diff wouldn't.

```bash
git diff --name-only <base> | wc -l
git ls-files --others --exclude-standard | wc -l
git diff --shortstat <base>
git diff <base> -- '*.ts' | grep -E '^[+-][^+-].*\bexport\b'
```

The same untracked-file gap that Step 2 exists to close applies here too: `git diff
<base>` alone never reports untracked new files, so measuring size from it alone can
misclassify an untracked-only change (e.g. several new not-yet-`git add`ed files) as
"≤2 files, &lt;150 lines" when it isn't — add the `git ls-files --others
--exclude-standard` count into the file-count total, and if there are any untracked files
at all, treat their line count as unmeasured by `--shortstat` (don't assume zero; if in
doubt, don't skip). The fourth command is the actual check for "no exported/public symbol
changed" — the first three commands alone cannot see this (they report counts and line
stats, not content), so don't mark this condition satisfied without running it. Adjust the
path filter/grep if this repo's export idioms change; the point is inspecting real diff
content, not diff stats.

If **all** of these hold, skip this skill entirely (PUSH auditors explore independently
for this round instead, same as any NONE-mode role) — building a manifest for a change
this small can cost more tokens than it saves:

- 2 or fewer files touched **counting both commands' output combined** (tracked + untracked), **and**
- under ~150 changed lines **and zero untracked files** (an untracked file's real line count
  isn't visible to `--shortstat`, so its mere presence disqualifies the skip — don't guess
  its size), **and**
- the fourth command above returned nothing, **and**
- the diff is docs-only or test-only.

This threshold is a starting estimate (see CLAUDE.md's baseline note) — if a calibrated
number exists in this repo by the time you're reading this, prefer it over 150.

## Step 1 — Freshness gate

```bash
npm run graph:refresh -- --include-untracked
npm run graph:check
```

`graph:refresh` is the only sanctioned way to write `graphify-out/` (CLAUDE.md, top section):
pinned graphify, AST-only, no LLM tokens, deterministic. `--include-untracked` also graphs this
round's not-yet-added files, so Step 3 can expand from their nodes. `graph:check` recomputes
`graph.json`'s `corpus_fingerprint` from the working tree and exits 0 only if the graph on disk was
built from exactly these files with the pinned tool versions (1 = stale, 2 = not written by
`graph:refresh`). Never substitute bare `graphify update .`: its output has no fingerprint, so
`graph:check` rejects it.

**Abort scoping and fall back to full independent exploration for every PUSH role this
round** if either command fails. Don't skip this step to "save tokens" — it costs no LLM tokens,
and skipping it is what actually risks a stale, wrong manifest.

The refresh leaves a working-tree-scoped graph in `graphify-out/`. Never commit that: run
`npm run graph:refresh` without the flag (or `git checkout -- graphify-out/`) before committing —
CI rejects a committed graph of that scope.

**This check on its own is necessary but not sufficient**: it proves the graph matches the
working tree *at the moment it ran* — it says nothing about whether Step 2's changed-file
computation captured that same working-tree state (a separate, sequential concern). Run Step 2
immediately after this passes, not on a delay.

## Step 2 — Changed-file seed set

Compute against `<base>` through the working tree — not `<base>..HEAD` — and separately
enumerate untracked new files, which plain `git diff` never reports at all regardless of
range:

```bash
git diff --name-only <base> > graphify-out/.scoped_review_tracked_files.txt
git ls-files --others --exclude-standard > graphify-out/.scoped_review_untracked_files.txt
cat graphify-out/.scoped_review_tracked_files.txt graphify-out/.scoped_review_untracked_files.txt | sort -u > graphify-out/.scoped_review_changed_files.txt
git rev-parse HEAD > graphify-out/.scoped_review_head.txt
git merge-base main HEAD > graphify-out/.scoped_review_base.txt
git diff <base> > graphify-out/.scoped_review_diff.txt
```

Note the known, disclosed gap this leaves (documented in Step 3's import-backstop
comments too): an untracked new file's own added lines aren't captured by `git diff`
either, so the import backstop (Step 3) won't parse imports *from* a brand-new untracked
file — only its presence in the "diff files" section, which is already marked "read in
full, authoritative." If this matters in practice, `git add -N` (intent-to-add) the file
before running this skill so `git diff <base>` picks up its content as an addition.

## Step 3 — Blast-radius computation

`graphify query`/`explain` match by node **label** substring, not by file path, so the
file-seeded blast radius here is computed directly against `graphify-out/graph.json`
rather than through those two commands (they're still the right tool for the
fidelity-to-prior-art panelist's own PULL-mode concept lookups — just not this step). This
also checks the graph's `hyperedges` array directly (`json_graph.node_link_graph(...,
edges='links')` only builds the node/edge graph from `links` — hyperedges live in a
separate top-level array and are otherwise unreachable by any traversal over `G`), caps
the radius size by hop distance only (never by confidence score — see the comment in the
script and CLAUDE.md's confidence-asymmetry guardrail for why), records real edge
provenance per discovered node instead of leaving it for manual lookup, and resolves the
diff's own imports as a disclosed-scope completeness backstop with a repo-root
containment check.

```bash
$(cat graphify-out/.graphify_python) -c "
import json, re, os
import networkx as nx
from networkx.readwrite import json_graph
from pathlib import Path

data = json.loads(Path('graphify-out/graph.json').read_text(encoding='utf-8'))

# This mechanism assumes a plain undirected, non-multigraph shape -- G[u][v] below returns
# a single edge-attribute dict only under that assumption. Abort rather than silently
# mis-read edge data (e.g. a MultiGraph makes G[u][v] a key->attrs mapping instead) if a
# future graph build ever changes this.
if data.get('directed') or data.get('multigraph'):
    print(f'ABORT: graph.json has directed={data.get(\"directed\")}, '
          f'multigraph={data.get(\"multigraph\")} -- this script assumes both are false. '
          f'Fall back to full independent exploration rather than mis-scope.')
    raise SystemExit(1)

G = json_graph.node_link_graph(data, edges='links')

changed_files = set(
    l.strip() for l in Path('graphify-out/.scoped_review_changed_files.txt').read_text(encoding='utf-8').splitlines() if l.strip()
)

# source_file values in this graph are relative with forward slashes (confirmed against
# the committed graph.json); git diff --name-only emits the same on this platform. If a
# future graph or git config normalizes differently, this match silently returns zero
# seeds and hits the abort below rather than scoping against a wrong/empty set.
seeds = [n for n, d in G.nodes(data=True) if d.get('source_file') in changed_files]
if not seeds:
    print('WARNING: no graph nodes matched the changed-file set -- likely a graph that '
          'needs --update, or files outside this graph\\'s corpus (e.g. brand-new files '
          'with no prior extraction pass yet). Do not silently produce an empty manifest '
          '-- fall back to full independent exploration for this round instead.')
    raise SystemExit(1)

HOPS = 2  # matches CLAUDE.md's '1-2 hop neighborhood' -- do not silently widen this
MAX_RADIUS_NODES = 60  # tune per repo size; an uncapped radius on a dense graph defeats scoping

def edge_provenance(u, v):
    d = G[u][v]
    return d.get('confidence', 'UNKNOWN'), d.get('confidence_score', d.get('weight', 1.0))

def better(prov_a, prov_b):
    # Used ONLY to pick which provenance label to DISPLAY when a node is reachable via
    # multiple edges -- EXTRACTED is shown over INFERRED when both exist. This never
    # decides inclusion (discovery is provenance-agnostic, correctly) or exclusion (the
    # truncation cap below ranks by hop distance only, NOT by this) -- see CLAUDE.md's
    # confidence-asymmetry guardrail: a numeric score deciding which nodes survive a cap
    # is the same bug as a numeric score deciding which nodes get excluded outright.
    rank = {'EXTRACTED': 2, 'INFERRED': 1, 'AMBIGUOUS': 0, 'UNKNOWN': -1}
    ra, sa = prov_a; rb, sb = prov_b
    if rank.get(ra, -1) != rank.get(rb, -1):
        return prov_a if rank.get(ra, -1) > rank.get(rb, -1) else prov_b
    return prov_a if sa >= sb else prov_b

# BFS tracks hop distance and best-seen discovering-edge provenance natively -- avoids a
# second O(seeds x radius) all-pairs shortest_path_length pass over the same graph. Any
# edge (EXTRACTED or INFERRED) can discover/include a node -- that's intentional.
hop_of = {s: 0 for s in seeds}
prov_of = {}
frontier = set(seeds)
for hop in range(1, HOPS + 1):
    nxt = set()
    for n in frontier:
        for neighbor in G.neighbors(n):
            prov = edge_provenance(n, neighbor)
            if neighbor not in hop_of:
                hop_of[neighbor] = hop
                prov_of[neighbor] = prov
                nxt.add(neighbor)
            elif neighbor in nxt or (hop_of[neighbor] == hop):
                prov_of[neighbor] = better(prov_of[neighbor], prov)
    frontier = nxt

radius_ids = [n for n in hop_of if n not in seeds and G.nodes[n].get('source_file') not in changed_files]

rows = []
for nid in radius_ids:
    d = G.nodes[nid]
    prov, score = prov_of.get(nid, ('UNKNOWN', 0.0))
    rows.append({
        'hops': hop_of[nid],
        'confidence': prov,
        'confidence_score': score,
        'source_file': d.get('source_file', ''),
        'label': d.get('label', nid),
        'node_id': d.get('id', nid),
    })
# Rank and truncate by HOP DISTANCE ONLY. confidence_score is carried in the row purely as
# display/evidentiary-weight metadata for the manifest table -- it must never decide which
# entries survive the cap, since that would let a numeric score silently narrow scope, the
# exact thing the confidence-asymmetry rule forbids. Ties at the same hop level keep
# insertion order (stable sort), not a confidence-based tiebreak.
rows.sort(key=lambda r: r['hops'])

dropped = 0
dropped_at_hop = None
if len(rows) > MAX_RADIUS_NODES:
    dropped = len(rows) - MAX_RADIUS_NODES
    dropped_at_hop = rows[MAX_RADIUS_NODES]['hops']
    rows = rows[:MAX_RADIUS_NODES]

# Hyperedge membership: separate from G entirely (json_graph only builds from 'links'),
# so this is a direct set-overlap check against the raw extraction data, not a traversal.
touched = set(seeds) | set(r['node_id'] for r in rows) | {n for n in hop_of}
prior_art = []
for he in data.get('hyperedges', []):
    members = set(he.get('nodes', []))
    if members & touched:
        prior_art.append({'id': he.get('id'), 'label': he.get('label'), 'matched_members': sorted(members & touched)})

# Import/require completeness backstop: resolve the diff's own added-line imports to
# repo-relative paths, unconditionally w.r.t. confidence -- this is a DISCLOSED-SCOPE
# mitigation for extraction misses, not a complete one (see CLAUDE.md): it only catches
# NEW outgoing imports the diff itself adds, not unchanged files consuming a changed
# module, and not dynamic/side-effect imports.
diff_text = Path('graphify-out/.scoped_review_diff.txt').read_text(encoding='utf-8', errors='replace')
import_re = re.compile(r'''^\+(?!\+\+).*(?:from\s+['\"]([./][^'\"]+)['\"]|require\(\s*['\"]([./][^'\"]+)['\"]\s*\))''', re.MULTILINE)
comment_re = re.compile(r'^\+\s*(//|#)')  # best-effort: skip obvious line-comments (not block comments)
current_file = None
file_hdr_re = re.compile(r'^\+\+\+ b/(.+)$', re.MULTILINE)
backstop = set()
repo_root = Path('.').resolve()
lines = diff_text.splitlines()
for line in lines:
    m = file_hdr_re.match(line)
    if m:
        current_file = m.group(1)
        continue
    if comment_re.match(line):
        continue
    m = import_re.match(line)
    if m and current_file:
        rel = m.group(1) or m.group(2)
        base_dir = Path(current_file).parent
        # Strip a .js/.jsx ESM-style specifier extension first: this repo's own import
        # convention (confirmed against real committed code) writes '.js' specifiers that
        # resolve to '.ts' source files, so trying 'rel + suffix' without stripping it
        # first (e.g. 'storage-errors.js' + '.ts' -> 'storage-errors.js.ts') never
        # resolves anything and silently produces an empty backstop.
        stem = rel[:-3] if rel.endswith('.js') else (rel[:-4] if rel.endswith('.jsx') else rel)
        resolved = None
        for suffix in ('.ts', '.tsx', '/index.ts', ''):
            # normpath collapses '../' segments to match the graph's own flat relative
            # source_file convention, and always compare on '/' since graph.json/git both
            # use forward slashes regardless of host OS.
            candidate = os.path.normpath((base_dir / (stem + suffix)).as_posix()).replace(os.sep, '/')
            candidate_path = Path(candidate)
            if not candidate_path.exists():
                continue
            # SECURITY: the import specifier is attacker-shapeable diff content (an added
            # line, even inside what looks like a comment, could read '../../.env' or
            # similar) -- verify the resolved path actually stays under the repo root
            # before ever adding it to a PUSH agent's reading list. Reject silently
            # (do not add to backstop) rather than raise, since a rejected path just means
            # 'not caught by this backstop', not a fatal condition for the whole manifest.
            try:
                candidate_path.resolve().relative_to(repo_root)
            except ValueError:
                continue
            resolved = candidate
            break
        if resolved and resolved not in changed_files and resolved not in {r['source_file'] for r in rows}:
            backstop.add(resolved)

Path('graphify-out/.scoped_review_radius.json').write_text(
    json.dumps({
        'blast_radius': rows,
        'radius_dropped_count': dropped,
        'radius_dropped_at_hop': dropped_at_hop,
        'import_backstop': sorted(backstop),
        'prior_art': prior_art,
        'seed_count': len(seeds),
    }, indent=2, ensure_ascii=False),
    encoding='utf-8',
)
print(f'{len(seeds)} seed node(s), {len(rows)} blast-radius entries (dropped {dropped}), '
      f'{len(backstop)} import-backstop file(s), {len(prior_art)} prior-art hyperedge(s) '
      f'written to graphify-out/.scoped_review_radius.json')
"
```

Do not invent or widen `HOPS` past 2, or shrink `MAX_RADIUS_NODES` silently, without
updating CLAUDE.md's policy text to match — the manifest's own claims about "1-2 hop
neighborhood" must stay true to what was actually computed. Do not reintroduce
`confidence_score` into the truncation sort key even as a tie-break — see the comment
above the `rows.sort(...)` line for why that's a bug, not a reasonable refinement. The
import-backstop regex is a best-effort match for this repo's actual TypeScript `import
... from '...'` / `require(...)` idioms, not an exhaustive resolver (no path aliases, no
barrel-file re-export following, no unchanged-consumer detection) — if it starts missing
real dependencies in practice, tighten it rather than assuming it's complete, and never
relax the repo-root containment check to "fix" a resolution failure.

## Step 4 — Write the manifest

Write `<change-dir>/review-manifest.md` (e.g.
`openspec/changes/sprint-N-<module>/review-manifest.md`) with this exact section order —
provenance first, so a PUSH agent can tell whether the manifest is even valid before
reading anything it scopes, immediately followed by the advisory line — and **no
interpretive prose**, structural facts only (per CLAUDE.md's guardrail: prose is what the
confirmation-bias mechanism anchors on):

```markdown
# Review manifest — <change name>

**Provenance:** graph corpus_fingerprint <digest and scope from graph.json>, diff base <sha
from .scoped_review_base.txt>, HEAD <sha from .scoped_review_head.txt>. Reviewing: <committed
history only | working tree with uncommitted changes>. Radius capped: <yes/no, N dropped
at hop H if yes>.

**Advisory scope, not evidence. You may read beyond this list. The import-backstop
section below is a partial, disclosed-scope mitigation for graph extraction misses — it
only catches new outgoing imports the diff itself adds, not unchanged files that consume
a changed module, nor dynamic imports. Neither this sentence nor that section is a
completeness guarantee.**

## Diff files (read in full, authoritative)
- <path> (from Step 2's changed-file set: tracked + untracked, base-to-working-tree)
...

## Blast-radius files (1-2 hop neighborhood, capped at MAX_RADIUS_NODES by hop distance only)
| File | Hops | Provenance |
|---|---|---|
| <source_file> | <hops> | EXTRACTED / INFERRED (<score>) |
...
(INFERRED entries, at any score, may only widen scope -- never cite one as sole evidence
for excluding a file, per CLAUDE.md's confidence-asymmetry rule. Discovery above is
provenance-agnostic by design; the provenance column is evidentiary weight, not a filter.)

## Import-backstop files (unconditional w.r.t. confidence, root-contained, partial coverage)
- <path> (resolved from the diff's own added import/require statements)
...

## Prior-art / pattern anchor nodes (hyperedge membership)
- <hyperedge label> (matches: <node ids touched by this round's radius>)
...
```

Populate directly from `graphify-out/.scoped_review_radius.json` (Step 3's output) plus
the diff-files list (Step 2) and the sha/mode values captured in Step 2's
`.scoped_review_*.txt` files — every field above has a concrete source, none of it is a
manual/estimated fill-in.

If a manifest's recorded shas will go stale before use (e.g. more commits land, or the
working tree changes further, after this skill runs but before the PUSH auditors are
dispatched), regenerate it from Step 1, and **void and re-dispatch every PUSH run from the
prior version of the manifest** — do not let a round mix findings computed against two
different manifest versions, and don't treat the lost prompt-cache reuse from
regenerating as a reason to tolerate the skew (there's no cache benefit left to protect
once a manifest changes anyway).

## Step 5 — Hand off

Give the PUSH-mode auditors (consolidator, spec-compliance auditor, code-quality auditor,
final differential-review agent — each on the model floor AGENTS.md sets) a prompt that
opens with the
**identical bytes** of: this manifest, then the change's `design.md`, then its `spec.md`,
in that fixed order — this is what makes real prompt-cache reuse across those specific
roles possible, since caching requires a byte-exact shared prefix. Everything after that
shared block can be role-specific (e.g. the differential-review agent additionally gets
the full diff hunks appended after the shared prefix, not instead of it, and per CLAUDE.md
must treat its manifest as advisory-weak and always resolve the import-backstop section
itself as a mandatory step, not an optional cross-check).

Do not hand this manifest, or any of its contents, to any NONE-mode or PULL-mode role.
Per CLAUDE.md's mode table, that's precisely:
- **PULL** (point at `graphify query`/`explain`/`path` or the MCP server directly, if
  running — no manifest): the fidelity-to-prior-art panelist only.
- **NONE** (no graph contact at all): the requirements-completeness/EARS panelist, the
  adversarial-risk panelist, and the Codex cold audit.

## Cleanup

Delete the working files this skill wrote once the manifest is generated and handed off —
they're intermediate state, not artifacts to commit:

```bash
rm -f graphify-out/.scoped_review_tracked_files.txt graphify-out/.scoped_review_untracked_files.txt \
      graphify-out/.scoped_review_changed_files.txt graphify-out/.scoped_review_head.txt \
      graphify-out/.scoped_review_base.txt graphify-out/.scoped_review_diff.txt \
      graphify-out/.scoped_review_radius.json
```
