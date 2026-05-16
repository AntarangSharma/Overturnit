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
      <main className="flex flex-1 items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading your appeal…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-slate-50 text-slate-900">
      <ResultCard data={data} />
    </main>
  );
}
