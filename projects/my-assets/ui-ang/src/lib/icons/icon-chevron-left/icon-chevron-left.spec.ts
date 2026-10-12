import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InmIconChevronLeft } from "./icon-chevron-left";

describe("InmIconChevronLeft", () => {
  let component: InmIconChevronLeft;
  let fixture: ComponentFixture<InmIconChevronLeft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InmIconChevronLeft],
    }).compileComponents();

    fixture = TestBed.createComponent(InmIconChevronLeft);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default width of 18", () => {
    expect(component.width()).toBe(18);
  });

  it("should have default height of 18", () => {
    expect(component.height()).toBe(18);
  });

  it("should render an <svg> element", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg).toBeTruthy();
  });

  it("should render with the correct viewBox", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("viewBox")).toBe("0 0 18 18");
  });

  it("should apply the default width and height attributes to the svg", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("width")).toBe("18");
    expect(svg.getAttribute("height")).toBe("18");
  });

  it("should update svg width and height when inputs change", () => {
    fixture.componentRef.setInput("width", 24);
    fixture.componentRef.setInput("height", 24);
    fixture.detectChanges();

    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });

  it("should render the chevron path inside the svg", () => {
    const path: SVGPathElement =
      fixture.nativeElement.querySelector("svg path");

    expect(path).toBeTruthy();
    expect(path.getAttribute("d")).toBe(
      "M8.24626 3.75307H2.55376L5.02876 1.28557C5.16999 1.14434 5.24933 0.952795 5.24933 0.753069C5.24933 0.553343 5.16999 0.361797 5.02876 0.220569C4.88753 0.079341 4.69599 0 4.49626 0C4.29653 0 4.10499 0.079341 3.96376 0.220569L0.21376 3.97057C0.14548 4.0419 0.0919559 4.12601 0.0562601 4.21807C-0.0187534 4.40067 -0.0187534 4.60547 0.0562601 4.78807C0.0919559 4.88013 0.14548 4.96424 0.21376 5.03557L3.96376 8.78557C4.03348 8.85586 4.11643 8.91166 4.20783 8.94974C4.29922 8.98781 4.39725 9.00742 4.49626 9.00742C4.59527 9.00742 4.6933 8.98781 4.78469 8.94974C4.87609 8.91166 4.95904 8.85586 5.02876 8.78557C5.09906 8.71585 5.15485 8.6329 5.19293 8.5415C5.23101 8.45011 5.25061 8.35208 5.25061 8.25307C5.25061 8.15406 5.23101 8.05603 5.19293 7.96464C5.15485 7.87324 5.09906 7.79029 5.02876 7.72057L2.55376 5.25307H8.24626C8.44517 5.25307 8.63594 5.17405 8.77659 5.0334C8.91724 4.89275 8.99626 4.70198 8.99626 4.50307C8.99626 4.30416 8.91724 4.11339 8.77659 3.97274C8.63594 3.83209 8.44517 3.75307 8.24626 3.75307Z",
    );
  });

  it("should have aria-hidden set on the svg", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });
});
