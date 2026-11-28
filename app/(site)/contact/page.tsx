import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { getSettingsData } from "@/lib/db-helpers";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, SEO_CONFIG } from "@/lib/seo";

const siteUrl = SEO_CONFIG.siteUrl;

export const metadata: Metadata = buildPageMetadata({
  title: "Contact MARK2 — Start Your Software Project",
  description:
    "Get in touch with MARK2's engineering team to start your custom web app, mobile app, enterprise ERP, or AI automation project. Based in India, serving clients worldwide.",
  ogDescription:
    "Get in touch with our engineering team to discuss your web app, mobile app, or enterprise platform requirements.",
  ogAlt: "Contact MARK2",
  path: "/contact",
});

export const revalidate = 3600;

export default async function ContactPage() {
  const settingsData = await getSettingsData();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Contact", url: `${siteUrl}/contact` },
  ]);

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact MARK2",
    description: "Inquire about new software engineering, web application, mobile app, and ERP projects.",
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "MARK2",
      url: siteUrl,
      email: settingsData?.contactEmail || "hello@mark2.in",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales and engineering inquiry",
        email: settingsData?.contactEmail || "hello@mark2.in",
      },
    },
  };

  return (
    <div className="pt-20 sm:pt-24 md:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(contactPageSchema) }}
      />
      <ContactSection settingsData={settingsData} headingTag="h1" />
    </div>
  );
}
