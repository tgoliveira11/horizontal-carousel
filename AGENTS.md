# Agent notes — horizontal-carousel

Read before changing this repo:

- [docs/contributing.md](./docs/contributing.md) — branch/PR workflow, pre-PR checklist
- [docs/publishing.md](./docs/publishing.md) — manual-only npm releases
- [CHANGELOG.md](./CHANGELOG.md) — **update `## [Unreleased]` for every user-visible change**

## Changelog (required)

Whenever you change library behavior, public API, integration requirements, or
shipped docs, add bullets under `## [Unreleased]` in [CHANGELOG.md](./CHANGELOG.md)
before finishing the task — same convention as
[outpost](https://github.com/tgoliveira11/outpost) (`docs/contributing.md` +
`AGENTS.md`). Do not wait for the user to ask.

Use headings: `### Added`, `### Changed`, `### Fixed`, `### Removed`.

## Consumer integration

`renderSlide` may return clickable content (`<a>`, Next.js `<Link>`, etc.). Quick
tap triggers normal navigation; drag scrolls the carousel and suppresses the
following click. Mark nested controls with `data-carousel-interactive` so they do
not start a drag.

## Hard rules

- Branch prefixes: `feature/`, `fix/`, `docs/`, `chore/`
- No commits or pushes to `main` unless the user explicitly asks
- Never run the publish workflow unless the user explicitly requests it
