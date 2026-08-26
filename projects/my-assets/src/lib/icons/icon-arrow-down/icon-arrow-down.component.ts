import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "inm-icon-arrow-down",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      [attr.width]="width()"
      [attr.height]="height()"
    >
      <path
        d="M14.25 6.75L9 11.25L7.6875 10.125M3.75 6.75L5.5 8.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class InmIconArrowDown {
  width = input<number>(24);
  height = input<number>(24);
}
