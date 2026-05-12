"use client";

import type { FormData, Party } from "@/lib/types";

type Props = {
  form: FormData;
  onChange: (next: FormData) => void;
};

function update<K extends keyof FormData>(
  form: FormData,
  key: K,
  value: FormData[K]
): FormData {
  return { ...form, [key]: value };
}

function updateParty(
  form: FormData,
  slot: "party1" | "party2",
  key: keyof Party,
  value: string
): FormData {
  return { ...form, [slot]: { ...form[slot], [key]: value } };
}

export default function FormPanel({ form, onChange }: Props) {
  return (
    <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">Agreement details</h2>
        <p className="text-xs text-slate-500">
          Fields shown in <em>italics</em> in the preview are still missing values.
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Purpose</legend>
        <textarea
          className="w-full rounded border border-slate-300 p-2 text-sm"
          rows={2}
          value={form.purpose}
          onChange={(e) => onChange(update(form, "purpose", e.target.value))}
        />
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Effective Date</span>
          <input
            type="date"
            className="w-full rounded border border-slate-300 p-2 text-sm"
            value={form.effectiveDate}
            onChange={(e) =>
              onChange(update(form, "effectiveDate", e.target.value))
            }
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Governing Law (state)</span>
          <input
            type="text"
            className="w-full rounded border border-slate-300 p-2 text-sm"
            value={form.governingLaw}
            onChange={(e) =>
              onChange(update(form, "governingLaw", e.target.value))
            }
          />
        </label>
        <label className="space-y-1 text-sm sm:col-span-2">
          <span className="font-medium">
            Jurisdiction (city/county and state)
          </span>
          <input
            type="text"
            className="w-full rounded border border-slate-300 p-2 text-sm"
            value={form.jurisdiction}
            onChange={(e) =>
              onChange(update(form, "jurisdiction", e.target.value))
            }
          />
        </label>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">MNDA Term</legend>
        <label className="flex flex-wrap items-center gap-2 text-sm">
          <input
            type="radio"
            name="mndaTerm"
            checked={form.mndaTerm === "fixed"}
            onChange={() => onChange(update(form, "mndaTerm", "fixed"))}
          />
          <span>Expires after</span>
          <input
            type="number"
            min={1}
            step={1}
            className="w-16 rounded border border-slate-300 p-1 text-sm disabled:bg-slate-100"
            value={form.mndaTermYears}
            disabled={form.mndaTerm !== "fixed"}
            onChange={(e) =>
              onChange(update(form, "mndaTermYears", Number(e.target.value)))
            }
          />
          <span>year(s) from Effective Date</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mndaTerm"
            checked={form.mndaTerm === "until_terminated"}
            onChange={() =>
              onChange(update(form, "mndaTerm", "until_terminated"))
            }
          />
          <span>Continues until terminated</span>
        </label>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Term of Confidentiality</legend>
        <label className="flex flex-wrap items-center gap-2 text-sm">
          <input
            type="radio"
            name="confTerm"
            checked={form.confidentialityTerm === "fixed"}
            onChange={() =>
              onChange(update(form, "confidentialityTerm", "fixed"))
            }
          />
          <span>Protected for</span>
          <input
            type="number"
            min={1}
            step={1}
            className="w-16 rounded border border-slate-300 p-1 text-sm disabled:bg-slate-100"
            value={form.confidentialityTermYears}
            disabled={form.confidentialityTerm !== "fixed"}
            onChange={(e) =>
              onChange(
                update(
                  form,
                  "confidentialityTermYears",
                  Number(e.target.value)
                )
              )
            }
          />
          <span>year(s) (trade secrets last longer)</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="confTerm"
            checked={form.confidentialityTerm === "perpetuity"}
            onChange={() =>
              onChange(update(form, "confidentialityTerm", "perpetuity"))
            }
          />
          <span>In perpetuity</span>
        </label>
      </fieldset>

      <PartyFields label="Party 1" slot="party1" form={form} onChange={onChange} />
      <PartyFields label="Party 2" slot="party2" form={form} onChange={onChange} />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          MNDA Modifications (optional)
        </legend>
        <textarea
          className="w-full rounded border border-slate-300 p-2 text-sm"
          rows={3}
          placeholder="List any modifications to the MNDA"
          value={form.modifications}
          onChange={(e) =>
            onChange(update(form, "modifications", e.target.value))
          }
        />
      </fieldset>
    </section>
  );
}

function PartyFields({
  label,
  slot,
  form,
  onChange,
}: {
  label: string;
  slot: "party1" | "party2";
  form: FormData;
  onChange: (next: FormData) => void;
}) {
  const party = form[slot];
  return (
    <fieldset className="space-y-2 rounded border border-slate-200 p-3">
      <legend className="px-1 text-sm font-medium">{label}</legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          className="rounded border border-slate-300 p-2 text-sm"
          placeholder="Company"
          value={party.company}
          onChange={(e) =>
            onChange(updateParty(form, slot, "company", e.target.value))
          }
        />
        <input
          className="rounded border border-slate-300 p-2 text-sm"
          placeholder="Print Name"
          value={party.name}
          onChange={(e) =>
            onChange(updateParty(form, slot, "name", e.target.value))
          }
        />
        <input
          className="rounded border border-slate-300 p-2 text-sm"
          placeholder="Title"
          value={party.title}
          onChange={(e) =>
            onChange(updateParty(form, slot, "title", e.target.value))
          }
        />
        <input
          className="rounded border border-slate-300 p-2 text-sm"
          placeholder="Notice Address (email or postal)"
          value={party.address}
          onChange={(e) =>
            onChange(updateParty(form, slot, "address", e.target.value))
          }
        />
      </div>
    </fieldset>
  );
}
