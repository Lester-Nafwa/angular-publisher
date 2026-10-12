import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MatSelectHarness } from "@angular/material/select/testing";
import { OverlayContainer } from "@angular/cdk/overlay";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";

import { beforeEach, describe, expect, it } from "vitest";

import { DropdownComponent, DropdownOption } from "./dropdown";

const MOCK_OPTIONS: DropdownOption[] = [
  { value: "laas", label: "LAAS", iconUrl: "/icons/laas.png" },
  { value: "cards", label: "Cards as a service" },
  { value: "wallet", label: "Wallet as a service" },
];

describe("DropdownComponent", () => {
  let fixture: ComponentFixture<DropdownComponent>;
  let loader: HarnessLoader;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    fixture.componentRef.setInput("options", MOCK_OPTIONS);
    fixture.componentRef.setInput("leftIcon", "store");
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should show placeholder when nothing is selected", async () => {
    const select = await loader.getHarness(MatSelectHarness);

    expect(await select.getValueText()).toBe("Select option");
    expect(fixture.componentInstance.selectedOptionDetails()).toBeUndefined();
  });

  it("should render option labels", async () => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();

    const optionElements = Array.from(
      overlayContainer.getContainerElement().querySelectorAll("mat-option"),
    );

    expect(optionElements.length).toBe(MOCK_OPTIONS.length);
    expect(optionElements.map((el) => el.textContent?.trim())).toEqual([
      "LAAS",
      "Cards as a service",
      "Wallet as a service",
    ]);
  });

  it("should emit valueChange when selecting an option", async () => {
    const emitted: string[] = [];
    fixture.componentInstance.valueChange.subscribe((value) =>
      emitted.push(value),
    );

    const select = await loader.getHarness(MatSelectHarness);
    await select.open();

    const optionElements = Array.from(
      overlayContainer.getContainerElement().querySelectorAll("mat-option"),
    );
    const cardsOption = optionElements.find((el) =>
      el.textContent?.includes("Cards as a service"),
    );
    (cardsOption as HTMLElement).click();
    fixture.detectChanges();

    expect(emitted).toEqual(["cards"]);
  });

  it("should update selected option when selection changes", () => {
    fixture.componentInstance.onSelectionChange("wallet");
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedValue()).toBe("wallet");
    expect(fixture.componentInstance.selectedOptionDetails()?.label).toBe(
      "Wallet as a service",
    );
  });

  it("should apply disabled state from input", async () => {
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();

    const select = await loader.getHarness(MatSelectHarness);
    expect(await select.isDisabled()).toBe(true);
  });

  it("should render persistent left icon even when no option is selected", () => {
    const triggerIcon =
      fixture.nativeElement.querySelector("section > mat-icon");

    expect(triggerIcon).not.toBeNull();
    expect(triggerIcon.textContent?.trim()).toBe("store");
  });

  it("should not render fallback icon for each option row", async () => {
    fixture.componentRef.setInput("options", [
      { value: "owner", label: "Owner" },
      { value: "admin", label: "Admin" },
    ]);
    fixture.componentRef.setInput("leftIcon", "filter_alt");
    fixture.detectChanges();

    const select = await loader.getHarness(MatSelectHarness);
    await select.open();

    const optionIcons = overlayContainer
      .getContainerElement()
      .querySelectorAll("mat-option mat-icon");

    expect(optionIcons.length).toBe(0);
  });
});
