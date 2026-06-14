import Link from "next/link";
import { LearningModule } from "@/lib/content";
import { ModuleIcon, icons } from "./icons";

export function ModuleCard({ module, passed, bestScore }: { module: LearningModule; passed: boolean; bestScore: number }) {
  const available = module.status === "available";
  return (
    <article className="card interactive-card overflow-hidden" style={{ borderTop: `6px solid ${module.accent}` }}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: module.softAccent, color: module.accent }}><ModuleIcon name={module.icon} /></span>
          <div><h3 className="text-lg font-extrabold leading-snug">{module.title}</h3><p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Earn up to {module.maxPoints} points</p></div>
        </div>
        {available ? (
          <>
            <div className="mt-5 rounded-xl p-3" style={{ background: "var(--surface-muted)" }}>
              <div className="flex justify-between gap-3 text-sm"><span className="font-bold" style={{ color: passed ? "var(--success)" : "var(--muted)" }}>{passed ? "Completed" : "Ready to start"}</span><span>{bestScore} / {module.maxPoints} pts</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "var(--border)" }}><div className="h-full rounded-full transition-all duration-500" style={{ background: module.accent, width: `${Math.min(100, bestScore / module.maxPoints * 100)}%` }} /></div>
            </div>
            <Link href={`/modules/${module.slug}`} className="button-primary mt-4 w-full" style={{ background: module.accent }}><icons.BookOpen size={18} />{passed ? "Review lesson" : "Start lesson"}</Link>
          </>
        ) : (
          <div className="mt-5 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--surface-muted)", color: "var(--muted)" }}><span className="text-sm font-bold">Coming soon</span><icons.LockKeyhole size={18} /></div>
        )}
      </div>
    </article>
  );
}
