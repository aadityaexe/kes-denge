import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, ArrowUpRight, Calendar, Factory, Building2, CheckCircle2, GitBranch, Shield, Zap, Code2 } from "lucide-react";
import { PortfolioItem } from "@/lib/types";

interface PortfolioHeroProps {
  project: PortfolioItem;
}

export function PortfolioHero({ project }: PortfolioHeroProps) {
  const statusLabel =
    project.status === "completed"
      ? "Production Deployed"
    : project.status === "ongoing"
    ? "Active Development"
    : "Under Maintenance";

  return (
    <section className="relative pt-20 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 border-b border-[var(--color-border)] overflow-hidden bg-base">
      {/* Background Champagne Glow & Grid Pattern */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-accent)]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container-site">
        {/* Breadcrumb Navigation & Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <Link href="/" className="hover:text-text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/portfolio" className="hover:text-text-primary transition-colors">
              Portfolio
            </Link>
            <span>/</span>
            <span className="text-[var(--color-accent)] truncate max-w-[140px] sm:max-w-none">
              {project.title.split("—")[0].trim()}
            </span>
          </nav>

          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5 rounded-full bg-surface-1 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 min-h-[36px]"
          >
            <ArrowLeft size={14} /> Back to All Projects
          </Link>
        </div>

        {/* Category & Status Badges */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] text-xs font-mono font-bold uppercase tracking-wider border border-[var(--color-accent)]/20">
            <Zap size={13} /> {project.category}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-1 border border-emerald-500/30 text-emerald-600 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            {statusLabel}
          </div>

          {project.isFeatured && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-1 border border-[var(--color-border)] text-text-muted text-xs font-mono">
              <Shield size={13} className="text-[var(--color-accent)]" /> Featured Case Study
            </div>
          )}
        </div>

        {/* Main H1 Title & One-Liner */}
        <h1 className="text-display-lg sm:text-display-xl font-bold font-display text-text-primary tracking-tight leading-[1.08] mb-4 md:mb-6 max-w-4xl break-words">
          {project.title}
        </h1>

        <p className="text-lg sm:text-2xl text-text-secondary font-light leading-relaxed max-w-3xl mb-8 md:mb-10 break-words">
          {project.oneLiner || project.shortDescription}
        </p>

        {/* Project Meta Details Card */}
        <div className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 sm:p-6 md:p-8 shadow-xl">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-start sm:items-center">
            {/* Client */}
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                <Building2 size={13} /> Client / Organization
              </p>
              <p className="text-base sm:text-lg font-bold text-text-primary">
                {project.clientName || "Enterprise Client"}
              </p>
            </div>

            {/* Industry */}
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                <Factory size={13} /> Sector / Domain
              </p>
              <p className="text-base sm:text-lg font-bold text-text-primary">
                {project.industry || "Technology"}
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                <Calendar size={13} /> Delivery Timeline
              </p>
              <p className="text-base sm:text-lg font-bold text-text-primary">
                {project.durationLabel || "Sprint Delivery"}
              </p>
            </div>

            {/* Live Actions */}
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
                Deployment Status
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-0.5">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-accent-dark)] hover:text-[var(--color-accent)] transition-colors px-3 py-1.5 rounded-lg bg-[var(--color-accent-glow)] border border-[var(--color-accent)]/30 hover:shadow-md"
                  >
                    <span>View Live Site</span>
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <span className="text-xs font-mono text-text-muted px-2.5 py-1 rounded-md bg-surface-2">
                    Private Enterprise IP
                  </span>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg bg-surface-2 border border-[var(--color-border)]"
                  >
                    <GitBranch size={13} /> Repository
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
