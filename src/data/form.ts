import * as storage from "./storage.ts";
import type { CsvRow } from "./storage.ts";

export function preview(form: HTMLFormElement): void {
  const formData = new FormData(form);

  let row: number = 0;
  const email = String(formData.get("email") ?? "");
  const trainingCode = String(formData.get("training") ?? "");
  const dateCertified = String(formData.get("completion-date") ?? "");

  const newRow: CsvRow = { row, email, trainingCode, dateCertified };

  storage.saveRow(newRow);

  row++;
}
