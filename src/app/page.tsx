"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toolbar from "@/components/Toolbar";
import QuotationDoc from "@/components/QuotationDoc";
import QuotationPrintView from "@/components/QuotationPrintView";
import { sampleState, sampleStateKiran, sampleStateRavi, blankState } from "@/lib/sampleData";
import { fmt, computeTotals } from "@/lib/totals";
import { listQuotes, loadQuote, saveQuote, deleteQuote, QuoteListItem } from "@/lib/quotesRepo";
import type { QuoteState } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [state, setState] = useState<QuoteState>(() => sampleState());
  const [quotes, setQuotes] = useState<QuoteListItem[]>([]);
  const [selectedName, setSelectedName] = useState("");
  const [busy, setBusy] = useState(false);

  const refreshQuotes = async () => {
    try {
      setQuotes(await listQuotes());
    } catch (e) {
      console.error("Could not list saved quotes", e);
    }
  };

  useEffect(() => {
    let cancelled = false;
    listQuotes()
      .then((q) => {
        if (!cancelled) setQuotes(q);
      })
      .catch((e) => console.error("Could not list saved quotes", e));
    return () => {
      cancelled = true;
    };
  }, []);

  const pillTotal = fmt(computeTotals(state).grandTotal);

  const handleOpen = async () => {
    if (!selectedName) return;
    setBusy(true);
    try {
      setState(await loadQuote(selectedName));
    } catch {
      alert("Could not load that quote.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedName) return;
    if (!confirm(`Delete saved quote "${selectedName}"?`)) return;
    setBusy(true);
    try {
      await deleteQuote(selectedName);
      setSelectedName("");
      await refreshQuotes();
    } catch {
      alert("Could not delete.");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    const name = prompt("Save this quote as (e.g. client name):", state.client.name || "Untitled Quote");
    if (!name) return;
    setBusy(true);
    try {
      await saveQuote(name, state);
      await refreshQuotes();
      setSelectedName(name);
      alert(`Saved "${name}".`);
    } catch (e) {
      console.error("Save failed", e);
      alert("Could not save this quote.");
    } finally {
      setBusy(false);
    }
  };

  const loadSample = (label: string, factory: () => QuoteState) => {
    if (confirm(`Load the ${label} sample quotation? Unsaved changes will be lost.`)) {
      setState(factory());
    }
  };

  const handleNewBlank = () => {
    if (confirm("Start a new blank quotation? Unsaved changes will be lost.")) {
      setState(blankState());
    }
  };

  const handlePrint = () => window.print();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <div className="screen-only">
        <Toolbar
          quotes={quotes}
          selectedName={selectedName}
          onSelectedNameChange={setSelectedName}
          onOpen={handleOpen}
          onDelete={handleDelete}
          onSampleRanjith={() => loadSample("Ranjith", sampleState)}
          onSampleKiran={() => loadSample("Kiran", sampleStateKiran)}
          onSampleRavi={() => loadSample("Ravi Kumar", sampleStateRavi)}
          onNewBlank={handleNewBlank}
          onSave={handleSave}
          onPrint={handlePrint}
          onLogout={handleLogout}
          pillTotal={pillTotal}
          busy={busy}
        />
        <QuotationDoc state={state} setState={setState} />
      </div>
      <QuotationPrintView state={state} />
    </>
  );
}
