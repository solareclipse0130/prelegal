export type Party = {
  company: string;
  name: string;
  title: string;
  address: string;
};

export type TermMode = "fixed" | "until_terminated";
export type ConfidentialityMode = "fixed" | "perpetuity";

export type FormData = {
  purpose: string;
  effectiveDate: string;
  mndaTerm: TermMode;
  mndaTermYears: number;
  confidentialityTerm: ConfidentialityMode;
  confidentialityTermYears: number;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: Party;
  party2: Party;
};

export const DEFAULT_FORM: FormData = {
  purpose:
    "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: "",
  mndaTerm: "fixed",
  mndaTermYears: 1,
  confidentialityTerm: "fixed",
  confidentialityTermYears: 1,
  governingLaw: "Delaware",
  jurisdiction: "New Castle, DE",
  modifications: "",
  party1: { company: "", name: "", title: "", address: "" },
  party2: { company: "", name: "", title: "", address: "" },
};
