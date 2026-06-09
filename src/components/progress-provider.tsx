"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultModuleProgress, defaultProgress, LocalProgress, ModuleProgress, StoredAnswer } from "@/lib/progress";
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

type LegacyProgress = {
  attempts?: StoredAnswer[][];
  activeAnswers?: StoredAnswer[];
  passed?: boolean;
  bestScore?: number;
};

function migrateStoredProgress(stored: LocalProgress & LegacyProgress): LocalProgress {
  const migrated: LocalProgress = { ...defaultProgress, ...stored, modules: { ...stored.modules } };
  if (stored.attempts || stored.activeAnswers || stored.passed || stored.bestScore) {
    const legacy: ModuleProgress = {
      attempts: stored.attempts ?? [],
      activeAnswers: stored.activeAnswers ?? [],
      passed: stored.passed ?? false,
      bestScore: stored.bestScore ?? 0,
    };
    migrated.modules = { "phishing-email": legacy, ...migrated.modules };
  }
  return migrated;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  async function refreshRemoteProgress() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const [{ data: profile }, { data: remoteProgress }, { data: attempts }] = await Promise.all([
      supabase.from("profiles").select("display_name").maybeSingle(),
      supabase.from("module_progress").select("best_score,passed,modules!inner(slug)"),
      supabase.from("quiz_attempts").select("status,modules!inner(slug)").eq("status", "completed"),
    ]);
    setProgress((current) => {
      const modules: Record<string, ModuleProgress> = { ...current.modules };
      for (const row of remoteProgress ?? []) {
        const slug = (row.modules as unknown as { slug: string })?.slug;
        if (!slug) continue;
        const existing = modules[slug] ?? defaultModuleProgress;
        modules[slug] = { ...existing, bestScore: row.best_score ?? 0, passed: row.passed ?? false };
      }
      const attemptCounts: Record<string, number> = {};
      for (const row of attempts ?? []) {
        const slug = (row.modules as unknown as { slug: string })?.slug;
        if (!slug) continue;
        attemptCounts[slug] = (attemptCounts[slug] ?? 0) + 1;
      }
      for (const [slug, count] of Object.entries(attemptCounts)) {
        const existing = modules[slug] ?? defaultModuleProgress;
        modules[slug] = { ...existing, attempts: Array.from({ length: count }, (_, index) => existing.attempts[index] ?? []) };
      }
      return {
        ...current,
        displayName: profile?.display_name ?? current.displayName,
        modules,
      };
    });
  }

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setProgress(migrateStoredProgress(JSON.parse(stored)));
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
