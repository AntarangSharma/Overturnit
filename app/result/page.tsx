"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResultCard from "@/components/ResultCard";
import type { OverturnResultT } from "@/lib/schema";

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<OverturnResultT | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("overturnit:result");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!data) {
    return (
      <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-teal-50 via-emerald-50 to-slate-50">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-teal-300 border-t-teal-700" />
          <p className="text-sm text-slate-600">Loading your appeal…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="grain relative flex-1 overflow-hidden text-slate-900">
      {/* Base gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 bg-gradient-to-br from-teal-50 via-emerald-50/60 to-slate-50"
      />
      {/* Dot grid */}
      <div
        aria-hidden
        className="bg-dotgrid pointer-events-none absolute inset-0 -z-20 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      {/* Drifting orbs */}
      <div
        aria-hidden
        className="drift-a pointer-events-none absolute -top-32 -right-32 -z-10 h-[480px] w-[480px] rounded-full bg-teal-300/40 blur-3xl"
      />
      <div
        aria-hidden
        className="drift-b pointer-events-none absolute top-1/2 -left-40 -z-10 h-[420px] w-[420px] rounded-full bg-emerald-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="drift-c pointer-events-none absolute -bottom-32 right-1/4 -z-10 h-[360px] w-[360px] rounded-full bg-cyan-200/30 blur-3xl"
      />

      {/* Side decorations on wide screens */}
      <ResultSideAccents />

      <ResultCard data={data} />
    </main>
  );
}

function ResultSideAccents() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
      {/* Watermarks */}
      <div className="absolute right-[-1rem] top-[6%] select-none text-[12rem] font-black leading-none tracking-tighter text-emerald-900/[0.045]">
        ✓
      </div>
      <div className="absolute left-[-1rem] bottom-[8%] select-none text-[10rem] font-black leading-none tracking-tighter text-teal-900/[0.05]">
        §
      </div>
      <div className="absolute left-[8%] top-[4%] select-none text-[5rem] font-black leading-none tracking-tighter text-amber-900/[0.06]">
        ⚖
      </div>
      <div className="absolute right-[12%] bottom-[6%] select-none font-mono text-[5rem] font-black leading-none text-rose-900/[0.06]">
        180
      </div>

      {/* Top-row stamps */}
      <div className="absolute left-[10%] top-[2%] -rotate-12 rounded-md border-2 border-emerald-500/70 bg-white/60 px-3 py-1 font-mono text-xs font-black uppercase tracking-widest text-emerald-700/80 shadow-sm">
        Approved
      </div>
      <div className="absolute right-[14%] top-[3%] rotate-6 rounded-md border-2 border-teal-500/70 bg-white/60 px-3 py-1 font-mono text-xs font-black uppercase tracking-widest text-teal-700/80 shadow-sm">
        Cited
      </div>

      {/* Left chips — citations, statutes, sources */}
      <div className="absolute left-[3%] top-[10%] -rotate-3 rounded-xl border border-teal-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">Citation</div>
        <div className="font-mono text-sm font-bold text-slate-900">29 CFR §2560.503-1</div>
        <div className="mt-0.5 text-[11px] text-slate-600">Full & fair review</div>
      </div>
      <div className="absolute left-[6%] top-[22%] rotate-2 w-[180px] rounded-xl border border-slate-200 bg-white/75 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Anonymous · CA</div>
        <div className="mt-0.5 text-[11px] italic leading-snug text-slate-700">&ldquo;Filed the draft as-is. Approved in 9 days.&rdquo;</div>
      </div>
      <div className="absolute left-[3%] top-[34%] rotate-2 rounded-xl border border-emerald-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Statute</div>
        <div className="font-mono text-sm font-bold text-slate-900">29 USC §1185d</div>
        <div className="mt-0.5 text-[11px] text-slate-600">ACA appeals authority</div>
      </div>
      {/* Mini bar chart */}
      <div className="absolute left-[5%] top-[46%] -rotate-2 w-[160px] rounded-xl border border-slate-200 bg-white/80 p-2.5 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Reversal by step</div>
        <div className="mt-2 flex items-end gap-1.5 h-10">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-5 rounded-t bg-amber-400" style={{ height: "30%" }} />
            <div className="text-[9px] font-mono text-slate-500">Int.</div>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-5 rounded-t bg-emerald-500" style={{ height: "70%" }} />
            <div className="text-[9px] font-mono text-slate-500">Ext.</div>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-5 rounded-t bg-teal-600" style={{ height: "92%" }} />
            <div className="text-[9px] font-mono text-slate-500">Lit.</div>
          </div>
          <div className="ml-2 self-start text-[10px] font-bold text-emerald-700">62%</div>
        </div>
      </div>
      <div className="absolute left-[2%] top-[60%] -rotate-2 rounded-xl border border-cyan-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-700">CA DMHC</div>
        <div className="font-mono text-sm font-bold text-slate-900">IMR · Free</div>
        <div className="mt-0.5 text-[11px] text-slate-600">6 months to file</div>
      </div>
      <div className="absolute left-[6%] top-[74%] rotate-3 rounded-xl border border-slate-200 bg-white/75 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Doc requests</div>
        <div className="font-mono text-sm font-bold text-slate-900">+4 attached</div>
      </div>
      <div className="absolute left-[3%] top-[86%] -rotate-3 rounded-xl border border-violet-200 bg-white/75 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">Medicaid</div>
        <div className="font-mono text-sm font-bold text-slate-900">42 CFR §431</div>
      </div>

      {/* Right chips */}
      <div className="absolute right-[3%] top-[14%] rotate-3 rounded-xl border border-amber-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Deadline</div>
        <div className="font-mono text-sm font-bold text-slate-900">180 DAYS</div>
        <div className="mt-0.5 text-[11px] text-slate-600">Internal appeal</div>
      </div>
      <div className="absolute right-[5%] top-[26%] -rotate-2 w-[180px] rounded-xl border border-slate-200 bg-white/75 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Anonymous · TX</div>
        <div className="mt-0.5 text-[11px] italic leading-snug text-slate-700">&ldquo;Took the deadlines list to my HR. They handled it.&rdquo;</div>
      </div>
      <div className="absolute right-[5%] top-[40%] -rotate-3 rounded-xl border border-violet-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">External</div>
        <div className="font-mono text-sm font-bold text-slate-900">IRO Review</div>
        <div className="mt-0.5 text-[11px] text-slate-600">Independent · binding</div>
      </div>
      {/* Mini progress card */}
      <div className="absolute right-[6%] top-[54%] rotate-2 w-[160px] rounded-xl border border-slate-200 bg-white/80 p-2.5 shadow-md backdrop-blur">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 40 40" className="h-9 w-9 -rotate-90" aria-hidden>
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgb(226 232 240)" strokeWidth="5" />
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="rgb(20 184 166)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - 0.74)}`}
            />
          </svg>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Confidence</div>
            <div className="font-mono text-sm font-bold text-teal-700">74%</div>
          </div>
        </div>
      </div>
      <div className="absolute right-[2%] top-[68%] rotate-2 rounded-xl border border-rose-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">Win rate</div>
        <div className="font-mono text-sm font-bold text-emerald-700">62% reversed</div>
        <div className="mt-0.5 text-[11px] text-slate-600">Internal appeals</div>
      </div>
      <div className="absolute right-[4%] top-[82%] -rotate-2 rounded-xl border border-slate-200 bg-white/75 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Avg. recovery</div>
        <div className="font-mono text-base font-bold text-emerald-700">$2,400</div>
      </div>
    </div>
  );
}
