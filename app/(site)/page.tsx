import type { Metadata } from "next";
import {
  getServicesData,
  getProductsData,
  getPortfolioData,
  getClientsData,
  getTestimonialsData,
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
import { TechStackSection } from "@/components/sections/TechStackSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsData();
  return {
    title: settings?.seo?.defaultTitle || "MARK Technologies — We Build Digital Products That Scale",
    description: settings?.seo?.defaultDescription || settings?.description,
  };
}

export default async function HomePage() {
  const [
    servicesData,
    productsData,
    portfolioData,
    clientsData,
    testimonialsData,
    pricingData,
    faqsData,
    settingsData,
  ] = await Promise.all([
    getServicesData(),
    getProductsData(),
    getPortfolioData(),
    getClientsData(),
    getTestimonialsData(),
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
      <TechStackSection technologies={settingsData?.technologies} />
      <PricingSection pricingData={pricingData} />
      <FAQSection faqsData={faqsData} />
      <ContactSection settingsData={settingsData} />
    </>
  );
}
