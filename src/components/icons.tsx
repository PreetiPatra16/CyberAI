import {
  Award, Bitcoin, BookOpen, CheckCircle2, ClipboardList, FileBadge2, FileText,
  Globe2, LayoutDashboard, LockKeyhole, Mail, Menu, Moon, Phone, Share2, Shield,
  Sparkles, Sun, UserRound, Users, X, Zap,
} from "lucide-react";

export const icons = { Award, Bitcoin, BookOpen, CheckCircle2, ClipboardList, FileBadge2, FileText, Globe2, LayoutDashboard, LockKeyhole, Mail, Menu, Moon, Phone, Share2, Shield, Sparkles, Sun, UserRound, Users, X, Zap };

export function ModuleIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = icons[name as keyof typeof icons] ?? Shield;
  return <Icon size={size} strokeWidth={2.2} aria-hidden="true" />;
}
