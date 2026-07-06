# Changelog

All notable changes to `@tgoliveira/horizontal-carousel` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Conventions for contributors: [docs/contributing.md](./docs/contributing.md#changelog-conventions).

## [Unreleased]

## [0.1.0] - 2026-07-06

### Added

- Initial extraction from liqsense: `HorizontalCarousel` with arrow navigation,
  pointer drag (8px start, 48px snap), and dwell-to-grab UX (~350ms).
- `useCarouselVisibleCount` hook for responsive visible slide counts.
- Carousel math and interaction utilities (`carouselMaxOffset`, `carouselDragStep`,
  `isCarouselInteractiveTarget`, `data-carousel-interactive` zones).
- CI (`validate` on push/PR), manual npm publish workflow with OIDC provenance,
  and release scripts modeled on outpost.
