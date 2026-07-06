import { describe, expect, it } from "vitest";
import { CAROUSEL_ATTR_INTERACTIVE } from "../src/carousel-constants";
import { isCarouselInteractiveTarget } from "../src/carousel-interaction";

describe("isCarouselInteractiveTarget", () => {
  it("returns false for null and non-elements", () => {
    expect(isCarouselInteractiveTarget(null)).toBe(false);
    expect(isCarouselInteractiveTarget(document)).toBe(false);
  });

  it("returns true when target is inside an interactive zone", () => {
    const root = document.createElement("div");
    const interactive = document.createElement("button");
    interactive.setAttribute(CAROUSEL_ATTR_INTERACTIVE, "");
    const child = document.createElement("span");
    interactive.appendChild(child);
    root.appendChild(interactive);

    expect(isCarouselInteractiveTarget(interactive)).toBe(true);
    expect(isCarouselInteractiveTarget(child)).toBe(true);
  });

  it("returns false outside interactive zones", () => {
    const root = document.createElement("div");
    const slide = document.createElement("div");
    const child = document.createElement("span");
    slide.appendChild(child);
    root.appendChild(slide);

    expect(isCarouselInteractiveTarget(slide)).toBe(false);
    expect(isCarouselInteractiveTarget(child)).toBe(false);
  });
});
