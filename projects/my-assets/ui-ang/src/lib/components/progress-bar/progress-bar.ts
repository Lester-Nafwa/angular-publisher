import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

export interface ProgressBarGradientStop {
  readonly offset: string;
  readonly color: string;
}

@Component({
  selector: "inm-progress-bar",
  standalone: true,
  imports: [NgClass],
  templateUrl: "./progress-bar.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "block w-full min-w-0",
  },
})
export class ProgressBar {
  readonly value = input.required<number>();
  readonly height = input("10px");
  readonly width = input("100%");
  readonly trackColor = input("rgba(0,0,0,0.1)");
  readonly fillGradient = input<readonly ProgressBarGradientStop[] | undefined>(
    undefined,
  );
  readonly fillColor = input<string | undefined>(undefined);
  readonly roundedClass = input("rounded-lg");
  readonly padding = input("1px");
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly clampedValue = computed(() => {
    const next = this.value();
    if (!Number.isFinite(next)) {
      return 0;
    }
    return Math.min(100, Math.max(0, next));
  });

  readonly fillBackground = computed(() => {
    const solid = this.fillColor();
    if (solid) {
      return solid;
    }

    const gradient = this.fillGradient();
    if (gradient?.length) {
      const stops = gradient
        .map((stop) => `${stop.color} ${stop.offset}`)
        .join(", ");
      return `linear-gradient(to bottom, ${stops})`;
    }

    return "currentColor";
  });
}
