# Consumer demo

Local Vite app that imports `@tgoliveira/horizontal-carousel` from the repo source (not from npm).

`src/index.css` uses `@source "../../../src"` so Tailwind picks up utility classes from the library.

This folder is **not** published with the package (`files` in the root `package.json` only ships `dist/`).

## Run

From the repository root:

```bash
npm run demo:dev
```

Or from this directory:

```bash
npm install
npm run dev
```

Opens http://localhost:5180

## What it exercises

- `useCarouselVisibleCount(3, 1)` responsive layout
- `slideClassName="px-1.5"` gap between cards
- Full-card links (drag vs quick tap)
- `data-carousel-interactive` on a nested button (card 2)
