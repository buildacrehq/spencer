// Data functions ported verbatim from legacy/buildacre-quotation-builder.html
// (sampleState / blankState / sampleStateKiran) — see legacy/buildacre-quotation-builder-HANDOFF.md
import type { QuoteState } from "./types";

let uidCounter = 1;
export const uid = () => "r" + (uidCounter++);

export function sampleState(): QuoteState {
  return {
    client:{
      name:"Mr Ranjith R", place:"Bengaluru", location:"Mango Acres (Begur Koppa Road)",
      khatha:"Panchayat Khatha", siteDim:"25 X 55", roadFacing:"East", setback:"1200 sqft after setback",
      soilCarting:"Yes", startDate:"2026-08-01", quoteDate:"2026-07-15",
      issuedBy:"BuildAcre Construction Company", parentCo:"BlackFyre Infra Private Limited", validity:"2026-07-30"
    },
    floors:[
      {id:uid(), floor:"Ground Floor", plan:"Parking + 2BHK (Kitchen + Hall + Pooja room + 2 Bedrooms with attached bathroom + Common washroom) + External stairs", purpose:"RENT", area:1200},
      {id:uid(), floor:"First Floor", plan:"3BHK (Kitchen + Dining + Pooja room + Hall + 2 Bedrooms with attached washrooms + 1 Bedroom + Common washroom) + External stairs", purpose:"OWN", area:1200},
      {id:uid(), floor:"Terrace Floor", plan:"Staircase headroom + OHT", purpose:"OWN", area:200},
    ],
    foundationScope:"Site Cleaning\nSite Survey\nSoil Testing\nArchitectural Design\nStructural Design\nElevation Design\nLabour shed Construction\nMarking using Total Station survey\n6 feet excavation (as per soil report)\n10–12 pillars (Isolated Footings)\nSump in RCC — 10,000 litres\nPlinth beam 1.5 to 2 feet height, 6 inch thickness\nFooting concreting\nSump concreting with waterproofing and bitumen coating\nPlinth concreting\nAnti-termite treatment (twice)\nSoil refilling and soil consolidation",
    baseRate:1951.92,
    costIncludes:"Architectural & structural services, dedicated Site Engineer, Project Manager, Project Coordinators, labour for curing, material safety, and regular WhatsApp progress updates.",
    specs:[
      {id:uid(), title:"Core Materials", rows:[
        {id:uid(), item:"Steel", spec:"Indus Fe 555 TMT high-strength bars"},
        {id:uid(), item:"Cement (OPC)", spec:"Birla Cement — 53 Grade"},
        {id:uid(), item:"Cement (OPC/PPC)", spec:"UltraTech Cement — 43 Grade"},
        {id:uid(), item:"Plumbing Pipes", spec:"CPVC — Ashirvad / Supreme"},
        {id:uid(), item:"Electrical Wires", spec:"Finolex, fire-resistant"},
        {id:uid(), item:"Switches & Sockets", spec:"Anchor by Panasonic / GM Modular"},
      ]},
      {id:uid(), title:"Design & Drawings", rows:[
        {id:uid(), item:"Site Cleaning", spec:"Initial site cleaning before design & construction activities begin"},
        {id:uid(), item:"Site Survey", spec:"Detailed site measurements and level survey for accurate planning"},
        {id:uid(), item:"Soil Test", spec:"Soil investigation to determine bearing capacity and foundation suitability"},
        {id:uid(), item:"2D Architectural Drawings", spec:"Floor plans, layout drawings, working drawings of each floor, window & door drawings"},
        {id:uid(), item:"Structural Drawings", spec:"RCC design as per code — footing drawing, excavation layout, plinth layout, slab reinforcement, beam reinforcement, slab shuttering drawings, staircase details"},
        {id:uid(), item:"Electrical Drawings", spec:"Electrical layout including points, switches and lighting"},
        {id:uid(), item:"Plumbing Drawings", spec:"Water supply and drainage layout drawings"},
        {id:uid(), item:"3D Elevation", spec:"External 3D views as visible from adjacent roads only"},
        {id:uid(), item:"Design File Format", spec:"All drawings and designs provided in non-editable PDF format"},
      ]},
      {id:uid(), title:"Earthwork & Foundation", rows:[
        {id:uid(), item:"Foundation Type", spec:"Isolated footings"},
        {id:uid(), item:"Soil Bearing Capacity", spec:"180 kN/m² and above"},
        {id:uid(), item:"Foundation Depth", spec:"Up to 6 feet (as per soil report)"},
        {id:uid(), item:"Soil Condition", spec:"Regular soil assumed"},
        {id:uid(), item:"Note", spec:"Final depth subject to soil test (to be confirmed during meeting)"},
        {id:uid(), item:"Sump", spec:"10,000L RCC with waterproofing & bitumen coating"},
      ]},
      {id:uid(), title:"RCC & Masonry", rows:[
        {id:uid(), item:"Structural System", spec:"RCC framed structure"},
        {id:uid(), item:"Concrete Grade", spec:"M20 for footings, M25 for slabs"},
        {id:uid(), item:"Aggregates", spec:"20mm & 40mm aggregates; design mix as per structural designer"},
        {id:uid(), item:"Plinth", spec:"Height 1 ft 6 inch above existing ground level; PCC 100mm thick below ground-floor flooring"},
        {id:uid(), item:"Masonry", spec:"4-inch blocks internal, 6-inch blocks external"},
        {id:uid(), item:"Internal Plaster", spec:"15mm thick (1:5 cement mortar)"},
        {id:uid(), item:"Ceiling Plaster", spec:"15mm thick (1:4 cement mortar)"},
        {id:uid(), item:"External Plaster", spec:"20mm total thickness (1:5 first coat, 1:3 second coat)"},
        {id:uid(), item:"Chicken Mesh", spec:"At beam, column and masonry junctions and electrical chasing areas"},
        {id:uid(), item:"Waterproofing Compound", spec:"Fosroc / Sika Antisol or equivalent"},
        {id:uid(), item:"Epoxy Mortar", spec:"Used in washroom tile fixing"},
      ]},
      {id:uid(), title:"Kitchen", rows:[
        {id:uid(), item:"Wall Tiles", spec:"Up to 3 ft above counter — ₹80/sqft"},
        {id:uid(), item:"Kitchen Counter", spec:"2 ft width, 24mm granite"},
        {id:uid(), item:"Counter Edge", spec:"Double layer nosing with polishing — ₹200/sqft"},
        {id:uid(), item:"Kitchen Sink", spec:"Stainless steel single bowl — up to ₹10,000"},
        {id:uid(), item:"Kitchen Faucet", spec:"Up to ₹10,000 (Parryware / Hindware / Jaquar / Waterport)"},
        {id:uid(), item:"Water Purifier", spec:"Provision near sink"},
        {id:uid(), item:"Washing Machine", spec:"Inlet & outlet provision in utility"},
        {id:uid(), item:"Number of Kitchens", spec:"2"},
      ]},
      {id:uid(), title:"Bathroom", rows:[
        {id:uid(), item:"Wall Tiles", spec:"Up to ceiling height — ₹60/sqft"},
        {id:uid(), item:"Floor Tiles", spec:"Anti-skid tiles, up to ₹60/sqft"},
        {id:uid(), item:"Exhaust Fan", spec:"Provision included"},
        {id:uid(), item:"Tile Joints & Grouting", spec:"Spacer joints; polymeric grout (Roff / Weber or equivalent)"},
        {id:uid(), item:"Sanitary Fittings", spec:"Jaquar make — EWC, health faucet, wash basin, basin mixer, overhead shower with 2-in-1 wall mixer"},
        {id:uid(), item:"Plumbing Pipes", spec:"CPVC — Ashirvad / Supreme"},
        {id:uid(), item:"Sanitary Budget", spec:"₹35,000 per washroom × 6 washrooms = ₹2,10,000 total"},
        {id:uid(), item:"Bathroom Doors", spec:"Waterproof WPC flush doors"},
        {id:uid(), item:"External Pipes", spec:"Fixed with raised clamps"},
      ]},
      {id:uid(), title:"Doors & Windows", rows:[
        {id:uid(), item:"Timber Quality", spec:"Well seasoned, free from defects"},
        {id:uid(), item:"WPC Works", spec:"Two coats of paint"},
        {id:uid(), item:"Window Chajjas", spec:"1 ft projection, 6 inch bearing"},
        {id:uid(), item:"Windows", spec:"₹600/sqft incl. grills & fittings, ~260 sqft — Windows budget ₹1,56,000"},
        {id:uid(), item:"Main Door", spec:"Teak wood — ₹50,000 incl. fittings (own unit) + ₹30,000 (rental unit)"},
        {id:uid(), item:"Pooja Door", spec:"Teak wood — ₹20,000 incl. fittings × 2 units"},
        {id:uid(), item:"Internal Doors", spec:"Engineered wood — ₹10,000 each × 5 doors (Red Saal frame & vinyl doors)"},
        {id:uid(), item:"Utility Doors", spec:"WPC — ₹10,000 each × 3 doors"},
        {id:uid(), item:"Washroom Doors", spec:"WPC — ₹10,000 each × 6 doors"},
        {id:uid(), item:"Door Hardware", spec:"Hinges, tower bolts, locks, magnetic stopper (Europa / Godrej)"},
        {id:uid(), item:"Doors Budget", spec:"Total ₹2,60,000"},
      ]},
      {id:uid(), title:"Painting", rows:[
        {id:uid(), item:"Exterior Paint", spec:"1 coat Asian primer + 2 coats Ace exterior emulsion"},
        {id:uid(), item:"Interior Putty", spec:"2 coats JK Putty"},
        {id:uid(), item:"Interior Primer", spec:"1 coat"},
        {id:uid(), item:"Interior Paint", spec:"2 coats Asian Premium"},
      ]},
      {id:uid(), title:"Flooring", rows:[
        {id:uid(), item:"Living", spec:"Vitrified tiles — up to ₹100/sqft"},
        {id:uid(), item:"Dining / Kitchen", spec:"Vitrified tiles — up to ₹100/sqft"},
        {id:uid(), item:"Bedrooms", spec:"Vitrified tiles — up to ₹80/sqft"},
        {id:uid(), item:"Staircase", spec:"Anti-skid granite — up to ₹100/sqft"},
        {id:uid(), item:"Parking", spec:"Anti-skid tiles — up to ₹50/sqft"},
        {id:uid(), item:"Balconies & Open Areas", spec:"Anti-skid tiles — up to ₹50/sqft"},
        {id:uid(), item:"Skirting", spec:"Matching granite / tiles"},
      ]},
      {id:uid(), title:"Electrical", rows:[
        {id:uid(), item:"Electrical Wires", spec:"Fireproof wires — Finolex"},
        {id:uid(), item:"Switches & Sockets", spec:"Anchor / GM"},
        {id:uid(), item:"Electrical Points", spec:"As per approved electrical drawings"},
      ]},
      {id:uid(), title:"Technical Information", rows:[
        {id:uid(), item:"Footing Depth", spec:"Up to 6 feet (based on soil test)"},
        {id:uid(), item:"Footing Concreting", spec:"As per structural drawings"},
        {id:uid(), item:"Footing Width", spec:"As per structural design & site conditions"},
        {id:uid(), item:"Plinth Height", spec:"Minimum 1.5 feet above ground level"},
        {id:uid(), item:"Plinth Width", spec:"6 inches"},
        {id:uid(), item:"Concrete Grades", spec:"M20 (footing), M25 (slab)"},
        {id:uid(), item:"Concreting Method", spec:"RMC / Manual"},
        {id:uid(), item:"Cement for Concreting", spec:"UltraTech"},
        {id:uid(), item:"Reinforcement", spec:"16mm & 20mm for beams; 8mm, 10mm, 12mm, 16mm for slabs"},
        {id:uid(), item:"Anti-Termite Treatment", spec:"Included, applied twice"},
      ]},
    ],
    requirements:[
      {id:uid(), item:"CCTV Provision", desc:"2 connection points", cost:10000},
      {id:uid(), item:"CCTV Provision", desc:"1 onsite monitoring connection", cost:5000},
      {id:uid(), item:"UPS Provision", desc:"2 units", cost:20000},
      {id:uid(), item:"RCC Sump", desc:"10,000L, waterproofed & plastered", cost:130000},
      {id:uid(), item:"Overhead Tank", desc:"Extra 2000L triple-layer tank", cost:20000},
      {id:uid(), item:"Gas Pipeline", desc:"2 kitchens", cost:40000},
      {id:uid(), item:"Ramp from Plinth", desc:"", cost:30000},
      {id:uid(), item:"Screed Concreting", desc:"Level surface + waterproofing", cost:30000},
      {id:uid(), item:"EV Charging Point", desc:"2 points at parking", cost:20000},
      {id:uid(), item:"Lift Provision", desc:"5×5×6 shaft allowance", cost:95000},
      {id:uid(), item:"Sanitary Pits", desc:"2 pits", cost:30000},
      {id:uid(), item:"Elevation Work", desc:"1% of project cost", cost:50000},
    ],
    terms:{
      freeze:"Final architectural, structural, electrical and plumbing drawings will be frozen before execution. The quoted price is based on the specifications in this document. Any change requested after freeze will be treated as an upgradation, and the cost impact will be shared in writing before execution. Work proceeds only after client approval of the revised cost.",
      adjust:"If footing depth exceeds 6 feet based on soil test recommendations, additional cost will apply. Soil carting beyond 100 meters from site attracts additional charges. Any structural modification due to unforeseen site conditions may result in cost adjustment. Increase in slab area beyond 50 sq.ft will be calculated as per actuals. All cost impact will be discussed with the client and approved before execution.",
      exec:"1. Soil testing & site survey\n2. Concept design development\n3. Structural & service drawings\n4. Specification freeze\n5. Agreement signing\n6. Stage-wise execution & quality checks\n7. Final handover",
      scope:"Borewell & motor\nTemporary electrical board\nGovernment approvals (BBMP, Panchayat, etc.)\nWater supply\nRoad / tree cutting\n\nAlso managed by client (Nil — not included in this quotation):\nMain gate\nStaircase railing\nMS stairs for overhead tank\n\nNote: Assistance for the above client-scope items will be provided by the company.",
      included:"Parapet wall (4 ft height, terrace floor), weatherproofing course (Dr. Fixit / Fosroc or equivalent), anti-termite treatment (applied twice), compound wall (5 ft height, all four sides), cover blocks, chicken mesh & joint mesh at columns/electrical conduits/plumbing lines, ceiling height 10'6\" clearance with 6\" slab thickness, bathroom niches, chajjas (based on site inputs), solar point & geyser point, labour shed, overhead tank room (7 ft, sized for two tanks)."
    },
    workflow:"1. Client Coordinator Allocation — once the 2% advance is paid, a dedicated Client Coordinator is assigned to the project.\n2. Site Survey & Soil Testing (within 3–4 days) — scheduled within 3–4 working days.\n3. Survey Report Submission — handed over to the architect once ready.\n4. Welcome Meeting — with the Architect and Structural Engineer; Architect leads requirement gathering, Structural Engineer introduces themselves.\n5. First Drawing Submission (4 days) — first draft of floor plans shared within 4 working days after the requirement call.\n6. Design Iterations — each iteration turned around within 48 hours.\n7. Finalization of Floor Plan — Architect explains the final plan to the client; confirmation taken in the project WhatsApp group.\n8. Structural Drawings (7 days) — prepared and shared within 1 week of floor plan confirmation.\n9. Elevation Design (7 days) — theme references shared first to understand preferences; one elevation option shared within 7 days of structural drawing finalization.\n10. Project Execution Meeting (at office) — Project Manager, Structural Engineer, Architect and Site Engineer walk through the final design, structure and specifications; agreement signing.\n11. Change Requests During Execution — must be submitted in writing and approved by the Project Head / Execution Head; no verbal approvals accepted.\n12. Work Schedule — no construction or design activity on Sundays, except emergencies.\n13. Project Timeline — shared once the foundation is completed.\n14. Weekly Progress Meetings — Project Manager and Site Engineer conduct a weekly review (in person or Google Meet) covering progress and next week's plan."
  };
}

export function blankState(): QuoteState {
  const s = sampleState();
  s.client = {name:"",place:"",location:"",khatha:"",siteDim:"",roadFacing:"",setback:"",soilCarting:"",startDate:"",quoteDate:new Date().toISOString().slice(0,10),validity:"",issuedBy:"BuildAcre Construction Company",parentCo:"BlackFyre Infra Private Limited"};
  s.floors = [{id:uid(), floor:"Ground Floor", plan:"", purpose:"OWN", area:0}];
  s.baseRate = 0;
  s.requirements = [];
  return s;
}

export function sampleStateKiran(): QuoteState {
  const s = sampleState(); // shared boilerplate: foundation scope, materials, drawings,
                            // earthwork, RCC & masonry, painting, flooring, electrical,
                            // technical info, freeze/adjust/exec policy, workflow — all
                            // identical wording to the Ranjith quotation.
  s.client = {
    name:"Mr Kiran", place:"Bengaluru", location:"Nagarabhavi",
    khatha:"A Khatha", siteDim:"16 X 40", roadFacing:"North West Corner", setback:"600 sqft after setback",
    soilCarting:"Yes", startDate:"2026-07-14", quoteDate:"2026-07-14",
    issuedBy:"BuildAcre Construction Company", parentCo:"BlackFyre Infra Private Limited", validity:"2026-07-30"
  };
  s.floors = [
    {id:uid(), floor:"Ground Floor", plan:"Parking (considering 50% for built-up area)", purpose:"RENT", area:600},
    {id:uid(), floor:"First Floor", plan:"Duplex starts (Hall + Kitchen + 1 Common Washroom + 1 Pooja Room + Internal Staircase)", purpose:"OWN", area:600},
    {id:uid(), floor:"Second Floor", plan:"2 Bedrooms with 2 attached washrooms + Internal Staircase", purpose:"OWN", area:600},
    {id:uid(), floor:"Third Floor", plan:"Staircase headroom + 300 sqft Master Bedroom with attached washroom", purpose:"OWN", area:400},
  ];
  s.baseRate = 1967.36;

  // Kitchen — only 1 kitchen here (vs 2 for Ranjith)
  const kitchenCat = s.specs.find(c=>c.title==='Kitchen')!;
  kitchenCat.rows.find(r=>r.item==='Number of Kitchens')!.spec = "1";

  // Bathroom — 4 washrooms at ₹40,000 each (vs 6 at ₹35,000)
  const bathCat = s.specs.find(c=>c.title==='Bathroom')!;
  bathCat.rows.find(r=>r.item==='Sanitary Budget')!.spec = "₹40,000 per washroom × 4 washrooms = ₹1,60,000 total";

  // Doors & Windows — different counts, sizes and budgets for this project
  const doorsCat = s.specs.find(c=>c.title==='Doors & Windows')!;
  doorsCat.rows = [
    {id:uid(), item:"Timber Quality", spec:"Well seasoned, free from defects"},
    {id:uid(), item:"WPC Works", spec:"Two coats of paint"},
    {id:uid(), item:"Window Chajjas", spec:"1 ft projection, 6 inch bearing"},
    {id:uid(), item:"Windows", spec:"₹600/sqft incl. grills & fittings — Window area considered 400 sqft — Windows budget ₹2,40,000"},
    {id:uid(), item:"Main Door", spec:"Teak wood — ₹50,000 incl. fittings (1 unit, OWN)"},
    {id:uid(), item:"Pooja Door", spec:"Teak wood — ₹20,000 incl. fittings × 1 unit"},
    {id:uid(), item:"Internal Doors", spec:"Engineered wood — ₹10,000 each × 3 doors (Red Saal frame & vinyl doors)"},
    {id:uid(), item:"Utility Doors", spec:"WPC — ₹10,000 each × 1 door"},
    {id:uid(), item:"Washroom Doors", spec:"WPC — ₹10,000 each × 4 doors"},
    {id:uid(), item:"Door Hardware", spec:"Hinges, tower bolts, locks, magnetic stopper (Europa / Godrej)"},
    {id:uid(), item:"Doors Budget", spec:"Total ₹1,50,000"},
  ];

  // Client Requirement Cost Break-up — this project's mix differs a lot from Ranjith's:
  // Main Gate and MS Stairs are costed here (not client-managed Nil), Sump/OHT are Included
  // (not separately costed), and Lift Provision was assessed but marked NIL for this site.
  s.requirements = [
    {id:uid(), item:"CCTV Provision", desc:"2 connection points", cost:10000},
    {id:uid(), item:"CCTV Provision", desc:"1 onsite monitoring connection", cost:5000},
    {id:uid(), item:"UPS Provision", desc:"1 unit", cost:10000},
    {id:uid(), item:"Main Gate", desc:"MS gate, 6 ft height", cost:30000},
    {id:uid(), item:"Staircase Railing", desc:"MS railing ₹600/rft × 25 rft (₹15,000) + SS railing ₹1,200/rft × 50 rft (₹60,000)", cost:75000},
    {id:uid(), item:"Gas Pipeline", desc:"1 kitchen", cost:20000},
    {id:uid(), item:"Ramp from Plinth", desc:"", cost:30000},
    {id:uid(), item:"Screed Concreting", desc:"Level surface + waterproofing", cost:30000},
    {id:uid(), item:"EV Charging Point", desc:"2 points at parking", cost:20000},
    {id:uid(), item:"Lift Provision", desc:"5×5×6 shaft assessed — marked NIL / not applicable for this project", cost:0},
    {id:uid(), item:"Sanitary Pits", desc:"2 pits", cost:30000},
    {id:uid(), item:"MS Stairs for Overhead Tank", desc:"", cost:15000},
    {id:uid(), item:"Elevation Work", desc:"1% of project cost", cost:40000},
  ];

  s.terms.included = "BLOCK Sump (8,000L, plastered & waterproofed), overhead tank (1×2,000L triple-layer), parapet wall (4 ft, terrace floor), weatherproofing course (Dr. Fixit / Fosroc or equivalent), anti-termite treatment (applied twice), compound wall (5 ft height, four sides), cover blocks, chicken mesh & joint mesh at columns/electrical conduits/plumbing lines, ceiling height 10'6\" clearance with 6\" slab thickness, bathroom niches, chajjas (based on site inputs), solar point & geyser point, labour shed, overhead tank room (7 ft, sized for two tanks).";
  s.terms.scope = "Borewell & motor\nTemporary electrical board\nGovernment approvals (BBMP, Panchayat, etc.)\nWater supply\nRoad / tree cutting\n\nNote: Assistance for the above client-scope items will be provided by the company.";

  return s;
}
