import { Component, input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "inm-icon-power",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size()"
      [attr.height]="size()"
    >
      <path
        d="M12 2V6"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M8.5 3.70508C5.26806 5.07059 3 8.27001 3 11.9992C3 16.9697 7.02944 20.9992 12 20.9992C16.9706 20.9992 21 16.9697 21 11.9992C21 8.27001 18.7319 5.07059 15.5 3.70508"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  `,
})
export class IconPower {
  size = input<number>(24);
}
