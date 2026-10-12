import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "inm-icon-play",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      [attr.width]="size()"
      [attr.height]="size()"
    >
      <path
        d="M10.7043 4.67629C11.7652 5.25324 11.7652 6.74677 10.7043 7.32371L4.29831 10.8073C3.26718 11.368 2 10.6382 2 9.48355L2 2.51645C2 1.36184 3.26718 0.632011 4.29831 1.19274L10.7043 4.67629Z"
        fill="currentColor"
      />
    </svg>
  `,
})
export class InmIconPlay {
  readonly size = input<number>(18);
}
