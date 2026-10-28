# Midnight Foundation Security Policy

This document outlines security procedures and general policies for the Midnight Foundation.

This policy adheres to the [vulnerability management guidance](https://www.linuxfoundation.org/security)
for Linux Foundation projects.

- [Disclosing a security issue](#disclosing-a-security-issue)
- [Vulnerability management](#vulnerability-management)
- [Threat model](#threat-model)
- [Commit policy](#commit-policy)
- [Suggesting changes](#suggesting-changes)

## Disclosing a security issue

The Midnight foundation takes all security issues seriously, which includes all source code repositories managed
through our [GitHub organization](https://github.com/midnightntwrk). If you believe you have found a security vulnerability in any Midnight Foundation
owned repository, *please report it using GitHub's private vulnerability reporting* and not through public GitHub issues. To learn more about GitHub's
private vulnerability reporting and how to submit a vulnerability report, please review [GitHub's documentation on private reporting](https://docs.github.com/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability).

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

- The repository name or URL
- Type of issue (buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of the source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any particular configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue
- This information will help us triage your report more quickly

A maintainer will acknowledge the report within three (3) business days, and
will send a more detailed response within an additional three (3) business days
indicating the next steps in handling your report.

If you've been unable to successfully draft a vulnerability report via GitHub
or have not received a response during the alloted response window, please
reach out via the [Midnight foundation security contact email](mailto:security@midnight.foundation).

After the initial reply to your report, the maintainers will endeavor to keep
you informed of the progress towards a fix and full announcement, and may ask
for additional information or guidance.

Thank you for improving the security of Midnight. We appreciate your dedication to responsible disclosure and will
make every effort to acknowledge your contributions.

## Vulnerability management

When the maintainers receive a disclosure report, they will assign it to a
primary handler.

This person will coordinate the fix and release process, which involves the
following steps:

- confirming the issue
- determining affected versions of the project
- auditing code to find any potential similar problems
- preparing fixes for all releases under maintenance

## Threat model

UmbraDB's threat model — what it protects, whom it trusts, each trust boundary with its controls, and the known gaps —
is [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md). Read it before deploying; report a way around one of its controls
as a security issue, as above.

## Commit policy

What may go into this repository's git history:

- **No secret of any value is committed.** No key, seed, password or credential with any value, ever: not a mainnet
  one, not a testnet key with funds, not "for now". A file that holds a secret is generated locally, ignored by git and
  created with a restrictive mode, 0600 (only its owner reads and writes it). The Preview test wallet is the example:
  `nix/midnight-env/test-wallets/generate-test-wallet.sh` writes `preview-test-wallet.json` with mode 0600,
  `.gitignore` lists it, and only `preview-test-wallet.example.json`, which holds placeholders, is tracked (see
  `nix/midnight-env/test-wallets/README.md`).
- **One historical finding is suppressed, by its exact fingerprint.** A Preview testnet wallet,
  `nix/midnight-env/test-wallets/preview-test-wallet.json`, was committed before this policy. Preview tDUST has no
  monetary value, so the history was not rewritten, and the file's bytes stay in it. That one finding is suppressed in
  `.gitleaksignore` by its exact fingerprints (commit, path, rule and line: the file's seed and the key derived from
  it), not by a path allowlist in `.gitleaks.toml`, which would exempt the path for ever and hide a real key committed
  there later. `.gitleaks.toml` has no global path allowlist: the template's all-zero placeholder is allowed only in
  the template, by an allowlist of its rule that requires both the path and the value (`condition = "AND"`).
- **CI enforces it.** The `deps` job of `.github/workflows/supply-chain.yml` runs `gitleaks detect` with
  `.gitleaks.toml` over the full git history on every pull request and every push to `main`. A new secret fails it on
  any path, the historical wallet file's included, since the suppression names the finding, not the path.

## Preferred Languages

We prefer all communications to be in English.

## Suggesting changes

If you have suggestions on how this process could be improved please submit an
issue or pull request.
