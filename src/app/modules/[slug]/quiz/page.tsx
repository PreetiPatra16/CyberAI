"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { icons } from "@/components/icons";
import { useProgress } from "@/components/progress-provider";
import { getModule, getModuleQuestions } from "@/lib/content";
import { calculateScore, getModuleProgress, StoredAnswer } from "@/lib/progress";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function QuizPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const learningModule = getModule(slug);
  const questions = getModuleQuestions(slug);
  const { progress, updateProgress, refreshRemoteProgress, remoteEnabled } = useProgress();
  const moduleProgress = getModuleProgress(progress, slug);
  const initialIndex = Math.min(moduleProgress.activeAnswers.length, questions.length - 1);
  const [index, setIndex] = useState(initialIndex);
  const [selected, setSelected] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<"confident" | "guessing" | null>(null);
  const [submitted, setSubmitted] = useState<StoredAnswer | null>(null);
  const [correctOptionKey, setCorrectOptionKey] = useState<string | null>(null);
  const [feedbackExplanation, setFeedbackExplanation] = useState<string | null>(null);
  const [remoteAttemptId, setRemoteAttemptId] = useState<string | null>(null);
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (supabase) supabase.rpc("start_quiz_attempt", { module_slug: slug }).then(({ data }) => { if (data) setRemoteAttemptId(data); });
  }, [slug]);
  if (!learningModule || learningModule.status !== "available") return null;
  const question = questions[index];
  const answeredCount = moduleProgress.activeAnswers.length;
  const passThreshold = learningModule.passThreshold;

  async function submit() {
    if (!selected || !confidence || submitted) return;
    let correct = selected === question.correctOptionId;
    let points = correct ? question.points : 0;
    let authoritativeCorrectOption = question.correctOptionId;
    let authoritativeExplanation = question.explanation;
    const supabase = createSupabaseBrowserClient();
    if (supabase && remoteAttemptId) {
      const { data, error } = await supabase.rpc("submit_quiz_response", { attempt_id: remoteAttemptId, question_key: question.id, option_key: selected, answer_confidence: confidence });
      if (error) { console.error("Supabase quiz persistence failed:", error.message); return; }
      correct = data.is_correct;
      points = data.points_earned;
      authoritativeCorrectOption = data.correct_option_key;
      authoritativeExplanation = data.explanation;
    }
    const answer: StoredAnswer = { questionId: question.id, optionId: selected, confidence, correct, points };
    setCorrectOptionKey(authoritativeCorrectOption);
    setFeedbackExplanation(authoritativeExplanation);
    setSubmitted(answer);
    updateProgress((current) => {
      const currentModule = getModuleProgress(current, slug);
      return { ...current, modules: { ...current.modules, [slug]: { ...currentModule, activeAnswers: [...currentModule.activeAnswers, answer] } } };
    });
  }

  async function next() {
    if (index < questions.length - 1) {
      setIndex(index + 1); setSelected(null); setConfidence(null); setSubmitted(null); setCorrectOptionKey(null); setFeedbackExplanation(null); return;
    }
    const answers = [...moduleProgress.activeAnswers];
    const last = submitted;
    if (last && !answers.some((answer) => answer.questionId === last.questionId)) answers.push(last);
    const score = calculateScore(answers);
    const correctCount = answers.filter((answer) => answer.correct).length;
    updateProgress((current) => {
      const currentModule = getModuleProgress(current, slug);
      return {
        ...current,
        modules: {
          ...current.modules,
          [slug]: {
            ...currentModule,
            activeAnswers: [],
            attempts: [...currentModule.attempts, answers],
            bestScore: Math.max(currentModule.bestScore, score),
            passed: currentModule.passed || score >= passThreshold,
          },
        },
      };
    });
    if (remoteEnabled) await refreshRemoteProgress();
    router.push(`/modules/${slug}/results/latest?score=${score}&correct=${correctCount}`);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Link href={`/modules/${slug}`} className="mb-5 inline-flex text-sm font-bold" style={{ color: "var(--primary)" }}>← Exit to lesson</Link>
        <div className="mb-6 flex items-end justify-between gap-4"><div><span className="eyebrow">{learningModule.shortTitle} knowledge check</span><h1 className="mt-1 text-2xl font-black sm:text-3xl">Question {index + 1} of {questions.length}</h1></div><span className="text-sm font-bold">+{question.points} points</span></div>
        <div className="mb-7 h-2 overflow-hidden rounded-full" style={{ background: "var(--border)" }}><div className="h-full rounded-full transition-all" style={{ background: learningModule.accent, width: `${((submitted ? index + 1 : index) / questions.length) * 100}%` }} /></div>
        <section className="card p-5 sm:p-7">
          <h2 className="rounded-xl p-5 text-lg font-black leading-7" style={{ background: "var(--surface-muted)" }}>{question.prompt}</h2>
          <fieldset className="mt-5 space-y-3" disabled={!!submitted}>
            <legend className="sr-only">Choose an answer</legend>
            {question.options.map((option) => {
              const isSelected = selected === option.id;
              const isCorrect = submitted && option.id === correctOptionKey;
              const isWrong = submitted && isSelected && !submitted.correct;
              return <label key={option.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-4 transition" style={{ borderColor: isCorrect ? "#39cf78" : isWrong ? "#ef7d7d" : isSelected ? learningModule.accent : "var(--border)", background: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : "var(--surface)" }}><span style={{ color: isCorrect ? "#116333" : isWrong ? "#991b1b" : "var(--text)" }}>{option.label}</span><input className="h-4 w-4" type="radio" name="answer" checked={isSelected} onChange={() => setSelected(option.id)} />{isCorrect && <icons.CheckCircle2 className="shrink-0 text-green-600" size={20} />}</label>;
            })}
          </fieldset>
          <fieldset className="mt-6 grid gap-3 sm:grid-cols-2" disabled={!!submitted}>
            <legend className="mb-2 text-sm font-black">How confident are you?</legend>
            <Confidence label="Confident" value="confident" selected={confidence} onSelect={setConfidence} icon={<icons.Shield size={19} />} />
            <Confidence label="Just guessing" value="guessing" selected={confidence} onSelect={setConfidence} icon={<icons.Sparkles size={19} />} />
          </fieldset>
          {submitted && <div className="mt-6 rounded-xl p-5" style={{ background: submitted.correct ? "#dcfce7" : "#fee2e2", color: submitted.correct ? "#14532d" : "#991b1b" }}><p className="font-black">{submitted.correct ? "Correct. Nice judgment." : "Not quite. Here is the safer response."}</p><p className="mt-2 leading-6">{feedbackExplanation}</p></div>}
          {!submitted ? <button className="button-primary mt-6 w-full" onClick={submit} disabled={!selected || !confidence}>Submit answer</button> : <button className="button-primary mt-6 w-full" onClick={next}>{index === questions.length - 1 ? "Finish quiz" : "Next question"}</button>}
        </section>
        {answeredCount > 0 && <p className="mt-4 text-center text-xs" style={{ color: "var(--muted)" }}>Progress is saved in this local demo session.</p>}
      </div>
    </AppShell>
  );
}

function Confidence({ label, value, selected, onSelect, icon }: { label: string; value: "confident" | "guessing"; selected: "confident" | "guessing" | null; onSelect: (value: "confident" | "guessing") => void; icon: React.ReactNode }) {
  return <label className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3" style={{ borderColor: selected === value ? "var(--primary)" : "var(--border)", background: selected === value ? "color-mix(in srgb, var(--primary) 10%, var(--surface))" : "var(--surface)" }}><input type="radio" name="confidence" checked={selected === value} onChange={() => onSelect(value)} />{icon}<span className="font-bold">{label}</span></label>;
}
