import { CarouselEngine } from "./carousel.engine";

import { vi } from "vitest";

describe("CarouselEngine", () => {
  let container: HTMLElement;
  let parent: HTMLElement;
  let slides: HTMLElement[];
  let engine: CarouselEngine;

  let getComputedStyleSpy: ReturnType<typeof vi.spyOn> | null = null;

  /**
   * Builds a parent -> container -> slides DOM tree and stubs the dimension
   * getters.
   */
  const buildDom = (
    slideCount: number,
    {
      slideSize = 100,
      viewportSize = 100,
      axis = "x",
    }: { slideSize?: number; viewportSize?: number; axis?: "x" | "y" } = {},
  ) => {
    parent = document.createElement("div");
    container = document.createElement("div");
    parent.appendChild(container);
    document.body.appendChild(parent);

    Object.defineProperty(parent, "clientWidth", {
      configurable: true,
      get: () => (axis === "x" ? viewportSize : 0),
    });
    Object.defineProperty(parent, "clientHeight", {
      configurable: true,
      get: () => (axis === "y" ? viewportSize : 0),
    });

    slides = [];
    for (let i = 0; i < slideCount; i++) {
      const slide = document.createElement("div");
      Object.defineProperty(slide, "offsetWidth", {
        configurable: true,
        get: () => (axis === "x" ? slideSize : 0),
      });
      Object.defineProperty(slide, "offsetHeight", {
        configurable: true,
        get: () => (axis === "y" ? slideSize : 0),
      });
      container.appendChild(slide);
      slides.push(slide);
    }
  };

  beforeEach(() => {
    getComputedStyleSpy = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation(
        () =>
          ({
            marginLeft: "0px",
            marginRight: "0px",
            marginTop: "0px",
            marginBottom: "0px",
          }) as unknown as CSSStyleDeclaration,
      );
  });

  afterEach(() => {
    engine?.destroy();
    document.body.innerHTML = "";
    getComputedStyleSpy?.mockRestore();
    getComputedStyleSpy = null;
  });

  it("should expose selected index after init", () => {
    buildDom(3);
    engine = new CarouselEngine();
    engine.init(container, slides);
    expect(engine.getSelectedIndex()).toBe(0);
    expect(engine.getSlideCount()).toBe(3);
  });

  it("should advance selected index via scrollNext", async () => {
    buildDom(3);
    engine = new CarouselEngine();
    engine.init(container, slides);

    const selected = new Promise<void>((resolve) => {
      const sub = engine.select$.subscribe((idx) => {
        if (idx !== 1) return;
        expect(idx).toBe(1);
        sub.unsubscribe();
        resolve();
      });
    });

    engine.scrollNext();

    await selected;
  });

  it("should clamp index when not looping", () => {
    buildDom(3);
    engine = new CarouselEngine({ loop: false });
    engine.init(container, slides);

    engine.scrollTo(99, true);
    expect(engine.getSelectedIndex()).toBe(2);

    engine.scrollTo(-99, true);
    expect(engine.getSelectedIndex()).toBe(0);
  });

  it("should wrap around when looping", () => {
    buildDom(3);
    engine = new CarouselEngine({ loop: true });
    engine.init(container, slides);

    engine.scrollPrev(true);
    expect(engine.getSelectedIndex()).toBe(2);

    engine.scrollNext(true);
    expect(engine.getSelectedIndex()).toBe(0);
  });

  it("scrollNext / scrollPrev should be no-ops past the boundaries when not looping", () => {
    buildDom(3);
    engine = new CarouselEngine({ loop: false });
    engine.init(container, slides);

    engine.scrollPrev(true);
    expect(engine.getSelectedIndex()).toBe(0);

    engine.scrollTo(2, true);
    engine.scrollNext(true);
    expect(engine.getSelectedIndex()).toBe(2);
  });

  it("canScroll* should reflect bounds when not looping", () => {
    buildDom(3);
    engine = new CarouselEngine({ loop: false });
    engine.init(container, slides);

    expect(engine.canScrollPrev()).toBe(false);
    expect(engine.canScrollNext()).toBe(true);

    engine.scrollTo(2, true);
    expect(engine.canScrollPrev()).toBe(true);
    expect(engine.canScrollNext()).toBe(false);
  });

  it("canScroll* should always be true when looping", () => {
    buildDom(3);
    engine = new CarouselEngine({ loop: true });
    engine.init(container, slides);
    expect(engine.canScrollPrev()).toBe(true);
    expect(engine.canScrollNext()).toBe(true);
  });

  it("should advance to next slide on a forward drag past threshold", () => {
    buildDom(3, { slideSize: 100, viewportSize: 100 });
    engine = new CarouselEngine({ dragThreshold: 40 });
    engine.init(container, slides);

    engine.onPointerDown(200);
    engine.onPointerMove(100);
    engine.onPointerUp();

    expect(engine.getSelectedIndex()).toBe(1);
  });

  it("should go to previous slide on a backward drag past threshold", () => {
    buildDom(3, { slideSize: 100, viewportSize: 100 });
    engine = new CarouselEngine({ dragThreshold: 40 });
    engine.init(container, slides);

    engine.scrollTo(2, true);
    engine.onPointerDown(0);
    engine.onPointerMove(100);
    engine.onPointerUp();

    expect(engine.getSelectedIndex()).toBe(1);
  });

  it("should snap back when drag does not meet threshold", () => {
    buildDom(3, { slideSize: 100, viewportSize: 100 });
    engine = new CarouselEngine({ dragThreshold: 40 });
    engine.init(container, slides);

    engine.scrollTo(1, true);
    engine.onPointerDown(0);
    engine.onPointerMove(10);
    engine.onPointerUp();

    expect(engine.getSelectedIndex()).toBe(1);
  });

  it("should emit pointerDown$ and pointerUp$ around a drag", () => {
    buildDom(3);
    engine = new CarouselEngine();
    engine.init(container, slides);

    const down = vi.fn();
    const up = vi.fn();
    engine.pointerDown$.subscribe(down);
    engine.pointerUp$.subscribe(up);

    engine.onPointerDown(0);
    engine.onPointerMove(10);
    engine.onPointerUp();

    expect(down).toHaveBeenCalledTimes(1);
    expect(up).toHaveBeenCalledTimes(1);
  });

  it("on('select', cb) compatibility shim should be invoked", () => {
    buildDom(3);
    engine = new CarouselEngine();
    engine.init(container, slides);

    const cb = vi.fn();
    const off = engine.on("select", cb);

    engine.scrollNext();
    expect(cb).toHaveBeenCalledWith(1);

    off();
    engine.scrollNext();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("reinit should clamp selectedIndex against new slides length", () => {
    buildDom(5);
    engine = new CarouselEngine();
    engine.init(container, slides);
    engine.scrollTo(4, true);
    expect(engine.getSelectedIndex()).toBe(4);

    const reducedSlides = slides.slice(0, 2);
    engine.reinit(reducedSlides);
    expect(engine.getSelectedIndex()).toBe(1);
  });

  it("destroy should complete the select$ stream", async () => {
    buildDom(3);
    engine = new CarouselEngine();
    engine.init(container, slides);

    const completed = new Promise<void>((resolve) => {
      engine.select$.subscribe({ complete: resolve });
    });

    engine.destroy();

    await completed;
  });

  describe("snap points / pages", () => {
    it("produces one page per slide when each slide fills the viewport", () => {
      buildDom(3, { slideSize: 100, viewportSize: 100 });
      engine = new CarouselEngine();
      engine.init(container, slides);

      expect(engine.getSnapPoints()).toEqual([0, 1, 2]);
      expect(engine.getSelectedSnapIndex()).toBe(0);
    });

    it("groups slides into pages when multiple fit per viewport", () => {
      buildDom(5, { slideSize: 30, viewportSize: 100 });
      engine = new CarouselEngine({ containScroll: true });
      engine.init(container, slides);

      const pages = engine.getSnapPoints();
      expect(pages[0]).toBe(0);
      expect(pages.length).toBeLessThan(5);

      const lastPageStart = pages[pages.length - 1];
      expect(lastPageStart * 30).toBeLessThanOrEqual(5 * 30 - 100);
    });

    it("scrollNext / scrollPrev advance one page at a time", () => {
      buildDom(6, { slideSize: 50, viewportSize: 100 });
      engine = new CarouselEngine({ containScroll: true });
      engine.init(container, slides);

      const pages = engine.getSnapPoints();
      expect(pages.length).toBeGreaterThan(1);

      engine.scrollNext(true);
      expect(engine.getSelectedSnapIndex()).toBe(1);
      expect(engine.getSelectedIndex()).toBe(pages[1]);

      engine.scrollPrev(true);
      expect(engine.getSelectedSnapIndex()).toBe(0);
      expect(engine.getSelectedIndex()).toBe(0);
    });

    it("canScrollNext becomes false on the last page even with remaining slides", () => {
      buildDom(5, { slideSize: 30, viewportSize: 100 });
      engine = new CarouselEngine({ containScroll: true });
      engine.init(container, slides);

      const pages = engine.getSnapPoints();
      engine.scrollTo(pages[pages.length - 1], true);

      expect(engine.canScrollNext()).toBe(false);
      expect(engine.canScrollPrev()).toBe(pages.length > 1);
    });

    it("recomputes snap points on reinit", () => {
      buildDom(4, { slideSize: 50, viewportSize: 100 });
      engine = new CarouselEngine({ containScroll: true });
      engine.init(container, slides);
      const before = engine.getSnapPoints().length;

      const reduced = slides.slice(0, 2);
      engine.reinit(reduced);

      expect(engine.getSnapPoints().length).toBeLessThanOrEqual(before);
      expect(engine.getSlideCount()).toBe(2);
    });

    it("falls back to one snap per slide when viewport size is 0", () => {
      buildDom(3, { slideSize: 100, viewportSize: 0 });
      engine = new CarouselEngine();
      engine.init(container, slides);
      expect(engine.getSnapPoints()).toEqual([0, 1, 2]);
    });

    it("wraps to the first page on scrollNext when looping (multi-per-view)", () => {
      buildDom(4, { slideSize: 50, viewportSize: 100 });
      engine = new CarouselEngine({ loop: true });
      engine.init(container, slides);

      const pages = engine.getSnapPoints();
      engine.scrollTo(pages[pages.length - 1], true);
      expect(engine.getSelectedSnapIndex()).toBe(pages.length - 1);

      engine.scrollNext(true);
      expect(engine.getSelectedSnapIndex()).toBe(0);
      expect(engine.getSelectedIndex()).toBe(pages[0]);
    });

    it("wraps to the last page on scrollPrev when looping (multi-per-view)", () => {
      buildDom(4, { slideSize: 50, viewportSize: 100 });
      engine = new CarouselEngine({ loop: true });
      engine.init(container, slides);

      const pages = engine.getSnapPoints();
      expect(engine.getSelectedSnapIndex()).toBe(0);

      engine.scrollPrev(true);
      expect(engine.getSelectedSnapIndex()).toBe(pages.length - 1);
      expect(engine.getSelectedIndex()).toBe(pages[pages.length - 1]);
    });

    it("keeps every slide reachable as its own page when looping with single-slide-per-view", () => {
      buildDom(3, { slideSize: 100, viewportSize: 100 });
      engine = new CarouselEngine({ loop: true });
      engine.init(container, slides);

      expect(engine.getSnapPoints()).toEqual([0, 1, 2]);
    });
  });
});
