import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import { getPortfolioData, getTestimonialsData } from "@/lib/db-helpers";
import { Metadata } from "next";
import { safeJsonLd } from "@/lib/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Software Development Portfolio — Case Studies & Client Projects",
  description: "Explore MARK 2' software development portfolio: EduVeera Education ERP, Bharat Bhoomi Real Estate platform, Keshera Manufacturing ERP, and more. Production-grade systems built for high-growth businesses.",
  keywords: [
    "software development portfolio",
    "custom software case studies",
    "ERP development case study",
    "web development portfolio India",
    "MARK 2 projects",
  ],
  alternates: {
    canonical: `${siteUrl}/portfolio`,
  },
  openGraph: {
    title: "Software Development Portfolio — Case Studies",
    description: "Explore our verified case studies in web development, mobile apps, ERP systems, and cloud architecture built for high-growth businesses.",
    url: `${siteUrl}/portfolio`,
    siteName: "MARK 2",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Software Development Portfolio — MARK 2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development Portfolio — Case Studies",
    description: "Explore our verified case studies in web development, mobile apps, ERP systems, and cloud architecture built for high-growth businesses.",
    images: [`${siteUrl}/twitter-image`],
  },
};

export const revalidate = 3600;

export default async function PortfolioPage() {
  const [portfolioData, testimonialsData] = await Promise.all([
    getPortfolioData(),
    getTestimonialsData(),
  ]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: `${siteUrl}/portfolio` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "MARK 2 Portfolio & Case Studies",
    description: "Production case studies and software engineering deployments.",
    url: `${siteUrl}/portfolio`,
    provider: {
      "@type": "Organization",
      name: "MARK 2",
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
      <div className="pt-24 sm:pt-28 md:pt-32 pb-8 md:pb-12 relative overflow-hidden">
        {/* Background Parallax Orb */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax speed={0.8} className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]" />
        </div>
        <div className="container-site relative z-10">
          <SectionHeading
            as="h1"
            title="Work that speaks for itself."
            subtitle="From consumer mobile apps to enterprise ERP systems, we deliver quality at every level."
            badge="Our Work"
            align="center"
          />
          <div className="max-w-3xl mx-auto mt-6 text-center">
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
              MARK 2 has engineered and deployed full-stack software solutions ranging from high-performance consumer applications to mission-critical custom enterprise ERPs. Every project delivers measurable operational efficiency, 99.9% uptime, and audited web security.
            </p>
          </div>
        </div>
      </div>
      
      <PortfolioSection portfolioData={portfolioData} showAll={true} hideHeader={true} />
      <TestimonialsSection testimonialsData={testimonialsData} />
    </>
  );
}


