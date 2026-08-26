import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "inm-icon-close-round",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      [attr.width]="width()"
      [attr.height]="height()"
    >
      <path
        d="M16.9166 11.083L11.0833 16.9163M11.0832 11.083L16.9165 16.9163"
        stroke="currentColor"
        stroke-linecap="round"
      />
      <path
        d="M8.16671 3.8938C9.88272 2.90114 11.875 2.33301 14 2.33301C20.4434 2.33301 25.6667 7.55635 25.6667 13.9997C25.6667 20.443 20.4434 25.6663 14 25.6663C7.55672 25.6663 2.33337 20.443 2.33337 13.9997C2.33337 11.8747 2.90151 9.88235 3.89417 8.16634"
        stroke="currentColor"
        stroke-linecap="round"
      />
    </svg>
  `,
})
export class InmIconCloseRound {
  width = input<number>(28);
  height = input<number>(28);
}
