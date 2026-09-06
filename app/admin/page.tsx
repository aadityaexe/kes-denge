"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Package,
  Briefcase,
  Building2,
  Star,
  Users,
  MessageSquare,
  BookOpen,
  Image as ImageIcon,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Activity,
  Mail,
  HelpCircle,
  CreditCard,
  Settings,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
        setRecentMessages(data.recentMessages || []);
        setRecentProjects(data.recentProjects || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);


  const statCards = [
    { label: "Active Services", count: stats?.services ?? "-", icon: Layers, href: "/admin/services" },
    { label: "Ready Platforms", count: stats?.products ?? "-", icon: Package, href: "/admin/products" },
    { label: "Portfolio Projects", count: stats?.portfolio ?? "-", icon: Briefcase, href: "/admin/portfolio" },
    { label: "Pricing Packages", count: stats?.pricing ?? "-", icon: CreditCard, href: "/admin/pricing" },
    { label: "Client Partners", count: stats?.clients ?? "-", icon: Building2, href: "/admin/clients" },
    { label: "Testimonials", count: stats?.testimonials ?? "-", icon: Star, href: "/admin/testimonials" },
    { label: "Contact Leads", count: stats?.messages ?? "-", icon: MessageSquare, href: "/admin/messages", badge: stats?.newMessages > 0 ? `${stats.newMessages} New` : undefined },
    { label: "Team Members", count: stats?.team ?? "-", icon: Users, href: "/admin/team" },
    { label: "Articles & Blog", count: stats?.blogs ?? "-", icon: BookOpen, href: "/admin/blog" },
    { label: "FAQ Deliverables", count: stats?.faqs ?? "-", icon: HelpCircle, href: "/admin/faq" },
    { label: "Media Assets", count: stats?.media ?? "-", icon: ImageIcon, href: "/admin/media" },
    { label: "Site Settings", count: "Config", icon: Settings, href: "/admin/settings" },
  ];

  const publicRoutes = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Dashboard Overview"
        description="Monitor system analytics, lead inquiries, content status, and live website health"
        onRefresh={fetchStats}
        isLoading={isLoading}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl">
        {/* Welcome Banner */}
        <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-glow)] border border-[var(--color-border-accent)] flex items-center justify-center text-[var(--color-accent-dark)]">
              <Layers size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Welcome to MARK Studio CMS</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Manage services, case studies, team, client logos, blogs, and inquiries with zero code edits.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/" target="_blank">
              <Button size="sm" className="text-xs">
                <span>View Live Site</span>
                <ExternalLink size={13} className="ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Site Quick Access & Information Strip */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-surface-2/60 border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
            <ExternalLink size={14} className="text-[var(--color-accent-dark)]" />
            <span>Public Pages Quick Access:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {publicRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                target="_blank"
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-surface-1 border border-[var(--color-border)] text-text-secondary hover:text-text-primary hover:border-[var(--color-accent)]/50 transition-colors"
              >
                {route.label} ↗
              </Link>
            ))}
          </div>
        </div>

        {/* System & Architecture Health Information Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-1 border border-[var(--color-border)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary">Database Connected</p>
              <p className="text-[11px] text-text-muted font-mono">MongoDB Atlas Cluster</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-1 border border-[var(--color-border)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary">Admin Security Active</p>
              <p className="text-[11px] text-text-muted font-mono">JWT HttpOnly Session</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-1 border border-[var(--color-border)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary">Next.js 16 App Router</p>
              <p className="text-[11px] text-text-muted font-mono">Server Components Ready</p>
            </div>
          </div>
        </div>


        {/* Content & Publishing Directory */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Content & Publishing Directory
              </h3>
            </div>
            <span className="text-[11px] text-text-muted hidden sm:inline">
              Click any category to manage content items
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  href={card.href}
                  className="group relative bg-surface-1 hover:bg-surface-2/80 p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-accent)] hover:shadow-sm transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Row: Icon + Count/Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-2 border border-[var(--color-border)] text-text-secondary group-hover:text-[var(--color-accent-dark)] group-hover:border-[var(--color-border-accent)] group-hover:bg-[var(--color-accent-glow)] flex items-center justify-center transition-all duration-300 shrink-0">
                      <Icon size={15} strokeWidth={1.75} />
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {card.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/25 rounded-full uppercase tracking-wider">
                          {card.badge}
                        </span>
                      )}
                      {isNaN(Number(card.count)) ? (
                        <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--color-accent-dark)] bg-surface-2 px-1.5 py-0.5 rounded border border-[var(--color-border)] group-hover:border-[var(--color-border-accent)] transition-colors">
                          {card.count}
                        </span>
                      ) : (
                        <span className="text-xl sm:text-2xl font-bold font-display text-text-primary group-hover:text-[var(--color-accent-dark)] transition-colors leading-none">
                          {card.count}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Label + Interactive Arrow */}
                  <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-[var(--color-border)]/50 group-hover:border-[var(--color-border-accent)]/30 transition-colors">
                    <span className="text-[11px] font-medium text-text-secondary group-hover:text-text-primary transition-colors truncate">
                      {card.label}
                    </span>
                    <ArrowUpRight
                      size={12}
                      className="text-text-muted/50 group-hover:text-[var(--color-accent-dark)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout: Recent Leads & Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inquiries */}
          <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 sm:p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-surface-2">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[var(--color-accent-dark)]" />
                <h3 className="font-bold text-sm text-text-primary">Recent Lead Inquiries</h3>
              </div>
              <Link href="/admin/messages" className="text-xs text-[var(--color-accent-dark)] hover:underline font-semibold">
                View All Leads &rarr;
              </Link>
            </div>

            <div className="divide-y divide-[var(--color-border)] flex-1 overflow-y-auto max-h-[380px]">
              {recentMessages.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted">No messages received yet.</div>
              ) : (
                recentMessages.map((msg) => (
                  <div key={msg._id} className="p-4 hover:bg-surface-2 transition-colors flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-text-primary truncate">{msg.name}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                          msg.status === "new" ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-600"
                        }`}>
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted truncate mt-0.5">{msg.email} • {msg.projectType || "General Inquiry"}</p>
                      <p className="text-xs text-text-secondary line-clamp-1 mt-1 font-light">{msg.message}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-text-muted block">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                      <a
                        href={`mailto:${msg.email}?subject=Regarding your inquiry with MARK Technologies`}
                        className="mt-1 inline-flex items-center gap-1 text-[10px] text-[var(--color-accent-dark)] hover:underline"
                      >
                        <Mail size={10} /> Reply
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Portfolio Projects */}
          <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 sm:p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-surface-2">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-[var(--color-accent-dark)]" />
                <h3 className="font-bold text-sm text-text-primary">Recent Case Studies</h3>
              </div>
              <Link href="/admin/portfolio" className="text-xs text-[var(--color-accent-dark)] hover:underline font-semibold">
                Manage Portfolio &rarr;
              </Link>
            </div>

            <div className="divide-y divide-[var(--color-border)] flex-1 overflow-y-auto max-h-[380px]">
              {recentProjects.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted">No portfolio items available.</div>
              ) : (
                recentProjects.map((item) => (
                  <div key={item._id} className="p-4 hover:bg-surface-2 transition-colors flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-text-primary truncate">{item.title}</span>
                        <span className="px-2 py-0.5 text-[9px] font-medium bg-surface-3 text-text-secondary rounded">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted truncate mt-0.5">Client: {item.clientName || "Enterprise"} • {item.industry || "Software"}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.isFeatured && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded">
                          Featured
                        </span>
                      )}
                      <Link
                        href={`/portfolio/${item.slug}`}
                        target="_blank"
                        className="p-1 rounded text-text-muted hover:text-text-primary"
                        title="View Case Study"
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
