"use client";

import { useMemo, useRef, useState } from "react";
import { marked } from "marked";

type Props = {
  markdown: string;
};

function downloadBlob(content: string, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function PreviewPanel({ markdown }: Props) {
  const docRef = useRef<HTMLDivElement>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  const html = useMemo(
    () => marked.parse(markdown, { async: false }),
    [markdown]
  );

  async function handleDownloadPdf() {
    if (!docRef.current || pdfBusy) return;
    setPdfBusy(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: [12, 12, 12, 12],
          filename: "mutual-nda.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(docRef.current)
        .save();
    } finally {
      setPdfBusy(false);
    }
  }

  function handleDownloadMd() {
    downloadBlob(markdown, "text/markdown;charset=utf-8", "mutual-nda.md");
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
            onClick={handleDownloadMd}
          >
            Download Markdown
          </button>
          <button
            type="button"
            className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            disabled={pdfBusy}
            onClick={handleDownloadPdf}
          >
            {pdfBusy ? "Generating PDF…" : "Download PDF"}
          </button>
        </div>
      </div>
      <div
        ref={docRef}
        className="prose prose-slate max-w-none rounded border border-slate-200 bg-white p-6 text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
