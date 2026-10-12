import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { IconSortComponent } from "./icon-sort";

describe("IconSortComponent", () => {
  let fixture: ComponentFixture<IconSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSortComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconSortComponent);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should default to a 24x24 svg", () => {
    const svg: SVGElement = fixture.debugElement.query(
      By.css("svg"),
    ).nativeElement;

    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });

  it("should reflect custom width and height inputs", () => {
    fixture.componentRef.setInput("width", 16);
    fixture.componentRef.setInput("height", 18);
    fixture.detectChanges();

    const svg: SVGElement = fixture.debugElement.query(
      By.css("svg"),
    ).nativeElement;

    expect(svg.getAttribute("width")).toBe("16");
    expect(svg.getAttribute("height")).toBe("18");
  });

  it("should be hidden from assistive tech", () => {
    const svg: SVGElement = fixture.debugElement.query(
      By.css("svg"),
    ).nativeElement;

    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });
});
