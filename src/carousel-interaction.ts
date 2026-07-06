import { CAROUSEL_ATTR_INTERACTIVE } from "./carousel-constants";

const CAROUSEL_INTERACTIVE_SELECTOR = `[${CAROUSEL_ATTR_INTERACTIVE}]`;

/** True when the event target is inside a carousel-exempt interactive zone. */
export function isCarouselInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return target.closest(CAROUSEL_INTERACTIVE_SELECTOR) != null;
}
