"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { icons } from "@/components/icons";
import { useProgress } from "@/components/progress-provider";
import { insightFor } from "@/lib/progress";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const { progress, updateProgress } = useProgress();
  const score = Number(searchParams.get("score") ?? progress.bestScore);
  const passed = score >= 350;
  const latest = progress.attempts.at(-1) ?? [];
  const correct = latest.filter((answer) => answer.correct).length;
  return <AppShell><div className="mx-auto max-w-3xl">
    <section className="card overflow-hidden text-center">
      <div className="bg-gradient-to-br from-[#5145df] to-[#9333ea] p-8 text-white sm:p-10"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15">{passed ? <icons.Award size={32} /> : <icons.BookOpen size={32} />}</span><p className="mt-5 text-xs font-black uppercase tracking-[.2em] text-violet-200">{passed ? "Module complete" : "Keep learning"}</p><h1 className="mt-2 text-3xl font-black">{passed ? "You spotted the lure." : "You are close. Review and retry."}</h1><p className="mt-3 text-violet-100">{score} / 500 points · {correct} / 4 correct</p></div>
      <div className="p-6 sm:p-8"><div className="grid gap-3 sm:grid-cols-3"><ResultMetric value={`${score}`} label="Attempt score" /><ResultMetric value={`${progress.bestScore}`} label="Best score" /><ResultMetric value={passed ? "Unlocked" : "Locked"} label="Phishing badge" /></div><div className="mt-6 rounded-xl p-5 text-left" style={{ background: "var(--surface-muted)" }}><p className="font-black">Learning insight</p><p className="mt-2 leading-6" style={{ color: "var(--muted)" }}>{insightFor(latest)}</p></div><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link className="button-secondary" href="/modules/phishing-email">Review lesson</Link><Link className="button-primary" href="/modules/phishing-email/quiz" onClick={() => updateProgress((current) => ({ ...current, activeAnswers: [] }))}>Retake quiz</Link><Link className="button-secondary" href="/dashboard">Dashboard</Link></div></div>
    </section>
  </div></AppShell>;
}
function ResultMetric({ value, label }: { value: string; label: string }) { return <div className="rounded-xl p-4" style={{ background: "var(--surface-muted)" }}><p className="text-xl font-black">{value}</p><p className="mt-1 text-xs font-bold" style={{ color: "var(--muted)" }}>{label}</p></div>; }
