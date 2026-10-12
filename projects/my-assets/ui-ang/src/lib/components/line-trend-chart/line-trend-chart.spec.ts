import { ComponentFixture, TestBed } from "@angular/core/testing";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LineTrendChart } from "./line-trend-chart";

const MOCK_SERIES = [
  {
    id: "LAAS",
    color: "#0042C8",
    values: [18, 88, 32, 96],
    metrics: [95, 310, 140, 340],
  },
  {
    id: "WAAS",
    color: "#00CE00",
    values: [42, 28, 92, 86],
    metrics: [160, 110, 335, 315],
  },
] as const;

const MOCK_CATEGORIES = [
  { label: "Week 1", date: "1st Aug 2026" },
  { label: "Week 2", date: "8th Aug 2026" },
  { label: "Week 3", date: "15th Aug 2026" },
  { label: "Week 4", date: "22nd Aug 2026" },
] as const;

describe("LineTrendChart", () => {
  let fixture: ComponentFixture<LineTrendChart>;
  let resizeCallback: ResizeObserverCallback | undefined;
  let disconnectSpy: ReturnType<typeof vi.fn>;

  const setHostSize = (width: number, height: number): HTMLDivElement => {
    const host = fixture.nativeElement.querySelector(
      "[data-testid='line-trend-chart-canvas']",
    ) as HTMLDivElement;

    Object.defineProperty(host, "clientWidth", {
      configurable: true,
      get: () => width,
    });
    Object.defineProperty(host, "clientHeight", {
      configurable: true,
      get: () => height,
    });

    return host;
  };

  const renderChart = (width = 400, height = 200): HTMLDivElement => {
    const host = setHostSize(width, height);
    resizeCallback?.([], {} as ResizeObserver);
    fixture.detectChanges();
    return host;
  };

  beforeEach(async () => {
    disconnectSpy = vi.fn();
    resizeCallback = undefined;

    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = disconnectSpy;

        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback;
        }
      },
    );

    await TestBed.configureTestingModule({
      imports: [LineTrendChart],
    }).compileComponents();

    fixture = TestBed.createComponent(LineTrendChart);
    fixture.componentRef.setInput("title", "Frequently used APIs");
    fixture.componentRef.setInput("series", MOCK_SERIES);
    fixture.componentRef.setInput("categories", MOCK_CATEGORIES);
    fixture.componentRef.setInput("ariaLabel", "Frequently used APIs trend");
    fixture.detectChanges();
    renderChart();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should render title, legend, and chart host", () => {
    const root = fixture.nativeElement.querySelector(
      "[data-testid='line-trend-chart']",
    ) as HTMLElement;

    expect(root.textContent).toContain("Frequently used APIs");
    expect(root.textContent).toContain("LAAS");
    expect(root.textContent).toContain("WAAS");
    expect(root.textContent).toContain("Week 1");
    expect(
      fixture.nativeElement.querySelector(
        "[data-testid='line-trend-chart-canvas']",
      ),
    ).not.toBeNull();
  });

  it("should draw svg paths and accessible point hit targets", () => {
    const host = renderChart();

    const svg = host.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-label")).toBe("Frequently used APIs trend");
    expect(host.querySelectorAll("path")).toHaveLength(MOCK_SERIES.length);

    const circles = host.querySelectorAll("circle");
    expect(circles).toHaveLength(MOCK_SERIES.length * MOCK_CATEGORIES.length);
    expect(circles[0].getAttribute("tabindex")).toBe("0");
    expect(circles[0].getAttribute("role")).toBe("button");
  });

  it("should omit plotted points for null year-to-date values", () => {
    const sparseSeries = [
      {
        id: "Airtel OD",
        color: "#0042C8",
        values: [38, 32, 48, null, null, null],
        metrics: ["KES 1", "KES 2", "KES 3", null, null, null],
      },
    ] as const;
    const sparseCategories = [
      { label: "Jan", date: "28th January 2026" },
      { label: "Feb", date: "28th February 2026" },
      { label: "Mar", date: "28th March 2026" },
      { label: "Apr", date: "28th April 2026" },
      { label: "May", date: "28th May 2026" },
      { label: "Jun", date: "28th June 2026" },
    ] as const;

    fixture.componentRef.setInput("series", sparseSeries);
    fixture.componentRef.setInput("categories", sparseCategories);
    fixture.detectChanges();
    const host = renderChart();

    expect(host.querySelectorAll("circle")).toHaveLength(3);
    expect(host.querySelector("path")?.getAttribute("d")).toBeTruthy();
  });

  it("should show tooltip content when tooltip state is set", () => {
    fixture.componentInstance.tooltip.set({
      seriesId: "WAAS",
      color: "#00CE00",
      metric: 335,
      date: "22nd Aug 2026",
      x: 100,
      y: 50,
    });
    fixture.detectChanges();

    const tip = fixture.nativeElement.querySelector(
      "[data-testid='line-trend-chart-tooltip']",
    ) as HTMLElement;

    expect(tip).not.toBeNull();
    expect(tip.textContent).toContain("WAAS");
    expect(tip.textContent).toContain("Total Number of");
    expect(tip.textContent).toContain("incoming API Calls");
    expect(tip.textContent).toContain("335");
    expect(tip.textContent).toContain("22nd Aug 2026");
  });

  it("should render custom tooltip copy", () => {
    fixture.componentRef.setInput("tooltipCopy", {
      line1: "Total amount of",
      line2: "sandbox API Calls",
    });
    fixture.componentInstance.tooltip.set({
      seriesId: "LAAS",
      color: "#0042C8",
      metric: 95,
      date: "1st Aug 2026",
      x: 20,
      y: 30,
    });
    fixture.detectChanges();

    const tip = fixture.nativeElement.querySelector(
      "[data-testid='line-trend-chart-tooltip']",
    ) as HTMLElement;

    expect(tip.textContent).toContain("Total amount of");
    expect(tip.textContent).toContain("sandbox API Calls");
  });

  it("should render compact portfolio tooltip without API copy chrome", () => {
    fixture.componentRef.setInput("tooltipVariant", "compact");
    fixture.componentInstance.tooltip.set({
      seriesId: "Airtel OD",
      color: "#0042C8",
      metric: "KES 90,098,393.00",
      date: "28th August 2026",
      x: 100,
      y: 50,
    });
    fixture.detectChanges();

    const tip = fixture.nativeElement.querySelector(
      "[data-testid='line-trend-chart-tooltip']",
    ) as HTMLElement;

    expect(tip.textContent).toContain("Airtel OD");
    expect(tip.textContent).toContain("KES 90,098,393.00");
    expect(tip.textContent).toContain("Date: 28th August 2026");
    expect(tip.textContent).not.toContain("Total Number of");
    expect(tip.textContent).not.toContain("incoming API Calls");
  });

  describe("point interactions", () => {
    const mockPointGeometry = (circle: SVGCircleElement): void => {
      vi.spyOn(circle, "getBoundingClientRect").mockReturnValue({
        left: 150,
        top: 80,
        width: 10,
        height: 10,
        right: 160,
        bottom: 90,
        x: 150,
        y: 80,
        toJSON: () => ({}),
      });

      const root = fixture.nativeElement.querySelector(
        "[data-testid='line-trend-chart']",
      ) as HTMLElement;
      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 50,
        top: 40,
        width: 400,
        height: 300,
        right: 450,
        bottom: 340,
        x: 50,
        y: 40,
        toJSON: () => ({}),
      });
    };

    const getWaasPoint = (): SVGCircleElement => {
      const host = renderChart();
      const circle = host.querySelector(
        'g[data-series="WAAS"] circle',
      ) as SVGCircleElement;
      expect(circle).not.toBeNull();
      mockPointGeometry(circle);
      return circle;
    };

    it("should show and hide tooltip from mouse interactions", () => {
      const circle = getWaasPoint();

      circle.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      fixture.detectChanges();

      const tip = fixture.componentInstance.tooltip();
      expect(tip).not.toBeNull();
      expect(tip?.seriesId).toBe("WAAS");
      expect(tip?.metric).toBe(160);
      expect(tip?.date).toBe("1st Aug 2026");
      expect(tip?.x).toBe(105);
      expect(tip?.y).toBe(40);

      circle.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
      fixture.detectChanges();
      expect(fixture.componentInstance.tooltip()).toBeNull();
    });

    it("should show tooltip on focus and hide on blur", () => {
      const circle = getWaasPoint();

      circle.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
      fixture.detectChanges();

      const tip = fixture.componentInstance.tooltip();
      expect(tip).not.toBeNull();
      expect(tip?.seriesId).toBe("WAAS");
      expect(tip?.metric).toBe(160);
      expect(tip?.x).toBe(105);
      expect(tip?.y).toBe(40);

      circle.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
      fixture.detectChanges();
      expect(fixture.componentInstance.tooltip()).toBeNull();
    });

    it("should show tooltip on Enter key and prevent default", () => {
      const circle = getWaasPoint();
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(enterEvent, "preventDefault");

      circle.dispatchEvent(enterEvent);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(fixture.componentInstance.tooltip()?.seriesId).toBe("WAAS");
      expect(fixture.componentInstance.tooltip()?.metric).toBe(160);
    });

    it("should show tooltip on Space key and prevent default", () => {
      const circle = getWaasPoint();
      const spaceEvent = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(spaceEvent, "preventDefault");

      circle.dispatchEvent(spaceEvent);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(fixture.componentInstance.tooltip()?.seriesId).toBe("WAAS");
    });

    it("should hide tooltip on Escape key", () => {
      const circle = getWaasPoint();

      circle.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
      fixture.detectChanges();
      expect(fixture.componentInstance.tooltip()).not.toBeNull();

      circle.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      fixture.detectChanges();
      expect(fixture.componentInstance.tooltip()).toBeNull();
    });

    it("should ignore unrelated keys", () => {
      const circle = getWaasPoint();

      circle.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
      );
      fixture.detectChanges();
      expect(fixture.componentInstance.tooltip()).toBeNull();

      circle.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
      fixture.detectChanges();
      expect(fixture.componentInstance.tooltip()).not.toBeNull();

      circle.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
      fixture.detectChanges();
      expect(fixture.componentInstance.tooltip()?.seriesId).toBe("WAAS");
    });
  });

  describe("showTooltip", () => {
    const mockRect = (
      left: number,
      top: number,
      width: number,
      height: number,
    ): DOMRect =>
      ({
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
        toJSON: () => ({}),
      }) as DOMRect;

    const invokeShowTooltip = (
      seriesIndex: number,
      categoryIndex: number,
      pointRect: DOMRect,
      rootRect: DOMRect,
    ): void => {
      const host = renderChart();
      const seriesId = MOCK_SERIES[seriesIndex].id;
      const circle = host.querySelectorAll(
        `g[data-series="${seriesId}"] circle`,
      )[categoryIndex] as SVGCircleElement;

      expect(circle).not.toBeNull();

      vi.spyOn(circle, "getBoundingClientRect").mockReturnValue(pointRect);

      const root = fixture.nativeElement.querySelector(
        "[data-testid='line-trend-chart']",
      ) as HTMLElement;
      vi.spyOn(root, "getBoundingClientRect").mockReturnValue(rootRect);

      const event = {
        currentTarget: circle,
      } as unknown as MouseEvent;

      (
        fixture.componentInstance as unknown as {
          showTooltip: (
            event: MouseEvent,
            item: (typeof MOCK_SERIES)[number],
            categoryIndex: number,
          ) => void;
        }
      ).showTooltip(event, MOCK_SERIES[seriesIndex], categoryIndex);

      fixture.detectChanges();
    };

    it("should set tooltip series details for the hovered point", () => {
      invokeShowTooltip(
        1,
        2,
        mockRect(200, 100, 12, 12),
        mockRect(40, 20, 400, 300),
      );

      const tip = fixture.componentInstance.tooltip();
      expect(tip).toEqual({
        seriesId: "WAAS",
        color: "#00CE00",
        metric: 335,
        date: "15th Aug 2026",
        x: 166,
        y: 80,
      });
    });

    it("should position tooltip relative to the chart root", () => {
      invokeShowTooltip(
        0,
        0,
        mockRect(120, 90, 10, 10),
        mockRect(50, 30, 500, 400),
      );

      const tip = fixture.componentInstance.tooltip();
      expect(tip?.x).toBe(75);
      expect(tip?.y).toBe(60);
    });

    it("should use metric and date for the selected category index", () => {
      invokeShowTooltip(
        0,
        3,
        mockRect(300, 140, 8, 8),
        mockRect(0, 0, 400, 200),
      );

      const tip = fixture.componentInstance.tooltip();
      expect(tip?.seriesId).toBe("LAAS");
      expect(tip?.color).toBe("#0042C8");
      expect(tip?.metric).toBe(340);
      expect(tip?.date).toBe("22nd Aug 2026");
    });

    it("should render tooltip DOM from showTooltip state", () => {
      invokeShowTooltip(
        1,
        3,
        mockRect(260, 70, 10, 10),
        mockRect(10, 10, 400, 300),
      );

      const tipEl = fixture.nativeElement.querySelector(
        "[data-testid='line-trend-chart-tooltip']",
      ) as HTMLElement;

      expect(tipEl).not.toBeNull();
      expect(tipEl.textContent).toContain("WAAS");
      expect(tipEl.textContent).toContain("315");
      expect(tipEl.textContent).toContain("22nd Aug 2026");
      expect(tipEl.style.left).toBe("255px");
      expect(tipEl.style.top).toBe("52px");
    });

    it("should replace previous tooltip when another point is hovered", () => {
      invokeShowTooltip(
        0,
        0,
        mockRect(100, 80, 10, 10),
        mockRect(0, 0, 400, 200),
      );
      expect(fixture.componentInstance.tooltip()?.seriesId).toBe("LAAS");
      expect(fixture.componentInstance.tooltip()?.metric).toBe(95);

      invokeShowTooltip(
        1,
        1,
        mockRect(180, 110, 10, 10),
        mockRect(0, 0, 400, 200),
      );
      const tip = fixture.componentInstance.tooltip();
      expect(tip?.seriesId).toBe("WAAS");
      expect(tip?.metric).toBe(110);
      expect(tip?.date).toBe("8th Aug 2026");
    });
  });

  it("should clear tooltip via hideTooltip", () => {
    fixture.componentInstance.tooltip.set({
      seriesId: "LAAS",
      color: "#0042C8",
      metric: 95,
      date: "1st Aug 2026",
      x: 10,
      y: 20,
    });

    fixture.componentInstance.hideTooltip();
    expect(fixture.componentInstance.tooltip()).toBeNull();
  });

  it("should skip drawing when series or categories are empty", () => {
    const host = renderChart();
    host.querySelector("svg")?.remove();

    fixture.componentRef.setInput("series", []);
    fixture.detectChanges();
    expect(host.querySelector("svg")).toBeNull();

    fixture.componentRef.setInput("series", MOCK_SERIES);
    fixture.componentRef.setInput("categories", []);
    fixture.detectChanges();
    expect(host.querySelector("svg")).toBeNull();
  });

  it("should skip redraw when size is unchanged", () => {
    const host = renderChart();
    const firstSvg = host.querySelector("svg");

    resizeCallback?.([], {} as ResizeObserver);
    expect(host.querySelector("svg")).toBe(firstSvg);
  });

  it("should redraw when inputs change after host is ready", () => {
    const host = renderChart();
    expect(host.querySelectorAll("path")).toHaveLength(MOCK_SERIES.length);

    fixture.componentRef.setInput("series", [MOCK_SERIES[0]]);
    fixture.componentRef.setInput("yMax", 120);
    fixture.detectChanges();

    expect(host.querySelectorAll("path")).toHaveLength(1);
    expect(host.querySelectorAll("circle")).toHaveLength(
      MOCK_CATEGORIES.length,
    );
  });

  it("should redraw when ResizeObserver fires with a new size", () => {
    const host = renderChart(400, 200);
    expect(resizeCallback).toBeTypeOf("function");

    setHostSize(500, 250);
    resizeCallback?.([], {} as ResizeObserver);
    fixture.detectChanges();

    const svg = host.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 500 250");
  });

  it("should disconnect ResizeObserver on destroy", () => {
    expect(resizeCallback).toBeTypeOf("function");
    fixture.destroy();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it("should continue without ResizeObserver when unavailable", async () => {
    fixture.destroy();
    vi.unstubAllGlobals();
    vi.stubGlobal("ResizeObserver", undefined);

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [LineTrendChart],
    }).compileComponents();

    fixture = TestBed.createComponent(LineTrendChart);
    fixture.componentRef.setInput("title", "Frequently used APIs");
    fixture.componentRef.setInput("series", MOCK_SERIES);
    fixture.componentRef.setInput("categories", MOCK_CATEGORIES);
    fixture.detectChanges();

    const host = setHostSize(320, 180);
    fixture.componentInstance.ngAfterViewInit();
    fixture.detectChanges();

    expect(host.querySelector("svg")).not.toBeNull();
    fixture.destroy();
  });
});
