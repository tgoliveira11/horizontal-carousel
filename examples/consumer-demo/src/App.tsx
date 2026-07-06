import { useEffect, useState } from "react";
import {
  CAROUSEL_ATTR_INTERACTIVE,
  HorizontalCarousel,
  useCarouselVisibleCount,
} from "@tgoliveira/horizontal-carousel";

type DemoItem = {
  id: string;
  title: string;
  subtitle: string;
  tone: "zinc" | "sky" | "emerald" | "amber" | "rose" | "violet";
  href: string;
  showAction?: boolean;
};

const ITEMS: DemoItem[] = [
  {
    id: "1",
    title: "ETH / USDC",
    subtitle: "Mainnet · 0x12…9af3",
    tone: "sky",
    href: "#position-1",
  },
  {
    id: "2",
    title: "wstETH / WETH",
    subtitle: "Arbitrum · 0x8c…21b0",
    tone: "emerald",
    href: "#position-2",
    showAction: true,
  },
  {
    id: "3",
    title: "LINK / USDC",
    subtitle: "Base · 0x44…c812",
    tone: "amber",
    href: "#position-3",
  },
  {
    id: "4",
    title: "AAVE / GHO",
    subtitle: "Mainnet · 0x9a…77de",
    tone: "rose",
    href: "#position-4",
  },
  {
    id: "5",
    title: "cbETH / USDC",
    subtitle: "Optimism · 0xf1…0a44",
    tone: "violet",
    href: "#position-5",
  },
  {
    id: "6",
    title: "UNI / USDT",
    subtitle: "Polygon · 0x2d…991c",
    tone: "zinc",
    href: "#position-6",
  },
];

const TONE_BORDER: Record<DemoItem["tone"], string> = {
  zinc: "border-l-zinc-400",
  sky: "border-l-sky-500",
  emerald: "border-l-emerald-500",
  amber: "border-l-amber-500",
  rose: "border-l-rose-500",
  violet: "border-l-violet-500",
};

function selectedIdFromHash(hash: string): string | null {
  const match = hash.match(/^#position-(\d+)$/);
  return match ? match[1] : null;
}

function DemoCard({
  item,
  isSelected,
  onOpen,
}: {
  item: DemoItem;
  isSelected: boolean;
  onOpen: (item: DemoItem) => void;
}) {
  return (
    <a
      href={item.href}
      aria-current={isSelected ? "page" : undefined}
      className={`group flex h-full min-h-44 cursor-pointer flex-col rounded-lg border border-l-4 border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow-md ${TONE_BORDER[item.tone]} ${
        isSelected ? "ring-2 ring-sky-500 ring-offset-2" : ""
      }`}
      onClick={(event) => {
        event.preventDefault();
        onOpen(item);
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-zinc-900 group-hover:text-sky-700">{item.title}</p>
          <p className="text-xs text-zinc-500">{item.subtitle}</p>
        </div>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
          {isSelected ? "Open" : "Demo"}
        </span>
      </div>
      <p className="mt-4 flex-1 text-sm text-zinc-600">
        Quick tap opens this card. Drag anywhere on the card to scroll the carousel.
      </p>
      {item.showAction ? (
        <button
          type="button"
          {...{ [CAROUSEL_ATTR_INTERACTIVE]: "" }}
          className="mt-4 w-fit rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-50"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            alert(`Action on ${item.title}`);
          }}
        >
          Interactive control
        </button>
      ) : (
        <p className="mt-auto pt-3 text-xs text-zinc-400">Tap card to open</p>
      )}
    </a>
  );
}

export function App() {
  const visibleCount = useCarouselVisibleCount(3, 1);
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    typeof window !== "undefined" ? selectedIdFromHash(window.location.hash) : null
  );

  useEffect(() => {
    const syncFromHash = () => {
      setSelectedId(selectedIdFromHash(window.location.hash));
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, []);

  const openCard = (item: DemoItem) => {
    window.history.pushState(null, "", item.href);
    setSelectedId(item.id);
  };

  const selectedItem = ITEMS.find((item) => item.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Consumer demo
          </p>
          <h1 className="mt-1 text-3xl font-semibold">@tgoliveira/horizontal-carousel</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Cards are links — quick tap opens the position. Drag on a card or gap scrolls the
            carousel without navigating. Card 2 has a nested control marked with{" "}
            <code className="rounded bg-zinc-200 px-1">data-carousel-interactive</code>.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Visible slides: <strong>{visibleCount}</strong>
          </p>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">Positions carousel</h2>

          <HorizontalCarousel
            items={ITEMS}
            visibleCount={visibleCount}
            getItemKey={(item) => item.id}
            className="mt-4"
            slideClassName="px-1.5"
            prevArrowLabel="Show previous demo card"
            nextArrowLabel="Show next demo card"
            renderSlide={(item) => (
              <DemoCard
                item={item}
                isSelected={selectedId === item.id}
                onOpen={openCard}
              />
            )}
          />

          <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            {selectedItem ? (
              <>
                <p className="text-sm font-medium text-zinc-900">
                  Opened: {selectedItem.title}
                </p>
                <p className="mt-1 text-sm text-zinc-600">{selectedItem.subtitle}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  URL hash: <code className="rounded bg-zinc-200 px-1">{selectedItem.href}</code>
                </p>
              </>
            ) : (
              <p className="text-sm text-zinc-500">Tap a card to open it.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
