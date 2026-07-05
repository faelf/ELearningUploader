import type { CsvRow } from "./storage.js";
import type { User } from "./storage.ts";

interface CsvConfig {
  columns: Record<keyof Omit<CsvRow, "row">, string>;
  data: CsvRow[];
  filename?: string;
}

function escapeCsvValue(value: string | number | undefined | null): string {
  const str = String(value ?? "");
  // Wrap in quotes if it contains a comma, quote, or newline
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowsToCsv(
  data: CsvRow[],
  columnMapping: CsvConfig["columns"],
): string {
  const csvHeaders = [...Object.values(columnMapping), "certificationcertify1"];
  const header = csvHeaders.join(",");

  const dataKeys = Object.keys(columnMapping) as (keyof typeof columnMapping)[];

  const lines = data.map((row) => {
    const values = dataKeys.map((key) => escapeCsvValue(row[key]));
    values.push("1");
    return values.join(",");
  });

  return [header, ...lines].join("\n");
}

export function downloadCsv({
  columns,
  data,
  filename = `${new Date().toISOString().slice(0, 10)} - Upload.csv`,
}: CsvConfig): void {
  if (!data.length) {
    alert("No data to export yet.");
    return;
  }

  const csvContent = rowsToCsv(data, columns);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseCsv(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

export function readCsvFile(file: File): Promise<string[][]> {
  return file.text().then(parseCsv);
}

export function rowsToUsers(rows: string[][]): User[] {
  const dataRows = rows[0]?.[0]?.toLowerCase().includes("id")
    ? rows.slice(1)
    : rows;

  return dataRows
    .filter((row) => row.length >= 4 && row.some((cell) => cell.length > 0))
    .map((row) => {
      const [idNumber, firstName, lastName, username] = row;

      return {
        id: idNumber,
        name: `${firstName} ${lastName}`.trim(),
        email: username,
      };
    });
}

export async function readUsersFromCsv(file: File): Promise<User[]> {
  const rows = await readCsvFile(file);
  return rowsToUsers(rows);
}
