import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IconDownload } from "./icon-download";

describe("Download", () => {
  let component: IconDownload;
  let fixture: ComponentFixture<IconDownload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconDownload],
    }).compileComponents();

    fixture = TestBed.createComponent(IconDownload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should use the default width and height", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("width")).toBe("18");
    expect(svg.getAttribute("height")).toBe("18");
  });
});
