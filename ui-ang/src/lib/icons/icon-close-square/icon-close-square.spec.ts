import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InmIconCloseSquare } from "./icon-close-square";

describe("InmIconCloseSquare", () => {
  let component: InmIconCloseSquare;
  let fixture: ComponentFixture<InmIconCloseSquare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InmIconCloseSquare],
    }).compileComponents();

    fixture = TestBed.createComponent(InmIconCloseSquare);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default width of 24", () => {
    expect(component.width()).toBe(24);
  });

  it("should have default height of 24", () => {
    expect(component.height()).toBe(24);
  });

  it("should render an <svg> element", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg).toBeTruthy();
  });

  it("should render with the correct viewBox", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
  });

  it("should apply the default width and height attributes to the svg", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
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
      "M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5",
    );
  });

  it("should have aria-hidden set on the svg", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });
});
