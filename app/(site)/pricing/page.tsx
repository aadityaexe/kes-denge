import type { Metadata } from "next";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import { getPricingData, getFAQsData } from "@/lib/db-helpers";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Transparent Pricing & Investment",
  description: "Transparent pricing models for our engineering services, dedicated teams, and ready platforms.",
  alternates: {
    canonical: `${siteUrl}/pricing`,
  },
  openGraph: {
    title: "Transparent Pricing & Investment | MARK Technologies",
    description: "Transparent pricing models for our engineering services, dedicated teams, and ready platforms.",
    url: `${siteUrl}/pricing`,
    siteName: "MARK Technologies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Transparent Pricing & Investment | MARK Technologies",
    description: "Transparent pricing models for our engineering services, dedicated teams, and ready platforms.",
  },
};

export default async function PricingPage() {
  const [pricingData, faqsData] = await Promise.all([
    getPricingData(),
    getFAQsData(),
  ]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Pricing", item: `${siteUrl}/pricing` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-8 md:pb-12 relative overflow-hidden">
        {/* Background Parallax Orb */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax speed={0.8} className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]" />
        </div>
        <div className="container-site relative z-10">
          <SectionHeading
            as="h1"
            title="Invest in scalable engineering."
            subtitle="Clear, predictable pricing without the dreaded scope creep."
            badge="Plans & Pricing"
            align="center"
          />
        </div>
      </div>
      
      <PricingSection pricingData={pricingData} hideHeader={true} />
      <FAQSection faqsData={faqsData} />
    </>
  );
}

