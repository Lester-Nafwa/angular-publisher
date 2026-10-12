import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";

import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

import { IconSortComponent } from "../../icons";

export interface DropdownOption {
  value: string;
  label: string;
  iconUrl?: string;
}

@Component({
  selector: "inm-dropdown",
  imports: [MatSelectModule, MatIconModule, IconSortComponent],
  templateUrl: "./dropdown.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  readonly options = input.required<DropdownOption[]>();
  readonly selectedOption = input<string | null>(null);
  readonly placeholder = input("Select option");
  readonly prefix = input<string>("");
  readonly leftIcon = input<string | null>(null);
  readonly filterIcon = input<boolean | null>(null);
  readonly disabled = input(false);

  private readonly _selectedValue = signal<string | null>(null);

  readonly selectedValue = computed(
    () => this._selectedValue() ?? this.selectedOption(),
  );

  readonly selectedOptionDetails = computed(() =>
    this.options().find((option) => option.value === this.selectedValue()),
  );

  readonly valueChange = output<string>();

  onSelectionChange(value: string): void {
    this._selectedValue.set(value);
    this.valueChange.emit(value);
  }
}
