import type { CsvRow, User, Training } from "./storage.ts";

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

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        // Escaped quote ("" inside a quoted field) -> literal "
        current += '"';
        i++; // skip the second quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
}

export function parseCsv(text: string): string[][] {
  return text.trim().split(/\r?\n/).map(parseCsvLine);
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

export function rowsToTrainings(rows: string[][]): Training[] {
  const dataRows = rows[0]?.[0]?.toLowerCase().includes("certification")
    ? rows.slice(1)
    : rows;

  return dataRows
    .filter((row) => row.length >= 2 && row.some((cell) => cell.length > 0))
    .map((row) => {
      const [name, code] = row;

      return {
        code,
        name,
      };
    });
}

export async function readTrainingsFromCsv(file: File): Promise<Training[]> {
  const rows = await readCsvFile(file);
  return rowsToTrainings(rows);
}
