import { Metadata } from "next";
import Link from "next/link";
import { getClientsData, getTestimonialsData } from "@/lib/db-helpers";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import { ClientsDirectory } from "@/components/clients/ClientsDirectory";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Our Clients & Partnerships — Global Enterprises & High-Growth Startups",
  description:
    "Explore the high-growth companies, fintech leaders, and global enterprises that build and scale their core software platforms with MARK.",
  alternates: {
    canonical: `${siteUrl}/clients`,
  },
  openGraph: {
    title: "Our Clients & Partnerships | MARK Technologies",
    description:
      "Explore the high-growth companies, fintech leaders, and global enterprises that build and scale their core software platforms with MARK.",
    url: `${siteUrl}/clients`,
    siteName: "MARK Technologies",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Our Clients & Partnerships | MARK Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Clients & Partnerships | MARK Technologies",
    description:
      "Explore the high-growth companies, fintech leaders, and global enterprises that build and scale their core software platforms with MARK.",
    images: [`${siteUrl}/twitter-image`],
  },
};

export default async function ClientsPage() {
  const [clientsData, testimonialsData] = await Promise.all([
    getClientsData(),
    getTestimonialsData(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

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
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "MARK Technologies Client Partnerships",
    description:
      "Verified client partnerships, enterprise software deployments, and system engineering deliverables.",
    url: `${siteUrl}/clients`,
    provider: {
      "@type": "Organization",
      name: "MARK Technologies",
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Hero Header */}
      <div className="pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 relative overflow-hidden">
        {/* Ambient Parallax Orb */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax
            speed={0.7}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/15 via-[var(--color-accent)]/5 to-transparent blur-[140px]"
          />
        </div>

        <div className="container-site relative z-10 text-center">
          <SectionHeading
            as="h1"
            badge="Verified Partnerships"
            title="Engineered for organizations that refuse to settle."
            subtitle="From venture-backed disruptors to global enterprises, we partner with visionary leadership to architect resilient, high-throughput software and digital products."
            align="center"
          />

          {/* Trust Metrics Bar */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-1/80 border border-[var(--color-border)] backdrop-blur-md text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text-primary tracking-tight break-words">
                99.8%
              </p>
              <p className="text-xs text-text-secondary mt-1 font-medium">
                Client Retention & SLA Score
              </p>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-1/80 border border-[var(--color-border)] backdrop-blur-md text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-[var(--color-accent-dark)] tracking-tight break-words">
                40+
              </p>
              <p className="text-xs text-text-secondary mt-1 font-medium">
                Production Cloud Systems
              </p>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-1/80 border border-[var(--color-border)] backdrop-blur-md text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text-primary tracking-tight break-words">
                $250M+
              </p>
              <p className="text-xs text-text-secondary mt-1 font-medium">
                Client Capital Raised
              </p>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-1/80 border border-[var(--color-border)] backdrop-blur-md text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-[var(--color-accent-dark)] tracking-tight break-words">
                &lt; 10ms
              </p>
              <p className="text-xs text-text-secondary mt-1 font-medium">
                Average Core Latency
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Directory Section */}
      <section className="section-padding pt-0 pb-20 bg-base">
        <div className="container-site">
          <ClientsDirectory clients={clientsData} />
        </div>
      </section>

      {/* Testimonials Section */}
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
