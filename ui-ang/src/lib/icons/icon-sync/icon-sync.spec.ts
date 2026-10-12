import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IconSync } from "./icon-sync";

describe("IconSync", () => {
  let component: IconSync;
  let fixture: ComponentFixture<IconSync>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSync],
    }).compileComponents();

    fixture = TestBed.createComponent(IconSync);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default size of 12", () => {
    expect(component.size()).toBe(12);
  });

  it("should bind input height and width correctly", () => {
    fixture.componentRef.setInput("size", 50);
    fixture.detectChanges();

    const svgElement: SVGElement = fixture.nativeElement.querySelector("svg");
    expect(svgElement.getAttribute("height")).toBe("50");
    expect(svgElement.getAttribute("width")).toBe("50");
  });

  it("should render the <svg> element", () => {
    const svgElement: SVGElement = fixture.nativeElement.querySelector("svg");
    expect(svgElement).toBeTruthy();
    expect(svgElement.getAttribute("viewBox")).toBe("0 0 12 12");
  });

  it("should update the height and width when inputs change", () => {
    fixture.componentRef.setInput("size", 100);
    fixture.detectChanges();

    const svgElement: SVGElement = fixture.nativeElement.querySelector("svg");
    expect(svgElement.getAttribute("height")).toBe("100");
    expect(svgElement.getAttribute("width")).toBe("100");
  });
});
