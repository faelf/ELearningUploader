import * as storage from "./storage.ts";
import type { CsvRow } from "./storage.ts";

export function preview(form: HTMLFormElement): void {
  const formData = new FormData(form);

  const existingRows = storage.getRows();
  const row: number = existingRows.length + 1;
  const email = String(formData.get("email") ?? "");
  const trainingCode = String(formData.get("training") ?? "");
  const dateCertified = String(formData.get("completion-date") ?? "");

  const newRow: CsvRow = { row, email, trainingCode, dateCertified };
  storage.saveRow(newRow);
}

export function uploadUser(form: HTMLFormElement): void {
  console.log("clicked");
  const formData = new FormData(form);

  const id = String(formData.get("user-id") ?? "");
  const name = String(formData.get("full-name") ?? "");
  const email = String(formData.get("email") ?? "");

  if (!id || !name || !email) {
    alert("Please provide an ID, full name, and email.");
    return;
  }

  storage.saveUser({ id, name, email });
  form.reset();
}
