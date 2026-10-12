import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IconGear } from "./icon-gear";

describe("IconGear", () => {
  let component: IconGear;
  let fixture: ComponentFixture<IconGear>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconGear],
    }).compileComponents();

    fixture = TestBed.createComponent(IconGear);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have a default size of 24", () => {
    expect(component.size()).toBe(24);
  });

  it("should render an svg with expected viewBox", () => {
    const svgElement: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svgElement).toBeTruthy();
    expect(svgElement.getAttribute("viewBox")).toBe("0 0 24 24");
  });

  it("should bind width and height from size input", () => {
    fixture.componentRef.setInput("size", 36);
    fixture.detectChanges();

    const svgElement: SVGElement = fixture.nativeElement.querySelector("svg");
    expect(svgElement.getAttribute("width")).toBe("36");
    expect(svgElement.getAttribute("height")).toBe("36");
  });
});
