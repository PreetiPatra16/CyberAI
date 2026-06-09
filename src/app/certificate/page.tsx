"use client";
import { AppShell } from "@/components/app-shell";
import { icons } from "@/components/icons";
import { useProgress } from "@/components/progress-provider";
import { modules } from "@/lib/content";
import { completedCount, totalPoints } from "@/lib/progress";
import { PageTitle, Locked } from "@/components/page-elements";

function certificateId(displayName: string, points: number) {
  let hash = 0;
  const seed = `${displayName}-${points}`;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return `CYBERAI-${Math.abs(hash).toString(16).toUpperCase().padStart(8, "0")}`;
}

export default function CertificatePage() {
  const { progress } = useProgress();
  const completed = completedCount(progress);
  const earnedPoints = totalPoints(progress);
  const unlocked = completed === modules.length;
  const issuedOn = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  return (
    <AppShell>
      <PageTitle eyebrow="Training credential" title="Certificate of completion" body="Complete the full CyberAI roadmap to earn your certificate." />
      {unlocked ? (
        <section className="card mt-7 overflow-hidden p-1">
          <div className="rounded-[1.4rem] border-4 border-double p-8 text-center sm:p-12" style={{ borderColor: "var(--primary)" }}>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl" style={{ background: "var(--surface-muted)", color: "var(--primary)" }}><icons.FileBadge2 size={30} /></span>
            <p className="mt-5 text-xs font-black uppercase tracking-[.3em]" style={{ color: "var(--muted)" }}>CyberAI Security Training</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Certificate of Completion</h1>
            <p className="mt-6" style={{ color: "var(--muted)" }}>This certifies that</p>
            <p className="mt-2 text-2xl font-black sm:text-3xl">{progress.displayName}</p>
            <p className="mt-4 max-w-xl mx-auto leading-7" style={{ color: "var(--muted)" }}>has successfully completed all 8 modules of the CyberAI Security Awareness program, earning {earnedPoints} total points.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl p-4" style={{ background: "var(--surface-muted)" }}><p className="text-xs font-bold uppercase tracking-[.18em]" style={{ color: "var(--muted)" }}>Certificate ID</p><p className="mt-1 font-black">{certificateId(progress.displayName, earnedPoints)}</p></div>
              <div className="rounded-xl p-4" style={{ background: "var(--surface-muted)" }}><p className="text-xs font-bold uppercase tracking-[.18em]" style={{ color: "var(--muted)" }}>Date issued</p><p className="mt-1 font-black">{issuedOn}</p></div>
            </div>
            <button onClick={() => window.print()} className="button-primary mt-8">Print / Save as PDF</button>
          </div>
        </section>
      ) : (
        <Locked title={`Your certificate unlocks after all eight modules are complete (${completed}/8 done).`} href="/dashboard" action="View roadmap" />
      )}
    </AppShell>
  );
}
