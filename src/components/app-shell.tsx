"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { icons } from "./icons";
import { useProgress } from "./progress-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: icons.LayoutDashboard },
  { href: "/profile", label: "Profile", icon: icons.UserRound },
  { href: "/badges", label: "Badges", icon: icons.Award },
  { href: "/certificate", label: "Certificate", icon: icons.FileBadge2 },
  { href: "/cheat-sheet", label: "Cheat Sheet", icon: icons.FileText },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { progress, updateProgress } = useProgress();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", progress.theme === "dark");
  }, [progress.theme]);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 lg:hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <Brand />
        <button className="button-secondary !min-h-10 !p-2.5" onClick={() => setOpen(true)} aria-label="Open navigation"><icons.Menu size={20} /></button>
      </header>
      {open && <button className="fixed inset-0 z-40 bg-black/45 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0`} style={{ background: "#182334", borderColor: "#334155", color: "#d9e2ef" }}>
        <div className="mb-5 flex items-center justify-between"><Brand /><button className="p-2 lg:hidden" onClick={() => setOpen(false)}><icons.X size={20} /></button></div>
        <div className="mb-5 rounded-xl bg-white/10 p-3">
          <p className="text-sm font-bold text-white">{progress.displayName}</p>
          <p className="mt-1 text-xs text-slate-400">Local demo workspace</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-[#5548e8] text-white" : "hover:bg-white/10"}`}><item.icon size={19} />{item.label}</Link>;
          })}
        </nav>
        <button className="mt-auto flex items-center gap-3 border-t border-white/15 px-3 pt-5 text-sm font-semibold" onClick={() => updateProgress((current) => ({ ...current, theme: current.theme === "dark" ? "light" : "dark" }))}>
          {progress.theme === "dark" ? <icons.Sun size={19} /> : <icons.Moon size={19} />} {progress.theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button className="mt-3 flex items-center gap-3 rounded-xl bg-red-500/90 px-3 py-3 text-sm font-semibold text-white" onClick={async () => { await createSupabaseBrowserClient()?.auth.signOut(); window.location.href = "/auth"; }}>Log out</button>
      </aside>
      <main className="min-w-0"><div className="mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:px-10 lg:py-10">{children}</div></main>
    </div>
  );
}

function Brand() {
  return <Link href="/dashboard" className="flex items-center gap-2 text-xl font-black text-white"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#5548e8]"><icons.Shield size={20} /></span><span><b className="text-[#ff4f5e]">Cyber</b><b className="text-[#4f8cff]">AI</b></span></Link>;
}
