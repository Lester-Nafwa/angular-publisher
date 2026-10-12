import { ComponentFixture, TestBed } from "@angular/core/testing";
import { YearInputSelector } from "./year-input-selector";

describe("YearInputSelector", () => {
  let component: YearInputSelector;
  let fixture: ComponentFixture<YearInputSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearInputSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(YearInputSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should show the year placeholder initially", () => {
    const button = fixture.nativeElement.querySelector("button");

    expect(button.textContent).toContain("Year");
    expect(component.selectedYear()).toBeNull();
  });

  it("should store and emit the selected year", () => {
    const yearSelected = vi.fn();
    component.yearSelected.subscribe(yearSelected);
    const selectedDate = new Date(2025, 0, 1);

    component.onYearSelected(selectedDate);
    fixture.detectChanges();

    expect(component.selectedDate()).toBe(selectedDate);
    expect(component.selectedYear()).toBe(2025);
    expect(yearSelected).toHaveBeenCalledOnce();
    expect(yearSelected).toHaveBeenCalledWith(2025);
    expect(fixture.nativeElement.querySelector("button").textContent).toContain(
      "2025",
    );
  });

  it("should render a multi-year calendar when opened", async () => {
    fixture.nativeElement.querySelector("button").click();
    await fixture.whenStable();

    const calendar = document.querySelector("mat-calendar");

    expect(calendar).not.toBeNull();
    if (!calendar) {
      return;
    }
    expect(calendar.getAttribute("startview")).toBe("multi-year");
  });
});
