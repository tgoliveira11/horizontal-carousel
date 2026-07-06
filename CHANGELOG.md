# Changelog

All notable changes to `@tgoliveira/horizontal-carousel` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Conventions for contributors and agents: [docs/contributing.md](./docs/contributing.md#changelog-conventions).

## [Unreleased]

### Added

- `examples/consumer-demo/` — local Vite app (not published) with link cards, drag
  vs tap, and `data-carousel-interactive` nested control.
- Root scripts: `demo:dev`, `demo:build`, `demo:preview`.
- README and demo docs: Tailwind `@source` requirement for library utility classes.
- `docs/publishing.md` bootstrap publish notes (`--provenance=false`, OTP / granular token).

### Fixed

- Drag on slide content (e.g. full-card `<a>` / `<Link>`) via window pointer
  listeners during an active gesture; gap-only drag was a symptom of pointer events
  staying on nested elements.
- Grab cursor on slide padding and card surfaces; `data-carousel-interactive`
  zones keep pointer cursor.
- Critical layout inline styles (`overflow`, `display: flex`, slide `width` /
  `flexShrink`) so the carousel works when Tailwind does not scan the package.

### Changed

- Pointer handling: capture-phase press, window `pointermove` / `pointerup` during
  gesture, `dragstart` suppression; link/card click is suppressed only after a drag
  snap (quick tap still navigates).

## [0.1.0] - 2026-07-06

### Added

- Initial extraction from liqsense: `HorizontalCarousel` with arrow navigation,
  pointer drag (8px start, 48px snap), and dwell-to-grab UX (~350ms).
- `useCarouselVisibleCount` hook for responsive visible slide counts.
- Carousel math and interaction utilities (`carouselMaxOffset`, `carouselDragStep`,
  `isCarouselInteractiveTarget`, `data-carousel-interactive` zones).
- CI (`validate` on push/PR), manual npm publish workflow with OIDC provenance,
  and release scripts modeled on outpost.
