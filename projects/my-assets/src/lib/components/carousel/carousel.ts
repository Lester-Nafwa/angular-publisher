import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ContentChildren,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  QueryList,
  signal,
  ViewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { BehaviorSubject, EMPTY, combineLatest, interval } from "rxjs";
import { switchMap } from "rxjs/operators";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { CarouselEngine, CarouselAlign, CarouselAxis } from "./carousel.engine";
import { CarouselSlide } from "./carousel-slide";

/**
 * Carousel component for displaying a collection of slides with navigation controls.
 *
 * @example
 * ```html
 *   <inm-carousel
 *     slideSize="100%"
 *     ariaLabel="Featured content"
 *     [loop]="true"
 *     [autoplay]="true"
 *     [autoplayDelay]="4000"
 *     [pauseOnHover]="true"
 *     [showDots]="true"
 *     [showProgress]="true"
 *     [showCounter]="true"
 *     [slidesToScroll]="1"
 *     (selectedChange)="heroIdx.set($event)"
 *   >
 *     @for (s of heroSlides; track s.label) {
 *       <ng-template inmCarouselSlide>
 *         <div class="h-80 flex flex-col justify-end p-7 text-white {{ s.cls }}">
 *           <p class="text-xl font-bold tracking-tight mb-1">{{ s.label }}</p>
 *           <p class="text-xs opacity-60">{{ s.sub }}</p>
 *         </div>
 *       </ng-template>
 *     }
 *   </inm-carousel>
 *   ```
 */
@Component({
  selector: "inm-carousel",
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./carousel.html",
})
export class Carousel implements AfterViewInit, OnDestroy {
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _destroyRef = inject(DestroyRef);

  @ContentChildren(CarouselSlide) slides!: QueryList<CarouselSlide>;
  @ViewChild("viewport") viewportRef!: ElementRef<HTMLElement>;
  @ViewChild("track") trackRef!: ElementRef<HTMLElement>;

  showArrows = input(true);
  floatingArrows = input(true);
  showDots = input(true);
  showCounter = input(false);
  showProgress = input(false);
  dimInactive = input(false);
  rounded = input(false);
  loop = input(false);
  dragFree = input(false);
  align = input<CarouselAlign>("start");
  axis = input<CarouselAxis>("x");

  /**
   * CSS length used for the size of each slide along the scroll axis.
   * Any CSS length is accepted: `100%`, `80%`, `320px`, …
   *
   * When `slidesPerView` is provided (> 0), it takes precedence and
   * each slide will be sized as `100% / slidesPerView` along the axis.
   */
  slideSize = input("100%");

  /**
   * Number of slides visible at once. When set to a number ≥ 1, the
   * component computes `slideSize` automatically, ensuring multiple
   * items render in vertical (and horizontal) mode.
   */
  slidesPerView = input<number | null>(null);

  /** Height of the viewport when `axis === 'y'` (e.g. `20rem`, `320px`). */
  viewportHeight = input("20rem");

  gap = input("1rem");
  ariaLabel = input("Carousel");
  slidesToScroll = input(1);
  speed = input(12);
  initialIndex = input(0);

  /** Enable automatic advancement of slides. */
  autoplay = input(false);
  /** Autoplay interval in milliseconds. */
  autoplayDelay = input(4000);
  /** Pause autoplay while the pointer hovers the carousel. */
  pauseOnHover = input(true);

  /** Emits the new index whenever the selected slide changes. */
  selectedChange = output<number>();

  /** Currently active slide index. */
  readonly activeIndex = signal(0);
  /** Index of the active page (snap point). */
  readonly activeSnapIndex = signal(0);
  /** Snap points reported by the engine — one entry per "page". */
  readonly snapPoints = signal<readonly number[]>([0]);
  /** True while a pointer drag is in progress. */
  readonly isDragging = signal(false);
  /** True while the pointer hovers the carousel. */
  readonly isHovered = signal(false);

  /** Hover state as an observable for autoplay pipeline. */
  private readonly _hover$ = new BehaviorSubject<boolean>(false);
  /** Drag state as an observable for autoplay pipeline. */
  private readonly _drag$ = new BehaviorSubject<boolean>(false);

  readonly resolvedSlideSize = computed(() => {
    const perView = this.slidesPerView();
    if (perView && perView > 0) {
      return `${100 / perView}%`;
    }
    const s = this.slideSize();
    return /^[\d.]+(%|px|rem|em|vw|vh|svw|svh)$/.test(s) ? s : "100%";
  });

  readonly progressPercent = computed(() => {
    const pages = this.snapPoints().length;
    return pages > 1 ? ((this.activeSnapIndex() + 1) / pages) * 100 : 100;
  });

  engine = new CarouselEngine();

  private _initTimer: ReturnType<typeof setTimeout> | null = null;

  ngAfterViewInit(): void {
    this._mountEngine();

    this.slides.changes
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        if (this._initTimer !== null) {
          return;
        }

        this.engine.reinit(this._slideElements());
        this._cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this._initTimer !== null) {
      clearTimeout(this._initTimer);
      this._initTimer = null;
    }

    this._hover$.complete();
    this._drag$.complete();
    this.engine.destroy();
  }

  next(): void {
    this.engine.scrollNext();
  }

  prev(): void {
    this.engine.scrollPrev();
  }

  goTo(i: number): void {
    this.engine.scrollTo(i);
  }

  goToPage(pageIdx: number): void {
    const start = this.snapPoints()[pageIdx];
    if (start !== undefined) this.engine.scrollTo(start);
  }

  onPointerDown(e: PointerEvent): void {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.isDragging.set(true);
    this._drag$.next(true);
    this.engine.onPointerDown(this.axis() === "y" ? e.clientY : e.clientX);
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.isDragging()) return;
    e.preventDefault();
    this.engine.onPointerMove(this.axis() === "y" ? e.clientY : e.clientX);
  }

  onPointerUp(_e: PointerEvent): void {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    this._drag$.next(false);
    this.engine.onPointerUp();
  }

  onPointerLeave(e: PointerEvent): void {
    if (this.isDragging() && !e.buttons) this.onPointerUp(e);
    this.isHovered.set(false);
    this._hover$.next(false);
  }

  onPointerEnter(): void {
    this.isHovered.set(true);
    this._hover$.next(true);
  }

  private _mountEngine(): void {
    this.engine = new CarouselEngine({
      loop: this.loop(),
      dragFree: this.dragFree(),
      align: this.align(),
      axis: this.axis(),
      slidesToScroll: this.slidesToScroll(),
      speed: this.speed(),
      containScroll: true,
    });

    // Selection stream — reactive replacement for the old callback bus.
    this.engine.select$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((idx: number) => {
        this.activeIndex.set(idx);
        this.activeSnapIndex.set(this.engine.getSelectedSnapIndex());
        this.snapPoints.set(this.engine.getSnapPoints());
        this.selectedChange.emit(idx);
      });

    this._wireAutoplay();

    this._initTimer = setTimeout(() => {
      this._initTimer = null;

      this.engine.init(this.trackRef.nativeElement, this._slideElements());
      this.snapPoints.set(this.engine.getSnapPoints());
      this.activeSnapIndex.set(this.engine.getSelectedSnapIndex());

      if (this.initialIndex() > 0)
        this.engine.scrollTo(this.initialIndex(), true);
      this._cdr.detectChanges();
    });
  }

  /**
   * Build autoplay:
   *
   *   autoplay × pauseOnHover × isDragging -> interval(delay) → next()
   *
   * Whenever any of the gating signals change, the inner timer is
   * cancelled and (re-)started, ensuring the carousel pauses on
   * hover / drag and resumes when the pointer leaves.
   */
  private _wireAutoplay(): void {
    combineLatest([this._hover$, this._drag$])
      .pipe(
        switchMap(([hovered, dragging]) => {
          if (!this.autoplay()) return EMPTY;
          if (dragging) return EMPTY;
          if (hovered && this.pauseOnHover()) return EMPTY;
          return interval(this.autoplayDelay());
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => this.next());
  }

  private _slideElements(): HTMLElement[] {
    return Array.from(this.trackRef.nativeElement.children) as HTMLElement[];
  }
}
