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
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Pricing & Investment | MARK Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Transparent Pricing & Investment | MARK Technologies",
    description: "Transparent pricing models for our engineering services, dedicated teams, and ready platforms.",
    images: [`${siteUrl}/twitter-image`],
  },
};

export const revalidate = 3600;

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

  const pricingOffersSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MARK Technologies Engineering Pricing Tiers",
    itemListElement: (pricingData || []).map((tier: any, idx: number) => {
      const rawPrice = String(tier.price || "").replace(/[^0-9]/g, "");
      const numericPrice = rawPrice ? parseInt(rawPrice, 10) : 0;
      return {
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Product",
          name: `MARK Technologies ${tier.name} Package`,
          description: tier.description || `MARK Technologies ${tier.name} engineering tier.`,
          offers: {
            "@type": "Offer",
            price: numericPrice > 0 ? numericPrice : "25000",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/pricing`,
          },
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingOffersSchema) }}
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
          <div className="max-w-3xl mx-auto mt-6 text-center">
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
              MARK Technologies offers transparent engineering pricing in Indian Rupees (INR). Our Starter website package begins at ₹25,000 for standard 5-page custom-coded web architectures. Growth packages start at ₹75,000 for complex SaaS applications and mobile platforms, and Enterprise retainers are tailored for high-throughput ERP systems and dedicated engineering pods.
            </p>
          </div>
        </div>
      </div>
      
      <PricingSection pricingData={pricingData} hideHeader={true} />
      <FAQSection faqsData={faqsData} />
    </>
  );
}

