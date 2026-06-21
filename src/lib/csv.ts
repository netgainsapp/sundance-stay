export type CsvColumn<T> = { header: string; value: (row: T) => string | number | null | undefined };

// Cells beginning with these characters can be interpreted as formulas by
// spreadsheet apps (Excel, Sheets, LibreOffice). Prefix them with a single
// quote so they are treated as literal text. Prevents CSV formula injection
// from user-submitted fields that an operator later opens in a spreadsheet.
const FORMULA_TRIGGER = /^[=+\-@\t\r]/;

function escapeCell(value: string | number | null | undefined): string {
  const raw = value === null || value === undefined ? "" : String(value);
  const str = FORMULA_TRIGGER.test(raw) ? `'${raw}` : raw;
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => escapeCell(c.value(row))).join(","),
  );
  return [header, ...lines].join("\r\n");
}
