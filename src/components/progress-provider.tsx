"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultProgress, ModuleProgress, UserProgress } from "@/lib/progress";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ProgressContextValue = {
  progress: UserProgress;
  loading: boolean;
  error: string | null;
  refreshProgress: () => Promise<void>;
  saveDisplayName: (displayName: string) => Promise<void>;
  saveTheme: (theme: UserProgress["theme"]) => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(defaultProgress);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProgress = useCallback(async () => {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const [{ data: profile, error: profileError }, { data: remoteProgress, error: progressError }] = await Promise.all([
      supabase.from("profiles").select("display_name,theme").single(),
      supabase.from("module_progress").select("attempt_count,best_score,passed,modules!inner(slug)"),
    ]);

    const requestError = profileError ?? progressError;
    if (requestError) {
      setError(requestError.message);
      setLoading(false);
      return;
    }

    const modules: Record<string, ModuleProgress> = {};
    for (const row of remoteProgress ?? []) {
      const slug = (row.modules as unknown as { slug: string })?.slug;
      if (!slug) continue;
      modules[slug] = {
        attemptCount: row.attempt_count ?? 0,
        bestScore: row.best_score ?? 0,
        passed: row.passed ?? false,
      };
    }

    setProgress({
      displayName: profile.display_name,
      theme: profile.theme === "dark" ? "dark" : "light",
      modules,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshProgress();
  }, [refreshProgress]);

  async function saveDisplayName(displayName: string) {
    const value = displayName.trim();
    if (!value) throw new Error("Display name is required.");
    const { data: { user }, error: userError } = await createSupabaseBrowserClient().auth.getUser();
    if (userError || !user) throw userError ?? new Error("Authentication required.");
    const { error: updateError } = await createSupabaseBrowserClient()
      .from("profiles")
      .update({ display_name: value })
      .eq("id", user.id);
    if (updateError) throw updateError;
    setProgress((current) => ({ ...current, displayName: value }));
  }

  async function saveTheme(theme: UserProgress["theme"]) {
    const { data: { user }, error: userError } = await createSupabaseBrowserClient().auth.getUser();
    if (userError || !user) throw userError ?? new Error("Authentication required.");
    const { error: updateError } = await createSupabaseBrowserClient()
      .from("profiles")
      .update({ theme })
      .eq("id", user.id);
    if (updateError) throw updateError;
    setProgress((current) => ({ ...current, theme }));
  }

  const value = useMemo(() => ({
    progress,
    loading,
    error,
    refreshProgress,
    saveDisplayName,
    saveTheme,
  }), [progress, loading, error, refreshProgress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
