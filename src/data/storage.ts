const trainings: Training[] = [
  {
    code: "T0001",
    name: "Example",
  },
];

export interface User {
  id?: string | number;
  name: string;
  email: string;
}

export interface Training {
  code: string;
  name: string;
}

export interface CsvRow {
  row: number;
  email: string;
  trainingCode: string;
  dateCertified: string;
}

const KEYS = {
  users: "learnspace-users",
  trainings: "learnspace-trainings",
  preview: "learnspace-preview",
} as const;

export function saveRow(row: CsvRow): void {
  // Get the existing data or an empty array
  const savedRows = localStorage.getItem(KEYS.preview) || "[]";

  // Parse it back into a JavaScript array
  const currentRows: CsvRow[] = JSON.parse(savedRows);

  // Push your new row onto the array
  currentRows.push(row);

  // Save the expanded array back to localStorage
  localStorage.setItem(KEYS.preview, JSON.stringify(currentRows));
}

export function getUsers(): User[] {
  const savedUsers = localStorage.getItem(KEYS.users) || "[]";
  return JSON.parse(savedUsers);
}

export function saveUser(newUser: User): void {
  const currentUsers = getUsers();
  currentUsers.push(newUser);
  localStorage.setItem(KEYS.users, JSON.stringify(currentUsers));
}

export function getTrainings(): Training[] {
  return trainings;
}

export function getRows(): CsvRow[] {
  const savedRows = localStorage.getItem(KEYS.preview) || "[]";
  return JSON.parse(savedRows);
}

export function deleteRow(deleteBtn: HTMLElement): void {
  const tr = deleteBtn.closest("tr");
  if (!tr) return;

  // The parent of a <tr> is typically <tbody>
  const tbody = tr.parentNode;
  if (!tbody) return;

  if (!confirm("Delete this row?")) return;

  const index = Array.from(tbody.children).indexOf(tr);
  if (index === -1) return;

  const rows = getRows();
  rows.splice(index, 1);
  localStorage.setItem(KEYS.preview, JSON.stringify(rows));
}

export function clearPreview(): void {
  if (!confirm("Are you sure you want to clear all preview data?")) return;
  localStorage.removeItem(KEYS.preview);
}
