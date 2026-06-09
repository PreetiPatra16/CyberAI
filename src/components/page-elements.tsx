import Link from "next/link";
import { icons } from "./icons";

export function PageTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <div><span className="eyebrow">{eyebrow}</span><h1 className="mt-1 text-3xl font-black">{title}</h1><p className="mt-2" style={{ color: "var(--muted)" }}>{body}</p></div>;
}

export function Locked({ title, href, action }: { title: string; href: string; action: string }) {
  return <div className="card mt-7 p-8 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl" style={{ background: "var(--surface-muted)", color: "var(--muted)" }}><icons.LockKeyhole size={30} /></span><h2 className="mt-5 text-xl font-black">{title}</h2><Link href={href} className="button-primary mt-6">{action}</Link></div>;
}
