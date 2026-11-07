# UmbraDB — project instructions

## Keep the knowledge graph current, sprint by sprint

This repo's code, docs, and openspec sprint changes are graphified (`graphify-out/graph.json`,
`GRAPH_REPORT.md`, `graph.html` — committed to this repo so anyone can query prior context
without rebuilding it). **After any sprint's spec is drafted/revised, or its implementation
lands, run `npm run graph:refresh` and commit the refreshed `graphify-out/` outputs in the same
commit (or the sprint close-out commit) as the change that prompted it.** Do not let the graph
silently drift stale behind several sprints' worth of new openspec changes and code — a stale
graph gives wrong answers to "what does the spec say" / "where is this called from" queries
without any obvious signal that it's stale. `npm run graph:check` is that signal: exit 0 means
`graphify-out/` matches the tracked files as they are in the working tree, 1 means it is stale,
2 means it is missing, malformed, or was not written by `graph:refresh`, and 3 is an unexpected
error.

Concretely, add "run `npm run graph:refresh` and commit `graphify-out/`" as a step in every
sprint's own `tasks.md` close-out section (alongside the existing `ROADMAP.md`-update task), not
just as a one-off manual reminder — each sprint's own task list is the durable place this gets
tracked and reviewed, the same as everything else in this project's process.

**Only `npm run graph:refresh` writes `graphify-out/`** — never bare `graphify update .` or the
`/graphify` slash skill. The refresh (`scripts/graphify/`) pins graphify and every dependency by
hash (resolved at least 7 days old) and runs it under Python 3.12 with a fixed hash seed. Each run
copies the tracked files into a temporary snapshot (so `git add` a change's new files before its
close-out refresh) and rebuilds the graph there from scratch: nothing carries over from an earlier
graph, and there is no LLM extraction, so docs contribute heading-level nodes and code its AST. It
then drops nodes that point at no corpus file (graphify's dynamic-import regex also matches
`import("…")` inside comments), names every community after its hub node, writes `graph.json` one
node/link per line with sorted keys so its diff is reviewable, and replaces graphify's
`built_at_commit` with a `corpus_fingerprint` over the same snapshot bytes graphify read. The
output is a pure function of the tracked files and the pins, so CI (`.github/workflows/graph.yml`)
rebuilds it and fails a committed graph that differs, that bare graphify wrote, or that a PR
changed but left stale. To bump graphify, recompile `scripts/graphify/requirements.txt` as its
header describes and update `GRAPHIFY_VERSION` in `scripts/graphify/graph.py`.

Anything else graphify may leave under `graphify-out/` (`.graphify_root`, its `manifest.json`
cache, community-label sidecars, dated backup folders) is machine-local and gitignored.

## Review workflow

The workflow (five stages, three review lanes, bounded review) and the model floors (Claude agents on
the latest Opus model or better, Codex agents on the latest Sol model or better) are in `AGENTS.md`,
which governs Claude and Codex agents alike. Two points matter when a Claude session orchestrates a
review:

- **Keep the cold adversarial lane cold.** Give it only the repository, the diff, the spec and
  acceptance criteria, and its instructions: never earlier findings, verdicts, summaries, a reading
  list, or PR framing. "Measuring and Exploiting Contextual Bias in LLM-Assisted Security Code
  Review" (arXiv 2603.18740) found that such framing cut a reviewer model's vulnerability-detection
  accuracy by up to 93.5 percentage points, and that stripping it recovered 94% of the loss. Tell it
  not to run graphify (a known ~25-minute auto-trigger stall).
- **Graph-scoped review manifests are parked.** No review lane receives a precomputed reading list.
  The mechanism stays, unused, in the `scoped-review-manifest` skill; revisit it only if review cost
  becomes a concern. The knowledge graph itself (above) is still kept current, and any lane except
  the cold adversarial one may query it directly.

## Asking the owner to decide

When something needs the owner's decision — a project unknown, a trade-off, a finding still open
after review — present each one in this shape, so it can be decided without opening other files:

1. **A one-line title** that names the issue, followed by its status: `UNRESOLVED`,
   `UNRESOLVED-BLOCKER` (work cannot continue until it is answered), or `RESOLVED` (with the answer,
   when presenting it again). A longer explanation may follow the title when the issue needs context.
2. **The question itself**, self-contained: it may cite a file or plan step, but must be
   understandable without opening it.
3. **At least one concrete use case** that shows what goes wrong, or what changes, under each answer.
4. **A table with one row per option:** `| OPTION | PROS | CONS |`.
5. **A recommendation**, if you have one, with a one-line reason.

## Unrelated findings go to `docs/issues/` first

When you find a problem outside the change you're working on, don't widen the change: record it as a
numbered file in `docs/issues/` (`00001-short-title.md`, five digits, next free number). Its header
gives the title, a status (`OPEN` or `CLOSED`, with the reason when closed), and a `GitHub:` line that
holds either the issue's URL or exactly `NOT IN GITHUB ISSUE`. Then describe the problem, the evidence
(`file:line`), and a suggested fix.

Issues are tracked on GitHub at `midnightntwrk/umbradb`, but an issue is filed there only after the
owner approves it. Once filed, replace `NOT IN GITHUB ISSUE` with the issue's URL.
