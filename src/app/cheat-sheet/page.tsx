"use client";
import { AppShell } from "@/components/app-shell";
import { ModuleIcon, icons } from "@/components/icons";
import { useProgress } from "@/components/progress-provider";
import { getModuleCheatSheet, modules } from "@/lib/content";
import { getModuleProgress } from "@/lib/progress";
import { Locked, PageTitle } from "@/components/page-elements";

export default function CheatSheetPage() {
  const { progress } = useProgress();
  const passedModules = modules.filter((module) => getModuleProgress(progress, module.slug).passed);
  return (
    <AppShell>
      <PageTitle eyebrow="Quick reference" title="Security cheat sheet" body="Key takeaways from modules you have completed." />
      {passedModules.length > 0 ? (
        <div className="mt-7 space-y-5">
          {passedModules.map((module) => (
            <article key={module.slug} className="card border-l-4 p-6 sm:p-8" style={{ borderLeftColor: module.accent }}>
              <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: module.softAccent, color: module.accent }}><ModuleIcon name={module.icon} /></span><h2 className="text-xl font-black">{module.title}</h2></div>
              <ul className="mt-6 space-y-4">{getModuleCheatSheet(module.slug).map((item) => <li key={item} className="flex gap-3 leading-6"><icons.CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={19} /><span style={{ color: "var(--muted)" }}>{item}</span></li>)}</ul>
            </article>
          ))}
        </div>
      ) : (
        <Locked title="Pass a module quiz to unlock your first cheat sheet." href="/modules/phishing-email" action="Start learning" />
      )}
    </AppShell>
  );
}
