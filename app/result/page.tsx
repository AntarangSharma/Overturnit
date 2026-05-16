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
      {/* Big watermark on right */}
      <div className="absolute right-[-1rem] top-[8%] select-none text-[12rem] font-black leading-none tracking-tighter text-emerald-900/[0.04]">
        ✓
      </div>
      {/* Stacked "evidence" chips - left */}
      <div className="absolute left-[3%] top-[10%] -rotate-3 rounded-xl border border-teal-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">Citation</div>
        <div className="font-mono text-sm font-bold text-slate-900">29 CFR §2560.503-1</div>
      </div>
      <div className="absolute left-[5%] top-[32%] rotate-2 rounded-xl border border-emerald-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Statute</div>
        <div className="font-mono text-sm font-bold text-slate-900">29 USC §1185d</div>
      </div>
      <div className="absolute left-[2%] top-[54%] -rotate-2 rounded-xl border border-cyan-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-700">CA DMHC</div>
        <div className="font-mono text-sm font-bold text-slate-900">IMR · Free</div>
      </div>
      {/* Right side chips */}
      <div className="absolute right-[3%] top-[18%] rotate-3 rounded-xl border border-amber-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Deadline</div>
        <div className="font-mono text-sm font-bold text-slate-900">180 DAYS</div>
      </div>
      <div className="absolute right-[5%] top-[42%] -rotate-3 rounded-xl border border-violet-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">External</div>
        <div className="font-mono text-sm font-bold text-slate-900">IRO Review</div>
      </div>
      <div className="absolute right-[2%] top-[64%] rotate-2 rounded-xl border border-rose-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">Win rate</div>
        <div className="font-mono text-sm font-bold text-emerald-700">62% reversed</div>
      </div>
    </div>
  );
}
