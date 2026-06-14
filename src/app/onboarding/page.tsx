"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageTitle } from "@/components/page-elements";
import { useProgress } from "@/components/progress-provider";

export default function OnboardingPage() {
  const { progress, loading, saveDisplayName } = useProgress();
  const [displayName, setDisplayName] = useState(progress.displayName);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading) setDisplayName(progress.displayName);
  }, [loading, progress.displayName]);

  async function continueToDashboard() {
    try {
      setSaving(true);
      setMessage("");
      await saveDisplayName(displayName);
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  }

  return <AppShell><PageTitle eyebrow="Welcome to CyberAI" title="Set up your learner profile" body="Choose the name shown on your achievements and future certificate." /><div className="card mt-7 max-w-xl p-6 sm:p-8"><label className="text-sm font-black">Display name<input className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>{message && <p className="mt-4 text-sm font-bold text-red-700">{message}</p>}<button className="button-primary mt-6" onClick={continueToDashboard} disabled={saving || !displayName.trim()}>{saving ? "Saving..." : "Continue to dashboard"}</button></div></AppShell>;
}
