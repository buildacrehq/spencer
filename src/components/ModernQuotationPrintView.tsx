"use client";

import Image from "next/image";
import type { QuoteState } from "@/lib/types";
import { computeTotals, fmt } from "@/lib/totals";
import { categoryIcon } from "@/lib/categoryIcons";
import { CLIENT_FIELDS } from "@/lib/useQuoteHandlers";

interface Props {
  state: QuoteState;
}

function StaticText({ children }: { children?: string }) {
  return <div className="static-value" style={{ fontSize: 14, padding: "6px 0" }}>{children || ""}</div>;
}

function StaticBlock({ children }: { children?: string }) {
  return <div className="mod-block">{children || ""}</div>;
}

export default function ModernQuotationPrintView({ state }: Props) {
  const totals = computeTotals(state);

  return (
    <div className="mod-page print-only">
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
          <div className="mod-cover-about">{state.companyAbout}</div>
        </div>

        <div className="mod-body">
          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">01</span>
              <h2 className="mod-heading">Project Quotation</h2>
            </div>
            <div className="mod-kv-grid">
              {CLIENT_FIELDS.map(([key, label]) => (
                <div className="mod-kv-field" key={key}>
                  <label>{label}</label>
                  <StaticText>{state.client[key]}</StaticText>
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
                </tr>
              </thead>
              <tbody>
                {state.floors.map((f) => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600 }}>{f.floor}</td>
                    <td style={{ whiteSpace: "pre-wrap" }}>{f.plan}</td>
                    <td style={{ fontWeight: 600 }}>{f.purpose}</td>
                    <td className="mod-num-cell">{f.area}</td>
                  </tr>
                ))}
                <tr className="mod-total-row">
                  <td colSpan={3}>Total Slab Area</td>
                  <td className="mod-num-cell">{totals.totalArea}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">03</span>
              <h2 className="mod-heading">Foundation Work Includes</h2>
            </div>
            <StaticBlock>{state.foundationScope}</StaticBlock>
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
                  <strong className="mod-cat-title">{cat.title}</strong>
                </div>
                {cat.rows.map((row) => (
                  <div className="mod-spec-row" key={row.id}>
                    <span style={{ flex: "0 0 32%", fontWeight: 600 }}>{row.item}</span>
                    <span style={{ flex: 1 }}>{row.spec}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">05</span>
              <h2 className="mod-heading">Base Construction Cost</h2>
            </div>
            <div className="mod-cost-strip">
              <span>Rate</span>
              <strong>{state.baseRate}</strong>
              <span>/ sqft</span>
              <span className="eq">×</span>
              <span>{totals.totalArea}</span> sqft
              <span className="eq">=</span>
              <strong>{fmt(totals.baseCost)}</strong>
            </div>
            <p className="mod-hint" style={{ marginTop: 16 }}>What this rate includes</p>
            <StaticBlock>{state.costIncludes}</StaticBlock>
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
                </tr>
              </thead>
              <tbody>
                {state.requirements.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.item}</td>
                    <td>{r.desc}</td>
                    <td className="mod-num-cell">{fmt(r.cost)}</td>
                  </tr>
                ))}
                <tr className="mod-total-row">
                  <td colSpan={2}>Additional Requirements Total</td>
                  <td className="mod-num-cell">{fmt(totals.reqTotal)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mod-grand-total">
              <div>
                <div className="label">Total Project Cost</div>
                <div className="persqft">{totals.totalArea ? `≈ ${fmt(totals.perSqft)} per sqft` : ""}</div>
              </div>
              <div className="value">{fmt(totals.grandTotal)}</div>
            </div>
            <p className="mod-hint">Valid until {state.client.validity || "—"} — pricing may be revised after this date.</p>
          </div>

          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">07</span>
              <h2 className="mod-heading">Terms, Scope &amp; Process</h2>
            </div>
            <p className="mod-hint">Included at No Extra Cost</p>
            <StaticBlock>{state.terms.included}</StaticBlock>
            <p className="mod-hint" style={{ marginTop: 20 }}>Specification Freeze &amp; Variation Policy</p>
            <StaticBlock>{state.terms.freeze}</StaticBlock>
            <p className="mod-hint" style={{ marginTop: 20 }}>Conditional Cost Adjustments</p>
            <StaticBlock>{state.terms.adjust}</StaticBlock>
            <p className="mod-hint" style={{ marginTop: 20 }}>Execution Process</p>
            <StaticBlock>{state.terms.exec}</StaticBlock>
            <p className="mod-hint" style={{ marginTop: 20 }}>Client Scope (Not Included)</p>
            <StaticBlock>{state.terms.scope}</StaticBlock>
          </div>

          <div className="mod-section">
            <div className="mod-heading-row">
              <span className="mod-num">08</span>
              <h2 className="mod-heading">Design &amp; Execution Workflow</h2>
            </div>
            <StaticBlock>{state.workflow}</StaticBlock>
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
