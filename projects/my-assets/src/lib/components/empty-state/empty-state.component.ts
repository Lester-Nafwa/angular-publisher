import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "inm-empty-state",
  templateUrl: "./empty.state.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  message = input<string>("No data available");
}
