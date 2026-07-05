const users: User[] = [
  {
    id: 1,
    name: "Rafael Ferreira",
    email: "rafael@example.com",
  },
];

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
  return users;
}

export function getTrainings(): Training[] {
  return trainings;
}
