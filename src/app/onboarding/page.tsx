"use client";

import { AppShell } from "@/components/app-shell";
import { PageTitle } from "@/components/page-elements";
import { useProgress } from "@/components/progress-provider";

export default function OnboardingPage() {
  const { progress, updateProgress } = useProgress();
  return <AppShell><PageTitle eyebrow="Welcome to CyberAI" title="Set up your learner profile" body="Choose the name shown on your achievements and future certificate." /><div className="card mt-7 max-w-xl p-6 sm:p-8"><label className="text-sm font-black">Display name<input className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" style={{ borderColor: "var(--border)" }} value={progress.displayName} onChange={(event) => updateProgress((current) => ({ ...current, displayName: event.target.value }))} /></label><a className="button-primary mt-6" href="/dashboard">Continue to dashboard</a></div></AppShell>;
}
