import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "inm-icon-check-mark",
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.8699 5.20127C14.104 5.40558 14.1281 5.76091 13.9237 5.99494L8.03089 12.7449C7.92407 12.8673 7.76958 12.9375 7.60715 12.9375C7.44473 12.9375 7.29023 12.8673 7.18341 12.7449L4.82627 10.0449C4.62196 9.81091 4.64605 9.45557 4.88008 9.25127C5.1141 9.04696 5.46944 9.07105 5.67375 9.30508L7.60715 11.5197L13.0763 5.25508C13.2806 5.02105 13.6359 4.99696 13.8699 5.20127Z"
        fill="currentColor"
        stroke-width="0"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class InmIconCheckMark {
  width = input<number>(24);
  height = input<number>(24);
}
