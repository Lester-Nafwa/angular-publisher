import { Component, inject } from "@angular/core";

import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material/snack-bar";

import {
  IconClose,
  IconDanger,
  IconInfo,
  IconSuccessFill,
  IconWarning,
} from "../../../icons";
import { InmSnackBarTypes } from "../snack-bar.enums";
import { InmSnackBarOptionsData } from "../snack-bar.models";

const customIcons = [
  IconClose,
  IconInfo,
  IconWarning,
  IconDanger,
  IconSuccessFill,
];

@Component({
  selector: "inm-default-snack-bar",
  standalone: true,
  imports: [...customIcons],
  template: `
    <div
      class="alert"
      [class.alert-primary]="data?.type === inmSnackBarTypes.primary"
      [class.alert-dark]="data?.type === inmSnackBarTypes.dark"
      [class.alert-success]="data?.type === inmSnackBarTypes.success"
      [class.alert-danger]="data?.type === inmSnackBarTypes.danger"
      [class.alert-warning]="data?.type === inmSnackBarTypes.warning"
    >
      <div class="flex">
        <div class="shrink-0">
          @if (data?.type; as snackBarType) {
            @let iconSize = 24;
            @switch (snackBarType) {
              @case (inmSnackBarTypes.info) {
                <inm-icon-info [size]="iconSize"></inm-icon-info>
              }
              @case (inmSnackBarTypes.success) {
                <inm-icon-success-fill
                  [size]="iconSize"
                ></inm-icon-success-fill>
              }
              @case (inmSnackBarTypes.warning) {
                <inm-icon-warning [size]="iconSize"></inm-icon-warning>
              }
              @case (inmSnackBarTypes.danger) {
                <inm-icon-danger [size]="iconSize"></inm-icon-danger>
              }
              @default {
                <inm-icon-info [size]="iconSize"></inm-icon-info>
              }
            }
          }
        </div>
        <div class="ms-3">
          @if (data?.title; as title) {
            <h3 id="hs-actions-label" class="font-semibold">
              {{ title }}
            </h3>
          }
          @if (data?.message; as message) {
            <div class="mt-2 text-sm text-muted-foreground-2">
              {{ message }}
            </div>
          }
        </div>
        <div class="ps-3 ms-auto">
          <div class="-mx-1.5 -my-1.5">
            <button
              type="button"
              class="alert-close-btn"
              data-testid="submit-btn"
              (click)="onDismissModal()"
            >
              <span class="sr-only">Dismiss</span>
              <inm-icon-close [size]="20"></inm-icon-close>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DefaultSnackBar {
  readonly data = inject<InmSnackBarOptionsData>(MAT_SNACK_BAR_DATA, {
    optional: true,
  });
  private _snackBarRef =
    inject<MatSnackBarRef<DefaultSnackBar>>(MatSnackBarRef);

  inmSnackBarTypes = InmSnackBarTypes;

  onDismissModal() {
    this._snackBarRef.dismiss();
  }
}