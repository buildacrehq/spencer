"use client";

import { parseNumberedList } from "@/lib/numberedList";

// Renders parsed "N. Title — description" text as real numbered rows.
// See numberedList.ts's header comment for why (was reading as a
// textbook wall of text). Two variants matching each template's own
// class-name convention and visual language.

interface Props {
  text: string;
}

export function ClassicNumberedList({ text }: Props) {
  const items = parseNumberedList(text);
  return (
    <div className="numlist">
      {items.map((item, i) => (
        <div className="numlist-item" key={i}>
          <span className="numlist-num">{item.num || i + 1}</span>
          <div>
            <div className="numlist-title">{item.title}</div>
            {item.desc && <div className="numlist-desc">{item.desc}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ModernNumberedList({ text }: Props) {
  const items = parseNumberedList(text);
  return (
    <div className="mod-numlist">
      {items.map((item, i) => (
        <div className="mod-numlist-item" key={i}>
          <span className="mod-numlist-num">{(item.num || String(i + 1)).padStart(2, "0")}</span>
          <div>
            <div className="mod-numlist-title">{item.title}</div>
            {item.desc && <div className="mod-numlist-desc">{item.desc}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
