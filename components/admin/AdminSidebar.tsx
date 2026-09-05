"use client";

import { useState, useEffect } from "react";
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
  Menu,
  X,
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
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Top Header Bar (lg:hidden) */}
      <div className="lg:hidden sticky top-0 z-40 bg-surface-1 border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between shadow-xs">
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
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="min-h-[44px] min-w-[44px] p-2 rounded-lg border border-[var(--color-border)] text-text-secondary hover:text-text-primary bg-surface-2 flex items-center justify-center transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (drawer on mobile/tablet, fixed sticky on desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-surface-2 border-r border-[var(--color-border)] flex flex-col h-full transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:w-64 lg:sticky lg:top-0 lg:z-30 select-none shadow-2xl lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)] bg-surface-1 shrink-0">
          <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
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
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation drawer"
          >
            <X size={18} />
          </button>
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
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all min-h-[40px] ${
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
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all min-h-[40px] ${
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
        <div className="p-3 border-t border-[var(--color-border)] bg-surface-1 space-y-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary bg-surface-2 border border-[var(--color-border)] hover:border-black/20 transition-all min-h-[38px]"
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
              <span className="text-[11px] text-text-muted truncate">{userEmail || "admin@mark2.in"}</span>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                title="Logout"
                className="p-2 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
