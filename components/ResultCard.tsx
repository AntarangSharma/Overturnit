"use client";

import { useState } from "react";
import type { OverturnResultT } from "@/lib/schema";

function gaugeColor(p: number) {
  if (p >= 70) return "text-emerald-600";
  if (p >= 40) return "text-amber-600";
  return "text-red-600";
}

export default function ResultCard({ data }: { data: OverturnResultT }) {
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  async function copyLetter() {
    await navigator.clipboard.writeText(data.appeal_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function downloadPdf() {
    setPdfBusy(true);
    try {
      const [{ pdf }, { AppealPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./AppealPDF"),
      ]);
      const blob = await pdf(<AppealPDF letter={data.appeal_letter} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "OverturnIt-Appeal.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: download as .txt
      const blob = new Blob([data.appeal_letter], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "OverturnIt-Appeal.txt";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setPdfBusy(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-5 py-10">
      <header>
        <a href="/" className="text-sm font-medium text-teal-700 hover:underline">
          ← New appeal
        </a>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {data.denial_reason}
        </h1>
      </header>

      {/* Gauge */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Appeal Strength Score
        </p>
        <div className={`mt-2 text-7xl font-bold tabular-nums ${gaugeColor(data.win_probability)}`}>
          {Math.round(data.win_probability)}
          <span className="text-3xl text-slate-400">/100</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Confidence in this estimate: {Math.round(data.confidence)}%
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {data.win_reasons.map((r, i) => (
            <li
              key={i}
              className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-800 ring-1 ring-teal-200"
            >
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Rules */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">What went wrong (and why you can appeal)</h2>
        <ul className="mt-4 space-y-4">
          {data.applicable_rules.map((rule) => (
            <li key={rule.id} className="border-l-2 border-teal-600 pl-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-mono text-white">
                  {rule.id}
                </span>
                <span className="text-sm font-semibold text-slate-900">{rule.name}</span>
              </div>
              <p className="mt-1 text-sm text-slate-700">{rule.why}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Letter */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Your appeal letter (drafted)</h2>
          <div className="flex gap-2">
            <button
              onClick={copyLetter}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
            <button
              onClick={downloadPdf}
              disabled={pdfBusy}
              className="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {pdfBusy ? "Building…" : "Download PDF"}
            </button>
          </div>
        </div>
        <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-900 ring-1 ring-slate-200">
{data.appeal_letter}
        </pre>
      </section>

      {/* Deadlines */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Deadlines & next steps</h2>
        <ol className="mt-4 space-y-3">
          {data.deadlines.map((d, i) => {
            const overdue = d.by_date < today;
            return (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{d.action}</p>
                  <p className="text-xs text-slate-500">Source: {d.source}</p>
                </div>
                <span
                  className={
                    "rounded-md px-2 py-0.5 text-sm font-mono " +
                    (overdue
                      ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                      : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200")
                  }
                >
                  {d.by_date}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Red flags */}
      {data.red_flags?.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-amber-900">Red flags</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900">
            {data.red_flags.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </section>
      )}

      {/* Share */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-700">
          Know someone fighting a denial? Send them OverturnIt.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              "75% of health-insurance appeals win, but <1% are filed. OverturnIt drafts yours in 60 seconds:"
            )}&url=${encodeURIComponent("https://overturnit.vercel.app")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Share on X
          </a>
          <a
            href={`sms:?&body=${encodeURIComponent(
              "If you ever get a denial letter from your insurance, paste it into https://overturnit.vercel.app — it drafts the appeal."
            )}`}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Send via SMS
          </a>
        </div>
      </section>

      <p className="text-xs leading-relaxed text-slate-500">{data.disclaimer}</p>
    </div>
  );
}
