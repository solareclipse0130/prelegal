import type { FormData } from "./types";

const SOURCE_URL = "https://commonpaper.com/standards/mutual-nda/1.0";

const INTRO_PARAGRAPH = `This Mutual Non-Disclosure Agreement (the "MNDA") consists of: (1) this Cover Page and (2) the Common Paper Mutual NDA Standard Terms Version 1.0, identical to those posted at ${SOURCE_URL}. Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeInline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, " ");
}

function escapeCell(value: string): string {
  return escapeInline(value).replace(/\|/g, "\\|");
}

function valueOrPlaceholder(
  value: string,
  label: string,
  escape: (v: string) => string = escapeHtml
): string {
  const trimmed = value.trim();
  return trimmed === "" ? `_${label}_` : escape(trimmed);
}

function yearsOrPlaceholder(value: number): string | null {
  if (!Number.isFinite(value) || value < 1) return null;
  return String(Math.floor(value));
}

function mndaTermClause(form: FormData): string {
  if (form.mndaTerm === "until_terminated") {
    return "Continues until terminated in accordance with the terms of the MNDA.";
  }
  const years = yearsOrPlaceholder(form.mndaTermYears);
  if (years === null) {
    return "Expires _N_ year(s) from the Effective Date.";
  }
  const unit = years === "1" ? "year" : "years";
  return `Expires ${years} ${unit} from the Effective Date.`;
}

function confidentialityClause(form: FormData): string {
  if (form.confidentialityTerm === "perpetuity") {
    return "In perpetuity.";
  }
  const years = yearsOrPlaceholder(form.confidentialityTermYears);
  if (years === null) {
    return "_N_ year(s) from the Effective Date, but in the case of trade secrets until the Confidential Information is no longer considered a trade secret under applicable laws.";
  }
  const unit = years === "1" ? "year" : "years";
  return `${years} ${unit} from the Effective Date, but in the case of trade secrets until the Confidential Information is no longer considered a trade secret under applicable laws.`;
}

function stripCoverPageLinks(standardTerms: string): string {
  return standardTerms.replace(
    /<span class="coverpage_link">([^<]+)<\/span>/g,
    "$1"
  );
}

function buildCoverPage(form: FormData): string {
  const p1 = form.party1;
  const p2 = form.party2;

  const modificationsSection =
    form.modifications.trim() === ""
      ? ""
      : `\n### MNDA Modifications\n${escapeHtml(form.modifications.trim())}\n`;

  return `# Mutual Non-Disclosure Agreement

${INTRO_PARAGRAPH}

## Cover Page

### Purpose
${valueOrPlaceholder(form.purpose, "Purpose")}

### Effective Date
${valueOrPlaceholder(form.effectiveDate, "Effective Date")}

### MNDA Term
${mndaTermClause(form)}

### Term of Confidentiality
${confidentialityClause(form)}

### Governing Law & Jurisdiction
Governing Law: ${valueOrPlaceholder(form.governingLaw, "Governing Law", escapeInline)}

Jurisdiction: ${valueOrPlaceholder(form.jurisdiction, "Jurisdiction", escapeInline)}
${modificationsSection}
By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.

|                 | PARTY 1                                                  | PARTY 2                                                  |
| :-------------- | :------------------------------------------------------- | :------------------------------------------------------- |
| Signature       |                                                          |                                                          |
| Print Name      | ${valueOrPlaceholder(p1.name, "Name", escapeCell)}       | ${valueOrPlaceholder(p2.name, "Name", escapeCell)}       |
| Title           | ${valueOrPlaceholder(p1.title, "Title", escapeCell)}     | ${valueOrPlaceholder(p2.title, "Title", escapeCell)}     |
| Company         | ${valueOrPlaceholder(p1.company, "Company", escapeCell)} | ${valueOrPlaceholder(p2.company, "Company", escapeCell)} |
| Notice Address  | ${valueOrPlaceholder(p1.address, "Address", escapeCell)} | ${valueOrPlaceholder(p2.address, "Address", escapeCell)} |
| Date            |                                                          |                                                          |
`;
}

export function assembleMnda(
  form: FormData,
  templates: { standardTerms: string }
): string {
  const coverPage = buildCoverPage(form).trim();
  const standardTerms = stripCoverPageLinks(templates.standardTerms).trim();
  return `${coverPage}\n\n${standardTerms}\n`;
}
