import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from "@angular/core";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "inm-year-input-selector",
  imports: [
    MatDatepickerModule,
    MatIconModule,
    MatMenuModule,
    MatNativeDateModule,
  ],
  templateUrl: "./year-input-selector.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearInputSelector {
  selectedDate = signal<Date | null>(null);
  selectedYear = signal<number | null>(null);

  yearSelected = output<number>();

  onYearSelected(date: Date) {
    const year = date.getFullYear();
    this.selectedDate.set(date);
    this.selectedYear.set(year);
    this.yearSelected.emit(year);
  }
}
