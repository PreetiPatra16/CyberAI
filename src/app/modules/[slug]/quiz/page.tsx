"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { icons } from "@/components/icons";
import { useProgress } from "@/components/progress-provider";
import { getModule, getModuleQuestions } from "@/lib/content";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SubmissionFeedback = {
  is_correct: boolean;
  points_earned: number;
  correct_option_key: string;
  explanation: string;
  attempt_complete: boolean;
};

type AttemptState = {
  attempt_id: string;
  answered_question_keys: string[];
};

export default function QuizPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const learningModule = getModule(slug);
  const questions = getModuleQuestions(slug);
  const { refreshProgress } = useProgress();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<"confident" | "guessing" | null>(null);
  const [feedback, setFeedback] = useState<SubmissionFeedback | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function startOrResumeAttempt() {
      setLoading(true);
      setError(null);
      const { data, error: requestError } = await createSupabaseBrowserClient()
        .rpc("get_quiz_attempt_state", { module_slug: slug });

      if (!active) return;
      if (requestError) {
        setError(requestError.message);
        setLoading(false);
        return;
      }

      const state = data as AttemptState;
      setAttemptId(state.attempt_id);
      setAnsweredCount(state.answered_question_keys.length);
      setIndex(Math.min(state.answered_question_keys.length, Math.max(questions.length - 1, 0)));
      setLoading(false);
    }

    void startOrResumeAttempt();
    return () => {
      active = false;
    };
  }, [questions.length, slug]);

  if (!learningModule || learningModule.status !== "available") return null;
  const question = questions[index];

  async function submit() {
    if (!selected || !confidence || feedback || !attemptId) return;
    setSubmitting(true);
    setError(null);
    const { data, error: requestError } = await createSupabaseBrowserClient().rpc(
      "submit_quiz_response",
      {
        attempt_id: attemptId,
        question_key: question.id,
        option_key: selected,
        answer_confidence: confidence,
      },
    );
    setSubmitting(false);

    if (requestError) {
      setError(requestError.message);
      return;
    }

    setFeedback(data as SubmissionFeedback);
    setAnsweredCount((count) => count + 1);
  }

  async function next() {
    if (!feedback || !attemptId) return;
    if (feedback.attempt_complete) {
      await refreshProgress();
      router.push(`/modules/${slug}/results/${attemptId}`);
      return;
    }

    setIndex((current) => current + 1);
    setSelected(null);
    setConfidence(null);
    setFeedback(null);
    setError(null);
  }

  if (loading) {
    return <AppShell><div className="card mx-auto max-w-3xl p-6 sm:p-8"><div className="flex items-center gap-3"><span className="spinner text-violet-600" /><div><p className="font-black">Preparing your quiz attempt...</p><p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Restoring your securely saved answers</p></div></div><div className="mt-7 space-y-3"><div className="skeleton h-20 rounded-xl" /><div className="skeleton h-14 rounded-xl" /><div className="skeleton h-14 rounded-xl" /><div className="skeleton h-14 rounded-xl" /></div></div></AppShell>;
  }

  if (error && !attemptId) {
    return <AppShell><div className="card mx-auto max-w-3xl p-8 text-center"><p className="font-black text-red-700">Unable to start quiz</p><p className="mt-2" style={{ color: "var(--muted)" }}>{error}</p><Link className="button-secondary mt-5" href={`/modules/${slug}`}>Return to lesson</Link></div></AppShell>;
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Link href={`/modules/${slug}`} className="mb-5 inline-flex text-sm font-bold" style={{ color: "var(--primary)" }}>← Exit to lesson</Link>
        <div className="mb-6 flex items-end justify-between gap-4"><div><span className="eyebrow">{learningModule.shortTitle} knowledge check</span><h1 className="mt-1 text-2xl font-black sm:text-3xl">Question {index + 1} of {questions.length}</h1><p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{answeredCount} answered · responses save after submission</p></div><span className="rounded-full px-3 py-1.5 text-sm font-black" style={{ background: learningModule.softAccent, color: learningModule.accent }}>+{question.points} points</span></div>
        <div className="mb-7 h-2 overflow-hidden rounded-full" style={{ background: "var(--border)" }}><div className="h-full rounded-full transition-all" style={{ background: learningModule.accent, width: `${((feedback ? index + 1 : index) / questions.length) * 100}%` }} /></div>
        <section className="card p-5 sm:p-7">
          <h2 className="rounded-xl p-5 text-lg font-black leading-7" style={{ background: "var(--surface-muted)" }}>{question.prompt}</h2>
          <fieldset className="mt-5 space-y-3" disabled={!!feedback || submitting}>
            <legend className="sr-only">Choose an answer</legend>
            {question.options.map((option) => {
              const isSelected = selected === option.id;
              const isCorrect = feedback && option.id === feedback.correct_option_key;
              const isWrong = feedback && isSelected && !feedback.is_correct;
              return <label key={option.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: isCorrect ? "#39cf78" : isWrong ? "#ef7d7d" : isSelected ? learningModule.accent : "var(--border)", background: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : isSelected ? learningModule.softAccent : "var(--surface)" }}><span className="font-semibold" style={{ color: isCorrect ? "#116333" : isWrong ? "#991b1b" : "var(--text)" }}>{option.label}</span><input className="h-4 w-4" type="radio" name="answer" checked={isSelected} onChange={() => setSelected(option.id)} />{isCorrect && <icons.CheckCircle2 className="shrink-0 text-green-600" size={20} />}</label>;
            })}
          </fieldset>
          <fieldset className="mt-6 grid gap-3 sm:grid-cols-2" disabled={!!feedback || submitting}>
            <legend className="mb-2 text-sm font-black">How confident are you?</legend>
            <Confidence label="Confident" value="confident" selected={confidence} onSelect={setConfidence} icon={<icons.Shield size={19} />} />
            <Confidence label="Just guessing" value="guessing" selected={confidence} onSelect={setConfidence} icon={<icons.Sparkles size={19} />} />
          </fieldset>
          {feedback && <div className="mt-6 rounded-xl p-5" style={{ background: feedback.is_correct ? "#dcfce7" : "#fee2e2", color: feedback.is_correct ? "#14532d" : "#991b1b" }}><p className="font-black">{feedback.is_correct ? `Correct. You earned ${feedback.points_earned} points.` : "Not quite. Here is the safer response."}</p><p className="mt-2 leading-6">{feedback.explanation}</p></div>}
          {error && <p className="mt-5 rounded-xl bg-red-100 p-4 text-sm font-bold text-red-800">{error}</p>}
          {!feedback ? <button className="button-primary mt-6 w-full" onClick={submit} disabled={!selected || !confidence || !attemptId || submitting}>{submitting && <span className="spinner" />}{submitting ? "Submitting securely..." : "Submit answer"}</button> : <button className="button-primary mt-6 w-full" onClick={next}>{feedback.attempt_complete ? "View results" : "Next question"} <span>→</span></button>}
        </section>
        {answeredCount > 0 && <p className="mt-4 text-center text-xs" style={{ color: "var(--muted)" }}>{answeredCount} answer{answeredCount === 1 ? "" : "s"} securely saved to Supabase.</p>}
      </div>
    </AppShell>
  );
}

function Confidence({ label, value, selected, onSelect, icon }: { label: string; value: "confident" | "guessing"; selected: "confident" | "guessing" | null; onSelect: (value: "confident" | "guessing") => void; icon: React.ReactNode }) {
  return <label className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: selected === value ? "var(--primary)" : "var(--border)", background: selected === value ? "color-mix(in srgb, var(--primary) 10%, var(--surface))" : "var(--surface)" }}><input type="radio" name="confidence" checked={selected === value} onChange={() => onSelect(value)} />{icon}<span className="font-bold">{label}</span></label>;
}
