import { TestBed } from "@angular/core/testing";

import { MatSnackBar } from "@angular/material/snack-bar";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { DefaultSnackBar } from "./default-snack-bar/default-snack-bar";
import { InmSnackBarOptionsData, InmSnackBarTypes } from "./index";
import { SnackBar } from "./snack-bar";

describe("SnackBar", () => {
  let service: SnackBar;
  let matSnackBar: { openFromComponent: ReturnType<typeof vi.fn> };
  let mockSnackBarRef: {
    dismiss: ReturnType<typeof vi.fn>;
    afterDismissed: ReturnType<typeof vi.fn>;
    afterOpened: ReturnType<typeof vi.fn>;
    onAction: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockSnackBarRef = {
      dismiss: vi.fn(),
      afterDismissed: vi.fn(),
      afterOpened: vi.fn(),
      onAction: vi.fn(),
    };

    matSnackBar = {
      openFromComponent: vi.fn().mockReturnValue(mockSnackBarRef),
    };

    TestBed.configureTestingModule({
      providers: [SnackBar, { provide: MatSnackBar, useValue: matSnackBar }],
    });

    service = TestBed.inject(SnackBar);
    matSnackBar = TestBed.inject(MatSnackBar) as unknown as {
      openFromComponent: ReturnType<typeof vi.fn>;
    };
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call MatSnackBar.openFromComponent with DefaultSnackBar component", () => {
    const data: InmSnackBarOptionsData = {
      title: "Test Title",
      message: "Test Message",
      type: InmSnackBarTypes.primary,
    };

    service.openDefault(data);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(DefaultSnackBar, expect.any(Object));
  });

  it("should pass correct configuration options", () => {
    const data: InmSnackBarOptionsData = {
      title: "Test Title",
      message: "Test Message",
      type: InmSnackBarTypes.primary,
    };

    service.openDefault(data);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(DefaultSnackBar, {
      politeness: "assertive",
      duration: 5000,
      verticalPosition: "top",
      horizontalPosition: "right",
      data,
    });
  });

  it("should pass data to the snack bar", () => {
    const data: InmSnackBarOptionsData = {
      title: "Success",
      message: "Operation completed successfully",
      type: InmSnackBarTypes.primary,
      caption: "Info",
    };

    service.openDefault(data);

    const callArgs = matSnackBar.openFromComponent.mock.calls[0];
    expect(callArgs[1]?.data).toEqual(data);
  });

  it("should return MatSnackBarRef", () => {
    const data: InmSnackBarOptionsData = {
      title: "Test",
      message: "Test message",
      type: InmSnackBarTypes.primary,
    };

    const result = service.openDefault(data);

    expect(result).toBe(mockSnackBarRef);
  });

  it("should work with minimal data", () => {
    const data: InmSnackBarOptionsData = {
      title: "Simple Title",
      type: InmSnackBarTypes.primary,
    };

    service.openDefault(data);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      DefaultSnackBar,
      expect.objectContaining({ data }),
    );
  });

  it("should work with different snack bar types", () => {
    const types = Object.values(InmSnackBarTypes);

    types.forEach((type) => {
      const data: InmSnackBarOptionsData = {
        title: `${type} Title`,
        message: `${type} Message`,
        type,
      };

      service.openDefault(data);

      expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
        DefaultSnackBar,
        expect.objectContaining({
          data: expect.objectContaining({ type }),
        }),
      );
    });
  });

  it("should set verticalPosition to top", () => {
    const data: InmSnackBarOptionsData = {
      title: "Test",
      message: "Test",
      type: InmSnackBarTypes.primary,
    };

    service.openDefault(data);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      DefaultSnackBar,
      expect.objectContaining({ verticalPosition: "top" }),
    );
  });

  it("should set horizontalPosition to right", () => {
    const data: InmSnackBarOptionsData = {
      title: "Test",
      message: "Test",
      type: InmSnackBarTypes.primary,
    };

    service.openDefault(data);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      DefaultSnackBar,
      expect.objectContaining({ horizontalPosition: "right" }),
    );
  });

  it("should set duration to 5000", () => {
    const data: InmSnackBarOptionsData = {
      title: "Test",
      message: "Test",
      type: InmSnackBarTypes.primary,
    };

    service.openDefault(data);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      DefaultSnackBar,
      expect.objectContaining({ duration: 5000 }),
    );
  });

  it("should set politeness to assertive", () => {
    const data: InmSnackBarOptionsData = {
      title: "Test",
      message: "Test",
      type: InmSnackBarTypes.primary,
    };

    service.openDefault(data);

    expect(matSnackBar.openFromComponent).toHaveBeenCalledWith(
      DefaultSnackBar,
      expect.objectContaining({ politeness: "assertive" }),
    );
  });
});
