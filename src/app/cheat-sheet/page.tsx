"use client";
import { AppShell } from "@/components/app-shell";
import { icons } from "@/components/icons";
import { useProgress } from "@/components/progress-provider";
import { phishingCheatSheet } from "@/lib/content";
import { Locked, PageTitle } from "@/components/page-elements";
export default function CheatSheetPage() { const { progress } = useProgress(); return <AppShell><PageTitle eyebrow="Quick reference" title="Security cheat sheet" body="Key takeaways from modules you have completed." />{progress.passed ? <article className="card mt-7 border-l-4 p-6 sm:p-8" style={{ borderLeftColor: "#19b9a5" }}><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#d8faf4] text-[#19b9a5]"><icons.Mail /></span><h2 className="text-xl font-black">Phishing: The Lure (Email)</h2></div><ul className="mt-6 space-y-4">{phishingCheatSheet.map((item) => <li key={item} className="flex gap-3 leading-6"><icons.CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={19} /><span style={{ color: "var(--muted)" }}>{item}</span></li>)}</ul></article> : <Locked title="Pass the phishing quiz to unlock your first cheat sheet." href="/modules/phishing-email" action="Start learning" />}</AppShell>; }
