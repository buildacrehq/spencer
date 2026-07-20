"use client";

import Image from "next/image";
import type { QuoteState } from "@/lib/types";
import { computeTotals, fmt } from "@/lib/totals";
import { categoryIcon } from "@/lib/categoryIcons";

// Print rendering strategy note (see legacy/buildacre-quotation-builder-HANDOFF.md §6
// for the three bugs the original vanilla-JS DOM-cloning approach had to work around —
// frozen pixel widths, flex min-width, and a zero-size iframe). None of that applies
// here: this component renders the *state* directly as plain text, so a <textarea>'s
// fixed visible-row height can never clip content the way it did in the original,
// and there's no iframe/clone step to get wrong. Shown only under @media print via
// the .print-only / .screen-only rules in globals.css.

interface Props {
  state: QuoteState;
}

const CLIENT_FIELDS: [keyof QuoteState["client"], string][] = [
  ["name", "Client Name"],
  ["place", "Place"],
  ["location", "Site Location"],
  ["khatha", "Khatha Type"],
  ["siteDim", "Site Dimension"],
  ["roadFacing", "Road Facing"],
  ["setback", "After Setback"],
  ["soilCarting", "Soil Carting Away Space"],
  ["startDate", "Starting Date"],
  ["quoteDate", "Quotation Date"],
];

function StaticText({ children }: { children?: string }) {
  return <div className="static-value">{children || ""}</div>;
}

function StaticBlock({ children }: { children?: string }) {
  return <div className="static-value static-block">{children || ""}</div>;
}

export default function QuotationPrintView({ state }: Props) {
  const totals = computeTotals(state);

  return (
    <div className="page print-only">
      <div className="doc">
        <div className="cover">
          <Image
            src="/logo-full.png"
            alt="BuildAcre"
            width={934}
            height={401}
            style={{ maxWidth: 280, width: "100%", height: "auto", display: "block", margin: "0 auto" }}
          />
          <div className="subwordmark">{state.client.parentCo || ""}</div>
          <div className="brandbar">
            <span className="t"></span>
            <span className="c"></span>
          </div>
        </div>

        <div className="doc-body">
          <h2 className="doctitle">
            <span className="num">01</span> Project Quotation
          </h2>
          <div className="kv-grid">
            {CLIENT_FIELDS.map(([key, label]) => (
              <div className="kv-field" key={key}>
                <label>{label}</label>
                <StaticText>{state.client[key]}</StaticText>
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
              </tr>
            </thead>
            <tbody>
              {state.floors.map((f) => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 700 }}>{f.floor}</td>
                  <td style={{ whiteSpace: "pre-wrap" }}>{f.plan}</td>
                  <td style={{ fontWeight: 700, color: "var(--teal)" }}>{f.purpose}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-jetbrains-mono)" }}>{f.area}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan={3}>Total Slab Area</td>
                <td>{totals.totalArea}</td>
              </tr>
            </tfoot>
          </table>

          <h2 className="doctitle">
            <span className="num">03</span> Foundation Work Includes (Scope Assumptions)
          </h2>
          <StaticBlock>{state.foundationScope}</StaticBlock>

          <h2 className="doctitle">
            <span className="num">04</span> Specifications &amp; Materials
          </h2>
          <div>
            {state.specs.map((cat) => (
              <div className="spec-block" key={cat.id}>
                <div className="spec-head">
                  <span className="tag"></span>
                  {categoryIcon(cat.title) && <span className="icon">{categoryIcon(cat.title)}</span>}
                  <strong style={{ fontFamily: "var(--font-fraunces)", fontSize: 16 }}>{cat.title}</strong>
                </div>
                <div>
                  {cat.rows.map((row) => (
                    <div className="spec-row" key={row.id}>
                      <span style={{ flex: "0 0 34%", fontWeight: 600 }}>{row.item}</span>
                      <span style={{ flex: 1 }}>{row.spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h2 className="doctitle">
            <span className="num">05</span> Base Construction Cost
          </h2>
          <div className="cost-formula">
            <span>Rate</span>
            <strong>{state.baseRate}</strong>
            <span>/ sqft</span>
            <span className="eq">×</span>
            <span>{totals.totalArea}</span> sqft
            <span className="eq">=</span>
            <strong>{fmt(totals.baseCost)}</strong>
          </div>
          <h3 className="subhead">What This Rate Includes</h3>
          <StaticBlock>{state.costIncludes}</StaticBlock>

          <h2 className="doctitle">
            <span className="num">06</span> Client Requirement Cost Break-up
          </h2>
          <table className="doc-table">
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
                  <td style={{ fontWeight: 700 }}>{r.item}</td>
                  <td>{r.desc}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-jetbrains-mono)" }}>{fmt(r.cost)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan={2}>Additional Requirements Total</td>
                <td>{fmt(totals.reqTotal)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="grand-total-box">
            <div>
              <div className="label">Total Project Cost</div>
              <div className="persqft">{totals.totalArea ? `≈ ${fmt(totals.perSqft)} per sqft` : ""}</div>
            </div>
            <div className="value">{fmt(totals.grandTotal)}</div>
          </div>
          <p className="section-hint">Valid until {state.client.validity || "—"} — pricing may be revised after this date.</p>

          <h2 className="doctitle">
            <span className="num">07</span> Terms, Scope &amp; Process
          </h2>

          <h3 className="subhead">Included at No Extra Cost</h3>
          <StaticBlock>{state.terms.included}</StaticBlock>

          <h3 className="subhead">Specification Freeze &amp; Variation Policy</h3>
          <StaticBlock>{state.terms.freeze}</StaticBlock>

          <h3 className="subhead">Conditional Cost Adjustments</h3>
          <StaticBlock>{state.terms.adjust}</StaticBlock>

          <h3 className="subhead">Execution Process</h3>
          <StaticBlock>{state.terms.exec}</StaticBlock>

          <h3 className="subhead">Client Scope (Not Included)</h3>
          <StaticBlock>{state.terms.scope}</StaticBlock>

          <h2 className="doctitle">
            <span className="num">08</span> Design &amp; Execution Workflow (Post-Advance Payment)
          </h2>
          <StaticBlock>{state.workflow}</StaticBlock>

          <div className="footer-note">
            Issued by {state.client.issuedBy || ""}
            {state.client.parentCo ? ` · ${state.client.parentCo}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
