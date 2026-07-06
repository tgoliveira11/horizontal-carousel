# Contributing — branch, PR, and release workflow

> Rules for humans and AI agents working in this repository.

Before starting work, also check:

- [docs/publishing.md](./publishing.md) — npm release process (manual only)
- [CHANGELOG.md](../CHANGELOG.md) — user-facing change log

## Branching

- Branch from **`main`** — there is no `develop` branch.
- Use a typed prefix: `feature/`, `fix/`, `docs/`, or `chore/` (e.g.
  `feature/drag-momentum`, `fix/arrow-focus-ring`).
- CI enforces these prefixes on pull requests (see
  [repo-settings.md](./repo-settings.md)).
- **Do not commit directly to `main`** unless the user explicitly asks.
- **Never push to `main`** without explicit user approval.

## Commits

- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`,
  `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`, etc.
- Focus commit messages on **why**, not a file list.
- **Create commits only when the user asks.** Leave work uncommitted otherwise.

## Pre-PR checklist

Before opening a pull request (or when the user asks you to prepare one):

1. `npm run validate` — typecheck, lint, tests (≥90% coverage), build.
2. Update [`CHANGELOG.md`](../CHANGELOG.md) under `## [Unreleased]` for
   user-visible changes (see [Changelog conventions](#changelog-conventions)).
3. Update [`README.md`](../README.md) when the public API or integration
   requirements change.
4. Confirm no secrets, credentials, or `.env` files are staged.

## Pull requests

- Open a PR with `gh pr create` **only when the user asks**.
- **Do not merge, approve, or push** without explicit user approval.
- **Squash merge** is preferred when merging.
- After merge (when the user handles it): `git checkout main && git pull`, then
  delete the local feature branch.

## Releases and publishing

**npm publish and GitHub Releases are never automatic.** No push, tag, or
`release` event triggers publication.

To cut a release, a human must explicitly dispatch the
[Publish package to npmjs](https://github.com/tgoliveira11/horizontal-carousel/actions/workflows/publish.yml)
workflow on `main`. Agents must **not** run this workflow unless the user
explicitly requests a release.

See [publishing.md](./publishing.md) for the full release process.

## Changelog conventions

Under `## [Unreleased]`, use Keep a Changelog headings:

- `### Added` — new features
- `### Changed` — changes in existing behavior
- `### Fixed` — bug fixes
- `### Removed` — removed features

Use `**Breaking:**` in a bullet to signal a major bump (or minor while pre-1.0).

## Local development

```bash
npm install
npm run validate   # full CI gate locally
npm run test:watch # during development
npm run dev        # watch build
```

Coverage thresholds (90%) apply to `src/**/*.ts` logic modules. React components
(`src/**/*.tsx`) are excluded from coverage — exercise them in consuming apps.
