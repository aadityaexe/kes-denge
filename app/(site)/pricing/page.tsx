import type { Metadata } from "next";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { PageHero } from "@/components/layout/PageHero";
import { getPricingData, getFAQsData } from "@/lib/db-helpers";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Software Development Pricing & Investment Plans",
  description: "Transparent software development pricing in INR. Starter websites from ₹25,000, custom SaaS & mobile app packages from ₹75,000, and enterprise ERP retainers tailored to your business scale.",
  keywords: [
    "software development cost India",
    "custom software pricing INR",
    "web development cost India",
    "ERP development pricing",
    "app development cost India",
  ],
  alternates: {
    canonical: `${siteUrl}/pricing`,
  },
  openGraph: {
    title: "Software Development Pricing",
    description: "Transparent pricing for custom software, web apps, mobile apps, and enterprise ERP development. Starting from ₹25,000.",
    url: `${siteUrl}/pricing`,
    siteName: "MARK 2",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Software Development Pricing — MARK 2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development Pricing",
    description: "Transparent pricing for custom software, web apps, mobile apps, and enterprise ERP development. Starting from ₹25,000.",
    images: [`${siteUrl}/twitter-image`],
  },
};

export const revalidate = 3600;

export default async function PricingPage() {
  const [pricingData, faqsData] = await Promise.all([
    getPricingData(),
    getFAQsData(),
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Pricing", url: `${siteUrl}/pricing` },
  ]);

  const pricingOffersSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MARK 2 Engineering Pricing Tiers",
    itemListElement: (pricingData || []).map((tier: any, idx: number) => {
      const rawPrice = String(tier.price || "").replace(/[^0-9]/g, "");
      const numericPrice = rawPrice ? parseInt(rawPrice, 10) : 0;
      return {
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Product",
          name: `MARK 2 ${tier.name} Package`,
          description: tier.description || `MARK 2 ${tier.name} engineering tier.`,
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(pricingOffersSchema) }}
      />
      <PageHero
        badge="Plans & Pricing"
        title="Invest in scalable engineering."
        subtitle="Clear, predictable pricing without the dreaded scope creep."
        lead="MARK 2 offers transparent engineering pricing in Indian Rupees (INR). Our Starter website package begins at ₹25,000 for standard 5-page custom-coded web architectures. Growth packages start at ₹75,000 for complex SaaS applications and mobile platforms, and Enterprise retainers are tailored for high-throughput ERP systems and dedicated engineering pods."
      />

      <PricingSection pricingData={pricingData} hideHeader={true} />
      <FAQSection faqsData={faqsData} />
    </>
  );
}
