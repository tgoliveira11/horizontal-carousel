"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  CAROUSEL_ATTR_GRAB_ARMED,
  CAROUSEL_ATTR_SLIDE,
  CAROUSEL_DRAG_START_THRESHOLD_PX,
  CAROUSEL_GRAB_DWELL_CANCEL_MOVE_PX,
  CAROUSEL_GRAB_DWELL_MS,
  CAROUSEL_SNAP_THRESHOLD_PX,
} from "./carousel-constants";
import { isCarouselInteractiveTarget } from "./carousel-interaction";
import {
  carouselDragStarted,
  carouselDragStep,
  carouselMaxOffset,
} from "./carousel-math";

function CarouselArrow({
  direction,
  onClick,
  label,
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-xl text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400 ${
        direction === "left"
          ? "left-0 -translate-x-full -translate-y-1/2"
          : "right-0 translate-x-full -translate-y-1/2"
      }`}
    >
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}

const SLIDE_SELECTOR = `[${CAROUSEL_ATTR_SLIDE}]`;

export type HorizontalCarouselProps<T> = {
  items: T[];
  visibleCount: number;
  getItemKey: (item: T, index: number) => string;
  renderSlide: (item: T, index: number) => ReactNode;
  className?: string;
  slideClassName?: string;
  prevArrowLabel?: string;
  nextArrowLabel?: string;
};

export function HorizontalCarousel<T>({
  items,
  visibleCount,
  getItemKey,
  renderSlide,
  className,
  slideClassName,
  prevArrowLabel = "Show previous slide",
  nextArrowLabel = "Show next slide",
}: HorizontalCarouselProps<T>) {
  const [offset, setOffset] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [armedSlideKey, setArmedSlideKey] = useState<string | null>(null);

  const pointerStartX = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const suppressNextClickRef = useRef(false);
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dwellAnchorRef = useRef<{ slideKey: string; x: number; y: number } | null>(null);

  const maxOffset = carouselMaxOffset(items.length, visibleCount);
  const activeOffset = Math.min(offset, maxOffset);
  const canScroll = maxOffset > 0;

  const goLeft = useCallback(() => {
    setOffset((current) => Math.max(0, current - 1));
  }, []);

  const goRight = useCallback(() => {
    setOffset((current) => Math.min(maxOffset, current + 1));
  }, [maxOffset]);

  const canGoLeft = activeOffset > 0;
  const canGoRight = activeOffset < maxOffset;

  const clearDwell = useCallback(() => {
    if (dwellTimerRef.current != null) {
      clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }
    dwellAnchorRef.current = null;
    setArmedSlideKey(null);
  }, []);

  const startDwellTimer = useCallback((slideKey: string) => {
    if (dwellTimerRef.current != null) {
      clearTimeout(dwellTimerRef.current);
    }
    dwellTimerRef.current = setTimeout(() => {
      dwellTimerRef.current = null;
      setArmedSlideKey(slideKey);
    }, CAROUSEL_GRAB_DWELL_MS);
  }, []);

  const resetDrag = useCallback(() => {
    pointerStartX.current = null;
    draggingRef.current = false;
    setIsDragging(false);
    setDragPx(0);
  }, []);

  useEffect(() => {
    if (!canScroll) {
      if (dwellTimerRef.current != null) {
        clearTimeout(dwellTimerRef.current);
        dwellTimerRef.current = null;
      }
      dwellAnchorRef.current = null;
    }
  }, [canScroll]);

  useEffect(() => {
    return () => {
      if (dwellTimerRef.current != null) {
        clearTimeout(dwellTimerRef.current);
      }
    };
  }, []);

  const updateDwellFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canScroll || draggingRef.current || pointerStartX.current != null) return;

    if (isCarouselInteractiveTarget(event.target)) {
      clearDwell();
      return;
    }

    const slide = event.target instanceof Element ? event.target.closest(SLIDE_SELECTOR) : null;
    if (!slide) {
      clearDwell();
      return;
    }

    const slideKey = slide.getAttribute(CAROUSEL_ATTR_SLIDE);
    if (!slideKey) {
      clearDwell();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const anchor = dwellAnchorRef.current;

    if (anchor?.slideKey === slideKey) {
      const moved = Math.hypot(x - anchor.x, y - anchor.y);
      if (moved > CAROUSEL_GRAB_DWELL_CANCEL_MOVE_PX) {
        clearDwell();
        dwellAnchorRef.current = { slideKey, x, y };
        startDwellTimer(slideKey);
        return;
      }
      return;
    }

    clearDwell();
    dwellAnchorRef.current = { slideKey, x, y };
    startDwellTimer(slideKey);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (isCarouselInteractiveTarget(event.target)) return;

    clearDwell();
    pointerStartX.current = event.clientX;
    draggingRef.current = false;
    setIsDragging(false);
    setDragPx(0);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    updateDwellFromPointer(event);

    if (pointerStartX.current == null) return;
    const delta = event.clientX - pointerStartX.current;
    if (
      !draggingRef.current &&
      carouselDragStarted(delta, CAROUSEL_DRAG_START_THRESHOLD_PX)
    ) {
      draggingRef.current = true;
      setIsDragging(true);
      clearDwell();
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
    }
    if (draggingRef.current) {
      setDragPx(delta);
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current == null) return;
    const delta = event.clientX - pointerStartX.current;

    if (draggingRef.current) {
      const step = carouselDragStep(delta, CAROUSEL_SNAP_THRESHOLD_PX);
      if (step === 1 && canGoRight) goRight();
      if (step === -1 && canGoLeft) goLeft();
      suppressNextClickRef.current = true;
    }

    resetDrag();
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* capture may already be released */
    }
  };

  const onPointerLeave = () => {
    if (pointerStartX.current == null) {
      clearDwell();
    }
  };

  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressNextClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressNextClickRef.current = false;
  };

  const effectiveArmedSlideKey = canScroll ? armedSlideKey : null;

  if (items.length === 0) return null;

  const slidePercent = 100 / visibleCount;
  const transform = isDragging
    ? `translateX(calc(-${activeOffset * slidePercent}% + ${dragPx}px))`
    : `translateX(-${activeOffset * slidePercent}%)`;

  const trackClassName = [
    "flex touch-pan-x",
    canScroll && !isDragging
      ? "cursor-pointer [&_[data-carousel-interactive]]:cursor-pointer [&_[data-carousel-grab-armed]>_*]:cursor-grab"
      : "",
    isDragging ? "touch-none select-none cursor-grabbing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`relative overflow-visible ${className ?? ""}`}>
      {canGoLeft ? (
        <CarouselArrow direction="left" onClick={goLeft} label={prevArrowLabel} />
      ) : null}
      {canGoRight ? (
        <CarouselArrow direction="right" onClick={goRight} label={nextArrowLabel} />
      ) : null}

      <div className="overflow-hidden">
        <div
          className={trackClassName}
          style={{
            transform,
            transition: isDragging ? "none" : "transform 200ms ease-out",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerLeave}
          onClickCapture={onClickCapture}
        >
          {items.map((item, index) => {
            const slideKey = getItemKey(item, index);
            const isArmed = effectiveArmedSlideKey === slideKey;
            return (
              <div
                key={slideKey}
                {...{ [CAROUSEL_ATTR_SLIDE]: slideKey }}
                {...(isArmed ? { [CAROUSEL_ATTR_GRAB_ARMED]: "" } : {})}
                className={`shrink-0 ${slideClassName ?? ""}`}
                style={{ width: `${slidePercent}%` }}
              >
                {renderSlide(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
