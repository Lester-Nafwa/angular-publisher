import { Component, input } from "@angular/core";

@Component({
  selector: "inm-icon-key",
  standalone: true,
  template: `
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size()"
      [attr.height]="size()"
    >
      <path
        d="M10.5318 6.25C10.8296 5.7352 11 5.1375 11 4.5C11 2.567 9.433 1 7.5 1C5.567 1 4 2.567 4 4.5C4 6.433 5.567 8 7.5 8C8.0368 8 8.54537 7.87915 9 7.66318"
        stroke="currentColor"
        stroke-linecap="round"
      />
      <circle cx="7.5" cy="4.5" r="1" stroke="currentColor" />
      <path
        d="M1.75 10.25L4.75 7.25"
        stroke="currentColor"
        stroke-linecap="round"
      />
      <path
        d="M3 10.5L2.25 9.75M3.25 8.75L4 9.5"
        stroke="currentColor"
        stroke-linecap="round"
      />
    </svg>
  `,
})
export class IconKey {
  size = input<number>(24);
}
