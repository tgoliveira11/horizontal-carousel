# @tgoliveira/horizontal-carousel

Horizontal carousel for React with arrow navigation, pointer drag, and dwell-to-grab UX.

Extracted from [liqsense](https://github.com/tgoliveira11/liqsense).

## Install

```bash
npm install @tgoliveira/horizontal-carousel
```

Peer dependencies: `react` and `react-dom` (v18+).

This component uses [Tailwind CSS](https://tailwindcss.com/) utility classes. Your app must include Tailwind and scan the package source (or `dist`) so those classes are generated:

```css
@import "tailwindcss";
@source "../node_modules/@tgoliveira/horizontal-carousel/dist";
```

When linking the library from a monorepo path, point `@source` at the package `src/` or `dist/` folder instead.

Critical layout styles (`overflow`, `flex`, slide width) are also set inline so the carousel remains functional even if a few utility classes are missing.

## Usage

```tsx
"use client";

import {
  HorizontalCarousel,
  useCarouselVisibleCount,
  CAROUSEL_ATTR_INTERACTIVE,
} from "@tgoliveira/horizontal-carousel";

type Item = { id: string; title: string };

const items: Item[] = [
  { id: "1", title: "Slide 1" },
  { id: "2", title: "Slide 2" },
  { id: "3", title: "Slide 3" },
];

export function ExampleCarousel() {
  const visibleCount = useCarouselVisibleCount(3, 1);

  return (
    <HorizontalCarousel
      items={items}
      visibleCount={visibleCount}
      getItemKey={(item) => item.id}
      renderSlide={(item) => (
        <div className="rounded-lg border border-zinc-200 p-4">
          <h3>{item.title}</h3>
          <button type="button" {...{ [CAROUSEL_ATTR_INTERACTIVE]: "" }}>
            Action
          </button>
        </div>
      )}
    />
  );
}
```

## Interaction model

- **Arrows** — appear when more slides exist off-screen.
- **Drag** — horizontal pointer drag snaps one slide at a time (8px start threshold, 48px snap).
- **Dwell-to-grab** — after ~350ms on a free slide area, the cursor switches to grab; quick taps still propagate to slide content.
- **Interactive zones** — mark buttons/links inside slides with `data-carousel-interactive` so they keep pointer cursor and do not start a drag.

## API

### `HorizontalCarousel<T>`

| Prop | Type | Description |
|------|------|-------------|
| `items` | `T[]` | Slide data |
| `visibleCount` | `number` | Slides visible at once |
| `getItemKey` | `(item, index) => string` | Stable React key |
| `renderSlide` | `(item, index) => ReactNode` | Slide content |
| `className` | `string?` | Root wrapper classes |
| `slideClassName` | `string?` | Per-slide wrapper classes |
| `prevArrowLabel` | `string?` | Accessible label for left arrow |
| `nextArrowLabel` | `string?` | Accessible label for right arrow |

### `useCarouselVisibleCount(visibleLg, visibleSm, breakpointPx?)`

Returns `visibleLg` at `min-width: breakpointPx` (default 1024), otherwise `visibleSm`.

### Utilities

- `carouselMaxOffset`, `carouselDragStep`, `carouselDragStarted` — math helpers
- `isCarouselInteractiveTarget` — DOM helper for interactive zones
- `CAROUSEL_ATTR_*` — data attribute names and tuning constants

## Development

```bash
npm install
npm run validate   # typecheck, lint, tests + coverage, build
npm test
npm run build
```

### Consumer demo

Local Vite app under `examples/consumer-demo/` (not published with the package):

```bash
npm run demo:dev
```

See [examples/consumer-demo/README.md](examples/consumer-demo/README.md).

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch, PR, and release workflow.

## License

MIT
