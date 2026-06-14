"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { icons } from "@/components/icons";
import { PageTitle } from "@/components/page-elements";
import { PersistedCoach } from "@/lib/coach";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type CoachHistoryItem = PersistedCoach & {
  attempt_id: string;
  generated_at: string;
  quiz_attempts: {
    score: number;
    passed: boolean;
    completed_at: string;
    modules: {
      slug: string;
      title: string;
      accent: string;
      max_points: number;
    };
  };
};

export default function CoachHistoryPage() {
  const [history, setHistory] = useState<CoachHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      const { data, error: requestError } = await createSupabaseBrowserClient()
        .from("quiz_coaching")
        .select("attempt_id,summary,strengths,focus_areas,next_steps,source,model,generated_at,quiz_attempts!inner(score,passed,completed_at,modules!inner(slug,title,accent,max_points))")
        .order("generated_at", { ascending: false });

      if (!active) return;
      if (requestError) setError(requestError.message);
      else setHistory((data ?? []) as unknown as CoachHistoryItem[]);
      setLoading(false);
    }

    void loadHistory();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AppShell>
      <PageTitle
        eyebrow="Personalized guidance"
        title="AI coach history"
        body="Revisit saved coaching from every completed quiz attempt."
      />

      {loading && <HistorySkeleton />}
      {error && <HistoryMessage icon={<icons.History size={28} />} title="Unable to load coaching history" body={error} />}
      {!loading && !error && history.length === 0 && (
        <HistoryMessage
          icon={<icons.Sparkles size={28} />}
          title="Your first coaching session is waiting"
          body="Complete a quiz to receive personalized guidance that will be saved here."
          action={<Link className="button-primary mt-5" href="/dashboard">Choose a module</Link>}
        />
      )}

      {!loading && !error && history.length > 0 && (
        <>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <HistoryMetric value={`${history.length}`} label="Saved coaching sessions" />
            <HistoryMetric value={`${new Set(history.map((item) => item.quiz_attempts.modules.slug)).size}`} label="Modules coached" />
            <HistoryMetric value={`${history.filter((item) => item.source === "groq").length}`} label="AI-generated sessions" />
          </div>
          <div className="mt-7 space-y-5">
            {history.map((item) => <CoachHistoryCard key={item.attempt_id} item={item} />)}
          </div>
        </>
      )}
    </AppShell>
  );
}

function CoachHistoryCard({ item }: { item: CoachHistoryItem }) {
  const attempt = item.quiz_attempts;
  const learningModule = attempt.modules;
  const date = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(item.generated_at));

  return (
    <article className="card interactive-card overflow-hidden">
      <div className="border-l-4 p-5 sm:p-6" style={{ borderLeftColor: learningModule.accent }}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ background: learningModule.accent }}>{attempt.passed ? "Passed" : "Review recommended"}</span>
              <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "var(--surface-muted)", color: "var(--muted)" }}>{item.source === "groq" ? "AI generated" : "Reliable fallback"}</span>
            </div>
            <h2 className="mt-3 text-xl font-black">{learningModule.title}</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{date} · {attempt.score}/{learningModule.max_points} points</p>
          </div>
          <Link className="button-secondary shrink-0" href={`/modules/${learningModule.slug}/results/${item.attempt_id}`}>View attempt</Link>
        </div>

        <p className="mt-5 max-w-4xl leading-7">{item.summary}</p>

        <details className="mt-5 rounded-xl border transition hover:shadow-sm" style={{ borderColor: "var(--border)" }}>
          <summary className="cursor-pointer px-4 py-3 text-sm font-black">Review coaching details <span className="ml-1" style={{ color: "var(--muted)" }}>↓</span></summary>
          <div className="grid gap-4 border-t p-4 md:grid-cols-3" style={{ borderColor: "var(--border)" }}>
            <CoachList title="Strengths" items={item.strengths} />
            <CoachList title="Focus areas" items={item.focus_areas} />
            <CoachList title="Next steps" items={item.next_steps} />
          </div>
        </details>
      </div>
    </article>
  );
}

function CoachList({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-xl p-4" style={{ background: "var(--surface-muted)" }}><p className="text-sm font-black">{title}</p><ul className="mt-3 space-y-2">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-5" style={{ color: "var(--muted)" }}><icons.CheckCircle2 className="mt-0.5 shrink-0" size={16} /><span>{item}</span></li>)}</ul></div>;
}

function HistoryMetric({ value, label }: { value: string; label: string }) {
  return <div className="card p-5"><p className="text-3xl font-black" style={{ color: "var(--primary)" }}>{value}</p><p className="mt-1 text-sm font-bold" style={{ color: "var(--muted)" }}>{label}</p></div>;
}

function HistoryMessage({ icon, title, body, action }: { icon: React.ReactNode; title: string; body?: string; action?: React.ReactNode }) {
  return <div className="card mt-7 p-8 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl" style={{ background: "var(--surface-muted)", color: "var(--primary)" }}>{icon}</span><h2 className="mt-5 text-xl font-black">{title}</h2>{body && <p className="mx-auto mt-2 max-w-xl" style={{ color: "var(--muted)" }}>{body}</p>}{action}</div>;
}

function HistorySkeleton() {
  return <div className="mt-7 space-y-5"><div className="grid gap-4 sm:grid-cols-3"><div className="skeleton h-24 rounded-2xl" /><div className="skeleton h-24 rounded-2xl" /><div className="skeleton h-24 rounded-2xl" /></div><div className="skeleton h-56 rounded-2xl" /><div className="skeleton h-56 rounded-2xl" /></div>;
}
