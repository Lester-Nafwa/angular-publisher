import { Component, input } from "@angular/core";

@Component({
  selector: "inm-icon-warning",
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      [attr.width]="size()"
      [attr.height]="size()"
    >
      <path fill="currentColor" d="M12 5.99L19.53 19H4.47zM12 2L1 21h22z" />
      <path fill="currentColor" d="M13 16h-2v2h2zm0-6h-2v5h2z" />
    </svg>
  `,
})
export class IconWarning {
  size = input<number>(24);
}
