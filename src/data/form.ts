import * as storage from "./storage.ts";
import { readUsersFromCsv, readTrainingsFromCsv } from "./csv.ts";
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

  const dialog = form.closest<HTMLDialogElement>("dialog");
  if (dialog) {
    dialog.close();
  }

  window.alert("User uploaded!");
}

export async function uploadusers(form: HTMLFormElement): Promise<void> {
  const fileInput = form.querySelector<HTMLInputElement>('input[name="file"]');
  const file = fileInput?.files?.[0];

  if (!file) {
    alert("Please choose a CSV file first.");
    return;
  }

  const newUsers = await readUsersFromCsv(file);

  storage.saveUsers(newUsers);

  form.reset();

  const dialog = form.closest<HTMLDialogElement>("dialog");
  if (dialog) {
    dialog.close();
  }

  window.alert("Users uploaded!");
}

export function uploadTraining(form: HTMLFormElement): void {
  const formData = new FormData(form);

  const code = String(formData.get("training-code") ?? "");
  const name = String(formData.get("training-name") ?? "");

  if (!name) {
    alert("Please provide a training name.");
    return;
  }

  if (!code) {
    alert("Please provide a training code.");
    return;
  }

  storage.saveTraining({ code, name });

  form.reset();

  const dialog = form.closest<HTMLDialogElement>("dialog");
  if (dialog) {
    dialog.close();
  }

  window.alert("Training uploaded!");
}

export async function uploadTrainings(form: HTMLFormElement): Promise<void> {
  const fileInput = form.querySelector<HTMLInputElement>('input[name="file"]');
  const file = fileInput?.files?.[0];

  if (!file) {
    alert("Please choose a CSV file first.");
    return;
  }

  const newTrainings = await readTrainingsFromCsv(file);

  storage.saveTrainings(newTrainings);

  form.reset();

  const dialog = form.closest<HTMLDialogElement>("dialog");
  if (dialog) {
    dialog.close();
  }

  window.alert("Trainings uploaded!");
}
