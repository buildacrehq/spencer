"use client";

import { parseClauseList } from "@/lib/clauseList";

// Renders parsed "• Clause — Description" text as a Clause/Description
// table, matching the reference doc's "Specification Freeze & Variation
// Policy" / "Conditional Cost Adjustments" tables instead of one dense
// bullet-prefixed paragraph.

interface Props {
  text: string;
}

export function ClassicClauseTable({ text }: Props) {
  const rows = parseClauseList(text);
  return (
    <table className="doc-table clause-table">
      <thead>
        <tr>
          <th style={{ width: "28%" }}>Clause</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td style={{ fontWeight: 700 }}>{r.clause}</td>
            <td>{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ModernClauseTable({ text }: Props) {
  const rows = parseClauseList(text);
  return (
    <table className="mod-table clause-table">
      <thead>
        <tr>
          <th style={{ width: "28%" }}>Clause</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td style={{ fontWeight: 600 }}>{r.clause}</td>
            <td>{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
