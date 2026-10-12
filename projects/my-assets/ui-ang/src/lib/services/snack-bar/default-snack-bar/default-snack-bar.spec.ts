import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material/snack-bar";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { InmSnackBarTypes } from "../snack-bar.enums";
import { InmSnackBarOptionsData } from "../snack-bar.models";
import { DefaultSnackBar } from "./default-snack-bar";

describe("DefaultSnackBar", () => {
  let component: DefaultSnackBar;
  let fixture: ComponentFixture<DefaultSnackBar>;
  let mockSnackBarRef: { dismiss: ReturnType<typeof vi.fn> };

  const defaultData: InmSnackBarOptionsData = {
    title: "Test Title",
    message: "Test Message",
    type: InmSnackBarTypes.primary,
  };

  beforeEach(async () => {
    mockSnackBarRef = {
      dismiss: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DefaultSnackBar],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: defaultData },
        { provide: MatSnackBarRef, useValue: mockSnackBarRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultSnackBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // it("should display the title", () => {
  //   const compiled = fixture.nativeElement;
  //   const titleElement = compiled.querySelector("strong");
  //   expect(titleElement).toBeDefined();
  //   expect(titleElement.textContent).toContain("Test Title");
  // });

  // it("should display the message", () => {
  //   const compiled = fixture.nativeElement;
  //   const messageElement = compiled.querySelector(".toast-body");
  //   expect(messageElement).toBeDefined();
  //   expect(messageElement.textContent.trim()).toBe("Test Message");
  // });

  it("should call dismiss when close button is clicked", () => {
    const closeButton = fixture.nativeElement.querySelector(
      '[data-testid="submit-btn"]',
    );

    closeButton?.click();

    expect(mockSnackBarRef.dismiss).toHaveBeenCalled();
  });

  it("should not display message body when message is not provided", async () => {
    const dataWithoutMessage: InmSnackBarOptionsData = {
      title: "Only Title",
      type: InmSnackBarTypes.info,
    };

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [DefaultSnackBar],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: dataWithoutMessage },
        { provide: MatSnackBarRef, useValue: mockSnackBarRef },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(DefaultSnackBar);
    newFixture.detectChanges();

    const messageElement =
      newFixture.nativeElement.querySelector(".toast-body");

    expect(messageElement).toBeNull();
  });
});