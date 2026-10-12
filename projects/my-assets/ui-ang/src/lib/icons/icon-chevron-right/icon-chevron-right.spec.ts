import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InmIconChevronRight } from "./icon-chevron-right";

describe("InmIconChevronRight", () => {
  let component: InmIconChevronRight;
  let fixture: ComponentFixture<InmIconChevronRight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InmIconChevronRight],
    }).compileComponents();

    fixture = TestBed.createComponent(InmIconChevronRight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default width of 18", () => {
    expect(component.size()).toBe(18);
  });

  it("should have default height of 18", () => {
    expect(component.size()).toBe(18);
  });

  it("should render an <svg> element", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg).toBeTruthy();
  });

  it("should render with the correct viewBox", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("viewBox")).toBe("0 0 6 12");
  });

  it("should apply the default width and height attributes to the svg", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("width")).toBe("18");
    expect(svg.getAttribute("height")).toBe("18");
  });

  it("should update svg width and height when inputs change", () => {
    fixture.componentRef.setInput("size", 24);
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
      "M0.75 0.75L5.25 6L4.125 7.3125M0.75 11.25L2.25 9.5",
    );
  });

  it("should have aria-hidden set on the svg", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });
});
