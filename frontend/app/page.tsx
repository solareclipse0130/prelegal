import fs from "node:fs";
import path from "node:path";
import Generator from "@/components/Generator";

function readTemplate(name: string): string {
  const repoRoot = path.resolve(process.cwd(), "..");
  const filePath = path.join(repoRoot, "templates", name);
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to read MNDA template at '${filePath}'. ` +
        `Run 'next build' / 'next dev' from the 'frontend/' directory ` +
        `(current cwd: '${process.cwd()}'). Original error: ${message}`
    );
  }
}

export default function Page() {
  const standardTerms = readTemplate("Mutual-NDA.md");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Mutual NDA Generator
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Prototype generator built on the Common Paper Mutual NDA (CC BY 4.0).
          Fill in the form, preview the agreement, then download it.
        </p>
      </header>
      <Generator standardTerms={standardTerms} />
      <footer className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-500">
        Mutual NDA text © Common Paper, Inc., distributed under{" "}
        <a
          className="underline"
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC BY 4.0
        </a>
        .
      </footer>
    </main>
  );
}
