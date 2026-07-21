// Parses the "N. Title — description" numbered-list text format used by
// `workflow` and `terms.exec` (still stored/edited as one plain
// newline-joined string — see useQuoteHandlers.ts) into structured items,
// so the print/preview output can render real numbered rows with a bold
// title instead of one dense wrapped paragraph of "1. ... 2. ... 3. ..."
// text, which read as a textbook page rather than a client-facing
// document (reported 2026-07-21).

export interface NumberedItem {
  num: string;
  title: string;
  desc: string | null;
}

const LINE_RE = /^(\d+)\.\s*(.+)$/;
const DASH_RE = /^(.*?)\s+[—–-]\s+(.+)$/;

export function parseNumberedList(text: string): NumberedItem[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const lineMatch = line.match(LINE_RE);
      if (!lineMatch) return { num: "", title: line, desc: null };
      const [, num, rest] = lineMatch;
      const dashMatch = rest.match(DASH_RE);
      if (!dashMatch) return { num, title: rest, desc: null };
      const [, title, desc] = dashMatch;
      return { num, title, desc };
    });
}
