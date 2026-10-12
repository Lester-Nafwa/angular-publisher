import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "inm-icon-chevron-right",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 6 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      [attr.width]="size()"
      [attr.height]="size()"
    >
      <path
        d="M0.75 0.75L5.25 6L4.125 7.3125M0.75 11.25L2.25 9.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class InmIconChevronRight {
  size = input<number>(18);
}
