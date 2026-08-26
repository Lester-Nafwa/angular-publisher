 import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SelectorInput } from "./selector-input";

describe("SelectorInput", () => {
  let component: SelectorInput;
  let fixture: ComponentFixture<SelectorInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorInput],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectorInput);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("options", []);

    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});