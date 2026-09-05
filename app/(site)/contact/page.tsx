import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { getSettingsData } from "@/lib/db-helpers";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Contact Us — Start a Project",
  description: "Get in touch with our engineering team to start your next web app, mobile app, or enterprise platform.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us — Start a Project | MARK Technologies",
    description: "Get in touch with our engineering team to start your next web app, mobile app, or enterprise platform.",
    url: `${siteUrl}/contact`,
    siteName: "MARK Technologies",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Contact Us — MARK Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us — Start a Project | MARK Technologies",
    description: "Get in touch with our engineering team to start your next web app, mobile app, or enterprise platform.",
    images: [`${siteUrl}/twitter-image`],
  },
};

export const revalidate = 3600;

export default async function ContactPage() {
  const settingsData = await getSettingsData();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${siteUrl}/contact` },
    ],
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact MARK Technologies",
    description: "Inquire about new software engineering, web application, mobile app, and ERP projects.",
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "MARK Technologies",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactSection settingsData={settingsData} headingTag="h1" />
    </div>
  );
}

