import {
  Component,
  Input,
  provideZonelessChangeDetection,
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { Button, InmButtonSize, InmButtonType } from "./button";

@Component({
  selector: "inm-button",
  standalone: true,
  imports: [Button],
  template: `
    <button
      inm-button
      [inmType]="inmType"
      [inmSize]="inmSize"
      [inmLoading]="loading"
      [inmBlock]="inBlock"
      [disabled]="disabled"
      [tabindex]="tabIndex"
    >
      button
    </button>
  `,
})
class TestButton {
  @Input() inmType: InmButtonType = null;
  @Input() inmSize: InmButtonSize = null;
  @Input() loading = false;
  @Input() inBlock = false;
  @Input() disabled = false;
  @Input() tabIndex: number | string | null = null;
}

describe("Button", () => {
  let component: TestButton;
  let fixture: ComponentFixture<TestButton>;
  let buttonElement: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestButton);
    component = fixture.componentInstance;
    buttonElement = fixture.debugElement.query(
      By.directive(Button),
    ).nativeElement;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("className", () => {
    it("should apply default classname btn", () => {
      expect(buttonElement.classList).toContain("btn");
    });

    it("should apply classname based on inmType", () => {
      expect(buttonElement.classList).not.toContain("btn-primary");
      fixture.componentRef.setInput("inmType", "primary");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-primary");

      expect(buttonElement.classList).not.toContain("btn-secondary");
      fixture.componentRef.setInput("inmType", "secondary");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-secondary");

      expect(buttonElement.classList).not.toContain("btn-success");
      fixture.componentRef.setInput("inmType", "success");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-success");

      expect(buttonElement.classList).not.toContain("btn-danger");
      fixture.componentRef.setInput("inmType", "danger");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-danger");

      expect(buttonElement.classList).not.toContain("btn-warning");
      fixture.componentRef.setInput("inmType", "warning");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-warning");

      expect(buttonElement.classList).not.toContain("btn-info");
      fixture.componentRef.setInput("inmType", "info");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-info");

      expect(buttonElement.classList).not.toContain("btn-light");
      fixture.componentRef.setInput("inmType", "light");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-light");

      expect(buttonElement.classList).not.toContain("btn-dark");
      fixture.componentRef.setInput("inmType", "dark");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-dark");

      expect(buttonElement.classList).not.toContain("btn-link");
      fixture.componentRef.setInput("inmType", "link");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-link");

      expect(buttonElement.classList).not.toContain("btn-outline-primary");
      fixture.componentRef.setInput("inmType", "outline-primary");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-outline-primary");

      expect(buttonElement.classList).not.toContain("btn-outline-secondary");
      fixture.componentRef.setInput("inmType", "outline-secondary");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-outline-secondary");

      expect(buttonElement.classList).not.toContain("btn-outline-success");
      fixture.componentRef.setInput("inmType", "outline-success");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-outline-success");

      expect(buttonElement.classList).not.toContain("btn-outline-danger");
      fixture.componentRef.setInput("inmType", "outline-danger");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-outline-danger");

      expect(buttonElement.classList).not.toContain("btn-outline-warning");
      fixture.componentRef.setInput("inmType", "outline-warning");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-outline-warning");

      expect(buttonElement.classList).not.toContain("btn-outline-info");
      fixture.componentRef.setInput("inmType", "outline-info");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-outline-info");

      expect(buttonElement.classList).not.toContain("btn-loutline-ight");
      fixture.componentRef.setInput("inmType", "outline-light");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-outline-light");

      expect(buttonElement.classList).not.toContain("btn-outline-dark");
      fixture.componentRef.setInput("inmType", "outline-dark");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-outline-dark");
    });

    it("should apply classname based on inmSize", () => {
      expect(buttonElement.classList).not.toContain("btn-sm");
      fixture.componentRef.setInput("inmSize", "sm");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-sm");

      expect(buttonElement.classList).not.toContain("btn-lg");
      fixture.componentRef.setInput("inmSize", "lg");
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-lg");
    });

    it("should apply classname based on inmBlock", () => {
      expect(buttonElement.classList).not.toContain("btn-block");
      fixture.componentRef.setInput("inBlock", true);
      fixture.detectChanges();
      expect(buttonElement.classList).toContain("btn-block");
    });
  });

  it("should update tabindex", () => {
    expect(buttonElement.tabIndex).toEqual(0);
    fixture.componentRef.setInput("tabIndex", 2);
    fixture.detectChanges();
    expect(buttonElement.tabIndex).toEqual(2);
    fixture.componentRef.setInput("tabIndex", null);
    fixture.detectChanges();
    expect(buttonElement.tabIndex).toEqual(0);
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();
    expect(buttonElement.tabIndex).toEqual(-1);
  });

  it("should update disabled state", () => {
    expect(buttonElement.disabled).toEqual(false);
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();
    expect(buttonElement.disabled).toEqual(true);
  });
});
