import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IconKey } from "./icon-key";

describe("IconKey", () => {
  let component: IconKey;
  let fixture: ComponentFixture<IconKey>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconKey],
    }).compileComponents();

    fixture = TestBed.createComponent(IconKey);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default size of 24", () => {
    expect(component.size()).toBe(24);
  });

  it("should bind input height and width correctly", () => {
    fixture.componentRef.setInput("size", 16);
    fixture.detectChanges();

    const svgElement: SVGElement = fixture.nativeElement.querySelector("svg");
    expect(svgElement.getAttribute("height")).toBe("16");
    expect(svgElement.getAttribute("width")).toBe("16");
  });

  it("should render the svg element", () => {
    const svgElement: SVGElement = fixture.nativeElement.querySelector("svg");
    expect(svgElement).toBeTruthy();
    expect(svgElement.getAttribute("viewBox")).toBe("0 0 12 12");
  });
});
