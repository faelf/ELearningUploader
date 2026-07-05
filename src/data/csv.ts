import type { CsvRow } from "./storage.js";

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
    values.push("1"); // CRUCIAL: The value for certificationcertify1 is always 1
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
