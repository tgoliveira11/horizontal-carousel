import { describe, expect, it } from "vitest";
import {
  carouselDragStarted,
  carouselDragStep,
  carouselMaxOffset,
} from "../src/carousel-math";

describe("carouselMaxOffset", () => {
  it("returns total minus visible when both are positive", () => {
    expect(carouselMaxOffset(5, 3)).toBe(2);
  });

  it("returns 0 when all items fit", () => {
    expect(carouselMaxOffset(3, 3)).toBe(0);
    expect(carouselMaxOffset(2, 5)).toBe(0);
  });

  it("returns 0 for invalid counts", () => {
    expect(carouselMaxOffset(0, 3)).toBe(0);
    expect(carouselMaxOffset(5, 0)).toBe(0);
  });
});

describe("carouselDragStep", () => {
  it("snaps right when dragged left past threshold", () => {
    expect(carouselDragStep(-48, 48)).toBe(1);
    expect(carouselDragStep(-100, 48)).toBe(1);
  });

  it("snaps left when dragged right past threshold", () => {
    expect(carouselDragStep(48, 48)).toBe(-1);
    expect(carouselDragStep(100, 48)).toBe(-1);
  });

  it("returns 0 within threshold", () => {
    expect(carouselDragStep(0, 48)).toBe(0);
    expect(carouselDragStep(20, 48)).toBe(0);
    expect(carouselDragStep(-20, 48)).toBe(0);
  });
});

describe("carouselDragStarted", () => {
  it("starts after default threshold", () => {
    expect(carouselDragStarted(9)).toBe(true);
    expect(carouselDragStarted(-9)).toBe(true);
    expect(carouselDragStarted(8)).toBe(false);
  });

  it("respects custom threshold", () => {
    expect(carouselDragStarted(11, 10)).toBe(true);
    expect(carouselDragStarted(10, 10)).toBe(false);
  });
});
