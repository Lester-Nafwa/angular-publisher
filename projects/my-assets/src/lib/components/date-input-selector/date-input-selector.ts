import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, output, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";

export interface DateRangeSelection {
  start: Date | null;
  end: Date | null;
}


@Component({
  selector: "inm-date-input-selector",
  imports: [DatePipe, MatMenuModule, MatIconModule, MatCardModule, MatDatepickerModule,MatNativeDateModule],
  templateUrl: "./date-input-selector.html",
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class DateInputSelector {
  selectedStartDate = signal<Date | null>(null);
  selectedEndDate = signal<Date | null>(null);

  dateRangeSelected = output<DateRangeSelection>();

  onStartDateChange(date: Date | null) {
    this.selectedStartDate.set(date);
    this.emitIfComplete();
  }

  onEndDateChange(date: Date | null) {
    this.selectedEndDate.set(date);
    this.emitIfComplete();
  }

  private emitIfComplete() {
    const start = this.selectedStartDate();
    const end = this.selectedEndDate();
    if (start && end) {
      this.dateRangeSelected.emit({ start, end });
    }
  }
}