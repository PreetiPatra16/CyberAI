"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { icons } from "@/components/icons";
import { getModule, getModuleQuestions } from "@/lib/content";
import { PersistedCoach } from "@/lib/coach";
import { insightFor, QuizAnswer } from "@/lib/progress";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AttemptResult = {
  attempt_id: string;
  module_slug: string;
  score: number;
  passed: boolean;
  best_score: number;
  responses: QuizAnswer[];
};

export default function ResultsPage() {
  const params = useParams<{ slug: string; attemptId: string }>();
  const { slug, attemptId } = params;
  const learningModule = getModule(slug);
  const questions = getModuleQuestions(slug);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [coach, setCoach] = useState<PersistedCoach | null>(null);
  const [coachError, setCoachError] = useState<string | null>(null);
  const [coachLoading, setCoachLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadResult() {
      const { data, error: requestError } = await createSupabaseBrowserClient()
        .rpc("get_quiz_attempt_result", { attempt_id: attemptId });
      if (!active) return;
      if (requestError) setError(requestError.message);
      else setResult(data as AttemptResult);
    }
    void loadResult();
    return () => {
      active = false;
    };
  }, [attemptId]);

  useEffect(() => {
    let active = true;
    async function loadCoach() {
      try {
        const response = await fetch(`/api/coach/${attemptId}`, { method: "POST" });
        const body = await response.json() as PersistedCoach | { error: string };
        if (!active) return;
        if (!response.ok) setCoachError("error" in body ? body.error : "Unable to load coaching.");
        else setCoach(body as PersistedCoach);
      } catch {
        if (active) setCoachError("Unable to connect to the learning coach.");
      } finally {
        if (active) setCoachLoading(false);
      }
    }
    void loadCoach();
    return () => {
      active = false;
    };
  }, [attemptId]);

  if (!learningModule) return null;
  if (error) return <AppShell><div className="card mx-auto max-w-3xl p-8 text-center"><p className="font-black text-red-700">Unable to load this result</p><p className="mt-2" style={{ color: "var(--muted)" }}>{error}</p><Link className="button-secondary mt-5" href="/dashboard">Dashboard</Link></div></AppShell>;
  if (!result) return <AppShell><div className="card mx-auto max-w-3xl p-8 text-center"><p className="font-black">Loading authoritative results from Supabase...</p></div></AppShell>;
  if (result.module_slug !== slug) return <AppShell><div className="card mx-auto max-w-3xl p-8 text-center"><p className="font-black text-red-700">This result does not belong to this module.</p><Link className="button-secondary mt-5" href="/dashboard">Dashboard</Link></div></AppShell>;

  const correct = result.responses.filter((answer) => answer.correct).length;
  return <AppShell><div className="mx-auto max-w-3xl">
    <section className="card overflow-hidden text-center">
      <div className="bg-gradient-to-br from-[#5145df] to-[#9333ea] p-8 text-white sm:p-10"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15">{result.passed ? <icons.Award size={32} /> : <icons.BookOpen size={32} />}</span><p className="mt-5 text-xs font-black uppercase tracking-[.2em] text-violet-200">{result.passed ? "Module complete" : "Keep learning"}</p><h1 className="mt-2 text-3xl font-black">{result.passed ? "Well done. You passed." : "You are close. Review and retry."}</h1><p className="mt-3 text-violet-100">{result.score} / {learningModule.maxPoints} points · {correct} / {questions.length} correct</p></div>
      <div className="p-6 sm:p-8"><div className="grid gap-3 sm:grid-cols-3"><ResultMetric value={`${result.score}`} label="Attempt score" /><ResultMetric value={`${result.best_score}`} label="Best score" /><ResultMetric value={result.passed ? "Unlocked" : "Locked"} label={`${learningModule.shortTitle} badge`} /></div><div className="mt-6 rounded-xl p-5 text-left" style={{ background: "var(--surface-muted)" }}><p className="font-black">Learning insight</p><p className="mt-2 leading-6" style={{ color: "var(--muted)" }}>{insightFor(result.responses)}</p></div><CoachPanel coach={coach} loading={coachLoading} error={coachError} /><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link className="button-secondary" href={`/modules/${slug}`}>Review lesson</Link><Link className="button-primary" href={`/modules/${slug}/quiz`}>Retake quiz</Link><Link className="button-secondary" href="/dashboard">Dashboard</Link></div></div>
    </section>
  </div></AppShell>;
}

function ResultMetric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-xl p-4" style={{ background: "var(--surface-muted)" }}><p className="text-xl font-black">{value}</p><p className="mt-1 text-xs font-bold" style={{ color: "var(--muted)" }}>{label}</p></div>;
}

function CoachPanel({ coach, loading, error }: { coach: PersistedCoach | null; loading: boolean; error: string | null }) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border text-left" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#5145df] to-[#7c3aed] px-5 py-4 text-white">
        <div className="flex items-center gap-3"><icons.Sparkles size={20} /><div><p className="font-black">CyberAI learning coach</p><p className="text-xs text-violet-100">Personalized from your topic performance and confidence</p></div></div>
        {coach && <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{coach.source === "groq" ? "AI generated" : "Reliable fallback"}</span>}
      </div>
      <div className="p-5 sm:p-6">
        {loading && <p className="text-sm font-bold" style={{ color: "var(--muted)" }}>Preparing and saving your coaching...</p>}
        {error && <p className="text-sm font-bold text-red-700">{error}</p>}
        {coach && <>
          <p className="leading-7">{coach.summary}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <CoachList title="Strengths" items={coach.strengths} />
            <CoachList title="Focus areas" items={coach.focus_areas} />
            <CoachList title="Next steps" items={coach.next_steps} />
          </div>
        </>}
      </div>
    </section>
  );
}

function CoachList({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-xl p-4" style={{ background: "var(--surface-muted)" }}><p className="text-sm font-black">{title}</p><ul className="mt-3 space-y-2">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-5" style={{ color: "var(--muted)" }}><icons.CheckCircle2 className="mt-0.5 shrink-0" size={16} /><span>{item}</span></li>)}</ul></div>;
}
