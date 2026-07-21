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

export default function ClassicQuotationDoc({ state, setState }: Props) {
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
    <div className="page">
      <div className="doc">
        <div className="cover">
          <Image
            src="/logo-full.png"
            alt="BuildAcre"
            width={934}
            height={401}
            style={{ maxWidth: 280, width: "100%", height: "auto", display: "block", margin: "0 auto" }}
            priority
          />
          <div className="subwordmark">{state.client.parentCo || ""}</div>
          <input
            className="field-input cover-intro"
            value={state.companyIntro}
            onChange={(e) => setState((s) => ({ ...s, companyIntro: e.target.value }))}
          />
          <textarea
            className="field-input cover-about"
            rows={2}
            value={state.companyAbout}
            onChange={(e) => setState((s) => ({ ...s, companyAbout: e.target.value }))}
          />
          <div className="brandbar">
            <span className="t"></span>
            <span className="c"></span>
          </div>
        </div>

        <div className="doc-body">
          <h2 className="doctitle">
            <span className="num">01</span> Project Quotation
          </h2>
          <p className="section-hint">Click any value below to edit — this is the live document, not a separate form.</p>
          <div className="kv-grid">
            {CLIENT_FIELDS.map(([key, label, type]) => (
              <div className="kv-field" key={key}>
                <label>{label}</label>
                <input
                  className="field-input"
                  type={type || "text"}
                  value={state.client[key] || ""}
                  onChange={(e) => updateClient(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <h2 className="doctitle">
            <span className="num">02</span> Floor Plan &amp; Slab Area
          </h2>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "16%" }}>Floor</th>
                <th>Plan</th>
                <th style={{ width: "11%" }}>Purpose</th>
                <th style={{ width: "12%" }}>Area (sqft)</th>
                <th style={{ width: "26px" }}></th>
              </tr>
            </thead>
            <tbody>
              {state.floors.map((f) => (
                <tr key={f.id}>
                  <td>
                    <input className="field-input" style={{ fontWeight: 700 }} value={f.floor} onChange={(e) => updateFloor(f.id, { floor: e.target.value })} />
                  </td>
                  <td>
                    <textarea
                      className="field-input"
                      rows={2}
                      style={{ minHeight: 38 }}
                      value={f.plan}
                      onChange={(e) => updateFloor(f.id, { plan: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      className="field-input"
                      style={{ fontWeight: 700, color: "var(--teal)" }}
                      value={f.purpose}
                      onChange={(e) => updateFloor(f.id, { purpose: e.target.value as Purpose })}
                    >
                      <option value="OWN">OWN</option>
                      <option value="RENT">RENT</option>
                    </select>
                  </td>
                  <td className="num-cell">
                    <input
                      className="field-input"
                      type="number"
                      value={f.area}
                      onChange={(e) => updateFloor(f.id, { area: parseFloat(e.target.value) || 0 })}
                    />
                  </td>
                  <td>
                    <button className="del-btn" onClick={() => removeFloor(f.id)}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan={3}>Total Slab Area</td>
                <td>{totals.totalArea}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          <button className="add-btn" onClick={addFloor}>
            + Add floor
          </button>

          <h2 className="doctitle">
            <span className="num">03</span> Foundation Work Includes (Scope Assumptions)
          </h2>
          <textarea
            className="field-input"
            rows={6}
            value={state.foundationScope}
            onChange={(e) => setState((s) => ({ ...s, foundationScope: e.target.value }))}
          />

          <h2 className="doctitle">
            <span className="num">04</span> Specifications &amp; Materials
          </h2>
          <div>
            {state.specs.map((cat) => (
              <div className="spec-block" key={cat.id}>
                <div className="spec-head">
                  <span className="tag"></span>
                  {categoryIcon(cat.title) && <span className="icon">{categoryIcon(cat.title)}</span>}
                  <input
                    className="cat-title-input"
                    value={cat.title}
                    onChange={(e) => updateSpecCategory(cat.id, { title: e.target.value })}
                  />
                  <button className="del-btn" style={{ fontSize: 11 }} onClick={() => removeSpecCategory(cat.id)}>
                    × remove section
                  </button>
                </div>
                <div>
                  {cat.rows.map((row) => (
                    <div className="spec-row" key={row.id}>
                      <input
                        className="field-input"
                        placeholder="Item"
                        value={row.item}
                        onChange={(e) => updateSpecRow(cat.id, row.id, { item: e.target.value })}
                      />
                      <input
                        className="field-input"
                        placeholder="Specification"
                        value={row.spec}
                        onChange={(e) => updateSpecRow(cat.id, row.id, { spec: e.target.value })}
                      />
                      <button className="del-btn" onClick={() => removeSpecRow(cat.id, row.id)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button className="add-btn" onClick={() => addSpecRow(cat.id)}>
                  + Add row
                </button>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={addSpecCategory}>
            + Add specification category
          </button>

          <h2 className="doctitle">
            <span className="num">05</span> Base Construction Cost
          </h2>
          <div className="cost-formula">
            <span>Rate</span>
            <input
              className="field-input"
              type="number"
              style={{ width: 110 }}
              value={state.baseRate}
              onChange={(e) => setState((s) => ({ ...s, baseRate: parseFloat(e.target.value) || 0 }))}
            />
            <span>/ sqft</span>
            <span className="eq">×</span>
            <span>{totals.totalArea}</span> sqft
            <span className="eq">=</span>
            <strong>{fmt(totals.baseCost)}</strong>
          </div>
          <h3 className="subhead">What This Rate Includes</h3>
          <textarea
            className="field-input"
            rows={3}
            value={state.costIncludes}
            onChange={(e) => setState((s) => ({ ...s, costIncludes: e.target.value }))}
          />

          <h2 className="doctitle">
            <span className="num">06</span> Client Requirement Cost Break-up
          </h2>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "26%" }}>Item</th>
                <th>Description</th>
                <th style={{ width: "14%" }}>Cost</th>
                <th style={{ width: "26px" }}></th>
              </tr>
            </thead>
            <tbody>
              {state.requirements.map((r) => (
                <tr key={r.id}>
                  <td>
                    <input className="field-input" style={{ fontWeight: 700 }} value={r.item} onChange={(e) => updateReq(r.id, { item: e.target.value })} />
                  </td>
                  <td>
                    <input className="field-input" value={r.desc} onChange={(e) => updateReq(r.id, { desc: e.target.value })} />
                  </td>
                  <td className="num-cell">
                    <input
                      className="field-input"
                      type="number"
                      value={r.cost}
                      onChange={(e) => updateReq(r.id, { cost: parseFloat(e.target.value) || 0 })}
                    />
                  </td>
                  <td>
                    <button className="del-btn" onClick={() => removeReq(r.id)}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan={2}>Additional Requirements Total</td>
                <td>{fmt(totals.reqTotal)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          <button className="add-btn" onClick={addReq}>
            + Add line item
          </button>

          <div className="grand-total-box">
            <div>
              <div className="label">Total Project Cost</div>
              <div className="persqft">{totals.totalArea ? `≈ ${fmt(totals.perSqft)} per sqft` : ""}</div>
            </div>
            <div className="value">{fmt(totals.grandTotal)}</div>
          </div>
          <p className="section-hint">
            Valid until{" "}
            <input
              className="field-input"
              type="date"
              style={{ width: 150, display: "inline-block" }}
              value={state.client.validity || ""}
              onChange={(e) => updateClient("validity", e.target.value)}
            />{" "}
            — pricing may be revised after this date.
          </p>

          <h2 className="doctitle">
            <span className="num">07</span> Terms, Scope &amp; Process
          </h2>

          <h3 className="subhead">Included at No Extra Cost</h3>
          <textarea className="field-input" rows={4} value={state.terms.included} onChange={(e) => updateTerms("included", e.target.value)} />

          <h3 className="subhead">Specification Freeze &amp; Variation Policy</h3>
          <textarea className="field-input" rows={5} value={state.terms.freeze} onChange={(e) => updateTerms("freeze", e.target.value)} />

          <h3 className="subhead">Conditional Cost Adjustments</h3>
          <textarea className="field-input" rows={5} value={state.terms.adjust} onChange={(e) => updateTerms("adjust", e.target.value)} />

          <h3 className="subhead">Execution Process</h3>
          <textarea className="field-input" rows={6} value={state.terms.exec} onChange={(e) => updateTerms("exec", e.target.value)} />

          <h3 className="subhead">Client Scope (Not Included)</h3>
          <textarea className="field-input" rows={6} value={state.terms.scope} onChange={(e) => updateTerms("scope", e.target.value)} />

          <h2 className="doctitle">
            <span className="num">08</span> Design &amp; Execution Workflow (Post-Advance Payment)
          </h2>
          <textarea
            className="field-input"
            rows={10}
            value={state.workflow}
            onChange={(e) => setState((s) => ({ ...s, workflow: e.target.value }))}
          />

          <div className="footer-note">
            Issued by {state.client.issuedBy || ""}
            {state.client.parentCo ? ` · ${state.client.parentCo}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
