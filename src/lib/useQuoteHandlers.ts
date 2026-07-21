import { Dispatch, SetStateAction } from "react";
import type { QuoteState, FloorRow, RequirementRow, SpecCategory, SpecRow, Purpose } from "./types";
import { uid } from "./sampleData";

// Shared state-mutation handlers for editing a QuoteState, used by every
// template's editable Doc component (ClassicQuotationDoc, ModernQuotationDoc,
// ...). Templates differ only in JSX/markup — the editing logic underneath
// is identical, so it lives here once instead of being duplicated per
// template.
export function useQuoteHandlers(setState: Dispatch<SetStateAction<QuoteState>>) {
  const updateClient = (key: keyof QuoteState["client"], value: string) =>
    setState((s) => ({ ...s, client: { ...s.client, [key]: value } }));

  const updateFloor = (id: string, patch: Partial<FloorRow>) =>
    setState((s) => ({ ...s, floors: s.floors.map((f) => (f.id === id ? { ...f, ...patch } : f)) }));
  const addFloor = () =>
    setState((s) => ({ ...s, floors: [...s.floors, { id: uid(), floor: "", plan: "", purpose: "OWN" as Purpose, area: 0 }] }));
  const removeFloor = (id: string) => setState((s) => ({ ...s, floors: s.floors.filter((f) => f.id !== id) }));

  const updateReq = (id: string, patch: Partial<RequirementRow>) =>
    setState((s) => ({ ...s, requirements: s.requirements.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  const addReq = () =>
    setState((s) => ({ ...s, requirements: [...s.requirements, { id: uid(), item: "", desc: "", cost: 0 }] }));
  const removeReq = (id: string) =>
    setState((s) => ({ ...s, requirements: s.requirements.filter((r) => r.id !== id) }));

  const updateSpecCategory = (catId: string, patch: Partial<SpecCategory>) =>
    setState((s) => ({ ...s, specs: s.specs.map((c) => (c.id === catId ? { ...c, ...patch } : c)) }));
  const removeSpecCategory = (catId: string) =>
    setState((s) => ({ ...s, specs: s.specs.filter((c) => c.id !== catId) }));
  const addSpecCategory = () =>
    setState((s) => ({
      ...s,
      specs: [...s.specs, { id: uid(), title: "New Category", rows: [{ id: uid(), item: "", spec: "" }] }],
    }));

  const updateSpecRow = (catId: string, rowId: string, patch: Partial<SpecRow>) =>
    setState((s) => ({
      ...s,
      specs: s.specs.map((c) =>
        c.id === catId ? { ...c, rows: c.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)) } : c
      ),
    }));
  const addSpecRow = (catId: string) =>
    setState((s) => ({
      ...s,
      specs: s.specs.map((c) => (c.id === catId ? { ...c, rows: [...c.rows, { id: uid(), item: "", spec: "" }] } : c)),
    }));
  const removeSpecRow = (catId: string, rowId: string) =>
    setState((s) => ({
      ...s,
      specs: s.specs.map((c) => (c.id === catId ? { ...c, rows: c.rows.filter((r) => r.id !== rowId) } : c)),
    }));

  const updateTerms = (key: keyof QuoteState["terms"], value: string) =>
    setState((s) => ({ ...s, terms: { ...s.terms, [key]: value } }));

  return {
    updateClient,
    updateFloor,
    addFloor,
    removeFloor,
    updateReq,
    addReq,
    removeReq,
    updateSpecCategory,
    removeSpecCategory,
    addSpecCategory,
    updateSpecRow,
    addSpecRow,
    removeSpecRow,
    updateTerms,
  };
}

export const CLIENT_FIELDS: [keyof QuoteState["client"], string, string?][] = [
  ["name", "Client Name"],
  ["place", "Place"],
  ["location", "Site Location"],
  ["khatha", "Khatha Type"],
  ["siteDim", "Site Dimension"],
  ["roadFacing", "Road Facing"],
  ["setback", "After Setback"],
  ["soilCarting", "Soil Carting Away Space"],
  ["startDate", "Starting Date", "date"],
  ["quoteDate", "Quotation Date", "date"],
];
