import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IconMagnifier } from "./icon-magnifier";

describe("IconMagnifier", () => {
  let component: IconMagnifier;
  let fixture: ComponentFixture<IconMagnifier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconMagnifier],
    }).compileComponents();

    fixture = TestBed.createComponent(IconMagnifier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render svg with default size", () => {
    const svg = fixture.nativeElement.querySelector("svg") as SVGElement;

    expect(svg.getAttribute("width")).toBe("16");
    expect(svg.getAttribute("height")).toBe("16");
  });

  it("should update svg size when size input changes", () => {
    fixture.componentRef.setInput("size", 20);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector("svg") as SVGElement;

    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("20");
  });
});
