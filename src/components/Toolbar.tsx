"use client";

import Image from "next/image";
import type { QuoteListItem } from "@/lib/quotesRepo";

interface Props {
  quotes: QuoteListItem[];
  selectedName: string;
  onSelectedNameChange: (name: string) => void;
  onOpen: () => void;
  onDelete: () => void;
  onSampleRanjith: () => void;
  onSampleKiran: () => void;
  onNewBlank: () => void;
  onSave: () => void;
  onPrint: () => void;
  onLogout: () => void;
  pillTotal: string;
  busy: boolean;
}

export default function Toolbar({
  quotes,
  selectedName,
  onSelectedNameChange,
  onOpen,
  onDelete,
  onSampleRanjith,
  onSampleKiran,
  onNewBlank,
  onSave,
  onPrint,
  onLogout,
  pillTotal,
  busy,
}: Props) {
  return (
    <div className="toolbar">
      <div className="brand">
        <Image src="/logo-icon.png" alt="" width={24} height={24} style={{ objectFit: "contain" }} />
        <span>BUILDACRE</span>
      </div>
      <select value={selectedName} onChange={(e) => onSelectedNameChange(e.target.value)}>
        <option value="">Saved quotes…</option>
        {quotes.map((q) => (
          <option key={q.id} value={q.name}>
            {q.name}
          </option>
        ))}
      </select>
      <button className="tbtn tbtn-ghost" onClick={onOpen} disabled={busy || !selectedName}>
        Open
      </button>
      <button className="tbtn tbtn-ghost" onClick={onDelete} disabled={busy || !selectedName}>
        Delete
      </button>
      <button className="tbtn tbtn-ghost" onClick={onSampleRanjith} disabled={busy}>
        Sample: Ranjith
      </button>
      <button className="tbtn tbtn-ghost" onClick={onSampleKiran} disabled={busy}>
        Sample: Kiran
      </button>
      <button className="tbtn tbtn-ghost" onClick={onNewBlank} disabled={busy}>
        New Blank
      </button>
      <button className="tbtn tbtn-teal" onClick={onSave} disabled={busy}>
        Save
      </button>
      <button className="tbtn tbtn-clay" onClick={onPrint} disabled={busy}>
        Export / Print PDF
      </button>
      <div className="total-pill">
        <span className="lbl">Total</span>
        <span>{pillTotal}</span>
      </div>
      <button className="tbtn tbtn-ghost" onClick={onLogout} disabled={busy} style={{ marginLeft: 4 }}>
        Log out
      </button>
    </div>
  );
}
