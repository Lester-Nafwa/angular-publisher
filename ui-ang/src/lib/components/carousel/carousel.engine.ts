/**
 * CarouselEngine
 * ──────────────
 * A pure-TypeScript, framework-agnostic scroll engine inspired by Embla Carousel.
 *
 * Core concepts (mirroring Embla):
 *  • A RAF-based animation loop lerps the live offset toward a target offset.
 *  • Pointer events feed delta values directly into the target offset.
 *  • Rubber-band resistance is applied when dragging beyond content boundaries.
 *  • Snapping resolves to the nearest slide on pointer-up (or a directional
 *    threshold when not in drag-free mode).
 *
 * Observables (RxJS):
 *  • init$ — emits once on init()
 *  • select$ — emits the new selected index whenever it changes
 *  • pointerDown$ — emits on pointer-down
 *  • pointerUp$ — emits on pointer-up
 */

import { Observable, Subject } from "rxjs";

export type CarouselAlign = "start" | "center" | "end";
export type CarouselAxis = "x" | "y";

export interface CarouselOptions {
  /** Infinite circular scroll.                          Default: false  */
  loop?: boolean;
  /** Snap to nearest on release instead of directional. Default: false  */
  dragFree?: boolean;
  /** Slide alignment within the viewport.               Default: 'start'*/
  align?: CarouselAlign;
  /** Scroll axis.                                       Default: 'x'    */
  axis?: CarouselAxis;
  /** Slides advanced per prev/next call.                Default: 1      */
  slidesToScroll?: number;
  /** Lerp divisor — lower = snappier.                   Default: 12     */
  speed?: number;
  /** Prevent over-scrolling past first/last slide.      Default: true   */
  containScroll?: boolean;
  /** Minimum swipe distance (px) to trigger navigation. Default: 40     */
  dragThreshold?: number;
}

type AnyListener = (...args: unknown[]) => void;

const clamp = (v: number, lo: number, hi: number): number =>
  Math.min(Math.max(v, lo), hi);

const lerp = (from: number, to: number, factor: number): number =>
  from + (to - from) / factor;

export class CarouselEngine {
  private readonly cfg: Required<CarouselOptions>;

  // DOM refs
  private container!: HTMLElement;
  private slides: HTMLElement[] = [];

  // Scroll state
  private currentOffset = 0;
  private targetOffset = 0;
  private selectedIndex = 0;

  // RAF
  private rafId: number | null = null;

  // Drag state
  private pointerDown = false;
  private pointerOrigin = 0;
  private pointerDelta = 0;
  private baseOffset = 0;

  private readonly _init$ = new Subject<void>();
  private readonly _select$ = new Subject<number>();
  private readonly _pointerDown$ = new Subject<void>();
  private readonly _pointerUp$ = new Subject<void>();

  private snapPoints: Array<number> = [0];

  readonly init$: Observable<void> = this._init$.asObservable();
  readonly select$: Observable<number> = this._select$.asObservable();
  readonly pointerDown$: Observable<void> = this._pointerDown$.asObservable();
  readonly pointerUp$: Observable<void> = this._pointerUp$.asObservable();

  constructor(options: CarouselOptions = {}) {
    this.cfg = {
      loop: options.loop ?? false,
      dragFree: options.dragFree ?? false,
      align: options.align ?? "start",
      axis: options.axis ?? "x",
      slidesToScroll: options.slidesToScroll ?? 1,
      speed: options.speed ?? 12,
      containScroll: options.containScroll ?? true,
      dragThreshold: options.dragThreshold ?? 40,
    };
  }

  /** Attach the engine to real DOM nodes and start the animation loop. */
  init(container: HTMLElement, slides: HTMLElement[]): void {
    this.container = container;
    this.slides = slides;
    this.currentOffset = 0;
    this.targetOffset = 0;
    this.selectedIndex = 0;
    this._computeSnapPoints();
    this._startLoop();
    this._init$.next();
  }

  /** Hot-swap slides (e.g. after content children re-render). */
  reinit(slides: HTMLElement[]): void {
    this.slides = slides;
    this._computeSnapPoints();
    this.scrollTo(clamp(this.selectedIndex, 0, slides.length - 1), true);
  }

  /** Stop the RAF loop, complete all subjects. */
  destroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this._init$.complete();
    this._select$.complete();
    this._pointerDown$.complete();
    this._pointerUp$.complete();
  }

  scrollTo(index: number, immediate = false): void {
    if (!this.slides.length) return;

    const n = this.slides.length;
    const clamped = this.cfg.loop
      ? ((index % n) + n) % n
      : clamp(index, 0, n - 1);

    this.selectedIndex = clamped;
    this.targetOffset = -this._slideOffset(clamped);

    if (this.cfg.containScroll && !this.cfg.loop) {
      this.targetOffset = clamp(this.targetOffset, -this._maxNeg(), 0);
    }

    if (immediate) this.currentOffset = this.targetOffset;
    this._select$.next(this.selectedIndex);
  }

  scrollNext(immediate = false): void {
    const currentPage = this._snapIndexFromSlide(this.selectedIndex);
    const pageCount = this.snapPoints.length;

    let nextPage = currentPage + 1;
    if (nextPage >= pageCount) {
      if (!this.cfg.loop) return;
      nextPage = 0;
    }
    this.scrollTo(this.snapPoints[nextPage], immediate);
  }

  scrollPrev(immediate = false): void {
    const currentPage = this._snapIndexFromSlide(this.selectedIndex);
    const pageCount = this.snapPoints.length;

    let prevPage = currentPage - 1;
    if (prevPage < 0) {
      if (!this.cfg.loop) return;
      prevPage = pageCount - 1;
    }
    this.scrollTo(this.snapPoints[prevPage], immediate);
  }

  getSelectedIndex = (): number => this.selectedIndex;
  getSnapPoints = (): readonly number[] => this.snapPoints;
  getSelectedSnapIndex = (): number =>
    this._snapIndexFromSlide(this.selectedIndex);
  getSlideCount = (): number => this.slides.length;
  canScrollNext = (): boolean =>
    this.cfg.loop ||
    this._snapIndexFromSlide(this.selectedIndex) < this.snapPoints.length - 1;
  canScrollPrev = (): boolean =>
    this.cfg.loop || this._snapIndexFromSlide(this.selectedIndex) > 0;

  onPointerDown(clientXY: number): void {
    this.pointerDown = true;
    this.pointerOrigin = clientXY;
    this.pointerDelta = 0;
    this.baseOffset = this.currentOffset;
    this._pointerDown$.next();
  }

  onPointerMove(clientXY: number): void {
    if (!this.pointerDown) return;
    this.pointerDelta = clientXY - this.pointerOrigin;
    this.targetOffset = this.baseOffset + this.pointerDelta;

    // rubber-band when not looping
    if (!this.cfg.loop && this.cfg.containScroll) {
      const mn = -this._maxNeg();
      const mx = 0;
      if (this.targetOffset > mx)
        this.targetOffset = mx + (this.targetOffset - mx) * 0.22;
      else if (this.targetOffset < mn)
        this.targetOffset = mn + (this.targetOffset - mn) * 0.22;
    }
  }

  onPointerUp(): void {
    if (!this.pointerDown) return;
    this.pointerDown = false;

    const { dragFree, dragThreshold } = this.cfg;

    if (dragFree) {
      this._snapToNearest();
    } else if (Math.abs(this.pointerDelta) >= dragThreshold) {
      if (this.pointerDelta < 0) this.scrollNext();
      else this.scrollPrev();
    } else {
      this.scrollTo(this.selectedIndex);
    }

    this.pointerDelta = 0;
    this._pointerUp$.next();
  }

  /**
   * Legacy callback API kept for backwards compatibility.
   * New code should subscribe to the corresponding `*$` observable.
   */
  on(
    event: "init" | "select" | "pointerDown" | "pointerUp",
    listener: AnyListener,
  ): () => void {
    const stream: Observable<unknown> =
      event === "init"
        ? this.init$
        : event === "select"
          ? this.select$
          : event === "pointerDown"
            ? this.pointerDown$
            : this.pointerUp$;

    const sub = stream.subscribe((v) =>
      v === undefined ? listener() : listener(v),
    );
    return () => sub.unsubscribe();
  }

  private _startLoop(): void {
    const tick = (): void => {
      if (this.rafId === null) return;

      this.rafId = requestAnimationFrame(tick);

      if (!this.pointerDown) {
        const diff = this.targetOffset - this.currentOffset;
        this.currentOffset =
          Math.abs(diff) < 0.015
            ? this.targetOffset
            : lerp(this.currentOffset, this.targetOffset, this.cfg.speed);
      } else {
        this.currentOffset = this.targetOffset;
      }

      this._applyTransform();
    };

    this.rafId = requestAnimationFrame(tick);
  }

  private _applyTransform(): void {
    if (!this.container) return;
    const isY = this.cfg.axis === "y";
    this.container.style.transform = isY
      ? `translate3d(0, ${this.currentOffset}px, 0)`
      : `translate3d(${this.currentOffset}px, 0, 0)`;
  }

  private _slideOffset(index: number): number {
    const isY = this.cfg.axis === "y";

    let cumulative = 0;
    for (let i = 0; i < index; i++) cumulative += this._slideSize(i);

    const viewportSize = this.container.parentElement
      ? this.container.parentElement[isY ? "clientHeight" : "clientWidth"]
      : 0;
    const slidePx =
      this.slides[index]?.[isY ? "offsetHeight" : "offsetWidth"] ?? 0;

    if (this.cfg.align === "center") cumulative -= (viewportSize - slidePx) / 2;
    if (this.cfg.align === "end") cumulative -= viewportSize - slidePx;

    return cumulative;
  }

  private _slideSize(index: number): number {
    const el = this.slides[index];
    if (!el) return 0;
    const cs = window.getComputedStyle(el);
    const isY = this.cfg.axis === "y";
    const margin = isY
      ? parseFloat(cs.marginTop) + parseFloat(cs.marginBottom)
      : parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
    return (isY ? el.offsetHeight : el.offsetWidth) + margin;
  }

  private _totalSize(): number {
    return this.slides.reduce((acc, _, i) => acc + this._slideSize(i), 0);
  }

  private _maxNeg(): number {
    const isY = this.cfg.axis === "y";
    const viewport = this.container.parentElement
      ? this.container.parentElement[isY ? "clientHeight" : "clientWidth"]
      : 0;
    return Math.max(0, this._totalSize() - viewport);
  }

  private _snapToNearest(): void {
    let best = 0;
    let bestDist = Infinity;
    this.slides.forEach((_, i) => {
      const dist = Math.abs(this.currentOffset + this._slideOffset(i));
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    this.scrollTo(best);
  }

  private _computeSnapPoints(): void {
    if (!this.slides.length || !this.container?.parentElement) {
      this.snapPoints = [0];
      return;
    }

    const isY = this.cfg.axis === "y";
    const viewport =
      this.container.parentElement[isY ? "clientHeight" : "clientWidth"];

    if (viewport <= 0) {
      this.snapPoints = this.slides.map((_, i) => i);
      return;
    }

    const points: number[] = [];
    let consumed = 0;
    let pageStart = 0;
    const total = this._totalSize();
    const maxStartOffset = Math.max(0, total - viewport);

    for (let i = 0; i < this.slides.length; i++) {
      const startOffset = consumed;

      if (
        i === 0 ||
        startOffset - this._cumulativeSize(pageStart) >= viewport
      ) {
        if (
          this.cfg.containScroll &&
          !this.cfg.loop &&
          startOffset > maxStartOffset &&
          points.length
        ) {
          break;
        }
        points.push(i);
        pageStart = i;
      }
      consumed += this._slideSize(i);
    }

    this.snapPoints = points.length ? points : [0];
  }
  private _cumulativeSize(uptoIndex: number): number {
    let acc = 0;
    for (let i = 0; i < uptoIndex; i++) acc += this._slideSize(i);
    return acc;
  }

  /** Map a slide index → the page it belongs to. */
  private _snapIndexFromSlide(slideIndex: number): number {
    let page = 0;
    for (let i = 0; i < this.snapPoints.length; i++) {
      if (this.snapPoints[i] <= slideIndex) page = i;
      else break;
    }
    return page;
  }
}
