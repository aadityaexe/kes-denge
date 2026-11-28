import { Metadata } from "next";
import Link from "next/link";
import { getClientsData, getTestimonialsData } from "@/lib/db-helpers";
import { PageHero } from "@/components/layout/PageHero";
import { ClientsDirectory } from "@/components/clients/ClientsDirectory";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, SEO_CONFIG } from "@/lib/seo";
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export const revalidate = 3600;

const siteUrl = SEO_CONFIG.siteUrl;

export const metadata: Metadata = buildPageMetadata({
  title: "Our Clients & Partnerships — Global Enterprises & Startups",
  description:
    "Explore the high-growth companies, fintech leaders, and global enterprises that build and scale their core software platforms with MARK2.",
  ogTitle: "Our Clients & Partnerships",
  ogAlt: "Our Clients & Partnerships | MARK2",
  path: "/clients",
  keywords: [
    "MARK2 clients",
    "software development partnerships",
    "enterprise software clients",
    "custom software case studies",
    "technology partners India",
  ],
});

export default async function ClientsPage() {
  const [clientsData, testimonialsData] = await Promise.all([
    getClientsData(),
    getTestimonialsData(),
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Clients", url: `${siteUrl}/clients` },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "MARK2 Technologies Client Partnerships",
    description:
      "Verified client partnerships, enterprise software deployments, and system engineering deliverables.",
    url: `${siteUrl}/clients`,
    provider: {
      "@type": "Organization",
      name: "MARK2 Technologies",
      url: siteUrl,
    },
    about: {
      "@type": "ItemList",
      itemListElement: clientsData.map((client: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Organization",
          name: client.name,
          url: client.website || `${siteUrl}/clients/${client.slug}`
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionSchema) }}
      />

      <PageHero
        badge="Verified Partnerships"
        title="Engineered for organizations that refuse to settle."
        subtitle="From venture-backed disruptors to global enterprises, we partner with visionary leadership to architect resilient, high-throughput software and digital products."
        className="pb-10 sm:pb-12 md:pb-16"
      />

      <section className="section-padding pt-0 pb-20 bg-base">
        <div className="container-site">
          <ClientsDirectory clients={clientsData} />
        </div>
      </section>

      {testimonialsData && testimonialsData.length > 0 && (
        <TestimonialsSection testimonialsData={testimonialsData} />
      )}

      {/* Partnership Standards Banner */}
      <section className="py-16 md:py-24 bg-surface-1 border-t border-[var(--color-border)] relative overflow-hidden">
        <div className="container-site relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-4">
              Our Partnership Standard
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              We do not act as an arms-length vendor. We embed as senior technical co-pilots with full codebase transparency and production ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-surface-2 border border-[var(--color-border)]">
              <div className="w-12 h-12 rounded-xl bg-text-primary text-surface-1 flex items-center justify-center mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
                Senior Engineers Only
              </h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Zero junior handoffs or opaque outsourcing. Every feature and architectural boundary is designed by senior engineers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-2 border border-[var(--color-border)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-dark)] text-white flex items-center justify-center mb-5">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
                Day-One Code Ownership
              </h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                You own 100% of all intellectual property, repository commits, cloud infrastructure templates, and CI/CD pipelines.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-2 border border-[var(--color-border)]">
              <div className="w-12 h-12 rounded-xl bg-text-primary text-surface-1 flex items-center justify-center mb-5">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
                Sub-Millisecond Discipline
              </h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                We obsess over query optimization, bundle size, edge caching, and memory management so your software easily scales to millions.
              </p>
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-surface-2 via-surface-1 to-surface-2 border border-[var(--color-border)] text-center max-w-4xl mx-auto shadow-sm">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3">
              Ready to become our next partner?
            </h3>
            <p className="text-sm md:text-base text-text-secondary max-w-xl mx-auto mb-8">
              Tell us about your technical roadmap, upcoming release deadlines, or scaling bottlenecks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-text-primary text-surface-1 font-semibold text-sm hover:opacity-90 transition-all shadow-md group"
              >
                <span>Schedule an Architectural Briefing</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-surface-2 text-text-primary border border-[var(--color-border)] font-medium text-sm hover:bg-surface-2/80 transition-colors"
              >
                Explore Full Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
