// Parses `foundationScope` text into categorized groups, so the print
// view can render "Foundation Work Includes" as a Category/Item table
// (matching the reference doc added 2026-07-21) instead of one flat
// bullet list. A line starting with "## " opens a new category; every
// line after it (until the next "## ") is an item in that category.
// Text with no "## " markers at all (older quotes, other samples) is
// still valid — it renders as a single unlabeled group.

export interface FoundationCategory {
  category: string;
  items: string[];
}

const CATEGORY_RE = /^##\s*(.+)$/;

export function parseFoundationScope(text: string): FoundationCategory[] {
  const groups: FoundationCategory[] = [];
  let current: FoundationCategory | null = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const catMatch = line.match(CATEGORY_RE);
    if (catMatch) {
      current = { category: catMatch[1], items: [] };
      groups.push(current);
      continue;
    }

    if (!current) {
      current = { category: "", items: [] };
      groups.push(current);
    }
    current.items.push(line);
  }
  return groups;
}
