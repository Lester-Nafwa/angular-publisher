import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CurvedProgressBar } from "./curved-progress-bar";

describe("CurvedProgressBar", () => {
  let component: CurvedProgressBar;
  let fixture: ComponentFixture<CurvedProgressBar>;
  let element: HTMLElement;

  const setValue = async (value: number) => {
    fixture.componentRef.setInput("value", value);
    await fixture.whenStable();
  };

  const setLabel = async (label: string) => {
    fixture.componentRef.setInput("label", label);
    await fixture.whenStable();
  };

  const progressPath = () =>
    element.querySelectorAll<SVGPathElement>("path")[1];

  const percentText = () =>
    element.querySelector("span.text-5xl")?.textContent?.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurvedProgressBar],
    }).compileComponents();

    fixture = TestBed.createComponent(CurvedProgressBar);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput("value", 50);
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("value display", () => {
    it("should display the value as a percentage", async () => {
      await setValue(42);

      expect(percentText()).toBe("42%");
    });

    it("should round fractional values", async () => {
      await setValue(42.6);

      expect(percentText()).toBe("43%");
    });

    it("should clamp values above 100 to 100", async () => {
      await setValue(150);

      expect(percentText()).toBe("100%");
    });

    it("should clamp negative values to 0", async () => {
      await setValue(-20);

      expect(percentText()).toBe("0%");
    });

    it("should fall back to 0 for non-finite values", async () => {
      await setValue(NaN);
      expect(percentText()).toBe("0%");

      await setValue(Infinity);
      expect(percentText()).toBe("0%");
    });
  });

  describe("dash offset", () => {
    it("should set stroke-dashoffset to 100 minus the clamped value", async () => {
      await setValue(70);

      expect(progressPath().getAttribute("stroke-dashoffset")).toBe("30");
    });

    it("should be fully hidden at 0", async () => {
      await setValue(0);

      expect(progressPath().getAttribute("stroke-dashoffset")).toBe("100");
    });

    it("should be fully drawn at 100 and above", async () => {
      await setValue(250);

      expect(progressPath().getAttribute("stroke-dashoffset")).toBe("0");
    });
  });

  describe("stroke colour", () => {
    it("should be green below 70", async () => {
      await setValue(69);

      expect(progressPath().classList.contains("stroke-green-500")).toBe(true);
    });

    it("should be amber from 70 up to 89", async () => {
      await setValue(70);
      expect(progressPath().classList.contains("stroke-amber-400")).toBe(true);

      await setValue(89);
      expect(progressPath().classList.contains("stroke-amber-400")).toBe(true);
    });

    it("should be red from 90", async () => {
      await setValue(90);

      expect(progressPath().classList.contains("stroke-red-500")).toBe(true);
    });

    it("should pick the colour from the rounded value", async () => {
      // 69.6 rounds to 70, which crosses into the amber band.
      await setValue(69.6);

      expect(progressPath().classList.contains("stroke-amber-400")).toBe(true);
    });

    it("should keep the transition classes", async () => {
      await setValue(10);

      expect(progressPath().classList.contains("transition-all")).toBe(true);
      expect(progressPath().classList.contains("duration-700")).toBe(true);
    });
  });

  describe("label", () => {
    it("should use the default label", () => {
      expect(element.textContent).toContain("% Percentage Utilized");
    });

    it("should render a custom label", async () => {
      await setLabel("Limit used");

      expect(element.textContent).toContain("Limit used");
      expect(element.textContent).not.toContain("% Percentage Utilized");
    });
  });

  describe("accessibility", () => {
    it("should expose the label and value via aria-label on the svg", async () => {
      await setValue(70);

      const svg = element.querySelector("svg");

      expect(svg?.getAttribute("role")).toBe("img");
      expect(svg?.getAttribute("aria-label")).toBe("% Percentage Utilized 70%");
    });

    it("should update aria-label when the label changes", async () => {
      await setValue(25);
      await setLabel("Used");

      expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
        "Used 25%",
      );
    });
  });
});
