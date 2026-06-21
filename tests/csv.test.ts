import { describe, it, expect } from "vitest";
import { toCsv } from "@/lib/csv";

type Row = { name: string; note: string; count: number };

describe("toCsv", () => {
  it("writes a header and rows", () => {
    const out = toCsv<Row>(
      [{ name: "Jane", note: "hello", count: 2 }],
      [
        { header: "Name", value: (r) => r.name },
        { header: "Note", value: (r) => r.note },
        { header: "Count", value: (r) => r.count },
      ],
    );
    expect(out).toBe("Name,Note,Count\r\nJane,hello,2");
  });

  it("escapes commas, quotes, and newlines", () => {
    const out = toCsv<Row>(
      [{ name: "Doe, Jane", note: 'say "hi"\nplease', count: 1 }],
      [
        { header: "Name", value: (r) => r.name },
        { header: "Note", value: (r) => r.note },
        { header: "Count", value: (r) => r.count },
      ],
    );
    expect(out).toBe('Name,Note,Count\r\n"Doe, Jane","say ""hi""\nplease",1');
  });

  it("renders null and undefined as empty cells", () => {
    const out = toCsv<{ a: string | null; b: undefined }>(
      [{ a: null, b: undefined }],
      [
        { header: "A", value: (r) => r.a },
        { header: "B", value: (r) => r.b },
      ],
    );
    expect(out).toBe("A,B\r\n,");
  });
});
