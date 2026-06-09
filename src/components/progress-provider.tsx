"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultProgress, LocalProgress } from "@/lib/progress";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ProgressContextValue = {
  progress: LocalProgress;
  updateProgress: (next: LocalProgress | ((current: LocalProgress) => LocalProgress)) => void;
  resetDemo: () => void;
  refreshRemoteProgress: () => Promise<void>;
  remoteEnabled: boolean;
  hydrated: boolean;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);
const STORAGE_KEY = "cyberai-local-progress";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  async function refreshRemoteProgress() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const [{ data: profile }, { data: remoteProgress }, { data: attempts }] = await Promise.all([
      supabase.from("profiles").select("display_name").maybeSingle(),
      supabase.from("module_progress").select("best_score,passed,modules!inner(slug)").eq("modules.slug", "phishing-email").maybeSingle(),
      supabase.from("quiz_attempts").select("id").eq("status", "completed"),
    ]);
    setProgress((current) => ({
      ...current,
      displayName: profile?.display_name ?? current.displayName,
      bestScore: remoteProgress?.best_score ?? 0,
      passed: remoteProgress?.passed ?? false,
      attempts: attempts ? Array.from({ length: attempts.length }, () => []) : current.attempts,
    }));
  }

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setProgress({ ...defaultProgress, ...JSON.parse(stored) });
    setHydrated(true);
    void refreshRemoteProgress();
  }, []);

  const updateProgress = (next: LocalProgress | ((current: LocalProgress) => LocalProgress)) => {
    setProgress((current) => {
      const value = typeof next === "function" ? next(current) : next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return value;
    });
  };

  const value = useMemo(() => ({
    progress,
    updateProgress,
    resetDemo: () => updateProgress(defaultProgress),
    refreshRemoteProgress,
    remoteEnabled: Boolean(createSupabaseBrowserClient()),
    hydrated,
  }), [progress, hydrated]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
