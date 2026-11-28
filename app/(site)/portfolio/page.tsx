import { Metadata } from "next";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PageHero } from "@/components/layout/PageHero";
import { getPortfolioData, getTestimonialsData } from "@/lib/db-helpers";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, SEO_CONFIG } from "@/lib/seo";

const siteUrl = SEO_CONFIG.siteUrl;

export const metadata: Metadata = buildPageMetadata({
  title: "Software Development Portfolio — Case Studies & Client Projects",
  description:
    "Explore MARK2's software development portfolio: EduVeera Education ERP, Bharat Bhoomi Real Estate platform, Keshera Manufacturing ERP, and more. Production-grade systems built for high-growth businesses.",
  ogTitle: "Software Development Portfolio — Case Studies",
  ogDescription:
    "Explore our verified case studies in web development, mobile apps, ERP systems, and cloud architecture built for high-growth businesses.",
  ogAlt: "Software Development Portfolio — MARK2",
  path: "/portfolio",
  keywords: [
    "software development portfolio",
    "custom software case studies",
    "ERP development case study",
    "web development portfolio India",
    "MARK2 projects",
  ],
});

export const revalidate = 3600;

export default async function PortfolioPage() {
  const [portfolioData, testimonialsData] = await Promise.all([
    getPortfolioData(),
    getTestimonialsData(),
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Portfolio", url: `${siteUrl}/portfolio` },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "MARK2 Portfolio & Case Studies",
    description: "Production case studies and software engineering deployments.",
    url: `${siteUrl}/portfolio`,
    provider: {
      "@type": "Organization",
      name: "MARK2",
      url: siteUrl,
    },
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
        badge="Our Work"
        title="Work that speaks for itself."
        subtitle="From consumer mobile apps to enterprise ERP systems, we deliver quality at every level."
        lead="MARK2 has engineered and deployed full-stack software solutions ranging from high-performance consumer applications to mission-critical custom enterprise ERPs. Every project delivers measurable operational efficiency, 99.9% uptime, and audited web security."
      />

      <PortfolioSection portfolioData={portfolioData} showAll={true} hideHeader={true} />
      <TestimonialsSection testimonialsData={testimonialsData} />
    </>
  );
}
