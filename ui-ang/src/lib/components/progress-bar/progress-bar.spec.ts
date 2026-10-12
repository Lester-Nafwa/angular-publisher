import { ComponentFixture, TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";

import { ProgressBar } from "./progress-bar";

describe("ProgressBar", () => {
  let fixture: ComponentFixture<ProgressBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBar],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBar);
    fixture.componentRef.setInput("value", 50);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should clamp value between 0 and 100", () => {
    fixture.componentRef.setInput("value", 140);
    fixture.detectChanges();
    expect(fixture.componentInstance.clampedValue()).toBe(100);

    fixture.componentRef.setInput("value", -20);
    fixture.detectChanges();
    expect(fixture.componentInstance.clampedValue()).toBe(0);

    fixture.componentRef.setInput("value", Number.NaN);
    fixture.detectChanges();
    expect(fixture.componentInstance.clampedValue()).toBe(0);
  });

  it("should expose progressbar semantics", () => {
    const track = fixture.nativeElement.querySelector(
      "[data-testid='inm-progress-bar']",
    ) as HTMLElement;

    expect(track.getAttribute("role")).toBe("progressbar");
    expect(track.getAttribute("aria-valuenow")).toBe("50");
    expect(track.getAttribute("aria-valuemin")).toBe("0");
    expect(track.getAttribute("aria-valuemax")).toBe("100");
  });

  it("should apply width, height, track color, padding, and aria label", () => {
    fixture.componentRef.setInput("width", "200px");
    fixture.componentRef.setInput("height", "12px");
    fixture.componentRef.setInput("trackColor", "rgb(1, 2, 3)");
    fixture.componentRef.setInput("padding", "2px");
    fixture.componentRef.setInput("ariaLabel", "Adoption progress");
    fixture.detectChanges();

    const track = fixture.nativeElement.querySelector(
      "[data-testid='inm-progress-bar']",
    ) as HTMLElement;

    expect(track.style.width).toBe("200px");
    expect(track.style.height).toBe("12px");
    expect(track.style.backgroundColor).toBe("rgb(1, 2, 3)");
    expect(track.style.padding).toBe("2px");
    expect(track.getAttribute("aria-label")).toBe("Adoption progress");
  });

  it("should apply roundedClass to track and fill", () => {
    fixture.componentRef.setInput("roundedClass", "rounded-full");
    fixture.detectChanges();

    const track = fixture.nativeElement.querySelector(
      "[data-testid='inm-progress-bar']",
    ) as HTMLElement;
    const fill = fixture.nativeElement.querySelector(
      "[data-testid='inm-progress-bar-fill']",
    ) as HTMLElement;

    expect(track.classList.contains("rounded-full")).toBe(true);
    expect(fill.classList.contains("rounded-full")).toBe(true);
  });

  it("should fall back to currentColor when no fill is provided", () => {
    expect(fixture.componentInstance.fillBackground()).toBe("currentColor");
  });

  it("should build gradient background from parent fillGradient", () => {
    fixture.componentRef.setInput("fillGradient", [
      { offset: "0%", color: "rgba(0,136,129,1)" },
      { offset: "100%", color: "rgba(4,233,237,1)" },
    ]);
    fixture.detectChanges();

    expect(fixture.componentInstance.fillBackground()).toBe(
      "linear-gradient(to bottom, rgba(0,136,129,1) 0%, rgba(4,233,237,1) 100%)",
    );
  });

  it("should prefer solid fillColor over gradient", () => {
    fixture.componentRef.setInput("fillGradient", [
      { offset: "0%", color: "#111111" },
      { offset: "100%", color: "#eeeeee" },
    ]);
    fixture.componentRef.setInput("fillColor", "#00ff00");
    fixture.detectChanges();

    expect(fixture.componentInstance.fillBackground()).toBe("#00ff00");
  });

  it("should set fill width from clamped percent", () => {
    fixture.componentRef.setInput("value", 25);
    fixture.detectChanges();

    const fill = fixture.nativeElement.querySelector(
      "[data-testid='inm-progress-bar-fill']",
    ) as HTMLElement;
    expect(fill.style.width).toBe("25%");
  });
});
