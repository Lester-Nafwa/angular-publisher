import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IconShop } from "./icon.shop";

describe("IconShop", () => {
  let component: IconShop;
  let fixture: ComponentFixture<IconShop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconShop],
    }).compileComponents();

    fixture = TestBed.createComponent(IconShop);
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
    fixture.componentRef.setInput("size", 24);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector("svg") as SVGElement;

    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });
});
