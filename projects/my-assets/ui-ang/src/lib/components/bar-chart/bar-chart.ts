import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  input,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
  inject,
} from "@angular/core";

import { D3_CHARTS, D3_CHARTS_OPTIONS } from "@inm-baas-web/d3-charts";

export interface BarChartDatum {
  label: string;
  [seriesKey: string]: number | string;
}

export interface BarSeriesConfig {
  key: string;
  label: string;
  colorClass?: string;
  color?: string;
}
  
@Component({
  selector: "inm-bar-chart",
  standalone: true,
  imports: [],
  templateUrl: "./bar-chart.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BarChart implements AfterViewInit, OnDestroy {
  private readonly d3 = inject( D3_CHARTS);
  private readonly config = inject(D3_CHARTS_OPTIONS);

  data = input<BarChartDatum[]>([]);

  series = input<BarSeriesConfig[]>([
    { key: 'value', label: 'Value', colorClass: 'bg-bar-chart-primary' },
  ]);

  height = input<number | undefined>(220);
  @ViewChild('chartContainer', { static: true })
  private chartContainer!: ElementRef<HTMLDivElement>;

  @ViewChildren('colorProbe')
  private colorProbes!: QueryList<ElementRef<HTMLDivElement>>;

  private viewReady = false;
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.render();
  }

  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => this.render(), this.config.resizeDebounceMs);
  }

  /** Resolves each series to either a flat color or a gradient's start/end stops. */
  private resolveSeriesColors(): Map<string, { start: string; end: string } | string> {
    const map = new Map<string, { start: string; end: string } | string>();
    const probes = this.colorProbes?.toArray() ?? [];
    const fallback = this.config.defaultColor;

    for (const s of this.series()) {
      if (s.color) {
        map.set(s.key, s.color);
        continue;
      }
      const probeEl = probes.find(
        (p) => p.nativeElement.dataset['seriesKey'] === s.key
      )?.nativeElement;

      if (!probeEl) {
        map.set(s.key, fallback);
        continue;
      }

      const styles = getComputedStyle(probeEl);
      const start = styles.getPropertyValue('--bar-start').trim() || fallback;
      const end = styles.getPropertyValue('--bar-end').trim() || start;
      map.set(s.key, { start, end });
    }
    return map;
  }

  private render(): void {
    if (!this.viewReady) return;

    const container = this.chartContainer.nativeElement;
    const d3 = this.d3;
    const { margin, paddingInner, paddingOuter, defaultColor, barCornerRadius, yAxisTicks } = this.config;

    d3.select(container).select('svg').remove();

    const data = this.data()
    const seriesConfig = this.series();
    if (!data?.length || !seriesConfig?.length) return;

    const seriesKeys = seriesConfig.map((s) => s.key);
    const colorMap = this.resolveSeriesColors();

  const chartHeight = this.height() ?? container?.clientHeight;
    const width = container.clientWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', chartHeight)
      .attr('viewBox', `0 0 ${container.clientWidth} ${chartHeight}`);

    const defs = svg.append('defs');

    const fillForKey = new Map<string, string>();
    seriesKeys.forEach((key) => {
      const resolved = colorMap.get(key);
      if (typeof resolved === 'string') {
        fillForKey.set(key, resolved);
      } else if (resolved) {
        const gradientId = `bar-gradient-${key}-${Math.random().toString(36).slice(2, 9)}`;
        const gradient = defs
          .append('radialGradient')
          .attr('id', gradientId)
          .attr('cx', '50%')
          .attr('cy', '50%')
          .attr('r', '50%');
        gradient.append('stop').attr('offset', '0%').attr('stop-color', resolved.start);
        gradient.append('stop').attr('offset', '100%').attr('stop-color', resolved.end);
        fillForKey.set(key, `url(#${gradientId})`);
      }
    });

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, width])
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter);

    const x1 = d3
      .scaleBand()
      .domain(seriesKeys)
      .range([0, x0.bandwidth()])
      .padding(0.15);

    const yMax = d3.max(data, (d) => d3.max(seriesKeys, (k) => Number(d[k]) || 0)) ?? 0;

    const y = d3.scaleLinear().domain([0, yMax]).nice().range([height, 0]);

    g.append('g')
      .attr('class', 'bar-chart-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0));

    g.append('g')
      .attr('class', 'bar-chart-axis')
      .call(d3.axisLeft(y).ticks(yAxisTicks));

    const groups = g
      .selectAll('.bar-group')
      .data(data)
      .join('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(${x0(d.label) ?? 0},0)`);

    groups
      .selectAll('rect')
      .data((d) => seriesKeys.map((key) => ({ key, value: Number(d[key]) || 0 })))
      .join('rect')
      .attr('class', 'bar-chart-bar')
      .attr('x', (d) => x1(d.key) ?? 0)
      .attr('y', (d) => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', (d) => height - y(d.value))
      .attr('fill', (d) => fillForKey.get(d.key) ?? defaultColor)
      .attr('rx', barCornerRadius);
  }
}