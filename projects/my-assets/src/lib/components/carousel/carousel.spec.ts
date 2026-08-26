import {
  Component,
  ViewChild,
  provideZonelessChangeDetection,
  input,
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { vi } from "vitest";

import { Carousel } from "./carousel";
import { CarouselSlide } from "./carousel-slide";

@Component({
  template: `
    <inm-carousel
      [loop]="loop()"
      [showDots]="showDots()"
      [showArrows]="showArrows()"
      [showCounter]="showCounter()"
      [showProgress]="showProgress()"
      [axis]="axis()"
      [autoplay]="autoplay()"
      [autoplayDelay]="autoplayDelay()"
      [pauseOnHover]="pauseOnHover()"
      [slidesPerView]="slidesPerView()"
      [viewportHeight]="viewportHeight()"
      (selectedChange)="onSelectedChange($event)"
    >
      <ng-template inmCarouselSlide>Slide 1</ng-template>
      <ng-template inmCarouselSlide>Slide 2</ng-template>
      <ng-template inmCarouselSlide>Slide 3</ng-template>
    </inm-carousel>
  `,
  standalone: true,
  imports: [Carousel, CarouselSlide],
})
class TestHostComponent {
  @ViewChild(Carousel) carousel!: Carousel;

  loop = input(false);
  showDots = input(true);
  showArrows = input(true);
  showCounter = input(false);
  showProgress = input(false);
  axis = input<"x" | "y">("x");

  autoplay = input(false);
  autoplayDelay = input(1000);
  pauseOnHover = input(true);
  slidesPerView = input<number | null>(null);
  viewportHeight = input("20rem");

  onSelectedChange(_index: number) {}
}

describe("Carousel", () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let carouselComponent: Carousel;

  const flushInit = async () => {
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    await flushInit();
    carouselComponent = hostComponent.carousel;
  });

  it("should create", () => {
    expect(carouselComponent).toBeTruthy();
    expect(carouselComponent.slides.length).toBe(3);
  });

  it("should initialize the activeIndex to 0", () => {
    expect(carouselComponent.activeIndex()).toBe(0);
  });

  it("should navigate to the next slide when 'next' is called", () => {
    vi.spyOn(hostComponent, "onSelectedChange");

    const prevButton = fixture.debugElement.query(
      By.css('button[data-testid="next-button"]'),
    );

    prevButton.nativeElement.click();

    fixture.detectChanges();

    expect(carouselComponent.activeIndex()).toBe(1);
    expect(hostComponent.onSelectedChange).toHaveBeenCalledWith(1);
  });

  it("should navigate to the prev slide when 'prev' is called", () => {
    carouselComponent.goTo(2);
    fixture.detectChanges();

    const prevButton = fixture.debugElement.query(
      By.css('button[data-testid="prev-button"]'),
    );

    prevButton.nativeElement.click();

    fixture.detectChanges();

    expect(carouselComponent.activeIndex()).toBe(1);
  });

  it("should navigate to a specific slide when 'goTo' is called", () => {
    const dotButtons = fixture.debugElement.queryAll(
      By.css('button[data-testid="dot"]'),
    );

    expect(dotButtons.length).toBeGreaterThan(2);

    const secondDotButton = dotButtons[1];
    expect(secondDotButton).toBeTruthy();

    secondDotButton.nativeElement.click();

    fixture.detectChanges();
    expect(carouselComponent.activeIndex()).toBe(1);
  });

  it("should render dots based on showDots input", () => {
    const dotsContainer = fixture.debugElement.query(
      By.css('[data-testid="dots"]'),
    );
    expect(dotsContainer).toBeTruthy();
    expect(dotsContainer.children.length).toBe(3);

    fixture.componentRef.setInput("showDots", false);

    fixture.detectChanges();
    const dotsContainerHidden = fixture.debugElement.query(
      By.css('[data-testid="dots"]'),
    );
    expect(dotsContainerHidden).toBeFalsy();
  });

  it("should render arrows based on showArrows input", () => {
    let arrows = fixture.debugElement.queryAll(
      By.css(
        'button[data-testid="prev-button"], button[data-testid="next-button"]',
      ),
    );
    expect(arrows.length).toBe(2);

    fixture.componentRef.setInput("showArrows", false);
    fixture.detectChanges();
    arrows = fixture.debugElement.queryAll(
      By.css(
        'button[data-testid="prev-button"], button[data-testid="next-button"]',
      ),
    );
    expect(arrows.length).toBe(0);
  });

  it("should render counter based on showCounter input", () => {
    fixture.componentRef.setInput("showCounter", true);
    fixture.detectChanges();

    const counter = fixture.debugElement.query(
      By.css('[data-testid="counter"]'),
    );
    expect(counter).toBeTruthy();
    expect(counter.nativeElement.textContent).toContain("1");
    expect(counter.nativeElement.textContent).toContain("3");
  });

  it("should start pointer drag on pointerdown", () => {
    const viewport = fixture.debugElement.query(
      By.css('[data-testid="viewport"]'),
    ).nativeElement;
    viewport.setPointerCapture = vi.fn();

    const event = new PointerEvent("pointerdown", {
      clientX: 100,
      pointerId: 1,
    });
    viewport.dispatchEvent(event);

    expect(carouselComponent.isDragging()).toBe(true);
  });

  it("should stop pointer drag on pointerup", () => {
    const viewport = fixture.debugElement.query(
      By.css('[data-testid="viewport"]'),
    ).nativeElement;
    viewport.setPointerCapture = vi.fn();

    viewport.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 100, pointerId: 1 }),
    );
    expect(carouselComponent.isDragging()).toBe(true);

    viewport.dispatchEvent(
      new PointerEvent("pointerup", { clientX: 150, pointerId: 1 }),
    );
    expect(carouselComponent.isDragging()).toBe(false);
  });

  describe("slidesPerView", () => {
    it("should compute resolvedSlideSize from slidesPerView", async () => {
      fixture.componentRef.setInput("slidesPerView", 3);
      await flushInit();
      expect(carouselComponent.resolvedSlideSize()).toBe(`${100 / 3}%`);
    });

    it("should apply computed flex-basis to slide wrappers", async () => {
      fixture.componentRef.setInput("slidesPerView", 2);
      await flushInit();

      const slideEls = fixture.debugElement.queryAll(
        By.css('[data-testid="slide"]'),
      );
      expect(slideEls.length).toBe(3);
      slideEls.forEach((el) => {
        const style = (el.nativeElement as HTMLElement).style.flex;
        expect(style).toContain("50%");
      });
    });

    it("should render multiple items in vertical mode", async () => {
      fixture.componentRef.setInput("axis", "y");
      fixture.componentRef.setInput("slidesPerView", 2);
      await flushInit();

      const track = fixture.debugElement.query(By.css(".will-change-transform"))
        .nativeElement as HTMLElement;
      expect(track.classList.contains("flex-col")).toBe(true);

      const viewport = fixture.debugElement.query(
        By.css('[data-testid="viewport"]'),
      ).nativeElement as HTMLElement;
      // Viewport receives an explicit height in y-axis mode
      expect(viewport.style.height).toBe("20rem");

      const slideEls = fixture.debugElement.queryAll(
        By.css('[data-testid="slide"]'),
      );
      expect(slideEls.length).toBe(3);
      slideEls.forEach((el) => {
        expect((el.nativeElement as HTMLElement).style.flex).toContain("50%");
      });
    });
  });

  describe("autoplay", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const setupAutoplay = async (inputVals: {
      autoplay: boolean;
      autoplayDelay: number;
      pauseOnHover: boolean;
    }) => {
      fixture = TestBed.createComponent(TestHostComponent);
      hostComponent = fixture.componentInstance;

      fixture.componentRef.setInput("autoplay", inputVals.autoplay);
      fixture.componentRef.setInput("autoplayDelay", inputVals.autoplayDelay);
      fixture.componentRef.setInput("pauseOnHover", inputVals.pauseOnHover);

      fixture.detectChanges();

      vi.advanceTimersByTime(0);
      fixture.detectChanges();
      carouselComponent = hostComponent.carousel;
    };

    it("should advance to the next slide after the autoplay delay", async () => {
      await setupAutoplay({
        autoplay: true,
        autoplayDelay: 1000,
        pauseOnHover: false,
      });

      expect(carouselComponent.activeIndex()).toBe(0);

      vi.advanceTimersByTime(1000);
      fixture.detectChanges();
      expect(carouselComponent.activeIndex()).toBe(1);

      vi.advanceTimersByTime(1000);
      fixture.detectChanges();
      expect(carouselComponent.activeIndex()).toBe(2);
    });

    it("should not autoplay when disabled", async () => {
      await setupAutoplay({
        autoplay: false,
        autoplayDelay: 1000,
        pauseOnHover: false,
      });

      vi.advanceTimersByTime(5000);
      fixture.detectChanges();
      expect(carouselComponent.activeIndex()).toBe(0);
    });

    it("should pause autoplay on hover when pauseOnHover is true", async () => {
      await setupAutoplay({
        autoplay: true,
        autoplayDelay: 1000,
        pauseOnHover: true,
      });

      // Hover: pauseOnHover should freeze the timer.
      carouselComponent.onPointerEnter();
      vi.advanceTimersByTime(3000);
      fixture.detectChanges();
      expect(carouselComponent.activeIndex()).toBe(0);

      // Leaving the carousel re-initiates autoplay.
      carouselComponent.onPointerLeave(
        new PointerEvent("pointerleave", { buttons: 0 }),
      );
      vi.advanceTimersByTime(1000);
      fixture.detectChanges();
      expect(carouselComponent.activeIndex()).toBe(1);
    });

    it("should keep autoplaying on hover when pauseOnHover is false", async () => {
      await setupAutoplay({
        autoplay: true,
        autoplayDelay: 1000,
        pauseOnHover: false,
      });

      carouselComponent.onPointerEnter();
      vi.advanceTimersByTime(1000);
      fixture.detectChanges();
      expect(carouselComponent.activeIndex()).toBe(1);
    });

    it("should pause autoplay while the user is dragging", async () => {
      await setupAutoplay({
        autoplay: true,
        autoplayDelay: 1000,
        pauseOnHover: false,
      });

      const viewport = fixture.debugElement.query(
        By.css('[data-testid="viewport"]'),
      ).nativeElement as HTMLElement;
      viewport.setPointerCapture = vi.fn();

      viewport.dispatchEvent(
        new PointerEvent("pointerdown", { clientX: 0, pointerId: 1 }),
      );
      expect(carouselComponent.isDragging()).toBe(true);

      vi.advanceTimersByTime(3000);
      fixture.detectChanges();
      expect(carouselComponent.activeIndex()).toBe(0);

      viewport.dispatchEvent(
        new PointerEvent("pointerup", { clientX: 0, pointerId: 1 }),
      );
      vi.advanceTimersByTime(1000);
      fixture.detectChanges();
      expect(carouselComponent.activeIndex()).toBe(1);
    });
  });
});
