import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InmIconPlay } from "./icon-play";

describe("InmIconPlay", () => {
  let component: InmIconPlay;
  let fixture: ComponentFixture<InmIconPlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InmIconPlay],
    }).compileComponents();

    fixture = TestBed.createComponent(InmIconPlay);
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

    expect(svg.getAttribute("viewBox")).toBe("0 0 12 12");
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

  it("should render the play path inside the svg", () => {
    const path: SVGPathElement =
      fixture.nativeElement.querySelector("svg path");

    expect(path).toBeTruthy();
    expect(path.getAttribute("d")).toBe(
      "M10.7043 4.67629C11.7652 5.25324 11.7652 6.74677 10.7043 7.32371L4.29831 10.8073C3.26718 11.368 2 10.6382 2 9.48355L2 2.51645C2 1.36184 3.26718 0.632011 4.29831 1.19274L10.7043 4.67629Z",
    );
  });

  it("should have aria-hidden set on the svg", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });
});
