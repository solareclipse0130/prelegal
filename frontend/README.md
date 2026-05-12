# Mutual NDA Generator — frontend

A Next.js prototype for [PL-6](https://qq283646073qq.atlassian.net/browse/PL-6): a user fills in a small form and gets a completed Mutual Non-Disclosure Agreement they can preview and download.

The generated agreement is built on the [Common Paper Mutual NDA v1.0](https://commonpaper.com/standards/mutual-nda/1.0) template, distributed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The source template Markdown lives in `../templates/` (added in PL-5) and is the single source of truth for the Standard Terms.

## Setup

```bash
cd frontend
npm install
```

## Develop

```bash
npm run dev
# open http://localhost:3000
```

## Build & run

```bash
npm run build
npm run start
```

Run all commands from inside the `frontend/` directory — `app/page.tsx` reads `../templates/Mutual-NDA.md` relative to the working directory at build time.

## How it works

- `app/page.tsx` — Server Component. Reads `../templates/Mutual-NDA.md` via `fs`, passes the raw markdown to the client `<Generator>`.
- `components/Generator.tsx` — Client. Holds the form state.
- `lib/assembleMnda.ts` — Rebuilds the Cover Page from form values and concatenates the Standard Terms.
- `components/PreviewPanel.tsx` — Renders the assembled markdown to HTML with `marked`. "Download Markdown" emits an `.md` Blob; "Download PDF" dynamically imports `html2pdf.js` and rasterizes the preview to PDF.

User-provided field values are HTML-escaped before being inlined into the assembled markdown, so the preview is safe even with arbitrary input.

## Known limitations (prototype)

- The PDF is canvas-rasterized (text is not selectable). For higher-fidelity output we'd render server-side with a real PDF engine.
- No form validation beyond `<input type="number" min={1}>` and required-by-shape defaults. Missing fields render as italic placeholders in the preview.
- Only the Mutual NDA template is wired up; the broader `templates/` catalog is not exposed yet.
