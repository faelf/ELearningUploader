import type { User } from "./data/storage.ts";
import type { Training } from "./data/storage.ts";
import type { SearchableSelectInstance } from "./utilities/searchable-select.ts";
import * as theme from "./utilities/theme.ts";
import { createSearchableSelect } from "./utilities/searchable-select.ts";
import * as table from "./utilities/table.ts";
import * as storage from "./data/storage.ts";
import * as forms from "./data/form.ts";
import { downloadCsv } from "./data/csv.ts";

let usersSelect: SearchableSelectInstance<User> | undefined = undefined;
let trainingsSelect: SearchableSelectInstance<Training> | undefined = undefined;

function renderTable() {
  table.load({
    container: "#table-container",
    columns: {
      email: "User",
      trainingCode: "Training Code",
      dateCertified: "Completion Date",
    },
    data: storage.getRows(),
  });
}

function init(): void {
  theme.init();
  trainingsSelect = createSearchableSelect({
    container: "#input-trainings",
    data: storage.getTrainings(),
    displayKey: "name",
    valueKey: "code",
  });

  usersSelect = createSearchableSelect({
    container: "#input-users",
    data: storage.getUsers(),
    displayKey: "name",
    valueKey: "email",
  });
  renderTable();
}

document.addEventListener("click", (event: MouseEvent): void => {
  if (!(event.target instanceof Element)) return;

  const action = event.target.closest<HTMLElement>("[data-action]");
  if (!action) return;

  switch (action.dataset.action) {
    case "theme":
      theme.click();
      break;
    case "delete-row":
      storage.deleteRow(action);
      renderTable();
      break;
    case "clear-data":
      storage.clearPreview();
      renderTable();
      break;
    case "download-csv":
      downloadCsv({
        columns: {
          email: "username",
          trainingCode: "certification1",
          dateCertified: "certificationcertifytimecertified1",
        },
        data: storage.getRows(),
      });
      break;
  }
});

document.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const form = event.target as HTMLFormElement | null;
  if (!form) return;

  switch (form.id) {
    case "preview-form":
      forms.preview(form);
      renderTable();
      break;
    case "upload-user":
      forms.uploadUser(form);
      usersSelect?.updateData(storage.getUsers());
      break;
    case "upload-users":
      forms.uploadusers(form);
      usersSelect?.updateData(storage.getUsers());
      break;
    case "upload-users":
      await forms.uploadusers(form);
      usersSelect?.updateData(storage.getUsers());
      break;
    case "upload-training":
      forms.uploadTraining(form);
      trainingsSelect?.updateData(storage.getTrainings());
      break;
    case "upload-trainings":
      forms.uploadTrainings(form);
      trainingsSelect?.updateData(storage.getTrainings());
      break;
  }
});

document.addEventListener("DOMContentLoaded", init);
