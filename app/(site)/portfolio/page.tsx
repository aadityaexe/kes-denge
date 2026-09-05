import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import { getPortfolioData, getTestimonialsData } from "@/lib/db-helpers";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Client Portfolio & Case Studies",
  description: "Explore our verified case studies in web development, mobile apps, ERP systems, and cloud architecture built for high-growth businesses.",
  alternates: {
    canonical: `${siteUrl}/portfolio`,
  },
  openGraph: {
    title: "Client Portfolio & Case Studies | MARK Technologies",
    description: "Explore our verified case studies in web development, mobile apps, ERP systems, and cloud architecture.",
    url: `${siteUrl}/portfolio`,
    siteName: "MARK Technologies",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Client Portfolio & Case Studies | MARK Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Portfolio & Case Studies | MARK Technologies",
    description: "Explore our verified case studies in web development, mobile apps, ERP systems, and cloud architecture.",
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
    name: "MARK Technologies Portfolio & Case Studies",
    description: "Production case studies and software engineering deployments.",
    url: `${siteUrl}/portfolio`,
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
              MARK Technologies has engineered and deployed full-stack software solutions including the 16-module EduVeera Education ERP, Bharat Bhoomi Real Estate & Land Management engine, and Keshera Industry Custom Manufacturing ERP. Every project delivers measurable operational efficiency, 99.9% uptime, and audited web security.
            </p>
          </div>
        </div>
      </div>
      
      <PortfolioSection portfolioData={portfolioData} showAll={true} hideHeader={true} />
      <TestimonialsSection testimonialsData={testimonialsData} />
    </>
  );
}


