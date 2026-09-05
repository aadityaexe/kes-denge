import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getClientBySlug,
  getClientsData,
  getPortfolioBySlug,
} from "@/lib/db-helpers";
import type { Client, PortfolioItem } from "@/lib/types";
import { Parallax } from "@/components/ui/Parallax";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Building2,
  Calendar,
  MapPin,
  Users,
  Quote,
  ShieldCheck,
  Layers,
  Cpu,
  Sparkles,
} from "lucide-react";

export async function generateStaticParams() {
  const clients = await getClientsData();
  return clients.map((c: Client) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = await getClientBySlug(slug);

  if (!client) {
    return {
      title: "Client Partner Not Found | MARK Technologies",
      description: "The requested client partnership profile could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";
  const canonicalUrl = `${siteUrl}/clients/${client.slug}`;
  const title = `${client.name} — Partnership & Engineering Case Profile | MARK Technologies`;
  const description =
    client.tagline ||
    client.description ||
    `Discover how MARK partnered with ${client.name} to engineer scalable digital systems and cloud architecture.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "MARK Technologies",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [client, allClients] = await Promise.all([
    getClientBySlug(slug),
    getClientsData(),
  ]);

  if (!client) {
    notFound();
  }

  // Related portfolio project if specified
  let relatedProject: PortfolioItem | null = null;
  if (client.caseStudySlug) {
    relatedProject = (await getPortfolioBySlug(client.caseStudySlug)) as PortfolioItem | null;
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";
  const canonicalUrl = `${siteUrl}/clients/${client.slug}`;

  // Find next and previous clients for navigation
  const currentIndex = allClients.findIndex((c: Client) => c.slug === client.slug);
  const prevClient =
    currentIndex > 0
      ? allClients[currentIndex - 1]
      : allClients[allClients.length - 1];
  const nextClient =
    currentIndex < allClients.length - 1
      ? allClients[currentIndex + 1]
      : allClients[0];

  const initialLetters = client.name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
        name: "Clients",
        item: `${siteUrl}/clients`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: client.name,
        item: canonicalUrl,
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: client.name,
    url: client.website || canonicalUrl,
    description: client.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="pt-28 pb-20 min-h-screen relative overflow-hidden bg-base">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax
            speed={0.6}
            className="absolute top-0 right-1/4 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-bl from-[var(--color-accent)]/15 via-[var(--color-accent)]/5 to-transparent blur-[140px]"
          />
        </div>

        <div className="container-site max-w-6xl">
          {/* Top Breadcrumb Navigation */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link
              href="/clients"
              className="inline-flex items-center gap-2 text-xs font-medium text-text-muted hover:text-text-primary transition-colors group"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to All Clients</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] border border-[var(--color-accent)]/20">
              <ShieldCheck size={13} />
              <span>Verified Enterprise Partner</span>
            </span>
          </div>

          {/* Hero Header Card */}
          <div className="rounded-3xl border border-[var(--color-border)] bg-surface-1/90 backdrop-blur-xl p-8 md:p-12 mb-10 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-center font-display font-bold text-2xl md:text-3xl text-text-primary shadow-sm overflow-hidden p-2 shrink-0">
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span>{initialLetters}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
                    {client.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] border border-[var(--color-accent)]/20">
                      {client.industry}
                    </span>
                    {client.location && (
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <MapPin size={13} className="text-text-muted" />
                        {client.location}
                      </span>
                    )}
                    {client.companySize && (
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <Users size={13} className="text-text-muted" />
                        {client.companySize}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {client.website && (
                <div className="shrink-0">
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-2 hover:bg-surface-2/80 border border-[var(--color-border)] text-xs font-semibold text-text-primary transition-colors"
                  >
                    <span>Visit Company Website</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

            {/* Tagline Banner */}
            <div className="pt-8">
              <p className="text-xs uppercase tracking-wider font-semibold text-[var(--color-accent-dark)] mb-2">
                Partnership Mission & Scope
              </p>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-text-primary leading-snug max-w-4xl">
                {client.tagline || `${client.name} digital transformation with MARK.`}
              </h2>
            </div>
          </div>

          {/* Quick Partnership Highlights Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="p-5 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
              <div className="flex items-center gap-2 text-text-muted mb-1 text-xs">
                <Calendar size={14} />
                <span>Tenure</span>
              </div>
              <p className="text-lg font-display font-bold text-text-primary">
                {client.partnershipYear || "2023 - Present"}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
              <div className="flex items-center gap-2 text-text-muted mb-1 text-xs">
                <Layers size={14} />
                <span>Engagement Model</span>
              </div>
              <p className="text-lg font-display font-bold text-text-primary">
                Dedicated Core Pod
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
              <div className="flex items-center gap-2 text-text-muted mb-1 text-xs">
                <Cpu size={14} />
                <span>Deliverables</span>
              </div>
              <p className="text-lg font-display font-bold text-[var(--color-accent-dark)]">
                {(client.servicesProvided || []).length || 4} Core Capabilities
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
              <div className="flex items-center gap-2 text-text-muted mb-1 text-xs">
                <ShieldCheck size={14} />
                <span>Codebase SLA</span>
              </div>
              <p className="text-lg font-display font-bold text-text-primary">
                99.99% Guaranteed
              </p>
            </div>
          </div>

          {/* Main 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">
            {/* Left Column: Narrative, Accomplishments, Tech Stack */}
            <div className="space-y-10">
              {/* About Client Organization */}
              <div className="p-8 rounded-3xl bg-surface-1 border border-[var(--color-border)]">
                <h3 className="text-lg font-display font-bold text-text-primary mb-3">
                  About {client.name}
                </h3>
                <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                  {client.description ||
                    `${client.name} is a forward-thinking organization operating at the forefront of the ${client.industry} industry.`}
                </p>
              </div>

              {/* Partnership Story / What MARK Engineered */}
              <div className="p-8 rounded-3xl bg-surface-1 border border-[var(--color-border)]">
                <h3 className="text-lg font-display font-bold text-text-primary mb-3">
                  The Engineering Partnership
                </h3>
                <div className="space-y-4 text-sm md:text-base text-text-secondary leading-relaxed">
                  <p>
                    {client.aboutPartnership ||
                      `MARK worked closely with ${client.name}'s engineering leadership to build, optimize, and deploy high-reliability software architecture capable of scaling to enterprise traffic.`}
                  </p>
                  <p>
                    From database tuning to frontend responsiveness and security compliance, our team provided complete lifecycle architectural oversight, continuous delivery automation, and proactive monitoring.
                  </p>
                </div>
              </div>

              {/* Key Measured Achievements */}
              {client.keyAchievements && client.keyAchievements.length > 0 && (
                <div className="p-8 rounded-3xl bg-surface-1 border border-[var(--color-border)]">
                  <h3 className="text-lg font-display font-bold text-text-primary mb-6">
                    Key Outcomes & Measured Impact
                  </h3>
                  <div className="space-y-4">
                    {client.keyAchievements.map((item: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3.5 p-4 rounded-xl bg-surface-2 border border-[var(--color-border)]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary leading-snug">
                            {item}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Deployed */}
              {client.technologies && client.technologies.length > 0 && (
                <div className="p-8 rounded-3xl bg-surface-1 border border-[var(--color-border)]">
                  <h3 className="text-lg font-display font-bold text-text-primary mb-4">
                    Technologies & Architecture
                  </h3>
                  <p className="text-xs text-text-secondary mb-5">
                    Core programming languages, frameworks, cloud infrastructure, and data layers deployed for {client.name}.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {client.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-surface-2 text-text-primary border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Sidebar Info, Testimonial & Case Study Link */}
            <div className="space-y-8 sticky top-28">
              {/* Executive Testimonial Block */}
              {(client.testimonialQuote || client.testimonial?.quote) && (
                <div className="p-8 rounded-3xl bg-gradient-to-br from-surface-2 to-surface-1 border border-[var(--color-border)] shadow-sm relative overflow-hidden">
                  <Quote
                    size={32}
                    className="text-[var(--color-accent)] opacity-40 mb-4"
                  />
                  <blockquote className="text-sm md:text-base font-medium text-text-primary italic leading-relaxed mb-6">
                    "{client.testimonialQuote || client.testimonial?.quote}"
                  </blockquote>
                  <div className="pt-4 border-t border-[var(--color-border)]">
                    <p className="text-sm font-display font-bold text-text-primary">
                      {client.testimonialAuthor ||
                        client.testimonial?.authorName ||
                        "Engineering Leadership"}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {client.testimonialRole ||
                        client.testimonial?.authorRole ||
                        client.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Services Provided Card */}
              <div className="p-6 rounded-3xl bg-surface-1 border border-[var(--color-border)]">
                <h4 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider mb-4 text-[var(--color-accent-dark)]">
                  Services Delivered
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(client.servicesProvided || ["Software Engineering", "Cloud Architecture"]).map(
                    (s: string) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs bg-surface-2 text-text-secondary border border-[var(--color-border)]"
                      >
                        {s}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Related Portfolio Case Study Callout */}
              {relatedProject && (
                <div className="p-6 rounded-3xl bg-surface-1 border border-[var(--color-border)]">
                  <span className="text-[11px] font-semibold text-[var(--color-accent-dark)] uppercase tracking-wider">
                    Associated Case Study
                  </span>
                  <h4 className="text-base font-display font-bold text-text-primary mt-1 mb-2">
                    {relatedProject.title}
                  </h4>
                  <p className="text-xs text-text-secondary line-clamp-2 mb-4">
                    {relatedProject.oneLiner || relatedProject.shortDescription}
                  </p>
                  <Link
                    href={`/portfolio/${relatedProject.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-primary hover:text-[var(--color-accent-dark)] transition-colors group"
                  >
                    <span>Read Technical Deep-Dive</span>
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform text-[var(--color-accent-light)]"
                    />
                  </Link>
                </div>
              )}

              {/* Direct Partnership Contact Card */}
              <div className="p-6 rounded-3xl bg-surface-2 border border-[var(--color-border)] text-center">
                <Sparkles
                  size={24}
                  className="mx-auto text-[var(--color-accent-dark)] mb-3"
                />
                <h4 className="text-sm font-display font-bold text-text-primary mb-1">
                  Have a similar challenge?
                </h4>
                <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                  Let's schedule an architectural consultation with our principal engineers.
                </p>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-text-primary text-surface-1 text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Next/Prev Client Navigation */}
          <div className="mt-16 pt-8 border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevClient && (
              <Link
                href={`/clients/${prevClient.slug}`}
                className="p-5 rounded-2xl bg-surface-1 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors group flex items-center gap-4"
              >
                <ArrowLeft
                  size={18}
                  className="text-text-muted group-hover:-translate-x-1 group-hover:text-text-primary transition-all shrink-0"
                />
                <div>
                  <span className="text-[11px] text-text-muted uppercase tracking-wider block">
                    Previous Client
                  </span>
                  <span className="text-sm font-display font-bold text-text-primary group-hover:text-[var(--color-accent-dark)] transition-colors">
                    {prevClient.name}
                  </span>
                </div>
              </Link>
            )}

            {nextClient && (
              <Link
                href={`/clients/${nextClient.slug}`}
                className="p-5 rounded-2xl bg-surface-1 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors group flex items-center justify-between gap-4 text-right sm:ml-auto w-full"
              >
                <div>
                  <span className="text-[11px] text-text-muted uppercase tracking-wider block">
                    Next Client
                  </span>
                  <span className="text-sm font-display font-bold text-text-primary group-hover:text-[var(--color-accent-dark)] transition-colors">
                    {nextClient.name}
                  </span>
                </div>
                <ArrowRight
                  size={18}
                  className="text-text-muted group-hover:translate-x-1 group-hover:text-text-primary transition-all shrink-0"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
