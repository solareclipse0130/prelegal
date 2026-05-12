"use client";

import { useEffect, useMemo, useState } from "react";
import { assembleMnda } from "@/lib/assembleMnda";
import { DEFAULT_FORM, type FormData } from "@/lib/types";
import FormPanel from "./FormPanel";
import PreviewPanel from "./PreviewPanel";

type Props = {
  standardTerms: string;
};

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Generator({ standardTerms }: Props) {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);

  useEffect(() => {
    setForm((prev) =>
      prev.effectiveDate ? prev : { ...prev, effectiveDate: todayIso() }
    );
  }, []);

  const markdown = useMemo(
    () => assembleMnda(form, { standardTerms }),
    [form, standardTerms]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <FormPanel form={form} onChange={setForm} />
      <PreviewPanel markdown={markdown} />
    </div>
  );
}
