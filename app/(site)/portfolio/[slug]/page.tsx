import { notFound } from "next/navigation";
import {
  getPortfolioBySlug,
  getPortfolioData,
  getRelatedPortfolioItems,
  getServicesBySlugs,
} from "@/lib/db-helpers";
import { PortfolioItem, Service } from "@/lib/types";

export const revalidate = 3600;
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioVisualShowcase } from "@/components/portfolio/PortfolioVisualShowcase";
import { PortfolioChallengeSolution } from "@/components/portfolio/PortfolioChallengeSolution";
import { PortfolioKeyFeatures } from "@/components/portfolio/PortfolioKeyFeatures";
import { PortfolioImpactMetrics } from "@/components/portfolio/PortfolioImpactMetrics";
import { PortfolioTechStack } from "@/components/portfolio/PortfolioTechStack";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Quote,
  Shield,
  Zap,
  Users,
  Layers,
  Smartphone,
  Building2,
  Code2,
  Search,
  Cpu,
} from "lucide-react";
import { Metadata } from "next";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe,
  Smartphone,
  Building2,
  Code2,
  Search,
  Cpu,
  Layers,
  Shield,
  Zap,
};

export async function generateStaticParams() {
  const list = await getPortfolioData();
  return list.map((item: any) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getPortfolioBySlug(slug)) as PortfolioItem | null;

  if (!project) {
    return {
      title: "Project Not Found | MARK Technologies",
      description: "The requested case study could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";
  const canonicalUrl = `${siteUrl}/portfolio/${project.slug}`;
  const metaTitle = project.metaTitle
    ? project.metaTitle.replace(/\s*\|\s*Kas Denge.*$/i, "").replace(/\s*—\s*Kas Denge.*$/i, "").replace(/\s*\|\s*MARK.*$/i, "").replace(/\s*—\s*MARK.*$/i, "")
    : `${project.title} — Case Study`;
  const metaDescription =
    project.metaDescription ||
    project.shortDescription ||
    project.oneLiner ||
    `Explore how MARK engineered ${project.title} with high scalability, low latency, and modern software architecture.`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: project.keywords && project.keywords.length > 0 ? project.keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: "MARK Technologies",
      type: "article",
      images: [
        {
          url: project.coverImage || project.heroImage || `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [project.coverImage || project.heroImage || `${siteUrl}/twitter-image`],
    },
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (await getPortfolioBySlug(slug)) as PortfolioItem | null;

  if (!project || project.isActive === false) {
    notFound();
  }

  // Fetch related services used to build this project
  const relatedServices = project.relatedServiceSlugs && project.relatedServiceSlugs.length > 0
    ? ((await getServicesBySlugs(project.relatedServiceSlugs)) as Service[])
    : [];

  // Fetch related portfolio projects (same category or others)
  const relatedProjects = (await getRelatedPortfolioItems(project.slug, project.category, 3)) as PortfolioItem[];

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";
  const pageUrl = `${siteUrl}/portfolio/${project.slug}`;

  // Structured Data (Schema.org CreativeWork / SoftwareApplication)
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": ["CreativeWork", "SoftwareApplication"],
    name: project.title,
    headline: project.oneLiner || project.title,
    description: project.shortDescription || project.oneLiner,
    applicationCategory: project.category,
    operatingSystem: "Web, Cloud, Cross-Platform",
    datePublished: project.launchDate || (project.createdAt ? new Date(project.createdAt).toISOString() : "2025-01-01"),
    customer: project.clientName ? {
      "@type": "Organization",
      name: project.clientName,
    } : undefined,
    provider: {
      "@type": "Organization",
      name: "MARK Technologies",
      url: siteUrl,
      logo: `${siteUrl}/opengraph-image`,
    },
    url: pageUrl,
    author: {
      "@type": "Organization",
      name: "MARK Technologies",
      url: siteUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: `${siteUrl}/portfolio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <main id="main-content" className="min-h-screen bg-base relative overflow-hidden">
      {/* Schema.org JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 1. HERO SECTION */}
      <PortfolioHero project={project} />

      {/* 2. INTERACTIVE TELEMETRY & SYSTEM SHOWCASE */}
      <PortfolioVisualShowcase project={project} />

      {/* 3. PROJECT OVERVIEW & SCOPE */}
      <section id="overview" className="section-padding border-b border-[var(--color-border)]">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-4 uppercase tracking-widest border border-[var(--color-border)]">
                Project Scope & Mandate
              </div>
              <h2 className="text-display-md font-bold font-display text-text-primary tracking-tight leading-tight">
                Architecting for Mission-Critical Velocity
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <p className="text-lg md:text-xl text-text-secondary font-light leading-relaxed">
                {project.overview || project.fullDescription || project.problem}
              </p>
              <p className="text-base text-text-secondary leading-relaxed">
                Every component of {project.title.split("—")[0].trim()} was engineered with high-throughput distributed principles. We eliminated latency bottlenecks, established clean modular component systems, and enforced automated CI/CD deployment pipelines for continuous delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHALLENGE & SOLUTION */}
      <PortfolioChallengeSolution project={project} />

      {/* 5. KEY FEATURES BENTO GRID */}
      <PortfolioKeyFeatures project={project} />

      {/* 6. RESULTS & IMPACT METRICS */}
      <PortfolioImpactMetrics project={project} />

      {/* 7. TECHNOLOGIES & TOOLS */}
      <PortfolioTechStack project={project} />

      {/* 8. TESTIMONIAL & TEAM SECTION */}
      {(project.testimonial || (project.teamMembers && project.teamMembers.length > 0)) && (
        <section id="team-testimonial" className="section-padding border-b border-[var(--color-border)] bg-surface-2/10">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Testimonial Quote */}
              {project.testimonial && (
                <div className={`${project.teamMembers && project.teamMembers.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}`}>
                  <div className="p-5 sm:p-8 md:p-12 rounded-[var(--radius-xl)] bg-surface-1 border border-[var(--color-border)] shadow-xl relative overflow-hidden">
                    <div className="absolute top-6 right-8 text-[var(--color-accent)]/20 pointer-events-none">
                      <Quote size={80} />
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] text-xs font-mono font-bold uppercase mb-6">
                      Client Endorsement
                    </div>

                    <p className="text-xl sm:text-2xl font-light italic text-text-primary leading-relaxed mb-8 relative z-10">
                      &ldquo;{project.testimonial.quote}&rdquo;
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] text-surface-1 flex items-center justify-center font-bold text-lg">
                        {project.testimonial.authorName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-text-primary text-base">
                          {project.testimonial.authorName}
                        </p>
                        <p className="text-sm text-text-muted">
                          {project.testimonial.authorRole}
                          {project.testimonial.company ? ` • ${project.testimonial.company}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Team */}
              {project.teamMembers && project.teamMembers.length > 0 && (
                <div className={`${project.testimonial ? "lg:col-span-5" : "lg:col-span-12"} space-y-6`}>
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
                      <Users size={12} /> Engineering Pod
                    </div>
                    <h3 className="text-2xl font-bold font-display text-text-primary mb-2">
                      Key Project Contributors
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      Senior architects and engineers who led the delivery of this engagement.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {project.teamMembers.map((member, idx) => (
                      <Link
                        key={idx}
                        href={member.teamMemberSlug ? `/team/${member.teamMemberSlug}` : `/team`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-surface-1 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:bg-surface-2 transition-all group"
                      >
                        <div className="w-11 h-11 rounded-full bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-sm font-bold text-[var(--color-accent-dark)] shrink-0">
                          {member.teamMemberName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-text-primary group-hover:text-[var(--color-accent)] transition-colors truncate">
                            {member.teamMemberName}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {member.roleOnProject}
                          </p>
                        </div>
                        <ArrowUpRight size={16} className="text-text-muted group-hover:text-[var(--color-accent)] transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 9. RELATED SERVICES (INTERNAL LINKING) */}
      {relatedServices.length > 0 && (
        <section id="services-used" className="section-padding border-b border-[var(--color-border)]">
          <div className="container-site">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8 md:mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
                  Services Involved
                </div>
                <h2 className="text-display-sm font-bold font-display text-text-primary">
                  Engineering Services Powering This Project
                </h2>
              </div>
              <Link
                href="/services"
                className="text-sm font-semibold text-[var(--color-accent-dark)] hover:underline flex items-center gap-1.5"
              >
                View all capabilities <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((svc) => {
                const SvcIcon = iconMap[svc.icon] || Globe;
                return (
                  <Link
                    key={svc.slug}
                    href={`/services/${svc.slug}`}
                    className="group bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 sm:p-6 md:p-8 transition-all duration-500 hover:border-[var(--color-accent)]/40 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-[var(--color-border)] text-[var(--color-accent-dark)] flex items-center justify-center group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 group-hover:border-[var(--color-accent)] transition-all duration-500 shadow-sm">
                          <SvcIcon size={24} />
                        </div>
                        <div className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-text-muted group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 transition-all">
                          <ArrowUpRight size={15} />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold font-display text-text-primary mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                        {svc.title}
                      </h3>

                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 font-light">
                        {svc.shortDescription}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-[var(--color-border)]/60 text-xs font-semibold text-[var(--color-accent-dark)] flex items-center gap-1">
                      <span>Explore Service Details</span>
                      <ArrowRight size={12} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 10. RELATED PORTFOLIO PROJECTS (INTERNAL LINKING) */}
      {relatedProjects.length > 0 && (
        <section id="related-case-studies" className="section-padding border-b border-[var(--color-border)] bg-surface-2/10">
          <div className="container-site">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8 md:mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
                  More Case Studies
                </div>
                <h2 className="text-display-sm font-bold font-display text-text-primary">
                  Explore Other Production Deployments
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="text-sm font-semibold text-[var(--color-accent-dark)] hover:underline flex items-center gap-1.5"
              >
                View entire portfolio <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((item) => (
                <Link
                  key={item.slug}
                  href={`/portfolio/${item.slug}`}
                  className="group bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 sm:p-6 md:p-8 transition-all duration-500 hover:border-[var(--color-accent)]/40 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-surface-2 rounded-full text-xs font-mono font-medium text-text-primary">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        {item.industry}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold font-display text-text-primary mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 font-light mb-6">
                      {item.oneLiner || item.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border)]/60 text-xs font-semibold text-[var(--color-accent-dark)] flex items-center gap-1">
                    <span>Read Case Study</span>
                    <ArrowRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. CALL TO ACTION BANNER */}
      <section id="cta" className="container-site py-12 sm:py-16 md:py-20">
        <div className="rounded-[var(--radius-xl)] bg-text-primary text-surface-1 p-6 sm:p-10 md:p-14 text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-accent)]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-surface-1/10 text-[var(--color-accent-light)] text-xs font-mono mb-4 md:mb-6 uppercase tracking-widest border border-surface-1/15 backdrop-blur-md">
              Start Your Engineering Engagement
            </div>

            <h2 className="text-display-md md:text-display-lg font-bold font-display mb-4 md:mb-6 tracking-tight leading-[1.05]">
              Ready to engineer a system like {project.title.split("—")[0].trim()}?
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-surface-2 max-w-2xl mx-auto mb-6 sm:mb-8 font-light opacity-90 leading-relaxed">
              Book a technical scoping consultation directly with our lead architects. We will evaluate your system requirements, provide architectural blueprints, and scope a milestone-backed delivery sprint.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto">
              <Button
                size="lg"
                href="/contact"
                className="w-full sm:w-auto rounded-full px-8 sm:px-10 py-3.5 sm:py-4 bg-[var(--color-accent)] text-surface-1 hover:bg-[var(--color-accent-light)] border-none font-semibold text-base shadow-2xl justify-center"
              >
                Schedule Technical Scoping
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                href="/portfolio"
                className="w-full sm:w-auto rounded-full px-8 sm:px-9 py-3.5 sm:py-4 text-surface-1 border-surface-1/30 hover:bg-surface-1/10 text-base justify-center"
              >
                View More Projects
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
