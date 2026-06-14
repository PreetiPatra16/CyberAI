"use client";

import { useState } from "react";
import { icons } from "@/components/icons";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);

  async function submitAuth() {
    try {
      const supabase = createSupabaseBrowserClient();
      setWorking(true); setMessage("");
      const result = mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
      if (result.error) setMessage(result.error.message);
      else window.location.href = "/dashboard";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setWorking(false);
    }
  }

  async function launchDemo() {
    try {
      setWorking(true); setMessage("");
      const result = await createSupabaseBrowserClient().auth.signInAnonymously({ options: { data: { display_name: "Demo Learner" } } });
      if (result.error) setMessage(result.error.message);
      else window.location.href = "/dashboard";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Demo sign-in failed.");
    } finally {
      setWorking(false);
    }
  }
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_.9fr]">
      <section className="relative hidden overflow-hidden bg-[#161f31] p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-[#5548e8]/40 blur-3xl" />
        <div className="relative flex items-center gap-3 text-2xl font-black"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#5548e8]"><icons.Shield /></span><span><b className="text-[#ff5664]">Cyber</b><b className="text-[#6097ff]">AI</b></span></div>
        <div className="relative max-w-xl">
          <span className="eyebrow !text-[#54d9c6]">Security training that sticks</span>
          <h1 className="mt-5 text-5xl font-black leading-tight">Build safer instincts, one decision at a time.</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">Practice realistic scenarios, understand every answer, and turn confidence into measurable security awareness.</p>
        </div>
        <div className="relative flex gap-8 text-sm text-slate-300"><span>8 learning modules</span><span>Immediate feedback</span><span>Progress insights</span></div>
      </section>
      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 text-2xl font-black lg:hidden"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#5548e8] text-white"><icons.Shield /></span><span><b className="text-[#ff5664]">Cyber</b><b className="text-[#4f7eff]">AI</b></span></div>
          <span className="eyebrow">Welcome to CyberAI</span>
          <h2 className="mt-2 text-3xl font-black">{mode === "login" ? "Continue your training" : "Create your learner account"}</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>Your account and learning progress are securely stored in Supabase.</p>
          <form className="mt-7 space-y-4" onSubmit={(event) => event.preventDefault()}>
            {mode === "signup" && <Field label="Display name" type="text" placeholder="Your name" value={displayName} onChange={setDisplayName} />}
            <Field label="Email" type="email" placeholder="you@company.com" value={email} onChange={setEmail} />
            <Field label="Password" type="password" placeholder="At least 8 characters" value={password} onChange={setPassword} />
            <button className="button-primary w-full" type="button" onClick={submitAuth} disabled={!email || !password || working}>{working ? "Working..." : mode === "login" ? "Sign in with Supabase" : "Create account"}</button>
          </form>
          {message && <p className="mt-4 rounded-xl bg-red-100 p-3 text-sm font-bold text-red-800">{message}</p>}
          <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}><span className="h-px flex-1" style={{ background: "var(--border)" }} />or explore now<span className="h-px flex-1" style={{ background: "var(--border)" }} /></div>
          <button className="button-secondary w-full" onClick={launchDemo} disabled={working}><icons.Sparkles size={18} />Launch isolated Supabase demo</button>
          <button className="mt-6 w-full text-sm font-bold" onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: "var(--primary)" }}>{mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}</button>
        </div>
      </section>
    </main>
  );
}

function Field({ label, type, placeholder, value, onChange }: { label: string; type: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-sm font-bold">{label}<input className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none" style={{ borderColor: "var(--border)" }} type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
