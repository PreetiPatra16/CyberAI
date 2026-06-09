import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ModuleIcon, icons } from "@/components/icons";
import { getModule, phishingLesson } from "@/lib/content";

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const learningModule = getModule(slug);
  if (!learningModule) notFound();
  if (learningModule.status !== "available") return <AppShell><div className="card mx-auto max-w-2xl p-8 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl" style={{ background: learningModule.softAccent, color: learningModule.accent }}><ModuleIcon name={learningModule.icon} size={30} /></span><span className="eyebrow mt-6 inline-block">Coming soon</span><h1 className="mt-2 text-3xl font-black">{learningModule.title}</h1><p className="mx-auto mt-3 max-w-lg" style={{ color: "var(--muted)" }}>{learningModule.description} This module is already modeled in the roadmap and can be added through a content seed migration.</p><Link href="/dashboard" className="button-primary mt-7">Back to roadmap</Link></div></AppShell>;
  return (
    <AppShell>
      <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-bold" style={{ color: "var(--primary)" }}>← Back to dashboard</Link>
      <section className="overflow-hidden rounded-[1.75rem] p-7 text-white sm:p-10" style={{ background: `linear-gradient(135deg, ${learningModule.accent}, #3764d8)` }}><div className="flex items-start gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20"><ModuleIcon name={learningModule.icon} size={28} /></span><div><span className="text-xs font-black uppercase tracking-[.18em] text-white/75">Available module · {learningModule.maxPoints} points</span><h1 className="mt-2 text-3xl font-black sm:text-4xl">{learningModule.title}</h1><p className="mt-3 max-w-2xl text-white/85">{learningModule.description}</p></div></div></section>
      <section className="mt-7 grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">{phishingLesson.map((section, index) => <article key={section.title} className="card p-6 sm:p-7"><div className="flex gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black" style={{ background: learningModule.softAccent, color: learningModule.accent }}>{index + 1}</span><div><h2 className="text-xl font-black">{section.title}</h2>{section.body && <p className="mt-3 leading-7" style={{ color: "var(--muted)" }}>{section.body}</p>}{section.bullets && <ul className="mt-3 space-y-3">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-3 leading-6" style={{ color: "var(--muted)" }}><icons.CheckCircle2 className="mt-0.5 shrink-0" size={19} color={learningModule.accent} />{bullet}</li>)}</ul>}</div></div></article>)}</div>
        <aside className="lg:sticky lg:top-7 lg:self-start"><div className="card p-5"><span className="eyebrow">Knowledge check</span><h2 className="mt-2 text-xl font-black">Ready to spot the lure?</h2><p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>Answer four scenarios, capture your confidence, and score at least 350 points to pass.</p><Link href="/modules/phishing-email/quiz" className="button-primary mt-5 w-full">Start quiz <span>→</span></Link></div></aside>
      </section>
    </AppShell>
  );
}
