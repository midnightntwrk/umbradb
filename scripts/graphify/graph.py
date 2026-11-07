"""Refresh or check graphify-out/, the repo's committed knowledge graph.

Run through scripts/graphify/run.sh (`npm run graph:refresh` / `npm run graph:check`), never
directly: run.sh supplies the pinned graphify environment and the fixed hash seed this relies on.

`refresh` copies every tracked file (its working-tree content) into a temporary snapshot, runs the
pinned `graphify update .` there from scratch, and post-processes the output, so every committed
file in graphify-out/ is a pure function of the snapshot and the pinned tool versions:

  * graphify never sees a previous graph, so nothing survives from an earlier run. In particular
    there is no LLM-extracted layer: Markdown contributes heading-level nodes, code its AST;
  * the corpus is exactly the snapshot. Untracked files, a local graphify config, and edits made
    while the refresh runs cannot reach it, and the fingerprint covers the same bytes graphify read;
  * nodes whose source_file is not a corpus file are dropped, with their edges. graphify's
    dynamic-import rescue is a regex over raw source text, so `import("X")` inside a comment or
    string mints a node for a file that does not exist. Nodes with no source_file are kept only
    when they are external module references;
  * every community is named after its hub node (graphify's own LLM-free labeler), so names
    never depend on a local label sidecar or an LLM run;
  * graph.json is written one node / link / hyperedge per line with sorted keys, so a diff
    shows exactly which nodes and edges changed (graphify itself always writes one line);
  * built_at_commit is replaced by corpus_fingerprint, a content hash of the snapshot's corpus
    and graphify config files plus the tool versions. Freshness is a property of content, not of
    a commit sha: a graph committed alongside the code it describes is never stamped with its
    own commit.

Only tracked files are graphed, so `git add` a change's new files before its close-out refresh.

`check` rebuilds the same snapshot, recomputes the fingerprint, and validates the committed form.
Exit codes: 0 fresh, 1 stale (the corpus or a pinned version changed since the last refresh),
2 invalid (graph.json is missing, malformed, or was not produced by `refresh`), 3 unexpected error.
"""

from __future__ import annotations

import argparse
import contextlib
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import traceback
from importlib.metadata import version as package_version
from pathlib import Path

GRAPHIFY_VERSION = "0.9.89"
PYTHON_MINOR = "3.12"
# Bump whenever the post-processing below changes what it writes, so graphs produced by the
# previous rules read as stale.
POSTPROCESS_VERSION = 2

OUT = Path("graphify-out")
GRAPH = OUT / "graph.json"
REPORT = OUT / "GRAPH_REPORT.md"
HTML = OUT / "graph.html"
# graphify's incremental-update cache: per-machine mtimes and timestamps. Never committed, and
# removed if an older pipeline left one behind.
MANIFEST = OUT / "manifest.json"
# Files graphify reads as configuration rather than corpus. They change what it extracts, so a
# tracked one is part of the fingerprint.
CONFIG_FILES = (".graphifyrc", ".graphifyignore")

EXIT_STALE = 1
EXIT_INVALID = 2
EXIT_ERROR = 3


def fail(message: str, code: int) -> None:
    print(f"graph: {message}", file=sys.stderr)
    raise SystemExit(code)


def check_environment() -> None:
    if not Path(".git").exists():
        fail("run from the repository root (use scripts/graphify/run.sh)", EXIT_INVALID)
    if sys.flags.hash_randomization:
        fail("PYTHONHASHSEED must be 0 (use scripts/graphify/run.sh)", EXIT_INVALID)
    if f"{sys.version_info.major}.{sys.version_info.minor}" != PYTHON_MINOR:
        fail(f"needs Python {PYTHON_MINOR}, running {sys.version.split()[0]}", EXIT_INVALID)
    installed = package_version("graphifyy")
    if installed != GRAPHIFY_VERSION:
        fail(f"needs graphifyy {GRAPHIFY_VERSION}, found {installed}", EXIT_INVALID)
    # GRAPHIFY_* variables change graphify's behaviour (output dir, viz limit, backups, shrink
    # guard); none may leak in from the caller's shell.
    for name in [n for n in os.environ if n.startswith("GRAPHIFY_")]:
        del os.environ[name]


def git_lines(*args: str) -> list[str]:
    out = subprocess.run(["git", *args], check=True, capture_output=True).stdout
    return [p.decode("utf-8") for p in out.split(b"\0") if p]


def under_symlink(path: str) -> bool:
    """True if the path or any directory above it is a symlink."""
    parts = Path(path).parts
    return any(Path(*parts[:i]).is_symlink() for i in range(1, len(parts) + 1))


@contextlib.contextmanager
def snapshot():
    """A temporary git repository holding a copy of every tracked file's working-tree content.

    graphify-out/ is left out so graphify never starts from a previous graph. Deleted files,
    submodules, symlinks, and files under a symlinked directory are skipped (graphify does not
    follow symlinks either). Every copied file is recorded in the snapshot's own index: graphify
    keeps git-tracked files even when a .gitignore rule matches them, exactly as it would in the
    checkout. The paths are recorded intent-to-add (`git add -N`), which reads no file content,
    and with the caller's global and system git configuration shut out, so no clean filter,
    attributes file, or fsmonitor from the host can run or fail.
    """
    with tempfile.TemporaryDirectory(prefix="umbradb-graph-") as tmp:
        root = Path(tmp)
        copied = []
        for path in git_lines("ls-files", "-z"):
            if path == OUT.as_posix() or path.startswith(OUT.as_posix() + "/"):
                continue
            src = Path(path)
            if under_symlink(path) or not src.is_file():
                continue
            target = root / path
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, target)
            copied.append(path)
        # Literal pathspecs, so a tracked name containing *, ? or [ is not read as a pattern.
        git = ["git", "--literal-pathspecs", "-C", str(root)]
        env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}
        env.update(GIT_CONFIG_NOSYSTEM="1", GIT_CONFIG_SYSTEM=os.devnull,
                   GIT_CONFIG_GLOBAL=os.devnull, HOME=tmp, XDG_CONFIG_HOME=tmp)
        subprocess.run([*git, "init", "-q"], check=True, env=env)
        # graphify later runs `git ls-files` here with the caller's environment; local settings
        # override any global fsmonitor or untracked cache it would otherwise start.
        for key, value in (("core.fsmonitor", "false"), ("core.untrackedCache", "false")):
            subprocess.run([*git, "config", key, value], check=True, env=env)
        subprocess.run([*git, "add", "-N", "-f", "--pathspec-from-file=-", "--pathspec-file-nul"],
                       input=b"\0".join(p.encode("utf-8") for p in copied), check=True, env=env)
        yield root


@contextlib.contextmanager
def inside(path: Path):
    previous = Path.cwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(previous)


def scan(root: Path) -> tuple[dict, list[str]]:
    """graphify's own corpus detection over the snapshot, with the arguments `graphify update` uses."""
    from graphify.detect import detect

    with inside(root):
        here = Path.cwd().resolve()
        detection = detect(Path("."), follow_symlinks=False, gitignore=True)
        files = sorted(
            Path(f).resolve().relative_to(here).as_posix()
            for paths in detection["files"].values()
            for f in paths
        )
    return detection, files


def fingerprint(root: Path, files: list[str]) -> dict:
    configs = [name for name in CONFIG_FILES if (root / name).is_file()]
    meta = {
        "algorithm": "sha256",
        "configs": configs,
        "files": len(files),
        "graphify": GRAPHIFY_VERSION,
        "postprocess": POSTPROCESS_VERSION,
        "python": PYTHON_MINOR,
        "scope": "tracked",
    }
    digest = hashlib.sha256(json.dumps(meta, sort_keys=True).encode() + b"\n")
    for path in configs + files:
        content = hashlib.sha256((root / path).read_bytes()).hexdigest()
        digest.update(path.encode("utf-8") + b"\0" + content.encode() + b"\n")
    return {**meta, "digest": digest.hexdigest()}


def dump_canonical(data: dict) -> str:
    """graph.json with one node / link / hyperedge per line and sorted keys."""

    def enc(value) -> str:
        return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))

    keys = sorted(data)
    lines = ["{"]
    for i, key in enumerate(keys):
        value = data[key]
        comma = "," if i < len(keys) - 1 else ""
        if key in ("nodes", "links", "hyperedges") and isinstance(value, list) and value:
            lines.append(f"{enc(key)}:[")
            lines += [enc(item) + ("," if j < len(value) - 1 else "") for j, item in enumerate(value)]
            lines.append("]" + comma)
        else:
            lines.append(f"{enc(key)}:{enc(value)}{comma}")
    lines.append("}")
    return "\n".join(lines) + "\n"


def write_atomic(path: Path, text: str) -> None:
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    os.replace(tmp, path)


def junk_node_ids(nodes: list[dict], corpus: set[str]) -> list[str]:
    """Nodes pointing at a file outside the corpus, or at no file without being external modules."""
    junk = []
    for n in nodes:
        source = n.get("source_file")
        if source and source not in corpus:
            junk.append(n["id"])
        elif not source and n.get("type") != "external":
            junk.append(n["id"])
    return junk


def freshness_section(fp: dict) -> list[str]:
    return [
        "## Graph Freshness",
        f"- Corpus fingerprint: `{fp['digest'][:16]}` ({fp['files']} tracked files, "
        f"graphify {fp['graphify']}, Python {fp['python']}, post-process v{fp['postprocess']})",
        "- `npm run graph:check` recomputes it: exit 0 means the graph matches the tracked files.",
        "- `npm run graph:refresh` rebuilds the graph from scratch (no LLM, deterministic).",
        "",
    ]


def postprocess(raw: dict, detection: dict, files: list[str], fp: dict) -> None:
    from graphify.analyze import god_nodes, suggest_questions, surprising_connections
    from graphify.cluster import label_communities_by_hub, score_all
    from graphify.export import to_html
    from graphify.exporters.html import _viz_node_limit
    from graphify.paths import load_node_link_graph
    from graphify.report import generate

    data = raw
    if data.get("directed") or data.get("multigraph"):
        fail("graphify wrote a directed or multi graph; the tooling assumes neither", EXIT_INVALID)

    junk = set(junk_node_ids(data["nodes"], set(files)))
    if junk:
        print(f"graph: dropping {len(junk)} node(s) with no file in the corpus: "
              + ", ".join(sorted(repr(n.get("source_file") or n["id"]) for n in data["nodes"] if n["id"] in junk)))
    data["nodes"] = [n for n in data["nodes"] if n["id"] not in junk]
    data["links"] = [e for e in data["links"] if e["source"] not in junk and e["target"] not in junk]

    def prune_hyperedges(hyperedges: list[dict]) -> list[dict]:
        kept = []
        for h in hyperedges:
            members = [m for m in h.get("nodes", []) if m not in junk]
            if len(members) >= 2:
                kept.append({**h, "nodes": members})
        return kept

    data["hyperedges"] = prune_hyperedges(data.get("hyperedges", []))
    if isinstance(data.get("graph"), dict) and "hyperedges" in data["graph"]:
        data["graph"]["hyperedges"] = prune_hyperedges(data["graph"]["hyperedges"])

    G = load_node_link_graph(data)
    communities: dict[int, list[str]] = {}
    for node in data["nodes"]:
        if node.get("community") is not None:
            communities.setdefault(int(node["community"]), []).append(node["id"])
    labels = label_communities_by_hub(G, communities)
    for node in data["nodes"]:
        if node.get("community") is not None:
            node["community_name"] = labels[int(node["community"])]

    data.pop("built_at_commit", None)
    data["corpus_fingerprint"] = fp
    canonical = dump_canonical(data)
    write_atomic(GRAPH, canonical)

    # Derive the report and HTML from the canonical form: the HTML exporter serializes
    # hyperedges in their dict key order, which must not depend on what graphify wrote.
    G = load_node_link_graph(json.loads(canonical))
    cohesion = score_all(G, communities)
    questions = suggest_questions(G, communities, labels)
    # detect()'s size warning is about the cost of LLM extraction, which this pipeline never runs.
    corpus_check = {k: v for k, v in detection.items() if k != "warning"}
    report = generate(G, communities, cohesion, labels, god_nodes(G),
                      surprising_connections(G, communities), corpus_check,
                      {"input": 0, "output": 0}, ".", suggested_questions=questions)
    lines = report.split("\n")
    # graphify titles the report with the checkout's directory name and today's date.
    lines[0] = "# Graph Report - UmbraDB"
    summary = lines.index("## Summary")
    after = next((i for i in range(summary + 1, len(lines)) if lines[i].startswith("## ")), len(lines))
    lines[after:after] = freshness_section(fp)
    write_atomic(REPORT, "\n".join(lines))

    # The exporter loads a .graphify_learning.json sidecar from beside its output file whenever
    # it is not handed an overlay, and its aggregated path for large graphs drops the one passed
    # in, so it renders into an empty directory. It also titles the page with the output path
    # from the first graphify-out component onward, so the path it is given is the fixed
    # relative "graphify-out/graph.html", never an absolute temporary one.
    with tempfile.TemporaryDirectory(prefix="umbradb-graph-html-") as tmp:
        with inside(Path(tmp)):
            OUT.mkdir()
            written = to_html(G, communities, HTML.as_posix(), community_labels=labels,
                              node_limit=_viz_node_limit(), learning_overlay={})
        if not written:
            # graphify skips the HTML on purpose for an oversized graph with a single community.
            HTML.unlink(missing_ok=True)
            print("graph: graphify skipped graph.html for this graph; removed the old one")
        else:
            staged = HTML.with_name(HTML.name + ".tmp")
            shutil.copyfile(Path(tmp) / HTML, staged)
            os.replace(staged, HTML)
    print(f"graph: {len(data['nodes'])} nodes, {len(data['links'])} links, "
          f"{len(communities)} communities; fingerprint {fp['digest'][:16]} ({fp['files']} files)")


def refresh() -> None:
    check_environment()
    with snapshot() as root:
        detection, files = scan(root)
        fp = fingerprint(root, files)
        env = {**os.environ, "GRAPHIFY_NO_BACKUP": "1", "GRAPHIFY_NO_TIPS": "1", "PYTHONHASHSEED": "0"}
        try:
            subprocess.run([sys.executable, "-s", "-P", "-m", "graphify", "update", "."],
                           check=True, env=env, cwd=root)
        except subprocess.CalledProcessError:
            fail("graphify update failed in the snapshot", EXIT_INVALID)
        raw = load_graph(root / GRAPH)
        OUT.mkdir(exist_ok=True)
        postprocess(raw, detection, files, fp)
    MANIFEST.unlink(missing_ok=True)


def load_graph(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"{path} is missing; run npm run graph:refresh", EXIT_INVALID)
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        fail(f"{path} is not valid JSON ({error}); run npm run graph:refresh", EXIT_INVALID)


def check() -> None:
    check_environment()
    data = load_graph(GRAPH)
    text = GRAPH.read_text(encoding="utf-8")
    stored = data.get("corpus_fingerprint") if isinstance(data, dict) else None
    if not isinstance(stored, dict) or stored.get("scope") != "tracked":
        fail(f"{GRAPH} has no tracked-scope corpus_fingerprint, so it was not written by "
             "npm run graph:refresh (bare `graphify update` output is not accepted)", EXIT_INVALID)
    if text != dump_canonical(data):
        fail(f"{GRAPH} is not in canonical form; run npm run graph:refresh", EXIT_INVALID)
    if data.get("directed") or data.get("multigraph"):
        fail(f"{GRAPH} is directed or a multigraph", EXIT_INVALID)

    with snapshot() as root:
        _, files = scan(root)
        current = fingerprint(root, files)
    if current != stored:
        changed = [k for k in sorted(current) if k != "digest" and current[k] != stored.get(k)]
        detail = f" ({', '.join(f'{k}: {stored.get(k)} -> {current[k]}' for k in changed)})" if changed else ""
        fail(f"stale: the corpus or pinned tools changed since the last refresh{detail}; "
             "run npm run graph:refresh", EXIT_STALE)
    junk = junk_node_ids(data["nodes"], set(files))
    if junk:
        fail(f"{len(junk)} node(s) have no file in the corpus: {junk[:5]}", EXIT_INVALID)
    print(f"graph: fresh (fingerprint {current['digest'][:16]}, {current['files']} tracked files)")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("refresh", help="rebuild graphify-out/ from scratch")
    sub.add_parser("check", help="verify graphify-out/ matches the tracked files")
    args = parser.parse_args()
    try:
        refresh() if args.command == "refresh" else check()
    except SystemExit:
        raise
    except BaseException:
        # Python's default exit status for an uncaught exception is 1, which would read as
        # "stale" to callers that branch on it.
        traceback.print_exc()
        raise SystemExit(EXIT_ERROR)


if __name__ == "__main__":
    main()
