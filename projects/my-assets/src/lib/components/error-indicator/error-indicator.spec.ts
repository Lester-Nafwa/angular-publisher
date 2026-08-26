import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ErrorIndicator } from "./error-indicator";

describe("ErrorIndicator", () => {
  let component: ErrorIndicator;
  let fixture: ComponentFixture<ErrorIndicator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorIndicator],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorIndicator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render default error title and message", () => {
    const textContent = fixture.nativeElement.textContent;

    expect(textContent).toContain("Error");
    expect(textContent).toContain(
      "An unexpected error occurred. Please try again later.",
    );
  });

  it("should render provided error title and message", () => {
    fixture.componentRef.setInput("error", {
      title: "Service unavailable",
      message: "Please retry in a few minutes.",
    });
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain("Service unavailable");
    expect(textContent).toContain("Please retry in a few minutes.");
  });
});
