import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IconBox } from "./icon-box";

describe("IconBox", () => {
  let component: IconBox;
  let fixture: ComponentFixture<IconBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconBox],
    }).compileComponents();

    fixture = TestBed.createComponent(IconBox);
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
    fixture.componentRef.setInput("size", 32);
    fixture.detectChanges();

    const svgElement: SVGElement = fixture.nativeElement.querySelector("svg");
    expect(svgElement.getAttribute("height")).toBe("32");
    expect(svgElement.getAttribute("width")).toBe("32");
  });

  it("should render the svg element", () => {
    const svgElement: SVGElement = fixture.nativeElement.querySelector("svg");
    expect(svgElement).toBeTruthy();
    expect(svgElement.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
