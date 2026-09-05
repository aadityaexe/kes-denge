"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Package,
  Users,
  Building2,
  Star,
  MessageSquare,
  BookOpen,
  HelpCircle,
  CreditCard,
  Settings,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  Globe,
} from "lucide-react";

interface AdminSidebarProps {
  userEmail?: string;
  userName?: string;
  unreadMessagesCount?: number;
}

const navLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Services", href: "/admin/services", icon: Layers },
  { label: "Products / Platforms", href: "/admin/products", icon: Package },
  { label: "Portfolio / Work", href: "/admin/portfolio", icon: Briefcase },
  { label: "Clients & Logos", href: "/admin/clients", icon: Building2 },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Team Members", href: "/admin/team", icon: Users },
  { label: "Contact Leads", href: "/admin/messages", icon: MessageSquare, isInbox: true },
  { label: "Blog Posts", href: "/admin/blog", icon: BookOpen },
  { label: "Pricing Tiers", href: "/admin/pricing", icon: CreditCard },
  { label: "FAQs", href: "/admin/faq", icon: HelpCircle },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ userEmail, userName, unreadMessagesCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface-2 border-r border-[var(--color-border)] flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)] bg-surface-1">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white font-bold font-display text-sm shadow-sm">
            M
          </div>
          <span className="font-display font-bold text-text-primary text-base tracking-tight">
            M<span className="text-[var(--color-accent-dark)]">ARK</span>
            <span className="ml-1 text-[10px] uppercase font-mono tracking-widest text-text-muted bg-surface-3 px-1.5 py-0.5 rounded border border-[var(--color-border)]">
              CMS
            </span>
          </span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        <div className="px-3 py-1.5 text-[10px] font-mono tracking-wider text-text-muted uppercase font-semibold">
          Overview & Content
        </div>

        {navLinks.slice(0, 7).map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-text-primary text-white shadow-sm font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? "text-[var(--color-accent-light)]" : "text-text-muted"} />
                <span>{item.label}</span>
              </div>
              {item.isInbox && unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-accent)] text-white">
                  {unreadMessagesCount}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-3 px-3 py-1.5 text-[10px] font-mono tracking-wider text-text-muted uppercase font-semibold">
          Configuration & Media
        </div>

        {navLinks.slice(7).map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-text-primary text-white shadow-sm font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
              }`}
            >
              <Icon size={18} className={isActive ? "text-[var(--color-accent-light)]" : "text-text-muted"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Live Site & User Footer */}
      <div className="p-3 border-t border-[var(--color-border)] bg-surface-1 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary bg-surface-2 border border-[var(--color-border)] hover:border-black/20 transition-all"
        >
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-[var(--color-accent-dark)]" />
            <span>View Live Site</span>
          </div>
          <ExternalLink size={13} className="text-text-muted" />
        </Link>

        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-xs font-semibold text-text-primary truncate">{userName || "Administrator"}</span>
            <span className="text-[11px] text-text-muted truncate">{userEmail || "admin@mark.com"}</span>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              title="Logout"
              className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
