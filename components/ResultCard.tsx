"use client";

import { useEffect, useState } from "react";
import type { OverturnResultT } from "@/lib/schema";

function gaugeColor(p: number) {
  if (p >= 70) return "text-emerald-600";
  if (p >= 40) return "text-amber-600";
  return "text-red-600";
}

function gaugeRing(p: number) {
  if (p >= 70) return "ring-emerald-200 bg-emerald-50/40";
  if (p >= 40) return "ring-amber-200 bg-amber-50/40";
  return "ring-red-200 bg-red-50/40";
}

function useCountUp(target: number, ms = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

export default function ResultCard({ data }: { data: OverturnResultT }) {
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const animatedScore = useCountUp(data.win_probability);

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
    <div className="relative mx-auto max-w-3xl px-5 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-teal-50/40 via-transparent to-transparent"
      />

      <header className="reveal" style={{ animationDelay: "0ms" }}>
        <a href="/" className="text-sm font-medium text-teal-700 hover:underline">
          ← New appeal
        </a>
        <h1 className="mt-3 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {data.denial_reason}
        </h1>
      </header>

      {/* Gauge */}
      <section
        className={`reveal mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ${gaugeRing(data.win_probability)}`}
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Appeal Strength Score
            </p>
            <div className={`mt-2 text-7xl font-bold tabular-nums leading-none ${gaugeColor(data.win_probability)}`}>
              {Math.round(animatedScore)}
              <span className="text-3xl text-slate-400">/100</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Confidence in this estimate: {Math.round(data.confidence)}%
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <ScoreBadge p={data.win_probability} />
          </div>
        </div>
        <ul className="mt-6 grid gap-2 sm:grid-cols-1">
          {data.win_reasons.map((r, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg bg-teal-50/70 px-3 py-2 text-sm text-teal-900 ring-1 ring-teal-200"
            >
              <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Rules */}
      <section
        className="reveal mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        style={{ animationDelay: "140ms" }}
      >
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
      <section
        className="reveal mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        style={{ animationDelay: "220ms" }}
      >
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
              className="rounded-md bg-gradient-to-br from-teal-700 to-teal-800 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:shadow-md disabled:opacity-60"
            >
              {pdfBusy ? "Building…" : "Download PDF"}
            </button>
          </div>
        </div>
        <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-900 ring-1 ring-slate-200">
{data.appeal_letter}
        </pre>
      </section>

      {/* Deadlines */}
      <section
        className="reveal mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        style={{ animationDelay: "300ms" }}
      >
        <h2 className="text-lg font-semibold">Deadlines & next steps</h2>
        <ol className="mt-4 space-y-3">
          {data.deadlines.map((d, i) => {
            const overdue = d.by_date < today;
            return (
              <li
                key={i}
                className="flex flex-wrap items-baseline justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0"
              >
                <div className="min-w-0">
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
        <section
          className="reveal mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6"
          style={{ animationDelay: "380ms" }}
        >
          <h2 className="text-lg font-semibold text-amber-900">Red flags</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900">
            {data.red_flags.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </section>
      )}

      {/* Share */}
      <section
        className="reveal mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
        style={{ animationDelay: "460ms" }}
      >
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

      <p className="mt-8 text-xs leading-relaxed text-slate-500">{data.disclaimer}</p>
    </div>
  );
}

function ScoreBadge({ p }: { p: number }) {
  if (p >= 70)
    return (
      <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        Strong case
      </span>
    );
  if (p >= 40)
    return (
      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        Worth filing
      </span>
    );
  return (
    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
      Steep climb
    </span>
  );
}
