import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

import { IconSortComponent } from "../../icons";

export interface SelectorOption {
  value: string;
  label: string;
  iconUrl?: string;
}

@Component({
  selector: "inm-selector-input",
  imports: [MatMenuModule, MatIconModule, IconSortComponent],
  templateUrl: "./selector-input.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorInput),
      multi: true,
    },
  ],
})
export class SelectorInput implements ControlValueAccessor {
  readonly options = input.required<Array<string | SelectorOption>>();
  readonly placeholder = input<string>("Filter by");
  readonly initialOption = input<string | null>(null);
  readonly menuTitle = input<string>("Filter Requests");
  readonly leftIcon = input<string | null>();
  readonly accessibleLabel = input<string>("Select filter");

  private readonly _value = signal<string | null>(null);
  private readonly _disabled = signal(false);

  readonly normalizedOptions = computed<SelectorOption[]>(() =>
    this.options().map((option) =>
      typeof option === "string"
        ? {
            value: option,
            label: option,
          }
        : option,
    ),
  );

  readonly selectedOption = computed(() =>
    this.normalizedOptions().find(
      (option) => option.value === this.selectedValue(),
    ),
  );

  readonly selectedValue = computed(
    () => this._value() ?? this.initialOption() ?? "",
  );

  readonly isDisabled = computed(() => this._disabled());

  readonly filterSelected = output<string>();

  private _onChange: (value: string) => void = () => {
    return;
  };
  private _onTouched: () => void = () => {
    return;
  };

  writeValue(value: string | null): void {
    this._value.set(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  onSelect(option: SelectorOption): void {
    this._value.set(option.value);
    this.filterSelected.emit(option.value);
    this._onChange(option.value);
    this._onTouched();
  }

  onBlur(): void {
    this._onTouched();
  }
}
