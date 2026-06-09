"use client";
import { AppShell } from "@/components/app-shell";
import { ModuleIcon } from "@/components/icons";
import { useProgress } from "@/components/progress-provider";
import { modules } from "@/lib/content";
import { PageTitle } from "@/components/page-elements";
export default function BadgesPage() { const { progress } = useProgress(); return <AppShell><PageTitle eyebrow="Achievements" title="Your badges" body="Complete modules to turn secure decisions into shareable achievements." /><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{modules.map((module) => { const earned = module.slug === "phishing-email" && progress.passed; return <article key={module.slug} className={`card p-6 text-center ${earned ? "" : "opacity-60"}`}><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl" style={{ background: module.softAccent, color: module.accent }}><ModuleIcon name={module.icon} size={30} /></span><h2 className="mt-4 font-black">{module.title}</h2><p className="mt-2 text-sm font-bold" style={{ color: earned ? "var(--success)" : "var(--muted)" }}>{earned ? "Earned" : "Locked"}</p></article>; })}</div></AppShell>; }
