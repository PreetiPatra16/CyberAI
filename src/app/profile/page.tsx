"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useProgress } from "@/components/progress-provider";
import { PageTitle } from "@/components/page-elements";
import { totalPoints } from "@/lib/progress";

export default function ProfilePage() {
  const { progress, loading, saveDisplayName } = useProgress();
  const [displayName, setDisplayName] = useState(progress.displayName);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) setDisplayName(progress.displayName);
  }, [loading, progress.displayName]);

  async function saveName() {
    try {
      setSaving(true);
      setMessage("");
      await saveDisplayName(displayName);
      setMessage("Profile saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }

  const attemptCount = Object.values(progress.modules).reduce(
    (total, module) => total + module.attemptCount,
    0
  );

  return (
    <AppShell>
      <PageTitle
        eyebrow="Learner profile"
        title="Your training identity"
        body="Personalize your profile and review your progress."
      />

      <div className="card mt-7 max-w-2xl p-6 sm:p-8">
        <label className="text-sm font-black">
          Display name

          <input
            className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3"
            style={{ borderColor: "var(--border)" }}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </label>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface-muted)" }}
          >
            <p className="text-2xl font-black">
              {totalPoints(progress)}
            </p>

            <p
              className="text-sm"
              style={{ color: "var(--muted)" }}
            >
              Total points
            </p>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface-muted)" }}
          >
            <p className="text-2xl font-black">
              {attemptCount}
            </p>

            <p
              className="text-sm"
              style={{ color: "var(--muted)" }}
            >
              Quiz attempts
            </p>
          </div>
        </div>

        {message && <p className="mt-4 text-sm font-bold" style={{ color: message === "Profile saved." ? "var(--success)" : "#b91c1c" }}>{message}</p>}
        <button className="button-primary mt-6" onClick={saveName} disabled={saving || !displayName.trim()}>
          {saving ? "Saving..." : "Save profile"}
        </button>
      </div>
    </AppShell>
  );
}
