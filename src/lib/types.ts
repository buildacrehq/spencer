export type Purpose = "OWN" | "RENT";

export interface ClientInfo {
  name: string;
  place: string;
  location: string;
  khatha: string;
  siteDim: string;
  roadFacing: string;
  setback: string;
  soilCarting: string;
  startDate: string;
  quoteDate: string;
  validity: string;
  issuedBy: string;
  parentCo: string;
}

export interface FloorRow {
  id: string;
  floor: string;
  plan: string;
  purpose: Purpose;
  area: number;
}

export interface SpecRow {
  id: string;
  item: string;
  spec: string;
}

export interface SpecCategory {
  id: string;
  title: string;
  rows: SpecRow[];
}

export interface RequirementRow {
  id: string;
  item: string;
  desc: string;
  cost: number;
}

export interface Terms {
  freeze: string;
  adjust: string;
  exec: string;
  scope: string;
  included: string;
}

export interface QuoteState {
  client: ClientInfo;
  companyIntro: string;
  companyAbout: string;
  floors: FloorRow[];
  baseRate: number;
  foundationScope: string;
  costIncludes: string;
  specs: SpecCategory[];
  requirements: RequirementRow[];
  terms: Terms;
  workflow: string;
}
