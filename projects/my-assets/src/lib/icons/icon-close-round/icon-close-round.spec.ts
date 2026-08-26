import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InmIconCloseRound } from "./icon-close-round";

describe("InmIconCloseRound", () => {
  let component: InmIconCloseRound;
  let fixture: ComponentFixture<InmIconCloseRound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InmIconCloseRound],
    }).compileComponents();

    fixture = TestBed.createComponent(InmIconCloseRound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default width of 28", () => {
    expect(component.width()).toBe(28);
  });

  it("should have default height of 28", () => {
    expect(component.height()).toBe(28);
  });

  it("should render an <svg> element", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg).toBeTruthy();
  });

  it("should render with the correct viewBox", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("viewBox")).toBe("0 0 28 28");
  });

  it("should apply the default width and height attributes to the svg", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("width")).toBe("28");
    expect(svg.getAttribute("height")).toBe("28");
  });

  it("should update svg width and height when inputs change", () => {
    fixture.componentRef.setInput("width", 32);
    fixture.componentRef.setInput("height", 32);
    fixture.detectChanges();

    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("width")).toBe("32");
    expect(svg.getAttribute("height")).toBe("32");
  });

  it("should render the X cross path inside the svg", () => {
    const path: SVGPathElement =
      fixture.nativeElement.querySelector("svg path");

    expect(path).toBeTruthy();
    expect(path.getAttribute("d")).toBe(
      "M16.9166 11.083L11.0833 16.9163M11.0832 11.083L16.9165 16.9163",
    );
  });

  it("should have aria-hidden set on the svg", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });
});
