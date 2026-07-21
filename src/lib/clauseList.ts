// Parses the "• Clause — Description" bullet text format used by
// terms.freeze and terms.adjust into {clause, desc} pairs, so the print
// view can render them as a proper two-column Clause/Description table
// (matching the reference doc added 2026-07-21) instead of one dense
// bullet-prefixed paragraph.

export interface Clause {
  clause: string;
  desc: string;
}

const BULLET_RE = /^[•○-]\s*(.+)$/;
const DASH_RE = /^(.*?)\s+[—–-]\s+(.+)$/;

export function parseClauseList(text: string): Clause[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const bulletMatch = line.match(BULLET_RE);
      const rest = bulletMatch ? bulletMatch[1] : line;
      const dashMatch = rest.match(DASH_RE);
      if (!dashMatch) return { clause: rest, desc: "" };
      const [, clause, desc] = dashMatch;
      return { clause, desc };
    });
}
