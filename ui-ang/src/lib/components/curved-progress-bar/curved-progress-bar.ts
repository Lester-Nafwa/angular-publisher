import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

@Component({
  selector: "inm-curved-progress-bar",
  imports: [],
  templateUrl: "./curved-progress-bar.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurvedProgressBar {
  readonly value = input.required<number>();
  readonly label = input("% Percentage Utilized");

  protected readonly clamped = computed(() => {
    const v = Number(this.value());
    return Number.isFinite(v) ? Math.round(Math.min(100, Math.max(0, v))) : 0;
  });

  protected readonly dashOffset = computed(() => 100 - this.clamped());

  protected readonly strokeClass = computed(() => {
    const v = this.clamped();
    const color =
      v >= 90
        ? "stroke-red-500"
        : v >= 70
          ? "stroke-amber-400"
          : "stroke-green-500";
    return `${color} transition-all duration-700`;
  });
}
