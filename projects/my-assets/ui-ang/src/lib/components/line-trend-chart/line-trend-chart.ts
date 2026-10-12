import { NgClass } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  signal,
  viewChild,
} from "@angular/core";

import * as d3 from "d3";

export interface LineTrendCategory {
  readonly label: string;
  readonly date: string;
}

export interface LineTrendSeries {
  readonly id: string;
  readonly color: string;
  /** chart values used for the Y scale. */
  readonly values: readonly (number | null)[];
  /** point tooltip. */
  readonly metrics: readonly (number | string | null)[];
}

export interface LineTrendTooltipCopy {
  readonly line1: string;
  readonly line2: string;
}

/** `detailed` = API usage tooltip; `compact` = portfolio-style tooltip. */
export type LineTrendTooltipVariant = "detailed" | "compact";

export interface LineTrendTooltip {
  readonly seriesId: string;
  readonly color: string;
  readonly metric: number | string;
  readonly date: string;
  readonly x: number;
  readonly y: number;
}

const DEFAULT_TOOLTIP_COPY: LineTrendTooltipCopy = {
  line1: "Total Number of",
  line2: "incoming API Calls",
};

@Component({
  selector: "inm-line-trend-chart",
  standalone: true,
  imports: [NgClass],
  templateUrl: "./line-trend-chart.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "block h-full min-h-0",
  },
})
export class LineTrendChart implements AfterViewInit, OnDestroy {
  private readonly chartHost =
    viewChild.required<ElementRef<HTMLDivElement>>("chartHost");
  private readonly chartRoot =
    viewChild.required<ElementRef<HTMLElement>>("chartRoot");

  readonly title = input.required<string>();
  readonly series = input.required<readonly LineTrendSeries[]>();
  readonly categories = input.required<readonly LineTrendCategory[]>();
  readonly yMax = input(100);
  readonly ariaLabel = input("Trend chart");
  readonly tooltipCopy = input<LineTrendTooltipCopy>(DEFAULT_TOOLTIP_COPY);
  readonly tooltipVariant = input<LineTrendTooltipVariant>("detailed");

  readonly tooltip = signal<LineTrendTooltip | null>(null);

  private resizeObserver?: ResizeObserver;
  private lastWidth = 0;
  private lastHeight = 0;
  private hostElement?: HTMLDivElement;

  constructor() {
    effect(() => {
      this.series();
      this.categories();
      this.yMax();

      if (!this.hostElement) {
        return;
      }

      this.lastWidth = 0;
      this.lastHeight = 0;
      this.draw(this.hostElement);
    });
  }

  ngAfterViewInit(): void {
    const host = this.chartHost().nativeElement;
    this.hostElement = host;
    this.draw(host);

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.draw(host));
    this.resizeObserver.observe(host);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  hideTooltip(): void {
    this.tooltip.set(null);
  }

  private draw(host: HTMLDivElement): void {
    const width = Math.floor(host.clientWidth);
    const height = Math.floor(host.clientHeight);
    const series = this.series();
    const categories = this.categories();

    if (series.length === 0 || categories.length === 0) {
      return;
    }

    if (width === this.lastWidth && height === this.lastHeight) {
      return;
    }

    this.lastWidth = width;
    this.lastHeight = height;
    this.tooltip.set(null);

    d3.select(host).select("svg").remove();

    const categoryLabels = categories.map((category) => category.label);

    const svg = d3
      .select(host)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "none")
      .attr("role", "img")
      .attr("aria-label", this.ariaLabel())
      .style("display", "block")
      .style("overflow", "visible");

    const x = d3
      .scalePoint<string>()
      .domain(categoryLabels)
      .range([0, width])
      .padding(0.5);

    const y = d3.scaleLinear().domain([0, this.yMax()]).range([height, 0]);

    const line = d3
      .line<number | null>()
      .defined((value) => value !== null)
      .x((_, index) => x(categoryLabels[index]) ?? 0)
      .y((value) => y(value as number))
      .curve(d3.curveMonotoneX);

    series.forEach((item: LineTrendSeries) => {
      svg
        .append("path")
        .datum([...item.values])
        .attr("fill", "none")
        .attr("stroke", item.color)
        .attr("stroke-width", 2.5)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("d", line)
        .attr("pointer-events", "none");

      const plottedPoints = item.values
        .map((value, index) => ({ value, index }))
        .filter(
          (point): point is { value: number; index: number } =>
            point.value !== null,
        );

      const points = svg
        .append("g")
        .attr("data-series", item.id)
        .selectAll("circle")
        .data(plottedPoints)
        .join("circle")
        .attr("cx", (d) => x(categoryLabels[d.index]) ?? 0)
        .attr("cy", (d) => y(d.value))
        .attr("r", 10)
        .attr("fill", "transparent")
        .attr("stroke", "none")
        .style("cursor", "pointer");

      points
        .attr("tabindex", 0)
        .attr("role", "button")
        .on("mouseenter", (event: MouseEvent, d) => {
          this.showTooltip(event, item, d.index);
        })
        .on("mouseleave", () => this.hideTooltip())
        .on("focus", (event, d) => {
          this.showTooltip(event as MouseEvent, item, d.index);
        })
        .on("blur", () => this.hideTooltip())
        .on("keydown", (event, d) => {
          const keyEvent = event as KeyboardEvent;
          if (keyEvent.key === "Enter" || keyEvent.key === " ") {
            keyEvent.preventDefault();
            this.showTooltip(event as KeyboardEvent, item, d.index);
          } else if (keyEvent.key === "Escape") {
            this.hideTooltip();
          }
        });
    });
  }

  private showTooltip(
    event: MouseEvent | KeyboardEvent,
    item: LineTrendSeries,
    categoryIndex: number,
  ): void {
    const root = this.chartRoot().nativeElement;
    const target = event.currentTarget as SVGCircleElement;
    const pointRect = target.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const categories = this.categories();
    const metric = item.metrics[categoryIndex];

    if (metric === null || metric === undefined) {
      return;
    }

    this.tooltip.set({
      seriesId: item.id,
      color: item.color,
      metric,
      date: categories[categoryIndex].date,
      x: pointRect.left + pointRect.width / 2 - rootRect.left,
      y: pointRect.top - rootRect.top,
    });
  }
}
