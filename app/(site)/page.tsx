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
import { safeJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, SEO_CONFIG } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsData();
  const titleText = SEO_CONFIG.defaultTitle;
  const descText =
    settings?.seo?.defaultDescription ||
    settings?.description ||
    SEO_CONFIG.defaultDescription;

  return buildPageMetadata({
    title: titleText,
    description: descText,
    path: "/",
    absoluteTitle: true,
    ogImage: settings?.seo?.ogImageUrl || undefined,
    ogAlt: titleText,
  });
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

  const siteUrl = SEO_CONFIG.siteUrl;
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SEO_CONFIG.siteName,
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#organization` },
  };
  
  // Massive Dynamic JSON-LD Graph for AI/Search Systems
  const dynamicOrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    "name": "MARK2",
    "url": siteUrl,
    "description": settingsData?.description || "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation.",
    "logo": `${siteUrl}/logo/logo.png`,
    "sameAs": [
      settingsData?.socialLinks?.twitter,
      settingsData?.socialLinks?.linkedin,
      settingsData?.socialLinks?.github,
      settingsData?.socialLinks?.instagram,
    ].filter(Boolean),
    "contactPoint": {
      "@type": "ContactPoint",
      "email": settingsData?.contactEmail || "hello@mark2.in",
      "contactType": "customer support"
    },
    // Dynamically list team members (Founders / Employees)
    "employee": teamData.map((member: any) => ({
      "@type": "Person",
      "name": member.name,
      "jobTitle": member.role,
      ...(member.linkedin ? { "sameAs": member.linkedin } : {})
    })),
    // Dynamically list services offered
    "makesOffer": servicesData.map((service: any) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service.title,
        "description": service.shortDescription || service.description,
        "url": `${siteUrl}/services/${service.slug}`
      }
    })),
    // Dynamically list products owned
    "brand": productsData.map((product: any) => ({
      "@type": "Brand",
      "name": product.title,
      "description": product.shortDescription,
      "url": `${siteUrl}/products/${product.slug}`
    })),
    // Dynamically list clients as sponsors or customers (schema.org/sponsor)
    "sponsor": clientsData.map((client: any) => ({
      "@type": "Organization",
      "name": client.name,
      "description": client.tagline || client.description,
      ...(client.website ? { "url": client.website } : {})
    })),
    // Dynamically list projects/case studies
    "subjectOf": portfolioData.map((project: any) => ({
      "@type": "CreativeWork",
      "name": project.title,
      "description": project.oneLiner || project.shortDescription,
      "url": `${siteUrl}/portfolio/${project.slug}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(dynamicOrganizationSchema) }}
      />
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
