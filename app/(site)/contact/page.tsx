import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { getSettingsData } from "@/lib/db-helpers";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Contact MARK 2 — Start Your Software Project",
  description: "Get in touch with MARK 2' engineering team to start your custom web app, mobile app, enterprise ERP, or AI automation project. Based in India, serving clients worldwide.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact MARK 2 — Start Your Software Project",
    description: "Get in touch with our engineering team to discuss your web app, mobile app, or enterprise platform requirements.",
    url: `${siteUrl}/contact`,
    siteName: "MARK 2",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Contact MARK 2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact MARK 2 — Start Your Software Project",
    description: "Get in touch with our engineering team to discuss your web app, mobile app, or enterprise platform requirements.",
    images: [`${siteUrl}/twitter-image`],
  },
};

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
    name: "Contact MARK 2",
    description: "Inquire about new software engineering, web application, mobile app, and ERP projects.",
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "MARK 2",
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
