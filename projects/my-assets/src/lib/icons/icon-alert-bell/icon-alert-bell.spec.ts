import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InmIconAlertBell } from "./icon-alert-bell";

describe("InmIconAlertBell", () => {
  let component: InmIconAlertBell;
  let fixture: ComponentFixture<InmIconAlertBell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InmIconAlertBell],
    }).compileComponents();

    fixture = TestBed.createComponent(InmIconAlertBell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default width of 24", () => {
    expect(component.width()).toBe(24);
  });

  it("should have default height of 24", () => {
    expect(component.height()).toBe(24);
  });

  it("should render an <svg> element", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg).toBeTruthy();
  });

  it("should render with the correct viewBox", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("viewBox")).toBe("0 -960 960 960");
  });

  it("should render with the correct fill color", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("fill")).toBe("#e3e3e3");
  });

  it("should render with width and height based on inputs (default 24)", () => {
    const svg: SVGElement = fixture.nativeElement.querySelector("svg");

    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });

  it("should render the bell path inside the svg", () => {
    const path: SVGPathElement =
      fixture.nativeElement.querySelector("svg path");

    expect(path).toBeTruthy();
    expect(path.getAttribute("d")).toBe(
      "M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z",
    );
  });
});
