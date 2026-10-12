import { ChangeDetectionStrategy, Component, input } from "@angular/core";

export interface ErrorIndicatorModel {
  title: string;
  message: string;
}

@Component({
  selector: "inm-error-indicator",
  templateUrl: "./error-indicator.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorIndicator {
  error = input<ErrorIndicatorModel | undefined>({
    title: "Error",
    message: "An unexpected error occurred. Please try again later.",
  });
}
