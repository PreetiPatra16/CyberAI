"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { icons } from "@/components/icons";
import { ModuleCard } from "@/components/module-card";
import { useProgress } from "@/components/progress-provider";
import { modules } from "@/lib/content";
import { completedCount, getModuleProgress, levelFor, totalPoints } from "@/lib/progress";

export default function DashboardPage() {
  const { progress } = useProgress();
  const completed = completedCount(progress);
  const earnedPoints = totalPoints(progress);
  const maxPoints = modules.reduce((total, module) => total + module.maxPoints, 0);
  const scoreAttainment = Math.round((earnedPoints / maxPoints) * 100);
  const { level, statusName } = levelFor(earnedPoints);
  const upNext = modules.find((module) => !getModuleProgress(progress, module.slug).passed) ?? modules[modules.length - 1];
  const upNextProgress = getModuleProgress(progress, upNext.slug);
  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#5145df] to-[#9333ea] p-6 text-white shadow-xl sm:p-9">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" /><div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-fuchsia-300/15 blur-2xl" />
        <div className="relative max-w-3xl"><span className="text-xs font-black uppercase tracking-[.18em] text-violet-200">Up next</span><h1 className="mt-3 text-3xl font-black sm:text-4xl">{upNext.title}</h1><p className="mt-3 max-w-xl text-violet-100">{upNext.description}</p><Link href={`/modules/${upNext.slug}`} className="button-primary mt-6 !bg-white !text-[#4338ca]"><icons.BookOpen size={18} />{upNextProgress.passed ? "Review lesson" : "Start lesson"}</Link></div>
      </section>
      <section className="card mt-7 p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3"><div><span className="eyebrow">Overall progress</span><h2 className="mt-1 text-2xl font-black">Keep building safer instincts</h2></div><span className="text-sm font-bold">{completed} / 8 modules</span></div>
        <div className="mt-5 h-3 overflow-hidden rounded-full" style={{ background: "var(--border)" }}><div className="h-full rounded-full bg-gradient-to-r from-[#5548e8] to-[#9333ea] transition-all duration-700" style={{ width: `${(completed / 8) * 100}%` }} /></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Metric icon={<icons.BookOpen />} value={`${completed}/8`} label="Modules completed" />
          <Metric icon={<icons.Award />} value={`${earnedPoints}`} label="Total points earned" />
          <Metric icon={<icons.Sparkles />} value={`${scoreAttainment}%`} label="Score attainment" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl p-4 text-center" style={{ background: "var(--surface-muted)" }}><p className="text-2xl font-black" style={{ color: "var(--primary)" }}>Lv. {level}</p><p className="mt-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>Level</p></div>
          <div className="rounded-2xl p-4 text-center" style={{ background: "var(--surface-muted)" }}><p className="text-2xl font-black" style={{ color: "var(--success)" }}>{statusName}</p><p className="mt-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>Status</p></div>
        </div>
      </section>
      <div className="mb-5 mt-10"><span className="eyebrow">Learning roadmap</span><h2 className="mt-1 text-2xl font-black">Training modules</h2></div>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => { const moduleProgress = getModuleProgress(progress, module.slug); return <ModuleCard key={module.slug} module={module} passed={moduleProgress.passed} bestScore={moduleProgress.bestScore} />; })}
      </section>
    </AppShell>
  );
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="rounded-2xl p-4 text-center" style={{ background: "var(--surface-muted)" }}><div className="mx-auto mb-2 w-fit" style={{ color: "var(--primary)" }}>{icon}</div><p className="text-3xl font-black">{value}</p><p className="mt-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>{label}</p></div>;
}
