"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { icons } from "@/components/icons";
import { useProgress } from "@/components/progress-provider";
import { getModule, getModuleQuestions } from "@/lib/content";
import { getModuleProgress, insightFor } from "@/lib/progress";

export default function ResultsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const searchParams = useSearchParams();
  const { progress, updateProgress } = useProgress();
  const learningModule = getModule(slug);
  const questions = getModuleQuestions(slug);
  const moduleProgress = getModuleProgress(progress, slug);
  if (!learningModule) return null;
  const score = Number(searchParams.get("score") ?? moduleProgress.bestScore);
  const passed = score >= learningModule.passThreshold;
  const latest = moduleProgress.attempts.at(-1) ?? [];
  const correctParam = searchParams.get("correct");
  const correct = correctParam !== null ? Number(correctParam) : latest.filter((answer) => answer.correct).length;
  return <AppShell><div className="mx-auto max-w-3xl">
    <section className="card overflow-hidden text-center">
      <div className="bg-gradient-to-br from-[#5145df] to-[#9333ea] p-8 text-white sm:p-10"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15">{passed ? <icons.Award size={32} /> : <icons.BookOpen size={32} />}</span><p className="mt-5 text-xs font-black uppercase tracking-[.2em] text-violet-200">{passed ? "Module complete" : "Keep learning"}</p><h1 className="mt-2 text-3xl font-black">{passed ? "Well done. You passed." : "You are close. Review and retry."}</h1><p className="mt-3 text-violet-100">{score} / {learningModule.maxPoints} points · {correct} / {questions.length} correct</p></div>
      <div className="p-6 sm:p-8"><div className="grid gap-3 sm:grid-cols-3"><ResultMetric value={`${score}`} label="Attempt score" /><ResultMetric value={`${moduleProgress.bestScore}`} label="Best score" /><ResultMetric value={passed ? "Unlocked" : "Locked"} label={`${learningModule.shortTitle} badge`} /></div><div className="mt-6 rounded-xl p-5 text-left" style={{ background: "var(--surface-muted)" }}><p className="font-black">Learning insight</p><p className="mt-2 leading-6" style={{ color: "var(--muted)" }}>{insightFor(latest)}</p></div><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link className="button-secondary" href={`/modules/${slug}`}>Review lesson</Link><Link className="button-primary" href={`/modules/${slug}/quiz`} onClick={() => updateProgress((current) => { const currentModule = getModuleProgress(current, slug); return { ...current, modules: { ...current.modules, [slug]: { ...currentModule, activeAnswers: [] } } }; })}>Retake quiz</Link><Link className="button-secondary" href="/dashboard">Dashboard</Link></div></div>
    </section>
  </div></AppShell>;
}
function ResultMetric({ value, label }: { value: string; label: string }) { return <div className="rounded-xl p-4" style={{ background: "var(--surface-muted)" }}><p className="text-xl font-black">{value}</p><p className="mt-1 text-xs font-bold" style={{ color: "var(--muted)" }}>{label}</p></div>; }
