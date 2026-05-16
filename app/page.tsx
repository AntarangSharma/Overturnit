"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM",
  "NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA",
  "WV","WI","WY",
];

const PLAN_TYPES = ["Employer", "ACA Marketplace", "Medicare", "Medicaid", "Other"];

const SERVICE_CATEGORIES = [
  "Prior auth denied",
  "Out-of-network surprise bill",
  "Medical necessity denied",
  "Experimental/investigational",
  "Prescription denied",
  "Other",
];

const LOADING_MESSAGES = [
  "Reading your denial…",
  "Matching federal & state rules…",
  "Drafting your appeal…",
];

const SAMPLE_DENIAL = `Re: Claim # 4827-9912-3X
Date of service: 04/12/2026
Member: [redacted]
Provider: Pacific Imaging Group

Dear Member,

We have completed our review of your claim for MRI of the lumbar spine with contrast (CPT 72149) performed on 04/12/2026. After clinical review applying InterQual guidelines for low back pain, this service has been determined to be NOT MEDICALLY NECESSARY.

Per our medical policy MPG-128 (Imaging for Acute Low Back Pain), MRI of the lumbar spine is considered appropriate only after a documented six-week trial of conservative therapy including physical therapy. Our records reflect the trial commenced on 02/27/2026 and the MRI was ordered on 04/04/2026, prior to completion of the six-week window.

You are responsible for the billed amount of $2,847.00.

If you disagree with this determination, you may request an internal appeal within 180 days. Please refer to the back of this letter for appeal instructions.

Sincerely,
Member Services`;

export default function Home() {
  const router = useRouter();
  const [denial, setDenial] = useState("");
  const [state, setState] = useState("CA");
  const [planType, setPlanType] = useState(PLAN_TYPES[0]);
  const [serviceCategory, setServiceCategory] = useState(SERVICE_CATEGORIES[2]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageIdx, setMessageIdx] = useState(0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (denial.trim().length < 20) {
      setError("Please paste your denial letter (at least 20 characters).");
      return;
    }
    setLoading(true);
    const rotator = setInterval(
      () => setMessageIdx((i) => (i + 1) % LOADING_MESSAGES.length),
      2500
    );
    try {
      const res = await fetch("/api/overturn", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          denial_text: denial,
          state,
          plan_type: planType,
          service_category: serviceCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.error || "Request failed");
      sessionStorage.setItem("overturnit:result", JSON.stringify(data));
      router.push("/result");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      clearInterval(rotator);
      setLoading(false);
    }
  }

  return (
    <main className="grain relative flex-1 overflow-hidden text-slate-900">
      {/* Base saturated gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 bg-gradient-to-br from-teal-100 via-emerald-50 to-slate-50"
      />
      {/* Dot grid overlay */}
      <div
        aria-hidden
        className="bg-dotgrid pointer-events-none absolute inset-0 -z-20 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      {/* Animated gradient orbs */}
      <div
        aria-hidden
        className="drift-a pointer-events-none absolute -top-32 -right-32 -z-10 h-[520px] w-[520px] rounded-full bg-teal-300/55 blur-3xl"
      />
      <div
        aria-hidden
        className="drift-b pointer-events-none absolute top-1/3 -left-40 -z-10 h-[460px] w-[460px] rounded-full bg-emerald-300/45 blur-3xl"
      />
      <div
        aria-hidden
        className="drift-c pointer-events-none absolute -bottom-40 right-1/4 -z-10 h-[380px] w-[380px] rounded-full bg-cyan-200/40 blur-3xl"
      />

      {/* Decorative document SVG behind the hero */}
      <svg
        aria-hidden
        viewBox="0 0 600 720"
        className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-[640px] w-[520px] -translate-x-1/2 opacity-[0.07] sm:opacity-[0.09]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="80" y="40" width="440" height="640" rx="14" className="text-teal-900" />
        <line x1="120" y1="120" x2="480" y2="120" className="text-teal-900" />
        <line x1="120" y1="160" x2="420" y2="160" className="text-teal-900" />
        <line x1="120" y1="200" x2="460" y2="200" className="text-teal-900" />
        <line x1="120" y1="260" x2="480" y2="260" className="text-teal-900" />
        <line x1="120" y1="300" x2="440" y2="300" className="text-teal-900" />
        <line x1="120" y1="340" x2="400" y2="340" className="text-teal-900" />
        <line x1="120" y1="380" x2="470" y2="380" className="text-teal-900" />
        <line x1="120" y1="440" x2="440" y2="440" className="text-teal-900" />
        <line x1="120" y1="480" x2="380" y2="480" className="text-teal-900" />
        {/* Red "DENIED" stamp, struck through */}
        <g transform="translate(330 230) rotate(-14)" className="text-rose-600" strokeWidth="3">
          <rect x="-90" y="-30" width="180" height="60" rx="6" />
          <text x="0" y="8" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="28" fontWeight="800" fill="currentColor" stroke="none">DENIED</text>
        </g>
        {/* Green checkmark overlay */}
        <g transform="translate(380 480)" className="text-emerald-600" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="0" cy="0" r="42" />
          <path d="M -18 2 L -4 16 L 22 -12" fill="none" />
        </g>
      </svg>

      {/* Side decorations — only on large screens where there's empty real estate */}
      <SideAccents />

      <div className="relative mx-auto max-w-3xl px-5 py-12 sm:py-20">
        {/* Hero */}
        <header className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-teal-300/70 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800 shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
            OverturnIt
          </p>
          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
            Insurance <span className="marker">denied</span> your claim?
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-slate-700 sm:text-xl">
            Paste the letter. We tell you if it&apos;ll be overturned —{" "}
            <span className="font-semibold text-slate-900">and draft the appeal.</span>{" "}
            In 60 seconds. Free.
          </p>
        </header>

        {/* Stat strip — the emotional hook */}
        <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
          <Stat number="75%" label="of appeals win" tone="emerald" />
          <Stat number="17%" label="of claims denied" tone="amber" />
          <Stat number="<1%" label="ever appeal" tone="rose" />
        </div>

        {/* Form card with gradient ring */}
        <div className="mt-10 rounded-[1.25rem] bg-gradient-to-br from-teal-500/40 via-emerald-400/30 to-cyan-400/30 p-px shadow-2xl shadow-teal-900/[0.08]">
        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-[1.15rem] border border-white/60 bg-white/85 p-6 backdrop-blur-md sm:p-8"
        >
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="denial" className="block text-sm font-semibold text-slate-900">
                Paste your denial letter
              </label>
              <button
                type="button"
                onClick={() => setDenial(SAMPLE_DENIAL)}
                className="text-xs font-medium text-teal-700 underline-offset-2 hover:underline"
              >
                Try a sample →
              </button>
            </div>
            <textarea
              id="denial"
              required
              rows={9}
              value={denial}
              onChange={(e) => setDenial(e.target.value)}
              placeholder="Re: Claim # 4827-9912-3X..."
              className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-inner shadow-slate-100 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/15"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Tip: redact your name, member ID, and date of birth before pasting.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FieldSelect id="state" label="State" value={state} onChange={setState} options={STATES} />
            <FieldSelect id="plan" label="Plan type" value={planType} onChange={setPlanType} options={PLAN_TYPES} />
            <FieldSelect id="service" label="What was denied" value={serviceCategory} onChange={setServiceCategory} options={SERVICE_CATEGORIES} />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-teal-700 to-teal-800 px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:shadow-xl hover:shadow-teal-900/25 active:translate-y-px focus:outline-none focus:ring-4 focus:ring-teal-700/30 disabled:opacity-70"
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {LOADING_MESSAGES[messageIdx]}
                </>
              ) : (
                <>
                  Find My Path
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </>
              )}
            </span>
          </button>

          {loading && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-2/5 animate-pulse rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" />
            </div>
          )}
        </form>
        </div>

        {/* How it works */}
        <section className="mt-14">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
            How it works
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Step n={1} title="Paste the letter" body="Even messy copy-paste works. We strip the formatting." />
            <Step n={2} title="We match the rules" body="ACA, ERISA, Medicare and your state&apos;s external-review law." />
            <Step n={3} title="Get a drafted appeal" body="Cited, dated, ready to send. Copy or download as PDF." />
          </div>
        </section>

        <p className="mt-14 text-center text-xs leading-relaxed text-slate-500">
          OverturnIt is a drafting tool, not legal advice. We store nothing —
          your denial letter never leaves the request that generates your appeal.
          Consult a licensed professional for your specific situation.
        </p>
      </div>
    </main>
  );
}

function Stat({ number, label, tone }: { number: string; label: string; tone: "emerald" | "amber" | "rose" }) {
  const tones = {
    emerald: {
      bg: "from-emerald-50 to-white",
      num: "text-emerald-700",
      ring: "ring-emerald-200",
      bar: "from-emerald-400 to-emerald-600",
    },
    amber: {
      bg: "from-amber-50 to-white",
      num: "text-amber-700",
      ring: "ring-amber-200",
      bar: "from-amber-400 to-amber-600",
    },
    rose: {
      bg: "from-rose-50 to-white",
      num: "text-rose-700",
      ring: "ring-rose-200",
      bar: "from-rose-400 to-rose-600",
    },
  } as const;
  const t = tones[tone];
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br p-4 text-center shadow-sm ring-1 backdrop-blur-sm sm:p-5 ${t.bg} ${t.ring}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.bar}`} />
      <div className={`text-3xl font-bold tabular-nums tracking-tight sm:text-5xl ${t.num}`}>{number}</div>
      <div className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">{label}</div>
    </div>
  );
}

function FieldSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-900">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/15"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-5 backdrop-blur">
      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
        {n}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </div>
  );
}

function SideAccents() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
      {/* Giant watermark numerals at the far edges */}
      <div className="absolute left-[-2rem] top-[24%] select-none text-[14rem] font-black leading-none tracking-tighter text-teal-900/[0.05] sm:text-[16rem]">
        75
      </div>
      <div className="absolute right-[-2rem] bottom-[10%] select-none text-[14rem] font-black leading-none tracking-tighter text-rose-900/[0.05] sm:text-[16rem]">
        1%
      </div>

      {/* Left-side floating chips */}
      <div className="absolute left-[3%] top-[18%] -rotate-6 rounded-xl border border-teal-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">Federal rule</div>
        <div className="font-mono text-sm font-bold text-slate-900">ACA §2719</div>
        <div className="mt-0.5 text-[11px] text-slate-600">External review · 4 months</div>
      </div>
      <div className="absolute left-[5%] top-[42%] rotate-3 rounded-xl border border-emerald-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Self-funded plan</div>
        <div className="font-mono text-sm font-bold text-slate-900">ERISA §503</div>
        <div className="mt-0.5 text-[11px] text-slate-600">Full & fair review</div>
      </div>
      <div className="absolute left-[2%] top-[66%] -rotate-3 rounded-xl border border-amber-200 bg-white/75 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Internal appeal</div>
        <div className="font-mono text-sm font-bold text-slate-900">180-day clock</div>
        <div className="mt-0.5 text-[11px] text-slate-600">From denial date</div>
      </div>

      {/* Right-side floating chips */}
      <div className="absolute right-[3%] top-[22%] rotate-3 rounded-xl border border-cyan-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-700">No Surprises Act</div>
        <div className="font-mono text-sm font-bold text-slate-900">NSA §2799</div>
        <div className="mt-0.5 text-[11px] text-slate-600">Out-of-network protection</div>
      </div>
      <div className="absolute right-[4%] top-[46%] -rotate-2 rounded-xl border border-violet-200 bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">Medicare</div>
        <div className="font-mono text-sm font-bold text-slate-900">42 CFR §422</div>
        <div className="mt-0.5 text-[11px] text-slate-600">Part C appeals</div>
      </div>
      <div className="absolute right-[2%] top-[70%] rotate-6 rounded-xl border border-rose-200 bg-white/75 px-3 py-2 shadow-md backdrop-blur">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">Result</div>
        <div className="font-mono text-sm font-bold text-emerald-700">OVERTURNED</div>
        <div className="mt-0.5 text-[11px] text-slate-600">62% of internal appeals</div>
      </div>

      {/* Vertical accent lines with tick marks (right side) */}
      <div className="absolute right-[7%] top-[12%] flex h-[420px] flex-col items-center gap-2">
        <div className="text-[10px] font-mono font-semibold text-teal-700/70">DAY 0</div>
        <div className="h-full w-px bg-gradient-to-b from-teal-400/60 via-amber-400/40 to-rose-400/30" />
        <div className="text-[10px] font-mono font-semibold text-rose-700/70">DAY 180</div>
      </div>
    </div>
  );
}
