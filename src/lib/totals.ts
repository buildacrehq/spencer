import type { QuoteState } from "./types";

export function fmt(n: number): string {
  return "₹" + Math.round(n || 0).toLocaleString("en-IN");
}

export interface Totals {
  totalArea: number;
  baseCost: number;
  reqTotal: number;
  grandTotal: number;
  perSqft: number;
}

export function computeTotals(state: QuoteState): Totals {
  const totalArea = state.floors.reduce((s, f) => s + (f.area || 0), 0);
  const baseCost = totalArea * (state.baseRate || 0);
  const reqTotal = state.requirements.reduce((s, r) => s + (r.cost || 0), 0);
  const grandTotal = baseCost + reqTotal;
  const perSqft = totalArea ? grandTotal / totalArea : 0;
  return { totalArea, baseCost, reqTotal, grandTotal, perSqft };
}
