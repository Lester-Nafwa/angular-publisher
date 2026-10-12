import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "inm-icon-sort",
  template: `<svg
    [attr.width]="width()"
    [attr.height]="height()"
    viewBox="0 -960 960 960"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"
    />
  </svg>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSortComponent {
  width = input(24);
  height = input(24);
}
