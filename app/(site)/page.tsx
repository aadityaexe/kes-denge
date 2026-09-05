import type { Metadata } from "next";
import {
  getServicesData,
  getProductsData,
  getPortfolioData,
  getClientsData,
  getTestimonialsData,
  getTeamData,
  getPricingData,
  getFAQsData,
  getSettingsData,
} from "@/lib/db-helpers";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustedBySection } from "@/components/sections/TrustedBySection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsData();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";
  const titleText = "MARK Technologies — We Build Digital Products That Scale";
  const descText =
    settings?.seo?.defaultDescription ||
    settings?.description ||
    "A premier product-engineering agency that ships high-throughput web apps, mobile applications, enterprise ERP platforms, and AI automation for fast-growing businesses.";

  return {
    title: {
      absolute: titleText,
    },
    description: descText,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: titleText,
      description: descText,
      url: siteUrl,
      siteName: "MARK Technologies",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: settings?.seo?.ogImageUrl || `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: titleText,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: [settings?.seo?.ogImageUrl || `${siteUrl}/twitter-image`],
    },
  };
}

export default async function HomePage() {
  const [
    servicesData,
    productsData,
    portfolioData,
    clientsData,
    testimonialsData,
    teamData,
    pricingData,
    faqsData,
    settingsData,
  ] = await Promise.all([
    getServicesData(),
    getProductsData(),
    getPortfolioData(),
    getClientsData(),
    getTestimonialsData(),
    getTeamData(),
    getPricingData(),
    getFAQsData(),
    getSettingsData(),
  ]);

  return (
    <>
      <HeroSection settingsData={settingsData} />
      <TrustedBySection clientsData={clientsData} />
      <ServicesSection servicesData={servicesData} />
      <ProductsSection productsData={productsData} />
      <WhyChooseUsSection items={settingsData?.whyChooseUs} />
      <ProcessSection steps={settingsData?.processSteps} />
      <PortfolioSection portfolioData={portfolioData} />
      <TestimonialsSection testimonialsData={testimonialsData} />
      <TeamSection teamData={teamData} />
      <TechStackSection technologies={settingsData?.technologies} />
      <PricingSection pricingData={pricingData} />
      <FAQSection faqsData={faqsData} />
      <ContactSection settingsData={settingsData} />
    </>
  );
}
