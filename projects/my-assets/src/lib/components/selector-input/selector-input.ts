import { ChangeDetectionStrategy, Component, input, output, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
 
@Component({
  selector: "inm-selector-input",
  imports: [MatMenuModule, MatIconModule],
  templateUrl: "./selector-input.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorInput {

  options = input.required<string[]>()

  selectedOption = signal<string>("");

  filterSelected = output<string>();

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.filterSelected.emit(option);
  }
}
