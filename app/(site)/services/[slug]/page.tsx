import { notFound } from "next/navigation";
import { getServiceBySlug, getServicesData, getRelatedPortfolioForService } from "@/lib/db-helpers";
import { Service, ServiceFeatureItem, ServiceBenefitItem, PortfolioItem } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Parallax } from "@/components/ui/Parallax";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceArchitectureVisualizer } from "@/components/services/ServiceArchitectureVisualizer";
import { ServiceComparisonMatrix } from "@/components/services/ServiceComparisonMatrix";
import { ServiceFAQAccordion } from "@/components/services/ServiceFAQAccordion";
import { ServiceProcessTimeline } from "@/components/services/ServiceProcessTimeline";
import { ServiceTechStack } from "@/components/services/ServiceTechStack";
import { ServiceProblemsSolved } from "@/components/services/ServiceProblemsSolved";
import {
  Globe,
  Smartphone,
  Building2,
  Code2,
  Search,
  Cpu,
  Layers,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  Megaphone,
  Paintbrush,
  Database,
  Server,
  Check,
  Monitor,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  Globe,
  Smartphone,
  Building2,
  Code2,
  Search,
  Cpu,
  Layers,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Users,
  Megaphone,
  Paintbrush,
  Database,
  Server,
  Monitor,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = (await getServiceBySlug(slug)) as Service | null;

  if (!service) {
    return {
      title: "Service Not Found | MARK Technologies",
      description: "The requested engineering service could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mark.com";
  const canonicalUrl = `${siteUrl}/services/${service.slug}`;
  const metaTitle = service.metaTitle
    ? service.metaTitle.replace(/\s*\|\s*Kas Denge.*$/i, "").replace(/\s*\|\s*MARK.*$/i, "")
    : `${service.title} Engineering Services`;
  const metaDescription =
    service.metaDescription ||
    service.shortDescription ||
    "Enterprise-grade product engineering and custom software development services.";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: service.keywords && service.keywords.length > 0 ? service.keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: "MARK Technologies",
      type: "website",
      images: service.featuredImage ? [{ url: service.featuredImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: service.featuredImage ? [service.featuredImage] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const servicesList = await getServicesData();
  return servicesList.map((service: any) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = (await getServiceBySlug(slug)) as Service | null;

  if (!service || !service.isActive) {
    notFound();
  }

  // Fetch all services for related services linking
  const [allServices, relatedPortfolio] = await Promise.all([
    getServicesData() as Promise<Service[]>,
    getRelatedPortfolioForService(service.slug, 3) as Promise<PortfolioItem[]>,
  ]);

  const relatedServices = allServices.filter(
    (s) =>
      s.slug !== service.slug &&
      s.isActive !== false &&
      (service.relatedServiceSlugs && service.relatedServiceSlugs.length > 0
        ? service.relatedServiceSlugs.includes(s.slug)
        : true)
  ).slice(0, 3);

  const ServiceIcon = iconMap[service.icon] || Globe;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mark.com";
  const pageUrl = `${siteUrl}/services/${service.slug}`;

  // Structured Data (Schema.org JSON-LD)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.shortDescription,
    provider: {
      "@type": "Organization",
      name: "MARK Technologies",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
    },
    areaServed: "Worldwide",
    url: pageUrl,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/contact`,
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
        name: "Services",
        item: `${siteUrl}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: pageUrl,
      },
    ],
  };

  const faqSchema =
    service.faqs && service.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <main id="main-content" className="min-h-screen bg-base relative overflow-hidden">
      {/* Schema.org JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* 1. HERO SECTION WITH 3D CANVAS & EDITORIAL HEADLINE */}
      <ServiceHero
        title={service.title}
        tagline={service.tagline}
        heroBadge={service.heroBadge}
        shortDescription={service.shortDescription}
        slug={service.slug}
      />

      {/* 2. OVERVIEW & WHO THIS SERVICE IS FOR */}
      <section id="overview" className="section-padding border-b border-[var(--color-border)]">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10 md:mb-12">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-4 uppercase tracking-widest border border-[var(--color-border)]">
                The Engineering Foundation
              </div>
              <h2 className="text-display-md font-bold font-display text-text-primary tracking-tight leading-tight">
                Architected for resilience. Engineered for velocity.
              </h2>
            </div>

            <div className="lg:col-span-7">
              <p className="text-lg md:text-xl text-text-secondary font-light leading-relaxed mb-6">
                {service.fullDescription}
              </p>
              <p className="text-base text-text-secondary leading-relaxed">
                At MARK Technologies, we reject brittle templates and technical shortcuts. Every system we build is designed as a mission-critical asset, giving your product team the speed, security, and scalability needed to outperform competition.
              </p>
            </div>
          </div>

          {/* Target Audience: Who is this for? */}
          {service.targetAudience && service.targetAudience.length > 0 && (
            <div className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 sm:p-8 mb-10 md:mb-12 shadow-md">
              <div className="max-w-2xl mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] text-xs font-mono font-bold uppercase mb-3">
                  Target Profiles
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
                  Who Is This Service Designed For?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {service.targetAudience.map((audience, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-2/80 border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 flex flex-col justify-between hover:border-[var(--color-accent)]/40 hover:bg-surface-1 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-surface-1 border border-[var(--color-border)] text-[var(--color-accent-dark)] flex items-center justify-center font-bold text-xs mb-4 group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 transition-colors">
                      0{idx + 1}
                    </div>
                    <span className="text-sm font-semibold text-text-primary leading-snug">
                      {audience}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problems Solved Section */}
          {service.problemsSolved && service.problemsSolved.length > 0 && (
            <div>
              <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-2 text-[#555555] text-xs font-mono font-semibold mb-3 uppercase tracking-widest border border-[var(--color-border)] shadow-xs">
                  Pain Points We Eliminate
                </div>
                <h3 className="text-display-sm font-bold font-display text-text-primary">
                  Traditional Bottlenecks vs. MARK Engineering
                </h3>
              </div>
              <ServiceProblemsSolved problemsSolved={service.problemsSolved} />
            </div>
          )}
        </div>
      </section>

      {/* 3. INTERACTIVE SYSTEM ARCHITECTURE BLUEPRINT */}
      <section id="architecture" className="section-padding border-b border-[var(--color-border)] bg-surface-2/30">
        <div className="container-site">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
              Interactive Topology
            </div>
            <h2 className="text-display-md font-bold font-display text-text-primary mb-4">
              Live Architecture & Runtime Blueprint
            </h2>
            <p className="text-text-secondary text-base sm:text-lg font-light">
              Explore how we structure edge compute, domain logic, data models, and enterprise security.
            </p>
          </div>

          <ServiceArchitectureVisualizer serviceTitle={service.title} />
        </div>
      </section>

      {/* 4. CAPABILITIES & CONCRETE DELIVERABLES */}
      <section id="capabilities" className="section-padding border-b border-[var(--color-border)]">
        <div className="container-site">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
              Core Capabilities
            </div>
            <h2 className="text-display-md font-bold font-display text-text-primary mb-4">
              What We Build & Deliver
            </h2>
            <p className="text-text-secondary text-base sm:text-lg font-light">
              End-to-end full lifecycle engineering execution tailored to your specific scale requirements.
            </p>
          </div>

          {/* Capabilities Bento Grid */}
          {service.features && service.features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 md:mb-12">
              {service.features.map((feat, idx) => {
                const isObject = typeof feat === "object" && feat !== null;
                const title = isObject ? (feat as ServiceFeatureItem).title : `Capability ${idx + 1}`;
                const description = isObject ? (feat as ServiceFeatureItem).description : (feat as string);
                const iconName = isObject ? (feat as ServiceFeatureItem).icon : undefined;
                const IconComponent = (iconName && iconMap[iconName]) || Layers;

                return (
                  <div
                    key={idx}
                    className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 sm:p-10 transition-all duration-500 hover:border-[var(--color-accent)]/40 hover:shadow-2xl hover:-translate-y-1 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] mb-6 group-hover:scale-110 group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 group-hover:border-[var(--color-accent)] transition-all duration-500 shadow-sm">
                      <IconComponent size={26} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold font-display text-text-primary mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                      {title}
                    </h3>
                    <p className="text-text-secondary text-base leading-relaxed font-light">
                      {description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Deliverables Checklist Banner */}
          {service.deliverables && service.deliverables.length > 0 && (
            <div className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 sm:p-8 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] text-xs font-mono font-bold uppercase mb-3">
                    Handover Package
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-text-primary mb-3">
                    Concrete Deliverables You Own
                  </h3>
                  <p className="text-sm text-text-secondary font-light leading-relaxed">
                    Zero lock-in. Complete source repositories, typed contracts, CI/CD deployment pipelines, and comprehensive technical runbooks.
                  </p>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-surface-2/70 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
                        <Check size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-sm text-text-primary font-medium leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. BUSINESS & TECHNICAL BENEFITS */}
      {service.benefits && service.benefits.length > 0 && (
        <section id="benefits" className="section-padding border-b border-[var(--color-border)] bg-surface-2/20">
          <div className="container-site">
            <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
                Quantifiable Outcomes
              </div>
              <h2 className="text-display-md font-bold font-display text-text-primary mb-4">
                Business & Technical ROI
              </h2>
              <p className="text-text-secondary text-base sm:text-lg font-light">
                Engineering decisions designed to maximize revenue, user retention, and operating efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.benefits.map((benefit: ServiceBenefitItem, idx: number) => {
                const IconComp = (benefit.icon && iconMap[benefit.icon]) || TrendingUp;
                return (
                  <div
                    key={idx}
                    className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 flex flex-col justify-between transition-all duration-500 hover:border-[var(--color-accent)]/40 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-surface-2 text-[var(--color-accent)] flex items-center justify-center border border-[var(--color-border)] shadow-xs">
                          <IconComp size={22} />
                        </div>
                        {benefit.metric && (
                          <div className="px-3 py-1 rounded-md bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] font-mono text-xs font-bold">
                            {benefit.metric}
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold font-display text-text-primary mb-2">
                        {benefit.title}
                      </h3>

                      <p className="text-text-secondary text-sm leading-relaxed font-light">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. OUR ENGINEERING PROCESS ROADMAP */}
      {service.process && service.process.length > 0 && (
        <section id="process" className="section-padding border-b border-[var(--color-border)]">
          <div className="container-site">
            <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
                Delivery Framework
              </div>
              <h2 className="text-display-md font-bold font-display text-text-primary mb-4">
                The Milestone Engineering Roadmap
              </h2>
              <p className="text-text-secondary text-base sm:text-lg font-light">
                A structured, transparent delivery methodology with zero black-box timelines.
              </p>
            </div>

            <ServiceProcessTimeline processSteps={service.process} />
          </div>
        </section>
      )}

      {/* 7. CATEGORIZED TECHNOLOGIES & TOOLS */}
      {service.technologies && service.technologies.length > 0 && (
        <section id="technologies" className="section-padding border-b border-[var(--color-border)] bg-surface-2/20">
          <div className="container-site">
            <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
                Technology Stack
              </div>
              <h2 className="text-display-md font-bold font-display text-text-primary mb-4">
                Frameworks & Technologies We Master
              </h2>
              <p className="text-text-secondary text-base sm:text-lg font-light">
                Battle-tested tools selected strictly for performance, scalability, and long-term maintainability.
              </p>
            </div>

            <ServiceTechStack technologies={service.technologies} />
          </div>
        </section>
      )}

      {/* 8. COMPARISON MATRIX (WHY US) */}
      <section id="comparison" className="section-padding border-b border-[var(--color-border)]">
        <div className="container-site">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
              The MARK Difference
            </div>
            <h2 className="text-display-md font-bold font-display text-text-primary mb-4">
              How We Compare Against Typical Agencies
            </h2>
            <p className="text-text-secondary text-base sm:text-lg font-light">
              We operate as a high-velocity extension of your internal engineering leadership.
            </p>
          </div>

          <ServiceComparisonMatrix serviceTitle={service.title} />
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      {service.faqs && service.faqs.length > 0 && (
        <section id="faqs" className="section-padding border-b border-[var(--color-border)] bg-surface-2/20">
          <div className="container-site max-w-4xl">
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
                Frequently Asked Questions
              </div>
              <h2 className="text-display-md font-bold font-display text-text-primary mb-4">
                Answers to Key Technical Questions
              </h2>
              <p className="text-text-secondary text-base sm:text-lg font-light">
                Direct, transparent details regarding sprint schedules, source ownership, migrations, and post-launch SLAs.
              </p>
            </div>

            <ServiceFAQAccordion faqs={service.faqs} serviceTitle={service.title} />
          </div>
        </section>
      )}

      {/* 10. RELATED SERVICES & COMPLEMENTARY OFFERINGS */}
      {relatedServices.length > 0 && (
        <section id="related-services" className="section-padding border-b border-[var(--color-border)]">
          <div className="container-site">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8 md:mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
                  Complementary Services
                </div>
                <h2 className="text-display-sm font-bold font-display text-text-primary">
                  Explore Complementary Offerings
                </h2>
              </div>
              <Link
                href="/services"
                className="text-sm font-semibold text-[var(--color-accent-dark)] hover:underline flex items-center gap-1.5"
              >
                View all services <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((relSvc) => {
                const RelIcon = iconMap[relSvc.icon] || Globe;
                return (
                  <Link
                    key={relSvc.slug}
                    href={`/services/${relSvc.slug}`}
                    className="group bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 transition-all duration-500 hover:border-[var(--color-accent)]/40 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-[var(--color-border)] text-text-secondary flex items-center justify-center group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 group-hover:border-[var(--color-accent)] transition-all duration-500 shadow-sm">
                          <RelIcon size={24} strokeWidth={1.5} />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-muted group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 transition-all duration-300">
                          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold font-display text-text-primary mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                        {relSvc.title}
                      </h3>

                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 font-light">
                        {relSvc.shortDescription}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-[var(--color-border)]/60 text-xs font-semibold text-[var(--color-accent-dark)] flex items-center gap-1">
                      <span>Explore {relSvc.title}</span>
                      <ArrowRight size={12} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 11. RELATED CASE STUDIES (INTERNAL LINKING) */}
      {relatedPortfolio.length > 0 && (
        <section id="related-case-studies" className="section-padding border-b border-[var(--color-border)] bg-surface-2/10">
          <div className="container-site">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8 md:mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
                  Proven Track Record
                </div>
                <h2 className="text-display-sm font-bold font-display text-text-primary">
                  Featured Case Studies Built With {service.title}
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="text-sm font-semibold text-[var(--color-accent-dark)] hover:underline flex items-center gap-1.5"
              >
                View full portfolio <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPortfolio.map((item) => (
                <Link
                  key={item.slug}
                  href={`/portfolio/${item.slug}`}
                  className="group bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 transition-all duration-500 hover:border-[var(--color-accent)]/40 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
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

      {/* 11. LUXURY DARK CHAMPAGNE CTA BANNER */}
      <section id="cta" className="container-site py-16 md:py-20">
        <div className="rounded-[var(--radius-xl)] bg-text-primary text-surface-1 p-8 sm:p-12 md:p-16 text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
          {/* Ambient Champagne Gold Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-accent)]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-1/10 text-[var(--color-accent-light)] text-xs font-mono mb-4 uppercase tracking-widest border border-surface-1/15 backdrop-blur-md">
              Start Your Engineering Engagement
            </div>

            <h2 className="text-display-md md:text-display-lg font-bold font-display mb-4 tracking-tight leading-[1.05]">
              Ready to engineer your {service.title.toLowerCase()} solution?
            </h2>

            <p className="text-base sm:text-xl text-surface-2 max-w-2xl mx-auto mb-8 font-light opacity-90 leading-relaxed">
              Book a technical scoping consultation directly with our lead architects. We will evaluate your system requirements, provide architectural blueprints, and scope a milestone-backed delivery sprint.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5">
              <Button
                size="lg"
                href="/contact"
                className="rounded-full px-10 py-4 bg-[var(--color-accent)] text-surface-1 hover:bg-[var(--color-accent-light)] border-none font-semibold text-base shadow-2xl"
              >
                Schedule Technical Discovery
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                href="/portfolio"
                className="rounded-full px-9 py-4 text-surface-1 border-surface-1/30 hover:bg-surface-1/10 text-base"
              >
                Explore Client Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
