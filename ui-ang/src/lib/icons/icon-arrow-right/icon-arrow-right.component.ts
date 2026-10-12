import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "inm-icon-arrow-right",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      [attr.width]="width()"
      [attr.height]="height()"
    >
      <path
        d="M0.75 6.75H3.25M16.75 6.75L10.75 0.75M16.75 6.75L10.75 12.75M16.75 6.75H6.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class InmIconArrowRight {
  width = input<number>(18);
  height = input<number>(14);
}
