import { inject, Injectable } from "@angular/core";

import { MatSnackBar, MatSnackBarRef } from "@angular/material/snack-bar";

// App-wide modules
import { DefaultSnackBar } from "./default-snack-bar/default-snack-bar";
import { InmSnackBarOptionsData } from "./snack-bar.models";

/**
 * Service to display snack bar notifications in the application.
 * It provides a method to open a default snack bar using predefined configuration.
 *
 * Example Usage
 * ```typescript
 *   showPrimarySnackBar() {
 *     const data: InmSnackBarOptionsData = {
 *       title: 'A primary notification',
 *       message: 'Primary - Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
 *       type: InmSnackBarTypes.primary,
 *       caption: 'Caption',
 *     };
 *     this._snackBarService.openDefault(data);
 *   }
 * ```
 */
@Injectable({
  providedIn: "root",
})
export class SnackBar {
  private _snackBar = inject(MatSnackBar);

  openDefault(data: InmSnackBarOptionsData): MatSnackBarRef<DefaultSnackBar> {
    return this._snackBar.openFromComponent(DefaultSnackBar, {
      politeness: "assertive",
      duration: 5000,
      verticalPosition: "top",
      horizontalPosition: "right",
      data,
    });
  }
}
