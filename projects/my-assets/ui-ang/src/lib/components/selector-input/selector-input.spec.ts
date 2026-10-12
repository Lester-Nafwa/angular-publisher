import { ComponentFixture, TestBed } from "@angular/core/testing";

import { beforeEach, describe, expect, it, vi } from "vitest";

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

    fixture.componentRef.setInput("options", [
      "Owner",
      {
        value: "admin",
        label: "Admin",
        iconUrl: "/assets/admin.svg",
      },
    ]);
    fixture.componentRef.setInput("initialOption", "Owner");
    fixture.detectChanges();

    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should use default placeholder and menu title", () => {
    expect(component.placeholder()).toBe("Filter by");
    expect(component.menuTitle()).toBe("Filter Requests");
  });

  it("should use initial option before form writes value", () => {
    expect(component.selectedValue()).toBe("Owner");
    expect(component.selectedOption()?.label).toBe("Owner");
  });

  it("should support ControlValueAccessor writeValue", () => {
    component.writeValue("admin");

    expect(component.selectedValue()).toBe("admin");
    expect(component.selectedOption()?.label).toBe("Admin");
  });

  it("should emit and notify CVA callbacks on select", () => {
    const emitSpy = vi.spyOn(component.filterSelected, "emit");
    const onChange = vi.fn();
    const onTouched = vi.fn();

    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);
    component.onSelect({ value: "admin", label: "Admin" });

    expect(emitSpy).toHaveBeenCalledWith("admin");
    expect(onChange).toHaveBeenCalledWith("admin");
    expect(onTouched).toHaveBeenCalledOnce();
  });

  it("should apply disabled state via CVA", () => {
    component.setDisabledState(true);

    expect(component.isDisabled()).toBe(true);
  });
});
