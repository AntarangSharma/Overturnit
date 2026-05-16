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
    <main className="flex-1 bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
        <header className="mb-8">
          <p className="text-sm font-medium tracking-wide text-teal-700 uppercase">
            OverturnIt
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Insurance denied your claim?
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Paste your denial. We tell you whether it will be overturned —
            and draft the appeal. Free. 60 seconds.
          </p>
        </header>

        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-4 text-center text-sm text-slate-700 shadow-sm">
          <span className="font-semibold">17%</span> of claims denied
          <span className="mx-2 text-slate-300">·</span>
          <span className="font-semibold">75%</span> of appeals win
          <span className="mx-2 text-slate-300">·</span>
          <span className="font-semibold">1%</span> of patients file
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="denial" className="block text-sm font-medium text-slate-800">
              Paste your denial letter
            </label>
            <textarea
              id="denial"
              required
              rows={10}
              value={denial}
              onChange={(e) => setDenial(e.target.value)}
              placeholder="Re: Claim # 4827-9912-3X..."
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-slate-800">
                State
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-slate-800">
                Plan type
              </label>
              <select
                id="plan"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              >
                {PLAN_TYPES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-slate-800">
                What was denied
              </label>
              <select
                id="service"
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              >
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-teal-700 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 disabled:opacity-60"
          >
            {loading ? LOADING_MESSAGES[messageIdx] : "Find My Path  →"}
          </button>

          {loading && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-1/3 animate-pulse bg-teal-600"></div>
            </div>
          )}
        </form>

        <p className="mt-10 text-xs leading-relaxed text-slate-500">
          OverturnIt is a drafting tool, not legal advice. We store nothing —
          your denial letter never leaves the request that generates your appeal.
          Consult a licensed professional for your specific situation.
        </p>
      </div>
    </main>
  );
}
