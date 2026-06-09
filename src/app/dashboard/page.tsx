"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { icons } from "@/components/icons";
import { ModuleCard } from "@/components/module-card";
import { useProgress } from "@/components/progress-provider";
import { modules } from "@/lib/content";

export default function DashboardPage() {
  const { progress } = useProgress();
  const completed = progress.passed ? 1 : 0;
  const level = progress.bestScore >= 350 ? "Phishing Defender" : progress.bestScore > 0 ? "Threat Spotter" : "Security Starter";
  return (
    <AppShell>
      <section className="overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#5145df] to-[#9333ea] p-6 text-white shadow-xl sm:p-9">
        <div className="max-w-3xl"><span className="text-xs font-black uppercase tracking-[.18em] text-violet-200">Up next</span><h1 className="mt-3 text-3xl font-black sm:text-4xl">Phishing: The Lure (Email)</h1><p className="mt-3 max-w-xl text-violet-100">Learn to spot suspicious emails, verify requests, and respond before a click becomes an incident.</p><Link href="/modules/phishing-email" className="button-primary mt-6 !bg-white !text-[#4338ca]"><icons.BookOpen size={18} />{progress.passed ? "Review lesson" : "Start lesson"}</Link></div>
      </section>
      <section className="card mt-7 p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3"><div><span className="eyebrow">Your progress</span><h2 className="mt-1 text-2xl font-black">Keep building safer instincts</h2></div><span className="text-sm font-bold">{completed} / 8 modules</span></div>
        <div className="mt-5 h-3 overflow-hidden rounded-full" style={{ background: "var(--border)" }}><div className="h-full rounded-full bg-gradient-to-r from-[#5548e8] to-[#9333ea]" style={{ width: `${completed / 8 * 100}%` }} /></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Metric icon={<icons.BookOpen />} value={`${completed}/8`} label="Modules completed" />
          <Metric icon={<icons.Award />} value={`${progress.bestScore}`} label="Best points earned" />
          <Metric icon={<icons.Shield />} value={level} label="Current status" compact />
        </div>
      </section>
      <div className="mb-5 mt-10"><span className="eyebrow">Learning roadmap</span><h2 className="mt-1 text-2xl font-black">Training modules</h2></div>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => <ModuleCard key={module.slug} module={module} passed={module.slug === "phishing-email" && progress.passed} bestScore={module.slug === "phishing-email" ? progress.bestScore : 0} />)}
      </section>
    </AppShell>
  );
}

function Metric({ icon, value, label, compact = false }: { icon: React.ReactNode; value: string; label: string; compact?: boolean }) {
  return <div className="rounded-2xl p-4 text-center" style={{ background: "var(--surface-muted)" }}><div className="mx-auto mb-2 w-fit" style={{ color: "var(--primary)" }}>{icon}</div><p className={`${compact ? "text-lg" : "text-3xl"} font-black`}>{value}</p><p className="mt-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>{label}</p></div>;
}
