import { InmSnackBarTypes } from "./snack-bar.enums";

export interface InmSnackBarOptionsData {
  title: string;
  type: InmSnackBarTypes;
  message?: string;
  caption?: string;
}
