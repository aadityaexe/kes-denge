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
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Activity,
  Mail,
  HelpCircle,
  CreditCard,
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
    { label: "Active Services", count: stats?.services ?? "-", icon: Layers, href: "/admin/services", color: "text-blue-600 bg-blue-500/10" },
    { label: "Ready Platforms", count: stats?.products ?? "-", icon: Package, href: "/admin/products", color: "text-teal-600 bg-teal-500/10" },
    { label: "Portfolio Projects", count: stats?.portfolio ?? "-", icon: Briefcase, href: "/admin/portfolio", color: "text-amber-600 bg-amber-500/10" },
    { label: "Pricing Packages", count: stats?.pricing ?? "-", icon: CreditCard, href: "/admin/pricing", color: "text-emerald-600 bg-emerald-500/10" },
    { label: "Client Partners", count: stats?.clients ?? "-", icon: Building2, href: "/admin/clients", color: "text-emerald-600 bg-emerald-500/10" },
    { label: "Testimonials", count: stats?.testimonials ?? "-", icon: Star, href: "/admin/testimonials", color: "text-purple-600 bg-purple-500/10" },
    { label: "Contact Leads", count: stats?.messages ?? "-", icon: MessageSquare, href: "/admin/messages", color: "text-rose-600 bg-rose-500/10", badge: stats?.newMessages > 0 ? `${stats.newMessages} New` : undefined },
    { label: "Team Members", count: stats?.team ?? "-", icon: Users, href: "/admin/team", color: "text-indigo-600 bg-indigo-500/10" },
    { label: "Articles & Blog", count: stats?.blogs ?? "-", icon: BookOpen, href: "/admin/blog", color: "text-cyan-600 bg-cyan-500/10" },
    { label: "FAQ Deliverables", count: stats?.faqs ?? "-", icon: HelpCircle, href: "/admin/faq", color: "text-violet-600 bg-violet-500/10" },
    { label: "Media Assets", count: stats?.media ?? "-", icon: ImageIcon, href: "/admin/media", color: "text-zinc-600 bg-zinc-500/10" },
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

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Welcome Banner */}
        <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
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
        <div className="p-4 rounded-xl bg-surface-2/60 border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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


        {/* Stats Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Content & Publishing Directory
            </h3>
            <span className="text-[11px] text-text-muted">
              Click any category to manage content items
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  href={card.href}
                  className="group bg-surface-1 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
                      <Icon size={16} />
                    </div>
                    {card.badge ? (
                      <span className="px-1.5 py-0.2 text-[9px] font-bold bg-rose-500 text-white rounded-full">
                        {card.badge}
                      </span>
                    ) : (
                      <ArrowUpRight size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-display text-text-primary group-hover:text-[var(--color-accent-dark)] transition-colors">
                      {card.count}
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5 font-medium truncate">
                      {card.label}
                    </div>
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
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-surface-2">
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
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-surface-2">
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
