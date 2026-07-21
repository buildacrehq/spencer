"use client";

import { parseFoundationScope } from "@/lib/foundationScope";

// Renders `foundationScope` as Category / Item groups (matching the
// reference doc's "Foundation Work Includes" table added 2026-07-21)
// instead of one flat bullet list with no grouping.

interface Props {
  text: string;
}

export function ClassicFoundationTable({ text }: Props) {
  const groups = parseFoundationScope(text);
  return (
    <div className="foundation-groups">
      {groups.map((g, i) => (
        <div className="foundation-group" key={i}>
          {g.category && <div className="foundation-cat">{g.category}</div>}
          <ul className="foundation-items">
            {g.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function ModernFoundationTable({ text }: Props) {
  const groups = parseFoundationScope(text);
  return (
    <div className="mod-foundation-groups">
      {groups.map((g, i) => (
        <div className="mod-foundation-group" key={i}>
          {g.category && <div className="mod-foundation-cat">{g.category}</div>}
          <ul className="mod-foundation-items">
            {g.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
