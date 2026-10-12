/* eslint-disable @angular-eslint/component-selector */
import { Component, input } from "@angular/core";

export type InmButtonSize = "sm" | "lg" | null;
export type InmButtonType =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "unstyled"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-danger"
  | "outline-warning"
  | "outline-info"
  | "outline-light"
  | "outline-dark"
  | "link"
  | "list-item"
  | null;

@Component({
  selector: "button[inm-button], a[inm-button], input[inm-button]",
  exportAs: "inmButton",
  standalone: true,
  template: `
    @if (inmLoading()) {
      <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
      <span class="visually-hidden">Loading...</span>
    }
    <ng-content></ng-content>
  `,
  host: {
    class: "",
    "[class.btn]": `inmType() !== 'list-item'`,
    "[class.inline-flex]": `inmType() !== 'list-item'`,
    "[class.align-items-center]": `inmType() !== 'list-item'`,
    "[class.gap-2]": `inmType() !== 'list-item'`,
    "[class.btn-lg]": `inmSize() === 'lg'`,
    "[class.btn-sm]": `inmSize() === 'sm'`,
    "[class.btn-primary]": `inmType() === 'primary'`,
    "[class.btn-secondary]": `inmType() === 'secondary'`,
    "[class.btn-success]": `inmType() === 'success'`,
    "[class.btn-danger]": `inmType() === 'danger'`,
    "[class.btn-warning]": `inmType() === 'warning'`,
    "[class.btn-info]": `inmType() === 'info'`,
    "[class.btn-light]": `inmType() === 'light'`,
    "[class.btn-dark]": `inmType() === 'dark'`,
    "[class.btn-link]": `inmType() === 'link'`,
    "[class.btn-unstyled]": `inmType() === 'unstyled'`,
    "[class.btn-outline-primary]": `inmType() === 'outline-primary'`,
    "[class.btn-outline-secondary]": `inmType() === 'outline-secondary'`,
    "[class.btn-outline-success]": `inmType() === 'outline-success'`,
    "[class.btn-outline-danger]": `inmType() === 'outline-danger'`,
    "[class.btn-outline-warning]": `inmType() === 'outline-warning'`,
    "[class.btn-outline-info]": `inmType() === 'outline-info'`,
    "[class.btn-outline-light]": `inmType() === 'outline-light'`,
    "[class.btn-outline-dark]": `inmType() === 'outline-dark'`,
    "[class.list-group-item]": `inmType() === 'list-item'`,
    "[class.list-group-item-action]": `inmType() === 'list-item'`,
    "[class.btn-block]": `inmBlock()`,
    "[class.justify-content-center]": `inmCentered()`,
    "[class.px-3]": `!inmCentered()`,
    "[attr.tabindex]": `disabled() ? -1 : (tabIndex() === null ? null : tabIndex())`,
    "[attr.disabled]": `disabled() || inmLoading() || null`,
  },
})
export class Button {
  inmCentered = input<boolean>(true);
  inmLoading = input<boolean>(false);
  inmBlock = input<boolean>(false);
  inmSize = input<InmButtonSize>(null);
  inmType = input<InmButtonType>(null);

  disabled = input<boolean>(false);
  tabIndex = input<number | string | null>(null);
}
