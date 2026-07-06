"use client";

import { useEffect, useState } from "react";

/** Responsive visible slide count: `visibleLg` at `min-width: breakpointPx`, else `visibleSm`. */
export function useCarouselVisibleCount(
  visibleLg: number,
  visibleSm: number,
  breakpointPx = 1024
): number {
  const [visible, setVisible] = useState(visibleLg);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    const sync = () => setVisible(mq.matches ? visibleLg : visibleSm);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [visibleLg, visibleSm, breakpointPx]);

  return visible;
}
