import { inject, Injectable, TemplateRef } from "@angular/core";
import { Dialog, DialogConfig, DialogRef } from "@angular/cdk/dialog";
import { ComponentType } from "@angular/cdk/portal";

/**
 * UI service that offers a quick way of opening an angular CDK modal with minimal default configurations
 *
 *  Sample Service Usage
 *
 *  ```typescript
 *   private _dialogService = inject(ModalDialog);
 *
 *   openLargeDialog() {
 *     this._dialogService.open(ExampleDialogComponent, {
 *       width: `900px`,
 *       data: {
 *         title: 'Large Dialog',
 *         message: 'This is a large dialog.',
 *       },
 *     });
 *   }
 *   ```
 *
 *   Sample Dialog component
 *
 *   ```typescript
 *   @Component({
 *   selector: 'app-example-dialog',
 *   standalone: true,
 *   imports: [Button, IconClose],
 *   template: `
 *     <div class="dialog-container">
 *       <div class="dialog-header">
 *         <h2 class="m-0">{{ data.title }}</h2>
 *         <button inm-button inmType="unstyled" aria-label="Close dialog" (click)="dialogRef.close()">
 *           <inm-icon-close [size]="28"></inm-icon-close>
 *         </button>
 *       </div>
 *       <div class="dialog-body">
 *         <p>{{ data.message }}</p>
 *       </div>
 *       <div class="dialog-footer">
 *         <div class="d-flex gap-3">
 *           <button inm-button inmType="outline-primary" (click)="dialogRef.close()">Cancel</button>
 *           <button inm-button inmType="primary" (click)="dialogRef.close('Confirmed!')">
 *             Confirm
 *           </button>
 *         </div>
 *       </div>
 *     </div>
 *   `,
 * })
 * export class ExampleDialogComponent {
 *   dialogRef = inject(DialogRef);
 *   data = inject<DialogData>(DIALOG_DATA);
 * }
 *   ```
 *
 */
@Injectable({
  providedIn: "root",
})
export class ModalDialog {
  private _dialog = inject(Dialog);

  open<T, D = unknown, R = unknown>(
    component: ComponentType<T> | TemplateRef<T>,
    config?: DialogConfig<D, DialogRef<R, T>>,
  ): DialogRef<R, T> {
    return this._dialog.open(component, {
      width: "500px",
      panelClass: ["modal-dialog"],
      backdropClass: "",
      ...config,
    });
  }
}
