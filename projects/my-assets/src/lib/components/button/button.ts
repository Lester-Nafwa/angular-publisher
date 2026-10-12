/* eslint-disable @angular-eslint/component-selector */
import { Component, input } from "@angular/core";

export type InmButtonSize = "sm" | "lg" | null;
export type InmButtonVariant = "solid" | "subtle" | "outline"|"text" |null;
export type InmButtonType =
  | "btn-primary"
  | "btn-secondary"
  | "btn-success"
  | "btn-danger"
  | "btn-warning"
  | "btn-info"
  | "btn-light"
  | "btn-dark"
  | "btn-unstyled"
  | "theme-primary"
  | "theme-secondary"
  | "theme-success"
  | "theme-danger"
  | "theme-warning"
  | "theme-info"
  | "btn-light"
  | "btn-dark"
  | "theme-dark"
  | "btn-link"
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
    "[class.btn-primary]": `inmType() === 'btn-primary'`,
    "[class.btn-secondary]": `inmType() === 'btn-secondary'`,
    "[class.btn-success]": `inmType() === 'btn-success'`,
    "[class.btn-danger]": `inmType() === 'btn-danger'`,
    "[class.btn-warning]": `inmType() === 'btn-warning'`,
    "[class.btn-info]": `inmType() === 'btn-info'`,
    "[class.btn-light]": `inmType() === 'btn-light'`,
    "[class.btn-dark]": `inmType() === 'btn-dark'`,
    "[class.btn-link]": `inmType() === 'btn-link'`,
    "[class.btn-solid]": `inmVariant() === 'solid'`,
    "[class.btn-subtle]": `inmVariant() === 'subtle'`,
    "[class.btn-outline]": `inmVariant() === 'outline'`,
    "[class.btn-text]": `inmVariant() === 'text'`,
    "[class.btn-unstyled]": `inmType() === 'btn-unstyled'`,
    "[class.theme-primary]": `inmType() === 'theme-primary'`,
    "[class.theme-secondary]": `inmType() === 'theme-secondary'`,
    "[class.theme-success]": `inmType() === 'theme-success'`,
    "[class.theme-danger]": `inmType() === 'theme-danger'`,
    "[class.theme-warning]": `inmType() === 'theme-warning'`,
    "[class.theme-info]": `inmType() === 'theme-info'`,
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
  inmVariant = input<InmButtonVariant>(null); 
  disabled = input<boolean>(false);
  tabIndex = input<number | string | null>(null);
}
