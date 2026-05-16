"use client";

import { useEffect, useRef, useState } from "react";
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
  const [showStickyBar, setShowStickyBar] = useState(false);
  const gaugeRef = useRef<HTMLElement | null>(null);
  const animatedScore = useCountUp(data.win_probability);

  useEffect(() => {
    const el = gaugeRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
  const refCode = (() => {
    let h = 0;
    for (const c of data.denial_reason) h = (h * 31 + c.charCodeAt(0)) | 0;
    return Math.abs(h).toString(36).slice(0, 6).toUpperCase().padEnd(6, "X");
  })();

  return (
    <div className="relative mx-auto max-w-3xl px-5 py-10">
      {/* Sticky condensed score bar */}
      <div
        className={`fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur transition-all duration-300 ${
          showStickyBar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-2.5">
          <div className="flex items-center gap-3">
            <div className={`text-xl font-bold tabular-nums leading-none ${gaugeColor(data.win_probability)}`}>
              {Math.round(data.win_probability)}<span className="text-xs text-slate-400">/100</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Appeal Strength</span>
              <span className="text-xs font-medium text-slate-800 line-clamp-1">{data.denial_reason.slice(0, 60)}{data.denial_reason.length > 60 ? "…" : ""}</span>
            </div>
          </div>
          <a href="/" className="text-xs font-medium text-teal-700 hover:underline">New appeal</a>
        </div>
      </div>

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
        ref={gaugeRef}
        className={`reveal mt-8 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-teal-900/[0.05] backdrop-blur ring-1 ${gaugeRing(data.win_probability)}`}
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Circular progress ring */}
          <div className="relative h-44 w-44 shrink-0">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-200"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - animatedScore / 100)}`}
                className={`${gaugeColor(data.win_probability)} transition-[stroke-dashoffset] duration-100`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold tabular-nums leading-none ${gaugeColor(data.win_probability)}`}>
                {Math.round(animatedScore)}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">/ 100</span>
            </div>
          </div>

          {/* Right: label + badge + confidence */}
          <div className="flex-1 min-w-[200px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Appeal Strength Score
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {data.win_probability >= 70
                ? "You have a strong case."
                : data.win_probability >= 40
                ? "This is worth filing."
                : "It's a steep climb."}
            </h2>
            <div className="mt-3">
              <ScoreBadge p={data.win_probability} />
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Confidence in this estimate: <span className="font-semibold text-slate-700">{Math.round(data.confidence)}%</span>
            </p>
          </div>
        </div>

        <ul className="mt-6 grid gap-2">
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
        className="reveal mt-6 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur"
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

        {/* Faux letterhead container */}
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-300 bg-white shadow-inner">
          <div className="flex items-center justify-between border-b-2 border-double border-slate-800 bg-gradient-to-r from-slate-50 to-white px-5 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-700 text-base font-black text-white">O</div>
              <div>
                <div className="text-sm font-bold tracking-tight text-slate-900">OverturnIt — Appeal Draft</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Generated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              </div>
            </div>
            <div className="hidden sm:block rounded-md border border-slate-300 bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-600">
              Ref / {refCode}
            </div>
          </div>
          <pre className="relative max-h-[480px] overflow-auto whitespace-pre-wrap bg-[linear-gradient(transparent_31px,rgba(15,118,110,0.06)_32px)] bg-[size:100%_32px] p-5 pl-10 font-mono text-sm leading-8 text-slate-900">
{data.appeal_letter}
          </pre>
        </div>
      </section>

      {/* Deadlines — visual timeline */}
      <section
        className="reveal mt-6 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur"
        style={{ animationDelay: "300ms" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Deadlines & next steps</h2>
          <span className="text-xs font-medium text-slate-500">{data.deadlines.length} action{data.deadlines.length === 1 ? "" : "s"}</span>
        </div>

        <ol className="relative mt-5">
          {/* Vertical track */}
          <div aria-hidden className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-teal-400 via-amber-400 to-rose-400" />
          {[...data.deadlines]
            .sort((a, b) => a.by_date.localeCompare(b.by_date))
            .map((d, i) => {
              const overdue = d.by_date < today;
              const days = Math.round((new Date(d.by_date).getTime() - new Date(today).getTime()) / 86400000);
              return (
                <li key={i} className="relative mb-5 pl-10 last:mb-0">
                  {/* Node dot */}
                  <span
                    className={
                      "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white " +
                      (overdue
                        ? "bg-rose-500"
                        : days <= 14
                        ? "bg-amber-500"
                        : "bg-emerald-500")
                    }
                    aria-hidden
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="text-sm font-semibold text-slate-900">{d.action}</p>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={
                          "rounded-md px-2 py-0.5 font-mono text-xs " +
                          (overdue
                            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                            : days <= 14
                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                            : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200")
                        }
                      >
                        {d.by_date}
                      </span>
                      <span
                        className={
                          "text-[11px] font-medium " +
                          (overdue ? "text-rose-700" : "text-slate-500")
                        }
                      >
                        {overdue
                          ? `${Math.abs(days)}d overdue`
                          : days === 0
                          ? "today"
                          : `in ${days}d`}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{d.source}</p>
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
