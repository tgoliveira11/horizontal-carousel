import { CAROUSEL_DRAG_START_THRESHOLD_PX } from "./carousel-constants";

/** Max carousel offset when showing `visibleCount` slides at a time. */
export function carouselMaxOffset(totalCount: number, visibleCount: number): number {
  if (totalCount <= 0 || visibleCount <= 0) return 0;
  return Math.max(0, totalCount - visibleCount);
}

/** Snap drag delta to at most one step left/right. */
export function carouselDragStep(deltaX: number, thresholdPx: number): -1 | 0 | 1 {
  if (deltaX <= -thresholdPx) return 1;
  if (deltaX >= thresholdPx) return -1;
  return 0;
}

/** Pointer movement past this threshold starts a drag (suppresses slide navigation). */
export function carouselDragStarted(
  deltaX: number,
  startThresholdPx = CAROUSEL_DRAG_START_THRESHOLD_PX
): boolean {
  return Math.abs(deltaX) > startThresholdPx;
}
