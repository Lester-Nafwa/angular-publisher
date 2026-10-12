import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DateInputSelector } from "./date-input-selector";

describe("DateInputSelector", () => {
  let component: DateInputSelector;
  let fixture: ComponentFixture<DateInputSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateInputSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(DateInputSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
