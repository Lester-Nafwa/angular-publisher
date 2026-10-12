import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import {
  ProgressBar,
  ProgressBarGradientStop,
} from "../progress-bar/progress-bar";

export interface AdoptionProgressItem {
  readonly id: string;
  readonly label: string;
  readonly adopted: number;
  readonly total: number;
  readonly iconUrl: string;
}
interface AdoptionProgressRow extends AdoptionProgressItem {
  readonly percent: number;
  readonly ariaLabel: string;
}

@Component({
  selector: "inm-adoption-progress-chart",
  standalone: true,
  imports: [ProgressBar],
  templateUrl: "./adoption-progress-chart.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "block h-full min-h-0",
  },
})
export class AdoptionProgressChart {
  readonly title = input.required<string>();
  readonly items = input.required<readonly AdoptionProgressItem[]>();
  readonly barGradient = input.required<readonly ProgressBarGradientStop[]>();
  readonly listAriaLabel = input("Adoption by item");

  readonly rows = computed<readonly AdoptionProgressRow[]>(() =>
    this.items().map((item) => {
      const percent =
        item.total <= 0
          ? 0
          : Math.min(100, Math.max(0, (item.adopted / item.total) * 100));

      return {
        ...item,
        percent,
        ariaLabel: `${item.label}: ${item.adopted} of ${item.total} adopted`,
      };
    }),
  );
}
