"use client";

import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import type { QuoteState, Purpose } from "@/lib/types";
import { computeTotals, fmt } from "@/lib/totals";
import { categoryIcon } from "@/lib/categoryIcons";
import { useQuoteHandlers, CLIENT_FIELDS } from "@/lib/useQuoteHandlers";

interface Props {
  state: QuoteState;
  setState: Dispatch<SetStateAction<QuoteState>>;
}

export default function ModernQuotationDoc({ state, setState }: Props) {
  const totals = computeTotals(state);
  const {
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
  } = useQuoteHandlers(setState);

  return (
    <div className="mod-page">
      <div className="mod-doc">
        <div className="mod-cover">
          <div className="mod-cover-top">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Image src="/logo-icon.png" alt="" width={28} height={28} style={{ objectFit: "contain", borderRadius: 4 }} />
              <span className="mod-wordmark">Buildacre</span>
            </div>
            <span className="mod-cover-label">Quotation</span>
          </div>
          <div className="mod-cover-title">{state.client.name || "Untitled Client"}</div>
          <div className="mod-cover-sub">{state.client.location || state.client.place}</div>
          <div className="mod-cover-meta">
            <div>
              Quotation Date <br />
              <strong>{state.client.quoteDate || "—"}</strong>
            </div>
            <div>
              Valid Until <br />
              <strong>{state.client.validity || "—"}</strong>
            </div>
            <div>
              Total Project Cost <br />
              <strong>{fmt(totals.grandTotal)}</strong>
            </div>
          </div>
          <textarea
            className="mod-cover-about"
            rows={2}
            value={state.companyAbout}
            onChange={(e) => setState((s) => ({ ...s, companyAbout: e.target.value }))}
          />
        </div>

        <div className="mod-body">
          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">01</span>
              <h2 className="mod-heading">Project Quotation</h2>
            </div>
            <p className="mod-hint">Click any value to edit.</p>
            <div className="mod-kv-grid">
              {CLIENT_FIELDS.map(([key, label, type]) => (
                <div className="mod-kv-field" key={key}>
                  <label>{label}</label>
                  <input
                    className="mod-field"
                    type={type || "text"}
                    value={state.client[key] || ""}
                    onChange={(e) => updateClient(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">02</span>
              <h2 className="mod-heading">Floor Plan &amp; Slab Area</h2>
            </div>
            <table className="mod-table">
              <thead>
                <tr>
                  <th style={{ width: "16%" }}>Floor</th>
                  <th>Plan</th>
                  <th style={{ width: "11%" }}>Purpose</th>
                  <th style={{ width: "12%" }}>Area</th>
                  <th style={{ width: "24px" }}></th>
                </tr>
              </thead>
              <tbody>
                {state.floors.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <input className="mod-field" style={{ fontWeight: 600 }} value={f.floor} onChange={(e) => updateFloor(f.id, { floor: e.target.value })} />
                    </td>
                    <td>
                      <textarea className="mod-field" rows={2} value={f.plan} onChange={(e) => updateFloor(f.id, { plan: e.target.value })} />
                    </td>
                    <td>
                      <select
                        className="mod-field"
                        style={{ fontWeight: 600 }}
                        value={f.purpose}
                        onChange={(e) => updateFloor(f.id, { purpose: e.target.value as Purpose })}
                      >
                        <option value="OWN">OWN</option>
                        <option value="RENT">RENT</option>
                      </select>
                    </td>
                    <td className="mod-num-cell">
                      <input className="mod-field" type="number" value={f.area} onChange={(e) => updateFloor(f.id, { area: parseFloat(e.target.value) || 0 })} />
                    </td>
                    <td>
                      <button className="mod-del-btn" onClick={() => removeFloor(f.id)}>×</button>
                    </td>
                  </tr>
                ))}
                <tr className="mod-total-row">
                  <td colSpan={3}>Total Slab Area</td>
                  <td className="mod-num-cell">{totals.totalArea}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <button className="mod-add-btn" onClick={addFloor}>+ Add floor</button>
          </div>

          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">03</span>
              <h2 className="mod-heading">Foundation Work Includes</h2>
            </div>
            <textarea className="mod-field mod-block-input" rows={6} value={state.foundationScope} onChange={(e) => setState((s) => ({ ...s, foundationScope: e.target.value }))} />
          </div>

          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">04</span>
              <h2 className="mod-heading">Specifications &amp; Materials</h2>
            </div>
            {state.specs.map((cat) => (
              <div className="mod-spec-group" key={cat.id}>
                <div className="mod-spec-group-head">
                  {categoryIcon(cat.title) && <span>{categoryIcon(cat.title)}</span>}
                  <input className="mod-cat-title" value={cat.title} onChange={(e) => updateSpecCategory(cat.id, { title: e.target.value })} />
                  <button className="mod-del-btn" style={{ fontSize: 11 }} onClick={() => removeSpecCategory(cat.id)}>× remove</button>
                </div>
                {cat.rows.map((row) => (
                  <div className="mod-spec-row" key={row.id}>
                    <input className="mod-field" placeholder="Item" value={row.item} onChange={(e) => updateSpecRow(cat.id, row.id, { item: e.target.value })} />
                    <input className="mod-field" placeholder="Specification" value={row.spec} onChange={(e) => updateSpecRow(cat.id, row.id, { spec: e.target.value })} />
                    <button className="mod-del-btn" onClick={() => removeSpecRow(cat.id, row.id)}>×</button>
                  </div>
                ))}
                <button className="mod-add-btn" onClick={() => addSpecRow(cat.id)}>+ Add row</button>
              </div>
            ))}
            <button className="mod-add-btn" onClick={addSpecCategory}>+ Add specification category</button>
          </div>

          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">05</span>
              <h2 className="mod-heading">Base Construction Cost</h2>
            </div>
            <div className="mod-cost-strip">
              <span>Rate</span>
              <input className="mod-field" type="number" style={{ width: 100 }} value={state.baseRate} onChange={(e) => setState((s) => ({ ...s, baseRate: parseFloat(e.target.value) || 0 }))} />
              <span>/ sqft</span>
              <span className="eq">×</span>
              <span>{totals.totalArea}</span> sqft
              <span className="eq">=</span>
              <strong>{fmt(totals.baseCost)}</strong>
            </div>
            <p className="mod-hint" style={{ marginTop: 16 }}>What this rate includes</p>
            <textarea className="mod-field" rows={3} value={state.costIncludes} onChange={(e) => setState((s) => ({ ...s, costIncludes: e.target.value }))} />
          </div>

          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">06</span>
              <h2 className="mod-heading">Client Requirement Cost Break-up</h2>
            </div>
            <table className="mod-table">
              <thead>
                <tr>
                  <th style={{ width: "26%" }}>Item</th>
                  <th>Description</th>
                  <th style={{ width: "14%" }}>Cost</th>
                  <th style={{ width: "24px" }}></th>
                </tr>
              </thead>
              <tbody>
                {state.requirements.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <input className="mod-field" style={{ fontWeight: 600 }} value={r.item} onChange={(e) => updateReq(r.id, { item: e.target.value })} />
                    </td>
                    <td>
                      <input className="mod-field" value={r.desc} onChange={(e) => updateReq(r.id, { desc: e.target.value })} />
                    </td>
                    <td className="mod-num-cell">
                      <input className="mod-field" type="number" value={r.cost} onChange={(e) => updateReq(r.id, { cost: parseFloat(e.target.value) || 0 })} />
                    </td>
                    <td>
                      <button className="mod-del-btn" onClick={() => removeReq(r.id)}>×</button>
                    </td>
                  </tr>
                ))}
                <tr className="mod-total-row">
                  <td colSpan={2}>Additional Requirements Total</td>
                  <td className="mod-num-cell">{fmt(totals.reqTotal)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <button className="mod-add-btn" onClick={addReq}>+ Add line item</button>

            <div className="mod-grand-total">
              <div>
                <div className="label">Total Project Cost</div>
                <div className="persqft">{totals.totalArea ? `≈ ${fmt(totals.perSqft)} per sqft` : ""}</div>
              </div>
              <div className="value">{fmt(totals.grandTotal)}</div>
            </div>
            <p className="mod-hint">
              Valid until{" "}
              <input
                className="mod-field"
                type="date"
                style={{ width: 140, display: "inline-block" }}
                value={state.client.validity || ""}
                onChange={(e) => updateClient("validity", e.target.value)}
              />{" "}
              — pricing may be revised after this date.
            </p>
          </div>

          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">07</span>
              <h2 className="mod-heading">Terms, Scope &amp; Process</h2>
            </div>
            <p className="mod-hint">Included at No Extra Cost</p>
            <textarea className="mod-field" rows={4} value={state.terms.included} onChange={(e) => updateTerms("included", e.target.value)} />
            <p className="mod-hint" style={{ marginTop: 20 }}>Specification Freeze &amp; Variation Policy</p>
            <textarea className="mod-field" rows={5} value={state.terms.freeze} onChange={(e) => updateTerms("freeze", e.target.value)} />
            <p className="mod-hint" style={{ marginTop: 20 }}>Conditional Cost Adjustments</p>
            <textarea className="mod-field" rows={5} value={state.terms.adjust} onChange={(e) => updateTerms("adjust", e.target.value)} />
            <p className="mod-hint" style={{ marginTop: 20 }}>Execution Process</p>
            <textarea className="mod-field" rows={6} value={state.terms.exec} onChange={(e) => updateTerms("exec", e.target.value)} />
            <p className="mod-hint" style={{ marginTop: 20 }}>Client Scope (Not Included)</p>
            <textarea className="mod-field" rows={6} value={state.terms.scope} onChange={(e) => updateTerms("scope", e.target.value)} />
          </div>

          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">08</span>
              <h2 className="mod-heading">Design &amp; Execution Workflow</h2>
            </div>
            <textarea className="mod-field" rows={10} value={state.workflow} onChange={(e) => setState((s) => ({ ...s, workflow: e.target.value }))} />
          </div>

          <div className="mod-footer">
            Issued by {state.client.issuedBy || ""}
            {state.client.parentCo ? ` · ${state.client.parentCo}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
